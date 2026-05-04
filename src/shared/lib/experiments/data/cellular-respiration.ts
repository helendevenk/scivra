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
      id: "glucoseInputRate",
      label: "Glucose Input Rate",
      unit: "x",
      min: 0.1,
      max: 3,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "oxygenAvailability",
      label: "O2 Availability",
      unit: "%",
      min: 0,
      max: 100,
      default: 100,
      step: 1,
      tier: "free",
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
    "Use the Glucose Input Rate slider to speed up or slow down how quickly the pathway cycles, then use the O2 Availability slider to compare aerobic respiration with oxygen-limited conditions. Try the Aerobic, Anaerobic, Exercise, Inhibited ETC, and Starvation presets to jump between common AP Biology scenarios and watch how stage timing, ATP tally, NADH buildup, and pathway efficiency change.",

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
  htmlControlAliases: { glucoseInputRate: "sl-glucose", oxygenAvailability: "sl-o2" },
  presets: [
    { id: "aerobic", label: "1 Aerobic", description: "A full-oxygen baseline with a normal glucose input rate. Use it to follow glycolysis, pyruvate oxidation, Krebs cycle, and ETC as the simulation builds a high ATP tally." },
    { id: "anaerobic", label: "2 Anaerobic", description: "Oxygen is removed while glucose input remains available. The model highlights why ATP yield collapses when the ETC cannot pass electrons to O2." },
    { id: "exercise", label: "3 Exercise", description: "Glucose input is pushed high while oxygen remains partly available. This preset is useful for discussing increased cellular demand and why oxygen delivery matters during sustained activity." },
    { id: "inhibited", label: "4 Inhibited ETC", description: "Oxygen availability is kept very low to mimic a blocked or severely limited electron transport chain. Students can compare NADH buildup and ATP output against the aerobic case." },
    { id: "starvation", label: "5 Starvation", description: "Glucose input is nearly absent while oxygen remains available. The pathway has the final electron acceptor it needs, but little fuel enters glycolysis." },
  ],
  contentSections: {
    whatIsIt:
      "Cellular respiration is how cells turn food into usable energy. Glucose plus oxygen yields carbon dioxide, water, and ATP — the cell's chemical fuel. The process runs in three connected stages: glycolysis (in the cytosol) breaks glucose into two pyruvates and makes a small amount of ATP. The Krebs cycle (in the mitochondrial matrix) strips electrons off pyruvate-derived molecules and stores them on NADH and FADH2. The electron transport chain (across the inner mitochondrial membrane) uses those electrons to pump protons, building a gradient that drives ATP synthase to make the bulk of the cell's ATP. In this lab, change glucose input rate and O2 availability to see ATP yield rise and fall in real time.",
    parameterExplanations: {
      glucoseInputRate:
        "Glucose Input Rate controls how quickly fuel enters the animated respiration pathway. Raising it makes the simulation cycle through glycolysis, pyruvate oxidation, the Krebs cycle, and the ETC faster, so ATP and NADH values update more rapidly. Lowering it slows the pathway and is the key idea behind the Starvation preset: oxygen may still be present, but there is not much glucose to oxidize. Keep O2 Availability fixed while changing this slider to separate fuel supply from oxygen limitation. That comparison helps students see that aerobic respiration needs both a carbon fuel source and a final electron acceptor.",
      oxygenAvailability:
        "O2 Availability controls whether the electron transport chain can keep accepting electrons at the end of respiration. At high oxygen, NADH and FADH2 can unload electrons, proton pumping continues, and the ATP tally can approach the aerobic maximum shown in the simulation. At low or zero oxygen, the ETC stalls, electron carriers back up, and the model shifts toward the much smaller ATP yield from glycolysis. Use the Anaerobic and Inhibited ETC presets, then move only this slider upward, to show why oxygen is not burned directly with glucose but is essential as the final electron acceptor.",
    },
    misconceptions: [
      {
        wrong:
          "Cellular respiration only happens in mitochondria.",
        correct:
          "Glycolysis happens in the cytosol — every cell, including bacteria without mitochondria, can do glycolysis. Only the Krebs cycle and ETC are inside the mitochondria. The simulation separates these locations by showing glycolysis outside the mitochondrion, Krebs activity in the matrix, and ETC activity along the inner membrane.",
      },
      {
        wrong:
          "Cells always make 38 ATP per glucose.",
        correct:
          "The 36-38 ATP value shown in many textbook tallies is a theoretical maximum. Real cells often make closer to 30-32 ATP because of proton leak and transport costs. The simulation uses the larger AP-style tally to make stage contributions visible, while the underlying concept remains that aerobic yield is far higher than anaerobic yield.",
      },
      {
        wrong:
          "Oxygen's role is to combine with glucose directly.",
        correct:
          "Oxygen is the final electron acceptor at the end of the ETC. It accepts electrons and protons to form water. Without enough O2, the chain backs up, NADH cannot be reoxidized efficiently, and aerobic respiration slows or stops. Glucose itself is not simply combining with O2 in one direct step.",
      },
      {
        wrong:
          "ATP is energy.",
        correct:
          "ATP is not energy itself — it is a molecule whose hydrolysis releases usable free energy that cells can couple to other reactions. Calling ATP the cell's energy currency means it transfers energy in manageable packets, not that the molecule is the same thing as energy.",
      },
    ],
    teacherUseCases: [
      "Start with the Aerobic preset and have students record where glycolysis, pyruvate oxidation, Krebs cycle, and ETC are located in the cell model.",
      "Use the Glucose Input Rate slider as a fuel-supply investigation: keep O2 Availability at 100%, then compare the Starvation preset with the Exercise preset.",
      "Use the O2 Availability slider to model anoxia. Students should predict what happens to ETC output and explain why glycolysis can still contribute a small ATP yield.",
      "Compare the Aerobic and Inhibited ETC presets in a CER prompt about final electron acceptors, NADH reoxidation, and ATP production.",
      "Pair the Exercise preset with a discussion of cellular demand: students explain why higher glucose input alone does not guarantee full aerobic ATP output if oxygen becomes limiting.",
    ],
    faq: [
      {
        question: "How much ATP does cellular respiration make per glucose?",
        answer:
          "Aerobic respiration is commonly taught as yielding about 36-38 ATP per glucose in an idealized AP Biology tally, while real cells often produce closer to 30-32 because of proton leak and transport costs. The main comparison is the same in either accounting system: aerobic respiration makes far more ATP than oxygen-limited respiration, where glycolysis supplies only a small net yield.",
      },
      {
        question: "What's the difference between aerobic and anaerobic respiration?",
        answer:
          "Aerobic respiration uses O2 as the final electron acceptor and can run the glycolysis -> pyruvate oxidation -> Krebs cycle -> ETC sequence. Anaerobic conditions prevent the ETC from operating normally, so cells rely on pathways such as fermentation to regenerate NAD+ and keep glycolysis running. The Anaerobic preset shows why ATP production drops sharply when O2 Availability is zero.",
      },
      {
        question: "What is chemiosmosis?",
        answer:
          "Chemiosmosis is the process where a proton gradient across a membrane drives ATP synthesis. The ETC pumps H+ out of the matrix; ATP synthase lets H+ flow back in and uses the energy to phosphorylate ADP into ATP. Mitchell's chemiosmotic theory (1961) is the cornerstone of bioenergetics.",
      },
      {
        question: "What does the Inhibited ETC preset show?",
        answer:
          "The Inhibited ETC preset sets oxygen availability very low, so the electron transport chain cannot keep passing electrons efficiently. That lets students compare a blocked or oxygen-limited ETC against the Aerobic preset. ATP output falls because most ATP normally comes from oxidative phosphorylation, not from glycolysis or the Krebs cycle alone.",
      },
      {
        question: "How does this connect to AP Biology?",
        answer:
          "AP Bio Big Idea 2 (Energetics) expects students to know the stages of cellular respiration, locate them in the cell, and explain how ATP is produced through redox reactions and chemiosmosis. Students should also be able to reason about oxygen availability, ETC inhibition, and why anaerobic conditions produce much less ATP. This lab supports those comparisons with two sliders and five preset scenarios.",
      },
    ],
  },
};
