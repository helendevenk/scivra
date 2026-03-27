import type { Experiment } from "@/shared/types/experiment";

export const msChemicalStoichiometry: Experiment = {
  id: "ms-chemical-stoichiometry",
  slug: "ms-chemical-stoichiometry",
  title: "Chemical Stoichiometry",
  subtitle: "Mole ratios, limiting reagents, and reaction yields",
  description:
    "Practice stoichiometry by balancing equations, identifying limiting reagents, and calculating theoretical yields. Drag atom counters to visualize mole ratios, watch excess reagents remain after the reaction completes, and compare theoretical vs actual yield.",
  thumbnail: "/imgs/experiments/ms-chemical-stoichiometry.png",
  standards: { ngss: ["MS-PS1-2", "MS-PS1-5"], gcse: [], ap: [] },
  primaryStandard: "ngss-ms",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "6-8",
  tags: ["stoichiometry", "mole ratio", "limiting reagent", "yield", "middle school chemistry"],
  difficulty: "intermediate",
  parameters: [
    { id: "molesA", label: "Moles of Reactant A", unit: "mol", min: 0.5, max: 10, default: 3, step: 0.5, tier: "free" },
    { id: "molesB", label: "Moles of Reactant B", unit: "mol", min: 0.5, max: 10, default: 5, step: 0.5, tier: "free" },
    { id: "reaction", label: "Reaction (0=synthesis, 1=decomposition, 2=combustion)", unit: "", min: 0, max: 2, default: 0, step: 1, tier: "free" },
  ],
  formulas: [
    { latex: "\\text{Mole ratio} = \\frac{\\text{coefficient A}}{\\text{coefficient B}}", description: "The ratio of moles in a balanced equation determines how much of each reactant is needed" },
    { latex: "\\text{Yield} = \\frac{\\text{actual}}{\\text{theoretical}} \\times 100\\%", description: "Percent yield compares what you actually get to what the balanced equation predicts" },
  ],
  theory: "Stoichiometry uses the coefficients of a balanced chemical equation to calculate the amounts of reactants consumed and products formed. The mole ratio between any two substances equals the ratio of their coefficients. The limiting reagent is completely consumed first, determining the maximum product. Excess reagent remains after the reaction. Theoretical yield is the maximum possible product mass; actual yield is always less due to incomplete reactions or side reactions.",
  instructions: "Set the moles of each reactant and select a reaction type. The visualization shows atom models reacting in the correct ratio. Identify which reagent is limiting, how much product forms, and how much excess remains.",
  challenges: [
    { id: "mcs-c1", question: "In 2H₂ + O₂ → 2H₂O, you have 3 mol H₂ and 2 mol O₂. Which is limiting?", hint: "Need 2 mol H₂ per 1 mol O₂. For 3 mol H₂: need 1.5 mol O₂ (have 2). For 2 mol O₂: need 4 mol H₂ (have 3). H₂ is limiting.", tier: "free" },
    { id: "mcs-c2", question: "How many moles of H₂O form from the above?", hint: "3 mol H₂ × (2 mol H₂O / 2 mol H₂) = 3 mol H₂O", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 15,
  relatedExperiments: ["stoichiometry", "balancing-chemical-equations"],
  htmlPath: "/experiments/middle/ms-chemical-stoichiometry.html",
  seoTitle: "Chemical Stoichiometry Simulation | Scivra Middle School",
  seoKeywords: ["stoichiometry simulation", "limiting reagent calculator", "mole ratio interactive", "middle school chemistry"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Middle School", teaches: "Chemical Stoichiometry" },
};
