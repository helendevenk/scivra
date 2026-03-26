import type { Experiment } from "@/shared/types/experiment";

export const pressureLab: Experiment = {
  id: "pressure-lab",
  slug: "pressure-lab-fluid-pressure",
  title: "Pressure Lab",
  subtitle: "Explore atmospheric and fluid pressure",
  description:
    "Measure pressure at different depths in liquids, compare fluid densities, and observe how atmospheric pressure varies with altitude. Verify Pascal's Principle and Bernoulli's Equation.",
  thumbnail: "/imgs/experiments/fluid-statics.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P5.5"],
    ap: ["3.C.4", "3.C.5"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["pressure", "fluid pressure", "Pascal's principle", "atmospheric pressure", "depth", "gauge pressure"],
  difficulty: "intermediate",

  parameters: [
    { id: "fluid_density", label: "Fluid Density", unit: "kg/m³", min: 500, max: 13600, default: 1000, step: 50, tier: "free" },
    { id: "depth", label: "Probe Depth", unit: "m", min: 0, max: 20, default: 5, step: 0.1, tier: "free" },
    { id: "atm_pressure", label: "Atmospheric Pressure", unit: "atm", min: 0, max: 2, default: 1, step: 0.01, tier: "free" },
    { id: "area", label: "Piston Area", unit: "cm²", min: 1, max: 100, default: 10, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "P = P_0 + \\rho g h", description: "Fluid pressure at depth h" },
    { latex: "P_1 A_1 = P_2 A_2", description: "Pascal's Principle (hydraulic lever)" },
    { latex: "P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{const}", description: "Bernoulli's Equation" },
  ],

  theory:
    "Pressure in a fluid increases with depth: P = P₀ + ρgh. Pascal's Principle states that pressure applied to a confined fluid transmits undiminished in all directions — the basis for hydraulic systems. Atmospheric pressure at sea level is ~101.3 kPa, decreasing with altitude. Bernoulli's Equation shows the trade-off between pressure, kinetic energy, and height in flowing fluids.",
  instructions:
    "Drag the pressure gauge to different depths to measure absolute and gauge pressure. Use the hydraulic press to demonstrate Pascal's Principle — apply small force on small piston, observe large force on large piston. Check the atmosphere panel to see pressure vs. altitude.",
  challenges: [
    { id: "prl-c1", question: "What is the gauge pressure at 10m depth in water (ρ=1000 kg/m³)?", hint: "P_gauge = ρgh = 1000 × 9.8 × 10 = 98,000 Pa ≈ 0.97 atm", tier: "free" },
    { id: "prl-c2", question: "A hydraulic press has A₁=5cm² and A₂=500cm². If F₁=100N, what is F₂?", hint: "Pascal: P = F₁/A₁ = F₂/A₂ → F₂ = F₁×(A₂/A₁) = 100×100 = 10,000N", tier: "free" },
    { id: "prl-c3", question: "Why does water flow faster through a narrow pipe than a wide one (same pressure)?", hint: "Bernoulli: if v increases, P decreases; continuity A₁v₁ = A₂v₂ forces higher v in narrow section", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["fluid-statics", "buoyancy", "bernoulli-fluid-dynamics"],

  seoTitle: "Pressure Lab — Fluid Pressure and Pascal's Principle | AP Physics 1",
  seoKeywords: ["pressure lab", "fluid pressure", "Pascal's principle", "Bernoulli equation", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Fluid Pressure, Pascal's Principle, Bernoulli Equation" },
};
