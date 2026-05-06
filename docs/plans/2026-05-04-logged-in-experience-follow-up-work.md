# Logged-in Experience Follow-up Work Plan

Date: 2026-05-04
Owner: Scivra product/engineering
Status: Proposed
Related work:

- `docs/reports/2026-05-04-logged-in-experience-audit-and-remediation-plan.md`
- `docs/superpowers/plans/2026-05-04-logged-in-experience-remediation.md`
- Commit `14d7874 fix: remediate logged-in experience issues`

## 1. Background

The 2026-05-04 remediation pass fixed the most visible logged-in trust and layout regressions:

- AP Prep no longer presents itself as a complete AP exam product.
- UPG, Gallery, Dashboard, and Credits surfaces now use the public term `AI credits`.
- App-like logged-in pages now reserve space for the fixed landing header.
- Chat and Activity template residue was removed from the logged-in surface.
- Notebook creation now communicates draft intent.
- Gallery items now show language and validation status labels.

That pass intentionally avoided changes that could affect real billing, database state, external API contracts, or user-owned data. The remaining work should now focus on turning the logged-in surface from a set of patched modules into a coherent learning workflow.

## 2. Product Principles

Use these principles to make decisions during the next phase:

1. **Do not overpromise.** Public copy must match enabled capabilities, populated data, and current routes.
2. **One quota language.** User-facing paid/plan contexts should say `AI credits`, not `UPG credits`, `credits`, or `AI labs/month` alone.
3. **Logged-in workflows should be visible.** Dashboard, My Generations, Notebooks, and Learning Progress should not depend only on avatar-menu discovery.
4. **Empty states should teach one next action.** Every empty logged-in page needs one sentence explaining what will appear there and one clear CTA.
5. **Quality gates beat apology copy.** Gallery and UPG should avoid surfacing known bad outputs rather than merely labeling them.

## 3. Priority Roadmap

### P0: Pricing and Credits SSOT

Problem:

- Current UI copy now says Max includes `200 AI credits/month`.
- `src/config/locale/messages/en/pricing.json` still grants `2000` monthly credits and `24000` annual credits for Max.
- This field is used by checkout/order grant flow, so changing it is a real product entitlement change, not a copy tweak.

Goal:

- Define one source of truth for plan credits, credit costs, and public plan copy.

Required decisions:

- Is Max supposed to include `200` or `2000` AI credits/month?
- Should Pro include AI credits, or only Max?
- Should annual plans grant all credits upfront or monthly?
- Should `Fork` and `Refine` draw from the same monthly credit balance as Generate?

Implementation candidates:

- Keep `pricing.json` as the short-term SSOT and make all UI copy derive from those values.
- Or introduce a typed plan config module and make pricing, dashboard, checkout, and copy consume it.

Files likely affected:

- `src/config/locale/messages/en/pricing.json`
- `src/app/api/payment/checkout/route.ts`
- `src/shared/services/payment.ts`
- `src/shared/blocks/upg/UpgGenerator.tsx`
- `src/shared/blocks/gallery/gallery-detail.tsx`
- `src/config/locale/messages/en/upg.json`
- `src/config/locale/messages/en/gallery.json`
- `src/config/locale/messages/en/settings/credits.json`

Acceptance criteria:

- One verified table documents plan credits and UPG/Fork/Refine costs.
- Pricing page, UPG hero, generator button, Gallery actions, Dashboard, and Credits page all match.
- Checkout grants exactly the displayed plan entitlement.
- No active UI contains `UPG credits`.

Verification:

```bash
rg -n "UPG credits|AI labs/month|Credits Balance|Credits Records|Credits Remaining" src/config/locale/messages/en src/shared
pnpm lint
pnpm build
```

### P1: Logged-in Navigation IA

Problem:

- User-owned workflows are scattered across Dashboard, UPG My Generations, Notebooks, Learning Progress, Settings, and Activity.
- Discovery currently depends too much on avatar/user menus and route memory.

Goal:

- Make the logged-in experience feel like one learning workspace.

Recommended IA:

- Dashboard
- My AI Labs
- Notebooks
- Learning Progress
- Gallery
- Settings

Implementation direction:

- Add a logged-in app navigation surface for app-like landing pages.
- Keep public grade/lab navigation available, but separate it from user-owned workflow navigation.
- Avoid a full dashboard redesign until route ownership and copy are stable.

Files likely affected:

- `src/themes/default/blocks/header.tsx`
- `src/config/locale/messages/en/landing.json`
- `src/shared/blocks/dashboard/dashboard-client.tsx`
- `src/shared/blocks/common/sign-user.tsx` or related user menu component
- `src/app/[locale]/(landing)/dashboard/page.tsx`
- `src/app/[locale]/(landing)/(ai)/upg/my/page.tsx`
- `src/app/[locale]/(landing)/notebooks/page.tsx`
- `src/app/[locale]/(landing)/learn/page.tsx`

Acceptance criteria:

- A signed-in user can reach Dashboard, My AI Labs, Notebooks, and Learning Progress without opening the avatar menu.
- Mobile navigation exposes the same key destinations.
- Public navigation still works for anonymous users.
- No page header overlaps with content.

Verification:

```bash
pnpm lint
pnpm build
```

Browser checks:

- `/dashboard`
- `/upg/my`
- `/notebooks`
- `/learn`
- `/settings/profile`

### P1: Activity Page Productization

Problem:

- The Activity page previously came from generic AI template residue.
- It now says `AI Lab Activity`, but the underlying data model is still generic `ai_task`.
- UPG generation/refine/fork history is not clearly presented as a learning activity timeline.

Goal:

- Decide whether Activity is a real product surface or should be hidden.

Option A: Keep and productize

- Rename route/page concept to `AI Lab Activity`.
- Show UPG generation, fork, refine, publish, report, and failure events.
- Add links back to generated labs or Gallery items.
- Keep credit usage visible.

Option B: Hide/remove

- Remove Activity entry points from user navigation.
- Keep the admin AI task table for internal operations.

Recommended path:

- Use Option A only if UPG/Fork/Refine events can be shown accurately.
- Otherwise hide Activity from user navigation until the model catches up.

Files likely affected:

- `src/app/[locale]/(landing)/activity/ai-tasks/page.tsx`
- `src/config/locale/messages/en/activity/ai-tasks.json`
- `src/shared/models/ai_task.ts`
- `src/shared/models/upg_generation.ts`
- `src/app/api/upg/generate/route.ts`
- `src/app/api/upg/[id]/refine/route.ts`
- `src/app/api/gallery/[id]/fork/route.ts`

Acceptance criteria:

- Activity rows link to real user outputs when available.
- Empty state explains what will appear and sends users to `/upg`.
- No unsupported media categories appear on the user-facing page.

### P1: Notebook Draft Lifecycle

Problem:

- Notebook creation now communicates draft intent, but accidental draft cleanup is still missing.
- Users can create empty drafts and have no obvious archive/delete recovery path.

Goal:

- Make Notebook creation intentional and reversible.

Recommended scope:

- Add archive action for draft notebooks.
- Add delete action only for empty drafts, or require confirmation for any delete.
- Add an empty draft cleanup affordance.

Files likely affected:

- `src/shared/blocks/notebook/NotebookList.tsx`
- `src/shared/blocks/notebook/NotebookEditor.tsx`
- `src/app/api/notebooks/[id]/route.ts`
- `src/shared/models/lab_notebook.ts`
- `src/config/locale/messages/en/notebook.json`

Safety notes:

- Do not hard-delete user notebook data without explicit confirmation.
- Prefer archive as the first implementation.
- If delete is added, confirm the existing API behavior and whether versions/exports need cascading cleanup.

Acceptance criteria:

- Users can archive a draft notebook from the list.
- Users can recover or filter archived notebooks.
- Empty state and button copy remain clear.
- No accidental one-click destructive action exists.

Verification:

```bash
pnpm test tests/unit/models/lab_notebook.test.ts
pnpm lint
pnpm build
```

### P1: Gallery Quality Gate

Problem:

- Gallery now labels validation status, but low-quality or broken outputs can still be listed.
- The current label helps users interpret quality but does not prevent bad discovery experiences.

Goal:

- Avoid featuring broken, blank, failed, or low-confidence generated labs.

Recommended rules:

- Gallery list defaults to completed public generations only.
- Featured or high-visibility sections require `validationScore >= 70`.
- Detail pages can still open direct links to low-score items, but must clearly label them.
- Blank HTML or failed render previews should not appear in featured slots.

Files likely affected:

- `src/app/api/gallery/route.ts`
- `src/app/api/gallery/[id]/route.ts`
- `src/shared/blocks/gallery/gallery-list.tsx`
- `src/shared/blocks/gallery/gallery-card.tsx`
- `src/shared/blocks/gallery/gallery-detail.tsx`
- `src/shared/models/upg_generation.ts`

Acceptance criteria:

- Gallery default list does not promote failed or blank outputs.
- Users can filter verified-only results.
- Low-score direct detail pages are marked `Needs review`.
- Gallery empty state remains useful.

Verification:

```bash
pnpm test tests/unit/routes/gallery.test.ts
pnpm lint
pnpm build
```

Browser checks:

- `/gallery`
- `/gallery/[known-good-id]`
- `/gallery/[low-score-id]`

### P2: UPG Physics-only Boundary

Problem:

- Physics is the only enabled UPG discipline.
- Some copy still implies broad `any science topic` coverage.

Goal:

- Either make multi-discipline support real, or present UPG as physics-first until other disciplines are enabled.

Recommended short-term path:

- Update copy to `physics-first AI Lab builder`.
- Keep disabled disciplines visually unavailable with clear labels.
- Keep chemistry/biology/math configs as internal future config, not public promises.

Files likely affected:

- `src/config/locale/messages/en/upg.json`
- `src/shared/blocks/upg/upg-hero.tsx`
- `src/shared/blocks/upg/DisciplineSelector.tsx`
- `src/shared/lib/upg/disciplines/`
- `src/shared/lib/upg/system-prompt.ts`

Acceptance criteria:

- Public UPG copy no longer promises broad enabled coverage unless disciplines are enabled.
- Disabled disciplines cannot be mistaken for launched support.
- Physics presets are coherent and educational.

### P2: Empty State Pass

Problem:

- Several logged-in pages still use generic empty states or no next action.

Goal:

- Give every logged-in empty state one clear explanation and one next action.

Pages to audit:

- Billing
- Payments
- Activity
- Notebooks
- My Generations
- AP Progress
- Dashboard Recent Works
- Learning Progress

Acceptance criteria:

- Each empty state answers: what appears here, why it is empty, what to do next.
- Each empty state has one primary CTA.
- No empty state uses generic `No data` or `No tasks found`.

### P2: API Key and Security Trust Copy

Problem:

- API Key creation and Security pages need clearer trust copy.
- Reset password action should say what it actually does.

Goal:

- Reduce ambiguity around sensitive account/security actions.

Files likely affected:

- `src/app/[locale]/(landing)/settings/apikeys/create/page.tsx`
- `src/app/[locale]/(landing)/settings/apikeys/page.tsx`
- `src/app/[locale]/(landing)/settings/security/page.tsx`
- `src/config/locale/messages/en/settings/*.json`

Acceptance criteria:

- API key creation explains scope, visibility, revocation, rate limits, and safe storage.
- Reset password button says `Send reset email`.
- No security action uses generic `Save` when it sends a sensitive email or token.

## 4. Suggested Execution Order

1. **Credits SSOT decision and implementation**
   - This is the only item that may affect billing/entitlements.
   - Do it first so later copy and dashboards have a reliable base.

2. **Logged-in navigation IA**
   - Once credits are stable, make user-owned workflows visible.

3. **Activity product decision**
   - Either wire it to real UPG/Fork/Refine history or hide it.

4. **Notebook lifecycle**
   - Add archive/delete recovery for accidental drafts.

5. **Gallery quality gate**
   - Move from labels to actual filtering/ranking rules.

6. **UPG boundary and empty-state polish**
   - Finish the consistency layer after data/workflow behavior is stable.

## 5. Validation Plan

Minimum validation per work item:

```bash
pnpm lint
pnpm build
```

Run targeted tests when touching models/routes:

```bash
pnpm test tests/unit/routes/gallery.test.ts
pnpm test tests/unit/models/lab_notebook.test.ts
pnpm test tests/unit/routes/upg-generate.test.ts
```

Browser checks after UI changes:

- Desktop and mobile `/dashboard`
- Desktop and mobile `/upg`
- Desktop and mobile `/upg/my`
- Desktop and mobile `/notebooks`
- Desktop and mobile `/gallery`
- Desktop and mobile `/settings/security`

Recommended visual checks:

- Header does not overlap page title.
- Primary CTA is visible above the fold.
- Empty state text does not wrap awkwardly on mobile.
- Badges do not overflow cards.
- Tables remain usable on mobile or degrade gracefully.

## 6. Risk Register

| Risk                                              | Severity | Notes                                     | Mitigation                                               |
| ------------------------------------------------- | -------: | ----------------------------------------- | -------------------------------------------------------- |
| Pricing credit mismatch changes real entitlements |     High | `pricing.json` feeds checkout/order grant | Confirm product decision before edit                     |
| Activity page shows incomplete history            |   Medium | UPG may not map cleanly to `ai_task`      | Either wire true events or hide page                     |
| Notebook delete removes user work                 |     High | User-generated data                       | Prefer archive first; require confirmation               |
| Gallery filtering hides legitimate user outputs   |   Medium | Users may expect direct links to work     | Filter only discovery surfaces; keep direct detail route |
| UPG broad copy overpromises disabled disciplines  |   Medium | Only physics is enabled                   | Use physics-first language until launch                  |
| Main/remote divergence causes bad deploy path     |   Medium | Repo has `origin` and `deploy` remotes    | Standardize deploy remote and branch workflow            |

## 7. Open Questions

1. Should Max grant `200` or `2000` AI credits/month?
2. Should Pro include any AI credits?
3. Is Activity a user-facing product surface or internal/admin history?
4. Should Notebook delete be allowed, or only archive?
5. What validation score threshold should Gallery use for default discovery?
6. Should UPG remain physics-first publicly until chemistry/biology/math are enabled?
7. Which remote is the canonical GitHub deployment remote: `deploy` or `origin`?

## 8. Definition of Done for the Next Phase

The next phase is complete when:

- Pricing, checkout grants, UPG cost copy, dashboard, and credits pages agree.
- Logged-in users can find their key workflows without relying on avatar-menu discovery.
- Activity is either wired to real Scivra AI Lab history or hidden from user navigation.
- Notebook drafts can be archived or safely removed.
- Gallery discovery avoids known broken or low-quality outputs.
- UPG copy matches enabled discipline support.
- `pnpm lint` and `pnpm build` pass.
- Production deployment is verified with `vercel inspect` and `curl -I https://scivra.com`.
