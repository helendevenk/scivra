import type { Experiment } from "@/shared/types/experiment";

export const cellStructure3d: Experiment = {
  id: "cell-structure-3d",
  slug: "cell-structure-3d",
  title: "Cell Structure 3D",
  subtitle:
    "Interactive 3D exploration of eukaryotic cell organelles and their functions",
  description:
    "Explore a detailed 3D model of a eukaryotic animal cell. Rotate, zoom, and click on organelles to learn about their structure and function. Compare plant and animal cells side by side. Visualize the endomembrane system, energy organelles, and cytoskeleton in an interactive 3D environment.",
  thumbnail: "/imgs/experiments/cell-structure-3d.png",

  standards: {
    ngss: ["HS-LS1-2"],
    gcse: [],
    ap: ["2.A.1", "2.B.1", "2.B.3", "4.A.2"],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: [
    "cell structure",
    "organelles",
    "3D cell model",
    "nucleus",
    "mitochondria",
    "endoplasmic reticulum",
    "Golgi apparatus",
    "AP Biology",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "cellType",
      label: "Cell Type (0=Animal, 1=Plant)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "transparency",
      label: "Membrane Transparency",
      unit: "%",
      min: 10,
      max: 90,
      default: 50,
      step: 10,
      tier: "free",
    },
    {
      id: "showLabels",
      label: "Show Labels (0=Off, 1=On)",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "highlightSystem",
      label: "System (0=All 1=Endomembrane 2=Energy 3=Cytoskeleton)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\text{SA:V} = \\frac{4\\pi r^2}{\\frac{4}{3}\\pi r^3} = \\frac{3}{r}",
      description:
        "Surface area to volume ratio decreases as cell size increases, limiting cell growth",
    },
    {
      latex:
        "\\text{ATP} = 36\\text{-}38 \\text{ per glucose (mitochondria)}",
      description:
        "Mitochondrial oxidative phosphorylation produces the majority of cellular ATP",
    },
  ],

  theory:
    "Eukaryotic cells contain membrane-bound organelles that compartmentalize cellular functions. The nucleus houses DNA and controls gene expression. The rough endoplasmic reticulum (RER) synthesizes proteins destined for membranes or export, while the smooth ER (SER) synthesizes lipids and detoxifies compounds. The Golgi apparatus modifies, sorts, and packages proteins for secretion or lysosomal delivery. Mitochondria generate ATP through oxidative phosphorylation (cellular respiration). Lysosomes contain hydrolytic enzymes for intracellular digestion. The cytoskeleton (microfilaments, intermediate filaments, microtubules) provides structural support, enables movement, and organizes intracellular transport. Plant cells additionally have a rigid cell wall, chloroplasts for photosynthesis, and a large central vacuole for turgor pressure. The endomembrane system (ER → Golgi → lysosomes → plasma membrane) represents a continuous pathway of membrane flow.",

  instructions:
    "Rotate the 3D cell by dragging. Scroll to zoom. Click on any organelle to highlight it and read its description. Use the Cell Type toggle to compare animal and plant cells. Adjust transparency to see internal structures. Select a system to highlight only endomembrane, energy, or cytoskeletal components.",

  challenges: [
    {
      id: "cs-c1",
      question:
        "Why do cells need a large surface area to volume ratio? What limits cell size?",
      hint: "Nutrients and waste must cross the membrane (surface area) to serve the entire cell volume. As radius doubles, volume increases 8× but surface area only 4×.",
      tier: "free",
    },
    {
      id: "cs-c2",
      question:
        "Trace the path of a secreted protein from gene to export.",
      hint: "DNA (nucleus) → mRNA → ribosome on RER → ER lumen → transport vesicle → Golgi → secretory vesicle → plasma membrane → exocytosis.",
      tier: "free",
    },
    {
      id: "cs-c3",
      question:
        "What structures do plant cells have that animal cells lack? What functions do they serve?",
      hint: "Cell wall (structural support), chloroplasts (photosynthesis), large central vacuole (turgor pressure, storage), plasmodesmata (cell-cell communication).",
      tier: "pro",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 30,
  relatedExperiments: ["cell-division", "dna-double-helix"],
  htmlPath: "/experiments/ap-biology/cell-structure-3d.html",

  seoTitle: "3D Cell Structure Explorer | Scivra AP Biology",
  seoKeywords: [
    "3D cell model interactive",
    "cell organelles virtual lab",
    "eukaryotic cell explorer",
    "plant vs animal cell 3D",
    "AP Biology cell structure",
    "organelle function interactive",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Eukaryotic Cell Structure and Organelle Function",
  },
};
