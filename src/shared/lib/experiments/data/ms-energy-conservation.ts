import type { Experiment } from "@/shared/types/experiment";

export const msEnergyConservation: Experiment = {
  id: "ms-energy-conservation",
  slug: "ms-energy-conservation",
  title: "Energy Conservation & Transformation",
  subtitle: "Mechanical energy, heat, and the first law of thermodynamics",
  description:
    "Track energy through a roller coaster, pendulum, and bouncing ball. Watch kinetic and potential energy trade places while total mechanical energy stays constant. Add friction to see energy 'leak' into heat. Discover why perpetual motion is impossible.",
  thumbnail: "/imgs/experiments/ms-energy-conservation.png",

  standards: {
    ngss: ["MS-PS3-1", "MS-PS3-2", "MS-PS3-5"],
    gcse: ["P1.1", "P1.2"],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "6-8",
  tags: ["energy conservation", "kinetic energy", "potential energy", "thermodynamics", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "mass",
      label: "Mass",
      unit: "kg",
      min: 0.5,
      max: 10,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "height",
      label: "Initial Height",
      unit: "m",
      min: 1,
      max: 10,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "friction",
      label: "Friction Level",
      unit: "level",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "E_{mech} = KE + PE = \\frac{1}{2}mv^2 + mgh = \\text{const}",
      description: "Total mechanical energy = kinetic + potential (conserved without friction)",
    },
    {
      latex: "v = \\sqrt{2gh} \\quad \\text{(velocity from height)}",
      description: "Speed at bottom of drop: all PE converted to KE",
    },
  ],

  theory:
    "The Law of Conservation of Energy states that energy cannot be created or destroyed, only transformed from one form to another. In mechanical systems (no friction), kinetic energy (KE = ½mv²) and gravitational potential energy (PE = mgh) continuously convert between each other while their sum stays constant. At the highest point: all PE, no KE. At the lowest point: all KE, no PE. When friction is present, mechanical energy decreases as some converts to thermal energy (heat). The total energy of the universe remains constant — this is the First Law of Thermodynamics (ΔU = Q - W). Perpetual motion machines are impossible because friction always converts some mechanical energy to heat.",

  instructions:
    "Use the Mass, Initial Height, and Friction Level sliders to test how mechanical energy changes. Try the Roller Coaster, Pendulum Swing, and Ball Drop + Bounce presets to compare three energy-transfer setups. Watch the PE, KE, and thermal energy bars as energy shifts form while total energy stays conserved.",

  challenges: [
    {
      id: "ec-ms-c1",
      question: "A 2 kg ball is dropped from 10 m. What is its speed just before hitting the ground? (g=10 m/s²)",
      hint: "All PE converts to KE: mgh = ½mv² → v = √(2gh) = √(2×10×10) = √200 ≈ 14.1 m/s",
      tier: "free",
    },
    {
      id: "ec-ms-c2",
      question: "A pendulum is released from 2 m height. How high does it swing on the other side (no friction)?",
      hint: "Energy is conserved: it rises to exactly 2 m on the other side. PE at start = PE at end. With friction, it swings slightly lower each time.",
      tier: "free",
    },
    {
      id: "ec-ms-c3",
      question: "If a ball loses 40% of its energy to heat when it bounces, from what height will it bounce back if dropped from 5 m?",
      hint: "After bounce: 60% of original energy remains. PE_after = 0.60 × mgh = 0.60 × mg × 5 → h_after = 0.60 × 5 = 3 m.",
      tier: "free",
    },
    {
      id: "ec-ms-c4",
      question: "In a roller coaster, the first hill must be the tallest. Why? What would happen if a later hill were taller?",
      hint: "Energy is lost to friction throughout the ride. The coaster cannot gain energy from nothing. If a later hill were higher than the first, the coaster wouldn't have enough energy to clear it — it would stop and roll back.",
      tier: "pro",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 14,
  relatedExperiments: ["ms-newtons-laws", "k5-energy-conversion", "roller-coaster"],

  seoTitle: "Energy Conservation Middle School | Scivra Interactive Physics",
  seoKeywords: [
    "energy conservation middle school simulation",
    "kinetic potential energy interactive",
    "pendulum energy simulation 6-8",
    "conservation of energy middle school",
    "roller coaster energy physics",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Energy Conservation and Transformation",
  },
  htmlControlAliases: { mass: "sl-mass", height: "sl-h", friction: "sl-fr" },
  presets: [
    {
      id: "coaster",
      label: "Roller Coaster",
      paramValues: { mass: 2, height: 8, friction: 1 },
    },
    {
      id: "pendulum",
      label: "Pendulum Swing",
      paramValues: { mass: 1, height: 3, friction: 0 },
    },
    {
      id: "ball",
      label: "Ball Drop + Bounce",
      paramValues: { mass: 0.5, height: 5, friction: 2 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Energy conservation is one of the most powerful ideas in all of science: energy is never created or destroyed, only transformed from one form to another. In this simulation you will watch that principle play out across three setups — a falling object, a swinging pendulum, and a roller coaster. At the top of each path, an object stores energy in the form of gravitational potential energy (PE), like a stretched rubber band waiting to snap. As it falls or swings downward, that stored energy converts into kinetic energy (KE) — the energy of motion. At the very bottom, all PE has become KE and the object moves fastest. Then, as it rises again, KE converts back to PE. Without friction, this swap repeats forever and the total mechanical energy stays constant. Add friction and some energy leaks away as heat — the object rises a little less high each time. This is not energy disappearing; it is mechanical energy transforming into thermal energy. The total energy of the entire system is still conserved. This simulation gives you a bar chart showing PE, KE, and thermal energy at every moment so you can see the transformation happening in real time.",
    parameterExplanations: {
      mass:
        "Mass changes how much matter is moving, from 0.5 kg to 10 kg. At the same Initial Height, a larger mass starts with more gravitational potential energy because PE = mgh, and it also has more kinetic energy at the same speed because KE = 1/2 mv squared. In an ideal no-friction run, mass does not change the speed reached at the bottom because mass appears in both PE and KE and cancels when solving for speed. This supports MS-PS3-1: students can compare graphs and see that kinetic energy depends on mass and speed, while speed from a given height depends mainly on gravitational energy transfer.",
      height:
        "Initial Height sets how far above the low point the object begins, from 1 m to 10 m. Raising the object stores more gravitational potential energy in the object-Earth system because PE = mgh. As the object falls, swings, or rolls downward, that stored PE transforms into kinetic energy, so a greater height produces a faster motion at the bottom when friction is low. Doubling height doubles the starting PE, but it does not double the speed because KE depends on speed squared. This aligns with MS-PS3-5 by making energy transfer visible: energy moves between potential and kinetic forms instead of appearing from nowhere.",
      friction:
        "Friction Level controls how much mechanical energy is transformed into thermal energy during motion. Level 0 shows the ideal conservation case: PE and KE trade back and forth while total mechanical energy stays constant. Levels 1, 2, and 3 add increasing energy transfer to heat, so the roller coaster, pendulum, or bouncing ball reaches lower heights over time. This does not mean energy is destroyed. The bar chart should show mechanical energy decreasing while thermal energy increases. That distinction is central to MS-PS3-5: when kinetic energy changes, energy is transferred to or from the object and surrounding system. It also helps students argue why real machines cannot keep moving forever without an energy input.",
    },
    misconceptions: [
      {
        wrong: "Friction destroys energy, so energy is not really conserved when friction is present.",
        correct:
          "Friction does not destroy energy — it converts mechanical energy into thermal energy (heat). If you could measure the tiny temperature increase of the object and its surroundings, you would find exactly as much heat energy gained as mechanical energy lost. Total energy (KE + PE + thermal) is always conserved. The Law of Conservation of Energy has no exceptions; perpetual motion machines fail because friction is unavoidable, not because energy disappears.",
      },
      {
        wrong: "A heavier object falls faster and hits the ground with more speed than a lighter one.",
        correct:
          "In the ideal friction-free model, all objects fall with the same acceleration (about 10 m/s squared on Earth) regardless of mass. Galileo demonstrated this around 1590. A bowling ball and a tennis ball dropped from the same height reach the ground at the same time and speed. Mass does affect how much force is needed to stop the object because momentum and kinetic energy both depend on mass, but it does not change the speed gained from the same height in the ideal model.",
      },
      {
        wrong: "When a pendulum reaches the bottom of its swing, it has no energy.",
        correct:
          "At the very bottom of the swing, the pendulum has zero potential energy (relative to that lowest point) but maximum kinetic energy. Its total mechanical energy is the same as it was at the top — it has simply converted from stored PE to moving KE. The pendulum has the most energy in a useful form for doing work at the bottom, not least energy.",
      },
      {
        wrong: "A roller coaster can be designed so that a later hill is taller than the first hill.",
        correct:
          "Energy is lost to friction at every point of the ride. The coaster can never have more kinetic energy than it started with at the top of the first hill. If a later hill were taller, the coaster would not have enough energy to reach the top and would roll back. This is why the first hill in any coaster is always the tallest — it represents the maximum stored energy in the entire ride.",
      },
    ],
    teacherUseCases: [
      "Mass comparison for MS-PS3-1: set Friction Level to 0 and Initial Height to 5 m. Run the Ball Drop + Bounce preset, then change only Mass from 0.5 kg to 8 kg. Students compare speed and kinetic-energy bars to see that speed is unchanged while KE increases with mass.",
      "Height investigation for MS-PS3-5: keep Mass constant and Friction Level at 0, then move Initial Height from 2 m to 8 m. Students record how PE at the start and KE at the bottom change, using the bar chart as evidence that energy transforms between stored and motion forms.",
      "Friction as energy transfer: use the Pendulum Swing preset, then test Friction Level 0, 1, 2, and 3. Students track how the peak height decreases while the thermal-energy bar grows, supporting the claim that mechanical energy is transferred to heat rather than destroyed.",
      "Preset comparison discussion: assign groups Roller Coaster, Pendulum Swing, and Ball Drop + Bounce. Each group identifies where PE is highest, where KE is highest, and when thermal energy appears, then connects the pattern to MS-PS3-1 and MS-PS3-5.",
      "Engineering constraint challenge: start with the Roller Coaster preset and ask students to adjust only Initial Height and Friction Level to make the coaster clear the track. Students justify their design with evidence from energy bars and explain why adding friction requires more starting PE.",
    ],
    faq: [
      {
        question: "Why does the simulation say energy is conserved even when the object slows down due to friction?",
        answer:
          "When friction is active, the simulation tracks three energy types: kinetic energy (KE), potential energy (PE), and thermal energy generated by friction. The mechanical energy (KE + PE) does decrease, but the thermal energy increases by the same amount. The total of all three stays constant. Energy conservation means the universe's total energy never changes — it just moves between different forms. The simulation's energy bar chart shows all three bars so you can verify this yourself.",
      },
      {
        question: "What is the difference between kinetic energy and potential energy?",
        answer:
          "Kinetic energy is energy that an object has because of its motion — a moving ball, a spinning wheel, a flowing river. The faster it moves and the heavier it is, the more KE it carries (KE = 1/2 mv squared). Potential energy is stored energy due to position or configuration — a ball held high up, a compressed spring, a stretched rubber band. Gravitational PE equals mass times gravitational acceleration times height (mgh). The two forms constantly swap in mechanical systems: PE becomes KE as objects fall or speed up, and KE becomes PE as they rise or slow down.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation targets MS-PS3-1 (construct and interpret graphical displays of data to describe the relationships of kinetic energy to the mass of an object and to the speed of an object), MS-PS3-2 (develop a model to describe that when the arrangement of objects interacting at a distance changes, different amounts of potential energy are stored), and MS-PS3-5 (construct, use, and present arguments to support the claim that when the kinetic energy of an object changes, energy is transferred to or from the object). The energy bar chart directly supports all three practices.",
      },
      {
        question: "Why can't we build a perpetual motion machine?",
        answer:
          "A perpetual motion machine would have to run forever without any energy input. But in every real physical system, some mechanical energy is always converted to thermal energy by friction and other dissipative forces. You cannot get that thermal energy back into useful mechanical energy without doing work (that is the Second Law of Thermodynamics). The simulation with Friction Level greater than 0 shows this clearly: the object rises a little less each cycle because energy is steadily transferred into heat. There is no mechanism to stop that process entirely.",
      },
      {
        question: "Does Initial Height affect how fast the object moves at the bottom?",
        answer:
          "Yes, directly. All the gravitational PE at the top converts to KE at the bottom when Friction Level is 0. PE = mgh and KE = 1/2 mv squared, so setting them equal gives v = the square root of (2gh). If you double the height, you get about 41% more speed (not twice as much), because speed depends on the square root of height. Tripling the height multiplies speed by roughly 1.73. You can test this by changing only the Initial Height slider and watching the speed reading at the lowest point.",
      },
      {
        question: "How should I use the Roller Coaster, Pendulum Swing, and Ball Drop + Bounce presets?",
        answer:
          "Use the presets as three quick comparison cases before changing sliders one at a time. Roller Coaster sets a taller height with low friction so students can see PE turn into KE along a track. Pendulum Swing uses a smaller mass, lower height, and no friction to show repeated PE-KE exchange. Ball Drop + Bounce uses low mass and medium friction so students can see each bounce return to a lower height as thermal energy grows. After choosing a preset, change only Mass, Initial Height, or Friction Level to identify which control caused the observed energy change.",
      },
    ],
  },
};
