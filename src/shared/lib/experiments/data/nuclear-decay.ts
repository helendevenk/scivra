import type { Experiment } from "@/shared/types/experiment";

export const nuclearDecay: Experiment = {
  id: "nuclear-decay",
  slug: "nuclear-decay-alpha-beta-gamma-half-life",
  title: "Nuclear Decay & Radioactivity",
  subtitle: "Visualize alpha, beta, and gamma decay with half-life calculations",
  description:
    "Select a decay mode and watch the nucleus transform in real time. The activity curve shows exponential decay of the sample while the daughter nuclide builds up. Adjust half-life and initial amount to predict remaining mass after any number of half-lives — essential for radiocarbon dating and nuclear medicine.",
  thumbnail: "/imgs/experiments/nuclear-decay.png",

  standards: {
    ngss: ["HS-PS1-8"],
    gcse: ["P4.1", "P4.2", "P4.3"],
    ap: ["MOD-2.A", "MOD-2.B", "MOD-2.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["nuclear decay", "radioactivity", "half-life", "alpha decay", "beta decay", "gamma radiation", "AP Physics 2", "carbon dating"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "decay_type",
      label: "Decay Type (0=α, 1=β⁻, 2=β⁺, 3=γ)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "half_life",
      label: "Half-Life",
      unit: "years",
      min: 0.01,
      max: 10000,
      default: 100,
      step: 1,
      tier: "free",
    },
    {
      id: "initial_amount",
      label: "Initial Amount",
      unit: "g",
      min: 0.001,
      max: 1000,
      default: 100,
      step: 1,
      tier: "pro",
    },
    {
      id: "time_elapsed",
      label: "Time Elapsed",
      unit: "half-lives",
      min: 0,
      max: 10,
      default: 0,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "N(t) = N_0 \\left(\\frac{1}{2}\\right)^{t/T_{1/2}}",
      description: "Amount remaining after time t (half-life form)",
    },
    {
      latex: "N(t) = N_0 e^{-\\lambda t}",
      description: "Radioactive decay law with decay constant λ",
    },
    {
      latex: "\\lambda = \\frac{\\ln 2}{T_{1/2}}",
      description: "Relationship between decay constant and half-life",
    },
    {
      latex: "{}^A_Z X \\rightarrow {}^{A-4}_{Z-2}Y + {}^4_2\\text{He}",
      description: "Alpha decay: mass number −4, atomic number −2",
    },
  ],

  theory:
    "Radioactive decay is a spontaneous, random process governed by quantum mechanics — individual nuclei decay unpredictably, but large samples follow precise statistical laws. The decay constant λ gives the probability per unit time that a single nucleus decays. The half-life T½ is the time for exactly half the nuclei in a sample to decay, regardless of sample size. Alpha decay emits a helium-4 nucleus, reducing A by 4 and Z by 2. Beta-minus decay converts a neutron to a proton (Z increases by 1). Beta-plus decay converts a proton to a neutron (Z decreases by 1). Gamma emission releases energy without changing A or Z. These reactions conserve charge, mass-energy, and lepton number.",

  instructions:
    "Choose a decay type to see the nucleus diagram and the balanced decay equation. Set the half-life and press Play — watch the exponential decay curve build and the daughter nuclide count rise. Use the Time Elapsed slider (Pro) to jump to any point in the decay sequence. The table shows N(t), activity A(t), and fraction remaining at the current time.",

  challenges: [
    {
      id: "nd-c1",
      question: "After 3 half-lives, what fraction of the original sample remains?",
      hint: "After each half-life, half remains. Apply (½)³.",
      tier: "free",
    },
    {
      id: "nd-c2",
      question: "²³⁸₉₂U undergoes alpha decay. What are the mass number and atomic number of the daughter nucleus?",
      hint: "Alpha decay: A decreases by 4, Z decreases by 2.",
      tier: "free",
    },
    {
      id: "nd-c3",
      question: "Carbon-14 has a half-life of 5730 years. A sample contains only 25% of its original C-14. How old is it?",
      hint: "25% = (½)² means 2 half-lives have elapsed. Age = 2 × T½.",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["atomic-structure", "em-spectrum"],

  seoTitle: "Nuclear Decay & Radioactivity — Half-Life Simulation | NeonPhysics",
  seoKeywords: [
    "nuclear decay simulation",
    "radioactive half-life",
    "alpha beta gamma decay",
    "carbon dating simulation",
    "AP Physics 2 nuclear",
    "radioactivity calculator",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Nuclear Decay and Radioactivity",
  },
};
