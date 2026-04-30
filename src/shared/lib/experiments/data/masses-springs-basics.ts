import type { Experiment } from "@/shared/types/experiment";

export const massesSpringsBasics: Experiment = {
  id: "masses-springs-basics",
  slug: "masses-springs-basics",
  title: "Masses and Springs: Basics",
  subtitle: "Introductory spring oscillation — no damping or driving",
  description:
    "A simplified spring-mass simulation for beginners. Hang masses, observe bouncing, and measure period. Perfect for first introduction to oscillatory motion before exploring the advanced lab.",
  thumbnail: "/imgs/experiments/simple-harmonic-motion.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P6.2"],
    ap: ["3.B.3"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["spring", "oscillation", "mass", "period", "SHM basics"],
  difficulty: "beginner",

  parameters: [
    { id: "mass", label: "Mass", unit: "kg", min: 0.1, max: 3, default: 1, step: 0.1, tier: "free" },
    { id: "spring_constant", label: "Spring Constant", unit: "N/m", min: 10, max: 100, default: 40, step: 5, tier: "free" },
  ],

  formulas: [
    { latex: "T = 2\\pi\\sqrt{\\frac{m}{k}}", description: "Period of oscillation" },
    { latex: "F_{spring} = -kx", description: "Restoring force (Hooke's Law)" },
  ],

  theory:
    "A spring exerts a restoring force proportional to its displacement (Hooke's Law). This causes the mass to oscillate back and forth — simple harmonic motion. The period depends only on mass and spring constant, not on amplitude or gravity direction. This is one of the most fundamental forms of oscillatory motion in physics.",
  instructions:
    "Select a mass from the shelf and hang it on the spring. Pull the mass down and release it. Use the stopwatch to measure the period. Try different masses and spring constants to verify the period formula.",
  challenges: [
    { id: "msb-c1", question: "A 0.5kg mass on a spring (k=50 N/m). What is the period?", hint: "T = 2π√(0.5/50) = 2π√(0.01) ≈ 0.628 s", tier: "free" },
    { id: "msb-c2", question: "Does the period change if you double the initial stretch amplitude?", hint: "No — for ideal springs, period is independent of amplitude", tier: "free" },
    { id: "msb-c3", question: "What would happen to the period on the Moon (g = 1.6 m/s²)?", hint: "T = 2π√(m/k) — it doesn't depend on g at all!", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 12,
  relatedExperiments: ["masses-springs", "hookes-law", "simple-harmonic-motion"],

  seoTitle: "Masses and Springs Basics | Spring Oscillation Intro | Physics Lab",
  seoKeywords: ["masses springs basics", "spring oscillation", "SHM intro", "period mass spring"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Spring Oscillation, Simple Harmonic Motion" },

  contentSections: {
    whatIsIt:
      "Hang a backpack on a bungee cord and let it bob, watch a pogo stick spring after a kid lands on it, or squeeze the suspension on a mountain bike and let it pop back — each one is a mass tugging on a spring that pulls it back. This introductory lab keeps that picture as clean as possible: an ideal spring, a single mass on the end, no air resistance, no driving force, no damping. Drag the mass down, release, and the system traces out a perfect sinusoidal bounce that just keeps going. Two sliders, mass and spring constant, are all that change the rhythm. Time the period with the stopwatch, swap the mass, swap the spring, and watch how the timing shifts. The goal is to feel the relationship T = 2π√(m/k) before any algebra hits the page, then verify it numerically with a few measurements.",
    parameterExplanations: {
      mass:
        "The block's mass in kilograms. Inertia means heavier blocks resist acceleration more, so the same spring takes longer to whip them back and forth. Period grows like √m — quadrupling mass doubles the period.",
      spring_constant:
        "How stiff the spring is, measured in newtons per meter. A stiffer spring (larger k) yanks harder for the same stretch, so the mass turns around faster and the period shrinks like 1/√k. Soft springs feel lazy; stiff ones feel snappy.",
    },
    misconceptions: [
      {
        wrong:
          "If I pull the spring down farther before releasing it, the bounce takes longer.",
        correct:
          "It does not. Pulling farther means the block reaches a higher maximum speed and travels a longer distance, but those two effects cancel exactly. Period is independent of amplitude for an ideal spring — that's the headline of simple harmonic motion.",
      },
      {
        wrong:
          "A heavier mass bounces faster because gravity pulls it harder.",
        correct:
          "Heavier mass means slower oscillation. Gravity does pull harder, but it just sets a new resting position. Once the block is bouncing around that resting position, the period is T = 2π√(m/k) and grows with mass.",
      },
      {
        wrong:
          "The mass is moving fastest when the spring is at full stretch.",
        correct:
          "At full stretch the mass is momentarily stopped — that's the turn-around point. Maximum speed happens at the equilibrium position in the middle, where all the stored elastic energy has converted into kinetic energy.",
      },
      {
        wrong:
          "Spring oscillation needs gravity, so on the Moon it would slow down.",
        correct:
          "The period formula has no g in it. Gravity only chooses where the new equilibrium is. A horizontal spring on a frictionless table oscillates with exactly the same T = 2π√(m/k), and on the Moon the same vertical setup oscillates at the same rate.",
      },
    ],
    teacherUseCases: [
      "First-day discovery: ask students to predict whether a heavier mass bounces faster or slower before they touch the simulation. Show a quick poll, then have them run three masses and a stopwatch to settle it. The contrast between intuition and data is the lesson.",
      "Amplitude-independence demo: have one partner pull the spring down 5 cm and time 10 cycles, the other partner pull it down 25 cm and time 10 cycles. Same period. This is the hardest result for students to accept on first contact.",
      "Quick √m relationship plot: collect period at five masses (0.5, 1, 2, 3, 4 kg) at fixed k. Plot T² vs m on graph paper or a spreadsheet. Students should get a straight line through the origin with slope 4π²/k.",
      "Misconception probe — ask 'where in the cycle is the mass moving fastest?' before running the lab. Most beginners point to the bottom of the bounce. Use the simulation's velocity vector to overturn the wrong answer with visual evidence.",
      "Bridge to the next lab: once students are comfortable here, run masses-springs-oscillation to add damping and driving force, or jump to pendulum-lab to test whether the same mass-independence story holds for swinging pendulums.",
    ],
    faq: [
      {
        question: "Why doesn't the period depend on how far I pull the spring?",
        answer:
          "Because the restoring force is proportional to displacement (F = -kx). When you pull farther, you both increase the distance the mass has to travel and increase the force pulling it back. The two effects scale the same way and exactly cancel out in the equations of motion. The result is that for any starting amplitude, one full cycle takes the identical time T = 2π√(m/k). That linear restoring force is the defining property of simple harmonic motion.",
      },
      {
        question: "Why does a heavier mass oscillate more slowly?",
        answer:
          "Newton's second law says F = ma, so the same spring force produces less acceleration when the mass is bigger. Less acceleration means the block takes longer to speed up, longer to slow down, and longer to reverse — every leg of the cycle stretches by a factor of √m. Doubling the mass multiplies the period by √2 ≈ 1.41. It's the same reason a loaded truck takes longer to swerve than a sports car.",
      },
      {
        question: "Does this experiment satisfy AP Physics 1 standard 3.B.3?",
        answer:
          "Yes. AP Physics 1 standard 3.B.3 asks students to predict the motion of an object subject to a restoring force proportional to displacement. This basics lab is the cleanest possible setup for that standard: it isolates Hooke's Law (F = -kx) and the resulting simple harmonic motion with no damping, no driving force, no friction. NGSS HS-PS2-1 also fits — students apply Newton's second law to predict the motion of the block under the spring force.",
      },
      {
        question: "What's a real-world example of this physics?",
        answer:
          "Car suspensions are the classic one. Each shock absorber is a spring carrying a fraction of the car's weight, and the bounce frequency you feel after a pothole is set by how stiff the spring is and how much weight sits on it. Stiff sport-car springs and a low car body give a fast bounce; soft springs on a heavy SUV give a slow, lazy bounce. Trampolines, mattress foam, the diving board at a pool, and the springs inside a retractable pen all follow the same T = 2π√(m/k) story.",
      },
      {
        question: "Why does this lab not include damping or a driving force?",
        answer:
          "Pedagogical isolation. Damping pulls energy out and shifts the frequency slightly; a driving force introduces resonance and steady-state amplitude. Both are interesting physics, but they make it harder to see the simplest result — that mass and spring constant alone set the period. Once you've nailed that here, the masses-springs-oscillation lab adds damping and a tunable driver so you can study them one at a time.",
      },
    ],
  },
};
