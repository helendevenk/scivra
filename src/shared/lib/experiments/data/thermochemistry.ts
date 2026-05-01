import type { Experiment } from "@/shared/types/experiment";

export const thermochemistry: Experiment = {
  id: "thermochemistry",
  slug: "thermochemistry",
  title: "Thermochemistry & Hess's Law",
  subtitle: "Energy in chemical reactions — exothermic vs endothermic",
  description:
    "Explore how energy flows in chemical reactions. Watch exothermic reactions release heat (reactants glow red, temperature rises) and endothermic reactions absorb heat (products cool, temperature drops). Build energy diagrams, calculate ΔH from bond energies, and apply Hess's Law to combine reactions.",
  thumbnail: "/imgs/experiments/thermochemistry.png",

  standards: {
    ngss: ["HS-PS1-4", "HS-PS3-1"],
    gcse: ["C6.3", "C6.4"],
    ap: ["5.A.1", "5.B.1", "5.C.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: ["thermochemistry", "enthalpy", "Hess's law", "bond energy", "exothermic", "AP Chemistry"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "reactionType",
      label: "Reaction (0=combustion, 1=neutralization, 2=dissolution, 3=photosynthesis)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "moles",
      label: "Moles of Reactant",
      unit: "mol",
      min: 0.5,
      max: 5,
      default: 1,
      step: 0.5,
      tier: "free",
    },
    {
      id: "calorimeter",
      label: "Calorimeter Heat Capacity",
      unit: "J/°C",
      min: 100,
      max: 1000,
      default: 400,
      step: 50,
      tier: "pro",
    },
    {
      id: "hessCombine",
      label: "Hess's Law Step (1-3)",
      unit: "",
      min: 1,
      max: 3,
      default: 1,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\Delta H_{rxn} = \\sum \\Delta H_f(\\text{products}) - \\sum \\Delta H_f(\\text{reactants})",
      description: "Standard enthalpy of reaction from formation enthalpies",
    },
    {
      latex: "\\Delta H_{rxn} = \\sum BE(\\text{bonds broken}) - \\sum BE(\\text{bonds formed})",
      description: "ΔH from bond energies (energy in = bonds broken, out = bonds formed)",
    },
    {
      latex: "q = mc\\Delta T \\quad (\\text{calorimetry})",
      description: "Heat measured in a calorimeter: mass × specific heat × ΔT",
    },
  ],

  theory:
    "Thermochemistry studies energy changes in chemical reactions. Enthalpy (H) is heat flow at constant pressure. Exothermic reactions release heat (ΔH < 0): combustion, neutralization, most phase changes from gas → liquid → solid. Endothermic reactions absorb heat (ΔH > 0): photosynthesis, dissolving NH₄NO₃, most decompositions. Bond energy approach: breaking bonds requires energy (endothermic), forming bonds releases energy (exothermic). ΔH = energy in (break bonds) - energy out (form bonds). Hess's Law: ΔH for a reaction equals the sum of ΔH for any series of steps with the same overall equation — enthalpy is a state function (path-independent). Standard enthalpies of formation (ΔHf°) are measured for 1 mol from elements in standard state.",

  instructions:
    "Select a reaction type and watch the energy diagram animate. In Combustion mode, CH₄ + O₂ → CO₂ + H₂O releases −890 kJ/mol. Drag the activation energy hill to see transition state. Switch to Hess's Law mode to build complex reactions from simpler steps — add or reverse steps and watch ΔH accumulate.",

  challenges: [
    {
      id: "tc-c1",
      question: "Burning 1 mol of propane (C₃H₈) releases 2220 kJ. How much heat is released burning 44 g of propane? (M = 44 g/mol)",
      hint: "44 g / 44 g/mol = 1 mol → 2220 kJ released.",
      tier: "free",
    },
    {
      id: "tc-c2",
      question: "Using bond energies: H₂ + Cl₂ → 2HCl. H-H = 432, Cl-Cl = 243, H-Cl = 431 kJ/mol. Calculate ΔH.",
      hint: "Bonds broken: H-H (432) + Cl-Cl (243) = 675. Bonds formed: 2×H-Cl = 2×431 = 862. ΔH = 675 - 862 = -187 kJ.",
      tier: "free",
    },
    {
      id: "tc-c3",
      question: "Dissolving 8 g of NH₄NO₃ in water cools 100 g of water from 25°C to 19°C. Calculate ΔH in kJ/mol. (c_water = 4.18 J/g°C, M(NH₄NO₃) = 80 g/mol)",
      hint: "q_water = 100×4.18×(-6) = -2508 J (water lost heat). ΔH_rxn = +2508 J for 0.1 mol → +25080 J/mol = +25.1 kJ/mol (endothermic).",
      tier: "free",
    },
    {
      id: "tc-c4",
      question: "Use Hess's Law: C(s)+O₂(g)→CO₂(g), ΔH₁=-393. CO(g)+½O₂(g)→CO₂(g), ΔH₂=-283. Find ΔH for C(s)+½O₂(g)→CO(g).",
      hint: "Target = Eq1 - Eq2. ΔH = ΔH₁ - ΔH₂ = -393 - (-283) = -110 kJ/mol.",
      tier: "pro",
    },
  ],

  wave: 4,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["reaction-kinetics", "chemical-equilibrium"],

  seoTitle: "Thermochemistry Hess's Law Interactive | Scivra AP Chemistry",
  seoKeywords: [
    "thermochemistry simulation",
    "Hess's law interactive",
    "enthalpy diagram",
    "bond energy calculator",
    "AP Chemistry thermochemistry",
    "calorimetry interactive",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Thermochemistry and Hess's Law",
  },
  contentSections: {
    whatIsIt:
      "Thermochemistry is the branch of chemistry that quantifies energy changes — primarily enthalpy (H) — during chemical reactions at constant pressure. An exothermic reaction releases energy (ΔH < 0): the products sit lower on the energy diagram than the reactants, and the surroundings warm up. An endothermic reaction absorbs energy (ΔH > 0): products sit higher, and the surroundings cool down. ΔH can be calculated from standard enthalpies of formation (ΔH_rxn = ΣΔH_f°(products) − ΣΔH_f°(reactants)), from bond energies, or assembled via Hess's Law — any multi-step pathway whose steps sum to the target equation. This simulation animates energy diagrams for combustion, neutralization, dissolution, and photosynthesis, and lets you build Hess's Law pathways step by step.",
    parameterExplanations: {
      reactionType:
        "Selects the reaction scenario: 0 = methane combustion (CH₄ + 2O₂ → CO₂ + 2H₂O, ΔH° ≈ −890 kJ/mol), 1 = acid-base neutralization (ΔH° ≈ −57 kJ/mol), 2 = dissolution (NH₄NO₃, ΔH° ≈ +26 kJ/mol, endothermic), 3 = photosynthesis (ΔH° ≈ +2803 kJ/mol). Each mode updates the energy diagram, ΔH readout, and calorimetry graph.",
      moles:
        "The number of moles of limiting reactant (0.5–5 mol, default 1 mol). Total heat released or absorbed scales linearly: 2 mol of methane combusted releases 2 × 890 = 1780 kJ. This parameter demonstrates that ΔH values are always quoted per mole of reaction as written.",
      calorimeter:
        "The heat capacity of the calorimeter in J/°C (100–1000 J/°C, default 400 J/°C). A higher heat capacity means the calorimeter itself absorbs more energy, dampening the observed ΔT. Used in the corrected equation q_rxn = −(q_solution + C_cal × ΔT).",
      hessCombine:
        "Selects which Hess's Law step (1, 2, or 3) is currently displayed in Hess mode. Stepping through 1 → 2 → 3 builds up the target reaction; ΔH values accumulate, showing that the sum of pathway ΔH equals the direct ΔH — path independence in action.",
    },
    misconceptions: [
      {
        wrong:
          "Exothermic means the reaction vessel feels hot because the reaction itself is hot.",
        correct:
          "Exothermic means the system (reactants → products) loses energy — ΔH < 0. That energy transfers to the surroundings, so the solution and container warm up. The SYSTEM's energy decreases; it is the surroundings that gain heat and register a temperature rise.",
      },
      {
        wrong:
          "Activation energy is the energy released by the reaction — a higher Eₐ means more heat given off.",
        correct:
          "Eₐ is the energy barrier molecules must overcome to reach the transition state; ΔH is the difference between product and reactant energies. Combustion of methane has ΔH° ≈ −890 kJ/mol yet requires a spark to initiate because Eₐ is substantial. The two quantities are independent.",
      },
      {
        wrong:
          "Hess's Law only works if the steps happen physically in sequence in the lab.",
        correct:
          "Hess's Law works because enthalpy is a state function — its value depends only on initial and final states, not the path. You can use tabulated ΔH_f° values for steps that are impossible to perform directly in a lab, and the sum is still valid for the overall reaction.",
      },
      {
        wrong:
          "Bond breaking is exothermic because you are 'releasing' atoms from the bond.",
        correct:
          "Bond breaking is endothermic — energy must be supplied to pull atoms apart against their attractive interaction. Bond formation is exothermic. ΔH = energy in (break bonds) − energy out (form bonds); a negative result means more energy was released forming new bonds than was consumed breaking old ones.",
      },
      {
        wrong:
          "Reversing a reaction does not change the magnitude of ΔH, only the products and reactants.",
        correct:
          "Reversing a reaction flips the sign of ΔH: if A → B has ΔH = −200 kJ/mol, then B → A has ΔH = +200 kJ/mol. This sign flip is fundamental to constructing Hess's Law pathways — multiplying a reaction by a coefficient also multiplies ΔH by that factor.",
      },
    ],
    teacherUseCases: [
      "Exo/endothermic classification: display each reaction type one at a time and ask students to predict from the energy diagram — before reading the ΔH number — whether the reaction is exothermic or endothermic. Builds skill at reading energy diagrams, which appear regularly in AP 5.A.1 free-response.",
      "Hess's Law construction exercise: give students the two known ΔH values for C + O₂ → CO₂ and CO + ½O₂ → CO₂, then have them use the hessCombine slider to build the target reaction C + ½O₂ → CO. Verify the algebraic result matches the simulation output.",
      "Bond energy data collection: using the bond-energy formula display, students look up H-H (432), Cl-Cl (243), and H-Cl (431 kJ/mol) and calculate ΔH for H₂ + Cl₂ → 2HCl, then compare to the simulation's ΔH readout. Addresses AP 5.B.1 bond-energy calculation skill.",
      "Moles scaling investigation: students record ΔT for 0.5, 1, 2, and 3 mol of combustion and confirm that heat scales linearly with moles. Then pose: 'if you burned 88 g of methane (M = 16), how much heat is released?' Bridges dimensional analysis with thermochemistry.",
      "Misconception probe — activation energy vs. ΔH: set reactionType to combustion, note the large negative ΔH, then ask 'so why does this candle need a flame to start?' The discussion targets the confusion between Eₐ and ΔH and sets up the role of activation energy in kinetics.",
    ],
    faq: [
      {
        question: "What is the difference between ΔH and ΔE in thermochemistry?",
        answer:
          "ΔH (enthalpy change) is heat flow at constant pressure; ΔE (internal energy change) is heat flow at constant volume. They differ by the PΔV work term: ΔH = ΔE + PΔV. For reactions in solution where Δn_gas = 0, the difference is negligible. For gas-phase reactions with significant Δn_gas, the correction is ΔH = ΔE + Δn_gas·RT. AP Chemistry focuses almost exclusively on ΔH.",
      },
      {
        question: "How do I use standard enthalpies of formation to calculate ΔH_rxn?",
        answer:
          "Look up ΔH_f° for every product and reactant from a standard table (elements in standard state have ΔH_f° = 0). Apply ΔH_rxn = Σ[n·ΔH_f°(products)] − Σ[n·ΔH_f°(reactants)], where n is the stoichiometric coefficient. For CH₄ combustion: ΔH = [ΔH_f°(CO₂) + 2·ΔH_f°(H₂O)] − [ΔH_f°(CH₄)] = [−393.5 + 2(−285.8)] − (−74.8) ≈ −890 kJ/mol.",
      },
      {
        question: "Why is enthalpy called a 'state function'?",
        answer:
          "A state function depends only on the current state of a system — its temperature, pressure, and composition — not on how it got there. Because H is a state function, ΔH for a reaction is the same regardless of the pathway taken. Hess's Law is a direct consequence: any sequence of steps that starts and ends at the same states gives the same total ΔH.",
      },
      {
        question: "Can ΔH be calculated from bond energies alone?",
        answer:
          "Yes, approximately. Sum the bond dissociation energies of all bonds broken (endothermic) and subtract the sum for all bonds formed (exothermic): ΔH ≈ ΣBE(broken) − ΣBE(formed). Bond energies are average values, so the result is less precise than using ΔH_f° tables. For H₂ + Cl₂ → 2HCl: ΔH ≈ (432 + 243) − 2(431) = −187 kJ/mol.",
      },
      {
        question: "How do AP Chemistry standards 5.A.1, 5.B.1, and 5.C.1 map to this simulation?",
        answer:
          "AP 5.A.1 covers energy diagrams and the classification of reactions as exothermic or endothermic — practiced via the reactionType selector and energy diagram view. AP 5.B.1 covers bond energy and formation enthalpy calculations — practiced in the bond-energy formula. AP 5.C.1 covers Hess's Law and state functions — practiced directly with the hessCombine slider and multi-step pathway construction.",
      },
      {
        question: "How much energy does burning 1 mol of methane release, and where does it go?",
        answer:
          "CH₄ + 2O₂ → CO₂ + 2H₂O releases ΔH° ≈ −890 kJ/mol. That energy transfers as heat to the surroundings — warming air, water, or a calorimeter. The products CO₂ and H₂O have lower enthalpy than the reactants; that stored chemical energy is converted to thermal energy. About 890 kJ can raise roughly 2 kg of water from 25°C to 131°C.",
      },
    ],
  },
};
