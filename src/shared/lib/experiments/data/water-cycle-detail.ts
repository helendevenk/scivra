import type { Experiment } from "@/shared/types/experiment";

export const waterCycleDetail: Experiment = {
  id: "water-cycle-detail",
  slug: "water-cycle-detail",
  title: "Water Cycle (Detailed)",
  subtitle: "Evaporation, condensation, precipitation, and groundwater flow",
  description:
    "Explore the complete water cycle with quantitative tracking. Follow water molecules through evaporation, cloud formation, precipitation, surface runoff, infiltration, and groundwater flow. Adjust temperature, humidity, and terrain to see how the water cycle responds to changing conditions.",
  thumbnail: "/imgs/experiments/water-cycle-detail.png",
  standards: { ngss: ["MS-ESS2-4", "HS-ESS2-5"], gcse: [], ap: [] },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: ["water cycle", "evaporation", "precipitation", "groundwater", "condensation", "Earth science"],
  difficulty: "beginner",
  parameters: [
    { id: "temperature", label: "Temperature", unit: "°C", min: -10, max: 40, default: 20, step: 1, tier: "free" },
    { id: "humidity", label: "Humidity", unit: "%", min: 10, max: 100, default: 60, step: 5, tier: "free" },
    { id: "terrain", label: "Terrain (0=flat, 1=mountain, 2=coastal)", unit: "", min: 0, max: 2, default: 1, step: 1, tier: "free" },
  ],
  formulas: [
    { latex: "E \\propto (e_s - e_a) \\cdot v", description: "Evaporation rate depends on saturation deficit and wind speed" },
  ],
  theory: "The water cycle (hydrological cycle) moves water between atmosphere, land, and oceans. Solar energy drives evaporation from water surfaces and transpiration from plants (evapotranspiration). Water vapor rises, cools adiabatically, and condenses into clouds when reaching the dew point. Precipitation occurs when droplets grow large enough to fall. On land, water follows multiple paths: surface runoff into streams and rivers, infiltration into soil, and percolation into groundwater aquifers. Groundwater slowly flows toward discharge points (springs, rivers, oceans). Temperature increases evaporation rates; mountains force orographic lift causing precipitation on windward slopes.",
  instructions: "Watch water particles cycle through the atmosphere and landscape. Adjust temperature to change evaporation rates, humidity to affect cloud formation, and terrain to see orographic effects. Track the water budget in real time.",
  challenges: [
    { id: "wcd-c1", question: "Why does it rain more on the windward side of mountains?", hint: "Air is forced upward (orographic lift), cools adiabatically, reaches dew point, and precipitates. The leeward side gets a rain shadow.", tier: "free" },
    { id: "wcd-c2", question: "If temperature increases by 5°C globally, what happens to evaporation?", hint: "Evaporation increases (warmer air holds more moisture), intensifying the water cycle — more evaporation AND more precipitation", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 15,
  relatedExperiments: ["climate-change-modeling", "ocean-currents"],
  htmlPath: "/experiments/earth-science/water-cycle-detail.html",
  seoTitle: "Water Cycle Detailed Simulation | Scivra Earth Science",
  seoKeywords: ["water cycle simulation", "hydrological cycle interactive", "evaporation condensation", "NGSS Earth science"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Middle School", teaches: "Water Cycle" },
};
