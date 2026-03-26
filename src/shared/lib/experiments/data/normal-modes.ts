import type { Experiment } from "@/shared/types/experiment";

export const normalModes: Experiment = {
  id: "normal-modes",
  slug: "normal-modes-coupled-oscillators",
  title: "Normal Modes",
  subtitle: "Coupled oscillators and standing wave patterns",
  description:
    "Explore normal modes of coupled spring-mass systems and strings. Observe how any complex oscillation decomposes into fundamental modes, connecting mechanical oscillations to musical acoustics.",
  thumbnail: "/imgs/experiments/wave-interference.png",

  standards: {
    ngss: ["HS-PS4-1"],
    gcse: ["AQA P6.2"],
    ap: ["GO-5.B", "GO-5.C"],
  },
  primaryStandard: "ap-physics-1",
  category: "waves",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["normal modes", "coupled oscillators", "standing waves", "harmonics", "vibration modes", "superposition"],
  difficulty: "advanced",

  parameters: [
    { id: "num_masses", label: "Number of Masses", unit: "", min: 1, max: 5, default: 2, step: 1, tier: "free" },
    { id: "spring_constant", label: "Spring Constant", unit: "N/m", min: 1, max: 100, default: 20, step: 1, tier: "free" },
    { id: "mass", label: "Mass", unit: "kg", min: 0.1, max: 2, default: 1, step: 0.1, tier: "free" },
    { id: "coupling", label: "Coupling Strength", unit: "", min: 0.1, max: 5, default: 1, step: 0.1, tier: "pro" },
  ],

  formulas: [
    { latex: "\\omega_n = 2\\omega_0\\sin\\left(\\frac{n\\pi}{2(N+1)}\\right)", description: "Normal mode frequencies" },
    { latex: "f_n = \\frac{n}{2L}\\sqrt{\\frac{T}{\\mu}}", description: "String harmonics" },
  ],

  theory:
    "Normal modes are the independent oscillation patterns of a coupled system — each mode oscillates at a distinct frequency with all parts moving in phase or exactly anti-phase. Any arbitrary motion can be written as a superposition of normal modes. For a string, normal modes are harmonics (standing waves). For coupled pendulums, the two modes are in-phase (lower frequency) and out-of-phase (higher frequency). This concept extends to quantum mechanics (phonons) and molecular vibrations.",
  instructions:
    "Click to excite specific normal modes using the mode buttons. The masses will oscillate in the characteristic pattern. Switch to 'mix' mode and observe how two modes combine into a complex beating pattern. For a string view, observe standing wave patterns for each harmonic.",
  challenges: [
    { id: "nm-c1", question: "Two identical coupled pendulums: what are the two normal mode frequencies?", hint: "Mode 1 (in-phase): both pendulums swing together at ω₀; Mode 2 (anti-phase): slightly higher ω", tier: "free" },
    { id: "nm-c2", question: "Start one pendulum and watch the other. What happens? Why?", hint: "Energy slowly transfers between them — a beat pattern; the motion is a mix of both normal modes", tier: "free" },
    { id: "nm-c3", question: "How do normal modes relate to a guitar string's harmonics?", hint: "Each harmonic is a normal mode of the string with nodes at both ends; frequency = n×fundamental", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["masses-springs", "fourier-making-waves", "wave-interference"],

  seoTitle: "Normal Modes — Coupled Oscillators Simulation | AP Physics 1",
  seoKeywords: ["normal modes", "coupled oscillators", "standing waves", "harmonics", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Normal Modes, Coupled Oscillators, Standing Waves" },
};
