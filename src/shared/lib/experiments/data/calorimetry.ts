import type { Experiment } from "@/shared/types/experiment";

export const calorimetry: Experiment = {
  id: "calorimetry",
  slug: "calorimetry",
  title: "Calorimetry",
  subtitle: "Heat transfer, specific heat, and enthalpy changes",
  description:
    "Perform virtual calorimetry experiments by mixing solutions at different temperatures. Observe temperature changes in real time, calculate heat transfer using q = mcΔT, and determine enthalpy of reaction. Explore Hess's Law through multi-step reactions.",
  thumbnail: "/imgs/experiments/calorimetry.png",

  standards: {
    ngss: ["HS-PS3-1", "HS-PS3-4"],
    gcse: [],
    ap: ["6.A.1", "6.B.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: [
    "calorimetry",
    "heat transfer",
    "specific heat",
    "enthalpy",
    "q=mcΔT",
    "Hess's Law",
    "AP Chemistry",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "massA",
      label: "Mass of Solution A",
      unit: "g",
      min: 10,
      max: 200,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "tempA",
      label: "Temperature of Solution A",
      unit: "°C",
      min: 0,
      max: 100,
      default: 25,
      step: 1,
      tier: "free",
    },
    {
      id: "massB",
      label: "Mass of Solution B",
      unit: "g",
      min: 10,
      max: 200,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "tempB",
      label: "Temperature of Solution B",
      unit: "°C",
      min: 0,
      max: 100,
      default: 75,
      step: 1,
      tier: "free",
    },
    {
      id: "reactionType",
      label: "Reaction (0=mixing, 1=acid-base, 2=dissolution)",
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
      latex: "q = mc\\Delta T",
      description:
        "Heat transfer: q = heat (J), m = mass (g), c = specific heat capacity (J/(g·°C)), ΔT = temperature change (°C)",
    },
    {
      latex: "q_{\\text{lost}} + q_{\\text{gained}} = 0",
      description:
        "Conservation of energy in a calorimeter: heat lost by hot substance equals heat gained by cold substance",
    },
    {
      latex: "\\Delta H_{\\text{rxn}} = -\\frac{q_{\\text{solution}}}{n}",
      description:
        "Enthalpy of reaction per mole: negative of heat absorbed by solution divided by moles of limiting reagent",
    },
  ],

  theory:
    "Calorimetry measures heat changes during chemical or physical processes. In a coffee-cup calorimeter (constant pressure), the heat released or absorbed by a reaction is captured by the surrounding solution. Using q = mcΔT, where c for dilute aqueous solutions ≈ 4.184 J/(g·°C), we calculate q_solution. By conservation of energy, q_rxn = -q_solution. The molar enthalpy ΔH_rxn = q_rxn/n (per mole of limiting reagent). For mixing two solutions at different temperatures (no reaction), the final temperature is the weighted average: T_f = (m₁c₁T₁ + m₂c₂T₂)/(m₁c₁ + m₂c₂). Hess's Law states that ΔH for an overall reaction equals the sum of ΔH values for individual steps, regardless of the path taken.",

  instructions:
    "Set the mass and temperature of two solutions, then choose a reaction type. Press 'Mix' to combine them in the virtual calorimeter. Watch the temperature curve update in real time as thermal equilibrium is reached. The data panel calculates q, ΔT, and ΔH automatically.",

  challenges: [
    {
      id: "cal-c1",
      question: "50 g of water at 80°C is mixed with 50 g at 20°C. What is the final temperature?",
      hint: "T_f = (50×80 + 50×20)/(50+50) = 50°C (equal masses, simple average)",
      tier: "free",
    },
    {
      id: "cal-c2",
      question: "100 g of solution rises by 5.2°C in a neutralization. What is q? (c = 4.184 J/(g·°C))",
      hint: "q = mcΔT = 100 × 4.184 × 5.2 = 2175.7 J ≈ 2.18 kJ",
      tier: "free",
    },
    {
      id: "cal-c3",
      question: "If the neutralization used 0.050 mol HCl, what is ΔH per mole?",
      hint: "ΔH = -q/n = -2176/0.050 = -43,520 J/mol ≈ -43.5 kJ/mol",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["thermochemistry", "beers-law-lab"],
  htmlPath: "/experiments/ap-chemistry/calorimetry.html",

  seoTitle: "Calorimetry Virtual Lab | Scivra AP Chemistry",
  seoKeywords: [
    "calorimetry simulation",
    "q=mcΔT calculator",
    "enthalpy virtual lab",
    "heat transfer interactive",
    "AP Chemistry calorimetry",
    "specific heat experiment",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Calorimetry and Heat Transfer",
  },
};
