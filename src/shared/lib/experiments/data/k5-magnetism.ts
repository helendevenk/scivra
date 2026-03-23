import type { Experiment } from "@/shared/types/experiment";

export const k5Magnetism: Experiment = {
  id: "k5-magnetism",
  slug: "k5-magnetism",
  title: "Magnetism & Magnetic Fields",
  subtitle: "Attract, repel, and explore invisible magnetic forces",
  description:
    "Place magnets and watch magnetic field lines appear around them. Bring opposite poles together to see attraction; same poles to see repulsion. Test which materials are attracted to magnets and which are not. Explore Earth's magnetic field and how compasses work.",
  thumbnail: "/imgs/experiments/k5-magnetism.png",

  standards: {
    ngss: ["3-PS2-3", "3-PS2-4", "MS-PS2-5"],
    gcse: [],
    ap: [],
  },
  category: "electricity",
  subject: "physics",
  gradeLevel: "3-5",
  tags: ["magnetism", "magnetic field", "poles", "attract repel", "compass", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "magnet1Strength",
      label: "Magnet 1 Strength",
      unit: "T",
      min: 0.1,
      max: 2,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "magnet2Polarity",
      label: "Magnet 2 Polarity (0=Same, 1=Opposite)",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "distance",
      label: "Distance Between Magnets",
      unit: "cm",
      min: 1,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "showEarth",
      label: "Show Earth's Field (0=No, 1=Yes)",
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
      latex: "F \\propto \\frac{m_1 m_2}{r^2} \\quad (\\text{magnetic force})",
      description: "Magnetic force decreases with the square of distance",
    },
    {
      latex: "\\text{N seeks S} \\quad \\text{(opposites attract, like poles repel)}",
      description: "Opposite magnetic poles attract; same poles repel",
    },
  ],

  theory:
    "Magnetism is a force produced by moving electric charges. All magnets have two poles: North (N) and South (S). Opposite poles attract each other; like poles repel each other. You cannot separate the poles — if you cut a magnet in half, each half becomes a new magnet with its own N and S pole. Magnetic fields are invisible regions of force that surround magnets, shown by field lines that go from N to S. Only certain materials (iron, nickel, cobalt, and their alloys) are attracted to magnets — these are called ferromagnetic materials. Earth itself behaves like a giant bar magnet, which is why compasses point north. The geographic North Pole is actually near Earth's magnetic South Pole (compass needles are attracted to it).",

  instructions:
    "Arrange the two magnets and watch the field lines appear. Set Polarity to Opposite — see the field lines connect between poles (attraction). Set to Same — field lines push away from each other (repulsion). Drag the distance slider and watch the force change. Enable Earth's Field (Pro) to see how a compass needle aligns.",

  challenges: [
    {
      id: "mag-c1",
      question: "If you cut a bar magnet in half, do you get one North pole piece and one South pole piece?",
      hint: "No! Each half becomes a complete magnet with its own North and South poles. You can never have a magnetic monopole — magnets always come in N-S pairs. Even at the atomic level, each iron atom is a tiny dipole magnet.",
      tier: "free",
    },
    {
      id: "mag-c2",
      question: "A compass always points toward geographic north. Is geographic north the same as magnetic north?",
      hint: "No — they're different. Geographic (true) North is Earth's rotational axis. Magnetic North is where Earth's magnetic field lines point down, which is near but not at the North Pole. The difference (declination) varies by location and changes slowly over time.",
      tier: "free",
    },
    {
      id: "mag-c3",
      question: "Why is iron attracted to magnets but aluminum is not?",
      hint: "Iron is ferromagnetic — its atoms have unpaired electrons that create tiny magnetic domains. When near a magnet, these domains align, making iron magnetic. Aluminum has no unpaired electrons available for this alignment, so it is non-magnetic.",
      tier: "free",
    },
    {
      id: "mag-c4",
      question: "If the magnetic force between two magnets doubles when the distance is halved, what type of relationship is this?",
      hint: "F ∝ 1/r² — an inverse square relationship. Halving distance (×½) quadruples force (×4). This is the same relationship as gravity and electric force — all follow the inverse square law at the macroscopic level.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-force-motion", "lorentz-force", "electric-field-lines"],

  seoTitle: "Magnetism for Kids | Magnetic Field Interactive | NeonPhysics Elementary",
  seoKeywords: [
    "magnetism kids simulation",
    "magnetic field lines interactive",
    "attract repel magnets elementary",
    "K-5 physics magnetism",
    "compass magnetic north kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Magnetism and Magnetic Fields",
  },
};
