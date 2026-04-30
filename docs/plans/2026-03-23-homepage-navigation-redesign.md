---
name: homepage-navigation-redesign
status: historical-plan
snapshot_date: '2026-03-23'
created: '2026-03-23T14:45:00Z'
updated: '2026-04-23T00:00:00Z'
---

> **Historical document — not current SSOT.**
> This file is a point-in-time plan from 2026-03-23. It may describe goals, intermediate counts, or decisions that no longer match the current repository. Verify anything you rely on against `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`, or the source tree.

# 首页 + 导航栏重新设计 PRD

## 产品定位（重新校准）

### 核心价值主张
**SeePhysics 用 3D 交互实验帮学生真正理解学科知识，通过考试拿高分。**

### 用户画像与决策链
```
决策者（付费）: 家长 → 目标：孩子通过考试、拿高分
使用者（体验）: 学生 → 目标：理解概念、完成作业、备考
推荐者（影响）: 教师 → 目标：教学辅助、布置互动作业
```

### 关键转化路径
```
学生: 首页 → 选学科 → 选年级 → 玩实验 → 注册 → 家长付费
教师: 首页 → 看课标对齐 → 试用 → 推荐给学校/家长
家长: 首页 → 看成绩承诺 → 看价格 → 付费
```

### 品牌重定位
- **旧**: "Interactive 3D Physics Experiments" — 只讲物理，功能导向
- **新**: "Ace Your Science Exams with 3D Labs" — 多学科，成绩导向
- **不叫 SeePhysics?** 短期保留品牌名，但所有文案去掉"Physics Only"的暗示

## 竞品分析要点

| 竞品 | 学到什么 | 我们的差异化 |
|------|---------|-------------|
| PhET | 学科按钮入口是最高效的首页交互 | 我们有 AI 生成能力（UPG），PhET 没有 |
| Chegg | "91% 用户成绩提升" — 结果承诺是家长转化利器 | 我们是 3D 可视化，不是文字解题 |
| Quizlet | "为任何科目进行考试准备" — 考试场景切入 | 我们是实验模拟，不是背单词/做题 |

### 我们的独特卖点（竞品没有的）
1. **3D 交互实验** — PhET 是 2D HTML5，我们是 Three.js 3D
2. **AI 实验生成（UPG）** — 输入任意主题 → 30秒生成交互可视化
3. **5 学科 K-12~AP 全覆盖** — 不只是物理
4. **NGSS/GCSE/AP 课标对齐** — 不是随便做的实验，是考试会考的

## 导航栏设计

### 当前（7 项，过多）
```
AI Visualizer [AI] | Experiments | Learn | Gallery | Pricing | More ▾ | Sign In
```

### 新设计（4 主项 + 辅助）
```
┌──────────────────────────────────────────────────────────────────┐
│ 🔬 SeePhysics    Subjects ▾    AI Lab [AI]    Pricing    [Sign In] │
│                                                         🌙  🌐   │
└──────────────────────────────────────────────────────────────────┘
```

#### Subjects 下拉菜单（替代 Experiments 平铺入口）
```
┌─────────────────────────────────────────┐
│  Subjects                                │
│                                         │
│  ⚛️  Physics          🧬 Biology        │
│  ⚗️  Chemistry        🌍 Earth Science  │
│  📐 Math                                │
│                                         │
│  ─────────────────────────────────────  │
│  Browse All 64 Experiments →            │
│  By Grade: K-2  3-5  6-8  9-12  AP     │
└─────────────────────────────────────────┘
```

#### 导航项说明

| 项 | 链接 | 说明 |
|---|------|------|
| **Subjects ▾** | 下拉菜单 | 学科入口 + 年级快捷链接，替代旧 Experiments |
| **AI Lab** [AI] | `/upg` | 保留差异化卖点，名字更短更酷 |
| **Pricing** | `/pricing` | 保留 |
| **Sign In** | modal | 保留 |

#### 移除/降级

| 项 | 处理 | 理由 |
|---|------|------|
| Learn | 隐藏 | 只有 3 条内容，并入 experiments 页的 learning path 推荐 |
| Gallery | 隐藏 | DB 报错 + 无用户内容，上线前不暴露 |
| More ▾ | 移到 footer | Blog/Updates 低频入口放 footer 够了 |

## 首页区块设计（8 个区块）

### S1: Hero — 考试成绩导向 + 学科入口

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│            Ace Your Science Exams                            │
│            with Interactive 3D Labs                          │
│                                                             │
│   See it. Touch it. Understand it. Score higher.            │
│                                                             │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌────┐│
│   │ ⚛ Phys  │ │ ⚗ Chem  │ │ 🧬 Bio  │ │ 🌍 Earth │ │📐  ││
│   │  27 labs │ │  7 labs │ │ 14 labs │ │  5 labs  │ │    ││
│   └─────────┘ └─────────┘ └─────────┘ └──────────┘ └────┘│
│                                                             │
│   64 experiments · K-2 to AP · NGSS/GCSE/AP aligned        │
│                                                             │
│   [Start Free →]                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**设计要点**：
- 标题直击家长痛点："Ace Your Science Exams"
- 副标题讲方法："See it. Touch it. Understand it."
- 学科按钮带实验数量，点击直接跳 `/experiments?subject=xxx`
- 一个 CTA 够了，不要"View Pricing"分散注意力
- 底部一行标签建立信任：课标对齐 + 免费开始

### S2: Experiment Showcase — 3 张精选实验（跨学科）

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              See What Students Are Exploring                 │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ [缩略图]      │ │ [缩略图]      │ │ [缩略图]      │        │
│  │              │ │              │ │              │        │
│  │ Projectile   │ │ DNA Double   │ │ Chemical     │        │
│  │ Motion       │ │ Helix        │ │ Equilibrium  │        │
│  │ Physics·9-12 │ │ Biology·AP   │ │ Chemistry·AP │        │
│  │ [Try It →]   │ │ [Try It →]   │ │ [Try It →]   │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│              [Browse All 64 Experiments →]                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**设计要点**：
- 精选 3 个跨学科实验，视觉上证明"我们不只是物理"
- 每张卡片可直接进入实验，降低体验门槛
- 底部链接引导到完整实验列表

### S3: Grade Levels — 按年级分流（家长最关心的维度）

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│          Find Experiments for Your Grade                     │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────┐│
│  │  K-2    │ │  3-5    │ │  6-8    │ │  9-12   │ │  AP  ││
│  │ 2 labs  │ │ 11 labs │ │ 9 labs  │ │ 29 labs │ │13labs││
│  │ Ages    │ │ Ages    │ │ Ages    │ │ Ages    │ │ Coll ││
│  │ 5-7     │ │ 8-10    │ │ 11-13   │ │ 14-17   │ │ Prep ││
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └──────┘│
│                                                             │
│  Every experiment maps to NGSS, GCSE, or AP standards       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**设计要点**：
- 家长看到孩子的年级段 → 安心"这是为我孩子设计的"
- 数字+年龄范围让选择零犹豫
- 底部一句课标对齐增强专业感

### S4: How It Works — 3 步流程

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              How It Works                                    │
│                                                             │
│  ① Pick Your Subject        ② Run the 3D Lab               │
│  Choose from Physics,       Adjust parameters,              │
│  Chemistry, Biology,        see real-time results           │
│  and more.                  in interactive 3D.              │
│                                                             │
│              ③ Understand & Score Higher                     │
│              Complete challenges that reinforce              │
│              key concepts tested on exams.                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### S5: AI Lab Teaser — 差异化卖点（轻量展示）

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🤖 Can't find the experiment you need?                     │
│                                                             │
│  Describe any science topic, and our AI generates           │
│  an interactive 3D visualization in seconds.                │
│                                                             │
│  "Doppler Effect"  "Enzyme Kinetics"  "Plate Tectonics"    │
│                                                             │
│  [Try AI Lab →]                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### S6: Social Proof — 成绩承诺（Chegg 式）

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│        Built for Better Grades                               │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   64     │  │   5      │  │ K-2→AP   │                  │
│  │ 3D Labs  │  │ Subjects │  │ Coverage │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                                                             │
│  NGSS · GCSE · AP Physics · AP Chemistry · AP Biology       │
│  Standards-aligned so you study what's on the exam.         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### S7: FAQ (精简 4 条)

```
Is it free?
What subjects are covered?
What grade levels?
Is student data safe?
```

### S8: CTA — 最终转化

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│        Ready to Ace Your Next Exam?                          │
│                                                             │
│  Free experiments available. No sign-up required.           │
│                                                             │
│  [Start Exploring Free →]         [See Pricing]             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 中文版话术对照

| EN | ZH |
|----|----|
| Ace Your Science Exams with Interactive 3D Labs | 3D 交互实验，学科考试轻松拿高分 |
| See it. Touch it. Understand it. Score higher. | 看得见，摸得着，学得会，考得好。 |
| Find Experiments for Your Grade | 找到适合你年级的实验 |
| Built for Better Grades | 为更好的成绩而生 |
| Ready to Ace Your Next Exam? | 准备好下次考试拿高分了吗？ |
| Standards-aligned so you study what's on the exam | 对齐课标，学的就是要考的 |

## 实施优先级

### P0 — 必须做（首页核心）
1. Hero 区块改造（学科按钮入口 + 考试导向话术）
2. 导航栏精简（Subjects 下拉 + 隐藏 Learn/Gallery）
3. Experiment Showcase 区块（3 张精选卡片）
4. Grade Levels 区块（年级分流入口）

### P1 — 应该做
5. How It Works 简化为 3 步
6. Social Proof 区块（数据 + 课标列表）
7. CTA 改造（考试话术）
8. FAQ 精简到 4 条

### P2 — 可以后做
9. AI Lab Teaser 区块（等 UPG 跑通后再上）
10. 教师专区入口（Teacher Hub）
11. 移动端导航适配

## 技术实现评估

| 改动 | 复杂度 | 涉及文件 |
|------|--------|---------|
| 导航精简 | 🟢 | `en/zh landing.json` header 区块 |
| Hero 学科按钮 | 🟡 | 新建 hero 子组件 or 改 landing.json + hero.tsx |
| Experiment Showcase | 🟡 | 新建 block 组件，从 registry 取 3 个精选 |
| Grade Levels 区块 | 🟡 | 新建 block 组件，从 registry 统计各年级数量 |
| 文案更新 | 🟢 | `en/zh landing.json` |
| 移除 Gallery/Learn 导航 | 🟢 | `en/zh landing.json` header.nav |
| Footer 调整 | 🟢 | `en/zh landing.json` footer 区块 |
