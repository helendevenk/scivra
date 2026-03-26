import type { Experiment } from "@/shared/types/experiment";

export const wavesIntro: Experiment = {
  id: "waves-intro",
  slug: "waves-intro-sound-water",
  title: "Waves: Intro",
  subtitle: "Introduction to wave properties with sound and water waves",
  description:
    "Explore the fundamental properties of waves — wavelength, frequency, amplitude, and speed — using intuitive water and sound wave visualizations. Perfect first introduction to wave physics.",
  thumbnail: "/imgs/experiments/wave-interference.png",

  standards: {
    ngss: ["HS-PS4-1"],
    gcse: ["AQA P6.1"],
    ap: ["GO-4.A"],
  },
  primaryStandard: "ap-physics-1",
  category: "waves",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["waves", "wavelength", "frequency", "amplitude", "wave speed", "sound waves", "water waves"],
  difficulty: "beginner",

  parameters: [
    { id: "frequency", label: "Frequency", unit: "Hz", min: 0.1, max: 10, default: 1, step: 0.1, tier: "free" },
    { id: "amplitude", label: "Amplitude", unit: "cm", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "wave_type", label: "Wave Type", unit: "", min: 0, max: 1, default: 0, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "v = f\\lambda", description: "Wave speed" },
    { latex: "T = \\frac{1}{f}", description: "Period" },
    { latex: "v_{sound} \\approx 343\\text{ m/s (20°C air)}", description: "Speed of sound in air" },
  ],

  theory:
    "A wave carries energy through a medium without permanently moving the medium itself. Key properties: frequency f (cycles per second), wavelength λ (distance per cycle), amplitude (height), and speed v = fλ. Transverse waves oscillate perpendicular to travel (water waves, light); longitudinal waves oscillate parallel to travel (sound). The wave equation v = fλ means higher frequency gives shorter wavelength at constant speed.",
  instructions:
    "Select water or sound waves. Adjust frequency and amplitude sliders. Observe how wavelength changes when you change frequency (speed stays constant). Use the ruler to measure wavelength. Toggle between single source and two-source to preview interference.",
  challenges: [
    { id: "wi-c1", question: "A wave has frequency 2Hz and wavelength 3m. What is its speed?", hint: "v = fλ = 2 × 3 = 6 m/s", tier: "free" },
    { id: "wi-c2", question: "Sound travels at 343 m/s. What wavelength does a 440Hz (A note) have?", hint: "λ = v/f = 343/440 ≈ 0.78 m", tier: "free" },
    { id: "wi-c3", question: "Why can you hear a bass drum from far away but not a piccolo flute at the same distance?", hint: "Lower frequencies diffract more around obstacles (diffraction angle ∝ λ); longer wavelengths go around walls better", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 12,
  relatedExperiments: ["wave-interference", "wave-on-string", "doppler-effect"],

  seoTitle: "Waves: Intro — Wavelength, Frequency, Speed | AP Physics 1",
  seoKeywords: ["waves introduction", "wavelength frequency", "wave speed", "sound waves", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Wave Properties, Frequency, Wavelength, Wave Speed" },
};
