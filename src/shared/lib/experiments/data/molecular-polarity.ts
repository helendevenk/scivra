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
  contentSections: {
    whatIsIt:
      "Molecular polarity describes whether a molecule has a net uneven distribution of electron density — a permanent electric dipole. Each polar bond carries a dipole moment vector (μ = q × d, measured in Debye) pointing from the partially positive atom toward the more electronegative one. The key insight tested by AP Chem 2.C.1 and 2.C.4 is that polar bonds do not automatically produce a polar molecule: in CO₂ (linear) or CCl₄ (tetrahedral), bond dipoles cancel by symmetry and the net dipole is zero. In H₂O (bent) or NH₃ (trigonal pyramidal), the geometry is asymmetric so the vectors add to a nonzero resultant. This simulation lets you rotate 3D molecular models, toggle individual bond dipole arrows, and overlay an electron-density cloud to observe exactly where electrons accumulate.",
    parameterExplanations: {
      moleculeIndex:
        "Selects which molecule is displayed — the library includes symmetric nonpolar species (CO₂, CCl₄, BF₃) and asymmetric polar ones (H₂O, NH₃, CHCl₃, SO₂). Cycling through contrasting pairs — for example CO₂ vs. SO₂ — is the fastest way to see how geometry, not just bond polarity, determines net dipole.",
      showDipoles:
        "Toggles the individual bond-dipole arrow overlays on or off (0 = off, 1 = on). With dipoles visible, each arrow points from the electropositive atom (δ⁺) toward the electronegative one (δ⁻); the yellow net-dipole arrow is the vector sum. Turning dipoles off lets you focus on the raw 3D geometry before reasoning about cancellation.",
      showCloud:
        "Toggles the electron-density cloud rendering (0 = off, 1 = on). Blue regions indicate high electron density (δ⁻); red regions indicate electron-poor zones (δ⁺). Compare the cloud for H₂O versus CO₂ to see why one dissolves ionic solutes and the other does not.",
    },
    misconceptions: [
      {
        wrong:
          "Any molecule with polar bonds must be a polar molecule.",
        correct:
          "Polarity requires both polar bonds AND an asymmetric geometry. CO₂ has two polar C=O bonds, but they point in exactly opposite directions (180° apart), so the vectors cancel and the net dipole is zero. Geometry determines whether cancellation occurs.",
      },
      {
        wrong:
          "The atom with the higher electronegativity always ends up on the negative end of the molecule's net dipole.",
        correct:
          "The net dipole is a vector sum of all bond dipoles, so the negative pole of the molecule depends on the 3D arrangement. In water, the oxygen end is negative — consistent with O being more electronegative. But in CHCl₃, the three Cl atoms pull toward one side while the single H pulls the other way; you must add all four vectors to find which end is negative.",
      },
      {
        wrong:
          "BF₃ is polar because fluorine is the most electronegative element and there are three polar B–F bonds.",
        correct:
          "BF₃ is trigonal planar — all three B–F dipoles are arranged symmetrically at 120° in the same plane and cancel exactly, giving net μ = 0. Adding a lone pair to boron (as in NF₃, which is pyramidal) would break that symmetry and produce a polar molecule.",
      },
      {
        wrong:
          "A larger electronegativity difference between two bonded atoms always means a larger net molecular dipole.",
        correct:
          "Electronegativity difference governs individual bond dipole magnitude, but the net molecular dipole also depends on the number of bonds and their geometric arrangement. CCl₄ has four very polar C–Cl bonds yet a net dipole of zero because the tetrahedral symmetry makes all four vectors cancel.",
      },
      {
        wrong:
          "Polarity only matters for solubility; it has no effect on boiling point.",
        correct:
          "Molecular polarity directly governs intermolecular forces. Polar molecules experience dipole–dipole attractions and (in the case of O–H, N–H, F–H bonds) hydrogen bonding, both of which raise boiling points. Water boils at 100°C; the similarly sized but nonpolar CO₂ sublimes at −78°C at 1 atm.",
      },
    ],
    teacherUseCases: [
      "Pre-lab prediction: before opening the simulation, have students draw Lewis structures and VSEPR geometries for CO₂, H₂O, NH₃, and CCl₄, then predict polar or nonpolar. Use the simulation to confirm or correct, focusing discussion on cases where predictions were wrong.",
      "Dipole vector addition exercise: display NH₃ with dipoles on and ask students to sketch the three N–H bond vectors plus the lone-pair contribution on paper, then construct the resultant. Compare their hand-drawn vector sum to the yellow net-dipole arrow on screen.",
      "Misconception probe — 'polar bonds = polar molecule': show BF₃ and CHCl₃ side by side (or in sequence). BF₃ has three identical polar bonds and is nonpolar; CHCl₃ has four different substituents and is polar (μ ≈ 1.04 D). Ask students to explain the discrepancy, then connect to AP Chem 2.C.4.",
      "Solubility connection data collection: have pairs look up or measure (in a later wet lab) whether CO₂, H₂O, NaCl, and hexane dissolve in each other, then map each result back to polarity data from the simulation. Builds the 'like dissolves like' principle from evidence.",
      "Exam-prep ranking task: display SO₂, CO₂, H₂O, and CH₄ in sequence, record net dipole magnitude for each, then rank by expected boiling point. Compare to actual boiling-point data and explain anomalies (e.g., H₂O is unusually high because of hydrogen bonding).",
    ],
    faq: [
      {
        question: "Why is CO₂ nonpolar if both C=O bonds are polar?",
        answer:
          "CO₂ is linear (bond angle 180°), so the two C=O dipole vectors point in exactly opposite directions and cancel to give a net dipole of zero. AP Chem 2.C.4 specifically requires students to use molecular geometry — not just bond polarity — to determine whether a molecule is polar. Toggle dipoles on in the simulation and rotate the model to see the vectors pointing left and right along the same axis.",
      },
      {
        question: "How do I find the direction of the net dipole arrow?",
        answer:
          "Treat each bond dipole as a vector starting at the electropositive atom and pointing toward the electronegative one. Add all vectors tip-to-tail (or using components). The resultant vector is the net molecular dipole. For water, both O–H vectors point roughly toward oxygen and add to a net vector pointing away from the H–O–H bisector toward oxygen, which is why the oxygen end is the negative pole.",
      },
      {
        question: "What does the electron-density cloud color coding mean?",
        answer:
          "Blue indicates regions of higher electron density (partial negative charge, δ⁻) and red indicates electron-deficient regions (δ⁺). These colors map directly onto the ends of polar bonds — the electronegative atom's region appears blue. In a perfectly symmetric molecule like CH₄, the cloud is uniform because all four C–H bonds are identical and the electron density is evenly distributed.",
      },
      {
        question: "Does a molecule need polar bonds to be polar overall?",
        answer:
          "Yes — you cannot have a polar molecule without at least one polar bond (or a lone pair contributing to asymmetry). However, having polar bonds is necessary but not sufficient. The geometry must also be asymmetric so the bond dipoles do not cancel. This two-part check — (1) are any bonds polar? (2) does the geometry prevent cancellation? — is the core reasoning AP Chem 2.C.1 tests.",
      },
      {
        question: "Which molecules in the simulation are polar, and which are nonpolar?",
        answer:
          "Among common examples: H₂O (bent, polar, μ ≈ 1.85 D), NH₃ (trigonal pyramidal, polar, μ ≈ 1.47 D), and CHCl₃ (tetrahedral but asymmetric, polar, μ ≈ 1.04 D) are polar. CO₂ (linear), BF₃ (trigonal planar), and CCl₄ (tetrahedral with identical substituents) are nonpolar. Cycle through the molecule selector to verify each case using the net-dipole arrow.",
      },
      {
        question: "How does polarity connect to solubility on the AP Chem exam?",
        answer:
          "AP Chem 2.C.1 links polarity to intermolecular forces, and those forces determine solubility: polar solvents dissolve polar and ionic solutes ('like dissolves like'). Water (μ = 1.85 D) dissolves NaCl because ion–dipole attractions are strong. Hexane (μ = 0 D) dissolves nonpolar waxes but not salts. On the exam, you may be asked to predict solubility from molecular structure — start by establishing polarity from geometry.",
      },
    ],
  },
};
