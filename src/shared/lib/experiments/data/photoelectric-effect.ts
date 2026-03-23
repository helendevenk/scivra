import type { Experiment } from "@/shared/types/experiment";

export const photoelectricEffect: Experiment = {
  id: "photoelectric-effect",
  slug: "photoelectric-effect-photon-energy-work-function",
  title: "Photoelectric Effect",
  subtitle: "Discover how light frequency — not intensity — ejects electrons",
  description:
    "Illuminate metal surfaces with light of varying frequency and intensity. Observe that photoelectrons only appear above a threshold frequency, and measure stopping voltage to determine maximum kinetic energy.",
  thumbnail: "/imgs/experiments/photoelectric-effect.png",

  standards: {
    ngss: ["HS-PS4-3", "HS-PS4-4"],
    gcse: ["P8.1", "P8.2"],
    ap: ["MOD-1.A", "MOD-1.B", "MOD-1.C"],
  },
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "photoelectric effect",
    "photon",
    "work function",
    "quantum mechanics",
    "Einstein",
    "threshold frequency",
    "stopping voltage",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "light_frequency",
      label: "Light Frequency",
      unit: "×10¹⁴ Hz",
      min: 4,
      max: 10,
      default: 6,
      step: 0.1,
      tier: "free",
    },
    {
      id: "light_intensity",
      label: "Light Intensity",
      unit: "W/m²",
      min: 1,
      max: 100,
      default: 50,
      step: 1,
      tier: "free",
    },
    {
      id: "metal_type",
      label: "Metal (0=Na φ=2.28eV, 1=Al φ=4.08eV, 2=Cu φ=4.5eV)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "pro",
    },
    {
      id: "stopping_voltage",
      label: "Stopping Voltage",
      unit: "V",
      min: 0,
      max: 5,
      default: 0,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "E = hf \\quad (h = 6.626 \\times 10^{-34}\\,\\text{J·s})",
      description: "Photon Energy",
    },
    {
      latex: "KE_{max} = hf - \\varphi",
      description: "Einstein Photoelectric Equation",
    },
    {
      latex: "eV_{stop} = KE_{max}",
      description: "Stopping Voltage relation",
    },
    {
      latex: "f_{threshold} = \\frac{\\varphi}{h}",
      description: "Threshold Frequency",
    },
  ],

  theory:
    "Einstein's 1905 explanation of the photoelectric effect treats light as discrete photons each carrying energy E = hf. An electron can only escape the metal surface if a single photon supplies energy exceeding the work function φ. Intensity controls how many photons arrive per second but does not increase individual photon energy, so higher intensity below threshold still produces zero photoelectrons.",
  instructions:
    "Increase light frequency until the electron counter starts registering — that is the threshold frequency. Note that raising intensity below threshold never produces electrons. Switch to Pro mode to select different metals and measure the stopping voltage that exactly halts the fastest electrons.",

  challenges: [
    {
      id: "pe-c1",
      question:
        "Why does increasing light intensity below the threshold frequency produce NO photoelectrons?",
      hint: "Think about what a single photon's energy depends on",
      tier: "free",
    },
    {
      id: "pe-c2",
      question:
        "Sodium has a work function φ = 2.28 eV. What is the minimum threshold frequency?",
      hint: "Use f_threshold = φ/h, convert φ to joules first",
      tier: "free",
    },
    {
      id: "pe-c3",
      question:
        "Light of f = 5 × 10¹⁴ Hz shines on copper (φ = 4.5 eV). Are photoelectrons emitted?",
      hint: "Calculate photon energy E = hf and compare with φ",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["atomic-structure", "em-spectrum", "wave-interference"],

  seoTitle: "Photoelectric Effect — Photon Energy & Work Function Simulation | NeonPhysics",
  seoKeywords: [
    "photoelectric effect",
    "photon energy",
    "work function",
    "Einstein",
    "threshold frequency",
    "quantum physics simulation",
    "AP Physics modern physics",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Photoelectric Effect and Quantum Nature of Light",
  },
};
