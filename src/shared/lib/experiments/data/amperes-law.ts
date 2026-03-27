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
};
