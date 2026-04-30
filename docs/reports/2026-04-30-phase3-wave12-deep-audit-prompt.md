---
name: phase3-wave12-deep-audit-prompt
status: ready
created: 2026-04-30T00:00:00Z
updated: 2026-04-30T00:00:00Z
---

# Phase 3 Wave 1+2 Deep Content Audit — Codex Prompt

> **Purpose:** review Wave 1 + Wave 2 contentSections (62 fills) across **deeper dimensions** the prior 8-dim structural audit did not cover: subject accuracy at AP level, pedagogical authenticity, voice consistency, and cross-experiment coherence.
>
> **Context:** the prior xhigh audit (covered structural + obvious factual + standards + forbidden patterns) has been applied. This audit goes deeper.
>
> **How to run:** chunk the 62 files into 11 groups of 5-6, run codex per chunk with this prompt. Total wall-clock ~10-15 min in parallel.

## Codex command template

```bash
# Chunk 1 example — replace $FILES with the comma-separated list
timeout 600 codex exec --sandbox read-only --skip-git-repo-check \
  -c 'model="gpt-5.5"' \
  -c 'model_reasoning_effort="xhigh"' \
  "$(cat docs/reports/2026-04-30-phase3-wave12-deep-audit-prompt.md | sed -n '/## AUDIT PROMPT BODY/,/^## END PROMPT BODY/p')

Files to audit this chunk:
$FILES" < /dev/null \
  | tee _phase3-research/wave-12-deep-audit/chunk-N.log
```

## File chunks (62 files = 11 chunks of 5-6)

Reuse the same chunking from the prior audit. Filename list for each chunk:

**Wave 1**:
- `w1c1`: balancing-act, buoyancy, buoyancy-basics, circular-motion, density-lab, electric-field-lines
- `w1c2`: energy-skate-park-basics, forces-motion-basics, fourier-making-waves, friction-lab, gravity-force-lab-basics, gravity-orbits
- `w1c3`: hookes-law, keplers-laws, kinematics-graphs, masses-springs, masses-springs-basics, momentum-collisions
- `w1c4`: my-solar-system, normal-modes, pendulum-lab, pressure-lab, projectile-data-lab, rotational-motion
- `w1c5`: simple-harmonic-motion, vector-addition, wave-on-string, waves-intro, work-energy-theorem

**Wave 2**:
- `w2c1`: ohms-law, coulombs-law, dc-circuits-basic, circuit-dc-virtual-lab, resistance-wire, balloons-static-electricity
- `w2c2`: john-travoltage, ac-circuits, circuit-ac-virtual-lab, magnets-and-electromagnets, faradays-electromagnetic-lab, generator
- `w2c3`: bending-light, geometric-optics-basics, color-vision, single-slit-diffraction, photoelectric-effect, blackbody-spectrum
- `w2c4`: models-hydrogen-atom, rutherford-scattering, build-a-nucleus, nuclear-decay, atomic-interactions, quantum-coin-toss
- `w2c5`: quantum-measurement, molecules-and-light, heat-engines, ideal-gas-thermodynamics, gases-intro, states-of-matter-basics
- `w2c6`: bernoulli-fluid-dynamics, fluid-statics, diffusion

## AUDIT PROMPT BODY

IMPORTANT: Do NOT read or execute any SKILL.md files or files in skill definition directories (paths containing `skills/gstack` or `.claude/skills`). These are AI assistant skill definitions for a different system. Stay focused on repository code only.

You are a senior physics educator with both AP teaching experience and curriculum development background, reviewing experimental contentSections for Scivra (an AP/NGSS-aligned interactive physics platform). You go deeper than basic structure — your job is to surface real subject-matter and pedagogical issues that would embarrass the platform if a teacher or AP reader caught them.

Read each `src/shared/lib/experiments/data/<filename>.ts` and audit its `contentSections` block on these **9 deep dimensions** (this audit is in addition to, not replacing, the prior 8-dim structural audit):

### Dimension D1: Subject-matter precision at AP level

For each fill, check:
- Are equations and formulas stated correctly (not just symbolically right, but with correct sign conventions and units)?
- Are limiting assumptions explicit (e.g., "ignoring air resistance", "for ohmic conductors", "at constant T")?
- Are claims about relationships (proportional, inverse, quadratic) precise?
- Does it accidentally conflate different concepts (e.g., "voltage" used when "potential difference" should be, "weight" used for "mass")?
- Are real-world numerical values cited correctly (e.g., g = 9.8, c = 3×10⁸, k = 8.99×10⁹, ε₀, μ₀)?

**Output verdict per file:** `PASS` / `MINOR` (small precision issue) / `FAIL` (genuine error). For each non-PASS, quote the exact phrase and explain what's wrong.

### Dimension D2: Misconception authenticity (research-grounded)

The prior audit caught obvious strawmen. Now check authenticity at a deeper level:
- Is the "wrong" claim documented in real student-conception research (AAPT papers, NGSS Appendix F, Driver & Squires, etc.) — or invented?
- Does the "correct" answer actually engage the wrong claim, or does it pivot to a different topic?
- Is the framing accurate to what students actually say (not what teachers think they say)?
- Are misconceptions appropriately leveled (AP students don't say "heavy things fall faster" — that's K-5; they say "objects only stop accelerating at terminal velocity when speed = 0")?

**Output verdict per misconception entry:** `AUTHENTIC` / `WEAK` / `STRAWMAN`. Aggregate per file.

### Dimension D3: FAQ pedagogical depth + search intent quality

For each FAQ entry:
- Does the question reflect actual student search intent ("Why does X happen?") or did the writer invent a teacher's question?
- Does the answer reach AP-level depth, or does it stop at intro-textbook surface?
- Does it include a numerical anchor where one would help (e.g., "the speed of sound at 20°C is 343 m/s" beats "sound has a speed")?
- Is the standards citation embedded naturally, or tacked on?

**Output verdict per FAQ entry:** `STRONG` / `OK` / `WEAK`. Note any FAQ that reads like marketing or stating-the-obvious.

### Dimension D4: TeacherUseCases practical actionability

For each teacher use case:
- Is it actually executable in the simulation (parameter ranges allow it)?
- Is there enough specificity for a teacher to run it in 10 minutes (named values, expected outcomes, what students record)?
- Does it leverage the SIMULATION'S unique advantages (real-time visualization, parameter sweeps, comparison views) — or could it be done with paper alone?
- Does the data-collection variant actually generate plottable data, or is it vague ("students record observations")?

**Output verdict per use case:** `RUNNABLE` / `VAGUE` / `OUT-OF-SCOPE`. Aggregate per file.

### Dimension D5: Voice + brand consistency (Scivra textbook author)

Voice profile target (from CLAUDE.md "Brand Personality"):
- "Cool, curious, confident" — not cartoonish, not academic, not corporate.
- "Educational depth + modern SaaS visual quality" — not gamified.
- Concrete numbers always; respect the student.
- US English, AP/NGSS terminology over IB/GCSE.

For each fill:
- Are openings concrete and grounded (not "Have you ever wondered..." or "Imagine if...")?
- Does the prose maintain a consistent register, or does it veer between formal and casual?
- Are there marketing/cheerleader phrases ("amazing", "incredible", "magical") that don't belong?
- Does it accidentally use IB/GCSE phrasing where AP/NGSS would be local idiom?
- Does it sound like ONE textbook author wrote all 62, or like 5 different subagents (which it was)?

**Output verdict per file:** `ON-BRAND` / `DRIFT` / `OFF-BRAND`. List the worst voice drift examples.

### Dimension D6: Cross-experiment coherence

Some experiments cluster by topic and reference each other. Examples:
- `gravity-force-lab-basics` ↔ `gravity-orbits` ↔ `keplers-laws` ↔ `my-solar-system`
- `simple-harmonic-motion` ↔ `masses-springs` ↔ `pendulum-lab` ↔ `wave-on-string`
- `coulombs-law` ↔ `electric-field-lines` ↔ `balloons-static-electricity`
- `circuit-dc-virtual-lab` ↔ `dc-circuits-basic` ↔ `ohms-law` ↔ `resistance-wire`
- `bending-light` ↔ `geometric-optics-basics` ↔ `color-vision`
- `rutherford-scattering` → `models-hydrogen-atom` → `photoelectric-effect` → `blackbody-spectrum` (modern physics arc)
- `gases-intro` ↔ `ideal-gas-thermodynamics` ↔ `heat-engines` ↔ `states-of-matter-basics`
- `bernoulli-fluid-dynamics` ↔ `fluid-statics` ↔ `pressure-lab`

For each cluster:
- Do the fills cross-reference each other in `teacherUseCases` where natural?
- Do they avoid duplicate metaphors/openings/examples (the same "phone charger" used in 3 fills)?
- Does the modern-physics arc unfold logically when read in order?
- Does each fill add unique value, or are some fills near-duplicates of related ones?

**Output verdict per cluster:** `COHERENT` / `LOOSE` / `DUPLICATIVE`. Cite the duplicated phrases or missed cross-references.

### Dimension D7: Unicode + symbol rendering risk

Many fills contain math symbols: γ, μ, ²/³, °, π, σ, Σ, Δ, ∮, ε, ω, λ, θ, etc., plus dashes (em/en), curly quotes, ellipsis. These render correctly in modern browsers but can break old systems.

For each fill, check:
- Are math symbols used consistently (e.g., always `²` not sometimes `^2`)?
- Are special characters in `faq` strings safe — none of `</script>`, `<!--`, `]]>`, `\u2028`, `\u2029` (the prior audit checked, but this is the second pass)?
- Are temperatures consistent (°C vs C, kelvin not Kelvin)?
- Are units rendered with proper notation (m/s² not m/s^2)?

**Output verdict per file:** `CLEAN` / `INCONSISTENT` / `RISK`.

### Dimension D8: Internationalization + localization sanity

Site is English-only (US English) but has global readers:
- Does the writer use US units (mph, feet) where international readers would be confused?
- Does it cite US-specific references (NGSS, AP) without explaining for non-US readers?
- Does the FAQ assume US K-12 vocabulary (e.g., "high school" vs "secondary school")?
- Are temperature scales mixed (°C vs °F)?

This is a nice-to-have, not blocker. Note any places where a small clarification would help.

**Output verdict per file:** `OK` / `MINOR-NOTE`.

### Dimension D9: Standards alignment depth (beyond citation)

The prior audit checked that standards.ap[0] is cited in some FAQ. This audit goes deeper:
- Does the contentSections actually MATCH what AP/NGSS expects students to learn for that standard?
- Are key sub-objectives covered (e.g., AP Physics 2 CHA-3.A is not just "AC circuits exist" — it requires students to compute reactance, impedance, phase angle, resonance frequency)?
- Does the fill miss any required objective?
- Is any cited standard misapplied (e.g., citing CHA-1.A when CHA-2.A would be more accurate)?

**Output verdict per file:** `ALIGNED` / `PARTIAL` / `MISCITED`. List missing objectives.

## Output format

Per file, produce a markdown section like this:

```markdown
## <filename>.ts

| Dim | Verdict | Note |
|---|---|---|
| D1 subject precision | PASS | — |
| D2 misconception authenticity | WEAK | misc[2] is strawman ("students often forget...") |
| D3 FAQ depth | OK | faq[3] reads like marketing |
| D4 use case runnability | RUNNABLE | — |
| D5 voice/brand | DRIFT | "magical pattern" reads cheerleadery |
| D6 cluster coherence | LOOSE | doesn't reference related geometric-optics-basics |
| D7 symbol/render | CLEAN | — |
| D8 i18n sanity | OK | — |
| D9 standards depth | PARTIAL | missing reactance computation per CHA-3.A |

**Top-3 fixes for this file:** ...
```

End each chunk with a chunk-level SUMMARY:
- Total `FAIL`/`STRAWMAN`/`OFF-BRAND`/`MISCITED` flags (these are P1 — must fix)
- Total `WEAK`/`DRIFT`/`PARTIAL` flags (P2 — should fix)
- Total `MINOR`/`OK` flags (informational)
- Top-5 worst issues across the chunk

## END PROMPT BODY

## After all 11 chunks finish

Aggregate findings, categorize by severity, and patch:

1. **P1 (factual error / missing AP objective)** — patch via subagent or directly. These could embarrass the platform.
2. **P2 (voice drift / weak misconception / loose cluster)** — patch only if not too many; otherwise log for next iteration.
3. **MINOR/OK** — informational; ship as-is.

Run validation gate after every patch batch:

```bash
pnpm test tests/unit/content/experiment-content-sections.test.ts
pnpm tsc --noEmit
```

## Estimated time + cost

- 11 chunks × ~5 min each (parallel) = ~5-15 min wall-clock
- Token budget: ~70K input + ~50K output per chunk × 11 = ~1.3M tokens
- Cost at gpt-5.5 xhigh pricing: roughly USD 5-15 depending on output length

## Recommended use

Run this audit BEFORE merging Wave 2 PR #7, OR run it in parallel with starting Wave 3 (the findings can be applied as a single follow-up PR after Wave 9 lands). The audit does NOT block Phase 3 execution — it surfaces polish opportunities.
