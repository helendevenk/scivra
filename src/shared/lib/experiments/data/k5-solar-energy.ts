import type { Experiment } from "@/shared/types/experiment";

export const k5SolarEnergy: Experiment = {
  id: "k5-solar-energy",
  slug: "k5-solar-energy",
  title: "Solar Energy",
  subtitle: "Learn how sunlight becomes heat and electricity",
  description:
    "Discover how energy from the Sun powers our world. Aim a solar panel at the sunlight and watch it generate electricity to power a light bulb. Experiment with different panel angles to find the position that captures the most energy. See how dark surfaces absorb more heat from sunlight than light surfaces. Understand why solar energy is a clean, renewable resource.",
  thumbnail: "/imgs/experiments/k5-solar-energy.png",

  standards: {
    ngss: ["4-PS3-2", "4-ESS3-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "3-5",
  tags: [
    "solar energy",
    "sunlight",
    "renewable energy",
    "solar panel",
    "heat",
    "electricity",
    "elementary",
    "K-5",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "panelAngle",
      label: "Solar Panel Angle",
      unit: "°",
      min: 0,
      max: 90,
      default: 45,
      step: 5,
      tier: "free",
    },
    {
      id: "sunIntensity",
      label: "Sun Intensity",
      unit: "%",
      min: 10,
      max: 100,
      default: 80,
      step: 5,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex:
        "\\text{Energy Collected} = \\text{Sunlight} \\times \\cos(\\theta)",
      description:
        "A solar panel collects the most energy when it faces the Sun directly (angle = 0°); tilting it away reduces the energy captured",
    },
  ],

  theory:
    "The Sun is Earth's primary source of energy. Sunlight carries energy that can be converted into heat and electricity. Solar panels (photovoltaic cells) contain special materials that release electrons when sunlight hits them, creating an electric current — this is how sunlight becomes electricity. The angle of the solar panel matters: when the panel faces the Sun directly, it captures the maximum amount of light. Tilting it away means less light hits the surface, just like how a flashlight shining straight down makes a bright circle, but shining it at an angle spreads the light over a larger area making it dimmer. Solar energy is renewable — the Sun will keep shining for billions of years. Dark-colored objects absorb more solar energy as heat than light-colored objects, which is why wearing a black shirt on a sunny day feels hotter.",

  instructions:
    "Adjust the Solar Panel Angle to find the best position for capturing sunlight. Watch the energy meter to see how much electricity is generated. Change the Sun Intensity to simulate cloudy and sunny days. Notice how the light bulb glows brighter when the panel captures more energy.",

  challenges: [
    {
      id: "se-c1",
      question:
        "At what angle does the solar panel produce the most electricity? Why?",
      hint: "The panel produces the most electricity when it faces the Sun directly (perpendicular to the sunlight). At this angle, the maximum amount of light hits the panel surface. As you tilt the panel away, sunlight spreads across a larger area and less energy is captured per square centimeter.",
      tier: "free",
    },
    {
      id: "se-c2",
      question:
        "Why is solar energy called a 'renewable' energy source? Name one advantage and one challenge of using solar panels.",
      hint: "Solar energy is renewable because the Sun continuously produces light — it will not run out for billions of years (unlike coal or oil which are limited). Advantage: solar energy is clean and produces no pollution. Challenge: solar panels only work well during daytime and sunny weather, so energy storage (batteries) is needed for nighttime.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-light-interactions", "greenhouse-effect"],

  htmlPath: "/experiments/elementary/k5-solar-energy.html",

  seoTitle:
    "Solar Energy Simulation for Kids | Scivra Elementary Physics",
  seoKeywords: [
    "solar energy kids simulation",
    "solar panel interactive elementary",
    "renewable energy K-5 science",
    "sunlight to electricity for kids",
    "solar power experiment",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Solar Energy, Heat, and Electricity from Sunlight",
  },
};
