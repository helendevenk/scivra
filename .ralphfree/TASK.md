# TASK: 首页 + 导航栏重新设计

- **任务ID**: HOMEPAGE-REDESIGN-2026-03-23
- **开始时间**: 2026-03-23T20:30:00Z
- **最大迭代**: 10 次
- **Quality Mode**: standard

## Goal
按 PRD 重新设计 SeePhysics 首页和导航栏，从功能导向转为成绩导向定位。

## Constraints
- Next.js 16 + Tailwind CSS v4 + shadcn/ui (new-york) + next-intl (en/zh)
- 主题：theme-education.css（学术蓝 oklch(0.50 0.20 250)）
- 图标只用 Lucide，中英文 landing.json 同步，不引入新依赖

## Design Decisions
1. 导航精简 4 项：Subjects▾ / AI Lab [AI] / Pricing / Sign In
2. Subjects 下拉：mega menu grid 布局
3. Hero 学科按钮：landing.json `hero.subjects` + hero.tsx 条件渲染
4. 新区块在 dynamic-page.tsx switch 注册
5. 区块顺序：hero → experiment_showcase → grade_levels → usage → stats → faq → cta

## Input Files
- PRD: `docs/plans/2026-03-23-homepage-navigation-redesign.md`
- 设计方案: `docs/plans/2026-03-23-homepage-redesign-solution.md`
- 文案 JSON: `docs/plans/2026-03-23-homepage-copy-en-zh.json`

## Atomic Plan

### Phase 0: 已完成
- [x] T0.1: 设计诊断 → `homepage-redesign-solution.md`
- [x] T0.2: 中英文案 → `homepage-copy-en-zh.json`

### Phase 1: landing.json 更新 + 页面结构
- [ ] T1.1: 更新 `en/landing.json`（hero/usage/stats/faq/cta + 新 experiment_showcase/grade_levels）
- [ ] T1.2: 更新 `zh/landing.json`（同步）
- [ ] T1.3: 更新 `page.tsx` showSections 数组
- [ ] T1.4: 更新导航栏 header.nav（en + zh）
- [ ] T1.5: 更新 footer（en + zh）

### Phase 2: 新建区块组件
- [ ] T2.1: 新建 `experiment-showcase.tsx`
- [ ] T2.2: 新建 `grade-levels.tsx`
- [ ] T2.3: `blocks/index.tsx` 导出 + `dynamic-page.tsx` 注册

### Phase 3: Hero 改造
- [ ] T3.1: hero.tsx 支持学科按钮网格
- [ ] T3.2: 移除第二个 CTA

### Phase 4: 交互动效
- [ ] T4.1: 各组件 hover/transition 效果
- [ ] T4.2: prefers-reduced-motion 适配

### Phase 5: 验收
- [ ] T5.1: 浏览器截图中英文对比
- [ ] T5.2: pnpm build 通过
- [ ] T5.3: 无模板残留确认
