import type { Experiment } from "@/shared/types/experiment";

export const balancingAct: Experiment = {
  id: "balancing-act",
  slug: "balancing-act-torque",
  title: "Balancing Act",
  subtitle: "Discover torque and rotational equilibrium",
  description:
    "Place masses on a balance beam and discover what it takes to maintain equilibrium. Explore torque, the law of moments, and center of mass in an interactive setting.",
  thumbnail: "/imgs/experiments/newton-laws.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P5.4"],
    ap: ["3.F.1", "3.F.2"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["torque", "equilibrium", "center of mass", "moments", "rotational balance"],
  difficulty: "beginner",

  parameters: [
    { id: "mass1", label: "Mass 1", unit: "kg", min: 0.1, max: 10, default: 1, step: 0.1, tier: "free" },
    { id: "pos1", label: "Position 1", unit: "m", min: -3, max: -0.1, default: -2, step: 0.1, tier: "free" },
    { id: "mass2", label: "Mass 2", unit: "kg", min: 0.1, max: 10, default: 2, step: 0.1, tier: "free" },
    { id: "pos2", label: "Position 2", unit: "m", min: 0.1, max: 3, default: 1, step: 0.1, tier: "free" },
    { id: "mass3", label: "Mass 3", unit: "kg", min: 0.1, max: 10, default: 1, step: 0.1, tier: "pro" },
  ],

  formulas: [
    { latex: "\\tau = r \\times F", description: "Torque" },
    { latex: "\\sum \\tau = 0", description: "Rotational equilibrium condition" },
    { latex: "\\tau = m \\cdot g \\cdot d", description: "Torque from weight" },
  ],

  theory:
    "An object is in rotational equilibrium when the net torque about any pivot point is zero. Torque is the product of force and the perpendicular distance from the pivot (lever arm). The law of moments states that clockwise torques must equal counterclockwise torques for balance. This principle underlies levers, seesaws, and structural engineering.",
  instructions:
    "Drag masses onto the balance beam. The beam tilts when torques are unequal. Balance by adjusting mass values or positions. Use the ruler to measure lever arm distances.",
  challenges: [
    { id: "ba-c1", question: "Place a 2kg mass at 1m left. Where must a 4kg mass go to balance?", hint: "Use τ = mgd: 2×1 = 4×d", tier: "free" },
    { id: "ba-c2", question: "Can two equal masses at equal distances ever be unbalanced?", hint: "Think about what torque = r × F means when r and F are equal", tier: "free" },
    { id: "ba-c3", question: "Where is the center of mass of three unequal masses?", hint: "x_cm = Σ(m_i × x_i) / Σm_i", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["rotational-motion", "forces-motion-basics"],

  seoTitle: "Balancing Act — Torque and Equilibrium Simulation | AP Physics 1",
  seoKeywords: ["torque", "equilibrium", "balance", "center of mass", "AP Physics 1", "rotational mechanics"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Torque, Rotational Equilibrium" },

  contentSections: {
    whatIsIt:
      "A seesaw with a kindergartener on one end and a grown adult on the other only stays level if the adult scoots toward the middle — closer to the pivot. That trick is the law of moments at work. Torque is what a force does about a pivot, and it depends on two things: how hard you push and how far that push acts from the pivot. Push close in and the beam barely turns; push out at the end and even a small force can flip the whole thing. Engineers use this when they design wrenches, cranes, and bridges; gymnasts use it on the beam without ever calling it that. In this lab you place masses at chosen positions on a beam and find the configurations where every torque about the pivot cancels out and the beam holds level.",
    parameterExplanations: {
      mass1:
        "The first mass placed on the left side of the beam, in kilograms. Heavier values create more downward weight (W = m·g), which means more counterclockwise torque about the pivot for a fixed lever arm. A typical textbook hanger mass is 0.5–2 kg.",
      pos1:
        "How far Mass 1 sits from the pivot, measured to the left in meters (negative values). Moving it farther out increases the lever arm, so the torque grows in proportion — a 1 kg block at 2 m produces twice the torque of the same block at 1 m.",
      mass2:
        "The second mass on the right side of the beam, in kilograms. It produces a clockwise torque that has to balance the counterclockwise torque from Mass 1 if you want the beam level. Real classroom slotted masses are usually 0.1–1 kg.",
      pos2:
        "How far Mass 2 sits from the pivot, measured to the right in meters (positive values). Pair this with Mass 2 to satisfy m1·|pos1| = m2·|pos2|; small position changes have visible effects because torque scales linearly with distance.",
      mass3:
        "An optional third mass for advanced configurations, in kilograms. Adding it lets you explore systems with more than two torques, where the law of moments still holds but you must sum every clockwise contribution and every counterclockwise contribution separately.",
    },
    misconceptions: [
      {
        wrong:
          "If both sides have the same mass, the beam is balanced no matter where you put them.",
        correct:
          "Torque is force times perpendicular distance from the pivot: τ = rF. In this lab the force is each weight mg, so equal masses balance only when their distances to the pivot are equal — slide one out farther and that side wins.",
      },
      {
        wrong:
          "Heavier objects always tip the beam, even if they are right next to the pivot.",
        correct:
          "A mass sitting directly over the pivot has zero lever arm, so it contributes zero torque no matter how heavy it is. Only the perpendicular distance to the pivot matters for tipping.",
      },
      {
        wrong:
          "Torque and force are basically the same thing measured in different units.",
        correct:
          "Force is a push or pull (newtons). Torque is a force's twisting effect about a pivot (newton-meters). The same force can produce huge torque or none at all depending on where it acts.",
      },
      {
        wrong:
          "When the beam is level, no forces are acting on the masses or the pivot.",
        correct:
          "Plenty of forces act — gravity pulls every mass down, the pivot pushes up. Equilibrium means the forces and torques add to zero, not that they vanish.",
      },
    ],
    teacherUseCases: [
      "Lab notebook task: have students record beam tilt, mass values, and positions for at least six configurations and plot mass1·|pos1| against mass2·|pos2| to confirm the line passes through the origin with slope 1.",
      "Predict-then-test: ask students to predict where a 4 kg block must sit on the right to balance a 2 kg block placed at -2 m. Have them pause before sliding the block and commit to a number.",
      "Center-of-mass extension: with the Pro third mass enabled, measure x_cm for three different mass distributions and compare with the formula Σ(m_i·x_i)/Σm_i.",
      "Misconception probe: place equal masses at unequal distances and ask which side will go down before showing the tilt. Students who say 'they're equal so it stays level' surface a torque misconception you can address directly.",
      "Engineering tie-in: discuss why a long wrench loosens a stuck bolt better than a short one, then have students reproduce the effect by changing only Position 1 while keeping Mass 1 fixed.",
    ],
    faq: [
      {
        question: "Why does moving a mass farther from the pivot make the beam tip more?",
        answer:
          "Torque equals force times the perpendicular distance from the pivot, so doubling the distance doubles the torque even if the mass is unchanged. The lever arm acts as a multiplier on whatever force you already had — that's why long wrenches and crowbars are so effective with modest hand force.",
      },
      {
        question: "Does the mass of the beam itself matter for balance?",
        answer:
          "If the beam is uniform and the pivot is at its center, the beam's own weight produces equal torques on both sides and cancels itself out. If the pivot is off-center or the beam is loaded unevenly, the beam's weight contributes a real torque that has to be added to the sum.",
      },
      {
        question: "What happens if I put a mass right above the pivot?",
        answer:
          "Its lever arm is zero, so its torque about the pivot is zero. The mass still adds to the downward force the pivot must support, but it does not push the beam toward either side. This is why kids on a seesaw scoot inward when they're losing — they shrink their lever arm.",
      },
      {
        question: "How does this experiment connect to AP Physics 1?",
        answer:
          "AP Physics 1 standard 3.F.1 expects students to calculate torques about a chosen pivot and apply the rotational equilibrium condition Στ = 0. This lab is the cleanest visualization of that condition — every balanced configuration you find is a worked example of 3.F.1, and the third-mass extension previews multi-torque problems on the AP exam.",
      },
      {
        question: "Why does a small kid balance a big adult on a seesaw if she sits at the very end?",
        answer:
          "The kid trades distance for mass. If the adult is three times heavier, the kid needs to sit roughly three times farther from the pivot so that mass·distance is equal on both sides. The seesaw doesn't care which factor is larger, only that the products match.",
      },
    ],
  },
};
