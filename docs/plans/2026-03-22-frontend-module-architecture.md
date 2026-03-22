---
name: frontend-module-architecture
status: backlog
created: 2026-03-22T14:52:57Z
updated: 2026-03-22T14:52:57Z
---

# NeonPhysics v2 -- Frontend Business Module Architecture

> **Product Pivot**: Curated Experiment Library is the primary product. UPG demoted to premium "Create Your Own" feature.
> **Target**: North American high school students (AP Physics 30万/year), expanding to full K12.
> **Competitive position**: 3D interactive x AP exam prep x individual subscription = unoccupied market intersection.
> **Codebase baseline**: Next.js 16 App Router, 38 DB tables, 64 runnable experiments, full auth + payment stack.

## Priority Matrix

| Priority | Module | Why this priority | Dev Days |
|----------|--------|-------------------|----------|
| **P0** | Landing Page | First impression, conversion | 3d |
| **P0** | Experiment Explorer | New primary entry, replaces UPG as hero | 5d |
| **P0** | Experiment Viewer | Core value delivery page | 4d |
| **P0** | Navigation System | Glue for everything | 2d |
| **P0** | Pricing Page | Revenue gate | 2d |
| **P1** | User Dashboard | Retention anchor, post-login home | 3d |
| **P1** | AP Prep Mode | Strongest monetization signal (AP season) | 20d |
| **P1** | Learning Paths | Structured curriculum, retention driver | 3d (upgrade) |
| **P1** | Community Gallery | SEO engine, social proof, UGC flywheel | 2d (upgrade) |
| **P2** | Physics Quest | Gamification, long-term engagement | 16d |
| **P2** | Lab Notebook AI | AP report writing, high complexity | 14d |
| **P2** | Create Your Own / UPG | Premium AI generation, existing | 2d (reposition) |

**P0 Total**: 16 days (launch-blocking)
**P1 Total**: 28 days (strong recommendation for v1.0)
**P2 Total**: 32 days (post-launch iteration)

## Dependency Graph

```
Navigation System ─────────────────────────────────────────┐
       │                                                    │
Landing Page ──→ Experiment Explorer ──→ Experiment Viewer  │
       │              │                      │    │         │
       │              │                      │    ├──→ Physics Quest
       │              │                      │    ├──→ Lab Notebook AI
       │              │                      │    └──→ AP Prep Mode
       │              │                      │
       │              └──→ Learning Paths ───┘
       │                                     │
       ├──→ Pricing Page                     │
       │                                     │
       └──→ User Dashboard ──→ Community Gallery
                                     │
                              Create Your Own / UPG
```

Key dependency chain:
1. Navigation System must be designed first (information architecture)
2. Experiment Explorer depends on experiment data model being finalized
3. AP Prep / Quest / Notebook all depend on Experiment Viewer being solid
4. UPG repositioning depends on new navigation placing it correctly

## Module 1: Experiment Explorer

### Positioning

The new front door of NeonPhysics. Replaces UPG generator as the hero experience. Students land here to browse, filter, and discover experiments aligned to their curriculum. This is what PhET does well (organized simulation library) -- we must match that baseline then exceed it with AI-powered recommendations and AP alignment tags.

### Priority: P0

Without a browsable experiment library, there is no product -- just a collection of disconnected pages.

### User Stories

| # | As a... | I want to... | So that... | Acceptance Criteria |
|---|---------|-------------|-----------|-------------------|
| E1 | HS student | browse experiments by subject and topic | I find the one my teacher mentioned | Filter by subject (Physics/Chem/Bio), topic (Mechanics/E&M/Waves...), grade level (HS/AP), search by keyword |
| E2 | AP Physics student | see which experiments align to my AP unit | I can study efficiently | Each experiment card shows AP alignment badges (AP1 Unit 3, AP2 Unit 5...) |
| E3 | first-time visitor | immediately understand what this platform does | I decide to stay or leave | Hero section shows 3-second autoplay preview of a featured experiment, no login required |
| E4 | returning student | see "Continue where you left off" | I don't waste time searching again | Progress-aware section showing recently viewed + in-progress experiments |
| E5 | teacher | share a filtered experiment list link with my class | my students go directly to the right experiments | URL reflects all filter state (query params), shareable |

### Core Pages and Routes

```
/experiments                          ← Main explorer (filterable grid)
/experiments?subject=physics          ← Pre-filtered by subject
/experiments?subject=physics&topic=mechanics  ← Pre-filtered by topic
/experiments?ap=ap-physics-1&unit=3   ← AP-specific filter
/experiments?q=pendulum               ← Search
```

Single route, all state in query params. No nested routes needed. Server Component for initial load (SEO), client-side filtering for interactivity.

### Page Layout

```
┌─────────────────────────────────────────────────────────┐
│ [Hero Banner] Featured experiment with autoplay preview  │
│ "Explore 80+ Interactive Science Experiments"            │
│ [Search bar with placeholder: "Try 'simple harmonic'"]   │
├─────────────────────────────────────────────────────────┤
│ [Filter Bar]                                             │
│ Subject: [All] [Physics] [Chemistry] [Biology]           │
│ Level:   [All] [High School] [AP] [Middle School]        │
│ Topic:   [Dynamic based on subject selection]            │
│ Sort:    [Popular] [Newest] [AP Relevance]               │
├─────────────────────────────────────────────────────────┤
│ [Continue Learning] ← only for authenticated users       │
│ ┌──────┐ ┌──────┐ ┌──────┐                              │
│ │ exp1 │ │ exp2 │ │ exp3 │  ← horizontal scroll         │
│ └──────┘ └──────┘ └──────┘                              │
├─────────────────────────────────────────────────────────┤
│ [Experiment Grid] ← responsive: 3col desktop, 2 tablet,  │
│ ┌──────┐ ┌──────┐ ┌──────┐  1 mobile                    │
│ │      │ │      │ │      │                               │
│ │ Card │ │ Card │ │ Card │  Each card:                   │
│ │      │ │      │ │      │  - Thumbnail (static or GIF)  │
│ └──────┘ └──────┘ └──────┘  - Title + 1-line description │
│ ┌──────┐ ┌──────┐ ┌──────┐  - Subject badge              │
│ │      │ │      │ │      │  - AP alignment tag            │
│ │ Card │ │ Card │ │ Card │  - Difficulty indicator        │
│ │      │ │      │ │      │  - Free/Pro badge              │
│ └──────┘ └──────┘ └──────┘                               │
│                                                          │
│ [Load More] or infinite scroll                           │
└─────────────────────────────────────────────────────────┘
```

### Data Requirements

| Data | Source | Caching |
|------|--------|---------|
| Experiment metadata (title, description, subject, topic, AP tags, difficulty, thumbnail) | `experiments` data files + DB | ISR 1 hour |
| User progress (last viewed, completion %) | `experimentProgress` table | Client fetch, no cache |
| Featured experiments | Admin-curated `featured` flag | ISR 1 hour |
| Filter options (subjects, topics, AP units) | Static config derived from experiment data | Build-time |
| Search index | Experiment titles + descriptions + tags | Client-side fuzzy search (Fuse.js) for <200 items, server for scale |

### Interaction with Other Modules

| Module | Relationship |
|--------|-------------|
| Experiment Viewer | Click card -> navigate to `/experiments/[slug]` |
| Learning Paths | "Part of Learning Path: Classical Mechanics" badge on cards |
| AP Prep Mode | AP alignment tags link to AP Prep filtered view |
| User Dashboard | "Continue Learning" section data feeds from Dashboard |
| Navigation | Primary nav item, first position |

### Free vs Pro Feature Gate

| Feature | Free | Pro |
|---------|------|-----|
| Browse all experiments | Yes | Yes |
| View experiment thumbnails and descriptions | Yes | Yes |
| Run experiments | 4 experiments/day, 5 min each | Unlimited |
| AP alignment tags visible | Yes | Yes |
| "Continue Learning" section | Yes | Yes |
| Advanced filters (AP unit specific) | No | Yes |
| Save experiments to collections | No | Yes |

### What Makes It Better Than PhET

1. **AP Alignment**: Every experiment tagged to specific AP exam units with weight indicators -- PhET has no AP-specific organization
2. **Progress Awareness**: "Continue where you left off" -- PhET has no user accounts or progress tracking
3. **Modern UI**: Edu-academic design with thumbnail previews vs PhET's text-heavy list from 2010
4. **AI Recommendations**: "Students who viewed this also explored..." -- PhET has no personalization
5. **Multi-discipline in one place**: Physics + Chemistry + Biology -- PhET is physics-dominant

## Module 2: Experiment Viewer

### Positioning

The core value delivery page. Where learning actually happens. A student clicks an experiment card and lands here. This page must deliver the "aha moment" -- the 3D interactive visualization that makes a physics concept click. Everything else (AP prep, quest, notebook) branches from this page.

### Priority: P0

This is the product. If this page isn't excellent, nothing else matters.

### User Stories

| # | As a... | I want to... | So that... | Acceptance Criteria |
|---|---------|-------------|-----------|-------------------|
| V1 | student | interact with the 3D visualization by adjusting parameters | I see how changing variables affects the physics | Sliders/controls respond in real-time, visualization updates smoothly at 30+ fps |
| V2 | student | read a brief explanation of the physics concept | I understand what I'm looking at before interacting | Theory panel with key equations, definitions, and context (collapsible) |
| V3 | student | see guided steps when I don't know what to do | I'm not lost staring at a simulation | Physics Autopilot button triggers AI-guided walkthrough |
| V4 | AP student | jump from this experiment to related AP practice questions | I can test my understanding immediately | "Practice AP Questions" CTA links to AP Prep filtered to this concept |
| V5 | student | take notes while experimenting | I remember what I observed | Lab Notebook AI drawer slides out from the right |

### Core Pages and Routes

```
/experiments/[slug]                   ← Experiment viewer (main)
/experiments/[slug]?fullscreen=true   ← Fullscreen mode (hides all chrome)
/embed/[id]                           ← Embeddable iframe (existing, for LMS integration)
```

### Page Layout

```
┌─────────────────────────────────────────────────────────┐
│ [Breadcrumb] Experiments > Physics > Mechanics > SHM     │
│ [Title] Simple Harmonic Motion                           │
│ [Tags] AP Physics 1 · Unit 6 · Difficulty: Medium        │
├──────────────────────────────┬──────────────────────────┤
│                              │                          │
│                              │  [Theory Panel]          │
│   [3D Visualization]        │  Key Concept:             │
│   (iframe sandbox or R3F)   │  F = -kx                 │
│                              │  Period: T = 2π√(m/k)    │
│   [Parameter Controls]      │                          │
│   Mass: ───●───── 2.0 kg    │  [Guided Steps]          │
│   Spring k: ──●── 50 N/m    │  1. Set mass to 1 kg     │
│   Damping: ●───── 0.0       │  2. Observe the motion   │
│                              │  3. Now double the mass  │
│   [▶ Play] [⏸ Pause] [↺]   │  4. What changed?        │
│                              │                          │
├──────────────────────────────┴──────────────────────────┤
│ [Action Bar]                                             │
│ [🔬 AP Questions] [📓 Lab Notebook] [🎯 Quest] [⚡ UPG] │
│ [⛶ Fullscreen] [📤 Share] [❤ Like]                      │
├─────────────────────────────────────────────────────────┤
│ [Related Experiments]                                    │
│ ┌──────┐ ┌──────┐ ┌──────┐                              │
│ │Pendul│ │Spring│ │Waves │  ← Same topic, horizontal    │
│ └──────┘ └──────┘ └──────┘                              │
└─────────────────────────────────────────────────────────┘
```

Desktop: 60/40 split (visualization left, theory right).
Tablet: Full-width visualization, theory collapses to bottom accordion.
Mobile: Full-width visualization, theory in bottom sheet, controls in floating panel.

### Data Requirements

| Data | Source |
|------|--------|
| Experiment metadata + config | Experiment data file (static import or DB) |
| HTML/R3F visualization code | DB `upgGeneration.htmlContent` or static R3F component |
| Theory text + equations | Experiment metadata (i18n) |
| Guided steps | Autopilot session config or experiment metadata |
| User progress for this experiment | `experimentProgress` table |
| Related experiments | Same-topic query from experiment metadata |
| AP question count for this concept | `ap_question` table (count only) |

### Interaction with Other Modules

| Module | Integration Point |
|--------|------------------|
| Experiment Explorer | Back navigation, breadcrumb |
| AP Prep Mode | "Practice AP Questions" button -> `/ap-prep?experiment=[slug]` |
| Physics Quest | "Start Quest" button if this experiment is part of a Quest |
| Lab Notebook AI | Side drawer triggered from action bar |
| Physics Autopilot | Overlay triggered from "Guide Me" button |
| Community Gallery | "Like" and "Share" actions |
| Create Your Own / UPG | "Remix with AI" button -> UPG with this experiment as seed |

### Free vs Pro Feature Gate

| Feature | Free | Pro |
|---------|------|-----|
| View and interact with experiment | 4/day, 5 min each | Unlimited |
| Theory panel | Yes | Yes |
| Parameter controls | Basic (2-3 sliders) | All parameters |
| Physics Autopilot | First 3 guided steps | Full walkthrough |
| Fullscreen mode | Yes | Yes |
| Share link | Yes | Yes |
| Like experiment | Login required | Yes |
| Lab Notebook integration | 2 notebooks/month | Unlimited |
| AP Questions link | See 2 free questions | Full access |

### What Makes It Better Than PhET

1. **Integrated learning flow**: Theory + Visualization + Practice Questions on one page. PhET only has the simulation.
2. **AI-guided exploration**: Autopilot tells students what to do. PhET leaves students to figure it out alone.
3. **Action bar branching**: From one experiment, students can AP prep, take notes, start quests. PhET is a dead end.
4. **Modern responsive design**: Works beautifully on phones and tablets. PhET's mobile experience is poor.
5. **Visual polish**: Edu-academic theme with smooth animations vs PhET's Java-era aesthetics.

## Module 3: AP Prep Mode

### Positioning

The monetization engine. 300,000 AP Physics students/year with a 3-5 month intense study window (Jan-May). This module transforms NeonPhysics from "cool toy" to "must-have study tool." The killer feature: every AP question comes with an AI-generated interactive visualization that explains the physics, not just a text solution.

### Priority: P1

Strongest revenue signal. Technical design already CTO-approved. Build immediately after P0 launch foundation.

### User Stories

| # | As a... | I want to... | So that... | Acceptance Criteria |
|---|---------|-------------|-----------|-------------------|
| A1 | AP Physics 1 student | select my exam and see questions organized by unit | I can focus on my weak areas | Exam selector -> Unit list -> Question list, all filterable |
| A2 | AP student | answer a question and see if I'm right | I learn from my mistakes | Submit -> instant grading + text explanation |
| A3 | AP student | click "See It in Action" to see the physics visualized | I deeply understand WHY the answer is what it is | UPG visualization loads (cached or generated), interactive, explains the concept |
| A4 | AP student | see my progress dashboard | I know which units I've mastered and which need work | Per-unit accuracy %, total questions attempted, weak topic recommendations |
| A5 | AP teacher | share a practice set with my class | my students practice the right topics | Shareable link with pre-selected exam + units |

### Core Pages and Routes

```
/ap-prep                              ← Exam type selector (AP Physics 1/2/C-Mech/C-E&M)
/ap-prep/[exam-slug]                  ← Unit overview for selected exam
/ap-prep/[exam-slug]/[unit-slug]      ← Question list for a unit
/ap-prep/[exam-slug]/[unit-slug]/practice  ← Practice mode (sequential questions)
/ap-prep/progress                     ← User progress dashboard
```

### Page Layout: Practice Mode

```
┌─────────────────────────────────────────────────────────┐
│ [Progress Bar] Question 3 of 15 · Unit 3: Circular Motion│
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [Question]                                               │
│ A 0.5 kg ball on a string of length 1.2 m is swung      │
│ in a vertical circle. What is the minimum speed at       │
│ the top of the circle for the string to remain taut?     │
│                                                          │
│ ○ A) 2.4 m/s                                            │
│ ○ B) 3.4 m/s                                            │
│ ● C) 3.8 m/s                                            │
│ ○ D) 4.9 m/s                                            │
│                                                          │
│ [Submit Answer]                                          │
├─────────────────────────────────────────────────────────┤
│ [After Submit: Explanation Panel]                        │
│                                                          │
│ ✅ Correct! At the top of the circle, the minimum       │
│ speed occurs when the only centripetal force is           │
│ gravity: mg = mv²/r, so v = √(gr) = √(9.8×1.2)        │
│ = 3.43 ≈ 3.4 m/s                                       │
│                                                          │
│ [⚡ See It in Action]  ← triggers UPG visualization     │
│                                                          │
│ ┌─────────────────────────────────────────────┐         │
│ │ [UPG Visualization: Vertical Circular Motion]│         │
│ │  Interactive: adjust mass, radius, speed     │         │
│ │  Highlights the "critical point" at top      │         │
│ └─────────────────────────────────────────────┘         │
│                                                          │
│ [Next Question →]                                        │
└─────────────────────────────────────────────────────────┘
```

### Data Requirements

| Data | Source | Notes |
|------|--------|-------|
| Exam types | `ap_exam` table | 4 exams: AP Physics 1/2/C-Mech/C-E&M |
| Units per exam | `ap_unit` table | ~7-10 units per exam |
| Questions | `ap_question` table | ~30-50 per unit initially |
| User attempts | `ap_attempt` table | Per-question answer history |
| User progress | `ap_user_progress` table | Aggregated per-unit stats |
| UPG visualization (cached) | `ap_question.upgCacheId` -> `upgGeneration` | Pre-generated or on-demand |

### Interaction with Other Modules

| Module | Relationship |
|--------|-------------|
| Experiment Viewer | "See related experiment" links back to Viewer |
| UPG / Create Your Own | "See It in Action" uses UPG generation pipeline |
| User Dashboard | AP progress widget on dashboard |
| Learning Paths | AP units map to learning path nodes (future) |
| Credit System | UPG visualization in AP Prep consumes credits |

### Free vs Pro Feature Gate

| Feature | Free | Pro ($4.99/mo) |
|---------|------|----------------|
| Browse exam types and units | Yes | Yes |
| Practice questions | 5 questions/day | Unlimited |
| Text explanations | Yes | Yes |
| "See It in Action" UPG visualization | 1/day | Unlimited (uses credits) |
| Progress dashboard | Basic (total only) | Full (per-unit breakdown, weak areas) |
| Question difficulty filter | No | Yes |
| Practice set sharing | No | Yes |

### Risk: College Board Copyright

Questions must be original, inspired by AP curriculum framework (public document) but NOT copied from actual AP exams. All questions will include a disclaimer: "These are practice questions aligned to AP curriculum standards. They are not endorsed by or affiliated with College Board."

## Module 4: Physics Quest

### Positioning

Gamified learning using the POE (Predict-Observe-Explain) pedagogical model. Students predict what will happen, run the experiment, compare with their prediction, and explain the difference. This is the "sticky" feature -- the one that keeps students coming back daily. Where AP Prep is exam-driven motivation, Quest is curiosity-driven motivation.

### Priority: P2

High engagement potential but depends on solid Experiment Viewer and substantial content library. Build after AP Prep proves the content model works.

### User Stories

| # | As a... | I want to... | So that... | Acceptance Criteria |
|---|---------|-------------|-----------|-------------------|
| Q1 | student | see a quest map showing available challenges | I know what's available and what I've completed | Visual map or list with locked/unlocked/completed states |
| Q2 | student | predict what will happen before running the experiment | I engage my brain before passively watching | Prediction input (numeric or multiple choice) before experiment unlocks |
| Q3 | student | compare my prediction with the actual result | I understand where my mental model was wrong | Side-by-side or overlay comparison with % deviation |
| Q4 | student | earn achievement badges for completing quests | I feel motivated to continue | Badge popup on completion, visible on profile |
| Q5 | student | see a weekly leaderboard | I'm motivated by friendly competition | Anonymized leaderboard (first name + last initial), weekly reset |

### Core Pages and Routes

```
/quest                                ← Quest map/list (browse available quests)
/quest/[slug]                         ← Quest detail + play (5-step POE flow)
/quest/achievements                   ← Achievement wall (all badges)
/quest/leaderboard                    ← Weekly leaderboard
```

### Data Requirements

| Data | Source |
|------|--------|
| Quest definitions + steps | `quest` + `quest_step` tables |
| User attempt data | `quest_attempt` + `quest_step_response` tables |
| Achievements | `achievement` + `user_achievement` tables |
| Leaderboard | Redis sorted set (weekly TTL) |
| Embedded experiment | Links to Experiment Viewer component |

### Interaction with Other Modules

| Module | Relationship |
|--------|-------------|
| Experiment Viewer | Quest Step 3 (Observe) embeds the experiment viewer component directly |
| Experiment Explorer | Quests appear as badges on experiment cards ("Has Quest") |
| User Dashboard | Quest progress + recent achievements widget |
| Learning Paths | Quests can be nodes within a learning path |
| Credit System | No credit cost (quests use curated experiments, not UPG) |

### Free vs Pro Feature Gate

| Feature | Free | Pro |
|---------|------|-----|
| Browse quest map | Yes | Yes |
| Complete quests | 2 quests/week | Unlimited |
| Achievement badges | Yes | Yes |
| Weekly leaderboard | View only | Participate + compete |
| Create custom predictions (advanced) | No | Yes |

## Module 5: Lab Notebook AI

### Positioning

Bridges the gap between "doing an experiment" and "writing a lab report." AP Physics students write 8-12 formal lab reports per semester, each taking 2-4 hours. This module auto-fills experiment metadata and data sections, then uses AI to guide (not replace) the student's analysis and conclusions. The output is a PDF in standard AP lab report format.

### Priority: P2

High value but highest complexity (rich text editor + PDF generation + AI integration). Depends on Experiment Viewer being mature. Build after Quest.

### User Stories

| # | As a... | I want to... | So that... | Acceptance Criteria |
|---|---------|-------------|-----------|-------------------|
| N1 | AP student | click "Lab Notebook" during an experiment to start a report | I capture data while it's fresh | Side drawer opens with 5 sections pre-populated from experiment data |
| N2 | AP student | have AI pre-fill the Method section from experiment metadata | I don't waste time describing the setup | Method section populated with procedure steps from experiment config |
| N3 | AP student | get AI hints for my Analysis section (not answers) | I learn to analyze data, not just copy | AI provides guiding questions: "What pattern do you see in the data?" |
| N4 | AP student | export my completed notebook as a PDF | I can submit it to my teacher | PDF in standard AP format: Hypothesis-Method-Data-Analysis-Conclusion |
| N5 | student | see version history of my notebook | I can revert if I make a mistake | Version list with timestamps, click to restore |

### Core Pages and Routes

```
/notebooks                            ← My notebooks list
/notebooks/[id]                       ← Full-page notebook editor
/notebooks/[id]/export                ← PDF preview + download
```

The primary entry point is NOT these pages -- it's the side drawer triggered from Experiment Viewer. These pages are for returning to edit/manage notebooks.

### Data Requirements

| Data | Source |
|------|--------|
| Notebook content (5 sections) | `lab_notebook` table (JSON text field) |
| Version history | `lab_notebook_version` table |
| Export records | `lab_notebook_export` table |
| Experiment metadata for pre-fill | `experimentProgress` + experiment config |
| UPG data for pre-fill | `upgGeneration` table |
| AI suggestions | OpenRouter/Anthropic via existing AI pipeline |

### Interaction with Other Modules

| Module | Relationship |
|--------|-------------|
| Experiment Viewer | Primary trigger point (action bar button) |
| UPG / Create Your Own | Can create notebook from UPG exploration |
| AP Prep Mode | Can attach notebook to AP practice (future) |
| User Dashboard | "Recent Notebooks" widget |
| Credit System | AI suggestions consume credits (Pro only) |

### Free vs Pro Feature Gate

| Feature | Free | Pro |
|---------|------|-----|
| Create notebooks | 2/month | Unlimited |
| AI pre-fill | Method section only | All sections |
| AI analysis hints | Not available | Available |
| PDF export | Not available | With/without watermark |
| Version history | Latest version only | Full history |

## Module 6: Create Your Own / UPG

### Positioning

Demoted from hero to premium power-user feature. Repositioned as "Create Your Own Experiment" -- the tool for students who want to go beyond the curated library and explore their own questions. This is the long-tail engagement play: curated labs get students in the door, UPG keeps the curious ones creating.

### Priority: P2

Already built and working. Needs UI repositioning, not new development. 2 days of work.

### User Stories

| # | As a... | I want to... | So that... | Acceptance Criteria |
|---|---------|-------------|-----------|-------------------|
| U1 | curious student | type a physics question and get an interactive visualization | I can explore any concept, not just what's in the library | UPG generates interactive HTML in 30-60 seconds |
| U2 | student | start from an existing experiment as a template | I don't start from scratch | "Remix" button on Experiment Viewer pre-fills UPG prompt |
| U3 | student | publish my creation to the Gallery | others can learn from my visualization | One-click publish with auto-generated tags |

### Core Pages and Routes

```
/create                               ← UPG generator (renamed from /upg)
/create/my                            ← My creations (renamed from /upg/my)
/create/view/[id]                     ← View a specific creation
```

Note: Old `/upg/*` routes should 301 redirect to `/create/*` for backward compatibility.

### Interaction with Other Modules

| Module | Relationship |
|--------|-------------|
| Experiment Viewer | "Remix with AI" sends experiment context to UPG |
| Community Gallery | Publish creation to gallery |
| AP Prep Mode | "See It in Action" uses UPG pipeline |
| Lab Notebook AI | Can create notebook from UPG output |

### Free vs Pro Feature Gate

| Feature | Free | Pro |
|---------|------|-----|
| Generate visualizations | 3/day | 20/day |
| Template prompts | Yes | Yes |
| Remix from experiments | No | Yes |
| Advanced parameters (3D, sliders) | Basic output | Full output |
| Save and publish | Yes | Yes |
| Fork others' creations | No | Yes |

## Module 7: Community Gallery

### Positioning

Three roles: SEO engine (every public visualization = a long-tail landing page), social proof (new visitors see active community), and conversion funnel (browse -> want to create -> register). Existing implementation needs minor upgrades for the pivot: experiment-based content alongside UPG-generated content.

### Priority: P1

Already built. Needs 2 days of upgrades to support experiment-related content and improve SEO.

### User Stories

| # | As a... | I want to... | So that... | Acceptance Criteria |
|---|---------|-------------|-----------|-------------------|
| G1 | visitor | browse featured visualizations without logging in | I see what the platform can do | Public page, SSR for SEO, no auth required |
| G2 | student | like and fork a visualization I find interesting | I can learn from and build on others' work | Like (heart) + Fork (creates copy in my account) |
| G3 | student | filter gallery by subject and tags | I find relevant content quickly | Subject tabs + tag cloud + search |
| G4 | creator | see how many views/likes/forks my creation got | I'm motivated to create more | Stats visible on my creations page |

### Core Pages and Routes

```
/gallery                              ← Gallery main (existing)
/gallery/[id]                         ← Detail page (existing)
/gallery/tag/[tag]                    ← Tag aggregation (existing, needs SEO upgrade)
```

### Upgrades Needed

1. **Experiment integration**: Gallery should also showcase curated experiments, not just UPG creations
2. **SSR meta tags**: Each gallery item needs proper og:title, og:image for social sharing
3. **Structured data**: JSON-LD for each visualization (educational resource schema)
4. **Tag taxonomy**: Align tags with experiment subjects/topics for consistent filtering

### Free vs Pro Feature Gate

| Feature | Free | Pro |
|---------|------|-----|
| Browse gallery | Yes | Yes |
| Like | Login required | Yes |
| Fork | No | Yes |
| Publish to gallery | Yes | Yes |
| Featured placement | Admin-curated | Admin-curated |

## Module 8: Learning Paths

### Positioning

Structured curriculum that turns random experiment browsing into systematic learning. A learning path = 5-10 experiment nodes in pedagogical order with quiz checkpoints. The retention multiplier: students who start a learning path return 3x more than those who browse randomly (industry benchmark from Duolingo/Khan data).

### Priority: P1

Existing implementation (3 tables, admin CRUD, basic frontend). Needs upgrade to integrate with new experiment library and AP alignment.

### User Stories

| # | As a... | I want to... | So that... | Acceptance Criteria |
|---|---------|-------------|-----------|-------------------|
| L1 | student | browse learning paths by subject | I find a structured way to learn a topic | Path list page with subject filters |
| L2 | student | see my progress through a path | I know how far I've come and what's next | Progress bar + node completion states |
| L3 | student | take a quiz after each section | I verify my understanding before moving on | Single-choice quiz, pass/fail with retry |
| L4 | AP student | follow a path aligned to my AP unit | the path covers exactly what I need for the exam | AP-aligned paths with unit tags |

### Core Pages and Routes

```
/learn                                ← Learning path list (existing)
/learn/[slug]                         ← Path overview + progress (existing)
/learn/[slug]/nodes/[orderIndex]      ← Individual node (existing)
```

### Upgrades Needed

1. **AP alignment tags** on paths
2. **Experiment Viewer integration** (nodes link to `/experiments/[slug]` instead of just UPG)
3. **Path recommendations** based on user progress and weak areas
4. **Path completion certificate** (simple, shareable image)

### Free vs Pro Feature Gate

| Feature | Free | Pro |
|---------|------|-----|
| Browse paths | Yes | Yes |
| First 3 nodes per path | Yes | Yes |
| Nodes 4+ | No | Yes |
| Quizzes | Yes | Yes |
| Progress tracking | Yes | Yes |
| Completion certificate | No | Yes |

## Module 9: User Dashboard

### Positioning

The logged-in student's home base. One screen showing: what you've done, what you should do next, and how you're doing. The retention anchor -- numbers going up (experiments completed, accuracy improving, streaks maintained) gives students a reason to come back.

### Priority: P1

Existing design doc (2026-02-24). Needs expansion for new modules (AP progress, Quest achievements, Notebook count).

### User Stories

| # | As a... | I want to... | So that... | Acceptance Criteria |
|---|---------|-------------|-----------|-------------------|
| D1 | student | see all my learning activity in one place | I don't feel lost across modules | Single-page dashboard with module widgets |
| D2 | student | get personalized "next step" recommendations | I always know what to do next | Context-aware CTA based on user state |
| D3 | student | see my learning streak | I'm motivated to maintain it | Daily streak counter with calendar view |

### Core Pages and Routes

```
/dashboard                            ← User dashboard (existing, needs upgrade)
```

### Page Layout (Post-Pivot)

```
┌─────────────────────────────────────────────────────────┐
│ Welcome back, Alex! · Pro · 🔥 7-day streak             │
├──────────┬──────────┬──────────┬──────────┐             │
│ Exp Done │ AP Score │ Quests   │ Credits  │             │
│   24     │   73%    │  5/12    │  45      │             │
├──────────┴──────────┴──────────┴──────────┘             │
│                                                          │
│ [What to Do Next]                                        │
│ Based on your AP Physics 1 progress, you should          │
│ review Unit 4: Energy. You scored 58% on last practice.  │
│ [Start Practice →]                                       │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ [Continue Experimenting]                                 │
│ ┌──────┐ ┌──────┐ ┌──────┐  ← recently viewed          │
│ │ SHM  │ │Waves │ │E-fld │                              │
│ └──────┘ └──────┘ └──────┘                              │
├─────────────────────────────────────────────────────────┤
│ [Recent Achievements]          [AP Progress]             │
│ 🏆 First Quest Complete       Physics 1: ██████░░ 73%   │
│ 🏆 5-Day Streak               Physics 2: ███░░░░░ 38%   │
│ 🏆 Shared to Gallery                                     │
└─────────────────────────────────────────────────────────┘
```

### Data Requirements

| Widget | Source |
|--------|--------|
| Stats cards | `experimentProgress`, `ap_user_progress`, `quest_attempt`, `credit` |
| Streak | `learningStats.currentStreak` |
| Recommendations | Algorithm: lowest AP unit score + incomplete learning path |
| Recent experiments | `experimentProgress` sorted by `lastAccessedAt` |
| Achievements | `user_achievement` sorted by `earnedAt` |
| AP Progress | `ap_user_progress` aggregated by exam |

### Free vs Pro Feature Gate

| Feature | Free | Pro |
|---------|------|-----|
| Dashboard access | Yes | Yes |
| Stats cards | Total only | Detailed breakdown |
| Recommendations | Generic | Personalized (weak area targeting) |
| Streak tracking | Yes | Yes |
| AP Progress widget | Not visible | Full breakdown |

## Module 10: Landing Page

### Positioning

The 8-second pitch. A first-time visitor (likely a student searching "AP Physics practice" or "interactive physics simulation") must understand: what this is, why it's better than PhET/Khan, and how to start -- in under 8 seconds. The pivot changes the hero from "AI generates anything" to "80+ curated experiments + AI-powered study tools."

### Priority: P0

First thing visitors see. Must reflect the new product positioning.

### User Stories

| # | As a... | I want to... | So that... | Acceptance Criteria |
|---|---------|-------------|-----------|-------------------|
| LP1 | first-time visitor | immediately see a live experiment preview | I understand this is interactive, not just a text site | Autoplay experiment GIF/video in hero section |
| LP2 | AP student | see that this platform helps with AP exams | I know it's relevant to my immediate need | "AP Prep Mode" prominently featured in feature section |
| LP3 | student | try an experiment without signing up | I experience the value before committing | "Try Now" button goes to a free experiment, no login |
| LP4 | visitor | see social proof (student count, school count) | I trust this is legitimate | Stats bar: "X students, Y experiments, Z schools" |

### Core Pages and Routes

```
/                                     ← Landing page (existing, needs redesign)
```

### Page Sections (Top to Bottom)

```
1. Hero
   Headline: "See Physics Come Alive"
   Subhead: "80+ interactive 3D experiments aligned to AP curriculum"
   CTA: [Explore Experiments] [Try AP Prep Free]
   Visual: Rotating showcase of 3 experiment thumbnails

2. Social Proof Bar
   "Trusted by X students at Y schools"  (even if small, specific > vague)

3. Featured Experiments (3 cards)
   Hand-picked best experiments with autoplay thumbnails
   Each card: title + AP tag + [Try Free] button

4. Why NeonPhysics (vs competitors)
   3-column grid:
   - "Not just videos" (vs Khan) — Interactive 3D you control
   - "AP-aligned" (vs PhET) — Every experiment mapped to exam units
   - "AI-powered" (vs everyone) — Get personalized explanations

5. AP Prep Mode Highlight
   Full-width section with question example + UPG visualization preview
   "Every AP question comes with an interactive visual explanation"

6. Feature Grid
   Experiment Explorer / AP Prep / Physics Quest / Lab Notebook / Create Your Own

7. Pricing Preview
   Free vs Pro comparison (2 columns, simple)
   [See Full Pricing →]

8. CTA
   "Start Learning for Free — No Credit Card Required"
   [Create Free Account]

9. Footer
   Standard links + "Built for students by scientists" tagline
```

### Free vs Pro Feature Gate

Not applicable (public page). But the page itself must clearly communicate the Free vs Pro value difference.

## Module 11: Pricing Page

### Positioning

The value proposition page. Must answer: "Is this worth $4.99/month?" Answer: Yes, because you get unlimited experiments, full AP prep, AI visualizations, and lab report tools. The anchor is AP exam prep value ($1000+ tutoring vs $4.99/month here).

### Priority: P0

Revenue depends on clear pricing communication. Existing page needs update for new modules.

### Core Pages and Routes

```
/pricing                              ← Pricing page (existing, needs update)
```

### Page Layout

```
┌─────────────────────────────────────────────────────────┐
│ "Everything You Need to Ace AP Physics"                  │
│ (or: "Your Complete Science Lab, Anytime, Anywhere")     │
├──────────────────┬──────────────────┬──────────────────┤
│ Free             │ Pro $4.99/mo     │ Max $9.99/mo     │
│ ───────────      │ ─────────────    │ ─────────────    │
│ 4 experiments/day│ Unlimited        │ Everything in Pro│
│ 5 min each       │ No time limit    │ + Priority AI    │
│ 3 UPG/day        │ 20 UPG/day      │ + API Access     │
│ Basic AP (5/day) │ Full AP Prep     │ + Team features  │
│ 2 notebooks/mo   │ Unlimited notes  │ + LMS integration│
│                  │ PDF export       │                  │
│                  │ Full progress    │                  │
│ [Start Free]     │ [Start Pro]      │ [Contact]        │
├──────────────────┴──────────────────┴──────────────────┤
│ "Less than the cost of one tutoring session"             │
│ FAQ Section (collapsible)                                │
│ - Can I cancel anytime?                                  │
│ - Is there a student discount?                           │
│ - Does my school get group pricing?                      │
│ - What payment methods do you accept?                    │
└─────────────────────────────────────────────────────────┘
```

### Pricing Strategy Notes

- **Free tier must be generous enough to create habit** but limited enough to create upgrade desire
- **Time limit (5 min/experiment) is the primary free gate** -- more natural than hard experiment count
- **AP Prep is the killer upgrade reason** during exam season (Jan-May)
- **Annual pricing**: Pro $39.99/year (33% discount) should be offered but not default

## Module 12: Navigation System

### Positioning

The skeleton that holds everything together. Information architecture determines whether students find what they need or bounce. The pivot requires a complete rethink: experiment library is now primary, UPG is secondary.

### Priority: P0

Every other module depends on navigation being right. Design first, implement first.

### Navigation Architecture

#### Top Navigation Bar (Desktop)

```
[Logo: NeonPhysics]  [Experiments]  [AP Prep]  [Learn]  [Quest]  [Gallery]  [Pricing]  [User Menu ▼]
```

7 items maximum. Ordered by user intent frequency:
1. **Experiments** -- Primary product, most common entry
2. **AP Prep** -- Strongest conversion signal
3. **Learn** -- Structured alternative to browsing
4. **Quest** -- Engagement/gamification (can be under "More" initially)
5. **Gallery** -- Community/social proof
6. **Pricing** -- Always accessible

#### Top Navigation Bar (Mobile)

```
[Logo]  [Experiments]  [☰ Menu]
```

Mobile hamburger contains: AP Prep, Learn, Quest, Gallery, Pricing, Create, Dashboard, Settings.
"Experiments" stays visible because it's the primary action.

#### User Menu (Logged In)

```
[Avatar ▼]
├── Dashboard
├── My Experiments (progress)
├── My Creations (UPG)
├── My Notebooks
├── Credits: 45 remaining
├── ──────────
├── Settings
└── Sign Out
```

#### User Menu (Logged Out)

```
[Sign In]  [Sign Up Free]
```

"Sign Up Free" is a distinct button with visual weight (primary color), not in a dropdown.

#### Contextual Sub-Navigation

On Experiment Viewer page, a secondary bar appears:
```
[← Back to Experiments]  [Theory]  [Controls]  [AP Questions]  [Lab Notebook]  [Quest]
```

On AP Prep pages:
```
[AP Physics 1]  [AP Physics 2]  [AP Physics C: Mech]  [AP Physics C: E&M]  [My Progress]
```

#### Footer Navigation

```
Product: Experiments | AP Prep | Learn | Quest | Gallery | Create
Company: About | Blog | Updates | Careers
Legal: Privacy | Terms | COPPA | Cookie Settings
Support: Help Center | Contact | Status
Social: Twitter | Discord | YouTube
```

### Key Design Decisions

1. **"Create Your Own" not in main nav**. It's accessible from: User Menu ("My Creations"), Experiment Viewer ("Remix with AI"), and a secondary link in the footer. This reflects its new P2 status.
2. **Quest may start under "More" dropdown** if we launch before Quest is ready. Don't show empty nav items.
3. **Nav items show/hide based on feature rollout**. Use feature flags, not hardcoded nav.
4. **Breadcrumbs on all interior pages**. Students navigate deep (Experiments > Physics > Mechanics > SHM) and need a way back.
5. **Mobile bottom tab bar** (optional P1): For the 5 most-used pages, a bottom tab bar on mobile (like Duolingo) significantly improves navigation on phones.

### What Makes It Better Than PhET

PhET navigation: flat list of simulations with category sidebar. No user accounts, no progress, no AP alignment, no contextual navigation. NeonPhysics navigation is structured around the student's learning journey, not just a content catalog.

## Recommended Development Order

Based on dependencies, team capacity (1 developer), and value delivery:

### Sprint 1 (Week 1-2): Foundation [P0]

| Day | Task | Deliverable |
|-----|------|-------------|
| D1 | Navigation System design + implementation | New nav bar, user menu, mobile menu |
| D2 | Navigation System polish + breadcrumbs | Contextual sub-nav, footer |
| D3-4 | Landing Page redesign | New hero, feature sections, social proof |
| D5 | Pricing Page update | New module feature comparison |

### Sprint 2 (Week 3-4): Core Experience [P0]

| Day | Task | Deliverable |
|-----|------|-------------|
| D6-8 | Experiment Explorer | Filter bar, experiment grid, search, cards |
| D9-10 | Experiment Explorer polish | Mobile responsive, "Continue Learning", AP tags |
| D11-13 | Experiment Viewer upgrade | Theory panel, action bar, related experiments |
| D14 | Experiment Viewer mobile | Bottom sheet, floating controls |

### Sprint 3 (Week 5-6): Retention + Revenue [P1]

| Day | Task | Deliverable |
|-----|------|-------------|
| D15-16 | User Dashboard upgrade | New widgets for experiments, AP progress, streak |
| D17-18 | Learning Paths upgrade | AP alignment, experiment integration |
| D19-20 | Gallery upgrade | SSR meta tags, experiment content, structured data |

### Sprint 4 (Week 7-10): AP Prep [P1]

| Day | Task | Deliverable |
|-----|------|-------------|
| D21-22 | AP Prep schema + API | 5 tables, 10 endpoints |
| D23-26 | AP Prep frontend | Exam selector, unit view, practice mode |
| D27-28 | AP Prep UPG integration | "See It in Action" visualization |
| D29-30 | AP Prep content | 30 questions for AP Physics 1 Units 1-3 |
| D31-34 | AP Prep progress | Dashboard, weak area detection |
| D35-38 | AP Prep polish + testing | Edge cases, mobile, i18n |

### Sprint 5+ (Week 11-18): Engagement [P2]

| Day | Task |
|-----|------|
| D39-40 | UPG repositioning (rename routes, update nav) |
| D41-56 | Physics Quest (full 16 days) |
| D57-70 | Lab Notebook AI (full 14 days) |

**Total: ~70 working days / 14 weeks for full platform**

## Success Metrics

### P0 Launch Metrics (Week 4)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Experiment Explorer page views | 500/week | Analytics |
| Experiment completion rate | >40% of starts | `experimentProgress` |
| Bounce rate from landing | <60% | Analytics |
| Time on Experiment Viewer | >3 minutes avg | Analytics |

### P1 Metrics (Week 10)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Free-to-Pro conversion | >3% | Stripe data |
| AP Prep daily active users | 100/day during AP season | `ap_attempt` table |
| Learning path completion rate | >25% | `learning_path_progress` |
| Returning users (7-day) | >30% | Analytics |

### P2 Metrics (Week 18)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Quest completion rate | >50% of starts | `quest_attempt` |
| Lab Notebook exports | 50/week | `lab_notebook_export` |
| Gallery UGC submissions | 20/week | `upgGeneration` where `is_public=true` |
| Daily active users | 500 | Analytics |

## Key Design Principles Across All Modules

1. **Every page has a clear next action.** No dead ends. Experiment Viewer leads to AP Prep, Quest, Notebook. AP Prep leads back to experiments. Quest leads to more quests.

2. **Free users feel value, not frustration.** Gates are on depth (advanced features), not on basic access. A student can browse everything, try experiments, see AP questions -- the gate is on unlimited access and premium features.

3. **AP alignment is visible everywhere.** Every experiment, every quest, every learning path shows which AP units it covers. This is the #1 differentiator vs PhET and the #1 purchase reason for students.

4. **Mobile is not an afterthought.** 60%+ of high school students will access this on phones. Every module must have a considered mobile layout, not just a responsive shrink.

5. **Data portability matters.** Lab notebooks export to PDF. Progress is visible. Students can share experiments and gallery items. The platform respects that students own their learning data.
