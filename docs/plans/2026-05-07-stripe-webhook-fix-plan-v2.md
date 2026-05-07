# Stripe Webhook & Payment Race 修复计划 v2

> **替代** `docs/plans/2026-05-07-stripe-webhook-fix-plan.md`（v1，被 Codex REJECT，保留作存档）。
> 状态：**草案，待 Codex 二次评审**。
> 负责人：Claude（实现）+ Codex（评审）

## 0. v1 → v2 变更说明

v1 把 Bug 4 当作"加 UNIQUE 约束"的单表去重问题。Codex 的核心反驳是：**race 不只是产生重复 row，losing transaction 已经把它的 `subscriptionNo` / `orderNo` 写入了 order/credit 字段，winner row 之后这些引用就指向了 ghost row**。SQL 取证完全证实了这一点（见 1.2）。

v2 重新围绕 **canonical row 引用一致性** 这条 invariant 设计：所有 payment side effects 必须落在同一组 canonical (`order`, `subscription`, `credit`) 行上。

v1 与 v2 的差异概览：

| 维度 | v1 | v2 |
|---|---|---|
| Bug 4 框架 | 加 UNIQUE + onConflictDoNothing | 加 UNIQUE + 冲突后 SELECT canonical row + **重写 caller 持有的引用** |
| Bug 计数 | 4 | 7（新增 #5 invoice.payment_failed 静默、#6 webhook 200 吞错、#7 credit dedup race） |
| webhook 错误码策略 | 不动（保留兜底 200） | 分级：忽略 200、签名错误 400、处理失败 5xx |
| cleanup SQL | "保留 created_at 最早" | reference-aware：先看引用，先修引用，最后删孤儿 |
| schema 风格 | `uniqueIndex(...)` | 项目现有的 `unique('name').on(...)` |
| 测试要求 | 模糊 | 6 类必测 + 真 PG 或可模拟 unique conflict |
| follow-up | 含糊放 P2 | Sentry hookup 等列为 PR 内必交付（而非另开 ticket） |
| worktree | 没提 | 新分支 `fix/stripe-webhook-canonical-rows` |

## 1. 背景与证据

### 1.1 现场观察

完成一笔 Stripe 测试 checkout（用户 helendevenk@gmail.com，pro-monthly $4.99）后 dev server 日志摘录：

```
handle payment notify failed Error: Unknown Stripe event type: payment_intent.created
handle payment notify failed Error: Unknown Stripe event type: payment_method.attached
handle payment notify failed Error: Unknown Stripe event type: invoice.created
handle payment notify failed TypeError: Cannot read properties of undefined (reading 'amount')
    at StripeProvider.buildPaymentSessionFromInvoice (src/extensions/payment/stripe.ts:495:47)
handle payment notify failed Error: Unknown Stripe event type: invoice_payment.paid
GET /api/payment/callback?order_no=82047712309581354 307 in 5.2s
```

### 1.2 SQL 取证（race 证据，已收集）

```text
=== subscription ===
subscription_no       subscription_id (Stripe)         created_at
82047743662893392     sub_1TUOtcHtZAZ58Fi7IX2zjvQn     02:11:14.415  ← canonical (有 credit 引用)
82047744173350945     sub_1TUOtcHtZAZ58Fi7IX2zjvQn     02:11:15.652  ← ghost  (有 order 引用)

=== order ===
order_no=82047712309581354
  subscription_no = 82047744173350945  ← 指向 ghost
  subscription_id = sub_1TUOtcHtZAZ58Fi7IX2zjvQn

=== credit ===
order_no = 82047712309581354
subscription_no = 82047743662893392  ← 指向 canonical
```

**关键事实**：

1. 两条 subscription 行 `subscription_id` 完全相同 = 同一个 Stripe Subscription，本地 race 产生
2. order 字段 `subscription_no` 和 credit 字段 `subscription_no` **不一致**
3. 这两条 sub 都是 `status='active'`，**未来从 order 和从 credit 出发查到的"我的订阅"是不同的**
4. Cancel 订阅时，应用层会基于其中一条更新；另一条永远不会被 cancel = 数据漂移
5. 续费 webhook 来时，按 `subscription_id` 找会找到两条，行为未定义

证据来自 `tmp/race-evidence.mjs`（实施时清理）。

### 1.3 调用图

`processSuccessfulPayment` 被两条路径并发调用：

```text
路径 A (POST /api/payment/notify/stripe)
  Stripe POST → notify route (verify signature) → handleCheckoutSuccess
    → processSuccessfulPayment
      → updateOrderInTransaction
        → tx: SELECT subscription WHERE (sub_id, provider) → empty
        → tx: INSERT subscription (subscription_no = NEW_A)
        → tx: SELECT credit WHERE order_no → empty
        → tx: INSERT credit (subscription_no = NEW_A)
        → tx: UPDATE order SET subscription_no = NEW_A
      → COMMIT

路径 B (GET /api/payment/callback?order_no=xxx)
  Stripe redirect → callback route → handleCheckoutSuccess
    → processSuccessfulPayment
      → updateOrderInTransaction
        → tx: SELECT subscription WHERE (sub_id, provider)
            ← 在 A 没 commit 时也是 empty
        → tx: INSERT subscription (subscription_no = NEW_B)  ← race
        → tx: SELECT credit WHERE order_no
            ← 看 A commit 状态而异
        → tx: UPDATE order SET subscription_no = NEW_B  ← 覆盖 A 写的
      → COMMIT
```

实测时序：A 在 02:11:14.415 完成，B 在 02:11:15.652 完成（差 1.237 秒，远大于 PG transaction 同步窗口）。但 PG 默认 READ COMMITTED 隔离级别下，并发 SELECT 在 INSERT 提交前看不到对方的写，**check-then-insert 不是 atomic**。

## 2. Bug 列表（7 项）

### Bug 1：`mapStripeEventType` 对未知事件 throw

**位置**：`src/extensions/payment/stripe.ts:359-374`

**根因**：default 分支 `throw new Error('Unknown Stripe event type: ...')`。Stripe 推送几十种事件，dev `stripe listen` 不带 `--events` 时转发全部，每笔订单触发 4-6 个无关事件。

**修复**：

```ts
private mapStripeEventType(eventType: string): PaymentEventType | null {
  switch (eventType) {
    case 'checkout.session.completed':
      return PaymentEventType.CHECKOUT_SUCCESS;
    case 'invoice.payment_succeeded':
      return PaymentEventType.PAYMENT_SUCCESS;
    case 'invoice.payment_failed':
      return PaymentEventType.PAYMENT_FAILED;
    case 'customer.subscription.updated':
      return PaymentEventType.SUBSCRIBE_UPDATED;
    case 'customer.subscription.deleted':
      return PaymentEventType.SUBSCRIBE_CANCELED;
    default:
      return null;
  }
}
```

`getPaymentEvent` 改返回类型为 `Promise<PaymentEvent | null>`：

```ts
async getPaymentEvent({ req }: { req: Request }): Promise<PaymentEvent | null> {
  // ...verify signature first (always throw on bad sig)...
  const eventType = this.mapStripeEventType(event.type);
  if (eventType === null) {
    return null;  // unknown / unhandled — 让 caller 跳过
  }
  // ...rest unchanged...
}
```

`PaymentProvider` interface 同步改成 `Promise<PaymentEvent | null>`，三个 provider（stripe / paypal / creem）都对齐。

### Bug 2：`total_discount_amounts[0].amount` 数组越界

**位置**：`src/extensions/payment/stripe.ts:494-496`

**修复**：

```ts
discountAmount: invoice.total_discount_amounts?.[0]?.amount ?? 0,
```

未用 promo code 时 `total_discount_amounts` 是 `[]`（truthy），原代码崩溃。

### Bug 3：`invoice_payment.paid` 新事件未识别（选 B 跳过）

**位置**：`src/extensions/payment/stripe.ts:359-374`（与 Bug 1 同改）

**根因**：Stripe API 2026-02-25 起新增 `invoice_payment.paid`（payload 是新的 `InvoicePayment` 对象）。代码当作未知事件 throw。

**方案**：选 B（不实现完整支持），把 `invoice_payment.paid` 走 Bug 1 的 silent skip 路径。理由：

1. `invoice.payment_succeeded` 在最新 Stripe 文档（2025-12-15.clover）仍存在，无 deprecation 标记
2. `InvoicePayment` 与 `Invoice` 字段结构不同，完整支持需要新写 `buildPaymentSessionFromInvoicePayment` + 测试，约 150 行代码
3. 生产 webhook 在 Stripe Dashboard 配置仅勾选**5 个事件**（含 `invoice.payment_failed`），不勾 `invoice_payment.paid`
4. dev `stripe listen --events checkout.session.completed,invoice.payment_succeeded,invoice.payment_failed,customer.subscription.updated,customer.subscription.deleted --forward-to localhost:3001/api/payment/notify/stripe` 减少噪音

**Follow-up ticket**：跟踪 Stripe 是否会强制切到 `invoice_payment.paid`，到时迁移。链接到 `docs/tech-debt.md`。

### Bug 4：webhook + callback 并发 race，canonical row 引用裂

**位置**：`src/shared/models/order.ts:200-265`（subscription/credit dedup） + `src/shared/services/payment.ts:233-254`（caller 在 newSubscription 创建后用其 `subscriptionNo` 重写 updateOrder）

**根因**：见 1.2 / 1.3。两条修复要点缺一不可：

#### 4.A schema 加复合 UNIQUE（防止重复行）

```ts
// src/config/db/schema.ts
export const subscription = pgTable(
  'subscription',
  {
    // ... existing columns ...
  },
  (table) => [
    unique('uq_subscription_provider_subscription_id')
      .on(table.paymentProvider, table.subscriptionId),
  ]
);

export const order = pgTable(
  'order',
  {
    // ... existing columns ...
  },
  (table) => [
    unique('uq_order_provider_transaction_id')
      .on(table.paymentProvider, table.transactionId),
  ]
);

export const credit = pgTable(
  'credit',
  {
    // ... existing columns ...
  },
  (table) => [
    // 同一 order 只能授一笔 grant credit；其他 transactionType（如 consume）不受限
    unique('uq_credit_order_grant')
      .on(table.orderNo, table.transactionType),
  ]
);
```

**注意点**：

- `transactionId` 列在 order 表是 nullable（`pending` 状态时无 transaction），**PG 多列 UNIQUE 在任一列 NULL 时不冲突**，所以 pending 期间不会撞键。
- credit 复合键含 `transactionType` 是为了允许同一 order 既有 `grant` 又有 `consume`（业务允许），仅去重 grant。
- 对 paypal / creem provider 同样适用，无需为 stripe 单独定制。

#### 4.B 代码：冲突后取 canonical row，**重写 caller 引用**

`updateOrderInTransaction`（处理 checkout success 和 first invoice）：

```ts
// src/shared/models/order.ts
const result = await db().transaction(async (tx) => {
  let canonicalSubscription: Subscription | null = null;

  if (newSubscription) {
    const [inserted] = await tx
      .insert(subscription)
      .values(newSubscription)
      .onConflictDoNothing({
        target: [subscription.paymentProvider, subscription.subscriptionId],
      })
      .returning();

    if (inserted) {
      canonicalSubscription = inserted;
    } else {
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
      canonicalSubscription = existing;
    }

    // 关键：用 canonical row 重写 caller 持有的 subscription_no
    if (canonicalSubscription &&
        canonicalSubscription.subscriptionNo !== newSubscription.subscriptionNo) {
      // caller-side hand-off: updateOrder + newCredit 引用必须改写
      updateOrder.subscriptionNo = canonicalSubscription.subscriptionNo;
      if (newCredit) {
        newCredit.subscriptionNo = canonicalSubscription.subscriptionNo;
      }
    }
  }

  if (newCredit) {
    const [inserted] = await tx
      .insert(credit)
      .values(newCredit)
      .onConflictDoNothing({
        target: [credit.orderNo, credit.transactionType],
      })
      .returning();
    // 不需要 canonical 重写：credit 是 leaf，没有下游依赖它的 transactionNo
    result.credit = inserted ?? /* fetch existing */;
  }

  // UPDATE order with possibly-rewritten updateOrder
  const [orderResult] = await tx
    .update(order)
    .set(updateOrder)
    .where(eq(order.orderNo, orderNo))
    .returning();
  result.order = orderResult;

  return result;
});
```

`updateSubscriptionInTransaction`（处理 renewal）同样改：

```ts
if (newOrder) {
  const [inserted] = await tx
    .insert(order)
    .values(newOrder)
    .onConflictDoNothing({
      target: [order.paymentProvider, order.transactionId],
    })
    .returning();

  let canonicalOrder: Order;
  if (inserted) {
    canonicalOrder = inserted;
  } else {
    const [existing] = await tx
      .select()
      .from(order)
      .where(
        and(
          eq(order.transactionId, newOrder.transactionId),
          eq(order.paymentProvider, newOrder.paymentProvider)
        )
      );
    canonicalOrder = existing;
  }

  if (newCredit && canonicalOrder.orderNo !== newOrder.orderNo) {
    newCredit.orderNo = canonicalOrder.orderNo;
  }
}
```

#### 4.C cleanup SQL（reference-aware，手动跑一次）

实施前，本地 DB 那 2 条 race 数据要清。**不能简单按 `created_at` 取最早**，因为当前数据情况是 order 指向 B（晚的）、credit 指向 A（早的）。需要先决定 canonical，再修引用，最后删孤儿：

```sql
BEGIN;

-- 1. canonical = 任一行（业务上等价，因为 subscription_id 相同）
--    选择规则：被 credit 引用的那条（credit 已经发，不能重发；order 可改指）
WITH duplicates AS (
  SELECT
    payment_provider,
    subscription_id,
    array_agg(subscription_no ORDER BY created_at) AS all_nos
  FROM subscription
  WHERE subscription_id IS NOT NULL
  GROUP BY payment_provider, subscription_id
  HAVING count(*) > 1
),
canonical_chosen AS (
  SELECT
    d.payment_provider,
    d.subscription_id,
    -- 优先选被 credit 引用的；否则选被 order 引用的；否则取 created_at 最早
    COALESCE(
      (SELECT subscription_no FROM credit
       WHERE subscription_no = ANY(d.all_nos) LIMIT 1),
      (SELECT subscription_no FROM "order"
       WHERE subscription_no = ANY(d.all_nos) LIMIT 1),
      d.all_nos[1]
    ) AS canonical_no,
    d.all_nos
  FROM duplicates d
)
-- 2. 修复 order 引用（指向 canonical）
UPDATE "order" o
SET subscription_no = c.canonical_no
FROM canonical_chosen c
WHERE o.subscription_no = ANY(c.all_nos)
  AND o.subscription_no != c.canonical_no;

-- 3. 修复 credit 引用（理论上当前 credit 已经在 canonical，但保险起见）
UPDATE credit cr
SET subscription_no = c.canonical_no
FROM canonical_chosen c
WHERE cr.subscription_no = ANY(c.all_nos)
  AND cr.subscription_no != c.canonical_no;

-- 4. 现在删孤儿 subscription（没被引用的副本）
DELETE FROM subscription
WHERE subscription_no IN (
  SELECT unnest(all_nos)
  FROM canonical_chosen
) AND subscription_no NOT IN (
  SELECT canonical_no FROM canonical_chosen
);

-- 5. 同样原则处理 order 和 credit 表的潜在重复（本次没观察到，但 schema 加 UNIQUE 前必须清）
-- order 表：当前只 1 条，无需处理。检查命令：
-- SELECT payment_provider, transaction_id, count(*) FROM "order"
-- WHERE transaction_id IS NOT NULL GROUP BY 1,2 HAVING count(*) > 1;

-- credit 表：当前 1 条，无需处理。检查命令：
-- SELECT order_no, transaction_type, count(*) FROM credit
-- GROUP BY 1,2 HAVING count(*) > 1;

COMMIT;
```

加 UNIQUE 前**必须**先跑这段 cleanup，否则 `db:push` 会因约束冲突失败。

### Bug 5：`invoice.payment_failed` 在 mapping 但 route.ts 没分支

**位置**：`src/app/api/payment/notify/[provider]/route.ts:51-136`

**根因**：`mapStripeEventType` 第 366 行映射了 `PAYMENT_FAILED`，但 route.ts 的事件处理只分了 4 个 case（`CHECKOUT_SUCCESS` / `PAYMENT_SUCCESS` / `SUBSCRIBE_UPDATED` / `SUBSCRIBE_CANCELED`），`PAYMENT_FAILED` 落到 `else` 分支：

```ts
} else {
  console.log('not handle other event type: ' + eventType);
}
```

这导致：付款失败的 webhook 进来 → 日志一行 → 200 → **order 状态停留在 `created`，用户卡住但应用层无感知**。

**修复**：加 `PAYMENT_FAILED` 分支：

```ts
} else if (eventType === PaymentEventType.PAYMENT_FAILED) {
  // subscription renewal 或 first payment 失败
  // session.metadata.order_no 可能没有（renewal），按 subscription_id 找
  if (session.subscriptionId) {
    const subscription = await findSubscriptionByProviderSubscriptionId({
      provider,
      subscriptionId: session.subscriptionId,
    });
    if (subscription) {
      await handleSubscriptionPaymentFailed({
        subscription,
        session,
      });
    }
  } else if (session.metadata?.order_no) {
    // first payment failed
    const order = await findOrderByOrderNo(session.metadata.order_no);
    if (order) {
      await updateOrderByOrderNo(order.orderNo, {
        status: OrderStatus.FAILED,
        paymentResult: JSON.stringify(session.paymentResult),
      });
    }
  }
}
```

`handleSubscriptionPaymentFailed` 是新函数，写在 `src/shared/services/payment.ts`：

```ts
export async function handleSubscriptionPaymentFailed({
  subscription,
  session,
}: { subscription: Subscription; session: PaymentSession }) {
  // 标记订阅为 past_due 或挂起；不立刻 cancel（Stripe 默认会 retry 3 次）
  await updateSubscriptionBySubscriptionNo(subscription.subscriptionNo, {
    status: SubscriptionStatus.PAUSED,
    // 可选：写入 last_failed_at 字段（schema 不存在则跳过）
  });
}
```

**SubscriptionStatus.PAUSED 的处理**：types.ts 已经有这个枚举，shared/types/blocks/pricing.d.ts 用它判断"是否可访问 Pro 功能"。检查现有逻辑是否正确处理 PAUSED → 用户应该看到"支付失败，请更新支付方式"提示。

### Bug 6：webhook handler 所有错误返回 200

**位置**：`src/app/api/payment/notify/[provider]/route.ts:140-145`

**根因**：

```ts
} catch (err: unknown) {
  console.error('handle payment notify failed', err);
  return Response.json({ code: -1, message: `...` });  // 默认 200
}
```

注释说"防止 provider 重试风暴"，但这违反 Stripe 官方推荐：**Stripe 期望非 2xx 触发重试**，幂等性应该靠应用层保证（5xx 时 Stripe 重试 3 天，每次重试 webhook 进来代码应能识别"已处理"并幂等返回 200）。当前设计**吞掉所有错误**，遇到下面情况会丢账：

- 网络抖动导致 DB 写入失败（暂时性错误）→ 应该 5xx 让 Stripe 重试
- 代码 bug → 5xx + 真错误堆栈到监控 → 修了 redeploy → Stripe 重试时跑通

**修复**：错误类型分级返回：

```ts
} catch (err: unknown) {
  // 1. 签名验证失败 → 400（Stripe 不会重试，是客户端错误）
  if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
    console.error('webhook signature verification failed', err);
    return Response.json(
      { code: -1, message: 'invalid signature' },
      { status: 400 }
    );
  }

  // 2. 业务幂等性已经处理（重复事件） → 200
  //    （UNIQUE 约束 + onConflictDoNothing 不会抛错，所以这里基本不会触发）

  // 3. 其他真实错误 → 500，让 Stripe 重试
  console.error('handle payment notify failed', err);
  // TODO: Sentry.captureException(err)
  return Response.json(
    { code: -1, message: `handle payment notify failed` },
    { status: 500 }
  );
}
```

**注意**：现在的"未知事件" 200 由 Bug 1 的 silent skip 处理（`getPaymentEvent` 返回 null → route 返回 `{ code: 0, message: 'ignored' }` 200）。

### Bug 7：credit 重复授信 race（与 Bug 4 同根但单独列）

**位置**：`src/shared/models/order.ts:231-249`

**根因**：与 Bug 4 同样的 check-then-insert 模式，不在 v1 列出。Codex 指出：renewal webhook 可能重发，导致同一笔 invoice 触发两次 credit grant。

**修复**：已在 Bug 4.A 中通过 `unique('uq_credit_order_grant').on(orderNo, transactionType)` + 4.B 的 `onConflictDoNothing` 覆盖。本节不重复代码，但单独列出确保不被遗忘。

## 3. 实施顺序

| 步骤 | 任务 | 预估 | 阻塞 |
|---|---|---|---|
| 0 | 创建 worktree `fix/stripe-webhook-canonical-rows` | 5 min | 无 |
| 1 | Bug 2（discount 数组）：单行 fix | 5 min | 步骤 0 |
| 2 | Bug 1（unknown event silent skip）：返回 null + 接口同步 | 30 min | 步骤 0 |
| 3 | Bug 3：仅文档调整 + dev 文档示例 `stripe listen --events ...` | 15 min | 步骤 2 |
| 4 | Bug 5（PAYMENT_FAILED 分支 + handleSubscriptionPaymentFailed）| 45 min | 无 |
| 5 | Bug 6（webhook 错误码分级）| 30 min | 步骤 1 |
| 6 | Bug 4 + 7 schema 改动 + cleanup SQL：本地手跑、`pnpm db:generate` 生成 migration | 60 min | 无 |
| 7 | Bug 4 + 7 代码：onConflict + canonical 重写 + 接口同步 | 90 min | 步骤 6 |
| 8 | 测试套件改写（详见 §4） | 90 min | 步骤 1-7 |
| 9 | 端到端复测：truncate → register → checkout → 检 6 个 invariant | 30 min | 步骤 1-8 |
| 10 | Sentry hookup（最低限度：webhook route 调 captureException）| 30 min | 步骤 5 |
| 11 | 清理 `tmp/check.mjs`、`tmp/race-evidence.mjs` | 5 min | 步骤 9 |
| 12 | 更新 `docs/payment/stripe-setup.md`：webhook 5 个事件、`stripe listen --events` 示例 | 20 min | 步骤 3 |

**预计总耗时 7 小时**（v1 估算 3 小时不可信）。

## 4. 测试用例（Codex 指定 6 类必测）

### 4.1 单元测试

`tests/unit/payment/stripe-event-mapping.test.ts`（新建）

- ✅ 已知事件返回正确枚举（5 个）
- ✅ 未知事件返回 null（不抛错）
- ✅ 签名错误抛 `StripeSignatureVerificationError`（不被 null 吞掉）

`tests/unit/payment/stripe-invoice-discount.test.ts`（新建）

- ✅ `total_discount_amounts: undefined` → 0
- ✅ `total_discount_amounts: null` → 0
- ✅ `total_discount_amounts: []` → 0
- ✅ `[{amount: 500}]` → 500
- ✅ `[{amount: 100}, {amount: 200}]` → 100（保留旧行为）

### 4.2 集成测试（必须用真 PG，不是 mock）

`tests/integration/subscription-race.test.ts`（新建）

测试基础设施：用 testcontainers 起一次性 PG 容器，或用 dev DB 的隔离 schema。**Vitest mock DB 不能模拟 UNIQUE 冲突**。

- ✅ **Race-1**：并发两次 `processSuccessfulPayment(order, session)`，断言：
  - subscription 表只有 1 条 row
  - order.subscription_no 等于 credit.subscription_no（canonical 一致）
  - credit 表只有 1 条
- ✅ **Race-2**：先调 path A 再调 path B（顺序），同样不重复
- ✅ **Race-3**：renewal 重发 invoice，断言：order 不重复、credit 不重发（额度只发一次）
- ✅ **Failed-payment**：模拟 `invoice.payment_failed` 事件 → subscription 状态变为 PAUSED（不是 cancel）
- ✅ **Webhook-error-codes**：
  - 未知事件 → 200 `{code:0,message:'ignored'}`
  - 签名错误 → 400
  - DB 写入抛错（mock 一次） → 500（让 Stripe 重试）

### 4.3 现有测试质量整改

`tests/integration/subscription-lifecycle.test.ts` 现状：多处只断言 "不抛错" 或 "length >= 0"。本 PR 必须把以下断言收紧：

- 所有 "expect(result).not.toThrow()" → 替换为对返回值的具体断言
- 所有 "expect(rows.length).toBeGreaterThanOrEqual(0)" → 替换为精确长度
- 至少一个测试覆盖 webhook + callback 顺序到达，断言数据一致

不补这一节，race 修复回归没保证。

## 5. 端到端复测 checklist（步骤 9）

清空业务表（保留 RBAC）：

```sql
TRUNCATE
  "order", subscription, credit,
  daily_usage, upg_daily_quota,
  experiment_progress, learning_stats, learning_path_progress,
  consent_event, privacy_request,
  "user", session, account
CASCADE;
```

之后跑：

1. `/sign-up` 注册 + `pnpm rbac:assign --email=... --role=super_admin`
2. `/admin/settings/payment` 填 Stripe 凭据并保存
3. `stripe listen --events checkout.session.completed,invoice.payment_succeeded,invoice.payment_failed,customer.subscription.updated,customer.subscription.deleted --forward-to localhost:3001/api/payment/notify/stripe`
4. `/pricing` → Pro Monthly → `4242 4242 4242 4242` 支付
5. dev log：**0 个** "Unknown Stripe event type" 错误
6. dev log：**0 个** "Cannot read properties of undefined" 错误
7. DB 检查（必须全部 satisfied）：

```text
6 个 invariant：
1. order count = 1, status='paid', subscription_no IS NOT NULL
2. subscription count = 1, status='active'
3. credit count = 1, transaction_type='grant'
4. order.subscription_no == subscription.subscription_no（canonical 一致）
5. credit.subscription_no == subscription.subscription_no
6. credit.order_no == order.order_no
```

任一不 satisfied → 阻塞合并。

## 6. 回滚

- Bug 1/2/3/5/6/7 代码：`git revert <commit>`
- Bug 4 schema：保留 migration 文件，回滚 SQL：

```sql
ALTER TABLE subscription DROP CONSTRAINT uq_subscription_provider_subscription_id;
ALTER TABLE "order" DROP CONSTRAINT uq_order_provider_transaction_id;
ALTER TABLE credit DROP CONSTRAINT uq_credit_order_grant;
```

代码 revert 回 check-then-insert。

如果生产已经有真实 race 数据，cleanup SQL 是有损的（删孤儿 subscription）。**实施前必须备份**：

```bash
pg_dump $DATABASE_URL --table=subscription --table='"order"' --table=credit \
  > backup-pre-stripe-race-fix-$(date +%Y%m%d).sql
```

## 7. 留给 Codex v2 评审的开放问题

v1 的 6 个开放问题 Codex 已表态，本节只剩**新出现的**或**v1 关闭后衍生的**问题：

1. **canonical row 选择策略**：cleanup SQL 选"被 credit 引用的"作 canonical。如果 credit 也漂移了（极端场景：连 credit 都 race 过一次），就没有"被引用"作排序依据。是否要加二级 fallback：选 `subscription_id` 在 Stripe 上最新一次 retrieve 的 status？（Stripe API 调用，慢，仅极端场景需要）
2. **`invoice.payment_failed` 的 DB 状态映射**：本计划用 `SubscriptionStatus.PAUSED`。Stripe 提供 `subscription.status='past_due'` 状态（不是 paused），是否要在 schema 加新值？
3. **测试基础设施**：用 testcontainers 起一次性 PG vs 用 dev DB 隔离 schema。前者每个 PR 多 ~30s CI 时间，后者要解决 schema 切换。Codex 倾向哪个？
4. **Sentry hookup（步骤 10）**：最低限度只在 webhook route 调 `captureException`，是否够？还是要把整个 `src/extensions/payment` 的所有 throw 路径都接上？
5. **migration 顺序**：步骤 6 先 cleanup SQL 再 `db:generate`，但 Drizzle migration 通常是 schema-first（先改 schema → 生成 migration → 跑 migration）。Codex 觉得手写 cleanup SQL 应该**前置**到 migration 文件里，还是单独跑？

## 8. 评审 checklist（请 Codex 按此打分）

- [ ] Bug 4 canonical row 重写逻辑是否正确（4.B 代码片段）
- [ ] cleanup SQL 是否处理了所有引用情况（包括边缘场景）
- [ ] schema 复合 UNIQUE 在 `transaction_id NULL` 期间不会撞键的假设是否正确
- [ ] Bug 5 的 PAUSED 状态选择是否合适
- [ ] Bug 6 的错误码分级是否漏分类
- [ ] Bug 7 的 credit `(order_no, transaction_type)` UNIQUE 是否过严（业务上 grant 是不是真的应该一对一）
- [ ] §4 测试用例是否覆盖了你 v1 review 里要求的 6 类
- [ ] §5 6 个 invariant 是否充分
- [ ] §7 5 个新开放问题给立场
- [ ] 实施顺序（§3）有无更优排列
