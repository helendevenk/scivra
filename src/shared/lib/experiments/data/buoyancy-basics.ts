import type { Experiment } from "@/shared/types/experiment";

export const buoyancyBasics: Experiment = {
  id: "buoyancy-basics",
  slug: "buoyancy-basics-intro",
  title: "Buoyancy Basics",
  subtitle: "Introduction to floating, sinking, and buoyant force",
  description:
    "A simplified introduction to buoyancy. Choose from common objects and observe whether they float or sink in water, honey, or gasoline. Great first step before the full Buoyancy lab.",
  thumbnail: "/imgs/experiments/fluid-statics.png",

  standards: {
    ngss: ["MS-PS1-4", "HS-PS2-1"],
    gcse: ["AQA P5.5"],
    ap: ["3.C.4"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["buoyancy", "floating", "sinking", "density", "Archimedes"],
  difficulty: "beginner",

  parameters: [
    { id: "fluid", label: "Fluid Type", unit: "", min: 0, max: 2, default: 0, step: 1, tier: "free" },
    { id: "object", label: "Object Type", unit: "", min: 0, max: 7, default: 0, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "F_b = \\rho_{fluid} V g", description: "Buoyant force" },
    { latex: "\\rho = \\frac{m}{V}", description: "Density" },
  ],

  theory:
    "An object sinks when it is denser than the surrounding fluid, and floats when it is less dense. The upward buoyant force equals the weight of displaced fluid. This basic principle explains why ice floats in water, why oil rises in vinegar, and why dense metals sink in water but float in liquid mercury.",
  instructions:
    "Select a fluid and an object from the menus. Drop the object into the tank and observe whether it floats or sinks. The mass and volume display helps you calculate density.",
  challenges: [
    { id: "bb-c1", question: "Which is denser: wood or water? How can you tell from the simulation?", hint: "Wood floats in water — it is less dense", tier: "free" },
    { id: "bb-c2", question: "Would an apple float in honey? Why or why not?", hint: "Compare apple density to honey density (~1400 kg/m³)", tier: "free" },
    { id: "bb-c3", question: "Why does the same object float higher in honey than in water?", hint: "Denser fluid creates more buoyant force per unit volume displaced", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["buoyancy", "fluid-statics", "density-lab"],

  seoTitle: "Buoyancy Basics Simulation | Floating and Sinking | Physics Lab",
  seoKeywords: ["buoyancy basics", "floating sinking", "density", "Archimedes", "physics simulation"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Buoyancy, Density, Floating and Sinking" },

  contentSections: {
    whatIsIt:
      "An ice cube bobs in a glass of soda. A penny tossed into the same glass clinks to the bottom. Both are made of perfectly ordinary stuff — frozen water and copper-plated zinc — yet one floats and one sinks. The deciding factor is density: how much mass is packed into each chunk of volume. If the object is less dense than the fluid around it, the fluid pushes it up to the surface; if it's denser, gravity wins and it goes down. This lab strips buoyancy down to the essentials so you can see the rule before you do any math. Pick a fluid, drop in an object, and watch what happens. After a few drops you'll start predicting outcomes by eye, the same way a marine biologist or a kitchen chemist does.",
    parameterExplanations: {
      fluid:
        "The fluid in the tank — water, honey, or gasoline. Honey is roughly 1400 kg/m³, water 1000, and gasoline about 750. Switching fluids changes which objects float and which sink without you having to touch the object's properties.",
      object:
        "The object dropped into the tank. Choices include wood, plastic, ice, an apple, aluminum, iron, lead, and a few other classroom favorites. Each has a fixed density baked in, so its float-or-sink behavior depends entirely on the fluid you picked.",
    },
    misconceptions: [
      {
        wrong:
          "Heavy objects sink and light objects float.",
        correct:
          "A bowling ball weighs only a few pounds yet sinks because it's denser than water, while a whole oak log weighs hundreds of pounds and still floats. An apple is heavier than a thumbtack but its density (~850 kg/m³) is below water's, so it floats while the steel tack sinks. The deciding factor is density (mass per volume), not raw weight.",
      },
      {
        wrong:
          "Wood floats because it's full of air pockets, not because of density.",
        correct:
          "The air pockets are part of why wood is less dense than water — they bring the average density down. Density already accounts for whatever the object is made of, including any air spaces inside, so 'density less than fluid' is the complete answer.",
      },
      {
        wrong:
          "If something sinks in water it must sink in every fluid.",
        correct:
          "Iron sinks in water but floats on liquid mercury, because mercury (13,600 kg/m³) is denser than iron (7870 kg/m³). Whether an object floats depends on the density of the specific fluid around it.",
      },
      {
        wrong:
          "An apple floats because apples have seeds and skin that hold them up.",
        correct:
          "An apple is mostly water with some sugars and air pockets, giving it a density slightly less than water. Drop a peeled, seeded apple into water and it still floats. The skin and seeds don't change the rule.",
      },
    ],
    teacherUseCases: [
      "Predict-and-record warm-up: list eight objects on the board and ask students to predict float or sink in water before they touch the simulation. Tally class predictions, then run the sim and compare.",
      "Density ranking activity: have students drop every object into honey, water, and gasoline and rank the objects from least dense to most dense based on which fluids they float in.",
      "Misconception probe: ask 'will the apple float in honey?' and pause for predictions. Many students assume yes because it floats in water — the reveal opens a discussion about how the fluid matters too.",
      "Sketch a number line: have pairs measure mass and volume from the readout, calculate density, and plot each object on a class density number line so they can see the float/sink threshold visually.",
      "Vocabulary anchor: introduce the words 'denser than' and 'less dense than' once students have seen four or five examples — the language sticks better after the visual experience.",
    ],
    faq: [
      {
        question: "Why does ice float on water if both are made of water?",
        answer:
          "When water freezes, the molecules lock into a crystal structure with more space between them than in liquid water. That makes ice about 8% less dense than liquid water (917 vs 1000 kg/m³), so it floats. This is unusual — most substances get denser when they freeze.",
      },
      {
        question: "Will an apple float in honey?",
        answer:
          "Yes. An apple has a density around 850 kg/m³, while honey is closer to 1400 kg/m³. Honey is much denser than the apple, so the apple rides high on the surface — much higher than it would in water. Try it in the sim to see exactly how much of the apple sticks out.",
      },
      {
        question: "Why does a ship float but a coin sink?",
        answer:
          "A coin is solid metal with a density much greater than water, so it sinks. A ship is shaped to enclose a huge amount of air; the average density of the whole hull (steel plus air inside) is less than water. Average density is what matters, and the air-filled shape lowers it dramatically.",
      },
      {
        question: "Does mass affect whether something floats?",
        answer:
          "Not directly — density does. Two objects of the same material but different sizes both float (or both sink) the same way, even though one is much heavier. What changes the outcome is changing the material or changing the fluid, both of which change the density comparison.",
      },
      {
        question: "How does this lesson connect to NGSS standards?",
        answer:
          "NGSS standard MS-PS1-4 asks students to use models to describe how matter behaves at the particle scale, and the same density logic carries into HS-PS2-1 where forces predict motion. This lab also previews AP Physics 1 standard 3.C.4 on buoyant forces, which students see formalized in the full Buoyancy lab.",
      },
    ],
  },
};
