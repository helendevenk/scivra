import type { Experiment } from "@/shared/types/experiment";

export const keplersLaws: Experiment = {
  id: "keplers-laws",
  slug: "keplers-laws-orbital-mechanics",
  title: "Kepler's Laws",
  subtitle: "Explore planetary motion with three fundamental laws",
  description:
    "Observe planets tracing elliptical orbits and verify all three of Kepler's Laws. See how orbital speed varies with distance from the Sun and measure periods vs. orbital radii.",
  thumbnail: "/imgs/experiments/gravitational-fields.png",

  standards: {
    ngss: ["HS-PS2-4", "HS-ESS1-4"],
    gcse: ["AQA P9.2"],
    ap: ["3.A.1", "3.G.1"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["Kepler's laws", "elliptical orbit", "orbital period", "eccentricity", "planetary motion", "areal velocity"],
  difficulty: "intermediate",

  parameters: [
    { id: "eccentricity", label: "Eccentricity", unit: "", min: 0, max: 0.95, default: 0.3, step: 0.01, tier: "free" },
    { id: "semi_major_axis", label: "Semi-major Axis", unit: "AU", min: 0.5, max: 5, default: 1, step: 0.05, tier: "free" },
    { id: "star_mass", label: "Star Mass", unit: "M☉", min: 0.5, max: 3, default: 1, step: 0.1, tier: "pro" },
  ],

  formulas: [
    { latex: "T^2 = \\frac{4\\pi^2}{GM}a^3", description: "Kepler's Third Law (a = semi-major axis)" },
    { latex: "\\frac{dA}{dt} = \\text{const}", description: "Kepler's Second Law (equal areas)" },
    { latex: "r_{perihelion} = a(1-e),\\; r_{aphelion} = a(1+e)", description: "Orbit extremes" },
  ],

  theory:
    "Kepler's First Law: planets orbit in ellipses with the Sun at one focus. Second Law: a line joining a planet and the Sun sweeps equal areas in equal times — meaning planets move faster near perihelion. Third Law: T² = (4π²/GM)a³, so the orbital period depends only on the semi-major axis. These laws were derived empirically by Kepler and later derived from Newton's law of gravity.",
  instructions:
    "Set eccentricity and semi-major axis. Watch the planet orbit and observe speed variation. The shaded area sectors should all be equal for equal time intervals (Second Law). Record period T for different values of a to verify T² ∝ a³.",
  challenges: [
    { id: "kl-c1", question: "Mars has a = 1.52 AU. What is its orbital period?", hint: "T² = a³ → T = a^(3/2) = 1.52^1.5 ≈ 1.87 years", tier: "free" },
    { id: "kl-c2", question: "At perihelion or aphelion — where is the planet moving fastest?", hint: "Kepler's Second Law: faster near the Sun (perihelion)", tier: "free" },
    { id: "kl-c3", question: "Prove Kepler's Third Law from Newton's gravity for circular orbits.", hint: "Set F_gravity = F_centripetal: GMm/r² = mv²/r; v = 2πr/T; solve for T²", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["gravity-orbits", "gravitational-fields", "my-solar-system"],

  seoTitle: "Kepler's Laws Simulation | Orbital Mechanics | AP Physics 1",
  seoKeywords: ["Kepler's laws", "orbital mechanics", "elliptical orbit", "planetary motion", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Kepler's Laws, Orbital Mechanics, Elliptical Orbits" },
};
