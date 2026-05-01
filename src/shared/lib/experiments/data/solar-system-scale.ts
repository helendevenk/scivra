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
  gradeLevel: "9-12",
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
  contentSections: {
    whatIsIt:
      "The solar system is overwhelmingly empty space — yet most textbook diagrams squeeze all eight planets into a single page, making Jupiter look a short drive from the Sun. One astronomical unit (1 AU = 149.6 million km) is the average Earth-Sun distance, and it sets the scale: Mercury orbits at 0.39 AU, Earth at 1 AU, Jupiter at 5.2 AU, and Neptune at 30 AU. If the Sun were a basketball (24 cm across), Earth would be a peppercorn 26 meters away and Neptune would be over 770 meters down the street. The asteroid belt spans 2.2–3.2 AU; the Kuiper belt begins at 30 AU. Sunlight, traveling at 300,000 km/s, takes 8.3 minutes to reach Earth and over 4 hours to reach Neptune. This simulation lets you toggle between size-accurate and distance-accurate views so that both scales become tangible at once.",
    parameterExplanations: {
      scaleMode:
        "Switches between three display modes: 0 shows relative planet diameters at true scale against each other, 1 shows true proportional distances between planets, and 2 attempts to display both simultaneously. Mode 1 is the most visually striking because the vast emptiness between worlds becomes apparent.",
      zoom:
        "Zoom level from 1× to 100×. At low zoom the full solar system fits in view but inner planets are tiny; increasing zoom lets you examine the inner rocky planets or a single planet's details. Use it alongside scaleMode 1 to appreciate distance versus size together.",
    },
    misconceptions: [
      {
        wrong:
          "All the planets are roughly evenly spaced from each other.",
        correct:
          "Distances grow dramatically with distance from the Sun. The gap from Saturn (9.6 AU) to Uranus (19.2 AU) is nearly as large as the entire span from Mercury to Jupiter. The outer solar system is far emptier than most diagrams suggest.",
      },
      {
        wrong:
          "All planet orbits lie in a perfectly flat line, like beads on a wire.",
        correct:
          "Orbits are tilted slightly relative to Earth's orbital plane (the ecliptic). Mercury is inclined ~7° and Pluto ~17°, which is why we do not see a solar eclipse every month — the Moon's orbit is tilted ~5° and usually passes above or below the Sun's disk.",
      },
      {
        wrong:
          "The asteroid belt is a dense, obstacle-filled region like in science fiction films.",
        correct:
          "The asteroid belt (2.2–3.2 AU) is almost entirely empty space. The total mass of all asteroids combined is less than 4% of the Moon's mass. Spacecraft like Voyager and New Horizons passed through it without a single collision.",
      },
      {
        wrong:
          "Pluto is a planet just like the other eight.",
        correct:
          "Pluto was reclassified as a dwarf planet in 2006 because it shares its orbital neighborhood with many similar Kuiper Belt objects and has not gravitationally cleared its orbit — one of the three IAU criteria for full planetary status.",
      },
      {
        wrong:
          "The Sun is just a slightly larger version of the planets.",
        correct:
          "The Sun contains 99.86% of all the mass in the solar system. Its diameter (1.39 million km) is about 109 times Earth's. Jupiter, the largest planet, has a diameter only ~10% of the Sun's.",
      },
    ],
    teacherUseCases: [
      "Scale sense-making: set scaleMode to 1 and zoom to 1. Ask students to count how many Earth-Sun gaps fit between Earth and Neptune. Record the answer (about 29), then compare that to the textbook diagram in their notes and discuss why diagrams mislead.",
      "Basketball model calculation: before running the simulation, have students compute — if the Sun is a 24 cm basketball, where would a 2 mm Earth-peppercorn sit? (Answer: ~26 m.) Then set scaleMode 1 and verify their calculation against the proportional display.",
      "Light-travel time: set scaleMode to 1. Ask students to use the formula light-time = d/c to calculate how long a signal takes to reach each planet from the Sun. Then compare to the simulation's data panel. Reinforces HS-ESS1-4 crosscutting scale thinking.",
      "Inner versus outer solar system contrast: set scaleMode 0 and zoom to 100 to compare Mercury, Venus, Earth, and Mars diameters; then set zoom to 1 and scaleMode 1 to see how tiny those rocky worlds are in the full distance view. Discuss why inner planets are rocky while the outer planets are giant worlds rich in gas and ices (Jupiter and Saturn are gas giants; Uranus and Neptune are ice giants).",
      "Kuiper Belt edge estimation: set scaleMode 1 and zoom to 1. Ask students to estimate where 30 AU falls on the display relative to Neptune and mark where the Kuiper Belt ends (~50 AU). This connects to the Crosscutting Concept of Scale, Proportion, and Quantity.",
    ],
    faq: [
      {
        question: "Why do we use AU instead of kilometers for solar system distances?",
        answer:
          "Kilometers produce unwieldy numbers: Neptune is about 4,500,000,000 km from the Sun. One AU equals 149.6 million km, so Neptune becomes 30.1 AU — a number students can actually compare and reason about. AU also makes ratios between planetary distances easy to compute by hand.",
      },
      {
        question: "If Neptune is 30 AU away, how long would a spacecraft take to reach it?",
        answer:
          "The New Horizons probe traveled at about 16 km/s and took roughly 9.5 years to reach Pluto (~32 AU). At that speed Neptune (~30 AU) would take about 8–9 years. Light covers the same distance in only ~4.2 hours, illustrating how slow human technology is compared to electromagnetic signals.",
      },
      {
        question: "Which NGSS standard does this experiment directly address?",
        answer:
          "HS-ESS1-4 asks students to use mathematical or computational representations to predict the motion of orbiting objects in the solar system, which requires understanding actual distances and sizes — exactly what this simulation quantifies. The Crosscutting Concept of Scale, Proportion, and Quantity is central: students move from AU to kilometers to light-minutes in one session.",
      },
      {
        question: "Why can't a single diagram show both true sizes and true distances at the same time?",
        answer:
          "The size ratio and distance ratio are on completely different scales. Neptune is ~4 times Earth's diameter (manageable) but ~30 times farther from the Sun than Earth is. If you drew Neptune at its true distance on a page where the Sun fits, Earth would be invisible to the naked eye. Use scaleMode 2 to see the compromise the simulation makes.",
      },
      {
        question: "What is the Kuiper Belt, and how does it differ from the asteroid belt?",
        answer:
          "The Kuiper Belt extends from roughly 30 to 50 AU beyond Neptune and contains icy bodies including Pluto and Eris. The asteroid belt (2.2–3.2 AU) sits between Mars and Jupiter and is mostly rocky/metallic debris. Both regions are far less dense than sci-fi suggests, but the Kuiper Belt objects are icier because they formed farther from the Sun's heat.",
      },
    ],
  },
};
