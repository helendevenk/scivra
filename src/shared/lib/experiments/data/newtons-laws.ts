import type { Experiment } from "@/shared/types/experiment";

export const newtonsLaws: Experiment = {
  id: "newtons-laws",
  slug: "newtons-laws-of-motion",
  title: "Newton's Laws of Motion",
  subtitle: "Explore force, mass, and acceleration",
  description:
    "Visualize all three of Newton's Laws in an interactive 3D environment. Apply forces to objects, observe inertia, and discover action-reaction pairs.",
  thumbnail: "/imgs/experiments/newton-laws.png",

  standards: {
    ngss: ["HS-PS2-1", "HS-PS2-3"],
    gcse: ["P5.1", "P5.2"],
    ap: ["3.A.1", "3.A.2", "3.B.1"],
  },
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["force", "mass", "acceleration", "inertia", "F=ma"],
  difficulty: "beginner",

  parameters: [
    {
      id: "mass",
      label: "Mass",
      unit: "kg",
      min: 0.1,
      max: 100,
      default: 5,
      step: 0.1,
      tier: "free",
    },
    {
      id: "force",
      label: "Applied Force",
      unit: "N",
      min: 0,
      max: 500,
      default: 50,
      step: 1,
      tier: "free",
    },
    {
      id: "friction",
      label: "Friction Coefficient",
      unit: "",
      min: 0,
      max: 1,
      default: 0.1,
      step: 0.01,
      tier: "pro",
    },
  ],

  formulas: [
    { latex: "F = ma", description: "Newton's Second Law" },
    { latex: "a = \\frac{F_{net}}{m}", description: "Acceleration" },
    {
      latex: "F_{friction} = \\mu \\cdot m \\cdot g",
      description: "Friction force",
    },
  ],

  theory:
    "Newton's three laws of motion form the foundation of classical mechanics. The first law (inertia) states that an object at rest stays at rest unless acted upon by a force. The second law relates force, mass, and acceleration. The third law states that every action has an equal and opposite reaction.",
  instructions:
    "Adjust the mass and force sliders to see how acceleration changes. Enable friction to observe real-world behavior. Watch the data panel for real-time values.",
  challenges: [
    {
      id: "nl-c1",
      question: "What happens to acceleration when you double the mass?",
      hint: "Think about F = ma",
      tier: "free",
    },
    {
      id: "nl-c2",
      question: "Find the force needed to accelerate 10kg at 5 m/s²",
      hint: "Use Newton's Second Law directly",
      tier: "free",
    },
    {
      id: "nl-c3",
      question:
        "At what friction coefficient does the object stop accelerating?",
      hint: "When friction force equals applied force",
      tier: "pro",
    },
  ],

  wave: 1,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["projectile-motion", "roller-coaster"],

  seoTitle: "Newton's Laws of Motion — Interactive 3D Simulation | SeePhysics",
  seoKeywords: [
    "Newton's laws",
    "F=ma",
    "force and motion",
    "physics simulation",
    "interactive physics",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Newton's Laws of Motion",
  },
};
