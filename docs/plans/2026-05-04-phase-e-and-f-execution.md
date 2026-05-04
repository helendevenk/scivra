---
name: phase-e-and-f-execution
description: 单 session 内完成 Phase E（C5 参数对齐 69 slugs）+ Phase F P1（a11y 系统级 + JS 关键 bug）的实施计划
type: plan
created: 2026-05-04T03:35:00Z
updated: 2026-05-04T03:35:00Z
---

# Phase E + Phase F (P1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Subagent dispatch is allowed but limited to 1 worktree at a time per disk constraints.

**Goal:** 在本 session 内闭环 Phase E（69 个 C5 slug 参数对齐 → drift ≤ 6）+ Phase F P1 子集（175 HTML 模板级 a11y 修复 + 6 个高影响 JS bug 修复），最后用 codex 做整轮 review。

**Architecture:** 三 track 并发：(A) Phase E 4 batch 在主循环顺序跑，每 batch 内 4 路 codex 并行；(B) Phase F a11y 单 background subagent + 1 worktree（错峰避开磁盘高峰）；(C) Phase F JS bug 6 个关键文件的外科 Edit 在主循环跑。每条 track 独立分支独立 PR，文件域不重叠。最终 Wave D 由 codex 对 union diff 做 review。

**Tech Stack:** `mcp__codex__codex` 默认账号模型（`gpt-5` 不可用），Agent (general-purpose subagent_type) 带 `isolation: "worktree"` 单实例，Bash + Edit + Write，pnpm tsx scripts/audit-params-vs-html.ts，scripts/d4-generate-known-drift.ts，vitest，tsc，gh CLI，git push deploy main。

---

## 范围 (in / out)

**In scope（本 session 必做）：**
- Phase E：4 个 PR，覆盖 69 个 C5 slug，目标 drift 75 → ≤ 6（仅留 C2/C3 真无解项）
- Phase F a11y P1：1 个 PR，模板级修复 175 HTML 的：(1) `:focus-visible`、(2) slider `aria-label`、(3) `prefers-reduced-motion` 三件套
- Phase F JS bug P1：1 个 PR，外科修复 6 个文件的 critical 行为 bug
- Phase D revisit：codex 对全部 6 PR 的 union diff 做 review，apply critical fixes 后再 ship 一个修复 PR

**Out of scope（显式 deferred 给后续周期，不在本 session 处理）：**
- TD-D4-04 Tailwind CDN 迁移：独立 infra 周期，需 build pipeline + 175 HTML 视觉回归
- TD-D4-05 three.js 升级：独立 infra 周期，每场景回归
- TD-D4-06 NGSS top-10 gap 实现：每条都是周级别的实验构建
- Phase F a11y P2/P3（color contrast token 调整、semantic landmarks 重构、color-only signal 替代）：本 session 只做 P1 三件套
- Phase F JS systemic 重构（lifecycle helper、OrbitControls 换实现、innerHTML → DOM 改造）：留给 Phase F2 周期

**Sequence 与文件冲突避免：**
- Phase E 改 `src/shared/lib/experiments/data/*.ts`（4 batch 顺序，每 batch 独立 17~18 slug）
- Phase F a11y 改 `public/experiments/**/*.html` 全 175 文件
- Phase F JS bug 改 `public/experiments/**/*.html` 中 6 个具体文件
- 三者文件域不冲突（Phase E vs Phase F）；F a11y 与 F JS bug 都改 HTML，但 F JS bug 的 6 文件**会被 F a11y 也改过**，所以 F JS bug 必须 rebase on top of F a11y merge
- Phase E 4 batch 必须顺序：每 batch merge 后会重生成 `tests/unit/content/d4-known-drift.json` snapshot

**特殊处理：**
- `ms-electric-circuits-advanced`（Batch 3 中）当前 C5 是 W5 voltage tightening 故意引入的（PR #39）。该 slug 不做完整 codex 重写，保留 W5 的 12V 上限决定。Phase E 处理时只对齐 alias（让 audit 不报 drift），不动语义。

---

## 风险与回退策略

| 风险 | 触发条件 | 应对 |
|---|---|---|
| 磁盘 ENOSPC（PR #40 教训） | 多 worktree 并行 + 4G+ codex 输出累积 | 严格 1 worktree 上限；每 wave 结束 `df -h /` 检查 ≥10G |
| codex 输出截断 | 单次输出 > 300 行触发上限 | 检测到 `};` + 闭合 ``` 缺失 → 重派一次新 `mcp__codex__codex` call（不要用 codex-reply，PR #25 教训） |
| Phase E 引入 type cast / wrong tier | codex 偶尔违反 `htmlControlAliases: Record<string,string>` 或写 `tier: "basic"` | prompt 模板里强制 type 约束 + Step verification grep 必须 0 hit 才进入下一 step |
| F a11y 模板批改破坏现有 inline styles | sed/regex 批量替换的副作用 | 每批改后 spot-check 5 个文件视觉打开（subagent 报告里贴前 N 行 diff） |
| F JS bug 修复破坏物理模型 | 逻辑误改 | 每文件 codex review pass 必须确认 "no scientific concept change" |
| CI 失败 | typecheck / vitest 红 | 立即 STOP，不开下一 wave；本地复现 + 修；不 force-push |

**回退原子单位：** 每个 PR 独立 squash-merge；任何 PR 出现回归都可单独 `git revert <commit>`。

---

## Pre-flight (Wave 0)

**目标：** 在动手前确认环境就绪、baseline 干净。

- [ ] **Step 0.1：磁盘预检**

```bash
df -h / /tmp 2>&1 | head -10
```

期望：`/` 可用 ≥ 10Gi。如不足 STOP 并清 `/tmp`、worktree、Docker images。

- [ ] **Step 0.2：仓库状态确认**

```bash
git status -s
git log --oneline -3
```

期望：工作树干净，HEAD = `0fed718` (status verification doc)，本地 = deploy/main。

- [ ] **Step 0.3：Baseline 测试 + typecheck**

```bash
pnpm test tests/unit/content/ --run 2>&1 | tail -10
pnpm exec tsc --noEmit 2>&1 | tail -10
```

期望：1552 passed + 64 skipped；tsc clean。

- [ ] **Step 0.4：Drift 基线快照**

```bash
python3 -c "
import json; from collections import Counter
d = json.load(open('tests/unit/content/d4-known-drift.json'))
print(f'Drift: {len(d)}')
print(Counter(e.get('tier','?') for e in d.values()))
" > /tmp/drift-pre-phase-e.txt
cat /tmp/drift-pre-phase-e.txt
```

期望：`Drift: 75` + `Counter({'C5': 69, 'C3': 4, 'C2': 2})`。

- [ ] **Step 0.5：Phase E codex prompt 模板（共享，单一来源）**

把以下模板存到 `/tmp/phase-e-codex-prompt-template.txt` 供后续 batch 引用：

```
Output ONLY a complete TypeScript file in a single ```typescript code block. No prose outside the fence.

Read these files for context:
- `src/shared/lib/experiments/data/<SLUG>.ts` (the file to replace)
- `src/shared/lib/experiments/data/k5-mixtures-solutions.ts` (canonical structure example)

Slug `<SLUG>` HTML reality (N controls):
<INSERT HTML CONTROL LIST HERE — id, kind, ranges, defaults>
<INSERT PRESET BUTTON LIST HERE — id, label, target>

CRITICAL TYPE CONSTRAINTS (do NOT violate or use casts):
- `htmlControlAliases` type is `Record<string, string>`. Values are PLAIN STRINGS, not objects. Write `{ paramId: "domId" }` NOT `{ paramId: { domId: "x" } }`.
- Parameter `tier` must be one of `"free" | "pro" | "max"`. NEVER use `"basic"` or any cast.

Transform rules:
1. Replace `parameters[]` with N entries: <id, label, unit, min, max, default, step, tier "free">
2. REMOVE old <X, Y, Z> parameters entirely (where X/Y/Z = the slug's missingInHtml list from drift snapshot)
3. Add htmlControlAliases: { paramId: "domId", ... } between jsonLd and contentSections
4. Add presets: [...] between htmlControlAliases and contentSections
5. Update `instructions` to reference N sliders + M presets
6. Replace `parameterExplanations` to have N keys, 80-150 words each
7. Replace ALL `teacherUseCases` referencing new params + presets; keep NGSS standards intact
8. SCRUB FAQ + misconceptions text that references removed params — rewrite using new control names. Do NOT mention any removed param anywhere in the file. Keep all OTHER fields verbatim (id, slug, htmlPath, primaryStandard, category, subject, gradeLevel, thumbnail, tags, jsonLd, standards.ngss, standards.ap, standards.gcse, etc.).

Output the complete replacement file now.
```

调用约定：`mcp__codex__codex` with `approval-policy="never"`, `sandbox="read-only"`, `cwd="/Users/smith/Desktop/scivra"`, NO `model` override（账号默认）。

---

## Wave A — Phase E C5 clearance

**总产出：** 4 个 PR（每 batch 一个），覆盖 69 个 C5 slug，drift 75 → ≤ 6。

**通用执行模式（每 batch 5 个 step，每个 step 详见 Batch 1 模板，Batch 2-4 引用同模板，仅替换 slug 列表）：**

### Batch 1 — 18 slugs

**Slugs:**
1. acid-base-ph
2. amperes-law
3. atomic-structure
4. beers-law-lab
5. build-a-molecule
6. calorimetry
7. cellular-respiration
8. chemical-equilibrium
9. circuit-ac-virtual-lab
10. circular-motion
11. dna-double-helix
12. dna-replication-detail
13. electric-field-lines
14. electrochemistry
15. electron-configuration
16. enzyme-kinetics
17. evidence-of-evolution
18. fluid-statics

**Files:**
- Create branch: `feat/d4-phase-e-batch1`
- Modify: 18 个 `src/shared/lib/experiments/data/<slug>.ts`
- Modify: `tests/unit/content/d4-known-drift.json`

- [ ] **Step A1.1：拉 18 slug 的 audit 数据**

```bash
python3 << 'EOF'
import json
slugs = ['acid-base-ph','amperes-law','atomic-structure','beers-law-lab','build-a-molecule','calorimetry','cellular-respiration','chemical-equilibrium','circuit-ac-virtual-lab','circular-motion','dna-double-helix','dna-replication-detail','electric-field-lines','electrochemistry','electron-configuration','enzyme-kinetics','evidence-of-evolution','fluid-statics']
out = {}
for line in open('_phase3-research/d4-audit/audit.jsonl'):
    r = json.loads(line)
    if r['slug'] in slugs:
        out[r['slug']] = {
            'htmlControls': r.get('htmlControls', []),
            'missingInHtml': r.get('diff', {}).get('missingInHtml', []),
            'missingInTs': r.get('diff', {}).get('missingInTs', []),
        }
import os; os.makedirs('/tmp/phase-e', exist_ok=True)
json.dump(out, open('/tmp/phase-e/batch1-audit.json', 'w'), indent=2)
print(f'Wrote {len(out)} slugs to /tmp/phase-e/batch1-audit.json')
EOF
```

- [ ] **Step A1.2：分支创建**

```bash
git checkout main && git pull deploy main
git checkout -b feat/d4-phase-e-batch1
```

- [ ] **Step A1.3：4 路并行 codex 调用**

把 18 slug 切成 4 子组（5+5+4+4），单条消息内派 4 个 `mcp__codex__codex` 调用。每条 prompt 用 Step 0.5 的模板，把 `<SLUG>` / `<INSERT HTML CONTROL LIST HERE>` / `<INSERT PRESET BUTTON LIST HERE>` 用 `/tmp/phase-e/batch1-audit.json` 里的实际数据替换。

调用结构：
- Codex call 1: slugs 1-5（acid-base-ph, amperes-law, atomic-structure, beers-law-lab, build-a-molecule）→ prompt 内串成 5 段，让 codex 一次输出 5 个 `<typescript>` block
- Codex call 2: slugs 6-9
- Codex call 3: slugs 10-13
- Codex call 4: slugs 14-18

⚠️ 单 prompt 内串多个文件容易超输出限制。**首选每 codex call 仅 1 个 slug**（即 18 个 slug = 18 个 codex call），分 5 轮派发（4-4-4-4-2 或类似），每轮 4 路并行。每轮等所有 4 个返回再派下一轮，避免账号并发上限。

- [ ] **Step A1.4：codex 输出完整性检查**

每个 codex 返回必须以 `};` + 闭合 ```` ``` ```` 结尾。如果某 slug 输出 < 150 行 → STOP，重派该 slug 单独 codex call（不要用 codex-reply）。

- [ ] **Step A1.5：写入 18 个 .ts 文件（每文件 Read 后 Write）**

对每 slug：
1. `Read('src/shared/lib/experiments/data/<slug>.ts')`（Write 前置要求，每文件首读 5 行即可）
2. `Write('src/shared/lib/experiments/data/<slug>.ts', <codex output>)`

⚠️ `ms-electric-circuits-advanced` 不在本 batch（在 Batch 3）。但通用规则：如果某 slug 的现有 voltage/range 是上 wave 故意收紧的（W5），保留收紧值，prompt 里需要明确告知 codex。Batch 1 的 18 个均无此情况。

- [ ] **Step A1.6：spot-check stale references**

```bash
for slug in acid-base-ph amperes-law atomic-structure beers-law-lab build-a-molecule calorimetry cellular-respiration chemical-equilibrium circuit-ac-virtual-lab circular-motion dna-double-helix dna-replication-detail electric-field-lines electrochemistry electron-configuration enzyme-kinetics evidence-of-evolution fluid-statics; do
  # Read missingInHtml from /tmp/phase-e/batch1-audit.json for this slug,
  # then grep the new TS file for any of those param names
  python3 -c "
import json
audit = json.load(open('/tmp/phase-e/batch1-audit.json'))
removed = audit['$slug']['missingInHtml']
content = open(f'src/shared/lib/experiments/data/$slug.ts').read()
hits = [p for p in removed if p in content]
if hits: print(f'$slug: STALE refs {hits}')
"
done
```

期望：所有 slug 0 hit。如有 hit → Edit 工具内联修复。

- [ ] **Step A1.7：type 约束验证**

```bash
grep -E 'tier:\s*"basic"|domId:|tier:\s*"[a-z]+" as ' src/shared/lib/experiments/data/{acid-base-ph,amperes-law,atomic-structure,beers-law-lab,build-a-molecule,calorimetry,cellular-respiration,chemical-equilibrium,circuit-ac-virtual-lab,circular-motion,dna-double-helix,dna-replication-detail,electric-field-lines,electrochemistry,electron-configuration,enzyme-kinetics,evidence-of-evolution,fluid-statics}.ts 2>&1 | head -20
```

期望：0 hit。如 hit → 修复后重新 grep。

- [ ] **Step A1.8：drift snapshot 重生成 + 验证**

```bash
pnpm tsx scripts/audit-params-vs-html.ts 2>&1 | tail -5
pnpm tsx scripts/d4-generate-known-drift.ts 2>&1 | tail -5
python3 -c "
import json
slugs = ['acid-base-ph','amperes-law','atomic-structure','beers-law-lab','build-a-molecule','calorimetry','cellular-respiration','chemical-equilibrium','circuit-ac-virtual-lab','circular-motion','dna-double-helix','dna-replication-detail','electric-field-lines','electrochemistry','electron-configuration','enzyme-kinetics','evidence-of-evolution','fluid-statics']
d = json.load(open('tests/unit/content/d4-known-drift.json'))
hit = [s for s in slugs if s in d]
assert not hit, f'still in drift: {hit}'
print(f'✅ all 18 absent from drift; total drift now {len(d)}')
"
```

期望：drift 75 → 57（减 18）。

- [ ] **Step A1.9：tsc + content tests**

```bash
pnpm exec tsc --noEmit 2>&1 | tail -10
pnpm test tests/unit/content/ --run 2>&1 | tail -8
```

期望：tsc clean，1552 + 64 skipped。

- [ ] **Step A1.10：commit + push + open PR**

```bash
git add src/shared/lib/experiments/data/{acid-base-ph,amperes-law,atomic-structure,beers-law-lab,build-a-molecule,calorimetry,cellular-respiration,chemical-equilibrium,circuit-ac-virtual-lab,circular-motion,dna-double-helix,dna-replication-detail,electric-field-lines,electrochemistry,electron-configuration,enzyme-kinetics,evidence-of-evolution,fluid-statics}.ts tests/unit/content/d4-known-drift.json

git commit -m "$(cat <<'EOF'
feat(d4): Phase E batch 1 — 18 C5 slugs aligned via codex parallel

Resolves the first 18 of 69 C5 cosmetic-tier drift entries deferred
from Phase D (PR #40). Each slug rebuilt via codex from the C3-validated
prompt template; all parameters / aliases / presets / explanations /
teacherUseCases / FAQ regenerated to match HTML reality.

Drift: 75 → 57.
EOF
)"

git push -u deploy feat/d4-phase-e-batch1

REPO=$(git remote get-url deploy | sed 's|.*github.com[:/]||;s|\.git$||')
gh pr create --repo "$REPO" --base main --title "feat(d4): Phase E batch 1 — 18 C5 slugs aligned via codex parallel" --body "$(cat <<'EOF'
## Summary
- Phase E batch 1 of 4: 18 C5 slugs aligned to HTML reality
- All slugs rebuilt via codex from validated C3 prompt template
- Drift trajectory: 75 → 57

## Test plan
- [x] tsc clean
- [x] tests/unit/content/ all pass (1552 + 64 skipped)
- [x] All 18 slugs absent from `tests/unit/content/d4-known-drift.json`
- [x] No stale param references in any of the 18 files
EOF
)"
```

- [ ] **Step A1.11：等 CI + squash-merge**

```bash
PR_NUM=$(gh pr view --json number --jq '.number')
gh pr checks "$PR_NUM" --repo helendevenk/scivra --watch 2>&1 | tail -10
gh pr merge "$PR_NUM" --repo helendevenk/scivra --squash --delete-branch
git checkout main && git pull deploy main
df -h / | head -3   # 磁盘检查
```

期望：CI 7/7 ✅；merge 完成；磁盘 ≥ 10Gi。

### Batch 2 — 18 slugs（k5 集群）

**Slugs:** gas-properties, gauss-law, gravitational-fields, immune-system, k5-animal-adaptations, k5-day-night-seasons, k5-food-chain, k5-habitats, k5-landforms-erosion, k5-magnetism, k5-plant-life-cycle, k5-simple-machines, k5-solar-energy, k5-sound-waves, k5-stars-space, k5-states-of-matter, k5-water-cycle, k5-weather-measurement

**特殊 prompt 加注：** Batch 2 含 14 个 `k5-*` slug。在 codex prompt 末尾追加：

```
K-5 READING LEVEL CONSTRAINT: This slug targets K-5 students. In contentSections (whatIsIt, parameterExplanations, faq, misconceptions), use everyday language. Avoid technical terminology like "vector", "coefficient", "harmonic", "Snell's law" — substitute with kid-friendly equivalents ("arrow that shows direction", "amount", "wobble", "bending of light"). Keep teacherUseCases professional (they're for teachers).
```

- [ ] **Step A2.1 — A2.11**：步骤同 Batch 1，slug 列表替换为 Batch 2 的 18 个；prompt 加 K-5 读级约束；分支 `feat/d4-phase-e-batch2`；commit 信息相应改。

期望终态：drift 57 → 39。

### Batch 3 — 18 slugs（含 1 个特殊 slug）

**Slugs:** lorentz-force, masses-springs-basics, meiosis, membrane-transport, mineral-identification, molecular-polarity, moon-geology, ms-acid-base-reactions, ms-atoms-molecules, ms-chemical-bonding, ms-chemical-reactions, ms-chemical-stoichiometry, ms-ecosystems, **ms-electric-circuits-advanced**, ms-food-web-dynamics, ms-genetics-punnett, ms-photosynthesis-respiration, ms-plate-tectonics

**⚠️ ms-electric-circuits-advanced 特殊处理：**

该 slug 的当前 C5 是 W5（PR #39）有意为之 — Voltage 滑块在 TS 端从 24V 收紧到 12V，HTML 端仍允许 1-24V，构成 TS-tighter-than-HTML 的有意 drift。**不能让 codex 把它改回去对齐 HTML 的 24V。**

处理方式：在 ms-electric-circuits-advanced 的 codex prompt 里加一段：

```
SPECIAL CONSTRAINT FOR THIS SLUG: The Voltage parameter MUST keep max=12 (NOT the HTML's max=24). This is an intentional pedagogical safety choice from PR #39 — 24V across 1Ω yields 24A current, unrealistic for classroom narrative. Document this in the parameterExplanations entry for voltage: mention that the TS-side cap is intentionally tighter than the HTML max for safety/realism reasons, and that this is the only such intentional drift in the catalog.
```

执行后该 slug 仍会留在 drift snapshot（因为 audit 还会标 range mismatch），但 tier 会保持 C5 + 注释属于 intentional。可在 Step A3.8 后补一条 audit override（追加 slug 名到 audit 脚本的"intentional drift"白名单），让 audit 不再为它生成 drift entry。如果时间紧 → 留在 drift 不阻止 ship，Phase D 已记录。

- [ ] **Step A3.1 — A3.11**：步骤同 Batch 1 + 上述 ms-electric-circuits-advanced 特殊处理；分支 `feat/d4-phase-e-batch3`。

期望终态：drift 39 → 21（如果 ms-electric-circuits-advanced 仍留在 drift 则 22；接受）。

### Batch 4 — 15 slugs

**Slugs:** ms-weather-systems, natural-selection, neuron-action-potential, photosynthesis, photosynthesis-light-reactions, reaction-kinetics, rlc-circuit, rotational-kinematics-advanced, rotational-motion, simple-harmonic-motion, solutions-dilutions, stoichiometry, thermochemistry, water-cycle-detail, wave-interference

- [ ] **Step A4.1 — A4.11**：步骤同 Batch 1（无特殊 slug）；分支 `feat/d4-phase-e-batch4`。

期望终态：drift 22 → 6 (~)（剩余 4 个 C3 + 2 个 C2 真无解项）。

---

## Wave A 完成 gate

- [ ] 4 个 PR 全部 merge 进 main
- [ ] `tests/unit/content/d4-known-drift.json` 条目数 ≤ 7（含可能保留的 intentional ms-electric-circuits-advanced）
- [ ] 4 个 PR 的 commit 都在 `git log --oneline -10` 中可见
- [ ] 磁盘 ≥ 10Gi 可用
- [ ] tsc 干净，content tests 1552 + 64 skipped

如任一 gate 不满足 → STOP，进入 triage 而不是开 Wave B。

---

## Wave B — Phase F a11y P1（背景 subagent + 1 worktree）

**总产出：** 1 个 PR，模板级修复 175 HTML 文件的三件套（focus-visible + slider aria-label + prefers-reduced-motion）。

**调度策略：** 与 Wave A Batch 2/3/4 错峰并发——在 Wave A Batch 1 PR 已 merge、Batch 2 codex 调用完成后启动 background subagent。subagent 用 `isolation: "worktree"` 拿到独立 worktree（约 5G 占用），避免与主循环 git 状态冲突。

**Subagent 任务规格：**

- [ ] **Step B.1：在主循环准备 subagent prompt**

prompt 内容（复用 Step 0.5 风格的精确指令）：

```
你被 dispatch 为 Phase F a11y P1 background subagent。任务：在你的 worktree 内为 `public/experiments/**/*.html` 中所有 175 个 HTML 文件做 3 项模板级 a11y 修复，最后开 PR。

# 任务清单（按顺序）

## 步骤 1：列出 175 个 HTML 文件
```bash
find public/experiments -name '*.html' -type f | wc -l   # 预期 175
find public/experiments -name '*.html' -type f > /tmp/a11y-targets.txt
```

## 步骤 2：模板级修复 — `:focus-visible`
对每个文件：
- 在 `<style>` 块末尾插入：
```css
:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
input[type="range"]:focus-visible { outline: 2px solid #3b82f6; outline-offset: 4px; }
button:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
```
- 同时**移除** `input[type="range"] { ... outline: none; ... }` 的 outline:none（如有）

用 Python 脚本一次扫 175 个文件。检查：每个文件 `<style>` 块存在；如果不存在，跳过该文件并记入 `/tmp/a11y-skip.log`。

## 步骤 3：模板级修复 — slider `aria-label`
对每个文件：
- 找所有 `<input type="range" id="..." ...>` 标签
- 从前面的 `<label for="...">` 或 sibling `<div class="sidebar-title">` 提取标签文本
- 给每个 range input 加 `aria-label="<提取的文本>"` 属性（如果已有则跳过）

边界处理：找不到对应 label → fallback 用 id 字符串（如 `sl-mut` → `aria-label="Mutation Rate slider"`，做 id-to-label 启发式：去 `sl-` 前缀，转 title case，加 " slider" 后缀）。

## 步骤 4：模板级修复 — `prefers-reduced-motion`
对每个文件：
- 在 `<style>` 块末尾追加：
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
- 在 `<script>` 块开头插入 reduced-motion 哨兵：
```js
const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```
- 该常量供 `renderer.setAnimationLoop` 内部判断（本 wave **不**改 animation 逻辑，仅暴露 flag；进一步动作留 Phase F2）

## 步骤 5：本地验证
```bash
# 抽 5 个文件视觉检查 diff（git diff <file> | head -60）
git diff public/experiments/elementary/k5-physics-light-propagation.html | head -80
git diff public/experiments/middle/ms-genetics.html | head -80
git diff public/experiments/highschool/circular-motion.html | head -80
git diff public/experiments/ap/molecular-polarity.html | head -80
git diff public/experiments/ap/protein-synthesis.html | head -80

# 全文件计数：每文件应有 +5~10 行
git diff --shortstat public/experiments
```
预期：175 文件 modified，~1500-2500 行新增，~50-200 行删除（删的是旧 outline:none）。

## 步骤 6：tsc + tests（即使 a11y 不改 TS，跑确认无副作用）
```bash
pnpm exec tsc --noEmit 2>&1 | tail -5
pnpm test tests/unit/content/ --run 2>&1 | tail -5
```
预期：tsc clean，1552 + 64 skipped。

## 步骤 7：commit + push + PR
```bash
git checkout -b feat/d4-phase-f-a11y-p1
git add public/experiments/
git commit -m "feat(d4): Phase F a11y P1 — focus-visible + slider aria-label + reduced-motion (175 HTML)"
git push -u deploy feat/d4-phase-f-a11y-p1
gh pr create --repo helendevenk/scivra --base main --title "feat(d4): Phase F a11y P1 — template-level WCAG fixes (175 HTML)" --body-file <(cat <<EOF
## Summary
Template-level WCAG 2.1 AA fixes per Wave 9 audit (PR #37):
- :focus-visible outline ring on all interactive elements (175 files)
- aria-label on all <input type="range"> sliders (175 files)
- prefers-reduced-motion media query + JS sentinel (175 files)

Does NOT include: animation-pause logic for reduced-motion sentinel
(deferred to Phase F2), color contrast token fixes, semantic landmark
restructuring.

## Test plan
- [x] Static diff spot-checked on 5 sample files
- [x] tsc clean
- [x] tests/unit/content/ all pass (1552 + 64 skipped)
EOF
)
```

## 返回
完成后向主 agent 返回：PR 编号、最终 line count、5 个 spot-check 文件的 diff 行数、任何 skip 的文件名。
```

- [ ] **Step B.2：subagent 派发**

主循环用 `Agent` 工具：
- `subagent_type: "general-purpose"`
- `description: "Phase F a11y P1 (175 HTML)"`
- `isolation: "worktree"`
- `prompt: <上面 Step B.1 的完整内容>`
- `run_in_background: true`（让主循环继续 Wave A Batch 3）

记录 subagent ID 以便 SendMessage 续接。

- [ ] **Step B.3：subagent 完成后主循环验证 + merge**

收到 subagent 完成通知后：
```bash
PR_NUM=<from subagent report>
gh pr checks "$PR_NUM" --repo helendevenk/scivra --watch | tail -10
gh pr merge "$PR_NUM" --repo helendevenk/scivra --squash --delete-branch
git checkout main && git pull deploy main
df -h / | head -3
```

期望：CI 7/7 ✅；merge 完成；磁盘 ≥ 8Gi（worktree 已清理）。

---

## Wave C — Phase F JS bug P1（主循环外科 Edit）

**总产出：** 1 个 PR，修复 6 个文件的 critical JS bug（来自 Wave 10 audit）。

**前置：** Wave B 已 merge，否则 Wave C 改的 6 文件会与 Wave B 冲突。

**6 个目标文件 + 具体 bug：**

| # | 文件 | Bug | 修复策略 |
|---:|---|---|---|
| 1 | `molecular-polarity.html` | bond-angle slider scale 不一致；`onAngleChange` 不调用 `buildMolecule(bondAngle, den)` | (a) 把 PRESETS 写法 `bondAngle*10` 改为直接写实际度数；(b) `onAngleChange` 改为调用 `buildMolecule(currentMol, bondAngle, den)` |
| 2 | `protein-synthesis.html` | 速度 quadratic scaling；`toggleLabels` no-op；preset rebuild 泄漏 | (a) 删除 `synthesisInterval / speedMultiplier` 行（保留 `delta * speedMultiplier`）；(b) 让 `toggleLabels` 真正 toggle scene labels visibility 或删除该按钮；(c) `loadPreset` 调用前先 `disposeObject3D(scene)` 清理旧物体 |
| 3 | `ms-genetics.html` | `simState.gens` 滑块无效果；hard-coded 0.016 timestep | (a) 把 `simState.gens` 接入 `if (currentGen >= simState.gens) { stop(); }`；(b) 把 0.016 改为 rAF delta |
| 4 | `ms-plate-tectonics.html` | density 标签与解释矛盾（左 oceanic 但密度 2.7，右 continental 但密度更高） | swap 左右 plate 的 `density` 字段值，让 oceanic（左）= 3.0，continental（右）= 2.7，与 quiz 一致 |
| 5 | `k5-physics-light-propagation.html` | `resetSim()` 是空函数 | 实现为：重置 lightAngle/objectSize/refractionIndex 到 default，重绘 ray |
| 6 | `circular-motion.html` | `loadPreset` 用了非标准 `event` global，`DOMContentLoaded` 时 throw | 改 `loadPreset(presetName, evt)` 显式参数；调用方传 `event` 或 `null` |

**Branch:** `feat/d4-phase-f-js-bugs-p1`

- [ ] **Step C.1：分支 + 状态确认**

```bash
git checkout main && git pull deploy main
git checkout -b feat/d4-phase-f-js-bugs-p1
```

期望：分支创建在 Wave B 已 merge 的 main 之上。

- [ ] **Step C.2：codex 出修复方案（一次性 6 文件）**

派 1 个 `mcp__codex__codex` call：

```
Read these 6 HTML files (focus on inline <script> sections) and propose surgical-edit fixes for the listed bugs:

1. public/experiments/highschool/molecular-polarity.html
   Bugs: bond-angle slider scale inconsistency (line 87, 303-318); onAngleChange/onDENChange only update labels, don't call buildMolecule with mutable values (lines 315-322, 229-300)
   Fix: provide exact old_string / new_string Edit pairs

2. public/experiments/ap/protein-synthesis.html
   Bugs: speed quadratic scaling (lines 497-507); toggleLabels no-op (lines 431-435); preset rebuild leaks (lines 310-326, 437-442, 367-378, 416-419)
   Fix: surgical edits

3. public/experiments/middle/ms-genetics.html
   Bugs: simState.gens slider unused (lines 739-746, 839-842, 971-978); hard-coded 0.016 timestep (lines 955-958)
   Fix: surgical edits

4. public/experiments/middle/ms-plate-tectonics.html
   Bug: density labeling contradicts quiz/explanation (lines 385-395, 440-443, 631-639) — left labeled oceanic but density 2.7 (continental-typical), right labeled continental but density higher (oceanic-typical); swap density values
   Fix: surgical edits

5. public/experiments/elementary/k5-physics-light-propagation.html
   Bug: resetSim() is empty (lines 59, 292) — Reset button does nothing
   Fix: implement reset to default lightAngle/objectSize/refractionIndex + redraw

6. public/experiments/highschool/circular-motion.html
   Bug: loadPreset/setSpeed use non-standard global event (lines 349-352, 397-400, 536-539); loadPreset called from DOMContentLoaded with no event arg can throw
   Fix: explicit evt parameter + null-guard

Output structured JSON, one entry per file:
[
  { "file": "<path>", "edits": [
      { "old": "<exact old_string from current file>", "new": "<exact new_string>", "rationale": "<one sentence>" },
      ...
  ]}
]

CRITICAL CONSTRAINTS:
- Each old_string MUST appear EXACTLY ONCE in the file (else Edit will fail). Use enough surrounding context to make it unique.
- Do NOT change scientific concepts. ms-plate-tectonics density swap is the only data semantic change allowed; preserve everything else.
- Do NOT touch HTML structure — JS body changes only (within <script> ... </script>).

Read each file in full before proposing edits to ensure context uniqueness.
```

- [ ] **Step C.3：apply codex's 6-file edits via Edit tool**

对每个 file's edit pair：
1. `Read('public/experiments/.../<file>.html')` 一次（确保 Edit 前置）
2. 对每个 `{old, new}` 调 `Edit(file, old_string=<old>, new_string=<new>)`
3. 任一 Edit 失败（old_string 不唯一）→ 重读文件，提供更多上下文重写 old_string

- [ ] **Step C.4：本地验证**

```bash
# 验证 6 个文件确实改了
git diff --stat public/experiments/highschool/molecular-polarity.html public/experiments/ap/protein-synthesis.html public/experiments/middle/ms-genetics.html public/experiments/middle/ms-plate-tectonics.html public/experiments/elementary/k5-physics-light-propagation.html public/experiments/highschool/circular-motion.html

# tsc + tests
pnpm exec tsc --noEmit 2>&1 | tail -5
pnpm test tests/unit/content/ --run 2>&1 | tail -5
```

期望：6 文件均有 diff；tsc clean；tests 1552 + 64 skipped。

- [ ] **Step C.5：commit + push + PR**

```bash
git add public/experiments/highschool/molecular-polarity.html public/experiments/ap/protein-synthesis.html public/experiments/middle/ms-genetics.html public/experiments/middle/ms-plate-tectonics.html public/experiments/elementary/k5-physics-light-propagation.html public/experiments/highschool/circular-motion.html

git commit -m "$(cat <<'EOF'
fix(d4): Phase F JS bugs P1 — 6 critical correctness fixes

Surgical fixes per Wave 10 audit (PR #38):
- molecular-polarity: bond-angle scale + reactive controls
- protein-synthesis: linear speed scaling + toggleLabels behavior + preset cleanup
- ms-genetics: generations slider wired + rAF delta timestep
- ms-plate-tectonics: density labels match pedagogy (oceanic denser)
- k5-physics-light-propagation: Reset button works
- circular-motion: explicit event param (no global event)
EOF
)"

git push -u deploy feat/d4-phase-f-js-bugs-p1
gh pr create --repo helendevenk/scivra --base main --title "fix(d4): Phase F JS bugs P1 — 6 critical correctness fixes" --body "..."
```

- [ ] **Step C.6：等 CI + merge**

```bash
PR_NUM=$(gh pr view --json number --jq '.number')
gh pr checks "$PR_NUM" --repo helendevenk/scivra --watch | tail -10
gh pr merge "$PR_NUM" --repo helendevenk/scivra --squash --delete-branch
git checkout main && git pull deploy main
```

期望：CI 7/7 ✅；merge 完成。

---

## Wave D — Codex review of all 6 PRs（union diff）

**总产出：** 1 个 codex review 报告 + 视情况 1 个 fix PR。

**前置：** Wave A 4 PR + Wave B 1 PR + Wave C 1 PR 全部 merge 进 main。

- [ ] **Step D.1：圈定 review diff 范围**

```bash
# union diff = 本 session 所有 PR 的合集
# 起点是 main 在 session 开始时的 0fed718（status verification doc）
# 终点是当前 main HEAD
git log --oneline 0fed718..HEAD
git diff --stat 0fed718..HEAD | tail -5
```

期望：log 显示 6 个 squash-merge commit；diff 涉及 ~70 个 .ts + ~175 个 .html。

- [ ] **Step D.2：调用 codex review**

派 1 个 `mcp__codex__codex` call（默认账号模型）：

```
You are doing a structured code review on a multi-PR diff range.

Range: `git diff 0fed718..HEAD` in /Users/smith/Desktop/scivra (this session's main).

Scope:
- 6 squash-merge commits, ~70 .ts files (Phase E C5 alignment), ~175 .html files (Phase F a11y P1 + 6 JS bug fixes)
- Phase E TS files: regenerated via codex from C3-validated prompt template; verify no type cast violations (htmlControlAliases shape, tier values), no FAQ stale references, no scientific concept changes
- Phase F a11y HTML changes: only 3 patterns added to <style> + <script>; verify no inadvertent removal of existing inline styles, no broken script syntax, no duplicate aria-label attributes
- Phase F JS bug HTML changes: 6 specific files with surgical fixes; verify each fix actually addresses the documented bug, doesn't introduce regression

Output STRUCTURED JSON ONLY (no prose outside the JSON):

{
  "summary": {
    "files_reviewed": <int>,
    "lines_changed": <int>,
    "critical_count": <int>,
    "important_count": <int>,
    "nit_count": <int>
  },
  "findings": [
    {
      "severity": "critical" | "important" | "nit",
      "file": "<path>",
      "lines": "<NN-NN>",
      "issue": "<one sentence>",
      "fix": "<one sentence; provide old_string + new_string if surgical>",
      "category": "type-violation" | "stale-reference" | "concept-change" | "syntax" | "regression-risk" | "style"
    },
    ...
  ]
}

Definitions:
- critical = breaks build, breaks runtime, factually wrong science, security issue
- important = degrades quality, missing remediation step, partial fix
- nit = style/cleanup

Be exhaustive. Sample-review every Phase E TS file (don't skip). Spot-review 10 a11y HTML files. Deep-review all 6 JS bug HTML files.
```

调用约定：`approval-policy="never"`, `sandbox="read-only"`, `cwd="/Users/smith/Desktop/scivra"`, NO `model` override。

- [ ] **Step D.3：处理 review JSON**

```bash
# 把 codex 输出存到文件
echo "<codex JSON output>" > /tmp/phase-e-f-review.json
python3 -c "
import json
r = json.load(open('/tmp/phase-e-f-review.json'))
print('Summary:', r['summary'])
print(f\"Critical: {r['summary']['critical_count']}\")
for f in r['findings']:
    if f['severity'] == 'critical':
        print(f\"  {f['file']}:{f['lines']} — {f['issue']}\")
"
```

- [ ] **Step D.4：决策门**

| Condition | Action |
|---|---|
| 0 critical + ≤ 5 important | 跳过 fix PR；review 报告归档到 `docs/reports/d4-phase-e-f-codex-review.md`，进 Wave E |
| 1+ critical OR > 5 important | 开 fix PR `fix(d4): Phase E+F codex review fixes`；apply critical + important via Edit tool；test gate；commit；push；merge |

- [ ] **Step D.5（视情况）：fix PR**

如需 fix PR：
```bash
git checkout -b fix/d4-phase-e-f-codex-review
# Apply each critical + important via Edit tool, file by file
pnpm exec tsc --noEmit && pnpm test tests/unit/content/ --run
git add <changed files>
git commit -m "fix(d4): Phase E+F codex review fixes — N critical + M important"
git push -u deploy fix/d4-phase-e-f-codex-review
gh pr create ... 
gh pr merge --squash --delete-branch
git checkout main && git pull deploy main
```

- [ ] **Step D.6：归档 review 报告**

无论是否需要 fix PR，把 review JSON 转 Markdown 报告存入：
`docs/reports/d4-phase-e-f-codex-review.md`

包含：
- frontmatter（name/description/type/created/updated）
- session 范围（commit hash 起止）
- 文件覆盖统计
- critical/important/nit 完整列表
- 决策门结论（是否开了 fix PR）

---

## Wave E — Closeout

**总产出：** 1 个 docs PR（Phase E + F 收尾报告 + tech-debt 更新）+ handoff 文档。

- [ ] **Step E.1：分支 + 写收尾报告**

```bash
git checkout main && git pull deploy main
git checkout -b docs/d4-phase-e-f-closeout
```

写 `docs/reports/d4-phase-e-f-closeout.md`：

包含：
- frontmatter
- session 概览（开始 commit / 结束 commit）
- 6 个 PR 列表（编号、wave、scope、行数）
- Drift 轨迹（75 → ≤ 7）
- a11y 三件套覆盖率（175/175 文件）
- 6 个 JS bug 修复清单
- Codex review 决策（critical 数、是否 fix PR）
- 仍 deferred 的 Phase F2/Phase G 项（color contrast、semantic landmarks、innerHTML→DOM、OrbitControls 重写、Tailwind 迁移、three.js 升级、NGSS gap 实现）
- 验证过的 workflow 模式（错峰 subagent + worktree、4 路并行 codex、surgical edit pattern）

- [ ] **Step E.2：更新 tech-debt.md**

把 TD-D4-01（Phase E）标记为 RESOLVED；TD-D4-02 / TD-D4-03 标记为 PARTIAL（P1 已做，P2/P3 待续）；新增 TD-D4-07 等子项追踪后续。

- [ ] **Step E.3：commit + PR + merge**

```bash
git add docs/reports/d4-phase-e-f-closeout.md docs/tech-debt.md
git commit -m "docs(d4): Phase E + F P1 closeout report + tech-debt update"
git push -u deploy docs/d4-phase-e-f-closeout
gh pr create --repo helendevenk/scivra --base main --title "docs(d4): Phase E + F P1 closeout + tech-debt update" --body "..."
gh pr merge --squash --delete-branch
git checkout main && git pull deploy main
```

- [ ] **Step E.4：Final session verification**

```bash
git log --oneline -10
python3 -c "
import json; from collections import Counter
d = json.load(open('tests/unit/content/d4-known-drift.json'))
print(f'Final drift: {len(d)}')
print(Counter(e.get('tier','?') for e in d.values()))
"
df -h / | head -3
```

期望：7~8 个新 commit；drift ≤ 7；磁盘 ≥ 8Gi。

- [ ] **Step E.5：Handoff（用 session-handoff skill）**

调用 `Skill('session-handoff')`，让其生成 L2/L3 handoff 文档到 `~/.claude/handoffs/`。包含：
- session 总产出（PR # 列表）
- drift 终态
- 6 个 deferred 项（TD-D4-04/05/06 + Phase F2 + Phase G）
- 下次 session 起手建议

---

## 完成判定（终极 gate）

本计划全部 task 完成的标志：

- [ ] Wave A 4 个 PR merge ≥ 4 个
- [ ] Wave B 1 个 a11y PR merge
- [ ] Wave C 1 个 JS bug PR merge
- [ ] Wave D 1 个 review 报告 in `docs/reports/`，0 critical 或 critical 已 fix
- [ ] Wave E 1 个 closeout PR merge + tech-debt 更新 + handoff 落地
- [ ] `tests/unit/content/d4-known-drift.json` 条目数 ≤ 7
- [ ] `pnpm test tests/unit/content/ --run` 通过 1552 + 64 skipped
- [ ] `pnpm exec tsc --noEmit` 干净
- [ ] 磁盘 ≥ 5Gi

任一不满足 → 不算完成，开 triage 而非声称收工。

---

## Self-review

- [x] **Spec coverage：** 6 条 TD-D4-* 中，TD-D4-01（Phase E）+ TD-D4-02 P1 + TD-D4-03 P1 全部由 Wave A/B/C 覆盖。TD-D4-04/05/06 显式 out-of-scope 并在 closeout 报告中重申。
- [x] **Placeholder scan：** 无 TBD/TODO/"add appropriate handling"。每个 step 给出具体命令、具体 slug 列表、具体 codex prompt 内容。
- [x] **Type consistency：** Phase E 的 codex prompt 模板里强制 `Record<string, string>` + `tier: "free" | "pro" | "max"`，Step A1.7 grep 验证。
- [x] **Codex prompt 模板：** Step 0.5 单一来源，Wave A 各 batch 仅描述差异（slug 列表、特殊约束如 K-5 读级、ms-electric-circuits-advanced 例外）。
- [x] **失败恢复：** 每 wave 有 STOP gate；codex 截断有重派指令（不用 codex-reply）；磁盘有错峰 + 1 worktree 上限；CI 红有立即 STOP。
- [x] **Subagent 并行：** Wave B 用 1 个 background subagent + worktree；Wave A 4 路 codex 并行（无 worktree）；Wave C 主循环串行（外科 Edit）。符合"使用 subagent 同步开展工作"。
- [x] **磁盘安全：** PR #40 ENOSPC 教训纳入：1 worktree 上限、每 wave 末 `df -h /` gate、Wave B 错峰避开 Wave A Batch 1。
- [x] **完整 review：** Wave D 由 codex 对 union diff 做结构化 review，符合"完成所有的任务后再要求 codex 做 review"。

---

## 估算时长（wall-clock）

| Wave | 人时估算 | codex 调用 | subagent | PR 数 |
|---|---|---:|---:|---:|
| Wave 0 (pre-flight) | ~5 min | 0 | 0 | 0 |
| Wave A Batch 1 | ~30 min | 18 (5 轮 4 路) | 0 | 1 |
| Wave A Batch 2 | ~30 min | 18 | 0 | 1 |
| Wave A Batch 3 | ~30 min | 18 | 0 | 1 |
| Wave A Batch 4 | ~25 min | 15 | 0 | 1 |
| Wave B (a11y) | ~30 min（与 Wave A Batch 2/3 并发） | 0 | 1 | 1 |
| Wave C (JS bugs) | ~25 min | 1 | 0 | 1 |
| Wave D (review) | ~15 min | 1-2 | 0 | 0-1 |
| Wave E (closeout) | ~15 min | 0 | 1 (handoff) | 1 |
| **Total（理想）** | **~3-4 小时** | **~72** | **2** | **6-7** |

CI 等待时间（每 PR 6-8 min × 6 PR ≈ 40 min）大部分可与下一 wave 的 codex 调用重叠。

---

## 文件 / 工作区 / Worktree 速查

- 主仓库：`/Users/smith/Desktop/scivra`，分支 `main`，远端 `deploy`（origin 是模板，禁写）
- Phase E TS files：`src/shared/lib/experiments/data/<slug>.ts`（69 个 + canonical example `k5-mixtures-solutions.ts`）
- Phase F HTML files：`public/experiments/{elementary,middle,highschool,ap,earth-science}/*.html`（175 个）
- Audit 数据：`_phase3-research/d4-audit/audit.jsonl`（per-slug HTML controls + diff）
- Drift snapshot：`tests/unit/content/d4-known-drift.json`
- 报告输出：`docs/reports/d4-phase-e-f-{closeout,codex-review}.md`
- Worktree（Wave B subagent 使用）：临时路径，subagent 完成后自动清理
