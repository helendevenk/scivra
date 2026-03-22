---
name: lab-notebook-ai
status: backlog
created: 2026-03-22T09:08:47Z
updated: 2026-03-22T09:08:47Z
title: Lab Notebook AI（AI 辅助实验报告）设计文档
estimated_effort: 14d / ~112h
complexity: 🔴 复杂（3 新表 + 8 API + 12 新组件 + PDF 生成）
depends_on: UPG 生成管线、experimentProgress 表、Curated Labs
---

# Lab Notebook AI -- AI 辅助实验报告系统

## 1. 模块定位与价值

### 1.1 核心痛点

AP Physics 学生每学期要写 8-12 份正式实验报告，每份耗时 2-4 小时。痛点集中在三个层面：

1. **格式焦虑**：AP 实验报告有严格的 Hypothesis-Method-Data-Analysis-Conclusion 结构，学生花大量时间在格式上而非思考物理本身
2. **数据记录断裂**：做完实验后回忆数据，常遗漏关键观察点。实验操作和报告撰写是割裂的两个时间段
3. **分析无从下手**：学生看着一堆数据不知道如何得出结论，缺乏从"数据到洞察"的思维框架

### 1.2 目标用户画像

| 用户 | 场景 | 核心需求 |
|------|------|---------|
| AP Physics 学生（16-18 岁） | 课后完成实验报告 | AI 帮我预填实验描述和数据，我专注于分析和结论 |
| 荣誉物理学生（15-17 岁） | 实验课上随手记录 | 边做实验边记笔记，实验结束直接导出报告 |
| 自学者 | UPG 探索后总结发现 | 把 UPG 可视化的参数和现象记录下来 |

### 1.3 核心用户旅程

```
学生做完 Curated Lab 或 UPG 可视化
    |
    v
点击实验页右上角 "Lab Notebook" 按钮
    |
    v
侧边 Drawer 滑出，显示 5 个区块：
  [Hypothesis] [Method] [Data] [Analysis] [Conclusion]
    |
    v
AI 自动预填：
  - Method：从实验 metadata 提取实验步骤描述
  - Data：从 experimentProgress / UPG 参数提取数据记录
    |
    v
学生填写：
  - Hypothesis：实验前的预测（AI 可给建议但不代写）
  - Analysis：AI 给出分析思路提示，学生自己写
  - Conclusion：学生总结，AI 检查是否呼应假设
    |
    v
点击 "Export PDF" → 生成 AP 格式的实验报告
```

### 1.4 与现有功能的关系

| 现有模块 | 关联方式 |
|---------|---------|
| experimentProgress | 读取实验时长、会话次数、最后参数，填入 Data 区块 |
| upgGeneration | 读取 prompt、category、htmlContent，提取实验描述 |
| autopilotSession | 读取 Autopilot 引导步骤和 quiz 结果，作为实验过程记录 |
| AI Chat (ai SDK v5) | 复用 OpenRouter/Anthropic 调用链，生成实验描述和分析提示 |
| learningPath | 笔记本可关联学习路径节点，作为路径完成的佐证 |

### 1.5 变现模式

| 功能 | Free | Pro ($4.99/mo) |
|------|------|----------------|
| 创建笔记本 | 2 本/月 | 无限 |
| AI 预填 | 仅 Method 区块 | 全部区块 |
| AI 分析建议 | 不可用 | 可用 |
| PDF 导出 | 不可用 | 可用，带/不带水印 |
| 版本历史 | 最新版本 | 完整历史 |

## 2. 数据模型设计

### 2.1 新增表：labNotebook

笔记本主表，一个笔记本对应一次实验。

```typescript
// src/config/db/schema.ts

export const labNotebook = pgTable(
  'lab_notebook',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    // 关联来源（三选一，至少填一个）
    experimentId: text('experiment_id'),        // Curated Lab slug
    generationId: text('generation_id')         // UPG generation ID
      .references(() => upgGeneration.id, { onDelete: 'set null' }),
    autopilotSessionId: text('autopilot_session_id')
      .references(() => autopilotSession.id, { onDelete: 'set null' }),

    // 基本信息
    title: text('title').notNull(),
    status: text('status').notNull().default('draft'), // draft | completed | archived
    language: text('language').notNull().default('en'), // en | zh

    // AP 报告五大区块（JSON string，结构见 2.4）
    hypothesis: text('hypothesis'),             // 学生填写
    method: text('method'),                     // AI 预填 + 学生编辑
    data: text('data'),                         // AI 预填 + 学生编辑
    analysis: text('analysis'),                 // 学生填写，AI 给提示
    conclusion: text('conclusion'),             // 学生填写

    // AI 辅助记录
    aiSuggestionsUsed: integer('ai_suggestions_used').default(0),
    aiModel: text('ai_model'),                  // 生成时使用的模型

    // 版本控制
    version: integer('version').default(1),

    // 时间戳
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    completedAt: timestamp('completed_at'),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('idx_lab_notebook_user_status').on(table.userId, table.status),
    index('idx_lab_notebook_user_created').on(table.userId, table.createdAt),
    index('idx_lab_notebook_generation').on(table.generationId),
    index('idx_lab_notebook_experiment').on(table.experimentId),
  ]
);

export type LabNotebook = typeof labNotebook.$inferSelect;
export type NewLabNotebook = typeof labNotebook.$inferInsert;
```

### 2.2 新增表：labNotebookVersion

版本历史表，Pro 用户可回溯所有版本。

```typescript
export const labNotebookVersion = pgTable(
  'lab_notebook_version',
  {
    id: text('id').primaryKey(),
    notebookId: text('notebook_id')
      .notNull()
      .references(() => labNotebook.id, { onDelete: 'cascade' }),
    version: integer('version').notNull(),

    // 快照：保存该版本时的完整内容
    hypothesis: text('hypothesis'),
    method: text('method'),
    data: text('data'),
    analysis: text('analysis'),
    conclusion: text('conclusion'),

    // 元信息
    changeDescription: text('change_description'), // 简短描述本次改动
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    unique('uq_notebook_version').on(table.notebookId, table.version),
    index('idx_notebook_version_notebook').on(table.notebookId),
  ]
);

export type LabNotebookVersion = typeof labNotebookVersion.$inferSelect;
export type NewLabNotebookVersion = typeof labNotebookVersion.$inferInsert;
```

### 2.3 新增表：labNotebookExport

导出记录，用于追踪 PDF 生成和限流。

```typescript
export const labNotebookExport = pgTable(
  'lab_notebook_export',
  {
    id: text('id').primaryKey(),
    notebookId: text('notebook_id')
      .notNull()
      .references(() => labNotebook.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    format: text('format').notNull().default('pdf'), // pdf（后期可扩展 docx）
    fileUrl: text('file_url'),                       // R2 存储 URL
    fileSize: integer('file_size'),                   // bytes
    includeWatermark: boolean('include_watermark').default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_notebook_export_notebook').on(table.notebookId),
    index('idx_notebook_export_user').on(table.userId),
  ]
);

export type LabNotebookExport = typeof labNotebookExport.$inferSelect;
export type NewLabNotebookExport = typeof labNotebookExport.$inferInsert;
```

### 2.4 区块内容 JSON 结构

每个区块存储为 JSON string（遵循项目惯例 text + JSON.parse），支持富文本块。

```typescript
// src/shared/types/lab-notebook.ts

interface NotebookBlock {
  type: 'text' | 'equation' | 'table' | 'image-ref' | 'ai-suggestion';
  content: string;         // Markdown 文本、LaTeX 公式、或 JSON 表格数据
  source?: 'user' | 'ai';  // 标记此块是用户写的还是 AI 生成的
  acceptedAt?: string;      // AI 建议被采纳的时间
}

// 每个区块是一个 NotebookBlock 数组
type SectionContent = NotebookBlock[];

// Data 区块的表格子结构
interface DataTable {
  headers: string[];        // ["Trial", "Initial Velocity (m/s)", "Angle (deg)", "Range (m)"]
  rows: string[][];         // [["1", "10", "45", "10.2"], ...]
  caption?: string;
}
```

### 2.5 ER 关系

```
user 1──N labNotebook
  |
  |   labNotebook 1──N labNotebookVersion
  |   labNotebook 1──N labNotebookExport
  |   labNotebook N──1 upgGeneration (可选)
  |   labNotebook N──1 autopilotSession (可选)
  |   labNotebook ──── experimentId (Curated Lab slug, 无 FK)
```

experimentId 不做外键约束，因为 Curated Lab 是代码中的注册表（不在数据库中），用 slug 字符串关联。

## 3. 路由设计

Lab Notebook 不是独立页面，主入口是**侧边 Drawer**，从实验页面或 UPG 查看页面触发。同时提供一个列表管理页面。

### 3.1 触发位置

| 触发页面 | 触发方式 | 行为 |
|---------|---------|------|
| Curated Lab 实验页 `/[locale]/(landing)/experiments/[slug]` | 右上角 "Lab Notebook" 按钮 | 打开 Drawer，自动关联 experimentId |
| UPG 查看页 `/[locale]/(landing)/(ai)/upg/[id]` | 右上角 "Lab Notebook" 按钮 | 打开 Drawer，自动关联 generationId |
| Autopilot 完成后 | 完成界面的 CTA 按钮 | 打开 Drawer，关联 generationId + autopilotSessionId |
| Dashboard `/[locale]/(landing)/dashboard` | 笔记本卡片 | 跳转到列表页 |

### 3.2 页面路由

| 路由 | 用途 |
|------|------|
| `/[locale]/(landing)/notebooks` | 笔记本列表页（我的所有笔记本） |
| `/[locale]/(landing)/notebooks/[id]` | 笔记本详情/编辑页（全屏编辑模式） |

列表页和详情页是辅助入口。核心体验是实验页面内的 Drawer。

### 3.3 Drawer 行为

Drawer 使用 shadcn/ui Sheet 组件（右侧滑出），宽度 480px（桌面）/ 100vw（移动端）。

打开 Drawer 时的逻辑：
1. 检查该实验/UPG 是否已有 draft 笔记本 -> 有则加载
2. 没有则创建新笔记本 -> 触发 AI 预填
3. Drawer 内可切换 5 个区块 Tab

## 4. API 设计

所有 API 放在 `src/app/api/notebooks/` 下，遵循现有 `respData/respErr` 模式。

### 4.1 CRUD API

**POST /api/notebooks**

创建笔记本，可选触发 AI 预填。

```typescript
// Request
{
  experimentId?: string;        // Curated Lab slug
  generationId?: string;        // UPG generation ID
  autopilotSessionId?: string;  // Autopilot session ID
  title?: string;               // 不传则 AI 生成
  language?: 'en' | 'zh';
  autoFill?: boolean;           // 是否触发 AI 预填（默认 true）
}

// Response
{
  code: 0,
  data: {
    id: string;
    title: string;
    status: 'draft';
    // ...预填后的内容
    method: string | null;
    data: string | null;
  }
}
```

权限：必须登录。Free 用户检查月度配额（2 本/月）。

**GET /api/notebooks**

获取当前用户的笔记本列表。

```typescript
// Query params
?status=draft|completed|archived
&experimentId=projectile-motion    // 按实验过滤
&page=1&pageSize=20

// Response
{
  code: 0,
  data: {
    items: LabNotebook[];
    total: number;
  }
}
```

**GET /api/notebooks/[id]**

获取单个笔记本详情。

**PATCH /api/notebooks/[id]**

更新笔记本区块内容。每次保存自动创建版本快照（Pro 用户）。

```typescript
// Request
{
  hypothesis?: string;
  method?: string;
  data?: string;
  analysis?: string;
  conclusion?: string;
  title?: string;
  status?: 'draft' | 'completed' | 'archived';
}
```

**DELETE /api/notebooks/[id]**

软删除（设置 deletedAt）。

### 4.2 AI 辅助 API

**POST /api/notebooks/[id]/ai/prefill**

AI 预填 Method 和 Data 区块。

```typescript
// Request
{
  sections: ('method' | 'data')[]; // 要预填的区块
}

// Response
{
  code: 0,
  data: {
    method?: SectionContent;  // AI 生成的方法描述
    data?: SectionContent;    // AI 生成的数据记录
  }
}
```

实现逻辑：
- 从 experimentProgress 读取 lastParameters、completedChallenges
- 从 upgGeneration 读取 prompt、category、htmlContent（提取 UI 控件和参数范围）
- 从 autopilotSession 读取引导步骤
- 调用 LLM 生成结构化的实验方法和数据描述

**POST /api/notebooks/[id]/ai/suggest**

AI 给出分析思路建议（不代写，给方向）。

```typescript
// Request
{
  section: 'hypothesis' | 'analysis' | 'conclusion';
  currentContent?: string;  // 学生当前已写的内容
}

// Response
{
  code: 0,
  data: {
    suggestions: Array<{
      type: 'prompt' | 'question' | 'framework';
      content: string;  // Markdown 格式
    }>;
  }
}
```

教育理念：AI 不直接给答案，而是给思考框架。例如：
- Hypothesis："Think about what happens to range when you increase the launch angle beyond 45 degrees. What does the sine function tell you?"
- Analysis："Your data shows a peak at 45 degrees. Can you connect this to the equation R = v^2 sin(2theta) / g?"
- Conclusion："Does your data support or contradict your hypothesis? By how much did the actual range differ from your prediction?"

权限：仅 Pro 用户可用。消耗 2 积分/次。

### 4.3 PDF 导出 API

**POST /api/notebooks/[id]/export**

生成 PDF 并返回下载 URL。

```typescript
// Request
{
  format: 'pdf';
  template?: 'ap-standard' | 'simple';  // AP 标准格式或简化格式
}

// Response
{
  code: 0,
  data: {
    exportId: string;
    fileUrl: string;     // R2 签名 URL，24h 有效
    fileSize: number;
  }
}
```

权限：仅 Pro 用户。Free 用户看到 PDF 预览但有升级提示。

PDF 生成方案（见 5.5 技术选型）。

### 4.4 版本历史 API

**GET /api/notebooks/[id]/versions**

获取版本列表。

```typescript
// Response
{
  code: 0,
  data: {
    versions: Array<{
      id: string;
      version: number;
      changeDescription: string;
      createdAt: string;
    }>;
  }
}
```

权限：仅 Pro 用户。Free 用户只能看到最新版本。

**GET /api/notebooks/[id]/versions/[versionId]**

获取指定版本的完整内容。

## 5. 前端组件设计

### 5.1 组件层级

```
src/shared/blocks/notebook/
  |-- NotebookTrigger.tsx          # 触发按钮（放在实验页/UPG页）
  |-- NotebookDrawer.tsx           # 侧边 Drawer 容器
  |-- NotebookEditor.tsx           # 编辑器主体（5 区块 Tab）
  |-- sections/
  |   |-- HypothesisSection.tsx    # 假设区块
  |   |-- MethodSection.tsx        # 方法区块（含 AI 预填标记）
  |   |-- DataSection.tsx          # 数据区块（含表格编辑器）
  |   |-- AnalysisSection.tsx      # 分析区块
  |   |-- ConclusionSection.tsx    # 结论区块
  |-- AiSuggestionBubble.tsx       # AI 建议气泡
  |-- DataTableEditor.tsx          # 简易表格编辑器
  |-- NotebookToolbar.tsx          # 工具栏（保存/导出/版本）
  |-- PdfPreview.tsx               # PDF 预览对话框
  |-- VersionHistory.tsx           # 版本历史面板

src/shared/blocks/notebook-list/
  |-- NotebookList.tsx             # 笔记本列表页主组件
  |-- NotebookCard.tsx             # 列表中的卡片
```

### 5.2 NotebookDrawer

核心容器组件，使用 shadcn/ui Sheet。

```typescript
// Props
interface NotebookDrawerProps {
  // 关联来源（至少传一个）
  experimentId?: string;
  generationId?: string;
  autopilotSessionId?: string;

  // 控制
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

行为：
- 打开时调 `GET /api/notebooks?experimentId=xxx&status=draft` 查找现有草稿
- 找到则加载，否则调 `POST /api/notebooks` 创建并触发 AI 预填
- 自动保存：用户停止输入 2 秒后自动调 PATCH
- 底部固定工具栏：保存状态指示器 | 版本历史 | 导出 PDF

### 5.3 Section 编辑器

每个区块是一个受控的 Markdown 文本区域，不引入重型富文本编辑器。

**方案选择：Textarea + Markdown 预览（推荐）**

理由：
- AP 实验报告本质是结构化文本 + 公式 + 表格，不需要 WYSIWYG
- Tiptap/Plate 引入 30-50KB 额外 bundle，对教育产品加载速度有负面影响
- 学生群体习惯 Google Docs 式简单输入，不需要学习 Markdown 语法

实现：
- 每个 Section 使用 `<textarea>` + 实时 Markdown 预览（markdown-it + KaTeX，项目已有）
- 公式输入：用 `$...$` 行内 / `$$...$$` 块级语法，KaTeX 实时渲染（项目已有 rehype-katex）
- 表格：Data 区块提供专门的 DataTableEditor（HTML table + contentEditable cells）

### 5.4 AiSuggestionBubble

AI 建议以非侵入式气泡显示在区块右侧或下方。

```typescript
interface AiSuggestionBubbleProps {
  suggestions: Array<{
    type: 'prompt' | 'question' | 'framework';
    content: string;
  }>;
  onAccept: (index: number) => void;  // 采纳建议
  onDismiss: () => void;              // 关闭
}
```

视觉设计：
- 使用 edu-academic 主题的学术金边框
- 图标：灯泡或小星星
- 折叠态只显示 "AI has a suggestion"，展开态显示完整建议
- 建议内容 Markdown 渲染，支持公式

### 5.5 PDF 生成技术选型

**对比分析：**

| 方案 | 优点 | 缺点 | 推荐 |
|------|------|------|------|
| **@react-pdf/renderer** | 纯 JS，Vercel 可运行，React 组件定义布局 | 中文字体需自带（+2MB），表格渲染弱 | -- |
| **Puppeteer + HTML** | 渲染质量最高，CSS 完美支持 | Vercel 无法运行 headless Chrome，需外部服务 | -- |
| **jsPDF + html2canvas** | 纯前端，零服务端依赖 | 渲染质量低，中文问题多 | -- |
| **html-pdf-node (服务端)** | 简单 API | 底层是 Puppeteer，同样有 serverless 限制 | -- |
| **客户端 @react-pdf/renderer** | ★ 推荐 | 在浏览器端渲染，不占服务端资源，React 组件定义 AP 报告模板，KaTeX 公式转 SVG 嵌入 | 中文字体需动态加载 |

**推荐方案：客户端 @react-pdf/renderer**

理由：
1. 纯前端渲染，不消耗 Vercel serverless 资源
2. React 组件定义 PDF 模板，与项目技术栈一致
3. 公式处理：KaTeX 渲染为 SVG -> 嵌入 PDF
4. 表格：用 @react-pdf/renderer 的 View/Text 手动排版
5. 中文支持：动态加载 Noto Sans SC 字体子集（~800KB，按需加载）
6. 生成后上传 R2，返回签名 URL

包体积影响：@react-pdf/renderer ~180KB gzipped，仅在 notebooks 路由懒加载。

### 5.6 状态管理

使用 React Hook + SWR（或 fetch + useState，项目现有模式）。

```typescript
// src/shared/hooks/use-notebook.ts

function useNotebook(notebookId: string | null) {
  // 加载/创建笔记本
  // 自动保存（debounced PATCH）
  // 版本列表
  return {
    notebook,
    isLoading,
    isSaving,
    updateSection,    // (section: string, content: string) => void
    triggerAiPrefill, // (sections: string[]) => Promise<void>
    requestSuggestion, // (section: string) => Promise<Suggestion[]>
    exportPdf,        // () => Promise<string> (returns URL)
  };
}

function useNotebookList(filters: NotebookListFilters) {
  // 列表、翻页、过滤
  return { notebooks, total, isLoading };
}
```

## 6. AI Prompt 设计

### 6.1 预填 System Prompt

```
You are an AP Physics lab assistant. Your role is to help students document their experiments accurately.

Given the experiment metadata and student's interaction data, generate:
1. **Method**: A clear, step-by-step procedure description in past tense (as if the student already performed it). Include specific parameter values they used.
2. **Data**: A structured data table with headers and units. Fill in the data points from their experiment session.

Rules:
- Use precise physics terminology appropriate for AP Physics level
- Include SI units for all measurements
- Do NOT include analysis or conclusions - the student must write those
- Format as JSON array of NotebookBlock objects
- For data tables, use the DataTable format with headers and rows
```

### 6.2 建议 System Prompt

```
You are a physics teacher helping a student analyze their lab data. You must NOT write the analysis for them. Instead:

1. Ask guiding questions that lead them to discover patterns
2. Point out specific data points worth examining
3. Suggest relevant equations or relationships to consider
4. If they have a hypothesis, ask them to compare it with their data quantitatively

Keep responses under 3 sentences. Use Socratic method.
Format: Return an array of suggestion objects with type 'prompt'|'question'|'framework'.
```

## 7. 开发任务分解

### Phase 1: 数据层 + CRUD（3 天）

| # | 任务 | 工时 | 依赖 |
|---|------|------|------|
| 1.1 | Schema：labNotebook + labNotebookVersion + labNotebookExport 三张表 | 2h | 无 |
| 1.2 | Models：lab_notebook.ts, lab_notebook_version.ts, lab_notebook_export.ts | 4h | 1.1 |
| 1.3 | API：POST/GET/PATCH/DELETE /api/notebooks + GET /api/notebooks/[id] | 8h | 1.2 |
| 1.4 | API：GET /api/notebooks/[id]/versions | 3h | 1.2 |
| 1.5 | 配额检查：Free 用户 2 本/月限制逻辑 | 2h | 1.3 |
| 1.6 | 单元测试：Model 层 + API 基本 CRUD | 5h | 1.3 |
| **小计** | | **24h / 3d** | |

### Phase 2: AI 辅助（3 天）

| # | 任务 | 工时 | 依赖 |
|---|------|------|------|
| 2.1 | AI Prefill：从 experimentProgress/upgGeneration 提取上下文 | 4h | Phase 1 |
| 2.2 | AI Prefill：LLM 调用 + 结构化输出解析 | 6h | 2.1 |
| 2.3 | AI Suggest：分析建议 API + Prompt 设计 | 4h | Phase 1 |
| 2.4 | API：POST /api/notebooks/[id]/ai/prefill + ai/suggest | 4h | 2.2, 2.3 |
| 2.5 | 积分扣除：AI suggest 消耗积分（复用现有 credit 模型） | 2h | 2.4 |
| 2.6 | 单元测试：AI prompt 输出格式验证 | 4h | 2.4 |
| **小计** | | **24h / 3d** | |

### Phase 3: 前端 UI（4 天）

| # | 任务 | 工时 | 依赖 |
|---|------|------|------|
| 3.1 | NotebookTrigger：按钮组件 + 嵌入实验页和 UPG 页 | 2h | 无 |
| 3.2 | NotebookDrawer：Sheet 容器 + 加载/创建逻辑 | 4h | 3.1 |
| 3.3 | NotebookEditor：5 区块 Tab 切换 + textarea | 6h | 3.2 |
| 3.4 | DataTableEditor：HTML 表格 + 增删行列 | 4h | 3.3 |
| 3.5 | AiSuggestionBubble：气泡 UI + 交互 | 3h | 3.3 |
| 3.6 | useNotebook Hook：自动保存 + API 集成 | 4h | Phase 1 API |
| 3.7 | NotebookToolbar：保存指示器 + 版本 + 导出按钮 | 3h | 3.3 |
| 3.8 | VersionHistory：版本列表 + 内容 diff 查看 | 3h | 3.7 |
| 3.9 | i18n：en/zh 翻译文件 | 2h | 3.3 |
| **小计** | | **31h / ~4d** | |

### Phase 4: PDF 导出（2 天）

| # | 任务 | 工时 | 依赖 |
|---|------|------|------|
| 4.1 | @react-pdf/renderer 集成 + AP 报告模板组件 | 6h | Phase 3 |
| 4.2 | KaTeX 公式转 SVG 嵌入 PDF | 3h | 4.1 |
| 4.3 | 数据表格在 PDF 中的布局 | 2h | 4.1 |
| 4.4 | PdfPreview 对话框 | 2h | 4.1 |
| 4.5 | 上传 R2 + 签名 URL 返回 | 2h | 4.1 |
| 4.6 | POST /api/notebooks/[id]/export API | 2h | 4.5 |
| **小计** | | **17h / ~2d** | |

### Phase 5: 列表页 + 打磨（2 天）

| # | 任务 | 工时 | 依赖 |
|---|------|------|------|
| 5.1 | NotebookList 页面 + NotebookCard 组件 | 4h | Phase 3 |
| 5.2 | 全屏编辑页 /notebooks/[id] | 3h | Phase 3 |
| 5.3 | Dashboard 笔记本入口卡片 | 2h | 5.1 |
| 5.4 | 移动端适配（Drawer 全屏、表格横滑） | 3h | Phase 3 |
| 5.5 | E2E 测试：创建 -> 编辑 -> AI 预填 -> 导出 | 4h | Phase 4 |
| **小计** | | **16h / 2d** | |

### 总计

| Phase | 内容 | 工时 | 天数 |
|-------|------|------|------|
| 1 | 数据层 + CRUD | 24h | 3d |
| 2 | AI 辅助 | 24h | 3d |
| 3 | 前端 UI | 31h | 4d |
| 4 | PDF 导出 | 17h | 2d |
| 5 | 列表页 + 打磨 | 16h | 2d |
| **总计** | | **112h** | **14d** |

## 8. 技术风险与缓解

### 8.1 PDF 中文字体体积

**风险**：Noto Sans SC 完整字体 ~16MB，即使子集化也有 ~800KB。
**缓解**：
- 字体文件放 R2 CDN，首次导出时异步加载
- 使用 `fonttools` 做子集化，只保留常用 6000 字
- 如果中文需求低，MVP 阶段可先只支持英文 PDF（AP Physics 本身是英文）
- **推荐 MVP 策略**：只支持英文 PDF，中文作为 Phase 2 增强

### 8.2 AI 预填准确性

**风险**：AI 生成的实验方法/数据可能与学生实际操作不符。
**缓解**：
- 所有 AI 预填内容标记 `source: 'ai'`，视觉上用虚线边框区分
- 学生必须手动确认/编辑才能保存
- 预填内容基于 experimentProgress 的实际记录数据，不是凭空编造

### 8.3 富文本编辑器复杂度

**风险**：如果后期需要从 textarea 升级到 WYSIWYG，迁移成本高。
**缓解**：
- 内容存储为 NotebookBlock JSON 数组（非纯文本），数据结构已经抽象
- 如果需要升级，只替换渲染层，数据层不变
- **推荐**：MVP 用 textarea + markdown preview，验证 PMF 后再考虑 Tiptap

### 8.4 自动保存冲突

**风险**：学生同时打开多个 Tab 编辑同一笔记本。
**缓解**：
- labNotebook 有 version 字段，PATCH 时带 version 做乐观锁
- 冲突时提示 "This notebook was modified in another tab. Reload to see latest version."
- MVP 阶段不做实时协作，这是 V2 功能

### 8.5 @react-pdf/renderer 兼容性

**风险**：部分浏览器（老版本 Safari）可能有 Web Worker / Blob URL 限制。
**缓解**：
- 添加 fallback：如果客户端渲染失败，提供 "Email me the PDF" 选项（服务端生成后通过 Resend 发送）
- 该 fallback 可复用 Resend 邮件基础设施（项目已有）

## 9. 测试策略

### 9.1 单元测试（Vitest）

- Model 层：CRUD 操作、配额检查、版本创建
- AI Prompt：验证输出格式符合 NotebookBlock 结构
- PDF 模板：组件渲染快照测试

### 9.2 集成测试

- API 端到端：创建 -> AI 预填 -> 编辑 -> 保存 -> 导出
- 权限测试：Free vs Pro 功能门控
- 配额测试：Free 用户月度限制

### 9.3 E2E 测试（Playwright）

- 完整用户旅程：从实验页触发 -> Drawer 打开 -> 编辑 5 区块 -> 导出 PDF
- 移动端：Drawer 全屏显示、表格横向滚动

## 10. 实现优先级建议

如果需要分阶段交付（推荐），按以下顺序：

**MVP（第 1 周）**：Phase 1 + Phase 3（不含 AI 和 PDF）
- 纯手动笔记本，5 区块编辑 + 自动保存
- 验证用户是否愿意在平台内写实验报告

**V1（第 2 周）**：Phase 2 + Phase 4
- 加入 AI 预填和建议
- 加入 PDF 导出（仅英文）

**V2（后续）**：Phase 5 + 教师查看功能
- 列表页完善
- 中文 PDF
- 教师端查看学生笔记本（需要新的权限模型，不在本文档范围内）
