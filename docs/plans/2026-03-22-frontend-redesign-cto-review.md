---
name: frontend-redesign-cto-review
status: in-progress
created: 2026-03-22T15:01:04Z
updated: 2026-03-22T15:01:04Z
---

# CTO Review: Frontend Redesign (3-Document Suite)

**Verdict: APPROVE WITH CHANGES**

Three documents reviewed:
1. `2026-03-22-frontend-module-architecture.md` -- Business module design
2. `frontend-architecture-pivot.md` -- Technical frontend architecture
3. `2026-03-22-design-system-architecture.md` -- Visual design system

## Executive Summary

The pivot from UPG-centric to experiment-library-centric is the correct strategic call. The three documents are individually strong -- thorough user stories, solid rendering strategies, well-considered design tokens. But they were written in parallel without a reconciliation pass, producing **14 conflicts** ranging from route naming to timeline math to scope inflation. The design system document also proposes a visual identity overhaul that contradicts the confirmed `edu-academic` direction from 2026-03-08 without adequate justification.

**Bottom line**: The business module doc and technical architecture doc are 85% aligned and ready for execution after corrections. The design system doc needs a scoped-down v1 that does NOT blow up the existing theme -- it should evolve incrementally, not replace wholesale.

## Part 1: Per-Document Review

### Document 1: Frontend Module Architecture

**Strengths:**
- Priority matrix is well-calibrated. P0 at 16 days is aggressive but achievable.
- User stories are concrete with real acceptance criteria, not hand-wavy.
- Free vs Pro gates are thoughtfully designed -- generous free tier creates habit, gates on depth not breadth.
- Dependency graph correctly identifies Experiment Viewer as the hub.
- AP Prep as monetization engine is sound (300K students/year, 3-5 month window).
- College Board copyright risk callout shows awareness of real legal constraints.

**Issues:**

1. **Route inconsistency with Doc 2.** This doc uses `/experiments` and `/experiments/[slug]`. Doc 2 uses `/explore` and `/explore/[slug]`. These MUST be reconciled before any code is written. **Decision needed: pick one.**

   **CTO recommendation: `/experiments` for Doc 1's routes, `/explore` for Doc 2's.** Wait -- that makes no sense. Pick ONE. I recommend **`/experiments`** as the canonical route. Rationale: it's self-descriptive, SEO-friendly (users search "physics experiments"), and avoids the rename churn. `/explore` is vague. If the founder insists on `/explore`, fine, but the redirect from `/experiments` is non-negotiable.

2. **Quest routes disagree across docs.** Doc 1 says `/quest/[slug]`, `/quest/achievements`, `/quest/leaderboard`. Doc 2 says `/quests` (plural). Doc 1's navigation section says "Quest" (singular) in the nav bar but uses `/quest` routes. **Pick `/quests` (plural) everywhere -- consistent with `/experiments`, `/notebooks`.**

3. **Gallery route confusion.** Doc 1 Module 7 keeps existing routes: `/gallery`, `/gallery/[id]`, `/gallery/tag/[tag]`. Doc 2 renames to `/community`. These directly contradict each other. **CTO decision: keep `/gallery` for now.** Renaming to `/community` is a cosmetic change that costs SEO equity (existing indexed URLs) for zero user value. The word "gallery" is perfectly understood. If you must rename, do it post-launch when you have traffic data showing the name matters.

4. **Notebook routes disagree.** Doc 1 says `/notebooks`, `/notebooks/[id]`, `/notebooks/[id]/export`. Doc 2 says `/notebook` (singular). **Pick `/notebooks` (plural) -- it's a collection, plural is correct.**

5. **UPG/Create routes.** Doc 1 says `/create`, `/create/my`, `/create/view/[id]`. Doc 2 says `/create` with UPG moved to `(create)` layout group. These are aligned in direction but the old `/upg/view/[id]` route needs explicit mention in the redirect map. Doc 2's redirect map redirects `/upg` and `/upg/my` but misses `/upg/view/:id` -> `/create/view/:id`.

6. **AP Prep routes.** Doc 1 defines 5 routes: `/ap-prep`, `/ap-prep/[exam-slug]`, `/ap-prep/[exam-slug]/[unit-slug]`, `/ap-prep/[exam-slug]/[unit-slug]/practice`, `/ap-prep/progress`. Doc 2 only shows `/ap-prep` as a single page. The Doc 1 route structure is correct for the feature scope described. Doc 2 needs to acknowledge the nested route structure.

7. **Timeline math.** Doc 1 says 70 working days / 14 weeks. But Sprint 4 alone (AP Prep) is 18 working days across "Week 7-10" which is 20 working days. The numbers don't add up. Sprint 5 says D39-D70 = 32 days for "Week 11-18" = 40 working days. **The timeline is actually ~18 weeks, not 14.** Be honest about this.

8. **Navigation architecture.** Doc 1's Module 12 nav bar: `[Experiments] [AP Prep] [Learn] [Quest] [Gallery] [Pricing]` -- 6 items. Doc 2's nav: `[Explore] [Learn (dropdown)] [Create (dropdown)] [Pricing]` -- 4 items with dropdowns. These are fundamentally different IA approaches. **CTO recommendation: Doc 2's dropdown approach is better.** 6 top-level items is too many for mobile. Group under Learn and Create. But use "Experiments" not "Explore" as the primary item.

9. **Free tier gating inconsistency.** Doc 1's Experiment Explorer says "4 experiments/day, 5 min each." Doc 1's Pricing Page says "4 experiments/day, 5 min each" consistently. But the Experiment Viewer section says "4/day, 5 min each" for viewing/interacting. Need to clarify: is the 4/day limit on starting experiments, or on unique experiments accessed? What if a student revisits one they already started? **Clarification needed: "4 unique experiments per day" with no time limit on revisits to previously started ones is simpler and more generous.**

10. **Missing: how are AP questions sourced?** Doc 1 says "30-50 per unit initially" across ~7-10 units per exam, across 4 exams. That's 840-2000 questions minimum. Who writes these? At what cost? This is a massive content dependency that's treated as a given but has no sourcing plan.

### Document 2: Frontend Architecture Pivot

**Strengths:**
- Inventory snapshot is excellent -- knows exactly what exists before proposing changes.
- Rendering strategy per route is well-reasoned (SSG for static experiments, CSR for interactive features).
- "No new Context" decision is correct -- page-scoped state via URL params is the right call.
- Migration plan with 8 phases and file-level detail is production-grade.
- Reuse summary shows discipline -- forking ExperimentClient rather than rewriting.
- Performance targets are concrete (LCP <1.2s, bundle <80KB for /explore).
- `experimentProgress` in AppContext is the right exception to the "no new context" rule.

**Issues:**

1. **Route naming -- see Doc 1 issues above.** The `/explore` naming needs reconciliation.

2. **Layout group proliferation.** Current: 5 layout groups `(landing)`, `(auth)`, `(admin)`, `(chat)`, `(docs)`. Proposed: adds `(explore)`, `(learn)`, `(create)`, `(dashboard)` = 9 total. That's a lot of layout groups. **Question: what does `(explore)/layout.tsx` actually provide that `(landing)/layout.tsx` doesn't?** If it's just "sticky filter sidebar + header," that's a component concern, not a layout group concern. The experiment viewer (`/explore/[slug]`) has a completely different layout from the explorer (`/explore`) -- they shouldn't share a layout group.

   **CTO recommendation:** Keep `(landing)` as the catch-all public layout. New routes like `/experiments`, `/ap-prep`, `/quests` go under `(landing)` unless they need a fundamentally different shell (no header/footer). The `(learn)` layout with "progress sidebar" makes sense as a distinct group. The `(create)` layout with "minimal chrome, full canvas" makes sense. But `(explore)` and `(dashboard)` don't justify their own layout groups.

3. **Phase 0 modifies 67 files (data files).** Adding `gradeLevel` to all 64 experiment data files is busywork that can be automated with a script. Don't count it as development time. Write a Node script that reads the file naming convention and patches the field. 30 minutes, not a day.

4. **Missing: i18n route impact.** The redirect map doesn't account for i18n prefixes. Currently en is prefix-free, zh is `/zh/...`. So `/zh/experiments/:slug` also needs to redirect to `/zh/explore/:slug` (or whatever the final route is). The redirect config in `next.config.ts` needs to handle `/:locale?/experiments/:slug`.

5. **Command palette (`cmd+k`)** is nice-to-have that's listed in Phase 3 (Navigation). Defer to post-launch. It's zero-value for the first 1000 users who are exploring, not power-using.

6. **Subject color definitions differ from Doc 3.** Doc 2 defines Biology as purple (`oklch(0.50 0.18 310)`), Doc 3 defines Biology as amber gold (`oklch(0.65 0.15 80)`). **These must match.** CTO decision: Biology = amber/green is more intuitive (nature). Purple = Math (abstract). See reconciliation in Cross-Document Conflicts section.

### Document 3: Design System Architecture

**Strengths:**
- "Digital Lab Bench" metaphor is compelling and distinctive -- neither textbook nor game.
- Subject color system via `data-subject` CSS attributes is elegant and zero-runtime-cost.
- Neon accent usage rules (ONLY small indicators, never large fills) show restraint.
- Accessibility section is thorough -- keyboard nav, screen reader for 3D, reduced motion.
- Card system with base + specialization is good component architecture.
- Loading state phasing (UPG generation) is thoughtful UX.
- Empty state illustrations spec is a detail most design docs skip.
- Motion tokens with strict "landing page only" rule for scroll animations is disciplined.

**Issues:**

1. **CRITICAL: Contradicts confirmed UI direction.** The existing codebase has `edu-academic` theme confirmed on 2026-03-08 (commit `617a385`). CLAUDE.md explicitly states: "UI 方向：edu-academic 主题完整迁移（394 行 CSS + 组件适配）". This doc proposes to **replace** the entire visual identity -- different font (Inter replaces Merriweather), different color palette (Electric Indigo replaces Academic Blue), different CSS prefix (`.np-*` replaces `.edu-*`), dark mode default instead of current light-mode approach.

   This isn't an evolution, it's a rewrite of a decision made 14 days ago. If the design direction is wrong, that's a valid position, but it needs explicit founder approval, not a stealth override via a design system doc.

   **CTO position:** The argument that "Merriweather says textbook and teens don't want textbook" has merit. But the solution is not to throw away 394 lines of themed CSS and start over. The solution is:
   - **Phase 1 (with pivot):** Keep Merriweather for now. Add subject colors, add dark mode toggle (not default-dark). Migrate `.edu-*` to `.np-*` prefix only (same styles, new names).
   - **Phase 2 (post-launch, with data):** A/B test Inter vs Merriweather on landing page. If Inter wins on engagement metrics, migrate. Data-driven, not opinion-driven.

2. **Dark mode as default is high-risk.** The entire existing component library was built light-mode-first. The admin panel (`(admin)/`) assumes light mode. Fumadocs has its own theme. Flipping default to dark touches every page. **Do not flip the default for MVP. Add dark mode as an option (toggle in header), track which mode users prefer, then decide.**

3. **`.edu-*` to `.np-*` migration scope.** Doc says "do it all at once in one atomic commit." That's 394 lines of CSS plus every component that references `.edu-*` classes. A global find-replace risks breaking things the tests don't cover (CSS classes in i18n JSON? In markdown content? In theme blocks?).

   **CTO recommendation:** Do the rename in Phase 0 as proposed, but:
   - First, run `grep -r "edu-" src/` to get the full blast radius.
   - Create the new `.np-*` classes that alias to the old `.edu-*` styles.
   - Migrate components one directory at a time, not all at once.
   - Keep `.edu-*` classes working (deprecated but functional) for 2 weeks.

4. **Font swap from Merriweather to Inter needs performance validation.** Merriweather is currently loaded for headings only. Inter would be loaded for headings AND body (replacing Noto Sans too). That's potentially more font weight to download. The doc acknowledges "subset" but doesn't quantify the delta. **Measure before committing: compare font bundle size of current (Merriweather + Noto Sans) vs proposed (Inter 400-800).**

5. **`oklch(from var(--subject) ...)` relative color syntax.** This is CSS Color Level 5. Browser support: Chrome 119+, Safari 16.4+, Firefox 128+. Students on school Chromebooks may have older Chrome versions. Older iPhones on iOS 16 would lack Safari 16.4. **Verify target browser matrix.** If you need to support Chrome <119 (Chromebooks updated to ChromeOS 119 in Nov 2023, so most should be fine by 2026, but verify), you need fallbacks.

6. **Design system file proposes `theme-neonphysics.css` replacing `theme-education.css`.** But the architecture doc and CLAUDE.md reference `theme-education.css` as the canonical theme file. If you create a new file, you have two theme files during migration. **CTO decision: rename `theme-education.css` to `theme-neonphysics.css` in the same commit as the `.edu-*` -> `.np-*` migration. Don't maintain two files.**

7. **20 dev-days estimate for design system alone** is on top of the 14-week (actually 18-week) estimate from Doc 1. Are these additive or overlapping? If additive, the total timeline is 22 weeks. **These MUST overlap. The design system Phase A (5 days) should be Sprint 0, before Doc 1's Sprint 1.**

8. **Landing page has 10 sections** (hero, live demo, subject explorer, how-it-works, featured experiments, students/teachers, AP prep preview, social proof, pricing, CTA). That's too many. PhET's landing page has 4 sections. Brilliant has 5. **Cut to 6-7 sections max.** Recommended cuts: merge "Social Proof" into hero as trust bar (Doc 1 already has this), merge "For Students/For Teachers" into "How It Works," drop "Live Demo" for MVP (it requires a working UPG demo on the landing page which adds complexity).

## Part 2: Cross-Document Conflicts

| # | Conflict | Doc 1 Says | Doc 2 Says | Doc 3 Says | CTO Resolution |
|---|----------|-----------|-----------|-----------|----------------|
| 1 | Primary route | `/experiments` | `/explore` | `/explore` (wireframes) | **`/experiments`** -- SEO value, self-descriptive |
| 2 | Quest route | `/quest` (singular) | `/quests` (plural) | `/quests` (wireframes) | **`/quests`** -- plural is consistent |
| 3 | Gallery route | `/gallery` (keep) | `/community` (rename) | N/A | **`/gallery`** -- don't burn SEO equity for a name |
| 4 | Notebook route | `/notebooks` (plural) | `/notebook` (singular) | N/A | **`/notebooks`** -- it's a collection |
| 5 | Nav structure | 6 flat items | 4 items with dropdowns | 6 flat items (wireframe) | **4 items with dropdowns** (Doc 2 approach) |
| 6 | Biology color | N/A | Purple (hue 310) | Amber Gold (hue 80) | **Amber/green (hue 80)** -- biologically intuitive. Math gets purple. |
| 7 | Font | Merriweather (confirmed) | Not specified | Inter (proposed) | **Merriweather for MVP, A/B test Inter post-launch** |
| 8 | Dark mode | Not specified | "Uses existing theme" | "Dark mode is default" | **Light mode default, dark mode toggle available** |
| 9 | CSS prefix | `.edu-*` (current) | Not explicit | `.np-*` (new) | **Migrate to `.np-*` in Phase 0, keep `.edu-*` as deprecated aliases** |
| 10 | Timeline | 14 weeks / 70 days | 8 phases (no timeline) | 20 dev-days (additive?) | **See unified timeline below** |
| 11 | Landing sections | 9 sections | Hero/SubjectGrid/Featured/Stats/HowItWorks/Testimonials/Pricing/FAQ/CTA | 10 sections | **7 sections max** |
| 12 | AP Prep routes | 5 nested routes | 1 flat route | 1 page (wireframe) | **5 nested routes** (Doc 1 is correct for feature scope) |
| 13 | Experiment Viewer location | Module in Doc 1 | `src/shared/blocks/explore/` | Wireframe only | **`src/shared/blocks/experiments/`** (match route name) |
| 14 | Subject count | Physics/Chem/Bio | Physics/Chem/Bio/Earth | Physics/Chem/Bio/Math/Earth | **Physics/Chem/Bio/Earth for launch. Math is a stretch.** |

## Part 3: Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Scope creep**: 3 new features + redesign + pivot + design system overhaul simultaneously | HIGH | CRITICAL | Phase the work. Design system Phase A only for MVP. New features (Quest, Notebook) are P2 -- defer to post-launch. |
| **Timeline slip**: 14-week estimate is actually 18+ weeks with design system work | HIGH | HIGH | Be honest: MVP (P0+P1) is 10 weeks. P2 features add 8 more weeks. Design system foundation adds 1 week upfront. Total: 19 weeks realistic. |
| **SEO ranking loss**: URL changes from `/experiments` to `/explore` | MEDIUM | HIGH | Use `/experiments` (no change needed). If changing, 301 redirects are mandatory, submit updated sitemap to Search Console immediately. |
| **Breaking existing users**: Current URLs, bookmarks, shared links stop working | MEDIUM | MEDIUM | 301 redirects for ALL old routes. Keep old routes working for 90 days minimum. |
| **3D perf on Chromebooks**: WebGL on cheap hardware | MEDIUM | MEDIUM | Already mitigated: only 4 R3F scenes, rest are HTML iframes. Add `navigator.hardwareConcurrency` check and degrade gracefully. |
| **Content readiness**: 64 experiments for a "library" | LOW | HIGH | 64 is enough for launch. PhET started with fewer. Quality > quantity. But need 100+ for credible "explore" experience -- plan content pipeline. |
| **AP question sourcing**: 840-2000 questions needed, no sourcing plan | HIGH | CRITICAL | Start with 30 questions per AP Physics 1 unit (210 total). Use AI-assisted generation with physics teacher review. Budget 2-3 weeks of content work in parallel with dev. |
| **Dark mode flip breaks admin/docs** | MEDIUM | MEDIUM | Don't flip. Offer as toggle. |
| **i18n redirect gaps** | MEDIUM | LOW | Add locale-aware redirects in next.config.ts from day 1. |
| **CSS prefix migration breaks components** | MEDIUM | MEDIUM | Grep first, alias during transition, migrate incrementally. |
| **Design system + feature work compete for the same developer** | HIGH | HIGH | Design system Phase A (5 days) MUST complete before feature work starts. Then feature work drives further design evolution -- don't separate them. |

## Part 4: Missing Pieces

### Must Address Before Development

1. **Error states and fallback UI.** None of the three docs define what happens when:
   - An experiment fails to load (WebGL crash, iframe timeout)
   - The API is down (AP questions, notebook save)
   - Network is slow (3G on a school bus)

   **Action:** Add error boundary component spec to Doc 2. Minimum: generic error fallback with retry button, specific fallback for experiment loading failure.

2. **Analytics and tracking.** The pivot changes the entire funnel. You need events for:
   - Experiment card click, experiment start, experiment completion
   - AP question answered (correct/incorrect), AP session duration
   - Free-to-Pro paywall hit, conversion
   - Search queries (what are students looking for?)

   **Action:** Define event schema before building. Use existing analytics extension (`src/extensions/analytics/`).

3. **Admin tools for new features.** AP questions need a CRUD interface. Quest definitions need admin management. The admin panel (`(admin)/`) needs new sections.

   **Action:** Don't build admin UIs for MVP. Seed AP questions via migration scripts. Use Drizzle Studio for early content management. Build admin UIs in Sprint 5+.

### Should Address But Not Blocking

4. **Offline/slow network.** Service worker for experiment caching? At minimum, show a meaningful offline message, not a blank page.

5. **A/B testing.** Need to test pricing page layouts, landing page hero variants, free tier limits. Vercel has built-in edge middleware for this. Plan the infrastructure even if you don't use it on day 1.

6. **Rate limiting for new endpoints.** AP Prep endpoints need rate limiting (prevent question scraping). Notebook AI endpoints need rate limiting (prevent AI abuse).

7. **Mobile bottom tab bar.** Doc 1 mentions this as "optional P1." For a teen audience on phones, this is actually important. Duolingo's bottom tabs are a big part of their mobile UX success. Add to P1 scope.

## Part 5: Unified Final Recommendation

### Approved Architecture

**Routes (canonical):**

```
/                           Landing page (ISR)
/experiments                Experiment browser (SSG shell + CSR filters)
/experiments/[slug]         Experiment viewer (SSG via generateStaticParams)
/ap-prep                    AP subject picker (SSG)
/ap-prep/[exam]             AP unit overview (SSG)
/ap-prep/[exam]/[unit]      AP question list (SSG shell + CSR)
/ap-prep/[exam]/[unit]/practice  AP practice mode (CSR)
/ap-prep/progress           AP progress dashboard (SSR, auth-gated)
/quests                     Quest map (SSR, auth-gated)
/quests/[slug]              Quest play (CSR)
/learn                      Learning paths (SSG)
/learn/[slug]               Learning path detail (SSG)
/learn/[slug]/nodes/[idx]   Learning path node (SSG)
/notebooks                  Notebook list (SSR, auth-gated)
/notebooks/[id]             Notebook editor (CSR)
/gallery                    Community gallery (SSR)
/gallery/[id]               Gallery item (SSR)
/create                     UPG generator (CSR)
/create/my                  My creations (SSR, auth-gated)
/dashboard                  User dashboard (SSR, auth-gated)
/pricing                    Pricing page (ISR)
```

**Layout groups:**

```
src/app/[locale]/
├── (landing)/     Public marketing + experiments + gallery + pricing
├── (learn)/       AP Prep + Quests + Learning Paths + Notebooks (progress sidebar)
├── (create)/      UPG + My Creations (minimal chrome)
├── (dashboard)/   User dashboard (sidebar nav)
├── (auth)/        Keep
├── (admin)/       Keep
├── (chat)/        Keep
├── (docs)/        Keep
```

Experiments stay under `(landing)` -- they're the public face. They don't need a separate layout group.

**Component locations:**

```
src/shared/blocks/
├── experiments/           ExperimentBrowser, ExperimentCard, ExperimentViewer
├── ap-prep/              APSubjectPicker, APPrepPanel, QuestionCard
├── quests/               QuestMap, QuestCard
├── notebook/             NotebookEditor, AIAssistantPanel
├── dashboard/            Existing + new panels
├── gallery/              Existing, no rename
├── common/               BreadcrumbNav, DifficultyDots, SubjectBadge, etc.
```

**Design system approach:**

| What | Decision |
|------|----------|
| Font | Merriweather headings + Noto Sans body (keep current). Evaluate Inter post-launch. |
| CSS prefix | Migrate `.edu-*` to `.np-*` in Phase 0. Keep `.edu-*` as deprecated aliases for 30 days. |
| Theme file | Rename `theme-education.css` to `theme-neonphysics.css`. |
| Dark mode | Available via toggle. NOT default. Track user preference. |
| Subject colors | Add to theme file. Physics=blue(250), Chemistry=green(145), Biology=amber(80), Earth=terracotta(25). |
| `data-subject` pattern | Approved. Zero-runtime-cost, elegant. |
| Neon accents | Keep with documented usage rules (indicators only, never fills). |
| Landing page | 7 sections: Hero, Trust Bar, Featured Experiments, Why NeonPhysics, AP Prep Highlight, Pricing Preview, CTA. |

### Revised Timeline (Honest)

| Sprint | Weeks | Content | Deliverable |
|--------|-------|---------|-------------|
| 0 | Week 1 | Design system foundation: `.np-*` migration, subject colors, theme rename, component extraction | Refactored codebase, no visible changes |
| 1 | Week 2-3 | Navigation + Landing page + Pricing | New public face |
| 2 | Week 4-5 | Experiment Browser + Viewer upgrade | Core product loop |
| 3 | Week 6-7 | Dashboard upgrade + Learning Paths upgrade + Gallery SEO | Retention features |
| 4 | Week 8-11 | AP Prep Mode (full) | Revenue feature |
| 5 | Week 12-13 | UPG repositioning + polish + testing | Cleanup |
| -- | -- | **MVP LAUNCH** | P0 + P1 complete |
| 6 | Week 14-17 | Physics Quest | Engagement |
| 7 | Week 18-20 | Lab Notebook AI | Advanced feature |

**Total to MVP: 13 weeks. Total to full platform: 20 weeks.**

Content work (AP questions, quest definitions) must run in parallel with dev starting Week 4.

### Redirects Required (Day 1 of Route Changes)

```typescript
// next.config.ts
const redirects = [
  // Experiment routes (if keeping /experiments, no redirect needed)
  // UPG routes
  { source: '/:locale(zh)?/upg', destination: '/:locale/create', permanent: true },
  { source: '/:locale(zh)?/upg/my', destination: '/:locale/create/my', permanent: true },
  { source: '/:locale(zh)?/upg/view/:id', destination: '/:locale/create/view/:id', permanent: true },
  // If /experiments changes (it shouldn't per this review, but documenting for safety)
];
```

## Part 6: Founder Decisions (2026-03-22 CONFIRMED)

1. **Route name** → ✅ `/experiments` (CTO recommendation accepted)
2. **Gallery rename** → ✅ Keep `/gallery` (CTO recommendation accepted)
3. **Font** → ✅ Keep Merriweather + Noto Sans for MVP (CTO recommendation accepted)
4. **Dark mode** → ✅ Toggle option, light default (CTO recommendation accepted)
5. **AP question sourcing** → ✅ AI-assisted + teacher review (CTO recommendation accepted)
6. **Free tier** → ⚠️ OVERRIDE: **3 experiments TOTAL per account (lifetime)**. Any interaction = consumed. Not daily, not time-limited. Pro $4.99/mo = unlimited experiments. Max $9.99/mo = unlimited + advanced features (UPG, AI Notebook, Quest full access).
7. **Launch scope** → ⚠️ OVERRIDE: **P0+P1 ship together** (13 weeks, not phased)
8. **Math as subject** → ⚠️ OVERRIDE: **Include Math now** as 5th subject. Math=violet(310).

### Impact of Decision #6 (Lifetime 3-Experiment Limit)

This fundamentally changes the conversion funnel:
- Previous model: generous daily quota → gradual paywall → conversion
- New model: hard paywall after 3 experiments → conversion or leave
- Requires: `experiment_access` table, paywall gate component, pricing page redesign
- Risk: high bounce rate if first 3 experiments aren't compelling
- Mitigation: curate the "first 3" experience carefully — default free experiments must be the best ones

### Final Documents

All decisions incorporated into:
- `2026-03-22-frontend-design-final.md` — Authoritative design document
- `2026-03-22-frontend-dev-plan-final.md` — Sprint-by-sprint implementation plan

## Appendix: Canonical Subject Color Definitions

For all three documents to reference:

```css
:root {
  --subject-physics:       oklch(0.55 0.18 250);   /* Academic Blue */
  --subject-chemistry:     oklch(0.55 0.18 145);   /* Forest Green */
  --subject-biology:       oklch(0.65 0.15 80);    /* Amber Gold */
  --subject-earth:         oklch(0.55 0.15 25);    /* Terracotta */

  --subject-physics-bg:    oklch(0.95 0.03 250);
  --subject-chemistry-bg:  oklch(0.95 0.03 145);
  --subject-biology-bg:    oklch(0.95 0.03 80);
  --subject-earth-bg:      oklch(0.95 0.03 25);
}

.dark {
  --subject-physics:       oklch(0.70 0.15 250);
  --subject-chemistry:     oklch(0.70 0.15 145);
  --subject-biology:       oklch(0.70 0.12 80);
  --subject-earth:         oklch(0.70 0.12 25);

  --subject-physics-bg:    oklch(0.22 0.03 250);
  --subject-chemistry-bg:  oklch(0.22 0.03 145);
  --subject-biology-bg:    oklch(0.22 0.03 80);
  --subject-earth-bg:      oklch(0.22 0.03 25);
}
```

These values are final. All three documents should reference this appendix, not define their own.
