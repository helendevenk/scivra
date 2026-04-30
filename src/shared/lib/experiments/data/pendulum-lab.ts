import type { Experiment } from "@/shared/types/experiment";

export const pendulumLab: Experiment = {
  id: "pendulum-lab",
  slug: "pendulum-lab-oscillation",
  title: "Pendulum Lab",
  subtitle: "Measure period and explore pendulum dynamics",
  description:
    "Experiment with pendulums of different lengths, masses, and amplitudes. Measure period precisely, verify the length-period relationship, and explore energy dissipation with friction.",
  thumbnail: "/imgs/experiments/simple-harmonic-motion.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P6.2"],
    ap: ["3.B.3", "5.B.2"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["pendulum", "period", "oscillation", "simple harmonic motion", "gravity", "length"],
  difficulty: "intermediate",

  parameters: [
    { id: "length", label: "Pendulum Length", unit: "m", min: 0.1, max: 5, default: 1, step: 0.05, tier: "free" },
    { id: "mass", label: "Bob Mass", unit: "kg", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "angle", label: "Initial Angle", unit: "°", min: 1, max: 90, default: 15, step: 1, tier: "free" },
    { id: "gravity", label: "Gravity", unit: "m/s²", min: 1, max: 25, default: 9.8, step: 0.1, tier: "pro" },
  ],

  formulas: [
    { latex: "T = 2\\pi\\sqrt{\\frac{L}{g}}", description: "Pendulum period (small angle)" },
    { latex: "f = \\frac{1}{T} = \\frac{1}{2\\pi}\\sqrt{\\frac{g}{L}}", description: "Oscillation frequency" },
  ],

  theory:
    "A simple pendulum oscillates with period T = 2π√(L/g) for small angles (< 15°). The period depends only on length and gravity — not on mass or amplitude (for small angles). Large angles cause the true period to exceed this formula. On the Moon (g = 1.6 m/s²), the same pendulum would oscillate ~2.5× slower. Pendulums were historically used as precision timekeepers because of this mass-independence.",
  instructions:
    "Drag the pendulum bob to an initial angle and release. Use the stopwatch to measure 10 periods, then divide by 10 for accuracy. Change length and repeat to plot T vs √L. Try different masses to verify mass independence.",
  challenges: [
    { id: "pl-c1", question: "A pendulum has period 2s. What is its length?", hint: "T = 2π√(L/g) → L = g(T/2π)² = 9.8×(1/π)² ≈ 0.993 m ≈ 1 m", tier: "free" },
    { id: "pl-c2", question: "How does the period change on Mars (g = 3.7 m/s²)?", hint: "T ∝ 1/√g → T_Mars = T_Earth × √(9.8/3.7) ≈ 1.63 × T_Earth", tier: "free" },
    { id: "pl-c3", question: "Why does the small-angle formula fail for large swings?", hint: "True equation is d²θ/dt² = −(g/L)sin(θ); for large θ, sin(θ) < θ, giving longer period", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["masses-springs", "simple-harmonic-motion", "energy-skate-park-basics"],

  seoTitle: "Pendulum Lab — Period and Oscillation | AP Physics 1 Simulation",
  seoKeywords: ["pendulum lab", "period oscillation", "simple harmonic motion", "pendulum length", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Pendulum, Period, Simple Harmonic Motion" },

  contentSections: {
    whatIsIt:
      "Grandfather clocks, playground swings, a wrecking ball at the end of a crane, the rhythmic sweep of a metronome — all of these are pendulums, and all of them obey the same surprisingly simple equation. Hang a heavy bob from a string of length L, pull it sideways, let go, and gravity tugs it through a smooth back-and-forth arc. For small swings, the period T = 2π√(L/g) depends on only two things: how long the string is and how strong gravity is. Mass does not enter. Amplitude does not enter (as long as you stay below about 15°). Push the angle slider higher and that small-angle promise breaks down — large swings take measurably longer because the restoring force grows slower than the displacement. Drag the bob, time 10 cycles, change L, change g, and you can verify the formula and watch where it stops working.",
    parameterExplanations: {
      length:
        "The distance in meters from the pivot to the center of the bob. Period scales with √L, so a 4 m pendulum takes twice as long per swing as a 1 m pendulum. This is why long-case clocks are tall — they need a roughly 1 m pendulum to keep a tidy 2-second period.",
      mass:
        "The mass of the bob in kilograms. For an ideal pendulum, this slider should change nothing about the period, only the kinetic energy and tension in the string. Run two different masses at the same length and time them — the period is identical. That's the surprising part.",
      angle:
        "The initial release angle in degrees. Below about 15°, the small-angle approximation holds and amplitude does not affect the period. Push the angle to 60° or 90° and you'll see the period grow noticeably above 2π√(L/g) — the formula starts failing.",
      gravity:
        "Gravitational acceleration in m/s² (Pro). Earth is 9.8, the Moon is 1.6, Mars is 3.7, Jupiter is 24.8. Period scales like 1/√g, so the same pendulum runs ~2.5× slower on the Moon and ~1.6× faster on Jupiter — a dramatic, easy-to-feel dependence.",
    },
    misconceptions: [
      {
        wrong:
          "A heavier bob makes the pendulum swing faster because gravity pulls it harder.",
        correct:
          "Mass cancels out. Gravity does pull harder on a heavier bob, but the bob also has proportionally more inertia to overcome. The acceleration ends up the same, and so does the period. T = 2π√(L/g) — no m anywhere.",
      },
      {
        wrong:
          "If I pull the pendulum out farther before releasing, it takes longer to come back.",
        correct:
          "Only at large angles. For swings under about 15°, the period is independent of amplitude — that's the small-angle approximation, and it's why pendulum clocks were the most accurate timekeepers for nearly 300 years. Push past 30° and yes, the period does grow noticeably.",
      },
      {
        wrong:
          "A pendulum is a special case that has nothing to do with springs.",
        correct:
          "Both are simple harmonic oscillators driven by a linear restoring force. For a pendulum at small angles, gravity provides a restoring torque proportional to the angular displacement, mathematically identical to a spring's F = -kx. The two systems share the same sinusoidal motion and the same energy bookkeeping.",
      },
      {
        wrong:
          "The pendulum is moving slowest at the bottom of the swing.",
        correct:
          "Exactly the reverse. At the highest points of the swing, the bob is momentarily stopped — that's where it turns around. The bottom of the swing is where all gravitational potential energy has converted to kinetic energy, so the bob is moving fastest there.",
      },
      {
        wrong:
          "Pendulums on Earth and on the Moon swing at the same rate as long as the lengths are equal.",
        correct:
          "Period scales like 1/√g. On the Moon (g = 1.6 m/s²), the same pendulum takes about 2.5 times longer per cycle than on Earth. Astronauts on the Apollo missions noticed everything felt slow — pendulums included.",
      },
    ],
    teacherUseCases: [
      "Mass-independence demo: have students predict whether a 5 kg bob and a 0.1 kg bob on the same 1 m string oscillate at the same rate. Run both, time 10 cycles each. Identical periods. Use the surprise to introduce the cancellation of mg in F = ma.",
      "T vs √L plot: collect period at five lengths (0.25, 0.5, 1, 2, 4 m). Plot T² vs L. Students should find a straight line through the origin with slope 4π²/g — and from the slope they can extract Earth's gravity, getting around 9.8 m/s² without ever dropping anything.",
      "Small-angle breakdown: keep length and mass fixed and time 10 cycles at angles of 5°, 15°, 30°, 60°, 90°. The 5° and 15° trials match T = 2π√(L/g). The 60° and 90° trials run measurably long. Use this to introduce the limits of approximation.",
      "Off-Earth missions (Pro): change gravity to 1.6 m/s² (Moon), 3.7 m/s² (Mars), and 24.8 m/s² (Jupiter). Have students predict the new periods using T_new/T_Earth = √(g_Earth/g_new) and verify with the stopwatch.",
      "Misconception probe: at the apex of the swing, ask 'is the bob moving?' A surprising number say yes because it's clearly traveling left or right. The vertical-velocity readout shows it's momentarily at rest, which sets up a discussion of speed vs direction at turning points. Pair with masses-springs-basics to compare which oscillator is mass-independent.",
    ],
    faq: [
      {
        question: "Why doesn't mass matter for pendulum period?",
        answer:
          "Newton's second law says F = ma. Gravity provides a restoring force proportional to mass (mg sin θ along the swing direction), but the inertia resisting motion is also proportional to mass. The two ms cancel, leaving angular acceleration that depends only on g and L. So heavy bobs and light bobs swing at exactly the same rate, which is why Galileo could use a pendulum to argue for universal gravitational acceleration centuries before Newton wrote it down.",
      },
      {
        question: "Why does the small-angle formula fail for large swings?",
        answer:
          "The exact equation of motion is d²θ/dt² = −(g/L) sin(θ). For small θ, sin(θ) ≈ θ in radians, and the equation becomes the simple harmonic oscillator with period T = 2π√(L/g). For large θ, sin(θ) is noticeably less than θ, so the restoring acceleration grows slower than displacement and the bob takes longer to come back. At 60°, the true period is about 7% longer than the formula; at 90° it's about 18% longer.",
      },
      {
        question: "How does this experiment connect to AP Physics 1 standard 5.B.2?",
        answer:
          "AP Physics 1 standard 5.B.2 expects students to use energy conservation to analyze oscillating systems, including identifying where kinetic and gravitational potential energy peak in a pendulum swing. Combined with 3.B.3 (motion under a restoring force), this lab covers both the kinematic side (T = 2π√(L/g)) and the energy side (½mv² + mgh = constant). NGSS HS-PS2-1 also fits — applying Newton's second law to predict the bob's motion under gravity.",
      },
      {
        question: "Why were pendulum clocks so accurate for so long?",
        answer:
          "Three reasons. First, a 1 m pendulum has a 2-second period that's easy to count and gear. Second, mass-independence means slowly accumulating dust on the bob doesn't change the time. Third, amplitude-independence at small angles means the clock keeps the same time even as the driving spring loses tension and the swing shrinks. Christiaan Huygens built the first pendulum clock in 1656 and they remained the most precise timekeepers in the world until quartz oscillators arrived in the 1920s.",
      },
      {
        question: "What's the difference between this lab and the spring labs?",
        answer:
          "Both are simple harmonic oscillators, but the period formulas tell different stories. For a spring, T = 2π√(m/k) — mass matters, spring stiffness matters, gravity does not. For a pendulum, T = 2π√(L/g) — gravity matters, length matters, mass does not. Run masses-springs-basics and pendulum-lab back to back to see this contrast directly: changing the bob mass on the pendulum does nothing, but changing the block mass on the spring changes the period as √m.",
      },
    ],
  },
};
