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
  primaryStandard: "ap-physics-1",
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

  hook: {
    question: "If you double the amplitude of a pendulum, does it take longer to swing?",
    context: "Most people guess yes, but the answer is no — period is completely independent of amplitude in simple harmonic motion.",
    actionPrompt: "Test it yourself — drag the amplitude slider and watch the period stay constant",
  },

  learningCards: [
    {
      id: "shm-lc1",
      title: "The Restoring Force",
      content: "In SHM, the restoring force is always proportional to displacement and directed toward equilibrium: F = -kx. This linear relationship is what makes the motion sinusoidal. Any system with this property — springs, pendulums at small angles, molecules in a lattice — oscillates harmonically.",
      formula: { latex: "F = -kx", description: "Hooke's Law restoring force" },
      relatedParameterId: "springConstant",
    },
    {
      id: "shm-lc2",
      title: "Energy Exchange",
      content: "Energy continuously transforms between kinetic and potential forms. At maximum displacement, all energy is potential (½kA²). At equilibrium, all energy is kinetic (½mv²max). Total mechanical energy remains constant when there is no damping.",
      formula: { latex: "E_{total} = \\frac{1}{2}kA^2 = \\frac{1}{2}mv_{max}^2", description: "Conservation of mechanical energy" },
      relatedParameterId: "amplitude",
    },
    {
      id: "shm-lc3",
      title: "Period Independence from Amplitude",
      content: "The period T = 2π√(m/k) depends only on mass and spring constant, not on how far you pull the spring. This counterintuitive result means a clock pendulum keeps the same time whether it swings wide or narrow — the principle behind mechanical clocks for centuries.",
      formula: { latex: "T = 2\\pi\\sqrt{\\dfrac{m}{k}}", description: "Period depends only on m and k" },
      relatedParameterId: "mass",
    },
    {
      id: "shm-lc4",
      title: "Damping and Energy Loss",
      content: "Real oscillators lose energy to friction and air resistance. The damping force opposes velocity (F_d = -bv), causing amplitude to decay exponentially while the frequency shifts slightly lower. Critical damping returns the system to equilibrium fastest without oscillating.",
      formula: { latex: "A(t) = A_0 e^{-bt/2m}", description: "Exponential amplitude decay with damping" },
      relatedParameterId: "damping",
    },
  ],

  easterEggs: [
    {
      parameterId: "amplitude",
      condition: "max",
      effect: "spring-stretches-to-breaking-point-visual",
      message: "This spring is about to fly apart!",
    },
    {
      parameterId: "springConstant",
      condition: "max",
      effect: "spring-glows-rigid-steel-visual",
      message: "That's stiffer than steel!",
    },
  ],

  challenges: [
    {
      id: "shm-c1",
      question: "A spring-mass system has k = 50 N/m and m = 2 kg. What is the period?",
      options: ["T ≈ 0.63 s", "T ≈ 1.26 s", "T ≈ 2.00 s", "T ≈ 3.14 s"],
      correctAnswer: "T ≈ 1.26 s",
      hint: "Use T = 2π√(m/k). Period is independent of amplitude.",
      relatedParameterId: "mass",
      tier: "free",
    },
    {
      id: "shm-c2",
      question: "If you double the mass, how does the period change?",
      options: ["Period doubles", "Period increases by √2 ≈ 1.41×", "Period stays the same", "Period halves"],
      correctAnswer: "Period increases by √2 ≈ 1.41×",
      hint: "T ∝ √m — doubling mass multiplies period by √2 ≈ 1.41",
      relatedParameterId: "mass",
      tier: "free",
    },
    {
      id: "shm-c3",
      question: "At what position is kinetic energy maximum? Why?",
      options: ["At maximum displacement (x = A)", "At equilibrium (x = 0)", "Halfway between equilibrium and maximum", "It is constant everywhere"],
      correctAnswer: "At equilibrium (x = 0)",
      hint: "At equilibrium (x=0), all potential energy converts to kinetic.",
      relatedParameterId: "amplitude",
      tier: "free",
    },
    {
      id: "shm-c4",
      question: "A system has k = 80 N/m, m = 0.5 kg, A = 0.3 m. Find Eₜₒₜₐₗ and vₘₐₓ.",
      options: ["E = 3.6 J, vₘₐₓ = 3.79 m/s", "E = 1.2 J, vₘₐₓ = 2.19 m/s", "E = 3.6 J, vₘₐₓ = 2.68 m/s", "E = 12 J, vₘₐₓ = 6.93 m/s"],
      correctAnswer: "E = 3.6 J, vₘₐₓ = 3.79 m/s",
      hint: "E = ½kA², then vₘₐₓ = √(2E/m)",
      relatedParameterId: "springConstant",
      tier: "pro",
    },
    {
      id: "shm-c5",
      question: "How does adding damping affect energy and amplitude over time?",
      options: ["Both decay linearly to zero", "Amplitude decays exponentially; energy decays exponentially", "Amplitude stays constant; only frequency decreases", "Energy increases due to resonance"],
      correctAnswer: "Amplitude decays exponentially; energy decays exponentially",
      hint: "Enable the damping slider and observe the envelope decay.",
      relatedParameterId: "damping",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["newtons-laws", "roller-coaster", "wave-interference"],

  seoTitle: "Simple Harmonic Motion — Interactive 3D Spring Simulation | Scivra",
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
