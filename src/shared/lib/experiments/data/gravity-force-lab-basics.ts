import type { Experiment } from "@/shared/types/experiment";

export const gravityForceLabBasics: Experiment = {
  id: "gravity-force-lab-basics",
  slug: "gravity-force-lab-basics",
  title: "Gravity Force Lab: Basics",
  subtitle: "Discover how mass and distance affect gravitational force",
  description:
    "Adjust the masses of two objects and the distance between them to see how gravity changes. Verify Newton's Law of Universal Gravitation and compare gravitational force on different planets.",
  thumbnail: "/imgs/experiments/gravitational-fields.png",

  standards: {
    ngss: ["HS-PS2-4"],
    gcse: ["AQA P5.7"],
    ap: ["2.B.1", "2.B.2"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["gravity", "gravitational force", "Newton's law of gravitation", "mass", "distance", "inverse square"],
  difficulty: "beginner",

  parameters: [
    { id: "m1", label: "Mass 1", unit: "kg", min: 1, max: 1000, default: 100, step: 1, tier: "free" },
    { id: "m2", label: "Mass 2", unit: "kg", min: 1, max: 1000, default: 100, step: 1, tier: "free" },
    { id: "distance", label: "Distance", unit: "m", min: 0.1, max: 10, default: 2, step: 0.1, tier: "free" },
  ],

  formulas: [
    { latex: "F = G\\frac{m_1 m_2}{r^2}", description: "Newton's Law of Universal Gravitation (G = 6.674×10⁻¹¹ N·m²/kg²)" },
  ],

  theory:
    "Newton's Law of Universal Gravitation states that every mass attracts every other mass with a force proportional to the product of their masses and inversely proportional to the square of the distance between them. The gravitational constant G = 6.674×10⁻¹¹ N·m²/kg² is extremely small, which is why only planetary-scale masses produce noticeable gravitational forces. This same law describes orbits, tides, and spacecraft trajectories.",
  instructions:
    "Drag the masses to adjust their sizes and separation. The force arrows update in real time. Use the grid to measure distance. Compare the force calculated to the formula. Change both masses to see how F scales.",
  challenges: [
    { id: "gfl-c1", question: "If you triple the distance between two masses, how does gravity change?", hint: "F ∝ 1/r² → tripling r reduces F by factor 9", tier: "free" },
    { id: "gfl-c2", question: "Why do you not feel gravitational attraction to the person next to you?", hint: "G is tiny (10⁻¹¹); typical person masses give force ~ 10⁻⁷ N", tier: "free" },
    { id: "gfl-c3", question: "How does surface gravity g relate to Newton's Law?", hint: "At Earth's surface: g = GM_Earth/R_Earth²", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["gravity-orbits", "gravitational-fields", "keplers-laws"],

  seoTitle: "Gravity Force Lab — Newton's Law of Gravitation | AP Physics 1",
  seoKeywords: ["gravity", "gravitational force", "Newton's universal gravitation", "inverse square law", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Gravitational Force, Newton's Law of Gravitation" },
};
