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
  contentSections: {
    whatIsIt:
      "The Moon does not make its own light — it shines by reflecting sunlight the same way a mirror reflects a flashlight beam. As the Moon travels around Earth each month, we see different portions of its sunlit half depending on where the Moon is in its orbit relative to the Sun and us. That changing view creates what we call moon phases. At new moon, the Moon sits between Earth and the Sun, so its lit side faces away from us and we see only darkness. Over the next two weeks, the Moon moves to the side and then behind Earth, gradually revealing more and more of its sunlit face. At full moon, Earth is between the Sun and Moon, and we see the entire lit hemisphere glowing in the sky. Then the cycle reverses as the lit portion shrinks back to nothing. The complete journey from one new moon to the next takes about 29.5 days — the original basis for the concept of a month in many ancient calendars. Your latitude on Earth also affects how the Moon's shape appears oriented in the sky, because observers in Australia see the Moon from a different angle than observers in Canada.",
    parameterExplanations: {
      dayOfCycle:
        "Sets the current day within the 29.5-day lunar cycle, from 0 (new moon) to 29.5 (back to new moon). Moving this slider forward in time shows the Moon progressing through waxing crescent, first quarter (day ~7.4), waxing gibbous, full moon (day ~14.8), waning gibbous, third quarter (day ~22.1), and waning crescent before returning to new moon. The overhead diagram shows the Moon's actual position in orbit around Earth at that day.",
      observerLatitude:
        "Sets your viewing location on Earth, from 90 degrees south (South Pole) through 0 degrees (equator) to 90 degrees north (North Pole). Latitude affects the angle at which the Moon crosses the sky and the apparent tilt of the crescent. Observers in the Southern Hemisphere typically see the Moon oriented the opposite way compared to Northern Hemisphere observers — the lit side appears on the left during waxing phases instead of the right.",
    },
    misconceptions: [
      {
        wrong: "Moon phases are caused by Earth's shadow falling on the Moon.",
        correct:
          "Earth's shadow on the Moon creates a lunar eclipse — a relatively rare event that only happens during certain full moons when the Sun, Earth, and Moon align almost perfectly. Phases happen every month regardless of eclipses, because they are simply the result of seeing different portions of the Moon's sunlit side as it orbits. During a crescent phase, you can often faintly see the dark part of the Moon glowing with earthshine — sunlight reflected off Earth — which confirms the dark portion is not in shadow.",
      },
      {
        wrong: "The Moon rises and sets only at night.",
        correct:
          "The Moon is visible in daylight roughly half the time. During the waxing crescent and first quarter phases, the Moon is above the horizon in the afternoon and sets in the evening. During the waning gibbous and third quarter phases, the Moon rises after midnight and is visible in the morning sky. Only the full moon rises near sunset and is above the horizon mostly at night. The Moon follows its own schedule independent of the Sun.",
      },
      {
        wrong: "We see different sides of the Moon at different times of the month.",
        correct:
          "We always see the same side of the Moon, because the Moon rotates on its axis in exactly the same time it takes to orbit Earth — a condition called tidal locking. The phases are about how much of that same familiar face is lit up by sunlight at any given point in the cycle, not about seeing different hemispheres.",
      },
      {
        wrong: "A lunar eclipse happens every full moon.",
        correct:
          "The Moon's orbit is tilted about 5 degrees relative to Earth's orbit around the Sun. Most full moons, the Moon passes slightly above or below Earth's shadow and no eclipse occurs. Lunar eclipses happen only when a full moon coincides with the Moon crossing the plane of Earth's orbit — typically a few times per year at most, and often not visible from any given location.",
      },
    ],
    teacherUseCases: [
      "Advance dayOfCycle from 0 to 29.5 in steps while students draw the Moon's shape at day 0, 7, 14, 21, and 29 — they build a visual record of all eight named phases and practice using the overhead orbit diagram to explain why each phase looks the way it does (MS-ESS1-1).",
      "Set dayOfCycle to 14.8 (full moon) and then gradually adjust observerLatitude from 60 north to 60 south — students observe the Moon's sky-orientation flip and discuss how the same physical Moon can appear 'upside down' depending on where you stand on Earth.",
      "Present students with a mystery: set dayOfCycle to 7.4 and ask whether the Moon is currently waxing or waning, then have them use the orbital diagram (not just the Moon's appearance) to justify their answer — develops the skill of connecting visual evidence to geometric models.",
      "Set observerLatitude to 40 degrees (roughly central US) and cycle through the phases while students note on which side of the Moon the lit edge appears — they discover the lit side consistently faces the Sun's direction and can use that rule to tell waxing from waning without memorizing each phase name.",
    ],
    faq: [
      {
        question: "Why is the lunar cycle 29.5 days even though the Moon takes only 27.3 days to orbit Earth?",
        answer:
          "The 27.3-day orbit is measured relative to the distant stars (called the sidereal period). But while the Moon completes one orbit, Earth has also moved about 27 degrees along its own path around the Sun. So the Moon needs to travel a little extra — about 2.2 more days — to catch up to the same Sun-Earth-Moon alignment and produce the next new moon. This longer 29.5-day period (the synodic period) is what we experience as the monthly phase cycle.",
      },
      {
        question: "What causes a lunar eclipse, and how is it different from a moon phase?",
        answer:
          "A lunar eclipse occurs when Earth moves directly between the Sun and a full Moon and Earth's shadow falls on the Moon, turning it a reddish-orange color (from sunlight filtered through Earth's atmosphere bending around the edges). This only happens during specific full moons when the alignment is nearly perfect, not every month. Moon phases happen every month simply because of the Moon's orbital position — no shadow is involved. They are completely separate phenomena.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation primarily supports MS-ESS1-1, which asks students to develop and use a model of the Earth-Sun-Moon system to describe the cyclic patterns of lunar phases, eclipses of the Sun and Moon, and seasons. The observer latitude feature also connects to the crosscutting concept of patterns — the same Moon appears differently depending on where you are on Earth, which is itself a pattern that can be explained with a geometric model of three-dimensional space.",
      },
      {
        question: "Why does the Moon always show us the same face?",
        answer:
          "Over billions of years, Earth's gravitational pull has gradually slowed the Moon's rotation until it now rotates exactly once for every orbit it completes around Earth. This is called tidal locking. Because the rotation and orbital periods match perfectly, the same hemisphere always faces Earth. The far side — sometimes called the dark side — receives just as much sunlight as the near side but was never seen by humans until spacecraft flew around the Moon beginning in 1959.",
      },
      {
        question: "Can you see phases on other moons and planets from Earth?",
        answer:
          "Through a telescope, Venus shows dramatic phases similar to our Moon because it orbits closer to the Sun than Earth does — you can see a thin crescent Venus when it is between Earth and the Sun. Jupiter's large moons also show phases when viewed through a decent telescope. Mercury shows phases for the same reason as Venus. Mars, Jupiter, and Saturn show only very slight phase effects because they orbit farther from the Sun than Earth and we mostly see their fully lit side.",
      },
    ],
  },
};
