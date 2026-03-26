import type { Experiment } from "@/shared/types/experiment";

export const pendulumLab: Experiment = {
  id: "pendulum-lab",
  slug: "pendulum-lab-oscillation",
  title: "Pendulum Lab",
  subtitle: "Measure period and explore pendulum dynamics",
  description:
    "Experiment with pendulums of different lengths, masses, and amplitudes. Measure period precisely, verify the length-period relationship, and explore energy dissipation with friction.",
  thumbnail: "/imgs/experiments/simple-harmonic-motion.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P6.2"],
    ap: ["3.B.3", "5.B.2"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["pendulum", "period", "oscillation", "simple harmonic motion", "gravity", "length"],
  difficulty: "intermediate",

  parameters: [
    { id: "length", label: "Pendulum Length", unit: "m", min: 0.1, max: 5, default: 1, step: 0.05, tier: "free" },
    { id: "mass", label: "Bob Mass", unit: "kg", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "angle", label: "Initial Angle", unit: "°", min: 1, max: 90, default: 15, step: 1, tier: "free" },
    { id: "gravity", label: "Gravity", unit: "m/s²", min: 1, max: 25, default: 9.8, step: 0.1, tier: "pro" },
  ],

  formulas: [
    { latex: "T = 2\\pi\\sqrt{\\frac{L}{g}}", description: "Pendulum period (small angle)" },
    { latex: "f = \\frac{1}{T} = \\frac{1}{2\\pi}\\sqrt{\\frac{g}{L}}", description: "Oscillation frequency" },
  ],

  theory:
    "A simple pendulum oscillates with period T = 2π√(L/g) for small angles (< 15°). The period depends only on length and gravity — not on mass or amplitude (for small angles). Large angles cause the true period to exceed this formula. On the Moon (g = 1.6 m/s²), the same pendulum would oscillate ~2.5× slower. Pendulums were historically used as precision timekeepers because of this mass-independence.",
  instructions:
    "Drag the pendulum bob to an initial angle and release. Use the stopwatch to measure 10 periods, then divide by 10 for accuracy. Change length and repeat to plot T vs √L. Try different masses to verify mass independence.",
  challenges: [
    { id: "pl-c1", question: "A pendulum has period 2s. What is its length?", hint: "T = 2π√(L/g) → L = g(T/2π)² = 9.8×(1/π)² ≈ 0.993 m ≈ 1 m", tier: "free" },
    { id: "pl-c2", question: "How does the period change on Mars (g = 3.7 m/s²)?", hint: "T ∝ 1/√g → T_Mars = T_Earth × √(9.8/3.7) ≈ 1.63 × T_Earth", tier: "free" },
    { id: "pl-c3", question: "Why does the small-angle formula fail for large swings?", hint: "True equation is d²θ/dt² = −(g/L)sin(θ); for large θ, sin(θ) < θ, giving longer period", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["masses-springs", "simple-harmonic-motion", "energy-skate-park-basics"],

  seoTitle: "Pendulum Lab — Period and Oscillation | AP Physics 1 Simulation",
  seoKeywords: ["pendulum lab", "period oscillation", "simple harmonic motion", "pendulum length", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Pendulum, Period, Simple Harmonic Motion" },
};
