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
      id: "machineType",
      label: "Machine (0=Lever, 1=Pulley, 2=Inclined Plane)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "effortArm",
      label: "Effort Arm Length",
      unit: "m",
      min: 0.5,
      max: 5,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "loadArm",
      label: "Load Arm Length",
      unit: "m",
      min: 0.5,
      max: 5,
      default: 1,
      step: 0.5,
      tier: "free",
    },
    {
      id: "loadWeight",
      label: "Load Weight",
      unit: "N",
      min: 10,
      max: 200,
      default: 50,
      step: 10,
      tier: "pro",
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
    "Select a machine type and adjust the arm lengths (for the lever) or other parameters. Watch the MA calculation update. Try lifting a heavy load with and without the machine — see how much less force the machine requires. Remember: you always have to move a greater distance when using less force!",

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
  contentSections: {
    whatIsIt:
      "Have you ever used a seesaw, a ramp, or a flagpole? All of those are simple machines! Simple machines are tools that make it easier to move, lift, or push things. They do not give you extra energy for free — but they spread the work out in a smarter way. A lever is a bar that balances on a point called a fulcrum. Think of a seesaw: if you sit closer to the middle, you need more force; if you sit farther out, you feel lighter. A ramp (inclined plane) lets you push something up at an angle instead of lifting it straight up — the push needed is smaller, but you push over a longer distance. A pulley is a wheel with a rope that lets you pull down to lift something up, or use several wheels together to share the weight. A wheel and axle is like a door handle or a steering wheel — turning the big outside part makes the small center part turn too, but with more force. A wedge is like a sharp knife or a doorstop — it turns a pushing force into a splitting or holding force. A screw is like a ramp wrapped in a spiral. All six types help people do tasks that would be too hard with bare hands alone!",
    parameterExplanations: {
      machineType:
        "This control switches between three machines to explore. Setting 0 is a Lever — a bar on a pivot point called a fulcrum. Setting 1 is a Pulley — a wheel and rope system for lifting loads. Setting 2 is an Inclined Plane — a ramp that lets you push something up gradually instead of lifting it straight up. Each machine shows a different way of making work easier. Try all three to see how they look and how the mechanical advantage changes.",
      effortArm:
        "For the lever, this is how long the pushing side is — the side where YOU push down. A longer effort arm means you need less force to lift the load. Think of a seesaw: sitting farther from the middle makes it easier to lift the person on the other side. Range is 0.5 m to 5 m. Try making the effort arm as long as possible and notice how little force you need.",
      loadArm:
        "For the lever, this is how long the load side is — the side holding the heavy thing you want to lift. A shorter load arm makes lifting easier. Range is 0.5 m to 5 m. Try a long effort arm with a short load arm — that gives you the biggest mechanical advantage and the smallest force needed.",
      loadWeight:
        "This is how heavy the object you are trying to lift or move is, from 10 N (like a small book) up to 200 N (like a heavy backpack full of stuff). The machine reduces how much force YOU need to exert, even though the total work stays the same. This is a Pro setting to explore how the machine handles heavier loads.",
    },
    misconceptions: [
      {
        wrong: "Simple machines make work easier by creating extra energy.",
        correct:
          "Simple machines never create energy from nothing. The total amount of work (force times distance) stays the same. What they do is let you use a smaller force over a longer distance to achieve the same result as a larger force over a shorter distance. You trade more distance for less force — a very useful trade when the object is too heavy to lift directly but you can push it up a long ramp instead.",
      },
      {
        wrong: "A longer ramp takes more work than lifting straight up.",
        correct:
          "The total work is about the same (ignoring friction). A longer ramp just spreads that work out over a longer path, so the force you need at any one moment is smaller. This is why wheelchair ramps are long and gentle — a short, steep ramp would be too hard to push up but gives the same height gain. The ramp makes it possible for someone without great strength to still get the job done.",
      },
      {
        wrong: "The seesaw goes down on the heavier side, always.",
        correct:
          "Not always — it depends on where each person sits, not just their weight! A lighter child sitting far from the center can balance a heavier child sitting close to the center. The lever balances when force times distance is equal on both sides. That is why you can adjust your position on a seesaw to make it balance even with different weights.",
      },
    ],
    teacherUseCases: [
      "Lever balance challenge: set machineType to 0 (Lever), loadArm to 1 m, and loadWeight to 50 N. Ask students to find the effortArm length that makes the mechanical advantage exactly 3 — then verify by checking how much force is needed.",
      "Ramp vs. lifting comparison: switch machineType to 2 (Inclined Plane) and vary the ramp length. Students predict and record how the required push force changes as the ramp gets longer or shorter, connecting to NGSS 3-PS2-1 and 4-PS3-4.",
      "Real-life scavenger hunt: after exploring all three machine types, have students list one example of each machine in the classroom or school (scissors as lever, window blind as pulley, book ramp as inclined plane) to connect simulation to daily life.",
      "Pulley systems discussion: set machineType to 1 (Pulley) and discuss how adding more pulleys (like on a crane or flagpole) splits the weight among more rope sections, reducing the force even further — a setup for future exploration of compound machines.",
      "Work is conserved: demonstrate with loadWeight at 100 N and high mechanical advantage that while effort force drops, the effort distance increases proportionally — reinforcing that machines redistribute work but do not create energy.",
    ],
    faq: [
      {
        question: "What is mechanical advantage and why does it matter?",
        answer:
          "Mechanical advantage tells you how many times a machine multiplies your force. A mechanical advantage of 3 means you only need to push with one-third the force you would need without the machine. For example, if a box weighs 90 N (about as heavy as a medium dog), a lever with mechanical advantage 3 means you only need to push down with 30 N — much easier! The trade-off is that you push over a longer distance. Mechanical advantage matters because it lets children, older people, or anyone with limited strength still move and lift heavy things safely. That is why ramps, levers, and pulleys are found everywhere from playgrounds to construction sites.",
      },
      {
        question: "Why do ramps make it easier to move heavy things?",
        answer:
          "Lifting something straight up requires all your force to fight gravity at once. A ramp lets you push something up at a gentle angle, spreading that fight against gravity over a longer path. At each step along the ramp you only need to overcome a small portion of the object's weight. The longer and gentler the ramp, the less force you need at any moment — though you do have to push over a greater distance. Ramps are everywhere: wheelchair accessibility ramps, loading docks for delivery trucks, mountain roads that zigzag instead of going straight up, and playground slides (used in reverse to go down).",
      },
      {
        question: "Which NGSS standards connect to simple machines?",
        answer:
          "This experiment supports NGSS 3-PS2-1, which asks students to investigate the effects of forces on objects, and 4-PS3-4, which asks students to apply scientific ideas about energy and forces to design a solution to a problem. Simple machines are a classic real-world application of both standards — students observe how changing arm lengths changes the force required (3-PS2-1) and then use that understanding to design a system for lifting a heavy load with less effort (4-PS3-4). The simulation gives students a safe way to test many lever and ramp configurations quickly.",
      },
      {
        question: "Can you name all six simple machines?",
        answer:
          "The six simple machines are: (1) Lever — a bar on a pivot, like a seesaw or bottle opener; (2) Pulley — a wheel with a rope, like a flagpole or crane; (3) Inclined Plane — a ramp, like a wheelchair ramp or a slide; (4) Wheel and Axle — a big wheel connected to a small rod, like a doorknob, steering wheel, or rolling pin; (5) Wedge — two inclined planes back to back, like a knife, axe, or doorstop; (6) Screw — an inclined plane wrapped in a spiral, like a jar lid, bolt, or drill bit. Most complex machines we use every day — from bicycles to scissors to can openers — combine two or more of these simple machines working together.",
      },
      {
        question: "Does friction affect how well a simple machine works?",
        answer:
          "Yes, friction reduces the real-world effectiveness of every simple machine. The mechanical advantage calculated in this simulation is the ideal, theoretical value assuming no friction. In real life, a ramp has friction between the object and the ramp surface, pulleys have friction in the wheel axles, and levers have friction at the fulcrum. This means you usually need a bit more force than the ideal calculation predicts. Engineers use lubricants like oil and grease to reduce friction in machines and get closer to the ideal mechanical advantage. Despite friction, simple machines are still enormously helpful because even a reduced mechanical advantage is far better than no machine at all.",
      },
    ],
  },
};
