---
name: d4-phase-d-status-verification
description: 我对 D4 Phase D 当前进度和后续打算的现状快照，逐条供 codex 核验
type: status-verification
created: 2026-05-04T03:02:38Z
updated: 2026-05-04T03:02:38Z
---

# D4 Phase D — Status & Plan Verification

> 这份文档不是计划，而是一份**事实声明清单**。每条声明都是可证伪的，便于
> codex 用 `cwd=/Users/smith/Desktop/scivra` + `sandbox=read-only` 验证后给出
> ✅ / ❌ / ⚠️ 三态结论。源头计划文件：
> `docs/plans/2026-05-03-d4-phase-d-cycle.md`

## A. 项目与计划上下文

- **A1.** 项目根目录是 `/Users/smith/Desktop/scivra`，当前分支是 `main`，工作树中除两份 `docs/plans/2026-05-03-d4-*.md` 和本文件外应当干净。
- **A2.** 当前 cycle 的执行计划文件存在于 `docs/plans/2026-05-03-d4-phase-d-cycle.md`，描述 10 个 wave。
- **A3.** Phase D 的目标是关闭 D4（TS metadata 与 175 个 public HTML 实验之间的同步差异），把 KNOWN_DRIFT 降到接近零，并补齐 AP 标准代码 + 做 NGSS 覆盖缺口审计 + 出可访问性 / HTML JS 质量两份审计报告。
- **A4.** Phase D 计划文件中显式标注的 wave 拆分如下（仅核对编号 → 标题的映射，不评估内容）：
  - W0 Pre-flight verification
  - W1 ms-genetics SLA pre-empt（Option A）
  - W2 AP Bio codes repop（CED 2024）
  - W3 AP Physics 1 codes repop（Fall 2024 redesign）
  - W4 AP Physics 2 + AP Physics C codes repop
  - W5 Codex-review deferred nits batch
  - W6 Phase D close-out + tech-debt log update
  - W7 C5 cosmetic drift clearance（68 slugs）
  - W8 NGSS performance-expectation coverage gap audit
  - W9 Accessibility audit of 175 public HTML simulations
  - W10 HTML JS code-quality audit

## B. 已完成的 wave（claim：8/10 已 merge 进 main）

逐条声明 PR # ↔ wave ↔ 标题的映射，请用 `git log --oneline -25` 验证。

| Wave | PR # | Commit hash | 标题（节录） |
|---|---:|---|---|
| **B1.** W1 | #34 | `31dc968` | feat(d4): ms-genetics SLA pre-empt — Option A applied |
| **B2.** W2 | #35 | `03fdf13` | feat(d4): repopulate AP Bio standard codes from CED 2024 |
| **B3.** W3 | #32 | `3052eba` | feat(d4): repopulate AP Physics 1 standard codes from Fall 2024 CED |
| **B4.** W4 | #33 | `f209eea` | feat(d4): repopulate AP Physics 2 + AP Physics C standard codes |
| **B5.** W5 | #39 | `1b308fb` | feat(d4): codex-review deferred nits batch — content polish |
| **B6.** W8 | #36 | `ab97876` | docs(d4): NGSS K-12 performance-expectation coverage gap audit |
| **B7.** W9 | #37 | `129c067` | docs(d4): WCAG 2.1 AA accessibility audit — 175 public HTML simulations |
| **B8.** W10 | #38 | `5b501c9` | docs(d4): HTML JS code-quality audit on 175 simulations |

- **B9.** 已合并 PR 编号集合 = `{32,33,34,35,36,37,38,39}`，共 **8** 个，**没有** PR #40 / #41 等更高编号被合入。
- **B10.** 计划文件 W6 / W7 截至本快照尚未对应任何 commit 进入 main（即 `docs/reports/d4-phase-d-closeout.md` 不存在；`tests/unit/content/d4-known-drift.json` 仍含 68+ 条 C5 项）。

## C. 当前数值快照（claim：基于本地工作树）

- **C1.** `tests/unit/content/d4-known-drift.json` 当前条目数 = **75**。
- **C2.** 按 `tier` 字段分组：`C5: 69`、`C3: 4`、`C2: 2`、`D: 0`。总和 75。
- **C3.** `ms-genetics` 这条 slug **不再** 出现在 `d4-known-drift.json` 顶层 keys 中（W1 已把它从 drift 中清除）。
- **C4.** **数字异常已定位**（2026-05-04 codex 核验）：父级 handoff 记录 Phase C 收尾时 drift = 75（C5:68 + D:1 + C2:2 + C3:4），W1 计划预期合并后应降到 **74**。实测仍是 75，原因：
  - W1 移除 `ms-genetics`（D-tier 清零，-1）✅
  - W5（PR #39）收紧 `ms-electric-circuits-advanced` 的 Voltage 滑块从 24V → 12V，让 TS 与 HTML 参数范围出现 cosmetic 不一致 → 自动进入 C5 drift（+1）
  - 净变化 = 0，所以总数仍是 75
  - **W6 closeout 报告必须显式记录这一点**（属于"修复一个问题副带引入一个 cosmetic"，不是 regression）

## D. 仓库与远端状态

- **D1.** Git 远端 `deploy` 指向 `https://github.com/helendevenk/scivra.git`，是计划中所有 PR 操作的目标。
- **D2.** Git 远端 `origin` 指向 `https://github.com/yangliu2060/neonphysics.git`，是历史遗留的模板仓库引用，**不应** 用于 Phase D 任何写操作。
- **D3.** 本仓库当前 HEAD 是 `1b308fb`（即 PR #39 squash-merge commit）。
- **D4.** `pnpm test tests/unit/content/ --run` 在 `1b308fb` 之上预期通过 1552 + 64 skipped。`pnpm typecheck` 预期 clean。**本次 session 未本地复跑，依据是 PR #39 merge 时的 CI 证据。** 下次 session 启动 W6/W7 前应先本地复跑这两条作为 baseline gate。

## E. 还剩的 wave（待执行）

按计划文件的剩余项，仅有 **2** 个 wave 没做：

### E1. Wave 7 — C5 cosmetic drift clearance

- **E1.1** 范围：当前 68 + 1（C2 中可能也含 cosmetic）共约 68～69 个 C5 slug。
- **E1.2** 计划方法：4 个 sub-batch（每批约 17 slugs）并行 codex 调用 → typecheck → tests → 用 `mcp__codex__codex` `model="gpt-5"` review gate → PR。
- **E1.3** 目标：把 KNOWN_DRIFT 从当前 **75**（不是计划文件假设的 74，差异原因见 C4）压到 ≤ 6（仅留下少数无法机械修复的 C2/C3）。
- **E1.4** 唯一影响 `d4-known-drift.json` 的 wave 之一（与 W1、W5 同列，须避免与同时进行的 wave 在该文件上冲突）。

### E2. Wave 6 — Phase D close-out + tech-debt log update

- **E2.1** 产物 1：新建 `docs/reports/d4-phase-d-closeout.md`，按计划模板列 PR 表 + drift 轨迹 + 新验证的 workflow 模式 + 显式 deferred 项。
- **E2.2** 产物 2：在 `docs/tech-debt.md` 追加「D4 Phase D — items explicitly deferred」表。
- **E2.3** 性质：纯文档 PR，目标分支 `docs/d4-phase-d-closeout`，无 source code 修改。
- **E2.4** 依赖关系：W6 应在 W7 **之后** 执行，否则 closeout 报告里写不出最终 drift 数字（计划文件 D4 拒收条件之一）。

### E3. 计划之外没有遗漏的 wave

- **E3.1** 已遍历计划文件全文，剩余未启动的 wave 只有 W6 和 W7，没有其它。
- **E3.2** Wave 0（pre-flight）仅是状态检查，不产生 PR；不计入剩余项。

## F. 推荐继续路径（需要用户决策）

我倾向的下一步是 **F1（先 W7 再 W6）**，理由：W6 closeout 报告里要写最终 drift 数字，必须等 W7 把 C5 清掉后才能定稿。但提供两个选项：

- **F1.** **完整收尾**：先 W7（约 4 个 sub-batch，1～2 小时），再 W6（30 分钟）。最终 drift 预期 ≤ 6。
- **F2.** **极简收尾**：跳过 W7，只跑 W6 用现状（drift = 75）封档，把 W7 转入 tech-debt log 作为显式 deferred 项推迟到下个 cycle。

二者都不会破坏 main 当前状态。**F1 是默认推荐。**

## G. 立即可做的小事（与 wave 进度无关）

- **G1.** 仓库当前有两份未 commit 的 plan 文件 `docs/plans/2026-05-03-d4-phase-c-closeout.md` 和 `docs/plans/2026-05-03-d4-phase-d-cycle.md`。建议尽快 commit（一条 `docs(d4): add Phase C closeout + Phase D cycle plan` 即可），避免在切分支前丢失。
- **G2.** 本文件本身（`docs/plans/2026-05-04-d4-phase-d-status-verification.md`）也应一并 commit。

## H. 给 codex 的核验请求

请逐条核验上面 A～G 所有带编号的声明（A1, A2, …, G2），并按以下格式输出：

```
A1: ✅ / ❌ / ⚠️  — 一句话结论（如有偏差，给出实际观察值）
A2: ...
...
```

特别关注：
- 所有 PR # ↔ commit hash ↔ 标题映射（B1～B8）必须严格匹配 `git log` 实际记录
- C1～C4 的数值必须与 `tests/unit/content/d4-known-drift.json` 完全一致
- C4 标记的「数字异常」请定位出具体是哪个 slug 在 Phase D 期间新增进 drift（如能定位）
- B9（PR 编号集合）和 B10（W6/W7 未启动）须用 `git log` + 文件存在性检查双重确认
- D4 的两条断言（test 通过、tsc 干净）请明确标注「未本地复跑，无法核验」如果你不打算执行 pnpm 命令

输出尾部加一段「**总体判定**」：本文档作为继续工作的依据是否可信，最高级别的偏差是什么（如果有）。
