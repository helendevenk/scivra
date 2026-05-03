---
name: d4-html-js-quality-audit
description: JavaScript code-quality and correctness audit of 175 public HTML simulations
type: report
created: 2026-05-04T00:00:00Z
updated: 2026-05-04T00:00:00Z
---

# D4 HTML JS Code-Quality Audit — 175 Public Simulations

**Audit date:** 2026-05-04
**Files audited:** all 175 `.html` files in `public/experiments/`
**Method:** static heuristic scan (Python; 175/175) + codex deep review of 8 sample files (across AP Physics / AP Chem / AP Bio / AP Phys-C / K-5 / MS)

## Executive summary

The simulation template uses a similar inline-JS pattern across all 175 files. **No security-critical issues** (eval / Function constructor) were detected, but **multiple systemic correctness, leak, and architecture issues** affect every file in the sample. Several files have additional **per-file bugs**: nonfunctional controls, broken physics models, accumulating resource leaks.

## Static scan baseline (175/175 files)

| Issue | Files | Severity | Notes |
|---|---:|---|---|
| Uses `var` instead of `let`/`const` | 175 / 175 | nit | Legacy JS style; non-blocking |
| No `'use strict'` directive | 175 / 175 | nit | Modern modules don't strictly need it |
| `innerHTML = <dynamic_value>` pattern | 106 / 175 (61%) | important | XSS risk if any content becomes user/CMS-sourced |
| `requestAnimationFrame` without matching `cancelAnimationFrame` | 1 / 175 | important | Specific file; minor footprint |
| `setAnimationLoop` without cleanup path | 1 / 175 | important | Specific file |

## Common systemic issues (codex deep review of 8 sample files)

| ID | Severity | Description | Remediation |
|---|---|---|---|
| `cdn-inline-supply-chain` | important | All files load CDN scripts (three.js / Tailwind / KaTeX) inline without SRI pinning, blocking strict CSP | Pin versions with `integrity`/`crossorigin`, prefer bundled assets, move inline JS to CSP-compatible external modules |
| `orbitcontrols-lifecycle` | important | Each file embeds a custom inline OrbitControls variant; empty/missing `dispose()`, anonymous listeners that cannot be removed, no caller teardown | Use official OrbitControls module or shared local impl with full `dispose()`, document-level drag handling, non-passive wheel where `preventDefault` is needed, page-unload cleanup |
| `webgl-resource-lifecycle` | important | Scene objects are removed or geometries are replaced without consistently disposing geometries/materials; no full renderer/scene disposal path | Introduce `disposeObject3D(object)` that traverses children and disposes geometry/material/texture; on teardown call `renderer.setAnimationLoop(null)`, `controls.dispose()`, `renderer.dispose()` |
| `animation-loop-cleanup` | important | All files use `renderer.setAnimationLoop` but never stop it on page hide/unload; tolerable for static page nav, leaks CPU/GPU in embedded contexts | Add `visibility`/`pagehide` handlers or a teardown hook |
| `frame-allocation-and-dom-churn` | important | Several files allocate `THREE.Vector3`/`Quaternion`/`BufferGeometry` or update DOM text every rendered frame, causing GC pressure | Reuse scratch vectors/quaternions, update `BufferGeometry` attributes in place, throttle HUD updates to slider changes |
| `dynamic-innerhtml-templates` | important | Some files build quiz/codon UI with template strings + inline `onclick` — current data is static but the pattern is XSS-prone if content is externalized | Build DOM nodes with `textContent` + `addEventListener`, or sanitize trusted HTML before insertion |
| `globals-and-inline-event-api` | nit | Many functions/state variables on global scope for inline `onclick`/`oninput` handlers; risk of collision in embedded contexts | Wrap each experiment in IIFE/module; expose minimal explicit API if inline HTML compatibility is required |

## Per-file deep findings (8-file codex sample)

### circular-motion.html (AP Physics)
- **Important:** `loadPreset()` and `setSpeed()` read non-standard global `event`; `loadPreset('conical')` called from `DOMContentLoaded` without an event arg can throw or behave browser-specifically (lines 349-352, 397-400, 536-539)
- **Important:** Custom OrbitControls has empty `dispose()`; adds anonymous document `mouseup` listener on every `mousedown` — these listeners cannot be removed (lines 196-200, 229)
- **Important:** Animation loop disposes & recreates `BufferGeometry` for the string and trail every frame — unnecessary GPU churn (lines 453-462)
- **Important:** Per-frame `Vector3`/`Quaternion` allocations in `getBallPosition`/vector display paths; clones for every arrow update (lines 419-435, 446-482)
- **Important:** Conical pendulum geometry uses `radius+0.5` for string height while displayed angle uses `atan(v²/(rg))` (banked-curve relation) — geometry and reported angle don't represent a consistent conical pendulum model (lines 419-424, 502-512)
- **Nit:** Total energy bar hard-coded to 80%, doesn't reflect computed total (lines 514-521); pixel ratio uncapped on high-DPI; `omega_ref` computed but never used

**Summary:** No eval/Function; main risks are init fragility, render-loop resource churn, and inconsistent physics display.

### doppler-effect.html (AP Physics)
- **Important:** `calcDoppler` uses simplified ahead/behind formulas that don't actually use source/observer relative positions — moving-observer cases can report the wrong observed frequency for the displayed geometry (lines 280-298, 444-447)
- **Important:** Supersonic preset sets `vs=412` while source-speed range input max is 300 → UI/model mismatch or browser-clamping behavior (line 132 / 321-331)
- **Important:** Source wraps from `+ARENA_HALF` to `-ARENA_HALF` but existing wavefronts remain in world space — visualization discontinuity + incorrect compression coloring (lines 440-455, 472-485)
- **Important:** OrbitControls binds `mousemove`/`mouseup` to canvas element — releasing mouse outside canvas can leave `isRotating`/`isPanning` stuck (lines 193-199)
- **Nit:** `updateDataPanel()` called every frame even though most values change only on slider/preset change

**Summary:** Main correctness concerns are the Doppler formula/relative-motion model and wrap-around artifacts.

### molecular-polarity.html (AP Chemistry)
- **Important:** Bond-angle slider has min=80 max=180 but preset code writes `bondAngle*10` (e.g. 1045) and `onAngleChange` divides by 10 — slider scale inconsistent; user interaction can collapse angles to 8-18 degrees (line 87, 303-318)
- **Important:** `onAngleChange()` and `onDENChange()` only update labels; `buildMolecule()` ignores mutable `bondAngle`/`den` and uses `PRESETS[key]` — controls appear interactive but don't change the molecule (lines 315-322, 229-300)
- **Important:** `clearMol()` removes meshes from `molGroup` without disposing child geometries/materials; every preset/rebuild leaks GPU resources (lines 227-231, 190-224)
- **Important:** `renderQuiz()` injects quiz text/options/explanations through `innerHTML` and inline `onclick` — XSS-prone if content externalized (lines 334-342)
- **Important:** OrbitControls leak (same pattern)
- **Nit:** Two `window.keydown` handlers handle preset shortcuts → duplicated global behavior (lines 363-369, 428-435); large unused VSEPR/IMF helper block (lines 373-509)

**Summary:** Biggest issues are nonfunctional controls + a real angle-scaling bug + leaking molecule rebuilds.

### protein-synthesis.html (AP Biology)
- **Important:** `loadPreset()` removes only `objects.mrnaStrands`, then `buildDNA()` creates new ribosome subunits + arrows without removing/disposing the old ones — presets duplicate scene objects and leak GPU resources (lines 310-326, 437-442)
- **Important:** `resetSim()` removes amino-acid beads but never disposes their geometry/material (lines 367-378, 416-419)
- **Important:** Animation delta multiplied by `speedMultiplier` AND synthesis interval divided by `speedMultiplier` → playback speed scales **quadratically** rather than linearly (lines 497-507)
- **Important:** `toggleLabels()` toggles `simState.showLabels` and button text, but no labels are rendered or hidden anywhere — button is nonfunctional and its text is inverted for the active state (lines 431-435)
- **Important:** Quiz construction via `innerHTML` + inline `onclick` (XSS pattern, lines 453-462, 547-555)
- **Nit:** OrbitControls camera-mutation fragility (lines 247-258); unused codon-highlight code suggests unfinished feature (lines 360-366); global `keydown` doesn't ignore focused inputs/buttons (lines 477-486)

**Summary:** Preset rebuilding and reset paths leak/duplicate objects; speed and label controls are incorrect.

### angular-momentum-3d.html (AP Physics C: Mechanics)
- **Important:** `rebuildLVector()`, `makeTorqueArc()`, `makePrecOrbit()` remove old objects without disposing geometries/materials — leaks on slider changes (lines 345-367, 393-397)
- **Important:** `resizeIfNeeded()` compares `canvas.width` to CSS `clientWidth` while `pixelRatio` is set; on high-DPI displays `canvas.width` is `clientWidth*devicePixelRatio` → resize/projection updates run every frame (lines 227-228, 468-472, 515-521)
- **Important:** Figure-skater preset tells users to reduce arm length to **conserve** angular momentum, but changing `armLength` changes I and leaves omega fixed → L **changes** instead of staying conserved (lines 272-278, 371-389, 430-435)
- **Important:** `getPrecRate()` returns `tau/L` with no pedagogical clamp; allowed slider values can produce extremely large rates → unstable/unreadable precession (lines 272-278, 143-151)
- **Important:** OrbitControls leak (same pattern)
- **Nit:** PE uses `M*g*r_cm*sin(tiltAngle)`; for a tilted top the expected height relation usually depends on `cos(theta)` from vertical reference — displayed PE may be conceptually wrong (lines 491-508); `verletStep()` used with zero-acceleration fns adds complexity without numerical benefit (lines 440-464)

**Summary:** Resource leaks during visual rebuilds + high-DPI resize churn + angular-momentum model inconsistencies.

### k5-physics-light-propagation.html (Elementary)
- **Important:** `resetSim()` is empty — visible Reset button does nothing (lines 59, 292)
- **Important:** Reflection mode claims angle-in equals angle-out from the normal, but ray endpoints use `tan(angle)*0.3` and arbitrary y offsets rather than a consistent vector reflection about the mirror normal (lines 301-320)
- **Important:** Shadow mode draws rays straight to the far side rather than terminating/masking rays blocked by the object — visual contradicts the stated 'blocked = shadow' concept (lines 343-355)
- **Important:** OrbitControls leak (same pattern)
- **Nit:** Per-input `BufferGeometry` recreation; uncapped pixel ratio; medium-speed display uses refraction formula even in non-refraction modes

**Summary:** No-op reset + educational-physics visuals that don't match the stated models.

### ms-genetics.html (Middle School — post-Wave-1 Hardy-Weinberg)
- **Important:** `simState.gens` is updated from the Generations slider but **never used** in the evolution model — control has no simulation effect (lines 739-746, 839-842, 971-978)
- **Important:** Animation advances time by hard-coded 0.016 per frame instead of using rAF/setAnimationLoop delta — simulation speed refresh-rate dependent (lines 955-958)
- **Important:** `onResize()` uses `window.innerWidth/innerHeight` rather than canvas container — can oversize the renderer or distort aspect ratio inside page layout/embed (lines 943-952)
- **Important:** Custom OrbitControls has no `dispose()` and uses passive wheel/touch listeners; wheel zoom doesn't prevent page scrolling (lines 567-594)
- **Important:** Allele frequency `p` mutated every rendered frame, not per selected generation or elapsed scientific time step (lines 971-978)
- **Important:** No WebGL disposal path — many unique geometries/materials with no teardown (lines 649-735)
- **Nit:** `cont.innerHTML=''` for clearing quiz options is OK (option creation via `textContent`/`addEventListener`); Check Answer button can be clicked repeatedly accumulating correct/wrong classes

**Summary:** No eval/Function; main defects are unused controls and frame-rate-dependent simulation math. **The Wave 1 metadata fix surfaces the underlying HTML bug — `generations` slider does nothing, despite both Hardy-Weinberg-correct labeling.**

### ms-plate-tectonics.html (Middle School)
- **Important:** Reset restores `time/offset` and x positions only; after subduction or transform modes, y/z positions can remain displaced (lines 527-530, 604-619)
- **Important:** Changing boundary presets resets time/offset but doesn't normalize plate x/y/z positions or visual mode state — state from previous boundary carries into the next mode (lines 533-560, 595-619)
- **Important:** `viscosity` is never used in the animation; density contrast only affects display values, not subduction/drift behavior — two major controls mostly cosmetic (lines 504-511, 631-639)
- **Important:** Scene labels left plate as oceanic and right as continental, but displayed densities keep left at 2.7 and make right denser → contradicts the quiz/explanation that denser oceanic crust subducts (lines 385-395, 440-443, 631-639)
- **Important:** Fixed per-frame timestep + `onResize()` uses window dims + OrbitControls leak (same patterns)
- **Nit:** Preset buttons don't update active classes (lines 533-560)

**Summary:** Incomplete reset/preset state + unused controls + frame-rate-dependent motion. **Pedagogy bug:** density labeling contradicts the explanation.

## Recommended fix budget (codex priority order)

| Priority | Action | Scope | Effort |
|---:|---|---|:---:|
| 1 | Replace dynamic `innerHTML` quiz/codon builders with DOM construction + event listeners; remove inline `onclick` from generated content | template-wide | M |
| 2 | Create shared experiment lifecycle helper: official/shared OrbitControls, teardown hook, `setAnimationLoop(null)`, `controls.dispose()`, `renderer.dispose()`, `Object3D` disposal traversal | template-wide | L |
| 3 | Fix high-impact correctness bugs: circular `loadPreset` event usage, molecular angle slider scale + no-op controls, protein preset duplication + speed scaling, light reset no-op, genetics + plate unused controls + fixed timestep | single-file | M |
| 4 | Remove per-frame geometry rebuilds and excessive allocations in circular/light/angular controls; reuse `BufferGeometry` attributes and scratch THREE objects | template-wide | M |
| 5 | Normalize resize handling to container dimensions; cap renderer pixel ratio to `Math.min(devicePixelRatio, 2)` | template-wide | S |
| 6 | Add CDN integrity/pinning or bundle dependencies locally; introduce CSP-compatible script strategy | template-wide | M |
| 7 | Subject-matter pass on educational models where UI claims differ from visual/math behavior: conical pendulum, Doppler observer motion, light reflection/shadow, angular-momentum conservation, genetics generations, plate density/subduction | single-file | L |

**Total estimated effort:** ~6–10 weeks single-engineer; ~3–5 weeks parallel implementation.

## Methodology

1. **Static scan (175/175):** Python script extracts inline `<script>` bodies and checks for `eval`, `Function` constructor, `innerHTML` with non-trivial RHS, `var` usage, `'use strict'` presence, `console.error`/`warn`, rAF without cancel, `setAnimationLoop` without cleanup, deprecated `THREE.Geometry`, IIFE usage, unhandled promises. Saved to `/tmp/html-js-static-scan.json`.
2. **Deep review (8 sample files):** Codex (account-default model — `gpt-5` / `gpt-5-codex` not available on this ChatGPT account) read each file's inline JS and produced structured JSON of issues across security, correctness, three.js best practices, performance, memory leaks, and modern JS hygiene.
3. **Aggregation:** Static + deep findings combined; severity assigned per impact; remediation roadmap derived from codex's priority order.

## Caveats

- The user's preferred review model (`gpt-5`) was not available on the ChatGPT account; account-default codex model was used.
- 8-file deep sample is small; expand sample if template is to be modified.
- No runtime testing performed (browser console errors, performance profiling, memory snapshots) — this audit is static + reasoning-based only. A separate cycle should run Lighthouse or Chrome DevTools profiling on the highest-priority files.
- Several flagged "issues" are arguably template trade-offs (e.g., inline scripts for self-contained simulations); the report flags risks but final decisions belong to the engineering team.

## Out-of-scope (deferred)

- Implementation of fixes (separate cycle)
- React/R3F app code quality (audit covers HTML simulations only)
- Bundling / CDN-removal migration (separate cycle, mentioned in Phase D out-of-scope)
- Performance profiling / Lighthouse scoring of simulation pages (separate cycle)
