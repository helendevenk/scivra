---
name: phase3-wave12-codex-deep-audit-results
status: complete
created: 2026-04-30T16:30:00Z
updated: 2026-04-30T16:30:00Z
---

# Phase 3 Wave 1+2 Codex Deep Audit — Results Snapshot

**Codex run:** 11 chunks × ~5-6 files each, gpt-5.5 + xhigh, parallel dispatch
**Duration:** ~6 minutes wall-clock (per statuses.tsv)
**Outcome:** 31 source files patched (D1 physics precision + D2 misconception strawmen)
**Validation post-patch:** 578/578 tests pass; pnpm tsc --noEmit clean; git diff --check clean

## Findings overview by chunk

### w1c1

## Chunk Summary

---

### w1c2

## CHUNK SUMMARY

---

### w1c3

## Chunk Summary

---

### w1c4

## Chunk SUMMARY

---

### w1c5

## Chunk Summary

---

### w2c1

## Chunk Summary

---

### w2c2

## Chunk SUMMARY

---

### w2c3

## Chunk Summary

---

### w2c4

## Chunk Summary

---

### w2c5

## Chunk SUMMARY

---

### w2c6


---

## Patches applied (31 files)

```
 src/shared/lib/experiments/data/atomic-interactions.ts       |  2 +-
 src/shared/lib/experiments/data/balancing-act.ts             |  2 +-
 .../lib/experiments/data/balloons-static-electricity.ts      |  2 +-
 src/shared/lib/experiments/data/bending-light.ts             |  6 +++---
 src/shared/lib/experiments/data/blackbody-spectrum.ts        |  2 +-
 src/shared/lib/experiments/data/build-a-nucleus.ts           | 12 ++++++------
 src/shared/lib/experiments/data/buoyancy-basics.ts           |  2 +-
 src/shared/lib/experiments/data/buoyancy.ts                  |  2 +-
 src/shared/lib/experiments/data/circular-motion.ts           |  2 +-
 src/shared/lib/experiments/data/color-vision.ts              |  2 +-
 src/shared/lib/experiments/data/coulombs-law.ts              |  2 +-
 src/shared/lib/experiments/data/dc-circuits-basic.ts         |  6 +++---
 src/shared/lib/experiments/data/diffusion.ts                 |  4 ++--
 src/shared/lib/experiments/data/energy-skate-park-basics.ts  |  4 ++--
 src/shared/lib/experiments/data/friction-lab.ts              |  2 +-
 src/shared/lib/experiments/data/geometric-optics-basics.ts   |  2 +-
 src/shared/lib/experiments/data/hookes-law.ts                |  2 +-
 src/shared/lib/experiments/data/ideal-gas-thermodynamics.ts  |  6 +++---
 src/shared/lib/experiments/data/john-travoltage.ts           |  2 +-
 src/shared/lib/experiments/data/keplers-laws.ts              |  2 +-
 src/shared/lib/experiments/data/masses-springs.ts            |  2 +-
 src/shared/lib/experiments/data/molecules-and-light.ts       |  4 ++--
 src/shared/lib/experiments/data/momentum-collisions.ts       |  2 +-
 src/shared/lib/experiments/data/my-solar-system.ts           |  2 +-
 src/shared/lib/experiments/data/pressure-lab.ts              |  4 ++--
 src/shared/lib/experiments/data/quantum-coin-toss.ts         |  8 ++++----
 src/shared/lib/experiments/data/simple-harmonic-motion.ts    |  6 +++---
 src/shared/lib/experiments/data/single-slit-diffraction.ts   |  6 +++---
 src/shared/lib/experiments/data/states-of-matter-basics.ts   |  6 +++---
 src/shared/lib/experiments/data/vector-addition.ts           |  2 +-
 src/shared/lib/experiments/data/waves-intro.ts               |  6 +++---
```

## Findings NOT addressed in this commit

- **D4 OUT-OF-SCOPE** (~6 files): teacher use cases reference simulation parameters/controls that don't exist in current public HTML. Requires per-sim UI cross-check; deferred.
- **D9 MISCITED** (~20 files): AP Physics 1 vs 2 standards taxonomy questions. Per codex's own assessment, this is a separate product decision about which CED revision to follow; not appropriate for this fact-fix batch.
- **D5 DRIFT** (a few): residual cheerleader phrases ('magical', 'quietly nibbled'). Style-only; can address in a future polish pass.
