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
  contentSections: {
    whatIsIt:
      "Chemical bonding describes how atoms join by transferring or sharing valence electrons to reach lower-energy, more stable arrangements. Table salt (NaCl) forms when sodium transfers one electron to chlorine — an ionic bond held together by ~787 kJ/mol of lattice energy. Water forms when two hydrogen atoms each share an electron pair with oxygen — a polar covalent bond where the higher electronegativity of oxygen (3.44 vs. H at 2.20) pulls electron density toward itself, creating partial charges. This simulation builds six molecules (H₂O, CH₄, NH₃, CO₂, BF₃, SF₆) in 3D, lets you switch between stick, ball-and-stick, and spacefill rendering, and overlays individual bond dipole arrows whose vector sum reveals whether the molecule carries a net dipole moment. Lone pairs can be toggled visible to see their role in distorting geometry. AP Chem 2.A.1, 2.A.2, and 2.B.1 are all addressed here.",
    parameterExplanations: {
      molecule:
        "Selects the molecule to display: 0=H₂O, 1=CH₄, 2=NH₃, 3=CO₂, 4=BF₃, 5=SF₆. Each choice rebuilds the 3D model with correct bond lengths (O-H ~96 pm, C-H ~109 pm, C=O ~116 pm), bond angles, and lone-pair positions. The six selections are all covalent and span polar vs. nonpolar examples plus several VSEPR geometries (bent, tetrahedral, trigonal pyramidal, linear, trigonal planar, octahedral); ionic structures and trigonal bipyramidal geometry are not included in this library.",
      bondType:
        "Controls the rendering style: 0=stick (lines only), 1=ball-and-stick (atoms as spheres, bonds as cylinders), 2=spacefill (CPK spheres scaled to van der Waals radii). Spacefill mode makes molecular size and shape tangible — students can see why two water molecules can hydrogen-bond at close range while a bulky nonpolar molecule cannot approach as easily.",
      showDipoles:
        "Toggles arrows representing individual bond dipole moments, with the net molecular dipole drawn in a distinct color. Turning this on for CO₂ (linear) shows two equal and opposite C=O dipoles that cancel exactly, producing zero net dipole — the clearest illustration of why a molecule with polar bonds can be nonpolar overall. For H₂O, the two O-H dipoles add vectorially to a net dipole pointing toward oxygen.",
      showLonePairs:
        "Toggles visible lobes representing lone electron pairs on the model. With this on, students can see the two lone pairs on oxygen in H₂O occupying space above and below the H-O-H plane, directly connecting the Lewis structure to the 3D geometry and explaining the 104.5° angle.",
    },
    misconceptions: [
      {
        wrong:
          "Polar molecules must have polar bonds, and molecules with polar bonds are always polar.",
        correct:
          "Molecular polarity comes from a nonzero net charge separation; in most AP-level examples, that requires both polar bonds AND a geometry that prevents cancellation. CO₂ has two polar C=O bonds (ΔEN ≈ 1.0) but its linear geometry makes the dipoles cancel exactly, giving zero net dipole. Symmetry can erase polarity entirely. Toggle showDipoles=1 on CO₂ and watch the arrows neutralize each other.",
      },
      {
        wrong:
          "Ionic bonds are always stronger than covalent bonds.",
        correct:
          "This is an overgeneralization that conflates intramolecular bond strength with other properties. NaCl's lattice energy is ~787 kJ/mol; the C≡N triple bond is ~890 kJ/mol; an N≡N triple bond is ~941 kJ/mol. Many covalent bonds are stronger than many ionic bonds. The better rule is that bond strength depends on specific atoms, bond order, and whether you are comparing lattice energies, bond enthalpies, or something else entirely.",
      },
      {
        wrong:
          "Any large electronegativity difference must mean a 100% ionic bond with full charges on each atom.",
        correct:
          "Electronegativity difference gives a continuous spectrum, not a step function. ΔEN below ~0.4 is treated as nonpolar covalent (H₂, Cl₂). ΔEN 0.4 to ~1.7 is polar covalent (H₂O, HCl). ΔEN above ~1.7 is described as predominantly ionic (NaCl, ΔEN = 2.1), but even those bonds retain some covalent character. The boundaries are approximate; bond character changes gradually along the spectrum. AP Chem 2.A.1 covers this spectrum explicitly.",
      },
      {
        wrong:
          "A bent molecule like water has its hydrogen atoms attached on opposite sides of oxygen, like a straight line but tilted.",
        correct:
          "Bent means the H-O-H angle is approximately 104.5° — both hydrogens are on the same side of the oxygen. The two lone pairs occupy the opposite region. This asymmetric distribution of charge is what makes water polar and allows it to dissolve ionic compounds. The spacefill model in the simulation makes the actual shape unmistakable.",
      },
      {
        wrong:
          "Dipole moment is a property of individual bonds only, not of the whole molecule.",
        correct:
          "Individual bond dipoles exist, but the molecular dipole moment is the vector sum of all bond dipoles. In BF₃ (trigonal planar), three polar B-F bonds (ΔEN ≈ 2.0) point 120° apart and cancel to zero net dipole. In NH₃ (trigonal pyramidal), three N-H bonds point in the same general direction and add to a measurable net dipole of 1.47 D.",
      },
    ],
    teacherUseCases: [
      "Dipole cancellation demonstration: project CO₂ with showDipoles=1 and H₂O with showDipoles=1 side by side. Ask students why one molecule with polar bonds is nonpolar while the other is polar — the geometry-dipole link is immediately visible and sets up AP Chem 2.A.2.",
      "Bond type spectrum data collection: give students a table of six pairs (H-H, H-Cl, H-F, Na-Cl, Mg-O, Al-Cl) with Pauling electronegativity values. Students classify each as nonpolar covalent, polar covalent, or ionic using the ΔEN thresholds, then use the simulation to check predicted vs. observed molecular polarity for the covalent examples.",
      "Lone pair geometry probe: load H₂O with showLonePairs=1 and NH₃ with showLonePairs=1, then ask 'where are the lone pairs and how do they affect the shape?' Students must articulate that lone pairs compress bond angles — a misconception target in AP Chem 2.B.1.",
      "Spacefill size comparison: cycle through CH₄ → NH₃ → H₂O in spacefill mode and ask students to observe how molecular shape and size change despite similar atom counts. Connect to intermolecular forces by asking which molecule can form hydrogen bonds and why (lone pair + N-H/O-H bond required).",
      "Ionic vs. covalent bond strength challenge: before showing numbers, ask students to rank NaCl, H₂O, N₂, and HF by bond strength. After discussion, reveal lattice energy (~787 kJ/mol), O-H bond energy (~459 kJ/mol), N≡N (~941 kJ/mol), and H-F (~570 kJ/mol) to address the misconception that ionic always beats covalent.",
    ],
    faq: [
      {
        question: "What electronegativity difference separates ionic from polar covalent bonds?",
        answer:
          "The commonly used threshold is ΔEN greater than approximately 1.7 on the Pauling scale for predominantly ionic character and ΔEN less than 0.4 for nonpolar covalent. Between 0.4 and 1.7 is polar covalent. These cutoffs are approximations — the H-F bond (ΔEN = 1.9) has significant covalent character despite falling above 1.7. AP Chem 2.A.1 treats bond character as a spectrum rather than three discrete categories.",
      },
      {
        question: "Why is CO₂ nonpolar if each C=O bond is polar?",
        answer:
          "CO₂ is linear (180°). The two C=O bond dipoles (ΔEN ≈ 1.0) point in exactly opposite directions along the molecular axis and cancel when added as vectors, producing a net dipole of zero. Toggle showDipoles=1 on CO₂ in the simulation to see the cancellation. Compare to H₂O, where the bent geometry (104.5°) prevents cancellation and produces a net dipole of 1.85 D.",
      },
      {
        question: "How do I use this simulation to study AP Chem 2.A.1, 2.A.2, and 2.B.1?",
        answer:
          "AP Chem 2.A.1 covers the ionic and covalent bonding spectrum — use the simulation's six molecules to identify bond types by electronegativity difference. AP Chem 2.A.2 asks students to explain how bond type and geometry determine polarity — the showDipoles overlay directly demonstrates vector addition of bond dipoles. AP Chem 2.B.1 requires predicting VSEPR geometries for all six molecules displayed here. NGSS HS-PS1-1 is also supported.",
      },
      {
        question: "What is dipole moment and what are typical values?",
        answer:
          "Dipole moment (μ) = charge × distance, measured in debyes (D). A fully ionic bond of unit charge separated by 100 pm would have μ ≈ 4.8 D. Real polar covalent bonds are much smaller: H-F is 1.82 D, H₂O molecule is 1.85 D, NH₃ is 1.47 D. Nonpolar molecules like CO₂, CH₄, and BF₃ have μ = 0 D. The showDipoles overlay draws vectors proportional to these values.",
      },
      {
        question: "How does ball-and-stick differ from spacefill mode and when should I use each?",
        answer:
          "Ball-and-stick (bondType=1) shows bond connectivity and angles clearly — best for identifying geometry and measuring bond angles. Spacefill (bondType=2) shows atoms at their van der Waals radii, giving a realistic picture of molecular size and the actual space a molecule occupies. Use spacefill when discussing intermolecular forces or explaining why large molecules have higher London dispersion forces than small ones.",
      },
    ],
  },
};
