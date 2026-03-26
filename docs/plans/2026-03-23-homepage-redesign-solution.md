---
name: homepage-redesign-solution
status: in-progress
created: 2026-03-23T20:00:00Z
updated: 2026-03-23T20:00:00Z
---

# 首页改造方案 — Step 1: 设计诊断与方案

> 基于 redesign-existing-projects skill 审计 + PRD 对照

## 一、现状诊断

### 技术栈
- Next.js 16 + Tailwind CSS v4 + shadcn/ui (new-york)
- 主题：theme-education.css（学术蓝 oklch(0.50 0.20 250)）
- 字体：Merriweather (heading) + Noto Sans (body) + JetBrains Mono (code)
- i18n：next-intl (en/zh, prefix: as-needed)
- 区块渲染：dynamic-page.tsx switch-case 模式

### 发现的问题（按 redesign skill 审计清单）

#### Typography
- ✅ 字体选择良好（Merriweather serif + Noto Sans），符合教育学术定位
- ⚠️ Hero 标题 `text-4xl sm:text-6xl` 偏小，教育 landing page 需要更大的 display text
- ⚠️ 缺少 letter-spacing 调整（大标题需要负 tracking）

#### Color and Surfaces
- ✅ oklch 色彩系统完善，学术蓝配色一致
- ⚠️ 阴影用的 `rgba(0,0,0,...)` 纯黑，应该用蓝色调阴影（`--np-navy`）
- ⚠️ `bg-muted` 区块太淡（oklch 0.95），视觉上和白色区块区分度不够
- ⚠️ Hero 区域缺少背景视觉（纯白太平），需要微妙的渐变或纹理

#### Layout
- ⚠️ 所有区块都是居中对称布局，缺少视觉节奏变化
- ⚠️ introduce 区块的 features-list 是标准 3-equal-card 模式（最泛滥的 AI 布局）
- ⚠️ 区块间距均匀（py-16），缺少视觉重点区分

#### Content（最严重）
- ❌ Hero 话术功能导向："Interactive 3D Physics Experiments" — 家长不关心技术
- ❌ 标题仍暗示 "Physics Only"，但产品覆盖 5 学科
- ❌ 无学科入口，无年级分流 — 用户不知道从哪开始
- ❌ introduce 图片用模板截图（已部分修复但仍是通用实验图）
- ❌ 缺少实验精选展示 — 产品最强卖点没有视觉化
- ❌ "64 experiments across 5 subjects" 信息藏在小 badge 里，不够突出

#### Component Patterns
- ⚠️ FAQ 用的标准 Accordion 模式（6 条太多）
- ⚠️ subscribe 区块对教育产品意义不大（家长不订阅 newsletter）
- ⚠️ features 区块是标准 6-card grid（泛用模板感）
- ⚠️ 导航栏 7 项过多，Learn/Gallery 是空内容不应暴露

#### Interactivity
- ⚠️ 按钮缺少 hover/active 状态差异化
- ⚠️ 无入场动画（所有内容一次性 mount）
- ⚠️ 导航无 current page 指示器

## 二、改造方案

### 导航栏（P0）

**从 7 项精简到 4 项：**

```
现状: [AI Visualizer] [Experiments] [Learn] [Gallery] [Pricing] [More▾] [Sign In]
目标: [Subjects▾]     [AI Lab]      [Pricing]                       [Sign In]
```

| 项 | 类型 | 行为 |
|----|------|------|
| Subjects ▾ | 下拉菜单 | 展示 5 学科网格 + 年级快捷链接 + "Browse All" |
| AI Lab [AI] | 链接 | → `/upg`，保留 AI badge |
| Pricing | 链接 | → `/pricing` |
| Sign In | 按钮 | 登录 modal |

**Subjects 下拉结构：**
```
┌─────────────────────────────────────────────┐
│  By Subject                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌───┐│
│  │⚛ Phys│ │⚗ Chem│ │🧬 Bio│ │🌍 Ear│ │📐 ││
│  │ 27   │ │  7   │ │ 14   │ │  5   │ │ 11││
│  └──────┘ └──────┘ └──────┘ └──────┘ └───┘│
│  ──────────────────────────────────────────  │
│  By Grade: K-2  3-5  6-8  9-12  AP          │
│  Browse All 64 Experiments →                 │
└─────────────────────────────────────────────┘
```

**实现方式：**
- 修改 `en/zh landing.json` 的 `header.nav.items`
- Subjects 下拉复用现有 nav dropdown 组件（已有 `children` 支持）
- 新增 `grid` 布局的 mega menu 变体（需修改 header.tsx）

### S1: Hero 区块（P0）

**从功能导向 → 成绩导向：**

```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│        Ace Your Science Exams                             │
│        with Interactive 3D Labs                           │
│        ~~~~~~~~~~~~~~~~~~~~~~~~~~                         │
│                                                           │
│  See it. Touch it. Understand it. Score higher.           │
│                                                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───┐ │
│  │⚛ Physics│ │⚗ Chem   │ │🧬 Bio   │ │🌍 Earth │ │📐 │ │
│  │  27 labs│ │  7 labs │ │ 14 labs │ │  5 labs │ │11 │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └───┘ │
│                                                           │
│  64 experiments · K-2 to AP · NGSS/GCSE/AP aligned       │
│                                                           │
│  [⚡ Start Free →]                                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**设计规范：**
- 标题：`text-5xl sm:text-7xl`，letter-spacing: `-0.02em`，`font-heading` (Merriweather)
- 副标题：`text-lg sm:text-xl`，`text-muted-foreground`
- 学科按钮：5 个卡片，hover 上移 + 阴影加深，带学科图标 + 实验数量
- 单一 CTA："Start Free"（不要 "View Pricing" 分散注意力）
- 信任标签行：小字 `text-sm text-muted-foreground`
- 背景：微妙蓝色径向渐变（从中心向外，opacity 5%）

**实现方式：**
- 修改 `landing.json` 的 hero 区块数据
- Hero 组件需要新增「学科按钮网格」子区域 — 通过 `hero.subjects` JSON 字段 + hero.tsx 条件渲染
- 移除第二个 CTA button

### S2: Experiment Showcase（P0，新建）

**3 张跨学科精选实验：**

```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│        See What Students Are Exploring                    │
│                                                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │ [缩略图]      │ │ [缩略图]      │ │ [缩略图]      │     │
│  │ Projectile   │ │ DNA Double   │ │ Chemical     │     │
│  │ Motion       │ │ Helix        │ │ Equilibrium  │     │
│  │ Physics·9-12 │ │ Biology·AP   │ │ Chemistry·AP │     │
│  │ [Try It →]   │ │ [Try It →]   │ │ [Try It →]   │     │
│  └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                           │
│        [Browse All 64 Experiments →]                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**设计规范：**
- 3 列网格，`gap-6`，`max-w-5xl mx-auto`
- 卡片：`rounded-xl`，hover 时 `shadow-lg` + 缩略图 `scale(1.03)`
- 缩略图 aspect-ratio `16/10`，`object-cover`
- 学科+年级标签：`text-xs` pill badge
- "Try It" 链接直接跳 `/experiments/{slug}`
- 背景：白色（与上下 `bg-muted` 区块形成对比）

**实现方式：**
- 新建 `src/themes/default/blocks/experiment-showcase.tsx`
- 数据从 `landing.json` 新字段 `experiment_showcase` 取
- 在 `dynamic-page.tsx` switch 中注册 `case 'experiment-showcase'`
- 在 `page.tsx` 的 `showSections` 数组中添加

### S3: Grade Levels（P0，新建）

**按年级分流入口：**

```
┌─────────────────────────────────────────────────────────┐
│  bg-muted                                                │
│        Find Experiments for Your Grade                    │
│                                                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───┐│
│  │  K-2    │ │  3-5    │ │  6-8    │ │  9-12   │ │ AP ││
│  │ Ages 5-7│ │Ages 8-10│ │Ages11-13│ │Ages14-17│ │Coll││
│  │ 2 labs  │ │ 11 labs │ │ 9 labs  │ │ 29 labs │ │13  ││
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └───┘│
│                                                           │
│  Every experiment maps to NGSS, GCSE, or AP standards    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**设计规范：**
- 5 列网格（桌面），2 列（平板），1 列（手机）
- 卡片：`border` + `rounded-lg`，hover 时 `border-primary` + `bg-primary/5`
- 年级名大字 `text-2xl font-bold`，年龄范围 `text-sm text-muted-foreground`，实验数 `text-primary font-semibold`
- 底部信任标签：课标图标行

**实现方式：**
- 新建 `src/themes/default/blocks/grade-levels.tsx`
- 数据从 `landing.json` 新字段 `grade_levels` 取
- 注册到 dynamic-page.tsx

### S4: How It Works — 简化为 3 步（P1）

从 4 步改为 3 步，话术聚焦考试：

```
① Pick Your Subject → ② Run the 3D Lab → ③ Understand & Score Higher
```

**实现：** 修改 `landing.json` 的 `usage` 区块，删掉第 4 步 "Track Progress"

### S5: AI Lab Teaser（P2，可后做）

轻量单行展示 UPG 差异化：

```
┌─────────────────────────────────────────────────────────┐
│  🤖 Can't find the experiment you need?                  │
│  Describe any topic → get an interactive 3D lab          │
│  "Doppler Effect"  "Enzyme Kinetics"  "Plate Tectonics" │
│  [Try AI Lab →]                                          │
└─────────────────────────────────────────────────────────┘
```

**暂不实现**（等 UPG 端到端跑通后再上）

### S6: Social Proof — 数据 + 课标（P1）

从 "物理之光" 改为 "Built for Better Grades"：

```
64 3D Labs | 5 Subjects | K-2 → AP Coverage
NGSS · GCSE · AP Physics · AP Chemistry · AP Biology
```

**实现：** 修改 `landing.json` 的 `stats` 区块话术

### S7: FAQ — 精简到 4 条（P1）

保留：
1. Is it free?
2. What subjects are covered?
3. What grade levels?
4. Is student data safe?

移除：需要安装什么吗？/ 老师可以用吗？

### S8: CTA — 考试话术（P1）

从 "今天就开始探索物理" → "Ready to Ace Your Next Exam?"

## 三、区块顺序

### 新 showSections 数组：

```typescript
const showSections = [
  'hero',                // S1: 成绩导向 + 学科入口
  'experiment_showcase', // S2: 3 张精选实验（新建）
  'grade_levels',        // S3: 年级分流（新建）
  'usage',               // S4: 3 步流程
  'stats',               // S6: Social Proof
  'faq',                 // S7: 4 条 FAQ
  'cta',                 // S8: 考试 CTA
];
```

**移除的区块：**
- `introduce` → 被 S2 + S3 替代
- `features` → 内容合并到 Hero 信任标签 + stats
- `subscribe` → 教育产品不需要

## 四、文件改动清单

| 文件 | 改动 | 复杂度 |
|------|------|--------|
| `messages/en/landing.json` | 全面更新话术 + 新增 2 个区块数据 | 🟡 |
| `messages/zh/landing.json` | 同步中文话术 | 🟡 |
| `app/[locale]/(landing)/page.tsx` | 更新 showSections 数组 | 🟢 |
| `themes/default/blocks/hero.tsx` | 新增学科按钮网格渲染 | 🟡 |
| `themes/default/blocks/experiment-showcase.tsx` | **新建** | 🟡 |
| `themes/default/blocks/grade-levels.tsx` | **新建** | 🟡 |
| `themes/default/blocks/index.tsx` | 导出新组件 | 🟢 |
| `themes/default/pages/dynamic-page.tsx` | 注册新 block | 🟢 |
| `themes/default/blocks/header.tsx` | Subjects mega menu | 🔴 |

## 五、实施顺序

1. **landing.json 话术更新**（en + zh） — 依赖 step-002 文案
2. **Hero 学科按钮** — 改 hero.tsx + landing.json
3. **Experiment Showcase 新区块** — 新建组件 + 注册
4. **Grade Levels 新区块** — 新建组件 + 注册
5. **导航栏精简 + Subjects 下拉** — 最复杂，最后做
6. **其余 P1 更新**（usage/stats/faq/cta 话术）
