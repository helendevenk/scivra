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
      id: "mass",
      label: "Central Mass",
      unit: "M_E",
      min: 1,
      max: 100,
      default: 10,
      step: 0.5,
      tier: "free",
    },
    {
      id: "distance",
      label: "Distance",
      unit: "m",
      min: 0.5,
      max: 10,
      default: 3,
      step: 0.1,
      tier: "free",
    },
    {
      id: "planet",
      label: "Planet Selector",
      unit: "index",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
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
    "Use the Central Mass, Distance, and Planet Selector sliders to inspect how gravitational field strength, potential energy, escape velocity, and binding energy change around different massive bodies. Try the Earth Surface, Jupiter Gravity, and Near Black Hole presets to compare familiar, high-gravity, and extreme-field cases.",

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
  htmlControlAliases: { mass: "sliderMass", distance: "sliderDist", planet: "sliderPlanet" },
  presets: [
    {
      id: "earth",
      label: "Earth Surface",
      description:
        "Earth Surface sets a low central mass, close test distance, and rocky planet type so students can use a familiar baseline before comparing stronger fields.",
      paramValues: { mass: 1, distance: 1, planet: 0 },
    },
    {
      id: "jupiter",
      label: "Jupiter Gravity",
      description:
        "Jupiter Gravity uses the largest available central-mass setting, a wider test distance, and the gas giant planet type to show strong but non-black-hole gravity.",
      paramValues: { mass: 100, distance: 5.2, planet: 1 },
    },
    {
      id: "blackhole",
      label: "Near Black Hole",
      description:
        "Near Black Hole combines maximum central mass, minimum test distance, and the black hole planet type to highlight steep potential wells and extreme escape velocity.",
      paramValues: { mass: 100, distance: 0.5, planet: 2 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Gravitational fields obey an inverse-square law — g = GM/r² pointing toward the source mass — and this single relationship generates all of orbital mechanics. A satellite in circular orbit needs v_circ = √(GM/r); escape requires v_esc = √(2GM/r); and Kepler's third law follows from the same central force. This simulation focuses on the field view: change central mass, test distance, and planet type to see field vectors, potential wells, escape velocity, and binding energy respond in real time. The Earth Surface, Jupiter Gravity, and Near Black Hole presets give quick comparison cases for familiar gravity, strong planetary gravity, and an extreme compact source.",
    parameterExplanations: {
      mass:
        "Central Mass controls the strength of the source creating the gravitational field, scaled in Earth-mass units. Raising this slider makes the field vectors stronger at the same distance because g = GM/r² is directly proportional to M. It also deepens the gravitational potential well and raises escape velocity, since v_esc = √(2GM/r). Use Earth Surface as a baseline, then compare Jupiter Gravity and Near Black Hole to see how a larger central mass changes every readout even before you move the distance slider.",
      distance:
        "Distance sets how far the test point is from the center of the gravitational source. This is the r term in g = GM/r², so moving farther away weakens the field rapidly: doubling distance cuts field strength to one fourth when mass stays fixed. Potential energy per kilogram also becomes less negative with distance, and escape velocity falls because less energy is needed to coast away. Keep Central Mass fixed and move only Distance to isolate inverse-square behavior before comparing the presets.",
      planet:
        "Planet Selector chooses the visual and physical context for the central object: 0 for an Earth-like rocky body, 1 for a Jupiter-like gas giant, and 2 for a black-hole case. The selector helps students connect the same gravitational equations to different astronomical settings without adding a new formula. Use it with the mass and distance sliders to compare how field shape, potential-well depth, and escape velocity feel in familiar planetary gravity versus an extreme compact source. It also makes preset comparisons easier to discuss.",
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
          "Moving farther from a planet only makes gravity a little weaker.",
        correct:
          "Gravitational field strength follows an inverse-square relationship, so distance matters strongly. If the distance from the central mass doubles, g becomes one fourth as large; if distance triples, g becomes one ninth as large. The Distance slider makes that rapid falloff visible in the field vectors and data readouts.",
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
          "T² = (4π²/GM)a³ applies to any two-body gravitational system. The proportionality constant 4π²/GM depends on the central body's mass M. For Earth's satellites, replace M_Sun with M_Earth; for the Moon orbiting Earth, use M_Earth. The simulation lets you vary Central Mass to confirm this scaling.",
      },
    ],
    teacherUseCases: [
      "Inverse-square field lab: keep Central Mass fixed, move Distance from 1 to 2 to 4, and have students record gravitational field strength. They compare the readout with g ∝ 1/r² and explain why field vectors shrink rapidly. Addresses standard 3.C.1.",
      "Mass proportionality check: keep Distance fixed and increase Central Mass in equal steps. Students graph field strength versus mass and verify that g is directly proportional to M when r is held constant. Addresses standard 3.C.1.",
      "Escape velocity comparison: students use Earth Surface, Jupiter Gravity, and Near Black Hole presets, then record escape velocity for each case. They explain why v_esc rises with stronger central mass and smaller distance. Addresses standard 3.C.2.",
      "Potential well discussion: compare the three presets and ask students to connect the shape of the potential well to binding energy. Students should cite mass, distance, and planet type as evidence rather than relying only on visual depth.",
      "Model limitations prompt: have students use Planet Selector values 0, 1, and 2 while keeping the other sliders steady, then discuss which changes are visual context and which changes come directly from g = GM/r². Addresses standard 3.G.1.",
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
          "Standards 3.C.1 and 3.C.2 address gravitational force, field, and orbital dynamics, while 3.G.1 covers Kepler's laws and gravitational potential energy. Together they form the core of the AP Physics C Mechanics gravity unit. This simulation probes those ideas through the Central Mass, Distance, and Planet Selector controls.",
      },
      {
        question: "What determines whether an orbit is circular, elliptical, or a hyperbola?",
        answer:
          "Total orbital energy E = ½mv² − GMm/r. If E is negative the orbit is bound (circle or ellipse); if E = 0 it is a parabolic escape; if E is positive it is a hyperbola. The circle case requires both v_r = 0 (purely tangential velocity) AND v_t = √(GM/r) at the launch radius; any bound orbit failing either condition is an ellipse.",
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
