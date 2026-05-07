import { spawnSync } from 'node:child_process';
import postgres, { type Sql } from 'postgres';

import type {} from '../setup/testcontainers-postgres';

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  inject,
  it,
} from 'vitest';

type CleanupResult = {
  status: number;
  output: string;
};

type OrderSeed = {
  id: string;
  orderNo: string;
  createdAt: string;
  transactionId?: string | null;
  subscriptionNo?: string | null;
};

type SubscriptionSeed = {
  id: string;
  subscriptionNo: string;
  createdAt: string;
  subscriptionId?: string;
};

type CreditSeed = {
  id: string;
  createdAt: string;
  orderNo?: string | null;
  subscriptionNo?: string | null;
  transactionNo?: string;
  transactionType?: 'grant' | 'consume';
  credits?: number;
  remainingCredits?: number;
};

let sql: Sql;
let databaseUrl: string;

beforeAll(() => {
  const url = process.env.DATABASE_URL_TEST ?? inject('databaseUrlTest');
  if (!url) {
    throw new Error('DATABASE_URL_TEST is required for stripe cleanup tests');
  }

  databaseUrl = url;
  sql = postgres(databaseUrl, { max: 1 });
});

beforeEach(async () => {
  await recreateTables();
});

afterAll(async () => {
  await sql?.end();
});

describe.sequential('stripe race cleanup migration', () => {
  it('merges duplicate subscriptions and prefers the credit referenced row', async () => {
    await seedUser();
    await seedSubscription({
      id: 'sub-a-id',
      subscriptionNo: 'sub-A',
      createdAt: '2026-05-01T00:00:00Z',
    });
    await seedSubscription({
      id: 'sub-b-id',
      subscriptionNo: 'sub-B',
      createdAt: '2026-05-02T00:00:00Z',
    });
    await seedOrder({
      id: 'order-1',
      orderNo: 'order-1',
      subscriptionNo: 'sub-B',
      createdAt: '2026-05-03T00:00:00Z',
    });
    await seedCredit({
      id: 'credit-1',
      subscriptionNo: 'sub-A',
      createdAt: '2026-05-04T00:00:00Z',
    });

    expectCleanupSuccess();

    expect(await subscriptionNos()).toEqual(['sub-A']);
    expect(await orderRefs('order-1')).toEqual({
      order_no: 'order-1',
      subscription_no: 'sub-A',
    });
    expect(await creditRefs('credit-1')).toEqual({
      id: 'credit-1',
      order_no: null,
      subscription_no: 'sub-A',
    });
  });

  it('normalizes blank credit order_no and subscription_no to null', async () => {
    await seedUser();
    await seedCredit({
      id: 'gift-credit',
      orderNo: '',
      subscriptionNo: '',
      createdAt: '2026-05-01T00:00:00Z',
    });

    expectCleanupSuccess();

    expect(await creditRefs('gift-credit')).toEqual({
      id: 'gift-credit',
      order_no: null,
      subscription_no: null,
    });
  });

  it('deletes duplicate unconsumed grant credits and keeps the earliest row', async () => {
    await seedUser();
    await seedOrder({
      id: 'order-1',
      orderNo: 'order-1',
      createdAt: '2026-05-01T00:00:00Z',
    });
    await seedCredit({
      id: 'grant-a',
      orderNo: 'order-1',
      transactionNo: 'txn-a',
      createdAt: '2026-05-02T00:00:00Z',
    });
    await seedCredit({
      id: 'grant-b',
      orderNo: 'order-1',
      transactionNo: 'txn-b',
      createdAt: '2026-05-03T00:00:00Z',
    });

    expectCleanupSuccess();

    expect(await creditIds()).toEqual(['grant-a']);
  });

  it('aborts on duplicate consumed grant credits', async () => {
    await seedUser();
    await seedOrder({
      id: 'order-1',
      orderNo: 'order-1',
      createdAt: '2026-05-01T00:00:00Z',
    });
    await seedCredit({
      id: 'grant-a',
      orderNo: 'order-1',
      transactionNo: 'txn-a',
      credits: 100,
      remainingCredits: 80,
      createdAt: '2026-05-02T00:00:00Z',
    });
    await seedCredit({
      id: 'grant-b',
      orderNo: 'order-1',
      transactionNo: 'txn-b',
      credits: 100,
      remainingCredits: 100,
      createdAt: '2026-05-03T00:00:00Z',
    });

    const result = runCleanup();

    expect(result.status).not.toBe(0);
    expect(result.output).toMatch(/consumed duplicate/i);
    expect(await creditIds()).toEqual(['grant-a', 'grant-b']);
  });

  it('merges duplicate orders and rewrites credit order references', async () => {
    await seedUser();
    await seedOrder({
      id: 'order-a-id',
      orderNo: 'order-A',
      transactionId: 'txn-dupe',
      createdAt: '2026-05-01T00:00:00Z',
    });
    await seedOrder({
      id: 'order-b-id',
      orderNo: 'order-B',
      transactionId: 'txn-dupe',
      createdAt: '2026-05-02T00:00:00Z',
    });
    await seedCredit({
      id: 'credit-1',
      orderNo: 'order-B',
      transactionNo: 'txn-credit',
      createdAt: '2026-05-03T00:00:00Z',
    });

    expectCleanupSuccess();

    expect(await orderNos()).toEqual(['order-A']);
    expect(await creditRefs('credit-1')).toEqual({
      id: 'credit-1',
      order_no: 'order-A',
      subscription_no: null,
    });
  });

  it('removes grant collision produced by order merge and allows partial unique enforcement', async () => {
    await seedUser();
    await seedOrder({
      id: 'order-a-id',
      orderNo: 'order-A',
      transactionId: 'txn-dupe',
      createdAt: '2026-05-01T00:00:00Z',
    });
    await seedOrder({
      id: 'order-b-id',
      orderNo: 'order-B',
      transactionId: 'txn-dupe',
      createdAt: '2026-05-02T00:00:00Z',
    });
    await seedCredit({
      id: 'grant-a',
      orderNo: 'order-A',
      transactionNo: 'txn-a',
      createdAt: '2026-05-03T00:00:00Z',
    });
    await seedCredit({
      id: 'grant-b',
      orderNo: 'order-B',
      transactionNo: 'txn-b',
      createdAt: '2026-05-04T00:00:00Z',
    });

    expectCleanupSuccess();

    expect(await orderNos()).toEqual(['order-A']);
    expect(await creditIds()).toEqual(['grant-a']);
    await createGrantPartialUniqueIndex();
    await expect(
      seedCredit({
        id: 'grant-c',
        orderNo: 'order-A',
        transactionNo: 'txn-c',
        createdAt: '2026-05-05T00:00:00Z',
      })
    ).rejects.toThrow(/duplicate key|uq_credit_grant_per_order/i);
  });
});

function runCleanup(): CleanupResult {
  const result = spawnSync('pnpm', ['tsx', 'scripts/cleanup-stripe-race.ts'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      DATABASE_URL_TEST: databaseUrl,
    },
  });

  return {
    status: result.status ?? 1,
    output: `${result.stdout ?? ''}\n${result.stderr ?? ''}`,
  };
}

function expectCleanupSuccess() {
  const result = runCleanup();
  if (result.status !== 0) {
    throw new Error(result.output);
  }
}

async function recreateTables() {
  await sql`DROP TABLE IF EXISTS credit`;
  await sql`DROP TABLE IF EXISTS "order"`;
  await sql`DROP TABLE IF EXISTS subscription`;
  await sql`DROP TABLE IF EXISTS "user"`;
  await sql`CREATE TABLE "user" (id text PRIMARY KEY, name text NOT NULL, email text UNIQUE NOT NULL, email_verified boolean NOT NULL DEFAULT true, created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now())`;
  await sql`CREATE TABLE subscription (id text PRIMARY KEY, subscription_no text UNIQUE NOT NULL, user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE, status text NOT NULL, payment_provider text NOT NULL, subscription_id text NOT NULL, created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now())`;
  await sql`CREATE TABLE "order" (id text PRIMARY KEY, order_no text UNIQUE NOT NULL, user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE, status text NOT NULL, amount integer NOT NULL DEFAULT 0, currency text NOT NULL DEFAULT 'usd', payment_provider text NOT NULL, checkout_info text NOT NULL DEFAULT '{}', subscription_no text, transaction_id text, created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now())`;
  await sql`CREATE TABLE credit (id text PRIMARY KEY, user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE, order_no text, subscription_no text, transaction_no text UNIQUE NOT NULL, transaction_type text NOT NULL, transaction_scene text, credits integer NOT NULL, remaining_credits integer NOT NULL DEFAULT 0, status text NOT NULL, created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now())`;
  await sql`TRUNCATE TABLE credit, "order", subscription, "user" RESTART IDENTITY CASCADE`;
}

async function createGrantPartialUniqueIndex() {
  await sql`
    CREATE UNIQUE INDEX uq_credit_grant_per_order
    ON credit (order_no, transaction_type)
    WHERE order_no IS NOT NULL AND transaction_type = 'grant'
  `;
}

async function seedUser() {
  await sql`
    INSERT INTO "user" (id, name, email, email_verified)
    VALUES ('user-1', 'Stripe Cleanup User', 'stripe-cleanup@example.com', true)
  `;
}

async function seedOrder(seed: OrderSeed) {
  await sql`
    INSERT INTO "order" (
      id,
      order_no,
      user_id,
      status,
      amount,
      currency,
      payment_provider,
      checkout_info,
      subscription_no,
      transaction_id,
      created_at,
      updated_at
    )
    VALUES (
      ${seed.id},
      ${seed.orderNo},
      'user-1',
      'paid',
      1000,
      'usd',
      'stripe',
      '{}',
      ${seed.subscriptionNo ?? null},
      ${seed.transactionId ?? null},
      ${seed.createdAt},
      ${seed.createdAt}
    )
  `;
}

async function seedSubscription(seed: SubscriptionSeed) {
  await sql`
    INSERT INTO subscription (
      id,
      subscription_no,
      user_id,
      status,
      payment_provider,
      subscription_id,
      created_at,
      updated_at
    )
    VALUES (
      ${seed.id},
      ${seed.subscriptionNo},
      'user-1',
      'active',
      'stripe',
      ${seed.subscriptionId ?? 'sub_stripe_dupe'},
      ${seed.createdAt},
      ${seed.createdAt}
    )
  `;
}

async function seedCredit(seed: CreditSeed) {
  await sql`
    INSERT INTO credit (
      id,
      user_id,
      order_no,
      subscription_no,
      transaction_no,
      transaction_type,
      transaction_scene,
      credits,
      remaining_credits,
      status,
      created_at,
      updated_at
    )
    VALUES (
      ${seed.id},
      'user-1',
      ${seed.orderNo ?? null},
      ${seed.subscriptionNo ?? null},
      ${seed.transactionNo ?? `txn-${seed.id}`},
      ${seed.transactionType ?? 'grant'},
      'payment',
      ${seed.credits ?? 100},
      ${seed.remainingCredits ?? seed.credits ?? 100},
      'active',
      ${seed.createdAt},
      ${seed.createdAt}
    )
  `;
}

async function orderNos() {
  const rows = await sql<{ order_no: string }[]>`
    SELECT order_no FROM "order" ORDER BY created_at ASC
  `;
  return rows.map((row) => row.order_no);
}

async function subscriptionNos() {
  const rows = await sql<{ subscription_no: string }[]>`
    SELECT subscription_no FROM subscription ORDER BY created_at ASC
  `;
  return rows.map((row) => row.subscription_no);
}

async function creditIds() {
  const rows = await sql<{ id: string }[]>`
    SELECT id FROM credit ORDER BY created_at ASC
  `;
  return rows.map((row) => row.id);
}

async function orderRefs(orderNo: string) {
  const rows = await sql<
    { order_no: string; subscription_no: string | null }[]
  >`
    SELECT order_no, subscription_no
    FROM "order"
    WHERE order_no = ${orderNo}
  `;
  return rows[0];
}

async function creditRefs(id: string) {
  const rows = await sql<
    { id: string; order_no: string | null; subscription_no: string | null }[]
  >`
    SELECT id, order_no, subscription_no
    FROM credit
    WHERE id = ${id}
  `;
  return rows[0];
}
