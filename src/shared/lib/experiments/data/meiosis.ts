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
      id: "chromosomePairs",
      label: "Chromosome Pairs",
      unit: "",
      min: 1,
      max: 4,
      default: 2,
      step: 1,
      tier: "free",
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
    "Use the Chromosome Pairs slider to change how many homologous pairs appear in the model. Try the Meiosis I Complete, Meiosis II Complete, and Crossing Over Detail presets to compare homolog separation, sister chromatid separation, and recombination.",

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

  seoTitle: "Meiosis & Genetic Variation — Interactive Animation | Scivra AP Biology",
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
  htmlControlAliases: { chromosomePairs: "sl-pairs" },
  presets: [
    {
      id: "meiosis1",
      label: "Meiosis I Complete",
      description:
        "Shows the result after homologous chromosome pairs separate during the first meiotic division, reducing the chromosome set from diploid toward haploid.",
    },
    {
      id: "meiosis2",
      label: "Meiosis II Complete",
      description:
        "Shows the result after sister chromatids separate during the second meiotic division, producing haploid gamete products from the earlier division.",
    },
    {
      id: "crossingover",
      label: "Crossing Over Detail",
      description:
        "Focuses on recombination during Prophase I, where homologous chromosomes exchange matching segments and create new allele combinations.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Meiosis is a two-round division process that converts a diploid cell (2n) into four haploid gametes (n), each genetically unique. Every sperm or egg your body produces is the product of meiosis — and so is the genetic distinctiveness that makes you different from any sibling who shares both your parents. The two divisions are mechanistically different: Meiosis I is the reductive division that separates homologous chromosome pairs, while Meiosis II resembles mitosis and separates sister chromatids. Two processes generate variation before the final count: crossing over during Prophase I shuffles alleles between homologs at points called chiasmata, and independent assortment during Metaphase I randomly orients each homologous pair. Together they produce up to 2²³ — roughly 8 million — unique chromosome combinations in humans from independent assortment alone. This simulation lets you control crossing over, chromosome pairs, and non-disjunction to see how each mechanism contributes.",
    parameterExplanations: {
      chromosomePairs:
        "Chromosome Pairs controls how many homologous pairs appear in the model, from 1 to 4. Each pair includes a maternal and paternal homolog that line up during Meiosis I, then separate so each gamete receives one chromosome from the pair. Increasing the value makes independent assortment easier to see: one pair has only two possible orientations, while four pairs can produce many more chromosome combinations. Use this slider before choosing a preset, then compare Meiosis I Complete, Meiosis II Complete, and Crossing Over Detail to connect chromosome number with the visible steps that generate variation.",
    },
    misconceptions: [
      {
        wrong:
          "Meiosis and mitosis both cut the chromosome number in half.",
        correct:
          "Only meiosis reduces chromosome number. Mitosis produces two diploid (2n) daughters identical to the parent. Meiosis produces four haploid (n) gametes. The key event that makes meiosis reductive is the separation of homologous pairs in Meiosis I — nothing like this happens in mitosis.",
      },
      {
        wrong:
          "Crossing over is random damage to chromosomes that sometimes happens.",
        correct:
          "Crossing over is a tightly regulated enzymatic process that occurs at specific recombination hotspots during Prophase I. It requires the synaptonemal complex and a dedicated set of recombinase proteins. At least one crossover per bivalent is essential for correct chromosome segregation — too little crossing over actually increases non-disjunction risk.",
      },
      {
        wrong:
          "The four gametes from one meiosis are all different from each other.",
        correct:
          "Not necessarily. Meiosis II separates sister chromatids, so if no crossing over occurred in a given bivalent, the two products of Meiosis II for that chromosome are identical. Genetic diversity mainly comes from crossing over in Prophase I and from independent assortment across all chromosome pairs.",
      },
      {
        wrong:
          "Non-disjunction only happens in Meiosis I.",
        correct:
          "Non-disjunction can occur in either Meiosis I (homologs fail to separate) or Meiosis II (sister chromatids fail to separate). Meiosis I non-disjunction affects both cells produced after Meiosis I, resulting in all four gametes being aneuploid. Meiosis II non-disjunction affects only one of the two Meiosis I products, leaving two normal and two aneuploid gametes.",
      },
      {
        wrong:
          "Independent assortment means chromosomes randomly mix their individual genes during Meiosis I.",
        correct:
          "Independent assortment means entire homologous chromosomes orient randomly at the Metaphase I plate — maternal chromosome 1 can end up on either side, independently of how chromosome 2 is oriented. Individual genes on the same chromosome are not independently sorted unless separated by crossing over. Genes close together on one chromosome tend to be inherited together (genetic linkage).",
      },
    ],
    teacherUseCases: [
      "Meiosis vs. mitosis contrast activity: run both simulations side by side and ask student pairs to record three structural differences they observe — targeting the common misconception that both processes halve chromosome number.",
      "Preset sequence walkthrough: move from Crossing Over Detail to Meiosis I Complete to Meiosis II Complete and ask students to identify which chromosome structures separate at each stage.",
      "2^n prediction exercise: give students a chromosome pair count and have them calculate the expected gamete combinations before moving the Chromosome Pairs slider — reinforcing AP standard 3.A.4 on the exponential nature of genetic diversity.",
      "Chromosome-count checkpoint: set the slider to 1, then 2, then 4 pairs and have students explain why gametes receive one chromosome from each homologous pair after meiosis.",
      "Clinical connection discussion: use the normal separation sequence to introduce how segregation errors can lead to trisomy 21, Turner syndrome (45,X), and Klinefelter syndrome (47,XXY) — grounding the chromosome mechanics in real human outcomes and NGSS standard HS-LS3-2.",
    ],
    faq: [
      {
        question: "Why does meiosis require two divisions instead of one?",
        answer:
          "Meiosis I separates homologous chromosomes, reducing the cell from 2n to n. But after Meiosis I, each chromosome still consists of two sister chromatids. Meiosis II is required to separate those sisters — just as mitosis does in somatic cells. Skipping Meiosis II would leave haploid cells whose chromosomes still carry two chromatids each — not the mature haploid gametes (one chromatid per chromosome) that fertilization requires.",
      },
      {
        question: "How does AP standard 3.A.4 relate to crossing over?",
        answer:
          "AP standard 3.A.4 addresses the role of meiosis in generating genetic variation. Crossing over is one of the two primary mechanisms it covers — the other being independent assortment. Each crossover event produces recombinant chromatids carrying allele combinations that neither parent chromosome originally held. With even one crossover per bivalent across 23 pairs, the theoretical number of unique gametes dwarfs the estimated number of atoms in the observable universe.",
      },
      {
        question: "What is the difference between a bivalent and a chromosome?",
        answer:
          "During Prophase I, homologous chromosomes pair up tightly to form a bivalent (also called a tetrad), which consists of four chromatids from two chromosomes. A single chromosome consists of two sister chromatids joined at the centromere. The bivalent is the structure on which crossing over occurs, and it separates at Anaphase I — sending one chromosome (still two chromatids) to each pole.",
      },
      {
        question: "How many unique gametes can a human theoretically produce?",
        answer:
          "From independent assortment alone: 2²³ = 8,388,608 combinations. Crossing over increases that number dramatically because recombinant chromatids can carry allele combinations that were not present on either original homolog. With recombination included, the actual number of genetically distinct gametes any one person can produce is estimated at more than 70 trillion (7 × 10¹³). No two gametes a person produces are likely to be identical.",
      },
      {
        question: "Does NGSS standard HS-LS3-1 cover meiosis specifically?",
        answer:
          "Yes. HS-LS3-1 asks students to ask questions to clarify relationships about the role of DNA and chromosomes in coding for the inheritance of characteristics from parents to offspring. Meiosis is the mechanism that transmits a haploid set of chromosomes from parent to offspring — without meiosis, sexual reproduction would double the chromosome number each generation, which is incompatible with stable inheritance.",
      },
    ],
  },
};
