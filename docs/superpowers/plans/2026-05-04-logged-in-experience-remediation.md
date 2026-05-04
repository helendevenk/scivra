# Logged-in Experience Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the logged-in experience trust, layout, and template-debt issues identified in `docs/reports/2026-05-04-logged-in-experience-audit-and-remediation-plan.md`.

**Architecture:** Keep this as a narrow UI/content remediation pass. Reuse existing landing layout, shadcn/ui components, next-intl message files, and existing UPG credit constants; do not change database schema, external APIs, or credit accounting behavior.

**Tech Stack:** Next.js App Router, TypeScript, React, next-intl, Tailwind CSS v4, shadcn/ui, pnpm.

---

## File Structure

- Modify `src/shared/blocks/ap-prep/ap-prep-hero.tsx` for preview-safe AP Prep hero copy.
- Modify `src/shared/blocks/ap-prep/ap-exam-list.tsx` for a clearer empty state.
- Modify `src/shared/blocks/upg/upg-hero.tsx`, `src/shared/blocks/upg/UpgGenerator.tsx`, `src/config/locale/messages/en/upg.json`, `src/config/locale/messages/en/landing.json`, `src/config/locale/messages/en/gallery.json`, and `src/config/locale/messages/en/user-dashboard.json` for AI credits language.
- Create `src/shared/components/layout/landing-app-shell.tsx` and wrap affected app-like pages in it.
- Modify `src/app/[locale]/(landing)/dashboard/page.tsx`, `src/app/[locale]/(landing)/learn/[slug]/nodes/[orderIndex]/page.tsx`, `src/app/[locale]/(landing)/notebooks/[id]/page.tsx`, `src/app/[locale]/(landing)/activity/ai-tasks/page.tsx`, and gallery pages/components where needed for consistent top spacing.
- Modify `src/config/locale/messages/en/ai/chat.json`, `src/config/locale/messages/en/activity/ai-tasks.json`, and `src/app/[locale]/(landing)/activity/ai-tasks/page.tsx` to remove generic template residue.
- Modify `src/shared/blocks/notebook/NotebookList.tsx` and `src/config/locale/messages/en/notebook.json` so notebook creation is explicitly a draft action.
- Modify `src/shared/blocks/gallery/gallery-card.tsx`, `src/shared/blocks/gallery/gallery-detail.tsx`, and `src/config/locale/messages/en/gallery.json` for language/status labels and render fallback copy.

## Task 1: AP Prep Trust Copy

**Files:**

- Modify: `src/shared/blocks/ap-prep/ap-prep-hero.tsx`
- Modify: `src/shared/blocks/ap-prep/ap-exam-list.tsx`

- [ ] **Step 1: Replace overclaiming AP Prep hero text**

Use preview-safe copy:

- label: `AP Prep Preview · Physics-first practice`
- headline: `Practice the concepts behind AP science.`
- body: `Scivra is building AP-style practice that connects questions to interactive 3D labs. The first release focuses on physics concepts; full AP exam sets are not available yet.`
- card label: `Concept practice preview · Mechanics`
- trust note: `AP Prep is in preview. Coverage, question sets, and scoring feedback are expanding over time.`

- [ ] **Step 2: Replace empty state**

Change `No exams available yet.` to a useful preview empty state with one next action linking to `/labs?grade=AP`.

- [ ] **Step 3: Verify unsupported AP claims are gone**

Run:

```bash
rg -n "Every AP Physics|past-paper|letter grade|College Board aligned|No exams available yet" src/shared/blocks/ap-prep
```

Expected: no matches.

## Task 2: AI Credits Language

**Files:**

- Modify: `src/shared/blocks/upg/upg-hero.tsx`
- Modify: `src/shared/blocks/upg/UpgGenerator.tsx`
- Modify: `src/config/locale/messages/en/upg.json`
- Modify: `src/config/locale/messages/en/landing.json`
- Modify: `src/config/locale/messages/en/gallery.json`
- Modify: `src/config/locale/messages/en/user-dashboard.json`
- Modify: `src/shared/blocks/gallery/gallery-detail.tsx`

- [ ] **Step 1: Replace public-facing quota copy**

Use `AI credits` consistently:

- UPG hero: `Max plan includes 200 AI credits/month · 10 credits per generated lab`
- Homepage fine print: `Max plan · 200 AI credits/month · up to 20 generated AI labs · student price $9.99`
- Generator button: `Generate AI Lab ({credits} credits)`
- Generator balance: `AI credits remaining: {credits}`
- Gallery fork: `Fork ({credits} AI credits)`
- Gallery refine: `Refine ({credits} AI credits)`
- Dashboard stat: `AI Credits`

- [ ] **Step 2: Remove biology/chemistry preset examples from the physics-only generator defaults**

Keep physics-first presets in `src/config/locale/messages/en/upg.json`, for example Doppler effect, double-slit interference, projectile motion, pendulum motion, black-hole lensing, and electric field lines.

- [ ] **Step 3: Verify old quota terms are gone from active UI**

Run:

```bash
rg -n "UPG credits|20 AI labs per month|Credits remaining:|Generate Visualization|Fork \\(\\{credits\\} credits\\)|Refine \\(\\{credits\\} credits\\)" src/shared/blocks src/config/locale/messages/en
```

Expected: no active UI matches.

## Task 3: Fixed Header Offset

**Files:**

- Create: `src/shared/components/layout/landing-app-shell.tsx`
- Modify: `src/app/[locale]/(landing)/dashboard/page.tsx`
- Modify: `src/app/[locale]/(landing)/learn/[slug]/nodes/[orderIndex]/page.tsx`
- Modify: `src/app/[locale]/(landing)/notebooks/[id]/page.tsx`
- Modify: `src/app/[locale]/(landing)/activity/ai-tasks/page.tsx`
- Modify: `src/shared/blocks/gallery/gallery-detail.tsx`
- Modify: `src/shared/blocks/gallery/gallery-list.tsx`

- [ ] **Step 1: Add shared shell**

Create a small wrapper component that reserves fixed-header space:

```tsx
import { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

export function LandingAppShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn('min-h-screen pt-20 md:pt-24', className)}>
      {children}
    </main>
  );
}
```

- [ ] **Step 2: Wrap app-like landing pages**

Use `LandingAppShell` around Dashboard, Learning node, Notebook editor, Activity, and Gallery list/detail content.

- [ ] **Step 3: Verify no duplicate top padding creates obvious layout bloat**

Run:

```bash
pnpm lint
```

Expected: lint passes or only unrelated pre-existing warnings are documented.

## Task 4: Chat and Activity Template Debt

**Files:**

- Modify: `src/config/locale/messages/en/ai/chat.json`
- Modify: `src/config/locale/messages/en/activity/ai-tasks.json`
- Modify: `src/app/[locale]/(landing)/activity/ai-tasks/page.tsx`

- [ ] **Step 1: Replace placeholder footer links**

Keep Home and Email. Use `https://github.com/scivra/scivra` for GitHub and `mailto:support@scivra.com` for Email. Remove Twitter and Discord placeholders.

- [ ] **Step 2: Rename Activity**

Rename `AI Tasks` to `AI Lab Activity`, keep only `All` and `AI Labs` tabs, and filter AI Labs using `type=text` if a filter is needed.

- [ ] **Step 3: Verify placeholders are gone**

Run:

```bash
rg -n "your-app-name|your-domain.com|Music|Image|Video|Audio|Text" src/config/locale/messages/en/ai src/config/locale/messages/en/activity src/app/'[locale]'/'(landing)'/activity
```

Expected: no matches.

## Task 5: Notebook Draft Intent

**Files:**

- Modify: `src/shared/blocks/notebook/NotebookList.tsx`
- Modify: `src/config/locale/messages/en/notebook.json`

- [ ] **Step 1: Rename creation action**

Change `New Notebook` to `Create Draft Notebook`.

- [ ] **Step 2: Make default draft title explicit**

Create notebooks with `Draft Lab Notebook` instead of `Untitled Notebook`.

- [ ] **Step 3: Improve empty state**

Explain that drafts can be edited, completed, and exported later.

## Task 6: Gallery Quality Labels

**Files:**

- Modify: `src/shared/blocks/gallery/gallery-card.tsx`
- Modify: `src/shared/blocks/gallery/gallery-detail.tsx`
- Modify: `src/config/locale/messages/en/gallery.json`

- [ ] **Step 1: Show language labels**

Display language as a small badge on cards and details.

- [ ] **Step 2: Show validation status**

Display `Verified` for score >= 70, `Needs review` for score below 70, and `Not checked` for null score.

- [ ] **Step 3: Add render fallback copy**

Add a short helper line above the iframe: `If this lab does not render, report it so we can review the generated HTML.`

## Task 7: Final Review, Push, Deploy

**Files:**

- All files changed in this plan.

- [ ] **Step 1: Run focused scans**

Run the `rg` verification commands from Tasks 1, 2, and 4.

- [ ] **Step 2: Run project validation**

Run:

```bash
pnpm lint
pnpm build
```

- [ ] **Step 3: Review diff**

Run:

```bash
git diff --check
git diff --stat
git diff
```

- [ ] **Step 4: Push and redeploy**

Because local `main` is diverged from `origin/main`, push the feature branch first. Only deploy production if credentials and project configuration are available locally and the final branch state has passed validation.
