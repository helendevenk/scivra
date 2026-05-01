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
      id: "fieldStrength",
      label: "Magnetic Field B",
      unit: "T",
      min: 0.1,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "charge",
      label: "Charge (q)",
      unit: "×10⁻¹⁹ C",
      min: -5,
      max: 5,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "velocityMag",
      label: "Initial Speed (v)",
      unit: "×10⁶ m/s",
      min: 0.1,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "fieldDirection",
      label: "B Field Direction",
      unit: "°",
      min: 0,
      max: 360,
      default: 0,
      step: 15,
      tier: "pro",
    },
    {
      id: "vzComponent",
      label: "Velocity z-component (creates helix)",
      unit: "×10⁶ m/s",
      min: 0,
      max: 3,
      default: 0,
      step: 0.1,
      tier: "pro",
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
    "The magnetic field B points along the z-axis (blue arrow). The charged particle enters moving in the x-direction. Observe the circular path. Flip the charge sign to reverse the rotation direction. Add a z-velocity component (Pro) to see helical motion. Watch how increasing B tightens the circular orbit.",

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
  contentSections: {
    whatIsIt:
      "The Lorentz force on a moving charge in a magnetic field is F = qv × B — a vector cross product whose direction is always perpendicular to both v and B. Because the force is perpendicular to velocity, it does no work: kinetic energy is conserved and only the direction of motion changes. In a uniform field, a charge with velocity entirely perpendicular to B executes a circle of radius r = mv/(|q|B) called the cyclotron radius; a velocity component along B adds a straight drift, producing a helix. The simulation renders this 3D motion directly: adjust fieldStrength, charge sign, and velocityMag to see how the orbit tightens or expands, then use vzComponent to switch from circular to helical motion.",
    parameterExplanations: {
      fieldStrength:
        "Magnitude of the uniform magnetic field B in tesla. The cyclotron radius r = mv/(|q|B) is inversely proportional to B, so increasing fieldStrength tightens the orbit and increases cyclotron frequency ω_c = |q|B/m.",
      charge:
        "Charge q in units of 10⁻¹⁹ C, ranging from −5 to +5. The sign determines the rotation sense via the cross product: flipping from +q to −q reverses the circular orbit direction. |F| = |q|vB sin θ — the sign of q determines direction, not force magnitude; larger |q| also tightens the cyclotron radius r = mv/(|q|B).",
      velocityMag:
        "Initial speed of the particle in units of 10⁶ m/s, in the plane perpendicular to B. Larger velocityMag increases the cyclotron radius linearly (r = mv/(|q|B)) while leaving the period T = 2πm/(|q|B) unchanged — the orbit simply gets bigger at the same rotation rate.",
      fieldDirection:
        "Polar angle of B measured from the +z axis, in degrees. At 0° B points along +z (and v_z is parallel to B); larger angles tip B away from the z-axis, so the v_z component is no longer parallel to B and contributes to v × B, altering the orbital plane and helix axis.",
      vzComponent:
        "Velocity component along the z-axis (parallel to the default B direction) in units of 10⁶ m/s. This component experiences zero magnetic force since F = qv_∥ × B = 0 for parallel vectors. Adding v_z produces helical motion: the circular orbit in the xy-plane is combined with uniform drift along z.",
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
      "Right-hand rule 3D check: set charge = +1 (10⁻¹⁹ C), fieldStrength = 1 T, velocityMag = 1 (×10⁶ m/s), and pause the simulation at t = 0. Ask students to predict the direction of the initial force using F = qv × B before unpausing. Verify against the first segment of the simulated orbit; then flip charge to −1 and repeat.",
      "Cyclotron radius data collection: hold fieldStrength = 1 T and charge = 1 fixed; sweep velocityMag from 0.5 to 3.0 (×10⁶ m/s) in 0.5-unit steps and measure the orbit radius from the display. Plot r vs. velocityMag and confirm the linear relationship r = mv/(|q|B), extracting m/|q| from the slope.",
      "Period independence demonstration: change velocityMag over a wide range while keeping fieldStrength and charge fixed, and time one full orbit in the simulation. Students observe that the period T = 2πm/(|q|B) does not change with speed — a counterintuitive result that underlies how cyclotrons work and directly addresses AP standard 3.C.3.",
      "Helix construction: set vzComponent to a nonzero value and increase fieldStrength to observe the helix pitch tighten. Ask students to predict which parameter controls the helix radius (v_⊥ and B) vs. which controls the pitch (v_z and the period T). This separates the two independent motions cleanly.",
      "Misconception probe — stationary charge: set velocityMag to its minimum value and discuss the v → 0 limit, where F = qv × B → 0. Ask students to explain the result using F = qv × B and contrast it with what would happen if an electric field were present instead, connecting to the full Lorentz force F = q(E + v × B).",
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
          "Decompose v into v_⊥ (perpendicular to B) and v_∥ (parallel to B). Only v_⊥ contributes to the Lorentz force, producing circular motion with radius r = mv_⊥/(|q|B). v_∥ drifts unaffected because F = qv_∥ × B = 0. The combination is a helix with radius r and pitch v_∥ T = v_∥ × 2πm/(|q|B). Use the vzComponent slider to explore this directly.",
      },
      {
        question: "How does the magnetic force compare to the electric force on the same charge?",
        answer:
          "The electric force F_E = qE acts regardless of velocity, can do work, and can change a particle's speed. The magnetic force F_B = qv × B requires motion, does no work, and only redirects the particle. Numerically, for a proton at v = 10⁶ m/s in B = 1 T, F_B = qvB = (1.6 × 10⁻¹⁹)(10⁶)(1) = 1.6 × 10⁻¹³ N; you would need E ≈ 10⁶ V/m to produce the same force magnitude with an electric field.",
      },
    ],
  },
};
