import type { Experiment } from "@/shared/types/experiment";

export const modelsHydrogenAtom: Experiment = {
  id: "models-hydrogen-atom",
  slug: "models-hydrogen-atom-bohr",
  title: "Models of the Hydrogen Atom",
  subtitle: "Explore quantum models from Bohr to Schrödinger",
  description:
    "Shoot photons at a hydrogen atom and observe electron transitions. Compare the Bohr model, de Broglie's standing wave model, and the quantum mechanical probability cloud model.",
  thumbnail: "/imgs/experiments/nuclear-decay.png",

  standards: {
    ngss: ["HS-PS4-3", "HS-PS1-8"],
    gcse: ["AQA P7.1"],
    ap: ["MOD-2.A", "MOD-2.B", "MOD-2.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["hydrogen atom", "Bohr model", "quantum mechanics", "energy levels", "photon emission", "electron transitions"],
  difficulty: "intermediate",

  parameters: [
    { id: "model_type", label: "Atomic Model", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
    { id: "photon_wavelength", label: "Photon Wavelength", unit: "nm", min: 100, max: 700, default: 656, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "E_n = -\\frac{13.6\\text{ eV}}{n^2}", description: "Bohr energy levels" },
    { latex: "\\Delta E = hf = \\frac{hc}{\\lambda}", description: "Photon energy for transition" },
    { latex: "\\frac{1}{\\lambda} = R_H\\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)", description: "Rydberg formula" },
  ],

  theory:
    "The hydrogen atom's emission spectrum revealed discrete energy levels. The Bohr model (1913) explained hydrogen's spectrum with quantized circular orbits: E_n = −13.6 eV/n². Electrons absorb photons to jump to higher levels and emit photons when falling to lower levels. The de Broglie model added standing wave resonance. The full quantum model describes electron probability densities (orbitals) rather than definite paths.",
  instructions:
    "Select a model type. Shoot a photon (adjust wavelength) at the atom. Only photons with exactly the right energy will be absorbed — watch the electron jump to an excited state. It will then emit a photon and return to a lower level. The spectrum display shows all allowed transitions.",
  challenges: [
    { id: "mha-c1", question: "What wavelength photon is needed to excite hydrogen from n=1 to n=2?", hint: "ΔE = 13.6(1/1² − 1/2²) = 10.2 eV; λ = hc/ΔE ≈ 121 nm (UV)", tier: "free" },
    { id: "mha-c2", question: "Why is the Balmer series visible light while Lyman series is UV?", hint: "Balmer ends at n=2 (lower energy transitions); Lyman ends at n=1 (higher energy = shorter λ)", tier: "free" },
    { id: "mha-c3", question: "What was wrong with the Bohr model that the quantum model fixed?", hint: "Bohr can't explain multi-electron atoms, fine structure, or the uncertainty principle", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["photoelectric-effect", "blackbody-spectrum", "build-a-nucleus"],

  seoTitle: "Models of the Hydrogen Atom | Bohr Model Simulation | AP Physics 2",
  seoKeywords: ["hydrogen atom", "Bohr model", "energy levels", "quantum mechanics", "AP Physics 2", "Rydberg formula"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Hydrogen Atom, Bohr Model, Energy Levels" },
};
