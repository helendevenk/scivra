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
      id: "frequency",
      label: "Frequency",
      unit: "Hz",
      min: 0.5,
      max: 3,
      default: 1.2,
      step: 0.1,
      tier: "free",
    },
    {
      id: "sourceSeparation",
      label: "Source Separation (d)",
      unit: "m",
      min: 1,
      max: 8,
      default: 4,
      step: 0.2,
      tier: "free",
    },
    {
      id: "amplitude",
      label: "Amplitude (A)",
      unit: "m",
      min: 0.2,
      max: 2,
      default: 1,
      step: 0.05,
      tier: "free",
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
    "Use the Frequency slider to tighten or spread the ripple pattern, the Source Separation slider to move the emitters closer together or farther apart, and the Amplitude slider to change wave strength. Try the Close Sources, Far Sources, and High Frequency presets to compare how spacing and frequency reshape constructive and destructive interference.",

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
  htmlControlAliases: { frequency: "freqSlider", sourceSeparation: "sepSlider", amplitude: "ampSlider" },
  presets: [
    {
      id: "applyPreset:close",
      label: "Close Sources",
      description: "Moves the two coherent sources close together so students can see broad interference bands and compare how overlapping circular waves combine.",
    },
    {
      id: "applyPreset:far",
      label: "Far Sources",
      description: "Places the sources farther apart so the nodal and antinodal regions pack more tightly across the viewing area.",
    },
    {
      id: "applyPreset:highfreq",
      label: "High Frequency",
      description: "Raises the wave frequency to create shorter apparent spacing between wavefronts and a denser interference pattern.",
    },
  ],

  contentSections: {
    whatIsIt:
      "Wave interference is what happens when two or more waves overlap in the same place at the same time. The principle of superposition says you just add the displacements together — peak meets peak, you get a bigger peak (constructive); peak meets trough, they cancel (destructive). The exact pattern depends on how far each wave has traveled to reach a given point: a path-length difference of one whole wavelength puts crests on top of crests, while a half-wavelength difference puts crest on trough. It's how noise-canceling headphones work, how thin-film soap bubbles paint themselves with rainbows, and how the double-slit experiment proved light is a wave. In this lab two coherent sources emit ripples; change wavelength, source separation, or relative phase and watch the interference pattern morph in real time across the screen.",
    parameterExplanations: {
      frequency:
        "Frequency controls how quickly each source emits wave cycles. Increasing it creates more closely spaced wavefronts, so constructive and destructive regions appear more tightly packed. Lowering it spreads the ripples out, making the broad pattern easier to trace by eye. Ask students to keep Source Separation and Amplitude fixed while changing only Frequency, then describe what moves and what stays consistent. The key observation is that frequency changes the spacing and timing of the waves, but the interference rule is unchanged: overlapping displacements still add at every point.",
      sourceSeparation:
        "Source Separation sets the distance between the two coherent emitters. When the sources are close together, their circular wavefronts overlap at gentler angles and the visible interference bands spread out. When the sources are far apart, the path-length differences change more quickly across the screen, so nodes and antinodes appear closer together. This slider is useful for isolating geometry: leave Frequency and Amplitude unchanged, move only the sources, and have students predict where strong cancellation lines should become more crowded.",
      amplitude:
        "Amplitude controls the strength of the waves emitted by both sources. Raising it makes crests and troughs more pronounced, so constructive regions look stronger and destructive regions are easier to contrast against the surrounding pattern. Lowering it softens the display without changing the basic locations of nodes and antinodes. This is the slider to use when students confuse brightness or height with interference position: the amount of displacement changes, but the geometric pattern is still governed by wave overlap and source spacing.",
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
          "Only perfectly identical waves can interfere.",
        correct:
          "Interference happens whenever waves overlap, because the displacements at each point add. Matching coherent sources produce a stable pattern that is easier to study, but the core idea is still superposition: crests, troughs, and partial displacements combine wherever the waves meet.",
      },
      {
        wrong:
          "Moving the sources farther apart makes the waves stronger.",
        correct:
          "Source separation changes the geometry of the pattern, not the strength of each emitted wave. Farther sources can make the nodal and antinodal regions appear more tightly spaced, but amplitude is the control that changes wave strength.",
      },
      {
        wrong:
          "Bright fringes are where the two waves have the same amplitude.",
        correct:
          "Bright or strong regions occur where the waves arrive so their displacements reinforce. Dark or quiet regions occur where they cancel. Amplitude affects how intense the contrast looks, but the reinforcement or cancellation comes from how the waves line up in space and time.",
      },
    ],
    teacherUseCases: [
      "Start with the Close Sources preset, then have students move only the Source Separation slider and sketch how the nodal regions change.",
      "Use the Far Sources preset to prompt a prediction about fringe density, then compare it with the Close Sources preset using the same Frequency and Amplitude values.",
      "Run a Frequency slider investigation: students record observations at low, middle, and high settings while keeping Source Separation and Amplitude fixed.",
      "Use the High Frequency preset as a quick AP warm-up on why shorter spacing between wavefronts creates a denser interference pattern.",
      "Have students change only the Amplitude slider and explain why the pattern becomes more or less visible while the node and antinode locations mostly stay put.",
    ],
    faq: [
      {
        question: "What is the principle of superposition?",
        answer:
          "When two or more waves occupy the same space at the same time, the resulting displacement at each point is the algebraic sum of the displacements from each wave. After the waves pass through each other, they continue unchanged — superposition is temporary, not destructive.",
      },
      {
        question: "What does the Frequency slider change?",
        answer:
          "Frequency changes how quickly the sources emit wave cycles. Higher frequency produces more wavefronts in the same viewing area, so the interference pattern looks tighter and more detailed. Lower frequency spreads the wavefronts out and makes the broad constructive and destructive regions easier to follow. To isolate the effect, keep Source Separation and Amplitude fixed while changing only Frequency.",
      },
      {
        question: "What does Source Separation change?",
        answer:
          "Source Separation changes the distance between the two emitters. Close sources create broader interference regions because the path differences change more gradually across the screen. Farther sources create a tighter pattern because a small move across the screen changes the relative travel distance from each source more quickly. The Close Sources and Far Sources presets are designed for this comparison.",
      },
      {
        question: "Why does changing Amplitude not move the nodes much?",
        answer:
          "Amplitude changes the size of the displacement each source contributes, so the pattern becomes more or less visually intense. Node and antinode locations are mainly set by how the waves line up after traveling from the two sources. If you keep Frequency and Source Separation fixed, changing Amplitude should mostly change contrast, not the basic geometry of the interference pattern.",
      },
      {
        question: "How should I use the presets?",
        answer:
          "Use Close Sources and Far Sources as a controlled comparison for geometry, then use High Frequency to show how a denser set of wavefronts changes the pattern. After each preset, ask students to name which slider values changed and which interference features they can observe. The presets are starting points, not separate modes, so students should still adjust the three sliders afterward.",
      },
    ],
  },
};
