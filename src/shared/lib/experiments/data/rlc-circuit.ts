import type { Experiment } from "@/shared/types/experiment";

export const rlcCircuit: Experiment = {
  id: "rlc-circuit",
  slug: "rlc-circuit",
  title: "RLC Circuit",
  subtitle: "Resonance, impedance, and transient response in AC circuits",
  description:
    "Build and analyze series RLC circuits driven by AC sources. Observe resonance as you sweep the driving frequency, watch the transient oscillations of current and voltage, and measure impedance, phase angle, and quality factor Q. Compare underdamped, critically damped, and overdamped responses.",
  thumbnail: "/imgs/experiments/rlc-circuit.png",

  standards: {
    ngss: ["HS-PS2-5"],
    gcse: [],
    ap: ["4.A.1", "4.B.1"],
  },
  primaryStandard: "ap-physics-c",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "RLC circuit",
    "resonance",
    "impedance",
    "AC circuits",
    "damped oscillations",
    "quality factor",
    "AP Physics C",
  ],
  difficulty: "advanced",

  parameters: [
    {
      id: "resistance",
      label: "Resistance R",
      unit: "Ω",
      min: 1,
      max: 1000,
      default: 100,
      step: 1,
      tier: "free",
    },
    {
      id: "inductance",
      label: "Inductance L",
      unit: "mH",
      min: 1,
      max: 500,
      default: 50,
      step: 1,
      tier: "free",
    },
    {
      id: "capacitance",
      label: "Capacitance C",
      unit: "μF",
      min: 1,
      max: 200,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "frequency",
      label: "Driving Frequency",
      unit: "Hz",
      min: 10,
      max: 2000,
      default: 225,
      step: 5,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "Z = \\sqrt{R^2 + \\left(\\omega L - \\frac{1}{\\omega C}\\right)^2}",
      description:
        "Impedance of a series RLC circuit: depends on R, inductive reactance ωL, and capacitive reactance 1/(ωC)",
    },
    {
      latex: "f_0 = \\frac{1}{2\\pi\\sqrt{LC}}",
      description:
        "Resonant frequency: where inductive and capacitive reactances cancel (XL = XC)",
    },
    {
      latex: "Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}}",
      description:
        "Quality factor: higher Q means sharper resonance peak and lower energy loss per cycle",
    },
  ],

  theory:
    "An RLC circuit consists of a resistor R, inductor L, and capacitor C in series with an AC voltage source V₀sin(ωt). The impedance Z determines the current amplitude I₀ = V₀/Z. At resonance (ω₀ = 1/√(LC)), the inductive reactance XL = ωL exactly cancels the capacitive reactance XC = 1/(ωC), leaving Z = R (minimum impedance, maximum current). The phase angle φ = arctan((XL - XC)/R) indicates whether current leads or lags voltage. The quality factor Q = ω₀L/R = 1/(R√(C/L)) measures the sharpness of the resonance peak. In transient response (no driving source), the circuit exhibits damped oscillations. The damping ratio ζ = R/(2√(L/C)) determines the behavior: underdamped (ζ < 1, oscillating decay), critically damped (ζ = 1, fastest non-oscillating decay), or overdamped (ζ > 1, slow exponential decay).",

  instructions:
    "Use the four sliders for Resistance, Inductance, Capacitance, and Frequency to tune the series RLC circuit. Try the Underdamped, At Resonance, and Overdamped presets to jump between contrasting damping and resonance cases, then adjust one slider at a time while watching current, voltage, impedance, phase angle, and transient behavior update.",

  challenges: [
    {
      id: "rlc-c1",
      question:
        "With L = 10 mH and C = 10 μF, what is the resonant frequency?",
      hint: "f₀ = 1/(2π√(LC)) = 1/(2π√(0.01 × 10⁻⁵)) ≈ 503 Hz",
      tier: "free",
    },
    {
      id: "rlc-c2",
      question:
        "At resonance with R = 50 Ω, L = 10 mH, C = 10 μF, what is the quality factor Q?",
      hint: "Q = (1/R)√(L/C) = (1/50)√(0.01/10⁻⁵) = (1/50)(31.6) ≈ 0.63",
      tier: "free",
    },
    {
      id: "rlc-c3",
      question:
        "What happens to the resonant frequency if you double both L and C?",
      hint: "f₀ = 1/(2π√(LC)). Doubling both: f₀' = 1/(2π√(4LC)) = f₀/2. It halves.",
      tier: "pro",
    },
  ],

  wave: 12,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["ac-circuits", "capacitors-rc-circuits"],
  htmlPath: "/experiments/ap-physics-c/rlc-circuit.html",

  seoTitle: "RLC Circuit Simulation | Scivra AP Physics C",
  seoKeywords: [
    "RLC circuit simulation",
    "resonance frequency calculator",
    "impedance visualization",
    "AP Physics C circuits",
    "damped oscillation interactive",
    "quality factor Q",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Advanced Placement",
    teaches: "RLC Circuits and Resonance",
  },
  htmlControlAliases: { resistance: "sl-R", inductance: "sl-L", capacitance: "sl-C", frequency: "sl-f" },
  presets: [
    {
      id: "loadPreset:underdamped",
      label: "Underdamped (R=10Ω)",
      description:
        "A low-resistance setup where energy loss is small enough for the transient response to oscillate visibly before it decays.",
    },
    {
      id: "loadPreset:resonance",
      label: "At Resonance",
      description:
        "A preset that places the driving frequency near the LC resonant frequency so current is large and the reactive terms cancel.",
    },
    {
      id: "loadPreset:overdamped",
      label: "Overdamped (R=1kΩ)",
      description:
        "A high-resistance setup where damping dominates, suppressing oscillation and showing a slow non-oscillatory transient response.",
    },
  ],
  contentSections: {
    whatIsIt:
      "A series RLC circuit contains a resistor R, inductor L, and capacitor C driven by an AC voltage source V₀ sin(ωt). The total opposition to current — impedance — is Z = √(R² + (ωL − 1/(ωC))²), and current amplitude is I₀ = V₀/Z. At the resonant frequency ω₀ = 1/√(LC), the inductive and capacitive reactances exactly cancel, Z collapses to R, and current peaks. Below resonance the circuit is net-capacitive (current leads voltage); above resonance it is net-inductive (current lags). The quality factor Q = ω₀L/R measures how sharply peaked the resonance is. In transient mode (no driving source), the circuit oscillates with damping set by ζ = R/(2√(L/C)). Adjust Frequency and watch the impedance curve shift in real time.",
    parameterExplanations: {
      resistance:
        "Resistance sets the ohmic loss in the series circuit. It is the only part of the impedance that remains at resonance, because the inductive and capacitive reactances cancel there. Raising Resistance lowers the peak current, broadens the resonance curve, and reduces the quality factor Q = ω₀L/R. It also increases damping in the transient response, so stored energy disappears faster as heat. Use the Underdamped and Overdamped presets to see the contrast: low resistance lets current and charge oscillate while the envelope decays, while high resistance can suppress visible oscillation and make the circuit return toward equilibrium without ringing.",
      inductance:
        "Inductance measures how strongly the coil resists changes in current. The slider is shown in millihenries, while the formulas use henries, so each setting is converted before calculating X_L = 2πfL. Increasing Inductance raises inductive reactance at the same frequency, which pushes the circuit toward inductive behavior where current lags voltage. It also lowers the resonant frequency because f₀ = 1/(2π√(LC)). With Resistance and Capacitance fixed, a larger Inductance shifts the resonance marker to a lower frequency and can increase Q, making the resonance peak sharper when damping is not too large.",
      capacitance:
        "Capacitance measures how much charge the capacitor stores for each volt across it. The slider is shown in microfarads, while calculations convert it to farads. Increasing Capacitance lowers capacitive reactance X_C = 1/(2πfC), so the capacitor offers less opposition at the same frequency. It also lowers the resonant frequency because the LC energy exchange becomes slower when either storage element is larger. Hold Resistance and Inductance fixed, then raise Capacitance to watch the resonance point move lower and the phase response change. This slider is useful for comparing capacitive behavior below resonance with the more resistive behavior at resonance.",
      frequency:
        "Frequency sets how many AC cycles the driving source completes each second. Sweeping it is the direct way to move one fixed RLC circuit from capacitive behavior, through resonance, into inductive behavior. Below f₀, capacitive reactance is larger than inductive reactance and current leads the source voltage. At f₀ = 1/(2π√(LC)), the two reactances cancel, impedance reaches its minimum value R, and current peaks. Above f₀, inductive reactance dominates and current lags. Use the At Resonance preset as a reference, then move Frequency lower and higher to connect waveform phase, impedance, and the resonance graph.",
    },
    misconceptions: [
      {
        wrong:
          "A series RLC circuit always resonates — it's built into the components.",
        correct:
          "Resonance occurs only when the driving frequency exactly equals ω₀ = 1/√(LC). Drive it at any other frequency and Z > R; the circuit still responds, just with lower current and a nonzero phase angle between V and I.",
      },
      {
        wrong:
          "Inductors block AC current the same way capacitors block DC current.",
        correct:
          "Inductors block high-frequency AC (X_L = ωL increases with ω) while passing low frequencies. Capacitors block low-frequency AC and DC (X_C = 1/(ωC) decreases with ω) while passing high frequencies. They are frequency-selective in opposite directions.",
      },
      {
        wrong:
          "At resonance the voltages across L and C are both zero.",
        correct:
          "At resonance the voltages across L and C are individually large — each equals I₀X_L = I₀/ωC — but they are equal in magnitude and 180° out of phase so they cancel in the series loop, leaving only V_R = V₀.",
      },
      {
        wrong:
          "A higher quality factor Q means the circuit dissipates more energy per cycle.",
        correct:
          "Higher Q means less fractional energy loss per cycle: Q = 2π × (energy stored)/(energy dissipated per cycle). A high-Q circuit is lightly damped, sustaining oscillations longer and producing a sharper, taller resonance peak.",
      },
      {
        wrong:
          "The resonant frequency changes when the circuit is driven with a larger source amplitude.",
        correct:
          "Resonant frequency ω₀ = 1/√(LC) depends only on L and C. A larger source amplitude would scale the current response, but it would not move the peak's position on the frequency axis. To shift resonance in this simulation, change Inductance or Capacitance.",
      },
    ],
    teacherUseCases: [
      "Resonance hunt: use the At Resonance preset, note R = 100 Ω, L = 50 mH, C = 10 μF, and ask students to calculate f₀ = 1/(2π√(LC)) ≈ 225 Hz before moving the Frequency slider. Then have them sweep Frequency below and above that value to find where current peaks, comparing prediction to observation.",
      "Impedance vs. frequency sweep: have pairs keep Resistance, Inductance, and Capacitance fixed, then record |Z| at Frequency = 100, 150, 200, 225, 250, 300, 400, and 600 Hz. Students plot Z(f), identify the minimum Z = R near f₀, and connect the curve to Z = √(R² + (ωL − 1/(ωC))²).",
      "Q-factor investigation: compare the Underdamped, At Resonance, and Overdamped presets while L and C stay fixed. Students should connect lower Resistance with sharper resonance and longer ringing, then explain why higher Resistance lowers current and suppresses transient oscillation.",
      "Phase angle misconception probe: pause the simulation at a Frequency below resonance and ask students whether current leads or lags voltage. Many will guess lag because inductors lag, but below resonance the capacitive reactance dominates and current leads. Use the phasor display to correct the intuition.",
      "Transient decay comparison: keep Inductance and Capacitance fixed, then vary only Resistance or switch between Underdamped and Overdamped presets. Students compare how the oscillation envelope collapses faster at higher Resistance and describe the qualitative shift from ringing decay to non-oscillatory return.",
    ],
    faq: [
      {
        question: "What is the resonant frequency of an RLC circuit and how do I calculate it?",
        answer:
          "Resonant frequency is f₀ = 1/(2π√(LC)). In angular frequency notation, ω₀ = 1/√(LC) rad/s. At this frequency inductive reactance X_L = ωL equals capacitive reactance X_C = 1/(ωC), they cancel in the impedance formula, and Z = R — its minimum value. For L = 10 mH and C = 10 μF, f₀ ≈ 503 Hz.",
      },
      {
        question: "What do the AP Physics C standards 4.A.1 and 4.B.1 require me to know about RLC circuits?",
        answer:
          "Standard 4.A.1 addresses the relationship between charge, current, and time in AC circuits, while 4.B.1 covers energy storage and dissipation in circuit elements. For RLC circuits this means knowing how to write the differential equation L d²q/dt² + R dq/dt + q/C = V₀ sin(ωt), identify the steady-state current amplitude I₀ = V₀/Z, and compute energy stored in L (½LI²) and C (Q²/(2C)) relative to power dissipated in R.",
      },
      {
        question: "Why does current peak at resonance rather than at maximum voltage across L or C?",
        answer:
          "Current amplitude is largest when impedance is smallest. Z = √(R² + (X_L − X_C)²) reaches its minimum when X_L = X_C, which cancels the reactive term and leaves Z = R. The voltages across L and C individually can be large at resonance, but that is a consequence of high current and reactive energy exchange, not the cause of the current peak.",
      },
      {
        question: "What is the quality factor Q and why does it matter?",
        answer:
          "Q = ω₀L/R = 1/(ω₀RC) = (1/R)√(L/C). It is dimensionless and measures the sharpness of the resonance peak: high Q means a narrow bandwidth and a circuit that selects one frequency tightly — essential for radio tuners and filters. Q also describes how lightly damped the circuit is: higher Q circuits ring longer in transient response, while lower Q circuits lose energy more quickly.",
      },
      {
        question: "Below resonance is the RLC circuit capacitive or inductive?",
        answer:
          "Below resonance (ω < ω₀), X_C = 1/(ωC) > X_L = ωL, so the net reactance is capacitive and current leads voltage. Above resonance (ω > ω₀), X_L > X_C and the net reactance is inductive — current lags. Phase angle φ = arctan((X_L − X_C)/R) is negative below resonance and positive above.",
      },
      {
        question: "What is the difference between underdamped, critically damped, and overdamped in transient RLC behavior?",
        answer:
          "The damping ratio ζ = R/(2√(L/C)) determines the response with no driving source. Underdamped (ζ < 1): oscillating decay — charge sloshes between L and C while R gradually drains energy. Critically damped (ζ = 1): fastest return to equilibrium without oscillation. Overdamped (ζ > 1): slow exponential decay, no oscillation. For L = 10 mH, C = 10 μF, the critical resistance is R_c = 2√(L/C) = 2√(0.01/10⁻⁵) = 63.2 Ω.",
      },
    ],
  },
};
