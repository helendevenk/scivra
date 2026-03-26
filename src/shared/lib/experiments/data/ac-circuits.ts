import type { Experiment } from "@/shared/types/experiment";

export const acCircuits: Experiment = {
  id: "ac-circuits",
  slug: "ac-circuits-simulation",
  title: "AC Circuits",
  subtitle: "Explore alternating current, capacitors, and inductors",
  description:
    "Investigate AC circuits with resistors, capacitors, and inductors. Observe phase relationships between voltage and current, measure impedance, and explore resonance in LC circuits.",
  thumbnail: "/imgs/experiments/dc-circuits.png",

  standards: {
    ngss: ["HS-PS3-2", "HS-PS3-5"],
    gcse: ["AQA P2.5"],
    ap: ["CHA-3.A", "CHA-3.B", "CHA-3.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["AC circuits", "impedance", "capacitor", "inductor", "resonance", "phase"],
  difficulty: "advanced",

  parameters: [
    { id: "frequency", label: "Frequency", unit: "Hz", min: 1, max: 1000, default: 60, step: 1, tier: "free" },
    { id: "resistance", label: "Resistance", unit: "Ω", min: 1, max: 1000, default: 100, step: 1, tier: "free" },
    { id: "capacitance", label: "Capacitance", unit: "μF", min: 0.1, max: 100, default: 10, step: 0.1, tier: "free" },
    { id: "inductance", label: "Inductance", unit: "mH", min: 1, max: 500, default: 100, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "X_C = \\frac{1}{2\\pi f C}", description: "Capacitive reactance" },
    { latex: "X_L = 2\\pi f L", description: "Inductive reactance" },
    { latex: "Z = \\sqrt{R^2 + (X_L - X_C)^2}", description: "Impedance" },
    { latex: "f_0 = \\frac{1}{2\\pi\\sqrt{LC}}", description: "Resonant frequency" },
  ],

  theory:
    "In AC circuits, capacitors and inductors create frequency-dependent opposition called reactance. Capacitive reactance decreases with frequency while inductive reactance increases. At resonance, they cancel each other and only resistance limits current. Understanding AC circuits is essential for power systems, radio communications, and signal processing.",
  instructions:
    "Adjust frequency and observe how impedance changes. At resonance frequency, current reaches its maximum. The phasor diagram shows phase angles between voltage and current for each component.",
  challenges: [
    { id: "ac-c1", question: "At what frequency is capacitive reactance equal to resistance?", hint: "Set X_C = R and solve for f", tier: "free" },
    { id: "ac-c2", question: "Find the resonant frequency for L=100mH, C=10μF", hint: "Use f₀ = 1/(2π√LC)", tier: "free" },
    { id: "ac-c3", question: "How does power factor change near resonance?", hint: "Power factor = R/Z", tier: "pro" },
  ],

  wave: 8,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["dc-circuits-basic", "electromagnetic-induction", "faradays-electromagnetic-lab"],

  seoTitle: "AC Circuits Interactive Simulation | AP Physics 2 Virtual Lab",
  seoKeywords: ["AC circuits", "impedance", "resonance", "AP Physics 2", "capacitor inductor", "alternating current"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "AC Circuits, Impedance, Resonance" },
};
