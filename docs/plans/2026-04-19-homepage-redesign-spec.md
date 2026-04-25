---
name: homepage-redesign-spec
status: in-progress
created: 2026-04-19T00:00:00Z
updated: 2026-04-19T00:00:00Z
---

# Homepage Redesign Spec (2026-04-19)

## Problem Statement

Current Scivra homepage (8 sections) has **structural**, **narrative**, **data**, and **visual** problems:

| Issue | Evidence |
|---|---|
| Experiment count drift | Hero/Stats/FAQ say `179`, Introduce says `64`, real HTML count is `175` |
| Hero subject distribution inconsistent | Hero subjects: Elem 11 + Middle 9 + HS 29 + AP 62 = 111 ≠ 175 |
| Grade-ladder counts wrong | K-2: 2, AP: 13 in JSON vs actual K-2: 2, AP: 77 in data |
| UPG (AI generation) invisible | Only header link "3D Lab"; no homepage section explains it |
| Differentiation narrative missing | No `vs PhET / vs arXiv:2412.07482 / vs Algodoo` positioning |
| Visual signature weak | `edu-academic` theme exists (394 LOC) but Hero lacks V2 signature glow |
| Dead copy | Logos section in JSON but never rendered; Introduce contradicts Hero |
| Generic CTA | Hero and ending CTAs repeat "Try Your First Experiment" |

**Out of scope** (tracked as separate follow-up tasks):
- Slug drift between TS data (179) and HTML files (175) — ~60 slug mismatches; data hygiene task
- Mobile-specific layout QA (existing issue; not regressed by this change)
- UPG v1/v2 A/B test (separate plan)

## Decisions (Q1–Q7, already agreed with user)

| # | Question | Decision |
|---|---|---|
| Q1 | Primary user | **High-school / AP student (14–18)** — direct, fast, cool; parent/teacher secondary |
| Q2 | UPG prominence | **Second engine** — Hero stays about 175 labs; dedicated UPG section at position ④ |
| Q3 | Hero narrative hook | **A · Outcome-driven** — "Your next A in AP Physics starts with one experiment." |
| Q4 | Section skeleton | **Y · Evidence flow** — 8 sections: Hero → Showcase → Grade Ladder → UPG → Stats → Testimonials → FAQ → CTA |
| Q5 | UPG section format | **B · Looping animation + real thumbnails** — fake-typed prompt cycles, 3 pre-generated thumbnails link to `/upg` |
| Q6 | Public experiment count | **175** (actual HTML); grade bands K-5 (23) / 6-8 (26) / 9-12 (53) / AP (77) from TS data |
| Q7 | Visual signature | **V2 · Signature Glow** — teal primary glow, gold accent, Merriweather headline + Space Grotesk body + JetBrains Mono data |

## Target Section Order (final)

```
① Hero                        — AP outcome hook
② Experiment Showcase         — 3 proof cards (Physics/Biology/Chemistry)
③ Grade Ladder                — K-5 / 6-8 / 9-12 / AP escape hatch
④ UPG · AI Lab Partner        — NEW: looping prompt animation + 3 thumbnails
⑤ Stats                       — 175 / 5 / K-5 → AP trust band
⑥ Testimonials                — 6 → 3 (2 AP students + 1 teacher)
⑦ FAQ                         — 4 items (price, coverage, sign-up, safety)
⑧ CTA                         — "Your next A starts here."
```

**Removed:** `usage` (How It Works) — redundant after Showcase + UPG demo.
**Removed:** `logos` — was defined but never rendered; replaced by trust line inside Stats.

## Section-by-Section Spec

### ① Hero

**Goal:** 5-second AP student grab. Communicate outcome ("your A"), show two clear paths (free lab / AP prep).

**Copy:**
- Title: `Your next A in AP Physics starts with one experiment.`
- Highlight: `starts with one experiment.` (V2 italic teal with text-shadow glow)
- Description: `Stop rereading the textbook. Launch a 3D lab, tweak the numbers, watch physics happen — and actually understand the answer before the exam.`
- Meta line: `175 labs · NGSS · AP · 3 free, no sign-up`
- Primary CTA: `Start with a free lab →` → `/labs`
- Secondary CTA: `See AP Prep path` → `/ap-prep`

**Visual (V2):**
- Existing `HeroBackground` stays (3D cube/atom/wave animation is strong).
- Add gold radial glow top-right overlay: `radial-gradient(circle at 85% 15%, rgba(251,191,36,0.08), transparent 55%)`.
- Primary button gains teal glow: `box-shadow: 0 0 0 1px rgba(45,212,191,.4), 0 4px 16px rgba(45,212,191,.28), 0 0 32px rgba(45,212,191,.18)`.
- Headline: Merriweather serif, balanced wrap, tight letter-spacing.
- Subjects grid REMOVED from Hero (duplicated by Grade Ladder below).
- Student image: keep current `student-discovery.png` pair.

**A11y:** `prefers-reduced-motion` disables glow pulse; button contrast ≥ 4.5:1.

---

### ② Experiment Showcase

**Goal:** Prove the product works. 3 cards that cover 3 subjects and 2 grade bands.

**Copy:**
- Title: `Real labs. Running in your browser. Right now.`
- Description: `No downloads, no setup. Click any card to jump straight in.`
- CTA: `Browse all 175 labs →` → `/labs`

**Cards** (keep existing 3):
1. **Projectile Motion** · Physics · 9-12 · `/labs/physics/ngss-hs/projectile-motion`
2. **DNA Double Helix** · Biology · AP · `/labs/biology/ap-biology/dna-double-helix`
3. **Chemical Equilibrium** · Chemistry · AP · `/labs/chemistry/ap-chemistry/chemical-equilibrium`

**Visual:**
- Cards use subject-tinted hover glow via `data-subject` attribute (teal = Physics, green = Chem, lime = Bio).
- Keep existing animated `experimentAnimations` for preview on hover (already wired in `experiment-showcase.tsx`).

---

### ③ Grade Ladder

**Goal:** K-8 escape hatch — if Hero's AP framing doesn't apply, give clear path.

**Copy:**
- Title: `Not in AP yet? Pick your level.`
- Description: `Every lab aligned to NGSS (US) or GCSE (UK).`
- Trust badges: `NGSS · GCSE · AP Physics · AP Chemistry · AP Biology`

**Items** (change from 5 → 4; merge K-2 + 3-5 into K-5):

| Title | Age | Count | Description | URL |
|---|---|---|---|---|
| K-5 Elementary | Ages 5-10 | 23 | Forces, light, magnets, water cycle | `/labs?grade=K-5` |
| 6-8 Middle School | Ages 11-13 | 26 | Newton's laws, ecosystems, weather | `/labs?grade=6-8` |
| 9-12 High School | Ages 14-17 | 53 | Mechanics, waves, circuits | `/labs?grade=9-12` |
| AP | College Prep | 77 | Physics, Chemistry, Biology | `/labs?grade=AP` |

**Visual:**
- 4-column grid (was 5) — `lg:grid-cols-4`.
- Large count in JetBrains Mono teal with glow.
- Hover → teal border glow.

---

### ④ UPG · AI Lab Partner (NEW block)

**Goal:** Differentiation hook — "you can also build your own." Transition to `/upg`.

**Copy:**
- Section label (purple): `AI SUPERPOWER · Max plan`
- Title: `Can't find your concept? Describe it. AI builds it.`
- Highlight: `Describe it.` (purple with glow)
- Description: `Your AI Lab Partner generates a working 3D simulation from any prompt. Real HTML. Real physics. Real < 30 seconds.`
- Prompt rotation (4 prompts cycle every 4s with typing effect):
  1. `Simulate Bohr's hydrogen atom with electron transitions`
  2. `Show how wave interference creates dark fringes`
  3. `Build a VSEPR model of methane`
  4. `Animate mitosis through all four phases`
- Primary CTA: `Try AI Lab (Max plan) →` → `/upg`
- Thumbnail section: 3 cards linking to showcase UPG examples
- Fine print: `Max plan · 20 AI labs/mo · student price $9.99`

**Thumbnails (pre-rendered, no real gallery data needed):**
- 3 CSS/SVG animated tiles representing Physics (orbitals), Chemistry (VSEPR), Biology (cell division)
- Each tile → `/upg` (or `/gallery` if gallery has content)
- Author attribution faked as "@aiden / @priya / @marcus" (matches testimonial names for narrative consistency)

**Technical:**
- New component: `src/themes/default/blocks/upg-section.tsx` (`'use client'`)
- Typewriter hook: cycling through prompts array, pause 1.5s at end of each, delete, type next
- Respects `prefers-reduced-motion`: shows static prompt instead of animation
- Caret `::after` with blink animation

**Visual:**
- Section background: `linear-gradient(135deg, rgba(192,132,252,.04), rgba(45,212,191,.03))` + subtle grid
- Prompt input box: dark glass, teal border glow
- Primary button: purple → teal gradient `linear-gradient(135deg, #c084fc, #2dd4bf)`
- Thumbnails: aspect-ratio 4/3, CSS-only illustrations

---

### ⑤ Stats

**Goal:** Trust band with real numbers. Replace dead Logos section.

**Copy:**
- Title: `Built for better grades.`
- Description: `Standards-aligned so you study what's actually on the exam.`
- Items:
  - `175` — `Interactive 3D Labs`
  - `5` — `Science Subjects`
  - `K-5 → AP` — `Every Grade Level`
- Trust line: `Aligned with NGSS · GCSE · AP Physics · AP Chemistry · AP Biology`

**Visual:**
- Big numbers in Merriweather with teal glow text-shadow.
- Trust line below in muted mono.

---

### ⑥ Testimonials

**Goal:** Social proof focused on AP-student success.

**Items** (cut from 6 → 3, keep AP-focused):
1. **Aiden M.** · 11th Grade, California — `"I went from a C to an A- in AP Physics. The projectile motion sim made everything click — I could literally see why the equations work."`
2. **Sophie L.** · AP Biology, Oregon — `"The DNA helix experiment helped me score a 5 on my AP Bio exam. Being able to rotate and zoom into the structure made memorization unnecessary."`
3. **Mr. David Chen** · AP Physics Teacher, Virginia — `"I assign Scivra experiments as pre-lab work. My students come to class already understanding the concepts — that never happened with textbooks."`

**Removed:** Priya K., Marcus J., Jennifer T. (parent, middle, ninth grader — dilute AP narrative)

**Visual:**
- 3-column grid.
- Left-border teal accent on each card.
- Quote in italic, attribution in mono.

---

### ⑦ FAQ

**Goal:** Remove last objections.

**Items** (keep all 4, update copy to match new facts):
1. **Is Scivra free?** — `Yes. Everyone gets 3 free labs. Pro ($4.99/mo) unlocks all 175. Max ($9.99/mo) also unlocks the AI Lab Partner (20 AI generations/mo).`
2. **Which grades and exams are covered?** — `K-5 through AP. Every lab aligned to NGSS (US), GCSE (UK), or AP (College Board). Covers Physics, Chemistry, Biology, Earth Science, and Math.`
3. **Do I need to install anything?** — `No. Scivra runs in any modern browser on desktop, tablet, or phone. No downloads, plugins, or special hardware.`
4. **Is student data safe?** — `GDPR and COPPA compliant. Age-gating, consent management, and one-click data export or deletion.`

**Support line:** `Still have questions? Email support@scivra.com`

---

### ⑧ CTA

**Goal:** Close. Mirror Hero.

**Copy:**
- Title: `Your next A starts here.`
- Description: `3 free labs · No credit card · No sign-up`
- Primary: `Launch a free lab →` → `/labs`
- Secondary: `See plans` → `/pricing`

**Visual:**
- Centered layout with radial teal glow behind.
- First/last echo rhyme with Hero title for bookend narrative.

## Peripheral Changes

### Header Nav (`header.nav.items`)

Replace `3D Lab` with `AI Lab` and add Max badge:

| Title | URL | Icon | Badge |
|---|---|---|---|
| Elementary | `/labs?grade=K-5` | Smile | — |
| Middle School | `/labs?grade=6-8` | BookOpen | — |
| High School | `/labs?grade=9-12` | GraduationCap | — |
| AP | `/labs?grade=AP` | Award | — |
| **AI Lab** | `/upg` | Sparkles | `Max` (gold pill) |
| Pricing | `/pricing` | DollarSign | — |

### Footer

Remove `Standards` link pointing to `/labs` (redundant); otherwise unchanged.

### i18n

Create parallel Chinese copy in `src/config/locale/messages/zh/landing.json`. Maintain existing translations where narrative works (don't over-translate idioms like "Your next A"). Chinese URLs use same paths (`/labs?grade=K-5`).

**Key Chinese copy decisions:**
- Hero title: `下一次 AP 考试，从一节 3D 实验开始拿 A。` (adapted, not literal)
- UPG: `找不到你要的概念？说出来，AI 帮你造一个。`
- Grade ladder: `还不到 AP？选你的年级。`

## Visual System Reference

All values derived from existing `src/config/style/theme-education.css`. No new CSS tokens needed.

```css
/* Primary signature glow (V2) */
--hero-button-glow:
  0 0 0 1px oklch(0.78 0.15 192 / 0.4),
  0 4px 16px oklch(0.78 0.15 192 / 0.28),
  0 0 32px oklch(0.78 0.15 192 / 0.18);

--hero-highlight-text-shadow: 0 0 20px oklch(0.78 0.15 192 / 0.5);

--upg-section-bg:
  linear-gradient(135deg,
    oklch(0.75 0.18 300 / 0.04),
    oklch(0.78 0.15 192 / 0.03));

--gold-accent-glow: oklch(0.82 0.17 75 / 0.12);
```

Typography (already in theme):
- Headline: `Merriweather, Georgia, serif`
- Body: `Space Grotesk, system-ui, sans-serif`
- Data: `JetBrains Mono, monospace`

## Accessibility

| Requirement | Implementation |
|---|---|
| Reduced motion | All typewriter animations + pulse glows disabled under `prefers-reduced-motion: reduce` |
| Color contrast | All text vs background ≥ 4.5:1 (WCAG AA); teal glows are decorative only |
| Keyboard nav | All CTAs Tab-reachable; focus ring = teal primary with outline-offset |
| Color blindness | Subject distinctions in Showcase use icon + label + color (not color alone) |
| Screen readers | UPG typewriter has `aria-live="polite"` label with static description; decorative SVG `aria-hidden="true"` |

## Testing

### Unit / Integration
- Update `src/app/[locale]/(landing)/page.tsx` section list; test that `showSections` matches new 8.
- Snapshot test for new `upg-section.tsx` block (static render, no animation).
- i18n fallback: verify both `en` and `zh` render without missing-key errors.

### E2E (Playwright)
- Homepage loads for `en` and `zh` locales.
- Hero primary CTA navigates to `/labs`.
- Grade Ladder count chips link to `/labs?grade=*`.
- UPG section CTA navigates to `/upg`.
- Zero console errors on load.

### Visual QA
- Dev server screenshot comparison (before/after) via Playwright at 1440×900 + 375×812.
- Manual check: dark mode + reduced-motion + keyboard-only nav.

### Build
- `pnpm typecheck` passes
- `pnpm lint` passes
- `pnpm build` passes (Turbopack)
- `pnpm test` existing suite still green

## Acceptance Criteria

- [ ] New homepage matches the 8-section order above
- [ ] All experiment counts say `175` (no 179 / 64 remaining)
- [ ] New `upg-section` block renders with typewriter + 3 thumbnails
- [ ] Header nav shows `AI Lab · Max` instead of `3D Lab`
- [ ] `en` and `zh` translations both complete
- [ ] `pnpm build` and `pnpm test` pass
- [ ] Playwright homepage smoke test passes
- [ ] Zero console errors in browser dev tools
- [ ] Dev-server screenshot shows V2 signature glow on Hero + UPG

## Deliverables

1. **Spec:** this document (`docs/plans/2026-04-19-homepage-redesign-spec.md`)
2. **Implementation plan:** generated by `writing-plans` skill → `docs/superpowers/plans/2026-04-19-homepage-redesign-plan.md`
3. **Code:** single atomic PR / commit series on `main` (feature branch optional)
4. **Verification:** screenshots at `docs/reports/2026-04-19-homepage-redesign-verification.md`

## Non-Goals

- Don't rewrite `/labs`, `/upg`, `/ap-prep`, or any internal page.
- Don't rename routes; reuse existing `/labs/**`, `/upg`, `/pricing`.
- Don't touch backend / database schema.
- Don't ship Chinese Hero image variant (only English image pair exists; zh reuses).
