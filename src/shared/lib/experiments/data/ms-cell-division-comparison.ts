import type { Experiment } from "@/shared/types/experiment";

export const msCellDivisionComparison: Experiment = {
  id: "ms-cell-division-comparison",
  slug: "ms-cell-division-comparison",
  title: "Cell Division Comparison",
  subtitle: "Compare mitosis and meiosis side by side",
  description:
    "Watch mitosis and meiosis unfold side by side to understand how cells divide. Mitosis produces two identical daughter cells for growth and repair, while meiosis produces four genetically unique gametes for reproduction. Adjust the Chromosome Count slider to see the key differences: chromosome number, crossing over, and independent assortment.",
  thumbnail: "/imgs/experiments/ms-cell-division-comparison.png",

  standards: {
    ngss: ["MS-LS3-2"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "biology",
  subject: "biology",
  gradeLevel: "6-8",
  tags: [
    "cell division",
    "mitosis",
    "meiosis",
    "chromosomes",
    "genetics",
    "middle school",
    "6-8",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "chromosomeCount",
      label: "Chromosome Count",
      unit: "",
      min: 4,
      max: 16,
      default: 8,
      step: 2,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\text{Mitosis: } 2n \\rightarrow 2n + 2n \\quad \\text{(diploid → 2 diploid)}",
      description:
        "Mitosis produces two genetically identical diploid daughter cells",
    },
    {
      latex: "\\text{Meiosis: } 2n \\rightarrow n + n + n + n \\quad \\text{(diploid → 4 haploid)}",
      description:
        "Meiosis produces four genetically unique haploid gametes through two rounds of division",
    },
  ],

  theory:
    "Cells divide to grow, repair damage, and reproduce. Mitosis is the process where one cell copies its DNA and splits into two identical daughter cells, each with the full set of chromosomes (diploid, 2n). Your body uses mitosis constantly — skin cells, intestinal lining, and bone-marrow stem cells (which produce blood cells) all divide this way. (Mature red blood cells themselves don't divide — they're produced by mitotic divisions of stem cells in the marrow.) In humans, meiosis happens in reproductive organs (ovaries and testes) to make sex cells (gametes); other organisms run meiosis in different tissues, but the cell-division logic is the same. Meiosis involves two rounds of division, producing four cells with half the chromosomes (haploid, n). Two special events make meiosis unique: crossing over (homologous chromosomes swap segments in Prophase I, creating new gene combinations) and independent assortment (chromosomes line up randomly in Metaphase I, so each gamete gets a different mix). This genetic variation is why siblings look different from each other, even with the same parents.",

  instructions:
    "Use the Chromosome Count slider to change how many chromosomes are shown in the side-by-side comparison. Compare how mitosis preserves the full chromosome set in two daughter cells while meiosis reduces the chromosome number across four gametes. Watch how homologous chromosomes pair and separate in meiosis, then contrast that behavior with the chromosome separation shown in mitosis.",

  challenges: [
    {
      id: "mcd-c1",
      question:
        "A human body cell has 46 chromosomes. After mitosis, how many chromosomes does each daughter cell have? After meiosis?",
      hint: "Mitosis copies everything: each daughter cell gets 46 chromosomes (2n=46). Meiosis halves the number: each gamete gets 23 chromosomes (n=23). When two gametes combine at fertilization, 23+23=46 is restored.",
      tier: "free",
    },
    {
      id: "mcd-c2",
      question:
        "Why does your body use mitosis for healing a cut, but meiosis for making egg or sperm cells?",
      hint: "Healing requires exact copies of existing cells — mitosis makes identical diploid cells. Reproduction needs genetic diversity and half the chromosomes — meiosis creates unique haploid gametes so that fertilization restores the full chromosome number without doubling it.",
      tier: "free",
    },
    {
      id: "mcd-c3",
      question:
        "What is crossing over, and why does it matter for genetic diversity?",
      hint: "During Prophase I of meiosis, homologous chromosomes (one from mom, one from dad) physically exchange segments of DNA. This creates new combinations of genes on each chromosome that neither parent had. Combined with independent assortment, crossing over is a major source of the genetic variation that makes every individual unique.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["cell-division", "cell-structure-3d"],

  htmlPath: "/experiments/middle/ms-cell-division-comparison.html",

  seoTitle: "Cell Division Comparison: Mitosis vs Meiosis | Scivra Middle School Biology",
  seoKeywords: [
    "mitosis vs meiosis comparison middle school",
    "cell division simulation interactive",
    "chromosome division 6-8 biology",
    "mitosis meiosis side by side",
    "NGSS MS-LS3-2 cell division",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Cell Division — Mitosis and Meiosis Comparison",
  },
  htmlControlAliases: { chromosomeCount: "sl-chrom" },
  contentSections: {
    whatIsIt:
      "Every living thing is made of cells, and cells come from other cells. Cell division is how organisms grow, heal injuries, and make offspring. This simulation compares two very different kinds of cell division side by side. Mitosis is everyday division: one cell copies all its DNA and splits cleanly into two identical daughter cells, each with the same full set of chromosomes as the parent. Your body relies on mitosis constantly — many body cells such as skin cells and blood cells are replaced this way. Meiosis is the special process that makes sex cells (sperm and eggs). It involves two rounds of division and produces four cells, each with only half the normal chromosome count. Two unique events make meiosis particularly interesting: crossing over, where chromosomes swap gene segments to create new combinations, and independent assortment, where chromosomes sort randomly so every gamete gets a unique mix. Watching both processes together makes the differences immediately visible and helps you understand why children resemble but are not identical to their parents.",
    parameterExplanations: {
      chromosomeCount:
        "Chromosome Count changes the size of the starting diploid set shown in the model, so you can compare the chromosome behavior of mitosis and meiosis without changing the underlying rule. In mitosis, the full set is copied and preserved in two daughter cells. In meiosis, homologous chromosomes pair, separate, and then sister chromatids separate, producing gametes with half the starting number. This supports NGSS MS-LS3-2 by modeling why asexual reproduction preserves genetic information while sexual reproduction creates variation. It also reinforces an AP Biology idea: chromosome transmission depends on ploidy, homologous pairing, independent assortment, and reduction division.",
    },
    misconceptions: [
      {
        wrong: "Mitosis and meiosis are basically the same process.",
        correct:
          "They share some similar-looking steps but have fundamentally different purposes and outcomes. Mitosis produces two diploid cells identical to the parent — used for growth and repair. Meiosis produces four haploid cells that are genetically unique — used for sexual reproduction. Meiosis also has an extra division round and two special events (crossing over and independent assortment) that mitosis does not.",
      },
      {
        wrong: "After meiosis, each new cell has half the DNA of a normal cell, so it is incomplete.",
        correct:
          "Having half the chromosome number (haploid, n) is exactly what gametes need. When a sperm (n) and an egg (n) combine at fertilization, the resulting cell (zygote) has the full diploid number (2n) again. If gametes kept the full set, fertilization would double the chromosome count with every generation — which does not happen in healthy reproduction.",
      },
      {
        wrong: "Crossing over happens in mitosis as well as meiosis.",
        correct:
          "Crossing over — the exchange of chromosome segments between homologous pairs — occurs specifically during Prophase I of meiosis. Mitosis does not involve homologous pairing or crossing over. This is a key reason why meiosis generates genetic variation while mitosis produces genetically identical copies.",
      },
      {
        wrong: "Each phase of cell division takes the same amount of time.",
        correct:
          "Cell division phases vary widely in duration. In many cell types, the longest phase is interphase (DNA replication), which can last many hours, while actual division phases are relatively brief. The model compresses time for visibility, so equal-looking segments on screen do not represent equal real-world durations.",
      },
      {
        wrong: "A cell that finishes meiosis can immediately divide again.",
        correct:
          "The haploid cells produced by meiosis (sperm and eggs) do not typically divide again by meiosis. They either mature into functional gametes or, after fertilization, become a diploid zygote that then uses mitosis for all subsequent growth and development.",
      },
    ],
    teacherUseCases: [
      "Set chromosomeCount to 8 and ask students to compare the final chromosome count and number of daughter cells produced by mitosis versus meiosis, connecting observations to NGSS MS-LS3-2.",
      "Move chromosomeCount from 4 to 16 and have students predict which outcomes should change visually and which biological rules should stay constant across both division models.",
      "Use chromosomeCount as a class warm-up: students sketch the starting cell, the mitosis result, and the meiosis result, then explain why sexual reproduction restores the full chromosome number at fertilization.",
      "Set chromosomeCount to 12 and ask students to identify where homologous chromosome pairing appears in meiosis but not in mitosis, then connect that difference to genetic variation.",
      "Run a quick CER activity where students use chromosomeCount evidence to support the claim that mitosis preserves genetic information while meiosis reduces chromosome number and supports variation.",
    ],
    faq: [
      {
        question: "Why do humans have 46 chromosomes if each parent only contributes 23?",
        answer:
          "Each parent produces gametes through meiosis, reducing their 46 chromosomes to 23 per sperm or egg cell. When a sperm (23 chromosomes) fertilizes an egg (23 chromosomes), the resulting zygote has 46 chromosomes — two full sets, one from each parent. This is why the chromosome count stays constant from generation to generation rather than doubling with each reproduction event.",
      },
      {
        question: "What is crossing over, and why does it matter?",
        answer:
          "Crossing over occurs during Prophase I of meiosis, when homologous chromosome pairs line up closely and physically swap matching segments of DNA. This creates chromosomes with new gene combinations that neither parent had in that exact form. Combined with independent assortment, crossing over is a major reason why biological siblings can share parents but look quite different from one another. It is also the primary mechanism by which evolution can combine beneficial traits from two individuals.",
      },
      {
        question: "Which NGSS standard does this simulation address?",
        answer:
          "This experiment primarily supports MS-LS3-2, which asks students to develop and use a model to describe why asexual reproduction results in offspring with identical genetic information while sexual reproduction results in offspring with genetic variation. Comparing mitosis and meiosis side by side directly models that difference at the cellular level.",
      },
      {
        question: "Can errors in cell division cause health problems?",
        answer:
          "Yes. If chromosomes fail to separate properly during meiosis — a process called nondisjunction — gametes end up with the wrong chromosome count. When such a gamete is fertilized, the resulting individual may have an extra or missing chromosome in every cell of their body. Down syndrome, for example, typically results from an extra copy of chromosome 21. Errors in mitosis can also contribute to uncontrolled cell division, which is one of the mechanisms involved in cancer development.",
      },
      {
        question: "Is meiosis the only way organisms reproduce sexually?",
        answer:
          "Meiosis is the process that produces haploid gametes, and sexual reproduction requires the fusion of two gametes. However, not all reproduction involves meiosis — asexual reproduction (budding, binary fission, vegetative propagation in plants) uses mitosis to produce genetically identical offspring. Many organisms can do both depending on conditions: they reproduce asexually during favorable times for speed and switch to sexual reproduction when they need to generate genetic diversity to adapt.",
      },
    ],
  },
};
