---
name: d4-phase-d-cycle
description: D4 Phase D — close out cycle plan (AP code repop + ms-genetics SLA pre-empt + nits batch + close-out)
type: plan
created: 2026-05-03T13:00:00Z
updated: 2026-05-03T13:00:00Z
---

# D4 Phase D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close out D4 in this cycle by (1) re-populating cleared AP standard codes from authoritative College Board CED PDFs, (2) pre-empting the ms-genetics SLA via Option A, (3) batching deferred codex-review nits, (4) updating tech-debt log and shipping a Phase D close-out report.

**Architecture:** Six PRs in dependency-aware order. Each PR is one wave; each wave touches a tight slug set with shared verification source. PRs are independent and merge in order; no inter-PR dependencies. Test gate per wave: `pnpm test tests/unit/content/ --run` (1552 + 64 skipped) and `pnpm typecheck` clean.

**Tech Stack:** TypeScript, Drizzle ORM (no schema changes), Vitest, GitHub PR workflow. Authoritative sources fetched via Jina Reader (`https://r.jina.ai/<url>`) from College Board AP Central. Codex (`mcp__codex__codex`) only used for nits batch; AP code repop is done by hand to maintain authority.

---

## Cycle scope summary

| Wave | Title | Slugs | PR # (target) | Risk |
|---|---|---:|:---:|---|
| 0 | Pre-flight verification | 0 | — | — |
| 1 | ms-genetics SLA pre-empt (Option A) | 1 | #32 | 🟢 |
| 2 | AP Bio codes repop from CED 2024 | 4 | #33 | 🟡 |
| 3 | AP Physics 1 codes repop from Fall 2024 redesign | 2 | #34 | 🟡 |
| 4 | AP Physics 2 + AP Physics C codes repop | 2 | #35 | 🟡 |
| 5 | Codex review deferred nits batch | ~10 | #36 | 🟢 |
| 6 | Phase D close-out + tech-debt log update | 0 docs | #37 | 🟢 |

**Cycle revision 2026-05-04 — scope expanded per user directive ("做完保证质量"):**

Originally six-wave scope expanded to **ten waves**. Items previously deferred have been
pulled into this cycle:

| Wave | Title | PR # | Was deferred? |
|---|---|:---:|:---:|
| 7 | C5 cosmetic drift clearance (68 slugs in 4 sub-batches) | #38 | yes — pulled in |
| 8 | NGSS performance-expectation coverage gap audit | #39 | yes — pulled in |
| 9 | Accessibility audit of 175 public HTML simulations | #40 | yes — pulled in |
| 10 | HTML JS code-quality audit on 175 simulations | #41 | yes — pulled in |

**Still out of scope** (tech-debt log only — these are infra-level not quality):
- Tailwind CDN → built-CSS migration (175 HTML, full infra cycle)
- three.js r134 → r170+ upgrade (175 HTML, per-scene regression test)

**Execution architecture (revised):**

- Subagent-driven: each independent wave is a single subagent dispatch with `isolation: "worktree"` for filesystem isolation
- Codex (`mcp__codex__codex`) used for two roles:
  1. Implementation work where reasoning is needed (e.g., reframe content, map AP codes) — uses default codex model
  2. Science accuracy reviews with `model: "gpt-5"` per user directive
- Remote: `deploy` (confirmed via `git remote -v` 2026-05-04, helendevenk/scivra.git)
- Failure-stop: any wave that fails halts that branch only; other parallel waves continue
- Phase 1 parallel batch (now): Waves 1, 2, 3, 4, 8 (Wave 1 inline; 2-4-8 background subagents)
- Phase 2 parallel batch (after Phase 1): Waves 5, 7, 9, 10
- Phase 3 final: Wave 6 closeout

**Drift-conflict isolation:** Only Waves 1, 5, and 7 modify `tests/unit/content/d4-known-drift.json`.
Waves 2/3/4 (standards.ap edits) do not affect drift detection. Waves 8/9/10 produce docs only.
This permits Phase 1 parallelism without merge conflicts on drift snapshot.

---

## Wave 0 — Pre-flight verification

**Files:** none modified; baseline state confirmation only.

- [ ] **Step 1: Confirm clean baseline on main**

```bash
cd /Users/smith/Desktop/scivra
git fetch deploy
git status
git log --oneline -1
```

Expected:
- working tree clean (only the untracked `docs/plans/2026-05-03-d4-phase-c-closeout.md` and this new plan file)
- on `main`
- HEAD is `7157e95 fix(d4): codex-review pedagogy fixes C — 8 high-priority factual + consistency fixes (#31)`

- [ ] **Step 2: Confirm baseline drift count**

```bash
python3 -c "
import json; from collections import Counter
drift = json.load(open('tests/unit/content/d4-known-drift.json'))
print(f'Drift: {len(drift)}')
print(Counter(e.get('tier','?') for e in drift.values()))
"
```

Expected: `Drift: 75` and tiers `{C5: 68, D: 1, C2: 2, C3: 4}`.

- [ ] **Step 3: Confirm test suite green**

```bash
pnpm test tests/unit/content/ --run
```

Expected: `1552 passed | 64 skipped`. If anything red, STOP and triage before starting Wave 1.

---

## Wave 1 — ms-genetics SLA pre-empt (Option A)

**Why first:** Lowest-risk warm-up that closes the open SLA, removes the only D-tier drift entry, and exercises the codex pipeline that Wave 5 will reuse. Once shipped, Phase D opens with ms-genetics fully resolved.

**Files:**
- Modify: `src/shared/lib/experiments/data/ms-genetics.ts` (full content rewrite per Option A in `docs/reports/d4-hard-cases/ms-genetics.md`)
- Modify: `docs/reports/d4-hard-cases/ms-genetics.md` (append "PM Decision" section recording auto-default applied)
- Snapshot: `tests/unit/content/d4-known-drift.json` (auto-regenerates; one D entry should leave)

**Branch:** `feat/d4-ms-genetics-option-a`

- [ ] **Step 1: Branch from main**

```bash
git checkout main && git pull deploy main
git checkout -b feat/d4-ms-genetics-option-a
```

- [ ] **Step 2: Capture HTML reality fingerprint for prompt**

```bash
grep -E 'id="sl-(mut|gen|p|rot)"|data-preset' public/experiments/middle/ms-genetics.html | head -30
```

Expected: confirms 4 sliders (sl-mut/sl-gen/sl-p/sl-rot) and 3 presets (neutral/drift/balanced) per the hard-case packet.

- [ ] **Step 3: Dispatch codex with Option A reframe prompt**

Use `mcp__codex__codex` with this prompt body (no `model` override; `approval-policy="never"`, `sandbox="read-only"`, `cwd="/Users/smith/Desktop/scivra"`):

```
Output ONLY a complete TypeScript file in a single ```typescript code block.
No prose outside the fence.

Read these files for context:
- src/shared/lib/experiments/data/ms-genetics.ts (file to replace)
- src/shared/lib/experiments/data/k5-mixtures-solutions.ts (canonical structure example)
- public/experiments/middle/ms-genetics.html (HTML reality)
- docs/reports/d4-hard-cases/ms-genetics.md (Option A spec)

PEDAGOGICAL REFRAME REQUIRED.
The current TS describes a Punnett square simulator. The HTML actually implements
Hardy-Weinberg population genetics. Replace the TS to match the HTML:

- subtitle: "Population genetics, allele frequencies, and Hardy-Weinberg equilibrium"
- description: rewrite around watching allele frequency p shift across generations
  under mutation pressure; mention p² + 2pq + q² = 1.
- parameters[]: 4 entries
  - mutationRate (alias sl-mut), 0-10 step 0.5, default 2, unit "%/gen", tier "free"
  - generations (alias sl-gen), 1-10 step 1, default 5, unit "generations", tier "free"
  - initialFreqP (alias sl-p), 0.10-0.90 step 0.05, default 0.70, unit "", tier "free"
    NOTE: HTML uses 10-90 then divides by 100; expose as 0.10-0.90 in TS for clarity.
  - viewRotation (alias sl-rot), 1-20 step 1, default 10, unit "°", tier "free"
- htmlControlAliases: { mutationRate: "sl-mut", generations: "sl-gen", initialFreqP: "sl-p", viewRotation: "sl-rot" }
- presets: [{ id: "neutral", label: "Neutral / no selection", values: {...} },
             { id: "drift", label: "Strong mutation pressure", values: {...} },
             { id: "balanced", label: "Balanced selection", values: {...} }]
- standards.ngss: ["MS-LS4-4", "MS-LS4-5"]
  standards.ap: []   (middle school, not AP)
  standards.gcse: []
- contentSections rewritten for Hardy-Weinberg; do NOT mention Punnett squares
  (a separate ms-genetics-punnett slug owns that topic).

CRITICAL TYPE CONSTRAINTS (do NOT violate or use casts):
- htmlControlAliases is Record<string, string>. Plain string values, NOT objects.
- tier must be one of "free" | "pro" | "max". NEVER use "basic" or any cast.

Quality gates:
- whatIsIt ≥ 100 words
- misconceptions: 3-5 entries
- teacherUseCases: 3-5 entries each ≥30 chars
- faq: 4-6 Q/A pairs, questions end in "?", answers ≥100 chars
- TOTAL across 5 contentSections: ≥ 800 words

Keep jsonLd, slug, htmlPath, primaryStandard ("middle-school"), category, subject,
gradeLevel, thumbnail, tags otherwise consistent with current file. Update tags to
remove "punnett square", add "Hardy-Weinberg", "allele frequency", "population
genetics", "genetic drift".
```

- [ ] **Step 4: Write the codex output to the file**

After receiving codex output, extract the TypeScript code block and overwrite `src/shared/lib/experiments/data/ms-genetics.ts`.

- [ ] **Step 5: Quick shape audit before testing**

```bash
grep -E 'tier:\s*"basic"|domId:|ap:\s*\[' src/shared/lib/experiments/data/ms-genetics.ts
```

Expected: zero matches (no invalid tier, no nested alias shape, no leftover AP code). If any match, fix inline before tests.

- [ ] **Step 6: Run typecheck**

```bash
pnpm typecheck
```

Expected: clean (no errors).

- [ ] **Step 7: Run content tests**

```bash
pnpm test tests/unit/content/ --run
```

Expected: 1552 passed + 64 skipped, drift count regenerated to **74** (D-tier entry should drop). If drift count not 74, inspect d4-known-drift.json diff for ms-genetics row and fix shape.

- [ ] **Step 8: Append PM Decision section to hard-case packet**

In `docs/reports/d4-hard-cases/ms-genetics.md`, append after the existing content:

```markdown
## PM Decision

**Decision:** Option A applied (auto-default per SLA).
**Date:** 2026-05-03
**Trigger:** Phase D cycle close-out; pre-empted SLA expiry of 2026-05-16.
**Reasoning:** No PM Decision section was added by the SLA window. Option A is
the documented default. ms-genetics-punnett slug already covers Punnett square
content elsewhere in the registry, so this rewrite makes the two slugs distinct
rather than redundant.
**Outcome:** TS metadata now matches HTML's Hardy-Weinberg simulation. D-tier
KNOWN_DRIFT entry resolved.
```

Update frontmatter `decision: pending` → `decision: option-a-applied` and `status: open` → `status: closed`. Update `updated:` to current ISO datetime via `date -u +"%Y-%m-%dT%H:%M:%SZ"`.

- [ ] **Step 9: Commit**

```bash
git add src/shared/lib/experiments/data/ms-genetics.ts \
        tests/unit/content/d4-known-drift.json \
        docs/reports/d4-hard-cases/ms-genetics.md
git commit -m "$(cat <<'EOF'
feat(d4): ms-genetics SLA pre-empt — Option A applied

Pre-empts the 2026-05-16 PM SLA on ms-genetics by applying the documented
Option A default: rewrite TS metadata to match HTML's Hardy-Weinberg
simulation. ms-genetics-punnett slug already covers Punnett squares
separately, so this rewrite makes the two slugs distinct.

Drift: 75 → 74 (D-tier entry resolved).

Co-authored-by: OpenClaw <openclaw@local>
EOF
)"
```

- [ ] **Step 10: Push + open PR**

```bash
git push -u deploy feat/d4-ms-genetics-option-a
REPO=$(git remote get-url deploy | sed 's|.*github.com[:/]||;s|\.git$||')
gh pr create --repo "$REPO" --base main --title "feat(d4): ms-genetics SLA pre-empt — Option A applied" --body "$(cat <<'EOF'
## Summary
- Pre-empts the 2026-05-16 PM SLA on ms-genetics by applying Option A
- TS metadata rewritten from Punnett squares → Hardy-Weinberg population genetics, matching the actual HTML simulation
- D-tier KNOWN_DRIFT entry resolved (75 → 74)

## Test plan
- [x] tsc clean
- [x] tests/unit/content/ all pass (1552 + 64 skipped)
- [x] d4-known-drift.json regenerated correctly
EOF
)"
```

- [ ] **Step 11: Merge after CI green**

```bash
gh pr view --json number,statusCheckRollup --jq '.statusCheckRollup'
gh pr merge --squash --delete-branch
git checkout main && git pull deploy main
```

---

## Wave 2 — AP Bio codes repop from CED 2024

**Why this scope:** 4 slugs share one source-of-truth document (AP Bio CED PDF). Bundling avoids fetching the PDF four times and lets us cross-check unit/topic mappings.

**Files:**
- Modify: `src/shared/lib/experiments/data/ecological-succession.ts` (standards.ap)
- Modify: `src/shared/lib/experiments/data/population-dynamics.ts` (standards.ap)
- Modify: `src/shared/lib/experiments/data/hardy-weinberg.ts` (standards.ap)
- Modify: `src/shared/lib/experiments/data/cellular-respiration-detail.ts` (standards.ap)
- Create: `docs/reports/d4-ap-bio-code-mapping.md` (audit trail of mappings)

**Branch:** `feat/d4-ap-bio-codes-repop`

- [ ] **Step 1: Branch from main**

```bash
git checkout main && git pull deploy main
git checkout -b feat/d4-ap-bio-codes-repop
```

- [ ] **Step 2: Fetch AP Bio CED via Jina Reader**

Use WebFetch on `https://r.jina.ai/https://apcentral.collegeboard.org/media/pdf/ap-biology-course-and-exam-description.pdf` with prompt:
"Extract the complete list of Big Ideas and Enduring Understandings (EVO, IST, ENE, SYI), and within each, the Learning Objectives with their codes (e.g., EVO-1.A, ENE-1.K, SYI-1.B). I need the structured taxonomy, not narrative — every code with its short label."

Save raw extracted text into a scratch file `/tmp/ap-bio-ced.txt` for repeated reference.

If Jina Reader fails or returns truncated content, fall back to `mcp__exa__web_search_exa` for "AP Biology CED 2024 Learning Objectives EVO ENE SYI IST" and grab three high-quality result pages.

- [ ] **Step 3: Identify code mappings for each slug**

For each slug, identify the 1-3 best-matching Learning Objective codes from CED 2024:

| Slug | Topic | Likely unit / EU | Expected codes |
|---|---|---|---|
| ecological-succession | Community succession over time | Unit 8 Ecology, SYI-2 | SYI-2.* (community dynamics) |
| population-dynamics | Population growth, carrying capacity | Unit 8, SYI-1 / SYI-2 | SYI-1.* + SYI-2.* (population ecology) |
| hardy-weinberg | Allele frequencies, HW equilibrium | Unit 7 Natural Selection, EVO-1 | EVO-1.* (specifically HW theorem LO) |
| cellular-respiration-detail | Aerobic respiration, ETC | Unit 3 Cellular Energetics, ENE-1 | ENE-1.* (cellular respiration LOs) |

Cross-check candidate codes against the CED text. Each chosen code MUST exist verbatim in CED 2024. Reject any code you cannot point to in the source.

- [ ] **Step 4: Write the audit trail before editing files**

Create `docs/reports/d4-ap-bio-code-mapping.md`:

```markdown
---
name: d4-ap-bio-code-mapping
description: Authoritative source mapping for AP Bio standard codes added to 4 slugs in Phase D
type: report
created: <ISO timestamp from date -u>
updated: <same>
---

# D4 AP Bio Code Mapping (CED 2024)

**Source:** College Board AP Biology Course and Exam Description (CED), 2024 edition
**Source URL:** https://apcentral.collegeboard.org/media/pdf/ap-biology-course-and-exam-description.pdf
**Verified:** 2026-05-03

## Mappings

### ecological-succession
- **Codes:** [<exact codes from CED>]
- **CED location:** Unit 8, EU SYI-2 — <exact LO label from CED>
- **Justification:** <one sentence on why this LO matches>

### population-dynamics
- **Codes:** [<exact codes>]
- **CED location:** Unit 8, EU SYI-1 / SYI-2 — <labels>
- **Justification:** <one sentence>

### hardy-weinberg
- **Codes:** [<exact codes>]
- **CED location:** Unit 7, EU EVO-1 — <label>
- **Justification:** <one sentence>

### cellular-respiration-detail
- **Codes:** [<exact codes>]
- **CED location:** Unit 3, EU ENE-1 — <label>
- **Justification:** <one sentence>

## Methodology

- Old EK/LO codes (8.A.1, 7.A.1, etc.) were invalidated by the 2024 CED redesign.
- Codes above were selected by reading each slug's actual scientific content
  (whatIsIt, misconceptions, teacherUseCases) and matching to the closest CED LO.
- 1-3 codes per slug; preferred 1-2 to keep badges readable.
- No assumptions extrapolated from outdated training data — every code verified
  against CED 2024 PDF.
```

Replace placeholders with actual codes from Step 3.

- [ ] **Step 5: Apply codes to each slug**

For each of the 4 files, edit ONLY the `standards.ap` array. Example for hardy-weinberg.ts:

Find:
```typescript
  standards: {
    ngss: ["HS-LS4-3"],
    gcse: [],
    ap: [],
  },
```

Replace with (using actual codes determined in Step 3):
```typescript
  standards: {
    ngss: ["HS-LS4-3"],
    gcse: [],
    ap: ["EVO-1.K"],   // example only — use code from Step 3
  },
```

Repeat for the other 3 files. **Do not** change `primaryStandard`, `ngss`, or any other field.

- [ ] **Step 6: Quick verification grep**

```bash
for f in ecological-succession population-dynamics hardy-weinberg cellular-respiration-detail; do
  echo "=== $f ==="
  grep -A 4 "standards: {" src/shared/lib/experiments/data/$f.ts | head -5
done
```

Expected: each file shows `ap: [<...non-empty array...>]`.

- [ ] **Step 7: Run typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 8: Run content tests**

```bash
pnpm test tests/unit/content/ --run
```

Expected: 1552 + 64 skipped pass. AP code values are not validated by tests, so no failures expected — but if any standards-validator test fails, fix before commit.

- [ ] **Step 9: Commit**

```bash
git add src/shared/lib/experiments/data/{ecological-succession,population-dynamics,hardy-weinberg,cellular-respiration-detail}.ts \
        docs/reports/d4-ap-bio-code-mapping.md
git commit -m "$(cat <<'EOF'
feat(d4): repopulate AP Bio standard codes from CED 2024

Re-adds AP Bio codes that Fix B (PR #30) cleared, now sourced from the
authoritative College Board AP Bio Course and Exam Description (2024
edition). Each code verified against the CED PDF.

Slugs updated:
- ecological-succession
- population-dynamics
- hardy-weinberg
- cellular-respiration-detail

See docs/reports/d4-ap-bio-code-mapping.md for the source audit trail.

Co-authored-by: OpenClaw <openclaw@local>
EOF
)"
```

- [ ] **Step 10: Push + open PR**

```bash
git push -u deploy feat/d4-ap-bio-codes-repop
REPO=$(git remote get-url deploy | sed 's|.*github.com[:/]||;s|\.git$||')
gh pr create --repo "$REPO" --base main --title "feat(d4): repopulate AP Bio standard codes from CED 2024" --body "$(cat <<'EOF'
## Summary
- Re-adds AP Bio codes for 4 slugs cleared in PR #30
- Each code verified against College Board AP Bio CED 2024 PDF
- Audit trail saved in `docs/reports/d4-ap-bio-code-mapping.md`

## Test plan
- [x] tsc clean
- [x] tests/unit/content/ all pass (1552 + 64 skipped)
- [x] AP badges now render again on the 4 affected experiment pages
EOF
)"
```

- [ ] **Step 11: Merge after CI green**

```bash
gh pr view --json number,statusCheckRollup --jq '.statusCheckRollup'
gh pr merge --squash --delete-branch
git checkout main && git pull deploy main
```

---

## Wave 3 — AP Physics 1 codes repop from Fall 2024 redesign

**Files:**
- Modify: `src/shared/lib/experiments/data/gravity-force-lab-basics.ts` (standards.ap)
- Modify: `src/shared/lib/experiments/data/momentum-collisions.ts` (standards.ap)
- Create: `docs/reports/d4-ap-physics-1-code-mapping.md` (audit trail)

**Branch:** `feat/d4-ap-physics-1-codes-repop`

- [ ] **Step 1: Branch from main**

```bash
git checkout main && git pull deploy main
git checkout -b feat/d4-ap-physics-1-codes-repop
```

- [ ] **Step 2: Fetch AP Physics 1 CED via Jina Reader**

WebFetch on `https://r.jina.ai/https://apcentral.collegeboard.org/media/pdf/ap-physics-1-course-and-exam-description.pdf` with prompt:
"Extract the complete unit/topic taxonomy with Learning Objectives and their codes (e.g., 2.4.A.1, 4.2.B.3) for the Fall 2024 redesigned AP Physics 1 course. Focus on Unit 2 (Force and Translational Dynamics) including gravitation, and Unit 4 (Linear Momentum)."

Save into `/tmp/ap-physics-1-ced.txt`.

- [ ] **Step 3: Identify mappings**

| Slug | Topic | Likely unit | Candidate codes |
|---|---|---|---|
| gravity-force-lab-basics | Newton's law of universal gravitation, F=GMm/r² | Unit 2 (Force and Translational Dynamics), gravitation topic | 2.5.* or unit-2 gravitation LOs |
| momentum-collisions | Linear momentum, conservation, elastic/inelastic collisions | Unit 4 (Linear Momentum), entire | 4.1.* / 4.2.* / 4.3.* |

Verify each candidate code verbatim in CED. Each slug should get 1-3 codes.

- [ ] **Step 4: Write audit trail**

Create `docs/reports/d4-ap-physics-1-code-mapping.md` mirroring the AP Bio mapping doc structure (frontmatter, source URL, mapping table per slug, justification, methodology).

- [ ] **Step 5: Apply codes to each slug**

Edit `standards.ap` only on both files, mirroring Wave 2 Step 5 pattern.

- [ ] **Step 6: Verification grep**

```bash
for f in gravity-force-lab-basics momentum-collisions; do
  echo "=== $f ==="
  grep -A 5 "standards: {" src/shared/lib/experiments/data/$f.ts | head -6
done
```

Expected: both show non-empty `ap: [...]`.

- [ ] **Step 7: typecheck + tests**

```bash
pnpm typecheck
pnpm test tests/unit/content/ --run
```

Expected: clean + 1552 + 64 skipped.

- [ ] **Step 8: Commit, push, PR, merge** (same flow as Wave 2 Steps 9-11)

PR title: `feat(d4): repopulate AP Physics 1 standard codes from Fall 2024 redesign`

Commit message:

```
feat(d4): repopulate AP Physics 1 standard codes from Fall 2024 CED

Re-adds AP Physics 1 codes that Fix B (PR #30) cleared, sourced from
the College Board's Fall 2024 redesigned AP Physics 1 CED.

Slugs updated:
- gravity-force-lab-basics (Unit 2 gravitation)
- momentum-collisions (Unit 4 Linear Momentum)

See docs/reports/d4-ap-physics-1-code-mapping.md for the source audit trail.
```

---

## Wave 4 — AP Physics 2 + AP Physics C codes repop

**Why bundled:** Each is a single slug with a small AP-code surface; shipping them together avoids two near-empty PRs.

**Files:**
- Modify: `src/shared/lib/experiments/data/circuit-dc-virtual-lab.ts` (standards.ap, AP Physics 2)
- Modify: `src/shared/lib/experiments/data/angular-momentum-3d.ts` (standards.ap, AP Physics C: Mechanics)
- Create: `docs/reports/d4-ap-physics-2-c-code-mapping.md` (combined audit trail)

**Branch:** `feat/d4-ap-physics-2-c-codes-repop`

- [ ] **Step 1: Branch from main**

```bash
git checkout main && git pull deploy main
git checkout -b feat/d4-ap-physics-2-c-codes-repop
```

- [ ] **Step 2: Fetch both CEDs via Jina Reader**

WebFetch on:
- `https://r.jina.ai/https://apcentral.collegeboard.org/media/pdf/ap-physics-2-course-and-exam-description.pdf`
  - Prompt: "Extract Unit covering DC circuits (RC circuits, current, resistance, capacitance) with Learning Objective codes."
- `https://r.jina.ai/https://apcentral.collegeboard.org/media/pdf/ap-physics-c-mechanics-course-and-exam-description.pdf`
  - Prompt: "Extract the unit covering rotational motion and angular momentum with Learning Objective codes."

Save to `/tmp/ap-physics-2-ced.txt` and `/tmp/ap-physics-c-mech-ced.txt`.

- [ ] **Step 3: Identify mappings**

| Slug | Exam | Topic | Candidate codes |
|---|---|---|---|
| circuit-dc-virtual-lab | AP Physics 2 | DC circuits, RC circuits, Ohm's law | DC circuits LOs |
| angular-momentum-3d | AP Physics C: Mechanics | Angular momentum, rotational dynamics | Rotation/angular momentum LOs |

Verify verbatim in respective CEDs.

- [ ] **Step 4: Write combined audit trail**

Create `docs/reports/d4-ap-physics-2-c-code-mapping.md` with two sections (one per exam), each containing source URL, slug-by-slug mapping, and methodology (same template as Waves 2-3).

- [ ] **Step 5: Apply codes to each slug**

Edit `standards.ap` only on both files.

- [ ] **Step 6: Verification grep**

```bash
for f in circuit-dc-virtual-lab angular-momentum-3d; do
  echo "=== $f ==="
  grep -A 5 "standards: {" src/shared/lib/experiments/data/$f.ts | head -6
done
```

Expected: both show non-empty `ap: [...]`.

- [ ] **Step 7: typecheck + tests**

```bash
pnpm typecheck
pnpm test tests/unit/content/ --run
```

Expected: clean + 1552 + 64 skipped.

- [ ] **Step 8: Commit, push, PR, merge** (same flow)

PR title: `feat(d4): repopulate AP Physics 2 + AP Physics C standard codes`

---

## Wave 5 — Codex review deferred nits batch

**Goal:** Process the deferred-nits backlog from PR #31 / closeout report into one bundled PR. These are content-polish items, not functional bugs.

**Scope (from `docs/reports/d4-phase-c-closeout.md` Open Questions and PR #31 commit):**

| # | Slug | Issue type | Action |
|---:|---|---|---|
| 1 | k5-light-propagation | "Snell's law" terminology too advanced for K-5 | rewrite contentSections.whatIsIt + parameterExplanations using "bending of light" |
| 2 | k5-sound-vibration | "Harmonic" terminology too advanced for K-5 | rewrite using "wobble" / "back-and-forth motion" |
| 3 | circuit-dc-virtual-lab | Wheatstone bridge underspecified in TS but referenced | drop the Wheatstone reference from contentSections (HTML doesn't support it; full implementation requires HTML rebuild — out of scope) |
| 4 | ms-electric-circuits-advanced | Parameter ranges allow 24A current (1Ω + 24V); unrealistic for classroom | tighten Voltage slider max from 24V to 12V; document choice |
| 5 | angular-momentum-3d | L=Iω needs principal-axis qualifier for accuracy | edit parameterExplanations or whatIsIt to add "(about a principal axis)" qualifier |
| 6 | population-dynamics | Predator lag mechanism underspecified | edit contentSections.whatIsIt to clarify why predator response lags prey |
| 7 | population-dynamics | Intermediate disturbance hypothesis framing | edit teacherUseCases or misconceptions for accurate framing |
| 8-10 | (others surfaced in nit list) | minor wording/clarity | edit per codex review notes |

**Files:**
- Modify: 8-10 TS data files in `src/shared/lib/experiments/data/`
- Modify: `docs/reports/d4-phase-c-closeout.md` (mark deferred nits as resolved with PR ref)

**Branch:** `feat/d4-codex-nits-batch`

- [ ] **Step 1: Branch from main**

```bash
git checkout main && git pull deploy main
git checkout -b feat/d4-codex-nits-batch
```

- [ ] **Step 2: Re-run codex review on the 5 specific files for surgical guidance**

Dispatch a single `mcp__codex__codex` call:

```
Review these TS files and propose minimal-edit fixes for the listed issues:

1. src/shared/lib/experiments/data/k5-light-propagation.ts
   Issue: "Snell's law" too advanced for K-5 audience
   Output: replacement text for whatIsIt + any parameterExplanation that mentions Snell's law,
   using K-5 language ("light bends when it goes through different stuff like water and glass")

2. src/shared/lib/experiments/data/k5-sound-vibration.ts
   Issue: "Harmonic" terminology too advanced for K-5
   Output: replacement text using K-5 language

3. src/shared/lib/experiments/data/circuit-dc-virtual-lab.ts
   Issue: Wheatstone bridge mentioned but HTML can't demonstrate it
   Output: identify the contentSections passages that mention Wheatstone bridge;
   propose deletion or replacement that doesn't reference Wheatstone

4. src/shared/lib/experiments/data/ms-electric-circuits-advanced.ts
   Issue: Voltage slider max 24V allows 24A through 1Ω resistor — unrealistic
   Output: change Voltage parameter max to 12V; update any contentSection text
   referencing the old 24V range

5. src/shared/lib/experiments/data/angular-momentum-3d.ts
   Issue: L=Iω formula needs principal-axis qualifier
   Output: identify where L=Iω appears in contentSections and propose a one-phrase
   addition like "(about a principal axis, where L and ω are parallel)"

Output structured JSON with one entry per slug:
[
  { "slug": "...", "edits": [
      { "file_field": "contentSections.whatIsIt", "old": "...", "new": "..." }, ...
  ]}
]

DO NOT rewrite full files. Surgical edits only.
```

- [ ] **Step 3: Apply each surgical edit via the Edit tool**

For each `{old, new}` pair returned, use the Edit tool on the corresponding file. Verify each edit applied (Edit will fail if old_string isn't unique).

- [ ] **Step 4: Apply non-codex nits manually**

For #6/#7 (population-dynamics) and any other nits, do small manual Edits based on the list in `docs/reports/d4-phase-c-closeout.md` deferred-nits section.

- [ ] **Step 5: Mark resolved in close-out report**

In `docs/reports/d4-phase-c-closeout.md`, find the "Codex review remaining nits (~16 items, deferred)" section and append:

```markdown
### Resolution status (Phase D Wave 5)

The following items were resolved in PR #36:
- k5-light-propagation Snell's law → K-5 language
- k5-sound-vibration Harmonic → K-5 language
- circuit-dc-virtual-lab Wheatstone bridge reference removed
- ms-electric-circuits-advanced Voltage slider tightened to 12V max
- angular-momentum-3d L=Iω principal-axis qualifier added
- population-dynamics predator lag clarification
- population-dynamics intermediate disturbance hypothesis framing

Remaining items (deferred to a future content-polish cycle):
<list anything not addressed>
```

- [ ] **Step 6: typecheck + tests**

```bash
pnpm typecheck
pnpm test tests/unit/content/ --run
```

Expected: clean + 1552 + 64 skipped.

- [ ] **Step 7: Commit, push, PR, merge**

PR title: `feat(d4): codex-review nits batch — K-5 reading level + accuracy polish`

Commit:

```
feat(d4): codex-review deferred nits batch — content polish

Resolves 7-10 deferred items from PR #31 closeout report:
- K-5 reading-level reductions (k5-light-propagation, k5-sound-vibration)
- Wheatstone bridge reference removed (circuit-dc-virtual-lab)
- Voltage slider tightened to classroom-realistic range (ms-electric-circuits-advanced)
- L=Iω principal-axis qualifier added (angular-momentum-3d)
- predator/prey lag clarification (population-dynamics)
- intermediate disturbance hypothesis framing (population-dynamics)

No functional changes; content-quality polish only.

Co-authored-by: OpenClaw <openclaw@local>
```

---

## Wave 6 — Phase D close-out + tech-debt log update

**Goal:** Document Phase D completion; refresh `docs/tech-debt.md` to capture explicitly-deferred items so they're visible to future work.

**Files:**
- Create: `docs/reports/d4-phase-d-closeout.md`
- Modify: `docs/tech-debt.md` (append D4 Phase D section)

**Branch:** `docs/d4-phase-d-closeout`

- [ ] **Step 1: Branch from main**

```bash
git checkout main && git pull deploy main
git checkout -b docs/d4-phase-d-closeout
```

- [ ] **Step 2: Snapshot final drift state**

```bash
python3 -c "
import json; from collections import Counter
drift = json.load(open('tests/unit/content/d4-known-drift.json'))
print(f'Drift: {len(drift)}')
print(Counter(e.get('tier','?') for e in drift.values()))
" > /tmp/drift-snapshot-final.txt
cat /tmp/drift-snapshot-final.txt
```

Expected: D-tier should now show 0 (ms-genetics resolved in Wave 1). Total drift likely 74 (cosmetic only).

- [ ] **Step 3: Write Phase D close-out report**

Create `docs/reports/d4-phase-d-closeout.md`:

```markdown
---
name: d4-phase-d-closeout
description: D4 Phase D close-out report — AP code repop, ms-genetics SLA, nits batch
type: report
created: <ISO timestamp>
updated: <same>
---

# D4 Phase D Close-out Report

**Phase:** D4 Param-vs-HTML Alignment, Phase D
**Status:** Complete
**Date:** 2026-05-03

## Drift trajectory

| Milestone | Drift count | Notes |
|---|---:|---|
| Phase C close (PR #31) | 75 | C5: 68, D: 1, C2: 2, C3: 4 |
| Phase D Wave 1 (PR #32) | 74 | ms-genetics D-tier resolved |
| Phase D close | 74 | C5: 68, C2: 2, C3: 4, D: 0 |

## PRs shipped

| PR | Wave | Title |
|---|---|---|
| #32 | 1 | ms-genetics SLA pre-empt — Option A applied |
| #33 | 2 | repopulate AP Bio standard codes from CED 2024 |
| #34 | 3 | repopulate AP Physics 1 standard codes from Fall 2024 redesign |
| #35 | 4 | repopulate AP Physics 2 + AP Physics C standard codes |
| #36 | 5 | codex-review nits batch |
| #37 | 6 | Phase D close-out + tech-debt log update |

## Standards repop summary

8 slugs received re-verified AP codes from authoritative College Board CED PDFs:

| Exam | Slugs | Source |
|---|---|---|
| AP Bio | ecological-succession, population-dynamics, hardy-weinberg, cellular-respiration-detail | CED 2024 |
| AP Physics 1 | gravity-force-lab-basics, momentum-collisions | Fall 2024 redesign CED |
| AP Physics 2 | circuit-dc-virtual-lab | CED |
| AP Physics C: Mechanics | angular-momentum-3d | CED |

Audit trails:
- `docs/reports/d4-ap-bio-code-mapping.md`
- `docs/reports/d4-ap-physics-1-code-mapping.md`
- `docs/reports/d4-ap-physics-2-c-code-mapping.md`

## Validated workflow patterns (additions to Phase C set)

### Authoritative-source pattern for standards work
- Fetch CED PDF via Jina Reader; save raw extract to /tmp scratch file
- Map each slug's actual scientific content → 1-3 best-matching LOs
- Verify each chosen code verbatim against the source text
- Write the mapping doc BEFORE editing the TS files (forces you to commit to a justification)
- Never use codex output for standard codes — codex hallucinates current-year codes

### SLA pre-empt pattern for hard-case packets
- If a hard-case packet has documented options + a default, applying the default early
  (rather than waiting for the SLA) lets you bundle it into a planned cycle instead of
  triggering a one-off PR later.

## Out-of-scope items (deferred to future cycles)

These items were explicitly out of scope for Phase D and remain in the tech-debt log:

1. **C5 cosmetic drift** — 68 entries in d4-known-drift.json. Low priority, can be batched anytime.
2. **Tailwind CDN → built-CSS migration** — all 175 public HTML files use cdn.tailwindcss.com,
   which Tailwind itself flags as not for production. Single-cycle infra work.
3. **three.js r134 → r170+ upgrade** — all 175 HTML files. Requires regression testing per scene.
4. **NGSS performance-expectation coverage gap analysis** — research-heavy; requires separate cycle.
5. **Accessibility audit of 175 public HTML simulations** — large surface, separate cycle.
6. **HTML simulation code-quality audit** — 175 files unaudited at the JS level.
```

Replace `<ISO timestamp>` placeholders via `date -u +"%Y-%m-%dT%H:%M:%SZ"`.

- [ ] **Step 4: Update tech-debt log**

Append to `docs/tech-debt.md` (or create the section if not present):

```markdown
## D4 Phase D — items explicitly deferred (2026-05-03)

After Phase D cycle close-out, the following items remain known but were
deliberately NOT attempted:

| Item | Surface | Rationale |
|---|---|---|
| 68 C5 cosmetic drift entries | `tests/unit/content/d4-known-drift.json` | Low priority; param-display labels and unit cosmetics |
| Tailwind CDN dependency | 175 HTML files in `public/experiments/` | All experiments use cdn.tailwindcss.com; Tailwind official docs flag for non-production use only |
| three.js r134 (current r170+) | 175 HTML files | Pinned but stale; upgrade requires per-scene regression test |
| NGSS coverage gap analysis | registry-wide | Which performance expectations have no implementing experiment? |
| Accessibility audit | 175 HTML files | WCAG 2.1 AA validation across all simulations |
| HTML JS-level code quality | 175 HTML files | Inline scripts only audited indirectly via TS metadata sync |

Each is independently scopeable; none blocks Phase D close.
```

- [ ] **Step 5: Commit, push, PR, merge**

```bash
git add docs/reports/d4-phase-d-closeout.md docs/tech-debt.md
git commit -m "$(cat <<'EOF'
docs(d4): Phase D close-out report + tech-debt log update

Closes the D4 Phase D cycle. Six PRs shipped:
- #32 ms-genetics Option A pre-empt
- #33-#35 AP code repop from College Board CEDs (4 exams, 8 slugs)
- #36 codex-review nits batch
- #37 (this PR) close-out + tech-debt log

Six items explicitly deferred to future cycles are documented in
docs/tech-debt.md so they remain visible.

Co-authored-by: OpenClaw <openclaw@local>
EOF
)"
git push -u deploy docs/d4-phase-d-closeout
REPO=$(git remote get-url deploy | sed 's|.*github.com[:/]||;s|\.git$||')
gh pr create --repo "$REPO" --base main --title "docs(d4): Phase D close-out + tech-debt log update" --body "$(cat <<'EOF'
## Summary
- Phase D cycle close-out report (`docs/reports/d4-phase-d-closeout.md`)
- Tech-debt log updated with 6 explicitly-deferred items
- Final drift state captured (74, cosmetic-only after Wave 1)

## Test plan
- [x] No source code changes; docs only
- [x] Frontmatter valid
EOF
)"
gh pr view --json statusCheckRollup --jq '.statusCheckRollup'
gh pr merge --squash --delete-branch
git checkout main && git pull deploy main
```

- [ ] **Step 6: Final cycle verification**

```bash
git log --oneline -8
python3 -c "
import json; from collections import Counter
drift = json.load(open('tests/unit/content/d4-known-drift.json'))
print(f'Final drift: {len(drift)}')
print(Counter(e.get('tier','?') for e in drift.values()))
"
```

Expected: 6 new merge commits at top; drift = 74; tier counts `{C5: 68, C2: 2, C3: 4}` (no D-tier remaining).

- [ ] **Step 7: Cycle close-out announcement**

Print final summary table to user:

```
D4 Phase D cycle: COMPLETE
PRs merged: #32-#37 (6 total)
Drift: 75 → 74 (D-tier zeroed)
Standards: 8 AP slugs re-populated from CED
Nits: 7-10 deferred items resolved
SLA: ms-genetics pre-empted (was due 2026-05-16)

Open items in tech-debt log:
- 68 C5 cosmetic drift
- Tailwind CDN migration
- three.js upgrade
- NGSS coverage gap
- Accessibility audit
- HTML JS code-quality audit
```

---

---

## Wave 7 — C5 cosmetic drift clearance (68 slugs)

**Goal:** Reduce KNOWN_DRIFT from 74 (post-Wave-1) to ≤ 6 by addressing the 68 C5 cosmetic entries.

**Approach:** Split into 4 sub-batches of ~17 slugs each, dispatched as 4 parallel codex calls (one per sub-batch) from a single subagent. Each codex call edits the affected slugs' parameter labels/units/cosmetic mismatches per the established C3 prompt template.

**Files:** Up to 68 TS files in `src/shared/lib/experiments/data/` + `tests/unit/content/d4-known-drift.json`.

**Branch:** `feat/d4-c5-cosmetic-clearance`

- [ ] **Step 1: List the 68 C5 slugs**

```bash
python3 -c "
import json
drift = json.load(open('tests/unit/content/d4-known-drift.json'))
c5 = sorted([k for k,v in drift.items() if v.get('tier')=='C5'])
print('\n'.join(c5))
" > /tmp/c5-slugs.txt
wc -l /tmp/c5-slugs.txt
```

- [ ] **Step 2: Bucket into 4 batches**

Split 68 slugs into 4 alphabetical buckets (~17 each).

- [ ] **Step 3: Dispatch 4 parallel codex calls**

For each bucket, single codex call with the C3 alignment prompt template (from
`docs/reports/d4-phase-c-closeout.md`). Use default codex model (not gpt-5);
gpt-5 is reserved for reviews.

- [ ] **Step 4: Apply codex outputs, run tests**

After all 4 batches return, write outputs, run `pnpm typecheck && pnpm test tests/unit/content/ --run`. Drift count should drop substantially.

- [ ] **Step 5: Codex review with gpt-5**

Dispatch codex `model: "gpt-5"` review on the 68-slug diff. Apply structured-JSON-issue triage (critical/important/nit). Critical issues block merge.

- [ ] **Step 6: Commit, push, PR, merge**

PR title: `feat(d4): C5 cosmetic drift clearance — 68 slugs aligned via codex parallel batch`

---

## Wave 8 — NGSS performance-expectation coverage gap audit

**Goal:** Identify which NGSS K-12 performance expectations (PEs) have NO implementing experiment in the registry, so the catalog roadmap can prioritize gaps.

**Files:**
- Create: `docs/reports/d4-ngss-coverage-gap.md`

**Branch:** `docs/d4-ngss-coverage-gap`

- [ ] **Step 1: Extract all NGSS codes referenced in the 179 slugs**

```bash
python3 -c "
import os, re, json, glob
covered = set()
slug_by_pe = {}
for ts in glob.glob('src/shared/lib/experiments/data/*.ts'):
    with open(ts) as f: c = f.read()
    m = re.search(r'ngss:\s*\[([^\]]*)\]', c)
    if m:
        codes = re.findall(r'\"([^\"]+)\"', m.group(1))
        slug = os.path.basename(ts).replace('.ts','')
        for code in codes:
            covered.add(code)
            slug_by_pe.setdefault(code, []).append(slug)
print(f'Distinct NGSS codes referenced: {len(covered)}')
json.dump({'covered_pes': sorted(covered), 'slug_by_pe': slug_by_pe}, open('/tmp/ngss-covered.json','w'), indent=2)
"
```

- [ ] **Step 2: Use codex (model gpt-5) to enumerate full NGSS K-12 PE list**

Codex prompt: "List all NGSS performance expectations from the K-12 Framework, organized by grade band (K, 1, 2, 3, 4, 5, MS, HS) and disciplinary core idea (PS, LS, ESS, ETS). Output as a single JSON array of {code, grade_band, dci, label}. Source: NGSS Lead States, Next Generation Science Standards (2013) — be exhaustive; do not summarize."

- [ ] **Step 3: Compute gap**

```python
# coverage = covered_pes (from Step 1)
# all_pes = list from Step 2
# gaps = [pe for pe in all_pes if pe.code not in coverage]
# Group gaps by grade_band + dci
```

- [ ] **Step 4: Write report**

`docs/reports/d4-ngss-coverage-gap.md` with frontmatter + structured tables: covered PEs / gap PEs by grade band / top-priority gap recommendations (where adjacent PEs are well-covered, suggesting catalog adjacency).

- [ ] **Step 5: Codex review with gpt-5**

Dispatch codex `model: "gpt-5"` to verify the gap analysis correctness — sample 5 claimed gaps and sample 5 claimed coverages, confirm.

- [ ] **Step 6: Commit, push, PR, merge** (docs only)

PR title: `docs(d4): NGSS performance-expectation coverage gap audit`

---

## Wave 9 — Accessibility audit of 175 public HTML simulations

**Goal:** Produce a structured WCAG 2.1 AA compliance report for the 175 HTML files. Identify systemic vs per-file issues. No fix PRs in this wave; fixes go in a follow-up cycle.

**Files:**
- Create: `docs/reports/d4-accessibility-audit.md`

**Branch:** `docs/d4-accessibility-audit`

- [ ] **Step 1: Static accessibility heuristics scan**

Subagent script:
- For each HTML, check: `<html lang>` set, `<title>` present, `<meta viewport>`, alt text on `<img>`, `aria-label` on form controls, `<label>` association on `<input>`, `prefers-reduced-motion` media query in `<style>`, color contrast tokens (heuristic: count of opacity-low text classes), keyboard focus styles, any explicit `tabindex="-1"`.

- [ ] **Step 2: Codex (gpt-5) review of 5-slug sample**

Pick 5 HTMLs across grade bands (K-5, MS, AP-Bio, AP-Phys, ESS). Codex `model: "gpt-5"` reviews each for WCAG 2.1 AA: text contrast, focus order, screen-reader landmarks, motion preferences, color-only information signaling. Output as structured JSON of issues per file.

- [ ] **Step 3: Aggregate findings**

Combine static scan (175 files) + deep review (5 files). Categorize issues as systemic (affect majority) vs per-file. Recommend remediation priority.

- [ ] **Step 4: Write report**

`docs/reports/d4-accessibility-audit.md`: methodology, summary table (issue count by category × severity), top 10 systemic issues, full per-file table appendix, recommended next-cycle remediation plan.

- [ ] **Step 5: Commit, push, PR, merge** (docs only)

PR title: `docs(d4): accessibility audit of 175 public HTML simulations`

---

## Wave 10 — HTML JS code-quality audit

**Goal:** Surface JS-level issues across 175 inline scripts (XSS-via-eval risk, console errors, deprecated API usage, runtime fragility, p5.js/three.js misuse). No fix PRs in this wave; fixes go in a follow-up cycle.

**Files:**
- Create: `docs/reports/d4-html-js-quality-audit.md`

**Branch:** `docs/d4-html-js-quality-audit`

- [ ] **Step 1: Static heuristics scan**

For each HTML, count + flag: `eval()`, `Function(...)` constructor, `innerHTML` with non-string-literal RHS, deprecated three.js API names (Geometry vs BufferGeometry, etc.), `var` (vs let/const), missing `'use strict'`, console.error/warn calls, ungated `requestAnimationFrame` loops (no cleanup).

- [ ] **Step 2: Codex (gpt-5) review of 8-slug sample**

8 HTMLs (mix of physics/chem/bio/earth). Codex `model: "gpt-5"` reviews each for: code quality (readability, modularity), correctness (off-by-one, missing cleanup), three.js best practices, performance (texture/geometry leaks). Structured JSON per file.

- [ ] **Step 3: Aggregate findings + recommend fixes**

Categorize into: critical (security/correctness) / important (perf/leaks) / nit (style). Recommend per-cycle remediation budget.

- [ ] **Step 4: Write report + PR** (docs only)

PR title: `docs(d4): HTML JS code-quality audit on 175 simulations`

---

## Cycle stop conditions (any one triggers HALT)

- Any wave's PR fails CI green; do not start the next wave until merged
- AP CED PDF fetch returns truncated or non-parseable content for any subject; STOP and ask user how to proceed (manual PDF download? skip that wave?)
- Test suite drops below 1552 + 64 skipped on any wave; STOP and triage
- Drift count moves in wrong direction (>74 after Wave 1) at any wave end; STOP and inspect

## Resume notes (if cycle interrupted mid-way)

- Each wave is fully self-contained; resume by `git checkout main && git pull deploy main` and starting the next wave's branch
- Drift snapshot in `tests/unit/content/d4-known-drift.json` is the source of truth for state
- Audit trail mapping docs already-merged are immutable — do not overwrite
