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
      id: "initialHeight",
      label: "Release Height",
      unit: "m",
      min: 1,
      max: 20,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "mass",
      label: "Object Mass",
      unit: "kg",
      min: 0.5,
      max: 10,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "airResistance",
      label: "Air Resistance",
      unit: "%",
      min: 0,
      max: 50,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "scenario",
      label: "Scenario (0=Drop, 1=Pendulum, 2=Roller Coaster)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "pro",
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
    "Set the initial height and watch the ball drop. The energy bar chart shows PE decreasing and KE increasing as the ball falls. At the bottom, all PE has become KE. Add air resistance to watch total mechanical energy decrease — energy isn't lost, it becomes heat!",

  challenges: [
    {
      id: "ec-ms-c1",
      question: "A 2 kg ball is dropped from 15 m. What is its speed just before hitting the ground? (g=10 m/s²)",
      hint: "All PE converts to KE: mgh = ½mv² → v = √(2gh) = √(2×10×15) = √300 ≈ 17.3 m/s",
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
      hint: "Energy is lost to friction and air resistance at each hill. The coaster cannot gain energy from nothing. If a later hill were higher than the first, the coaster wouldn't have enough energy to clear it — it would stop and roll back.",
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
  contentSections: {
    whatIsIt:
      "Energy conservation is one of the most powerful ideas in all of science: energy is never created or destroyed, only transformed from one form to another. In this simulation you will watch that principle play out across three scenarios — a falling object, a swinging pendulum, and a roller coaster. At the top of each path, an object stores energy in the form of gravitational potential energy (PE), like a stretched rubber band waiting to snap. As it falls or swings downward, that stored energy converts into kinetic energy (KE) — the energy of motion. At the very bottom, all PE has become KE and the object moves fastest. Then, as it rises again, KE converts back to PE. Without friction, this swap repeats forever and the total mechanical energy stays constant. Add air resistance and some energy leaks away as heat — the object rises a little less high each time. This is not energy disappearing; it is mechanical energy transforming into thermal energy. The total energy of the entire system (object plus air) is still conserved. This simulation gives you a bar chart showing PE, KE, and thermal energy at every moment so you can see the transformation happening in real time.",
    parameterExplanations: {
      initialHeight:
        "The height in meters from which the object is released, adjustable from 1 m to 20 m. Greater height means more gravitational potential energy at the start (PE = mgh), which converts to kinetic energy as the object falls. Doubling the height doubles the initial PE and therefore doubles the kinetic energy at the bottom — which makes the object move about 41% faster (since KE depends on v squared).",
      mass:
        "The mass of the falling or swinging object in kilograms, adjustable from 0.5 kg to 10 kg. Heavier objects store more PE at the same height (PE = mgh) and carry more KE at the same speed (KE = 1/2 mv squared). In a gravity-only system with no air resistance, mass cancels out of the speed equation — a 1 kg ball and a 10 kg ball dropped from the same height hit the ground at the same speed. With air resistance or drag, mass can matter because drag force is proportional to area, not mass, so the drag-to-weight ratio differs; with simple sliding friction on a surface, mass usually still cancels.",
      airResistance:
        "The percentage of energy lost to air drag per unit time, adjustable from 0% to 50%. At 0%, the simulation is ideal — total mechanical energy is perfectly conserved and the object bounces or swings to exactly the same height each cycle. Increasing air resistance causes the object to rise a little less each time as mechanical energy converts to heat. At 50%, the object loses energy rapidly and comes to rest much sooner. Thermal energy is inferred from the decrease in mechanical energy — if the simulation's bar chart shows a thermal-energy bar, it equals the mechanical energy lost; otherwise, track the difference between initial and current mechanical energy totals.",
      scenario:
        "Selects which physical scenario the simulation displays (Pro tier). Setting 0 shows a simple free-falling object dropping from the set height. Setting 1 shows a pendulum swinging back and forth — a classic demonstration of PE-KE exchange. Setting 2 shows a roller coaster car moving over hills — allowing students to see why the first hill must always be the tallest. Each scenario illustrates the same conservation law in a different context.",
    },
    misconceptions: [
      {
        wrong: "Friction destroys energy, so energy is not really conserved when friction is present.",
        correct:
          "Friction does not destroy energy — it converts mechanical energy into thermal energy (heat). If you could measure the tiny temperature increase of the object and the air, you would find exactly as much heat energy gained as mechanical energy lost. Total energy (KE + PE + thermal) is always conserved. The Law of Conservation of Energy has no exceptions; perpetual motion machines fail because friction is unavoidable, not because energy disappears.",
      },
      {
        wrong: "A heavier object falls faster and hits the ground with more speed than a lighter one.",
        correct:
          "In the absence of air resistance, all objects fall with the same acceleration (about 10 m/s squared on Earth) regardless of mass. Galileo demonstrated this around 1590. A bowling ball and a tennis ball dropped from the same height reach the ground at the same time and speed. Mass does affect how much force is needed to stop the object (momentum and kinetic energy both depend on mass), but not the speed gained during free fall.",
      },
      {
        wrong: "When a pendulum reaches the bottom of its swing, it has no energy.",
        correct:
          "At the very bottom of the swing, the pendulum has zero potential energy (relative to that lowest point) but maximum kinetic energy. Its total mechanical energy is the same as it was at the top — it has simply converted from stored PE to moving KE. The pendulum has the most energy in a useful form for doing work at the bottom, not least energy.",
      },
      {
        wrong: "A roller coaster can be designed so that a later hill is taller than the first hill.",
        correct:
          "Energy is lost to friction and air resistance at every point of the ride. The coaster can never have more kinetic energy than it started with at the top of the first hill. If a later hill were taller, the coaster would not have enough energy to reach the top and would roll back. This is why the first hill in any coaster is always the tallest — it represents the maximum stored energy in the entire ride.",
      },
    ],
    teacherUseCases: [
      "Mass cancellation demonstration: set airResistance to 0% and initialHeight to 10 m. Run with mass at 1 kg, then at 8 kg. Students observe that the speed at the bottom is the same in both cases, discovering that mass cancels in free-fall — a key insight tied to MS-PS3-1.",
      "Friction as energy transformation: set scenario to 0 (drop) and initialHeight to 15 m. Run with airResistance at 0%, then repeat at 25%. Ask students where the 'lost' mechanical energy went. The bar chart shows thermal energy growing as mechanical energy drops, reinforcing MS-PS3-5 that energy transforms rather than disappears.",
      "Pendulum comparison: switch scenario to 1 (pendulum) with airResistance at 0%. Students predict the maximum height on the other side and confirm it equals the starting height. Then add airResistance at 20% and observe how each swing falls slightly shorter — directly modeling real pendulum behavior and why grandfather clocks need periodic winding.",
      "Roller coaster engineering challenge: set scenario to 2 and airResistance to 10%. Students experiment with initialHeight to find the minimum starting height that allows the coaster to clear a given hill. This frames the conservation law as an engineering constraint, supporting MS-PS3-2 and MS-ETS1 design thinking.",
    ],
    faq: [
      {
        question: "Why does the simulation say energy is conserved even when the ball slows down due to air resistance?",
        answer:
          "When air resistance is active, the simulation tracks three energy types: kinetic energy (KE), potential energy (PE), and thermal energy generated by drag. The mechanical energy (KE + PE) does decrease, but the thermal energy increases by exactly the same amount. The total of all three stays constant. Energy conservation means the universe's total energy never changes — it just moves between different forms. The simulation's energy bar chart shows all three bars so you can verify this yourself.",
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
          "A perpetual motion machine would have to run forever without any energy input. But in every real physical system, some mechanical energy is always converted to thermal energy by friction, air resistance, and other dissipative forces. You cannot get that thermal energy back into useful mechanical energy without doing work (that is the Second Law of Thermodynamics). The simulation with airResistance greater than 0 shows this clearly: the object rises a little less each cycle because energy is steadily leaking away as heat. There is no mechanism to stop that process entirely.",
      },
      {
        question: "Does the height of release affect how fast the object moves at the bottom?",
        answer:
          "Yes, directly. All the gravitational PE at the top converts to KE at the bottom (with no friction). PE = mgh and KE = 1/2 mv squared, so setting them equal gives v = the square root of (2gh). If you double the height, you get about 41% more speed (not twice as much), because speed depends on the square root of height. Tripling the height multiplies speed by roughly 1.73. You can test this in the simulation by changing initialHeight and watching the speed reading at the lowest point.",
      },
    ],
  },
};
