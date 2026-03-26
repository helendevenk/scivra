import type { Experiment } from "@/shared/types/experiment";

export const faradaysElectromagneticLab: Experiment = {
  id: "faradays-electromagnetic-lab",
  slug: "faradays-electromagnetic-induction-lab",
  title: "Faraday's Electromagnetic Lab",
  subtitle: "Discover electromagnetic induction with a magnet and coil",
  description:
    "Move a bar magnet through a coil of wire and watch electricity generated. Explore Faraday's Law of induction, Lenz's Law, and the principles behind generators and transformers.",
  thumbnail: "/imgs/experiments/electromagnetic-induction.png",

  standards: {
    ngss: ["HS-PS2-5", "HS-PS3-2"],
    gcse: ["AQA P7.5", "AQA P7.6"],
    ap: ["CHA-5.A", "CHA-5.B", "CHA-5.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["Faraday's law", "electromagnetic induction", "Lenz's law", "coil", "magnet", "generator"],
  difficulty: "intermediate",

  parameters: [
    { id: "magnet_strength", label: "Magnet Strength", unit: "T", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "coil_turns", label: "Coil Turns", unit: "N", min: 1, max: 100, default: 10, step: 1, tier: "free" },
    { id: "magnet_speed", label: "Magnet Speed", unit: "m/s", min: 0, max: 5, default: 1, step: 0.1, tier: "pro" },
  ],

  formulas: [
    { latex: "\\mathcal{E} = -N\\frac{d\\Phi_B}{dt}", description: "Faraday's Law of Induction" },
    { latex: "\\Phi_B = B \\cdot A \\cdot \\cos\\theta", description: "Magnetic flux" },
  ],

  theory:
    "Faraday's Law states that a changing magnetic flux through a coil induces an electromotive force (EMF) proportional to the rate of change and the number of turns. Lenz's Law determines the direction: the induced current creates a magnetic field opposing the change that caused it. This principle underlies all electric generators, transformers, and induction cooktops.",
  instructions:
    "Drag the magnet toward and through the coil. The voltmeter shows induced EMF. Move the magnet faster or use more coil turns to increase the induced voltage. Reverse direction to reverse the current. Connect a light bulb to the coil and see it glow.",
  challenges: [
    { id: "fl-c1", question: "What happens to the induced EMF when you double the number of coil turns?", hint: "ε = N × dΦ/dt — doubling N doubles ε", tier: "free" },
    { id: "fl-c2", question: "The magnet is stationary inside the coil. Why is there no induced EMF?", hint: "Faraday's Law requires dΦ/dt ≠ 0 — flux must be changing", tier: "free" },
    { id: "fl-c3", question: "Why does Lenz's Law mean the induced current always opposes the motion causing it?", hint: "Energy conservation: creating current from nothing would violate it", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["electromagnetic-induction", "generator", "magnets-and-electromagnets"],

  seoTitle: "Faraday's Electromagnetic Lab | Induction Simulation | AP Physics 2",
  seoKeywords: ["Faraday's law", "electromagnetic induction", "Lenz's law", "generator", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Faraday's Law, Electromagnetic Induction, Lenz's Law" },
};
