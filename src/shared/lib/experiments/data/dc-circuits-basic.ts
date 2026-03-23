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
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
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
};
