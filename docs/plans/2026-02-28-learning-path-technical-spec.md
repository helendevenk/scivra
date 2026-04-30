---
name: learning-path-technical-spec
status: historical-plan
snapshot_date: '2026-02-28'
created: '2026-02-28T00:00:00Z'
updated: '2026-04-23T00:00:00Z'
---

> **Historical document — not current SSOT.**
> This file is a point-in-time plan from 2026-02-28. It may describe goals, intermediate counts, or decisions that no longer match the current repository. Verify anything you rely on against `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`, or the source tree.

# Learning Path 模块 -- 完整技术实现方案

> 日期：2026-02-28
> 状态：技术规划完成，待开发
> 对应任务：T006, T011, T241-T250
> 依赖：Gallery 模块（已实现）、Experiment 模块（已实现）
> 预估总工时：~20h

---

## 1. 概述

### 1.1 模块定位

将零散的 UPG 可视化和手工实验串成结构化学习路线。一条路径 = 一个主题的 5-10 个节点，按顺序推进。

核心价值：
- 用户侧：从"随便逛"变成"系统学"，留存理由从好奇心升级为学习目标
- SEO 侧：每条路径是高价值落地页（`/learn/classical-mechanics`）
- 变现侧：前 3 节免费，第 4 节起付费墙拦截，天然转化位置

### 1.2 V1 范围（YAGNI 原则）

做：
- 管理员手动创建路径（从实验 + Gallery 内容中编排）
- 单选测验题（答错也可前进）
- 付费墙（第 4 节起）
- 用户进度追踪
- i18n 双语（en/zh）

不做：
- AI 自动生成路径
- 用户自建路径
- 复杂题型（多选、填空）
- 路径评分/评论

### 1.3 架构影响

```
新增 3 张表：learning_path, learning_path_node, learning_path_progress
新增 1 个 model 文件：src/shared/models/learning_path.ts
新增 4 个公开 API route + 7 个 Admin API route
新增 4 个前台页面 + 1 个 Admin 页面
新增 8 个前端组件
```

---

## 2. 数据库 Schema 设计

### 2.1 learning_path（学习路径主表）

遵循项目现有模式：text 主键 + UUID、timestamp 时间戳、Drizzle pgTable 定义。

```typescript
// 文件：src/config/db/schema.ts（追加）

export const learningPath = pgTable(
  'learning_path',
  {
    id: text('id').primaryKey(),                          // UUID
    slug: text('slug').unique().notNull(),                 // URL 标识，如 "classical-mechanics"
    titleEn: text('title_en').notNull(),                   // 英文标题
    titleZh: text('title_zh').notNull(),                   // 中文标题
    descriptionEn: text('description_en').notNull(),       // 英文简介
    descriptionZh: text('description_zh').notNull(),       // 中文简介
    category: text('category').notNull(),                  // 学科分类，复用实验分类枚举
    level: text('level').notNull(),                        // beginner / intermediate / advanced
    coverImage: text('cover_image'),                       // 封面图 URL
    isPublished: boolean('is_published').default(false),   // 是否发布
    nodeCount: integer('node_count').default(0),           // 节点总数（冗余，Admin 写入时同步）
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    // 列表页查询：已发布路径按分类筛选
    index('idx_learning_path_published_category').on(
      table.isPublished,
      table.category
    ),
    // slug 查询（unique 已自带索引，但显式声明便于文档化）
  ]
);
```

字段决策说明：
- `slug` 用 unique 约束，SEO 友好的 URL 标识
- `titleEn/titleZh` 分字段而非 JSONB，因为查询时经常只需要一种语言，分字段更高效
- `nodeCount` 冗余字段，避免每次列表查询都 COUNT 子表。Admin 增删节点时同步更新
- 不加 `deletedAt` 软删除 -- V1 路径由管理员管理，直接硬删除即可，简单就是好

### 2.2 learning_path_node（路径节点表）

```typescript
export const learningPathNode = pgTable(
  'learning_path_node',
  {
    id: text('id').primaryKey(),                           // UUID
    pathId: text('path_id')
      .notNull()
      .references(() => learningPath.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull(),          // 节点顺序，从 1 开始
    titleEn: text('title_en').notNull(),
    titleZh: text('title_zh').notNull(),
    descriptionEn: text('description_en').notNull(),       // 知识说明英文（200 字内）
    descriptionZh: text('description_zh').notNull(),       // 知识说明中文
    generationId: text('generation_id'),                   // 关联 UPG 可视化（二选一）
    experimentSlug: text('experiment_slug'),                // 关联手工实验（二选一）
    quizQuestion: text('quiz_question').notNull(),         // JSON string，测验题结构
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    // CTO 要求：(path_id, order_index) 唯一约束
    unique('uq_learning_path_node_path_order').on(
      table.pathId,
      table.orderIndex
    ),
    // 按路径查询节点列表
    index('idx_learning_path_node_path_order').on(
      table.pathId,
      table.orderIndex
    ),
  ]
);
```

字段决策说明：
- `generationId` 和 `experimentSlug` 互斥约束用 CHECK 实现（见下方迁移 SQL）
- `quizQuestion` 用 `text` 存 JSON string 而非 `jsonb`，与项目现有模式一致（如 `chat.parts`、`credit.consumedDetail` 都是 text 存 JSON）
- `orderIndex` 从 1 开始，与用户可见的"第 N 节"对齐

quiz_question JSON 结构：
```json
{
  "question_en": "What happens when...",
  "question_zh": "当...会发生什么？",
  "options": [
    {"en": "Option A", "zh": "选项 A"},
    {"en": "Option B", "zh": "选项 B"},
    {"en": "Option C", "zh": "选项 C"},
    {"en": "Option D", "zh": "选项 D"}
  ],
  "correct_index": 0,
  "explanation_en": "Because...",
  "explanation_zh": "因为..."
}
```

### 2.3 learning_path_progress（用户进度表）

```typescript
export const learningPathProgress = pgTable(
  'learning_path_progress',
  {
    id: text('id').primaryKey(),                           // UUID
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    pathId: text('path_id')
      .notNull()
      .references(() => learningPath.id, { onDelete: 'cascade' }),
    currentNode: integer('current_node').default(0),       // 已完成的最大 order_index
    completed: boolean('completed').default(false),        // 全部完成标记
    startedAt: timestamp('started_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    // 一个用户对一条路径只有一条进度记录
    unique('uq_learning_path_progress_user_path').on(
      table.userId,
      table.pathId
    ),
    // 查询用户所有路径进度
    index('idx_learning_path_progress_user').on(table.userId),
  ]
);
```

字段决策说明：
- `currentNode` 存已完成的最大 `orderIndex`，0 表示尚未完成任何节点
- 用 unique 约束保证一个用户对一条路径只有一条进度记录
- `completed` 冗余字段，避免每次都比较 `currentNode >= nodeCount`

### 2.4 迁移 SQL 补丁（手工修正）

Drizzle 生成的迁移需要手工追加 CHECK 约束：

```sql
-- 在 learning_path_node 表创建后追加
ALTER TABLE learning_path_node
ADD CONSTRAINT chk_node_content_source CHECK (
  (generation_id IS NOT NULL AND experiment_slug IS NULL)
  OR (generation_id IS NULL AND experiment_slug IS NOT NULL)
);
```

### 2.5 索引总结

| 表 | 索引 | 用途 |
|---|---|---|
| learning_path | `UNIQUE(slug)` | slug 查询 + SEO 路由 |
| learning_path | `(is_published, category)` | 列表页筛选 |
| learning_path_node | `UNIQUE(path_id, order_index)` | 顺序唯一性（CTO 要求） |
| learning_path_node | `(path_id, order_index)` | 节点列表查询 |
| learning_path_progress | `UNIQUE(user_id, path_id)` | 进度唯一性 |
| learning_path_progress | `(user_id)` | 用户进度列表 |

---

## 3. Model 层设计

### 3.1 文件：`src/shared/models/learning_path.ts`

遵循项目现有模式：
- 从 `@/core/db` 导入 `db()`
- 从 `@/config/db/schema` 导入表定义
- 用 `getUuid()` 生成主键
- 函数式导出，不用 class
- 类型从 schema `$inferSelect` / `$inferInsert` 推导

```typescript
// ─── 类型定义 ───

export type LearningPath = typeof learningPath.$inferSelect;
export type NewLearningPath = typeof learningPath.$inferInsert;
export type UpdateLearningPath = Partial<Omit<NewLearningPath, 'id' | 'createdAt'>>;

export type LearningPathNode = typeof learningPathNode.$inferSelect;
export type NewLearningPathNode = typeof learningPathNode.$inferInsert;

export type LearningPathProgress = typeof learningPathProgress.$inferSelect;

// quiz_question 的 TypeScript 类型
export interface QuizQuestion {
  question_en: string;
  question_zh: string;
  options: { en: string; zh: string }[];
  correct_index: number;
  explanation_en: string;
  explanation_zh: string;
}
```

### 3.2 函数清单

#### 路径 CRUD（Admin 用）

| 函数 | 签名 | 说明 |
|---|---|---|
| `createLearningPath` | `(data: NewLearningPath) => Promise<LearningPath>` | 创建路径，id 用 getUuid() |
| `updateLearningPath` | `(id: string, data: UpdateLearningPath) => Promise<LearningPath>` | 更新路径 |
| `deleteLearningPath` | `(id: string) => Promise<void>` | 硬删除路径（cascade 删节点和进度） |
| `findLearningPathById` | `(id: string) => Promise<LearningPath \| undefined>` | 按 ID 查路径 |
| `findLearningPathBySlug` | `(slug: string) => Promise<LearningPath \| undefined>` | 按 slug 查路径 |
| `getAdminLearningPaths` | `() => Promise<LearningPath[]>` | Admin 列表，含未发布，按 createdAt desc |

#### 路径查询（公开）

| 函数 | 签名 | 说明 |
|---|---|---|
| `getPublishedPaths` | `(params: { category?: string; level?: string }) => Promise<LearningPath[]>` | 已发布路径列表，支持分类和难度筛选 |
| `getPublishedPathBySlug` | `(slug: string) => Promise<LearningPath \| undefined>` | 按 slug 查已发布路径 |

#### 节点 CRUD（Admin 用）

| 函数 | 签名 | 说明 |
|---|---|---|
| `createNode` | `(data: NewLearningPathNode) => Promise<LearningPathNode>` | 创建节点，同时 nodeCount+1 |
| `updateNode` | `(id: string, data: Partial<NewLearningPathNode>) => Promise<LearningPathNode>` | 更新节点 |
| `deleteNode` | `(id: string) => Promise<void>` | 删除节点，同时 nodeCount-1，重排 orderIndex |
| `reorderNodes` | `(pathId: string, nodeIds: string[]) => Promise<void>` | 批量重排节点顺序 |

关键实现细节 -- `deleteNode`：
```typescript
// 伪代码：删除节点后重排
async function deleteNode(id: string) {
  return await db().transaction(async (tx) => {
    // 1. 查出要删除的节点
    const node = await tx.select().from(learningPathNode)
      .where(eq(learningPathNode.id, id));
    if (!node[0]) return;

    // 2. 删除节点
    await tx.delete(learningPathNode).where(eq(learningPathNode.id, id));

    // 3. 后续节点 orderIndex - 1
    await tx.execute(sql`
      UPDATE learning_path_node
      SET order_index = order_index - 1
      WHERE path_id = ${node[0].pathId}
        AND order_index > ${node[0].orderIndex}
    `);

    // 4. 更新路径 nodeCount
    await tx.update(learningPath)
      .set({ nodeCount: sql`GREATEST(${learningPath.nodeCount} - 1, 0)` })
      .where(eq(learningPath.id, node[0].pathId));
  });
}
```

#### 节点查询（公开）

| 函数 | 签名 | 说明 |
|---|---|---|
| `getNodesByPathId` | `(pathId: string) => Promise<LearningPathNode[]>` | 按 orderIndex 升序返回路径所有节点 |
| `getNodeByPathAndOrder` | `(pathId: string, orderIndex: number) => Promise<LearningPathNode \| undefined>` | 查单个节点 |

#### 进度管理

| 函数 | 签名 | 说明 |
|---|---|---|
| `getOrCreateProgress` | `(userId: string, pathId: string) => Promise<LearningPathProgress>` | 获取或创建进度记录（upsert 模式） |
| `advanceProgress` | `(userId: string, pathId: string, completedOrderIndex: number, totalNodes: number) => Promise<LearningPathProgress>` | 推进进度，如果是最后一个节点则标记 completed |
| `getUserProgressForPaths` | `(userId: string, pathIds: string[]) => Promise<Map<string, LearningPathProgress>>` | 批量查询用户对多条路径的进度（列表页用） |
| `getUserCompletedPathCount` | `(userId: string) => Promise<number>` | 用户已完成路径数（Dashboard 用） |

关键实现细节 -- `advanceProgress`：
```typescript
async function advanceProgress(
  userId: string,
  pathId: string,
  completedOrderIndex: number,
  totalNodes: number
) {
  const isCompleted = completedOrderIndex >= totalNodes;

  // Upsert: 只在 completedOrderIndex > currentNode 时更新（防止重复提交回退）
  const [result] = await db()
    .insert(learningPathProgress)
    .values({
      id: getUuid(),
      userId,
      pathId,
      currentNode: completedOrderIndex,
      completed: isCompleted,
    })
    .onConflictDoUpdate({
      target: [learningPathProgress.userId, learningPathProgress.pathId],
      set: {
        currentNode: sql`GREATEST(${learningPathProgress.currentNode}, ${completedOrderIndex})`,
        completed: isCompleted ? sql`true` : learningPathProgress.completed,
      },
    })
    .returning();

  return result;
}
```

#### 付费墙辅助

| 函数 | 签名 | 说明 |
|---|---|---|
| `checkNodeAccess` | `(orderIndex: number, user: User \| null) => Promise<{ allowed: boolean; reason?: string }>` | 判断节点是否可访问 |

```typescript
// 付费墙逻辑
const FREE_NODE_LIMIT = 3;

async function checkNodeAccess(
  orderIndex: number,
  user: User | null
): Promise<{ allowed: boolean; reason?: 'login_required' | 'subscription_required' }> {
  // 前 3 节免费
  if (orderIndex <= FREE_NODE_LIMIT) {
    return { allowed: true };
  }

  // 第 4 节起需要登录
  if (!user) {
    return { allowed: false, reason: 'login_required' };
  }

  // 检查订阅状态（复用现有 getCurrentSubscription）
  const sub = await getCurrentSubscription(user.id);
  if (sub) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'subscription_required' };
}
```

---

## 4. API Routes 设计

遵循项目现有模式：
- 响应格式：`respJson(code, message, data)` / `respData()` / `respOk()` / `respErr()`
- 认证：`getAuth()` 获取当前用户
- Admin 鉴权：检查 `user.isAdmin` 或 RBAC permission
- 路由文件位置：`src/app/api/` 下按资源分目录

### 4.1 公开 API（4 个）

#### GET `/api/learning-paths`
路径列表页。

```
文件：src/app/api/learning-paths/route.ts

Query Params:
  category?: string    // 学科分类筛选
  level?: string       // 难度筛选

Response: respData({
  paths: LearningPath[],
  progress?: Map<pathId, LearningPathProgress>  // 已登录用户附带进度
})

逻辑：
1. getPublishedPaths({ category, level })
2. 如果用户已登录，getUserProgressForPaths(userId, pathIds)
3. 合并返回
```

#### GET `/api/learning-paths/[slug]`
路径详情 + 节点列表。

```
文件：src/app/api/learning-paths/[slug]/route.ts

Response: respData({
  path: LearningPath,
  nodes: LearningPathNode[],       // 全部节点元数据（不含 quiz 答案）
  progress?: LearningPathProgress  // 已登录用户的进度
})

逻辑：
1. getPublishedPathBySlug(slug)
2. getNodesByPathId(path.id)
3. 对每个节点：如果 orderIndex > FREE_NODE_LIMIT 且用户无权限，
   则 strip 掉 quizQuestion 和 descriptionEn/Zh（只保留 title 和锁定标记）
4. 如果用户已登录，getOrCreateProgress(userId, path.id)
```

重要安全细节：
- 付费节点的 `quizQuestion` 中包含 `correct_index`，必须在服务端 strip
- 返回时给每个节点附加 `locked: boolean` 字段，前端据此渲染锁定 UI

#### GET `/api/learning-paths/[slug]/nodes/[orderIndex]`
单个节点完整内容（含 quiz，但不含答案）。

```
文件：src/app/api/learning-paths/[slug]/nodes/[orderIndex]/route.ts

Response: respData({
  node: LearningPathNode (quiz 不含 correct_index 和 explanation),
  locked: boolean,
  lockReason?: 'login_required' | 'subscription_required'
})

逻辑：
1. 查路径 + 查节点
2. checkNodeAccess(orderIndex, user)
3. 如果 locked，返回 locked: true + lockReason，不返回节点内容
4. 如果 allowed，返回节点内容，但 quiz 中 strip 掉 correct_index 和 explanation
```

#### POST `/api/learning-paths/[slug]/nodes/[orderIndex]/submit`
提交测验答案。

```
文件：src/app/api/learning-paths/[slug]/nodes/[orderIndex]/submit/route.ts

Request Body: { answer: number }  // 用户选择的选项 index

Response: respData({
  correct: boolean,
  correctIndex: number,
  explanation: string,       // 根据 locale 返回对应语言
  progress: LearningPathProgress
})

逻辑：
1. 认证检查（必须登录）
2. checkNodeAccess(orderIndex, user) -- 防止绕过付费墙直接提交
3. 查节点，解析 quizQuestion JSON
4. 比对 answer === correct_index
5. 无论对错都 advanceProgress(userId, pathId, orderIndex, path.nodeCount)
6. 返回结果 + 解释 + 更新后的进度
```

### 4.2 Admin API（7 个）

所有 Admin API 统一前缀 `/api/admin/learning-paths`，统一鉴权。

#### 路径管理

| 方法 | 路由 | 说明 |
|---|---|---|
| GET | `/api/admin/learning-paths` | 获取所有路径（含未发布） |
| POST | `/api/admin/learning-paths` | 创建路径 |
| PUT | `/api/admin/learning-paths/[id]` | 更新路径（含发布/取消发布） |
| DELETE | `/api/admin/learning-paths/[id]` | 删除路径 |

#### 节点管理

| 方法 | 路由 | 说明 |
|---|---|---|
| POST | `/api/admin/learning-paths/[id]/nodes` | 添加节点 |
| PUT | `/api/admin/learning-paths/[id]/nodes/[nodeId]` | 更新节点 |
| DELETE | `/api/admin/learning-paths/[id]/nodes/[nodeId]` | 删除节点 |

Admin POST 创建路径的 Request Body：
```typescript
{
  slug: string;           // 必填，URL 标识
  titleEn: string;        // 必填
  titleZh: string;        // 必填
  descriptionEn: string;  // 必填
  descriptionZh: string;  // 必填
  category: string;       // 必填
  level: string;          // 必填，beginner/intermediate/advanced
  coverImage?: string;    // 可选
  isPublished?: boolean;  // 可选，默认 false
}
```

Admin POST 创建节点的 Request Body：
```typescript
{
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  generationId?: string;     // 二选一
  experimentSlug?: string;   // 二选一
  quizQuestion: QuizQuestion;
  orderIndex?: number;       // 可选，不传则追加到末尾
}
```

### 4.3 API 安全要点

1. 公开 API 的付费节点：服务端 strip quiz 答案，不依赖前端隐藏
2. Submit API：二次校验 `checkNodeAccess`，防止 curl 绕过
3. Admin API：统一用现有 RBAC 中间件鉴权
4. slug 校验：只允许 `[a-z0-9-]`，最长 100 字符
5. quiz answer 校验：`answer` 必须是 0-3 的整数

---

## 5. 前端页面设计

### 5.1 页面路由

| 路由 | 文件 | 说明 | SSR/CSR |
|---|---|---|---|
| `/learn` | `src/app/(public)/learn/page.tsx` | 路径列表页 | SSR（SEO） |
| `/learn/[slug]` | `src/app/(public)/learn/[slug]/page.tsx` | 路径详情页（节点列表 + 进度条） | SSR + CSR hydrate |
| `/learn/[slug]/[nodeIndex]` | `src/app/(public)/learn/[slug]/[nodeIndex]/page.tsx` | 节点学习页（内容 + quiz） | CSR（交互重） |
| `/dashboard/learning` | `src/app/(user)/dashboard/learning/page.tsx` | 用户学习进度总览 | CSR |
| `/admin/learning-paths` | `src/app/(admin)/admin/learning-paths/page.tsx` | Admin 路径管理 | CSR |

### 5.2 组件拆分

```
src/components/learning-path/
  PathCard.tsx              -- 路径卡片（列表页用），显示标题、分类、难度、进度条
  PathFilter.tsx            -- 分类 + 难度筛选栏
  NodeTimeline.tsx          -- 路径详情页的节点时间线/步骤条
  NodeContent.tsx           -- 节点学习内容区（嵌入 UPG 可视化或实验链接）
  QuizCard.tsx              -- 测验题卡片（选项、提交、结果反馈）
  PaywallOverlay.tsx        -- 付费墙遮罩（登录提示 / 订阅提示）
  ProgressBar.tsx           -- 进度条（复用或新建）
  LearningDashboard.tsx     -- Dashboard 学习进度面板
```

### 5.3 关键交互流程

#### 节点学习流程

```
用户进入 /learn/[slug]/[nodeIndex]
  |
  ├─ orderIndex <= 3 → 直接显示内容 + quiz
  |
  ├─ orderIndex > 3 且未登录 → PaywallOverlay (login_required)
  |     └─ 点击登录 → 跳转登录页，登录后回跳
  |
  ├─ orderIndex > 3 且已登录无订阅 → PaywallOverlay (subscription_required)
  |     └─ 显示订阅方案 + 跳转订阅页
  |
  └─ orderIndex > 3 且有订阅 → 直接显示内容 + quiz

用户答题：
  1. 选择选项 → 点击提交
  2. POST /api/.../submit { answer: N }
  3. 显示对/错 + 解释
  4. 无论对错，进度推进
  5. 显示"下一节"按钮 → 跳转下一个节点
  6. 如果是最后一节 → 显示"恭喜完成"+ 返回路径列表
```

#### 路径详情页的节点渲染逻辑

```
nodes.map(node => {
  if (node.orderIndex <= userProgress.currentNode) → 已完成（绿色勾）
  if (node.orderIndex === userProgress.currentNode + 1) → 当前节点（高亮，可点击）
  if (node.orderIndex > userProgress.currentNode + 1 && node.orderIndex <= 3) → 未解锁但免费（灰色，可点击）
  if (node.orderIndex > 3 && !hasSubscription) → 锁定（锁图标 + 付费提示）
})
```

注意：用户可以跳回已完成的节点复习，但不能跳过当前节点直接去后面的节点。V1 简化处理：免费节点（1-3）可以任意跳转，付费节点按顺序解锁。

### 5.4 SEO 考量

- `/learn` 列表页：SSR 渲染，`<title>` = "Learning Paths | NeonPhysics"
- `/learn/[slug]` 详情页：SSR 渲染，`<title>` = path.titleEn + " | NeonPhysics"
- 每条路径生成 `<meta description>` 用 path.descriptionEn
- 结构化数据：`Course` schema markup（JSON-LD）
- 节点页不做 SSR（交互为主，且付费内容不应被搜索引擎索引）

---

## 6. 开发任务分解

### Phase 1: 数据层（~5h）

| 任务 | 预估 | 依赖 | 验收标准 |
|---|---|---|---|
| T1: Schema 定义 + 迁移 | 1.5h | 无 | 3 张表创建成功，CHECK 约束生效，`drizzle-kit push` 通过 |
| T2: Model 层 -- 路径 CRUD | 1h | T1 | 所有路径 CRUD 函数可用，单元测试通过 |
| T3: Model 层 -- 节点 CRUD | 1.5h | T1 | 节点增删改查 + 重排逻辑正确，事务测试通过 |
| T4: Model 层 -- 进度管理 | 1h | T1 | upsert 进度、GREATEST 防回退、completed 标记正确 |

### Phase 2: API 层（~5h）

| 任务 | 预估 | 依赖 | 验收标准 |
|---|---|---|---|
| T5: 公开 API -- 列表 + 详情 | 1.5h | T2, T3 | GET 路径列表/详情返回正确，付费节点 strip 答案 |
| T6: 公开 API -- 节点 + 提交 | 2h | T3, T4 | 节点内容返回正确，submit 校验 + 进度推进正确 |
| T7: Admin API -- 路径管理 | 1h | T2 | CRUD 全流程，鉴权正确 |
| T8: Admin API -- 节点管理 | 0.5h | T3 | 增删改节点，nodeCount 同步 |

### Phase 3: 前端页面（~8h）

| 任务 | 预估 | 依赖 | 验收标准 |
|---|---|---|---|
| T9: 路径列表页 `/learn` | 1.5h | T5 | SSR 渲染，筛选功能，进度条显示 |
| T10: 路径详情页 `/learn/[slug]` | 2h | T5 | 节点时间线，进度状态，SEO meta |
| T11: 节点学习页 `/learn/[slug]/[nodeIndex]` | 2.5h | T6 | 内容展示 + quiz 交互 + 付费墙 + 进度推进 |
| T12: Dashboard 学习面板 | 1h | T4 | 进度总览，已完成/进行中路径 |
| T13: Admin 管理页 | 1h | T7, T8 | 路径 + 节点 CRUD 界面 |

### Phase 4: 收尾（~2h）

| 任务 | 预估 | 依赖 | 验收标准 |
|---|---|---|---|
| T14: SEO + JSON-LD | 0.5h | T9, T10 | Course schema markup，sitemap 更新 |
| T15: E2E 测试 | 1h | 全部 | 免费流程 + 付费墙拦截 + 答题流程 |
| T16: 代码审查 + 修复 | 0.5h | T15 | 代码风格一致，无 lint 错误 |

### 关键路径

```
T1 → T2 → T5 → T9
T1 → T3 → T6 → T11
T1 → T4 → T6 → T11
```

T11（节点学习页）是最复杂的单个任务，依赖最多，建议最后做。

---

## 7. 技术风险与缓解

### 7.1 风险清单

| 风险 | 概率 | 影响 | 缓解策略 |
|---|---|---|---|
| quiz 答案泄露（前端可见 correct_index） | 中 | 高 | 服务端 strip，submit API 才返回答案 |
| 节点重排并发冲突 | 低 | 中 | 事务 + unique 约束兜底，Admin 单人操作场景并发极低 |
| nodeCount 与实际节点数不一致 | 低 | 低 | 事务内同步更新；可加定时校验脚本 |
| 付费墙绕过（直接调 API） | 中 | 高 | submit API 二次校验 checkNodeAccess |
| UPG generation 被删除后节点引用失效 | 低 | 中 | 节点页做 null check，显示"内容已下架"提示 |

### 7.2 不做过度设计的决策记录

| 决策 | 理由 |
|---|---|
| 不用 JSONB 存 quiz | 项目现有模式是 text 存 JSON，保持一致 |
| 不做软删除 | Admin 管理的内容，硬删除足够，减少查询复杂度 |
| 不做节点级别的访问日志 | V1 不需要精细分析，进度表已够用 |
| 不做路径推荐算法 | V1 路径数量少（<20），列表页直接展示 |
| 不做答题统计（正确率等） | V1 答错也可前进，统计无实际用途 |

---

## 8. 文件清单总览

```
新增文件：
  src/config/db/schema.ts                                    -- 追加 3 张表定义
  src/shared/models/learning_path.ts                         -- Model 层（~200 行）
  src/app/api/learning-paths/route.ts                        -- 公开列表 API
  src/app/api/learning-paths/[slug]/route.ts                 -- 公开详情 API
  src/app/api/learning-paths/[slug]/nodes/[orderIndex]/route.ts      -- 节点内容 API
  src/app/api/learning-paths/[slug]/nodes/[orderIndex]/submit/route.ts -- 答题提交 API
  src/app/api/admin/learning-paths/route.ts                  -- Admin 路径列表 + 创建
  src/app/api/admin/learning-paths/[id]/route.ts             -- Admin 路径更新 + 删除
  src/app/api/admin/learning-paths/[id]/nodes/route.ts       -- Admin 节点创建
  src/app/api/admin/learning-paths/[id]/nodes/[nodeId]/route.ts -- Admin 节点更新 + 删除
  src/app/(public)/learn/page.tsx                            -- 路径列表页
  src/app/(public)/learn/[slug]/page.tsx                     -- 路径详情页
  src/app/(public)/learn/[slug]/[nodeIndex]/page.tsx         -- 节点学习页
  src/app/(user)/dashboard/learning/page.tsx                 -- Dashboard 学习面板
  src/app/(admin)/admin/learning-paths/page.tsx              -- Admin 管理页
  src/components/learning-path/PathCard.tsx
  src/components/learning-path/PathFilter.tsx
  src/components/learning-path/NodeTimeline.tsx
  src/components/learning-path/NodeContent.tsx
  src/components/learning-path/QuizCard.tsx
  src/components/learning-path/PaywallOverlay.tsx
  src/components/learning-path/ProgressBar.tsx
  src/components/learning-path/LearningDashboard.tsx

修改文件：
  src/config/db/schema.ts                                    -- 追加表定义
  src/app/(user)/dashboard/page.tsx                          -- 追加学习进度入口
```

---

## 9. 与现有模块的集成点

| 集成点 | 现有模块 | 集成方式 |
|---|---|---|
| 付费墙 | `subscription` model | 复用 `getCurrentSubscription()` 判断订阅状态 |
| UPG 可视化嵌入 | `upg_generation` model | 节点通过 `generationId` 关联，前端嵌入 UPG 渲染组件 |
| 手工实验链接 | experiments 页面 | 节点通过 `experimentSlug` 关联，前端跳转实验页 |
| 用户认证 | `getAuth()` | 所有需要登录的 API 统一用 `getAuth()` |
| Dashboard | 现有 Dashboard | 追加学习进度面板，复用 Dashboard 布局 |
| ID 生成 | `hash.ts` | 用 `getUuid()` 生成主键 |

