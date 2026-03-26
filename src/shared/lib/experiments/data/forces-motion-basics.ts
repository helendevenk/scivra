import type { Experiment } from "@/shared/types/experiment";

export const forcesMotionBasics: Experiment = {
  id: "forces-motion-basics",
  slug: "forces-motion-basics-newtons-laws",
  title: "Forces and Motion: Basics",
  subtitle: "Push objects and observe Newton's laws in action",
  description:
    "Apply forces to objects on different surfaces and observe motion. Explore static and kinetic friction, net force, and acceleration in a simple, intuitive environment perfect for building Newton's Law intuition.",
  thumbnail: "/imgs/experiments/newton-laws.png",

  standards: {
    ngss: ["HS-PS2-1", "MS-PS2-1"],
    gcse: ["AQA P5.2", "AQA P5.3"],
    ap: ["3.A.1", "3.B.1", "3.B.2"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["Newton's laws", "force", "friction", "net force", "acceleration", "motion"],
  difficulty: "beginner",

  parameters: [
    { id: "applied_force", label: "Applied Force", unit: "N", min: 0, max: 500, default: 100, step: 5, tier: "free" },
    { id: "mass", label: "Object Mass", unit: "kg", min: 1, max: 100, default: 20, step: 1, tier: "free" },
    { id: "friction_coeff", label: "Friction Coefficient", unit: "", min: 0, max: 1, default: 0.2, step: 0.01, tier: "free" },
    { id: "surface", label: "Surface Type", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "F_{net} = ma", description: "Newton's Second Law" },
    { latex: "F_{friction} = \\mu_k mg", description: "Kinetic friction force" },
    { latex: "F_{net} = F_{applied} - F_{friction}", description: "Net force" },
  ],

  theory:
    "Newton's Second Law states that the net force on an object equals its mass times acceleration. Friction opposes motion and depends on the normal force and friction coefficient. Static friction prevents motion up to a maximum threshold; kinetic friction acts during sliding. The force diagram (free body diagram) shows all forces acting on the object, and their vector sum gives the net force.",
  instructions:
    "Use the force arrows to push the object. The free body diagram updates in real time. Enable the force chart to see applied force, friction force, and net force over time. Change surfaces to see different friction coefficients in action.",
  challenges: [
    { id: "fm-c1", question: "A 20kg box has μ_k = 0.3. What applied force is needed to accelerate it at 2 m/s²?", hint: "F_net = ma = 20×2=40N; F_applied = F_net + F_friction = 40 + 0.3×20×9.8", tier: "free" },
    { id: "fm-c2", question: "What is the minimum force to keep a 20kg box moving at constant velocity with μ_k = 0.3?", hint: "Constant velocity → F_net = 0 → F_applied = F_friction = μmg", tier: "free" },
    { id: "fm-c3", question: "Why does a heavier box accelerate the same as a lighter one at the same force/mass ratio?", hint: "F/m = a; if you scale both F and m by the same factor, a is unchanged", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["newtons-laws", "friction-lab", "kinematics-graphs"],

  seoTitle: "Forces and Motion Basics | Newton's Laws Simulation | AP Physics 1",
  seoKeywords: ["forces and motion", "Newton's laws", "friction", "net force", "AP Physics 1", "free body diagram"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Newton's Laws, Net Force, Friction" },
};
