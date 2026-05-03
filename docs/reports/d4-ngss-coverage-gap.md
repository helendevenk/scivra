---
name: d4-ngss-coverage-gap
description: NGSS K-12 performance-expectation coverage gap audit for the Scivra experiments registry
type: report
created: 2026-05-04T00:00:00Z
updated: 2026-05-04T00:00:00Z
---

# D4 NGSS K-12 Coverage Gap Audit

**Audit date:** 2026-05-04
**Registry analyzed:** all 179 slugs in `src/shared/lib/experiments/data/*.ts`
**Reference framework:** Next Generation Science Standards (NGSS), NGSS Lead States 2013, https://www.nextgenscience.org

## Executive summary

| Metric | Value |
|---|---:|
| Distinct NGSS PEs covered | 119 |
| Canonical NGSS PE universe (incl. ETS grade-band standards) | 208 |
| Gap PEs (not covered) | 89 |
| High-priority gaps (good simulation fit + adjacency) | 51 |
| Medium-priority gaps | 35 |
| Low-priority gaps | 3 |

**Coverage rate:** 119 / 208 = 57% of the full PE universe.

## Coverage by grade band × DCI

| Band-DCI | Covered | Notes |
|---|---:|---|
| K-ESS | 1 | weak K coverage overall |
| 1-ESS | 1 | weak |
| 1-PS | 2 | partial |
| 2-ESS | 1 | partial |
| 2-LS | 2 | partial |
| 2-PS | 1 | weak |
| 3-ESS | 2 | partial |
| 3-LS | 3 | partial |
| 3-PS | 4 | strong |
| 4-ESS | 3 | partial |
| 4-PS | 4 | strong |
| 5-ESS | 3 | partial |
| 5-LS | 2 | partial |
| 5-PS | 4 | strong |
| MS-ESS | 12 | strong |
| MS-LS | 8 | partial — major gaps |
| MS-PS | 13 | strong |
| HS-ESS | 11 | strong |
| HS-LS | 17 | strong |
| HS-PS | 24 | strongest |
| HS-ETS | 1 | weak |

**Hot spots:** HS-PS, MS-PS, HS-LS, MS-ESS are well covered (registry's AP/MS science focus). Major weaknesses: K-2 across all DCIs, MS-LS systems and selection topics, HS-ETS engineering, and the entire ETS grade-band cluster (K-2-ETS, 3-5-ETS, MS-ETS, HS-ETS).

## Top 10 priority recommendations

These are the highest-leverage gaps to fill — high simulation fit AND adjacency to already-covered PEs in the same band+DCI bucket (suggesting catalog adjacency / quick-win opportunities).

| # | Code | Topic | Rationale |
|---:|---|---|---|
| 1 | 5-PS1-1 | Matter made of particles | A particle model simulation directly extends existing elementary matter coverage into microscopic structure. Adjacent: 5-PS1-3, 5-PS1-4. |
| 2 | MS-PS1-6 | Thermal energy design | Highly simulation-friendly; adjacent to existing MS matter and energy coverage. Adjacent: MS-PS1-4, MS-PS1-5, MS-PS3-1. |
| 3 | HS-ESS3-4 | Climate change modeling | Climate modeling is a strong interactive fit and complements existing greenhouse / human-impact standards. Adjacent: HS-ESS3-5, HS-ESS3-6, HS-ESS2-4. |
| 4 | HS-LS2-4 | Carbon cycling in ecosystems | Connects ecosystems, respiration, photosynthesis, and Earth systems already in the catalog. Adjacent: HS-LS2-3, HS-LS2-6, HS-LS1-5, HS-LS1-7. |
| 5 | MS-LS1-1 | Cells as living units | Foundational, reuses existing biology visualization patterns; fills a major MS-LS gap. Adjacent: MS-LS1-2, HS-LS1-2. |
| 6 | 2-ESS2-1 | Erosion prevention solutions | Hands-on, visual, adjacent to covered water and landform standards. Adjacent: 2-ESS2-3, 4-ESS2-1. |
| 7 | 1-ESS1-2 | Seasonal daylight patterns | Easy to simulate with Sun-Earth geometry; sits beside already covered sky-pattern content. Adjacent: 1-ESS1-1, 5-ESS1-2. |
| 8 | 4-PS3-1 | Energy and speed | Direct-manipulation + graphs; extends existing grade 4 energy coverage. Adjacent: 4-PS3-2, 4-PS3-4. |
| 9 | MS-ESS3-1 | Natural resource distribution | Resource maps + constraints make a useful systems simulation. Adjacent: MS-ESS3-2, MS-ESS3-4, MS-ESS3-5. |
| 10 | HS-ETS1-4 | Computer simulation for design | Aligns naturally with an experiments registry; bridges existing HS engineering coverage. Adjacent: HS-ETS1-2. |

## Full gap list by grade band × DCI

### K-2 elementary

**K-PS:** K-PS2-1 (pushes and pulls, medium), K-PS2-2 (push-pull design, medium), K-PS3-1 (sunlight warms Earth, medium), K-PS3-2 (shade reduces warming, medium)

**K-LS:** K-LS1-1 (plant and animal needs, medium)

**K-ESS:** K-ESS2-2 (organisms change environments, medium), **K-ESS3-1 (habitat needs, high)**, K-ESS3-2 (weather forecasting safety, medium), K-ESS3-3 (reduce human impacts, medium)

**1-PS:** **1-PS4-2 (seeing with light, high)**, **1-PS4-4 (light/sound communication, high)**

**1-LS:** 1-LS1-1 (biomimicry, medium), 1-LS1-2 (parent-offspring behavior, low), 1-LS3-1 (young resemble parents, medium)

**1-ESS:** **1-ESS1-2 (seasonal daylight patterns, high)**

**2-PS:** **2-PS1-2 (material properties, high)**, **2-PS1-3 (parts make new objects, high)**, **2-PS1-4 (heating and cooling, high)**

**2-LS:** **2-LS2-2 (pollination, high)**

**2-ESS:** 2-ESS1-1 (fast/slow Earth events, medium), **2-ESS2-1 (erosion prevention, high)**, **2-ESS2-2 (land and water models, high)**

**K-2-ETS:** K-2-ETS1-1 (define problems, medium), K-2-ETS1-2 (sketch solutions, medium), K-2-ETS1-3 (compare tests, medium)

### 3-5 upper elementary

**3-LS:** 3-LS2-1 (group behavior survival, medium), **3-LS3-1 (inherited traits, high)**, **3-LS3-2 (environment affects traits, high)**, 3-LS4-1 (fossils, medium), **3-LS4-4 (habitat change survival, high)**

**3-ESS:** **3-ESS3-1 (weather hazards design, high)**

**4-LS:** 4-LS1-1 (structures support survival, medium), 4-LS1-2 (senses and responses, medium)

**4-ESS:** **4-ESS1-1 (rock layers and fossils, high)**, 4-ESS3-2 (energy resource impacts, medium)

**4-PS:** **4-PS3-1 (energy and speed, high)**, **4-PS3-3 (energy transfer collisions, high)**, **4-PS4-3 (information transfer, high)**

**5-ESS:** 5-ESS3-1 (protect Earth resources, medium)

**5-PS:** **5-PS1-1 (matter is particles, high)**, **5-PS1-2 (conservation of matter, high)**

**3-5-ETS:** 3-5-ETS1-1 (criteria, medium), 3-5-ETS1-2 (compare solutions, medium), 3-5-ETS1-3 (fair tests, medium)

### Middle school (MS)

**MS-ESS:** **MS-ESS1-4 (geologic time, high)**, **MS-ESS3-1 (resource distribution, high)**, **MS-ESS3-3 (human impact monitoring, high)**

**MS-LS:** **MS-LS1-1 (cells as living units, high)**, **MS-LS1-3 (body subsystems, high)**, MS-LS1-4 (animal behaviors, medium), **MS-LS1-5 (growth factors, high)**, **MS-LS1-8 (sensory processing, high)**, **MS-LS2-2 (biodiversity ecosystem resources, high)**, MS-LS2-5 (ecosystem services, medium), **MS-LS4-1 (fossil record, high)**, MS-LS4-2 (embryology, medium), MS-LS4-3 (anatomical relatedness, medium), **MS-LS4-4 (natural selection, high)**, MS-LS4-5 (artificial selection, medium), **MS-LS4-6 (biodiversity changes, high)**

**MS-PS:** **MS-PS1-6 (thermal energy design, high)**, **MS-PS2-3 (electric/magnetic forces, high)**, **MS-PS2-4 (gravity in systems, high)**, **MS-PS3-3 (thermal energy transfer, high)**, **MS-PS3-4 (kinetic energy and mass-speed, high)**, **MS-PS4-3 (digitized signals, high)**

**MS-ETS:** MS-ETS1-1 (define problem, medium), MS-ETS1-2 (evaluate designs, medium), MS-ETS1-3 (analyze test data, medium), MS-ETS1-4 (iterative design, medium)

### High school (HS)

**HS-ESS:** HS-ESS1-2 (Big Bang evidence, medium), **HS-ESS1-7 (stellar fusion, high)**, **HS-ESS2-2 (geoscience feedbacks, high)**, **HS-ESS2-6 (carbon cycle modeling, high)**, HS-ESS2-7 (life-atmosphere coevolution, medium), **HS-ESS3-1 (resource availability, high)**, **HS-ESS3-2 (hazards forecasting, high)**, **HS-ESS3-3 (sustainability design, high)**, **HS-ESS3-4 (climate change modeling, high)**

**HS-LS:** **HS-LS2-4 (carbon cycling, high)**, **HS-LS2-5 (carrying capacity factors, high)**, **HS-LS2-7 (reduce human impacts, high)**, HS-LS2-8 (group behavior evolution, medium), **HS-LS3-3 (trait variation statistics, high)**, **HS-LS4-5 (environmental change evolution, high)**, HS-LS4-6 (biodiversity solutions, medium)

**HS-ETS:** HS-ETS1-1 (criteria/constraints, medium), **HS-ETS1-3 (evaluate tradeoffs, high)**, **HS-ETS1-4 (computer simulation for design, high)**

## Methodology

1. **Coverage extraction:** Python script enumerated all `standards.ngss` arrays across `src/shared/lib/experiments/data/*.ts` (179 files). Result: 119 distinct PE codes referenced.
2. **Universe enumeration + gap calculation:** Codex (account-default model — gpt-5/gpt-5-codex were not available on this ChatGPT account) enumerated the canonical NGSS K-12 PE universe (208 codes including all ETS grade-band standards) and computed the gap as universe minus covered.
3. **Priority assignment:** Codex assessed each gap PE for (a) interactive simulation fit, (b) adjacency to already-covered PEs in same grade-band/DCI bucket. HIGH = both criteria met; MEDIUM = one met; LOW = neither.
4. **Top 10 recommendations:** Codex selected the highest-leverage gaps to maximize curriculum coverage gain per unit of simulation-development effort.

## Caveats

- The user's preferred review model (`gpt-5`) was not available on this ChatGPT account; account-default codex model was used.
- Codex's canonical PE universe (208) includes all ETS grade-band standards (K-2-ETS, 3-5-ETS, MS-ETS, HS-ETS), which the public NGSS framework presents as cross-cutting; some published estimates use 178 (excluding several ETS variants). Both numbers are valid framings.
- Priority assignments reflect codex's pedagogical heuristic; final catalog roadmap should be reviewed by a science-curriculum SME before allocating engineering effort.
- This report does not assess depth of coverage. A PE may appear in the registry but be only partially addressed; that's a separate audit dimension.
