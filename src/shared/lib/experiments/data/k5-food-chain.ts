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
  primaryStandard: "elementary-k5",
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

  seoTitle: "Food Chain Ecosystem Simulation for Kids | Scivra Elementary",
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
  contentSections: {
    whatIsIt:
      "A food chain shows the order of who eats whom in nature. It starts with plants. Plants use sunlight to make their own food. That is why we call them producers — they produce food. Animals that eat plants are called herbivores, or primary consumers. Rabbits, deer, and caterpillars are examples. Animals that eat the plant-eaters are called carnivores, or secondary consumers. Foxes, hawks, and wolves are examples. Then there are decomposers — tiny living things like bacteria and fungi that break down dead plants and animals. Decomposers are nature's recyclers. They send nutrients back into the soil so plants can grow again. In this simulation you can change the number of plants, how many plant-eaters there are, and how many meat-eaters there are. You can also change how much sunlight the plants get. Watch what happens when you take out one part of the chain — the whole ecosystem feels the change!",
    parameterExplanations: {
      producerPop:
        "This slider sets the number of plants in the ecosystem, from 10 to 200. More plants means more food for herbivores. Try setting it very low and see how the rest of the food chain is affected when plants are scarce.",
      herbivoreRatio:
        "This controls how many plant-eaters there are compared to plants, from 0.05 (very few) to 0.5 (a lot). Herbivores eat plants. If there are too many, they eat all the plants too fast. If there are too few, more plants survive but carnivores may go hungry.",
      carnivoreRatio:
        "This controls how many meat-eaters there are compared to plant-eaters, from 0.01 (very few) to 0.2 (a lot). Carnivores eat herbivores. Without carnivores, herbivore numbers can grow too large and wipe out the plants. Watch how changing this number ripples through the whole chain.",
      sunlight:
        "This sets how bright the sunlight is, from 10% to 100%. Plants need sunlight to grow and make food. Less sunlight means fewer plants, which means less food for everyone up the chain. This is a pro feature — try it to explore how energy from the sun drives the whole ecosystem.",
    },
    misconceptions: [
      {
        wrong: "Plants are not really part of the food chain because nothing eats them back.",
        correct:
          "Plants are the most important part of the food chain! They are called producers because they capture energy from the sun and turn it into food. Every animal in the chain depends on plants, directly or indirectly. Without plants, the whole food chain collapses.",
      },
      {
        wrong: "Decomposers are gross and not useful.",
        correct:
          "Decomposers like bacteria and fungi do a very important job. They break down dead animals and plants and return nutrients to the soil. Without them, dead things would pile up everywhere and plants could not get the nutrients they need to grow. Decomposers keep the cycle going.",
      },
      {
        wrong: "If one animal disappears from a food chain, it does not really matter.",
        correct:
          "Every part of a food chain is connected. If foxes disappear, rabbits have no predator and their numbers explode. Too many rabbits eat too many plants, and then plants disappear. Then rabbits run out of food and crash too. Removing one animal causes big changes all the way through the chain.",
      },
      {
        wrong: "There are usually more wolves than rabbits in an ecosystem.",
        correct:
          "It is usually the opposite. In this simple land food-chain model, there are usually many more plants than plant-eaters, and many more plant-eaters than meat-eaters. This is because a lot of energy is lost at each step — only about 10% passes to the next level, so each level needs many individuals from the level below to support it. To feed one fox, you need many rabbits. To feed those rabbits, you need many plants.",
      },
    ],
    teacherUseCases: [
      "Set producerPop to 100, herbivoreRatio to 0.2, and carnivoreRatio to 0.05 as a balanced starting point. Ask students to describe what they see, then predict what will happen if carnivores are reduced to the minimum (carnivoreRatio = 0.01).",
      "Reduce carnivoreRatio to 0.01 and have students watch what happens to the herbivore and plant populations over time. This demonstrates how predators keep ecosystems in balance.",
      "Lower sunlight to 20% (pro) and observe how reduced plant growth affects every level of the food chain. Connect to discussions about seasons, forest fires, or drought.",
      "Start with producerPop at 200 and herbivoreRatio at 0.5 to show overpopulation of plant-eaters. Ask: what usually controls how many rabbits or deer there are in nature?",
      "Have students build their own food chain on paper (sun, plant, insect, bird, hawk) and then match each level to the sim controls — which slider represents which creature?",
    ],
    faq: [
      {
        question: "What is the difference between a producer and a consumer?",
        answer:
          "A producer makes its own food using sunlight. Plants, algae, and some bacteria are producers. A consumer cannot make its own food, so it must eat other living things to get energy. Rabbits consume plants, foxes consume rabbits. Decomposers are a special kind of consumer that eat dead material and recycle nutrients back into the soil.",
      },
      {
        question: "Why are there usually more plants than animals in an ecosystem?",
        answer:
          "At each step in the food chain, most of the energy is used up or lost as body heat. Only a small amount passes to the next level. It takes many plants to feed a rabbit, and many rabbits to feed a fox. So the lower you are in the food chain, the more individuals there must be to support the levels above.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports 5-LS2-1 (develop a model to describe the movement of matter among plants, animals, decomposers, and the environment). The ecosystem animation shows energy and matter flowing from sun to plants to herbivores to carnivores, with decomposers returning nutrients to soil.",
      },
      {
        question: "What would happen if all the decomposers disappeared?",
        answer:
          "Dead plants and animals would pile up everywhere and never break down. The nutrients locked inside those dead things would never return to the soil. Plants would run out of nutrients and stop growing well. Without plants, herbivores would go hungry, and then carnivores too. The whole ecosystem would break down. Decomposers may be invisible, but they are essential.",
      },
      {
        question: "Can one animal belong to more than one level in a food chain?",
        answer:
          "Yes! Many animals eat both plants and other animals. Bears eat berries, fish, and sometimes small mammals. Humans eat plants and animals too. An animal that eats many different things is called an omnivore. Real ecosystems are actually more like food webs — many food chains tangled together — rather than one simple straight chain.",
      },
    ],
  },
};
