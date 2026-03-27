import type { Experiment } from "@/shared/types/experiment";

export const msMoonPhasesDetailed: Experiment = {
  id: "ms-moon-phases-detailed",
  slug: "ms-moon-phases-detailed",
  title: "Moon Phases",
  subtitle: "Understand why the Moon changes shape throughout its 29.5-day cycle",
  description:
    "Orbit the Moon around Earth and watch its phases change from new moon to full moon and back. Control the day of the lunar cycle to see exactly how sunlight illuminates the Moon from different angles. Observe from space to understand the geometry, then switch to ground view to see what the Moon looks like from your latitude on Earth.",
  thumbnail: "/imgs/experiments/ms-moon-phases-detailed.png",

  standards: {
    ngss: ["MS-ESS1-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: ["moon phases", "lunar cycle", "new moon", "full moon", "Earth-Moon-Sun system", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "dayOfCycle",
      label: "Day of Lunar Cycle",
      unit: "days",
      min: 0,
      max: 29.5,
      default: 0,
      step: 0.5,
      tier: "free",
    },
    {
      id: "observerLatitude",
      label: "Observer Latitude",
      unit: "°",
      min: -90,
      max: 90,
      default: 40,
      step: 5,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\text{Synodic Period} = 29.53 \\text{ days (new moon to new moon)}",
      description: "The Moon takes 29.53 days to complete one full cycle of phases as seen from Earth, because Earth is also moving around the Sun",
    },
  ],

  theory:
    "The Moon does not produce its own light — it reflects sunlight. As the Moon orbits Earth (taking about 29.5 days for a complete cycle), we see different portions of its sunlit half, creating the phases. At new moon (day 0), the Moon is between Earth and the Sun, so its sunlit side faces away from us and we see darkness. Over the next ~7 days, a growing sliver appears on the right side (waxing crescent). At first quarter (day ~7.4), we see exactly half the sunlit side. The illuminated area continues to grow (waxing gibbous) until full moon (day ~14.8), when Earth is between the Sun and Moon and we see the entire sunlit face. Then the process reverses: waning gibbous, third quarter (day ~22.1), waning crescent, and back to new moon. The Moon always keeps the same face toward Earth (tidal locking). Your latitude on Earth affects the Moon's apparent orientation and path across the sky — observers in the Southern Hemisphere see the Moon 'upside down' compared to Northern Hemisphere viewers.",

  instructions:
    "Drag the Day of Lunar Cycle slider to move the Moon through its orbit. The top view shows the Sun-Earth-Moon geometry from space — notice how the angle between Sun and Moon determines what you see from Earth. The bottom panel shows the Moon's appearance from your location. Change your latitude to see how the Moon's orientation tilts. Try to identify each named phase as you scrub through the cycle.",

  challenges: [
    {
      id: "mp-ms-c1",
      question: "If the Moon orbits Earth in 27.3 days, why is the phase cycle 29.5 days? Where do the extra 2.2 days come from?",
      hint: "In 27.3 days the Moon completes one orbit relative to the stars (sidereal period). But during those 27.3 days, Earth has also moved about 27° along its own orbit around the Sun. So the Moon needs an extra ~2.2 days to 'catch up' and return to the same Sun-Earth-Moon alignment. The 29.5-day synodic period is the time between identical phases.",
      tier: "free",
    },
    {
      id: "mp-ms-c2",
      question: "A friend claims the Moon's phases are caused by Earth's shadow falling on the Moon. How would you explain why this is wrong?",
      hint: "Earth's shadow on the Moon is a lunar eclipse — a rare event that only happens during some full moons when the alignment is precise. Phases happen every month because we're seeing different amounts of the Moon's sunlit half as it orbits. Proof: during a crescent moon, the dark part is still faintly visible (earthshine — sunlight reflected off Earth onto the Moon). If it were Earth's shadow, the dark part would be completely black.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["tides-lunar-gravity", "solar-system-scale"],

  htmlPath: "/experiments/middle/ms-moon-phases-detailed.html",

  seoTitle: "Moon Phases Simulation Middle School | Scivra Interactive Earth Science",
  seoKeywords: [
    "moon phases simulation middle school",
    "lunar cycle interactive visualization 6-8",
    "why does the moon change shape",
    "Earth Moon Sun system simulation",
    "NGSS MS-ESS1-1 moon phases",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Moon Phases and the Lunar Cycle",
  },
};
