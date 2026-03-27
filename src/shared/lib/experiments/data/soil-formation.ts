import type { Experiment } from "@/shared/types/experiment";

export const soilFormation: Experiment = {
  id: "soil-formation",
  slug: "soil-formation",
  title: "Soil Formation",
  subtitle: "From bedrock to topsoil — the five factors of soil development",
  description:
    "Explore how soil forms through the interaction of parent material, climate, organisms, topography, and time. An interactive soil profile cross-section shows the O, A, B, C, and R horizons. Adjust weathering rate, precipitation, and biological activity to observe how each factor influences soil depth, composition, and color over geological time.",
  thumbnail: "/imgs/experiments/soil-formation.png",

  standards: {
    ngss: ["MS-ESS2-2", "MS-ESS3-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: [
    "soil formation",
    "soil horizons",
    "weathering",
    "pedogenesis",
    "soil profile",
    "erosion",
    "Earth Science",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "weatheringRate",
      label: "Weathering Rate",
      unit: "mm/yr",
      min: 0.01,
      max: 2,
      default: 0.5,
      step: 0.01,
      tier: "free",
    },
    {
      id: "precipitation",
      label: "Precipitation",
      unit: "cm/yr",
      min: 10,
      max: 300,
      default: 80,
      step: 10,
      tier: "free",
    },
    {
      id: "bioActivity",
      label: "Bio Activity",
      unit: "%",
      min: 0,
      max: 100,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "timeScale",
      label: "Time",
      unit: "kyr",
      min: 0.1,
      max: 100,
      default: 10,
      step: 0.1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "S = f(Cl, O, R, P, T)",
      description:
        "Jenny's state factor equation: soil (S) is a function of climate (Cl), organisms (O), relief/topography (R), parent material (P), and time (T).",
    },
    {
      latex: "\\text{Depth} \\propto \\sqrt{\\text{time} \\times \\text{weathering rate}}",
      description:
        "Soil depth increases roughly as the square root of time, reflecting diminishing returns as the weathering front deepens away from surface energy inputs.",
    },
  ],

  theory:
    "Soil formation (pedogenesis) transforms bedrock and sediment into layered soil profiles through physical, chemical, and biological weathering. The soil profile consists of distinct horizons: O (organic litter), A (topsoil, rich in humus), B (subsoil, accumulated minerals from leaching), C (weathered parent material), and R (bedrock). Five factors control soil development: (1) Parent material — the original rock or sediment determines mineral composition. (2) Climate — temperature and precipitation drive chemical weathering rates; tropical soils are deeply weathered while desert soils are thin. (3) Organisms — roots break rock, earthworms mix organic matter, bacteria decompose material. (4) Topography — steep slopes lose soil to erosion while valleys accumulate it. (5) Time — mature soils take thousands of years to develop distinct horizons. Soil is a non-renewable resource on human timescales — it takes ~500 years to form 2 cm of topsoil.",

  instructions:
    "Adjust the weathering rate, precipitation, and biological activity sliders to see how each factor affects the soil profile. Use the time slider to fast-forward through soil development. Click on any horizon layer for details about its composition and formation process.",

  challenges: [
    {
      id: "sf-c1",
      question: "Why is soil considered a non-renewable resource?",
      hint: "It takes roughly 500-1000 years to form just 2 cm of topsoil. Human agriculture can erode soil 10-100× faster than it forms, making it effectively non-renewable on human timescales.",
      tier: "free",
    },
    {
      id: "sf-c2",
      question: "How does climate affect the type of soil that forms?",
      hint: "Tropical climates with high temperature and rainfall produce deeply weathered, nutrient-poor laterite soils. Arid climates produce thin, mineral-rich soils with caliche layers. Temperate climates produce moderate, fertile soils ideal for agriculture.",
      tier: "free",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["rock-cycle", "glaciers-ice-ages"],
  htmlPath: "/experiments/earth-science/soil-formation.html",

  seoTitle: "Soil Formation Interactive Simulation | Scivra Earth Science",
  seoKeywords: [
    "soil formation simulation",
    "soil horizons interactive",
    "pedogenesis",
    "weathering simulation",
    "Earth science virtual lab",
    "NGSS ESS2",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Soil Formation and the Five Soil-Forming Factors",
  },
};
