import type { Experiment } from "@/shared/types/experiment";

export const starLifeCycle: Experiment = {
  id: "star-life-cycle",
  slug: "star-life-cycle",
  title: "Star Life Cycle",
  subtitle: "From nebula to neutron star — stellar evolution on the HR diagram",
  description:
    "Trace the life cycle of stars from protostellar nebula through main sequence, red giant, and final fate (white dwarf, neutron star, or black hole). An interactive Hertzsprung-Russell diagram shows how luminosity and temperature change as stars evolve. Adjust initial stellar mass to see how it determines a star's lifespan and endpoint.",
  thumbnail: "/imgs/experiments/star-life-cycle.png",

  standards: {
    ngss: ["HS-ESS1-1", "HS-ESS1-3"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "9-12",
  tags: [
    "stellar evolution",
    "HR diagram",
    "Hertzsprung-Russell",
    "main sequence",
    "red giant",
    "white dwarf",
    "neutron star",
    "black hole",
    "Earth Science",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "stellarMass",
      label: "Initial Mass",
      unit: "M☉",
      min: 0.5,
      max: 40,
      default: 1,
      step: 0.5,
      tier: "free",
    },
    {
      id: "playbackSpeed",
      label: "Time Speed",
      unit: "×",
      min: 0.5,
      max: 5,
      default: 1,
      step: 0.5,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "L \\approx L_\\odot \\left(\\frac{M}{M_\\odot}\\right)^{3.5}",
      description:
        "Main-sequence luminosity scales roughly as mass to the 3.5 power. A 10 M☉ star is ~3000× more luminous than the Sun.",
    },
    {
      latex: "\\tau_{\\text{MS}} \\approx 10^{10} \\left(\\frac{M}{M_\\odot}\\right)^{-2.5} \\text{ yr}",
      description:
        "Main-sequence lifetime decreases steeply with mass. Massive stars burn fuel far faster despite having more of it.",
    },
  ],

  theory:
    "Stars form when dense regions in molecular clouds collapse under gravity. The protostar heats up until hydrogen fusion ignites in the core, placing it on the main sequence of the HR diagram. A star spends most of its life on the main sequence, fusing H → He. When core hydrogen is exhausted, the core contracts and heats, igniting hydrogen shell burning. The envelope expands and cools — the star becomes a red giant (or supergiant for massive stars). Low-mass stars (< 8 M☉) shed outer layers as a planetary nebula, leaving a white dwarf that slowly cools. High-mass stars (> 8 M☉) fuse heavier elements up to iron, then undergo core-collapse supernova. The remnant is a neutron star (< ~25 M☉) or black hole (> ~25 M☉). The HR diagram plots luminosity vs. surface temperature; evolutionary tracks show distinct paths depending on initial mass. The main sequence runs diagonally — hot-bright upper left to cool-dim lower right.",

  instructions:
    "Use the mass slider to set the initial stellar mass, then click 'Start Evolution' to watch the star progress through its life stages. The HR diagram tracks the star's position in real time. Hover over any stage label for details. Higher mass = shorter life but more dramatic ending.",

  challenges: [
    {
      id: "slc-c1",
      question: "Why do more massive stars have shorter lifetimes despite having more fuel?",
      hint: "Luminosity ∝ M^3.5 but fuel ∝ M, so lifetime ∝ M/L ∝ M^(-2.5). A 10 M☉ star is 10× heavier but ~3000× more luminous — it burns through fuel ~300× faster.",
      tier: "free",
    },
    {
      id: "slc-c2",
      question: "What determines whether a star ends as a white dwarf, neutron star, or black hole?",
      hint: "Initial mass is the primary factor. Below ~8 M☉ → white dwarf. 8–25 M☉ → neutron star (Chandrasekhar limit ~1.4 M☉ for the remnant). Above ~25 M☉ → black hole (Tolman–Oppenheimer–Volkoff limit ~2–3 M☉).",
      tier: "free",
    },
    {
      id: "slc-c3",
      question: "Why does a star become a red giant when it exhausts core hydrogen?",
      hint: "Without core fusion, the core contracts and heats. Hydrogen ignites in a shell around the core, releasing more energy. The envelope absorbs this energy and expands enormously, cooling the surface to red but greatly increasing total luminosity.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["solar-system-scale", "radiometric-dating"],
  htmlPath: "/experiments/earth-science/star-life-cycle.html",

  seoTitle: "Star Life Cycle & HR Diagram Simulation | Scivra Earth Science",
  seoKeywords: [
    "star life cycle simulation",
    "HR diagram interactive",
    "Hertzsprung-Russell",
    "stellar evolution",
    "main sequence",
    "Earth science virtual lab",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Stellar Evolution and the Hertzsprung-Russell Diagram",
  },
};
