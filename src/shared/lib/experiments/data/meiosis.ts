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
  contentSections: {
    whatIsIt:
      "Meiosis is a two-round division process that converts a diploid cell (2n) into four haploid gametes (n), each genetically unique. Every sperm or egg your body produces is the product of meiosis — and so is the genetic distinctiveness that makes you different from any sibling who shares both your parents. The two divisions are mechanistically different: Meiosis I is the reductive division that separates homologous chromosome pairs, while Meiosis II resembles mitosis and separates sister chromatids. Two processes generate variation before the final count: crossing over during Prophase I shuffles alleles between homologs at points called chiasmata, and independent assortment during Metaphase I randomly orients each homologous pair. Together they produce up to 2²³ — roughly 8 million — unique chromosome combinations in humans from independent assortment alone. This simulation lets you control crossing over, chromosome pairs, and non-disjunction to see how each mechanism contributes.",
    parameterExplanations: {
      crossoverFrequency:
        "Sets the number of crossover (chiasma) events per bivalent during Prophase I, from 0 to 3. Each crossover exchanges segments between a maternal and paternal chromatid, creating recombinant chromosomes. Setting this to 0 removes all crossing over, allowing you to isolate and measure the contribution of independent assortment alone.",
      chromosomePairs:
        "Sets how many homologous pairs participate in the simulation (2 to 6). The number of independent assortment combinations scales as 2^n — so 2 pairs give 4 possible gamete types, 3 pairs give 8, and 6 pairs give 64. Use this parameter to demonstrate the exponential relationship between chromosome number and genetic diversity.",
      nondisjunctionProb:
        "Sets the probability (0–30%) that homologous chromosomes fail to separate during Meiosis I, or that sister chromatids fail to separate during Meiosis II. When non-disjunction occurs, gametes are aneuploid — carrying an extra chromosome (n+1) or missing one (n-1). Fertilization of an n+1 egg with a normal sperm produces a trisomic zygote; trisomy 21 causes Down syndrome.",
      showCombinations:
        "When enabled (1), displays the gamete combination counter after each round of meiosis, making the 2^n independent assortment formula visible as a live count. Toggle it off to have students predict the number before the simulation reveals it — an effective formative assessment move.",
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
      "Crossing over data collection: set crossoverFrequency to 0, 1, 2, and 3 in separate runs, record the gamete combination count each time, and graph results — students should see that recombination increases variation beyond what independent assortment alone produces.",
      "Non-disjunction consequence probe: raise nondisjunctionProb to 20% and ask students to predict, before running, how many of the four gametes will likely be aneuploid in Meiosis I versus Meiosis II non-disjunction — probing whether they understand the two-stage structure of meiosis.",
      "2^n prediction exercise: give students a chromosome pair count and have them calculate the expected gamete combinations before sliding chromosomePairs in the simulation — reinforcing AP standard 3.A.4 on the exponential nature of genetic diversity.",
      "Clinical connection discussion: use the non-disjunction results to discuss trisomy 21, Turner syndrome (45,X), and Klinefelter syndrome (47,XXY) — grounding the chromosome mechanics in real human outcomes and NGSS standard HS-LS3-2.",
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
          "From independent assortment alone: 2²³ = 8,388,608 combinations. With crossing over at an average of 1–3 events per chromosome pair, the actual number of genetically distinct gametes any one person can produce is estimated at more than 70 trillion (7 × 10¹³). No two gametes a person produces are likely to be identical.",
      },
      {
        question: "Does NGSS standard HS-LS3-1 cover meiosis specifically?",
        answer:
          "Yes. HS-LS3-1 asks students to ask questions to clarify relationships about the role of DNA and chromosomes in coding for the inheritance of characteristics from parents to offspring. Meiosis is the mechanism that transmits a haploid set of chromosomes from parent to offspring — without meiosis, sexual reproduction would double the chromosome number each generation, which is incompatible with stable inheritance.",
      },
    ],
  },
};
