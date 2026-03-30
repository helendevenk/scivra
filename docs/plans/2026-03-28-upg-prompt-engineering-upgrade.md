---
name: upg-prompt-engineering-upgrade
status: in-progress
created: 2026-03-28T07:24:31Z
updated: 2026-03-28T07:35:00Z
---

# UPG Prompt Engineering 升级方案（v2 — CTO Review 修正版）

> CTO Review: `docs/plans/2026-03-28-upg-prompt-engineering-cto-review.md`
> 9 项 Decision 全部采纳，2 项否决已修正

## 1. 问题陈述

### 1.1 发现方式

将 AetherViz SKILL.md（skill 商店版）生成的单摆实验 HTML 与 Scivra 产品内的 `pendulum-lab.html`（手写）做 A/B 对比，发现 AI 生成的实验在**教学深度**和**交互丰富度**上与手写版存在系统性差距。根因：system prompt 的结构性缺陷，影响所有 175 个实验的 UPG 生成质量。

### 1.2 核心矛盾

当前 UPG system prompt **100% 聚焦渲染技术，0% 指导教学设计**。

| 模块 | 行数 | 关注点 |
|------|------|--------|
| `threejs-core.ts` | ~190 | 场景初始化、灯光、材质 |
| `visual-design.ts` | ~145 | 配色、玻璃拟态、布局 |
| `threejs-effects.ts` | ~255 | 粒子、轨迹、Shader |
| `post-processing.ts` | ~60 | Bloom 效果 |
| `svg-hybrid.ts` | ~105 | SVG ���合渲染 |
| `interaction.ts` | ~80 | 滑块、按钮、Quiz |
| `autopilot-dom.ts` | ~65 | AI Tutor DOM 标注 |
| `disciplines/physics.ts` | ~150 | 物理专项规则 |
| **教学设计** | **0** | **不存在** |

**总计 ~1050 行 prompt，0 行关于"怎么教"。**

### 1.3 A/B 对比证据

| 维度 | 手写版（pendulum-lab.html） | AI 生成版（UPG） | 差距根因 |
|------|---------------------------|-----------------|---------|
| 积分方法 | Velocity Verlet + 自适应 sub-stepping | 简单 Euler | prompt 没给 Verlet 代码模板 |
| 周期测量 | 过零点检测，实测 vs 理论对比 | 无 | prompt 没提"测量验证"概念 |
| 能量面板 | KE/PE/Total 条形图 + 数值 | 无或极简 | prompt 没要求数据面板 |
| 实验预设 | Earth/Moon/Large Angle（3 个） | 仅 Random 按钮 | prompt 只说"Random Experiment" |
| Quiz 质量 | 2 题选择题（偏记忆） | 1-2 题（极简） | prompt 只说"1-2 questions" |
| 教学文本 | 3 段详细解释 | 1-2 段简短文字 | prompt 没指导内容深度 |

## 2. 解决方案

### 2.1 方案概览（CTO 修正后）

四个变更，按优先级排序：

| 变更 | 文件 | 变更量 | 影响面 | 优先级 |
|------|------|--------|--------|--------|
| A. 新增通用教学设计模块 | `prompt-modules/pedagogy.ts` | 新建 ~150 行 | 所有学科所有实验 | P0 |
| B. 扩充物理学科配置 | `disciplines/physics.ts` | 追加 ~100 行 | 物理实验精度+教学 | P0 |
| C. 增强 user prompt | `system-prompt.ts` | 修改 ~40 行 | 每次生成的上下文质量 | P1 |
| D. quality-checker 自动化检查 | `quality-checker.ts` | 追加 ~80 行 | 质量回归保障 | P1 |
| E. Codex 异步审核管线 | `upg/review/` 新目录 | 新建 ~200 行 | 生成后质量门控 | P1 |

> **CTO D2 修正**：Verlet 代码模板从 `threejs-effects.ts` 移到 `physics.ts`。不动视觉特效模块。
> **CTO D1 ���正**：pedagogy.ts 只写学科无关的通用框架，物理专属内容回归 `physics.ts`。
> **CTO D3 修正**：pedagogy.ts 从 ~250 行精简到 ~150 行。

### 2.2 变更 A：新增 `pedagogy.ts`（通用教学框架）

**位置**：`src/shared/lib/upg/prompt-modules/pedagogy.ts`
**注入点**：`system-prompt.ts` 的 `getSystemPrompt()` 中，`getInteractionPrompt()` 之后

**原则**：只写学科无关的通用教学框架。所有物理/化学/生物专属内容由学科配置提供。

#### Section 1: Teaching Tone

```markdown
## PEDAGOGY & EDUCATIONAL DESIGN (MANDATORY)

### Teaching Tone
- Encouraging, rigorous but approachable — like a smart lab partner
- Every interaction gives instant feedback (toast notification, highlight, or value update)
- Include a motivational closing line at the end of the HTML
- Left panel text should answer three questions in order:
  1. "What is this?" (1-2 sentences, plain language definition)
  2. "Why should I care?" (real-world application or exam relevance)
  3. "How does the math describe it?" (formula + variable explanation)
```

#### Section 2: Left Panel Content Structure

```markdown
### Left Panel Content Structure (MANDATORY sections in this order)

1. **Core Formulas** (2-4 KaTeX rendered formulas)
   - Each formula MUST have a one-line plain-English description below it
   - Show the governing equation first, derived quantities second

2. **Concept Explanation** (2-3 paragraphs, ~150 words total)
   - Paragraph 1: What this phenomenon IS, in everyday language
   - Paragraph 2: Key insight — what's surprising or counterintuitive
   - Paragraph 3: Where this matters in real life (engineering, nature, technology)
   - Use <strong> tags to highlight key terms

3. **Knowledge Cards** (2-3 cards with icon + title + 1-2 sentences)
   - Card topics: a historical fact, a common misconception, or an advanced connection
   - Style: glass-card with colored left border matching subject theme

4. **Why It Matters** section
   - 2-3 bullet points connecting to real-world applications
   - At least one AP/exam connection if applicable
```

#### Section 3: Data Dashboard（通用要求）

```markdown
### Data Dashboard (MANDATORY for dynamic simulations)

Display a real-time statistics overlay on the 3D canvas:

**Top-left overlay panel** (semi-transparent, glass style):
- 4-6 key quantities relevant to the discipline, each as: Label | Value + Unit
- Values MUST use `font-variant-numeric: tabular-nums` for stable layout
- Update every animation frame
- Format: 2-3 decimal places, scientific notation for very large/small

The specific quantities, energy panel, and measurement tools are defined by
the discipline configuration (e.g., physics.ts provides energy bar specs and
period measurement patterns). Follow the discipline-specific instructions.
```

> **CTO D1 落地**：能量面板颜色约定（KE=blue/PE=red/Total=green）和过零点测量模式移到 `physics.ts`。

#### Section 4: Experiment Presets

```markdown
### Experiment Presets (MANDATORY, minimum 3, recommended 5)

Besides the "Random" button, include 3+ meaningful preset experiments:

**Design rules:**
- Each preset MUST have a descriptive label (e.g., "Moon (g=1.6)", not "Preset 1")
- Presets should cover: default scenario + 2 contrasting variations with educational value
- The student should wonder "why does it behave differently here?"
- Use styled buttons (`.btn-preset`) grouped near Play/Pause/Reset
- Apply preset by updating all slider values + triggering a reset

Specific preset suggestions are provided by the discipline configuration.
```

> **CTO D4 落地**：从 "minimum 5" 改为 "minimum 3, recommended 5"。

#### Section 5: Speed Control

```markdown
### Speed Control (for dynamic simulations)

Provide simulation speed multiplier:
- Display 4-5 speed options: 0.25x, 0.5x, 1x, 2x, 3x
- Use styled button group, highlight the active speed
- Implementation: multiply deltaTime by speed factor before passing to physics step
- 0.25x is critical for observing fast phenomena in slow motion
- Default: 1x

Skip for static/non-animated visualizations (e.g., Punnett Square, crystal structure viewer).
```

> **CTO Risk 5 落地**：标注为 "for dynamic simulations"，非 MANDATORY。
> **CTO D3 落地**：Fullscreen 功能移到 `interaction.ts`。

#### Section 6: Quiz Quality Standards

```markdown
### Quiz Design Standards

**Quantity:** 3 questions per experiment.

**Question types (in order of educational value):**
1. **Prediction/Application** (BEST): "If you change X, what happens to Y? Why?"
   - Present a scenario the student hasn't directly seen in the simulation
   - Test whether they can APPLY the underlying principle to a new situation
2. **Debugging/Diagnosis**: "A student observes X. What's the most likely cause?"
   - Tests system understanding deep enough to troubleshoot
3. **Conceptual/Tradeoff**: "Why does the formula use sin(θ) instead of θ?"
   - Tests understanding of assumptions and limitations

**What NOT to quiz:**
- Definition recall ("What does T stand for?")
- Formula memorization ("What is the formula for period?")

**Answer feedback:**
- Correct: brief reinforcement of the underlying principle (1 sentence)
- Wrong: encouraging + educational explanation of WHY it's wrong (2-3 sentences)
- Never punitive tone. Never numeric scores.

**Implementation:**
- Radio buttons with "Check" button per question
- Instant color feedback: green correct / red wrong
- Feedback text appears below after checking
```

#### Section 7: Keyboard & Toast

```markdown
### Keyboard Shortcuts (for dynamic simulations)

- **Space**: Toggle Play/Pause
- **R**: Reset simulation
- **1-5**: Speed presets (0.25x, 0.5x, 1x, 2x, 3x)
Display shortcut hints in the "About" dialog.

### Toast Notifications

Show brief toast messages for user actions:
- "Simulation reset" / "Speed: 0.25x" / "Preset: Moon (g=1.6 m/s²)"
- Fixed position top-right, auto-dismiss after 2s, slide-in animation
```

### 2.3 变更 B：扩充 `disciplines/physics.ts`

**文件**：`src/shared/lib/upg/disciplines/physics.ts` 的 `systemPromptModule` 字段

> **CTO D2 落地**：Verlet 代码模板、sub-stepping、阻尼参数放在 physics.ts 的 Numerical Methods 节下。
> **CTO D1/D3 落地**：能量面板规格、过零点测量、物理预设示例从 pedagogy.ts 移到这里。

**追加内容**（~100 行，追加到 `systemPromptModule` 现有内容之后）：

```markdown
### Numerical Methods — Code Templates

#### Velocity Verlet Integration (DEFAULT — use instead of Euler)

Second-order accuracy, conserves energy — critical for pendulums, orbits, springs.

```javascript
function verletStep(state, getAcceleration, dt) {
  const a1 = getAcceleration(state.pos, state.vel);
  const velHalf = state.vel + 0.5 * a1 * dt;
  state.pos = state.pos + velHalf * dt;
  const a2 = getAcceleration(state.pos, velHalf);
  state.vel = velHalf + 0.5 * a2 * dt;
}
```

#### Adaptive Sub-Stepping (MANDATORY)

Never run physics with raw frame deltaTime. Always sub-step:

```javascript
function physicsUpdate(dt) {
  const maxSubStep = 0.002; // 2ms per step
  const steps = Math.ceil(dt / maxSubStep);
  const subDt = dt / steps;
  for (let i = 0; i < steps; i++) {
    verletStep(state, acceleration, subDt);
  }
}
```

#### Damping Parameter

Include a "Damping" slider (0 to 0.5, default 0) when the system has dissipation.
Implementation: add `-damping * velocity` term to acceleration function.

### Energy Dashboard (Physics-Specific)

- Horizontal bar chart: KE (blue #3B82F6), PE (red #EF4444), Total (green #22C55E)
- Bar width = percentage of total energy
- Total energy should stay constant in conservative systems (visual validation for students)
- Place in top-right corner overlay panel

### Period Measurement (for oscillating systems)

- Detect zero-crossings (e.g., angle crosses 0 going in the same direction)
- Time the interval between two consecutive same-direction crossings = one full period
- Display "Measured T" alongside "Theoretical T" in stats panel
- This teaches: theory is approximation (small angle), simulation solves full nonlinear equation

### ArrowHelper 矢量可视化规则 (MANDATORY for physics)

AI 生成的速度/力/加速度箭头常见 bug：方向在过零点时跳变、箭头在低速时视觉偏移。
必须遵循以下模式：

```javascript
// CORRECT: use velocity sign directly, not Math.sign(omega)
// Math.sign(0) = 0 → zero vector → normalize() = NaN → arrow flies off
const speed = Math.abs(linVel);
if (speed > 0.05) {  // hide when nearly zero, don't show tiny glitchy arrows
  const s = linVel > 0 ? 1 : -1;  // smooth sign from continuous value
  dir.set(Math.cos(theta) * s, Math.sin(theta) * s, 0).normalize();
  const len = Math.min(speed * 0.4, 2.5);
  // Scale arrow head proportionally to avoid visual glitches at small lengths
  const headLen = Math.min(len * 0.25, 0.12);
  const headW = Math.min(len * 0.15, 0.08);
  arrow.visible = true;
  arrow.position.copy(objectPos);  // attach to the moving object, not the pivot
  arrow.setDirection(dir);
  arrow.setLength(len, headLen, headW);
} else {
  arrow.visible = false;
}
```

**禁止模式**：
- `Math.sign(omega)` 乘方向分量 → 过零点方向跳变
- 显示长度 < 0.05 的箭头 → 锥头比杆长，视觉混乱
- 箭头 position 设为固定点（如枢轴）而非运动物体位置

### Physics Preset Examples (reference for AI)

| Topic | Suggested Presets |
|-------|------------------|
| Pendulum | Earth (default), Moon (g=1.6), Mars (g=3.7), Large Angle (θ=80°) |
| Projectile | Baseball, Cannonball, 45° Optimal, Moon Shot |
| Spring | Soft/Stiff/Heavy/Critical Damping |
| Wave | Low/High Freq, Constructive/Destructive |
| Circuit | LED, Motor, Heater |
```

### 2.4 变更 C：增强 `buildUserPrompt()` + 修复指令冲突

**文件**：`src/shared/lib/upg/system-prompt.ts`

#### C1: ExperimentConfig 类型提取

> **CTO D5 落地**

新建 `src/shared/lib/upg/types.ts`（如果不存在则创建）：

```typescript
export interface ExperimentPromptConfig {
  parameters?: Array<{ label: string; unit: string; min: number; max: number; default: number }>;
  formulas?: Array<{ latex: string; description: string }>;
  theory?: string;
  challenges?: Array<{ question: string; hint: string }>;
}
```

#### C2: buildUserPrompt 增��

```typescript
import type { ExperimentPromptConfig } from './types';

export function buildUserPrompt(
  topic: string,
  language: 'zh' | 'en',
  discipline?: string,
  experimentConfig?: ExperimentPromptConfig
): string {
  // ...构建 teachingContext（从 experimentConfig 注入参数/公式/理论/挑战）

  return `Create an interactive 3D scientific visualization about: "${topic}"
${disciplineContext}
${langInstruction}
${teachingContext}
Requirements:
- Follow ALL pedagogy requirements: data dashboard, 3+ presets, speed control, 3 quiz questions
- Sliders MUST control physically meaningful parameters and simultaneously update: 3D + vectors + formulas
- Include discipline-specific numerical methods and measurement tools as specified
- Choose the correct render mode: pure 3D / SVG / hybrid

Output the complete HTML file now.`;
}
```

> user prompt 中 "3+ presets" 与 pedagogy.ts 对齐（CTO D4）

#### C3: 修复 system-prompt.ts 指令冲突

> **CTO Risk 6 落地**：必须同步修改

`system-prompt.ts` 第 52 行当前写的：
```
6. **Quiz Panel** — Collapsible ..., 1-2 multiple-choice questions with instant color feedback
```

改为：
```
6. **Quiz Panel** — Collapsible ..., 3 multiple-choice questions with instant color feedback (see Pedagogy section for quality standards)
```

同一节中 "Reset, Random Experiment buttons" 改为：
```
Reset, Random Experiment, and 3+ preset experiment buttons
```

### 2.5 变更 D：quality-checker.ts 自动化检查

> **CTO D7 落地**

**文件**：`src/shared/lib/upg/quality-checker.ts`

新增 5 项 warning 级别检查（不阻塞生成，用于批量回归测试）：

| 检查 ID | 检测方式 | 阈值 |
|---------|---------|------|
| `pedagogy-quiz-count` | 正则匹配 radio button 组或 quiz-q class | count >= 3 |
| `pedagogy-preset-count` | 匹配 btn-preset class 或 preset 相关按钮 | count >= 3 |
| `pedagogy-speed-control` | 匹配 `0.25x\|0.5x\|1x\|2x\|3x` 文本 | 至少 3 个速度选项 |
| `pedagogy-data-dashboard` | 匹配 overlay-stats / stat-row / tabular-nums | 存在至少一个 |
| `pedagogy-teaching-text` | 左侧面板文本提取后 word count | >= 80 words |

### 2.6 变更 E：Codex 异步审核管线（新增）

详见下方第 3 节。

## 3. Codex 异步审核员设计

### 3.1 为什么需要

当前 UPG 生成管线是：**用户输入 → Claude 生成 HTML → 直接存储/展示**。没有质量门控。

`quality-checker.ts`（变更 D）做的是**静态正则检查**——能查"有没有"，不能查"好不好"。它能检测 quiz 数量 >= 3，但不能判断 quiz 题目是记忆型还是应用型。能检测有数据面板，但不能判断面板里的数值是否物理合理。

**Codex 作为异步审核员**可以做静态检查做不了的事：

| 静态检查能做 | Codex 审核能做 |
|-------------|---------------|
| Quiz 数量 >= 3 | Quiz 题目是否为应用型 |
| 有数据面板 | 数据面板的物理量选择是否合理 |
| 有 KaTeX 公式 | 公式是否正确、与主题匹配 |
| 代码语法无报错 | 物理引擎逻辑是否正确 |
| 有预设按钮 | 预设参数是否有教育意义 |
| — | 教学文本是否有科学性错误 |
| — | 整体教学叙事是否连贯 |

### 3.2 管线位置

```
用户输入主题
    ↓
Claude 生成 HTML (system-prompt + pedagogy + discipline)
    ↓
quality-checker.ts 静态检查 (变更 D, 同步, ~50ms)
    ├── PASS → 存储 HTML, 标记 status: "pending_review"
    └── FAIL → 返回用户错误，不存储
    ↓
Codex 异步审核 (变更 E, 异步, ~30-60s)
    ├── PASS → 更新 status: "approved"
    ├── PASS_WITH_NOTES → 更新 status: "approved", 存储审核备注
    └── FAIL → 更新 status: "flagged", 存储失败原因
    ↓
用户立刻看到生成结果 (不等 Codex 审核)
后台审核结果用于：数据统计 / prompt 迭代参考 / 可选的质量标记展示
```

**关键设计决策**：Codex 审核**不阻塞用户体验**。用户提交后立刻看到结果，Codex 在后台异步审核。审核结果用于：
1. 统计质量趋势（prompt 改动后整体合格率是升还是降）
2. 发现系统性问题（某类主题持续不合格 → 需要针对性 prompt 优化）
3. 可选：在 Gallery 中对 "approved" 实验加信任标记

### 3.3 审核维度（Codex Review Prompt）

Codex 审核员检查 6 个维度，每个维度打分 pass / warn / fail：

#### 维度 1: 物理/科学准确性 (Scientific Accuracy)

```
- 公式是否正确？KaTeX 渲染的公式与主题是否匹配？
- 积分方法是否合理？（物理实验应使用 Verlet 而非 Euler）
- 物理常量是否正确？（g=9.81, c=3e8, etc.）
- 能量守恒是否在代码中正确实现？（保守系统 total energy 不应漂移）
- 单位是否一致且正确？
```

#### 维度 2: 教学设计质量 (Pedagogical Quality)

```
- Quiz 题目是否测试应用/预测能力（非记忆/定义回忆）？
- 教学文本是否回答了"是什么/为什么重要/数学如何描述"三层结构？
- 预设实验是否有明确教育意图（标签名是否描述性的，参数差异是否有教学对比价值）？
- 知识卡片内容是否有价值（历史/误解/进阶连接）？
- 错误答案的反馈是否有教育性解释（不仅仅是"错误"）？
```

#### 维度 3: 交互完整性 (Interaction Completeness)

```
- 滑块是否控制有意义的物理参数？
- 滑块变化是否同时更新 3D 场景 + 矢量 + 公式？
- Play/Pause/Reset 是否正常工作？
- 速度控制是否存在（动态模拟场景）？
- 预设按钮是否正确更新所有滑块并重置模拟？
```

#### 维度 4: 数据面板合理性 (Data Dashboard)

```
- 显示的物理量是否与主题相关？（单摆应显示角度/速度/周期，不应显示无关量）
- 数值格式是否合理？（精度、单位、tabular-nums）
- 对周期性系统：是否有实测值 vs 理论值对比？
- 能量面板：保守系统中 total energy 是否稳定？
```

#### 维度 5: 代码健壮性 (Code Robustness)

```
- Three.js 初始化是否在 try-catch 中？
- 是否有 resize handler？
- 是否使用 setAnimationLoop（非手动 requestAnimationFrame）？
- 是否有 deltaTime cap（防止 tab 切换后爆炸）？
- OrbitControls 是否使用库而非自写？
- 是否有内存泄漏风险？（animation loop 中 new Vector3 等）
```

#### 维度 6: 安全合规 (Security)

```
- 是否使用了禁止的 API？（fetch, eval, localStorage, etc.）
- 外部资源是否仅来自 CDN 白名单？
- 是否有 XSS 风险？
```

### 3.4 审核输出格式

Codex 返回 JSON：

```typescript
interface CodexReviewResult {
  overall: 'pass' | 'pass_with_notes' | 'fail';
  dimensions: {
    scientific_accuracy: { score: 'pass' | 'warn' | 'fail'; notes: string };
    pedagogical_quality: { score: 'pass' | 'warn' | 'fail'; notes: string };
    interaction_completeness: { score: 'pass' | 'warn' | 'fail'; notes: string };
    data_dashboard: { score: 'pass' | 'warn' | 'fail'; notes: string };
    code_robustness: { score: 'pass' | 'warn' | 'fail'; notes: string };
    security: { score: 'pass' | 'warn' | 'fail'; notes: string };
  };
  critical_issues: string[];  // 必须修复的问题
  suggestions: string[];       // 可选优化建议
}
```

**判定规则**：
- 任一维度 fail → overall fail
- 所有维度 pass → overall pass
- 有 warn 但无 fail → overall pass_with_notes

### 3.5 实施方式

**方案 A（推荐，已验证）：Codex CLI exec 模式**

通过 Codex CLI 的 `exec` 子命令异步提交审核任务，已实际验证可行。

#### 基础设施配置

Codex CLI 配置文件 `~/.codex/config.toml`：

```toml
openai_base_url = "https://www.packyapi.com/v1"
api_key = "sk-9MgPr...PFh9"  # PackyAPI 代理
```

> **注意**：`base_url` 已废弃，必须用 `openai_base_url`。
> `OPENAI_BASE_URL` 环境变量也已废弃，config.toml 是唯一配置源。

#### 调用方式

```bash
# 从代码库目录运行（需要 git repo）
codex exec \
  -s read-only \
  -C /path/to/scivra \
  -o /tmp/review-result.md \
  "Read the file {html_path} and review it as a quality reviewer..."
```

关键参数：
- `-s read-only`：沙箱只读，审核不需要写权限
- `-C`：指向 git repo 目录（Codex 要求在 git repo 内运行）
- `-o`：最终审核结果写入文件，供后续解析

#### 集成到生成管线（Node.js 包装）

```typescript
// src/shared/lib/upg/review/codex-reviewer.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function submitCodexReview(
  generationId: string,
  htmlPath: string,
  topic: string,
  discipline: string
): Promise<{ taskId: string }> {
  const outputPath = `/tmp/codex-review-${generationId}.md`;
  const prompt = buildReviewPrompt(htmlPath, topic, discipline);

  // 异步启动，不等待完成
  const child = exec(
    `codex exec -s read-only -C ${process.cwd()} -o ${outputPath} "${prompt}"`,
    { timeout: 300_000 }  // 5 min max
  );

  // 记录 PID 用于状态追踪
  await saveReviewTask(generationId, String(child.pid), outputPath);
  return { taskId: String(child.pid) };
}
```

#### 实际验证结果（2026-03-28）

首次审核 `simple-pendulum-v2.html`：
- **模型**: gpt-5.3-codex via PackyAPI
- **耗时**: ~60s
- **Token 消耗**: 145,146
- **审核结果**: pass_with_notes（4 pass + 2 warn）
- **发现的 critical issue**: 能量公式 `E=mgh=½mv²` 语义错误
- **验证结论**: 6 维度审核设计有效，能抓到静态检查抓不到的语义问题

**方案 B（降级）：Claude Haiku API 调用**

当 Codex/PackyAPI 不可用时，降级到 Claude Haiku：

```typescript
const review = await anthropic.messages.create({
  model: 'claude-haiku-4-5-20251001',
  system: REVIEW_SYSTEM_PROMPT,
  messages: [{ role: 'user', content: buildReviewPrompt(html, topic, discipline) }],
});
```

成本约 $0.001/次，但审核深度不如 Codex（无法执行 shell 命令做代码搜索）。

### 3.6 与现有系统的集成点

| 集成点 | 位置 | 改动 |
|--------|------|------|
| 生成后触发审核 | `app/api/upg/generate/route.ts` | 在 HTML 存储成功后调用 `submitCodexReview()` |
| 审核结果回写 | 新建 `app/api/upg/review-callback/route.ts` | Codex 完成后回调更新 `upgGeneration` 表 |
| 数据库字段 | `config/db/schema.ts` `upgGeneration` 表 | 新增 `reviewStatus`, `reviewResult`, `reviewTaskId` 字段 |
| Dashboard 展示 | Admin 后台 | 展示审核统计（合格率、常见问题分布） |

### 3.7 不在 E 范围内

- 审核不合格时自动重新生成（太复杂，先做统计）
- 面向用户展示审核状态（先只给 Admin 用）
- 跨学科审核模板差异化（先用通用审核 prompt，后续按学科拆分）

## 4. Token 预算分析（CTO D6 修正）

| 模块 | 当前 tokens | 改后 tokens | 增量 |
|------|------------|------------|------|
| system-prompt.ts 主体 | ~500 | ~550 | +50 |
| threejs-core.ts | ~1200 | ~1200 | 0 |
| visual-design.ts | ~900 | ~900 | 0 |
| threejs-effects.ts | ~1600 | ~1600 | 0 (不动) |
| post-processing.ts | ~400 | ~400 | 0 |
| svg-hybrid.ts | ~700 | ~700 | 0 |
| interaction.ts | ~500 | ~500 | 0 |
| autopilot-dom.ts | ~400 | ~400 | 0 |
| **pedagogy.ts（新，精简版）** | 0 | ~1000 | +1000 |
| **disciplines/physics.ts** | ~900 | ~1500 | +600 |
| user prompt | ~200 | ~300 | +100 |
| **合计** | ~7300 | ~9050 | **+1750** |

比原方案 +2000 减少 250 tokens。200K 窗口中占比 ~4.5%，可接受。

## 5. 实施计划（CTO D9 修正）

| Phase | 内容 | 时间 | 优先级 |
|-------|------|------|--------|
| **Phase 1** | pedagogy.ts 创建（精简版）+ physics.ts 扩充 + system-prompt.ts 冲突修正 | 4h | P0 |
| **Phase 2** | buildUserPrompt 增强 + ExperimentPromptConfig 类型提取 | 1.5h | P1 |
| **Phase 3** | quality-checker.ts ���增 5 项自动化检查 | 2h | P1 |
| **Phase 4** | Codex 审核管线设计 + review prompt 编写 + API 集成 | 3h | P1 |
| **Phase 5** | 验证（生成 5 个实验，逐项对比，含 Codex 审核试跑） | 2h | P2 |
| **总计** | | **12.5h** | |

## 6. 验收标准

### 6.1 人工清单（Phase 5 验证用）

对改后版本生成的 HTML 实验，逐项检查：

- [ ] 左侧面板有 ≥ 2 个 KaTeX 公式 + 2 段教学文本 + "Why It Matters" 部分
- [ ] 数据面板显示 ≥ 4 个实时物理量（带单位，tabular-nums）
- [ ] 能量面板（对物理有能量守恒的实验）
- [ ] ≥ 3 个有标签名的预设实验
- [ ] 速度倍率控制（动态模拟场景）
- [ ] 3 个应用型 Quiz 题（非记忆型）
- [ ] 键盘快捷键（Space/R）
- [ ] Toast 反馈
- [ ] Velocity Verlet 积分（非 Euler）
- [ ] 实测 vs 理论值对比（对周期性系统）

### 6.2 自动化检查（quality-checker.ts 回归用）

5 项 warning 级别检查全部通过。

### 6.3 Codex 审核基线

首批 5 个测试实验的 Codex 审核结果：
- overall pass 或 pass_with_notes ≥ 4/5
- 无 scientific_accuracy fail

## 7. 风险与权衡

### 7.1 Prompt 变长可能降低遵从率

**缓解**：pedagogy.ts 中每项用 MANDATORY 标记；user prompt 末尾重复核心要求。

### 7.2 生成时间/成本增加 ~25%

**缓解**：maxDuration 60s 足够；成本换质量，合算。

### 7.3 与现有 111 个手写实验的一致性

> **CTO D8 落���**：记录为 Tech Debt TD-001

**TD-001**：当 UPG prompt 升级验证通过后，评估将速度控制/预设按钮/Toast 反馈作为通用 HTML 模板注入到手写实验中。触发条件：UPG 生成质量验证完成 + Wave 9 上线后。

### 7.4 非物理学科的 prompt 噪音

> **CTO Risk 5 落地**

Speed Control 和 Keyboard Shortcuts 标注为 "for dynamic simulations"，非 MANDATORY。

### 7.5 Prompt 指令冲突

> **CTO Risk 6 落地**

Phase 1 实施时必须同步修改 system-prompt.ts 中 "1-2 questions" → "3 questions" 和 "Random Experiment" → "Random + preset experiments"。

### 7.6 Codex 审核延迟/不可用

**缓解**：审核不阻塞用户体验。Codex 不可用时优雅降级为仅静态检查。

## 8. 不在本方案范围内（明确排除）

- 回刷现有 111 个手写实验（独立决策，见 TD-001）
- 其他学科配置增强（先验证 physics 效果，再推广到 chemistry/biology/math/earth-science）
- UPG 端到端联调（独立技术债）
- OrbitControls 预编译（已有独立方案）
- Codex 审核不合格时自动重新生成（先做统计再决定）
- 面向用户展示审核状态（先只给 Admin 用）
