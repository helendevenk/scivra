# Stripe Webhook Race Fix Execution Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 把 v3 fix plan（`docs/plans/2026-05-07-stripe-webhook-fix-plan-v3.md`）拆成 22 个 atomic tasks，标注 codex/claude 路由 + wave 并行分组，多 agent 协作完成。

**Architecture:** TDD 优先 — 先建测试基础设施，再写失败测试，再实现。Wave-based 并行：每 wave 内 mutually-exclusive 文件的 task 同时 dispatch；wave 间串行。

**Tech Stack:** TypeScript / Drizzle 0.44.5 / Postgres 17 (Neon) / Stripe API 2026-02-25 / Vitest + testcontainers / @upstash/redis

## 关联文档

- v3 fix plan（设计依据）：`docs/plans/2026-05-07-stripe-webhook-fix-plan-v3.md`
- v3 三审 errata（开工前必读）：v3 plan §9
- 历史 review：v1 / v2 计划 + Codex review 留存

## 文件冲突矩阵

哪些文件被多个 task 改 → 必须串行，**不能并行**：

| 文件 | 涉及 tasks | 串行顺序 |
|---|---|---|
| `src/extensions/payment/types.ts` | T4 (enum 扩) + T6 (interface null) + T9 (PaymentSignatureError 抽象) | T4 → T6 → T9 |
| `src/extensions/payment/stripe.ts` | T3 (discount fix) + T4 (status mapping) + T6 (mapStripeEventType) + T9 (signature error 包装) | T3 → T4 → T6 → T9 |
| `src/app/api/payment/notify/[provider]/route.ts` | T8 (PAYMENT_FAILED 分支) + T9 (错误码分级) + T13 (Sentry context) | T8 → T9 → T13 |
| `src/shared/services/payment.ts` | T8 (handleSubscriptionPaymentFailed) | 单线 |
| `src/shared/models/order.ts` | T11 (canonical 重写) | 单线 |
| `src/shared/models/credit.ts` | T12 (orderNo:'' → null) | 单线 |
| `src/shared/models/subscription.ts` | T5b (本文件自带的 SubscriptionStatus enum 也要扩) | 单线 |
| `src/config/db/schema.ts` | T10a (subscription/order UNIQUE + credit uniqueIndex) | 单线 |
| `src/config/db/migrations/*.sql` | T10b (cleanup migration) | 单线 |

哪些文件全新 / 独立 → **可以并行**：

| 文件 | Task |
|---|---|
| `tests/setup/testcontainers-postgres.ts`（新） | T1 |
| `tests/unit/payment/stripe-event-mapping.test.ts`（新） | T2a |
| `tests/unit/payment/stripe-invoice-discount.test.ts`（新） | T2b |
| `tests/unit/payment/stripe-status-mapping.test.ts`（新） | T2c |
| `tests/integration/subscription-race.test.ts`（新） | T2d |
| `tests/migrations/stripe-race-cleanup.test.ts`（新） | T2e |
| `docs/payment/stripe-setup.md`（已存在，独立改） | T17 |
| `tests/integration/subscription-lifecycle.test.ts`（已存在，独立改） | T15 |

## Tasks

每个 task 列：files / 路由 / 依赖 / 估时。Atomic (2-5 min) steps 在每个 task 内部展开。

| # | Task | 路由 | 文件冲突组 | 依赖 | 估时 |
|---|---|---|---|---|---|
| T0 | 建 worktree `fix/stripe-webhook-canonical-rows` | claude | git | 无 | 5 min |
| T1 | testcontainers PG infra（vitest globalSetup） | codex | 独立 | T0 | 60 min |
| T2a | 写失败测试：stripe-event-mapping | codex | 独立 | T0 | 20 min |
| T2b | 写失败测试：stripe-invoice-discount | codex | 独立 | T0 | 15 min |
| T2c | 写失败测试：stripe-status-mapping | codex | 独立 | T0 | 25 min |
| T2d | 写失败测试：subscription-race（11 cases） | codex | 独立 | T1 | 90 min |
| T2e | 写失败测试：stripe-race-cleanup（6 fixtures） | codex | 独立 | T1 | 60 min |
| T3 | 修 Bug 2 discount 数组越界（单行 + 验证 T2b 转 PASS） | codex | stripe.ts (lock-1) | T2b | 10 min |
| T4 | Bug 5.A 扩 SubscriptionStatus enum + 5.B status mapping（验证 T2c PASS） | codex | types.ts/stripe.ts (lock-2) | T2c, T3 | 30 min |
| T5a | Bug 5.C UI: billing 页面 4 个新状态英文 label | codex | billing UI 文件 | T4 | 30 min |
| T5b | Bug 5.C: `src/shared/models/subscription.ts` 自带 enum 扩 + 测试 mock | codex | subscription.ts (独立) | T4 | 30 min |
| T6 | Bug 1 unknown event silent skip + 3 provider interface 对齐 | codex | types.ts/stripe.ts/paypal/creem (lock-3) | T2a, T4 | 45 min |
| T7 | Bug 3: 更新 stripe-setup.md webhook 5 events + `stripe listen --events` | codex | docs (独立) | T6 | 20 min |
| T8 | Bug 5.D: PAYMENT_FAILED 分支 + handleSubscriptionPaymentFailed | codex | route.ts/payment.ts (lock-4) | T4 | 45 min |
| T9 | Bug 6: PaymentSignatureError 抽象 + 错误码分级 | codex | types.ts/stripe.ts/route.ts (lock-5) | T6, T8 | 60 min |
| T10a | Bug 4 schema: subscription/order UNIQUE + credit partial uniqueIndex | claude | schema.ts (独立) | 无 | 30 min |
| T10b | Bug 4 cleanup migration SQL（按 errata §9.2 顺序）+ runbook preflight | claude | migrations (独立) | T10a | 60 min |
| T11 | Bug 4 + 7 代码：onConflict + canonical 重写 + fail-closed | claude | order.ts (lock-6) | T2d, T10b | 90 min |
| T12 | credit.ts:352, 390 把 `orderNo: ''` 改 null | codex | credit.ts (独立) | T10b | 15 min |
| T13 | Sentry hookup（webhook route + context） | codex | route.ts (lock-7) | T9 | 30 min |
| T14 | E2E 复测：truncate → register → checkout → 检 §5 10 invariants | claude | manual | T1-T13 | 30 min |
| T15 | 现有 `subscription-lifecycle.test.ts` 断言收紧 | codex | tests (独立) | T11 | 60 min |
| T16 | 清理 `tmp/check.mjs`、`tmp/race-evidence.mjs`、`tmp/credit-orderno-check.mjs` | claude | git | T14 | 5 min |

**总估时：12 小时**（按 wave 并行后实际 wall-clock ~7 小时）。

## Wave Plan

### Wave 0：worktree（5 min，单线）

T0 — 建 worktree。Claude 主线。

### Wave 1：基础设施 + 全新文件（90 min，最大并行）

并行 dispatch 6 个 codex agent，无文件冲突：

- T1: testcontainers infra
- T2a: stripe-event-mapping 测试
- T2b: stripe-invoice-discount 测试
- T2c: stripe-status-mapping 测试
- T10a: schema 改动（claude 主线，与 codex 并行）
- T10b: cleanup migration SQL（claude 主线）

T2d / T2e 必须等 T1（要 testcontainers 基础），不在 wave 1。

### Wave 2：依赖 testcontainers 的测试 + Bug 2/3/4 单文件改（90 min，并行）

- T2d: subscription-race 集成测试（codex）
- T2e: stripe-race-cleanup migration 测试（codex）
- T3: Bug 2 discount 修复（codex，依赖 T2b PASS）
- T12: credit.ts orderNo null（codex，依赖 T10b）
- T15: 现有测试整改（codex，独立，可提前到 Wave 1 但需要 T11 的 schema 信息，放 Wave 2）

注意：T3 触碰 stripe.ts 文件锁，T12 触碰 credit.ts 文件锁，但这两个文件不冲突。

### Wave 3：types.ts + stripe.ts 串行链（90 min，部分并行）

文件锁链路 lock-2 → lock-3 串行：

- T4 (status mapping)，完成后释放 lock-2
- T5a (UI labels) + T5b (model subscription enum) 可与 T6 并行（不同文件）
- T6 (unknown event silent skip + provider interface)，完成后释放 lock-3
- T7 (docs，依赖 T6 但写 docs 不锁代码)

### Wave 4：route.ts + payment.ts 链 + Sentry（120 min）

文件锁 lock-4, lock-5, lock-7 串行：

- T8 (PAYMENT_FAILED 分支)
- T9 (错误码分级)
- T13 (Sentry context)

T11 (canonical 重写代码) 改 order.ts，与 route.ts 链并行 OK：

- T11 (claude 主线，关键路径)

### Wave 5：E2E + cleanup（35 min）

- T14: E2E 手动验证（claude 主线）
- T16: 清理 tmp（claude 主线，T14 后）

## Codex Dispatch 模板

每次派 codex 用 `mcp__codex__codex` tool，跨 task 共享相同 base context：

```
context: 项目 /Users/smith/Desktop/scivra，worktree fix/stripe-webhook-canonical-rows，
v3 plan 和 errata 在 docs/plans/2026-05-07-stripe-webhook-fix-plan-v3.md。
你只做下面这一个 task，不要扩展、不要 commit、不要碰其他文件。

任务编号: T<N>
任务描述: <从 plan 表抄过来>
涉及文件: <精确路径 + 行号>
TDD 步骤:
  1. <写失败测试或读现有测试>
  2. <最小实现>
  3. <跑测试确认 PASS>
  4. 报告 diff + 测试结果

约束: TypeScript strict / 不引入新依赖（除 @testcontainers/postgresql）/ 风格对齐项目现有 / 不超出本 task scope
```

## Atomic Step Templates

### T0：worktree（claude）

```
Step 1: cd /Users/smith/Desktop/scivra
Step 2: git worktree add ../scivra-stripe-fix fix/stripe-webhook-canonical-rows
Step 3: cd ../scivra-stripe-fix
Step 4: 验证 worktree 状态：git status，确认是 clean fresh branch
```

### T1：testcontainers infra（codex 独立可执行）

```
Step 1: pnpm add -D @testcontainers/postgresql
Step 2: 创建 tests/setup/testcontainers-postgres.ts，导出 globalSetup / globalTeardown
        - 启动 postgres:17-alpine container
        - export DATABASE_URL_TEST 到 process.env
        - globalTeardown 关 container
Step 3: 改 vitest.config.ts，integration test 跑 globalSetup
Step 4: 写一个 smoke test 验证基础设施能跑
Step 5: pnpm vitest run tests/setup/  确认 PASS
报告：基础设施代码 + smoke test 输出
```

### T2a-c：单元测试（codex 并行）

每个 .test.ts 文件按 v3 plan §4.1 写完整 case list，不做实现。Run 时全部 FAIL（实现还没做）。

### T2d-e：集成测试（codex 并行，依赖 T1）

按 v3 plan §4.2 + Fixture 6（errata §9.2）写完整。FAIL OK。

### T3：Bug 2（codex）

```
Step 1: 读 src/extensions/payment/stripe.ts:494-496
Step 2: 改 discountAmount: invoice.total_discount_amounts?.[0]?.amount ?? 0
Step 3: pnpm vitest run tests/unit/payment/stripe-invoice-discount.test.ts
Step 4: 5 个 case 全部 PASS
报告：diff + test output
```

### T4-T13：按 v3 plan §2 各 bug 的代码片段，每个 task 独立 dispatch

每次 dispatch 只 quote v3 plan 的对应小节作为完整 spec。Codex 按 spec 写代码。

### T14：E2E（claude 手动）

```
Step 1: TRUNCATE all 业务 tables（保留 RBAC）
Step 2: /sign-up 注册 + super_admin
Step 3: /admin/settings/payment 填 Stripe 凭据
Step 4: stripe listen --events ... --forward-to localhost:3001/api/payment/notify/stripe
Step 5: /pricing → Pro Monthly → 4242 4242 4242 4242
Step 6: 跑 SQL 检 10 个 invariant（v3 plan §5）
Step 7: 跑 stripe trigger invoice.payment_failed → 检 subscription.status='past_due'
Step 8: 注册第二个用户 → 检 grant credit 不撞 partial unique
```

10 个 invariant 任一不通过 → 阻塞 commit。

### T16：清理（claude）

```
Step 1: rm tmp/check.mjs tmp/race-evidence.mjs tmp/credit-orderno-check.mjs
Step 2: rmdir tmp 如果空
Step 3: git status 确认无遗留
```

## Integration & Final Review

T14 通过后：

1. 全 worktree 跑 `pnpm lint && pnpm tsc --noEmit && pnpm test`
2. 一次性 codex code review（用 codex skill），review 整个 worktree diff
3. Review 通过 → squash 或保留分原子 commit 合到主线（让用户决定）

## Execution Mode 选择

按 writing-plans skill 末尾要求，提供两种执行模式：

**1. Subagent-Driven（本 session）** — 我用 multi-Agent 并行 dispatch，每个 wave 内 codex agent 同时跑，每 wave 末做集成检查

**2. Parallel Session（独立）** — 你新开一个 session 用 superpowers:executing-plans，按 wave 顺序跑

我推荐 **模式 1**，因为：

- v3 plan 和 errata 已经在我 context 里，无需重新加载
- 多 agent 并行需要主线协调（wave 切换、依赖检查、集成 review），**主线必须是同一个 session**
- 你 quota 够用：codex 独立计费，不消耗 Claude 额度的部分占总工作量 ~70%
