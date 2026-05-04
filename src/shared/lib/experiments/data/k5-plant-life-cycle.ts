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
      id: "growthRate",
      label: "Growth Rate",
      unit: "%",
      min: 1,
      max: 100,
      default: 50,
      step: 1,
      tier: "free",
    },
    {
      id: "waterAmount",
      label: "Water Amount",
      unit: "%",
      min: 0,
      max: 100,
      default: 75,
      step: 1,
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
    "Use the Growth Rate slider to make the plant life cycle move slower or faster. Use the Water Amount slider to give the plant dry, just-right, or very wet soil. Try the 🌿 Fast Growth, 🏜️ Drought Conditions, and 🌸 Ideal Spring presets to compare how the seed, sprout, leaves, flower, and new seeds change.",

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
  htmlControlAliases: { growthRate: "growthSlider", waterAmount: "waterSlider" },
  presets: [
    {
      id: "fast",
      label: "🌿 Fast Growth",
      description:
        "A quick life cycle with strong growth and plenty of water, useful for seeing every stage in a short class demo.",
      paramValues: { growthRate: 100, waterAmount: 90 },
    },
    {
      id: "drought",
      label: "🏜️ Drought Conditions",
      description:
        "Dry soil and slow growth show how a plant can struggle when it does not get enough water.",
      paramValues: { growthRate: 20, waterAmount: 15 },
    },
    {
      id: "ideal",
      label: "🌸 Ideal Spring",
      description:
        "A balanced setting with steady growth and enough water, useful for observing a healthy seed-to-seed cycle.",
      paramValues: { growthRate: 70, waterAmount: 75 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Every flowering plant goes through a journey called its life cycle. It starts as a tiny seed. Inside the seed is a baby plant and a small food supply, all wrapped up in a tough coat. When the seed gets enough water and warmth, something amazing happens — it cracks open! A tiny root pushes down into the soil to drink water, and a little shoot pushes up toward the light. This is called germination. The sprout grows leaves that catch sunlight. Plants use sunlight, water, and air to make their own food. This is called photosynthesis — the way plants make food from sunlight. When the plant is big enough, it grows flowers. Flowers attract bees and butterflies that carry pollen from one flower to another. After pollination, the flower makes fruit with new seeds inside. Those seeds fall to the ground and the whole cycle starts again. In this simulation, you can control how much sunlight and water your plant gets. See how those two things change how fast your plant grows through each stage.",
    parameterExplanations: {
      growthRate:
        "Growth Rate changes how quickly the plant moves through the life cycle in this model. A low number means the seed, sprout, leaves, flower, and new seeds appear more slowly, so you have more time to observe each stage. A high number makes the same stages happen faster. It does not skip any stage; it only changes the pace. Try Fast Growth to see the whole cycle quickly, then slow it down and look for details like the first root, the growing stem, and the flower. Keep Water Amount the same when you test Growth Rate so your comparison is fair.",
      waterAmount:
        "Water Amount changes how much water the plant gets, from dry soil at 0% to very wet soil at 100%. Plants need water to sprout and grow. With too little water, the seed may stay still or the plant may wilt because its roots cannot bring enough water into the stem and leaves. A middle setting often gives healthy growth. Very high water can also cause trouble because roots need some air in the soil. Try Drought Conditions, then Ideal Spring, and compare what changes. When you test water, keep Growth Rate the same so you know water caused the difference.",
    },
    misconceptions: [
      {
        wrong: "Plants get all their food from the soil.",
        correct:
          "Plants make most of their own food using light, water, and air — not soil. The soil provides helpful nutrients like minerals, but the main food-making process happens in the leaves. This is why a plant with enough light and water can grow better than a plant in rich soil without the conditions it needs.",
      },
      {
        wrong: "Seeds need light to sprout.",
        correct:
          "Most classroom seeds, like beans, do not need light to start sprouting. They use the food stored inside the seed to grow their first root and shoot. What they do need is water and warmth. Once the sprout grows leaves above the soil, light becomes important for making more food. Some seeds are sensitive to light, but for the common seeds students grow in class, darkness underground is not a problem.",
      },
      {
        wrong: "The flower is just for decoration and is not important.",
        correct:
          "Flowers are the reproductive parts of the plant. Their bright colors and sweet smell attract pollinators like bees and butterflies. Pollinators carry pollen between flowers so the plant can make seeds and fruit. Without flowers and pollinators, many plants could not reproduce and there would be far less fruit and food in the world.",
      },
      {
        wrong: "A plant's life cycle ends when its flowers die.",
        correct:
          "When flowers die, that is actually an exciting part of the cycle. Part of the flower becomes a fruit that holds new seeds. Those seeds travel — by wind, animals, or falling — to the ground. Then the whole cycle starts over with germination. The plant life cycle is a circle, not a dead end.",
      },
    ],
    teacherUseCases: [
      "Use the Ideal Spring preset as a baseline. Have students sketch and label the seed, sprout, growing plant, flower, and new seed stages.",
      "Use the Fast Growth preset for a short whole-class demonstration, then lower Growth Rate so students can observe each stage more carefully.",
      "Use the Drought Conditions preset to discuss how limited water can slow growth or cause wilting. Ask students to support their observations with evidence from the model.",
      "Run a controlled comparison by keeping Growth Rate the same while changing only Water Amount. Students record what changes and what stays the same.",
      "Connect the simulation to NGSS 3-LS1-1 by having students explain how the plant life cycle includes birth, growth, reproduction, and new seeds.",
    ],
    faq: [
      {
        question: "What are the main stages of a plant's life cycle?",
        answer:
          "There are five main stages. First is the seed — a tiny package with a baby plant inside. Second is germination — when the seed cracks open and the first root and shoot grow. Third is the young plant stage — leaves develop and the plant starts making its own food using light, water, and air. Fourth is the flowering stage — the plant grows flowers to attract pollinators. Fifth is seed production — the flower makes fruit and new seeds so the cycle can start again.",
      },
      {
        question: "How do the sliders change the plant life cycle?",
        answer:
          "The Growth Rate slider changes how fast the model moves through the stages. A higher number makes the seed-to-seed cycle run faster, while a lower number makes it easier to watch each step. The Water Amount slider changes how much water the plant gets. Too little water can slow the plant or make it wilt. A balanced amount helps the plant grow through the full cycle.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports 3-LS1-1 (develop models to describe that organisms have unique and diverse life cycles, but all have in common birth, growth, reproduction, and death). Students observe the seed-to-seed journey of a flowering plant and use the Growth Rate and Water Amount sliders to compare what happens at each stage.",
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
