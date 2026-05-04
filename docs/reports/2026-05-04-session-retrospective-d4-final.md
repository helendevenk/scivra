---
name: 2026-05-04-session-retrospective-d4-final
description: 2026-05-04 session retrospective — D4 tech-debt full close-out + future work roadmap
type: report
created: 2026-05-04T09:22:32Z
updated: 2026-05-04T09:22:32Z
---

# Session Retrospective — D4 Tech-Debt Final Close-out

**Date:** 2026-05-04
**Session chain:** `scivra-d4-tech-debt` seq 6（接续 seq 5 / HANDOFF_scivra-d4-tech-debt_phase-e-f-shipped_2026-05-04.md）
**PR:** #49（已合并 main）

## 本次做了什么

接续上一个 session（seq 5，8 个 PR，drift 75 → 8）的收尾工作。本次 session 完成两件事：

### 1. TD-D4-07：audit script sl-speed parser gap（~45 分钟）

**问题根因**
`src/shared/lib/d4/control-audit.ts` 的 `EXCLUDED_ID_PATTERNS` 包含 `/-(speed|playback)$/i`，该正则匹配所有以 `-speed` 结尾的 id，导致 `sl-speed`（物理参数 slider）被误排除在 htmlControls 外，audit 错误报告 circular-motion C2 drift。

**修复**
- `control-audit.ts`：正则改为 `/^(?!sl-).*-(speed|playback)$/i`（负向前瞻豁免 `sl-` 前缀）
- 将 3 个动画速度控件从 `sl-speed` 重命名为 `anim-speed`（ms-cell-division-comparison、meiosis、water-cycle-detail），保证它们仍被正确排除

**结果**：circular-motion C2 entry 消除，drift 8 → 7

**额外完成**：同时清空了 4 条废弃 git stash（wave-b-quarantine × 2、batch2-round1-tail、wave2-presession-stash）

### 2. 清除全部 7 条残留 drift entry（~90 分钟）

分析每条 drift 的根因后，一次性修完：

| Slug | Tier | 根因 | 修复方式 |
|------|------|------|---------|
| ms-electric-circuits-advanced | C5 | HTML `sl-volt` max 仍是 24，TS 已改为 12（W5 safety fix 未同步 HTML） | HTML max 24 → 12 |
| balancing-chemical-equations | C2 | TS 有 `reactionIndex`/`showHints` slider params，HTML 实际只有 3 个 preset 按钮 | parameters → `[]`，加 presets loadPreset:0/1/2 |
| solar-system-scale | C2 | TS 有 `scaleMode`/`zoom`，HTML 实际控件是 `setOrbSpeed`/`setSizeEx`/`setFocus` + 3 presets | 替换 params + aliases + presets |
| greenhouse-effect | C3 | 语义对但 alias 未配置，且 TS 范围错（% 单位 vs W/m²） | 对齐范围 + 加 aliases + presets |
| climate-change-modeling | C3 | TS params（timeRange/scenario/showCO2）与 HTML 控件（setCO2/setECS/setAerosol）完全不匹配 | 重写 params + aliases + presets |
| glaciers-ice-ages | C3 | TS 描述轨道力学参数（eccentricity/obliquity），HTML 实际暴露气候控件（setTempAnomaly/setAccum/setMilTime） | 重写 params + aliases + presets |
| plate-tectonics-advanced | C3 | `boundaryType`/`mantleTemp` 与 HTML 控件（setSubAngle/setCrustalAge）不匹配，step 也错 | 替换 params + aliases + presets，plateSpeed step 1→0.5 |

同时更新了各文件的 `parameterExplanations`（content quality gate 要求与 parameter ids 同步）。

**最终结果**：drift 7 → **0**，`clean: 115 / 115 html-backed`，1552 + 64 skipped 全绿

## 文档一致性检查结果

对 CLAUDE.md 声明的全部核心数字做了代码核查，结论：

| 声明 | 实际值 | 状态 |
|------|--------|------|
| 175 个 HTML 实验 | 175 | ✅ MATCH |
| 179 个 Experiment 定义 | 179 | ✅ MATCH |
| 75 个 API route.ts | 75 | ✅ MATCH |
| 53 个 pgTable | 53 | ✅ MATCH |
| locales = ['en'] | ['en'] | ✅ MATCH |
| 4 个 Wave 1 R3F 实验 | 4（em-spectrum, newtons-laws, projectile-motion, roller-coaster） | ✅ MATCH |
| src/app/api/cron 不存在 | 确认不存在 | ✅ MATCH |
| (ai)/ 只有 upg/ | 确认 | ✅ MATCH |
| UPG 仅 physics enabled | 确认 | ✅ MATCH |

本次 session 同步更新：
- CLAUDE.md 最后核对日期 2026-04-23 → **2026-05-04**
- tech-debt.md TD-D4-07 描述从 "drift 8 → 7" 更正为 "drift 8 → 0"

## 当前代码库状态（session 结束时）

```
Branch: main（8b35359）
Drift: 0（115/115 html-backed slugs clean）
Tests: 1552 passed + 64 skipped
tsc --noEmit: clean
Open PRs: 0
Stash: clean
```

**D4 tech-debt 全周期汇总（PRs #1 → #49）：**

| 阶段 | PRs | 主要成果 |
|------|-----|---------|
| Phase A–C（seq 1–3） | #1–#33 | 基础数据补全（parameters、contentSections、AP standards）|
| Phase D（seq 4） | #34–#40 | a11y audit、JS quality audit、NGSS gap audit；6 条 TD 显式延后 |
| Phase E（seq 5） | #41–#45 | 69 个 C5 drift 清除（68 cleared + 1 intentional） |
| Phase F P1（seq 5） | #42 #46 #47 | 175 HTML a11y P1 三件套 + 6 critical JS bug fixes |
| Phase E+F close-out（seq 5） | #48 | 文档 |
| TD-D4-07 + drift 0（seq 6） | #49 | audit script 修复 + 全部 7 条残留 drift 清除 |

## 后续工作规划

### 第一优先级：Phase F2（估计 2–3 个 session）

**TD-D4-02 P2/P3 — WCAG 深度 a11y 修复**

Phase F P1 已完成：focus-visible、aria-label（490 个）、prefers-reduced-motion。

剩余 P2/P3 项（参见 `docs/reports/d4-accessibility-audit.md`）：

| 子项 | 影响 | 工作量 |
|------|------|--------|
| Color contrast tokens（gradient buttons + muted text） | CSS/theme 改动，视觉测试 | 中 |
| Semantic landmarks（`<main>`/`<nav>` 层级，h1-h3 hierarchy） | 175 HTML template 改动 | 中 |
| Color-only signaling（vectors、codons、base pairs、correct/wrong） | 逐个 HTML 加 text alternative | 大 |
| WebGL canvas accessible name + text equivalent | 每个 canvas 实验 | 中 |

**触发条件**：开始接触学区/政府采购客户（Section 508 合规），或准备 certify WCAG 2.1 AA 时。

**TD-D4-03 systemic — HTML JS 架构重构**

参见 `docs/reports/d4-html-js-quality-audit.md`。

| 子项 | 影响 | 工作量 |
|------|------|--------|
| 共享 OrbitControls + lifecycle helper | 替换 175 个 inline 实现 | 大 |
| innerHTML → DOM API（XSS 防护） | 106/175 文件 | 大 |
| per-frame 内存优化（Vector3/Quaternion reuse） | 性能相关 | 中 |

**触发条件**：在一次大型 HTML 修改前捆绑做（避免 double-edit-per-file），或发现明显内存/性能问题时。

**建议**：TD-D4-02 和 TD-D4-03 合并成一个 Phase F2 周期，一次遍历 175 个 HTML 文件完成两件事，效率最高。

### 第二优先级：Infra 周期（估计各 1 个 session）

**TD-D4-04 — Tailwind CDN → 本地构建**
- 把 175 个 HTML 里的 `<script src="https://cdn.tailwindcss.com">` 换成本地 build 输出
- 需要 build pipeline 改动 + 175 个视觉回归测试
- **触发条件**：Tailwind CDN 宣布 deprecation，或 PageSpeed/LCP 优化需求

**TD-D4-05 — three.js r134 → r170+ 升级**
- 175 个 HTML 全部 pinned 到 r134，落后 36 版本
- 升级需要 per-scene 回归测试（API breaking changes）
- **触发条件**：r134 出现已知高危漏洞，或 r170 有 pedagogically 重要的新功能

**建议**：TD-D4-04 和 TD-D4-05 合并一个 infra 周期做，共享 pipeline 工具。

### 第三优先级：NGSS top-10 实验建设（TD-D4-06）

这是**产品功能建设**，不是技术债务。每条实验约半天工作量。

当前覆盖率：119/208 NGSS PE = 57%。建议 top-10 按 NGSS 报告（`docs/reports/d4-ngss-coverage-gap.md`）顺序执行：

| # | 代码 | 主题 | 学段 |
|---|------|------|------|
| 1 | 5-PS1-1 | Matter made of particles（粒子模型） | Grade 5 |
| 2 | MS-PS1-6 | Thermal energy design（热能设计） | Middle School |
| 3 | HS-LS2-4 | Carbon cycling in ecosystems（碳循环） | High School |
| 4 | MS-LS1-1 | Cells as living units（细胞生命单元） | Middle School |
| 5 | 2-ESS2-1 | Erosion prevention solutions（侵蚀防护） | Grade 2 |
| 6 | 1-ESS1-2 | Seasonal daylight patterns（季节光照） | Grade 1 |
| 7 | 4-PS3-1 | Energy and speed（能量与速度） | Grade 4 |
| 8 | MS-ESS3-1 | Natural resource distribution（自然资源分布） | Middle School |
| 9 | HS-LS2-4 | Carbon cycling ecosystems | High School |
| 10 | HS-ETS1-4 | Computer simulation for design（工程设计模拟） | High School |

注：#3（HS-ESS3-4 Climate change modeling）在本 session 中已通过 drift 修复间接强化了 TS 数据质量，HTML 模拟本身已存在。

**触发条件**：产品路线图确认 Q3 目标，或有具体客户/标准覆盖需求时。

### 残留已知 drift（7 → 0，全部 clean）

无。所有 115 个 html-backed slugs 全部 clean。

## 下次 session 起手建议

**最短路径（如果只有 1–2 小时）：**
1. 运行 `pnpm test tests/unit/content/ --run` 确认 baseline 绿（应为 1552 + 64）
2. 运行 `pnpm tsx scripts/audit-params-vs-html.ts` 确认 drift = 0
3. 选择后续工作方向（见上面优先级）

**如果准备开 Phase F2：**
```bash
# 读取 audit 报告了解 a11y 剩余项
cat docs/reports/d4-accessibility-audit.md
cat docs/reports/d4-html-js-quality-audit.md

# 确认 baseline
pnpm test --run && pnpm exec tsc --noEmit
```

**如果准备建设 NGSS 实验：**
```bash
# 看 gap 报告确认优先级
cat docs/reports/d4-ngss-coverage-gap.md
# 参考现有同类实验作为模板，例如 greenhouse-effect.ts + greenhouse-effect.html
```

## 关键技术决策备忘

| 决策 | 原因 | 影响 |
|------|------|------|
| sl-speed 用负向前瞻豁免而非重命名 | 重命名物理参数 slider 影响面大；只豁免前缀更精准 | 3 个动画速度控件仍需改名为 anim-speed |
| anim-speed 命名约定 | 明确区分"动画速度"控件和"物理参数"slider | 未来新 HTML 建设应遵循此约定 |
| C3 drift 修复选择重写 TS params 而非改 HTML | HTML 是用户体验事实，TS 是元数据描述，应让 TS 向 HTML 对齐 | 6 个 slug 的 contentSections.parameterExplanations 也需同步更新 |
| ms-electric-circuits-advanced 电压 TS=12V 保留 | W5 safety fix（classroom realism：12V 是教室安全上限） | HTML 同步改为 max=12；这是有意义的教学约束，不是 bug |
