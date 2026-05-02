import type { Experiment } from "@/shared/types/experiment";

export const k5EnergyConversion: Experiment = {
  id: "k5-energy-conversion",
  slug: "k5-energy-conversion",
  title: "Energy Conversion",
  subtitle: "How energy changes forms — kinetic, potential, thermal, light",
  description:
    "Follow energy as it converts between forms: gravitational potential energy → kinetic energy → thermal energy. Drop a ball and watch the energy bar chart change in real time. Build a solar panel system and trace the path from light energy to electrical energy to mechanical motion.",
  thumbnail: "/imgs/experiments/k5-energy-conversion.png",

  standards: {
    ngss: ["4-PS3-2", "4-PS3-4", "5-PS3-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "3-5",
  tags: ["energy", "kinetic energy", "potential energy", "conservation", "energy conversion", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "dropHeight",
      label: "Drop Height",
      unit: "m",
      min: 1,
      max: 20,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "ballMass",
      label: "Ball Mass",
      unit: "kg",
      min: 0.1,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "surfaceLoss",
      label: "Energy Lost to Heat (bounce)",
      unit: "%",
      min: 0,
      max: 80,
      default: 20,
      step: 5,
      tier: "free",
    },
    {
      id: "energyType",
      label: "Scenario (0=Drop, 1=Roller Coaster, 2=Solar)",
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
      latex: "PE = mgh \\quad KE = \\frac{1}{2}mv^2",
      description: "Gravitational PE and kinetic energy formulas",
    },
    {
      latex: "E_{\\text{total}} = PE + KE = \\text{constant}",
      description: "Conservation of energy — total energy is always preserved",
    },
  ],

  theory:
    "Energy cannot be created or destroyed — only transformed from one form to another. This is the Law of Conservation of Energy. Common energy forms include: kinetic energy (motion), gravitational potential energy (height), thermal energy (heat), light energy (photons), electrical energy, and chemical energy. When a ball is dropped, gravitational PE converts to kinetic energy as it falls. On impact, kinetic energy converts to thermal energy (heat) and sound. The total energy remains constant throughout, just in different forms. In real systems, energy often 'leaks' to thermal energy (friction, air resistance), which is why perpetual motion machines are impossible.",

  instructions:
    "Set the drop height and watch the energy bar chart as the ball falls. PE starts high and decreases while KE increases — but their sum stays constant! Increase Surface Loss to simulate bouncing with energy loss. Try the Roller Coaster scenario (Pro) to see energy conversion along a track.",

  challenges: [
    {
      id: "ec-c1",
      question: "A 1 kg ball is at 10 m height. How much potential energy does it have? (g = 10 m/s²)",
      hint: "PE = mgh = 1 × 10 × 10 = 100 J. This converts completely to kinetic energy just before it hits the ground.",
      tier: "free",
    },
    {
      id: "ec-c2",
      question: "At half the drop height, what fraction of energy is kinetic? What fraction is potential?",
      hint: "At half height, PE = half the original (still mgh/2). By conservation, KE = other half. So 50% PE and 50% KE.",
      tier: "free",
    },
    {
      id: "ec-c3",
      question: "Name 3 energy conversions that happen when you turn on a light bulb.",
      hint: "1) Chemical energy (in the power plant fuel) → Electrical energy. 2) Electrical energy → Light energy + Thermal energy (the bulb gets hot). 3) Light energy → Thermal energy (when it warms objects).",
      tier: "free",
    },
    {
      id: "ec-c4",
      question: "A 2 kg ball is dropped from 5 m and bounces to 3 m. How much energy was lost to heat?",
      hint: "Initial PE = 2×10×5 = 100 J. Final PE after bounce = 2×10×3 = 60 J. Energy lost = 100-60 = 40 J (converted to thermal energy and sound on impact).",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-force-motion", "k5-simple-machines", "roller-coaster"],

  seoTitle: "Energy Conversion for Kids | Scivra Elementary Science",
  seoKeywords: [
    "energy conversion kids simulation",
    "kinetic potential energy interactive",
    "conservation of energy elementary",
    "K-5 physics energy",
    "energy forms simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Energy Conversion and Conservation",
  },
  contentSections: {
    whatIsIt:
      "Energy is the ability to make things happen — to move objects, create light, make heat, or produce sound. The cool thing about energy is that it never disappears. It just changes from one form to another! When you hold a ball high above the ground, it has stored energy from being up high — we call that potential energy. The moment you let go, that stored energy starts turning into moving energy — called kinetic energy — as the ball falls faster and faster. When the ball hits the ground, the moving energy turns into a tiny bit of heat and a thump sound. Your flashlight turns stored energy in the battery into light. When you eat lunch, your body turns the stored energy in food into the energy you need to run around at recess. Energy can be stored, moved, and changed — but there is always the same total amount. Scientists call this the conservation of energy, and it is one of the most important ideas in all of science.",
    parameterExplanations: {
      dropHeight:
        "Drop Height sets how high above the ground the ball starts, measured in meters. One meter is about as tall as a kitchen counter. The higher the ball starts, the more stored (potential) energy it has — just like a roller coaster car has more energy at the top of a tall hill than a short hill. Try setting drop height to 1 m and then to 20 m and watch how the energy bar chart changes before the ball is even released.",
      ballMass:
        "Ball Mass sets how heavy the ball is, measured in kilograms. A basketball is about 0.6 kg; a bowling ball is about 5 kg. A heavier ball stores more potential energy at the same height. If you double the mass, you double the stored energy. Try comparing a 0.1 kg ball (like a ping-pong ball) with a 5 kg ball dropped from the same height and notice how the energy bars differ.",
      surfaceLoss:
        "Surface Loss controls how much energy turns into heat and sound when the ball bounces, shown as a percentage. At 0% the ball bounces back perfectly to its starting height — no energy is lost to heat. At 80% most of the moving energy turns into warmth and a thud on impact, so the ball barely bounces. In real life all bounces lose some energy to heat, which is why a dropped ball never bounces back quite as high as where it started.",
      energyType:
        "Scenario lets you switch between three different situations: 0 for a simple ball drop, 1 for a roller coaster (a Pro feature showing energy changing along a curved track), and 2 for a solar panel system (a Pro feature tracing light energy turning into electrical energy and then motion). Each scenario shows a different everyday example of how energy changes form.",
    },
    misconceptions: [
      {
        wrong: "Energy disappears when a ball hits the ground and stops moving.",
        correct:
          "Energy never disappears — it just changes form. When a moving ball hits the ground and stops, all that moving energy turns into heat (you could feel the ball get slightly warm) and sound (the thud you hear). The total amount of energy before and after the bounce is the same; it is just in different forms. Scientists call this conservation of energy, and it always holds true.",
      },
      {
        wrong: "A heavier ball always falls faster than a lighter one.",
        correct:
          "All objects fall at the same speed when only gravity is acting on them — a heavy bowling ball and a light tennis ball hit the ground at the same time when dropped from the same height (ignoring air resistance). Galileo showed this hundreds of years ago. Mass does affect how much energy is stored, but it does not make the ball fall faster. Air resistance can slow lighter or larger objects down in real life, but that is a separate effect.",
      },
      {
        wrong: "Potential energy and kinetic energy are completely different and separate things.",
        correct:
          "They are two forms of the same thing: energy. As a ball falls, potential energy smoothly converts into kinetic energy — the higher the ball falls, the more potential energy has transformed into kinetic energy. At the very bottom, just before hitting the ground, almost all of the potential energy has become kinetic energy. They trade off with each other, and their total always stays the same (until some converts to heat).",
      },
      {
        wrong: "A battery creates energy.",
        correct:
          "A battery stores chemical energy that was put into it during manufacturing. When you use the battery in a flashlight, it converts that stored chemical energy into electrical energy, which then converts into light energy. The battery does not make energy from nothing — it releases energy that was already stored inside it, and when that stored energy is used up, the battery is dead. Energy is always converted, never created.",
      },
    ],
    teacherUseCases: [
      "Set dropHeight to 10 m and ballMass to 1 kg with surfaceLoss at 0%, then show students the energy bar at the top versus just before landing — ask them where the potential energy went and connect to 4-PS3-2 energy transfer concepts.",
      "Keep dropHeight at 10 m and compare ballMass at 0.5 kg versus 2 kg; have students predict which bar will be taller before running, then verify and discuss why mass changes the amount of stored energy.",
      "Increase surfaceLoss from 0% to 60% and ask students to observe how high the ball bounces back — use this to discuss why real-world machines always lose some energy to heat and why a perpetual motion machine is impossible.",
      "Have students act out energy conversion physically: stand up (potential energy), run across the room (kinetic energy), and slide to a stop (heat from friction) — then map their actions onto the simulation's bar chart.",
      "Run dropHeight at 20 m with surfaceLoss at 20% and challenge students to sketch a bar graph prediction before pressing play, then compare their sketch to the simulation output to practice 4-PS3-4 evidence-based reasoning.",
    ],
    faq: [
      {
        question: "What is the difference between potential energy and kinetic energy?",
        answer:
          "Potential energy is stored energy — energy that is ready to be used but has not started moving anything yet. A ball sitting at the top of a ramp has potential energy because of its height. A stretched rubber band has potential energy because of its stretch. Kinetic energy is moving energy — the energy something has because it is actually moving right now. The faster something moves and the heavier it is, the more kinetic energy it has. As a ball rolls down a ramp, potential energy continuously converts into kinetic energy. These ideas connect to the NGSS standard 4-PS3-2 about making observations to provide evidence that energy can be transferred from place to place.",
      },
      {
        question: "Why does a bouncing ball never bounce back to the same height it was dropped from?",
        answer:
          "Every time the ball hits the ground, some of its moving energy turns into heat and sound instead of bouncing back up. The ball squishes very slightly on impact, and that squishing creates a tiny amount of warmth. The thud sound you hear is also energy leaving the ball as vibrations in the air. So the ball bounces back with a little less energy each time, which means it reaches a lower height. This is why the surfaceLoss slider in the simulation always takes away some energy — it models this very real effect.",
      },
      {
        question: "Where does the energy in food come from?",
        answer:
          "The energy in food originally came from the Sun! Plants use sunlight to turn carbon dioxide and water into sugars through photosynthesis — storing the Sun's energy as chemical energy in their cells. When you eat a plant (or an animal that ate plants), your body breaks those chemicals down and releases that stored energy to power your muscles, brain, and everything else. So when you run around at recess, you are ultimately using energy that started as sunlight. This is an example of energy converting through many forms before it reaches you.",
      },
      {
        question: "Which NGSS standards does this experiment connect to?",
        answer:
          "This simulation supports 4-PS3-2, which asks students to make observations to provide evidence that energy can be transferred from place to place by sound, light, heat, and electric currents. It also connects to 4-PS3-4, which involves applying scientific ideas to design, test, and refine a device that converts energy from one form to another. The surfaceLoss parameter directly models the idea in 5-PS3-1 that the speed of an object affects the energy of that object, since students can observe how changing height (and thus speed) changes the energy bars.",
      },
      {
        question: "If energy is never destroyed, why do batteries run out?",
        answer:
          "A battery stores a certain amount of chemical energy when it is made. Every time you use it, some of that stored energy converts into electrical energy, which then becomes light, heat, or sound depending on what the device does. Once all the stored chemical energy has been converted and sent out of the battery, there is nothing left to convert — the battery is empty. The energy did not disappear; it went into powering your device and became light, heat, or sound in the world around you. Recharging a battery uses electrical energy to push chemical energy back into storage.",
      },
    ],
  },
};
