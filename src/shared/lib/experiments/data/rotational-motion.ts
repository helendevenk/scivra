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
  primaryStandard: "ap-physics-1",
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

  hook: {
    question:
      "Why do figure skaters spin faster when they pull their arms in?",
    context:
      "No extra push, no extra energy input — yet they visibly accelerate. The answer lies in angular momentum conservation.",
    actionPrompt: "Try it with the virtual skater",
  },

  learningCards: [
    {
      id: "rm-lc1",
      title: "Moment of Inertia",
      content:
        "Moment of inertia is the rotational equivalent of mass — it measures how hard it is to change an object's rotation. Unlike mass, it depends on how the mass is distributed relative to the axis. Moving mass farther from the axis dramatically increases the moment of inertia.",
      formula: {
        latex: "I = \\sum m_i r_i^2",
        description: "Moment of inertia depends on mass distribution",
      },
      relatedParameterId: "inertia",
    },
    {
      id: "rm-lc2",
      title: "Angular Momentum Conservation",
      content:
        "When no external torque acts on a system, angular momentum L = Iw is conserved. If the moment of inertia decreases (arms pulled in), angular velocity must increase proportionally. This is why a skater pulling in their arms can triple their spin rate.",
      formula: {
        latex: "I_1\\omega_1 = I_2\\omega_2",
        description: "Angular momentum is conserved when net external torque is zero",
      },
      relatedParameterId: "armRadius",
    },
    {
      id: "rm-lc3",
      title: "Torque: The Rotational Force",
      content:
        "Torque is what causes angular acceleration, just as force causes linear acceleration. It depends on three factors: the magnitude of the force, the distance from the pivot (lever arm), and the angle of application. This is why longer wrenches make bolts easier to turn.",
      formula: {
        latex: "\\tau = rF\\sin\\theta = I\\alpha",
        description: "Torque equals moment of inertia times angular acceleration",
      },
      relatedParameterId: "torque",
    },
    {
      id: "rm-lc4",
      title: "Rotational Kinetic Energy",
      content:
        "A spinning object carries kinetic energy even if its center of mass is stationary. When a skater pulls in their arms, their rotational KE actually increases — the extra energy comes from the work done by their muscles pulling inward against centripetal acceleration.",
      formula: {
        latex: "KE_{rot} = \\frac{1}{2}I\\omega^2",
        description: "Rotational kinetic energy",
      },
    },
  ],

  easterEggs: [
    {
      parameterId: "torque",
      condition: "max",
      effect: "The disk spins up to extreme angular velocity within seconds, trailing motion blur",
      message: "20 N·m of torque! That is roughly the force needed to snap a thick tree branch — applied rotationally.",
    },
    {
      parameterId: "armRadius",
      condition: "min",
      effect: "The skater spins at incredible speed with arms tucked in tightly",
      message: "Arms fully tucked! Watch the angular velocity skyrocket as moment of inertia plummets.",
    },
  ],

  challenges: [
    {
      id: "rm-c1",
      question: "A disk (I = 2 kg·m²) has a net torque of 8 N·m applied. What is its angular acceleration?",
      options: ["2 rad/s²", "4 rad/s²", "8 rad/s²", "16 rad/s²"],
      correctAnswer: "4 rad/s²",
      hint: "α = τ/I",
      relatedParameterId: "torque",
      tier: "free",
    },
    {
      id: "rm-c2",
      question: "A skater spins at 2 rad/s with I = 4 kg·m². They pull in arms to I = 1 kg·m². New ω?",
      options: ["2 rad/s", "4 rad/s", "8 rad/s", "16 rad/s"],
      correctAnswer: "8 rad/s",
      hint: "L = Iω is conserved: I₁ω₁ = I₂ω₂",
      relatedParameterId: "armRadius",
      tier: "free",
    },
    {
      id: "rm-c3",
      question: "Why does a longer wrench make it easier to loosen a bolt?",
      options: [
        "It increases the force you apply",
        "It increases the lever arm, producing more torque for the same force",
        "It reduces friction at the bolt",
        "It changes the angle of the applied force",
      ],
      correctAnswer: "It increases the lever arm, producing more torque for the same force",
      hint: "τ = rF — larger r means larger torque for same force",
      tier: "free",
    },
    {
      id: "rm-c4",
      question: "A solid disk (I = ½MR²) and a hollow ring (I = MR²) of equal mass and radius start from rest on an incline. Which reaches the bottom first?",
      options: [
        "The hollow ring (more rotational inertia helps)",
        "The solid disk (lower I means more translational KE)",
        "They arrive at the same time",
        "It depends on the angle of the incline",
      ],
      correctAnswer: "The solid disk (lower I means more translational KE)",
      hint: "Lower I → more of PE converts to translational KE. Use energy conservation.",
      relatedParameterId: "inertia",
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
