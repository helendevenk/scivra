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

  parameters: [],

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
    "This HTML version has 0 range sliders and 10 preset buttons. Use the six atom presets (H, C, N, O, Cl, and S) to choose the next atom for manual construction, or jump straight to one of the four molecule presets: Water (H₂O), Methane (CH₄), Ethanol (C₂H₅OH), or Ammonia (NH₃). Drag to rotate the 3D model and compare how the selected atoms and preset structures change molecular shape.",

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
  htmlControlAliases: {},
  presets: [
    {
      id: "selectAtom:H",
      label: "H",
      description:
        "Selects hydrogen as the next atom for manual molecule construction. Use it to add terminal single-bond atoms in water, methane, ammonia, and organic structures.",
    },
    {
      id: "selectAtom:C",
      label: "C",
      description:
        "Selects carbon as the next atom for manual molecule construction. Carbon is the common central atom for tetrahedral bonding patterns and organic molecule backbones.",
    },
    {
      id: "selectAtom:N",
      label: "N",
      description:
        "Selects nitrogen as the next atom for manual molecule construction. Use it to discuss trigonal pyramidal bonding and the effect of one lone pair in ammonia-like structures.",
    },
    {
      id: "selectAtom:O",
      label: "O",
      description:
        "Selects oxygen as the next atom for manual molecule construction. Oxygen helps students compare bent shapes, polar bonds, and lone-pair compression in water and alcohols.",
    },
    {
      id: "selectAtom:Cl",
      label: "Cl",
      description:
        "Selects chlorine as the next atom for manual molecule construction. It works well as a terminal atom for showing single bonds and high-electronegativity substituents.",
    },
    {
      id: "selectAtom:S",
      label: "S",
      description:
        "Selects sulfur as the next atom for manual molecule construction. Use it to introduce larger period-3 atoms and compare them with oxygen-centered examples.",
    },
    {
      id: "loadPreset:H2O",
      label: "Water (H₂O)",
      description:
        "Loads a water molecule so students can study a bent molecular shape. The preset is useful for showing how two lone pairs on oxygen compress the H-O-H angle.",
    },
    {
      id: "loadPreset:CH4",
      label: "Methane (CH₄)",
      description:
        "Loads methane as a clean tetrahedral reference case. Students can compare its four equivalent C-H bonds with water and ammonia, where lone pairs change the molecular shape.",
    },
    {
      id: "loadPreset:C2H5OH",
      label: "Ethanol (C₂H₅OH)",
      description:
        "Loads ethanol to connect molecular geometry with an organic functional group. Students can inspect carbon tetrahedral bonding and the oxygen-containing alcohol group in one structure.",
    },
    {
      id: "loadPreset:NH3",
      label: "Ammonia (NH₃)",
      description:
        "Loads ammonia as a trigonal pyramidal molecule. Use it to compare one lone pair on nitrogen with methane's no-lone-pair tetrahedral arrangement.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Molecular geometry is the 3D arrangement of atoms in a molecule, determined by how electron pairs — both bonding and lone — push each other away to maximize separation. Ammonia smells sharp and dissolves readily in water because its trigonal pyramidal shape creates a net dipole; a flat version of NH₃ would behave completely differently. VSEPR (Valence Shell Electron Pair Repulsion) theory predicts this shape from a single rule: electron domains around a central atom adopt the geometry that minimizes repulsion. This simulation lets students choose atom buttons for manual construction and use preset molecules for water, methane, ethanol, and ammonia. Those examples make it easy to compare tetrahedral carbon centers, bent oxygen-centered water, and trigonal pyramidal ammonia while rotating the model freely. AP Chem 2.B.1 and 2.C.4 are the governing standards.",
    parameterExplanations: {},
    misconceptions: [
      {
        wrong:
          "Water is linear because oxygen forms exactly two bonds, like CO₂.",
        correct:
          "The molecular geometry follows the electron domains, not just the bonds. Oxygen in water has four electron domains: two bonding pairs and two lone pairs. Use the Water (H₂O) preset to inspect the bent arrangement, then compare it with the Methane (CH₄) preset, where carbon has four bonding domains and no lone pairs. The difference shows why visible bond count alone is not enough to predict shape.",
      },
      {
        wrong:
          "Lone pairs do not count when predicting molecular shape because they are not attached to an atom you can see.",
        correct:
          "Lone pairs count as full electron domains in VSEPR and they exert more repulsion than bonding pairs. The Ammonia (NH₃) preset is the key comparison: nitrogen has three N-H bonds plus one lone pair, so the molecule is trigonal pyramidal rather than trigonal planar. Compare it with Methane (CH₄), where four bonding domains create a symmetric tetrahedral shape.",
      },
      {
        wrong:
          "All molecules with four bonds around the central atom have 109.5° bond angles.",
        correct:
          "109.5° is the ideal angle only when all four domains are bonding pairs with no lone pairs, as in methane. Water and ammonia show why the rule needs domain counting, not just bond counting: lone pairs occupy space and compress nearby bonds. Use the Water (H₂O), Ammonia (NH₃), and Methane (CH₄) presets as a three-case comparison of two lone pairs, one lone pair, and no lone pairs.",
      },
      {
        wrong:
          "If two molecules contain the same atom types, they must have the same shape.",
        correct:
          "Atom identity matters, but connectivity and electron domains matter just as much. Ethanol contains carbon, hydrogen, and oxygen, yet it has tetrahedral carbon centers plus an oxygen-containing alcohol group rather than the same simple geometry as water. Use the atom buttons to identify each element in the model, then compare the Ethanol (C₂H₅OH) preset with Water (H₂O) to separate element composition from molecular shape.",
      },
    ],
    teacherUseCases: [
      "Preset comparison opener: load Water (H₂O), Methane (CH₄), and Ammonia (NH₃), then ask students to identify the central atom, count electron domains, and explain why the three shapes differ.",
      "Manual construction vocabulary check: use the H, C, N, O, Cl, and S atom buttons as a quick element-recognition warmup before students describe how selected atoms become bonding partners in a 3D model.",
      "Lone-pair compression discussion: compare the Methane (CH₄) and Ammonia (NH₃) presets first, then add Water (H₂O) to show how increasing lone-pair count changes the observed geometry.",
      "Organic structure bridge: load Ethanol (C₂H₅OH) and have students locate the carbon backbone, the oxygen atom, and the terminal hydrogens, then connect local geometry to the alcohol functional group.",
      "AP Chem 2.B.1 retrieval practice: show one preset at a time with labels hidden by classroom discussion, asking students to name the molecular geometry before explaining it through VSEPR domain counting.",
    ],
    faq: [
      {
        question: "Why is water's bond angle 104.5° instead of the tetrahedral 109.5°?",
        answer:
          "Water has four electron domains around oxygen: two bonding pairs and two lone pairs. Lone pairs are held by only one nucleus and spread out more than bonding pairs, exerting greater repulsion on the H-O bonds and pushing them together. Use the Water (H₂O) preset as the bent reference case, then compare it with Methane (CH₄), where four bonding domains around carbon produce the ideal tetrahedral arrangement.",
      },
      {
        question: "What can I do with the atom buttons?",
        answer:
          "The H, C, N, O, Cl, and S buttons select the atom type for manual molecule construction. They are useful for connecting chemical symbols to model parts before students discuss bonding. Hydrogen often appears as a terminal atom, carbon commonly forms tetrahedral centers, nitrogen and oxygen introduce lone-pair examples, chlorine works as a terminal high-electronegativity atom, and sulfur gives a period-3 comparison point.",
      },
      {
        question: "Which preset molecules are available in this HTML simulation?",
        answer:
          "The HTML preset buttons load Water (H₂O), Methane (CH₄), Ethanol (C₂H₅OH), and Ammonia (NH₃). These four examples cover a useful classroom spread: bent water, tetrahedral methane, an organic alcohol with carbon and oxygen centers, and trigonal pyramidal ammonia. Use the presets before manual construction so students have reliable reference structures for VSEPR comparisons.",
      },
      {
        question: "Does this simulation cover AP Chem 2.B.1 and 2.C.4?",
        answer:
          "AP Chem 2.B.1 requires students to use VSEPR theory to predict molecular geometry, which is directly supported by comparing the Water (H₂O), Methane (CH₄), Ethanol (C₂H₅OH), and Ammonia (NH₃) presets. AP Chem 2.C.4 connects molecular structure to polarity, so water and ammonia provide strong polar-shape examples while methane offers a symmetric contrast. NGSS HS-PS1-1 and HS-PS1-3 are also supported through structure-property reasoning.",
      },
      {
        question: "Why compare ethanol with water and methane?",
        answer:
          "Ethanol combines ideas students often learn separately. Its carbon atoms provide tetrahedral bonding examples like methane, while its oxygen-containing alcohol group connects back to water's polar O-H bonding and lone-pair behavior. Loading Ethanol (C₂H₅OH) after Water (H₂O) and Methane (CH₄) helps students see that a larger molecule can contain multiple local geometries rather than one single shape label for the whole structure.",
      },
    ],
  },
};
