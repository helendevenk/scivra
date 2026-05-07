# Stripe 接入手册

> Scivra 的支付凭据**不放 .env**，统一通过 admin 面板写入 DB `configs` 表。本文档记录从零到跑通一笔订阅的全部步骤。

## 架构事实（避免踩坑）

| 维度 | Scivra 现状 |
|---|---|
| 凭据存储 | DB `configs` 表，admin 面板动态读写 |
| 价格定义 | 动态 `price_data`（每次 checkout 用 cents 现场建），不依赖 Stripe 预设 Price ID |
| 套餐源 | `src/config/locale/messages/en/pricing.json` |
| Webhook 路径 | `/api/payment/notify/stripe`（不是 `/api/webhooks/stripe`） |
| 成功跳转 | `/api/payment/callback?order_no=xxx` |
| Provider 实现 | `src/extensions/payment/stripe.ts` |
| 配置注入 | `src/shared/services/payment.ts:getPaymentServiceWithConfigs` |

**不要**照网上的 starter 模板把凭据塞进 `.env`，会绕过现有 admin 热更新和多 provider 切换逻辑。

## 前置

- Stripe CLI 已安装：`stripe version` 应返回 `1.40.x` 或更新
- 数据库可访问、已跑过 `pnpm db:push`
- 本地能起 `pnpm dev`，且 admin 账号可登录 `/admin/settings/payment`

## 一、Test Mode（本地 dev）

### 1.1 拿到 Stripe 测试密钥

1. `stripe login`，浏览器配对
2. 打开 [Stripe Dashboard, Test mode](https://dashboard.stripe.com/test/apikeys)
3. 复制：
   - Publishable key：`pk_test_...`
   - Secret key：`sk_test_...`

### 1.2 启动 webhook 转发

新开一个终端，保持运行：

```bash
stripe listen \
  --events checkout.session.completed,invoice.payment_succeeded,invoice.payment_failed,customer.subscription.updated,customer.subscription.deleted \
  --forward-to localhost:3001/api/payment/notify/stripe
```

Use explicit event filtering in dev so noisy Stripe events such as `invoice_payment.paid` and `payment_intent.created` do not trigger unknown-event warnings during webhook testing.

输出会包含：

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxx
```

复制这个 `whsec_...`，下一步要用。

### 1.3 在 admin 面板写入凭据

启动 dev：

```bash
pnpm dev
```

访问 `http://localhost:3001/admin/settings/payment`（注：Next.js 默认 3000，本机 3000 被另一项目占用时会回落到 3001；以 `pnpm dev` 启动时输出的端口为准），按下表填写：

| 字段 | 值 |
|---|---|
| `payment_enabled` | on |
| `default_payment_provider` | `stripe` |
| `stripe_enabled` | on |
| `stripe_publishable_key` | `pk_test_...` |
| `stripe_secret_key` | `sk_test_...` |
| `stripe_signing_secret` | 上一步 `whsec_...` |
| `stripe_payment_methods` | 至少勾 `card` |
| `stripe_allow_promotion_codes` | 按需，默认 off |

保存。配置走 DB，无需重启。

### 1.4 端到端验证

1. 访问 `/pricing`
2. 选 Pro Monthly，点 Subscribe
3. Stripe Checkout 用测试卡：
   - 成功：`4242 4242 4242 4242`，任意未来日期、任意 CVC
   - 3DS 挑战：`4000 0000 0000 3220`
   - 余额不足：`4000 0000 0000 9995`
4. 支付成功后应跳转 `/settings/billing`

验证清单：

```bash
# stripe listen 终端应连续看到这些事件
checkout.session.completed
customer.subscription.created
invoice.payment_succeeded
```

DB 侧（推荐用 `pnpm db:studio`）：

| 表 | 期望 |
|---|---|
| `order` | 有一条新记录，`status = 'paid'` |
| `subscription` | 有一条新记录，`status = 'active'`，`provider = 'stripe'` |
| `credit` | 按套餐 `credits`、`valid_days` 写入 |

### 1.5 Customer Portal（取消订阅）

应用内取消用 `getPaymentBilling`，会跳到 Stripe Customer Portal。首次使用前，去 [Test mode Portal 设置](https://dashboard.stripe.com/test/settings/billing/portal) 确认：

- 已启用 "Customers can cancel subscriptions"
- 已配置 logo、退款政策（可选）

## 二、Production

### 2.1 切到 Live mode 拿真实密钥

1. Stripe Dashboard 右上角切到 Live mode
2. [Live API keys](https://dashboard.stripe.com/apikeys) 复制 `pk_live_...` 和 `sk_live_...`

### 2.2 注册 production webhook endpoint

不是用 `stripe listen`，而是去 Dashboard 注册：

1. [Live Webhooks](https://dashboard.stripe.com/webhooks) → Add endpoint
2. URL：`https://YOUR_DOMAIN/api/payment/notify/stripe`
3. Events to send（**select only these 5 events**，extra events can be treated as unknown by the webhook handler）：
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. 创建后点 endpoint 详情，"Signing secret" 处 reveal，得到 live `whsec_...`

### 2.3 写入 production admin 面板

访问 production 站点的 `/admin/settings/payment`，把 1.3 表里的 4 个 stripe 字段全部替换为 live 凭据。**不要**用 test 凭据上 prod。

### 2.4 上线前检查

1. 用一张真实卡（小金额，比如 Pro $4.99）走一笔，确认订阅创建成功
2. 在 Stripe Dashboard 退款这笔订单
3. 取消订阅、确认 `subscription.canceled` 事件能正确写入 DB

### 2.5 Stripe Race Cleanup

Before deploying `fix/stripe-webhook-canonical-rows`, run the v3 plan §9.5 errata preflight SQL in production:

```sql
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

If `consumed_duplicate_grant_count > 0`, cancel the deployment and reconcile manually first. Mark extra grant rows with `status = 'canceled'`, or merge `remaining_credits` into the canonical grant row before retrying deployment.

After `consumed_duplicate_grant_count = 0`, run:

```bash
# backup
pg_dump $DATABASE_URL --table=subscription --table='"order"' --table=credit > backup-pre-stripe-race-fix-$(date +%Y%m%d).sql

# cleanup
pnpm tsx scripts/cleanup-stripe-race.ts --dry-run
pnpm tsx scripts/cleanup-stripe-race.ts

# apply schema
pnpm db:push
```

## 三、套餐与 pricing.json

套餐定义在 `src/config/locale/messages/en/pricing.json`。当前：

| `product_id` | 周期 | `amount`（cents） | 显示价 | `interval` |
|---|---|---|---|---|
| `free` | month | 0 | $0 | month |
| `pro-monthly` | month | 499 | $4.99 | month |
| `max-monthly` | month | 999 | $9.99 | month |
| `free-yearly` | year | 0 | $0 | year |
| `pro-yearly` | year | 4790 | $3.99 月均（年付 $47.90） | year |
| `max-yearly` | year | 9590 | $7.99 月均（年付 $95.90） | year |

> ⚠️ **跟进项**：yearly 套餐的 `unit` 文案目前写 `"/ month"` 但 `interval` 是 `year`，UI 显示月均价但 Stripe 实际按年扣款。FTC click-to-cancel 与"全价透明"合规要求：建议加一行小字说明实际扣款金额（例如 "billed $47.90/year"）。这是合规风险，未排进本接入流程。

改套餐价格、credits 配额、文案，直接改 JSON 即可，不需要在 Stripe Dashboard 建 product。

## 四、常见问题

### 4.1 webhook 触发但 DB 没写

- 看应用日志（dev 是 `pnpm dev` 终端，prod 是 Vercel logs）
- 99% 是 `signing_secret` 没填或填错。test 和 live 的 `whsec_` 不一样，混用会一直 401
- 确认 admin 面板存的是 `whsec_...` 全文，不要带前后空格

### 4.2 checkout 报 "no payment provider configured"

- `stripe_enabled` 没开，或 `default_payment_provider` 没设成 `stripe`
- 进 `/admin/settings/payment` 检查这两个开关

### 4.3 用户付款后看不到订阅

- `/api/payment/callback` 是同步兜底，但权威来源是 webhook
- 确认 `stripe listen`（dev）或 prod webhook endpoint 还在运行
- 进 [Stripe Dashboard, Webhooks](https://dashboard.stripe.com/webhooks) 看 endpoint 的 "Recent attempts"，状态码必须是 200

### 4.4 要测试 webhook 失败重试

```bash
# 触发指定事件
stripe trigger checkout.session.completed
stripe trigger invoice.payment_succeeded
stripe trigger customer.subscription.deleted
```

## 五、相关代码索引

| 用途 | 路径 |
|---|---|
| Stripe provider | `src/extensions/payment/stripe.ts` |
| 配置注入 | `src/shared/services/payment.ts` |
| 套餐数据 | `src/config/locale/messages/en/pricing.json` |
| Checkout API | `src/app/api/payment/checkout/route.ts` |
| Webhook API | `src/app/api/payment/notify/[provider]/route.ts` |
| 成功回跳 | `src/app/api/payment/callback/route.ts` |
| Pricing UI | `src/themes/default/blocks/pricing.tsx` |
| Admin 设置项 | `src/shared/services/settings.ts`（搜 `stripe_`） |
| 订单/订阅 model | `src/shared/models/order.ts`、`subscription.ts` |
