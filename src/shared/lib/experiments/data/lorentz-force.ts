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
};
