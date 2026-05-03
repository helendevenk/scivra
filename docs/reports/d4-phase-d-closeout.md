---
name: d4-phase-d-closeout
description: D4 Phase D close-out report — AP code repop, ms-genetics SLA, codex nits, audits, scope deferrals
type: report
created: 2026-05-04T00:00:00Z
updated: 2026-05-04T00:00:00Z
---

# D4 Phase D Close-out Report

**Phase:** D4 Param-vs-HTML Alignment, Phase D
**Status:** Major scope complete; one wave (C5 cosmetic clearance) deferred to a follow-up cycle with rationale
**Date:** 2026-05-04
**PRs shipped this cycle:** 9 (#32-#39, plus this report's PR)

## Drift trajectory

| Milestone | Drift count | Tier breakdown | Notes |
|---|---:|---|---|
| Phase C close (PR #31) | 75 | C5: 68, D: 1, C2: 2, C3: 4 | Pre-Phase-D baseline |
| Phase D Wave 1 (PR #34) | 74 | C5: 68, C2: 2, C3: 4, D: 0 | ms-genetics SLA pre-empt; D-tier resolved |
| Phase D Wave 5 (PR #39) | 75 | C5: 69, C2: 2, C3: 4 | +1 intentional C5 from Voltage tightening |
| Phase D close | 75 | C5: 69, C2: 2, C3: 4 | C5 cosmetic clearance deferred |

**Net drift change Phase D:** ±0 entries (reclassified D-tier → resolved; +1 intentional cosmetic).

The "+1" entry is **deliberate and documented**: Wave 5 tightened `ms-electric-circuits-advanced` Voltage slider from 24V to 12V max for classroom realism (24V across 1Ω yields 24A current — unrealistic and unsafe in a classroom narrative). The HTML still allows 1-24V; this is a TS-tighter-than-HTML drift, marked C5 with rationale in the snapshot.

## PRs shipped (9 in this cycle)

| PR | Wave | Title | Slugs | Lines |
|:---:|:---:|---|---:|---:|
| #32 | 3 | repopulate AP Physics 1 standard codes from Fall 2024 redesign | 2 | +102/-2 |
| #33 | 4 | repopulate AP Physics 2 + AP Physics C standard codes | 2 | +62/-2 |
| #34 | 1 | ms-genetics SLA pre-empt — Option A applied | 1 | +144/-112 |
| #35 | 2 | repopulate AP Bio standard codes from CED 2024 | 4 + 1 doc | +56/-4 |
| #36 | 8 | NGSS K-12 performance-expectation coverage gap audit | 0 (docs) | +145 |
| #37 | 9 | WCAG 2.1 AA accessibility audit — 175 public HTML simulations | 0 (docs) | +124 |
| #38 | 10 | HTML JS code-quality audit on 175 simulations | 0 (docs) | +154 |
| #39 | 5 | codex-review nits batch — K-5 reading + accuracy polish + safer Voltage | 6 | +56/-29 |
| #40 | 6 | (this report) Phase D close-out + tech-debt log update | 0 (docs) | TBD |

## Standards repop summary (Waves 2, 3, 4)

8 slugs received re-verified standard codes, sourced from authoritative College Board CED PDFs and codex-validated:

| Exam | Slugs | Codes added | Source CED |
|---|---|---|---|
| AP Bio | ecological-succession | `8.5.B` | CED 2024 (effective Fall 2025) |
| AP Bio | population-dynamics | `8.3.A`, `8.4.A`, `8.5.B` | same |
| AP Bio | hardy-weinberg | `7.5.A` | same |
| AP Bio | cellular-respiration-detail | `3.5.A`, `3.5.B` | same |
| AP Physics 1 | gravity-force-lab-basics | (Wave 3 PR #32 details) | Fall 2024 redesigned CED |
| AP Physics 1 | momentum-collisions | (Wave 3 PR #32 details) | same |
| AP Physics 2 | circuit-dc-virtual-lab | (Wave 4 PR #33 details) | CED |
| AP Physics C: Mech | angular-momentum-3d | (Wave 4 PR #33 details) | CED |

**Audit trails:**
- `docs/reports/d4-ap-bio-code-mapping.md`
- `docs/reports/d4-ap-physics-1-code-mapping.md`
- `docs/reports/d4-ap-physics-2-c-code-mapping.md`

For all four exams, codex was asked to verify the candidate codes against its CED knowledge. **3 of 4 AP Bio mappings received scope corrections from codex** (added `8.5.B` for predator-prey on population-dynamics, added `3.5.B` for ETC detail on cellular-respiration-detail, dropped `8.5.A` for ecological-succession). All accepted corrections trace verbatim to a published CED.

## Audit-only waves (8, 9, 10)

These three waves shipped docs-only PRs documenting cycle-significant findings:

### Wave 8 — NGSS coverage gap (PR #36)
- 119 / 208 NGSS K-12 PEs covered (57% coverage rate)
- 89 gap PEs identified; 51 high-priority (good simulation fit + adjacency to covered)
- Top 10 priority recommendations for catalog roadmap
- Hot spots: HS-PS, MS-PS, HS-LS, MS-ESS strong; K-2 across all DCIs weak; ETS engineering cluster largely uncovered
- Report: `docs/reports/d4-ngss-coverage-gap.md`

### Wave 9 — WCAG 2.1 AA accessibility audit of 175 HTML simulations (PR #37)
- **100% of 175 files lack `prefers-reduced-motion` media query** (in conflict with brand-spec)
- **100% lack `:focus`/`:focus-visible` styles**
- **99% have unlabeled form controls (sliders without `<label>` or `aria-label`)**
- 60% lack semantic landmarks (`<main>`, `<nav>`, `<aside>`)
- Template-wide low contrast on muted text + bright-gradient buttons (some down to 1.81 : 1)
- Color-only signaling for vectors, codons, base pairs, correct/wrong feedback
- WebGL canvas containers lack accessible names
- **Catalog-blocking** posture for Section 508 / WCAG 2.1 AA procurement (school district compliance)
- 8-step remediation roadmap; ~5–8 weeks of template-level work
- Report: `docs/reports/d4-accessibility-audit.md`

### Wave 10 — HTML JS code-quality audit on 175 simulations (PR #38)
- No security-critical issues (no `eval`, no `Function` constructor)
- 7 systemic template issues: CDN integrity, OrbitControls lifecycle, WebGL resource disposal, animation loop cleanup, frame allocation, innerHTML XSS pattern, globals + inline event API
- Per-file: 7-8 issues each across 8-file deep sample, mostly important severity
- Multiple files have **nonfunctional controls or model bugs**:
  - `molecular-polarity.html`: bond-angle slider scale bug; sliders update labels but don't change molecule
  - `protein-synthesis.html`: speed control scales quadratically; toggleLabels button is nonfunctional; preset rebuilding leaks scene objects
  - `ms-genetics.html`: Generations slider has no simulation effect; per-frame model mutation makes simulation refresh-rate dependent
  - `ms-plate-tectonics.html`: density labeling contradicts the explanation (oceanic/continental swap); viscosity slider unused
  - `circular-motion.html`: conical pendulum geometry inconsistent with displayed angle formula
  - `k5-physics-light-propagation.html`: Reset button does nothing; reflection geometry doesn't match stated model
- 7-step remediation roadmap; ~6–10 weeks single-engineer effort
- Report: `docs/reports/d4-html-js-quality-audit.md`

**Net audit takeaway:** the registry has substantial unaddressed quality work in the HTML simulations themselves. Phase D's TS-metadata alignment work (Phase C + D) is necessary but not sufficient for catalog quality. A follow-up cycle should remediate the WCAG and HTML-JS issues at the template level so all 175 files are fixed in unison.

## Wave 7 — DEFERRED with rationale

**Original plan:** Clear all 68 (now 69) C5 cosmetic drift entries via 4 codex parallel batches.

**Why deferred:**

1. **C5 entries are not actually "cosmetic"** as Phase C's tier label suggested. Inspection of sample entries shows each has substantial parameter mismatch (typically "4 TS params not in HTML; 6 HTML controls not in TS"). These are genuine alignment gaps requiring full Phase-C-C3-style slug rewrites (full file regeneration via codex), not minor edits.

2. **Scope estimate per slug:** ~2 minutes codex call + verify + edit. For 69 slugs, that's a separate multi-hour cycle, not work that fits inside this cycle's remaining budget.

3. **Cycle-resource constraints:** This cycle hit a disk-space exhaustion event (ENOSPC on the temp filesystem) mid-execution that required halting all parallel subagents and worktree cleanup. Continuing into Wave 7's full 69-slug scope would likely re-trigger disk pressure.

4. **Quality risk:** Phase C learned that codex output for full slug rewrites has known shape bugs (alias type, tier value) that needed prompt-template guardrails (validated mid-Phase-C in PR #23). Without re-validating against the current codex model availability (`gpt-5` not on account; `gpt-5-codex` not on account; account-default model is what worked here), pushing through 69 slugs blind is high-risk.

5. **Topic_susp triage from Phase C** classified these slugs as `graduates` (i.e., the topic match between TS and HTML is conceptually correct). They are not user-facing wrong concepts — the slider parameter set just doesn't perfectly align between metadata and the underlying simulation. Users of the experiments don't see a broken page; they may see a TS-listed slider that has no HTML counterpart, or vice versa.

**Recommended follow-up cycle:** "Phase E — C5 parameter alignment cleanup". Estimate: 2-3 sessions of codex-batched alignment work (similar to Phase C C3 cadence), with the validated codex prompt template + disk-space pre-check + per-batch tests + drift snapshot regen.

## Validated workflow patterns (Phase D additions to Phase C set)

### Codex model fallback when account-restricted
- The user's preferred model (`gpt-5`) was not available on the ChatGPT account this codex MCP is configured against
- Fallback: account-default codex model worked for all review tasks (high stated confidence; direct PDF/source citations; structured-JSON outputs adhered to schema)
- For future cycles: the codex MCP `model` parameter accepts `gpt-5.2` and `gpt-5.2-codex` per schema, but ChatGPT-account users only get the account default. API-key-based codex configurations would unlock arbitrary model selection.

### Subagent-with-worktree-isolation for parallel waves
- This cycle launched 4 parallel subagents with `isolation: "worktree"` for Waves 2-4-8
- 2 subagents (Waves 3, 4) successfully shipped their PRs before the disk event
- 2 (Waves 2, 8) halted mid-execution and required orchestrator-level recovery
- Pattern is sound but **disk capacity must be pre-checked**: each worktree clones the repo (~few hundred MB) plus pnpm cache; with 4 parallel agents the temp filesystem can saturate

### Authoritative-source pattern for standards work
- Fetch CED PDF via Jina Reader; save raw extract to `/tmp` scratch
- Map each slug's actual scientific content → 1-3 best-matching LOs
- Verify each chosen code verbatim against the source text via codex
- Write the mapping doc BEFORE editing the TS files
- Never use codex output for standard codes without verification — codex can hallucinate current-year codes

### Disk-pressure pre-flight check for cycles with parallel subagents
- Add to cycle pre-flight: `df -h /` minimum 5Gi free before launching parallel worktrees
- After the 4-subagent dispatch this cycle, free disk dropped from ~3Gi to ~120Mi; recovered to ~2.5Gi only after killing agents and `git worktree remove --force`
- Mitigation: serialize codex-only calls (no worktree); only use worktree when subagent does git operations that need branch isolation

## Out-of-scope items (still deferred to future cycles)

These items remain known but were NOT addressed in Phase D and were never planned to be:

| Item | Surface | Rationale | Suggested cycle |
|---|---|---|---|
| C5 cosmetic drift clearance | 69 slugs | See Wave 7 deferral above | "Phase E param alignment" |
| Tailwind CDN → built-CSS migration | 175 HTML files | Tailwind official docs flag CDN for non-production; this is infra-scale work | Independent infra cycle |
| three.js r134 → r170+ upgrade | 175 HTML files | Pinned but stale; per-scene regression test required | Independent infra cycle |
| WCAG 2.1 AA remediation | 175 HTML files | Wave 9 audit identified the work; implementation is a separate cycle | "Phase F a11y remediation" |
| HTML JS quality fixes | 175 HTML files | Wave 10 audit identified the work; implementation is separate | "Phase F JS quality" or bundled with a11y |
| AP code coverage for non-AP-prep slugs | other AP slugs not touched in Phase D | Catalog-wide AP code re-population if needed | Separate audit-then-implement cycle |
| Quick-win NGSS gap implementations | top-10 high-priority gaps from Wave 8 | Each is its own catalog addition (HTML + TS); biggest ones (5-PS1-1 particle model, MS-PS1-6 thermal design) are weeks of design + dev | Catalog roadmap planning |
