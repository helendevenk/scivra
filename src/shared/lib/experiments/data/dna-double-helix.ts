import type { Experiment } from "@/shared/types/experiment";

export const dnaDoubleHelix: Experiment = {
  id: "dna-double-helix",
  slug: "dna-double-helix",
  title: "DNA Double Helix & Base Pairing",
  subtitle: "The molecule that carries life's blueprint",
  description:
    "Explore the 3D structure of DNA — the double helix discovered by Watson and Crick. Rotate the molecule, zoom into individual base pairs, and watch how complementary bases (A-T, G-C) pair via hydrogen bonds. Understand how the helix unzips during replication and why mutations occur.",
  thumbnail: "/imgs/experiments/dna-double-helix.png",

  standards: {
    ngss: ["HS-LS1-1", "HS-LS3-1"],
    gcse: ["B13.1", "B13.2"],
    ap: ["3.A.1", "3.A.2"],
  },
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: ["DNA", "double helix", "base pairing", "Watson Crick", "genetics", "AP Biology"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "rotationSpeed",
      label: "Helix Rotation Speed",
      unit: "rpm",
      min: 0,
      max: 10,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "basePairs",
      label: "Number of Base Pairs",
      unit: "",
      min: 5,
      max: 20,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "unzipSpeed",
      label: "Replication Fork Speed",
      unit: "bp/s",
      min: 0.5,
      max: 5,
      default: 1,
      step: 0.5,
      tier: "pro",
    },
    {
      id: "mutationRate",
      label: "Mutation Probability",
      unit: "%",
      min: 0,
      max: 20,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\text{A} \\equiv \\text{T} \\quad (2 \\text{ H-bonds})",
      description: "Adenine pairs with Thymine via 2 hydrogen bonds",
    },
    {
      latex: "\\text{G} \\equiv \\text{C} \\quad (3 \\text{ H-bonds})",
      description: "Guanine pairs with Cytosine via 3 hydrogen bonds",
    },
    {
      latex: "5' \\to 3' \\text{ (leading)} \\parallel 3' \\to 5' \\text{ (lagging)}",
      description: "Antiparallel strands; replication is semi-conservative",
    },
  ],

  theory:
    "DNA (deoxyribonucleic acid) is a double-stranded helix where two polynucleotide chains coil around each other. Each strand is a polymer of nucleotides, each containing a deoxyribose sugar, a phosphate group, and one of four nitrogenous bases: Adenine (A), Thymine (T), Guanine (G), or Cytosine (C). The strands are antiparallel and held together by hydrogen bonds between complementary bases (A-T, G-C). The genetic code is read as triplets (codons) along one strand. During replication, helicase unzips the helix and DNA polymerase synthesizes new complementary strands — producing two identical daughter molecules (semi-conservative replication).",

  instructions:
    "Use the rotation slider to spin the helix and observe its 3D structure. Click any base pair to highlight and identify the complementary bases. Toggle 'Replication Mode' to watch the fork unzip and new strands synthesize. In Pro mode, enable mutations to see how single-nucleotide polymorphisms (SNPs) change the sequence.",

  challenges: [
    {
      id: "dna-c1",
      question: "A DNA strand reads 5'-AATGCCTA-3'. Write the complementary strand in the 3' to 5' direction.",
      hint: "A pairs with T, G pairs with C. The complementary strand is antiparallel.",
      tier: "free",
    },
    {
      id: "dna-c2",
      question: "If a DNA molecule contains 30% Adenine, what percentage is Cytosine?",
      hint: "A=T so T=30%. A+T+G+C=100%. Therefore G+C=40%, and G=C so C=20%.",
      tier: "free",
    },
    {
      id: "dna-c3",
      question: "After 3 rounds of semi-conservative replication from 1 original molecule, how many of the 8 resulting molecules contain original DNA?",
      hint: "Semi-conservative: each daughter has one original strand. After 3 rounds: 8 total, 2 contain original strands.",
      tier: "free",
    },
    {
      id: "dna-c4",
      question: "A G→A mutation at position 6 of a coding strand changes a codon. If the original codon was GGG (Pro), what is the new codon and amino acid? (Codon table: GAG = Glu)",
      hint: "Change the G at position 6. Original codon GGG → new codon depends on which G in the triplet changes. If it's the first G of GGG: AGG = Arg.",
      tier: "pro",
    },
  ],

  wave: 3,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["protein-synthesis", "natural-selection"],

  seoTitle: "DNA Double Helix & Base Pairing — 3D Interactive | NeonPhysics AP Biology",
  seoKeywords: [
    "DNA double helix simulation",
    "base pairing interactive",
    "Watson Crick model",
    "DNA replication 3D",
    "AP Biology genetics",
    "complementary bases",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "DNA Structure and Base Pairing",
  },
};
