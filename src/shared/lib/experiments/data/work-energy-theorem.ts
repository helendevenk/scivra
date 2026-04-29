import type { Experiment } from "@/shared/types/experiment";

export const workEnergyTheorem: Experiment = {
  id: "work-energy-theorem",
  slug: "work-energy-theorem-power",
  title: "Work-Energy Theorem",
  subtitle: "Net work equals change in kinetic energy on inclined surfaces",
  description:
    "Place a block on an adjustable incline and apply forces to explore how net work changes kinetic energy. Visualize energy flow between gravitational PE, KE, and thermal energy. Measure instantaneous power and verify the work-energy theorem across multiple friction scenarios.",
  thumbnail: "/imgs/experiments/work-energy-theorem.png",

  standards: {
    ngss: ["HS-PS3-1", "HS-PS3-2", "HS-PS3-3"],
    gcse: ["P4.2", "P4.3"],
    ap: ["INT-3.A", "INT-3.B", "INT-3.C", "INT-3.D"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["work", "energy", "kinetic energy", "power", "friction", "incline", "AP Physics 1", "work-energy theorem"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "mass",
      label: "Mass",
      unit: "kg",
      min: 0.5,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "angle",
      label: "Incline Angle",
      unit: "°",
      min: 10,
      max: 75,
      default: 30,
      step: 1,
      tier: "free",
    },
    {
      id: "friction_coeff",
      label: "Friction Coefficient (μ)",
      unit: "",
      min: 0,
      max: 0.8,
      default: 0,
      step: 0.01,
      tier: "pro",
    },
    {
      id: "applied_force",
      label: "Applied Force",
      unit: "N",
      min: 0,
      max: 100,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "W_{net} = \\Delta KE = \\frac{1}{2}mv^2 - \\frac{1}{2}mv_0^2",
      description: "Work-Energy Theorem: net work equals change in kinetic energy",
    },
    {
      latex: "W = F \\cdot d \\cdot \\cos\\theta",
      description: "Work done by a constant force over displacement",
    },
    {
      latex: "P = \\frac{W}{t} = F \\cdot v",
      description: "Power: rate of doing work or force times velocity",
    },
    {
      latex: "\\Delta E_{mech} = W_{friction} = -\\mu mg\\cos\\theta \\cdot d",
      description: "Mechanical energy lost to friction on the incline",
    },
  ],

  theory:
    "The work-energy theorem states that the net work done on an object equals its change in kinetic energy. On an incline, multiple forces act simultaneously: gravity component along the slope, normal force, friction, and any applied force. Only forces with a component along the displacement do work. Friction converts mechanical energy to thermal energy, reducing the net kinetic energy gain. Power measures how quickly work is performed — the same task done in less time requires more power. Understanding this theorem bridges Newton's force-based approach with the energy-based perspective essential for thermodynamics and modern physics.",

  instructions:
    "Set the block mass and incline angle. Press Play to release the block and observe its acceleration down the slope. Watch the energy bar chart showing KE, gravitational PE, and thermal energy. Enable friction via the μ slider (Pro) to see energy dissipation. Add an applied force pushing the block up the slope. The work readout shows W_gravity, W_friction, W_applied, and W_net — verify that W_net = ΔKE at every snapshot.",

  hook: {
    question: "If you push a box twice as far, do you do twice the work?",
    context: "Only if the force stays constant — in the real world, friction, angles, and changing forces make the answer surprisingly nuanced.",
    actionPrompt: "Apply a force on the incline and watch the work accumulate in real-time",
  },

  learningCards: [
    {
      id: "wet-lc1",
      title: "What Is Work?",
      content: "Work is energy transferred by a force acting over a displacement. Only the component of force parallel to the displacement does work. A force perpendicular to motion (like the normal force on a flat surface) does zero work, no matter how large it is.",
      formula: { latex: "W = F \\cdot d \\cdot \\cos\\theta", description: "Work done by a constant force" },
      relatedParameterId: "applied_force",
    },
    {
      id: "wet-lc2",
      title: "Kinetic Energy",
      content: "Kinetic energy is the energy of motion: ½mv². It depends on both mass and the square of velocity — so doubling speed quadruples kinetic energy. This is why car crashes at high speed are so much more devastating than at low speed.",
      formula: { latex: "KE = \\frac{1}{2}mv^2", description: "Kinetic energy" },
      relatedParameterId: "mass",
    },
    {
      id: "wet-lc3",
      title: "The Work-Energy Theorem",
      content: "The net work done on an object equals its change in kinetic energy. This powerful theorem connects force-based analysis (Newton's laws) with energy-based analysis. It works even when multiple forces act simultaneously — just sum all the work contributions.",
      formula: { latex: "W_{net} = \\Delta KE = \\frac{1}{2}mv_f^2 - \\frac{1}{2}mv_i^2", description: "Net work equals change in kinetic energy" },
      relatedParameterId: "angle",
    },
    {
      id: "wet-lc4",
      title: "Conservative vs Non-Conservative Forces",
      content: "Gravity is conservative — work depends only on height change, not the path taken. Friction is non-conservative — it always removes mechanical energy as heat. On an incline with friction, the block gains less kinetic energy than gravity alone would provide because friction steals some as thermal energy.",
      formula: { latex: "W_{friction} = -\\mu mg\\cos\\theta \\cdot d", description: "Work done by friction (always negative)" },
      relatedParameterId: "friction_coeff",
    },
  ],

  easterEggs: [
    {
      parameterId: "applied_force",
      condition: "max",
      effect: "extreme-acceleration-rocket-visual",
      message: "100 N on that block? It's accelerating faster than a sports car!",
    },
    {
      parameterId: "angle",
      condition: "max",
      effect: "nearly-vertical-cliff-visual",
      message: "75° — that's not an incline, that's practically a cliff!",
    },
    {
      parameterId: "friction_coeff",
      condition: "max",
      effect: "sticky-surface-glue-visual",
      message: "μ = 0.8 — this surface is stickier than rubber on asphalt!",
    },
  ],

  challenges: [
    {
      id: "wet-c1",
      question: "A 5 kg block slides from rest at h = 2 m on a frictionless incline. What is its speed at the bottom?",
      options: ["v ≈ 4.43 m/s", "v ≈ 6.26 m/s", "v ≈ 9.90 m/s", "v ≈ 3.13 m/s"],
      correctAnswer: "v ≈ 6.26 m/s",
      hint: "W_net = W_gravity = mgh. Then ½mv² = mgh → v = √(2gh)",
      relatedParameterId: "mass",
      tier: "free",
    },
    {
      id: "wet-c2",
      question: "With μ = 0.3 on a 30° incline, length d = 4 m, how much energy is lost to friction?",
      options: ["W_f ≈ 50.9 J", "W_f ≈ 58.9 J", "W_f ≈ 29.4 J", "W_f ≈ 98.1 J"],
      correctAnswer: "W_f ≈ 50.9 J",
      hint: "W_friction = μ·mg·cos30°·d. Normal force on incline = mg·cosθ",
      relatedParameterId: "friction_coeff",
      tier: "free",
    },
    {
      id: "wet-c3",
      question: "A 5 kg block reaches 6 m/s after 10 seconds on the incline. What is the average power delivered by net force?",
      options: ["P = 9 W", "P = 18 W", "P = 30 W", "P = 90 W"],
      correctAnswer: "P = 9 W",
      hint: "W_net = ΔKE = ½mv². P_avg = W_net / t",
      relatedParameterId: "mass",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["roller-coaster", "momentum-collisions", "newtons-laws"],

  seoTitle: "Work-Energy Theorem — Interactive Incline Lab | Scivra",
  seoKeywords: [
    "work energy theorem simulation",
    "kinetic energy incline",
    "net work calculator",
    "power physics",
    "AP Physics 1 work energy",
    "friction energy loss",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Work-Energy Theorem and Power",
  },
};
