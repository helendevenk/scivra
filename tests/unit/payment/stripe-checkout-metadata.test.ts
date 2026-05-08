import type Stripe from 'stripe';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

const stripeMocks = vi.hoisted(() => ({
  createFetchHttpClient: vi.fn(() => ({})),
}));

vi.mock('stripe', () => {
  class MockStripe {
    static createFetchHttpClient = stripeMocks.createFetchHttpClient;

    customers = {
      list: vi.fn(),
      create: vi.fn(),
    };

    checkout = {
      sessions: {
        create: vi.fn(),
      },
    };
  }

  return {
    default: MockStripe,
  };
});

import { StripeProvider } from '@/extensions/payment/stripe';
import {
  PaymentInterval,
  type PaymentOrder,
  PaymentType,
} from '@/extensions/payment/types';

function createProvider() {
  return new StripeProvider({
    secretKey: 'sk_test',
    publishableKey: 'pk_test',
    signingSecret: 'whsec_test',
  });
}

function stubCheckoutSessionCreate(provider: StripeProvider) {
  const client = (provider as any).client;
  client.checkout.sessions.create = vi.fn().mockResolvedValue({
    id: 'cs_test',
    url: 'https://checkout.stripe.com/c/pay/cs_test',
  });

  return client as {
    checkout: {
      sessions: {
        create: Mock;
      };
    };
  };
}

async function captureCheckoutSessionParams(order: PaymentOrder) {
  const provider = createProvider();
  const client = stubCheckoutSessionCreate(provider);

  await provider.createPayment({ order });

  return client.checkout.sessions.create.mock
    .calls[0][0] as Stripe.Checkout.SessionCreateParams;
}

describe('StripeProvider checkout metadata propagation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createPayment ONE_TIME propagates order.metadata to payment_intent_data', async () => {
    const capturedParams = await captureCheckoutSessionParams({
      type: PaymentType.ONE_TIME,
      price: {
        currency: 'usd',
        amount: 1000,
      },
      description: 'One-time checkout',
      metadata: {
        order_no: 'ORD_001',
      },
    });

    expect(capturedParams.metadata?.order_no).toBe('ORD_001');
    expect(capturedParams.payment_intent_data?.metadata?.order_no).toBe(
      'ORD_001'
    );
    expect(capturedParams).not.toHaveProperty('subscription_data');
  });

  it('createPayment SUBSCRIPTION propagates order.metadata to subscription_data', async () => {
    const plan = {
      name: 'Monthly plan',
      interval: PaymentInterval.MONTH,
      productId: 'prod_test',
    };

    const capturedParams = await captureCheckoutSessionParams({
      type: PaymentType.SUBSCRIPTION,
      price: {
        currency: 'usd',
        amount: 2000,
      },
      description: 'Subscription checkout',
      metadata: {
        order_no: 'ORD_002',
      },
      plan,
    });

    expect(capturedParams.metadata?.order_no).toBe('ORD_002');
    expect(capturedParams.subscription_data?.metadata?.order_no).toBe(
      'ORD_002'
    );
    expect(capturedParams).not.toHaveProperty('payment_intent_data');
  });
});
