# CODEX_TASK: 将 NeonPhysics v1 优势合并到 v2

## 目标
以 v2 为主体，将 v1 的合规系统、配额系统、测试体系、SEO、监控移植到 v2，遵循 v2 架构约定。

## 源代码位置
- v1: `/Users/sky/Desktop/manju 211/neonphysics/`
- v2: `/Users/sky/Desktop/sciwangzhan/neonphysics-v2/`

## 详细方案
见 `tasks/todo.md`（CTO 评审修订版）

## 阶段划分

### Phase 0: 测试基础设施
- [ ] 安装 vitest + testing-library + jsdom + playwright
- [ ] 创建 vitest.config.ts
- [ ] 创建 tests/setup.ts
- [ ] 添加 test scripts 到 package.json

### Phase 1: 数据库 Schema 扩展
- [ ] 新增 user_compliance_profile 表（不动 Better Auth 的 user 表）
- [ ] 新增 daily_usage 表
- [ ] 新增 consent_event 表
- [ ] 新增 privacy_request 表
- [ ] 扩展 experiment_progress 表（补 sessionsCount, lastParameters, firstUsedAt）
- [ ] 验证 db:generate 不影响 Better Auth

### Phase 2: 合规系统
- [ ] src/core/compliance/service.ts — 合规服务
- [ ] src/core/compliance/retention-service.ts — 数据保留
- [ ] src/shared/models/consent_event.ts — 数据访问
- [ ] src/shared/models/privacy_request.ts — 数据访问
- [ ] src/shared/models/user_compliance_profile.ts — 数据访问
- [ ] API: /api/compliance/age-gate
- [ ] API: /api/compliance/consent
- [ ] API: /api/privacy/export
- [ ] API: /api/privacy/delete
- [ ] API: /api/privacy/status/[id]
- [ ] API: /api/cron/data-retention
- [ ] src/shared/blocks/legal/CookieConsentBanner.tsx
- [ ] content/pages/children-privacy.mdx
- [ ] content/pages/cookie-policy.mdx
- [ ] tests/unit/compliance-service.test.ts
- [ ] tests/unit/retention-service.test.ts

### Phase 3: 配额系统
- [ ] src/shared/lib/usage/quota.ts — 配额逻辑
- [ ] src/shared/lib/usage/progress-service.ts — 进度服务
- [ ] src/shared/models/daily_usage.ts — 数据访问
- [ ] API: /api/experiments/[id]/progress
- [ ] src/shared/blocks/experiments/PaywallGate.tsx
- [ ] src/shared/hooks/useExperimentProgress.ts
- [ ] tests/unit/quota.test.ts
- [ ] tests/unit/experiment-registry.test.ts

### Phase 4: 监控与分析
- [ ] src/extensions/monitoring/sentry.ts
- [ ] src/extensions/analytics/bridge.tsx
- [ ] 集成到 root layout

### Phase 5: SEO 增强
- [ ] src/app/sitemap.ts
- [ ] 移植博客文章到 content/posts/
- [ ] 验证实验页面 SEO metadata

### Phase 6: E2E 测试
- [ ] playwright.config.ts
- [ ] tests/e2e/smoke.spec.ts

### Phase 7: Vercel Cron
- [ ] 更新 vercel.json 添加 data-retention cron

## 架构约定
- 主键: text('id') + getUuid()
- JSON: text 类型 + JSON.parse/stringify
- 合规核心: src/core/compliance/
- 监控: src/extensions/monitoring/
- 数据访问: src/shared/models/
- UI 区块: src/shared/blocks/
- 类型: 统一用 v2 的 Tier，不引入 SubscriptionTier
- Auth: getSignUser()，不引入 Clerk
- DB: src/core/db 实例
