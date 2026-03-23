import type { Experiment } from "@/shared/types/experiment";

export const circularMotion: Experiment = {
  id: "circular-motion",
  slug: "circular-motion",
  title: "Circular Motion & Centripetal Force",
  subtitle: "Why objects curve instead of fly off",
  description:
    "Spin a ball on a string, watch satellites orbit, and feel the centripetal force requirement. Adjust speed and radius to see how the 'center-seeking' force changes — and what happens when it disappears.",
  thumbnail: "/imgs/experiments/circular-motion.png",

  standards: {
    ngss: ["HS-PS2-1", "HS-PS2-4"],
    gcse: ["P5.5"],
    ap: ["3.B.1", "3.B.2", "4.A.2"],
  },
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["centripetal force", "circular motion", "uniform circular motion", "period", "AP Physics 1"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "radius",
      label: "Radius (r)",
      unit: "m",
      min: 0.5,
      max: 5,
      default: 2,
      step: 0.1,
      tier: "free",
    },
    {
      id: "speed",
      label: "Speed (v)",
      unit: "m/s",
      min: 0.5,
      max: 10,
      default: 4,
      step: 0.1,
      tier: "free",
    },
    {
      id: "mass",
      label: "Mass (m)",
      unit: "kg",
      min: 0.1,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "showCut",
      label: "Cut the string!",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "a_c = \\frac{v^2}{r}",
      description: "Centripetal acceleration",
    },
    {
      latex: "F_c = \\frac{mv^2}{r} = m\\omega^2 r",
      description: "Centripetal force (directed inward)",
    },
    {
      latex: "T = \\frac{2\\pi r}{v}",
      description: "Period of circular motion",
    },
    {
      latex: "\\omega = \\frac{v}{r} = \\frac{2\\pi}{T}",
      description: "Angular velocity",
    },
  ],

  theory:
    "Uniform circular motion requires a net inward (centripetal) force to continuously change the direction of velocity. This force is NOT a new type of force — it is provided by tension, gravity, normal force, or friction depending on the situation. The centripetal acceleration always points toward the center, while velocity is always tangential. Remove the centripetal force and the object moves in a straight line (Newton's 1st Law).",

  instructions:
    "Adjust radius and speed. Watch how the centripetal force vector (arrow) changes magnitude and always points inward. Increase speed while keeping radius fixed — feel how much more force is required. Use the 'cut string' toggle (Pro) to see the ball fly off tangentially.",

  challenges: [
    {
      id: "cm-c1",
      question: "A 2 kg ball moves at 6 m/s in a circle of radius 3 m. What centripetal force is required?",
      hint: "F = mv²/r",
      tier: "free",
    },
    {
      id: "cm-c2",
      question: "If you double the speed while keeping radius fixed, how does the centripetal force change?",
      hint: "F ∝ v² — doubling speed quadruples force",
      tier: "free",
    },
    {
      id: "cm-c3",
      question: "A car rounds a flat curve of radius 50 m at 20 m/s. What friction force is needed? (m = 1200 kg)",
      hint: "Friction provides centripetal force: f = mv²/r",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["newtons-laws", "gravitational-fields"],

  seoTitle: "Circular Motion & Centripetal Force — Interactive 3D | NeonPhysics",
  seoKeywords: [
    "circular motion simulation",
    "centripetal force",
    "uniform circular motion",
    "AP Physics 1 circular motion",
    "centripetal acceleration",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Circular Motion and Centripetal Force",
  },
};
