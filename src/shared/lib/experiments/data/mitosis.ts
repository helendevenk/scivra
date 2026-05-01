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
  gradeLevel: "9-12",
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

  seoTitle: "Mitosis Cell Division Interactive — 3D Phases Animation | Scivra AP Biology",
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
  contentSections: {
    whatIsIt:
      "Mitosis is the cell division process that produces two genetically identical daughter cells from a single somatic (body) cell, preserving the diploid chromosome number. Every time a skin cell regenerates, a bone fracture heals, or an embryo grows from four cells to forty, mitosis is running the program. The cell cycle frames it: a cell spends most of its time in Interphase — growing in G₁, replicating all its DNA in S phase, and preparing for division in G₂ — before entering the four mitotic stages: Prophase, Metaphase, Anaphase, and Telophase. Cancer emerges not simply from \"too much division\" but from disabled checkpoints — molecular gatekeepers like p53 and Rb that normally stop a damaged cell from advancing to the next phase. This simulation lets you step through each stage, adjust division speed, and toggle cancer behavior to see what checkpoint failure actually looks like.",
    parameterExplanations: {
      divisionSpeed:
        "Controls how fast the simulation animates each stage of the cell cycle, from 0.5× (half speed, useful for studying chromosome movement) to 5× (accelerated, useful for observing multiple rounds). Changing this does not alter the biology — it only changes the playback rate.",
      chromosomeCount:
        "Sets the number of homologous chromosome pairs (n) in the simulated cell, from 2 to 8 pairs. Higher values make chromosome behavior at the metaphase plate more complex to track and more closely approximate real organisms. Humans have n=23 pairs (2n=46); set to 4 for a manageable teaching model.",
      checkpointEnabled:
        "Toggles the G₁/S and G₂/M cell cycle checkpoints on or off. With checkpoints on (default = 1), a cell with simulated DNA damage will halt and not proceed to mitosis. Turn this off to model what happens when tumor suppressor pathways — like p53 — are inactivated: the cell bypasses quality control and divides anyway.",
      cancerMode:
        "When enabled (1), simulates a cell line with disabled checkpoints and accelerated, unregulated cycling — modeling the hallmark behavior of cancer cells. Use alongside checkpointEnabled = 0 to show students how checkpoint failure is the upstream cause of uncontrolled proliferation.",
    },
    misconceptions: [
      {
        wrong:
          "Mitosis halves the chromosome number — that's the whole point of cell division.",
        correct:
          "Mitosis preserves the diploid number. A 2n=46 parent cell produces two daughters each with 2n=46. It is meiosis, not mitosis, that reduces chromosome number from 2n to n. Mitosis is for growth and repair; meiosis is for making gametes.",
      },
      {
        wrong:
          "DNA replication happens during Prophase, right when the chromosomes become visible.",
        correct:
          "DNA replication occurs in S phase of Interphase — before mitosis begins. By the time chromosomes condense in Prophase, each chromosome already consists of two identical sister chromatids joined at the centromere. Mitosis separates those pre-copied sisters, it does not copy DNA.",
      },
      {
        wrong:
          "Cancer happens because cells start dividing faster than normal.",
        correct:
          "Speed is secondary. Cancer results primarily from checkpoint failure — when proteins like p53 or Rb no longer stop cells with damaged or incompletely replicated DNA from entering mitosis. The consequence is uncontrolled proliferation and accumulation of mutations, but the root cause is lost quality control, not an accelerator being pressed.",
      },
      {
        wrong:
          "After Anaphase the cell has twice as many chromosomes — that means it's tetraploid for a moment.",
        correct:
          "During Anaphase, sister chromatids separate and move to opposite poles, so the total count of chromosomal units in the whole cell temporarily appears doubled. But each pole is receiving a complete 2n complement — not a tetraploid set. Once cytokinesis completes, each daughter has the same 2n as the parent.",
      },
    ],
    teacherUseCases: [
      "Phase identification exercise: pause the simulation at a random stage and ask students to name the phase and identify three visible features — use this to build recognition of Prophase (condensed chromosomes, spindle forming), Metaphase (plate alignment), Anaphase (V-shaped chromatid movement), and Telophase (nuclear envelope reforming).",
      "Checkpoint probe: set checkpointEnabled = 0 and run the simulation, then ask 'why does the cell keep dividing even after we introduced DNA damage?' Use student responses to assess whether they understand checkpoint biology versus just memorizing phase names.",
      "Cancer mechanism data collection: run 10 cycles with checkpoints enabled and 10 with cancerMode = 1, recording division rate and error accumulation. Students graph the difference and write a one-paragraph mechanistic explanation referencing p53 or Rb.",
      "Mitosis vs. meiosis compare-and-contrast: run this simulation alongside the meiosis simulation, then have student pairs list three observable differences — a structured approach to the most-confused pair of processes in AP Biology.",
      "Cell cycle timing investigation: given that a typical human cell cycle is 24 hours and mitosis takes roughly 1–2 hours, ask students to calculate what fraction of time is spent in each phase and discuss why cells spend most of their lives in interphase rather than actively dividing.",
    ],
    faq: [
      {
        question: "What is the difference between mitosis and cytokinesis?",
        answer:
          "Mitosis refers specifically to the division of the nucleus — the four stages that partition chromosomes into two equal sets. Cytokinesis is the separate process of splitting the cytoplasm; in animal cells it occurs via a cleavage furrow, in plant cells via a cell plate. Cytokinesis follows mitosis but is not part of it. A cell can complete mitosis and temporarily exist as a binucleate cell before cytokinesis finishes.",
      },
      {
        question: "How does AP Biology standard 3.A.2 connect to what this simulation shows?",
        answer:
          "AP standard 3.A.2 states that in eukaryotes, heritable information is passed to daughter cells through mitosis. The simulation directly demonstrates this: each daughter cell receives a complete, identical copy of the genome because DNA replication in S phase precedes chromosome separation in M phase. Every chromosome visible at the metaphase plate represents one pair of sister chromatids whose separation ensures exact inheritance.",
      },
      {
        question: "Why does the chromosome count stay the same after mitosis?",
        answer:
          "Before mitosis begins, each chromosome is duplicated during S phase to form two sister chromatids. Anaphase separates those sisters, sending one to each pole. The net result: each daughter cell receives one copy of every original chromosome — the same 2n count as the parent cell. Nothing is lost or added; the genome is photocopied and evenly distributed.",
      },
      {
        question: "At what stage do chromosomes look like the classic X shape?",
        answer:
          "Chromosomes appear as X-shaped structures in late Prophase and Metaphase, when they are maximally condensed and the two sister chromatids are still attached at the centromere. The X shape disappears in Anaphase when the centromere splits and the sisters separate into individual rod-shaped chromosomes.",
      },
      {
        question: "How is the G₂/M checkpoint relevant to cancer treatment?",
        answer:
          "The G₂/M checkpoint verifies that DNA replication is complete and damage-free before allowing a cell to enter mitosis. Many chemotherapy drugs — including taxol and vinca alkaloids — specifically target the spindle assembly process, triggering a checkpoint that forces cancer cells (which often already have a compromised G₁ checkpoint) to arrest or die in mitosis. Understanding this checkpoint is central to AP standard 3.A.3.",
      },
    ],
  },
};
