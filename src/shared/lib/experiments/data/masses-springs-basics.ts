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
    { id: "springConstant", label: "Spring Constant", unit: "N/m", min: 1, max: 200, default: 40, step: 1, tier: "free" },
    { id: "mass", label: "Mass", unit: "kg", min: 0.1, max: 10, default: 1, step: 0.1, tier: "free" },
    { id: "initialDisplacement", label: "Initial Displacement", unit: "m", min: -1, max: 1, default: 0.4, step: 0.02, tier: "free" },
    { id: "gravity", label: "Gravity", unit: "m/s²", min: 1.6, max: 25, default: 9.8, step: 0.1, tier: "free" },
  ],

  formulas: [
    { latex: "T = 2\\pi\\sqrt{\\frac{m}{k}}", description: "Period of oscillation" },
    { latex: "F_{spring} = -kx", description: "Restoring force (Hooke's Law)" },
  ],

  theory:
    "A spring exerts a restoring force proportional to its displacement (Hooke's Law). This causes the mass to oscillate back and forth — simple harmonic motion. The period depends only on mass and spring constant, not on amplitude or gravity direction. This is one of the most fundamental forms of oscillatory motion in physics.",
  instructions:
    "Use the Spring Constant, Mass, Initial Displacement, and Gravity sliders to change the oscillator, then compare the Earth Default, Moon Gravity, Stiff Spring, and Heavy Mass presets. Watch the measured period, equilibrium line, velocity, and energy readouts as you isolate which controls change timing and which only shift the motion's size or center.",
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
  htmlControlAliases: { springConstant: "sl-k", mass: "sl-m", initialDisplacement: "sl-x0", gravity: "sl-g" },
  presets: [
    {
      id: "earth",
      label: "Earth Default",
      description:
        "Standard classroom setup with k = 40 N/m, m = 1.0 kg, initial displacement = 0.40 m, and Earth gravity at 9.8 m/s².",
      paramValues: { springConstant: 40, mass: 1.0, initialDisplacement: 0.4, gravity: 9.8 },
    },
    {
      id: "moon",
      label: "Moon Gravity",
      description:
        "Keeps the same spring, mass, and starting displacement as Earth Default while lowering gravity to 1.62 m/s² so students can test whether g changes the period.",
      paramValues: { springConstant: 40, mass: 1.0, initialDisplacement: 0.4, gravity: 1.62 },
    },
    {
      id: "stiff",
      label: "Stiff Spring",
      description:
        "Raises the spring constant to 150 N/m with a smaller 0.20 m initial displacement, making the bounce faster and easier to compare against Earth Default.",
      paramValues: { springConstant: 150, mass: 1.0, initialDisplacement: 0.2, gravity: 9.8 },
    },
    {
      id: "heavy",
      label: "Heavy Mass",
      description:
        "Increases the mass to 5.0 kg while keeping k = 40 N/m and Earth gravity, showing how inertia slows the spring's oscillation.",
      paramValues: { springConstant: 40, mass: 5.0, initialDisplacement: 0.4, gravity: 9.8 },
    },
  ],

  contentSections: {
    whatIsIt:
      "Hang a backpack on a bungee cord and let it bob, watch a pogo stick spring after a kid lands on it, or squeeze the suspension on a mountain bike and let it pop back — each one is a mass tugging on a spring that pulls it back. This introductory lab keeps that picture as clean as possible: an ideal spring, a single mass on the end, no air resistance, no driving force, no damping. Drag the mass down, release, and the system traces out a perfect sinusoidal bounce that just keeps going. Two sliders, mass and spring constant, are all that change the rhythm. Time the period with the stopwatch, swap the mass, swap the spring, and watch how the timing shifts. The goal is to feel the relationship T = 2π√(m/k) before any algebra hits the page, then verify it numerically with a few measurements.",
    parameterExplanations: {
      springConstant:
        "Spring Constant controls k, the stiffness of the spring, in newtons per meter. A larger k means the spring pulls back harder for each meter of stretch or compression, so the mass reverses direction sooner and completes each cycle faster. In the period formula T = 2π√(m/k), k sits in the denominator: quadrupling k cuts the period in half when mass stays fixed. Use the Stiff Spring preset, then return to Earth Default and move only this slider to see how a sharper restoring force changes period, peak speed, and elastic potential energy.",
      mass:
        "Mass controls m, the amount of inertia hanging from the spring. A heavier mass is pulled by the same spring force at a lower acceleration, so it takes longer to speed up, slow down, and turn around. The period formula T = 2π√(m/k) shows the square-root relationship: making the mass four times larger doubles the period, not quadruples it. Try the Heavy Mass preset and compare it with Earth Default while leaving spring constant and initial displacement alone. The equilibrium point shifts because weight changes, but the timing change comes from inertia.",
      initialDisplacement:
        "Initial Displacement sets how far the mass starts from equilibrium when the simulation resets, in meters. Positive and negative values launch the motion on opposite sides of the resting point, and larger magnitudes create a wider bounce with more stored spring energy. For an ideal Hooke's-law spring, this should not change the period: a larger pull gives the mass farther to travel, but also a stronger restoring force and higher peak speed. Move only this slider after choosing Earth Default to test amplitude independence and connect turn-around points, maximum speed, and energy exchange.",
      gravity:
        "Gravity controls g, the gravitational field strength used in the vertical spring setup. Increasing gravity pulls the hanging mass to a lower equilibrium position, while Moon gravity raises that equilibrium closer to the unstretched spring length. For oscillations measured around the new equilibrium, gravity does not appear in T = 2π√(m/k), so the period should stay the same when mass and spring constant stay fixed. Use Earth Default and Moon Gravity as a direct comparison: the center of the bounce shifts, but the measured cycle time remains governed by m and k.",
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
          "Heavier mass means slower oscillation when the spring constant stays fixed. Gravity does pull harder on the heavier object, but in a vertical spring that extra weight mainly lowers the equilibrium position. Once the mass is bouncing around that new center, the period is T = 2π√(m/k) and grows with mass.",
      },
      {
        wrong:
          "The mass is moving fastest when the spring is at full stretch.",
        correct:
          "At full stretch the mass is momentarily stopped — that's the turn-around point. Maximum speed happens at the equilibrium position in the middle, where all the stored elastic energy has converted into kinetic energy.",
      },
      {
        wrong:
          "Changing the Gravity slider should change the measured period.",
        correct:
          "The period formula has no g in it. Gravity chooses where the new equilibrium line sits, but motion around that equilibrium still follows T = 2π√(m/k). Use Earth Default and Moon Gravity to compare: the center of the bounce moves, but the cycle time stays the same when m and k are unchanged.",
      },
    ],
    teacherUseCases: [
      "Preset comparison opener: have students run Earth Default, Moon Gravity, Stiff Spring, and Heavy Mass before touching sliders. They record measured period, equilibrium position, and one visible difference for each case, then identify which presets changed m, k, x0, or g.",
      "Amplitude-independence demo: keep Spring Constant, Mass, and Gravity fixed while pairs test Initial Displacement values such as 0.10 m, 0.40 m, and 0.80 m. Students should see the bounce size change while measured period stays essentially constant.",
      "Quick √m relationship plot: hold Spring Constant at 40 N/m and Gravity at 9.8 m/s², then collect period at five masses across the slider range. Plot T² vs m on graph paper or a spreadsheet; students should get a straight line with slope 4π²/k.",
      "Gravity misconception probe: ask whether Moon Gravity should make the spring slower, then compare Earth Default and Moon Gravity. Students explain why the equilibrium line moves while the measured period remains controlled by mass and spring constant.",
      "Energy and speed check: use the velocity and energy readouts while changing only Initial Displacement. Students identify where speed is greatest, where spring potential energy is greatest, and why larger amplitude does not imply a longer cycle.",
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
          "Yes. AP Physics 1 standard 3.B.3 asks students to predict the motion of an object subject to a restoring force proportional to displacement. This basics lab isolates Hooke's Law (F = -kx) and the resulting simple harmonic motion with no damping, no driving force, and no friction. The four sliders let students separate the variables that change period, mass and spring constant, from variables that change amplitude or equilibrium position. NGSS HS-PS2-1 also fits because students apply Newton's second law to predict the block's motion under the spring force.",
      },
      {
        question: "What's a real-world example of this physics?",
        answer:
          "Car suspensions are the classic one. Each shock absorber is a spring carrying a fraction of the car's weight, and the bounce frequency you feel after a pothole is set by how stiff the spring is and how much weight sits on it. Stiff sport-car springs and a low car body give a fast bounce; soft springs on a heavy SUV give a slow, lazy bounce. Trampolines, mattress foam, the diving board at a pool, and the springs inside a retractable pen all follow the same T = 2π√(m/k) story.",
      },
      {
        question: "Why does this lab not include damping or a driving force?",
        answer:
          "Pedagogical isolation. Damping pulls energy out and shifts the frequency slightly; a driving force introduces resonance and steady-state amplitude. Both are interesting physics, but they make it harder to see the simplest result: mass and spring constant set the period, while initial displacement changes amplitude and gravity shifts the vertical equilibrium. Once students have nailed that here, the advanced masses-and-springs lab can add damping and a tunable driver so those effects can be studied one at a time.",
      },
    ],
  },
};
