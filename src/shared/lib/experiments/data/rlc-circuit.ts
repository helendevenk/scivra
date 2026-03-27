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
};
