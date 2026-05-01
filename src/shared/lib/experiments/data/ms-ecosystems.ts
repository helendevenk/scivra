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
  primaryStandard: "ngss-ms",
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

  seoTitle: "Ecosystems Food Web Middle School | Scivra Biology Simulation",
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
  contentSections: {
    whatIsIt:
      "An ecosystem is a community of living things interacting with each other and with their physical surroundings — soil, water, sunlight, and air. Every organism in an ecosystem plays a role. Producers like plants and algae capture sunlight and convert it to food through photosynthesis. Herbivores eat producers and are in turn eaten by carnivores. This eating order forms a food web — a map of who eats whom. Energy flows through the web in one direction: from the sun through plants to animals. But here is the catch: at every step, about 90% of the energy is lost as heat, leaving only 10% for the next level. This 10% rule explains why there are always far more plants than rabbits, and far more rabbits than foxes. Populations also rise and fall in predictable cycles — when prey multiply, predators follow; when prey crash, predators decline too. This simulation lets you set starting populations, watch cycles unfold over time, and disrupt the system by adding an invasive species to see how the whole ecosystem responds.",
    parameterExplanations: {
      producerPop:
        "The starting number of plants (producers), adjustable from 50 to 500 in steps of 10. Plants are the energy base of the ecosystem — they convert sunlight into food via photosynthesis. A high plant population supports more herbivores; a very low plant population can cause the entire ecosystem to collapse because herbivores run out of food before predator populations can adjust.",
      herbivorePop:
        "The starting number of herbivores (rabbits), adjustable from 5 to 100 in steps of 5. Herbivores eat plants and are eaten by carnivores. Setting herbivore population too high relative to plants causes overgrazing. Setting it too low gives carnivores an immediate food shortage. Watch how changes here ripple upward to foxes and downward to plant recovery rates.",
      carnivorePop:
        "The starting number of carnivores (foxes), adjustable from 1 to 30 in steps of 1. Foxes keep the rabbit population in check. Too many foxes at the start can quickly wipe out rabbits, then starve themselves. Too few foxes lets rabbits multiply unchecked and overgraze plants. Experiment with the ratio of foxes to rabbits to find a stable oscillating cycle.",
      invasiveSpecies:
        "Toggles the addition of an invasive species into the ecosystem: 0 = no invasive species, 1 = invasive species introduced. This is a Pro-tier feature. Invasive species often outcompete native organisms for food or space because they have no natural predators in the new environment. Watch how a single introduced species can cascade through the entire food web and reshape population dynamics.",
    },
    misconceptions: [
      {
        wrong: "If we remove a predator, the ecosystem becomes healthier because prey animals thrive.",
        correct:
          "Removing a top predator typically causes a trophic cascade in the opposite direction. Without predators, herbivore populations often explode, overgraze vegetation, and destabilize the entire ecosystem. The reintroduction of wolves to Yellowstone is a well-documented example: their presence kept elk populations in check, which allowed riverbank vegetation to recover, which reduced erosion. Predators are often a sign of ecosystem health, not a threat to it.",
      },
      {
        wrong: "Energy cycles through an ecosystem, so nothing is ever lost.",
        correct:
          "Matter (atoms like carbon and nitrogen) does cycle through ecosystems via decomposition and nutrient cycling. But energy does not cycle — it flows in one direction. At each trophic level, typically around 90% of energy is lost as heat through metabolism and movement. This is why ecosystems need a continuous input of solar energy and why food chains rarely extend beyond four or five levels.",
      },
      {
        wrong: "Invasive species are always stronger and will always win.",
        correct:
          "Invasive species often succeed initially because they lack natural predators or parasites in their new environment — not because they are inherently superior. In their native ecosystems they are typically kept in balance by co-evolved predators and diseases. Given time, native ecosystems can sometimes adapt, and some invasive species fail when they encounter new limiting factors.",
      },
      {
        wrong: "Predator and prey populations reach a steady balance and stay there.",
        correct:
          "In most real ecosystems, predator-prey populations oscillate in cycles rather than settling at a fixed steady state. When prey are plentiful, predators multiply; increased predation reduces prey; fewer prey means predators decline from starvation; and the cycle repeats. The classic example is the lynx-hare cycle in Canada, where both populations show regular peaks and crashes spanning several years.",
      },
    ],
    teacherUseCases: [
      "Set producerPop to 200, herbivorePop to 30, and carnivorePop to 8. Run the simulation and have students sketch the population graph. Ask: which population peaks first, and which follows? Connect the delay to predator reproduction rates.",
      "Reduce carnivorePop to 1 while keeping producerPop at 200 and herbivorePop at 50. Ask students to predict what happens to the plant population over time and explain the mechanism (herbivores unchecked, overgrazing).",
      "Set producerPop to 50, herbivorePop to 60, and carnivorePop to 20. Let the simulation run and discuss why such an imbalanced starting point often leads to population collapse rather than stabilization.",
      "Enable invasiveSpecies (Pro) with a balanced starting ecosystem. Before enabling it, ask students to predict which native species will be most affected and why. Compare their predictions to the simulation outcome.",
      "Use the simulation as a data-collection activity: have students try three different starting ratios of herbivores to carnivores, record whether each leads to stable cycles or collapse, and graph their results to discuss carrying capacity concepts aligned with MS-LS2-1.",
    ],
    faq: [
      {
        question: "What is the 10% rule and why does it limit food chain length?",
        answer:
          "The 10% rule describes how much energy typically passes from one trophic level to the next. When a rabbit eats grass, it uses most of the grass energy for its own movement, warmth, and growth — only about 10% is stored in rabbit tissue available to a fox. The fox similarly keeps only 10% of the rabbit energy. By the fourth or fifth link in a chain, so little energy remains that it cannot support a viable population of top predators. This is why very long food chains — more than four or five steps — are rarely observed in nature.",
      },
      {
        question: "What is a trophic cascade?",
        answer:
          "A trophic cascade is when a change at one level of a food web — usually the top predator — triggers a chain of population changes all the way down to the producers. Removing wolves from Yellowstone is the most cited real-world example: elk populations exploded, heavily grazed riverside willows and aspens, which destabilized stream banks, which changed river flow patterns. Reintroducing wolves reversed many of these changes. The simulation lets you observe simplified cascades by adjusting carnivore population.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports MS-LS2-1 (analyze and interpret data to provide evidence for the effects of resource availability on organisms and populations), MS-LS2-3 (develop a model to describe the cycling of matter and flow of energy among living and nonliving parts of an ecosystem), and MS-LS2-4 (construct an argument supported by empirical evidence that changes to physical or biological components of an ecosystem affect populations).",
      },
      {
        question: "How do carbon and nitrogen cycle through an ecosystem?",
        answer:
          "Carbon enters ecosystems when plants absorb CO2 during photosynthesis and store it in their tissues. Animals get carbon by eating plants or other animals. When organisms die, decomposers break down their bodies and release carbon back to the atmosphere or soil. Nitrogen follows a similar cycle: bacteria in soil convert atmospheric nitrogen into a form plants can absorb, plants incorporate it into proteins, animals eat the plants, and decomposers return nitrogen to the soil when organisms die. Both cycles ensure that essential atoms are reused rather than lost.",
      },
      {
        question: "Why do invasive species often cause so much damage?",
        answer:
          "Native species and their predators, parasites, and competitors have co-evolved over long time periods, so each species is kept in check by others. An invasive species arriving in a new ecosystem typically leaves those controls behind. Without natural enemies, it can reproduce rapidly, outcompete native species for food and space, and disrupt feeding relationships the ecosystem depends on. The simulation shows this disruption by allowing you to introduce a species that the existing food web was not balanced to include.",
      },
    ],
  },
};
