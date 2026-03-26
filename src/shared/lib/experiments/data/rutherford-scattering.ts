import type { Experiment } from "@/shared/types/experiment";

export const rutherfordScattering: Experiment = {
  id: "rutherford-scattering",
  slug: "rutherford-scattering-nuclear-model",
  title: "Rutherford Scattering",
  subtitle: "Discover the nuclear model of the atom through alpha particle scattering",
  description:
    "Fire alpha particles at a gold foil and observe their deflection angles. Reproduce Rutherford's famous 1909 experiment that revealed the nuclear structure of the atom.",
  thumbnail: "/imgs/experiments/nuclear-decay.png",

  standards: {
    ngss: ["HS-PS1-8"],
    gcse: ["AQA P7.1"],
    ap: ["MOD-2.A", "MOD-2.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["Rutherford scattering", "nuclear model", "alpha particles", "atomic structure", "Coulomb scattering"],
  difficulty: "intermediate",

  parameters: [
    { id: "nuclear_charge", label: "Nuclear Charge Z", unit: "e", min: 1, max: 100, default: 79, step: 1, tier: "free" },
    { id: "alpha_energy", label: "Alpha Energy", unit: "MeV", min: 1, max: 20, default: 5, step: 0.5, tier: "free" },
    { id: "impact_param", label: "Impact Parameter", unit: "fm", min: 0, max: 500, default: 100, step: 5, tier: "pro" },
  ],

  formulas: [
    { latex: "\\cot(\\theta/2) = \\frac{2bE_k}{k q_\\alpha q_{Au}}", description: "Rutherford scattering formula" },
    { latex: "d_{closest} = \\frac{kq_\\alpha q_{Au}}{E_k}", description: "Distance of closest approach" },
  ],

  theory:
    "In 1909, Geiger and Marsden fired alpha particles at gold foil. Most passed through, but a few scattered at large angles — even backward. This contradicted the Thomson 'plum pudding' model and led Rutherford to propose the nuclear model: nearly all atomic mass is concentrated in a tiny, positively-charged nucleus. The scattering angle depends on how close the alpha particle passes to the nucleus, governed by Coulomb repulsion.",
  instructions:
    "Fire alpha particles using the gun. Most will deflect only slightly. Decrease the impact parameter (aim closer to the center) to see large deflections. Watch the occasional alpha particle bounce back. The scattering angle histogram reveals the nuclear structure.",
  challenges: [
    { id: "rs-c1", question: "An alpha particle aimed directly at a gold nucleus (Z=79). What is the closest approach distance?", hint: "d = k×q_α×q_Au/KE; use KE=5MeV=8×10⁻¹³J; q_α=3.2×10⁻¹⁹C; q_Au=79e", tier: "free" },
    { id: "rs-c2", question: "Why did most alpha particles pass through the foil almost undeflected?", hint: "The nucleus is tiny compared to atomic size; most alphas pass far from any nucleus", tier: "free" },
    { id: "rs-c3", question: "How did Rutherford estimate the nucleus size from the maximum scattering angle?", hint: "Closest approach for direct hits gives upper bound on nuclear radius", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["build-a-nucleus", "models-hydrogen-atom", "nuclear-decay"],

  seoTitle: "Rutherford Scattering Simulation | Nuclear Model | AP Physics 2",
  seoKeywords: ["Rutherford scattering", "nuclear model", "alpha particles", "atomic structure", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Rutherford Scattering, Nuclear Model, Atomic Structure" },
};
