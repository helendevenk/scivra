import type { Experiment } from "@/shared/types/experiment";

export const climateChangeModeling: Experiment = {
  id: "climate-change-modeling",
  slug: "climate-change-modeling",
  title: "Climate Change Modeling",
  subtitle: "Historical temperature trends, CO₂ correlation, and future projections",
  description:
    "Explore 800,000 years of climate data showing the tight correlation between CO₂ levels and global temperature. Toggle between ice-core records and modern instrumental data. Adjust emission scenarios (RCP/SSP) to see projected warming through 2100. Understand feedback loops, tipping points, and the carbon budget.",
  thumbnail: "/imgs/experiments/climate-change-modeling.png",

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
    "climate change",
    "global warming",
    "CO₂ emissions",
    "temperature history",
    "ice cores",
    "RCP scenarios",
    "Earth Science",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "timeRange",
      label: "Time Range",
      unit: "years",
      min: 100,
      max: 800000,
      default: 1000,
      step: 100,
      tier: "free",
    },
    {
      id: "scenario",
      label: "Emission Scenario (SSP)",
      unit: "",
      min: 1,
      max: 4,
      default: 2,
      step: 1,
      tier: "free",
    },
    {
      id: "showCO2",
      label: "Show CO₂ Overlay",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\Delta F = 5.35 \\ln\\left(\\frac{C}{C_0}\\right)",
      description:
        "Radiative forcing from CO₂: C is current concentration, C₀ is pre-industrial (280 ppm). Each doubling adds ~3.7 W/m².",
    },
    {
      latex: "\\Delta T = \\lambda \\cdot \\Delta F, \\quad \\lambda \\approx 0.8\\,\\text{°C/(W/m²)}",
      description:
        "Equilibrium temperature change from radiative forcing, with climate sensitivity parameter λ.",
    },
  ],

  theory:
    "Ice-core records (Vostok, EPICA) show atmospheric CO₂ and temperature have been tightly coupled for 800,000 years, cycling between ~180 ppm (glacials) and ~280 ppm (interglacials). Since industrialization, CO₂ has risen to 420+ ppm — 50% above the highest natural level — driven by fossil fuel combustion and deforestation. The IPCC uses Shared Socioeconomic Pathways (SSPs) to project future warming: SSP1-2.6 (sustainable, ~1.8°C by 2100), SSP2-4.5 (middle of the road, ~2.7°C), SSP3-7.0 (regional rivalry, ~3.6°C), SSP5-8.5 (fossil-fueled, ~4.4°C). Key feedback loops include water vapor (amplifies warming), ice-albedo (less ice → more absorption), and permafrost methane release. The 'carbon budget' for 1.5°C is approximately 500 Gt CO₂ remaining.",

  instructions:
    "Use the time range slider to zoom between recent centuries and deep ice-core history. The red line shows global temperature anomaly; the blue line shows CO₂ concentration. Select different SSP emission scenarios to see projected warming through 2100. Notice how CO₂ and temperature track each other across glacial cycles.",

  challenges: [
    {
      id: "cc-c1",
      question: "Over the past 800,000 years, what was the highest natural CO₂ level, and what is it today?",
      hint: "Natural peaks reached ~280 ppm during interglacials. Today's level is ~420 ppm — 50% higher than any point in 800,000 years.",
      tier: "free",
    },
    {
      id: "cc-c2",
      question: "What is the difference in projected warming between SSP1-2.6 and SSP5-8.5 by 2100?",
      hint: "SSP1-2.6 projects ~1.8°C; SSP5-8.5 projects ~4.4°C. That's about 2.6°C difference, driven entirely by human emission choices.",
      tier: "free",
    },
    {
      id: "cc-c3",
      question: "Why does temperature sometimes appear to lead CO₂ in ice-core records?",
      hint: "Orbital (Milankovitch) cycles initiate warming, which causes oceans to release dissolved CO₂ (solubility decreases with temperature). The released CO₂ then amplifies warming via greenhouse effect — a positive feedback loop.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 30,
  relatedExperiments: ["greenhouse-effect", "atmosphere-layers"],
  htmlPath: "/experiments/earth-science/climate-change-modeling.html",

  seoTitle: "Climate Change Modeling Interactive Simulation | Scivra Earth Science",
  seoKeywords: [
    "climate change simulation",
    "global warming model",
    "CO2 temperature correlation",
    "ice core data interactive",
    "SSP emission scenarios",
    "Earth science virtual lab",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Climate Change Science and Modeling",
  },
};
