import type { Experiment } from "@/shared/types/experiment";

export const k5SimpleMachines: Experiment = {
  id: "k5-simple-machines",
  slug: "k5-simple-machines",
  title: "Simple Machines",
  subtitle: "Levers, pulleys, and inclined planes — making work easier",
  description:
    "Experiment with the six simple machines: lever, pulley, inclined plane, wheel & axle, wedge, and screw. See how each machine reduces the force needed to do work, while often requiring moving a greater distance. Calculate mechanical advantage.",
  thumbnail: "/imgs/experiments/k5-simple-machines.png",

  standards: {
    ngss: ["3-PS2-1", "4-PS3-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "3-5",
  tags: ["simple machines", "lever", "pulley", "inclined plane", "mechanical advantage", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "forceInput",
      label: "Input Force",
      unit: "N",
      min: 1,
      max: 50,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "mechanicalAdvantage",
      label: "Mechanical Advantage",
      unit: "",
      min: 1,
      max: 8,
      default: 3,
      step: 0.5,
      tier: "free",
    },
    {
      id: "loadWeight",
      label: "Load Weight",
      unit: "N",
      min: 5,
      max: 100,
      default: 20,
      step: 5,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "MA = \\frac{\\text{Load Force}}{\\text{Effort Force}} = \\frac{d_{\\text{effort}}}{d_{\\text{load}}}",
      description: "Mechanical Advantage — how much the machine multiplies your force",
    },
    {
      latex: "W = F \\times d \\quad (\\text{work is conserved, never created})",
      description: "Work in = Work out (ignoring friction). Less force = more distance.",
    },
  ],

  theory:
    "Simple machines are devices that make work easier by changing the force needed or the direction of force. There are six types: lever (a rigid bar pivoting on a fulcrum), pulley (a wheel with a rope), inclined plane (a ramp), wheel and axle (a large and small wheel together), wedge (two inclined planes), and screw (an inclined plane wrapped in a spiral). Mechanical advantage (MA) tells you how much a machine multiplies your force. MA > 1 means less force required (but more distance traveled). Work = Force × Distance; simple machines cannot create energy, they only redistribute it. W_in = W_out (in an ideal machine without friction).",

  instructions:
    "Use the three sliders to change Input Force, Mechanical Advantage, and Load Weight. Pick any of the six machine buttons to compare lever, wheel and axle, pulley, inclined plane, wedge, and screw. Then try the three applied presets — Lever (teeter-totter), Pulley (flagpole), and Inclined Plane (ramp) — to see ready-made examples.",

  challenges: [
    {
      id: "mach-c1",
      question: "A lever has an effort arm of 3 m and load arm of 1 m. What is the mechanical advantage?",
      hint: "MA = effort arm / load arm = 3/1 = 3. You only need 1/3 of the force, but you push 3× farther.",
      tier: "free",
    },
    {
      id: "mach-c2",
      question: "If a pulley system has MA=4, how much force is needed to lift a 200 N weight?",
      hint: "MA = Load/Effort → Effort = Load/MA = 200/4 = 50 N. But you pull the rope 4× farther than the weight moves.",
      tier: "free",
    },
    {
      id: "mach-c3",
      question: "Name an example of each: lever, pulley, inclined plane in real life.",
      hint: "Lever: seesaw, scissors, bottle opener. Pulley: flagpole, crane, window blinds. Inclined plane: ramp, staircase, slide.",
      tier: "free",
    },
    {
      id: "mach-c4",
      question: "A ramp (inclined plane) is 5 m long and raises a load 1 m high. What is the MA, and how much force is needed to push a 300 N box up the ramp?",
      hint: "MA = length/height = 5/1 = 5. Effort = 300/5 = 60 N (ignoring friction).",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 12,
  relatedExperiments: ["k5-force-motion", "k5-energy-conversion"],

  seoTitle: "Simple Machines for Kids | Lever Pulley Interactive | Scivra",
  seoKeywords: [
    "simple machines kids simulation",
    "lever pulley inclined plane interactive",
    "mechanical advantage calculator",
    "K-5 physics simple machines",
    "work and machines elementary",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Simple Machines and Mechanical Advantage",
  },
  htmlControlAliases: { forceInput: "sl-fin", mechanicalAdvantage: "sl-ma", loadWeight: "sl-load" },
  presets: [
    { id: "selectMachine:lever", label: "⚖️ Lever", description: "Show a lever: a bar that turns around a fulcrum to lift or move a load." },
    { id: "selectMachine:wheel", label: "🎡 Wheel & Axle", description: "Show a wheel and axle, like a doorknob or steering wheel, that helps turn with less effort." },
    { id: "selectMachine:pulley", label: "🪝 Pulley", description: "Show a pulley: a wheel and rope that can change the direction of a pull." },
    { id: "selectMachine:incline", label: "📐 Inclined Plane", description: "Show an inclined plane, or ramp, that spreads lifting work over a longer path." },
    { id: "selectMachine:wedge", label: "🪓 Wedge", description: "Show a wedge, like an axe or doorstop, that changes a push into a splitting or holding force." },
    { id: "selectMachine:screw", label: "🔩 Screw", description: "Show a screw: a ramp wrapped around a cylinder that moves a little with each turn." },
    { id: "applyPreset:lever", label: "⚖️ Lever (teeter-totter)", description: "Set the model to a lever example with 10 N input force, 4.0 mechanical advantage, and a 30 N load." },
    { id: "applyPreset:pulley", label: "🪝 Pulley (flagpole)", description: "Set the model to a pulley example with 15 N input force, 2.0 mechanical advantage, and a 25 N load." },
    { id: "applyPreset:incline", label: "📐 Inclined Plane (ramp)", description: "Set the model to a ramp example with 8 N input force, 3.0 mechanical advantage, and a 20 N load." },
  ],
  contentSections: {
    whatIsIt:
      "Have you ever used a seesaw, a ramp, or a flagpole? All of those are simple machines! Simple machines are tools that make it easier to move, lift, or push things. They do not give you extra energy for free — but they spread the work out in a smarter way. A lever is a bar that balances on a point called a fulcrum. Think of a seesaw: sitting farther from the fulcrum gives your same weight a bigger turning effect, making it easier to lift the person on the other side. A ramp (inclined plane) lets you push something up at an angle instead of lifting it straight up — the push needed is smaller, but you push over a longer distance. A pulley is a wheel with a rope that lets you pull down to lift something up, or use several wheels together to share the weight. A wheel and axle is like a door handle or a steering wheel — turning the big outside part makes the small center part turn too, but with more force. A wedge is like a sharp knife or a doorstop — it turns a pushing force into a splitting or holding force. A screw is like a ramp wrapped in a spiral. All six types help people do tasks that would be too hard with bare hands alone!",
    parameterExplanations: {
      forceInput:
        "Force Input is how hard you push or pull on the machine. A small number is a gentle push. A large number is a stronger push. Watch the Output Force box as you move this slider. If your input force is too small, the machine may not lift the load yet. If you raise the input force, the output force grows too. Try keeping Mechanical Advantage the same while changing only this slider. That helps you see that your own push matters, even when the machine is helping.",
      mechanicalAdvantage:
        "Mechanical Advantage tells how much the machine helps your push or pull. A value of 1 means the machine is not multiplying your force. A value of 4 means the machine can make your force act about four times stronger. The trade is distance: when a machine gives more force help, you often move farther or turn more. Use this slider with the six machine buttons to compare how levers, pulleys, ramps, wedges, screws, and wheels can make work feel easier.",
      loadWeight:
        "Load Weight is how heavy the thing is that you want to lift, move, split, or hold. A small load is easier for the machine to handle. A large load needs more output force. Move this slider after you set Force Input and Mechanical Advantage. If the load becomes too heavy, the live data may say it is too heavy to lift. Then try raising your input force or using a bigger mechanical advantage. This shows why people choose the right simple machine for a job.",
    },
    misconceptions: [
      {
        wrong: "Simple machines make work easier by creating extra energy.",
        correct:
          "Simple machines do not make extra energy. They help you use force in a smarter way. A ramp lets you use a smaller push over a longer path. A pulley can change the direction of your pull. A lever can multiply your push. The work still has to be done, but the machine can make the job possible for a person.",
      },
      {
        wrong: "A longer ramp takes more work than lifting straight up.",
        correct:
          "A long, gentle ramp spreads the work over more distance. That means the push can be smaller at each moment. A short, steep ramp needs a bigger push. This is why wheelchair ramps and loading ramps are not straight up like ladders. The ramp does not remove the work. It changes how the work feels.",
      },
      {
        wrong: "The seesaw goes down on the heavier side, always.",
        correct:
          "Not always. A seesaw is a lever, so distance from the middle matters too. A lighter person sitting far from the middle can balance a heavier person sitting close to the middle. That is mechanical advantage in action. The place where the push happens can change how strong the turning effect is.",
      },
    ],
    teacherUseCases: [
      "Use the six machine buttons as a quick classification warm-up. Students identify the visible parts of a lever, wheel and axle, pulley, inclined plane, wedge, and screw, then connect each example to a classroom or home tool.",
      "Run a controlled-variable task with the Lever (teeter-totter) preset. Students keep Load Weight fixed, change only Mechanical Advantage, and record whether the output force is enough to lift the load.",
      "Use the Pulley (flagpole) preset to discuss direction of force. Students explain why pulling down on a rope can lift an object up, then connect the observation to NGSS 3-PS2-1 force investigations.",
      "Use the Inclined Plane (ramp) preset for an engineering discussion. Students compare low and high Mechanical Advantage settings and explain how a ramp can make lifting safer while still requiring work, supporting NGSS 4-PS3-4.",
      "Ask students to build a claim-evidence-reasoning response using slider values from Force Input, Mechanical Advantage, and Load Weight to decide whether the machine can lift the load.",
    ],
    faq: [
      {
        question: "What is mechanical advantage and why does it matter?",
        answer:
          "Mechanical advantage tells how much a machine helps your push or pull. A mechanical advantage of 3 means the machine can make your force act about three times stronger. If you push with 10 N, the machine can give about 30 N of output force in this ideal model. That matters because many jobs are too hard with bare hands. Ramps, levers, pulleys, wheels, wedges, and screws all help people move, lift, split, hold, or turn things more safely.",
      },
      {
        question: "Why do ramps make it easier to move heavy things?",
        answer:
          "A ramp lets you move something upward a little at a time instead of lifting it straight up all at once. A longer, gentler ramp usually needs less push, but you push for a longer distance. That is the trade. Ramps are used for wheelchairs, delivery trucks, moving boxes, mountain roads, and playground slides. In the simulation, use the Inclined Plane button or the ramp preset, then change Mechanical Advantage and Load Weight to see the trade clearly.",
      },
      {
        question: "Which NGSS standards connect to simple machines?",
        answer:
          "This experiment supports NGSS 3-PS2-1, which asks students to investigate how forces affect objects, and NGSS 4-PS3-4, which asks students to apply ideas about energy and forces to design a solution. Simple machines fit both standards. Students can change Force Input, Mechanical Advantage, and Load Weight, then use observations and numbers as evidence. They can also compare machine choices and explain which tool would help solve a lifting, moving, splitting, or turning problem.",
      },
      {
        question: "Can you name all six simple machines?",
        answer:
          "The six simple machines are: lever, pulley, inclined plane, wheel and axle, wedge, and screw. A lever is a bar on a pivot, like a seesaw. A pulley is a wheel with a rope, like a flagpole. An inclined plane is a ramp. A wheel and axle helps things turn, like a doorknob. A wedge splits or holds, like a knife or doorstop. A screw is a ramp wrapped in a spiral, like a jar lid or bolt.",
      },
      {
        question: "Does friction affect how well a simple machine works?",
        answer:
          "Yes. Friction can make a real machine need more force than the ideal model shows. A ramp has rubbing between the load and the ramp. A pulley has rubbing where the wheel turns. A lever can rub at the fulcrum. Engineers try to lower friction with smooth surfaces, wheels, bearings, oil, or grease. Even with friction, simple machines are still useful because they can make hard jobs easier and safer.",
      },
    ],
  },
};
