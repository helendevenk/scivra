# 学习路径（Learning Path）设计文档

> 日期：2026-02-24
> 状态：待实现
> 预估开发量：5-6 天
> 依赖：UPG Gallery 模块、实验增强模块

## 1. 定位与核心价值

将零散的实验和可视化串成结构化学习路线，一条路径 = 一个主题的 5-10 个节点，按顺序推进。

- **对用户**：从"随便逛逛"变成"系统学习"，留存理由从好奇心变成学习目标
- **对 SEO**：每条路径是高价值落地页，如 "/learn/classical-mechanics"
- **对变现**：免费用户只能走前 3 个节点，后续付费解锁。天然付费墙位置

**第一版范围（YAGNI）**：
- 路径由管理员手动创建（从实验 + Gallery 内容中编排）
- 不做 AI 自动生成路径
- 不做用户自建路径
- 测验题用简单单选题

## 2. 数据模型

### learning_path（学习路径）

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| id | UUID | 自动 | 主键 |
| slug | TEXT | - | URL 标识，如 "classical-mechanics" |
| title_en | TEXT | - | 英文标题 |
| title_zh | TEXT | - | 中文标题 |
| description_en | TEXT | - | 英文简介 |
| description_zh | TEXT | - | 中文简介 |
| category | TEXT | - | 学科分类（复用实验分类枚举） |
| level | TEXT | - | beginner / intermediate / advanced |
| cover_image | TEXT | null | 封面图 URL |
| is_published | BOOLEAN | false | 是否发布 |
| node_count | INTEGER | 0 | 节点总数（冗余） |
| created_at | TIMESTAMP | now | - |
| updated_at | TIMESTAMP | now | - |

### learning_path_node（路径节点）

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| id | UUID | 自动 | 主键 |
| path_id | UUID | - | 外键 → learning_path |
| order_index | INTEGER | - | 节点顺序（从 1 开始） |
| title_en | TEXT | - | 英文标题 |
| title_zh | TEXT | - | 中文标题 |
| description_en | TEXT | - | 知识说明英文（200 字内） |
| description_zh | TEXT | - | 知识说明中文 |
| generation_id | UUID | null | 关联 UPG 可视化（二选一） |
| experiment_slug | TEXT | null | 关联手工实验（二选一） |
| quiz_question | JSONB | - | 测验题结构 |
| created_at | TIMESTAMP | now | - |

**DB 约束**（generation_id 与 experiment_slug 必须且仅能有一个非空）：
```sql
CHECK (
  (generation_id IS NOT NULL AND experiment_slug IS NULL)
  OR (generation_id IS NULL AND experiment_slug IS NOT NULL)
)
```

quiz_question 结构：
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

### learning_path_progress（用户进度）

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| id | UUID | 自动 | 主键 |
| user_id | TEXT | - | 外键 → user |
| path_id | UUID | - | 外键 → learning_path |
| current_node | INTEGER | 0 | 已完成的最大 order_index |
| completed | BOOLEAN | false | 全部完成标记 |
| started_at | TIMESTAMP | now | - |
| updated_at | TIMESTAMP | now | - |

唯一约束：`UNIQUE(user_id, path_id)`

## 3. 路由设计

```
/learn                  学习路径列表页（公开）
/learn/[slug]           路径详情页（公开，SEO 落地页）
/learn/[slug]/[node]    节点学习页（前 3 节公开，后续需登录+付费）
/admin/learning-paths   Admin 路径管理
```

## 4. 页面结构

### 列表页 `/learn`

- 卡片网格：封面图 + 标题 + 学科标签 + 难度标签 + 节点数 + 进度条（已登录）
- 筛选：学科 + 难度

### 路径详情页 `/learn/[slug]`

- 顶部：标题 + 简介 + 标签 + "开始学习"按钮
- 主体：纵向时间线节点列表
- 节点状态：已完成 ✓ / 当前 → / 锁定 🔒

### 节点学习页 `/learn/[slug]/[node]`

- 上：可视化区域（iframe 嵌入 UPG 或跳转手工实验）
- 中：知识说明文字
- 下：测验题（单选，提交后无论对错都显示"下一节"按钮）
- 底部导航：上一节 / 下一节
- **答错也可前进**：测验目的是巩固理解而非考试，答错时显示正确答案 + 解释，"下一节"按钮仍然出现

### 付费墙位置

- 第 3 → 第 4 节点之间
- 未登录：显示登录引导
- 免费用户：显示升级引导，触发 payment-modal
- 付费用户：直接渲染

## 5. API 设计

### 公开端点

| 方法 | 端点 | 说明 |
|---|---|---|
| GET | /api/learn | 路径列表（含用户进度） |
| GET | /api/learn/[slug] | 路径详情 + 节点列表 + 进度 |
| GET | /api/learn/[slug]/[node] | 节点内容（付费墙校验） |
| POST | /api/learn/[slug]/[node]/complete | 完成节点（提交测验答案） |

### 完成节点逻辑

- 提交 `{ answer_index: 2 }`
- 校验答案，返回 `{ correct: true/false, explanation: "..." }`
- **无论答对答错都推进进度**：`current_node + 1`，最后一个节点则 `completed = true`
- 答错时返回正确答案 + 解释，但不阻塞前进

### Admin 端点

| 方法 | 端点 | 说明 |
|---|---|---|
| GET | /api/admin/learning-paths | 路径管理列表 |
| POST | /api/admin/learning-paths | 创建路径 |
| PATCH | /api/admin/learning-paths/[id] | 编辑路径 |
| DELETE | /api/admin/learning-paths/[id] | 删除路径 |
| POST | /api/admin/learning-paths/[id]/nodes | 添加节点 |
| PATCH | /api/admin/learning-paths/[id]/nodes/[nodeId] | 编辑节点 |
| DELETE | /api/admin/learning-paths/[id]/nodes/[nodeId] | 删除节点 |

## 6. 前端组件架构

```
src/shared/blocks/learn/
├── PathList.tsx           路径列表卡片网格
├── PathCard.tsx           单张路径卡片
├── PathDetail.tsx         路径详情页（时间线）
├── PathNode.tsx           时间线单个节点
├── NodePage.tsx           节点学习页主容器
├── NodeVisualization.tsx  可视化区域
├── NodeQuiz.tsx           测验题组件
└── PaywallGate.tsx        付费墙拦截组件
```
