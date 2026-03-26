import type { Experiment } from "@/shared/types/experiment";

export const balancingChemicalEquations: Experiment = {
  id: "balancing-chemical-equations",
  slug: "balancing-chemical-equations",
  title: "Balancing Chemical Equations",
  subtitle: "Conservation of mass through coefficient adjustment",
  description:
    "Master the art of balancing chemical equations by adjusting coefficients to satisfy conservation of mass. Drag coefficients onto reactants and products, watch real-time atom counts update, and verify that every element balances. Progress through increasingly complex reactions from synthesis to redox.",
  thumbnail: "/imgs/experiments/balancing-chemical-equations.png",

  standards: {
    ngss: ["HS-PS1-7"],
    gcse: ["C4.1", "C4.2"],
    ap: ["4.A.1", "4.B.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: [
    "balancing equations",
    "stoichiometry",
    "conservation of mass",
    "coefficients",
    "AP Chemistry",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "reactionIndex",
      label: "Reaction",
      unit: "",
      min: 0,
      max: 7,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "showHints",
      label: "Show Hints (0=Off, 1=On)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex:
        "\\text{Reactants (atoms)} = \\text{Products (atoms)} \\quad \\text{(Conservation of Mass)}",
      description:
        "In a balanced equation, the number of atoms of each element is equal on both sides",
    },
    {
      latex:
        "a\\,\\text{A} + b\\,\\text{B} \\rightarrow c\\,\\text{C} + d\\,\\text{D}",
      description:
        "Coefficients a, b, c, d are the smallest whole numbers that balance all elements",
    },
  ],

  theory:
    "Chemical equations represent reactions where atoms rearrange but are never created or destroyed (Law of Conservation of Mass, Lavoisier 1789). Balancing means finding the smallest set of integer coefficients so that every element has equal atom counts on both sides. Strategy: balance metals first, then nonmetals, then hydrogen, and oxygen last. For combustion reactions, balance C first, then H, then O. Redox reactions may require half-reaction balancing. A balanced equation is the foundation of stoichiometry — it tells you the mole ratios needed for quantitative calculations.",

  instructions:
    "Select a reaction from the dropdown. Use the + and − buttons (or click the coefficient) to adjust each coefficient. The atom inventory panel shows real-time counts for each element on both sides. When all elements match, the equation turns green and you earn a ✓. Try all 8 reactions, from simple synthesis to combustion and redox.",

  challenges: [
    {
      id: "bce-c1",
      question: "Balance: H₂ + O₂ → H₂O",
      hint: "2 H₂ + O₂ → 2 H₂O. Left: 4H, 2O. Right: 4H, 2O. ✓",
      tier: "free",
    },
    {
      id: "bce-c2",
      question: "Balance: Fe + O₂ → Fe₂O₃",
      hint: "4 Fe + 3 O₂ → 2 Fe₂O₃. Left: 4Fe, 6O. Right: 4Fe, 6O. ✓",
      tier: "free",
    },
    {
      id: "bce-c3",
      question: "Balance: C₃H₈ + O₂ → CO₂ + H₂O (combustion of propane)",
      hint: "C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O. Left: 3C, 8H, 10O. Right: 3C, 8H, 10O. ✓",
      tier: "free",
    },
    {
      id: "bce-c4",
      question:
        "Balance: KMnO₄ + HCl → KCl + MnCl₂ + H₂O + Cl₂ (redox reaction)",
      hint: "2 KMnO₄ + 16 HCl → 2 KCl + 2 MnCl₂ + 8 H₂O + 5 Cl₂. This is an oxidation-reduction reaction requiring careful electron balance.",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["stoichiometry", "reaction-kinetics"],
  htmlPath: "/experiments/ap-chemistry/balancing-chemical-equations.html",

  seoTitle:
    "Balancing Chemical Equations Interactive Simulator | Scivra AP Chemistry",
  seoKeywords: [
    "balancing chemical equations",
    "chemical equation balancer",
    "conservation of mass simulation",
    "stoichiometry practice",
    "AP Chemistry equations",
    "balance reactions interactive",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Balancing Chemical Equations",
  },
};
