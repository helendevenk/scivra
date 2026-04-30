import type { Experiment } from "@/shared/types/experiment";

export const msGenetics: Experiment = {
  id: "ms-genetics",
  slug: "ms-genetics",
  title: "Genetics & Heredity",
  subtitle: "DNA, genes, Punnett squares, and trait inheritance",
  description:
    "Build a Punnett square and predict the probability of offspring inheriting traits. See how dominant and recessive alleles combine. Run a simulated cross between two organisms and count phenotype ratios. Explore how mutations in DNA can alter traits.",
  thumbnail: "/imgs/experiments/ms-genetics.png",

  standards: {
    ngss: ["MS-LS3-1", "MS-LS3-2", "HS-LS3-2"],
    gcse: ["B6.1", "B6.2"],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "biology",
  subject: "biology",
  gradeLevel: "6-8",
  tags: ["genetics", "heredity", "Punnett square", "dominant recessive", "alleles", "DNA", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "parent1",
      label: "Parent 1 Genotype (0=AA, 1=Aa, 2=aa)",
      unit: "",
      min: 0,
      max: 2,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "parent2",
      label: "Parent 2 Genotype (0=AA, 1=Aa, 2=aa)",
      unit: "",
      min: 0,
      max: 2,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "traitType",
      label: "Trait Type (0=Autosomal, 1=X-linked)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "offspringCount",
      label: "Simulated Offspring Count",
      unit: "",
      min: 4,
      max: 100,
      default: 20,
      step: 4,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\text{Aa} \\times \\text{Aa} \\to 1\\text{AA}:2\\text{Aa}:1\\text{aa} \\quad (3:1\\text{ phenotype ratio})",
      description: "Monohybrid cross of two heterozygotes yields 3:1 dominant:recessive phenotype ratio",
    },
    {
      latex: "P(\\text{trait}) = \\frac{\\text{favorable outcomes}}{\\text{total outcomes}}",
      description: "Probability of inheriting a specific trait from the Punnett square",
    },
  ],

  theory:
    "Heredity is the passing of traits from parents to offspring through genes. Genes are segments of DNA that code for proteins determining traits. Each organism has two copies of each gene (alleles) — one from each parent. Dominant alleles (uppercase, A) mask recessive alleles (lowercase, a) when both are present. Genotype is the actual gene combination (AA, Aa, aa); phenotype is the visible trait. Punnett squares predict offspring genotype probabilities. An Aa × Aa cross gives 25% AA, 50% Aa, 25% aa — 3:1 ratio showing dominant trait. Some traits are sex-linked (on the X chromosome), giving different patterns in males vs females. Mutations are changes in DNA sequence that can alter traits and are the source of genetic variation for evolution.",

  instructions:
    "Set parent genotypes and build the Punnett square. The 4-box grid shows all possible offspring combinations. Count the proportion of dominant (A_) vs. recessive (aa) phenotypes. Run the simulation with many offspring (Pro) to see how actual ratios approach theoretical predictions. Try X-linked traits to see why color blindness is more common in males.",

  challenges: [
    {
      id: "gen-ms-c1",
      question: "Two brown-eyed parents (both Bb) have children. What fraction will have blue eyes (bb)?",
      hint: "Punnett square: Bb × Bb → BB, Bb, Bb, bb. 1/4 (25%) of offspring are bb (blue eyes). 3/4 have brown eyes (BB or Bb).",
      tier: "free",
    },
    {
      id: "gen-ms-c2",
      question: "A tall plant (TT) is crossed with a short plant (tt). What will ALL offspring look like?",
      hint: "All offspring get one T allele from the tall parent and one t allele from the short parent → all are Tt. Since T is dominant, all offspring are tall. This is called the F1 generation.",
      tier: "free",
    },
    {
      id: "gen-ms-c3",
      question: "Why can two parents who both have normal color vision have a color-blind son?",
      hint: "Color blindness is X-linked recessive. Mother with normal vision can carry the recessive allele (X^B X^b). Father is normal (X^B Y). Sons get their X from mom — X^b Y sons are color blind (50% chance). Daughters can be carriers but rarely show it.",
      tier: "free",
    },
    {
      id: "gen-ms-c4",
      question: "If brown eyes (B) are dominant over blue (b), can two blue-eyed parents have a brown-eyed child?",
      hint: "No. Blue-eyed parents are both bb. They can only pass 'b' alleles to children. All children get bb → blue eyes. In contrast, two brown-eyed parents (each Bb) can have blue-eyed children.",
      tier: "pro",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 14,
  relatedExperiments: ["dna-double-helix", "natural-selection", "meiosis"],

  seoTitle: "Genetics Heredity Middle School | Punnett Square Interactive | Scivra",
  seoKeywords: [
    "genetics middle school simulation",
    "Punnett square interactive 6-8",
    "dominant recessive alleles simulation",
    "heredity interactive middle school",
    "DNA traits simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Genetics and Heredity",
  },
};
