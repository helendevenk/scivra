import type { Experiment } from "@/shared/types/experiment";

export const msElectricCircuitsAdvanced: Experiment = {
  id: "ms-electric-circuits-advanced",
  slug: "ms-electric-circuits-advanced",
  title: "Electric Circuits",
  subtitle: "Build series and parallel circuits with resistors, bulbs, and switches",
  description:
    "Construct series and parallel circuits by placing resistors, light bulbs, and switches on a virtual breadboard. Measure voltage, current, and resistance at any point. Compare how bulb brightness changes in series vs parallel configurations, and discover why your house uses parallel wiring — so one burnt-out bulb does not kill every light on the floor.",
  thumbnail: "/imgs/experiments/ms-electric-circuits-advanced.png",

  standards: {
    ngss: ["MS-PS2-3"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "electricity",
  subject: "physics",
  gradeLevel: "6-8",
  tags: [
    "electric circuits",
    "series parallel",
    "Ohm's law",
    "voltage",
    "current",
    "resistance",
    "middle school",
    "6-8",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "circuitType",
      label: "Circuit Type (0=Series, 1=Parallel, 2=Combination)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "voltage",
      label: "Battery Voltage",
      unit: "V",
      min: 1,
      max: 12,
      default: 6,
      step: 0.5,
      tier: "free",
    },
    {
      id: "resistance",
      label: "Resistor Value",
      unit: "Ω",
      min: 1,
      max: 100,
      default: 10,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "V = I \\times R \\quad \\text{(Ohm's law)}",
      description:
        "Voltage equals current times resistance — the fundamental relationship in any circuit",
    },
    {
      latex: "P = I \\times V = I^2 R = \\frac{V^2}{R} \\quad \\text{(electrical power)}",
      description:
        "Power consumed by a component, measured in watts — determines bulb brightness and heat output",
    },
  ],

  theory:
    "Electric circuits are closed loops where current (flowing electrons) carries energy from a source (battery) through components (resistors, bulbs) and back. Ohm's Law (V=IR) connects the three key quantities: voltage (V, the 'push' measured in volts), current (I, the flow rate in amps), and resistance (R, opposition to flow in ohms). In a series circuit, components are connected end-to-end — the same current flows through each, but voltage splits across them. Total resistance adds up: R_total = R1 + R2 + R3. If one bulb burns out, the circuit breaks and all bulbs go dark. In a parallel circuit, components connect across the same two points — each gets the full battery voltage, but current splits among them. Total resistance decreases: 1/R_total = 1/R1 + 1/R2 + 1/R3. If one bulb burns out, the others stay lit. That is why homes use parallel circuits: you can turn off one lamp without losing all electricity. Power (P=IV) tells you how much energy a component uses per second. A brighter bulb consumes more power.",

  instructions:
    "Choose a circuit type: Series, Parallel, or Combination. Adjust the battery voltage and resistor values. Watch current flow animate through the wires — thicker arrows mean more current. Read the ammeter and voltmeter displays at each component. Compare bulb brightness between series and parallel: in series, adding more bulbs makes each dimmer; in parallel, each bulb stays equally bright.",

  challenges: [
    {
      id: "mec-c1",
      question:
        "Two 10 Ω resistors are connected in series to a 6 V battery. What is the total resistance? What current flows through the circuit?",
      hint: "Series: R_total = 10 + 10 = 20 Ω. Using Ohm's law: I = V/R = 6/20 = 0.3 A. Each resistor gets half the voltage: 3 V across each.",
      tier: "free",
    },
    {
      id: "mec-c2",
      question:
        "The same two 10 Ω resistors are now connected in parallel to the same 6 V battery. What is the total resistance? What total current flows?",
      hint: "Parallel: 1/R_total = 1/10 + 1/10 = 2/10, so R_total = 5 Ω. I = V/R = 6/5 = 1.2 A total. Each branch carries 0.6 A. Notice the parallel circuit draws 4 times more current than the series circuit!",
      tier: "free",
    },
    {
      id: "mec-c3",
      question:
        "In a series circuit with three bulbs, you unscrew one. What happens to the other two? What about in a parallel circuit?",
      hint: "Series: unscrewing one bulb breaks the only path for current — all bulbs go dark. Parallel: each bulb has its own path to the battery, so the other two stay lit at full brightness. This is exactly why holiday lights wired in series all go out when one bulb fails, while your home outlets (parallel) work independently.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["dc-circuits-basic", "resistance-wire"],

  htmlPath: "/experiments/middle/ms-electric-circuits-advanced.html",

  seoTitle: "Electric Circuits: Series & Parallel | Scivra Middle School Physics",
  seoKeywords: [
    "electric circuits simulation middle school",
    "series parallel circuits interactive",
    "Ohm's law simulation 6-8",
    "voltage current resistance experiment",
    "NGSS MS-PS2-3 circuits",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Electric Circuits — Series and Parallel",
  },
};
