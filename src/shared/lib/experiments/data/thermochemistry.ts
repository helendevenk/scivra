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
      id: "enthalpyChange",
      label: "Enthalpy Change",
      unit: "kJ/mol",
      min: -400,
      max: 400,
      default: -100,
      step: 5,
      tier: "free",
    },
    {
      id: "entropyChange",
      label: "Entropy Change",
      unit: "J/(mol·K)",
      min: -200,
      max: 200,
      default: 100,
      step: 5,
      tier: "free",
    },
    {
      id: "temperature",
      label: "Temperature",
      unit: "K",
      min: 100,
      max: 1000,
      default: 298,
      step: 10,
      tier: "free",
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
    "Use the Enthalpy Change, Entropy Change, and Temperature sliders to test when ΔG = ΔH − TΔS becomes negative or positive. Try the Exothermic Spontaneous, Endothermic (high T), and ΔG Analysis presets, then adjust one slider at a time to see how molecular order, energy level, equilibrium, and spontaneity respond.",

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
  htmlControlAliases: {
    enthalpyChange: "sl-dH",
    entropyChange: "sl-dS",
    temperature: "sl-T",
  },
  presets: [
    {
      id: "loadPreset:0",
      label: "✅ Exothermic Spontaneous",
      description:
        "Loads a reaction with negative ΔH and positive ΔS so students can see why both energy release and increasing disorder strongly favor negative ΔG.",
    },
    {
      id: "loadPreset:1",
      label: "🌡️ Endothermic (high T)",
      description:
        "Loads an endothermic case where positive ΔS can make the process spontaneous at high temperature because the TΔS term grows large enough to overcome ΔH.",
    },
    {
      id: "loadPreset:2",
      label: "📊 ΔG Analysis",
      description:
        "Loads a mixed-sign case for comparing ΔH and TΔS directly, showing how lower temperature can favor spontaneity when both ΔH and ΔS are negative.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Thermochemistry is the branch of chemistry that quantifies energy changes — primarily enthalpy (H) — during chemical reactions at constant pressure. An exothermic reaction releases energy (ΔH < 0): the products sit lower on the energy diagram than the reactants, and the surroundings warm up. An endothermic reaction absorbs energy (ΔH > 0): products sit higher, and the surroundings cool down. ΔH can be calculated from standard enthalpies of formation (ΔH_rxn = ΣΔH_f°(products) − ΣΔH_f°(reactants)), from bond energies, or assembled via Hess's Law — any multi-step pathway whose steps sum to the target equation. This simulation animates energy diagrams for combustion, neutralization, dissolution, and photosynthesis, and lets you build Hess's Law pathways step by step.",
    parameterExplanations: {
      enthalpyChange:
        "Enthalpy Change sets ΔH, the heat absorbed or released by the reaction at constant pressure, in kJ/mol. Negative values model exothermic processes whose products sit lower in enthalpy than the reactants; positive values model endothermic processes that require energy input. In the ΔG equation, ΔH is the starting energy term before entropy and temperature are considered. Move this slider while holding ΔS and T fixed to see that a more negative ΔH pushes ΔG downward, while a more positive ΔH can make spontaneity depend on the TΔS contribution.",
      entropyChange:
        "Entropy Change sets ΔS, the change in dispersal or disorder, in J/(mol·K). Positive ΔS means the products have more available microstates than the reactants, such as when gas particles increase or a solid dissolves into mobile ions. Negative ΔS means the products are more ordered. Because the simulation calculates TΔS in kJ/mol, the entropy value is divided by 1000 before combining with ΔH. Keep ΔH fixed and raise temperature to see why positive ΔS becomes increasingly favorable at high T, while negative ΔS becomes a larger penalty.",
      temperature:
        "Temperature sets the absolute temperature in kelvin, the scale required for thermodynamic equations. It controls how strongly entropy affects spontaneity through the TΔS term in ΔG = ΔH − TΔS. At low temperature, ΔH often dominates because TΔS is small. At high temperature, entropy can outweigh enthalpy, making some endothermic but disorder-increasing reactions spontaneous. Try the Endothermic (high T) preset, then lower Temperature until ΔG changes sign. This shows that spontaneity is not fixed by ΔH alone; it can depend on classroom or lab conditions.",
    },
    misconceptions: [
      {
        wrong: "Exothermic reactions are always spontaneous.",
        correct:
          "A negative ΔH helps make ΔG negative, but spontaneity depends on both enthalpy and entropy: ΔG = ΔH − TΔS. If ΔS is strongly negative, the TΔS term becomes a penalty, especially at high temperature. Use a negative ΔH with a negative ΔS to see that an exothermic process can become nonspontaneous under some conditions.",
      },
      {
        wrong:
          "Endothermic reactions can never be spontaneous because they absorb heat.",
        correct:
          "Endothermic means ΔH is positive, so enthalpy alone is unfavorable. A reaction can still be spontaneous if ΔS is positive and the temperature is high enough for TΔS to exceed ΔH. The Endothermic (high T) preset demonstrates this: the reaction absorbs heat, but the entropy gain can still make ΔG negative.",
      },
      {
        wrong: "Entropy is the same thing as heat.",
        correct:
          "Entropy measures energy dispersal and the number of accessible microstates, not heat itself. Heat flow is connected to enthalpy and temperature, while entropy describes how spread out matter and energy can become. The units are different too: ΔH is kJ/mol, while ΔS is J/(mol·K), so the simulation converts TΔS before comparing it with ΔH.",
      },
      {
        wrong:
          "Temperature only changes reaction speed, not thermodynamic favorability.",
        correct:
          "Temperature can affect both rate and spontaneity, but in different ways. Kinetics uses temperature to explain how often molecules overcome activation barriers. Thermodynamics uses temperature in ΔG = ΔH − TΔS. Changing Temperature in this simulation changes the TΔS term and can flip whether the reaction is thermodynamically favored.",
      },
      {
        wrong: "A negative ΔG means products form instantly and completely.",
        correct:
          "Negative ΔG means the forward direction is thermodynamically favored under the selected conditions, not that it is fast or goes to 100% completion. A reaction can be spontaneous but slow if the activation barrier is high. The equilibrium readout connects ΔG to favorability, while kinetics would be needed to predict how quickly the change occurs.",
      },
    ],
    teacherUseCases: [
      "ΔG sign prediction: choose the Exothermic Spontaneous preset, hide the readout briefly, and ask students to predict the sign of ΔG from ΔH, ΔS, and T before revealing the calculation.",
      "Temperature threshold investigation: start with the Endothermic (high T) preset, lower Temperature in steps, and have students identify where ΔG changes sign. Connect the threshold to AP 5.C.1 reasoning about ΔG = ΔH − TΔS.",
      "Units and conversion check: have students calculate TΔS by hand using ΔS in J/(mol·K), convert to kJ/mol, and compare their result with the simulation display.",
      "Entropy misconception probe: keep ΔH fixed, switch ΔS from positive to negative, and ask students to explain the molecular order changes shown by the particle visualization.",
      "Preset comparison CER: assign each group one preset and require a claim about spontaneity, evidence from the three slider values, and reasoning that references both enthalpy and entropy.",
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
          "AP 5.A.1 covers energy diagrams and the classification of reactions as exothermic or endothermic, which students practice by reading the ΔH slider and energy display. AP 5.B.1 connects bond energy and formation enthalpy calculations to the meaning of ΔH. AP 5.C.1 covers thermodynamic favorability, state functions, and ΔG reasoning, practiced by adjusting ΔH, ΔS, and Temperature to test when ΔG becomes negative.",
      },
      {
        question: "How much energy does burning 1 mol of methane release, and where does it go?",
        answer:
          "CH₄ + 2O₂ → CO₂ + 2H₂O releases ΔH° ≈ −890 kJ/mol. That energy transfers as heat to the surroundings — warming air, water, or a calorimeter. The products CO₂ and H₂O have lower enthalpy than the reactants; that stored chemical energy is converted to thermal energy. About 890 kJ can heat roughly 2.8 kg of water from 25°C to 100°C (without including the latent heat of vaporization).",
      },
    ],
  },
};
