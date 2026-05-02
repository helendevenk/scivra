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
    { id: "zoomLevel", label: "Camera Zoom", unit: "", min: 6, max: 30, default: 15, step: 1, tier: "free" },
    { id: "showCodons", label: "Show Codon Labels", unit: "", min: 0, max: 1, default: 1, step: 1, tier: "free" },
  ],
  formulas: [
    { latex: "\\text{DNA} \\xrightarrow{\\text{transcription}} \\text{mRNA} \\xrightarrow{\\text{translation}} \\text{Protein}", description: "The central dogma of molecular biology" },
  ],
  theory: "Protein synthesis has two stages. Transcription occurs in the nucleus: RNA polymerase reads the DNA template strand 3'→5' and synthesizes mRNA 5'→3', using complementary base pairing (A→U, T→A, G→C, C→G). The mRNA is processed (5' cap, poly-A tail, intron removal) and exported to the cytoplasm. Translation occurs at ribosomes: mRNA codons (3-nucleotide sequences) are read 5'→3'. Each codon is matched by a tRNA anticodon carrying the specified amino acid. Peptide bonds form between adjacent amino acids. Translation starts at AUG (methionine) and ends at a stop codon (UAA, UAG, UGA). Mutations can alter the protein: substitution may change one amino acid (missense) or create a stop (nonsense), while insertion/deletion causes a frameshift affecting all downstream amino acids.",
  instructions: "Use Camera Zoom to move between a full pathway overview and a close molecular view, and use Show Codon Labels to reveal or hide codon text on the displayed mRNA strand. Try the Transcription Step, Translation Step, and Full Pathway presets to compare DNA to mRNA, mRNA to polypeptide, and the complete central dogma workflow.",
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
  htmlControlAliases: { zoomLevel: "zoom-slider", showCodons: "codon-toggle" },
  presets: [
    { id: "transcription", label: "Transcription Step", description: "Focus on DNA → mRNA in nucleus." },
    { id: "translation", label: "Translation Step", description: "Focus on ribosome reading mRNA → polypeptide chain." },
    { id: "full", label: "Full Pathway (Both Steps)", description: "Complete DNA → mRNA → protein workflow end to end." },
  ],
  contentSections: {
    whatIsIt:
      "This simulation zooms into the molecular machinery of protein synthesis in three dimensions — rotating the ribosome so you can see the A, P, and E sites as physical chambers, watching tRNA molecules dock and release, and tracing the polypeptide chain as it threads out of the exit tunnel. Where the flat protein-synthesis experiment shows the whole gene-to-protein pathway end-to-end, this 3D view focuses on ribosome dynamics and the spatial relationships between transcription and translation. Use the Transcription Step preset to follow RNA polymerase reading the DNA template inside the nucleus, then switch to Translation Step to follow the ribosome reading mRNA codon by codon and adding amino acids to a growing polypeptide. The Full Pathway preset stitches both stages together so students can see how information moves from DNA to mRNA to protein in continuous 3D space.",
    parameterExplanations: {
      zoomLevel:
        "Camera Zoom changes the scale at which students inspect gene expression. At lower zoom values, the scene reads as a pathway model: DNA, mRNA, ribosome, tRNA, and polypeptide can be interpreted as connected parts of the central dogma. At higher zoom values, the same process becomes a molecular mechanism, letting students focus on where mRNA is read and where amino acids are added to the growing chain. For AP Biology, use zoom deliberately: begin wide to establish information flow from DNA to RNA to protein, then zoom closer to connect structure to function in transcription and translation.",
      showCodons:
        "Show Codon Labels controls whether the mRNA strand displays its triplet code directly. With labels on, students can track how the ribosome reads mRNA in codons and how each three-base unit corresponds to an amino acid decision during translation. With labels off, the model emphasizes spatial process: mRNA movement, ribosome position, tRNA delivery, and polypeptide growth. In an AP Biology lesson, switching between the two views helps students distinguish memorizing vocabulary from explaining mechanism. The codon labels make the genetic code visible; hiding them asks students to infer the same information flow from the molecular context.",
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
          "A single-nucleotide insertion causes a frameshift — every codon downstream is misread, typically producing a completely non-functional protein of wrong length with a random sequence of amino acids from the mutation site onward. A missense substitution changes at most one amino acid, which may be tolerable depending on where it falls. Frameshifts are almost always more destructive.",
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
      "Use the Transcription Step preset with codon labels on, then ask students to explain how information in DNA is represented in the mRNA product. This supports AP Biology central dogma reasoning by making gene expression visible as an information-transfer process.",
      "Use the Translation Step preset and raise Camera Zoom so students can focus on the ribosome reading mRNA and building a polypeptide chain. Have students describe how codons, tRNA, and amino acids connect genotype information to protein structure.",
      "Use the Full Pathway (Both Steps) preset as a beginning-to-end AP Biology review: students trace DNA → mRNA → protein, then identify which molecular structures participate in each stage. Toggle codon labels off for a second pass so they must explain the pathway without relying on text labels.",
      "Run a zoom comparison activity: start wide to locate the nucleus, mRNA strand, ribosome, and polypeptide, then zoom in to discuss how molecular interactions produce gene expression outcomes. Students should connect scale changes to AP Biology expectations for structure-function explanations.",
      "Use the codon toggle as a formative assessment tool: first show codon labels and have students predict how the ribosome groups bases into triplets, then hide labels and ask them to justify where one codon ends and the next begins. This targets central dogma standards without turning the activity into a vocabulary-only exercise.",
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
          "AP Bio 3.A.1 requires students to explain how genetic information in DNA is converted into protein through transcription and translation. AP Bio 3.C.1 requires students to explain how mutations can alter protein structure and function. Cycling through the Transcription Step, Translation Step, and Full Pathway presets while toggling codon labels and zoom level provides direct visual evidence for both standards; the 3D structure makes the molecular consequence of each step concrete.",
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
