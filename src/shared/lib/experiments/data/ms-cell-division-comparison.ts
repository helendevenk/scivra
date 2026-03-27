import type { Experiment } from "@/shared/types/experiment";

export const msCellDivisionComparison: Experiment = {
  id: "ms-cell-division-comparison",
  slug: "ms-cell-division-comparison",
  title: "Cell Division Comparison",
  subtitle: "Compare mitosis and meiosis side by side",
  description:
    "Watch mitosis and meiosis unfold side by side to understand how cells divide. Mitosis produces two identical daughter cells for growth and repair, while meiosis produces four genetically unique gametes for reproduction. Step through each phase, toggle labels, and adjust animation speed to see the key differences: chromosome number, crossing over, and independent assortment.",
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
      id: "divisionType",
      label: "Division Type (0=Mitosis, 1=Meiosis, 2=Both)",
      unit: "",
      min: 0,
      max: 2,
      default: 2,
      step: 1,
      tier: "free",
    },
    {
      id: "speed",
      label: "Animation Speed",
      unit: "x",
      min: 0.25,
      max: 3,
      default: 1,
      step: 0.25,
      tier: "free",
    },
    {
      id: "showLabels",
      label: "Show Phase Labels (0=Off, 1=On)",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
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
    "Cells divide to grow, repair damage, and reproduce. Mitosis is the process where one cell copies its DNA and splits into two identical daughter cells, each with the full set of chromosomes (diploid, 2n). Your body uses mitosis constantly — skin cells, blood cells, and bone cells all rely on it. Meiosis is different: it happens only in reproductive organs (ovaries and testes) to make sex cells (gametes). Meiosis involves two rounds of division, producing four cells with half the chromosomes (haploid, n). Two special events make meiosis unique: crossing over (homologous chromosomes swap segments in Prophase I, creating new gene combinations) and independent assortment (chromosomes line up randomly in Metaphase I, so each gamete gets a different mix). This genetic variation is why siblings look different from each other, even with the same parents.",

  instructions:
    "Choose a division type to watch: Mitosis alone, Meiosis alone, or Both side by side. Press Play to animate the phases. Adjust the speed slider to slow down tricky phases like Anaphase. Turn on phase labels to see the name of each stage as it happens. Pay attention to chromosome behavior — notice how chromosomes pair up in Meiosis I but not in Mitosis.",

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
};
