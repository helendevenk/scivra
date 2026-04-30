import type { Experiment } from "@/shared/types/experiment";

export const johnTravoltage: Experiment = {
  id: "john-travoltage",
  slug: "john-travoltage-static-discharge",
  title: "John Travoltage",
  subtitle: "Build up static charge and trigger a spark discharge",
  description:
    "Rub a shoe on carpet to build up static charge, then touch a doorknob to discharge it. Observe how charge accumulates and suddenly releases as a spark, with visual charge distribution maps.",
  thumbnail: "/imgs/experiments/electric-field-lines.png",

  standards: {
    ngss: ["HS-PS2-4"],
    gcse: ["AQA P2.1"],
    ap: ["CHA-1.A", "CHA-1.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["static electricity", "discharge", "spark", "charge accumulation", "electrostatics"],
  difficulty: "beginner",

  parameters: [
    { id: "rub_intensity", label: "Rubbing Intensity", unit: "", min: 1, max: 10, default: 5, step: 1, tier: "free" },
    { id: "humidity", label: "Humidity", unit: "%", min: 10, max: 90, default: 30, step: 5, tier: "pro" },
  ],

  formulas: [
    { latex: "V = \\frac{Q}{C}", description: "Voltage from accumulated charge" },
    { latex: "E_{spark} \\approx 3 \\text{ MV/m}", description: "Air breakdown field" },
  ],

  theory:
    "When a shoe rubs against carpet, electrons transfer from carpet to shoe (or vice versa) due to the triboelectric effect. The accumulated charge creates a voltage across the body. When this voltage is high enough (air breakdown at ~3 MV/m), a spark discharges the built-up charge through the ionized air path. Humidity allows gradual charge leakage, reducing maximum charge buildup.",
  instructions:
    "Click and drag the shoe back and forth across the carpet to accumulate charge. Watch the charge indicator rise. Move the hand toward the doorknob — when it gets close enough, a spark discharges the charge. More rubbing = larger spark.",
  challenges: [
    { id: "jt-c1", question: "Why does the spark jump to the doorknob before you touch it?", hint: "High electric field ionizes air at close distances, creating a conductive path", tier: "free" },
    { id: "jt-c2", question: "Why is static discharge worse in winter than summer?", hint: "Low humidity in winter means less conductive moisture on skin/carpet for gradual discharge", tier: "free" },
    { id: "jt-c3", question: "Why are electronics stored in anti-static bags?", hint: "ESD can damage transistors with voltages as low as 10V — far less than a painful spark", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["balloons-static-electricity", "coulombs-law", "electric-field-lines"],

  seoTitle: "John Travoltage — Static Electricity Discharge | Physics Simulation",
  seoKeywords: ["static electricity", "discharge", "spark", "triboelectric effect", "electrostatics", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Static Electricity, Electric Discharge, Triboelectric Effect" },

  contentSections: {
    whatIsIt:
      "Shuffle across a wool carpet in winter, reach for a metal doorknob, and ZAP — your fingertip and the knob exchange a tiny lightning bolt before they ever touch. That spark is a textbook static discharge. Each step strips a few electrons off the carpet onto your shoe (or the other way, depending on materials), and over a few seconds you can build up tens of thousands of volts across your body without feeling anything. The body acts like a small capacitor, storing the charge until it finds a path to ground. As your hand approaches the metal knob, the gap between you and the knob shrinks, and the electric field across that gap climbs. When the field hits about 3 million volts per meter, air breakdown ionizes the gap and a conductive plasma channel snaps into existence — that's the spark. In the lab below, you control how hard the shoe rubs and how humid the room is, and watch charge build until discharge.",
    parameterExplanations: {
      rub_intensity:
        "How vigorously the shoe drags across the carpet, on a 1–10 scale. Higher values transfer more electrons per pass via the triboelectric effect, so the body's stored charge — and therefore the voltage and the eventual spark size — grows faster with more energetic rubbing.",
      humidity:
        "The relative humidity of the room as a percentage (Pro tier). Water molecules are mildly conductive, so high humidity lets accumulated charge leak quietly off your skin and the carpet before it can build up. Dry winter air lets charge pile high; humid summer air keeps you nearly neutral.",
    },
    misconceptions: [
      {
        wrong:
          "The shock from a doorknob means the doorknob is charged and is attacking your hand.",
        correct:
          "The charge is on you, not the knob. You picked it up from the carpet and the body stored it. The knob is grounded through the door frame, so it's a low-resistance path back to the rest of the building — current flows from your overcharged fingertip into the knob, not the reverse.",
      },
      {
        wrong:
          "Static shock requires touching the metal — the spark only happens at contact.",
        correct:
          "The spark can jump a millimeter or more before contact when the field exceeds air's breakdown strength of about 3 MV/m. That's why your knuckle can feel the zap a hair's width before it touches the knob. The plasma channel forms in the air gap first, then the charges race across it.",
      },
      {
        wrong:
          "Static shocks are dangerous because of the high voltage.",
        correct:
          "Painful but rarely dangerous to people because the total charge — and therefore the energy and current — is tiny. You can have 20,000 V across your body with only microcoulombs stored. The same voltage in a wall outlet would be lethal because the supply can deliver continuous amps. Voltage alone doesn't kill; current and duration do.",
      },
      {
        wrong:
          "Anti-static wrist straps and bags work by blocking electricity from getting in.",
        correct:
          "They work by giving any built-up charge a slow path to ground so it can never accumulate to a dangerous level. A wrist strap connects your body through a high-resistance resistor (around 1 MΩ) to ground, bleeding charge off harmlessly. Anti-static bags do the same job for components inside.",
      },
    ],
    teacherUseCases: [
      "Pre-lab demo: have students predict whether they will get more shocks in winter or summer, then run the simulation at 20% and 80% humidity to compare.",
      "Have students record charge buildup vs rub count at fixed humidity, plot Q vs N, and discuss why it eventually levels off (leakage rate matches input rate).",
      "Misconception probe: ask 'why does the spark sometimes jump before your finger touches the knob?' before showing the field-breakdown threshold animation.",
      "Engineering tie-in: explain why semiconductor fab workers wear conductive booties and grounded smocks, then have students design a workstation that prevents ESD damage to a 5 V transistor.",
      "Quantitative challenge: given a body capacitance of 100 pF and a 20,000 V buildup, students compute Q = CV in nanocoulombs and compare to the simulation's tally.",
    ],
    faq: [
      {
        question: "Why does the spark hurt more in winter than in summer?",
        answer:
          "Winter air is drier, so charge leaks off your skin and the carpet much more slowly. You can build up to higher voltages — sometimes 20,000 V or more — before discharge. Summer humidity provides a continuous slow leak path, so you rarely accumulate enough to feel anything. Same physics, different leakage rate.",
      },
      {
        question: "How can my body hold tens of thousands of volts without burning?",
        answer:
          "Voltage is energy per charge, not total energy. Total stored energy is ½CV². Body capacitance is around 100 pF, so even at 20,000 V the stored energy is only about 0.02 joules — about a thousandth of what a AA battery delivers per second. The discharge is brief and the energy small, so it stings without injuring tissue.",
      },
      {
        question: "Why are electronics so sensitive to static when humans barely feel it?",
        answer:
          "Modern semiconductor gates are nanometers thick and break down at fields well below air's 3 MV/m. A human-imperceptible 100 V discharge — far too small to feel — can punch through a transistor's oxide layer and ruin a chip. That's why every chip-handling environment is grounded, humidified, and ESD-controlled.",
      },
      {
        question: "How does this lab map to AP Physics 2 standard CHA-1.A?",
        answer:
          "CHA-1.A asks students to describe how objects acquire net charge through contact and rubbing, and to relate that charge to forces and fields. Watching charge accumulate as the shoe rubs the carpet and then jump as a spark when the field exceeds breakdown is the exact qualitative reasoning the AP exam tests when it asks about charge transfer, conductors versus insulators, and the conditions for discharge.",
      },
      {
        question: "Why does the spark always go to the metal knob and not somewhere else?",
        answer:
          "The knob is a grounded conductor — connected through the door, the frame, and the building's structure to a huge reservoir of charge at zero potential. That gives it a much lower potential than your charged fingertip, so the field across the air gap is largest there. Sparks always preferentially form along the path of highest field, which is why pointed grounded objects act as natural lightning rods.",
      },
    ],
  },
};
