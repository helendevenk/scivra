import type { Experiment } from "@/shared/types/experiment";

export const fluidStatics: Experiment = {
  id: "fluid-statics",
  slug: "fluid-statics",
  title: "Fluid Statics & Bernoulli's Principle",
  subtitle: "Buoyancy, pressure, and why planes fly",
  description:
    "Drop objects into fluid and watch buoyancy in action. Then switch to the flow mode and see how constricting a pipe speeds up fluid and drops pressure — Bernoulli's principle visualized. Understand why a curveball curves and a plane wing generates lift.",
  thumbnail: "/imgs/experiments/fluid-statics.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["P5.1"],
    ap: ["3.C.4"],
  },
  primaryStandard: "ap-physics-2",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["buoyancy", "Archimedes", "Bernoulli", "fluid pressure", "Pascal's law", "AP Physics 2"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "objectDensity",
      label: "Object Density (ρ_obj)",
      unit: "kg/m³",
      min: 100,
      max: 3000,
      default: 800,
      step: 50,
      tier: "free",
    },
    {
      id: "fluidDensity",
      label: "Fluid Density (ρ_fluid)",
      unit: "kg/m³",
      min: 500,
      max: 2000,
      default: 1000,
      step: 50,
      tier: "free",
    },
    {
      id: "objectVolume",
      label: "Object Volume (V)",
      unit: "×10⁻³ m³",
      min: 0.1,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "pipeRatio",
      label: "Pipe Constriction Ratio (A₁/A₂)",
      unit: "",
      min: 1,
      max: 5,
      default: 2,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "F_b = \\rho_{fluid} g V_{submerged}",
      description: "Archimedes' buoyancy force",
    },
    {
      latex: "P = P_0 + \\rho g h",
      description: "Hydrostatic pressure",
    },
    {
      latex: "P_1 + \\frac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g h_2",
      description: "Bernoulli's equation (energy conservation)",
    },
    {
      latex: "A_1 v_1 = A_2 v_2",
      description: "Continuity equation (mass conservation)",
    },
  ],

  theory:
    "Archimedes' principle: the buoyant force equals the weight of displaced fluid. An object floats when its average density is less than the fluid. Pascal's law: pressure applied to enclosed fluid transmits equally in all directions (basis of hydraulics). Bernoulli's equation is conservation of energy for flowing fluid: faster flow → lower pressure. A wing generates lift because air moves faster over the curved top surface, creating lower pressure above than below.",

  instructions:
    "In buoyancy mode, adjust object and fluid densities. Watch the object sink, float, or rise. The net force display shows weight vs buoyancy. Switch to Bernoulli mode (Pro) to see how pipe constriction speeds up flow and drops pressure.",

  challenges: [
    {
      id: "fs-c1",
      question: "A wood block (ρ = 600 kg/m³, V = 0.002 m³) is placed in water (ρ = 1000 kg/m³). What fraction is submerged?",
      hint: "At equilibrium: ρ_obj × V_total = ρ_fluid × V_submerged. Fraction = ρ_obj/ρ_fluid",
      tier: "free",
    },
    {
      id: "fs-c2",
      question: "What is the buoyant force on a 0.001 m³ steel ball (ρ = 7800 kg/m³) fully submerged in water?",
      hint: "F_b = ρ_water × g × V_submerged = 1000 × 9.8 × 0.001",
      tier: "free",
    },
    {
      id: "fs-c3",
      question: "Water flows at 2 m/s through a pipe of area 0.04 m². It then enters a constriction of area 0.01 m². What is the speed in the constriction?",
      hint: "Continuity: A₁v₁ = A₂v₂",
      tier: "free",
    },
    {
      id: "fs-c4",
      question: "In the constriction above, if P₁ = 150,000 Pa at the wide section, find P₂. (ρ = 1000 kg/m³, same height)",
      hint: "Bernoulli: P₁ + ½ρv₁² = P₂ + ½ρv₂². Calculate both dynamic pressure terms.",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["newtons-laws"],

  seoTitle: "Fluid Statics & Bernoulli's Principle — Interactive 3D | Scivra",
  seoKeywords: [
    "Archimedes principle simulation",
    "buoyancy interactive",
    "Bernoulli's principle",
    "fluid statics simulation",
    "AP Physics 2 fluids",
    "Pascal's law",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Fluid Statics and Bernoulli's Principle",
  },
};
