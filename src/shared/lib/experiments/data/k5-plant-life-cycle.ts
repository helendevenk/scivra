import type { Experiment } from "@/shared/types/experiment";

export const k5PlantLifeCycle: Experiment = {
  id: "k5-plant-life-cycle",
  slug: "k5-plant-life-cycle",
  title: "Plant Life Cycle",
  subtitle: "From seed to flower: watch plants grow through every stage",
  description:
    "Plant a seed and watch it grow through every stage of its life cycle. Control sunlight and water to see how they affect growth speed. Observe germination as the seed cracks open and a tiny root pushes down into the soil. Watch the stem and leaves reach toward the light, flowers bloom to attract pollinators, and new seeds form to start the cycle again.",
  thumbnail: "/imgs/experiments/k5-plant-life-cycle.png",

  standards: {
    ngss: ["3-LS1-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "biology",
  subject: "biology",
  gradeLevel: "3-5",
  tags: [
    "plant life cycle",
    "germination",
    "seed",
    "flower",
    "photosynthesis",
    "biology",
    "elementary",
    "K-5",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "sunlight",
      label: "Sunlight Level",
      unit: "%",
      min: 0,
      max: 100,
      default: 75,
      step: 5,
      tier: "free",
    },
    {
      id: "waterAmount",
      label: "Water Amount",
      unit: "mL",
      min: 0,
      max: 200,
      default: 100,
      step: 10,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex:
        "\\text{Seed} \\xrightarrow{\\text{water}} \\text{Sprout} \\xrightarrow{\\text{sun}} \\text{Plant} \\xrightarrow{\\text{bloom}} \\text{Flower} \\rightarrow \\text{Seeds}",
      description:
        "The five stages of a flowering plant life cycle: seed, sprout, growing plant, flower, and new seeds",
    },
  ],

  theory:
    "Every flowering plant goes through a life cycle with distinct stages. It begins as a seed, which contains a tiny baby plant (embryo) and a food supply protected by a seed coat. When the seed gets enough water and warmth, it germinates — the seed coat splits open, and a root grows downward while a shoot pushes upward. The young sprout develops leaves that capture sunlight. Through photosynthesis, the plant uses sunlight, water, and carbon dioxide to make its own food (sugar) and grow bigger. Eventually the plant produces flowers, which are the reproductive organs. Pollinators like bees carry pollen between flowers. After pollination, the flower develops fruit containing new seeds, and the cycle starts over.",

  instructions:
    "Set the Sunlight Level and Water Amount to give your plant what it needs to grow. Watch the seed crack open and send out its first root. Observe how the sprout grows taller and develops leaves. See the flower bloom and produce new seeds. Try giving too little or too much water to see what happens.",

  challenges: [
    {
      id: "plc-c1",
      question:
        "What are the main stages of a flowering plant's life cycle in order?",
      hint: "The stages go: 1) Seed — the starting point with a tiny embryo inside. 2) Germination — the seed sprouts a root and shoot. 3) Growth — the plant develops leaves and stems. 4) Flowering — the plant produces flowers. 5) Seed production — flowers make fruit and new seeds.",
      tier: "free",
    },
    {
      id: "plc-c2",
      question:
        "Why do plants need both sunlight and water to grow? What happens if one is missing?",
      hint: "Plants use sunlight and water together in photosynthesis to make sugar (food). Without sunlight, the plant cannot produce energy and will become pale and weak. Without water, the plant cannot transport nutrients or perform photosynthesis, and it will wilt and eventually die.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-animal-adaptations", "ecological-succession"],

  htmlPath: "/experiments/elementary/k5-plant-life-cycle.html",

  seoTitle:
    "Plant Life Cycle Simulation for Kids | Scivra Elementary Biology",
  seoKeywords: [
    "plant life cycle kids simulation",
    "seed germination interactive",
    "flowering plant stages elementary",
    "K-5 biology plant growth",
    "photosynthesis for kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Plant Life Cycle and Growth",
  },
};
