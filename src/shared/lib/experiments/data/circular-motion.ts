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
  primaryStandard: "ap-physics-1",
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

  hook: {
    question: "Does a ball on a string get pulled outward when you spin it? Hint: there is no centrifugal force!",
    context: "What you feel as 'centrifugal force' is actually your hand providing the inward pull — remove it, and the ball flies straight, not outward.",
    actionPrompt: "Start the experiment →",
  },

  learningCards: [
    {
      id: "cm-lc1",
      title: "Centripetal vs. Centrifugal",
      content: "Centripetal means 'center-seeking.' The ball on a string is always being pulled inward by tension. 'Centrifugal force' is a fictitious force that only appears in a rotating reference frame — in an inertial frame, there is no outward force.",
      relatedParameterId: "speed",
    },
    {
      id: "cm-lc2",
      title: "The v²/r Relationship",
      content: "Centripetal acceleration equals v²/r. This means doubling the speed requires four times the inward force to maintain the same circular path. The acceleration always points toward the center, perpendicular to velocity.",
      formula: { latex: "a_c = \\frac{v^2}{r}", description: "Centripetal acceleration depends on speed squared and radius" },
      relatedParameterId: "radius",
    },
    {
      id: "cm-lc3",
      title: "Force = Mass × Centripetal Acceleration",
      content: "The net inward force equals mv²/r. This is not a new type of force — it is provided by tension, gravity, friction, or normal force depending on the situation. Identifying what provides the centripetal force is the key skill in circular motion problems.",
      formula: { latex: "F_c = \\frac{mv^2}{r}", description: "Centripetal force from Newton's second law" },
      relatedParameterId: "mass",
    },
    {
      id: "cm-lc4",
      title: "What Happens When the Force Disappears?",
      content: "Cut the string and the ball flies off tangentially — not outward! This is Newton's first law in action: without a net force, the object continues in a straight line along its instantaneous velocity direction.",
      relatedParameterId: "showCut",
    },
  ],

  easterEggs: [
    {
      parameterId: "speed",
      condition: "max",
      effect: "string-snap-animation",
      message: "At this speed, the string would snap! A 1 kg ball at 10 m/s in a 0.5 m circle needs 200 N of tension — that's like hanging a 20 kg weight from the string.",
    },
    {
      parameterId: "radius",
      condition: "min",
      effect: "tight-orbit-glow",
      message: "Tiny orbit, huge force! As radius shrinks, centripetal acceleration skyrockets. Figure skaters spin faster by pulling their arms in — same physics.",
    },
  ],

  challenges: [
    {
      id: "cm-c1",
      question: "A 2 kg ball moves at 6 m/s in a circle of radius 3 m. What centripetal force is required?",
      options: ["12 N", "24 N", "36 N", "72 N"],
      correctAnswer: "24 N",
      hint: "F = mv²/r",
      relatedParameterId: "mass",
      tier: "free",
    },
    {
      id: "cm-c2",
      question: "If you double the speed while keeping radius fixed, how does the centripetal force change?",
      options: ["It doubles", "It triples", "It quadruples", "It stays the same"],
      correctAnswer: "It quadruples",
      hint: "F ∝ v² — doubling speed quadruples force",
      relatedParameterId: "speed",
      tier: "free",
    },
    {
      id: "cm-c3",
      question: "A car rounds a flat curve of radius 50 m at 20 m/s. What friction force is needed? (m = 1200 kg)",
      options: ["4,800 N", "9,600 N", "12,000 N", "24,000 N"],
      correctAnswer: "9,600 N",
      hint: "Friction provides centripetal force: f = mv²/r",
      relatedParameterId: "radius",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["newtons-laws", "gravitational-fields"],

  seoTitle: "Circular Motion & Centripetal Force — Interactive 3D | Scivra",
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
