import type { Experiment } from "@/shared/types/experiment";

export const k5MoonPhases: Experiment = {
  id: "k5-moon-phases",
  slug: "k5-moon-phases",
  title: "Moon Phases",
  subtitle: "Why the Moon appears to change shape each night",
  description:
    "Orbit the Moon around Earth and watch its phase change from New Moon to Full Moon and back. See the Moon from above (top view) to understand why we see different portions lit by the Sun. Track the 29.5-day lunar cycle.",
  thumbnail: "/imgs/experiments/k5-moon-phases.png",

  standards: {
    ngss: ["1-ESS1-1", "MS-ESS1-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "K-2",
  tags: ["moon phases", "lunar cycle", "new moon", "full moon", "crescent", "earth science", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "moonAngle",
      label: "Moon's Position in Orbit",
      unit: "°",
      min: 0,
      max: 360,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "orbitSpeed",
      label: "Animation Speed",
      unit: "×",
      min: 1,
      max: 30,
      default: 5,
      step: 1,
      tier: "free",
    },
    {
      id: "showEclipse",
      label: "Show Eclipse Geometry (0=No, 1=Yes)",
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
      latex: "\\text{Lunar cycle} = 29.5 \\text{ days}",
      description: "The Moon completes one full orbit around Earth in 29.5 days",
    },
    {
      latex: "\\text{New} \\to \\text{Crescent} \\to \\text{Quarter} \\to \\text{Gibbous} \\to \\text{Full} \\to \\cdots",
      description: "The eight phases of the Moon in order",
    },
  ],

  theory:
    "The Moon does not emit its own light — it reflects sunlight. As the Moon orbits Earth once every 29.5 days, we see different portions of its lit side from Earth, creating the phases. New Moon: Moon is between Earth and Sun — we see the unlit side (dark). Waxing Crescent: small sliver visible. First Quarter: half the Moon is lit (right half). Waxing Gibbous: more than half lit. Full Moon: Moon is opposite the Sun — we see the fully lit side. Then the cycle reverses: Waning Gibbous, Last Quarter, Waning Crescent, back to New Moon. Lunar eclipses occur when Earth's shadow falls on the full Moon; solar eclipses when the new Moon covers the Sun.",

  instructions:
    "Use the Moon's Position slider to move the Moon around Earth. Watch the phase display update. Try animating at high speed to see the full cycle. Toggle to top view to see why the lit portion changes. Enable Eclipse Geometry (Pro) to see when eclipses can occur.",

  challenges: [
    {
      id: "mp-c1",
      question: "Why does the Moon appear to change shape? Does the Moon itself actually change?",
      hint: "No! The Moon's shape doesn't change — it's always a sphere. What changes is how much of the lit (sunlit) side we can see from Earth as the Moon orbits. We're seeing different angles of the same lit half.",
      tier: "free",
    },
    {
      id: "mp-c2",
      question: "During which phase is a lunar eclipse possible? A solar eclipse?",
      hint: "Lunar eclipse: Full Moon (Earth's shadow can block sunlight from reaching the Moon). Solar eclipse: New Moon (Moon can pass between Earth and Sun, blocking sunlight). Not every new/full moon causes an eclipse because the Moon's orbit is tilted 5° relative to Earth's orbit.",
      tier: "free",
    },
    {
      id: "mp-c3",
      question: "How long does it take to go from New Moon to Full Moon?",
      hint: "About 14-15 days (half of the 29.5-day lunar cycle). From New Moon → Full Moon is waxing (growing). From Full Moon → New Moon is waning (shrinking).",
      tier: "free",
    },
    {
      id: "mp-c4",
      question: "Why do we always see the same face of the Moon from Earth?",
      hint: "The Moon rotates on its axis in exactly the same time it takes to orbit Earth (29.5 days) — this is called 'tidal locking.' Gravity from Earth gradually slowed the Moon's rotation over billions of years until it synchronized with its orbital period.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-day-night-seasons", "gravitational-fields"],

  seoTitle: "Moon Phases Simulation for Kids | NeonPhysics Elementary Earth Science",
  seoKeywords: [
    "moon phases kids simulation",
    "lunar cycle interactive elementary",
    "new moon full moon crescent",
    "K-5 earth science moon",
    "moon orbit simulation kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Moon Phases and Lunar Cycle",
  },
};
