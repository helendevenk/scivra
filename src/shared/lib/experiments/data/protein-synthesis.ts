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
    ngss: ["HS-LS1-1", "HS-LS3-1"],
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
      id: "speed",
      label: "Animation Speed",
      unit: "×",
      min: 1,
      max: 5,
      default: 3,
      step: 1,
      tier: "free",
    },
    {
      id: "zoom",
      label: "Zoom",
      unit: "",
      min: 5,
      max: 20,
      default: 12,
      step: 1,
      tier: "free",
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
    "Press Play to watch transcription: RNA polymerase moves along the DNA template strand building mRNA. When transcription completes, translation begins automatically — watch tRNA molecules deliver amino acids to the growing chain. Adjust Animation Speed to slow down or speed up the pathway, drag Zoom to move between overview and close study, and tap Start Codon / Stop Codon / Full Synthesis presets to compare key moments in the central dogma workflow.",

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
  htmlControlAliases: {
    speed: "sliderSpeed",
    zoom: "sliderZoom",
  },
  presets: [
    {
      id: "start",
      label: "Start Codon (AUG)",
      description:
        "Focuses attention on initiation, where the ribosome recognizes AUG and begins building the polypeptide with methionine.",
      paramValues: { speed: 2, zoom: 18 },
    },
    {
      id: "stop",
      label: "Stop Codon Demo",
      description:
        "Centers the termination step, showing how a stop codon signals release instead of adding another amino acid.",
      paramValues: { speed: 2, zoom: 16 },
    },
    {
      id: "full",
      label: "Full Synthesis",
      description:
        "Runs the complete central dogma sequence from DNA transcription through mRNA translation into a growing protein.",
      paramValues: { speed: 4, zoom: 10 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Every protein in your body — the hemoglobin carrying oxygen in your red blood cells, the insulin regulating blood sugar, the actin filaments pulling your muscles — was built by the same two-step molecular assembly line. In transcription, RNA polymerase reads the DNA template strand in the 3'→5' direction and writes out a complementary mRNA strand in the 5'→3' direction, substituting uracil (U) wherever thymine (T) would appear in DNA. That mRNA is processed and exported to the cytoplasm, where translation begins at a ribosome: each three-nucleotide codon on the mRNA is matched by a tRNA carrying one specific amino acid, and the ribosome links those amino acids into a growing polypeptide chain until a stop codon halts the process. Use Animation Speed, Zoom, and the presets to connect each visual step to the central dogma.",
    parameterExplanations: {
      speed:
        "Animation Speed changes how quickly the model moves through transcription and translation, from a slower 1× pace to a faster 5× pace. In AP Biology terms, this is not meant to measure a real cellular rate; it is a pacing tool for studying information flow. A slower setting helps students follow RNA polymerase as it produces complementary mRNA, then watch the ribosome read codons in order and recruit matching tRNAs. A faster setting is useful after students understand the steps and want to compare the overall DNA → RNA → protein sequence across presets.",
      zoom:
        "Zoom controls the viewing scale of the synthesis pathway. Higher zoom values are best for close inspection of molecular events: AUG initiation, codon-by-codon reading, tRNA matching, peptide bond formation, and termination at a stop codon. Lower zoom values reveal the larger sequence of events, helping students place transcription and translation into one central dogma model. For AP Biology, this supports the shift from memorizing vocabulary to tracing evidence: DNA nucleotide sequence determines mRNA codons, and mRNA codons determine the amino acid sequence of a polypeptide.",
    },
    misconceptions: [
      {
        wrong:
          "Transcription and translation both happen at the ribosome — the ribosome reads DNA and builds protein in one step.",
        correct:
          "Transcription occurs in the nucleus, where RNA polymerase reads DNA and produces mRNA. Translation occurs in the cytoplasm at ribosomes, which read mRNA — not DNA. The mRNA is an intermediate copy that carries the instructions out of the nucleus. In eukaryotes, these two processes are physically separated by the nuclear envelope. Use the Full Synthesis preset with a lower Animation Speed to separate the two stages visually.",
      },
      {
        wrong:
          "RNA polymerase reads the coding strand of DNA (the one that looks like the mRNA sequence).",
        correct:
          "RNA polymerase reads the template strand, which runs 3'→5'. The resulting mRNA is complementary to the template strand and therefore has the same sequence as the coding strand — with U instead of T. Knowing which strand is the template is critical for working out mRNA sequences from a given DNA sequence. Zoom in during transcription to compare base pairing before translation begins.",
      },
      {
        wrong:
          "Each codon codes for exactly one amino acid and there are 20 codons for 20 amino acids.",
        correct:
          "There are 64 codons (4³) but only 20 amino acids, so most amino acids are encoded by multiple codons — the code is degenerate. Leucine, for example, is encoded by six different codons (UUA, UUG, CUU, CUC, CUA, CUG). Three codons (UAA, UAG, UGA) are stop signals that do not code for any amino acid. Compare the Start Codon and Stop Codon Demo presets to distinguish coding signals from termination signals.",
      },
      {
        wrong:
          "Students often say that mRNA goes directly from the gene to the ribosome without any changes.",
        correct:
          "In eukaryotes, the initial transcript (pre-mRNA) is heavily processed before leaving the nucleus: a 7-methylguanosine cap is added to the 5' end, a poly-A tail is added to the 3' end, and non-coding introns are spliced out. Only the processed mature mRNA is exported to the cytoplasm for translation. Prokaryotes lack a nucleus and can begin translation while transcription is still ongoing. Use Zoom to keep the mRNA pathway visible while discussing those cell-type differences.",
      },
    ],
    teacherUseCases: [
      "Template strand identification drill: give students a double-stranded DNA sequence on paper, ask them to identify the template strand, write the mRNA, and then use the Start Codon (AUG) preset with high Zoom to check where translation begins — supports HS-LS1-1 and the coding vs. template strand distinction.",
      "Central dogma sequencing: run the Full Synthesis preset twice, first at Animation Speed 1× for note-taking and then at 4× or 5× for review. Students narrate DNA → mRNA → protein using evidence from the model, connecting AP Bio 3.A.1 and HS-LS1-1.",
      "Degenerate code exploration: pause during translation, use Zoom to inspect individual mRNA triplets, and have students record codon-to-amino-acid mappings. Ask which amino acids have synonymous codons and why degeneracy can reduce the effect of some mutations.",
      "Misconception probe: before running the simulation, ask students 'where in the cell does translation happen?' — students who answer 'in the nucleus' can compare the transcription portion and the ribosome portion in the Full Synthesis preset.",
      "Inheritance-to-protein CER: use the Stop Codon Demo preset to show that nucleotide sequence can alter protein length or completion, then ask students to explain how DNA sequence differences can influence traits while keeping the focus on HS-LS3-1 evidence.",
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
          "AP Bio 3.A.1 requires students to construct explanations of how the sequence of DNA nucleotides determines the sequence of amino acids in a protein. HS-LS1-1 requires asking questions about the role of DNA replication and protein synthesis in inheritance and trait expression. Running the Full Synthesis preset at a slower Animation Speed while using Zoom to inspect codons provides direct evidence for the codon-to-amino-acid correspondence both standards require.",
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
