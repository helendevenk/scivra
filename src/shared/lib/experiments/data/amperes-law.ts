import type { Experiment } from "@/shared/types/experiment";

export const amperesLaw: Experiment = {
  id: "amperes-law",
  slug: "amperes-law",
  title: "Ampère's Law",
  subtitle:
    "Magnetic field circulation around current-carrying conductors",
  description:
    "Explore Ampère's Law by constructing Amperian loops around current-carrying wires and solenoids. Visualize the 3D magnetic field vectors using the right-hand rule, calculate the line integral ∮B·dl, and verify that it equals μ₀I_enc. Experiment with single wires, coaxial cables, and solenoids to see how symmetry simplifies magnetic field calculations.",
  thumbnail: "/imgs/experiments/amperes-law.png",

  standards: {
    ngss: ["HS-PS2-5"],
    gcse: [],
    ap: ["3.A.1", "3.B.1", "3.C.1"],
  },
  primaryStandard: "ap-physics-c",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "Ampère's Law",
    "magnetic field",
    "Amperian loop",
    "enclosed current",
    "solenoid",
    "right-hand rule",
    "AP Physics C",
    "E&M",
  ],
  difficulty: "advanced",

  parameters: [
    {
      id: "currentConfig",
      label: "Configuration (0=wire, 1=coaxial, 2=solenoid)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "current",
      label: "Current I",
      unit: "A",
      min: 0.5,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "loopRadius",
      label: "Amperian Loop Radius",
      unit: "m",
      min: 0.3,
      max: 5,
      default: 2,
      step: 0.1,
      tier: "free",
    },
    {
      id: "fieldDensity",
      label: "Field Vector Density",
      unit: "",
      min: 4,
      max: 20,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "solenoidTurns",
      label: "Solenoid Turns per meter",
      unit: "turns/m",
      min: 10,
      max: 200,
      default: 100,
      step: 10,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{\\text{enc}}",
      description:
        "Ampère's Law: the line integral of B around a closed loop equals μ₀ times the enclosed current",
    },
    {
      latex: "B = \\frac{\\mu_0 I}{2\\pi r}",
      description:
        "Magnetic field around an infinite straight wire at distance r",
    },
    {
      latex: "B = \\mu_0 n I",
      description:
        "Magnetic field inside an ideal solenoid: n = turns per unit length, I = current",
    },
  ],

  theory:
    "Ampère's Law is one of Maxwell's equations relating the circulation of the magnetic field around a closed loop to the current enclosed by that loop. For a long straight wire carrying current I, the magnetic field at distance r forms concentric circles with magnitude B = μ₀I/(2πr), where μ₀ = 4π×10⁻⁷ T·m/A. Using the right-hand rule: thumb along current direction, fingers curl in the direction of B. For a coaxial cable (inner current +I, outer current -I), the field outside is zero because the net enclosed current is zero. Inside a solenoid with n turns per unit length, B = μ₀nI (uniform and parallel to the axis), while outside it is approximately zero. Ampère's Law is most useful when the magnetic field has high symmetry (cylindrical for wires, rectangular for solenoids), allowing B to be pulled out of the integral.",

  instructions:
    "Select a current configuration and set the current magnitude. Adjust the Amperian loop radius to see how the enclosed current changes. Observe the 3D magnetic field vectors (color-coded by magnitude, following the right-hand rule). The circulation panel shows ∮B·dl and verifies Ampère's Law. Rotate the 3D view with mouse drag.",

  challenges: [
    {
      id: "al-c1",
      question:
        "A long wire carries 5 A. What is B at 2 m from the wire?",
      hint: "B = μ₀I/(2πr) = (4π×10⁻⁷)(5)/(2π×2) = 5×10⁻⁷ T = 0.5 μT",
      tier: "free",
    },
    {
      id: "al-c2",
      question:
        "For a solenoid with n=100 turns/m and I=5 A, what is B inside?",
      hint: "B = μ₀nI = (4π×10⁻⁷)(100)(5) = 6.28×10⁻⁴ T ≈ 0.628 mT",
      tier: "free",
    },
    {
      id: "al-c3",
      question:
        "A coaxial cable has +10 A inner and -10 A outer. What is B outside the cable?",
      hint: "B = 0 — the net enclosed current is zero, so ∮B·dl = μ₀(0) = 0",
      tier: "pro",
    },
  ],

  wave: 12,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["magnets-and-electromagnets", "faradays-electromagnetic-lab"],
  htmlPath: "/experiments/ap-physics-c/amperes-law.html",

  seoTitle: "Ampère's Law 3D Simulation | Scivra AP Physics C",
  seoKeywords: [
    "Ampere's Law simulation",
    "magnetic field visualization",
    "Amperian loop 3D",
    "AP Physics C E&M",
    "solenoid magnetic field",
    "right-hand rule interactive",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Advanced Placement",
    teaches: "Ampère's Law and Magnetic Fields",
  },
  contentSections: {
    whatIsIt:
      "In magnetostatics, Ampère's Law states that the line integral of B around any closed Amperian loop equals μ₀ times the current threading that loop: ∮B·dl = μ₀I_enc; the full Maxwell-Ampère version adds a displacement-current term μ₀ε₀ dΦ_E/dt for time-varying fields. The power of the magnetostatic form lies in symmetry: for a long straight wire the integrand is constant around a circle of radius r, giving B(2πr) = μ₀I and therefore B = μ₀I/(2πr). Inside an ideal solenoid with n turns per meter, a rectangular Amperian loop yields B = μ₀nI (uniform, axially directed) while outside B ≈ 0. The simulation lets you switch between a bare wire, a coaxial cable, and a solenoid, position the Amperian loop with loopRadius, and watch ∮B·dl update numerically as the enclosed current changes.",
    parameterExplanations: {
      currentConfig:
        "Selects the geometry: 0 = infinite straight wire, 1 = coaxial cable (inner +I, outer −I), 2 = solenoid. Each geometry has a different enclosed-current rule, so the same Amperian loop radius gives a different B depending on which configuration is active.",
      current:
        "Current magnitude I in amperes flowing through the conductor(s). For the wire configuration, B = μ₀I/(2πr) scales linearly with current. For the solenoid, B = μ₀nI, so doubling current doubles the interior field.",
      loopRadius:
        "Radius of the circular Amperian loop in meters. For the wire, increasing loopRadius while I is constant reduces B as 1/r. For the coaxial cable set to enclose only the inner conductor, B decreases with r; once the loop also encloses the outer conductor, B drops to zero because I_enc = 0.",
      fieldDensity:
        "Controls how many magnetic field vectors are rendered in the 3D view — purely a visualization parameter. Higher values show the spatial variation of B more clearly but do not affect any calculated quantity.",
      solenoidTurns:
        "Turns per meter n of the solenoid. In the solenoid configuration, B = μ₀nI scales linearly with solenoidTurns. Increasing this value from 10 to 200 turns/m at I = 5 A takes B from about 63 μT to about 1.26 mT inside the solenoid.",
    },
    misconceptions: [
      {
        wrong:
          "Ampère's Law works for any closed loop — you can always use it to find B directly, even for a bent or irregular wire.",
        correct:
          "Mathematically ∮B·dl = μ₀I_enc holds for any closed loop, but B can only be factored out of the integral when the field has high symmetry (constant magnitude along the loop, constant angle with dl). For irregular geometries you cannot simplify the integral, so Ampère's Law gives a true result but not a useful one for calculating B.",
      },
      {
        wrong:
          "The magnetic field inside a solenoid points in the same direction as the current in the wire.",
        correct:
          "The field inside a solenoid points along the solenoid axis, which is perpendicular to the current-carrying wire segments. Apply the right-hand rule: curl the fingers in the direction of current flow around the turns and the thumb points along the axis in the direction of B.",
      },
      {
        wrong:
          "The magnetic field outside a solenoid is just weaker, not zero.",
        correct:
          "For an ideal infinite solenoid, B outside is zero by a symmetry argument: the field must be uniform and vanish at infinity for an infinite uniform solenoid. An Amperian rectangle straddling the wall with one long side inside and one outside gives B_inside − B_outside = μ₀nI (the loop encloses surface current nIℓ), consistent with B_inside = μ₀nI when B_outside = 0. Real finite solenoids have a small but nonzero exterior field.",
      },
      {
        wrong:
          "A coaxial cable with equal and opposite inner and outer currents still produces a B field outside the cable.",
        correct:
          "Any Amperian loop enclosing the full coaxial cable sees I_enc = +I − I = 0, so ∮B·dl = 0 and B = 0 outside. This is why coaxial cables are used in precision electronics — they confine the magnetic field entirely within the outer conductor.",
      },
      {
        wrong:
          "Doubling the loop radius doubles the magnetic field from a long wire because the loop encloses more area.",
        correct:
          "B = μ₀I/(2πr) falls as 1/r — doubling r halves B. Ampère's Law relates the integral to I_enc, which does not change with loop size for a single wire. The field drops because the same current is spread over a larger circumference.",
      },
    ],
    teacherUseCases: [
      "Symmetry argument gateway: before running the simulation, ask students to write the general Ampère's Law ∮B·dl = μ₀I_enc and explain what additional physical argument lets them replace the integral with B(2πr). Use this to establish that the law alone does not give B — the symmetry argument is essential.",
      "Wire field data collection: set currentConfig = 0, sweep loopRadius from 0.3 m to 3.0 m in 0.1 m steps, record the displayed B at each step, and plot B vs. 1/r. Students should obtain a straight line through the origin with slope μ₀I/(2π). Verify by extracting μ₀ = 2π × slope / I and comparing to the accepted 4π × 10⁻⁷ T·m/A.",
      "Solenoid interior vs. exterior probe: set currentConfig = 2 and solenoidTurns = 100 turns/m. Place loopRadius inside the solenoid and record B = μ₀nI; then move it outside and observe B ≈ 0. Discuss the two-step argument: (1) far-field/symmetry boundary conditions for an ideal infinite solenoid force B_outside → 0; (2) a rectangular Amperian loop straddling the wall then gives B_inside − B_outside = μ₀nI, so B_inside = μ₀nI.",
      "Coaxial cable misconception challenge: set currentConfig = 1 and increase loopRadius past the outer conductor radius. Students who expect B to diminish gradually are surprised to see it drop to zero. Have them draw the Amperian loop, label I_enc, and write ∮B·dl = μ₀(0) explicitly.",
      "Right-hand rule 3D practice: with currentConfig = 0, increase current to 10 A and use the fieldDensity slider to display a dense vector field. Ask students to verify the rotational direction of B vectors using the right-hand rule with thumb along the current direction, then predict how doubling current changes the B vector magnitude and observe the simulation.",
    ],
    faq: [
      {
        question: "How is Ampère's Law different from the Biot-Savart Law?",
        answer:
          "Biot-Savart, dB = (μ₀/4π)(I dl × r̂)/r², gives B from any current element by direct integration — it always works but can require difficult integrals. Ampère's Law ∮B·dl = μ₀I_enc gives the same answer with almost no integration when the geometry is symmetric enough to pull B out of the integral. For a long wire or solenoid, Ampère's Law takes two lines; Biot-Savart takes a full integral calculation.",
      },
      {
        question: "What are the AP Physics C standards this simulation covers?",
        answer:
          "The simulation addresses 3.A.1 (properties of the magnetic field, including direction and magnitude from current configurations), 3.B.1 (the Biot-Savart Law and its relationship to Ampère's Law for symmetric geometries), and 3.C.1 (Ampère's Law applied to straight wires, solenoids, and toroids to calculate B). All three codes appear in the experiment's standards.ap[] array.",
      },
      {
        question: "Why does the magnetic field outside an ideal solenoid equal zero?",
        answer:
          "For an ideal infinite solenoid, B outside is zero by a symmetry argument: the field must be uniform and, for an infinite solenoid extending to infinity in both directions, it must also vanish at infinity — so B_outside = 0. An Amperian rectangle straddling the solenoid wall gives B_inside − B_outside = μ₀nI, which is consistent with B_inside = μ₀nI once we set B_outside = 0 from the symmetry argument. Real finite solenoids have a small but nonzero exterior field (magnetic field lines must close).",
      },
      {
        question: "What is μ₀ and what are its units?",
        answer:
          "μ₀ = 4π × 10⁻⁷ T·m/A is the permeability of free space. It appears in Ampère's Law as the proportionality constant linking field circulation to enclosed current. In SI it has units of T·m/A = kg·m/A²·s², which you can derive from the dimensional analysis of ∮B·dl = μ₀I_enc.",
      },
      {
        question: "Can Ampère's Law be applied to a toroid?",
        answer:
          "Yes. For a toroid of N total turns and mean radius r carrying current I, a circular Amperian loop of radius r inside the toroid gives B(2πr) = μ₀NI, so B = μ₀NI/(2πr). The field is confined inside the toroid and varies with radial position. Outside the toroid, any Amperian loop encloses equal forward and return currents, giving B = 0.",
      },
      {
        question: "How do I use the right-hand rule for a solenoid?",
        answer:
          "Curl the four fingers of your right hand in the direction that current flows around the solenoid turns (following the helical winding). Your extended thumb then points in the direction of B inside the solenoid. Alternatively, look at one end of the solenoid: if current flows counterclockwise when viewed from that end, that end is the north pole (B exits).",
      },
    ],
  },
};
