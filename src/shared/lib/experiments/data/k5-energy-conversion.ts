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
      id: "height",
      label: "Height",
      unit: "m",
      min: 2,
      max: 15,
      default: 8,
      step: 0.5,
      tier: "free",
    },
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
      id: "drag",
      label: "Air Drag",
      unit: "",
      min: 0,
      max: 0.3,
      default: 0.05,
      step: 0.01,
      tier: "free",
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
    "Move the Height, Mass, and Air Drag sliders one at a time. Watch how the energy bars change when an object starts higher, gets heavier, or pushes through more air. Then try the three preset buttons: Ball Drop, Flashlight, and Solar Panel. Each preset shows a different way energy changes form.",

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
  htmlControlAliases: { height: "sl-h", mass: "sl-m", drag: "sl-drag" },
  presets: [
    { id: "drop", label: "🏀 Ball Drop (PE→KE)", paramValues: { height: 10, mass: 2, drag: 0.05 } },
    { id: "flash", label: "🔦 Flashlight (battery→light)", paramValues: { height: 2, mass: 0.5, drag: 0 } },
    { id: "solar", label: "☀️ Solar Panel (light→electricity)", paramValues: { height: 2, mass: 0.5, drag: 0 } },
  ],
  contentSections: {
    whatIsIt:
      "Energy is the ability to make things happen — to move objects, create light, make heat, or produce sound. The cool thing about energy is that it never disappears. It just changes from one form to another! When you hold a ball high above the ground, it has stored energy from being up high — we call that potential energy. The moment you let go, that stored energy starts turning into moving energy — called kinetic energy — as the ball falls faster and faster. When the ball hits the ground, the moving energy turns into a tiny bit of heat and a thump sound. Your flashlight turns stored energy in the battery into light. When you eat lunch, your body turns the stored energy in food into the energy you need to run around at recess. Energy can be stored, moved, and changed — but there is always the same total amount. Scientists call this the conservation of energy, and it is one of the most important ideas in all of science.",
    parameterExplanations: {
      height:
        "Height tells how high the object starts above the ground, measured in meters. A higher starting place gives the object more stored energy from gravity. When the object falls, that stored energy changes into motion energy. Try a small Height first, then a bigger Height, and watch the energy bars. The object has more energy to change forms when it begins higher. This supports NGSS 4-PS3 and 5-PS3 ideas because students can use observations to explain how energy moves and changes.",
      mass:
        "Mass tells how much matter is in the object, measured in kilograms. A larger Mass means the object is harder to move and can carry more energy when it falls from the same Height. A light ball and a heavy ball can fall in similar ways, but the heavy one has more energy because there is more matter moving. Keep Height and Air Drag the same, then change only Mass. This helps students see that measurements can be used as evidence when comparing energy in different objects.",
      drag:
        "Air Drag tells how strongly the air pushes back on the moving object. A low Air Drag value means the object moves through the air more easily. A higher Air Drag value means more energy changes into heat and motion of the air around it, so less energy stays as motion energy for the object. Try setting Air Drag to 0, then raise it slowly. This helps students notice that energy is not gone when motion slows. It has changed form or moved to the air and surroundings.",
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
          "All objects fall at the same speed when only gravity is acting on them — a heavy bowling ball and a light tennis ball hit the ground at the same time when dropped from the same height if air does not push back much. Mass does affect how much energy is stored, but it does not make the object fall faster by itself. Air Drag can slow lighter or wider objects in real life, which is why a feather and a ball do not fall the same way in ordinary air.",
      },
      {
        wrong: "Potential energy and kinetic energy are completely different and separate things.",
        correct:
          "They are two forms of the same thing: energy. As a ball falls, potential energy smoothly converts into kinetic energy — the higher the ball falls, the more potential energy has transformed into kinetic energy. At the very bottom, just before hitting the ground, almost all of the potential energy has become kinetic energy. They trade off with each other, and their total always stays the same, even when some energy moves into heat, sound, or the air.",
      },
      {
        wrong: "A battery creates energy.",
        correct:
          "A battery stores chemical energy that was put into it during manufacturing. When you use the Flashlight preset, the battery's stored chemical energy changes into electrical energy, then into light energy and a little heat. The battery does not make energy from nothing — it releases energy that was already stored inside it. When that stored energy is used up, the battery is empty. Energy is always converted, never created.",
      },
    ],
    teacherUseCases: [
      "Use the Ball Drop preset, set Height to 10 m, Mass to 2 kg, and Air Drag to 0.05, then ask students where the stored energy goes as the ball falls. Connect their observations to NGSS 4-PS3-2 energy transfer concepts.",
      "Keep Height at 8 m and Air Drag at 0.05 while comparing Mass at 0.5 kg and 10 kg. Have students predict which energy bar will be taller, then use the model as evidence for 5-PS3-1.",
      "Keep Height and Mass the same while changing Air Drag from 0 to 0.3. Ask students to explain why motion energy changes when the air pushes back, using heat and movement of air as part of their reasoning.",
      "Compare the Ball Drop, Flashlight, and Solar Panel presets. Students identify the starting energy form, the ending energy form, and at least one place energy moves, supporting NGSS 4-PS3-4 device energy conversion ideas.",
      "Run a quick CER activity: students choose one preset, record Height, Mass, and Air Drag, then make a claim about how energy changed form. Their evidence should come from the visible bars and controls.",
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
          "Every time the ball hits the ground, some of its moving energy turns into heat and sound instead of bouncing back up. The ball squishes very slightly on impact, and that squishing creates a tiny amount of warmth. The thud sound you hear is also energy leaving the ball as vibrations in the air. Air Drag can also move some energy into the air around the ball. So the ball bounces back with a little less energy each time, which means it reaches a lower height. The energy did not vanish — it moved into the surroundings.",
      },
      {
        question: "Where does the energy in food come from?",
        answer:
          "The energy in food originally came from the Sun! Plants use sunlight to turn carbon dioxide and water into sugars through photosynthesis — storing the Sun's energy as chemical energy in their cells. When you eat a plant (or an animal that ate plants), your body breaks those chemicals down and releases that stored energy to power your muscles, brain, and everything else. So when you run around at recess, you are ultimately using energy that started as sunlight. This is an example of energy converting through many forms before it reaches you.",
      },
      {
        question: "Which NGSS standards does this experiment connect to?",
        answer:
          "This simulation supports 4-PS3-2, which asks students to make observations to provide evidence that energy can be transferred from place to place by sound, light, heat, and electric currents. It also connects to 4-PS3-4, which involves applying scientific ideas to design, test, and refine a device that converts energy from one form to another. The Height, Mass, and Air Drag sliders help students observe how an object's motion and energy change, connecting to 5-PS3-1. The Ball Drop, Flashlight, and Solar Panel presets show energy changes in everyday systems.",
      },
      {
        question: "If energy is never destroyed, why do batteries run out?",
        answer:
          "A battery stores a certain amount of chemical energy when it is made. Every time you use it, some of that stored energy converts into electrical energy, which then becomes light, heat, or sound depending on what the device does. In the Flashlight preset, stored energy in the battery changes mostly into light, with some heat. Once all the stored chemical energy has been converted and sent out of the battery, there is nothing left to convert — the battery is empty. The energy did not disappear; it went into powering your device and became light, heat, or sound in the world around you. Recharging a battery uses electrical energy to push chemical energy back into storage.",
      },
    ],
  },
};
