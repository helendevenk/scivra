import type { Experiment } from "@/shared/types/experiment";

export const k5ChemicalChanges: Experiment = {
  id: "k5-chemical-changes",
  slug: "k5-chemical-changes",
  title: "Chemical Changes",
  subtitle: "Observe signs of chemical reactions: color, gas, temperature, and precipitate",
  description:
    "Discover the signs of chemical changes through fun virtual experiments! Mix different substances and watch for color changes, gas bubbles, temperature shifts, and precipitate formation. Learn the difference between physical and chemical changes by comparing results.",
  thumbnail: "/imgs/experiments/k5-chemical-changes.png",

  standards: {
    ngss: ["5-PS1-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "3-5",
  tags: ["chemical changes", "chemical reactions", "color change", "gas bubbles", "K5 science"],
  difficulty: "beginner",

  parameters: [
    { id: "substance1", label: "Substance 1 (0=Vinegar 1=Baking Soda 2=Milk 3=Lemon Juice)", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
    { id: "substance2", label: "Substance 2 (0=Baking Soda 1=Vinegar 2=Food Coloring 3=Copper Penny)", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "\\text{Reactants} \\rightarrow \\text{Products}", description: "In a chemical change, starting substances transform into new substances" },
  ],

  theory: "A chemical change creates new substances with different properties. Signs include: color change, gas production (bubbles), temperature change (hot or cold), precipitate formation, and light/sound emission. Unlike physical changes (cutting, melting, dissolving), chemical changes are usually difficult to reverse. Examples: baking soda + vinegar produces carbon dioxide gas; iron + oxygen produces rust.",

  instructions: "Choose two substances and press Mix! Watch for signs of chemical changes. The indicator panel shows which signs appear. Try different combinations to find which ones are chemical changes and which are just physical mixing.",

  challenges: [
    { id: "k5cc-c1", question: "What happens when you mix vinegar and baking soda?", hint: "Fizzy bubbles appear! The gas is carbon dioxide (CO₂) — this is a chemical change.", tier: "free" },
    { id: "k5cc-c2", question: "Is dissolving sugar in water a chemical or physical change?", hint: "Physical change — the sugar is still sugar, just dissolved. You can get it back by evaporating the water.", tier: "free" },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-states-of-matter", "k5-mixtures-solutions"],
  htmlPath: "/experiments/elementary/k5-chemical-changes.html",

  seoTitle: "Chemical Changes for Kids | Scivra Elementary Science",
  seoKeywords: ["chemical changes for kids", "chemical reactions elementary", "signs of chemical change", "K5 science experiment"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Elementary School", teaches: "Chemical Changes and Reactions" },
};
