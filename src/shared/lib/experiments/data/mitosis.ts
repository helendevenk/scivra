import type { Experiment } from "@/shared/types/experiment";

export const mitosis: Experiment = {
  id: "mitosis",
  slug: "mitosis",
  title: "Mitosis: Cell Division & the Cell Cycle",
  subtitle: "How one cell becomes two identical daughters",
  description:
    "Step through all phases of mitosis — Prophase, Metaphase, Anaphase, Telophase — and watch chromosomes condense, align, and separate. Control the speed of each phase, track individual chromosomes with color coding, and compare normal division with cancer cell dysregulation.",
  thumbnail: "/imgs/experiments/mitosis.png",

  standards: {
    ngss: ["HS-LS1-4"],
    gcse: ["B1.1", "B1.2"],
    ap: ["3.A.2", "3.A.3"],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: ["mitosis", "cell cycle", "cell division", "chromosomes", "cancer", "AP Biology"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "divisionSpeed",
      label: "Division Speed",
      unit: "×",
      min: 0.5,
      max: 5,
      default: 1,
      step: 0.5,
      tier: "free",
    },
    {
      id: "chromosomeCount",
      label: "Chromosome Pairs (n)",
      unit: "",
      min: 2,
      max: 8,
      default: 4,
      step: 1,
      tier: "free",
    },
    {
      id: "checkpointEnabled",
      label: "Cell Cycle Checkpoints",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
      tier: "pro",
    },
    {
      id: "cancerMode",
      label: "Cancer Cell Behavior",
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
      latex: "\\text{G}_1 \\to S \\to \\text{G}_2 \\to M \\to \\text{Cytokinesis}",
      description: "The Cell Cycle: Interphase (G₁, S, G₂) + Mitosis (M) + Cytokinesis",
    },
    {
      latex: "2n \\xrightarrow{\\text{Mitosis}} 2 \\times 2n",
      description: "Diploid parent cell produces two diploid daughter cells",
    },
    {
      latex: "\\text{DNA} \\xrightarrow{\\text{S phase}} 2 \\times \\text{DNA}",
      description: "DNA replication occurs in S phase before mitosis",
    },
  ],

  theory:
    "Mitosis is somatic cell division producing two genetically identical daughter cells. The cell cycle consists of Interphase (G₁: growth, S: DNA replication, G₂: preparation) and Mitotic phase. Mitosis has 4 stages: Prophase (chromosomes condense, spindle forms), Metaphase (chromosomes align at the metaphase plate), Anaphase (sister chromatids separate, pulled to poles), Telophase (nuclear envelopes reform, chromosomes decondense). Cytokinesis then splits the cytoplasm. Cell cycle checkpoints (G₁/S, G₂/M, spindle assembly) ensure fidelity. Cancer results from checkpoint failure — cells divide uncontrollably.",

  instructions:
    "Press Play to watch the full cell cycle. Use the phase buttons to jump directly to any mitotic stage. Click individual chromosomes to track them through division. Toggle Cancer Mode (Pro) to see what happens when checkpoints are disabled — uncontrolled proliferation begins.",

  challenges: [
    {
      id: "mit-c1",
      question: "A cell has 2n=46 chromosomes. How many chromosomes does each daughter cell have after mitosis?",
      hint: "Mitosis preserves chromosome number. Each daughter cell has 2n=46.",
      tier: "free",
    },
    {
      id: "mit-c2",
      question: "During which phase of mitosis do sister chromatids separate?",
      hint: "Anaphase — the centromeres split and sister chromatids are pulled to opposite poles.",
      tier: "free",
    },
    {
      id: "mit-c3",
      question: "A cell spends 90% of its time in interphase. If the total cell cycle is 24 hours, how long is mitosis?",
      hint: "Mitosis = 10% of 24 hours = 2.4 hours.",
      tier: "free",
    },
    {
      id: "mit-c4",
      question: "If a G₂ checkpoint fails and allows a cell with damaged DNA to enter mitosis, what are the consequences for daughter cells?",
      hint: "Both daughters inherit the DNA damage. This can cause mutations, chromosome instability, and potentially cancer if tumor suppressors also fail.",
      tier: "pro",
    },
  ],

  wave: 3,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["meiosis", "dna-double-helix"],

  seoTitle: "Mitosis Cell Division Interactive — 3D Phases Animation | NeonPhysics AP Biology",
  seoKeywords: [
    "mitosis animation",
    "cell division interactive",
    "cell cycle phases",
    "chromosomes simulation",
    "AP Biology mitosis",
    "cancer cell division",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Mitosis and the Cell Cycle",
  },
};
