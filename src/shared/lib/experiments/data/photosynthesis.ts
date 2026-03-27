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

  seoTitle: "Photosynthesis Light & Calvin Cycle — Interactive 3D | NeonPhysics AP Biology",
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
};
