import type { Experiment } from "@/shared/types/experiment";

export const buildAMolecule: Experiment = {
  id: "build-a-molecule",
  slug: "build-a-molecule",
  title: "Build a Molecule",
  subtitle: "3D molecular construction with real bond angles",
  description:
    "Construct molecules in 3D by selecting atoms and snapping bonds together. Explore VSEPR geometry — see how electron pairs determine bond angles and molecular shapes. Build water (bent, 104.5°), methane (tetrahedral, 109.5°), carbon dioxide (linear, 180°), ammonia (trigonal pyramidal), and more. Rotate the model freely to understand spatial arrangement.",
  thumbnail: "/imgs/experiments/build-a-molecule.png",

  standards: {
    ngss: ["HS-PS1-1", "HS-PS1-3"],
    gcse: ["C2.1", "C2.3"],
    ap: ["2.B.1", "2.C.4"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: [
    "molecular geometry",
    "VSEPR",
    "3D molecules",
    "bond angles",
    "covalent bonds",
    "AP Chemistry",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "moleculeIndex",
      label: "Molecule",
      unit: "",
      min: 0,
      max: 9,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "showBondAngles",
      label: "Show Bond Angles (0=Off, 1=On)",
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
      latex:
        "\\text{VSEPR: electron domains} \\rightarrow \\text{molecular geometry}",
      description:
        "Electron pairs (bonding + lone) around a central atom determine its 3D shape",
    },
    {
      latex:
        "\\text{Tetrahedral} = 109.5°, \\; \\text{Trigonal planar} = 120°, \\; \\text{Linear} = 180°",
      description: "Ideal bond angles for common electron domain geometries",
    },
  ],

  theory:
    "VSEPR (Valence Shell Electron Pair Repulsion) theory predicts molecular geometry by minimizing electron-pair repulsion around each central atom. Count all electron domains (bonding pairs + lone pairs). Two domains → linear (180°). Three domains → trigonal planar (120°). Four domains → tetrahedral (109.5°). Five → trigonal bipyramidal. Six → octahedral. Lone pairs compress bond angles slightly because they occupy more space than bonding pairs. For example, water has 4 electron domains (2 bonding + 2 lone pairs) giving a tetrahedral electron geometry but a bent molecular shape with a 104.5° angle instead of 109.5°.",

  instructions:
    "Select a molecule from the list. The 3D model builds automatically — drag to rotate, scroll to zoom. Bond angles are shown as arc labels. Toggle the angle display on/off. The info panel shows electron geometry, molecular geometry, and polarity. Compare how lone pairs change the shape: methane (no lone pairs, perfect tetrahedral) vs. water (2 lone pairs, bent).",

  challenges: [
    {
      id: "bam-c1",
      question:
        "Why is water bent (104.5°) instead of linear, even though oxygen has only two bonds?",
      hint: "Oxygen has 4 electron domains (2 bonding + 2 lone pairs). The tetrahedral arrangement of domains gives a bent molecular shape. Lone pairs compress the angle below 109.5°.",
      tier: "free",
    },
    {
      id: "bam-c2",
      question:
        "Predict the molecular geometry of BF₃ and explain why it is different from NH₃.",
      hint: "BF₃ has 3 bonding pairs, 0 lone pairs → trigonal planar (120°). NH₃ has 3 bonding + 1 lone pair → trigonal pyramidal (107°). The lone pair on N pushes bonds closer together.",
      tier: "free",
    },
    {
      id: "bam-c3",
      question:
        "SF₆ has 6 bonding pairs around sulfur. What is its geometry and bond angle?",
      hint: "Octahedral geometry with 90° bond angles. Sulfur is a period-3 element that can expand its octet using d-orbitals.",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["molecular-bonding", "lewis-structures", "molecular-polarity"],
  htmlPath: "/experiments/ap-chemistry/build-a-molecule.html",

  seoTitle: "Build a Molecule 3D Interactive | Scivra AP Chemistry",
  seoKeywords: [
    "build a molecule 3D",
    "VSEPR model interactive",
    "molecular geometry visualizer",
    "bond angles 3D",
    "AP Chemistry VSEPR",
    "3D molecule builder",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Molecular Geometry and VSEPR Theory",
  },
};
