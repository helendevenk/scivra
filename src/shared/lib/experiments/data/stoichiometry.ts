import type { Experiment } from "@/shared/types/experiment";

export const stoichiometry: Experiment = {
  id: "stoichiometry",
  slug: "stoichiometry",
  title: "Stoichiometry",
  subtitle: "Mole ratios, limiting reagents, and theoretical yield",
  description:
    "Visualize chemical reactions at the molecular level. Adjust reactant quantities, identify the limiting reagent, calculate theoretical yield, and observe leftover excess reactants. Real-time atom counting ensures conservation of mass.",
  thumbnail: "/imgs/experiments/stoichiometry.png",

  standards: {
    ngss: ["HS-PS1-7"],
    gcse: [],
    ap: ["4.A.1", "4.A.2"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "9-12",
  tags: [
    "stoichiometry",
    "limiting reagent",
    "mole ratio",
    "theoretical yield",
    "conservation of mass",
    "AP Chemistry",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "massA",
      label: "Mass of A",
      unit: "g",
      min: 1,
      max: 100,
      default: 10,
      step: 0.5,
      tier: "free",
    },
    {
      id: "massB",
      label: "Mass of B",
      unit: "g",
      min: 1,
      max: 100,
      default: 10,
      step: 0.5,
      tier: "free",
    },
    {
      id: "actualYield",
      label: "Actual Yield",
      unit: "g",
      min: 0,
      max: 100,
      default: 80,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\text{moles of product} = \\text{moles of limiting reagent} \\times \\frac{\\text{product coeff.}}{\\text{limiting reagent coeff.}}",
      description:
        "Theoretical yield is determined by the limiting reagent and the mole ratio from the balanced equation",
    },
    {
      latex: "\\% \\text{ yield} = \\frac{\\text{actual yield}}{\\text{theoretical yield}} \\times 100\\%",
      description:
        "Percent yield compares actual product obtained to the theoretical maximum",
    },
  ],

  theory:
    "Stoichiometry uses the coefficients of a balanced chemical equation to relate amounts of reactants and products. The mole ratio (coefficient ratio) converts between moles of different substances. The limiting reagent is the reactant that runs out first, determining the maximum product (theoretical yield). The excess reagent has leftover moles after the reaction completes. For a reaction aA + bB → cC: if (moles A)/a < (moles B)/b, then A is limiting. Theoretical moles of C = (moles of limiting reagent) × (c/a or c/b). Conservation of mass requires that total atoms of each element are equal on both sides.",

  instructions:
    "Use the Mass of A, Mass of B, and Actual Yield sliders to compare starting reactant masses, theoretical yield, and percent yield. Try the H₂+O₂→H₂O, Haber Process, and Limiting Reagent Demo presets to switch between representative stoichiometry scenarios, then adjust the three sliders to see how the limiting reagent, excess reactant, and yield calculations respond.",

  challenges: [
    {
      id: "st-c1",
      question: "For 2H₂ + O₂ → 2H₂O, with 3 mol H₂ and 2 mol O₂, which is limiting?",
      hint: "H₂: 3/2 = 1.5, O₂: 2/1 = 2. H₂ has the smaller ratio → H₂ is limiting.",
      tier: "free",
    },
    {
      id: "st-c2",
      question: "For N₂ + 3H₂ → 2NH₃, starting with 1 mol N₂ and 4 mol H₂, how many moles of NH₃ form?",
      hint: "N₂: 1/1=1, H₂: 4/3=1.33 → N₂ is limiting. NH₃ = 1 × (2/1) = 2 mol.",
      tier: "free",
    },
    {
      id: "st-c3",
      question: "If theoretical yield is 5.0 g but you obtain 3.8 g, what is the percent yield?",
      hint: "% yield = (3.8/5.0) × 100% = 76%",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["balancing-chemical-equations", "solutions-dilutions"],
  htmlPath: "/experiments/ap-chemistry/stoichiometry.html",

  seoTitle: "Stoichiometry Interactive Simulator | Scivra AP Chemistry",
  seoKeywords: [
    "stoichiometry simulation",
    "limiting reagent calculator",
    "mole ratio interactive",
    "theoretical yield virtual lab",
    "AP Chemistry stoichiometry",
    "chemical equation balancer",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Stoichiometry and Limiting Reagents",
  },
  htmlControlAliases: {
    massA: "sl-massA",
    massB: "sl-massB",
    actualYield: "sl-actual",
  },
  presets: [
    {
      id: "loadPreset:0",
      label: "💧 H₂+O₂→H₂O",
      description:
        "Models water formation from hydrogen and oxygen, a compact example for practicing coefficient ratios and seeing how reactant masses constrain product yield.",
    },
    {
      id: "loadPreset:1",
      label: "🏭 Haber Process",
      description:
        "Uses ammonia synthesis to connect stoichiometric ratios with an industrial reaction where identifying the limiting reagent affects expected product mass.",
    },
    {
      id: "loadPreset:2",
      label: "⚗️ Limiting Reagent Demo",
      description:
        "Sets up a focused limiting-reagent case so students can compare available masses, predict which reactant runs out, and check excess and yield readouts.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Stoichiometry is the quantitative accounting of atoms and moles in a chemical reaction. The coefficients in a balanced equation are mole ratios: in 2 H₂ + O₂ → 2 H₂O, two moles of hydrogen react with exactly one mole of oxygen, no more. The limiting reagent is whichever reactant runs out first based on those ratios — it determines the theoretical yield, the maximum product obtainable. Covered under AP Chem 4.A.1 and 4.A.2, stoichiometry underpins every quantitative chemistry problem from percent yield in industrial synthesis to dosing calculations in medicine. This simulation displays reactions at the molecular level: adjust the moles of each reactant, watch molecules combine, and observe which reactant is exhausted first and how many moles of excess remain.",
    parameterExplanations: {
      massA:
        "Mass of A sets the starting amount of the first reactant in grams. Stoichiometry problems begin with a mass, but balanced equations compare substances in moles, so this value must be converted through molar mass before the coefficient ratio can be used. Raising Mass of A can increase theoretical product only while A is limiting; once the other reactant becomes limiting, extra A remains as excess. Keep Mass of B fixed and move this slider to see the limiting reagent switch, then explain the result with grams-to-moles conversion rather than comparing raw gram values.",
      massB:
        "Mass of B sets the starting amount of the second reactant in grams. It should be interpreted together with Mass of A and the coefficients in the active preset equation. A larger gram value does not automatically mean there are more usable reaction units, because different substances have different molar masses. Convert each reactant mass to moles, divide by the balanced-equation coefficient, and compare those normalized amounts. When Mass of B is below the required ratio, B limits the reaction; when it is above the ratio, some B remains unused after the theoretical yield is reached.",
      actualYield:
        "Actual Yield represents the product mass collected from the reaction in grams. Theoretical yield is the maximum predicted by the limiting reagent, assuming complete conversion and no losses. Real experiments often produce less because of incomplete reaction, side reactions, transfer loss, moisture, or measurement error. Use this slider after setting Mass of A and Mass of B: first predict the theoretical yield from stoichiometry, then compare the actual collected mass with that benchmark. The percent yield calculation links the ideal balanced-equation model to what a student might measure in a physical lab.",
    },
    misconceptions: [
      {
        wrong:
          "The limiting reagent is whichever reactant has the smaller mass (or smaller number of moles).",
        correct:
          "Limiting reagent is determined by mole ratio relative to stoichiometric coefficients, not by raw gram values or raw mole values. In a mass-based setup, convert each reactant from grams to moles using molar mass, then divide by its coefficient in the balanced equation. The smaller normalized amount identifies the limiting reagent. This is why a reactant with more grams can still run out first if its molar mass and coefficient make its usable mole amount smaller.",
      },
      {
        wrong:
          "Stoichiometry is just multiplying the given mass by a ratio — you don't need to convert to moles.",
        correct:
          "The balanced equation gives ratios in moles, not in grams. You must convert grams to moles using molar mass (g/mol) first, apply the mole ratio, then convert back to grams if a mass answer is required. Skipping the gram-to-mole conversion is one of the most common stoichiometry errors on the AP exam.",
      },
      {
        wrong:
          "All of the excess reagent gets used up once you add more of the limiting reagent.",
        correct:
          "Adding more of the limiting reagent consumes more of the excess reagent, but only up to the point where the balance flips and the other reactant becomes limiting. The role of limiting versus excess depends on both reactant masses after conversion to moles and the coefficient ratio. Move one mass slider while holding the other fixed to see why excess is not a permanent label for a substance; it is a relationship created by the current quantities.",
      },
      {
        wrong:
          "Theoretical yield is the amount you actually get from a reaction in the lab.",
        correct:
          "Theoretical yield is the calculated maximum based on the limiting reagent and stoichiometric coefficients — it assumes 100% efficient conversion with no side reactions or product loss. Actual yield is what you physically collect. Percent yield = (actual / theoretical) × 100%; values below 100% reflect real-world losses, competing reactions, or incomplete reactions.",
      },
      {
        wrong:
          "If percent yield is below 100%, atoms were destroyed in the reaction.",
        correct:
          "Conservation of mass is never violated — atoms are neither created nor destroyed. Low percent yield means product was lost in transfer, stayed in solution, reacted further in a side reaction, or the reaction did not go to completion. The atoms are accounted for; they just ended up somewhere other than the isolated product.",
      },
    ],
    teacherUseCases: [
      "Limiting-reagent identification drill: use the Limiting Reagent Demo preset, set clear Mass of A and Mass of B values, and ask students to convert grams to moles, divide by coefficients, and predict which reactant limits before checking the simulation readout.",
      "Theoretical yield calculation then verification: choose the H₂+O₂→H₂O preset, have students calculate theoretical product mass from the limiting reagent on paper, then compare against the displayed result. Any mismatch points to a molar-mass, coefficient, or unit-conversion error.",
      "Percent yield lab connection: pair this simulation with a physical experiment such as copper displacement or magnesium combustion where students record actual yield, then use the Actual Yield slider to model their collected product mass and calculate percent yield against the ideal benchmark.",
      "Misconception probe — 'limiting reagent = smaller mass': give students a scenario where the smaller-mass reactant is actually the excess reagent, then use the Mass of A and Mass of B sliders to confirm that coefficient-normalized mole amounts, not raw grams, determine the limiting reagent.",
      "Preset comparison activity: rotate through the H₂+O₂→H₂O, Haber Process, and Limiting Reagent Demo presets, asking students to record which reactant limits in each case and explain how the balanced-equation coefficients change the yield calculation.",
    ],
    faq: [
      {
        question: "How do I identify the limiting reagent step by step?",
        answer:
          "Step 1: Convert each reactant mass from grams to moles using molar mass. Step 2: Divide each mole amount by that reactant's coefficient in the balanced equation. Step 3: The reactant with the smallest quotient is the limiting reagent. Step 4: Use that limiting amount and the product coefficient ratio to calculate theoretical yield. The mass sliders are useful because they force the same workflow used in real lab problems: grams first, moles next, coefficient ratio last.",
      },
      {
        question: "What is theoretical yield and how do I calculate it?",
        answer:
          "Theoretical yield is the maximum mass of product obtainable, calculated from the limiting reagent using the balanced equation mole ratio. Formula: moles of product = moles of limiting reagent × (product coefficient / limiting reagent coefficient). Then multiply by the product's molar mass to get grams. AP Chem 4.A.2 requires this calculation; practice it until the unit-conversion chain (g → mol → mol product → g product) is automatic.",
      },
      {
        question: "Why must I convert grams to moles before using the mole ratio?",
        answer:
          "Stoichiometric coefficients represent mole ratios, not mass ratios. 2 H₂ + O₂ → 2 H₂O means 2 mol H₂ reacts with 1 mol O₂, which is 4 g H₂ and 32 g O₂ — a 1:8 mass ratio, not 2:1. The only universal language the balanced equation speaks is moles. Converting to moles first is the mandatory gateway step.",
      },
      {
        question: "Can percent yield ever exceed 100%?",
        answer:
          "For a pure dry product, no — true yield should not exceed 100%. If a reported percent yield exceeds 100%, the most common explanations are an impure or wet product (residual moisture or unreacted starting material that inflates the measured mass), an incorrect theoretical yield calculation, or weighing errors. An apparent >100% yield is a signal to re-purify and re-measure, not celebrate — atoms aren't being created, but mass is being mismeasured.",
      },
      {
        question: "How does AP Chem 4.A.1 connect to this simulation?",
        answer:
          "AP Chem 4.A.1 states that the amounts of products and reactants in a chemical reaction are determined by the stoichiometry of the balanced equation. The simulation makes this concrete by connecting adjustable reactant masses to coefficient ratios, limiting reagent decisions, theoretical yield, and excess reactant. Work through the H₂+O₂→H₂O, Haber Process, and Limiting Reagent Demo presets to compare how different balanced equations change the same calculation workflow.",
      },
    ],
  },
};
