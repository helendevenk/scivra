import type { Experiment } from "@/shared/types/experiment";

export const circuitDcVirtualLab: Experiment = {
  id: "circuit-dc-virtual-lab",
  slug: "circuit-dc-virtual-lab",
  title: "DC Circuit Virtual Lab",
  subtitle: "Build and measure DC circuits with a virtual breadboard",
  description:
    "Wire up DC circuits on a virtual breadboard. Use a multimeter to measure voltage and current, verify Kirchhoff's laws, and analyze series/parallel networks.",
  thumbnail: "/imgs/experiments/dc-circuits.png",

  standards: {
    ngss: ["HS-PS3-2"],
    gcse: ["AQA P2.3", "AQA P2.4"],
    ap: ["11.5.A", "11.6.A", "11.7.A", "11.8.A"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["DC circuits", "breadboard", "multimeter", "Kirchhoff's laws", "voltage", "current", "resistance"],
  difficulty: "intermediate",

  parameters: [
    { id: "voltage", label: "EMF / Voltage", unit: "V", min: 1.5, max: 9, default: 4.5, step: 0.5, tier: "free" },
    { id: "r1", label: "R₁", unit: "Ω", min: 100, max: 10000, default: 1000, step: 100, tier: "free" },
    { id: "r2", label: "R₂", unit: "Ω", min: 100, max: 10000, default: 1000, step: 100, tier: "free" },
    { id: "capacitance", label: "Capacitance", unit: "μF", min: 1, max: 100, default: 47, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "V = IR", description: "Ohm's Law" },
    { latex: "\\sum V = 0", description: "Kirchhoff's Voltage Law (KVL)" },
    { latex: "\\sum I = 0", description: "Kirchhoff's Current Law (KCL)" },
    { latex: "\\tau = RC", description: "RC time constant — characteristic charging/discharging timescale" },
  ],

  theory:
    "Kirchhoff's laws govern DC circuit analysis. KVL states that the sum of voltage drops around any closed loop equals zero (energy conservation). KCL states that the sum of currents at any node equals zero (charge conservation). Together they allow systematic solution of any DC circuit. Ohm's Law (V=IR) connects voltage, current, and resistance at each element.",
  instructions:
    "Use the four sliders — EMF / Voltage, R₁, R₂, and Capacitance — to test how source voltage, resistance, and charge storage shape a DC circuit. Try the Voltage Divider, Wheatstone Bridge, and RC Charging presets to compare Ohm's Law relationships, voltage ratios, balanced-node behavior, and the RC time constant τ = RC.",
  challenges: [
    { id: "cd-c1", question: "With 4.5 V across a 1 kΩ and 2 kΩ series voltage divider, what voltage appears across the 2 kΩ resistor?", hint: "Use V₂ = Vtotal × R₂ / (R₁ + R₂) = 4.5 × 2000 / 3000 = 3.0 V", tier: "free" },
    { id: "cd-c2", question: "If R₁ and R₂ are both 1 kΩ across a 4.5 V source, how do their currents compare?", hint: "Equal resistances across the same voltage carry equal current: I = V/R for each branch or matched leg.", tier: "free" },
    { id: "cd-c3", question: "For an RC charging circuit with R = 1 kΩ and C = 47 μF, what is the time constant?", hint: "τ = RC = 1000 × 47×10⁻⁶ = 0.047 s, or 47 ms.", tier: "pro" },
  ],

  wave: 8,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["dc-circuits-basic", "circuit-ac-virtual-lab", "ohms-law"],

  seoTitle: "DC Circuit Virtual Lab | Kirchhoff's Laws | AP Physics 2",
  seoKeywords: ["DC circuit", "breadboard", "Kirchhoff's laws", "multimeter", "AP Physics 2", "virtual lab"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "DC Circuits, Kirchhoff's Laws" },
  htmlControlAliases: { voltage: "sl-emf", r1: "sl-r1", r2: "sl-r2", capacitance: "sl-c" },
  presets: [
    { id: "divider", label: "Voltage Divider", paramValues: { voltage: 4.5, r1: 1000, r2: 2000, capacitance: 47 } },
    { id: "bridge", label: "Wheatstone Bridge", paramValues: { voltage: 4.5, r1: 1000, r2: 1000, capacitance: 47 } },
    { id: "rc", label: "RC Charging", paramValues: { voltage: 4.5, r1: 1000, r2: 1000, capacitance: 47 } },
  ],

  contentSections: {
    whatIsIt:
      "Most physics labs end where real engineering starts: at the breadboard. Drop a battery, three resistors, and a multimeter on a virtual board, run wires between rows, and you can build any DC network you can sketch. Probe a node with the red lead and the multimeter shows you a voltage; clip it inline and it shows you a current. Behind every reading sit two conservation laws — Kirchhoff's voltage rule (energy gained around a loop equals energy lost) and Kirchhoff's current rule (charge in equals charge out at every node) — combined with V = IR at each component. AP Physics 2 expects students not just to memorize the formulas but to take real measurements, compare them to predictions, and explain mismatches. In the lab below, build a circuit, predict the meter reading, then probe it and see how close you got.",
    parameterExplanations: {
      voltage:
        "EMF / Voltage is the source energy supplied per coulomb of charge, measured in volts. In AP Physics 1 and HS-PS3 circuit language, increasing the source voltage increases the energy available to transfer through the circuit. For a fixed R₁ and R₂, Ohm's Law predicts larger current because I = V/R. In a voltage divider, the same slider also scales each resistor's voltage drop while preserving the ratio set by resistance. Change only voltage first, then compare meter readings across the presets to see which quantities change proportionally and which ratios stay controlled by circuit structure.",
      r1:
        "R₁ is one adjustable resistance in the circuit, measured in ohms. Resistance describes how strongly a component limits charge flow and converts electrical energy into thermal energy. In a series or divider setup, increasing R₁ raises the total resistance and lowers the circuit current for the same EMF. It also changes how the source voltage is shared: the larger resistance gets the larger voltage drop. For HS-PS3-2 energy-transfer analysis, R₁ helps students connect a mathematical model, V = IR, to observable changes in brightness, meter readings, and power distribution.",
      r2:
        "R₂ is the second adjustable resistance, measured in ohms. Comparing R₂ against R₁ is the fastest way to separate two ideas students often mix up: current through a series path is common, but voltage drops divide in proportion to resistance; parallel branches share voltage while carrying different currents. In the Voltage Divider preset, raising R₂ increases the fraction of source voltage measured across it. In the Series and Parallel measurement views, changing R₂ lets students test Ohm's Law predictions directly with voltage and current readings.",
      capacitance:
        "Capacitance measures how much charge a capacitor stores for each volt across it, in microfarads. In an RC circuit, the capacitor does not instantly jump to the source voltage; it charges over time because current through the resistance changes as charge accumulates. The key model is the time constant τ = RC. A larger capacitance stores more charge at the same voltage and makes the charging curve slower, giving students a direct bridge between energy storage, electric potential difference, and mathematical modeling. Use the RC Charging preset, then vary only capacitance to see how the time scale changes.",
    },
    misconceptions: [
      {
        wrong:
          "An ammeter has to go in parallel with the resistor I'm measuring, like a voltmeter does.",
        correct:
          "Ammeters go in series, voltmeters go in parallel. An ammeter measures the current through a path, so it has to be inserted into that path; a voltmeter measures the voltage across two points, so it bridges them. Wiring an ammeter in parallel can create a near-short path and change the circuit you meant to measure.",
      },
      {
        wrong:
          "Kirchhoff's voltage rule says voltage gets used up around the loop until it runs out at the end.",
        correct:
          "KVL says energy per charge gained from the source equals energy per charge dropped across circuit elements in the loop — the signed changes sum to zero. Voltage is not a substance that disappears; it is a difference in electric potential energy per charge between two points.",
      },
      {
        wrong:
          "The current splits evenly between two paths no matter what the resistor values are.",
        correct:
          "Branches share voltage, not necessarily current. If two branches have the same voltage across them, their currents are set by I = V/R. Equal currents require equal resistance. Otherwise, the lower-resistance path carries more current.",
      },
      {
        wrong:
          "A capacitor in a DC circuit blocks everything, so it never matters.",
        correct:
          "A capacitor changes a DC circuit during charging and discharging. Right after connection, current can flow while charge builds on the plates; later, the current decreases as the capacitor voltage approaches the source voltage. The resistance and capacitance together set the time scale.",
      },
    ],
    teacherUseCases: [
      "Use the Voltage Divider preset; have students record EMF / Voltage, R₁, and R₂, calculate the expected divider output, then verify it with the meter and connect the result to HS-PS3-2 energy transfer.",
      "Run a one-variable investigation: keep R₁, R₂, and Capacitance fixed while changing only EMF / Voltage, then ask students to graph current or voltage drop and defend the Ohm's Law relationship.",
      "Use the Voltage Divider preset as a measurement case. Students predict the voltage across R₂ from V₂ = Vtotal × R₂ / (R₁ + R₂), then change one resistor and compare the prediction with the multimeter reading.",
      "Use the RC Charging preset to introduce τ = RC. Students change Capacitance from low to high, compare charging time, and explain how electrical energy is stored in the capacitor field.",
      "AP-style lab discussion: assign groups different combinations of R₁ and R₂, require a prediction before measurement, and have them cite EMF / Voltage, resistance values, and preset choice as evidence in a short CER response.",
    ],
    faq: [
      {
        question: "Why do real multimeter readings sometimes disagree with my paper calculation?",
        answer:
          "Three usual suspects: ammeters have a small but nonzero resistance, voltmeters have a large but finite resistance and pull a tiny current, and real wires are not perfect conductors. AP Physics 2 mostly idealizes these away, but you should expect about 1–2% error even in good simulations and noticeably more with real benchtop gear.",
      },
      {
        question: "How do I apply KVL to a circuit with two loops?",
        answer:
          "Pick a direction around each loop, label voltage rises through the source from − to + as positive and drops across resistive elements in the direction of current as negative, and write the sum equal to zero for each loop. Combine those loop equations with Kirchhoff's current rule at shared nodes. In this lab, the Voltage Divider and basic series/parallel measurements are good places to compare loop reasoning with direct meter readings.",
      },
      {
        question: "What's the difference between Ohm's Law and Kirchhoff's laws?",
        answer:
          "Ohm's Law is local — it relates V, I, and R at a single ohmic component. Kirchhoff's laws are global — they enforce energy and charge conservation across the whole network. To solve a circuit you often need both: KVL and KCL set up relationships around loops and at nodes, while V = IR fills in each resistor's voltage-current relationship.",
      },
      {
        question: "How does this map to AP Physics 2 standard CHA-2.A?",
        answer:
          "CHA-2.A asks students to model current and resistance in DC circuits, applying Ohm's Law (V = IR) at every component while using Kirchhoff's voltage and current laws to constrain the network. The virtual breadboard is the simulation analog of the lab AP graders expect students to have done — wiring components, choosing measurement points, and explaining how readings confirm V = IR alongside KVL and KCL. Free-response questions on circuits routinely ask exactly this measurement-and-explanation pattern.",
      },
      {
        question: "Why does the RC Charging preset change slowly instead of instantly?",
        answer:
          "A capacitor stores charge, so its voltage changes as charge accumulates on its plates. The circuit current is largest at the start of charging and then decreases as the capacitor voltage approaches the source voltage. The time constant τ = RC sets the pace: increasing resistance or capacitance makes the charging process take longer.",
      },
    ],
  },
};
