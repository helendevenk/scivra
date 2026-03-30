---
name: experiments-v2-generation-handoff
status: in-progress
created: 2026-03-30T00:42:25Z
updated: 2026-03-30T00:42:25Z
---

# Handoff: experiments-v2 HTML Generation (177 files)

## Task Summary

Regenerating all 177 interactive experiment HTML files for Scivra using **aetherviz-master v7.0**. Files write to `public/experiments-v2/{category}/` without touching originals in `public/experiments/`.

## Current Status

**Overall: 164/177 files passing ≥500 line quality gate. 13 remaining.**

| Category | Files | Status |
|----------|-------|--------|
| ap-physics | 73 | ✅ All ≥500 lines |
| ap-biology | 20 | ✅ All ≥500 lines |
| ap-chemistry | 17 | ✅ All ≥500 lines |
| ap-physics-c | 5 | ✅ All ≥500 lines |
| earth-science | 17 | ✅ All ≥501 lines |
| elementary (K5) | 25 | ✅ All ≥500 lines (25 = 24 plan + 1 extra: k5-energy-conversion.html) |
| middle | 20 | ❌ 13 files stuck at 437 lines (truncated) |

## Remaining Work (ONE task left)

### Middle School: 13 files at exactly 437 lines (truncated, need regeneration)

All 13 at exactly 437 lines means a previous generation was cut off. Regenerate from scratch:

```
/Users/sky/Desktop/Scivra/Scivra/public/experiments-v2/middle/
- ms-genetics-punnett.html       (437 lines → need ≥600)
- ms-acid-base-reactions.html    (437 lines → need ≥600)
- ms-cell-division-comparison.html (437 lines → need ≥600)
- ms-chemical-bonding.html       (437 lines → need ≥600)
- ms-chemical-stoichiometry.html (437 lines → need ≥600)
- ms-earthquake-epicenter.html   (437 lines → need ≥600)
- ms-ecosystems.html             (437 lines → need ≥600)
- ms-electric-circuits-advanced.html (437 lines → need ≥600)
- ms-force-motion-graphs.html    (437 lines → need ≥600)
- ms-genetics.html               (437 lines → need ≥600)
- ms-photosynthesis-respiration.html (437 lines → need ≥600)
- ms-plate-tectonics.html        (437 lines → need ≥600)
- ms-wave-interactions-advanced.html (437 lines → need ≥600)
```

### After that: final quality audit command

```bash
for f in /Users/sky/Desktop/Scivra/Scivra/public/experiments-v2/**/*.html; do
  lines=$(wc -l < "$f")
  if [ "$lines" -lt 500 ]; then echo "$lines $f"; fi
done | sort -n
```

Expected result: zero output (all files ≥500).

Then update `.ralphfree/STATUS.md` → Phase 5 complete, task COMPLETED.

## Immediate Next Steps

1. Launch an agent to regenerate the 13 Middle School files (all need ≥600 lines)
2. Run final quality audit
3. Mark STATUS.md as COMPLETED

## Technical Requirements (MUST meet for every generated file)

- **CDNs**: Three.js r134 (`cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js`), Tailwind (`cdn.tailwindcss.com`), KaTeX 0.16.11 (`cdn.jsdelivr.net/npm/katex@0.16.11/dist/...`)
- **Inline OrbitControls**: full JS implementation embedded, NOT from CDN
- **Animation**: `renderer.setAnimationLoop(...)` ONLY — never `requestAnimationFrame`
- **Sliders**: ≥2 interactive sliders with live value labels
- **Quiz**: exactly 3 questions, radio buttons, Check Answer button, colored feedback
- **Presets**: ≥3 named presets (descriptive names, NOT "Preset 1")
- **Speed controls**: 5-speed buttons (0.25x, 0.5x, 1x, 2x, 3x)
- **Toast**: top-right, 2s auto-dismiss
- **Keyboard**: Space=play/pause, R=reset
- **Lighting**: 3-point (keyLight 1.0 + fillLight 0.4 + backLight 0.3 + AmbientLight 0.5)
- **Left sidebar**: objectives + KaTeX formulas + explanations + applications
- **Data overlay**: absolute top-left on canvas, 4-6 live measurements
- **Language**: English only
- **Subject color (Middle School)**: `linear-gradient(135deg, #EC4899 0%, #F97316 100%)`
- **Background**: `new THREE.Color(0x0f172a)` (NOT pure black)
- **Minimum lines**: 600 (to safely exceed 500-line gate)
- **Buttons**: use `addEventListener` not `onclick="..."` on HTML elements

## File Count Notes

- Plan called for 176 files. Actual = 177 (extra: `k5-energy-conversion.html` — keep it, harmless)
- Middle School: 20 files total, 7 already pass (ms-atoms-molecules was 341 but is now OK? — verify)

Wait, check ms-atoms-molecules specifically:

```bash
wc -l /Users/sky/Desktop/Scivra/Scivra/public/experiments-v2/middle/ms-atoms-molecules.html
```

The 13 failing files listed above do NOT include ms-atoms-molecules, ms-newtons-laws, ms-energy-conservation, ms-chemical-reactions, ms-food-web-dynamics, ms-moon-phases-detailed, ms-weather-systems — those 7 apparently already pass.

## Progress Tracking

`.ralphfree/STATUS.md` — authoritative progress file at `/Users/sky/Desktop/Scivra/Scivra/.ralphfree/STATUS.md`

Phase 5 tasks:
- [x] Task 18: Batch quality check (done — found 53 files failing, then repaired down to 13)
- [ ] Task 19/20: Repair remaining 13 Middle School files → verify → mark COMPLETED

## Context: What Was Done Across Sessions

**Session 1 (2026-03-28)**: Generated all 176 files across 6 batches (AP Physics 73, AP Bio 20, AP Chem 17, AP Physics C 5, Earth Science 17, K5 24, Middle 20). Multiple rate limit hits (2pm and 7pm Shanghai time) — recovered by relaunching after reset.

**Session 2 (2026-03-29/30)**: Quality audit found 53 files under 500 lines. Ran 6 parallel repair agents. Rate limits hit again (most agents got 0 tokens). Only 2 agents succeeded:
- Earth Science Batch B (7 files): ✅ fixed
- K5 Group B (8 files): ✅ fixed

**Session 3 (2026-03-30, this session)**: Re-ran repair agents. K5 Group A (10 files) and K5 Group B verified. Earth Science all verified. AP Physics verified. Middle School repair agent was rejected by user (interrupted). 13 Middle School files remain at 437 lines.

## Architecture Decisions (DO NOT change)

- Output to `public/experiments-v2/` — DO NOT write to `public/experiments/` (originals preserved)
- Each file is standalone (no external deps beyond CDNs)
- No server required — files open directly in browser
