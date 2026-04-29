import type { Experiment } from "@/shared/types/experiment";

export const heatEngines: Experiment = {
  id: "heat-engines",
  slug: "heat-engines-carnot-cycle-efficiency",
  title: "Heat Engines & Carnot Cycle",
  subtitle: "Discover the upper efficiency limit set by the second law of thermodynamics",
  description:
    "Run a Carnot or Otto cycle between hot and cold reservoirs and measure real-time efficiency, net work, and heat flows. The animated P-V diagram traces each step of the cycle while energy Sankey diagrams show where every joule goes. Explore why no real engine can exceed Carnot efficiency and how reservoir temperatures determine the thermodynamic ceiling.",
  thumbnail: "/imgs/experiments/heat-engines.png",

  standards: {
    ngss: ["HS-PS3-4"],
    gcse: ["P2.4"],
    ap: ["TUL-3.A", "TUL-3.B", "TUL-3.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "thermodynamics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["heat engine", "Carnot cycle", "thermodynamics", "efficiency", "second law", "entropy", "AP Physics 2", "Otto cycle"],
  difficulty: "advanced",

  parameters: [
    {
      id: "T_hot",
      label: "Hot Reservoir Temperature",
      unit: "K",
      min: 400,
      max: 1200,
      default: 800,
      step: 10,
      tier: "pro",
    },
    {
      id: "T_cold",
      label: "Cold Reservoir Temperature",
      unit: "K",
      min: 200,
      max: 400,
      default: 300,
      step: 10,
      tier: "pro",
    },
    {
      id: "cycle_type",
      label: "Cycle Type (0=Carnot, 1=Otto)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "max",
    },
    {
      id: "Q_hot",
      label: "Heat Input",
      unit: "J",
      min: 100,
      max: 10000,
      default: 1000,
      step: 100,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "e = \\frac{W_{net}}{Q_H} = 1 - \\frac{Q_C}{Q_H}",
      description: "Thermal efficiency: fraction of heat input converted to work",
    },
    {
      latex: "e_{Carnot} = 1 - \\frac{T_C}{T_H}",
      description: "Carnot efficiency: maximum possible for given reservoir temperatures",
    },
    {
      latex: "W_{net} = Q_H - Q_C",
      description: "Net work equals heat absorbed minus heat rejected",
    },
    {
      latex: "\\text{COP} = \\frac{Q_C}{W}",
      description: "Coefficient of performance for a refrigerator",
    },
  ],

  theory:
    "The second law of thermodynamics places an absolute upper bound on engine efficiency: no heat engine operating between two reservoirs at T_H and T_C can be more efficient than a Carnot engine operating between the same reservoirs. The Carnot cycle consists of two reversible isothermal processes (heat exchange with reservoirs) and two reversible adiabatic processes (no heat exchange). Because all steps are reversible, no entropy is generated — this is the theoretical ideal. Real engines (Otto, Diesel, Rankine) suffer irreversibilities: friction, turbulence, finite temperature differences during heat transfer, and non-quasi-static compression. These generate entropy, increasing Q_C and reducing net work. The gap between actual and Carnot efficiency is a direct measure of irreversibility. Importantly, the Carnot efficiency depends only on the reservoir temperatures — higher T_H or lower T_C always improves it.",

  instructions:
    "Set T_hot and T_cold (Pro). The animated P-V diagram shows the cycle running with color-coded steps: isothermal expansion (red), adiabatic expansion (orange), isothermal compression (blue), adiabatic compression (cyan). The efficiency meter shows actual vs. Carnot values. Adjust Q_hot to scale the cycle. Switch to Otto cycle (Max) to compare with the ideal gas engine used in cars — note the efficiency gap. The Sankey diagram on the right shows heat flows at every cycle.",

  challenges: [
    {
      id: "he-c1",
      question: "A Carnot engine operates with T_H = 800 K and T_C = 400 K. What is its efficiency?",
      hint: "e_Carnot = 1 − T_C/T_H. Substitute values.",
      tier: "pro",
    },
    {
      id: "he-c2",
      question: "Why is the actual efficiency of a gasoline engine always less than the Carnot efficiency for the same temperature range?",
      hint: "Consider friction, heat loss through cylinder walls, and non-quasi-static compression. What do these have in common thermodynamically?",
      tier: "pro",
    },
    {
      id: "he-c3",
      question: "If the cold reservoir temperature is lowered from 300 K to 200 K while T_H stays at 800 K, how does efficiency change?",
      hint: "Calculate e_Carnot for both T_C values and compare. What is the trend?",
      tier: "max",
    },
  ],

  wave: 7,
  tier: "max",
  estimatedTime: 35,
  relatedExperiments: ["fluid-statics", "simple-harmonic-motion"],

  seoTitle: "Heat Engines & Carnot Cycle — Thermodynamics Efficiency Lab | Scivra",
  seoKeywords: [
    "heat engine simulation",
    "Carnot cycle",
    "thermodynamics efficiency",
    "second law of thermodynamics",
    "AP Physics 2 thermodynamics",
    "Otto cycle",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Heat Engines and Carnot Efficiency",
  },
};
