# Handoff: NeonPhysics UX Redesign — Epic A Done, Start Epic B

## Session Metadata
- Created: 2026-03-23 16:07:34
- Updated: 2026-03-23 16:30:00
- Project: /Users/sky/Desktop/sciwangzhan/neonphysics-v2
- Branch: feat/edu-academic-theme
- Session duration: ~4 hours

### Recent Commits (for context)
  - 87ca3de docs: update experiment counts to 111 across all active documents
  - d53c821 fix(e2e): fix 6 failing E2E tests — match actual UI selectors
  - 0a4106e docs: update all project docs with 2026-03-23 sprint progress

## Handoff Chain

- **Continues from**: [2026-03-22-223323-phase-bg-全部完成---73个ap-physics-html---开始phase-35.md](./2026-03-22-223323-phase-bg-全部完成---73个ap-physics-html---开始phase-35.md)
- **Supersedes**: None

## Current State Summary

**Epic A（SEO 架构）全部完成（11/11 任务）。** 下一步是 Epic B（交互体验，12 任务）。

完成的全链路：商业诊断 → 对标分析 → 设计文档 → CTO 评审 → 设计评审 → RalphFree 初始化 → Epic A 实施。Build 通过，测试 584 全通过。

## Codebase Understanding

### Architecture Overview

实验系统核心：64 个 TS 数据文件（registry）+ 111 个 HTML 文件（iframe 实验）+ 4 个 R3F 3D 场景。ExperimentClient.tsx 是当前实验渲染的唯一入口，同时处理 R3F 和 iframe 渲染。计划拆分为 ExperimentFlow（阶段管理）+ ExperimentClient（仅 Explore 阶段）。

### Critical Files

| File | Purpose | Relevance |
|------|---------|-----------|
| `src/shared/types/experiment.ts` | 实验类型定义 | A1 已修改，新增 primaryStandard/Hook/LearningCard/EasterEgg |
| `src/shared/lib/experiments/registry.ts` | 实验注册表 | A3 需新增 getExperimentsByStandard() |
| `src/shared/lib/experiments/data/*.ts` | 64 个实验数据 | A2 需批量加 primaryStandard |
| `src/app/[locale]/(landing)/experiments/[slug]/ExperimentClient.tsx` | 实验渲染 | Epic B 拆分为 ExperimentFlow + ExperimentClient |
| `src/shared/lib/experiments/access.ts` | 访问控制 | 砍掉 max 层级 |
| `src/app/sitemap.ts` | SEO sitemap | A9 更新 URL |
| `docs/plans/2026-03-23-experiment-ux-redesign.md` | 设计文档 | 所有决策的权威来源 |

### Key Patterns Discovered

- 实验数据文件用 `satisfies Experiment` 类型约束，修改 interface 会立刻触发所有文件报错
- HTML iframe 实验没有外部参数控制，门控需要 postMessage 通信 + 60s 超时
- 现有 shadcn 组件（Accordion/RadioGroup/Progress/Toast/Breadcrumb）可直接复用

## Work Completed

### Tasks Finished

- [x] 商业诊断（dbs-diagnosis 体检模式，7 项检验）
- [x] 对标分析（dbs-benchmark，3 个对标确认）
- [x] Mathigon 7 模式深度拆解
- [x] 设计文档编写（800+ 行，10 个章节）
- [x] CTO 工程评审（10 个决策全部确认）
- [x] 设计评审（10 个设计决策，6/10 → 8/10）
- [x] RalphFree v4.0 初始化（4-File Pattern + 32 原子任务）
- [x] A1: primaryStandard + 6 个新类型（ExperimentHook/LearningCard/EasterEgg/ExperimentStage/PrimaryStandard, Challenge 扩展）
- [x] A2: 64 个实验数据文件批量补全 primaryStandard
- [x] A3: getExperimentsByStandard + getStandardsForSubject + getAllSubjectsWithCounts + 5 unit tests
- [x] A4: /labs 总索引页（5 学科卡片 + 实验数量）
- [x] A5: /labs/[subject] 学科索引页（按 primaryStandard 分组）
- [x] A6: /labs/[subject]/[standard] 课标索引页（实验卡片 + Free/Pro 标签）
- [x] A7: /labs/.../[slug] 详情页（JSON-LD LearningResource + 面包屑）
- [x] A8: BreadcrumbNav 组件（aria-label + responsive 省略）
- [x] A9: sitemap.ts 更新为 /labs/* URL
- [x] A10: 导航链接 /experiments → /labs
- [x] A11: SEO metadata + JSON-LD（含在 A4-A7）

### Files Modified

| File | Changes | Rationale |
|------|---------|-----------|
| `src/shared/types/experiment.ts` | +6 类型，扩展 Challenge + Experiment interface | 基础类型 |
| `src/shared/lib/experiments/data/*.ts` (64 files) | 每个加 primaryStandard 值 | URL 路由分类 |
| `src/shared/lib/experiments/registry.ts` | +3 查询函数 | /labs 页面数据 |
| `src/app/[locale]/(landing)/labs/page.tsx` | 新建 | /labs 总索引 |
| `src/app/[locale]/(landing)/labs/[subject]/page.tsx` | 新建 | 学科索引 |
| `src/app/[locale]/(landing)/labs/[subject]/[standard]/page.tsx` | 新建 | 课标索引 |
| `src/app/[locale]/(landing)/labs/[subject]/[standard]/[slug]/page.tsx` | 新建 | 实验详情 |
| `src/shared/components/ui/breadcrumb-nav.tsx` | 新建 | 面包屑导航 |
| `src/app/sitemap.ts` | 更新 URL 结构 | SEO |
| `src/config/locale/messages/{en,zh}/landing.json` | 导航链接改为 /labs | 一致性 |
| `tests/unit/registry-standard.test.ts` | 新建 5 tests | registry 查询验证 |
| `docs/plans/2026-03-23-experiment-ux-redesign.md` | 800+ 行 + 评审决策 | 权威设计文档 |
| `.ralphfree/TASK.md` | 32 任务原子计划 | RalphFree |
| `.ralphfree/STATUS.md` | Epic A 完成记录 | 进度追踪 |

### Decisions Made

| Decision | Options Considered | Rationale |
|----------|-------------------|-----------|
| 拆 3 Epic | 一次性 vs 3 Epic | 独立交付验证 |
| standard → primaryStandard | standard / urlCategory / primaryStandard | 避免与 standards 数组冲突 |
| iframe postMessage + 60s 超时 | 时间门控 / postMessage / 跳过 | 完整方案 + 兜底 |
| 砍 301 重定向 | 有 301 / 无 301 | 产品未上线无权重 |
| ExperimentFlow 包裹层 | 内联状态机 / 拆出 Flow | 职责分离 |
| 答案前端明文 | 前端 / 服务端 / hash | 学习工具非考试 |
| 内容进 i18n JSON | TS 硬编码 / i18n JSON | 天然多语言 |
| Hero 实验预览 | 标准 hero / 实验预览 | 避免 AI slop |
| 手机端卡片默认展开 | 折叠 / 展开 | 小屏减少点击 |
| 3D 失败降级截图 | 报错 / 降级 | 兼容差设备 |

## Pending Work

### Immediate Next Steps

1. **B1: ExperimentFlow.tsx 阶段状态机** — 5 阶段门控（Hook→Explore→Learn→Challenge→Summary）+ Skip + unit test
2. **B2: StageProgress 组件** — 基于 shadcn Progress，完成/当前/未解锁三态
3. **B3: ExperimentHook 组件** — Hook 问题 + CTA 按钮，SSR 兼容
4. **B4-B5: LearningCard + ChallengeCard** — 基于 shadcn Accordion/RadioGroup
5. 后续 B6-B12 详见 `.ralphfree/TASK.md`

### Blockers/Open Questions

- 无 blocker
- B11 需要把 ExperimentFlow 集成到 /labs/.../[slug] 详情页（当前详情页链接到旧 /experiments/[slug]）
- STANDARD_LABELS 映射在 A5/A6/A7 中重复，Epic B 可提取到共享文件

### Deferred Items

- Epic C（内容精修）: 等 Epic B 完成
- 暗色模式逐组件验证: 实现时做
- 西班牙语支持: 等 SEO 验证后
- /teachers 页面: P1 优先级，Epic B 后做

## Context for Resuming Agent

### Important Context

1. **读设计文档**：`docs/plans/2026-03-23-experiment-ux-redesign.md` 是所有决策的权威来源，包含 CTO 评审（第十一节）和设计评审（第十二节）
2. **读 RalphFree TASK.md**：`.ralphfree/TASK.md` 有完整 Atomic Plan，Epic B 从 `- [ ] B1` 开始
3. **读 RalphFree STATUS.md**：`.ralphfree/STATUS.md` 有完整执行日志
4. **Epic A 已全部完成**：/labs 路由 + sitemap + BreadcrumbNav + 类型 + 数据 + 测试
5. **质量模式 standard**：需要 TDD（写测试→写实现），不能跳过
6. **ExperimentFlow 是 Epic B 的核心**：新建 ExperimentFlow.tsx 管理 5 阶段状态，ExperimentClient 降为 Explore 阶段子组件
7. **token 映射已确认**：答对 → --np-green，答错 → --np-gold，当前阶段 → --primary，未解锁 → --muted
8. **组件复用**：LearningCard 基于 shadcn Accordion，ChallengeCard 基于 RadioGroup，StageProgress 基于 Progress，EasterEgg 基于 Toast
9. **iframe 门控**：postMessage 通信 + 60 秒超时自动解锁（防卡死）
10. **详情页当前状态**：/labs/.../[slug] 页面有 "Launch Experiment" 链接到旧 /experiments/[slug]，B11 需要直接集成 ExperimentFlow

### Assumptions Made

- shadcn 组件库已安装且可用（Accordion, RadioGroup, Progress, Toast, Breadcrumb）
- FormulaDisplay 组件可在 LearningCard 中直接复用
- 现有 useSimulation hook 可检测 R3F 实验的参数操作

### Potential Gotchas

- **STANDARD_LABELS 重复**：A5/A6/A7 页面各自定义了标准标签映射，Epic B 应提取到共享文件
- **iframe postMessage**：107 个 HTML 文件需要注入 postMessage 上报代码，工作量大
- **/experiments 路由仍存在**：导航已指向 /labs，但旧路由没删（向后兼容）
- **ExperimentClient 在 /experiments/[slug] 下**：B11 需要在 /labs/.../[slug] 下也能渲染实验，可能需要移动或共享 ExperimentClient

## Environment State

### Tools/Services Used

- pnpm (包管理)
- Next.js 16 dev server (`pnpm dev`)
- Vitest (`pnpm test`)
- TypeScript strict mode (`pnpm tsc --noEmit`)

### Active Processes

- 无活跃进程

### Environment Variables

- NEXT_PUBLIC_THEME (default theme)
- 其他见 .env.local（不暴露值）

## Related Resources

- 设计文档: `docs/plans/2026-03-23-experiment-ux-redesign.md`
- RalphFree 状态: `.ralphfree/STATUS.md`
- RalphFree 计划: `.ralphfree/TASK.md`
- 主题 CSS: `src/config/style/theme-education.css`
- 实验类型: `src/shared/types/experiment.ts`
- CTO 评审: 设计文档第十一节
- 设计评审: 设计文档第十二节

## Lessons Learned

- [Architecture] Pattern: dbs-diagnosis 的商业诊断对产品方向影响巨大（砍 Max、聚焦 Curated Labs、All in SEO），应该在写代码前做
- [Architecture] Pattern: 对标分析（Save My Exams URL 结构）直接影响了技术架构（/labs 层级路由）
- [Communication] Pattern: 用户对定价有自己的想法（$100/月），需要用数据（竞品价格 + 用户支付能力）来校准而不是直接否定
- [Tooling] Rule: RalphFree 的 4-File Pattern 在大型任务（32 任务）中提供了清晰的进度可见性
