import type { Experiment } from "@/shared/types/experiment";

export const vectorAddition: Experiment = {
  id: "vector-addition",
  slug: "vector-addition-components",
  title: "Vector Addition",
  subtitle: "Add vectors graphically and by components",
  description:
    "Add two or three vectors using the graphical tip-to-tail method and verify with component decomposition. Explore how forces, velocities, and displacements combine as vectors in 2D.",
  thumbnail: "/imgs/experiments/newton-laws.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P5.1"],
    ap: ["3.A.2", "3.E.1"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["vectors", "vector addition", "components", "resultant", "force vectors", "2D motion"],
  difficulty: "beginner",

  parameters: [
    { id: "v1_magnitude", label: "Vector 1 Magnitude", unit: "N", min: 0, max: 20, default: 10, step: 0.5, tier: "free" },
    { id: "v1_angle", label: "Vector 1 Angle", unit: "°", min: 0, max: 360, default: 0, step: 5, tier: "free" },
    { id: "v2_magnitude", label: "Vector 2 Magnitude", unit: "N", min: 0, max: 20, default: 8, step: 0.5, tier: "free" },
    { id: "v2_angle", label: "Vector 2 Angle", unit: "°", min: 0, max: 360, default: 90, step: 5, tier: "free" },
    { id: "v3_magnitude", label: "Vector 3 Magnitude", unit: "N", min: 0, max: 20, default: 0, step: 0.5, tier: "pro" },
  ],

  formulas: [
    { latex: "\\vec{R} = \\vec{A} + \\vec{B}", description: "Vector sum (resultant)" },
    { latex: "R_x = A_x + B_x = A\\cos\\theta_A + B\\cos\\theta_B", description: "x-components" },
    { latex: "R = \\sqrt{R_x^2 + R_y^2}", description: "Resultant magnitude" },
  ],

  theory:
    "Vectors have both magnitude and direction. Vector addition follows the parallelogram law (or tip-to-tail): place vectors head to tail and draw the resultant from start to end. Equivalently, add components separately: R_x = A_x + B_x, R_y = A_y + B_y. The magnitude and direction of the resultant follow from Pythagorean theorem and arctangent. This is the foundation for analyzing 2D forces, velocity, and displacement.",
  instructions:
    "Drag the vector arrows to set magnitude and direction. The resultant vector (green) appears automatically. Switch between graphical and component modes. Verify that tip-to-tail gives the same answer as component addition.",
  challenges: [
    { id: "va-c1", question: "Add a 10N east vector and an 8N north vector. What is the resultant magnitude and angle?", hint: "R = √(10²+8²) = √164 ≈ 12.8N; θ = arctan(8/10) ≈ 38.7° north of east", tier: "free" },
    { id: "va-c2", question: "Three forces balance (net = 0). If two are known, how do you find the third?", hint: "F₃ = −(F₁ + F₂); add F₁ and F₂ first, then negate the resultant", tier: "free" },
    { id: "va-c3", question: "A river flows east at 3 m/s. A swimmer swims north at 4 m/s relative to the water. What is their speed relative to the ground?", hint: "V_ground = √(3²+4²) = 5 m/s at arctan(3/4)=37° east of north", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["forces-motion-basics", "projectile-motion", "newtons-laws"],

  seoTitle: "Vector Addition Simulation | 2D Forces | AP Physics 1",
  seoKeywords: ["vector addition", "resultant vector", "components", "2D forces", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Vector Addition, Components, Resultant" },
};
