---
name: upg-prompt-engineering-cto-review
status: complete
created: 2026-03-28T23:28:38Z
updated: 2026-03-28T23:28:38Z
---

# CTO Review: UPG Prompt Engineering 升级方案

**评审对象**: `docs/plans/2026-03-28-upg-prompt-engineering-upgrade.md`
**评审结论**: **APPROVE WITH CHANGES** (7 项修正要求，2 项否决)

## 总体评价

方案的问题诊断是准确的：system prompt 100% 聚焦渲染、0% 指导教学，这确实是 UPG 生成质量天花板的根因。A/B 对比表做得扎实，用手写版 pendulum-lab.html 作为基准是对的。三个变更的方向都正确。

但方案在执行细节上有几个关键问题需要修正，主要集中在：重复定义（违反 Single Source of Truth）、pedagogy.ts 内容粒度过细导致 prompt stuffing 风险、以及验证策略过于主观。

## Decision 1: pedagogy.ts 与 physics.ts 的职责重叠 -- 必须修正

**问题**: 方案提出在 `pedagogy.ts` 中加入 Data Dashboard（含能量面板颜色约定 KE=blue/PE=red/Total=green）和 Measurement & Verification（过零点检测）。但 `disciplines/physics.ts` 已经有：

```
### Energy Visualization
- Energy bar chart: kinetic (blue), potential (red), total (green dashed line)
```

以及 Analytical Solution Overlay 中的实测 vs 理论对比概念。这违反 Single Source of Truth。

**决策**: pedagogy.ts 只写学科无关的通用教学框架。所有物理专属内容（能量面板颜色约定、Verlet 积分、过零点测量）必须留在 `disciplines/physics.ts` 或 `threejs-effects.ts` 中。pedagogy.ts 可以写 "Include a real-time data dashboard appropriate to the discipline"，具体面板规格由学科配置提供。

**理由**: 当 chemistry.ts、biology.ts 上线时，它们的 "data dashboard" 内容完全不同（浓度 vs 种群 vs 动能）。如果 pedagogy.ts 里写死了物理面板规格，要么其他学科会忽略，要么要加条件判断——两种都是坏设计。

## Decision 2: 变更 B（Verlet 代码模板追加到 threejs-effects.ts）-- 否决位置，改到 physics.ts

**问题**: 方案把 Verlet 积分、自适应 sub-stepping、阻尼参数模板追加到 `threejs-effects.ts`。但 `threejs-effects.ts` 是**视觉特效模块**（粒子、轨迹线、Shader、InstancedMesh）。物理积分方法不是视觉特效。

而且 `disciplines/physics.ts` 的 `Numerical Methods` 节已经提到 "Default: Velocity Verlet"，但没给代码模板。这才是正确的追加位置。

**决策**: Verlet 代码模板、sub-stepping 模板、阻尼参数说明全部追加到 `disciplines/physics.ts` 的 `systemPromptModule` 中，放在 `### Numerical Methods` 节下。不动 `threejs-effects.ts`。

**理由**: (1) 关注点分离——threejs-effects 管视觉，physics 管物理精度；(2) 其他学科不需要 Verlet（生物/化学模拟不用牛顿力学积分）；(3) physics.ts 已有 Numerical Methods 节，是天然归属。

## Decision 3: pedagogy.ts 内容精简 -- 250 行太多，砍到 ~150 行

**问题**: 方案的 pedagogy.ts 包含 8 个子模块，预计 ~250 行 / ~1600 tokens。其中多项内容要么属于学科配置、要么过于具体（如物理预设例子列表）。250 行通用教学指令塞进 system prompt，对非物理学科是噪音。

**应砍掉的内容**:

1. **Section 4 (Experiment Presets)** 中的 "Physics preset examples by topic" 列表（单摆/弹射/弹簧/波/电路的具体预设参数）-- 这属于学科配置，移到 physics.ts。pedagogy.ts 只保留 "Include 3+ meaningful presets with descriptive labels"
2. **Section 3 (Data Dashboard)** 中的能量面板规格和颜色约定 -- 移到 physics.ts（见 Decision 1）
3. **Section 8 (Measurement & Verification)** 中的过零点检测代码概念 -- 移到 physics.ts
4. **Section 5 (Speed Control)** 中的 Fullscreen 功能 -- 这不是教学设计，是 UI 功能。如果要加，放 interaction.ts

**保留的核心**（~150 行）:
- Teaching Tone（三层结构很好）
- Left Panel Content Structure（四块内容清单很好）
- Data Dashboard 的通用要求（"显示实时数据面板"，具体字段由学科决定）
- Experiment Presets 的通用规则（"3+ 有教育意义的预设"）
- Speed Control（速度倍率，通用）
- Quiz Quality Standards（题型分级，通用且关键）
- Keyboard Shortcuts（通用）
- Toast Notifications（通用）

**目标**: pedagogy.ts ~150 行 / ~1000 tokens，加上 physics.ts 扩充 ~100 行 / ~600 tokens，净增 ~1600 tokens（比原方案少 400 tokens）。

## Decision 4: 预设数量从 "minimum 5" 改为 "minimum 3"

**问题**: 方案要求 MANDATORY minimum 5 个预设。对于简单实验（自由落体、斜面）5 个有意义的预设很难凑——会出现凑数的垃圾预设。而且每增加一个预设就多一个按钮，移动端布局压力大。

**决策**: 改为 "minimum 3, recommended 5"。3 个是硬性要求（default + 2 个有教育对比意义的变体），第 4-5 个是建议但不强制。

**理由**: 手写版 pendulum-lab.html 只有 3 个预设（Earth/Moon/Large Angle），教学效果已经很好。质量重于数量。

## Decision 5: 变更 C（buildUserPrompt 增强）-- 批准，但 experimentConfig 类型定义要提取

**问题**: 方案在 `system-prompt.ts` 中内联定义了 `experimentConfig` 的类型结构。这个类型未来在多处使用（调用方、实验注册表、类型导出），内联定义不利于复用。

**决策**:
1. 在 `src/shared/lib/upg/types.ts`（如果没有则创建）中定义 `ExperimentConfig` interface
2. `buildUserPrompt` 引用该类型
3. 方案中 user prompt 末尾重复 "5+ presets" 的措辞改为 "3+ presets"（与 Decision 4 对齐）

函数签名变更本身是正确的——可选参数、向后兼容，没问题。

## Decision 6: Token 预算分析遗漏了 physics.ts 的扩充

**问题**: 方案的 token 预算表显示 `disciplines/physics.ts` 保持 ~900 不变。但按 Decision 2 和 Decision 3，physics.ts 需要扩充 Verlet 代码模板 + 学科专属教学内容，估计增加 ~600 tokens。

**修正后预算**:

| 变动 | Token 增量 |
|------|-----------|
| pedagogy.ts（精简版） | +1000 |
| physics.ts（扩充） | +600 |
| threejs-effects.ts | 0（不动） |
| user prompt | +100 |
| **总计** | **+1700** |

比原方案的 +2000 少 300 tokens，且内容分布更合理。

**可裁剪的现有内容**（如果 token 预算紧张）:
- `threejs-effects.ts` 的 Noise Dissolve shader 注释（~50 tokens）：当前几乎没有化学实验用到 dissolve
- `interaction.ts` 的 Click-to-Highlight raycaster 代码（~80 tokens）：标记为 "Optional Enhancement" 的代码模板对 AI 的干扰大于帮助，因为 AI 会优先实现可选项而遗漏必选项

但总量 ~9100 tokens 仍在 200K 窗口的 ~4.5% 以内，暂时不需要裁剪。当第 6-7 个学科配置上线后再评估。

## Decision 7: 验证策略不充分 -- 需要量化指标

**问题**: 方案的验收标准是 10 项 checkbox 清单，由人工逐项检查。这对一次性验证够用，但不能回归。每次 prompt 微调后都要人肉检查 3 个实验 * 10 个 checkbox = 30 次判断，不可持续。

**决策**: 在 `quality-checker.ts` 中同步新增以下自动化检查（P1，可以在 pedagogy.ts 落地后一周内补上）:

1. **Quiz 数量检查**: 正则匹配 `quiz-q` class 或 radio button 组，count >= 3
2. **预设按钮检查**: 匹配 `btn-preset` class 或带特定 label 模式的按钮，count >= 3
3. **速度控制检查**: 匹配 `0.25x|0.5x|1x|2x|3x` 文本或 speed-related class
4. **数据面板检查**: 匹配 `overlay-stats` 或 `stat-row` 或 `tabular-nums` 样式
5. **教学文本长度检查**: 左侧面板文本 word count >= 100（粗略但有用）

这些作为 warning 级别（不阻塞生成），但能在批量测试时快速发现 prompt 退化。

**理由**: 方案自己也承认 "quality-checker.ts 的对应更新需要 prompt 落地后才知道该检查什么"——但上面 5 项现在就能确定，不需要等。

## Decision 8: 风险 5.3（与手写 111 个实验的一致性）处理不够 -- 否决 "短期不管"

**问题**: 方案说 "短期：手写实验不改，UPG 作为增强版差异化卖点"。这意味着用户在同一产品内看到两种体验质量——111 个实验没有速度控制/预设/数据面板，UPG 生成的有。这不是差异化，这是产品人格分裂。

**决策**: 不在本方案范围内解决（同意排除），但需要明确记录为 **Tech Debt TD-001**，并在方案文档的 "不在范围内" 部分标注优先级和触发条件：

> **TD-001**: 当 UPG prompt 升级验证通过后，评估将速度控制/预设按钮/Toast 反馈作为通用 HTML 模板注入到手写实验中（类似现有的 `injectPerformanceCode` 模式）。触发条件：UPG 生成质量验证完成 + Wave 9 上线后。

**理由**: 不是要现在做，但要明确知道这笔债存在，以及什么时候该还。

## Decision 9: 工时估算偏乐观

**问题**: 方案估算 Phase 1 ~4h、Phase 2 ~2h、Phase 3 ~2h，总计 ~8h。

Phase 1 的 4h 写 pedagogy.ts 本身没问题，但方案遗漏了：
- physics.ts 扩充（Decision 2 要求把 Verlet 模板搬过去）：+1h
- quality-checker.ts 同步更新 5 项检查（Decision 7）：+2h
- 验证需要生成 3+ 实验并逐项对比，每个实验生成等待 ~30s + 人工检查 ~10min：+1.5h

**修正估算**:

| Phase | 内容 | 时间 |
|-------|------|------|
| Phase 1 | pedagogy.ts（精简版）+ physics.ts 扩充 | 4h |
| Phase 2 | buildUserPrompt 增强 + types.ts | 1.5h |
| Phase 3 | quality-checker.ts 新增 5 项检查 | 2h |
| Phase 4 | 验证（生成 5 个实验，逐项对比） | 2h |
| **总计** | | **9.5h** |

注意变更：原方案的 Phase 2（Verlet 追加到 threejs-effects）被合并到 Phase 1（追加到 physics.ts），原 Phase 3 变为 Phase 2。新增 Phase 3（quality-checker）和 Phase 4（验证）。

## 未识别的风险

方案遗漏了两个风险：

### Risk 5: 非物理学科的 prompt 噪音

当 `discipline='biology'` 时，pedagogy.ts 仍然会注入 "Speed Control 0.25x-3x" 和 "Keyboard Shortcuts"。对于生物学可视化（比如细胞分裂、种群模型），速度控制是有意义的；但对于纯数据展示型实验（比如 Punnett Square），这些要求是噪音。

**缓解**: pedagogy.ts 中的 Speed Control 和 Keyboard Shortcuts 标注为 "for dynamic simulations"，而非 MANDATORY。让 AI 自行判断是否适用。

### Risk 6: Prompt 指令冲突

当前 `system-prompt.ts` 的 CONTENT STRUCTURE 节说 "Quiz Panel: 1-2 multiple-choice questions"。pedagogy.ts 要改为 "3 questions"。如果不同步修改 system-prompt.ts 中的描述，AI 会收到矛盾指令（一处说 1-2，一处说 3），行为不可预测。

**缓解**: Phase 1 实施时，必须同步修改 `system-prompt.ts` 第 52 行的 "1-2 multiple-choice questions" 为 "3 multiple-choice questions (see Pedagogy section)"，以及 "Random Experiment buttons" 加上 "preset experiment buttons"。

## 优先级建议

实施顺序（根据 impact/effort ratio 排序）:

1. **P0**: pedagogy.ts 创建（精简版 ~150 行）+ system-prompt.ts 冲突修正
2. **P0**: physics.ts 扩充（Verlet 代码模板 + 学科专属教学内容）
3. **P1**: buildUserPrompt 增强 + ExperimentConfig 类型提取
4. **P1**: quality-checker.ts 新增 5 项自动化检查
5. **P2**: 验证 + 迭代调优

P0 合计 ~4h，落地后立刻能看到生成质量提升。P1 ~3.5h 巩固质量保障。P2 ~2h 收尾。

## 总结

| 维度 | 评价 |
|------|------|
| 问题诊断 | 准确，A/B 对比有说服力 |
| 解决方向 | 正确，三个变更都有价值 |
| 内容归属 | 需要修正——学科专属内容不应放在通用模块 |
| Token 预算 | 原方案 +2000 偏高，修正后 +1700 更合理 |
| 验证策略 | 需要补充自动化检查，人工 checklist 不可持续 |
| 工时估算 | 从 8h 修正为 9.5h |
| 风险评估 | 遗漏了 prompt 冲突和非物理学科噪音两个风险 |

方案整体方向正确，修正 9 项 Decision 后可执行。核心原则：**pedagogy.ts 只写学科无关的通用教学框架，学科专属内容回归学科配置文件**。
