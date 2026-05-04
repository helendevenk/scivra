# D4 Phase C Closeout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drive KNOWN_DRIFT from 91 → near-zero by closing all remaining D4 alignment work (mixed_large clearance + topic_susp triage + reframe slugs + ms-genetics SLA check).

**Architecture:** Codex-orchestrated TS rebuilds for mechanical alignment work, parallel subagent triage for topic_susp classification, main-loop reframe authoring for the 2 pedagogical-reshape slugs. Each PR ships one bounded slug batch with audit + tests + tsc + CI as the gate.

**Tech Stack:** mcp__codex__codex (direct from main loop), Agent (general-purpose subagent_type) for triage, pnpm tsx scripts/audit-params-vs-html.ts, scripts/d4-generate-known-drift.ts, vitest, tsc, gh CLI.

---

## Current state (2026-05-03 10:30 SGT)

| Bucket | Count | Strategy |
|---|---:|---|
| mixed_large | 12 | Codex parallel batches (C3c/C3d/C3e) |
| mixed_small | 2 | Fold into C3e |
| topic_susp | 73 | Parallel subagent triage → graduates to mixed batches OR D-tier |
| reframe | 2 | Codex with explicit "reframe pedagogy" instruction |
| d_tier | 2 | ms-genetics PM SLA check + 1 unknown |

KNOWN_DRIFT: **91**.

## Codex prompt template (validated, do NOT modify shape)

```
Output ONLY a complete TypeScript file in a single ```typescript code block. No prose outside the fence.

Read these files for context:
- `src/shared/lib/experiments/data/<slug>.ts` (the file to replace)
- `src/shared/lib/experiments/data/k5-mixtures-solutions.ts` (canonical structure example)

Slug `<slug>` HTML reality (N controls):
- <list of HTML controls with id, kind, ranges, defaults>
- <list of preset buttons with onclick or data-preset patterns>

CRITICAL TYPE CONSTRAINTS (do NOT violate or use casts):
- `htmlControlAliases` type is `Record<string, string>`. Values are PLAIN STRINGS, not objects. Write `{ paramId: "domId" }` NOT `{ paramId: { domId: "x" } }`.
- Parameter `tier` must be one of `"free" | "pro" | "max"`. NEVER use `"basic"` or any cast.

Transform rules:
1. Replace `parameters[]` with N entries: <id, label, unit, min, max, default, step, tier "free">
2. REMOVE old <X, Y, Z> parameters entirely
3. Add htmlControlAliases: { ... } between jsonLd and contentSections
4. Add presets: [...] between htmlControlAliases and contentSections
5. Update `instructions` to reference N sliders + M presets
6. Replace `parameterExplanations` to have N keys, 80-150 words each
7. Replace ALL `teacherUseCases` referencing new params + presets; keep NGSS standards intact
8. SCRUB FAQ + misconceptions text that references removed params — rewrite using new control names. Do NOT mention any removed param anywhere in the file. Keep all OTHER fields verbatim.

Output the complete replacement file now.
```

Calling convention: `mcp__codex__codex` with `approval-policy="never"`, `sandbox="read-only"`, `cwd="/Users/smith/Desktop/scivra"`, NO `model` override.

---

## Task 1: C3c batch (5 mixed_large slugs)

**Slugs (diff=10, easiest):**
1. ecological-succession (6 ctrls)
2. k5-energy-conversion (6 ctrls)
3. k5-light-propagation (6 ctrls)
4. ms-energy-conservation (6 ctrls)
5. k5-sound-vibration (7 ctrls)

**Files:**
- Create: branch `feat/d4-batch-c3c`
- Modify: `src/shared/lib/experiments/data/{ecological-succession,k5-energy-conversion,k5-light-propagation,ms-energy-conservation,k5-sound-vibration}.ts`
- Modify: `tests/unit/content/d4-known-drift.json`

- [ ] **Step 1.1: Pull per-slug audit data**

```bash
python3 << 'EOF'
import json
slugs = ['ecological-succession','k5-energy-conversion','k5-light-propagation','ms-energy-conservation','k5-sound-vibration']
for line in open('_phase3-research/d4-audit/audit.jsonl'):
    r = json.loads(line)
    if r['slug'] in slugs:
        print('='*70); print(f"SLUG: {r['slug']}")
        for c in r['htmlControls']:
            kind = c.get('kind')
            if kind == 'preset-button':
                print(f"  preset id={c.get('id')} label={c.get('label')} target={c.get('presetTarget')}")
            else:
                print(f"  {kind} id={c.get('id')} min={c.get('min')} max={c.get('max')} step={c.get('step')} default={c.get('defaultValue')}")
        d = r.get('diff',{})
        print(f"  missingInHtml: {d.get('missingInHtml',[])}")
        print(f"  missingInTs: {d.get('missingInTs',[])}")
EOF
```

- [ ] **Step 1.2: Create branch**

```bash
git checkout main && git pull deploy main
git checkout -b feat/d4-batch-c3c
```

- [ ] **Step 1.3: Dispatch 5 parallel codex calls**

Use the validated prompt template (above). Per-slug fill-in:
- N sliders (= count of HTML range inputs)
- M presets (= count of HTML preset buttons)
- Slider ids/ranges/defaults from audit data
- Preset ids/labels from audit data
- Removed params list = `missingInHtml` from audit
- Suggest sensible paramValues per preset based on the experiment's pedagogical goal

Send all 5 calls in a single message (parallel tool dispatch).

- [ ] **Step 1.4: Verify codex outputs are complete**

Each output must end with `};` and a closing ```` ``` ````. If any returned <150 lines, do NOT use codex-reply (per F2 lesson). Either dispatch a fresh `mcp__codex__codex` call for that slug OR write manually using the audit context.

- [ ] **Step 1.5: Read each original .ts (Write precondition)**

```typescript
// Read first 5 lines of each target file
```

- [ ] **Step 1.6: Write 5 files with codex outputs (verbatim)**

Use Write tool, full file content per slug.

- [ ] **Step 1.7: Spot-check FAQ + misconceptions + whatIsIt for stale references**

For each slug, grep the new file for any term in the `missingInHtml` list. Hits = stale refs requiring Edit. Apply fixes inline.

```bash
for slug in ecological-succession k5-energy-conversion k5-light-propagation ms-energy-conservation k5-sound-vibration; do
  echo "=== $slug ==="
  # Grep against the removed param names from audit
done
```

- [ ] **Step 1.8: Re-audit + regen drift snapshot**

```bash
pnpm tsx scripts/audit-params-vs-html.ts 2>&1 | tail -8
pnpm tsx scripts/d4-generate-known-drift.ts 2>&1 | tail -5
```

Expected: drift count drops by 5 (91 → 86). Tier distribution C5 reduces by 5.

- [ ] **Step 1.9: Verify our 5 slugs absent from drift**

```bash
python3 -c "
import json
slugs = ['ecological-succession','k5-energy-conversion','k5-light-propagation','ms-energy-conservation','k5-sound-vibration']
drift = json.load(open('tests/unit/content/d4-known-drift.json'))
hit = [s for s in slugs if s in drift]
assert not hit, f'still in drift: {hit}'
print('✅ all 5 absent from drift')
"
```

- [ ] **Step 1.10: Run tests + tsc**

```bash
pnpm test tests/unit/content/ --run 2>&1 | tail -10
pnpm exec tsc --noEmit 2>&1 | tail -10
```

Expected: 1552 + 64 skipped pass; tsc clean (no output).

- [ ] **Step 1.11: Commit + push + PR**

```bash
git add src/shared/lib/experiments/data/{ecological-succession,k5-energy-conversion,k5-light-propagation,ms-energy-conservation,k5-sound-vibration}.ts tests/unit/content/d4-known-drift.json
git commit -m "feat(d4): Phase C3c — 5 mixed_large slugs aligned via codex parallel"
git push -u deploy feat/d4-batch-c3c
gh pr create --repo helendevenk/scivra --base main --head feat/d4-batch-c3c \
  --title "feat(d4): Phase C3c — 5 mixed_large slugs aligned via codex parallel" \
  --body "Phase C3c. Drift 91 → 86. Codex 0% truncation expected. Tests + tsc green."
```

- [ ] **Step 1.12: Wait for CI + merge**

```bash
sleep 360 && gh pr checks <PR#> --repo helendevenk/scivra
gh pr merge <PR#> --repo helendevenk/scivra --squash --delete-branch
git checkout main && git pull deploy main
```

Expected: 7/7 ✅, then squash-merged.

---

## Task 2: C3d batch (5 mixed_large slugs)

**Slugs (diff=10-11):**
1. ms-force-motion-graphs (7 ctrls)
2. ms-wave-interactions-advanced (7 ctrls)
3. angular-momentum-3d (6 ctrls)
4. circuit-dc-virtual-lab (7 ctrls)
5. momentum-collisions (7 ctrls)

**Files:**
- Create: branch `feat/d4-batch-c3d`
- Modify: 5 corresponding `.ts` files + drift snapshot

- [ ] **Step 2.1 — 2.12:** Same workflow as Task 1, with these 5 slugs.

Expected outcome: drift 86 → 81.

---

## Task 3: C3e batch (final mixed_large + mixed_small, 4 slugs)

**Slugs:**
1. population-dynamics (7 ctrls, diff=13)
2. hardy-weinberg (10 ctrls, diff=15) — biggest remaining diff, may need slower codex review
3. (mixed_small slug 1 from `mixed_small` bucket — re-query before Task 3 starts)
4. (mixed_small slug 2 from `mixed_small` bucket — re-query before Task 3 starts)

**Files:**
- Create: branch `feat/d4-batch-c3e`
- Modify: 4 `.ts` files + drift snapshot

- [ ] **Step 3.1: Re-query mixed_small bucket**

```bash
python3 << 'EOF'
import json
audit = {}
for line in open('_phase3-research/d4-audit/audit.jsonl'):
    r = json.loads(line); audit[r['slug']] = r if r['classification']=='html-backed' else None
drift = json.load(open('tests/unit/content/d4-known-drift.json'))
small = []
for slug, entry in drift.items():
    a = audit.get(slug)
    if not a or a.get('topicMismatch', {}).get('suspect'): continue
    n_html = len(a['htmlControls'])
    if n_html == 0: continue
    d = entry['diff']
    diff_size = len(d['missingInHtml']) + len(d['missingInTs']) + len(d['rangeMismatch'])
    if 4 <= diff_size <= 8: small.append((slug, n_html, diff_size))
small.sort(key=lambda x: x[2])
print('mixed_small remaining:')
for s, h, ds in small[:5]: print(f'  {s} html={h} diff={ds}')
EOF
```

- [ ] **Step 3.2 — 3.12:** Same workflow as Task 1, with the 4 slugs (note: hardy-weinberg has 10 HTML controls — codex prompt section "N controls" must list all 10; expect longer output, watch for truncation).

Expected outcome: drift 81 → 77.

---

## Task 4: topic_susp parallel triage (73 slugs → 4 subagent batches)

**Goal:** Reclassify 73 heuristic-flagged topic_susp slugs into:
- **(a) graduate to mixed_large/small** — TS+HTML conceptually aligned, false positive on subtitle-vs-title heuristic
- **(b) true 🔴 D-tier** — TS and HTML cover different topics, needs PM packet

Per parent handoff F3, expected real topic-mismatch count is ~1-3 across all 73.

**Files:**
- Create: `docs/reports/d4-topic-susp-triage.md` (aggregated triage table)
- Modify: `tests/unit/content/d4-known-drift.json` (re-classify graduates with `tier` field)

- [ ] **Step 4.1: Generate the 73-slug triage worklist**

```bash
python3 << 'EOF'
import json
audit = {}
for line in open('_phase3-research/d4-audit/audit.jsonl'):
    r = json.loads(line)
    if r['classification']=='html-backed' and r.get('topicMismatch',{}).get('suspect'):
        audit[r['slug']] = r
drift = json.load(open('tests/unit/content/d4-known-drift.json'))
susp = [s for s in drift if s in audit]
# Split into 4 chunks
chunks = [susp[i::4] for i in range(4)]
import os
os.makedirs('_phase3-research/d4-triage', exist_ok=True)
for i, chunk in enumerate(chunks):
    with open(f'_phase3-research/d4-triage/batch{i+1}.json', 'w') as f:
        json.dump([{'slug': s, 'tsSubtitle': audit[s]['topicMismatch']['tsSubtitle'], 'htmlTitle': audit[s]['topicMismatch']['htmlTitle']} for s in chunk], f, indent=2)
    print(f'batch{i+1}: {len(chunk)} slugs')
EOF
```

- [ ] **Step 4.2: Dispatch 4 parallel subagent triage workers**

Send 4 Agent calls in a single message (subagent_type=general-purpose). Each subagent receives one batch JSON path and the per-slug HTML path lookup logic.

Subagent prompt template:

```
You are doing topic-mismatch triage for the Scivra D4 alignment project.

Read `_phase3-research/d4-triage/batch<N>.json` — a list of ~18 slugs flagged as topic-suspect by an automated heuristic. Per project history, the heuristic has high false-positive rate; expected real topic-mismatch count across all 73 slugs is 1-3.

For EACH slug in the batch:
1. Look up the experiment file at `src/shared/lib/experiments/data/<slug>.ts`. Read its `subtitle` and the first paragraph of `theory` or `contentSections.whatIsIt`.
2. Look up the HTML file at `public/experiments/**/<slug>.html` (use Glob to find — naming is consistent). Read its `<title>` and first `<h1>` or `<h2>`.
3. Decide one of:
   - **GRADUATE** — TS and HTML cover the same scientific concept; false positive on subtitle vs title surface vocabulary
   - **TRUE_MISMATCH** — TS and HTML cover materially different concepts; needs human pedagogical decision
4. For TRUE_MISMATCH only, capture: `slug`, `ts_concept` (1 sentence), `html_concept` (1 sentence), `recommendation` (one of: rewrite_ts_to_match_html, swap_html_to_match_ts, escalate_to_pm).

Return a JSON object: { "graduates": ["slug1", "slug2", ...], "true_mismatches": [{slug, ts_concept, html_concept, recommendation}, ...] }

Be terse. No commentary outside the JSON.
```

- [ ] **Step 4.3: Aggregate the 4 triage reports**

```bash
python3 << 'EOF'
import json
all_grad = []
all_mismatch = []
# Manually paste each subagent's JSON here, or read from saved files
# ...
print(f'Total graduates: {len(all_grad)}')
print(f'Total true mismatches: {len(all_mismatch)}')
EOF
```

- [ ] **Step 4.4: Write triage report to docs/reports/**

Create `docs/reports/d4-topic-susp-triage.md` with frontmatter (per global rules) listing all 73 slugs, their classification, and any TRUE_MISMATCH details.

- [ ] **Step 4.5: Update d4-known-drift.json classifications**

For each TRUE_MISMATCH slug, manually edit the drift entry to add `"tier": "D"`. For graduates, leave them — they'll be picked up by future C3 batches naturally OR the audit script will need a separate "approved_graduates" list (decide based on count).

If TRUE_MISMATCH count ≤ 3: write each to `docs/reports/d4-hard-cases/<slug>.md` PM packet (template at `docs/reports/d4-hard-cases/ms-genetics.md`).

- [ ] **Step 4.6: Re-run audit if classifications need code changes**

If the audit script needs to read graduate exemptions, extend `scripts/audit-params-vs-html.ts` to consult an "approved" list. For now, document graduates in the triage report; they're handled in C3f-onwards.

- [ ] **Step 4.7: Commit triage report**

```bash
git checkout -b feat/d4-topic-susp-triage
git add docs/reports/d4-topic-susp-triage.md _phase3-research/d4-triage/ docs/reports/d4-hard-cases/
git commit -m "docs(d4): Phase C topic_susp triage — 73 slugs classified"
git push -u deploy feat/d4-topic-susp-triage
gh pr create ... # standard PR
```

---

## Task 5: Reframe wave (k5-weather-patterns + k5-moon-phases)

**Goal:** Two slugs need pedagogical reshape, not mechanical alignment. Codex with explicit "reframe pedagogy" instruction is the first attempt. PM packet fallback if codex output looks pedagogically wrong.

**Files:**
- Create: branch `feat/d4-reframe-wave`
- Modify: `src/shared/lib/experiments/data/{k5-weather-patterns,k5-moon-phases}.ts`

- [ ] **Step 5.1: Pull audit data + read both HTML files**

```bash
python3 << 'EOF'
import json
slugs = ['k5-weather-patterns','k5-moon-phases']
for line in open('_phase3-research/d4-audit/audit.jsonl'):
    r = json.loads(line)
    if r['slug'] in slugs: print(json.dumps(r, indent=2))
EOF
```

Read each HTML file's first 100 lines to understand actual experiment content.

- [ ] **Step 5.2: Dispatch 2 parallel codex calls with reframe instruction**

Same template as Task 1, but with one critical addition:

```
PEDAGOGICAL REFRAME REQUIRED: The current TS file describes a different experiment than the HTML reality. Do NOT preserve the old `subtitle`, `description`, `theory`, `formulas`, `challenges`, `contentSections.whatIsIt`, or `seoKeywords` if they describe the wrong concept. Rewrite ALL pedagogical content to match what the HTML actually teaches. Keep only: `id`, `slug`, `thumbnail`, `tags` (update if relevant), `tier`, `wave`, `estimatedTime`, `htmlPath`, `relatedExperiments`. Everything else is fair game for rewrite.
```

- [ ] **Step 5.3: Write outputs + audit + tests + tsc + commit + PR + merge**

Same as Task 1 steps 1.6-1.12. Expected drift drop: 2.

- [ ] **Step 5.4: Manual review check**

After merge, read the new TS subtitle and first paragraph of `theory` for both slugs. Confirm they describe the HTML's actual experiment, not a hallucinated topic.

If pedagogically wrong: revert the slug, write PM packet to `docs/reports/d4-hard-cases/<slug>.md` documenting the conceptual gap.

---

## Task 6: ms-genetics PM SLA verification

**Goal:** Confirm PM has not responded by SLA expiration (2026-05-16); if expired without decision, apply Option A automatic default.

**Files:**
- Modify: `docs/reports/d4-hard-cases/ms-genetics.md` (status update)
- Possibly: `src/shared/lib/experiments/data/ms-genetics.ts` (Option A rewrite)

- [ ] **Step 6.1: Check current SLA status**

```bash
date -u +"%Y-%m-%d"
# If <= 2026-05-16: SLA still active. Skip to Step 6.5.
# If > 2026-05-16: SLA expired without PM Decision. Continue.
```

- [ ] **Step 6.2 (only if SLA expired): Apply Option A**

Rewrite `src/shared/lib/experiments/data/ms-genetics.ts` to align with HTML's Hardy-Weinberg simulation. Use codex with full reframe instruction (per Task 5 template). Per the existing PM packet, the HTML teaches Hardy-Weinberg allele frequency simulation; the TS describes general MS genetics.

- [ ] **Step 6.3: Update PM packet status**

Edit `docs/reports/d4-hard-cases/ms-genetics.md`: add `## Resolution` section documenting Option A applied + date.

- [ ] **Step 6.4: Audit + tests + tsc + commit + PR + merge**

Same workflow as Task 1.

- [ ] **Step 6.5 (if SLA still active): Skip + document**

Add to plan execution log: "ms-genetics SLA active (X days remaining) — deferred."

---

## Task 7: Final state verification + handoff

**Goal:** Confirm KNOWN_DRIFT minimized + Phase C close-out documented for next session.

**Files:**
- Create: handoff file via `/handoff` skill

- [ ] **Step 7.1: Final KNOWN_DRIFT count**

```bash
python3 -c "
import json
drift = json.load(open('tests/unit/content/d4-known-drift.json'))
print(f'Final KNOWN_DRIFT: {len(drift)}')
print('Tier distribution:')
from collections import Counter
print(Counter(e.get('tier','?') for e in drift.values()))
"
```

Target: ≤ 10 entries (the handful of TRUE_MISMATCH from triage + ms-genetics if PM still pending + edge cases that need future codex passes).

- [ ] **Step 7.2: Phase C summary report**

Create `docs/reports/d4-phase-c-closeout.md` with:
- Total slugs aligned across Phase C (PRs #18-#27 or wherever we land)
- Drift trajectory (114 → 91 → final)
- Audit rule patches applied (now 6 from prior + any new this session)
- TRUE_MISMATCH cases requiring future PM/reframe work
- Codex orchestration metrics (truncation rate, time per slug, parallel batch size)

- [ ] **Step 7.3: Handoff file via `/handoff` skill**

Standard L2 handoff covering:
- PRs shipped this session
- Final drift state
- Known remaining work (what's in `docs/reports/d4-phase-c-closeout.md`)
- Validated workflow patterns to carry into Phase D

---

## Self-review checklist

- [x] **Spec coverage:** All 91 drift entries are routed somewhere — 12 mixed_large + 2 mixed_small to C3c/d/e (4 batches), 73 to topic_susp triage, 2 to reframe, 2 to D-tier handling.
- [x] **Placeholder scan:** No TBD/TODO/"add appropriate handling". Tasks 4 and 5 contain reframe/triage instructions verbatim.
- [x] **Type consistency:** htmlControlAliases shape (`Record<string, string>`) and tier values (`"free"|"pro"|"max"`) consistent across all codex prompts and Tasks 1-3 + 5.
- [x] **Codex prompt template:** Inline at top, referenced by all batch tasks — single source of truth.
- [x] **Failure recovery:** Task 1 Step 1.4 documents truncation handling per F2 lesson (no codex-reply, fresh dispatch or manual). Task 5 Step 5.4 documents pedagogical-wrong recovery.
- [x] **Subagent parallelism:** Task 4 explicitly batches 4 parallel subagents.

## Codex vs. Subagent vs. Main-loop work split

| Work type | Tool | Why |
|---|---|---|
| TS file rebuild from audit data | codex (parallel × 5) | Mechanical transformation, validated 0% truncation with new prompt template |
| Reframe slugs | codex (with explicit reframe instruction) | Same mechanical structure, just looser content constraints |
| ms-genetics Option A (if needed) | codex | Same as reframe |
| topic_susp triage | subagent (parallel × 4) | Independent classification work, doesn't require shared context |
| FAQ/misconception scrub spot-check | main loop (Edit) | Requires conversation context about which params were removed |
| Audit script + drift regen | main loop (Bash) | Sequential dependency on prior steps |
| Audit-rule extensions (if any new patterns surface) | main loop (Edit) | Touches shared infrastructure, needs careful diff |
| PR creation + CI wait + merge | main loop (Bash + gh) | Requires per-PR judgment + status awareness |

---

## Estimated time-on-task

| Task | Wall-clock | Codex calls | Subagents |
|---|---|---:|---:|
| Task 1 (C3c) | ~25 min | 5 | 0 |
| Task 2 (C3d) | ~25 min | 5 | 0 |
| Task 3 (C3e) | ~25 min | 4 | 0 |
| Task 4 (triage) | ~15 min | 0 | 4 parallel |
| Task 5 (reframe) | ~15 min | 2 | 0 |
| Task 6 (ms-genetics) | ~10 min | 0-1 | 0 |
| Task 7 (handoff) | ~10 min | 0 | 0 |
| **Total** | **~2h** | **16-17** | **4 parallel** |

Per-PR CI wait time (~6 min × 5 PRs) overlaps with codex dispatch for next batch — total wall-clock realistic estimate: **2-2.5 hours**.
