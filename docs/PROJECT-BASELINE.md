# 项目基线（Single Source of Truth）

> 更新时间：2026-02-25
> 适用范围：`/Users/sky/Desktop/sciwangzhan/neonphysics-v2`

## 1. 主线与边界

- 主线代码库：`neonphysics-v2`
- 历史副本：已归档到 `/Users/sky/Desktop/sciwangzhan/archive/neonphysics-v2-copy-2026-02-25`
- 归档记录：见 [ARCHIVE-LOG.md](./ARCHIVE-LOG.md)

## 2. 文档优先级

1. 本文档（当前工程真相）
2. [WORKSPACE-STATUS.md](./WORKSPACE-STATUS.md)（执行状态）
3. 根目录 PRD/DevPlan（战略与设计输入）

当 PRD/计划与代码不一致时，以代码和本文档为准。

## 3. 当前技术基线

- 框架：Next.js 16（App Router）
- 语言：TypeScript
- 数据层：Drizzle + PostgreSQL
- 认证：Better Auth
- 测试：Vitest + Playwright（已接入）
- 代码主体：基于 ShipAny Template Two，叠加 NeonPhysics 与 UPG 业务能力

## 4. 已落地能力（按文件核对）

### 4.1 v1→v2 合规/配额迁移（已落地部分）

- Schema 扩展：`experiment_progress`、`user_compliance_profile`、`daily_usage`、`consent_event`、`privacy_request`
- 服务/模型：
  - `src/core/compliance/service.ts`
  - `src/core/compliance/retention-service.ts`
  - `src/shared/models/consent_event.ts`
  - `src/shared/models/privacy_request.ts`
  - `src/shared/models/user_compliance_profile.ts`
  - `src/shared/models/daily_usage.ts`
  - `src/shared/lib/usage/quota.ts`
- 监控/SEO/Cron：
  - `src/extensions/monitoring/sentry.ts`
  - `src/extensions/analytics/plausible-consent.ts`
  - `src/app/sitemap.ts`
  - `src/app/api/cron/data-retention/route.ts`

### 4.2 UPG（万物原理生成器）

- 页面：
  - `src/app/[locale]/(landing)/(ai)/upg/page.tsx`
  - `src/app/[locale]/(landing)/(ai)/upg/view/[id]/page.tsx`
  - `src/app/[locale]/(landing)/(ai)/upg/my/page.tsx`
- API：
  - `src/app/api/upg/generate/route.ts`
  - `src/app/api/upg/[id]/route.ts`
  - `src/app/api/upg/[id]/report/route.ts`
  - `src/app/api/upg/my/route.ts`
- 领域逻辑：
  - `src/shared/lib/upg/*`
  - `src/shared/models/upg_generation.ts`
  - `src/shared/models/upg_daily_quota.ts`
  - `src/shared/models/upg_report.ts`

## 5. 与历史任务清单的差异（待补）

以下条目在 `tasks/todo.md` 中标记为目标，但当前主线未发现对应文件：

- `src/app/api/compliance/age-gate/route.ts`
- `src/app/api/compliance/consent/route.ts`
- `src/app/api/privacy/export/route.ts`
- `src/app/api/privacy/delete/route.ts`
- `src/app/api/privacy/status/[id]/route.ts`
- `src/shared/blocks/legal/CookieConsentBanner.tsx`
- `src/shared/lib/usage/progress-service.ts`
- `src/app/api/experiments/[id]/progress/route.ts`
- `src/shared/blocks/experiments/PaywallGate.tsx`
- `src/shared/hooks/useExperimentProgress.ts`

这意味着“任务文档中的阶段完成度”与“代码实际完成度”并非完全一致。

## 6. 已确认决策

- `neonphysics-v2` 是唯一开发入口。
- UPG 按当前代码走独立 `upg` 领域实现（页面/API/model/lib 已成体系）。
- 状态追踪统一查看 [WORKSPACE-STATUS.md](./WORKSPACE-STATUS.md)。
