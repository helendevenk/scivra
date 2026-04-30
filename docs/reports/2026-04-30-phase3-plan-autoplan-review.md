---
name: phase3-plan-autoplan-review
status: complete
created: 2026-04-30T06:30:00Z
updated: 2026-04-30T06:30:00Z
---

# Phase 3 Plans — /autoplan Multi-Voice Review

> **Reviewed:** `docs/plans/2026-04-30-phase3-experiment-content-strategy.md` + `docs/plans/2026-04-30-phase3-experiment-content-execution.md`
> **Reviewers:** 6 voices (3 Claude subagents + 3 Codex gpt-5.5 medium)
> **Phases run:** Phase 1 (CEO), Phase 3 (Eng), Phase 3.5 (DX). Phase 2 (Design) skipped — no UI scope.

## TL;DR — Verdict

**The plans should NOT ship as written.** Multi-voice consensus identifies 3 CRITICAL bugs that block Task 0 day 1, plus a strategic challenge that questions whether the 6-7 day 169-fill sprint is the right project shape at all.

Two paths forward, in priority order:

1. **Fix the bugs + accept the User Challenge** (both CEO voices recommend): convert plan from "full 6-7 day sprint" to "2-week growth experiment with tiered investment + GSC baseline + control cohort". This means rewriting strategy §10 + §11 and execution Task 0+10.

2. **Fix the bugs + override the User Challenge** (proceed as-is): the user has context the models lack (e.g., a deadline, a competitive window, an investor demo). If the user's original direction stands, the 5 P0 fixes below are still mandatory before Task 0.

The User Challenge is the dominant decision. Bug fixes are non-negotiable in either path.

## Consensus tables

### Phase 1 — CEO

```
                                           Claude  Codex   Consensus
1. Premises valid (N=10 → N=169)?           FAIL    FAIL    FAIL
2. Right problem to solve?                  CONCERN CONCERN CONCERN
3. Scope calibration (6-7 day sprint)?      FAIL    FAIL    FAIL
4. Alternatives sufficiently explored?      FAIL    FAIL    FAIL
5. Competitive risks (PhET/Khan/CK-12)?     CONCERN CONCERN CONCERN
6. 6-month regret scenario covered?         CONCERN CONCERN CONCERN
```

Both CEO voices independently produced the same recommendation: kill the full sprint, run a 2-week growth experiment instead. Convergence is high.

### Phase 3 — Eng

```
                                           Claude  Codex   Consensus
1. Architecture sound (test infra)?         CONCERN CRITICAL FAIL
2. Test coverage sufficient?                FAIL    HIGH     FAIL
3. Performance risks addressed?             PASS    MEDIUM   CONCERN
4. Security threats covered (XSS)?          CONCERN CRITICAL FAIL
5. Error paths handled (codex stall)?       CONCERN HIGH     FAIL
6. Deployment risk manageable?              CONCERN HIGH     FAIL
```

Both Eng voices flagged the same critical bugs (import / XSS / sandbox mismatch). Convergence is total.

### Phase 3.5 — DX

```
                                           Claude  Codex   Consensus
1. Time to first contribution ≤ 30 min?     CONCERN P0      FAIL
2. Model routing instructions clear?        PASS    P0      CONCERN
3. Validation error messages actionable?    CONCERN P1      CONCERN
4. Docs findable (line refs)?               CONCERN P2      CONCERN
5. Upgrade path safe?                       PASS    —       PASS
6. Dev environment friction-free?           FAIL    P0      FAIL
```

DX voices estimate cold-start time at 50-150 minutes (not 30). Same root causes flagged by both.

## P0 — Critical bugs (block Task 0 day 1)

These are not opinions. They will fail the build.

### P0-1: Test import is wrong (Eng voice both — CRITICAL)

`docs/plans/2026-04-30-phase3-experiment-content-execution.md:123` writes:
```ts
import { experiments } from "@/shared/lib/experiments/registry";
```

But `src/shared/lib/experiments/registry.ts:222` only declares `const experiments` as module-private. The exported API is `getAllExperiments()` (verified in registry.ts).

**Fix:** Replace the import with:
```ts
import { getAllExperiments } from "@/shared/lib/experiments/registry";
const experiments = getAllExperiments();
```

Or add `export { experiments }` to registry.ts as a Task 0 prerequisite (less preferred — expands public API).

### P0-2: XSS regression test missing (Eng voice both — CRITICAL)

`src/shared/blocks/experiments/experiment-faq.tsx` uses `dangerouslySetInnerHTML` to inject FAQ JSON-LD. Safety depends on `serializeJsonLd` escaping `</script>`, `<`, `>`, `&`, U+2028, U+2029. The plan never adds a regression test that catches a writer-typed `</script>` or U+2028 in a FAQ answer. One typo ships XSS.

**Fix:** Task 0 Step 3 must add an additional `it()` block:
```ts
it("FAQ strings contain no script-injection characters", () => {
  const forbidden = [/<\/script/i, /<!--/, /\]\]>/, /\u2028/, /\u2029/];
  for (const f of cs!.faq!) {
    for (const re of forbidden) {
      expect(re.test(f.question), `${exp.slug} FAQ question matches ${re}`).toBe(false);
      expect(re.test(f.answer), `${exp.slug} FAQ answer matches ${re}`).toBe(false);
    }
  }
});
```

### P0-3: Codex sandbox cannot write research output (Eng voice both — HIGH/critical for execution)

`docs/plans/2026-04-30-phase3-experiment-content-execution.md:286-317` (Task 1 Step 2) instructs codex to "Write the output to `_phase3-research/wave-1.md`" but the codex command uses `--sandbox read-only`. Read-only sandbox cannot create files. The step will silently lose its output.

**Fix:** Pipe stdout to file at the shell level:
```bash
codex exec --sandbox read-only ... "$PROMPT" | tee _phase3-research/wave-1.md
```

(Step 8 already uses `| tee` correctly — replicate that pattern in Step 2 across all 9 waves.)

## P1 — High-impact fixes (mandatory before sprint starts)

### P1-1: Remote name `deploy` hardcoded (DX voice both — HIGH)

Execution plan lines 56, 76, 239, 277, 521, 569, 602, 1055 hardcode `git push deploy ...`. Any executor with the standard `origin` remote fails every push.

**Fix:** Replace with `${REMOTE:-origin}` and document in pre-flight:
```bash
REMOTE="${REMOTE:-deploy}"
git remote get-url "$REMOTE" >/dev/null || REMOTE="origin"
git push -u "$REMOTE" feat/phase3-...
```

### P1-2: Strategy §6.2 rubric not self-contained in execution plan (DX voice both — HIGH)

Execution plan tells the writer to "Apply the rubric in §6 of the strategy doc" 9 times. A subagent dispatched on Task 5 in isolation has no rubric in context. Fields, FAQ standard binding, misconception non-strawman criteria all live in a different doc.

**Fix:** Inline a compressed rubric checklist (~30 lines) at the top of execution plan, OR repeat it verbatim inside each Wave task's Step 5. Self-contained tasks are non-negotiable for subagent-driven execution.

### P1-3: Validation gate weaker than rubric promises (DX voice both — HIGH)

Strategy §6.2 says "every parameter has an entry"; the test (`experiment-content-sections.test.ts`) only requires `parameterExplanations` to have ≥1 entry. Strategy says "whatIsIt 100-150 words"; the test floors at 80. Strategy targets avg ≥ 1000 words; the test never measures this until Task 10.

**Fix:** Tighten Task 0 test:
- `whatIsIt` floor → 100 words (not 80).
- `Object.keys(parameterExplanations).length === parameters.length` (every param explained).
- Per-fill total word count ≥ 800.
- Each Wave's Step 6 prints avg word count + below-800 list before moving on.

### P1-4: Codex review at 29 files × 8 dims will likely stall (CEO + Eng voices — HIGH)

The exact pattern (xhigh, multi-file reasoning) that stalled Phase 2 per retrospective §5.1. Plan claims §9.2 codex stays out of writing but Step 8 reviews 29 files at once.

**Fix:** Chunk codex review into 5-8 file batches, OR drop xhigh to medium for review (accept lower finding density), OR accept Gate C is human-only + run codex only as opt-in.

### P1-5: Manifest cross-wave collision (Eng + DX voices — HIGH)

All 9 waves modify `tests/unit/content/phase3-manifest.ts`. Two waves in flight simultaneously = guaranteed merge conflict. Plan says "sequential" but provides no enforcement.

**Fix:** Either split per-wave manifest files (`phase3-wave-1.ts` ... `phase3-wave-9.ts`) merged at test time, OR auto-derive the manifest from `getAllExperiments().filter(e => e.contentSections)` — eliminates the file entirely.

## P2 — Medium-impact fixes (recommended before sprint)

- **Gate B "3 random samples" is statistically weak** (Eng both). Wave 2 = 33 fills; missing a single broken slug has ~91% probability. Replace with 100% automated curl per wave (it's just N HEAD requests with HTML grep — script it).
- **`docs/reports/<DATE>-...` literal placeholders in Task 10** (DX both). Define `DATE=$(date -u +%F)` at the top of Task 10 and use `$DATE` everywhere.
- **Line-number references will rot** (DX both). `experiment-content-sections.tsx:46-47`, `projectile-motion.ts:120-191` etc. drift after main moves. Cite by symbol/section, treat line numbers as snapshot annotations.
- **Heredoc encoding risk** (DX codex). Math symbols (`∮`, `Δt`, `°`, `≥`) and em-dashes in inline codex prompts can mangle on copy-paste. Externalize prompts to `docs/plans/phase3-prompts/*.md`.
- **Codex CLI precheck missing** (DX both). Plan assumes `gpt-5.5` model alias and codex 0.125.0+ availability without verifying. Add Task 0 Step 0 precheck.

## User Challenge (from CEO consensus — both voices independently agree)

Both CEO voices recommend changing the user's stated direction.

**What the user said:** Backfill all 169 experiments to ~1100 words each in a 6-7 day sprint. Goal: long-tail SEO via content depth + FAQPage schema.

**What both models recommend:** Convert to a 2-week growth experiment with tiered investment:
- 40 experiments: full content fill (current proposal)
- 40 experiments: schema-only (FAQ + LearningResource + breadcrumbs, no 1100-word body)
- 40 experiments: internal-link / hub optimization only
- 49 experiments: control cohort (untouched)
- After 21-30 days, GSC measures uplift per group; full-fill on remaining 169 happens only if data justifies it.

**Why both models agree:**
1. Phase 2's 10 P0 fills shipped on 2026-04-30 with **zero outcome data measured yet**. Extrapolating the 4-5× word count lift to a 169-fill investment is faith, not evidence.
2. The strategic premise ("long-tail experiment URLs need 1100-word content to rank") is untested. Schema-only might capture 70% of the SEO win at 5-10% of the cost.
3. 186K original words in 6-7 days is professional-textbook-author pace; quality risk on the back half is high.
4. PhET / Khan / CK-12 already ship richer content per simulation. 1100 words gets parity, not moat — and Scivra has no defined competitive differentiation framework.
5. Page-investment uniformity (AP Physics 1 = K-5 generic) ignores query volume, SERP difficulty, and conversion intent variance.

**What we might be missing (acknowledged blind spots):**
- The user may have a hard deadline (e.g., school-year start, launch demo, investor milestone) that makes "ship 169 in 7 days" valuable regardless of marginal SEO ROI.
- The user may have already separately committed to this scope (e.g., contractor SOW, public roadmap).
- The user may know that GSC baseline is unrepresentative because the site is too new (registered 2026-03-24) and content volume is the gating signal for crawl budget allocation.

**If we're wrong, the cost is:** 169 untouched experiments stay thin for 4-6 more weeks while the experiment runs. Long-tail keywords don't index. Phase 3 ships on a longer timeline with stronger evidence — but possibly behind a competitor's parallel push.

**If we're right and you ship full sprint anyway, the cost is:** 186K words of original AP/NGSS content shipped, GSC indexes them, but ranking lift falls below 1.5× because thin pages weren't the actual bottleneck. Six months later, retrospective concludes "we wrote a textbook for the wrong reason."

⚠️ Both models flag this as a strategic blind spot, not just a preference. The user's call.

## Taste decisions (reasonable disagreement possible)

1. **Validation gate strictness — minimum word count.** Subagent says 800 floor; codex says 100 floor on whatIsIt. Recommendation: 800 total + 100 whatIsIt (covers both).

2. **Manifest structure.** Subagent recommends per-wave manifest files; codex recommends auto-derive from registry. Recommendation: auto-derive (eliminates the file + collision risk + manual upkeep). Engineering elegance over wave-isolation.

3. **Codex review batch size.** Codex recommends 5-8 files per batch with medium reasoning; subagent leans toward dropping codex review entirely for content. Recommendation: human Gate C + opt-in codex on suspicious wave (no batched audit on every wave).

4. **Per-wave PR cadence.** Plan ships 9 PRs in 7 days. Codex (CEO) suggests 1 wave/week to avoid crawl-budget spike. Subagent doesn't disagree. Recommendation: if proceeding with full-fill direction, slow to 2 waves/week (4-5 weeks) to give Google indexing budget room.

## Auto-decided (per /autoplan 6 principles)

- Inline rubric (P5 explicit > clever): apply.
- 100% Gate B curl over sampling (P1 completeness): apply.
- Auto-derive manifest (P3 pragmatic): apply (also resolves taste #2).
- Date placeholder fix (P5): apply.
- Line-ref → symbol-ref (P5): apply.
- Codex CLI precheck (P1 completeness): apply.

## Decision Audit Trail

| # | Phase | Decision | Type | Rationale |
|---|---|---|---|---|
| 1 | CEO | Surface User Challenge (full sprint vs growth experiment) | User Challenge | Both voices independently recommend; user has context |
| 2 | CEO | Add competitive differentiation framework requirement | Mechanical | Both voices flagged — non-negotiable add |
| 3 | CEO | Add GSC baseline capture as Task 0 prerequisite | Mechanical | Codex explicit recommendation, subagent strong concern |
| 4 | Eng | Fix import bug Task 0 Step 3 | Mechanical | Compilation failure |
| 5 | Eng | Add XSS regression test | Mechanical | Security boundary |
| 6 | Eng | Fix codex sandbox/redirect Task 1 Step 2 | Mechanical | Silent failure, must fix |
| 7 | Eng | Replace `deploy` with `${REMOTE:-origin}` | Mechanical | Pre-flight gate |
| 8 | Eng | Inline rubric in each task | Mechanical | Self-containment requirement |
| 9 | Eng | Tighten validation gate (100/full-param/800-min) | Mechanical | Closes rubric-vs-gate gap |
| 10 | Eng | Auto-derive manifest from registry | Taste → applied | P3 pragmatic; resolves multiple findings |
| 11 | Eng | Replace Gate B sampling with 100% curl | Taste → applied | P1 completeness |
| 12 | Eng | Chunk codex review or make opt-in | Mechanical | Stall risk per retrospective §5.1 |
| 13 | DX | Add codex CLI precheck | Mechanical | Pre-flight gate |
| 14 | DX | `DATE=$(date)` in Task 10 | Mechanical | Placeholder hygiene |
| 15 | DX | Externalize codex prompts to files | Taste → applied | Encoding reliability |

## Recommended next steps

**If accepting the User Challenge (recommended):**

1. Pause the current execution plan (do not start Task 0).
2. Rewrite strategy §10 (schedule) + §11 (KPIs) for the 2-week growth-experiment shape.
3. Add strategy §3.5 "Competitive differentiation framework" — per-wave: how does Scivra beat the top-3 SERP result for the target query?
4. Add execution Task -1: GSC baseline capture (clicks/impressions/indexed/avg-position per slug). Save to `docs/reports/2026-04-30-phase3-baseline-gsc.md`.
5. Rewrite execution Task 1-9 as cohort assignment (40+40+40 + control), not full-content waves.
6. Apply all P0 + P1 + P2 fixes regardless of direction.
7. Re-run /autoplan on the revised plan.

**If overriding the User Challenge (proceed with full sprint):**

1. Document the override rationale in strategy §13 D8: "User Challenge from /autoplan acknowledged; chosen to proceed because [deadline / contractual / strategic reason]."
2. Apply all P0 fixes (non-negotiable). Without these, Task 0 fails on day 1.
3. Apply all P1 fixes (manifest, gate strictness, codex CLI precheck, rubric inlining, remote-name).
4. Apply at least P2-1 (full Gate B), P2-3 (DATE placeholder), P2-5 (codex CLI precheck).
5. Plan to slow PR cadence to 2 waves/week even if writing-speed allows 1/day.

## Review artifacts

- Restore point: `~/.gstack/projects/scivra/chore-gsc-verification-autoplan-restore-20260430-141504.md` (the review reads-only, no plan mutation; restore not strictly needed)
- Codex CEO output: full text in conversation log, `tokens used: 46,381`
- Codex Eng output: `/tmp/codex-eng-out.log`
- Codex DX output: `/tmp/codex-dx-out.log`
- Claude subagent traces: 3 returned in conversation, IDs `af339b09011cabffe` (CEO), `a24cedf7647a005b8` (Eng), `ac3549ef87c834dc9` (DX)
- 6-voice consensus: 3/3 phases, 18 dimensions evaluated, 100% Codex availability, no stalls

## Open questions for the user

1. **User Challenge — accept or override?** Convert to 2-week growth experiment, or proceed with full 6-7 day sprint?
2. **GSC baseline capture today?** Either path needs it; ~30 min of work.
3. **Apply all P0 + P1 fixes now or after baseline measurement?** Recommend now (they're independent of direction).
4. **Re-run /autoplan after revisions?** Or treat this review as sufficient?
