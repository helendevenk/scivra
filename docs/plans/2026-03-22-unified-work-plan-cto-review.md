---
name: unified-work-plan-cto-review
status: approved-with-changes
created: 2026-03-22T10:32:32Z
updated: 2026-03-22T10:32:32Z
---

# CTO 评审：Q2 2026 统一工作计划

> **评审文件**: `2026-03-22-unified-work-plan.md`
> **评审结论**: **APPROVED WITH CHANGES**
> **一句话**: 计划方向正确、优先级合理，但有 3 个 MUST FIX 和 5 个 SHOULD FIX 才能开工。

## 1. 总体判断

**APPROVED WITH CHANGES**

战略方向完全正确："工具先于内容"和"学科解耦现在做"这两个核心判断我同意。PhET 66 对标是硬指标，先建批量管线再铺内容是唯一正确路径。Phase 0.5 的 A0 任务（消除双代码路径）是关键前置，审查过 route.ts 源码后确认：当前 route.ts 104-146 行有完全独立的 AI 调用逻辑，绕过了 generateCore() 中的 input/output moderation，这是安全隐患，必须尽快修复。

但计划存在三个硬伤需要修：Schema 迁移策略有风险、增量生成（B2）时机过早、F1-F3 串行安排导致时间线被拉长。

## 2. 架构风险评估

### 2.1 14 张表一次性迁移的风险

**风险等级: 中**

计划说"一次性 `db:generate && db:push`"。问题不在 Drizzle 的能力，而在**调试颗粒度**。14 张表 + 8 字段 + 1 索引，如果迁移后出问题（外键顺序、命名冲突、索引重复），你面对的是一坨混在一起的 SQL，排查成本高。

但反过来，分 3 批迁移也有问题：每次 db:push 都是中断窗口，Drizzle 的 diff 算法在多次增量迁移时偶尔会产生意外的 ALTER。

**结论**: 一次性迁移可以接受，但必须加两个保护：
1. 迁移前用 `db:generate` 只生成 SQL 文件，人工审查 SQL 再手动执行（不要直接 db:push）
2. 先在本地测试库完整跑一遍，确认 0 error

### 2.2 Phase 0.5 学科解耦对现有 UPG 管线的风险

**风险等级: 低（有门控）**

看过 generate-core.ts 源码，当前管线结构清晰：callOpenRouter → sanitize → quality check → moderation → store。学科解耦的核心改动是 `getSystemPrompt()` 接受 discipline 参数，不传参时行为不变。A10 的 prompt snapshot 强制门控是正确决策。

但有一个隐藏风险：**route.ts 当前绕过了 generateCore() 的 input/output moderation**。route.ts 的 104-146 行直接调 callOpenRouter/callAnthropic → sanitize → quality check，完全跳过了 moderateInput/moderateOutput。这意味着现在线上的生成请求没走内容审核。A0 任务不仅是技术债清理，是安全修复。优先级比文档描述的更高。

### 2.3 批量生成用 callAnthropic 直连 vs OpenRouter 的取舍

**结论: 直连正确，但需要保留 OpenRouter 作为生产路径。**

批量生成是离线 CLI 脚本，直连 Anthropic API 完全合理：
- 成本更低（无中间层加价）
- 延迟更低（少一跳）
- Rate limit 更可控（直接对 Anthropic tier 做规划）

不需要保留 OpenRouter 回退。批量脚本和线上生成是两条独立路径：
- **线上生成**（用户交互）: route.ts → generateCore() → callOpenRouter（保持现有逻辑）
- **批量生成**（离线 CLI）: script → callAnthropic（直连）

这两条路径不需要互相回退。批量脚本失败了就重跑，不需要 fallback 到 OpenRouter。

但我注意到 route.ts 113 行有条件分支：`useAnthropic = baseUrl?.includes('anthropic') || baseUrl?.includes('zenmux')`，说明线上路径已经在用 Anthropic 代理了。A0 迁移到 generateCore() 后，要确保这个 provider 选择逻辑也迁移过去，不能丢。

### 2.4 Phase 3.5 增量生成的复杂度和 token 成本

**风险等级: 高（建议推迟）**

增量生成（B2）是整个计划中我最担心的部分：

1. **复杂度**: "基础场景 → 交互+图表 → Quiz+特效" 三步生成，每步要把前一步 HTML 塞进 context。中间 HTML 可达 50-80KB（按现有实验 HTML 平均大小推算），这是 12K-20K tokens 的 context。三步下来 input tokens 翻 3-4 倍。
2. **Token 成本**: 文档说"10% 请求触发 → 平均 +22%"。但复杂主题（Double Pendulum、AC Circuits）恰好是最容易触发增量的，也是 output 最长的。实际 +22% 估算偏乐观，可能 +35-40%。
3. **回退逻辑**: "中间 HTML > 100KB → 中止增量，回退单次全量"。100KB 阈值没有依据。现有实验 HTML 大部分在 30-80KB，100KB 才触发回退太晚了。
4. **质量问题**: LLM 续写 HTML 的一致性远低于一次性生成。前一步的 CSS 命名、变量命名、DOM 结构会约束后续步骤，容易出现样式冲突和变量重复声明。

**结论**: B2 在 S1 阶段没有紧迫性。先跑完批量生成看通过率，如果一次性生成通过率 > 70%，B2 直接砍掉推到 S2。4 天工时省下来给 F1。

## 3. 时间线合理性

### 3.1 总体判断：92 天 / 19 周偏乐观

调整后预估: **85-88 天 / 18 周**（砍 B2 后反而更短）

### 3.2 各阶段评估

| 阶段 | 计划工时 | CTO 评估 | 调整 |
|------|---------|---------|------|
| Phase 0.5 | 7d | **合理**，A0 是关键但代码量可控 | 保持 7d |
| Phase BG 管线 | 4d | **偏乐观 +1d**，PoC 验证和 prompt 调优不是线性的 | 5d |
| Phase BG P0 | 8d | **合理** | 保持 8d |
| Phase BG P1/P2 | 8d | **偏乐观 +1d**，38 个比 21 个不是线性放大 | 9d |
| Phase 3.5 B1 | 4d | **合理** | 保持 4d |
| Phase 3.5 B2 | 4d | **砍掉或推迟** | 0d (推到 S2) |
| Phase 3.5 B3 | 5d | **合理** | 保持 5d |
| Phase F1 | 22d | **偏悲观 -2d**，5 张表 + 10 API 端点是标准 CRUD | 20d |
| Phase F2 | 16d | **合理** | 保持 16d |
| Phase F3 | 14d | **合理** | 保持 14d |
| 集成联调 | 5d | **偏乐观 +2d**，三模块联调 + 权限矩阵 | 7d |

### 3.3 关键路径

计划中的关键路径正确: **0.5 → BG → 3.5 → F1**。但有一个被忽略的隐性依赖：

**Phase F2 Quest 的 `experimentData` callback 依赖批量生成完成后的实验注册**。文档说 F2 "无硬依赖"，但 Quest 步骤中的 "Observe"（嵌入实验）需要实验 ID 存在于 registry。所以 F2 实际上软依赖 BG P0 完成。

### 3.4 并行机会

1. **Phase 0.5 的 A4 (stub) 和 A9 (UI 选择器) 可与 A5 并行**。A4 只写 stub 不依赖 A5 的 prompt 分层，A9 只依赖 A3 的注册表。省 0.5-1d。
2. **Phase F1 Phase 4 (Admin CRUD) 可与 F2 Phase 1 并行**。Admin 后台是独立的，和 Quest 数据层无交集。
3. **Phase F3 可与 F2 后半段并行**。Notebook 的 AI 辅助层和 Quest 前端开发无任何文件交集。

### 3.5 一个大问题：单人串行

时间线按单人设计，F1 → F2 → F3 纯串行，52 天。如果有第二人（即使是半时间），F2 和 F1 后半段并行可省 10 天，F3 和 F2 后半段并行可再省 7 天。

**如果只有一个人**: 92 天 → 88 天（砍 B2 + 微调），18 周。
**如果有两个人**: 可压缩到 14-15 周。这个差距值得认真考虑。

## 4. 对 6 个决策问题的回答

### 决策 1: Phase 0.5 全做 vs cherry-pick

**结论: 全做。**

理由在文档中已经充分。补充一点：A0（消除双代码路径）不只是 Phase 0.5 的前置，它是现有的安全漏洞修复（route.ts 跳过 moderation）。即使不做学科解耦，A0 也应该立刻做。所以 Phase 0.5 的真实成本是 6 天（A0 那 1 天是安全修复，不算学科解耦的成本）。

### 决策 2: 14 张表一次性迁移

**结论: 同意一次性，但加保护。**

保护措施：
1. `pnpm db:generate` 生成 SQL 后人工审查，不直接 `db:push`
2. 本地 + staging 各跑一遍，生产库最后推
3. 迁移脚本中加 transaction wrap（Drizzle 的 `db:push` 不保证原子性，自己写 migration SQL 时包 transaction）
4. 备份生产库 snapshot 后再推

### 决策 3: 批量生成用 callAnthropic 直连

**结论: 直连，不需要 OpenRouter 回退。**

详见 2.3 节。两条路径独立运行，批量脚本不需要 fallback。

但注意：route.ts 当前已经有条件使用 Anthropic 代理（zenmux），A0 迁移时必须把这个 provider 选择逻辑带到 generateCore() 里，不能只硬编码 callOpenRouter。

### 决策 4: F1-F3 串行 vs 并行

**结论: 如果只有一个人，串行是唯一选择。但强烈建议找第二人并行 F2。**

F2 Quest 和 F1 AP Prep 的代码交集极小（共享 Schema 文件和 learningStats 表，但不同字段）。并行的协调成本低。

如果实在只有一个人，建议把 F3 Lab Notebook 推到 S2。理由：
- F1 AP Prep 和 F2 Quest 对用户增长的贡献远大于 Notebook
- Notebook 的 AI 辅助和 PDF 导出是独立模块，推迟不影响 F1/F2
- 省下 14 天可以把 F1/F2 做得更扎实

### 决策 5: 增量生成（B2）的触发阈值

**结论: S1 不做 B2。**

详见 2.4 节。先跑完批量生成，看一次性生成的通过率：
- 通过率 > 70%: 不做 B2，不合格的手动调 prompt 重跑
- 通过率 50-70%: 考虑做 B2，但阈值提高到 complexity >= 7
- 通过率 < 50%: 问题出在 prompt 质量，B2 解决不了根本问题，应该投入 prompt engineering

### 决策 6: 总工时 92 天 / 19 周

**修正后: 88 天 / 18 周（砍 B2 后）。** 如果再砍 F3 推到 S2，则 **74 天 / 15 周**。

## 5. MUST FIX（不修改不批准）

### MF-1: A0 安全修复标注为 CRITICAL

当前 route.ts 绕过 generateCore() 导致线上请求跳过 input/output moderation。这是安全漏洞，不是技术债。

**要求**: A0 任务描述中必须明确标注 `CRITICAL - SECURITY`，优先级高于 Phase 0.5 其他任务。如果 Phase 0.5 的其他任务被推迟，A0 也必须立刻做。

### MF-2: 迁移策略加保护措施

"一次性 `pnpm db:generate && pnpm db:push`" 这句话太粗暴。

**要求**: 第九节"Schema 迁移策略"中补充：
1. `db:generate` 后人工审查生成的 SQL
2. 本地测试库先跑一遍
3. 生产库迁移前备份
4. 迁移失败的回滚计划（至少是备份恢复）

### MF-3: 批量生成脚本的 provider 逻辑文档化

route.ts 113 行的 provider 选择逻辑（`baseUrl?.includes('anthropic') || baseUrl?.includes('zenmux')`）说明线上已经在用 Anthropic 代理。A0 迁移时这段逻辑必须进入 generateCore()。

**要求**: Phase BG 管线开发（BG1）的技术决策中明确：
- 批量 CLI 脚本直接用 `callAnthropic` + `ANTHROPIC_API_KEY`
- 线上 generateCore() 保持 provider 选择逻辑（Anthropic proxy / OpenRouter fallback）
- 两条路径不互相干扰

## 6. SHOULD FIX（强烈建议）

### SF-1: 砍掉 Phase 3.5 B2（增量生成），推到 S2

理由见 2.4 节和决策 5。4 天工时可以省下来给 Phase BG prompt 调优（+1d）和集成联调（+2d）。

### SF-2: 考虑砍 F3 Lab Notebook 推到 S2

如果只有一个人，52 天做三个功能模块太密集。F3 的边际价值低于 F1/F2 的充分打磨。

### SF-3: Phase BG 成本估算补充 prompt 调优成本

成本表里只算了 "59 个实验 x 1.5 次"，但 prompt 调优（PoC 阶段反复迭代 prompt 模板）的 token 消耗通常是正式生成的 2-3 倍。预计额外 $10-15。总 AI 预算从 $60 调到 $75 更现实。

### SF-4: Phase F2 Quest 的"无硬依赖"改为"软依赖 BG P0"

Quest 的 Observe 步骤需要嵌入已注册的实验。虽然可以用 mock 数据开发，但集成测试依赖 BG P0 完成。时间线不需要调，但依赖关系图需要修正。

### SF-5: 补充 Phase 0.5 A0 的 provider 选择逻辑迁移

A0 任务描述说"route.ts 只负责 auth + rate limiting + credits + lock"，但没提 provider 选择逻辑。当前 route.ts 110-116 行有 OpenRouter/Anthropic 的条件分支，这段逻辑需要迁移到 generateCore() 或 model-selector.ts 中。遗漏这一点会导致迁移后线上生成用错 provider。

## 7. 修订后的工时估算

| 阶段 | 原估算 | 修订 | 变动说明 |
|------|--------|------|---------|
| Phase 0.5 学科解耦 | 7d | **7d** | 保持 |
| Phase BG 管线开发 | 4d | **5d** | +1d prompt 调优和 PoC 迭代 |
| Phase BG P0 内容 | 8d | **8d** | 保持 |
| Phase BG P1/P2 内容 | 8d | **9d** | +1d 38 个实验审核量更大 |
| Phase 3.5 B1 验证 | 4d | **4d** | 保持 |
| Phase 3.5 B2 增量 | 4d | **0d** | 砍掉推 S2 |
| Phase 3.5 B3 修正 | 5d | **5d** | 保持 |
| Phase F1 AP Prep | 22d | **20d** | -2d 标准 CRUD 不需要这么久 |
| Phase F2 Quest | 16d | **16d** | 保持 |
| Phase F3 Notebook | 14d | **14d** | 保持（建议砍但不强制） |
| 集成联调 | 5d | **7d** | +2d 三模块权限矩阵 + 边界测试 |
| **总计** | **92d** | **88d** | -4d |

**时间线**: 18 周（单人）/ 15 周（双人并行 F2）

**AI 预算**: $60 → $75（补充 prompt 调优消耗）

如果采纳 SF-2（砍 F3）: **74d / 15 周（单人）/ 12 周（双人）**

## 签署

**CTO 评审结论**: APPROVED WITH CHANGES

**前置条件**: 完成 3 个 MUST FIX 后开工。MF-1 (A0 安全标注) 和 MF-3 (provider 逻辑) 是文档修改，半天内可完成。MF-2 (迁移保护) 在 Week 5 迁移前完成即可。

**下一步**: 修订计划文档，标注 MUST FIX 已解决，提交开工。
