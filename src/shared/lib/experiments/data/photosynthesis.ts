import type { Experiment } from "@/shared/types/experiment";

export const photosynthesis: Experiment = {
  id: "photosynthesis",
  slug: "photosynthesis",
  title: "Photosynthesis: Light & Calvin Cycle",
  subtitle: "Capturing sunlight to build sugars",
  description:
    "See photosynthesis unfold inside a chloroplast. Watch photosystems I and II capture photons, split water, and generate ATP and NADPH in the light reactions. Then follow CO₂ through the Calvin cycle as RuBisCO fixes carbon and G3P is assembled into glucose. Adjust light intensity and CO₂ concentration.",
  thumbnail: "/imgs/experiments/photosynthesis.png",

  standards: {
    ngss: ["HS-LS1-5", "HS-LS1-6"],
    gcse: ["B2.3", "B2.4"],
    ap: ["2.A.2", "2.A.3"],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "9-12",
  tags: ["photosynthesis", "Calvin cycle", "chloroplast", "light reactions", "RuBisCO", "AP Biology"],
  difficulty: "advanced",

  parameters: [
    {
      id: "lightIntensity",
      label: "Light Intensity",
      unit: "%",
      min: 0,
      max: 100,
      default: 100,
      step: 1,
      tier: "free",
    },
    {
      id: "co2Concentration",
      label: "CO₂ Concentration",
      unit: "ppm",
      min: 50,
      max: 1500,
      default: 400,
      step: 10,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{light} \\to \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2",
      description: "Overall equation for photosynthesis",
    },
    {
      latex: "\\text{Light reactions: } \\text{H}_2\\text{O} \\xrightarrow{\\text{hν}} \\text{ATP} + \\text{NADPH} + \\text{O}_2",
      description: "Light reactions split water, produce ATP and NADPH",
    },
    {
      latex: "3\\text{CO}_2 + 9\\text{ATP} + 6\\text{NADPH} \\to \\text{G3P} \\xrightarrow{} \\text{glucose}",
      description: "Calvin cycle: 3 CO₂ → 1 G3P (requires 9 ATP + 6 NADPH)",
    },
  ],

  theory:
    "Photosynthesis occurs in two stages within chloroplasts. Light Reactions (thylakoid membranes): Photosystem II absorbs light at 680 nm and splits water (photolysis), releasing O₂ and electrons. Electrons flow through the ETC (plastoquinone, cytochrome b6f, plastocyanin) to Photosystem I (700 nm), reducing NADP⁺ to NADPH. The proton gradient drives ATP synthase (photophosphorylation). The Calvin Cycle (stroma): RuBisCO fixes CO₂ onto RuBP (5C) to form 3-PGA (3C). ATP and NADPH from light reactions reduce 3-PGA to G3P. Every 3 turns fix 3 CO₂, producing 1 net G3P. Two G3P form glucose. Limiting factors: light intensity, CO₂ concentration, and temperature each limit the rate.",

  instructions:
    "Use the Light Intensity slider to change photon input from darkness to full sunlight, and use the CO₂ Concentration slider to change Calvin cycle substrate availability from 50 to 1500 ppm. Try all five preset buttons — Full Sunlight, Low Light, High CO₂, Dark Reaction, and Compensation Pt — to compare light-limited, CO₂-limited, dark, and balanced photosynthesis conditions.",

  challenges: [
    {
      id: "pho-c1",
      question: "Which gas is produced in the light reactions and where does it come from?",
      hint: "O₂ is produced from the splitting (photolysis) of water in Photosystem II.",
      tier: "free",
    },
    {
      id: "pho-c2",
      question: "How many turns of the Calvin cycle are needed to produce one glucose molecule?",
      hint: "Each turn fixes 1 CO₂. Glucose (C6) needs 6 CO₂, so 6 turns. But producing 1 net G3P takes 3 turns; glucose needs 2 G3P = 6 turns total.",
      tier: "free",
    },
    {
      id: "pho-c3",
      question: "A plant is exposed to increasing light intensity. At what point does the rate of photosynthesis stop increasing?",
      hint: "The light saturation point — after this, CO₂ fixation (Calvin cycle) or RuBisCO becomes the limiting factor, not light.",
      tier: "free",
    },
    {
      id: "pho-c4",
      question: "Herbicide DCMU blocks plastoquinone in the ETC. Predict its effects on: (a) O₂ production, (b) ATP synthesis, (c) NADPH production, (d) Calvin cycle activity.",
      hint: "DCMU stops electron flow after PSII. (a) O₂ still produced (PSII works), (b) ATP drops (no proton gradient from ETC), (c) NADPH drops (PSI starved), (d) Calvin cycle halts without ATP and NADPH.",
      tier: "pro",
    },
  ],

  wave: 3,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["cellular-respiration", "enzyme-kinetics"],

  seoTitle: "Photosynthesis Light & Calvin Cycle — Interactive 3D | Scivra AP Biology",
  seoKeywords: [
    "photosynthesis simulation",
    "Calvin cycle interactive",
    "chloroplast animation",
    "light reactions biology",
    "AP Biology photosynthesis",
    "RuBisCO carbon fixation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Photosynthesis: Light Reactions and Calvin Cycle",
  },
  htmlControlAliases: { lightIntensity: "sl-light", co2Concentration: "sl-co2" },
  presets: [
    {
      id: "applyPreset:full",
      label: "1 Full Sunlight",
      description: "Sets light to 100% and CO₂ to 400 ppm so students can observe high light-reaction activity under ordinary atmospheric carbon dioxide.",
      paramValues: { lightIntensity: 100, co2Concentration: 400 },
    },
    {
      id: "applyPreset:shade",
      label: "2 Low Light",
      description: "Sets light to 10% and CO₂ to 400 ppm to show a light-limited plant with reduced photon absorption and lower oxygen output.",
      paramValues: { lightIntensity: 10, co2Concentration: 400 },
    },
    {
      id: "applyPreset:highco2",
      label: "3 High CO₂",
      description: "Sets light to 100% and CO₂ to 1500 ppm so students can compare carbon-fixation capacity when light is abundant.",
      paramValues: { lightIntensity: 100, co2Concentration: 1500 },
    },
    {
      id: "applyPreset:dark",
      label: "4 Dark Reaction",
      description: "Sets light to 0% and CO₂ to 400 ppm to demonstrate that the light reactions stop without photons even when carbon dioxide is available.",
      paramValues: { lightIntensity: 0, co2Concentration: 400 },
    },
    {
      id: "applyPreset:compensation",
      label: "5 Compensation Pt",
      description: "Sets light to 25% and CO₂ to 200 ppm to model the compensation point where photosynthesis and respiration are approximately balanced.",
      paramValues: { lightIntensity: 25, co2Concentration: 200 },
    },
  ],

  contentSections: {
    whatIsIt:
      "Photosynthesis is how plants, algae, and cyanobacteria turn sunlight into food. The summary equation is 6 CO2 + 6 H2O + light → C6H12O6 + 6 O2, but the actual chemistry runs in two stages. The light reactions (in the thylakoid membrane) capture photons, split water, build NADPH, and pump protons to drive ATP synthesis. The Calvin cycle (in the stroma) uses that NADPH and ATP to fix CO2 into G3P sugars via RuBisCO. The oxygen we breathe is a byproduct of the water-splitting step. In this lab, change light intensity, temperature, and wavelength and watch the photosynthesis rate climb, plateau, and crash.",
    parameterExplanations: {
      lightIntensity:
        "Light Intensity sets the percentage of available sunlight reaching the chloroplast model. At low values, photons are the limiting resource: photosystem II and photosystem I cannot excite electrons quickly enough, so O2 output, ATP production, and NADPH production all fall. As the slider approaches full sunlight, the light reactions can run near capacity and the Calvin cycle receives more chemical energy. The response is not unlimited. Once light is abundant, CO2 availability and downstream carbon fixation determine how much extra light can actually increase sugar production. Use the Low Light, Full Sunlight, Dark Reaction, and Compensation Pt presets to separate photon limitation from carbon limitation.",
      co2Concentration:
        "CO2 Concentration controls how much carbon dioxide is available for RuBisCO to fix in the Calvin cycle. When CO2 is low, the light reactions may still produce ATP and NADPH, but carbon fixation cannot keep pace because there is not enough substrate entering the cycle. Raising CO2 can increase the Calvin cycle rate when light is already available, which is why the High CO2 preset is useful for comparing carbon limitation against Full Sunlight. The effect also has a ceiling: once the cycle is supplied faster than the model can process carbon, more CO2 produces less additional gain. Compare this slider with Light Intensity to identify the current limiting factor.",
    },
    misconceptions: [
      {
        wrong:
          "Plants take in CO2 and exhale O2; that's the opposite of breathing.",
        correct:
          "Plants do photosynthesis (CO2 in, O2 out) AND cellular respiration (O2 in, CO2 out). During the day photosynthesis dominates, so the net flux is CO2 in. At night they only respire. Net oxygen production is the difference.",
      },
      {
        wrong:
          "The oxygen released in photosynthesis comes from CO2.",
        correct:
          "It comes from H2O. The water-splitting reaction at photosystem II is what releases O2. CO2 contributes its carbon and oxygen to the sugar, but the gaseous O2 is from water. Marcus Calvin and others proved this with isotope-labeled water.",
      },
      {
        wrong:
          "Plants don't grow in the dark because they need light to live.",
        correct:
          "Plants need light to make food, not to live moment-to-moment. They store sugars during the day and respire them at night just like we do. Etiolated seedlings can grow in the dark — they just consume their stored energy until light arrives or they starve.",
      },
      {
        wrong:
          "More light means more photosynthesis, always.",
        correct:
          "Up to a point. Past the light saturation point, adding more photons doesn't speed up the rate because the enzymes downstream (RuBisCO, ATP synthase) are already running at capacity. Even more extreme light can damage photosynthetic machinery (photoinhibition).",
      },
    ],
    teacherUseCases: [
      "Limiting factor exploration: hold CO2 Concentration fixed, sweep Light Intensity from dark to full sunlight, and have students identify where light stops being the main constraint.",
      "Carbon availability comparison: keep Light Intensity at 100%, compare Full Sunlight and High CO2, then ask students to explain why Calvin cycle output can change even when photon input stays constant.",
      "Preset station rotation: assign groups Full Sunlight, Low Light, High CO2, Dark Reaction, and Compensation Pt, then have each group record slider values and explain the limiting factor in its case.",
      "Day/night accounting: compare Full Sunlight and Dark Reaction, then ask students to compute or sketch how net oxygen production changes between daylight and darkness.",
      "Calvin cycle bookkeeping: use the CO2 Concentration slider to discuss carbon input, then ask students to track how many CO2 molecules must be fixed to produce one G3P molecule.",
    ],
    faq: [
      {
        question: "Where do the light reactions and Calvin cycle happen?",
        answer:
          "Light reactions: across the thylakoid membrane inside the chloroplast (the stacked grana). Calvin cycle: in the stroma (the fluid surrounding the thylakoids). Both inside the chloroplast — but in different compartments, just like cellular respiration is split between the matrix and the inner membrane in mitochondria.",
      },
      {
        question: "Why are most plants green?",
        answer:
          "Chlorophyll absorbs primarily red (~660 nm) and blue (~430 nm) light. Green wavelengths (~550 nm) are mostly reflected back — and that reflected green light is what reaches our eyes. So plants are green because green is the color they don't use efficiently.",
      },
      {
        question: "What's the role of NADPH and ATP in the Calvin cycle?",
        answer:
          "NADPH carries reducing power (electrons) and ATP carries chemical energy, both produced by the light reactions. The Calvin cycle uses 9 ATP and 6 NADPH per G3P molecule made from 3 CO2 — that's the price tag of fixing carbon.",
      },
      {
        question: "Why don't plants photosynthesize at night?",
        answer:
          "No photons, no light reactions. Without ATP and NADPH from the light side, the Calvin cycle has no fuel and stops. Plants do continue cellular respiration at night using the sugars they stored during the day. CAM and C4 plants use clever workarounds, but standard C3 plants strictly need daylight.",
      },
      {
        question: "How does this connect to AP Biology?",
        answer:
          "AP Bio Big Idea 2 (Energetics) covers photosynthesis as the photosynthetic complement to cellular respiration. Students should know the two stages, where they happen, how the light reactions supply ATP and NADPH, and how light intensity and CO2 availability can independently limit photosynthetic rate. This lab supports learning objective 2.A.1.",
      },
    ],
  },
};
