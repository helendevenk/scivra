---
name: upg-prompt-engineering-retrospective-cto-assessment
status: complete
created: 2026-03-28T00:42:14Z
updated: 2026-03-28T00:42:14Z
---

# CTO Assessment: UPG Prompt Engineering 探索复盘

## 总体评价

3 小时探索产出了一个经过验证的升级方案，投入产出比很高。从问题发现到根因定位到方案设计到实际验证，路径干净利落。v2 生成版在 10 项验收标准全部达标、5 项超越手写版这个结果，证明了 prompt engineering 而非代码重写是正确杠杆点。

## 观察与修正

**1. 执行计划 12.5h 偏保守但合理，优先级需微调。**

复盘里的 12.5h 比 CTO review 的 9.5h 多了 3h，主要是加了 Codex 审核管线（P2.2, 3h）。这个增量合理——Codex 审核在实跑中已经证明了价值（捕获能量公式语义错误），值得投入。但 P2.2 应该降为 P2 而非和 quality-checker 同优先级。理由：quality-checker 的 5 项静态检查能在每次 `pnpm test` 中回归，ROI 远高于需要外部 API 调用的 Codex 审核。建议：P1 先落地 prompt + quality-checker（~7.5h），验证生成质量稳定后再做 Codex 管线。

**2. 箭头 bug 的 4 轮迭代暴露了一个流程问题。**

花了 30 分钟在一个最终被删掉的功能上。教训记录得不错（"简洁优于复杂"），但复盘漏了更深层的启示：**UPG 生成的代码需要在 prompt 层面设置"不做什么"的边界**。当前 prompt 只有正面指令（"做 Verlet"、"做预设"），没有负面约束（"不做 ArrowHelper 除非学科配置明确要求"）。建议在 pedagogy.ts 加一个 `### Avoid` 小节，列出 AI 容易画蛇添足的模式。

**3. Codex 审核的 `pass_with_notes` 结果需要定义处理流程。**

复盘记录了 Codex 发现能量公式语义问题，但没有定义：谁看这个 note？什么时候看？触发什么动作？如果只是"后台跑统计"，那这些 notes 会被淹没。建议：Codex 审核结果写入 `upgGeneration` 表的新字段（`reviewStatus` + `reviewNotes`），admin dashboard 加一个"待复查"过滤器。这不影响 12.5h 计划，但要在 P2.2 设计时考虑。

**4. 手写 111 实验一致性（TD-001）的触发条件需要更具体。**

复盘说"Wave 9 上线后"触发，但 Wave 9 是 Chemistry 实验，和物理 prompt 升级没有直接关系。更精确的触发条件应该是：**UPG prompt v2 上线 + 用新 prompt 生成至少 10 个不同物理实验全部通过 Codex 审核后**，评估将预设/速度控制/Toast 注入手写版的工时和优先级。

**5. 缺少回滚方案。**

如果 v2 prompt 上线后生成质量反而下降（比如 token 增加导致某些实验超时、或者教学指令太多导致 AI 忽略视觉质量），怎么办？建议：`getSystemPrompt()` 加一个 `version` 参数，保留 v1 prompt 路径，A/B 测试至少跑 1 周。这不增加多少工时（~30min），但保了底。

## Go / No-Go

**GO.** P1 优先级（prompt + quality-checker, ~7.5h）可以立即开始。P2（Codex 管线）建议 P1 验证通过后再启动。

## 战略建议

UPG 的 prompt engineering 是 Scivra 对 PhET 的核心差异化武器。PhET 每个模拟要 6-12 个月开发周期，Scivra 用 AI 生成 + prompt 升级可以在几天内把所有实验的教学质量拉到同一水平线——这是指数级效率差。

但要注意：prompt 升级的效果完全依赖底层 LLM 的能力。Claude Sonnet 升级换代时，现有的 prompt 可能需要重新调优。建议在 P3 验证阶段，除了测 5 个不同主题，也测一下 Claude Haiku 备用模型的输出质量——如果 Haiku 在新 prompt 下也能达标，那降本空间很大（生成成本减半）。
