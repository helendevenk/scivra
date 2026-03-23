import type { Experiment } from "@/shared/types/experiment";

export const k5DayNightSeasons: Experiment = {
  id: "k5-day-night-seasons",
  slug: "k5-day-night-seasons",
  title: "Day, Night & Seasons",
  subtitle: "Earth's rotation and revolution create our daily and yearly cycles",
  description:
    "Watch Earth spin on its axis to create day and night. Orbit it around the Sun to see the seasons change. Discover why the Northern Hemisphere experiences summer when tilted toward the Sun, and why day length changes throughout the year.",
  thumbnail: "/imgs/experiments/k5-day-night-seasons.png",

  standards: {
    ngss: ["1-ESS1-1", "5-ESS1-2", "MS-ESS1-1"],
    gcse: [],
    ap: [],
  },
  category: "earth",
  subject: "earth-science",
  gradeLevel: "K-2",
  tags: ["day night", "seasons", "Earth rotation", "Earth revolution", "axial tilt", "earth science", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "earthTilt",
      label: "Axial Tilt",
      unit: "°",
      min: 0,
      max: 45,
      default: 23.5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "orbitPosition",
      label: "Earth's Position in Orbit",
      unit: "°",
      min: 0,
      max: 360,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "latitude",
      label: "Observer Latitude",
      unit: "°N",
      min: -90,
      max: 90,
      default: 45,
      step: 5,
      tier: "pro",
    },
    {
      id: "rotationSpeed",
      label: "Rotation Speed",
      unit: "×",
      min: 1,
      max: 50,
      default: 10,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\text{Tilt} = 23.5° \\to \\text{seasons} \\quad \\text{Rotation} = 24\\,\\text{h} \\to \\text{day/night}",
      description: "Earth's 23.5° axial tilt causes seasons; rotation period is 24 hours",
    },
  ],

  theory:
    "Earth rotates on its axis once every 24 hours, causing day and night. The side facing the Sun experiences day; the opposite side experiences night. Earth also revolves around the Sun once every 365.25 days. Earth's axis is tilted at 23.5° relative to its orbital plane. This tilt causes seasons: when the Northern Hemisphere tilts toward the Sun (summer), it receives more direct sunlight and has longer days. When tilted away (winter), it receives indirect, weaker sunlight and shorter days. At the equinoxes (March and September), day and night are approximately equal everywhere. The distance from the Sun is NOT the primary cause of seasons — Earth is actually closest to the Sun in January (during Northern Hemisphere winter).",

  instructions:
    "Use the orbit position slider to move Earth around the Sun. Watch how the Northern Hemisphere receives more direct sunlight in summer (June position) and less in winter (December). See day and night by watching Earth rotate. Change the axial tilt to 0° — seasons disappear! Increase tilt to see more extreme seasons.",

  challenges: [
    {
      id: "dns-c1",
      question: "Why do we have seasons? Is it because Earth is closer to the Sun in summer?",
      hint: "No! Seasons are caused by Earth's 23.5° axial tilt, not distance. In Northern summer, the Northern Hemisphere is tilted toward the Sun (more direct, stronger sunlight, longer days). Earth is actually slightly FARTHER from the Sun in June!",
      tier: "free",
    },
    {
      id: "dns-c2",
      question: "When it is summer in Australia (Southern Hemisphere), what season is it in Canada?",
      hint: "When the Southern Hemisphere is tilted toward the Sun (Southern summer ≈ December-February), the Northern Hemisphere is tilted away → winter. Seasons are opposite in the two hemispheres.",
      tier: "free",
    },
    {
      id: "dns-c3",
      question: "At the North Pole during the summer solstice, how many hours of daylight are there?",
      hint: "24 hours of daylight! At the North Pole in summer, Earth's tilt points the pole toward the Sun, so the Sun never sets. This is called the 'Midnight Sun.' In winter, the North Pole has 24 hours of darkness.",
      tier: "free",
    },
    {
      id: "dns-c4",
      question: "If Earth's axial tilt increased to 45°, how would seasons change?",
      hint: "Extreme seasons! Summers would be much hotter (more direct sunlight, very long days), winters would be much colder (nearly no sunlight near poles). Many currently habitable regions might experience severe temperature extremes that would disrupt ecosystems and agriculture.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-moon-phases", "k5-water-cycle", "gravitational-fields"],

  seoTitle: "Day Night Seasons Earth Simulation for Kids | NeonPhysics Elementary",
  seoKeywords: [
    "day night seasons kids simulation",
    "Earth rotation revolution interactive",
    "axial tilt seasons elementary",
    "K-5 earth science solar system",
    "why do we have seasons kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Day, Night, and Seasons",
  },
};
