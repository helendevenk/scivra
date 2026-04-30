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
    question: "If you double the amplitude of an ideal spring oscillator, does it take longer to complete a cycle?",
    context: "Most people guess yes, but the answer is no for ideal simple harmonic motion — the period is independent of amplitude when the restoring force is exactly linear.",
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

  contentSections: {
    whatIsIt:
      "Pluck a guitar string, push a kid on a swing, watch a tuning fork hum after you tap it on a desk — all of them trace out the same mathematical shape: a smooth sine wave moving back and forth around a balance point. Simple harmonic motion is the physics of any system where the force pulling you back toward equilibrium grows in proportion to how far you've strayed (F = -kx). That single rule produces the cleanest motion in physics: position is sinusoidal, the period is independent of amplitude, and energy sloshes between kinetic and potential without leaking out. This lab gives you a spring-mass system with sliders for k, m, amplitude, and optional damping. Watch the energy bar split between Ek and Ep as the mass races through equilibrium and freezes at the turning points, and try to break the period formula by changing amplitude — you can't.",
    parameterExplanations: {
      springConstant:
        "Spring stiffness k in newtons per meter. A bigger k means a sharper restoring pull for the same displacement, which raises the angular frequency ω = √(k/m) and shrinks the period. Stiff springs oscillate fast; soft springs oscillate slowly.",
      mass:
        "The oscillating mass m in kilograms. Mass adds inertia, so the same spring takes longer to whip a heavier block back and forth. Period grows as √m: doubling the mass multiplies the period by √2 ≈ 1.41, not by 2.",
      amplitude:
        "The maximum displacement A from equilibrium in meters. Crucially, amplitude does NOT affect the period — that's the punchline of SHM. It does set the total energy (E = ½kA²) and the maximum speed (v_max = Aω), so larger A means a faster zip through the middle but the same round-trip time.",
      damping:
        "The damping coefficient b in kg/s (Pro). Linear damping uses a force proportional to velocity, F_d = -bv; the instantaneous power loss is proportional to v². The amplitude envelope decays exponentially as A(t) = A₀ e^(−bt/2m). Critical damping (b² = 4mk) is the fastest return to equilibrium without overshoot.",
    },
    misconceptions: [
      {
        wrong:
          "If I double the amplitude, the oscillation takes twice as long because the mass has farther to travel.",
        correct:
          "The mass does travel farther, but it also moves faster — its maximum speed scales with A. The two effects cancel exactly. Period stays at T = 2π√(m/k) for any amplitude, which is why a clock pendulum keeps the same time even as its swing shrinks.",
      },
      {
        wrong:
          "The mass is moving fastest at the extreme positions because the spring is pulling hardest there.",
        correct:
          "At the extreme positions the mass is momentarily at rest — that's where it turns around. Force is largest there, but velocity is zero. Maximum speed happens at the equilibrium point, where force is zero but kinetic energy is at its peak.",
      },
      {
        wrong:
          "When damping kicks in, the energy is destroyed.",
        correct:
          "Energy is conserved — it just leaves the visible oscillation. Damping converts kinetic and elastic potential energy into thermal energy in the spring, the surrounding air, and any bearings. Total energy of the universe is unchanged; the oscillator just gives up its share to heat.",
      },
      {
        wrong:
          "A heavier mass on the same spring oscillates faster because gravity pulls it harder.",
        correct:
          "Heavier mass means slower oscillation. The gravitational pull just shifts the equilibrium position lower; it doesn't enter the period. The dynamics around equilibrium follow T = 2π√(m/k), so more mass means a longer period — even though gravity is pulling harder.",
      },
      {
        wrong:
          "Energy is greatest when the mass is moving fastest.",
        correct:
          "Total mechanical energy is constant in undamped SHM (E = ½kA² = ½mv²_max). What changes is the split: at equilibrium, energy is 100% kinetic; at maximum displacement, it's 100% potential; everywhere else, it's a mix that adds to the same total.",
      },
    ],
    teacherUseCases: [
      "Amplitude-independence test: have pairs predict whether doubling A changes the period, then run two trials at A and 2A and time 10 cycles each. Same period. Many students need to see this with their own measurements before they trust it.",
      "Energy split lab: pause the simulation at five positions (x = 0, ±A/2, ±A) and ask students to compute Ek and Ep at each point. The two should always sum to ½kA². This makes E_total = constant tactile rather than a textbook claim.",
      "Critical damping demo (Pro): vary the damping coefficient and watch the response. Have students hunt for the b that returns the system to equilibrium fastest without oscillating. Connect to car suspensions, where engineers tune dampers near critical for the best ride.",
      "Misconception probe — ask 'when in the cycle is the mass moving fastest?' before they touch the controls. Most students point to the turning points because that's where the spring is most stretched. The velocity readout settles the argument.",
      "Cross-system bridge: this is the abstract version of masses-springs-basics and pendulum-lab. Run it after both physical labs to show that the same equations describe systems that look completely different in the real world. That's the deep point of SHM.",
    ],
    faq: [
      {
        question: "Why is the period independent of amplitude in SHM?",
        answer:
          "Because the restoring force is exactly linear in displacement (F = -kx). When you double the amplitude, you double both the maximum force and the maximum distance to travel. Larger force gives larger acceleration; larger distance demands more travel time. The two effects scale identically and cancel out in the equations of motion. This linear restoring force is the defining property of SHM, and it's what makes the period formula T = 2π√(m/k) so clean — no A in sight.",
      },
      {
        question: "How are kinetic and potential energy related in SHM?",
        answer:
          "Total mechanical energy E = ½kA² is conserved (in the absence of damping). At maximum displacement, all of E sits as elastic potential energy ½kx² with x = A; the mass is momentarily at rest. At equilibrium (x = 0), all of E sits as kinetic energy ½mv², and v = v_max = Aω. Everywhere in between, the two add to the same total. Watching the energy bar at the bottom of the simulation cycle between blue and red as the mass moves makes this visible in real time.",
      },
      {
        question: "What does damping actually do to the motion?",
        answer:
          "Damping is a velocity-dependent force F_d = -bv that opposes motion and drains mechanical energy into heat. Three regimes: underdamped (b² < 4mk) gives an oscillation with an exponentially decaying amplitude envelope A(t) = A₀ e^(−bt/2m); critically damped (b² = 4mk) returns to equilibrium fastest without overshooting; overdamped (b² > 4mk) returns slowly without oscillating. Real systems are always somewhere on this scale — only the ideal SHM bounces forever.",
      },
      {
        question: "How does this connect to AP Physics 1 standards 3.B.3 and 5.B.3?",
        answer:
          "AP Physics 1 standard 3.B.3 expects students to predict the motion of an object under a restoring force proportional to displacement — exactly the F = -kx setup here. Standard 5.B.3 layers in energy conservation, expecting students to track the kinetic-potential exchange and recognize total mechanical energy is preserved in undamped SHM. NGSS HS-PS3-2 reinforces the energy side: explain that visible oscillation is a transformation between two energy stores, with damping converting orderly motion into thermal energy.",
      },
      {
        question: "Why does the same equation describe springs, pendulums, and atoms in a crystal?",
        answer:
          "All three have a stable equilibrium and a smooth potential energy curve near that equilibrium. Whenever you zoom in close enough to a smooth U(x) minimum, it looks parabolic — and a parabolic potential energy gives a linear restoring force, which is the SHM equation. Springs are designed parabolic, pendulums approach parabolic for small angles, and the bonds between atoms in a crystal lattice are parabolic for small displacements. That's why SHM is one of the most reused models in all of physics, from clocks to acoustic waves to phonons to molecular vibrations.",
      },
    ],
  },
};
