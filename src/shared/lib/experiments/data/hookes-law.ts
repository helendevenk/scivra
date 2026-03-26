import type { Experiment } from "@/shared/types/experiment";

export const hookesLaw: Experiment = {
  id: "hookes-law",
  slug: "hookes-law-spring-force",
  title: "Hooke's Law",
  subtitle: "Discover the relationship between spring force and extension",
  description:
    "Hang masses on springs and measure extension. Verify Hooke's Law (F = kx), measure spring constants, and explore elastic potential energy stored in a stretched spring.",
  thumbnail: "/imgs/experiments/simple-harmonic-motion.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P5.8"],
    ap: ["3.B.3", "5.B.3"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["Hooke's law", "spring constant", "elastic", "extension", "spring force", "elastic potential energy"],
  difficulty: "beginner",

  parameters: [
    { id: "spring_constant", label: "Spring Constant", unit: "N/m", min: 1, max: 200, default: 50, step: 1, tier: "free" },
    { id: "mass", label: "Hanging Mass", unit: "kg", min: 0, max: 5, default: 0.5, step: 0.1, tier: "free" },
    { id: "num_springs", label: "Springs in Series/Parallel", unit: "", min: 1, max: 3, default: 1, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "F = kx", description: "Hooke's Law" },
    { latex: "E_{elastic} = \\frac{1}{2}kx^2", description: "Elastic potential energy" },
    { latex: "k_{series} = \\frac{k_1 k_2}{k_1 + k_2}", description: "Springs in series" },
  ],

  theory:
    "Hooke's Law states that the restoring force of a spring is proportional to its extension (F = kx), where k is the spring constant in N/m. This applies only within the elastic limit — beyond it the spring deforms permanently. Elastic potential energy stored is ½kx². Springs in series have lower effective k (more stretchy); springs in parallel have higher effective k (stiffer).",
  instructions:
    "Drag masses onto the spring hook. The spring stretches; measure extension with the ruler. Plot force vs. extension to find the spring constant from the slope. Add masses beyond the elastic limit to observe deformation.",
  challenges: [
    { id: "hl-c1", question: "A 0.5kg mass stretches a spring by 5cm. What is the spring constant?", hint: "F = mg = 0.5×9.8 = 4.9N; k = F/x = 4.9/0.05 = 98 N/m", tier: "free" },
    { id: "hl-c2", question: "How much elastic PE is stored when a spring (k=50 N/m) is stretched 10cm?", hint: "E = ½kx² = ½ × 50 × (0.1)² = 0.25 J", tier: "free" },
    { id: "hl-c3", question: "Two identical springs (k=100 N/m) in series: what is the effective k?", hint: "k_series = k/2 = 50 N/m", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["masses-springs", "masses-springs-basics", "simple-harmonic-motion"],

  seoTitle: "Hooke's Law Simulation — Spring Constant | AP Physics 1",
  seoKeywords: ["Hooke's law", "spring constant", "elastic force", "spring extension", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Hooke's Law, Spring Constant, Elastic PE" },
};
