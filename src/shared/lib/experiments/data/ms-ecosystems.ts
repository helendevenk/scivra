import type { Experiment } from "@/shared/types/experiment";

export const msEcosystems: Experiment = {
  id: "ms-ecosystems",
  slug: "ms-ecosystems",
  title: "Ecosystems & Food Webs",
  subtitle: "Energy flow, matter cycling, and ecosystem balance",
  description:
    "Build a complex food web with multiple producers, herbivores, and carnivores. Watch population dynamics evolve over time with predator-prey cycles. Model the effects of removing a species, introducing an invasive species, or changing climate. Track carbon and nitrogen cycles.",
  thumbnail: "/imgs/experiments/ms-ecosystems.png",

  standards: {
    ngss: ["MS-LS2-1", "MS-LS2-3", "MS-LS2-4"],
    gcse: ["B3.1", "B3.2"],
    ap: [],
  },
  category: "biology",
  subject: "biology",
  gradeLevel: "6-8",
  tags: ["ecosystems", "food web", "population dynamics", "predator prey", "carbon cycle", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "producerPop",
      label: "Plant Population",
      unit: "",
      min: 50,
      max: 500,
      default: 200,
      step: 10,
      tier: "free",
    },
    {
      id: "herbivorePop",
      label: "Herbivore Population (Rabbits)",
      unit: "",
      min: 5,
      max: 100,
      default: 30,
      step: 5,
      tier: "free",
    },
    {
      id: "carnivorePop",
      label: "Carnivore Population (Foxes)",
      unit: "",
      min: 1,
      max: 30,
      default: 8,
      step: 1,
      tier: "free",
    },
    {
      id: "invasiveSpecies",
      label: "Add Invasive Species (0=No, 1=Yes)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\frac{dN}{dt} = rN\\left(1-\\frac{N}{K}\\right) \\quad (\\text{logistic growth})",
      description: "Population growth limited by carrying capacity K",
    },
    {
      latex: "\\text{10\\% rule: energy}_{n+1} = 0.1 \\times \\text{energy}_n",
      description: "Only 10% of energy passes to the next trophic level",
    },
  ],

  theory:
    "An ecosystem is a community of organisms interacting with each other and their physical environment. Food webs describe who eats whom, showing the flow of energy and matter. Energy flows one-way through a food web (sun → plants → herbivores → carnivores), with 90% lost as heat at each level. Matter cycles continuously: carbon (photosynthesis, respiration, decomposition), nitrogen (fixation, nitrification, denitrification), water (evaporation, precipitation). Populations in ecosystems are interdependent: removing predators causes herbivore populations to explode (trophic cascade). The Lotka-Volterra equations describe predator-prey cycles: when prey are plentiful, predators increase; then prey decline; then predators decline, letting prey recover. Biodiversity increases ecosystem stability — more species means more alternative pathways if one disappears.",

  instructions:
    "Set initial populations and press Play. Watch population graphs evolve — observe the classic predator-prey oscillations. Try removing foxes (carnivores) — what happens to rabbits? Then to plants? Add an invasive species (Pro) to see how it disrupts the food web. Track the carbon cycle overlay to see how carbon moves between organisms.",

  challenges: [
    {
      id: "eco-ms-c1",
      question: "In a food web: grass → grasshoppers → frogs → snakes → hawks. If frogs are removed, what likely happens to grasshoppers? To snakes?",
      hint: "Without frogs, grasshoppers (prey) have no predator → population explodes. Snakes lose a food source → snake population decreases. This is a trophic cascade — removing one species ripples through the web.",
      tier: "free",
    },
    {
      id: "eco-ms-c2",
      question: "Why is it impossible for an ecosystem to have more carnivores than herbivores?",
      hint: "Energy decreases at each trophic level (10% rule). There's not enough energy to support more carnivores than herbivores. Carnivores need many prey animals to get enough energy — a fox needs to eat many rabbits per month.",
      tier: "free",
    },
    {
      id: "eco-ms-c3",
      question: "How does deforestation affect the carbon cycle?",
      hint: "Trees store carbon in their wood (carbon sink). Cutting them down releases stored CO₂ (combustion or decomposition). Fewer trees also means less photosynthesis to remove atmospheric CO₂. Both effects increase atmospheric CO₂, contributing to climate change.",
      tier: "free",
    },
    {
      id: "eco-ms-c4",
      question: "Explain the Lotka-Volterra predator-prey cycle. Why do populations oscillate rather than reach a steady state?",
      hint: "When prey (rabbits) are abundant, predators (foxes) thrive and increase. More foxes eat more rabbits → rabbit population falls. Fewer rabbits → foxes starve and decline. Fewer foxes → rabbit population recovers. This creates cycles. A true steady state requires perfect balance, which is unstable to small disturbances.",
      tier: "pro",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["k5-food-chain", "natural-selection", "ms-photosynthesis-respiration"],

  seoTitle: "Ecosystems Food Web Middle School | NeonPhysics Biology Simulation",
  seoKeywords: [
    "ecosystems food web middle school simulation",
    "predator prey population dynamics 6-8",
    "trophic levels interactive simulation",
    "carbon cycle middle school",
    "biodiversity ecosystem interactive",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Ecosystems and Food Webs",
  },
};
