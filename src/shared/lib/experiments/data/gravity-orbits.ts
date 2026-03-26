import type { Experiment } from "@/shared/types/experiment";

export const gravityOrbits: Experiment = {
  id: "gravity-orbits",
  slug: "gravity-orbits-solar-system",
  title: "Gravity and Orbits",
  subtitle: "Model planetary motion and orbital mechanics",
  description:
    "Place stars, planets, and moons and watch them orbit under gravity. Explore Kepler's laws, escape velocity, and what happens when you change orbital parameters.",
  thumbnail: "/imgs/experiments/gravitational-fields.png",

  standards: {
    ngss: ["HS-PS2-4", "HS-ESS1-4"],
    gcse: ["AQA P9.2"],
    ap: ["2.B.1", "3.A.1", "3.G.1"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["orbits", "gravity", "Kepler's laws", "solar system", "centripetal force", "escape velocity"],
  difficulty: "intermediate",

  parameters: [
    { id: "star_mass", label: "Star Mass", unit: "M☉", min: 0.1, max: 10, default: 1, step: 0.1, tier: "free" },
    { id: "planet_distance", label: "Orbital Radius", unit: "AU", min: 0.1, max: 5, default: 1, step: 0.05, tier: "free" },
    { id: "planet_velocity", label: "Initial Speed", unit: "km/s", min: 1, max: 50, default: 30, step: 0.5, tier: "free" },
    { id: "planet_mass", label: "Planet Mass", unit: "M_Earth", min: 0.1, max: 318, default: 1, step: 0.1, tier: "pro" },
  ],

  formulas: [
    { latex: "v_{orbital} = \\sqrt{\\frac{GM}{r}}", description: "Circular orbit speed" },
    { latex: "T^2 \\propto r^3", description: "Kepler's Third Law" },
    { latex: "v_{escape} = \\sqrt{\\frac{2GM}{r}}", description: "Escape velocity" },
  ],

  theory:
    "Gravity provides the centripetal force needed for orbital motion. For circular orbits, v = √(GM/r) — the orbital speed depends only on the central mass and radius. Kepler's Third Law states T² ∝ r³ for all planets around the same star. Elliptical orbits arise when the initial velocity differs from the circular orbit speed. Escape velocity is √2 times the circular orbit speed.",
  instructions:
    "Click to place a planet, then set its initial velocity with the arrow. Observe the orbit shape — circular, elliptical, or hyperbolic. Enable the path tracer to see the full orbit. Check the orbit period to verify Kepler's Third Law.",
  challenges: [
    { id: "go-c1", question: "What happens if you give a planet exactly circular orbit speed but point it slightly off?", hint: "Still an ellipse — slight angle change preserves energy but changes shape", tier: "free" },
    { id: "go-c2", question: "Earth orbits at 30 km/s. What is Earth's escape velocity from the Sun?", hint: "v_escape = √2 × v_circular = √2 × 30 ≈ 42.4 km/s", tier: "free" },
    { id: "go-c3", question: "Verify Kepler's Third Law: compare orbital periods for planets at 1 AU and 4 AU.", hint: "T² ∝ r³ → (T₂/T₁)² = (4/1)³ → T₂ = 8 years", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["keplers-laws", "gravitational-fields", "my-solar-system"],

  seoTitle: "Gravity and Orbits Simulation | Kepler's Laws | AP Physics 1",
  seoKeywords: ["gravity orbits", "Kepler's laws", "orbital mechanics", "escape velocity", "solar system", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Orbital Mechanics, Kepler's Laws, Gravity" },
};
