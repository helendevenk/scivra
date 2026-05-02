---
name: d4-ts-html-sync-plan
status: backlog
created: 2026-05-02T06:07:20Z
updated: 2026-05-02T08:55:00Z
---

# D4 — TS Metadata vs HTML Simulation Sync Plan

> **Origin:** Wave 7-9 codex audits (Phase 3, 2026-05-01..2026-05-02) repeatedly flagged INTEGRATION findings where `parameters[]` arrays in `src/shared/lib/experiments/data/*.ts` do not match the actual controls in the corresponding `public/experiments/**/*.html` simulation files.
> **Status quo:** Phase 3 contentSections backfill is complete (179/179 slugs, 1434/1434 validation). Those fills were drafted using `parameters[]` as source of truth. When `parameters[]` diverges from HTML, the user-visible content can describe controls that don't exist (or omit ones that do), undermining the value of the fills.
> **Codex review:** completed 2026-05-02 06:30 UTC; revisions applied to v2 of this plan (see §11).

---

## 1. Goal

Ensure every Experiment's `parameters[]` semantically covers the controls a real user can interact with in the published HTML simulation, and update relevant `contentSections` text (parameterExplanations, teacherUseCases, misconceptions) so educational copy matches reality.

**Critical: `parameters[].id` is a semantic identifier (e.g., `objectMass`), NOT a DOM id.** HTML uses DOM ids like `sl-mass`. The audit must match by *meaning + range/role*, not by string equality. To bridge them, this plan introduces a per-slug `htmlControlAliases` mapping.

Acceptance criteria:

- A new test `tests/unit/content/params-vs-html.test.ts` runs in CI and asserts, for every slug in `tests/unit/content/phase3-manifest.ts`:
  - Every meaningful HTML simulation control (after exclusion rules — see §4 Phase A) is **covered** by exactly one entry in `parameters[]` (mapped via `htmlControlAliases` if id strings differ)
  - Every entry in `parameters[]` corresponds to a real HTML control or is documented as a non-HTML mode parameter (e.g., a Pro-tier display toggle)
  - For overlapping controls, range/min/max/step/default agree (or are aliased explicitly)
- The `KNOWN_DRIFT` allowlist in that test reaches **0** entries for shipped waves (excluding Phase D items, which carry explicit owner + expiry).
- All 1434 existing `experiment-content-sections.test.ts` assertions still pass.
- No regression in current CI checks (Lint, Unit Tests, Coverage Ratchet, Build, SEO Audit, Vercel).

Non-goals (this plan):

- D9 (College Board CED standards taxonomy fixes) — separate workstream, blocked on PM baseline decision.
- AP Physics 1 mobile horizontal-overflow UX bug — separate UX workstream.
- Adding new simulation features that don't exist in the HTML (only sync metadata to existing HTML or trim parameters that have no HTML counterpart).

## 2. Context — what we know

The following INTEGRATION mismatches were identified by codex `gpt-5.5` xhigh audits across Wave 7-9 (Phase 3). This is not the full surface area; Wave 3-6 was not systematically audited for D4.

| Wave | File | Type of mismatch |
|---|---|---|
| 7 | ms-chemical-reactions | content promises `catalyst` toggle; HTML has no catalyst control |
| 7 | ms-chemical-stoichiometry | numeric `reaction` selector + 0.5-10 mol; HTML has preset buttons + 0-5 mol |
| 7 | ms-cell-division-comparison | "Both" split-screen + `showLabels` toggle; HTML has 3 single-view presets |
| 7 | ms-ecosystems | `producerPop`, `herbivorePop`, `carnivorePop`, `invasiveSpecies`; HTML exposes prey/predator + presets |
| 7 | ms-food-web-dynamics | `ecosystemType`, `speciesRemoved`, `energyTransfer`; HTML has predator/prey sliders + preset food webs |
| 7 | **ms-genetics** | TS describes Punnett (parent genotypes / X-linked / offspring count); **HTML is actually Hardy-Weinberg/mutation** — topic-level mismatch, classic 🔴 hard case |
| 7 | ms-genetics-punnett | `trialCount`, `dominanceType` virtual-breeding controls; HTML has only parent genotype sliders for complete-dominance grid |
| 7 | ms-photosynthesis-respiration | `process` mode 0/1/2; HTML has no process selector, has glucose slider; CO2/temperature ranges differ |
| 7 | ms-electric-circuits-advanced | `circuitType` w/ Combination, 1-12 V, single resistor; HTML has series/parallel/RC presets, 1-24 V, R1/R2 1-500 Ω |
| 7 | ms-energy-conservation | `airResistance` 0-50% + `initialHeight` 1-20 m; HTML uses discrete friction levels + 1-10 m |
| 7 | ms-force-motion-graphs | `friction` dimensionless 0-0.5; HTML uses friction force in N + initial-velocity control not in .ts |
| 7 | ms-newtons-laws | force 0-100 N, mass 1-50 kg, frictionCoeff 0-0.8, numeric lawDemo; HTML has force 1-50 N, mass 0.5-10 kg, discrete friction, preset buttons (`onclick="applyPreset(...)"`, no `data-param`) |
| 7 | ms-wave-interactions-advanced | wave type/medium/reflection/refraction/diffraction; HTML is two-source interference w/ frequency/phase/amplitude/source separation |
| 8 | (a few K5 INTEGRATION items not yet aggregated) | TBD in Phase A |
| 9 | calculus-grapher | `amplitude`, `frequency`, `function_type` index/step controls; HTML only exposes X Range, Zoom, 5 function buttons |
| 9 | curve-fitting | cubic + sinusoidal models, fit_type 0-4; HTML has Linear, Quadratic, Exponential, Power Law (4 models, 0-3) |
| 9 | plinko-probability | `num_rows` 1-12, `num_balls` 1-100, `prob_right` 10-90%; HTML has rows 5-15, drop rate 1-10, bias 30-70% |

**Estimated total impact:** 25-30 files. Surface area is bounded by the 179 entries in the Phase 3 manifest, but most other waves were drafted before D4 was named so we cannot assume they are clean.

**Special cases discovered in codex review:**

- HTML files live in **`public/experiments/middle/`** for MS labs (not by topic). Audit must read `htmlPath` from the registry, never guess directories.
- ~4 React/R3F experiments (`newtons-laws`, `projectile-motion`, `em-spectrum`, `roller-coaster`) have **no `htmlPath`** at all and use sidebar + R3F components in `src/shared/components/experiments/three/`. D4 needs an explicit handling rule for these.
- HTML range slider value scales sometimes don't match displayed units (e.g., `ms-genetics` `sl-p` ranges DOM 10-90 but displays 0.10-0.90). Audit must capture this transformation, not just the raw `min`/`max`.

## 3. Strategy decision — direction of alignment

Two opposing strategies. **Recommendation: align `.ts` to HTML** (Strategy A) for the bulk of cases, with Strategy B reserved for product-approved exceptions. Topic-level mismatches (e.g., ms-genetics) escape this dichotomy and need a separate decision.

| | Strategy A: `.ts` follows HTML (recommended) | Strategy B: HTML follows `.ts` |
|---|---|---|
| What changes | `parameters[]` semantic ids/ranges, `htmlControlAliases`, `parameterExplanations` keys, teacherUseCases values, sometimes whatIsIt phrasing | HTML `<input>`, `<select>`, `<button>`, JS event handlers |
| Cost per file | ~30-90 min (Edit-only) | ~3-8 h (HTML+JS work, manual QA) |
| Risk | Low — we just shipped contentSections; small edits; tests catch regressions | High — HTML files have no test coverage; visual/interaction regression possible |
| Source of truth | What users actually see and click | What product spec said before HTML drift |
| Reversibility | Trivial (one Edit per file) | Hard (HTML+JS coupling) |

**Why A is the default:** users interact with HTML, not with TypeScript metadata. If the metadata says a control exists and the HTML doesn't have it, users see a broken promise. The fix is to remove the broken promise from metadata, not to back-engineer a new control. Strategy B is reserved for cases where product explicitly wants the missing capability built (e.g., "yes, ms-photosynthesis-respiration should have a process selector — please add it").

**Edge case — semantic vs DOM id divergence:** Strategy A does NOT mean renaming `objectMass` → `sl-mass` in `parameters[].id`. It means adding `htmlControlAliases: { objectMass: 'sl-mass' }` so the audit script can prove coverage without forcing semantic id renames that break external contracts (URL params, analytics, JSON-LD; see Open Q1).

**Topic-level mismatch (e.g., ms-genetics 🔴):** these are not Strategy A or B; they require product to decide whether to (a) replace the HTML simulation, (b) replace the metadata, or (c) ship both as separate slugs. Phase D handles these per the SLA in §4 Phase D.

## 4. Phased execution

Five phases. A and B are gating (must finish before C). C splits by triage tier.

### Phase A — Audit + classification (1-2 sessions)

**Deliverable:** `docs/reports/2026-05-XX-d4-triage.md` containing per-slug rows of `(.ts params, html controls, gap, severity, fix direction, htmlControlAliases proposal)`.

Steps:

1. Write `scripts/audit-params-vs-html.ts` (Node script, productionized so reviewers can re-run):
   - Load the experiment registry directly: `import { getAllExperiments } from "@/shared/lib/experiments/registry"`. Do NOT regex-parse `.ts` source — registry import is the existing source of truth (see [`tests/unit/content/experiment-content-sections.test.ts:2`](../../tests/unit/content/experiment-content-sections.test.ts) for precedent).
   - For each experiment in the manifest:
     - Extract `parameters[].id, label, unit, min, max, default, step, tier`
     - If `htmlPath` is null/undefined, mark slug as `react-r3f` and skip HTML diff (handled in Phase B as `r3f-exempt` allowlist subcategory)
     - Otherwise, read the HTML file at `public/${htmlPath}` and parse via `jsdom` (already a dev dep, [`package.json:181`](../../package.json))
     - Extract HTML controls with **inclusion rules**:
       - `<input type="range|number|checkbox">` with id
       - `<select>` with id and `<option>` values
       - `<button>` with `data-preset` / `data-param` / `onclick="applyPreset(...)" / setMode(...)" / setX(...)"` patterns (parse the JS string for the param name and value)
     - Apply **exclusion rules** for non-parameter UI controls (suffix/id-pattern based):
       - Playback: `play`, `pause`, `playBtn`, `playSpeed`, `speed-*`, `play-*`
       - Reset / fullscreen: `reset`, `resetBtn`, `fullscreen`, `fs-*`
       - Quiz / About modal: `quiz-*`, `about-*`, `helpBtn`, `infoBtn`
       - Data overlay / readout-only: `d-*`, `data-*`, `readout-*`, `display-*`
       - These exclusion regexes live in a single config block in the script for easy review.
     - For each remaining HTML control, capture: `id, kind (range|select|button-preset), label (from <label for=...> or aria-label), min, max, step, value/options, displayed_unit (from sibling text if present), source_section`
   - Compute the diff per slug:
     - `missing_in_html`: param in `.ts` not represented by any HTML control (after applying `htmlControlAliases` if a draft alias exists)
     - `missing_in_ts`: HTML control with no corresponding `.ts` param
     - `range_mismatch`: same control but min/max/step differ (account for displayed-unit transformation, e.g., DOM 10-90 → displayed 0.10-0.90)
     - `type_mismatch`: same id but kind differs (range vs select)
     - `topic_mismatch`: heuristic flag if `.ts` `subtitle` or `description` mentions concepts unrelated to the HTML's title/h1/h2 — surface for manual 🔴 review (don't auto-classify)
   - Output JSONL to `_phase3-research/d4-audit/audit.jsonl` and a markdown summary table.
2. Manual triage of each gap, classify as:
   - 🟢 **Trivial** (range/step/default tweak only): single Edit in `parameters[]`; sometimes a 1-sentence change in `parameterExplanations`
   - 🟢 **Easy** (param needs alias only): add `htmlControlAliases: { semanticId: 'sl-domid' }` — no semantic id rename
   - 🟡 **Drop** (param in `.ts` not in HTML): remove from `parameters[]` + delete `parameterExplanations` key + scrub `teacherUseCases` + scrub `misconceptions` references
   - 🟡 **Add** (control in HTML not in `.ts`): add to `parameters[]` with semantic id (not DOM id) + add alias + write `parameterExplanations` entry; consider adding a `teacherUseCase` that exercises it
   - 🔴 **Hard** (HTML simulation is fundamentally a different experiment than the `.ts` metadata describes, e.g., ms-genetics): defer to Phase D, requires product decision
3. Write the triage report. Order by wave + severity. Tag each row with the recommended fix direction (Strategy A or B) and proposed `htmlControlAliases` for 🟢 Easy items.

**Exit criteria for Phase A:** triage table covers all 179 slugs with severity + direction. Counts of 🟢/🟡/🔴 documented. R3F-exempt slugs listed separately.

### Phase B — Regression test + initial allowlist (1 session)

**Deliverable:** `tests/unit/content/params-vs-html.test.ts` running in CI, with `KNOWN_DRIFT` allowlist initialized from Phase A findings. Allowlist entries carry metadata to prevent rot.

1. Add to the Experiment type (in `src/shared/types/experiment.ts`) an optional field:
   ```ts
   htmlControlAliases?: Record<string, string>;
   ```
   This is a per-slug map from semantic param id → HTML DOM id. No backfill required; absent map means audit assumes id strings match directly.
2. Promote `scripts/audit-params-vs-html.ts` parsing logic into a reusable module so the test and the script share code:
   - `extractTsParams(slug) → { id, min, max, step, alias? }[]`
   - `extractHtmlControls(htmlPath) → { id, kind, min?, max?, label, displayedUnit? }[]`
   - `diffControls(tsParams, htmlControls, aliases) → { missing_in_html, missing_in_ts, range_mismatch, type_mismatch }`
3. Write the test:
   - For each slug in manifest:
     - Compute diff
     - If diff is empty → assertion passes
     - If slug is in `R3F_EXEMPT` → skip with a marker
     - If diff is non-empty and slug is in `KNOWN_DRIFT` with matching diff → pass
     - Otherwise → fail with the diff in the failure message
   - `KNOWN_DRIFT` is a typed constant inside the test file. Each entry has shape:
     ```ts
     {
       diff: { /* the exact diff snapshot */ },
       owner: "claude" | "smith" | "<github-handle>",  // who will fix
       tier: "C1" | "C2" | "C3" | "D",                  // which batch
       expires: "2026-MM-DD",                            // hard deadline
       reason: "string",                                 // 1-line context
     }
     ```
   - **CI gate**: any new drift not in `KNOWN_DRIFT` fails the build immediately. PRs cannot enlarge the allowlist except via a PR that explicitly adds the entry with owner+expires.
   - **PR gate**: any Phase C PR that touches a slug in `KNOWN_DRIFT` must remove that slug's entry. Enforced by a small lint script that diffs `KNOWN_DRIFT` between PR base and HEAD.
4. Run the test against current main; it should pass with the allowlist populated.
5. Commit: `test(content): add params-vs-html regression test with D4 allowlist`

**Exit criteria for Phase B:** test passes on main with allowlist populated; CI green; new-drift fail-fast confirmed by intentionally introducing a fake drift and seeing CI red.

### Phase C — Batch fixes (4-6 sessions)

Each batch = one PR, one squash-merge. **Smaller batches than the original plan** per codex review (each slug touches multiple sections, review cost is non-trivial).

| Batch | Tier | Slugs/PR | Notes |
|---|---|---:|---|
| C1 | 🟢 trivial range tweaks | 10-15 | Fast, low-risk warmup |
| C2 | 🟢 easy aliases | 8-12 | Add `htmlControlAliases`, no parameterExplanations rewrites |
| C3 | 🟡 drops (param in .ts not in HTML) | 5-8 | Touches parameterExplanations, teacherUseCases, misconceptions |
| C4 | 🟡 adds (HTML control not in .ts) | 5-8 | New parameterExplanations entries needed |
| C5 | sweep | varies | Re-run audit, catch any miss; KNOWN_DRIFT → 0 for tiers C1-C4 |

Per batch:

1. Branch `feat/d4-batch-{N}` from latest main
2. Apply edits manually in batches (Wave 8 lesson F4: subagent rate limit risk on 30+ Edits). For batches with ≤10 findings the fix subagent is fine; otherwise manual.
3. After each file: `pnpm test tests/unit/content/experiment-content-sections.test.ts` — must still pass 1434/1434
4. After all files in batch:
   - `pnpm test tests/unit/content/params-vs-html.test.ts` — KNOWN_DRIFT entries removed for fixed slugs
   - `pnpm test` — full unit test suite
5. `pnpm exec tsc --noEmit` — clean
6. Commit + push + PR
7. Run codex `gpt-5.5` xhigh audit on the `.ts` changes (single chunk per batch)
8. Apply audit patches
9. Wait CI, squash-merge, sync main

### Phase D — Hard cases (per-product-decision, with SLA)

For 🔴 entries: bring to product PM with a structured decision packet:

**Per-hard-case decision packet template** (committed in `docs/reports/d4-hard-cases/{slug}.md`):
- Slug name + current `.ts` description
- Screenshot of the actual HTML simulation (Vercel preview link)
- Side-by-side: what `.ts` says vs what HTML does
- Three options:
  - **Option A (cheapest):** keep HTML, rewrite metadata + contentSections to match the actual simulation (~2-4h per slug)
  - **Option B (mid):** keep metadata, build the missing simulation features in HTML+JS (~6-12h per slug)
  - **Option C (most disruptive):** ship as two separate slugs (split into the metadata-described thing and the HTML thing) (~6-10h)
- Recommended default (typically A)
- Cost estimate per option
- Decision deadline (SLA: 14 days from packet open)

**SLA enforcement:**
- If PM does not respond within 14 days → default to recommended option (typically Strategy A: rewrite metadata)
- This rule is documented in the test's `KNOWN_DRIFT` `expires` field and enforced when expires passes
- Phase D items count toward the "allowlist → 0" goal only after their expires-driven default has been applied

## 5. Validation strategy

Per PR:

- `pnpm test tests/unit/content/experiment-content-sections.test.ts` — 1434/1434 pass (zero regression on Phase 3 work)
- `pnpm test tests/unit/content/params-vs-html.test.ts` — assertions adjusted to reflect KNOWN_DRIFT shrinkage; new-drift fail-fast still holds
- `pnpm exec tsc --noEmit` — clean
- CI 7/7 SUCCESS (Lint, Unit Tests, Coverage Ratchet, Build, SEO Audit (homepage), Vercel, Vercel Preview Comments)
- **Per-changed-slug** validation: Vercel preview opens cleanly + the experiment **detail page** (not the HTML sim) renders the new `parameterExplanations` text and reflects updated parameter ranges in the sidebar. Manual spot-check; one slug per topic group is sufficient since the changes are metadata-only.
- For C3/C4 batches that change `parameters[]` shape: regression check that the experiment **gallery page** still loads and filters work (parameter changes can affect filter UIs if any consume them).

End-state validation (after Phase C complete):

- `KNOWN_DRIFT` empty for all non-Phase-D slugs
- Per-wave codex re-audit (`xhigh`) shows 0 INTEGRATION findings on params/HTML alignment
- Experiment detail pages render correctly across a 5-slug sample (manual spot-check)

## 6. Cost estimate

| Phase | Estimate |
|---|---|
| A (audit + triage with jsdom) | 1-2 sessions, ~4-6 h |
| B (regression test + Experiment type extension) | 1 session, ~3 h |
| C (batch fixes, 5 batches at smaller sizes) | 4-6 sessions, ~10-18 h depending on hard-case count |
| D (hard cases, conditional) | 14-day SLA per case; default-applied if no PM response |

Total realistic timeline: **6-9 sessions** to ship Phases A-C cleanly.

## 7. Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Audit script confuses semantic params with DOM ids and proposes naive renames | High | High | Strategy uses `htmlControlAliases`, never auto-renames semantic ids. Phase A explicitly preserves semantic id stability. |
| `parameters[].id` is consumed by external contracts (URL, analytics, JSON-LD, gallery filters) | Med | High | Open Q1 must be resolved before Phase A. Strategy A renames are forbidden until grep across `src/`, `public/`, and analytics configs confirms zero external consumers. |
| HTML files have no test coverage; editing one regresses another | Med | High | Strategy A doesn't edit HTML; only Strategy B does, and that's reserved for explicit product approval. |
| Same parameter ID has different meaning in different sims (e.g., `temperature` in weather vs chemistry) | Med | Med | Audit script keyed per slug; do not cross-reference param semantics across files. |
| jsdom misses a custom-control pattern unique to one HTML file | Med | Med | Phase A reviews per-slug findings manually; unknown patterns are flagged for inclusion-rule extension before Phase B test runs. |
| Fix subagent batched Edit hits rate limit (Wave 8 F4 lesson) | Med | Low | Default to manual batched Edit; use subagent only when prompt is bounded (<10 findings) |
| Editing contentSections accidentally breaks one of 1434 existing assertions | High | High | Always run `experiment-content-sections.test.ts` after each file; never push without 1434/1434 |
| HTML drift continues after fix because nothing prevents future divergence | High | High | **Phase B is the long-term defense:** the regression test must be added before Phase C edits begin. Fail-fast on new drift is non-negotiable. |
| Codex audit on Phase C batches blocked by chatgpt.com cert (Wave 6 F1 lesson) | Low | Med | Sonnet self-audit fallback; document cert blocker in commit message if applied |
| KNOWN_DRIFT becomes a permanent allowlist that is never shrunk | High | High | Per-entry `owner` + `expires`; CI test asserts no entry past its expires date. PR-level enforcement that any C-batch PR touching a known-drift slug removes its entry. |
| Phase D items languish without PM owner | High | Med | 14-day SLA with auto-default to Strategy A; documented in the `expires` field of each Phase D allowlist entry. |
| React/R3F experiments (4 files) have no HTML to compare; D4 logic doesn't apply | Med | Low | `R3F_EXEMPT` set in the test config covers them; they get a separate optional follow-up to verify R3F sidebar param wiring. |
| HTML range slider DOM value scale differs from displayed value (e.g., 10-90 DOM → 0.10-0.90 displayed) | Med | Med | Audit script captures both DOM range and displayed unit/transformation; `range_mismatch` only flags when the post-transform values differ. |
| Topic-level mismatches (ms-genetics) not caught by ID/range matching | High | Med | Heuristic `topic_mismatch` flag in audit script comparing `.ts.subtitle` to HTML `<title>`/h1/h2; surfaces 🔴 candidates for manual review. |

## 8. Open questions

1. **Is `parameters[].id` consumed by any external contract?** Specifically: gallery search/filter URL params, analytics events, SEO JSON-LD, saved sessions, embed iframe URLs. Resolution required before Phase A so the script knows whether semantic id renames are even on the table. **Action:** grep `src/`, `public/`, analytics configs for `parameters[].id` usage; document in `_phase3-research/d4-audit/external-contracts.md`.
2. ~~**For 🔴 hard cases without PM response within 14 days, is "default to Strategy A" acceptable?**~~ **RESOLVED 2026-05-02 — yes, default to Option A (rewrite metadata).** Documented in `docs/reports/d4-hard-cases/README.md` SLA section. Each hard-case packet's `expires` field aligns with the 14-day deadline; once `expires < today`, the regression test fails CI with the packet path in the failure message. The next person to see the failure follows the packet's recommended default (typically Option A — keep HTML, rewrite metadata) and removes the entry from `KNOWN_DRIFT`. PM may override per-case via the `## Decision` section of each packet before the deadline.
3. ~~**Should preset buttons enter `parameters[]`?**~~ **RESOLVED 2026-05-02 — Option (a):** added `presets?: ExperimentPreset[]` field to the Experiment type (`src/shared/types/experiment.ts`). Each preset has `{ id, label, description?, paramValues? }`. Audit script matches `presets[].id` against HTML preset button targets (last segment of `preset:<fn>:<value>` ids). Validated on ms-newtons-laws — went from 4+6 missing controls to clean diff. parameterExplanations stays focused on continuous params; teacherUseCases reference presets by label.
4. ~~**For React/R3F experiments (4 files) without `htmlPath`, how do we cover params-vs-actual-controls drift?**~~ **RESOLVED 2026-05-02 — keep R3F_EXEMPT in v1.** The 4 R3F experiments (newtons-laws, projectile-motion, em-spectrum, roller-coaster) wire their controls via the React Three Fiber sidebar in `src/app/[locale]/(landing)/experiments/[slug]/ExperimentClient.tsx`, which uses literal string lookups for prop names (e.g., `parameters.mass`, `parameters.force`). Auditing these requires AST-level analysis of the R3F prop wiring rather than HTML parsing. Deferring to a future Phase E if user-reported drift surfaces; until then, the R3F sidebar acts as direct visual ground truth (params and controls are in the same file). The `R3F_EXEMPT` set in `tests/unit/content/params-vs-html.test.ts` is the formal exemption mechanism.
5. **Add `htmlControlAliases` to the Experiment type globally, or only in `parameters[]`?** This plan proposes top-level on the Experiment object. Alternative: `parameters[].alias?` per-param. The latter colocates the alias with the param but adds noise. Decision needed in Phase B.

## 9. Recommended first step

Start Phase A with the codex-review-revised approach:

1. Resolve Open Q1 (external contracts) — quick grep, ~30 min
2. Write `scripts/audit-params-vs-html.ts` using jsdom + registry import (NOT regex on `.ts`)
3. Apply inclusion + exclusion rules from §4 Phase A
4. Generate triage report

After Phase A produces the triage:

1. Decide whether to productionize the script (default: yes, lives in `scripts/`)
2. Commit Phase B regression test with allowlist matching Phase A findings (with owner/tier/expires)
3. Start C1 trivial fixes as a heat-warmup batch

## 10. Success metrics

- 0 INTEGRATION findings on params/HTML in next codex re-audit of any wave
- `KNOWN_DRIFT` allowlist size: 25-30 → 0 (excluding Phase D items, which carry expires SLA)
- contentSections tests still 1434/1434
- 0 user-reported "the slider doesn't work" / "the option isn't there" bugs in a 30-day window post-Phase-C ship
- Audit script runnable by any reviewer via `pnpm tsx scripts/audit-params-vs-html.ts` and produces deterministic output

## 11. Codex review (2026-05-02)

This v2 incorporates a codex `gpt-5.5` high-reasoning review of the v1 draft. Key revisions:

- §1: acceptance criteria reframed as "semantic coverage with aliasing" instead of literal id equality
- §2: surfaced HTML directory structure (`public/experiments/middle/`), R3F-no-htmlPath case, DOM-vs-displayed value scale issue, topic-level mismatch (ms-genetics) as a new category
- §3: explicit semantic-vs-DOM id distinction; topic-level mismatch carved out as Phase D
- §4 Phase A: switch from regex TS parse to registry import; switch from regex HTML parse to jsdom; explicit inclusion + exclusion rules; preset button parsing including `onclick="applyPreset(...)"`; capture displayed-unit transformation
- §4 Phase B: `htmlControlAliases` field added to Experiment type; `KNOWN_DRIFT` carries owner/tier/expires/reason; CI fails on new drift; PR-level enforcement requires C-batch PRs to shrink allowlist
- §4 Phase C: smaller batch sizes (10-15 trivial, 5-8 drops/adds) per codex feedback that each slug touches multiple contentSections fields
- §4 Phase D: PM decision packet template with 14-day SLA + auto-default to Strategy A
- §5 Validation: per-changed-slug detail-page check (not HTML sim), gallery regression for shape changes
- §7 Risks: added 5 new risks (semantic-vs-DOM, external contracts, jsdom misses, KNOWN_DRIFT rot, topic-level mismatch heuristic)
- §8 Open Qs: 5 open questions resolved before Phase B, including external contracts (Q1) and preset modeling (Q3)

Codex full review log: `_phase3-research/d4-plan-review/codex-review-v2.log`

## 12. Phase A audit results (2026-05-02 06:50 UTC)

**Initial audit completed.** Surface area is significantly larger than the v1 estimate of 25-30 files. Raw classification:

| Severity | Tier | Count | Fix direction |
|---|---|---:|---|
| ✅ OK | — | 0 | no action |
| 🟢 trivial | C1 | 0 | range tweaks |
| 🟢 easy | C2 | 0 | aliases only |
| 🟡 drop | C3 | 1 | remove .ts params |
| 🟡 add | C4 | 0 | add HTML controls |
| 🟡 mixed | C5 | 38 | combination drop+add |
| 🔴 hard | D | 76 | topic-level mismatch (PM decision) |
| ⚪ exempt | R3F | 4 | no HTML to audit |
| ⚫ html-missing | HTML-MAP | 60 | no `EXPERIMENT_HTML_MAP` entry — **separate tech debt, out of D4 scope** |

**Critical caveats:**

1. The 🔴 hard count is inflated by a cheap word-overlap heuristic that flags any `.ts.subtitle` lacking a 4+-letter word in common with the HTML's `<title>`. Many of these are legitimate topic matches with different phrasing (e.g., "Mole ratios, limiting reagents, and reaction yields" vs HTML title "Stoichiometry — Particle Counter"). Real 🔴 count after manual review is likely much smaller (estimate: 10-20 true hard cases like ms-genetics).
2. The 0 trivial / 0 easy count is because no slug currently has an `htmlControlAliases` map. Most "🟡 mixed" classifications reflect that the audit can't tell `objectMass` should map to `sl-mass` without aliases. Adding aliases will reclassify many of these to 🟢 easy.
3. 60 slugs in `tests/unit/content/phase3-manifest.ts` have NO entry in `src/shared/lib/experiments/html-map.ts`. At runtime `getExperimentHtmlPath(slug)` returns null. These ship with content but no iframe simulation. **This is a different tech debt** — possibly experiments that have HTML in `public/` but were never wired into the map, or experiments that intentionally use a different rendering path. **Recommendation: open a separate sister issue ("D5 — html-map gaps") and don't conflate with D4.**

**Revised cost expectation:**

After Phase A.2 (manual review of 🔴 candidates) and Phase A.3 (pilot 2-3 slugs through C2 alias workflow), the realistic distribution is likely:

- 🟢 trivial+easy: 80-100 (most of the "mixed" + many "hard")
- 🟡 drop+add+mixed: 20-30
- 🔴 hard (true topic mismatch): 10-20

**Revised timeline:** 8-12 sessions for D4 alone (Phases A complete; B requires the htmlControlAliases bulk-add workflow to be different than originally drafted).

**Recommended next step:** ~~Pilot Phase C2 (aliases-only) on a single slug~~ **DONE 2026-05-02.** Pilot on `ms-newtons-laws` succeeded:

| Stage | Result |
|---|---|
| Add `htmlControlAliases` (C2) | 4 missingInHtml → 1 (lawDemo); 6 missingInTs → 3 (presets) |
| Align ranges + parameterExplanations + teacherUseCases (C1) | rangeMismatch 3 → 0 |
| Resolve Q3 — extract lawDemo discrete param into `presets[]` field | full diff → empty (CLEAN) |

**Gold-standard workflow per slug** (validated end-to-end, ~30-40 min for ms-newtons-laws):

1. Read `_phase3-research/d4-audit/audit.jsonl` row for the slug
2. Add `htmlControlAliases` for slider semantic↔DOM id mappings
3. Align `parameters[].min/max/step/default` to HTML control attributes
4. If HTML has preset buttons, extract any "scenario selector" discrete param into `presets[]` and remove it from `parameters[]`
5. Update `parameterExplanations` to reflect new ranges/semantics
6. Update `teacherUseCases` parameter values to be in-range; replace "set lawDemo to N" wording with "click the X preset"
7. Run validation: `pnpm test tests/unit/content/experiment-content-sections.test.ts` → 1434/1434
8. Run `pnpm tsx scripts/audit-params-vs-html.ts` → confirm clean diff for that slug

Artifacts:

- Script: `scripts/audit-params-vs-html.ts`
- Classifier: `scripts/d4-classify-triage.ts`
- Raw data: `_phase3-research/d4-audit/audit.jsonl`
- Summary: `_phase3-research/d4-audit/audit-summary.md`
- Triage report: `docs/reports/2026-05-02-d4-triage.md`
- Open Q1 resolution: `_phase3-research/d4-audit/external-contracts.md`
