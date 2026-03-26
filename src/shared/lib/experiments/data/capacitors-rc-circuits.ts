import type { Experiment } from "@/shared/types/experiment";

export const capacitorsRcCircuits: Experiment = {
  id: "capacitors-rc-circuits",
  slug: "capacitors-charging-discharging-rc-circuits",
  title: "Capacitors & RC Circuits",
  subtitle: "Watch exponential charging and discharging governed by the RC time constant",
  description:
    "Connect a capacitor and resistor in series with a battery and observe the exponential voltage curve as the capacitor charges and discharges. Explore how plate geometry determines capacitance and how the RC time constant controls the speed of energy storage.",
  thumbnail: "/imgs/experiments/capacitors-rc-circuits.png",

  standards: {
    ngss: ["HS-PS2-6", "HS-PS3-3"],
    gcse: ["P6.5", "P6.6"],
    ap: ["CHA-2.E", "CHA-2.F", "CHA-4.A"],
  },
  primaryStandard: "ap-physics-c",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "capacitor",
    "RC circuit",
    "time constant",
    "charging",
    "discharging",
    "exponential decay",
    "capacitance",
    "energy storage",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "capacitance",
      label: "Capacitance",
      unit: "μF",
      min: 1,
      max: 1000,
      default: 100,
      step: 1,
      tier: "free",
    },
    {
      id: "resistance",
      label: "Resistance",
      unit: "kΩ",
      min: 1,
      max: 100,
      default: 10,
      step: 1,
      tier: "free",
    },
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
      id: "plate_area",
      label: "Plate Area",
      unit: "cm²",
      min: 10,
      max: 500,
      default: 100,
      step: 10,
      tier: "pro",
    },
    {
      id: "plate_separation",
      label: "Plate Separation",
      unit: "mm",
      min: 1,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "C = \\frac{Q}{V} = \\frac{\\varepsilon_0 A}{d}",
      description: "Capacitance from geometry",
    },
    {
      latex: "V(t) = V_0\\left(1 - e^{-t/RC}\\right)",
      description: "Charging voltage over time",
    },
    {
      latex: "V(t) = V_0\\,e^{-t/RC}",
      description: "Discharging voltage over time",
    },
    {
      latex: "\\tau = RC",
      description: "RC time constant",
    },
    {
      latex: "U = \\frac{1}{2}CV^2",
      description: "Energy stored in capacitor",
    },
  ],

  theory:
    "A capacitor stores charge on two parallel plates separated by a dielectric. Its capacitance C = ε₀A/d depends on plate area A and separation d. In an RC circuit, charging follows V(t) = V₀(1 − e^(−t/RC)) and discharging follows V(t) = V₀e^(−t/RC). The time constant τ = RC is the time to reach approximately 63% of the final voltage during charging, and the energy stored at full charge is U = ½CV².",
  instructions:
    "Set capacitance, resistance, and battery voltage with the free-tier sliders, then click Charge to watch the exponential curve build up. Click Discharge to release the stored energy. Unlock Pro mode to adjust plate geometry and see how it directly maps to capacitance.",

  challenges: [
    {
      id: "rc-c1",
      question: "With τ = RC = 2 s, what fraction of V₀ has the capacitor reached at t = 2 s?",
      hint: "Use V(t) = V₀(1 − e^(−t/τ)) and evaluate at t = τ",
      tier: "free",
    },
    {
      id: "rc-c2",
      question: "If you increase the plate separation d, how does capacitance change?",
      hint: "Use C = ε₀A/d and think about the direction of the change",
      tier: "free",
    },
    {
      id: "rc-c3",
      question:
        "Two identical capacitors are connected in parallel, then separately in series. What is the total capacitance in each case?",
      hint: "Parallel: C_total = C₁ + C₂; Series: 1/C_total = 1/C₁ + 1/C₂",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["electric-potential-voltage", "dc-circuits-basic", "electromagnetic-induction"],

  seoTitle: "Capacitors & RC Circuits — Charging Discharging Simulation | NeonPhysics",
  seoKeywords: [
    "capacitor",
    "RC circuit",
    "time constant",
    "charging discharging",
    "exponential decay",
    "capacitance formula",
    "AP Physics electricity",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Capacitors, RC Circuits, and Exponential Charging",
  },
};
