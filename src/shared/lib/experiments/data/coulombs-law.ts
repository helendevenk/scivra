import type { Experiment } from "@/shared/types/experiment";

export const coulombsLaw: Experiment = {
  id: "coulombs-law",
  slug: "coulombs-law-electric-force",
  title: "Coulomb's Law",
  subtitle: "Measure the electric force between charged particles",
  description:
    "Place two charged particles and measure the electrostatic force between them. Verify the inverse-square relationship with distance and the linear relationship with charge magnitude.",
  thumbnail: "/imgs/experiments/electric-field-lines.png",

  standards: {
    ngss: ["HS-PS2-4", "HS-PS2-5"],
    gcse: ["AQA P2.2"],
    ap: ["CHA-1.A", "CHA-1.B", "CHA-1.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["Coulomb's law", "electric force", "charge", "inverse square", "electrostatics"],
  difficulty: "intermediate",

  parameters: [
    { id: "q1", label: "Charge 1", unit: "nC", min: -10, max: 10, default: 1, step: 0.1, tier: "free" },
    { id: "q2", label: "Charge 2", unit: "nC", min: -10, max: 10, default: -1, step: 0.1, tier: "free" },
    { id: "distance", label: "Separation", unit: "cm", min: 1, max: 50, default: 10, step: 0.5, tier: "free" },
  ],

  formulas: [
    { latex: "F = k\\frac{|q_1 q_2|}{r^2}", description: "Coulomb's Law (k = 8.99×10⁹ N·m²/C²)" },
    { latex: "E = \\frac{F}{q} = k\\frac{q}{r^2}", description: "Electric field from point charge" },
  ],

  theory:
    "Coulomb's Law describes the electrostatic force between two point charges. The force is proportional to the product of the charges and inversely proportional to the square of the distance between them. Like charges repel; unlike charges attract. The law is the electric analogue of Newton's Law of Universal Gravitation, and both follow the inverse-square relationship.",
  instructions:
    "Drag the charges to change their separation. Adjust charge magnitudes and signs. The force arrows scale with the force magnitude. Toggle the force vs. distance graph to verify the inverse-square law.",
  challenges: [
    { id: "cl-c1", question: "If you double the distance between two charges, how does the force change?", hint: "F ∝ 1/r²: doubling r reduces F by a factor of 4", tier: "free" },
    { id: "cl-c2", question: "Two +2nC charges are 10cm apart. What is the force between them?", hint: "F = 8.99×10⁹ × (2×10⁻⁹)² / (0.1)²", tier: "free" },
    { id: "cl-c3", question: "Compare Coulomb's force and gravity between two electrons. Which dominates?", hint: "Calculate F_E / F_G using the electron's charge and mass", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["electric-field-lines", "balloons-static-electricity", "electric-potential-voltage"],

  seoTitle: "Coulomb's Law Simulation | Electric Force | AP Physics 2",
  seoKeywords: ["Coulomb's law", "electric force", "charge interaction", "inverse square law", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Coulomb's Law, Electric Force, Electrostatics" },
};
