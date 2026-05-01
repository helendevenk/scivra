import type { Experiment } from "@/shared/types/experiment";

export const proteinSynthesis: Experiment = {
  id: "protein-synthesis",
  slug: "protein-synthesis",
  title: "Protein Synthesis: Transcription & Translation",
  subtitle: "From DNA code to functional protein",
  description:
    "Watch the central dogma of molecular biology in action: DNA → RNA → Protein. See RNA polymerase transcribe a gene into mRNA, ribosomes translate codons into amino acids, and a polypeptide chain fold into a 3D protein. Control transcription factors and see how gene expression is regulated.",
  thumbnail: "/imgs/experiments/protein-synthesis.png",

  standards: {
    ngss: ["HS-LS1-1", "HS-LS3-2"],
    gcse: ["B13.3", "B13.4"],
    ap: ["3.A.1", "3.B.1"],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: ["protein synthesis", "transcription", "translation", "mRNA", "ribosome", "AP Biology"],
  difficulty: "advanced",

  parameters: [
    {
      id: "transcriptionRate",
      label: "Transcription Rate",
      unit: "nt/s",
      min: 1,
      max: 10,
      default: 3,
      step: 1,
      tier: "free",
    },
    {
      id: "codonHighlight",
      label: "Highlight Codon #",
      unit: "",
      min: 1,
      max: 10,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "translationSpeed",
      label: "Translation Speed",
      unit: "aa/s",
      min: 0.5,
      max: 5,
      default: 1,
      step: 0.5,
      tier: "pro",
    },
    {
      id: "stopCodonPosition",
      label: "Stop Codon Position",
      unit: "codon #",
      min: 5,
      max: 15,
      default: 10,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\text{DNA} \\xrightarrow{\\text{Transcription}} \\text{mRNA} \\xrightarrow{\\text{Translation}} \\text{Protein}",
      description: "The Central Dogma of Molecular Biology",
    },
    {
      latex: "4^3 = 64 \\text{ codons} \\to 20 \\text{ amino acids}",
      description: "64 possible codons encode 20 amino acids (degenerate code)",
    },
    {
      latex: "\\text{Start: AUG (Met)} \\quad \\text{Stop: UAA, UAG, UGA}",
      description: "Universal start and stop codons",
    },
  ],

  theory:
    "The Central Dogma describes the flow of genetic information. During transcription, RNA polymerase reads the template DNA strand (3'→5') and synthesizes a complementary mRNA strand (5'→3'), replacing T with U. The mRNA is then processed (5' cap, poly-A tail, intron splicing) before export from the nucleus. During translation, ribosomes read mRNA codons (3-nucleotide sequences) and tRNA molecules deliver the matching amino acids. The ribosome has three sites: A (aminoacyl), P (peptidyl), and E (exit). The polypeptide chain grows until a stop codon (UAA, UAG, UGA) is encountered, releasing the finished protein.",

  instructions:
    "Press Play to watch transcription: RNA polymerase moves along the DNA template strand building mRNA. When transcription completes, translation begins automatically — watch tRNA molecules deliver amino acids to the growing chain. Click any codon on the mRNA to see which amino acid it encodes. Use the speed controls to slow down and study each step.",

  challenges: [
    {
      id: "ps-c1",
      question: "The DNA template strand reads 3'-TACGGATCC-5'. Write the corresponding mRNA sequence.",
      hint: "mRNA is complementary to the template strand, with U replacing T. Read 5'→3': AUG CCU AGG",
      tier: "free",
    },
    {
      id: "ps-c2",
      question: "How many amino acids are encoded by the mRNA: 5'-AUGGCCUAAUAG-3'?",
      hint: "AUG=start(Met), GCC=Ala, UAA=stop. So only 2 amino acids are incorporated (Met-Ala).",
      tier: "free",
    },
    {
      id: "ps-c3",
      question: "A mutation changes the 4th codon from GGG (Gly) to GGA. Is this a missense, nonsense, or silent mutation?",
      hint: "GGG and GGA both code for Glycine — this is a silent (synonymous) mutation.",
      tier: "free",
    },
    {
      id: "ps-c4",
      question: "A frameshift mutation inserts one nucleotide after position 3 of an mRNA. How many codons downstream are altered?",
      hint: "A frameshift shifts all downstream codons. Every codon from position 2 onwards is misread — all downstream amino acids change.",
      tier: "pro",
    },
  ],

  wave: 3,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["dna-double-helix", "enzyme-kinetics"],

  seoTitle: "Protein Synthesis Transcription & Translation — Interactive 3D | Scivra",
  seoKeywords: [
    "protein synthesis animation",
    "transcription translation interactive",
    "central dogma biology",
    "mRNA codon simulation",
    "AP Biology genetics",
    "ribosome animation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Protein Synthesis: Transcription and Translation",
  },
  contentSections: {
    whatIsIt:
      "Every protein in your body — the hemoglobin carrying oxygen in your red blood cells, the insulin regulating blood sugar, the actin filaments pulling your muscles — was built by the same two-step molecular assembly line. In transcription, RNA polymerase reads the DNA template strand in the 3'→5' direction and writes out a complementary mRNA strand in the 5'→3' direction, substituting uracil (U) wherever thymine (T) would appear in DNA. That mRNA is processed and exported to the cytoplasm, where translation begins at a ribosome: each three-nucleotide codon on the mRNA is matched by a tRNA carrying one specific amino acid, and the ribosome links those amino acids into a growing polypeptide chain until a stop codon halts the process. Adjust the transcriptionRate slider and watch the polymerase slow down to each individual base addition.",
    parameterExplanations: {
      transcriptionRate:
        "The rate at which RNA polymerase synthesizes mRNA, in nucleotides per second (nt/s), from 1 to 10. Real RNA polymerase II in human cells transcribes at roughly 20–80 nt/s; the simulation compresses this to a visible speed. Lower values let you watch each nucleotide added individually; higher values fast-forward to translation.",
      codonHighlight:
        "Selects a specific codon number (1–10) on the mRNA strand to highlight in the animation. The highlighted codon glows while the matched tRNA anticodon and amino acid are displayed in a side panel. Use this to step through the genetic code table codon by codon and confirm which amino acid each triplet encodes.",
      translationSpeed:
        "Controls how fast the ribosome translocates along the mRNA, in amino acids per second (aa/s), from 0.5 to 5. In E. coli ribosomes translate at ~20 aa/s; eukaryotic ribosomes run at ~5 aa/s. Set to 0.5 aa/s to observe A-site binding, peptide-bond formation, and E-site ejection at each step.",
      stopCodonPosition:
        "Sets which codon position (5–15) contains the stop codon (UAA, UAG, or UGA). Changing this effectively shortens or lengthens the simulated protein, demonstrating how stop codon placement determines polypeptide length. A stop at position 5 produces a short 4-amino-acid peptide; position 15 yields a 14-residue chain.",
    },
    misconceptions: [
      {
        wrong:
          "Transcription and translation both happen at the ribosome — the ribosome reads DNA and builds protein in one step.",
        correct:
          "Transcription occurs in the nucleus, where RNA polymerase reads DNA and produces mRNA. Translation occurs in the cytoplasm at ribosomes, which read mRNA — not DNA. The mRNA is an intermediate copy that carries the instructions out of the nucleus. In eukaryotes, these two processes are physically separated by the nuclear envelope.",
      },
      {
        wrong:
          "RNA polymerase reads the coding strand of DNA (the one that looks like the mRNA sequence).",
        correct:
          "RNA polymerase reads the template strand, which runs 3'→5'. The resulting mRNA is complementary to the template strand and therefore has the same sequence as the coding strand — with U instead of T. Knowing which strand is the template is critical for working out mRNA sequences from a given DNA sequence.",
      },
      {
        wrong:
          "Each codon codes for exactly one amino acid and there are 20 codons for 20 amino acids.",
        correct:
          "There are 64 codons (4³) but only 20 amino acids, so most amino acids are encoded by multiple codons — the code is degenerate. Leucine, for example, is encoded by six different codons (UUA, UUG, CUU, CUC, CUA, CUG). Three codons (UAA, UAG, UGA) are stop signals that do not code for any amino acid.",
      },
      {
        wrong:
          "Students often say that mRNA goes directly from the gene to the ribosome without any changes.",
        correct:
          "In eukaryotes, the initial transcript (pre-mRNA) is heavily processed before leaving the nucleus: a 7-methylguanosine cap is added to the 5' end, a poly-A tail is added to the 3' end, and non-coding introns are spliced out. Only the processed mature mRNA is exported to the cytoplasm for translation. Prokaryotes lack a nucleus and can begin translation while transcription is still ongoing.",
      },
    ],
    teacherUseCases: [
      "Template strand identification drill: give students a double-stranded DNA sequence on paper, ask them to identify the template strand, write the mRNA, and then use codonHighlight to check their predicted amino acid sequence against the simulation — addresses the coding vs. template strand confusion.",
      "Transcription rate data collection: record the time to produce a 10-codon mRNA at transcriptionRate = 1, 5, and 10 nt/s; plot rate vs. time; discuss how cells regulate gene expression by modulating polymerase processivity, connecting AP Bio 3.B.1.",
      "Degenerate code exploration: set codonHighlight to each position in turn and record codon-to-amino-acid mappings; ask students to identify which amino acids have the most synonymous codons and hypothesize why degeneracy is adaptive (wobble hypothesis, reduced mutation impact).",
      "Misconception probe: before running the simulation, ask students 'where in the cell does translation happen?' — students who answer 'in the nucleus' can be directed to toggle between the nucleus view (transcription) and cytoplasm view (translation) in the simulation.",
      "Stop codon positioning: move stopCodonPosition from 5 to 15 and compare the protein products; connect to real-world nonsense mutations and genetic diseases (e.g., early stop codons in CFTR causing cystic fibrosis) to ground AP Bio 3.A.1 in clinical context.",
    ],
    faq: [
      {
        question: "What is the difference between the template strand and the coding strand?",
        answer:
          "The template strand is the strand RNA polymerase reads (3'→5'); the coding strand (also called the sense strand or non-template strand) has the same sequence as the mRNA, with T in place of U. Textbooks sometimes confusingly show the coding strand because it reads like the mRNA. For exam questions, always identify the template strand as the one running 3'→5' in the direction of transcription.",
      },
      {
        question: "Why does RNA polymerase need no primer, while DNA polymerase does?",
        answer:
          "RNA polymerase can initiate a new chain from scratch by forming the first phosphodiester bond between two ribonucleotides — no existing strand is needed. DNA polymerase III lacks this ability and requires a free 3'-OH on a pre-existing strand (the RNA primer) to begin extension. This is why primase must act first during DNA replication.",
      },
      {
        question: "How does this simulation cover AP Bio 3.A.1 and HS-LS1-1?",
        answer:
          "AP Bio 3.A.1 requires students to construct explanations of how the sequence of DNA nucleotides determines the sequence of amino acids in a protein. HS-LS1-1 requires asking questions about the role of DNA replication and protein synthesis in inheritance and trait expression. Running the simulation at translationSpeed = 0.5 aa/s while tracking codonHighlight provides direct evidence for the codon-to-amino-acid correspondence both standards require.",
      },
      {
        question: "What are the three ribosome sites and what happens at each one?",
        answer:
          "The A site (aminoacyl site) accepts the incoming tRNA carrying its amino acid. The P site (peptidyl site) holds the tRNA attached to the growing polypeptide chain. The E site (exit site) holds a spent tRNA before it is released. The ribosome translocates one codon in the 5'→3' direction with each peptide bond formed, cycling each tRNA through A → P → E.",
      },
      {
        question: "Why does a single nucleotide insertion cause such widespread damage to a protein?",
        answer:
          "The genetic code is read in non-overlapping triplets starting from the AUG start codon. Inserting one nucleotide shifts the reading frame for every codon downstream — each triplet now contains two nucleotides from the original sequence and one from the next, producing an entirely different and usually non-functional amino acid sequence. This is a frameshift mutation; AP Bio 3.A.1 requires students to predict the downstream effects of such insertions and deletions.",
      },
    ],
  },
};
