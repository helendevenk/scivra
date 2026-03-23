import type { Experiment } from "@/shared/types/experiment";

export const projectileMotion: Experiment = {
  id: "projectile-motion",
  slug: "projectile-motion",
  title: "Projectile Motion",
  subtitle: "Launch, arc, and land",
  description:
    "Fire projectiles at different angles and velocities. Trace parabolic trajectories, measure range and max height, and discover why 45° gives maximum distance.",
  thumbnail: "/imgs/experiments/projectile-motion.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["P5.6"],
    ap: ["3.A.1", "3.E.1"],
  },
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["projectile", "trajectory", "parabola", "range", "angle"],
  difficulty: "beginner",

  parameters: [
    {
      id: "velocity",
      label: "Initial Velocity",
      unit: "m/s",
      min: 1,
      max: 100,
      default: 30,
      step: 1,
      tier: "free",
    },
    {
      id: "angle",
      label: "Launch Angle",
      unit: "°",
      min: 0,
      max: 90,
      default: 45,
      step: 1,
      tier: "free",
    },
    {
      id: "gravity",
      label: "Gravity",
      unit: "m/s²",
      min: 0.1,
      max: 25,
      default: 9.8,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "x = v_0 \\cos(\\theta) \\cdot t",
      description: "Horizontal position",
    },
    {
      latex: "y = v_0 \\sin(\\theta) \\cdot t - \\frac{1}{2}gt^2",
      description: "Vertical position",
    },
    {
      latex: "R = \\frac{v_0^2 \\sin(2\\theta)}{g}",
      description: "Range",
    },
    {
      latex: "H = \\frac{(v_0 \\sin\\theta)^2}{2g}",
      description: "Max height",
    },
  ],

  theory:
    "Projectile motion is the motion of an object thrown into the air, subject only to gravity. The horizontal and vertical components of motion are independent. The trajectory forms a parabola.",
  instructions:
    "Set the initial velocity and launch angle. Press play to fire the projectile. Observe the trajectory trace and compare range at different angles.",
  challenges: [
    {
      id: "pm-c1",
      question: "Which angle gives the maximum range?",
      hint: "Try angles between 30° and 60°",
      tier: "free",
    },
    {
      id: "pm-c2",
      question: "What is the flight time for v₀=50 m/s at 30°?",
      hint: "T = 2v₀sin(θ)/g",
      tier: "free",
    },
    {
      id: "pm-c3",
      question: "How does gravity on Mars (3.7 m/s²) affect the range?",
      hint: "Adjust the gravity slider",
      tier: "pro",
    },
  ],

  wave: 1,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["newtons-laws"],

  seoTitle: "Projectile Motion — Interactive 3D Simulation | SeePhysics",
  seoKeywords: [
    "projectile motion",
    "trajectory",
    "launch angle",
    "physics simulation",
    "parabolic motion",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Projectile Motion",
  },
};
