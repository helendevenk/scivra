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
};
