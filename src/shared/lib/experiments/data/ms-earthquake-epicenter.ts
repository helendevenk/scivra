import type { Experiment } from "@/shared/types/experiment";

export const msEarthquakeEpicenter: Experiment = {
  id: "ms-earthquake-epicenter",
  slug: "ms-earthquake-epicenter",
  title: "Earthquake Epicenter",
  subtitle: "Use seismic wave data to triangulate earthquake locations",
  description:
    "Become a seismologist and locate an earthquake's epicenter using data from three seismic stations. Analyze the time delay between P-waves and S-waves to calculate distance, draw circles on a map, and find where they intersect. Adjust wave speeds and station positions to understand how real earthquake monitoring works.",
  thumbnail: "/imgs/experiments/ms-earthquake-epicenter.png",

  standards: {
    ngss: ["MS-ESS2-2", "MS-ESS3-2"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: ["earthquake", "seismic waves", "triangulation", "epicenter", "P-waves", "S-waves", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "waveSpeed",
      label: "P-Wave Speed",
      unit: "km/s",
      min: 4.0,
      max: 8.0,
      default: 6.0,
      step: 0.5,
      tier: "free",
    },
    {
      id: "stationCount",
      label: "Seismic Stations",
      unit: "",
      min: 2,
      max: 6,
      default: 3,
      step: 1,
      tier: "free",
    },
    {
      id: "depth",
      label: "Earthquake Depth",
      unit: "km",
      min: 0,
      max: 300,
      default: 10,
      step: 5,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "d = \\Delta t \\times \\frac{v_P \\times v_S}{v_P - v_S}",
      description: "Distance to epicenter from the time delay between P-wave and S-wave arrivals at a station",
    },
    {
      latex: "\\text{3 circles} \\to \\text{1 intersection point} = \\text{epicenter}",
      description: "Triangulation: draw a circle of calculated radius around each station — the epicenter is where all three circles meet",
    },
  ],

  theory:
    "Earthquakes generate two main types of body waves. P-waves (primary, compressional) travel fastest — about 6 km/s through Earth's crust — and arrive at seismic stations first. S-waves (secondary, shear) travel slower — about 3.5 km/s — and arrive after. The farther you are from the earthquake, the bigger the time gap between P and S arrivals. By measuring this time delay at a single station, you can calculate the distance to the epicenter, but not the direction. With two stations you narrow it to two possible points. With three or more stations, you can pinpoint the exact location — this is triangulation. Each station draws a circle on the map with radius equal to its calculated distance. The unique point where all circles intersect is the epicenter. Real seismological networks use hundreds of stations and computers to locate earthquakes within seconds. Earthquake depth (shallow vs. deep) also affects wave behavior and damage patterns — shallow quakes under 70 km cause the most surface damage.",

  instructions:
    "The map shows seismic stations (triangles) and a hidden earthquake epicenter. When the quake occurs, watch P-waves and S-waves ripple outward at different speeds. Read the arrival time difference at each station and use the formula to calculate distance. The simulation draws a circle around each station — find where the circles intersect to locate the epicenter. Adjust depth to see how it changes wave travel times.",

  challenges: [
    {
      id: "eq-ms-c1",
      question: "Station A records the P-wave at 10:00:00 and the S-wave at 10:00:24. If P-waves travel at 6 km/s and S-waves at 3.5 km/s, how far is Station A from the epicenter?",
      hint: "Using d = Δt × (vP × vS)/(vP - vS): d = 24 s × (6 × 3.5)/(6 - 3.5) = 24 × 21/2.5 = 24 × 8.4 = 201.6 km. Station A is about 202 km from the epicenter. The larger the time gap, the farther away you are.",
      tier: "free",
    },
    {
      id: "eq-ms-c2",
      question: "Why do you need at least 3 seismic stations to pinpoint an epicenter? What happens with only 2?",
      hint: "One station gives you distance but not direction — the epicenter could be anywhere on a circle around that station. Two stations give two circles that intersect at two points — you know it's one of them but can't tell which. Three stations give three circles that have only one common intersection point — that's the epicenter. More stations improve accuracy by averaging out measurement errors.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["seismic-waves", "plate-tectonics-advanced"],

  htmlPath: "/experiments/middle/ms-earthquake-epicenter.html",

  seoTitle: "Earthquake Epicenter Triangulation Simulation | Scivra Middle School Earth Science",
  seoKeywords: [
    "earthquake epicenter triangulation simulation",
    "seismic waves P-wave S-wave interactive",
    "locate earthquake middle school activity 6-8",
    "seismology station triangulation",
    "NGSS MS-ESS2-2 earth science",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Earthquake Epicenter Location Using Seismic Wave Triangulation",
  },
};
