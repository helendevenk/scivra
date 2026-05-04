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
      id: "current",
      label: "Current I",
      unit: "A",
      min: 1,
      max: 100,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "loopRadius",
      label: "Loop Radius",
      unit: "m",
      min: 0.1,
      max: 2,
      default: 0.5,
      step: 0.05,
      tier: "free",
    },
    {
      id: "turns",
      label: "Turns",
      unit: "turns",
      min: 100,
      max: 2000,
      default: 500,
      step: 50,
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
    "Use the Current I slider to change the current, the Loop Radius slider to resize the Amperian loop, and the Turns slider to change the winding count for solenoid and toroid cases. Try the Infinite Straight Wire, Solenoid (n=1000), and Toroid presets to compare how geometry changes the enclosed current, field direction, and circulation ∮B·dl. Rotate the 3D view with mouse drag.",

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
  htmlControlAliases: { current: "sl-current", loopRadius: "sl-loopR", turns: "sl-turns" },
  presets: [
    {
      id: "wire",
      label: "Infinite Straight Wire",
      description:
        "A long straight conductor creates circular magnetic field lines around the current. Use it to test B = μ₀I/(2πr) and the right-hand rule.",
    },
    {
      id: "solenoid",
      label: "Solenoid (n=1000)",
      description:
        "A coil with many turns produces an approximately uniform interior magnetic field. Use it to compare current, turn count, and field strength.",
    },
    {
      id: "toroid",
      label: "Toroid",
      description:
        "A closed circular coil confines most of its magnetic field inside the core. Use it to connect Ampère's Law with enclosed turns and radius.",
    },
  ],
  contentSections: {
    whatIsIt:
      "In magnetostatics, Ampère's Law states that the line integral of B around any closed Amperian loop equals μ₀ times the current threading that loop: ∮B·dl = μ₀I_enc; the full Maxwell-Ampère version adds a displacement-current term μ₀ε₀ dΦ_E/dt for time-varying fields. The power of the magnetostatic form lies in symmetry: for a long straight wire the integrand is constant around a circle of radius r, giving B(2πr) = μ₀I and therefore B = μ₀I/(2πr). Inside an ideal solenoid with n turns per meter, a rectangular Amperian loop yields B = μ₀nI (uniform, axially directed) while outside B ≈ 0. The simulation lets you switch between a bare wire, a coaxial cable, and a solenoid, position the Amperian loop with loopRadius, and watch ∮B·dl update numerically as the enclosed current changes.",
    parameterExplanations: {
      current:
        "Current I controls how much charge flow threads the magnetic geometry. In the Infinite Straight Wire preset, increasing Current raises the magnetic field everywhere in direct proportion, so doubling Current doubles B at the same Loop Radius. In the Solenoid (n=1000) preset, Current also scales the interior field linearly through B = μ₀nI. In the Toroid preset, Current multiplies the enclosed turn contribution, so the field inside the toroidal path grows while the outside remains much smaller in the ideal model. Keep Loop Radius and Turns fixed, then sweep Current to isolate this linear dependence.",
      loopRadius:
        "Loop Radius sets the size of the Amperian loop used to sample circulation. For the Infinite Straight Wire preset, a larger Loop Radius means the same enclosed current is spread around a longer circular path, so B decreases as 1/r even though ∮B·dl remains tied to μ₀I_enc. In toroidal reasoning, radius also matters because the field around the core follows B = μ₀NI/(2πr) inside the winding region. Use this slider after choosing a preset to test whether changing the loop geometry changes enclosed current, path length, or both.",
      turns:
        "Turns controls the number of windings used by coil-based cases. It has little conceptual role for the Infinite Straight Wire preset, where the conductor is modeled as one long current path. In the Solenoid (n=1000) preset, more Turns means more current loops per length, increasing the interior field predicted by B = μ₀nI. In the Toroid preset, Turns represents the total winding count N enclosed by an Amperian loop inside the core, giving B = μ₀NI/(2πr). Keep Current fixed while changing Turns to see how repeated windings amplify magnetic circulation.",
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
          "For an ideal infinite solenoid, B outside is zero by a symmetry argument: the field must be uniform and vanish at infinity for an infinite uniform solenoid. An Amperian rectangle straddling the wall with one long side inside and one outside gives B_inside − B_outside = μ₀nI, consistent with B_inside = μ₀nI when B_outside = 0. Real finite solenoids have a small but nonzero exterior field.",
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
      "Symmetry argument gateway: before running the simulation, ask students to write the general Ampère's Law ∮B·dl = μ₀I_enc and explain what additional physical argument lets them replace the integral with B(2πr). Use the Infinite Straight Wire preset first so Current and Loop Radius map directly onto B = μ₀I/(2πr).",
      "Wire field data collection: choose the Infinite Straight Wire preset, hold Current constant, sweep Loop Radius from 0.1 m to 2.0 m, record the displayed B at each step, and plot B vs. 1/r. Students should obtain a straight line through the origin with slope μ₀I/(2π). Verify by extracting μ₀ = 2π × slope / I and comparing to the accepted 4π × 10⁻⁷ T·m/A.",
      "Solenoid scaling lab: choose the Solenoid (n=1000) preset, hold Loop Radius fixed, and compare several Current values. Then hold Current fixed and sweep Turns from 100 to 2000. Students should identify the linear relationships in B = μ₀nI and explain why many windings make the interior field stronger.",
      "Toroid enclosed-current challenge: choose the Toroid preset and ask students to predict how increasing Turns changes ∮B·dl. Then vary Loop Radius and discuss why the ideal toroid field is strongest inside the winding region and much smaller outside, even though each wire still carries the same Current.",
      "Right-hand rule 3D practice: with the Infinite Straight Wire preset, increase Current to 10 A and ask students to verify the rotational direction of B vectors using the right-hand rule with thumb along the current direction. Then switch to Solenoid (n=1000) and Toroid presets so students compare circular field lines, axial interior fields, and confined toroidal fields.",
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
