# Scivra Stripe Live Mode Cutover Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> Status: **draft, awaiting Codex review**.
> Target: 2026-05-08（今天）切 prod 收真实信用卡。

## Goals + Non-Goals

**Goals**
- prod scivra.com 上 Stripe live mode（真扣款）
- 至少 1 个付费用户走通完整流程（subscribe → 收据邮件 → cancel → refund）
- 真实可观测性（Sentry 有报警）
- 法律合规底线（FTC click-to-cancel + yearly 全价透明）

**Non-Goals**
- Stripe Tax（国际 VAT/sales tax 自动化）— 留 follow-up
- Promotion codes / discounts — 留 follow-up
- COPPA 父母代付流程 — Scivra 模式假设 K12 学生父母直接订阅，**不**让未成年人自己刷卡，所以不在 cutover 范围
- 多币种 — 维持 USD only
- A/B 价格测试

## 1. 现状（pre-cutover snapshot）

`[VERIFIABLE]`

| 维度 | 当前状态 | 来源 |
|---|---|---|
| Prod stripe_* keys | `sk_test_` / `pk_test_` | prod config 表查询 2026-05-08 03:50 |
| Prod webhook endpoint | dev `stripe listen` 转发，**未注册 Stripe Dashboard 的 prod endpoint** | Stripe Dashboard 检查 |
| Prod 订阅 / 订单 | 0 active subscription, 0 paid order, 13 user (free tier) | prod DB 查询 |
| Schema | 已 apply UNIQUE + partial unique（wave 1-5）| 应用于 prod 2026-05-08 03:44 |
| Code | merge `8371de5` 已部署 Vercel | scivra.com 200 OK |
| Stripe live mode 账号 | **未知**（需 Dashboard 确认 activate 状态） | 待用户确认 |

**这意味着**：技术栈已 ready，但**业务侧未 active**。今天能不能切，**关键看 Stripe live mode 账号是否已通过验证**。

## 2. 风险评估

| 风险 | 概率 | 影响 | 缓解 |
|---|---|---|---|
| Stripe live mode 账号未激活（business verification pending） | 中 | **阻断今天 cutover** | §3.1 提前确认 |
| FTC click-to-cancel 合规缺失（yearly 月均价文案） | 高 | 法律风险（FTC 罚款 + 用户集体诉讼） | §4.2 必须修 |
| 第一笔真实卡支付 webhook 异常没人知道 | 高 | 用户付了钱但应用层没开权限 | §4.1 Sentry 必装 |
| 切换 keys 时机错误（test → live 中间状态） | 中 | 切到一半收到 webhook，签名不匹配 | §6.2 先停 listen，再切 keys |
| Customer Portal 没配置 cancel | 中 | 用户取消订阅找不到入口，FTC 风险 | §5.4 必配 |
| 第一笔真卡测试用户 self-test 不立刻 refund | 低 | 真扣自己钱 | §6.3 强制 refund 步骤 |
| PAST_DUE 用户立刻被断服 | 中 | UX 差 + 用户投诉 | §4.3 决策 + 实现 |
| 切到 live 后旧 test mode 订单残留干扰 | 低 | 仅显示混乱，不影响新订单 | §6.1 标记 test 数据 |
| Stripe 触发 3DS 挑战流程不通过 | 中 | 部分用户付不了款 | Stripe 自动处理，不需做事 |

## 3. Pre-Cutover 阻塞前置（必须先 unblock）

### 3.1 Stripe 账号 live mode 状态确认（用户驱动，5 min）

打开 [https://dashboard.stripe.com/account/onboarding](https://dashboard.stripe.com/account/onboarding) 看：

- 如果显示 **"Activate payments"** + 缺业务信息 / 银行 → **今天不能切**，需要补：
  - Business type (sole prop / LLC)
  - Tax ID (SSN/EIN if US)
  - Bank account for payouts
  - Identity verification (driver's license)
  - 业务验证 24-72 小时
- 如果显示 **"Live mode enabled"** → 可以继续

**决策点**：

- ✅ 已激活 → 继续 §4
- ❌ 未激活 → 当场决定先补完 onboarding 或推迟 cutover 到 verification 通过

## 4. Pre-Live 工程改动

### 4.1 Sentry 实装（必须，60 min）

**Why**：webhook 错误目前写 console.error → Vercel logs，没主动告警。route.ts 已 lazy import `@sentry/nextjs`，但包没装。

**Steps**:
1. 用户：去 [sentry.io](https://sentry.io) 创建 org `scivra` + project `scivra-prod` (Next.js)
2. 用户：复制 DSN（形如 `https://xxx@oxxx.ingest.us.sentry.io/xxx`）
3. 我：`pnpm add @sentry/nextjs`
4. 我：`pnpm exec @sentry/wizard@latest -i nextjs --skip-connect`（用户给 DSN，跳过 OAuth）
5. 我：把 DSN 加到 Vercel env vars (Production scope)：`SENTRY_DSN`、`NEXT_PUBLIC_SENTRY_DSN`
6. 我：验证 `src/app/api/payment/notify/[provider]/route.ts` 的 dynamic import 真能 capture（写一个 test webhook trigger 故意抛错，看 Sentry 收到）
7. 我：commit + push

**验证**：
- `stripe trigger payment_intent.succeeded` （挑一个未识别事件）→ 应进 Sentry 但**不应**触发新告警，因为 silent skip 200
- 故意构造一次 mock 失败（dev 改 route.ts 抛 throw）→ Sentry 收到 + 应用层 500
- 验证完回退 mock 改动

### 4.2 yearly 套餐 FTC 合规文案（必须，30 min）

**Why**：`src/config/locale/messages/en/pricing.json` 的 yearly 套餐：
- `unit: "/ month"` + `interval: "year"` + `amount: 4790`
- UI 显示 `$3.99/month` 但实际一次扣 `$47.90/year`
- FTC click-to-cancel 要求"全价透明披露"

**Steps**:
1. 改 `pricing.json` 的 yearly 项加新字段 `billing_disclaimer`：
   ```json
   {
     "product_id": "pro-yearly",
     "amount": 4790,
     "price": "$3.99",
     "unit": "/ month",
     "billing_disclaimer": "Billed $47.90 annually. Cancel anytime.",
     ...
   }
   ```
2. 改 pricing.tsx 渲染：在 `unit` 下方加 `<p className="text-xs text-muted-foreground mt-1">{item.billing_disclaimer}</p>`（仅 yearly 渲染）
3. 检查 admin/pricing 页面（如果有）也加同样披露
4. 确保 Stripe Checkout 的 description 也含此信息（已经在 product_name + description；改成 "Pro Annual ($47.90/year, ~$3.99/mo)"）

**验证**：
- /pricing 切到 Annually tab → Pro / Max 卡片底部显示 "Billed $47.90 annually" / "$95.90 annually"
- 走一笔 Pro yearly checkout → Stripe 页面 description 也有

### 4.3 PAST_DUE 访问权限（30 min，需要决策）

**决策（默认 + 推荐）**：retry 期间允许 Pro 功能访问，等 `customer.subscription.deleted` 事件再断。

**理由**：
- Stripe 默认 3 天 retry，这期间用户可能正在更新 payment method
- 立刻断服会激怒诚实用户
- Spam / fraud 用户用 stolen card 付款然后退单 → Stripe `payment_intent.disputed` → 我们之后单独处理（不在本 cutover）

**Steps**:
1. 修 `src/shared/models/subscription.ts:162` 的 `getCurrentSubscription` active list：
   ```ts
   .where(inArray(subscription.status, [
     SubscriptionStatus.ACTIVE,
     SubscriptionStatus.PENDING_CANCEL,
     SubscriptionStatus.TRIALING,
     SubscriptionStatus.PAST_DUE,  // ← 加
   ]))
   ```
2. 改 billing/page.tsx：当 status === PAST_DUE 时显示 banner "Payment failed — update your payment method via Customer Portal"
3. 删 v3 plan 留的 TODO 注释
4. 加 unit test：`getCurrentSubscription` 返回 PAST_DUE 用户的订阅

**Counter（替代方案）**：立即断 PAST_DUE 访问。**不推荐**——Stripe 文档明确说 past_due 是临时状态。

### 4.4 Customer Portal cancel flow（用户驱动 + 我配合，15 min）

**Why**：FTC click-to-cancel 要求 cancel 至少和 sign-up 同样易达。Scivra 当前用 Stripe Customer Portal 跳转，必须配置好。

**Steps**:
1. 用户：[Live Portal Settings](https://dashboard.stripe.com/settings/billing/portal)（注意是 live 不是 test）
2. 启用：
   - ✅ Customers can cancel subscriptions (immediate or at period end)
   - ✅ Customers can update payment method
   - ✅ Customers can view billing history
3. 上传 logo（同 scivra.com favicon）
4. Privacy policy + Terms of service URL（用 scivra.com/legal/* 现有页面）
5. Statement descriptor: `SCIVRA` (出现在用户信用卡账单)
6. 我：在 /settings/billing 页面加 "Manage subscription" 按钮直链 portal（如果还没有）

**验证**：sub 用户点 "Manage subscription" → 跳到 Stripe portal → 能看到 cancel 选项

### 4.5 Refund policy 公开声明（30 min）

**Why**：合规 + UX。

**Steps**:
1. 我：在 `/legal/refund-policy` 加新页面（如果没有），内容：
   - 7-day money-back guarantee
   - Email support@scivra.com to request
   - Refund processed via Stripe within 5-10 business days
2. /pricing 页面已经有 "7-day money-back guarantee" 文案，加链接
3. Customer Portal description 引用此 URL

### 4.6 Pre-live 集成测试整改（45 min，可选但推荐）

- subscription-lifecycle.test.ts 移到 `tests/unit/services/`（命名一致性）
- 集成测试 suite timeout：vitest config 加 `pool: 'forks'` + `poolOptions.forks.singleFork: true` 让 db push 串行（避免 concurrent push 互锁）

**这一步不阻塞 cutover**，但跑 CI 时影响 dev velocity。

## 5. Stripe Dashboard Setup（用户驱动）

### 5.1 业务设置 checklist

[https://dashboard.stripe.com/settings/business](https://dashboard.stripe.com/settings/business)：
- Public business name: Scivra
- Statement descriptor: `SCIVRA`
- Support email: support@scivra.com
- Support phone: 可选
- Public website: https://scivra.com

### 5.2 Email 设置

[https://dashboard.stripe.com/settings/emails](https://dashboard.stripe.com/settings/emails)：
- ✅ Send email receipts for successful payments
- ✅ Send email for failed payments + retry attempts
- ✅ Send email for canceled subscriptions
- 关闭 "Refund created" 邮件（用 Scivra 自己的 email 流程发更友好）

### 5.3 Live Webhook Endpoint

[https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks) → Add endpoint：
- URL: `https://scivra.com/api/payment/notify/stripe`
- Description: "Production webhook"
- Events to send（**仅勾这 5 个**，多余事件代码会 silent skip 但日志吵）：
  1. `checkout.session.completed`
  2. `invoice.payment_succeeded`
  3. `invoice.payment_failed`
  4. `customer.subscription.updated`
  5. `customer.subscription.deleted`
- API version: latest
- 创建后点 endpoint 详情，"Signing secret" reveal → 复制 live `whsec_...`（**不要 commit**）

### 5.4 Customer Portal config（已在 §4.4）

### 5.5 Tax settings（可选，**今天跳过**）

Stripe Tax 国际 VAT/sales tax 自动化。今天 cutover 跳过，第一批 customers 假设全是 US，没 sales tax 暴露（Scivra 是 SaaS 在某些州也可能要 collect sales tax，留给 follow-up）。

## 6. Go-Live 切换流程（atomic moment）

### 6.1 Pre-flight checks（5 min）

立即跑（user 操作）：

```sql
-- 1. 没有未完成的 pending order
SELECT count(*) FROM "order" WHERE status = 'pending';
-- expect 0 or all very recent (< 1 hour old)

-- 2. 现有 active sub 是 test 数据
SELECT count(*) FROM subscription WHERE status = 'active';
-- expect 0 (现状)

-- 3. UNIQUE 约束都在
SELECT conname FROM pg_constraint
  WHERE conname IN (
    'uq_subscription_provider_subscription_id',
    'uq_order_provider_transaction_id'
  );
SELECT indexname FROM pg_indexes WHERE indexname = 'uq_credit_grant_per_order';
-- expect 3 rows total
```

### 6.2 切 keys（atomic，1 min）

**关键时序**：先关 stripe_enabled，再换 keys，再开 stripe_enabled。避免中间状态收到 webhook。

1. 进 prod `/admin/settings/payment`
2. **关** `stripe_enabled` switch（保存）
3. 替换 4 个字段为 live：
   - `stripe_publishable_key` = `pk_live_...`
   - `stripe_secret_key` = `sk_live_...`
   - `stripe_signing_secret` = live `whsec_...`（来自 §5.3）
   - 保留 `stripe_payment_methods: ['card']`
4. **重新打开** `stripe_enabled` switch（保存）
5. **15 秒**等 admin 配置缓存刷新（getAllConfigs 没有 TTL，但保险等）

### 6.3 Live smoke test（30 min，必须真扣自己卡）

**严格按顺序**：

1. **/pricing 选 Pro Monthly Subscribe**（$4.99，最便宜）
2. Stripe Checkout 用**真实信用卡**（不是 4242）
3. 完成支付，等跳回 /settings/billing
4. **立即在新 tab** 打开 [Live Customer Portal](https://billing.stripe.com/p/login/test_xxx)（找 Stripe → user → Subscriptions → 取消订阅 OR 直接 Stripe Dashboard refund）
5. **Refund 这笔订单**：[Live Payments](https://dashboard.stripe.com/payments) → 找最近一笔 $4.99 → Refund full
6. 等 webhook：`subscription.deleted` + `charge.refunded` 应该在 stripe Dashboard webhook attempts 里 200
7. 验证 prod DB：
   ```sql
   SELECT * FROM "order" WHERE status = 'paid' ORDER BY created_at DESC LIMIT 1;
   SELECT * FROM subscription WHERE status IN ('canceled', 'expired') ORDER BY created_at DESC LIMIT 1;
   SELECT * FROM credit WHERE transaction_scene = 'subscription' ORDER BY created_at DESC LIMIT 1;
   ```
8. 期望：1 paid order, 1 canceled subscription, 1 grant credit

**如果 step 7 缺任何一项 → 立即回滚（§7）**。

### 6.4 Sentry / Vercel logs 静默期检查（30 min）

切完 keys 后**24 小时**内监控：

- Sentry：webhook route 任何 5xx error
- Vercel logs：`/api/payment/notify/stripe` 路径的 4xx / 5xx 频次
- Stripe Dashboard webhook deliveries：所有 attempts 都 200

## 7. Rollback Plan

切完后 24 小时**任何**异常出现：

### 7.1 紧急关停 Stripe（< 1 min）

进 prod `/admin/settings/payment` → 关 `stripe_enabled` → 保存

效果：新 checkout 都直接 `respErr('no payment provider configured')`，不再走 Stripe。已 active 订阅不受影响（Stripe 自己继续 charge），但 Scivra 端不再处理 webhook。

### 7.2 切回 test mode（5 min）

如果 7.1 不够（比如已经收到错误数据），把 4 个 stripe_* 字段恢复成 test 凭据：

```bash
# 拿 backup
cat /Users/smith/Desktop/scivra/backups/prod-pre-stripe-fix-20260507.json | jq '.config[] | select(.name | startswith("stripe_"))'
```

把对应 value 贴回 admin panel。

### 7.3 退款已收到的真实付款（按 Stripe 用户级处理）

- 进 [Live Payments](https://dashboard.stripe.com/payments) → 找异常付款 → Refund
- 每笔单独操作（Stripe Dashboard 没有批量 refund）

## 8. 留给 Codex 评审的开放问题

1. **Stripe 账号活性检查没有自动化**——能否用 Stripe API `GET /v1/account` 检查 `charges_enabled` / `payouts_enabled`？写到 §3.1 让用户跑一行命令而非肉眼看 Dashboard
2. **§4.2 的 billing_disclaimer 字段加在 pricing.json 里**：是否应该加到 `messages/en/pricing.json` 的 i18n 命名空间，还是单独加 schema 字段？影响 pricing.tsx 类型定义
3. **§6.2 切 keys 中间 15 秒等待是否够**——`getAllConfigs` 内部缓存策略是什么？要不要更主动 invalidate？
4. **§6.3 真实卡测试**：建议用户用 Privacy.com / Stripe Issuing 虚拟卡而非个人卡，便于 limit + immediate revoke。值得在 plan 里强调吗？
5. **PAST_DUE 改 active list 后 admin 页面如何区分**——active vs PAST_DUE 用户量化指标？
6. **Sentry release tracking**：装 Sentry 时是否同时配 release（连 git SHA）？这影响 error 归因到具体 deploy
7. **第一批用户限流**：要不要 cutover 后头 24 小时只对邀请用户开 stripe_enabled（feature flag by user_email allowlist）？还是直接全量？

## 9. Codex 评审 checklist

- [ ] §2 风险表是否漏了 K12 SaaS 特有风险（COPPA / 父母代付 / 学生 PII）
- [ ] §3.1 Stripe 账号检查是否充分
- [ ] §4.1 Sentry 装的 wizard 命令是否正确（Next.js 16 兼容性）
- [ ] §4.2 FTC 文案 wording 是否过 / 不足
- [ ] §4.3 PAST_DUE 默认允许的法律 / 业务 reasoning 站得住吗
- [ ] §5.3 5 个 webhook events 是否漏（如 `charge.refunded` 影响 refund 流程）
- [ ] §6.2 atomic key swap 顺序是否安全
- [ ] §6.3 真实卡测试 + 立即 refund 是否完整覆盖正反路径
- [ ] §7 rollback 的 atomic 时间是否可信（< 1 min）
- [ ] §8 7 个开放问题给立场

## 10. Timeline（today）

| 时段 | 任务 | 谁 | 阻塞前置 |
|---|---|---|---|
| now | 评审本 plan（codex）| codex | — |
| +1h | §3.1 Stripe 账号 verification 状态 | user | plan approve |
| +1.5h | §4.1 Sentry 实装 | user (DSN) + claude | plan approve |
| +2h | §4.2 yearly 合规文案 | claude | plan approve |
| +2.5h | §4.3 PAST_DUE 改动 | claude | plan approve |
| +3h | §4.4 §4.5 portal + refund policy | user (portal) + claude (refund page) | §4.4 portal config |
| +3.5h | §5 Stripe Dashboard 配置（live webhook + email + business）| user | §3.1 通过 |
| +4h | §6.1 pre-flight | claude | §3-5 完成 |
| +4.5h | §6.2 切 keys（atomic） | user | §6.1 通过 |
| +5h | §6.3 live smoke test + refund | user (browser) + claude (DB verify) | §6.2 完成 |
| +5.5h | §6.4 监控启动 | claude | §6.3 通过 |
| +24h | rollback window 结束，正式上线 | — | 24h 无异常 |

**今天**走通到 §6.4 启动监控（5.5 小时），但**正式上线**意味着**24 小时无异常**后才宣布。这一点要先和你对齐。
