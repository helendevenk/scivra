import type { Experiment } from "@/shared/types/experiment";

export const molecularBonding: Experiment = {
  id: "molecular-bonding",
  slug: "molecular-bonding",
  title: "Molecular Structure & Chemical Bonding",
  subtitle: "VSEPR theory and molecular geometry in 3D",
  description:
    "Build molecules atom by atom and watch their 3D geometry emerge from VSEPR theory. Explore Lewis structures, bond angles, and how lone pairs distort geometry. Compare ionic, covalent, and polar covalent bonds. Rotate and inspect water, methane, ammonia, CO₂, and custom molecules.",
  thumbnail: "/imgs/experiments/molecular-bonding.png",

  standards: {
    ngss: ["HS-PS1-1", "HS-PS1-2"],
    gcse: ["C3.1", "C3.2"],
    ap: ["2.A.1", "2.A.2", "2.B.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: ["VSEPR", "Lewis structure", "molecular geometry", "bond angle", "polarity", "AP Chemistry"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "molecule",
      label: "Molecule (0=H₂O, 1=CH₄, 2=NH₃, 3=CO₂, 4=BF₃, 5=SF₆)",
      unit: "",
      min: 0,
      max: 5,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "bondType",
      label: "Bond Display (0=stick, 1=ball-stick, 2=spacefill)",
      unit: "",
      min: 0,
      max: 2,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "showDipoles",
      label: "Show Dipole Moments",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
      tier: "pro",
    },
    {
      id: "showLonePairs",
      label: "Show Lone Pairs",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\text{VSEPR: electron pairs repel} \\to \\text{geometry minimizes repulsion}",
      description: "Valence Shell Electron Pair Repulsion theory",
    },
    {
      latex: "\\text{H}_2\\text{O: bent (104.5°), NH}_3\\text{: trigonal pyramidal (107°)}",
      description: "Lone pairs compress bond angles below ideal",
    },
    {
      latex: "\\vec{\\mu} = q \\cdot d \\quad (\\text{dipole moment: charge} \\times \\text{distance})",
      description: "Dipole moment — measure of bond polarity",
    },
  ],

  theory:
    "Chemical bonding determines molecular geometry, polarity, and reactivity. Covalent bonds form when atoms share electrons; the electronegativity difference determines polarity (nonpolar < 0.5, polar 0.5-1.7, ionic > 1.7). VSEPR theory predicts 3D geometry: electron pairs (bonding + lone) arrange to minimize repulsion. Lone pairs repel more strongly than bonding pairs, compressing bond angles. Linear (180°): CO₂, BeCl₂. Trigonal planar (120°): BF₃. Tetrahedral (109.5°): CH₄. Bent (104.5°): H₂O (2 lone pairs). Trigonal pyramidal (107°): NH₃ (1 lone pair). Octahedral (90°): SF₆. Net molecular dipole moment = vector sum of all bond dipoles.",

  instructions:
    "Select a molecule from the dropdown. The 3D model builds automatically showing atoms, bonds, and lone pairs. Rotate with mouse to inspect all angles. Toggle dipole arrows to see individual bond dipoles and the net molecular dipole. Switch to spacefill mode to see van der Waals radii.",

  challenges: [
    {
      id: "mb-c1",
      question: "Water has 2 bonding pairs and 2 lone pairs. What geometry does VSEPR predict, and what is the bond angle?",
      hint: "4 electron pairs → tetrahedral electron geometry. But 2 lone pairs → bent molecular geometry. Bond angle ≈ 104.5° (less than 109.5° due to lone pair compression).",
      tier: "free",
    },
    {
      id: "mb-c2",
      question: "Why is CO₂ nonpolar even though C=O bonds are polar?",
      hint: "CO₂ is linear (180°). The two C=O bond dipoles point in exactly opposite directions → they cancel → net dipole = 0.",
      tier: "free",
    },
    {
      id: "mb-c3",
      question: "What is the electron geometry and molecular geometry of NH₃?",
      hint: "N has 3 bonding pairs + 1 lone pair = 4 electron pairs → tetrahedral electron geometry. Molecular geometry = trigonal pyramidal (ignore lone pair).",
      tier: "free",
    },
    {
      id: "mb-c4",
      question: "SF₆ has 6 bonding pairs around S. What geometry does it adopt and what are the bond angles?",
      hint: "6 electron pairs → octahedral geometry, all bond angles 90°. No lone pairs, so molecular geometry = octahedral.",
      tier: "pro",
    },
  ],

  wave: 4,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["reaction-kinetics", "thermochemistry"],

  seoTitle: "Molecular Structure & VSEPR Theory — 3D Interactive | Scivra AP Chemistry",
  seoKeywords: [
    "VSEPR theory 3D",
    "molecular geometry simulation",
    "Lewis structure interactive",
    "bond angle chemistry",
    "AP Chemistry bonding",
    "dipole moment visualizer",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Molecular Structure and Chemical Bonding",
  },
};
