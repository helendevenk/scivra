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
};
