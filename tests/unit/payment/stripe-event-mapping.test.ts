import { beforeEach, describe, expect, it, vi } from 'vitest';

const stripeMocks = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  createFetchHttpClient: vi.fn(() => ({})),
  customersList: vi.fn(),
  customersCreate: vi.fn(),
  checkoutSessionsCreate: vi.fn(),
  checkoutSessionsRetrieve: vi.fn(),
  invoicesRetrieve: vi.fn(),
  billingPortalSessionsCreate: vi.fn(),
  subscriptionsRetrieve: vi.fn(),
  subscriptionsCancel: vi.fn(),
}));

vi.mock('stripe', () => {
  class MockStripe {
    static createFetchHttpClient = stripeMocks.createFetchHttpClient;

    webhooks = {
      constructEvent: stripeMocks.constructEvent,
    };

    customers = {
      list: stripeMocks.customersList,
      create: stripeMocks.customersCreate,
    };

    checkout = {
      sessions: {
        create: stripeMocks.checkoutSessionsCreate,
        retrieve: stripeMocks.checkoutSessionsRetrieve,
      },
    };

    invoices = {
      retrieve: stripeMocks.invoicesRetrieve,
    };

    billingPortal = {
      sessions: {
        create: stripeMocks.billingPortalSessionsCreate,
      },
    };

    subscriptions = {
      retrieve: stripeMocks.subscriptionsRetrieve,
      cancel: stripeMocks.subscriptionsCancel,
    };
  }

  return {
    default: MockStripe,
  };
});

import { StripeProvider } from '@/extensions/payment/stripe';
import {
  PaymentEventType,
  PaymentSignatureError,
} from '@/extensions/payment/types';

function createProvider() {
  return new StripeProvider({
    secretKey: 'sk_test',
    publishableKey: 'pk_test',
    signingSecret: 'whsec_test',
  });
}

type StripeProviderWithPrivateMap = StripeProvider & {
  mapStripeEventType(eventType: string): PaymentEventType | null;
};

function mapStripeEventType(provider: StripeProvider, eventType: string) {
  return (provider as unknown as StripeProviderWithPrivateMap).mapStripeEventType(
    eventType
  );
}

function createWebhookRequest(body: string, signature = 'valid_signature') {
  return new Request('https://scivra.test/api/payment/stripe/webhook', {
    method: 'POST',
    headers: {
      'stripe-signature': signature,
    },
    body,
  });
}

describe('StripeProvider event mapping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('maps known events to PaymentEventType', () => {
    it('maps checkout.session.completed to CHECKOUT_SUCCESS', () => {
      const provider = createProvider();

      expect(mapStripeEventType(provider, 'checkout.session.completed')).toBe(
        PaymentEventType.CHECKOUT_SUCCESS
      );
    });

    it('maps invoice.payment_succeeded to PAYMENT_SUCCESS', () => {
      const provider = createProvider();

      expect(mapStripeEventType(provider, 'invoice.payment_succeeded')).toBe(
        PaymentEventType.PAYMENT_SUCCESS
      );
    });

    it('maps invoice.payment_failed to PAYMENT_FAILED', () => {
      const provider = createProvider();

      expect(mapStripeEventType(provider, 'invoice.payment_failed')).toBe(
        PaymentEventType.PAYMENT_FAILED
      );
    });

    it('maps customer.subscription.updated to SUBSCRIBE_UPDATED', () => {
      const provider = createProvider();

      expect(mapStripeEventType(provider, 'customer.subscription.updated')).toBe(
        PaymentEventType.SUBSCRIBE_UPDATED
      );
    });

    it('maps customer.subscription.deleted to SUBSCRIBE_CANCELED', () => {
      const provider = createProvider();

      expect(mapStripeEventType(provider, 'customer.subscription.deleted')).toBe(
        PaymentEventType.SUBSCRIBE_CANCELED
      );
    });
  });

  describe('returns null for unhandled events', () => {
    it('returns null for payment_intent.created', () => {
      const provider = createProvider();

      expect(mapStripeEventType(provider, 'payment_intent.created')).toBeNull();
    });

    it('returns null for payment_method.attached', () => {
      const provider = createProvider();

      expect(mapStripeEventType(provider, 'payment_method.attached')).toBeNull();
    });

    it('returns null for invoice.created', () => {
      const provider = createProvider();

      expect(mapStripeEventType(provider, 'invoice.created')).toBeNull();
    });

    it('returns null for invoice_payment.paid', () => {
      const provider = createProvider();

      expect(mapStripeEventType(provider, 'invoice_payment.paid')).toBeNull();
    });
  });

  it('getPaymentEvent returns null for unhandled events', async () => {
    const provider = createProvider();
    const payload = JSON.stringify({
      id: 'evt_payment_intent_created',
      type: 'payment_intent.created',
      data: {
        object: {
          id: 'pi_123',
          object: 'payment_intent',
        },
      },
    });

    stripeMocks.constructEvent.mockReturnValue({
      id: 'evt_payment_intent_created',
      type: 'payment_intent.created',
      data: {
        object: {
          id: 'pi_123',
          object: 'payment_intent',
        },
      },
    });

    await expect(
      provider.getPaymentEvent({ req: createWebhookRequest(payload) })
    ).resolves.toBeNull();

    expect(stripeMocks.constructEvent).toHaveBeenCalledWith(
      payload,
      'valid_signature',
      'whsec_test'
    );
  });

  it('getPaymentEvent throws PaymentSignatureError on bad signature', async () => {
    const provider = createProvider();
    const payload = JSON.stringify({
      id: 'evt_bad_signature',
      type: 'payment_intent.created',
      data: {
        object: {
          id: 'pi_123',
          object: 'payment_intent',
        },
      },
    });

    stripeMocks.constructEvent.mockImplementation(() => {
      throw new Error('No signatures found matching the expected signature');
    });

    await expect(
      provider.getPaymentEvent({
        req: createWebhookRequest(payload, 'bad_signature'),
      })
    ).rejects.toBeInstanceOf(PaymentSignatureError);
  });
});
