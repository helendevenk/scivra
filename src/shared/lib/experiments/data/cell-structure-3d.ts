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
      id: "scale",
      label: "Scale",
      unit: "×",
      min: 0.5,
      max: 2,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "transparency",
      label: "Membrane Transparency",
      unit: "",
      min: 0,
      max: 1,
      default: 0.18,
      step: 0.05,
      tier: "free",
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
    "Rotate the 3D cell by dragging. Scroll to zoom. Click on any organelle to highlight it and read its description. Use the Scale slider to move from a whole-cell overview to a closer view of organelle organization. Adjust the Membrane Transparency slider to reveal or emphasize internal membrane-bound structures. Try the Full Cell View, Nucleus Focus, and Mitochondria Focus presets to compare the whole model, genetic control center, and energy organelles.",

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
  htmlControlAliases: {
    scale: "scale-slider",
    transparency: "alpha-slider",
  },
  presets: [
    {
      id: "full",
      label: "Full Cell View",
      paramValues: { scale: 1, transparency: 0.18 },
    },
    {
      id: "nucleus",
      label: "Nucleus Focus",
      paramValues: { scale: 1.4, transparency: 0.1 },
    },
    {
      id: "mito",
      label: "Mitochondria Focus",
      paramValues: { scale: 1.6, transparency: 0.2 },
    },
  ],
  contentSections: {
    whatIsIt:
      "A eukaryotic cell is a microscopic city — every organelle is a department with a specific job, all enclosed within a phospholipid membrane wall. Your liver cells, muscle cells, and the plant cells in a spinach leaf all share this compartmentalized design. The nucleus acts as city hall, housing DNA and issuing instructions via mRNA. The mitochondria are the power plants, oxidizing pyruvate and feeding electron carriers into the electron transport chain to produce most of the ~30–32 ATP per glucose. The endomembrane system — rough ER, Golgi, and lysosomes — handles manufacturing, shipping, and waste disposal. Plant cells add a chloroplast solar panel and a central vacuole that inflates like a water balloon to keep stems upright. Use the Scale slider to move between whole-cell overview and organelle close-up, and adjust Membrane Transparency to balance internal organelle visibility with the importance of the bounding membrane.",
    parameterExplanations: {
      scale:
        "Scale changes the viewing distance and emphasis of the 3D model without changing the biology of the cell. At lower values, students can see the whole eukaryotic cell as an organized system of compartments. Higher values support close inspection of organelles such as the nucleus, mitochondria, ER, Golgi apparatus, and lysosomes. In AP Biology terms, this helps connect structure to function: organelles are not isolated labels, but spatially arranged compartments that support gene expression, ATP production, membrane trafficking, and cellular regulation.",
      transparency:
        "Membrane Transparency controls how visible the cell boundary is while students inspect internal membrane systems. A lower value makes the plasma membrane more visually present, emphasizing selective permeability and the idea that cells maintain internal environments. A higher value makes internal organelles easier to compare, especially membrane-bound compartments involved in AP Biology topics such as endomembrane transport, nuclear control of gene expression, and mitochondrial energy conversion. Use this slider to balance two linked ideas: cells are bounded by membranes, and eukaryotic function depends on compartmentalized internal membranes.",
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
      "Whole-cell orientation: start with the Full Cell View preset, ask students to list visible organelles, then adjust the Scale slider slightly while keeping Membrane Transparency near 0.18 so they connect cell organization to HS-LS1-2 model-building practice.",
      "Nuclear control discussion: use the Nucleus Focus preset, lower Membrane Transparency to 0.10, and have students trace how DNA information leaves the nucleus as mRNA before ribosomes and the rough ER support protein synthesis.",
      "Energetics misconception probe: use the Mitochondria Focus preset and ask 'Where does the energy in ATP come from?' Use student answers to distinguish energy transformation from energy creation in AP Biology cellular respiration.",
      "Membrane systems trace: keep Scale around 1.4 and move Membrane Transparency from 0.10 to 0.30 while students narrate the route of a secreted protein from rough ER to Golgi to vesicle fusion, linking AP Bio 4.A.2 to a spatial model.",
      "SA:V data collection: using the formula SA:V = 3/r, have students calculate ratios for cells of radius 1, 5, 10, and 50 μm, then use the Scale slider as a visual anchor for why cells stay small.",
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
          "AP Bio 2.B.1 requires students to explain how the structure of cell membranes results in selective permeability. HS-LS1-2 asks students to develop and use models to illustrate the hierarchical organization of cells, tissues, and organs. This simulation supports both: adjust Membrane Transparency to connect visible boundaries with membrane-defined compartments, then use the Scale slider and presets to inspect how organelles fit into the larger cellular model.",
      },
      {
        question: "Why are plant cells generally larger than animal cells?",
        answer:
          "The rigid cell wall and central vacuole allow plant cells to maintain turgor pressure that supports large cell volumes without requiring the cell to synthesize as much cytoplasm. Animal cells lack this support structure and tend to stay under 20 μm to keep the SA:V ratio high enough for diffusion.",
      },
      {
        question: "What does the Golgi apparatus actually do to proteins?",
        answer:
          "The Golgi receives proteins from the ER and chemically modifies them — adding or trimming sugar chains (glycosylation), adding phosphate groups, and proteolytically processing some cargo. (Signal peptides themselves are typically cleaved earlier by signal peptidase in the ER.) The Golgi then sorts proteins into vesicles headed to lysosomes, the plasma membrane, or secretion. Think of it as the post office that addresses and stamps every package before shipping.",
      },
    ],
  },
};
