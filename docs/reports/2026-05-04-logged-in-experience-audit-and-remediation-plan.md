# Logged-in Experience Audit and Remediation Plan

Date: 2026-05-04
Scope: logged-in Scivra production experience on `https://scivra.com`
Method: Computer Use walkthrough + code/Git attribution check in `/Users/smith/Desktop/scivra`

## Executive Summary

The logged-in product surface is broad, but it currently feels like several partially integrated modules rather than one learning workflow. The highest-risk issues are not all from the same source.

- AP Prep overpromising copy and the UPG 200-credit hero copy are from the 2026-04-25 UI/hero sweep (`7bf74e3`).
- Activity AI Tasks and Chat placeholder links are older template residue from the Next.js migration baseline (`c639aae`), not newly introduced by the latest refactor.
- Notebook one-click draft creation is from the Lab Notebook module (`ddc69b2`), not the latest hero/SEO refactor.
- Header/content overlap is a layout integration bug: the landing header is fixed, while several authenticated/utility pages do not consistently reserve top spacing. The latest UI sweep changed header/nav styling, but the deeper cause is the shared fixed-header layout being used by pages with app-like content.

I would treat this as a regression cluster around the recent public-site polish, plus older template debt that the deeper walkthrough finally exposed.

## Attribution Check

| Finding | Current Evidence | Likely Source | Confidence |
|---|---|---|---|
| AP Prep promises every AP Physics/Biology/Chemistry unit and real past-paper questions, but page says no exams available | `src/shared/blocks/ap-prep/ap-prep-hero.tsx` lines 24-55 blamed to `7bf74e3` | Recent UI/hero sweep | High |
| AP Prep empty state `No exams available yet.` | `src/shared/blocks/ap-prep/ap-exam-list.tsx` | Underlying AP Prep module has no exam content | High |
| UPG hero says `Max plan · 200 UPG credits / month` | `src/shared/blocks/upg/upg-hero.tsx` line 79 blamed to `7bf74e3` | Recent UI/hero sweep | High |
| Homepage says `20 AI labs per month` | `src/config/locale/messages/en/landing.json` line 217 blamed to `7bf74e3` | Recent UI/hero sweep | High |
| UPG generator uses account `credits.remainingCredits` and cost constants | `src/shared/blocks/upg/UpgGenerator.tsx`, older code from March | Older credit implementation | High |
| Activity shows Music/Image/Video/Audio/Text | `src/app/[locale]/(landing)/activity/ai-tasks/page.tsx` and `src/config/locale/messages/en/activity/ai-tasks.json`, blamed to `c639aae` | Older template residue | High |
| Chat footer links use `your-app-name` / `your-domain.com` | `src/config/locale/messages/en/ai/chat.json`, blamed to `c639aae` | Older template residue | High |
| Notebook `New Notebook` immediately creates `Untitled Notebook` | `src/shared/blocks/notebook/NotebookList.tsx` lines 42-52 blamed to `ddc69b2` | Notebook feature original behavior | High |
| Top nav overlaps page headings | Seen in Dashboard, Learning node, Notebook editor. Header is fixed in `src/themes/default/blocks/header.tsx`; pages lack consistent top offset | Layout integration bug, likely surfaced/worsened by recent polish | Medium |

## AP Prep Copy Fix

Current copy should not claim complete AP coverage until exams actually exist. Recommended direction: keep AP Prep discoverable, but label it as preview/beta and route users to existing labs/learning paths.

Replace hero copy with:

```text
Label:
AP Prep Preview · Physics-first practice

Headline:
Practice the concepts behind AP science.

Body:
Scivra is building AP-style practice that connects questions to interactive 3D labs. The first release focuses on physics concepts; full AP exam sets are not available yet.

Sample card label:
Concept practice preview · Mechanics

Sample card body:
Use an incline or motion lab to test the physics behind a typical AP-style prompt, then compare your reasoning step by step.

Trust note:
AP Prep is in preview. Coverage, question sets, and scoring feedback are expanding over time.
```

Remove for now:

- `Every AP Physics, Biology, and Chemistry unit`
- `real past-paper questions`
- `instant feedback`
- `Students using Scivra AP Prep average +0.8 letter grade`
- `College Board aligned`, unless every displayed item has a specific standards/source mapping.

If you want a more conversion-focused variant:

```text
AP Prep Preview
Build AP confidence with interactive science labs.
Start from the concept, open the matching 3D lab, and practice the reasoning behind AP-style questions. Full exam banks are still in development.
```

## Credits / Quota Unification

Recommended single public term: **AI credits**.

Reason: the database and user object already expose generic credits, and UPG/Fork/Refine all consume the same credit balance. Calling them UPG credits in one place and AI labs/month elsewhere creates a false impression that there are multiple quota systems.

Use this product model:

| Action | Cost |
|---|---:|
| Generate one AI Lab | 10 AI credits |
| Fork a Gallery lab | 5 AI credits |
| Refine a generated lab | 3 AI credits |

Suggested copy:

- UPG hero: `Max plan includes 200 AI credits/month · 10 credits per generated lab`
- UPG button: `Generate AI Lab (10 credits)`
- UPG balance: `AI credits remaining: 100`
- Gallery fork: `Fork (5 AI credits)`
- Gallery refine: `Refine (3 AI credits)`
- Dashboard card: `AI credits`
- Credits page: `AI Credits Balance`
- Pricing: `200 AI credits/month, enough for up to 20 generated AI labs`

Avoid:

- `UPG credits`
- `AI labs/month` without also showing credits
- `credits` alone in user-facing paid/plan contexts

This lets you preserve the current accounting model while making the value proposition clearer: Max = 200 AI credits = up to 20 generated AI labs if the user spends all credits on generation.

## Logged-in Experience Findings

### P0 / P1

1. Fix fixed-header overlap on authenticated landing pages.
   - Affects Dashboard, Learning node pages, Notebook editor.
   - Add a shared page shell or top offset for landing-layout pages that are not full hero pages.

2. Downgrade AP Prep from launched product to preview.
   - Current copy overclaims actual capability.
   - Hide or soften any claim about complete AP Biology/Chemistry coverage until data exists.

3. Clean Chat and Activity template residue.
   - Replace placeholder external links.
   - Rename Activity AI Tasks to Scivra-specific history, or remove from user menu until useful.

4. Unify AI credit language.
   - Update UPG, Gallery, Dashboard, Pricing, Credits, and homepage copy together.

### P2

5. Improve UPG presets.
   - Since only Physics is enabled, remove DNA/Molecular Orbital/Turbocharger from default Physics presets or tag them as cross-disciplinary previews.

6. Strengthen My Generations empty state.
   - Explain saved output, publishing, credit cost, and next action.

7. Gallery quality gate.
   - Add language/status labels.
   - Avoid featuring UPG outputs with blank/failed render previews.
   - Do not feature a lab CTA pointing to a known erroring lab route.

8. Notebook creation flow.
   - Change `New Notebook` to open a setup modal, or rename it to `Create Draft Notebook`.
   - Add delete/archive for accidental empty drafts.

9. API Key and Security trust copy.
   - API Key creation should explain scope, visibility, revocation, rate limits, and safe storage.
   - Reset password button should say `Send reset email`, not `Save`.

### P3

10. Logged-in nav IA.
    - Add visible logged-in entries for Dashboard, My Generations, Notebooks, and Learning Progress.
    - Keep public grade navigation, but do not make user-owned workflows depend only on the avatar menu.

11. Empty states.
    - Billing, Payments, Activity, Notebooks, My Generations, AP Progress should include one clear next action and one sentence explaining what will appear there.

## Execution Plan

### Phase 1: Trust and Regression Stopper

Files:

- `src/shared/blocks/ap-prep/ap-prep-hero.tsx`
- `src/shared/blocks/ap-prep/ap-exam-list.tsx`
- `src/shared/blocks/upg/upg-hero.tsx`
- `src/shared/blocks/upg/UpgGenerator.tsx`
- `src/config/locale/messages/en/landing.json`
- `src/config/locale/messages/en/upg.json`
- `src/shared/blocks/gallery/gallery-detail.tsx`

Work:

- Replace AP Prep copy with preview-safe copy.
- Remove unsupported grade/score claims.
- Standardize `AI credits` wording.
- Confirm pricing copy matches 200 AI credits/month and 10 credits/generation.

Verification:

- `pnpm lint`
- Browser check: `/`, `/upg`, `/pricing`, `/ap-prep`, `/gallery/{id}`

### Phase 2: Layout Stability

Files:

- `src/themes/default/layouts/landing.tsx`
- `src/themes/default/blocks/header.tsx`
- `src/app/[locale]/(landing)/dashboard/page.tsx`
- `src/app/[locale]/(landing)/learn/[slug]/nodes/[orderIndex]/page.tsx`
- `src/app/[locale]/(landing)/notebooks/[id]/page.tsx`
- Possibly a new shared shell component for landing app pages.

Work:

- Introduce a shared top-offset/page-shell for non-hero landing pages.
- Avoid patching each page with random `pt-*`; make one consistent layout rule.

Verification:

- Desktop and mobile screenshots for Dashboard, Learning node, Notebook editor, Settings.

### Phase 3: Remove Template Debt

Files:

- `src/config/locale/messages/en/ai/chat.json`
- `src/config/locale/messages/en/activity/ai-tasks.json`
- `src/app/[locale]/(landing)/activity/ai-tasks/page.tsx`
- Chat sidebar/footer block if needed.

Work:

- Replace placeholder links with Scivra links or remove icons.
- Rename Activity to Scivra-specific user history.
- If unused, hide Activity AI Tasks from avatar menu.

Verification:

- Browser check `/chat`, `/activity/ai-tasks`, avatar menu.

### Phase 4: Learning Workflow Quality

Files:

- `src/shared/blocks/learning-path/node-learning.tsx`
- `src/shared/blocks/learning-path/quiz-section.tsx`
- `src/shared/blocks/notebook/NotebookList.tsx`
- `src/shared/blocks/notebook/NotebookEditor.tsx`
- `src/shared/blocks/gallery/gallery-list.tsx`
- `src/shared/blocks/gallery/gallery-detail.tsx`

Work:

- Make experiment links human-readable with title, standard, and thumbnail/summary.
- Make Notebook creation intentional.
- Add Gallery render fallback and language/status display.

Verification:

- Browser check `/learn`, one path, one node, `/notebooks`, one notebook, `/gallery`.

## Recommended Immediate Patch Order

1. AP Prep copy downgrade.
2. AI credits copy unification.
3. Header/page-shell overlap fix.
4. Chat/Activity placeholder cleanup.
5. Notebook creation modal or safer wording.
6. Gallery render/language quality gate.

This order minimizes user-facing trust damage first, then fixes layout and workflow polish.
