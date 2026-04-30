import type { Experiment } from "@/shared/types/experiment";

export const dcCircuitsBasic: Experiment = {
  id: "dc-circuits-basic",
  slug: "dc-circuits-ohms-law-series-parallel",
  title: "DC Circuits — Ohm's Law",
  subtitle: "Series and parallel resistors with live current visualization",
  description:
    "Watch electrons flow through glowing circuit paths. Adjust voltage and resistance to verify Ohm's Law, then switch between series and parallel configurations to see how equivalent resistance and current distribution change in real time.",
  thumbnail: "/imgs/experiments/dc-circuits.png",

  standards: {
    ngss: ["HS-PS3-2", "HS-PS3-3"],
    gcse: ["AQA P2.3", "AQA P2.4"],
    ap: ["CHA-2.A", "CHA-2.B", "CHA-2.C", "CHA-2.D"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "9-12",
  tags: [
    "ohm's law",
    "circuits",
    "series",
    "parallel",
    "resistance",
    "current",
    "voltage",
    "AP Physics 1",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "voltage",
      label: "Battery Voltage",
      unit: "V",
      min: 1,
      max: 24,
      default: 12,
      step: 0.5,
      tier: "free",
    },
    {
      id: "R1",
      label: "Resistor R₁",
      unit: "Ω",
      min: 1,
      max: 100,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "R2",
      label: "Resistor R₂",
      unit: "Ω",
      min: 1,
      max: 100,
      default: 20,
      step: 1,
      tier: "free",
    },
    {
      id: "R3",
      label: "Resistor R₃",
      unit: "Ω",
      min: 1,
      max: 100,
      default: 30,
      step: 1,
      tier: "pro",
    },
    {
      id: "internal_resistance",
      label: "Internal Resistance",
      unit: "Ω",
      min: 0,
      max: 5,
      default: 0,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    { latex: "V = IR", description: "Ohm's Law" },
    {
      latex: "R_{series} = R_1 + R_2 + R_3",
      description: "Series equivalent resistance",
    },
    {
      latex: "\\frac{1}{R_{parallel}} = \\frac{1}{R_1} + \\frac{1}{R_2}",
      description: "Parallel equivalent resistance",
    },
    {
      latex: "P = IV = I^2R = \\frac{V^2}{R}",
      description: "Power dissipated",
    },
  ],

  theory:
    "Ohm's Law states that the current through a conductor is directly proportional to the voltage and inversely proportional to the resistance. In series circuits, resistors share the same current but split the voltage; the equivalent resistance is the sum of individual resistances. In parallel circuits, resistors share the same voltage but split the current; the reciprocal of equivalent resistance equals the sum of reciprocals. Understanding these two configurations is fundamental to analyzing any real-world circuit.",
  instructions:
    "Use the Series / Parallel toggle to switch circuit configurations. Adjust voltage and resistors to observe how current (particle flow speed) and equivalent resistance change. The glowing dots represent electrons — faster movement means higher current. Blue particles flow through R₁, amber through R₂ in parallel mode.",
  challenges: [
    {
      id: "dc-c1",
      question:
        "In a series circuit with V=12V, R₁=10Ω, R₂=20Ω — what is the total current?",
      hint: "Find R_eq first (series), then use I = V / R_eq",
      tier: "free",
    },
    {
      id: "dc-c2",
      question:
        "Switch to parallel with the same values. How does total current change and why?",
      hint:
        "Parallel R_eq is less than either resistor — more current flows from the same voltage",
      tier: "free",
    },
    {
      id: "dc-c3",
      question:
        "In parallel mode, if R₁=10Ω and R₂=30Ω, what fraction of total current flows through R₁?",
      hint:
        "Each branch current: I = V/R. Ratio of currents = R₂/R₁ (inverse of resistance)",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["electromagnetic-induction", "electric-field-lines"],

  seoTitle:
    "DC Circuits — Ohm's Law Series & Parallel | Interactive AP Physics Simulation",
  seoKeywords: [
    "Ohm's law",
    "series circuit",
    "parallel circuit",
    "DC circuits",
    "AP Physics 1",
    "resistance simulation",
    "current voltage",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "DC Circuits, Ohm's Law, Series and Parallel Resistors",
  },

  contentSections: {
    whatIsIt:
      "Open a flashlight and you see the bare bones of a DC circuit: a battery, a switch, a bulb, two wires. Stack two bulbs end-to-end and they share the current; clip them side-by-side instead and they share the voltage. That single choice — series or parallel — changes how bright each bulb glows, how long the battery lasts, and what happens if one bulb burns out. Behind the choice are two conservation laws: charge cannot pile up at a junction (Kirchhoff's current rule) and energy gained going around a loop must equal energy lost (Kirchhoff's voltage rule). Together with V = IR, those rules let you solve any DC network on paper. In the lab below, glowing particles trace the actual electron flow as you toggle topologies, change resistor values, and watch the equivalent resistance update live.",
    parameterExplanations: {
      voltage:
        "The battery's electromotive force in volts. This is the energy the battery hands to each coulomb of charge as it pushes them around the loop. Doubling the voltage doubles the current everywhere when resistors stay fixed.",
      R1:
        "The first resistor's value in ohms. In series mode it adds directly to the total resistance; in parallel mode its current branch is V/R1, independent of the other branches.",
      R2:
        "The second resistor's value in ohms. In series, its voltage drop is I·R2; in parallel, its branch current is V/R2 and it shares the same voltage as R1.",
      R3:
        "The third resistor's value in ohms (Pro tier). Adds another series term or another parallel branch depending on the configuration; useful for verifying that more parallel branches always lower equivalent resistance.",
      internal_resistance:
        "The battery's own resistance in ohms (Pro tier). Real batteries are not ideal — when current flows, some voltage drops inside the battery itself, so the terminal voltage is lower than the labeled EMF. Crank this up and watch the bulb dim under load.",
    },
    misconceptions: [
      {
        wrong:
          "In a series circuit, the bulb closest to the battery is brighter because the current gets used up before it reaches the second bulb.",
        correct:
          "Current is the same everywhere in a single series loop — Kirchhoff's current rule. Two identical bulbs in series glow with identical brightness regardless of order. What gets used is energy, marked by a voltage drop across each bulb, not the count of electrons.",
      },
      {
        wrong:
          "Adding more resistors in parallel makes the total resistance go up, since you're adding more stuff that resists.",
        correct:
          "Each parallel branch is an extra path for current, so adding branches lowers the equivalent resistance below any single branch. Two 10Ω resistors in parallel give 5Ω, three give 3.33Ω. More paths = less total opposition.",
      },
      {
        wrong:
          "If you remove one bulb from a parallel circuit, all the others go out, just like in series Christmas lights.",
        correct:
          "Each parallel branch has its own loop with the battery. Pull one branch out and the others keep their full voltage and current. That is why house wiring is parallel — unplugging the toaster doesn't shut off the lamp.",
      },
      {
        wrong:
          "The battery supplies a fixed amount of current that gets divided up among the resistors.",
        correct:
          "A battery supplies a roughly fixed voltage (its EMF), not a fixed current. The current that flows is set by the rest of the circuit through I = V/R_eq. Lower the equivalent resistance and the same battery delivers more current.",
      },
    ],
    teacherUseCases: [
      "Have students measure I and V for each resistor in series with V = 12, R1 = 10, R2 = 20, then verify Kirchhoff's voltage rule by summing the drops.",
      "Pre-lab prediction: 'will switching from series to parallel make the total current bigger or smaller?' Students write a prediction and reasoning before clicking the toggle.",
      "Plot equivalent resistance vs number of parallel resistors as students add a third 10Ω branch — discover the 1/R rule by data, not derivation.",
      "Misconception probe: pause with two equal bulbs in series and ask 'is the second bulb dimmer than the first?' before revealing the matched currents.",
      "Engineering tie-in: introduce internal resistance, then have students explain why a car's headlights dim when starting the engine using the simulation.",
    ],
    faq: [
      {
        question: "Why does adding resistors in parallel lower the total resistance?",
        answer:
          "Each new branch gives current another road to take, so for the same applied voltage more total current flows — and by R_eq = V/I_total, more current at the same voltage means smaller equivalent resistance. Mathematically 1/R_eq = 1/R1 + 1/R2 + …, so R_eq is always less than the smallest individual resistor.",
      },
      {
        question: "How do I know whether to use series or parallel formulas on a problem?",
        answer:
          "Trace the circuit. If two components share both endpoints (same two nodes), they are in parallel. If a single wire runs from one component into the next with nothing branching off in between, they are in series. Many real circuits combine both — solve in chunks, replacing series or parallel groups with their equivalent until one resistor remains.",
      },
      {
        question: "Why does my simulation show different currents in different parallel branches?",
        answer:
          "Each parallel branch sees the same voltage but its own resistance, so its current is V/R for that branch. A 10Ω branch carries twice the current of a 20Ω branch across the same battery. The battery's total current equals the sum of all branch currents, which is just Kirchhoff's current rule applied at the top node.",
      },
      {
        question: "What does internal resistance do, and why does AP Physics 2 care?",
        answer:
          "Internal resistance r sits in series inside the battery, so the terminal voltage is V_term = EMF − I·r. Under heavy load (small external R), I is large and the terminal voltage sags noticeably. AP Physics 2 standard CHA-2.D expects you to model real batteries this way and explain why a flashlight bulb dims as the battery ages and r grows.",
      },
      {
        question: "How does this lab map to NGSS HS-PS3-2?",
        answer:
          "HS-PS3-2 asks students to develop and use models showing energy conservation in macroscopic systems. Tracking energy from chemical store in the battery to electrical energy in the circuit to thermal energy in the resistors — and verifying that voltage drops sum to the EMF around any loop — is exactly that conservation argument made visible. The simulation lets students check the conservation numerically, not just symbolically.",
      },
    ],
  },
};
