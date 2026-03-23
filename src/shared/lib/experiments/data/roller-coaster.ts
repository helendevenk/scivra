import type { Experiment } from "@/shared/types/experiment";

export const rollerCoaster: Experiment = {
  id: "roller-coaster",
  slug: "energy-conservation-roller-coaster",
  title: "Energy Conservation Roller Coaster",
  subtitle: "Ride the energy transformation",
  description:
    "Design a roller coaster track and watch kinetic and potential energy transform in real time. Verify conservation of mechanical energy at every point on the track.",
  thumbnail: "/imgs/experiments/energy-conservation.png",

  standards: {
    ngss: ["HS-PS3-1", "HS-PS3-2"],
    gcse: ["P1.1", "P1.3"],
    ap: ["4.C.1", "5.B.4"],
  },
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: [
    "energy",
    "conservation",
    "kinetic",
    "potential",
    "roller coaster",
    "gravity",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "initialHeight",
      label: "Initial Height",
      unit: "m",
      min: 5,
      max: 100,
      default: 30,
      step: 1,
      tier: "free",
    },
    {
      id: "mass",
      label: "Cart Mass",
      unit: "kg",
      min: 0.5,
      max: 50,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "friction",
      label: "Track Friction",
      unit: "",
      min: 0,
      max: 0.5,
      default: 0,
      step: 0.01,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "E_{total} = KE + PE = \\frac{1}{2}mv^2 + mgh",
      description: "Total mechanical energy",
    },
    {
      latex: "v = \\sqrt{2g(h_0 - h)}",
      description: "Velocity from energy conservation",
    },
    {
      latex: "KE = \\frac{1}{2}mv^2",
      description: "Kinetic energy",
    },
    {
      latex: "PE = mgh",
      description: "Gravitational potential energy",
    },
  ],

  theory:
    "The law of conservation of energy states that energy cannot be created or destroyed, only transformed. In a frictionless roller coaster, the total mechanical energy (KE + PE) remains constant. As the cart descends, PE converts to KE; as it climbs, KE converts back to PE.",
  instructions:
    "Set the initial height and mass. Press play to release the cart. Watch the energy bar chart update in real time. Enable friction to see energy dissipation.",
  challenges: [
    {
      id: "rc-c1",
      question: "What is the velocity at the bottom if released from 20m?",
      hint: "Use v = √(2gh)",
      tier: "free",
    },
    {
      id: "rc-c2",
      question: "Can the cart reach a hill higher than its starting point?",
      hint: "Think about total energy",
      tier: "free",
    },
    {
      id: "rc-c3",
      question: "How much energy is lost to friction over one full loop?",
      hint: "Compare total energy at start and end",
      tier: "pro",
    },
  ],

  wave: 1,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["newtons-laws"],

  seoTitle:
    "Energy Conservation Roller Coaster — Interactive 3D Simulation | SeePhysics",
  seoKeywords: [
    "energy conservation",
    "roller coaster physics",
    "kinetic potential energy",
    "physics simulation",
    "mechanical energy",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Conservation of Energy",
  },
};
