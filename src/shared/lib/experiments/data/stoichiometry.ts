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
      id: "molesA",
      label: "Moles of Reactant A",
      unit: "mol",
      min: 0,
      max: 10,
      default: 2,
      step: 0.1,
      tier: "free",
    },
    {
      id: "molesB",
      label: "Moles of Reactant B",
      unit: "mol",
      min: 0,
      max: 10,
      default: 3,
      step: 0.1,
      tier: "free",
    },
    {
      id: "reaction",
      label: "Reaction (0=synthesis, 1=decomposition, 2=combustion)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
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
    "Choose a reaction type and adjust the moles of each reactant. The simulation displays molecules as colored circles — watch them combine and identify which reactant runs out first (the limiting reagent). The data panel shows mole ratios, theoretical yield, and leftover excess in real time.",

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
  contentSections: {
    whatIsIt:
      "Stoichiometry is the quantitative accounting of atoms and moles in a chemical reaction. The coefficients in a balanced equation are mole ratios: in 2 H₂ + O₂ → 2 H₂O, two moles of hydrogen react with exactly one mole of oxygen, no more. The limiting reagent is whichever reactant runs out first based on those ratios — it determines the theoretical yield, the maximum product obtainable. Covered under AP Chem 4.A.1 and 4.A.2, stoichiometry underpins every quantitative chemistry problem from percent yield in industrial synthesis to dosing calculations in medicine. This simulation displays reactions at the molecular level: adjust the moles of each reactant, watch molecules combine, and observe which reactant is exhausted first and how many moles of excess remain.",
    parameterExplanations: {
      molesA:
        "The initial moles of Reactant A loaded into the virtual reaction vessel (range 0–10 mol, default 2 mol). Reactant A maps to the first species on the left side of the selected balanced equation. Increasing molesA beyond the stoichiometric ratio relative to molesB will shift the limiting reagent from A to B; the simulation identifies and labels the limiting reagent in real time.",
      molesB:
        "The initial moles of Reactant B (range 0–10 mol, default 3 mol). To determine the limiting reagent manually, compute molesA / coeffA and molesB / coeffB; the smaller quotient identifies the limiting reagent. The simulation uses this same logic and colors excess reagent molecules gray after the reaction completes.",
      reaction:
        "Selects the reaction type: 0 = synthesis (A + B → AB), 1 = decomposition (AB → A + B), 2 = combustion (hydrocarbon + O₂ → CO₂ + H₂O). Each reaction type has distinct stoichiometric coefficients, so the limiting-reagent outcome changes even for the same molesA and molesB inputs. Try the same mole inputs across all three reactions to see how coefficient ratios shift which reagent limits.",
    },
    misconceptions: [
      {
        wrong:
          "The limiting reagent is whichever reactant has the smaller mass (or smaller number of moles).",
        correct:
          "Limiting reagent is determined by mole ratio relative to stoichiometric coefficients, not by raw mass or raw moles. For N₂ + 3 H₂ → 2 NH₃, with 1 mol N₂ and 2 mol H₂: divide each by its coefficient — N₂: 1/1 = 1.0, H₂: 2/3 = 0.67. H₂ is limiting even though N₂ has fewer moles. Always divide moles by the coefficient from the balanced equation before comparing.",
      },
      {
        wrong:
          "Stoichiometry is just multiplying the given mass by a ratio — you don't need to convert to moles.",
        correct:
          "The balanced equation gives ratios in moles, not in grams. You must convert grams to moles using molar mass (g/mol) first, apply the mole ratio, then convert back to grams if a mass answer is required. Skipping the gram-to-mole conversion is the single most common stoichiometry error on the AP exam.",
      },
      {
        wrong:
          "All of the excess reagent gets used up once you add more of the limiting reagent.",
        correct:
          "Adding more limiting reagent consumes more of the excess reagent, but only up to the point where the new limiting reagent runs out. The role of limiting vs. excess can flip if you add enough. The simulation shows leftover gray molecules updating in real time as you move the sliders to illustrate this.",
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
      "Limiting-reagent identification drill: set molesA = 3, molesB = 3, reaction = synthesis (2A + B → products). Ask students to predict limiting reagent by hand (divide each by its coefficient), then confirm with the simulation. Repeat with molesA = 1, molesB = 3 to flip the answer.",
      "Theoretical yield calculation then verification: for the combustion reaction, give students the moles of each reactant, have them calculate theoretical yield of CO₂ on paper, then check against the simulation readout. Any discrepancy forces re-examination of the coefficient ratios used.",
      "Percent yield lab connection: pair this simulation with a physical experiment (e.g., copper displacement or magnesium combustion) where students record actual yield, then use stoichiometry to compute theoretical yield and calculate percent yield. The simulation provides the ideal benchmark.",
      "Misconception probe — 'limiting reagent = smaller mass': give students a scenario where the smaller-mass reactant is actually the excess reagent (e.g., 4 g Fe vs. 3 g S in Fe + S → FeS; Fe moles: 4/55.85 = 0.072, S moles: 3/32.06 = 0.094 — Fe is limiting despite having more grams). Use the simulation to confirm.",
      "Excess reagent calculation challenge: after identifying the limiting reagent in the simulation, have students calculate the moles of excess reagent remaining and verify against the leftover count displayed. Connect to real-world scenarios where excess reagent recovery or disposal matters (industrial scale).",
    ],
    faq: [
      {
        question: "How do I identify the limiting reagent step by step?",
        answer:
          "Step 1: Convert all reactant masses to moles using molar mass. Step 2: Divide each reactant's moles by its stoichiometric coefficient in the balanced equation. Step 3: The reactant with the smallest quotient is the limiting reagent. For 2 H₂ + O₂ → 2 H₂O with 3 mol H₂ and 2 mol O₂: H₂ gives 3/2 = 1.5, O₂ gives 2/1 = 2.0; H₂ is limiting. This procedure works for any number of reactants.",
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
          "In a properly run experiment, no — that would violate conservation of mass. If a reported percent yield exceeds 100%, the product contains impurities (moisture, unreacted starting material) that inflate the measured mass, or there is a calculation error in the theoretical yield. An impure product appearing to give >100% yield is a signal to re-purify, not celebrate.",
      },
      {
        question: "How does AP Chem 4.A.1 connect to this simulation?",
        answer:
          "AP Chem 4.A.1 states that the amounts of products and reactants in a chemical reaction are determined by the stoichiometry of the balanced equation. The simulation makes this concrete: each molecule displayed is one unit of the mole count you set, the leftover molecules are the excess reagent, and the product count is the theoretical yield in mole units. Work through at least one problem of each reaction type (synthesis, decomposition, combustion) to cover the coefficient variety the AP exam uses.",
      },
    ],
  },
};
