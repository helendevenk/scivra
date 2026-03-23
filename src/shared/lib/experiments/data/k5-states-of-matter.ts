import type { Experiment } from "@/shared/types/experiment";

export const k5StatesOfMatter: Experiment = {
  id: "k5-states-of-matter",
  slug: "k5-states-of-matter",
  title: "States of Matter",
  subtitle: "Solid, liquid, and gas — how heating and cooling change matter",
  description:
    "Heat and cool a substance to watch it transform between solid, liquid, and gas. See molecules move faster as temperature rises and slower as it drops. Discover the melting point and boiling point of common materials.",
  thumbnail: "/imgs/experiments/k5-states-of-matter.png",

  standards: {
    ngss: ["2-PS1-1", "5-PS1-3", "MS-PS1-4"],
    gcse: [],
    ap: [],
  },
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "3-5",
  tags: ["states of matter", "solid", "liquid", "gas", "melting", "boiling", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "temperature",
      label: "Temperature",
      unit: "°C",
      min: -50,
      max: 200,
      default: 20,
      step: 5,
      tier: "free",
    },
    {
      id: "substance",
      label: "Substance (0=Water, 1=Iron, 2=Nitrogen)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "pressure",
      label: "Pressure",
      unit: "atm",
      min: 0.1,
      max: 3,
      default: 1,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\text{Solid} \\xrightarrow{\\text{heat}} \\text{Liquid} \\xrightarrow{\\text{heat}} \\text{Gas}",
      description: "Adding heat changes matter from solid → liquid → gas",
    },
    {
      latex: "Q = mL \\quad (\\text{latent heat for phase change})",
      description: "Heat needed for phase change = mass × latent heat",
    },
  ],

  theory:
    "Matter exists in three main states: solid, liquid, and gas. In a solid, particles are packed tightly and vibrate in place — the substance has a definite shape and volume. In a liquid, particles can flow past each other — the substance has definite volume but takes the shape of its container. In a gas, particles move freely and fast — the substance has no definite shape or volume. Heating gives particles more energy; cooling takes it away. The temperature at which a solid becomes liquid is the melting point; the temperature at which liquid becomes gas is the boiling point. Different materials have different melting/boiling points.",

  instructions:
    "Drag the temperature slider to heat or cool the substance. Watch the molecule animation change — particles vibrate slowly (solid), flow (liquid), or zoom around (gas). Switch substances to compare melting and boiling points. See water freeze at 0°C and boil at 100°C.",

  challenges: [
    {
      id: "sm-c1",
      question: "At what temperature does water freeze? At what temperature does it boil?",
      hint: "Water freezes (liquid → solid) at 0°C and boils (liquid → gas) at 100°C at 1 atm pressure.",
      tier: "free",
    },
    {
      id: "sm-c2",
      question: "In which state do molecules move the fastest? The slowest?",
      hint: "Gas molecules move fastest (lots of energy, no attraction holds them). Solid molecules move slowest (tightly bonded, only vibrate).",
      tier: "free",
    },
    {
      id: "sm-c3",
      question: "Why does a gas fill its entire container but a liquid doesn't?",
      hint: "Gas molecules have enough energy to overcome any attraction between them, so they spread out to fill all available space. Liquid molecules stay together due to intermolecular forces.",
      tier: "free",
    },
    {
      id: "sm-c4",
      question: "Why does increasing pressure raise the boiling point of water?",
      hint: "Higher pressure pushes molecules closer, requiring more energy (higher temperature) for them to escape into the gas phase. At the top of a mountain (lower pressure), water boils below 100°C.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-energy-conversion", "thermochemistry"],

  seoTitle: "States of Matter Simulation for Kids | NeonPhysics Elementary",
  seoKeywords: [
    "states of matter kids",
    "solid liquid gas simulation",
    "melting boiling point interactive",
    "molecule animation elementary",
    "K-5 chemistry simulation",
    "phase change kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "States of Matter",
  },
};
