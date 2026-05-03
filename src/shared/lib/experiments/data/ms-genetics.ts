import type { Experiment } from "@/shared/types/experiment";

export const msGenetics: Experiment = {
  id: "ms-genetics",
  slug: "ms-genetics",
  title: "Genetics & DNA",
  subtitle: "Population genetics, allele frequencies, and Hardy-Weinberg equilibrium",
  description:
    "Explore Hardy-Weinberg population genetics by setting an initial allele frequency p, applying mutation pressure across generations, and watching genotype frequencies update through p² + 2pq + q² = 1. The simulation shows how a gene pool can shift over time when mutation changes allele frequencies.",
  thumbnail: "/imgs/experiments/ms-genetics.png",

  standards: {
    ngss: ["MS-LS4-4", "MS-LS4-5"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "biology",
  subject: "biology",
  gradeLevel: "6-8",
  tags: [
    "genetics",
    "DNA",
    "alleles",
    "Hardy-Weinberg",
    "allele frequency",
    "population genetics",
    "genetic drift",
    "evolution",
    "middle school",
    "6-8",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "mutationRate",
      label: "Mutation Rate",
      unit: "%/gen",
      min: 0,
      max: 10,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "generations",
      label: "Generations",
      unit: "generations",
      min: 1,
      max: 10,
      default: 5,
      step: 1,
      tier: "free",
    },
    {
      id: "initialFreqP",
      label: "Initial Allele Frequency p",
      unit: "% (×100 = allele freq)",
      min: 10,
      max: 90,
      default: 70,
      step: 5,
      tier: "free",
    },
    {
      id: "viewRotation",
      label: "3D Rotation Rate",
      unit: "°",
      min: 1,
      max: 20,
      default: 10,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "p + q = 1",
      description: "The two allele frequencies in a two-allele population add to one",
    },
    {
      latex: "p^2 + 2pq + q^2 = 1",
      description: "Hardy-Weinberg genotype frequencies: AA = p², Aa = 2pq, aa = q²",
    },
    {
      latex: "p' = p(1 - \\mu) + q(0.1\\mu)",
      description: "Classroom mutation-pressure model used by the simulation to update allele frequency p",
    },
  ],

  theory:
    "Population genetics studies how allele frequencies change in a population over generations. In the Hardy-Weinberg model, p represents the frequency of one allele and q represents the frequency of the other allele, so p + q = 1. If a population is large, mating is random, and there is no mutation, migration, or selection, genotype frequencies remain predictable: p² for AA, 2pq for Aa, and q² for aa. Real populations often depart from that baseline because evolutionary forces alter the gene pool. This simulation focuses on mutation pressure: a recurring change in DNA that can gradually shift p and q, changing the expected genotype frequencies seen in the population.",

  instructions:
    "Use the four sliders to investigate the Hardy-Weinberg model. Set Mutation Rate, Generations, Initial Allele Frequency p, and 3D Rotation Rate, then compare the displayed p, q, p², 2pq, and q² values. Try the three presets — Neutral Evolution (μ=0), Strong Mutation Pressure, and Balanced Polymorphism — to compare a no-mutation baseline, a high-mutation case, and a moderate balanced-frequency case. Connect each result to p² + 2pq + q² = 1 and describe how mutation pressure changes allele frequencies across generations.",

  challenges: [
    {
      id: "gen-ms-c1",
      question: "If p = 0.70, what is q?",
      hint: "Use p + q = 1. If p = 0.70, then q = 1 - 0.70 = 0.30.",
      tier: "free",
    },
    {
      id: "gen-ms-c2",
      question: "If p = 0.60 and q = 0.40, what is the expected AA frequency?",
      hint: "AA frequency is p². Calculate 0.60 × 0.60 = 0.36, so about 36% of the population is expected to be AA.",
      tier: "free",
    },
    {
      id: "gen-ms-c3",
      question: "What happens to p when mutation pressure repeatedly converts A alleles toward a alleles?",
      hint: "The value of p decreases over generations, while q increases. The genotype frequencies then update because p², 2pq, and q² all depend on p and q.",
      tier: "free",
    },
    {
      id: "gen-ms-c4",
      question: "Why is a mutation rate of 0 useful as a comparison case?",
      hint: "A zero mutation rate creates a baseline. If p stays stable when mutation is off but changes when mutation is on, students can identify mutation pressure as the cause of the frequency shift.",
      tier: "free",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 14,
  relatedExperiments: ["dna-double-helix", "natural-selection", "meiosis"],
  htmlPath: "/experiments/middle/ms-genetics.html",

  seoTitle: "Hardy-Weinberg Population Genetics Middle School | Allele Frequency Interactive | Scivra",
  seoKeywords: [
    "Hardy-Weinberg middle school simulation",
    "allele frequency interactive",
    "population genetics simulation",
    "mutation pressure genetics",
    "evolution gene pool activity",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Hardy-Weinberg Population Genetics and Allele Frequencies",
  },
  htmlControlAliases: {
    mutationRate: "sl-mut",
    generations: "sl-gen",
    initialFreqP: "sl-p",
    viewRotation: "sl-rot",
  },
  presets: [
    {
      id: "neutral",
      label: "Neutral Evolution (μ=0)",
      description:
        "Turns mutation pressure off so students can use p, q, p², 2pq, and q² as a stable Hardy-Weinberg comparison case.",
      paramValues: { mutationRate: 0, generations: 5, initialFreqP: 50, viewRotation: 10 },
    },
    {
      id: "drift",
      label: "Strong Mutation Pressure",
      description:
        "Uses a high mutation rate with a moderate starting p value so the gene pool visibly shifts over several generations.",
      paramValues: { mutationRate: 8, generations: 8, initialFreqP: 50, viewRotation: 10 },
    },
    {
      id: "balanced",
      label: "Balanced Polymorphism",
      description:
        "Uses moderate mutation pressure and an allele frequency near the middle of the range to keep both alleles visible in the population.",
      paramValues: { mutationRate: 3, generations: 6, initialFreqP: 50, viewRotation: 10 },
    },
  ],
  contentSections: {
    whatIsIt:
      "This simulation is about population genetics: how the genetic makeup of a whole population changes over time. Instead of following one family, it follows a gene pool, which means all copies of a gene carried by the individuals in a population. The key quantity is allele frequency. If p is the frequency of allele A, then q is the frequency of allele a, and p + q = 1. Hardy-Weinberg equilibrium gives a baseline for a population that is not evolving: genotype frequencies should be p² for AA, 2pq for Aa, and q² for aa. Real populations often move away from that baseline because mutation, natural selection, gene flow, genetic drift, or non-random mating changes the gene pool. This model focuses on mutation pressure, letting students watch p shift across generations and then connect the changing p and q values to expected genotype frequencies.",
    parameterExplanations: {
      mutationRate:
        "Mutation Rate controls how strongly mutation pressure changes the allele pool each generation. At 0% per generation, the model acts like a neutral Hardy-Weinberg comparison case: p and q remain stable unless another force is introduced. As the slider rises, the model repeatedly converts some A alleles toward a alleles while allowing a smaller reverse change. That makes p decrease and q increase over time, so p², 2pq, and q² also change. The values are intentionally classroom-scale percentages, not real per-gene mutation rates, so students can see the pattern within a short simulation.",
      generations:
        "Generations sets how many rounds of allele-frequency change the simulation should show. A single generation may produce only a small shift, especially when Mutation Rate is low. More generations let the same pressure accumulate, making it easier to compare the starting p value with the final p value. This slider helps students separate rate from time: a small mutation rate over many generations can still matter, while a high mutation rate can create a visible change quickly. Use it with the data overlay to track whether genotype frequencies move gradually or sharply.",
      initialFreqP:
        "Initial Allele Frequency p sets the starting percentage of the A allele in the population. The HTML slider uses whole-number percentages from 10 to 90, then displays that value as a decimal from 0.10 to 0.90. Because q = 1 - p, changing this slider also changes the starting q value and all three expected genotype frequencies. For example, p = 0.70 gives q = 0.30, so AA = 0.49, Aa = 0.42, and aa = 0.09. Starting near 0.50 keeps both alleles common; starting near 0.90 makes one allele much more common at first.",
      viewRotation:
        "3D Rotation Rate changes how quickly the DNA helix visualization turns. It is a viewing control, not a genetics variable: it does not change p, q, mutation rate, or the Hardy-Weinberg calculations. A slower setting is useful when students need to read the data overlay and copy values. A faster setting can make the gene loci and DNA structure feel more dynamic during whole-class demonstration. Treat this slider as a presentation aid while keeping the scientific focus on the other three sliders and the p² + 2pq + q² relationship.",
    },
    misconceptions: [
      {
        wrong: "Hardy-Weinberg means every allele frequency should become 50%.",
        correct:
          "Hardy-Weinberg equilibrium means allele frequencies stay stable, not that they become equal. A population can be in equilibrium at p = 0.80 and q = 0.20 if the conditions for no evolutionary change are met. The equation uses whatever p and q values the population already has, then predicts genotype frequencies from those values.",
      },
      {
        wrong: "The value p² means the same thing as p.",
        correct:
          "The value p is an allele frequency: the fraction of all allele copies that are A. The value p² is a genotype frequency: the expected fraction of individuals with genotype AA under Hardy-Weinberg assumptions. Mixing those up is a common error. The data overlay helps separate allele frequencies, p and q, from genotype frequencies, p², 2pq, and q².",
      },
      {
        wrong: "Mutation always causes huge changes in one generation.",
        correct:
          "Mutation pressure is often gradual. In real populations, mutation rates for any one gene are usually very small, so visible changes can require many generations or interaction with selection and drift. This simulation uses larger classroom-scale mutation rates so the direction of change is visible, but students should not treat the slider values as typical real biological rates.",
      },
      {
        wrong: "A dominant allele must be the most common allele in a population.",
        correct:
          "Dominance describes expression in an individual, not frequency in a population. A dominant allele can be rare, and a recessive allele can be common. Population frequency depends on evolutionary forces such as selection, mutation, drift, and gene flow. That is why tracking p and q is more informative than assuming frequency from the allele label.",
      },
    ],
    teacherUseCases: [
      "Start with Neutral Evolution (μ=0), have students record p, q, p², 2pq, and q², then ask them to explain why this run is a useful baseline before mutation pressure is added.",
      "Use Strong Mutation Pressure as a cause-and-effect activity: students compare starting and ending p values, then write a short claim explaining how mutation changed the gene pool.",
      "Use Balanced Polymorphism to keep both alleles visible, then ask students to calculate p², 2pq, and q² by hand and compare their results with the overlay.",
      "Run the same Mutation Rate with 1 generation and then 10 generations so students can distinguish a rate of change from the amount of time that rate acts.",
      "Have students identify which controls change the genetic model and which control changes only the visualization, supporting careful interpretation of simulation variables.",
    ],
    faq: [
      {
        question: "What does p mean in Hardy-Weinberg?",
        answer:
          "In Hardy-Weinberg population genetics, p is the frequency of one allele in the whole population gene pool. If p = 0.70, then 70% of the allele copies at that gene position are A. The other allele frequency is q, and q must equal 1 - p. From those two allele frequencies, the model calculates expected genotype frequencies: p² for AA, 2pq for Aa, and q² for aa.",
      },
      {
        question: "Why does the equation use p², 2pq, and q²?",
        answer:
          "The terms come from combining allele frequencies in a randomly mating population. If the chance of receiving A is p from each side of reproduction, then AA has probability p × p, or p². The mixed genotype can happen in two orders, A then a or a then A, so it is 2pq. The aa genotype is q × q, or q². Together the three genotype frequencies add to 1.",
      },
      {
        question: "What does the mutation rate slider actually change?",
        answer:
          "The Mutation Rate slider changes how strongly the model shifts allele frequency p each generation. In this simulation, mutation pressure mostly converts A alleles toward a alleles, with a smaller reverse change. When the rate is 0, p stays stable as a comparison baseline. When the rate increases, p usually decreases over generations and q increases, which changes the expected AA, Aa, and aa genotype frequencies.",
      },
      {
        question: "Does this simulation model every force that causes evolution?",
        answer:
          "No. The visible control set focuses on mutation pressure and the resulting allele-frequency shift. The background lesson references other forces, including natural selection, genetic drift, and gene flow, because those also explain why real populations depart from Hardy-Weinberg equilibrium. For this specific interactive, students should use Mutation Rate, Generations, and Initial Allele Frequency p as the evidence for the modeled change.",
      },
      {
        question: "Which NGSS standards does this experiment support?",
        answer:
          "This experiment supports MS-LS4-4 and MS-LS4-5 because students use a model to reason about variation in populations and how genetic factors can become more or less common over time. The simulation is not a full natural-selection model, but it gives students a quantitative way to see that populations are described by allele frequencies and that those frequencies can shift across generations.",
      },
    ],
  },
};
