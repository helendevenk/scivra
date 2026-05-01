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
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "9-12",
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

  seoTitle: "Natural Selection Evolution Simulation | Scivra AP Biology",
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
  contentSections: {
    whatIsIt:
      "Natural selection is the process by which heritable traits that improve an organism's reproductive success become more common in a population across generations. Darwin identified four conditions that make it inevitable: individuals vary in heritable traits, populations overproduce offspring, resources are limited, and individuals with certain variants survive and reproduce more. Antibiotic resistance in bacteria, the coloration of peppered moths during the Industrial Revolution, and the beak depth shifts in Galapagos finches during drought years are all the same mechanism operating at different speeds. It is not a force that pushes species toward complexity or perfection — selection only acts on the variation that already exists, and it only favors traits that help right now in the current environment. This simulation tracks allele frequency change over generations as the selection coefficient s moves from 0 (neutral) to 1 (lethal for the disfavored genotype), so you can watch the math of evolution run in real time.",
    parameterExplanations: {
      populationSize:
        "Sets the number of individuals in the starting population, from 20 to 500. Smaller populations amplify genetic drift — random allele frequency fluctuations — making it harder to isolate the deterministic effect of selection. A population of 500 shows a cleaner, more predictable trajectory; a population of 20 will add substantial noise. Use popSize = 50 versus popSize = 500 to demonstrate drift vs. selection as competing mechanisms.",
      selectionCoefficient:
        "The selection coefficient s describes the relative reproductive disadvantage of the least-fit genotype, from 0 to 1. At s = 0, there is no selection and allele frequencies follow Hardy-Weinberg expectations. At s = 0.2, the disfavored genotype leaves 20% fewer offspring per generation. At s = 1, the disfavored genotype is lethal. Allele frequency change per generation under selection against a recessive allele is Δp = spq² / (1 − sq²).",
      initialAlleleFreq:
        "Sets the starting frequency p of the dominant allele A, from 0.1 to 0.9. Because allele frequency trajectories are nonlinear, starting at p = 0.1 versus p = 0.5 with the same s produces very different rates of change. Start at a low p to observe how selection slowly drives a beneficial allele to fixation when it is rare; start at p = 0.9 to observe the asymptotic slowdown as the disfavored recessive allele becomes rare and hidden in heterozygotes.",
      mutationRate:
        "Sets the per-generation mutation rate from A to a (in units of ×10⁻⁵), from 0 to 10 ×10⁻⁵. Realistic genomic mutation rates are approximately 1–2 ×10⁻⁸ per base pair per generation, but per-locus rates of 10⁻⁵ are used in population genetics models to show the mutation-selection balance. At equilibrium, the frequency of a deleterious recessive allele is approximately q ≈ √(μ/s) when s is large.",
    },
    misconceptions: [
      {
        wrong:
          "\"Survival of the fittest\" means the physically strongest individuals survive.",
        correct:
          "Fitness in evolutionary biology means reproductive success — the number of viable offspring an individual contributes to the next generation. A small, \"weak\" organism that reproduces three times before dying has higher fitness than a large, strong one that reproduces once. Physical strength is only relevant if it translates into more surviving offspring in that specific environment.",
      },
      {
        wrong:
          "Natural selection has a direction — species are always evolving toward becoming more complex or more advanced.",
        correct:
          "Selection is purely local and immediate. It favors whatever traits increase reproduction in the current environment. Cave fish that lose their eyes under relaxed selection are not \"degenerating\" — losing costly eyes is adaptive when light is absent. Parasites that simplify their body plans are not primitive. There is no ladder of progress in evolution.",
      },
      {
        wrong:
          "If a trait is selected against, it will quickly disappear from the population.",
        correct:
          "The speed depends entirely on allele frequency and dominance. Selection against a recessive allele becomes very slow once q drops below 0.1, because most copies of the allele are hidden in heterozygotes that experience no fitness cost. Setting s = 0.5 and watching q fall from 0.3 to 0.05 takes many more generations than the first drop from 0.5 to 0.3.",
      },
      {
        wrong:
          "Individuals evolve during their lifetimes in response to environmental pressure.",
        correct:
          "Individuals do not evolve — populations do. A single organism cannot change its allele frequencies. What selection does is change which individuals survive to reproduce, so the next generation has a different distribution of inherited alleles. This is the distinction between Darwinian evolution and Lamarckism: selection acts on existing variation, it does not create adaptive changes in response to need.",
      },
      {
        wrong:
          "Mutation drives evolution by directly producing the traits that selection then favors.",
        correct:
          "Mutation generates raw variation at low rates (roughly 10⁻⁵ per locus per generation in models), but mutation pressure alone is far too slow to shift allele frequencies substantially over ecologically relevant timescales. Natural selection amplifies allele frequency change by orders of magnitude faster than mutation. The two processes work together: mutation introduces alleles, selection determines their fate.",
      },
    ],
    teacherUseCases: [
      "Selection coefficient sweep: run five simulations with s = 0, 0.1, 0.2, 0.5, and 1.0 using the same starting p = 0.5 and populationSize = 300, then ask students to plot the generation at which p exceeds 0.9 versus s — demonstrating the nonlinear relationship between selection strength and evolutionary rate.",
      "Drift vs. selection experiment: hold selectionCoefficient = 0.1 and run populationSize = 30 versus 300 ten times each, recording which runs end with fixation vs. loss by generation 100. Students discover that genetic drift can overpower moderate selection in small populations — probing whether they understand s as a probabilistic, not deterministic, force.",
      "Misconception probe: before running the simulation, ask students 'if s = 0.2, will the disfavored allele disappear by generation 50?' — then run it and compare prediction to result. Most students overestimate selection speed, especially at low q.",
      "Mutation-selection balance investigation: hold selectionCoefficient = 0.5 and raise mutationRate from 0 to 5 ×10⁻⁵ while running 500 generations, recording equilibrium q. Students can test the q ≈ √(μ/s) prediction and discuss why deleterious alleles persist in real populations at predictable low frequencies.",
      "AP Free Response prep: provide a scenario where a population is observed with fewer aa individuals than Hardy-Weinberg predicts; ask students to identify which parameter in this simulation is non-zero and what that means for the population — linking simulation behavior directly to NGSS standard HS-LS4-4.",
    ],
    faq: [
      {
        question: "What is the selection coefficient and how is it measured?",
        answer:
          "The selection coefficient s measures the proportional reduction in fitness of the least-fit genotype relative to the most fit. If the fittest genotype leaves an average of 100 offspring and the least-fit leaves 80, then s = (100 − 80) / 100 = 0.2. Values range from 0 (neutral, no selection) to 1 (lethal, zero offspring). In practice, s is estimated by tracking allele frequency change across generations and back-calculating from the selection equation.",
      },
      {
        question: "How do AP standards 1.A.1 and 1.A.2 map onto this simulation?",
        answer:
          "AP standard 1.A.1 addresses the concept that natural selection acts on heritable variation in traits, while 1.A.2 covers the four conditions required for natural selection to occur. In this simulation, initialAlleleFreq establishes variation, selectionCoefficient implements differential reproductive success, and the generational time axis demonstrates cumulative heritable change. Running the simulation with s = 0 alongside s = 0.2 directly contrasts a population satisfying H-W equilibrium conditions against one where selection violates them.",
      },
      {
        question: "Why does allele frequency change slow down as the favored allele approaches fixation?",
        answer:
          "The per-generation change in p under selection against a recessive is Δp = spq² / (1 − sq²). As q approaches 0, both q and q² shrink rapidly, so Δp shrinks even though s stays constant. The math mirrors the biology: when q is small, almost all 'a' alleles are hidden in Aa heterozygotes where they experience no selection penalty. Selection can only act on the aa individuals it can see, and those become exponentially rarer.",
      },
      {
        question: "What is the difference between natural selection and genetic drift?",
        answer:
          "Natural selection is deterministic: alleles with higher fitness reliably increase in frequency given enough time. Genetic drift is stochastic: allele frequencies change randomly due to sampling error in finite populations, with no relationship to fitness. In small populations (20–50 individuals), drift is often stronger than moderate selection (s = 0.1–0.2), and a beneficial allele can be lost by chance. NGSS standard HS-LS4-2 asks students to distinguish these mechanisms using evidence from allele frequency data.",
      },
      {
        question: "What is AP standard 1.C.1 and how does this experiment address it?",
        answer:
          "AP standard 1.C.1 states that the distribution of phenotypes in a population can change over time due to natural selection, genetic drift, and other mechanisms. This experiment addresses it directly: the allele frequency graph plots how the phenotype-determining genotype distribution shifts across up to 500 generations in response to the s and populationSize values you set. Comparing runs with and without selection isolates the contribution of each mechanism, which is precisely the type of experimental reasoning 1.C.1 targets.",
      },
    ],
  },
};
