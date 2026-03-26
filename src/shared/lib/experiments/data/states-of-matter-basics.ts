import type { Experiment } from "@/shared/types/experiment";

export const statesOfMatterBasics: Experiment = {
  id: "states-of-matter-basics",
  slug: "states-of-matter-basics-phase-transitions",
  title: "States of Matter: Basics",
  subtitle: "Explore solid, liquid, and gas at the molecular level",
  description:
    "Heat or cool a substance and watch molecules transition between solid, liquid, and gas states. Observe melting, freezing, evaporation, and condensation at the particle level.",
  thumbnail: "/imgs/experiments/ideal-gas-thermodynamics.png",

  standards: {
    ngss: ["HS-PS1-3", "HS-PS3-2"],
    gcse: ["AQA C3.4"],
    ap: ["TDE-3.A", "TDE-3.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "thermodynamics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["states of matter", "phase transitions", "solid liquid gas", "molecular motion", "melting boiling", "temperature"],
  difficulty: "beginner",

  parameters: [
    { id: "temperature", label: "Temperature", unit: "K", min: 50, max: 1000, default: 300, step: 5, tier: "free" },
    { id: "substance", label: "Substance", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "KE_{avg} = \\frac{3}{2}k_B T", description: "Average kinetic energy of molecules" },
    { latex: "Q = mL", description: "Latent heat during phase transition" },
  ],

  theory:
    "Matter exists in solid, liquid, and gas phases depending on temperature and pressure. In a solid, molecules vibrate around fixed positions; in a liquid, they flow past each other; in a gas, they move freely. Phase transitions require energy (latent heat) without temperature change — energy breaks intermolecular bonds. The kinetic energy of molecules is proportional to absolute temperature (KE = 3/2 k_B T).",
  instructions:
    "Use the temperature slider to heat or cool the substance. Watch how molecular motion changes with temperature. Observe the phase transition: molecules break free from their lattice at the melting point and escape the liquid at the boiling point. The temperature-time graph shows the plateau during phase changes.",
  challenges: [
    { id: "smb-c1", question: "Why does temperature stay constant during a phase transition even as heat is added?", hint: "Energy goes into breaking intermolecular bonds (latent heat), not increasing KE", tier: "free" },
    { id: "smb-c2", question: "Why do gases expand to fill their container but liquids don't?", hint: "Gas molecules have enough KE to overcome intermolecular attractions; liquid molecules don't", tier: "free" },
    { id: "smb-c3", question: "Why does sweating cool you down? (evaporation)", hint: "Evaporation requires latent heat — energy is taken from your body, lowering its temperature", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["gases-intro", "ideal-gas-thermodynamics", "diffusion"],

  seoTitle: "States of Matter Basics — Phase Transitions | AP Physics 2",
  seoKeywords: ["states of matter", "phase transitions", "solid liquid gas", "molecular motion", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "States of Matter, Phase Transitions, Molecular Motion" },
};
