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
  contentSections: {
    whatIsIt:
      "A eukaryotic cell is a microscopic city — every organelle is a department with a specific job, all enclosed within a phospholipid membrane wall. Your liver cells, muscle cells, and the plant cells in a spinach leaf all share this compartmentalized design. The nucleus acts as city hall, housing DNA and issuing instructions via mRNA. The mitochondria are the power plants, converting glucose into 36–38 ATP molecules per cycle. The endomembrane system — rough ER, Golgi, and lysosomes — handles manufacturing, shipping, and waste disposal. Plant cells add a chloroplast solar panel and a central vacuole that inflates like a water balloon to keep stems upright. Toggle the highlightSystem control to isolate each subsystem and watch how organelles cluster by function.",
    parameterExplanations: {
      cellType:
        "Switches the rendered model between an animal cell (0) and a plant cell (1). Plant cells gain a rigid cell wall, chloroplasts, and a large central vacuole; animal cells retain centrioles for cell division. Use this toggle to run side-by-side structural comparisons.",
      transparency:
        "Sets how opaque the plasma membrane appears, from 10 % (nearly solid) to 90 % (nearly invisible). Increasing transparency lets you see internal organelle arrangement without rotating; decreasing it restores the sense of the cell as a bounded compartment.",
      showLabels:
        "Turns organelle name labels on (1) or off (0) in the 3D viewport. Hiding labels is useful for self-quizzing — identify each structure by shape and position before re-enabling them to check.",
      highlightSystem:
        "Dims all organelles except those belonging to a chosen functional group: 0 = all visible, 1 = endomembrane system (ER, Golgi, lysosomes, vesicles), 2 = energy organelles (mitochondria; chloroplasts in plant mode), 3 = cytoskeleton (microfilaments, intermediate filaments, microtubules). Use this to trace the path of a secreted protein end-to-end.",
    },
    misconceptions: [
      {
        wrong:
          "Students often think the cell membrane is a rigid wall that keeps things in or out absolutely.",
        correct:
          "The plasma membrane is a fluid phospholipid bilayer — it is selectively permeable, not a sealed barrier. Lipid-soluble molecules pass through the bilayer directly; polar molecules and ions need specific protein channels or pumps. 'Fluid' means the lipid molecules move laterally, giving the membrane flexibility and the ability to fuse with vesicles.",
      },
      {
        wrong:
          "I think the mitochondria just 'make' ATP out of nothing — it creates energy.",
        correct:
          "Mitochondria do not create energy; they transfer chemical energy stored in glucose into the more usable form of ATP. The energy originally came from sunlight captured in sugars. AP Bio Big Idea 2 (Energetics) is explicit: living systems capture and use free energy, they do not generate it.",
      },
      {
        wrong:
          "The nucleus is the most important organelle — without it, the cell immediately dies.",
        correct:
          "Red blood cells lack nuclei and survive for ~120 days. The nucleus is essential for long-term protein production and cell division, but a cell can function on existing proteins for hours to days without one. Importance depends on the cell type and timescale.",
      },
      {
        wrong:
          "Plant and animal cells have completely different organelles with almost nothing in common.",
        correct:
          "Both cell types share nucleus, mitochondria, ribosomes, ER, Golgi, and plasma membrane. Plant cells have additional structures — cell wall, chloroplasts, central vacuole — but the shared core machinery reflects their common eukaryotic ancestor (AP Bio 2.A.1, HS-LS1-2).",
      },
    ],
    teacherUseCases: [
      "Pre-lab sketch: before opening the simulation, ask students to draw an animal cell and a plant cell from memory, then toggle cellType between 0 and 1 and list every structure that appears or disappears — records the functional differences as a data table.",
      "System trace: set highlightSystem to 1 (endomembrane) and challenge students to narrate the full route of a secreted protein from ribosome on rough ER through Golgi to exocytosis — links AP Bio 4.A.2 to a spatial model.",
      "Misconception probe: show the energy system (highlightSystem = 2) and ask 'Where does the energy in ATP come from?' — use wrong answers to launch the glucose oxidation discussion and correct the 'mitochondria create energy' error.",
      "SA:V data collection: using the formula SA:V = 3/r, have students calculate ratios for cells of radius 1, 5, 10, and 50 μm, then correlate with why cells stay small — connects the formula card to the model's scale.",
      "Plant vs animal comparison quiz: hide labels (showLabels = 0), display plant mode, and have students click each organelle and name it before checking — builds identification fluency before the AP free-response cell-structure question.",
    ],
    faq: [
      {
        question: "What is the difference between the rough ER and the smooth ER?",
        answer:
          "Rough ER is studded with ribosomes and specializes in synthesizing proteins destined for membranes, secretion, or lysosomes. Smooth ER lacks ribosomes and instead synthesizes lipids, steroid hormones, and detoxifies drugs. Liver cells are packed with smooth ER for exactly that detoxification role.",
      },
      {
        question: "Why do cells need membrane-bound compartments at all?",
        answer:
          "Compartmentalization keeps incompatible reactions separated — lysosomal digestive enzymes at pH 5 would destroy cytoplasmic proteins if mixed. It also concentrates reactants, speeding up pathways like oxidative phosphorylation, which depends on the proton gradient across the inner mitochondrial membrane.",
      },
      {
        question: "How does this relate to AP Bio standard 2.B.1 and HS-LS1-2?",
        answer:
          "AP Bio 2.B.1 requires students to explain how the structure of cell membranes results in selective permeability. HS-LS1-2 asks students to develop and use models to illustrate the hierarchical organization of cells, tissues, and organs. This simulation directly addresses both: toggle systems to see membrane-defined compartments in context.",
      },
      {
        question: "Why are plant cells generally larger than animal cells?",
        answer:
          "The rigid cell wall and central vacuole allow plant cells to maintain turgor pressure that supports large cell volumes without requiring the cell to synthesize as much cytoplasm. Animal cells lack this support structure and tend to stay under 20 μm to keep the SA:V ratio high enough for diffusion.",
      },
      {
        question: "What does the Golgi apparatus actually do to proteins?",
        answer:
          "The Golgi receives proteins from the ER and chemically modifies them — adding or trimming sugar chains (glycosylation), adding phosphate groups, or clipping signal peptides. It then sorts proteins into vesicles headed to lysosomes, the plasma membrane, or secretion. Think of it as the post office that addresses and stamps every package before shipping.",
      },
    ],
  },
};
