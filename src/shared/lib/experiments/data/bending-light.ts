import type { Experiment } from "@/shared/types/experiment";

export const bendingLight: Experiment = {
  id: "bending-light",
  slug: "bending-light-refraction",
  title: "Bending Light",
  subtitle: "Explore refraction, reflection, and Snell's Law",
  description:
    "Shoot a laser beam through different materials and watch it bend at interfaces. Measure angles to verify Snell's Law, observe total internal reflection, and explore how lenses and prisms work.",
  thumbnail: "/imgs/experiments/geometric-optics-lenses.png",

  standards: {
    ngss: ["HS-PS4-3"],
    gcse: ["AQA P6.3", "AQA P6.4"],
    ap: ["GO-1.A", "GO-1.B", "GO-1.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "waves",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["refraction", "Snell's law", "reflection", "total internal reflection", "index of refraction", "optics"],
  difficulty: "intermediate",

  parameters: [
    { id: "n1", label: "Index n₁ (top)", unit: "", min: 1.0, max: 2.5, default: 1.0, step: 0.01, tier: "free" },
    { id: "n2", label: "Index n₂ (bottom)", unit: "", min: 1.0, max: 2.5, default: 1.5, step: 0.01, tier: "free" },
    { id: "angle_incident", label: "Incident Angle", unit: "°", min: 0, max: 89, default: 30, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2", description: "Snell's Law" },
    { latex: "\\theta_c = \\arcsin\\left(\\frac{n_2}{n_1}\\right)", description: "Critical angle (TIR)" },
    { latex: "n = \\frac{c}{v}", description: "Index of refraction" },
  ],

  theory:
    "Light bends when it crosses a boundary between materials with different indices of refraction. Snell's Law quantifies this: n₁sinθ₁ = n₂sinθ₂. When light travels from a denser medium to a less dense medium at an angle greater than the critical angle, total internal reflection occurs — the basis for fiber optics. The speed of light in a medium is c/n.",
  instructions:
    "Adjust the incident angle and material indices. The refracted beam updates in real time. Find the critical angle by increasing the incident angle until the refracted beam disappears. Measure angles using the protractor tool.",
  challenges: [
    { id: "bl-c1", question: "Light goes from glass (n=1.5) to air (n=1.0) at 45°. What is the refraction angle?", hint: "Apply Snell's Law: 1.5×sin(45°) = 1.0×sin(θ₂)", tier: "free" },
    { id: "bl-c2", question: "Find the critical angle for glass (n=1.5) to air.", hint: "θ_c = arcsin(n₂/n₁) = arcsin(1/1.5)", tier: "free" },
    { id: "bl-c3", question: "Why does a diamond sparkle more than glass?", hint: "Compare their indices of refraction and critical angles", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["geometric-optics-lenses", "geometric-optics-basics", "color-vision"],

  seoTitle: "Bending Light — Refraction and Snell's Law Simulation | AP Physics 2",
  seoKeywords: ["refraction", "Snell's law", "total internal reflection", "optics simulation", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Refraction, Snell's Law, Total Internal Reflection" },
};
