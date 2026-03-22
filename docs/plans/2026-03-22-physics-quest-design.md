---
name: physics-quest-design
status: backlog
created: 2026-03-22T09:07:51Z
updated: 2026-03-22T09:07:51Z
---

# Technical Design: Physics Quest (实验挑战模式)

## 1. 模块定位与价值

### 目标用户画像

- **主要用户**：北美 K12 学生（Grade 6-12），已在平台使用过 Curated Labs 实验
- **次要用户**：教师（分配 Quest 给学生）、自学者（追求成就和排行）
- **行为特征**：喜欢游戏化闯关、短注意力周期（15-25 分钟完成一个 Quest）、需要即时反馈

### 核心用户旅程

```
学生浏览 Quest 列表 → 选择一个 Quest（如"牛顿运动定律挑战"）
→ Step 1: 阅读前置知识卡片
→ Step 2: 预测实验结果（输入预测值或选择选项）
→ Step 3: 运行嵌入式实验（复用 Curated Lab）
→ Step 4: 对比预测与实际结果
→ Step 5: 撰写/选择解释
→ 完成 Quest → 获得成就徽章 → 解锁下一个 Quest
```

### 与现有系统的关系

- **复用 Curated Labs**：Quest 的实验步骤直接嵌入已有的 3D 实验组件，不重新开发实验场景
- **复用 experimentProgress**：单个实验的时间追踪和 challenge 完成状态继续走现有 progress-service
- **扩展 learningPath**：Quest 本质是"带预测-验证机制的增强版 Learning Path"，但数据模型独立（避免侵入已有结构）
- **扩展 learningStats**：新增 `questsCompleted` / `achievementsEarned` 统计维度

### 教育学依据

采用 **POE（Predict-Observe-Explain）** 教学模型：

1. **Predict**：学生基于前置知识做出预测，激活先验认知
2. **Observe**：通过实验观察真实结果，产生认知冲突
3. **Explain**：学生反思预测偏差，构建正确的物理概念

研究支持：White & Gunstone (1992) 提出 POE 策略在科学教育中显著提升概念理解深度。NeonPhysics 的交互式 3D 实验让"Observe"阶段比传统课堂更直观。

## 2. 系统架构

### 组件关系

```
Quest 模块
├── quest (元数据表)               ← 挑战定义
│   └── questStep (步骤表)         ← 每步：knowledge/predict/experiment/compare/explain
├── questAttempt (尝试记录)        ← 用户的一次完整闯关
│   └── questStepResponse (步骤回答) ← 每步的预测值/解释文本
├── achievement (成就定义)         ← 管理员配置
│   └── userAchievement (用户成就) ← 解锁记录
└── 前端路由
    ├── /quest                     ← Quest 列表/地图
    ├── /quest/[slug]              ← Quest 详情 + 闯关流程
    └── /quest/achievements        ← 成就墙
```

### 数据流

```
[Quest 列表页]
    │  GET /api/quest?category=mechanics
    ▼
[Quest 详情页]
    │  GET /api/quest/{slug}         → 返回 quest + steps
    │  POST /api/quest/{slug}/start  → 创建 questAttempt
    ▼
[闯关步骤循环]
    │  POST /api/quest/{slug}/step/{order}/submit
    │    → 保存 stepResponse（预测/解释）
    │    → 对比逻辑（predict 步骤自动评分或 AI 评分）
    │    → 推进 attempt 进度
    ▼
[完成]
    │  POST /api/quest/{slug}/complete
    │    → 标记 attempt 完成
    │    → 检查并解锁 achievement
    │    → 更新 learningStats
    ▼
[成就墙]
    GET /api/quest/achievements
```

### 集成点

| 集成对象 | 方式 | 说明 |
|----------|------|------|
| Curated Labs | 前端组件嵌入 | Quest experiment 步骤渲染现有实验组件 |
| experimentProgress | API 复用 | 实验步骤中的时间追踪和参数保存走现有 progress-service |
| learningStats | DB 写入 | 完成 Quest 后更新 questsCompleted 计数 |
| Better Auth | session 验证 | Quest 需要登录（预测和进度必须关联用户） |
| Redis | 限流 | Weekly Challenge 提交频率限制 |

## 3. 数据模型设计

所有新增表遵循现有 `schema.ts` 惯例：`text('id')` 主键、`timestamp` 无 timezone、JSON 用 `text` 类型。

### 3.1 quest 表（挑战定义）

```typescript
export const quest = pgTable(
  'quest',
  {
    id: text('id').primaryKey(),
    slug: text('slug').unique().notNull(),
    titleEn: text('title_en').notNull(),
    titleZh: text('title_zh').notNull(),
    descriptionEn: text('description_en').notNull(),
    descriptionZh: text('description_zh').notNull(),
    category: text('category').notNull(), // mechanics/waves/electricity/thermodynamics/biology/chemistry
    difficulty: text('difficulty').notNull(), // beginner/intermediate/advanced
    tier: text('tier').notNull().default('free'), // free/pro/max
    coverImage: text('cover_image'),
    estimatedMinutes: integer('estimated_minutes').notNull().default(20),
    stepCount: integer('step_count').notNull().default(0),
    // 关联的实验 ID（Quest 的核心实验）
    experimentId: text('experiment_id').notNull(),
    // 前置 Quest（可选，构成任务链）
    prerequisiteQuestId: text('prerequisite_quest_id'),
    // 周度挑战标记
    isWeeklyChallenge: boolean('is_weekly_challenge').default(false),
    weeklyStartDate: text('weekly_start_date'), // 'YYYY-MM-DD'，null 表示非周度挑战
    weeklyEndDate: text('weekly_end_date'),
    // 发布状态
    isPublished: boolean('is_published').default(false),
    sortOrder: integer('sort_order').default(0),
    // 统计
    attemptCount: integer('attempt_count').default(0),
    completionCount: integer('completion_count').default(0),
    avgScore: integer('avg_score').default(0), // 0-100
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_quest_category_published').on(table.category, table.isPublished),
    index('idx_quest_experiment').on(table.experimentId),
    index('idx_quest_weekly').on(table.isWeeklyChallenge, table.weeklyStartDate),
    foreignKey({
      columns: [table.prerequisiteQuestId],
      foreignColumns: [table.id],
    }).onDelete('set null'),
  ]
);
```

### 3.2 questStep 表（步骤定义）

```typescript
export const questStep = pgTable(
  'quest_step',
  {
    id: text('id').primaryKey(),
    questId: text('quest_id')
      .notNull()
      .references(() => quest.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull(),
    // 步骤类型
    stepType: text('step_type').notNull(), // 'knowledge' | 'predict' | 'experiment' | 'compare' | 'explain'
    // 内容（i18n）
    titleEn: text('title_en').notNull(),
    titleZh: text('title_zh').notNull(),
    contentEn: text('content_en').notNull(), // Markdown 格式
    contentZh: text('content_zh').notNull(),
    // predict 步骤的配置：问题、选项、正确答案
    // experiment 步骤：关联的实验 slug + 需要观察的参数
    // compare 步骤：评分规则
    // explain 步骤：参考答案
    config: text('config'), // JSON string，结构取决于 stepType
    // 分值权重（用于最终评分）
    maxPoints: integer('max_points').notNull().default(10),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    unique('uq_quest_step_order').on(table.questId, table.orderIndex),
    index('idx_quest_step_quest').on(table.questId),
  ]
);
```

**config JSON 结构按 stepType 区分**：

```typescript
// stepType: 'knowledge'
type KnowledgeConfig = {
  // 无额外配置，content 字段直接存 Markdown
};

// stepType: 'predict'
type PredictConfig = {
  predictionType: 'numeric' | 'multiple_choice' | 'open_ended';
  // numeric: 学生输入数值
  numericTarget?: number;
  numericUnit?: string;
  numericTolerance?: number; // 允许误差百分比，如 10 = +-10%
  // multiple_choice: 选择题
  options_en?: string[];
  options_zh?: string[];
  correctIndex?: number;
  // open_ended: 自由文本（AI 评分）
};

// stepType: 'experiment'
type ExperimentConfig = {
  experimentSlug: string; // 关联的 Curated Lab
  suggestedParameters?: Record<string, number>; // 建议参数
  observationTargets: string[]; // 需要观察的数据，如 ['acceleration', 'velocity']
  minTimeSeconds?: number; // 最少操作时间
};

// stepType: 'compare'
type CompareConfig = {
  // 自动从 predict + experiment 步骤获取数据对比
  showChart: boolean; // 是否展示对比图表
  feedbackEn: string; // 对比后的解读文本
  feedbackZh: string;
};

// stepType: 'explain'
type ExplainConfig = {
  explanationType: 'multiple_choice' | 'free_text';
  options_en?: string[];
  options_zh?: string[];
  correctIndex?: number;
  referenceEn?: string; // 参考解释
  referenceZh?: string;
  useAiScoring?: boolean; // 是否用 AI 评分自由文本
};
```

### 3.3 questAttempt 表（用户尝试记录）

```typescript
export const questAttempt = pgTable(
  'quest_attempt',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    questId: text('quest_id')
      .notNull()
      .references(() => quest.id, { onDelete: 'cascade' }),
    // 进度
    currentStep: integer('current_step').notNull().default(0),
    status: text('status').notNull().default('in_progress'), // 'in_progress' | 'completed' | 'abandoned'
    // 评分
    totalScore: integer('total_score').default(0), // 所有步骤得分总和
    maxPossibleScore: integer('max_possible_score').default(0),
    // 时间
    startedAt: timestamp('started_at').defaultNow().notNull(),
    completedAt: timestamp('completed_at'),
    totalTimeSeconds: integer('total_time_seconds').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_quest_attempt_user').on(table.userId),
    index('idx_quest_attempt_quest').on(table.questId),
    index('idx_quest_attempt_user_quest').on(table.userId, table.questId),
    index('idx_quest_attempt_status').on(table.status),
  ]
);
```

### 3.4 questStepResponse 表（步骤回答）

```typescript
export const questStepResponse = pgTable(
  'quest_step_response',
  {
    id: text('id').primaryKey(),
    attemptId: text('attempt_id')
      .notNull()
      .references(() => questAttempt.id, { onDelete: 'cascade' }),
    stepId: text('step_id')
      .notNull()
      .references(() => questStep.id, { onDelete: 'cascade' }),
    // 用户回答
    responseType: text('response_type').notNull(), // 'numeric' | 'choice' | 'text' | 'observation'
    responseValue: text('response_value'), // 数值字符串 / 选项索引 / 文本内容
    // 评分
    score: integer('score').default(0),
    maxScore: integer('max_score').notNull(),
    // AI 评分反馈（仅 explain + free_text 类型）
    aiFeedback: text('ai_feedback'),
    // 对比数据快照（compare 步骤用）
    comparisonData: text('comparison_data'), // JSON: { predicted: X, observed: Y, deviation: Z }
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_quest_step_response_attempt').on(table.attemptId),
    unique('uq_quest_step_response').on(table.attemptId, table.stepId),
  ]
);
```

### 3.5 achievement 表（成就定义）

```typescript
export const achievement = pgTable(
  'achievement',
  {
    id: text('id').primaryKey(),
    slug: text('slug').unique().notNull(),
    titleEn: text('title_en').notNull(),
    titleZh: text('title_zh').notNull(),
    descriptionEn: text('description_en').notNull(),
    descriptionZh: text('description_zh').notNull(),
    icon: text('icon').notNull(), // emoji 或图标名
    category: text('category').notNull(), // 'quest' | 'streak' | 'mastery' | 'social'
    // 解锁条件（JSON）
    // 如：{ type: 'quest_complete', questId: 'xxx' }
    // 如：{ type: 'quest_count', count: 5 }
    // 如：{ type: 'perfect_score', questId: 'xxx' }
    // 如：{ type: 'streak', days: 7 }
    criteria: text('criteria').notNull(), // JSON string
    // 稀有度
    rarity: text('rarity').notNull().default('common'), // common/rare/epic/legendary
    sortOrder: integer('sort_order').default(0),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_achievement_category').on(table.category),
    index('idx_achievement_active').on(table.isActive),
  ]
);
```

### 3.6 userAchievement 表（用户成就解锁记录）

```typescript
export const userAchievement = pgTable(
  'user_achievement',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    achievementId: text('achievement_id')
      .notNull()
      .references(() => achievement.id, { onDelete: 'cascade' }),
    // 解锁时的上下文
    questAttemptId: text('quest_attempt_id'), // 关联的 attempt（可选）
    unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
  },
  (table) => [
    unique('uq_user_achievement').on(table.userId, table.achievementId),
    index('idx_user_achievement_user').on(table.userId),
  ]
);
```

### 3.7 现有表修改

**learningStats 表**新增两个字段（通过 migration 添加）：

```typescript
// 新增字段
questsCompleted: integer('quests_completed').default(0).notNull(),
achievementsEarned: integer('achievements_earned').default(0).notNull(),
```

### 关系图

```
quest (1) ──→ (N) questStep
quest (1) ──→ (N) questAttempt
quest (1) ──→ (0..1) quest [prerequisiteQuestId 自引用]
questAttempt (1) ──→ (N) questStepResponse
questStepResponse (N) ←── (1) questStep
achievement (1) ──→ (N) userAchievement
user (1) ──→ (N) questAttempt
user (1) ──→ (N) userAchievement
quest.experimentId ──→ Experiment 注册表（应用层关联，非外键）
```

## 4. 路由设计

### 前端页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `[locale]/(landing)/quest/page.tsx` | Quest 列表 | 按 category 分组，显示进度/完成状态 |
| `[locale]/(landing)/quest/[slug]/page.tsx` | Quest 详情 + 闯关 | 核心交互页，包含步骤流程 |
| `[locale]/(landing)/quest/achievements/page.tsx` | 成就墙 | 展示已解锁/未解锁成就 |
| `[locale]/(landing)/quest/weekly/page.tsx` | 周度挑战 | 当周挑战 + 排行榜 |

### 页面功能描述

**Quest 列表页**：
- 按 category 分组展示（力学、波动、电磁等）
- 卡片显示：封面图、标题、难度、预估时间、完成状态
- 筛选：category、difficulty、tier
- 已完成的 Quest 显示得分和成就
- 有前置要求的 Quest 显示锁定状态

**Quest 闯关页**：
- 顶部进度条（Step 1/5）
- 左侧步骤导航（已完成/当前/未解锁）
- 主区域渲染当前步骤内容
- knowledge 步骤：Markdown 渲染 + 公式（KaTeX）
- predict 步骤：数值输入 / 选择题组件
- experiment 步骤：嵌入 Curated Lab 3D 实验
- compare 步骤：预测值 vs 实际值对比图表（Recharts）
- explain 步骤：多选 / 自由文本输入
- 底部：提交按钮 + 上一步/下一步

**成就墙页**：
- 按 category 分栏展示
- 已解锁成就高亮 + 解锁时间
- 未解锁成就灰色 + 解锁条件提示
- 统计：总成就数 / 已解锁数 / 稀有成就计数

## 5. API 设计

### 5.1 Quest CRUD（公开）

**GET /api/quest**

列表查询，支持筛选。

```typescript
// Query params
{
  category?: string;     // mechanics/waves/electricity...
  difficulty?: string;   // beginner/intermediate/advanced
  tier?: string;         // free/pro/max
  weekly?: boolean;      // 只看周度挑战
}

// Response
{
  code: 0,
  message: 'ok',
  data: {
    quests: Array<{
      id: string;
      slug: string;
      title: string;        // 根据 locale 返回 en/zh
      description: string;
      category: string;
      difficulty: string;
      tier: string;
      coverImage: string | null;
      estimatedMinutes: number;
      stepCount: number;
      attemptCount: number;
      completionCount: number;
      // 用户相关（需登录）
      userProgress?: {
        status: 'not_started' | 'in_progress' | 'completed';
        bestScore?: number;
        attemptCount: number;
      };
      // 前置要求
      isLocked: boolean;
      prerequisiteSlug?: string;
    }>;
  }
}
```

**GET /api/quest/[slug]**

单个 Quest 详情 + 步骤列表。

```typescript
// Response
{
  code: 0,
  message: 'ok',
  data: {
    quest: { /* quest 字段 */ },
    steps: Array<{
      id: string;
      orderIndex: number;
      stepType: string;
      title: string;
      content: string;
      config: object;
      maxPoints: number;
    }>,
    currentAttempt?: { /* 进行中的 attempt */ },
    bestAttempt?: { /* 最高分 attempt */ },
    experiment: { /* 关联实验的基本信息 */ },
  }
}
```

权限：Quest 本身对所有人可见，但 pro/max tier 的 Quest 需要订阅才能开始闯关。

### 5.2 闯关流程

**POST /api/quest/[slug]/start**

开始一次新的尝试。

```typescript
// Request: 无 body
// 权限：需登录 + tier 检查
// 逻辑：
//   1. 检查前置 Quest 是否已完成
//   2. 检查是否有未完成的 attempt（有则返回现有的）
//   3. 创建 questAttempt，status = 'in_progress'

// Response
{
  code: 0,
  message: 'ok',
  data: {
    attemptId: string;
    currentStep: number;
    quest: { /* 基本信息 */ };
    steps: [ /* 步骤列表 */ ];
  }
}
```

**POST /api/quest/[slug]/step/[orderIndex]/submit**

提交单步回答。

```typescript
// Request
{
  attemptId: string;
  responseType: 'numeric' | 'choice' | 'text' | 'observation';
  responseValue: string; // 数值字符串 / 选项索引 / 文本 / 'completed'（experiment 步骤）
}

// 逻辑：
//   1. 验证 attemptId 属于当前用户且 status = 'in_progress'
//   2. 验证 orderIndex = attempt.currentStep（不可跳步）
//   3. 根据 stepType + config 评分
//   4. 保存 questStepResponse
//   5. 推进 attempt.currentStep + 1

// Response
{
  code: 0,
  message: 'ok',
  data: {
    score: number;
    maxScore: number;
    feedback?: string;        // 评分反馈
    comparisonData?: object;  // compare 步骤的对比数据
    isLastStep: boolean;
    nextStepIndex?: number;
  }
}
```

**POST /api/quest/[slug]/complete**

完成 Quest（最后一步提交后自动调用，或前端显式调用）。

```typescript
// Request
{
  attemptId: string;
}

// 逻辑：
//   1. 验证所有步骤已提交
//   2. 计算总分
//   3. 标记 attempt status = 'completed'
//   4. 更新 quest.attemptCount / completionCount / avgScore
//   5. 更新 learningStats.questsCompleted
//   6. 检查 achievement 解锁条件
//   7. 返回结果 + 新解锁的成就

// Response
{
  code: 0,
  message: 'ok',
  data: {
    totalScore: number;
    maxPossibleScore: number;
    percentage: number;
    timeSpent: number;
    newAchievements: Array<{
      id: string;
      title: string;
      icon: string;
      rarity: string;
    }>;
    isNewBest: boolean;
  }
}
```

### 5.3 成就系统

**GET /api/quest/achievements**

获取当前用户的成就列表。

```typescript
// 权限：需登录
// Response
{
  code: 0,
  message: 'ok',
  data: {
    total: number;
    unlocked: number;
    achievements: Array<{
      id: string;
      slug: string;
      title: string;
      description: string;
      icon: string;
      category: string;
      rarity: string;
      isUnlocked: boolean;
      unlockedAt?: string;
    }>;
  }
}
```

### 5.4 周度挑战

**GET /api/quest/weekly**

获取当周挑战。

```typescript
// Response
{
  code: 0,
  message: 'ok',
  data: {
    quest: { /* 当周 quest */ } | null,
    startsAt: string;
    endsAt: string;
    leaderboard: Array<{
      rank: number;
      userId: string;
      userName: string;
      score: number;
      timeSpent: number;
    }>;
    myRank?: number;
    myBestScore?: number;
  }
}
```

### 5.5 管理后台

**POST /api/admin/quest** — 创建 Quest
**PUT /api/admin/quest/[id]** — 更新 Quest
**DELETE /api/admin/quest/[id]** — 删除 Quest
**POST /api/admin/quest/[id]/steps** — 添加步骤
**PUT /api/admin/quest/[id]/steps/[stepId]** — 更新步骤
**DELETE /api/admin/quest/[id]/steps/[stepId]** — 删除步骤
**POST /api/admin/achievements** — 创建成就
**PUT /api/admin/achievements/[id]** — 更新成就

权限：RBAC `admin` 角色。

## 6. 前端组件设计

### 6.1 新增组件

| 组件 | 路径 | 说明 |
|------|------|------|
| `QuestCard` | `shared/blocks/quest/quest-card.tsx` | Quest 卡片（列表页用）：封面、标题、难度、进度 |
| `QuestGrid` | `shared/blocks/quest/quest-grid.tsx` | Quest 网格布局 + category 筛选 |
| `QuestStepper` | `shared/blocks/quest/quest-stepper.tsx` | 步骤导航条（纵向，显示完成/当前/锁定） |
| `KnowledgeStep` | `shared/blocks/quest/steps/knowledge-step.tsx` | 前置知识渲染（Markdown + KaTeX 公式） |
| `PredictStep` | `shared/blocks/quest/steps/predict-step.tsx` | 预测输入：数值滑块 / 选择题 / 自由文本 |
| `ExperimentStep` | `shared/blocks/quest/steps/experiment-step.tsx` | 嵌入 Curated Lab 实验（iframe 或组件） |
| `CompareStep` | `shared/blocks/quest/steps/compare-step.tsx` | 预测 vs 实际对比（Recharts 柱状/折线图） |
| `ExplainStep` | `shared/blocks/quest/steps/explain-step.tsx` | 解释撰写（选择题或文本框） |
| `QuestComplete` | `shared/blocks/quest/quest-complete.tsx` | 完成页：得分、用时、成就动画 |
| `AchievementBadge` | `shared/blocks/quest/achievement-badge.tsx` | 成就徽章组件（稀有度 = 不同边框/光晕） |
| `AchievementWall` | `shared/blocks/quest/achievement-wall.tsx` | 成就墙网格 |
| `WeeklyBanner` | `shared/blocks/quest/weekly-banner.tsx` | 周度挑战顶部横幅 |
| `Leaderboard` | `shared/blocks/quest/leaderboard.tsx` | 排行榜表格 |

### 6.2 复用现有组件

| 组件 | 来源 | 用途 |
|------|------|------|
| `Progress` | `shared/components/ui/progress.tsx` | 步骤进度条 |
| `Card` | `shared/components/ui/card.tsx` | Quest 卡片容器 |
| `Badge` | `shared/components/ui/badge.tsx` | 难度/category 标签 |
| `RadioGroup` | `shared/components/ui/radio-group.tsx` | 选择题 |
| `Slider` | `shared/components/ui/slider.tsx` | 数值预测输入 |
| `Textarea` | `shared/components/ui/textarea.tsx` | 自由文本解释 |
| `Tabs` | `shared/components/ui/tabs.tsx` | 成就分类切换 |
| `Tooltip` | `shared/components/ui/tooltip.tsx` | 成就解锁条件提示 |
| `Recharts` | 已有依赖 | 预测 vs 实际对比图表 |

### 6.3 状态管理

Quest 闯关页使用 React state + URL params：

- `attemptId` 存在 URL query（允许刷新后恢复）
- 当前步骤 `currentStep` 从 attempt 数据获取
- 步骤回答暂存在 `useState`，提交后清空
- 无需全局状态管理（Zustand/Redux），每个 Quest 闯关是独立会话

## 7. 评分逻辑

### Predict 步骤评分

| 预测类型 | 评分规则 |
|----------|----------|
| numeric | `abs(predicted - actual) / actual <= tolerance` → 满分；按偏差线性扣分 |
| multiple_choice | 选对满分，选错 0 分 |
| open_ended | 暂不评分（记录），v2 可接 AI 评分 |

### Explain 步骤评分

| 解释类型 | 评分规则 |
|----------|----------|
| multiple_choice | 选对满分 |
| free_text + AI | 调用 Claude haiku 评分（0-10），cost 约 $0.001/次 |
| free_text 无 AI | 记录但不评分，给参考答案让学生自评 |

### 总分计算

```
totalScore = sum(stepResponse.score)
maxPossibleScore = sum(questStep.maxPoints)
percentage = round(totalScore / maxPossibleScore * 100)
```

## 8. 成就解锁引擎

成就检查在 Quest 完成时触发，逻辑集中在 `shared/lib/quest/achievement-engine.ts`。

### 支持的 criteria 类型

```typescript
type AchievementCriteria =
  | { type: 'quest_complete'; questId: string }                    // 完成特定 Quest
  | { type: 'quest_count'; count: number }                         // 完成 N 个 Quest
  | { type: 'perfect_score'; questId: string }                     // 满分通过
  | { type: 'category_complete'; category: string; count: number } // 某类别完成 N 个
  | { type: 'streak'; days: number }                               // 连续 N 天完成 Quest
  | { type: 'speed_run'; questId: string; maxSeconds: number }     // 限时完成
  | { type: 'weekly_top'; rank: number };                          // 周度挑战排名前 N
```

### 检查流程

```
Quest 完成
  → 加载所有 isActive=true 的 achievement
  → 过滤掉用户已解锁的
  → 对剩余的逐个检查 criteria
  → 满足条件的批量写入 userAchievement
  → 更新 learningStats.achievementsEarned
  → 返回新解锁列表
```

## 9. 周度挑战扩展

### 运营流程

1. 管理员通过 Admin API 创建一个 Quest，标记 `isWeeklyChallenge=true` + `weeklyStartDate/EndDate`
2. 前端 `/quest/weekly` 查询当周挑战
3. 每周日 23:59 UTC 截止，Cron 任务（`/api/cron/weekly-quest`）计算排行榜快照
4. 排行数据用 Redis sorted set 实时维护，Cron 只做最终存档

### 排行数据结构（Redis）

```
Key: quest:weekly:{questId}:leaderboard
Type: Sorted Set
Score: totalScore * 10000 - totalTimeSeconds  (分数优先，同分按用时排序)
Member: userId
TTL: 8 天（周挑战结束后 1 天自动清理）
```

## 10. 开发任务分解

### Phase 1: 数据基础 (3 人天)

| 任务 | 工时 | 依赖 |
|------|------|------|
| 1.1 新增 6 张表到 schema.ts | 0.5d | 无 |
| 1.2 修改 learningStats 加字段 | 0.25d | 1.1 |
| 1.3 生成 migration + push | 0.25d | 1.2 |
| 1.4 创建 model 层（6 个文件） | 1d | 1.3 |
| 1.5 Quest TypeScript 类型定义 | 0.5d | 无 |
| 1.6 成就引擎核心逻辑 | 0.5d | 1.4 |

### Phase 2: API 层 (4 人天)

| 任务 | 工时 | 依赖 |
|------|------|------|
| 2.1 GET/POST /api/quest（列表 + 筛选） | 0.5d | Phase 1 |
| 2.2 GET /api/quest/[slug]（详情） | 0.5d | Phase 1 |
| 2.3 POST /api/quest/[slug]/start | 0.5d | Phase 1 |
| 2.4 POST /api/quest/[slug]/step/[order]/submit（核心评分逻辑） | 1d | Phase 1 |
| 2.5 POST /api/quest/[slug]/complete（完成 + 成就检查） | 0.5d | 2.4 |
| 2.6 GET /api/quest/achievements | 0.25d | Phase 1 |
| 2.7 Admin CRUD API（quest + step + achievement） | 0.75d | Phase 1 |

### Phase 3: 前端页面 (5 人天)

| 任务 | 工时 | 依赖 |
|------|------|------|
| 3.1 Quest 列表页 + QuestCard + QuestGrid | 1d | 2.1 |
| 3.2 Quest 闯关页框架 + QuestStepper | 0.5d | 2.2, 2.3 |
| 3.3 KnowledgeStep（Markdown + KaTeX） | 0.5d | 3.2 |
| 3.4 PredictStep（数值/选择/文本） | 0.5d | 3.2 |
| 3.5 ExperimentStep（嵌入 Curated Lab） | 0.5d | 3.2 |
| 3.6 CompareStep（Recharts 对比图） | 0.5d | 3.2 |
| 3.7 ExplainStep + 提交 | 0.5d | 3.2 |
| 3.8 QuestComplete 完成页 + 成就动画 | 0.5d | 2.5 |
| 3.9 成就墙页 | 0.5d | 2.6 |

### Phase 4: 周度挑战 (2 人天)

| 任务 | 工时 | 依赖 |
|------|------|------|
| 4.1 Redis 排行榜逻辑 | 0.5d | Phase 2 |
| 4.2 GET /api/quest/weekly API | 0.5d | 4.1 |
| 4.3 周度挑战页 + Leaderboard 组件 | 0.5d | 4.2 |
| 4.4 Cron 任务：周排行存档 | 0.5d | 4.1 |

### Phase 5: 内容创建 + 测试 (2 人天)

| 任务 | 工时 | 依赖 |
|------|------|------|
| 5.1 创建 3 个种子 Quest（力学入门/AP 进阶/周挑战） | 0.5d | Phase 3 |
| 5.2 创建 10 个种子 Achievement | 0.25d | Phase 3 |
| 5.3 i18n 翻译（en + zh） | 0.5d | Phase 3 |
| 5.4 单元测试（评分逻辑 + 成就引擎） | 0.5d | Phase 2 |
| 5.5 E2E 测试（完整闯关流程） | 0.25d | Phase 3 |

### 总计

| Phase | 工时 | 说明 |
|-------|------|------|
| Phase 1: 数据基础 | 3d | 可独立开发 |
| Phase 2: API 层 | 4d | 依赖 Phase 1 |
| Phase 3: 前端页面 | 5d | 依赖 Phase 2，可与 Phase 2 部分并行 |
| Phase 4: 周度挑战 | 2d | 依赖 Phase 2 |
| Phase 5: 内容 + 测试 | 2d | 依赖 Phase 3 |
| **总计** | **16 人天** | 单人约 3.5 周，双人约 2 周 |

## 11. 技术风险与缓解

### 风险 1：实验嵌入的数据通信

**问题**：ExperimentStep 需要从嵌入的 Curated Lab 读取实验结果（如加速度值），用于 CompareStep 的预测对比。

**缓解**：
- 方案 A（推荐）：Curated Lab 组件通过 `onDataChange` callback 上报 `SimulationData`，ExperimentStep 持有 ref 收集数据
- 方案 B：通过 `postMessage` 通信（如果是 iframe 嵌入）
- 已有 `SimulationData` 和 `SimulationState` 类型可复用

### 风险 2：AI 评分成本

**问题**：free_text explain 步骤用 AI 评分，如果量大会产生成本。

**缓解**：
- V1 阶段默认用 multiple_choice 评分（零成本），free_text 只记录不评分
- 仅 Pro/Max 用户的 Quest 启用 AI 评分
- 使用 claude-haiku-4-5-20251001（最便宜），单次评分 < $0.001

### 风险 3：周度挑战并发

**问题**：大量用户同时提交周度挑战，Redis sorted set 写入压力。

**缓解**：
- Redis sorted set ZADD 是 O(log N)，单实例支撑万级并发无问题
- 排行榜读取用 ZREVRANGE，O(log N + M)

### 风险 4：前置 Quest 链路循环

**问题**：`prerequisiteQuestId` 自引用可能形成循环依赖。

**缓解**：
- Admin API 创建/更新时检查：沿 prerequisite 链遍历，深度 > 10 或发现环则拒绝
- 应用层校验，不依赖 DB 约束

### 风险 5：Quest 闯关页状态丢失

**问题**：用户刷新页面或关闭浏览器，进行中的回答丢失。

**缓解**：
- 每步提交即入库（questStepResponse），刷新后从 attempt.currentStep 恢复
- predict 步骤的输入值在提交前存 `sessionStorage` 作为草稿

## 12. 测试策略

### 单元测试

- 评分逻辑（numeric tolerance / choice matching）
- 成就引擎（各 criteria 类型的判断）
- 前置 Quest 循环检测
- 排行榜分数计算公式

### 集成测试

- 完整闯关流程：start → submit 每步 → complete → 成就检查
- 重复提交同一步骤的幂等性
- 未登录用户访问权限拦截
- tier 访问控制（free 用户不能开始 pro Quest）

### E2E 测试

- 学生完成一个 3 步 Quest 的完整流程
- 成就解锁弹窗展示
- 周度挑战排行榜实时更新

## 13. 未来扩展

以下功能不在本次开发范围，但数据模型已预留扩展空间：

- **教师 Dashboard**：教师查看班级学生的 Quest 完成情况（需新增 classroom 表）
- **自适应难度**：根据学生历史得分动态调整 predict 步骤难度
- **Quest 创建器**：教师自定义 Quest（需要更复杂的 Admin UI）
- **社交分享**：分享 Quest 成绩卡片到社交媒体
- **Quest 推荐**：基于学生的实验浏览历史推荐 Quest（推荐引擎）
