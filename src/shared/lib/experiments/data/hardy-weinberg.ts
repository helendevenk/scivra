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
    ngss: ["HS-LS4-3"],
    gcse: [],
    ap: ["7.5.A"],
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
    { id: "pFreq", label: "Allele Frequency p", unit: "", min: 0.01, max: 0.99, default: 0.7, step: 0.01, tier: "free" },
    { id: "selectionCoeff", label: "Selection Coefficient s", unit: "", min: 0, max: 1, default: 0, step: 0.01, tier: "free" },
    { id: "mutationRate", label: "Mutation Rate μ", unit: "", min: 0, max: 0.05, default: 0, step: 0.001, tier: "free" },
    { id: "migrationRate", label: "Migration Rate", unit: "", min: 0, max: 0.3, default: 0, step: 0.01, tier: "free" },
    { id: "popSize", label: "Population Size N", unit: "", min: 10, max: 2000, default: 1000, step: 10, tier: "free" },
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
    "The Hardy-Weinberg principle states that allele and genotype frequencies in a population remain constant from generation to generation in the absence of evolutionary forces. Five conditions must be met: (1) no mutation, (2) random mating, (3) no natural selection, (4) infinite population size (no genetic drift), and (5) no gene flow (migration). Given allele frequencies p and q (where p + q = 1), genotype frequencies are AA = p², Aa = 2pq, aa = q². Violations of these conditions cause departure from Hardy-Weinberg expectations. Selection, mutation, migration, and drift can all change allele frequencies; non-random mating (assortative mating, inbreeding) changes genotype but not allele frequencies. The mutationRate slider in this simulation defaults to a deliberately exaggerated value for classroom visibility — real per-locus mutation rates are typically 10⁻⁵ to 10⁻⁸ per generation, not 0.02.",

  instructions:
    "Use the five sliders — Allele Frequency p, Selection Coefficient s, Mutation Rate μ, Migration Rate, and Population Size N — to test the five Hardy-Weinberg assumptions: no selection, no mutation, no migration, no drift, and random mating. Try the five presets: 1 HW Equilibrium, 2 Selection vs aa, 3 Genetic Drift N=10, 4 Mutation Pressure, and 5 Gene Flow. Compare each run to p² + 2pq + q² expectations and identify which evolutionary force changes allele frequencies.",

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
  htmlControlAliases: { pFreq: "sl-p", selectionCoeff: "sl-s", mutationRate: "sl-mu", migrationRate: "sl-mig", popSize: "sl-n" },
  presets: [
    { id: "hw", label: "1 HW Equilibrium", paramValues: { pFreq: 0.7, selectionCoeff: 0, mutationRate: 0, migrationRate: 0, popSize: 1000 } },
    { id: "selection", label: "2 Selection vs aa", paramValues: { pFreq: 0.5, selectionCoeff: 0.3, mutationRate: 0, migrationRate: 0, popSize: 1000 } },
    { id: "drift", label: "3 Genetic Drift N=10", paramValues: { pFreq: 0.5, selectionCoeff: 0, mutationRate: 0, migrationRate: 0, popSize: 10 } },
    { id: "mutation", label: "4 Mutation Pressure", paramValues: { pFreq: 0.5, selectionCoeff: 0, mutationRate: 0.02, migrationRate: 0, popSize: 1000 } },
    { id: "migration", label: "5 Gene Flow", paramValues: { pFreq: 0.5, selectionCoeff: 0, mutationRate: 0, migrationRate: 0.15, popSize: 1000 } },
  ],
  contentSections: {
    whatIsIt:
      "The Hardy-Weinberg principle is a mathematical baseline that describes allele and genotype frequencies in a population that is not evolving. If a population meets five conditions — no mutation, no migration, random mating, no natural selection, and a large enough population to avoid genetic drift — allele frequencies p and q remain constant generation after generation, and genotype frequencies are always p² (AA) + 2pq (Aa) + q² (aa) = 1. No real population is perfectly static, but the principle is useful precisely because deviations from it reveal which evolutionary force is operating. A population of sickle-cell carriers that has more heterozygotes than 2pq predicts is showing balancing selection. A small island population whose allele frequencies jump erratically from year to year is showing genetic drift. This simulation lets you set starting conditions and then introduce selection, mutation, and population size to watch the equilibrium break — or hold.",
    parameterExplanations: {
      pFreq:
        "Allele Frequency p sets the starting proportion of the A allele in the gene pool. Because p + q = 1, every change to p also changes q, then the expected genotype frequencies: AA = p², Aa = 2pq, and aa = q². In AP Biology Big Idea 7, this is the quantitative baseline students use before arguing that evolution is happening. For HS-LS4-3, pFreq lets students connect mathematical evidence to how heritable variation is distributed before selection, drift, mutation, or gene flow changes that distribution.",
      selectionCoeff:
        "Selection Coefficient s controls how strongly natural selection acts against the aa genotype. At s = 0, aa individuals have the same modeled fitness as AA and Aa, so the no-selection Hardy-Weinberg assumption is preserved. Raising s gives aa lower reproductive success, so allele frequencies shift as the recessive allele is exposed in homozygotes. This supports AP Biology Big Idea 7 by showing that evolution is a change in allele frequencies, not simply a trait appearing. It also supports HS-LS4-3 because students can use graph evidence to explain how advantageous traits become more common.",
      mutationRate:
        "Mutation Rate μ adds a recurring source of new allele copies in the model. Hardy-Weinberg assumes no mutation, so μ = 0 belongs to the equilibrium baseline. Increasing μ shows mutation pressure: allele frequencies can change even when selection, migration, and drift are absent. The effect is usually slower than selection, which is a useful AP Biology Big Idea 7 comparison because mutation creates variation while selection sorts variation. For HS-LS4-3, students can describe mutation as one source of heritable variation that may later affect survival and reproduction depending on the environment.",
      migrationRate:
        "Migration Rate models gene flow, the movement of alleles into the population from outside. Hardy-Weinberg assumes no migration, so a nonzero value intentionally breaks that condition. In the Gene Flow preset, students can see allele frequencies shift even without selection or mutation because incoming individuals or gametes change the gene pool. This aligns with AP Biology Big Idea 7 by separating gene flow from natural selection as a distinct evolutionary mechanism. It also supports HS-LS4-3 discussions about how populations change when environments and population connections alter which heritable variants are present.",
      popSize:
        "Population Size N controls the strength of genetic drift, the random sampling effect that is strongest in small populations. Hardy-Weinberg assumes an effectively infinite population, so large N keeps random fluctuation small while N = 10 makes allele frequencies jump unpredictably. This is essential for AP Biology Big Idea 7 because students often expect only selection to cause evolution; drift can change allele frequencies without improving adaptation. For HS-LS4-3, popSize helps students evaluate when a population pattern is evidence of chance sampling rather than a trait increasing because it improves survival or reproduction.",
    },
    misconceptions: [
      {
        wrong:
          "A dominant allele automatically becomes more common over time.",
        correct:
          "Dominance describes how an allele is expressed, not how common it is. Hardy-Weinberg equilibrium holds allele frequencies constant regardless of dominance — frequency change only happens when one of the five equilibrium conditions is violated. Note that under selection, dominance does affect dynamics: a deleterious dominant allele is exposed to selection in every heterozygote, whereas a deleterious recessive can persist hidden in carriers, so the two decline at very different rates.",
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
      "Baseline calculation exercise: use the 1 HW Equilibrium preset or set pFreq = 0.7, selectionCoeff = 0, mutationRate = 0, migrationRate = 0, and popSize = 1000. Have students calculate p², 2pq, and q², then confirm that the model matches the no-selection, no-mutation, no-migration, no-drift baseline.",
      "Selection evidence investigation: use 2 Selection vs aa, then compare it with 1 HW Equilibrium. Students explain how changing only selectionCoeff alters allele frequencies and connect the result to HS-LS4-3 evidence for differential survival and reproduction.",
      "Genetic drift comparison: use 3 Genetic Drift N=10, then raise popSize to 1000 while keeping selectionCoeff, mutationRate, and migrationRate at 0. Students identify why random sampling causes much larger allele-frequency change in small populations.",
      "Mutation versus migration contrast: compare 4 Mutation Pressure with 5 Gene Flow. Students cite mutationRate and migrationRate values to distinguish new allele formation from allele movement between populations.",
      "AP-style claim-evidence-reasoning: assign groups one preset, hide the label, and ask them to infer whether selection, mutation, migration, or drift is disrupting Hardy-Weinberg equilibrium using pFreq trends, popSize, and the active parameter values.",
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
          "With pFreq = 0.7 and q = 0.3: AA = p² = 0.49, Aa = 2pq = 2(0.7)(0.3) = 0.42, aa = q² = 0.09. Check: 0.49 + 0.42 + 0.09 = 1.00. In a population of 1,000, that predicts 490 AA individuals, 420 Aa carriers, and 90 aa individuals.",
      },
      {
        question: "How does AP standard 7.A.1 use the Hardy-Weinberg equation?",
        answer:
          "AP standard 7.A.1 requires students to apply the Hardy-Weinberg equation to calculate allele and genotype frequencies and to determine whether a population is evolving. A classic AP Free Response scenario gives students the frequency of one phenotype class (e.g., 9% show the recessive trait), asks them to solve for q, then p, then 2pq, and finally to state which evolutionary force might explain an observed deviation. In this simulator, compare the HW Equilibrium preset with selectionCoeff, mutationRate, migrationRate, or low popSize cases to practice that reasoning.",
      },
      {
        question: "Why does selection against a recessive allele slow down as the allele becomes rare?",
        answer:
          "When q is small, nearly all copies of the recessive allele are carried in heterozygotes (Aa), not in the homozygotes (aa) that selection can actually see. The fraction of 'a' alleles exposed to selection (those sitting in aa homozygotes) is 2q² / (2pq + 2q²) = q / (p + q) ≈ q when q is small. The remaining fraction p ≈ 1 is hidden in heterozygotes. As q approaches zero, almost none of the remaining 'a' alleles are in aa individuals, so selectionCoeff has less visible variation to act on.",
      },
      {
        question: "What is the difference between allele frequency and phenotype frequency?",
        answer:
          "Allele frequency is the proportion of a specific allele among all allele copies in a gene pool (p for A, q for a). Phenotype frequency is the proportion of individuals showing a given trait — which depends on dominance. A recessive phenotype frequency equals q², not q. If the recessive allele has q = 0.01, the recessive phenotype frequency is q² = 0.0001 (0.01% of the population), while p² + 2pq = 0.9999 of the population shows the dominant phenotype — even though the recessive allele still makes up 1% of the gene pool.",
      },
    ],
  },
};
