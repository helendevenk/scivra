import type { Experiment } from "@/shared/types/experiment";

export const ohmsLaw: Experiment = {
  id: "ohms-law",
  slug: "ohms-law-voltage-current-resistance",
  title: "Ohm's Law",
  subtitle: "Explore the relationship between voltage, current, and resistance",
  description:
    "Adjust voltage and resistance in a simple circuit and measure current. Verify Ohm's Law (V = IR) and explore how resistors combine in series and parallel configurations.",
  thumbnail: "/imgs/experiments/dc-circuits.png",

  standards: {
    ngss: ["HS-PS3-2"],
    gcse: ["AQA P2.3"],
    ap: ["CHA-2.A", "CHA-2.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["Ohm's law", "voltage", "current", "resistance", "V=IR", "circuit basics"],
  difficulty: "beginner",

  parameters: [
    { id: "voltage", label: "Voltage", unit: "V", min: 0, max: 20, default: 5, step: 0.5, tier: "free" },
    { id: "resistance", label: "Resistance", unit: "Ω", min: 1, max: 1000, default: 100, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "V = IR", description: "Ohm's Law" },
    { latex: "I = \\frac{V}{R}", description: "Current" },
    { latex: "P = IV = I^2R = \\frac{V^2}{R}", description: "Power dissipated" },
  ],

  theory:
    "Ohm's Law states that the current through a conductor is proportional to the applied voltage and inversely proportional to resistance: I = V/R. It applies to ohmic conductors (metals at constant temperature). Non-ohmic devices like diodes and light bulbs deviate from this relationship. Resistance is a material property measuring opposition to current flow. Power dissipated as heat is P = I²R.",
  instructions:
    "Use the voltage slider to change the battery voltage. Use the resistance slider to change the resistor value. The ammeter shows current and the voltmeter shows voltage. Plot V vs I to verify the linear Ohm's Law relationship.",
  challenges: [
    { id: "ol-c1", question: "A 12V source drives a 400Ω resistor. What current flows?", hint: "I = V/R = 12/400 = 0.03 A = 30 mA", tier: "free" },
    { id: "ol-c2", question: "What power is dissipated in the resistor above?", hint: "P = I²R = (0.03)² × 400 = 0.36 W", tier: "free" },
    { id: "ol-c3", question: "A light bulb's resistance increases as it heats up. Why doesn't it obey Ohm's Law?", hint: "Ohm's Law assumes constant temperature; resistance of metals increases with temperature", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["dc-circuits-basic", "resistance-wire", "circuit-dc-virtual-lab"],

  seoTitle: "Ohm's Law Simulation | V=IR | AP Physics 2 Circuit Lab",
  seoKeywords: ["Ohm's law", "V=IR", "voltage current resistance", "circuit basics", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Ohm's Law, Voltage, Current, Resistance" },

  contentSections: {
    whatIsIt:
      "Plug a phone charger into the wall and the brick gets warm — that warmth is Ohm's Law at work. Push electrical pressure (voltage) through a conductor and electrons drift through it; the harder the path resists them, the less current flows. Georg Ohm pinned the relationship in 1827 with a single line: V = IR. For a metal wire held at constant temperature, doubling the voltage doubles the current, and doubling the resistance halves it. The rule is so reliable that engineers size every resistor in your laptop, every filament in a heater, every trace on a circuit board against it. In the lab below, you control the battery voltage and the resistor value, and the ammeter and voltmeter tell you the rest.",
    parameterExplanations: {
      voltage:
        "The electrical pressure the battery applies across the resistor, in volts (joules per coulomb of charge). Push the slider higher and more energy is delivered to each electron passing through, so current rises in lockstep when resistance is fixed.",
      resistance:
        "How strongly the resistor opposes current flow, in ohms. A larger resistance means electrons collide more often with the lattice and lose more energy as heat, so for the same voltage the current drops as 1/R.",
    },
    misconceptions: [
      {
        wrong:
          "Current gets used up when it passes through a resistor, so less comes out the other side.",
        correct:
          "Current is the same all the way around a single loop — what the resistor uses up is energy, not charge. Electrons enter and leave at the same rate; the voltage drops across the resistor because each charge gives up some energy as heat.",
      },
      {
        wrong:
          "Voltage and current are basically the same thing — both measure 'how much electricity' is flowing.",
        correct:
          "Voltage is energy per charge (J/C); current is charge per second (C/s). A 9V battery has high voltage but tiny current through a 1MΩ resistor; a car battery has only 12V but can push hundreds of amps. They are independent quantities related by V = IR.",
      },
      {
        wrong:
          "If I double the voltage on a light bulb, the current doubles and the bulb is just twice as bright.",
        correct:
          "A bulb is non-ohmic. Hotter filament means higher resistance, so doubling the voltage gives less than double the current. Power scales as V²/R, and R itself climbs with temperature, so brightness goes up but the simple V = IR linear scaling breaks down.",
      },
      {
        wrong:
          "Ohm's Law is a universal law of nature like Newton's laws and applies to everything that conducts.",
        correct:
          "V = IR is an empirical relationship that holds for ohmic materials — mostly metals at fixed temperature. Diodes, transistors, electrolytes, plasmas, and incandescent filaments all deviate. AP Physics 2 expects you to state this scope before applying the equation.",
      },
    ],
    teacherUseCases: [
      "Have students record current at five voltages with R fixed, plot I vs V, and extract resistance from the slope of the best-fit line.",
      "Pause the simulation and ask students to predict the new current before they move the resistance slider from 100Ω to 200Ω — then play to check.",
      "Build a power-budget worksheet: at each (V, R) setting, students compute P = V²/R and decide whether a quarter-watt resistor would survive.",
      "Run a misconception probe by asking 'does the same current come out of the resistor as goes in?' before showing the ammeter readings on both sides.",
      "Use the simulation to introduce ohmic vs non-ohmic devices, then have students sketch what an I–V curve for a real lightbulb would look like compared to the straight line they measured.",
    ],
    faq: [
      {
        question: "Why does a thicker wire carry more current at the same voltage?",
        answer:
          "Thicker wire has a larger cross-sectional area, which gives electrons more parallel paths and reduces resistance through R = ρL/A. With the same voltage applied, lower R means higher I = V/R. That is why house wiring uses thick copper for high-current circuits like ovens and thin copper for low-current circuits like lamps.",
      },
      {
        question: "Is V = IR Ohm's Law or just the definition of resistance?",
        answer:
          "Both, depending on context. As a definition, R = V/I is how we measure resistance for any device at any operating point. As Ohm's Law, V = IR is the empirical claim that R stays constant as V changes — true for ohmic conductors like metals at fixed temperature, false for diodes, filaments, and most semiconductors.",
      },
      {
        question: "What happens to the lost electrical energy in a resistor?",
        answer:
          "It becomes heat. Drifting electrons collide with the metal lattice and transfer kinetic energy to atomic vibrations, raising the resistor's temperature. The dissipation rate is P = IV = I²R = V²/R. Heaters, toasters, and incandescent bulbs are designed around this; sensitive electronics include heat sinks to get rid of it.",
      },
      {
        question: "How does this lab map to AP Physics 2 standard CHA-2.A?",
        answer:
          "CHA-2.A asks students to relate current, voltage, and resistance in a single resistor, including the I = V/R relationship and its limits. Adjusting the two sliders, watching the ammeter respond, and predicting the result before each change is exactly the reasoning chain the AP exam tests in multiple-choice and free-response questions on simple resistive circuits.",
      },
      {
        question: "Why does current depend on the entire circuit, not just one resistor?",
        answer:
          "Because charge has to flow in a complete loop. The battery's voltage is divided across every resistor in the loop, and the same current passes through each series element. So the current you measure depends on the equivalent resistance of everything between the battery terminals — change any element and every other current and voltage shifts to satisfy V = IR everywhere at once.",
      },
    ],
  },
};
