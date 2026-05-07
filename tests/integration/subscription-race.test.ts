import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import postgres, { type Sql } from 'postgres';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  inject,
  it,
  vi,
} from 'vitest';

import type { handleSubscriptionPaymentFailed as requiredPaymentFailedHandler } from '@/shared/services/payment';

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  unstable_cache: (fn: unknown) => fn,
}));

type _RequiresPaymentFailedHandlerExport = typeof requiredPaymentFailedHandler;

type Row = Record<string, unknown>;

type PaymentServicesModule = typeof import('@/shared/services/payment') & {
  handleSubscriptionPaymentFailed: (args: {
    subscription: Row;
    session: Row;
  }) => Promise<void>;
};
type CreditModelModule = typeof import('@/shared/models/credit');
type CoreDbModule = typeof import('@/core/db');

const execFileAsync = promisify(execFile);

let sql: Sql;
let paymentServices: PaymentServicesModule;
let creditModel: CreditModelModule;
let coreDb: CoreDbModule;

beforeAll(async () => {
  const databaseUrl =
    process.env.DATABASE_URL_TEST ?? inject('databaseUrlTest');
  expect(databaseUrl).toBeTruthy();

  process.env.DATABASE_URL = databaseUrl;
  process.env.DATABASE_PROVIDER = 'postgresql';
  process.env.DB_SINGLETON_ENABLED = 'true';
  process.env.DB_MAX_CONNECTIONS = '10';
  process.env.AUTH_SECRET = 'test-auth-secret';
  process.env.INITIAL_CREDITS_ENABLED = 'true';
  process.env.INITIAL_CREDITS_AMOUNT = '25';
  process.env.INITIAL_CREDITS_VALID_DAYS = '30';
  process.env.INITIAL_CREDITS_DESCRIPTION = 'Welcome test credits';

  await execFileAsync(
    'pnpm',
    ['exec', 'drizzle-kit', 'push', '--config=src/core/db/config.ts'],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
        DATABASE_PROVIDER: 'postgresql',
        DB_SINGLETON_ENABLED: 'true',
        DB_MAX_CONNECTIONS: '10',
        AUTH_SECRET: 'test-auth-secret',
      },
    }
  );

  sql = postgres(databaseUrl, { max: 1 });
  paymentServices = (await import(
    '@/shared/services/payment'
  )) as PaymentServicesModule;
  creditModel = await import('@/shared/models/credit');
  coreDb = await import('@/core/db');
});

beforeEach(async () => {
  vi.restoreAllMocks();
  if (!sql) return;
  await sql`TRUNCATE TABLE "credit", "order", "subscription", "user" RESTART IDENTITY CASCADE`;
});

afterAll(async () => {
  await coreDb?.closeDb?.();
  await sql?.end();
});

function makeUser(overrides: Row = {}) {
  return {
    id: 'user-1',
    name: 'Race Test User',
    email: 'race-user@example.com',
    ...overrides,
  };
}

function makeOrder(overrides: Row = {}) {
  return {
    id: 'order-1',
    orderNo: 'ORDER-RACE-1',
    userId: 'user-1',
    userEmail: 'race-user@example.com',
    paymentEmail: 'race-user@example.com',
    status: 'created',
    amount: 499,
    currency: 'usd',
    productId: 'prod_pro_monthly',
    paymentType: 'subscription',
    paymentInterval: 'month',
    paymentProvider: 'stripe',
    checkoutInfo: '{}',
    productName: 'Pro Monthly',
    description: 'Pro subscription',
    creditsAmount: 100,
    creditsValidDays: 30,
    planName: 'Pro Monthly',
    paymentProductId: 'price_pro_monthly',
    ...overrides,
  };
}

function makeSubscription(overrides: Row = {}) {
  return {
    id: 'subscription-1',
    subscriptionNo: 'SUB-CANONICAL-1',
    userId: 'user-1',
    userEmail: 'race-user@example.com',
    status: 'active',
    paymentProvider: 'stripe',
    subscriptionId: 'sub_stripe_race_1',
    subscriptionResult: '{}',
    productId: 'prod_pro_monthly',
    description: 'Pro subscription',
    amount: 499,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    currentPeriodStart: new Date('2026-05-01T00:00:00.000Z'),
    currentPeriodEnd: new Date('2026-06-01T00:00:00.000Z'),
    planName: 'Pro Monthly',
    productName: 'Pro Monthly',
    creditsAmount: 100,
    creditsValidDays: 30,
    paymentProductId: 'price_pro_monthly',
    ...overrides,
  };
}

function makeCheckoutSession(overrides: Row = {}) {
  return {
    provider: 'stripe',
    paymentStatus: 'paid',
    paymentInfo: {
      paymentAmount: 499,
      paymentCurrency: 'usd',
      paymentEmail: 'race-user@example.com',
      paidAt: new Date('2026-05-07T12:00:00.000Z'),
      transactionId: 'cs_test_race_1',
      invoiceId: 'in_checkout_race_1',
      invoiceUrl: 'https://stripe.test/in_checkout_race_1',
    },
    paymentResult: { id: 'cs_test_race_1' },
    subscriptionId: 'sub_stripe_race_1',
    subscriptionInfo: {
      subscriptionId: 'sub_stripe_race_1',
      status: 'active',
      amount: 499,
      currency: 'usd',
      interval: 'month',
      intervalCount: 1,
      currentPeriodStart: new Date('2026-05-01T00:00:00.000Z'),
      currentPeriodEnd: new Date('2026-06-01T00:00:00.000Z'),
      description: 'Pro Monthly',
    },
    subscriptionResult: { id: 'sub_stripe_race_1' },
    metadata: { order_no: 'ORDER-RACE-1' },
    ...overrides,
  };
}

function makeRenewalSession(overrides: Row = {}) {
  return makeCheckoutSession({
    paymentInfo: {
      paymentAmount: 499,
      paymentCurrency: 'usd',
      paymentEmail: 'race-user@example.com',
      paidAt: new Date('2026-06-01T12:00:00.000Z'),
      transactionId: 'in_renewal_race_1',
      invoiceId: 'in_renewal_race_1',
      invoiceUrl: 'https://stripe.test/in_renewal_race_1',
      subscriptionCycleType: 'renew',
    },
    paymentResult: { id: 'in_renewal_race_1' },
    subscriptionInfo: {
      subscriptionId: 'sub_stripe_race_1',
      status: 'active',
      amount: 499,
      currency: 'usd',
      interval: 'month',
      intervalCount: 1,
      currentPeriodStart: new Date('2026-06-01T00:00:00.000Z'),
      currentPeriodEnd: new Date('2026-07-01T00:00:00.000Z'),
      description: 'Pro Monthly renewal',
    },
    ...overrides,
  });
}

async function seedUser(user = makeUser()) {
  await sql`
    INSERT INTO "user" (id, name, email, email_verified)
    VALUES (${user.id as string}, ${user.name as string}, ${user.email as string}, true)
  `;
  return user;
}

async function seedOrder(order = makeOrder()) {
  await sql`
    INSERT INTO "order" (
      id,
      order_no,
      user_id,
      user_email,
      status,
      amount,
      currency,
      product_id,
      payment_type,
      payment_interval,
      payment_provider,
      checkout_info,
      product_name,
      description,
      credits_amount,
      credits_valid_days,
      plan_name,
      payment_product_id,
      payment_email,
      transaction_id
    )
    VALUES (
      ${order.id as string},
      ${order.orderNo as string},
      ${order.userId as string},
      ${order.userEmail as string},
      ${order.status as string},
      ${order.amount as number},
      ${order.currency as string},
      ${order.productId as string},
      ${order.paymentType as string},
      ${order.paymentInterval as string},
      ${order.paymentProvider as string},
      ${order.checkoutInfo as string},
      ${order.productName as string},
      ${order.description as string},
      ${order.creditsAmount as number},
      ${order.creditsValidDays as number},
      ${order.planName as string},
      ${order.paymentProductId as string},
      ${order.paymentEmail as string},
      ${order.transactionId as string | null}
    )
  `;
  return order;
}

async function seedSubscription(subscription = makeSubscription()) {
  await sql`
    INSERT INTO "subscription" (
      id,
      subscription_no,
      user_id,
      user_email,
      status,
      payment_provider,
      subscription_id,
      subscription_result,
      product_id,
      description,
      amount,
      currency,
      interval,
      interval_count,
      current_period_start,
      current_period_end,
      plan_name,
      product_name,
      credits_amount,
      credits_valid_days,
      payment_product_id
    )
    VALUES (
      ${subscription.id as string},
      ${subscription.subscriptionNo as string},
      ${subscription.userId as string},
      ${subscription.userEmail as string},
      ${subscription.status as string},
      ${subscription.paymentProvider as string},
      ${subscription.subscriptionId as string},
      ${subscription.subscriptionResult as string},
      ${subscription.productId as string},
      ${subscription.description as string},
      ${subscription.amount as number},
      ${subscription.currency as string},
      ${subscription.interval as string},
      ${subscription.intervalCount as number},
      ${subscription.currentPeriodStart as Date},
      ${subscription.currentPeriodEnd as Date},
      ${subscription.planName as string},
      ${subscription.productName as string},
      ${subscription.creditsAmount as number},
      ${subscription.creditsValidDays as number},
      ${subscription.paymentProductId as string}
    )
  `;
  return subscription;
}

async function seedCheckoutFixture() {
  const user = await seedUser();
  const order = await seedOrder(makeOrder({ userId: user.id }));
  const session = makeCheckoutSession({
    metadata: { order_no: order.orderNo },
  });

  return { user, order, session };
}

async function seedRenewalFixture() {
  const user = await seedUser();
  const subscription = await seedSubscription(
    makeSubscription({ userId: user.id })
  );
  const session = makeRenewalSession();

  return { user, subscription, session };
}

async function readOrders() {
  return sql<Row[]>`
    SELECT
      id,
      order_no AS "orderNo",
      subscription_no AS "subscriptionNo",
      transaction_id AS "transactionId",
      status
    FROM "order"
    ORDER BY created_at ASC, order_no ASC
  `;
}

async function readSubscriptions() {
  return sql<Row[]>`
    SELECT
      id,
      subscription_no AS "subscriptionNo",
      subscription_id AS "subscriptionId",
      status
    FROM "subscription"
    ORDER BY created_at ASC, subscription_no ASC
  `;
}

async function readCredits() {
  return sql<Row[]>`
    SELECT
      id,
      order_no AS "orderNo",
      subscription_no AS "subscriptionNo",
      transaction_type AS "transactionType",
      transaction_scene AS "transactionScene",
      credits
    FROM "credit"
    ORDER BY created_at ASC, transaction_no ASC
  `;
}

async function importWebhookRouteWithMocks({
  getPaymentEvent,
  findOrderByOrderNo = vi.fn(async () => makeOrder()),
  findSubscriptionByProviderSubscriptionId = vi.fn(async () =>
    makeSubscription()
  ),
  handleCheckoutSuccess = vi.fn(async () => undefined),
}: {
  getPaymentEvent: ReturnType<typeof vi.fn>;
  findOrderByOrderNo?: ReturnType<typeof vi.fn>;
  findSubscriptionByProviderSubscriptionId?: ReturnType<typeof vi.fn>;
  handleCheckoutSuccess?: ReturnType<typeof vi.fn>;
}) {
  vi.resetModules();

  const getProvider = vi.fn(() => ({ getPaymentEvent }));
  vi.doMock('@/shared/services/payment', () => ({
    getPaymentService: vi.fn(async () => ({ getProvider })),
    handleCheckoutSuccess,
    handleSubscriptionRenewal: vi.fn(async () => undefined),
    handleSubscriptionUpdated: vi.fn(async () => undefined),
    handleSubscriptionCanceled: vi.fn(async () => undefined),
  }));
  vi.doMock('@/shared/models/order', () => ({ findOrderByOrderNo }));
  vi.doMock('@/shared/models/subscription', () => ({
    findSubscriptionByProviderSubscriptionId,
  }));

  const route = await import('@/app/api/payment/notify/[provider]/route');

  return {
    POST: route.POST,
    getProvider,
    findOrderByOrderNo,
    findSubscriptionByProviderSubscriptionId,
    handleCheckoutSuccess,
  };
}

function makeRequest() {
  return new Request('http://localhost/api/payment/notify/stripe', {
    method: 'POST',
    body: JSON.stringify({ id: 'evt_test' }),
    headers: { 'Content-Type': 'application/json' },
  });
}

function makeParams(provider = 'stripe') {
  return { params: Promise.resolve({ provider }) };
}

async function makeSignatureError() {
  const paymentTypes = (await import('@/extensions/payment/types')) as {
    PaymentSignatureError?: new (message: string) => Error;
  };

  if (paymentTypes.PaymentSignatureError) {
    return new paymentTypes.PaymentSignatureError('invalid signature');
  }

  const error = new Error('invalid signature');
  error.name = 'PaymentSignatureError';
  return error;
}

describe('subscription payment race integration RED suite', () => {
  it('Race-1: concurrent successful payment processing creates one subscription and one credit with canonical refs', async () => {
    const { order, session } = await seedCheckoutFixture();

    await Promise.all([
      paymentServices.handlePaymentSuccess({ order: order as never, session }),
      paymentServices.handlePaymentSuccess({ order: order as never, session }),
    ]);

    const orders = await readOrders();
    const subscriptions = await readSubscriptions();
    const credits = await readCredits();

    expect(subscriptions).toHaveLength(1);
    expect(credits).toHaveLength(1);
    expect(orders[0].subscriptionNo).toBe(credits[0].subscriptionNo);
    expect(orders[0].subscriptionNo).toBe(subscriptions[0].subscriptionNo);
  });

  it('Race-2: repeated checkout success for the same order stays idempotent and keeps canonical refs', async () => {
    const { order, session } = await seedCheckoutFixture();

    await paymentServices.handleCheckoutSuccess({
      order: order as never,
      session,
    });
    await paymentServices.handleCheckoutSuccess({
      order: order as never,
      session,
    });

    const orders = await readOrders();
    const subscriptions = await readSubscriptions();
    const credits = await readCredits();

    expect(orders).toHaveLength(1);
    expect(subscriptions).toHaveLength(1);
    expect(credits).toHaveLength(1);
    expect(orders[0].subscriptionNo).toBe(subscriptions[0].subscriptionNo);
    expect(credits[0].subscriptionNo).toBe(subscriptions[0].subscriptionNo);
  });

  it('Race-3: concurrent renewal replay for the same invoice creates one renewal order and one credit', async () => {
    const { subscription, session } = await seedRenewalFixture();

    await Promise.all([
      paymentServices.handleSubscriptionRenewal({
        subscription: subscription as never,
        session,
      }),
      paymentServices.handleSubscriptionRenewal({
        subscription: subscription as never,
        session,
      }),
    ]);

    const orders = await readOrders();
    const credits = await readCredits();

    expect(orders).toHaveLength(1);
    expect(orders[0].transactionId).toBe('in_renewal_race_1');
    expect(credits).toHaveLength(1);
    expect(credits[0].orderNo).toBe(orders[0].orderNo);
  });

  it('Race-4: preexisting canonical subscription rewrites order and credit subscription_no', async () => {
    const { user } = await seedCheckoutFixture();
    const canonicalSubscriptionNo = 'SUB-PRESEEDED-CANONICAL';
    await seedSubscription(
      makeSubscription({
        id: 'subscription-preseeded',
        subscriptionNo: canonicalSubscriptionNo,
        userId: user.id,
      })
    );

    const order = makeOrder({ userId: user.id });
    const session = makeCheckoutSession();

    await paymentServices.handlePaymentSuccess({
      order: order as never,
      session,
    });

    const orders = await readOrders();
    const subscriptions = await readSubscriptions();
    const credits = await readCredits();

    expect(subscriptions).toHaveLength(1);
    expect(orders[0].subscriptionNo).toBe(canonicalSubscriptionNo);
    expect(credits[0].subscriptionNo).toBe(canonicalSubscriptionNo);
  });

  it('Race-5: preexisting canonical renewal order rewrites credit.order_no', async () => {
    const { user, subscription, session } = await seedRenewalFixture();
    const canonicalOrderNo = 'ORDER-PRESEEDED-RENEWAL';
    await seedOrder(
      makeOrder({
        id: 'order-preseeded-renewal',
        orderNo: canonicalOrderNo,
        userId: user.id,
        status: 'paid',
        paymentType: 'renew',
        transactionId: 'in_renewal_race_1',
        subscriptionNo: subscription.subscriptionNo,
      })
    );

    await paymentServices.handleSubscriptionRenewal({
      subscription: subscription as never,
      session,
    });

    const orders = await readOrders();
    const credits = await readCredits();

    expect(orders).toHaveLength(1);
    expect(orders[0].orderNo).toBe(canonicalOrderNo);
    expect(credits).toHaveLength(1);
    expect(credits[0].orderNo).toBe(canonicalOrderNo);
  });

  it('Race-6: two gift credit grants for different users do not collide on partial unique index', async () => {
    const userOne = await seedUser();
    const userTwo = await seedUser(
      makeUser({
        id: 'user-2',
        email: 'race-user-2@example.com',
      })
    );

    await creditModel.grantCreditsForNewUser(userOne as never);
    await creditModel.grantCreditsForNewUser(userTwo as never);

    const credits = await readCredits();

    expect(credits).toHaveLength(2);
    expect(credits.map((credit) => credit.orderNo)).toEqual([null, null]);
    expect(credits.map((credit) => credit.transactionScene)).toEqual([
      'gift',
      'gift',
    ]);
  });

  it('Failed-payment: subscription payment failure sets subscription.status to past_due', async () => {
    const { subscription } = await seedRenewalFixture();
    const session = makeRenewalSession({
      paymentStatus: 'failed',
      paymentResult: { id: 'in_failed_race_1' },
    });

    await paymentServices.handleSubscriptionPaymentFailed({
      subscription: subscription as never,
      session,
    });

    const subscriptions = await readSubscriptions();

    expect(subscriptions).toHaveLength(1);
    expect(subscriptions[0].status).toBe('past_due');
  });
});

describe('stripe payment webhook route RED error contract', () => {
  it("Webhook unknown event returns HTTP 200 with { code: 0, message: 'ignored' }", async () => {
    const getPaymentEvent = vi.fn(async () => null);
    const { POST } = await importWebhookRouteWithMocks({ getPaymentEvent });

    const response = await POST(makeRequest(), makeParams());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ code: 0, message: 'ignored' });
  });

  it('Webhook bad signature returns HTTP 400', async () => {
    const getPaymentEvent = vi.fn(async () => {
      throw await makeSignatureError();
    });
    const { POST } = await importWebhookRouteWithMocks({ getPaymentEvent });

    const response = await POST(makeRequest(), makeParams());

    expect(response.status).toBe(400);
  });

  it('Webhook business error returns HTTP 500 so Stripe retries', async () => {
    const getPaymentEvent = vi.fn(async () => ({
      eventType: 'checkout.success',
      eventResult: { id: 'evt_business_error' },
      paymentSession: makeCheckoutSession(),
    }));
    const handleCheckoutSuccess = vi.fn(async () => {
      throw new Error('db write failed');
    });
    const { POST } = await importWebhookRouteWithMocks({
      getPaymentEvent,
      handleCheckoutSuccess,
    });

    const response = await POST(makeRequest(), makeParams());

    expect(response.status).toBe(500);
  });
});
