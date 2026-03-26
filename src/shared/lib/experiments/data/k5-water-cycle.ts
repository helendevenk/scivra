import type { Experiment } from "@/shared/types/experiment";

export const k5WaterCycle: Experiment = {
  id: "k5-water-cycle",
  slug: "k5-water-cycle",
  title: "The Water Cycle",
  subtitle: "Evaporation, condensation, and precipitation",
  description:
    "Follow water molecules as they travel through the water cycle. Heat the sun to drive evaporation from oceans and lakes. Watch water vapor rise and cool to form clouds. See precipitation fall as rain or snow. Discover how water is constantly recycled through Earth's systems.",
  thumbnail: "/imgs/experiments/k5-water-cycle.png",

  standards: {
    ngss: ["2-ESS2-3", "5-ESS2-1", "MS-ESS2-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "3-5",
  tags: ["water cycle", "evaporation", "condensation", "precipitation", "cloud", "earth science", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "sunIntensity",
      label: "Sun Intensity",
      unit: "%",
      min: 0,
      max: 100,
      default: 70,
      step: 5,
      tier: "free",
    },
    {
      id: "temperature",
      label: "Air Temperature",
      unit: "°C",
      min: -10,
      max: 40,
      default: 20,
      step: 2,
      tier: "free",
    },
    {
      id: "cloudHeight",
      label: "Cloud Formation Height",
      unit: "km",
      min: 1,
      max: 10,
      default: 3,
      step: 0.5,
      tier: "pro",
    },
    {
      id: "precipitation",
      label: "Precipitation Type (0=Rain, 1=Snow)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\text{Evaporation} \\xrightarrow{\\text{heat}} \\text{Water Vapor} \\xrightarrow{\\text{cool}} \\text{Clouds} \\xrightarrow{\\text{precipitation}} \\text{Rain/Snow}",
      description: "The four stages of the water cycle",
    },
  ],

  theory:
    "The water cycle (hydrological cycle) describes how water continuously moves through Earth's systems. Evaporation: the sun heats surface water, causing it to change from liquid to gas (water vapor) and rise into the atmosphere. Transpiration: plants release water vapor through their leaves. Condensation: as water vapor rises, it cools and condenses around tiny particles to form clouds (liquid water droplets). Precipitation: when cloud droplets combine and grow heavy enough, they fall as rain or snow. Collection: water collects in oceans, lakes, rivers, and groundwater. The cycle then repeats. The water on Earth today is the same water that has always been here — constantly recycled.",

  instructions:
    "Increase the Sun Intensity to watch water molecules evaporate from the ocean. Watch them rise and condense to form clouds. Adjust the Air Temperature — cooler temperatures create snow instead of rain. Track individual water molecules as they complete the full cycle.",

  challenges: [
    {
      id: "wc-c1",
      question: "Name the four main stages of the water cycle in order.",
      hint: "1) Evaporation (water → vapor from sun's heat), 2) Condensation (vapor → clouds as it cools), 3) Precipitation (rain/snow falls), 4) Collection (flows to oceans/lakes/groundwater), then repeats.",
      tier: "free",
    },
    {
      id: "wc-c2",
      question: "Why do deserts receive little rain even though the sun is strong there?",
      hint: "Rain requires moist air — water vapor must be present to condense. Deserts have dry air (little water vapor), so even though there is evaporation, there is not enough moisture for precipitation. Dry air masses don't form rain clouds.",
      tier: "free",
    },
    {
      id: "wc-c3",
      question: "What is transpiration? How does it contribute to the water cycle?",
      hint: "Transpiration is water vapor released by plants through tiny pores (stomata) in their leaves. It adds water vapor to the atmosphere, contributing to cloud formation. Rainforests transpire so much that they create their own local rain patterns.",
      tier: "free",
    },
    {
      id: "wc-c4",
      question: "How does the water cycle affect global climate regulation?",
      hint: "Water carries enormous amounts of heat energy (latent heat of evaporation = 2.26 MJ/kg). Evaporation cools surfaces; condensation releases heat in the atmosphere. Ocean currents transport heat globally. Without the water cycle, Earth's temperature differences would be extreme.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-day-night-seasons", "k5-food-chain"],

  seoTitle: "Water Cycle Simulation for Kids | NeonPhysics Elementary Earth Science",
  seoKeywords: [
    "water cycle kids simulation",
    "evaporation condensation interactive",
    "precipitation earth science elementary",
    "K-5 earth science water",
    "hydrological cycle kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "The Water Cycle",
  },
};
