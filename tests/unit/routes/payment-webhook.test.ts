import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  PaymentEventType,
  SubscriptionCycleType,
} from '@/extensions/payment/types';

// --- Mocks ---

const mockGetProvider = vi.fn();
const mockGetPaymentService = vi.fn().mockResolvedValue({
  getProvider: mockGetProvider,
});

vi.mock('@/shared/services/payment', () => ({
  getPaymentService: (...args: unknown[]) => mockGetPaymentService(...args),
  handleCheckoutSuccess: vi.fn().mockResolvedValue(undefined),
  handleSubscriptionRenewal: vi.fn().mockResolvedValue(undefined),
  handleSubscriptionUpdated: vi.fn().mockResolvedValue(undefined),
  handleSubscriptionCanceled: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/shared/models/order', () => ({
  findOrderByOrderNo: vi.fn(),
}));

vi.mock('@/shared/models/subscription', () => ({
  findSubscriptionByProviderSubscriptionId: vi.fn(),
}));

// Re-import after mock setup
import { POST } from '@/app/api/payment/notify/[provider]/route';
import {
  handleCheckoutSuccess,
  handleSubscriptionRenewal,
  handleSubscriptionUpdated,
  handleSubscriptionCanceled,
} from '@/shared/services/payment';
import { findOrderByOrderNo } from '@/shared/models/order';
import { findSubscriptionByProviderSubscriptionId } from '@/shared/models/subscription';

// --- Helpers ---

function makeRequest(body: Record<string, unknown> = {}) {
  return new Request('http://localhost/api/payment/notify/stripe', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function makeParams(provider: string) {
  return { params: Promise.resolve({ provider }) };
}

function makePaymentSession(overrides: Record<string, unknown> = {}) {
  return {
    provider: 'stripe',
    metadata: { order_no: 'ORD-001' },
    ...overrides,
  };
}

function makeProviderMock(
  eventType: PaymentEventType,
  session: Record<string, unknown>
) {
  return {
    getPaymentEvent: vi.fn().mockResolvedValue({
      eventType,
      paymentSession: session,
    }),
  };
}

// --- Tests ---

describe('POST /api/payment/notify/[provider]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle valid Stripe checkout success event', async () => {
    const session = makePaymentSession();
    const provider = makeProviderMock(
      PaymentEventType.CHECKOUT_SUCCESS,
      session
    );
    mockGetProvider.mockReturnValue(provider);
    vi.mocked(findOrderByOrderNo).mockResolvedValue({
      id: '1',
      orderNo: 'ORD-001',
    } as never);

    const res = await POST(makeRequest(), makeParams('stripe'));
    const json = await res.json();

    expect(json.message).toBe('success');
    expect(handleCheckoutSuccess).toHaveBeenCalledWith({
      order: expect.objectContaining({ orderNo: 'ORD-001' }),
      session,
    });
  });

  it('should handle valid PayPal checkout success event', async () => {
    const session = makePaymentSession();
    const provider = makeProviderMock(
      PaymentEventType.CHECKOUT_SUCCESS,
      session
    );
    mockGetProvider.mockReturnValue(provider);
    vi.mocked(findOrderByOrderNo).mockResolvedValue({
      id: '2',
      orderNo: 'ORD-001',
    } as never);

    const res = await POST(makeRequest(), makeParams('paypal'));
    const json = await res.json();

    expect(json.message).toBe('success');
    expect(mockGetProvider).toHaveBeenCalledWith('paypal');
  });

  // Error code policy after Bug 6 fix:
  //   - Unknown event (provider returns null) → 200 ignored (silent skip)
  //   - Signature failure (PaymentSignatureError) → 400 (Stripe stops retry)
  //   - Business / unknown error → 500 (Stripe retries; idempotent via DB UNIQUEs)
  it('should return 500 when payment provider is not registered', async () => {
    mockGetProvider.mockReturnValue(null);

    const res = await POST(makeRequest(), makeParams('unknown'));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.code).toBe(-1);
  });

  it('should return 200 ignored when getPaymentEvent returns null (unknown event)', async () => {
    const provider = {
      getPaymentEvent: vi.fn().mockResolvedValue(null),
    };
    mockGetProvider.mockReturnValue(provider);

    const res = await POST(makeRequest(), makeParams('stripe'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.code).toBe(0);
    expect(json.message).toBe('ignored');
  });

  it('should return 500 when order is not found for checkout event', async () => {
    const session = makePaymentSession();
    const provider = makeProviderMock(
      PaymentEventType.CHECKOUT_SUCCESS,
      session
    );
    mockGetProvider.mockReturnValue(provider);
    vi.mocked(findOrderByOrderNo).mockResolvedValue(null as never);

    const res = await POST(makeRequest(), makeParams('stripe'));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.code).toBe(-1);
  });

  it('should handle subscription renewal payment', async () => {
    const session = makePaymentSession({
      subscriptionId: 'sub_123',
      subscriptionInfo: { subscriptionId: 'sub_123' },
      paymentInfo: {
        subscriptionCycleType: SubscriptionCycleType.RENEWAL,
        paymentAmount: 499,
        paymentCurrency: 'usd',
      },
    });
    const provider = makeProviderMock(
      PaymentEventType.PAYMENT_SUCCESS,
      session
    );
    mockGetProvider.mockReturnValue(provider);
    vi.mocked(findSubscriptionByProviderSubscriptionId).mockResolvedValue({
      id: 'sub-db-1',
    } as never);

    const res = await POST(makeRequest(), makeParams('stripe'));
    const json = await res.json();

    expect(json.message).toBe('success');
    expect(handleSubscriptionRenewal).toHaveBeenCalledWith({
      subscription: expect.objectContaining({ id: 'sub-db-1' }),
      session,
    });
  });

  it('should handle subscription canceled event', async () => {
    const session = makePaymentSession({
      subscriptionId: 'sub_456',
      subscriptionInfo: { subscriptionId: 'sub_456' },
    });
    const provider = makeProviderMock(
      PaymentEventType.SUBSCRIBE_CANCELED,
      session
    );
    mockGetProvider.mockReturnValue(provider);
    vi.mocked(findSubscriptionByProviderSubscriptionId).mockResolvedValue({
      id: 'sub-db-2',
    } as never);

    const res = await POST(makeRequest(), makeParams('stripe'));
    const json = await res.json();

    expect(json.message).toBe('success');
    expect(handleSubscriptionCanceled).toHaveBeenCalledWith({
      subscription: expect.objectContaining({ id: 'sub-db-2' }),
      session,
    });
  });

  it('should handle subscription updated event', async () => {
    const session = makePaymentSession({
      subscriptionId: 'sub_789',
      subscriptionInfo: { subscriptionId: 'sub_789' },
    });
    const provider = makeProviderMock(
      PaymentEventType.SUBSCRIBE_UPDATED,
      session
    );
    mockGetProvider.mockReturnValue(provider);
    vi.mocked(findSubscriptionByProviderSubscriptionId).mockResolvedValue({
      id: 'sub-db-3',
    } as never);

    const res = await POST(makeRequest(), makeParams('stripe'));
    const json = await res.json();

    expect(json.message).toBe('success');
    expect(handleSubscriptionUpdated).toHaveBeenCalledWith({
      subscription: expect.objectContaining({ id: 'sub-db-3' }),
      session,
    });
  });

  it('should return 500 when downstream handler throws (Stripe will retry)', async () => {
    const session = makePaymentSession();
    const provider = makeProviderMock(
      PaymentEventType.CHECKOUT_SUCCESS,
      session
    );
    mockGetProvider.mockReturnValue(provider);
    vi.mocked(findOrderByOrderNo).mockResolvedValue({
      id: '1',
      orderNo: 'ORD-001',
    } as never);
    vi.mocked(handleCheckoutSuccess).mockRejectedValue(
      new Error('DB connection failed')
    );

    const res = await POST(makeRequest(), makeParams('stripe'));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.code).toBe(-1);
    // Generic message, not the raw error string — keeps internals out of
    // the webhook response while Sentry context captures the detail.
    expect(json.message).toBe('internal error');
  });

  it('should return 400 when stripe webhook signature verification fails', async () => {
    const { PaymentSignatureError } = await import(
      '@/extensions/payment/types'
    );
    const provider = {
      getPaymentEvent: vi
        .fn()
        .mockRejectedValue(new PaymentSignatureError('bad sig')),
    };
    mockGetProvider.mockReturnValue(provider);

    const res = await POST(makeRequest(), makeParams('stripe'));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.code).toBe(-1);
    expect(json.message).toBe('invalid signature');
  });

  it('should succeed idempotently for duplicate checkout events', async () => {
    const session = makePaymentSession();
    const provider = makeProviderMock(
      PaymentEventType.CHECKOUT_SUCCESS,
      session
    );
    mockGetProvider.mockReturnValue(provider);
    vi.mocked(findOrderByOrderNo).mockResolvedValue({
      id: '1',
      orderNo: 'ORD-001',
    } as never);
    vi.mocked(handleCheckoutSuccess).mockResolvedValue(undefined);

    const res1 = await POST(makeRequest(), makeParams('stripe'));
    const res2 = await POST(makeRequest(), makeParams('stripe'));

    expect((await res1.json()).message).toBe('success');
    expect((await res2.json()).message).toBe('success');
    expect(handleCheckoutSuccess).toHaveBeenCalledTimes(2);
  });
});
