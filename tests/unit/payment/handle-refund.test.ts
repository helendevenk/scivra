import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Configs } from '@/shared/models/config';

const paymentMocks = vi.hoisted(() => ({
  cancelSubscription: vi.fn(),
}));

vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

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
    REFUNDED: 'refunded',
  },
}));

vi.mock('@/shared/models/credit', () => ({
  calculateCreditExpirationTime: vi.fn().mockReturnValue(new Date('2026-12-31')),
  CreditStatus: { ACTIVE: 'active', EXPIRED: 'expired', DELETED: 'deleted' },
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
    PAST_DUE: 'past_due',
    UNPAID: 'unpaid',
    INCOMPLETE: 'incomplete',
    INCOMPLETE_EXPIRED: 'incomplete_expired',
  },
}));

vi.mock('@/shared/models/config', () => ({
  getAllConfigs: vi.fn().mockResolvedValue({
    stripe_enabled: 'true',
    stripe_secret_key: 'sk_test',
    stripe_publishable_key: 'pk_test',
    stripe_signing_secret: 'whsec_test',
    default_payment_provider: 'stripe',
  } satisfies Configs),
}));

vi.mock('@/shared/lib/hash', () => ({
  getUuid: vi.fn().mockReturnValue('test-uuid'),
  getSnowId: vi.fn().mockReturnValue('test-snow-id'),
}));

vi.mock('@/extensions/monitoring/sentry', () => ({
  captureServerError: vi.fn(),
}));

vi.mock('@/extensions/payment', () => {
  class MockPaymentManager {
    private providers = new Map<string, any>();
    private defaultProvider: any = undefined;

    addProvider(provider: any, isDefault = false) {
      this.providers.set(provider.name, provider);
      if (isDefault) {
        this.defaultProvider = provider;
      }
    }

    getProviderNames() {
      return Array.from(this.providers.keys());
    }

    getDefaultProvider() {
      if (!this.defaultProvider) {
        this.defaultProvider = this.providers.values().next().value;
      }
      return this.defaultProvider;
    }

    getProvider(name: string) {
      return this.providers.get(name);
    }
  }

  class MockStripeProvider {
    name = 'stripe';
    configs: any;
    cancelSubscription = paymentMocks.cancelSubscription;

    constructor(configs: any) {
      this.configs = configs;
    }
  }

  class MockPayPalProvider {
    name = 'paypal';
    configs: any;

    constructor(configs: any) {
      this.configs = configs;
    }
  }

  class MockCreemProvider {
    name = 'creem';
    configs: any;

    constructor(configs: any) {
      this.configs = configs;
    }
  }

  return {
    PaymentManager: MockPaymentManager,
    StripeProvider: MockStripeProvider,
    PayPalProvider: MockPayPalProvider,
    CreemProvider: MockCreemProvider,
  };
});

import { db } from '@/core/db';
import { captureServerError } from '@/extensions/monitoring/sentry';
import { PaymentStatus, PaymentType } from '@/extensions/payment/types';
import { handleRefund } from '@/shared/services/payment';
import {
  OrderStatus,
  updateOrderInTransaction,
} from '@/shared/models/order';
import { CreditStatus } from '@/shared/models/credit';
import { createMockDb } from '../../helpers/mock-db';

function makeOrder(overrides: Record<string, unknown> = {}) {
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
    creditsAmount: 100,
    creditsValidDays: 30,
    paymentProductId: 'pp-1',
    ...overrides,
  } as any;
}

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    provider: 'stripe',
    paymentStatus: PaymentStatus.REFUNDED,
    paymentResult: { id: 'ch_123', refunded: true },
    metadata: {},
    ...overrides,
  } as any;
}

describe('handleRefund', () => {
  let mockDb: ReturnType<typeof createMockDb>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDb = createMockDb();
    vi.mocked(db).mockReturnValue(mockDb as any);
  });

  it('marks order as REFUNDED and expires GRANT credits', async () => {
    const order = makeOrder();
    const session = makeSession();

    await handleRefund({ order, session });

    expect(updateOrderInTransaction).toHaveBeenCalledWith({
      orderNo: 'ORD-001',
      updateOrder: {
        status: OrderStatus.REFUNDED,
        paymentResult: JSON.stringify(session.paymentResult),
      },
    });
    expect(mockDb.update).toHaveBeenCalledOnce();
    expect(mockDb.set).toHaveBeenCalledWith({
      status: CreditStatus.EXPIRED,
      remainingCredits: 0,
    });
    expect(mockDb.where).toHaveBeenCalledOnce();
  });

  it('cancels subscription via provider when order is subscription', async () => {
    const order = makeOrder({
      paymentType: PaymentType.SUBSCRIPTION,
      subscriptionNo: 'SUB-001',
      subscriptionId: 'sub_test',
    });
    const session = makeSession();

    await handleRefund({ order, session });

    expect(paymentMocks.cancelSubscription).toHaveBeenCalledOnce();
    expect(paymentMocks.cancelSubscription).toHaveBeenCalledWith({
      subscriptionId: 'sub_test',
    });
  });

  it("swallows 'No such subscription' from Stripe (idempotent)", async () => {
    paymentMocks.cancelSubscription.mockRejectedValueOnce(
      new Error('No such subscription: sub_x')
    );
    const order = makeOrder({
      paymentType: PaymentType.SUBSCRIPTION,
      subscriptionNo: 'SUB-001',
      subscriptionId: 'sub_x',
    });
    const session = makeSession();

    await expect(handleRefund({ order, session })).resolves.toBeUndefined();
  });

  it('partial refund triggers Sentry alert and bails', async () => {
    const order = makeOrder();
    const session = makeSession({
      metadata: {
        charge_amount: 1000,
        charge_amount_refunded: 400,
      },
    });

    await handleRefund({ order, session });

    expect(captureServerError).toHaveBeenCalledOnce();
    const [error, context] = vi.mocked(captureServerError).mock.calls[0];
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('partial_refund_received');
    expect(context).toEqual({
      orderNo: 'ORD-001',
      chargeAmount: 1000,
      refundedAmount: 400,
    });
    expect(updateOrderInTransaction).not.toHaveBeenCalled();
    expect(mockDb.update).not.toHaveBeenCalled();
  });
});
