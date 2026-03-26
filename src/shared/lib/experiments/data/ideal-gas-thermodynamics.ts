import type { Experiment } from "@/shared/types/experiment";

export const idealGasThermodynamics: Experiment = {
  id: "ideal-gas-thermodynamics",
  slug: "ideal-gas-law-pv-diagrams",
  title: "Ideal Gas Law & PV Diagrams",
  subtitle: "Visualize isothermal, isobaric, isochoric, and adiabatic processes",
  description:
    "Manipulate temperature, pressure, and volume of an ideal gas while tracking the state on a live PV diagram. Switch between thermodynamic processes and observe how the First Law of Thermodynamics governs each path.",
  thumbnail: "/imgs/experiments/ideal-gas-thermodynamics.png",

  standards: {
    ngss: ["HS-PS3-1", "HS-PS3-2"],
    gcse: ["P3.1", "P3.2"],
    ap: ["TUL-1.A", "TUL-1.B", "TUL-2.A"],
  },
  primaryStandard: "ap-physics-2",
  category: "thermodynamics",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "ideal gas law",
    "PV diagram",
    "isothermal",
    "isobaric",
    "isochoric",
    "adiabatic",
    "thermodynamics",
    "first law",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "temperature",
      label: "Temperature",
      unit: "K",
      min: 100,
      max: 1000,
      default: 300,
      step: 10,
      tier: "free",
    },
    {
      id: "pressure",
      label: "Pressure",
      unit: "atm",
      min: 0.1,
      max: 10,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "process_type",
      label: "Process (0=Isothermal, 1=Isobaric, 2=Isochoric, 3=Adiabatic)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "moles",
      label: "Amount",
      unit: "mol",
      min: 0.1,
      max: 2,
      default: 1,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "PV = nRT \\quad (R = 8.314\\,\\text{J·mol}^{-1}\\text{K}^{-1})",
      description: "Ideal Gas Law",
    },
    {
      latex: "W = P\\Delta V",
      description: "Work done in isobaric process",
    },
    {
      latex: "W = nRT\\ln\\!\\left(\\frac{V_2}{V_1}\\right)",
      description: "Work done in isothermal process",
    },
    {
      latex: "\\Delta U = Q - W",
      description: "First Law of Thermodynamics",
    },
  ],

  theory:
    "An ideal gas obeys PV = nRT, where R = 8.314 J·mol⁻¹K⁻¹. The four standard thermodynamic processes differ in which state variable is held constant: isothermal (T constant, PV = const), isobaric (P constant, V ∝ T), isochoric (V constant, P ∝ T), and adiabatic (no heat exchange, Q = 0). The PV diagram area under each curve equals the work done by the gas.",
  instructions:
    "Select a process type with the slider, then adjust temperature or pressure to drive the gas through the process. Watch the PV diagram update in real time. Unlock Pro mode to vary the number of moles and compare how different amounts of gas scale the diagram.",

  challenges: [
    {
      id: "igt-c1",
      question: "In an isothermal compression from 4 L to 2 L, what happens to pressure?",
      hint: "Use PV = constant for an isothermal process",
      tier: "free",
    },
    {
      id: "igt-c2",
      question: "An isobaric process heats the gas from 300 K to 600 K. How does volume change?",
      hint: "At constant pressure, V is proportional to T",
      tier: "free",
    },
    {
      id: "igt-c3",
      question: "Which of the four processes does the most work on a PV diagram for the same initial and final states?",
      hint: "Compare the area under each curve on the PV diagram",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["roller-coaster", "simple-harmonic-motion", "fluid-statics"],

  seoTitle: "Ideal Gas Law & PV Diagrams — Interactive Thermodynamics Simulation | NeonPhysics",
  seoKeywords: [
    "ideal gas law",
    "PV diagram",
    "thermodynamics simulation",
    "isothermal process",
    "adiabatic process",
    "AP Physics thermodynamics",
    "first law of thermodynamics",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Ideal Gas Law and Thermodynamic Processes",
  },
};
