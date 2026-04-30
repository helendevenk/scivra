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

  contentSections: {
    whatIsIt:
      "Earth doesn't fall into the Sun for the same reason a satellite doesn't fall into Earth: it is falling, but it's also moving sideways fast enough to keep missing. That sideways motion is the secret of every orbit, and this lab puts it directly under your control. Set the mass of the central star, drop a planet at some orbital radius, and give it an initial speed perpendicular to the line to the star. Pick the speed exactly right — v = √(GM/r) — and you get a perfect circle. A little less, the orbit collapses into an ellipse with the planet swooping in close. A little more, it stretches outward. Push past escape velocity and the planet flies off forever. By the end you should be able to predict orbital periods using Kepler's Third Law and explain why astronauts in low Earth orbit are in continuous free-fall.",
    parameterExplanations: {
      star_mass:
        "The central body's mass in solar masses (M☉ = 1.989×10³⁰ kg). Doubling star mass increases circular orbit speed by √2 at the same radius, and shortens orbital periods by the same factor.",
      planet_distance:
        "The orbital radius in astronomical units (1 AU = Earth-Sun distance). Larger radii give slower circular speeds (v ∝ 1/√r) and dramatically longer periods (T ∝ r^1.5 by Kepler's Third Law).",
      planet_velocity:
        "The planet's initial speed in km/s, applied perpendicular to the radius. At Earth's distance from a Sun-mass star, ~30 km/s gives a circle, ~21 km/s gives a tight ellipse, and ~42 km/s is escape velocity.",
      planet_mass:
        "The planet's own mass in Earth masses. For ordinary planets this barely affects the orbit shape — orbital motion depends on the central mass — but heavy planets noticeably tug the star, shifting both around their common center of mass.",
    },
    misconceptions: [
      {
        wrong:
          "Astronauts on the ISS are weightless because there is no gravity in space.",
        correct:
          "Gravity at the ISS altitude (~400 km up) is about 89% of its surface value — almost the same as on the ground. Astronauts feel weightless because they and the station are in continuous free-fall around Earth, not because gravity has switched off.",
      },
      {
        wrong:
          "A faster orbital speed means a longer orbital period because the planet has farther to travel.",
        correct:
          "It's the opposite. Faster orbits sit at smaller radii, where the circumference is also smaller. Mercury orbits faster than Earth (~47 km/s vs. 30 km/s) and finishes a year in 88 days. Kepler's Third Law makes this exact: T² ∝ r³.",
      },
      {
        wrong:
          "Orbits are perfect circles around the Sun.",
        correct:
          "Kepler's First Law says orbits are ellipses with the central body at one focus. Earth's orbit is nearly circular (eccentricity ≈ 0.017), but Mercury's is noticeably elongated (e ≈ 0.21), and comets can have eccentricities above 0.9.",
      },
      {
        wrong:
          "If you double the orbital radius, the period also doubles.",
        correct:
          "Period scales as r^(3/2), not r. Double the radius and the period grows by a factor of 2^1.5 ≈ 2.83. Quadruple the radius and the period grows by 8. That's why Neptune (30 AU) takes 165 years and not 30.",
      },
    ],
    teacherUseCases: [
      "Kepler III data collection: have students measure orbital period at radii of 1, 2, 3, and 4 AU around a 1 M☉ star, plot log(T) vs. log(r), and confirm the slope is 1.5.",
      "Misconception probe — 'is the ISS in zero gravity?': run a circular orbit, label the gravitational force vector at every point, and ask whether gravity is ever zero. Use the answer to debunk 'space has no gravity'.",
      "Escape velocity experiment: with the planet at 1 AU around a 1 M☉ star, increase initial speed from circular (30 km/s) toward 42.4 km/s and have students record where the orbit transitions from ellipse to parabola to hyperbola.",
      "Compare Solar System reality: load star_mass = 1, run planets at 1 AU (Earth), 1.52 AU (Mars), and 5.0 AU (just inside Jupiter's orbit) and check that the measured periods are close to the textbook 1, 1.88, and ~11.2 years (Jupiter's true 11.86 yr is at 5.20 AU, slightly beyond the slider's 5 AU max).",
      "Off-axis launch: pick a circular speed but tilt the velocity vector 10–20° off perpendicular and ask students to predict and explain the resulting ellipse, reinforcing that energy stays the same but angular momentum changes.",
    ],
    faq: [
      {
        question: "Why does the orbital speed for a circle depend only on the central mass and radius, not on the planet's mass?",
        answer:
          "Set gravitational force equal to centripetal force: GMm/r² = mv²/r. The planet's mass m appears on both sides and cancels, leaving v = √(GM/r). A pebble and a planet on the same orbit move at the same speed, just like a feather and a hammer fall together. This is the orbital version of the equivalence principle, and it's why we can build a single circular-orbit formula that works for everything from the ISS to Jupiter.",
      },
      {
        question: "Where does escape velocity come from, and why is it √2 times circular speed?",
        answer:
          "Escape velocity is the minimum speed at which a body has enough kinetic energy to climb out of a gravitational well to infinity, with zero kinetic energy left at infinity. Setting (1/2)mv² = GMm/r gives v_escape = √(2GM/r). Comparing to v_circular = √(GM/r) shows v_escape = √2 × v_circular ≈ 1.414 × v_circular. At Earth's distance from the Sun, that's ~42.4 km/s versus ~30 km/s — the difference between staying in the Solar System and leaving it.",
      },
      {
        question: "How does this experiment satisfy AP Physics 1 standards 2.B.1, 3.A.1, and 3.G.1?",
        answer:
          "Standard 2.B.1 covers gravitational fields produced by a source mass; you see this in how orbit shape depends on star_mass. Standard 3.A.1 is about identifying the forces acting on an object; here gravity is the only force, and it always points to the central body. Standard 3.G.1 covers gravitational interactions between two objects, including circular orbits — exactly what this lab models when you tune planet_velocity to give a steady, closed orbit.",
      },
      {
        question: "What does the orbit look like if I give the planet too little velocity?",
        answer:
          "If the speed is below the circular value but the direction is still perpendicular, you get an ellipse where your release point is the aphelion (farthest point) and the planet swings in to a closer perihelion. If the speed is so low that the perihelion is inside the star, the planet falls in and crashes — a graphic reminder that 'orbiting' really means 'falling continuously without hitting the ground'.",
      },
      {
        question: "How does this lab connect to NGSS HS-ESS1-4?",
        answer:
          "HS-ESS1-4 asks students to use mathematical or computational representations to predict the motion of orbiting objects in the Solar System. This is exactly what the experiment provides: a computational sandbox where you can set masses and initial conditions and watch Kepler's three laws emerge. Doing the lab and recording T vs. r data is a direct performance task for that standard.",
      },
    ],
  },
};
