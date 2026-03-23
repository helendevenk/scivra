import type { Experiment } from "@/shared/types/experiment";

export const k5ForceMotion: Experiment = {
  id: "k5-force-motion",
  slug: "k5-force-motion",
  title: "Force & Motion",
  subtitle: "Push, pull, and how forces change movement",
  description:
    "Apply pushes and pulls to objects and watch them accelerate, slow down, and change direction. See balanced and unbalanced forces in action. Adjust friction and gravity to discover how forces work together to determine motion.",
  thumbnail: "/imgs/experiments/k5-force-motion.png",

  standards: {
    ngss: ["3-PS2-1", "3-PS2-2", "5-PS2-1"],
    gcse: [],
    ap: [],
  },
  category: "mechanics",
  subject: "physics",
  gradeLevel: "3-5",
  tags: ["force", "motion", "push", "pull", "friction", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "pushForce",
      label: "Push Force",
      unit: "N",
      min: 0,
      max: 20,
      default: 5,
      step: 1,
      tier: "free",
    },
    {
      id: "friction",
      label: "Surface Friction",
      unit: "",
      min: 0,
      max: 1,
      default: 0.3,
      step: 0.1,
      tier: "free",
    },
    {
      id: "objectMass",
      label: "Object Mass",
      unit: "kg",
      min: 1,
      max: 10,
      default: 2,
      step: 1,
      tier: "free",
    },
    {
      id: "gravity",
      label: "Gravity",
      unit: "m/s²",
      min: 1,
      max: 20,
      default: 9.8,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "F = ma \\quad (\\text{Newton's Second Law})",
      description: "Force equals mass times acceleration",
    },
    {
      latex: "f = \\mu N \\quad (\\text{friction force})",
      description: "Friction force = friction coefficient × normal force",
    },
  ],

  theory:
    "A force is a push or pull that can change an object's motion. Forces have both size (magnitude) and direction. When the forces on an object are balanced (equal in all directions), the object stays still or moves at constant speed. When forces are unbalanced, the object accelerates in the direction of the net force. Friction is a force that opposes motion between surfaces in contact. More mass requires more force to achieve the same acceleration (F=ma). Gravity pulls objects downward with a force equal to their weight (W=mg).",

  instructions:
    "Use the Push Force slider to apply a horizontal force to the object. Watch the object accelerate. Increase friction to slow it down. Try changing the mass — a heavier object needs more force for the same acceleration. Can you find the force needed to keep the object moving at constant speed?",

  challenges: [
    {
      id: "fm-c1",
      question: "If you push a 2 kg box with 10 N and friction is 0, what is the acceleration?",
      hint: "F = ma → a = F/m = 10/2 = 5 m/s²",
      tier: "free",
    },
    {
      id: "fm-c2",
      question: "What happens to motion when push force equals friction force?",
      hint: "Net force = 0 → constant velocity (no acceleration). The forces are balanced!",
      tier: "free",
    },
    {
      id: "fm-c3",
      question: "A 5 kg object accelerates at 3 m/s². What net force is acting on it?",
      hint: "F = ma = 5 × 3 = 15 N",
      tier: "free",
    },
    {
      id: "fm-c4",
      question: "Why do heavier objects need more force to achieve the same acceleration?",
      hint: "From F=ma: F = m × a. If a is fixed, doubling m requires doubling F. Inertia — resistance to change in motion — increases with mass.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-simple-machines", "k5-energy-conversion", "newtons-laws"],

  seoTitle: "Force and Motion for Kids | NeonPhysics Elementary Science",
  seoKeywords: [
    "force and motion elementary",
    "push pull simulation",
    "Newton's second law kids",
    "friction interactive",
    "K-5 physics simulation",
    "forces for kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Force and Motion",
  },
};
