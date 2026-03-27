import type { Experiment } from "@/shared/types/experiment";

export const greenhouseEffect: Experiment = {
  id: "greenhouse-effect",
  slug: "greenhouse-effect",
  title: "Greenhouse Effect",
  subtitle: "Solar radiation, infrared absorption, and global temperature",
  description:
    "Simulate how greenhouse gases trap infrared radiation in Earth's atmosphere. Adjust CO₂ and methane concentrations to observe temperature changes. Watch photon particles bounce between Earth's surface and the atmosphere, and see how energy balance determines global temperature.",
  thumbnail: "/imgs/experiments/greenhouse-effect.png",

  standards: {
    ngss: ["HS-ESS2-4", "HS-ESS3-5", "HS-ESS3-6"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "AP",
  tags: [
    "greenhouse effect",
    "climate change",
    "infrared radiation",
    "CO₂",
    "global warming",
    "Earth Science",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "co2Level",
      label: "CO₂ Concentration",
      unit: "ppm",
      min: 200,
      max: 1000,
      default: 420,
      step: 10,
      tier: "free",
    },
    {
      id: "methaneLevel",
      label: "CH₄ Concentration",
      unit: "ppb",
      min: 500,
      max: 5000,
      default: 1900,
      step: 100,
      tier: "free",
    },
    {
      id: "solarIntensity",
      label: "Solar Intensity",
      unit: "%",
      min: 80,
      max: 120,
      default: 100,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "T_s = T_{\\text{eff}} \\cdot (1 + \\tau)^{1/4}",
      description:
        "Surface temperature depends on effective temperature and atmospheric opacity τ (greenhouse parameter)",
    },
    {
      latex: "T_{\\text{eff}} = \\left(\\frac{S(1-\\alpha)}{4\\sigma}\\right)^{1/4} \\approx 255\\,\\text{K}",
      description:
        "Earth's effective temperature without greenhouse effect: S = solar constant, α = albedo, σ = Stefan-Boltzmann constant",
    },
  ],

  theory:
    "The Sun emits primarily visible light, which passes through Earth's atmosphere and warms the surface. The warm surface radiates infrared (IR) radiation back toward space. Greenhouse gases (CO₂, CH₄, H₂O, N₂O) absorb and re-emit IR in all directions, trapping energy in the lower atmosphere. This natural greenhouse effect raises Earth's average temperature from ~255 K to ~288 K (about +33°C). Increasing CO₂ from pre-industrial 280 ppm to today's 420+ ppm has enhanced this effect, causing ~1.1°C of warming. The relationship is roughly logarithmic: each doubling of CO₂ adds about 3°C (climate sensitivity). Methane is ~80× more potent per molecule but exists in much smaller quantities.",

  instructions:
    "Adjust CO₂ and CH₄ sliders to see how greenhouse gas concentrations affect global temperature. Yellow photons represent incoming solar radiation; red photons represent outgoing infrared. Watch how more greenhouse gas causes more IR photons to be reflected back to the surface. The thermometer shows the resulting surface temperature.",

  challenges: [
    {
      id: "ge-c1",
      question: "What would Earth's temperature be without any greenhouse effect?",
      hint: "About 255 K (-18°C). The natural greenhouse effect adds ~33°C to reach the actual ~288 K (15°C).",
      tier: "free",
    },
    {
      id: "ge-c2",
      question: "If CO₂ doubles from 280 to 560 ppm, approximately how much warming occurs?",
      hint: "Climate sensitivity is approximately 3°C per doubling of CO₂ (range: 2.5-4°C).",
      tier: "free",
    },
    {
      id: "ge-c3",
      question: "Why is methane a stronger greenhouse gas per molecule than CO₂, yet CO₂ gets more attention?",
      hint: "CH₄ is ~80× more potent per molecule (20-year GWP), but CO₂ concentration is ~220× higher and persists for centuries vs. ~12 years for CH₄.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["climate-change-modeling", "atmosphere-layers"],
  htmlPath: "/experiments/earth-science/greenhouse-effect.html",

  seoTitle: "Greenhouse Effect Interactive Simulation | Scivra Earth Science",
  seoKeywords: [
    "greenhouse effect simulation",
    "climate change interactive",
    "CO2 global warming model",
    "infrared radiation absorption",
    "Earth science virtual lab",
    "greenhouse gas simulator",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "The Greenhouse Effect and Climate Change",
  },
};
