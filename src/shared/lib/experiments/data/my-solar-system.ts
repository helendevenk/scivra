import type { Experiment } from "@/shared/types/experiment";

export const mySolarSystem: Experiment = {
  id: "my-solar-system",
  slug: "my-solar-system-simulation",
  title: "My Solar System",
  subtitle: "Build and simulate your own multi-body solar system",
  description:
    "Create custom solar systems with stars, planets, and moons. Explore N-body gravitational interactions, orbital stability, binary stars, and the chaotic behavior of three-body systems.",
  thumbnail: "/imgs/experiments/gravitational-fields.png",

  standards: {
    ngss: ["HS-PS2-4", "HS-ESS1-4"],
    gcse: ["AQA P9.2"],
    ap: ["2.B.1", "3.G.1"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["solar system", "N-body", "orbital mechanics", "binary stars", "gravity", "chaos"],
  difficulty: "intermediate",

  parameters: [
    { id: "num_bodies", label: "Number of Bodies", unit: "", min: 2, max: 6, default: 2, step: 1, tier: "free" },
    { id: "body1_mass", label: "Central Mass", unit: "M☉", min: 0.1, max: 10, default: 1, step: 0.1, tier: "free" },
    { id: "body2_vel", label: "Planet Initial Speed", unit: "km/s", min: 0, max: 60, default: 30, step: 0.5, tier: "free" },
    { id: "time_scale", label: "Time Scale", unit: "×", min: 1, max: 100, default: 10, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "\\vec{F}_{12} = -G\\frac{m_1 m_2}{r_{12}^2}\\hat{r}_{12}", description: "Gravitational force between bodies" },
    { latex: "\\vec{a} = \\sum_{j\\neq i}\\vec{F}_{ij}/m_i", description: "N-body acceleration" },
  ],

  theory:
    "The N-body gravitational problem involves calculating the motion of multiple masses under mutual gravitational attraction. For 2 bodies, exact analytical solutions exist (elliptical orbits). For 3+ bodies, the problem is generally chaotic — tiny changes in initial conditions lead to wildly different outcomes over time. Real solar systems are stabilized by large mass ratios (Sun >> planets) and widely spaced orbits.",
  instructions:
    "Add bodies by clicking. Set mass and initial velocity using the control panel. Run the simulation and watch orbits form. Add a third body to observe orbital perturbations. Try creating a stable binary star with two equal masses.",
  challenges: [
    { id: "mss-c1", question: "Create a stable figure-8 orbit with three equal masses. What initial conditions are needed?", hint: "Specific symmetric initial conditions; try equal masses at 120° with tangential velocities", tier: "free" },
    { id: "mss-c2", question: "Add Jupiter (large planet) to a solar system with Earth. How does it perturb Earth's orbit?", hint: "Jupiter's gravity slightly shifts Earth's orbital elements — this is real! Jupiter acts as a 'vacuum cleaner'", tier: "free" },
    { id: "mss-c3", question: "Why are chaotic 3-body systems practically unpredictable over long timescales?", hint: "Lyapunov exponents grow exponentially; initial precision required grows exponentially", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["gravity-orbits", "keplers-laws", "gravitational-fields"],

  seoTitle: "My Solar System Simulation | N-body Gravity | AP Physics 1",
  seoKeywords: ["solar system simulation", "N-body gravity", "orbital mechanics", "binary stars", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "N-body Gravity, Orbital Mechanics, Solar System" },
};
