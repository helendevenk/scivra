import type { Experiment } from "@/shared/types/experiment";

export const gasesIntro: Experiment = {
  id: "gases-intro",
  slug: "gases-intro-ideal-gas-law",
  title: "Gases: Introduction",
  subtitle: "Explore pressure, volume, temperature, and the Ideal Gas Law",
  description:
    "Pump gas molecules into a container and observe pressure, volume, and temperature. Verify Boyle's Law, Charles's Law, and the combined Ideal Gas Law with interactive controls.",
  thumbnail: "/imgs/experiments/ideal-gas-thermodynamics.png",

  standards: {
    ngss: ["HS-PS3-2"],
    gcse: ["AQA C3.5", "AQA P8.3"],
    ap: ["TDE-1.A", "TDE-1.B", "TDE-1.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "thermodynamics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["ideal gas law", "pressure", "volume", "temperature", "Boyle's law", "Charles's law"],
  difficulty: "beginner",

  parameters: [
    { id: "num_molecules", label: "Molecules", unit: "", min: 10, max: 500, default: 100, step: 10, tier: "free" },
    { id: "temperature", label: "Temperature", unit: "K", min: 100, max: 1000, default: 300, step: 10, tier: "free" },
    { id: "volume", label: "Container Width", unit: "nm", min: 1, max: 20, default: 10, step: 0.5, tier: "free" },
  ],

  formulas: [
    { latex: "PV = nRT", description: "Ideal Gas Law" },
    { latex: "P \\propto \\frac{1}{V}", description: "Boyle's Law (constant T)" },
    { latex: "V \\propto T", description: "Charles's Law (constant P)" },
  ],

  theory:
    "The Ideal Gas Law PV = nRT relates pressure, volume, amount (moles), and temperature of an ideal gas. Boyle's Law (constant T): pressure and volume are inversely proportional. Charles's Law (constant P): volume and temperature are directly proportional. Real gases deviate from ideal behavior at high pressures and low temperatures when intermolecular forces become significant.",
  instructions:
    "Add or remove molecules using the pump. Adjust temperature using the heater/cooler. Change container volume by dragging the wall. Observe how pressure changes as you hold different variables constant to verify gas laws.",
  challenges: [
    { id: "gi-c1", question: "If you halve the volume at constant temperature, what happens to pressure?", hint: "Boyle's Law: PV = const → P doubles", tier: "free" },
    { id: "gi-c2", question: "At 300K the gas occupies 10L. What volume at 600K (constant pressure)?", hint: "Charles's Law: V₁/T₁ = V₂/T₂ → V₂ = 20L", tier: "free" },
    { id: "gi-c3", question: "Why does a sealed balloon shrink in a cold room?", hint: "Constant n and P → V ∝ T; lower T means smaller V", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["ideal-gas-thermodynamics", "heat-engines", "states-of-matter-basics"],

  seoTitle: "Gases Introduction — Ideal Gas Law Simulation | AP Physics 2",
  seoKeywords: ["ideal gas law", "Boyle's law", "Charles's law", "pressure volume temperature", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Ideal Gas Law, Boyle's Law, Charles's Law" },
};
