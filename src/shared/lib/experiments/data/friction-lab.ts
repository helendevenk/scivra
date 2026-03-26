import type { Experiment } from "@/shared/types/experiment";

export const frictionLab: Experiment = {
  id: "friction-lab",
  slug: "friction-lab-static-kinetic",
  title: "Friction Lab",
  subtitle: "Measure static and kinetic friction coefficients",
  description:
    "Pull a block across different surfaces and measure the friction force. Determine static and kinetic friction coefficients experimentally and discover how normal force affects friction.",
  thumbnail: "/imgs/experiments/newton-laws.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P5.3"],
    ap: ["3.B.1", "3.B.2"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["friction", "static friction", "kinetic friction", "coefficient", "normal force", "experiment"],
  difficulty: "intermediate",

  parameters: [
    { id: "applied_force", label: "Applied Force", unit: "N", min: 0, max: 200, default: 50, step: 1, tier: "free" },
    { id: "mass", label: "Block Mass", unit: "kg", min: 0.5, max: 20, default: 5, step: 0.5, tier: "free" },
    { id: "surface_type", label: "Surface Material", unit: "", min: 0, max: 4, default: 0, step: 1, tier: "free" },
    { id: "extra_weight", label: "Added Weight", unit: "kg", min: 0, max: 20, default: 0, step: 0.5, tier: "pro" },
  ],

  formulas: [
    { latex: "F_{s,max} = \\mu_s N", description: "Maximum static friction" },
    { latex: "F_k = \\mu_k N", description: "Kinetic friction force" },
    { latex: "N = mg + W_{extra}", description: "Normal force" },
  ],

  theory:
    "Static friction prevents an object from moving when a force is applied up to a maximum threshold F_s,max = μ_s N. Once motion begins, kinetic friction F_k = μ_k N acts, typically with μ_k < μ_s. Both friction forces are proportional to the normal force N but independent of contact area. The coefficients μ_s and μ_k depend only on the materials in contact.",
  instructions:
    "Increase the applied force slowly. The block remains stationary while friction matches it (static region). When the applied force exceeds F_s,max the block starts sliding and friction drops to the kinetic value. Record the threshold force to calculate μ_s, and the sliding force to find μ_k.",
  challenges: [
    { id: "fr-c1", question: "A 5kg block on wood has μ_s = 0.5. What is the maximum static friction force?", hint: "F_s = μ_s × N = 0.5 × 5 × 9.8", tier: "free" },
    { id: "fr-c2", question: "Why does adding weight to the block change the friction force but not the coefficient?", hint: "F_friction = μN; more weight increases N, which increases F_friction; μ stays constant", tier: "free" },
    { id: "fr-c3", question: "Experimentally, why is μ_s > μ_k for most material pairs?", hint: "At rest, surface asperities interlock more deeply; motion reduces contact depth", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["forces-motion-basics", "newtons-laws", "forces-motion-basics"],

  seoTitle: "Friction Lab — Static and Kinetic Friction | AP Physics 1",
  seoKeywords: ["friction", "static friction", "kinetic friction", "coefficient of friction", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Friction, Static Friction, Kinetic Friction" },
};
