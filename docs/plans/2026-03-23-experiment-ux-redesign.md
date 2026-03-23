---
name: experiment-ux-redesign
status: backlog
created: 2026-03-23T07:22:55Z
updated: 2026-03-23T07:30:00Z
---

# 实验页面 UX 重新设计 — 基于 Mathigon + Save My Exams 对标分析

## 背景

### 商业诊断结论（dbs-diagnosis）

- 核心产品：Curated Labs（零边际成本印钞机）
- UPG 定位：高级套餐锚点功能，不是独立利润中心
- 定价：Free（3 实验）→ Pro $4.99/月 → UPG $2/次
- 获客：All in SEO，111 个实验 = 111 个 SEO 着陆页
- 成长层级：第 1 层（需求未验证），最优先任务 = 找到第一个真实用户
- 用户买的不是「酷炫可视化」，是「考试考好」

### 对标来源

| 对标 | 学什么 |
|------|--------|
| Save My Exams | 获客路径 + SEO 架构 + 定价结构 + 内容组织 |
| Mathigon | 产品品质 + 交互体验 + 用户留存 + 7 个设计模式 |
| Pocket Prep | 从零到一的节奏 + 垂直切入（先 AP Physics 1） |

### 当前痛点

1. 实验页面是平铺结构，用户滚动即「看完」，学习效果差
2. Challenges 定义在数据中但**没有 UI 渲染组件**
3. Learning cards（theory 字段）是纯文本，没有卡片组件
4. 没有引导式流程，用户不知道「下一步该干什么」
5. URL 结构扁平（`/experiments/[slug]`），SEO 层级不够
6. 没有分享/嵌入功能给教师使用
7. 免费实验也需要经过实验列表页才能到达，路径太长

## 设计方案

### 一、SEO 架构重构（对标 Save My Exams）

#### 1.1 URL 结构改造

**现状：**
```
/experiments                    → 实验列表（平铺所有 67 个）
/experiments/[slug]             → 实验详情
```

**目标：**
```
/labs                           → 总索引（按学科分类）
/labs/[subject]                 → 学科索引（如 /labs/physics）
/labs/[subject]/[standard]      → 课标索引（如 /labs/physics/ap-physics-1）
/labs/[subject]/[standard]/[slug] → 实验详情
```

**关键规则：**
- 旧 URL `/experiments/*` 做 301 重定向到新 URL
- 每一层 URL 都是独立的 SEO 着陆页
- `[standard]` 值域：`ap-physics-1`、`ap-physics-2`、`ap-physics-c`、`ngss-ms`、`ngss-hs`、`ap-chemistry`、`ap-biology`、`elementary-k5`
- URL 全小写 + kebab-case

#### 1.2 新增中间索引页

**`/labs` 总索引页：**
- 按 5 学科分区展示
- 每个学科显示：图标 + 名称 + 实验数量 + 「Browse」链接
- 底部：「Why NeonPhysics?」价值主张区块
- SEO title：`Free Interactive Science Labs | AP Physics, Chemistry, Biology | NeonPhysics`

**`/labs/[subject]` 学科索引页：**
- 按课标/年级分组展示该学科下的所有实验
- 每组：课标名称 + 实验卡片网格
- SEO title：`{Subject} Virtual Labs | AP & NGSS Aligned | NeonPhysics`

**`/labs/[subject]/[standard]` 课标索引页：**
- 该课标下的所有实验列表
- 每个实验卡片：缩略图 + 标题 + 难度 + 时间 + Free/Pro 标签
- 顶部：课标说明 + 覆盖率进度条
- SEO title：`AP Physics 1 Virtual Labs | Projectile Motion, Forces, Energy | NeonPhysics`

#### 1.3 实验详情页 SEO

每个实验页面的 metadata 模板：

```typescript
title: `${experiment.title} | ${standard} Virtual Lab | NeonPhysics`
description: `Interactive 3D ${experiment.title} simulation. Adjust ${paramNames}. Aligned to ${standards}. Free to try.`
keywords: [experiment.seoKeywords, standard, subject, 'virtual lab', 'simulation', 'interactive']
```

**结构化数据（JSON-LD）：**
```json
{
  "@type": "LearningResource",
  "educationalLevel": "AP Physics 1",
  "teaches": "Projectile Motion",
  "interactivityType": "active",
  "isAccessibleForFree": true/false,
  "provider": { "@type": "Organization", "name": "NeonPhysics" }
}
```

#### 1.4 内部链接策略

每个实验页面底部包含：
- 「Related Labs」→ 同课标下的其他实验（`relatedExperiments` 字段）
- 「More {Subject} Labs」→ 返回学科索引
- 面包屑导航：`Labs > Physics > AP Physics 1 > Projectile Motion`

### 二、实验页面交互重构（对标 Mathigon 7 个设计模式）

#### 2.1 模式 1：故事开场（Narrative Hook）

**现状：** 实验页面直接展示 3D 场景 + 参数滑块 + theory 文本

**改造：** 新增 `hook` 字段到实验数据结构

```typescript
// 新增到 Experiment interface
interface Experiment {
  // ...existing fields
  hook: {
    question: string;      // 反直觉问题或日常困惑
    context?: string;      // 可选的简短背景（1 句话）
    actionPrompt: string;  // 引导操作的文案
  };
}
```

**示例数据（projectile-motion）：**
```typescript
hook: {
  question: "A bullet fired horizontally and a bullet dropped from the same height — which hits the ground first?",
  context: "Most people get this wrong.",
  actionPrompt: "Launch the projectile and find out →"
}
```

**UI 渲染（新组件 `ExperimentHook.tsx`）：**
```
┌──────────────────────────────────────┐
│  ❓ A bullet fired horizontally...   │
│     Most people get this wrong.      │
│                                      │
│     [ Launch the projectile → ]      │  ← 按钮，点击后展开实验区
└──────────────────────────────────────┘
```

- Hook 区域占首屏 50% 以上高度
- 背景用实验的静态缩略图（模糊处理）
- 按钮点击后，Hook 区域收起（带动画），3D 实验区滑入

**每种学科的 Hook 类型偏好：**

| 学科 | 偏好 Hook 类型 | 示例 |
|------|---------------|------|
| Physics | 反直觉问题 | 「两个不同质量的球同时落地吗？」 |
| Chemistry | 日常困惑 | 「为什么铁会生锈但金不会？」 |
| Biology | 真实事件 | 「COVID 病毒如何劫持你的细胞？」 |
| Earth Science | 视觉冲击 | 「地球每年远离太阳 1.5 厘米，为什么我们没感觉？」 |
| Math | 悖论/挑战 | 「有一扇门后面有汽车，你该换门吗？」 |

#### 2.2 模式 2：进度门控（Gated Progression）

**现状：** 实验页面所有内容平铺展示

**改造：** 分 5 个阶段，逐步解锁

```typescript
// 新增枚举
type ExperimentStage = 'hook' | 'explore' | 'learn' | 'challenge' | 'summary';

// ExperimentClient 新增状态
const [currentStage, setCurrentStage] = useState<ExperimentStage>('hook');
const [completedStages, setCompletedStages] = useState<Set<ExperimentStage>>(new Set());
```

**5 阶段流程：**

```
Stage 1: HOOK（首屏）
├── 显示反直觉问题
├── 用户点击「开始实验」
└── → 解锁 Stage 2

Stage 2: EXPLORE（实验操作）
├── 3D 场景 / HTML iframe 渲染
├── 参数滑块（可调节）
├── 数据面板（实时数值）
├── 播放控制
├── 引导提示：「Try dragging the mass slider to see what happens」
├── 完成条件：调节过至少 1 个参数 + 停留 30 秒
└── → 解锁 Stage 3

Stage 3: LEARN（概念卡片）
├── 学习卡片依次展开（每张卡片是一个概念点）
├── 每张卡片包含：标题 + 说明 + 公式（LaTeX）+ 与实验的对应关系
├── 卡片可折叠/展开
├── 完成条件：展开过所有卡片
└── → 解锁 Stage 4

Stage 4: CHALLENGE（问答挑战）
├── 从 experiment.challenges 渲染
├── 每道题：问题文本 + 3-4 选项
├── 答对：随机鼓励 + 解锁下一题
├── 答错：引导回实验操作（「Try adjusting {param} and observe again」）
├── 完成条件：答对所有题目（支持多次尝试）
└── → 解锁 Stage 5

Stage 5: SUMMARY（总结）
├── 实验核心结论（1-2 句话）
├── 关键公式回顾
├── 你的实验数据（本次调节过的参数值）
├── 分享按钮（Share / Google Classroom）
├── 下一个推荐实验
└── → 完成，进度保存
```

**UI 布局（桌面端）：**

```
┌─────────────────────────────────────────────────┐
│  面包屑：Labs > Physics > AP Physics 1 > ...    │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ 进度条    │         当前阶段内容                   │
│ ● Hook   │                                      │
│ ● Explore│    （根据 currentStage 渲染对应内容）   │
│ ○ Learn  │                                      │
│ ○ Challenge│                                    │
│ ○ Summary│                                      │
│          │                                      │
│ [Skip ▸] │                                      │
│          │                                      │
├──────────┴──────────────────────────────────────┤
│  Standards: NGSS HS-PS2-1 | AP Physics 1 Unit 1 │
└─────────────────────────────────────────────────┘
```

**进度条组件（`StageProgress.tsx`）：**
- 左侧或顶部垂直/水平进度指示器
- 已完成阶段：实心圆 ●（可点击回顾）
- 当前阶段：脉冲动画圆
- 未解锁阶段：空心圆 ○（显示标题但不可点击）
- Skip 按钮：小号灰色文字，放在进度条底部

**移动端适配：**
- 进度条改为顶部水平条
- 阶段内容全宽
- 3D 场景高度固定 50vh，下方可滚动

#### 2.3 模式 3：微交互密度

**30 秒交互节奏表（每个实验必须满足）：**

| 时间 | 用户行为 | 触发方式 |
|------|---------|---------|
| 0-5s | 看到 Hook 问题 | 页面加载即显示 |
| 5-10s | 点击「开始实验」 | Hook 按钮 |
| 10-15s | 3D 场景加载，看到自动演示动画 | autoPlay 属性 |
| 15-25s | 拖动第一个参数滑块 | 引导提示高亮闪烁 |
| 25-35s | 观察数据面板数值变化 | 实时更新 |
| 35-45s | 尝试第二个参数 | 引导提示 |
| 45-60s | 点击「继续学习」进入 Learn 阶段 | 按钮出现 |

**新增「引导提示」组件（`GuidedTooltip.tsx`）：**

```typescript
interface GuidedTooltipProps {
  targetRef: RefObject<HTMLElement>;  // 指向的目标元素
  message: string;                    // 提示文案
  showAfterMs: number;               // 延迟显示时间
  hideOnInteraction: boolean;         // 用户操作后自动隐藏
  pulseAnimation: boolean;           // 是否有脉冲动画
}
```

**触发规则：**
- 用户进入 Explore 阶段后 5 秒未操作 → 显示「Try dragging this slider →」指向第一个滑块
- 用户只调了 1 个参数 → 15 秒后提示「Now try changing {nextParam} too」
- 用户在任何阶段 30 秒未操作 → 显示温和的提示
- 同一提示最多显示 1 次，不重复烦人

**L4 彩蛋交互规范：**

每个实验必须定义至少 1 个「极端值彩蛋」：

```typescript
// 新增到 Experiment interface
interface Experiment {
  // ...existing fields
  easterEggs?: Array<{
    parameterId: string;
    condition: 'max' | 'min' | 'specific';
    triggerValue?: number;           // 当 condition = 'specific' 时
    effect: string;                  // 描述视觉效果
    message: string;                 // 显示的有趣文案
  }>;
}
```

**示例：**
```typescript
// projectile-motion
easterEggs: [
  {
    parameterId: 'angle',
    condition: 'specific',
    triggerValue: 90,
    effect: 'ball-goes-straight-up',
    message: "Straight up! The ball will land right where it started. Try 45° for maximum range."
  },
  {
    parameterId: 'velocity',
    condition: 'max',
    effect: 'escape-velocity',
    message: "At this speed, the ball would leave Earth's atmosphere! 🚀"
  }
]
```

**彩蛋触发 UI：**
- 触发时在 3D 场景顶部弹出轻量 toast（2 秒自动消失）
- 可选：场景内特殊视觉效果（如粒子爆炸、颜色变化）

#### 2.4 模式 4：即时反馈系统

**新组件：`ChallengeCard.tsx`**

这是当前最大的缺失——challenges 定义在数据中但完全没有 UI。

```typescript
interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: (challengeId: string) => void;
  onNeedHelp: (parameterId?: string) => void;  // 引导回实验
}

interface Challenge {
  id: string;
  question: string;
  options?: string[];              // 选择题选项
  correctAnswer?: string;          // 正确答案
  hint: string;                    // 答错时的引导提示
  relatedParameterId?: string;     // 关联的实验参数（答错时引导调节）
  tier: Tier;
}
```

**答对反馈（随机池）：**
```typescript
const POSITIVE_FEEDBACK = [
  "Exactly!",
  "Nice work!",
  "You got it!",
  "That's right!",
  "Spot on!",
  "Nailed it!",
  "Perfect!",
  "You're getting it!"
];
```

**答错反馈模板：**
```typescript
function getWrongFeedback(challenge: Challenge): string {
  if (challenge.relatedParameterId) {
    return `Not quite. Go back and try adjusting the ${challenge.relatedParameterId} slider. Watch what happens to the result.`;
  }
  return challenge.hint || "Hmm, take another look at the experiment above.";
}
```

**答错后的行为：**
1. 显示引导文案（不显示正确答案）
2. 如果有 `relatedParameterId`，Explore 区域的对应滑块高亮闪烁
3. 用户可以重新回到 Explore 阶段操作
4. 回到 Challenge 后，同一题可重新作答
5. 没有错误次数限制，没有惩罚

**视觉反馈规范：**
- 答对：绿色边框 + ✓ 图标 + 正面文案 + 0.3s 延迟后自动滚到下一题
- 答错：橙色边框（不是红色）+ 引导文案 + 「Try Again」按钮 + 「Go back to experiment」按钮
- 禁止使用：红色 ✗、「Wrong」、「Incorrect」、最终分数

#### 2.5 模式 5：零门槛体验

**现状检查：**
- 免费 3 个实验无需注册 ✅（`canAccessExperiment` 对 free 实验返回 true）
- 但用户必须从 `/experiments` 列表页找到实验 → 路径太长

**改造项：**

**a) 首页直达实验（≤ 2 次点击）：**

在 hero 区域或紧接 hero 下方，新增「Try a Free Lab」区块：

```
┌────────────────────────────────────────────┐
│                  Hero                       │
│  「Master AP Physics with Interactive Labs」 │
│                                            │
│  [ Try a Free Lab — No Sign Up Required ]  │  ← 主 CTA
│  [ View All Labs ]                          │  ← 次 CTA
└────────────────────────────────────────────┘
┌────────────────────────────────────────────┐
│  🔬 Most Popular Free Labs                  │
│                                            │
│  [📦 Newton's Laws] [🎯 Projectile] [〰️ SHM] │  ← 3 个免费实验卡片
│   Try Now           Try Now         Try Now │
└────────────────────────────────────────────┘
```

**b) 实验页面加载优化：**

```
阶段 1（0-1s）：
  - 服务端渲染 Hook 区域 + 面包屑 + 元数据
  - 实验静态缩略图占位

阶段 2（1-3s）：
  - 3D 场景客户端加载
  - 缩略图上显示加载进度条
  - Hook 文字和按钮可交互

阶段 3（3s+）：
  - 3D 场景就绪，替换缩略图
  - 自动播放演示动画
```

**c) 注册时机（仅在以下场景出现）：**

| 场景 | 注册提示形式 |
|------|-------------|
| 访问第 4 个实验（非免费） | PaywallGate 弹窗（现有组件改造） |
| 想保存实验进度 | 底部 banner：「Sign up to save your progress」 |
| 完成一个实验的 Summary 阶段 | 轻量提示：「Create an account to track your learning」 |
| 从未在这 3 个场景以外出现 | — |

**d) Cookie 同意优化：**
- 使用最小化底部 banner（不是全屏 modal）
- 不遮挡实验内容
- 「Accept」后立刻消失，不影响操作

#### 2.6 模式 6：可分享 / 可嵌入

**a) 学生分享（新组件 `ShareExperiment.tsx`）：**

在 Summary 阶段和实验页面右上角显示分享按钮。

分享内容：
- 标题：`I just completed the ${experimentTitle} lab on NeonPhysics!`
- URL：实验页面的完整 URL
- 图片：实验的 OG Image（动态生成或使用缩略图）

分享渠道：
- Copy Link（主按钮）
- Google Classroom（教育场景核心）
- WhatsApp / iMessage（学生之间）
- Twitter / X（传播）

```typescript
interface ShareExperimentProps {
  experiment: Experiment;
  completionData?: {
    challengesCompleted: number;
    totalChallenges: number;
    timeSpent: number;
  };
}
```

**b) Google Classroom 一键分享：**

```typescript
// 生成 Google Classroom 分享链接
function getClassroomShareUrl(experiment: Experiment): string {
  const labUrl = `${appUrl}/labs/${experiment.subject}/${experiment.standard}/${experiment.slug}`;
  const title = encodeURIComponent(experiment.title);
  return `https://classroom.google.com/share?url=${encodeURIComponent(labUrl)}&title=${title}`;
}
```

在实验页面右上角添加 Google Classroom 图标按钮（对教师极其重要）。

**c) iFrame 嵌入：**

新增路由 `/embed/lab/[slug]`：
- 只渲染实验的 3D 场景 + 参数滑块（无 header/footer/导航）
- 支持 URL 参数控制：`?autoplay=true&controls=minimal`
- 底部显示 「Powered by NeonPhysics — View Full Lab →」

每个实验的 Summary 阶段显示 embed 代码：
```html
<iframe src="https://neonphysics.com/embed/lab/projectile-motion"
        width="800" height="600" frameborder="0" allowfullscreen>
</iframe>
```

**d) `/teachers` 页面（新页面）：**

```
/teachers
├── 价值主张：「Free interactive labs for your classroom」
├── 嵌入教程：How to embed labs in Google Classroom / Canvas / Schoology
├── 实验清单：按课标分组，每个带 embed 代码和 classroom 链接
├── 邮件订阅：「Get notified when we add new labs」
└── SEO title: "Free Virtual Science Labs for Teachers | AP & NGSS Aligned"
```

这个页面的目的是**被教师搜索到**。关键词：
- `free virtual labs for teachers`
- `AP Physics labs for classroom`
- `NGSS science simulations`
- `Google Classroom science activities`

#### 2.7 模式 7：多语言 SEO（架构预留，暂不实施）

**现状：** en + zh，next-intl 配置完善

**架构预留：**
- 实验数据结构中 `hook.question`、`theory`、`challenges[].question` 等字段需要支持 i18n
- 建议方式：在 experiments.json 翻译文件中按 experimentId 组织翻译
- 不在 experiment data 文件中硬编码多语言

**扩展优先级（等英文 SEO 跑通后）：**
1. Spanish（美国 Hispanic 学生 25%+）
2. French（加拿大魁北克）
3. Korean（北美韩裔重视教育）

### 三、学习卡片系统（新组件）

**现状：** `theory` 字段是纯文本字符串，没有卡片组件

**改造：** 拆分为结构化卡片数组

```typescript
// 新增到 Experiment interface
interface Experiment {
  // 替换原有的 theory: string
  learningCards: Array<{
    id: string;
    title: string;                   // 卡片标题
    content: string;                 // 概念说明（支持 Markdown）
    formula?: {
      latex: string;                 // LaTeX 公式
      description: string;          // 公式解释
    };
    relatedParameterId?: string;     // 关联的实验参数
    illustration?: string;           // 可选的图示 URL
  }>;
}
```

**卡片 UI 组件（`LearningCard.tsx`）：**

```
┌─────────────────────────────────────┐
│  📘 Newton's Second Law              │  ← 标题
│                                     │
│  The net force on an object equals  │  ← 内容
│  its mass times its acceleration.   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  F_net = m × a              │   │  ← 公式区（LaTeX 渲染）
│  │  Force = Mass × Acceleration │   │
│  └─────────────────────────────┘   │
│                                     │
│  💡 Try setting mass to 2kg in      │  ← 关联实验提示
│     the experiment above            │
│                                     │
│  [Expand ▾] or [Collapse ▴]        │
└─────────────────────────────────────┘
```

**卡片交互：**
- 默认折叠状态（只显示标题），用户点击展开
- 展开时有滑入动画
- 展开第一张卡片后，第二张自动显示标题（引导继续）
- 所有卡片展开过 → 解锁 Challenge 阶段

### 四、定价与付费墙改造

#### 4.1 简化定价（诊断结论）

**砍掉 Max 层级。** 只保留：

| 层级 | 价格 | 内容 |
|------|------|------|
| Free | $0 | 3 个实验完整体验 + 5 min/天配额 |
| Pro | $4.99/月 | 全部实验 + 无限时间 + 5 次 UPG/月 |
| UPG 加购 | $2/次 | 按次购买 UPG 生成 |

**代码变更：**
- `access.ts`：移除 `max` 层级，`canAccessTier` 只判断 `free` / `pro`
- `pricing.json`：只保留 Free 和 Pro 两个 item
- `pricing.tsx`：只渲染两列对比
- 数据库：现有 `max` 订阅用户自动映射为 `pro`

#### 4.2 付费墙优化（`PaywallGate.tsx` 改造）

**现状：** 整个实验被遮挡，背景模糊，CTA 居中

**改造：**
- 不遮挡整个页面，而是在用户试图进入第 4 个实验时弹出
- 弹窗内容：
  - 实验缩略图（清晰的，不模糊）
  - 标题：「Unlock All 111 Labs」
  - 副标题：「Including ${experimentTitle} and 107 more」
  - 价格：「$4.99/month — Cancel anytime」
  - 主 CTA：「Start Free Trial」或「Upgrade to Pro」
  - 次 CTA：「Continue with Free Labs」（回到免费实验）
- 不显示「Sign in」——如果用户未登录，点 Upgrade 后先走注册流程再到支付

### 五、垂直聚焦策略（对标 Pocket Prep）

#### 5.1 上线推广顺序

**Phase 1（上线首月）：AP Physics 1 Only**
- SEO 全力打磨 AP Physics 1 的所有实验页面
- 每个实验的 Hook、Learning Cards、Challenges 内容精修
- 目标：AP Physics 1 相关长尾词进入 Google 前 3 页

**Phase 2（第 2-3 月）：扩展 AP Physics 2 / C**
- 复用 Phase 1 的内容模板和 SEO 策略
- 观察 Phase 1 的数据（Search Console）调整方向

**Phase 3（第 4-6 月）：扩展 Chemistry + Biology**
- 按 SEO 数据表现决定优先级

**Phase 4（6 月+）：K-5 / Middle School**
- 这批实验的用户决策者是家长/教师，获客路径不同
- 需要单独的 SEO 策略

#### 5.2 内容精修标准（AP Physics 1 优先）

每个 AP Physics 1 实验必须满足：

| 检查项 | 要求 |
|--------|------|
| Hook | 有反直觉问题或日常困惑，≤ 2 句 |
| Learning Cards | 3-5 张卡片，覆盖核心概念 + 公式 |
| Challenges | 3-5 道选择题，答错引导回实验 |
| 彩蛋 | 至少 1 个极端值彩蛋 |
| SEO title | 包含 AP Physics 1 + 实验名 + Virtual Lab |
| SEO description | 包含 interactive + 参数名 + 课标编号 |
| JSON-LD | LearningResource 结构化数据 |
| 缩略图 | 有吸引力的实验截图 |
| Related Labs | 链接 2-3 个同课标实验 |

### 六、新增组件清单

| 组件 | 路径 | 用途 | 优先级 |
|------|------|------|--------|
| `ExperimentHook.tsx` | `shared/blocks/experiments/` | Hook 问题展示 + 开始按钮 | P0 |
| `StageProgress.tsx` | `shared/blocks/experiments/` | 5 阶段进度指示器 | P0 |
| `LearningCard.tsx` | `shared/blocks/experiments/` | 概念卡片（可折叠 + 公式） | P0 |
| `ChallengeCard.tsx` | `shared/blocks/experiments/` | 问答挑战（答题 + 反馈） | P0 |
| `ExperimentSummary.tsx` | `shared/blocks/experiments/` | 完成总结 + 分享 | P1 |
| `GuidedTooltip.tsx` | `shared/components/ui/` | 引导提示气泡 | P1 |
| `ShareExperiment.tsx` | `shared/blocks/experiments/` | 分享按钮组 + Classroom | P1 |
| `EasterEggToast.tsx` | `shared/components/ui/` | 彩蛋触发通知 | P2 |
| `BreadcrumbNav.tsx` | `shared/components/ui/` | 面包屑导航 | P1 |
| `LabIndexPage.tsx` | 路由页面 | `/labs` 总索引 | P0 |
| `SubjectIndexPage.tsx` | 路由页面 | `/labs/[subject]` 学科索引 | P0 |
| `StandardIndexPage.tsx` | 路由页面 | `/labs/[subject]/[standard]` 课标索引 | P1 |

### 七、数据结构变更

#### 7.1 Experiment interface 扩展

```typescript
interface Experiment {
  // === 现有字段（保留） ===
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  standards: Standards;
  category: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  tags: string[];
  difficulty: Difficulty;
  parameters: Parameter[];
  formulas: Formula[];
  theory: string;              // 保留作为向后兼容（deprecated）
  instructions: string;
  challenges: Challenge[];
  wave: number;
  tier: Tier;
  estimatedTime: number;
  relatedExperiments: string[];
  seoTitle: string;
  seoKeywords: string[];
  jsonLd: object;

  // === 新增字段 ===
  hook: {
    question: string;
    context?: string;
    actionPrompt: string;
  };
  learningCards: LearningCard[];
  easterEggs?: EasterEgg[];
  standard: string;             // 课标标识（ap-physics-1, ngss-hs 等），用于 URL 路由
}

interface LearningCard {
  id: string;
  title: string;
  content: string;
  formula?: Formula;
  relatedParameterId?: string;
  illustration?: string;
}

interface EasterEgg {
  parameterId: string;
  condition: 'max' | 'min' | 'specific';
  triggerValue?: number;
  effect: string;
  message: string;
}

// Challenge interface 扩展
interface Challenge {
  id: string;
  question: string;
  options: string[];             // 新增：选择题选项
  correctAnswer: string;         // 新增：正确答案
  hint: string;
  relatedParameterId?: string;   // 新增：关联参数
  tier: Tier;
}
```

#### 7.2 迁移策略

- `theory` 字段保留，但标记为 `@deprecated`
- 新增 `learningCards` 为空数组时，回退到 `theory` 纯文本渲染
- `hook` 字段可选，没有时直接跳到 Explore 阶段
- `challenges` 扩展 `options` 和 `correctAnswer`，没有时 Challenge 阶段跳过
- 所有迁移渐进式——先改 AP Physics 1 的实验数据，其他 wave 后续补

### 八、实施优先级

#### P0 — 上线前必须完成（影响核心体验）

1. URL 结构改造（`/labs/` 层级路由 + 301 重定向）
2. ExperimentClient 重构（5 阶段门控流程）
3. ChallengeCard 组件（填补最大 UI 缺失）
4. LearningCard 组件（替代 theory 纯文本）
5. AP Physics 1 实验数据精修（hook + learningCards + challenges 补全）
6. 首页「Try a Free Lab」直达入口
7. 每个实验页面的 SEO metadata 模板

#### P1 — 上线后第一迭代

8. ExperimentHook 组件（故事开场）
9. StageProgress 组件（进度指示器）
10. ShareExperiment 组件 + Google Classroom 按钮
11. `/teachers` 页面
12. BreadcrumbNav 面包屑导航
13. 中间索引页（学科/课标级别）
14. GuidedTooltip 引导提示

#### P2 — 数据驱动的迭代

15. EasterEgg 系统（彩蛋交互）
16. iFrame 嵌入路由（`/embed/lab/[slug]`）
17. 实验完成分享卡片（带截图的 OG Image）
18. 其他学科实验数据精修
19. 西班牙语支持（等 SEO 数据验证后）

### 九、验收标准

| 标准 | 度量 |
|------|------|
| 零门槛 | 免费实验从首页到开始操作 ≤ 2 次点击、≤ 5 秒 |
| 首次交互 | 用户进入实验后 15 秒内完成首次参数调节 |
| 门控有效性 | 用户必须完成操作才能看到下一阶段内容 |
| Skip 可用 | 每个阶段都有 Skip 按钮，不强制 |
| 反馈无负面 | 问答中不出现 Wrong / Incorrect / 红色 ✗ |
| SEO 就绪 | 每个实验页面 Lighthouse SEO 评分 ≥ 95 |
| 移动端可用 | 实验页面在手机 Safari/Chrome 上完整可用 |
| 加载速度 | 实验页面 LCP ≤ 3 秒（含 3D 占位图渐进加载） |

### 十、设计决策记录

| 决策 | 选了什么 | 为什么 |
|------|---------|--------|
| URL 从 `/experiments` 改为 `/labs` | `/labs` | 更短、更直观、SEO 关键词密度更高 |
| 砍掉 Max 定价层 | 只留 Free + Pro | Pro/Max 差异不够大，简化用户决策 |
| 门控用 5 阶段不用 3 阶段 | 5 阶段 | 每阶段 ≤ 2 分钟，粒度适中 |
| 答错不显示正确答案 | 引导回实验 | 目的是让用户动手而不是背答案 |
| 注册墙放在第 4 个实验 | 不在免费实验中弹出 | 零门槛体验优先，降低跳出率 |
| 先做 AP Physics 1 | 其他学科后做 | Pocket Prep 验证：垂直切入 → 扩面 |
| Hook 字段可选 | 渐进迁移 | 不阻塞上线，先改最重要的实验 |
