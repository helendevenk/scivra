---
name: ap-prep-mode-design
status: historical-plan
snapshot_date: '2026-03-22'
created: '2026-03-22T09:08:22Z'
updated: '2026-04-23T00:00:00Z'
---

> **Historical document — not current SSOT.**
> This file is a point-in-time plan from 2026-03-22. It may describe goals, intermediate counts, or decisions that no longer match the current repository. Verify anything you rely on against `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`, or the source tree.

# Technical Design: AP Prep Mode

## 1. 模块定位与价值

### 目标用户画像

| 画像 | 描述 |
|------|------|
| 主力用户 | 北美 11-12 年级学生，正在备考 AP Physics 1/2/C（约 30 万/年） |
| 次级用户 | AP Physics 教师，用题库做课堂练习和作业 |
| 长尾用户 | 自学者、国际学校学生（IB 转 AP 的交叉需求） |

### 核心用户旅程（5步）

1. **选课进入** — 用户在导航栏点击 "AP Prep"，选择考试类型（AP Physics 1 / 2 / C-Mech / C-E&M）
2. **按知识点刷题** — 在题库中按 Unit/Topic 筛选，看到题目列表，每题标注难度和考频
3. **做题判分** — 选择答案后提交，系统判分并显示正确答案 + 文字解析
4. **UPG 可视化解析** — 点击 "See It in Action" 按钮，触发 UPG 生成（或加载缓存），用交互式 HTML 可视化解释物理原理
5. **进度追踪** — Dashboard 显示已做题数、正确率、薄弱知识点推荐

### 与现有功能的关系

| 功能 | 关系 |
|------|------|
| UPG | AP Prep 的解析可视化直接复用 UPG generateCore 管线。每题的 UPG 是 "带物理上下文的定向生成"，不是开放式生成 |
| Learning Path | AP Prep 可看做一种结构化 Learning Path，但数据模型不同（题目 vs 节点）。未来可打通，目前独立 |
| Gallery | AP Prep 生成的高质量 UPG 可被管理员推荐到 Gallery（通过 `upgGeneration.featured`） |
| Credit System | UPG 可视化解析消耗积分，复用现有积分系统。Free 用户有每日限额 |

### 竞品对比优势

| 竞品 | 弱点 | NeonPhysics 差异化 |
|------|------|---------------------|
| Khan Academy | 视频为主，缺乏交互式可视化 | UPG 零依赖交互 HTML，学生可调参数观察变化 |
| AP Classroom (College Board) | 官方题库但 UI 陈旧，无可视化 | 现代 UI + 赛博学术风 + 实时物理模拟 |
| Varsity Tutors / Albert.io | 纯文字解析，无动态演示 | 每题配套 UPG 动态可视化 |
| PhET | 有模拟但不做题库 | 题库 + 模拟一站式 |

**核心卖点：唯一将 AP 题库与 AI 生成交互式物理可视化结合的平台。**

## 2. 数据模型设计

### 新增表（5 张）

#### 2.1 `ap_exam` — 考试类型

```typescript
export const apExam = pgTable(
  'ap_exam',
  {
    id: text('id').primaryKey(),
    slug: text('slug').unique().notNull(), // 'ap-physics-1', 'ap-physics-2', 'ap-physics-c-mech', 'ap-physics-c-em'
    titleEn: text('title_en').notNull(),
    titleZh: text('title_zh').notNull(),
    descriptionEn: text('description_en'),
    descriptionZh: text('description_zh'),
    unitCount: integer('unit_count').default(0),
    questionCount: integer('question_count').default(0),
    isPublished: boolean('is_published').default(false),
    coverImage: text('cover_image'),
    sort: integer('sort').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_ap_exam_published').on(table.isPublished),
  ]
);
```

#### 2.2 `ap_unit` — 知识单元（对应 College Board 的 Unit）

```typescript
export const apUnit = pgTable(
  'ap_unit',
  {
    id: text('id').primaryKey(),
    examId: text('exam_id')
      .notNull()
      .references(() => apExam.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(), // 'unit-1-kinematics'
    unitNumber: integer('unit_number').notNull(), // 1, 2, 3...
    titleEn: text('title_en').notNull(),
    titleZh: text('title_zh').notNull(),
    descriptionEn: text('description_en'),
    descriptionZh: text('description_zh'),
    topicCount: integer('topic_count').default(0),
    questionCount: integer('question_count').default(0),
    examWeight: integer('exam_weight'), // percentage, e.g. 12 means 12%
    sort: integer('sort').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_ap_unit_exam').on(table.examId),
    unique('uq_ap_unit_exam_slug').on(table.examId, table.slug),
  ]
);
```

#### 2.3 `ap_question` — 题目

```typescript
export const apQuestion = pgTable(
  'ap_question',
  {
    id: text('id').primaryKey(),
    examId: text('exam_id')
      .notNull()
      .references(() => apExam.id, { onDelete: 'cascade' }),
    unitId: text('unit_id')
      .notNull()
      .references(() => apUnit.id, { onDelete: 'cascade' }),
    questionNumber: integer('question_number').notNull(), // 展示用序号
    type: text('type').notNull(), // 'mcq' | 'frq' (Multiple Choice / Free Response)
    difficulty: text('difficulty').notNull(), // 'easy' | 'medium' | 'hard'
    examFrequency: text('exam_frequency'), // 'high' | 'medium' | 'low' — 历年出现频率
    stemEn: text('stem_en').notNull(), // 题干（英文）
    stemZh: text('stem_zh'), // 题干（中文）
    stemImage: text('stem_image'), // 题目配图 URL
    choicesEn: text('choices_en'), // JSON: [{"label":"A","text":"..."},{"label":"B","text":"..."}]
    choicesZh: text('choices_zh'), // JSON: 中文选项
    correctAnswer: text('correct_answer').notNull(), // MCQ: "A"/"B"/"C"/"D"; FRQ: JSON rubric
    explanationEn: text('explanation_en').notNull(), // 文字解析（英文）
    explanationZh: text('explanation_zh'), // 文字解析（中文）
    upgPrompt: text('upg_prompt'), // 用于生成 UPG 可视化的定向 prompt
    upgGenerationId: text('upg_generation_id') // 缓存的 UPG 生成 ID（预生成）
      .references(() => upgGeneration.id, { onDelete: 'set null' }),
    tags: text('tags'), // JSON: ["kinematics", "projectile-motion", "2D"]
    source: text('source'), // 'original' | 'adapted' | 'past-exam-2024' — 题目来源
    isPublished: boolean('is_published').default(false),
    sort: integer('sort').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_ap_question_exam_unit').on(table.examId, table.unitId),
    index('idx_ap_question_difficulty').on(table.difficulty),
    index('idx_ap_question_type').on(table.type),
    index('idx_ap_question_published').on(table.isPublished, table.examId),
  ]
);
```

#### 2.4 `ap_attempt` — 用户答题记录

```typescript
export const apAttempt = pgTable(
  'ap_attempt',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    questionId: text('question_id')
      .notNull()
      .references(() => apQuestion.id, { onDelete: 'cascade' }),
    examId: text('exam_id')
      .notNull()
      .references(() => apExam.id, { onDelete: 'cascade' }),
    unitId: text('unit_id')
      .notNull()
      .references(() => apUnit.id, { onDelete: 'cascade' }),
    selectedAnswer: text('selected_answer').notNull(), // MCQ: "A"; FRQ: 用户作答文本
    isCorrect: boolean('is_correct').notNull(),
    timeSpentSeconds: integer('time_spent_seconds'), // 答题用时（秒）
    viewedExplanation: boolean('viewed_explanation').default(false),
    viewedUpg: boolean('viewed_upg').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_ap_attempt_user_exam').on(table.userId, table.examId),
    index('idx_ap_attempt_user_question').on(table.userId, table.questionId),
    index('idx_ap_attempt_user_unit').on(table.userId, table.unitId),
    index('idx_ap_attempt_created').on(table.createdAt),
  ]
);
```

#### 2.5 `ap_user_progress` — 用户备考进度聚合

```typescript
export const apUserProgress = pgTable(
  'ap_user_progress',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    examId: text('exam_id')
      .notNull()
      .references(() => apExam.id, { onDelete: 'cascade' }),
    totalAttempted: integer('total_attempted').default(0).notNull(),
    totalCorrect: integer('total_correct').default(0).notNull(),
    // 按 unit 的正确率快照（JSON: {"unit-id-1": {"attempted":10,"correct":7}, ...}）
    unitBreakdown: text('unit_breakdown'),
    // 薄弱单元 ID 列表（JSON: ["unit-id-3", "unit-id-7"]）
    weakUnits: text('weak_units'),
    lastAttemptAt: timestamp('last_attempt_at'),
    streakDays: integer('streak_days').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique('uq_ap_user_progress_user_exam').on(table.userId, table.examId),
    index('idx_ap_user_progress_user').on(table.userId),
  ]
);
```

### 与现有表的关联关系

```
user (1) ──── (N) ap_attempt
user (1) ──── (N) ap_user_progress
ap_exam (1) ──── (N) ap_unit (1) ──── (N) ap_question
ap_question (N) ──── (0..1) upg_generation  ← 缓存的 UPG 可视化
ap_attempt ──── ap_question / ap_exam / ap_unit  ← 冗余外键加速查询
```

### 示例数据

**ap_exam**:
```json
{
  "id": "exam_ap_physics_1",
  "slug": "ap-physics-1",
  "titleEn": "AP Physics 1: Algebra-Based",
  "titleZh": "AP 物理 1：代数基础",
  "unitCount": 7,
  "questionCount": 210,
  "isPublished": true
}
```

**ap_unit**:
```json
{
  "id": "unit_ap1_kinematics",
  "examId": "exam_ap_physics_1",
  "slug": "kinematics",
  "unitNumber": 1,
  "titleEn": "Unit 1: Kinematics",
  "titleZh": "单元 1：运动学",
  "examWeight": 12
}
```

**ap_question**:
```json
{
  "id": "q_ap1_001",
  "examId": "exam_ap_physics_1",
  "unitId": "unit_ap1_kinematics",
  "questionNumber": 1,
  "type": "mcq",
  "difficulty": "medium",
  "examFrequency": "high",
  "stemEn": "A ball is thrown horizontally from the top of a 45 m tall building with an initial speed of 20 m/s. Ignoring air resistance, approximately how far from the base of the building does the ball land?",
  "choicesEn": "[{\"label\":\"A\",\"text\":\"30 m\"},{\"label\":\"B\",\"text\":\"45 m\"},{\"label\":\"C\",\"text\":\"60 m\"},{\"label\":\"D\",\"text\":\"90 m\"}]",
  "correctAnswer": "C",
  "explanationEn": "Using y = 0.5*g*t^2, t = sqrt(2*45/9.8) ≈ 3.03 s. Horizontal distance x = v*t = 20 * 3.03 ≈ 60 m.",
  "upgPrompt": "Create an interactive projectile motion simulation. A ball is thrown horizontally from height 45m with initial speed 20 m/s. Show the parabolic trajectory, allow adjusting initial height and speed. Display time, horizontal distance, and vertical distance in real-time. Include a slow-motion replay button.",
  "tags": "[\"kinematics\", \"projectile-motion\", \"2D-motion\"]",
  "source": "original",
  "isPublished": true
}
```

## 3. 路由设计

### 前端页面路由

所有路由在 `src/app/[locale]/(landing)/ap-prep/` 下：

| 路由 | 文件路径 | 功能描述 |
|------|----------|----------|
| `/ap-prep` | `ap-prep/page.tsx` | AP Prep 首页：考试类型选择卡片（Physics 1/2/C-Mech/C-E&M），整体统计概览 |
| `/ap-prep/[examSlug]` | `ap-prep/[examSlug]/page.tsx` | 考试详情页：Unit 列表 + 各 Unit 进度条 + 考试权重饼图 |
| `/ap-prep/[examSlug]/[unitSlug]` | `ap-prep/[examSlug]/[unitSlug]/page.tsx` | Unit 题目列表页：题目卡片（序号、难度、类型标签），已做/未做状态 |
| `/ap-prep/[examSlug]/[unitSlug]/[questionId]` | `ap-prep/[examSlug]/[unitSlug]/[questionId]/page.tsx` | 做题页：题干 + 选项 + 提交 + 解析面板 + UPG 可视化区域 |
| `/ap-prep/progress` | `ap-prep/progress/page.tsx` | 备考进度仪表盘：正确率趋势图、薄弱知识点雷达图、每日刷题热力图 |

### Admin 路由

| 路由 | 文件路径 | 功能描述 |
|------|----------|----------|
| `/admin/ap-prep` | `(admin)/admin/ap-prep/page.tsx` | 题库管理首页：考试/Unit CRUD |
| `/admin/ap-prep/questions` | `(admin)/admin/ap-prep/questions/page.tsx` | 题目管理：批量导入/编辑/发布 |
| `/admin/ap-prep/questions/[id]/edit` | `(admin)/admin/ap-prep/questions/[id]/edit/page.tsx` | 单题编辑：表单 + UPG prompt 测试 |

## 4. API 设计

### 4.1 公共 API（前台）

#### GET `/api/ap-prep/exams` — 获取考试列表

```
Response: {
  code: 0,
  data: [{ id, slug, titleEn, titleZh, descriptionEn, descriptionZh, unitCount, questionCount, coverImage }]
}
权限: 无（公开）
```

#### GET `/api/ap-prep/exams/[examSlug]` — 获取考试详情 + Unit 列表

```
Response: {
  code: 0,
  data: {
    exam: { id, slug, titleEn, titleZh, ... },
    units: [{ id, slug, unitNumber, titleEn, titleZh, topicCount, questionCount, examWeight }],
    userProgress: { totalAttempted, totalCorrect, unitBreakdown } | null  // 登录用户才有
  }
}
权限: 公开（userProgress 需要登录）
```

#### GET `/api/ap-prep/exams/[examSlug]/units/[unitSlug]/questions` — 获取题目列表

```
Query: ?page=1&limit=20&difficulty=medium&type=mcq
Response: {
  code: 0,
  data: {
    questions: [{
      id, questionNumber, type, difficulty, examFrequency,
      stemEn, stemZh, stemImage, tags,
      hasUpg: boolean,     // 是否有 UPG 可视化
      userAttempt: { isCorrect, selectedAnswer } | null  // 登录用户的最近一次作答
    }],
    total: number,
    page: number
  }
}
权限: 列表公开，userAttempt 需登录
```

#### GET `/api/ap-prep/questions/[questionId]` — 获取单题详情

```
Response: {
  code: 0,
  data: {
    id, questionNumber, type, difficulty, examFrequency,
    stemEn, stemZh, stemImage, choicesEn, choicesZh, tags,
    // 以下字段仅在用户已提交答案后返回
    correctAnswer?,
    explanationEn?, explanationZh?,
    upgGenerationId?,
    userAttempts?: [{ selectedAnswer, isCorrect, createdAt }]
  }
}
权限: 题目公开，答案/解析在提交后可见
说明: 未提交答案时不返回 correctAnswer/explanation，防止作弊
```

#### POST `/api/ap-prep/questions/[questionId]/submit` — 提交答案

```
Request: { selectedAnswer: "C", timeSpentSeconds: 45 }
Response: {
  code: 0,
  data: {
    isCorrect: boolean,
    correctAnswer: "C",
    explanationEn: "...",
    explanationZh: "...",
    upgGenerationId: "..." | null,
    upgPrompt: "..." | null  // 如果没有缓存的 UPG，返回 prompt 供前端按需生成
  }
}
权限: 需登录
```

#### POST `/api/ap-prep/questions/[questionId]/generate-upg` — 为题目生成 UPG 可视化

```
Request: {} // 无参数，使用 question.upgPrompt
Response: {
  code: 0,
  data: { generationId: "...", status: "completed" | "failed" }
}
权限: 需登录 + 消耗积分（复用 UPG 积分体系）
限流: 复用现有 Redis rate limiter
说明: 如果已有缓存的 upgGenerationId 且 status=completed，直接返回，不重新生成
```

#### GET `/api/ap-prep/progress` — 获取用户备考进度

```
Query: ?examId=xxx  (可选，不传返回所有考试的进度)
Response: {
  code: 0,
  data: {
    exams: [{
      examId, examSlug, titleEn,
      totalAttempted, totalCorrect, accuracyRate,
      unitBreakdown: [{ unitId, unitSlug, titleEn, attempted, correct, rate }],
      weakUnits: [{ unitId, unitSlug, titleEn }],
      streakDays,
      lastAttemptAt
    }]
  }
}
权限: 需登录
```

### 4.2 Admin API（后台）

#### CRUD `/api/admin/ap-prep/exams` — 考试管理

```
GET    /api/admin/ap-prep/exams         — 列表
POST   /api/admin/ap-prep/exams         — 创建
PUT    /api/admin/ap-prep/exams/[id]    — 更新
DELETE /api/admin/ap-prep/exams/[id]    — 删除
权限: admin 角色
```

#### CRUD `/api/admin/ap-prep/units` — 单元管理

```
GET    /api/admin/ap-prep/exams/[examId]/units      — 列表
POST   /api/admin/ap-prep/exams/[examId]/units      — 创建
PUT    /api/admin/ap-prep/units/[id]                 — 更新
DELETE /api/admin/ap-prep/units/[id]                 — 删除
权限: admin 角色
```

#### CRUD `/api/admin/ap-prep/questions` — 题目管理

```
GET    /api/admin/ap-prep/questions                  — 列表（支持按 exam/unit 筛选）
POST   /api/admin/ap-prep/questions                  — 创建单题
PUT    /api/admin/ap-prep/questions/[id]             — 更新
DELETE /api/admin/ap-prep/questions/[id]             — 删除
POST   /api/admin/ap-prep/questions/batch-import     — 批量导入（JSON 格式）
POST   /api/admin/ap-prep/questions/[id]/pre-generate-upg — 预生成 UPG 缓存
权限: admin 角色
```

### 4.3 权限矩阵

| 操作 | Free | Pro | Max | Admin |
|------|------|-----|-----|-------|
| 查看考试/Unit 列表 | Yes | Yes | Yes | Yes |
| 查看题目列表 | Yes | Yes | Yes | Yes |
| 做题（MCQ） | 5题/天 | 无限 | 无限 | 无限 |
| 查看文字解析 | Yes | Yes | Yes | Yes |
| 生成 UPG 可视化 | 1次/天 | 复用 UPG Pro 配额 | 复用 UPG Max 配额 | 无限 |
| 查看已缓存的 UPG | Yes | Yes | Yes | Yes |
| 进度追踪 | 基础（总数/正确率） | 完整（含趋势图+推荐） | 完整 | 完整 |
| 管理题库 | No | No | No | Yes |

## 5. 前端组件设计

### 5.1 页面级组件

| 组件 | 路径 | 描述 |
|------|------|------|
| `ApPrepLanding` | `ap-prep/page.tsx` | 考试选择入口，4 张卡片 + 备考统计 |
| `ExamOverview` | `ap-prep/[examSlug]/page.tsx` | Unit 列表 + 进度环 + 权重图 |
| `UnitQuestionList` | `ap-prep/[examSlug]/[unitSlug]/page.tsx` | 题目分页列表 + 筛选栏 |
| `QuestionWorkspace` | `ap-prep/[examSlug]/[unitSlug]/[questionId]/page.tsx` | 做题核心界面：左题目/右解析+UPG |
| `ApProgressDashboard` | `ap-prep/progress/page.tsx` | 进度仪表盘 |

### 5.2 业务组件（放在 `src/shared/blocks/ap-prep/`）

| 组件 | 文件 | 描述 |
|------|------|------|
| `ExamCard` | `exam-card.tsx` | 考试选择卡片（图标 + 标题 + 题量 + 进度条） |
| `UnitList` | `unit-list.tsx` | Unit 列表组件（带折叠、进度条、权重标签） |
| `QuestionCard` | `question-card.tsx` | 题目卡片（序号 + 难度徽章 + 类型标签 + 做题状态） |
| `QuestionStem` | `question-stem.tsx` | 题干渲染（支持 KaTeX 公式 + 图片） |
| `McqChoices` | `mcq-choices.tsx` | 选择题选项组（RadioGroup，提交后高亮正确/错误） |
| `FrqEditor` | `frq-editor.tsx` | 简答题编辑器（textarea + 公式输入辅助） |
| `ExplanationPanel` | `explanation-panel.tsx` | 文字解析面板（折叠式，支持 KaTeX） |
| `UpgVisualizer` | `upg-visualizer.tsx` | UPG 可视化解析区域（iframe 嵌入 + 加载状态 + 生成按钮） |
| `DifficultyBadge` | `difficulty-badge.tsx` | 难度标签（easy=绿/medium=黄/hard=红） |
| `AccuracyRing` | `accuracy-ring.tsx` | 正确率环形图（基于 recharts） |
| `WeakUnitRadar` | `weak-unit-radar.tsx` | 薄弱知识点雷达图 |
| `StudyHeatmap` | `study-heatmap.tsx` | 每日刷题热力图（GitHub 贡献图风格） |
| `ApQuestionNav` | `question-nav.tsx` | 题目导航条（上一题/下一题 + 跳转） |

### 5.3 复用现有组件

| 组件 | 来源 | 用途 |
|------|------|------|
| `Button` / `Badge` / `Card` / `Tabs` / `Progress` | `shared/components/ui/` | 基础 UI |
| `RadioGroup` / `Label` | `shared/components/ui/` | MCQ 选项 |
| `Select` | `shared/components/ui/` | 筛选器 |
| `Tooltip` | `shared/components/ui/` | 难度/考频提示 |
| UPG iframe sandbox | `shared/lib/upg/html-sanitizer.ts` | UPG 可视化渲染安全策略 |
| KaTeX 渲染 | 已有 `katex` 依赖 | 题目/解析中的数学公式 |
| recharts 图表 | 已有 `recharts` 依赖 | 进度统计图 |
| `useUpgGeneration` hook (新增) | `shared/hooks/use-upg-generation.ts` | 封装 UPG 生成 + 轮询 |

## 6. 技术方案关键决策

### 6.1 UPG 可视化策略：预生成 + 按需生成（推荐）

两种策略对比：

| 方案 | 优点 | 缺点 |
|------|------|------|
| A. 全部预生成 | 用户体验好（即时加载） | 题量大时 AI 成本高，维护成本大 |
| B. 全部按需生成 | 零前期成本 | 用户等 30-60 秒，体验差 |
| **C. 混合（推荐）** | 高频题预生成，长尾题按需生成 | 需要标记机制 |

**推荐方案 C**：
- 管理员在后台编辑题目时可点击 "Pre-generate UPG" 预生成缓存
- `apQuestion.upgGenerationId` 存储缓存的 UPG ID
- 前端加载题目时，如果有 `upgGenerationId` 且对应 `upgGeneration.status = 'completed'`，直接展示
- 没有缓存时，显示 "Generate Visualization" 按钮，用户点击后走标准 UPG 管线
- 新生成的 UPG 也会回写到 `apQuestion.upgGenerationId` 作为缓存

### 6.2 答案防作弊

- **API 层控制**：`GET /questions/[id]` 在用户未提交前不返回 `correctAnswer`、`explanationEn`、`explanationZh`
- 前端不在页面源码中暴露答案
- 答案判定在服务端完成（`POST /submit`），不依赖前端逻辑

### 6.3 积分消耗

AP Prep 的 UPG 生成复用现有积分体系：
- 查看已缓存的 UPG：**免费**（已经预生成过了）
- 触发新 UPG 生成：消耗 **UPG_CREDITS_PER_GENERATION（10 积分）**
- Free 用户每日 UPG 可视化限额：1 次（`ap-prep-upg` scene，复用 `upgDailyQuota` 表）

### 6.4 做题限额（Free 用户）

Free 用户每日可做 5 道 MCQ。实现方式：
- 复用 `upgDailyQuota` 表，`scene = 'ap-prep-attempt'`
- 每次提交答案时 `incrementDailyQuota`

## 7. 开发任务分解

### Phase 1: 数据基础（4 人天）

| # | 任务 | 工时 | 依赖 |
|---|------|------|------|
| 1.1 | 在 `schema.ts` 新增 5 张表定义 | 0.5d | 无 |
| 1.2 | 创建 5 个 model 文件（`src/shared/models/ap_*.ts`） | 1d | 1.1 |
| 1.3 | 运行 `db:generate` + `db:push` 验证迁移 | 0.5d | 1.2 |
| 1.4 | 编写种子数据脚本（`scripts/seed-ap-questions.ts`）：AP Physics 1 的 Unit 1-3 + 30 道示例题 | 2d | 1.3 |

### Phase 2: API 层（5 人天）

| # | 任务 | 工时 | 依赖 |
|---|------|------|------|
| 2.1 | 公共 API：`GET /exams`、`GET /exams/[slug]` | 0.5d | Phase 1 |
| 2.2 | 公共 API：`GET /questions` 列表（分页 + 筛选） | 1d | Phase 1 |
| 2.3 | 公共 API：`GET /questions/[id]`（防作弊逻辑） | 0.5d | Phase 1 |
| 2.4 | 公共 API：`POST /questions/[id]/submit`（判分 + 进度更新） | 1d | Phase 1 |
| 2.5 | 公共 API：`POST /questions/[id]/generate-upg`（UPG 生成 + 缓存回写） | 1d | Phase 1, UPG 管线 |
| 2.6 | 公共 API：`GET /progress` | 0.5d | 2.4 |
| 2.7 | Admin API：考试/单元/题目 CRUD + 批量导入 | 0.5d | Phase 1 |

### Phase 3: 前端页面（7 人天）

| # | 任务 | 工时 | 依赖 |
|---|------|------|------|
| 3.1 | AP Prep Landing（考试选择页） | 0.5d | 2.1 |
| 3.2 | ExamOverview（Unit 列表 + 进度） | 1d | 2.1, 2.6 |
| 3.3 | UnitQuestionList（题目列表 + 筛选） | 1d | 2.2 |
| 3.4 | QuestionWorkspace：题干 + MCQ 选项 + 提交 | 1.5d | 2.3, 2.4 |
| 3.5 | QuestionWorkspace：解析面板 + UPG 可视化嵌入 | 1.5d | 2.5 |
| 3.6 | ApProgressDashboard：图表 + 热力图 | 1d | 2.6 |
| 3.7 | i18n 翻译（en + zh） | 0.5d | 3.1-3.6 |

### Phase 4: Admin 后台（3 人天）

| # | 任务 | 工时 | 依赖 |
|---|------|------|------|
| 4.1 | 考试/Unit 管理页面 | 1d | 2.7 |
| 4.2 | 题目管理列表 + 编辑表单 | 1.5d | 2.7 |
| 4.3 | 批量导入 UI + UPG 预生成按钮 | 0.5d | 2.7 |

### Phase 5: 测试 + 打磨（3 人天）

| # | 任务 | 工时 | 依赖 |
|---|------|------|------|
| 5.1 | Model 层单元测试 | 1d | Phase 2 |
| 5.2 | API 集成测试（判分逻辑、防作弊、限额） | 1d | Phase 2 |
| 5.3 | E2E 测试（做题完整流程） | 0.5d | Phase 3 |
| 5.4 | 移动端适配 + 性能优化 | 0.5d | Phase 3 |

### 总工时

| Phase | 工时 | 累计 |
|-------|------|------|
| Phase 1: 数据基础 | 4d | 4d |
| Phase 2: API 层 | 5d | 9d |
| Phase 3: 前端页面 | 7d | 16d |
| Phase 4: Admin 后台 | 3d | 19d |
| Phase 5: 测试打磨 | 3d | **22d** |

**总计：22 人天（约 4.5 周，单人全职）**

## 8. 技术风险与缓解

| 风险 | 级别 | 缓解策略 |
|------|------|----------|
| 题目内容版权 | 🔴高 | 只使用原创题或改编题（标记 `source: 'original' / 'adapted'`），不使用 College Board 原题。法律顾问审查 |
| UPG 生成成本失控 | 🟡中 | 混合策略（预生成高频题）+ Free 用户限额 1次/天 + 缓存命中率监控 |
| 题库冷启动（内容不足） | 🟡中 | Phase 1 先做 AP Physics 1（最大考生群体），30 道种子题上线。后续用 AI 辅助生成题目草稿 + 人工审核 |
| KaTeX 公式渲染性能 | 🟢低 | 已有 katex 依赖，题目级别的公式量小，不构成瓶颈 |
| Free 用户做题限额绕过 | 🟢低 | 复用 `upgDailyQuota` 表 + 服务端校验，前端仅做 UI 提示 |

## 9. 测试策略

### Unit Tests（Vitest）
- `ap_question` model CRUD
- `ap_attempt` 判分逻辑（MCQ 正确/错误）
- `ap_user_progress` 聚合计算
- 防作弊逻辑（未提交时不返回答案）
- 每日限额计数

### Integration Tests
- 完整做题流程：获取题目 → 提交答案 → 验证返回解析 → 验证进度更新
- UPG 生成 + 缓存回写
- 权限验证（Free/Pro 配额差异）

### E2E Tests（Playwright）
- 考试选择 → Unit 浏览 → 做题 → 查看解析 → 查看 UPG 完整链路

## 10. 未来扩展方向（不在本期范围）

1. **模拟考试模式** — 定时 50 题 MCQ，模拟真实 AP 考试环境
2. **FRQ 自动评分** — 接入 AI 对简答题进行评分（需要 rubric 模板）
3. **智能推题** — 根据用户薄弱知识点，优先推荐相关题目
4. **班级模式** — 教师创建班级，分配作业题目，查看班级统计
5. **AP Physics 2 / C 扩展** — 数据模型已支持多考试类型，内容填充即可
