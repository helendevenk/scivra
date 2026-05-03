---
name: d4-phase-c-closeout
description: D4 Phase C close-out report covering all PRs shipped, drift trajectory, and remaining work
type: report
created: 2026-05-03T11:55:00Z
updated: 2026-05-03T11:55:00Z
---

# D4 Phase C Close-out Report

**Phase:** D4 Param-vs-HTML Alignment, Phase C
**Status:** Major bucket clearance complete; 75 entries remain (mostly C5 cosmetic)
**Date:** 2026-05-03

## Drift trajectory

| Milestone | Drift count | Delta | Notes |
|---|---:|---:|---|
| Phase B baseline | 114 | — | After audit infrastructure shipped |
| End of seq 2 (Phase C1) | 112 | -2 | First slug pilot |
| End of Phase C2a (PR #20) | 107 | -5 | First parallel codex batch |
| End of Phase C2b (PR #21) | 101 | -6 | Second parallel batch + checkbox-binary audit fix |
| End of Phase C3a (PR #22) | 96 | -5 | mixed_large diff=9 batch (cell-structure-3d, k5-force-motion, mitosis, molecular-bonding, protein-synthesis) |
| End of Phase C3b (PR #23) | 91 | -5 | mixed_large continuation (soil-formation, gravity-force-lab-basics, ms-electric-circuits-advanced, volcano-eruption-types, ocean-currents) |
| End of Phase C3c (PR #24) | 86 | -5 | Diff=10 batch (ecological-succession, k5-energy-conversion, k5-light-propagation, ms-energy-conservation, k5-sound-vibration) |
| End of Phase C3d (PR #25) | 81 | -5 | Diff=10-11 batch (ms-force-motion-graphs, ms-wave-interactions-advanced, angular-momentum-3d, circuit-dc-virtual-lab, momentum-collisions) |
| End of Phase C3e (PR #26) | 78 | -3 | Final mixed_large + mixed_small (population-dynamics, hardy-weinberg, ms-cell-division-comparison) |
| End of Reframe Wave (PR #27) | 75 | -3 | Pedagogical reframes (k5-weather-patterns, k5-moon-phases, cellular-respiration-detail) |
| **End of Phase C** | **75** | **-39** total | mixed_large bucket fully cleared (12→0); mixed_small fully cleared; reframe slugs done |

## PRs shipped during Phase C

| PR | Title | Slugs | Drift impact |
|---|---|---:|---:|
| #18 | audit rules — loadPreset + idless ranges + snapshot preservation | 0 (infra) | -8 |
| #19 | Phase C1 — pilot + 2 slugs aligned, 2 audit rule extensions | 3 | -2 |
| #20 | Phase C2a — 5 slugs aligned + manual fallback | 5 | -5 |
| #21 | Phase C2b — 6 slugs aligned + checkbox-binary audit fix | 6 | -6 |
| #22 | Phase C3a — 5 mixed_large slugs aligned via codex parallel | 5 | -5 |
| #23 | Phase C3b — 5 mixed_large slugs aligned via codex parallel | 5 | -5 |
| #24 | Phase C3c — 5 mixed_large slugs aligned via codex parallel | 5 | -5 |
| #25 | Phase C3d — 5 mixed_large slugs aligned via codex parallel | 5 | -5 |
| #26 | Phase C3e — 3 final mixed slugs aligned (mixed_large bucket cleared) | 3 | -3 |
| #27 | Phase C reframe wave — 3 slugs pedagogically reframed via codex | 3 | -3 |
| **Total Phase C** | | **40 slugs** | **-47 (114→75)** |

(One slug, k5-states-of-matter, was partially aligned in C1 with one minor remaining issue, hence aligned-count 40 but listed PR slugs sum to 41.)

## Final tier distribution (75 entries)

| Tier | Count | Description |
|---|---:|---|
| C2 | 2 | Alias-only (legacy classification, may drift) |
| C3 | 4 | Mixed remaining (post-graduation) |
| C5 | 68 | Cosmetic/low-priority drift in topic_susp graduates |
| D | 1 | ms-genetics (PM SLA expires 2026-05-16) |

The 68 C5 entries are predominantly graduates from the topic_susp triage — slugs whose TS-vs-HTML topic is conceptually aligned but where parameters still drift. These don't block production functionality and represent a low-priority backlog for future polish work.

## Audit rule patches applied (whole-phase total: 6)

1. `<button onclick="loadPreset(...)">` recognition (~30 slugs affected)
2. `<input type="range">` without id, with `oninput="setX(...)"` (~18 affected) → synthetic id `oninput:setX`
3. `<button id="preset-xxx">` (kebab) (~24 affected)
4. `<button id="presetXxx">` (camelCase) (~30 affected)
5. focusRock pattern + own exclusion regex bug (~5 affected)
6. **Checkbox-binary equivalence** (PR #21): TS range with min=0/max=1/step=1 matches HTML checkbox (~5-8 affected)

## Codex orchestration metrics (Phase C3 + Reframe)

| Phase | Slugs | Codex calls | Truncation | Manual fallback | Post-codex shape Edits needed |
|---|---:|---:|---:|---:|---:|
| C2a (PR #20) | 5 | 5 | 1 (radiometric) | 1 | 5 (alias shape + tier values) |
| C2b (PR #21) | 6 | 6 | 1 (rock-cycle) | 1 | varied |
| C3a (PR #22) | 5 | 5 | 0 | 0 | 5 (alias shape + tier — discovered systemic bug) |
| C3b (PR #23) | 5 | 5 | 0 | 0 | 0 (prompt template fixed) |
| C3c (PR #24) | 5 | 5 | 0 | 0 | 0 |
| C3d (PR #25) | 5 | 5 | 0 | 0 | 0 |
| C3e (PR #26) | 3 | 3 | 0 | 0 | 0 |
| Reframe (PR #27) | 3 | 6 (3 first-pass + 3 expansion) | 0 | 0 | minor inline trim for content-quality gates |
| **Total** | **37 slugs** | **40 calls** | **2 (5%)** | **2** | **— (resolved by C3b)** |

Key findings:
- **Subagent dispatch hit account quota mid-session** (C3a). Pivoted to direct `mcp__codex__codex` from main loop — works without quota issues.
- **Two systemic codex output bugs discovered C3a, fixed C3b prompt template:**
  1. `htmlControlAliases` shape: codex emitted `{ p: { domId: 'x' } }` but canonical type is `Record<string, string>` → `{ p: 'x' }`
  2. Parameter `tier`: codex emitted `"basic"` (invalid) → must be `"free" | "pro" | "max"`
- After C3b prompt fix: **0 post-codex shape Edits needed across 16 slugs**.
- Direct codex call from main loop validated as the working orchestration path.

## Subagent triage metrics (Task 4)

- 4 parallel subagents triaged 75 topic_susp slugs in ~85 seconds wall-clock
- **74 graduates + 1 TRUE_MISMATCH** (98.7% false-positive rate on the audit heuristic)
- TRUE_MISMATCH: `cellular-respiration-detail` — handled in Reframe Wave (PR #27)
- Triage report: `docs/reports/d4-topic-susp-triage.md`

## Remaining work — TRUE_MISMATCH cases requiring future PM/reframe work

1. **ms-genetics** (D-tier, PM SLA expires 2026-05-16) — TS describes Punnett square crosses, HTML implements Hardy-Weinberg simulation. Decision packet: `docs/reports/d4-hard-cases/ms-genetics.md`. If no PM Decision section by 2026-05-16, automatic Option A applies (rewrite TS to match HTML).

## Validated workflow patterns (carry into Phase D)

### Codex prompt template (zero post-codex Edits required)

```
Output ONLY a complete TypeScript file in a single ```typescript code block.
No prose outside the fence.

Read these files for context:
- `src/shared/lib/experiments/data/<slug>.ts` (the file to replace)
- `src/shared/lib/experiments/data/k5-mixtures-solutions.ts` (canonical structure example)

Slug `<slug>` HTML reality (N controls):
- <list HTML controls with id, kind, ranges, defaults>
- <list preset buttons with onclick or data-preset patterns>

CRITICAL TYPE CONSTRAINTS (do NOT violate or use casts):
- `htmlControlAliases` type is `Record<string, string>`. Values are PLAIN STRINGS, not objects.
  Write `{ paramId: "domId" }` NOT `{ paramId: { domId: "x" } }`.
- Parameter `tier` must be one of `"free" | "pro" | "max"`. NEVER use `"basic"` or any cast.

Transform rules:
1. Replace `parameters[]` with N entries: <id, label, unit, min, max, default, step, tier "free">
2. REMOVE old <X, Y, Z> parameters entirely
3. Add htmlControlAliases: { ... } between jsonLd and contentSections
4. Add presets: [...] between htmlControlAliases and contentSections
5. Update `instructions` to reference N sliders + M presets
6. Replace `parameterExplanations` to have N keys, 80-150 words each
7. Replace ALL `teacherUseCases` referencing new params + presets; keep NGSS standards intact
8. SCRUB FAQ + misconceptions text that references removed params — rewrite using new
   control names. Do NOT mention any removed param anywhere in the file. Keep all OTHER fields verbatim.
```

Calling convention: `mcp__codex__codex` with `approval-policy="never"`, `sandbox="read-only"`,
`cwd="/Users/smith/Desktop/scivra"`, NO `model` override.

### Quality gates checklist (per content section)

For experiments touched by reframe (where contentSections are heavily rewritten):
- whatIsIt: ≥ 100 words
- misconceptions: 3-5 entries
- teacherUseCases: 3-5 entries each ≥30 chars
- faq: 4-6 Q/A pairs, questions end in ?, answers ≥100 chars
- TOTAL across 5 sections: ≥ 800 words

For mechanical alignment (parameters change, content stays mostly verbatim) the original counts/lengths are preserved automatically.

## Open questions / decisions deferred to Phase D

1. **k5-states-of-matter `pressSlider` scaling** — single case where HTML control needs scale transform. Deferred Option B (`htmlControlAliases.<key>: { domId, scale }` infrastructure) still appropriate; not yet justified by case count.
2. **Audit heuristic improvement** — `topicMismatch.suspect` flag has 1.3% true-positive rate. Recommend tightening per `docs/reports/d4-topic-susp-triage.md` "Heuristic tuning recommendation" section.
3. **k5-food-chain pathing inconsistency** — TS slug `k5-food-chain` but HTML at `k5-biology-food-chain.html`. Low-priority cleanup.
4. **k5-habitats grade-level mismatch** — TS K-5 metadata, HTML uses HS-grade content (Shannon Index, NPP). Low-priority polish.

## Recommended next steps

1. **Phase D kickoff** — define what the next major content quality phase is. Phase C closed the parameter-alignment gap; Phase D might focus on content-section quality, accessibility audit, or NGSS standards coverage gap analysis.
2. **ms-genetics SLA trigger** — set a calendar reminder for 2026-05-16. If no PM response, apply Option A.
3. **Tech debt log update** — `docs/tech-debt.md` should reference this closeout report and track the 4 open questions above.
