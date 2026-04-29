import type { Experiment } from "@/shared/types/experiment";

export const msWeatherSystems: Experiment = {
  id: "ms-weather-systems",
  slug: "ms-weather-systems",
  title: "Weather Systems & Atmosphere",
  subtitle: "Air pressure, fronts, cyclones, and precipitation",
  description:
    "Model atmospheric dynamics: watch warm and cold air masses collide to form fronts. See how pressure differences create wind. Track a hurricane developing over warm ocean water. Explore why warm air rises (convection) and how clouds and precipitation form.",
  thumbnail: "/imgs/experiments/ms-weather-systems.png",

  standards: {
    ngss: ["MS-ESS2-5", "MS-ESS2-6", "MS-ESS3-5"],
    gcse: ["P7.1"],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: ["weather", "atmosphere", "air pressure", "fronts", "hurricane", "climate", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "tempDiff",
      label: "Temperature Difference",
      unit: "°C",
      min: 0,
      max: 30,
      default: 15,
      step: 1,
      tier: "free",
    },
    {
      id: "humidity",
      label: "Relative Humidity",
      unit: "%",
      min: 0,
      max: 100,
      default: 60,
      step: 5,
      tier: "free",
    },
    {
      id: "frontType",
      label: "Front Type (0=Cold, 1=Warm, 2=Occluded)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "oceanTemp",
      label: "Ocean Surface Temperature",
      unit: "°C",
      min: 20,
      max: 35,
      default: 27,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "P = \\frac{F}{A} \\quad \\text{High P} \\to \\text{fair} \\quad \\text{Low P} \\to \\text{storms}",
      description: "High pressure = descending air = fair weather; low pressure = rising air = storms",
    },
    {
      latex: "\\text{Cold front: fast, steep} \\quad \\text{Warm front: slow, gentle}",
      description: "Cold fronts produce brief intense rain; warm fronts bring steady drizzle",
    },
  ],

  theory:
    "Weather is driven by unequal heating of Earth's surface and atmosphere. Warm air is less dense and rises (low pressure forms); cool air is denser and sinks (high pressure). These pressure differences drive wind from high to low pressure. Fronts are boundaries between air masses: a cold front occurs when cold, dense air pushes under warm air — causes sharp temperature drops, brief heavy rain. A warm front occurs when warm air glides over cold air — brings slow, steady precipitation. Coriolis effect (Earth's rotation) deflects wind paths, creating the large-scale circulation patterns. Hurricanes form over warm ocean water (≥26°C): warm moist air rises rapidly, condenses, releases latent heat, further driving updrafts in a self-reinforcing cycle.",

  instructions:
    "Set the temperature difference between air masses. Watch how the front develops and what type of precipitation forms. Slide to a Warm Front for slower, gentler rain. Raise Ocean Temperature above 27°C (Pro) to watch a tropical cyclone intensify — see the eye form when it reaches hurricane strength.",

  challenges: [
    {
      id: "wx-ms-c1",
      question: "Why does weather generally move from west to east across the United States?",
      hint: "The Westerlies — prevailing wind patterns at mid-latitudes that blow from west to east. These are caused by the temperature difference between the equator and poles combined with Earth's rotation (Coriolis effect), which deflects air to the right in the Northern Hemisphere.",
      tier: "free",
    },
    {
      id: "wx-ms-c2",
      question: "What causes thunder and lightning during a thunderstorm?",
      hint: "Lightning: electrical charge builds up between cloud and ground (or within clouds) as ice crystals and water droplets collide. When the charge difference is large enough, a rapid electrical discharge (lightning bolt) occurs. Thunder: lightning superheats air to ~30,000°C, causing rapid expansion → shock wave → sound.",
      tier: "free",
    },
    {
      id: "wx-ms-c3",
      question: "Why do tornadoes and hurricanes spin in opposite directions in the Northern vs Southern Hemisphere?",
      hint: "The Coriolis effect (from Earth's rotation) deflects moving air to the right in the Northern Hemisphere and to the left in the Southern Hemisphere. This causes storms to rotate counterclockwise in the North and clockwise in the South.",
      tier: "free",
    },
    {
      id: "wx-ms-c4",
      question: "Why do hurricanes weaken when they move over land or cooler water?",
      hint: "Hurricanes are powered by latent heat from warm, moist ocean water evaporating into the storm system. Over land (no water source) or cooler water (<26°C), evaporation drops dramatically → less latent heat released → the storm engine loses its fuel → weakens rapidly.",
      tier: "pro",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 13,
  relatedExperiments: ["k5-water-cycle", "ms-plate-tectonics"],

  seoTitle: "Weather Systems Middle School | Scivra Earth Science Simulation",
  seoKeywords: [
    "weather systems middle school simulation",
    "air pressure fronts interactive 6-8",
    "hurricane formation simulation",
    "cold warm front weather",
    "atmosphere climate middle school",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Weather Systems and Atmosphere",
  },
};
