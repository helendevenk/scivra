---
name: d4-ap-physics-2-c-code-mapping
status: complete
created: 2026-05-03T19:33:24Z
updated: 2026-05-03T19:33:24Z
---

# D4 Phase D Wave 4 — AP Physics 2 + AP Physics C Standard Code Repop

This report documents the audit trail for re-populating AP standard codes on two slugs that PR #30 (Fix B) cleared after invalidating training-cutoff codes. Codes here are sourced verbatim from the official 2024-redesign College Board Course and Exam Descriptions (CEDs).

## Methodology (applies to both sections)

1. Fetched the two CEDs through Jina Reader (`https://r.jina.ai/<URL>`) on 2026-05-03.
2. Cross-verified the CED structure (unit and topic numbering) against `apcentral.collegeboard.org/media/pdf/ap-physics-c-mechanics-course-at-a-glance.pdf`, fiveable.me topic pages, and `physicsqanda.com` AP Physics 2 unit guide via Exa search.
3. Selected codes that (a) appear verbatim in the CED extract and (b) map to specific lab content (formulas, presets, theory, parameter explanations).
4. Submitted the proposed mappings to a Codex review session (default model `gpt-5`, `read-only` sandbox, `never` approval) for verbatim verification and fit checking. Codex flagged one missing code on `circuit-dc-virtual-lab` (Kirchhoff's Junction Rule, 11.7.A) and approved `angular-momentum-3d` as proposed; adjusted accordingly.
5. Edited only `standards.ap` on each TS file. Nothing else was touched.

Raw CED extracts saved to `/tmp/ap-physics-2-ced.txt` and `/tmp/ap-physics-c-mech-ced.txt` during the run.

## AP Physics 2 (Unit 11 — Electric Circuits)

**Source:** https://apcentral.collegeboard.org/media/pdf/ap-physics-2-course-and-exam-description.pdf
**Cross-verification:** https://library.fiveable.me/ap-physics-2-revised/unit-11 ; https://physicsqanda.com/ap-physics/ap-physics-2-complex-circuits-kirchhoffs-rules/

### Slug: `circuit-dc-virtual-lab`

**Final mapping:** `ap: ["11.5.A", "11.6.A", "11.7.A", "11.8.A"]`

| Code | CED Topic | LO text (verbatim from CED) | Lab evidence |
|------|-----------|-----------------------------|--------------|
| 11.5.A | 11.5 Compound Direct Current (DC) Circuits | "Describe the behavior of DC circuits with multiple resistors in series and parallel configurations." | Voltage Divider preset (`{ id: "divider", ... r1: 1000, r2: 2000 }`); divider math in challenge `cd-c1`; FAQ item on voltage-divider reasoning. |
| 11.6.A | 11.6 Kirchhoff's Loop Rule | "Apply Kirchhoff's loop rule to analyze circuits." | Formula `\\sum V = 0` (KVL); theory section centers on "sum of voltage drops around any closed loop equals zero (energy conservation)"; misconception about voltage being "used up". |
| 11.7.A | 11.7 Kirchhoff's Junction Rule | "Apply Kirchhoff's junction rule to analyze circuits." | Formula `\\sum I = 0` (KCL); theory describes "sum of currents at any node equals zero (charge conservation)"; misconception about current splitting evenly between paths. |
| 11.8.A | 11.8 Resistor-Capacitor (RC) Circuits | "Describe the behavior of RC circuits during charging and discharging." | RC Charging preset; formula `\\tau = RC`; challenge `cd-c3` computes τ; FAQ item on RC charging timescale. |

Codex review verdict: **ADJUST** — original proposal was `[11.5.A, 11.6.A, 11.8.A]`; codex recommended adding 11.7.A on the basis of the explicit `\\sum I = 0` formula and node-conservation content. Accepted.

## AP Physics C: Mechanics (Unit 6 — Energy and Momentum of Rotating Systems)

**Source:** https://apcentral.collegeboard.org/media/pdf/ap-physics-c-mechanics-course-and-exam-description.pdf
**Cross-verification:** https://apcentral.collegeboard.org/media/pdf/ap-physics-c-mechanics-course-at-a-glance.pdf ; https://library.fiveable.me/ap-physics-c-mechanics/unit-6 ; https://www.williamsphysics.co.uk/ap/physics_c_mech/notebook/rotational_energy_angular_momentum

### Slug: `angular-momentum-3d`

**Final mapping:** `ap: ["6.3.A", "6.3.B", "6.4.A"]`

| Code | CED Topic | LO text (verbatim from CED) | Lab evidence |
|------|-----------|-----------------------------|--------------|
| 6.3.A | 6.3 Angular Momentum and Angular Impulse | "Describe angular momentum of a system" | Formula `\\vec{L} = I\\vec{\\omega}`; theory ("L = Iω is a vector quantity pointing along the axis of rotation (right-hand rule)"); blue L vector rendered in the 3D scene; `whatIsIt` references right-hand rule. |
| 6.3.B | 6.3 Angular Momentum and Angular Impulse | "Describe the angular impulse exerted on a system" | Formula `\\vec{\\tau} = \\frac{d\\vec{L}}{dt}` (angular impulse / time-rate-of-change form); Gyroscope preset uses Applied Torque to redirect L; misconception about torque always speeding up rotation; FAQ item on perpendicular torque producing precession. |
| 6.4.A | 6.4 Conservation of Angular Momentum | "Describe the angular momentum of a system when no external torques act on it" | Theory: "In the absence of external torque, angular momentum is conserved: L_i = L_f"; Figure Skater preset (Applied Torque = 0); challenges `am-c2` (skater I→ω) and `am-c3` (rotational inelastic collision); teacher use case calls out 6.4.A explicitly as "AP 5.D.1 conservation lab" (legacy code label, same physics). |

Codex review verdict: **APPROVE** — all three codes appear verbatim in the CED extract and fit the experiment content; no swap recommended.

## Notes

- The legacy AP Physics C codes `5.D.1` and `5.E.1` referenced in `angular-momentum-3d`'s `teacherUseCases` and `faq` text are pre-2024-redesign labels. They were intentionally **not** modified in this Wave per the constraint "no fields other than `standards.ap` modified." Future copy-edit waves can update those user-facing references to the new 6.3.x / 6.4.x codes if desired.
- The plan's "1-3 codes per slug" guideline was treated as soft guidance. `circuit-dc-virtual-lab` ended up with 4 codes because Codex flagged 11.7.A (KCL) as a substantive omission — accuracy beat tightness here.
