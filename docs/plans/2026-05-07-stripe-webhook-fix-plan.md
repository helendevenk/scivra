# Stripe Webhook & Payment Race 修复计划

> 关联事件：2026-05-07 完成首笔本地 Stripe 测试支付（pro-monthly $4.99），主流程跑通但 webhook handler 暴露 4 个 bug。
> 状态：**草案，待 Codex 评审，评审通过后再动手修。**
> 负责人：Claude（实现）+ Codex（评审 + 二次评审）

## 1. 背景与证据

### 1.1 现场观察

完成一笔 Stripe 测试 checkout（用户 helendevenk@gmail.com，pro-monthly $4.99）后：

DB 状态（`SELECT FROM order/subscription/credit`）：

- `order` 1 条：`order_no=82047712309581354`，status=`paid`，stripe，subscription，499/usd，pro-monthly ✅
- `subscription` **2 条**：`82047744173350945` 和 `82047743662893392`，都 active，相同产品/金额/周期 ⚠️
- `credit` 1 条：400 credits，绑到 `82047743662893392` ✅
- `user` 1 条：helendevenk@gmail.com ✅

dev server 日志（`pnpm dev` tail）摘录：

```
handle payment notify failed Error: Unknown Stripe event type: payment_intent.created
handle payment notify failed Error: Unknown Stripe event type: payment_method.attached
handle payment notify failed Error: Unknown Stripe event type: invoice.created
handle payment notify failed TypeError: Cannot read properties of undefined (reading 'amount')
    at StripeProvider.buildPaymentSessionFromInvoice (src/extensions/payment/stripe.ts:495:47)
handle payment notify failed Error: Unknown Stripe event type: invoice_payment.paid
GET /api/payment/callback?order_no=82047712309581354 307 in 5.2s
GET /settings/billing 200 in 9.1s
```

### 1.2 业务影响

主流程跑通是因为 `/api/payment/callback` GET fallback 兜底了。但 webhook 这条路径上的 4 个 bug 在以下场景会出真问题：

| 场景 | 影响 |
|---|---|
| 用户付款后立刻关浏览器，`callback` 没机会跑 | order 留在 `created` 状态，subscription 不写，credit 不发，**用户钱付了功能没开** |
| 月度续费（无 callback 触发）| 100% 走 webhook，bug 4（race）此时不存在但 bug 1/2/3 仍然爆 |
| 新版 Stripe API 账号 | `invoice_payment.paid` 是常态事件，**当前代码完全不识别** |
| 生产部署 | webhook handler 兜底返回 200 防风暴，错误**静默丢失**（未接 Sentry） |

## 2. Bug 列表与修复方案

### Bug 1：`mapStripeEventType` 对未知事件 throw

**位置**：`src/extensions/payment/stripe.ts:359-374`

**根因**：`switch` 的 default 分支直接 `throw new Error('Unknown Stripe event type: ...')`。Stripe 默认会推送几十种事件，本地 `stripe listen` 转发**所有事件**，dev 环境每笔订单会撞 4-6 个无关事件，每个都触发一次 throw。生产即使在 Dashboard 配置只勾少数事件，Stripe 后续新增事件类型仍会让代码崩。

**已观察的"无关"事件**（我们不关心，应该 silent skip）：

- `payment_intent.created`
- `payment_method.attached`
- `invoice.created`
- `customer.created`、`charge.succeeded` 等（log 里没出现但理论上同样会被发）

**修复**：把"未知事件"从异常改为**显式 skip**。

```ts
private mapStripeEventType(eventType: string): PaymentEventType | null {
  switch (eventType) {
    case 'checkout.session.completed':
      return PaymentEventType.CHECKOUT_SUCCESS;
    case 'invoice.payment_succeeded':
    case 'invoice_payment.paid':  // Bug 3 一并处理，见下
      return PaymentEventType.PAYMENT_SUCCESS;
    case 'invoice.payment_failed':
      return PaymentEventType.PAYMENT_FAILED;
    case 'customer.subscription.updated':
      return PaymentEventType.SUBSCRIBE_UPDATED;
    case 'customer.subscription.deleted':
      return PaymentEventType.SUBSCRIBE_CANCELED;
    default:
      return null;  // unknown / unhandled events
  }
}
```

调用方 `getPaymentEvent` 改为：拿到 `null` 就返回一个特殊值，`route.ts` 端 short-circuit。或者更简单，让 `getPaymentEvent` 在拿到 `null` 时**抛一个特定的 sentinel 错误**类型，让 `notify/[provider]/route.ts` 区分"未知事件"和"真实异常"。

**推荐做法**（更克制）：在 `getPaymentEvent` 内 verify signature 后，如果事件类型是 null，直接返回一个 `{ eventType: 'ignored', ... }` 或抛 `IgnorableEventError`。`route.ts` 端：

```ts
try {
  const event = await paymentProvider.getPaymentEvent({ req });
  // ...
} catch (err: unknown) {
  if (err instanceof IgnorableEventError) {
    return Response.json({ code: 0, message: 'ignored' });
  }
  // existing error handling
}
```

**测试**：单测覆盖
1. 未知事件 → 不抛错，返回 200/ignored
2. 已知事件 → 走原路径
3. 签名错误 → 仍抛错（不能被新逻辑吞掉）

### Bug 2：`total_discount_amounts[0].amount` 数组下标越界

**位置**：`src/extensions/payment/stripe.ts:494-496`

**根因**：

```ts
discountAmount: invoice.total_discount_amounts
  ? invoice.total_discount_amounts[0].amount
  : 0,
```

`total_discount_amounts` 是 `Stripe.Invoice.TotalDiscountAmount[] | null`。当用户没用 promo code 时，**它是空数组 `[]`，不是 null**。`[]` 是 truthy → 进入分支 → `[0]` 是 `undefined` → `.amount` 崩。

**修复**：用 optional chaining + fallback。

```ts
discountAmount: invoice.total_discount_amounts?.[0]?.amount ?? 0,
```

**测试**：单测
1. `total_discount_amounts: undefined` → 0
2. `total_discount_amounts: null` → 0
3. `total_discount_amounts: []` → 0
4. `total_discount_amounts: [{ amount: 500, ... }]` → 500
5. `total_discount_amounts: [{ amount: 100 }, { amount: 200 }]` → 100（保留旧行为，只取首个）

### Bug 3：`invoice_payment.paid` 新事件未识别

**位置**：`src/extensions/payment/stripe.ts:359-374`（同 Bug 1）

**根因**：从 Stripe API version 2026-02-25 起，新增 `invoice_payment.paid` 事件，对应新引入的 `InvoicePayment` 对象（与 `Invoice` 不同 schema）。老事件 `invoice.payment_succeeded` 仍然存在并会同时发送（双写），但**新版 API 账号可能优先用新事件**。

证据（Context7 Stripe docs）：

- `invoice.payment_succeeded`：data.object 是 `Invoice`（仍在 2025-12-15.clover 中存在）
- `invoice_payment.paid`：data.object 是 `InvoicePayment`（新对象，2026-02-25.clover 引入）

**两种修复路径**：

**A. 双订阅 + 双 schema 处理**（完整支持）

- 在 `mapStripeEventType` 里把两个事件都映射到 `PAYMENT_SUCCESS`
- 在 `getPaymentEvent` 里根据 raw event type 分流到 `buildPaymentSessionFromInvoice`（旧）或 `buildPaymentSessionFromInvoicePayment`（新，需要新写）
- 风险：`InvoicePayment` 的字段集和 `Invoice` 不同（amount_paid vs InvoicePayment.amount，customer_email vs ...），需要逐字段比对

**B. 只订阅旧事件，跳过新事件**（简化）

- `mapStripeEventType` 仅识别 `invoice.payment_succeeded`，`invoice_payment.paid` 走 Bug 1 的 silent skip
- 在生产 Stripe Dashboard webhook 配置里**仅勾选 4 个 v1 事件**（不勾 `invoice_payment.paid`）
- 风险：将来 Stripe 弃用 `invoice.payment_succeeded`（目前未公告），需要重新评估

**推荐方案 B**，原因：

1. `invoice.payment_succeeded` 在 Stripe 文档里没有任何 deprecation 标记，仍是首选事件
2. 重写一份 `InvoicePayment` 处理逻辑要 ~150 行代码 + 测试，与本次"修 webhook bug"的紧迫性不匹配
3. 上线 webhook endpoint 时 Stripe Dashboard 配置粒度足够细，可以精准订阅
4. 留一个 follow-up ticket 跟踪 Stripe 是否会强制切换到新事件

**实现细节**：

- 文档（`docs/payment/stripe-setup.md`）"production webhook events"部分**显式列 4 个事件**：`checkout.session.completed`、`invoice.payment_succeeded`、`customer.subscription.updated`、`customer.subscription.deleted`，**额外**添加 `invoice.payment_failed`（已在 stripe.ts 里映射但代码注释没强调）
- 验证：`grep -r 'invoice_payment.paid' src/` 应无新代码引用
- dev `stripe listen` 没办法过滤事件，所以 dev 仍会收到 `invoice_payment.paid`，但 Bug 1 修完后不会爆错

### Bug 4：重复 subscription 行（webhook + callback 并发竞态）

**位置**：`src/shared/models/order.ts:200-228`（`updateOrderInTransaction` 内的 dedup 逻辑）

**根因**：

`processSuccessfulPayment` 被两条路径**几乎同时**调用：

1. 用户支付完成 → Stripe POST `/api/payment/notify/stripe` → `handleCheckoutSuccess`
2. 用户被 redirect 到 `/api/payment/callback?order_no=xxx` → 也调 `handleCheckoutSuccess`

`updateOrderInTransaction` 的 dedup 检查：

```ts
const [existingSubscriptionResult] = await tx
  .select()
  .from(subscription)
  .where(
    and(
      eq(subscription.subscriptionId, newSubscription.subscriptionId),
      eq(subscription.paymentProvider, newSubscription.paymentProvider)
    )
  );

if (!existingSubscription) {
  // create subscription
  await tx.insert(subscription).values(newSubscription).returning();
}
```

这是**经典的 check-then-insert 竞态**：在 PostgreSQL 默认 READ COMMITTED 隔离级别下，两个并发事务都能读到"不存在"，然后两个都 INSERT。

证据：DB 里 2 条 subscription 行，`subscription_id`（Stripe 的 sub id）应该是相同的（来自同一个 Stripe Subscription），但本地 `subscription_no`（自生成 SnowID）是 2 个不同值，**正是 race 的指纹**。

需要在评审时验证一条 SQL：

```sql
SELECT subscription_no, subscription_id, payment_provider, created_at
FROM subscription
ORDER BY created_at;
```

如果两条 row 的 `subscription_id` 相同 → 100% race。

**修复**：在 `subscription` 表上加 **UNIQUE 约束**，让 DB 拒绝重复，再让代码用 INSERT ... ON CONFLICT 处理。

**Step 1：加 UNIQUE 约束（schema 改动 + 迁移）**

```ts
// src/config/db/schema.ts
export const subscription = pgTable('subscription', {
  // ... existing columns ...
}, (table) => [
  uniqueIndex('subscription_provider_subscription_id_uniq')
    .on(table.paymentProvider, table.subscriptionId),
]);
```

**Step 2：迁移前数据清理（重要）**

加 UNIQUE 之前必须先去重现有数据。本地只有 2 条 row 是测试 race 留下的，prod 还没数据，影响小。但作为通用步骤：

```sql
-- 保留 created_at 最早那条，删后面的
DELETE FROM subscription
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY payment_provider, subscription_id
      ORDER BY created_at ASC
    ) AS rn
    FROM subscription
    WHERE subscription_id IS NOT NULL AND payment_provider IS NOT NULL
  ) t
  WHERE rn > 1
);
```

**Step 3：代码改用 ON CONFLICT 取代 check-then-insert**

```ts
// src/shared/models/order.ts
const [subscriptionResult] = await tx
  .insert(subscription)
  .values(newSubscription)
  .onConflictDoNothing({
    target: [subscription.paymentProvider, subscription.subscriptionId],
  })
  .returning();

if (!subscriptionResult) {
  // 已存在，重新 SELECT 拿出来
  const [existing] = await tx
    .select()
    .from(subscription)
    .where(
      and(
        eq(subscription.subscriptionId, newSubscription.subscriptionId),
        eq(subscription.paymentProvider, newSubscription.paymentProvider)
      )
    );
  result.subscription = existing;
} else {
  result.subscription = subscriptionResult;
}
```

**同样的修复也要应用到 `order` 表的 dedup 逻辑**（`updateSubscriptionInTransaction` 第 298-326 行的 newOrder check-then-insert）。`order` 表用 `(transactionId, paymentProvider)` 做 UNIQUE。

**测试**：

1. 单测：模拟 race 场景（两个 promise 并发调用 processSuccessfulPayment），断言只有 1 条 subscription
2. 集成测试：真实跑一笔 Stripe checkout，验证只有 1 条 subscription
3. 回归测试：确认现有的"webhook 先到、callback 后到"和"callback 先到、webhook 后到"两种顺序都只产 1 条

## 3. 实施顺序

| 步骤 | 任务 | 预估时间 | 阻塞 |
|---|---|---|---|
| 1 | Bug 2（discount 数组越界）：单行 fix + 单测 | 15 min | 无 |
| 2 | Bug 1（unknown event silent skip）：改 mapStripeEventType + getPaymentEvent + route.ts + 单测 | 45 min | 无 |
| 3 | Bug 3（doc 修订）：更新 `docs/payment/stripe-setup.md` 列出 4 个事件 + follow-up ticket | 15 min | 步骤 2 |
| 4 | Bug 4（race）：schema migration + 数据清理 + onConflictDoNothing + 测试 | 90 min | 无（但 schema 改动需要 db:push） |
| 5 | 端到端复测：清空 DB → 起 dev → 走一笔 checkout → 验证 1 个 order/sub/credit | 30 min | 1-4 全部完成 |
| 6 | 清理临时调试脚本 `tmp/check.mjs` | 5 min | 5 之后 |

**预计总耗时 3 小时**。

## 4. 测试与验证

### 4.1 单元测试

- `tests/unit/payment/stripe-event-mapping.test.ts`（新建）
  - 已知事件返回正确枚举
  - 未知事件返回 null
  - signature 验证失败仍正常抛错
- `tests/unit/payment/stripe-invoice-discount.test.ts`（新建）
  - 5 种 `total_discount_amounts` 边界条件
- `tests/unit/services/payment.test.ts`（增量）
  - 并发调用 processSuccessfulPayment，断言只 1 条 subscription
  - 同一 `subscription_id` 第二次 insert 应当复用第一条（onConflictDoNothing 路径）

### 4.2 端到端验证（手动）

1. `TRUNCATE "order", subscription, credit, "user" CASCADE;`（保留 RBAC 表）
2. 重新注册 + super_admin
3. 走一笔 pro-monthly checkout
4. 检查：
   - `order` 1 条 status=paid
   - `subscription` **1 条**（关键）status=active
   - `credit` 1 条 400/active
   - dev log 里无 `Unknown Stripe event type` 错误
   - dev log 里无 `Cannot read properties of undefined` 错误

### 4.3 回归

- `pnpm lint && pnpm tsc --noEmit && pnpm test` 必须全过
- 现有的 `tests/unit/services/payment.test.ts` 已 mock `stripe_secret_key='sk_test'`，新逻辑不能让现有测试失败

## 5. 回滚

- Bug 1/2/3 都是纯代码改动，git revert 即可
- Bug 4 涉及 schema 迁移：需要保留旧迁移文件，回滚时
  - `DROP INDEX subscription_provider_subscription_id_uniq;`
  - 代码 revert 回 check-then-insert
- 如果生产已经有真实 race 数据，Step 2 的数据清理 SQL 是有损的（删除重复行），**应在评审时确认是否要先备份**

## 6. 留给 Codex 评审的开放问题

1. **`invoice_payment.paid` 双订阅风险**：选项 B 假设 Stripe 不会很快弃用 `invoice.payment_succeeded`。Codex 是否有更近期的 Stripe roadmap 信息可以验证？如果 Stripe 准备 deprecate，应该走选项 A。
2. **race 修复的另一种路径**：用 PostgreSQL `SERIALIZABLE` 隔离级别 + 重试 vs 加 UNIQUE + ON CONFLICT。本计划选了后者（更可预测、性能更好）。Codex 是否同意？
3. **`order` 表的 dedup 同样要改吗**？现在 `order` 表也有 check-then-insert，但 `order_no` 是我们自生成的，理论上不会重复（除非 SnowID 冲突，概率极低）。`updateSubscriptionInTransaction` 创建续费 order 时用 `transactionId` 做 dedup key，**这里也有 race 风险**（renewal 事件可能 webhook 重发）。建议同样加 UNIQUE。Codex 同意吗？
4. **webhook handler 静默 200 的设计**（`route.ts:144`）：注释说"防止 Stripe 重试风暴"。这是反 Stripe 官方推荐（应该返回 5xx 触发 retry，幂等性靠应用层）。本次修复**不动**这个设计，但在 follow-up ticket 标记。Codex 同意暂不改吗？
5. **测试覆盖度**：本计划不要求 100% coverage。Codex 觉得最低应该测哪些？
6. **是否需要先用 git worktree 隔离这次修复**？工作量约 3 小时，文件改动跨 3-4 个文件，可能影响其他开发分支。建议在 `fix/stripe-webhook-race` 分支上做，最后单 PR 合并。

## 7. 评审 checklist

请 Codex 按以下维度评估：

- [ ] 根因分析是否准确（4 个 bug 是否都识别正确、有无遗漏）
- [ ] Bug 3 选 B 不选 A 的论证是否成立
- [ ] Bug 4 的 race 假设是否需要 SQL 验证（subscription_id 相同？）
- [ ] schema 迁移路径是否有遗漏（外键、索引、回滚步骤）
- [ ] 测试用例是否充分
- [ ] 实施顺序有没有可优化的地方
- [ ] 第 6 节 6 个开放问题给出立场
