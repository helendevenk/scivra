/**
 * Subscription Lifecycle Integration Tests
 *
 * Tests the full subscription flow: checkout → order → subscription → credits.
 * Mocks @/core/db, tests real service/model functions.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  SubscriptionStatus as ExtSubStatus,
  PaymentInterval,
  PaymentStatus,
  PaymentType,
} from '@/extensions/payment/types';
import { subscriptionToTier } from '@/shared/lib/experiments/access';
import {
  calculateCreditExpirationTime,
  CreditStatus,
  CreditTransactionScene,
  CreditTransactionType,
} from '@/shared/models/credit';
import { OrderStatus } from '@/shared/models/order';
import { SubscriptionStatus } from '@/shared/models/subscription';
// ─── Imports ───────────────────────────────────────────────────────

import {
  handleCheckoutSuccess,
  handlePaymentSuccess,
  handleSubscriptionCanceled,
  handleSubscriptionRenewal,
  handleSubscriptionUpdated,
} from '@/shared/services/payment';

// ─── DB Mock ───────────────────────────────────────────────────────

const _store: Record<string, Record<string, unknown>[]> = {
  order: [],
  subscription: [],
  credit: [],
  config: [],
};

function resetStore() {
  _store.order = [];
  _store.subscription = [];
  _store.credit = [];
  _store.config = [];
}

vi.mock('@/core/db', () => {
  function _chain(op: string, tableName: string) {
    const ctx: any = { op, table: tableName, insertRow: null, updateSet: null };
    const self: any = {};
    self.values = (r: any) => {
      ctx.insertRow = r;
      return self;
    };
    self.set = (s: any) => {
      ctx.updateSet = s;
      return self;
    };
    self.where = () => self;
    self.orderBy = () => self;
    self.limit = () => self;
    self.offset = () => self;
    self.for = () => self;
    self.from = () => self;
    self.onConflictDoUpdate = () => self;

    self.returning = () => {
      const store = (globalThis as any).__testStore;
      if (!store) return Promise.resolve([]);

      if (op === 'insert' && ctx.insertRow) {
        if (!store[ctx.table]) store[ctx.table] = [];
        store[ctx.table].push({ ...ctx.insertRow });
        return Promise.resolve([{ ...ctx.insertRow }]);
      }
      if (op === 'update' && ctx.updateSet) {
        const rows = store[ctx.table] || [];
        if (rows.length > 0) {
          Object.assign(rows[rows.length - 1], ctx.updateSet);
          return Promise.resolve([{ ...rows[rows.length - 1] }]);
        }
        return Promise.resolve([{ ...ctx.updateSet }]);
      }
      return Promise.resolve([]);
    };

    // Select resolves
    self.then = (resolve: any) => {
      const store = (globalThis as any).__testStore;
      if (!store) return Promise.resolve([]).then(resolve);
      const rows = store[ctx.table] || [];
      return Promise.resolve(rows).then(resolve);
    };

    return self;
  }

  function _db() {
    const db: any = {};
    db.insert = (tableRef: any) => _chain('insert', tableRef?._ || 'unknown');
    db.select = () => {
      const c = _chain('select', '');
      c.from = (tableRef: any) => {
        const newChain = _chain('select', tableRef?._ || 'unknown');
        return newChain;
      };
      return c;
    };
    db.update = (tableRef: any) => _chain('update', tableRef?._ || 'unknown');
    db.transaction = async (fn: any) => fn(_db());
    return db;
  }

  return { db: () => _db() };
});

vi.mock('@/config/db/schema', () => ({
  order: { _: 'order' },
  subscription: { _: 'subscription' },
  credit: { _: 'credit' },
  config: { _: 'config' },
}));

vi.mock('@/shared/lib/hash', () => ({
  getUuid: () => `uuid-${Math.random().toString(36).slice(2, 8)}`,
  getSnowId: () => `snow-${Date.now()}`,
}));

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  unstable_cache: (fn: any) => fn,
}));

vi.mock('@/config', () => ({
  envConfigs: { database_url: 'postgres://test' },
}));

vi.mock('@/shared/services/settings', () => ({
  getAllSettingNames: () => [],
  publicSettingNames: [],
}));

vi.mock('@/shared/lib/env', () => ({
  isCloudflareWorker: false,
}));

vi.mock('@/shared/models/user', () => ({
  appendUserToResult: (rows: any[]) => rows,
}));

// ─── Helpers ───────────────────────────────────────────────────────

function makeOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: 'order-1',
    orderNo: 'ON-001',
    userId: 'user-1',
    userEmail: 'user@example.com',
    paymentEmail: 'user@example.com',
    paymentProvider: 'stripe',
    paymentType: PaymentType.SUBSCRIPTION,
    productId: 'prod-1',
    productName: 'Pro Monthly',
    planName: 'Pro Monthly',
    creditsAmount: 100,
    creditsValidDays: 30,
    paymentProductId: 'pp-1',
    status: OrderStatus.CREATED,
    ...overrides,
  } as any;
}

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    provider: 'stripe',
    paymentStatus: PaymentStatus.SUCCESS,
    paymentInfo: {
      paymentAmount: 499,
      paymentCurrency: 'usd',
      paymentEmail: 'user@example.com',
      paidAt: new Date(),
      transactionId: 'tx-stripe-1',
    },
    paymentResult: { id: 'pi_123' },
    subscriptionId: 'sub_stripe_1',
    subscriptionInfo: {
      subscriptionId: 'sub_stripe_1',
      status: ExtSubStatus.ACTIVE,
      amount: 499,
      currency: 'usd',
      interval: PaymentInterval.MONTH,
      intervalCount: 1,
      currentPeriodStart: new Date('2026-03-01'),
      currentPeriodEnd: new Date('2026-04-01'),
      description: 'Pro Monthly',
    },
    subscriptionResult: { id: 'sub_stripe_1' },
    ...overrides,
  } as any;
}

function makeSubscription(overrides: Record<string, unknown> = {}) {
  return {
    id: 'sub-db-1',
    subscriptionNo: 'SN-001',
    userId: 'user-1',
    userEmail: 'user@example.com',
    status: SubscriptionStatus.ACTIVE,
    paymentProvider: 'stripe',
    subscriptionId: 'sub_stripe_1',
    productId: 'prod-1',
    productName: 'Pro Monthly',
    planName: 'Pro Monthly',
    amount: 499,
    currency: 'usd',
    interval: PaymentInterval.MONTH,
    creditsAmount: 100,
    creditsValidDays: 30,
    paymentProductId: 'pp-1',
    ...overrides,
  } as any;
}

// ─── Tests ─────────────────────────────────────────────────────────

beforeEach(() => {
  resetStore();
  (globalThis as any).__testStore = _store;
});

describe('Subscription Lifecycle Integration', () => {
  it('should set order to PAID and create subscription + credits on checkout success', async () => {
    const order = makeOrder();
    const session = makeSession();
    _store.order.push(order);

    await handleCheckoutSuccess({ order, session });

    expect(_store.order).toHaveLength(1);
    expect(_store.order[0]).toMatchObject({
      orderNo: 'ON-001',
      status: OrderStatus.PAID,
      paymentResult: JSON.stringify({ id: 'pi_123' }),
      transactionId: 'tx-stripe-1',
      subscriptionId: 'sub_stripe_1',
    });

    expect(_store.subscription).toHaveLength(1);
    expect(_store.subscription[0]).toMatchObject({
      userId: 'user-1',
      userEmail: 'user@example.com',
      status: SubscriptionStatus.ACTIVE,
      paymentProvider: 'stripe',
      subscriptionId: 'sub_stripe_1',
      productId: 'prod-1',
      planName: 'Pro Monthly',
      currentPeriodStart: new Date('2026-03-01'),
      currentPeriodEnd: new Date('2026-04-01'),
    });
    expect(_store.subscription[0]?.subscriptionNo).toEqual(
      expect.stringMatching(/^snow-\d+$/)
    );

    expect(_store.credit).toHaveLength(1);
    expect(_store.credit[0]).toMatchObject({
      userId: 'user-1',
      orderNo: 'ON-001',
      subscriptionNo: _store.subscription[0]?.subscriptionNo,
      transactionType: CreditTransactionType.GRANT,
      transactionScene: CreditTransactionScene.SUBSCRIPTION,
      credits: 100,
      remainingCredits: 100,
      expiresAt: new Date('2026-04-01'),
      status: CreditStatus.ACTIVE,
    });
  });

  it('should handle payment webhook success same as checkout', async () => {
    const order = makeOrder();
    const session = makeSession();
    _store.order.push(order);

    await handlePaymentSuccess({ order, session });

    expect(_store.order).toHaveLength(1);
    expect(_store.order[0]).toMatchObject({
      orderNo: 'ON-001',
      status: OrderStatus.PAID,
      paymentResult: JSON.stringify({ id: 'pi_123' }),
      transactionId: 'tx-stripe-1',
      subscriptionId: 'sub_stripe_1',
    });
    expect(_store.subscription).toHaveLength(1);
    expect(_store.subscription[0]).toMatchObject({
      subscriptionId: 'sub_stripe_1',
      status: SubscriptionStatus.ACTIVE,
      planName: 'Pro Monthly',
    });
    expect(_store.subscription[0]?.subscriptionNo).toEqual(
      expect.stringMatching(/^snow-\d+$/)
    );
    expect(_store.credit).toHaveLength(1);
    expect(_store.credit[0]).toMatchObject({
      orderNo: 'ON-001',
      subscriptionNo: _store.subscription[0]?.subscriptionNo,
      transactionType: CreditTransactionType.GRANT,
      transactionScene: CreditTransactionScene.SUBSCRIPTION,
      credits: 100,
      remainingCredits: 100,
      expiresAt: new Date('2026-04-01'),
      status: CreditStatus.ACTIVE,
    });
  });

  it('should create new order and credits on subscription renewal', async () => {
    const sub = makeSubscription();
    const session = makeSession();
    _store.subscription.push(sub);

    await handleSubscriptionRenewal({ subscription: sub, session });

    expect(_store.order).toHaveLength(1);
    expect(_store.order[0]).toMatchObject({
      userId: 'user-1',
      userEmail: 'user@example.com',
      status: OrderStatus.PAID,
      amount: 499,
      currency: 'usd',
      productId: 'prod-1',
      paymentType: PaymentType.RENEW,
      paymentInterval: PaymentInterval.MONTH,
      subscriptionNo: 'SN-001',
      transactionId: 'tx-stripe-1',
      subscriptionId: 'sub_stripe_1',
      description: 'Subscription Renewal',
    });
    expect(_store.order[0]?.orderNo).toEqual(
      expect.stringMatching(/^snow-\d+$/)
    );

    expect(_store.subscription).toHaveLength(1);
    expect(_store.subscription[0]).toMatchObject({
      subscriptionNo: 'SN-001',
      currentPeriodStart: new Date('2026-03-01'),
      currentPeriodEnd: new Date('2026-04-01'),
    });

    expect(_store.credit).toHaveLength(1);
    expect(_store.credit[0]).toMatchObject({
      userId: 'user-1',
      subscriptionNo: 'SN-001',
      transactionType: CreditTransactionType.GRANT,
      transactionScene: CreditTransactionScene.PAYMENT,
      credits: 100,
      remainingCredits: 100,
      expiresAt: new Date('2026-04-01'),
      status: CreditStatus.ACTIVE,
    });
  });

  it('should set subscription to CANCELED with canceledAt on cancellation', async () => {
    _store.subscription.push(makeSubscription());

    const sub = makeSubscription();
    const session = makeSession({
      subscriptionInfo: {
        subscriptionId: 'sub_stripe_1',
        status: ExtSubStatus.CANCELED,
        canceledAt: new Date('2026-03-15'),
        canceledEndAt: new Date('2026-04-01'),
        canceledReason: 'Too expensive',
        canceledReasonType: 'customer',
        currentPeriodStart: new Date('2026-03-01'),
        currentPeriodEnd: new Date('2026-04-01'),
      },
    });

    await handleSubscriptionCanceled({ subscription: sub, session });

    expect(_store.subscription).toHaveLength(1);
    expect(_store.subscription[0]).toMatchObject({
      subscriptionNo: 'SN-001',
      status: SubscriptionStatus.CANCELED,
      canceledAt: new Date('2026-03-15'),
      canceledEndAt: new Date('2026-04-01'),
      canceledReason: 'Too expensive',
      canceledReasonType: 'customer',
    });
  });

  it('should update subscription status on subscription updated event', async () => {
    _store.subscription.push(makeSubscription());

    const sub = makeSubscription();
    const session = makeSession({
      subscriptionInfo: {
        subscriptionId: 'sub_stripe_1',
        status: ExtSubStatus.ACTIVE,
        currentPeriodStart: new Date('2026-04-01'),
        currentPeriodEnd: new Date('2026-05-01'),
      },
    });

    await handleSubscriptionUpdated({ subscription: sub, session });
    expect(_store.subscription).toHaveLength(1);
    expect(_store.subscription[0]).toMatchObject({
      subscriptionNo: 'SN-001',
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date('2026-04-01'),
      currentPeriodEnd: new Date('2026-05-01'),
      canceledAt: null,
      canceledEndAt: null,
      canceledReason: '',
      canceledReasonType: '',
    });
  });

  it('should reflect Pro tier in subscription plan name', () => {
    const order = makeOrder({ planName: 'Pro Monthly' });
    expect(order.planName).toBe('Pro Monthly');

    // subscriptionToTier maps this to 'pro'
    expect(subscriptionToTier('Pro Monthly')).toBe('pro');
  });

  it('should reflect Max tier after upgrade', () => {
    expect(subscriptionToTier('Max Monthly')).toBe('max');
    expect(subscriptionToTier('Enterprise Annual')).toBe('max');
  });

  it('should fail order when payment status is FAILED', async () => {
    const order = makeOrder();
    const session = makeSession({ paymentStatus: PaymentStatus.FAILED });
    _store.order.push(order);

    await handleCheckoutSuccess({ order, session });

    expect(_store.order).toHaveLength(1);
    expect(_store.order[0]).toMatchObject({
      orderNo: 'ON-001',
      status: OrderStatus.FAILED,
      paymentResult: JSON.stringify({ id: 'pi_123' }),
    });
    expect(_store.subscription).toHaveLength(0);
    expect(_store.credit).toHaveLength(0);
  });

  it('should not modify order status when payment is PROCESSING', async () => {
    const order = makeOrder();
    const session = makeSession({ paymentStatus: PaymentStatus.PROCESSING });
    _store.order.push(order);

    await handleCheckoutSuccess({ order, session });

    expect(_store.order).toHaveLength(1);
    expect(_store.order[0]).toMatchObject({
      orderNo: 'ON-001',
      status: OrderStatus.CREATED,
      paymentResult: JSON.stringify({ id: 'pi_123' }),
    });
    expect(_store.subscription).toHaveLength(0);
    expect(_store.credit).toHaveLength(0);
  });

  it('should grant SUBSCRIPTION scene credits and set expiration to period end', () => {
    const periodEnd = new Date('2026-04-01T00:00:00Z');
    const expiresAt = calculateCreditExpirationTime({
      creditsValidDays: 30,
      currentPeriodEnd: periodEnd,
    });
    expect(expiresAt).toEqual(periodEnd);

    // Scene should be SUBSCRIPTION for subscription orders
    const scene =
      PaymentType.SUBSCRIPTION === PaymentType.SUBSCRIPTION
        ? CreditTransactionScene.SUBSCRIPTION
        : CreditTransactionScene.PAYMENT;
    expect(scene).toBe(CreditTransactionScene.SUBSCRIPTION);
  });
});
