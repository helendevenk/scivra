import type { Experiment } from "@/shared/types/experiment";

export const atmosphereLayers: Experiment = {
  id: "atmosphere-layers",
  slug: "atmosphere-layers",
  title: "Atmosphere Layers",
  subtitle: "Temperature, pressure, and composition through the atmosphere",
  description:
    "Explore Earth's atmospheric layers from the troposphere to the exosphere. See how temperature, pressure, and composition change with altitude. Launch a virtual weather balloon and observe conditions at different heights.",
  thumbnail: "/imgs/experiments/atmosphere-layers.png",

  standards: {
    ngss: ["HS-ESS2-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "9-12",
  tags: [
    "atmosphere",
    "troposphere",
    "stratosphere",
    "ozone layer",
    "temperature profile",
    "Earth Science",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "altitude",
      label: "Altitude",
      unit: "km",
      min: 0,
      max: 500,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "showOzone",
      label: "Show Ozone Layer (0=off, 1=on)",
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
      latex: "P(h) = P_0 \\cdot e^{-h/H}",
      description:
        "Barometric formula: pressure decreases exponentially with altitude. H ≈ 8.5 km (scale height)",
    },
    {
      latex: "T(h) = T_0 - \\Gamma \\cdot h",
      description:
        "Troposphere lapse rate: temperature decreases ~6.5°C per km in the troposphere (Γ = lapse rate)",
    },
  ],

  theory:
    "Earth's atmosphere is divided into layers based on temperature changes with altitude. The troposphere (0-12 km) contains 75% of atmospheric mass and all weather; temperature decreases at ~6.5°C/km. The stratosphere (12-50 km) contains the ozone layer (peak at ~25 km) that absorbs UV, warming the air — temperature increases with altitude. The mesosphere (50-85 km) is the coldest layer, where temperature drops again. The thermosphere (85-600 km) absorbs extreme UV and X-rays, reaching >1000°C, but feels cold due to low particle density. Pressure drops exponentially: halving roughly every 5.5 km. At 100 km (Kármán line), space officially begins.",

  instructions:
    "Use the altitude slider to move through the atmosphere. Watch the temperature and pressure gauges change. The diagram highlights which layer you're in and shows key features (ozone layer, weather zone, aurora). The graph on the right plots the temperature profile.",

  challenges: [
    {
      id: "al-c1",
      question: "Why does temperature increase in the stratosphere?",
      hint: "Ozone (O₃) in the stratosphere absorbs UV radiation from the Sun, converting it to heat.",
      tier: "free",
    },
    {
      id: "al-c2",
      question: "At what altitude does atmospheric pressure drop to 50% of sea level?",
      hint: "Using P = P₀ × e^(-h/H) with H = 8.5 km: h = 8.5 × ln(2) ≈ 5.9 km",
      tier: "free",
    },
    {
      id: "al-c3",
      question: "The thermosphere can reach 1500°C, yet satellites don't burn. Why?",
      hint: "Air density is so low (<10⁻¹¹ of sea level) that very few molecules transfer heat. Temperature measures kinetic energy per molecule, not total heat content.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["greenhouse-effect", "climate-change-modeling"],
  htmlPath: "/experiments/earth-science/atmosphere-layers.html",

  seoTitle: "Atmosphere Layers Interactive Diagram | Scivra Earth Science",
  seoKeywords: [
    "atmosphere layers simulation",
    "troposphere stratosphere interactive",
    "atmospheric pressure altitude",
    "ozone layer visualization",
    "Earth science virtual lab",
    "temperature profile atmosphere",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Earth's Atmospheric Layers",
  },
};
