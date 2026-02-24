# STATUS: v1 → v2 合并进度

## 当前状态: ✅ 全部完成

## 阶段进度

| 阶段 | 状态 | 说明 |
|------|------|------|
| Phase 0: 测试基础设施 | ✅ 完成 | vitest + testing-library + playwright |
| Phase 1: Schema 扩展 | ✅ 完成 | 4 张新表 + experimentProgress 扩展 |
| Phase 2: 合规系统 | ✅ 完成 | core/compliance service + model 层 |
| Phase 3: 配额系统 | ✅ 完成 | quota 核心逻辑 + daily_usage model |
| Phase 4: 监控与分析 | ✅ 完成 | Sentry + GDPR Plausible consent |
| Phase 5: SEO 增强 | ✅ 完成 | 动态 sitemap + JSON-LD + robots.ts |
| Phase 6: E2E 测试 | ✅ 完成 | Playwright config + smoke specs |
| Phase 7: Vercel Cron | ✅ 完成 | data-retention cron route |

## 测试: 52 unit tests passed + 8 e2e specs ready

## 完整文件清单

### Phase 0
- `vitest.config.ts`
- `tests/setup.ts`
- `tests/unit/sanity.test.ts`

### Phase 1
- `src/config/db/schema.ts` — 新增 userComplianceProfile, dailyUsage, consentEvent, privacyRequest + 扩展 experimentProgress

### Phase 2
- `src/core/compliance/service.ts`
- `src/core/compliance/retention-service.ts`
- `src/core/compliance/index.ts`
- `src/shared/models/consent_event.ts`
- `src/shared/models/privacy_request.ts`
- `src/shared/models/user_compliance_profile.ts`

### Phase 3
- `src/shared/lib/usage/quota.ts`
- `src/shared/models/daily_usage.ts`

### Phase 4
- `src/extensions/monitoring/sentry.ts`
- `src/extensions/analytics/plausible-consent.ts`

### Phase 5
- `src/app/sitemap.ts`
- `src/shared/lib/seo/json-ld.ts`
- `src/app/robots.ts` (modified)

### Phase 6
- `playwright.config.ts`
- `tests/e2e/smoke.spec.ts`

### Phase 7
- `src/app/api/cron/data-retention/route.ts`
- `src/shared/models/retention-repository.ts`
- `vercel.json` (modified)

### Tests
- `tests/unit/compliance-service.test.ts` — 12 tests
- `tests/unit/retention-service.test.ts` — 3 tests
- `tests/unit/quota.test.ts` — 13 tests
- `tests/unit/sentry.test.ts` — 6 tests
- `tests/unit/plausible-consent.test.ts` — 11 tests
- `tests/unit/json-ld.test.ts` — 6 tests
- `tests/unit/sanity.test.ts` — 1 test
