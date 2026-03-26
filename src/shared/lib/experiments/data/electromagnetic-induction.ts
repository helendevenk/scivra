import type { Experiment } from "@/shared/types/experiment";

export const electromagneticInduction: Experiment = {
  id: "electromagnetic-induction",
  slug: "electromagnetic-induction-faradays-law-lenz",
  title: "Electromagnetic Induction",
  subtitle: "See how changing magnetic flux generates EMF — Faraday's and Lenz's Laws in action",
  description:
    "Rotate a coil inside a magnetic field and observe the sinusoidal EMF produced. Adjust field strength, coil turns, angular velocity, and area to explore Faraday's Law quantitatively and discover why Lenz's Law is a direct consequence of energy conservation.",
  thumbnail: "/imgs/experiments/electromagnetic-induction.png",

  standards: {
    ngss: ["HS-PS2-5", "HS-PS3-5"],
    gcse: ["P7.3", "P7.4"],
    ap: ["CHA-4.B", "CHA-4.C", "CHA-4.D"],
  },
  primaryStandard: "ap-physics-c",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "electromagnetic induction",
    "Faraday's law",
    "Lenz's law",
    "magnetic flux",
    "EMF",
    "generator",
    "coil",
  ],
  difficulty: "advanced",

  parameters: [
    {
      id: "B_field",
      label: "Magnetic Field",
      unit: "T",
      min: 0.1,
      max: 2.0,
      default: 0.5,
      step: 0.1,
      tier: "free",
    },
    {
      id: "rotation_speed",
      label: "Angular Velocity",
      unit: "rad/s",
      min: 0.1,
      max: 10,
      default: 2,
      step: 0.1,
      tier: "free",
    },
    {
      id: "coil_turns",
      label: "Turns (N)",
      unit: "",
      min: 1,
      max: 200,
      default: 50,
      step: 1,
      tier: "pro",
    },
    {
      id: "coil_area",
      label: "Coil Area",
      unit: "cm²",
      min: 10,
      max: 500,
      default: 100,
      step: 10,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\Phi = B \\cdot A \\cdot \\cos(\\theta)",
      description: "Magnetic Flux",
    },
    {
      latex: "\\varepsilon = -N\\frac{d\\Phi}{dt}",
      description: "Faraday's Law of Induction",
    },
    {
      latex: "\\varepsilon = NBA\\omega\\sin(\\omega t)",
      description: "Peak EMF for rotating coil",
    },
    {
      latex: "\\text{Lenz's Law: induced current opposes change in flux}",
      description: "Direction of induced current",
    },
  ],

  theory:
    "Faraday's Law states that the induced EMF in a coil equals the negative rate of change of magnetic flux through it: ε = −N dΦ/dt. For a coil of N turns and area A rotating at angular velocity ω in field B, the flux varies as Φ = BA cos(ωt), giving a peak EMF of NBAω. Lenz's Law determines the polarity of the induced EMF: it always opposes the change that caused it, which is a direct statement of energy conservation.",
  instructions:
    "Use the B field and angular velocity sliders to change the EMF waveform and watch the real-time graph. Unlock Pro mode to vary coil turns and area, then verify that peak EMF scales linearly with each parameter.",

  challenges: [
    {
      id: "ei-c1",
      question:
        "A single-turn coil of area 0.01 m² rotates at ω = 10 rad/s in B = 0.5 T. What is the peak EMF?",
      hint: "Use ε_peak = NBAω with N = 1",
      tier: "free",
    },
    {
      id: "ei-c2",
      question: "What physical law does Lenz's Law ultimately conserve?",
      hint: "Think about what would happen if induced current aided the flux change",
      tier: "free",
    },
    {
      id: "ei-c3",
      question: "If the number of turns N is doubled, how does the peak EMF change?",
      hint: "Look at the formula ε_peak = NBAω",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["lorentz-force", "dc-circuits-basic", "electric-field-lines"],

  seoTitle: "Electromagnetic Induction — Faraday's Law & Lenz's Law Simulation | NeonPhysics",
  seoKeywords: [
    "electromagnetic induction",
    "Faraday's law",
    "Lenz's law",
    "magnetic flux",
    "induced EMF",
    "generator simulation",
    "AP Physics electricity",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Electromagnetic Induction, Faraday's Law, and Lenz's Law",
  },
};
