import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies before imports
vi.mock('@/shared/models/order', () => ({
  updateOrderInTransaction: vi.fn().mockResolvedValue(undefined),
  updateOrderByOrderNo: vi.fn().mockResolvedValue(undefined),
  updateSubscriptionInTransaction: vi.fn().mockResolvedValue(undefined),
  findOrderByOrderNo: vi.fn(),
  OrderStatus: {
    PENDING: 'pending',
    CREATED: 'created',
    COMPLETED: 'completed',
    PAID: 'paid',
    FAILED: 'failed',
  },
}));

vi.mock('@/shared/models/credit', () => ({
  calculateCreditExpirationTime: vi.fn().mockReturnValue(new Date('2026-12-31')),
  CreditStatus: { ACTIVE: 'active', USED: 'used', EXPIRED: 'expired' },
  CreditTransactionType: { GRANT: 'grant', CONSUME: 'consume' },
  CreditTransactionScene: { SUBSCRIPTION: 'subscription', PAYMENT: 'payment' },
}));

vi.mock('@/shared/models/subscription', () => ({
  updateSubscriptionBySubscriptionNo: vi.fn().mockResolvedValue(undefined),
  SubscriptionStatus: {
    PENDING: 'pending',
    ACTIVE: 'active',
    CANCELED: 'canceled',
    PENDING_CANCEL: 'pending_cancel',
    TRIALING: 'trialing',
    EXPIRED: 'expired',
    PAUSED: 'paused',
  },
}));

vi.mock('@/shared/models/config', () => ({
  getAllConfigs: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/shared/lib/hash', () => ({
  getUuid: vi.fn().mockReturnValue('test-uuid'),
  getSnowId: vi.fn().mockReturnValue('test-snow-id'),
}));

vi.mock('@/extensions/payment', () => {
  class MockPaymentManager {
    private providers: any[] = [];
    private defaultProvider: any = undefined;
    addProvider(provider: any, isDefault = false) {
      this.providers.push(provider);
      if (isDefault) this.defaultProvider = provider;
    }
    getProviderNames() {
      return this.providers.map((p: any) => p.name);
    }
    getDefaultProvider() {
      if (!this.defaultProvider && this.providers.length > 0) {
        this.defaultProvider = this.providers[0];
      }
      return this.defaultProvider;
    }
  }
  class MockStripeProvider {
    name = 'stripe';
    configs: any;
    constructor(cfg: any) { this.configs = cfg; }
  }
  class MockPayPalProvider {
    name = 'paypal';
    configs: any;
    constructor(cfg: any) { this.configs = cfg; }
  }
  class MockCreemProvider {
    name = 'creem';
    configs: any;
    constructor(cfg: any) { this.configs = cfg; }
  }
  return {
    PaymentManager: MockPaymentManager,
    StripeProvider: MockStripeProvider,
    PayPalProvider: MockPayPalProvider,
    CreemProvider: MockCreemProvider,
  };
});

import {
  getPaymentServiceWithConfigs,
  getPaymentService,
  handleCheckoutSuccess,
  handlePaymentSuccess,
  handleSubscriptionRenewal,
  handleSubscriptionUpdated,
  handleSubscriptionCanceled,
} from '@/shared/services/payment';
import { PaymentStatus, PaymentType } from '@/extensions/payment/types';
import { updateOrderInTransaction, updateOrderByOrderNo, updateSubscriptionInTransaction } from '@/shared/models/order';
import { updateSubscriptionBySubscriptionNo } from '@/shared/models/subscription';
import type { Configs } from '@/shared/models/config';

// Helper factories
function makeOrder(overrides: Record<string, any> = {}) {
  return {
    id: 'order-1',
    orderNo: 'ORD-001',
    userId: 'user-1',
    userEmail: 'user@test.com',
    paymentEmail: 'pay@test.com',
    paymentProvider: 'stripe',
    paymentType: PaymentType.ONE_TIME,
    productId: 'prod-1',
    productName: 'Pro Plan',
    planName: 'Pro',
    creditsAmount: 0,
    creditsValidDays: 0,
    paymentProductId: 'pp-1',
    ...overrides,
  } as any;
}

function makeSession(overrides: Record<string, any> = {}) {
  return {
    provider: 'stripe',
    paymentStatus: PaymentStatus.SUCCESS,
    paymentResult: { id: 'pi_123' },
    paymentInfo: {
      paymentAmount: 499,
      paymentCurrency: 'usd',
      paymentEmail: 'pay@test.com',
      paymentUserName: 'Test User',
      paymentUserId: 'cus_123',
      paidAt: new Date(),
      invoiceId: 'inv_1',
      invoiceUrl: 'https://invoice.url',
      transactionId: 'txn_1',
    },
    ...overrides,
  } as any;
}

function makeSubscription(overrides: Record<string, any> = {}) {
  return {
    id: 'sub-1',
    subscriptionNo: 'SUB-001',
    subscriptionId: 'sub_stripe_1',
    userId: 'user-1',
    userEmail: 'user@test.com',
    paymentProvider: 'stripe',
    amount: 499,
    currency: 'usd',
    productId: 'prod-1',
    productName: 'Pro Plan',
    planName: 'Pro',
    interval: 'month',
    creditsAmount: 100,
    creditsValidDays: 30,
    paymentProductId: 'pp-1',
    ...overrides,
  } as any;
}

describe('payment service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- getPaymentServiceWithConfigs ---
  describe('getPaymentServiceWithConfigs', () => {
    it('should create manager with Stripe when stripe_enabled', () => {
      const configs: Configs = {
        stripe_enabled: 'true',
        stripe_secret_key: 'sk_test',
        stripe_publishable_key: 'pk_test',
        stripe_signing_secret: 'whsec_test',
        default_payment_provider: 'stripe',
      };
      const manager = getPaymentServiceWithConfigs(configs);
      expect(manager.getProviderNames()).toContain('stripe');
    });

    it('should create manager with PayPal when paypal_enabled', () => {
      const configs: Configs = {
        paypal_enabled: 'true',
        paypal_client_id: 'client_id',
        paypal_client_secret: 'client_secret',
        paypal_environment: 'sandbox',
        default_payment_provider: 'paypal',
      };
      const manager = getPaymentServiceWithConfigs(configs);
      expect(manager.getProviderNames()).toContain('paypal');
    });

    it('should create manager with Creem when creem_enabled', () => {
      const configs: Configs = {
        creem_enabled: 'true',
        creem_api_key: 'key',
        creem_environment: 'sandbox',
        creem_signing_secret: 'secret',
        default_payment_provider: 'creem',
      };
      const manager = getPaymentServiceWithConfigs(configs);
      expect(manager.getProviderNames()).toContain('creem');
    });

    it('should return manager with no providers when none enabled', () => {
      const configs: Configs = {};
      const manager = getPaymentServiceWithConfigs(configs);
      expect(manager.getProviderNames()).toHaveLength(0);
    });
  });

  // --- validatePaymentInput (tested through handleCheckoutSuccess) ---
  describe('validatePaymentInput (via handleCheckoutSuccess)', () => {
    it('should throw on invalid order (no orderNo)', async () => {
      const order = makeOrder({ orderNo: '' });
      const session = makeSession();
      await expect(handleCheckoutSuccess({ order, session })).rejects.toThrow('invalid order');
    });

    it('should throw on subscription without subscriptionId', async () => {
      const order = makeOrder({ paymentType: PaymentType.SUBSCRIPTION });
      const session = makeSession({ subscriptionId: undefined, subscriptionInfo: undefined });
      await expect(handleCheckoutSuccess({ order, session })).rejects.toThrow(
        'subscription id or subscription info not found'
      );
    });

    it('should not throw for valid one-time order', async () => {
      const order = makeOrder();
      const session = makeSession();
      await expect(handleCheckoutSuccess({ order, session })).resolves.not.toThrow();
    });
  });

  // --- handleCheckoutSuccess ---
  describe('handleCheckoutSuccess', () => {
    it('should call updateOrderInTransaction on SUCCESS status', async () => {
      const order = makeOrder();
      const session = makeSession({ paymentStatus: PaymentStatus.SUCCESS });
      await handleCheckoutSuccess({ order, session });
      expect(updateOrderInTransaction).toHaveBeenCalledTimes(1);
      const callArg = vi.mocked(updateOrderInTransaction).mock.calls[0][0];
      expect(callArg.orderNo).toBe('ORD-001');
      expect(callArg.updateOrder.status).toBe('paid');
    });

    it('should call updateOrderByOrderNo with FAILED on FAILED status', async () => {
      const order = makeOrder();
      const session = makeSession({ paymentStatus: PaymentStatus.FAILED });
      await handleCheckoutSuccess({ order, session });
      expect(updateOrderByOrderNo).toHaveBeenCalledWith('ORD-001', expect.objectContaining({
        status: 'failed',
      }));
    });

    it('should call updateOrderByOrderNo with paymentResult only on PROCESSING', async () => {
      const order = makeOrder();
      const session = makeSession({ paymentStatus: PaymentStatus.PROCESSING });
      await handleCheckoutSuccess({ order, session });
      expect(updateOrderByOrderNo).toHaveBeenCalledTimes(1);
      const callArgs = vi.mocked(updateOrderByOrderNo).mock.calls[0];
      expect(callArgs[1]).not.toHaveProperty('status');
      expect(callArgs[1]).toHaveProperty('paymentResult');
    });

    it('should throw on unknown payment status', async () => {
      const order = makeOrder();
      const session = makeSession({ paymentStatus: 'unknown_status' });
      await expect(handleCheckoutSuccess({ order, session })).rejects.toThrow('unknown payment status');
    });

    it('should create newSubscription when subscriptionInfo present', async () => {
      const order = makeOrder({ paymentType: PaymentType.SUBSCRIPTION });
      const session = makeSession({
        subscriptionId: 'sub_1',
        subscriptionInfo: {
          subscriptionId: 'sub_1',
          status: 'active',
          amount: 499,
          currency: 'usd',
          interval: 'month',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(),
        },
        subscriptionResult: { id: 'sub_1' },
      });
      await handleCheckoutSuccess({ order, session });
      expect(updateOrderInTransaction).toHaveBeenCalledTimes(1);
      const callArg = vi.mocked(updateOrderInTransaction).mock.calls[0][0];
      expect(callArg.newSubscription).toBeDefined();
      expect(callArg.newSubscription.subscriptionId).toBe('sub_1');
    });

    it('should create newCredit when order has creditsAmount > 0', async () => {
      const order = makeOrder({ creditsAmount: 100, creditsValidDays: 30 });
      const session = makeSession();
      await handleCheckoutSuccess({ order, session });
      const callArg = vi.mocked(updateOrderInTransaction).mock.calls[0][0];
      expect(callArg.newCredit).toBeDefined();
      expect(callArg.newCredit.credits).toBe(100);
      expect(callArg.newCredit.remainingCredits).toBe(100);
    });
  });

  // --- handlePaymentSuccess ---
  describe('handlePaymentSuccess', () => {
    it('should call processSuccessfulPayment on SUCCESS', async () => {
      const order = makeOrder();
      const session = makeSession({ paymentStatus: PaymentStatus.SUCCESS });
      await handlePaymentSuccess({ order, session });
      expect(updateOrderInTransaction).toHaveBeenCalledTimes(1);
    });

    it('should throw on non-SUCCESS status', async () => {
      const order = makeOrder();
      const session = makeSession({ paymentStatus: PaymentStatus.FAILED });
      await expect(handlePaymentSuccess({ order, session })).rejects.toThrow('unknown payment status');
    });
  });

  // --- handleSubscriptionRenewal ---
  describe('handleSubscriptionRenewal', () => {
    it('should create renewal order and update subscription on valid renewal', async () => {
      const sub = makeSubscription();
      const session = makeSession({
        paymentStatus: PaymentStatus.SUCCESS,
        subscriptionId: 'sub_stripe_1',
        subscriptionInfo: {
          subscriptionId: 'sub_stripe_1',
          currentPeriodStart: new Date('2026-04-01'),
          currentPeriodEnd: new Date('2026-05-01'),
        },
      });
      await handleSubscriptionRenewal({ subscription: sub, session });
      expect(updateSubscriptionInTransaction).toHaveBeenCalledTimes(1);
      const callArg = vi.mocked(updateSubscriptionInTransaction).mock.calls[0][0];
      expect(callArg.subscriptionNo).toBe('SUB-001');
      expect(callArg.newOrder).toBeDefined();
      expect(callArg.newCredit).toBeDefined();
    });

    it('should throw on subscription id mismatch', async () => {
      const sub = makeSubscription();
      const session = makeSession({
        subscriptionId: 'wrong_sub_id',
        subscriptionInfo: {
          subscriptionId: 'wrong_sub_id',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(),
        },
      });
      await expect(handleSubscriptionRenewal({ subscription: sub, session })).rejects.toThrow(
        'subscription id mismatch'
      );
    });

    it('should throw when missing period info', async () => {
      const sub = makeSubscription();
      const session = makeSession({
        subscriptionId: 'sub_stripe_1',
        subscriptionInfo: {
          subscriptionId: 'sub_stripe_1',
          currentPeriodStart: undefined,
          currentPeriodEnd: undefined,
        },
      });
      await expect(handleSubscriptionRenewal({ subscription: sub, session })).rejects.toThrow(
        'invalid subscription info'
      );
    });
  });

  // --- handleSubscriptionUpdated ---
  describe('handleSubscriptionUpdated', () => {
    it('should update subscription status', async () => {
      const sub = makeSubscription();
      const session = makeSession({
        subscriptionInfo: {
          status: 'paused',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(),
        },
      });
      await handleSubscriptionUpdated({ subscription: sub, session });
      expect(updateSubscriptionBySubscriptionNo).toHaveBeenCalledWith(
        'SUB-001',
        expect.objectContaining({ status: 'paused' })
      );
    });

    it('should throw on invalid subscription (missing subscriptionNo)', async () => {
      const sub = makeSubscription({ subscriptionNo: '' });
      const session = makeSession({
        subscriptionInfo: { status: 'active' },
      });
      await expect(handleSubscriptionUpdated({ subscription: sub, session })).rejects.toThrow(
        'invalid subscription'
      );
    });
  });

  // --- handleSubscriptionCanceled ---
  describe('handleSubscriptionCanceled', () => {
    it('should set CANCELED status with canceledAt', async () => {
      const canceledAt = new Date('2026-04-15');
      const sub = makeSubscription();
      const session = makeSession({
        subscriptionInfo: {
          status: 'canceled',
          canceledAt,
          canceledEndAt: new Date('2026-05-01'),
          canceledReason: 'user requested',
          canceledReasonType: 'voluntary',
        },
      });
      await handleSubscriptionCanceled({ subscription: sub, session });
      expect(updateSubscriptionBySubscriptionNo).toHaveBeenCalledWith(
        'SUB-001',
        expect.objectContaining({
          status: 'canceled',
          canceledAt,
        })
      );
    });

    it('should throw when missing canceledAt', async () => {
      const sub = makeSubscription();
      const session = makeSession({
        subscriptionInfo: {
          status: 'canceled',
          canceledAt: undefined,
        },
      });
      await expect(handleSubscriptionCanceled({ subscription: sub, session })).rejects.toThrow(
        'invalid subscription info'
      );
    });
  });

  // --- getPaymentService ---
  describe('getPaymentService', () => {
    it('should return PaymentManager instance', async () => {
      const configs: Configs = {
        stripe_enabled: 'true',
        stripe_secret_key: 'sk_test',
        stripe_publishable_key: 'pk_test',
        stripe_signing_secret: 'whsec_test',
        default_payment_provider: 'stripe',
      };
      const manager = await getPaymentService(configs);
      expect(manager).toBeDefined();
      expect(manager.getProviderNames()).toContain('stripe');
    });
  });
});
