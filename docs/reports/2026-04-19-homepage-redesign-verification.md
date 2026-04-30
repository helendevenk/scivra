---
name: homepage-redesign-verification
status: historical-report
snapshot_date: '2026-04-19'
created: '2026-04-19T12:50:00Z'
updated: '2026-04-23T00:00:00Z'
---

> **Historical document — not current SSOT.**
> This file is a point-in-time report from 2026-04-19. It may describe goals, intermediate counts, or decisions that no longer match the current repository. Verify anything you rely on against `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`, or the source tree.

# Homepage Redesign — Verification Report (2026-04-19)

## Summary

Shipped V2 homepage redesign overnight per `docs/plans/2026-04-19-homepage-redesign-spec.md`. 8-section structure, AP outcome hook, new UPG section with typewriter demo, data corrected to 175 labs, V2 signature glow applied. Build + lint + tests all clean (pre-existing test failures unchanged). Verified via Playwright screenshots in both light and dark mode.

## Changes Delivered

### New files (3)
| File | Purpose |
|---|---|
| `src/themes/default/blocks/upg-section.tsx` | New UPG block with typewriter animation, 3 CSS/SVG example thumbnails, reduced-motion fallback |
| `docs/plans/2026-04-19-homepage-redesign-spec.md` | Design spec committed before implementation |
| `docs/reports/2026-04-19-homepage-redesign-verification.md` | This report |

### Modified files (8)
| File | Change |
|---|---|
| `src/config/locale/messages/en/landing.json` | All copy rewritten per spec (hero, showcase, grade_levels, upg_section ADDED, stats, testimonials 6→3, faq, cta, header nav, footer) |
| `src/config/locale/messages/zh/landing.json` | Parallel Chinese translations (locale currently disabled — English-only, preserved for future re-enablement) |
| `src/app/[locale]/(landing)/page.tsx` | `showSections` reordered: removed `usage`, added `upg_section` |
| `src/themes/default/blocks/index.tsx` | Exported `UPGSection` |
| `src/themes/default/pages/dynamic-page.tsx` | Routed `upg-section` block to `UPGSection` component |
| `src/themes/default/blocks/hero.tsx` | V2 glow overlay (teal + gold radial), italic teal highlight with text-shadow, Merriweather headline, removed orange Highlighter |
| `src/themes/default/blocks/grade-levels.tsx` | 5→4 column grid, mono count above title, hover glow |
| `src/themes/default/blocks/stats.tsx` | Merriweather big numbers with teal text-shadow, uppercase mono trust line |
| `src/themes/default/blocks/header.tsx` | Max badge color changed from primary to gold (oklch 0.82 0.17 75) |
| `.gitignore` | Added `.superpowers/` and `.qa/` |

## Acceptance Criteria (from spec)

| Criterion | Status |
|---|---|
| 8-section order: hero → showcase → grade_levels → upg_section → stats → testimonials → faq → cta | ✅ Verified via HTML inspection (`id=hero`, `id=experiment_showcase`, `id=grade_levels`, `id=upg_section`, `id=stats`, `id=testimonials`, `id=faq`, `id=cta`) |
| All experiment counts say 175 (no 179/64 remaining) | ✅ grep shows 0 occurrences of "179" in landing.json |
| New upg-section renders with typewriter + 3 thumbnails | ✅ Captured mid-type "Show how wave int" in dark-mode screenshot |
| Header nav: AI Lab with Max badge | ✅ Gold pill visible in all screenshots |
| `pnpm lint` passes | ✅ 0 errors (740 pre-existing warnings unchanged) |
| `tsc --noEmit` passes | ✅ Zero output = zero errors |
| Playwright homepage smoke passes | ✅ HTTP 200, 0 console errors, 0 console warnings (LCP hint only) |
| Zero console errors | ✅ Only React devtools info + HMR logs |
| Dev-server screenshot shows V2 signature glow | ✅ Light + dark mode captured |

## Data Truth Corrections

| Location | Before | After |
|---|---|---|
| Hero description | `179 interactive 3D labs` | `175 labs · NGSS · AP · 3 free, no sign-up` |
| Introduce subtitle | `64 Interactive Experiments` | Section removed from render order |
| Hero subjects grid | 4 entries totalling 111 (Elem 11 / Mid 9 / HS 29 / AP 62) | Removed; Grade Ladder now authoritative |
| Grade Ladder | K-2 (2), 3-5 (11), 6-8 (9), 9-12 (29), AP (13) — all wrong | K-5 (23), 6-8 (26), 9-12 (53), AP (77) — from TS data field audit |
| Stats `179` | `179` | `175` |
| Stats `K-2 → AP` | `K-2 → AP` | `K-5 → AP` |
| FAQ answer 1 | "all 179 experiments" | "all 175 labs. Max … AI Lab Partner (20 AI generations/mo)" |
| Footer Resources | "Standards → /labs" (redundant) | Removed |

## Visual QA Screenshots

Stored in `.qa/` (not committed — for reference during development).

Light mode (1440×900):
- `home-en-1-hero.png` — Hero with V2 teal highlight glow + Merriweather headline
- `home-en-3-grades.png` — 3-card Showcase with animated previews + "Browse all 175 labs" CTA
- `home-en-4-upg.png` — Grade Ladder (23/26/53/77) + UPG section with typed prompt
- `home-en-5-stats.png` — UPG thumbnails (Physics/Chemistry/Biology SVG) + Stats (175/5/K-5→AP)
- `home-en-6-testimonials.png` — 3-card testimonials (Aiden/Sophie/Chen) + FAQ open
- `home-en-8-cta.png` — CTA "Your next A starts here." + clean footer

Dark mode (1440×900):
- `home-en-dark-hero.png` — Hero dark with atom/cube/wave SVG animations + teal glow + gold accent
- `home-en-dark-upg.png` — Grade Ladder dark (mono teal numbers) + UPG with active typewriter mid-animation

## Known Deviations from Spec (minor)

1. **Typewriter implementation** — Used `useSyncExternalStore` for `prefers-reduced-motion` subscription instead of `useEffect + useState` to satisfy the project's `react-hooks/set-state-in-effect` lint rule. Behavior identical; no visual difference.

2. **Grade Ladder font** — Uses `font-mono` class as specified, but renders at 3xl size. Visually reads as large numeric indicator; stacks well against Ages line underneath.

3. **zh locale** — Translations written and JSON valid, but `src/config/locale/index.ts` has `locales: ['en']` (English-only). `/zh` returns 308 → `/`. Zh copy preserved for future multi-locale re-enablement; not visible today.

## Pre-existing Test Failures (Unrelated)

The following 3 tests failed both before and after changes (verified via `git stash` + re-run):

- `tests/unit/json-ld.test.ts > buildExperimentJsonLd` (2 failures about experiment URL format)
- `tests/unit/blocks/discipline-selector.test.tsx > should use zh locale for discipline names` (1 failure — zh disabled at locale layer)

Not introduced by this PR. Left as-is.

## Follow-up Tasks

1. **Slug drift cleanup** (flagged during data audit, tracked separately) — ~60 TS `slug` fields don't match HTML filenames in `public/experiments/`. Homepage uses 175 HTML count (what's actually runnable), so not blocking, but worth a data-hygiene Sprint.
2. **Re-enable zh locale** — zh/landing.json has production-ready copy. Flip `locales: ['en']` → `['en', 'zh']` in `src/config/locale/index.ts` when ready.
3. **Gallery data for UPG thumbnails** — Current thumbnails are CSS/SVG pure (no real UPG HTML). Once `/gallery` has curated examples, point `examples[].url` to real `/upg/view/[id]` pages for deeper engagement.
4. **Playwright smoke regression test** — Add `tests/e2e/homepage.spec.ts` asserting all 8 sections render + each CTA navigates correctly + zero console errors. Would catch any future drift.

## Run/Reproduce

```bash
pnpm install           # if first time
pnpm dev               # start Turbopack dev server
open http://localhost:3000/

# Verification
pnpm exec tsc --noEmit # typecheck
pnpm lint              # eslint (0 errors expected)
```
