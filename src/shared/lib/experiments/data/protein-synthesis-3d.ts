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
  contentSections: {
    whatIsIt:
      "This simulation zooms into the molecular machinery of protein synthesis in three dimensions — rotating the ribosome so you can see the A, P, and E sites as physical chambers, watching tRNA molecules dock and release, and tracing the polypeptide chain as it threads out of the exit tunnel. Where the flat protein-synthesis experiment shows the whole gene-to-protein pathway end-to-end, this 3D view focuses on ribosome dynamics and mutation effects. Introduce a substitution, insertion, or deletion into the DNA sequence and compare the final protein to the unmutated version residue by residue. A substitution at one position might silently change nothing, swap one amino acid, or create an early stop codon — outcomes visible in the 3D folded structure. Set mutationType to insertion or deletion and watch the reading frame collapse downstream.",
    parameterExplanations: {
      sequence:
        "The number of codons in the simulated DNA template, from 3 to 20. A longer sequence builds a longer polypeptide, making frameshift effects more dramatic and giving more surface area on the 3D folded protein to observe structural differences between normal and mutant versions. Start at the default 8 codons for a manageable overview.",
      mutationType:
        "Selects the type of mutation introduced into the sequence: 0 = none (wild-type reference), 1 = substitution (one base replaced — may be silent, missense, or nonsense), 2 = insertion (one extra base added, shifting the reading frame), 3 = deletion (one base removed, shifting the reading frame). Compare 1 vs. 2 or 3 to see why frameshifts are typically more damaging than point substitutions.",
      speed:
        "Controls animation playback from 0.5× (slow, to watch each tRNA docking event) to 3× (fast overview). At 0.5× you can pause and inspect which tRNA anticodon is currently in the A site; at 3× you can run through multiple mutation types quickly to compare outcomes side by side.",
    },
    misconceptions: [
      {
        wrong:
          "A substitution mutation always changes the protein — even one base change produces a different amino acid.",
        correct:
          "Because the genetic code is degenerate (64 codons, 20 amino acids), many substitutions are synonymous: GGC and GGU both encode glycine, so a C→U change at that position produces no change in the protein. These are called silent or synonymous mutations. Only when the substitution changes the codon to one encoding a different amino acid (missense) or a stop codon (nonsense) does the protein change.",
      },
      {
        wrong:
          "Insertion and substitution mutations are roughly equally damaging to a protein.",
        correct:
          "A single-nucleotide insertion causes a frameshift — every codon downstream is misread, typically producing a completely non-functional protein of wrong length with a random sequence of amino acids from the mutation site onward. A missense substitution changes at most one amino acid, which may be tolerable depending on where it falls. Frameshifts are almost always more destructive. Set mutationType = 1 then 2 in sequence to compare the 3D structure collapse directly.",
      },
      {
        wrong:
          "Transcription and translation are the same process — the ribosome reads DNA directly and builds the protein.",
        correct:
          "Transcription (in the nucleus) produces mRNA from a DNA template using RNA polymerase. Translation (at the ribosome, in the cytoplasm) reads that mRNA and builds the polypeptide. They are mechanistically distinct, use different machinery, and occur in different cellular locations in eukaryotes. The 3D animation shows the ribosome operating on mRNA, not DNA.",
      },
      {
        wrong:
          "The ribosome is just a passive platform — tRNA does all the work of building the protein.",
        correct:
          "The ribosome is an active catalyst — specifically, the peptidyl transferase activity is performed by the 23S rRNA (in prokaryotes) in the large subunit. The ribosome positions the tRNAs, catalyzes peptide bond formation, and translocates along the mRNA. It is a ribozyme (catalytic RNA), not a passive scaffold. tRNA is essential, but the ribosome does the actual chemical work of bond formation.",
      },
      {
        wrong:
          "A nonsense mutation and a frameshift mutation are the same thing because both stop protein production early.",
        correct:
          "A nonsense mutation is a substitution that converts a sense codon into a stop codon (e.g., CAG → UAG), terminating the polypeptide at that exact position. A frameshift insertion or deletion shifts all downstream codons, which may eventually create a premature stop codon — but through a completely different mechanism. Both can truncate a protein, but the downstream sequence is garbled only in the frameshift case. AP Bio 3.C.1 distinguishes these mutation types explicitly.",
      },
    ],
    teacherUseCases: [
      "Mutation type comparison protocol: run the simulation four times with mutationType set to 0, 1, 2, and 3 in turn (all other settings fixed) and have students record the amino acid sequence each time in a data table — quantifies the difference in damage and directly addresses AP Bio 3.C.1.",
      "Codon table navigation: with mutationType = 1 (substitution), have students predict whether the substitution is silent, missense, or nonsense by consulting their AP codon chart before running the animation — builds the skill of reading the genetic code table under exam conditions.",
      "Frameshift visualization: set sequence = 12 and mutationType = 2 (insertion), then toggle speed from 3× to 0.5× as the mutation passes and count how many codons downstream are altered — makes the cascading effect of a frameshift concrete rather than abstract.",
      "Misconception probe on tRNA vs. ribosome: after students watch a complete translation cycle, ask 'which component is actually forming the peptide bond?' — students who say tRNA are directed back to the 3D ribosome interior to observe the peptidyl transferase center in the large subunit.",
      "3D structure comparison: run wild-type (mutationType = 0) then nonsense at mid-sequence (mutationType = 1 with a mid-chain stop) and ask students to draw or describe what a truncated protein looks like in 3D compared to the full-length version — connects mutation type to structural consequence for AP Bio 3.A.1 and 3.C.1.",
    ],
    faq: [
      {
        question: "What is the difference between a missense, nonsense, and silent mutation?",
        answer:
          "A silent (synonymous) mutation changes a codon to another codon for the same amino acid — no protein change. A missense mutation changes the codon to one encoding a different amino acid — the protein sequence changes at one position. A nonsense mutation changes a sense codon to a stop codon (UAA, UAG, or UGA), terminating translation early and producing a truncated, usually non-functional protein. All three are base substitutions; the outcome depends on which codon is produced.",
      },
      {
        question: "Why are deletions of 3 nucleotides less damaging than deletions of 1 or 2?",
        answer:
          "Deleting exactly 3 nucleotides preserves the reading frame for every codon downstream — no frameshift. If the deletion is codon-aligned, one full codon disappears and the protein is one amino acid shorter but otherwise intact; if the 3-nt span straddles two codons, the two flanking codons fuse into a new codon while everything further downstream stays in frame. Deleting 1 or 2 nucleotides shifts the reading frame and garbles every downstream codon. AP Bio 3.C.1 and HS-LS1-1 both require students to predict the consequences of these insertion-deletion (indel) mutations.",
      },
      {
        question: "How does this simulation address AP Bio 3.A.1 and 3.C.1?",
        answer:
          "AP Bio 3.A.1 requires students to explain how genetic information in DNA is converted into protein through transcription and translation. AP Bio 3.C.1 requires students to explain how mutations can alter protein structure and function. Setting mutationType to each option and observing the 3D protein outcome provides direct visual evidence for both standards; the 3D folded structure makes the structural consequence of each mutation type concrete.",
      },
      {
        question: "What is a tRNA anticodon and how does it match the mRNA codon?",
        answer:
          "A tRNA anticodon is a three-nucleotide sequence on the tRNA molecule that is complementary and antiparallel to the mRNA codon. For the mRNA codon 5'-AUG-3', the matching tRNA anticodon is 3'-UAC-5'. The anticodon end of the tRNA docks in the A site of the ribosome; the opposite end carries the specified amino acid (methionine for AUG). This molecular handshake is what translates the nucleotide language of mRNA into the amino acid language of proteins.",
      },
      {
        question: "Can a single mutation really cause a serious disease?",
        answer:
          "Yes — sickle cell disease results from a single A→T substitution in the sixth codon of the beta-globin gene, changing a glutamic acid (hydrophilic) to valine (hydrophobic). This one missense mutation causes hemoglobin to polymerize under low-oxygen conditions, deforming red blood cells into a sickle shape. Cystic fibrosis is most commonly caused by a 3-nucleotide deletion (deltaF508) that removes phenylalanine 508 from CFTR, misfolding the channel protein.",
      },
    ],
  },
};
