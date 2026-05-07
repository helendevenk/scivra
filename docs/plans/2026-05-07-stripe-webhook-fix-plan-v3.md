# Stripe Webhook & Payment Race 修复计划 v3

> **替代** v2（被 Codex REJECT）。v1 / v2 保留作存档。
> 状态：**草案，待 Codex 三审**。
> 负责人：Claude（实现）+ Codex（评审）

## 0. v2 → v3 变更说明

Codex v2 review 找到 5 条必改 + 4 测试缺口 + 5 立场。v3 全部吸收：

| v2 问题 | v3 修正 |
|---|---|
| cleanup SQL CTE 跨多 statement 失效 | 改成 temp table + 多步骤事务，且整段进 migration 文件 |
| credit `(order_no, transaction_type)` UNIQUE 过严，会撞 GIFT/REFUND credit | 改 **partial unique index**（`WHERE order_no IS NOT NULL`）+ 把现有 `orderNo: ''` 规范化为 NULL |
| `invoice.payment_failed` 用 PAUSED 错（Stripe 语义 ≠ past_due）| 用 `PAST_DUE`，并补全 `UNPAID/INCOMPLETE/INCOMPLETE_EXPIRED` |
| 4.B 缺 existing 找不到时的 fail-closed | 加显式 throw + 测试 |
| cleanup SQL credit drift 路径漏闭环 | 检测重复 grant，未消费合并/删除，已消费 abort 人工核账 |

新增测试（Codex v2 Race 缺口）：

- 确定性预存 canonical subscription 测试
- renewal canonical order 重写测试
- non-payment credit grant 连续两次不撞 UNIQUE 测试
- migration SQL dry-run with fixtures 测试

5 个立场全部采纳：

| 立场 | 采纳 |
|---|---|
| canonical fallback：本地确定性，多候选时 abort | ✅ 见 §2.4.C cleanup SQL |
| failed payment：PAST_DUE | ✅ 见 §2.5 |
| 测试：testcontainers | ✅ 见 §4 |
| Sentry：仅 webhook route + provider/eventType/orderNo/subscriptionId context | ✅ 见 §3 步骤 10 |
| cleanup SQL 进 migration 文件 | ✅ 见 §2.4.C |

新发现且必须澄清的 v3 事实：

1. **partial unique 必须用 `uniqueIndex` 而非 `unique`**（PG `UNIQUE constraint` 不支持 WHERE，只 `UNIQUE INDEX` 支持 partial）。subscription / order 的复合唯一仍用 `unique('name').on(...)`，credit 的 partial 用 `uniqueIndex('name').on(...).where(...)`。
2. **SubscriptionStatus enum 在 9 个文件被引用**：扩枚举时必须扫描所有 caller（`src/app/.../billing/page.tsx`、`creem.ts`、`subscription.ts` model、tests）。

## 1. 背景与证据（同 v2 §1，未变更）

参见 v2 §1.1（dev log）/ §1.2（SQL 取证）/ §1.3（调用图）。
新补：当前 `credit` 表 1 条记录是 `orderNo='82047712309581354'`（非空），但 `credit.ts:352,390` 的 `grantInitialCreditsForNewUser` 和 `refundCredits` 写入 `orderNo: ''`。**当前测试 DB 没触发是因为只跑了一笔订阅，未注册第二个用户**。

## 2. Bug 列表（7 项，每项都更细化）

### Bug 1：`mapStripeEventType` 未知事件 throw

同 v2 §2 Bug 1，不变。返回 `null`，`getPaymentEvent` 改返回 `Promise<PaymentEvent | null>`，route silent skip 返回 200。

### Bug 2：`total_discount_amounts[0].amount` 数组越界

同 v2 §2 Bug 2，不变。`?.[0]?.amount ?? 0`。

### Bug 3：`invoice_payment.paid` 跳过

同 v2 §2 Bug 3，不变。选 B（仅订阅 5 个老事件，新事件走 silent skip）。

### Bug 4：webhook + callback race + canonical row 引用裂

#### 4.A schema 改动（生产 + 本地）

**4.A.1 subscription 表（项目现有风格）**

```ts
// src/config/db/schema.ts
export const subscription = pgTable(
  'subscription',
  { /* 现有列 */ },
  (table) => [
    unique('uq_subscription_provider_subscription_id')
      .on(table.paymentProvider, table.subscriptionId),
  ]
);
```

**4.A.2 order 表（项目现有风格，注意 NULL 安全）**

```ts
export const order = pgTable(
  'order',
  { /* 现有列 */ },
  (table) => [
    unique('uq_order_provider_transaction_id')
      .on(table.paymentProvider, table.transactionId),
  ]
);
```

PG 多列 UNIQUE 在任一列为 NULL 时不冲突，pending 期 `transactionId IS NULL` 时不会撞键。

**4.A.3 credit 表（必须 partial unique，因为 grantInitialCreditsForNewUser/refundCredits 不带 order_no）**

```ts
import { sql } from 'drizzle-orm';
import { uniqueIndex } from 'drizzle-orm/pg-core';

export const credit = pgTable(
  'credit',
  { /* 现有列 */ },
  (table) => [
    uniqueIndex('uq_credit_grant_per_order')
      .on(table.orderNo, table.transactionType)
      .where(sql`${table.orderNo} IS NOT NULL AND ${table.transactionType} = 'grant'`),
  ]
);
```

理由：

- `(orderNo, transactionType)` 仅在 orderNo 非空且是 GRANT 时强制唯一
- 不影响 `orderNo` 为 NULL 的 GIFT/REFUND credit
- 不影响 `transactionType='consume'` 的多笔消费记录
- 必须用 `uniqueIndex`（不是 `unique`）—— PG UNIQUE constraint 不支持 WHERE

**4.A.4 schema 改动前置：把 `orderNo: ''` 规范化为 NULL**

代码改动（`src/shared/models/credit.ts`）：

```ts
// :352
orderNo: null,        // was ''
subscriptionNo: null, // was ''

// :390
orderNo: null,        // was ''
subscriptionNo: null, // was ''
```

**前提**：`credit.orderNo` 列已经是 nullable（schema 上 `text('order_no')` 默认 nullable）。验证：`grep -A1 'orderNo:.*text' src/config/db/schema.ts` 确认无 `.notNull()`。已确认（schema 第 304 行 `orderNo: text('order_no')` 无 notNull）。

#### 4.B 代码：onConflictDoNothing + canonical 重写 + fail-closed

`updateOrderInTransaction`（`src/shared/models/order.ts:172-265`）：

```ts
const result = await db().transaction(async (tx) => {
  const result: any = { order: null, subscription: null, credit: null };
  let canonicalSubscriptionNo: string | null = null;

  // ─── deal with subscription ───
  if (newSubscription) {
    const [inserted] = await tx
      .insert(subscription)
      .values(newSubscription)
      .onConflictDoNothing({
        target: [subscription.paymentProvider, subscription.subscriptionId],
      })
      .returning();

    let canonical = inserted;
    if (!canonical) {
      // race: 另一个 tx 先写入了。取出 canonical row。
      const [existing] = await tx
        .select()
        .from(subscription)
        .where(
          and(
            eq(subscription.subscriptionId, newSubscription.subscriptionId),
            eq(subscription.paymentProvider, newSubscription.paymentProvider)
          )
        );
      if (!existing) {
        // fail-closed: onConflict 但又找不到 = invariant 破坏，让 Stripe 重试
        throw new Error(
          `subscription canonical row missing after conflict ` +
          `(provider=${newSubscription.paymentProvider}, ` +
          `subscriptionId=${newSubscription.subscriptionId})`
        );
      }
      canonical = existing;
    }

    canonicalSubscriptionNo = canonical.subscriptionNo;
    result.subscription = canonical;

    // 关键：用 canonical 的 subscription_no 重写 caller 持有的引用
    if (canonicalSubscriptionNo !== newSubscription.subscriptionNo) {
      updateOrder.subscriptionNo = canonicalSubscriptionNo;
      if (newCredit) {
        newCredit.subscriptionNo = canonicalSubscriptionNo;
      }
    }
  }

  // ─── deal with credit ───
  if (newCredit) {
    const [inserted] = await tx
      .insert(credit)
      .values(newCredit)
      .onConflictDoNothing({
        target: [credit.orderNo, credit.transactionType],
        where: sql`${credit.orderNo} IS NOT NULL AND ${credit.transactionType} = 'grant'`,
      })
      .returning();

    if (inserted) {
      result.credit = inserted;
    } else {
      // 已存在的 grant credit 直接复用（idempotent）
      const [existing] = await tx
        .select()
        .from(credit)
        .where(
          and(
            eq(credit.orderNo, newCredit.orderNo!),
            eq(credit.transactionType, newCredit.transactionType)
          )
        );
      if (!existing) {
        throw new Error(
          `credit canonical row missing after conflict (orderNo=${newCredit.orderNo})`
        );
      }
      result.credit = existing;
    }
  }

  // ─── update order (subscription_no 可能已重写) ───
  const [orderResult] = await tx
    .update(order)
    .set(updateOrder)
    .where(eq(order.orderNo, orderNo))
    .returning();
  result.order = orderResult;

  return result;
});
```

`updateSubscriptionInTransaction`（renewal 路径，`src/shared/models/order.ts:267-...`）类似，对 `newOrder` 加 onConflict + canonical 重写 + fail-closed，并在重写后改 `newCredit.orderNo`。

#### 4.C cleanup SQL（进 migration 文件，分步骤事务，reference-aware）

文件：`src/config/db/migrations/NNNN_stripe_race_cleanup.sql`（路径与 `drizzle.config` 的 `out` 对齐；手写，跟 Drizzle 生成的 schema migration 配对）。

```sql
BEGIN;

-- 1. 规范化 credit.order_no 和 credit.subscription_no：'' → NULL
UPDATE credit SET order_no = NULL WHERE order_no = '';
UPDATE credit SET subscription_no = NULL WHERE subscription_no = '';

-- 2. 检测重复 GRANT credit（同 order_no, type='grant'）。这是上线前必须人工处理的边界。
DO $$
DECLARE
  duplicate_grant_count int;
  consumed_duplicate_count int;
BEGIN
  -- 总重复
  SELECT count(*) INTO duplicate_grant_count
  FROM (
    SELECT order_no, transaction_type, count(*) c
    FROM credit
    WHERE order_no IS NOT NULL AND transaction_type = 'grant'
    GROUP BY 1, 2 HAVING count(*) > 1
  ) t;

  -- 已消费的重复（remaining_credits 已减少 = 用户已用过）
  SELECT count(*) INTO consumed_duplicate_count
  FROM credit c1
  WHERE c1.order_no IS NOT NULL
    AND c1.transaction_type = 'grant'
    AND c1.remaining_credits < c1.credits
    AND EXISTS (
      SELECT 1 FROM credit c2
      WHERE c2.order_no = c1.order_no
        AND c2.transaction_type = 'grant'
        AND c2.id != c1.id
    );

  IF consumed_duplicate_count > 0 THEN
    RAISE EXCEPTION
      'Migration aborted: % duplicate GRANT credits found with consumed remaining_credits. '
      'Manual reconciliation required (likely double-grant from race condition). '
      'Check: SELECT * FROM credit c1 WHERE c1.transaction_type = ''grant'' AND '
      'c1.order_no IS NOT NULL AND EXISTS (SELECT 1 FROM credit c2 WHERE '
      'c2.order_no = c1.order_no AND c2.transaction_type = ''grant'' AND c2.id != c1.id);',
      consumed_duplicate_count;
  END IF;

  IF duplicate_grant_count > 0 THEN
    -- 未消费的重复：删后写入（保留 created_at 最早那条）
    DELETE FROM credit WHERE id IN (
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (
          PARTITION BY order_no, transaction_type
          ORDER BY created_at ASC
        ) AS rn
        FROM credit
        WHERE order_no IS NOT NULL AND transaction_type = 'grant'
      ) t WHERE rn > 1
    );
    RAISE NOTICE 'Cleaned % duplicate unconsumed GRANT credits', duplicate_grant_count;
  END IF;
END $$;

-- 3. 处理 subscription 重复（用 temp table 替代跨语句 CTE）
CREATE TEMP TABLE _subscription_canonical AS
SELECT
  payment_provider,
  subscription_id,
  COALESCE(
    -- 优先：被 credit 引用的那条
    (
      SELECT s2.subscription_no
      FROM subscription s2
      WHERE s2.payment_provider = s.payment_provider
        AND s2.subscription_id = s.subscription_id
        AND EXISTS (
          SELECT 1 FROM credit c
          WHERE c.subscription_no = s2.subscription_no
        )
      ORDER BY s2.created_at LIMIT 1
    ),
    -- 次：被 order 引用的那条
    (
      SELECT s2.subscription_no
      FROM subscription s2
      WHERE s2.payment_provider = s.payment_provider
        AND s2.subscription_id = s.subscription_id
        AND EXISTS (
          SELECT 1 FROM "order" o
          WHERE o.subscription_no = s2.subscription_no
        )
      ORDER BY s2.created_at LIMIT 1
    ),
    -- fallback：created_at 最早
    (
      SELECT s2.subscription_no
      FROM subscription s2
      WHERE s2.payment_provider = s.payment_provider
        AND s2.subscription_id = s.subscription_id
      ORDER BY s2.created_at ASC LIMIT 1
    )
  ) AS canonical_subscription_no,
  array_agg(s.subscription_no ORDER BY s.created_at) AS all_subscription_nos
FROM subscription s
WHERE s.subscription_id IS NOT NULL
GROUP BY s.payment_provider, s.subscription_id
HAVING count(*) > 1;

-- 4. abort 检查：一个 sub_id 同时被多条 credit 引用到不同 subscription_no（极端 corruption）
DO $$
DECLARE corrupt_count int;
BEGIN
  SELECT count(*) INTO corrupt_count
  FROM (
    SELECT sc.payment_provider, sc.subscription_id, count(DISTINCT c.subscription_no) cnt
    FROM _subscription_canonical sc
    JOIN credit c ON c.subscription_no = ANY(sc.all_subscription_nos)
    GROUP BY 1, 2
    HAVING count(DISTINCT c.subscription_no) > 1
  ) t;

  IF corrupt_count > 0 THEN
    RAISE EXCEPTION
      'Migration aborted: % subscription_id has multiple credit rows pointing to different subscription_no. '
      'Manual reconciliation required.', corrupt_count;
  END IF;
END $$;

-- 5. 修引用：order 和 credit 都指向 canonical
UPDATE "order" o
SET subscription_no = sc.canonical_subscription_no
FROM _subscription_canonical sc
WHERE o.subscription_no = ANY(sc.all_subscription_nos)
  AND o.subscription_no != sc.canonical_subscription_no;

UPDATE credit cr
SET subscription_no = sc.canonical_subscription_no
FROM _subscription_canonical sc
WHERE cr.subscription_no = ANY(sc.all_subscription_nos)
  AND cr.subscription_no != sc.canonical_subscription_no;

-- 6. 删孤儿 subscription
DELETE FROM subscription
WHERE subscription_no IN (
  SELECT unnest(all_subscription_nos) FROM _subscription_canonical
)
AND subscription_no NOT IN (
  SELECT canonical_subscription_no FROM _subscription_canonical
);

-- 7. order 表去重（同样 reference-aware，但 order 没有下游引用，直接保留最早）
DO $$
DECLARE dup_count int;
BEGIN
  SELECT count(*) INTO dup_count
  FROM (
    SELECT payment_provider, transaction_id, count(*) c
    FROM "order"
    WHERE transaction_id IS NOT NULL
    GROUP BY 1, 2 HAVING count(*) > 1
  ) t;

  IF dup_count > 0 THEN
    -- 修 credit 引用到 canonical order
    UPDATE credit c
    SET order_no = canonical.order_no
    FROM (
      SELECT DISTINCT ON (payment_provider, transaction_id)
        order_no, payment_provider, transaction_id
      FROM "order"
      WHERE transaction_id IS NOT NULL
      ORDER BY payment_provider, transaction_id, created_at ASC
    ) canonical
    JOIN "order" o ON o.payment_provider = canonical.payment_provider
                  AND o.transaction_id = canonical.transaction_id
    WHERE c.order_no = o.order_no
      AND c.order_no != canonical.order_no;

    -- 删孤儿 order
    DELETE FROM "order" WHERE order_no IN (
      SELECT order_no FROM (
        SELECT order_no, ROW_NUMBER() OVER (
          PARTITION BY payment_provider, transaction_id
          ORDER BY created_at ASC
        ) rn
        FROM "order"
        WHERE transaction_id IS NOT NULL
      ) t WHERE rn > 1
    );
    RAISE NOTICE 'Cleaned % duplicate orders', dup_count;
  END IF;
END $$;

-- 8. drop temp
DROP TABLE _subscription_canonical;

COMMIT;
```

之后跑 Drizzle 生成的 schema migration（添加 UNIQUE 约束）。**两步必须按此顺序**：先 cleanup，再加约束，否则约束创建失败。

#### 4.D fixtures 测试（migration dry-run）

`tests/migrations/stripe-race-cleanup.test.ts`（新建）：

- Fixture 1：subscription 表预存 2 行（同 sub_id），1 个被 credit 引用 / 另一个被 order 引用 → 跑 migration → 断言只剩 1 行 + 引用一致
- Fixture 2：credit 表有 `order_no=''` 的 GIFT row → 跑 migration → 断言变 NULL
- Fixture 3：credit 表有重复未消费 GRANT → 跑 migration → 删副本，无报错
- Fixture 4：credit 表有重复**已消费** GRANT → 跑 migration → **abort**（RAISE EXCEPTION）
- Fixture 5：order 表有 2 行同 transaction_id → 跑 migration → credit 引用修正到 canonical，孤儿删除

### Bug 5：`invoice.payment_failed` 在 mapping 但 route 没分支 + 缺失 status mapping

**5.A 扩展 SubscriptionStatus enum**（`src/extensions/payment/types.ts:135-142`）：

```ts
export enum SubscriptionStatus {
  ACTIVE = 'active',
  PENDING_CANCEL = 'pending_cancel',
  CANCELED = 'canceled',
  TRIALING = 'trialing',
  EXPIRED = 'expired',
  PAUSED = 'paused',
  // 新增 4 个对应 Stripe 完整 status set
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
}
```

**5.B 补全 stripe.ts:566-597 的 `buildSubscriptionInfo` status mapping**：

```ts
switch (subscription.status) {
  case 'active':
    subscriptionInfo.status = subscription.cancel_at
      ? SubscriptionStatus.PENDING_CANCEL
      : SubscriptionStatus.ACTIVE;
    if (subscription.cancel_at) { /* 现有 cancel_at/canceled_at 逻辑 */ }
    break;
  case 'trialing':
    subscriptionInfo.status = SubscriptionStatus.TRIALING;
    break;
  case 'canceled':
    subscriptionInfo.status = SubscriptionStatus.CANCELED;
    /* 现有 canceled_at 逻辑 */
    break;
  case 'past_due':
    subscriptionInfo.status = SubscriptionStatus.PAST_DUE;
    break;
  case 'unpaid':
    subscriptionInfo.status = SubscriptionStatus.UNPAID;
    break;
  case 'incomplete':
    subscriptionInfo.status = SubscriptionStatus.INCOMPLETE;
    break;
  case 'incomplete_expired':
    subscriptionInfo.status = SubscriptionStatus.INCOMPLETE_EXPIRED;
    break;
  case 'paused':
    subscriptionInfo.status = SubscriptionStatus.PAUSED;
    break;
  default:
    throw new Error(`Unknown Stripe subscription status: ${subscription.status}`);
}
```

throw 仍然保留在 default：Stripe 极少新增 status，新增时我们应该立刻知道，不能 silent skip 让数据漂移。

**5.C 给 9 个引用 SubscriptionStatus 的 caller 加 audit**：

| 文件 | 改动 |
|---|---|
| `src/app/[locale]/(landing)/settings/billing/page.tsx` | UI 显示新增 4 个状态的 **English-only** label（PAST_DUE 显示 "Payment due — update payment method"），项目当前 English-only |
| `src/shared/models/subscription.ts` | **本文件自带一套 SubscriptionStatus 枚举**，必须同步加 PAST_DUE / UNPAID / INCOMPLETE / INCOMPLETE_EXPIRED；现有的状态过滤逻辑同步审查 |
| `tests/unit/services/payment.test.ts` | mock enum 需要包含新状态 |
| `src/app/[locale]/(landing)/settings/billing/cancel/page.tsx` | PAST_DUE/UNPAID 用户也可访问 cancel 页 |
| `src/extensions/payment/creem.ts` | Creem provider 同步加 status mapping（如果 creem 也有这些状态） |
| `src/shared/services/payment.ts` | 新增 `handleSubscriptionPaymentFailed` 设置 `PAST_DUE`（不是 PAUSED） |
| `tests/unit/models/subscription.test.ts` | 测试新状态 |
| `tests/integration/subscription-lifecycle.test.ts` | 同上 |

**5.D 新增 webhook 处理分支**（`src/app/api/payment/notify/[provider]/route.ts`）：

```ts
} else if (eventType === PaymentEventType.PAYMENT_FAILED) {
  if (!session.subscriptionId) {
    // first payment failed: 通过 metadata.order_no 找 order
    const orderNo = session.metadata?.order_no;
    if (orderNo) {
      const order = await findOrderByOrderNo(orderNo);
      if (order) {
        await updateOrderByOrderNo(order.orderNo, {
          status: OrderStatus.FAILED,
          paymentResult: JSON.stringify(session.paymentResult),
        });
      }
    }
    // 没 metadata 就 silent skip（不算错误）
  } else {
    // renewal payment failed: 标记 subscription 为 PAST_DUE
    const sub = await findSubscriptionByProviderSubscriptionId({
      provider,
      subscriptionId: session.subscriptionId,
    });
    if (sub) {
      await handleSubscriptionPaymentFailed({
        subscription: sub,
        session,
      });
    }
  }
}
```

`handleSubscriptionPaymentFailed`（新增 `src/shared/services/payment.ts`）：

```ts
export async function handleSubscriptionPaymentFailed({
  subscription,
  session,
}: { subscription: Subscription; session: PaymentSession }) {
  await updateSubscriptionBySubscriptionNo(subscription.subscriptionNo, {
    status: SubscriptionStatus.PAST_DUE,
  });
}
```

### Bug 6：webhook handler 200 吞错（错误码分级）

**6.A provider-agnostic 错误抽象**（`src/extensions/payment/types.ts`）：

```ts
export class PaymentSignatureError extends Error {
  readonly name = 'PaymentSignatureError';
}
export class PaymentProcessingError extends Error {
  readonly name = 'PaymentProcessingError';
}
```

stripe.ts 把 `Stripe.errors.StripeSignatureVerificationError` 包装成 `PaymentSignatureError` 后再抛。

**6.B route.ts 错误码分级**（`src/app/api/payment/notify/[provider]/route.ts`）：

```ts
} catch (err: unknown) {
  // 1. 签名验证失败 → 400
  if (err instanceof PaymentSignatureError) {
    return Response.json({ code: -1, message: 'invalid signature' }, { status: 400 });
  }

  // 2. 业务处理失败 → 500，让 Stripe retry（幂等性靠 onConflictDoNothing 保证）
  console.error('handle payment notify failed', err);
  // Sentry context（步骤 10）
  return Response.json({ code: -1, message: 'internal error' }, { status: 500 });
}

// 在 try 块尾，未知事件 silent skip 由 getPaymentEvent 返回 null 决定
const event = await paymentProvider.getPaymentEvent({ req });
if (!event) {
  return Response.json({ code: 0, message: 'ignored' });  // 200
}
```

### Bug 7：credit dedup race（同 Bug 4）

由 Bug 4.A.3（partial unique）+ 4.B（onConflict + fail-closed）覆盖。本节不重复代码，但单列保证 commit 链路上有显式提交。

## 3. 实施顺序

| 步骤 | 任务 | 预估 | 阻塞 |
|---|---|---|---|
| 0 | git worktree `fix/stripe-webhook-canonical-rows` | 5 min | 无 |
| 1 | testcontainers 基础设施：起 PG container 的 vitest setup | 60 min | 步骤 0 |
| 2 | 写**失败测试**（TDD：先写后实现）：4.D fixtures + §4 race tests | 90 min | 步骤 1 |
| 3 | Bug 2（discount 数组）单行 fix + 单测 | 15 min | 无 |
| 4 | Bug 5.A 扩 SubscriptionStatus enum + 5.B 补 status mapping | 30 min | 无 |
| 5 | Bug 5.C：9 个 caller audit（UI 显示、tests 等） | 60 min | 步骤 4 |
| 6 | Bug 1（unknown event silent skip）：3 provider 接口对齐 | 45 min | 无 |
| 7 | Bug 3（dev/prod webhook 文档：5 个事件 + `stripe listen --events`）| 20 min | 步骤 6 |
| 8 | Bug 5.D + handleSubscriptionPaymentFailed | 45 min | 步骤 4 |
| 9 | Bug 6.A + 6.B（provider-agnostic 错误 + 错误码分级） | 60 min | 步骤 6 |
| 10 | Bug 4 + 7 schema 改动 + cleanup migration SQL | 90 min | 无 |
| 11 | Bug 4 + 7 代码：onConflict + canonical 重写 + fail-closed | 90 min | 步骤 2, 10 |
| 12 | 把 `orderNo: ''` 改为 NULL（credit.ts:352, 390） | 15 min | 步骤 10 |
| 13 | Sentry hookup：webhook route `captureException` + provider/eventType/orderNo/subscriptionId context | 30 min | 步骤 9 |
| 14 | 端到端复测：truncate → register → checkout → 检 §5 invariant | 30 min | 步骤 1-13 |
| 15 | 现有 `tests/integration/subscription-lifecycle.test.ts` 断言收紧（去除 `length >= 0`、`not.toThrow()`） | 60 min | 步骤 11 |
| 16 | 清理 `tmp/check.mjs`、`tmp/race-evidence.mjs`、`tmp/credit-orderno-check.mjs` | 5 min | 步骤 14 |
| 17 | 更新 `docs/payment/stripe-setup.md`：5 个事件、`stripe listen --events`、错误码语义 | 20 min | 步骤 7 |

**预计总耗时 12 小时**（v2 估算 7h 不可信，原因：testcontainers 基础设施 + 9 个 caller audit + cleanup migration 的复杂度被低估）。

## 4. 测试用例（覆盖 Codex v2 6 类必测）

### 4.1 Unit tests

`tests/unit/payment/stripe-event-mapping.test.ts`（新建）

- ✅ 5 已知事件返回正确枚举
- ✅ unknown 事件返回 null
- ✅ signature 错误抛 PaymentSignatureError

`tests/unit/payment/stripe-invoice-discount.test.ts`（新建）

- ✅ 5 种 `total_discount_amounts` 边界

`tests/unit/payment/stripe-status-mapping.test.ts`（新建）

- ✅ 8 种 Stripe subscription.status → SubscriptionStatus（active/trialing/canceled/past_due/unpaid/incomplete/incomplete_expired/paused）
- ✅ unknown status 抛错（保留 fail-fast）

### 4.2 Integration tests（必须用 testcontainers 真 PG）

`tests/integration/subscription-race.test.ts`（新建，testcontainers）

- **Race-1**：并发两次 `processSuccessfulPayment(order, session)` → 1 sub, 引用一致
- **Race-2**：先 path A 后 path B 顺序 → 不重复
- **Race-3**：renewal 重发 invoice → order 不重复、credit 不重发
- **Race-4**：预先插入 canonical subscription → 调用 `processSuccessfulPayment` → order 和 credit 都用预存 `subscription_no`（Codex v2 缺口）
- **Race-5**：renewal 预先插入 canonical order → `handleSubscriptionRenewal` → credit.order_no 重写到 canonical（Codex v2 缺口）
- **Race-6**：`grantInitialCreditsForNewUser` 连续 2 次（同/不同 user）→ 都成功，不撞 UNIQUE（Codex v2 缺口）
- **Failed-payment**：模拟 `invoice.payment_failed` → subscription 状态 PAST_DUE
- **Webhook-error-codes**：
  - 未知事件 → 200 `{code:0,message:'ignored'}`
  - 签名错误 → 400
  - DB 写入抛错（mock）→ 500

`tests/migrations/stripe-race-cleanup.test.ts`（新建，testcontainers）

5 个 fixture（见 §2.4.D）

### 4.3 现有测试质量整改

`tests/integration/subscription-lifecycle.test.ts` 必须把所有 "expect(...).not.toThrow()" 和 "length >= 0" 替换为精确断言。否则 race 修复无回归保护。

## 5. 端到端复测 invariant

完成步骤 1-13 后，端到端跑一笔 + 检查：

```text
6 个 invariant：
1. order count = 1, status='paid', subscription_no IS NOT NULL
2. subscription count = 1, status='active'
3. credit count = 1, transaction_type='grant'
4. order.subscription_no == subscription.subscription_no（canonical 一致）
5. credit.subscription_no == subscription.subscription_no
6. credit.order_no == order.order_no
```

新增（Codex v2 缺口）：

7. dev log 0 个 "Unknown Stripe event type" 错误
8. dev log 0 个 "Cannot read properties of undefined" 错误
9. 用 `stripe trigger invoice.payment_failed` 后，subscription.status = 'past_due'，UI billing 页面显示"Payment due"
10. 注册第二个用户 → `grantInitialCreditsForNewUser` 成功，credit 表新增 1 条 `order_no IS NULL` 行（partial unique 不撞）

## 6. 回滚

同 v2 §6，调整：

- migration 文件回滚 SQL：

```sql
-- 删 credit partial unique
DROP INDEX IF EXISTS uq_credit_grant_per_order;
-- 删 subscription / order UNIQUE constraint
ALTER TABLE subscription DROP CONSTRAINT IF EXISTS uq_subscription_provider_subscription_id;
ALTER TABLE "order" DROP CONSTRAINT IF EXISTS uq_order_provider_transaction_id;
-- 不回滚 cleanup（数据已规范化，回滚反而破坏）
```

代码 revert 回 check-then-insert。

如果 prod 已有真实数据，cleanup 是有损操作（删孤儿）。**实施前必须 `pg_dump` 备份**。

## 7. 留给 Codex v3 评审的开放问题

仅剩**仍需决策**的：

1. **Drizzle 0.44 partial unique 语法验证**：`uniqueIndex(...).on(...).where(sql\`...\`)` 在 Drizzle 0.44.5 是否真的可用？我没在 v3 实施前 sandbox 过。Codex 是否有把握？如果不行，fallback 是手写 migration SQL `CREATE UNIQUE INDEX ... WHERE ...`，schema 那边只声明非 partial。
2. **testcontainers 性能开销**：每个 PR 多 30s CI 时间 OK，但如果团队还没接 testcontainers，引入是否合适？还是用 docker-compose 起一个长期 dev PG container（开发期复用）？
3. **现有 9 个 SubscriptionStatus caller 的 audit 范围**：5.C 列了文件，但每个文件具体改什么没列。要不要在 v3 plan 里把每个 caller 的 diff 也写出来？还是开工时再决定？

## 8. 评审 checklist

请 Codex 按以下 12 项打分：

- [ ] cleanup SQL（§2.4.C）的 7 个 step 是否覆盖所有引用闭环
- [ ] `RAISE EXCEPTION` 在 已消费重复 GRANT credit 时 abort 是否合理
- [ ] partial unique 用 `uniqueIndex` 而非 `unique` 的判断是否正确
- [ ] credit `orderNo: ''` → NULL 规范化是否破坏现有查询逻辑（grep `WHERE order_no = ''` 等）
- [ ] Bug 5.A 新增 4 个 SubscriptionStatus 是否足够（Stripe 8 种状态全覆盖）
- [ ] Bug 5.B status mapping 在 default 保留 throw 而非 silent skip 是否合适
- [ ] Bug 5.C 9 个 caller audit 是否漏文件
- [ ] Bug 6 provider-agnostic `PaymentSignatureError` 抽象是否过度（vs 直接判断 Stripe 错误类型）
- [ ] §3 实施顺序的 TDD 步骤 2（先写失败测试）放在第一是否正确
- [ ] §4 race tests 覆盖度（11 个测试用例）是否充分
- [ ] §5 10 个 invariant 是否全
- [ ] §7 3 个开放问题给立场

## 9. Codex 三审 errata（开工前必读）

Codex v3 review verdict 是 **APPROVE WITH CHANGES**，但下面 5 条是执行细节错误，必须按此修正后再写代码。**不写 v4，直接当 implementation checklist**。

### 9.1 Drizzle `onConflictDoNothing` API 修正

`onConflictDoNothing` 用 `where`（不是 `targetWhere`）。`targetWhere` 是 `onConflictDoUpdate` 的 API。已在 §2.4.B 同步修正。

```ts
// ✅ 正确
.onConflictDoNothing({
  target: [credit.orderNo, credit.transactionType],
  where: sql`${credit.orderNo} IS NOT NULL AND ${credit.transactionType} = 'grant'`,
})
```

### 9.2 cleanup migration 步骤顺序：order 去重前置

§2.4.C 的步骤顺序问题：step 2 清完重复 GRANT credit 后，step 7 合并重复 order 时把多个 credit 的 `order_no` 改到 canonical，**可能再次制造重复 `(order_no, transaction_type='grant')`**，partial unique 创建失败。

修正方案：把 order 去重提到 step 2（GRANT 去重）**之前**。新顺序：

1. 规范化 `''` → NULL（step 1，不变）
2. **order 表去重 + 修 credit 引用**（原 step 7 提前）
3. 检测 + 清理重复 GRANT credit（原 step 2，针对修正后的 credit.order_no）
4. abort 已消费重复 GRANT（原 step 2 的 abort 逻辑）
5. subscription 表去重 + 修 order/credit 引用（原 step 3-6，不变）

实施时按新顺序写 SQL，并补一个 fixture 测试：两个同 `transaction_id` 的 order，各自有 grant credit，合并后只剩 1 条 grant。

### 9.3 migration 路径修正

Drizzle config `out` 是 **`src/config/db/migrations`**（与 schema 同目录），不是 v3 原文写的 `src/core/db/migrations`。已在 §2.4.C 同步修正。

### 9.4 SubscriptionStatus 双枚举源 + UI 英文 only

`src/shared/models/subscription.ts` **自带一套 `SubscriptionStatus` 枚举**（与 `src/extensions/payment/types.ts` 重名但是单独定义）。两套都要扩 PAST_DUE / UNPAID / INCOMPLETE / INCOMPLETE_EXPIRED。

`tests/unit/services/payment.test.ts` 的 mock enum 也要同步。

UI 文案 **English-only**（项目当前 `localePrefix: 'never'`、`localeDetection: false`，仅 `en` 注册），不要加中文 label。已在 §2.5.C 同步修正。

### 9.5 `RAISE EXCEPTION` 上线 runbook

`§2.4.C step 4` 的 `RAISE EXCEPTION` 在已消费重复 GRANT 时让 migration abort。这是正确的 fail-closed，但**生产部署前必须先在 prod 跑一遍同样的检测 SQL**：

```sql
-- prod preflight 必跑（在部署前 24h 执行）
SELECT count(*) AS consumed_duplicate_grant_count
FROM credit c1
WHERE c1.order_no IS NOT NULL
  AND c1.transaction_type = 'grant'
  AND c1.remaining_credits < c1.credits
  AND EXISTS (
    SELECT 1 FROM credit c2
    WHERE c2.order_no = c1.order_no
      AND c2.transaction_type = 'grant'
      AND c2.id != c1.id
  );
```

如果 count > 0 → 发布**取消**，先做人工核账，把多余 grant 标 `status='canceled'` 或合并 `remaining_credits`，再重跑 preflight，count = 0 才发布。

把这条 preflight + 核账流程加到 `docs/payment/stripe-setup.md` 的 production deployment 节。

### 9.6 新增的 fixture 测试（来自 9.2）

`tests/migrations/stripe-race-cleanup.test.ts` 加 Fixture 6：

- 两个同 `transaction_id` 的 order（race 产生）
- 每个 order 各有一条 grant credit
- 跑 migration → 1 个 canonical order，1 条 canonical grant credit（另一条被合并/删除），无 partial unique 冲突

