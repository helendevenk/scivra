import type { Experiment } from "@/shared/types/experiment";

export const k5FoodChain: Experiment = {
  id: "k5-food-chain",
  slug: "k5-food-chain",
  title: "Food Chains & Ecosystems",
  subtitle: "Producers, consumers, decomposers — energy flows through life",
  description:
    "Build a food chain and watch energy flow from sun → plants → herbivores → carnivores. Remove a species and see how the ecosystem changes. Learn why there are always more producers than consumers, and discover the role of decomposers in recycling nutrients.",
  thumbnail: "/imgs/experiments/k5-food-chain.png",

  standards: {
    ngss: ["5-LS2-1", "MS-LS2-3"],
    gcse: [],
    ap: [],
  },
  category: "biology",
  subject: "biology",
  gradeLevel: "3-5",
  tags: ["food chain", "ecosystem", "producer", "consumer", "decomposer", "energy flow", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "producerPop",
      label: "Plant Population",
      unit: "",
      min: 10,
      max: 200,
      default: 100,
      step: 10,
      tier: "free",
    },
    {
      id: "herbivoreRatio",
      label: "Herbivore Density",
      unit: "",
      min: 0.05,
      max: 0.5,
      default: 0.2,
      step: 0.05,
      tier: "free",
    },
    {
      id: "carnivoreRatio",
      label: "Carnivore Density",
      unit: "",
      min: 0.01,
      max: 0.2,
      default: 0.05,
      step: 0.01,
      tier: "free",
    },
    {
      id: "sunlight",
      label: "Sunlight Intensity",
      unit: "%",
      min: 10,
      max: 100,
      default: 80,
      step: 10,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\text{Energy transfer} \\approx 10\\% \\text{ per trophic level}",
      description: "Only ~10% of energy passes to the next level — rest is lost as heat",
    },
    {
      latex: "\\text{Producers} \\gg \\text{Herbivores} \\gg \\text{Carnivores}",
      description: "Energy pyramid: each level has far fewer organisms than below",
    },
  ],

  theory:
    "A food chain shows how energy flows from one organism to another through eating. Producers (plants) capture energy from sunlight through photosynthesis. Primary consumers (herbivores) eat plants. Secondary consumers (carnivores) eat herbivores. Decomposers (bacteria, fungi) break down dead organisms and return nutrients to the soil. At each step, about 90% of energy is lost as heat — only 10% passes to the next level. This is why there are always far more plants than rabbits, and more rabbits than foxes. Removing any link from the chain disrupts the whole ecosystem.",

  instructions:
    "Adjust the population sliders and watch the ecosystem animation. Try removing the carnivores — herbivore populations explode! Then plants get eaten faster. Try reducing sunlight — plant populations shrink, and the whole chain collapses. Click organisms to see their energy relationships.",

  challenges: [
    {
      id: "fc-c1",
      question: "A food chain: grass → rabbit → fox. If grass gets 1000 J of solar energy, how much energy reaches the fox?",
      hint: "10% rule: Grass absorbs 1000 J → rabbit gets 10% = 100 J → fox gets 10% of that = 10 J.",
      tier: "free",
    },
    {
      id: "fc-c2",
      question: "What would happen if all the foxes in an ecosystem disappeared?",
      hint: "Without foxes (predators), rabbit populations would grow unchecked. Too many rabbits would overeat plants, causing plant populations to crash. Then rabbits would starve — a population crash follows.",
      tier: "free",
    },
    {
      id: "fc-c3",
      question: "Why are decomposers important? What would happen without them?",
      hint: "Decomposers recycle nutrients by breaking down dead organisms. Without them, dead matter would pile up, nutrients would be locked away, and plants couldn't grow — the whole ecosystem would collapse.",
      tier: "free",
    },
    {
      id: "fc-c4",
      question: "Why is it more energy-efficient for humans to eat plants than to eat animals that ate plants?",
      hint: "Eating plants directly gets you 10% of the sun's energy captured by plants. Eating cattle (who ate plants) gets you 10% of 10% = 1% of original solar energy. A plant-based diet requires ~10× less land and energy resources.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 12,
  relatedExperiments: ["k5-water-cycle", "natural-selection", "photosynthesis"],

  seoTitle: "Food Chain Ecosystem Simulation for Kids | NeonPhysics Elementary",
  seoKeywords: [
    "food chain kids simulation",
    "ecosystem interactive elementary",
    "producer consumer decomposer",
    "energy pyramid simulation",
    "K-5 biology food web",
    "trophic levels kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Food Chains and Ecosystems",
  },
};
