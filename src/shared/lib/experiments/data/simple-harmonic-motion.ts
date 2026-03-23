import type { Experiment } from "@/shared/types/experiment";

export const simpleHarmonicMotion: Experiment = {
  id: "simple-harmonic-motion",
  slug: "simple-harmonic-motion",
  title: "Simple Harmonic Motion",
  subtitle: "Springs, pendulums, and oscillation",
  description:
    "Explore oscillating systems by adjusting spring constant and mass. Watch energy transfer between kinetic and potential forms, and discover why period is independent of amplitude.",
  thumbnail: "/imgs/experiments/simple-harmonic-motion.png",

  standards: {
    ngss: ["HS-PS2-1", "HS-PS3-2"],
    gcse: ["P5.7"],
    ap: ["3.B.3", "5.B.2", "5.B.3"],
  },
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["oscillation", "spring", "pendulum", "period", "energy", "SHM", "AP Physics 1"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "springConstant",
      label: "Spring Constant (k)",
      unit: "N/m",
      min: 1,
      max: 100,
      default: 20,
      step: 1,
      tier: "free",
    },
    {
      id: "mass",
      label: "Mass (m)",
      unit: "kg",
      min: 0.1,
      max: 10,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "amplitude",
      label: "Amplitude (A)",
      unit: "m",
      min: 0.1,
      max: 2,
      default: 0.5,
      step: 0.05,
      tier: "free",
    },
    {
      id: "damping",
      label: "Damping Coefficient (b)",
      unit: "kg/s",
      min: 0,
      max: 5,
      default: 0,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "T = 2\\pi\\sqrt{\\dfrac{m}{k}}",
      description: "Period of oscillation",
    },
    {
      latex: "x(t) = A\\cos(\\omega t + \\phi)",
      description: "Position as a function of time",
    },
    {
      latex: "\\omega = \\sqrt{\\dfrac{k}{m}}",
      description: "Angular frequency",
    },
    {
      latex: "E_{total} = \\frac{1}{2}kA^2 = \\frac{1}{2}mv^2 + \\frac{1}{2}kx^2",
      description: "Total mechanical energy (conserved)",
    },
    {
      latex: "v_{max} = A\\omega = A\\sqrt{\\dfrac{k}{m}}",
      description: "Maximum velocity (at equilibrium)",
    },
  ],

  theory:
    "Simple Harmonic Motion (SHM) occurs when a restoring force is proportional to displacement: F = -kx. The period depends only on mass and spring constant, not on amplitude — a key insight that confuses many students. Energy constantly transforms between kinetic (maximum at equilibrium) and potential (maximum at extreme positions), with total mechanical energy conserved in the absence of damping.",

  instructions:
    "Adjust the spring constant k and mass m to observe how period changes. Notice that changing amplitude does NOT affect the period — try it. Watch the energy bar at the bottom show Ek and Ep cycling. Use the damping slider (Pro) to explore energy dissipation.",

  challenges: [
    {
      id: "shm-c1",
      question: "A spring-mass system has k = 50 N/m and m = 2 kg. What is the period?",
      hint: "Use T = 2π√(m/k). Period is independent of amplitude.",
      tier: "free",
    },
    {
      id: "shm-c2",
      question: "If you double the mass, how does the period change?",
      hint: "T ∝ √m — doubling mass multiplies period by √2 ≈ 1.41",
      tier: "free",
    },
    {
      id: "shm-c3",
      question: "At what position is kinetic energy maximum? Why?",
      hint: "At equilibrium (x=0), all potential energy converts to kinetic.",
      tier: "free",
    },
    {
      id: "shm-c4",
      question: "A system has k = 80 N/m, m = 0.5 kg, A = 0.3 m. Find Eₜₒₜₐₗ and vₘₐₓ.",
      hint: "E = ½kA², then vₘₐₓ = √(2E/m)",
      tier: "pro",
    },
    {
      id: "shm-c5",
      question: "How does adding damping affect energy and amplitude over time?",
      hint: "Enable the damping slider and observe the envelope decay.",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["newtons-laws", "roller-coaster", "wave-interference"],

  seoTitle: "Simple Harmonic Motion — Interactive 3D Spring Simulation | NeonPhysics",
  seoKeywords: [
    "simple harmonic motion",
    "SHM simulation",
    "spring mass system",
    "AP Physics 1 oscillation",
    "period frequency oscillation",
    "physics spring simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Simple Harmonic Motion",
  },
};
