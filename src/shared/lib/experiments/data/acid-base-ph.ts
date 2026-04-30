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

  seoTitle: "Acid-Base pH Titration Interactive | Scivra AP Chemistry",
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

  contentSections: {
    whatIsIt:
      "pH is the negative log of the hydrogen ion concentration: pH = −log[H+]. A pH of 1 is 100,000 times more acidic than a pH of 6 — small numbers, huge differences. Strong acids (HCl, HNO3) fully dissociate in water; weak acids (acetic acid, citric acid) only partially dissociate, set by their Ka. Titration tracks pH as you add base to an acid (or vice versa) and shows the equivalence point — the moment moles of base equal moles of acid. Buffers are mixtures of weak acid plus its conjugate base that resist pH changes. Tweak acid concentration, pick acid type, run a titration in this lab, and watch the pH curve evolve in real time.",
    parameterExplanations: {
      acidConc:
        "Initial concentration of the acid. Higher concentration = lower starting pH (more H+). Affects the height of the pre-equivalence plateau on the titration curve.",
      acidType:
        "Switch between strong (HCl) and weak (acetic, citric, etc). Strong acids start at lower pH for the same concentration and have a sharper equivalence-point jump. Weak acids show a flat buffer region around their pKa.",
      baseVolume:
        "Volume of strong base added during titration. Drives the curve from acidic through neutral to basic. The equivalence point is where moles of base = moles of acid added.",
      bufferSalt:
        "Adds the conjugate-base salt to a weak acid solution to make a buffer. Use this to demonstrate that a weak acid + its conjugate base resists pH changes when small amounts of acid or base are added.",
    },
    misconceptions: [
      {
        wrong:
          "A strong acid has a low pH; a weak acid has a high pH.",
        correct:
          "Strength refers to how completely the acid dissociates, not the pH directly. A 0.001 M HCl (strong) has pH 3; a 1 M acetic acid (weak) also has pH around 2.4. Concentration matters as much as strength.",
      },
      {
        wrong:
          "The equivalence point of a titration is always at pH 7.",
        correct:
          "Only true for strong acid + strong base. A weak acid + strong base titration has its equivalence point above 7 (the conjugate base is slightly basic). A weak base + strong acid finishes below 7. The equivalence point is where moles balance, not where pH = 7.",
      },
      {
        wrong:
          "A buffer prevents pH from changing at all.",
        correct:
          "A buffer resists pH change but doesn't prevent it. Adding small amounts of acid or base shifts pH a little; adding too much exceeds the buffer's capacity and pH crashes or spikes. Buffer capacity scales with the concentration of weak acid and conjugate base.",
      },
      {
        wrong:
          "pH 7 is neutral on every planet, every temperature.",
        correct:
          "pH 7 is neutral at 25°C in water. At higher temperatures, water self-ionizes more, so neutral pH drops below 7 (around 6.1 at 100°C). The 'neutral' point is whatever pH equals 0.5 × pKw at that temperature.",
      },
    ],
    teacherUseCases: [
      "Strong vs. weak comparison: titrate the same concentration of HCl and acetic acid with NaOH. Have students compare the curves and identify which features differ (starting pH, buffer region, equivalence point pH, sharpness of jump).",
      "Buffer demo: prepare a buffer in the lab, add small amounts of strong acid and strong base, and have students explain why the pH barely budges. Compare to pure water under the same additions.",
      "Henderson-Hasselbalch practice: at the half-equivalence point of a weak acid titration, pH = pKa. Have students locate this point on the curve and read off the pKa.",
      "Indicator selection: discuss why phenolphthalein (changes around pH 8-10) works for weak acid + strong base titrations but not strong acid + weak base titrations.",
      "Real-world tie-in: relate buffers to blood (pH 7.35-7.45, buffered by bicarbonate), seawater, and biochemistry. Show students that small pH excursions can be deadly biologically.",
    ],
    faq: [
      {
        question: "What does pH actually measure?",
        answer:
          "pH = −log10[H+]. Each pH unit corresponds to a 10× change in hydrogen ion concentration. pH 4 has 10× more H+ than pH 5 and 100× more than pH 6. Pure water at 25°C has [H+] = 10⁻⁷ M, giving pH 7.",
      },
      {
        question: "What's the difference between strong and weak acids?",
        answer:
          "Strong acids fully dissociate in water: every HCl molecule splits into H+ and Cl−. Weak acids only partially dissociate; the rest stays as the intact molecule. The equilibrium constant for that dissociation is Ka. Smaller Ka = weaker acid.",
      },
      {
        question: "What is a buffer and how does it work?",
        answer:
          "A buffer is a mix of a weak acid and its conjugate base (or weak base + conjugate acid). Adding strong acid: the conjugate base neutralizes most of it. Adding strong base: the weak acid neutralizes it. Net pH change is small until you exhaust one of the buffer components.",
      },
      {
        question: "Why doesn't the equivalence point always land at pH 7?",
        answer:
          "It depends on the strengths of the acid and base. Strong-strong: pH 7. Weak acid + strong base: pH > 7 (the salt's conjugate base is slightly basic). Strong acid + weak base: pH < 7. Use the type of indicator that changes color near the actual equivalence-point pH.",
      },
      {
        question: "How does this connect to AP Chemistry?",
        answer:
          "AP Chem Unit 8 (Acid-Base) expects students to compute pH/pOH, distinguish strong vs. weak acids, predict equivalence-point pH, calculate buffer pH using Henderson-Hasselbalch, and interpret titration curves. Every feature this lab shows can show up on the AP exam.",
      },
    ],
  },
};
