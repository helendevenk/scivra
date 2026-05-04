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
      id: "charge",
      label: "Charge (Q)",
      unit: "μC",
      min: -5,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "gaussianRadius",
      label: "Gaussian Surface Radius",
      unit: "m",
      min: 0.5,
      max: 4,
      default: 2,
      step: 0.1,
      tier: "free",
    },
    {
      id: "chargeRadius",
      label: "Charge Radius",
      unit: "m",
      min: 0.2,
      max: 2,
      default: 0.8,
      step: 0.1,
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
    "Use the Charge Q, Gaussian Surface Radius r, and Charge Radius R sliders to test how enclosed charge and surface size affect electric flux. Start with the Point, Line, and Sphere presets to compare the three HTML modes, then change one slider at a time. Observe the 3D electric field vectors and flux readouts while rotating the view with mouse drag and zooming with scroll.",

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
  htmlControlAliases: {
    charge: "sl-Q",
    gaussianRadius: "sl-surfR",
    chargeRadius: "sl-chargeR",
  },
  presets: [
    {
      id: "point",
      label: "Point Charge",
      description:
        "Sets a compact +1 μC source with a larger surrounding Gaussian surface, making the inverse-square field and radius-independent total flux easiest to inspect.",
      paramValues: { charge: 1, gaussianRadius: 2, chargeRadius: 0.2 },
    },
    {
      id: "line",
      label: "Infinite Line Charge",
      description:
        "Sets a stronger line-charge mode with a moderate Gaussian radius, useful for comparing cylindrical symmetry with the point-charge case.",
      paramValues: { charge: 2, gaussianRadius: 1.5, chargeRadius: 0.3 },
    },
    {
      id: "sphere",
      label: "Charged Sphere",
      description:
        "Sets an extended charged sphere so students can move the Gaussian surface inside and outside the source radius and watch enclosed charge change.",
      paramValues: { charge: 3, gaussianRadius: 2.5, chargeRadius: 1.2 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Gauss's Law — one of Maxwell's four equations — states that the total electric flux through any closed surface equals the net charge enclosed divided by ε₀: ∮E·dA = Q_enc/ε₀. The law is always true, but it becomes a practical field-calculation tool only when the charge distribution has enough symmetry (spherical, cylindrical, or planar) to factor a constant E out of the surface integral. This simulation places point charges, infinite line charges, or uniformly charged spheres inside user-defined Gaussian surfaces rendered in 3D, computes the flux numerically at every surface element dA, and displays the running total alongside the analytical result Q_enc/ε₀. Drag the surface radius slider to watch flux stay constant as the surface grows — as long as no additional charge crosses the boundary — and observe field vectors stretch or compress while their total flux through the surface remains unchanged.",
    parameterExplanations: {
      charge:
        "Charge Q sets the source strength in microcoulombs, from negative to positive values. Positive charge sends electric field vectors outward and gives positive outward flux; negative charge reverses the field direction and the flux sign. In the Point and Sphere presets, this represents the total source charge used for Qenc. In the Line preset, the simulation uses the same control as an effective charge strength for the line model. Keep Gaussian Surface Radius and Charge Radius fixed while changing Q first: the flux readout should scale directly with charge, matching Φ = Qenc/ε₀ whenever the Gaussian surface encloses the source.",
      gaussianRadius:
        "Gaussian Surface Radius changes the size of the closed surface used to measure electric flux. For a centered point charge that remains enclosed, increasing radius spreads the field over a larger area, but the total flux stays constant because E decreases as area increases. In the Sphere preset, this slider becomes especially important: when the Gaussian radius is smaller than the charged sphere radius, only part of the total charge is enclosed; once it grows outside the source, the full charge contributes. Compare Point and Sphere before changing Q so students can separate surface size from enclosed charge.",
      chargeRadius:
        "Charge Radius sets the physical radius of the modeled source, not the Gaussian surface itself. In the Point preset it is made very small so the source behaves like a compact charge at the center. In the Sphere preset it defines the boundary of the charged object, making it possible to place the Gaussian surface inside or outside the charge distribution. That comparison shows why Gauss's Law depends on enclosed charge rather than just total available charge. Hold Q fixed, then move Charge Radius across the Gaussian Surface Radius to see when Qenc changes and when only the source geometry changes.",
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
          "Flux through a closed surface depends only on Q_enc, not surface size or shape. Doubling the sphere's radius quadruples A but reduces E to one-quarter (since E ∝ 1/r²); the product E·4πr² = Q/ε₀ remains constant. Verify this with the Gaussian Surface Radius slider in the Point preset while watching the flux readout stay fixed.",
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
      "Flux vs. Gaussian radius data collection: use the Point preset and keep Charge Q at +1 μC. Have students record total flux for Gaussian Surface Radius values of 0.5, 1, 2, 3, and 4 m. They should find the displayed flux remains constant, confirming Q_enc/ε₀ is independent of surface size. Directly addresses AP standard 2.B.1.",
      "Field extraction with symmetry: use the Sphere preset and vary Gaussian Surface Radius from just inside to just outside the Charge Radius boundary. Students observe the flux rising inside the sphere and flattening once the surface fully encloses the charge, then use Gauss's Law to derive E inside (E = kQr/R³) and outside (E = kQ/r²). Addresses standard 2.C.1.",
      "Misconception probe — does surface size matter?: before touching the simulation, ask students to predict whether doubling the Gaussian surface radius will double, halve, or leave unchanged the total flux. Run the Point preset, move only Gaussian Surface Radius, and derive why E·4πr² = Q/ε₀ is scale-invariant. Addresses standard 2.A.1.",
      "Sign of flux and charge sign: use the Charge Q slider to compare +5 μC and −5 μC while keeping the Point preset geometry fixed. Students observe that flux reverses sign and arrows point inward for negative charge, connecting the outward-normal sign convention to field lines originating on positive charges and terminating on negative charges.",
      "Line charge field strength: use the Line preset and record field magnitude at Gaussian Surface Radius values of 0.5, 1.0, 1.5, and 2.0 m. Students compare the result with E = λ/(2πε₀r) and check whether E · r is approximately constant, verifying the cylindrical Gauss's Law result.",
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
          "Standards 2.A.1 (electric field and force), 2.B.1 (Gauss's Law and flux), and 2.C.1 (electric field from symmetric charge distributions) are all addressed in this simulation. Standard 2.B.1 in particular is the core Gauss's Law statement ∮E·dA = Q_enc/ε₀ that the flux panel verifies numerically as students compare the Point, Line, and Sphere presets.",
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
