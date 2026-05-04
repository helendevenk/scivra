import type { Experiment } from '@/shared/types/experiment';

export const msFoodWebDynamics: Experiment = {
  id: 'ms-food-web-dynamics',
  slug: 'ms-food-web-dynamics',
  title: 'Food Web Dynamics',
  subtitle: 'Explore energy flow and trophic levels in an ecosystem',
  description:
    'Build and manipulate a food web to see how energy flows from producers through consumers. Choose different ecosystems, remove species to trigger trophic cascades, and adjust energy transfer efficiency. Observe how changes at one level ripple through the entire web, affecting populations at every trophic level.',
  thumbnail: '/imgs/experiments/ms-food-web-dynamics.png',

  standards: {
    ngss: ['MS-LS2-3', 'MS-LS2-4'],
    gcse: [],
    ap: [],
  },
  primaryStandard: 'ngss-ms',
  category: 'biology',
  subject: 'biology',
  gradeLevel: '6-8',
  tags: [
    'food web',
    'energy flow',
    'trophic levels',
    'ecosystem',
    'ecology',
    'middle school',
    '6-8',
  ],
  difficulty: 'intermediate',

  parameters: [
    {
      id: 'predatorPopulation',
      label: 'Predator Population',
      unit: '',
      min: 0,
      max: 30,
      default: 10,
      step: 1,
      tier: 'free',
    },
    {
      id: 'preyPopulation',
      label: 'Prey Population',
      unit: '',
      min: 10,
      max: 300,
      default: 100,
      step: 1,
      tier: 'free',
    },
  ],

  formulas: [
    {
      latex:
        'E_{n+1} = E_n \\times \\frac{\\text{efficiency}}{100} \\quad \\text{(energy transfer between levels)}',
      description:
        'Energy available at the next trophic level depends on transfer efficiency (typically ~10%)',
    },
    {
      latex:
        '\\text{Biomass pyramid: } B_{\\text{producers}} > B_{\\text{primary}} > B_{\\text{secondary}} > B_{\\text{tertiary}}',
      description:
        'Biomass decreases at higher trophic levels because energy is lost as heat at each step',
    },
  ],

  theory:
    'A food web shows all the feeding relationships in an ecosystem — who eats whom. Energy enters the web through producers (plants, algae) that capture sunlight via photosynthesis. Primary consumers (herbivores) eat producers, secondary consumers eat herbivores, and tertiary consumers (top predators) eat other consumers. At each step, roughly 90% of energy is lost as heat through cellular respiration, leaving only about 10% for the next level. This is the 10% rule, and it explains why ecosystems have many more plants than herbivores, and far more herbivores than top predators. When a species is removed, the effects cascade through the web. Removing wolves from Yellowstone caused elk populations to explode, which overgrazed riverside vegetation, which eroded stream banks — a trophic cascade. Food webs with more connections (higher biodiversity) are more resilient because organisms have alternative food sources.',

  instructions:
    'Use the Predator Population slider and Prey Population slider to set the starting predator-prey balance. Try the Wolves in Yellowstone, Invasive Species, and Kelp Forest presets to compare three ecosystem stories, then press Play and watch population balance, energy-flow paths, and cascade patterns change over time.',

  challenges: [
    {
      id: 'fwd-c1',
      question:
        'If a grassland receives 10,000 kJ of sunlight energy, and plants capture 1% of it, how much energy is available to herbivores? To secondary consumers?',
      hint: 'Plants capture 1% of 10,000 kJ = 100 kJ. With 10% transfer efficiency, herbivores get 100 × 0.10 = 10 kJ. Secondary consumers get 10 × 0.10 = 1 kJ. This dramatic drop explains why top predators need huge territories — there simply is not much energy left for them.',
      tier: 'free',
    },
    {
      id: 'fwd-c2',
      question:
        'A forest ecosystem has hawks, snakes, mice, grasshoppers, and grass. Draw the food chain. If grasshoppers are wiped out by disease, what happens to the rest?',
      hint: 'Chain: grass → grasshoppers → mice → snakes → hawks. Without grasshoppers, mice lose a competitor for grass — mice population may increase. More mice means more food for snakes, so snake population may rise. But it depends on whether mice also eat grasshoppers. In a web (not just a chain), effects are more complex because species have multiple food sources.',
      tier: 'free',
    },
  ],

  wave: 11,
  tier: 'free',
  estimatedTime: 15,
  relatedExperiments: ['population-dynamics', 'ecological-succession'],

  htmlPath: '/experiments/middle/ms-food-web-dynamics.html',

  seoTitle:
    'Food Web Dynamics: Energy Flow & Trophic Levels | Scivra Middle School Biology',
  seoKeywords: [
    'food web dynamics simulation middle school',
    'energy flow trophic levels interactive',
    'ecosystem food web 6-8 biology',
    'trophic cascade simulation',
    'NGSS MS-LS2-3 MS-LS2-4 ecology',
  ],
  jsonLd: {
    '@type': 'LearningResource',
    educationalLevel: 'Middle School',
    teaches: 'Food Web Dynamics and Energy Flow in Ecosystems',
  },
  htmlControlAliases: {
    predatorPopulation: 'predSlider',
    preyPopulation: 'preySlider',
  },
  presets: [
    {
      id: 'loadPreset:yellowstone',
      label: 'Wolves in Yellowstone',
      description:
        'Loads a Yellowstone-style food web where wolves act as a keystone predator connected to elk, rabbits, mice, and other woodland species.',
    },
    {
      id: 'loadPreset:invasive',
      label: 'Invasive Species',
      description:
        'Loads an aquatic food web with invasive carp competing within native fish, plankton, bird, turtle, and predator relationships.',
    },
    {
      id: 'loadPreset:kelp',
      label: 'Kelp Forest (sea otters)',
      description:
        'Loads a kelp forest web where sea otters, urchins, kelp, fish, seals, and orcas illustrate a marine keystone-species cascade.',
    },
  ],
  contentSections: {
    whatIsIt:
      'A food web is a diagram of who eats whom in an ecosystem. Unlike a simple food chain with a single path, a real food web shows all the overlapping feeding relationships — most animals eat more than one thing, and most organisms are eaten by more than one predator. Energy enters the web through producers: plants and algae that capture sunlight via photosynthesis. Primary consumers (herbivores) eat the producers, secondary consumers eat the herbivores, and so on up to top predators. At each step, roughly 90% of the energy is lost as heat, which is why most simplified food webs show more producer biomass and far fewer top predators than lower-level consumers. This energy loss creates the biomass pyramid: a wide base of producers supporting progressively fewer and fewer animals at higher levels. The simulation lets you choose different ecosystem types, experiment with different energy transfer rates, and remove species to trigger trophic cascades — chain reactions that ripple through every level of the web when one species disappears.',
    parameterExplanations: {
      predatorPopulation:
        'Predator Population sets how many predators begin the simulation, from none to a dense predator group. A low value lets prey grow with little hunting pressure, while a high value can push the system toward prey decline and possible predator collapse later if food becomes scarce. Use this slider after selecting a preset to test whether the same food web is stable under different starting conditions. In the Yellowstone and kelp examples, changing predators helps students connect keystone species to population balance without treating predators as simply good or bad.',
      preyPopulation:
        'Prey Population sets the starting number of prey organisms available to support predators, from a small prey base to a crowded prey population. Raising prey can temporarily support more predators, but it may also show how rapid prey growth changes the balance reading before predators respond. Lowering prey makes food limitation visible: predators may not have enough energy intake to remain stable over time. Compare this slider across the Wolves in Yellowstone, Invasive Species, and Kelp Forest presets to separate the effect of web structure from the effect of starting population size.',
    },
    misconceptions: [
      {
        wrong:
          'Removing one species from a food web only affects the species that ate it.',
        correct:
          'A change in one species can trigger a trophic cascade — effects ripple both up and down the web. A predator increase, prey crash, invasive species, or keystone-species loss can change food availability for several connected organisms. In real ecosystems these effects sometimes travel through four or five trophic levels before stabilizing.',
      },
      {
        wrong:
          'The 10% rule means exactly one-tenth of the energy transfers perfectly at every step.',
        correct:
          'Ten percent is a useful approximation that varies in real ecosystems — it can range from about 5% to 20% depending on the organisms and environment involved. The key concept is that energy is always lost at each step, not that the fraction is precisely 10% in every case.',
      },
      {
        wrong:
          'Top predators are the most important species in a food web because they are at the top.',
        correct:
          'All levels are important, and in many ways producers are the most critical because they are the only source of new energy in the system. Removing producers collapses the entire web. Top predators often have an outsized effect on ecosystem structure (keystone predator effect), but a food web cannot exist without its producer base, no matter how many predators are present.',
      },
      {
        wrong: 'Ocean food webs work differently from land food webs.',
        correct:
          'The same fundamental principles apply in all ecosystems: energy flows from producers to consumers, only a fraction transfers at each step, and population changes can trigger cascades. The specific organisms differ — phytoplankton replace grasses, zooplankton replace insects — but the structural rules are similar. This is why ecologists can apply related models across very different biomes.',
      },
    ],
    teacherUseCases: [
      'Start with the Wolves in Yellowstone preset, set Predator Population to 10 and Prey Population to 100, and have students describe the visible connections before pressing Play.',
      'Keep the Yellowstone preset active, lower Predator Population to 0, and ask students to predict how reduced hunting pressure could affect prey and vegetation in a real trophic cascade.',
      'Use the Invasive Species preset to discuss competition: students identify which organisms may gain or lose resources, then test different Prey Population values and record the balance status.',
      'Use the Kelp Forest preset as a keystone-species case study. Students compare low and high Predator Population settings and explain how otters can indirectly protect kelp by limiting urchins.',
      'Run a three-preset comparison activity where groups keep both sliders unchanged, switch between Yellowstone, Invasive Species, and Kelp Forest, and argue how web structure changes ecosystem resilience.',
    ],
    faq: [
      {
        question: 'What is the difference between a food chain and a food web?',
        answer:
          'A food chain is a single linear sequence of who eats whom — grass to grasshopper to frog to snake to hawk. A food web shows all the interconnected feeding relationships in an ecosystem at once. Most real organisms eat multiple food sources and have multiple predators, so a food web is a much more accurate representation of how energy actually flows through an ecosystem. Food chains are simpler and easier to analyze mathematically, which is why they appear in textbooks, but food webs are closer to ecological reality.',
      },
      {
        question:
          'Why do ecosystems with more biodiversity tend to be more stable?',
        answer:
          'Higher biodiversity means more species at each trophic level and more connections in the food web. If one species disappears, other species can often fill its role — predators have alternative prey, and herbivores have alternative plants to eat. A food web with few species and few connections is more fragile: losing one species can disconnect large parts of the web. This is why conservation biologists often focus on protecting entire ecosystems and their biodiversity rather than single species in isolation.',
      },
      {
        question: 'Which NGSS standards does this experiment address?',
        answer:
          'This simulation supports MS-LS2-3 (develop a model to describe the cycling of matter and flow of energy among living and nonliving parts of an ecosystem) and MS-LS2-4 (construct an argument supported by empirical evidence that changes to physical or biological components of an ecosystem affect populations). The predator and prey sliders model population interactions, while the presets provide ecosystem cases for comparing energy flow, keystone species, invasive species, and cascade effects.',
      },
      {
        question:
          'How does energy transfer efficiency affect the number of trophic levels?',
        answer:
          'With about 10% efficiency, energy drops by a factor of 10 at each level. Starting with 10,000 kJ in producers, herbivores get roughly 1,000 kJ, secondary consumers get 100 kJ, and tertiary consumers get only 10 kJ. By four or five levels, there often is not enough energy left to support a breeding population of top predators. This is why food webs usually have broad producer and prey bases supporting smaller predator populations.',
      },
      {
        question: 'What is a keystone species?',
        answer:
          'A keystone species has a disproportionately large effect on its ecosystem relative to its abundance — like a keystone in an arch that holds the whole structure together. Sea otters are a classic example: they eat sea urchins, which eat kelp. Without otters, urchins multiply and demolish kelp forests, destroying habitat for hundreds of other species. Use the Kelp Forest preset and predator slider to explore how predator abundance can indirectly protect or destabilize other parts of the web.',
      },
    ],
  },
};
