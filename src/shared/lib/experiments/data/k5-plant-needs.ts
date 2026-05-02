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
    { id: "sunlight", label: "Sunlight", unit: "hours/day", min: 0, max: 16, default: 8, step: 1, tier: "free" },
    { id: "water", label: "Water", unit: "mL/day", min: 0, max: 500, default: 200, step: 25, tier: "free" },
    { id: "nutrients", label: "Soil Nutrients", unit: "%", min: 0, max: 100, default: 70, step: 10, tier: "free" },
  ],
  formulas: [],
  theory: "All plants need four things to grow: light (energy source for photosynthesis), water (used in photosynthesis and to transport nutrients), nutrients from soil (nitrogen, phosphorus, potassium for building cells), and carbon dioxide from air. Remove any one and the plant suffers. Too little light: pale, leggy growth. Too little water: wilting, then death. Too few nutrients: yellowing leaves, stunted growth. Too much water: root rot. Plants are like tiny factories that use sunlight as power to combine water and CO₂ into sugar (food) and oxygen.",
  instructions: "Set the sunlight hours, water amount, and nutrient level for your virtual plant. Press 'Grow' and watch what happens over several days. Try removing one factor to see its effect. Compare side-by-side plants with different conditions.",
  challenges: [
    { id: "kpn-c1", question: "What happens if a plant gets water and nutrients but no sunlight?", hint: "It can't photosynthesize — no energy to make food. It will grow pale and weak, then eventually die", tier: "free" },
    { id: "kpn-c2", question: "Why do plants in dark closets grow very tall and thin?", hint: "They're stretching toward light (etiolation) — using stored energy to grow taller, hoping to find sunlight", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 10,
  relatedExperiments: ["k5-plant-life-cycle"],
  htmlPath: "/experiments/elementary/k5-plant-needs.html",
  seoTitle: "What Do Plants Need? | Scivra K-5 Science",
  seoKeywords: ["plant needs for kids", "plant growth simulation", "sunlight water nutrients", "K-5 biology"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Elementary School", teaches: "Plant Needs" },
  contentSections: {
    whatIsIt:
      "Plants cannot walk to the store to buy food. They have to make everything they need by themselves! To do that, plants need four things: sunlight, water, nutrients from the soil, and air. Sunlight gives plants energy, the same way food gives us energy. Water helps the plant drink up nutrients from the soil and move them to every part of its body. Nutrients are tiny minerals in the soil — like vitamins for plants — that help them build leaves, stems, and roots. Air has an invisible gas called carbon dioxide that plants use together with sunlight and water to make their own sugar. That sugar is the plant's food! Take away any one of these four things and the plant will struggle. In this simulation, you control how many hours of sunlight the plant gets, how much water it receives each day, and how rich the soil nutrients are. Watch a healthy plant grow when all three are right, and see what happens when one is missing.",
    parameterExplanations: {
      sunlight:
        "This slider sets how many hours of sunlight the plant gets each day, from 0 hours (total darkness) to 16 hours (very long sunny day). Most plants do well with around 8 hours. At 0 hours the plant cannot make food and will weaken. At 16 hours the plant grows quickly but needs plenty of water to keep up.",
      water:
        "This slider sets how much water the plant receives each day, from 0 mL (none at all) to 500 mL (a lot). Around 200 mL is a good amount for many plants. Too little water causes wilting. Too much water can drown the roots and cause them to rot, so the plant may still wilt even with wet soil.",
      nutrients:
        "This slider sets how rich the soil is in nutrients, from 0% (empty, exhausted soil) to 100% (rich healthy soil). Around 70% is a good level. Plants with too few nutrients often grow slowly and their leaves may turn yellow. Nutrients are like the vitamins in your food — plants need them to stay strong and green.",
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
          "A plant in a very dark place will not die instantly. It will use its stored energy to grow its stem longer, stretching toward any hint of light. This is called etiolation. The stem grows tall and thin and pale because the plant is desperately searching for light. Eventually, if it cannot find light, it will run out of energy and die.",
      },
    ],
    teacherUseCases: [
      "Set sunlight to 8 hours, water to 200 mL, and nutrients to 70% as the healthy baseline. Students observe robust growth, then remove one variable at a time to see which need matters most.",
      "Run a zero-sunlight trial (sunlight = 0) with water at 200 mL and nutrients at 70%. Ask students: if water and nutrients are perfect, why is the plant still struggling?",
      "Compare a zero-nutrient plant (nutrients = 0, sunlight = 8, water = 200 mL) with a full-nutrient plant. Have students look at leaf color and growth rate to connect nutrients to healthy appearance.",
      "Model a drought by starting at water = 200 mL and reducing to 0 mL over several steps. Students predict and observe the wilting response, then restore water to see recovery.",
      "Use side-by-side plants to run a controlled experiment: change only one slider at a time while keeping the other two the same. Introduce the idea of a fair test as a science practice skill.",
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
          "When a plant is in the dark it uses its stored energy to stretch its stem as tall as possible, hoping to reach a light source. This stretched, pale growth is called etiolation. The plant is not growing happily — it is actually desperate. If it finds light, it can start growing normally. If it never finds light, it will eventually use up all its stored energy.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports 2-LS2-1 (plan and conduct an investigation to determine if plants need sunlight and water to grow) and 5-LS1-1 (support an argument that plants get the materials they need for growth chiefly from air and water). Students vary light, water, and nutrient levels and observe the results like real scientists.",
      },
      {
        question: "What are nutrients and where do they come from?",
        answer:
          "Nutrients are minerals that plants need to build healthy leaves, roots, and stems — like nitrogen, phosphorus, and potassium. They come from the soil. Dead plants and animals that decompose put nutrients back into the soil. Farmers and gardeners often add fertilizer to soil to replace nutrients that plants have used up. Without nutrients, plants often look yellow and grow slowly.",
      },
      {
        question: "Can plants grow without soil?",
        answer:
          "Yes! Plants can grow in water with nutrients added to it — this is called hydroponics and many grocery store herbs are grown this way. The key is that the plant still gets the four things it needs: light, water, nutrients, and air. Soil is just one way to deliver water and nutrients to the roots. Without soil, those things must come from somewhere else.",
      },
    ],
  },
};
