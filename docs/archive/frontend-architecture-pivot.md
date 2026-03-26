---
name: frontend-architecture-pivot
status: in-progress
created: 2026-03-22T14:53:27Z
updated: 2026-03-22T14:53:27Z
---

# Frontend Architecture: Experiment-Library Pivot

From UPG-centric SaaS to experiment-library-centric educational platform.

## Inventory Snapshot

| Asset | Count | Notes |
|-------|-------|-------|
| Experiment data files | 64 | 8386 LOC across 7 waves |
| R3F 3D scenes | 4 | Wave 1 only; Wave 2+ use HTML iframe |
| shadcn/ui atoms | 46 | Comprehensive, no gaps |
| Theme landing blocks | 24 | hero, features, pricing, etc. |
| Business block dirs | 17 | upg, gallery, experiments, dashboard, etc. |
| Custom hooks | 8 | simulation, viewport, parallax, quota |
| Locale namespaces | 15 | en/zh, JSON-based |

## 1. Route Architecture

### Layout Groups

```
src/app/[locale]/
├── (landing)/           ← Public marketing layout (header + footer)
│   ├── page.tsx                 # / — NEW landing (experiment-centric)
│   ├── pricing/page.tsx         # /pricing — MODIFY (experiment-focused copy)
│   ├── blog/                    # /blog — KEEP as-is
│   └── [...slug]/page.tsx       # catch-all CMS pages — KEEP
│
├── (explore)/           ← NEW layout group — experiment browsing
│   ├── layout.tsx               # Shared: sticky filter sidebar + header
│   ├── explore/page.tsx         # /explore — NEW primary entry
│   └── explore/[slug]/page.tsx  # /explore/[slug] — MOVE from experiments/[slug]
│
├── (learn)/             ← NEW layout group — structured learning
│   ├── layout.tsx               # Shared: progress sidebar
│   ├── ap-prep/page.tsx         # /ap-prep — NEW
│   ├── quests/page.tsx          # /quests — NEW
│   ├── learn/                   # /learn — KEEP, move here
│   └── notebook/page.tsx        # /notebook — NEW
│
├── (create)/            ← NEW layout group — UPG creation tools
│   ├── layout.tsx               # Minimal chrome, full canvas
│   ├── create/page.tsx          # /create — MOVE from upg/
│   └── community/page.tsx       # /community — MOVE from gallery/
│
├── (dashboard)/         ← KEEP existing admin sidebar layout
│   └── dashboard/page.tsx       # /dashboard — ENHANCE
│
├── (auth)/              ← KEEP
├── (admin)/             ← KEEP
├── (chat)/              ← KEEP
└── (docs)/              ← KEEP
```

### Route Detail

| Route | Type | Rendering | Data Source | Key Components |
|-------|------|-----------|-------------|---------------|
| `/` | Server | ISR 3600s | i18n JSON + registry stats | `ExploreHero`, `SubjectGrid`, `FeaturedExperiments`, `StatsBar` |
| `/explore` | Server+Client | SSG (shell) + CSR (filters) | `registry.ts` (all 64 exps) | `ExperimentBrowser`, `FilterSidebar`, `ExperimentGrid` |
| `/explore/[slug]` | Server | SSG via `generateStaticParams` | `registry.ts` + user session | `ExperimentViewer` (enhanced from current `ExperimentClient`) |
| `/ap-prep` | Server+Client | SSG shell + CSR quiz state | registry (AP-tagged) + quiz data | `APSubjectPicker`, `ExamPracticePanel`, `QuestionCard` |
| `/quests` | Client | CSR (gamification state) | API (user progress) + registry | `QuestMap`, `QuestCard`, `ProgressRing`, `AchievementToast` |
| `/notebook` | Client | CSR (AI interaction) | API (AI chat + experiment context) | `NotebookEditor`, `ExperimentContext`, `AIAssistant` |
| `/create` | Client | CSR | API (UPG generation) | Existing `UpgGenerator` + `DisciplineSelector` |
| `/community` | Server | SSR (pagination) | DB (gallery items) | Existing gallery blocks, renamed |
| `/learn` | Server | SSG | DB (learning paths) | Existing learning-path blocks |
| `/dashboard` | Server+Client | SSR (auth-gated) | DB (user data) | Enhanced `DashboardClient` + new panels |
| `/pricing` | Server | ISR 3600s | i18n JSON | Modified pricing blocks |

### Redirect Map (backward compat)

```typescript
// next.config.ts redirects
const redirects = [
  { source: '/experiments', destination: '/explore', permanent: true },
  { source: '/experiments/:slug', destination: '/explore/:slug', permanent: true },
  { source: '/upg', destination: '/create', permanent: true },
  { source: '/upg/my', destination: '/create', permanent: true },
  { source: '/gallery', destination: '/community', permanent: true },
  { source: '/gallery/:id', destination: '/community', permanent: false },
];
```

## 2. New Component Design

### 2.1 ExperimentBrowser — `/explore` primary component

**Location**: `src/shared/blocks/explore/ExperimentBrowser.tsx`

```typescript
interface FilterState {
  subject: SubjectFilter | null;     // physics | chemistry | biology | earth
  gradeLevel: GradeLevel | null;     // k5 | ms | hs | ap
  difficulty: Difficulty | null;
  tier: Tier | null;
  search: string;
  sortBy: SortOption;
}

type SubjectFilter = 'physics' | 'chemistry' | 'biology' | 'earth';
type GradeLevel = 'k5' | 'ms' | 'hs' | 'ap';
type SortOption = 'recommended' | 'newest' | 'difficulty-asc' | 'difficulty-desc' | 'popularity';

interface ExperimentBrowserProps {
  experiments: Experiment[];
  initialSubject?: SubjectFilter;
  locale: string;
}
```

**State**: Local `useState` for `FilterState`. No context needed — filters are page-scoped. URL search params synced via `useSearchParams` for shareable filter URLs.

**Sub-components**:
- `FilterSidebar` — collapsible on mobile (sheet), sticky on desktop
- `ExperimentGrid` — CSS grid, 1/2/3 cols responsive
- `ExperimentCard` — enhanced from current inline card (see 2.2)
- `SubjectTabs` — horizontal tab bar for quick subject switching
- `SearchBar` — debounced input with `cmd+k` shortcut
- `ActiveFilters` — pill badges showing current filters, click to remove
- `EmptyState` — when no experiments match

**Responsive**:
- Mobile: Full-width grid, filter as bottom sheet trigger
- Tablet: 2-col grid, collapsible sidebar
- Desktop: 3-col grid, persistent 240px sidebar

**Dark mode**: Uses existing theme variables, no special handling.

### 2.2 ExperimentCard — reusable card for listings

**Location**: `src/shared/blocks/explore/ExperimentCard.tsx`

```typescript
interface ExperimentCardProps {
  experiment: Experiment;
  variant: 'grid' | 'list' | 'compact';
  showProgress?: boolean;        // for dashboard/learn contexts
  progress?: number;             // 0-100
  locale: string;
}
```

**Upgrade from current**: Current experiments page has inline card markup in `page.tsx`. Extract to dedicated component with:
- Subject color-coding via CSS variables (see Section 6)
- Thumbnail/preview image (placeholder → screenshot pipeline later)
- Difficulty indicator (visual dots, not just text)
- Grade level badge
- Estimated time
- Free/Pro badge

### 2.3 ExperimentViewer — enhanced experiment detail

**Location**: `src/shared/blocks/explore/ExperimentViewer.tsx`

This is an evolution of the existing `ExperimentClient.tsx`, NOT a rewrite.

```typescript
interface ExperimentViewerProps {
  experiment: Experiment;
  userTier: Tier;
  canAccess: boolean;
  relatedExperiments: Experiment[];   // NEW
  locale: string;
}
```

**Additions over current ExperimentClient**:
- `RelatedExperiments` sidebar/bottom section
- `BreadcrumbNav` (Explore > Physics > Newton's Laws)
- `ShareButton` with URL copy
- `NotebookLink` — "Open in Lab Notebook" CTA
- `ExperimentTabs` — tabbed layout for Theory | Instructions | Challenges | Standards
- Preserve existing R3F scene rendering + HTML iframe fallback

### 2.4 APPrepPanel — AP exam practice

**Location**: `src/shared/blocks/ap-prep/`

```typescript
interface APPrepPanelProps {
  subject: 'physics-1' | 'physics-2' | 'physics-c-mech' | 'physics-c-em' | 'chemistry' | 'biology';
  locale: string;
}

interface QuestionCardProps {
  question: APQuestion;
  onAnswer: (questionId: string, answer: string) => void;
  showExplanation: boolean;
}

interface APQuestion {
  id: string;
  stem: string;
  choices: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  relatedExperiment?: string;      // slug — links to /explore/[slug]
  topic: string;
  difficulty: Difficulty;
}
```

**Sub-components**:
- `APSubjectPicker` — 6 AP subjects as cards
- `TopicSelector` — tree of AP curriculum topics
- `QuestionCard` — MC question with explanation reveal
- `ScoreTracker` — session score + accuracy graph
- `ExperimentLink` — "See this in action" button linking to simulation

**State**: Local state for quiz session. Future: persist to DB for progress tracking.

### 2.5 QuestMap — gamified physics quests

**Location**: `src/shared/blocks/quests/`

```typescript
interface QuestMapProps {
  quests: Quest[];
  userProgress: QuestProgress[];
  locale: string;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  experiments: string[];          // experiment slugs in sequence
  reward: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  prerequisites: string[];        // quest IDs
}

interface QuestProgress {
  questId: string;
  completedExperiments: string[];
  score: number;
  startedAt: string;
  completedAt: string | null;
}
```

**Sub-components**:
- `QuestMap` — visual node graph of quest chains (CSS grid, not canvas)
- `QuestCard` — expandable card with progress ring
- `QuestDetail` — modal/drawer with experiment checklist
- `AchievementToast` — sonner toast on quest completion
- `ProgressRing` — circular SVG progress indicator

### 2.6 NotebookEditor — AI lab notebook

**Location**: `src/shared/blocks/notebook/`

```typescript
interface NotebookEditorProps {
  experimentContext?: Experiment;    // pre-loaded from /explore/[slug] link
  locale: string;
}

interface NotebookEntry {
  id: string;
  type: 'observation' | 'hypothesis' | 'data' | 'conclusion' | 'ai-response';
  content: string;
  timestamp: string;
  experimentId?: string;
}
```

**Sub-components**:
- `NotebookEditor` — structured note-taking with sections
- `ExperimentContextBar` — shows linked experiment, click to open in split view
- `AIAssistantPanel` — chat interface reusing existing `chat` blocks
- `DataTable` — simple editable table for recording measurements
- `ExportButton` — export as PDF/Markdown

**State**: Local state + API persistence. Reuses existing chat API infrastructure.

## 3. Component Hierarchy

### `/explore` page tree

```
(explore)/layout.tsx
└── ExplorePage (Server)
    ├── PageHeader
    │   ├── BreadcrumbNav
    │   ├── SearchBar
    │   └── ViewToggle (grid/list)
    ├── ExperimentBrowser (Client)
    │   ├── SubjectTabs
    │   ├── ActiveFilters
    │   ├── FilterSidebar
    │   │   ├── GradeLevelFilter
    │   │   ├── DifficultyFilter
    │   │   ├── TierFilter
    │   │   └── SortSelector
    │   └── ExperimentGrid
    │       └── ExperimentCard[] (×64)
    │           ├── SubjectBadge
    │           ├── DifficultyDots
    │           ├── GradeBadge
    │           └── TierBadge
    └── SubjectStats (Server)
```

### `/explore/[slug]` page tree

```
(explore)/layout.tsx
└── ExperimentPage (Server — auth + data)
    ├── BreadcrumbNav
    ├── ExperimentViewer (Client)
    │   ├── ExperimentHeader
    │   │   ├── StandardsBadge (existing)
    │   │   ├── ShareButton
    │   │   └── NotebookLink
    │   ├── PaywallGate (existing, conditional)
    │   ├── SimulationArea
    │   │   ├── SceneRenderer (Wave 1 R3F) OR
    │   │   └── IframeViewer (Wave 2+ HTML)
    │   ├── ExperimentTabs
    │   │   ├── TheoryPanel
    │   │   ├── InstructionsPanel
    │   │   ├── ChallengesPanel
    │   │   └── StandardsPanel
    │   ├── ParameterSidebar
    │   │   ├── ParameterSlider[] (existing)
    │   │   ├── DataPanel (existing)
    │   │   └── FormulaDisplay (existing)
    │   └── PlaybackControls (existing)
    └── RelatedExperiments (Server)
        └── ExperimentCard[] (compact variant)
```

### `/` landing page tree

```
(landing)/layout.tsx
└── LandingPage (Server)
    ├── ExploreHero                    ← NEW (replaces generic SaaS hero)
    │   ├── HeroSearch
    │   ├── QuickSubjectButtons
    │   └── FeaturedExperimentPreview
    ├── SubjectGrid                    ← NEW
    │   └── SubjectCard[] (physics/chem/bio/earth)
    ├── FeaturedExperiments            ← NEW
    │   └── ExperimentCard[] (carousel, 6 items)
    ├── StatsBar                       ← REUSE existing stats block
    ├── HowItWorks                     ← MODIFY features-step
    ├── Testimonials                   ← KEEP
    ├── PricingPreview                 ← MODIFY pricing block
    ├── FAQ                            ← KEEP
    └── CTA                            ← MODIFY copy
```

### `/ap-prep` page tree

```
(learn)/layout.tsx
└── APPrepPage (Server)
    ├── APSubjectPicker
    │   └── SubjectCard[]
    └── APPrepPanel (Client)
        ├── TopicSelector
        ├── QuestionCard
        │   ├── ChoiceList
        │   └── ExplanationReveal
        │       └── ExperimentLink
        └── ScoreTracker
            └── AccuracyChart (recharts)
```

### `/quests` page tree

```
(learn)/layout.tsx
└── QuestsPage (Server — load user progress)
    └── QuestMap (Client)
        ├── QuestChain[]
        │   └── QuestCard[]
        │       ├── ProgressRing
        │       └── ExperimentChecklist
        └── AchievementPanel
```

### `/notebook` page tree

```
(learn)/layout.tsx
└── NotebookPage (Client)
    ├── ExperimentContextBar
    ├── NotebookEditor
    │   ├── SectionSelector (observation/hypothesis/data/conclusion)
    │   ├── ContentArea (textarea / DataTable)
    │   └── ExportButton
    └── AIAssistantPanel
        └── ChatInterface (reuse from chat blocks)
```

## 4. Shared State Changes

### New Contexts

**None required.** Each new page manages its own state locally. This is intentional:

- `/explore` filters: `useState` + URL search params (no cross-page persistence needed)
- `/ap-prep` quiz state: `useState` per session (future: API persistence)
- `/quests` progress: Server-fetched, client state for animations only
- `/notebook` entries: Local state + API save (debounced)

### Existing Context Modifications

**AppContext** — add one field:

```typescript
// current
interface AppContextValue {
  user: User | null;
  // ... existing fields
}

// add:
interface AppContextValue {
  user: User | null;
  experimentProgress: Map<string, number>;  // experimentId → completion %
  // ... existing fields
}
```

This is needed because `/dashboard`, `/quests`, and `/explore` all show experiment progress.

### Cross-page Data Flow

```
/explore/[slug]  ──"Open in Notebook"──→  /notebook?experiment=slug
/ap-prep         ──"See Simulation"───→  /explore/[slug]
/quests          ──"Start Experiment"──→  /explore/[slug]
/notebook        ──"View Experiment"──→  /explore/[slug]
/dashboard       ──"Continue"─────────→  /explore/[slug]
```

All cross-page navigation uses URL params, not shared state. The `experiment` query param in `/notebook` triggers server-side experiment lookup.

## 5. Navigation Redesign

### Header Menu Structure

```typescript
// config/locale/messages/en/landing.json — header.nav.items
const navItems = [
  {
    title: "Explore",              // PRIMARY — replaces "Experiments"
    url: "/explore",
    icon: "FlaskConical",
    badge: "64 Labs"               // dynamic count
  },
  {
    title: "Learn",
    icon: "GraduationCap",
    children: [
      { title: "AP Exam Prep", url: "/ap-prep", icon: "Target", description: "Practice AP Physics, Chemistry & Biology" },
      { title: "Physics Quests", url: "/quests", icon: "Gamepad2", description: "Gamified learning adventures" },
      { title: "Learning Paths", url: "/learn", icon: "BookOpen", description: "Structured curriculum tracks" },
      { title: "Lab Notebook", url: "/notebook", icon: "NotebookPen", description: "AI-assisted lab reports" },
    ]
  },
  {
    title: "Create",               // Demoted from primary
    icon: "Wand2",
    children: [
      { title: "AI Visualizer", url: "/create", icon: "Zap", badge: "AI", description: "Generate custom simulations" },
      { title: "Community Gallery", url: "/community", icon: "Images", description: "Browse community creations" },
    ]
  },
  {
    title: "Pricing",
    url: "/pricing",
    icon: "DollarSign"
  },
];
```

### Mobile Navigation

Preserve existing mobile sheet menu pattern. Changes:
- "Explore" as first item with experiment count badge
- "Learn" section collapsed by default, expandable
- "Create" section collapsed by default
- Add quick search at top of mobile menu

### Breadcrumb System

**Location**: `src/shared/blocks/common/breadcrumb-nav.tsx`

```typescript
interface BreadcrumbConfig {
  explore: { label: 'Explore', href: '/explore' };
  // auto-generated from experiment data:
  // Explore > Physics > Newton's Laws
  // Explore > AP Chemistry > Acid-Base pH
}
```

Breadcrumbs shown on:
- `/explore/[slug]` — Explore > {Subject} > {Experiment Title}
- `/ap-prep` — Learn > AP Exam Prep > {Subject}
- `/learn/[slug]` — Learn > {Path Title}
- `/notebook` — Learn > Lab Notebook

NOT shown on: `/`, `/explore`, `/pricing`, `/create`

### Command Palette

Extend existing search (if any) or add `cmd+k` palette:
- Search experiments by name, subject, tag
- Quick navigate to any page
- Filter shortcuts ("AP Physics experiments", "free experiments")

Implementation: Reuse shadcn `command.tsx` (already in UI library).

## 6. Design System Updates

### Subject Color Variables

Add to `src/config/style/theme-education.css`:

```css
:root {
  /* Subject colors — light mode */
  --subject-physics: oklch(0.55 0.18 250);        /* Academic blue */
  --subject-physics-bg: oklch(0.95 0.03 250);
  --subject-chemistry: oklch(0.55 0.18 145);       /* Forest green */
  --subject-chemistry-bg: oklch(0.95 0.03 145);
  --subject-biology: oklch(0.50 0.18 310);         /* Royal purple */
  --subject-biology-bg: oklch(0.95 0.03 310);
  --subject-earth: oklch(0.55 0.15 55);            /* Warm amber */
  --subject-earth-bg: oklch(0.95 0.03 55);

  /* Grade level colors */
  --grade-k5: oklch(0.65 0.15 145);               /* Friendly green */
  --grade-ms: oklch(0.60 0.18 250);               /* Clear blue */
  --grade-hs: oklch(0.55 0.15 35);                /* Warm orange */
  --grade-ap: oklch(0.45 0.18 310);               /* Serious purple */
}

.dark {
  --subject-physics: oklch(0.70 0.15 250);
  --subject-physics-bg: oklch(0.22 0.03 250);
  --subject-chemistry: oklch(0.70 0.15 145);
  --subject-chemistry-bg: oklch(0.22 0.03 145);
  --subject-biology: oklch(0.70 0.15 310);
  --subject-biology-bg: oklch(0.22 0.03 310);
  --subject-earth: oklch(0.70 0.12 55);
  --subject-earth-bg: oklch(0.22 0.03 55);

  --grade-k5: oklch(0.75 0.12 145);
  --grade-ms: oklch(0.75 0.15 250);
  --grade-hs: oklch(0.70 0.12 35);
  --grade-ap: oklch(0.65 0.15 310);
}
```

### Subject Color Utility Map

```typescript
// src/shared/lib/experiments/subject-colors.ts
export const SUBJECT_COLORS = {
  physics: { var: '--subject-physics', bg: '--subject-physics-bg', tw: 'text-[var(--subject-physics)]' },
  chemistry: { var: '--subject-chemistry', bg: '--subject-chemistry-bg', tw: 'text-[var(--subject-chemistry)]' },
  biology: { var: '--subject-biology', bg: '--subject-biology-bg', tw: 'text-[var(--subject-biology)]' },
  earth: { var: '--subject-earth', bg: '--subject-earth-bg', tw: 'text-[var(--subject-earth)]' },
} as const;

// Map PhysicsCategory → subject
export function categoryToSubject(cat: PhysicsCategory): keyof typeof SUBJECT_COLORS {
  switch (cat) {
    case 'mechanics': case 'waves': case 'electricity': case 'modern': case 'thermodynamics':
      return 'physics';
    case 'chemistry': return 'chemistry';
    case 'biology': return 'biology';
    case 'earth': return 'earth';
  }
}
```

### New Component Variants

**DifficultyDots** — visual difficulty indicator:
```typescript
// 1-3 filled dots
interface DifficultyDotsProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}
```

**SubjectBadge** — color-coded subject pill:
```typescript
interface SubjectBadgeProps {
  category: PhysicsCategory;
  size?: 'sm' | 'md';
}
```

**GradeBadge** — grade level indicator:
```typescript
interface GradeBadgeProps {
  gradeLevel: GradeLevel;
}
```

**ProgressRing** — circular SVG progress:
```typescript
interface ProgressRingProps {
  progress: number;  // 0-100
  size: number;      // px
  strokeWidth?: number;
  color?: string;    // CSS variable
}
```

### Animation Patterns

Keep existing `fadeInUp` and `countUp`. Add:

```css
/* Experiment card entrance — staggered grid */
@keyframes cardEnter {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Filter transition */
@keyframes filterSlide {
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 500px; }
}

/* Quest completion burst */
@keyframes questComplete {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

Card grid uses CSS `animation-delay` via inline style: `style={{ animationDelay: `${index * 50}ms` }}`.

## 7. Performance Strategy

### Rendering Strategy

| Route | Strategy | Rationale |
|-------|----------|-----------|
| `/` | ISR (3600s) | Content changes rarely, needs good TTFB for SEO |
| `/explore` | SSG shell + CSR filters | 64 experiments are static data; filtering is client-side |
| `/explore/[slug]` | SSG via `generateStaticParams` | 64 static pages, best possible performance |
| `/ap-prep` | SSG shell + CSR quiz | Questions can be static; quiz state is client |
| `/quests` | SSR (auth-gated) | Needs user progress from DB |
| `/notebook` | CSR | Fully interactive, AI-dependent |
| `/create` | CSR | Existing UPG pattern, no change |
| `/community` | SSR with pagination | Dynamic content, needs fresh data |
| `/learn` | SSG | Learning paths change infrequently |
| `/dashboard` | SSR (auth-gated) | Per-user data |
| `/pricing` | ISR (3600s) | Rarely changes |

### Image/Preview Optimization

- Experiment thumbnails: Generate static OG-style preview images at build time (64 images)
- Format: WebP with AVIF fallback via `next/image`
- Sizes: 400x300 (card), 1200x630 (OG), 200x150 (compact)
- Placeholder: CSS gradient matching subject color (zero CLS)
- Future: Automated screenshot pipeline for HTML experiments

### 3D Rendering

Current approach is correct — keep it:
- `dynamic(() => import(...), { ssr: false })` for all R3F scenes
- Only 4 scenes (Wave 1), rest are HTML iframes
- Add `loading` prop to `dynamic()` with skeleton:

```typescript
const Scene = dynamic(() => import('...'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted aspect-video rounded-xl" />,
});
```

### Bundle Splitting

```
Route-based splits (automatic via Next.js App Router):
├── / — landing chunks
├── /explore — ExperimentBrowser + FilterSidebar
├── /explore/[slug] — ExperimentViewer + R3F scenes (per-experiment dynamic)
├── /ap-prep — quiz engine
├── /quests — quest map + progress
├── /notebook — editor + AI chat
└── /create — UPG generator (existing)

Component-level splits:
├── R3F scenes — 4 separate chunks (already done)
├── recharts — lazy load for ScoreTracker, DataPanel
├── markdown renderer — lazy load for notebook export
└── command palette — lazy load on cmd+k trigger
```

### Key Performance Targets

| Metric | Target | Approach |
|--------|--------|----------|
| LCP `/explore` | <1.2s | SSG shell, no images above fold initially |
| FID `/explore` | <100ms | Filter logic is simple array operations |
| CLS `/explore` | <0.05 | Fixed card dimensions, no layout shift |
| Bundle `/explore` | <80KB gzipped | No heavy deps, just filtering logic |
| Bundle `/explore/[slug]` | <150KB + scene | R3F scene loaded separately |

## 8. Migration Plan

### Phase 0: Foundation (no user-visible changes)

| Action | File(s) | Type |
|--------|---------|------|
| Add subject color CSS variables | `src/config/style/theme-education.css` | MODIFY |
| Create subject-colors utility | `src/shared/lib/experiments/subject-colors.ts` | NEW |
| Add `gradeLevel` field to Experiment type | `src/shared/types/experiment.ts` | MODIFY |
| Add `gradeLevel` to all 64 data files | `src/shared/lib/experiments/data/*.ts` | MODIFY |
| Add registry filter helpers | `src/shared/lib/experiments/registry.ts` | MODIFY |
| Create ExperimentCard component | `src/shared/blocks/explore/ExperimentCard.tsx` | NEW |
| Create DifficultyDots, SubjectBadge, GradeBadge | `src/shared/components/experiments/ui/` | NEW |
| Create ProgressRing | `src/shared/components/experiments/ui/ProgressRing.tsx` | NEW |

### Phase 1: /explore — the new primary entry

| Action | File(s) | Type |
|--------|---------|------|
| Create (explore) layout group | `src/app/[locale]/(explore)/layout.tsx` | NEW |
| Create ExperimentBrowser | `src/shared/blocks/explore/ExperimentBrowser.tsx` | NEW |
| Create FilterSidebar | `src/shared/blocks/explore/FilterSidebar.tsx` | NEW |
| Create ExperimentGrid | `src/shared/blocks/explore/ExperimentGrid.tsx` | NEW |
| Create SearchBar | `src/shared/blocks/explore/SearchBar.tsx` | NEW |
| Create SubjectTabs | `src/shared/blocks/explore/SubjectTabs.tsx` | NEW |
| Create ActiveFilters | `src/shared/blocks/explore/ActiveFilters.tsx` | NEW |
| Create /explore page | `src/app/[locale]/(explore)/explore/page.tsx` | NEW |
| Move experiment detail | `src/app/[locale]/(explore)/explore/[slug]/page.tsx` | MOVE from (landing)/experiments/[slug] |
| Enhance ExperimentClient → ExperimentViewer | `src/shared/blocks/explore/ExperimentViewer.tsx` | NEW (fork of ExperimentClient) |
| Create breadcrumb-nav | `src/shared/blocks/common/breadcrumb-nav.tsx` | NEW |
| Add en/zh translations | `src/config/locale/messages/{en,zh}/explore.json` | NEW |
| Add redirects | `next.config.ts` | MODIFY |

### Phase 2: Landing page pivot

| Action | File(s) | Type |
|--------|---------|------|
| Create ExploreHero | `src/themes/default/blocks/explore-hero.tsx` | NEW |
| Create SubjectGrid | `src/themes/default/blocks/subject-grid.tsx` | NEW |
| Create FeaturedExperiments | `src/themes/default/blocks/featured-experiments.tsx` | NEW |
| Update landing page sections | `src/app/[locale]/(landing)/page.tsx` | MODIFY |
| Update landing i18n | `src/config/locale/messages/{en,zh}/landing.json` | MODIFY |

### Phase 3: Navigation overhaul

| Action | File(s) | Type |
|--------|---------|------|
| Update header nav items | `src/config/locale/messages/{en,zh}/landing.json` (header section) | MODIFY |
| Update header component | `src/themes/default/blocks/header.tsx` | MODIFY (if structural changes needed) |
| Add command palette | `src/shared/blocks/common/command-palette.tsx` | NEW |

### Phase 4: /ap-prep

| Action | File(s) | Type |
|--------|---------|------|
| Create (learn) layout group | `src/app/[locale]/(learn)/layout.tsx` | NEW |
| Create AP question data model | `src/shared/types/ap-prep.ts` | NEW |
| Create AP question data | `src/shared/lib/ap-prep/questions/` | NEW |
| Create APSubjectPicker | `src/shared/blocks/ap-prep/APSubjectPicker.tsx` | NEW |
| Create APPrepPanel | `src/shared/blocks/ap-prep/APPrepPanel.tsx` | NEW |
| Create QuestionCard | `src/shared/blocks/ap-prep/QuestionCard.tsx` | NEW |
| Create ScoreTracker | `src/shared/blocks/ap-prep/ScoreTracker.tsx` | NEW |
| Create /ap-prep page | `src/app/[locale]/(learn)/ap-prep/page.tsx` | NEW |
| Add translations | `src/config/locale/messages/{en,zh}/ap-prep.json` | NEW |

### Phase 5: /quests

| Action | File(s) | Type |
|--------|---------|------|
| Create Quest types | `src/shared/types/quest.ts` | NEW |
| Create quest data | `src/shared/lib/quests/` | NEW |
| Create QuestMap | `src/shared/blocks/quests/QuestMap.tsx` | NEW |
| Create QuestCard | `src/shared/blocks/quests/QuestCard.tsx` | NEW |
| Create /quests page | `src/app/[locale]/(learn)/quests/page.tsx` | NEW |
| Add translations | `src/config/locale/messages/{en,zh}/quests.json` | NEW |

### Phase 6: /notebook

| Action | File(s) | Type |
|--------|---------|------|
| Create Notebook types | `src/shared/types/notebook.ts` | NEW |
| Create NotebookEditor | `src/shared/blocks/notebook/NotebookEditor.tsx` | NEW |
| Create ExperimentContextBar | `src/shared/blocks/notebook/ExperimentContextBar.tsx` | NEW |
| Create AIAssistantPanel | `src/shared/blocks/notebook/AIAssistantPanel.tsx` | NEW (reuse chat blocks) |
| Create /notebook page | `src/app/[locale]/(learn)/notebook/page.tsx` | NEW |
| Create notebook API route | `src/app/api/notebook/` | NEW |
| Add translations | `src/config/locale/messages/{en,zh}/notebook.json` | NEW |

### Phase 7: /create + /community rename

| Action | File(s) | Type |
|--------|---------|------|
| Create (create) layout group | `src/app/[locale]/(create)/layout.tsx` | NEW |
| Move UPG page | `src/app/[locale]/(create)/create/page.tsx` | MOVE from (landing)/(ai)/upg |
| Move gallery → community | `src/app/[locale]/(create)/community/page.tsx` | MOVE from (landing)/gallery |
| Add translations | `src/config/locale/messages/{en,zh}/create.json` | NEW |

### Phase 8: Dashboard enhancement + cleanup

| Action | File(s) | Type |
|--------|---------|------|
| Add experiment progress to dashboard | `src/shared/blocks/dashboard/experiment-progress-panel.tsx` | NEW |
| Add recent experiments panel | `src/shared/blocks/dashboard/recent-experiments-panel.tsx` | NEW |
| Update dashboard page | `src/app/[locale]/(landing)/dashboard/page.tsx` | MODIFY |
| Remove old /experiments route | `src/app/[locale]/(landing)/experiments/` | DELETE (after redirects verified) |
| Update pricing copy | `src/config/locale/messages/{en,zh}/pricing.json` | MODIFY |

### Reuse Summary

| Existing Asset | Reuse Status |
|----------------|-------------|
| `ExperimentClient.tsx` (325 LOC) | FORK → `ExperimentViewer.tsx` (add tabs, breadcrumbs, related) |
| `PaywallGate.tsx` | REUSE as-is |
| `useSimulation.ts` hook | REUSE as-is |
| 5 experiment UI components (DataPanel, FormulaDisplay, etc.) | REUSE as-is |
| 4 R3F scenes | REUSE as-is |
| 64 experiment data files | MODIFY (add gradeLevel field) |
| `registry.ts` | MODIFY (add grade/subject filter helpers) |
| `access.ts` | REUSE as-is |
| Gallery blocks (5 files) | REUSE, move to /community context |
| Learning path blocks (8 files) | REUSE as-is |
| Dashboard blocks (15 files) | REUSE + extend with new panels |
| Chat blocks | REUSE in notebook context |
| All 46 shadcn/ui atoms | REUSE as-is |
| All 24 theme blocks | REUSE (hero/features/pricing need copy changes) |
| All 8 hooks | REUSE as-is |

### New File Count by Phase

| Phase | New Files | Modified | Moved | Deleted |
|-------|-----------|----------|-------|---------|
| 0: Foundation | 5 | 67 (data files + types + CSS) | 0 | 0 |
| 1: /explore | 10 | 1 (next.config) | 1 | 0 |
| 2: Landing | 3 | 3 | 0 | 0 |
| 3: Nav | 1 | 2 | 0 | 0 |
| 4: AP Prep | 6 | 0 | 0 | 0 |
| 5: Quests | 5 | 0 | 0 | 0 |
| 6: Notebook | 5 | 0 | 0 | 0 |
| 7: Create/Community | 2 | 0 | 2 | 0 |
| 8: Dashboard | 3 | 2 | 0 | 2 |
| **Total** | **40** | **75** | **3** | **2** |

### Recommended Execution Order

Phases 0 → 1 → 3 → 2 → 7 → 8 → 4 → 5 → 6

Rationale:
- Phase 0+1 deliver the core value: a proper experiment browser
- Phase 3 updates nav to point users to /explore
- Phase 2 updates the landing page once /explore is live
- Phase 7 is a rename, low risk
- Phase 8 cleans up old routes
- Phases 4-6 are new features, can be built in any order after the foundation

### Type Extension Required

```typescript
// src/shared/types/experiment.ts — additions
export type GradeLevel = 'k5' | 'ms' | 'hs' | 'ap';

export interface Experiment {
  // ... existing fields ...
  gradeLevel: GradeLevel;  // NEW — derived from wave/naming convention
}
```

Mapping rule for 64 experiments:
- `k5-*` → `'k5'`
- `ms-*` → `'ms'`
- Wave 1 (original 4) → `'hs'`
- Wave 2 (AP Physics) → `'ap'`
- Wave 3 (AP Biology) → `'ap'`
- Wave 4 (AP Chemistry) → `'ap'`
- Wave 7 (AP Physics gap-fill) → `'ap'`
