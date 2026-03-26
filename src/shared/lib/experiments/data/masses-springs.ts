import type { Experiment } from "@/shared/types/experiment";

export const massesSprings: Experiment = {
  id: "masses-springs",
  slug: "masses-springs-oscillation",
  title: "Masses and Springs",
  subtitle: "Explore oscillation, damping, and resonance",
  description:
    "Hang masses on springs with adjustable spring constants and damping. Measure period of oscillation, verify the mass-period relationship, and observe resonance when driving frequency matches natural frequency.",
  thumbnail: "/imgs/experiments/simple-harmonic-motion.png",

  standards: {
    ngss: ["HS-PS2-1", "HS-PS3-2"],
    gcse: ["AQA P6.2"],
    ap: ["3.B.3", "5.B.2", "5.B.3"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["spring", "oscillation", "SHM", "damping", "resonance", "period", "natural frequency"],
  difficulty: "intermediate",

  parameters: [
    { id: "mass", label: "Mass", unit: "kg", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "spring_constant", label: "Spring Constant", unit: "N/m", min: 1, max: 200, default: 50, step: 1, tier: "free" },
    { id: "damping", label: "Damping", unit: "", min: 0, max: 1, default: 0, step: 0.01, tier: "free" },
    { id: "drive_frequency", label: "Drive Frequency", unit: "Hz", min: 0, max: 5, default: 0, step: 0.01, tier: "pro" },
  ],

  formulas: [
    { latex: "T = 2\\pi\\sqrt{\\frac{m}{k}}", description: "Period of mass-spring oscillation" },
    { latex: "f_0 = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}", description: "Natural frequency" },
    { latex: "x(t) = A e^{-\\gamma t}\\cos(\\omega t + \\phi)", description: "Damped oscillation" },
  ],

  theory:
    "A mass on a spring oscillates with period T = 2π√(m/k). Unlike a pendulum, this period is independent of amplitude. Damping reduces amplitude over time; critical damping returns the system to equilibrium fastest without oscillating. Resonance occurs when a driving force matches the natural frequency — amplitude grows dramatically and is limited only by damping.",
  instructions:
    "Hang a mass on the spring and release it. Measure the period using the stopwatch. Change mass or spring constant to verify T = 2π√(m/k). Add damping to observe decay. Enable a driving force and tune the frequency to find resonance.",
  challenges: [
    { id: "ms-c1", question: "A 2kg mass on a spring (k=200 N/m). What is the period?", hint: "T = 2π√(2/200) = 2π√(0.01) = 0.628 s", tier: "free" },
    { id: "ms-c2", question: "How does doubling the mass affect the period?", hint: "T ∝ √m → T increases by factor √2 ≈ 1.41", tier: "free" },
    { id: "ms-c3", question: "Why does a driven spring with low damping eventually break at resonance?", hint: "At resonance, energy input equals zero energy loss → amplitude grows without bound", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["masses-springs-basics", "simple-harmonic-motion", "hookes-law"],

  seoTitle: "Masses and Springs — Oscillation and Resonance | AP Physics 1",
  seoKeywords: ["masses and springs", "oscillation", "resonance", "damping", "SHM", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Spring Oscillation, Resonance, Damping" },
};
