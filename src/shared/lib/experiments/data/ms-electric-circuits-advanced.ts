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
    ngss: ["4-PS3-2"],
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
      id: "voltage",
      label: "Voltage",
      unit: "V",
      min: 1,
      max: 24,
      default: 12,
      step: 1,
      tier: "free",
    },
    {
      id: "r1",
      label: "R₁",
      unit: "Ω",
      min: 1,
      max: 500,
      default: 100,
      step: 5,
      tier: "free",
    },
    {
      id: "r2",
      label: "R₂",
      unit: "Ω",
      min: 1,
      max: 500,
      default: 200,
      step: 5,
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
    "Use the Voltage, R₁, and R₂ sliders to test Ohm's Law (V = IR) with two resistive parts. Choose the Series R₁ + R₂ preset to see resistances add and current stay the same through one path. Choose the Parallel R₁ ‖ R₂ preset to see branches share voltage while current splits. Choose the RC Charging Circuit preset to connect circuit resistance to energy storage and charging behavior. Change one slider at a time, then compare the current, voltage, and visual response across the three presets.",

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
  htmlControlAliases: { voltage: "sl-volt", r1: "sl-r1", r2: "sl-r2" },
  presets: [
    {
      id: "series",
      label: "Series R₁ + R₂",
      description:
        "Places R₁ and R₂ in one path so total resistance adds and the same current moves through both components.",
      paramValues: { voltage: 12, r1: 100, r2: 200 },
    },
    {
      id: "parallel",
      label: "Parallel R₁ ‖ R₂",
      description:
        "Places R₁ and R₂ on separate branches so each branch has the full source voltage while total current splits.",
      paramValues: { voltage: 12, r1: 100, r2: 200 },
    },
    {
      id: "rc",
      label: "RC Charging Circuit",
      description:
        "Shows how circuit resistance affects the rate of charging when electrical energy is stored in a capacitor.",
      paramValues: { voltage: 12, r1: 100, r2: 200 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Electric circuits are closed loops that carry electrical energy from a battery through components like light bulbs and resistors and back again. Think of electricity like water flowing through pipes: the battery is a pump, the wires are pipes, and resistors are narrow sections that slow the flow. Two fundamental circuit designs exist. In a series circuit, all components sit in one single loop — like beads on a necklace. The same current flows through every component, but the voltage gets divided up. If one bulb burns out, the whole circuit breaks and everything goes dark. In a parallel circuit, each component has its own separate path back to the battery — like lanes on a highway. Every component gets the full battery voltage, and if one bulb burns out the others stay lit. Your home uses parallel wiring for exactly that reason. This simulation lets you switch between series, parallel, and combination circuits, adjust the battery voltage, and change the resistor value to see how current and brightness respond in real time.",
    parameterExplanations: {
      voltage:
        "Voltage is the electrical push supplied by the source, measured in volts. In this simulation, the Voltage slider changes that push from 1 V to 24 V. When R₁ and R₂ stay the same, increasing voltage increases current because Ohm's Law says I = V/R. That makes the relationship between cause and measurement visible: more voltage across the same resistance means more charge flows each second. Middle school students can use this slider to ask testable questions about electric force and energy transfer, then compare evidence across the Series, Parallel, and RC Charging Circuit presets.",
      r1:
        "R₁ is the first resistor, measured in ohms. A resistor makes it harder for current to flow, so raising R₁ usually lowers current when voltage stays fixed. Its effect depends on the preset. In Series R₁ + R₂, R₁ adds directly to R₂, so both resistors help set one total resistance for the only current path. In Parallel R₁ ‖ R₂, R₁ controls one branch while R₂ controls another branch. Changing only R₁ helps students separate variables, compare current paths, and connect observations to V = IR instead of treating resistance as an invisible idea.",
      r2:
        "R₂ is the second resistor, also measured in ohms. It gives students a second adjustable load so they can compare equal and unequal circuits rather than only changing one resistance value. In a series circuit, increasing R₂ increases total resistance and reduces the same current through both components. In a parallel circuit, R₂ changes the current in its own branch while the other branch still depends on R₁. In the RC preset, resistance helps shape how quickly stored electrical energy builds during charging. This supports middle school reasoning about factors that affect electric interactions and energy changes.",
    },
    misconceptions: [
      {
        wrong: "Current gets used up as it travels through a circuit, so less comes out than went in.",
        correct:
          "Current is not consumed — it is a flow rate, like water circulating in a loop. In the Series R₁ + R₂ preset, the same current moves through R₁ and R₂ because there is only one path. What changes across components is energy per charge, shown as voltage differences. The battery supplies energy, and the resistors or bulbs convert that energy to light and heat.",
      },
      {
        wrong: "Adding more resistance in series makes the circuit brighter because there is more stuff to glow.",
        correct:
          "In the Series R₁ + R₂ preset, raising R₁ or R₂ increases total resistance, which reduces current throughout the entire loop. Components usually get dimmer, not brighter, because less current flows. In the Parallel R₁ ‖ R₂ preset, each branch gets the full source voltage, so changing one branch does not remove voltage from the other branch in the same way.",
      },
      {
        wrong: "Voltage and current are the same thing.",
        correct:
          "Voltage is the electrical push or energy per charge, and current is the rate that charge flows. The Voltage slider changes the push from the source, while R₁ and R₂ change how strongly the circuit opposes flow. You can test the difference by holding R₁ and R₂ constant and increasing Voltage: current rises because V = I × R links the quantities, but they are not identical.",
      },
      {
        wrong: "Parallel circuits waste energy or make each branch weaker because the current has to split.",
        correct:
          "In the Parallel R₁ ‖ R₂ preset, each branch receives the full source voltage independently. Current does split between R₁ and R₂, but that does not mean each branch is automatically weaker. The trade-off is that total current drawn from the battery can increase when more branches are available, so the source supplies energy faster overall.",
      },
    ],
    teacherUseCases: [
      "Ohm's Law slider investigation: start with the Series R₁ + R₂ preset, keep R₁ at 100 Ω and R₂ at 200 Ω, then move Voltage from 6 V to 12 V to 24 V. Students record current and explain why doubling voltage doubles current when total resistance stays constant.",
      "Series resistance evidence task: use the Series R₁ + R₂ preset at 12 V, then compare R₁ = 100 Ω / R₂ = 200 Ω with a higher R₂ value. Students calculate R_total = R₁ + R₂ and connect the lower current to MS-PS2-3 data analysis about factors that affect electric interactions.",
      "Parallel branch comparison: choose the Parallel R₁ ‖ R₂ preset, keep Voltage at 12 V, and set R₁ and R₂ to different values. Students predict which branch carries more current, then use the display to support a claim that lower resistance allows greater current in that branch.",
      "Preset contrast discussion: have groups run Series R₁ + R₂ and Parallel R₁ ‖ R₂ with the same Voltage, R₁, and R₂ values. They compare total resistance, current paths, and brightness or power indicators, then explain why homes use parallel wiring.",
      "RC charging energy connection: select the RC Charging Circuit preset, keep Voltage constant, and vary R₁ and R₂ one at a time. Students describe how resistance changes the charging rate and connect the pattern to electrical energy transfer while keeping the NGSS MS-PS2-3 circuit evidence focus intact.",
    ],
    faq: [
      {
        question: "Why do Christmas lights sometimes all go out when one bulb fails?",
        answer:
          "Older holiday light strings wire bulbs in series, forming one continuous loop. When a single bulb's filament breaks, it creates a gap — an open circuit — and current can no longer flow anywhere in the loop. That is why every bulb goes dark. Modern LED strings often use parallel or mixed wiring so that one failed LED does not take down the whole string. Use the Series R₁ + R₂ and Parallel R₁ ‖ R₂ presets to compare those two path designs.",
      },
      {
        question: "What does resistance actually do inside a wire or bulb?",
        answer:
          "Resistance is the opposition to electron flow caused by atoms inside the material bumping into moving electrons. In a light bulb, the thin tungsten filament has high resistance — electrons lose energy colliding with tungsten atoms, and that energy is released as heat and light. In a thick copper wire, resistance is very low, so almost no energy is lost in transit. In this simulation, R₁ and R₂ let you change two separate resistive parts and compare their effects.",
      },
      {
        question: "Which NGSS standard does this experiment address?",
        answer:
          "The simulation primarily supports MS-PS2-3: ask questions about data to determine the factors that affect the strength of electric and magnetic forces. By adjusting Voltage, R₁, and R₂ while comparing the Series, Parallel, and RC Charging Circuit presets, students gather evidence about how circuit layout and resistance affect current, voltage distribution, and energy transfer.",
      },
      {
        question: "Why does adding resistors in parallel lower the total resistance?",
        answer:
          "Think of water flowing through pipes. One pipe offers a certain resistance to flow. Add a second pipe alongside it and you have doubled the total cross-section available — water (or current) can now flow through either path, so overall resistance to flow goes down. Mathematically, 1/R_total = 1/R₁ + 1/R₂. Use the Parallel R₁ ‖ R₂ preset and compare it with Series R₁ + R₂ using the same slider values.",
      },
      {
        question: "Can I damage the simulation by setting very high voltage and very low resistance?",
        answer:
          "No — the simulation is safe to explore at any parameter combination within the allowed ranges: Voltage from 1–24 V, R₁ from 1–500 Ω, and R₂ from 1–500 Ω. In a real circuit, high voltage with very low resistance can create large current that overheats wires or blows a fuse. Exploring those extremes here is a safe way to understand why real circuits include fuses and circuit breakers.",
      },
    ],
  },
};
