import type { Experiment } from "@/shared/types/experiment";

export const solarSystemScale: Experiment = {
  id: "solar-system-scale",
  slug: "solar-system-scale",
  title: "Solar System Scale",
  subtitle: "True distances and sizes of planets in perspective",
  description:
    "Visualize the enormous scale of our solar system. If the Sun were a basketball, how far away would Earth be? Zoom between size-accurate and distance-accurate views to grasp why space is mostly empty. Scroll through the solar system at true proportional scale.",
  thumbnail: "/imgs/experiments/solar-system-scale.png",

  standards: {
    ngss: ["HS-ESS1-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "AP",
  tags: [
    "solar system",
    "scale model",
    "planet sizes",
    "astronomical distances",
    "Earth Science",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "scaleMode",
      label: "Scale Mode (0=size, 1=distance, 2=both)",
      unit: "",
      min: 0,
      max: 2,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "zoom",
      label: "Zoom Level",
      unit: "x",
      min: 1,
      max: 100,
      default: 1,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "1\\,\\text{AU} = 1.496 \\times 10^8\\,\\text{km}",
      description:
        "Astronomical Unit: average Earth-Sun distance, used as the standard measure of solar system distances",
    },
    {
      latex: "\\text{Light time} = \\frac{d}{c} \\approx 8.3\\,\\text{min (Sun to Earth)}",
      description:
        "Light travel time: even at 300,000 km/s, sunlight takes 8.3 minutes to reach Earth",
    },
  ],

  theory:
    "The solar system is overwhelmingly empty space. The Sun contains 99.86% of the system's mass. If the Sun were a basketball (24 cm diameter), Earth would be a 2 mm peppercorn 26 meters away, and Jupiter would be a 2.5 cm marble 135 meters away. Neptune would be over 770 meters away. The planets' sizes span 4 orders of magnitude: Mercury (4,879 km) to Jupiter (139,820 km). Distances span even more: Mercury at 0.39 AU to Neptune at 30.07 AU. One AU is about 150 million km. Light takes 4.2 hours to reach Neptune from the Sun.",

  instructions:
    "Scroll horizontally to travel through the solar system at true proportional distance scale. The top bar shows planet sizes at true relative scale. Toggle between size-accurate view (shows relative diameters) and distance-accurate view (shows true spacing). The data panel shows real measurements for the selected planet.",

  challenges: [
    {
      id: "ss-c1",
      question: "If Earth is 1 AU from the Sun, how far is Jupiter in AU?",
      hint: "Jupiter orbits at ~5.2 AU from the Sun.",
      tier: "free",
    },
    {
      id: "ss-c2",
      question: "How many Earths could fit inside Jupiter by volume?",
      hint: "Jupiter's radius is ~11.2× Earth's. Volume scales as r³: 11.2³ ≈ 1,400 Earths.",
      tier: "free",
    },
    {
      id: "ss-c3",
      question: "How long does light take to travel from the Sun to Neptune?",
      hint: "Neptune is ~30 AU away. Light crosses 1 AU in ~8.3 min. 30 × 8.3 ≈ 249 min ≈ 4.15 hours.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["atmosphere-layers", "star-life-cycle"],
  htmlPath: "/experiments/earth-science/solar-system-scale.html",

  seoTitle: "Solar System Scale Model | Scivra Earth Science",
  seoKeywords: [
    "solar system scale model",
    "planet sizes comparison",
    "astronomical distances interactive",
    "solar system visualization",
    "Earth science space lab",
    "planet distance calculator",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Solar System Scale and Proportions",
  },
};
