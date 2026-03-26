import type { Experiment } from "@/shared/types/experiment";

export const circuitDcVirtualLab: Experiment = {
  id: "circuit-dc-virtual-lab",
  slug: "circuit-dc-virtual-lab",
  title: "DC Circuit Virtual Lab",
  subtitle: "Build and measure DC circuits with a virtual breadboard",
  description:
    "Wire up DC circuits on a virtual breadboard. Use a multimeter to measure voltage and current, verify Kirchhoff's laws, and analyze series/parallel networks.",
  thumbnail: "/imgs/experiments/dc-circuits.png",

  standards: {
    ngss: ["HS-PS3-2", "HS-PS3-3"],
    gcse: ["AQA P2.3", "AQA P2.4"],
    ap: ["CHA-2.A", "CHA-2.B", "CHA-2.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["DC circuits", "breadboard", "multimeter", "Kirchhoff's laws", "voltage", "current", "resistance"],
  difficulty: "intermediate",

  parameters: [
    { id: "battery_voltage", label: "Battery Voltage", unit: "V", min: 1.5, max: 24, default: 9, step: 0.5, tier: "free" },
    { id: "r1", label: "R₁", unit: "Ω", min: 1, max: 1000, default: 100, step: 1, tier: "free" },
    { id: "r2", label: "R₂", unit: "Ω", min: 1, max: 1000, default: 200, step: 1, tier: "free" },
    { id: "r3", label: "R₃", unit: "Ω", min: 1, max: 1000, default: 300, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "V = IR", description: "Ohm's Law" },
    { latex: "\\sum V = 0", description: "Kirchhoff's Voltage Law (KVL)" },
    { latex: "\\sum I = 0", description: "Kirchhoff's Current Law (KCL)" },
  ],

  theory:
    "Kirchhoff's laws govern DC circuit analysis. KVL states that the sum of voltage drops around any closed loop equals zero (energy conservation). KCL states that the sum of currents at any node equals zero (charge conservation). Together they allow systematic solution of any DC circuit. Ohm's Law (V=IR) connects voltage, current, and resistance at each element.",
  instructions:
    "Drag components onto the virtual breadboard and connect them with wires. Use the multimeter to probe voltages and currents. Switch between series and parallel configurations. Verify KVL by summing voltages around a loop.",
  challenges: [
    { id: "cd-c1", question: "In a series circuit with 9V and three equal 100Ω resistors, what is the voltage across each?", hint: "Total R = 300Ω, I = 9/300 = 30mA, V = IR = 3V each", tier: "free" },
    { id: "cd-c2", question: "Three 300Ω resistors in parallel across 9V — what is the total current?", hint: "R_eq = 100Ω, I_total = 9/100 = 90mA", tier: "free" },
    { id: "cd-c3", question: "Apply KCL at the top node of a parallel circuit to find the branch currents.", hint: "I_total = I₁ + I₂ + I₃; each branch: I = V/R", tier: "pro" },
  ],

  wave: 8,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["dc-circuits-basic", "circuit-ac-virtual-lab", "ohms-law"],

  seoTitle: "DC Circuit Virtual Lab | Kirchhoff's Laws | AP Physics 2",
  seoKeywords: ["DC circuit", "breadboard", "Kirchhoff's laws", "multimeter", "AP Physics 2", "virtual lab"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "DC Circuits, Kirchhoff's Laws" },
};
