import type { Experiment } from "@/shared/types/experiment";

export const moleculesAndLight: Experiment = {
  id: "molecules-and-light",
  slug: "molecules-light-absorption-emission",
  title: "Molecules and Light",
  subtitle: "How molecules absorb and emit electromagnetic radiation",
  description:
    "Explore how different molecules interact with different types of electromagnetic radiation. Discover why CO₂ absorbs infrared (the greenhouse effect), why ozone blocks UV, and how microwave ovens heat water.",
  thumbnail: "/imgs/experiments/photoelectric-effect.png",

  standards: {
    ngss: ["HS-PS4-4", "HS-PS4-5", "HS-ESS2-4"],
    gcse: ["AQA P6.6", "AQA C7.4"],
    ap: ["MOD-1.C", "ENV-3.A"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["molecules", "electromagnetic radiation", "absorption", "greenhouse effect", "infrared", "UV", "molecular vibration"],
  difficulty: "intermediate",

  parameters: [
    { id: "molecule", label: "Molecule", unit: "", min: 0, max: 5, default: 0, step: 1, tier: "free" },
    { id: "radiation_type", label: "Radiation Type", unit: "", min: 0, max: 5, default: 0, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "E = hf = \\frac{hc}{\\lambda}", description: "Photon energy" },
    { latex: "\\Delta E_{vib} \\approx 0.1\\text{–}1\\text{ eV (IR)}", description: "Molecular vibration energy scale" },
  ],

  theory:
    "Molecules absorb electromagnetic radiation when the photon energy matches a transition in the molecule — vibrational transitions for IR, electronic transitions for UV/visible. CO₂ and H₂O absorb IR radiation (heat) because their bending and stretching modes match IR photon energies — the greenhouse effect. N₂ and O₂ are IR-transparent but UV-absorbing at higher energies. Ozone absorbs UV-B and UV-C, protecting life on Earth.",
  instructions:
    "Select a molecule from the menu. Choose a radiation type. If the molecule absorbs that radiation, watch it vibrate or rotate. The energy level diagram shows which transitions are available. Explore CO₂ + infrared to see the greenhouse effect in action.",
  challenges: [
    { id: "ml-c1", question: "Why does CO₂ absorb IR but not visible light?", hint: "CO₂ vibrational mode energies match IR photons (~0.1 eV); visible photons (~2 eV) can't excite these modes", tier: "free" },
    { id: "ml-c2", question: "Why are N₂ and O₂ transparent to infrared?", hint: "Symmetric diatomic molecules have no net dipole change during vibration — can't couple to IR field", tier: "free" },
    { id: "ml-c3", question: "How does a microwave oven work? What molecular motion is excited?", hint: "Microwaves match water rotational transitions (~10⁻³ eV), causing rapid rotation and friction heating", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["blackbody-spectrum", "em-spectrum", "photoelectric-effect"],

  seoTitle: "Molecules and Light — Absorption Simulation | AP Physics 2",
  seoKeywords: ["molecules and light", "infrared absorption", "greenhouse effect", "electromagnetic radiation", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Molecular Absorption, Greenhouse Effect, EM Radiation" },
};
