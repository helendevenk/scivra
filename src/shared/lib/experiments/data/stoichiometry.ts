import type { Experiment } from "@/shared/types/experiment";

export const stoichiometry: Experiment = {
  id: "stoichiometry",
  slug: "stoichiometry",
  title: "Stoichiometry",
  subtitle: "Mole ratios, limiting reagents, and theoretical yield",
  description:
    "Visualize chemical reactions at the molecular level. Adjust reactant quantities, identify the limiting reagent, calculate theoretical yield, and observe leftover excess reactants. Real-time atom counting ensures conservation of mass.",
  thumbnail: "/imgs/experiments/stoichiometry.png",

  standards: {
    ngss: ["HS-PS1-7"],
    gcse: [],
    ap: ["4.A.1", "4.A.2"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: [
    "stoichiometry",
    "limiting reagent",
    "mole ratio",
    "theoretical yield",
    "conservation of mass",
    "AP Chemistry",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "molesA",
      label: "Moles of Reactant A",
      unit: "mol",
      min: 0,
      max: 10,
      default: 2,
      step: 0.1,
      tier: "free",
    },
    {
      id: "molesB",
      label: "Moles of Reactant B",
      unit: "mol",
      min: 0,
      max: 10,
      default: 3,
      step: 0.1,
      tier: "free",
    },
    {
      id: "reaction",
      label: "Reaction (0=synthesis, 1=decomposition, 2=combustion)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\text{moles of product} = \\text{moles of limiting reagent} \\times \\frac{\\text{product coeff.}}{\\text{limiting reagent coeff.}}",
      description:
        "Theoretical yield is determined by the limiting reagent and the mole ratio from the balanced equation",
    },
    {
      latex: "\\% \\text{ yield} = \\frac{\\text{actual yield}}{\\text{theoretical yield}} \\times 100\\%",
      description:
        "Percent yield compares actual product obtained to the theoretical maximum",
    },
  ],

  theory:
    "Stoichiometry uses the coefficients of a balanced chemical equation to relate amounts of reactants and products. The mole ratio (coefficient ratio) converts between moles of different substances. The limiting reagent is the reactant that runs out first, determining the maximum product (theoretical yield). The excess reagent has leftover moles after the reaction completes. For a reaction aA + bB → cC: if (moles A)/a < (moles B)/b, then A is limiting. Theoretical moles of C = (moles of limiting reagent) × (c/a or c/b). Conservation of mass requires that total atoms of each element are equal on both sides.",

  instructions:
    "Choose a reaction type and adjust the moles of each reactant. The simulation displays molecules as colored circles — watch them combine and identify which reactant runs out first (the limiting reagent). The data panel shows mole ratios, theoretical yield, and leftover excess in real time.",

  challenges: [
    {
      id: "st-c1",
      question: "For 2H₂ + O₂ → 2H₂O, with 3 mol H₂ and 2 mol O₂, which is limiting?",
      hint: "H₂: 3/2 = 1.5, O₂: 2/1 = 2. H₂ has the smaller ratio → H₂ is limiting.",
      tier: "free",
    },
    {
      id: "st-c2",
      question: "For N₂ + 3H₂ → 2NH₃, starting with 1 mol N₂ and 4 mol H₂, how many moles of NH₃ form?",
      hint: "N₂: 1/1=1, H₂: 4/3=1.33 → N₂ is limiting. NH₃ = 1 × (2/1) = 2 mol.",
      tier: "free",
    },
    {
      id: "st-c3",
      question: "If theoretical yield is 5.0 g but you obtain 3.8 g, what is the percent yield?",
      hint: "% yield = (3.8/5.0) × 100% = 76%",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["balancing-chemical-equations", "solutions-dilutions"],
  htmlPath: "/experiments/ap-chemistry/stoichiometry.html",

  seoTitle: "Stoichiometry Interactive Simulator | Scivra AP Chemistry",
  seoKeywords: [
    "stoichiometry simulation",
    "limiting reagent calculator",
    "mole ratio interactive",
    "theoretical yield virtual lab",
    "AP Chemistry stoichiometry",
    "chemical equation balancer",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Stoichiometry and Limiting Reagents",
  },
};
