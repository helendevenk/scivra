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
      max: 500,
      default: 50,
      step: 1,
      tier: "free",
    },
    {
      id: "inductance",
      label: "Inductance L",
      unit: "mH",
      min: 1,
      max: 100,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "capacitance",
      label: "Capacitance C",
      unit: "μF",
      min: 0.1,
      max: 100,
      default: 10,
      step: 0.1,
      tier: "free",
    },
    {
      id: "drivingFreq",
      label: "Driving Frequency",
      unit: "Hz",
      min: 10,
      max: 5000,
      default: 500,
      step: 10,
      tier: "free",
    },
    {
      id: "voltage",
      label: "Source Voltage V₀",
      unit: "V",
      min: 1,
      max: 20,
      default: 10,
      step: 0.5,
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
    "Set R, L, and C values, then adjust the driving frequency. Watch the current and voltage waveforms in real time. The impedance curve shows the resonance peak — try to match the driving frequency to f₀ for maximum current. The phasor diagram shows the phase relationship between V and I. Toggle to transient mode to see damped oscillations.",

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
  contentSections: {
    whatIsIt:
      "A series RLC circuit contains a resistor R, inductor L, and capacitor C driven by an AC voltage source V₀ sin(ωt). The total opposition to current — impedance — is Z = √(R² + (ωL − 1/(ωC))²), and current amplitude is I₀ = V₀/Z. At the resonant frequency ω₀ = 1/√(LC), the inductive and capacitive reactances exactly cancel, Z collapses to R, and current peaks. Below resonance the circuit is net-capacitive (current leads voltage); above resonance it is net-inductive (current lags). The quality factor Q = ω₀L/R measures how sharply peaked the resonance is. In transient mode (no driving source), the circuit oscillates with damping set by ζ = R/(2√(L/C)). Adjust drivingFreq and watch the impedance curve shift in real time.",
    parameterExplanations: {
      resistance:
        "R in ohms sets the resistive loss in the circuit and is the sole term remaining in Z at resonance. Higher R broadens the resonance peak (lower Q = ω₀L/R) and damps transient oscillations faster.",
      inductance:
        "L in mH determines inductive reactance X_L = ωL, which grows with frequency. It also sets the resonant frequency ω₀ = 1/√(LC) and Q = ω₀L/R — larger L raises both the resonant frequency (if C is fixed) and sharpens the peak.",
      capacitance:
        "C in μF determines capacitive reactance X_C = 1/(ωC), which shrinks as frequency rises. Together with L it fixes ω₀ = 1/√(LC); a larger C lowers the resonant frequency and, for fixed L and R, lowers Q.",
      drivingFreq:
        "The AC source frequency in Hz. Sweeping this parameter traces out the impedance vs. frequency curve. Peak current occurs when drivingFreq = f₀ = 1/(2π√(LC)). Below f₀ the circuit is capacitive; above f₀ it is inductive.",
      voltage:
        "Peak amplitude V₀ of the AC source in volts. Scales all current and voltage amplitudes linearly without affecting resonant frequency, phase angle, or quality factor — those depend only on R, L, C, and ω.",
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
          "The resonant frequency changes if you increase the source voltage V₀.",
        correct:
          "Resonant frequency ω₀ = 1/√(LC) depends only on L and C, not on source voltage. Changing V₀ scales the current amplitude uniformly at all frequencies; it does not shift the peak's position on the frequency axis.",
      },
    ],
    teacherUseCases: [
      "Resonance hunt: set R = 50 Ω, L = 10 mH, C = 10 μF and ask students to calculate f₀ = 1/(2π√(LC)) ≈ 503 Hz before touching drivingFreq. Then have them sweep drivingFreq and find the frequency where current peaks, comparing their prediction to the simulation result. This closes the loop between formula and observable.",
      "Impedance vs. frequency sweep: have pairs record |Z| at drivingFreq = 100, 200, 300, 400, 500, 600, 700, 800 Hz and plot Z(f). Students identify the minimum Z = R at f₀, note the asymmetry above and below resonance, and connect the shape to Z = √(R² + (ωL − 1/(ωC))²).",
      "Q-factor investigation: keep L and C fixed; vary resistance to produce underdamped (R = 10 Ω), moderately damped (R = 50 Ω), and overdamped (R = 500 Ω) responses. Have students measure the bandwidth Δf (the frequency range where I ≥ I₀/√2) and verify Q = f₀/Δf.",
      "Phase angle misconception probe: pause the simulation at a frequency below resonance and ask students whether current leads or lags voltage. Many will guess lag (because inductors lag), but at sub-resonance the capacitive reactance dominates and current leads. Use the phasor display to correct the intuition.",
      "Transient decay comparison: switch to transient mode at fixed L and C; vary only resistance and observe how the oscillation envelope collapses faster at higher R. Ask students to extract the exponential decay time constant τ = 2L/R from the simulation and compare to the analytic value using their recorded R and L values.",
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
          "Current I₀ = V₀/Z is maximized when Z is minimized. Z = √(R² + (X_L − X_C)²) is smallest when X_L = X_C, which cancels the reactive term and leaves Z = R. Voltage across L and C individually can exceed V₀ at resonance (voltage magnification by factor Q), but that is a consequence of high current, not its cause.",
      },
      {
        question: "What is the quality factor Q and why does it matter?",
        answer:
          "Q = ω₀L/R = 1/(ω₀RC) = (1/R)√(L/C). It is dimensionless and measures the sharpness of the resonance peak: high Q means a narrow bandwidth and a circuit that selects one frequency tightly — essential for radio tuners and filters. Q also gives the voltage magnification at resonance: V_L = V_C = QV₀. For R = 50 Ω, L = 10 mH, C = 10 μF, Q ≈ 0.63.",
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
