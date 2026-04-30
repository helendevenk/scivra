import type { Experiment } from "@/shared/types/experiment";

export const massesSprings: Experiment = {
  id: "masses-springs",
  slug: "masses-springs-oscillation",
  title: "Masses and Springs",
  subtitle: "Explore oscillation, damping, and resonance",
  description:
    "Hang masses on springs with adjustable spring constants and damping. Measure period of oscillation, verify the mass-period relationship, and observe resonance when driving frequency matches natural frequency.",
  thumbnail: "/imgs/experiments/simple-harmonic-motion.png",

  standards: {
    ngss: ["HS-PS2-1", "HS-PS3-2"],
    gcse: ["AQA P6.2"],
    ap: ["3.B.3", "5.B.2", "5.B.3"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["spring", "oscillation", "SHM", "damping", "resonance", "period", "natural frequency"],
  difficulty: "intermediate",

  parameters: [
    { id: "mass", label: "Mass", unit: "kg", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "spring_constant", label: "Spring Constant", unit: "N/m", min: 1, max: 200, default: 50, step: 1, tier: "free" },
    { id: "damping", label: "Damping", unit: "", min: 0, max: 1, default: 0, step: 0.01, tier: "free" },
    { id: "drive_frequency", label: "Drive Frequency", unit: "Hz", min: 0, max: 5, default: 0, step: 0.01, tier: "pro" },
  ],

  formulas: [
    { latex: "T = 2\\pi\\sqrt{\\frac{m}{k}}", description: "Period of mass-spring oscillation" },
    { latex: "f_0 = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}", description: "Natural frequency" },
    { latex: "x(t) = A e^{-\\gamma t}\\cos(\\omega t + \\phi)", description: "Damped oscillation" },
  ],

  theory:
    "A mass on a spring oscillates with period T = 2π√(m/k). Unlike a pendulum, this period is independent of amplitude. Damping reduces amplitude over time; critical damping returns the system to equilibrium fastest without oscillating. Resonance occurs when a driving force matches the natural frequency — amplitude grows dramatically and is limited only by damping.",
  instructions:
    "Hang a mass on the spring and release it. Measure the period using the stopwatch. Change mass or spring constant to verify T = 2π√(m/k). Add damping to observe decay. Enable a driving force and tune the frequency to find resonance.",
  challenges: [
    { id: "ms-c1", question: "A 2kg mass on a spring (k=200 N/m). What is the period?", hint: "T = 2π√(2/200) = 2π√(0.01) = 0.628 s", tier: "free" },
    { id: "ms-c2", question: "How does doubling the mass affect the period?", hint: "T ∝ √m → T increases by factor √2 ≈ 1.41", tier: "free" },
    { id: "ms-c3", question: "Why does a driven spring with low damping eventually break at resonance?", hint: "At resonance, energy input equals zero energy loss → amplitude grows without bound", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["masses-springs-basics", "simple-harmonic-motion", "hookes-law"],

  seoTitle: "Masses and Springs — Oscillation and Resonance | AP Physics 1",
  seoKeywords: ["masses and springs", "oscillation", "resonance", "damping", "SHM", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Spring Oscillation, Resonance, Damping" },

  contentSections: {
    whatIsIt:
      "A car bouncing on its suspension after hitting a pothole, a screen door slamming and rattling shut, an old clothesline springing back when you yank a sheet off — every one of these is a mass on a spring fighting between a restoring pull and the friction trying to calm it down. This lab strips that fight to its essentials: a single block hanging from an ideal spring, with sliders for the spring stiffness, the block's mass, the damping that drains energy, and an optional driving force that pushes the system at a tunable rhythm. Vary the knobs and you can watch a clean sinusoid, a fading wiggle, or — when the drive frequency lines up with the natural frequency — a runaway resonance peak that grows until damping finally catches up. Set up a measurement, then read the period off the stopwatch and compare it to T = 2π√(m/k).",
    parameterExplanations: {
      mass:
        "The hanging mass in kilograms. Heavier blocks have more inertia, so they accelerate more slowly under the same spring force and the period grows as √m. Doubling mass multiplies the period by about 1.41, not by 2.",
      spring_constant:
        "The spring's stiffness k in newtons per meter. A bigger k means a stronger pull-back for the same stretch, which tightens the period (T shrinks like 1/√k). Soft springs sag a lot and oscillate slowly; stiff springs barely move and oscillate fast.",
      damping:
        "A dimensionless friction term that bleeds mechanical energy into heat each cycle. Zero damping gives a perfectly steady sinusoid; small damping gives an exponentially shrinking envelope; large damping kills oscillation entirely so the mass just sags to equilibrium.",
      drive_frequency:
        "The frequency in hertz of an external force pushing the spring rhythmically (Pro). Slide it slowly and watch the steady-state amplitude — it stays small everywhere except near the natural frequency f₀ = (1/2π)√(k/m), where the response spikes dramatically. That spike is resonance.",
    },
    misconceptions: [
      {
        wrong:
          "Heavier blocks bounce faster because gravity pulls them harder.",
        correct:
          "Heavier blocks bounce slower. Gravity sets the equilibrium position but does not enter the period formula. The period is T = 2π√(m/k), so more mass means more inertia and a longer cycle, regardless of how strongly gravity pulls.",
      },
      {
        wrong:
          "If I pull the spring twice as far before letting go, the period doubles.",
        correct:
          "Period is independent of amplitude for an ideal spring. Pulling twice as far gives the mass twice the maximum speed and twice the displacement, but the time to complete one round trip stays the same. That's the defining feature of simple harmonic motion.",
      },
      {
        wrong:
          "When you add damping, the energy disappears.",
        correct:
          "Damping converts kinetic and elastic potential energy into thermal energy in the spring, the air, and the bearings. Total energy of the universe is conserved — you just can't get the heat back out as ordered oscillation.",
      },
      {
        wrong:
          "At resonance, amplitude grows forever as long as you keep driving.",
        correct:
          "Only if there is zero damping. In any real system, damping drains energy at a rate proportional to the square of the amplitude, so the amplitude rises until energy in from the drive equals energy lost to damping. That is the steady-state resonance peak.",
      },
      {
        wrong:
          "The mass is moving fastest when the spring is stretched the most.",
        correct:
          "It's exactly the opposite. At maximum stretch the mass is momentarily at rest before reversing direction; the speed peaks as it crosses through the equilibrium point, where all of the elastic potential energy has converted to kinetic energy.",
      },
    ],
    teacherUseCases: [
      "Period verification lab: have students collect 10-trial period averages at three different masses and three different spring constants, then plot T² vs m/k. The slope should come out close to 4π², which makes the formula T = 2π√(m/k) a derivation rather than a memorized fact.",
      "Resonance discovery (Pro): leave damping at a small nonzero value, sweep the drive frequency from 0.1 Hz upward in small steps, and have students record steady-state amplitude. The shape of the resonance curve introduces Q-factor without needing the algebra first.",
      "Misconception probe — pause the simulation at full stretch and ask 'is the block moving right now?' Many students confidently say yes because the spring 'wants to snap back'. Use the velocity readout to settle the argument with data.",
      "Energy bookkeeping: turn damping to zero, pause at three points (max stretch, equilibrium, max compression), and have students compute ½kx² + ½mv² at each. They should find the same number every time, which makes energy conservation tactile.",
      "Cross-experiment compare: after this lab, run masses-springs-basics to isolate the no-damping case, then pendulum-lab to test which oscillator is mass-independent and which is not. The contrast cements where m enters the period formula.",
    ],
    faq: [
      {
        question: "Why doesn't gravity show up in the period formula?",
        answer:
          "Gravity does pull the block down, but its only job is to shift the equilibrium position to a new spot where the spring's pull balances gravity. Once the block oscillates around that new equilibrium, the restoring force depends only on displacement from equilibrium, which is set by k. Move the same setup to the Moon and the block hangs lower, but the period is identical. The pendulum behaves differently because gravity is the restoring force itself, not just a position offset.",
      },
      {
        question: "What is resonance and why does it matter outside this lab?",
        answer:
          "Resonance is the dramatic amplitude rise when an external driving frequency matches a system's natural frequency f₀ = (1/2π)√(k/m). Each push lands when the mass is moving in the same direction, so energy keeps accumulating. Engineers care about it because bridges, washing machines, car suspensions, and microwave ovens all have natural frequencies — you either tune them away from anything that drives them, or you tune them onto the drive on purpose, like in MRI machines or radio receivers.",
      },
      {
        question: "How does damping change the natural frequency?",
        answer:
          "A little: the damped angular frequency is ω_d = √(ω₀² − γ²), where γ depends on the damping coefficient. For light damping the shift is tiny and you can ignore it. As damping climbs, the frequency drops, and at critical damping the system stops oscillating altogether — it just glides back to equilibrium without overshooting. Car suspensions are intentionally tuned near critical damping so you don't bounce three times after every speed bump.",
      },
      {
        question: "What does the AP Physics 1 standard 5.B.3 expect me to do with this?",
        answer:
          "AP standard 5.B.3 (and the related learning objectives in 3.B.3 and 5.B.2) expects you to model an oscillating mass-spring system using energy conservation, identify where kinetic and potential energy peak, predict period from m and k, and reason qualitatively about how damping and driving forces change the response. NGSS HS-PS3-2 layers on top: explain that the visible oscillation is a transformation between two energy storage mechanisms, with damping converting the orderly motion to thermal energy.",
      },
      {
        question: "Why does my measured period differ from 2π√(m/k)?",
        answer:
          "Three usual suspects. First, the formula assumes a massless spring; real springs add a fraction (~⅓) of their own mass to the effective oscillating mass. Second, any damping you forgot to zero out shifts the frequency slightly downward. Third, stopwatch reaction time dominates if you only time one cycle — always time 10 or 20 cycles and divide. If your error is more than a few percent after fixing those, recheck k by hanging known masses and measuring the static stretch.",
      },
    ],
  },
};
