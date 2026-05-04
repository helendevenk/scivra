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
      id: "temperature",
      label: "Temperature",
      unit: "°C",
      min: 10,
      max: 1000,
      default: 25,
      step: 1,
      tier: "free",
    },
    {
      id: "concentration",
      label: "Reactant Concentration",
      unit: "mol/L",
      min: 1,
      max: 5,
      default: 1.0,
      step: 0.5,
      tier: "free",
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
    "Use the Temperature slider to change how energetic the particle collisions are, and use the Reactant Concentration slider to change how crowded the reactants are. Try the Combustion, Synthesis, and Decomposition presets to compare how different reactions rearrange atoms while conserving mass.",

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
  htmlControlAliases: { temperature: "tempSlider", concentration: "concSlider" },
  presets: [
    { id: "combustion", label: "Combustion CH₄+O₂", description: "Methane and oxygen rearrange into carbon dioxide and water, showing a balanced combustion reaction that releases energy." },
    { id: "synthesis", label: "Synthesis H₂+O₂→H₂O", description: "Hydrogen and oxygen combine to form water, making it easier to see how separate reactants become one product compound." },
    { id: "decomposition", label: "Decomposition H₂O₂", description: "Hydrogen peroxide breaks apart into simpler substances, showing how one compound can split into multiple products." },
  ],
  contentSections: {
    whatIsIt:
      "A chemical reaction is one of the most fundamental events in nature: atoms that were bonded in one arrangement break apart and reconnect in a completely new arrangement, forming substances with entirely different properties. When wood burns in a campfire, the carbon and hydrogen in the wood combine with oxygen from the air to produce carbon dioxide, water vapor, and light — a combustion reaction. The wood and oxygen are reactants; the CO2 and water are products. One of the most powerful ideas in science is that no atoms are created or destroyed during this process — they are only rearranged. This is the Law of Conservation of Mass, and it is why balanced chemical equations have equal numbers of each type of atom on both sides. This simulation shows four important reaction types at the molecular level: combustion, synthesis, decomposition, and single displacement. You can control temperature, reactant concentration, and — for Pro users — add a catalyst to see how reaction speed changes without changing the final outcome.",
    parameterExplanations: {
      temperature:
        "Temperature sets how much kinetic energy the reacting particles have before they collide. When you raise the slider, particles move faster, collide more often, and hit with enough energy to break old bonds and form new ones more frequently. Lower temperatures slow those collisions, so the same reaction pattern can take longer to unfold. Keep the Concentration slider fixed while changing Temperature to isolate this variable. Then compare the Combustion, Synthesis, and Decomposition presets to see that temperature changes the rate of successful collisions, not the rule that atoms must be conserved in the balanced reaction.",
      concentration:
        "Concentration controls how many reactant particles are available in the reaction space. A higher value packs more particles into the same volume, which increases the number of collisions per second and usually speeds up product formation. A lower value spreads particles farther apart, so successful collisions are less frequent. Use this slider after choosing a preset: Combustion, Synthesis, and Decomposition each keep their own balanced equation, but concentration changes how quickly the visible reaction proceeds. Students can compare two trials with the same Temperature to explain reaction rate using particle crowding instead of changing the identities of the reactants.",
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
        wrong: "The preset button changes the rules of conservation of mass.",
        correct:
          "A preset changes which reaction example you are viewing, not the rule that atoms are conserved. Combustion, synthesis, and decomposition have different reactants and products, but each balanced equation still keeps the same number of each atom type before and after the reaction. The preset is a shortcut for comparing reaction patterns. It does not allow atoms to appear, disappear, or change into different elements.",
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
      "Conservation of mass verification: choose the Combustion preset and set concentration to 1.0 mol/L. Students count the atoms on each side of the displayed equation, confirm they balance, and then calculate the expected mass of products. Connect to the historical experiment where Lavoisier showed that mass is conserved in combustion by conducting reactions in sealed containers (MS-PS1-2).",
      "Reaction type classification: run the Combustion, Synthesis, and Decomposition presets at temperature 25°C and concentration 1.0 mol/L. For each, students record the reactants, products, and molecular animation, then write a general pattern such as A+B → AB or AB → A+B. Students sort real-world examples into the matching categories (MS-PS1-2).",
      "Temperature as a variable: choose the Synthesis preset and hold concentration at 1.0 mol/L. Run the reaction at temperature 20°C, 200°C, and 400°C, counting how many product molecules form per unit time shown on screen. Students graph temperature vs. reaction rate and explain the relationship using the idea that higher temperature means more energetic collisions (MS-PS1-5).",
      "Concentration as a variable: choose the Combustion preset and hold temperature at 25°C. Run low, medium, and high concentration trials, recording the time needed for visible product formation. Students compare particle crowding across trials and use collision frequency to explain why reaction rate changes while the balanced equation remains the same (MS-PS1-5).",
      "Exothermic vs. endothermic sorting: run Combustion and Decomposition at the same temperature and concentration settings. Students observe the temperature or energy change shown in the simulation for each, classify as exo or endothermic, and then sort a list of real reactions such as ice packs, hand warmers, photosynthesis, and burning toast into the same categories using evidence from the simulation.",
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
          "This simulation directly supports MS-PS1-2, which asks students to analyze data on the properties of substances before and after interactions to determine if a chemical reaction has occurred, and MS-PS1-5, which asks students to develop and use a model to describe how total particle number is conserved in a chemical reaction. The balanced-equation and mass-conservation framing can also support HS-PS1-7 for advanced learners who are ready to reason quantitatively about reactants and products.",
      },
      {
        question: "How do you know when a chemical reaction has happened?",
        answer:
          "Signs that a chemical reaction has occurred include: a color change (the new substance has different light-absorption properties), production of a gas (bubbles forming in a liquid), formation of a solid precipitate in a liquid, a temperature change (exothermic reactions warm up, endothermic reactions cool down), and production of light or sound. The key test is that the new substances have different properties from the original ones. Physical changes — like melting ice or dissolving sugar — do not create new substances and are not chemical reactions.",
      },
      {
        question: "What is activation energy and why does every reaction need it?",
        answer:
          "Activation energy is the minimum amount of energy that colliding reactant molecules must have to break existing bonds and start forming new ones. Even reactions that release a lot of energy overall — like burning wood — need an initial energy input to get started. This is why you need to light a match to start a fire even though the combustion reaction is highly exothermic. Reactant molecules must collide with enough force to overcome the energy barrier before the reaction proceeds. Higher temperatures give more molecules enough energy to clear that barrier.",
      },
      {
        question: "Why does increasing concentration speed up a chemical reaction?",
        answer:
          "Concentration determines how many reactant particles are present in a given volume. Higher concentration means particles are packed closer together, so they collide more frequently. Reaction rate depends on the number of successful collisions per second — collisions where the molecules have enough energy and hit in the right orientation to react. More frequent collisions mean more successful reactions per second, so the overall reaction is faster. This is the same reason a crowd of people in a small room bumps into each other more often than the same crowd spread across a football field.",
      },
    ],
  },
};
