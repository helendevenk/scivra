import type { Experiment } from "@/shared/types/experiment";

export const resistanceWire: Experiment = {
  id: "resistance-wire",
  slug: "resistance-wire-lab",
  title: "Resistance in a Wire",
  subtitle: "Explore how length, area, and material affect resistance",
  description:
    "Measure resistance of wires with different lengths, cross-sectional areas, and materials. Verify the resistance equation R = ρL/A and compare resistivity values for common metals.",
  thumbnail: "/imgs/experiments/dc-circuits.png",

  standards: {
    ngss: ["HS-PS3-2"],
    gcse: ["AQA P2.3"],
    ap: ["CHA-2.A", "CHA-2.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["resistance", "resistivity", "wire", "length", "cross-section", "Ohm's law"],
  difficulty: "intermediate",

  parameters: [
    { id: "length", label: "Wire Length", unit: "m", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "diameter", label: "Wire Diameter", unit: "mm", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "material", label: "Material", unit: "", min: 0, max: 4, default: 0, step: 1, tier: "free" },
    { id: "temperature", label: "Temperature", unit: "°C", min: -100, max: 500, default: 20, step: 5, tier: "pro" },
  ],

  formulas: [
    { latex: "R = \\rho\\frac{L}{A}", description: "Resistance equation" },
    { latex: "A = \\pi r^2 = \\frac{\\pi d^2}{4}", description: "Cross-sectional area" },
    { latex: "\\rho(T) = \\rho_0[1 + \\alpha(T - T_0)]", description: "Resistivity temperature dependence" },
  ],

  theory:
    "Resistance depends on the material's resistivity ρ (intrinsic property), wire length L, and cross-sectional area A: R = ρL/A. Longer wire = more resistance (more collisions). Thicker wire = less resistance (more paths for electrons). Resistivity varies by material (copper: 1.7×10⁻⁸ Ω·m; nichrome: 100×10⁻⁸ Ω·m) and increases with temperature for metals. This explains why heating elements use nichrome wire.",
  instructions:
    "Select a wire material. Adjust length and diameter using the sliders. The ohmmeter reads resistance in real time. Plot R vs L (constant A) to verify the linear relationship. Change diameter to verify R ∝ 1/A. Change material to compare resistivities.",
  challenges: [
    { id: "rw-c1", question: "A 1m copper wire (d=1mm) has resistance 0.022Ω. What is R for a 3m, 0.5mm copper wire?", hint: "R ∝ L/A; new R = 0.022 × (3/1) × (1²/0.5²) = 0.022 × 3 × 4 = 0.264Ω", tier: "free" },
    { id: "rw-c2", question: "Why is nichrome used in toasters instead of copper?", hint: "Nichrome has much higher resistivity → more resistance → more heat generated per meter", tier: "free" },
    { id: "rw-c3", question: "How does resistance change when a wire heats up in a toaster?", hint: "R = ρ₀[1+α(T−T₀)]L/A; resistivity increases with T → R increases → slightly less current flows", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["ohms-law", "dc-circuits-basic", "circuit-dc-virtual-lab"],

  seoTitle: "Resistance in a Wire Lab | R = ρL/A | AP Physics 2",
  seoKeywords: ["resistance wire", "resistivity", "R=rho*L/A", "wire resistance", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Wire Resistance, Resistivity, R = ρL/A" },
};
