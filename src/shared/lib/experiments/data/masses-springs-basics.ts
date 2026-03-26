import type { Experiment } from "@/shared/types/experiment";

export const massesSpringsBasics: Experiment = {
  id: "masses-springs-basics",
  slug: "masses-springs-basics",
  title: "Masses and Springs: Basics",
  subtitle: "Introductory spring oscillation — no damping or driving",
  description:
    "A simplified spring-mass simulation for beginners. Hang masses, observe bouncing, and measure period. Perfect for first introduction to oscillatory motion before exploring the advanced lab.",
  thumbnail: "/imgs/experiments/simple-harmonic-motion.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P6.2"],
    ap: ["3.B.3"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["spring", "oscillation", "mass", "period", "SHM basics"],
  difficulty: "beginner",

  parameters: [
    { id: "mass", label: "Mass", unit: "kg", min: 0.1, max: 3, default: 1, step: 0.1, tier: "free" },
    { id: "spring_constant", label: "Spring Constant", unit: "N/m", min: 10, max: 100, default: 40, step: 5, tier: "free" },
  ],

  formulas: [
    { latex: "T = 2\\pi\\sqrt{\\frac{m}{k}}", description: "Period of oscillation" },
    { latex: "F_{spring} = -kx", description: "Restoring force (Hooke's Law)" },
  ],

  theory:
    "A spring exerts a restoring force proportional to its displacement (Hooke's Law). This causes the mass to oscillate back and forth — simple harmonic motion. The period depends only on mass and spring constant, not on amplitude or gravity direction. This is one of the most fundamental forms of oscillatory motion in physics.",
  instructions:
    "Select a mass from the shelf and hang it on the spring. Pull the mass down and release it. Use the stopwatch to measure the period. Try different masses and spring constants to verify the period formula.",
  challenges: [
    { id: "msb-c1", question: "A 0.5kg mass on a spring (k=50 N/m). What is the period?", hint: "T = 2π√(0.5/50) = 2π√(0.01) ≈ 0.628 s", tier: "free" },
    { id: "msb-c2", question: "Does the period change if you double the initial stretch amplitude?", hint: "No — for ideal springs, period is independent of amplitude", tier: "free" },
    { id: "msb-c3", question: "What would happen to the period on the Moon (g = 1.6 m/s²)?", hint: "T = 2π√(m/k) — it doesn't depend on g at all!", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 12,
  relatedExperiments: ["masses-springs", "hookes-law", "simple-harmonic-motion"],

  seoTitle: "Masses and Springs Basics | Spring Oscillation Intro | Physics Lab",
  seoKeywords: ["masses springs basics", "spring oscillation", "SHM intro", "period mass spring"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Spring Oscillation, Simple Harmonic Motion" },
};
