import type { Experiment } from "@/shared/types/experiment";

export const calculusGrapher: Experiment = {
  id: "calculus-grapher",
  slug: "calculus-grapher-derivatives-integrals",
  title: "Calculus Grapher",
  subtitle: "Visualize derivatives and integrals graphically",
  description:
    "Draw any function and instantly see its derivative and integral curves. Explore how slopes relate to the original function and how area accumulates under the curve.",
  thumbnail: "/imgs/experiments/kinematics-graphs.png",

  standards: {
    ngss: [],
    gcse: [],
    ap: ["CHA-4.A", "CHA-4.B"],
  },
  primaryStandard: "general",
  category: "mechanics",
  subject: "math",
  gradeLevel: "9-12",
  tags: ["calculus", "derivative", "integral", "slope", "area under curve", "functions"],
  difficulty: "intermediate",

  parameters: [
    { id: "function_type", label: "Function Type", unit: "", min: 0, max: 5, default: 0, step: 1, tier: "free" },
    { id: "amplitude", label: "Amplitude", unit: "", min: -5, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "frequency", label: "Frequency", unit: "", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
  ],

  formulas: [
    { latex: "f'(x) = \\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}", description: "Definition of derivative" },
    { latex: "\\int_a^b f(x)\\,dx", description: "Definite integral (area)" },
    { latex: "\\frac{d}{dx}[\\sin x] = \\cos x", description: "Example derivative" },
  ],

  theory:
    "The derivative of a function gives the instantaneous rate of change — the slope of the tangent line at each point. The integral gives the accumulated area under the curve. The Fundamental Theorem of Calculus connects them: differentiation and integration are inverse operations. These concepts underlie all of physics, from velocity/acceleration to electric flux.",
  instructions:
    "Select a preset function or draw your own. The derivative curve (blue) shows slope; the integral curve (green) shows accumulated area. Drag the x-position marker to read exact values. Observe how a peak in f becomes a zero in f'.",
  challenges: [
    { id: "cg-c1", question: "Where is the derivative of sin(x) equal to zero?", hint: "Derivative is zero where the original function has a maximum or minimum", tier: "free" },
    { id: "cg-c2", question: "What is the shape of the integral of a constant function?", hint: "Accumulating a constant rate gives a linear increase", tier: "free" },
    { id: "cg-c3", question: "Sketch a function whose derivative is always positive but decreasing.", hint: "Increasing but at a slowing rate — like a logarithm", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["curve-fitting", "kinematics-graphs"],

  seoTitle: "Calculus Grapher — Derivatives and Integrals Visualization | Math Simulation",
  seoKeywords: ["calculus", "derivative", "integral", "graphing", "slope", "area under curve", "math simulation"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Derivatives, Integrals, Calculus" },
};
