import type { Experiment } from "@/shared/types/experiment";

export const gasProperties: Experiment = {
  id: "gas-properties",
  slug: "gas-properties",
  title: "Gas Properties",
  subtitle: "Pressure, volume, temperature, and the ideal gas law",
  description:
    "Simulate gas behavior at the molecular level. Adjust temperature, volume, and particle count to observe changes in pressure. Watch particles collide with container walls, plot P-V and P-T diagrams, and verify PV = nRT experimentally.",
  thumbnail: "/imgs/experiments/gas-properties.png",

  standards: {
    ngss: ["HS-PS3-2"],
    gcse: [],
    ap: ["9.A.1", "9.B.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: [
    "gas laws",
    "ideal gas law",
    "PV=nRT",
    "Boyle's Law",
    "Charles's Law",
    "kinetic molecular theory",
    "AP Chemistry",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "temperature",
      label: "Temperature",
      unit: "K",
      min: 100,
      max: 800,
      default: 300,
      step: 10,
      tier: "free",
    },
    {
      id: "volume",
      label: "Container Width",
      unit: "%",
      min: 20,
      max: 100,
      default: 60,
      step: 5,
      tier: "free",
    },
    {
      id: "particles",
      label: "Number of Particles",
      unit: "",
      min: 10,
      max: 200,
      default: 80,
      step: 10,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "PV = nRT",
      description:
        "Ideal Gas Law: P = pressure (atm), V = volume (L), n = moles, R = 0.08206 L·atm/(mol·K), T = temperature (K)",
    },
    {
      latex: "KE_{\\text{avg}} = \\frac{3}{2} k_B T",
      description:
        "Average kinetic energy per particle is proportional to temperature. k_B = 1.38 × 10⁻²³ J/K",
    },
  ],

  theory:
    "The ideal gas law PV = nRT relates pressure, volume, amount, and temperature of a gas. At the molecular level, pressure arises from particles colliding with container walls. Temperature is proportional to average kinetic energy. Boyle's Law (P ∝ 1/V at constant T,n) can be observed by changing volume. Charles's Law (V ∝ T at constant P,n) relates volume to temperature. Gay-Lussac's Law (P ∝ T at constant V,n) shows pressure increases with temperature. Deviations from ideal behavior occur at high pressure (small volume) or low temperature, where intermolecular forces become significant.",

  instructions:
    "Use the sliders to adjust temperature, container volume, and number of gas particles. Watch particles bounce around — faster at higher temperatures, more wall collisions in smaller volumes. The real-time graph plots pressure data so you can verify gas law relationships.",

  challenges: [
    {
      id: "gp-c1",
      question: "If you halve the volume at constant T and n, what happens to pressure?",
      hint: "Boyle's Law: P₁V₁ = P₂V₂ → pressure doubles.",
      tier: "free",
    },
    {
      id: "gp-c2",
      question: "At 300 K, 1 mol of gas in 10 L: what is the pressure?",
      hint: "P = nRT/V = (1)(0.08206)(300)/10 = 2.46 atm",
      tier: "free",
    },
    {
      id: "gp-c3",
      question: "Why do real gases deviate from PV=nRT at very high pressures?",
      hint: "At high P, particle volume is not negligible and intermolecular forces matter (van der Waals corrections).",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["ideal-gas-thermodynamics", "calorimetry"],
  htmlPath: "/experiments/ap-chemistry/gas-properties.html",

  seoTitle: "Gas Properties Interactive Simulation | Scivra AP Chemistry",
  seoKeywords: [
    "gas laws simulation",
    "PV=nRT interactive",
    "ideal gas law virtual lab",
    "Boyle's Law simulator",
    "kinetic molecular theory",
    "AP Chemistry gas properties",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Ideal Gas Law and Kinetic Molecular Theory",
  },
};
