import type { Experiment } from "@/shared/types/experiment";

export const electrochemistry: Experiment = {
  id: "electrochemistry",
  slug: "electrochemistry",
  title: "Electrochemistry: Galvanic & Electrolytic Cells",
  subtitle: "Redox reactions, cell potential, and Faraday's laws",
  description:
    "Build a galvanic (voltaic) cell and watch spontaneous electron flow from anode to cathode. See metal dissolution and deposition, salt bridge ion migration, and measure cell potential (EMF). Switch to electrolytic mode to drive non-spontaneous reactions — electroplate metals or split water.",
  thumbnail: "/imgs/experiments/electrochemistry.png",

  standards: {
    ngss: ["HS-PS1-4"],
    gcse: ["C8.1", "C8.2"],
    ap: ["9.A.1", "9.B.1", "9.C.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: ["electrochemistry", "galvanic cell", "redox", "Nernst equation", "electrolysis", "AP Chemistry"],
  difficulty: "advanced",

  parameters: [
    {
      id: "anodeMetal",
      label: "Anode Metal (0=Zn, 1=Fe, 2=Cu)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "cathodeMetal",
      label: "Cathode Metal (0=Cu, 1=Ag, 2=Au)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "concentration",
      label: "Ion Concentration",
      unit: "mol/L",
      min: 0.01,
      max: 2.0,
      default: 1.0,
      step: 0.05,
      tier: "free",
    },
    {
      id: "cellMode",
      label: "Cell Mode (0=galvanic, 1=electrolytic)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "E°_{cell} = E°_{cathode} - E°_{anode} \\quad (\\Delta G = -nFE°_{cell})",
      description: "Standard cell potential; positive E° → spontaneous (galvanic)",
    },
    {
      latex: "E = E° - \\frac{RT}{nF}\\ln Q \\quad (\\text{Nernst equation})",
      description: "Nernst equation: actual cell potential at non-standard conditions",
    },
    {
      latex: "m = \\frac{MIt}{nF} \\quad (\\text{Faraday's first law})",
      description: "Mass deposited = molar mass × current × time / (electrons × Faraday)",
    },
  ],

  theory:
    "Electrochemistry links chemical reactions to electrical energy. In galvanic (voltaic) cells, spontaneous redox reactions generate electric current. Oxidation occurs at the anode (loses electrons); reduction at the cathode (gains electrons). Electrons flow through the external circuit; ions migrate through the salt bridge to maintain electrical neutrality. Standard reduction potentials (E°) are measured vs the standard hydrogen electrode (SHE). E°cell = E°cathode - E°anode; positive E° → spontaneous. ΔG = -nFE°cell. The Nernst equation adjusts for non-standard concentrations. Electrolytic cells use external voltage to drive non-spontaneous reactions: water splitting (2H₂O → 2H₂ + O₂), electroplating (Cu²⁺ + 2e⁻ → Cu at cathode), and chloralkali process. Faraday's law: mass deposited ∝ charge passed.",

  instructions:
    "Select anode and cathode metals and see the cell potential calculated from standard reduction potentials. Watch electron flow animation — metal dissolves at anode, deposits at cathode. Move the concentration slider and watch the Nernst equation update cell potential in real time. Switch to Electrolytic mode (Pro) to see water being electrolyzed.",

  challenges: [
    {
      id: "ec-c1",
      question: "Calculate E°cell for a Zn-Cu galvanic cell. (E°(Zn²⁺/Zn) = -0.76 V, E°(Cu²⁺/Cu) = +0.34 V)",
      hint: "E°cell = E°cathode - E°anode = 0.34 - (-0.76) = +1.10 V. Positive → spontaneous. Zn dissolves (anode), Cu deposits (cathode).",
      tier: "free",
    },
    {
      id: "ec-c2",
      question: "For the Zn-Cu cell above, calculate ΔG°. (n=2, F=96485 C/mol)",
      hint: "ΔG° = -nFE° = -(2)(96485)(1.10) = -212,267 J/mol ≈ -212 kJ/mol. Negative → spontaneous (consistent with positive E°).",
      tier: "free",
    },
    {
      id: "ec-c3",
      question: "A 5.0 A current is passed through a CuSO₄ solution for 30 minutes. How many grams of Cu are deposited? (M_Cu = 63.5 g/mol, n=2)",
      hint: "m = MIt/(nF) = 63.5 × 5.0 × 1800 / (2 × 96485) = 571500/192970 = 2.96 g.",
      tier: "free",
    },
    {
      id: "ec-c4",
      question: "Using Nernst equation: for Zn-Cu cell with [Zn²⁺]=2.0 M and [Cu²⁺]=0.01 M at 298 K, calculate E. (E°=1.10V, n=2)",
      hint: "Q = [Zn²⁺]/[Cu²⁺] = 2.0/0.01 = 200. E = 1.10 - (0.0257/2)ln(200) = 1.10 - 0.01285×5.30 = 1.10 - 0.068 = 1.03 V.",
      tier: "pro",
    },
  ],

  wave: 4,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["thermochemistry", "acid-base-ph"],

  seoTitle: "Electrochemistry Galvanic Electrolytic Cell | NeonPhysics AP Chemistry",
  seoKeywords: [
    "electrochemistry simulation",
    "galvanic cell interactive",
    "Nernst equation calculator",
    "electrolysis animation",
    "AP Chemistry electrochemistry",
    "Faraday's law simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Electrochemistry: Galvanic and Electrolytic Cells",
  },
};
