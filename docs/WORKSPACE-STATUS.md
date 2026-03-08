# 工作区统一状态看板

> 更新时间：2026-02-28
> 本文件为当前唯一状态入口。

## 总览

| 轨道 | 状态 | 说明 |
|---|---|---|
| 代码库收敛 | ✅ 已完成 | 已归档 `neonphysics-v2 copy`，主线仅保留 `neonphysics-v2` |
| v1→v2 迁移 | ✅ 已完成 | Phase 2（合规）+ Phase 3（配额）全部落地，API/UI/法务页面齐全 |
| UPG 功能线 | 🟡 进行中 | UPG 页面/API/model 已存在，仍需联调与质量收尾 |
| UI/UX 审查（Gemini） | 🟡 进行中 | `.geminifree/STATUS.md` 当前为 `IN_PROGRESS` |

## 里程碑拆分

### M1：工作区治理
- [x] 明确主线仓库为 `neonphysics-v2`
- [x] 归档 `neonphysics-v2 copy`
- [x] 建立统一基线文档与状态看板

### M2：v1→v2 迁移闭环
- [x] 数据层扩展（schema + model）
- [x] 部分领域服务（compliance/usage）
- [x] 合规 API 路由（age-gate、consent）
- [x] 隐私请求 API（export、delete、status）
- [x] 配额 API 路由（experiments/[id]/progress GET+POST）
- [x] progress-service 服务层（配额追踪 + 实验进度同步）
- [x] CookieConsentBanner 组件（已集成到 root layout）
- [x] PaywallGate 付费墙组件
- [x] useExperimentProgress Hook
- [x] 法务页面（children-privacy.mdx、cookie-policy.mdx）
- [ ] Phase 4: 监控增强（Sentry 集成、Analytics Bridge）
- [ ] Phase 5: SEO 增强（sitemap.ts、博客内容迁移）
- [ ] Phase 6: E2E 测试
- [ ] Phase 7: Vercel Cron 配置

### M3：UPG 上线闭环
- [x] 页面骨架
- [x] API 骨架
- [x] 领域模型与生成逻辑目录
- [ ] 端到端联调（积分、限额、失败路径）
- [ ] UI/UX 一致性收尾

## 2026-02-28 完成的工作

**Phase 2 合规系统（6 个 API + 1 个组件 + 2 个页面）：**
- `src/app/api/compliance/age-gate/route.ts` — 年龄门槛，复用 ComplianceService
- `src/app/api/compliance/consent/route.ts` — 同意记录（cookie/privacy/terms）
- `src/app/api/privacy/export/route.ts` — GDPR 数据导出请求
- `src/app/api/privacy/delete/route.ts` — GDPR 数据删除请求
- `src/app/api/privacy/status/[id]/route.ts` — 隐私请求状态查询
- `src/shared/blocks/legal/CookieConsentBanner.tsx` — EEA/UK 地区自动显示
- `content/pages/children-privacy.mdx` — COPPA 儿童隐私政策
- `content/pages/cookie-policy.mdx` — Cookie 使用政策

**Phase 3 配额系统（1 个服务 + 1 个 API + 1 个 Hook + 1 个组件）：**
- `src/shared/lib/usage/progress-service.ts` — 配额追踪 + 实验进度同步
- `src/app/api/experiments/[id]/progress/route.ts` — GET 查配额 / POST 上报时长
- `src/shared/hooks/useExperimentProgress.ts` — 前端自动追踪（30s 间隔）
- `src/shared/blocks/experiments/PaywallGate.tsx` — 配额耗尽时显示升级提示

**集成：**
- CookieConsentBanner 已集成到 `src/app/layout.tsx`

**验证：** TypeScript 零错误，52 个测试全部通过。

## 已知 TODO

- progress API 中 `planName` 暂传 `null`，需接入 subscription 表查询用户实际订阅等级
- 集成测试（privacy-routes、data-retention-route、cookie-consent-banner）待补充

## 当前阻塞

- UPG 的 UI/UX 审查任务仍在进行中，尚未形成最终验收结论。

## 下一步（建议执行顺序）

1. 接入 subscription 查询，让配额系统识别 Pro/Max 用户
2. UPG 端到端联调（generate/view/my 主链路）
3. Phase 4-7（监控、SEO、E2E、Cron）
4. 收敛 UI/UX 审查结论并更新本看板为可发布状态
