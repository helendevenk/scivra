import type { Experiment } from "@/shared/types/experiment";

export const electronConfiguration: Experiment = {
  id: "electron-configuration",
  slug: "electron-configuration",
  title: "Electron Configuration",
  subtitle: "Aufbau principle, orbital filling, and energy levels",
  description:
    "Visualize how electrons fill atomic orbitals according to the Aufbau principle, Pauli exclusion, and Hund's rule. Select any element (Z = 1–36) and watch electrons populate the Bohr model and orbital diagram simultaneously. Explore electron configurations, noble gas shorthand, and exceptions like chromium and copper.",
  thumbnail: "/imgs/experiments/electron-configuration.png",

  standards: {
    ngss: ["HS-PS1-1"],
    gcse: ["C1.3", "C1.4"],
    ap: ["1.B.1", "1.C.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: [
    "electron configuration",
    "atomic orbitals",
    "Aufbau principle",
    "Hund rule",
    "quantum numbers",
    "AP Chemistry",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "atomicNumber",
      label: "Atomic Number (Z)",
      unit: "",
      min: 1,
      max: 36,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "showOrbitalDiagram",
      label: "Show Orbital Diagram (0=Off, 1=On)",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "1s \\rightarrow 2s \\rightarrow 2p \\rightarrow 3s \\rightarrow 3p \\rightarrow 4s \\rightarrow 3d \\rightarrow 4p",
      description: "Aufbau filling order: electrons fill lowest-energy orbitals first",
    },
    {
      latex: "n + l \\text{ rule: lower } (n+l) \\text{ fills first; if equal, lower } n \\text{ fills first}",
      description: "Madelung rule determines orbital energy ordering",
    },
  ],

  theory:
    "Electrons in atoms occupy orbitals — regions of space described by quantum numbers (n, l, ml, ms). The Aufbau principle states that electrons fill from lowest to highest energy. Each orbital holds at most 2 electrons with opposite spins (Pauli exclusion principle). When filling degenerate orbitals (same energy), electrons spread out with parallel spins first (Hund's rule). The filling order follows the (n+l) rule: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p... Notable exceptions: Cr is [Ar] 3d⁵4s¹ (half-filled d stability) and Cu is [Ar] 3d¹⁰4s¹ (fully-filled d stability). Electron configuration determines chemical properties and periodic trends.",

  instructions:
    "Use the slider or element buttons to select an element. Watch the Bohr model animate electrons into shells, while the orbital diagram fills boxes according to the Aufbau order. The notation panel shows both full and noble gas shorthand configurations. Pay attention to the 3d/4s crossover and the Cr/Cu exceptions.",

  challenges: [
    {
      id: "ec-c1",
      question: "Write the electron configuration for oxygen (Z = 8).",
      hint: "1s² 2s² 2p⁴. Oxygen has 8 electrons: 2 in 1s, 2 in 2s, 4 in 2p.",
      tier: "free",
    },
    {
      id: "ec-c2",
      question: "Why does chromium (Z = 24) have configuration [Ar] 3d⁵4s¹ instead of [Ar] 3d⁴4s²?",
      hint: "A half-filled d subshell (3d⁵) has extra stability due to exchange energy. Promoting one 4s electron to 3d gives lower total energy.",
      tier: "free",
    },
    {
      id: "ec-c3",
      question: "What is the electron configuration of Fe²⁺ (iron ion)?",
      hint: "Fe is [Ar] 3d⁶4s². When ionized, 4s electrons are removed first: Fe²⁺ = [Ar] 3d⁶.",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["atomic-structure", "molecular-bonding"],
  htmlPath: "/experiments/ap-chemistry/electron-configuration.html",

  seoTitle: "Electron Configuration Interactive Visualizer | Scivra AP Chemistry",
  seoKeywords: [
    "electron configuration",
    "orbital filling diagram",
    "Aufbau principle simulation",
    "Bohr model interactive",
    "AP Chemistry atomic structure",
    "electron orbital visualizer",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Electron Configuration and Orbital Theory",
  },
};
