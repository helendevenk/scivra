---
name: d4-ap-physics-1-code-mapping
status: complete
created: 2026-05-03T19:31:33Z
updated: 2026-05-03T19:31:33Z
---

# D4 — AP Physics 1 Standard Code Mapping (Fall 2024 Redesign)

This report documents the source-audit trail for re-populating `standards.ap` on
two experiment slugs that PR #30 (Fix B) cleared because the previously stored
codes did not match the new AP Physics 1 taxonomy. All codes below appear
verbatim in the official College Board CED.

## Source

- **Document:** AP Physics 1: Algebra-Based Course and Exam Description, Effective Fall 2024
- **Publisher:** College Board, AP Central
- **URL:** <https://apcentral.collegeboard.org/media/pdf/ap-physics-1-course-and-exam-description-effective-fall-2024.pdf>
- **Format:** PDF (≈7.2 MB), text extracted with `pdftotext -layout`
- **Local snapshot:** `/tmp/ap-physics-1-ced.txt` (extraction of the same PDF)

The Fall 2024 redesigned framework uses Learning Objective codes shaped
`UNIT.TOPIC.LETTER` (e.g. `2.6.A`) with Essential Knowledge sub-codes
shaped `UNIT.TOPIC.LETTER.NUMBER` (e.g. `2.6.A.1`). Per repo convention from
Fix B (PR #30), we map at the Learning Objective grain (LETTER level), not the
Essential Knowledge grain.

## Per-slug mapping

### `gravity-force-lab-basics`

Topic: Newton's law of universal gravitation, `F = G·m₁·m₂/r²`, gravitational
field strength `g = GM/r²`.

| Code | CED location | Verbatim LO text | Justification |
|---|---|---|---|
| `2.6.A` | Unit 2 (Force and Translational Dynamics), Topic 2.6 Gravitational Force, p. 53 | "Describe the gravitational interaction between two objects with mass." | Direct match — the entire experiment is about the gravitational interaction between two masses. EK 2.6.A.1 explicitly names Newton's law of universal gravitation with the inverse-square + mass-product form, which is the lab's central formula. EK 2.6.A.2 covers the field-strength derivation `g = GM/r²` shown in the second formula. |

Codes intentionally not used:

- `2.6.B` — situations where gravity can be treated as constant. The lab
  explicitly varies distance to make the inverse-square dependence visible,
  so it does not directly target the "can be treated as constant" framing.
- `2.6.C` — apparent weight under acceleration. Not modeled in this lab (no
  accelerating reference frame).
- `2.6.D` — inertial vs. gravitational mass equivalence. Not surfaced in the
  lab UI or content sections.

### `momentum-collisions`

Topic: linear momentum `p = mv`, conservation of momentum, elastic vs.
perfectly-inelastic collisions, restitution.

| Code | CED location | Verbatim LO text | Justification |
|---|---|---|---|
| `4.1.A` | Unit 4 (Linear Momentum), Topic 4.1 Linear Momentum, p. 84 | "Describe the linear momentum of an object or system." | Direct match — every parameter (mass, velocity) and the first formula `p = mv` exercise this LO. EK 4.1.A.3 explicitly extends momentum to collision analysis. |
| `4.3.A` | Unit 4, Topic 4.3 Conservation of Linear Momentum, p. 87 | "Describe the behavior of a system using conservation of linear momentum." | Direct match — the lab's central learning objective is verifying `m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'` across cart pairs. Teacher use cases explicitly call out "HS-PS2-2 momentum audit" comparing `p_total` before/after. |
| `4.4.A` | Unit 4, Topic 4.4 Elastic and Inelastic Collisions, p. 89 | "Describe whether an interaction between objects is elastic or inelastic." | Direct match — the Restitution Coefficient slider sweeps the lab smoothly between elastic (e=1) and perfectly inelastic (e=0). EK 4.4.A.5 explicitly defines the perfectly inelastic case (objects stick together) which the "Perfectly Inelastic" preset embodies. |

Codes intentionally not used:

- `4.2.A` / `4.2.B` — impulse and impulse-momentum theorem. The lab references
  impulse in the formulas list and one learning card, but does not have a
  force-vs-time graph or a configurable contact-time control, so the
  experimentation surface does not directly target Topic 4.2 LOs.
- `4.3.B` — system selection for momentum conservation. Not a configurable
  axis in this lab; system is fixed as the two-cart pair.

## Methodology

1. Downloaded the official Fall 2024 AP Physics 1 CED PDF directly from
   `apcentral.collegeboard.org`.
2. Extracted text via `pdftotext -layout`.
3. Located Topic 2.6 (Gravitational Force) and Topics 4.1–4.4 (Linear
   Momentum) by grepping for the `^N.N.[A-Z]` Learning Objective code
   pattern.
4. Matched each candidate LO against the experiment's primary learning goals,
   parameter set, formulas, presets, and content sections.
5. Selected codes only when the LO statement was directly exercised by the
   experiment (not just tangentially related).
6. Verified each chosen code appears verbatim in the source extract.
7. Reviewed the mapping with `mcp__codex__codex` (read-only). Codex flagged
   `2.6.B` as a stretch (the lab varies distance to surface inverse-square
   behavior, not to demonstrate the "constant gravity" approximation), so it
   was removed from the gravity-force-lab-basics mapping. Momentum-collisions
   mapping was approved as proposed; codex specifically agreed that 4.2.A and
   4.2.B should not be added because the lab has no force-vs-time control or
   contact-time slider — impulse appears only as a referenced formula and
   learning card, not as a directly exercised interaction.

## Compliance with Fix B (PR #30)

PR #30 cleared the previously-stored AP codes on these two slugs because the
recorded values did not exist in the Fall 2024 framework. This re-population:

- Uses only Learning Objective codes that exist verbatim in the published CED.
- Matches the LETTER-level grain used elsewhere in the codebase.
- Touches only `standards.ap` on the two affected files; no other fields are
  modified.
