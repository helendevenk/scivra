---
name: discipline-decoupling-cto-review
status: complete
created: 2026-03-22T09:44:44Z
updated: 2026-03-22T09:44:44Z
---

# CTO Review: Discipline Decoupling Implementation Spec

**Reviewed Document**: `2026-03-22-discipline-decoupling-implementation-spec.md`
**Reviewer**: CTO
**Verdict**: APPROVED WITH CHANGES
**Review Date**: 2026-03-22

## Overall Assessment

The spec is solid architecture work. The discipline abstraction layer is correctly designed -- pluggable configs, registry pattern, optional parameters with backward-compatible defaults. The decision to decouple in S1 while only shipping Physics is the right call: the cost is low (5 days claimed, more like 6-7 realistic) and it prevents a painful rewrite later.

That said, there are several inaccuracies against actual code, one architectural concern in the incremental generation design, and the time estimates need the same 30-40% haircut as the previous CTO review flagged.

## Section-by-Section Review

### 1.1 Discipline Config Type System (`types.ts`)

**Verdict**: Approved with Required Changes

The `DisciplineConfig` interface is well-designed. Separating `qualityRules` (blocking) from `validationRules` (scoring/labeling) is the correct split.

Required changes:

1. **`ValidationRule.validate` is declared synchronous but used with `await` in 2.1.1.** The dispatcher calls `rule.validate(html)` without await, but `runFullValidation` is declared `async`. Pick one: either make `validate` return `Promise<ValidationResult>` (future-proofing for rules that might need async, e.g., headless browser checks) or drop `async` from the dispatcher. **Recommendation**: Keep it synchronous for S1. Static regex checks don't need async. If S2 needs headless validation, add a separate `AsyncValidationRule` type.

2. **`commonTopics` type mismatch between strategy doc and impl spec.** The strategy doc (`multi-discipline-evolution-plan.md`) defines `commonTopics: string[]` while the impl spec defines `commonTopics: Array<{ en: string; zh: string; complexity: 'low' | 'medium' | 'high' }>`. The impl spec version is better, but this inconsistency should be resolved -- update the strategy doc to match.

3. **`cssGradient` naming.** The strategy doc uses `color: string` (oklch value), the impl spec uses `cssGradient: string` (CSS gradient). These serve different purposes. The config should have both: `themeColor` for programmatic use (badges, charts) and `cssGradient` for visual headers. Add `themeColor: string` to the interface.

### 1.2 Discipline Registry (`index.ts`)

**Verdict**: Approved

Clean registry pattern. The fallback-to-physics behavior is correct for backward compatibility. `isValidDiscipline()` is properly separated from `getDisciplineConfig()` so the API route can reject invalid input while the core pipeline can gracefully degrade.

One note: the re-export `export type { DisciplineConfig } from './types'` is fine but also export `DisciplineQualityRule` and `CdnLib` -- consumers will need them.

### 1.3 Physics Discipline Config (`physics.ts`)

**Verdict**: Approved with Notes

The content extraction from existing prompts is thorough. The `analyticalSolutions` table with valid ranges is a genuinely useful addition that will improve generation quality.

Notes:

- The `qualityRules` only have 2 rules, both at `severity: 'warning'`. This is correct for S1 -- don't add blocking rules that might break existing working generations. Keep it conservative.
- The `commonTopics` list of 15 topics is good. Consider adding `'Coulomb\'s Law'` and `'Faraday\'s Law'` to cover AP Physics 2 electromagnetic fundamentals that are currently missing.

### 1.4 Stub Files (chemistry, biology, math, earth-science)

**Verdict**: Approved

Stubs with `enabled: false` and `stage: 'S2'` are exactly right. The chemistry `systemPromptModule` content (CPK colors, bond types) shows someone actually thought about what chemistry vis needs rather than writing empty placeholders. Good.

### 1.5 System Prompt Refactoring (`system-prompt.ts`)

**Verdict**: Approved with Required Changes

This is the highest-risk section. The current `getSystemPrompt()` is a single function returning a massive string. Splitting it into `buildIdentityBlock()`, `buildOutputFormatBlock()`, etc. is the right decomposition.

Required changes:

1. **The spec references `THREEJS_CDN_URL` and `ORBIT_CONTROLS_CDN_URL` constants in `buildTechStackBlock`.** These don't exist in the current codebase. The CDN URLs are currently hardcoded inline in the system prompt string. The spec should explicitly state: "Extract CDN URLs from the current prompt string into named constants, import from `@/config/lib-versions.ts`." Verify that `lib-versions.ts` actually exports these specific URL strings (it exports `UPG_CDN_WHITELIST` but the individual URL constants may not exist).

2. **Function decomposition is described but not specified.** The spec says "buildIdentityBlock, buildOutputFormatBlock etc. = split the current getSystemPrompt() paragraphs into individual functions, content 100% unchanged." This is correct intent but during implementation the developer must diff the old and new prompt output character-by-character. **Add a verification step to the test plan**: snapshot the current `getSystemPrompt()` output, then after refactoring, assert the new output (with discipline='physics' or undefined) matches exactly. This is the single most important regression test.

3. **`getAutopilotDomPrompt()` position.** Currently it's injected at the end of the base prompt. In the new structure it appears between the visualization toolbox and the discipline layer. The spec should explicitly state this ordering is intentional and the autopilot DOM prompt is discipline-agnostic. If it's physics-specific, it should move into the physics config.

### 1.6 Generate Core Pipeline Changes (`generate-core.ts`)

**Verdict**: Approved with Required Changes

The "5 lines changed" claim is approximately correct, which is a sign of good architecture design.

Required changes:

1. **Code accuracy issue: `GenerateCoreParams.extraFields` type.** The spec shows `extraFields?: Record<string, unknown>` but the actual code has `extraFields?: Partial<NewUpgGeneration>`. Use the actual type. This matters because `category` is already a valid field on `NewUpgGeneration`, so if a caller passes `extraFields: { category: 'chemistry' }` it would conflict with the new explicit `discipline` parameter. **Add a note**: if both `discipline` and `extraFields.category` are provided, `discipline` wins (or better: strip `category` from `extraFields` before spread).

2. **Code accuracy issue: `model` parameter.** The spec shows `model?: string` in `GenerateCoreParams` but the actual interface has no `model` field. The model is selected inside `generateCore()` via `selectModel()`. The spec's version with an optional `model` override is actually better design (useful for A/B testing), but this should be flagged as a new addition, not presented as existing code.

3. **The route.ts has two code paths.** The spec only addresses `generate-core.ts`, but the actual `route.ts` (`/api/upg/generate`) has its OWN inline generation logic that duplicates `generate-core.ts`. Lines 104-146 of `route.ts` call `callOpenRouter`/`callAnthropic` directly, bypassing `generateCore()`. This is a pre-existing problem but the spec MUST acknowledge it: either (a) the route.ts migration to use `generateCore()` exclusively is a prerequisite for Phase 0.5, or (b) discipline must be threaded through both code paths. **This is the biggest code-accuracy miss in the spec.** The route.ts is the actual entry point for user-facing generation, and it does NOT use `generateCore()` -- it has its own parallel implementation.

### 1.7 Quality Checker Extension (`quality-checker.ts`)

**Verdict**: Approved

The 15-line addition approach is clean. Discipline-specific rules run after all base checks, and severity levels are respected. The existing 18 checks remain untouched.

One edge case: if `discipline` is undefined (backward compat path), the code correctly skips the discipline block since `getDisciplineConfig(undefined)` returns physics but the `if (discipline)` guard prevents running discipline rules when not explicitly requested. This is subtly correct -- existing callers that don't pass discipline won't get new warnings. Good.

### 1.8 API Route Changes (`route.ts`)

**Verdict**: Approved with Required Changes

Required changes:

1. **See 1.6 point 3 above.** The route.ts doesn't actually call `generateCore()`. The spec's code snippet `const result = await generateCore({...discipline...})` implies it does. This must be reconciled. **Recommendation**: Phase 0.5 should include migrating the route.ts to use `generateCore()` exclusively, eliminating the duplicate code path. This is ~1 day of additional work but critical for correctness.

2. **Auth function mismatch.** The spec's refine API (2.3.2) uses `getSignUser()` from `@/core/auth/auth-utils`, but the existing generate route uses `getUserInfo()` from `@/shared/models/user`. These are presumably different functions (one might include session validation). The spec should standardize on one. Check which one is correct for authenticated-only endpoints vs. optional-auth endpoints.

3. **Input validation.** The spec adds `isValidDiscipline(discipline)` check, which is correct. But the current route validates prompt length as `prompt.length < 2 || prompt.length > 500` (line 46). The spec should not change this, and it doesn't. Good.

### 1.9 Route Planning

**Verdict**: Approved (Route Option A)

Option A (keep existing routes, add discipline selector UI) is clearly correct for S1. Option B (dynamic routes) would be premature optimization. The spec's reasoning is sound.

One addition: document the Gallery `?category=` query parameter behavior. If a user creates a physics generation and it's published to gallery, the `category` field should be indexed and filterable. The spec mentions the index `idx_upg_generation_gallery` already covers this. Verified against schema: yes, the index is `on(isPublic, category, createdAt)`. Correct.

### 1.10 DisciplineSelector UI Component

**Verdict**: Approved with Notes

The component is straightforward. Notes:

- It calls `getAllDisciplines()` on every render. Since this is a static registry, it's cheap, but wrap it in `useMemo` or move it outside the component for cleanliness.
- The comment `{/* Lucide icon here */}` should be replaced with actual dynamic icon rendering. Use `lucide-react`'s dynamic import or a lookup map. Don't leave this as a TODO in the spec.
- The i18n is hardcoded to `d.name.en`. Should respect the current locale: `d.name[locale]` where locale comes from `useLocale()` or similar.

### 1.11 Database -- No Schema Changes

**Verdict**: Approved

Confirmed: `upgGeneration.category` exists as `text('category')` (nullable) at line 686 of `schema.ts`. The `idx_upg_generation_gallery` index covers `(isPublic, category, createdAt)`. No migration needed for Phase 0.5.

However, the spec claims `idx_upg_generation_category` already exists (line 735). **This is false.** There is no standalone category index. The gallery composite index covers category queries when filtered by isPublic, but a standalone `WHERE category = 'physics'` query (e.g., admin stats) won't use it efficiently. Not a blocker for S1 but document it as a known gap.

### 1.12 Phase 0.5 Task Breakdown

**Verdict**: Approved with Revised Estimates

| Task | Spec Estimate | CTO Estimate | Reason |
|------|--------------|-------------|--------|
| A1. Type system | 0.5d | 0.5d | Correct |
| A2. Physics config | 1d | 1.5d | Extracting from 400-line prompt needs careful diffing |
| A3. Registry | 0.25d | 0.25d | Correct |
| A4. Stubs x4 | 0.5d | 0.5d | Correct |
| A5. System Prompt split | 1d | 2d | **This is the riskiest task.** Splitting a 400+ line prompt string into functions without changing output is surgical work. Needs snapshot testing. |
| A6. generate-core | 0.25d | 0.5d | Must also fix route.ts dual-path issue |
| A7. quality-checker | 0.25d | 0.25d | Correct |
| A8. API route | 0.25d | 0.5d | Route.ts migration adds work |
| A9. UI selector | 0.5d | 0.5d | Correct |
| A10. Regression | 0.5d | 1d | Need thorough prompt snapshot tests |
| **Total** | **5d** | **7d** | **40% adjustment** |

### 1.13 Regression Test Plan

**Verdict**: Approved with Required Changes

The test matrix is good but missing the most critical test:

**Add**: Prompt output snapshot test. Capture the exact string output of `getSystemPrompt()` and `buildUserPrompt('Simple Pendulum', 'en')` before refactoring. After refactoring, assert identical output when discipline is undefined or 'physics'. This is not optional -- it's the primary regression gate.

**Add**: Test that `checkQuality(html)` (no discipline param) returns identical results to pre-refactoring for the same HTML input.

### 2.1 Physics Validation Layer (Phase 3.5, B1)

**Verdict**: Approved with Required Changes

The two-tier system (technical-validator for scoring + existing quality-checker for pass/fail) is correct. Don't merge them.

Required changes:

1. **The `runFullValidation` is declared `async` but nothing inside is async.** All checks are synchronous regex matches. Drop `async` for S1 to avoid unnecessary Promise wrapping in the hot path. This function runs on every generation.

2. **Weighting concern.** The overall score formula is `tech * 0.4 + discipline * 0.6`. For Physics in S1, the discipline validation rules are 5 regex-based checks. Giving them 60% weight over the 10-check technical validator feels inverted -- a generation can have perfect code quality but fail on "analytical overlay" (which the LLM might not include for every topic) and get a low score. **Recommendation**: Flip to `tech * 0.6 + discipline * 0.4` for S1, revisit when discipline rules become more sophisticated.

3. **False positive risk in `pv-physical-constants`.** The regex `(?:const|let|var)\s+g\s*=\s*([\d.]+)` will match any variable named `g`, not just gravitational acceleration. Consider a stricter pattern like `/(?:gravity|g)\s*=\s*([\d.]+)/` or check for nearby context words. In practice this will mostly work, but document it as a known limitation.

4. **The `pv-energy-conservation` rule is too naive.** Checking for the *string* `totalEnergy` in HTML doesn't validate actual conservation. The LLM might name it `E_total`, `totalE`, `energyTotal`, or use inline calculations. This rule will produce many false negatives (score 50 for "no energy system detected" when one exists with different naming). Acceptable for S1 as a starting point, but flag it for improvement.

### 2.2 Incremental Generation (Phase 3.5, B2)

**Verdict**: Approved with Required Changes

This is the most architecturally ambitious addition. The complexity analyzer is reasonable, and the <10% trigger rate claim is plausible.

Required changes:

1. **Token cost is severely underestimated.** Each incremental step sends the full system prompt (~4K tokens) plus the growing HTML (~8-15K tokens) as context. A 3-step generation means: Step 1 = ~20K input + ~12K output, Step 2 = ~20K + 12K input + ~15K output, Step 3 = ~20K + 15K input + ~15K output. Total: ~94K input + ~42K output vs. single-shot ~20K input + ~15K output. That's roughly **4x the token cost**, not "2-3x" as the spec claims. For Claude Sonnet at ~$3/M input + $15/M output, a single generation costs ~$0.28, but incremental costs ~$0.91. At 10% of requests, this increases average cost per generation by ~22%. **This must be explicitly acknowledged and approved as acceptable.**

2. **The `incrementalGenerate` function references `callLLM` which doesn't exist.** The actual functions are `callOpenRouter` and `callAnthropic`, with the choice determined at runtime based on `baseUrl` config. The incremental function needs the same routing logic. Extract the model-calling logic into a shared internal function first.

3. **Step 2-3 send the full HTML as a code block in the user prompt.** At 15K+ tokens of HTML, this consumes a massive portion of the context window. The system prompt alone is ~4K tokens. Total context for Step 3 could be 35-40K tokens input, dangerously close to limits for some models. **Add a size guard**: if the intermediate HTML exceeds a threshold (e.g., 12K tokens), abort incremental and fall back to single-shot retry.

4. **No token tracking in `incrementalGenerate`.** The spec's code returns only the final HTML, not the accumulated input/output tokens across steps. The caller needs these for the DB record. Return `{ html: string; totalInputTokens: number; totalOutputTokens: number }`.

5. **Error recovery is hand-waved.** "Return the last successful step's HTML" sounds good but a Step 1 HTML (no sliders, no formulas, no quiz) will fail the quality checker. The fallback path needs to either: (a) skip quality checks for partial results, or (b) mark the generation with a `partial` status. Neither is described. **Recommendation for S1**: If any step fails, fall back to a single-shot retry with the original prompt. Simpler and more predictable.

### 2.3 Conversational Refinement (Phase 3.5, B3)

**Verdict**: Approved with Required Changes

This is a high-value feature (reducing regeneration cost from 10 to 3 credits).

Required changes:

1. **Function naming mismatch.** `refine-core.ts` imports `getGeneration` and `createGeneration` from `@/shared/models/upg_generation`. These functions don't exist. The actual exports are `getGalleryDetail` (which returns a joined result, not raw generation) and `createUpgGeneration`. Either add a `getUpgGenerationById` function to the model file, or use the correct existing function. This needs to be specified.

2. **`consumeCredits` API mismatch.** The refine route calls `consumeCredits(user.id, UPG_CREDITS_PER_REFINEMENT, 'upg_refine', result.newGenerationId!)` with positional args, but the actual function signature is `consumeCredits({ userId, credits, scene, description, metadata? })` -- it takes a single options object. Fix the call site.

3. **DB fields `version`, `parentId`, `refinementPrompt` don't exist yet.** The spec correctly identifies these need to be added (section 2.3.3) but doesn't add them to the `NewUpgGeneration` type. The model's insert type is derived from the schema -- once the schema fields are added, they'll be available. But the implementation order matters: schema change + db:push before refine-core can work.

4. **Context window risk.** Sending the full original HTML (~15K tokens) plus system prompt (~4K tokens) in the refinement prompt uses ~19K input tokens minimum. For a 200KB HTML file (the max allowed), that's ~50K tokens of HTML alone. **Add a size guard**: if `original.htmlContent` exceeds 100KB, refuse refinement with a user-friendly message ("This visualization is too large to refine. Please regenerate instead.").

5. **Security gap.** The refinement prompt from the user is injected directly into the LLM prompt without passing through `moderateInput()`. An attacker could use refinement to inject malicious instructions that bypass the generation-time moderation. **Add input moderation to the refine flow.**

6. **Rate limiting and concurrency lock are missing.** The generate route has Redis distributed locks and rate limiting. The refine route has neither. A user could spam refinement requests. Apply the same lock pattern.

### 2.4 Analytical Solutions (Phase 3.5, B4)

**Verdict**: Approved with Notes

The approach of embedding analytical solutions in `physicsConfig.analyticalSolutions` and having the LLM use them is correct and low-risk.

Notes:

- The standalone `analytical-solutions.ts` module that just calls `getDisciplineConfig(discipline).analyticalSolutions` adds no value. It's a passthrough. Either give it a real purpose (e.g., dynamically selecting relevant solutions based on the prompt topic) or delete it and use the config directly. Don't create wrapper functions for the sake of file organization.

- The `require('../disciplines')` usage in the module is a red flag -- the rest of the codebase uses ES imports. Use a proper import.

### 2.5 Educational Positioning (Phase 3.5, B5)

**Verdict**: Approved

Low-risk copy changes. No technical concerns.

### 2.6 Phase 3.5 Task Breakdown

**Verdict**: Approved with Revised Estimates

| Task | Spec Estimate | CTO Estimate | Reason |
|------|--------------|-------------|--------|
| B1a. Validation framework | 1.5d | 1.5d | Correct |
| B1b. Physics validation rules | 1d | 1d | Correct |
| B1c. Pipeline integration + DB | 0.5d | 0.5d | Correct |
| B1d. UI Verified label | 0.5d | 1d | Gallery card + detail page + filter = more work than 0.5d |
| B2a. Complexity analyzer | 0.5d | 0.5d | Correct |
| B2b. Incremental generation | 1.5d | 2.5d | Token tracking + error recovery + callLLM abstraction |
| B2c. Test 5 complex topics | 0.5d | 1d | Each generation takes 1-3 min, debugging failures takes time |
| B3a. refine-core | 1.5d | 2d | Model function additions + moderation + lock |
| B3b. refine API | 0.5d | 1d | Rate limiting + proper error handling + auth |
| B3c. DB fields + UI | 1d | 1.5d | Version history UI is non-trivial |
| B3d. Test refinement | 0.5d | 0.5d | Correct |
| B4. Analytical solutions | 0.5d | 0.25d | Just config content, module is unnecessary |
| B5. Positioning update | 0.5d | 0.5d | Correct |
| **Total** | **10d** | **13d** | **30% adjustment** |

## Critical Issues (Must Fix Before Implementation)

1. **Route.ts dual code path.** The generate `route.ts` does NOT use `generateCore()`. It has its own inline implementation. Phase 0.5 must either: (a) migrate route.ts to use generateCore() exclusively (recommended, ~1d), or (b) thread discipline through both code paths. Without this, the discipline parameter in generateCore() is dead code for user-facing requests.

2. **Prompt snapshot test.** Add a mandatory test that captures the exact output of `getSystemPrompt()` before the refactoring and asserts identical output after. This is the highest-risk regression vector.

3. **Refine route missing moderation, rate limiting, and concurrency lock.** The generate route has all three. The refine route must have them too.

## Important Issues (Fix During Implementation)

4. **`runFullValidation` should be synchronous for S1.** Drop async, avoid unnecessary overhead.

5. **Validation weighting should be tech-heavy.** Flip to `tech * 0.6 + discipline * 0.4`.

6. **Function naming in refine-core.ts references nonexistent model functions.** `getGeneration` and `createGeneration` don't exist. Use `getGalleryDetail` or add a new `getUpgGenerationById` function.

7. **`consumeCredits` call in refine route uses wrong API.** Positional args vs. object arg.

8. **Incremental generation needs token tracking returned to caller.** Currently only returns HTML.

9. **`idx_upg_generation_category` standalone index doesn't exist.** Remove the false claim from the spec, or add the index.

10. **DisciplineSelector must respect i18n locale.** Use `d.name[locale]` not hardcoded `.en`.

## Suggestions (Nice to Have)

11. Consider adding `themeColor: string` (oklch value) alongside `cssGradient` for programmatic use in charts/badges.

12. The `analytical-solutions.ts` passthrough module is unnecessary. Delete it and use config directly.

13. Add `'Coulomb\'s Law'` and `'Faraday\'s Law'` to physics commonTopics for AP Physics 2 coverage.

14. For incremental generation, if any step fails, fall back to single-shot retry rather than returning partial HTML that will fail quality checks.

15. Add context window size guard for both incremental generation and refinement to prevent hitting model limits with large HTML payloads.

## Revised Total Estimates

| Phase | Spec Estimate | CTO Estimate |
|-------|--------------|-------------|
| Phase 0.5 (Discipline Decoupling) | 5 days | 7 days |
| Phase 3.5 (Paper Improvements) | 10 days | 13 days |
| **Total new work** | **15 days** | **20 days** |

The 33% adjustment is consistent with the previous CTO review finding of 30-50% optimism in estimates.

## Decision Record

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Route architecture (1.9) | Option A (keep routes, add UI selector) | Zero routing risk in S1, migrate to dynamic routes in S2 |
| Validation blocking | Non-blocking (score only) | Blocking on regex-based physics checks would cause false rejections |
| Incremental trigger threshold | score >= 5 (keep as spec) | Conservative enough to only trigger on genuinely complex prompts |
| Route.ts migration | Must do in Phase 0.5 | Dead code if discipline only flows through generateCore but route.ts bypasses it |
| Refine credits | 3 credits (keep as spec) | Good incentive: 30% of full generation cost, encourages iteration over regeneration |

## Approval

**Status**: APPROVED WITH CHANGES

The 3 critical issues must be resolved before implementation begins. The important issues should be addressed during implementation. The architecture is sound, the discipline abstraction is correctly designed, and the phased approach (S1 physics-only with stubs) is the right tradeoff between over-engineering and technical debt.

Proceed with implementation after addressing critical issues 1-3.
