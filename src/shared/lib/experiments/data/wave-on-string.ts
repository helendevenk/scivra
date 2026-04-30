import type { Experiment } from "@/shared/types/experiment";

export const waveOnString: Experiment = {
  id: "wave-on-string",
  slug: "wave-on-string-transverse-waves",
  title: "Wave on a String",
  subtitle: "Explore transverse waves, reflection, and standing waves",
  description:
    "Generate waves on a virtual string by oscillating one end. Observe wave speed, frequency, wavelength, amplitude, and how reflected waves create standing wave patterns with nodes and antinodes.",
  thumbnail: "/imgs/experiments/wave-interference.png",

  standards: {
    ngss: ["HS-PS4-1"],
    gcse: ["AQA P6.1", "AQA P6.2"],
    ap: ["GO-4.A", "GO-4.B", "GO-4.C"],
  },
  primaryStandard: "ap-physics-1",
  category: "waves",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["transverse wave", "standing wave", "nodes", "antinodes", "wavelength", "frequency", "string vibration"],
  difficulty: "intermediate",

  parameters: [
    { id: "frequency", label: "Frequency", unit: "Hz", min: 0.1, max: 5, default: 1, step: 0.05, tier: "free" },
    { id: "amplitude", label: "Amplitude", unit: "cm", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "tension", label: "String Tension", unit: "N", min: 1, max: 100, default: 10, step: 1, tier: "free" },
    { id: "damping", label: "Damping", unit: "", min: 0, max: 1, default: 0, step: 0.01, tier: "pro" },
  ],

  formulas: [
    { latex: "v = \\sqrt{\\frac{T}{\\mu}}", description: "Wave speed on string (T=tension, μ=linear density)" },
    { latex: "v = f\\lambda", description: "Wave speed" },
    { latex: "f_n = \\frac{n}{2L}v", description: "Standing wave harmonics" },
  ],

  theory:
    "Transverse waves on a string propagate with speed v = √(T/μ), where T is tension and μ is linear mass density. When the wave reflects from a fixed end, the incident and reflected waves superpose. At specific frequencies, standing waves form with permanent nodes (zero amplitude) and antinodes (maximum amplitude). The allowed frequencies are harmonics: f_n = nv/(2L) for a fixed string of length L.",
  instructions:
    "Use the oscillator to shake the string end. Adjust frequency to find standing waves — the string resonates at harmonics. Use the ruler to measure wavelength. Toggle between fixed and free end to see different reflection behavior. Enable slow motion to see individual wave crests.",
  challenges: [
    { id: "ws-c1", question: "A string (L=1m, v=10 m/s) — what are the first three harmonic frequencies?", hint: "f_n = nv/(2L) → f₁=5Hz, f₂=10Hz, f₃=15Hz", tier: "free" },
    { id: "ws-c2", question: "How does doubling the string tension change wave speed?", hint: "v ∝ √T → speed increases by √2 ≈ 1.41×", tier: "free" },
    { id: "ws-c3", question: "Why do nodes not move in standing waves? What is happening physically?", hint: "Incident and reflected waves cancel exactly at nodes through destructive interference", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["wave-interference", "normal-modes", "fourier-making-waves"],

  seoTitle: "Wave on a String — Standing Waves | AP Physics 1 Simulation",
  seoKeywords: ["wave on string", "transverse waves", "standing waves", "nodes antinodes", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Transverse Waves, Standing Waves, String Harmonics" },

  contentSections: {
    whatIsIt:
      "Whip the end of a jump rope and a hump races to the other end and back; pluck a guitar string and a sustained tone fills the room; flick a Slinky and watch a pulse zoom along it. Each one is a transverse wave on a string — the rope moves up and down, but the disturbance travels horizontally along the line. The wave's speed is set by the string itself: v = √(T/μ), where T is the tension you pull with and μ is the mass per unit length of the string. Crank tension up and the wave races faster; use a heavier string and it slows down. Drive one end at a steady frequency and the wave reflects off the far end, the outgoing and returning waves overlap, and at certain magic frequencies they lock into a standing wave with motionless nodes and big-amplitude antinodes. Those are the harmonics of the string, and they're exactly what set the pitch of every stringed instrument on the planet.",
    parameterExplanations: {
      frequency:
        "How many times per second the driver wiggles the string end, in hertz. Frequency sets the wavelength through λ = v/f, and at specific values you'll hit standing-wave resonances f_n = nv/(2L) where the string blooms into a clean harmonic shape.",
      amplitude:
        "How far the driver moves the string up and down, in centimeters. Amplitude controls the energy and intensity of the wave but does not change its speed or wavelength — those are properties of the string and the driving frequency, not how hard you shake it.",
      tension:
        "The pulling force on the string in newtons. Wave speed v = √(T/μ) grows with √T, so quadrupling tension doubles the speed. Tightening a guitar string makes its harmonics ring at higher frequencies — that's how tuning works.",
      damping:
        "A dimensionless coefficient (Pro) for energy loss into the surroundings. Zero damping lets the standing wave grow until the driver's energy input balances reflection losses; nonzero damping shrinks the steady-state amplitude and broadens the resonance peaks in frequency.",
    },
    misconceptions: [
      {
        wrong:
          "The string itself is the thing moving down the line — when I make a wave, the rope travels along.",
        correct:
          "Only the disturbance travels. Each point on the string moves up and down (transverse to the wave direction); no point on the string drifts toward the other end. The energy moves; the medium does not. Tie a ribbon to one spot and watch — it stays put as waves race past.",
      },
      {
        wrong:
          "A bigger amplitude makes the wave travel faster.",
        correct:
          "Wave speed depends only on the medium: v = √(T/μ). Tighter string or lighter string, faster wave. Bigger amplitude carries more energy per cycle, but the speed of propagation is unchanged.",
      },
      {
        wrong:
          "At a node in a standing wave, no waves are present — it's a dead spot.",
        correct:
          "Both incident and reflected waves are passing through the node continuously. The node is dead because the two waves arrive there exactly out of phase and cancel through destructive interference at every instant. Halfway between two nodes is an antinode, where they reinforce.",
      },
      {
        wrong:
          "Standing waves only happen at one special frequency for a given string.",
        correct:
          "There's a whole ladder of them: f_n = nv/(2L) for n = 1, 2, 3, … . The fundamental (n=1) is the lowest, then the second harmonic, third, and so on. Sweep the frequency slider slowly and you'll see the string bloom into clean standing waves at each harmonic and look messy in between.",
      },
      {
        wrong:
          "Frequency and pitch are the same thing.",
        correct:
          "Pitch is the perception in your brain; frequency is the physical property of the wave. They're closely correlated but not identical — pitch perception also depends on amplitude, harmonics, and context. Two pure tones at 440 Hz and 444 Hz have measurably different frequencies but most listeners hear them as the same A.",
      },
    ],
    teacherUseCases: [
      "Wave-speed verification: have students measure wave speed at three different tensions (e.g., 5, 20, 80 N) by timing a pulse traveling the length of the string. Plot v² vs T — should be a straight line through the origin with slope 1/μ.",
      "Standing-wave hunt: keep tension fixed and slowly sweep frequency from 0.1 Hz upward. Have students record every frequency where the string locks into a clean standing pattern. The ratios should be 1 : 2 : 3 : 4 — the harmonic series.",
      "Misconception probe — pause at a node in a clean standing wave and ask 'is anything happening at this point?' Most students say no. Use the slow-motion view to show the incident and reflected waves both passing through, canceling exactly. The node is a region of intense activity that adds to zero.",
      "Tuning a guitar from physics: ask students to predict what happens to the fundamental frequency if they double the tension. v scales as √T, so f_1 grows by √2. Test by changing the tension slider and measuring before and after.",
      "Cross-system bridge: after this lab, run normal-modes-coupled-oscillators to see standing waves emerge from a discrete chain of masses, or wave-interference to study what happens when two waves cross. The harmonics here are the continuum limit of the normal modes there.",
    ],
    faq: [
      {
        question: "Why does wave speed depend on tension and mass density?",
        answer:
          "From Newton's second law applied to a small string segment: tension provides the restoring force that snaps a displaced segment back, and the linear mass density μ provides the inertia that resists motion. Higher tension means a stronger restoring force, so disturbances propagate faster; higher μ means more inertia per unit length, so they propagate slower. Working through the math gives v = √(T/μ). It's the wave-on-string analog of how spring stiffness and mass set the frequency of a single oscillator.",
      },
      {
        question: "How does a standing wave actually form?",
        answer:
          "When a wave traveling to the right hits a fixed end, it reflects with an inverted shape. Now you have an incoming wave moving right and a reflected wave moving left, both with the same frequency and amplitude. They add by superposition. At specific frequencies the two waves line up so that their crests and troughs always cancel at certain points (nodes) and always reinforce at other points (antinodes). The result is a stationary pattern that looks like the string is just oscillating up and down — the traveling component has disappeared into the interference.",
      },
      {
        question: "What sets the harmonics f_n = nv/(2L)?",
        answer:
          "A string fixed at both ends must have nodes at both ends. The lowest-frequency standing wave that fits this constraint is half a wavelength along L, so λ_1 = 2L and f_1 = v/(2L). The next allowed mode fits a full wavelength, then 3/2 wavelengths, and so on, giving λ_n = 2L/n and f_n = nv/(2L). This is why a guitar string produces a clean integer-ratio harmonic series, and why doubling the frequency raises the pitch by exactly one octave.",
      },
      {
        question: "How does this experiment satisfy NGSS HS-PS4-1 and AP standard GO-4.A?",
        answer:
          "NGSS HS-PS4-1 expects students to use mathematical representations to support a claim about the relationships among frequency, wavelength, and speed in waves. This lab gives the cleanest possible setup for that — measure wavelength with the ruler, frequency with the driver, and verify v = fλ across multiple settings. AP Physics 1 standards GO-4.A through GO-4.C extend the same picture to wave properties, superposition, and standing waves on a fixed-end string, all of which appear directly in the simulation.",
      },
      {
        question: "Why does my plucked guitar string sound like a single note if it's vibrating in many modes at once?",
        answer:
          "Your ear is doing pitch perception, not Fourier analysis. The lowest-frequency mode (the fundamental) usually dominates and your auditory system locks onto it as 'the' pitch. The higher harmonics are still there, riding on top, and they shape the timbre — the difference between a guitar, a violin, and a clarinet playing the same note A is almost entirely the relative amplitudes of those harmonics. Same fundamental, very different overtone mix, very different sound. To see the discrete-mass version of this idea, run normal-modes-coupled-oscillators and watch a chain of masses vibrate in superposed normal modes.",
      },
    ],
  },
};
