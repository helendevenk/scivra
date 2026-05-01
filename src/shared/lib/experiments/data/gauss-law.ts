import type { Experiment } from "@/shared/types/experiment";

export const gaussLaw: Experiment = {
  id: "gauss-law",
  slug: "gauss-law",
  title: "Gauss's Law",
  subtitle:
    "Electric flux through Gaussian surfaces and enclosed charge relationships",
  description:
    "Explore Gauss's Law by placing charge distributions in 3D space and constructing Gaussian surfaces around them. Visualize the electric field vectors, calculate the total electric flux through each surface, and verify that Φ = Q_enc/ε₀. Experiment with point charges, infinite lines, and charged planes to see how symmetry simplifies flux integrals.",
  thumbnail: "/imgs/experiments/gauss-law.png",

  standards: {
    ngss: ["HS-PS2-4"],
    gcse: [],
    ap: ["2.A.1", "2.B.1", "2.C.1"],
  },
  primaryStandard: "ap-physics-c",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "Gauss's Law",
    "electric flux",
    "Gaussian surface",
    "enclosed charge",
    "electric field",
    "vector field",
    "AP Physics C",
    "E&M",
  ],
  difficulty: "advanced",

  parameters: [
    {
      id: "chargeDistribution",
      label: "Charge Distribution (0=point, 1=line, 2=plane, 3=sphere)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "chargeAmount",
      label: "Charge (Q)",
      unit: "μC",
      min: -10,
      max: 10,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "surfaceRadius",
      label: "Gaussian Surface Radius",
      unit: "m",
      min: 0.5,
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
      id: "showFluxArrows",
      label: "Show Flux Arrows (0=off, 1=on)",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{\\text{enc}}}{\\varepsilon_0}",
      description:
        "Gauss's Law: the total electric flux through a closed surface equals the enclosed charge divided by the permittivity of free space",
    },
    {
      latex: "\\vec{E} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{Q}{r^2} \\hat{r}",
      description:
        "Coulomb's field for a point charge: inversely proportional to r², radially outward for positive Q",
    },
    {
      latex: "\\Phi_E = E \\cdot A = E \\cdot 4\\pi r^2",
      description:
        "For a spherical Gaussian surface with uniform radial field, flux equals E times the surface area",
    },
  ],

  theory:
    "Gauss's Law is one of Maxwell's four equations and relates the electric flux through a closed surface to the charge enclosed within it. The law states Φ_E = Q_enc/ε₀, where ε₀ = 8.854×10⁻¹² C²/(N·m²). For highly symmetric charge distributions (spherical, cylindrical, planar), Gauss's Law provides an elegant shortcut to calculate the electric field without integration. For a point charge Q, the field at distance r is E = kQ/r² (radial). A spherical Gaussian surface of radius r centered on the charge captures flux Φ = E·4πr² = Q/ε₀, independent of r — demonstrating that flux depends only on enclosed charge, not surface size. For an infinite line charge with linear density λ, a cylindrical Gaussian surface gives E = λ/(2πε₀r). For an infinite plane with surface density σ, E = σ/(2ε₀), uniform and independent of distance.",

  instructions:
    "Select a charge distribution type and set the charge magnitude. Adjust the Gaussian surface radius to enclose or exclude charges. Observe the 3D electric field vectors (length proportional to field strength, color-coded by magnitude). The flux panel shows the calculated Φ and verifies Gauss's Law. Rotate the 3D view with mouse drag, zoom with scroll.",

  challenges: [
    {
      id: "gl-c1",
      question:
        "A +5 μC point charge sits at the center of a spherical Gaussian surface of radius 2 m. What is the total electric flux?",
      hint: "Φ = Q/ε₀ = 5×10⁻⁶ / 8.854×10⁻¹² ≈ 5.65×10⁵ N·m²/C",
      tier: "free",
    },
    {
      id: "gl-c2",
      question:
        "If you double the radius of the Gaussian surface (keeping the charge inside), how does the flux change?",
      hint: "The flux stays the same — Gauss's Law says Φ depends only on Q_enc, not the surface size",
      tier: "free",
    },
    {
      id: "gl-c3",
      question:
        "A charge of -3 μC is outside a Gaussian surface. What is the net flux through the surface due to this charge?",
      hint: "Zero — charges outside the surface contribute zero net flux (field lines enter and exit)",
      tier: "pro",
    },
  ],

  wave: 12,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["coulombs-law", "electric-field-of-dreams"],
  htmlPath: "/experiments/ap-physics-c/gauss-law.html",

  seoTitle: "Gauss's Law 3D Simulation | Scivra AP Physics C",
  seoKeywords: [
    "Gauss's Law simulation",
    "electric flux visualization",
    "Gaussian surface 3D",
    "AP Physics C E&M",
    "vector field interactive",
    "enclosed charge calculator",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Advanced Placement",
    teaches: "Gauss's Law and Electric Flux",
  },
  contentSections: {
    whatIsIt:
      "Gauss's Law — one of Maxwell's four equations — states that the total electric flux through any closed surface equals the net charge enclosed divided by ε₀: ∮E·dA = Q_enc/ε₀. The law is always true, but it becomes a practical field-calculation tool only when the charge distribution has enough symmetry (spherical, cylindrical, or planar) to factor a constant E out of the surface integral. This simulation places point charges, infinite line charges, or uniformly charged spheres inside user-defined Gaussian surfaces rendered in 3D, computes the flux numerically at every surface element dA, and displays the running total alongside the analytical result Q_enc/ε₀. Drag the surface radius slider to watch flux stay constant as the surface grows — as long as no additional charge crosses the boundary — and observe field vectors stretch or compress while their total flux through the surface remains unchanged.",
    parameterExplanations: {
      chargeDistribution:
        "Selects the source geometry: 0 = point charge (spherical symmetry, Gaussian sphere), 1 = infinite line charge (cylindrical symmetry, Gaussian cylinder), 2 = infinite plane (planar symmetry, Gaussian pillbox), 3 = uniformly charged sphere (field inside differs from outside). Each geometry calls for a different Gaussian surface shape to exploit symmetry.",
      chargeAmount:
        "Controls the charge strength in microcoulombs (μC). For point-charge and uniform-sphere modes this is the total enclosed charge Q; for line-charge mode it represents an effective linear charge density λ (charge per unit length) used by the simulation; for plane mode it represents an effective surface charge density σ. Positive values produce outward flux; negative values produce inward flux.",
      surfaceRadius:
        "The radius of the Gaussian surface in meters. For a point charge, changing this radius does not change the enclosed charge or total flux — only the field magnitude at the surface (E ∝ 1/r²) and the surface area (A ∝ r²) change, with the product E·A staying constant. For the charged-sphere distribution (option 3), moving the radius inside versus outside the sphere changes Q_enc and hence the flux.",
      fieldDensity:
        "Controls the number of electric field arrow samples rendered on the Gaussian surface. Higher values (up to 20) give a denser arrow grid, making flux direction and magnitude gradients easier to read qualitatively. Lower values reduce visual clutter when focusing on symmetry arguments.",
      showFluxArrows:
        "Toggles the flux-density arrow overlay on the Gaussian surface: 1 renders arrows colored by E·dA magnitude; 0 shows only the field vectors in the surrounding space. Turn flux arrows on during Gauss's Law verification, off when examining the field structure far from the surface.",
    },
    misconceptions: [
      {
        wrong:
          "Gauss's Law gives you the electric field directly for any charge distribution — just solve ∮E·dA = Q/ε₀ for E.",
        correct:
          "The integral gives total flux, not field. To extract E from the integral you need E to be constant and parallel to dA over the entire surface, which requires a symmetric charge distribution. For asymmetric distributions, ∮E·dA = Q/ε₀ is still true but E varies over the surface — you cannot pull it out of the integral.",
      },
      {
        wrong:
          "A larger Gaussian surface encloses more field lines and therefore has more flux.",
        correct:
          "Flux through a closed surface depends only on Q_enc, not surface size or shape. Doubling the sphere's radius quadruples A but reduces E to one-quarter (since E ∝ 1/r²); the product E·4πr² = Q/ε₀ remains constant. Verify this by dragging surfaceRadius in the simulation while watching the flux readout stay fixed.",
      },
      {
        wrong:
          "Charges outside the Gaussian surface contribute to the flux through it.",
        correct:
          "An external charge produces field lines that enter and exit the closed surface in equal numbers, giving zero net flux from that charge. Only charges inside the surface — Q_enc — contribute net flux. Conceptually, this means moving a charge from inside to outside any closed surface drops its flux contribution to zero, regardless of how the field lines weave through space.",
      },
      {
        wrong:
          "Inside a conductor, the electric field is zero because there are no charges there.",
        correct:
          "The field is zero inside a conductor in electrostatic equilibrium because free charges redistribute to the surface until the internal field is cancelled — this is a separate electrostatic-equilibrium fact. Gauss's Law applied to a surface just inside the conductor is consistent with it: zero enclosed charge gives zero net flux. However, zero flux from a Gaussian surface alone does not prove E = 0 pointwise without the symmetry and equilibrium argument; the two must work together.",
      },
      {
        wrong:
          "Gauss's Law and Coulomb's Law are independent laws — you need both separately.",
        correct:
          "Gauss's Law in integral form is equivalent to Coulomb's Law for electrostatics. Applying Gauss's Law with a spherical surface around a point charge Q immediately reproduces E = kQ/r² = Q/(4πε₀r²). The two formulations are mathematically identical for static charge distributions; Gauss's Law is simply more general (it also applies to moving charges via Maxwell's equations).",
      },
    ],
    teacherUseCases: [
      "Flux vs. surface radius data collection: set chargeDistribution = 0 (point charge) and chargeAmount = 5 μC. Have students record the total flux displayed for surfaceRadius = 0.5, 1, 2, 3, and 4 m. They should find Φ ≈ 5.65 × 10⁵ N·m²/C at every radius, confirming Q_enc/ε₀ is independent of surface size. Directly addresses AP standard 2.B.1.",
      "Field extraction with symmetry: switch to chargeDistribution = 3 (uniform sphere) and vary surfaceRadius from just inside to just outside the sphere's boundary. Students observe the flux rising smoothly inside the sphere and flattening once the surface fully encloses the charge — the slope changes at the boundary — and use Gauss's Law to derive the expression for E inside (E = kQr/R³) and outside (E = kQ/r²) the sphere. Addresses standard 2.C.1.",
      "Misconception probe — does surface size matter?: before touching the simulation, ask students to predict whether doubling the Gaussian surface radius will double, halve, or leave unchanged the total flux. Most predict it doubles. Run the simulation with showFluxArrows = 1 to reveal the constant flux, then derive why E·4πr² = Q/ε₀ is scale-invariant. Addresses standard 2.A.1.",
      "Sign of flux and charge sign: set chargeAmount to +5 μC, record the displayed flux sign and direction of arrows. Then set chargeAmount to −5 μC and repeat. Students observe that flux reverses sign and arrows point inward, connecting the mathematical sign convention (outward normal positive) to the physical picture of field lines originating on positive and terminating on negative charges.",
      "Line charge field strength: switch to chargeDistribution = 1 and record the field magnitude at the surface for surfaceRadius = 0.5, 1.0, 1.5, and 2.0 m. Students compute E = λ/(2πε₀r) analytically using the effective linear charge density displayed by the simulation in line-charge mode, and check whether E · r is approximately constant, verifying the cylindrical Gauss's Law result.",
    ],
    faq: [
      {
        question: "Why do we use spherical Gaussian surfaces for point charges but cylindrical ones for line charges?",
        answer:
          "The goal is to choose a surface where E is constant in magnitude and everywhere parallel (or perpendicular) to dA, so E factors out of the integral. A point charge has spherical symmetry — E is radial and constant on a sphere. A line charge has cylindrical symmetry — E is radial from the axis and constant on a coaxial cylinder. Using the wrong surface shape still gives a valid flux equation but E cannot be extracted algebraically.",
      },
      {
        question: "Which AP Physics C E&M standards directly map to Gauss's Law?",
        answer:
          "Standards 2.A.1 (electric field and force), 2.B.1 (Gauss's Law and flux), and 2.C.1 (electric field from symmetric charge distributions) are all addressed in this simulation. Standard 2.B.1 in particular is the core Gauss's Law statement ∮E·dA = Q_enc/ε₀ that the flux panel verifies numerically for each distribution type.",
      },
      {
        question: "What is ε₀ and where does it come from?",
        answer:
          "ε₀ = 8.854 × 10⁻¹² C²/(N·m²) is the permittivity of free space, a fundamental constant of electromagnetism that sets the scale of electric forces. It appears in Gauss's Law as the proportionality between charge and flux, and in Coulomb's constant k = 1/(4πε₀) = 8.99 × 10⁹ N·m²/C². On the AP Physics C exam, you will be given both k and ε₀.",
      },
      {
        question: "If I put the Gaussian surface inside a uniformly charged solid sphere, what happens to the field?",
        answer:
          "Only the charge within radius r contributes: Q_enc = Q(r/R)³ for a uniform volume distribution. Gauss's Law then gives E = kQr/R³, which is linear in r — the field grows from zero at the center to kQ/R² at the surface. Outside the sphere (r > R), the full charge is enclosed and E = kQ/r² as if all the charge were at the center.",
      },
      {
        question: "Can Gauss's Law be used for non-symmetric charge distributions?",
        answer:
          "Yes — ∮E·dA = Q_enc/ε₀ is always mathematically true for any closed surface. However, for asymmetric distributions, E varies in magnitude and direction across the surface, so the integral must be computed numerically or by other analytical methods. Gauss's Law then serves as a consistency check rather than a shortcut to find E.",
      },
      {
        question: "What is the electric field inside a hollow conducting shell?",
        answer:
          "Zero. Draw a Gaussian surface just inside the shell wall. In electrostatic equilibrium, all free charges on a conductor reside on the outer surface, so Q_enc = 0 for the interior Gaussian surface. Gauss's Law then gives Φ = 0, and by symmetry this requires E = 0 everywhere inside the cavity. This is the principle behind Faraday cages.",
      },
    ],
  },
};
