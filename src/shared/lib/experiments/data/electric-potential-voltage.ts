import type { Experiment } from "@/shared/types/experiment";

export const electricPotentialVoltage: Experiment = {
  id: "electric-potential-voltage",
  slug: "electric-potential-voltage-equipotential-lines",
  title: "Electric Potential & Voltage",
  subtitle: "Map equipotential surfaces and understand work done by electric fields",
  description:
    "Place one to three point charges in 2D space and visualize the resulting electric potential field as a color map with overlaid equipotential lines. Measure potential at any point and calculate the work done moving a test charge between two equipotential surfaces.",
  thumbnail: "/imgs/experiments/electric-potential-voltage.png",

  standards: {
    ngss: ["HS-PS2-4", "HS-PS3-2"],
    gcse: ["P6.3", "P6.4"],
    ap: ["CHA-2.C", "CHA-2.D", "CHA-3.A"],
  },
  primaryStandard: "ap-physics-c",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "electric potential",
    "voltage",
    "equipotential lines",
    "point charge",
    "electric field",
    "potential energy",
    "Coulomb",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "charge_value",
      label: "Source Charge",
      unit: "μC",
      min: -10,
      max: 10,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "test_charge_sign",
      label: "Test Charge Sign (0=Positive, 1=Negative)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "charge_count",
      label: "Number of Charges",
      unit: "",
      min: 1,
      max: 3,
      default: 1,
      step: 1,
      tier: "pro",
    },
    {
      id: "charge2_x",
      label: "Charge 2 X Position",
      unit: "m",
      min: -3,
      max: 3,
      default: 2,
      step: 0.5,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "V = \\frac{kq}{r} \\quad (k = 8.99 \\times 10^9\\,\\text{N·m}^2\\text{/C}^2)",
      description: "Electric potential due to a point charge",
    },
    {
      latex: "E = -\\frac{\\Delta V}{\\Delta x}",
      description: "Electric field from potential gradient",
    },
    {
      latex: "U = qV",
      description: "Electric potential energy",
    },
    {
      latex: "W = q(V_1 - V_2)",
      description: "Work done by the electric field",
    },
  ],

  theory:
    "Electric potential V at a point is the work done per unit positive charge to bring a test charge from infinity to that point. For a point charge, V = kq/r, and the field points in the direction of decreasing potential: E = −ΔV/Δx. Equipotential lines connect points of equal potential; they are always perpendicular to electric field lines. No work is done moving a charge along an equipotential surface.",
  instructions:
    "Adjust the source charge value and sign with the sliders to reshape the potential map. Click anywhere on the canvas to read the local potential. Unlock Pro mode to add a second or third charge and observe how their fields superpose.",

  challenges: [
    {
      id: "epv-c1",
      question: "What is the electric potential 1 m from a +2 μC point charge?",
      hint: "Use V = kq/r with k = 8.99 × 10⁹ N·m²/C²",
      tier: "free",
    },
    {
      id: "epv-c2",
      question: "What is the geometric relationship between equipotential lines and electric field lines?",
      hint: "Think about the direction of E = −∇V",
      tier: "free",
    },
    {
      id: "epv-c3",
      question: "How much work is needed to move a +1 μC charge from V = 100 V to V = 300 V?",
      hint: "Use W = q(V₁ − V₂) and be careful about the sign of work",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["electric-field-lines", "dc-circuits-basic", "capacitors-rc-circuits"],

  seoTitle: "Electric Potential & Voltage — Equipotential Lines Simulation | Scivra",
  seoKeywords: [
    "electric potential",
    "voltage",
    "equipotential lines",
    "point charge",
    "electric field",
    "potential energy",
    "AP Physics electricity",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Electric Potential, Voltage, and Equipotential Surfaces",
  },
  contentSections: {
    whatIsIt:
      "Electric potential V at a point in space is the work per unit positive charge required to bring a test charge quasi-statically from infinity to that point: V = kq/r for a single point charge (in joules per coulomb, or volts). Unlike the electric field — which is a vector quantity requiring geometric addition — potential is a scalar, so contributions from multiple charges sum algebraically: V_total = k∑(qᵢ/rᵢ). Equipotential lines connect points of equal V; they are always perpendicular to electric field lines because no work is done moving a charge along them. This simulation maps the full potential landscape as a color gradient, overlays equipotential contour lines, and lets you place one to three point charges to observe how their scalar fields superpose and how the resulting E field — obtained from E = −∇V — relates geometrically to the contours you see.",
    parameterExplanations: {
      charge_value:
        "The magnitude and sign of the primary source charge in microcoulombs (μC). Positive values produce a hill-shaped potential centered on the charge (high V nearby, decreasing outward); negative values create a potential well (low V nearby). The color map and contour spacing rescale automatically to the range set by this parameter.",
      test_charge_sign:
        "Sets the sign of the test charge used to compute work and potential energy overlays: 0 = positive test charge, 1 = negative test charge. The potential V at a point is independent of the test charge sign, but the potential energy U = qV and the direction of spontaneous motion (from high to low potential energy) depend on it. Toggle this to illustrate that positive charges accelerate toward decreasing V while negative charges accelerate toward increasing V.",
      charge_count:
        "Number of source charges rendered simultaneously (1 to 3). Adding a second or third charge demonstrates superposition: V_total is the algebraic sum of individual potentials. With charge_count = 2, the potential saddle point between like charges and the equipotential distortion near opposite charges become visible.",
      charge2_x:
        "Horizontal position of the second source charge in meters, measured from the center of the canvas. Sliding this parameter changes the separation between charges and reshapes the equipotential pattern — moving like charges apart spreads the saddle point; moving opposite charges closer pinches the equipotential lines between them. Active only when charge_count ≥ 2.",
    },
    misconceptions: [
      {
        wrong:
          "Voltage and electric field are the same thing — a high-voltage region has a strong electric field.",
        correct:
          "V (volts, J/C) is potential energy per unit charge at a point; E (N/C or V/m) is force per unit charge. The two are related by E = −dV/dr (or more generally E = −∇V). A region can have high potential but weak field — for example, inside a large hollow conductor (or a conducting sphere in electrostatic equilibrium) where V is large but E = 0.",
      },
      {
        wrong:
          "Equipotential lines show where the electric field is strongest — they bunch together near high field.",
        correct:
          "Closely spaced equipotentials indicate a large potential gradient, which means a large field magnitude |E| = |dV/dr|. But the equipotential lines themselves are perpendicular to E, not parallel. The field points from high-V to low-V regions, crossing each contour at right angles.",
      },
      {
        wrong:
          "Moving a charge along an equipotential line requires work because you are moving against the electric field.",
        correct:
          "By definition, all points on an equipotential surface have the same V, so ΔV = 0. The electric field E is perpendicular to the equipotential by construction, so it exerts no tangential force on a charge moving along the surface. Therefore W = qΔV = 0: no work is done by the field (or against it) for any path that stays on a single equipotential.",
      },
      {
        wrong:
          "Electric potential is always positive.",
        correct:
          "V = kq/r is negative for a negative source charge q, and can be negative at any point where the negative contributions outweigh positive ones. The simulation's color map uses cool colors for negative V and warm colors for positive V; the zero-potential equipotential is the transition between them and is visible as a distinct contour.",
      },
      {
        wrong:
          "The electric field points from low potential to high potential, toward positive charges.",
        correct:
          "The field points from high potential to low potential: E = −∇V. Near a positive charge, V is highest close to the charge and decreases outward, so E points outward (away from the charge). Near a negative charge, V is most negative at the source, so E points inward toward the charge.",
      },
    ],
    teacherUseCases: [
      "Potential vs. distance data collection: set charge_count = 1, charge_value = 5 μC. Have students click the canvas at radii of 0.5, 1.0, 1.5, 2.0, and 2.5 m from the charge to read V at each point. They compute kq/r analytically and compare. Plotting V vs. 1/r should yield a straight line, confirming the 1/r dependence. Addresses AP standard CHA-2.C.",
      "Superposition demonstration: set charge_count = 2, charge_value = +5 μC, and slide charge2_x from −2 m to +2 m. Have students identify the stationary point where E = 0 between the two like charges (V reaches a local minimum along the line between them, but never equals zero for two positive charges) and trace how it shifts with separation. Connecting V_total = k(q₁/r₁ + q₂/r₂) to the visual makes superposition concrete. Addresses standard CHA-2.D.",
      "Perpendicularity of E and equipotentials: after setting charge_count = 1, have students draw freehand arrows on a printed screenshot of the equipotential map representing their guess for the E field direction at five points. Then overlay the actual E vectors from the simulation and measure the angle between E and the nearest equipotential. Students discover the 90° relationship and connect it to E = −∇V. Addresses standard CHA-3.A.",
      "Misconception probe — does voltage equal field strength?: set charge_value to +10 μC and identify a point very close to the charge (high V and high E) and a point on a large-radius equipotential (lower V but compare E values). Ask students whether the higher-V region always has higher E. Use the simulation's V and E readouts to show that inside a 3D region where V is uniform — for example the interior of a conductor in electrostatic equilibrium — E = 0; on a 2D equipotential surface around an isolated charge, V is constant along the surface but E is nonzero and perpendicular to it.",
      "Work calculation from ΔV: set charge_count = 1 and charge_value = 5 μC. Ask students to compute the work for a +1 nC test charge moved from V_i (at r = 2 m) to V_f (at r = 0.5 m). Use the unified convention: ΔU = qΔV = q(V_f − V_i); work done by the field W_field = −ΔU = q(V_i − V_f); work done by an external agent quasi-statically W_ext = +ΔU = q(V_f − V_i). Students confirm that moving a positive charge toward higher V requires positive external work. Addresses standard CHA-2.D.",
    ],
    faq: [
      {
        question: "What is the difference between electric potential and electric potential energy?",
        answer:
          "Electric potential V (volts = J/C) is a property of the field at a point in space, independent of any test charge. Electric potential energy U = qV is the energy stored when a charge q is placed at that point. Moving a +1 μC charge to a point where V = 100 V stores U = 10⁻⁴ J of energy; a −1 μC charge at the same point stores −10⁻⁴ J.",
      },
      {
        question: "Which AP Physics C E&M standards does this simulation address?",
        answer:
          "Standards CHA-2.C (electric potential from point charges, V = kq/r), CHA-2.D (potential energy and work in electric fields, W = qΔV), and CHA-3.A (relationship between E and V, including equipotential lines perpendicular to field lines) are all directly exercised by this experiment's parameters and measurements.",
      },
      {
        question: "Why are equipotential lines always perpendicular to electric field lines?",
        answer:
          "The electric field is E = −∇V. The gradient of V points in the direction of maximum V increase — perpendicular to the surfaces of constant V (equipotentials). Since E is the negative gradient, it points perpendicular to equipotentials in the direction of decreasing V. A tangential component of E along an equipotential would imply ΔV ≠ 0 along that surface, which contradicts the definition.",
      },
      {
        question: "How do I calculate the work done moving a charge between two equipotentials in this simulation?",
        answer:
          "Click two points on the canvas to read V_i and V_f. Use the convention: ΔU = q(V_f − V_i); work done by the field W_field = −ΔU = q(V_i − V_f); work done by an external agent quasi-statically W_ext = +ΔU = q(V_f − V_i). Moving a positive charge from low-V to high-V means V_f > V_i, so ΔU > 0: the field does negative work and the external agent does positive work. Set test_charge_sign to match the sign of q.",
      },
      {
        question: "What happens to the equipotential pattern when two opposite charges are placed close together?",
        answer:
          "Set charge_count = 2 and charge2_x near 0. The equipotential lines cluster tightly between the charges (strong field, steep V gradient) and bulge outward near each charge. Far from the pair, the pattern approaches that of a dipole — equipotentials elongated perpendicular to the charge axis. The zero-volt equipotential forms a plane midway between equal and opposite charges.",
      },
      {
        question: "Is electric potential a vector or scalar, and why does that matter for superposition?",
        answer:
          "Electric potential is a scalar — it has magnitude and sign but no direction. This means V_total = k∑(qᵢ/rᵢ) involves only algebraic addition, with no need to resolve vector components. By contrast, calculating the total electric field requires adding vectors, which is more involved. Superposition of potentials is almost always simpler than superposition of fields, and this simulation makes both visible for comparison.",
      },
    ],
  },
};
