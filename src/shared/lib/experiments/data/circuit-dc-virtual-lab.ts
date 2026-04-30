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
    ngss: ["HS-PS3-2", "HS-PS3-3"],
    gcse: ["AQA P2.3", "AQA P2.4"],
    ap: ["CHA-2.A", "CHA-2.B", "CHA-2.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["DC circuits", "breadboard", "multimeter", "Kirchhoff's laws", "voltage", "current", "resistance"],
  difficulty: "intermediate",

  parameters: [
    { id: "battery_voltage", label: "Battery Voltage", unit: "V", min: 1.5, max: 24, default: 9, step: 0.5, tier: "free" },
    { id: "r1", label: "R₁", unit: "Ω", min: 1, max: 1000, default: 100, step: 1, tier: "free" },
    { id: "r2", label: "R₂", unit: "Ω", min: 1, max: 1000, default: 200, step: 1, tier: "free" },
    { id: "r3", label: "R₃", unit: "Ω", min: 1, max: 1000, default: 300, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "V = IR", description: "Ohm's Law" },
    { latex: "\\sum V = 0", description: "Kirchhoff's Voltage Law (KVL)" },
    { latex: "\\sum I = 0", description: "Kirchhoff's Current Law (KCL)" },
  ],

  theory:
    "Kirchhoff's laws govern DC circuit analysis. KVL states that the sum of voltage drops around any closed loop equals zero (energy conservation). KCL states that the sum of currents at any node equals zero (charge conservation). Together they allow systematic solution of any DC circuit. Ohm's Law (V=IR) connects voltage, current, and resistance at each element.",
  instructions:
    "Drag components onto the virtual breadboard and connect them with wires. Use the multimeter to probe voltages and currents. Switch between series and parallel configurations. Verify KVL by summing voltages around a loop.",
  challenges: [
    { id: "cd-c1", question: "In a series circuit with 9V and three equal 100Ω resistors, what is the voltage across each?", hint: "Total R = 300Ω, I = 9/300 = 30mA, V = IR = 3V each", tier: "free" },
    { id: "cd-c2", question: "Three 300Ω resistors in parallel across 9V — what is the total current?", hint: "R_eq = 100Ω, I_total = 9/100 = 90mA", tier: "free" },
    { id: "cd-c3", question: "Apply KCL at the top node of a parallel circuit to find the branch currents.", hint: "I_total = I₁ + I₂ + I₃; each branch: I = V/R", tier: "pro" },
  ],

  wave: 8,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["dc-circuits-basic", "circuit-ac-virtual-lab", "ohms-law"],

  seoTitle: "DC Circuit Virtual Lab | Kirchhoff's Laws | AP Physics 2",
  seoKeywords: ["DC circuit", "breadboard", "Kirchhoff's laws", "multimeter", "AP Physics 2", "virtual lab"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "DC Circuits, Kirchhoff's Laws" },

  contentSections: {
    whatIsIt:
      "Most physics labs end where real engineering starts: at the breadboard. Drop a battery, three resistors, and a multimeter on a virtual board, run wires between rows, and you can build any DC network you can sketch. Probe a node with the red lead and the multimeter shows you a voltage; clip it inline and it shows you a current. Behind every reading sit two conservation laws — Kirchhoff's voltage rule (energy gained around a loop equals energy lost) and Kirchhoff's current rule (charge in equals charge out at every node) — combined with V = IR at each component. AP Physics 2 expects students not just to memorize the formulas but to take real measurements, compare them to predictions, and explain mismatches. In the lab below, build a circuit, predict the meter reading, then probe it and see how close you got.",
    parameterExplanations: {
      battery_voltage:
        "The battery's EMF in volts, ranging from a 1.5 V cell to a 24 V supply. This is the energy delivered per coulomb pushed through the external circuit; multimeter readings on every component scale linearly with this value when resistors stay fixed.",
      r1:
        "The value of the first resistor in ohms. Use this in series with a battery for the simplest V = IR check, or as one branch of a parallel network to compare branch currents.",
      r2:
        "The value of the second resistor in ohms. Combine with R1 in series to test KVL by summing drops, or in parallel to test KCL by summing branch currents at the top node.",
      r3:
        "The third resistor in ohms (Pro tier). Lets you build mixed series-parallel networks — the kind that show up on AP free-response questions — so students can practice replacing groups with equivalents.",
    },
    misconceptions: [
      {
        wrong:
          "An ammeter has to go in parallel with the resistor I'm measuring, like a voltmeter does.",
        correct:
          "Ammeters go in series, voltmeters go in parallel. An ammeter measures the current through a wire, so it has to be cut into the wire's path; a voltmeter measures the voltage across two points, so it bridges them. Wiring an ammeter in parallel essentially short-circuits whatever it is across.",
      },
      {
        wrong:
          "Kirchhoff's voltage rule says voltage gets used up around the loop until it runs out at the end.",
        correct:
          "KVL says energy per charge gained from the battery equals energy per charge dropped across all resistors in the loop — they sum to zero, not 'run out'. The same charge that left the battery returns with zero net energy; in between, gains and losses must balance exactly.",
      },
      {
        wrong:
          "The current splits evenly between two parallel resistors no matter what their values are.",
        correct:
          "Branches share voltage, not current. Two parallel resistors get the same V, so their currents are V/R1 and V/R2. Equal currents only if R1 = R2; otherwise the smaller resistor pulls more current.",
      },
      {
        wrong:
          "If I read 0 V across a resistor, my multimeter is broken.",
        correct:
          "Zero volts across a resistor means zero current through it (V = IR). That can happen if the branch is open, if it is wired in parallel with a wire, or if the rest of the circuit is balanced (Wheatstone bridge case). Check the topology before blaming the meter.",
      },
    ],
    teacherUseCases: [
      "Build a three-resistor series circuit; have each pair record V across each resistor, then verify KVL by summing the drops and comparing to the battery EMF.",
      "Predict-then-measure: students draw the circuit, calculate every current and voltage on paper, then probe with the multimeter and report any mismatches over 5%.",
      "Misconception probe: ask 'where do you put the ammeter to measure current through R2?' before letting students wire it in.",
      "Lab challenge: design a circuit that delivers exactly 50 mA through R1 using only the battery and three resistors, then build and verify it.",
      "Pair work on a mixed network — one student computes equivalent resistance step by step, the other measures it directly across the battery terminals; reconcile any difference.",
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
          "Pick a direction around each loop, label voltage rises (going through the battery from − to +) as positive and drops (going through a resistor in the direction of current) as negative, and write the sum equal to zero for each loop. You'll get one equation per loop; combined with Kirchhoff's current rule at each node, the system has enough equations to solve every unknown current.",
      },
      {
        question: "What's the difference between Ohm's Law and Kirchhoff's laws?",
        answer:
          "Ohm's Law is local — it relates V, I, and R at a single resistor (and only for ohmic materials at fixed T). Kirchhoff's laws are global — they enforce energy and charge conservation across the whole network. To solve a circuit you need both: KVL and KCL set up the system, V = IR fills in each individual element.",
      },
      {
        question: "How does this map to AP Physics 2 standard CHA-2.B?",
        answer:
          "CHA-2.B asks students to use Kirchhoff's laws to analyze multi-loop DC circuits. The virtual breadboard is the simulation analog of the lab AP graders expect students to have done — wiring components, choosing measurement points, and explaining how readings confirm KVL and KCL. Free-response questions on circuits routinely ask exactly this measurement-and-explanation pattern.",
      },
      {
        question: "Why does adding a wire across two points sometimes drop a resistor's current to zero?",
        answer:
          "You created a short circuit around it. The wire has near-zero resistance, so almost all the current bypasses the resistor through the wire. The resistor still has zero volts across it (V = IR with I ≈ 0). This is also why it is dangerous to short a battery — without something to limit current, the wire and battery can melt or explode.",
      },
    ],
  },
};
