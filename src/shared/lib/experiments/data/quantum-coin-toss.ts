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

  contentSections: {
    whatIsIt:
      "Schrödinger's cat is the famous teaching trick: a cat in a box that's somehow both alive and dead until you peek. Behind the metaphor is a concrete fact about quantum systems — they can occupy multiple states simultaneously, with definite probabilities for each, until something interacts with them. This simulation gives you a controllable version of that strangeness: a quantum coin whose 'heads' and 'tails' probabilities you set with a dial called the superposition angle θ. At θ=0° the coin is definitely heads, at θ=180° definitely tails, at θ=90° an equal mixture — a real superposition with no defined value until you measure. Toss it once and watch the wavefunction collapse. Toss it a thousand times and watch P(0) = cos²(θ/2) emerge. The Bloch sphere gives you the geometric picture used by every quantum computer scientist: every qubit state is a point on a unit sphere.",
    parameterExplanations: {
      superposition_angle:
        "The angle θ on the Bloch sphere that controls the qubit state |ψ⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩. This sets the probability of measuring 0 versus 1: P(0) = cos²(θ/2), P(1) = sin²(θ/2). At θ=0° you get P(0)=1 (always heads). At θ=180° you get P(1)=1 (always tails). At θ=90° both probabilities are 0.5 — the maximally indeterminate equal superposition. Sweeping θ across the slider continuously biases the coin between certain heads and certain tails, with everything in between being a real quantum superposition.",
      num_tosses:
        "How many measurements you make on independent copies of the same prepared state. Each toss collapses the superposition to a definite 0 or 1 according to the probabilities. With few tosses (say 10) you'll see big statistical noise — at θ=90° you might get 7 heads and 3 tails just by chance. With 1000 tosses the law of large numbers takes over and the observed frequencies converge tightly to the predicted probabilities. This is exactly how quantum experimentalists verify a state: prepare the same state thousands of times and measure the histogram.",
    },
    misconceptions: [
      {
        wrong:
          "A particle in superposition is literally everywhere at once or in two places at the same time.",
        correct:
          "What's actually 'there' is the wavefunction, which assigns a complex probability amplitude to each possible outcome. The particle isn't a duplicate sitting in two places. When you measure, the wavefunction collapses to one outcome with probability |amplitude|². So calling the cat 'simultaneously alive and dead' is a metaphor — what's true is that the alive-amplitude and the dead-amplitude both have nonzero values until measurement collapses to one of them.",
      },
      {
        wrong:
          "Quantum superposition is just classical probability — we don't know the answer until we look, like a covered die.",
        correct:
          "It's deeper than that. A covered die already has a value; we just don't know it. A qubit at θ=90° genuinely has no defined value until measurement — and that's testable. Bell-inequality experiments show that quantum systems violate the predictions any classical hidden-variable model would make. So 'we just haven't checked yet' is wrong; the absence of a defined value is a real, physical fact about quantum systems.",
      },
      {
        wrong:
          "After measurement, the particle returns to its original superposition state.",
        correct:
          "Measurement collapse is one-way. Once you measure and get heads, the qubit is in the |0⟩ state — measure it again and you'll get heads with probability 1. To get a fresh superposition you have to actively *re-prepare* the state. In a real quantum computer this means applying a gate (a unitary rotation) to rebuild the superposition from the collapsed state. Measurement and gate operations are different physical actions.",
      },
      {
        wrong:
          "Quantum probability is just like flipping a fair coin.",
        correct:
          "Coin probability is classical: a fair coin has a definite (but unknown to you) outcome at every moment. Quantum probability is computed from amplitudes that can interfere — two paths to the same outcome can add constructively (boosting probability) or destructively (canceling probability). That interference is the whole point of quantum computing speedups. A classical fair coin can never interfere with itself; a quantum coin can.",
      },
    ],
    teacherUseCases: [
      "Frequencies-converge demo: at θ=90° run 10, 100, and 1000 tosses. Students record the heads fraction and see it tighten around 0.5 as N grows. Connect this to the law of large numbers and to how real quantum experiments verify state preparation.",
      "Probability formula check: students compute P(0) = cos²(θ/2) for θ = 30°, 60°, 90°, 120°, 150° before running. Then they verify by tossing 1000 times. Easy way to make the formula concrete.",
      "Bell vs. classical thought experiment: discuss why a covered die isn't a quantum superposition. Bring in the Bell inequality argument at a conceptual level — quantum probability isn't just ignorance, it's something stronger.",
      "Bloch sphere geometry: have students rotate the Bloch sphere and find the points corresponding to |0⟩, |1⟩, |+⟩ = (|0⟩+|1⟩)/√2, and |−⟩ = (|0⟩−|1⟩)/√2. This sets up the geometry every quantum computing course assumes.",
      "Wavefunction collapse discussion: pause the simulation right after a measurement and ask 'what's the probability of getting heads if we measure again right now?' Students should answer 1 (or 0). Use this to introduce why repeated identical measurements give identical outcomes.",
    ],
    faq: [
      {
        question: "Why does P(0) = cos²(θ/2) instead of just θ/180?",
        answer:
          "Because quantum probabilities come from squaring amplitudes, not from linear angles. The state vector lives on the Bloch sphere with the half-angle convention: |ψ⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩. The amplitude for 0 is cos(θ/2), and the *probability* is its square. The half-angle is what makes θ=180° (antipode of |0⟩) come out as |1⟩ rather than the same as |0⟩. It's a feature of how spin-1/2 systems and qubits map to 3D rotation geometry.",
      },
      {
        question: "What does it mean for a quantum coin to be in superposition while in flight?",
        answer:
          "Mathematically, the state is a definite complex linear combination of |0⟩ and |1⟩. Physically, no single experiment can verify 'it was in a superposition' on one toss — you only see one outcome per measurement. But by preparing the same state many times and measuring statistics, or by interferometric experiments where the two amplitudes interfere with each other, you can confirm that the state really was a superposition rather than a hidden coin. That's how quantum optics labs verify qubit states every day.",
      },
      {
        question: "Why does measuring 'collapse' the wavefunction?",
        answer:
          "Measurement couples the quantum system to a macroscopic device with vastly more degrees of freedom (an apparatus, an observer's brain, the environment). That coupling rapidly entangles the qubit with the environment in such a way that you can no longer access interference between the |0⟩ and |1⟩ branches. From your perspective the state appears to jump to one outcome with the predicted probability. Different interpretations (Copenhagen, many-worlds, decoherence) disagree on the metaphysics, but they all agree on the predictions.",
      },
      {
        question: "Can I use this to send information faster than light?",
        answer:
          "No. Even when two qubits are entangled and one is measured, the outcome is random — Alice can't choose what Bob sees by manipulating her qubit, only that their results will correlate when compared later. This is the no-communication theorem. Entanglement is real and useful for quantum cryptography and certain computing speedups, but it can't be used to send faster-than-light signals. AP-level discussion can stop at 'random outcomes mean no information transfer.'",
      },
      {
        question: "How does this connect to AP Physics 2 MOD-4.A?",
        answer:
          "MOD-4.A covers the basics of quantum behavior: superposition, measurement, and probabilistic outcomes. The quantum coin is the cleanest possible illustration of all three. Students see that a system can occupy a non-classical mixture of two states, that measurement produces one definite result, and that the predicted probabilities match the observed frequencies after many tosses. That trio is exactly what AP Physics 2 expects students to articulate qualitatively.",
      },
    ],
  },
};
