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

  seoTitle: "Wave Interference — Interactive 3D Simulation | Scivra",
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

  contentSections: {
    whatIsIt:
      "Wave interference is what happens when two or more waves overlap in the same place at the same time. The principle of superposition says you just add the displacements together — peak meets peak, you get a bigger peak (constructive); peak meets trough, they cancel (destructive). The exact pattern depends on how far each wave has traveled to reach a given point: a path-length difference of one whole wavelength puts crests on top of crests, while a half-wavelength difference puts crest on trough. It's how noise-canceling headphones work, how thin-film soap bubbles paint themselves with rainbows, and how the double-slit experiment proved light is a wave. In this lab two coherent sources emit ripples; change wavelength, source separation, or relative phase and watch the interference pattern morph in real time across the screen.",
    parameterExplanations: {
      wavelength:
        "Distance between consecutive peaks. Shorter wavelength means closer fringes; longer wavelength spreads them out. With two slits, fringe spacing is approximately wavelength × distance / slit separation.",
      amplitude:
        "Height of each wave's peaks. Doesn't change where bright/dark fringes land — only how bright the bright fringes are. Doubling amplitude quadruples intensity (intensity scales as amplitude squared).",
      sourceSeparation:
        "Distance between the two emitting points. Smaller separation spreads the interference pattern out; larger separation packs fringes closer. This is the 'd' in the double-slit equation d sin θ = mλ.",
      phaseDiff:
        "Phase offset between the two sources. Zero phase difference (in phase) gives a central bright fringe. A π phase difference (out of phase) flips bright and dark, giving a central dark fringe.",
      mode:
        "Switches between two-source interference, single-slit diffraction, and standing-wave modes so you can compare patterns side by side.",
    },
    misconceptions: [
      {
        wrong:
          "Destructive interference destroys the wave's energy.",
        correct:
          "Energy is conserved. Where two waves cancel destructively, their energy reappears as extra constructive intensity elsewhere in the pattern. The total energy doesn't disappear, it just redistributes.",
      },
      {
        wrong:
          "Two waves can only interfere if they're at the exact same frequency.",
        correct:
          "Interference happens whenever waves overlap. Same-frequency coherent sources produce stable, easy-to-see patterns. Different frequencies produce 'beats' — interference patterns that change with time. Both are interference.",
      },
      {
        wrong:
          "The double-slit experiment shows that light is a particle.",
        correct:
          "It shows the opposite: light makes a wave-like interference pattern even when sent through one photon at a time. The single-photon interference pattern is one of the central pieces of evidence for wave-particle duality.",
      },
      {
        wrong:
          "Bright fringes are where the two waves have the same amplitude.",
        correct:
          "Bright fringes are where the two waves arrive in phase, no matter what their individual amplitudes are. Dark fringes are where they arrive out of phase. Phase relationship — not amplitude — determines bright vs. dark.",
      },
    ],
    teacherUseCases: [
      "Phase prediction: ask students to predict the central fringe (bright or dark) for phase differences of 0, π/2, π, 3π/2 before running the lab. Verify each.",
      "Wavelength scan: hold all parameters fixed except wavelength, and have students measure fringe spacing at three different wavelengths. Plot spacing vs. wavelength and discover the linear relationship.",
      "Beat phenomenon: switch one source to a slightly different frequency and ask students to explain the slowly-varying envelope. Connect to musical instrument tuning.",
      "Real-world application: discuss how anti-reflective lens coatings use destructive interference at thin-film boundaries to reduce glare.",
      "Single-source comparison: switch to single-slit diffraction mode and ask students how the pattern differs from two-slit interference. Highlight that single-slit also has minima but with different spacing.",
    ],
    faq: [
      {
        question: "What is the principle of superposition?",
        answer:
          "When two or more waves occupy the same space at the same time, the resulting displacement at each point is the algebraic sum of the displacements from each wave. After the waves pass through each other, they continue unchanged — superposition is temporary, not destructive.",
      },
      {
        question: "Why do we need coherent sources for stable interference?",
        answer:
          "Coherent means the sources have a constant phase relationship. If phases drifted randomly, bright fringes would appear and disappear too fast for our eyes (or the camera) to see. Lasers are great for double-slit experiments because their light is highly coherent.",
      },
      {
        question: "What's the difference between interference and diffraction?",
        answer:
          "Interference is the result of overlapping waves from two or more sources. Diffraction is the spreading of a single wave around an obstacle or through an aperture. The double-slit pattern is technically interference modulated by single-slit diffraction — the envelope you see comes from diffraction at each slit.",
      },
      {
        question: "How does this connect to AP Physics 1 and 2?",
        answer:
          "AP Physics 1 covers superposition, standing waves, and beats. AP Physics 2 extends to two-source interference and the double-slit experiment. Both expect students to use d sin θ = mλ for path-difference reasoning. This lab supports both courses by letting students change variables and see consequences.",
      },
      {
        question: "Why are the bright fringes evenly spaced (for small angles)?",
        answer:
          "Path-difference math. The condition for bright fringe m is d sin θ = mλ. For small angles, sin θ ≈ tan θ ≈ y/L (where y is fringe distance from center, L is screen distance). That gives evenly spaced fringes at y_m = mλL/d. Beyond small angles the spacing stretches, but in most teaching setups the small-angle approximation holds.",
      },
    ],
  },
};
