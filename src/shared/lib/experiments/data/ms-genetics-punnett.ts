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
    { id: "parent1", label: "Parent 1 Genotype (0=AA, 1=Aa, 2=aa)", unit: "", min: 0, max: 2, default: 1, step: 1, tier: "free" },
    { id: "parent2", label: "Parent 2 Genotype (0=AA, 1=Aa, 2=aa)", unit: "", min: 0, max: 2, default: 1, step: 1, tier: "free" },
    { id: "trialCount", label: "Number of Offspring", unit: "", min: 4, max: 1000, default: 100, step: 4, tier: "free" },
    { id: "dominanceType", label: "Dominance (0=complete, 1=incomplete, 2=codominant)", unit: "", min: 0, max: 2, default: 0, step: 1, tier: "free" },
  ],
  formulas: [
    { latex: "P(\\text{genotype}) = \\frac{\\text{favorable outcomes}}{4}", description: "Probability of each genotype from a monohybrid cross" },
  ],
  theory: "A Punnett square is a grid used to predict the genotypes of offspring from a genetic cross. Each parent contributes one allele. For a monohybrid cross (Aa × Aa), the predicted genotype ratio is 1 AA : 2 Aa : 1 aa. With complete dominance, the phenotype ratio is 3 dominant : 1 recessive. With incomplete dominance, heterozygotes show a blended phenotype (1:2:1 phenotype ratio). With codominance, both alleles are expressed equally.",
  instructions: "Select genotypes for both parents and choose a dominance pattern. The Punnett square fills automatically. Click 'Breed' to generate offspring and compare observed ratios to predicted ratios. Increase the offspring count to see the law of large numbers in action.",
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
  contentSections: {
    whatIsIt:
      "The Punnett square is a four-box grid invented to predict the likely genotypes of offspring from a genetic cross. Each parent contributes one allele of a gene, and the grid maps all possible combinations. Named after geneticist Reginald Crundall Punnett, this tool is the foundation of Mendelian genetics — the rules of inheritance first described by Gregor Mendel through pea plant experiments in the 1860s. Mendel discovered that traits are inherited in predictable ratios, and the Punnett square is the visual tool that makes those ratios easy to see and calculate. Complete dominance is the most familiar pattern: the dominant allele fully masks the recessive one whenever they appear together (Aa looks the same as AA). But not all traits follow this pattern. Incomplete dominance produces a blended intermediate phenotype in heterozygotes — like red and white flowers producing pink offspring. Codominance is different again: both alleles are fully expressed simultaneously, as in certain blood type combinations. This simulation lets you build Punnett squares for all three dominance patterns and run virtual breeding experiments to see how well observed offspring ratios match mathematical predictions.",
    parameterExplanations: {
      parent1:
        "Sets the genotype of the first parent: 0 = AA (homozygous dominant — carries two copies of the dominant allele), 1 = Aa (heterozygous — carries one of each), 2 = aa (homozygous recessive — carries two copies of the recessive allele). Parent 1 alleles fill the top row of the Punnett square. An AA parent can only pass the A allele; an Aa parent passes either A or a with equal probability.",
      parent2:
        "Sets the genotype of the second parent using the same scale: 0 = AA, 1 = Aa, 2 = aa. Parent 2 alleles fill the left column of the Punnett square. Together parent1 and parent2 determine all four possible offspring combinations in the grid. The most commonly studied cross in middle school is Aa x Aa (both set to 1), which produces the 1:2:1 genotype ratio and the 3:1 phenotype ratio with complete dominance.",
      trialCount:
        "The number of offspring to simulate in the virtual breeding experiment, adjustable from 4 to 1000 in steps of 4. Small trial counts (4 to 20) often produce ratios that differ from the Punnett square prediction because random variation matters more in small samples. Large counts (hundreds to 1000) produce observed ratios that closely match the predicted ratios, illustrating why scientists use large sample sizes. Watching the ratio converge as you increase trialCount demonstrates the law of large numbers.",
      dominanceType:
        "Controls the dominance pattern used to interpret heterozygous genotypes: 0 = Complete dominance (Aa shows the same phenotype as AA — the dominant allele fully masks the recessive), 1 = Incomplete dominance (Aa shows a blended intermediate phenotype, giving a 1:2:1 phenotype ratio instead of 3:1), 2 = Codominance (Aa shows both phenotypes simultaneously — neither allele masks the other, also giving a 1:2:1 phenotype ratio but with a distinct blended appearance versus two separate traits expressed together).",
    },
    misconceptions: [
      {
        wrong: "Incomplete dominance and codominance are the same thing because both give a 1:2:1 ratio.",
        correct:
          "Both incomplete dominance and codominance produce a 1:2:1 phenotype ratio in heterozygotes, but the mechanism is different. In incomplete dominance, neither allele is fully expressed and the heterozygote shows a truly blended intermediate trait — like pink flowers from red and white parents. In codominance, both alleles are fully and separately expressed at the same time — like roan cattle that show both red and white hairs, not pink. The ratio looks the same mathematically, but the biological result is different.",
      },
      {
        wrong: "The Punnett square predicts which specific offspring will inherit which allele.",
        correct:
          "The Punnett square predicts probability, not outcome. Each box represents one equally likely possibility — it does not tell you which specific offspring will have which genotype. Random fertilization means any one offspring could fall in any box. This is why trialCount matters: large samples reveal the underlying probability pattern that small samples often obscure.",
      },
      {
        wrong: "If one parent has the dominant phenotype, all offspring will also show the dominant phenotype.",
        correct:
          "This is only guaranteed if the dominant parent is homozygous (AA). If the dominant parent is heterozygous (Aa) and the other parent is recessive (aa), exactly half the offspring are expected to show the recessive phenotype (the Aa x aa cross gives 50% Aa and 50% aa). Setting parent1 to 1 and parent2 to 2 with complete dominance clearly shows this 1:1 phenotype ratio.",
      },
      {
        wrong: "Dominant traits are always better or more evolved than recessive traits.",
        correct:
          "Dominance and recessiveness describe only how alleles interact inside a single organism — they say nothing about which version is healthier or more advantageous. Many recessive alleles are perfectly neutral or even beneficial in certain environments. Sickle cell trait is a famous example: the recessive allele causes problems in homozygotes but provides malaria resistance in heterozygotes, making it advantageous in malaria-prone regions.",
      },
    ],
    teacherUseCases: [
      "Set parent1 to 1, parent2 to 1, dominanceType to 0, and trialCount to 100. Ask students to write down the expected 3:1 ratio before pressing Breed, then compare prediction to the simulation result and discuss why the numbers may not be exactly 75 and 25.",
      "Change dominanceType from 0 to 1 (incomplete dominance) while keeping the Aa x Aa cross. Ask students to predict how the phenotype ratio changes before they see the result, then connect the 1:2:1 outcome to real-world examples like snapdragon flower color.",
      "Set parent1 to 1 and parent2 to 2 (Aa x aa cross) with complete dominance and trialCount to 20. Run it five times and have students record observed ratios each time. Compile class data to show that the average across many runs approaches 1:1.",
      "Use the trialCount slider as a standalone demonstration: keep all other values constant and sweep from 4 to 1000, pausing to record the phenotype ratio at 4, 20, 100, and 1000. Graph the results to visualize how sample size affects agreement with the Punnett square prediction.",
      "Compare codominance (dominanceType 2) to complete dominance (dominanceType 0) for the Aa x Aa cross. Ask students how they would distinguish between the two patterns if they were observing actual offspring — what observation would tell them which type of dominance is operating?",
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
          "This simulation directly supports MS-LS3-2 (develop and use a model to describe why asexual reproduction results in offspring with identical genetic information while sexual reproduction results in offspring with genetic variation). The Punnett square is itself a model of how genetic variation arises through the random combination of alleles during sexual reproduction. The trialCount feature also illustrates the probabilistic nature of inheritance described in this standard.",
      },
      {
        question: "Why does increasing the number of offspring make the ratio more accurate?",
        answer:
          "Each individual offspring is the result of a random fertilization event — like a coin flip. Flipping a coin four times might give you four heads even though the probability is 50-50. Flip it 1000 times and you will be very close to 500 heads and 500 tails. The same logic applies to genetics: with only four offspring, chance variation dominates; with hundreds of offspring, the random variation averages out and the observed ratio approaches the theoretical prediction. This is the law of large numbers in action.",
      },
      {
        question: "Are there traits controlled by more than one gene?",
        answer:
          "Yes, and most complex traits in real organisms are polygenic — controlled by multiple genes working together. Height, skin color, and intelligence are all polygenic traits that do not follow simple 3:1 or 1:1 Mendelian ratios. This simulation models single-gene (monogenic) traits to build the foundational concepts. Once you understand how one gene with two alleles behaves, you can begin to reason about what happens when multiple genes interact — which produces the continuous variation (like a range of heights) observed in real populations.",
      },
    ],
  },
};
