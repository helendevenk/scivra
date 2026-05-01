import type { Experiment } from "@/shared/types/experiment";

export const capacitorsRcCircuits: Experiment = {
  id: "capacitors-rc-circuits",
  slug: "capacitors-charging-discharging-rc-circuits",
  title: "Capacitors & RC Circuits",
  subtitle: "Watch exponential charging and discharging governed by the RC time constant",
  description:
    "Connect a capacitor and resistor in series with a battery and observe the exponential voltage curve as the capacitor charges and discharges. Explore how plate geometry determines capacitance and how the RC time constant controls the speed of energy storage.",
  thumbnail: "/imgs/experiments/capacitors-rc-circuits.png",

  standards: {
    ngss: ["HS-PS2-6", "HS-PS3-3"],
    gcse: ["P6.5", "P6.6"],
    ap: ["CHA-2.E", "CHA-2.F", "CHA-4.A"],
  },
  primaryStandard: "ap-physics-c",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "capacitor",
    "RC circuit",
    "time constant",
    "charging",
    "discharging",
    "exponential decay",
    "capacitance",
    "energy storage",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "capacitance",
      label: "Capacitance",
      unit: "μF",
      min: 1,
      max: 1000,
      default: 100,
      step: 1,
      tier: "free",
    },
    {
      id: "resistance",
      label: "Resistance",
      unit: "kΩ",
      min: 1,
      max: 100,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "voltage",
      label: "Battery Voltage",
      unit: "V",
      min: 1,
      max: 24,
      default: 12,
      step: 0.5,
      tier: "free",
    },
    {
      id: "plate_area",
      label: "Plate Area",
      unit: "cm²",
      min: 10,
      max: 500,
      default: 100,
      step: 10,
      tier: "pro",
    },
    {
      id: "plate_separation",
      label: "Plate Separation",
      unit: "mm",
      min: 1,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "C = \\frac{Q}{V} = \\frac{\\varepsilon_0 A}{d}",
      description: "Capacitance from geometry",
    },
    {
      latex: "V(t) = V_0\\left(1 - e^{-t/RC}\\right)",
      description: "Charging voltage over time",
    },
    {
      latex: "V(t) = V_0\\,e^{-t/RC}",
      description: "Discharging voltage over time",
    },
    {
      latex: "\\tau = RC",
      description: "RC time constant",
    },
    {
      latex: "U = \\frac{1}{2}CV^2",
      description: "Energy stored in capacitor",
    },
  ],

  theory:
    "A capacitor stores charge on two parallel plates separated by a dielectric. Its capacitance C = ε₀A/d depends on plate area A and separation d. In an RC circuit, charging follows V(t) = V₀(1 − e^(−t/RC)) and discharging follows V(t) = V₀e^(−t/RC). The time constant τ = RC is the time to reach approximately 63% of the final voltage during charging, and the energy stored at full charge is U = ½CV².",
  instructions:
    "Set capacitance, resistance, and battery voltage with the free-tier sliders, then click Charge to watch the exponential curve build up. Click Discharge to release the stored energy. Unlock Pro mode to adjust plate geometry and see how it directly maps to capacitance.",

  challenges: [
    {
      id: "rc-c1",
      question: "With τ = RC = 2 s, what fraction of V₀ has the capacitor reached at t = 2 s?",
      hint: "Use V(t) = V₀(1 − e^(−t/τ)) and evaluate at t = τ",
      tier: "free",
    },
    {
      id: "rc-c2",
      question: "If you increase the plate separation d, how does capacitance change?",
      hint: "Use C = ε₀A/d and think about the direction of the change",
      tier: "free",
    },
    {
      id: "rc-c3",
      question:
        "Two identical capacitors are connected in parallel, then separately in series. What is the total capacitance in each case?",
      hint: "Parallel: C_total = C₁ + C₂; Series: 1/C_total = 1/C₁ + 1/C₂",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["electric-potential-voltage", "dc-circuits-basic", "electromagnetic-induction"],

  seoTitle: "Capacitors & RC Circuits — Charging Discharging Simulation | Scivra",
  seoKeywords: [
    "capacitor",
    "RC circuit",
    "time constant",
    "charging discharging",
    "exponential decay",
    "capacitance formula",
    "AP Physics electricity",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Capacitors, RC Circuits, and Exponential Charging",
  },
  contentSections: {
    whatIsIt:
      "A capacitor stores energy in the electric field between two parallel conducting plates separated by an insulating gap (vacuum or dielectric of permittivity κε₀). Capacitance C = κε₀A/d (κ = 1 for vacuum) relates plate geometry directly to charge-storage ability. Connect a capacitor and resistor in series with a battery and the charging voltage climbs as V_C(t) = V₀(1 − e^(−t/RC)) — an exponential approach, not a straight line. The time constant τ = RC sets the pace: after one τ the capacitor has reached ~63% of V₀; after five τ it is effectively full. Energy stored at full charge is U = ½CV². The simulation lets you sweep capacitance (μF), resistance (kΩ), and battery voltage, and you can alter plate geometry to watch how C = κε₀A/d shifts the curve in real time.",
    parameterExplanations: {
      capacitance:
        "Sets C in μF, which directly sets the time constant τ = RC and the total charge Q = CV₀ the capacitor can hold. Larger C means slower charging and more stored energy at full voltage.",
      resistance:
        "Sets R in kΩ, the other factor in τ = RC. A larger R limits current flow so the capacitor charges more slowly; the final voltage is unchanged because that depends only on V₀.",
      voltage:
        "The battery EMF in volts — sets the asymptote V₀ that V_C(t) approaches during charging and the starting voltage V₀ during discharging. Changing voltage rescales the curve vertically without affecting the time constant.",
      plate_area:
        "Physical area A of each plate in cm². Capacitance scales as C = ε₀A/d, so doubling A doubles C, which lengthens the RC time constant and increases maximum stored energy U = ½CV².",
      plate_separation:
        "Gap d between the plates in mm. For a given charge Q, the electric field E = Q/(ε₀A) is independent of d, but the voltage V = Ed grows linearly with d, so C = Q/V = ε₀A/d decreases as d increases.",
    },
    misconceptions: [
      {
        wrong:
          "The capacitor charges at a constant rate until it hits V₀, then stops — like filling a bucket from a steady tap.",
        correct:
          "Charging is exponential: the rate slows continuously because the growing V_C opposes the battery. V_C(t) = V₀(1 − e^(−t/RC)) approaches V₀ asymptotically and technically never reaches it exactly.",
      },
      {
        wrong:
          "Doubling the resistance doubles the final charge on the capacitor.",
        correct:
          "The final charge Q = CV₀ depends only on capacitance and voltage, not resistance. Resistance changes how fast the capacitor charges (via τ = RC), not how much charge it ultimately stores.",
      },
      {
        wrong:
          "A fully charged capacitor in a DC circuit continues to draw current.",
        correct:
          "Once V_C = V₀, the voltage across R is zero and current is zero. The capacitor blocks steady DC — that is its defining steady-state behavior.",
      },
      {
        wrong:
          "Energy stored in a capacitor equals QV, not ½CV².",
        correct:
          "QV would be the energy if the full voltage V were present during the entire charging process. Because voltage builds from 0 to V₀, the actual work done is the integral ∫₀^Q V dq = Q²/(2C) = ½CV².",
      },
      {
        wrong:
          "Increasing plate separation increases capacitance because the plates are farther apart and can hold more charge.",
        correct:
          "Capacitance C = ε₀A/d decreases as d increases. For a given charge per unit area, the electric field E is unchanged, but the voltage V = Ed grows with d, so C = Q/V decreases.",
      },
    ],
    teacherUseCases: [
      "Conceptual entry: before touching the simulation, ask students to sketch V_C vs. time for charging and predict whether the curve is linear, exponential-rising, or exponential-falling. After running the simulation, overlay their sketches on the actual output and discuss why the exponential shape arises from Kirchhoff's voltage law dV/dt = (V₀ − V_C)/(RC).",
      "Time-constant measurement lab: set a specific capacitance and resistance, run the charge cycle, pause at t = τ = RC, and have students read V_C off the graph. They should find ≈63% of V₀ every time regardless of R or C individually — only τ = RC matters. Record (R, C, τ_measured) triples and verify the linear relationship.",
      "Energy audit: charge the capacitor to V₀, record U = ½CV², then discharge through a different resistance and compare the energy released. Use this to open a discussion about what happened to the energy delivered by the battery — half was dissipated in R during charging regardless of R's value.",
      "Geometry probe: vary plate_area and plate_separation, then challenge students to find two different (A, d) combinations that produce the same C. This forces them to work with C = ε₀A/d quantitatively rather than as a formula to memorize.",
      "Misconception probe: set resistance to 1 kΩ, charge fully, then ask 'if I double the resistance to 2 kΩ and charge again, will the final voltage be higher, lower, or the same?' Reveal the result and connect back to the independence of V_final from R.",
    ],
    faq: [
      {
        question: "What does the RC time constant actually mean physically?",
        answer:
          "τ = RC is the time for the charging voltage to reach (1 − 1/e) ≈ 63.2% of V₀, or for the discharging voltage to fall to 1/e ≈ 36.8% of its starting value. Physically it balances how much charge the capacitor wants to hold (C) against how fast the circuit can deliver it (1/R). At t = 5τ the capacitor is within 0.7% of its final value — conventionally considered fully charged.",
      },
      {
        question: "Why does the charging curve flatten out instead of going straight to V₀?",
        answer:
          "As V_C rises it opposes the battery more and more, so the driving voltage across R (= V₀ − V_C) shrinks continuously. Less voltage across R means less current, which means V_C grows more slowly. This self-limiting feedback is exactly what produces the exponential: dV_C/dt = (V₀ − V_C)/τ.",
      },
      {
        question: "What AP Physics C standards does this simulation address?",
        answer:
          "The simulation targets CHA-2.E (relating charge, voltage, and capacitance), CHA-2.F (parallel-plate geometry and C = ε₀A/d), and CHA-4.A (RC circuit transient analysis including the time-constant τ = RC and exponential charging/discharging). These codes are listed directly in the experiment's standards block.",
      },
      {
        question: "How is energy stored in a capacitor, and where does the other half of the battery's energy go?",
        answer:
          "The capacitor stores U = ½CV² = Q²/(2C). The battery delivers total energy QV₀ = CV₀², so exactly half — ½CV₀² — is dissipated in R as heat during charging, regardless of the value of R. This result surprises students because a larger R seems like it should waste less energy, but a larger R also means slower charging and longer time, and the two effects exactly cancel.",
      },
      {
        question: "Can capacitors be connected in series and parallel, and how does that change τ?",
        answer:
          "Yes. In parallel, C_total = C₁ + C₂, which increases τ = RC_total. In series, 1/C_total = 1/C₁ + 1/C₂, which decreases C_total and shortens τ. The same rules apply to the RC time constant: τ scales directly with whatever effective capacitance the resistor sees.",
      },
      {
        question: "Does the current through the resistor ever reach zero during charging?",
        answer:
          "Mathematically no — I(t) = (V₀/R)e^(−t/τ) decays to zero only as t → ∞. Practically, after 5τ the current is less than 0.7% of its initial value and is treated as zero. In the simulation you can observe the current trace flatten and become indistinguishable from the axis well before the time axis ends.",
      },
    ],
  },
};
