import type { Experiment } from "@/shared/types/experiment";

export const k5EnergyConversion: Experiment = {
  id: "k5-energy-conversion",
  slug: "k5-energy-conversion",
  title: "Energy Conversion",
  subtitle: "How energy changes forms — kinetic, potential, thermal, light",
  description:
    "Follow energy as it converts between forms: gravitational potential energy → kinetic energy → thermal energy. Drop a ball and watch the energy bar chart change in real time. Build a solar panel system and trace the path from light energy to electrical energy to mechanical motion.",
  thumbnail: "/imgs/experiments/k5-energy-conversion.png",

  standards: {
    ngss: ["4-PS3-2", "4-PS3-4", "5-PS3-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "3-5",
  tags: ["energy", "kinetic energy", "potential energy", "conservation", "energy conversion", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "dropHeight",
      label: "Drop Height",
      unit: "m",
      min: 1,
      max: 20,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "ballMass",
      label: "Ball Mass",
      unit: "kg",
      min: 0.1,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "surfaceLoss",
      label: "Energy Lost to Heat (bounce)",
      unit: "%",
      min: 0,
      max: 80,
      default: 20,
      step: 5,
      tier: "free",
    },
    {
      id: "energyType",
      label: "Scenario (0=Drop, 1=Roller Coaster, 2=Solar)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "PE = mgh \\quad KE = \\frac{1}{2}mv^2",
      description: "Gravitational PE and kinetic energy formulas",
    },
    {
      latex: "E_{\\text{total}} = PE + KE = \\text{constant}",
      description: "Conservation of energy — total energy is always preserved",
    },
  ],

  theory:
    "Energy cannot be created or destroyed — only transformed from one form to another. This is the Law of Conservation of Energy. Common energy forms include: kinetic energy (motion), gravitational potential energy (height), thermal energy (heat), light energy (photons), electrical energy, and chemical energy. When a ball is dropped, gravitational PE converts to kinetic energy as it falls. On impact, kinetic energy converts to thermal energy (heat) and sound. The total energy remains constant throughout, just in different forms. In real systems, energy often 'leaks' to thermal energy (friction, air resistance), which is why perpetual motion machines are impossible.",

  instructions:
    "Set the drop height and watch the energy bar chart as the ball falls. PE starts high and decreases while KE increases — but their sum stays constant! Increase Surface Loss to simulate bouncing with energy loss. Try the Roller Coaster scenario (Pro) to see energy conversion along a track.",

  challenges: [
    {
      id: "ec-c1",
      question: "A 1 kg ball is at 10 m height. How much potential energy does it have? (g = 10 m/s²)",
      hint: "PE = mgh = 1 × 10 × 10 = 100 J. This converts completely to kinetic energy just before it hits the ground.",
      tier: "free",
    },
    {
      id: "ec-c2",
      question: "At half the drop height, what fraction of energy is kinetic? What fraction is potential?",
      hint: "At half height, PE = half the original (still mgh/2). By conservation, KE = other half. So 50% PE and 50% KE.",
      tier: "free",
    },
    {
      id: "ec-c3",
      question: "Name 3 energy conversions that happen when you turn on a light bulb.",
      hint: "1) Chemical energy (in the power plant fuel) → Electrical energy. 2) Electrical energy → Light energy + Thermal energy (the bulb gets hot). 3) Light energy → Thermal energy (when it warms objects).",
      tier: "free",
    },
    {
      id: "ec-c4",
      question: "A 2 kg ball is dropped from 5 m and bounces to 3 m. How much energy was lost to heat?",
      hint: "Initial PE = 2×10×5 = 100 J. Final PE after bounce = 2×10×3 = 60 J. Energy lost = 100-60 = 40 J (converted to thermal energy and sound on impact).",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-force-motion", "k5-simple-machines", "roller-coaster"],

  seoTitle: "Energy Conversion for Kids | Scivra Elementary Science",
  seoKeywords: [
    "energy conversion kids simulation",
    "kinetic potential energy interactive",
    "conservation of energy elementary",
    "K-5 physics energy",
    "energy forms simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Energy Conversion and Conservation",
  },
};
