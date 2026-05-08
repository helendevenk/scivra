import type Stripe from 'stripe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const stripeMocks = vi.hoisted(() => ({
  createFetchHttpClient: vi.fn(() => ({})),
  paymentIntentsRetrieve: vi.fn(),
  invoicesRetrieve: vi.fn(),
}));

vi.mock('stripe', () => {
  class MockStripe {
    static createFetchHttpClient = stripeMocks.createFetchHttpClient;

    paymentIntents = {
      retrieve: stripeMocks.paymentIntentsRetrieve,
    };

    invoices = {
      retrieve: stripeMocks.invoicesRetrieve,
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

function createCharge(overrides: RefundChargeOverrides): Stripe.Charge {
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

  it('path 1: charge.metadata.order_no resolved', async () => {
    const provider = createProvider();
    const charge = createCharge({
      metadata: { order_no: 'ORD_PI_123' },
      payment_intent: 'pi_test',
    });

    const session = await buildPaymentSessionFromCharge(provider, charge);

    expect(session.metadata?.order_no_from_pi).toBe('ORD_PI_123');
    expect(stripeMocks.paymentIntentsRetrieve).not.toHaveBeenCalled();
  });

  it('path 2: payment_intent.metadata.order_no resolved', async () => {
    const provider = createProvider();
    const charge = createCharge({
      metadata: {},
      payment_intent: 'pi_test',
    });
    stripeMocks.paymentIntentsRetrieve.mockResolvedValue({
      metadata: { order_no: 'ORD_PI_456' },
    });

    const session = await buildPaymentSessionFromCharge(provider, charge);

    expect(session.metadata?.order_no_from_pi).toBe('ORD_PI_456');
  });

  it('path 3: invoice + subscription metadata', async () => {
    const provider = createProvider();
    const charge = createCharge({
      invoice: 'in_test',
    });
    stripeMocks.invoicesRetrieve.mockResolvedValue({
      id: 'in_test',
      subscription: {
        id: 'sub_test',
        metadata: { order_no: 'ORD_FIRST' },
      },
    });

    const session = await buildPaymentSessionFromCharge(provider, charge);

    expect(session.metadata?.invoice_id).toBe('in_test');
    expect(session.metadata?.subscription_id).toBe('sub_test');
    expect(session.metadata?.order_no_from_sub).toBe('ORD_FIRST');
  });
});
