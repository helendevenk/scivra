import type { Experiment } from "@/shared/types/experiment";

export const dnaReplicationDetail: Experiment = {
  id: "dna-replication-detail",
  slug: "dna-replication-detail",
  title: "DNA Replication (Detailed)",
  subtitle: "Helicase, primase, DNA polymerase, and leading/lagging strand synthesis",
  description:
    "Watch DNA replication unfold at the molecular level. See helicase unwind the double helix, primase lay down RNA primers, DNA polymerase III synthesize new strands, and ligase seal Okazaki fragments. Compare leading strand (continuous) and lagging strand (discontinuous) synthesis.",
  thumbnail: "/imgs/experiments/dna-replication-detail.png",
  standards: { ngss: ["HS-LS1-1"], gcse: [], ap: ["3.A.1"] },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: ["DNA replication", "helicase", "DNA polymerase", "leading strand", "lagging strand", "Okazaki fragments", "AP Biology"],
  difficulty: "advanced",
  parameters: [
    { id: "speed", label: "Replication Speed", unit: "x", min: 0.5, max: 3, default: 1, step: 0.5, tier: "free" },
    { id: "showEnzymes", label: "Show Enzyme Labels (0=off, 1=on)", unit: "", min: 0, max: 1, default: 1, step: 1, tier: "free" },
    { id: "showDirection", label: "Show 5'→3' Direction (0=off, 1=on)", unit: "", min: 0, max: 1, default: 1, step: 1, tier: "free" },
  ],
  formulas: [
    { latex: "5' \\rightarrow 3'", description: "DNA polymerase can only add nucleotides in the 5' to 3' direction" },
  ],
  theory: "DNA replication is semi-conservative — each new DNA molecule contains one original and one new strand. Helicase unwinds the double helix at the replication fork. Single-strand binding proteins stabilize the separated strands. Primase synthesizes short RNA primers. DNA polymerase III extends primers in the 5'→3' direction. On the leading strand, synthesis is continuous. On the lagging strand, synthesis is discontinuous, producing Okazaki fragments (~1000-2000 bp in prokaryotes). DNA polymerase I replaces RNA primers with DNA. DNA ligase seals nicks between fragments. The result: two identical DNA molecules.",
  instructions: "Press Play to watch the replication fork advance. Observe the difference between leading (continuous) and lagging (discontinuous) strand synthesis. Toggle enzyme labels and 5'→3' direction arrows.",
  challenges: [
    { id: "drd-c1", question: "Why is the lagging strand synthesized in fragments?", hint: "DNA polymerase only works 5'→3'. The lagging strand template runs 5'→3' toward the fork, so polymerase must work away from the fork in short bursts", tier: "free" },
    { id: "drd-c2", question: "What would happen if ligase were knocked out?", hint: "Okazaki fragments on the lagging strand would never be joined, leaving nicks in the new DNA that could lead to strand breaks", tier: "pro" },
  ],
  wave: 12, tier: "free", estimatedTime: 25,
  relatedExperiments: ["cell-structure-3d"],
  htmlPath: "/experiments/ap-biology/dna-replication-detail.html",
  seoTitle: "DNA Replication Detailed Simulation | Scivra AP Biology",
  seoKeywords: ["DNA replication simulation", "helicase polymerase interactive", "leading lagging strand", "AP Biology"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "DNA Replication" },
};
