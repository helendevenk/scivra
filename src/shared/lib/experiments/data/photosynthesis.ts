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
      unit: "μmol photons/m²/s",
      min: 0,
      max: 2000,
      default: 500,
      step: 100,
      tier: "free",
    },
    {
      id: "co2Concentration",
      label: "CO₂ Concentration",
      unit: "ppm",
      min: 100,
      max: 1500,
      default: 400,
      step: 50,
      tier: "free",
    },
    {
      id: "temperature",
      label: "Temperature",
      unit: "°C",
      min: 5,
      max: 45,
      default: 25,
      step: 1,
      tier: "pro",
    },
    {
      id: "wavelength",
      label: "Light Wavelength",
      unit: "nm",
      min: 400,
      max: 700,
      default: 680,
      step: 10,
      tier: "pro",
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
    "Adjust light intensity and watch photon absorption rates change in both photosystems. See O₂ bubbles from water splitting. Switch to the Calvin Cycle view to track CO₂ fixation by RuBisCO. Use the wavelength slider (Pro) to see the absorption spectrum — why red (680 nm) and blue (450 nm) are most effective, and why green is reflected.",

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

  contentSections: {
    whatIsIt:
      "Photosynthesis is how plants, algae, and cyanobacteria turn sunlight into food. The summary equation is 6 CO2 + 6 H2O + light → C6H12O6 + 6 O2, but the actual chemistry runs in two stages. The light reactions (in the thylakoid membrane) capture photons, split water, build NADPH, and pump protons to drive ATP synthesis. The Calvin cycle (in the stroma) uses that NADPH and ATP to fix CO2 into G3P sugars via RuBisCO. The oxygen we breathe is a byproduct of the water-splitting step. In this lab, change light intensity, temperature, and wavelength and watch the photosynthesis rate climb, plateau, and crash.",
    parameterExplanations: {
      lightIntensity:
        "Photons per second hitting the leaf. Low light is the limiting factor — rate climbs linearly. Past a saturation point, other steps (CO2 fixation, enzyme speed) become limiting and rate plateaus.",
      co2Concentration:
        "Substrate for the Calvin cycle. Atmospheric CO2 today is ~420 ppm. Below this, the rate is CO2-limited even with bright light; well above ~1000 ppm, RuBisCO saturates. Greenhouse growers boost CO2 to ~1200 ppm to push the rate up.",
      temperature:
        "Affects the enzymes of the Calvin cycle. Below ~10°C, RuBisCO is sluggish; around 25-35°C is optimal; above ~40°C enzymes start to denature and rate falls. Classic enzyme-temperature curve.",
      wavelength:
        "Color of light. Chlorophyll a/b absorb best in red (~660 nm) and blue (~430 nm). Green wavelengths (~550 nm) are mostly reflected — that's why leaves look green. Try sweeping wavelength to recreate the absorption spectrum.",
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
      "Limiting factor exploration: hold all parameters fixed except light, sweep light intensity, and have students identify the saturation point. Repeat with temperature and CO2 (or wavelength).",
      "Wavelength scan: have students predict which wavelengths drive the highest rate, then sweep wavelength and reproduce the absorption spectrum of chlorophyll.",
      "Day/night accounting: ask students to compute net oxygen produced over 24 hours given a light intensity profile (high during day, zero at night) and the plant's respiration rate.",
      "Calvin cycle bookkeeping: pause and ask students to track how many CO2 molecules need to fix to produce one G3P molecule, then verify with the simulation's molecule counter.",
      "Climate-change connection: discuss how rising CO2 would increase photosynthesis (in the lab, raising the saturation level) and how higher temperatures could push past the optimum and reduce yield.",
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
          "AP Bio Big Idea 2 (Energetics) covers photosynthesis as the photosynthetic complement to cellular respiration. Students should know the two stages, where they happen, the role of pigments, and the limiting factors of light intensity, CO2, and temperature. This lab supports learning objective 2.A.1.",
      },
    ],
  },
};
