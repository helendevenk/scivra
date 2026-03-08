# AI 导师对话设计文档

> 日期：2026-02-24
> 状态：待实现
> 预估开发量：2-3 天
> 依赖：最小后端改动（新增 tutor 专用端点）

## 1. 定位与场景

不是替代现有 `/chat` 通用聊天，而是在特定场景下提供上下文感知的物理辅导。

核心场景：用户正在看可视化或做实验，看不懂某个现象，需要一个知道当前内容的 AI 导师即时解答。

### 与通用聊天的区别

| | 通用聊天 /chat | AI 导师 |
|---|---|---|
| 入口 | 独立页面 | 嵌入在可视化/实验/学习路径页面侧边 |
| 上下文 | 无 | 自动注入当前内容的 prompt、标签、知识点 |
| 定位 | 通用问答 | 物理教学辅导 |
| UI | 全屏聊天界面 | 侧边抽屉，不离开当前页面 |

### 触发位置

- `/gallery/[id]` 详情页：右下角 "Ask AI Tutor" 浮动按钮
- `/learn/[slug]/[node]` 节点页：测验题旁 "Need a hint?" 按钮
- `/experiments/[slug]` 实验页：侧边 "Ask about this experiment" 按钮

### 不做什么

- 不做独立导师页面
- 不做语音交互
- 不做多轮记忆跨页面（每个页面对话独立，关闭即清空）

## 2. System Prompt 模板

```
你是 NeonPhysics AI 导师，一位耐心、专业的物理教学助手。

当前用户正在查看的内容：
- 主题：{generation.prompt 或 experiment.title}
- 学科：{tags 或 category}
- 难度：{level，如果有}

你的职责：
1. 用简洁易懂的语言解释物理概念
2. 结合当前可视化内容回答问题
3. 引导用户思考，而非直接给答案
4. 适当使用公式（LaTeX 格式）辅助说明

限制：
- 只回答与当前内容相关的物理/科学问题
- 不回答与学习无关的问题
- 回答控制在 200 字以内，简洁为主
```

## 3. 前端组件架构

```
src/shared/blocks/tutor/
├── TutorDrawer.tsx       侧边抽屉容器（右侧滑出，宽度 380px）
├── TutorMessages.tsx     消息列表（复用现有聊天消息样式）
├── TutorInput.tsx        输入框（精简版，无文件上传）
└── TutorTrigger.tsx      触发按钮（浮动按钮，适配不同页面）
```

### TutorDrawer 行为

- 右侧滑出抽屉，不遮挡可视化主体
- 桌面端：抽屉和主内容并排，主内容自动收窄
- 移动端：抽屉覆盖全屏，顶部关闭按钮
- 关闭时对话清空，不持久化
- 预置 2-3 个快捷问题按钮：
  - "这个现象的原理是什么？"
  - "能用更简单的话解释吗？"
  - "有哪些相关的物理公式？"

## 4. API 调用

### ~~原方案（已废弃）~~

~~直接调用现有 `POST /api/chat`，零后端改动。~~

**废弃原因**：现有 `/api/chat` 强依赖 `chatId` 且会落库消息（`route.ts:27,41,83,121`），不支持无状态调用，也未处理 `systemPrompt` 参数。

### 新方案：新增 `POST /api/tutor/chat`

轻量端点，只做流式对话，不落库：

- 请求 body：`{ messages: Message[], systemPrompt: string }`
- 复用现有 MiniMax LLM 调用逻辑（`callOpenRouter` from `src/shared/lib/upg/openrouter-client.ts`，或参考 `/api/chat/route.ts` 的 `streamText`）
- 流式返回（SSE），与现有聊天体验一致
- 不创建 chat 记录、不写 message 表
- 关闭抽屉即丢弃对话，无持久化

**后端改动量**：约 50 行，一个 route handler + 权限校验 + 配额扣减。

## 5. 积分消耗

- 计费单位：**每次打开导师会话计 1 次**（不按消息数），避免用户不敢追问
- 免费用户每天 5 次导师对话

### 配额方案

**问题**：现有 `upg_daily_quota` 表只有 `generation_count` 字段，无 `type/scene` 区分，直接复用会导致 UPG 生成配额与导师配额串算。

**方案**：给 `upg_daily_quota` 表新增 `scene` 字段：

```sql
ALTER TABLE upg_daily_quota ADD COLUMN scene TEXT NOT NULL DEFAULT 'generation';
-- 先 drop 现有唯一约束和索引，再重建含 scene 的版本
ALTER TABLE upg_daily_quota DROP CONSTRAINT IF EXISTS uq_upg_daily_quota_user_date;
DROP INDEX IF EXISTS idx_upg_daily_quota_user_date;
CREATE UNIQUE INDEX uq_upg_daily_quota_user_date_scene ON upg_daily_quota(user_id, usage_date, scene);
CREATE INDEX idx_upg_daily_quota_user_date_scene ON upg_daily_quota(user_id, usage_date, scene);
```

`scene` 枚举值：`generation`（UPG 生成）、`tutor`（导师对话）。

现有 UPG 生成逻辑需同步更新查询条件，加上 `WHERE scene = 'generation'`。
