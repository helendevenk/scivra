import type { Experiment } from "@/shared/types/experiment";

export const tidesLunarGravity: Experiment = {
  id: "tides-lunar-gravity",
  slug: "tides-lunar-gravity",
  title: "Tides & Lunar Gravity",
  subtitle: "How the Moon and Sun create tidal bulges on Earth",
  description:
    "Visualize how the Moon's gravitational pull creates tidal bulges on opposite sides of Earth. Observe spring tides (Sun + Moon aligned) and neap tides (Sun and Moon at 90°). Adjust the Moon's orbital position and watch how coastal water levels rise and fall through a full tidal cycle.",
  thumbnail: "/imgs/experiments/tides-lunar-gravity.png",

  standards: {
    ngss: ["HS-ESS1-4", "MS-ESS1-2"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "AP",
  tags: [
    "tides",
    "lunar gravity",
    "spring tide",
    "neap tide",
    "tidal bulge",
    "Moon orbit",
    "gravitational force",
    "Earth Science",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "moonAngle",
      label: "Moon Position",
      unit: "°",
      min: 0,
      max: 360,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "sunAngle",
      label: "Sun Position",
      unit: "°",
      min: 0,
      max: 360,
      default: 90,
      step: 5,
      tier: "free",
    },
    {
      id: "playbackSpeed",
      label: "Time Speed",
      unit: "×",
      min: 0,
      max: 5,
      default: 1,
      step: 0.5,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "F_{\\text{tidal}} = \\frac{2GMmr}{d^3}",
      description:
        "Tidal force is proportional to mass M of the attracting body and inversely proportional to the cube of distance d. The factor of 2r (Earth's diameter) arises from the differential pull across Earth.",
    },
    {
      latex: "\\frac{F_{\\text{Moon}}}{F_{\\text{Sun}}} \\approx 2.2",
      description:
        "Despite the Sun being far more massive, the Moon's proximity makes its tidal force ~2.2× stronger. Tides scale as M/d³, heavily favoring nearby objects.",
    },
  ],

  theory:
    "Tides result from the differential gravitational pull across Earth's diameter. The Moon pulls the near side of Earth more strongly than the center, and the center more than the far side. This creates two tidal bulges: one facing the Moon (direct gravitational pull) and one on the opposite side (where the center is pulled away from the water). As Earth rotates, coastal locations pass through both bulges, experiencing two high tides per day (semidiurnal tide). When Sun and Moon align (new/full moon), their tidal forces add up — producing extra-large spring tides. When they're at 90° (quarter moons), forces partially cancel — producing smaller neap tides. The tidal range varies from ~1 m (open ocean) to >15 m in funnel-shaped bays (Bay of Fundy). Tidal friction is gradually slowing Earth's rotation (~2.3 ms/century) and pushing the Moon farther away (~3.8 cm/year).",

  instructions:
    "Watch the Moon orbit Earth and observe the tidal bulges on the ocean surface. Adjust moon and sun positions manually, or let time advance automatically. The tide gauge at right shows water level at a coastal point. Notice how alignment creates spring tides and perpendicular positions create neap tides.",

  challenges: [
    {
      id: "tlg-c1",
      question: "Why are there two high tides per day instead of one?",
      hint: "The tidal bulge exists on BOTH sides of Earth — the side facing the Moon (direct pull) and the opposite side (inertial bulge). As Earth rotates, a coastal point passes through both bulges in ~24 hours.",
      tier: "free",
    },
    {
      id: "tlg-c2",
      question: "Why does the Moon have a stronger tidal effect than the Sun?",
      hint: "Tidal force ∝ M/d³. The Sun is 27 million × more massive but 390× farther. (27M)/(390³) ≈ 0.46, so the Sun's tidal force is actually less than half the Moon's. Proximity matters more than mass for tides.",
      tier: "free",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["solar-system-scale", "star-life-cycle"],
  htmlPath: "/experiments/earth-science/tides-lunar-gravity.html",

  seoTitle: "Tides & Lunar Gravity Simulation | Scivra Earth Science",
  seoKeywords: [
    "tides simulation",
    "lunar gravity interactive",
    "spring neap tides",
    "tidal bulge visualization",
    "Moon Earth tides",
    "Earth science virtual lab",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Tidal Forces and Lunar Gravitational Effects",
  },
};
