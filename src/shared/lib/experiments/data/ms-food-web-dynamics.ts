import type { Experiment } from "@/shared/types/experiment";

export const msFoodWebDynamics: Experiment = {
  id: "ms-food-web-dynamics",
  slug: "ms-food-web-dynamics",
  title: "Food Web Dynamics",
  subtitle: "Explore energy flow and trophic levels in an ecosystem",
  description:
    "Build and manipulate a food web to see how energy flows from producers through consumers. Choose different ecosystems, remove species to trigger trophic cascades, and adjust energy transfer efficiency. Observe how changes at one level ripple through the entire web, affecting populations at every trophic level.",
  thumbnail: "/imgs/experiments/ms-food-web-dynamics.png",

  standards: {
    ngss: ["MS-LS2-3", "MS-LS2-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "biology",
  subject: "biology",
  gradeLevel: "6-8",
  tags: [
    "food web",
    "energy flow",
    "trophic levels",
    "ecosystem",
    "ecology",
    "middle school",
    "6-8",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "ecosystemType",
      label: "Ecosystem (0=Forest, 1=Ocean, 2=Grassland)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "speciesRemoved",
      label: "Remove Species (0=None, 1=Top Predator, 2=Mid Consumer, 3=Producer)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "energyTransfer",
      label: "Energy Transfer Efficiency",
      unit: "%",
      min: 5,
      max: 20,
      default: 10,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "E_{n+1} = E_n \\times \\frac{\\text{efficiency}}{100} \\quad \\text{(energy transfer between levels)}",
      description:
        "Energy available at the next trophic level depends on transfer efficiency (typically ~10%)",
    },
    {
      latex: "\\text{Biomass pyramid: } B_{\\text{producers}} > B_{\\text{primary}} > B_{\\text{secondary}} > B_{\\text{tertiary}}",
      description:
        "Biomass decreases at higher trophic levels because energy is lost as heat at each step",
    },
  ],

  theory:
    "A food web shows all the feeding relationships in an ecosystem — who eats whom. Energy enters the web through producers (plants, algae) that capture sunlight via photosynthesis. Primary consumers (herbivores) eat producers, secondary consumers eat herbivores, and tertiary consumers (top predators) eat other consumers. At each step, roughly 90% of energy is lost as heat through cellular respiration, leaving only about 10% for the next level. This is the 10% rule, and it explains why ecosystems have many more plants than herbivores, and far more herbivores than top predators. When a species is removed, the effects cascade through the web. Removing wolves from Yellowstone caused elk populations to explode, which overgrazed riverside vegetation, which eroded stream banks — a trophic cascade. Food webs with more connections (higher biodiversity) are more resilient because organisms have alternative food sources.",

  instructions:
    "Select an ecosystem to explore its food web. Watch energy flow from the sun through producers to top predators — the width of each arrow shows how much energy transfers. Use the species removal slider to see what happens when you take out a top predator, mid-level consumer, or producer. Adjust energy transfer efficiency to see how it changes the biomass pyramid.",

  challenges: [
    {
      id: "fwd-c1",
      question:
        "If a grassland receives 10,000 kJ of sunlight energy, and plants capture 1% of it, how much energy is available to herbivores? To secondary consumers?",
      hint: "Plants capture 1% of 10,000 kJ = 100 kJ. With 10% transfer efficiency, herbivores get 100 × 0.10 = 10 kJ. Secondary consumers get 10 × 0.10 = 1 kJ. This dramatic drop explains why top predators need huge territories — there simply is not much energy left for them.",
      tier: "free",
    },
    {
      id: "fwd-c2",
      question:
        "A forest ecosystem has hawks, snakes, mice, grasshoppers, and grass. Draw the food chain. If grasshoppers are wiped out by disease, what happens to the rest?",
      hint: "Chain: grass → grasshoppers → mice → snakes → hawks. Without grasshoppers, mice lose a competitor for grass — mice population may increase. More mice means more food for snakes, so snake population may rise. But it depends on whether mice also eat grasshoppers. In a web (not just a chain), effects are more complex because species have multiple food sources.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["population-dynamics", "ecological-succession"],

  htmlPath: "/experiments/middle/ms-food-web-dynamics.html",

  seoTitle: "Food Web Dynamics: Energy Flow & Trophic Levels | Scivra Middle School Biology",
  seoKeywords: [
    "food web dynamics simulation middle school",
    "energy flow trophic levels interactive",
    "ecosystem food web 6-8 biology",
    "trophic cascade simulation",
    "NGSS MS-LS2-3 MS-LS2-4 ecology",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Food Web Dynamics and Energy Flow in Ecosystems",
  },
};
