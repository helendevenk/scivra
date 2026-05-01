import type { Experiment } from "@/shared/types/experiment";

export const normalModes: Experiment = {
  id: "normal-modes",
  slug: "normal-modes-coupled-oscillators",
  title: "Normal Modes",
  subtitle: "Coupled oscillators and standing wave patterns",
  description:
    "Explore normal modes of coupled spring-mass systems and strings. Observe how any complex oscillation decomposes into fundamental modes, connecting mechanical oscillations to musical acoustics.",
  thumbnail: "/imgs/experiments/wave-interference.png",

  standards: {
    ngss: ["HS-PS4-1"],
    gcse: ["AQA P6.2"],
    ap: ["GO-5.B", "GO-5.C"],
  },
  primaryStandard: "ap-physics-1",
  category: "waves",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["normal modes", "coupled oscillators", "standing waves", "harmonics", "vibration modes", "superposition"],
  difficulty: "advanced",

  parameters: [
    { id: "num_masses", label: "Number of Masses", unit: "", min: 1, max: 5, default: 2, step: 1, tier: "free" },
    { id: "spring_constant", label: "Spring Constant", unit: "N/m", min: 1, max: 100, default: 20, step: 1, tier: "free" },
    { id: "mass", label: "Mass", unit: "kg", min: 0.1, max: 2, default: 1, step: 0.1, tier: "free" },
    { id: "coupling", label: "Coupling Strength", unit: "", min: 0.1, max: 5, default: 1, step: 0.1, tier: "pro" },
  ],

  formulas: [
    { latex: "\\omega_n = 2\\omega_0\\sin\\left(\\frac{n\\pi}{2(N+1)}\\right)", description: "Normal mode frequencies" },
    { latex: "f_n = \\frac{n}{2L}\\sqrt{\\frac{T}{\\mu}}", description: "String harmonics" },
  ],

  theory:
    "Normal modes are the independent oscillation patterns of a coupled system — each mode oscillates at a distinct frequency with all parts moving in phase or exactly anti-phase. Any arbitrary motion can be written as a superposition of normal modes. For a string, normal modes are harmonics (standing waves). For coupled pendulums, the two modes are in-phase (lower frequency) and out-of-phase (higher frequency). This concept extends to quantum mechanics (phonons) and molecular vibrations.",
  instructions:
    "Click to excite specific normal modes using the mode buttons. The masses will oscillate in the characteristic pattern. Switch to 'mix' mode and observe how two modes combine into a complex beating pattern. For a string view, observe standing wave patterns for each harmonic.",
  challenges: [
    { id: "nm-c1", question: "Two identical coupled pendulums: what are the two normal mode frequencies?", hint: "Mode 1 (in-phase): both pendulums swing together at ω₀; Mode 2 (anti-phase): slightly higher ω", tier: "free" },
    { id: "nm-c2", question: "Start one pendulum and watch the other. What happens? Why?", hint: "Energy slowly transfers between them — a beat pattern; the motion is a mix of both normal modes", tier: "free" },
    { id: "nm-c3", question: "How do normal modes relate to a guitar string's harmonics?", hint: "Each harmonic is a normal mode of the string with nodes at both ends; frequency = n×fundamental", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["masses-springs", "fourier-making-waves", "wave-interference"],

  seoTitle: "Normal Modes — Coupled Oscillators Simulation | AP Physics 1",
  seoKeywords: ["normal modes", "coupled oscillators", "standing waves", "harmonics", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Normal Modes, Coupled Oscillators, Standing Waves" },

  contentSections: {
    whatIsIt:
      "Hang two pendulums next to each other and connect them with a loose spring; pluck one and walk away. A minute later the first has gone still and the second is swinging hard — then the energy slowly trades back. That ghostly back-and-forth is what coupled oscillators do, and the cleanest way to make sense of it is normal modes. A normal mode is a special motion where every part of the system oscillates at the same frequency, all in phase or exactly out of phase. Any messy starting condition turns out to be a sum of normal modes, each marching on its own clock. This lab lets you build a chain of one to five masses connected by springs, change the coupling strength, and excite individual modes. Watch the in-phase mode at low frequency, the anti-phase mode at higher frequency, and the beating pattern when you mix two.",
    parameterExplanations: {
      num_masses:
        "The number of masses in the chain, from 1 to 5. With N masses you get N normal modes, each with a distinct frequency and a distinct shape (number of nodes along the chain). Add masses to watch the mode count grow.",
      spring_constant:
        "The stiffness k of the springs holding the masses to the walls, in N/m. Larger k raises every normal-mode frequency proportionally to √k — a stiffer system is a faster system, just like for a single oscillator.",
      mass:
        "Mass of each individual block in kg. More mass means more inertia at every site, which lowers every mode frequency by 1/√m. Doubling mass cuts every mode's frequency by about 30%.",
      coupling:
        "The strength of the inter-mass spring connection (Pro). Weak coupling keeps the modes close together in frequency and produces slow energy transfer (long beat periods). Strong coupling spreads the modes far apart and locks the masses into more rigid collective motion.",
    },
    misconceptions: [
      {
        wrong:
          "Each note on a guitar string is its own simple wave at one frequency.",
        correct:
          "A plucked string vibrates in a superposition of normal modes — the fundamental plus a tower of overtones. The pitch you hear is dominated by the fundamental, but the timbre that distinguishes a guitar from a piano playing the same note comes from the relative amplitudes of those higher harmonics.",
      },
      {
        wrong:
          "When energy moves from one pendulum to another in a coupled pair, the energy is being transferred back and forth.",
        correct:
          "It looks that way, but the underlying motion is two normal modes oscillating at slightly different frequencies. The 'transfer' is the beat between the modes — when they're in phase the first mass moves and the second is still; a half-beat later it's reversed. Total energy is constant the whole time.",
      },
      {
        wrong:
          "Adding more masses always means lower frequencies.",
        correct:
          "It depends on which mode. Adding masses lengthens the chain and gives lower fundamental frequencies, but it also opens up new high-frequency modes. The full set of modes spans a wider range, not a strictly lower one.",
      },
      {
        wrong:
          "Normal modes are a quirk of pendulums and springs and don't apply elsewhere.",
        correct:
          "Normal modes describe any linear coupled system — molecular vibrations, building sway during earthquakes, phonons in crystals, the modes of a drumhead, even the vibrations of a guitar body's wood. The math here is the same math that physicists use to describe sound, heat, and quantum states of solids.",
      },
      {
        wrong:
          "Two coupled pendulums always swing in lockstep at the same frequency.",
        correct:
          "Only when the system is in a single normal mode. A coupled pair has two normal modes — both in phase (lower frequency) and exactly anti-phase (higher frequency). Generic starting conditions excite both modes, producing the beating energy-transfer pattern you see when you start one pendulum and watch the other.",
      },
    ],
    teacherUseCases: [
      "Two-pendulum beat demo: set num_masses to 2 with weak coupling, displace only the first mass, and time how long it takes for all the energy to transfer to the second. The beat period equals 2π/(ω₂ − ω₁), which lets students extract the mode-frequency difference from a stopwatch reading.",
      "Mode-counting investigation: let students vary num_masses from 1 to 5 and record the number of distinct normal modes for each. They should discover that N masses give exactly N modes — a result that generalizes from beads on a string to atoms in a crystal.",
      "Mode-shape sketching: have students sketch the displacement pattern for each mode of a 4-mass chain before clicking the mode buttons. They should predict that mode n has n−1 internal nodes. The simulation either confirms or corrects.",
      "Cross-system bridge: after this lab, run wave-on-string-transverse-waves to see the same idea for a continuous string. The harmonics there are the continuum limit of the discrete normal modes here — same physics, infinite masses.",
      "Misconception probe — when the first pendulum goes still and the second is swinging, ask 'where did the energy go and where is it now?' Many students say 'the energy moved through the spring'. Use the mode picture to argue that the energy was always present in the system as a superposition of modes, and the visible motion is a beat pattern.",
    ],
    faq: [
      {
        question: "What is a normal mode and why is it useful?",
        answer:
          "A normal mode is a special motion of a coupled system where every part oscillates at the same single frequency, with each pair of parts either perfectly in phase or perfectly anti-phase. Normal modes are useful because any motion of the system — no matter how complicated it looks — can be written as a sum of these modes, each evolving independently in time. That decomposition turns a hard coupled problem into a stack of simple single-oscillator problems. It's the same trick that powers Fourier analysis of sound and the band structure of crystals.",
      },
      {
        question: "Why do two coupled pendulums show the back-and-forth energy transfer?",
        answer:
          "If you start one pendulum swinging and leave the other at rest, you are actually exciting both normal modes — the in-phase mode and the anti-phase mode — with equal amplitudes. The two modes have slightly different frequencies, ω₁ and ω₂, so they slowly drift out of step. When they reinforce on the first pendulum, the second is still; a half-beat-period later, the situation reverses. The 'energy transfer' is just the beat between two normal modes, and the beat period is 2π/(ω₂ − ω₁).",
      },
      {
        question: "How are normal modes related to a guitar string's harmonics?",
        answer:
          "A guitar string is the continuum limit of a chain with infinitely many masses. Its normal modes are standing waves with nodes at both ends, and their frequencies are integer multiples of the fundamental: f_n = nv/(2L). The fundamental is the lowest mode (n=1), the second harmonic is the n=2 mode, and so on. A plucked string is a superposition of all of them; the relative amplitudes set the timbre. The discrete modes you see in this lab become the continuous standing waves you'll meet in wave-on-string-transverse-waves.",
      },
      {
        question: "How does this connect to NGSS HS-PS4-1 and AP standards GO-5.B and GO-5.C?",
        answer:
          "NGSS HS-PS4-1 expects students to use mathematical representations to predict relationships among the frequency, wavelength, and speed of waves in various media. Normal modes give the cleanest discrete version of that — the mode frequencies follow a precise mathematical formula based on N, k, and m. AP Physics 1 standards GO-5.B and GO-5.C focus on oscillations and the superposition of harmonic motions, exactly the framework this lab makes concrete.",
      },
      {
        question: "Why does this idea matter outside physics class?",
        answer:
          "Engineers analyze the normal modes of buildings, bridges, and aircraft to make sure no driving force (wind, traffic, engine vibration) lines up with a structural mode and causes resonance damage — the Tacoma Narrows Bridge collapse is the textbook cautionary tale. Chemists use normal modes to identify molecules by their infrared vibration spectra. Solid-state physicists call the normal modes of a crystal lattice 'phonons' and treat them as quantized particles to explain heat capacity. The mode picture is one of the most reused tools in all of physical science.",
      },
    ],
  },
};
