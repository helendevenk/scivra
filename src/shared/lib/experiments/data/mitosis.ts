import type { Experiment } from "@/shared/types/experiment";

export const mitosis: Experiment = {
  id: "mitosis",
  slug: "mitosis",
  title: "Mitosis: Cell Division & the Cell Cycle",
  subtitle: "How one cell becomes two identical daughters",
  description:
    "Step through all phases of mitosis — Prophase, Metaphase, Anaphase, Telophase — and watch chromosomes condense, align, and separate. Adjust cell size and chromosome count, track individual chromosomes with color coding, and compare normal human, abnormal cancer-like, and yeast cell presets.",
  thumbnail: "/imgs/experiments/mitosis.png",

  standards: {
    ngss: ["HS-LS1-4", "MS-LS1-2"],
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
      id: "cellSize",
      label: "Cell Size",
      unit: "×",
      min: 0.5,
      max: 2,
      default: 1,
      step: 0.05,
      tier: "free",
    },
    {
      id: "chromosomeCount",
      label: "Chromosome Count",
      unit: "",
      min: 4,
      max: 64,
      default: 46,
      step: 2,
      tier: "free",
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
    "Press Play to watch the full cell cycle. Use the phase buttons to jump directly to any mitotic stage, then adjust the Cell Size and Chromosome Count sliders to compare how scale and genome size affect the visual model. Try the Normal Human Cell, Cancer Cell, and Yeast Cell presets to jump between three biologically meaningful chromosome-count examples. Click individual chromosomes to track them through division.",

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
  htmlControlAliases: {
    cellSize: "sl-cellsize",
    chromosomeCount: "sl-chrnum",
  },
  presets: [
    {
      id: "human",
      label: "Normal Human Cell (46 chr)",
      paramValues: { cellSize: 1.0, chromosomeCount: 46 },
    },
    {
      id: "cancer",
      label: "Cancer Cell (abnormal)",
      paramValues: { cellSize: 1.2, chromosomeCount: 60 },
    },
    {
      id: "yeast",
      label: "Yeast Cell (16 chr)",
      paramValues: { cellSize: 0.7, chromosomeCount: 16 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Mitosis is the cell division process that produces two genetically identical daughter cells from a single somatic (body) cell, preserving the diploid chromosome number. Every time a skin cell regenerates, a bone fracture heals, or an embryo grows from four cells to forty, mitosis is running the program. The cell cycle frames it: a cell spends most of its time in Interphase — growing in G₁, replicating all its DNA in S phase, and preparing for division in G₂ — before entering the four mitotic stages: Prophase, Metaphase, Anaphase, and Telophase. Cancer emerges not simply from \"too much division\" but from disabled checkpoints — molecular gatekeepers like p53 and Rb that normally stop a damaged cell from advancing to the next phase. This simulation lets you step through each stage, adjust cell size and chromosome count, and compare preset organisms or abnormal cancer-like configurations.",
    parameterExplanations: {
      cellSize:
        "Cell Size changes the visual scale of the dividing cell without changing the basic logic of mitosis. In real biology, cells must coordinate growth, DNA replication, spindle formation, and cytokinesis so that each daughter cell receives enough cytoplasm and organelles to function. Very small or very large cells can create transport, surface-area-to-volume, and spindle-positioning challenges, but mitosis still has the same goal: produce two viable daughter cells with complete genomes. Use this slider to help students separate cell morphology from chromosome inheritance. A larger display can make spindle geometry easier to inspect, while a smaller one emphasizes that chromosome partitioning remains the central AP Biology concept.",
      chromosomeCount:
        "Chromosome Count sets the diploid chromosome number shown in the model. Humans have 46 chromosomes in most somatic cells, while budding yeast have 16; many cancers also show aneuploidy, meaning abnormal chromosome numbers caused by segregation errors or genome instability. In mitosis, chromosome count should be preserved: after S phase, each chromosome consists of two sister chromatids, and anaphase separates those sisters so each daughter receives one complete set. Increasing the count makes metaphase alignment and anaphase separation visually more crowded, which is useful for discussing why the spindle assembly process must attach every kinetochore correctly before chromatids separate.",
    },
    misconceptions: [
      {
        wrong:
          "Mitosis halves the chromosome number — that's the whole point of cell division.",
        correct:
          "Mitosis preserves the diploid number. A 2n=46 parent cell produces two daughters each with 2n=46. It is meiosis, not mitosis, that reduces chromosome number from 2n to n. Use the Chromosome Count slider or the Normal Human Cell preset to track the same chromosome number before and after division.",
      },
      {
        wrong:
          "DNA replication happens during Prophase, right when the chromosomes become visible.",
        correct:
          "DNA replication occurs in S phase of Interphase — before mitosis begins. By the time chromosomes condense in Prophase, each chromosome already consists of two identical sister chromatids joined at the centromere. The Chromosome Count slider changes how many chromosomes are displayed, but mitosis separates pre-copied sisters rather than copying DNA during the visible stages.",
      },
      {
        wrong:
          "The Cancer Cell preset means cancer is just a larger cell with more chromosomes.",
        correct:
          "The Cancer Cell preset is a simplified teaching configuration, not a full cancer model. Its larger Cell Size and abnormal Chromosome Count help students notice genome instability and altered cell morphology, but real cancer depends on many molecular changes, including mutations in growth-control and DNA-repair pathways. Treat the preset as a comparison case, then ask what mechanisms could create abnormal chromosome numbers.",
      },
      {
        wrong:
          "After Anaphase the cell has twice as many chromosomes — that means it's tetraploid for a moment.",
        correct:
          "During Anaphase, sister chromatids separate and move to opposite poles, so the total count of chromosomal units in the whole cell temporarily appears doubled. But each pole is receiving a complete 2n complement — not a tetraploid set. Once cytokinesis completes, each daughter has the same Chromosome Count as the parent configuration.",
      },
    ],
    teacherUseCases: [
      "Preset comparison for HS-LS1-4 and MS-LS1-2: have students run the Normal Human Cell, Cancer Cell, and Yeast Cell presets, record cellSize and chromosomeCount values, and explain what stays constant about mitotic inheritance.",
      "Chromosome tracking lab: set chromosomeCount to 16 with the Yeast Cell preset, pause at metaphase and anaphase, and ask students to trace how sister chromatids separate into two equal daughter-cell sets.",
      "Human somatic cell checkpoint discussion: start with the Normal Human Cell preset at chromosomeCount = 46, then ask why accurate kinetochore attachment matters more as chromosome number increases.",
      "Cancer preset CER prompt: use the Cancer Cell preset, cite its cellSize and chromosomeCount values as evidence, and have students write a claim about how abnormal chromosome number can signal genome instability.",
      "Scale versus inheritance mini-investigation: keep chromosomeCount constant while changing cellSize, then have students distinguish visual cell morphology from the core mitosis outcome required by HS-LS1-4.",
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
          "Chromosomes appear as X-shaped structures in late Prophase and Metaphase, when they are maximally condensed and the two sister chromatids are still attached at the centromere. The X shape disappears in Anaphase when the centromere splits and the sisters separate into individual rod-shaped chromosomes. A higher Chromosome Count makes more X-shaped structures visible at metaphase.",
      },
      {
        question: "How should I compare the Normal Human Cell, Cancer Cell, and Yeast Cell presets?",
        answer:
          "Use the presets as quick biological comparison cases. Normal Human Cell sets chromosomeCount to 46, matching most human somatic cells. Yeast Cell sets chromosomeCount to 16, showing that different eukaryotes can have very different chromosome numbers while still using mitosis. Cancer Cell uses a larger cellSize and abnormal chromosomeCount to support discussion of aneuploidy and genome instability. After selecting each preset, pause at metaphase and anaphase to check whether sister chromatids still separate into two daughter-cell sets.",
      },
    ],
  },
};
