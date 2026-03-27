import type { Experiment } from "@/shared/types/experiment";

export const glaciersIceAges: Experiment = {
  id: "glaciers-ice-ages",
  slug: "glaciers-ice-ages",
  title: "Glaciers & Ice Ages",
  subtitle: "Glacial advance and retreat driven by Milankovitch cycles",
  description:
    "Visualize how glaciers advance and retreat over hundreds of thousands of years in response to Milankovitch orbital cycles. Adjust Earth's orbital eccentricity, axial tilt, and precession to see how insolation changes drive ice sheet growth and melting. A timeline shows glacial and interglacial periods with corresponding temperature and CO₂ data.",
  thumbnail: "/imgs/experiments/glaciers-ice-ages.png",

  standards: {
    ngss: ["HS-ESS2-4", "HS-ESS1-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "AP",
  tags: [
    "glaciers",
    "ice ages",
    "Milankovitch cycles",
    "ice sheets",
    "climate history",
    "orbital mechanics",
    "Earth Science",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "eccentricity",
      label: "Eccentricity",
      unit: "",
      min: 0,
      max: 0.06,
      default: 0.017,
      step: 0.001,
      tier: "free",
    },
    {
      id: "obliquity",
      label: "Axial Tilt",
      unit: "°",
      min: 22,
      max: 24.5,
      default: 23.4,
      step: 0.1,
      tier: "free",
    },
    {
      id: "timePosition",
      label: "Time",
      unit: "kya",
      min: 0,
      max: 800,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "playbackSpeed",
      label: "Speed",
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
      latex: "T_{\\text{eccentricity}} \\approx 100{,}000 \\text{ yr}",
      description:
        "Earth's orbital eccentricity varies with a ~100,000 year cycle, modulating the total solar energy received and strongly correlating with glacial/interglacial transitions.",
    },
    {
      latex: "T_{\\text{obliquity}} \\approx 41{,}000 \\text{ yr},\\quad T_{\\text{precession}} \\approx 26{,}000 \\text{ yr}",
      description:
        "Axial tilt oscillates over ~41,000 years, affecting seasonal contrast. Precession (~26,000 yr) shifts when seasons occur relative to perihelion.",
    },
  ],

  theory:
    "Ice ages are driven by Milankovitch cycles — periodic variations in Earth's orbit that alter the distribution and intensity of solar radiation. Three cycles interact: (1) Eccentricity (~100,000 yr): Earth's orbit stretches from nearly circular to slightly elliptical, changing total insolation by ~0.2%. This correlates most strongly with glacial-interglacial transitions. (2) Obliquity (~41,000 yr): Earth's axial tilt varies between 22.1° and 24.5°, affecting seasonal contrast — low tilt means milder summers that fail to melt winter snow, allowing ice sheets to grow. (3) Precession (~26,000 yr): Earth's axis wobbles, shifting when perihelion occurs relative to seasons. When Northern Hemisphere summer coincides with aphelion (farthest from Sun), summers are cooler, favoring ice growth. Ice sheet growth involves positive feedbacks: more ice → higher albedo → less absorption → more cooling → more ice. Glacial periods last ~90,000 years; interglacials ~10,000 years. Ice core records (Vostok, EPICA) show temperature and CO₂ are tightly correlated over 800,000 years.",

  instructions:
    "Drag the time slider to move through 800,000 years of glacial history. The landscape shows ice sheet extent, while the timeline below plots temperature and CO₂. Adjust eccentricity and obliquity to explore how orbital changes affect ice coverage. Watch the Milankovitch cycle visualization to understand the orbital mechanics.",

  challenges: [
    {
      id: "gi-c1",
      question: "Why do ice ages correlate most strongly with the 100,000-year eccentricity cycle?",
      hint: "While eccentricity alone changes insolation by only ~0.2%, it modulates the amplitude of the precession cycle. High eccentricity makes precession effects stronger, creating the conditions for rapid deglaciation. The nonlinear ice-albedo feedback amplifies small forcing changes.",
      tier: "free",
    },
    {
      id: "gi-c2",
      question: "What role does the ice-albedo feedback play in glaciation?",
      hint: "Ice reflects ~80% of sunlight (high albedo) vs. ~10% for ocean. As ice grows, more sunlight is reflected → less heating → more cooling → more ice growth. This positive feedback amplifies small orbital forcing into major climate shifts.",
      tier: "free",
    },
    {
      id: "gi-c3",
      question: "Why are glacial periods (~90 kyr) much longer than interglacials (~10 kyr)?",
      hint: "Ice sheet growth is slow (snow accumulation) but collapse is fast (warming triggers ice-albedo reversal + meltwater feedbacks). The asymmetry arises because building ice requires sustained cool conditions, but melting can cascade rapidly once a threshold is crossed.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["climate-change-modeling", "soil-formation"],
  htmlPath: "/experiments/earth-science/glaciers-ice-ages.html",

  seoTitle: "Glaciers & Ice Ages Simulation | Scivra Earth Science",
  seoKeywords: [
    "glaciers simulation",
    "ice ages interactive",
    "Milankovitch cycles",
    "glacial interglacial",
    "climate history visualization",
    "Earth science virtual lab",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Glacial Cycles and Milankovitch Orbital Mechanics",
  },
};
