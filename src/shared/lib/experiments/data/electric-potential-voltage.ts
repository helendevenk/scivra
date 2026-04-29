import type { Experiment } from "@/shared/types/experiment";

export const electricPotentialVoltage: Experiment = {
  id: "electric-potential-voltage",
  slug: "electric-potential-voltage-equipotential-lines",
  title: "Electric Potential & Voltage",
  subtitle: "Map equipotential surfaces and understand work done by electric fields",
  description:
    "Place one to three point charges in 2D space and visualize the resulting electric potential field as a color map with overlaid equipotential lines. Measure potential at any point and calculate the work done moving a test charge between two equipotential surfaces.",
  thumbnail: "/imgs/experiments/electric-potential-voltage.png",

  standards: {
    ngss: ["HS-PS2-4", "HS-PS3-2"],
    gcse: ["P6.3", "P6.4"],
    ap: ["CHA-2.C", "CHA-2.D", "CHA-3.A"],
  },
  primaryStandard: "ap-physics-c",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "electric potential",
    "voltage",
    "equipotential lines",
    "point charge",
    "electric field",
    "potential energy",
    "Coulomb",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "charge_value",
      label: "Source Charge",
      unit: "μC",
      min: -10,
      max: 10,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "test_charge_sign",
      label: "Test Charge Sign (0=Positive, 1=Negative)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "charge_count",
      label: "Number of Charges",
      unit: "",
      min: 1,
      max: 3,
      default: 1,
      step: 1,
      tier: "pro",
    },
    {
      id: "charge2_x",
      label: "Charge 2 X Position",
      unit: "m",
      min: -3,
      max: 3,
      default: 2,
      step: 0.5,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "V = \\frac{kq}{r} \\quad (k = 8.99 \\times 10^9\\,\\text{N·m}^2\\text{/C}^2)",
      description: "Electric potential due to a point charge",
    },
    {
      latex: "E = -\\frac{\\Delta V}{\\Delta x}",
      description: "Electric field from potential gradient",
    },
    {
      latex: "U = qV",
      description: "Electric potential energy",
    },
    {
      latex: "W = q(V_1 - V_2)",
      description: "Work done by the electric field",
    },
  ],

  theory:
    "Electric potential V at a point is the work done per unit positive charge to bring a test charge from infinity to that point. For a point charge, V = kq/r, and the field points in the direction of decreasing potential: E = −ΔV/Δx. Equipotential lines connect points of equal potential; they are always perpendicular to electric field lines. No work is done moving a charge along an equipotential surface.",
  instructions:
    "Adjust the source charge value and sign with the sliders to reshape the potential map. Click anywhere on the canvas to read the local potential. Unlock Pro mode to add a second or third charge and observe how their fields superpose.",

  challenges: [
    {
      id: "epv-c1",
      question: "What is the electric potential 1 m from a +2 μC point charge?",
      hint: "Use V = kq/r with k = 8.99 × 10⁹ N·m²/C²",
      tier: "free",
    },
    {
      id: "epv-c2",
      question: "What is the geometric relationship between equipotential lines and electric field lines?",
      hint: "Think about the direction of E = −∇V",
      tier: "free",
    },
    {
      id: "epv-c3",
      question: "How much work is needed to move a +1 μC charge from V = 100 V to V = 300 V?",
      hint: "Use W = q(V₁ − V₂) and be careful about the sign of work",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["electric-field-lines", "dc-circuits-basic", "capacitors-rc-circuits"],

  seoTitle: "Electric Potential & Voltage — Equipotential Lines Simulation | Scivra",
  seoKeywords: [
    "electric potential",
    "voltage",
    "equipotential lines",
    "point charge",
    "electric field",
    "potential energy",
    "AP Physics electricity",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Electric Potential, Voltage, and Equipotential Surfaces",
  },
};
