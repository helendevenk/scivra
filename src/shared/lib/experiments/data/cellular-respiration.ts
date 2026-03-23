import type { Experiment } from "@/shared/types/experiment";

export const cellularRespiration: Experiment = {
  id: "cellular-respiration",
  slug: "cellular-respiration",
  title: "Cellular Respiration & ATP Synthesis",
  subtitle: "How cells harvest energy from glucose",
  description:
    "Follow glucose through the three stages of cellular respiration: glycolysis in the cytoplasm, the Krebs cycle in the mitochondrial matrix, and the electron transport chain on the inner membrane. Watch ATP synthase spin as the proton gradient drives synthesis of 30-32 ATP molecules per glucose.",
  thumbnail: "/imgs/experiments/cellular-respiration.png",

  standards: {
    ngss: ["HS-LS1-7", "HS-LS2-3"],
    gcse: ["B2.1", "B2.2"],
    ap: ["2.A.2", "2.A.3"],
  },
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: ["cellular respiration", "ATP", "glycolysis", "Krebs cycle", "electron transport chain", "AP Biology"],
  difficulty: "advanced",

  parameters: [
    {
      id: "glucoseConcentration",
      label: "Glucose Input",
      unit: "mmol/L",
      min: 1,
      max: 20,
      default: 5,
      step: 1,
      tier: "free",
    },
    {
      id: "oxygenLevel",
      label: "Oxygen Level",
      unit: "%",
      min: 0,
      max: 100,
      default: 100,
      step: 5,
      tier: "free",
    },
    {
      id: "protonGradient",
      label: "Proton Gradient (ΔpH)",
      unit: "",
      min: 0.5,
      max: 3,
      default: 1.4,
      step: 0.1,
      tier: "pro",
    },
    {
      id: "uncouplerConc",
      label: "Uncoupler Concentration",
      unit: "μM",
      min: 0,
      max: 50,
      default: 0,
      step: 5,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\to 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + 30\\text{–}32\\text{ ATP}",
      description: "Overall equation for aerobic respiration",
    },
    {
      latex: "\\text{Glycolysis: Glucose} \\to 2\\text{ Pyruvate} + 2\\text{ ATP} + 2\\text{ NADH}",
      description: "Net yield of glycolysis (cytoplasm)",
    },
    {
      latex: "\\Delta G = -nF\\Delta E \\quad (\\text{ETC drives ATP synthesis})",
      description: "Free energy from electron transport drives ATP synthase",
    },
  ],

  theory:
    "Cellular respiration harvests energy from glucose in three stages. Glycolysis (cytoplasm): glucose (6C) is split into two pyruvate (3C), producing 2 ATP and 2 NADH. The Pyruvate Oxidation step converts pyruvate to Acetyl-CoA, releasing CO₂. The Krebs Cycle (mitochondrial matrix): each Acetyl-CoA enters, and per cycle produces 3 NADH, 1 FADH₂, 1 ATP, and 2 CO₂. The Electron Transport Chain (inner mitochondrial membrane): NADH and FADH₂ donate electrons through protein complexes, pumping H⁺ into the intermembrane space. The proton gradient drives ATP synthase, producing ~26-28 ATP. Total yield: ~30-32 ATP per glucose (aerobic). Without O₂, fermentation produces only 2 ATP.",

  instructions:
    "Watch glucose enter glycolysis — track the 2-ATP investment and 4-ATP return. Follow pyruvate into the mitochondria and through the Krebs cycle. Then zoom into the inner membrane to see electrons cascade through the ETC and protons flowing through ATP synthase. Reduce oxygen to watch fermentation kick in.",

  challenges: [
    {
      id: "cr-c1",
      question: "How many ATP are produced during glycolysis alone from 1 glucose molecule?",
      hint: "Net ATP from glycolysis = 4 produced - 2 invested = 2 ATP net.",
      tier: "free",
    },
    {
      id: "cr-c2",
      question: "If oxygen is completely absent, what is the maximum ATP yield from glucose?",
      hint: "Without O₂, only glycolysis runs. Fermentation regenerates NAD⁺ but produces no additional ATP. Yield = 2 ATP.",
      tier: "free",
    },
    {
      id: "cr-c3",
      question: "How many NADH molecules are produced from one complete turn of the Krebs cycle?",
      hint: "Per turn: 3 NADH, 1 FADH₂, 1 ATP (or GTP). Glucose produces 2 Acetyl-CoA → 2 turns → 6 NADH from Krebs.",
      tier: "free",
    },
    {
      id: "cr-c4",
      question: "An uncoupler (like DNP) dissipates the proton gradient without driving ATP synthase. Predict the effect on: (a) O₂ consumption, (b) ATP output, (c) heat production.",
      hint: "Uncouplers: (a) O₂ consumption INCREASES (ETC still runs, pumps protons faster), (b) ATP drops to near 0 from ETC, (c) heat increases (gradient dissipated as heat). Used historically as a weight-loss drug — dangerously!",
      tier: "pro",
    },
  ],

  wave: 3,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["photosynthesis", "enzyme-kinetics"],

  seoTitle: "Cellular Respiration ATP Synthesis — Interactive 3D | NeonPhysics AP Biology",
  seoKeywords: [
    "cellular respiration animation",
    "ATP synthesis simulation",
    "Krebs cycle interactive",
    "electron transport chain",
    "AP Biology respiration",
    "glycolysis simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Cellular Respiration and ATP Synthesis",
  },
};
