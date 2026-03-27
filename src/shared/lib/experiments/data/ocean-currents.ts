import type { Experiment } from "@/shared/types/experiment";

export const oceanCurrents: Experiment = {
  id: "ocean-currents",
  slug: "ocean-currents",
  title: "Ocean Currents",
  subtitle: "Global thermohaline circulation and surface wind-driven currents",
  description:
    "Visualize global ocean circulation patterns driven by wind, temperature, and salinity differences. Observe surface currents like the Gulf Stream and deep thermohaline circulation (the global conveyor belt). Adjust water temperature, salinity, and wind patterns to see how currents form, interact, and redistribute heat across the planet.",
  thumbnail: "/imgs/experiments/ocean-currents.png",

  standards: {
    ngss: ["MS-ESS2-6", "HS-ESS2-5"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: [
    "ocean currents",
    "thermohaline circulation",
    "Gulf Stream",
    "Coriolis effect",
    "global conveyor belt",
    "Earth science",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "windStrength",
      label: "Wind Strength",
      unit: "%",
      min: 0,
      max: 100,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "tempDiff",
      label: "Equator-Pole Temp Difference",
      unit: "°C",
      min: 5,
      max: 40,
      default: 25,
      step: 1,
      tier: "free",
    },
    {
      id: "salinity",
      label: "Polar Salinity",
      unit: "ppt",
      min: 30,
      max: 40,
      default: 35,
      step: 0.5,
      tier: "free",
    },
    {
      id: "particleCount",
      label: "Particle Density",
      unit: "",
      min: 100,
      max: 2000,
      default: 800,
      step: 100,
      tier: "free",
    },
    {
      id: "showLabels",
      label: "Show Current Labels (0=off, 1=on)",
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
      latex: "\\rho = \\rho_0(1 - \\alpha(T - T_0) + \\beta(S - S_0))",
      description:
        "Seawater density depends on temperature T (warmer = less dense) and salinity S (saltier = denser)",
    },
    {
      latex: "F_{\\text{Coriolis}} = -2m\\vec{\\Omega} \\times \\vec{v}",
      description:
        "Coriolis force deflects moving water right in Northern Hemisphere, left in Southern",
    },
  ],

  theory:
    "Ocean currents are driven by two main mechanisms: wind (surface currents) and density differences (deep thermohaline circulation). Trade winds and westerlies push surface water, while the Coriolis effect deflects currents to the right in the Northern Hemisphere and left in the Southern. This creates circular gyres — clockwise in the north, counterclockwise in the south. Western boundary currents (like the Gulf Stream) are narrow, deep, and fast; eastern boundary currents are broad, shallow, and slow. Thermohaline circulation is driven by cold, salty water sinking in polar regions (high density) and warm water rising near the equator. This 'global conveyor belt' takes about 1000 years for a complete cycle and redistributes heat globally, moderating climate. Changes in thermohaline circulation (e.g., from melting ice reducing salinity) can have dramatic climate effects.",

  instructions:
    "Watch particles trace ocean current paths across a simplified world map. Adjust wind strength to see how surface currents change. Modify the temperature difference and polar salinity to observe thermohaline circulation effects. Toggle labels to identify major current systems.",

  challenges: [
    {
      id: "oc-c1",
      question: "Why is the Gulf Stream a warm current flowing northward along the US East Coast?",
      hint: "Warm equatorial water is pushed westward by trade winds, piles up in the Caribbean, and flows north along the coast as a western boundary current",
      tier: "free",
    },
    {
      id: "oc-c2",
      question: "What would happen to thermohaline circulation if polar ice melted rapidly?",
      hint: "Fresh meltwater reduces salinity, lowering density. If polar water isn't dense enough to sink, the conveyor belt slows or shuts down, disrupting global heat distribution",
      tier: "free",
    },
    {
      id: "oc-c3",
      question: "Why are western boundary currents (Gulf Stream, Kuroshio) faster than eastern boundary currents?",
      hint: "The Coriolis effect and the westward intensification of ocean gyres compress currents against western continental margins, making them narrower and faster",
      tier: "pro",
    },
  ],

  wave: 12,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["climate-change-modeling", "atmosphere-layers"],
  htmlPath: "/experiments/earth-science/ocean-currents.html",

  seoTitle: "Ocean Currents Simulation | Scivra Earth Science",
  seoKeywords: [
    "ocean currents simulation",
    "thermohaline circulation interactive",
    "Gulf Stream visualization",
    "global conveyor belt",
    "NGSS Earth science",
    "Coriolis effect ocean",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Ocean Currents and Thermohaline Circulation",
  },
};
