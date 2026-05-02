import type { Experiment } from "@/shared/types/experiment";

export const msChemicalStoichiometry: Experiment = {
  id: "ms-chemical-stoichiometry",
  slug: "ms-chemical-stoichiometry",
  title: "Chemical Stoichiometry",
  subtitle: "Mole ratios, limiting reagents, and reaction yields",
  description:
    "Practice stoichiometry by balancing equations, identifying limiting reagents, and calculating theoretical yields. Drag atom counters to visualize mole ratios, watch excess reagents remain after the reaction completes, and compare theoretical vs actual yield.",
  thumbnail: "/imgs/experiments/ms-chemical-stoichiometry.png",
  standards: { ngss: ["MS-PS1-2", "MS-PS1-5"], gcse: [], ap: [] },
  primaryStandard: "ngss-ms",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "6-8",
  tags: ["stoichiometry", "mole ratio", "limiting reagent", "yield", "middle school chemistry"],
  difficulty: "intermediate",
  parameters: [
    { id: "molesA", label: "Moles of Reactant A", unit: "mol", min: 0.5, max: 10, default: 3, step: 0.5, tier: "free" },
    { id: "molesB", label: "Moles of Reactant B", unit: "mol", min: 0.5, max: 10, default: 5, step: 0.5, tier: "free" },
    { id: "reaction", label: "Reaction (0=synthesis, 1=decomposition, 2=combustion)", unit: "", min: 0, max: 2, default: 0, step: 1, tier: "free" },
  ],
  formulas: [
    { latex: "\\text{Mole ratio} = \\frac{\\text{coefficient A}}{\\text{coefficient B}}", description: "The ratio of moles in a balanced equation determines how much of each reactant is needed" },
    { latex: "\\text{Yield} = \\frac{\\text{actual}}{\\text{theoretical}} \\times 100\\%", description: "Percent yield compares what you actually get to what the balanced equation predicts" },
  ],
  theory: "Stoichiometry uses the coefficients of a balanced chemical equation to calculate the amounts of reactants consumed and products formed. The mole ratio between any two substances equals the ratio of their coefficients. The limiting reagent is completely consumed first, determining the maximum product. Excess reagent remains after the reaction. Theoretical yield is the maximum possible product mass; actual yield is always less due to incomplete reactions or side reactions.",
  instructions: "Set the moles of each reactant and select a reaction type. The visualization shows atom models reacting in the correct ratio. Identify which reagent is limiting, how much product forms, and how much excess remains.",
  challenges: [
    { id: "mcs-c1", question: "In 2H₂ + O₂ → 2H₂O, you have 3 mol H₂ and 2 mol O₂. Which is limiting?", hint: "Need 2 mol H₂ per 1 mol O₂. For 3 mol H₂: need 1.5 mol O₂ (have 2). For 2 mol O₂: need 4 mol H₂ (have 3). H₂ is limiting.", tier: "free" },
    { id: "mcs-c2", question: "How many moles of H₂O form from the above?", hint: "3 mol H₂ × (2 mol H₂O / 2 mol H₂) = 3 mol H₂O", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 15,
  relatedExperiments: ["stoichiometry", "balancing-chemical-equations"],
  htmlPath: "/experiments/middle/ms-chemical-stoichiometry.html",
  seoTitle: "Chemical Stoichiometry Simulation | Scivra Middle School",
  seoKeywords: ["stoichiometry simulation", "limiting reagent calculator", "mole ratio interactive", "middle school chemistry"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Middle School", teaches: "Chemical Stoichiometry" },
  contentSections: {
    whatIsIt:
      "Chemical stoichiometry is the science of counting particles in chemical reactions. When substances react, atoms rearrange — but atoms are never created or destroyed. A balanced equation shows the exact ratio of particles involved. Think of it like a recipe: to make one batch of cookies you need a specific ratio of flour to eggs. In chemistry, the coefficients in a balanced equation are that recipe — if the equation reads 2A + B → AB₂, you need two parts A for every one part B. When one ingredient runs out first — the limiting reagent — the reaction stops, just like running out of eggs stops cookie-making even if you have plenty of flour. The excess reagent is whatever is left over. This simulation lets you drag atom counters, watch balanced reactions unfold particle-by-particle, and discover firsthand why the coefficient ratio controls how much product you can make. The core skill is reading the balanced equation's ratio, not mole-level calculations.",
    parameterExplanations: {
      molesA:
        "Moles of Reactant A, adjustable from 0.5 to 10 mol in 0.5 mol steps. In the simulation each 'mol' represents a group of particles of the first substance entering the reaction. Increasing this value adds more of Reactant A. If A is in excess, raising it further beyond the limiting point will not produce more product — the extra particles remain unreacted.",
      molesB:
        "Moles of Reactant B, adjustable from 0.5 to 10 mol in 0.5 mol steps. This controls the supply of the second substance. Changing the ratio of molesA to molesB lets you explore which reactant becomes the limiting reagent. Try setting one much higher than the other and watch how the excess particles stack up after the reaction ends.",
      reaction:
        "Selects which type of chemical reaction to observe: 0 = synthesis (two substances combine into one product), 1 = decomposition (one substance breaks apart into two products), 2 = combustion (a fuel reacts with oxygen to produce carbon dioxide and water). Each reaction type has a different balanced equation and therefore a different mole ratio between reactants.",
    },
    misconceptions: [
      {
        wrong: "The reactant you start with more of is always the limiting reagent.",
        correct:
          "The limiting reagent is whichever substance runs out first based on the mole ratio in the balanced equation — not whichever has fewer total moles. For example, in 2H₂ + O₂, you need 2 moles of H₂ for every 1 mole of O₂. If you have 3 mol H₂ and 2 mol O₂, H₂ is limiting even though it seems like you have more of it, because the reaction needs twice as much H₂ relative to O₂.",
      },
      {
        wrong: "When the reaction finishes, all the reactants are used up.",
        correct:
          "Only the limiting reagent is completely consumed. The excess reagent still has leftover particles after the reaction stops. Real lab products often contain unreacted starting materials. The simulation shows these leftover particles explicitly so you can see which reactant had extra.",
      },
      {
        wrong: "Adding extra of one reactant always makes more product.",
        correct:
          "If the other reactant is already the limiting one, dumping in more of the first reactant just leaves more leftover — it does not make more product. To get more product, you need more of the limiting reactant (or more of both, in the right ratio from the balanced equation). This is the same as adding more flour will not bake more cookies if you have run out of eggs.",
      },
      {
        wrong: "Balancing an equation changes the chemical formula of the substances.",
        correct:
          "Balancing only adjusts the coefficients in front of each formula — never the subscripts inside the formula. Changing subscripts would create a different substance entirely. The formulas stay the same; you are just deciding how many of each molecule is needed to conserve atoms on both sides of the equation.",
      },
    ],
    teacherUseCases: [
      "Set molesA to 2, molesB to 4, and reaction to 0 (synthesis). Ask students to predict the limiting reagent before pressing Play, then verify by counting leftover particles in the visualization.",
      "Set molesA to 3, molesB to 3, and reaction to 2 (combustion). After the reaction, ask students to identify the excess reagent and calculate how many moles remain unreacted using the balanced equation coefficients.",
      "Compare reaction types by holding molesA and molesB constant at 4 each while cycling through reaction values 0, 1, and 2. Students record which scenario produces the most product and explain the role of the mole ratio.",
      "Introduce the limiting reagent concept using the cookie-baking analogy: molesA = flour batches, molesB = egg sets. Set values so one runs out first and have students articulate why the recipe stopped without using chemistry vocabulary initially.",
      "Have students set molesA to 1 and molesB to 10, observe the excess, then reverse the values. Ask: did the amount of product change? Why or why not? This reinforces that product yield depends on the limiting reagent, not total material.",
    ],
    faq: [
      {
        question: "What does 'mole' mean, and why do chemists use it?",
        answer:
          "A mole is just a very large counting number — about 602 sextillion particles. Chemists use it because individual atoms and molecules are far too small to count one by one or weigh individually. The mole lets scientists connect the measurable mass of a substance in a lab to the number of atoms actually reacting. In this simulation each unit of molesA or molesB represents a proportional group of particles so you can see the ratios without needing the full astronomical number.",
      },
      {
        question: "Why does the reaction stop when the limiting reagent runs out?",
        answer:
          "Chemical reactions require the correct particles to collide with each other. Once the limiting reagent is completely consumed, there are no more of those particles available to collide with the excess reagent. The reaction has nowhere to go, so it stops. The remaining excess particles just sit there unreacted. This is directly observable in the simulation: you can see leftover particles of the excess reagent after the visualization ends.",
      },
      {
        question: "What NGSS standards does this experiment address?",
        answer:
          "This simulation supports MS-PS1-2 (analyze and interpret data on properties of substances before and after substances interact to determine if a chemical reaction has occurred) and MS-PS1-5 (develop and use a model to describe how the total number of atoms is conserved when two or more substances combine or separate). The particle-counting visualization directly models conservation of atoms across a chemical reaction.",
      },
      {
        question: "How is stoichiometry used in real life?",
        answer:
          "Stoichiometry is used everywhere manufacturing happens. Pharmaceutical companies calculate exact reagent amounts to synthesize medicines efficiently. Fuel engineers calculate air-to-fuel ratios for complete combustion in engines. Food scientists balance ingredient ratios in industrial baking. Even your body uses stoichiometric principles — enzymes catalyze reactions in precise molecular ratios to keep cellular chemistry running correctly.",
      },
      {
        question: "How do I tell which reactant will run out first?",
        answer:
          "Look at the balanced equation to see how many of each particle are needed in the reaction's recipe. Compare that ratio to how much of each reactant you actually have. Whichever reactant runs out first when matching that recipe ratio is the limiting reactant. In the simulation, after pressing Play you can also count the leftover particles — the reactant that has none left was the limiting reactant. The other reactant, with leftovers, was in excess.",
      },
    ],
  },
};
