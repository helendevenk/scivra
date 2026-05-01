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
  contentSections: {
    whatIsIt:
      "The Hardy-Weinberg principle is a mathematical baseline that describes allele and genotype frequencies in a population that is not evolving. If a population meets five conditions — no mutation, no migration, random mating, no natural selection, and a large enough population to avoid genetic drift — allele frequencies p and q remain constant generation after generation, and genotype frequencies are always p² (AA) + 2pq (Aa) + q² (aa) = 1. No real population is perfectly static, but the principle is useful precisely because deviations from it reveal which evolutionary force is operating. A population of sickle-cell carriers that has more heterozygotes than 2pq predicts is showing balancing selection. A small island population whose allele frequencies jump erratically from year to year is showing genetic drift. This simulation lets you set starting conditions and then introduce selection, mutation, and population size to watch the equilibrium break — or hold.",
    parameterExplanations: {
      pFreq:
        "The starting frequency of the dominant allele A, from 0.01 to 0.99. Because p + q = 1, setting p also sets q. At p = 0.6, the expected genotype distribution is AA = 0.36, Aa = 0.48, aa = 0.16. The simulation runs forward in time from this starting point and plots how p changes over generations.",
      popSize:
        "The number of individuals in the modeled population, from 20 to 10,000. Population size directly controls genetic drift: a population of 20 will show large random swings in allele frequency each generation, while a population of 10,000 tracks Hardy-Weinberg predictions closely. Set popSize to 50 to see bottleneck-like drift even without a discrete bottleneck event.",
      selectionCoeff:
        "The selection coefficient against the aa homozygote, from 0 (no selection) to 1 (lethal). A value of 0.1 means aa individuals leave 10% fewer offspring than AA or Aa individuals per generation. Even modest selection (s = 0.1) noticeably shifts p over 100 generations, demonstrating why Hardy-Weinberg requires zero selection.",
      mutationRate:
        "The per-generation probability that allele A mutates to allele a, from 0 to 0.01 (1%). Realistic biological mutation rates are far lower — around 10⁻⁵ to 10⁻⁶ per locus per generation — but raising this parameter shows students how mutation pressure gradually shifts equilibrium q upward. Mutation alone is too slow to drive rapid evolution; its role is introducing new alleles that selection then acts on.",
      generations:
        "The number of generations the simulation runs before stopping, from 10 to 500. Short runs (10–20 generations) are useful for seeing immediate effects of strong selection. Long runs (200–500) reveal slow-acting forces like mutation pressure or weak selection (s = 0.05) that would be invisible in a short time window.",
    },
    misconceptions: [
      {
        wrong:
          "A dominant allele automatically becomes more common over time.",
        correct:
          "Dominance describes how an allele is expressed, not how common it is. A dominant allele that reduces fitness will decline in frequency just as quickly as a recessive one would. Hardy-Weinberg equilibrium holds allele frequencies constant regardless of dominance — frequency change only happens when one of the five equilibrium conditions is violated.",
      },
      {
        wrong:
          "If a trait is rare, the allele must be recessive.",
        correct:
          "Trait rarity and allele dominance are unrelated. A dominant allele can be rare (frequency near 0) if it has recently arisen by mutation or causes low fitness. Huntington's disease is caused by a dominant allele that remains rare because its fitness effects appear after reproductive age.",
      },
      {
        wrong:
          "Hardy-Weinberg equilibrium means allele frequencies are always 50/50.",
        correct:
          "Hardy-Weinberg equilibrium preserves whatever starting frequencies are set — it does not push them toward 0.5. If p = 0.9 at generation 0 and all five conditions are met, p stays at 0.9 indefinitely. The principle is about stability, not about a specific value.",
      },
      {
        wrong:
          "In a population of 50, the Hardy-Weinberg equation still gives accurate predictions.",
        correct:
          "Hardy-Weinberg assumes effectively infinite population size. In a population of 50, genetic drift — random sampling error in allele transmission — is large enough to shift frequencies by several percent per generation. The equation can still be applied as a reference expectation, but deviations from it are expected and do not necessarily indicate selection.",
      },
    ],
    teacherUseCases: [
      "Baseline calculation exercise: set selectionCoeff = 0, mutationRate = 0, and popSize = 10000, then run 100 generations. Confirm with students that p stays constant — this establishes what true equilibrium looks like before any forces are introduced.",
      "Selection force experiment: hold all else constant and vary selectionCoeff from 0.05 to 1.0 in separate runs, plotting how many generations it takes for q to fall below 0.05. Students discover that selection against a recessive allele becomes progressively less efficient as q decreases — because most 'a' alleles are hidden in Aa heterozygotes.",
      "Genetic drift vs. selection comparison: run popSize = 50 with selectionCoeff = 0 versus popSize = 5000 with selectionCoeff = 0.05, asking which scenario changes allele frequency faster. Results challenge the intuition that selection is always the dominant force.",
      "Carrier frequency calculation: set q² = 0.04 (4% affected), pause, and ask students to compute q, p, and 2pq before revealing the simulation output — directly practicing AP standard 7.A.1 problem-solving.",
      "Deviation-as-evidence probe: introduce mutation or migration mid-run and ask students to identify, from the graph alone, at which generation an evolutionary force was introduced — building the core AP Bio reasoning skill of using H-W deviation as evidence of evolution.",
    ],
    faq: [
      {
        question: "What does it actually mean for a population to be 'in Hardy-Weinberg equilibrium'?",
        answer:
          "It means allele frequencies are not changing across generations, and observed genotype frequencies match the expected p², 2pq, q² proportions calculated from those allele frequencies. In practice, researchers calculate expected genotype counts from observed allele frequencies and compare them to observed counts using a chi-square test. A non-significant result is consistent with equilibrium; a significant result indicates at least one of the five conditions is being violated.",
      },
      {
        question: "If p = 0.7, what are the genotype frequencies under Hardy-Weinberg?",
        answer:
          "With p = 0.7 and q = 0.3: AA = p² = 0.49, Aa = 2pq = 2(0.7)(0.3) = 0.42, aa = q² = 0.09. Check: 0.49 + 0.42 + 0.09 = 1.00. In a population of 1,000, that predicts 490 AA individuals, 420 Aa carriers, and 90 aa individuals.",
      },
      {
        question: "How does AP standard 7.A.1 use the Hardy-Weinberg equation?",
        answer:
          "AP standard 7.A.1 requires students to apply the Hardy-Weinberg equation to calculate allele and genotype frequencies and to determine whether a population is evolving. A classic AP Free Response scenario gives students the frequency of one phenotype class (e.g., 9% show the recessive trait), asks them to solve for q, then p, then 2pq, and finally to state which evolutionary force might explain an observed deviation. Mastering the algebraic solve-for-q-first approach is essential.",
      },
      {
        question: "Why does selection against a recessive allele slow down as the allele becomes rare?",
        answer:
          "When q is small, nearly all copies of the recessive allele are carried in heterozygotes (Aa), not in the homozygotes (aa) that selection can actually see. The proportion of 'a' alleles exposed to selection is approximately 2pq / (2pq + 2q²) = p / (p + q) ≈ p when q is small. As q approaches zero, almost none of the remaining 'a' alleles are in aa individuals, so selection has almost nothing to act on.",
      },
      {
        question: "What is the difference between allele frequency and phenotype frequency?",
        answer:
          "Allele frequency is the proportion of a specific allele among all allele copies in a gene pool (p for A, q for a). Phenotype frequency is the proportion of individuals showing a given trait — which depends on dominance. A recessive phenotype frequency equals q², not q. A dominant allele at q = 0.01 still produces a dominant phenotype in p² + 2pq = 0.9999 of the population — 99.99% show the dominant phenotype even though the recessive allele is only 1% of the gene pool.",
      },
    ],
  },
};
