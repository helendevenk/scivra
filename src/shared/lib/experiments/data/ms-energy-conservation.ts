import type { Experiment } from "@/shared/types/experiment";

export const msEnergyConservation: Experiment = {
  id: "ms-energy-conservation",
  slug: "ms-energy-conservation",
  title: "Energy Conservation & Transformation",
  subtitle: "Mechanical energy, heat, and the first law of thermodynamics",
  description:
    "Track energy through a roller coaster, pendulum, and bouncing ball. Watch kinetic and potential energy trade places while total mechanical energy stays constant. Add friction to see energy 'leak' into heat. Discover why perpetual motion is impossible.",
  thumbnail: "/imgs/experiments/ms-energy-conservation.png",

  standards: {
    ngss: ["MS-PS3-1", "MS-PS3-2", "MS-PS3-5"],
    gcse: ["P1.1", "P1.2"],
    ap: [],
  },
  category: "mechanics",
  subject: "physics",
  gradeLevel: "6-8",
  tags: ["energy conservation", "kinetic energy", "potential energy", "thermodynamics", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "initialHeight",
      label: "Release Height",
      unit: "m",
      min: 1,
      max: 20,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "mass",
      label: "Object Mass",
      unit: "kg",
      min: 0.5,
      max: 10,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "airResistance",
      label: "Air Resistance",
      unit: "%",
      min: 0,
      max: 50,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "scenario",
      label: "Scenario (0=Drop, 1=Pendulum, 2=Roller Coaster)",
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
      latex: "E_{mech} = KE + PE = \\frac{1}{2}mv^2 + mgh = \\text{const}",
      description: "Total mechanical energy = kinetic + potential (conserved without friction)",
    },
    {
      latex: "v = \\sqrt{2gh} \\quad \\text{(velocity from height)}",
      description: "Speed at bottom of drop: all PE converted to KE",
    },
  ],

  theory:
    "The Law of Conservation of Energy states that energy cannot be created or destroyed, only transformed from one form to another. In mechanical systems (no friction), kinetic energy (KE = ½mv²) and gravitational potential energy (PE = mgh) continuously convert between each other while their sum stays constant. At the highest point: all PE, no KE. At the lowest point: all KE, no PE. When friction is present, mechanical energy decreases as some converts to thermal energy (heat). The total energy of the universe remains constant — this is the First Law of Thermodynamics (ΔU = Q - W). Perpetual motion machines are impossible because friction always converts some mechanical energy to heat.",

  instructions:
    "Set the initial height and watch the ball drop. The energy bar chart shows PE decreasing and KE increasing as the ball falls. At the bottom, all PE has become KE. Add air resistance to watch total mechanical energy decrease — energy isn't lost, it becomes heat!",

  challenges: [
    {
      id: "ec-ms-c1",
      question: "A 2 kg ball is dropped from 15 m. What is its speed just before hitting the ground? (g=10 m/s²)",
      hint: "All PE converts to KE: mgh = ½mv² → v = √(2gh) = √(2×10×15) = √300 ≈ 17.3 m/s",
      tier: "free",
    },
    {
      id: "ec-ms-c2",
      question: "A pendulum is released from 2 m height. How high does it swing on the other side (no friction)?",
      hint: "Energy is conserved: it rises to exactly 2 m on the other side. PE at start = PE at end. With friction, it swings slightly lower each time.",
      tier: "free",
    },
    {
      id: "ec-ms-c3",
      question: "If a ball loses 40% of its energy to heat when it bounces, from what height will it bounce back if dropped from 5 m?",
      hint: "After bounce: 60% of original energy remains. PE_after = 0.60 × mgh = 0.60 × mg × 5 → h_after = 0.60 × 5 = 3 m.",
      tier: "free",
    },
    {
      id: "ec-ms-c4",
      question: "In a roller coaster, the first hill must be the tallest. Why? What would happen if a later hill were taller?",
      hint: "Energy is lost to friction and air resistance at each hill. The coaster cannot gain energy from nothing. If a later hill were higher than the first, the coaster wouldn't have enough energy to clear it — it would stop and roll back.",
      tier: "pro",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 14,
  relatedExperiments: ["ms-newtons-laws", "k5-energy-conversion", "roller-coaster"],

  seoTitle: "Energy Conservation Middle School | NeonPhysics Interactive Physics",
  seoKeywords: [
    "energy conservation middle school simulation",
    "kinetic potential energy interactive",
    "pendulum energy simulation 6-8",
    "conservation of energy middle school",
    "roller coaster energy physics",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Energy Conservation and Transformation",
  },
};
