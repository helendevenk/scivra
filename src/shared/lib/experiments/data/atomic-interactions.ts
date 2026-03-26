import type { Experiment } from "@/shared/types/experiment";

export const atomicInteractions: Experiment = {
  id: "atomic-interactions",
  slug: "atomic-interactions-lennard-jones",
  title: "Atomic Interactions",
  subtitle: "Explore the forces between atoms at the molecular scale",
  description:
    "Visualize how atoms attract and repel each other using the Lennard-Jones potential. Observe bonding, molecule formation, and the relationship between potential energy and interatomic distance.",
  thumbnail: "/imgs/experiments/nuclear-decay.png",

  standards: {
    ngss: ["HS-PS1-1", "HS-PS2-6"],
    gcse: ["AQA C1.1"],
    ap: ["SAP-1.A", "SAP-1.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["atomic forces", "Lennard-Jones", "bonding", "potential energy", "intermolecular forces"],
  difficulty: "intermediate",

  parameters: [
    { id: "atom_type", label: "Atom Type", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
    { id: "temperature", label: "Temperature", unit: "K", min: 1, max: 1000, default: 300, step: 10, tier: "free" },
    { id: "num_atoms", label: "Number of Atoms", unit: "", min: 2, max: 20, default: 5, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "U(r) = 4\\epsilon\\left[\\left(\\frac{\\sigma}{r}\\right)^{12} - \\left(\\frac{\\sigma}{r}\\right)^6\\right]", description: "Lennard-Jones potential" },
    { latex: "F = -\\frac{dU}{dr}", description: "Force from potential" },
  ],

  theory:
    "The Lennard-Jones potential models the interaction between a pair of neutral atoms. The r⁻¹² term represents Pauli repulsion at short range, while the r⁻⁶ term represents van der Waals attraction at longer range. The equilibrium distance is where the force is zero, corresponding to the minimum potential energy. This model explains bonding, phase transitions, and molecular structure.",
  instructions:
    "Place atoms on the canvas and observe how they interact. The potential energy graph updates in real time. Cool atoms to form stable bonds; heat them to break bonds and observe phase-like transitions.",
  challenges: [
    { id: "ai-c1", question: "At what separation distance is the force zero between two atoms?", hint: "Find the minimum of the potential energy curve", tier: "free" },
    { id: "ai-c2", question: "How does temperature affect bond formation?", hint: "Higher temperature means more kinetic energy to overcome attraction", tier: "free" },
    { id: "ai-c3", question: "Why do atoms never overlap completely?", hint: "The repulsive r⁻¹² term grows much faster than the attractive r⁻⁶ term", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["diffusion", "states-of-matter-basics", "molecules-and-light"],

  seoTitle: "Atomic Interactions Simulation | Lennard-Jones Potential | AP Physics",
  seoKeywords: ["atomic interactions", "Lennard-Jones potential", "intermolecular forces", "bonding", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Atomic Interactions, Lennard-Jones Potential" },
};
