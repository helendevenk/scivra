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
      id: "selectionPressure",
      label: "Selection Pressure",
      unit: "",
      min: 0.01,
      max: 1,
      default: 0.3,
      step: 0.01,
      tier: "free",
    },
    {
      id: "mutationRate",
      label: "Mutation Rate",
      unit: "",
      min: 0,
      max: 0.1,
      default: 0.01,
      step: 0.005,
      tier: "free",
    },
    {
      id: "populationSize",
      label: "Population Size",
      unit: "individuals",
      min: 20,
      max: 300,
      default: 100,
      step: 10,
      tier: "free",
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
    "Use the Selection Pressure, Mutation Rate, and Population Size sliders to change how strongly the environment favors certain traits, how often new variation appears, and how much random drift affects the population. Try the Peppered Moths (Industrial), Antibiotic Resistance, and Beak Size (Finches) presets to compare three real evolutionary scenarios.",

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

  htmlPath: "/experiments/ap-biology/natural-selection.html",
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
  htmlControlAliases: { selectionPressure: "sl-sel", mutationRate: "sl-mut", populationSize: "sl-popsize" },
  presets: [
    {
      id: "moths",
      label: "Peppered Moths (Industrial)",
      description:
        "Models industrial-era camouflage selection, where environmental color changes make one moth variant more visible to predators and another better hidden.",
    },
    {
      id: "abx",
      label: "Antibiotic Resistance",
      description:
        "Shows how a treatment pressure can favor resistant variants, allowing them to survive and become more common across generations.",
    },
    {
      id: "finch",
      label: "Beak Size (Finches)",
      description:
        "Represents shifting food conditions in finch populations, where beak traits linked to feeding success change in frequency over time.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Natural selection is the process by which heritable traits that improve reproductive success become more common in a population across generations. Darwin identified four conditions: individuals vary in heritable traits, populations overproduce offspring, resources are limited, and certain variants survive and reproduce more. Antibiotic resistance in bacteria, peppered moths during the Industrial Revolution, and beak depth shifts in Galapagos finches during drought years are all the same mechanism operating at different speeds. Selection is not a force that pushes species toward complexity or perfection — it only acts on the variation that already exists, and only favors traits that help right now in the current environment. This simulation tracks allele frequency change as the selection coefficient s moves from 0 (neutral) to 1 (lethal for the disfavored genotype).",
    parameterExplanations: {
      selectionPressure:
        "Selection Pressure controls how strongly the environment rewards one trait over another. At low values, survival differences are subtle, so allele and phenotype frequencies may shift slowly and random drift can remain visible. At high values, poorly matched individuals are removed from the breeding population much faster, producing a steeper evolutionary response. Use this slider to compare weak, moderate, and intense selection while keeping Mutation Rate and Population Size steady. The important idea is that selection does not make individuals change during life; it changes which inherited variants are more likely to appear in the next generation.",
      mutationRate:
        "Mutation Rate controls how often new heritable variation enters the population during the simulation. A low setting makes the run mostly about selection acting on variation that already exists, while a higher setting continually introduces rare variants for selection or drift to act on. Mutation by itself is random with respect to usefulness: it can create helpful, harmful, or neutral changes. Try raising Mutation Rate while using the Antibiotic Resistance preset to see why rare resistant variants can matter when the environment changes. The slider helps separate the origin of variation from the filtering effect of natural selection.",
      populationSize:
        "Population Size sets how many individuals are represented in each generation. Larger populations tend to show smoother trends because random sampling errors average out across many births and deaths. Smaller populations make genetic drift more obvious: a trait can become common or disappear by chance, even when selection pressure is unchanged. Use 20 or 30 individuals to show noisy outcomes, then raise the slider toward 300 to show a more stable pattern. This control is useful for comparing deterministic selection with stochastic drift, especially when students repeat the same preset several times and notice that small populations do not always follow the same path.",
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
          "The speed depends on how strong the selection pressure is, how common the trait already is, and how much random drift is present. A strongly disfavored visible trait can decline quickly, but rare variants may persist for many generations, especially in larger populations or when they are not always exposed to selection. Use the Selection Pressure slider to test how fast the population changes under weak versus intense pressure.",
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
          "Mutation generates raw variation, but it does not know what the population needs. Most mutations are neutral or harmful in a given environment, and useful variants are usually rare. Natural selection changes how common variants become by filtering survival and reproduction after variation exists. The two processes work together: Mutation Rate affects how often new variants appear, while Selection Pressure affects which variants leave more descendants.",
      },
    ],
    teacherUseCases: [
      "Selection pressure sweep: run the same preset with Selection Pressure set low, medium, and high, then ask students to compare how quickly trait frequencies shift and connect the pattern to NGSS standard HS-LS4-4.",
      "Drift vs. selection experiment: keep Selection Pressure moderate and run Population Size near 30 versus near 300 several times each. Students record which outcomes vary most and explain why small populations show stronger genetic drift.",
      "Preset comparison: assign groups to Peppered Moths, Antibiotic Resistance, and Beak Size (Finches). Each group identifies the environmental pressure, the selected trait, and the evidence that the population changed over generations.",
      "Mutation investigation: hold Population Size and Selection Pressure steady while raising Mutation Rate. Students distinguish the creation of new variation from the process that makes some variants more common.",
      "AP Free Response prep: provide a scenario where phenotype frequencies change after an environmental shift; ask students to identify which slider best represents the causal pressure and justify the answer with evidence from the simulation.",
    ],
    faq: [
      {
        question: "What is the selection coefficient and how is it measured?",
        answer:
          "In population genetics, a selection coefficient estimates the fitness difference between variants. In this simulation, the Selection Pressure slider is the classroom-facing way to explore that idea. Low pressure means survival and reproduction differ only slightly between variants; high pressure means the environment filters variants much more strongly. Students do not need to calculate the coefficient to use the model, but they should connect stronger pressure with faster population-level change.",
      },
      {
        question: "How do AP standards 1.A.1 and 1.A.2 map onto this simulation?",
        answer:
          "AP standard 1.A.1 addresses the concept that natural selection acts on heritable variation in traits, while 1.A.2 covers the four conditions required for natural selection to occur. In this simulation, Mutation Rate introduces new variation, Selection Pressure represents differential survival or reproduction, and the generational time axis demonstrates cumulative heritable change. Comparing presets helps students identify the environmental condition that makes a trait advantageous.",
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
          "AP standard 1.C.1 states that the distribution of phenotypes in a population can change over time due to natural selection, genetic drift, and other mechanisms. This experiment addresses it directly: the frequency graph shows how population traits shift in response to Selection Pressure, Mutation Rate, and Population Size. Comparing repeated runs isolates the contribution of each mechanism, which is precisely the type of experimental reasoning 1.C.1 targets.",
      },
    ],
  },
};
