---
name: d4-phase-c-execution
status: in-progress
created: 2026-05-02T10:47:26Z
updated: 2026-05-02T10:47:26Z
---

# D4 Phase C — Batch Fix Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **Parent plan:** [`docs/plans/2026-05-02-d4-ts-html-sync-plan.md`](./2026-05-02-d4-ts-html-sync-plan.md) (v5)
> **Handoff context:** `~/.claude/handoffs/HANDOFF_scivra-d4-tech-debt_phase-a-b-d-shipped-c-ready_2026-05-02.md`

**Goal:** Drain `tests/unit/content/d4-known-drift.json` from 114 → ≤1 entry (only ms-genetics on PM SLA) across 4-5 PR batches, with each batch ending in clean CI 7/7 SUCCESS.

**Architecture:** Hybrid codex + main-loop. Codex acts as parallel patch-generator (reads audit JSONL row + current `.ts` file + canonical reference, returns full proposed `.ts` rewrite). Main loop applies via Edit, runs validation (`experiment-content-sections.test.ts` + `params-vs-html.test.ts` + audit script + `tsc --noEmit`), regenerates KNOWN_DRIFT snapshot, commits, opens PR, waits CI.

**Tech Stack:** TypeScript (strict), Vitest, jsdom, codex CLI (`gpt-5.5` `model_reasoning_effort=high`), Sonnet subagents (Wave 8 lesson F4: ≤10 findings only).

## 1. Codex Delegation Analysis

| Stage | Where it runs | Why |
|---|---|---|
| Read audit JSONL row for slug | main loop (1-line python) | Cheap, deterministic |
| Read current `.ts` file | main loop (Read tool) | Need raw content in context for codex prompt |
| **Generate proposed `.ts` patch** (aliases + ranges + presets[] + parameterExplanations + teacherUseCases adjustments) | **codex (per-slug, parallelizable)** | Pattern-matching task; codex has bandwidth; main-loop context stays clean |
| Apply patch | main loop (Edit / Write) | Codex returns text; only main loop touches files |
| Run `experiment-content-sections.test.ts` | main loop (Bash) | Fast (≈4 s); needed between every Edit |
| Run `audit-params-vs-html.ts` for that slug | main loop (Bash) | Confirms clean diff |
| Regenerate `d4-known-drift.json` | main loop (Bash) | Auto-shrinks snapshot |
| Run `params-vs-html.test.ts` | main loop (Bash) | Confirms shrunken allowlist still passes |
| `tsc --noEmit` | main loop (Bash) | Build gate |
| **Per-batch codex audit pass** on the batch diff | **codex (one chunk per batch)** | Catches semantic drift in parameterExplanations / teacherUseCases (Wave 6-9 D3 pattern) |
| Apply audit patches | main loop (Edit, batched manual or ≤10-finding subagent) | Wave 8 F4 rate-limit lesson |
| Branch / commit / push / `gh pr create` / wait CI / squash-merge | main loop | Stateful git ops |

**Codex parallelism budget per batch:**
- C1 (7 slugs, small): one codex call per slug, all dispatched in parallel (≤7 concurrent).
- C2/C3 (10-15 slugs): batch of 3-4 codex calls in parallel waves to keep rate-limit headroom.
- C5 mixed (largest, ~50-70 after aliases applied): batches of 3-4 in parallel.

**Codex prompt template per slug** (always identical structure → cache-friendly):
```
INPUTS:
  - Audit JSONL row (diff, htmlControls, tsParams, htmlPath)
  - Current .ts file (full content)
  - Canonical reference: ms-newtons-laws.ts (full content) for pattern guidance

TASK: Produce a complete replacement .ts file that:
  1. Adds htmlControlAliases for slider semantic→DOM id mappings
  2. Aligns parameters[].min/max/step/default to HTML control attributes
  3. Extracts scenario discrete params into presets[] if HTML has preset buttons
  4. Updates parameterExplanations to reflect new ranges/semantics (preserve voice + length)
  5. Updates teacherUseCases parameter values to be in-range; rewrites "set X to N" wording to "click the X preset" where appropriate
  6. Preserves: theory, instructions, formulas, challenges, misconceptions, faq, whatIsIt — UNLESS a misconception/faq item references a deleted control, in which case minimal rewrite

OUTPUT: full .ts file content in a single ```typescript block, no commentary.

CONSTRAINTS:
  - Do NOT rename parameters[].id (semantic id stability)
  - Do NOT change unrelated fields (slug, standards, wave, tier, seoTitle)
  - parameterExplanations text must remain grade-appropriate (match input voice)
  - teacherUseCases values must fall within the new parameter ranges
```

**What codex CANNOT decide alone (escalate to main loop / user):**
- Topic-level mismatches (🔴 hard) — those are Phase D, separate workflow
- Whether to keep a preset that has paramValues vs leave it descriptive-only
- Whether a teacherUseCase should be deleted entirely vs rewritten
- Cross-slug naming inconsistencies (e.g., should `frictionCoeff` always alias to `sl-friction`?) — main loop spot-checks the first batch then trusts the pattern

## 2. File Structure

**No new source files.** All work modifies existing files:
- Modify: `src/shared/lib/experiments/data/<slug>.ts` (one file per slug fixed)
- Modify: `tests/unit/content/d4-known-drift.json` (auto-regenerated by `scripts/d4-generate-known-drift.ts`)

**Branches:** one per batch — `feat/d4-batch-c1`, `feat/d4-batch-c2-aliases`, `feat/d4-batch-c3-drops`, `feat/d4-batch-c5-mixed-{wave}`.

**Commit cadence:** one commit per slug (allows clean revert), squash-merged at PR.

## 3. Batch Sequencing

> Rationale: aliases-first amplifies later batches. Adding `htmlControlAliases` to the C5 mixed slugs reclassifies many to clean (or smaller diffs) when the snapshot regenerates, shrinking C5 work dramatically.

| Batch | Tier focus | Slug count (target) | Codex parallelism | Sessions |
|---|---|---:|---|---:|
| C1 | C2/C3 smallest-diff warmup | 7 | 7 in parallel (one wave) | 1 |
| C2 | aliases-only across all C5 candidates | ~30-50 | 3-4 in parallel × waves | 2 |
| C3 | remaining drops + adds | ~10-15 | 3-4 in parallel × waves | 1-2 |
| C4 | C5 mixed residual after aliases | ~30-50 | 3-4 in parallel × waves | 3-4 |
| D | ms-genetics PM packet (separate) | 1 | n/a | wait SLA |

Realistic: **7-9 sessions** (down from 8-12 via codex parallelism).

## 4. Validation Gates (per batch)

| Gate | Command | Expected | Failure response |
|---|---|---|---|
| 1. Per-slug audit clean | `pnpm tsx scripts/audit-params-vs-html.ts` then grep slug in `audit.jsonl` | empty diff arrays | iterate codex prompt with diff feedback |
| 2. ContentSections regression | `pnpm test tests/unit/content/experiment-content-sections.test.ts` | 1434/1434 ✅ | revert last Edit, re-prompt codex |
| 3. KNOWN_DRIFT snapshot regen | `pnpm tsx scripts/d4-generate-known-drift.ts` | snapshot shrinks by N | inspect git diff |
| 4. Params-vs-html test | `pnpm test tests/unit/content/params-vs-html.test.ts` | pass; entries removed | check no orphan KNOWN_DRIFT keys |
| 5. TSC | `pnpm exec tsc --noEmit` | clean | fix import / type errors |
| 6. CI 7/7 | `gh pr checks` | all green | rerun flaky; investigate failures |

## Task 1: Session Setup + State Verification

**Files:** none modified

- [ ] **Step 1: Sync git state**

```bash
cd /Users/smith/Desktop/scivra
git fetch origin
git status
git log --oneline -3
```

Expected: on `main`, recent commits are `7941031` (PR #17), `47cf302` (#16), `b9afdeb` (#15).

- [ ] **Step 2: Verify test baseline**

```bash
pnpm test tests/unit/content/ --run
```

Expected: `1552 + 64 skipped` pass.

- [ ] **Step 3: Verify audit script reproducibility**

```bash
pnpm tsx scripts/audit-params-vs-html.ts
git diff _phase3-research/d4-audit/audit.jsonl
```

Expected: no diff (script is deterministic).

- [ ] **Step 4: Surface C1 candidates**

```bash
python3 -c "
import json
d = json.load(open('tests/unit/content/d4-known-drift.json'))
small = sorted([(s,e) for s,e in d.items() if e['tier'] in ['C2','C3']], key=lambda x: len(json.dumps(x['1']['diff'])))
for s,e in small[:10]:
    print(f\"{s:50} {e['tier']}  {e['reason']}\")
"
```

Expected: 7 entries surface (matches handoff §C1 candidates list):
`solar-system-scale, balancing-chemical-equations, climate-change-modeling, volcano-eruption-types, plate-tectonics-advanced, greenhouse-effect, glaciers-ice-ages`.

## Task 2: Create C1 Branch

**Files:** none modified

- [ ] **Step 1: Branch from main**

```bash
git checkout -b feat/d4-batch-c1
```

Expected: `Switched to a new branch 'feat/d4-batch-c1'`.

## Task 3: C1 — Per-Slug Codex Patch Generation (parallel)

**Files:** 7 codex outputs captured to `_phase3-research/d4-batch-c1/codex-{slug}.log`

For each of the 7 C1 slugs, dispatch a codex call in parallel. Use the prompt template from §1.

- [ ] **Step 1: Prepare per-slug input bundles**

For each slug `S` in C1 list, build input bundle in main loop:

```bash
mkdir -p _phase3-research/d4-batch-c1
# For one slug example (repeat for all 7):
S="solar-system-scale"
python3 -c "
import json
for line in open('_phase3-research/d4-audit/audit.jsonl'):
    r = json.loads(line)
    if r['slug'] == '$S':
        print(json.dumps(r, indent=2))
        break
" > _phase3-research/d4-batch-c1/audit-$S.json
```

- [ ] **Step 2: Dispatch 7 codex calls in parallel via single message**

Use `mcp__codex__codex` tool with `model_reasoning_effort: "high"`, `timeout_ms: 600000`. Send 7 invocations in a single tool-batch message. Each prompt contains:
- Audit JSONL row (from Step 1)
- Full current `.ts` file content
- Reference `ms-newtons-laws.ts` content
- Prompt template from §1

- [ ] **Step 3: Capture codex outputs**

Save each response to `_phase3-research/d4-batch-c1/codex-{slug}.log`. Extract the proposed full `.ts` content from each log.

- [ ] **Step 4: Spot-check one output for plausibility**

Read the first codex output (e.g., `solar-system-scale`). Verify:
- Has frontmatter `import type { Experiment }` line
- Adds `htmlControlAliases` if HTML has slider DOM ids
- If `htmlControls` is empty (like `solar-system-scale`), drops missingInHtml params + scrubs parameterExplanations
- Preserves `theory`, `formulas`, `challenges` verbatim

If plausibility check fails → re-prompt codex with specific feedback.

## Task 4: C1 — Apply Patches Per Slug

**Files (modified):** 7 × `src/shared/lib/experiments/data/<slug>.ts`

For each slug, repeat Steps 1-3:

- [ ] **Step 1: Apply via Write tool**

Use `Write` tool to overwrite the `.ts` with codex output. (`Edit` is also acceptable for surgical changes; `Write` is safer when codex returns full file.)

- [ ] **Step 2: Run contentSections test**

```bash
pnpm test tests/unit/content/experiment-content-sections.test.ts --run
```

Expected: `1434/1434 ✅`. If fails — codex output broke a contentSections assertion (typically: deleted a parameterExplanations key still referenced in misconception/teacherUseCase). Revert the Write, re-prompt codex citing the failing assertion.

- [ ] **Step 3: Run audit for that slug**

```bash
pnpm tsx scripts/audit-params-vs-html.ts > /dev/null
python3 -c "
import json
S = '<slug>'
for line in open('_phase3-research/d4-audit/audit.jsonl'):
    r = json.loads(line)
    if r['slug'] == S:
        d = r['diff']
        clean = not any(d[k] for k in ['missingInHtml','missingInTs','rangeMismatch','typeMismatch'])
        print('CLEAN' if clean else json.dumps(d, indent=2))
        break
"
```

Expected: `CLEAN`. If not — iterate codex prompt with the residual diff.

- [ ] **Step 4: Commit per-slug**

```bash
git add src/shared/lib/experiments/data/<slug>.ts
git commit -m "fix(d4): align <slug> parameters to HTML controls"
```

## Task 5: C1 — Snapshot Regen + Validation

**Files (modified):** `tests/unit/content/d4-known-drift.json`

- [ ] **Step 1: Regenerate snapshot**

```bash
pnpm tsx scripts/d4-generate-known-drift.ts
```

Expected: stdout reports 7 entries removed (114 → 107).

- [ ] **Step 2: Confirm shrinkage in git diff**

```bash
git diff tests/unit/content/d4-known-drift.json | head -50
```

Expected: 7 deletions, no additions.

- [ ] **Step 3: Run params-vs-html test**

```bash
pnpm test tests/unit/content/params-vs-html.test.ts --run
```

Expected: pass. If "no orphan KNOWN_DRIFT keys" assertion fails → snapshot has entries for slugs not in manifest (shouldn't happen on a regen).

- [ ] **Step 4: Run full content suite**

```bash
pnpm test tests/unit/content/ --run
```

Expected: `1552 + 64 skipped` (test counts unchanged).

- [ ] **Step 5: TSC check**

```bash
pnpm exec tsc --noEmit
```

Expected: clean.

- [ ] **Step 6: Commit snapshot**

```bash
git add tests/unit/content/d4-known-drift.json
git commit -m "test(d4): shrink KNOWN_DRIFT after C1 batch (114 → 107)"
```

## Task 6: C1 — Codex Audit Pass on Batch Diff

**Files:** `_phase3-research/d4-batch-c1/codex-audit-c1.log`

- [ ] **Step 1: Build batch diff input**

```bash
git diff main...HEAD -- 'src/shared/lib/experiments/data/*.ts' > _phase3-research/d4-batch-c1/batch-diff.patch
wc -l _phase3-research/d4-batch-c1/batch-diff.patch
```

- [ ] **Step 2: Dispatch single codex audit call**

Use `mcp__codex__codex` with prompt:
```
Audit this D4 alignment patch (7 slugs in batch C1). For each modified file, check:
1. Are parameter ranges + steps + defaults plausible for the educational concept?
2. Do parameterExplanations math/units match the new ranges?
3. Do teacherUseCases reference values within the new ranges?
4. Are any misconceptions/faq items now stale because they reference deleted controls?
5. Are htmlControlAliases entries semantically correct (e.g., `objectMass: sl-mass` not `sl-misc`)?

Report findings as P1 (must fix) / P2 (nice to fix) per slug. ≤2000 words.
```

`model_reasoning_effort: "high"`, `timeout_ms: 600000`.

- [ ] **Step 3: Apply audit findings**

If ≤10 findings: dispatch one Sonnet fix subagent with bounded prompt.
If >10 findings: manual batched Edit per finding (Wave 8 F4 lesson).

- [ ] **Step 4: Re-run validation gates 1-5 from §4**

After audit fixes, re-run all 5 validation gates. Commit any audit-driven fixes:

```bash
git add -p
git commit -m "fix(d4): apply codex audit feedback for C1 batch"
```

## Task 7: C1 — Push + PR + CI

**Files:** none modified locally

- [ ] **Step 1: Push branch**

```bash
git push -u origin feat/d4-batch-c1
```

- [ ] **Step 2: Open PR**

```bash
gh pr create --title "feat(d4): Phase C1 batch — 7 slugs aligned to HTML controls" --body "$(cat <<'EOF'
## Summary

D4 Phase C1 batch — first execution wave following the gold-standard 8-step workflow validated on ms-newtons-laws.

7 slugs aligned (KNOWN_DRIFT 114 → 107):
- solar-system-scale
- balancing-chemical-equations
- climate-change-modeling
- volcano-eruption-types
- plate-tectonics-advanced
- greenhouse-effect
- glaciers-ice-ages

Each slug:
- htmlControlAliases added where slider semantic↔DOM id needed bridging
- parameters[] ranges aligned to HTML control attributes
- parameterExplanations + teacherUseCases updated to reflect new ranges
- presets[] extracted where HTML has preset buttons

Codex audit pass applied (P1/P2 findings).

## Test plan
- [x] tests/unit/content/experiment-content-sections.test.ts — 1434/1434
- [x] tests/unit/content/params-vs-html.test.ts — 7 entries removed from KNOWN_DRIFT
- [x] pnpm exec tsc --noEmit clean
- [ ] CI 7/7 SUCCESS
EOF
)"
```

- [ ] **Step 3: Wait for CI**

```bash
gh pr checks --watch
```

Expected: 7/7 SUCCESS within ~6 min.

- [ ] **Step 4: Squash-merge**

```bash
gh pr merge --squash --delete-branch
git checkout main
git pull origin main
```

## Task 8: C2 — Aliases-Heavy Batch (Repeat §3-7 with adjustments)

**Files (modified):** ~30-50 × `src/shared/lib/experiments/data/<slug>.ts`

C2 strategy: surface all C5 entries whose diff is *primarily* `missingInHtml` semantic-id-only mismatches solvable by adding `htmlControlAliases`. Pre-filter by audit JSONL: HTML controls exist + most missingInHtml ids look like camelCase semantic names matching kebab-case `sl-*` HTML ids.

- [ ] **Step 1: Surface C2 candidates**

```bash
python3 << 'EOF'
import json
d = json.load(open('tests/unit/content/d4-known-drift.json'))
audit = {json.loads(l)['slug']: json.loads(l) for l in open('_phase3-research/d4-audit/audit.jsonl')}
candidates = []
for slug, entry in d.items():
    if entry['tier'] != 'C5':
        continue
    a = audit.get(slug)
    if not a:
        continue
    html_ids = {c['id'] for c in a['htmlControls']}
    if not html_ids:
        continue
    sl_ids = {h for h in html_ids if h.startswith('sl-')}
    if len(sl_ids) >= 2 and len(entry['diff'].get('missingInTs', [])) <= len(html_ids):
        candidates.append((slug, len(sl_ids)))
candidates.sort(key=lambda x: -x[1])
for s, n in candidates[:50]:
    print(f"{s:50} sl_count={n}")
EOF
```

- [ ] **Step 2: Branch + dispatch codex calls in waves of 3-4 parallel**

```bash
git checkout -b feat/d4-batch-c2-aliases
```

Same prompt template as Task 3, but emphasize: "primary task is adding htmlControlAliases; range fixes secondary".

- [ ] **Step 3-7: Apply patches, regen snapshot, codex audit, PR + CI**

Same as Tasks 4-7. Expected snapshot shrink: 30-50 entries removed.

## Task 9: C3 — Drops + Adds Batch

**Files (modified):** ~10-15 × `src/shared/lib/experiments/data/<slug>.ts`

C3 strategy: slugs with non-trivial `missingInHtml` (drops needed) OR `missingInTs` (adds needed) AFTER C2 alias work.

Process is identical to Tasks 3-7 but with a richer codex prompt (drops require scrubbing parameterExplanations + teacherUseCases + misconception references; adds require new parameterExplanations entries).

## Task 10: C4 — C5 Mixed Residual

**Files (modified):** ~30-50 × `src/shared/lib/experiments/data/<slug>.ts`

After C2 + C3 land, re-classify the remaining KNOWN_DRIFT. Expected residual: 30-50 slugs with combinations of range/preset/drops/adds. Process across 2-3 PRs of ~15-20 slugs each (PR cost grows with batch size — keep ≤20 per PR for codex audit chunk size).

Same workflow as Tasks 3-7, but split into multiple PRs if total exceeds 20.

## Task 11: D — ms-genetics PM Packet Tracking

**Files:** `docs/reports/d4-hard-cases/ms-genetics.md` (already exists)

- [ ] **Step 1: Calendar reminder for 2026-05-16**

If PM has not added a `## Decision` section to the packet by 2026-05-16, the regression test fails CI on the `expires` assertion. Next person on-call applies Option A (rewrite ms-genetics metadata to match the HTML's Hardy-Weinberg simulation) and removes the entry from `KNOWN_DRIFT`.

- [ ] **Step 2: Document outcome in handoff** when resolved.

## Task 12: D5 Sister Issue (Optional)

**Files:** GitHub issue (no local files)

- [ ] **Step 1: Open GitHub issue**

```bash
gh issue create --repo "$(git remote get-url origin | sed 's|.*github.com[:/]||;s|\.git$||')" \
  --title "D5 — 60 manifest slugs missing EXPERIMENT_HTML_MAP entry" \
  --body "$(cat <<'EOF'
## Context
60 slugs in `tests/unit/content/phase3-manifest.ts` have NO entry in `src/shared/lib/experiments/html-map.ts`. At runtime `getExperimentHtmlPath(slug)` returns null. They ship contentSections but no iframe simulation.

## Out of D4 scope
D4 audits TS metadata vs HTML for slugs that DO have HTML. D5 is a separate question: should these 60 slugs (a) have HTML built, (b) be removed from manifest, or (c) keep using a fallback render path?

## Affected slugs
See `_phase3-research/d4-audit/audit.jsonl` entries with `classification: "html-missing"`.

## Suggested next step
PM triage to decide per-slug disposition. No code changes required to open this issue.
EOF
)" --label "tech-debt"
```

## Task 13: Final Cleanup

**Files (modified):** none required; optional

- [ ] **Step 1: Verify KNOWN_DRIFT terminal state**

```bash
python3 -c "
import json
d = json.load(open('tests/unit/content/d4-known-drift.json'))
print(f'Remaining entries: {len(d)}')
for s, e in d.items():
    print(f\"  {s}: tier={e['tier']} expires={e['expires']}\")
"
```

Expected: ≤1 entry (only ms-genetics with tier=D + expires=2026-05-16).

- [ ] **Step 2: Update plan status**

```bash
sed -i '' 's/status: in-progress/status: complete/' docs/plans/2026-05-02-d4-phase-c-execution.md
sed -i '' "s/^updated:.*/updated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")/" docs/plans/2026-05-02-d4-phase-c-execution.md
```

- [ ] **Step 3: Create completion handoff**

Run `/handoff` skill (chain `scivra-d4-tech-debt` seq 2). Document Phase C completion + D5 issue link.

## 5. Failure-Mode Playbook

| Symptom | Cause | Recovery |
|---|---|---|
| `experiment-content-sections.test.ts` fails after applying codex patch | Codex deleted a parameterExplanations key still referenced | Revert Write, re-prompt codex with the exact failing assertion |
| Audit script still shows residual diff after Edit | Alias direction reversed (semantic→DOM vs DOM→semantic), or preset id doesn't match HTML preset target | Inspect HTML preset button `onclick`/`data-preset` value; fix alias |
| `params-vs-html.test.ts` "no orphan KNOWN_DRIFT keys" fails | Snapshot has slug not in manifest (rare) | Manually remove orphan entries from `d4-known-drift.json` |
| `tsc --noEmit` fails with `Property 'presets' does not exist` | Adding presets[] to a slug whose .ts file uses an outdated Experiment type import | Verify `import type { Experiment } from "@/shared/types/experiment"` is intact at top of file |
| Codex call times out | xhigh budget overrun | Switch to `model_reasoning_effort: "high"` + tighter prompt |
| Sonnet fix subagent rate-limited | Active hour + large prompt | Pivot to manual batched Edits (Wave 8 F4 pattern) |
| CI Vercel preview fails on Build | jsdom-related type issue if a new file imports it from app code | Move logic into `scripts/` or add type guard |
| Local main diverged from origin (18 ahead / 8 behind) | PR squash-merge created shadow commits locally | After Task 1 Step 1: `git fetch origin && git reset --hard origin/main` (DESTRUCTIVE — only after confirming no local-only work) |

## 6. Success Metrics

- KNOWN_DRIFT: 114 → ≤1 (only ms-genetics until 2026-05-16)
- All Phase C PRs CI 7/7 SUCCESS
- `experiment-content-sections.test.ts` stays 1434/1434 throughout
- Zero new D4 INTEGRATION findings in next codex re-audit
- Handoff seq 2 documents Phase C complete + D5 sister issue opened

## 7. Self-Review Notes

- **Spec coverage:** Every step in parent plan §4 Phase C maps to a task here (C1 → Tasks 2-7, C2 → Task 8, C3 → Task 9, C4 → Task 10, D → Task 11, D5 → Task 12).
- **Placeholder scan:** No "TBD" / "TODO" / "implement later" / "fill in details" present.
- **Type consistency:** `htmlControlAliases`, `presets[]`, `parameters[]`, `parameterExplanations`, `teacherUseCases` named consistently across all tasks (matches `src/shared/types/experiment.ts` definitions and ms-newtons-laws canonical reference).
- **Codex delegation:** Per-slug patch generation + per-batch audit are the only codex tasks; everything else stays in main loop. Boundaries clean.
- **Granularity:** Per-slug operations broken into Read→Apply→Test→Audit→Commit (5 steps, ≤2 min each). Batch ops (snapshot regen, PR creation) are 6-step tasks.
