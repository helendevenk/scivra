import type { Experiment } from "@/shared/types/experiment";

export const lorentzForce: Experiment = {
  id: "lorentz-force",
  slug: "lorentz-force",
  title: "Magnetic Force & Lorentz Force",
  subtitle: "Charged particles in magnetic fields",
  description:
    "Watch a charged particle spiral through a magnetic field in 3D. Adjust field strength, charge sign, and initial velocity to see how the Lorentz force creates circular and helical motion. Master the right-hand rule visually.",
  thumbnail: "/imgs/experiments/lorentz-force.png",

  standards: {
    ngss: ["HS-PS2-5", "HS-PS3-5"],
    gcse: ["P7.5"],
    ap: ["3.C.3", "2.D.1", "2.D.2"],
  },
  primaryStandard: "ap-physics-c",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["Lorentz force", "magnetic field", "charged particle", "circular motion", "right-hand rule", "AP Physics 2"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "charge",
      label: "Charge (q)",
      unit: "C",
      min: 1,
      max: 10,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "mass",
      label: "Mass (m)",
      unit: "kg",
      min: 1,
      max: 10,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "velocityX",
      label: "Velocity X",
      unit: "m/s",
      min: 0,
      max: 5,
      default: 2,
      step: 0.1,
      tier: "free",
    },
    {
      id: "magneticField",
      label: "Magnetic Field B",
      unit: "T",
      min: 0.1,
      max: 2,
      default: 0.5,
      step: 0.05,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\vec{F} = q(\\vec{v} \\times \\vec{B})",
      description: "Lorentz force (magnetic component)",
    },
    {
      latex: "F = qvB\\sin\\theta",
      description: "Magnitude of magnetic force",
    },
    {
      latex: "r = \\frac{mv}{|q|B}",
      description: "Radius of circular motion (cyclotron radius)",
    },
    {
      latex: "T = \\frac{2\\pi m}{|q|B}",
      description: "Period of circular motion (independent of speed)",
    },
    {
      latex: "\\omega_c = \\frac{|q|B}{m}",
      description: "Cyclotron frequency",
    },
  ],

  theory:
    "The Lorentz force on a moving charge in a magnetic field is always perpendicular to both the velocity and the field (F = qv×B). Since the force is perpendicular to velocity, it does no work — kinetic energy is constant, only direction changes. This produces circular motion in the plane perpendicular to B. If the particle has a velocity component along B, the path becomes a helix. The radius r = mv/(|q|B) is called the cyclotron radius.",

  instructions:
    "Use the Charge, Mass, Velocity X, and Magnetic Field sliders to change q, m, horizontal entry speed, and B while the particle moves through the field. Try the Cyclotron Motion, Helical Path, and Velocity Selector presets to compare circular motion, angled entry, and force-balancing setups.",

  challenges: [
    {
      id: "lf-c1",
      question: "A proton (m=1.67×10⁻²⁷ kg, q=1.6×10⁻¹⁹ C) moves at 2×10⁶ m/s in a 0.5 T field. Find the radius of its circular path.",
      hint: "r = mv/(qB)",
      tier: "free",
    },
    {
      id: "lf-c2",
      question: "Why does the magnetic force do no work on the particle?",
      hint: "Work = F·d. The force is always perpendicular to displacement.",
      tier: "free",
    },
    {
      id: "lf-c3",
      question: "If you double the magnetic field strength, how does the radius change?",
      hint: "r = mv/(qB) — radius is inversely proportional to B.",
      tier: "free",
    },
    {
      id: "lf-c4",
      question: "An electron enters a 0.2 T field at 3×10⁶ m/s at 30° to the field direction. Describe the resulting path.",
      hint: "Decompose v into parallel and perpendicular components. Parallel → no force, perpendicular → circular. Combined = helix.",
      tier: "pro",
    },
    {
      id: "lf-c5",
      question: "A cyclotron accelerates protons with B = 1.5 T. What is the period of circulation? Is it speed-dependent?",
      hint: "T = 2πm/(qB). The period is independent of speed — that's what makes cyclotrons work.",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["em-spectrum", "electric-field-lines"],

  seoTitle: "Lorentz Force & Magnetic Force — Interactive 3D Simulation | Scivra",
  seoKeywords: [
    "Lorentz force simulation",
    "magnetic force on charge",
    "charged particle magnetic field",
    "AP Physics 2 magnetism",
    "right hand rule",
    "cyclotron radius",
    "helical motion",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Magnetic Force and Lorentz Force",
  },
  htmlControlAliases: { charge: "sl-q", mass: "sl-m", velocityX: "sl-vx", magneticField: "sl-B" },
  presets: [
    {
      id: "cyclotron",
      label: "Cyclotron Motion",
      description:
        "A charged particle enters perpendicular to the magnetic field so the magnetic force acts as the centripetal force for circular motion.",
    },
    {
      id: "helical",
      label: "Helical Path",
      description:
        "A particle keeps a velocity component along the magnetic field while its perpendicular component circles, producing a helix.",
    },
    {
      id: "selector",
      label: "Velocity Selector",
      description:
        "A comparison setup for discussing how selected particle speeds can pass through crossed-field instruments without deflection.",
    },
  ],
  contentSections: {
    whatIsIt:
      "The Lorentz force on a moving charge in a magnetic field is F = qv × B — a vector cross product whose direction is always perpendicular to both v and B. Because the force is perpendicular to velocity, it does no work: kinetic energy is conserved and only the direction of motion changes. In a uniform field, a charge with velocity entirely perpendicular to B executes a circle of radius r = mv/(|q|B) called the cyclotron radius; a velocity component along B adds a straight drift, producing a helix. The simulation renders this 3D motion directly: adjust charge, mass, velocityX, and magneticField to see how the orbit tightens, expands, or changes direction while preserving the same force rule.",
    parameterExplanations: {
      charge:
        "Charge sets q, the amount of electric charge carried by the moving particle. In a magnetic field, the force magnitude is |F| = |q|vB sin θ, so increasing Charge makes the magnetic force stronger when speed and field stay fixed. A stronger force bends the same moving particle into a tighter path because the cyclotron radius follows r = mv/(|q|B). Use this slider with Magnetic Field held constant to isolate how charge changes curvature. Then compare the Cyclotron Motion preset to see the clean circular case before changing other sliders.",
      mass:
        "Mass sets m, the particle's inertia. A larger mass resists changes in direction, so the same magnetic force bends the particle less sharply. In the circular-motion relationship r = mv/(|q|B), mass is directly proportional to radius: doubling Mass doubles the orbit radius when Charge, Velocity X, and Magnetic Field are unchanged. This slider is useful for comparing light and heavy charged particles under identical field conditions. Keep q and B fixed, then sweep Mass to show why electrons curve much more strongly than heavier ions in magnetic instruments.",
      velocityX:
        "Velocity X controls the particle's horizontal entry speed, the velocity component perpendicular to the default magnetic field view. Increasing this speed increases magnetic force because |F| = |q|vB sin θ, but it also increases the required centripetal radius in the same proportion. The result is a larger circular path rather than a faster particle caused by the field. Magnetic force redirects motion without doing work, so the speed you set remains the speed being turned. Compare low and high Velocity X settings in the Cyclotron Motion preset to see the radius expand.",
      magneticField:
        "Magnetic Field sets B, the strength of the uniform field in tesla. A stronger field increases the magnetic force on the moving charge and tightens the path, since r = mv/(|q|B). It also raises the cyclotron angular frequency ω_c = |q|B/m, so the particle turns more rapidly for the same Charge and Mass. This is the clearest slider for showing field control: hold Charge, Mass, and Velocity X steady, then increase Magnetic Field and watch the circular arc shrink. Use the Helical Path preset afterward to connect the same rule to 3D motion.",
    },
    misconceptions: [
      {
        wrong:
          "A stationary charged particle placed in a magnetic field will be pushed in the direction of B.",
        correct:
          "F = qv × B is zero when v = 0. Only moving charges experience a magnetic force. A stationary charge in a pure B field feels no force at all; only an electric field E can exert a force qE on a charge at rest.",
      },
      {
        wrong:
          "The magnetic force does work on the charged particle, so it speeds up as it spirals.",
        correct:
          "The magnetic force is always perpendicular to velocity, so F·v = 0 and no work is done. The particle's speed stays constant — only its direction changes. To speed up or slow down particles, a separate electric field is needed (as in a cyclotron, where E accelerates while B curves).",
      },
      {
        wrong:
          "A larger magnetic field increases the speed of the circular motion.",
        correct:
          "Stronger B tightens the orbit (smaller r = mv/(|q|B)) and increases the angular frequency ω_c = |q|B/m, but the particle's speed |v| is unchanged — set by its initial condition, not by B. The period T = 2πm/(|q|B) decreases with B (the particle goes around faster), but each lap of the smaller circle takes the same speed.",
      },
      {
        wrong:
          "A negative charge has a smaller cyclotron radius than a positive charge of equal magnitude in the same magnetic field.",
        correct:
          "Cyclotron radius r = mv/(|q|B) depends on |q|, so equal-magnitude positive and negative charges trace circles of the same radius. What differs is the rotational sense — a positive charge and a negative charge entering with the same velocity in the same field circle in opposite directions.",
      },
      {
        wrong:
          "Adding a velocity component parallel to B causes the particle to escape the circular orbit entirely.",
        correct:
          "The parallel component v_∥ is unaffected by B (no force acts on it) and simply drifts at constant velocity along the field direction. The perpendicular component v_⊥ still produces circular motion. The combined result is a helix — not an escape, but a steady corkscrew along the field line.",
      },
    ],
    teacherUseCases: [
      "Right-hand rule 3D check: start with the Cyclotron Motion preset, then set Charge = 2 C, Mass = 2 kg, Velocity X = 2 m/s, and Magnetic Field = 0.5 T. Ask students to predict the initial force direction using F = qv × B before running the motion.",
      "Cyclotron radius data collection: keep Charge, Mass, and Magnetic Field fixed while sweeping Velocity X from 1.0 to 5.0 m/s. Students measure or compare the visible orbit radius and test the direct relationship r = mv/(|q|B).",
      "Mass-versus-charge comparison: hold Velocity X and Magnetic Field constant, then change only Mass and only Charge in separate trials. Students explain why larger Mass broadens the orbit while larger Charge tightens it.",
      "Field-strength control: use the Magnetic Field slider from 0.1 T to 2 T with the other sliders fixed. Students connect the shrinking radius and faster turning to r = mv/(|q|B) and ω_c = |q|B/m.",
      "Preset comparison: have students run Cyclotron Motion, Helical Path, and Velocity Selector, record the four slider values after each preset, and write a short claim about which setup best demonstrates circular motion, 3D helical motion, or selected-speed behavior.",
    ],
    faq: [
      {
        question: "Why does the magnetic force never do work on a moving charge?",
        answer:
          "Work requires a force component along the displacement: dW = F·ds = F·v dt. Since F = qv × B is always perpendicular to v by the definition of the cross product, F·v = 0 at every instant. No work is done, so kinetic energy — and therefore speed — is constant. The field can only redirect the particle, never speed it up or slow it down (centripetal acceleration changes velocity direction but not magnitude).",
      },
      {
        question: "What AP Physics C standards does this simulation address?",
        answer:
          "The simulation covers 3.C.3 (forces on moving charges in magnetic fields, including magnitude |F| = |q|vB sin θ and the cross-product direction F = q(v × B)), 2.D.1 (electric and magnetic forces on charged particles), and 2.D.2 (motion of charged particles in uniform fields). These codes are listed in the experiment's standards.ap[] array.",
      },
      {
        question: "What is the cyclotron radius and what does it depend on?",
        answer:
          "The cyclotron radius (Larmor radius) is r = mv/(|q|B). It is larger for faster, heavier, or less-charged particles, and smaller in stronger fields. For a proton (m = 1.67 × 10⁻²⁷ kg, q = 1.6 × 10⁻¹⁹ C) moving at 2 × 10⁶ m/s in B = 0.5 T, r = (1.67 × 10⁻²⁷)(2 × 10⁶)/((1.6 × 10⁻¹⁹)(0.5)) ≈ 0.042 m = 4.2 cm.",
      },
      {
        question: "Why is the period of circular motion independent of speed?",
        answer:
          "T = 2πr/v = 2π(mv/(|q|B))/v = 2πm/(|q|B). The v cancels because a faster particle also has a larger orbit radius in exact proportion. This isochronous property is what makes cyclotrons practical: particles can be accelerated by a fixed-frequency oscillating electric field regardless of how fast they are moving (as long as relativistic effects stay small).",
      },
      {
        question: "What happens when a charged particle enters a magnetic field at an angle, not perpendicular to it?",
        answer:
          "Decompose v into v_⊥ (perpendicular to B) and v_∥ (parallel to B). Only v_⊥ contributes to the Lorentz force, producing circular motion with radius r = mv_⊥/(|q|B). v_∥ drifts unaffected because F = qv_∥ × B = 0. The combination is a helix with radius r and pitch v_∥ T = v_∥ × 2πm/(|q|B). Use the Helical Path preset to compare this angled-entry behavior with the Cyclotron Motion preset.",
      },
      {
        question: "How does the magnetic force compare to the electric force on the same charge?",
        answer:
          "The electric force F_E = qE acts regardless of velocity, can do work, and can change a particle's speed. The magnetic force F_B = qv × B requires motion, does no work, and only redirects the particle. Numerically, for a proton at v = 10⁶ m/s in B = 1 T, F_B = qvB = (1.6 × 10⁻¹⁹)(10⁶)(1) = 1.6 × 10⁻¹³ N; you would need E ≈ 10⁶ V/m to produce the same force magnitude with an electric field.",
      },
    ],
  },
};
