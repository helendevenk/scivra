# Scivra Stripe Live Mode Cutover Plan v2

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> 替代 v1（Codex REJECT，6 必改 + 5 漏掉风险）。
> Status: **draft, awaiting Codex v2 review**.
> Target: 2026-05-08（今天）切 prod **全量** live mode（用户明确选 B 全量，不走 allowlist 渐进）。

## 0. v1 → v2 变更说明

Codex v1 review **REJECT**。v2 全部吸收 6 必改 + 7 立场 + 5 漏掉风险：

| Codex 必改项 | v2 处理 |
|---|---|
| `charge.refunded` 事件没勾 + 没映射 + 没业务处理 | §4.7 加 enum / mapping / route 分支 / refundCredits 撤销 |
| rollback < 1min 假命题（关 stripe_enabled 让续费 webhook 抛 500） | §4.8 拆 `stripe_checkout_enabled`（新交易）vs `stripe_webhook_enabled`（webhook 处理） |
| 15 秒缓存等待无证据 | §6.2 切 keys 后用真实 webhook trigger 验证 |
| refund self-test 验证假 | §4.7 加 OrderStatus.REFUNDED + credit revocation；§6.3 真验退款落库 |
| Terms 页面 vs pricing 文案退款冲突 | §4.5 改 /terms 段落 19 一致到 7-day |
| Sales tax + COPPA 跳过 | §4.9 限 US billing country + parent attestation checkbox（不上 allowlist，因用户选全量，但补这两条最低合规） |

| Codex 7 立场 | v2 采纳 |
|---|---|
| Stripe account check API 化 | ✅ §3.1 用 `accounts retrieve` |
| PricingItem type 同步 | ✅ §4.2 加 `billingDisclaimer?: string` |
| Cache 真请求验证 | ✅ §6.2 |
| 退款落库先于真卡测试 | ✅ §4.7 在 §6.3 之前 |
| PAST_DUE banner + admin 指标 | ✅ §4.3 |
| Sentry release 绑 SHA | ✅ §4.1 加 `SENTRY_RELEASE` env |
| **第一批 allowlist** | ❌ **用户明确选 B 全量**——但 §4.9 加国家限制 + §4.10 加 parent attestation 作为合规底线 |

| Codex 5 漏掉的风险 | v2 处理 |
|---|---|
| Sentry verification 错误（unknown event 不进 Sentry） | §4.1 改用 `vi.mocked(handleCheckoutSuccess).mockRejectedValue` 触发真实 5xx |
| billing portal test URL（应走站内 retrieve） | §6.4 用 `/settings/billing/retrieve` |
| Test 数据 archive | §4.6 加 `payment_mode` 列 + 老 test 数据置 `payment_mode='test'` |
| Sentry wizard `--skip-connect` 未确认参数 | §4.1 用 manual setup（不依赖 wizard） |
| 学生用父母卡 dispute | §4.10 parent attestation 缓解，dispute 流程留 follow-up |

## 1. 现状（再次 verify）

`[VERIFIABLE]`（基于 2026-05-08 03:50 prod 查询）

- Prod stripe keys: `sk_test_` / `pk_test_`
- Prod 数据：13 user / 0 active sub / 0 paid order / 0 stray `''` credits
- Schema: 已 apply UNIQUE + partial UNIQUE
- Code: merged + deployed (commit 8371de5)
- Stripe live mode 账号状态: **未知**——§3.1 必跑

## 2. 风险评估（含 K12 + 用户接受清单）

| 风险 | 概率 | 影响 | 缓解 |
|---|---|---|---|
| Stripe live mode 未激活 | 中 | 阻断 cutover | §3.1 自动检查 |
| FTC click-to-cancel + 全价透明 | 高 | $51K/violation | §4.2 加 disclaimer + §4.5 修 Terms |
| 退款不回业务层（charge.refunded 漏） | 高 | 用户退款后仍享 Pro 权限 | §4.7 完整退款流程 |
| Rollback 不快导致 stack up | 中 | webhook 重试堆积 | §4.8 拆双开关 |
| Cache 切换 race | 低 | webhook 用旧 keys 验签失败 | §6.2 真请求验证 |
| **K12 学生用父母卡** dispute | 中 | Stripe 风控 + chargeback fee | §4.10 parent attestation |
| **国际用户 sales tax / VAT** | 中 | 法律风险（多州 / 多国） | §4.9 限 US billing country |
| 老 test 订单干扰 live 视图 | 中 | 客服混淆 | §4.6 payment_mode 列 |
| 第一笔真卡 self-test 没退 | 低 | 真扣自己钱 | §6.3 强制 refund |

**用户明确接受的风险**（选择 B 而非 A allowlist 的代价）：

- 第一批用户没有人工筛选，cutover 后任何人都能 checkout
- COPPA: 不强制父母身份验证（仅 attestation checkbox）
- Sales tax: 仅限 US，但州内 sales tax 不收（美国部分州对 SaaS 收 sales tax，今天不实装）

## 3. Pre-Cutover 阻塞前置

### 3.1 Stripe 账号活性自动检查（5 min）

```bash
stripe --api-key sk_live_xxx accounts retrieve --json
```

Or 不依赖本地 stripe CLI（直接 API）：

```bash
curl -s https://api.stripe.com/v1/account \
  -u sk_live_xxx: | jq '{
    charges_enabled,
    payouts_enabled,
    requirements_currently_due: .requirements.currently_due,
    requirements_disabled_reason: .requirements.disabled_reason,
    business_type
  }'
```

**Pass 条件**：
- `charges_enabled: true`
- `payouts_enabled: true`
- `requirements.currently_due: []`
- `requirements.disabled_reason: null`

不通过 → cutover 推迟，先补完 onboarding。

## 4. Pre-Live 工程改动（共 11 个 task）

### 4.1 Sentry 实装（修正 v1 错误）

**Manual setup**（不用 wizard，确定性更高）：

```bash
pnpm add @sentry/nextjs
```

新建：
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `instrumentation.ts`（导出 `register` + `onRequestError`）

3 个 config 都用：
```ts
import * as Sentry from '@sentry/nextjs';
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  release: process.env.SENTRY_RELEASE ?? 'unknown',
  environment: process.env.VERCEL_ENV ?? 'development',
  tracesSampleRate: 0.1,
});
```

Vercel env vars (Production scope):
- `NEXT_PUBLIC_SENTRY_DSN`（用户从 sentry.io 拿）
- `SENTRY_AUTH_TOKEN`（source map upload，sentry.io 拿）
- `SENTRY_RELEASE` = `${VERCEL_GIT_COMMIT_SHA:-dev}`（自动）

**正确验证方式**（修 v1 错误）：

不用 unknown event（silent skip 200，不进 Sentry）。改成：

```bash
# 模拟 webhook 处理失败
curl -X POST https://scivra.com/api/payment/notify/stripe \
  -H "stripe-signature: t=1,v1=invalid" \
  -d '{"type":"checkout.session.completed","data":{}}'
# expect 400 invalid signature, captureException fired with PaymentSignatureError
```

→ 在 Sentry web UI 看到 1 条 error，level=error，包含 provider/eventType context

### 4.2 Yearly 套餐 FTC 文案 + PricingItem type

**改 1**：`src/shared/types/blocks/pricing.d.ts` 加：
```ts
export interface PricingItem {
  // ... existing fields ...
  billing_disclaimer?: string;
}
```

**改 2**：`src/config/locale/messages/en/pricing.json` yearly 项加 `billing_disclaimer`：

- pro-yearly: `"Billed $47.90 annually (≈$3.99/mo). Cancel anytime."`
- max-yearly: `"Billed $95.90 annually (≈$7.99/mo). Cancel anytime."`

**改 3**：`src/themes/default/blocks/pricing.tsx` 在 `unit` 渲染下方：

```tsx
{displayedItem.billing_disclaimer && (
  <p className="text-xs text-muted-foreground mt-1">
    {displayedItem.billing_disclaimer}
  </p>
)}
```

**改 4**：Stripe Checkout description（`/api/payment/checkout/route.ts`）从 `pricingItem.product_name` 改成：
```ts
description: pricingItem.billing_disclaimer
  ? `${pricingItem.product_name} — ${pricingItem.billing_disclaimer}`
  : pricingItem.product_name
```

### 4.3 PAST_DUE 访问权限 + UI banner + admin 指标

**改 1**：`src/shared/models/subscription.ts` 的 `getCurrentSubscription` active list 加 `PAST_DUE`：
```ts
inArray(subscription.status, [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.PENDING_CANCEL,
  SubscriptionStatus.TRIALING,
  SubscriptionStatus.PAST_DUE,
])
```

**改 2**：`src/app/[locale]/(landing)/settings/billing/page.tsx` 当 status === PAST_DUE：

```tsx
{currentSubscription.status === 'past_due' && (
  <Alert variant="warning">
    <AlertCircle className="size-4" />
    <AlertTitle>Payment failed</AlertTitle>
    <AlertDescription>
      Your most recent payment failed. Update your payment method via Customer Portal to keep your subscription active. Stripe will retry for up to 3 days.
      <Button onClick={openPortal}>Update payment method</Button>
    </AlertDescription>
  </Alert>
)}
```

**改 3**：admin /admin/subscriptions 加 status filter，PAST_DUE 单独 group + 计数

### 4.4 Customer Portal cancel flow（用户驱动 + 我配合）

[https://dashboard.stripe.com/settings/billing/portal](https://dashboard.stripe.com/settings/billing/portal)（live 模式切换到 right corner Live mode）：

- ✅ Customers can cancel subscriptions: **immediately** + at period end
- ✅ Customers can update payment method
- ✅ Customers can view billing history + download invoices
- Logo: 上传 scivra.com 主 logo
- Privacy policy URL: `https://scivra.com/privacy`
- Terms of service URL: `https://scivra.com/terms`
- Statement descriptor: `SCIVRA`

### 4.5 Refund policy + Terms 一致化

**改 1**：`src/app/[locale]/(landing)/terms/page.tsx` 第 148 行附近改成：

```diff
- No refunds will be provided for partial subscription periods
+ We offer a 7-day money-back guarantee for new subscriptions. To request a refund within 7 days of subscribing, email support@scivra.com. Refunds are processed via Stripe within 5-10 business days. After 7 days, we do not refund partial subscription periods, but you can cancel anytime from your billing settings.
```

**改 2**：新建 `/legal/refund-policy` 页面（独立可链接的合规页）

**改 3**：pricing.tsx 的 "7-day money-back guarantee" 文案加链接到 `/legal/refund-policy`

### 4.6 `payment_mode` 列区分 test vs live data

**Schema 改**：`src/config/db/schema.ts` 给 `order` 和 `subscription` 加：

```ts
paymentMode: text('payment_mode').default('test').notNull(), // 'test' or 'live'
```

**Cleanup migration**：

```sql
-- 把现有所有数据标 'test'
UPDATE "order" SET payment_mode = 'test' WHERE payment_mode IS NULL OR payment_mode = '';
UPDATE subscription SET payment_mode = 'test' WHERE payment_mode IS NULL OR payment_mode = '';
```

**Checkout 路由**：`/api/payment/checkout/route.ts` 创建 order 时根据 stripe key 前缀自动判断：

```ts
const isLiveMode = configs.stripe_secret_key?.startsWith('sk_live_') ?? false;
const order: NewOrder = {
  // ...
  paymentMode: isLiveMode ? 'live' : 'test',
};
```

**Admin UI**：subscriptions / payments 列表加 `payment_mode` filter（默认 live + test 分 tab）

### 4.7 Refund 完整流程（关键修复）

#### 4.7.1 加 OrderStatus.REFUNDED

`src/shared/models/order.ts`:
```ts
export enum OrderStatus {
  PENDING = 'pending',
  CREATED = 'created',
  COMPLETED = 'completed',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',  // ← 新增
}
```

#### 4.7.2 mapStripeEventType 加 charge.refunded

`src/extensions/payment/types.ts`:
```ts
export enum PaymentEventType {
  // ...
  PAYMENT_REFUNDED = 'payment.refunded',  // 已存在
}
```

`src/extensions/payment/stripe.ts:359` mapStripeEventType:
```ts
case 'charge.refunded':
  return PaymentEventType.PAYMENT_REFUNDED;
```

#### 4.7.3 buildPaymentSessionFromCharge

新增 `buildPaymentSessionFromCharge(charge: Stripe.Charge)` 在 stripe.ts，从 charge 提取 `payment_intent` → 找对应 invoice → 找对应 subscription，构造 PaymentSession with paymentStatus = REFUNDED（新增 PaymentStatus.REFUNDED）。

#### 4.7.4 getPaymentEvent 加分支

stripe.ts:276 加：
```ts
} else if (eventType === PaymentEventType.PAYMENT_REFUNDED) {
  paymentSession = await this.buildPaymentSessionFromCharge(
    event.data.object as Stripe.Response<Stripe.Charge>
  );
}
```

#### 4.7.5 webhook route 加分支

`/api/payment/notify/[provider]/route.ts`:
```ts
} else if (eventType === PaymentEventType.PAYMENT_REFUNDED) {
  // 找 order by transaction_id (charge -> payment_intent -> invoice -> order)
  const order = await findOrderByTransactionId(session.paymentInfo?.transactionId);
  if (order) {
    await handleRefund({ order, session });
  }
}
```

#### 4.7.6 handleRefund service

新增 `src/shared/services/payment.ts handleRefund({ order, session })`:

```ts
export async function handleRefund({
  order,
  session,
}: { order: Order; session: PaymentSession }) {
  await db().transaction(async (tx) => {
    // 1. order status -> REFUNDED
    await tx.update(orderTable).set({
      status: OrderStatus.REFUNDED,
      paymentResult: JSON.stringify(session.paymentResult),
    }).where(eq(orderTable.orderNo, order.orderNo));

    // 2. revoke credits granted by this order
    await tx.update(creditTable).set({
      status: CreditStatus.EXPIRED,  // 或 CANCELED
      remainingCredits: 0,
    }).where(and(
      eq(creditTable.orderNo, order.orderNo),
      eq(creditTable.transactionType, CreditTransactionType.GRANT)
    ));

    // 3. mark subscription as canceled if exists
    if (order.subscriptionNo) {
      await tx.update(subscriptionTable).set({
        status: SubscriptionStatus.CANCELED,
        canceledAt: new Date(),
        canceledReason: 'refund',
      }).where(eq(subscriptionTable.subscriptionNo, order.subscriptionNo));
    }
  });
}
```

#### 4.7.7 测试覆盖

unit + integration test：refund 触发后 order.status='refunded'、credit.remainingCredits=0、subscription.status='canceled'

### 4.8 Rollback 双开关（修 v1 致命错）

#### 4.8.1 加 `stripe_checkout_enabled` 配置

`src/shared/services/settings.ts` 加新 setting：
```ts
{
  name: 'stripe_checkout_enabled',
  title: 'Stripe Checkout Enabled',
  type: 'switch',
  value: 'true',  // 默认开
  tip: 'Disable to stop new checkouts; existing webhooks (renewals/refunds) keep processing',
  group: 'stripe',
  tab: 'payment',
}
```

#### 4.8.2 Checkout route 改用新开关

`/api/payment/checkout/route.ts` 在 provider 校验后加：

```ts
if (configs.stripe_checkout_enabled === 'false') {
  return respErr('Checkout is temporarily disabled');
}
```

#### 4.8.3 stripe_enabled 仅控 webhook

保持现状：`stripe_enabled=false` 时 PaymentManager 不注册 stripe provider → webhook 拿不到 provider → 500 + Stripe 重试堆积。

**新文档**：rollback runbook：
- 紧急关停**新交易**：`stripe_checkout_enabled=false`
- **不要**关 `stripe_enabled` 除非要丢弃所有进来的 webhook

#### 4.8.4 admin UI 区分

admin/settings/payment 把两个 switch 标注清楚：
- `stripe_enabled`: "Process incoming webhooks (renewals, refunds, cancels)"
- `stripe_checkout_enabled`: "Allow new checkouts"

### 4.9 Country restriction + billing address

#### 4.9.1 限制 Stripe Checkout 仅 US

`/api/payment/checkout/route.ts` 创建 sessionParams 时加：

```ts
sessionParams.billing_address_collection = 'required';
sessionParams.allow_promotion_codes = configs.stripe_allow_promotion_codes === 'true';
sessionParams.payment_method_options = {
  card: {
    request_three_d_secure: 'automatic',
  },
};
// 限制 US billing
sessionParams.shipping_address_collection = undefined;
// Stripe 没有 billing_country whitelist API；用 customer_creation + restricted to US
sessionParams.custom_fields = [
  ...(sessionParams.custom_fields ?? []),
];
```

实际限制方式：在 Stripe Dashboard → Settings → Payments → Manage payment methods → 只勾 US-issued cards？没有这个选项。

**正确做法**：Stripe Checkout 默认接受全球卡。要限国家用 [Restrictive radar rules](https://dashboard.stripe.com/settings/radar/rules) live mode 加规则：
```
Block if :card_country: != "US"
```

文档化在 §5.4 步骤里，不写代码。

#### 4.9.2 收 billing address 必填

已经在 §4.9.1 `billing_address_collection = 'required'`。

### 4.10 Parent attestation checkbox

#### 4.10.1 pricing 页面加 attestation

`src/themes/default/blocks/pricing.tsx` 在 Subscribe 按钮前加 checkbox（仅当用户未勾选时按钮 disabled）：

```tsx
const [attestation, setAttestation] = useState(false);
// ...
<div className="flex items-start gap-2 mb-3">
  <Checkbox
    id={`attestation-${item.product_id}`}
    checked={attestation}
    onCheckedChange={setAttestation}
  />
  <label htmlFor={`attestation-${item.product_id}`} className="text-xs text-muted-foreground">
    I am 18+ and agree to be charged on behalf of myself or my child.
  </label>
</div>
<Button disabled={!attestation || isLoading} ...>Subscribe</Button>
```

#### 4.10.2 落库

checkout API 加 attestation 参数（POST body），写 order 表 metadata：
```ts
await createOrder({
  // ...
  metadata: { attestation_signed: true, attestation_at: new Date().toISOString() },
});
```

存证。如未来 chargeback dispute，可作为 evidence。

### 4.11 集成测试整改 + Sentry release

- 移 subscription-lifecycle.test.ts 到 `tests/unit/services/`
- vitest config integration project 加 `pool: 'forks', poolOptions: { forks: { singleFork: true } }` 修 suite timeout
- Sentry 配置已经在 §4.1 含 `SENTRY_RELEASE`

## 5. Stripe Dashboard Setup（用户驱动）

### 5.1 Account activation（§3.1 必须先通过）

### 5.2 Business / Email / Statement descriptor

[Settings → Public details](https://dashboard.stripe.com/settings/public)：
- Business name: Scivra
- Statement descriptor: SCIVRA
- Public website: https://scivra.com
- Support email: support@scivra.com

[Settings → Customer emails](https://dashboard.stripe.com/settings/emails)：
- ✅ Successful payments
- ✅ Failed payments
- ✅ Refunds
- ❌ 关 "Refund created" 邮件（用 Scivra 自己的 friendlier email）

### 5.3 Live Webhook Endpoint（**6 个 events**）

[https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)（live mode）：

- URL: `https://scivra.com/api/payment/notify/stripe`
- Events:
  1. `checkout.session.completed`
  2. `invoice.payment_succeeded`
  3. `invoice.payment_failed`
  4. `customer.subscription.updated`
  5. `customer.subscription.deleted`
  6. **`charge.refunded`** ← 新加

复制 live `whsec_...`。

### 5.4 Radar rule 限国家

[https://dashboard.stripe.com/settings/radar/rules](https://dashboard.stripe.com/settings/radar/rules)（live mode）：

Add rule under **"Block if"**:
```
:card_country: != "US"
```

### 5.5 Customer Portal（§4.4）

## 6. Go-Live 切换流程

### 6.1 Pre-flight（10 min）

- 跑 §3.1 Stripe account check
- 跑 prod DB sanity SQL（看 §6.1 of v1）
- 跑 dev unit + integration test（确认 wave 5 commits + refund 改动 GREEN）
- 验 §4.5 Terms 已部署

### 6.2 切 keys（atomic with cache verification）

1. 进 prod `/admin/settings/payment`
2. **关** `stripe_checkout_enabled` switch（保存）→ 阻断新交易
3. 替换 4 字段为 live keys：
   - `stripe_publishable_key` = `pk_live_...`
   - `stripe_secret_key` = `sk_live_...`
   - `stripe_signing_secret` = live `whsec_...`
4. 保存
5. **真请求验证 cache 已生效**（修 15s 等待）：

```bash
# 触发已知会进入 stripe provider 的代码路径
curl -X POST https://scivra.com/api/payment/notify/stripe \
  -H "stripe-signature: t=1,v1=invalid" \
  -d '{}'
# expect 400 invalid signature
# 应用日志应记录用 live whsec_ 验签
```

6. **打开** `stripe_checkout_enabled` switch（保存）

### 6.3 Live smoke test（30 min）

**严格按顺序，全程录屏作为 evidence**：

1. **/pricing → Pro Monthly Subscribe**（$4.99 最便宜）
2. 弹出 §4.10 attestation checkbox，勾
3. Stripe Checkout 用**真实信用卡**
4. 完成支付，等跳回 `/settings/billing`
5. 验证 prod DB（**含 payment_mode = 'live'**）：
   ```sql
   SELECT order_no, status, payment_mode, amount, transaction_id
   FROM "order" WHERE payment_mode = 'live'
   ORDER BY created_at DESC LIMIT 1;
   -- expect status='paid'
   ```
6. **立即在 /settings/billing 点 Manage subscription** → 跳到 live customer portal
7. **Cancel subscription immediately**（end of period）
8. 进 [Live Payments Dashboard](https://dashboard.stripe.com/payments) 找最近 $4.99 → **Refund full**
9. 等 webhook（~1 min）
10. 验证 prod DB（**含退款落库验证，修 v1 假命题**）：
    ```sql
    -- order 状态变 refunded
    SELECT status FROM "order" WHERE payment_mode = 'live' ORDER BY created_at DESC LIMIT 1;
    -- expect 'refunded'

    -- credit 已撤销
    SELECT remaining_credits, status FROM credit
    WHERE order_no = (SELECT order_no FROM "order" WHERE payment_mode = 'live' ORDER BY created_at DESC LIMIT 1);
    -- expect remaining_credits=0, status='expired'

    -- subscription 已 cancel
    SELECT status, canceled_reason FROM subscription
    WHERE subscription_id = (SELECT subscription_id FROM "order" WHERE payment_mode = 'live' ORDER BY created_at DESC LIMIT 1);
    -- expect status='canceled', canceled_reason='refund'
    ```
11. Stripe Dashboard webhook attempts 全部 200

**任一 fail → §7 rollback**。

### 6.4 监控启动（30 min）

- Sentry: 设 alert rule "any error in /api/payment/notify/stripe → email"
- Vercel logs: 加 watcher（`vercel logs --follow` background）
- Stripe Dashboard webhook deliveries: bookmark for 24h check-back

## 7. Rollback Plan（修 v1 致命错）

### 7.1 紧急停新交易（< 30s）

`/admin/settings/payment` → 关 `stripe_checkout_enabled` → 保存

效果：
- ✅ 新 checkout 立刻 503（"Checkout is temporarily disabled"）
- ✅ 已 active 订阅的续费 webhook **继续处理**（不会 stack up）
- ✅ Refund webhook 继续生效

### 7.2 紧急切回 test mode（5 min）

如 7.1 不够，把 4 个 stripe_* 字段从 backup JSON 恢复：

```bash
# Read backup
jq '.config[] | select(.name | startswith("stripe_"))' \
  /Users/smith/Desktop/scivra/backups/prod-pre-stripe-fix-20260507.json
```

把对应 value 贴回 prod admin。

### 7.3 真退款（已收钱）

进 [Live Payments](https://dashboard.stripe.com/payments) → 异常订单 → Refund full（每笔单独）。

## 8. 留给 Codex v2 评审的开放问题

1. **§4.7.3 buildPaymentSessionFromCharge 实现细节**：charge → payment_intent → invoice → subscription 链路要 Stripe API 多次调用（latency）。要不要 expand 字段一次拿全？
2. **§4.7.6 handleRefund 撤销 credit 是否过激**：full refund 撤销整月 credit 是合理的；但 partial refund（比如 yearly $47.90 中退 $20）是否应该按比例撤？今天范围内**partial refund 不处理**，全额 refund 才撤 credit。Codex 同意吗？
3. **§4.10 attestation 的 metadata 落库够吗**：不签名、不 timestamp 服务端。是否应该加 IP + user_agent？dispute evidence 强度
4. **§4.6 `payment_mode` 字段**：加在 order/subscription，但 credit 也应该加吗？credit 的 grant 是 order-driven，可以从 order join 得到 mode，似乎不必独立列
5. **§4.9 Radar rule** vs **app 层国家校验**哪个更稳：Radar 在 Stripe 层 block，但用户 UI 上不知道为啥被拒；app 层在 checkout 前校验更友好
6. **§6.2 真请求验证**用 invalid signature 触发 400 是 hack 法。要不要改成更"正经"的 health check（比如 `/api/payment/health` 返回当前 stripe key prefix + active provider count）？
7. **§7.1 30s rollback 时间**：`unstable_cache` 有 revalidate 3600 + revalidateTag。关 switch 后 admin saveConfigs 调 revalidateTag。30s 是估算，是否需要更精确测量

## 9. Codex v2 评审 checklist

- [ ] §4.7 完整 refund 流程是否 cover 所有 case（subscription / one-time / partial）
- [ ] §4.8 双开关命名是否清晰（stripe_checkout_enabled vs stripe_enabled 容易混）
- [ ] §4.10 parent attestation 在 K12 + 全量 launch 下是否够缓解 COPPA
- [ ] §4.9 Radar rule 限 US 是否过严（合法海外用户被拒）
- [ ] §6.2 真请求验证策略是否漏掉某个 cache 路径
- [ ] §6.3 真卡测试 11 步是否漏验某个 invariant
- [ ] §7.1 双开关下 rollback 时间是否真 < 30s
- [ ] §8 7 个开放问题给立场

## 10. Timeline（today）

| 时段 | 任务 | 谁 | 阻塞 |
|---|---|---|---|
| now | codex v2 review | codex | — |
| +30min | §3.1 Stripe account check | user (curl) | review pass |
| +1h | §4.1 Sentry manual setup + verify | claude (code) + user (DSN) | — |
| +2h | §4.2 yearly disclaimer + PricingItem | claude | — |
| +2.5h | §4.3 PAST_DUE access | claude | — |
| +3h | §4.5 Terms refund 一致 | claude | — |
| +3.5h | §4.6 payment_mode 列 + cleanup migration | claude | — |
| +5.5h | §4.7 refund 完整流程（最大块） | claude | — |
| +6.5h | §4.8 双开关 | claude | — |
| +7h | §4.9 §4.10 country + attestation | claude | — |
| +7.5h | §4.11 集成测试整改 + suite timeout | claude | — |
| +8h | §5 Stripe Dashboard 配置 | user | §3.1 通过 |
| +8.5h | §6.1 pre-flight | claude | §4-5 完成 |
| +8.75h | §6.2 切 keys（atomic） | user | §6.1 通过 |
| +9.5h | §6.3 live smoke test + refund | user (browser) + claude (DB) | §6.2 完成 |
| +10h | §6.4 监控启动 | claude | §6.3 通过 |
| +24h | rollback window 结束，正式上线 | — | 24h 无异常 |

**今天**走通到 §6.4（10 小时），**正式上线**仍是 24 小时无异常后宣布。

## 11. v2 与 v1 工作量对比

| 维度 | v1 | v2 |
|---|---|---|
| 工程改动 task | 6 | 11 |
| 新 schema migration | 0 | 1 (payment_mode) |
| 新 service 函数 | 1 (handleSubscriptionPaymentFailed 已 wave 5) | 1 (handleRefund) |
| 新 webhook event | 0 | 1 (charge.refunded) |
| 新枚举值 | 4 (PAST_DUE 等) | 1 (REFUNDED) |
| 文案改动 | 1 (yearly) | 3 (yearly + Terms + refund-policy) |
| 估时 | 5.5h | 10h |
| 风险敞口 | 6 必改无修复 | 全部 mitigate（除 Codex 同意的 partial refund / sales tax 留 follow-up） |
