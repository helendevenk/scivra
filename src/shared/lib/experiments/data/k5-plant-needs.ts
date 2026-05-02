import type { Experiment } from "@/shared/types/experiment";

export const k5PlantNeeds: Experiment = {
  id: "k5-plant-needs",
  slug: "k5-plant-needs",
  title: "What Plants Need",
  subtitle: "Light, water, soil nutrients, and air for plant growth",
  description: "Grow virtual plants by providing the right amounts of light, water, and nutrients. Discover what happens when you remove one essential need — the plant struggles! Compare healthy plants to those missing sunlight, water, or soil nutrients to understand what all plants need to survive.",
  thumbnail: "/imgs/experiments/k5-plant-needs.png",
  standards: { ngss: ["2-LS2-1", "5-LS1-1"], gcse: [], ap: [] },
  primaryStandard: "elementary-k5",
  category: "biology",
  subject: "biology",
  gradeLevel: "3-5",
  tags: ["plant needs", "photosynthesis basics", "sunlight water nutrients", "plant growth", "K-5 biology"],
  difficulty: "beginner",
  parameters: [
    { id: "sunlight", label: "Sunlight Intensity", unit: "%", min: 0, max: 100, default: 70, step: 1, tier: "free" },
    { id: "water", label: "Water Level", unit: "%", min: 0, max: 100, default: 60, step: 1, tier: "free" },
  ],
  formulas: [],
  theory: "All plants need four things to grow: light (energy source for photosynthesis), water (used in photosynthesis and to transport nutrients), nutrients from soil (nitrogen, phosphorus, potassium for building cells), and carbon dioxide from air. Remove any one and the plant suffers. Too little light: pale, leggy growth. Too little water: wilting, then death. Too few nutrients: yellowing leaves, stunted growth. Too much water: root rot. Plants are like tiny factories that use sunlight as power to combine water and CO₂ into sugar (food) and oxygen.",
  instructions: "Drag the Sunlight Intensity (0-100%) and Water Level (0-100%) sliders to set your plant's growing conditions, then watch how the plant grows or struggles over several days. Or click one of the three preset buttons — Ideal Growth, Drought Stress, or Low Light — to jump to a common scenario.",
  challenges: [
    { id: "kpn-c1", question: "What happens if a plant gets water and nutrients but no sunlight?", hint: "It can't photosynthesize — no energy to make food. It will grow pale and weak, then eventually die", tier: "free" },
    { id: "kpn-c2", question: "Why do plants in dark closets grow very tall and thin?", hint: "They stretch toward light — using stored energy to grow taller in search of sunlight. This stretching for light is sometimes called etiolation.", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 10,
  relatedExperiments: ["k5-plant-life-cycle"],
  htmlPath: "/experiments/elementary/k5-plant-needs.html",
  seoTitle: "What Do Plants Need? | Scivra K-5 Science",
  seoKeywords: ["plant needs for kids", "plant growth simulation", "sunlight water nutrients", "K-5 biology"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Elementary School", teaches: "Plant Needs" },
  htmlControlAliases: {
    sunlight: "sliderSun",
    water: "sliderWater",
  },
  presets: [
    {
      id: "ideal",
      label: "Ideal Growth",
      description:
        "Sunlight 85% and Water 75% — a healthy combination where the plant has enough of both essentials to thrive.",
      paramValues: { sunlight: 85, water: 75 },
    },
    {
      id: "drought",
      label: "Drought Stress",
      description:
        "Sunlight 80% and Water 5% — plenty of light but almost no water. Watch how the plant wilts even with strong sun.",
      paramValues: { sunlight: 80, water: 5 },
    },
    {
      id: "lowLight",
      label: "Low Light",
      description:
        "Sunlight reduced and Water normal — illustrates that light alone limits growth even when water is present.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Plants cannot walk to the store to buy food. They have to make everything they need by themselves! To do that, plants need four things: sunlight, water, nutrients from the soil, and air. Sunlight gives plants energy, the same way food gives us energy. Water helps the plant drink up nutrients from the soil and move them to every part of its body. Nutrients are tiny minerals in the soil — like vitamins for plants — that help them build leaves, stems, and roots. Air has an invisible gas called carbon dioxide that plants use together with sunlight and water to make their own sugar. That sugar is the plant's food! Take away any one of these four things and the plant will struggle. In this simulation, you control how many hours of sunlight the plant gets, how much water it receives each day, and how rich the soil nutrients are. Watch a healthy plant grow when all three are right, and see what happens when one is missing.",
    parameterExplanations: {
      sunlight:
        "Sunlight Intensity sets how strong the light is reaching the plant, on a scale of 0% (complete darkness) to 100% (very bright direct sun). Around 70% is a comfortable healthy level for most plants. At 0% the plant cannot make food through photosynthesis and will weaken — its leaves may turn pale and the stem may stretch desperately toward any light. At 100% the plant gets plenty of energy but uses water faster, so it needs the Water slider higher to stay healthy. Use the Ideal Growth preset to jump to a balanced setting.",
      water:
        "Water Level sets how much water is available to the plant's roots, on a scale of 0% (bone-dry soil) to 100% (very wet soil). Around 60% is a good middle ground. Too little water makes the plant wilt — leaves droop because there is not enough water inside the cells to keep them firm. Too much water can drown the roots, because roots also need air pockets in the soil to breathe; soaked soil cuts off that air and roots begin to rot. Use the Drought Stress preset (Water 5%) to see what happens when a plant runs out of water even with strong sun.",
    },
    misconceptions: [
      {
        wrong: "Plants eat soil.",
        correct:
          "Plants do not eat soil. They use sunlight, water, and air to make their own food (sugar) in their leaves. The soil provides helpful nutrients — a bit like vitamins — but it is not the main food source. A plant grown in water with nutrients added (hydroponics) and no soil at all can still grow perfectly well.",
      },
      {
        wrong: "The more water you give a plant, the better it will grow.",
        correct:
          "Plants need water, but too much is harmful. When roots sit in soaked soil for too long, they cannot get the air they need and they begin to rot. A plant with rotten roots cannot take in water or nutrients properly and will wilt and die. Most plants grow best in moist soil, not waterlogged soil.",
      },
      {
        wrong: "Plants only need sunlight — they do not need anything from the soil.",
        correct:
          "Sunlight is very important, but plants also need nutrients from the soil to build their leaves, stems, and roots. Without nutrients like nitrogen and phosphorus, plants often grow slowly and their leaves turn yellow. Sunlight provides energy, but nutrients provide the raw materials for building the plant's body.",
      },
      {
        wrong: "A plant in a dark closet will die right away.",
        correct:
          "A plant in a very dark place will not die instantly. It will use its stored energy to grow its stem longer, stretching toward any hint of light. The stem grows tall and thin and pale as it stretches for light (this is sometimes called etiolation). Eventually, if it cannot find light, it will run out of energy and die.",
      },
    ],
    teacherUseCases: [
      "Click the Ideal Growth preset (Sunlight 85%, Water 75%) as the healthy baseline. Have students observe strong, healthy growth, then drop the Sunlight slider to 0% to see how the plant struggles even when water is plentiful — directly supporting 2-LS2-1 (investigate whether plants need sunlight).",
      "Click the Drought Stress preset (Sunlight 80%, Water 5%). Ask students: if sunlight is strong, why is the plant still wilting? Connect the answer to plant biology — water is needed to move nutrients and to keep cells firm, so no amount of sunlight makes up for missing water.",
      "Click the Low Light preset and ask students to predict what will happen before pressing Grow. Then drag the Sunlight slider from 10% up to 90% in steps and watch how growth speeds up — connects light to photosynthesis (5-LS1-1).",
      "Model a drought-and-recovery cycle: start at Water 70%, drag down to 5% and observe wilting, then drag back to 70% and watch recovery. Reinforces the idea that plants are resilient if conditions improve in time.",
      "Use the two sliders to run a controlled experiment: keep Sunlight at 70% and vary only Water (10%, 50%, 90%); then keep Water at 60% and vary only Sunlight. Introduce the idea of a fair test — change one variable at a time — as a science practice skill.",
    ],
    faq: [
      {
        question: "What four things do plants need to grow?",
        answer:
          "All plants need four things: sunlight for energy, water to move nutrients and support their body, nutrients from the soil to build leaves and stems, and carbon dioxide from the air. They combine sunlight, water, and carbon dioxide to make sugar — their food. This process is called photosynthesis, which means making food using light.",
      },
      {
        question: "Why do plants in a dark room grow very tall and skinny?",
        answer:
          "When a plant is in the dark it uses its stored energy to stretch its stem as tall as possible, hoping to reach a light source. This stretched, pale growth — sometimes called etiolation — shows the plant is not thriving. If it finds light, it can start growing more strongly. If it never finds light, it will eventually use up all its stored energy.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports 2-LS2-1 (plan and conduct an investigation to determine if plants need sunlight and water to grow) and 5-LS1-1 (support an argument that plants get the materials they need for growth chiefly from air and water). Students vary the Sunlight Intensity and Water Level sliders and observe the results like real scientists.",
      },
      {
        question: "What about nutrients from the soil — do plants need those too?",
        answer:
          "Yes, plants also need nutrients like nitrogen, phosphorus, and potassium from the soil to build healthy leaves, roots, and stems. This simulation focuses on the two needs students can vary directly — sunlight and water — but the plant graphic also assumes a normal level of soil nutrients in the background. In a real classroom, you can extend this lesson by having students discuss where soil nutrients come from (decomposing leaves and animals; fertilizer added by farmers) and what happens to plants in nutrient-poor soil (yellow leaves, slow growth).",
      },
      {
        question: "Can plants grow without soil?",
        answer:
          "Yes! Plants can grow in water with nutrients added to it — this is called hydroponics and many grocery store herbs are grown this way. The key is that the plant still gets the four things it needs: light, water, nutrients, and air. Soil is just one way to deliver water and nutrients to the roots. Without soil, those things must come from somewhere else.",
      },
    ],
  },
};
