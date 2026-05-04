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
      id: "bondAngle",
      label: "Bond Angle θ",
      unit: "°",
      min: 80,
      max: 180,
      default: 1045,
      step: 5,
      tier: "free",
    },
    {
      id: "electronegativityDifference",
      label: "Electronegativity Difference",
      unit: "",
      min: 0,
      max: 30,
      default: 14,
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
    "Use the Bond Angle θ slider and ΔEN slider to compare how molecular geometry and electronegativity difference shape polarity. Try the Water (bent), CO₂ (linear), and CHCl₃ (tetrahedral) presets to jump between common AP Chemistry examples, then rotate the model and compare the displayed net dipole and polarity readout.",

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
  htmlControlAliases: { bondAngle: "sl-angle", electronegativityDifference: "sl-den" },
  presets: [
    {
      id: "H2O",
      label: "Water (bent)",
      description:
        "A bent water molecule has two polar O-H bonds whose dipoles do not cancel, producing a strong net dipole toward oxygen.",
    },
    {
      id: "CO2",
      label: "CO₂ (linear)",
      description:
        "A linear carbon dioxide molecule has two polar C=O bonds arranged in opposite directions, so their dipoles cancel to zero.",
    },
    {
      id: "CHCl3",
      label: "CHCl₃ (tetrahedral)",
      description:
        "Chloroform has tetrahedral geometry, but three chlorine atoms and one hydrogen make the substituents asymmetric, leaving a net dipole.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Molecular polarity describes whether a molecule has a net uneven distribution of electron density — a permanent electric dipole. Each polar bond carries a dipole moment vector (μ = q × d, measured in Debye) pointing from the partially positive atom toward the more electronegative one. The key insight tested by AP Chem 2.C.1 and 2.C.4 is that polar bonds do not automatically produce a polar molecule: in CO₂ (linear) or CCl₄ (tetrahedral), bond dipoles cancel by symmetry and the net dipole is zero. In H₂O (bent) or NH₃ (trigonal pyramidal), the geometry is asymmetric so the vectors add to a nonzero resultant. This simulation lets you rotate 3D molecular models, toggle individual bond dipole arrows, and overlay an electron-density cloud to observe exactly where electrons accumulate.",
    parameterExplanations: {
      bondAngle:
        "Bond Angle θ represents the angle used to compare molecular shapes. A linear molecule such as CO₂ places bond dipoles 180° apart, so equal vectors point in opposite directions and cancel. A bent molecule such as H₂O uses a smaller angle, so the two O-H dipoles add to a net dipole along the angle bisector. CHCl₃ is tetrahedral, so its three-dimensional bond arrangement must be considered rather than judged from a flat drawing. Use this slider together with the three presets to connect VSEPR geometry with vector addition and the polar/nonpolar readout.",
      electronegativityDifference:
        "Electronegativity Difference, shown as ΔEN, represents how unevenly two bonded atoms share electrons. A larger ΔEN means the more electronegative atom pulls electron density more strongly, so that individual bond has a larger dipole contribution. This does not guarantee a polar molecule, because geometry can still cancel equal bond dipoles, as in linear CO₂. Compare Water and Carbon Dioxide to separate bond polarity from molecular polarity, then use CHCl₃ to discuss how unequal substituents prevent complete cancellation even in a roughly tetrahedral arrangement.",
    },
    misconceptions: [
      {
        wrong:
          "Any molecule with polar bonds must be a polar molecule.",
        correct:
          "Polarity requires both polar bonds AND a geometry that prevents complete cancellation. CO₂ has two polar C=O bonds, but they point in exactly opposite directions in a linear shape, so the vectors cancel and the net dipole is zero. Water has polar O-H bonds in a bent shape, so those vectors add instead of canceling.",
      },
      {
        wrong:
          "The atom with the higher electronegativity always ends up on the negative end of the molecule's net dipole.",
        correct:
          "The net dipole is a vector sum of all bond dipoles, so the negative pole of the molecule depends on the 3D arrangement. In water, the oxygen end is negative — consistent with O being more electronegative. In CHCl₃, the three C-Cl bond dipoles all point toward chlorine while the C-H dipole points toward carbon; the asymmetric tetrahedron means the four bond vectors do not cancel and the resulting net dipole points toward the Cl₃ side.",
      },
      {
        wrong:
          "CO₂ is polar because oxygen is much more electronegative than carbon and there are two polar C=O bonds.",
        correct:
          "CO₂ is linear, so the two equal C=O bond dipoles point in opposite directions along the same axis. Their vector sum is zero even though each individual bond is polar. Use the CO₂ preset as the cleanest contrast with bent H₂O, where the same two-bond reasoning gives a nonzero net dipole because the vectors are not opposite.",
      },
      {
        wrong:
          "A larger electronegativity difference between two bonded atoms always means a larger net molecular dipole.",
        correct:
          "Electronegativity difference governs individual bond dipole magnitude, but the net molecular dipole also depends on the number of bonds and their geometric arrangement. CO₂ can have polar bonds and still be nonpolar because its two vectors cancel. CHCl₃ remains polar because the three C-Cl bonds and one C-H bond do not form a fully symmetric set.",
      },
      {
        wrong:
          "Polarity only matters for solubility; it has no effect on boiling point.",
        correct:
          "Molecular polarity directly governs intermolecular forces. Polar molecules experience dipole–dipole attractions and (in the case of O–H, N–H, F–H bonds) hydrogen bonding, both of which raise boiling points. Water (M ≈ 18 g/mol) boils at 100°C; the heavier nonpolar CO₂ (M ≈ 44 g/mol) sublimes at −78°C at 1 atm — polarity and hydrogen bonding outweigh the molar-mass difference.",
      },
    ],
    teacherUseCases: [
      "Pre-lab prediction: before opening the simulation, have students draw Lewis structures and VSEPR geometries for H₂O, CO₂, and CHCl₃, then predict polar or nonpolar. Use the three presets to confirm or correct, focusing discussion on cases where bond polarity alone led to the wrong answer.",
      "Dipole vector addition exercise: display the Water preset and ask students to sketch the two O-H bond vectors, then construct the resultant along the H-O-H angle bisector. Compare their hand-drawn vector sum to the displayed net dipole and polarity readout.",
      "Misconception probe — 'polar bonds = polar molecule': show Water and CO₂ in sequence. Both contain polar bonds, but Water is bent and polar while CO₂ is linear and nonpolar. Ask students to explain the discrepancy, then connect to AP Chem 2.C.4.",
      "Electronegativity control check: have pairs keep the same preset visible while changing ΔEN, then explain why changing bond polarity is different from changing molecular geometry. Students should distinguish individual bond dipoles from the net molecular dipole.",
      "Exam-prep comparison task: use the Water, CO₂, and CHCl₃ presets, record bond angle, ΔEN, net dipole magnitude, and polar/nonpolar status, then write one claim explaining how geometry and electronegativity work together.",
    ],
    faq: [
      {
        question: "Why is CO₂ nonpolar if both C=O bonds are polar?",
        answer:
          "CO₂ is linear (bond angle 180°), so the two C=O dipole vectors point in exactly opposite directions and cancel to give a net dipole of zero. AP Chem 2.C.4 specifically requires students to use molecular geometry — not just bond polarity — to determine whether a molecule is polar. Use the CO₂ preset and compare it with bent Water to see why geometry changes the vector sum.",
      },
      {
        question: "How do I find the direction of the net dipole arrow?",
        answer:
          "Treat each bond dipole as a vector starting at the electropositive atom and pointing toward the electronegative one. Add all vectors tip-to-tail (or using components). The resultant vector is the net molecular dipole. For water, both O–H vectors point toward oxygen, and their vector sum lies along the H–O–H angle bisector pointing toward oxygen — which is why the oxygen end of the molecule is the negative pole.",
      },
      {
        question: "What does the ΔEN slider represent?",
        answer:
          "ΔEN is the electronegativity difference between bonded atoms. A higher value means the bonding electrons are pulled more strongly toward the more electronegative atom, making that individual bond dipole larger. The key AP Chemistry point is that a larger bond dipole does not automatically make the whole molecule polar. The net dipole also depends on geometry: CO₂ cancels because it is linear, while Water remains polar because it is bent.",
      },
      {
        question: "Does a molecule need polar bonds to be polar overall?",
        answer:
          "In essence, a polar molecule needs a permanently asymmetric distribution of charge. For the AP-level molecules tested in 2.C.1, that almost always comes from polar bonds AND a geometry that prevents cancellation, so the practical two-part check is (1) are any bonds polar? (2) does the geometry prevent cancellation? Strictly speaking, asymmetric lone-pair distributions can also contribute to a small dipole even when bonds are similar, but those edge cases are rare in introductory examples.",
      },
      {
        question: "Which molecules in the simulation are polar, and which are nonpolar?",
        answer:
          "The current preset set includes H₂O, CO₂, and CHCl₃. H₂O is bent and polar, with a net dipole because the two O-H bond vectors do not cancel. CO₂ is linear and nonpolar because the two C=O bond vectors cancel exactly. CHCl₃ is tetrahedral but asymmetric, so its C-Cl and C-H bond dipoles do not cancel completely and the molecule is polar.",
      },
      {
        question: "How does polarity connect to solubility on the AP Chem exam?",
        answer:
          "AP Chem 2.C.1 links polarity to intermolecular forces, and those forces determine solubility: polar solvents dissolve polar and ionic solutes ('like dissolves like'). Water (μ = 1.85 D) dissolves NaCl because ion–dipole attractions are strong. Hexane (μ = 0 D) dissolves nonpolar waxes but not salts. On the exam, you may be asked to predict solubility from molecular structure — start by establishing polarity from geometry.",
      },
    ],
  },
};
