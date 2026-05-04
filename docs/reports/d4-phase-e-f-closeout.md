---
name: d4-phase-e-f-closeout
description: D4 Phase E + Phase F P1 close-out report — 69-slug C5 alignment + 175-file a11y + 6 JS bugs
type: report
created: 2026-05-04T08:30:00Z
updated: 2026-05-04T08:30:00Z
---

# D4 Phase E + Phase F P1 Close-out Report

**Phase:** D4 Param-vs-HTML Alignment (Phase E) + Catalog Quality Remediation (Phase F P1)
**Status:** Complete
**Date:** 2026-05-04
**PRs shipped:** 7 (#41-#47)
**Session length:** ~5 hours wall-clock

## Drift trajectory

| Milestone | Drift | Tier breakdown | Notes |
|---|---:|---|---|
| Pre-Phase-E (Phase D close) | 75 | C5: 69, C3: 4, C2: 2 | TD-D4-01 baseline |
| Post-Batch-1 (PR #41) | 57 | C5: 51, C3: 4, C2: 2 | -18 |
| Post-Wave-B (PR #42) | 57 | unchanged | a11y is HTML-only, no drift impact |
| Post-Batch-2 (PR #43) | 39 | C5: 33, C3: 4, C2: 2 | -36 cumulative |
| Post-Batch-3 (PR #44) | 22 | C5: 16, C3: 4, C2: 2 | -53 cumulative |
| Post-Batch-4 (PR #45) | 7 | C5: 1, C3: 4, C2: 2 | -68 cumulative; Phase E target met |
| Post-Wave-C (PR #46) | 7 | unchanged after molecular-polarity TS step align | JS bug fixes don't affect drift |
| Post-codex-review-fixes (PR #47) | 8 | C5: 1, C3: 4, C2: 3 | +1 (audit-script gap on circular-motion sl-speed) |

**Net session drift change:** 75 → 8 (-67, -89%).

## PRs shipped (7 in this cycle)

| PR | Wave | Title | Slugs/Files | Δ Drift |
|:---:|:---:|---|---|:---:|
| #41 | A1 | Phase E batch 1 — 18 C5 slugs aligned via codex parallel | 18 TS | -18 |
| #42 | B | Phase F a11y P1 — focus-visible + slider aria-label + reduced-motion | 175 HTML | 0 |
| #43 | A2 | Phase E batch 2 — 18 C5 slugs aligned (k5 cluster heavy) | 18 TS | -18 |
| #44 | A3 | Phase E batch 3 — 17 C5 slugs aligned (incl. ms-* cluster) | 17 TS | -17 |
| #45 | A4 | Phase E batch 4 — 15 C5 slugs aligned (final) | 15 TS | -15 |
| #46 | C | Phase F JS bugs P1 — 6 critical correctness fixes | 6 HTML + 1 TS | 0 |
| #47 | D-fix | Phase E+F codex review fixes — 1 critical + 8 important | 9 files | +1 |

## Phase E results

**TD-D4-01 (C5 cosmetic clearance):** RESOLVED.

68 of 69 slugs successfully aligned to HTML reality across 4 batches. Each slug rebuilt via codex (`mcp__codex__codex` with default account model) from the C3-validated prompt template — `parameters[]`, `htmlControlAliases`, `presets[]`, `parameterExplanations`, `teacherUseCases`, `faq`, `misconceptions` all regenerated.

**1 slug intentionally not touched:**
- `ms-electric-circuits-advanced` — keeps the W5/PR #39 intentional Voltage cap (TS max=12V vs HTML max=24V); 24V across 1Ω = 24A, unsafe classroom narrative. Documented as intentional drift.

**Final remaining drift (8 entries, all known):**
- 1 C5 — `ms-electric-circuits-advanced` (intentional W5 voltage cap)
- 4 C3 — climate-change-modeling, glaciers-ice-ages, greenhouse-effect, plate-tectonics-advanced (legacy mixed-class entries; would need full pedagogical reframe; not in P1 scope)
- 2 C2 — balancing-chemical-equations, solar-system-scale (alias-only legacy classification)
- 1 C2 — circular-motion (audit-script parser gap; sl-speed slider not detected; metadata is correct, audit tool needs fix — see TD-D4-07)

## Phase F P1 results

**TD-D4-02 (a11y P1):** PARTIAL — three template-level fixes shipped to all 175 HTML files via single Wave B background subagent + worktree:

1. `:focus-visible` outline ring on all interactive elements (175/175)
2. `aria-label` on every `<input type="range">` slider (490 added, 0 fallbacks)
3. `prefers-reduced-motion` media query + `PREFERS_REDUCED_MOTION` JS sentinel (175/175)

**Known follow-up (Phase F2):** animation-pause logic for the reduced-motion sentinel; color contrast token fixes (P2 audit items); semantic landmark restructuring (P3); WebGL canvas accessible names; color-only signaling replacements.

**TD-D4-03 (JS bugs P1):** PARTIAL — 6 critical correctness fixes in Wave C + the molecular-polarity readout fix in Wave D-fix:

| File | Bug fixed |
|---|---|
| molecular-polarity.html | bond-angle slider scale collapse (1045 → 104.5) + reactive controls actually call buildMolecule + dipole/polar readout computed from sliders |
| protein-synthesis.html | toggleLabels button removed (was no-op), preset GPU resource cleanup added, speed scaling now linear |
| ms-genetics.html | Generations slider stops simulation at limit; rAF delta replaces hard-coded 0.016 timestep |
| ms-plate-tectonics.html | Density labels swapped (oceanic 3.0, continental 2.7) AND Density Contrast slider effect preserved |
| k5-physics-light-propagation.html | Reset button now resets all 3 sliders + redraws (was no-op) |
| circular-motion.html | loadPreset/setSpeed take explicit evt param (no global `event`) |

**Known follow-up (Phase F2):** systemic OrbitControls helper, innerHTML→DOM template refactor, lifecycle helper extraction, per-frame allocation cleanup in remaining files.

## Validated workflow patterns (additions to Phase D set)

### Codex `workspace-write` for direct file writes
- After validating output quality on Round 1 of Phase E Batch 1 (`sandbox="read-only"` returning full TS file content), switched to `sandbox="workspace-write"` for Rounds 2-5 onwards
- Codex writes the file directly + returns just a confirmation line (PARAMS / PRESETS / ALIASES summary)
- Token cost reduction: ~85% per slug (from ~24K each to ~3K each)
- Trust gate: spot-check + drift snapshot regen + tsc/tests catch any malformed output

### Single-worktree subagent for parallel HTML batch work
- Wave B used `Agent(subagent_type="general-purpose", isolation="worktree", run_in_background=true)` for the 175-file a11y pass
- Subagent wrote a single Python script that processed all 175 HTML files idempotently, ran local validation, opened the PR
- Wall-clock: ~12 min for 175 files + 490 aria-labels + 0 errors
- Caveat: per-this-session experience, the worktree isolation is imperfect — subagent did stash main checkout's uncommitted Batch 2 codex changes mid-run; resolved via stash apply post-merge. Future sessions should commit pending changes before background-subagent dispatch as a defensive measure.

### 4-way codex parallelism per batch round
- Each Phase E batch dispatched 4 codex calls in a single message (one per slug)
- 18 slugs → 5 rounds of (4-4-4-4-2) = ~30 min wall-clock per batch including verification
- 0% truncation across 65 codex calls (default model handled even 4-slider + 9-preset slugs cleanly)

### Two-stage drift verification
- After each batch's codex output applied: re-run `pnpm tsx scripts/audit-params-vs-html.ts` + `scripts/d4-generate-known-drift.ts`
- Compare expected slug-clearance count to actual; investigate stragglers immediately rather than at PR-merge time
- Catches preset id mismatches (k5-simple-machines selectMachine vs applyPreset variants), range mismatches (ms-chemical-bonding 0-3.3 vs 0-33), and prefix duplications (ms-plate-tectonics preset:preset:ridge)

### Two-stage codex review with structured JSON
- Wave D dispatched single codex call against `git diff <session-start>..HEAD` (covers all 6 PRs)
- Codex returned structured JSON `{summary, findings[]}` with severity labels
- Findings triaged: 1 critical → must fix, 8 important → fix this PR, 0 nits → defer
- Single fix PR #47 batched all 9 fixes; post-fix codex re-review skipped because all findings were surgical and individually verified

## Out-of-scope items (deferred to future cycles)

| Item | Surface | Rationale | Suggested cycle |
|---|---|---|---|
| 4 C3 + 2 C2 + 1 C2(circular-motion) drift entries | `tests/unit/content/d4-known-drift.json` | Legacy classification + audit script gap; not P1 quality issue | Phase E2 cleanup (1 hour) or audit script repair (TD-D4-07) |
| Phase F2 a11y P2/P3 | `public/experiments/**/*.html` 175 files | color contrast tokens, semantic landmarks, color-only signaling, WebGL canvas labels | Independent F2 cycle, ~3-5 weeks |
| Phase F2 JS systemic refactor | `public/experiments/**/*.html` 175 files | OrbitControls helper, innerHTML→DOM, lifecycle hook, per-frame alloc cleanup | Independent F2 cycle, ~3-5 weeks |
| TD-D4-04 Tailwind CDN migration | 175 HTML | Build pipeline + 175 visual regressions | Independent infra cycle |
| TD-D4-05 three.js r134 → r170+ | 175 HTML | Per-scene regression test | Independent infra cycle |
| TD-D4-06 NGSS top-10 gap implementations | catalog expansion | Each is weeks of design + dev | Catalog roadmap planning |

## Lessons & gotchas

- Stash hygiene: when dispatching background subagent, commit pending main-loop changes first to avoid worktree-isolation surprises
- Audit script parser gaps surface late (Wave D codex review caught circular-motion `sl-speed` miss); a tighter HTML parser test suite would catch these earlier — filed as TD-D4-07
- Flaky timing tests (HTML sanitizer cache `< 1ms` assertion) caused 1 spurious CI failure on PR #45; gh run rerun --failed resolved cleanly
- Token-budget management for multi-batch codex work is the main scaling constraint; workspace-write mode mitigates by ~85%
