import type { Experiment } from "@/shared/types/experiment";

export const k5MixturesSolutions: Experiment = {
  id: "k5-mixtures-solutions",
  slug: "k5-mixtures-solutions",
  title: "Mixtures & Solutions",
  subtitle: "Separate mixtures and dissolve solutes to explore solubility",
  description:
    "Explore the world of mixtures and solutions! Choose different substances and water temperatures to see what dissolves and what doesn't. Learn to tell mixtures apart from solutions by filtering, evaporating, and observing. Discover why hot water dissolves sugar faster than cold water.",
  thumbnail: "/imgs/experiments/k5-mixtures-solutions.png",
  standards: { ngss: ["5-PS1-3"], gcse: [], ap: [] },
  primaryStandard: "elementary-k5",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "3-5",
  tags: ["mixtures", "solutions", "solubility", "dissolving", "K5 science"],
  difficulty: "beginner",
  parameters: [
    { id: "concentration", label: "Concentration", unit: "%", min: 0, max: 100, default: 50, step: 1, tier: "free" },
    { id: "waterTemp", label: "Water Temperature", unit: "°C", min: 0, max: 100, default: 25, step: 1, tier: "free" }
  ],
  formulas: [{ latex: "\\text{Solubility} \\propto \\text{Temperature}", description: "Most solid substances dissolve more easily in warmer water" }],
  theory: "A mixture is made of two or more substances combined together, but each substance keeps its own properties. A solution is a special mixture where one substance (the solute) dissolves completely in another (the solvent) so you cannot see the separate parts. Salt water is a solution — the salt disappears into the water. Sand in water is a mixture — you can still see the grains. Temperature affects solubility: warmer water usually dissolves more solute because the water molecules move faster and break apart the solute more quickly.",
  instructions: "Use the Concentration slider to change how much solute is added, and use the Water Temperature slider to warm or cool the water. Try the Dilute, Saturated, and Super-saturated presets to compare how clear solutions, full solutions, and crystal-forming mixtures behave.",
  challenges: [
    { id: "k5ms-c1", question: "Which substance does NOT dissolve in water?", hint: "Sand stays at the bottom — it is insoluble. You can separate it by filtering.", tier: "free" },
    { id: "k5ms-c2", question: "Does sugar dissolve faster in hot or cold water?", hint: "Hot water! Higher temperature makes water molecules move faster, breaking sugar apart more quickly.", tier: "free" }
  ],
  wave: 11,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-chemical-changes", "k5-states-of-matter"],
  htmlPath: "/experiments/elementary/k5-mixtures-solutions.html",
  seoTitle: "Mixtures & Solutions for Kids | Scivra Elementary Science",
  seoKeywords: ["mixtures and solutions for kids", "solubility experiment elementary", "dissolving substances K5", "K5 science experiment"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Elementary School", teaches: "Mixtures, Solutions, and Solubility" },
  htmlControlAliases: { concentration: "sliderConc", waterTemp: "sliderTemp" },
  presets: [
    { id: "dilute", label: "Dilute", description: "A dilute solution has only a small amount of solute mixed into the water. The particles spread out easily, so the liquid usually stays clear." },
    { id: "saturated", label: "Saturated", description: "A saturated solution is holding about as much solute as it can at that temperature. Adding more may leave extra solid behind instead of dissolving." },
    { id: "super", label: "Super-saturated", description: "A super-saturated solution has more dissolved solute than usual, often because warm water dissolved extra material. It can be unstable and may form crystals when disturbed or cooled." }
  ],
  contentSections: {
    whatIsIt:
      "Have you ever stirred sugar into lemonade and watched it disappear? Or tried to mix sand into water and seen it settle at the bottom? You just made two very different things — a solution and a mixture! A mixture is when you put two or more things together but each thing keeps its own look and properties. A salad is a mixture — you can still see the lettuce, tomatoes, and croutons as separate pieces. A solution is a special kind of mixture where one thing (like salt or sugar) breaks apart into such tiny, tiny pieces that it becomes invisible — no longer visible because its particles spread evenly through the water. Salt water is a solution — the salt is no longer visible, but it is still there. You could detect it in known-safe food examples, but in science class use evaporation to show it is still present. Some things dissolve (break apart and mix in) and some things do not. Sand does not dissolve in water — it just sinks. Temperature matters too. Hot water usually dissolves things faster than cold water, because the warm water molecules move around more quickly and help break things apart. This is why hot chocolate powder mixes in faster with hot milk than cold milk!",
    parameterExplanations: {
      concentration:
        "Concentration means how much solute is mixed into the water compared with the amount of water. A low concentration is like a tiny spoonful of sugar in a big cup: the particles have lots of room to spread out, so the solution looks clear. A high concentration adds more solute, and the water may not be able to hold it all. Then you may see extra material or crystals. Use the Dilute preset to start with less solute, Saturated to see water that is almost full, and Super-saturated to explore what happens when there may be too much dissolved material.",
      waterTemp:
        "Water Temperature changes how fast the water particles move. Cold water particles move more slowly, so they usually pull solute particles apart more slowly. Warm or hot water particles move faster and bump into the solute more often, which can help more solid dissolve. Try keeping the Concentration slider the same while changing only Water Temperature. Then compare the presets: a saturated solution may look different in cool water than in warm water. This helps you use observations and measurements, like temperature and amount dissolved, to describe a material's properties.",
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
      "Have students set the Dilute preset, record the Concentration and Water Temperature values, and describe visible properties of the solution to support NGSS 5-PS1-3 observation practice.",
      "Ask pairs to keep Water Temperature constant while moving the Concentration slider from low to high, then compare when the mixture changes from clear to cloudy or crystal-forming.",
      "Use the Saturated preset to discuss how solubility is a material property, then have students collect evidence by changing only the Water Temperature slider.",
      "Use the Super-saturated preset as a prediction activity: students explain what they expect to observe, then connect crystals or undissolved material to measurements and material properties.",
      "Run a quick CER activity where students choose Dilute, Saturated, or Super-saturated, cite slider values as evidence, and claim whether the sample is a solution or a visible mixture.",
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
