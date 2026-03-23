import type { Experiment } from "@/shared/types/experiment";

export const gravitationalFields: Experiment = {
  id: "gravitational-fields",
  slug: "gravitational-fields",
  title: "Gravitational Fields & Orbital Mechanics",
  subtitle: "Kepler's laws, satellite orbits, and escape velocity",
  description:
    "Launch satellites into orbit around a planet. Adjust initial velocity to see circular, elliptical, and escape trajectories. Verify Kepler's laws interactively — watch equal areas in equal times as the satellite speeds up near periapsis.",
  thumbnail: "/imgs/experiments/gravitational-fields.png",

  standards: {
    ngss: ["HS-PS2-1", "HS-PS2-4", "HS-ESS1-4"],
    gcse: ["P5.5", "P15"],
    ap: ["3.C.1", "3.C.2", "3.G.1"],
  },
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["gravity", "orbital mechanics", "Kepler's laws", "escape velocity", "satellite", "AP Physics 1"],
  difficulty: "advanced",

  parameters: [
    {
      id: "launchSpeed",
      label: "Launch Speed (v)",
      unit: "km/s",
      min: 1,
      max: 15,
      default: 7.9,
      step: 0.1,
      tier: "free",
    },
    {
      id: "launchAngle",
      label: "Launch Angle (θ)",
      unit: "°",
      min: 0,
      max: 90,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "planetMass",
      label: "Planet Mass (× Earth)",
      unit: "×M⊕",
      min: 0.1,
      max: 10,
      default: 1,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "F = G\\frac{m_1 m_2}{r^2}",
      description: "Newton's law of universal gravitation",
    },
    {
      latex: "v_{circ} = \\sqrt{\\frac{GM}{r}}",
      description: "Circular orbital velocity",
    },
    {
      latex: "v_{esc} = \\sqrt{\\frac{2GM}{r}}",
      description: "Escape velocity",
    },
    {
      latex: "T^2 = \\frac{4\\pi^2}{GM}a^3",
      description: "Kepler's 3rd law (T² ∝ a³)",
    },
    {
      latex: "E_{orbit} = -\\frac{GMm}{2a}",
      description: "Total orbital energy (bound orbit is negative)",
    },
  ],

  theory:
    "Gravity follows an inverse-square law (F ∝ 1/r²). The circular orbital velocity v = √(GM/r) is the exact speed for a stable circular orbit — faster means elliptical or escape, slower means the satellite falls. Kepler's 3 laws: (1) orbits are ellipses with the planet at one focus; (2) equal areas in equal times (conservation of angular momentum); (3) T² ∝ a³. Escape velocity is √2 times the circular orbital speed.",

  instructions:
    "Set the launch speed and angle. The satellite launches horizontally from the surface. At ~7.9 km/s it enters circular orbit. Increase speed to get elliptical orbits. At ~11.2 km/s it escapes. Watch the swept area triangles to verify Kepler's 2nd law. Change planet mass (Pro) to explore other worlds.",

  challenges: [
    {
      id: "gf-c1",
      question: "Earth's radius is 6.4×10⁶ m. Circular orbital speed at surface (ignoring atmosphere) is v = √(GM/R). Calculate it. (G=6.67×10⁻¹¹, M=6×10²⁴ kg)",
      hint: "v = √(6.67×10⁻¹¹ × 6×10²⁴ / 6.4×10⁶) ≈ 7.9 km/s",
      tier: "free",
    },
    {
      id: "gf-c2",
      question: "If a planet's orbit has semi-major axis a = 4 AU, what is its orbital period? (Earth has a = 1 AU, T = 1 year)",
      hint: "T² ∝ a³ → T = (a/1AU)^(3/2) years",
      tier: "free",
    },
    {
      id: "gf-c3",
      question: "Escape velocity from Earth is ~11.2 km/s. What is the ratio v_esc / v_circ?",
      hint: "v_esc = √(2GM/R) = √2 × v_circ",
      tier: "free",
    },
    {
      id: "gf-c4",
      question: "A satellite is in elliptical orbit with periapsis 300 km and apoapsis 2000 km above Earth. Find its orbital period.",
      hint: "a = (r_peri + r_apo)/2 + R_earth. Use Kepler's 3rd law.",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["circular-motion", "projectile-motion"],

  seoTitle: "Gravitational Fields & Orbital Mechanics — 3D Simulation | NeonPhysics",
  seoKeywords: [
    "orbital mechanics simulation",
    "Kepler's laws interactive",
    "satellite orbit simulation",
    "escape velocity",
    "AP Physics 1 gravity",
    "gravitational fields",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Gravitational Fields and Orbital Mechanics",
  },
};
