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
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "9-12",
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

  seoTitle: "DNA Double Helix & Base Pairing — 3D Interactive | Scivra AP Biology",
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

  contentSections: {
    whatIsIt:
      "DNA is the molecule that carries the genetic instructions for every living thing. Its shape — the famous double helix proposed by Watson, Crick, and Franklin in 1953 — is two strands of nucleotides twisted around each other like a spiral ladder. The 'rungs' are pairs of nitrogenous bases held together by hydrogen bonds, with adenine always pairing with thymine (A-T, two H bonds) and guanine always with cytosine (G-C, three H bonds). The pairing rule is what lets DNA copy itself: each strand is a perfect template for a new partner. Rotate the helix, zoom into a base pair, and unzip the strands to see replication as the cell sees it.",
    parameterExplanations: {
      rotationSpeed:
        "How fast the helix spins. Slow it down to count the 10 base pairs per full turn (one of the structural facts you should know cold for AP Bio).",
      basePairs:
        "How many rungs the helix shows. More base pairs let you see longer stretches of code. Real human chromosomes are millions of base pairs long; this lab shows a teaching slice.",
      unzipSpeed:
        "Controls the rate at which the two strands separate. Replication, transcription, and PCR all start with this unzipping — slow it down to see hydrogen bonds breaking one base pair at a time.",
      mutationRate:
        "Crank this up to introduce occasional pairing errors. Lets you observe substitutions (A swapped for G), the kind of point mutation natural selection then has to work with.",
    },
    misconceptions: [
      {
        wrong:
          "DNA is two single strands held together like a twisted ladder of equal halves.",
        correct:
          "The two strands are antiparallel — one runs 5' to 3' upward while the other runs 5' to 3' downward. They're complementary, not identical, so the sequence on each strand is different. Polymerases care about this direction.",
      },
      {
        wrong:
          "Adenine pairs with thymine and guanine pairs with cytosine because they're the same shape.",
        correct:
          "They pair because of geometry plus hydrogen bonding. A-T forms 2 H bonds, G-C forms 3 H bonds. The pairing rules come from which atoms can donate or accept H bonds, not from matching shapes.",
      },
      {
        wrong:
          "The double helix unzips by breaking the covalent bonds between bases.",
        correct:
          "Replication breaks the much weaker hydrogen bonds between paired bases, not the covalent backbone. The phosphate backbone stays intact during replication; helicase pulls the two strands apart.",
      },
      {
        wrong:
          "All DNA mutations are bad and lead to disease.",
        correct:
          "Most mutations are silent (no effect on the protein) or in non-coding regions. A few are harmful, but a few are also beneficial — that's the raw material natural selection acts on. Use the mutationRate slider to see how rare any single mutation is.",
      },
    ],
    teacherUseCases: [
      "Pre-lab: have students draw what they think DNA looks like, then compare to the rotating helix. Catch the antiparallel direction misconception early.",
      "Base pairing rules drill: hide one strand and have students fill in the complement (A↔T, G↔C). Reveal the strand and check.",
      "Replication walkthrough: pause partway through unzipping and ask students which enzymes would be working at that exact moment (helicase, primase, polymerase, ligase).",
      "Mutation discussion: turn the mutation rate up briefly and ask which mutations would be silent vs. missense. Connect to AP Bio Big Idea 3.",
      "Compare to RNA: after running the lab, ask students how the structure would change if it were RNA (single-stranded, U replaces T, ribose).",
    ],
    faq: [
      {
        question: "Why is DNA shaped like a double helix?",
        answer:
          "The helical shape lets DNA pack a lot of genetic code into a small space (about 2 meters of DNA per cell, coiled into a 6-micrometer nucleus) while keeping the bases on the inside protected from the cellular environment. The hydrogen bonds between paired bases stabilize the structure and let it unzip cleanly when needed.",
      },
      {
        question: "What does it mean that the strands are antiparallel?",
        answer:
          "Each DNA strand has direction — a 5' end and a 3' end. In the double helix, one strand runs 5' to 3' top-to-bottom while the other runs 3' to 5' top-to-bottom. DNA polymerase only adds new bases to the 3' end, which is why one strand replicates continuously (leading) and the other in fragments (lagging).",
      },
      {
        question: "Why are there always 10 base pairs per turn?",
        answer:
          "It's set by the geometry of the deoxyribose-phosphate backbone and the angles at which the bases stack. Each base pair rises about 0.34 nm and rotates 36° around the helix axis, so a full 360° turn covers 10 base pairs and ~3.4 nm. This is the B-form DNA you'll see on AP exam diagrams.",
      },
      {
        question: "How does this connect to AP Biology?",
        answer:
          "AP Bio expects students to know the structure of DNA, complementary base pairing rules, and how the structure enables replication. This lab covers Big Idea 3 (Information storage and transmission) and supports learning objectives 3.A.1 (DNA is the heritable material) and 3.A.2 (DNA is replicated semiconservatively).",
      },
      {
        question: "Why does G-C pair via three hydrogen bonds while A-T uses two?",
        answer:
          "Guanine and cytosine each have three sites positioned to donate or accept H bonds; adenine and thymine only line up two. That's why DNA regions rich in G-C are more thermally stable than A-T-rich regions — useful when designing PCR primers or analyzing melting temperature.",
      },
    ],
  },
};
