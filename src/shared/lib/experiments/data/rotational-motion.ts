import type { Experiment } from "@/shared/types/experiment";

export const rotationalMotion: Experiment = {
  id: "rotational-motion",
  slug: "rotational-motion",
  title: "Rotational Motion & Torque",
  subtitle: "Angular momentum, moment of inertia, and spinning objects",
  description:
    "Apply torques to rotating objects and watch angular momentum conservation in action. See a spinning skater pull in their arms to spin faster — the same physics that governs everything from planets to gyroscopes.",
  thumbnail: "/imgs/experiments/rotational-motion.png",

  standards: {
    ngss: ["HS-PS2-1", "HS-PS2-2"],
    gcse: ["P5.5"],
    ap: ["3.F.1", "3.F.2", "3.F.3", "4.D.1", "4.D.2", "4.D.3"],
  },
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["torque", "angular momentum", "moment of inertia", "rotational kinematics", "AP Physics 1"],
  difficulty: "advanced",

  parameters: [
    {
      id: "torque",
      label: "Applied Torque (τ)",
      unit: "N·m",
      min: 0,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "inertia",
      label: "Moment of Inertia (I)",
      unit: "kg·m²",
      min: 0.5,
      max: 10,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "armRadius",
      label: "Skater Arm Radius",
      unit: "m",
      min: 0.2,
      max: 1.5,
      default: 0.8,
      step: 0.05,
      tier: "free",
    },
    {
      id: "mass",
      label: "Skater Mass (m)",
      unit: "kg",
      min: 30,
      max: 120,
      default: 60,
      step: 5,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\tau = rF\\sin\\theta = I\\alpha",
      description: "Torque (rotational equivalent of F=ma)",
    },
    {
      latex: "L = I\\omega",
      description: "Angular momentum",
    },
    {
      latex: "L_i = L_f \\Rightarrow I_1\\omega_1 = I_2\\omega_2",
      description: "Conservation of angular momentum",
    },
    {
      latex: "I = \\sum m_i r_i^2",
      description: "Moment of inertia (depends on mass distribution)",
    },
    {
      latex: "KE_{rot} = \\frac{1}{2}I\\omega^2",
      description: "Rotational kinetic energy",
    },
  ],

  theory:
    "Torque is the rotational equivalent of force: τ = rF sinθ. The rotational equivalent of Newton's 2nd Law is τ = Iα. Angular momentum L = Iω is conserved when no external torque acts — this is why a spinning skater spins faster when they pull in their arms (reducing I increases ω to keep L constant). The moment of inertia I depends on how mass is distributed relative to the rotation axis.",

  instructions:
    "Apply torque to spin the disk. Observe angular acceleration α = τ/I. Then switch to the skater mode: start spinning with arms out, then pull them in and watch ω increase. The angular momentum display confirms conservation. Adjust the arm radius and watch the dramatic effect on spin speed.",

  challenges: [
    {
      id: "rm-c1",
      question: "A disk (I = 2 kg·m²) has a net torque of 8 N·m applied. What is its angular acceleration?",
      hint: "α = τ/I",
      tier: "free",
    },
    {
      id: "rm-c2",
      question: "A skater spins at 2 rad/s with I = 4 kg·m². They pull in arms to I = 1 kg·m². New ω?",
      hint: "L = Iω is conserved: I₁ω₁ = I₂ω₂",
      tier: "free",
    },
    {
      id: "rm-c3",
      question: "Why does a longer wrench make it easier to loosen a bolt?",
      hint: "τ = rF — larger r means larger torque for same force",
      tier: "free",
    },
    {
      id: "rm-c4",
      question: "A solid disk (I = ½MR²) and a hollow ring (I = MR²) of equal mass and radius start from rest on an incline. Which reaches the bottom first?",
      hint: "Lower I → more of PE converts to translational KE. Use energy conservation.",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "pro",
  estimatedTime: 20,
  relatedExperiments: ["circular-motion", "newtons-laws"],

  seoTitle: "Rotational Motion & Torque — Interactive 3D Simulation | NeonPhysics",
  seoKeywords: [
    "rotational motion simulation",
    "torque angular momentum",
    "moment of inertia",
    "AP Physics 1 rotation",
    "angular momentum conservation",
    "spinning skater physics",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Rotational Motion and Angular Momentum",
  },
};
