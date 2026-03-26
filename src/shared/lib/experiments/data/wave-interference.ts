import type { Experiment } from "@/shared/types/experiment";

export const waveInterference: Experiment = {
  id: "wave-interference",
  slug: "wave-interference",
  title: "Wave Interference",
  subtitle: "Superposition, standing waves, and double-slit patterns",
  description:
    "Watch two wave sources interfere in real-time. See constructive and destructive interference form patterns, explore standing waves on a string, and visualize the double-slit experiment that puzzled physicists for centuries.",
  thumbnail: "/imgs/experiments/wave-interference.png",

  standards: {
    ngss: ["HS-PS4-1", "HS-PS4-3"],
    gcse: ["P5.3"],
    ap: ["6.A.1", "6.B.1", "6.C.1", "6.D.1", "6.D.2", "6.D.3"],
  },
  primaryStandard: "ap-physics-1",
  category: "waves",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["interference", "standing waves", "double-slit", "superposition", "diffraction", "nodes", "antinodes", "AP Physics 1"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "wavelength",
      label: "Wavelength (λ)",
      unit: "m",
      min: 0.1,
      max: 2,
      default: 0.5,
      step: 0.05,
      tier: "free",
    },
    {
      id: "amplitude",
      label: "Amplitude (A)",
      unit: "m",
      min: 0.1,
      max: 1,
      default: 0.5,
      step: 0.05,
      tier: "free",
    },
    {
      id: "sourceSeparation",
      label: "Source Separation (d)",
      unit: "m",
      min: 0.5,
      max: 4,
      default: 1.5,
      step: 0.1,
      tier: "free",
    },
    {
      id: "phaseDiff",
      label: "Phase Difference (Δφ)",
      unit: "π rad",
      min: 0,
      max: 2,
      default: 0,
      step: 0.1,
      tier: "pro",
    },
    {
      id: "mode",
      label: "Mode (standing wave harmonics)",
      unit: "",
      min: 1,
      max: 6,
      default: 1,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "y(x,t) = A\\sin(kx - \\omega t)",
      description: "Traveling wave equation",
    },
    {
      latex: "y_{total} = y_1 + y_2",
      description: "Superposition principle",
    },
    {
      latex: "\\Delta r = d\\sin\\theta",
      description: "Path length difference (double-slit)",
    },
    {
      latex: "\\Delta r = m\\lambda \\quad \\text{(constructive)}",
      description: "Constructive interference condition",
    },
    {
      latex: "\\Delta r = \\left(m + \\frac{1}{2}\\right)\\lambda \\quad \\text{(destructive)}",
      description: "Destructive interference condition",
    },
    {
      latex: "f_n = \\frac{nv}{2L} \\quad (n = 1, 2, 3, \\ldots)",
      description: "Standing wave harmonics on a string",
    },
    {
      latex: "v = f\\lambda",
      description: "Wave speed relationship",
    },
  ],

  theory:
    "When two waves overlap, they superpose: the total displacement at any point is the sum of individual displacements. If two crests meet, they add (constructive interference). If a crest meets a trough, they cancel (destructive interference). Standing waves form when reflected waves superpose with incident waves — nodes (zero displacement) and antinodes (maximum displacement) form at fixed positions. The double-slit experiment demonstrates that light (and matter) behaves as waves, with bright fringes where path lengths differ by whole wavelengths.",

  instructions:
    "Two point sources emit circular waves. Watch the interference pattern emerge — bright lines are constructive, dark lines are destructive. Adjust wavelength and separation to move the pattern. Use the phase difference slider (Pro) to shift between constructive and destructive at center. Switch to standing wave mode to see harmonics.",

  hook: {
    question: "Can two sounds perfectly cancel each other out to create silence?",
    context: "Noise-cancelling headphones do exactly this — they generate an inverted copy of ambient sound so the two waves destructively interfere, leaving near-silence.",
    actionPrompt: "Set two sources to opposite phase and watch them cancel",
  },

  learningCards: [
    {
      id: "wi-lc1",
      title: "The Superposition Principle",
      content: "When two waves occupy the same space, the resulting displacement is simply the sum of the individual displacements at every point. This principle holds for all linear waves — sound, light, water, and quantum matter waves. It is the foundation of all interference phenomena.",
      formula: { latex: "y_{total} = y_1 + y_2", description: "Superposition of two waves" },
    },
    {
      id: "wi-lc2",
      title: "Constructive Interference",
      content: "When two waves arrive in phase (crest meets crest), their amplitudes add together. This happens when the path length difference between the two sources is a whole number of wavelengths. The result is a bright fringe or loud sound — amplified beyond either source alone.",
      formula: { latex: "\\Delta r = m\\lambda \\quad (m = 0, \\pm 1, \\pm 2, \\ldots)", description: "Constructive interference condition" },
      relatedParameterId: "wavelength",
    },
    {
      id: "wi-lc3",
      title: "Destructive Interference",
      content: "When two waves arrive exactly out of phase (crest meets trough), they cancel. This occurs when the path difference is a half-integer multiple of the wavelength. Perfect cancellation requires equal amplitudes — which is why noise-cancelling headphones work best for steady, low-frequency sounds.",
      formula: { latex: "\\Delta r = \\left(m + \\tfrac{1}{2}\\right)\\lambda", description: "Destructive interference condition" },
      relatedParameterId: "phaseDiff",
    },
    {
      id: "wi-lc4",
      title: "Standing Waves",
      content: "When a wave reflects back on itself in a confined space, superposition creates a standing wave — fixed nodes (zero displacement) and antinodes (maximum displacement). Only specific frequencies resonate: the harmonics. A guitar string, organ pipe, and microwave oven all exploit standing waves.",
      formula: { latex: "f_n = \\frac{nv}{2L}", description: "Harmonic frequencies on a string fixed at both ends" },
      relatedParameterId: "mode",
    },
  ],

  easterEggs: [
    {
      parameterId: "phaseDiff",
      condition: "specific",
      triggerValue: 0,
      effect: "perfect-constructive-glow",
      message: "Perfect constructive interference — the waves are perfectly in sync!",
    },
    {
      parameterId: "phaseDiff",
      condition: "specific",
      triggerValue: 1,
      effect: "perfect-destructive-silence",
      message: "Total destructive interference — complete silence at the center!",
    },
    {
      parameterId: "mode",
      condition: "max",
      effect: "harmonic-rainbow-visualization",
      message: "6th harmonic! The string is vibrating so fast it's practically singing.",
    },
  ],

  challenges: [
    {
      id: "wi-c1",
      question: "Two sources 1.5 m apart emit waves of λ = 0.5 m. At what angles do the first two constructive interference maxima occur?",
      options: ["θ₁ = 19.5°, θ₂ = 41.8°", "θ₁ = 9.6°, θ₂ = 19.5°", "θ₁ = 30.0°, θ₂ = 60.0°", "θ₁ = 15.0°, θ₂ = 30.0°"],
      correctAnswer: "θ₁ = 19.5°, θ₂ = 41.8°",
      hint: "d sin θ = mλ. Solve for θ at m=0,1,2.",
      relatedParameterId: "sourceSeparation",
      tier: "free",
    },
    {
      id: "wi-c2",
      question: "A standing wave on a 0.6 m string vibrates in its 3rd harmonic. What is the wavelength? How many nodes are there?",
      options: ["λ = 0.4 m, 4 nodes", "λ = 0.2 m, 3 nodes", "λ = 0.6 m, 2 nodes", "λ = 0.4 m, 3 nodes"],
      correctAnswer: "λ = 0.4 m, 4 nodes",
      hint: "For nth harmonic: λₙ = 2L/n. Nodes = n+1.",
      relatedParameterId: "mode",
      tier: "free",
    },
    {
      id: "wi-c3",
      question: "If you double the wavelength of both sources, how does the spacing of maxima change?",
      options: ["Spacing doubles", "Spacing halves", "Spacing stays the same", "Spacing quadruples"],
      correctAnswer: "Spacing doubles",
      hint: "d sin θ = mλ — wider spacing when λ is larger.",
      relatedParameterId: "wavelength",
      tier: "free",
    },
    {
      id: "wi-c4",
      question: "Two sources emit waves in phase. A point P is 3.25λ from source 1 and 1.75λ from source 2. Is P a node or antinode?",
      options: ["Antinode (constructive)", "Node (destructive)", "Neither — partial cancellation", "Cannot determine without frequency"],
      correctAnswer: "Node (destructive)",
      hint: "Path difference = 3.25λ - 1.75λ = 1.5λ = (m + ½)λ. This is destructive.",
      relatedParameterId: "sourceSeparation",
      tier: "pro",
    },
    {
      id: "wi-c5",
      question: "A string fixed at both ends has v = 120 m/s and L = 0.8 m. Find all resonant frequencies up to 500 Hz.",
      options: ["75, 150, 225, 300, 375, 450 Hz", "120, 240, 360, 480 Hz", "80, 160, 240, 320, 400, 480 Hz", "150, 300, 450 Hz"],
      correctAnswer: "75, 150, 225, 300, 375, 450 Hz",
      hint: "fₙ = nv/(2L). Calculate for n = 1,2,3,... until fₙ > 500 Hz.",
      relatedParameterId: "mode",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["em-spectrum", "simple-harmonic-motion"],

  seoTitle: "Wave Interference — Interactive 3D Simulation | NeonPhysics",
  seoKeywords: [
    "wave interference simulation",
    "standing waves interactive",
    "double slit experiment",
    "AP Physics 1 waves",
    "constructive destructive interference",
    "superposition principle",
    "wave nodes antinodes",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Wave Interference and Superposition",
  },
};
