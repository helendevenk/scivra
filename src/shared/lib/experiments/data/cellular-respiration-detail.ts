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
  contentSections: {
    whatIsIt:
      "Cellular respiration is the metabolic process cells use to extract energy from glucose and store it as ATP — the currency that powers muscle contraction, active transport, and protein synthesis. Most of the yield comes not from glycolysis, but from the electron transport chain (ETC) embedded in the inner mitochondrial membrane, where NADH and FADH₂ donate electrons that drive proton pumping, creating a gradient that spins ATP synthase like a molecular turbine. One glucose molecule processed through glycolysis, the Krebs cycle, and oxidative phosphorylation generates roughly 32 ATP under aerobic conditions — compared to just 2 ATP from fermentation. The simulation lets you feed glucose molecules through all three stages and toggle oxygen availability to contrast aerobic efficiency against anaerobic fallback pathways.",
    parameterExplanations: {
      glucoseAmount:
        "The number of glucose molecules fed into the pathway at once, from 1 to 10. More glucose increases the throughput of all three stages simultaneously — watch the ATP, NADH, and FADH₂ counters scale proportionally as each molecule completes glycolysis, the Krebs cycle, and oxidative phosphorylation.",
      oxygenAvailable:
        "A binary switch: 1 enables the full aerobic pathway (ETC active, ~32 ATP per glucose), 0 forces anaerobic fermentation (ETC offline, only 2 ATP from glycolysis). Toggling this mid-simulation illustrates why oxygen is the terminal electron acceptor that makes the proton gradient possible.",
      speed:
        "Animation playback rate in multiples of normal speed (0.5×–3×). Slow down to 0.5× to trace individual electron carriers through the ETC; speed up to 3× to observe the cumulative ATP yield across multiple glucose molecules more quickly.",
    },
    misconceptions: [
      {
        wrong:
          "ATP is a form of energy — cells 'make energy' during respiration.",
        correct:
          "Cells don't create energy; ATP transfers stored chemical energy via its phosphate bonds. Respiration converts chemical energy already in glucose into a form (ATP) that other cellular reactions can directly use. The total energy is conserved, not manufactured.",
      },
      {
        wrong:
          "Most ATP comes from glycolysis, so the rest of the pathway is not that important.",
        correct:
          "Glycolysis yields only 2 ATP per glucose net. The electron transport chain and chemiosmosis account for ~32 of the ~34 ATP produced aerobically — roughly 94% of the total yield. Glycolysis matters mainly because it feeds pyruvate into the Krebs cycle.",
      },
      {
        wrong:
          "Plants photosynthesize instead of doing cellular respiration.",
        correct:
          "Plants carry out cellular respiration continuously in all living cells, day and night, using the same mitochondrial machinery as animals. Photosynthesis and respiration are complementary, not alternatives — the glucose made by photosynthesis is the substrate that respiration burns.",
      },
      {
        wrong:
          "Fermentation produces no useful products — it is just a waste pathway.",
        correct:
          "Fermentation regenerates NAD⁺ from NADH, allowing glycolysis to continue when oxygen is absent. Without this recycling step, glycolysis would halt from NAD⁺ depletion. Lactic acid fermentation sustains muscle activity during intense exercise; ethanol fermentation underlies bread-making and brewing.",
      },
    ],
    teacherUseCases: [
      "Pre-lab prediction: before running the simulation, ask students to sketch how total ATP yield changes as glucose input increases from 1 to 10. Compare their linear predictions to the simulation's readout and discuss what determines the ceiling.",
      "Aerobic vs anaerobic data table: have pairs record ATP, NADH, and FADH₂ yields for the same glucose amount under O₂ = 1 and O₂ = 0. Calculate the percent efficiency difference and connect to why aerobic organisms dominate when oxygen is available.",
      "Misconception probe on ATP: pause the simulation mid-ETC and ask 'Where did the energy in ATP come from?' Students who answer 'from the reaction' need redirection to the glucose oxidation chain — use this moment to trace energy transfer from bonds in glucose to NADH to the proton gradient to ATP.",
      "ETC bottleneck investigation: have students vary speed to observe the ETC segment and identify which stage produces the most ATP per glucose. Tie to AP Bio standard 2.A.2 by asking why the inner mitochondrial membrane structure enables chemiosmosis.",
      "Fermentation real-world extension: assign students to research one real-world application of fermentation (yogurt, bread rising, brewing, or muscle cramp recovery) and explain which step of the simulation models that pathway.",
    ],
    faq: [
      {
        question: "Why does aerobic respiration produce so many more ATP than fermentation?",
        answer:
          "The electron transport chain oxidizes NADH and FADH₂, pumping H⁺ across the inner mitochondrial membrane to drive ATP synthase. This chemiosmotic mechanism accounts for ~32 of the ~34 ATP produced per glucose aerobically. Fermentation cannot use the ETC, so only the 2 ATP from substrate-level phosphorylation in glycolysis are available.",
      },
      {
        question: "What exactly does ATP synthase do, and why is the proton gradient important?",
        answer:
          "ATP synthase is a molecular motor embedded in the inner mitochondrial membrane. As H⁺ ions flow down their electrochemical gradient through its F₀ subunit, the rotation drives the F₁ subunit to phosphorylate ADP to ATP. Without the proton gradient built by the ETC, the synthase has no driving force and ATP production drops to near zero.",
      },
      {
        question: "How many ATP does one glucose actually produce — why do textbooks give different numbers?",
        answer:
          "Textbooks historically cited 36–38 ATP; current measurements put the aerobic yield closer to 30–32 ATP per glucose in intact cells, because the cost of shuttling NADH into mitochondria and running the ATP-ADP translocase is factored in. For AP exams, ~36 is the accepted answer; the simulation uses ~32–34 for the ETC stage alone.",
      },
      {
        question: "Does this connect to AP Bio standard 2.A.2?",
        answer:
          "Yes. AP Biology 2.A.2 requires students to explain how free energy is captured and transferred during cellular respiration, specifically including the role of electron carriers (NADH, FADH₂), the electron transport chain, and chemiosmotic synthesis of ATP. Running this simulation with both oxygen states directly addresses all three components of that standard.",
      },
      {
        question: "Why does the Krebs cycle only produce 2 ATP directly if it's so important?",
        answer:
          "The Krebs cycle's main role is not direct ATP synthesis but electron carrier loading. Each turn of the cycle produces 3 NADH and 1 FADH₂, which carry electrons to the ETC where their oxidation drives the synthesis of ~10 ATP per turn (×2 turns per glucose). The 2 ATP from substrate-level phosphorylation in the cycle are a minor fraction of its total contribution.",
      },
    ],
  },
};
