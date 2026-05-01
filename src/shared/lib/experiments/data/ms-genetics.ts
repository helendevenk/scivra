import type { Experiment } from "@/shared/types/experiment";

export const msGenetics: Experiment = {
  id: "ms-genetics",
  slug: "ms-genetics",
  title: "Genetics & Heredity",
  subtitle: "DNA, genes, Punnett squares, and trait inheritance",
  description:
    "Build a Punnett square and predict the probability of offspring inheriting traits. See how dominant and recessive alleles combine. Run a simulated cross between two organisms and count phenotype ratios. Explore how mutations in DNA can alter traits.",
  thumbnail: "/imgs/experiments/ms-genetics.png",

  standards: {
    ngss: ["MS-LS3-1", "MS-LS3-2", "HS-LS3-2"],
    gcse: ["B6.1", "B6.2"],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "biology",
  subject: "biology",
  gradeLevel: "6-8",
  tags: ["genetics", "heredity", "Punnett square", "dominant recessive", "alleles", "DNA", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "parent1",
      label: "Parent 1 Genotype (0=AA, 1=Aa, 2=aa)",
      unit: "",
      min: 0,
      max: 2,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "parent2",
      label: "Parent 2 Genotype (0=AA, 1=Aa, 2=aa)",
      unit: "",
      min: 0,
      max: 2,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "traitType",
      label: "Trait Type (0=Autosomal, 1=X-linked)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "offspringCount",
      label: "Simulated Offspring Count",
      unit: "",
      min: 4,
      max: 100,
      default: 20,
      step: 4,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\text{Aa} \\times \\text{Aa} \\to 1\\text{AA}:2\\text{Aa}:1\\text{aa} \\quad (3:1\\text{ phenotype ratio})",
      description: "Monohybrid cross of two heterozygotes yields 3:1 dominant:recessive phenotype ratio",
    },
    {
      latex: "P(\\text{trait}) = \\frac{\\text{favorable outcomes}}{\\text{total outcomes}}",
      description: "Probability of inheriting a specific trait from the Punnett square",
    },
  ],

  theory:
    "Heredity is the passing of traits from parents to offspring through genes. Genes are segments of DNA that code for proteins determining traits. Each organism has two copies of each gene (alleles) — one from each parent. Dominant alleles (uppercase, A) mask recessive alleles (lowercase, a) when both are present. Genotype is the actual gene combination (AA, Aa, aa); phenotype is the visible trait. Punnett squares predict offspring genotype probabilities. An Aa × Aa cross gives 25% AA, 50% Aa, 25% aa — 3:1 ratio showing dominant trait. Some traits are sex-linked (on the X chromosome), giving different patterns in males vs females. Mutations are changes in DNA sequence that can alter traits and are the source of genetic variation for evolution.",

  instructions:
    "Set parent genotypes and build the Punnett square. The 4-box grid shows all possible offspring combinations. Count the proportion of dominant (A_) vs. recessive (aa) phenotypes. Run the simulation with many offspring (Pro) to see how actual ratios approach theoretical predictions. Try X-linked traits to see why color blindness is more common in males.",

  challenges: [
    {
      id: "gen-ms-c1",
      question: "Two brown-eyed parents (both Bb) have children. What fraction will have blue eyes (bb)?",
      hint: "Punnett square: Bb × Bb → BB, Bb, Bb, bb. 1/4 (25%) of offspring are bb (blue eyes). 3/4 have brown eyes (BB or Bb).",
      tier: "free",
    },
    {
      id: "gen-ms-c2",
      question: "A tall plant (TT) is crossed with a short plant (tt). What will ALL offspring look like?",
      hint: "All offspring get one T allele from the tall parent and one t allele from the short parent → all are Tt. Since T is dominant, all offspring are tall. This is called the F1 generation.",
      tier: "free",
    },
    {
      id: "gen-ms-c3",
      question: "Why can two parents who both have normal color vision have a color-blind son?",
      hint: "Color blindness is X-linked recessive. Mother with normal vision can carry the recessive allele (X^B X^b). Father is normal (X^B Y). Sons get their X from mom — X^b Y sons are color blind (50% chance). Daughters can be carriers but rarely show it.",
      tier: "free",
    },
    {
      id: "gen-ms-c4",
      question: "If brown eyes (B) are dominant over blue (b), can two blue-eyed parents have a brown-eyed child?",
      hint: "No. Blue-eyed parents are both bb. They can only pass 'b' alleles to children. All children get bb → blue eyes. In contrast, two brown-eyed parents (each Bb) can have blue-eyed children.",
      tier: "pro",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 14,
  relatedExperiments: ["dna-double-helix", "natural-selection", "meiosis"],

  seoTitle: "Genetics Heredity Middle School | Punnett Square Interactive | Scivra",
  seoKeywords: [
    "genetics middle school simulation",
    "Punnett square interactive 6-8",
    "dominant recessive alleles simulation",
    "heredity interactive middle school",
    "DNA traits simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Genetics and Heredity",
  },
  contentSections: {
    whatIsIt:
      "Why do you look like your parents but not exactly like them? The answer is genetics — the study of how traits are passed from parents to offspring through genes. Genes are specific stretches of DNA that carry instructions for building proteins, which in turn control physical traits like eye color, hair color, or height. Every human cell (except red blood cells) contains two copies of each gene — one inherited from each parent. These alternative versions of a gene are called alleles. When two alleles are the same (AA or aa), the organism is homozygous for that trait. When they differ (Aa), it is heterozygous. Not all alleles have equal influence: a dominant allele (written with a capital letter) masks the effect of a recessive allele (lowercase) when both are present. The Punnett square is a simple grid tool for predicting what combinations of alleles offspring are likely to receive. This simulation lets you select parent genotypes, build the Punnett square, and run a simulated breeding experiment to compare predicted ratios to actual results — including special cases like X-linked traits that behave differently in males and females.",
    parameterExplanations: {
      parent1:
        "Sets the genotype of the first parent: 0 = AA (homozygous dominant), 1 = Aa (heterozygous), 2 = aa (homozygous recessive). A parent with genotype AA can only pass the dominant A allele to offspring. A parent with Aa has a 50% chance of passing either allele. A parent with aa can only pass the recessive a allele. The genotype determines which alleles go into each column of the Punnett square.",
      parent2:
        "Sets the genotype of the second parent using the same scale: 0 = AA, 1 = Aa, 2 = aa. Parent 2 fills the rows of the Punnett square. Combining different values for parent1 and parent2 produces different crosses. The classic middle-school cross is Aa x Aa (both parents set to 1), which yields the well-known 3:1 dominant-to-recessive phenotype ratio.",
      traitType:
        "Selects whether the gene being studied is autosomal or X-linked: 0 = Autosomal (the gene is on a non-sex chromosome, so males and females are affected equally), 1 = X-linked (the gene is on the X chromosome, so males with one copy of the recessive allele show the trait because they have no second X to mask it). Switching to X-linked changes the Punnett square layout to include X and Y chromosomes and helps explain why some traits like color blindness appear more often in males.",
      offspringCount:
        "The number of simulated offspring generated in the virtual breeding experiment, adjustable from 4 to 100 in steps of 4. This is a Pro-tier parameter. Small samples (4 or 8 offspring) often show ratios that differ noticeably from the predicted 3:1 or 1:1 ratios due to chance. Larger samples (80 to 100 offspring) tend to produce observed ratios much closer to the theoretical predictions, demonstrating the law of large numbers in action.",
    },
    misconceptions: [
      {
        wrong: "If a trait is dominant, it will always be more common in the population.",
        correct:
          "Dominant and recessive describe how alleles interact within a single individual, not which is more frequent in a population. A dominant allele can actually be quite rare. For example, a specific form of extra fingers (polydactyly) is caused by a dominant allele, yet it is uncommon. Population frequency depends on many factors including selection pressure, not just dominance.",
      },
      {
        wrong: "Two parents showing a dominant trait cannot have a child with the recessive trait.",
        correct:
          "This is only true if both parents are homozygous dominant (AA). If both parents are heterozygous (Aa), they each show the dominant phenotype but carry a hidden recessive allele. An Aa x Aa cross gives a 25% chance of an aa offspring that shows the recessive trait — the classic 3:1 ratio. Recessive traits can skip generations and reappear when two carriers reproduce.",
      },
      {
        wrong: "X-linked traits are always more severe in females because females have two X chromosomes.",
        correct:
          "Most X-linked traits are actually more common and more likely to be expressed in males. Males have only one X chromosome — if that X carries a recessive allele, there is no second X to mask it, so the trait shows. Females have two X chromosomes: if one carries the recessive allele but the other does not, they are carriers who often show no symptoms. Females typically need two copies of the recessive allele to express an X-linked recessive trait.",
      },
      {
        wrong: "The Punnett square tells you exactly which traits each specific offspring will have.",
        correct:
          "The Punnett square shows probability, not certainty. Each cell represents one equally likely outcome, giving the probability that a randomly selected offspring will have that genotype. Individual offspring are the result of random fertilization events. With only four or eight offspring, observed ratios often diverge from predictions — the offspringCount slider lets you see how larger samples converge toward the theoretical probabilities.",
      },
    ],
    teacherUseCases: [
      "Set both parent1 and parent2 to 1 (Aa x Aa cross) with traitType 0. Before running the simulation, ask students to fill in a Punnett square on paper and predict the phenotype ratio, then compare their prediction to the grid shown.",
      "Set parent1 to 0 (AA) and parent2 to 2 (aa) with traitType 0. Ask students what the Punnett square will look like before they see it, then connect the all-Aa result to the concept of the F1 generation showing only the dominant phenotype.",
      "Switch traitType to 1 (X-linked) with parent1 set to 1 (carrier female) and parent2 set to 0. Have students identify which offspring would show the trait and explain why sons are at higher risk than daughters for X-linked recessive conditions.",
      "Use offspringCount (Pro) to run the simulation at 4 offspring and 100 offspring with the same Aa x Aa cross. Have students record the observed ratio both times and discuss why the small sample is often far from 3:1 while the large sample is close.",
      "Challenge students to set up the cross that produces all dominant-phenotype offspring regardless of offspring count, then explain in writing why that genotype combination guarantees that outcome — connecting the exercise to MS-LS3-1.",
    ],
    faq: [
      {
        question: "What is the difference between genotype and phenotype?",
        answer:
          "Genotype refers to the actual allele combination an organism carries — the genetic instructions written in its DNA, such as Aa or aa. Phenotype refers to the observable trait that results from those instructions — the physical characteristic you can see, like brown eyes or blue eyes. Two organisms can have different genotypes (AA and Aa) but the same phenotype (both show brown eyes if brown is dominant). The genotype is the recipe; the phenotype is the meal.",
      },
      {
        question: "Why do some traits skip generations?",
        answer:
          "Recessive traits can be carried silently by heterozygous individuals (Aa) who show the dominant phenotype. When two carriers reproduce, there is a 25% chance their offspring will be homozygous recessive (aa) and express the recessive trait, even though neither parent showed it. This is why recessive conditions like cystic fibrosis or certain recessive eye colors can appear in a child whose parents both showed the dominant form of the trait.",
      },
      {
        question: "Which NGSS standards does this experiment support?",
        answer:
          "This simulation primarily supports MS-LS3-1 (develop and use a model to describe why structural changes to genes, located on chromosomes, may affect proteins and may result in harmful, beneficial, or neutral effects to the structure and function of an organism) and MS-LS3-2 (develop and use a model to describe why asexual reproduction results in offspring with identical genetic information while sexual reproduction results in offspring with genetic variation). The Punnett square models the probabilistic outcomes of sexual reproduction.",
      },
      {
        question: "What is an X-linked trait, and why does it affect males and females differently?",
        answer:
          "X-linked traits are controlled by genes located on the X chromosome. Females (XX) have two X chromosomes, so a recessive allele on one X is often masked by a dominant allele on the other — these females are carriers. Males (XY) have only one X chromosome: if it carries the recessive allele, there is no second X to provide a dominant version, so the trait is expressed. This explains why color blindness and hemophilia, both X-linked recessive conditions, appear much more often in males than females.",
      },
      {
        question: "If probability says 25% chance of aa, why might none of four offspring be aa?",
        answer:
          "Probability describes what is expected on average over many trials, not what must happen in any small group. Rolling a die four times does not guarantee each number appears exactly once. With only four offspring, it is entirely possible by chance to get zero, one, or even all four showing the recessive phenotype. This is why scientists run large experiments and why the offspringCount slider shows how observed ratios get closer to the 3:1 prediction as sample size grows — a concept called the law of large numbers.",
      },
    ],
  },
};
