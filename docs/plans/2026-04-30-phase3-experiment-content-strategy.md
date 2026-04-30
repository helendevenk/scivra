---
name: phase3-experiment-content-strategy
status: backlog
created: 2026-04-30T06:01:01Z
updated: 2026-04-30T06:01:01Z
---

# Phase 3 — 169 Experiment Content Backfill Strategy

> **Companion:** `2026-04-30-phase3-experiment-content-execution.md` (TDD task plan)
> **Origin:** Phase 1+2 SEO remediation shipped 2026-04-30 (PR #2 / merge `fa94f20`); Phase 3 deferred to a separate work block per the post-ship retrospective.
> **Reference:** `docs/reports/2026-04-30-seo-remediation-retrospective.md` §10.1 (risks) + §12 (next steps).

## 1. Goal

Bring all **179** registered experiments up to the same content depth as the **10 P0 experiments** filled during Phase 2. Concretely: every `Experiment` definition in `src/shared/lib/experiments/data/*.ts` carries a complete, classroom-grade `contentSections` block, and every public experiment URL renders the long-form template + a valid `FAQPage` JSON-LD.

Success = "any AP / NGSS / K-5 search query that lands on a Scivra experiment page reads like a real lesson, not a slug stub."

## 2. Current state (2026-04-30)

- Total registry: **179 experiments** (175 public HTML + 4 Wave-1 R3F).
- With `contentSections` filled: **10** (Phase 2 P0 set).
- Without `contentSections`: **169**.
- Page renders are already wired: `src/app/[locale]/(landing)/labs/[subject]/[standard]/[slug]/page.tsx:244-250` calls `<ExperimentContentSections>` + `<ExperimentFaq>` — no app code changes needed for Phase 3.

### 2.1 Distribution of the 169 missing

| Primary standard | Count | Notes |
|---|---:|---|
| `ap-physics-2` | 33 | E&M, optics, modern, thermo |
| `ap-physics-1` | 29 | Mechanics, waves intro |
| `ngss-ms` | 26 | Middle school cross-discipline |
| `elementary-k5` | 23 | K-5 cross-discipline |
| `ap-biology` | 17 | Cell, genetics, evolution |
| `ap-chemistry` | 15 | Atomic, bonding, kinetics |
| `ngss-hs` | 13 | Earth & space, high school |
| `ap-physics-c` | 10 | Calculus-based mech + E&M |
| `general` | 3 | Math/calculus tools |

By **subject**: physics 87, earth-science 28, biology 28, chemistry 23, math 3.

By **tier** (free / pro / unparseable inline tier): 150 / 4 / 15 (the 15 unparseable use a multi-line tier expression but are still standard `free`/`pro`).

## 3. Why this work matters

Phase 2 lifted 10 experiments from ~280 words to ~1130 words and added FAQPage schema. KPI lift confirmed in retrospective §3.3:

- Word count: **4-5× lift** on filled experiments.
- FAQPage schema coverage on filled experiments: **10/10 (100%)**.
- Production verification (30-experiment sample): 9/9 P0 in sample showed FAQPage + cleaned NeonPhysics residue.

The **risk** of leaving 169 thin: long-tail search queries land on shell pages, Google judges site-wide content thin, indexing of new experiments stalls, branded/non-branded CTR for experiment URLs caps low. Per retrospective §10.1, this is the dominant Phase 3 risk.

The **opportunity**: 169 fills × ~1100 words = ~186K words of original, classroom-grade content. Combined with the existing JSON-LD wiring, every fill ships a fully indexable lesson page — no further dev work required.

## 4. Out of scope

- `/learn/*` learning-path content (separate, requires subject-matter review; schema already temporarily downgraded to `WebPage` per retrospective §4.3).
- New `Course`-grade schema work — keep using the same `LearningResource` + `BreadcrumbList` + `FAQPage` triple Phase 2 introduced.
- New experiments — Phase 3 is about the existing 169 only.
- Translations — site is English-only per `src/config/locale/index.ts` (`localePrefix: 'never'`); zh.mdx files were marked inactive in commit `905e705`.
- Video / animated GIF assets — not required; the existing simulation already provides the visual.

## 5. Wave structure

Waves are ordered by **expected SEO impact × content reuse value**, not by registry alphabetical order. Each wave is a self-contained deliverable: ship the wave, observe the indexing impact, move to the next. Within a wave, experiments are written in slug-alphabetical order so the writer keeps a stable rhythm.

| Wave | Standard | Count | Estimated days | Why this position |
|---|---|---:|---:|---|
| 1 | `ap-physics-1` | 29 | 1.5–2 | Highest AP search volume; mechanics is the most-searched physics topic on US-K12 |
| 2 | `ap-physics-2` | 33 | 2 | E&M / optics / thermo round out the AP Physics catalog; pairs naturally with Wave 1 link graph |
| 3 | `ap-biology` | 17 | 1 | AP Bio is the fastest-growing AP subject in registrations; smaller catalog → fast wins |
| 4 | `ap-chemistry` | 15 | 1 | Same logic as Wave 3; AP Chem has a clear K-12 funnel from middle school chem |
| 5 | `ap-physics-c` | 10 | 0.5 | Niche but high-intent; calculus-based audience is small but converts |
| 6 | `ngss-hs` | 13 | 0.5 | High-school earth & space, broadens beyond AP-only audience |
| 7 | `ngss-ms` | 26 | 1.5 | Middle school broad coverage; large long-tail keyword surface |
| 8 | `elementary-k5` | 23 | 1.5 | K-5 long-tail; lower per-page volume but very specific search intent |
| 9 | `general` | 3 | 0.25 | Calculus-grapher / curve-fitting / plinko — math tools, write last |

Total estimate: **9.25 working days** of focused writing at the Phase 2 quality bar, or **6–7 days** if the second pass through each wave skips polish iterations.

The execution plan locks each wave to a Task (Tasks 1–9) plus a setup task (Task 0) and a final verification task (Task 10).

## 6. Per-experiment writing protocol

Reference template: `src/shared/lib/experiments/data/projectile-motion.ts` lines 120–191 (the canonical Phase 2 fill). Every Phase 3 fill mirrors that shape.

### 6.1 Required fields (must all be present)

```ts
contentSections: {
  whatIsIt: string;                            // 100–150 words
  parameterExplanations: Record<paramId, str>; // one entry per parameters[].id
  misconceptions: { wrong, correct }[];        // 3–5 pairs
  teacherUseCases: string[];                   // 3–5 items
  faq: { question, answer }[];                 // 4–6 pairs
}
```

Type contract: `src/shared/types/experiment.ts:107-119`. All fields are technically optional in the type (legacy compatibility), but Phase 3 requires all five for every experiment.

### 6.2 Field-by-field rubric

**`whatIsIt` (100–150 words):** Lead with a one-sentence definition framed in concrete terms ("Newton's second law says…"). Follow with one real-world hook ("when you push a shopping cart…"). End with a sentence that points back at the simulation ("Drag the mass slider and watch the acceleration curve change in real time."). No AP-jargon-first openings; the reader may be a curious 10th-grader who landed via search.

**`parameterExplanations` (one entry per `parameters[].id`):** 1–2 sentences each. Explain (a) what the parameter physically *is*, (b) what changing it does to the visible simulation, (c) when relevant, the units and a representative real-world value. Keys MUST match `parameters[].id` exactly — the rendering component (`experiment-content-sections.tsx:46-47`) silently filters out mismatched keys.

**`misconceptions` (3–5 pairs):** Each pair is `{ wrong: string, correct: string }`. The `wrong` should be a real student-voice mistake, not a strawman ("students often say X" rephrased into first person — "X always means Y" / "If A then never B"). The `correct` answer must directly engage the wrong claim, not change subject. Source ideas from AAPT misconception lists, NGSS evidence statements, and the experiment's own theory section.

**`teacherUseCases` (3–5 strings):** Each string is a complete classroom activity, not a feature description. Format: "[verb] [activity] — [observation goal]." Examples in `projectile-motion.ts:158-163`. At least one use case should reference data collection (e.g. "have students record range at 10° increments and plot the curve"); at least one should reference a misconception probe (paired with the `misconceptions` block).

**`faq` (4–6 Q/A pairs):** Questions must be real student-search-intent phrasings ("Why is the sky blue?" not "How does Rayleigh scattering work?"). Each answer is 2–4 sentences and ends with either a number/value, a unit, or a specific instruction ("set angle to 22° and replay"). At least one FAQ must explicitly tie the experiment to its `standards.ngss[]` / `standards.ap[]` codes — this is what drives FAQPage rich-result eligibility for AP/NGSS-keyword queries.

### 6.3 Word count target

Aim for **~1100 total words across the five fields**. The Phase 2 average was 1130. Going below 800 risks Google judging the page thin; going above 1500 flattens reading flow.

### 6.4 Voice & style

- Conversational but informed; second-person ("you") is OK in `whatIsIt` and `teacherUseCases`, never in `faq` (which is reference content).
- No "in this lab you can…" filler — the simulation is on the same page; don't narrate it.
- Concrete numbers always beat abstractions: "9.8 m/s² on Earth, 1.6 m/s² on the Moon" beats "gravity varies by planet".
- Cite standards by code, not paraphrase: "AP Physics 1 expects 2D kinematics" not "AP Physics expects basic motion".
- US English. AP/NGSS terminology over IB/GCSE unless the experiment's `primaryStandard` is GCSE-flagged.

### 6.5 Forbidden patterns (per CLAUDE.md + retrospective §4)

- No "// TODO", "fill in later", or empty arrays.
- No 175-vs-179 number drift — defer to the experiment's actual `standards`/`tags` for any catalog count claims.
- No NeonPhysics residue (Phase 1 cleared this; don't reintroduce).
- No `<` / `>` / `&` raw characters in JSON-LD-bound strings — `serializeJsonLd` handles escaping, but writers shouldn't embed raw HTML in answers.
- No "this lab uses cutting-edge AI" or marketing voice. Educational tool register only.

## 7. TDD validation approach

Phase 2 had no automated content validation — writers eyeballed each fill against the projectile-motion template. Phase 3 introduces a Vitest-based validation layer (Task 0 in the execution plan) so each wave's commit produces a green or red signal independent of human review.

### 7.1 What the validation test asserts

For every experiment in the registry whose slug appears in the wave's manifest:

- `contentSections` is defined.
- `whatIsIt` exists and is ≥ 80 words.
- `parameterExplanations` is defined and every key is in `parameters.map(p => p.id)`.
- `parameterExplanations` has ≥ `Math.min(parameters.length, 1)` entries (i.e., at least one explained parameter; ideally all).
- `misconceptions` has 3–5 entries; every entry has non-empty `wrong` and `correct`.
- `teacherUseCases` has 3–5 entries; each is ≥ 30 characters.
- `faq` has 4–6 entries; every entry has non-empty `question` ending in `?` and non-empty `answer` of ≥ 100 characters.

The test file is `tests/unit/content/experiment-content-sections.test.ts`; it imports the registry and runs assertions table-driven by a `PHASE3_FILLED_SLUGS` set the writer extends per wave.

### 7.2 What the validation test does NOT assert

- Word count over upper bound (style judgment, not correctness).
- Voice / register / educational accuracy (requires human or LLM review).
- FAQ search-intent quality (no automated check possible).
- Misconception authenticity (manual review).

These four belong in the post-wave review gate (§9 below).

## 8. Subagent dispatch strategy (LLM-leveraged parallel execution)

Per D6 above (revised 2026-04-30), sonnet 4.6 subagents are first-class content drafters. The full dispatch pattern per wave:

### 8.1 Three-layer pipeline

**Layer A — Pre-wave research (1 codex call, gpt-5.5 medium):** Extract `theory`, `formulas`, `parameters`, `challenges`, `standards` from each wave's experiment data files. Output piped to `_phase3-research/wave-N.md` as writer briefing. Scoped, mechanical, fast (3-5 min).

**Layer B — Parallel content drafting (3-5 sonnet 4.6 subagents):** Each subagent receives:
1. The compressed §6.2 rubric (inline in the prompt — no cross-doc references).
2. The wave's voice notes from execution plan (e.g., "AP Bio misconceptions skew toward Lamarckism").
3. The Layer A research briefing for its slugs.
4. The canonical `projectile-motion.ts:120-191` reference inline.
5. A batch of 5-10 slugs to draft.

Subagents return contentSections blocks for their slugs as TypeScript-formatted text. Main session merges into the data files. Parallel dispatch turns a 33-experiment wave from ~6 hours sequential to ~45 min concurrent.

**Layer C — Post-wave review (codex gpt-5.5 xhigh, chunked):** Run codex review on 5-file batches, not 29-file blasts (this avoids the retrospective §5.1 stall pattern). 8-dimension audit per batch. Output piped to `_phase3-research/wave-N-review.md`.

### 8.2 What stays in the main session

- **Voice consistency review** across the parallel subagent outputs before commit.
- **Sensitive-subject overrides:** if a subagent draft mishandles a topic with cultural/scientific edge cases (evolution, climate, religion-adjacent astronomy), main session rewrites that fill manually.
- **Final polish:** trim to ~1100 word target, harmonize cross-experiment cross-references, fix any `parameterExplanations` key mismatches the validation gate flags.

### 8.3 What stays out

Codex is **explicitly NOT used for content writing** per retrospective §4.4 — subject accuracy + xhigh stall risk. Codex roles in Phase 3: research extraction (Layer A) and review audit (Layer C) only.

### 8.4 Parallel dispatch concurrency

Maximum 5 parallel subagents per wave to keep token spend bounded and merge complexity manageable. For waves under 15 slugs (Wave 5 / 6 / 9), dispatch 2 subagents; for waves over 25 slugs (Waves 1 / 2 / 7 / 8), dispatch 5.

## 9. Quality gates

Each wave passes through three gates before its PR merges:

**Gate A — Schema validation (automated):** Vitest content test (§7.1) green for the wave's slugs.

**Gate B — Production rendering (manual + curl):** After Vercel preview deploy, sample 3 random experiments from the wave and verify:

```bash
SLUG="<example-slug>"
SUBJECT="<example-subject>"
STANDARD="<example-standard>"
curl -s "https://<preview>.vercel.app/labs/$SUBJECT/$STANDARD/$SLUG" \
  | python3 -c "
import sys, json, re
html = sys.stdin.read()
faq = re.search(r'<script type=\"application/ld\\+json\">([^<]+\"FAQPage\"[^<]+)</script>', html)
print('FAQPage schema:', 'YES' if faq else 'NO')
print('Common misconceptions section:', 'YES' if 'Common misconceptions' in html else 'NO')
print('How teachers use this lab section:', 'YES' if 'How teachers use this lab' in html else 'NO')
"
# Expected: all YES
```

**Gate C — Content review (manual sampling):** Random 5/N experiments per wave reviewed by a human reader (or a `code-review-expert` subagent with the §8 review prompt) against the §6.2 rubric. Reject if any: misconception strawmans, FAQ answers shorter than 100 chars, parameterExplanations key mismatch, or word count below 800.

## 10. Schedule & cadence (LLM-leveraged sprint)

Per D6 + D8, the chosen cadence is **2-3 waves/day via parallel sonnet 4.6 subagent dispatch**, not the original "1 wave/day single-session writing".

**Target: 3-4 calendar days, ~24 wall-clock hours of orchestration.** Subagent compute runs concurrent so wall-clock stays bounded even at 169 fills.

### 10.1 Per-wave delivery rhythm (revised for parallel)

For each wave (1-3 hours wall-clock, depending on wave size):

1. **Setup (5 min):** Branch from fresh main; run pre-flight `git remote get-url $REMOTE`, `codex --version`, `pnpm tsc --noEmit`.
2. **Layer A research (3-5 min):** Single codex call extracts theory/formulas/standards for all wave slugs to `_phase3-research/wave-N.md`.
3. **Manifest + failing test (5 min):** Append wave slugs; run validation test → expect N new failures.
4. **Layer B parallel drafting (30-60 min wall-clock):** Dispatch 2-5 sonnet 4.6 subagents in a single multi-tool message. Each gets a slug batch + inline rubric + voice notes + research briefing + projectile-motion reference. They run concurrently.
5. **Merge + main-session polish (20-40 min):** Insert subagent outputs into data files, run validation test, fix any structural failures, harmonize voice across batches, manually rewrite any sensitive-subject draft.
6. **Layer C codex review (10-15 min, chunked):** Codex xhigh review in 5-file batches; output to `_phase3-research/wave-N-review.md`. Patch any P1/P2 finding.
7. **Typecheck, commit, push, PR (5 min):** Single commit per wave, branch `feat/phase3-wave-N-<standard>`.
8. **Gate B (5 min):** Full automated curl across all wave slugs on Vercel preview (not 3-sample). Assert 4-section markers + FAQPage schema on every URL.
9. **Squash merge; refresh local main; next wave.**

### 10.2 Multi-wave-per-day guidance

Two waves can run back-to-back the same day if Layer B subagent results merge cleanly. Three is realistic for small waves (5, 6, 9). Keep ≥ 30-min cooldown between merges to give Vercel preview rate-limits room.

### 10.3 Stop-loss criterion

If any wave's Gate B fails (broken render on Vercel preview), pause the next wave and root-cause first. Don't queue 3 wave PRs and discover a systemic break only at Gate B of the third.

## 11. KPI / measurement plan

Baseline captured 2026-04-30 (already shipped):

- 30 random experiments sampled from production: 9/9 P0 in sample have FAQPage; 21/30 non-P0 are bare.
- Avg word count on 10 P0: ~1130; avg on remaining 169: ~280 (4× gap).

KPI targets at end of Phase 3:

- 179/179 experiments with `contentSections.faq.length >= 4`.
- 179/179 with `whatIsIt` ≥ 80 words.
- Avg word count across all 179: ≥ 1000.
- 100% FAQPage schema injection sampled across 30 random URLs.

KPI targets at +30 days post-Phase 3:

- GSC "Total clicks" for `site:scivra.com /labs/*` paths: ≥ 3× baseline.
- GSC indexed pages: ≥ 175 (close to full-catalog indexing).
- GSC rich-result-eligible FAQ pages: ≥ 150 (capped by Google's own selection of which FAQs they show).

KPI targets at +90 days:

- "Pages per organic session" on `/labs/*` ≥ 1.8 (signals reading depth, validates content quality vs. shell pages).
- Avg position in GSC for AP/NGSS standard-code keywords: top 30 (was ~80 at baseline).

Re-measurement cadence: GSC dashboards monthly; record snapshots in `docs/reports/2026-MM-DD-phase3-kpi-month-N.md`.

## 12. Risks & mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Writing fatigue degrades quality on later waves | High | Medium | Cap 25/day; alternate subjects (don't write 26 K-5 in one block) |
| Misconceptions get strawmanned without subject-matter review | Medium | Medium | Gate C 5/N review, plus optional `code-review-expert` review subagent |
| `parameterExplanations` keys silently mismatch param ids | Medium | Low (silently filtered, no crash) | Validation test §7.1 catches all mismatches |
| Vercel deploy preview rate-limit during back-to-back wave PRs | Low | Low | Stagger PRs ≥ 5 min apart; use `gh pr ready` to batch-promote drafts |
| User decides mid-Phase-3 to also localize, doubling scope | Low | High | Section 4 explicitly excludes; capture as an issue, defer to a Phase 4 |
| AI-generated boilerplate slips into commits | Medium | Medium | Reject any block where `whatIsIt` opens with "In this experiment", "Welcome to", or "This simulation"; manual scan in Gate C |
| Phase 3 PR queue collides with hotfixes | Medium | Medium | Wave PRs are content-only and rebase cleanly; if conflict, prefer the hotfix and rebase the wave |

## 13. Decision log

**D1 — Wave order chosen by SEO impact, not catalog order.** AP Physics 1 first because mechanics dominates US-K12 physics search volume; Math/General last because the audience is small and the content is more specialized.

**D2 — Validation test exists but doesn't gate on style.** Stylistic / educational quality stays a human judgment call (Gate C). Automation handles structural correctness (field presence, key alignment, length floors).

**D3 — One commit per wave, one PR per wave.** Phase 2 used multi-PR batches (5+5 split) and that was readable. Phase 3 with 9 waves → 9 commits → 9 PRs is clean: each PR's diff stays under ~6000 lines, easy to review, and the per-wave PR title carries the standard so future readers see "feat(content): fill AP Physics 1 contentSections (29 labs)".

**D4 — Codex stays out.** Per retrospective §4.4. Confirmed during Phase 2: codex `xhigh` reasoning stalls on multi-file reasoning content tasks; subject accuracy needs human eyes regardless.

**D5 — No new schema work in Phase 3.** Resist the temptation to add `EducationalLevel` or `LearningResource` `assesses` properties. Phase 3 is content; Phase 4 (separate plan) handles schema enrichment if KPIs justify.

**D6 — Subagents handle research + review + content drafting in parallel.** Original draft of this plan reserved subagents for "research and review only" per CLAUDE.md "子代理只做信息收集". **Revised 2026-04-30 by user override:** sonnet 4.6 subagents are now first-class content drafters too. The constraint that mattered was *codex is unfit for educational writing* (still true per retrospective §4.4 — codex stays out of writing). sonnet 4.6 in a subagent is the same model as in the main session and produces the same quality of educational prose. Parallel dispatch turns "1 wave/day sequential" into "2-3 waves/day concurrent" without trading off accuracy. Main session retains: orchestration, voice consistency review, sensitive-subject manual write, final polish.

**D7 — Vitest content validation gates each wave.** New test file added in Task 0; each wave Task adds its slugs to the manifest and runs the test. Failure blocks commit. Validation also gates: full `parameterExplanations` coverage, `whatIsIt` ≥ 100 words, total fill ≥ 800 words, FAQ strings free of `</script>` / `<!--` / U+2028 / U+2029.

**D8 — User override of /autoplan User Challenge (2026-04-30).** /autoplan multi-voice review (3 Claude subagents + 3 codex gpt-5.5 medium across CEO/Eng/DX phases) flagged a strategic User Challenge: both CEO voices independently recommended converting Phase 3 from full 169 backfill to a 2-week growth experiment (40 full / 40 schema-only / 40 internal-link / 49 control). User overrode after considering tradeoffs: (a) belief in LLM throughput at sprint cadence, (b) preference for shipping fast over measure-then-decide, (c) willingness to accept "wrote 186K words for the wrong reason" downside risk. **Decision:** proceed with full sprint, capture GSC baseline as a parallel deliverable (not a gate), and apply all P0/P1 plan fixes from the autoplan review. Full review at `docs/reports/2026-04-30-phase3-plan-autoplan-review.md`.

## 14. Success criteria

Phase 3 is complete when:

1. Vitest content validation green: `pnpm test tests/unit/content/experiment-content-sections.test.ts` reports 179/179 fills satisfying §7.1 assertions.
2. Production curl check across 30 random experiments: 30/30 show FAQPage schema and the three rendered sections.
3. Avg word count across the 179 contentSections ≥ 1000 (script: walk the data dir, sum word counts).
4. KPI baseline locked in `docs/reports/2026-04-30-phase3-baseline.md` (0 GSC clicks for non-P0 paths, etc., as the day-zero comparison).
5. All wave PRs merged to main; no rollback.
6. Retrospective documented in `docs/reports/<phase3-completion-date>-phase3-retrospective.md` capturing wave-by-wave time-to-write, common misconception themes that surfaced, and any patterns the validation test missed.

## 15. References

- `src/shared/types/experiment.ts:107-119` — `ExperimentContentSection` type contract.
- `src/shared/blocks/experiments/experiment-content-sections.tsx` — Rendering component.
- `src/shared/blocks/experiments/experiment-faq.tsx` — FAQ block + JSON-LD injection.
- `src/shared/lib/seo/json-ld.ts` — `buildFaqPageJsonLd` + `serializeJsonLd` helpers.
- `src/shared/lib/experiments/data/projectile-motion.ts:120-191` — Canonical reference fill.
- `docs/reports/2026-04-30-seo-remediation-retrospective.md` — Phase 1+2 retrospective.
- `docs/plans/2026-04-30-seo-remediation-execution-plan.md` — Original Phase 1+2 task plan.
- CLAUDE.md "Skill routing" — when to use `plan-eng-review` for plan reviews.
