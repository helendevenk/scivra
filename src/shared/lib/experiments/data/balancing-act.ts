import type { Experiment } from "@/shared/types/experiment";

export const balancingAct: Experiment = {
  id: "balancing-act",
  slug: "balancing-act-torque",
  title: "Balancing Act",
  subtitle: "Discover torque and rotational equilibrium",
  description:
    "Place masses on a balance beam and discover what it takes to maintain equilibrium. Explore torque, the law of moments, and center of mass in an interactive setting.",
  thumbnail: "/imgs/experiments/newton-laws.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P5.4"],
    ap: ["3.F.1", "3.F.2"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["torque", "equilibrium", "center of mass", "moments", "rotational balance"],
  difficulty: "beginner",

  parameters: [
    { id: "mass1", label: "Mass 1", unit: "kg", min: 0.1, max: 10, default: 1, step: 0.1, tier: "free" },
    { id: "pos1", label: "Position 1", unit: "m", min: -3, max: -0.1, default: -2, step: 0.1, tier: "free" },
    { id: "mass2", label: "Mass 2", unit: "kg", min: 0.1, max: 10, default: 2, step: 0.1, tier: "free" },
    { id: "pos2", label: "Position 2", unit: "m", min: 0.1, max: 3, default: 1, step: 0.1, tier: "free" },
    { id: "mass3", label: "Mass 3", unit: "kg", min: 0.1, max: 10, default: 1, step: 0.1, tier: "pro" },
  ],

  formulas: [
    { latex: "\\tau = r \\times F", description: "Torque" },
    { latex: "\\sum \\tau = 0", description: "Rotational equilibrium condition" },
    { latex: "\\tau = m \\cdot g \\cdot d", description: "Torque from weight" },
  ],

  theory:
    "An object is in rotational equilibrium when the net torque about any pivot point is zero. Torque is the product of force and the perpendicular distance from the pivot (lever arm). The law of moments states that clockwise torques must equal counterclockwise torques for balance. This principle underlies levers, seesaws, and structural engineering.",
  instructions:
    "Drag masses onto the balance beam. The beam tilts when torques are unequal. Balance by adjusting mass values or positions. Use the ruler to measure lever arm distances.",
  challenges: [
    { id: "ba-c1", question: "Place a 2kg mass at 1m left. Where must a 4kg mass go to balance?", hint: "Use τ = mgd: 2×1 = 4×d", tier: "free" },
    { id: "ba-c2", question: "Can two equal masses at equal distances ever be unbalanced?", hint: "Think about what torque = r × F means when r and F are equal", tier: "free" },
    { id: "ba-c3", question: "Where is the center of mass of three unequal masses?", hint: "x_cm = Σ(m_i × x_i) / Σm_i", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["rotational-motion", "forces-motion-basics"],

  seoTitle: "Balancing Act — Torque and Equilibrium Simulation | AP Physics 1",
  seoKeywords: ["torque", "equilibrium", "balance", "center of mass", "AP Physics 1", "rotational mechanics"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Torque, Rotational Equilibrium" },
};
