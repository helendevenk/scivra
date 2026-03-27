import type { Experiment } from "@/shared/types/experiment";

export const radiometricDating: Experiment = {
  id: "radiometric-dating",
  slug: "radiometric-dating",
  title: "Radiometric Dating",
  subtitle: "Exponential decay and half-life in geological dating",
  description:
    "Explore how radioactive isotopes decay over time and how scientists use half-lives to determine the age of rocks and fossils. Select different isotopes (C-14, K-40, U-238), watch atoms decay in real time, and read the decay curve. Calculate ages from parent/daughter ratios.",
  thumbnail: "/imgs/experiments/radiometric-dating.png",

  standards: {
    ngss: ["HS-ESS1-6", "HS-PS1-8"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "9-12",
  tags: [
    "radiometric dating",
    "half-life",
    "radioactive decay",
    "isotopes",
    "geochronology",
    "Earth Science",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "isotopeIndex",
      label: "Isotope",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "initialAtoms",
      label: "Initial Parent Atoms",
      unit: "",
      min: 50,
      max: 500,
      default: 200,
      step: 50,
      tier: "free",
    },
    {
      id: "speed",
      label: "Simulation Speed",
      unit: "x",
      min: 1,
      max: 10,
      default: 3,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "N(t) = N_0 \\left(\\frac{1}{2}\\right)^{t/t_{1/2}}",
      description:
        "Number of parent atoms remaining: N₀ = initial count, t = elapsed time, t₁/₂ = half-life",
    },
    {
      latex: "t = t_{1/2} \\cdot \\frac{\\ln(N_0/N)}{\\ln 2}",
      description:
        "Age calculation from parent/daughter ratio: rearranged decay equation",
    },
  ],

  theory:
    "Radioactive isotopes decay at a constant rate characterized by their half-life — the time for half the parent atoms to convert to daughter atoms. After 1 half-life, 50% remain; after 2, 25%; after 3, 12.5%. This exponential decay follows N(t) = N₀ × (1/2)^(t/t₁/₂). Different isotopes have vastly different half-lives: C-14 (5,730 years, good for organic remains up to ~50,000 years), K-40 (1.25 billion years, for ancient rocks), U-238 (4.47 billion years, for the oldest rocks and meteorites). By measuring the ratio of parent to daughter isotopes in a sample, geologists calculate its age.",

  instructions:
    "Select an isotope to see its half-life. Press 'Start Decay' to watch parent atoms (orange) transform into daughter atoms (blue). The decay curve plots the fraction remaining over time. Vertical dashed lines mark each half-life. Drag the time slider to jump to any point. The data panel calculates the age from the current parent/daughter ratio.",

  challenges: [
    {
      id: "rd-c1",
      question: "A sample has 25% parent atoms remaining. How many half-lives have passed?",
      hint: "After 1 half-life: 50%. After 2 half-lives: 25%. Answer: 2 half-lives.",
      tier: "free",
    },
    {
      id: "rd-c2",
      question: "A bone has 12.5% of its original C-14. How old is it? (t₁/₂ = 5,730 yr)",
      hint: "12.5% = (1/2)³ → 3 half-lives. Age = 3 × 5,730 = 17,190 years.",
      tier: "free",
    },
    {
      id: "rd-c3",
      question: "Why can't C-14 dating be used for a 100-million-year-old dinosaur bone?",
      hint: "After ~10 half-lives (~57,300 years), virtually all C-14 has decayed to undetectable levels. For very old samples, use K-40 or U-238 with billion-year half-lives.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["greenhouse-effect", "rock-cycle"],
  htmlPath: "/experiments/earth-science/radiometric-dating.html",

  seoTitle: "Radiometric Dating Simulation | Scivra Earth Science",
  seoKeywords: [
    "radiometric dating simulation",
    "half-life interactive",
    "radioactive decay visualizer",
    "isotope dating calculator",
    "Earth Science geochronology",
    "carbon-14 dating lab",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Radiometric Dating and Half-Life",
  },
};
