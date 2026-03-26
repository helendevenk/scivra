import type { Experiment } from "@/shared/types/experiment";

export const quantumMeasurement: Experiment = {
  id: "quantum-measurement",
  slug: "quantum-measurement-uncertainty",
  title: "Quantum Measurement",
  subtitle: "Explore how measurement affects quantum systems",
  description:
    "Investigate the Heisenberg Uncertainty Principle through interactive experiments. Observe wave-particle duality, measure position and momentum simultaneously, and see how measurement disturbs a quantum system.",
  thumbnail: "/imgs/experiments/photoelectric-effect.png",

  standards: {
    ngss: ["HS-PS4-3"],
    gcse: [],
    ap: ["MOD-4.A", "MOD-4.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["Heisenberg uncertainty", "quantum measurement", "wave-particle duality", "wavefunction", "position momentum"],
  difficulty: "advanced",

  parameters: [
    { id: "slit_width", label: "Slit Width", unit: "nm", min: 1, max: 200, default: 50, step: 1, tier: "free" },
    { id: "particle_wavelength", label: "Particle Wavelength", unit: "nm", min: 1, max: 200, default: 50, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "\\Delta x \\cdot \\Delta p \\geq \\frac{\\hbar}{2}", description: "Heisenberg Uncertainty Principle" },
    { latex: "\\Delta E \\cdot \\Delta t \\geq \\frac{\\hbar}{2}", description: "Energy-time uncertainty" },
    { latex: "\\lambda = \\frac{h}{p}", description: "de Broglie wavelength" },
  ],

  theory:
    "The Heisenberg Uncertainty Principle states that position and momentum cannot both be precisely known simultaneously: Δx·Δp ≥ ℏ/2. This is not a measurement limitation but a fundamental property of quantum states. Narrowing a slit (precise position) causes wider diffraction (uncertain momentum). The double-slit experiment shows that measuring which-path information destroys the interference pattern — measurement irreversibly disturbs the quantum state.",
  instructions:
    "Adjust slit width to control position uncertainty. Observe how the diffraction pattern widens (momentum uncertainty increases). Enable which-path detection to see interference disappear. Use the momentum spectrum to verify the uncertainty relation.",
  challenges: [
    { id: "qm-c1", question: "A slit narrows from 100nm to 10nm. How does the diffraction spread change?", hint: "Δx decreases by 10×, so Δp must increase by 10× — much wider spread", tier: "free" },
    { id: "qm-c2", question: "An electron is confined in a 1nm box. What is its minimum kinetic energy?", hint: "Δx=1nm → Δp ≥ ℏ/(2×10⁻⁹) → KE = (Δp)²/(2m_e)", tier: "free" },
    { id: "qm-c3", question: "Why does measuring which-slit a photon goes through destroy interference?", hint: "Which-path information collapses position superposition — you've made it a particle, not a wave", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["quantum-coin-toss", "photoelectric-effect", "single-slit-diffraction"],

  seoTitle: "Quantum Measurement — Heisenberg Uncertainty | AP Physics 2",
  seoKeywords: ["quantum measurement", "Heisenberg uncertainty", "wave-particle duality", "double slit", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Heisenberg Uncertainty, Wave-Particle Duality, Quantum Measurement" },
};
