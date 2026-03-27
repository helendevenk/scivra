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
};
