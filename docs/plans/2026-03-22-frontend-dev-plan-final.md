---
name: frontend-dev-plan-final
status: historical-plan
snapshot_date: '2026-03-22'
created: '2026-03-22T15:11:04Z'
updated: '2026-04-23T00:00:00Z'
---

> **Historical document — not current SSOT.**
> This file is a point-in-time plan from 2026-03-22. It may describe goals, intermediate counts, or decisions that no longer match the current repository. Verify anything you rely on against `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`, or the source tree.

# NeonPhysics v2 — Frontend Development Plan (Final)

> Pivot: experiment-library-centric. UPG becomes a creation tool, not the homepage.
> Timeline: 13 weeks (Sprint 0-5). P0 + P1 ship together.
> This document is the single source of truth for execution.

## 1. Sprint Overview

| Sprint | Weeks | Days | Focus | Priority |
|--------|-------|------|-------|----------|
| S0 | 1 | 5 | Foundation: CSS migration, access model, redirects, data field additions | P0 |
| S1 | 2-3 | 10 | Navigation + Landing page redesign (7 sections) | P0 |
| S2 | 4-5 | 10 | Experiment browser + viewer + paywall gate | P0 |
| S3 | 6-7 | 10 | Dashboard + Gallery SEO + Learning paths refresh | P1 |
| S4 | 8-11 | 18 | AP Prep Mode (schema + API + frontend) | P1 |
| S5 | 12-13 | 10 | UPG repositioning to /create + polish + performance | P1 |

Total: **63 working days**, ~504 engineering hours.

## 2. Sprint 0: Foundation (Week 1, 5 days)

### 2.1 CSS Prefix Migration: `.edu-*` to `.np-*`

**Rationale**: Brand alignment. `.edu-*` is generic; `.np-*` is NeonPhysics-specific.

**File**: `src/config/style/theme-education.css`

Strategy: rename all `.edu-*` classes to `.np-*`, then add deprecated aliases that map old names to new ones. Remove aliases after 30 days.

```css
/* New canonical names */
.np-heading { ... }
.np-card { ... }
.np-badge { ... }

/* Deprecated aliases — remove after 2026-04-22 */
.edu-heading { @apply np-heading; }
.edu-card { @apply np-card; }
.edu-badge { @apply np-badge; }
```

Tasks:
- [ ] `src/config/style/theme-education.css` — rename all `.edu-*` to `.np-*`, add aliases (2h)
- [ ] Global find-replace `.edu-` to `.np-` in all `.tsx` files under `src/` (1h)
- [ ] Grep verify: `grep -r "edu-" src/ --include="*.tsx" --include="*.css"` should return only alias definitions (0.5h)
- [ ] Rename file: `theme-education.css` stays (it describes the design direction, not the prefix)

Files to MODIFY:
- `src/config/style/theme-education.css`
- Every `.tsx` file referencing `edu-*` classes (estimate 15-20 files)

### 2.2 Subject Color System via `data-subject`

Add CSS custom properties per subject, activated by a `data-subject` attribute on container elements.

**File**: `src/config/style/theme-education.css` (append)

```css
/* Subject color system */
[data-subject="physics"] {
  --np-subject: oklch(0.50 0.20 250);      /* Academic Blue */
  --np-subject-light: oklch(0.92 0.04 250);
}
[data-subject="chemistry"] {
  --np-subject: oklch(0.55 0.18 145);      /* Green */
  --np-subject-light: oklch(0.92 0.04 145);
}
[data-subject="biology"] {
  --np-subject: oklch(0.55 0.16 30);       /* Warm Orange */
  --np-subject-light: oklch(0.92 0.04 30);
}
[data-subject="earth-science"] {
  --np-subject: oklch(0.50 0.14 180);      /* Teal */
  --np-subject-light: oklch(0.92 0.04 180);
}
[data-subject="math"] {
  --np-subject: oklch(0.50 0.18 300);      /* Purple */
  --np-subject-light: oklch(0.92 0.04 300);
}
```

Dark mode variants inside `.dark [data-subject="..."]` with adjusted lightness.

Tasks:
- [ ] Add subject color definitions to `src/config/style/theme-education.css` (1h)
- [ ] Create `src/shared/lib/experiments/subjects.ts` — subject metadata + color map constant (0.5h)

**New file** `src/shared/lib/experiments/subjects.ts`:
```typescript
export const SUBJECTS = {
  physics: { label: "Physics", dataAttr: "physics" },
  chemistry: { label: "Chemistry", dataAttr: "chemistry" },
  biology: { label: "Biology", dataAttr: "biology" },
  "earth-science": { label: "Earth Science", dataAttr: "earth-science" },
  math: { label: "Math", dataAttr: "math" },
} as const;

export type Subject = keyof typeof SUBJECTS;
```

### 2.3 Experiment Type: Add `subject` and `gradeLevel` Fields

**File**: `src/shared/types/experiment.ts`

Add two fields to the `Experiment` interface:

```typescript
export type Subject = "physics" | "chemistry" | "biology" | "earth-science" | "math";
export type GradeLevel = "K-2" | "3-5" | "6-8" | "9-12" | "AP";

export interface Experiment {
  // ... existing fields ...
  subject: Subject;        // NEW
  gradeLevel: GradeLevel;  // NEW
}
```

**Script to add fields to all 64 data files**: Create `scripts/add-experiment-fields.ts`

The script infers `subject` from existing `category`:
- `mechanics | waves | electricity | modern | thermodynamics` -> `"physics"`
- `biology` -> `"biology"`
- `chemistry` -> `"chemistry"`
- `earth` -> `"earth-science"`

It infers `gradeLevel` from file prefix:
- `k5-*` -> `"K-2"` or `"3-5"` (check individual files)
- `ms-*` -> `"6-8"`
- Default -> `"9-12"` (AP experiments get `"AP"` if category in AP waves)

Tasks:
- [ ] Update `src/shared/types/experiment.ts` — add `Subject`, `GradeLevel`, update `Experiment` interface (0.5h)
- [ ] Write `scripts/add-experiment-fields.ts` — automated field insertion (2h)
- [ ] Run script, manually verify 5 random files (1h)
- [ ] Update `src/shared/lib/experiments/registry.ts` — add `getExperimentsBySubject()`, `getExperimentsByGradeLevel()` (0.5h)

Files to MODIFY:
- `src/shared/types/experiment.ts`
- All 64 files in `src/shared/lib/experiments/data/*.ts`
- `src/shared/lib/experiments/registry.ts`

Files to CREATE:
- `scripts/add-experiment-fields.ts`

### 2.4 Experiment Access Model: Lifetime 3-Experiment Limit

**CRITICAL CHANGE**: From daily quota ("4 experiments per day") to lifetime limit ("3 experiments TOTAL per account, then subscribe").

#### 2.4.1 New Database Table: `experimentAccess`

**File**: `src/config/db/schema.ts` (append)

```typescript
export const experimentAccess = pgTable(
  'experiment_access',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    experimentId: text('experiment_id').notNull(),
    firstAccessedAt: timestamp('first_accessed_at').defaultNow().notNull(),
  },
  (table) => [
    unique('uq_experiment_access_user_experiment').on(
      table.userId,
      table.experimentId
    ),
    index('idx_experiment_access_user').on(table.userId),
  ]
);
```

This table records which experiments a user has accessed. When `COUNT(*) WHERE userId = ?` reaches 3, the paywall activates.

#### 2.4.2 New Model

**File to CREATE**: `src/shared/models/experiment_access.ts`

```typescript
import { eq, and, count } from 'drizzle-orm';
import { db } from '@/core/db';
import { experimentAccess } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/utils';

const FREE_EXPERIMENT_LIMIT = 3;

export async function getAccessedExperimentCount(userId: string): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(experimentAccess)
    .where(eq(experimentAccess.userId, userId));
  return result[0]?.count ?? 0;
}

export async function hasAccessedExperiment(
  userId: string,
  experimentId: string
): Promise<boolean> {
  const result = await db
    .select({ id: experimentAccess.id })
    .from(experimentAccess)
    .where(
      and(
        eq(experimentAccess.userId, userId),
        eq(experimentAccess.experimentId, experimentId)
      )
    )
    .limit(1);
  return result.length > 0;
}

export async function recordExperimentAccess(
  userId: string,
  experimentId: string
): Promise<{ allowed: boolean; remaining: number }> {
  const alreadyAccessed = await hasAccessedExperiment(userId, experimentId);
  if (alreadyAccessed) {
    const total = await getAccessedExperimentCount(userId);
    return { allowed: true, remaining: Math.max(0, FREE_EXPERIMENT_LIMIT - total) };
  }

  const total = await getAccessedExperimentCount(userId);
  if (total >= FREE_EXPERIMENT_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  await db.insert(experimentAccess).values({
    id: getUuid(),
    userId,
    experimentId,
  });

  return { allowed: true, remaining: FREE_EXPERIMENT_LIMIT - total - 1 };
}

export async function getAccessedExperimentIds(userId: string): Promise<string[]> {
  const rows = await db
    .select({ experimentId: experimentAccess.experimentId })
    .from(experimentAccess)
    .where(eq(experimentAccess.userId, userId));
  return rows.map((r) => r.experimentId);
}
```

#### 2.4.3 Update Access Logic

**File**: `src/shared/lib/experiments/access.ts`

Replace the tier-based gating with the new lifetime-limit model:

```typescript
import type { Tier } from "@/shared/types/experiment";

const TIER_LEVELS: Record<Tier, number> = {
  free: 0,
  pro: 1,
  max: 2,
};

/** Permanently free experiments — always accessible regardless of subscription */
export const FREE_EXPERIMENT_IDS = new Set([
  "newtons-laws",
  "projectile-motion",
  "simple-harmonic-motion",
]);

/** Max experiments a free-tier user can access in their lifetime */
export const FREE_EXPERIMENT_LIMIT = 3;

/** Check if user can access a specific experiment (sync — for SSG/display logic) */
export function canAccessExperiment(
  experimentId: string,
  userTier: Tier,
  accessedCount: number,
  alreadyAccessedThisExperiment: boolean
): boolean {
  if (FREE_EXPERIMENT_IDS.has(experimentId)) return true;
  if (TIER_LEVELS[userTier] >= TIER_LEVELS["pro"]) return true;
  // Free tier: already accessed this one? OK. Otherwise, check limit.
  if (alreadyAccessedThisExperiment) return true;
  return accessedCount < FREE_EXPERIMENT_LIMIT;
}

export function canAccessTier(userTier: Tier, requiredTier: Tier): boolean {
  return TIER_LEVELS[userTier] >= TIER_LEVELS[requiredTier];
}

export function subscriptionToTier(planName: string | null): Tier {
  if (!planName) return "free";
  const lower = planName.toLowerCase();
  if (lower.includes("max") || lower.includes("enterprise")) return "max";
  if (lower.includes("pro") || lower.includes("premium")) return "pro";
  return "free";
}
```

#### 2.4.4 Update Experiment Page Server Component

**File**: `src/app/[locale]/(landing)/experiments/[slug]/page.tsx`

The server component now fetches the user's accessed experiment count and passes it to the client:

```typescript
// After getting userTier...
let accessedCount = 0;
let alreadyAccessed = false;
if (user?.id) {
  accessedCount = await getAccessedExperimentCount(user.id);
  alreadyAccessed = await hasAccessedExperiment(user.id, experiment.id);
}
const canAccess = canAccessExperiment(experiment.id, userTier, accessedCount, alreadyAccessed);
// Pass accessedCount, alreadyAccessed, and FREE_EXPERIMENT_LIMIT to client
```

#### 2.4.5 New API Endpoint

**File to CREATE**: `src/app/api/experiments/access/route.ts`

POST: Records an experiment access event. Returns `{ allowed, remaining }`.
GET: Returns `{ accessedCount, accessedIds, limit }` for the current user.

Tasks:
- [ ] Add `experimentAccess` table to `src/config/db/schema.ts` (0.5h)
- [ ] Create `src/shared/models/experiment_access.ts` (1h)
- [ ] Update `src/shared/lib/experiments/access.ts` — new signature with count params (1h)
- [ ] Update `src/app/[locale]/(landing)/experiments/[slug]/page.tsx` — pass new params (0.5h)
- [ ] Update `src/app/[locale]/(landing)/experiments/[slug]/ExperimentClient.tsx` — consume new props (1h)
- [ ] Create `src/app/api/experiments/access/route.ts` (1h)
- [ ] Update `src/shared/blocks/experiments/PaywallGate.tsx` — show remaining count, new copy (1h)
- [ ] Run `pnpm db:generate && pnpm db:push` (0.25h)
- [ ] Write unit tests for `experiment_access.ts` model (1h)

Files to MODIFY:
- `src/config/db/schema.ts`
- `src/shared/lib/experiments/access.ts`
- `src/app/[locale]/(landing)/experiments/[slug]/page.tsx`
- `src/app/[locale]/(landing)/experiments/[slug]/ExperimentClient.tsx`
- `src/shared/blocks/experiments/PaywallGate.tsx`

Files to CREATE:
- `src/shared/models/experiment_access.ts`
- `src/app/api/experiments/access/route.ts`

### 2.5 301 Redirects for Old UPG Routes

**File to CREATE**: `src/middleware.ts` (or append to existing)

Redirects:
| Old Route | New Route | Status |
|-----------|-----------|--------|
| `/upg` | `/create` | 301 |
| `/upg/generate` | `/create` | 301 |
| `/upg/[id]` | `/create/[id]` | 301 |
| `/upg/my` | `/dashboard?tab=creations` | 301 |

Also configure in `next.config.mjs`:

```javascript
async redirects() {
  return [
    { source: '/upg', destination: '/create', permanent: true },
    { source: '/:locale/upg', destination: '/:locale/create', permanent: true },
    { source: '/upg/generate', destination: '/create', permanent: true },
    { source: '/:locale/upg/generate', destination: '/:locale/create', permanent: true },
    { source: '/upg/:id', destination: '/create/:id', permanent: true },
    { source: '/:locale/upg/:id', destination: '/:locale/create/:id', permanent: true },
    { source: '/upg/my', destination: '/dashboard?tab=creations', permanent: true },
    { source: '/:locale/upg/my', destination: '/:locale/dashboard?tab=creations', permanent: true },
  ];
},
```

Tasks:
- [ ] Add redirects to `next.config.mjs` (0.5h)
- [ ] Verify with `curl -I localhost:3000/upg` returns 301 (0.25h)

Files to MODIFY:
- `next.config.mjs`

### 2.6 Layout Groups Restructure

Current: Everything under `(landing)`.
Target: Split into 4 layout groups.

| Group | Routes | Layout behavior |
|-------|--------|----------------|
| `(landing)` | `/`, `/experiments`, `/experiments/[slug]`, `/gallery`, `/pricing`, `/blog` | Public header + footer |
| `(learn)` | `/quests`, `/paths`, `/notebooks`, `/learn/[slug]` | Sidebar + progress bar |
| `(create)` | `/create`, `/create/[id]` | Minimal chrome, full-width canvas |
| `(dashboard)` | `/dashboard`, `/settings` | User panel sidebar |

For S0, only create the directory structure and move `layout.tsx` files. Actual page content moves in later sprints.

Tasks:
- [ ] Create `src/app/[locale]/(learn)/layout.tsx` (0.5h)
- [ ] Create `src/app/[locale]/(create)/layout.tsx` (0.5h)
- [ ] Move `src/app/[locale]/(landing)/dashboard/` to `src/app/[locale]/(dashboard)/dashboard/` (0.5h)
- [ ] Move `src/app/[locale]/(landing)/settings/` to `src/app/[locale]/(dashboard)/settings/` (0.5h)
- [ ] Create `src/app/[locale]/(dashboard)/layout.tsx` (0.5h)
- [ ] Verify no broken imports after moves (0.5h)

Files to CREATE:
- `src/app/[locale]/(learn)/layout.tsx`
- `src/app/[locale]/(create)/layout.tsx`
- `src/app/[locale]/(dashboard)/layout.tsx`

Files to MOVE:
- `src/app/[locale]/(landing)/dashboard/` -> `src/app/[locale]/(dashboard)/dashboard/`
- `src/app/[locale]/(landing)/settings/` -> `src/app/[locale]/(dashboard)/settings/`

### Sprint 0 Definition of Done

- [ ] All `.edu-*` classes renamed to `.np-*` with working aliases
- [ ] `data-subject` CSS system renders correct colors for all 5 subjects
- [ ] All 64 experiment data files have `subject` and `gradeLevel` fields
- [ ] `experimentAccess` table exists and model tests pass
- [ ] `canAccessExperiment()` uses new 3-experiment lifetime logic
- [ ] 301 redirects return correct status codes
- [ ] Layout group directories created, dashboard/settings moved
- [ ] `pnpm build` passes with zero errors
- [ ] `pnpm test` passes

**Estimated total: ~20 hours**

## 3. Sprint 1: Navigation + Landing (Week 2-3, 10 days)

### 3.1 New Header with Dropdown Navigation

**File**: `src/themes/default/blocks/header.tsx` (MODIFY — full rewrite of nav items)

Navigation structure (4 top-level items):

```
Experiments ▾          Learn ▾              Create         Pricing
├─ Browse All          ├─ Learning Paths    (link to       (link to
├─ By Subject          ├─ AP Prep           /create)       /pricing)
│  ├─ Physics          ├─ Quests
│  ├─ Chemistry        └─ Notebooks
│  ├─ Biology
│  ├─ Earth Science
│  └─ Math
├─ By Grade Level
│  ├─ Elementary (K-5)
│  ├─ Middle School (6-8)
│  ├─ High School (9-12)
│  └─ AP Level
└─ Gallery
```

Tasks:
- [ ] Redesign header nav data structure in `src/config/locale/messages/en/landing.json` (1h)
- [ ] Update `src/config/locale/messages/zh/landing.json` with Chinese translations (0.5h)
- [ ] Rewrite dropdown content in `src/themes/default/blocks/header.tsx` — use `NavigationMenuContent` with multi-column layout (4h)
- [ ] Add subject icons (lucide: `Atom`, `FlaskConical`, `Dna`, `Globe`, `Calculator`) (0.5h)

Files to MODIFY:
- `src/themes/default/blocks/header.tsx`
- `src/config/locale/messages/en/landing.json`
- `src/config/locale/messages/zh/landing.json`

### 3.2 Mobile Bottom Tab Bar

**File to CREATE**: `src/shared/blocks/common/MobileTabBar.tsx`

Fixed bottom bar on mobile (`md:hidden`). 4 tabs: Experiments, Learn, Create, Profile.

```typescript
// Icons: FlaskConical, GraduationCap, Sparkles, User
// Active state: subject color or primary
// Badge on Profile for notification count
```

Tasks:
- [ ] Create `src/shared/blocks/common/MobileTabBar.tsx` (2h)
- [ ] Add to `src/app/[locale]/(landing)/layout.tsx` (0.5h)
- [ ] Add i18n keys to `en/common.json` and `zh/common.json` (0.5h)

Files to CREATE:
- `src/shared/blocks/common/MobileTabBar.tsx`

Files to MODIFY:
- `src/app/[locale]/(landing)/layout.tsx`
- `src/config/locale/messages/en/common.json`
- `src/config/locale/messages/zh/common.json`

### 3.3 Landing Page Redesign (7 Sections)

Current landing page uses template blocks from `src/themes/default/blocks/`. The redesign keeps the block architecture but replaces content and adds new sections.

**7 Sections (top to bottom):**

1. **Hero** — "Science comes alive" headline, experiment preview animation, CTA: "Explore Experiments" + "Try Creating"
2. **Featured Experiments** — 6-card carousel, subject-colored borders, filterable tabs
3. **Subject Browser** — 5 subject cards with icons and experiment counts
4. **How It Works** — 3 steps: Browse -> Interact -> Learn (or Create with UPG)
5. **Social Proof / Stats** — "64+ experiments, 5 subjects, K-12 to AP"
6. **Pricing** — 3 tiers: Free (3 experiments), Pro ($4.99/mo), Max ($9.99/mo)
7. **CTA** — Final call-to-action with sign-up

**Files to CREATE:**
- `src/themes/default/blocks/featured-experiments.tsx` — Featured experiment carousel
- `src/themes/default/blocks/subject-browser.tsx` — Subject cards grid

**Files to MODIFY:**
- `src/themes/default/blocks/hero.tsx` — New headline, experiment preview
- `src/themes/default/blocks/features-step.tsx` — "How it works" content
- `src/themes/default/blocks/stats.tsx` — Updated numbers
- `src/themes/default/blocks/pricing.tsx` — New tier definitions
- `src/themes/default/blocks/cta.tsx` — New copy
- `src/themes/default/blocks/index.tsx` — Register new blocks

**i18n keys to add** (both `en/landing.json` and `zh/landing.json`):
- `hero.title`, `hero.subtitle`, `hero.cta_primary`, `hero.cta_secondary`
- `featured_experiments.title`, `featured_experiments.subtitle`
- `subject_browser.title`, `subject_browser.subtitle`
- `subject_browser.physics`, `.chemistry`, `.biology`, `.earth_science`, `.math`
- `how_it_works.title`, `.step1_*`, `.step2_*`, `.step3_*`
- `stats.experiments_count`, `.subjects_count`, `.grade_range`

Tasks:
- [ ] Create `featured-experiments.tsx` block with carousel + subject tabs (4h)
- [ ] Create `subject-browser.tsx` block with 5 subject cards (2h)
- [ ] Rewrite `hero.tsx` — new headline, experiment animation placeholder (3h)
- [ ] Update `features-step.tsx` — "How it works" 3-step content (1h)
- [ ] Update `stats.tsx` — real numbers from registry (1h)
- [ ] Update `pricing.tsx` — new tiers ($0 / $4.99 / $9.99) (2h)
- [ ] Update `cta.tsx` — new copy (0.5h)
- [ ] Register new blocks in `index.tsx` (0.5h)
- [ ] Add all i18n keys for en and zh (2h)
- [ ] Mobile responsiveness pass on all 7 sections (2h)

### 3.4 Experiment Cards with Subject Colors

**File to CREATE**: `src/shared/blocks/experiments/ExperimentCard.tsx`

Reusable card component used on landing page, experiments browser, and related experiments sidebar.

```typescript
interface ExperimentCardProps {
  experiment: Experiment;
  variant: "grid" | "compact" | "featured";
  showSubjectColor?: boolean;
}
```

Features:
- `data-subject` attribute on card root for CSS color theming
- Thumbnail with lazy loading
- Subject badge, grade level badge, difficulty indicator
- Tier indicator (Free / Pro lock icon)
- Hover preview animation (stretch goal)

Tasks:
- [ ] Create `src/shared/blocks/experiments/ExperimentCard.tsx` (3h)
- [ ] Add i18n keys for card labels in `en/experiments.json` (0.5h)

### Sprint 1 Definition of Done

- [ ] Header dropdown navigation works on desktop with all sub-items
- [ ] Mobile bottom tab bar visible on screens < 768px
- [ ] Landing page renders all 7 sections in correct order
- [ ] Subject browser shows 5 subjects with correct colors
- [ ] Featured experiments carousel shows 6 experiments
- [ ] Pricing section shows 3 tiers with new prices ($0 / $4.99 / $9.99)
- [ ] All text uses i18n keys (no hardcoded strings)
- [ ] Lighthouse mobile score >= 85
- [ ] `pnpm build` passes

**Estimated total: ~40 hours**

## 4. Sprint 2: Experiment Browser + Viewer (Week 4-5, 10 days)

### 4.1 `/experiments` Page Redesign (SSG + CSR Filters)

**File**: `src/app/[locale]/(landing)/experiments/page.tsx` (REWRITE)

The page uses `generateStaticParams` for SSG base, with client-side filter state.

Architecture:
- Server component renders full experiment list as static HTML (SEO)
- Client component overlays filter UI that shows/hides cards via CSS

**File to CREATE**: `src/shared/blocks/experiments/ExperimentBrowser.tsx`

```typescript
interface ExperimentBrowserProps {
  experiments: Experiment[];
  userTier: Tier;
  accessedIds: string[];
  accessedCount: number;
}
```

Features:
- **Filter bar**: Subject tabs (5) + Grade dropdown + Difficulty dropdown + Search input
- **Grid display**: `ExperimentCard` components, 3 columns desktop, 2 tablet, 1 mobile
- **Sort**: Relevance (default), Newest, Most Popular, A-Z
- **URL params**: `?subject=physics&grade=AP&q=force` — shareable filter state
- **Lock indicators**: Free users see lock on experiments beyond their 3 accessed

Tasks:
- [ ] Create `src/shared/blocks/experiments/ExperimentBrowser.tsx` (6h)
- [ ] Create `src/shared/blocks/experiments/ExperimentFilterBar.tsx` (3h)
- [ ] Rewrite `src/app/[locale]/(landing)/experiments/page.tsx` — SSG with client filter (2h)
- [ ] Add URL search param sync hook `src/shared/hooks/use-experiment-filters.ts` (1.5h)
- [ ] Add i18n keys: `experiments.filter.*`, `experiments.sort.*`, `experiments.empty_state` (1h)

Files to CREATE:
- `src/shared/blocks/experiments/ExperimentBrowser.tsx`
- `src/shared/blocks/experiments/ExperimentFilterBar.tsx`
- `src/shared/hooks/use-experiment-filters.ts`

Files to MODIFY:
- `src/app/[locale]/(landing)/experiments/page.tsx`
- `src/config/locale/messages/en/experiments.json`
- `src/config/locale/messages/zh/experiments.json`

### 4.2 Enhanced Experiment Viewer

**File**: `src/app/[locale]/(landing)/experiments/[slug]/ExperimentClient.tsx` (MODIFY)

Enhancements:
- Subject color theming via `data-subject` on root
- "X of 3 free experiments used" indicator for free users
- Related experiments sidebar (uses `relatedExperiments` field)
- Breadcrumb: `Experiments > Physics > Newton's Laws`
- Standards badges (NGSS, AP)
- Challenge completion tracking UI
- Share button (copy link, social)

**File to CREATE**: `src/shared/blocks/experiments/RelatedExperiments.tsx`

```typescript
interface RelatedExperimentsProps {
  experimentIds: string[];
  currentSubject: Subject;
}
```

Shows 3-4 compact `ExperimentCard` components in sidebar.

**File to CREATE**: `src/shared/blocks/experiments/ExperimentBreadcrumb.tsx`

Tasks:
- [ ] Create `RelatedExperiments.tsx` sidebar component (2h)
- [ ] Create `ExperimentBreadcrumb.tsx` (0.5h)
- [ ] Update `ExperimentClient.tsx` — add subject theming, access counter, breadcrumb, related sidebar (4h)
- [ ] Add share functionality (navigator.share + fallback copy) (1h)
- [ ] Add standards badge display (NGSS/AP codes) (1h)

### 4.3 Paywall Gate Update

**File**: `src/shared/blocks/experiments/PaywallGate.tsx` (REWRITE)

New behavior:
- Shows when free user tries to access 4th experiment
- Displays: "You've explored 3 of 3 free experiments"
- Progress bar visualization
- Two CTAs: "Subscribe for $4.99/mo" (primary) and "Sign in" (if not logged in)
- Lists what Pro includes: "Unlimited experiments, all subjects, progress tracking"

Also needs a **soft gate** variant that shows on experiment cards in the browser:
- Lock icon overlay
- "Subscribe to unlock" tooltip

Tasks:
- [ ] Rewrite `PaywallGate.tsx` with progress bar and new copy (2h)
- [ ] Create `src/shared/blocks/experiments/ExperimentLockOverlay.tsx` for card lock state (1h)
- [ ] Update i18n: `common.paywall.*` keys for new copy (0.5h)

Files to CREATE:
- `src/shared/blocks/experiments/ExperimentLockOverlay.tsx`

Files to MODIFY:
- `src/shared/blocks/experiments/PaywallGate.tsx`
- `src/config/locale/messages/en/common.json`
- `src/config/locale/messages/zh/common.json`

### Sprint 2 Definition of Done

- [ ] `/experiments` page shows all 64 experiments in filterable grid
- [ ] Filters work: subject, grade, difficulty, search — all reflected in URL
- [ ] Free user sees lock overlay after accessing 3 experiments
- [ ] Paywall gate shows with correct copy and progress bar
- [ ] Related experiments sidebar shows on experiment viewer page
- [ ] Breadcrumb navigation works correctly
- [ ] SSG generates static pages for all 64 experiment slugs
- [ ] `pnpm build` passes, no hydration errors
- [ ] Unit tests for `ExperimentBrowser` filter logic

**Estimated total: ~40 hours**

## 5. Sprint 3: Dashboard + Gallery + Learning Paths (Week 6-7, 10 days)

### 5.1 Dashboard Upgrade

**File**: `src/app/[locale]/(dashboard)/dashboard/page.tsx` (MODIFY — now in new layout group)

New dashboard panels:
1. **My Experiments** — List of accessed experiments with progress, subject colors
2. **My Creations** — UPG generations (moved from /upg/my)
3. **Learning Progress** — Active learning paths with completion %
4. **Quick Stats** — Experiments explored, time spent, streak

**File to CREATE**: `src/shared/blocks/dashboard/ExperimentProgressPanel.tsx`

```typescript
// Shows: experiment cards with completion %, time spent, last accessed
// Uses: experimentProgress + experimentAccess tables
```

**File to CREATE**: `src/shared/blocks/dashboard/QuickStatsPanel.tsx`

Tasks:
- [ ] Create `ExperimentProgressPanel.tsx` (3h)
- [ ] Create `QuickStatsPanel.tsx` (1.5h)
- [ ] Update dashboard page layout to new 4-panel grid (2h)
- [ ] Add "My Creations" tab that replaces `/upg/my` (1.5h)
- [ ] Add i18n keys: `user-dashboard.experiments.*`, `user-dashboard.stats.*` (1h)

Files to CREATE:
- `src/shared/blocks/dashboard/ExperimentProgressPanel.tsx`
- `src/shared/blocks/dashboard/QuickStatsPanel.tsx`

Files to MODIFY:
- `src/app/[locale]/(dashboard)/dashboard/page.tsx`
- `src/config/locale/messages/en/user-dashboard.json`
- `src/config/locale/messages/zh/user-dashboard.json`

### 5.2 Gallery SEO Improvements

**File**: `src/app/[locale]/(landing)/gallery/page.tsx` (MODIFY)

Changes:
- Add structured data (JSON-LD) for gallery items
- Subject filter tabs on gallery page
- Better meta descriptions per filter state
- Canonical URL handling for filtered views

Tasks:
- [ ] Add JSON-LD structured data to gallery items (1.5h)
- [ ] Add subject filter tabs (reuse `ExperimentFilterBar` pattern) (1.5h)
- [ ] Update meta tags for filtered views (0.5h)

### 5.3 Learning Path UI Refresh

**Files**: `src/app/[locale]/(landing)/learn/` (MOVE to `src/app/[locale]/(learn)/paths/`)

Changes:
- Move to `(learn)` layout group
- Add subject color theming
- Improve mobile experience
- Add path difficulty indicators

Tasks:
- [ ] Move learn routes to `(learn)` group (1h)
- [ ] Update `(learn)/layout.tsx` with sidebar navigation (2h)
- [ ] Add subject colors to path cards (1h)
- [ ] Mobile responsiveness improvements (1.5h)
- [ ] Update internal links across the app (0.5h)

Files to MOVE:
- `src/app/[locale]/(landing)/learn/` -> `src/app/[locale]/(learn)/paths/`

Files to MODIFY:
- `src/app/[locale]/(learn)/layout.tsx`
- Any files linking to `/learn/` (update to `/paths/`)

### Sprint 3 Definition of Done

- [ ] Dashboard shows 4 panels: My Experiments, My Creations, Learning Progress, Quick Stats
- [ ] Gallery has subject filter tabs and JSON-LD structured data
- [ ] Learning paths render in `(learn)` layout with sidebar
- [ ] All internal links updated after route moves
- [ ] `pnpm build` passes
- [ ] Manual QA: dashboard loads in < 2s, gallery pagination works

**Estimated total: ~35 hours**

## 6. Sprint 4: AP Prep Mode (Week 8-11, 18 days)

### 6.1 Database Schema (5 New Tables)

**File**: `src/config/db/schema.ts` (append)

```typescript
// ─── AP Prep Mode Tables ───

export const apExamTopic = pgTable(
  'ap_exam_topic',
  {
    id: text('id').primaryKey(),
    examCode: text('exam_code').notNull(),        // 'ap-physics-1', 'ap-physics-2', 'ap-physics-c-mech', 'ap-physics-c-em'
    unitNumber: integer('unit_number').notNull(),
    unitTitle: text('unit_title').notNull(),
    topicCode: text('topic_code').notNull(),       // e.g., '3.A.1'
    topicTitle: text('topic_title').notNull(),
    description: text('description'),
    weight: integer('weight'),                     // percentage weight on exam
    linkedExperimentIds: text('linked_experiment_ids'), // JSON array of experiment IDs
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_ap_exam_topic_exam').on(table.examCode),
    unique('uq_ap_exam_topic_code').on(table.examCode, table.topicCode),
  ]
);

export const apQuestion = pgTable(
  'ap_question',
  {
    id: text('id').primaryKey(),
    topicId: text('topic_id')
      .notNull()
      .references(() => apExamTopic.id, { onDelete: 'cascade' }),
    questionType: text('question_type').notNull(), // 'mcq' | 'frq'
    stem: text('stem').notNull(),                  // Question text (supports LaTeX)
    choices: text('choices'),                      // JSON array for MCQ
    correctAnswer: text('correct_answer').notNull(),
    explanation: text('explanation').notNull(),
    difficulty: text('difficulty').notNull(),       // 'easy' | 'medium' | 'hard'
    linkedExperimentId: text('linked_experiment_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_ap_question_topic').on(table.topicId),
    index('idx_ap_question_difficulty').on(table.difficulty),
  ]
);

export const apUserProgress = pgTable(
  'ap_user_progress',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    topicId: text('topic_id')
      .notNull()
      .references(() => apExamTopic.id, { onDelete: 'cascade' }),
    masteryLevel: integer('mastery_level').default(0).notNull(), // 0-100
    questionsAttempted: integer('questions_attempted').default(0).notNull(),
    questionsCorrect: integer('questions_correct').default(0).notNull(),
    lastPracticedAt: timestamp('last_practiced_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique('uq_ap_user_progress_user_topic').on(table.userId, table.topicId),
    index('idx_ap_user_progress_user').on(table.userId),
  ]
);

export const apPracticeSession = pgTable(
  'ap_practice_session',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    examCode: text('exam_code').notNull(),
    mode: text('mode').notNull(),                  // 'topic' | 'mixed' | 'timed'
    questionsTotal: integer('questions_total').notNull(),
    questionsCorrect: integer('questions_correct').default(0),
    timeSpentSeconds: integer('time_spent_seconds').default(0),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_ap_practice_session_user').on(table.userId),
    index('idx_ap_practice_session_exam').on(table.examCode),
  ]
);

export const apSessionAnswer = pgTable(
  'ap_session_answer',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id')
      .notNull()
      .references(() => apPracticeSession.id, { onDelete: 'cascade' }),
    questionId: text('question_id')
      .notNull()
      .references(() => apQuestion.id, { onDelete: 'cascade' }),
    userAnswer: text('user_answer').notNull(),
    isCorrect: boolean('is_correct').notNull(),
    timeSpentSeconds: integer('time_spent_seconds').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_ap_session_answer_session').on(table.sessionId),
  ]
);
```

Tasks:
- [ ] Add 5 tables to `src/config/db/schema.ts` (2h)
- [ ] Run `pnpm db:generate && pnpm db:push` (0.25h)
- [ ] Create model files (5 files) (4h)

Files to CREATE:
- `src/shared/models/ap_exam_topic.ts`
- `src/shared/models/ap_question.ts`
- `src/shared/models/ap_user_progress.ts`
- `src/shared/models/ap_practice_session.ts`
- `src/shared/models/ap_session_answer.ts`

### 6.2 API Endpoints (10 New)

**Base path**: `src/app/api/ap-prep/`

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/ap-prep/exams` | List available AP exams |
| GET | `/api/ap-prep/exams/[code]/topics` | Get topics for an exam |
| GET | `/api/ap-prep/topics/[id]/questions` | Get questions for a topic |
| POST | `/api/ap-prep/sessions` | Start a practice session |
| POST | `/api/ap-prep/sessions/[id]/answer` | Submit an answer |
| GET | `/api/ap-prep/sessions/[id]` | Get session results |
| GET | `/api/ap-prep/progress` | Get user's overall progress |
| GET | `/api/ap-prep/progress/[examCode]` | Get progress for specific exam |
| POST | `/api/ap-prep/sessions/[id]/complete` | Complete a session |
| GET | `/api/ap-prep/recommendations` | AI-powered topic recommendations |

All endpoints require authentication. The `/recommendations` endpoint calls the AI to suggest next topics based on mastery levels.

Tasks:
- [ ] Create 10 API route files (8h)
- [ ] Add rate limiting to `/recommendations` endpoint (0.5h)
- [ ] Write tests for session flow: start -> answer -> complete -> results (3h)

Files to CREATE:
- `src/app/api/ap-prep/exams/route.ts`
- `src/app/api/ap-prep/exams/[code]/topics/route.ts`
- `src/app/api/ap-prep/topics/[id]/questions/route.ts`
- `src/app/api/ap-prep/sessions/route.ts`
- `src/app/api/ap-prep/sessions/[id]/route.ts`
- `src/app/api/ap-prep/sessions/[id]/answer/route.ts`
- `src/app/api/ap-prep/sessions/[id]/complete/route.ts`
- `src/app/api/ap-prep/progress/route.ts`
- `src/app/api/ap-prep/progress/[examCode]/route.ts`
- `src/app/api/ap-prep/recommendations/route.ts`

### 6.3 Frontend Pages (5 Routes)

All under `src/app/[locale]/(learn)/ap-prep/`:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/ap-prep` | `ApPrepHome` | Exam selection, overall progress dashboard |
| `/ap-prep/[examCode]` | `ExamOverview` | Topic grid with mastery heatmap |
| `/ap-prep/[examCode]/practice` | `PracticeSession` | Question-by-question UI |
| `/ap-prep/[examCode]/practice/[sessionId]/results` | `SessionResults` | Score, explanations, linked experiments |
| `/ap-prep/[examCode]/topic/[topicId]` | `TopicDetail` | Topic content + targeted practice |

**Key Components to CREATE** (in `src/shared/blocks/ap-prep/`):

- `MasteryHeatmap.tsx` — Color-coded grid showing mastery per topic
- `QuestionCard.tsx` — MCQ/FRQ display with LaTeX rendering (KaTeX)
- `ExplanationPanel.tsx` — Shows explanation + links to related experiment
- `PracticeTimer.tsx` — Countdown timer for timed practice mode
- `ProgressRing.tsx` — Circular progress indicator per topic

Tasks:
- [ ] Create 5 page files under `(learn)/ap-prep/` (10h)
- [ ] Create 5 block components in `shared/blocks/ap-prep/` (12h)
- [ ] Add i18n keys: `ap-prep.*` namespace for en and zh (3h)
- [ ] Create seed script: `scripts/seed-ap-questions.ts` for initial question bank (4h)

Files to CREATE:
- `src/app/[locale]/(learn)/ap-prep/page.tsx`
- `src/app/[locale]/(learn)/ap-prep/[examCode]/page.tsx`
- `src/app/[locale]/(learn)/ap-prep/[examCode]/practice/page.tsx`
- `src/app/[locale]/(learn)/ap-prep/[examCode]/practice/[sessionId]/results/page.tsx`
- `src/app/[locale]/(learn)/ap-prep/[examCode]/topic/[topicId]/page.tsx`
- `src/shared/blocks/ap-prep/MasteryHeatmap.tsx`
- `src/shared/blocks/ap-prep/QuestionCard.tsx`
- `src/shared/blocks/ap-prep/ExplanationPanel.tsx`
- `src/shared/blocks/ap-prep/PracticeTimer.tsx`
- `src/shared/blocks/ap-prep/ProgressRing.tsx`
- `src/config/locale/messages/en/ap-prep.json`
- `src/config/locale/messages/zh/ap-prep.json`
- `scripts/seed-ap-questions.ts`

### Sprint 4 Definition of Done

- [ ] 5 new tables created and migrations applied
- [ ] 10 API endpoints respond correctly (test with curl/httpie)
- [ ] AP Prep home page shows exam selection
- [ ] Topic heatmap renders with mastery colors
- [ ] Practice session flow works: select topic -> answer questions -> see results
- [ ] Question explanations link to relevant experiments
- [ ] Seed script populates at least 50 questions for AP Physics 1
- [ ] All pages have en/zh translations
- [ ] Unit tests for session scoring logic
- [ ] `pnpm build` passes

**Estimated total: ~72 hours**

## 7. Sprint 5: UPG Repositioning + Polish (Week 12-13, 10 days)

### 7.1 Move UPG from `/upg` to `/create`

**Directory move**: `src/app/[locale]/(landing)/(ai)/upg/` -> `src/app/[locale]/(create)/create/`

The `(create)` layout group has minimal chrome — no sidebar, full-width canvas for the UPG generator.

Tasks:
- [ ] Move UPG page files to `(create)/create/` (1h)
- [ ] Update `(create)/layout.tsx` — minimal header, no footer (1h)
- [ ] Update all internal links referencing `/upg/` to `/create/` (1.5h)
- [ ] Verify 301 redirects from S0 are working (0.25h)
- [ ] Update sitemap.ts to include new `/create` routes (0.5h)
- [ ] Update UPG API routes if they have hardcoded path references (0.5h)

Files to MOVE:
- `src/app/[locale]/(landing)/(ai)/upg/` -> `src/app/[locale]/(create)/create/`

Files to MODIFY:
- `src/app/[locale]/(create)/layout.tsx`
- `src/app/sitemap.ts`
- Any component linking to `/upg/*`

### 7.2 Pricing Page Update

**File**: `src/config/locale/messages/en/pricing.json` (REWRITE)

New pricing tiers:

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 3 experiments total, basic parameters, community support |
| Pro | $4.99/mo ($47.88/yr) | Unlimited experiments, all subjects, AP Prep, progress tracking, priority support |
| Max | $9.99/mo ($95.88/yr) | Everything in Pro + UPG unlimited, classroom tools, API access, dedicated support |

Tasks:
- [ ] Rewrite `en/pricing.json` with new tiers and features (1h)
- [ ] Rewrite `zh/pricing.json` (0.5h)
- [ ] Update Stripe product IDs in payment configuration (0.5h — CONFIRM with user before touching payment config)

Files to MODIFY:
- `src/config/locale/messages/en/pricing.json`
- `src/config/locale/messages/zh/pricing.json`

### 7.3 Performance Optimization

Tasks:
- [ ] Audit bundle size with `next build --analyze` (1h)
- [ ] Lazy load heavy components: experiment viewer 3D, KaTeX renderer (2h)
- [ ] Image optimization: convert experiment thumbnails to WebP, add `sizes` attribute (1.5h)
- [ ] Add `loading="lazy"` to below-fold images on landing page (0.5h)
- [ ] Verify Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms (1h)
- [ ] Add prefetch hints for common navigation paths (0.5h)

### 7.4 Final Polish

Tasks:
- [ ] Dark mode pass: verify all new components work in dark mode (2h)
- [ ] Accessibility audit: keyboard navigation, ARIA labels, color contrast (2h)
- [ ] 404 page update with experiment suggestions (1h)
- [ ] Error boundary components for experiment viewer and AP prep (1h)
- [ ] Loading skeletons for experiment browser, AP prep pages (1.5h)
- [ ] Console error cleanup (0.5h)

### Sprint 5 Definition of Done

- [ ] UPG accessible at `/create`, old URLs redirect
- [ ] Pricing page shows correct 3-tier pricing
- [ ] Lighthouse performance score >= 90 on key pages
- [ ] Dark mode renders correctly on all new pages
- [ ] No accessibility violations (axe-core audit)
- [ ] `pnpm build` passes with no warnings
- [ ] Full regression test pass

**Estimated total: ~35 hours**

## 8. Database Changes Summary

### New Tables (6 total)

| Table | Sprint | Columns | Purpose |
|-------|--------|---------|---------|
| `experiment_access` | S0 | 4 | Track which experiments a user has accessed (lifetime limit) |
| `ap_exam_topic` | S4 | 10 | AP exam topic definitions |
| `ap_question` | S4 | 10 | Question bank for AP prep |
| `ap_user_progress` | S4 | 8 | Per-topic mastery tracking |
| `ap_practice_session` | S4 | 8 | Practice session records |
| `ap_session_answer` | S4 | 7 | Individual answer records |

### Field Additions to Existing Tables

| Table | Field | Type | Sprint |
|-------|-------|------|--------|
| (type only) `Experiment` | `subject` | `Subject` | S0 |
| (type only) `Experiment` | `gradeLevel` | `GradeLevel` | S0 |

Note: `subject` and `gradeLevel` are added to the TypeScript `Experiment` interface and the 64 static data files. They are NOT database columns — experiment data is static, not stored in PostgreSQL.

### Migration Script

```bash
# After Sprint 0 schema changes:
pnpm db:generate
pnpm db:push

# After Sprint 4 schema changes:
pnpm db:generate
pnpm db:push
```

No data migration needed — `experiment_access` starts empty, AP tables are seeded fresh.

## 9. API Changes Summary

### New Endpoints (12 total)

| Sprint | Method | Route | Auth Required |
|--------|--------|-------|---------------|
| S0 | GET | `/api/experiments/access` | Yes |
| S0 | POST | `/api/experiments/access` | Yes |
| S4 | GET | `/api/ap-prep/exams` | Yes |
| S4 | GET | `/api/ap-prep/exams/[code]/topics` | Yes |
| S4 | GET | `/api/ap-prep/topics/[id]/questions` | Yes |
| S4 | POST | `/api/ap-prep/sessions` | Yes |
| S4 | GET | `/api/ap-prep/sessions/[id]` | Yes |
| S4 | POST | `/api/ap-prep/sessions/[id]/answer` | Yes |
| S4 | POST | `/api/ap-prep/sessions/[id]/complete` | Yes |
| S4 | GET | `/api/ap-prep/progress` | Yes |
| S4 | GET | `/api/ap-prep/progress/[examCode]` | Yes |
| S4 | GET | `/api/ap-prep/recommendations` | Yes |

### Existing Endpoint Modifications

| Endpoint | Change | Sprint |
|----------|--------|--------|
| `GET /api/experiments/[id]/progress` | Add `accessedCount` and `remaining` to response | S0 |
| `GET /api/dashboard` | Add experiment access stats to response | S3 |
| `GET /api/user/get-user-info` | Add `experimentAccessCount` field | S0 |

### Rate Limiting Additions

| Endpoint | Limit | Sprint |
|----------|-------|--------|
| `POST /api/experiments/access` | 20 req/min per user | S0 |
| `POST /api/ap-prep/sessions/[id]/answer` | 60 req/min per user | S4 |
| `GET /api/ap-prep/recommendations` | 10 req/min per user | S4 |

## 10. File Change Manifest

### CREATE (New Files) — 42 files

**Sprint 0 (7 files)**
- `scripts/add-experiment-fields.ts`
- `src/shared/lib/experiments/subjects.ts`
- `src/shared/models/experiment_access.ts`
- `src/app/api/experiments/access/route.ts`
- `src/app/[locale]/(learn)/layout.tsx`
- `src/app/[locale]/(create)/layout.tsx`
- `src/app/[locale]/(dashboard)/layout.tsx`

**Sprint 1 (5 files)**
- `src/themes/default/blocks/featured-experiments.tsx`
- `src/themes/default/blocks/subject-browser.tsx`
- `src/shared/blocks/common/MobileTabBar.tsx`
- `src/shared/blocks/experiments/ExperimentCard.tsx`

**Sprint 2 (4 files)**
- `src/shared/blocks/experiments/ExperimentBrowser.tsx`
- `src/shared/blocks/experiments/ExperimentFilterBar.tsx`
- `src/shared/blocks/experiments/RelatedExperiments.tsx`
- `src/shared/blocks/experiments/ExperimentBreadcrumb.tsx`
- `src/shared/blocks/experiments/ExperimentLockOverlay.tsx`
- `src/shared/hooks/use-experiment-filters.ts`

**Sprint 3 (2 files)**
- `src/shared/blocks/dashboard/ExperimentProgressPanel.tsx`
- `src/shared/blocks/dashboard/QuickStatsPanel.tsx`

**Sprint 4 (24 files)**
- `src/shared/models/ap_exam_topic.ts`
- `src/shared/models/ap_question.ts`
- `src/shared/models/ap_user_progress.ts`
- `src/shared/models/ap_practice_session.ts`
- `src/shared/models/ap_session_answer.ts`
- `src/app/api/ap-prep/exams/route.ts`
- `src/app/api/ap-prep/exams/[code]/topics/route.ts`
- `src/app/api/ap-prep/topics/[id]/questions/route.ts`
- `src/app/api/ap-prep/sessions/route.ts`
- `src/app/api/ap-prep/sessions/[id]/route.ts`
- `src/app/api/ap-prep/sessions/[id]/answer/route.ts`
- `src/app/api/ap-prep/sessions/[id]/complete/route.ts`
- `src/app/api/ap-prep/progress/route.ts`
- `src/app/api/ap-prep/progress/[examCode]/route.ts`
- `src/app/api/ap-prep/recommendations/route.ts`
- `src/app/[locale]/(learn)/ap-prep/page.tsx`
- `src/app/[locale]/(learn)/ap-prep/[examCode]/page.tsx`
- `src/app/[locale]/(learn)/ap-prep/[examCode]/practice/page.tsx`
- `src/app/[locale]/(learn)/ap-prep/[examCode]/practice/[sessionId]/results/page.tsx`
- `src/app/[locale]/(learn)/ap-prep/[examCode]/topic/[topicId]/page.tsx`
- `src/shared/blocks/ap-prep/MasteryHeatmap.tsx`
- `src/shared/blocks/ap-prep/QuestionCard.tsx`
- `src/shared/blocks/ap-prep/ExplanationPanel.tsx`
- `src/shared/blocks/ap-prep/PracticeTimer.tsx`
- `src/shared/blocks/ap-prep/ProgressRing.tsx`
- `src/config/locale/messages/en/ap-prep.json`
- `src/config/locale/messages/zh/ap-prep.json`
- `scripts/seed-ap-questions.ts`

### MODIFY (Existing Files) — ~30 files

**Sprint 0**
- `src/config/style/theme-education.css` — prefix rename + subject colors
- `src/config/db/schema.ts` — add `experimentAccess` table
- `src/shared/types/experiment.ts` — add `Subject`, `GradeLevel`
- `src/shared/lib/experiments/access.ts` — new lifetime limit logic
- `src/shared/lib/experiments/registry.ts` — add subject/grade query functions
- All 64 `src/shared/lib/experiments/data/*.ts` — add `subject`, `gradeLevel`
- `src/app/[locale]/(landing)/experiments/[slug]/page.tsx` — new access params
- `src/app/[locale]/(landing)/experiments/[slug]/ExperimentClient.tsx` — new props
- `src/shared/blocks/experiments/PaywallGate.tsx` — new copy + progress bar
- `next.config.mjs` — add redirects
- ~15-20 `.tsx` files — `.edu-*` to `.np-*` class rename

**Sprint 1**
- `src/themes/default/blocks/header.tsx` — dropdown nav rewrite
- `src/themes/default/blocks/hero.tsx` — new content
- `src/themes/default/blocks/stats.tsx` — new numbers
- `src/themes/default/blocks/pricing.tsx` — new tiers
- `src/themes/default/blocks/cta.tsx` — new copy
- `src/themes/default/blocks/index.tsx` — register new blocks
- `src/config/locale/messages/en/landing.json` — new keys
- `src/config/locale/messages/zh/landing.json` — new keys
- `src/config/locale/messages/en/common.json` — mobile tab keys
- `src/config/locale/messages/zh/common.json` — mobile tab keys

**Sprint 2**
- `src/app/[locale]/(landing)/experiments/page.tsx` — full rewrite with filters
- `src/config/locale/messages/en/experiments.json` — filter/sort keys
- `src/config/locale/messages/zh/experiments.json` — filter/sort keys

**Sprint 3**
- `src/app/[locale]/(dashboard)/dashboard/page.tsx` — new panels
- `src/app/[locale]/(landing)/gallery/page.tsx` — SEO + subject filters
- `src/config/locale/messages/en/user-dashboard.json`
- `src/config/locale/messages/zh/user-dashboard.json`

**Sprint 5**
- `src/app/sitemap.ts` — add `/create` routes
- `src/config/locale/messages/en/pricing.json` — new tiers
- `src/config/locale/messages/zh/pricing.json` — new tiers

### MOVE (Relocate) — 4 directories

| From | To | Sprint |
|------|----|--------|
| `src/app/[locale]/(landing)/dashboard/` | `src/app/[locale]/(dashboard)/dashboard/` | S0 |
| `src/app/[locale]/(landing)/settings/` | `src/app/[locale]/(dashboard)/settings/` | S0 |
| `src/app/[locale]/(landing)/learn/` | `src/app/[locale]/(learn)/paths/` | S3 |
| `src/app/[locale]/(landing)/(ai)/upg/` | `src/app/[locale]/(create)/create/` | S5 |

### DELETE (Remove) — 0 files

No files deleted. Old routes handled by 301 redirects. Deprecated `.edu-*` CSS aliases removed in a follow-up PR after 30-day deprecation window (out of scope for this plan).

## 11. Testing Plan

### Unit Tests to Add

| Test File | Tests | Sprint |
|-----------|-------|--------|
| `src/shared/models/__tests__/experiment_access.test.ts` | recordAccess, getCount, hasAccessed, limit enforcement | S0 |
| `src/shared/lib/experiments/__tests__/access.test.ts` | canAccessExperiment with new params, edge cases | S0 |
| `src/shared/lib/experiments/__tests__/subjects.test.ts` | Subject type mapping, all 64 experiments have valid subject | S0 |
| `src/shared/models/__tests__/ap_practice_session.test.ts` | Create session, submit answers, scoring | S4 |
| `src/shared/models/__tests__/ap_user_progress.test.ts` | Mastery calculation, progress update | S4 |

### E2E Tests to Add

| Test File | Scenario | Sprint |
|-----------|----------|--------|
| `e2e/experiment-access-limit.spec.ts` | Free user accesses 3 experiments, 4th is blocked | S2 |
| `e2e/experiment-browser-filters.spec.ts` | Filter by subject, grade, search; verify URL params | S2 |
| `e2e/ap-prep-practice.spec.ts` | Start session, answer questions, view results | S4 |
| `e2e/navigation-dropdowns.spec.ts` | Desktop dropdown nav, mobile tab bar | S1 |
| `e2e/upg-redirect.spec.ts` | `/upg` redirects to `/create` with 301 | S5 |

### Manual QA Checkpoints

| Checkpoint | Sprint | Pass Criteria |
|------------|--------|---------------|
| CSS prefix migration | S0 | No visual regressions; old `.edu-*` classes still work via aliases |
| Subject colors | S0 | Each subject card shows distinct color in light and dark mode |
| Landing page | S1 | All 7 sections render, responsive on mobile/tablet/desktop |
| Experiment paywall | S2 | 4th experiment shows paywall gate for free user, Pro user has no limit |
| Dashboard panels | S3 | All 4 panels load with correct data |
| AP Prep flow | S4 | End-to-end: select exam -> practice -> see results -> mastery updates |
| UPG at /create | S5 | Generator works at new URL, old URL redirects |
| Dark mode full pass | S5 | Every new page/component renders correctly in dark mode |

## 12. Deployment Checklist

### Environment Variables

No new environment variables required. All features use existing:
- `DATABASE_URL` — for new tables
- `UPSTASH_REDIS_REST_URL` / `TOKEN` — for rate limiting on new endpoints
- `AUTH_SECRET` — for authentication on AP Prep endpoints

### Database Migrations

```bash
# Sprint 0 (run before deploying S0)
pnpm db:generate   # Generates SQL for experimentAccess table
pnpm db:push       # Applies to database

# Sprint 4 (run before deploying S4)
pnpm db:generate   # Generates SQL for 5 AP Prep tables
pnpm db:push       # Applies to database

# Sprint 4 post-deploy
npx tsx scripts/seed-ap-questions.ts  # Seed initial question bank
```

### Vercel Configuration

**File**: `vercel.json` — add maxDuration for AP Prep recommendations:

```json
{
  "functions": {
    "src/app/api/ap-prep/recommendations/route.ts": {
      "maxDuration": 60
    }
  }
}
```

### SEO Verification

- [ ] All 301 redirects return correct status (check with `curl -I`)
- [ ] `/sitemap.xml` includes `/experiments/*`, `/create`, `/ap-prep/*`
- [ ] `robots.txt` does not block new routes
- [ ] JSON-LD structured data validates on schema.org validator
- [ ] Open Graph meta tags present on experiment pages
- [ ] Canonical URLs set correctly for filtered experiment views

### Pre-Launch Smoke Test

1. Anonymous user lands on `/` — sees 7-section landing page
2. Anonymous user browses `/experiments` — sees 64 experiments, filters work
3. Anonymous user clicks experiment — can access (counts as 1 of 3)
4. Sign up — experiment access count carries over (based on signed-in state)
5. Access 3 experiments — 4th shows paywall
6. Subscribe to Pro — all experiments unlock
7. Visit `/create` — UPG generator works
8. Visit `/ap-prep` — exam selection shows
9. Start AP practice session — questions render with LaTeX
10. Visit `/upg` — redirects to `/create` with 301
11. Switch to dark mode — all pages render correctly
12. Switch to Chinese — all text translated

### Rollback Plan

Each sprint deploys independently. If a sprint causes issues:

1. Revert the deploy in Vercel dashboard (instant)
2. Database changes are additive only (new tables, no drops) — no DB rollback needed
3. 301 redirects can be removed from `next.config.mjs` without side effects
4. CSS aliases ensure old class names keep working during transition
