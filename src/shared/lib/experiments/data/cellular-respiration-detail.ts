import type { Experiment } from "@/shared/types/experiment";

export const cellularRespirationDetail: Experiment = {
  id: "cellular-respiration-detail",
  slug: "cellular-respiration-detail",
  title: "Cellular Respiration (Detailed)",
  subtitle: "Glycolysis, Krebs cycle, and oxidative phosphorylation step by step",
  description:
    "Follow glucose through all three stages of cellular respiration. Track ATP, NADH, and FADH₂ production through glycolysis, the Krebs cycle, and the electron transport chain. Compare aerobic and anaerobic pathways and calculate total ATP yield per glucose molecule.",
  thumbnail: "/imgs/experiments/cellular-respiration-detail.png",
  standards: { ngss: ["HS-LS1-7"], gcse: [], ap: ["2.A.2"] },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: ["cellular respiration", "glycolysis", "Krebs cycle", "oxidative phosphorylation", "ATP", "AP Biology"],
  difficulty: "advanced",
  parameters: [
    { id: "glucoseAmount", label: "Glucose Molecules", unit: "", min: 1, max: 10, default: 1, step: 1, tier: "free" },
    { id: "oxygenAvailable", label: "O₂ Available (0=no, 1=yes)", unit: "", min: 0, max: 1, default: 1, step: 1, tier: "free" },
    { id: "speed", label: "Animation Speed", unit: "x", min: 0.5, max: 3, default: 1, step: 0.5, tier: "free" },
  ],
  formulas: [
    { latex: "\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\rightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\sim36\\text{ATP}", description: "Overall aerobic respiration equation" },
    { latex: "\\text{Glycolysis: Glucose} \\rightarrow 2\\text{Pyruvate} + 2\\text{ATP} + 2\\text{NADH}", description: "Net products of glycolysis (cytoplasm)" },
  ],
  theory: "Cellular respiration converts glucose to ATP in three stages. Glycolysis (cytoplasm) splits glucose into 2 pyruvate, yielding 2 ATP and 2 NADH net. The Krebs cycle (mitochondrial matrix) oxidizes acetyl-CoA, producing 2 ATP, 6 NADH, and 2 FADH₂ per glucose. Oxidative phosphorylation (inner mitochondrial membrane) uses the electron transport chain to create a proton gradient, driving ATP synthase to produce ~32-34 ATP. Total yield: ~36-38 ATP per glucose. Without O₂, fermentation produces only 2 ATP per glucose (lactic acid or ethanol pathway).",
  instructions: "Watch glucose molecules pass through each stage. The molecule counter tracks ATP, NADH, FADH₂, and CO₂ in real time. Toggle oxygen to compare aerobic vs anaerobic respiration.",
  challenges: [
    { id: "crd-c1", question: "How many ATP molecules are produced per glucose in aerobic respiration?", hint: "~36-38 total: 2 from glycolysis + 2 from Krebs + ~32-34 from oxidative phosphorylation", tier: "free" },
    { id: "crd-c2", question: "Why does fermentation yield so much less ATP than aerobic respiration?", hint: "Without O₂, the ETC can't run. NADH isn't oxidized, so only substrate-level phosphorylation in glycolysis yields 2 ATP", tier: "pro" },
  ],
  wave: 12, tier: "free", estimatedTime: 25,
  relatedExperiments: ["cellular-respiration", "photosynthesis-light-reactions"],
  htmlPath: "/experiments/ap-biology/cellular-respiration-detail.html",
  seoTitle: "Cellular Respiration Detailed Simulation | Scivra AP Biology",
  seoKeywords: ["cellular respiration simulation", "glycolysis Krebs cycle interactive", "ATP production", "AP Biology"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Cellular Respiration" },
};
