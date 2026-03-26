# TASK: NeonPhysics v2 实验页面 UX 重设计

- **任务ID**: TASK-1774252922
- **开始时间**: 2026-03-23T08:02:02Z
- **最大迭代**: 30 次（3 Epic × ~10 任务）
- **质量模式**: standard
- **设计文档**: `docs/plans/2026-03-23-experiment-ux-redesign.md`
- **分支**: feat/edu-academic-theme

## Criteria

1. URL 结构从 `/experiments/[slug]` 改为 `/labs/[subject]/[primaryStandard]/[slug]`
2. 新增 3 级索引页（/labs、/labs/[subject]、/labs/[subject]/[standard]）
3. 实验页面 5 阶段门控流程（Hook → Explore → Learn → Challenge → Summary）
4. ChallengeCard + LearningCard + ExperimentHook 组件可用
5. ExperimentFlow.tsx 管理阶段状态，ExperimentClient 只负责 Explore
6. iframe postMessage 通信 + 60 秒超时降级
7. Google Classroom 分享按钮
8. AP Physics 1 实验的 hook/learningCards/challenges 数据补全
9. 所有实验 primaryStandard 字段补全
10. `pnpm build` 通过
11. `pnpm test` 通过（新增测试覆盖 14 条路径）

## Design Decisions

设计决策已在 CTO 工程评审 + 设计评审中确认，详见设计文档第十一/十二节。核心决策：

- **3 Epic 拆分**：SEO / 交互 / 内容独立交付
- **primaryStandard**（非 standard）：避免命名冲突
- **ExperimentFlow 包裹层**：职责分离
- **iframe postMessage + 60s 超时**：完整方案 + 兜底
- **内容进 i18n JSON**：天然多语言
- **Hero 实验动态预览**：避免 AI slop
- **答错用 --np-gold**：教育不惩罚
- **手机端卡片默认展开**：减少点击
- **3D 失败降级截图 + 参数表**：兼容差设备
- **Hook SSR + prefetch 3D**：LCP < 1s

## Atomic Plan

### Epic A: SEO 架构

- [x] A1: 新增 primaryStandard 字段到 Experiment interface
  Files: `src/shared/types/experiment.ts`
  Test: `pnpm tsc --noEmit`
  Expected: 类型检查通过

- [x] A2: 为所有 registry 实验数据补全 primaryStandard 值
  Files: `src/shared/lib/experiments/data/*.ts`
  Test: `pnpm tsc --noEmit`
  Expected: 所有实验有 primaryStandard

- [x] A3: 新增 registry 查询函数 getExperimentsByStandard()
  Files: `src/shared/lib/experiments/registry.ts`
  Test: 写 unit test
  Expected: 按 primaryStandard 筛选正确

- [x] A4: 创建 /labs 总索引页路由
  Files: `src/app/[locale]/(landing)/labs/page.tsx`
  Test: `pnpm build`
  Expected: /labs 页面渲染 5 学科分区

- [x] A5: 创建 /labs/[subject] 学科索引页路由
  Files: `src/app/[locale]/(landing)/labs/[subject]/page.tsx`
  Test: `pnpm build`
  Expected: /labs/physics 按课标分组展示

- [x] A6: 创建 /labs/[subject]/[standard] 课标索引页路由
  Files: `src/app/[locale]/(landing)/labs/[subject]/[standard]/page.tsx`
  Test: `pnpm build`
  Expected: /labs/physics/ap-physics-1 展示实验卡片

- [x] A7: 创建 /labs/.../[slug] 实验详情页路由
  Files: `src/app/[locale]/(landing)/labs/[subject]/[standard]/[slug]/page.tsx`
  Test: `pnpm build`
  Expected: 实验详情页渲染

- [x] A8: BreadcrumbNav 组件
  Files: `src/shared/components/ui/breadcrumb-nav.tsx`
  Test: 写 unit test
  Expected: 正确渲染层级导航

- [x] A9: 更新 sitemap.ts 使用新 URL
  Files: `src/app/sitemap.ts`
  Test: `pnpm build`
  Expected: sitemap 生成 /labs/... URL

- [x] A10: 更新导航 + i18n 链接
  Files: `src/config/locale/messages/{en,zh}/landing.json`
  Test: `pnpm build`
  Expected: 导航指向 /labs

- [x] A11: SEO metadata + JSON-LD（已在 A4-A7 中实现）
  Files: 各 labs 路由 generateMetadata
  Test: `pnpm build`
  Expected: title/description/JSON-LD 正确

### Epic B: 交互体验

- [x] B1: ExperimentFlow.tsx 阶段状态机
  Files: `src/shared/blocks/experiments/experiment-flow.tsx`
  Test: unit test（5 阶段流 + Skip）
  Expected: 阶段切换正确

- [x] B2: StageProgress 组件
  Files: `src/shared/blocks/experiments/stage-progress.tsx`
  Test: unit test
  Expected: 5 阶段视觉状态正确

- [x] B3: ExperimentHook 组件
  Files: `src/shared/blocks/experiments/experiment-hook.tsx`
  Test: unit test
  Expected: Hook 问题 + CTA 按钮

- [x] B4: LearningCard 组件
  Files: `src/shared/blocks/experiments/learning-card.tsx`
  Test: unit test（折叠/展开 + 全部展开检测）
  Expected: 基于 Accordion，公式用 FormulaDisplay

- [x] B5: ChallengeCard 组件
  Files: `src/shared/blocks/experiments/challenge-card.tsx`
  Test: unit test（答对/答错反馈）
  Expected: 答对绿色，答错 np-gold

- [x] B6: ExperimentSummary 组件
  Files: `src/shared/blocks/experiments/experiment-summary.tsx`
  Test: unit test
  Expected: 总结 + 分享 + 推荐

- [x] B7: ShareExperiment + Classroom
  Files: `src/shared/blocks/experiments/share-experiment.tsx`
  Test: unit test（URL 生成）
  Expected: 4 个分享渠道

- [x] B8: GuidedTooltip 组件
  Files: `src/shared/components/ui/guided-tooltip.tsx`
  Test: unit test
  Expected: 延迟显示 + 交互隐藏

- [x] B9: EasterEgg 系统
  Files: `src/shared/blocks/experiments/easter-egg-toast.tsx`
  Test: unit test（触发条件）
  Expected: 极端值触发 toast

- [x] B10: useIframeInteraction hook
  Files: `src/shared/hooks/useIframeInteraction.ts`
  Test: unit test（postMessage + 超时）
  Expected: 操作检测 + 60s 超时

- [x] B11: ExperimentFlow 集成到路由
  Files: labs/[subject]/[standard]/[slug]/page.tsx
  Test: `pnpm build`
  Expected: 5 阶段流程在实验页可用

- [x] B12: 响应式 + 无障碍
  Files: 所有新组件
  Test: 手动 + Lighthouse
  Expected: 三端布局 + a11y

### Epic C: 内容精修

- [x] C1: experiments i18n JSON 结构
  Files: `src/config/locale/messages/en/experiments.json`
  Test: `pnpm tsc --noEmit`
  Expected: 键值结构正确

- [x] C2: Experiment interface 扩展（hook/learningCards/easterEggs 可选）
  Files: `src/shared/types/experiment.ts`
  Test: `pnpm tsc --noEmit`
  Expected: 向后兼容

- [x] C3: AP Physics 1 hook 数据
  Files: experiments.json
  Test: 手动检查
  Expected: ~15 个实验有 hook

- [x] C4: AP Physics 1 learningCards 数据
  Files: experiments.json
  Test: 手动检查
  Expected: 每实验 3-5 张卡片

- [x] C5: AP Physics 1 challenges 数据
  Files: experiments.json
  Test: 手动检查
  Expected: 每实验 3-5 道题

- [x] C6: AP Physics 1 easterEggs 数据
  Files: 实验数据文件
  Test: 手动检查
  Expected: 每实验至少 1 彩蛋

### 最终验证

- [x] V1: pnpm build 通过
- [x] V2: pnpm test 通过
- [x] V3: 手动验证路由结构
