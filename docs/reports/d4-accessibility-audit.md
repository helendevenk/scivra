---
name: d4-accessibility-audit
description: WCAG 2.1 AA accessibility audit of 175 public HTML simulations
type: report
created: 2026-05-04T00:00:00Z
updated: 2026-05-04T00:00:00Z
---

# D4 Accessibility Audit — 175 Public HTML Simulations

**Audit date:** 2026-05-04
**Files audited:** all 175 `.html` files under `public/experiments/`
**Standard:** WCAG 2.1 AA
**Method:** static heuristic scan (Python; 175/175) + codex deep review of 5 sample files (1 K-5, 1 MS, 2 AP, 1 ESS)

## Executive summary — systemic findings

This audit confirms that **the 175 simulations share a templated codebase with the same set of accessibility issues across nearly every file**. Per-file fixes are wasteful; the cost-effective path is template-level remediation.

| Issue | Files affected | Severity | WCAG ref |
|---|---:|---|---|
| No `prefers-reduced-motion` media query | **175 / 175 (100%)** | 🔴 high | 2.2.2 |
| No explicit `:focus` / `:focus-visible` styles | **175 / 175 (100%)** | 🔴 high | 2.4.7 |
| Form controls (sliders) lack accessible labels | **173 / 175 (99%)** | 🔴 high | 4.1.2 |
| No semantic landmarks (main / nav / aside) | 50 / 175 (29%) | 🟡 medium | 1.3.1 |
| Heading hierarchy missing or starts at h3 | (most files via deep review) | 🟡 medium | 1.3.1 |
| Low contrast on muted text (`#64748b` on `#0f172a` ~ 3.75 : 1) | (template-wide) | 🔴 high | 1.4.3 |
| Low contrast on white text over bright gradient buttons (down to 1.81 : 1) | (template-wide) | 🔴 high | 1.4.3 |
| Color-only signaling (vectors, codons, base pairs, correct/wrong) | (template-wide) | 🟡 medium | 1.4.1 |
| WebGL canvas containers lack accessible name | (every interactive scene) | 🟡 medium | 1.1.1 |

This is a **catalog-blocking accessibility posture for K-12 educational use**. School districts subject to Section 508 / WCAG 2.1 AA procurement requirements would fail compliance review on the simulation pages.

## Brand-spec conflict

Scivra's `CLAUDE.md` Design Principles explicitly state:
> 动效：偏克制的微动效，**尊重 `prefers-reduced-motion`**

> Accessibility:
> - 标准：WCAG 2.1 AA
> - 动效：尊重 `prefers-reduced-motion`

Yet 175/175 simulations violate this. The brand spec is aspirational; the actual code does not implement it. This needs a brand-spec-vs-code reconciliation in the next cycle.

## Per-file deep review (5-file codex sample, gpt-5-codex unavailable; account-default model used)

### k5-physics-light-propagation.html
- No `<h1>`; sidebar block titles use `div.sidebar-title`
- Light Angle, Object Size, Refraction Index n sliders all lack `label[for]` / `aria-labelledby`
- Slider `outline: none` removes the focus ring without alternative
- `renderer.setAnimationLoop` runs persistently; spectrum pulses; no `prefers-reduced-motion` branch
- ROYGBIV spectrum letters use `#64748b` on `#0f172a` (≈3.75:1, below 4.5:1 minimum)
- Spectrum and rays distinguish primarily by color (no non-color alt)
- WebGL canvas container has no `role`, `aria-label`, or text equivalent
- **Summary:** The k5 file shows the systemic pattern most clearly: no semantic structure, no slider names, invisible focus, automatic motion, color-only spectrum

### ms-genetics.html (post-Wave-1 Hardy-Weinberg version)
- No nav/main/aside/section + no h1-h3
- 4 sliders (Mutation Rate, Generations, Initial p, Helix Rotation Speed) lack accessible names
- Buttons, quiz options, sliders all lack uniform `:focus-visible` styles
- `data-label` uses `#64748b` (low contrast)
- Active button white text on `#EC4899→#F97316` gradient: contrast ratio 2.80–3.53:1 (fails 4.5:1)
- `simState.running = true` by default; DNA rotates and gene markers pulse without `prefers-reduced-motion` check
- Color encoding for bases, dominant/recessive, gene locus, correct/wrong without non-color alternative
- **Summary:** Worst on semantic structure + control naming; default-on motion + low-contrast gradient buttons + color-only encoding

### circular-motion.html
- No `<main>` / no `<h1>`; sidebar block titles are `div.sidebar-title`
- 3 sliders (Mass, Speed, Radius) lack `label`/`aria-labelledby`
- Slider `outline: none` with no alternative focus indicator
- Sphere in continuous circular motion; only a speed-multiplier control, **no pause button**, no `prefers-reduced-motion` branch
- `#e-mode` text uses `#64748b` (low contrast)
- Velocity, centripetal acceleration, gravity arrows distinguished only by green/red/orange — no legend / texture / text binding
- WebGL canvas has no `role` / `aria-label` / `aria-describedby`
- **Summary:** Continuous motion with no pause is the highest-risk issue; vectors color-only

### protein-synthesis.html
- No h1/h2; sidebar + modals jump straight to `<h3>`; no `<main>`
- 2 sliders (Animation Speed, Zoom) lack accessible names
- Slider `outline: none` with no alt focus indicator
- **Quiz options are `<div>` with `onclick` — not Tab-focusable, no role/button, no keyboard event handlers** (WCAG 2.1.1 keyboard accessible)
- `.btn-bio` white text on `#10B981→#22D3EE` gradient: 1.81–2.54:1 (fails 4.5:1, fails even 3:1 for large text)
- `renderer.setAnimationLoop` always runs; amino-acid bead bounce and helix rotation animate even when synthesis isn't playing; no `prefers-reduced-motion`
- Codon table, protein chain, active speed, correct/wrong color-coded; correct/wrong has text feedback but lacks `aria-live`
- Canvas missing accessible name
- **Summary:** Adds two beyond-template issues — quiz options not keyboard-operable, plus the worst gradient contrast in the sample (1.81:1)

### plate-tectonics.html
- **File does not exist** at the requested path. The closest siblings are `public/experiments/earth-science/plate-tectonics-advanced.html` and `public/experiments/middle/ms-plate-tectonics.html`.
- **Action:** decide whether to (a) restore/rename, (b) re-audit one of the actual siblings, or (c) accept that the K-5 → AP cluster excludes a basic plate-tectonics simulation and depend on the MS / advanced versions.

## Recommended remediation roadmap (codex priority order)

| Priority | Action | Effort | Files affected |
|---:|---|:---:|---:|
| 1 | Add `:focus-visible` ring to template + remove `input[type="range"]` `outline: none` (or provide equivalent) | S | 175 |
| 2 | Add real `label[for]` / `aria-labelledby` to every slider/select/checkbox + `aria-valuetext` for unitized values | M | 175 |
| 3 | Fix color tokens: bright-gradient buttons cannot use white small text; raise `#64748b` to ≥4.5:1 contrast | M | 175 |
| 4 | Unify semantic skeleton: `<h1>` per page, `<main>`, `<nav>`, `<aside>` / `<section>` / `<region>`; promote div titles to `<h2>`/`<h3>` | M | 175 |
| 5 | Add `prefers-reduced-motion` handling + visible Pause/Play; on pause, stop three.js scenes, pulses, toast slide-ins, bead bounce, etc. | M | 175 |
| 6 | Replace color-only signals: `aria-pressed` / `aria-current`, text legends, icons, patterns, DOM data summaries, `aria-live` correct/wrong feedback | M | 175 |
| 7 | Give WebGL canvas containers accessible names + descriptive text equivalents | S | 175 |
| 8 | Resolve `earth-science/plate-tectonics.html` 404 — decide restore / rename / re-target | S | 1 |

**Total estimated effort:** 5 M-sized remediations + 3 S-sized = ~5–8 weeks if done by a single engineer; ~2–3 weeks with parallel implementation. **Recommended approach:** template-level edit propagated to all 175 files via codex batch (similar to D4 Phase C C3 batch pattern), then per-file QA pass.

## Methodology

1. **Static scan (175/175):** Python script checks `<html lang>`, `<title>`, viewport meta, `<img>` alt, form-control `label`/`aria-label`, `prefers-reduced-motion` media query, `:focus` styles, `tabindex="-1"`, semantic landmarks, empty-text `<button>`. Saved to `/tmp/a11y-static-scan.json`.
2. **Deep review (5 sample files):** Codex (account-default model — `gpt-5` / `gpt-5-codex` not available on this ChatGPT account) read each file and produced structured JSON of issues per WCAG criterion.
3. **Aggregation:** Static + deep findings combined; severity assigned per WCAG 2.1 AA failure criteria; remediation steps derived from codex's roadmap.

## Caveats

- The user's preferred review model (`gpt-5`) was not available on the ChatGPT account; account-default codex model was used.
- 5-file deep sample is small; a follow-up cycle should expand the sample if the template is to be modified.
- This audit does not test with assistive technology (screen readers, switch devices) — it identifies WCAG-checkable static failures only. Real AT testing remains a separate cycle.
- Color contrast ratios are estimated from CSS color values; should be verified with a calibrated tool (e.g., axe DevTools, Lighthouse) once template-level fixes ship.

## Out-of-scope (deferred)

- Implementation of fixes (separate cycle)
- React/R3F app routes accessibility (this audit is HTML simulations only)
- AP Prep / chat / settings UI accessibility (separate audit)
