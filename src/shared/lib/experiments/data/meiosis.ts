import type { Experiment } from "@/shared/types/experiment";

export const meiosis: Experiment = {
  id: "meiosis",
  slug: "meiosis",
  title: "Meiosis & Genetic Variation",
  subtitle: "Sexual reproduction and the origin of diversity",
  description:
    "Explore the two-division process that produces haploid gametes. Watch crossing over during Prophase I create new chromosome combinations, observe independent assortment shuffle chromosomes, and see how sexual reproduction generates virtually unlimited genetic variation. Compare with mitosis.",
  thumbnail: "/imgs/experiments/meiosis.png",

  standards: {
    ngss: ["HS-LS3-1", "HS-LS3-2"],
    gcse: ["B1.3", "B1.4"],
    ap: ["3.A.2", "3.A.4"],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "9-12",
  tags: ["meiosis", "crossing over", "genetic variation", "gametes", "independent assortment", "AP Biology"],
  difficulty: "advanced",

  parameters: [
    {
      id: "crossoverFrequency",
      label: "Crossover Events per Bivalent",
      unit: "",
      min: 0,
      max: 3,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "chromosomePairs",
      label: "Homologous Pair Count",
      unit: "",
      min: 2,
      max: 6,
      default: 3,
      step: 1,
      tier: "free",
    },
    {
      id: "nondisjunctionProb",
      label: "Non-disjunction Probability",
      unit: "%",
      min: 0,
      max: 30,
      default: 0,
      step: 5,
      tier: "pro",
    },
    {
      id: "showCombinations",
      label: "Show Gamete Combinations",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "2n \\xrightarrow{\\text{Meiosis}} 4 \\times n",
      description: "Diploid cell → 4 haploid gametes (genetically unique)",
    },
    {
      latex: "2^n \\text{ combinations (independent assortment)}",
      description: "n = number of homologous pairs; humans: 2²³ ≈ 8 million",
    },
    {
      latex: "P(\\text{crossover}) = \\text{map distance in cM} / 100",
      description: "Recombination frequency = genetic map distance in centimorgans",
    },
  ],

  theory:
    "Meiosis consists of two sequential divisions (Meiosis I and II) that reduce chromosome number from 2n to n. In Meiosis I (reductive division), homologous chromosomes pair up as bivalents during Prophase I. Crossing over (recombination) at chiasmata shuffles alleles between homologs, creating new gene combinations. During Metaphase I, bivalents align randomly (independent assortment). After Meiosis I, two haploid cells result. Meiosis II (equational division) resembles mitosis — sister chromatids separate, producing 4 haploid gametes. Non-disjunction (failure of chromosomes to separate) causes aneuploidy: trisomy 21 (Down syndrome), monosomy X (Turner syndrome), XXY (Klinefelter syndrome).",

  instructions:
    "Adjust the crossover frequency slider and watch how chiasmata form during Prophase I. After Meiosis I completes, observe independent assortment creating random chromosome combinations. Enable Non-disjunction (Pro) to simulate chromosomal disorders. The gamete combination counter shows how variation increases exponentially with chromosome number.",

  challenges: [
    {
      id: "mei-c1",
      question: "A cell with 2n=8 undergoes meiosis. How many chromosomes are in each resulting gamete?",
      hint: "Meiosis halves chromosome number. Gametes have n = 8/2 = 4 chromosomes.",
      tier: "free",
    },
    {
      id: "mei-c2",
      question: "How many genetically unique gametes can a human (2n=46) theoretically produce from independent assortment alone?",
      hint: "2²³ ≈ 8.4 million combinations. With crossing over, the actual number is astronomically higher.",
      tier: "free",
    },
    {
      id: "mei-c3",
      question: "Crossing over between genes A and B occurs in 20% of meioses. What is the map distance in cM?",
      hint: "Map distance in cM = recombination frequency × 100 = 20 cM.",
      tier: "free",
    },
    {
      id: "mei-c4",
      question: "Non-disjunction occurs during Meiosis II for chromosome 21. How many of the 4 gametes will be aneuploid, and what types?",
      hint: "Meiosis II non-disjunction affects only that pair. Two gametes from the affected cell: one n+1 (disomic 21) and one n-1 (nullisomic 21). The other two gametes from the other Meiosis I product are normal.",
      tier: "pro",
    },
  ],

  wave: 3,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["mitosis", "natural-selection"],

  seoTitle: "Meiosis & Genetic Variation — Interactive Animation | NeonPhysics AP Biology",
  seoKeywords: [
    "meiosis animation",
    "crossing over simulation",
    "genetic variation interactive",
    "independent assortment",
    "AP Biology meiosis",
    "gamete formation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Meiosis and Genetic Variation",
  },
};
