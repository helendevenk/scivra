import type { Experiment } from "@/shared/types/experiment";

export const buildANucleus: Experiment = {
  id: "build-a-nucleus",
  slug: "build-a-nucleus-simulation",
  title: "Build a Nucleus",
  subtitle: "Assemble protons and neutrons to explore nuclear stability",
  description:
    "Add protons and neutrons to an atomic nucleus and observe stability, binding energy, and radioactive decay. Explore the nuclear force, isotopes, and the valley of stability.",
  thumbnail: "/imgs/experiments/nuclear-decay.png",

  standards: {
    ngss: ["HS-PS1-8", "HS-PS4-2"],
    gcse: ["AQA P7.2", "AQA P7.3"],
    ap: ["MOD-3.A", "MOD-3.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["nuclear physics", "protons", "neutrons", "isotopes", "binding energy", "radioactive decay", "stability"],
  difficulty: "intermediate",

  parameters: [
    { id: "protons", label: "Protons (Z)", unit: "", min: 1, max: 118, default: 1, step: 1, tier: "free" },
    { id: "neutrons", label: "Neutrons (N)", unit: "", min: 0, max: 170, default: 0, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "BE = \\left[Z m_p + N m_n - M\\right]c^2", description: "Binding energy" },
    { latex: "BE/A", description: "Binding energy per nucleon" },
    { latex: "{}^A_Z X", description: "Nuclide notation" },
  ],

  theory:
    "Atomic nuclei are held together by the strong nuclear force, which overcomes electromagnetic repulsion between protons. Stability depends on the neutron-to-proton ratio. Too many or too few neutrons lead to radioactive decay. Binding energy per nucleon peaks near iron-56, explaining why fusion releases energy for light elements and fission releases energy for heavy elements.",
  instructions:
    "Click to add protons (red) and neutrons (blue) to the nucleus. Watch the stability indicator and binding energy chart. Unstable nuclei show the predicted decay mode (alpha, beta+, beta−, or gamma).",
  challenges: [
    { id: "bn-c1", question: "How many neutrons does carbon-12 have? Is it stable?", hint: "Z=6 for carbon; neutrons = 12−6 = 6", tier: "free" },
    { id: "bn-c2", question: "What happens when you add a neutron to make carbon-13 vs carbon-14?", hint: "Carbon-13 is stable; carbon-14 undergoes beta decay", tier: "free" },
    { id: "bn-c3", question: "Why does iron-56 have the highest binding energy per nucleon?", hint: "It sits at the optimal balance of nuclear force vs. Coulomb repulsion", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["nuclear-decay", "rutherford-scattering", "models-hydrogen-atom"],

  seoTitle: "Build a Nucleus Simulation | Nuclear Stability | AP Physics 2",
  seoKeywords: ["nuclear physics", "build a nucleus", "isotopes", "binding energy", "radioactive decay", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Nuclear Physics, Isotopes, Binding Energy" },
};
