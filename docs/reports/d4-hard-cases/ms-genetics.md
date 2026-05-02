---
name: d4-hard-case-ms-genetics
status: open
created: 2026-05-02T08:50:00Z
updated: 2026-05-02T08:50:00Z
slug: ms-genetics
owner: claude
opened: 2026-05-02
deadline: 2026-05-16
decision: pending
---

# D4 Hard Case — ms-genetics

## Current TypeScript metadata

**File:** `src/shared/lib/experiments/data/ms-genetics.ts`

- **subtitle:** "DNA, genes, Punnett squares, and trait inheritance"
- **description:** "Build a Punnett square and predict the probability of offspring inheriting traits. See how dominant and recessive alleles combine. Run a simulated cross between two organisms and count phenotype ratios. Explore how mutations in DNA can alter traits."
- **parameters[]:**
  - `parent1` — Parent 1 Genotype (0=AA, 1=Aa, 2=aa), discrete 0-2 step 1
  - `parent2` — Parent 2 Genotype (0=AA, 1=Aa, 2=aa), discrete 0-2 step 1
  - `traitType` — selector for which trait being crossed
  - `offspringCount` — how many offspring to simulate
- **contentSections.whatIsIt** (gist): "A Punnett square is a tool that geneticists use to predict the probability of offspring inheriting specific traits from their parents..."

## Actual HTML simulation

**File:** `public/experiments/middle/ms-genetics.html`
**Title:** "Genetics & DNA | Middle School Science"
**Vercel preview:** https://scivra.com/experiments/ms-genetics (production)

- **HTML controls (range sliders):**
  - `sl-mut` — Mutation rate, 0-10 step 0.5 (default 2)
  - `sl-gen` — Generations, 1-10 step 1 (default 5)
  - `sl-p` — Initial dominant allele frequency p, 10-90 step 5 (default 70, displayed as 0.10-0.90)
  - `sl-rot` — display rotation, 1-20 step 1 (cosmetic 3D control)
- **Preset buttons:**
  - `data-preset="neutral"` — Neutral / no selection scenario
  - `data-preset="drift"` — Strong Mutation Pressure
  - `data-preset="balanced"` — Balanced selection scenario
- **What it actually demonstrates:** Hardy-Weinberg equilibrium and population genetics. Visualizes allele frequency `p` over multiple `generations` under `mutation` pressure. Includes references to the HW equation `p² + 2pq + q² = 1`, genetic drift, and selection. **Has no Punnett square UI.**

## The mismatch

The TypeScript metadata describes a **Mendelian Punnett square cross simulator** — pick two parent genotypes, see offspring ratios. The HTML simulation implements **population genetics & Hardy-Weinberg** — pick a starting allele frequency, watch how mutation pressure shifts it across generations.

These are two distinct middle-school genetics topics:

| | Punnett (TS) | Hardy-Weinberg (HTML) |
|---|---|---|
| Scale | Individual cross | Population over time |
| Inputs | Parent genotypes | Allele frequency, mutation rate, generations |
| Output | Offspring genotype/phenotype ratios | p shift trajectory + final HW genotype frequencies |
| NGSS hook | MS-LS3-2 (probability + heredity) | MS-LS4-4/5 (selection + variation, more HS) |

Aliases cannot bridge them — there are no parent genotype controls in the HTML, and there is no allele-frequency slider in the metadata. The contentSections.misconceptions and teacherUseCases reference Punnett-square mechanics that the simulation cannot demonstrate.

A `ms-genetics-punnett` slug already exists in the registry (separately covered by Wave 7) — it is the proper home for Punnett square content.

## Three options

### Option A — Keep HTML, rewrite metadata (default per SLA)
- **Estimated cost:** ~3 h
- **What changes:**
  - `parameters[]`: drop parent1/parent2/traitType/offspringCount; add `mutationRate` (alias `sl-mut`), `generations` (alias `sl-gen`), `initialFreqP` (alias `sl-p`), `viewRotation` (alias `sl-rot`)
  - `presets[]`: add neutral / drift / balanced entries
  - `htmlControlAliases`: as above
  - subtitle: "Population genetics, allele frequencies, and Hardy-Weinberg equilibrium"
  - description: rewritten for HW concept
  - whatIsIt + parameterExplanations + misconceptions + teacherUseCases + faq: rewritten for HW
  - standards: shift from MS-LS3-1 (Mendelian) to MS-LS4-4/MS-LS4-5 (variation/selection in populations)
- **New learning concept:** Hardy-Weinberg & population genetics
- **Risk:** low (metadata only; tests catch regressions)
- **Side benefit:** Punnett square coverage already exists in `ms-genetics-punnett`; this rewrite makes the two slugs distinct rather than redundant.

### Option B — Keep metadata, rebuild HTML simulation
- **Estimated cost:** ~10 h
- **What changes:** Replace HW simulation HTML with a true Punnett square UI: parent genotype selectors, animated cross, offspring ratio readout
- **Risk:** high (no test coverage; visual + interaction QA required; loses the existing HW lesson)
- **Why this is wasteful:** `ms-genetics-punnett` already provides the Punnett square experience.

### Option C — Split into two slugs
- **Estimated cost:** N/A — already implicitly resolved
- **What changes:** Same as Option A, since the second slug (Punnett) already exists.

## Recommended default

**Option A** — strongly preferred. The HTML simulation is pedagogically valuable as Hardy-Weinberg content, and `ms-genetics-punnett` already covers the originally-promised Mendelian content. The rewrite eliminates redundancy and makes the simulation honest about its concept.

## Decision

**Choice:** pending
**Decided by:** —
**Decided at:** —
**Notes:** —

## Execution log

- 2026-05-02: opened by claude
- 2026-05-02: PM notification pending
