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
      id: "preyPopulation",
      label: "Prey Population",
      unit: "",
      min: 10,
      max: 200,
      default: 80,
      step: 5,
      tier: "free",
    },
    {
      id: "predatorPopulation",
      label: "Predator Population",
      unit: "",
      min: 1,
      max: 10,
      default: 3,
      step: 0.5,
      tier: "free",
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
    "Use the Prey Population slider and Predator Population slider to set the starting balance, then press Play. Watch the population graphs evolve and look for predator-prey oscillations. Change one slider at a time to compare how the timing, peak sizes, and recovery patterns shift.",

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
  htmlControlAliases: { preyPopulation: "sl-prey", predatorPopulation: "sl-pred" },
  contentSections: {
    whatIsIt:
      "An ecosystem is a community of living things interacting with each other and with their physical surroundings — soil, water, sunlight, and air. Every organism in an ecosystem plays a role. Producers like plants and algae capture sunlight and convert it to food through photosynthesis. Herbivores eat producers and are in turn eaten by carnivores. This eating order forms a food web — a map of who eats whom. Energy flows through the web in one direction: from the sun through plants to animals. But here is the catch: at every step, about 90% of the energy is lost as heat, leaving only 10% for the next level. This 10% rule means that in many simplified terrestrial food webs, energy and biomass generally decrease at higher trophic levels — which is why there tend to be more producer biomass than herbivore biomass, and more herbivore biomass than top predator biomass. Populations also rise and fall in predictable cycles — when prey multiply, predators follow; when prey crash, predators decline too. This simulation lets you set starting populations, watch cycles unfold over time, and disrupt the system by adding an invasive species to see how the whole ecosystem responds.",
    parameterExplanations: {
      preyPopulation:
        "Prey Population sets the starting size of the prey group, from 10 to 200 organisms. In a predator-prey model, prey are the food source that allows predators to survive and reproduce. A larger prey population can support more predators for a while, but it can also create a larger crash once predation catches up. A smaller prey population may be easier for predators to overtake, especially if predator numbers begin high. Move this slider by itself first, then watch whether prey peaks come before predator peaks. That delay is the key evidence students use to interpret population cycles.",
      predatorPopulation:
        "Predator Population sets the starting size of the predator group, from 1 to 10 organisms. Predators reduce the prey population by feeding, but their own population depends on whether enough prey remain available. Starting with many predators can drive prey down quickly, then cause predator decline when food becomes scarce. Starting with only a few predators gives prey more time to increase before predation pressure grows. Keep Prey Population fixed while changing this slider to isolate how predator pressure changes the height, timing, and stability of the population waves.",
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
        wrong: "If prey start with a high population, predators will immediately become high too.",
        correct:
          "Predator populations usually lag behind prey populations. Even when prey are abundant, predators need time to find food, survive, reproduce, and add new individuals to the population. That delay is why predator-prey graphs often show prey peaking first, followed by predators. The two populations are connected, but they do not change at exactly the same moment.",
      },
      {
        wrong: "Predator and prey populations reach a steady balance and stay there.",
        correct:
          "In most real ecosystems, predator-prey populations oscillate in cycles rather than settling at a fixed steady state. When prey are plentiful, predators multiply; increased predation reduces prey; fewer prey means predators decline from starvation; and the cycle repeats. The classic example is the lynx-hare cycle in Canada, where both populations show regular peaks and crashes spanning several years.",
      },
    ],
    teacherUseCases: [
      "Start with Prey Population at 80 and Predator Population at 3. Run the simulation and have students sketch both population curves. Ask which curve peaks first and connect the delay to predator reproduction and food availability.",
      "Keep Predator Population at 3 while moving Prey Population from 20 to 160. Students predict whether a larger prey base creates larger predator peaks, then compare the graph evidence to their prediction.",
      "Keep Prey Population at 80 while moving Predator Population from 1 to 8. Students identify when predator pressure becomes strong enough to push prey into a sharp decline.",
      "Use three starting ratios, such as 40:2, 80:3, and 160:6. Students record peak order, peak height, and whether the cycles appear stable or unstable over time.",
      "Run a claim-evidence-reasoning discussion aligned with MS-LS2-1: students use slider values and population graph patterns as evidence for how resource availability and organism interactions affect population size.",
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
          "A trophic cascade is when a change at one level of a food web triggers connected population changes at other levels. Removing wolves from Yellowstone is the most cited real-world example: elk populations grew, heavily grazed riverside willows and aspens, and changed streamside habitats. Reintroducing wolves helped reverse many of those effects. In this simulation, use the predator and prey sliders to study the first link in that kind of interaction: changing one population changes the pressure on the other.",
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
          "Native species and their predators, parasites, and competitors have co-evolved over long time periods, so each species is often kept in check by others. An invasive species arriving in a new ecosystem may leave those controls behind. Without natural enemies, it can reproduce rapidly, outcompete native species for food and space, and disrupt feeding relationships the ecosystem depends on. That same idea connects to predator-prey models: population balance depends on interactions, not just on how many organisms are present at the start.",
      },
    ],
  },
};
