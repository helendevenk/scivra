# 任务执行状态

> 此文件是进度追踪的**唯一权威来源**

## 基本信息
- 任务: 首页 + 导航栏重新设计
- 状态: **COMPLETED**
- 迭代次数: 2/10
- 开始时间: 2026-03-23T20:30:00Z

## 进度

### Phase 0: 已完成 ✅
- [x] T0.1: 设计诊断 → `homepage-redesign-solution.md`
- [x] T0.2: 中英文案 → `homepage-copy-en-zh.json`

### Phase 1: landing.json 更新 ✅
- [x] T1.1: en/landing.json — hero/usage/stats/faq/cta 话术更新 + 新增 experiment_showcase/grade_levels
- [x] T1.2: zh/landing.json — 同步中文版
- [x] T1.3: page.tsx showSections — hero/experiment_showcase/grade_levels/usage/stats/faq/cta
- [x] T1.4: header.nav — 精简为 3 项（学科▾/AI实验室/价格）
- [x] T1.5: footer — Blog/Updates 保留在 footer

### Phase 2: 新建区块组件 ✅
- [x] T2.1: experiment-showcase.tsx — 3 卡片跨学科精选
- [x] T2.2: grade-levels.tsx — 5 年级段 + trust_badges
- [x] T2.3: blocks/index.tsx 导出 + dynamic-page.tsx 注册

### Phase 3: Hero 改造 ✅
- [x] T3.1: hero.tsx 学科按钮网格（section.subjects）
- [x] T3.2: 单一 CTA

### Phase 4: 交互动效 ✅
- [x] T4.1: 学科按钮 hover:-translate-y-0.5 + hover:shadow-md
- [x] T4.2: Showcase 卡片 hover scale(1.03) + shadow-lg
- [x] T4.3: Grade Levels 卡片 hover:border-primary
- [x] T4.4: prefers-reduced-motion 适配（motion-reduce:transition-none）

### Phase 5: 验收 ✅
- [x] T5.1: 中文截图 — Hero/Showcase/GradeLevels/Usage/FAQ/CTA
- [x] T5.2: pnpm build 通过（exit code 0）
- [x] T5.3: 无 ShipAny 模板残留
- [x] T5.4: 英文截图对比 — 中英文内容完整对应

## 改动文件清单
| 文件 | 改动类型 |
|------|---------|
| `src/config/locale/messages/en/landing.json` | 修改（话术+新区块数据+导航精简） |
| `src/config/locale/messages/zh/landing.json` | 修改（同步） |
| `src/app/[locale]/(landing)/page.tsx` | 修改（showSections 数组） |
| `src/themes/default/blocks/hero.tsx` | 修改（学科按钮+motion-reduce） |
| `src/themes/default/blocks/experiment-showcase.tsx` | **新建** |
| `src/themes/default/blocks/grade-levels.tsx` | **新建** |
| `src/themes/default/blocks/index.tsx` | 修改（导出新组件） |
| `src/themes/default/pages/dynamic-page.tsx` | 修改（注册新 block） |

## 截图证据
- ZH: redesign-zh-hero/showcase/grades/faq-cta.png
- EN: redesign-en-hero/showcase/grades-usage.png
