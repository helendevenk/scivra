import type { Experiment } from "@/shared/types/experiment";

export const k5MixturesSolutions: Experiment = {
  id: "k5-mixtures-solutions",
  slug: "k5-mixtures-solutions",
  title: "Mixtures & Solutions",
  subtitle: "Separate mixtures and dissolve solutes to explore solubility",
  description:
    "Explore the world of mixtures and solutions! Choose different substances and water temperatures to see what dissolves and what doesn't. Learn to tell mixtures apart from solutions by filtering, evaporating, and observing. Discover why hot water dissolves sugar faster than cold water.",
  thumbnail: "/imgs/experiments/k5-mixtures-solutions.png",

  standards: {
    ngss: ["5-PS1-3"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "3-5",
  tags: ["mixtures", "solutions", "solubility", "dissolving", "K5 science"],
  difficulty: "beginner",

  parameters: [
    { id: "substanceType", label: "Substance (0=Salt 1=Sugar 2=Sand 3=Baking Soda)", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
    { id: "waterTemp", label: "Water Temperature (°C)", unit: "°C", min: 10, max: 80, default: 25, step: 5, tier: "free" },
  ],

  formulas: [
    { latex: "\\text{Solubility} \\propto \\text{Temperature}", description: "Most solid substances dissolve more easily in warmer water" },
  ],

  theory: "A mixture is made of two or more substances combined together, but each substance keeps its own properties. A solution is a special mixture where one substance (the solute) dissolves completely in another (the solvent) so you cannot see the separate parts. Salt water is a solution — the salt disappears into the water. Sand in water is a mixture — you can still see the grains. Temperature affects solubility: warmer water usually dissolves more solute because the water molecules move faster and break apart the solute more quickly.",

  instructions: "Pick a substance and set the water temperature, then press Mix! Watch whether the substance dissolves to form a clear solution or stays visible as a mixture. Try filtering or evaporating to recover the substance. Compare results at different temperatures to discover the solubility pattern.",

  challenges: [
    { id: "k5ms-c1", question: "Which substance does NOT dissolve in water?", hint: "Sand stays at the bottom — it is insoluble. You can separate it by filtering.", tier: "free" },
    { id: "k5ms-c2", question: "Does sugar dissolve faster in hot or cold water?", hint: "Hot water! Higher temperature makes water molecules move faster, breaking sugar apart more quickly.", tier: "free" },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-chemical-changes", "k5-states-of-matter"],
  htmlPath: "/experiments/elementary/k5-mixtures-solutions.html",

  seoTitle: "Mixtures & Solutions for Kids | Scivra Elementary Science",
  seoKeywords: ["mixtures and solutions for kids", "solubility experiment elementary", "dissolving substances K5", "K5 science experiment"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Elementary School", teaches: "Mixtures, Solutions, and Solubility" },
};
