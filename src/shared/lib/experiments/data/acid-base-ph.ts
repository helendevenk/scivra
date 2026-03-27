import type { Experiment } from "@/shared/types/experiment";

export const acidBasePh: Experiment = {
  id: "acid-base-ph",
  slug: "acid-base-ph",
  title: "Acid-Base Chemistry & pH",
  subtitle: "Proton transfer, titration curves, and buffer systems",
  description:
    "Explore the proton-transfer nature of acid-base reactions. Watch pH change in real time as you mix acids and bases. Run a titration simulation with a live titration curve — identify the equivalence point and buffer region. Compare strong vs weak acids and design buffer solutions.",
  thumbnail: "/imgs/experiments/acid-base-ph.png",

  standards: {
    ngss: ["HS-PS1-7"],
    gcse: ["C7.3", "C7.4"],
    ap: ["8.A.1", "8.B.1", "8.C.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "9-12",
  tags: ["acid-base", "pH", "titration", "buffer", "Ka Kb", "AP Chemistry"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "acidConc",
      label: "Acid Concentration",
      unit: "mol/L",
      min: 0.001,
      max: 1.0,
      default: 0.1,
      step: 0.001,
      tier: "free",
    },
    {
      id: "acidType",
      label: "Acid Type (0=HCl strong, 1=CH₃COOH weak, 2=H₂SO₄ diprotic)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "baseVolume",
      label: "NaOH Added (titration)",
      unit: "mL",
      min: 0,
      max: 50,
      default: 0,
      step: 0.5,
      tier: "free",
    },
    {
      id: "bufferSalt",
      label: "Add Conjugate Base (CH₃COO⁻)",
      unit: "mol/L",
      min: 0,
      max: 0.5,
      default: 0,
      step: 0.05,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\text{pH} = -\\log[\\text{H}^+] \\quad K_w = [\\text{H}^+][\\text{OH}^-] = 10^{-14}",
      description: "pH definition and water's ion product at 25°C",
    },
    {
      latex: "\\text{pH} = \\text{p}K_a + \\log\\frac{[\\text{A}^-]}{[\\text{HA}]} \\quad (\\text{Henderson-Hasselbalch})",
      description: "Buffer pH — Henderson-Hasselbalch equation",
    },
    {
      latex: "K_a = \\frac{[\\text{H}^+][\\text{A}^-]}{[\\text{HA}]} \\quad (\\text{weak acid dissociation constant})",
      description: "Ka defines weak acid strength (CH₃COOH: Ka = 1.8×10⁻⁵)",
    },
  ],

  theory:
    "Acids donate protons (H⁺); bases accept protons (Brønsted-Lowry definition). Strong acids (HCl, H₂SO₄, HNO₃) dissociate completely: [H⁺] = initial acid concentration. Weak acids partially dissociate; Ka = [H⁺][A⁻]/[HA]. pH = -log[H⁺]. At 25°C, Kw = [H⁺][OH⁻] = 10⁻¹⁴; neutral pH = 7. Titration: adding strong base to acid gradually neutralizes it. The equivalence point is where moles of base = moles of acid (pH = 7 for strong/strong, > 7 for weak acid/strong base). The buffer region (±1 unit from pKa) resists pH changes. Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]). Maximum buffer capacity when [A⁻] = [HA] (pH = pKa).",

  instructions:
    "Start with an acid solution and observe the initial pH. Move the NaOH slider to perform a titration — watch the S-shaped titration curve. Identify: the initial pH (from Ka), the buffer region (flat slope), the equivalence point (steep jump), and the post-equivalence rise. Add conjugate base (Pro) to design a buffer solution.",

  challenges: [
    {
      id: "ab-c1",
      question: "What is the pH of 0.01 M HCl?",
      hint: "HCl is a strong acid → fully dissociates. [H⁺] = 0.01 M. pH = -log(0.01) = 2.",
      tier: "free",
    },
    {
      id: "ab-c2",
      question: "Calculate the pH of 0.1 M acetic acid (Ka = 1.8×10⁻⁵).",
      hint: "Ka = x²/(0.1-x) ≈ x²/0.1. x = √(0.1×1.8×10⁻⁵) = √(1.8×10⁻⁶) = 1.34×10⁻³ M. pH = -log(1.34×10⁻³) ≈ 2.87.",
      tier: "free",
    },
    {
      id: "ab-c3",
      question: "Design a buffer with pH = 5.0 using acetic acid (pKa = 4.74). What ratio of [CH₃COO⁻]/[CH₃COOH] is needed?",
      hint: "pH = pKa + log([A⁻]/[HA]). 5.0 = 4.74 + log(ratio). log(ratio) = 0.26. Ratio = 10^0.26 = 1.82. So [CH₃COO⁻]/[CH₃COOH] ≈ 1.82.",
      tier: "free",
    },
    {
      id: "ab-c4",
      question: "50 mL of 0.1 M CH₃COOH is titrated with 0.1 M NaOH. What is the pH at the equivalence point, and why?",
      hint: "At equivalence, all acid is converted to CH₃COO⁻ (acetate). 0.005 mol CH₃COO⁻ in 100 mL = 0.05 M. Kb(CH₃COO⁻) = Kw/Ka = 10⁻¹⁴/1.8×10⁻⁵ = 5.6×10⁻¹⁰. [OH⁻] ≈ √(0.05×5.6×10⁻¹⁰) = 5.3×10⁻⁶. pOH = 5.3, pH = 8.7 (basic, as expected).",
      tier: "pro",
    },
  ],

  wave: 4,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["chemical-equilibrium", "electrochemistry"],

  seoTitle: "Acid-Base pH Titration Interactive | NeonPhysics AP Chemistry",
  seoKeywords: [
    "acid base pH simulation",
    "titration curve interactive",
    "buffer solution Henderson-Hasselbalch",
    "Ka Kb calculator",
    "AP Chemistry acid base",
    "pH indicator simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Acid-Base Chemistry and pH",
  },
};
