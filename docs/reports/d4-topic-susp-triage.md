---
name: d4-topic-susp-triage
description: Triage report for 75 topic_susp slugs flagged by D4 audit heuristic
type: report
created: 2026-05-03T03:30:00Z
updated: 2026-05-03T03:30:00Z
---

# D4 Topic-Suspect Triage Report

**Date:** 2026-05-03
**Total slugs triaged:** 75
**Method:** 4 parallel subagents (general-purpose) reading TS subtitle + HTML title/h1 + first paragraph for each slug
**Reference:** `docs/plans/2026-05-03-d4-phase-c-closeout.md` Task 4

## Result Summary

| Classification | Count |
|---|---:|
| GRADUATE (false positive heuristic) | **74** |
| TRUE_MISMATCH (real topic gap) | **1** |

The audit heuristic (`scripts/audit-params-vs-html.ts` topic-mismatch detector) flagged slugs whose TS subtitle and HTML title share zero words ≥ 4 chars. **98.7% false-positive rate** confirmed — the heuristic flags surface-vocabulary differences, not real topic gaps. Per parent handoff F3 expected count was 1-3; actual = 1.

## TRUE_MISMATCH cases (1)

### cellular-respiration-detail

- **TS concept:** Full cellular respiration walkthrough across all three stages — glycolysis, Krebs cycle, and oxidative phosphorylation — with controls for glucose throughput and an aerobic/anaerobic toggle to compare ~36 ATP vs 2 ATP yields
- **HTML concept:** Electron Transport Chain & Chemiosmosis only — Complexes I-IV plus ATP synthase, proton gradient meter (ΔΨ, ΔpH), and ETC inhibitors (cyanide, rotenone, antimycin, DNP, oligomycin); does not simulate glycolysis or the Krebs cycle
- **Recommendation:** `rewrite_ts_to_match_html` — the HTML is a coherent ETC/chemiosmosis sim that addresses AP Bio standard 2.A.2 well; cheaper than rebuilding a whole-pathway HTML from scratch
- **Note:** A separate `cellular-respiration` slug already exists per the `relatedExperiments` field, so the "detail" naming fits ETC depth focus

## Graduates (74)

These slugs are conceptually aligned but failed the heuristic on surface vocabulary. They can be picked up by future C3 batches when their diff size warrants (or remain in C5 tier as low-priority drift).

### Batch 1 (18)

acid-base-ph, beers-law-lab, climate-change-modeling, electrochemistry, fluid-statics, gravitational-fields, k5-day-night-seasons, k5-magnetism, k5-sound-waves, lorentz-force, mineral-identification, ms-atoms-molecules, ms-ecosystems, ms-photosynthesis-respiration, neuron-action-potential, reaction-kinetics, simple-harmonic-motion, thermochemistry

### Batch 2 (19)

amperes-law, build-a-molecule, chemical-equilibrium, dna-double-helix, electron-configuration, gas-properties, greenhouse-effect, k5-food-chain, k5-plant-life-cycle, k5-stars-space, masses-springs-basics, molecular-polarity, ms-chemical-bonding, ms-food-web-dynamics, ms-plate-tectonics, photosynthesis, rlc-circuit, solar-system-scale, water-cycle-detail

### Batch 3 (19)

atomic-structure, calorimetry, circuit-ac-virtual-lab, dna-replication-detail, enzyme-kinetics, gauss-law, immune-system, k5-habitats, k5-simple-machines, k5-water-cycle, meiosis, moon-geology, ms-chemical-reactions, ms-genetics, ms-weather-systems, photosynthesis-light-reactions, rotational-kinematics-advanced, solutions-dilutions, wave-interference

### Batch 4 (18)

balancing-chemical-equations, cellular-respiration, circular-motion, electric-field-lines, evidence-of-evolution, glaciers-ice-ages, k5-animal-adaptations, k5-landforms-erosion, k5-solar-energy, k5-weather-measurement, membrane-transport, ms-acid-base-reactions, ms-chemical-stoichiometry, ms-genetics-punnett, natural-selection, plate-tectonics-advanced, rotational-motion, stoichiometry

## Secondary findings (non-blocking)

These were flagged by triage subagents as observations worth follow-up but are NOT topic mismatches:

1. **k5-food-chain pathing inconsistency** — TS slug is `k5-food-chain` but HTML lives at `public/experiments/elementary/k5-biology-food-chain.html`. TS file lacks an `htmlPath` property so registry default may not resolve. Concepts align perfectly. Recommended fix: add `htmlPath: "/experiments/elementary/k5-biology-food-chain.html"` to the TS, or rename one side for consistency.

2. **k5-habitats grade-level mismatch** — TS metadata is K-5 grade level but HTML content is HS-grade (uses Shannon Biodiversity Index, NPP, 10% energy rule, logistic carrying capacity). Topic alignment is fine; this is a tier polish item if K-5 audience is the actual target.

## Action items derived from triage

| Action | Slug | Priority |
|---|---|---|
| Rewrite TS to match ETC-only HTML | cellular-respiration-detail | High (Phase C) |
| Add htmlPath to TS | k5-food-chain | Low (separate cleanup) |
| Decide grade level | k5-habitats | Low (separate cleanup) |

## Heuristic tuning recommendation (future)

The current `topicMismatch.suspect` flag in `_phase3-research/d4-audit/audit.jsonl` has 1.3% true-positive rate. Options for future audits:

1. **Disable the flag entirely** — its signal-to-noise is too low to be useful for routing; humans found 1 real case among 75 with non-trivial review effort
2. **Tighten the heuristic** — require additional evidence (e.g., parameter id similarity = 0 AND subtitle/title share zero words) before flagging
3. **Keep as-is but document** — accept that this flag is a "review for completeness" prompt rather than a routing signal

Recommend option 2: extend the audit to compare TS parameter labels against HTML control labels via fuzzy match, and only flag if BOTH the title and the parameter labels are unrelated.
