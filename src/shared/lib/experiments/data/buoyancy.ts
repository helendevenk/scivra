import type { Experiment } from "@/shared/types/experiment";

export const buoyancy: Experiment = {
  id: "buoyancy",
  slug: "buoyancy-archimedes-principle",
  title: "Buoyancy",
  subtitle: "Explore Archimedes' Principle with different fluids",
  description:
    "Submerge objects in water, oil, and gasoline. Measure buoyant force, observe floating vs. sinking, and verify Archimedes' Principle by relating displaced fluid volume to upward force.",
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
  tags: ["buoyancy", "Archimedes principle", "fluid", "density", "displaced volume", "floating"],
  difficulty: "intermediate",

  parameters: [
    { id: "fluid_density", label: "Fluid Density", unit: "kg/m³", min: 500, max: 13600, default: 1000, step: 10, tier: "free" },
    { id: "object_density", label: "Object Density", unit: "kg/m³", min: 100, max: 20000, default: 500, step: 10, tier: "free" },
    { id: "object_volume", label: "Object Volume", unit: "L", min: 0.1, max: 10, default: 1, step: 0.1, tier: "free" },
    { id: "submerged_fraction", label: "Submerged Fraction", unit: "%", min: 0, max: 100, default: 100, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "F_b = \\rho_{fluid} \\cdot V_{displaced} \\cdot g", description: "Buoyant force (Archimedes)" },
    { latex: "\\text{Float if } \\rho_{object} < \\rho_{fluid}", description: "Floating condition" },
    { latex: "\\text{Apparent weight} = W - F_b", description: "Apparent weight in fluid" },
  ],

  theory:
    "Archimedes' Principle states that a submerged object experiences an upward buoyant force equal to the weight of the fluid it displaces. An object floats when its density is less than the fluid density. The principle explains why ships float despite being made of dense steel — their hollow shape displaces enough water to create sufficient buoyancy.",
  instructions:
    "Adjust fluid and object densities. Objects denser than the fluid sink; less dense objects float. The force diagram shows weight vs. buoyant force. Change the submerged fraction to see how buoyancy changes with partial submersion.",
  challenges: [
    { id: "bu-c1", question: "A 2L object with density 800 kg/m³ in water — does it float? What fraction is submerged?", hint: "800 < 1000, so it floats. Fraction = ρ_obj/ρ_fluid = 0.8 = 80%", tier: "free" },
    { id: "bu-c2", question: "What is the buoyant force on a fully submerged 0.5m³ object in water?", hint: "F_b = 1000 × 0.5 × 9.8 = 4900 N", tier: "free" },
    { id: "bu-c3", question: "A steel ship has mass 10,000 kg. What minimum hull volume is needed to float in seawater (1025 kg/m³)?", hint: "V_displaced = m/ρ_fluid = 10000/1025", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["buoyancy-basics", "fluid-statics", "pressure-lab"],

  seoTitle: "Buoyancy — Archimedes Principle Simulation | AP Physics 1",
  seoKeywords: ["buoyancy", "Archimedes principle", "floating sinking", "fluid density", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Buoyancy, Archimedes Principle" },
};
