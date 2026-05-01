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
  contentSections: {
    whatIsIt:
      "Electric circuits are closed loops that carry electrical energy from a battery through components like light bulbs and resistors and back again. Think of electricity like water flowing through pipes: the battery is a pump, the wires are pipes, and resistors are narrow sections that slow the flow. Two fundamental circuit designs exist. In a series circuit, all components sit in one single loop — like beads on a necklace. The same current flows through every component, but the voltage gets divided up. If one bulb burns out, the whole circuit breaks and everything goes dark. In a parallel circuit, each component has its own separate path back to the battery — like lanes on a highway. Every component gets the full battery voltage, and if one bulb burns out the others stay lit. Your home uses parallel wiring for exactly that reason. This simulation lets you switch between series, parallel, and combination circuits, adjust the battery voltage, and change the resistor value to see how current and brightness respond in real time.",
    parameterExplanations: {
      circuitType:
        "Selects which circuit layout the simulation displays. Set to 0 for a series circuit where components are in one single loop, 1 for a parallel circuit where each component has its own branch, and 2 for a combination circuit that mixes both. Switching between these lets you directly compare how current and voltage are distributed in each layout.",
      voltage:
        "The battery voltage in volts (V), adjustable from 1 V to 12 V. Higher voltage provides a stronger 'push' that drives more current through the circuit. In everyday terms, a 1.5 V AA battery is near the low end; a 9 V rectangular battery is near the middle of this range. Doubling the voltage doubles the current if resistance stays the same.",
      resistance:
        "The resistance of each resistor in ohms (Ω), adjustable from 1 Ω to 100 Ω. Higher resistance opposes the flow of current more strongly, like a narrower pipe restricts water flow. In a series circuit, resistances add together, so total resistance grows with each component. In a parallel circuit, adding more paths actually lowers the total resistance.",
    },
    misconceptions: [
      {
        wrong: "Current gets used up as it travels through a circuit, so less comes out than went in.",
        correct:
          "Current is not consumed — it is a flow rate, like water circulating in a loop. The same number of electrons that leave the battery return to it. What gets used up is energy, which the battery provides and the resistors or bulbs convert to light and heat. Ammeters placed anywhere in a series circuit read the same current.",
      },
      {
        wrong: "Adding more bulbs in series makes the circuit brighter because there is more stuff to glow.",
        correct:
          "Adding bulbs in series increases total resistance, which reduces current throughout the entire circuit. Each bulb therefore glows dimmer, not brighter. In a parallel circuit the story is different — each bulb gets the full battery voltage and stays equally bright regardless of how many bulbs are added.",
      },
      {
        wrong: "Voltage and current are the same thing.",
        correct:
          "Voltage is the 'push' or electrical pressure that drives current — measured in volts. Current is the actual flow of electrons — measured in amps. You can have high voltage with low current (like a static shock: high voltage, tiny current) or low voltage with high current (like a car battery starter: 12 V but hundreds of amps). Ohm's Law links them: V = I × R.",
      },
      {
        wrong: "In a parallel circuit, the battery runs out faster because more current flows in total.",
        correct:
          "This is actually true in one sense: parallel circuits do draw more total current, so the battery does drain faster. But each individual branch gets the full voltage and works independently, which is why homes use parallel wiring — you want each outlet to operate at full power without affecting others, even if it means the source works harder.",
      },
    ],
    teacherUseCases: [
      "Series vs. parallel brightness comparison: set circuitType to 0 (series) with voltage at 6 V and resistance at 10 Ω. Note the bulb brightness. Then switch circuitType to 1 (parallel) with the same voltage and resistance settings. Ask students to explain why the parallel bulbs appear brighter. Expected finding: parallel bulbs each receive the full 6 V, while series bulbs share the voltage.",
      "Ohm's Law verification: keep circuitType at 0 (series) and resistance at 20 Ω. Increase voltage from 2 V to 4 V to 8 V in steps. Students record the current shown at each voltage and confirm it doubles each time voltage doubles — directly verifying V = I × R for a constant resistor.",
      "Real-world connection — household wiring: set circuitType to 2 (combination) to show a mixed circuit. Ask students why electricians wire outlets in parallel but may wire some indicator lights in series with a resistor. This bridges the simulation to MS-PS2-3 and everyday engineering decisions.",
      "Resistance exploration: hold voltage at 6 V and circuitType at 0. Sweep resistance from 5 Ω to 50 Ω in steps and have students graph current versus resistance. The inverse relationship (higher resistance, lower current) reinforces Ohm's Law visually before students encounter the formula.",
    ],
    faq: [
      {
        question: "Why do Christmas lights sometimes all go out when one bulb fails?",
        answer:
          "Older holiday light strings wire bulbs in series, forming one continuous loop. When a single bulb's filament breaks, it creates a gap — an open circuit — and current can no longer flow anywhere in the loop. That is why every bulb goes dark. Modern LED strings often use parallel or mixed wiring so that one failed LED does not take down the whole string. This is a direct real-world example of the difference between series and parallel circuits covered in MS-PS2-3.",
      },
      {
        question: "What does resistance actually do inside a wire or bulb?",
        answer:
          "Resistance is the opposition to electron flow caused by atoms inside the material bumping into moving electrons. In a light bulb, the thin tungsten filament has high resistance — electrons lose energy colliding with tungsten atoms, and that energy is released as heat and light. In a thick copper wire, resistance is very low, so almost no energy is lost in transit. Every real conductor has some resistance; superconductors (very special materials near absolute zero) are the exception.",
      },
      {
        question: "Which NGSS standard does this experiment address?",
        answer:
          "The simulation primarily supports MS-PS2-3: ask questions about data to determine the factors that affect the strength of electric and magnetic forces. By adjusting voltage, resistance, and circuit type while observing current and brightness, students gather evidence about how these variables are related — directly practicing the science and engineering practice of analyzing and interpreting data in the context of electrical forces and energy transfer.",
      },
      {
        question: "Why does adding resistors in parallel lower the total resistance?",
        answer:
          "Think of water flowing through pipes. One pipe offers a certain resistance to flow. Add a second pipe alongside it and you have doubled the total cross-section available — water (or current) can now flow through either path, so overall resistance to flow goes down. Mathematically, 1/R_total = 1/R1 + 1/R2. Two identical 10 Ω resistors in parallel give 5 Ω total — half, not double. This is counterintuitive but makes perfect sense with the water-pipe analogy.",
      },
      {
        question: "Can I damage the simulation by setting very high voltage and very low resistance?",
        answer:
          "No — the simulation is safe to explore at any parameter combination within the allowed ranges (voltage 1–12 V, resistance 1–100 Ω). In a real circuit, very high current caused by low resistance could overheat wires or blow a fuse, which is exactly why real circuits include fuses and circuit breakers as safety devices. Exploring extreme values in the simulation is a great way to understand why those safety devices exist.",
      },
    ],
  },
};
