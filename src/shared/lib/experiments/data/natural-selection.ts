import type { Experiment } from "@/shared/types/experiment";

export const naturalSelection: Experiment = {
  id: "natural-selection",
  slug: "natural-selection",
  title: "Natural Selection & Population Genetics",
  subtitle: "Darwin's engine of evolution",
  description:
    "Simulate evolution by natural selection in a population of colored beetles on different backgrounds. Watch allele frequencies shift over generations as selection pressure favors camouflaged individuals. Explore Hardy-Weinberg equilibrium, genetic drift, founder effects, and speciation. See evolution happen in real time.",
  thumbnail: "/imgs/experiments/natural-selection.png",

  standards: {
    ngss: ["HS-LS4-2", "HS-LS4-4"],
    gcse: ["B14.1", "B14.2", "B14.3"],
    ap: ["1.A.1", "1.A.2", "1.C.1"],
  },
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: ["natural selection", "evolution", "Hardy-Weinberg", "allele frequency", "genetic drift", "AP Biology"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "populationSize",
      label: "Initial Population Size",
      unit: "individuals",
      min: 20,
      max: 500,
      default: 100,
      step: 10,
      tier: "free",
    },
    {
      id: "selectionCoefficient",
      label: "Selection Coefficient (s)",
      unit: "",
      min: 0,
      max: 1,
      default: 0.2,
      step: 0.05,
      tier: "free",
    },
    {
      id: "initialAlleleFreq",
      label: "Initial Dominant Allele Frequency (p)",
      unit: "",
      min: 0.1,
      max: 0.9,
      default: 0.5,
      step: 0.05,
      tier: "free",
    },
    {
      id: "mutationRate",
      label: "Mutation Rate (μ)",
      unit: "×10⁻⁵",
      min: 0,
      max: 10,
      default: 1,
      step: 0.5,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "p^2 + 2pq + q^2 = 1 \\quad (\\text{Hardy-Weinberg})",
      description: "Hardy-Weinberg: genotype frequencies in a non-evolving population",
    },
    {
      latex: "\\Delta p = \\frac{spq^2}{1 - sq^2} \\quad (\\text{selection against recessive})",
      description: "Change in allele frequency per generation under selection",
    },
    {
      latex: "p + q = 1 \\quad (p = \\text{freq}(A), \\, q = \\text{freq}(a))",
      description: "Allele frequencies must sum to 1",
    },
  ],

  theory:
    "Natural selection is the differential survival and reproduction of individuals with heritable traits better suited to their environment. Darwin's four postulates: variation exists in populations; variation is heritable; more offspring are produced than can survive; individuals with favorable traits survive and reproduce more. Hardy-Weinberg equilibrium describes allele frequencies in a non-evolving population (random mating, no selection, no mutation, no migration, large population). Deviations from H-W indicate evolution is occurring. Selection against recessive alleles is slow because heterozygotes 'hide' the allele. Genetic drift (random fluctuations, stronger in small populations) can fix or eliminate alleles regardless of fitness. Bottleneck and founder effects reduce genetic diversity. Over time, selection + isolation → speciation.",

  instructions:
    "Choose a background environment (green/brown/mixed) and a starting allele frequency. Run the simulation and watch the population evolve — camouflaged beetles survive longer. The allele frequency chart updates each generation. Enable Hardy-Weinberg mode to check if the population is in equilibrium. Try bottleneck events (reduce population suddenly) to see genetic drift.",

  challenges: [
    {
      id: "ns-c1",
      question: "In a population, the frequency of allele 'a' is q=0.4. Under Hardy-Weinberg equilibrium, what are the frequencies of AA, Aa, and aa genotypes?",
      hint: "p=0.6, q=0.4. AA=p²=0.36, Aa=2pq=0.48, aa=q²=0.16. Check: 0.36+0.48+0.16=1 ✓",
      tier: "free",
    },
    {
      id: "ns-c2",
      question: "In a sample of 200 individuals, you find 32 individuals with the recessive phenotype (aa). What is the frequency of the recessive allele?",
      hint: "aa frequency = 32/200 = 0.16 = q². Therefore q = √0.16 = 0.4.",
      tier: "free",
    },
    {
      id: "ns-c3",
      question: "Why does selection against a recessive allele become less effective at low allele frequencies?",
      hint: "At low q, almost all 'a' alleles are hidden in Aa heterozygotes (which are not selected against). Selection can only act on aa homozygotes — very rare when q is small.",
      tier: "free",
    },
    {
      id: "ns-c4",
      question: "A population of 10,000 is reduced to 10 individuals (bottleneck) then recovers. Even if selection is neutral, why might the recovered population have very different allele frequencies?",
      hint: "Genetic drift: with only 10 individuals, allele frequencies fluctuate randomly. Some alleles may be lost entirely (frequency → 0) or fixed (frequency → 1) by chance alone. The founders determine the entire future population's genetic composition — the founder effect.",
      tier: "pro",
    },
  ],

  wave: 3,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["meiosis", "dna-double-helix"],

  seoTitle: "Natural Selection Evolution Simulation | NeonPhysics AP Biology",
  seoKeywords: [
    "natural selection simulation",
    "evolution population genetics",
    "Hardy-Weinberg equilibrium",
    "allele frequency interactive",
    "AP Biology evolution",
    "genetic drift simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Natural Selection and Population Genetics",
  },
};
