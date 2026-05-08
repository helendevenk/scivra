import type Stripe from 'stripe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const stripeMocks = vi.hoisted(() => ({
  createFetchHttpClient: vi.fn(() => ({})),
  chargesRetrieve: vi.fn(),
  subscriptionsList: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock('stripe', () => {
  class MockStripe {
    static createFetchHttpClient = stripeMocks.createFetchHttpClient;

    charges = {
      retrieve: stripeMocks.chargesRetrieve,
    };

    subscriptions = {
      list: stripeMocks.subscriptionsList,
    };
  }

  return {
    default: MockStripe,
  };
});

import { StripeProvider } from '@/extensions/payment/stripe';
import type { PaymentSession } from '@/extensions/payment/types';

function createProvider() {
  return new StripeProvider({
    secretKey: 'sk_test',
    publishableKey: 'pk_test',
    signingSecret: 'whsec_test',
  });
}

type RefundChargeOverrides = Partial<Stripe.Charge> & {
  invoice?: string | Stripe.Invoice | null;
};

function createCharge(overrides: RefundChargeOverrides = {}): Stripe.Charge {
  return {
    id: 'ch_test',
    amount: 1000,
    amount_refunded: 1000,
    billing_details: {
      email: 'test@example.com',
      name: 'Test User',
    },
    currency: 'usd',
    customer: 'cus_test',
    invoice: null,
    metadata: {},
    payment_intent: null,
    ...overrides,
  } as Stripe.Charge;
}

async function buildPaymentSessionFromCharge(
  provider: StripeProvider,
  charge: Stripe.Charge
) {
  return (provider as any).buildPaymentSessionFromCharge(
    charge
  ) as Promise<PaymentSession>;
}

describe('StripeProvider refund session builder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('path 1: charge.metadata.order_no resolved (one-time)', async () => {
    const provider = createProvider();
    const inputCharge = createCharge({
      metadata: { order_no: 'ORD_PI_123' },
      payment_intent: 'pi_test',
    });
    stripeMocks.chargesRetrieve.mockResolvedValue(
      createCharge({
        metadata: { order_no: 'ORD_PI_123' },
        payment_intent: { id: 'pi_test', metadata: {} } as unknown as Stripe.PaymentIntent,
      })
    );

    const session = await buildPaymentSessionFromCharge(provider, inputCharge);

    expect(session.metadata?.order_no_from_pi).toBe('ORD_PI_123');
    expect(stripeMocks.chargesRetrieve).toHaveBeenCalledWith('ch_test', {
      expand: ['payment_intent', 'invoice.subscription'],
    });
  });

  it('path 2: payment_intent.metadata.order_no resolved (one-time, charge.metadata empty)', async () => {
    const provider = createProvider();
    const inputCharge = createCharge({
      metadata: {},
      payment_intent: 'pi_test',
    });
    stripeMocks.chargesRetrieve.mockResolvedValue(
      createCharge({
        metadata: {},
        payment_intent: {
          id: 'pi_test',
          metadata: { order_no: 'ORD_PI_456' },
        } as unknown as Stripe.PaymentIntent,
      })
    );

    const session = await buildPaymentSessionFromCharge(provider, inputCharge);

    expect(session.metadata?.order_no_from_pi).toBe('ORD_PI_456');
  });

  it('path 3: invoice + subscription metadata resolved (subscription first-charge refund)', async () => {
    const provider = createProvider();
    const inputCharge = createCharge({
      payment_intent: 'pi_test',
    });
    // Webhook payload omits invoice; expand restores it.
    stripeMocks.chargesRetrieve.mockResolvedValue(
      createCharge({
        metadata: {},
        payment_intent: {
          id: 'pi_test',
          metadata: {},
        } as unknown as Stripe.PaymentIntent,
        invoice: {
          id: 'in_test',
          subscription: {
            id: 'sub_test',
            metadata: { order_no: 'ORD_FIRST' },
          },
        } as unknown as Stripe.Invoice,
      })
    );

    const session = await buildPaymentSessionFromCharge(provider, inputCharge);

    expect(session.metadata?.invoice_id).toBe('in_test');
    expect(session.metadata?.subscription_id).toBe('sub_test');
    expect(session.metadata?.order_no_from_sub).toBe('ORD_FIRST');
  });

  it('path 3 renewal: invoice.id surfaced even when subscription expansion missing', async () => {
    const provider = createProvider();
    const inputCharge = createCharge({});
    // Renewal: invoice present, subscription is bare string (Stripe API quirk).
    stripeMocks.chargesRetrieve.mockResolvedValue(
      createCharge({
        invoice: {
          id: 'in_renewal_001',
          subscription: 'sub_test',
        } as unknown as Stripe.Invoice,
      })
    );

    const session = await buildPaymentSessionFromCharge(provider, inputCharge);

    expect(session.metadata?.invoice_id).toBe('in_renewal_001');
    expect(session.metadata?.subscription_id).toBe('sub_test');
    expect(session.metadata?.order_no_from_sub).toBeUndefined();
  });

  it('path 4: customer -> subscriptions list when invoice/PI are not exposed (Stripe API 2025-08-27.basil)', async () => {
    // Real-world bug from D.3 smoke: Stripe stopped exposing charge.invoice
    // and PaymentIntent.invoice in newer API versions. Subscription refunds
    // fall through to listing subs by customer.
    const provider = createProvider();
    const inputCharge = createCharge({ customer: 'cus_test' });
    stripeMocks.chargesRetrieve.mockResolvedValue(
      createCharge({
        metadata: {},
        payment_intent: { id: 'pi_test', metadata: {} } as unknown as Stripe.PaymentIntent,
        invoice: null,
        customer: 'cus_test',
      })
    );
    stripeMocks.subscriptionsList.mockResolvedValueOnce({
      data: [
        {
          id: 'sub_canceled',
          metadata: { order_no: 'ORD_FROM_CUSTOMER_LOOKUP' },
        },
        {
          id: 'sub_other',
          metadata: { order_no: 'ORD_OTHER' },
        },
      ],
    });

    const session = await buildPaymentSessionFromCharge(provider, inputCharge);

    expect(session.metadata?.order_no_from_sub).toBe('ORD_FROM_CUSTOMER_LOOKUP');
    expect(session.metadata?.subscription_id).toBe('sub_canceled');
    expect(stripeMocks.subscriptionsList).toHaveBeenCalledWith({
      customer: 'cus_test',
      status: 'all',
      limit: 5,
    });
  });

  it('all paths empty: every candidate is undefined (forces webhook route to alert)', async () => {
    const provider = createProvider();
    const inputCharge = createCharge({});
    stripeMocks.chargesRetrieve.mockResolvedValue(createCharge({}));
    stripeMocks.subscriptionsList.mockResolvedValueOnce({ data: [] });

    const session = await buildPaymentSessionFromCharge(provider, inputCharge);

    expect(session.metadata?.order_no_from_pi).toBeUndefined();
    expect(session.metadata?.invoice_id).toBeUndefined();
    expect(session.metadata?.subscription_id).toBeUndefined();
    expect(session.metadata?.order_no_from_sub).toBeUndefined();
  });
});
