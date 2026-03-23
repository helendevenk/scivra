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

  seoTitle: "Simple Machines for Kids | Lever Pulley Interactive | NeonPhysics",
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
};
