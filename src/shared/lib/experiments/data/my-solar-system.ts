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

  contentSections: {
    whatIsIt:
      "Real solar systems are messy. The Sun pulls Earth, Earth pulls the Moon, Jupiter pulls Earth a little, and the whole apparatus has been wobbling for 4.6 billion years. This lab lets you build that mess from scratch. Drop in a central star, add a planet, give it a velocity, and watch a clean two-body ellipse form. Now add a third body and everything changes — orbits start to wobble, drift, or in extreme cases fling one body away entirely. The two-body problem has a closed-form solution; the three-body problem doesn't, and never will — a deep mathematical fact proved by Poincaré. By tuning masses, separations, and initial velocities you'll see chaos appear, watch binary stars trade angular momentum, and discover why our own Solar System looks so orderly: huge mass ratios and wide orbital spacing keep perturbations small.",
    parameterExplanations: {
      num_bodies:
        "How many gravitating objects share the simulation. Two bodies always give a clean ellipse; three or more give the chaotic N-body problem with no analytical solution and exponential sensitivity to initial conditions.",
      body1_mass:
        "Mass of the central body in solar masses. Larger central mass tightens orbits (v_orbit ∝ √M) and stabilizes the system against perturbations from smaller bodies.",
      body2_vel:
        "Initial speed of the orbiting planet in km/s, applied perpendicular to its radius. Around a 1 M☉ star at 1 AU, ~30 km/s makes a circle; below 21 km/s the orbit collapses; above 42 km/s the planet escapes.",
      time_scale:
        "Simulation speed multiplier. Real orbital periods are years, so a ×10 to ×100 speedup lets you watch full orbits and long-term perturbations without waiting in real time.",
    },
    misconceptions: [
      {
        wrong:
          "If two-body orbits have an exact solution, three-body orbits do too — we just have not solved them yet.",
        correct:
          "The general three-body problem has no closed-form analytical solution and never will. Poincaré proved it in 1887. Specific symmetric configurations (like the figure-8 orbit) have solutions, but the generic case is provably chaotic and only solvable numerically.",
      },
      {
        wrong:
          "If I add Jupiter to a Sun-Earth system, Earth's orbit stays exactly the same because Jupiter is so far away.",
        correct:
          "Jupiter actually does perturb Earth's orbit — measurable shifts in eccentricity over thousands of years drive ice ages (Milankovitch cycles). The simulation can show this directly: add a Jupiter-mass body and watch Earth's orbit slowly precess.",
      },
      {
        wrong:
          "Binary star systems are unstable because two stars pull each other in random directions.",
        correct:
          "Two-body binary stars are perfectly stable — they orbit their common center of mass on stable ellipses forever (in pure Newtonian gravity). Instability shows up only when a third body enters the system.",
      },
      {
        wrong:
          "In a chaotic three-body system, the bodies move randomly with no pattern.",
        correct:
          "Chaos is not randomness. The bodies follow Newton's laws deterministically at every step — but tiny changes in starting conditions grow exponentially, so long-term prediction is practically impossible. Short-term behavior is still smooth and lawful.",
      },
    ],
    teacherUseCases: [
      "Two-body baseline: have students set up a clean Sun-Earth ellipse and verify it repeats exactly each period. Use this as the reference state before introducing chaos.",
      "Misconception probe — 'is N-body just hard, or actually unsolvable?': run two nearly identical 3-body setups with starting positions differing by 0.01 AU. Watch them diverge after a few orbits to make exponential sensitivity tangible.",
      "Build a binary star: place two equal masses with equal-and-opposite velocities and observe them orbit a fictitious midpoint. Then drop a small planet far away and ask whether it orbits one star, the other, or both.",
      "Replicate the figure-8 three-body orbit: three equal masses with carefully chosen tangential velocities trace a single figure-8. This is one of the few known stable 3-body solutions and it stuns students.",
      "Jupiter-effect data: with Sun + Earth set up steadily, add Jupiter and have students record Earth's perihelion and aphelion every simulated year for 50 years to see the slow drift driven by gravitational perturbations.",
    ],
    faq: [
      {
        question: "Why is the three-body problem fundamentally harder than the two-body problem?",
        answer:
          "Two bodies have only one separation vector, and the equations of motion reduce to a single conserved-energy, conserved-angular-momentum problem with a closed-form solution (Kepler ellipses). Three bodies have three separation vectors and not enough conservation laws to pin down the motion. Poincaré showed in the 1880s that the resulting equations are non-integrable and exhibit chaotic behavior, so generic 3-body orbits cannot be written as a finite formula. Modern N-body simulations get around this by stepping forward numerically with tiny time intervals.",
      },
      {
        question: "What makes our Solar System stable enough to last 4.6 billion years if N-body chaos is real?",
        answer:
          "Three things: a huge mass ratio (the Sun has 99.86% of all Solar System mass), wide orbital spacing (so planets perturb each other only weakly), and resonance avoidance (planet periods are not in low-integer ratios that would amplify perturbations). The Solar System is technically chaotic, with a Lyapunov time around 5 million years, but that chaos manifests as small drifts in orbital elements rather than catastrophic ejections. We are essentially riding a marginally stable arrangement.",
      },
      {
        question: "Why does adding a body sometimes eject one of the others?",
        answer:
          "In an unstable three-body interaction, gravitational slingshots can transfer enough kinetic energy to one body to exceed local escape velocity, sending it flying away while the remaining two settle into a tighter binary. This 'three-body break-up' is the most common end state for compact triples. You can reproduce it in the simulator with three equal masses placed close together — the system almost always ejects one and leaves a binary behind.",
      },
      {
        question: "How does this connect to AP Physics 1 standards 2.B.1 and 3.G.1 and NGSS HS-ESS1-4?",
        answer:
          "Standard 2.B.1 covers gravitational fields from one or more source masses; the N-body view extends that to fields produced by all bodies acting on each other. Standard 3.G.1 covers gravitational interactions between two objects, which the lab generalizes to systems where every pair of objects interacts simultaneously. NGSS HS-ESS1-4 asks for mathematical or computational models of orbital motion — exactly what an N-body integrator is. Use this lab when students are ready to push past textbook two-body idealizations.",
      },
      {
        question: "Can I build a stable three-planet system around one star?",
        answer:
          "Yes, if the planet masses are small compared to the star and the orbits are widely spaced. Try a 1 M☉ star with planets at 1, 2.5, and 6 AU — the system will run cleanly for many orbits. Pack the planets too close (say 1, 1.2, 1.5 AU) and mutual perturbations will destabilize the system within a few orbits, which is itself a great lesson on why real exoplanet systems tend to space themselves out.",
      },
    ],
  },
};
