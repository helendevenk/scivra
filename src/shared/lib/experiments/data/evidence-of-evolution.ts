import type { Experiment } from "@/shared/types/experiment";

export const evidenceOfEvolution: Experiment = {
  id: "evidence-of-evolution",
  slug: "evidence-of-evolution",
  title: "Evidence of Evolution",
  subtitle:
    "Phylogenetic trees, homologous structures, and fossil record analysis",
  description:
    "Examine the key lines of evidence supporting biological evolution. Explore interactive phylogenetic trees showing evolutionary relationships, compare homologous and analogous structures across species, analyze fossil record sequences, and investigate molecular evidence through DNA/protein sequence alignment. Build your understanding of descent with modification.",
  thumbnail: "/imgs/experiments/evidence-of-evolution.png",

  standards: {
    ngss: ["HS-LS4-1", "HS-LS4-2", "HS-LS4-4"],
    gcse: [],
    ap: ["7.A.1", "7.B.1", "7.C.1"],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: [
    "evolution",
    "phylogenetic tree",
    "homologous structures",
    "fossil record",
    "molecular evidence",
    "common ancestry",
    "AP Biology",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "evidenceType",
      label: "Evidence Type (0=Anatomy 1=Fossil 2=Molecular 3=Tree)",
      unit: "",
      min: 0,
      max: 3,
      default: 3,
      step: 1,
      tier: "free",
    },
    {
      id: "speciesCount",
      label: "Species to Compare",
      unit: "",
      min: 3,
      max: 8,
      default: 5,
      step: 1,
      tier: "free",
    },
    {
      id: "timeDepth",
      label: "Time Depth (Mya)",
      unit: "Mya",
      min: 10,
      max: 500,
      default: 100,
      step: 10,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex:
        "d = \\frac{\\text{mutations}}{\\text{total sites}} \\times 100\\%",
      description:
        "Sequence divergence: percentage of differing nucleotides between two aligned sequences",
    },
    {
      latex: "t = \\frac{d}{2\\mu}",
      description:
        "Molecular clock: divergence time estimated from sequence divergence (d) and mutation rate (μ)",
    },
  ],

  theory:
    "Evolution is supported by converging evidence from multiple fields. Comparative anatomy reveals homologous structures (same developmental origin, different function — e.g., human arm vs. whale flipper) indicating common ancestry, and analogous structures (different origin, similar function — e.g., bird wing vs. insect wing) showing convergent evolution. The fossil record documents transitional forms (e.g., Tiktaalik between fish and tetrapods) and patterns of appearance/extinction. Molecular biology provides the strongest evidence: DNA and protein sequence comparisons show that more closely related species share more similar sequences. The molecular clock hypothesis proposes that neutral mutations accumulate at a roughly constant rate, allowing estimation of divergence times. Phylogenetic trees (cladograms) organize this evidence into branching diagrams showing evolutionary relationships based on shared derived characters (synapomorphies).",

  instructions:
    "Switch between four evidence views using the Evidence Type slider. In Tree view, explore the phylogenetic tree and click species to highlight branches. In Anatomy view, compare homologous limb structures across vertebrates. In Fossil view, scroll through a stratigraphic timeline. In Molecular view, see DNA sequence alignment and similarity percentages.",

  challenges: [
    {
      id: "evo-c1",
      question:
        "Why are homologous structures evidence of common ancestry but analogous structures are not?",
      hint: "Homologous structures share the same embryonic origin and bone pattern despite different functions — inherited from a common ancestor. Analogous structures evolved independently under similar selective pressures.",
      tier: "free",
    },
    {
      id: "evo-c2",
      question:
        "Two species have 5% DNA sequence divergence. If the mutation rate is 1% per 10 million years, when did they diverge?",
      hint: "t = d/(2μ) = 0.05/(2 × 0.001) = 25 million years ago (divide by 2 because both lineages accumulate mutations).",
      tier: "free",
    },
    {
      id: "evo-c3",
      question:
        "How does biogeography (geographic distribution of species) support evolution? Give an example.",
      hint: "Island species resemble nearby mainland species more than distant island species with similar environments — colonization + local adaptation, not independent creation.",
      tier: "pro",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["natural-selection", "population-dynamics"],
  htmlPath: "/experiments/ap-biology/evidence-of-evolution.html",

  seoTitle: "Evidence of Evolution Interactive | Scivra AP Biology",
  seoKeywords: [
    "evidence of evolution interactive",
    "phylogenetic tree builder",
    "homologous structures comparison",
    "molecular clock calculator",
    "AP Biology evolution",
    "fossil record virtual lab",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Evidence of Evolution and Phylogenetics",
  },
};
