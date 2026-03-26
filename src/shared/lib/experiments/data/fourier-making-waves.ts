import type { Experiment } from "@/shared/types/experiment";

export const fourierMakingWaves: Experiment = {
  id: "fourier-making-waves",
  slug: "fourier-series-wave-synthesis",
  title: "Fourier: Making Waves",
  subtitle: "Build any wave by adding sine components",
  description:
    "Add harmonics to build square waves, triangle waves, and sawtooth waves from pure sine components. Explore Fourier series decomposition and understand how complex signals are made from simple oscillations.",
  thumbnail: "/imgs/experiments/wave-interference.png",

  standards: {
    ngss: ["HS-PS4-1"],
    gcse: ["AQA P6.1"],
    ap: ["GO-5.A"],
  },
  primaryStandard: "ap-physics-1",
  category: "waves",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["Fourier series", "wave synthesis", "harmonics", "square wave", "signal analysis", "superposition"],
  difficulty: "advanced",

  parameters: [
    { id: "n_harmonics", label: "Number of Harmonics", unit: "", min: 1, max: 11, default: 1, step: 1, tier: "free" },
    { id: "target_wave", label: "Target Wave Shape", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
    { id: "a1", label: "A₁ (fundamental)", unit: "", min: 0, max: 1, default: 1, step: 0.01, tier: "pro" },
  ],

  formulas: [
    { latex: "f(x) = \\sum_{n=1}^{\\infty} a_n \\sin(nx) + b_n \\cos(nx)", description: "Fourier series" },
    { latex: "\\text{Square: } a_n = \\frac{4}{n\\pi} \\text{ (odd n only)}", description: "Square wave coefficients" },
  ],

  theory:
    "Fourier's theorem states that any periodic function can be decomposed into a sum of sine and cosine waves of different frequencies and amplitudes. The fundamental frequency sets the pitch; harmonics add complexity. Square waves require infinitely many odd harmonics; more harmonics = sharper corners. This decomposition is foundational to signal processing, acoustics, and quantum mechanics.",
  instructions:
    "Select a target wave shape (square, triangle, sawtooth). Add harmonics one by one to see how the composite wave approaches the target. The spectrum panel shows amplitude vs. frequency for each harmonic.",
  challenges: [
    { id: "fw-c1", question: "Why does a square wave require odd harmonics only (1st, 3rd, 5th...)?", hint: "The symmetry of a square wave means even harmonics cancel out", tier: "free" },
    { id: "fw-c2", question: "What happens to the approximation as you add more harmonics?", hint: "The waveform gets closer to the target — but never perfectly matches with finite terms", tier: "free" },
    { id: "fw-c3", question: "How does Fourier analysis relate to the timbre of a musical instrument?", hint: "Different instruments have different harmonic profiles — same pitch, different Fourier coefficients", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["wave-interference", "wave-on-string", "normal-modes"],

  seoTitle: "Fourier: Making Waves — Wave Synthesis Simulation | AP Physics 1",
  seoKeywords: ["Fourier series", "wave synthesis", "harmonics", "superposition", "AP Physics 1", "signal analysis"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Fourier Series, Wave Superposition, Harmonics" },
};
