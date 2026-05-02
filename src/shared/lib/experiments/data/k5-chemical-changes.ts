import type { Experiment } from "@/shared/types/experiment";

export const k5ChemicalChanges: Experiment = {
  id: "k5-chemical-changes",
  slug: "k5-chemical-changes",
  title: "Chemical Changes",
  subtitle: "Observe signs of chemical reactions: color, gas, temperature, and precipitate",
  description:
    "Discover the signs of chemical changes through fun virtual experiments! Mix different substances and watch for color changes, gas bubbles, temperature shifts, and precipitate formation. Learn the difference between physical and chemical changes by comparing results.",
  thumbnail: "/imgs/experiments/k5-chemical-changes.png",

  standards: {
    ngss: ["5-PS1-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "3-5",
  tags: ["chemical changes", "chemical reactions", "color change", "gas bubbles", "K5 science"],
  difficulty: "beginner",

  parameters: [
    { id: "reactionRate", label: "Reaction Rate", unit: "%", min: 1, max: 100, default: 50, step: 1, tier: "free" },
    { id: "temperature", label: "Temperature", unit: "°C", min: 0, max: 100, default: 25, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "\\text{Reactants} \\rightarrow \\text{Products}", description: "In a chemical change, starting substances transform into new substances" },
  ],

  theory: "A chemical change creates new substances with different properties. Signs include: color change, gas production (bubbles), temperature change (hot or cold), precipitate formation, and light/sound emission. Unlike physical changes (cutting, melting, dissolving), chemical changes are usually difficult to reverse. Examples: baking soda + vinegar produces carbon dioxide gas; iron + oxygen produces rust.",

  instructions: "Use the Reaction Rate slider to make the change happen slowly or quickly, and use the Temperature slider to cool or warm the reaction. Try Combustion, Rust, and Vinegar + Baking Soda Fizz presets to compare different clues that show new substances are forming.",

  challenges: [
    { id: "k5cc-c1", question: "What happens when you mix vinegar and baking soda?", hint: "Fizzy bubbles appear! The gas is carbon dioxide (CO₂) — this is a chemical change.", tier: "free" },
    { id: "k5cc-c2", question: "Is dissolving sugar in water a chemical or physical change?", hint: "Physical change — the sugar is still sugar, just dissolved. You can get it back by evaporating the water.", tier: "free" },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-states-of-matter", "k5-mixtures-solutions"],
  htmlPath: "/experiments/elementary/k5-chemical-changes.html",

  seoTitle: "Chemical Changes for Kids | Scivra Elementary Science",
  seoKeywords: ["chemical changes for kids", "chemical reactions elementary", "signs of chemical change", "K5 science experiment"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Elementary School", teaches: "Chemical Changes and Reactions" },
  htmlControlAliases: { reactionRate: "rateSlider", temperature: "tempSlider" },
  presets: [
    {
      id: "combustion",
      label: "Combustion (CH₄ burning)",
      description:
        "Combustion is a fast chemical change where methane burns and makes new substances, including carbon dioxide and water. Students can look for strong clues such as heat, light, and gas production.",
      paramValues: { reactionRate: 95, temperature: 90 },
    },
    {
      id: "rust",
      label: "Iron Rusting",
      description:
        "Rusting is a slower chemical change where iron reacts with oxygen and water to make reddish-brown rust. It helps students compare quick reactions with changes that can happen over days or weeks.",
      paramValues: { reactionRate: 15, temperature: 25 },
    },
    {
      id: "fizz",
      label: "Vinegar + Baking Soda Fizz",
      description:
        "This preset shows a familiar bubbling reaction where vinegar and baking soda make carbon dioxide gas. Students can use the bubbles and temperature change as evidence that new substances formed.",
      paramValues: { reactionRate: 60, temperature: 25 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Did you ever mix baking soda and vinegar and watch it fizz and bubble like crazy? That fizzing is a chemical change! A chemical change happens when one or more substances change or react to form something brand new — something that was not there before. Mixing is one common way this can happen, but heating, burning, or breaking apart a single substance can also cause a chemical change. The new stuff has different properties than what you started with. Sometimes you can tell a chemical change is happening because you see bubbles, or the color changes, or the mixture gets warm or cold, or a solid chunk forms that was not there before. A physical change is different — the substance stays the same thing, just in a new shape or form. Cutting paper into tiny pieces is a physical change: it is still paper. Burning paper is a chemical change: you get ash and smoke, which are completely new substances. In this simulation you can mix different substances and look for the clues that tell you whether a chemical change happened.",
    parameterExplanations: {
      reactionRate:
        "Reaction Rate means how quickly the chemical change happens. A low rate is like slow rusting: you may need to watch carefully because the evidence appears little by little. A high rate is like combustion or vinegar and baking soda fizzing: bubbles, heat, or color changes can show up quickly. Try the Rust preset first, then move the Reaction Rate slider higher and compare it with the Combustion and Fizz presets. Scientists often compare slow and fast reactions to understand what clues are easiest to observe.",
      temperature:
        "Temperature tells how warm or cool the reaction is. Many chemical changes happen faster or show stronger clues when the temperature is higher, because the tiny particles are moving and bumping into each other more. Cooler temperatures can make a reaction look slower or gentler. Try keeping Reaction Rate the same while changing only Temperature, then compare the Rust, Combustion, and Fizz presets. Watch for evidence such as warming, bubbles, light, or color change, and ask whether the change made a new substance.",
    },
    misconceptions: [
      {
        wrong: "If something dissolves, that is a chemical change because it disappears.",
        correct:
          "Dissolving is a physical change, not a chemical change. When you stir sugar into water, the sugar breaks into tiny pieces too small to see, but it is still sugar — it has not turned into something new. You can get the sugar back by boiling away the water. Because the sugar can be recovered and has not changed into a different substance, dissolving is a physical change. In a known-safe kitchen example like lemonade you could taste the sweetness, but in science class use evaporation or observation to verify the substance is still present.",
      },
      {
        wrong: "Bubbles always mean a chemical change is happening.",
        correct:
          "Bubbles can appear for physical reasons too. When you heat water, dissolved air comes out and forms bubbles before the water even boils — and that is a physical change. Bubbles are a clue to look for, but you need other signs too, like a color change or a new smell, to be sure it is a chemical change. When vinegar and baking soda bubble, they produce carbon dioxide gas — a new substance — so those bubbles do signal a chemical change.",
      },
      {
        wrong: "Chemical changes can always be reversed.",
        correct:
          "Chemical changes are usually hard or impossible to reverse. Once vinegar and baking soda react to make carbon dioxide, water, and salt, you cannot easily get the vinegar and baking soda back. Once a piece of paper burns to ash, you cannot un-burn it. Physical changes, like melting ice into water, are easier to reverse — just freeze the water again. This is one of the key differences between chemical and physical changes.",
      },
      {
        wrong: "A color change always means a chemical reaction happened.",
        correct:
          "Adding food coloring to water changes the color, but no new substance is made — the dye just mixes in. That is a physical change. A true chemical color change happens when the substance itself transforms, like when a copper penny turns green from reacting with air over time, making a new green compound on its surface. Context matters: ask whether the color change came from mixing in a dye or from the substance itself changing.",
      },
    ],
    teacherUseCases: [
      "Start with the Fizz preset and have students identify evidence such as bubbles and temperature change, then connect their observations to NGSS 5-PS1-4 by explaining that new substances formed.",
      "Use the Rust preset with a low Reaction Rate, then ask students why some chemical changes are harder to notice right away even when a new substance is forming.",
      "Use the Combustion preset to compare a high-temperature, fast reaction with the slower Rust preset, focusing on how heat, light, and gas can be evidence of chemical change.",
      "Have students keep Temperature constant while changing only the Reaction Rate slider, then record which signs appear quickly and which require more careful observation.",
      "Run a quick CER activity where students choose one preset, cite Reaction Rate and Temperature values as evidence, and claim whether the observed change supports NGSS 5-PS1-4.",
    ],
    faq: [
      {
        question: "How can I tell if a chemical change happened?",
        answer:
          "Scientists look for five main clues: new bubbles or gas forming, a color change in the substance itself (not just added dye), the mixture getting noticeably warmer or colder, a new solid forming where there was only liquid before, or a new smell appearing. Seeing one clue is interesting; seeing two or more at the same time makes scientists more confident a chemical change occurred. Always look at the indicator panel in this simulation — it lights up each clue that appears. In real labs, scientists record these observations carefully before deciding whether a chemical change happened. This connects to the NGSS standard 5-PS1-4 about conducting investigations to identify the distinction between chemical and physical change.",
      },
      {
        question: "Why can you not un-mix baking soda and vinegar after they react?",
        answer:
          "When baking soda and vinegar combine, they do not just blend together the way paint colors mix. They actually react and build brand new substances: carbon dioxide gas (the bubbles), water, and a type of salt. The original baking soda and vinegar are used up in making these new things. Because you have new substances with different properties, there is no simple way to separate them back into baking soda and vinegar, just like you cannot un-bake a cake back into flour and eggs. This is what makes chemical changes different from physical changes.",
      },
      {
        question: "Is melting ice a chemical change or a physical change?",
        answer:
          "Melting ice is a physical change. When ice melts into liquid water, it changes form but it is still water — the same tiny water particles, just moving around more freely instead of locked in a solid shape. You can freeze the liquid water again and get ice back. No new substance is made. Compare that to burning wood: the wood turns into ash, smoke, and gases — completely different substances you cannot turn back into wood. Any time you can reverse a change and get the original substance back, it is almost certainly a physical change.",
      },
      {
        question: "Which NGSS standard does this experiment address?",
        answer:
          "This simulation directly supports 5-PS1-4, which asks students to conduct an investigation to determine whether the mixing of two or more substances results in new substances. Students gather evidence by observing signs such as color change, gas production, temperature change, and precipitate formation — exactly what the indicator panel in this simulation shows. The activity also connects to the crosscutting concept of cause and effect, helping students link what they mix (cause) to the observable signs of change (effect).",
      },
      {
        question: "What is the difference between a chemical change and a physical change?",
        answer:
          "A physical change changes the shape, size, or state of a substance but does not make a new substance. Examples include cutting paper, melting butter, or dissolving sugar in water — you can usually reverse these changes and get the original substance back. A chemical change creates one or more new substances with different properties. Examples include baking a cake (flour and eggs become something totally different), rusting iron (iron combines with oxygen to make rust), and mixing vinegar and baking soda (they produce carbon dioxide gas and water). The big question to ask is: do I have the same substance I started with, just in a different form? If yes, it is physical. If something genuinely new appeared, it is chemical.",
      },
      {
        question: "Is rusting the same kind of change as mixing vinegar and baking soda?",
        answer:
          "Yes, both are chemical changes! When iron rusts, it reacts with oxygen and water in the air to form a reddish-brown substance called iron oxide — that is genuinely new stuff with different properties from the original iron. The iron is harder and stronger; rust is crumbly and weak. When vinegar and baking soda react, new substances form quickly and you can see the bubbles right away. Rusting is much slower — it takes days or weeks — but the result is the same idea: new substances are created that you did not have before, and you cannot easily get the original iron or baking soda back.",
      },
    ],
  },
};
