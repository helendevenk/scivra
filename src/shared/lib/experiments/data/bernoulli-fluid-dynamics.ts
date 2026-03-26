import type { Experiment } from "@/shared/types/experiment";

export const bernoulliFluidDynamics: Experiment = {
  id: "bernoulli-fluid-dynamics",
  slug: "bernoulli-equation-venturi-airfoil",
  title: "Bernoulli's Principle & Fluid Flow",
  subtitle: "Discover why faster flow means lower pressure — from Venturi tubes to airplane wings",
  description:
    "Control fluid velocity and pipe geometry in a Venturi tube simulation. Watch the continuity equation force speed increases at constrictions and observe the pressure drop that follows from Bernoulli's equation, connecting directly to how airfoils generate lift.",
  thumbnail: "/imgs/experiments/bernoulli-fluid-dynamics.png",

  standards: {
    ngss: ["HS-PS2-1", "HS-ETS1-2"],
    gcse: ["P5.5", "P5.6"],
    ap: ["FLD-1.A", "FLD-1.B", "FLD-1.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "Bernoulli's principle",
    "fluid dynamics",
    "Venturi effect",
    "continuity equation",
    "pressure",
    "lift",
    "airfoil",
    "flow velocity",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "flow_velocity",
      label: "Inlet Velocity",
      unit: "m/s",
      min: 1,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "pipe_ratio",
      label: "Area Ratio A₁/A₂ (wide:narrow)",
      unit: "",
      min: 1,
      max: 4,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "fluid_density",
      label: "Fluid Density",
      unit: "kg/m³",
      min: 800,
      max: 1200,
      default: 1000,
      step: 50,
      tier: "pro",
    },
    {
      id: "height_difference",
      label: "Height Difference",
      unit: "m",
      min: 0,
      max: 5,
      default: 0,
      step: 0.5,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{const}",
      description: "Bernoulli's Equation",
    },
    {
      latex: "A_1 v_1 = A_2 v_2",
      description: "Continuity Equation (incompressible flow)",
    },
    {
      latex: "\\Delta P = \\frac{1}{2}\\rho(v_2^2 - v_1^2)",
      description: "Pressure difference from velocity change",
    },
  ],

  theory:
    "Bernoulli's equation is an energy conservation statement for steady, incompressible flow: the sum of static pressure, dynamic pressure (½ρv²), and hydrostatic pressure (ρgh) remains constant along a streamline. The continuity equation A₁v₁ = A₂v₂ forces fluid to accelerate through a constriction, which Bernoulli's equation then links to a corresponding pressure drop. Airfoil lift arises because the curved upper surface accelerates flow, lowering pressure above the wing.",
  instructions:
    "Increase the inlet velocity and area ratio to see the pressure difference build in the Venturi section. The color gradient along the pipe shows high (blue) to low (red) pressure regions. Unlock Pro mode to change fluid density and add a height difference between inlet and outlet.",

  challenges: [
    {
      id: "bfd-c1",
      question: "The pipe cross-section is halved at a constriction. How does velocity change? What happens to pressure?",
      hint: "Apply continuity A₁v₁ = A₂v₂ first, then Bernoulli",
      tier: "free",
    },
    {
      id: "bfd-c2",
      question: "Using Bernoulli's principle, explain why an airplane wing generates lift.",
      hint: "Consider the upper versus lower surface curvature and resulting flow speeds",
      tier: "free",
    },
    {
      id: "bfd-c3",
      question:
        "Inlet A₁ = 0.1 m² with v₁ = 2 m/s, outlet A₂ = 0.05 m². What is the outlet velocity and pressure change (ρ = 1000 kg/m³)?",
      hint: "Use continuity for velocity, then ΔP = ½ρ(v₂² − v₁²)",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["fluid-statics", "newtons-laws", "circular-motion"],

  seoTitle: "Bernoulli's Principle & Fluid Dynamics — Venturi & Airfoil Simulation | NeonPhysics",
  seoKeywords: [
    "Bernoulli's principle",
    "fluid dynamics",
    "Venturi effect",
    "continuity equation",
    "airfoil lift",
    "pressure and velocity",
    "AP Physics fluids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Bernoulli's Principle and Fluid Flow Dynamics",
  },
};
