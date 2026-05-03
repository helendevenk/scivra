import type { Experiment } from "@/shared/types/experiment";

export const cellularRespirationDetail: Experiment = {
  id: "cellular-respiration-detail",
  slug: "cellular-respiration-detail",
  title: "Electron Transport Chain & Chemiosmosis",
  subtitle: "Model Complexes I-IV, ATP synthase, proton motive force, and ETC inhibitor effects",
  description:
    "Explore oxidative phosphorylation at the inner mitochondrial membrane. Adjust proton gradient strength and electron transport rate to see how NADH and FADH2 oxidation, proton pumping, oxygen reduction, and ATP synthase rotation are coupled. Use cyanide, DNP, and oligomycin presets to compare three distinct ways ATP production can fail.",
  thumbnail: "/imgs/experiments/cellular-respiration-detail.png",
  standards: { ngss: ["HS-LS1-7"], gcse: [], ap: ["2.A.2", "3.D"] },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: [
    "electron transport chain",
    "chemiosmosis",
    "oxidative phosphorylation",
    "ATP synthase",
    "proton gradient",
    "ETC inhibitors",
    "AP Biology",
  ],
  difficulty: "advanced",
  parameters: [
    { id: "protonGradient", label: "Proton Gradient", unit: "%", min: 0, max: 100, default: 100, step: 1, tier: "free" },
    { id: "electronTransportRate", label: "Electron Transport Rate", unit: "×", min: 0, max: 2, default: 1.0, step: 0.1, tier: "free" },
  ],
  formulas: [
    {
      latex: "\\Delta p = \\Delta \\Psi - \\frac{2.303RT}{F}\\Delta\\text{pH}",
      description: "Proton motive force combines the membrane voltage and pH gradient across the inner mitochondrial membrane.",
    },
    {
      latex: "\\text{NADH} + \\text{H}^+ + \\frac{1}{2}\\text{O}_2 \\rightarrow \\text{NAD}^+ + \\text{H}_2\\text{O}",
      description: "Electrons from NADH flow through the ETC to oxygen, the terminal electron acceptor.",
    },
    {
      latex: "\\sim 2.7\\text{ H}^+ + \\text{ADP} + \\text{P}_i \\rightarrow \\text{ATP} + \\text{H}_2\\text{O}",
      description: "Proton flow through F0 drives F1 rotation and ATP synthesis.",
    },
  ],
  theory:
    "The electron transport chain is embedded in the inner mitochondrial membrane. NADH donates high-energy electrons to Complex I, while FADH2 donates electrons through Complex II. Electrons move through ubiquinone, Complex III, cytochrome c, and Complex IV, where oxygen is reduced to water. Complexes I, III, and IV use the released free energy to pump H+ into the intermembrane space, building a proton motive force made of both charge separation and a pH difference. ATP synthase uses this gradient: H+ flows through the F0 channel, rotating the c-ring and gamma subunit, which changes the F1 catalytic sites so ADP and phosphate form ATP. The inhibitor presets isolate mechanism. Cyanide blocks Complex IV, stopping oxygen reduction and electron flow. DNP uncouples electron transport from ATP synthesis by carrying protons across the membrane. Oligomycin blocks the ATP synthase proton channel, causing the gradient to build and slowing electron flow by back-pressure.",
  instructions:
    "Use the Proton Gradient slider to change how much electrochemical gradient is maintained across the inner mitochondrial membrane. Use the Electron Transport Rate slider to change electron flow through the ETC. Compare the Normal ETC, Cyanide, DNP Uncoupler, and Oligomycin presets to explain how each condition changes proton pumping, proton flow through ATP synthase, and ATP output.",
  challenges: [
    {
      id: "etc-c1",
      question: "Why does cyanide rapidly stop oxidative phosphorylation?",
      hint: "Cyanide inhibits Complex IV, so electrons cannot reduce O2 to H2O. Electron flow backs up, proton pumping stops, and the proton gradient collapses.",
      tier: "free",
    },
    {
      id: "etc-c2",
      question: "How can DNP increase electron transport while decreasing ATP synthesis?",
      hint: "DNP carries H+ across the inner membrane, dissipating the gradient. The ETC may run faster trying to rebuild the gradient, but ATP synthase is bypassed.",
      tier: "free",
    },
    {
      id: "etc-c3",
      question: "Why does oligomycin slow electron transport even though it targets ATP synthase?",
      hint: "Blocking the F0 proton channel prevents H+ from returning to the matrix. The proton motive force becomes very high, creating back-pressure against further proton pumping.",
      tier: "pro",
    },
    {
      id: "etc-c4",
      question: "Why does FADH2 usually support less ATP production than NADH?",
      hint: "FADH2 enters through Complex II, which does not pump protons, so fewer H+ are moved across the membrane per electron pair.",
      tier: "pro",
    },
  ],
  wave: 12,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["cellular-respiration", "photosynthesis-light-reactions"],
  htmlPath: "/experiments/ap-biology/cellular-respiration-detail.html",
  seoTitle: "Electron Transport Chain & Chemiosmosis Simulation | Scivra AP Biology",
  seoKeywords: [
    "electron transport chain simulation",
    "chemiosmosis AP Biology",
    "ATP synthase proton gradient",
    "oxidative phosphorylation interactive",
    "cyanide DNP oligomycin ETC inhibitors",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Electron Transport Chain, Chemiosmosis, ATP Synthase, and ETC Inhibitors",
  },
  htmlControlAliases: { protonGradient: "sl-pg", electronTransportRate: "sl-etr" },
  presets: [
    {
      id: "normal",
      label: "1 Normal ETC",
      description:
        "Electrons flow from NADH and FADH2 through Complexes I-IV to oxygen, proton pumps maintain the gradient, and ATP synthase uses H+ flow to make ATP.",
      paramValues: { protonGradient: 100, electronTransportRate: 1.0 },
    },
    {
      id: "cyanide",
      label: "2 Cyanide",
      description:
        "Cyanide blocks Complex IV, preventing oxygen reduction. Electron flow halts, proton pumping stops, and the proton gradient collapses to near-zero.",
      paramValues: { protonGradient: 10, electronTransportRate: 0 },
    },
    {
      id: "dnp",
      label: "3 DNP Uncoupler",
      description:
        "DNP acts as a proton ionophore, carrying H+ across the inner membrane. Electron transport continues normally, but the gradient is dissipated as heat instead of driving ATP synthase.",
      paramValues: { protonGradient: 5, electronTransportRate: 1.0 },
    },
    {
      id: "oligomycin",
      label: "4 Oligomycin",
      description:
        "Oligomycin blocks the F0 proton channel of ATP synthase. H+ cannot flow back to the matrix, so the gradient remains high while ATP synthesis halts; in real cells, electron transport eventually slows from back-pressure.",
      paramValues: { protonGradient: 100, electronTransportRate: 1.0 },
    },
  ],
  contentSections: {
    whatIsIt:
      "The electron transport chain and chemiosmosis are the membrane-based stage of cellular respiration that converts redox energy into ATP. In mitochondria, NADH and FADH2 deliver electrons to protein complexes in the inner membrane. As electrons move toward oxygen, Complexes I, III, and IV pump H+ into the intermembrane space. That stored electrochemical potential is the proton motive force, combining membrane voltage and a pH difference. ATP synthase then works like a rotary enzyme: H+ flows through the F0 subunit, the rotor turns, and the F1 catalytic head changes shape to phosphorylate ADP. This simulation focuses only on ETC and chemiosmosis, not the full respiration pathway, so students can isolate coupling, inhibition, and gradient-driven ATP synthesis.",
    parameterExplanations: {
      protonGradient:
        "Proton Gradient represents how much of the H+ electrochemical gradient is maintained across the inner mitochondrial membrane. A strong gradient provides the driving force for ATP synthase; a collapsed gradient means electron transport is no longer coupled to ATP production. Use this slider to test whether ATP synthase has enough proton motive force to convert ADP and phosphate into ATP.",
      electronTransportRate:
        "Electron Transport Rate controls how quickly electrons move through the ETC from reduced carriers toward oxygen. Higher electron flow can support more proton pumping only if the complexes and proton gradient coupling remain functional. Use this slider to distinguish normal acceleration from inhibitor conditions where electron flow, oxygen reduction, or chemiosmotic coupling is disrupted.",
    },
    misconceptions: [
      {
        wrong: "The ETC directly makes ATP at Complexes I-IV.",
        correct:
          "Complexes I-IV do not directly synthesize ATP. They transfer electrons and pump protons. ATP synthase makes ATP when H+ flows back through its F0 channel and drives conformational changes in the F1 catalytic head.",
      },
      {
        wrong: "Oxygen is used because it is pumped across the membrane.",
        correct:
          "Oxygen is not pumped. It is the terminal electron acceptor at Complex IV, where it is reduced to water. Without oxygen accepting electrons, the chain backs up and proton pumping stops.",
      },
      {
        wrong: "A stronger proton gradient always means more ATP.",
        correct:
          "A gradient must be able to flow through ATP synthase. If oligomycin blocks the proton channel, the gradient can remain high while ATP synthesis falls and electron transport slows.",
      },
      {
        wrong: "Uncouplers block the ETC the same way cyanide does.",
        correct:
          "Uncouplers such as DNP do not primarily block electron flow. They dissipate the proton gradient, so electron transport may continue or accelerate while ATP synthesis drops because H+ bypasses ATP synthase.",
      },
      {
        wrong: "NADH and FADH2 are equivalent electron donors.",
        correct:
          "NADH enters at Complex I, which pumps protons. FADH2 enters through Complex II, which does not pump protons, so FADH2 contributes less to the proton motive force.",
      },
    ],
    teacherUseCases: [
      "Use the Cyanide preset as an AP Bio 3.D mechanism prompt: students trace cause and effect from Complex IV inhibition to oxygen reduction failure, halted electron flow, gradient collapse, and ATP synthesis loss.",
      "Run the DNP preset after Normal ETC and ask students why electron transport can remain high while ATP output falls, emphasizing the distinction between electron flow and chemiosmotic coupling.",
      "Use the Oligomycin preset to teach feedback in energy systems: ATP synthase is blocked first, then proton back-pressure slows proton pumping and electron transport.",
      "Have students compare NADH entry at Complex I with FADH2 entry at Complex II, then explain why bypassing one proton-pumping complex changes ATP yield.",
      "Connect HS-LS1-7 to energy transformation by having students identify each energy transfer: redox energy, proton motive force, mechanical rotation, and chemical energy in ATP.",
    ],
    faq: [
      {
        question: "What does this simulation teach?",
        answer:
          "It teaches the electron transport chain and chemiosmosis stage of aerobic respiration: electron transfer through Complexes I-IV, proton pumping across the inner mitochondrial membrane, oxygen reduction at Complex IV, and ATP synthesis by the F0F1 ATP synthase.",
      },
      {
        question: "How does cyanide stop ATP production?",
        answer:
          "Cyanide binds Complex IV, also called cytochrome c oxidase. Because electrons can no longer reduce oxygen to water, electron flow through the ETC stops, proton pumping stops, the gradient collapses, and ATP synthase loses its driving force.",
      },
      {
        question: "Why is DNP called an uncoupler?",
        answer:
          "DNP separates electron transport from ATP synthesis. It carries protons across the inner mitochondrial membrane, dissipating the gradient as heat. The ETC can still move electrons, but the stored proton motive force no longer passes through ATP synthase efficiently.",
      },
      {
        question: "What exactly do the F0 and F1 parts of ATP synthase do?",
        answer:
          "F0 is the membrane-embedded proton channel and rotor. As H+ moves through F0, rotation is transmitted to the gamma subunit. F1 is the matrix-facing catalytic head; its binding-change mechanism converts ADP and phosphate into ATP.",
      },
      {
        question: "Why do biology sources often say about 30 ATP per glucose, and how does this align with AP Biology and NGSS?",
        answer:
          "Modern estimates are usually near 30 to 32 ATP per glucose because ATP yield depends on shuttle systems, proton leak, transport costs, and the lower ATP contribution from FADH2 (which enters at Complex II and skips one proton-pumping step). The ETC sets the upper limit by determining how many protons are pumped and how efficiently ATP synthase uses them. For AP Biology 2.A.2 and 3.D, the simulation emphasizes free energy transfer, electron carriers, chemiosmosis, membrane structure, and response to molecular disruptions. For HS-LS1-7, it supports explaining how cells transform matter and energy into usable chemical energy.",
      },
      {
        question: "Is this the same as a full cellular respiration simulation?",
        answer:
          "No. This activity focuses only on ETC and chemiosmosis. A separate cellular-respiration experiment covers the broader pathway context.",
      },
    ],
  },
};
