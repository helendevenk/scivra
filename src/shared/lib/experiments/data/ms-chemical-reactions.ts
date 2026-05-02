import type { Experiment } from "@/shared/types/experiment";

export const msChemicalReactions: Experiment = {
  id: "ms-chemical-reactions",
  slug: "ms-chemical-reactions",
  title: "Chemical Reactions",
  subtitle: "Reactants, products, conservation of mass, and energy changes",
  description:
    "Mix chemicals and watch reactions happen at the molecular level. Balance chemical equations and verify the Law of Conservation of Mass. Classify reactions as exothermic or endothermic. See atoms rearranging — bonds breaking and forming.",
  thumbnail: "/imgs/experiments/ms-chemical-reactions.png",

  standards: {
    ngss: ["MS-PS1-2", "MS-PS1-5", "HS-PS1-7"],
    gcse: ["C3.1", "C3.2"],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "6-8",
  tags: ["chemical reactions", "conservation of mass", "exothermic", "endothermic", "balancing equations", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "reactionType",
      label: "Reaction (0=Combustion, 1=Synthesis, 2=Decomposition, 3=Single Displacement)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "temperature",
      label: "Temperature",
      unit: "°C",
      min: 20,
      max: 500,
      default: 25,
      step: 10,
      tier: "free",
    },
    {
      id: "concentration",
      label: "Reactant Concentration",
      unit: "mol/L",
      min: 0.1,
      max: 2.0,
      default: 1.0,
      step: 0.1,
      tier: "free",
    },
    {
      id: "catalyst",
      label: "Add Catalyst (0=No, 1=Yes)",
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
      latex: "\\text{Reactants} \\to \\text{Products} \\quad (\\text{atoms conserved})",
      description: "Law of Conservation of Mass: atoms are rearranged, never created/destroyed",
    },
    {
      latex: "\\text{CH}_4 + 2\\text{O}_2 \\to \\text{CO}_2 + 2\\text{H}_2\\text{O} \\quad \\Delta H = -890\\,\\text{kJ}",
      description: "Methane combustion: balanced equation with energy released",
    },
  ],

  theory:
    "A chemical reaction transforms reactants (starting materials) into products (ending materials) by breaking and forming chemical bonds. The atoms themselves are never created or destroyed — they just rearrange. This is the Law of Conservation of Mass: mass of reactants = mass of products. Reactions are classified by type: synthesis (A+B→AB), decomposition (AB→A+B), single displacement (A+BC→AC+B), double displacement (AB+CD→AD+CB), and combustion (fuel+O₂→CO₂+H₂O+heat). Energy changes: exothermic reactions release heat (ΔH<0), endothermic reactions absorb heat (ΔH>0). Reaction rate increases with temperature, concentration, surface area, and catalysts. A catalyst speeds up a reaction without being consumed.",

  instructions:
    "Select a reaction type and press Play to watch atoms rearrange. The molecular model shows bonds breaking and forming. Check the mass balance — left side should equal right side. Increase temperature to speed up the reaction. Add a catalyst (Pro) to lower activation energy and dramatically increase rate.",

  challenges: [
    {
      id: "cr-ms-c1",
      question: "Balance: H₂ + O₂ → H₂O. How many molecules of each substance are needed?",
      hint: "2H₂ + O₂ → 2H₂O. Left side: 4H + 2O. Right side: 4H + 2O. ✓ Balanced. You need 2 hydrogen molecules and 1 oxygen molecule to make 2 water molecules.",
      tier: "free",
    },
    {
      id: "cr-ms-c2",
      question: "If 32 g of sulfur reacts completely with oxygen, how many grams of sulfur dioxide can form?",
      hint: "Conservation of mass: S + O₂ → SO₂. 32 g S + 32 g O₂ = 64 g SO₂. Total mass is conserved.",
      tier: "free",
    },
    {
      id: "cr-ms-c3",
      question: "Is photosynthesis exothermic or endothermic? What about cellular respiration?",
      hint: "Photosynthesis: endothermic (absorbs light energy to build glucose — ΔH>0). Cellular respiration: exothermic (releases energy from glucose — ΔH<0). They are essentially reverse reactions!",
      tier: "free",
    },
    {
      id: "cr-ms-c4",
      question: "How does a catalyst increase reaction rate without being consumed in the reaction?",
      hint: "A catalyst provides an alternative reaction pathway with lower activation energy. More reactant molecules have enough energy to react (from the Maxwell-Boltzmann distribution). The catalyst participates temporarily in the reaction but is regenerated at the end — it's not consumed.",
      tier: "pro",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 14,
  relatedExperiments: ["ms-atoms-molecules", "thermochemistry", "reaction-kinetics"],

  seoTitle: "Chemical Reactions Middle School | Scivra Interactive Chemistry",
  seoKeywords: [
    "chemical reactions middle school simulation",
    "conservation of mass interactive",
    "balancing equations simulation 6-8",
    "exothermic endothermic reactions",
    "molecular model chemical reaction",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Chemical Reactions and Conservation of Mass",
  },
  contentSections: {
    whatIsIt:
      "A chemical reaction is one of the most fundamental events in nature: atoms that were bonded in one arrangement break apart and reconnect in a completely new arrangement, forming substances with entirely different properties. When wood burns in a campfire, the carbon and hydrogen in the wood combine with oxygen from the air to produce carbon dioxide, water vapor, and light — a combustion reaction. The wood and oxygen are reactants; the CO2 and water are products. One of the most powerful ideas in science is that no atoms are created or destroyed during this process — they are only rearranged. This is the Law of Conservation of Mass, and it is why balanced chemical equations have equal numbers of each type of atom on both sides. This simulation shows four important reaction types at the molecular level: combustion, synthesis, decomposition, and single displacement. You can control temperature, reactant concentration, and — for Pro users — add a catalyst to see how reaction speed changes without changing the final outcome.",
    parameterExplanations: {
      reactionType:
        "Selects the reaction type to simulate (0=Combustion, 1=Synthesis, 2=Decomposition, 3=Single Displacement). Combustion (option 0) shows a fuel reacting with oxygen, releasing energy as heat and light. Synthesis (option 1) shows two or more simple substances combining into a single, more complex product. Decomposition (option 2) shows a single compound breaking apart into simpler substances, often requiring added energy. Single displacement (option 3) shows a more reactive element replacing a less reactive one in a compound. Each type shows distinct molecular rearrangements and different energy profiles.",
      temperature:
        "Sets the reaction temperature in degrees Celsius (20 to 500°C). Temperature controls how fast molecules move. At higher temperatures, molecules collide more frequently and with more energy, increasing the chance that collisions lead to successful bond breaking and forming — the reaction speeds up. At lower temperatures, collisions are less frequent and weaker, slowing the reaction. This is why food spoils faster at room temperature than in a refrigerator, and why chemical reactions in warm tropical environments often occur faster than in cold polar regions.",
      concentration:
        "Sets the initial concentration of reactants in moles per liter (0.1 to 2.0 mol/L). Higher concentration means more reactant particles are packed into the same volume, so collisions between reactant molecules happen more frequently. More frequent successful collisions mean a faster reaction rate. Halving the concentration typically slows the reaction rate noticeably. This principle is why concentrated cleaning products work faster than diluted ones, and why increasing the amount of fuel feeds a larger fire.",
      catalyst:
        "Toggles the addition of a catalyst (0=No, 1=Yes; Pro feature). A catalyst provides an alternative reaction pathway that requires less energy to get started (lower activation energy). More reactant molecules have enough energy to react, so the reaction runs faster. Importantly, the catalyst is not consumed — it participates in intermediate steps but is regenerated by the end, so it can be used again. The final products and their amounts are the same whether or not a catalyst is present — only the speed changes.",
    },
    misconceptions: [
      {
        wrong: "Matter is destroyed during chemical reactions — things just disappear.",
        correct:
          "Matter is never created or destroyed in a chemical reaction. When something burns, it seems to disappear, but the atoms from the original substance recombine with oxygen from the air to form gases like CO2 and water vapor that disperse into the atmosphere. If you could collect all the products — including the gases — and weigh them, the total mass would equal the mass of the original substances plus the oxygen that reacted. This is the Law of Conservation of Mass, one of the most tested and reliable principles in all of science.",
      },
      {
        wrong: "Exothermic reactions always make fire or explosions.",
        correct:
          "Exothermic reactions release energy as heat, but only some of them are dramatic enough to produce visible flames or explosions. Hand warmers use an exothermic reaction (iron oxidation) that just produces warmth. Even dissolving some salts in water releases heat. Note: mixing baking soda and vinegar is actually endothermic — the mixture gets slightly cooler, not warmer. The amount and rate of energy release or absorption — not just the sign (exo vs. endo) — determines how dramatic the reaction appears.",
      },
      {
        wrong: "A catalyst is consumed in the reaction and must be replaced each time.",
        correct:
          "A true catalyst participates in the reaction mechanism but is regenerated at the end of each reaction cycle. It lowers the energy barrier (activation energy) needed to start the reaction without being used up. Catalysts can facilitate millions of reactions without being consumed. Enzymes in your body are biological catalysts — they speed up reactions constantly without being destroyed. Industrial catalysts in car exhaust systems (catalytic converters) work the same way.",
      },
      {
        wrong: "Balancing chemical equations means changing the formulas of the molecules.",
        correct:
          "When balancing equations, you can only change the coefficients (numbers in front of each formula) — never the subscripts inside the molecular formula. Changing subscripts would change the identity of the substance: H2O is water, but H2O2 is hydrogen peroxide, a completely different compound. Coefficients tell you how many molecules participate, while subscripts tell you how many atoms are in each molecule. Balancing adjusts the 'how many' without changing 'what kind.'",
      },
      {
        wrong: "Higher temperature always means a faster reaction with more products.",
        correct:
          "Higher temperature does typically increase reaction rate, but it does not change the amount of product formed if the reactants are limited by concentration, not by rate. Once all reactants are used up, no more product forms regardless of temperature. Additionally, some reactions are reversed at high temperatures — heating can cause products to decompose back into reactants. Temperature affects speed and sometimes equilibrium position, but the stoichiometry (ratio of reactants to products) is fixed by the balanced equation.",
      },
    ],
    teacherUseCases: [
      "Conservation of mass verification: set reactionType to 0 (Combustion) and concentration to 1.0 mol/L. Students count the atoms on each side of the displayed equation, confirm they balance, and then calculate the expected mass of products. Connect to the historical experiment where Lavoisier showed that mass is conserved in combustion by conducting reactions in sealed containers (MS-PS1-2).",
      "Reaction type classification: run all four reaction types at temperature 25°C and concentration 1.0 mol/L. For each, students record the reactants, products, and molecular animation, then write a general pattern (A+B → AB, AB → A+B, etc.) and classify as synthesis, decomposition, combustion, or single displacement. Students sort real-world examples into each category (MS-PS1-2).",
      "Temperature as a variable: hold reactionType at 1 (Synthesis), concentration at 1.0 mol/L, and catalyst at 0. Run the reaction at temperature 20°C, 200°C, and 400°C, counting how many product molecules form per unit time shown on screen. Students graph temperature vs. reaction rate and explain the relationship using the idea that higher temperature means more energetic collisions (MS-PS1-5).",
      "Catalyst effect investigation (Pro): set reactionType to 0 (Combustion), temperature to 25°C, and concentration to 0.5 mol/L. Run without catalyst and record the time to complete. Then run with catalyst at 1 and compare. Students calculate the speed increase and research a real-world catalyst system (car catalytic converter, enzyme in digestion) to connect lab observations to applications.",
      "Exothermic vs. endothermic sorting: run Combustion (exothermic) and Decomposition (often endothermic) at the same settings. Students observe the temperature change shown in the simulation for each, classify as exo or endothermic, and then sort a list of real reactions (ice pack, hand warmer, photosynthesis, burning toast) into the same categories using evidence from the simulation.",
    ],
    faq: [
      {
        question: "What is the Law of Conservation of Mass and why does it matter?",
        answer:
          "The Law of Conservation of Mass states that the total mass of reactants in a chemical reaction always equals the total mass of products — atoms are rearranged but never created or destroyed. This principle, confirmed by Antoine Lavoisier in the late 1700s through careful experiments with sealed containers, is the foundation of balanced chemical equations. It matters because it allows chemists to predict exactly how much product they can expect from a given amount of reactants, which is essential for manufacturing medicines, materials, and fuels efficiently and safely.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation directly supports MS-PS1-2, which asks students to analyze data on the properties of substances before and after interactions to determine if a chemical reaction has occurred, and MS-PS1-5, which asks students to develop and use a model to describe how total particle number is conserved in a chemical reaction. The energy change component also connects to MS-PS1-6 (energy in chemical processes). The catalyst feature extends to HS-PS1-7 for advanced learners exploring reaction rate and mechanism.",
      },
      {
        question: "How do you know when a chemical reaction has happened?",
        answer:
          "Signs that a chemical reaction has occurred include: a color change (the new substance has different light-absorption properties), production of a gas (bubbles forming in a liquid), formation of a solid precipitate in a liquid, a temperature change (exothermic reactions warm up, endothermic reactions cool down), and production of light or sound. The key test is that the new substances have different properties from the original ones. Physical changes — like melting ice or dissolving sugar — do not create new substances and are not chemical reactions.",
      },
      {
        question: "What is activation energy and why does every reaction need it?",
        answer:
          "Activation energy is the minimum amount of energy that colliding reactant molecules must have to break existing bonds and start forming new ones. Even reactions that release a lot of energy overall — like burning wood — need an initial energy input to get started. This is why you need to light a match to start a fire even though the combustion reaction is highly exothermic. Reactant molecules must collide with enough force to overcome the energy barrier before the reaction proceeds. Catalysts lower this barrier, and higher temperatures give more molecules enough energy to clear it.",
      },
      {
        question: "Why does increasing concentration speed up a chemical reaction?",
        answer:
          "Concentration determines how many reactant particles are present in a given volume. Higher concentration means particles are packed closer together, so they collide more frequently. Reaction rate depends on the number of successful collisions per second — collisions where the molecules have enough energy and hit in the right orientation to react. More frequent collisions mean more successful reactions per second, so the overall reaction is faster. This is the same reason a crowd of people in a small room bumps into each other more often than the same crowd spread across a football field.",
      },
    ],
  },
};
