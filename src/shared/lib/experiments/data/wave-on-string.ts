import type { Experiment } from "@/shared/types/experiment";

export const waveOnString: Experiment = {
  id: "wave-on-string",
  slug: "wave-on-string-transverse-waves",
  title: "Wave on a String",
  subtitle: "Explore transverse waves, reflection, and standing waves",
  description:
    "Generate waves on a virtual string by oscillating one end. Observe wave speed, frequency, wavelength, amplitude, and how reflected waves create standing wave patterns with nodes and antinodes.",
  thumbnail: "/imgs/experiments/wave-interference.png",

  standards: {
    ngss: ["HS-PS4-1"],
    gcse: ["AQA P6.1", "AQA P6.2"],
    ap: ["GO-4.A", "GO-4.B", "GO-4.C"],
  },
  primaryStandard: "ap-physics-1",
  category: "waves",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["transverse wave", "standing wave", "nodes", "antinodes", "wavelength", "frequency", "string vibration"],
  difficulty: "intermediate",

  parameters: [
    { id: "frequency", label: "Frequency", unit: "Hz", min: 0.1, max: 5, default: 1, step: 0.05, tier: "free" },
    { id: "amplitude", label: "Amplitude", unit: "cm", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "tension", label: "String Tension", unit: "N", min: 1, max: 100, default: 10, step: 1, tier: "free" },
    { id: "damping", label: "Damping", unit: "", min: 0, max: 1, default: 0, step: 0.01, tier: "pro" },
  ],

  formulas: [
    { latex: "v = \\sqrt{\\frac{T}{\\mu}}", description: "Wave speed on string (T=tension, μ=linear density)" },
    { latex: "v = f\\lambda", description: "Wave speed" },
    { latex: "f_n = \\frac{n}{2L}v", description: "Standing wave harmonics" },
  ],

  theory:
    "Transverse waves on a string propagate with speed v = √(T/μ), where T is tension and μ is linear mass density. When the wave reflects from a fixed end, the incident and reflected waves superpose. At specific frequencies, standing waves form with permanent nodes (zero amplitude) and antinodes (maximum amplitude). The allowed frequencies are harmonics: f_n = nv/(2L) for a fixed string of length L.",
  instructions:
    "Use the oscillator to shake the string end. Adjust frequency to find standing waves — the string resonates at harmonics. Use the ruler to measure wavelength. Toggle between fixed and free end to see different reflection behavior. Enable slow motion to see individual wave crests.",
  challenges: [
    { id: "ws-c1", question: "A string (L=1m, v=10 m/s) — what are the first three harmonic frequencies?", hint: "f_n = nv/(2L) → f₁=5Hz, f₂=10Hz, f₃=15Hz", tier: "free" },
    { id: "ws-c2", question: "How does doubling the string tension change wave speed?", hint: "v ∝ √T → speed increases by √2 ≈ 1.41×", tier: "free" },
    { id: "ws-c3", question: "Why do nodes not move in standing waves? What is happening physically?", hint: "Incident and reflected waves cancel exactly at nodes through destructive interference", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["wave-interference", "normal-modes", "fourier-making-waves"],

  seoTitle: "Wave on a String — Standing Waves | AP Physics 1 Simulation",
  seoKeywords: ["wave on string", "transverse waves", "standing waves", "nodes antinodes", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Transverse Waves, Standing Waves, String Harmonics" },
};
