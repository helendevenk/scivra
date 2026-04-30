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
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "9-12",
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

  seoTitle: "Cellular Respiration ATP Synthesis — Interactive 3D | Scivra AP Biology",
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

  contentSections: {
    whatIsIt:
      "Cellular respiration is how cells turn food into usable energy. Glucose plus oxygen yields carbon dioxide, water, and ATP — the cell's chemical fuel. The process runs in three connected stages: glycolysis (in the cytosol) breaks glucose into two pyruvates and makes a small amount of ATP. The Krebs cycle (in the mitochondrial matrix) strips electrons off pyruvate-derived molecules and stores them on NADH and FADH2. The electron transport chain (across the inner mitochondrial membrane) uses those electrons to pump protons, building a gradient that drives ATP synthase to make the bulk of the cell's ATP. In this lab, change glucose, oxygen, and proton-gradient strength to see ATP yield rise and fall in real time.",
    parameterExplanations: {
      glucoseConcentration:
        "Substrate supply for glycolysis. More glucose lets glycolysis run faster — but only up to the point where downstream steps (Krebs, ETC) can keep up.",
      oxygenLevel:
        "Final electron acceptor in the ETC. Without enough O2, electrons back up, NADH can't unload, and the cell switches to anaerobic fermentation. ATP yield drops sharply.",
      protonGradient:
        "The proton (H+) concentration difference across the inner mitochondrial membrane. ATP synthase uses this gradient like a turbine. Stronger gradient means more ATP per glucose.",
      uncouplerConc:
        "Uncouplers (e.g., 2,4-DNP, thermogenin) are molecules that leak protons across the membrane, dissipating the gradient as heat instead of ATP. Brown fat uses this to keep babies warm. Crank up the uncoupler in the lab and watch ATP yield collapse.",
    },
    misconceptions: [
      {
        wrong:
          "Cellular respiration only happens in mitochondria.",
        correct:
          "Glycolysis happens in the cytosol — every cell, including bacteria without mitochondria, can do glycolysis. Only the Krebs cycle and ETC are inside the mitochondria. Total ATP from glucose: ~2 from glycolysis, ~2 from the Krebs cycle, ~28 from the ETC.",
      },
      {
        wrong:
          "Cells make ~38 ATP per glucose with perfect efficiency.",
        correct:
          "The textbook 36-38 ATP figure is a theoretical maximum. Real cells typically make 30-32 because of proton leak and the cost of moving pyruvate and NADH into the mitochondrion. Real biology is messier than the textbook bookkeeping.",
      },
      {
        wrong:
          "Oxygen's role is to combine with glucose directly.",
        correct:
          "Oxygen is the final electron acceptor at the end of the ETC. It accepts electrons (and protons) to form water. Without O2, the chain backs up, NADH can't be reoxidized, and aerobic respiration grinds to a halt. Glucose itself isn't combining with O2 directly.",
      },
      {
        wrong:
          "ATP is energy.",
        correct:
          "ATP isn't energy itself — it's a molecule whose hydrolysis (ATP → ADP + Pi) releases ~30 kJ/mol that the cell can couple to other reactions. ATP is the cell's energy currency, not energy stored as electricity.",
      },
    ],
    teacherUseCases: [
      "Stage tour: pause the simulation at glycolysis, then Krebs, then ETC. Have students sketch what's happening at each stage and where the inputs/outputs are.",
      "ATP yield calculation: ask students to predict total ATP from a single glucose, then run the simulation under aerobic conditions to compare.",
      "Anoxia experiment: drop O2 to zero. Have students explain what happens to NADH, electrons, and ATP yield. Connect to fermentation (lactic acid in muscle, ethanol in yeast).",
      "Uncoupler discovery: introduce uncoupler concentration and ask students why ATP yield drops while glucose consumption stays high. Tie to brown fat thermogenesis and the diet drug DNP.",
      "Compare to photosynthesis: pair this lab with the photosynthesis simulation and ask students to reason about the symmetry of inputs/outputs.",
    ],
    faq: [
      {
        question: "How much ATP does cellular respiration make per glucose?",
        answer:
          "Aerobic respiration yields roughly 30-32 ATP per glucose in real cells (textbook theoretical max: 36-38). About 2 from glycolysis, 2 from the Krebs cycle, and the rest from oxidative phosphorylation in the ETC. Anaerobic respiration (fermentation) yields just 2 ATP from glycolysis alone.",
      },
      {
        question: "What's the difference between aerobic and anaerobic respiration?",
        answer:
          "Aerobic uses O2 as the final electron acceptor and runs the full glycolysis → Krebs → ETC pipeline. Anaerobic substitutes another molecule (e.g., pyruvate becomes lactate, or acetaldehyde becomes ethanol). Anaerobic is much less efficient — about 5% the ATP yield — but doesn't require oxygen.",
      },
      {
        question: "What is chemiosmosis?",
        answer:
          "Chemiosmosis is the process where a proton gradient across a membrane drives ATP synthesis. The ETC pumps H+ out of the matrix; ATP synthase lets H+ flow back in and uses the energy to phosphorylate ADP into ATP. Mitchell's chemiosmotic theory (1961) is the cornerstone of bioenergetics.",
      },
      {
        question: "Why do uncouplers cause heat instead of ATP?",
        answer:
          "Uncouplers let protons cross the inner membrane without going through ATP synthase. The gradient still forms (ETC keeps pumping) but the energy bypasses ATP and dissipates as heat. Brown fat in mammals uses thermogenin (UCP1) for exactly this — non-shivering thermogenesis to warm newborns and hibernators.",
      },
      {
        question: "How does this connect to AP Biology?",
        answer:
          "AP Bio Big Idea 2 (Energetics) expects students to know the three stages of cellular respiration, locate them in the cell, and explain how ATP is produced via chemiosmosis. They should also be able to reason about anaerobic alternatives and the role of redox reactions. This lab covers learning objective 2.A.2 directly.",
      },
    ],
  },
};
