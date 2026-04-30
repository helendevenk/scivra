/**
 * Phase 3 manifest — slugs that should pass the contentSections quality gate.
 * Append to PHASE3_FILLED_SLUGS as each wave fills its experiments.
 *
 * Update protocol: in the wave's branch, edit this file by appending the wave's
 * slugs in alphabetical order, then run the validation test.
 */

export const PHASE3_FILLED_SLUGS = new Set<string>([
  // Phase 2 P0 (already shipped 2026-04-30, sanity-check anchor)
  "acid-base-ph",
  "cellular-respiration",
  "chemical-equilibrium",
  "dna-double-helix",
  "doppler-effect-sound-waves",
  "geometric-optics-lenses-mirrors-ray-tracing",
  "newtons-laws-of-motion",
  "photosynthesis",
  "projectile-motion",
  "wave-interference",
  // Wave 1 (ap-physics-1) — added in Task 1
  // Wave 2 (ap-physics-2) — added in Task 2
  // Wave 3 (ap-biology) — added in Task 3
  // Wave 4 (ap-chemistry) — added in Task 4
  // Wave 5 (ap-physics-c) — added in Task 5
  // Wave 6 (ngss-hs) — added in Task 6
  // Wave 7 (ngss-ms) — added in Task 7
  // Wave 8 (elementary-k5) — added in Task 8
  // Wave 9 (general) — added in Task 9
]);
