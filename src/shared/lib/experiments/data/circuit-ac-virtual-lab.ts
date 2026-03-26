import type { Experiment } from "@/shared/types/experiment";

export const circuitAcVirtualLab: Experiment = {
  id: "circuit-ac-virtual-lab",
  slug: "circuit-ac-virtual-lab",
  title: "AC Circuit Virtual Lab",
  subtitle: "Build and analyze AC circuits with real measurements",
  description:
    "Construct AC circuits with resistors, capacitors, and inductors using virtual lab equipment. Measure voltage and current with oscilloscopes, observe phase shifts, and analyze RLC circuit behavior.",
  thumbnail: "/imgs/experiments/dc-circuits.png",

  standards: {
    ngss: ["HS-PS3-2"],
    gcse: ["AQA P2.5"],
    ap: ["CHA-3.A", "CHA-3.B", "CHA-3.C", "CHA-3.D"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["AC circuit", "oscilloscope", "RLC", "impedance", "virtual lab", "phase shift"],
  difficulty: "advanced",

  parameters: [
    { id: "source_voltage", label: "Source Voltage (peak)", unit: "V", min: 1, max: 100, default: 10, step: 0.5, tier: "free" },
    { id: "frequency", label: "Frequency", unit: "Hz", min: 1, max: 10000, default: 60, step: 1, tier: "free" },
    { id: "resistance", label: "Resistance", unit: "Ω", min: 0, max: 1000, default: 100, step: 1, tier: "free" },
    { id: "capacitance", label: "Capacitance", unit: "μF", min: 0.1, max: 1000, default: 100, step: 0.1, tier: "pro" },
    { id: "inductance", label: "Inductance", unit: "mH", min: 0, max: 1000, default: 0, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "Z = \\sqrt{R^2 + (X_L - X_C)^2}", description: "Impedance" },
    { latex: "\\phi = \\arctan\\left(\\frac{X_L - X_C}{R}\\right)", description: "Phase angle" },
    { latex: "I_{rms} = \\frac{V_{rms}}{Z}", description: "RMS current" },
  ],

  theory:
    "AC circuits require analysis with phasors and complex impedance. The total impedance Z of a series RLC circuit combines resistance R with inductive reactance X_L and capacitive reactance X_C. At resonance (X_L = X_C), impedance is purely resistive and current is maximized. An oscilloscope reveals phase relationships between voltage and current waveforms.",
  instructions:
    "Use the component toolbar to build your circuit. Connect the oscilloscope probes to measure waveforms. Adjust frequency to find resonance — the oscilloscope will show V and I in phase. The phasor diagram updates in real time.",
  challenges: [
    { id: "ca-c1", question: "At 60 Hz, what is the capacitive reactance of a 100μF capacitor?", hint: "X_C = 1/(2π × 60 × 100×10⁻⁶)", tier: "free" },
    { id: "ca-c2", question: "Find the resonant frequency for L=100mH, C=100μF.", hint: "f₀ = 1/(2π√(LC))", tier: "free" },
    { id: "ca-c3", question: "At resonance, why is the voltage across L and C each larger than the source voltage?", hint: "V_L = IX_L; at resonance X_L can be >> R, so V_L >> V_source", tier: "pro" },
  ],

  wave: 8,
  tier: "pro",
  estimatedTime: 35,
  relatedExperiments: ["ac-circuits", "circuit-dc-virtual-lab", "dc-circuits-basic"],

  seoTitle: "AC Circuit Virtual Lab | RLC Circuits | AP Physics 2 Simulation",
  seoKeywords: ["AC circuit lab", "RLC circuit", "impedance", "oscilloscope", "AP Physics 2", "virtual lab"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "AC Circuits, RLC, Impedance" },
};
