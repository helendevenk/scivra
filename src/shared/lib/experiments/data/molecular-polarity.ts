import type { Experiment } from "@/shared/types/experiment";

export const molecularPolarity: Experiment = {
  id: "molecular-polarity",
  slug: "molecular-polarity",
  title: "Molecular Polarity",
  subtitle: "Visualize dipole moments and electron density in 3D",
  description:
    "Explore how molecular geometry and electronegativity differences create polar and nonpolar molecules. View 3D electron density clouds that show where electrons spend more time. Observe how individual bond dipoles combine into a net molecular dipole moment — or cancel to zero in symmetric molecules.",
  thumbnail: "/imgs/experiments/molecular-polarity.png",

  standards: {
    ngss: ["HS-PS1-1", "HS-PS1-3"],
    gcse: [],
    ap: ["2.C.1", "2.C.4"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: [
    "molecular polarity",
    "dipole moment",
    "electronegativity",
    "electron density",
    "polar bonds",
    "AP Chemistry",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "moleculeIndex",
      label: "Molecule",
      unit: "",
      min: 0,
      max: 7,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "showDipoles",
      label: "Show Bond Dipoles (0=Off, 1=On)",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "showCloud",
      label: "Show Electron Cloud (0=Off, 1=On)",
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
      latex: "\\vec{\\mu} = q \\times d",
      description:
        "Dipole moment: product of partial charge magnitude and bond distance (units: Debye)",
    },
    {
      latex:
        "\\vec{\\mu}_{\\text{net}} = \\sum_i \\vec{\\mu}_i",
      description:
        "Net molecular dipole is the vector sum of all bond dipole moments",
    },
  ],

  theory:
    "A bond is polar when two atoms have different electronegativities — the more electronegative atom pulls electron density toward itself, creating a partial negative charge (δ⁻) and leaving the other end partially positive (δ⁺). Each polar bond has a dipole moment vector pointing from δ⁺ to δ⁻. The net molecular dipole is the vector sum of all bond dipoles. In symmetric molecules like CO₂ or CCl₄, bond dipoles cancel perfectly (net μ = 0, nonpolar). In asymmetric molecules like H₂O or CHCl₃, dipoles add up to a nonzero net moment (polar). Polarity determines solubility, boiling point, and intermolecular forces.",

  instructions:
    "Select a molecule to view its 3D structure with electron density cloud. Blue regions show higher electron density (δ⁻), red regions show electron-poor areas (δ⁺). Bond dipole arrows point from positive to negative. The net dipole arrow (yellow) shows the overall molecular polarity. Toggle dipoles and electron cloud on/off. Rotate the model to see how geometry affects polarity.",

  challenges: [
    {
      id: "mp-c1",
      question:
        "CO₂ has two polar C=O bonds. Why is the molecule nonpolar overall?",
      hint: "CO₂ is linear — the two bond dipoles point in opposite directions and cancel exactly, giving net μ = 0.",
      tier: "free",
    },
    {
      id: "mp-c2",
      question:
        "Both H₂O and CO₂ have polar bonds. Why does water dissolve salt but CO₂ does not?",
      hint: "Water is bent, so its bond dipoles add to a large net dipole (1.85 D), making it an excellent polar solvent. CO₂ is linear with zero net dipole — it is nonpolar.",
      tier: "free",
    },
    {
      id: "mp-c3",
      question:
        "Predict whether CHCl₃ (chloroform) is polar or nonpolar, and explain why.",
      hint: "CHCl₃ is polar (μ ≈ 1.04 D). It has tetrahedral geometry but the four substituents are not identical — three Cl atoms vs one H — so bond dipoles do not cancel.",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["build-a-molecule", "lewis-structures", "molecular-bonding"],
  htmlPath: "/experiments/ap-chemistry/molecular-polarity.html",

  seoTitle: "Molecular Polarity 3D Visualization | Scivra AP Chemistry",
  seoKeywords: [
    "molecular polarity simulation",
    "dipole moment visualizer",
    "electron density 3D",
    "polar vs nonpolar interactive",
    "AP Chemistry polarity",
    "electronegativity visualization",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Molecular Polarity and Dipole Moments",
  },
};
