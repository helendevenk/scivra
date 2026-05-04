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
      id: "rotSpeed",
      label: "Rotation Speed",
      unit: "×",
      min: 0,
      max: 3,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "helixStretch",
      label: "Helix Stretch",
      unit: "×",
      min: 0.5,
      max: 2.5,
      default: 1,
      step: 0.05,
      tier: "free",
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
    "Use the Rotation Speed slider to control how quickly the helix turns, and use the Helix Stretch slider to compress or elongate the base-pair spacing. Click any base pair to highlight complementary bases and hydrogen-bond counts. Try the B-DNA (Standard), Unwound by Helicase, and Transition to A-form presets to compare canonical structure, strand-opening stress, and alternate helix geometry.",

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
  htmlControlAliases: { rotSpeed: "sl-rotspeed", helixStretch: "sl-stretch" },
  presets: [
    {
      id: "bdna",
      label: "B-DNA (Standard)",
      description:
        "Shows the familiar B-DNA geometry used in most textbook diagrams, with moderate rotation and normal base-pair spacing. Use it as the reference case before changing sliders.",
      paramValues: { rotSpeed: 1, helixStretch: 1 },
    },
    {
      id: "unwound",
      label: "Unwound by Helicase",
      description:
        "Stretches the helix and speeds rotation to suggest the mechanical stress of strand separation near a replication fork. It is a visual comparison mode, not a full enzyme simulation.",
      paramValues: { rotSpeed: 3, helixStretch: 2 },
    },
    {
      id: "aform",
      label: "Transition to A-form",
      description:
        "Compresses the displayed helix and slows rotation to contrast B-DNA with an alternate DNA-like conformation. Compare it with B-DNA to discuss how environmental conditions can shift nucleic-acid geometry.",
      paramValues: { rotSpeed: 0.5, helixStretch: 0.75 },
    },
  ],

  contentSections: {
    whatIsIt:
      "DNA is the molecule that carries the genetic instructions for every living thing. Its shape — the famous double helix proposed by Watson, Crick, and Franklin in 1953 — is two strands of nucleotides twisted around each other like a spiral ladder. The 'rungs' are pairs of nitrogenous bases held together by hydrogen bonds, with adenine always pairing with thymine (A-T, two H bonds) and guanine always with cytosine (G-C, three H bonds). The pairing rule is what lets DNA copy itself: each strand is a perfect template for a new partner. Rotate the helix, zoom into a base pair, and unzip the strands to see replication as the cell sees it.",
    parameterExplanations: {
      rotSpeed:
        "Rotation Speed controls how quickly the 3D helix turns around its central axis. Set it near 0 when students need to count base pairs, inspect the sugar-phosphate backbones, or click a specific A-T or G-C pair without visual distraction. Increase it toward 3× when the goal is to perceive the molecule as a continuous spiral rather than a flat ladder. This slider changes the viewing motion, not a biological replication rate, so it is best used as an observation tool alongside the B-DNA and A-form presets.",
      helixStretch:
        "Helix Stretch changes the vertical spacing between adjacent base pairs in the model. At 1×, the structure represents the standard B-DNA teaching view, where roughly ten base pairs make one full turn. Lower values compress the displayed helix, making the turns look tighter and helping students compare alternate geometry in the A-form preset. Higher values elongate the molecule, which makes the Unwound by Helicase preset feel mechanically stressed and easier to discuss as strand-opening pressure. Keep Rotation Speed constant while changing only Helix Stretch to isolate shape from motion.",
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
          "Most mutations are silent, occur in non-coding regions, or have effects that depend on cellular context and environment. A few are harmful, a few can be beneficial, and many are neutral. This simulation focuses on DNA structure and pairing, so use separate sequence examples when discussing how point mutations, insertions, or deletions change proteins.",
      },
    ],
    teacherUseCases: [
      "Pre-lab: have students sketch DNA from memory, then open the B-DNA (Standard) preset and use low Rotation Speed to compare their drawings with the antiparallel double-helix model.",
      "Base-pair evidence drill: students click several rungs, record A-T versus G-C pairs, and explain why the displayed hydrogen-bond counts support complementary pairing rules.",
      "Geometry comparison: keep Rotation Speed fixed and move only Helix Stretch, then have students describe which observations changed and which core pairing rules stayed constant.",
      "Preset station rotation: assign teams B-DNA (Standard), Unwound by Helicase, or Transition to A-form and ask each group to cite slider values and visible structure as evidence.",
      "AP Biology discussion: connect the B-DNA reference view to HS-LS1-1 and HS-LS3-1 by asking how structure supports replication and information storage without turning the visual into a full replication simulation.",
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
        question: "Why does the B-DNA preset show about 10 base pairs per turn?",
        answer:
          "B-form DNA has geometry where each base pair rises about 0.34 nm and rotates about 36° around the helix axis, so a full 360° turn covers roughly 10 base pairs and about 3.4 nm. Other nucleic-acid conformations can differ, which is why the A-form preset is useful for comparison. Treat 10 base pairs per turn as the standard B-DNA reference, not a rule for every possible helix state.",
      },
      {
        question: "How does this connect to AP Biology?",
        answer:
          "AP Bio expects students to know the structure of DNA, complementary base pairing rules, and how the structure enables replication. Use Rotation Speed, Helix Stretch, and the three presets to connect visible structure with Big Idea 3: information storage and transmission. The model supports learning objectives 3.A.1 and 3.A.2 as a structural reference, while detailed enzyme steps should be taught with a separate replication activity.",
      },
      {
        question: "Why does G-C pair via three hydrogen bonds while A-T uses two?",
        answer:
          "Guanine and cytosine each have three sites positioned to donate or accept H bonds; adenine and thymine only line up two. That's why DNA regions rich in G-C are more thermally stable than A-T-rich regions — useful when designing PCR primers or analyzing melting temperature.",
      },
    ],
  },
};
