# Scivra Stripe Live Mode Cutover Plan v3 (A2 Route)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> 替代 v1（REJECT）/ v2（REJECT）。
> Status: **draft, awaiting Codex v3 review**.
> Target: 2026-05-08（今天）切到 live keys + 单笔 smoke 验证 + checkout switch 维持关闭 24-48h，监控通过后再全量打开。

## 0. v2 → v3 关键变更

### 路线变更（A2 而非 B 全量）

用户重新评估后选 A2：**不今天全量**。今天只到"代码合并部署 + 切 live keys + 单笔 self smoke + 立刻关 checkout 开关"。24-48h 监控/修补后再全量打开 checkout。

理由：
- Codex v2 review 6 P0 有 5 个工程错（与 K12 / COPPA 无关），即使全成人 B2C 也得修
- "今天全量" + "K12 SaaS" + "5 P0 未修" 三件事叠加风险敞口太大
- A2 把"全量打开"延到 24-48h 后，给真实修补 + 观测窗口

### COPPA attestation 降级（撤回 v2 §4.10）

Scivra `src/core/compliance/service.ts:105` 已 block u13 sign-up（`allowSignup: input.ageGroup !== 'u13'`）。FTC mixed-audience rule 下做了 age screening 就合规。**v2 §4.10 server-side attestation 不需要做**，但保留 §4.5 Terms 一致性 + §4.2 yearly disclaimer。

### Codex v2 review 5 P0 全部吸收

| Codex P0 | v3 处理位置 |
|---|---|
| Refund 找单链路错 | §4.1 用 metadata 主链路 + invoice/subscription fallback |
| handleRefund 不能本地 cancel sub | §4.2 调 Stripe API cancel + webhook 落本地（idempotent） |
| Cache 验证假（invalid signature 对所有 whsec 都 400） | §4.3 双向 signed webhook 验证 + admin-only health endpoint |
| ~~Attestation 服务端强制~~ | **撤回**（age gate 已 block u13） |
| payment_mode 贯穿所有创建路径 | §4.4 含 renewal order 创建（service.ts） |
| Sentry 验证错（signature error 不进 captureException） | §4.5 用 stripe trigger 制造业务 5xx 验证 |

## 1. 现状

`[VERIFIABLE]` 不变（v2 §1 同样适用）：

- Prod: `sk_test_` keys, 0 active sub, 0 paid order, 13 free user
- Schema: webhook canonical-rows fix 已 apply（wave 1-5）
- Code: commit `8371de5` 已部署 Vercel
- Compliance: age gate 已 block u13；Sentry 是 placeholder（`@sentry/nextjs` 未装）

## 2. A2 路线 + 范围

### 今天目标

- ✅ 5 P0 修齐 + 测试
- ✅ Stripe Dashboard live mode 配置完成（webhook 6 events 含 `charge.refunded`）
- ✅ Switch keys to live（`stripe_checkout_enabled` **保持关闭**）
- ✅ 临时打开 `stripe_checkout_enabled`（仅 helendevenk 自己），走单笔 self smoke
- ✅ Verify 退款落库 + DB invariants
- ✅ 立即关回 `stripe_checkout_enabled`
- ✅ 监控启动（Sentry alert + Vercel logs watcher）

### 今天**不**做

- ❌ 全量打开 checkout（推迟到 24-48h 监控后）
- ❌ Stripe Tax / 国际 sales tax
- ❌ COPPA verifiable parental consent (micro-charge)
- ❌ Server-side attestation 强制
- ❌ partial refund 处理逻辑
- ❌ subscription pause / 复活流程

### 24-48h 监控窗口的 gate

只有所有以下 satisfied 才打开 `stripe_checkout_enabled`：
1. 24h 内 Sentry 无任何 webhook route 5xx
2. Stripe Dashboard webhook deliveries 全部 200
3. Smoke test 的 order/sub/credit 状态稳定（refund 后无回滚）
4. 用户主动 review 24h 内 Vercel logs payment 路径

## 3. 风险评估

| 风险 | 概率 | 缓解 | 接受/未接受 |
|---|---|---|---|
| Smoke 用真卡扣自己 $4.99 | 低 | §6 全程录屏 + 即时 refund | 接受 |
| 切 keys 后 cache 滞后导致 webhook 验签失败 | 低 | §4.3 双向验证 | 缓解 |
| 24-48h 间歇性 webhook（无新交易但有 Stripe 测试 events） | 中 | §4.3 health endpoint + Sentry alert | 缓解 |
| 关 checkout 期间用户访问 /pricing 看到 "Subscribe" 按钮但点击失败 | 中 | §6.5 加 friendlier 503 message + 维持 button disabled UI | 缓解 |
| 老 test 数据混入 live 视图 | 中 | §4.4 payment_mode 贯穿全路径 | 缓解 |
| 24h 内任何异常 → rollback 容易吗 | 高 | §7 双开关 rollback | 缓解 |

## 4. P0 工程改动

### 4.1 Refund 找单链路（修 v2 致命错）

**根因**：当前 order.transactionId 字段在不同事件填不同 ID：
- Checkout success → `cs_xxx` (Stripe Checkout Session)
- First invoice → `in_xxx` (Invoice)
- Renewal invoice → `in_yyy`
- Refund event → `ch_xxx` (Charge)

`findOrderByTransactionId(charge.id)` 拿 `ch_xxx` 找 order 永远失败。

**方案**：order_no 通过 Stripe metadata 链路传递。

#### 4.1.1 Checkout 创建时把 order_no 写入 nested metadata

`/api/payment/checkout/route.ts` 现在：
```ts
sessionParams.metadata = order.metadata;  // session-level
```

改成同时写到 payment_intent / subscription / invoice 的 metadata：

```ts
sessionParams.metadata = order.metadata; // session-level (existing)
if (order.type === PaymentType.SUBSCRIPTION) {
  sessionParams.subscription_data = {
    metadata: order.metadata,
  };
} else {
  sessionParams.payment_intent_data = {
    metadata: order.metadata,
  };
}
```

效果：未来 charge / invoice / subscription 都能从自己的 metadata 拿到 `order_no`。

#### 4.1.2 stripe.ts buildPaymentSessionFromCharge

新增方法：

```ts
private async buildPaymentSessionFromCharge(
  charge: Stripe.Charge
): Promise<PaymentSession> {
  // Refund 链路：charge → payment_intent.metadata.order_no（首付）
  // 或 charge → invoice → subscription.metadata.order_no（续费）

  let orderNo: string | undefined;

  // Path 1: charge.metadata（mostly empty in subscription path）
  if (charge.metadata?.order_no) {
    orderNo = charge.metadata.order_no;
  }

  // Path 2: charge.payment_intent.metadata
  if (!orderNo && charge.payment_intent) {
    const pi = await this.client.paymentIntents.retrieve(
      charge.payment_intent as string
    );
    orderNo = pi.metadata?.order_no;
  }

  // Path 3: invoice — **先查本地 renewal order**（subscription.metadata 指向
  // 首单不指向 renewal，所以不能直接拿 subscription.metadata）
  // 优先：findOrderByTransactionId(invoice.id) 在本地 renewal order 表找单
  // Fallback：subscription.metadata.order_no（用于退首单的边缘场景）
  if (!orderNo && charge.invoice) {
    const invoice = await this.client.invoices.retrieve(
      charge.invoice as string,
      { expand: ['subscription'] }
    );
    // route handler 会用 invoice.id 查本地 renewal order，
    // 这里只 surface invoice.id 给 caller，由 caller decide
    return {
      ...this.buildBaseRefundSession(charge),
      metadata: {
        // route 用这个优先级查 order：
        order_no_from_pi: orderNo,  // path 1/2
        invoice_id: invoice.id,     // path 3 主：本地查 renewal order
        subscription_id:
          typeof invoice.subscription === 'string'
            ? invoice.subscription
            : invoice.subscription?.id,
        order_no_from_sub:
          invoice.subscription && typeof invoice.subscription !== 'string'
            ? invoice.subscription.metadata?.order_no
            : undefined,  // path 3 fallback：subscription metadata（仅指首单）
      },
    };
  }

  return {
    provider: this.name,
    paymentStatus: PaymentStatus.REFUNDED,  // 新增 enum 值（见 4.1.4）
    paymentInfo: {
      transactionId: charge.id,
      paymentAmount: charge.amount_refunded,
      paymentCurrency: charge.currency,
      // ...
    },
    paymentResult: charge,
    metadata: orderNo ? { order_no: orderNo } : {},
  };
}
```

#### 4.1.3 getPaymentEvent 加 PAYMENT_REFUNDED 分支

```ts
} else if (eventType === PaymentEventType.PAYMENT_REFUNDED) {
  paymentSession = await this.buildPaymentSessionFromCharge(
    event.data.object as Stripe.Response<Stripe.Charge>
  );
}
```

#### 4.1.4 PaymentStatus.REFUNDED + OrderStatus.REFUNDED

`src/extensions/payment/types.ts`：
```ts
export enum PaymentStatus {
  PROCESSING = 'processing',
  SUCCESS = 'paid',
  FAILED = 'failed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',  // 新
}
```

`src/shared/models/order.ts`：
```ts
export enum OrderStatus {
  PENDING = 'pending',
  CREATED = 'created',
  COMPLETED = 'completed',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',  // 新
}
```

#### 4.1.5 mapStripeEventType 加 charge.refunded

```ts
case 'charge.refunded':
  return PaymentEventType.PAYMENT_REFUNDED;
```

### 4.2 handleRefund: Stripe API cancel + webhook 落本地（修 v2 错）

**根因**：v2 让 handleRefund 直接本地 cancel sub。但 Stripe 后续 `customer.subscription.updated` 事件会**把本地 status 打回 active**（除非 Stripe 上也 canceled）。

**方案**：refund 触发时**调 Stripe API cancel subscription**，然后让 Stripe webhook (`customer.subscription.deleted`) 自然走 `handleSubscriptionCanceled` 落本地。idempotent：如果 Stripe 上已 canceled，cancel 是 noop。

`src/shared/services/payment.ts` 新增：

```ts
export async function handleRefund({
  order,
  session,
}: { order: Order; session: PaymentSession }) {
  // 1. 在本地 transaction 内：
  //    - order.status = REFUNDED
  //    - 撤销 grant credit (set remaining_credits = 0, status = 'expired')
  await updateOrderInTransaction({
    orderNo: order.orderNo,
    updateOrder: {
      status: OrderStatus.REFUNDED,
      paymentResult: JSON.stringify(session.paymentResult),
    },
    // 不在 tx 内 mutate credit，直接独立 update
  });

  await db()
    .update(creditTable)
    .set({
      status: CreditStatus.EXPIRED,
      remainingCredits: 0,
    })
    .where(
      and(
        eq(creditTable.orderNo, order.orderNo),
        eq(creditTable.transactionType, CreditTransactionType.GRANT)
      )
    );

  // 2. 如果是 subscription 订单，调 Stripe API cancel sub
  //    Stripe 的 customer.subscription.deleted webhook 会落本地状态
  if (order.subscriptionNo && order.subscriptionId) {
    const paymentService = await getPaymentService();
    const provider = paymentService.getProvider(order.paymentProvider);
    if (provider?.cancelSubscription) {
      try {
        await provider.cancelSubscription({
          subscriptionId: order.subscriptionId,
        });
      } catch (err: any) {
        // Idempotent: already canceled is OK
        if (
          err?.message?.includes('No such subscription') ||
          err?.message?.includes('canceled')
        ) {
          return;
        }
        throw err;
      }
    }
  }
}
```

#### 4.2.1 webhook route 加 PAYMENT_REFUNDED 分支（修 Codex v3 阻断项 1）

`/api/payment/notify/[provider]/route.ts`:

```ts
} else if (eventType === PaymentEventType.PAYMENT_REFUNDED) {
  // 优先级：path 1/2 metadata.order_no_from_pi → path 3 invoice.id 查 renewal
  // → path 3 fallback subscription.metadata.order_no_from_sub
  let order: Order | null = null;
  const meta = session.metadata as {
    order_no_from_pi?: string;
    invoice_id?: string;
    subscription_id?: string;
    order_no_from_sub?: string;
  };

  // Try 1: payment_intent.metadata.order_no（首单 / one-time）
  if (meta?.order_no_from_pi) {
    order = await findOrderByOrderNo(meta.order_no_from_pi);
  }

  // Try 2: invoice.id 在本地 renewal order 表查（renewal refund 的可靠路径）
  if (!order && meta?.invoice_id) {
    order = await findOrderByTransactionId({
      transactionId: meta.invoice_id,
      paymentProvider: provider,
    });
  }

  // Try 3: subscription.metadata.order_no（首单退款边缘场景兜底）
  if (!order && meta?.order_no_from_sub) {
    order = await findOrderByOrderNo(meta.order_no_from_sub);
  }

  if (order) {
    await handleRefund({ order, session });
  } else {
    console.log('refund for unknown order, skipping', meta);
    captureServerError(new Error('refund_no_order_match'), {
      route: '/api/payment/notify/stripe',
      eventType: 'PAYMENT_REFUNDED',
      meta,
    });
  }
}
```

**前置**：`src/shared/models/order.ts` 加 `findOrderByTransactionId({ transactionId, paymentProvider })` model 函数（如果还没有）。

#### 4.2.2 Partial refund detect + alert (今天不处理但要识别)

如 `charge.amount_refunded < charge.amount`：log warning + Sentry capture，不撤 credit / 不 cancel。这避免误标 partial refund 为 full refund。

```ts
const isFullRefund = charge.amount_refunded === charge.amount;
if (!isFullRefund) {
  // Sentry: alert ops, manual handle
  captureServerError(new Error('partial_refund_received'), {
    chargeId: charge.id,
    refunded: charge.amount_refunded,
    total: charge.amount,
    orderNo,
  });
  // do NOT proceed to revoke credit / cancel sub
  return;
}
```

### 4.3 Cache 切换验证（修 v2 假命题）

**根因**：v2 用 invalid signature 触发 400 不能证明 live `whsec_` 已生效（旧 secret 也返回 400）。

**方案 A**：双向 signed webhook test。

切 keys 后，跑两个 curl：

```bash
# 1. 用旧 test whsec_ 签消息
TEST_WHSEC="whsec_9e99dfdb5a1a06661393e81627f8922d596880efbca0cdd138d6140360634c8f"
LIVE_WHSEC="whsec_xxxxx_from_dashboard"
TS=$(date +%s)
BODY='{"id":"evt_cache_check","object":"event","type":"payment_intent.created","data":{"object":{}}}'

# 关键：HMAC key 用完整 whsec_ 字符串（含前缀），不要 strip。stripe-node
# 内部 constructEvent 也用完整字符串做 HMAC。

# Sign with TEST whsec
TEST_SIG=$(printf '%s.%s' "$TS" "$BODY" | openssl dgst -sha256 -hmac "$TEST_WHSEC" -hex | awk '{print $2}')
curl -X POST https://scivra.com/api/payment/notify/stripe \
  -H "Content-Type: application/json" \
  -H "stripe-signature: t=${TS},v1=${TEST_SIG}" \
  --data-binary "${BODY}"
# expect 400 invalid signature (old whsec rejected)

# Sign with LIVE whsec
LIVE_SIG=$(printf '%s.%s' "$TS" "$BODY" | openssl dgst -sha256 -hmac "$LIVE_WHSEC" -hex | awk '{print $2}')
curl -X POST https://scivra.com/api/payment/notify/stripe \
  -H "Content-Type: application/json" \
  -H "stripe-signature: t=${TS},v1=${LIVE_SIG}" \
  --data-binary "${BODY}"
# expect 200 {"code":0,"message":"ignored"} (live whsec accepted, unknown event silent skip)
```

如果旧 returns 200 OR 新 returns 400 → cache 没生效，等 30s 重试。

**方案 B**：admin-only health endpoint（更可观测，今天加）。

新建 `/api/admin/payment-health/route.ts`：

```ts
import { getAllConfigs } from '@/shared/models/config';
import { canAccessAdmin } from '@/core/rbac/permission';
import { getSignUser } from '@/shared/models/user';
import { getPaymentService } from '@/shared/services/payment';

export async function GET() {
  const user = await getSignUser();
  if (!user) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }
  // 用项目实际权限函数（canAccessAdmin 或 SETTINGS_READ/PAYMENTS_READ
  // 二选一；isUserAdmin 当前不存在）。
  const allowed = await canAccessAdmin(user.id);
  if (!allowed) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  const configs = await getAllConfigs();
  const paymentService = await getPaymentService();
  const stripeProvider = paymentService.getProvider('stripe');

  // 显式 surface env override 状态：getAllConfigs 内部会让 env 优先于
  // DB；如果 Vercel env 还挂着 STRIPE_* 就要看到。
  const envOverride = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'set' : '(unset)',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY
      ? 'set'
      : '(unset)',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
      ? 'set'
      : '(unset)',
  };

  return Response.json(
    {
      stripe_enabled: configs.stripe_enabled,
      stripe_checkout_enabled: configs.stripe_checkout_enabled ?? '(unset)',
      stripe_checkout_mode: configs.stripe_checkout_mode ?? '(unset)',
      stripe_secret_key_mode:
        configs.stripe_secret_key?.startsWith('sk_live_')
          ? 'live'
          : configs.stripe_secret_key?.startsWith('sk_test_')
            ? 'test'
            : '(unset)',
      stripe_publishable_key_mode:
        configs.stripe_publishable_key?.startsWith('pk_live_')
          ? 'live'
          : configs.stripe_publishable_key?.startsWith('pk_test_')
            ? 'test'
            : '(unset)',
      stripe_signing_secret_set: !!configs.stripe_signing_secret,
      stripe_provider_registered: !!stripeProvider,
      env_override: envOverride,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
```

**前置**：grep 确认 `canAccessAdmin` 在 `src/core/rbac/permission.ts` 真实存在，否则改用 `hasPermission(user.id, 'admin.settings.read')` 或类似。`configs.updated_at` 字段当前不存在，移除该返回。

切 keys 后第一件事：`curl /api/admin/payment-health` 看返回 `stripe_secret_key_mode: 'live'` + `stripe_provider_registered: true`。

### 4.4 payment_mode 贯穿所有创建路径

#### 4.4.1 Schema

`src/config/db/schema.ts` order + subscription 表加：

```ts
paymentMode: text('payment_mode').default('test').notNull(), // 'test' | 'live'
```

#### 4.4.2 Cleanup migration（apply 到 dev + prod）

```sql
ALTER TABLE "order" ADD COLUMN payment_mode text NOT NULL DEFAULT 'test';
ALTER TABLE subscription ADD COLUMN payment_mode text NOT NULL DEFAULT 'test';
-- Existing rows are test; live data will set explicitly
```

#### 4.4.3 Checkout 创建时设置（`/api/payment/checkout/route.ts`）

```ts
const isLiveMode = configs.stripe_secret_key?.startsWith('sk_live_') ?? false;
const order: NewOrder = {
  // ...
  paymentMode: isLiveMode ? 'live' : 'test',
};
```

#### 4.4.4 **关键修补**：Renewal order 创建也要设（`payment.ts` `handleSubscriptionRenewal` 第 361 行附近）：

```ts
const order: NewOrder = {
  id: getUuid(),
  orderNo: orderNo,
  // ... existing fields ...
  paymentMode: subscription.paymentMode,  // 继承自原 subscription
  paymentType: PaymentType.RENEW,
  // ...
};
```

#### 4.4.5 buildNewSubscription 也要从 order 继承：

`payment.ts` `buildNewSubscription`（line 148 附近）加：
```ts
return {
  // ...
  paymentMode: order.paymentMode,
};
```

#### 4.4.6 admin UI

`/admin/subscriptions` 和 `/admin/payments` 加 `payment_mode` 列 + tab filter（live / test / all）。

### 4.5 Sentry 真验证（修 v2 错）

**根因**：v2 用 invalid signature → 400，但 route.ts 当前 PaymentSignatureError 直接 return 400 不进 captureException。所以这个验证是假的。

**方案**：用 stripe trigger 制造业务 5xx：

```bash
# 触发一个会让 handleCheckoutSuccess 失败的事件
# checkout.session.completed with metadata.order_no = NONEXISTENT
stripe trigger checkout.session.completed \
  --override checkout_session:metadata.order_no=ORDER_NONEXISTENT_FOR_SENTRY_TEST
```

route 走到 `findOrderByOrderNo('ORDER_NONEXISTENT_...')` 返回 null → throw "order not found" → catch 进入 500 路径 → captureServerError fires。

期望：
- HTTP 500 返回 Stripe（Stripe 重试，但因为是测试 event 重试也失败，最后 give up）
- Sentry 收到 1 条 error，level=error，包含 provider/eventType/orderNo context

#### 4.5.1 真接 @sentry/nextjs（替换 placeholder）

`pnpm add @sentry/nextjs`

新建 sentry.client.config.ts / sentry.server.config.ts / sentry.edge.config.ts，instrumentation.ts。

修 `src/extensions/monitoring/sentry.ts`：把 `console.error('[sentry-placeholder]')` 替换成真 `Sentry.captureException(error, { extra: context })`。

Vercel env vars：`NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_RELEASE=${VERCEL_GIT_COMMIT_SHA:-dev}`。

### 4.6 三态开关 + smoke allowlist（修 Codex v3 阻断项 2）

**根因**：v2 双开关只能 disabled / enabled。§6.3 "开 5 分钟单笔 smoke" 期间任何已登录用户都能 checkout。

**方案**：把 `stripe_checkout_enabled`（boolean）升级为 `stripe_checkout_mode`（enum: `disabled | smoke | enabled`）。

#### 4.6.1 admin setting 改

`src/shared/services/settings.ts`：

```ts
{
  name: 'stripe_checkout_mode',
  title: 'Stripe Checkout Mode',
  type: 'select',
  value: 'disabled',
  options: [
    { title: 'Disabled (no checkouts)', value: 'disabled' },
    { title: 'Smoke (allowlist only)', value: 'smoke' },
    { title: 'Enabled (all users)', value: 'enabled' },
  ],
  tip: 'In smoke mode, only stripe_smoke_user_emails can checkout',
  group: 'stripe',
  tab: 'payment',
},
{
  name: 'stripe_smoke_user_emails',
  title: 'Smoke Allowlist (CSV emails)',
  type: 'textarea',
  placeholder: 'helendevenk@gmail.com',
  tip: 'Only these users can checkout when stripe_checkout_mode=smoke',
  group: 'stripe',
  tab: 'payment',
},
```

#### 4.6.2 checkout route 校验

`/api/payment/checkout/route.ts`：

```ts
const mode = configs.stripe_checkout_mode ?? 'disabled';
if (mode === 'disabled') {
  return respErr('Checkout is temporarily disabled. Please try again later.');
}
if (mode === 'smoke') {
  const allowlist = (configs.stripe_smoke_user_emails ?? '')
    .split(/[,\n]/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!allowlist.includes(user.email.toLowerCase())) {
    return respErr('Checkout is temporarily limited to smoke testers.');
  }
}
// mode === 'enabled' → fall through to checkout
```

#### 4.6.3 Stripe webhook handling 不受影响

`stripe_enabled`（boolean）继续控制 PaymentManager 是否注册 stripe provider。
- `stripe_enabled=true` + `stripe_checkout_mode=disabled` = 现有 sub 续费 / 退款 webhook 继续，新 checkout 关
- `stripe_enabled=true` + `stripe_checkout_mode=smoke` = 仅 allowlist 能 checkout
- `stripe_enabled=true` + `stripe_checkout_mode=enabled` = 全量
- `stripe_enabled=false` = 完全停（webhook 也 500 重试）

admin UI 文案：
- `stripe_enabled`: "Process Stripe webhooks (always keep ON unless full disable)"
- `stripe_checkout_mode`: "Who can start a new checkout (disabled / smoke / enabled)"
- `stripe_smoke_user_emails`: "CSV emails allowed in smoke mode"

### 4.7 Yearly disclaimer + Terms 一致（v2 §4.2 + §4.5 不变）

§4.2 加 PricingItem.billing_disclaimer 字段 + pricing.tsx 渲染。
§4.5 改 /terms 段落 148 一致到 7-day refund 政策。

### 4.8 PAST_DUE 访问权限（v2 §4.3 不变）

允许 PAST_DUE 用户访问 + UI banner 提示。

## 5. Stripe Dashboard Setup（用户驱动）

### 5.1 Account activation 自动检查

```bash
curl -s https://api.stripe.com/v1/account \
  -u sk_live_xxx: | jq '{
    charges_enabled,
    payouts_enabled,
    requirements_currently_due: .requirements.currently_due,
    requirements_disabled_reason: .requirements.disabled_reason
  }'
```

Pass: `charges_enabled=true`, `payouts_enabled=true`, currently_due 为空数组, disabled_reason 为 null。

### 5.2 Live Webhook Endpoint（**6 events**）

[https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks) (live mode):

- URL: `https://scivra.com/api/payment/notify/stripe`
- Events:
  1. `checkout.session.completed`
  2. `invoice.payment_succeeded`
  3. `invoice.payment_failed`
  4. `customer.subscription.updated`
  5. `customer.subscription.deleted`
  6. **`charge.refunded`**（修 v2 漏勾）

复制 live `whsec_...`。

### 5.3 Customer Portal config（v2 §4.4 不变）

### 5.4 Business / Email / Statement descriptor（v2 §5.2 不变）

## 6. Cutover 流程（A2 specific）

### 6.1 Pre-flight checks（10 min）

- §3.1 Stripe account check pass
- §4.4.2 schema migration applied to **dev + prod** 两边
- 单元 + 集成测试 GREEN（含 §4.1-4.5 新代码）
- §4.5 Sentry actual capture verified (in dev with stripe trigger)
- 5 PR commits 已 deploy 到 prod

### 6.2 切 keys（atomic with health check）

1. 进 prod `/admin/settings/payment`
2. **关** `stripe_checkout_enabled` switch（保存）
3. 替换 4 字段为 live keys
4. 立刻 `curl /api/admin/payment-health` 验证 mode=live + provider registered
5. 跑 §4.3 双向 signed webhook test 确认 cache 生效
6. **保持** `stripe_checkout_enabled` 关闭

### 6.3 单笔 self smoke（30 min，allowlist 模式）

仅 helendevenk@gmail.com 自己测：

1. admin 设 `stripe_checkout_mode = smoke` + `stripe_smoke_user_emails = helendevenk@gmail.com`
2. 浏览器 /pricing → Pro Monthly Subscribe（$4.99 最便宜）
3. 真实信用卡 → checkout 完成
4. smoke 完成后 admin 切 `stripe_checkout_mode = disabled`
5. 走完整 lifecycle：
   - /settings/billing 看到新订阅
   - "Manage subscription" → live customer portal → cancel immediately
   - Stripe Dashboard → Live Payments → 找最近 $4.99 → Refund full
6. 等 webhook（charge.refunded）落库
7. 验证 prod DB（含 payment_mode = 'live'）：

```sql
SELECT order_no, status, payment_mode FROM "order"
WHERE payment_mode = 'live' ORDER BY created_at DESC LIMIT 1;
-- expect status='refunded'

SELECT remaining_credits, status FROM credit
WHERE order_no = (SELECT order_no FROM "order" WHERE payment_mode = 'live' ORDER BY created_at DESC LIMIT 1);
-- expect remaining_credits=0, status='expired'

SELECT status FROM subscription
WHERE payment_mode = 'live' ORDER BY created_at DESC LIMIT 1;
-- expect 'canceled'
```

### 6.4 监控启动 + 24-48h gate

- Sentry alert rule：webhook route 任何 error → email
- Stripe Dashboard webhook deliveries 24h 全 200
- Vercel logs 写一个 grep alias：`vercel logs --follow | grep -E "payment|notify|checkout"`

### 6.5 24-48h 后全量打开

只有以下全 satisfied 才开 `stripe_checkout_enabled`：
- ✅ 24h 内 Sentry 0 个 webhook route 5xx
- ✅ Stripe webhook deliveries 100% 200
- ✅ DB 状态稳定（refund 后无 status reversal）
- ✅ 用户主动 review Vercel logs 无异常

打开方式：admin UI 切换 switch + 监控前 1h 高频。

## 7. Rollback Plan

### 7.1 紧急停新交易（< 30s）

`/admin/settings/payment` → 关 `stripe_checkout_enabled` → 保存。

效果：
- 新 checkout 立刻 503
- 已有 webhook（renewal / refund）继续处理
- Stripe 不会重试堆积

### 7.2 切回 test mode（5 min）

从 backup `prod-pre-stripe-fix-20260507.json` 读 stripe_* 字段恢复。

### 7.3 真退款已收钱

进 [Live Payments](https://dashboard.stripe.com/payments)，每笔单独 refund。

## 8. 留给 Codex v3 评审的开放问题

1. **§4.1 metadata 链路**：`subscription_data.metadata` 在 Stripe 上随 subscription 永久附着，但 `payment_intent_data.metadata` 只在该 PI lifecycle 内有效。我用 invoice.subscription.metadata 兜底续费场景，是否够？
2. **§4.2 partial refund 仅 alert 不处理**：用户体验上 partial refund 后 credit 还在，subscription 还在 active。今天范围内不处理 ok 吗？还是必须有最低限度的 admin 通知？
3. **§4.3 admin payment-health endpoint 是否要加 rate limit**：admin-only，但 admin 本身就少，rate limit 必要吗？
4. **§4.4 schema migration**：加 `payment_mode` 列是 ALTER TABLE，对 prod 有锁表风险吗？Neon 上多大量级 OK？
5. **§4.5 Sentry**：`@sentry/nextjs` 装 + manual config 跨 client/server/edge 三个文件够吗？还是用 wizard 更稳？
6. **§6.3 single-user smoke**：开 `stripe_checkout_enabled` 5 分钟期间如果有别人尝试 checkout（恰好访问到 /pricing 点 Subscribe），他能成功 checkout 吗？需要加 user_id 白名单吗？
7. **§6.5 全量打开 gate 4 条**：是否需要更量化（比如 "Sentry 0 个 5xx" 改成 "Sentry < 3 个 transient 5xx"）？

## 9. Codex v3 评审 checklist

- [ ] §4.1 refund 链路对所有 subscription / one-time 路径都 cover
- [ ] §4.2 handleRefund 调 Stripe API 是 idempotent，且 partial refund 处理可接受
- [ ] §4.3 双向 signed webhook + admin health 验证 cache 是否真 robust
- [ ] §4.4 payment_mode 是否漏某个创建路径（grantInitialCredit? handleSubscriptionRenewal? handleSubscriptionPaymentFailed?）
- [ ] §4.5 Sentry trigger via stripe trigger 是否会真触发 captureException
- [ ] §6.3 5 分钟开放窗口期是否够单笔 smoke + 万一别人捷足先登的处理
- [ ] §6.5 24-48h gate 4 条是否充分
- [ ] §8 7 个开放问题给立场

## 10. Timeline (today, A2 route)

| 时段 | 任务 | 谁 |
|---|---|---|
| now | codex v3 review | codex |
| +30min | Stripe account check | user |
| +2h | §4.5 Sentry 真装 + verify | claude (code) + user (DSN) |
| +3h | §4.1-4.2 refund 完整流程 + tests | claude |
| +4h | §4.3 双向 signed webhook + admin health endpoint | claude |
| +4.5h | §4.4 payment_mode schema + 全路径 | claude |
| +5h | §4.7 yearly disclaimer + §4.8 PAST_DUE + §4.5 Terms | claude |
| +5.5h | §4.6 双开关 admin UI 文案 | claude |
| +6h | 整 worktree codex review + fix | codex + claude |
| +6.5h | merge + push + Vercel deploy | user |
| +7h | §3.1 Stripe account check + §5 Stripe Dashboard config | user |
| +7.5h | §6.1 pre-flight | claude |
| +7.75h | §6.2 切 keys（关 checkout）+ §4.3 验证 cache | user + claude |
| +8h | §6.3 单笔 self smoke + refund | user (browser) + claude (DB) |
| +8.5h | §6.4 监控启动 | claude |
| +8.5h~24h | 监控窗口（无新交易） | passive |
| +24h | 用户主动 review + 决定 §6.5 全量打开 | user |

**今天**走通到 §6.4，**实际工时 10-12h**（Codex v3 review 调整：8.5h 偏乐观，build/deploy/Stripe CLI / env 检查每步都可能多 30 min）。监控通过后 24-48h 由用户决定切 `stripe_checkout_mode=enabled`。

## 11. v3 → v3 errata（Codex 三审 APPROVE WITH CHANGES 4 阻断项已 patch）

| Codex v3 阻断项 | Patch 位置 |
|---|---|
| §4.1 renewal refund 链路（subscription.metadata 仅指首单） | §4.2.1 webhook route 用 `(provider, invoice.id)` 查本地 renewal order 优先；metadata fallback 仅做兜底 |
| §6.3 5min 窗口任何登录用户能 checkout | §4.6 升级为三态开关 `stripe_checkout_mode = disabled / smoke / enabled` + `stripe_smoke_user_emails` allowlist |
| §4.3 HMAC 命令 `${WHSEC#whsec_}` 错（应用完整 whsec_）| §4.3 改成 `printf '%s.%s' "$TS" "$BODY" \| openssl dgst -hmac "$WHSEC"`（不 strip 前缀）+ `--data-binary` |
| §4.3 health endpoint isUserAdmin / configs.updated_at 不存在 / env override 没暴露 | §4.3 改用 `canAccessAdmin`；移除 `configs.updated_at`；surface `STRIPE_*` env override 状态 |

Codex 三审 7 个开放问题立场全部采纳：
1. metadata 链路不够 → renewal 必须 invoice.id 查本地 order ✅
2. partial refund 仅 alert 可接受，必须 Sentry alert + admin SOP ✅
3. admin health 不需要 rate limit，admin auth + no-store + audit log 足够 ✅
4. payment_mode migration nullable add → backfill → set not null 三步 ✅（§4.4.2 改进）
5. Sentry 推荐 wizard 生成再裁剪 ✅
6. user_id/email allowlist 必须加 ✅
7. gate 不放宽（A2 的意义就是把全量 gate 设硬）✅

