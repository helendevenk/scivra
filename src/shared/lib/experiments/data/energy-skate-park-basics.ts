import type { Experiment } from "@/shared/types/experiment";

export const energySkateParkBasics: Experiment = {
  id: "energy-skate-park-basics",
  slug: "energy-skate-park-conservation",
  title: "Energy Skate Park: Basics",
  subtitle: "Explore energy conservation on a skate ramp",
  description:
    "Watch a skater ride a customizable ramp and observe energy transforming between kinetic and potential forms. Track energy bars in real time to verify conservation of mechanical energy.",
  thumbnail: "/imgs/experiments/energy-conservation.png",

  standards: {
    ngss: ["HS-PS3-1", "HS-PS3-2"],
    gcse: ["AQA P4.5", "AQA P4.6"],
    ap: ["5.B.3", "5.B.4", "5.B.5"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["energy conservation", "kinetic energy", "potential energy", "skate park", "mechanical energy"],
  difficulty: "beginner",

  parameters: [
    { id: "mass", label: "Skater Mass", unit: "kg", min: 10, max: 100, default: 60, step: 5, tier: "free" },
    { id: "start_height", label: "Starting Height", unit: "m", min: 0.5, max: 10, default: 4, step: 0.5, tier: "free" },
    { id: "friction", label: "Friction", unit: "", min: 0, max: 1, default: 0, step: 0.01, tier: "free" },
  ],

  formulas: [
    { latex: "E_{mech} = KE + PE = \\frac{1}{2}mv^2 + mgh", description: "Mechanical energy" },
    { latex: "E_{mech} = \\text{const}", description: "Conservation of energy (no friction)" },
    { latex: "v = \\sqrt{2gh}", description: "Speed at bottom from height h" },
  ],

  theory:
    "Mechanical energy is the sum of kinetic energy (KE = ½mv²) and gravitational potential energy (PE = mgh). When friction is absent, total mechanical energy is conserved — it converts between KE and PE but never disappears. Adding friction introduces thermal energy: total energy (KE + PE + thermal) is always conserved, but mechanical energy decreases. The skater slows down as energy transfers to heat.",
  instructions:
    "Place the skater on the ramp and press play. Watch the energy bars as the skater rises and falls. Enable friction to see energy converted to thermal energy. Try different ramp shapes — energy conservation holds for any shape.",
  challenges: [
    { id: "esp-c1", question: "A 60kg skater starts from 5m height. What is their speed at the bottom?", hint: "v = √(2gh) = √(2 × 9.8 × 5)", tier: "free" },
    { id: "esp-c2", question: "With friction enabled, can the skater reach the same height on the other side?", hint: "Friction converts some mechanical energy to thermal energy", tier: "free" },
    { id: "esp-c3", question: "How does mass affect the maximum speed at the bottom of the ramp?", hint: "v = √(2gh) — mass cancels out!", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["roller-coaster", "work-energy-theorem", "pendulum-lab"],

  seoTitle: "Energy Skate Park — Conservation of Energy | AP Physics 1 Simulation",
  seoKeywords: ["energy conservation", "kinetic energy", "potential energy", "skate park", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Conservation of Energy, Kinetic Energy, Potential Energy" },

  contentSections: {
    whatIsIt:
      "Drop a skater onto a curved ramp and let go. As she dives toward the bottom, the height she had at the top quietly turns into the speed she has at the bottom — same total energy, just dressed in different clothes. Climb back up the other side and the trade reverses: speed bleeds away as height returns. That's mechanical energy conservation in one sentence: in a frictionless world, kinetic energy plus gravitational potential energy stays constant from frame to frame, no matter how loopy the track gets. Add a little friction and the skater starts losing altitude every cycle as some of that mechanical energy escapes as heat. Adjust the mass, the starting height, and the friction in this lab and watch the energy bars track every joule.",
    parameterExplanations: {
      mass:
        "The mass of the skater in kilograms. Heavier skaters carry more kinetic energy at the same speed and more potential energy at the same height, but here's the twist — speed at the bottom of a frictionless ramp is independent of mass, because mass cancels out in mgh = ½mv².",
      start_height:
        "The vertical height where the skater is released, measured from the lowest point of the track. Doubling the starting height doubles the gravitational PE, which means roughly 1.41× the speed at the bottom (since v = √(2gh)).",
      friction:
        "A dimensionless friction coefficient between the skater's wheels and the track. At zero, mechanical energy is perfectly conserved and the skater returns to the original height every cycle. Crank it up and the skater loses altitude each pass as KE + PE leaks away into thermal energy.",
    },
    misconceptions: [
      {
        wrong:
          "When the skater is at the top of the ramp, she has no energy because she isn't moving.",
        correct:
          "She has the maximum gravitational potential energy, which is why she speeds up on the way down. Energy includes both motion and position — at the top, all of it is stored as PE waiting to convert.",
      },
      {
        wrong:
          "A heavier skater will reach the bottom of a frictionless ramp moving faster than a lighter one dropped from the same height.",
        correct:
          "They arrive at the same speed. Setting mgh = ½mv² and solving gives v = √(2gh) — the m cancels. Mass changes how much energy is involved, not how fast the skater ends up moving.",
      },
      {
        wrong:
          "With friction on, energy is destroyed — that's why the skater slows down.",
        correct:
          "Energy is never destroyed. Friction converts mechanical energy into thermal energy in the track and the wheels. Total energy (KE + PE + thermal) is always conserved; only the mechanical part shrinks.",
      },
      {
        wrong:
          "A taller, steeper ramp gives a faster bottom speed than a shorter, gentler ramp from the same height.",
        correct:
          "Bottom speed depends only on the height difference, not the path. Whether the ramp is a straight slide or a wavy track, v = √(2gh) holds in the absence of friction. Path shape changes how long it takes, not how fast.",
      },
      {
        wrong:
          "Kinetic energy and momentum are basically the same thing — both measure motion.",
        correct:
          "They behave very differently. KE = ½mv² is a scalar that grows with the square of speed; momentum p = mv is a vector linear in speed. Doubling speed quadruples KE but only doubles momentum, and KE can convert to heat while momentum cannot.",
      },
    ],
    teacherUseCases: [
      "Pre-lab prediction round: ask students to rank three skaters released from the same height but with different masses by their bottom speed. Most will incorrectly pick the heaviest. Run the sim with friction off to settle the bet, then derive v = √(2gh) on the board.",
      "Energy bar collection: have pairs record KE, PE, and total energy at the top, midpoint, and bottom of the ramp for three different starting heights. Plot total energy vs. position — it should be a horizontal line. Discuss what a non-flat line would mean.",
      "Friction worksheet: turn friction up to 0.3 and have students measure the maximum height reached on the rebound for five passes. Plot height vs. pass number and fit a curve. Use this to introduce the idea of mechanical energy decaying exponentially when drag is roughly proportional to speed.",
      "Misconception probe: pause the simulation at the apex of a swing and ask students whether the skater is currently 'storing' energy or 'using' it. Listen for the word 'used up' — that's your entry point to the conservation discussion.",
      "Cross-experiment connection: pair this with the pendulum or roller coaster lab and ask students to identify what stays constant in each. Goal is generalizing energy conservation beyond the specific apparatus.",
    ],
    faq: [
      {
        question: "Why does the skater reach the same height on the other side when there is no friction?",
        answer:
          "Because total mechanical energy is conserved. At the start, all the energy is gravitational PE = mgh. At the bottom, it's all KE = ½mv². When the skater climbs the other side, KE converts back to PE, and since no energy was lost the skater must rise to exactly the original height. Add friction and she falls short by the amount of energy converted to heat.",
      },
      {
        question: "Does the shape of the track matter for the bottom speed?",
        answer:
          "Without friction, no — only the vertical drop matters. Gravity is a conservative force, which means the work it does depends only on starting and ending heights, not on the path between them. A straight ramp, a curved bowl, or a wavy track all give the same bottom speed for the same starting height. With friction, longer paths lose more energy because the friction force acts over a greater distance.",
      },
      {
        question: "What does 'mechanical energy' actually mean in this lab?",
        answer:
          "Mechanical energy is the sum of kinetic energy (½mv²) and gravitational potential energy (mgh) — the energy associated with motion and position in a gravitational field. Thermal energy from friction is real energy too, but it isn't 'mechanical' because it can't be easily converted back into motion of a single object. The distinction matters because mechanical energy is conserved only when non-conservative forces like friction are absent.",
      },
      {
        question: "Why does the skater slow down a tiny bit on each pass when friction is on?",
        answer:
          "Each time the skater traverses the track, kinetic friction does negative work on her: W_friction = -μNd. That work removes kinetic energy and dumps it into thermal energy in the wheels and track. Because she has less mechanical energy after each pass, she can't reach the same height on the rebound, so the swing amplitude shrinks until eventually she stops at the lowest point.",
      },
      {
        question: "How does this connect to AP Physics 1 standard 5.B.3?",
        answer:
          "AP Physics 1 standard 5.B.3 asks students to apply conservation of energy to systems where mechanical energy is conserved (or where the change is accounted for by work done by non-conservative forces). This skate park is the cleanest visual model for that learning objective: students set up an isolated system, apply mgh + ½mv² = constant, and then break it deliberately by turning on friction so the missing energy can be tracked as thermal. NGSS HS-PS3-1 ties in by asking students to model the quantitative flow of energy among forms.",
      },
      {
        question: "Why does mass cancel out in the bottom-speed formula?",
        answer:
          "Setting mgh equal to ½mv² and dividing both sides by m gives v = √(2gh). Mass appears in both the gravitational PE and the kinetic energy in identical proportion, so it cancels exactly. This is the same reason all objects fall at the same rate in vacuum: gravity and inertia both scale linearly with mass, and they cancel whenever you ask about acceleration or speed rather than force or energy magnitude.",
      },
    ],
  },
};
