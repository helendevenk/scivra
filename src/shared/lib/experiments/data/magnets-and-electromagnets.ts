import type { Experiment } from "@/shared/types/experiment";

export const magnetsAndElectromagnets: Experiment = {
  id: "magnets-and-electromagnets",
  slug: "magnets-electromagnets-field-lines",
  title: "Magnets and Electromagnets",
  subtitle: "Explore permanent magnets and electromagnets",
  description:
    "Visualize magnetic field lines around bar magnets and electromagnets. Compare field strengths, observe how current creates magnetic fields, and discover how coils act as magnets.",
  thumbnail: "/imgs/experiments/electromagnetic-induction.png",

  standards: {
    ngss: ["HS-PS2-5"],
    gcse: ["AQA P7.4"],
    ap: ["CHA-4.A", "CHA-4.B", "CHA-4.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["magnets", "electromagnet", "magnetic field", "field lines", "solenoid", "current"],
  difficulty: "beginner",

  parameters: [
    { id: "current", label: "Coil Current", unit: "A", min: -10, max: 10, default: 5, step: 0.5, tier: "free" },
    { id: "turns", label: "Coil Turns", unit: "N", min: 1, max: 50, default: 10, step: 1, tier: "free" },
    { id: "bar_strength", label: "Bar Magnet Strength", unit: "T", min: 0, max: 5, default: 1, step: 0.1, tier: "pro" },
  ],

  formulas: [
    { latex: "B_{solenoid} = \\mu_0 \\frac{N}{L} I", description: "Magnetic field inside solenoid" },
    { latex: "\\vec{F} = q\\vec{v} \\times \\vec{B}", description: "Force on moving charge" },
  ],

  theory:
    "A moving electric charge creates a magnetic field. In a coil (solenoid), each turn contributes to a net magnetic field inside, analogous to a bar magnet. The field strength is proportional to current and turns per unit length. Reversing current direction reverses field polarity. Permanent magnets have aligned electron spins that act like many tiny current loops.",
  instructions:
    "Toggle between bar magnet mode and coil mode. Use the compass to probe field direction anywhere in space. Increase current to strengthen the electromagnet. Switch to the field line view to see the full pattern. Compare the coil field to the bar magnet field — they look identical far from the source.",
  challenges: [
    { id: "me-c1", question: "What happens to the electromagnet field when you reverse current direction?", hint: "Field reverses — north and south poles swap", tier: "free" },
    { id: "me-c2", question: "A solenoid with 100 turns, 10cm long, carries 2A. What is B inside?", hint: "B = μ₀(N/L)I = 4π×10⁻⁷ × (100/0.1) × 2", tier: "free" },
    { id: "me-c3", question: "Why is an iron core placed inside an electromagnet?", hint: "Iron has high magnetic permeability — it amplifies the field by hundreds of times", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["faradays-electromagnetic-lab", "lorentz-force", "electromagnetic-induction"],

  seoTitle: "Magnets and Electromagnets Simulation | Magnetic Field | AP Physics 2",
  seoKeywords: ["magnets", "electromagnet", "magnetic field lines", "solenoid", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Magnetic Fields, Electromagnets, Solenoid" },
};
