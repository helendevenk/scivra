import type { Experiment } from "@/shared/types/experiment";

export const proteinSynthesis3d: Experiment = {
  id: "protein-synthesis-3d",
  slug: "protein-synthesis-3d",
  title: "Protein Synthesis (3D)",
  subtitle: "Transcription and translation from DNA to functional protein",
  description:
    "Follow the central dogma from DNA to protein in 3D. Watch RNA polymerase transcribe mRNA from a DNA template, observe ribosomes translate mRNA codons into amino acids using tRNA, and see the polypeptide chain fold into a functional protein. Introduce mutations to see their effects on the final protein.",
  thumbnail: "/imgs/experiments/protein-synthesis-3d.png",
  standards: { ngss: ["HS-LS1-1"], gcse: [], ap: ["3.A.1", "3.C.1"] },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: ["protein synthesis", "transcription", "translation", "ribosome", "mRNA", "tRNA", "central dogma", "AP Biology"],
  difficulty: "advanced",
  parameters: [
    { id: "sequence", label: "DNA Sequence Length", unit: "codons", min: 3, max: 20, default: 8, step: 1, tier: "free" },
    { id: "mutationType", label: "Mutation (0=none, 1=substitution, 2=insertion, 3=deletion)", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
    { id: "speed", label: "Animation Speed", unit: "x", min: 0.5, max: 3, default: 1, step: 0.5, tier: "free" },
  ],
  formulas: [
    { latex: "\\text{DNA} \\xrightarrow{\\text{transcription}} \\text{mRNA} \\xrightarrow{\\text{translation}} \\text{Protein}", description: "The central dogma of molecular biology" },
  ],
  theory: "Protein synthesis has two stages. Transcription occurs in the nucleus: RNA polymerase reads the DNA template strand 3'→5' and synthesizes mRNA 5'→3', using complementary base pairing (A→U, T→A, G→C, C→G). The mRNA is processed (5' cap, poly-A tail, intron removal) and exported to the cytoplasm. Translation occurs at ribosomes: mRNA codons (3-nucleotide sequences) are read 5'→3'. Each codon is matched by a tRNA anticodon carrying the specified amino acid. Peptide bonds form between adjacent amino acids. Translation starts at AUG (methionine) and ends at a stop codon (UAA, UAG, UGA). Mutations can alter the protein: substitution may change one amino acid (missense) or create a stop (nonsense), while insertion/deletion causes a frameshift affecting all downstream amino acids.",
  instructions: "Watch the 3D animation of transcription and translation. Introduce different mutations to observe their effects on the final protein sequence. Compare normal vs mutant proteins.",
  challenges: [
    { id: "ps-c1", question: "What happens to the protein if the third codon is changed from GGC to GGU?", hint: "Both GGC and GGU code for glycine — this is a silent/synonymous mutation with no effect on the protein", tier: "free" },
    { id: "ps-c2", question: "Why are frameshift mutations usually more harmful than substitutions?", hint: "A frameshift changes every codon downstream of the mutation, altering the entire amino acid sequence from that point on", tier: "pro" },
  ],
  wave: 12, tier: "free", estimatedTime: 30,
  relatedExperiments: ["dna-replication-detail", "cell-structure-3d"],
  htmlPath: "/experiments/ap-biology/protein-synthesis-3d.html",
  seoTitle: "Protein Synthesis 3D Simulation | Scivra AP Biology",
  seoKeywords: ["protein synthesis simulation", "transcription translation 3D", "central dogma interactive", "AP Biology"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Protein Synthesis" },
};
