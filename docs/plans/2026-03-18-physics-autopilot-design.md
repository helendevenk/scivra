---
title: Physics Autopilot（AI 物理实验引导）设计文档
date: 2026-03-18
status: 待确认
estimated_effort: 16h / 2 工作日
complexity: 🔴 复杂（10 新增文件 + 5 修改文件）
depends_on: UPG 生成管线正常工作
inspiration: alibaba/page-agent ReAct 循环架构
---

# Physics Autopilot — AI 物理实验引导系统

## 1. 问题定义

### 1.1 核心痛点

NeonPhysics v2 的 UPG 生成了精美的 3D 物理可视化，但学生打开后面临三个障碍：

1. **不知道怎么操作**：3+ 个滑块，不清楚调哪个、调多少
2. **看不懂现象**：3D 动画在眼前播放，但不理解物理含义
3. **很快离开**：没有引导 → 没有学习 → 没有付费动力

### 1.2 为什么现有的 AI Tutor 设计不够

已有设计文档（`2026-02-24-ai-tutor-design.md`）定义了一个**纯文字对话**的侧边抽屉。它能回答问题，但：

- **被动等待**：学生不问，导师不说。课后自学场景，学生不知道该问什么。
- **只说不做**：导师用文字解释"调高频率"，但不会真的帮你调。文字描述远不如实际演示直观。
- **与可视化割裂**：对话在侧边，可视化在主区域。两个独立世界，没有联动。

### 1.3 Physics Autopilot 的差异化

| 维度 | AI Tutor（旧设计） | Physics Autopilot（本方案） |
|------|-------------------|--------------------------|
| 交互方式 | 被动问答 | **主动引导** |
| 核心能力 | 文字解释 | **操控可视化 + 解释** |
| UI 位置 | 侧边抽屉 | **嵌入可视化内部** |
| 技术基础 | 流式 LLM 对话 | **ReAct 循环 + DOM 操控** |
| 学习效果 | 告诉你答案 | **演示给你看，问你理解了吗** |

### 1.4 灵感来源：PageAgent

阿里巴巴的 [PageAgent](https://github.com/alibaba/page-agent) 是一个纯 JS 的网页内 AI 代理，核心架构是 ReAct（Reasoning + Acting）循环。它的关键洞察：

- **不截图，用文本化 DOM**：把页面元素转成文字描述给 LLM 看，比截图快、便宜、准确
- **MacroTool 模式**：所有工具合并为一个 JSON schema，强制 LLM 在每步输出"思考 + 行动"
- **单次调用/步**：每步发送 system + user 两条消息，历史序列化为 XML 文本，不做多轮对话

我们不引入 PageAgent 作为依赖，而是**吸收其核心模式，用 ~300 行代码自主实现**。原因：
- UPG 可视化结构可预测（我们控制生成 prompt），不需要通用 DOM 扫描
- 只需 6 个域特定工具，不需要 PageAgent 的通用 click/input/scroll
- 减少外部依赖，完全可控

## 2. 用户体验设计

### 2.1 核心交互流程

```
学生打开 UPG 可视化（如"抛体运动"）
    ↓
右下角出现 ✨ AI Tutor 按钮（在 quiz 浮动按钮旁边）
    ↓
点击按钮 → 可视化内出现对话面板
    ↓
导师："我来带你做这个实验！先看看初始状态——"
    ↓
导师自动将"初速度"滑块拉到 10 m/s（600ms 平滑动画）
    ↓
导师："现在点击播放，观察抛物线轨迹。"
    ↓
导师点击 Play 按钮 → 动画播放
    ↓
导师："你觉得如果把角度从 45° 调到 60°，射程会变远还是变近？"
    ↓
（暂停等待 2 秒）
    ↓
导师将角度滑块从 45° 调到 60° → 动画重新播放
    ↓
导师："你看，射程变近了！因为..."
    ↓
（重复 3-5 个教学循环）
    ↓
导师："现在来做个测验验证你的理解。"
    ↓
导师引导完成测验题（不直接给答案，引导推理）
    ↓
导师："恭喜！你已经掌握了抛体运动的核心概念。"
```

### 2.2 Tutor UI 设计（嵌入 iframe 内部）

**浮动按钮**：
- 位置：右下角，quiz 浮动按钮上方 60px
- 样式：圆形 48px，复用 UPG CSS 变量 `--accent-cyan`，带脉冲动画
- 图标：✨（sparkles）或自定义 SVG

**展开面板**：
- 位置：右下角浮动，320×400px
- 样式：Glassmorphism（`--glass-bg`, `--glass-border`），圆角 16px
- 顶部：标题 "AI Tutor" + 关闭按钮
- 中间：消息列表，自动滚到底部
  - 导师消息：蓝色（`--accent-cyan`）左对齐气泡
  - 系统消息：灰色居中小字
  - "思考中"：三点脉冲动画
- 底部："停止引导" 按钮

### 2.3 付费转化逻辑

| 用户层级 | Autopilot 权限 | 体验 |
|---------|---------------|------|
| 未登录 | 不可用 | 按钮显示"登录解锁 AI 引导" |
| Free | 每个可视化限 1 次 session | 完整体验 20 步引导，用完后按钮变"升级 Pro 解锁无限引导" |
| Pro | 无限次 | 随时启动 |
| Max | 无限次 | 随时启动 |

**不消耗 credits**。原因：
1. Haiku 成本极低（~$0.02/session），不值得设计积分扣减逻辑
2. Autopilot 是付费转化核心驱动 — 要让 Free 用户充分体验价值
3. "每 viz 限 1 次"已经足够限制滥用
4. 积分机制更适合高成本操作（UPG 生成用 Sonnet）

## 3. 技术架构

### 3.1 系统架构图

```
┌──────────────────────────────────────────────────────────┐
│  View Page (/upg/view/[id])                               │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  <iframe srcDoc={injectedHtml}>                      │ │
│  │                                                      │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │ │
│  │  │ DOM 状态读取  │  │  动作执行器   │  │ Tutor UI  │ │ │
│  │  │ getVizState() │  │ executeAction│  │ 对话面板   │ │ │
│  │  └──────┬───────┘  └──────┬───────┘  └───────────┘ │ │
│  │         │                  │                         │ │
│  │         └──── postMessage ─┘                         │ │
│  └─────────────────┬───────────────────────────────────┘ │
│                     │ postMessage                         │
│  ┌─────────────────┴───────────────────────────────────┐ │
│  │  AutopilotBridge (React 组件)                        │ │
│  │                                                      │ │
│  │  ReAct 循环：                                        │ │
│  │  1. 收 iframe state                                  │ │
│  │  2. POST /api/autopilot/step  ──────────────┐       │ │
│  │  3. 收 LLM response                         │       │ │
│  │  4. 发 action 给 iframe                      │       │ │
│  └──────────────────────────────────────────────┼───────┘ │
└─────────────────────────────────────────────────┼─────────┘
                                                  │ fetch
┌─────────────────────────────────────────────────┼─────────┐
│  POST /api/autopilot/step                        │         │
│                                                  ↓         │
│  1. Auth + 配额检查                                        │
│  2. 组装 Tutor System Prompt                               │
│  3. 序列化 history 为 XML                                   │
│  4. callAnthropic(haiku) ──→ Anthropic API                 │
│  5. 解析 JSON response                                     │
│  6. 返回 { reflection, action }                            │
└────────────────────────────────────────────────────────────┘
```

### 3.2 关键架构决策

| 决策 | 选择 | 原因 |
|------|------|------|
| LLM 调用位置 | Server-side API route | API key 安全，不暴露给 iframe |
| ReAct 循环编排位置 | Parent page（React 组件） | 可以 fetch API，管理 state |
| DOM 操控位置 | iframe 内部 | 直接访问生成的 HTML DOM |
| 通信方式 | postMessage | iframe sandbox 允许，无跨域问题 |
| LLM 模型 | claude-haiku-4-5-20251001 | 快（~1s/step）、便宜（$0.001/step）、JSON 输出稳定 |
| tool calling 方式 | 纯 JSON 输出（非 Anthropic tool_use） | 简化实现，Haiku JSON 稳定性足够 |
| 历史管理 | 客户端 state，序列化为 XML | 与 PageAgent 一致，不占 server 存储 |

### 3.3 ReAct 循环详解

每一步的完整流程：

```
Step N:
  ┌─ iframe: getVisualizationState()
  │  → { title, sliders: [{name, value, min, max, unit}], buttons, quiz }
  │
  ├─ Parent: 序列化 history + state → POST /api/autopilot/step
  │  → 请求体：{ generationId, sessionId, task, history, state, stepNumber, language }
  │
  ├─ Server: 组装 prompt
  │  System: Tutor 人格 + 教学方法 + 可用工具列表 + 输出格式要求
  │  User: <agent_state> + <agent_history>(XML) + <visualization_state>(JSON)
  │
  ├─ Server: callAnthropic(haiku)
  │  → LLM 输出 JSON:
  │    {
  │      "evaluation_previous_goal": "Successfully demonstrated frequency effect",
  │      "memory": "Student has seen frequency-wavelength relationship. Sliders: freq=5Hz, amp=2m",
  │      "next_goal": "Ask student to predict amplitude effect before demonstrating",
  │      "action": { "tutor_speak": { "text": "你觉得如果把振幅加倍，波速会变吗？" } }
  │    }
  │
  ├─ Parent: 解析 response
  │  → 如果 action 是 "done" → 结束 session
  │  → 否则 → postMessage('autopilot:execute', action) 给 iframe
  │
  ├─ iframe: executeAction(action)
  │  → 操控 DOM（移动滑块/点击按钮/显示消息/选择选项）
  │  → postMessage('autopilot:action-result', result)
  │
  ├─ Parent: 收到 result → 追加到 history
  │
  ├─ 等待 AUTOPILOT_STEP_DELAY_MS (800ms) → 让学生观察变化
  │
  └─ postMessage('autopilot:get-state') → 开始 Step N+1
```

### 3.4 postMessage 协议

所有消息以 `autopilot:` 为前缀，parent listener 只响应匹配的类型。

**iframe → Parent：**

| type | 触发时机 | payload |
|------|---------|---------|
| `autopilot:ready` | 脚本加载完成 | `{ sessionId }` |
| `autopilot:state` | 响应 get-state 请求 | `{ sessionId, state: VisualizationState }` |
| `autopilot:action-result` | 执行动作完成 | `{ sessionId, result: string }` |

**Parent → iframe：**

| type | 触发时机 | payload |
|------|---------|---------|
| `autopilot:start` | 用户点击启动 | `{ sessionId }` |
| `autopilot:get-state` | 需要最新状态 | `{ sessionId }` |
| `autopilot:execute` | 需要执行动作 | `{ sessionId, action: Record<string, any> }` |
| `autopilot:stop` | 用户点击停止 | `{ sessionId }` |

### 3.5 iframe 安全分析

| 安全点 | 状态 | 说明 |
|--------|------|------|
| API key 泄露 | ✅ 安全 | LLM 调用在 server-side，key 不进 iframe |
| iframe sandbox | ✅ 兼容 | `allow-scripts allow-same-origin` 允许 postMessage |
| postMessage 攻击 | ✅ 已防护 | Parent listener 只响应 `autopilot:` 前缀 + sessionId 匹配 |
| 注入脚本与 sanitizer | ✅ 不冲突 | 注入发生在 client-side render 时，在 sanitizer 之后 |
| CSP | ✅ 不影响 | `connect-src 'none'` 不阻止 postMessage（非网络请求） |
| 恶意 HTML 发 postMessage | ✅ 已防护 | sessionId 由 parent 生成，恶意代码无法猜到 |

## 4. 文件清单与详细设计

### 4.1 新增文件

#### (1) `src/shared/lib/autopilot/types.ts` — TypeScript 类型定义

```typescript
// === 可视化状态 ===
export interface SliderState {
  name: string;       // data-autopilot="slider-{name}" 中的 name
  label: string;      // 显示标签（中/英文）
  value: number;      // 当前值
  min: number;
  max: number;
  unit: string;       // 单位（m/s, kg, N 等）
}

export interface QuizState {
  question: string;
  options: Array<{
    index: number;
    text: string;
    selected: boolean;
  }>;
}

export interface VisualizationState {
  title: string;
  sliders: SliderState[];
  buttons: Record<'play' | 'pause' | 'reset' | 'random', boolean>;
  quiz: QuizState | null;
}

// === ReAct 历史 ===
export interface StepHistoryEntry {
  stepIndex: number;
  evaluation: string;
  memory: string;
  nextGoal: string;
  actionName: string;
  actionInput: unknown;
  actionResult: string;
}

// === API 请求/响应 ===
export interface AutopilotStepRequest {
  generationId: string;
  sessionId: string;
  task: string;
  history: StepHistoryEntry[];
  visualizationState: VisualizationState;
  stepNumber: number;
  language: 'zh' | 'en';
}

export interface AutopilotReflection {
  evaluation_previous_goal: string;
  memory: string;
  next_goal: string;
}

export interface AutopilotStepResponse {
  reflection: AutopilotReflection;
  action: Record<string, unknown>;
}

// === postMessage 协议 ===
export type IframeToParentMessage =
  | { type: 'autopilot:ready'; sessionId: string }
  | { type: 'autopilot:state'; sessionId: string; state: VisualizationState }
  | { type: 'autopilot:action-result'; sessionId: string; result: string };

export type ParentToIframeMessage =
  | { type: 'autopilot:start'; sessionId: string }
  | { type: 'autopilot:get-state'; sessionId: string }
  | { type: 'autopilot:execute'; sessionId: string; action: Record<string, unknown> }
  | { type: 'autopilot:stop'; sessionId: string };
```

#### (2) `src/shared/lib/autopilot/constants.ts` — 配置常量

```typescript
export const AUTOPILOT_MODEL = 'claude-haiku-4-5-20251001';
export const AUTOPILOT_MAX_STEPS = 20;
export const AUTOPILOT_MAX_TOKENS = 1024;
export const AUTOPILOT_TEMPERATURE = 0.3;
export const AUTOPILOT_TIMEOUT_MS = 30000;        // 单步超时 30s
export const AUTOPILOT_FREE_SESSIONS_PER_VIZ = 1; // Free 用户每 viz 限 1 次
export const AUTOPILOT_STEP_DELAY_MS = 800;        // 步间延迟，让学生观察
```

#### (3) `src/shared/lib/autopilot/prompt-modules/autopilot-dom.ts` — UPG Prompt 模块

此模块追加到 UPG 系统提示词中，要求生成的 HTML 包含标准化的 `data-autopilot` 属性。

内容要求：
- 每个 `input[type="range"]` 必须带 `data-autopilot="slider-{camelCaseName}"` + `data-slider-label` + `data-slider-unit` + `data-slider-min` + `data-slider-max`
- Play/Pause/Reset/Random 按钮带 `data-autopilot="btn-play|pause|reset|random"`
- Quiz 面板带 `data-autopilot="quiz-panel"` + `quiz-question` + `quiz-option-{index}`
- 标题元素带 `data-autopilot="title"`

**注意**：此修改只影响新生成的 HTML。旧 HTML 不包含这些属性。

#### (4) `src/shared/lib/autopilot/tutor-prompt.ts` — Tutor Agent 提示词

**System Prompt 设计（完整）**：

```
你是一位友好的高中物理导师，嵌入在一个交互式 3D 可视化中。你通过操控可视化控件并解释现象来引导学生理解物理实验。

## 沟通方式
- 使用{语言}
- 鼓励式、耐心、苏格拉底式教学
- 每条消息不超过 100 字
- 使用适合高中生的简单语言

## 教学方法
每个概念遵循此循环：
1. 观察：读取当前可视化状态
2. 解释：简短说明学生即将看到的现象
3. 演示：操控一个滑块或按钮展示现象
4. 提问：向学生提出一个思考题
5. 验证：经过几个循环后，引导完成测验

## Session 结构
- Step 0：问候学生，介绍实验，预览学习目标
- Steps 1-15：教学循环（观察→解释→演示→提问）
- Steps 16-18：引导完成测验（NEVER 直接给答案——引导推理）
- Steps 19-20：总结关键知识点，鼓励进一步探索

## 可用动作
你必须输出以下 JSON 格式：
{
  "evaluation_previous_goal": "对上一步的简短评估",
  "memory": "需要记住的关键信息（滑块值、学生已见内容、测验状态）",
  "next_goal": "下一步要做什么",
  "action": { "<action_name>": { <params> } }
}

每步只能选择一个动作：
- {"set_slider": {"name": "<slider-name>", "value": <number>}}
  将滑块设置到特定值。用于演示物理效果。
- {"click_button": {"id": "play|pause|reset|random"}}
  点击控制按钮。
- {"tutor_speak": {"text": "<message>"}}
  向学生显示消息。用于解释、提问、鼓励。
- {"select_quiz_option": {"index": <0-based>}}
  选择测验答案。只在引导学生得出答案后使用。
- {"get_visualization_state": {}}
  读取当前滑块值和 UI 状态。
- {"get_quiz_state": {}}
  读取测验题目和选项。
- {"done": {"text": "<最终消息>", "success": true}}
  结束引导 session 并输出总结。

## 铁律
- NEVER 直接揭示测验答案。引导学生的推理过程。
- ALWAYS 在操控控件前先 tutor_speak 解释（先说再做）。
- 一次只改变一个滑块，让学生观察单变量效果。
- 改变滑块后，ALWAYS tutor_speak 解释发生了什么。
- 如果可视化有动画，先 click "play" 让它运行，然后 "pause" 讨论。
- 记住滑块范围，永远不要设置超出 min/max 的值。
```

**User Prompt 组装**：

```typescript
function buildTutorUserPrompt(params: {
  task: string;
  history: StepHistoryEntry[];
  visualizationState: VisualizationState;
  stepNumber: number;
  maxSteps: number;
}): string {
  // <agent_state> 包含 task 和 step info
  // <agent_history> 包含每步的 XML 记录
  // <visualization_state> 包含当前状态 JSON
}
```

#### (5) `src/shared/lib/autopilot/engine.ts` — iframe 注入脚本生成器

导出函数 `generateAutopilotScript(sessionId: string, language: 'zh'|'en'): string`。

脚本为 IIFE（立即执行函数），约 200 行，包含：

**a) DOM 查询 `getVisualizationState()`**：
- `querySelectorAll('[data-autopilot^="slider-"]')` → 遍历提取 name/label/value/min/max/unit
- 按钮存在性检查：`querySelector('[data-autopilot="btn-play"]')` 等
- Quiz 状态：question text + options text + selected 状态
- Title：`querySelector('[data-autopilot="title"]')` fallback 到 `querySelector('h1')`

**b) 动作执行 `executeAction(action)`**：
- `set_slider`：`animateSlider(el, value)` — 20 步 × 30ms = 600ms 平滑动画，每步 dispatch `input` event
- `click_button`：`.click()` 直接触发
- `select_quiz_option`：`.click()` 直接触发
- `tutor_speak`：调用 `showTutorMessage(text)`
- `get_visualization_state` / `get_quiz_state`：返回当前状态 JSON
- `done`：显示最终消息 + 添加"重新开始"提示

**c) Tutor UI 创建**：
- `createTutorUI()`：动态创建 DOM 元素
  - 外层容器：`position: fixed; right: 20px; bottom: 80px; width: 320px; z-index: 10000`
  - Glassmorphism 样式（复用 UPG CSS 变量）
  - 消息列表 + 思考动画 + 关闭按钮
- `showTutorMessage(text, isFinal?)`：追加消息气泡，自动滚到底部
- `showThinking()`：显示三点脉冲动画
- `hideThinking()`：移除思考动画

**d) postMessage Bridge**：
- 监听 parent 发来的 `autopilot:start` / `autopilot:get-state` / `autopilot:execute` / `autopilot:stop`
- 发送 `autopilot:ready` / `autopilot:state` / `autopilot:action-result`

#### (6) `src/shared/lib/autopilot/inject.ts` — HTML 注入

```typescript
export function injectAutopilotScript(
  html: string,
  sessionId: string,
  language: 'zh' | 'en'
): string {
  const script = generateAutopilotScript(sessionId, language);
  const bodyCloseIndex = html.lastIndexOf('</body>');
  if (bodyCloseIndex === -1) {
    return html + `<script>${script}<\/script>`;
  }
  return html.slice(0, bodyCloseIndex)
    + `<script>${script}<\/script>\n`
    + html.slice(bodyCloseIndex);
}
```

注入发生在 **client-side render** 时（`client.tsx` 中），在 sanitizer 之后。注入的是我们自己的可信代码。

#### (7) `src/app/api/autopilot/step/route.ts` — API 路由

```
POST /api/autopilot/step
maxDuration: 30 (vercel.json 配置)

请求体：AutopilotStepRequest
响应体：AutopilotStepResponse

流程：
1. 解析 + 验证请求体
2. getUserInfo() → 未登录则 401
3. 配额检查：
   - 查询 autopilotSession 表：count WHERE userId AND generationId AND status != 'aborted'
   - Free 用户 && count >= AUTOPILOT_FREE_SESSIONS_PER_VIZ → 403 "upgrade to Pro"
4. stepNumber === 0 → INSERT autopilotSession 记录
5. 组装 system prompt（getTutorSystemPrompt）+ user prompt（buildTutorUserPrompt）
6. callAnthropic(apiKey, {
     model: AUTOPILOT_MODEL,
     systemPrompt,
     userPrompt,
     maxTokens: AUTOPILOT_MAX_TOKENS,
     temperature: AUTOPILOT_TEMPERATURE,
     baseUrl: process.env.ANTHROPIC_BASE_URL
   })
7. JSON.parse(response.html) → 提取 reflection + action
   失败兜底：返回 { reflection: {...}, action: { tutor_speak: { text: "让我重新思考..." } } }
8. action.done → UPDATE autopilotSession SET status='completed', completedAt=now(), totalSteps
9. stepNumber > 0 → UPDATE autopilotSession SET totalSteps = stepNumber
10. 返回 { reflection, action }
```

**复用现有 `callAnthropic`**（`src/shared/lib/upg/anthropic-client.ts`）。需要调整的是：
- `maxTokens` 从 16000 降到 1024
- `temperature` 从 0.7 降到 0.3
- 返回值 `.html` 字段实际是 JSON 字符串（需 parse）

#### (8) `src/shared/blocks/autopilot/AutopilotBridge.tsx` — ReAct 循环编排

```typescript
interface AutopilotBridgeProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  generationId: string;
  prompt: string;
  language: 'zh' | 'en';
  isActive: boolean;
  onSessionEnd: (result: { totalSteps: number; completedQuiz: boolean }) => void;
}
```

内部实现：
- `useEffect` 监听 `isActive`，启动/停止循环
- `useRef` 保存 `history[]` 和 `sessionId`
- `window.addEventListener('message', handler)` 处理 iframe 消息
- 每步异步循环：等 state → 调 API → 发 action → 等 result → delay → 下一步
- 错误处理：API 调用失败 → 显示 "导师遇到了问题" → 继续（不崩溃）
- `isActive` 变 false → 发 `autopilot:stop` → 清理

#### (9) `src/shared/blocks/autopilot/AutopilotToggle.tsx` — 启动按钮

```typescript
interface AutopilotToggleProps {
  isActive: boolean;
  onToggle: () => void;
  isAvailable: boolean; // HTML 是否包含 data-autopilot
  isLoggedIn: boolean;
  disabled?: boolean;
}
```

UI：
- 可用时：渐变发光按钮 "✨ AI Tutor"
- 进行中时：脉冲动画 + "⏹ Stop"
- 不可用时（旧 HTML）：灰色 "AI Tutor (unavailable)"
- 未登录时：点击提示登录

#### (10) `src/shared/blocks/autopilot/index.ts` — 桶文件

导出 AutopilotBridge 和 AutopilotToggle。

### 4.2 修改文件

#### (1) `src/shared/lib/upg/system-prompt.ts`

**修改 1**：第 1-6 行，添加 import

```typescript
import { getAutopilotDomPrompt } from '../autopilot/prompt-modules/autopilot-dom';
```

**修改 2**：第 51 行，移除 postMessage 禁令

原文：
```
- NEVER use: window.open(), window.location (except hash), postMessage
```
改为：
```
- NEVER use: window.open(), window.location (except hash)
```

**修改 3**：第 71 行后，追加 autopilot 模块

```
${getInteractionPrompt()}

${getAutopilotDomPrompt()}
```

#### (2) `src/shared/lib/upg/constants.ts`

可选：在此文件追加 AUTOPILOT 常量导出，或保持独立文件（推荐独立文件，职责分离）。

#### (3) `src/app/[locale]/(landing)/(ai)/upg/view/[id]/page.tsx`

修改 `UpgViewClient` 调用，传入 `language` 和 `isLoggedIn`：

```typescript
return (
  <UpgViewClient
    id={generation.id}
    prompt={generation.prompt}
    htmlContent={generation.htmlContent}
    isPublic={generation.isPublic ?? false}
    isOwner={isOwner}
    language={(generation.language as 'zh' | 'en') || 'en'}
    isLoggedIn={!!user}
  />
);
```

#### (4) `src/app/[locale]/(landing)/(ai)/upg/view/[id]/client.tsx`

**修改 Props 接口**：

```typescript
interface UpgViewClientProps {
  id: string;
  prompt: string;
  htmlContent: string;
  isPublic: boolean;
  isOwner: boolean;
  language: 'zh' | 'en';  // 新增
  isLoggedIn: boolean;     // 新增
}
```

**新增 state**：

```typescript
const [autopilotActive, setAutopilotActive] = useState(false);
const [autopilotSessionId, setAutopilotSessionId] = useState<string | null>(null);
```

**检测 HTML 是否支持 autopilot**：

```typescript
const isAutopilotAvailable = htmlContent.includes('data-autopilot=');
```

**修改 iframe srcDoc**：

```typescript
const displayHtml = autopilotActive && autopilotSessionId
  ? injectAutopilotScript(htmlContent, autopilotSessionId, language)
  : htmlContent;

<iframe srcDoc={displayHtml} ... />
```

**在 toolbar 中添加 AutopilotToggle**：

在分割线 `<div className="mx-0.5 h-5 w-px bg-border" />` 之前插入。

**渲染 AutopilotBridge**：

```typescript
{autopilotActive && autopilotSessionId && (
  <AutopilotBridge
    iframeRef={iframeRef}
    generationId={id}
    prompt={prompt}
    language={language}
    isActive={autopilotActive}
    onSessionEnd={() => setAutopilotActive(false)}
  />
)}
```

**快捷键 T 切换**：

在 `handleKeyDown` 中添加 `t` 键处理。

#### (5) `src/config/db/schema.ts`

新增 `autopilotSession` 表：

```typescript
export const autopilotSession = pgTable('autopilot_session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  generationId: text('generation_id').notNull()
    .references(() => upgGeneration.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('active'),
  totalSteps: integer('total_steps').default(0),
  language: text('language').notNull(),
  completedQuiz: boolean('completed_quiz').default(false),
  quizCorrect: integer('quiz_correct').default(0),
  durationMs: integer('duration_ms'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}, (table) => [
  index('idx_autopilot_session_user').on(table.userId),
  index('idx_autopilot_session_user_gen').on(table.userId, table.generationId),
]);
```

迁移命令：`pnpm db:generate && pnpm db:push`

## 5. Tutor Agent 工具集

6 个域特定工具（对比 PageAgent 的 10+ 通用工具，大幅简化）：

| 工具 | 参数 | 用途 | 执行位置 |
|------|------|------|---------|
| `set_slider` | `{name: string, value: number}` | 平滑移动滑块到目标值 | iframe |
| `click_button` | `{id: "play"\|"pause"\|"reset"\|"random"}` | 点击控制按钮 | iframe |
| `tutor_speak` | `{text: string}` | 在 Tutor UI 显示消息 | iframe |
| `select_quiz_option` | `{index: number}` | 选择测验答案 | iframe |
| `get_visualization_state` | `{}` | 读取所有滑块值 + 状态 | iframe |
| `get_quiz_state` | `{}` | 读取测验题目和选项 | iframe |
| `done` | `{text: string, success: boolean}` | 结束 session | iframe |

## 6. 实现顺序与依赖关系

```
Phase 1: Foundation（无外部依赖，可独立开发）
├── 1.1 types.ts
├── 1.2 constants.ts
├── 1.3 autopilot-dom.ts (prompt 模块)
└── 1.4 tutor-prompt.ts
    预计：2h

Phase 2: System Prompt（依赖 Phase 1.3）
├── 2.1 修改 system-prompt.ts
└── 2.2 验证：生成新 HTML，确认 data-autopilot 属性存在
    预计：1h

Phase 3: Engine + API（依赖 Phase 1 全部）
├── 3.1 engine.ts（最大工作量：~200 行 JS + Tutor UI）
├── 3.2 inject.ts
├── 3.3 api/autopilot/step/route.ts
└── 3.4 DB schema + migration
    预计：6h

Phase 4: Frontend Integration（依赖 Phase 3 全部）
├── 4.1 AutopilotBridge.tsx
├── 4.2 AutopilotToggle.tsx
├── 4.3 修改 view/page.tsx
└── 4.4 修改 view/client.tsx
    预计：4h

Phase 5: 验证 + 收尾（依赖 Phase 4）
├── 5.1 端到端测试
├── 5.2 Free 配额测试
├── 5.3 旧 HTML 兼容性
└── 5.4 i18n（中/英文引导）
    预计：3h
```

**总计：~16h / 2 工作日**

## 7. 已知限制（V1 范围）

| 限制 | V2 改进方向 |
|------|-----------|
| 旧 HTML 无 `data-autopilot` → 不可用 | 可用 CSS selector 猜测或让用户重新生成 |
| 单向引导（导师操控，学生观看） | V2 加学生文字输入框 + 多轮对话 |
| 关闭页面 session 丢失 | V2 存 history 到 DB，支持恢复 |
| 不消耗 credits | 如果 Haiku 成本升高，可加积分扣减 |
| 20 步硬上限 | V2 可根据可视化复杂度动态调整 |

## 8. 成本估算

| 项目 | 数值 |
|------|------|
| 每步 Haiku 成本 | ~$0.001（input ~500 tokens + output ~200 tokens） |
| 每 session 20 步 | ~$0.02 |
| 100 DAU × 3 sessions/day | ~$6/day |
| 月成本 | ~$180 |
| 每付费转化 ROI | Pro $4.99/月，23 个转化即覆盖成本 |

## 9. 验证清单

- [ ] 生成新 HTML → 确认包含 `data-autopilot` 属性
- [ ] 打开 view 页 → AI Tutor 按钮可见
- [ ] 点击 AI Tutor → 导师问候 → 开始操控滑块
- [ ] 观察滑块动画是否平滑（600ms）
- [ ] 测验引导是否有效（不直接给答案）
- [ ] 20 步后自动结束
- [ ] Free 用户第二次点击 → 提示升级
- [ ] 未登录用户 → 提示登录
- [ ] 旧 HTML → 按钮禁用
- [ ] 中文 viz → 中文引导
- [ ] 英文 viz → 英文引导
- [ ] iframe 中无 API key 泄露
- [ ] postMessage 类型过滤正常工作
