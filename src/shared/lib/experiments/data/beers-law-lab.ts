import type { Experiment } from "@/shared/types/experiment";

export const beersLawLab: Experiment = {
  id: "beers-law-lab",
  slug: "beers-law-lab",
  title: "Beer's Law Lab",
  subtitle: "Absorbance, transmittance, and spectrophotometry",
  description:
    "Explore the Beer-Lambert Law by adjusting solution concentration and path length to observe how light absorption changes. Use a virtual spectrophotometer to measure absorbance at different wavelengths, plot calibration curves, and determine unknown concentrations.",
  thumbnail: "/imgs/experiments/beers-law-lab.png",

  standards: {
    ngss: ["HS-PS4-5"],
    gcse: [],
    ap: ["3.C.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: [
    "Beer's Law",
    "absorbance",
    "spectrophotometry",
    "concentration",
    "calibration curve",
    "AP Chemistry",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "concentration",
      label: "Concentration",
      unit: "mol/L",
      min: 0,
      max: 1.0,
      default: 0.1,
      step: 0.01,
      tier: "free",
    },
    {
      id: "pathLength",
      label: "Path Length",
      unit: "cm",
      min: 0.5,
      max: 5.0,
      default: 1.0,
      step: 0.5,
      tier: "free",
    },
    {
      id: "wavelength",
      label: "Wavelength",
      unit: "nm",
      min: 400,
      max: 700,
      default: 520,
      step: 10,
      tier: "free",
    },
    {
      id: "solutionType",
      label: "Solution (0=CuSO₄, 1=KMnO₄, 2=CoCl₂)",
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
      latex: "A = \\varepsilon \\cdot b \\cdot c",
      description:
        "Beer-Lambert Law: A = absorbance, ε = molar absorptivity (L/(mol·cm)), b = path length (cm), c = concentration (mol/L)",
    },
    {
      latex: "A = -\\log_{10}(T) = -\\log_{10}\\left(\\frac{I}{I_0}\\right)",
      description:
        "Absorbance from transmittance: T = I/I₀ = fraction of light transmitted",
    },
  ],

  theory:
    "Beer-Lambert Law states that absorbance is directly proportional to both the concentration of the absorbing species and the path length of light through the solution. A = εbc, where ε is the molar absorptivity (a constant for each substance at a given wavelength), b is the path length in cm, and c is the molar concentration. Transmittance T = I/I₀ is the fraction of light that passes through. A = -log₁₀(T). A calibration curve (A vs c) at fixed wavelength and path length gives a straight line through the origin. The slope is εb. To find an unknown concentration, measure its absorbance and read from the calibration curve. Deviations from Beer's Law occur at high concentrations (>0.01 M for most species) due to intermolecular interactions.",

  instructions:
    "Select a solution type and adjust concentration with the slider. Observe the solution color change in the cuvette — darker = more concentrated. The spectrophotometer beam passes through and measures absorbance. Try different path lengths and wavelengths. The graph plots absorbance vs concentration in real time.",

  challenges: [
    {
      id: "bl-c1",
      question: "If a 0.1 M CuSO₄ solution has A = 0.5 at 635 nm in a 1 cm cuvette, what is ε?",
      hint: "A = εbc → ε = A/(bc) = 0.5/(1 × 0.1) = 5 L/(mol·cm)",
      tier: "free",
    },
    {
      id: "bl-c2",
      question: "If you double the concentration, what happens to the absorbance?",
      hint: "A = εbc is linear: doubling c doubles A (within Beer's Law range).",
      tier: "free",
    },
    {
      id: "bl-c3",
      question: "An unknown solution has A = 0.35 at 520 nm. From the calibration curve, ε = 3.5 L/(mol·cm) at this wavelength with b = 1 cm. Find the concentration.",
      hint: "c = A/(εb) = 0.35/(3.5 × 1) = 0.1 mol/L",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["thermochemistry", "solutions-dilutions"],
  htmlPath: "/experiments/ap-chemistry/beers-law-lab.html",

  seoTitle: "Beer's Law Lab Interactive Spectrophotometer | Scivra AP Chemistry",
  seoKeywords: [
    "Beer's Law simulation",
    "spectrophotometer virtual lab",
    "absorbance concentration calculator",
    "calibration curve interactive",
    "AP Chemistry Beer Lambert",
    "spectrophotometry simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Beer-Lambert Law and Spectrophotometry",
  },
};
