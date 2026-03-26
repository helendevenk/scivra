import type { Experiment } from "@/shared/types/experiment";

export const quantumCoinToss: Experiment = {
  id: "quantum-coin-toss",
  slug: "quantum-coin-toss-superposition",
  title: "Quantum Coin Toss",
  subtitle: "Explore quantum superposition and measurement",
  description:
    "Toss a quantum coin that exists in superposition until measured. Discover how quantum probability differs from classical randomness and visualize the Bloch sphere representation of a qubit.",
  thumbnail: "/imgs/experiments/photoelectric-effect.png",

  standards: {
    ngss: ["HS-PS4-3"],
    gcse: [],
    ap: ["MOD-4.A"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["quantum mechanics", "superposition", "measurement", "probability", "qubit", "Bloch sphere"],
  difficulty: "advanced",

  parameters: [
    { id: "superposition_angle", label: "Superposition Angle", unit: "°", min: 0, max: 180, default: 90, step: 5, tier: "free" },
    { id: "num_tosses", label: "Number of Tosses", unit: "", min: 1, max: 1000, default: 10, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "|\\psi\\rangle = \\cos(\\theta/2)|0\\rangle + \\sin(\\theta/2)|1\\rangle", description: "Qubit superposition state" },
    { latex: "P(0) = \\cos^2(\\theta/2)", description: "Probability of measuring |0⟩" },
  ],

  theory:
    "A quantum system can exist in a superposition of states, unlike a classical coin which is definitively heads or tails while in flight. The quantum state encodes probabilities: measuring 'collapses' the superposition to a definite outcome. This is not classical ignorance — the system genuinely has no definite value before measurement. The Bloch sphere represents all possible qubit states as points on a unit sphere.",
  instructions:
    "Set the superposition angle (90° = equal probability). Toss the coin once to observe collapse. Toss many times to see the probability distribution emerge. Compare with classical random coin flips. Rotate the Bloch sphere to change the quantum state.",
  challenges: [
    { id: "qct-c1", question: "At θ=90°, what is P(heads)? Why is this the 'most quantum' state?", hint: "P = cos²(45°) = 0.5; equal superposition is maximally indeterminate", tier: "free" },
    { id: "qct-c2", question: "At θ=0°, what happens before and after measurement?", hint: "θ=0° → state is |0⟩; P(0)=1, P(1)=0; measurement always gives 0", tier: "free" },
    { id: "qct-c3", question: "Why can't quantum randomness be predicted even with perfect knowledge of the state?", hint: "The Copenhagen interpretation: superposition is real; there is no hidden variable determining the outcome", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["quantum-measurement", "models-hydrogen-atom", "photoelectric-effect"],

  seoTitle: "Quantum Coin Toss — Superposition and Measurement | AP Physics 2",
  seoKeywords: ["quantum coin toss", "superposition", "quantum measurement", "qubit", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Quantum Superposition, Quantum Measurement, Qubits" },
};
