# Task: 将 v1 优势合并到 v2（CTO 评审修订版）

## 背景

- **v2 基座**: ShipAny Template Two (Next.js 16 + Better Auth + Drizzle + 多支付 + i18n + RBAC + Admin)
- **v1 优势**: 合规闭环、配额系统、测试体系、SEO 内容、监控、数据保留
- **原则**: v2 是主体，v1 的业务逻辑移植过来，必须"看起来像 v2 原生写的"

## 架构约定（CTO 评审确认）

| 层 | 职责 | 示例 |
|----|------|------|
| `src/core/` | 平台基础设施 | auth, db, rbac, i18n, **compliance** |
| `src/shared/lib/` | 业务逻辑 | experiments, physics, usage |
| `src/shared/models/` | 数据访问层 | user.ts, subscription.ts, **consent_event.ts** |
| `src/shared/hooks/` | React hooks | useSimulation.ts, **useExperimentProgress.ts** |
| `src/shared/blocks/` | UI 区块组件 | form/, panel/, **legal/** |
| `src/extensions/` | 可插拔第三方集成 | analytics/, payment/, **monitoring/** |
| `src/themes/` | 主题/Landing 页面 | default/blocks/ |

## 技术一致性规则

- 主键: `text('id')` + 应用层 `getUuid()`，不用 `uuid` 类型
- JSON 字段: `text` 类型 + 应用层 `JSON.parse/stringify`，不用 `jsonb`
- 时间戳: 不带 `withTimezone`
- 类型: 统一用 v2 的 `Tier`（`shared/types/experiment.ts`），删除 v1 的 `SubscriptionTier`
- Auth: 用 `getSignUser()` 获取当前用户，不引入 Clerk
- DB: 用 `src/core/db` 实例，不自建连接

---

## Phase 0: 测试基础设施 (前置)

**0.1 安装依赖**
```bash
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test
```

**0.2 创建配置**
- `vitest.config.ts` — 配置 jsdom 环境、路径别名、coverage
- `tests/setup.ts` — 全局 setup（jest-dom matchers）
- `playwright.config.ts` — E2E 基线配置

**0.3 添加 scripts**
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

---

## Phase 1: 数据库 Schema 扩展 (P0)

v2 的 `src/config/db/schema.ts` 需要新增以下表：

**1.1 新增 `user_compliance_profile` 表** ⚠️ CTO 关键修改：不动 Better Auth 的 user 表
- `userId` (text, PK, FK → user.id)
- `ageGroup` (text, 'u13' | '13_17' | '18_plus' | 'unknown')
- `countryCode` (text, nullable)
- `privacyPolicyVersion` (text, nullable)
- `termsVersion` (text, nullable)
- `termsAcceptedAt` (timestamp, nullable)
- `marketingConsentAt` (timestamp, nullable)
- `parentalConsentAt` (timestamp, nullable)
- `createdAt`, `updatedAt`
- ~~subscriptionTier~~ 删除 — 从 v2 的 `subscription` 表实时查询

**1.2 新增 `daily_usage` 表** — 配额计量
- `id` (text, PK, getUuid())
- `keyType` (text, 'user' | 'session')
- `keyValue` (text)
- `experimentId` (text) — 注意：用 slug 关联，不是数据库 ID（v2 实验数据是静态注册表）
- `usageDate` (text, 'YYYY-MM-DD')
- `usedSeconds` (integer, default 0)
- `createdAt`, `updatedAt`
- 复合唯一约束: (keyType, keyValue, experimentId, usageDate)

**1.3 新增 `consent_event` 表** — 合规审计
- `id` (text, PK, getUuid())
- `userId` (text, nullable, FK → user.id)
- `sessionId` (text, nullable)
- `eventType` (text, 'privacy_accept' | 'terms_accept' | 'cookie_accept' | 'cookie_reject' | 'age_gate')
- `policyVersion` (text, nullable)
- `regionCode` (text, nullable)
- `ipHash` (text, nullable)
- `userAgentHash` (text, nullable)
- `metadata` (text, nullable) — JSON string，不用 jsonb
- `createdAt`

**1.4 新增 `privacy_request` 表** — DSAR 工单
- `id` (text, PK, getUuid())
- `userId` (text, FK → user.id)
- `requestType` (text, 'export' | 'delete')
- `status` (text, 'pending' | 'processing' | 'completed' | 'rejected')
- `metadata` (text, nullable) — JSON string
- `requestedAt` (timestamp, default now)
- `completedAt` (timestamp, nullable)
- `updatedAt`

**1.5 扩展 `experiment_progress` 表** — 保留 v2 结构，按需补字段
- v2 已有: completedChallenges, totalTimeSpent, lastAccessedAt
- 按需新增: `sessionsCount` (integer, default 0), `lastParameters` (text, nullable), `firstUsedAt` (timestamp, nullable)
- 不删除 v2 已有字段

**1.6 验证步骤**
- 跑 `db:generate` + `db:push`，确认 Better Auth 不受影响
- 检查 `user` 表零改动

---

## Phase 2: 合规系统 (P0，可与 Phase 3 并行)

**2.1 合规核心服务** → `src/core/compliance/`
- `src/core/compliance/service.ts` ← 从 v1 移植 `createComplianceService`
  - 适配: `ComplianceRepository` 接口指向 v2 的 model 层
  - 适配: `user_compliance_profile` 替代直接改 user 表
- `src/core/compliance/retention-service.ts` ← 从 v1 移植 `processDataRetention`
  - 适配: 去掉对 v1 `paymentEvents` 表的依赖
  - 只清理 `anonymous_usage` 和 `consent_event`
- `src/core/compliance/index.ts` — 统一导出

**2.2 数据访问层** → `src/shared/models/`
- `src/shared/models/consent_event.ts` — CRUD for consent_event 表
- `src/shared/models/privacy_request.ts` — CRUD for privacy_request 表
- `src/shared/models/user_compliance_profile.ts` — CRUD for user_compliance_profile 表

**2.3 合规 API 路由** → `src/app/api/`
- `src/app/api/compliance/age-gate/route.ts` ← 从 v1 移植，auth 改用 `getSignUser()`
- `src/app/api/compliance/consent/route.ts` ← 从 v1 移植
- `src/app/api/privacy/export/route.ts` ← 从 v1 移植
- `src/app/api/privacy/delete/route.ts` ← 从 v1 移植
- `src/app/api/privacy/status/[id]/route.ts` ← 从 v1 移植
- `src/app/api/cron/data-retention/route.ts` ← 从 v1 移植
- 所有路由加 rate limiting

**2.4 Cookie Consent Banner** → `src/shared/blocks/legal/`
- `src/shared/blocks/legal/CookieConsentBanner.tsx` ← 从 v1 移植
  - 用 shadcn Button 替代原生 button
  - 保留 EEA/UK 地区检测逻辑
  - 调用 `/api/compliance/consent` 记录决策

**2.5 法务页面**
- 新增: `content/pages/children-privacy.mdx`
- 新增: `content/pages/cookie-policy.mdx`
- v2 已有: privacy-policy.mdx, terms-of-service.mdx（检查内容是否需要补充）

**2.6 合规测试**（伴随开发）
- `tests/unit/compliance-service.test.ts`
- `tests/unit/retention-service.test.ts`
- `tests/unit/cookie-consent-banner.test.tsx`
- `tests/integration/privacy-routes.test.ts`
- `tests/integration/data-retention-route.test.ts`

---

## Phase 3: 配额系统 (P0，可与 Phase 2 并行)

**3.1 配额核心逻辑** → `src/shared/lib/usage/`
- `src/shared/lib/usage/quota.ts` ← 从 v1 移植
  - `FREE_DAILY_LIMIT_SECONDS = 300`
  - `normalizeTrackedSeconds()`
  - `buildQuotaSnapshot()` — 类型改用 v2 的 `Tier` 替代 `SubscriptionTier`
- `src/shared/lib/usage/progress-service.ts` ← 从 v1 移植，适配 v2 model 层
- ~~src/shared/lib/usage/repository.ts~~ → 改为 `src/shared/models/daily_usage.ts`（遵循 v2 约定）

**3.2 不移植** ⚠️ CTO 确认
- ~~v1 的 `subscription/access.ts`~~ — v2 已有 `shared/lib/experiments/access.ts`（canAccessTier, subscriptionToTier）

**3.3 配额 API**
- `src/app/api/experiments/[id]/progress/route.ts` ← 从 v1 移植
  - auth: `getSignUser()` 替代 `auth()`
  - db: 用 `shared/models/daily_usage.ts`
  - experimentId 用 slug 关联

**3.4 PaywallGate 组件** → `src/shared/blocks/experiments/`
- `src/shared/blocks/experiments/PaywallGate.tsx` ← 从 v1 移植
  - 用 shadcn Card, Button, Badge 重写 UI
  - 显示剩余时间、升级提示

**3.5 useExperimentProgress Hook**
- `src/shared/hooks/useExperimentProgress.ts` ← 从 v1 移植

**3.6 配额测试**（伴随开发）
- `tests/unit/quota.test.ts`
- `tests/unit/mechanics.test.ts`（物理引擎，顺便移植）
- `tests/unit/experiment-registry.test.ts`

---

## Phase 4: 监控与分析 (P1)

**4.1 Plausible Analytics**
- v2 已有 `src/extensions/analytics/plausible.tsx` — 检查是否支持自定义事件
- 如需补充，在 extensions 层扩展，不新建文件

**4.2 Sentry 监控** → `src/extensions/monitoring/` ⚠️ CTO 修正位置
- `src/extensions/monitoring/sentry.ts` ← 从 v1 移植
- 在 v2 root layout 集成

**4.3 Analytics Bridge** → `src/extensions/analytics/`
- `src/extensions/analytics/bridge.tsx` ← 从 v1 移植
- 适配 v2 的 Cookie Consent 逻辑

---

## Phase 5: SEO 增强 (P1)

**5.1 Sitemap**
- 新增 `src/app/sitemap.ts`（v2 只有 robots.ts，缺 sitemap）
- 包含所有实验页面 URL + 博客页面 URL + 法务页面 URL

**5.2 博客内容**
- 从 v1 移植 2 篇 MDX 到 v2 的 `content/posts/`
  - `newtons-laws-with-vectors.mdx`
  - `projectile-motion-common-mistakes.mdx`
- 适配 v2 的 Fumadocs frontmatter 格式

**5.3 不移植** ⚠️ CTO 确认
- ~~v1 的 SEO 工具函数~~ — v2 的 `shared/lib/seo.ts` 已更完善（含 OpenGraph、Twitter Card、i18n）

---

## Phase 6: E2E 测试 (P1)

- `tests/e2e/smoke.spec.ts` ← 从 v1 移植，适配 v2 路由（加 locale 前缀）

---

## Phase 7: Vercel Cron (P1)

- 更新 `vercel.json`，添加 data-retention cron: `0 2 * * *` → `/api/cron/data-retention`

---

## 执行顺序

```
Phase 0 (测试基础设施)
    ↓
Phase 1 (Schema 扩展 + 验证 Better Auth 不受影响)
    ↓
    ├── Phase 2 (合规系统 + 合规测试)  ←── 可并行
    └── Phase 3 (配额系统 + 配额测试)  ←── 可并行
    ↓
Phase 4 (监控)
Phase 5 (SEO)
Phase 6 (E2E)
Phase 7 (Cron)
```

## 职责边界文档

| 系统 | 用途 | 表 |
|------|------|-----|
| daily_usage | 实验时间配额（每日 300 秒免费，次日重置） | daily_usage |
| credit | AI 功能计费（总量消耗，用完为止） | credit |
| subscription | 订阅管理（Pro/Max 解锁无限时间） | subscription, order |

两套系统不冲突：credit 管 AI，daily_usage 管实验时间。

## 风险缓解

1. Phase 1 完成后立即跑 `db:generate` + `db:push`，确认 Better Auth 零影响
2. 每个 Phase 完成后跑全量测试
3. 合规 API 加 rate limiting
4. data-retention cron 先在 staging 跑一周再上生产
5. 每个 Phase 一个 migration 文件，可独立回滚

## 预估工作量

- Phase 0: ~1 小时
- Phase 1: ~1.5 小时
- Phase 2: ~4 小时
- Phase 3: ~2 小时
- Phase 4: ~1 小时
- Phase 5: ~1 小时
- Phase 6: ~0.5 小时
- Phase 7: ~0.5 小时

**总计: ~11.5 小时**
