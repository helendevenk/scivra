import type { Experiment } from "@/shared/types/experiment";

export const k5MixturesSolutions: Experiment = {
  id: "k5-mixtures-solutions",
  slug: "k5-mixtures-solutions",
  title: "Mixtures & Solutions",
  subtitle: "Separate mixtures and dissolve solutes to explore solubility",
  description:
    "Explore the world of mixtures and solutions! Choose different substances and water temperatures to see what dissolves and what doesn't. Learn to tell mixtures apart from solutions by filtering, evaporating, and observing. Discover why hot water dissolves sugar faster than cold water.",
  thumbnail: "/imgs/experiments/k5-mixtures-solutions.png",

  standards: {
    ngss: ["5-PS1-3"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "3-5",
  tags: ["mixtures", "solutions", "solubility", "dissolving", "K5 science"],
  difficulty: "beginner",

  parameters: [
    { id: "substanceType", label: "Substance (0=Salt 1=Sugar 2=Sand 3=Baking Soda)", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
    { id: "waterTemp", label: "Water Temperature (°C)", unit: "°C", min: 10, max: 80, default: 25, step: 5, tier: "free" },
  ],

  formulas: [
    { latex: "\\text{Solubility} \\propto \\text{Temperature}", description: "Most solid substances dissolve more easily in warmer water" },
  ],

  theory: "A mixture is made of two or more substances combined together, but each substance keeps its own properties. A solution is a special mixture where one substance (the solute) dissolves completely in another (the solvent) so you cannot see the separate parts. Salt water is a solution — the salt disappears into the water. Sand in water is a mixture — you can still see the grains. Temperature affects solubility: warmer water usually dissolves more solute because the water molecules move faster and break apart the solute more quickly.",

  instructions: "Pick a substance and set the water temperature, then press Mix! Watch whether the substance dissolves to form a clear solution or stays visible as a mixture. Try filtering or evaporating to recover the substance. Compare results at different temperatures to discover the solubility pattern.",

  challenges: [
    { id: "k5ms-c1", question: "Which substance does NOT dissolve in water?", hint: "Sand stays at the bottom — it is insoluble. You can separate it by filtering.", tier: "free" },
    { id: "k5ms-c2", question: "Does sugar dissolve faster in hot or cold water?", hint: "Hot water! Higher temperature makes water molecules move faster, breaking sugar apart more quickly.", tier: "free" },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-chemical-changes", "k5-states-of-matter"],
  htmlPath: "/experiments/elementary/k5-mixtures-solutions.html",

  seoTitle: "Mixtures & Solutions for Kids | Scivra Elementary Science",
  seoKeywords: ["mixtures and solutions for kids", "solubility experiment elementary", "dissolving substances K5", "K5 science experiment"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Elementary School", teaches: "Mixtures, Solutions, and Solubility" },
  contentSections: {
    whatIsIt:
      "Have you ever stirred sugar into lemonade and watched it disappear? Or tried to mix sand into water and seen it settle at the bottom? You just made two very different things — a solution and a mixture! A mixture is when you put two or more things together but each thing keeps its own look and properties. A salad is a mixture — you can still see the lettuce, tomatoes, and croutons as separate pieces. A solution is a special kind of mixture where one thing (like salt or sugar) breaks apart into such tiny, tiny pieces that it becomes invisible — no longer visible because its particles spread evenly through the water. Salt water is a solution — the salt is no longer visible, but it is still there. You could detect it in known-safe food examples, but in science class use evaporation to show it is still present. Some things dissolve (break apart and mix in) and some things do not. Sand does not dissolve in water — it just sinks. Temperature matters too. Hot water usually dissolves things faster than cold water, because the warm water molecules move around more quickly and help break things apart. This is why hot chocolate powder mixes in faster with hot milk than cold milk!",
    parameterExplanations: {
      substanceType:
        "This control lets you pick what you are mixing into water. Setting 0 is salt — it dissolves completely and makes a clear solution, just like ocean water. Setting 1 is sugar — it also dissolves to make a sweet, clear solution, like Kool-Aid or lemonade. Setting 2 is sand — it does NOT dissolve and sinks to the bottom, making a true mixture that you can filter to get the sand back. Setting 3 is baking soda — it dissolves in water much like salt. Try each one and notice which ones become invisible (dissolved) and which ones stay visible.",
      waterTemp:
        "This slider changes how warm or cool the water is, from 10°C (cold, like refrigerator water) all the way up to 80°C (very hot water — unsafe to touch; only adults or teachers should handle water this hot). Warmer water usually dissolves things faster because the water molecules have more energy and bump into the substance more often, breaking it apart more quickly. Try the same substance at cold vs. hot temperatures and watch what changes.",
    },
    misconceptions: [
      {
        wrong: "If you cannot see something in water, it has disappeared forever.",
        correct:
          "When salt or sugar dissolves in water, it breaks into pieces so tiny you cannot see them — but the substance is still there! You can prove it by boiling the water away and watching the solid reappear. In a known-safe food example like ocean water or lemonade, you could taste the salt or sweetness, but in science class use evaporation or observation as your evidence. When the water evaporates, the salt or sugar reappears as a solid. Dissolving is a physical change, not a chemical one — nothing new is created and nothing is destroyed.",
      },
      {
        wrong: "Everything will eventually dissolve if you wait long enough.",
        correct:
          "Some substances like sand, rocks, and plastic are insoluble in water — they will never dissolve no matter how long you wait or how hard you stir. Insoluble means the molecules of that substance are held together too tightly for water to pull apart. Filtering is one way to separate an insoluble substance from water. Only soluble substances like salt, sugar, and baking soda will dissolve.",
      },
      {
        wrong: "A solution and a mixture are the same thing.",
        correct:
          "All solutions are mixtures, but not all mixtures are solutions! A solution is a very special, even mixture where one substance dissolves completely so you cannot see the separate parts. A mixture (like sand in water or a salad) still shows the separate pieces. The key difference is whether the substance dissolves — breaks into invisible particles — or stays visible.",
      },
      {
        wrong: "Hot water always helps things dissolve faster and in greater amounts.",
        correct:
          "Hot water usually speeds up dissolving for solid substances like salt and sugar, and often lets more dissolve. However, gases behave the opposite way — warm water holds less dissolved gas than cold water. That is why a cold soda stays bubbly longer than a warm one. For this simulation we focus on solid substances, where warmer usually does mean more and faster dissolving.",
      },
    ],
    teacherUseCases: [
      "Soluble vs. insoluble sort: run substanceType through all four options at waterTemp 25°C. Students predict, observe, and sort into 'dissolves' and 'does not dissolve' columns — building NGSS 5-PS1-3 evidence.",
      "Temperature investigation: fix substanceType at 0 (salt) and compare waterTemp 10°C vs. 60°C. Students time how quickly the salt becomes invisible (dissolves) and record findings in a simple data table.",
      "Filtration challenge: after mixing sand (substanceType 2), discuss how you could get the sand back — introduce the idea of filtering. Connect to real-world water treatment plants that filter water to remove solid particles.",
      "Evaporation recovery: after dissolving salt (substanceType 0), ask 'where did the salt go?' Discuss what would happen if you let the water dry up — relate to salt flats and ocean evaporation leaving salt behind.",
      "Kool-Aid connection: use substanceType 1 (sugar) at different temperatures to model why stirring cold vs. warm drinks matters. Students connect lab results to everyday kitchen experiences.",
    ],
    faq: [
      {
        question: "How can I tell if something is a solution or a mixture?",
        answer:
          "Look carefully at the liquid after mixing. If the substance disappears completely and the liquid looks clear and even all the way through, it is probably a solution — the substance dissolved. If you can still see pieces floating, sinking, or clumping, it is a mixture. Another test is to filter it: pour it through a coffee filter or cloth. A dissolved substance will pass right through (you cannot filter out salt from salt water), but an undissolved solid like sand will get caught in the filter. Appearance plus the filter test together give you strong evidence.",
      },
      {
        question: "Why does sugar disappear when you put it in water?",
        answer:
          "Sugar is made of molecules that water molecules really like to grab onto. When you put sugar in water, the water molecules surround each tiny sugar crystal, pull individual sugar molecules away from the crystal, and spread them out evenly through the whole liquid. The sugar pieces become so small and spread out that light passes right through without bouncing off them — that is why you can no longer see them. The sugar is still there, just broken into invisible-tiny pieces evenly mixed throughout the water. You can prove it is still there by evaporating the water and watching the crystals reappear. In a known-safe kitchen example like lemonade, you could taste the sweetness, but in science class use evaporation or observation as your evidence.",
      },
      {
        question: "Which NGSS standard does this experiment support?",
        answer:
          "This simulation directly supports NGSS 5-PS1-3: make observations and measurements to identify materials based on their properties. Solubility — whether and how well a substance dissolves in water — is a key physical property used to identify and separate materials. Students observe and compare how salt, sugar, sand, and baking soda behave in water at different temperatures, gathering evidence that different substances have different and characteristic solubility properties that can be used to identify them.",
      },
      {
        question: "Can you get the dissolved substance back?",
        answer:
          "Yes! Because dissolving is a physical change (not a chemical one), you can get the substance back. One way is evaporation — heat the solution until all the water turns to vapor and escapes, leaving the solid behind. That is how sea salt is made from ocean water in salt flats around the world. Another way is to cool a hot, fully-saturated solution — sometimes the substance will crystallize back out as it cools. This is how rock candy is made! Insoluble substances like sand are even easier to recover — just filter or let them settle and pour off the water.",
      },
      {
        question: "Why does warm water dissolve things faster?",
        answer:
          "Water is made of tiny molecules that are always moving and bumping into things. When water is warm, those molecules have more energy and move around much faster — they bump into the substance being dissolved more often and with more force. All those energetic bumps help break apart the solid substance and carry the pieces away into the liquid more quickly. Think of it like a crowd of people trying to break up a stack of blocks: a very energetic, fast-moving crowd will knock the blocks apart much faster than a slow, lazy crowd. Cold water molecules are the slow crowd; hot water molecules are the fast crowd.",
      },
    ],
  },
};
