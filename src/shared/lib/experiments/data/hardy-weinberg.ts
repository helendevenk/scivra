import type { Experiment } from "@/shared/types/experiment";

export const hardyWeinberg: Experiment = {
  id: "hardy-weinberg",
  slug: "hardy-weinberg",
  title: "Hardy-Weinberg Equilibrium",
  subtitle:
    "Allele frequencies, genotype ratios, and conditions for genetic equilibrium",
  description:
    "Investigate the Hardy-Weinberg principle by modeling a population with two alleles. Adjust allele frequencies and observe how genotype ratios follow the p² + 2pq + q² = 1 relationship. Introduce evolutionary forces (selection, mutation, migration, genetic drift, non-random mating) to see how they disrupt equilibrium and drive allele frequency changes over generations.",
  thumbnail: "/imgs/experiments/hardy-weinberg.png",

  standards: {
    ngss: ["HS-LS3-3", "HS-LS4-3"],
    gcse: [],
    ap: ["7.A.1", "7.B.1"],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: [
    "Hardy-Weinberg",
    "allele frequency",
    "genotype",
    "genetic equilibrium",
    "population genetics",
    "natural selection",
    "genetic drift",
    "AP Biology",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "pFreq",
      label: "p (dominant allele freq)",
      unit: "",
      min: 0.01,
      max: 0.99,
      default: 0.6,
      step: 0.01,
      tier: "free",
    },
    {
      id: "popSize",
      label: "Population Size",
      unit: "",
      min: 20,
      max: 10000,
      default: 1000,
      step: 20,
      tier: "free",
    },
    {
      id: "selectionCoeff",
      label: "Selection Against aa",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 0.05,
      tier: "free",
    },
    {
      id: "mutationRate",
      label: "Mutation Rate (A→a)",
      unit: "",
      min: 0,
      max: 0.01,
      default: 0,
      step: 0.001,
      tier: "pro",
    },
    {
      id: "generations",
      label: "Generations",
      unit: "",
      min: 10,
      max: 500,
      default: 100,
      step: 10,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "p + q = 1",
      description:
        "Allele frequency: p = dominant allele frequency, q = recessive allele frequency",
    },
    {
      latex: "p^2 + 2pq + q^2 = 1",
      description:
        "Genotype frequencies: AA = p², Aa = 2pq, aa = q² under Hardy-Weinberg equilibrium",
    },
    {
      latex:
        "\\Delta p = \\frac{pqs(ph + q)}{1 - sq^2}",
      description:
        "Change in allele frequency per generation under selection (s = selection coefficient, h = dominance)",
    },
  ],

  theory:
    "The Hardy-Weinberg principle states that allele and genotype frequencies in a population remain constant from generation to generation in the absence of evolutionary forces. Five conditions must be met: (1) no mutation, (2) random mating, (3) no natural selection, (4) infinite population size (no genetic drift), and (5) no gene flow (migration). Given allele frequencies p and q (where p + q = 1), genotype frequencies are AA = p², Aa = 2pq, aa = q². When any condition is violated, evolution occurs. Natural selection changes frequencies based on fitness differences. Genetic drift causes random fluctuations more pronounced in small populations. Mutation introduces new alleles at low rates. Migration introduces alleles from other populations. Non-random mating (assortative mating, inbreeding) changes genotype but not allele frequencies.",

  instructions:
    "Set the initial p frequency and population size, then press Simulate. The bar chart shows current genotype frequencies compared to Hardy-Weinberg predictions. The line chart tracks p and q over generations. Introduce selection, mutation, or reduce population size to observe deviations from equilibrium.",

  challenges: [
    {
      id: "hw-c1",
      question:
        "If p = 0.7, what are the expected genotype frequencies under Hardy-Weinberg?",
      hint: "AA = 0.7² = 0.49, Aa = 2(0.7)(0.3) = 0.42, aa = 0.3² = 0.09",
      tier: "free",
    },
    {
      id: "hw-c2",
      question:
        "In a population of 50 individuals, is Hardy-Weinberg maintained? Why or why not?",
      hint: "No — small populations experience genetic drift, causing random allele frequency changes each generation.",
      tier: "free",
    },
    {
      id: "hw-c3",
      question:
        "If 16% of a population shows the recessive phenotype, what is the carrier (heterozygote) frequency?",
      hint: "q² = 0.16 → q = 0.4 → p = 0.6 → 2pq = 2(0.6)(0.4) = 0.48 = 48% carriers",
      tier: "pro",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["population-dynamics", "natural-selection"],
  htmlPath: "/experiments/ap-biology/hardy-weinberg.html",

  seoTitle: "Hardy-Weinberg Equilibrium Simulator | Scivra AP Biology",
  seoKeywords: [
    "Hardy-Weinberg calculator",
    "allele frequency simulator",
    "population genetics interactive",
    "genotype ratio calculator",
    "AP Biology Hardy-Weinberg",
    "genetic drift simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Hardy-Weinberg Equilibrium and Population Genetics",
  },
};
