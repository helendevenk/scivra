import type { Experiment } from "@/shared/types/experiment";

export const johnTravoltage: Experiment = {
  id: "john-travoltage",
  slug: "john-travoltage-static-discharge",
  title: "John Travoltage",
  subtitle: "Build up static charge and trigger a spark discharge",
  description:
    "Rub a shoe on carpet to build up static charge, then touch a doorknob to discharge it. Observe how charge accumulates and suddenly releases as a spark, with visual charge distribution maps.",
  thumbnail: "/imgs/experiments/electric-field-lines.png",

  standards: {
    ngss: ["HS-PS2-4"],
    gcse: ["AQA P2.1"],
    ap: ["CHA-1.A", "CHA-1.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["static electricity", "discharge", "spark", "charge accumulation", "electrostatics"],
  difficulty: "beginner",

  parameters: [
    { id: "rub_intensity", label: "Rubbing Intensity", unit: "", min: 1, max: 10, default: 5, step: 1, tier: "free" },
    { id: "humidity", label: "Humidity", unit: "%", min: 10, max: 90, default: 30, step: 5, tier: "pro" },
  ],

  formulas: [
    { latex: "V = \\frac{Q}{C}", description: "Voltage from accumulated charge" },
    { latex: "E_{spark} \\approx 3 \\text{ MV/m}", description: "Air breakdown field" },
  ],

  theory:
    "When a shoe rubs against carpet, electrons transfer from carpet to shoe (or vice versa) due to the triboelectric effect. The accumulated charge creates a voltage across the body. When this voltage is high enough (air breakdown at ~3 MV/m), a spark discharges the built-up charge through the ionized air path. Humidity allows gradual charge leakage, reducing maximum charge buildup.",
  instructions:
    "Click and drag the shoe back and forth across the carpet to accumulate charge. Watch the charge indicator rise. Move the hand toward the doorknob — when it gets close enough, a spark discharges the charge. More rubbing = larger spark.",
  challenges: [
    { id: "jt-c1", question: "Why does the spark jump to the doorknob before you touch it?", hint: "High electric field ionizes air at close distances, creating a conductive path", tier: "free" },
    { id: "jt-c2", question: "Why is static discharge worse in winter than summer?", hint: "Low humidity in winter means less conductive moisture on skin/carpet for gradual discharge", tier: "free" },
    { id: "jt-c3", question: "Why are electronics stored in anti-static bags?", hint: "ESD can damage transistors with voltages as low as 10V — far less than a painful spark", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["balloons-static-electricity", "coulombs-law", "electric-field-lines"],

  seoTitle: "John Travoltage — Static Electricity Discharge | Physics Simulation",
  seoKeywords: ["static electricity", "discharge", "spark", "triboelectric effect", "electrostatics", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Static Electricity, Electric Discharge, Triboelectric Effect" },
};
