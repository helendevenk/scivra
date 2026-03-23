---
name: frontend-design-final
status: in-progress
created: 2026-03-22T15:10:04Z
updated: 2026-03-22T15:10:04Z
---

# NeonPhysics v2 — Frontend Design Document (Final)

> **Authority**: This document supersedes all previous frontend design drafts (`frontend-architecture-pivot.md`, `2026-03-22-frontend-module-architecture.md`, `2026-03-22-design-system-architecture.md`). All conflicts resolved per CTO Review + Founder Decisions dated 2026-03-22.
>
> **Scope**: Complete frontend blueprint for the experiment-centric pivot. Developers implement from this document only.
>
> **Binding decisions source**: Founder Decisions (8 items) + CTO Review (`2026-03-22-frontend-redesign-cto-review.md`)

## 1. Product Vision

### Platform Positioning

NeonPhysics v2 is an **experiment-centric educational SaaS** for North American high school students. The product pivot repositions the platform from "AI generation tool" (UPG-centric) to "interactive experiment library with AI-powered premium features."

**Product hierarchy (post-pivot):**

1. **Core product**: Curated experiment library (64+ interactive 3D/HTML simulations, curriculum-aligned)
2. **Monetization engine**: AP Prep Mode (30-50 questions per unit, UPG-powered visual explanations)
3. **Engagement layer**: Physics Quest (gamified POE learning), Learning Paths (structured curriculum)
4. **Premium tools**: UPG AI generation (Create Your Own), Lab Notebook AI (experiment report writing)
5. **Community**: Gallery (UGC sharing, fork/remix)

### Target Users

| Segment | Size | Primary Need | Conversion Path |
|---------|------|-------------|-----------------|
| AP Physics students (Grade 11-12) | ~300K/year in NA | AP exam prep + interactive concept review | Free experiments -> paywall hit -> Pro ($4.99) |
| General HS science students (Grade 9-12) | ~5M in NA | Curriculum-aligned interactive labs | Free experiments -> paywall hit -> Pro |
| Science teachers | ~200K in NA | Assign experiments, track student progress | Students bring them in -> institutional licenses (future) |
| Self-learners | Long tail | Curiosity-driven exploration | Free -> UPG interest -> Max ($9.99) |

### Competitive Differentiators vs PhET

| Dimension | PhET | NeonPhysics |
|-----------|------|-------------|
| Content model | 66 physics simulations, static library | 111 experiments (5 subjects) + AI-generated unlimited (UPG) |
| AP alignment | None | Every experiment tagged to AP exam units with weight |
| Progress tracking | No user accounts | Full progress tracking, streak, per-experiment completion |
| Visual quality | 2010s flat UI, Java->HTML5 migration debt | Modern edu-academic design, 3D via R3F + HTML5 |
| Personalization | None | "Continue where you left off," AI recommendations |
| Student creation | PhET Studio (teacher-only, parameter tweaks) | UPG: students describe in natural language -> full simulation |
| Pricing | Free (university-funded) | Freemium: 3 experiments free (lifetime), Pro $4.99/mo |
| Multi-discipline | Physics-dominant (66 of 173 sims) | Physics + Chemistry + Biology + Earth Science + Math |

**Positioning statement**: "NeonPhysics is the first platform where students can explore curriculum-aligned interactive experiments AND create their own simulations using natural language. No coding, no installation, no Java plugins."

## 2. Information Architecture

### Complete Sitemap

```
/                                       Landing page (public)
|
+-- /experiments                        Experiment browser (public)
|   +-- /experiments?subject=physics    Pre-filtered by subject
|   +-- /experiments?ap=ap-physics-1    Pre-filtered by AP exam
|   +-- /experiments/[slug]             Experiment viewer (public, gated after 3)
|
+-- /ap-prep                            AP subject picker (public preview)
|   +-- /ap-prep/[exam]                 AP unit overview
|   +-- /ap-prep/[exam]/[unit]          AP question list
|   +-- /ap-prep/[exam]/[unit]/practice AP practice mode (Pro-gated)
|   +-- /ap-prep/progress               AP progress dashboard (auth-gated)
|
+-- /quests                             Quest map (auth-gated)
|   +-- /quests/[slug]                  Quest play (Pro-gated for advanced)
|
+-- /learn                              Learning paths list (public)
|   +-- /learn/[slug]                   Learning path detail
|   +-- /learn/[slug]/nodes/[idx]       Learning path node
|
+-- /notebooks                          Notebook list (auth-gated)
|   +-- /notebooks/[id]                 Notebook editor (Max-gated)
|
+-- /create                             UPG generator (Max-gated)
|   +-- /create/my                      My creations (auth-gated)
|   +-- /create/view/[id]              View single creation
|
+-- /gallery                            Community gallery (public)
|   +-- /gallery/[id]                   Gallery item detail
|
+-- /dashboard                          User dashboard (auth-gated)
+-- /pricing                            Pricing page (public)
+-- /blog                               Blog (public, existing)
+-- /docs                               Documentation (public, existing)
+-- /settings/*                         User settings (auth-gated, existing)
+-- /sign-in                            Sign in (existing)
+-- /sign-up                            Sign up (existing)
+-- /admin/*                            Admin panel (role-gated, existing)
```

### Layout Group Assignments

```
src/app/[locale]/
├── (landing)/                   Public-facing pages with standard header + footer
│   ├── page.tsx                 /  (landing page)
│   ├── experiments/             /experiments, /experiments/[slug]
│   ├── gallery/                 /gallery, /gallery/[id]
│   ├── pricing/                 /pricing
│   ├── blog/                    /blog (existing)
│   ├── [...slug]/               catch-all CMS pages (existing)
│   ├── dashboard/               /dashboard
│   └── settings/                /settings/* (existing)
│
├── (learn)/                     Learning-focused layout with progress sidebar
│   ├── layout.tsx               Shared: compact header + progress sidebar
│   ├── ap-prep/                 /ap-prep/*  (5 nested routes)
│   ├── quests/                  /quests, /quests/[slug]
│   ├── learn/                   /learn, /learn/[slug], /learn/[slug]/nodes/[idx]
│   └── notebooks/               /notebooks, /notebooks/[id]
│
├── (create)/                    Creation-focused layout with minimal chrome
│   ├── layout.tsx               Minimal header, full-width canvas
│   ├── create/                  /create (UPG generator)
│   │   ├── my/                  /create/my
│   │   └── view/[id]/           /create/view/[id]
│
├── (auth)/                      Auth pages (existing, keep)
├── (admin)/                     Admin panel (existing, keep)
├── (chat)/                      AI chat (existing, keep)
└── (docs)/                      Documentation (existing, keep)
```

**Layout group rationale:**
- `(landing)`: Standard header/footer. Experiments stay here because they ARE the public face. `/dashboard` also stays here since it shares the same header.
- `(learn)`: Distinct layout with progress sidebar. AP Prep, Quests, Learning Paths, and Notebooks all share the "active learning" context where progress visibility matters.
- `(create)`: Minimal chrome, full canvas for UPG generation. Only 3 routes.
- Existing groups `(auth)`, `(admin)`, `(chat)`, `(docs)` are unchanged.

### Navigation Structure

**Desktop header (4 items with dropdowns, per CTO decision):**

```
[Logo: NeonPhysics]  [Experiments v]  [Learn v]  [Create v]  [Pricing]  [ThemeToggle] [SignIn/Avatar]

Experiments dropdown:
  - Browse All Experiments    /experiments
  - Physics                   /experiments?subject=physics
  - Chemistry                 /experiments?subject=chemistry
  - Biology                   /experiments?subject=biology
  - Earth Science             /experiments?subject=earth-science
  - Math                      /experiments?subject=math

Learn dropdown:
  - AP Prep                   /ap-prep
  - Physics Quest             /quests
  - Learning Paths            /learn
  - Lab Notebook              /notebooks

Create dropdown:
  - Create Experiment (UPG)   /create
  - My Creations              /create/my
  - Community Gallery          /gallery
```

**Mobile bottom tab bar (5 tabs):**

```
[Experiments]  [Learn]  [Create]  [Gallery]  [Profile]
     |           |         |          |          |
  /experiments  /learn   /create   /gallery  /dashboard (or /sign-in)
```

**Breadcrumb system:**

All pages below the top-level routes show breadcrumbs. Pattern:

```
Home > Experiments > Simple Pendulum
Home > AP Prep > AP Physics 1 > Unit 3: Kinematics > Practice
Home > Learn > Classical Mechanics > Node 4: Projectile Motion
```

Component: `src/shared/blocks/common/crumb.tsx` (existing, extend with route-aware auto-generation).

## 3. Monetization Model

### Tier Structure

| Tier | Price | Billing | Target |
|------|-------|---------|--------|
| **Free** | $0 | N/A | Trial / casual browsers |
| **Pro** | $4.99/mo | Monthly or $49.99/yr | AP students, regular learners |
| **Max** | $9.99/mo | Monthly or $99.99/yr | Power users, creators, AP + creation |

### Free Tier: 3 Experiments TOTAL (Lifetime)

**This is the single most important conversion mechanic.** Free users get exactly 3 experiment interactions across their entire account lifetime. Not per day, not per week -- TOTAL.

**What counts as "used":**
- Opening an experiment viewer (`/experiments/[slug]`) and interacting with the simulation (any parameter change, any click within the iframe/R3F canvas)
- Merely viewing the experiment browser (`/experiments`) does NOT consume a slot
- Viewing experiment cards, descriptions, and thumbnails is free
- Re-visiting a previously used experiment DOES NOT consume a new slot (the 3 are unique experiments)

**What free users CAN do:**
- Browse the full experiment library (see all cards, descriptions, thumbnails)
- Use 3 unique experiments with no time limit
- View AP Prep subject picker and unit overviews (read-only, no practice questions)
- View Quest map (read-only, cannot start quests)
- View Gallery items
- View Learning Path overviews

**What free users CANNOT do:**
- Interact with more than 3 unique experiments
- Access AP Prep practice questions
- Start Physics Quests
- Use Lab Notebook AI
- Use UPG (Create Your Own)
- Save to collections

### Feature Gate Table

| Feature | Free | Pro ($4.99) | Max ($9.99) |
|---------|------|-------------|-------------|
| Browse experiment library | Full | Full | Full |
| Interact with experiments | 3 total (lifetime) | Unlimited | Unlimited |
| Experiment time limit | None | None | None |
| AP Prep: browse units | Read-only | Full access | Full access |
| AP Prep: practice questions | None | Unlimited | Unlimited |
| AP Prep: UPG visual explanations | None | 5/day | Unlimited |
| AP Prep: progress tracking | None | Full | Full |
| Physics Quest | None | Full access | Full access |
| Quest: weekly competitions | None | Participate | Participate + create |
| Learning Paths | View only | Full + progress | Full + progress |
| Lab Notebook AI | None | None | Full access |
| Lab Notebook: PDF export | None | None | Unlimited |
| UPG Create Your Own | None | None | 20 generations/day |
| Gallery: browse | Full | Full | Full |
| Gallery: publish | None | 5/month | Unlimited |
| Gallery: fork/remix | None | 3/month | Unlimited |
| Save to collections | None | Unlimited | Unlimited |
| AI-powered recommendations | None | Full | Full |
| Dark mode | Yes | Yes | Yes |
| Priority support | None | Email | Email + chat |

### Conversion Funnel Design

```
AWARENESS           ACTIVATION              PAYWALL                 CONVERSION
   |                    |                      |                       |
Landing page  ->  Browse experiments  ->  3rd experiment used  ->  Pricing page
   |                    |                      |                       |
   |            "This is cool, free"    "Limit reached" modal    "$4.99/mo = Pro"
   |                    |                      |                       |
   |           Experiment 1 (free)      Show upgrade CTA          Stripe checkout
   |           Experiment 2 (free)      with experiment count      |
   |           Experiment 3 (free)      "0 of 3 remaining"        Pro activated
   |                    |                      |
   |            [HOOK ESTABLISHED]      PaywallGate component
```

**PaywallGate placement rules:**
1. After 3rd experiment is used: hard gate on `/experiments/[slug]` for any new experiment
2. On AP Prep practice: gate on `/ap-prep/[exam]/[unit]/practice`
3. On Quest start: gate on `/quests/[slug]`
4. On Notebook create: gate on `/notebooks` create action
5. On UPG generate: gate on `/create` generate action

**Counter UI**: A persistent badge in the header shows remaining experiments for free users: `[3/3]` -> `[2/3]` -> `[1/3]` -> `[0/3 - Upgrade]`. This creates urgency without being aggressive.

## 4. Page Designs

### 4.1 Landing Page (`/`)

**Route**: `/`
**Rendering**: ISR (revalidate: 3600s)
**Layout group**: `(landing)`

**7 Sections (per CTO decision, no more):**

```
┌─────────────────────────────────────────────────────────────┐
│ SECTION 1: HERO                                              │
│                                                              │
│ "Explore Science Through Interactive Experiments"            │
│ [subtitle: "80+ simulations aligned to AP Physics,           │
│  Chemistry, Biology, Earth Science, and Math"]               │
│                                                              │
│ ┌────────────────────────────────┐                           │
│ │   Featured Experiment Preview  │  <- autoplay 3s loop      │
│ │   (iframe, muted, no controls)│     of top-rated experiment│
│ └────────────────────────────────┘                           │
│                                                              │
│ [Browse Experiments]  [Start Free — 3 Experiments Included]  │
│                                                              │
│ "Trusted by students at 50+ high schools"                    │
├─────────────────────────────────────────────────────────────┤
│ SECTION 2: TRUST BAR                                         │
│                                                              │
│ [NGSS Aligned]  [AP Physics Ready]  [No Install Required]   │
│ [Works on Chromebook]  [COPPA Compliant]                     │
├─────────────────────────────────────────────────────────────┤
│ SECTION 3: FEATURED EXPERIMENTS                              │
│                                                              │
│ "Start Exploring"                                            │
│                                                              │
│ [Subject tabs: All | Physics | Chemistry | Biology | ...]    │
│                                                              │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                        │
│ │ Card │ │ Card │ │ Card │ │ Card │  <- 4 featured per row  │
│ │ thumb│ │ thumb│ │ thumb│ │ thumb│     6-8 total shown     │
│ │ title│ │ title│ │ title│ │ title│                          │
│ │ badge│ │ badge│ │ badge│ │ badge│                          │
│ └──────┘ └──────┘ └──────┘ └──────┘                        │
│                                                              │
│ [View All 80+ Experiments ->]                                │
├─────────────────────────────────────────────────────────────┤
│ SECTION 4: WHY NEONPHYSICS                                   │
│                                                              │
│ 3-column feature grid:                                       │
│                                                              │
│ [Interactive 3D]        [AP Aligned]       [Create Your Own] │
│ "Manipulate variables   "Every experiment  "Describe any     │
│  in real-time 3D        tagged to AP       physics concept   │
│  simulations"           exam units"        and watch it come │
│                                            to life with AI"  │
├─────────────────────────────────────────────────────────────┤
│ SECTION 5: AP PREP HIGHLIGHT                                 │
│                                                              │
│ "Ace Your AP Physics Exam"                                   │
│                                                              │
│ ┌───────────────────────────────────────────────┐            │
│ │  [AP Physics 1]  [AP Physics 2]  [C-Mech]    │            │
│ │                                                │            │
│ │  "Practice with interactive visual             │            │
│ │   explanations for every question"             │            │
│ │                                                │            │
│ │  [Sample question preview with UPG thumbnail]  │            │
│ └───────────────────────────────────────────────┘            │
│                                                              │
│ [Start AP Prep - Pro]                                        │
├─────────────────────────────────────────────────────────────┤
│ SECTION 6: PRICING PREVIEW                                   │
│                                                              │
│ "Start Free. Upgrade When Ready."                            │
│                                                              │
│ ┌────────┐  ┌────────────┐  ┌────────────┐                  │
│ │  Free  │  │    Pro     │  │    Max     │                  │
│ │  $0    │  │  $4.99/mo  │  │  $9.99/mo  │                  │
│ │ 3 exp  │  │ Unlimited  │  │ Everything │                  │
│ │        │  │ + AP Prep  │  │ + UPG + AI │                  │
│ └────────┘  └────────────┘  └────────────┘                  │
│                                                              │
│ [See Full Pricing ->]                                        │
├─────────────────────────────────────────────────────────────┤
│ SECTION 7: CTA                                               │
│                                                              │
│ "Ready to See Physics in Action?"                            │
│                                                              │
│ [Browse Experiments]  [Create Free Account]                  │
└─────────────────────────────────────────────────────────────┘
```

**Key components:**

| Component | Location | Props |
|-----------|----------|-------|
| `LandingHero` | `src/themes/default/blocks/landing-hero.tsx` (new) | `featuredExperiment: ExperimentMeta` |
| `TrustBar` | `src/themes/default/blocks/trust-bar.tsx` (new) | `items: TrustItem[]` |
| `FeaturedExperiments` | `src/themes/default/blocks/featured-experiments.tsx` (new) | `experiments: ExperimentMeta[], subjects: Subject[]` |
| `WhyNeonPhysics` | `src/themes/default/blocks/why-neonphysics.tsx` (new) | `features: Feature[]` |
| `APPrepHighlight` | `src/themes/default/blocks/ap-prep-highlight.tsx` (new) | `exams: APExamPreview[]` |
| `PricingPreview` | `src/themes/default/blocks/pricing-preview.tsx` (new) | `tiers: PricingTier[]` |
| `LandingCTA` | `src/themes/default/blocks/landing-cta.tsx` (new) | none (static content) |

**Data requirements:**
- Featured experiments: from experiment registry (`featured: true` flag), build-time + ISR
- Experiment count: derived from registry at build time
- AP exam list: static config
- Pricing tiers: from i18n JSON config

**Free/Pro/Max behavior**: Landing page is identical for all tiers. No gating on viewing.

### 4.2 Experiment Browser (`/experiments`)

**Route**: `/experiments`
**Rendering**: SSG shell + CSR filters (hybrid)
**Layout group**: `(landing)`

```
┌─────────────────────────────────────────────────────────────┐
│ [Breadcrumb: Home > Experiments]                             │
│                                                              │
│ "Interactive Science Experiments"                             │
│ [Search bar: "Search experiments..."]                        │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐    │
│ │ [Filter Bar - horizontal, scrollable on mobile]        │    │
│ │ Subject: [All] [Physics] [Chem] [Bio] [Earth] [Math]  │    │
│ │ Level:   [All] [High School] [AP] [Middle School]      │    │
│ │ Topic:   [dynamic based on subject]                    │    │
│ │ Sort:    [Popular] [Newest] [AP Relevance]             │    │
│ └───────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐     │
│ │ [Continue Learning] (auth users only, horizontal scroll)│   │
│ │ ┌──────┐ ┌──────┐ ┌──────┐                            │   │
│ │ │recent│ │recent│ │recent│                            │   │
│ │ └──────┘ └──────┘ └──────┘                            │   │
│ └──────────────────────────────────────────────────────┘     │
│                                                              │
│ "Showing 64 experiments"  [Grid view] [List view]            │
│                                                              │
│ ┌──────┐ ┌──────┐ ┌──────┐                                  │
│ │Thumb │ │Thumb │ │Thumb │  3-col desktop / 2-col tablet /   │
│ │Title │ │Title │ │Title │  1-col mobile                     │
│ │Subj  │ │Subj  │ │Subj  │                                  │
│ │AP tag│ │AP tag│ │AP tag│  Each card: ExperimentCard        │
│ │Diff  │ │Diff  │ │Diff  │                                  │
│ │Free/ │ │Free/ │ │Free/ │                                  │
│ │Pro   │ │Pro   │ │Pro   │                                  │
│ └──────┘ └──────┘ └──────┘                                  │
│ ┌──────┐ ┌──────┐ ┌──────┐                                  │
│ │ ...  │ │ ...  │ │ ...  │                                  │
│ └──────┘ └──────┘ └──────┘                                  │
│                                                              │
│ [Load More] (or infinite scroll for >50 items)               │
└─────────────────────────────────────────────────────────────┘
```

**Key components:**

```typescript
// src/shared/blocks/experiments/ExperimentBrowser.tsx
interface ExperimentBrowserProps {
  initialExperiments: ExperimentMeta[];
  subjects: SubjectDefinition[];
  initialFilters?: FilterState;
}

// src/shared/blocks/experiments/ExperimentCard.tsx
interface ExperimentCardProps {
  experiment: ExperimentMeta;
  userProgress?: ExperimentProgress | null;
  showAPTags?: boolean;
  onNavigate: (slug: string) => void;
}

// src/shared/blocks/experiments/ExperimentFilterBar.tsx
interface ExperimentFilterBarProps {
  subjects: SubjectDefinition[];
  currentFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
}

interface FilterState {
  subject: string | null;       // 'physics' | 'chemistry' | 'biology' | 'earth-science' | 'math'
  level: string | null;         // 'high-school' | 'ap' | 'middle-school'
  topic: string | null;         // dynamic based on subject
  ap: string | null;            // 'ap-physics-1' | 'ap-physics-2' | 'ap-physics-c-mech' | 'ap-physics-c-em'
  unit: string | null;          // AP unit number
  q: string | null;             // search query
  sort: 'popular' | 'newest' | 'ap-relevance';
}
```

**URL param strategy**: All filter state lives in query params. Server Component reads initial params for SSG, client hydrates and manages filter state. URL is always shareable.

**Data requirements:**
- Experiment metadata: from experiment registry files (build-time SSG)
- User progress: client-side fetch from `/api/experiments/progress` (auth users only)
- Search: client-side Fuse.js for <200 items (current 64 well within range)

**Free/Pro/Max behavior:**
- All users browse all experiments with full metadata visible
- Free users see a `[FREE]` or `[PRO]` badge on each card
- When free user has 0 remaining experiments and clicks a new one: PaywallGate modal
- Counter badge in header: `[2/3 free]`

### 4.3 Experiment Viewer (`/experiments/[slug]`)

**Route**: `/experiments/[slug]`
**Rendering**: SSG via `generateStaticParams` (64 pages pre-built)
**Layout group**: `(landing)`

```
┌─────────────────────────────────────────────────────────────┐
│ [Breadcrumb: Home > Experiments > Simple Pendulum]           │
│                                                              │
│ [Back to Experiments]                  [Fullscreen] [Share]  │
│                                                              │
│ ┌─────────────────────────────────┐ ┌────────────────────┐   │
│ │                                 │ │ INFO PANEL         │   │
│ │                                 │ │                    │   │
│ │     EXPERIMENT CANVAS           │ │ Subject: Physics   │   │
│ │     (iframe or R3F)             │ │ Topic: Mechanics   │   │
│ │                                 │ │ Difficulty: ●●○    │   │
│ │     70% width on desktop        │ │ AP: Unit 3, 5      │   │
│ │                                 │ │                    │   │
│ │                                 │ │ [Theory Panel]     │   │
│ │                                 │ │ Key equations,     │   │
│ │                                 │ │ definitions,       │   │
│ │                                 │ │ core concepts      │   │
│ │                                 │ │                    │   │
│ │                                 │ │ [Parameter         │   │
│ │                                 │ │  Controls]         │   │
│ │                                 │ │ Sliders for mass,  │   │
│ │                                 │ │ length, gravity    │   │
│ └─────────────────────────────────┘ └────────────────────┘   │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐    │
│ │ ACTION BAR                                             │    │
│ │ [Autopilot Guide]  [AP Practice Questions]  [Lab Note] │    │
│ │ [Add to Collection] [Fork in UPG] [Report Issue]       │    │
│ └───────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐    │
│ │ RELATED EXPERIMENTS                                    │    │
│ │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │    │
│ │ │ Card │ │ Card │ │ Card │ │ Card │                  │    │
│ │ └──────┘ └──────┘ └──────┘ └──────┘                  │    │
│ └───────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

Mobile layout (stacked):
┌─────────────────────┐
│ [Back] [Title] [More]│
├─────────────────────┤
│                     │
│  EXPERIMENT CANVAS  │
│  (full width)       │
│                     │
├─────────────────────┤
│ [Tabs: Info | Theory│
│  | Controls | AP]   │
├─────────────────────┤
│ Tab content area    │
├─────────────────────┤
│ ACTION BAR (sticky  │
│ bottom)             │
└─────────────────────┘
```

**Key components:**

```typescript
// src/shared/blocks/experiments/ExperimentViewer.tsx
// Enhanced from existing ExperimentClient, NOT a rewrite
interface ExperimentViewerProps {
  experiment: ExperimentMeta;
  userProgress?: ExperimentProgress | null;
  relatedExperiments: ExperimentMeta[];
  isAuthenticated: boolean;
  userTier: 'free' | 'pro' | 'max';
  remainingFreeExperiments: number;
}

// src/shared/blocks/experiments/ExperimentCanvas.tsx
interface ExperimentCanvasProps {
  experiment: ExperimentMeta;
  isFullscreen: boolean;
  onInteraction: () => void; // triggers "used" count for free tier
}

// src/shared/blocks/experiments/ExperimentInfoPanel.tsx
interface ExperimentInfoPanelProps {
  experiment: ExperimentMeta;
  subject: SubjectDefinition;
  apAlignments: APAlignment[];
}

// src/shared/blocks/experiments/ExperimentActionBar.tsx
interface ExperimentActionBarProps {
  experiment: ExperimentMeta;
  userTier: 'free' | 'pro' | 'max';
  hasNotebook: boolean;
  onAutopilot: () => void;
  onAPPrep: () => void;
  onNotebook: () => void;
}
```

**Data requirements:**
- Experiment data: from registry (SSG, build-time)
- User progress: client-fetch `/api/experiments/progress/[slug]`
- Related experiments: computed at build-time from shared subject/topic tags
- Remaining free count: client-fetch `/api/experiments/quota`

**Free/Pro/Max behavior:**

| Action | Free (has remaining) | Free (0 remaining) | Pro | Max |
|--------|---------------------|--------------------|----|-----|
| View experiment | Yes | PaywallGate | Yes | Yes |
| Interact with canvas | Yes (consumes 1 slot) | Blocked | Yes | Yes |
| Theory panel | Yes | Yes (read-only on page) | Yes | Yes |
| Autopilot Guide | No | No | Yes | Yes |
| AP Practice link | View only | View only | Full | Full |
| Lab Notebook | No | No | No | Yes |
| Fork in UPG | No | No | No | Yes |
| Add to Collection | No | No | Yes | Yes |

**Experiment "used" tracking logic:**

```typescript
// Pseudocode for tracking experiment usage
async function trackExperimentInteraction(userId: string, experimentSlug: string) {
  // 1. Check if this experiment was already used by this user
  const existing = await getExperimentProgress(userId, experimentSlug);
  if (existing) return; // revisit, no new slot consumed

  // 2. Check remaining quota
  const usedCount = await countUsedExperiments(userId);
  const tier = await getUserTier(userId);

  if (tier === 'free' && usedCount >= 3) {
    throw new PaywallError('EXPERIMENT_LIMIT_REACHED');
  }

  // 3. Create progress record (marks experiment as "used")
  await createExperimentProgress(userId, experimentSlug);
}
```

### 4.4 AP Prep — Subject Picker (`/ap-prep`)

**Route**: `/ap-prep`
**Rendering**: SSG
**Layout group**: `(learn)`

```
┌─────────────────────────────────────────────────────────────┐
│ [Progress sidebar]  │  MAIN CONTENT                         │
│                     │                                        │
│ AP Physics 1  ●●○   │  "AP Exam Preparation"                │
│ AP Physics 2  ○○○   │  "Interactive practice with visual    │
│ AP Physics C-M ○○○  │   explanations powered by AI"         │
│ AP Physics C-EM ○○○ │                                        │
│                     │  ┌──────────┐ ┌──────────┐            │
│ [My Progress]       │  │AP Phys 1 │ │AP Phys 2 │            │
│ Questions: 45/210   │  │ 7 units  │ │ 7 units  │            │
│ Accuracy: 72%       │  │ 210 Qs   │ │ 180 Qs   │            │
│                     │  │ [Start]  │ │ [Start]  │            │
│                     │  └──────────┘ └──────────┘            │
│                     │  ┌──────────┐ ┌──────────┐            │
│                     │  │AP C-Mech │ │AP C-E&M  │            │
│                     │  │ 5 units  │ │ 5 units  │            │
│                     │  │ 150 Qs   │ │ 150 Qs   │            │
│                     │  │ [Start]  │ │ [Start]  │            │
│                     │  └──────────┘ └──────────┘            │
│                     │                                        │
│                     │  [Pro badge: "Unlimited practice       │
│                     │   + AI visual explanations"]           │
└─────────────────────┘────────────────────────────────────────┘
```

**AP Prep Route Suite:**

| Route | Rendering | Description |
|-------|-----------|-------------|
| `/ap-prep` | SSG | Exam picker with progress summary |
| `/ap-prep/[exam]` | SSG | Unit overview for one exam (e.g., AP Physics 1) |
| `/ap-prep/[exam]/[unit]` | SSG shell + CSR | Question list for one unit |
| `/ap-prep/[exam]/[unit]/practice` | CSR | Interactive practice mode (Pro-gated) |
| `/ap-prep/progress` | SSR (auth-gated) | Full progress dashboard |

**Key components:**

```typescript
// src/shared/blocks/ap-prep/APSubjectPicker.tsx
interface APSubjectPickerProps {
  exams: APExamSummary[];
  userProgress?: APUserProgress;
}

// src/shared/blocks/ap-prep/APUnitOverview.tsx
interface APUnitOverviewProps {
  exam: APExamDetail;
  units: APUnitSummary[];
  userProgress?: APUnitProgress[];
}

// src/shared/blocks/ap-prep/APQuestionList.tsx
interface APQuestionListProps {
  exam: APExamDetail;
  unit: APUnitDetail;
  questions: APQuestionSummary[];
  userAttempts?: APAttemptSummary[];
}

// src/shared/blocks/ap-prep/APPracticeMode.tsx
interface APPracticeModeProps {
  exam: APExamDetail;
  unit: APUnitDetail;
  questions: APQuestion[];
  onAnswer: (questionId: string, answer: string) => Promise<APAttemptResult>;
  onRequestUPG: (questionId: string) => Promise<string>; // returns UPG generation ID
}

// src/shared/blocks/ap-prep/QuestionCard.tsx
interface QuestionCardProps {
  question: APQuestion;
  userAttempt?: APAttempt | null;
  showAnswer: boolean;
  onSubmit: (answer: string) => void;
  onSeeVisualization: () => void; // triggers UPG
}

// src/shared/blocks/ap-prep/APProgressDashboard.tsx
interface APProgressDashboardProps {
  exams: APExamProgress[];
  weakTopics: WeakTopic[];
  recentAttempts: APAttempt[];
}
```

**AP question sourcing**: AI-assisted generation with teacher review. Initial seed: 30 questions per AP Physics 1 unit (210 total). AI generates question stem + 4 choices + explanation + UPG prompt. Teacher reviews and approves. Questions stored in `ap_question` table with `status: 'draft' | 'reviewed' | 'published'`.

**Free/Pro/Max behavior:**
- Free: Browse exam and unit overviews only. Practice locked with PaywallGate.
- Pro: Full access to all practice questions. 5 UPG visual explanations per day.
- Max: Unlimited practice + unlimited UPG explanations.

### 4.5 Physics Quest (`/quests`, `/quests/[slug]`)

**Route**: `/quests`
**Rendering**: SSR (auth-gated, user progress needed)
**Layout group**: `(learn)`

```
Quest Map (/quests):
┌─────────────────────────────────────────────────────────────┐
│ [Progress sidebar]  │  QUEST MAP                            │
│                     │                                        │
│ Quests completed:   │  ┌─────────────────────────────────┐   │
│ 3/12                │  │  MECHANICS QUESTS                │   │
│                     │  │                                  │   │
│ Achievements:       │  │  ●──●──◐──○──○                  │   │
│ 5/20                │  │  1  2  3  4  5                   │   │
│                     │  │  [Newton's Laws] [in progress]   │   │
│ Weekly rank:        │  └─────────────────────────────────┘   │
│ #42                 │  ┌─────────────────────────────────┐   │
│                     │  │  WAVES QUESTS                    │   │
│                     │  │                                  │   │
│                     │  │  ○──○──○──○                      │   │
│                     │  │  [Locked: Complete Mechanics 3]  │   │
│                     │  └─────────────────────────────────┘   │
└─────────────────────┘────────────────────────────────────────┘

Quest Play (/quests/[slug]):
┌─────────────────────────────────────────────────────────────┐
│ [Progress: Step 2/5]  [Timer: 12:34]  [Exit Quest]          │
│                                                              │
│ STEP 2: PREDICT                                              │
│                                                              │
│ "A 2kg ball is dropped from 10m. What will be its           │
│  velocity just before hitting the ground?"                   │
│                                                              │
│ ┌───────────────────────────────────┐                        │
│ │ Your prediction:                   │                        │
│ │ [_________] m/s                    │                        │
│ │                                    │                        │
│ │ Confidence: [Low] [Medium] [High]  │                        │
│ └───────────────────────────────────┘                        │
│                                                              │
│ [Submit Prediction ->]                                       │
└─────────────────────────────────────────────────────────────┘
```

**Key components:**

```typescript
// src/shared/blocks/quests/QuestMap.tsx
interface QuestMapProps {
  questGroups: QuestGroup[];
  userProgress: QuestUserProgress;
  achievements: UserAchievement[];
}

// src/shared/blocks/quests/QuestCard.tsx
interface QuestCardProps {
  quest: Quest;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  unlockRequirement?: string;
}

// src/shared/blocks/quests/QuestPlayer.tsx
interface QuestPlayerProps {
  quest: QuestDetail;
  steps: QuestStep[];
  currentStep: number;
  onStepSubmit: (stepId: string, response: QuestStepResponse) => Promise<StepResult>;
  onComplete: () => Promise<QuestCompletionResult>;
}

// src/shared/blocks/quests/QuestStep.tsx (polymorphic based on step type)
interface QuestStepProps {
  step: QuestStep; // type: 'knowledge' | 'predict' | 'experiment' | 'compare' | 'explain'
  experimentComponent?: React.ReactNode; // embedded Curated Lab for 'experiment' step
  previousPrediction?: string; // for 'compare' step
  onSubmit: (response: QuestStepResponse) => void;
}
```

**Free/Pro/Max behavior:**
- Free: View quest map only. Cannot start quests.
- Pro: Full access to all quests, achievements, weekly competitions.
- Max: Pro + ability to create custom quests (future).

### 4.6 Lab Notebook (`/notebooks`, `/notebooks/[id]`)

**Route**: `/notebooks`
**Rendering**: SSR (auth-gated)
**Layout group**: `(learn)`

```
Notebook List (/notebooks):
┌─────────────────────────────────────────────────────────────┐
│ [Progress sidebar]  │  MY LAB NOTEBOOKS                     │
│                     │                                        │
│                     │  [+ New Notebook]                      │
│                     │                                        │
│                     │  ┌──────────────────────────────────┐  │
│                     │  │ Simple Pendulum Lab Report       │  │
│                     │  │ Created: Mar 20 | 3/5 sections   │  │
│                     │  │ [Edit] [Export PDF]              │  │
│                     │  └──────────────────────────────────┘  │
│                     │  ┌──────────────────────────────────┐  │
│                     │  │ Free Fall Experiment             │  │
│                     │  │ Created: Mar 18 | 5/5 sections   │  │
│                     │  │ [Edit] [Export PDF]              │  │
│                     │  └──────────────────────────────────┘  │
└─────────────────────┘────────────────────────────────────────┘

Notebook Editor (/notebooks/[id]):
┌─────────────────────────────────────────────────────────────┐
│ [Back] "Simple Pendulum Lab Report" [Auto-saved] [Export]    │
│                                                              │
│ ┌─────────────────────────────┐ ┌────────────────────────┐   │
│ │ EDITOR (left, 60%)          │ │ AI ASSISTANT (right)   │   │
│ │                             │ │                        │   │
│ │ ## Hypothesis               │ │ "Based on the Simple   │   │
│ │ [Student writes here]       │ │  Pendulum experiment,  │   │
│ │                             │ │  consider what happens │   │
│ │ ## Method                   │ │  when you change the   │   │
│ │ [AI pre-filled from         │ │  length..."            │   │
│ │  experiment metadata]       │ │                        │   │
│ │                             │ │ [Suggest structure]    │   │
│ │ ## Data                     │ │ [Check my analysis]    │   │
│ │ [AI pre-filled from         │ │ [Improve conclusion]   │   │
│ │  experimentProgress data]   │ │                        │   │
│ │                             │ │ --- Chat ---           │   │
│ │ ## Analysis                 │ │ [Ask AI a question...] │   │
│ │ [Student writes, AI gives   │ │                        │   │
│ │  hints but doesn't write]   │ │                        │   │
│ │                             │ │                        │   │
│ │ ## Conclusion               │ │                        │   │
│ │ [Student writes]            │ │                        │   │
│ └─────────────────────────────┘ └────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Key components:**

```typescript
// src/shared/blocks/notebook/NotebookList.tsx
interface NotebookListProps {
  notebooks: LabNotebook[];
  onCreateNew: (experimentSlug?: string) => void;
}

// src/shared/blocks/notebook/NotebookEditor.tsx
interface NotebookEditorProps {
  notebook: LabNotebookDetail;
  experiment?: ExperimentMeta; // linked experiment
  onSave: (content: NotebookContent) => Promise<void>;
  onExportPDF: () => Promise<Blob>;
}

// src/shared/blocks/notebook/AIAssistantPanel.tsx
interface AIAssistantPanelProps {
  experimentContext: ExperimentMeta;
  currentSection: 'hypothesis' | 'method' | 'data' | 'analysis' | 'conclusion';
  onSuggestion: (text: string) => void;
}
```

**Free/Pro/Max behavior:**
- Free: No access. PaywallGate on `/notebooks`.
- Pro: No access. PaywallGate on `/notebooks`.
- Max: Full access. Unlimited notebooks, AI assistance, PDF export.

### 4.7 UPG Create (`/create`, `/create/my`, `/create/view/[id]`)

**Route**: `/create`
**Rendering**: CSR
**Layout group**: `(create)`

The UPG generator is repositioned from the hero feature to a premium "Create Your Own" tool. The existing `UpgGenerator` component is reused with minimal changes.

```
/create:
┌─────────────────────────────────────────────────────────────┐
│ [Minimal header: Logo + Back + Avatar]                       │
│                                                              │
│ "Create Your Own Experiment"                                 │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐    │
│ │ [Subject selector: Physics | Chemistry | Bio | ...]    │    │
│ │                                                        │    │
│ │ "Describe what you want to explore..."                 │    │
│ │ ┌──────────────────────────────────────────────────┐   │    │
│ │ │                                                  │   │    │
│ │ │  [textarea: large, auto-resize]                  │   │    │
│ │ │                                                  │   │    │
│ │ └──────────────────────────────────────────────────┘   │    │
│ │                                                        │    │
│ │ [Generate Experiment]  "Uses 10 credits"               │    │
│ └───────────────────────────────────────────────────────┘    │
│                                                              │
│ [Result area: UPG HTML visualization appears here]           │
│                                                              │
│ [Publish to Gallery]  [Save to My Creations]  [Share Link]   │
└─────────────────────────────────────────────────────────────┘
```

**Key components**: Existing `UpgGenerator.tsx` + new `DisciplineSelector.tsx` (already created per discipline decoupling spec).

**Data**: Existing UPG API endpoints. No new APIs needed.

**Free/Pro/Max:**
- Free: PaywallGate on generate action
- Pro: PaywallGate on generate action
- Max: 20 generations/day, using existing `upgDailyQuota` table

### 4.8 Gallery (`/gallery`, `/gallery/[id]`)

**Route**: `/gallery`
**Rendering**: SSR (paginated)
**Layout group**: `(landing)`

Existing gallery pages with minor upgrades. Keep current routes (CTO decision: no rename to `/community`).

**Changes from current:**
- Add subject filter badges (using `data-subject` styling)
- Add "Fork in UPG" button (Max only)
- Improve SEO metadata for each gallery item
- Add experiment source attribution ("Created with UPG" or "Curated Lab")

**Key components**: Existing `gallery-list.tsx`, `gallery-card.tsx`. Extend, don't rewrite.

**Free/Pro/Max:**
- Free: Browse and view only
- Pro: Browse + publish 5/month + fork 3/month
- Max: Unlimited publish and fork

### 4.9 Learning Paths (`/learn/*`)

**Route**: `/learn`, `/learn/[slug]`, `/learn/[slug]/nodes/[idx]`
**Rendering**: SSG
**Layout group**: `(learn)`

Existing learning path pages move from `(landing)` to `(learn)` layout group for progress sidebar. Components are reused.

**Changes from current:**
- Move to `(learn)` layout group
- Add subject color theming via `data-subject`
- Add "Related AP Unit" badges
- Add experiment integration (link nodes to experiments)

**Free/Pro/Max:**
- Free: View path overviews only
- Pro: Full access + progress tracking
- Max: Pro + everything

### 4.10 Dashboard (`/dashboard`)

**Route**: `/dashboard`
**Rendering**: SSR (auth-gated)
**Layout group**: `(landing)`

```
┌─────────────────────────────────────────────────────────────┐
│ "Welcome back, [Name]"                                       │
│                                                              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │ Exps     │ │ AP Prep  │ │ Quests   │ │ Streak   │        │
│ │ viewed   │ │ score    │ │ done     │ │ days     │        │
│ │ 12       │ │ 72%      │ │ 3/12     │ │ 7        │        │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                              │
│ ┌──────────────────────────┐ ┌──────────────────────────┐    │
│ │ CONTINUE LEARNING        │ │ RECENT AP PRACTICE       │    │
│ │ ┌──────┐ ┌──────┐       │ │ Unit 3: 8/10 correct     │    │
│ │ │ exp1 │ │ exp2 │       │ │ Unit 5: 6/10 correct     │    │
│ │ └──────┘ └──────┘       │ │ [Continue AP Prep ->]     │    │
│ └──────────────────────────┘ └──────────────────────────┘    │
│                                                              │
│ ┌──────────────────────────┐ ┌──────────────────────────┐    │
│ │ MY NOTEBOOKS             │ │ ACHIEVEMENTS             │    │
│ │ 2 notebooks              │ │ ●●●○○ 3/5 earned        │    │
│ │ [View All ->]            │ │ [View All ->]            │    │
│ └──────────────────────────┘ └──────────────────────────┘    │
│                                                              │
│ [Subscription: Pro]  [Manage Subscription ->]                │
└─────────────────────────────────────────────────────────────┘
```

**Key components**: Enhance existing `DashboardClient.tsx` with new panels:

```typescript
// New panels added to existing dashboard
// src/shared/blocks/dashboard/panels/ExperimentProgressPanel.tsx
// src/shared/blocks/dashboard/panels/APPrepPanel.tsx
// src/shared/blocks/dashboard/panels/QuestProgressPanel.tsx
// src/shared/blocks/dashboard/panels/NotebookPanel.tsx
// src/shared/blocks/dashboard/panels/AchievementPanel.tsx
// src/shared/blocks/dashboard/panels/SubscriptionPanel.tsx
```

**Free users dashboard**: Shows experiment counter (`2/3 used`), upgrade CTA, and limited stats.

### 4.11 Pricing Page (`/pricing`)

**Route**: `/pricing`
**Rendering**: ISR (revalidate: 3600s)
**Layout group**: `(landing)`

```
┌─────────────────────────────────────────────────────────────┐
│ "Choose Your Plan"                                           │
│ "Start free. Upgrade when you're ready."                     │
│                                                              │
│ [Monthly] [Yearly (Save 17%)]                                │
│                                                              │
│ ┌────────────┐  ┌────────────────┐  ┌────────────────┐      │
│ │   FREE     │  │   PRO          │  │   MAX          │      │
│ │   $0       │  │   $4.99/mo     │  │   $9.99/mo     │      │
│ │            │  │   $49.99/yr    │  │   $99.99/yr    │      │
│ │ 3 total    │  │ Unlimited      │  │ Everything     │      │
│ │ experiments│  │ experiments    │  │ in Pro, plus:  │      │
│ │            │  │                │  │                │      │
│ │ ✓ Browse   │  │ ✓ Unlimited   │  │ ✓ UPG Create  │      │
│ │   library  │  │   experiments │  │   (20/day)    │      │
│ │ ✓ 3 exps   │  │ ✓ AP Prep    │  │ ✓ Lab         │      │
│ │ ✓ Gallery  │  │   (full)     │  │   Notebook AI │      │
│ │   viewing  │  │ ✓ Physics    │  │ ✓ Unlimited   │      │
│ │            │  │   Quest      │  │   gallery     │      │
│ │            │  │ ✓ Learning   │  │   publish     │      │
│ │            │  │   Paths      │  │ ✓ Priority    │      │
│ │            │  │ ✓ Save to    │  │   support     │      │
│ │            │  │   collections│  │                │      │
│ │            │  │ ✓ 5 UPG      │  │                │      │
│ │            │  │   visuals/day│  │                │      │
│ │            │  │   (AP Prep)  │  │                │      │
│ │            │  │              │  │                │      │
│ │ [Sign Up]  │  │ [Start Pro]  │  │ [Start Max]   │      │
│ │  Free      │  │              │  │               │      │
│ └────────────┘  └────────────────┘  └────────────────┘      │
│                                                              │
│ FAQ Section (expandable):                                    │
│ - What counts as a "used" experiment?                        │
│ - Can I switch plans?                                        │
│ - Is there a student discount?                               │
│ - What payment methods do you accept?                        │
│ - Can I cancel anytime?                                      │
└─────────────────────────────────────────────────────────────┘
```

**Key components**: Modify existing `pricing.tsx` theme block. Add FAQ section using existing `faq.tsx`.

### 4.12 Settings (Updates to Existing)

**Route**: `/settings/*`
**Layout group**: `(landing)` (existing)

**Changes needed:**
- Add "Subscription" section showing current tier, usage stats, upgrade/downgrade
- Add "Experiment History" section showing which 3 experiments were used (free) or full history (Pro/Max)
- Add "Data Export" for GDPR (existing, verify it includes new tables)
- Dark mode preference toggle in Appearance settings

## 5. Design System

### Color Palette

**Primary palette (unchanged from `theme-education.css`):**

```css
:root {
  --primary:            oklch(0.50 0.20 250);   /* Academic Blue */
  --primary-foreground: oklch(1 0 0);
  --accent:             oklch(0.40 0.15 35);    /* Academic Gold */
  --accent-foreground:  oklch(1 0 0);
  --background:         oklch(0.98 0.005 250);
  --foreground:         oklch(0.20 0.03 250);
}
```

**Subject colors (NEW, added to `theme-neonphysics.css`):**

```css
:root {
  /* Subject identity colors — canonical definitions */
  --subject-physics:       oklch(0.55 0.18 250);   /* Academic Blue, hue 250 */
  --subject-chemistry:     oklch(0.55 0.18 145);   /* Forest Green, hue 145 */
  --subject-biology:       oklch(0.65 0.15 80);    /* Amber Gold, hue 80 */
  --subject-earth:         oklch(0.55 0.15 25);    /* Terracotta, hue 25 */
  --subject-math:          oklch(0.55 0.18 310);   /* Violet, hue 310 */

  /* Subject background tints */
  --subject-physics-bg:    oklch(0.95 0.03 250);
  --subject-chemistry-bg:  oklch(0.95 0.03 145);
  --subject-biology-bg:    oklch(0.95 0.03 80);
  --subject-earth-bg:      oklch(0.95 0.03 25);
  --subject-math-bg:       oklch(0.95 0.03 310);
}

.dark {
  --subject-physics:       oklch(0.70 0.15 250);
  --subject-chemistry:     oklch(0.70 0.15 145);
  --subject-biology:       oklch(0.70 0.12 80);
  --subject-earth:         oklch(0.70 0.12 25);
  --subject-math:          oklch(0.70 0.15 310);

  --subject-physics-bg:    oklch(0.22 0.03 250);
  --subject-chemistry-bg:  oklch(0.22 0.03 145);
  --subject-biology-bg:    oklch(0.22 0.03 80);
  --subject-earth-bg:      oklch(0.22 0.03 25);
  --subject-math-bg:       oklch(0.22 0.03 310);
}
```

**Semantic colors (NEW):**

```css
:root {
  --success:    oklch(0.60 0.15 145);
  --success-bg: oklch(0.95 0.03 145);
  --warning:    oklch(0.70 0.15 80);
  --warning-bg: oklch(0.95 0.03 80);
  --error:      oklch(0.55 0.20 25);
  --error-bg:   oklch(0.95 0.03 25);
  --info:       oklch(0.55 0.18 250);
  --info-bg:    oklch(0.95 0.03 250);
}
```

**Subject-contextual styling pattern:**

```html
<!-- Server-rendered data attribute on parent container -->
<div data-subject="physics">
  <!-- All children inherit subject color via CSS -->
  <span class="np-subject-badge">Physics</span>
  <div class="np-card">...</div>
</div>
```

```css
[data-subject="physics"]   { --subject: var(--subject-physics);   --subject-bg: var(--subject-physics-bg); }
[data-subject="chemistry"] { --subject: var(--subject-chemistry); --subject-bg: var(--subject-chemistry-bg); }
[data-subject="biology"]   { --subject: var(--subject-biology);   --subject-bg: var(--subject-biology-bg); }
[data-subject="earth"]     { --subject: var(--subject-earth);     --subject-bg: var(--subject-earth-bg); }
[data-subject="math"]      { --subject: var(--subject-math);      --subject-bg: var(--subject-math-bg); }

/* Components reference --subject for contextual coloring */
.np-subject-badge  { background: var(--subject); color: white; }
.np-card[data-subject] { border-top: 3px solid var(--subject); }
.np-progress-fill  { background: var(--subject); }
```

### Typography Scale

**Fonts (confirmed, no change):**

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Headings | Merriweather (serif) | 700 | h1-h4, stat values, brand |
| Body | Noto Sans (sans-serif) | 400, 500, 600 | Paragraph text, UI labels, buttons |
| Code/Data | JetBrains Mono | 400 | Code blocks, formulas, data readouts |

**Type scale (fluid, using clamp):**

```css
:root {
  --text-xs:   0.75rem;    /* 12px - footnotes, labels */
  --text-sm:   0.875rem;   /* 14px - secondary text, badges */
  --text-base: 1rem;       /* 16px - body text */
  --text-lg:   1.125rem;   /* 18px - emphasized body */
  --text-xl:   1.25rem;    /* 20px - section headers */
  --text-2xl:  1.5rem;     /* 24px - page subtitles */
  --text-3xl:  clamp(1.5rem, 2vw + 1rem, 2rem);    /* 24-32px - page titles */
  --text-4xl:  clamp(2rem, 3vw + 1rem, 2.5rem);    /* 32-40px - hero titles */
  --text-5xl:  clamp(2.5rem, 4vw + 1rem, 3.5rem);  /* 40-56px - landing hero */
}
```

**A/B test plan (post-launch)**: Test Inter (400, 500, 600, 700) as heading+body replacement. Metrics: bounce rate, session duration, scroll depth on landing page. Requires `next/font` swap -- zero CSS changes since fonts are via `--font-heading` and `--font-body` variables.

### Component Catalog

**CSS prefix migration**: `.edu-*` -> `.np-*`. Keep `.edu-*` as deprecated aliases for 30 days.

```css
/* Deprecated aliases — remove after 2026-04-22 */
.edu-heading    { @extend .np-heading; }
.edu-card       { @extend .np-card; }
/* ... etc for all .edu-* classes */
```

In practice (since Tailwind v4 doesn't use @extend), create aliases via duplicate selectors:

```css
.np-heading, .edu-heading { /* styles */ }
.np-card, .edu-card { /* styles */ }
```

**Core component catalog:**

| Component | CSS Class | Purpose | Location |
|-----------|-----------|---------|----------|
| `SubjectBadge` | `.np-subject-badge` | Subject color pill badge | `shared/blocks/common/subject-badge.tsx` (new) |
| `DifficultyDots` | `.np-difficulty` | 1-3 filled dots for difficulty | `shared/blocks/common/difficulty-dots.tsx` (new) |
| `ExperimentCard` | `.np-card` | Experiment thumbnail card | `shared/blocks/experiments/ExperimentCard.tsx` (new) |
| `APBadge` | `.np-ap-badge` | AP exam alignment badge | `shared/blocks/common/ap-badge.tsx` (new) |
| `ProgressRing` | `.np-progress-ring` | Circular progress indicator | `shared/blocks/common/progress-ring.tsx` (new) |
| `ProgressBar` | `.np-progress` | Linear progress bar (subject-colored) | Extend existing `.edu-progress` |
| `TierBadge` | `.np-tier-badge` | Free/Pro/Max badge on cards | `shared/blocks/common/tier-badge.tsx` (new) |
| `PaywallGate` | existing | Modal overlay for tier gating | `shared/blocks/experiments/PaywallGate.tsx` (enhance) |
| `QuotaCounter` | `.np-quota` | "2/3 experiments" header badge | `shared/blocks/common/quota-counter.tsx` (new) |
| `StatCard` | `.np-stat-card` | Dashboard stat display | Rename from `.edu-stat-card` |
| `EmptyState` | `.np-empty` | Empty state with illustration | `shared/blocks/common/empty-state.tsx` (new) |
| `LoadingSkeleton` | `.np-skeleton` | Content placeholder during load | `shared/blocks/common/loading-skeleton.tsx` (new) |

**Card variants:**

```typescript
// Base card (all cards inherit from this)
interface BaseCardProps {
  children: React.ReactNode;
  subject?: Subject;  // applies data-subject for color
  className?: string;
}

// Experiment card
interface ExperimentCardProps extends BaseCardProps {
  experiment: ExperimentMeta;
  progress?: ExperimentProgress;
  showAPTags?: boolean;
  tierBadge?: 'free' | 'pro';
}

// Quest card
interface QuestCardProps extends BaseCardProps {
  quest: Quest;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
}

// AP Exam card
interface APExamCardProps extends BaseCardProps {
  exam: APExamSummary;
  progress?: APExamProgress;
}

// Notebook card
interface NotebookCardProps extends BaseCardProps {
  notebook: LabNotebook;
  completionPercent: number;
}
```

### Dark Mode Approach

**Implementation**: Toggle in header, NOT default. Light mode is the system default.

```typescript
// Dark mode state stored in:
// 1. localStorage ('theme' key) for persistence
// 2. Cookie for SSR hydration match
// 3. <html class="dark"> for CSS cascade

// Existing ThemeProvider at src/core/theme/ handles this.
// Only change: ensure new subject colors have .dark variants (already defined above).
```

**What changes in dark mode:**
- Background: `oklch(0.98 ...)` -> `oklch(0.15 ...)`
- Cards: white -> `oklch(0.20 ...)`
- Subject colors: slightly brighter/lighter for contrast
- Shadows: removed (use border instead)
- Images/thumbnails: no change

**What does NOT change:**
- Font choices
- Layout
- Component structure
- Subject color hues (only lightness/chroma adjust)

## 6. Navigation Design

### Desktop Header Structure

```typescript
// src/themes/default/blocks/header.tsx (modify existing)
// Navigation items config:

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Experiments',
    href: '/experiments',
    children: [
      { label: 'Browse All', href: '/experiments' },
      { label: 'Physics', href: '/experiments?subject=physics', icon: 'atom' },
      { label: 'Chemistry', href: '/experiments?subject=chemistry', icon: 'flask' },
      { label: 'Biology', href: '/experiments?subject=biology', icon: 'leaf' },
      { label: 'Earth Science', href: '/experiments?subject=earth-science', icon: 'globe' },
      { label: 'Math', href: '/experiments?subject=math', icon: 'calculator' },
    ],
  },
  {
    label: 'Learn',
    href: '/learn',
    children: [
      { label: 'AP Prep', href: '/ap-prep', badge: 'Popular' },
      { label: 'Physics Quest', href: '/quests' },
      { label: 'Learning Paths', href: '/learn' },
      { label: 'Lab Notebook', href: '/notebooks', badge: 'Max' },
    ],
  },
  {
    label: 'Create',
    href: '/create',
    children: [
      { label: 'Create Experiment', href: '/create', badge: 'Max' },
      { label: 'My Creations', href: '/create/my' },
      { label: 'Community Gallery', href: '/gallery' },
    ],
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
];
```

**Header layout:**

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]  [Experiments v] [Learn v] [Create v] [Pricing]      │
│                              [QuotaCounter] [Theme] [User]  │
└─────────────────────────────────────────────────────────────┘
```

The existing `header.tsx` already supports `NavigationMenu` with dropdowns. Modification is config-only, not structural.

### Mobile Bottom Tab Bar

```typescript
// src/shared/blocks/common/mobile-tab-bar.tsx (new)

interface MobileTabBarProps {
  currentPath: string;
}

const MOBILE_TABS = [
  { label: 'Explore', href: '/experiments', icon: 'compass' },
  { label: 'Learn', href: '/learn', icon: 'book-open' },
  { label: 'Create', href: '/create', icon: 'plus-circle' },
  { label: 'Gallery', href: '/gallery', icon: 'image' },
  { label: 'Me', href: '/dashboard', icon: 'user', authRequired: true },
];
```

Rendered in `(landing)/layout.tsx` only on mobile (`md:hidden`), fixed to bottom. Uses `usePathname()` for active state.

### Breadcrumb System

Extend existing `src/shared/blocks/common/crumb.tsx`:

```typescript
// Route-to-breadcrumb mapping
const BREADCRUMB_MAP: Record<string, BreadcrumbConfig> = {
  '/experiments': { label: 'Experiments' },
  '/experiments/[slug]': { label: ':title', parent: '/experiments' },
  '/ap-prep': { label: 'AP Prep' },
  '/ap-prep/[exam]': { label: ':examTitle', parent: '/ap-prep' },
  '/ap-prep/[exam]/[unit]': { label: ':unitTitle', parent: '/ap-prep/[exam]' },
  '/ap-prep/[exam]/[unit]/practice': { label: 'Practice', parent: '/ap-prep/[exam]/[unit]' },
  '/quests': { label: 'Physics Quest' },
  '/quests/[slug]': { label: ':questTitle', parent: '/quests' },
  '/learn': { label: 'Learning Paths' },
  '/learn/[slug]': { label: ':pathTitle', parent: '/learn' },
  '/notebooks': { label: 'Lab Notebooks' },
  '/notebooks/[id]': { label: ':notebookTitle', parent: '/notebooks' },
  '/create': { label: 'Create' },
  '/create/my': { label: 'My Creations', parent: '/create' },
  '/gallery': { label: 'Gallery' },
  '/gallery/[id]': { label: ':itemTitle', parent: '/gallery' },
};
```

## 7. State Management

### AppContext Additions

Per CTO decision: no new React Context EXCEPT `experimentProgress` in existing AppContext.

```typescript
// src/shared/hooks/use-app-context.ts (extend existing)
interface AppContextState {
  // existing fields...
  user: User | null;
  theme: 'light' | 'dark';

  // NEW: experiment progress for free tier tracking
  experimentProgress: {
    usedExperiments: string[];   // slugs of experiments already used
    remainingFree: number;       // 3 - usedExperiments.length (for free tier)
    tier: 'free' | 'pro' | 'max';
  };
}
```

**Why in AppContext (not page-scoped):**
- The quota counter in the header needs this data globally
- PaywallGate can appear on any experiment page and needs to check remaining count
- The counter updates when an experiment is used and must reflect immediately across all pages

### URL Param Patterns

All filtering and temporary state lives in URL params, not React state:

| Page | URL Params | Example |
|------|------------|---------|
| `/experiments` | `subject`, `level`, `topic`, `ap`, `unit`, `q`, `sort` | `/experiments?subject=physics&ap=ap-physics-1&sort=popular` |
| `/ap-prep/[exam]/[unit]` | `difficulty`, `status` | `/ap-prep/ap-physics-1/unit-3?difficulty=hard&status=unanswered` |
| `/gallery` | `tag`, `sort`, `subject` | `/gallery?subject=physics&sort=newest` |
| `/experiments/[slug]` | `fullscreen` | `/experiments/simple-pendulum?fullscreen=true` |

**Implementation**: Use `useSearchParams()` from `next/navigation` for reading. Use `router.replace()` for updating (no history pollution). Server Components read params from `searchParams` prop.

### Cross-Page Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Experiment       │────>│ experimentProgress│────>│ Dashboard        │
│ Viewer           │     │ (API + AppContext)│     │ (panels)         │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                        │
        │                        v                        │
        │               ┌──────────────────┐              │
        └──────────────>│ Lab Notebook     │<─────────────┘
                        │ (pre-fills data) │
                        └──────────────────┘
                                 │
                                 v
                        ┌──────────────────┐
                        │ AP Prep          │
                        │ (links to exps)  │
                        └──────────────────┘
```

Data flows through APIs, not Context. Context only holds the quota/progress cache that multiple components need simultaneously.

## 8. Performance Targets

### Per-Page Targets

| Page | LCP | FID | CLS | Bundle (page JS) | Rendering |
|------|-----|-----|-----|-------------------|-----------|
| `/` (landing) | <1.2s | <50ms | <0.05 | <60KB | ISR |
| `/experiments` | <1.5s | <50ms | <0.05 | <80KB | SSG+CSR |
| `/experiments/[slug]` | <2.0s | <100ms | <0.1 | <120KB (with 3D) | SSG |
| `/ap-prep` | <1.0s | <50ms | <0.05 | <40KB | SSG |
| `/ap-prep/.../practice` | <1.5s | <100ms | <0.05 | <80KB | CSR |
| `/quests` | <1.5s | <100ms | <0.05 | <60KB | SSR |
| `/quests/[slug]` | <2.0s | <100ms | <0.1 | <120KB (with exp) | CSR |
| `/notebooks/[id]` | <2.0s | <100ms | <0.05 | <100KB | CSR |
| `/create` | <2.0s | <100ms | <0.05 | <100KB | CSR |
| `/gallery` | <1.5s | <50ms | <0.05 | <50KB | SSR |
| `/dashboard` | <1.5s | <100ms | <0.05 | <60KB | SSR |
| `/pricing` | <1.0s | <50ms | <0.05 | <30KB | ISR |

### Bundle Strategy

```
Route-based code splitting (automatic with Next.js App Router):

shared chunk (~40KB):
  - shadcn/ui atoms (Button, Card, Badge, etc.)
  - utils, hooks
  - i18n runtime

experiments chunk (~80KB):
  - ExperimentBrowser, ExperimentCard, FilterBar
  - Fuse.js (search)

experiment-viewer chunk (~120KB):
  - ExperimentViewer, ExperimentCanvas
  - R3F (only for R3F experiments, dynamic import)

ap-prep chunk (~60KB):
  - APSubjectPicker, QuestionCard, APPracticeMode

quest chunk (~60KB):
  - QuestMap, QuestPlayer, QuestStep

notebook chunk (~80KB):
  - NotebookEditor, AIAssistantPanel
  - @react-pdf/renderer (dynamic import on export)

create chunk (~80KB):
  - UpgGenerator (existing)
  - DisciplineSelector
```

### Image Optimization

- Experiment thumbnails: WebP, 400x300 for cards, 800x600 for featured
- Generated via static export of experiment first frame (build-time script)
- Lazy loading: `<Image loading="lazy">` for below-fold experiment cards
- Priority loading: `<Image priority>` for hero featured experiment only
- Blur placeholder: auto-generated LQIP (low-quality image placeholder)

### 3D Lazy Loading

```typescript
// Only 4 experiments use R3F. Dynamic import with explicit loading state.
const R3FExperiment = dynamic(
  () => import('@/shared/blocks/experiments/R3FCanvas'),
  {
    loading: () => <ExperimentSkeleton type="3d" />,
    ssr: false,
  }
);

// Hardware detection for graceful degradation
function useCanRender3D(): boolean {
  const [can3D, setCan3D] = useState(true);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const cores = navigator.hardwareConcurrency || 2;
    setCan3D(!!gl && cores >= 2);
  }, []);
  return can3D;
}
```

## 9. SEO Strategy

### Meta Tags Per Page Type

```typescript
// src/shared/lib/seo.ts (new utility)

interface PageSEO {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType: 'website' | 'article';
  structuredData?: Record<string, unknown>;
}

const SEO_TEMPLATES: Record<string, (params: unknown) => PageSEO> = {
  landing: () => ({
    title: 'NeonPhysics — Interactive Science Experiments for High School',
    description: 'Explore 110+ interactive experiments in Physics, Chemistry, Biology, Earth Science, and Math. AP-aligned, 3D simulations, no installation required.',
    canonical: 'https://neonphysics.com',
    ogType: 'website',
  }),

  experimentBrowser: (filters) => ({
    title: `Science Experiments${filters.subject ? ` — ${filters.subject}` : ''} | NeonPhysics`,
    description: `Browse interactive ${filters.subject || 'science'} experiments aligned to AP curriculum. Filter by subject, topic, and difficulty.`,
    canonical: `https://neonphysics.com/experiments${filters.queryString}`,
    ogType: 'website',
  }),

  experimentViewer: (exp) => ({
    title: `${exp.title} — Interactive Experiment | NeonPhysics`,
    description: exp.description.slice(0, 160),
    canonical: `https://neonphysics.com/experiments/${exp.slug}`,
    ogImage: `https://neonphysics.com/experiments/thumbnails/${exp.slug}.webp`,
    ogType: 'article',
  }),

  apPrep: (exam) => ({
    title: `${exam?.title || 'AP Exam'} Prep — Practice with Interactive Simulations | NeonPhysics`,
    description: `Prepare for ${exam?.title || 'AP Physics'} with interactive practice questions and AI-powered visual explanations.`,
    canonical: `https://neonphysics.com/ap-prep${exam ? `/${exam.slug}` : ''}`,
    ogType: 'website',
  }),

  gallery: () => ({
    title: 'Student-Created Experiments Gallery | NeonPhysics',
    description: 'Browse experiments created by students using the UPG AI generator. Fork, remix, and share.',
    canonical: 'https://neonphysics.com/gallery',
    ogType: 'website',
  }),
};
```

### Structured Data (JSON-LD)

```typescript
// Landing page — Organization
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "NeonPhysics",
  "url": "https://neonphysics.com",
  "description": "Interactive science experiments platform for high school students",
  "sameAs": ["https://twitter.com/neonphysics"]
}

// Experiment pages — LearningResource
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "Simple Pendulum",
  "description": "Interactive simulation of a simple pendulum...",
  "educationalLevel": "High School",
  "educationalAlignment": {
    "@type": "AlignmentObject",
    "alignmentType": "teaches",
    "educationalFramework": "NGSS",
    "targetName": "HS-PS2-1"
  },
  "interactivityType": "active",
  "learningResourceType": "simulation"
}

// AP Prep pages — Course
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "AP Physics 1 Preparation",
  "provider": { "@type": "Organization", "name": "NeonPhysics" },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online"
  }
}

// Pricing page — Product with offers
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "NeonPhysics Pro",
  "offers": {
    "@type": "Offer",
    "price": "4.99",
    "priceCurrency": "USD",
    "billingPeriod": "P1M"
  }
}
```

### Sitemap Updates

```typescript
// next-sitemap.config.js additions
const experimentSlugs = getAllExperimentSlugs(); // from registry
const apExamSlugs = ['ap-physics-1', 'ap-physics-2', 'ap-physics-c-mech', 'ap-physics-c-em'];

const additionalPaths = [
  // Experiments (high priority)
  ...experimentSlugs.map(slug => ({
    loc: `/experiments/${slug}`,
    changefreq: 'weekly',
    priority: 0.8,
  })),
  // Experiment browser
  { loc: '/experiments', changefreq: 'daily', priority: 0.9 },
  // AP Prep
  { loc: '/ap-prep', changefreq: 'weekly', priority: 0.8 },
  ...apExamSlugs.map(slug => ({
    loc: `/ap-prep/${slug}`,
    changefreq: 'weekly',
    priority: 0.7,
  })),
  // Gallery (SSR pages, let search engines discover)
  { loc: '/gallery', changefreq: 'daily', priority: 0.6 },
  // Learning paths
  { loc: '/learn', changefreq: 'weekly', priority: 0.7 },
  // Pricing
  { loc: '/pricing', changefreq: 'monthly', priority: 0.5 },
];
```

### 301 Redirect Map

```typescript
// next.config.ts
async redirects() {
  return [
    // UPG routes -> Create
    { source: '/upg', destination: '/create', permanent: true },
    { source: '/upg/my', destination: '/create/my', permanent: true },
    { source: '/upg/view/:id', destination: '/create/view/:id', permanent: true },
    // i18n variants
    { source: '/zh/upg', destination: '/zh/create', permanent: true },
    { source: '/zh/upg/my', destination: '/zh/create/my', permanent: true },
    { source: '/zh/upg/view/:id', destination: '/zh/create/view/:id', permanent: true },
    // Note: /experiments stays as-is (no rename), no redirect needed
    // Note: /gallery stays as-is (no rename), no redirect needed
  ];
}
```

## 10. Accessibility

### WCAG AA Targets

| Criterion | Target | Implementation |
|-----------|--------|---------------|
| 1.1.1 Non-text Content | AA | Alt text on all experiment thumbnails, ARIA labels on icons |
| 1.3.1 Info and Relationships | AA | Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>` with `aria-label` |
| 1.4.3 Contrast | AA | All text 4.5:1, large text 3:1. Subject colors verified for both light/dark |
| 1.4.11 Non-text Contrast | AA | UI components and graphics 3:1 against background |
| 2.1.1 Keyboard | AA | Full keyboard navigation for all interactive elements |
| 2.4.1 Skip Links | AA | "Skip to main content" link on every page |
| 2.4.7 Focus Visible | AA | Visible focus ring (`outline: 2px solid var(--ring)`) on all focusable elements |
| 4.1.2 Name, Role, Value | AA | ARIA attributes on custom components (progress bars, modals, tabs) |

### Keyboard Navigation

```
TAB order per page:
1. Skip link
2. Logo (home link)
3. Nav items (left to right, Enter to open dropdown, Escape to close)
4. Theme toggle
5. Sign in / avatar
6. Main content (top to bottom)
7. Experiment cards (grid: arrow keys for navigation within grid)
8. Pagination / Load More
9. Footer links

Special patterns:
- Experiment Viewer: Tab into iframe/R3F canvas. Escape to exit canvas and return to page nav.
- AP Practice: Tab through question options. Enter to select. Tab to Submit.
- Quest Player: Step-by-step, Tab between input fields within a step.
- Modal (PaywallGate): Focus trapped within modal. Escape to close.
```

### Screen Reader for 3D Experiments

```typescript
// For iframe-based experiments (majority):
<div role="region" aria-label={`Interactive experiment: ${experiment.title}`}>
  <iframe
    title={experiment.title}
    aria-describedby={`exp-desc-${experiment.slug}`}
  />
  <div id={`exp-desc-${experiment.slug}`} className="sr-only">
    {experiment.accessibilityDescription}
    {/* e.g., "A pendulum swings back and forth. Use the slider to change the
        pendulum length from 0.5m to 3m and observe how the period changes." */}
  </div>
</div>

// For R3F experiments:
// Canvas is inherently inaccessible. Provide a text description panel that
// updates as the simulation state changes.
<div role="status" aria-live="polite" className="sr-only">
  {`Current state: pendulum angle ${angle.toFixed(1)} degrees,
    velocity ${velocity.toFixed(2)} m/s`}
</div>
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all animations */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Experiment thumbnails: show static image instead of GIF */
  .np-card-thumbnail[data-animated] {
    content: attr(data-static-src);
  }

  /* Quest achievement animations: instant */
  .np-achievement-toast {
    animation: none;
    opacity: 1;
  }
}
```

**3D experiments with reduced motion**: Disable auto-rotation, reduce particle effects, pause any ambient animations. User can still interact manually.

## Appendix A: File Change Summary

### New Files

| File | Type | Sprint |
|------|------|--------|
| `src/config/style/theme-neonphysics.css` | Theme (renamed from `theme-education.css`) | 0 |
| `src/shared/blocks/experiments/ExperimentBrowser.tsx` | Component | 2 |
| `src/shared/blocks/experiments/ExperimentCard.tsx` | Component | 2 |
| `src/shared/blocks/experiments/ExperimentViewer.tsx` | Component | 2 |
| `src/shared/blocks/experiments/ExperimentCanvas.tsx` | Component | 2 |
| `src/shared/blocks/experiments/ExperimentInfoPanel.tsx` | Component | 2 |
| `src/shared/blocks/experiments/ExperimentFilterBar.tsx` | Component | 2 |
| `src/shared/blocks/experiments/ExperimentActionBar.tsx` | Component | 2 |
| `src/shared/blocks/ap-prep/APSubjectPicker.tsx` | Component | 4 |
| `src/shared/blocks/ap-prep/APUnitOverview.tsx` | Component | 4 |
| `src/shared/blocks/ap-prep/APQuestionList.tsx` | Component | 4 |
| `src/shared/blocks/ap-prep/APPracticeMode.tsx` | Component | 4 |
| `src/shared/blocks/ap-prep/QuestionCard.tsx` | Component | 4 |
| `src/shared/blocks/ap-prep/APProgressDashboard.tsx` | Component | 4 |
| `src/shared/blocks/quests/QuestMap.tsx` | Component | 6 |
| `src/shared/blocks/quests/QuestCard.tsx` | Component | 6 |
| `src/shared/blocks/quests/QuestPlayer.tsx` | Component | 6 |
| `src/shared/blocks/quests/QuestStep.tsx` | Component | 6 |
| `src/shared/blocks/notebook/NotebookList.tsx` | Component | 7 |
| `src/shared/blocks/notebook/NotebookEditor.tsx` | Component | 7 |
| `src/shared/blocks/notebook/AIAssistantPanel.tsx` | Component | 7 |
| `src/shared/blocks/common/subject-badge.tsx` | Component | 0 |
| `src/shared/blocks/common/difficulty-dots.tsx` | Component | 0 |
| `src/shared/blocks/common/ap-badge.tsx` | Component | 0 |
| `src/shared/blocks/common/progress-ring.tsx` | Component | 0 |
| `src/shared/blocks/common/tier-badge.tsx` | Component | 0 |
| `src/shared/blocks/common/quota-counter.tsx` | Component | 1 |
| `src/shared/blocks/common/empty-state.tsx` | Component | 0 |
| `src/shared/blocks/common/loading-skeleton.tsx` | Component | 0 |
| `src/shared/blocks/common/mobile-tab-bar.tsx` | Component | 1 |
| `src/shared/blocks/dashboard/panels/*.tsx` | Components (6) | 3 |
| `src/themes/default/blocks/landing-hero.tsx` | Landing block | 1 |
| `src/themes/default/blocks/trust-bar.tsx` | Landing block | 1 |
| `src/themes/default/blocks/featured-experiments.tsx` | Landing block | 1 |
| `src/themes/default/blocks/why-neonphysics.tsx` | Landing block | 1 |
| `src/themes/default/blocks/ap-prep-highlight.tsx` | Landing block | 1 |
| `src/themes/default/blocks/pricing-preview.tsx` | Landing block | 1 |
| `src/themes/default/blocks/landing-cta.tsx` | Landing block | 1 |
| `src/shared/lib/seo.ts` | Utility | 1 |
| `src/app/[locale]/(learn)/layout.tsx` | Layout | 1 |
| `src/app/[locale]/(create)/layout.tsx` | Layout | 5 |
| `src/app/[locale]/(learn)/ap-prep/**` | Pages (5) | 4 |
| `src/app/[locale]/(learn)/quests/**` | Pages (2) | 6 |
| `src/app/[locale]/(learn)/notebooks/**` | Pages (2) | 7 |
| `src/app/[locale]/(create)/create/**` | Pages (3) | 5 |

### Modified Files

| File | Change | Sprint |
|------|--------|--------|
| `src/config/style/theme-education.css` | Rename to `theme-neonphysics.css`, add subject colors, add `.np-*` classes with `.edu-*` aliases | 0 |
| `src/themes/default/blocks/header.tsx` | Update nav config to 4 items with dropdowns, add QuotaCounter | 1 |
| `src/themes/default/blocks/pricing.tsx` | Update to 3-tier Free/Pro/Max | 1 |
| `src/app/[locale]/(landing)/page.tsx` | New landing page with 7 sections | 1 |
| `src/app/[locale]/(landing)/experiments/page.tsx` | Integrate ExperimentBrowser | 2 |
| `src/app/[locale]/(landing)/experiments/[slug]/page.tsx` | Integrate ExperimentViewer | 2 |
| `src/app/[locale]/(landing)/gallery/page.tsx` | Add subject filters, data-subject styling | 3 |
| `src/app/[locale]/(landing)/dashboard/page.tsx` | Add new dashboard panels | 3 |
| `src/shared/blocks/experiments/PaywallGate.tsx` | Enhance for 3-experiment lifetime model | 2 |
| `src/shared/blocks/dashboard/dashboard-client.tsx` | Add experiment/AP/quest/notebook panels | 3 |
| `src/shared/hooks/use-app-context.ts` | Add `experimentProgress` to AppContext | 2 |
| `src/config/db/schema.ts` | Add AP, Quest, Notebook tables (14 tables) | Pre-sprint |
| `next.config.ts` | Add redirects for `/upg` -> `/create` | 0 |

### Deleted Files

None. No existing files are removed. Old routes redirect, not delete.

## Appendix B: Implementation Timeline

| Sprint | Weeks | Content | Key Deliverables |
|--------|-------|---------|-----------------|
| **0** | Week 1 | Design system foundation | `.np-*` migration, subject colors, theme rename, common components (SubjectBadge, DifficultyDots, etc.), `(learn)` and `(create)` layout shells |
| **1** | Week 2-3 | Navigation + Landing + Pricing | New header nav, mobile tab bar, 7-section landing page, 3-tier pricing page, QuotaCounter |
| **2** | Week 4-5 | Experiment Browser + Viewer | ExperimentBrowser, ExperimentCard, ExperimentViewer, FilterBar, free tier gating (3 lifetime), PaywallGate enhancement |
| **3** | Week 6-7 | Dashboard + Gallery + Learn upgrade | Dashboard panels, gallery subject filters, learning paths move to `(learn)`, SEO improvements |
| **4** | Week 8-11 | AP Prep Mode (full) | 5 routes, 6 components, AP question API, UPG integration, progress dashboard. Content: seed 210 questions for AP Physics 1 |
| **5** | Week 12-13 | UPG repositioning + polish + testing | Move UPG to `/create`, redirects, E2E tests, performance audit, bug fixes |
| -- | -- | **MVP LAUNCH** | P0 + P1 complete |
| **6** | Week 14-17 | Physics Quest | Quest map, quest player, 5 step types, achievements, weekly competition |
| **7** | Week 18-20 | Lab Notebook AI | Notebook editor, AI assistant, PDF export, version history |

**Total to MVP: 13 weeks. Total to full platform: 20 weeks.**

Content work (AP questions, quest definitions) runs in parallel with dev starting Week 4.

## Appendix C: Error States and Fallback UI

| Error Scenario | Component | Behavior |
|---------------|-----------|----------|
| Experiment iframe fails to load | `ExperimentCanvas` | Show retry button + "This experiment is having trouble loading. Try refreshing." + link to report issue |
| WebGL not supported (Chromebook) | `ExperimentCanvas` | Show static screenshot + "Your browser doesn't support 3D. Try Chrome or Edge." |
| API down (AP questions) | `APPracticeMode` | Show cached questions if available, otherwise "Practice questions are temporarily unavailable. Try again in a few minutes." |
| Network slow (3G) | All pages | Loading skeletons for all data-dependent sections. `<Suspense fallback={<LoadingSkeleton />}>` |
| PaywallGate on free limit | `PaywallGate` | "You've explored all 3 free experiments. Upgrade to Pro for unlimited access." + pricing link |
| Auth required but not logged in | Middleware redirect | Redirect to `/sign-in?redirect=/original-path` |
| 404 experiment slug | `experiments/[slug]/page.tsx` | `notFound()` -> custom 404 with "Experiment not found. Browse all experiments." |
| UPG generation fails | `UpgGenerator` | "Generation failed. Your credits were not charged. Try again or simplify your description." |
| Notebook save fails | `NotebookEditor` | Auto-retry 3x with exponential backoff. If still fails: "Changes could not be saved. Your work is preserved locally. Try again." |

## Appendix D: Analytics Events

| Event | Page | Properties | Purpose |
|-------|------|------------|---------|
| `experiment_card_click` | `/experiments` | `slug, subject, source` | Track discovery patterns |
| `experiment_start` | `/experiments/[slug]` | `slug, subject, tier, isNew` | Track experiment usage |
| `experiment_interaction` | `/experiments/[slug]` | `slug, interactionType, duration` | Track engagement depth |
| `paywall_hit` | Any gated page | `page, tier, experimentsUsed` | Track conversion moments |
| `paywall_cta_click` | PaywallGate | `targetTier, source` | Track conversion intent |
| `ap_question_answered` | `/ap-prep/.../practice` | `examSlug, unitSlug, correct, timeSpent` | Track AP engagement |
| `ap_upg_requested` | `/ap-prep/.../practice` | `questionId, examSlug` | Track UPG demand in AP |
| `quest_started` | `/quests/[slug]` | `questSlug, subject` | Track quest engagement |
| `quest_completed` | `/quests/[slug]` | `questSlug, score, timeSpent` | Track quest success |
| `notebook_created` | `/notebooks` | `linkedExperiment, subject` | Track notebook adoption |
| `notebook_exported` | `/notebooks/[id]` | `format, sections` | Track PDF value |
| `upg_generated` | `/create` | `subject, promptLength, success` | Track creation usage |
| `search_query` | `/experiments` | `query, resultsCount, subject` | Track search demand |
| `filter_applied` | `/experiments` | `filterType, filterValue` | Track browsing patterns |
| `dark_mode_toggle` | Any | `newMode` | Track preference |
| `signup_started` | `/sign-up` | `source, referrer` | Track acquisition |
| `subscription_started` | `/pricing` | `tier, billing` | Track revenue |

Use existing analytics extension (`src/extensions/analytics/`). Define event schema as TypeScript union type for type safety.
