import type { Experiment } from "@/shared/types/experiment";

export const solutionsDilutions: Experiment = {
  id: "solutions-dilutions",
  slug: "solutions-dilutions",
  title: "Solutions & Dilutions",
  subtitle: "Concentration, molarity, and the dilution equation",
  description:
    "Explore how adding solvent changes solution concentration. Prepare solutions of precise molarity, perform serial dilutions, and verify the dilution equation C₁V₁ = C₂V₂. Observe color intensity change as concentration varies.",
  thumbnail: "/imgs/experiments/solutions-dilutions.png",

  standards: {
    ngss: ["HS-PS1-7"],
    ap: ["3.A.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: [
    "solutions",
    "dilutions",
    "molarity",
    "concentration",
    "C1V1=C2V2",
    "AP Chemistry",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "initialConcentration",
      label: "Initial Concentration (C₁)",
      unit: "mol/L",
      min: 0.01,
      max: 2.0,
      default: 1.0,
      step: 0.01,
      tier: "free",
    },
    {
      id: "initialVolume",
      label: "Initial Volume (V₁)",
      unit: "mL",
      min: 1,
      max: 100,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "addedWater",
      label: "Added Water",
      unit: "mL",
      min: 0,
      max: 500,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "soluteType",
      label: "Solute (0=CuSO₄, 1=KMnO₄, 2=NaCl)",
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
      latex: "C_1 V_1 = C_2 V_2",
      description:
        "Dilution equation: initial concentration × initial volume = final concentration × final volume",
    },
    {
      latex: "M = \\frac{n}{V} = \\frac{\\text{moles of solute}}{\\text{liters of solution}}",
      description:
        "Molarity (M) is moles of solute per liter of solution",
    },
  ],

  theory:
    "When a solution is diluted by adding solvent, the amount of solute (in moles) remains constant. Only the volume changes, which decreases the concentration proportionally. The dilution equation C₁V₁ = C₂V₂ expresses this conservation: C₁ is the initial molarity, V₁ is the initial volume, C₂ is the final molarity, and V₂ is the final volume (V₁ + added water). Serial dilution is a technique where each step dilutes the previous solution by a fixed ratio, useful for preparing very low concentrations. Color intensity of many solutions is proportional to concentration (Beer-Lambert Law), providing a visual indicator of dilution progress.",

  instructions:
    "Select a solute and set the initial concentration with the slider. The beaker shows the solution color intensity corresponding to molarity. Add water with the slider to dilute — watch the color fade as concentration drops. The readout panel shows both predicted (C₁V₁/V₂) and actual concentration in real time.",

  challenges: [
    {
      id: "sd-c1",
      question: "If you have 50 mL of 2.0 M CuSO₄ and add 50 mL of water, what is the final concentration?",
      hint: "C₂ = C₁V₁/V₂ = (2.0)(50)/(100) = 1.0 M",
      tier: "free",
    },
    {
      id: "sd-c2",
      question: "How much water must you add to 10 mL of 1.0 M solution to make 0.1 M?",
      hint: "V₂ = C₁V₁/C₂ = (1.0)(10)/(0.1) = 100 mL → add 90 mL water",
      tier: "free",
    },
    {
      id: "sd-c3",
      question: "After 3 serial 1:10 dilutions starting from 1.0 M, what is the final concentration?",
      hint: "Each 1:10 dilution divides by 10: 1.0 → 0.1 → 0.01 → 0.001 M",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["beers-law-lab", "stoichiometry"],
  htmlPath: "/experiments/ap-chemistry/solutions-dilutions.html",

  seoTitle: "Solutions & Dilutions Interactive Lab | Scivra AP Chemistry",
  seoKeywords: [
    "dilution equation simulation",
    "molarity calculator interactive",
    "C1V1=C2V2 virtual lab",
    "solution concentration simulator",
    "AP Chemistry dilution",
    "serial dilution practice",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Solution Dilution and Molarity",
  },
};
