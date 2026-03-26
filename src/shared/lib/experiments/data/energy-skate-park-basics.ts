import type { Experiment } from "@/shared/types/experiment";

export const energySkateParkBasics: Experiment = {
  id: "energy-skate-park-basics",
  slug: "energy-skate-park-conservation",
  title: "Energy Skate Park: Basics",
  subtitle: "Explore energy conservation on a skate ramp",
  description:
    "Watch a skater ride a customizable ramp and observe energy transforming between kinetic and potential forms. Track energy bars in real time to verify conservation of mechanical energy.",
  thumbnail: "/imgs/experiments/energy-conservation.png",

  standards: {
    ngss: ["HS-PS3-1", "HS-PS3-2"],
    gcse: ["AQA P4.5", "AQA P4.6"],
    ap: ["5.B.3", "5.B.4", "5.B.5"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["energy conservation", "kinetic energy", "potential energy", "skate park", "mechanical energy"],
  difficulty: "beginner",

  parameters: [
    { id: "mass", label: "Skater Mass", unit: "kg", min: 10, max: 100, default: 60, step: 5, tier: "free" },
    { id: "start_height", label: "Starting Height", unit: "m", min: 0.5, max: 10, default: 4, step: 0.5, tier: "free" },
    { id: "friction", label: "Friction", unit: "", min: 0, max: 1, default: 0, step: 0.01, tier: "free" },
  ],

  formulas: [
    { latex: "E_{mech} = KE + PE = \\frac{1}{2}mv^2 + mgh", description: "Mechanical energy" },
    { latex: "E_{mech} = \\text{const}", description: "Conservation of energy (no friction)" },
    { latex: "v = \\sqrt{2gh}", description: "Speed at bottom from height h" },
  ],

  theory:
    "Mechanical energy is the sum of kinetic energy (KE = ½mv²) and gravitational potential energy (PE = mgh). When friction is absent, total mechanical energy is conserved — it converts between KE and PE but never disappears. Adding friction introduces thermal energy: total energy (KE + PE + thermal) is always conserved, but mechanical energy decreases. The skater slows down as energy transfers to heat.",
  instructions:
    "Place the skater on the ramp and press play. Watch the energy bars as the skater rises and falls. Enable friction to see energy converted to thermal energy. Try different ramp shapes — energy conservation holds for any shape.",
  challenges: [
    { id: "esp-c1", question: "A 60kg skater starts from 5m height. What is their speed at the bottom?", hint: "v = √(2gh) = √(2 × 9.8 × 5)", tier: "free" },
    { id: "esp-c2", question: "With friction enabled, can the skater reach the same height on the other side?", hint: "Friction converts some mechanical energy to thermal energy", tier: "free" },
    { id: "esp-c3", question: "How does mass affect the maximum speed at the bottom of the ramp?", hint: "v = √(2gh) — mass cancels out!", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["roller-coaster", "work-energy-theorem", "pendulum-lab"],

  seoTitle: "Energy Skate Park — Conservation of Energy | AP Physics 1 Simulation",
  seoKeywords: ["energy conservation", "kinetic energy", "potential energy", "skate park", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Conservation of Energy, Kinetic Energy, Potential Energy" },
};
