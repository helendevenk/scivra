import type { Experiment } from "@/shared/types/experiment";

export const enzymeKinetics: Experiment = {
  id: "enzyme-kinetics",
  slug: "enzyme-kinetics",
  title: "Enzyme Kinetics & Michaelis-Menten",
  subtitle: "How enzymes speed up reactions",
  description:
    "Explore the catalytic cycle of enzymes at the molecular level. Watch substrate molecules bind to the active site, form enzyme-substrate complexes, and release products. Plot real-time Michaelis-Menten and Lineweaver-Burk curves. Add competitive, non-competitive, or uncompetitive inhibitors and see Km and Vmax shift.",
  thumbnail: "/imgs/experiments/enzyme-kinetics.png",

  standards: {
    ngss: ["HS-LS1-6", "HS-LS1-7"],
    gcse: ["B2.5", "B2.6"],
    ap: ["2.A.3", "4.A.1"],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: ["enzyme kinetics", "Michaelis-Menten", "inhibition", "active site", "Km Vmax", "AP Biology"],
  difficulty: "advanced",

  parameters: [
    {
      id: "substrateConc",
      label: "Substrate Concentration [S]",
      unit: "mM",
      min: 0.1,
      max: 50,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "km",
      label: "Michaelis Constant (Km)",
      unit: "mM",
      min: 0.5,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "vmax",
      label: "Maximum Velocity (Vmax)",
      unit: "μmol/min",
      min: 10,
      max: 100,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "inhibitorType",
      label: "Inhibitor Type (0=none, 1=competitive, 2=noncompetitive, 3=uncompetitive)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "v = \\frac{V_{\\max}[S]}{K_m + [S]}",
      description: "Michaelis-Menten equation: reaction rate as a function of substrate concentration",
    },
    {
      latex: "K_m = \\frac{k_{-1} + k_2}{k_1} \\approx \\frac{k_{-1}}{k_1}",
      description: "Km ≈ dissociation constant of ES complex (substrate affinity)",
    },
    {
      latex: "\\frac{1}{v} = \\frac{K_m}{V_{\\max}} \\cdot \\frac{1}{[S]} + \\frac{1}{V_{\\max}}",
      description: "Lineweaver-Burk double-reciprocal plot (x-intercept = -1/Km, y-intercept = 1/Vmax)",
    },
  ],

  theory:
    "Enzymes are biological catalysts that lower activation energy by forming a specific enzyme-substrate (ES) complex at the active site (lock-and-key or induced fit). The catalytic cycle: E + S ⇌ ES → E + P. The Michaelis-Menten model describes reaction rate (v) as a function of [S]: v = Vmax[S]/(Km + [S]). Km (Michaelis constant) is the [S] at half-Vmax — a measure of enzyme-substrate affinity (lower Km = higher affinity). Competitive inhibitors increase apparent Km (compete with substrate for active site). Non-competitive inhibitors decrease Vmax (bind allosteric site, alter enzyme shape). Uncompetitive inhibitors decrease both Km and Vmax (bind ES complex only). Temperature and pH also affect enzyme activity by denaturing the protein.",

  instructions:
    "Set substrate concentration and watch the real-time velocity curve build against the Michaelis-Menten plot. Identify Km (at ½Vmax) and Vmax on the graph. Switch to Lineweaver-Burk view to linearize the data. Add inhibitors (Pro) one at a time and observe how the curves change — predict the inhibitor type from graph patterns.",

  challenges: [
    {
      id: "ek-c1",
      question: "An enzyme has Km = 4 mM and Vmax = 80 μmol/min. What is the reaction rate when [S] = 4 mM?",
      hint: "v = Vmax[S]/(Km+[S]) = 80×4/(4+4) = 320/8 = 40 μmol/min (= Vmax/2, as expected at Km).",
      tier: "free",
    },
    {
      id: "ek-c2",
      question: "Enzyme A has Km = 2 mM and Enzyme B has Km = 10 mM. Which has higher substrate affinity?",
      hint: "Lower Km = higher affinity. Enzyme A (Km = 2 mM) has higher substrate affinity.",
      tier: "free",
    },
    {
      id: "ek-c3",
      question: "On a Lineweaver-Burk plot, a competitive inhibitor shifts the x-intercept but not the y-intercept. What does this mean for Km and Vmax?",
      hint: "x-intercept = -1/Km → shifts means Km increases (apparent). y-intercept = 1/Vmax → unchanged means Vmax unchanged. Competitive: ↑Km, same Vmax.",
      tier: "free",
    },
    {
      id: "ek-c4",
      question: "Aspirin (acetylsalicylic acid) irreversibly acetylates the active site of COX-2 enzyme. Is this competitive or non-competitive inhibition? How does it affect Vmax?",
      hint: "Irreversible modification of active site = irreversible competitive-like (covalent). Available enzyme is permanently reduced → apparent Vmax decreases (fewer functional enzyme molecules). Some classify this as mechanism-based inhibition.",
      tier: "pro",
    },
  ],

  wave: 3,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["cellular-respiration", "photosynthesis"],

  seoTitle: "Enzyme Kinetics Michaelis-Menten Interactive | Scivra AP Biology",
  seoKeywords: [
    "enzyme kinetics simulation",
    "Michaelis-Menten interactive",
    "Lineweaver-Burk plot",
    "enzyme inhibition",
    "AP Biology enzymes",
    "Km Vmax calculator",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Enzyme Kinetics and the Michaelis-Menten Model",
  },
};
