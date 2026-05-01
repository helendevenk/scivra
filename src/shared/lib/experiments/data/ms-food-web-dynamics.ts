import type { Experiment } from "@/shared/types/experiment";

export const msFoodWebDynamics: Experiment = {
  id: "ms-food-web-dynamics",
  slug: "ms-food-web-dynamics",
  title: "Food Web Dynamics",
  subtitle: "Explore energy flow and trophic levels in an ecosystem",
  description:
    "Build and manipulate a food web to see how energy flows from producers through consumers. Choose different ecosystems, remove species to trigger trophic cascades, and adjust energy transfer efficiency. Observe how changes at one level ripple through the entire web, affecting populations at every trophic level.",
  thumbnail: "/imgs/experiments/ms-food-web-dynamics.png",

  standards: {
    ngss: ["MS-LS2-3", "MS-LS2-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "biology",
  subject: "biology",
  gradeLevel: "6-8",
  tags: [
    "food web",
    "energy flow",
    "trophic levels",
    "ecosystem",
    "ecology",
    "middle school",
    "6-8",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "ecosystemType",
      label: "Ecosystem (0=Forest, 1=Ocean, 2=Grassland)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "speciesRemoved",
      label: "Remove Species (0=None, 1=Top Predator, 2=Mid Consumer, 3=Producer)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "energyTransfer",
      label: "Energy Transfer Efficiency",
      unit: "%",
      min: 5,
      max: 20,
      default: 10,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "E_{n+1} = E_n \\times \\frac{\\text{efficiency}}{100} \\quad \\text{(energy transfer between levels)}",
      description:
        "Energy available at the next trophic level depends on transfer efficiency (typically ~10%)",
    },
    {
      latex: "\\text{Biomass pyramid: } B_{\\text{producers}} > B_{\\text{primary}} > B_{\\text{secondary}} > B_{\\text{tertiary}}",
      description:
        "Biomass decreases at higher trophic levels because energy is lost as heat at each step",
    },
  ],

  theory:
    "A food web shows all the feeding relationships in an ecosystem — who eats whom. Energy enters the web through producers (plants, algae) that capture sunlight via photosynthesis. Primary consumers (herbivores) eat producers, secondary consumers eat herbivores, and tertiary consumers (top predators) eat other consumers. At each step, roughly 90% of energy is lost as heat through cellular respiration, leaving only about 10% for the next level. This is the 10% rule, and it explains why ecosystems have many more plants than herbivores, and far more herbivores than top predators. When a species is removed, the effects cascade through the web. Removing wolves from Yellowstone caused elk populations to explode, which overgrazed riverside vegetation, which eroded stream banks — a trophic cascade. Food webs with more connections (higher biodiversity) are more resilient because organisms have alternative food sources.",

  instructions:
    "Select an ecosystem to explore its food web. Watch energy flow from the sun through producers to top predators — the width of each arrow shows how much energy transfers. Use the species removal slider to see what happens when you take out a top predator, mid-level consumer, or producer. Adjust energy transfer efficiency to see how it changes the biomass pyramid.",

  challenges: [
    {
      id: "fwd-c1",
      question:
        "If a grassland receives 10,000 kJ of sunlight energy, and plants capture 1% of it, how much energy is available to herbivores? To secondary consumers?",
      hint: "Plants capture 1% of 10,000 kJ = 100 kJ. With 10% transfer efficiency, herbivores get 100 × 0.10 = 10 kJ. Secondary consumers get 10 × 0.10 = 1 kJ. This dramatic drop explains why top predators need huge territories — there simply is not much energy left for them.",
      tier: "free",
    },
    {
      id: "fwd-c2",
      question:
        "A forest ecosystem has hawks, snakes, mice, grasshoppers, and grass. Draw the food chain. If grasshoppers are wiped out by disease, what happens to the rest?",
      hint: "Chain: grass → grasshoppers → mice → snakes → hawks. Without grasshoppers, mice lose a competitor for grass — mice population may increase. More mice means more food for snakes, so snake population may rise. But it depends on whether mice also eat grasshoppers. In a web (not just a chain), effects are more complex because species have multiple food sources.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["population-dynamics", "ecological-succession"],

  htmlPath: "/experiments/middle/ms-food-web-dynamics.html",

  seoTitle: "Food Web Dynamics: Energy Flow & Trophic Levels | Scivra Middle School Biology",
  seoKeywords: [
    "food web dynamics simulation middle school",
    "energy flow trophic levels interactive",
    "ecosystem food web 6-8 biology",
    "trophic cascade simulation",
    "NGSS MS-LS2-3 MS-LS2-4 ecology",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Food Web Dynamics and Energy Flow in Ecosystems",
  },
  contentSections: {
    whatIsIt:
      "A food web is a diagram of who eats whom in an ecosystem. Unlike a simple food chain with a single path, a real food web shows all the overlapping feeding relationships — most animals eat more than one thing, and most organisms are eaten by more than one predator. Energy enters the web through producers: plants and algae that capture sunlight via photosynthesis. Primary consumers (herbivores) eat the producers, secondary consumers eat the herbivores, and so on up to top predators. At each step, roughly 90% of the energy is lost as heat, which is why you always find far more producers than predators in any healthy ecosystem. This energy loss creates the biomass pyramid: a wide base of producers supporting progressively fewer and fewer animals at higher levels. The simulation lets you choose different ecosystem types, experiment with different energy transfer rates, and remove species to trigger trophic cascades — chain reactions that ripple through every level of the web when one species disappears.",
    parameterExplanations: {
      ecosystemType:
        "Selects which ecosystem the food web represents: 0 = Forest (trees, deer, wolves, and woodland species), 1 = Ocean (phytoplankton, zooplankton, fish, and marine predators), 2 = Grassland (grasses, insects, small mammals, and grassland predators). Each ecosystem has different species in its web and different typical energy flows, but the underlying principles of energy loss and trophic cascades apply in all three.",
      speciesRemoved:
        "Controls which species is removed from the food web to trigger a cascade: 0 = None (baseline web intact), 1 = Top Predator removed, 2 = Mid-level Consumer removed, 3 = Producer removed. Removing the top predator often causes mid-level consumers to overpopulate and overgraze. Removing a mid-level consumer can send effects both up and down the web. Removing producers collapses the energy base for all consumers.",
      energyTransfer:
        "The percentage of energy passed from one trophic level to the next, adjustable from 5% to 20% with 10% as the default. In most real ecosystems energy transfer is typically around 10%, but it varies by ecosystem and organism type. Higher values mean more energy reaches top predators, which can support larger populations at each level. Lower values mean predators need much larger territories and prey populations to survive.",
    },
    misconceptions: [
      {
        wrong: "Removing one species from a food web only affects the species that ate it.",
        correct:
          "Removing a species from a food web typically triggers a trophic cascade — effects ripple both up and down the web. Removing a mid-level consumer, for example, can cause the prey below it to multiply (more food available) while the predators above it decline (less food available). In real ecosystems these effects sometimes travel through four or five trophic levels before stabilizing.",
      },
      {
        wrong: "The 10% rule means exactly one-tenth of the energy transfers perfectly at every step.",
        correct:
          "Ten percent is a useful approximation that varies in real ecosystems — it can range from about 5% to 20% depending on the organisms and environment involved. The slider in this simulation lets you explore that range. The key concept is that energy is always lost at each step, not that the fraction is precisely 10% in every case.",
      },
      {
        wrong: "Top predators are the most important species in a food web because they are at the top.",
        correct:
          "All levels are important, and in many ways producers are the most critical because they are the only source of new energy in the system. Removing producers collapses the entire web. Top predators often have an outsized effect on ecosystem structure (keystone predator effect), but a food web cannot exist without its producer base, no matter how many predators are present.",
      },
      {
        wrong: "Ocean food webs work differently from land food webs.",
        correct:
          "The same fundamental principles apply in all ecosystems: energy flows from producers to consumers, roughly 10% transfers at each step, and removing species triggers cascades. The specific organisms differ — phytoplankton replace grasses, zooplankton replace insects — but the structural rules are the same. This is why ecologists can apply the same models across very different biomes.",
      },
    ],
    teacherUseCases: [
      "Set ecosystemType to 0 (Forest), energyTransfer to 10, and speciesRemoved to 0. Have students draw the food web on paper, then predict which species is most vulnerable before using speciesRemoved to test each removal.",
      "Set ecosystemType to 2 (Grassland) and energyTransfer to 10. Remove the top predator (speciesRemoved 1) and ask students to trace the cascade down through the web. Then restore it and remove the producer (speciesRemoved 3) to compare which removal is more destabilizing.",
      "Use energyTransfer as a class discussion tool: set it to 5% and ask how that changes the maximum number of trophic levels the ecosystem can support, then switch to 20% and repeat. Students should recognize that higher efficiency allows longer food chains.",
      "Compare ecosystems by cycling through ecosystemType 0, 1, and 2 with all other parameters equal. Ask students to identify which ecosystem appears most vulnerable to species removal and develop a hypothesis about why biodiversity or web complexity might increase resilience.",
      "Have students work in pairs: one predicts the effect of speciesRemoved 2 (mid consumer) in writing before the simulation runs, the other records what actually happens. Compare predictions to outcomes and discuss where their mental models of energy flow were accurate or off.",
    ],
    faq: [
      {
        question: "What is the difference between a food chain and a food web?",
        answer:
          "A food chain is a single linear sequence of who eats whom — grass to grasshopper to frog to snake to hawk. A food web shows all the interconnected feeding relationships in an ecosystem at once. Most real organisms eat multiple food sources and have multiple predators, so a food web is a much more accurate representation of how energy actually flows through an ecosystem. Food chains are simpler and easier to analyze mathematically, which is why they appear in textbooks, but food webs are closer to ecological reality.",
      },
      {
        question: "Why do ecosystems with more biodiversity tend to be more stable?",
        answer:
          "Higher biodiversity means more species at each trophic level and more connections in the food web. If one species disappears, other species can often fill its role — predators have alternative prey, and herbivores have alternative plants to eat. A food web with few species and few connections is more fragile: losing one species can disconnect large parts of the web. This is why conservation biologists often focus on protecting entire ecosystems and their biodiversity rather than single species in isolation.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports MS-LS2-3 (develop a model to describe the cycling of matter and flow of energy among living and nonliving parts of an ecosystem) and MS-LS2-4 (construct an argument supported by empirical evidence that changes to physical or biological components of an ecosystem affect populations). The energy transfer slider and species removal feature directly model energy flow dynamics and cascade effects described in these standards.",
      },
      {
        question: "How does energy transfer efficiency affect the number of trophic levels?",
        answer:
          "With 10% efficiency, energy drops by a factor of 10 at each level. Starting with 10,000 kJ in producers, herbivores get roughly 1,000 kJ, secondary consumers get 100 kJ, and tertiary consumers get only 10 kJ. By four or five levels, there simply is not enough energy left to support a breeding population of top predators. If efficiency were higher — say 20% — each level retains more energy and longer food chains become mathematically possible. Adjusting the energyTransfer slider lets you see this relationship directly.",
      },
      {
        question: "What is a keystone species?",
        answer:
          "A keystone species has a disproportionately large effect on its ecosystem relative to its abundance — like a keystone in an arch that holds the whole structure together. Sea otters are a classic example: they eat sea urchins, which eat kelp. Without otters, urchins multiply and demolish kelp forests, destroying habitat for hundreds of other species. The simulation shows a version of this dynamic when you remove the top predator: the cascading effects reveal which species may be playing a keystone role in the selected ecosystem.",
      },
    ],
  },
};
