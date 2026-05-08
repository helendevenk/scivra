import type Stripe from 'stripe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const stripeMocks = vi.hoisted(() => ({
  createFetchHttpClient: vi.fn(() => ({})),
  chargesRetrieve: vi.fn(),
  invoicePaymentsList: vi.fn().mockResolvedValue({ data: [] }),
  subscriptionsList: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock('stripe', () => {
  class MockStripe {
    static createFetchHttpClient = stripeMocks.createFetchHttpClient;

    charges = {
      retrieve: stripeMocks.chargesRetrieve,
    };

    invoicePayments = {
      list: stripeMocks.invoicePaymentsList,
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
    stripeMocks.invoicePaymentsList.mockResolvedValue({ data: [] });
    stripeMocks.subscriptionsList.mockResolvedValue({ data: [] });
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
    // path 4 should NOT run since orderNoFromPi already resolved
    expect(stripeMocks.subscriptionsList).not.toHaveBeenCalled();
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
    expect(stripeMocks.subscriptionsList).not.toHaveBeenCalled();
  });

  it('path 3: invoice expand surfaces invoice.id and subscription metadata (subscription first-charge)', async () => {
    const provider = createProvider();
    const inputCharge = createCharge({
      payment_intent: 'pi_test',
    });
    stripeMocks.chargesRetrieve.mockResolvedValue(
      createCharge({
        metadata: {},
        payment_intent: { id: 'pi_test', metadata: {} } as unknown as Stripe.PaymentIntent,
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

  it('path 5: invoicePayments.list resolves invoice.id when Stripe API drops invoice from charge/PI (renewal canonical key)', async () => {
    // Real-world bug from D.3 second smoke: Stripe API 2025-08-27.basil dropped
    // `invoice` from BOTH Charge and PaymentIntent. Path 5 must use
    // invoicePayments.list to recover invoice.id for renewal refunds.
    const provider = createProvider();
    const inputCharge = createCharge({
      payment_intent: 'pi_test',
      customer: 'cus_test',
    });
    stripeMocks.chargesRetrieve.mockResolvedValue(
      createCharge({
        metadata: {},
        payment_intent: { id: 'pi_test', metadata: {} } as unknown as Stripe.PaymentIntent,
        invoice: null,
        customer: 'cus_test',
      })
    );
    stripeMocks.invoicePaymentsList.mockResolvedValue({
      data: [{ invoice: 'in_renewal_999' }],
    });
    stripeMocks.subscriptionsList.mockResolvedValue({
      data: [
        {
          id: 'sub_active',
          metadata: { order_no: 'ORD_FIRST_OF_SUB' },
        },
      ],
    });

    const session = await buildPaymentSessionFromCharge(provider, inputCharge);

    expect(session.metadata?.invoice_id).toBe('in_renewal_999');
    expect(stripeMocks.invoicePaymentsList).toHaveBeenCalledWith({
      payment: { type: 'payment_intent', payment_intent: 'pi_test' },
      status: 'paid',
      limit: 2,
    });
    // path 4 ran (invoiceId guard satisfied) and surfaced sub metadata as
    // first-charge fallback — but webhook route prefers invoice_id (renewal
    // canonical key) over order_no_from_sub.
    expect(session.metadata?.order_no_from_sub).toBe('ORD_FIRST_OF_SUB');
    expect(session.metadata?.subscription_id).toBe('sub_active');
  });

  it('path 5 ambiguous: invoicePayments returns 2 matches → does not bind (safety)', async () => {
    const provider = createProvider();
    const inputCharge = createCharge({ payment_intent: 'pi_test' });
    stripeMocks.chargesRetrieve.mockResolvedValue(
      createCharge({
        metadata: {},
        payment_intent: { id: 'pi_test', metadata: {} } as unknown as Stripe.PaymentIntent,
        invoice: null,
      })
    );
    stripeMocks.invoicePaymentsList.mockResolvedValue({
      data: [{ invoice: 'in_a' }, { invoice: 'in_b' }],
    });

    const session = await buildPaymentSessionFromCharge(provider, inputCharge);

    expect(session.metadata?.invoice_id).toBeUndefined();
    // path 4 also blocked because invoiceId guard not satisfied
    expect(stripeMocks.subscriptionsList).not.toHaveBeenCalled();
  });

  it('path 4 guard: one-time charge with customer that has unrelated subs does NOT bind', async () => {
    // Codex review concern: legacy one-time charge from a customer who later
    // subscribed should NOT bind to that subscription's order_no.
    const provider = createProvider();
    const inputCharge = createCharge({
      payment_intent: 'pi_one_time',
      customer: 'cus_with_other_subs',
    });
    stripeMocks.chargesRetrieve.mockResolvedValue(
      createCharge({
        metadata: {}, // legacy: no metadata
        payment_intent: { id: 'pi_one_time', metadata: {} } as unknown as Stripe.PaymentIntent,
        invoice: null, // not a subscription charge
        customer: 'cus_with_other_subs',
      })
    );
    // invoicePayments empty = not a subscription charge
    stripeMocks.invoicePaymentsList.mockResolvedValue({ data: [] });
    stripeMocks.subscriptionsList.mockResolvedValue({
      data: [{ id: 'sub_unrelated', metadata: { order_no: 'ORD_UNRELATED' } }],
    });

    const session = await buildPaymentSessionFromCharge(provider, inputCharge);

    // Path 4 must NOT run because invoiceId guard is unset → no false binding
    expect(session.metadata?.order_no_from_sub).toBeUndefined();
    expect(stripeMocks.subscriptionsList).not.toHaveBeenCalled();
  });

  it('all paths empty (legacy one-time, no metadata, no invoice link): captures undefined to force webhook route alert', async () => {
    const provider = createProvider();
    const inputCharge = createCharge({});
    stripeMocks.chargesRetrieve.mockResolvedValue(createCharge({}));

    const session = await buildPaymentSessionFromCharge(provider, inputCharge);

    expect(session.metadata?.order_no_from_pi).toBeUndefined();
    expect(session.metadata?.invoice_id).toBeUndefined();
    expect(session.metadata?.subscription_id).toBeUndefined();
    expect(session.metadata?.order_no_from_sub).toBeUndefined();
  });
});
