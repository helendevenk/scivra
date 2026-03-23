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

  seoTitle: "Protein Synthesis Transcription & Translation — Interactive 3D | NeonPhysics",
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
};
