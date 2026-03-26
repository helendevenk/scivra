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

  seoTitle: "Thermochemistry Hess's Law Interactive | NeonPhysics AP Chemistry",
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
};
