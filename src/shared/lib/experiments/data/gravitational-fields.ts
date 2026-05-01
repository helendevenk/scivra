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
  primaryStandard: "ap-physics-c",
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

  seoTitle: "Gravitational Fields & Orbital Mechanics — 3D Simulation | Scivra",
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
  contentSections: {
    whatIsIt:
      "Gravitational fields obey an inverse-square law — g = GM/r² pointing toward the source mass — and this single relationship generates all of orbital mechanics. A satellite launched horizontally at exactly v_circ = √(GM/r) stays in a circular orbit; faster launches produce ellipses or escape trajectories; slower ones curve back into the planet. Kepler's three laws all follow from Newton's law of gravitation: elliptical orbits with the planet at one focus, equal areas swept in equal times (a consequence of angular momentum conservation), and T² ∝ a³. This simulation lets you set launch speed, launch angle, and planet mass to trace circular, elliptical, and hyperbolic trajectories in real time, while swept-area triangles verify Kepler's second law as the satellite races through periapsis and crawls through apoapsis.",
    parameterExplanations: {
      launchSpeed:
        "Initial speed in km/s at the moment of launch from the planet surface. At approximately 7.9 km/s (for Earth-mass planet) the orbit becomes circular. Below that value the satellite arcs back down; above it the orbit stretches into an ellipse with a higher apoapsis; at ~11.2 km/s (= √2 × v_circ) the satellite reaches escape velocity and follows a parabolic escape trajectory; above v_esc the path becomes hyperbolic.",
      launchAngle:
        "Angle in degrees above horizontal at launch. A purely horizontal launch (0°) at circular speed produces a circular orbit. Non-zero angles introduce a radial velocity component, which shifts the apse line so that periapsis and apoapsis appear elsewhere along the orbit; the launch point is generally not an apsis because apsides require zero radial velocity.",
      planetMass:
        "Planet mass expressed as a multiple of Earth's mass (M⊕ ≈ 5.97 × 10²⁴ kg). Increasing the planet mass scales both the circular orbital speed (v_circ ∝ √M) and escape velocity (v_esc ∝ √M) proportionally, while also tightening orbital periods via Kepler's third law T² = (4π²/GM)a³.",
    },
    misconceptions: [
      {
        wrong:
          "A satellite in orbit has no gravity acting on it — that's why it floats.",
        correct:
          "Gravity is the only force acting on an orbiting satellite. Its acceleration is g = GM/r² directed toward Earth, roughly 8.7 m/s² at low Earth orbit. The sensation of weightlessness occurs because the satellite and occupants are in free fall together — not because gravity vanishes.",
      },
      {
        wrong:
          "Orbital mechanics requires constant velocity — satellites travel at the same speed around their orbit.",
        correct:
          "Only circular orbits have constant speed. In an elliptical orbit, the satellite moves fastest at periapsis and slowest at apoapsis. This follows from conservation of angular momentum: L = m r v_t (the tangential component) is constant, so v must increase as r decreases. Kepler's second law (equal areas in equal times) is a geometric restatement of this fact.",
      },
      {
        wrong:
          "Increasing launch speed always raises the entire orbit — the satellite gets farther from the planet everywhere.",
        correct:
          "Adding speed at the launch point raises only the opposite side of the orbit (apoapsis), not the launch point itself. The launch point becomes periapsis. The orbit stretches asymmetrically: one end is anchored at the launch radius while the other lifts away.",
      },
      {
        wrong:
          "Escape velocity means the rocket has to keep thrusting until it escapes — it can never coast.",
        correct:
          "Escape velocity v_esc = √(2GM/r) is the minimum initial speed that allows coasting to infinity against gravity with zero final speed. Once launched at v_esc (or beyond), no further thrust is needed; the object decelerates but never quite stops and never returns. Total orbital energy E = ½mv² − GMm/r ≥ 0 for escape.",
      },
      {
        wrong:
          "Kepler's third law T² ∝ a³ only applies to planets orbiting the Sun.",
        correct:
          "T² = (4π²/GM)a³ applies to any two-body gravitational system. The proportionality constant 4π²/GM depends on the central body's mass M. For Earth's satellites, replace M_Sun with M_Earth; for the Moon orbiting Earth, use M_Earth. The simulation lets you vary planetMass to confirm this scaling.",
      },
    ],
    teacherUseCases: [
      "Circular orbit speed measurement: have students increment launchSpeed in steps of 0.1 km/s near 7.9 km/s and identify by inspection (orbit closes cleanly) the circular orbital speed. They then compute v_circ = √(GM/R_Earth) analytically and compare to their measured value. Addresses standard 3.C.1.",
      "Kepler's second law verification: launch an elliptical orbit (launchSpeed ≈ 9 km/s, launchAngle = 0°). Pause the simulation at four equally-spaced time intervals and estimate the swept-area triangles using the on-screen indicators. Students verify that all four areas are approximately equal, linking area conservation to angular momentum conservation. Addresses standard 3.G.1.",
      "Escape velocity ratio lab: have students record v_circ (the circular orbital speed found in the first activity) and then find v_esc by increasing launchSpeed until the satellite no longer returns. Students compute the ratio v_esc/v_circ and check whether it matches √2 ≈ 1.414. Addresses standard 3.C.2.",
      "Misconception probe — does a faster orbit always stay higher?: set launchAngle = 0° and ask students to predict what happens to the orbit shape as launchSpeed increases from 7.9 to 11 km/s. After their predictions, run the simulation and discuss the asymmetric stretching of the ellipse — only apoapsis rises while periapsis stays at the launch radius.",
      "Planet mass scaling: vary planetMass from 0.5 to 2.0 × M⊕ while keeping the orbit circular by adjusting launchSpeed = √(GM/r) for each M (so the orbit radius stays fixed). Have students measure the orbital period T and verify T² = (4π²/GM)a³ with a held constant, confirming that T² ∝ 1/M at fixed radius. Addresses standard 3.C.2.",
    ],
    faq: [
      {
        question: "Why is escape velocity √2 times circular orbital speed?",
        answer:
          "For a circular orbit, ½mv² = GMm/(2r), giving v_circ = √(GM/r). Escape requires total energy ≥ 0: ½mv_esc² − GMm/r = 0, giving v_esc = √(2GM/r) = √2 · v_circ. The factor of √2 arises because you must supply the full gravitational potential energy GMm/r rather than half of it.",
      },
      {
        question: "What AP Physics C standard directly covers gravitational fields and orbital energy?",
        answer:
          "Standards 3.C.1 and 3.C.2 address gravitational force, field, and orbital dynamics, while 3.G.1 covers Kepler's laws and gravitational potential energy. Together they form the core of the AP Physics C Mechanics gravity unit. All three are probed by this simulation through the launchSpeed, launchAngle, and planetMass parameters.",
      },
      {
        question: "What determines whether an orbit is circular, elliptical, or a hyperbola?",
        answer:
          "Total orbital energy E = ½mv² − GMm/r. If E is negative the orbit is bound (circle or ellipse); if E = 0 it is a parabolic escape; if E is positive it is a hyperbola. The dividing line between circle and ellipse is whether the velocity vector is exactly perpendicular to the radius vector at every point.",
      },
      {
        question: "Why does Kepler's second law (equal areas in equal times) hold?",
        answer:
          "The gravitational force is central — it always points toward the planet — so the torque about the planet is zero, and angular momentum L = mvr·sinφ is conserved. Area swept per unit time equals L/(2m) = constant, so equal time intervals always sweep equal areas regardless of where in the orbit the satellite is.",
      },
      {
        question: "How do I find the orbital period from the simulation?",
        answer:
          "Launch a stable orbit, then use the simulation's time readout to measure the elapsed time for one complete revolution. For a circular orbit you can also calculate T = 2πr/v_circ. For an ellipse, use Kepler's third law: T² = (4π²/GM)a³, where a = (r_periapsis + r_apoapsis)/2 in meters.",
      },
      {
        question: "What is the total energy of a bound orbit, and why is it negative?",
        answer:
          "E_orbit = −GMm/(2a) for any elliptical orbit, where a is the semi-major axis. The negative sign means the satellite is bound: you would need to add |E| joules of energy to free it. For a circular orbit of radius r, this simplifies to E = −GMm/(2r). The deeper (lower) the orbit, the more negative the energy and the faster the satellite moves.",
      },
    ],
  },
};
