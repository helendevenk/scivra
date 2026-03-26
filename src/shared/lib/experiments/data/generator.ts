import type { Experiment } from "@/shared/types/experiment";

export const generator: Experiment = {
  id: "generator",
  slug: "electric-generator-motor",
  title: "Generator",
  subtitle: "Convert mechanical energy to electrical energy",
  description:
    "Spin a coil in a magnetic field and generate alternating current. Explore how generators and motors work, observe AC output on an oscilloscope, and understand the energy conversion process.",
  thumbnail: "/imgs/experiments/electromagnetic-induction.png",

  standards: {
    ngss: ["HS-PS2-5", "HS-PS3-2"],
    gcse: ["AQA P7.6"],
    ap: ["CHA-5.A", "CHA-5.B", "CHA-5.D"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["generator", "motor", "electromagnetic induction", "AC current", "coil rotation", "energy conversion"],
  difficulty: "intermediate",

  parameters: [
    { id: "rotation_speed", label: "Rotation Speed", unit: "rpm", min: 0, max: 3000, default: 300, step: 10, tier: "free" },
    { id: "field_strength", label: "Field Strength", unit: "T", min: 0.1, max: 2, default: 0.5, step: 0.1, tier: "free" },
    { id: "coil_turns", label: "Coil Turns", unit: "N", min: 1, max: 200, default: 50, step: 5, tier: "free" },
    { id: "coil_area", label: "Coil Area", unit: "cm²", min: 1, max: 100, default: 20, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "\\mathcal{E}(t) = NBA\\omega\\sin(\\omega t)", description: "Generator EMF" },
    { latex: "\\omega = 2\\pi f", description: "Angular frequency" },
    { latex: "\\mathcal{E}_{max} = NBA\\omega", description: "Peak EMF" },
  ],

  theory:
    "An electric generator converts mechanical energy to electrical energy by rotating a coil in a magnetic field. The changing magnetic flux induces an alternating EMF proportional to the number of turns N, field strength B, coil area A, and angular velocity ω. This is the reverse of a motor. The output frequency equals the rotation frequency — 60 Hz for US power grids requires 3600 rpm (or 1800 rpm with 4-pole machines).",
  instructions:
    "Adjust the rotation speed slider and observe the AC output on the oscilloscope. Increase field strength or coil turns to boost the peak voltage. Switch to motor mode — now the external AC drives rotation instead.",
  challenges: [
    { id: "ge-c1", question: "A coil with N=100, B=0.5T, A=0.01m² spins at 60Hz. What is the peak EMF?", hint: "ε_max = NBAω = 100 × 0.5 × 0.01 × 2π×60 ≈ 188 V", tier: "free" },
    { id: "ge-c2", question: "Why does the EMF vary as sin(ωt) and not cos(ωt)?", hint: "It depends on the starting angle — 0° at t=0 when coil is parallel to field gives sin", tier: "free" },
    { id: "ge-c3", question: "Why do wind turbines use permanent magnet generators instead of electromagnets?", hint: "Permanent magnets need no excitation power and work even when grid is down", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["faradays-electromagnetic-lab", "electromagnetic-induction", "ac-circuits"],

  seoTitle: "Electric Generator Simulation | Faraday's Law | AP Physics 2",
  seoKeywords: ["electric generator", "motor", "electromagnetic induction", "AC current", "Faraday's law", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Electric Generator, Faraday's Law, AC Generation" },
};
