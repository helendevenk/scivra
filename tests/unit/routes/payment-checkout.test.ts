import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  createOrder: vi.fn(),
  updateOrderByOrderNo: vi.fn(),
  getAllConfigs: vi.fn(),
  getTranslations: vi.fn(),
  getUserInfo: vi.fn(),
  getPaymentService: vi.fn(),
  createPayment: vi.fn(),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: (...args: unknown[]) => mocks.getTranslations(...args),
}));

vi.mock('@/shared/models/config', () => ({
  getAllConfigs: (...args: unknown[]) => mocks.getAllConfigs(...args),
}));

vi.mock('@/shared/models/order', () => ({
  createOrder: (...args: unknown[]) => mocks.createOrder(...args),
  updateOrderByOrderNo: (...args: unknown[]) =>
    mocks.updateOrderByOrderNo(...args),
  OrderStatus: {
    PENDING: 'pending',
    CREATED: 'created',
    COMPLETED: 'completed',
    PAID: 'paid',
    FAILED: 'failed',
  },
}));

vi.mock('@/shared/models/user', () => ({
  getUserInfo: (...args: unknown[]) => mocks.getUserInfo(...args),
}));

vi.mock('@/shared/services/payment', () => ({
  getPaymentService: (...args: unknown[]) => mocks.getPaymentService(...args),
}));

import { POST } from '@/app/api/payment/checkout/route';

function makeCheckoutRequest() {
  return new Request('http://localhost/api/payment/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: 'pro_monthly',
      currency: 'usd',
      locale: 'en',
      payment_provider: 'stripe',
    }),
  });
}

function makePricing() {
  return {
    items: [
      {
        product_id: 'pro_monthly',
        product_name: 'Pro Monthly',
        description: 'Pro subscription',
        amount: 1900,
        currency: 'usd',
        interval: 'month',
        payment_product_id: 'price_123',
        payment_providers: ['stripe'],
        credits: 100,
        valid_days: 30,
        plan_name: 'Pro',
      },
    ],
  };
}

async function postCheckoutWithStripeKey(stripeSecretKey: string) {
  mocks.getAllConfigs.mockResolvedValue({
    app_name: 'Scivra',
    app_url: 'http://localhost',
    default_locale: 'en',
    default_payment_provider: 'stripe',
    stripe_secret_key: stripeSecretKey,
    stripe_checkout_mode: 'enabled',
  });
  mocks.getTranslations.mockResolvedValue({
    raw: vi.fn(() => makePricing()),
  });
  mocks.getUserInfo.mockResolvedValue({
    id: 'user-1',
    email: 'user@test.com',
    name: 'Test User',
  });
  mocks.createPayment.mockResolvedValue({
    provider: 'stripe',
    checkoutParams: {},
    checkoutResult: {},
    checkoutInfo: {
      checkoutUrl: 'https://checkout.stripe.test/session',
      sessionId: 'cs_test_123',
    },
  });
  mocks.getPaymentService.mockResolvedValue({
    getProvider: vi.fn(() => ({
      name: 'stripe',
      createPayment: mocks.createPayment,
    })),
  });

  await POST(makeCheckoutRequest());
}

function mockCheckoutDependencies({
  configs = {},
  user = {},
}: {
  configs?: Record<string, string>;
  user?: Record<string, string>;
}) {
  mocks.getAllConfigs.mockResolvedValue({
    app_name: 'Scivra',
    app_url: 'http://localhost',
    default_locale: 'en',
    default_payment_provider: 'stripe',
    stripe_secret_key: 'sk_live_123',
    ...configs,
  });
  mocks.getTranslations.mockResolvedValue({
    raw: vi.fn(() => makePricing()),
  });
  mocks.getUserInfo.mockResolvedValue({
    id: 'user-1',
    email: 'helendevenk@gmail.com',
    name: 'Test User',
    ...user,
  });
  mocks.createPayment.mockResolvedValue({
    provider: 'stripe',
    checkoutParams: {},
    checkoutResult: {},
    checkoutInfo: {
      checkoutUrl: 'https://checkout.stripe.test/session',
      sessionId: 'cs_test_123',
    },
  });
  mocks.getPaymentService.mockResolvedValue({
    getProvider: vi.fn(() => ({
      name: 'stripe',
      createPayment: mocks.createPayment,
    })),
  });
}

describe('POST /api/payment/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets live paymentMode when Stripe secret key is live', async () => {
    await postCheckoutWithStripeKey('sk_live_123');

    const order = mocks.createOrder.mock.calls[0][0] as Record<string, unknown>;
    expect(order.paymentMode).toBe('live');
  });

  it('sets test paymentMode when Stripe secret key is not live', async () => {
    await postCheckoutWithStripeKey('sk_test_123');

    const order = mocks.createOrder.mock.calls[0][0] as Record<string, unknown>;
    expect(order.paymentMode).toBe('test');
  });

  it('returns an error when Stripe checkout mode is disabled', async () => {
    mockCheckoutDependencies({
      configs: {
        stripe_checkout_mode: 'disabled',
      },
    });

    const response = await POST(makeCheckoutRequest());
    const json = await response.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe(
      'Checkout is temporarily disabled. Please try again later.'
    );
    expect(mocks.createOrder).not.toHaveBeenCalled();
    expect(mocks.createPayment).not.toHaveBeenCalled();
  });

  it('returns an error in smoke mode when user email is not allowlisted', async () => {
    mockCheckoutDependencies({
      configs: {
        stripe_checkout_mode: 'smoke',
        stripe_smoke_user_emails: 'other@example.com',
      },
    });

    const response = await POST(makeCheckoutRequest());
    const json = await response.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe(
      'Checkout is temporarily limited to smoke testers.'
    );
    expect(mocks.createOrder).not.toHaveBeenCalled();
    expect(mocks.createPayment).not.toHaveBeenCalled();
  });

  it('falls through in smoke mode when user email is allowlisted', async () => {
    mockCheckoutDependencies({
      configs: {
        stripe_checkout_mode: 'smoke',
        stripe_smoke_user_emails: 'helendevenk@gmail.com,foo@example.com',
      },
    });

    const response = await POST(makeCheckoutRequest());
    const json = await response.json();

    expect(json.code).toBe(0);
    expect(json.data.checkoutUrl).toBe('https://checkout.stripe.test/session');
    expect(mocks.createOrder).toHaveBeenCalledOnce();
    expect(mocks.createPayment).toHaveBeenCalledOnce();
  });
});
