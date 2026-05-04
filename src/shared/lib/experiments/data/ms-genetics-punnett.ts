import type { Experiment } from "@/shared/types/experiment";

export const msGeneticsPunnett: Experiment = {
  id: "ms-genetics-punnett",
  slug: "ms-genetics-punnett",
  title: "Genetics: Punnett Square",
  subtitle: "Mendelian inheritance, genotypes, and phenotype ratios",
  description:
    "Build Punnett squares to predict offspring genotypes and phenotypes. Explore dominant and recessive traits, incomplete dominance, and codominance. Run virtual breeding experiments with hundreds of offspring to verify predicted ratios match observed results.",
  thumbnail: "/imgs/experiments/ms-genetics-punnett.png",
  standards: { ngss: ["MS-LS3-2"], gcse: [], ap: [] },
  primaryStandard: "ngss-ms",
  category: "biology",
  subject: "biology",
  gradeLevel: "6-8",
  tags: ["Punnett square", "genetics", "genotype", "phenotype", "Mendelian inheritance", "middle school biology"],
  difficulty: "beginner",
  parameters: [
    { id: "parent1Genotype", label: "Parent 1 Genotype (0=TT, 1=Tt, 2=tt)", unit: "index", min: 0, max: 2, default: 1, step: 1, tier: "free" },
    { id: "parent2Genotype", label: "Parent 2 Genotype (0=TT, 1=Tt, 2=tt)", unit: "index", min: 0, max: 2, default: 1, step: 1, tier: "free" },
  ],
  formulas: [
    { latex: "P(\\text{genotype}) = \\frac{\\text{favorable outcomes}}{4}", description: "Probability of each genotype from a monohybrid cross" },
  ],
  theory: "A Punnett square is a grid used to predict the genotypes of offspring from a genetic cross. Each parent contributes one allele. For a monohybrid cross (Aa × Aa), the predicted genotype ratio is 1 AA : 2 Aa : 1 aa. With complete dominance, the phenotype ratio is 3 dominant : 1 recessive. With incomplete dominance, heterozygotes show a blended phenotype (1:2:1 phenotype ratio). With codominance, both alleles are expressed equally.",
  instructions: "Use the Parent 1 Genotype and Parent 2 Genotype sliders to choose each parent's allele pair. Watch the Punnett square update automatically, then compare the four boxes to the genotype and phenotype ratios shown in the overlay.",
  challenges: [
    { id: "mgp-c1", question: "Cross Aa × Aa with complete dominance. What fraction of offspring show the recessive phenotype?", hint: "Punnett square gives 1 AA : 2 Aa : 1 aa. Only aa is recessive = 1/4 = 25%", tier: "free" },
    { id: "mgp-c2", question: "Cross Aa × aa. What genotype ratio do you expect?", hint: "1 Aa : 1 aa (50% heterozygous, 50% homozygous recessive)", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 15,
  relatedExperiments: ["hardy-weinberg", "evidence-of-evolution"],
  htmlPath: "/experiments/middle/ms-genetics-punnett.html",
  seoTitle: "Punnett Square Genetics Simulation | Scivra Middle School",
  seoKeywords: ["Punnett square simulator", "genetics interactive", "Mendelian inheritance", "genotype phenotype calculator"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Middle School", teaches: "Mendelian Genetics" },
  htmlControlAliases: { parent1Genotype: "sl-p1", parent2Genotype: "sl-p2" },
  contentSections: {
    whatIsIt:
      "The Punnett square is a four-box grid invented to predict the likely genotypes of offspring from a genetic cross. Each parent contributes one allele of a gene, and the grid maps all possible combinations. Named after geneticist Reginald Crundall Punnett, this tool is the foundation of Mendelian genetics — the rules of inheritance first described by Gregor Mendel through pea plant experiments in the 1860s. Mendel discovered that traits are inherited in predictable ratios, and the Punnett square is the visual tool that makes those ratios easy to see and calculate. Complete dominance is the most familiar pattern: the dominant allele fully masks the recessive one whenever they appear together (Aa looks the same as AA). But not all traits follow this pattern. Incomplete dominance produces a blended intermediate phenotype in heterozygotes — like red and white flowers producing pink offspring. Codominance is different again: both alleles are fully expressed simultaneously, as in certain blood type combinations. This simulation lets you build Punnett squares for all three dominance patterns and run virtual breeding experiments to see how well observed offspring ratios match mathematical predictions.",
    parameterExplanations: {
      parent1Genotype:
        "Parent 1 Genotype sets the allele pair contributed by the first parent: 0 = TT, 1 = Tt, and 2 = tt. The slider uses an integer index because the HTML control steps through three named genotype states rather than a continuous measurement. A TT parent can pass only T alleles, a tt parent can pass only t alleles, and a Tt parent can pass either allele with equal probability. Moving this slider changes the column labels in the Punnett square and immediately changes which four offspring combinations are possible.",
      parent2Genotype:
        "Parent 2 Genotype uses the same three-step index as Parent 1: 0 = TT, 1 = Tt, and 2 = tt. This parent supplies the row labels for the Punnett square, so changing the slider recombines its possible alleles with the current Parent 1 alleles. Setting both sliders to 1 models the classic Tt x Tt monohybrid cross, which produces TT, Tt, Tt, and tt in the four boxes. Comparing that grid with crosses like TT x tt or tt x tt helps students connect genotype choices to predictable inheritance ratios.",
    },
    misconceptions: [
      {
        wrong: "Incomplete dominance and codominance are the same thing because both give a 1:2:1 ratio.",
        correct:
          "Both produce a 1:2:1 phenotype ratio, but the biological outcome is different. Incomplete dominance produces a blended intermediate phenotype — the heterozygote shows a color or trait that is neither parental form (e.g., pink from red and white). Codominance means both traits are expressed fully and separately at the same time — the heterozygote shows both parental traits side by side (e.g., both red and white patches, not pink). The ratio looks the same numerically, but the visual result distinguishes them clearly.",
      },
      {
        wrong: "The Punnett square predicts which specific offspring will inherit which allele.",
        correct:
          "The Punnett square predicts probability, not certainty. Each box represents one equally likely allele combination from the two parents — it does not tell you which specific future offspring will have which genotype. Random fertilization means any one offspring could match any of the four boxes. The grid is best read as a model of expected proportions across many possible offspring, not as a sequence of guaranteed individual outcomes.",
      },
      {
        wrong: "If one parent has the dominant phenotype, all offspring will also show the dominant phenotype.",
        correct:
          "This is only guaranteed if the dominant parent is homozygous dominant (TT). If the dominant-looking parent is heterozygous (Tt) and the other parent is recessive (tt), half the Punnett square boxes are Tt and half are tt. That means the expected genotype ratio is 1:1, and half the possible offspring can show the recessive phenotype even though one parent shows the dominant trait.",
      },
      {
        wrong: "Dominant traits are always better or more evolved than recessive traits.",
        correct:
          "Dominance and recessiveness describe only how alleles interact inside a single organism — they say nothing about which version is healthier or more advantageous. Many recessive alleles are perfectly neutral or even beneficial in certain environments. Sickle cell trait is a famous example: the recessive allele causes problems in homozygotes but provides malaria resistance in heterozygotes, making it advantageous in malaria-prone regions.",
      },
    ],
    teacherUseCases: [
      "Set both genotype sliders to 1 for a Tt x Tt cross. Ask students to predict the four boxes before the square updates, then compare their prediction with the 1 TT : 2 Tt : 1 tt genotype pattern.",
      "Move Parent 1 Genotype to 0 and Parent 2 Genotype to 2 for a TT x tt cross. Have students explain why all four boxes become Tt even though the two parents have different genotypes.",
      "Set Parent 1 Genotype to 1 and Parent 2 Genotype to 2 for a Tt x tt cross. Ask students to identify which two boxes carry the recessive genotype and connect that to the expected 1:1 ratio.",
      "Keep Parent 2 Genotype fixed at 1 while moving Parent 1 Genotype from 0 to 1 to 2. Have students record how the Punnett square changes and describe which parent can contribute each allele.",
      "Use the two sliders as a formative check: students choose a cross that produces at least one tt box, then justify their slider settings using allele contribution rather than memorized ratios.",
    ],
    faq: [
      {
        question: "How does a Punnett square actually work?",
        answer:
          "A Punnett square organizes all the possible allele combinations from two parents in a 2x2 grid. Each parent's alleles are written along the top (parent 1) and side (parent 2). Each box in the grid represents one possible offspring by combining the allele from the column with the allele from the row. Because fertilization is random — any sperm can meet any egg — each box has an equal probability of occurring. Counting the boxes with each genotype gives the expected probability ratio for offspring.",
      },
      {
        question: "What is the difference between a genotype ratio and a phenotype ratio?",
        answer:
          "The genotype ratio describes how many offspring are expected to have each allele combination — for an Aa x Aa cross this is 1 AA : 2 Aa : 1 aa. The phenotype ratio describes how many offspring actually look different from each other. With complete dominance, AA and Aa both show the dominant phenotype, so the phenotype ratio collapses to 3 dominant : 1 recessive. With incomplete dominance or codominance, all three genotypes produce a visually distinguishable phenotype, so the phenotype ratio is 1:2:1, matching the genotype ratio.",
      },
      {
        question: "Which NGSS standard does this experiment address?",
        answer:
          "This simulation directly supports MS-LS3-2 (develop and use a model to describe why asexual reproduction results in offspring with identical genetic information while sexual reproduction results in offspring with genetic variation). The Punnett square is itself a model of how genetic variation arises through the random combination of alleles during sexual reproduction. Changing the two parent genotype sliders shows how different parental allele combinations lead to different possible offspring genotypes.",
      },
      {
        question: "Why do the ratios come from four boxes?",
        answer:
          "In a simple monohybrid Punnett square, each parent has two allele positions. One parent's possible alleles are placed across the top and the other parent's possible alleles are placed down the side. Combining each column with each row creates four equally likely boxes. Counting those boxes gives the expected genotype ratio. For example, Tt x Tt produces TT, Tt, Tt, and tt, so the genotype ratio is 1:2:1 and the complete-dominance phenotype ratio is 3:1.",
      },
      {
        question: "Are there traits controlled by more than one gene?",
        answer:
          "Yes, and most complex traits in real organisms are polygenic — controlled by multiple genes working together. Height, skin color, and intelligence are all polygenic traits that do not follow simple 3:1 or 1:1 Mendelian ratios. This simulation models single-gene (monogenic) traits to build the foundational concepts. Once you understand how one gene with two alleles behaves, you can begin to reason about what happens when multiple genes interact — which produces the continuous variation (like a range of heights) observed in real populations.",
      },
    ],
  },
};
