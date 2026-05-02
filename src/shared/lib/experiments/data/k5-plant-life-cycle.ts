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
  contentSections: {
    whatIsIt:
      "Every flowering plant goes through a journey called its life cycle. It starts as a tiny seed. Inside the seed is a baby plant and a small food supply, all wrapped up in a tough coat. When the seed gets enough water and warmth, something amazing happens — it cracks open! A tiny root pushes down into the soil to drink water, and a little shoot pushes up toward the light. This is called germination. The sprout grows leaves that catch sunlight. Plants use sunlight, water, and air to make their own food. This is called photosynthesis — the way plants make food from sunlight. When the plant is big enough, it grows flowers. Flowers attract bees and butterflies that carry pollen from one flower to another. After pollination, the flower makes fruit with new seeds inside. Those seeds fall to the ground and the whole cycle starts again. In this simulation, you can control how much sunlight and water your plant gets. See how those two things change how fast your plant grows through each stage.",
    parameterExplanations: {
      sunlight:
        "This slider sets how much sunlight your plant receives, from 0% (complete darkness) to 100% (very bright full sun). Plants need light to make food and grow. At low sunlight levels the plant grows slowly and may look pale. At a good sunlight level — around 75% — the plant grows steadily through all its stages.",
      waterAmount:
        "This slider controls how much water you give the plant, from 0 mL (no water at all) to 200 mL (a generous amount). Plants need water to grow, but too little or too much both cause problems. Try setting water to 0 and watch the plant wilt. Try 100 mL for healthy growth. At very high values you may see signs of overwatering.",
    },
    misconceptions: [
      {
        wrong: "Plants get all their food from the soil.",
        correct:
          "Plants make most of their own food using sunlight, water, and air — not soil. The soil provides helpful nutrients like minerals, but the main food-making process happens in the leaves using sunlight. This is why a plant in bright light but poor soil often does better than a plant in rich soil with no light.",
      },
      {
        wrong: "Seeds need sunlight to sprout.",
        correct:
          "Seeds actually do not need sunlight to start sprouting. They use the food stored inside the seed coat to grow their first root and shoot. What they do need is water and warmth. Once the sprout grows leaves above the soil, then sunlight becomes important for making more food.",
      },
      {
        wrong: "The flower is just for decoration and is not important.",
        correct:
          "Flowers are the reproductive parts of the plant. Their bright colors and sweet smell attract pollinators like bees and butterflies. Pollinators carry pollen between flowers so the plant can make seeds and fruit. Without flowers and pollinators, many plants could not reproduce and there would be far less fruit and food in the world.",
      },
      {
        wrong: "A plant's life cycle ends when its flowers die.",
        correct:
          "When flowers die, that is actually an exciting part of the cycle. The flower turns into a fruit that holds new seeds. Those seeds travel — by wind, animals, or falling — to the ground. Then the whole cycle starts over with germination. The plant life cycle is a circle, not a dead end.",
      },
    ],
    teacherUseCases: [
      "Set sunlight to 75% and waterAmount to 100 mL to grow a healthy plant through all stages. Have students sketch each stage and label it: seed, sprout, growing plant, flower, seeds.",
      "Run two side-by-side trials: one with sunlight at 10% and waterAmount at 100 mL, and one with sunlight at 75% and waterAmount at 0 mL. Students compare which need is more critical at each stage.",
      "Explore overwatering by setting waterAmount to 200 mL. Ask students if more water always means a bigger, healthier plant, and why or why not.",
      "Connect to a real classroom seed-growing activity: have students plant bean seeds in cups while adjusting sunlight and water in the simulation to predict what their real seeds will need.",
      "Use the simulation to introduce NGSS 3-LS1-1 by having students explain in their own words what each stage of the life cycle needs from its environment.",
    ],
    faq: [
      {
        question: "What are the main stages of a plant's life cycle?",
        answer:
          "There are five main stages. First is the seed — a tiny package with a baby plant inside. Second is germination — when the seed cracks open and the first root and shoot grow. Third is the young plant stage — leaves develop and the plant starts making its own food using sunlight. Fourth is the flowering stage — the plant grows flowers to attract pollinators. Fifth is seed production — the flower makes fruit and new seeds so the cycle can start again.",
      },
      {
        question: "Why do plants need sunlight?",
        answer:
          "Plants use sunlight as energy to make food in their leaves. They combine water from the soil and a gas from the air called carbon dioxide to make sugar, which the plant uses to grow. Without enough sunlight, the plant cannot make enough food and it will grow slowly, look pale, or eventually die. Sunlight is like the plant's power source.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports 3-LS1-1 (develop models to describe that organisms have unique and diverse life cycles, but all have in common birth, growth, reproduction, and death). Students observe the seed-to-seed journey of a flowering plant and explore how sunlight and water affect growth at each stage.",
      },
      {
        question: "What is pollination and why does it matter?",
        answer:
          "Pollination is when pollen — a tiny yellow powder from inside a flower — gets moved from one flower to another. Bees, butterflies, and other insects often carry pollen on their bodies from flower to flower when they come to drink nectar. When pollen reaches the right part of another flower, the plant can make seeds. Without pollination, many plants cannot reproduce and produce fruit.",
      },
      {
        question: "What happens if a plant gets too much water?",
        answer:
          "Too much water can be just as bad as too little. When soil is soaked all the time, the roots cannot get the air they need. The roots may start to rot. A plant with rotting roots cannot take in water or nutrients properly, so it weakens and wilts even though the soil is wet. Most plants do best when the soil is moist but not flooded.",
      },
    ],
  },
};
