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

  contentSections: {
    whatIsIt:
      "Before Newton wrote down gravity, Johannes Kepler stared at Tycho Brahe's hand-tabulated data on Mars for years and pulled three laws out of the numbers. First: orbits are ellipses, with the Sun at one focus, not at the center. Second: a planet sweeps out equal areas in equal times — speeding up at perihelion and slowing down at aphelion. Third: the square of the orbital period is proportional to the cube of the semi-major axis, the same constant for every planet around a given star. This lab lets you build any ellipse you want by adjusting eccentricity and semi-major axis, then watch the orbit unfold in real time. The shaded swept-area sectors update as the planet moves, so you can verify Kepler II by eye, and a period readout lets you confirm Kepler III by varying a and recording T.",
    parameterExplanations: {
      eccentricity:
        "How elongated the ellipse is. e = 0 is a perfect circle; e = 0.5 is clearly stretched; e = 0.95 is a long thin cigar. Earth's orbit has e ≈ 0.017; Halley's Comet has e ≈ 0.97.",
      semi_major_axis:
        "Half the long diameter of the ellipse, in AU. This single quantity sets the orbital period via T² = (4π²/GM)a³, regardless of how eccentric the orbit is.",
      star_mass:
        "Central body mass in solar masses. Period scales as 1/√M, so a 4 M☉ star halves the period of any orbit at the same semi-major axis.",
    },
    misconceptions: [
      {
        wrong:
          "The Sun is at the center of every planet's elliptical orbit.",
        correct:
          "Kepler's First Law puts the Sun at one of the two foci of the ellipse, not at the center. For low-eccentricity orbits like Earth's the focus and center are nearly the same, but for comets the offset is huge — the Sun is way off to one side.",
      },
      {
        wrong:
          "A planet moves at the same speed all the way around its orbit.",
        correct:
          "Kepler's Second Law (equal areas in equal times) means planets speed up near the Sun and slow down far from it. Earth moves about 30.3 km/s in January (perihelion) and 29.3 km/s in July (aphelion) — a measurable 3% difference.",
      },
      {
        wrong:
          "Kepler's Third Law (T² ∝ a³) means doubling the orbital radius doubles the period.",
        correct:
          "T scales as a^1.5, not a. Double the semi-major axis and the period grows by 2^1.5 ≈ 2.83. Quadruple it and the period grows by 8. That's why Neptune at 30 AU takes 165 years instead of 30.",
      },
      {
        wrong:
          "An orbit with eccentricity 0.9 is barely different from one with eccentricity 0.5.",
        correct:
          "Eccentricity is highly nonlinear in shape. e = 0.5 looks oval; e = 0.9 looks like a long needle, with aphelion about 19 times farther from the focus than perihelion. Run both in the simulator and the difference is dramatic, even though the numbers seem close.",
      },
    ],
    teacherUseCases: [
      "Kepler III lab: have students record period at semi-major axes of 1, 2, 3, and 4 AU around a 1 M☉ star, plot log T vs. log a, and confirm the slope is exactly 1.5.",
      "Equal-areas data collection: pause the simulation at perihelion and aphelion and use the swept-area readout to verify the planet covers the same area in equal time despite very different speeds.",
      "Misconception probe — 'where is the Sun?': set eccentricity to 0.7 and ask students to mark where they think the Sun sits. Most pick the geometric center; reveal the true focus position to break the misconception.",
      "Real-Solar-System verification: have students set a = 0.39 AU (Mercury), 1.52 AU (Mars), 5.2 AU (Jupiter), 30 AU (Neptune) one at a time and check that periods match real values.",
      "Derive-and-test: ask students to derive T² ∝ a³ from Newton's gravity for circular orbits (set GMm/r² = mv²/r, use v = 2πr/T) and then verify the same formula works for elliptical orbits in the simulator.",
    ],
    faq: [
      {
        question: "Why is the Sun at one focus of an elliptical orbit instead of at the center?",
        answer:
          "An ellipse has two foci, symmetric about its center. When you solve Newton's law of gravity for a bound two-body orbit, the math forces the central mass to sit at one focus, not the geometric center. The other focus is an empty point in space with no physical meaning. For circular orbits the two foci merge with the center, which is why the focus distinction only matters for noticeably elliptical orbits.",
      },
      {
        question: "How does Kepler's Second Law follow from conservation of angular momentum?",
        answer:
          "Angular momentum L = mvr_perp is conserved for any central force, including gravity, because gravity exerts no torque about the central body. The area swept by the radius vector in a small time dt is dA = (1/2)r × v dt, which equals L/(2m) dt. Since L and m are constant, dA/dt is constant — that's Kepler's Second Law. So 'equal areas in equal times' is just angular-momentum conservation in disguise.",
      },
      {
        question: "How does Kepler's Third Law connect to AP Physics 1 standards 3.A.1 and 3.G.1?",
        answer:
          "Standard 3.A.1 is about identifying forces; in an orbit, gravity is the only force and provides centripetal acceleration. Standard 3.G.1 covers gravitational interactions including circular orbits. Setting GMm/r² = mv²/r and substituting v = 2πr/T gives T² = (4π²/GM)r³ directly — the algebraic version of Kepler III. Doing the derivation and verifying it numerically in this lab is a clean performance task for both standards.",
      },
      {
        question: "What's the maximum eccentricity for a bound orbit?",
        answer:
          "A bound elliptical orbit has eccentricity strictly less than 1. At e = 1 the orbit becomes a parabola — the boundary case where the body has exactly escape velocity. At e > 1 the trajectory is a hyperbola and the body flies past the central mass once and never returns. The simulator caps eccentricity at 0.95 to keep things visible, but everything between 0.95 and 1 is still a closed (very elongated) orbit, not a parabola yet.",
      },
      {
        question: "Why do all planets around the same star obey T² = (constant) × a³?",
        answer:
          "Because the constant is 4π²/(GM_star), which depends only on the central mass — not on the orbiting planet's mass at all. So Mercury, Earth, and Neptune all satisfy the same proportionality with the same constant. If you switch to a different star (different M), you get a different constant, but every planet around that star obeys the same new constant. This is why Kepler III is one of the cleanest laws in physics.",
      },
    ],
  },
};
