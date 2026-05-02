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
      id: "deltaEN",
      label: "Electronegativity Δ (×10)",
      unit: "",
      min: 0,
      max: 35,
      default: 21,
      step: 1,
      tier: "free",
    },
    {
      id: "bondLength",
      label: "Bond Length",
      unit: "pm",
      min: 70,
      max: 400,
      default: 281,
      step: 1,
      tier: "free",
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
    "Use the Electronegativity Δ (×10) slider to move across the nonpolar covalent, polar covalent, and ionic bonding continuum, and use the Bond Length slider to adjust the internuclear distance in picometers. Try the NaCl (ionic), H₂O (polar), and N₂ (nonpolar) presets to compare three anchor cases.",

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
  htmlControlAliases: {
    deltaEN: "sl-den",
    bondLength: "sl-len",
  },
  presets: [
    {
      id: "NaCl",
      label: "NaCl (ionic)",
      description: "A high-electronegativity-difference, long-bond anchor case for predominantly ionic bonding.",
      paramValues: { deltaEN: 21, bondLength: 281 },
    },
    {
      id: "H2O",
      label: "H₂O (polar)",
      description: "A polar covalent anchor case with moderate electronegativity difference and short O-H bonds.",
      paramValues: { deltaEN: 14, bondLength: 96 },
    },
    {
      id: "N2",
      label: "N₂ (nonpolar)",
      description: "A nonpolar covalent anchor case with equal electronegativity and a short triple bond.",
      paramValues: { deltaEN: 0, bondLength: 110 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Chemical bonding describes how atoms join by transferring or sharing valence electrons to reach lower-energy, more stable arrangements. Table salt (NaCl) forms when sodium transfers one electron to chlorine — an ionic bond held together by ~787 kJ/mol of lattice energy. Water forms when two hydrogen atoms each share an electron pair with oxygen — a polar covalent bond where the higher electronegativity of oxygen (3.44 vs. H at 2.20) pulls electron density toward itself, creating partial charges. This simulation lets students explore the bonding continuum directly: adjust the Electronegativity Δ (×10) slider to move from nonpolar covalent through polar covalent toward predominantly ionic bonding, and change the Bond Length slider to inspect how internuclear distance varies across that continuum. The NaCl, H₂O, and N₂ presets anchor three reference cases that map to AP Chem 2.A.1, 2.A.2, and 2.B.1.",
    parameterExplanations: {
      deltaEN:
        "Electronegativity Δ (×10) represents the difference in Pauling electronegativity between two bonded atoms, scaled so a slider value of 14 means ΔEN = 1.4. In AP Chemistry, this value is best treated as a continuum rather than a set of hard boxes. Near 0, electrons are shared nearly equally and the bond is nonpolar covalent, as in N₂. Around 4-17 on this slider, electron density is pulled toward the more electronegative atom, producing polar covalent character such as an O-H bond in water. Above about 17, the bond is described as predominantly ionic, as in NaCl, though real bonds can retain some covalent character.",
      bondLength:
        "Bond Length sets the distance between bonded nuclei in picometers. Shorter bonds usually reflect stronger attraction and greater orbital overlap, especially when the bonded atoms are small or the bond order is high, such as the short N≡N distance in N₂. Longer distances often appear for larger ions or atoms, such as the Na-Cl separation in crystalline salt. Bond length is not determined by electronegativity difference alone: atom size, bond order, charge distribution, and the surrounding structure all matter. Use it with Electronegativity Δ (×10) to compare how bond character and internuclear distance jointly shape chemical properties.",
    },
    misconceptions: [
      {
        wrong:
          "Polar bonds always make the entire structure polar.",
        correct:
          "A polar bond means electron density is uneven within that bond, but overall polarity also depends on geometry and vector addition. CO₂ has polar C=O bonds, yet the linear arrangement makes equal bond dipoles cancel. H₂O has polar O-H bonds and a bent shape, so the dipoles do not cancel. Use the H₂O (polar) preset as a covalent example with uneven sharing, then compare the N₂ (nonpolar) preset where ΔEN = 0 and no bond polarity is expected.",
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
          "Electronegativity difference gives a continuous spectrum, not a step function. ΔEN below ~0.4 is treated as nonpolar covalent, ΔEN from ~0.4 to ~1.7 is polar covalent, and ΔEN above ~1.7 is described as predominantly ionic. The NaCl (ionic), H₂O (polar), and N₂ (nonpolar) presets are useful anchors, but the boundaries are approximate. Bond character changes gradually along the spectrum, and AP Chem 2.A.1 expects students to reason from evidence rather than memorize absolute cutoffs.",
      },
      {
        wrong:
          "A longer bond must always be weaker only because the atoms are less electronegative.",
        correct:
          "Bond length and bond strength are related, but electronegativity difference is not the only cause. Atomic radius, bond order, ionic radius, charge, and crystal or molecular environment all influence the distance between nuclei. N₂ has a short bond largely because it is a triple bond between small atoms. NaCl has a much longer Na-Cl distance because it involves larger ions arranged in an extended lattice. Change Bond Length separately from Electronegativity Δ (×10) to keep those ideas distinct.",
      },
      {
        wrong:
          "Nonpolar covalent, polar covalent, and ionic bonds are three unrelated categories.",
        correct:
          "They are useful labels on a continuous bonding spectrum. As electronegativity difference increases, electron sharing becomes less equal, partial charges become more pronounced, and the description shifts from nonpolar covalent to polar covalent to predominantly ionic. The N₂ preset starts at ΔEN = 0, the H₂O preset places the bond in the polar covalent range, and the NaCl preset moves into the predominantly ionic range. The categories help communicate patterns, but the underlying variable changes continuously.",
      },
    ],
    teacherUseCases: [
      "Bonding continuum opener: have students click N₂ (nonpolar), H₂O (polar), and NaCl (ionic), then record Electronegativity Δ (×10), Bond Length, and the displayed bond classification. Ask for a one-sentence claim connecting particle-level structure to properties, supporting HS-PS1-3.",
      "Controlled-variable comparison: keep Bond Length constant while increasing Electronegativity Δ (×10) from 0 to 35. Students identify where the model transitions from nonpolar covalent to polar covalent to predominantly ionic, then explain why the boundaries are approximate rather than absolute.",
      "Distance-and-attraction discussion: keep Electronegativity Δ (×10) near the H₂O (polar) preset, then move Bond Length from short to long. Students describe how changing internuclear distance affects the visual model and connect electrostatic attraction to HS-PS2-6.",
      "Preset evidence table: assign groups one preset each — NaCl (ionic), H₂O (polar), or N₂ (nonpolar). Each group reports the parameter values, predicted bond character, and one real chemical property that follows from electron distribution or bond distance.",
      "AP Chemistry quick CER: students choose two of the three presets and write a claim comparing bond character. Their evidence must cite Electronegativity Δ (×10) and Bond Length values, and their reasoning must use the ionic/polar/nonpolar continuum rather than a memorized label alone.",
    ],
    faq: [
      {
        question: "What electronegativity difference separates ionic from polar covalent bonds?",
        answer:
          "The commonly used threshold is ΔEN greater than approximately 1.7 on the Pauling scale for predominantly ionic character and ΔEN less than 0.4 for nonpolar covalent. Between 0.4 and 1.7 is polar covalent. On this simulation, Electronegativity Δ (×10) scales those values by ten, so 17 corresponds to ΔEN = 1.7. These cutoffs are approximations. The NaCl (ionic), H₂O (polar), and N₂ (nonpolar) presets are anchor cases, not proof that bonding changes in sudden jumps.",
      },
      {
        question: "Why is CO₂ nonpolar if each C=O bond is polar?",
        answer:
          "CO₂ is linear, so the two C=O bond dipoles point in exactly opposite directions and cancel when added as vectors. A single C=O bond has a moderate electronegativity difference, but the entire linear structure has no net dipole. Compare that idea with the H₂O (polar) preset: O-H bonds are polar and the bent shape prevents cancellation. Bond polarity starts with Electronegativity Δ (×10), but overall polarity also depends on geometry.",
      },
      {
        question: "How do I use this simulation to study AP Chem 2.A.1, 2.A.2, and 2.B.1?",
        answer:
          "AP Chem 2.A.1 covers the ionic and covalent bonding spectrum, so start with the Electronegativity Δ (×10) slider and the N₂, H₂O, and NaCl presets. AP Chem 2.A.2 asks students to connect bond type and structure to polarity, so compare polar covalent and nonpolar covalent cases and discuss vector cancellation. AP Chem 2.B.1 involves molecular structure and geometry, which can be connected by asking how bond polarity and bond length fit into a larger model of molecular shape.",
      },
      {
        question: "What is dipole moment and what are typical values?",
        answer:
          "Dipole moment (μ) = charge × distance, measured in debyes (D). A fully ionic pair with unit charge separated by 100 pm would have μ ≈ 4.8 D. Real polar covalent bonds are usually smaller because the charges are partial, not full. H-F is about 1.82 D, an H₂O sample has a molecular dipole of about 1.85 D, and NH₃ is about 1.47 D. Nonpolar structures such as N₂ have μ = 0 D because equal atoms share electrons evenly.",
      },
      {
        question: "What do the NaCl, H₂O, and N₂ presets show?",
        answer:
          "They provide three reference points on the bonding continuum. NaCl (ionic) sets Electronegativity Δ (×10) to 21 and Bond Length to 281 pm, representing a predominantly ionic interaction. H₂O (polar) sets the controls to 14 and 96 pm, representing a polar covalent O-H bond. N₂ (nonpolar) sets the controls to 0 and 110 pm, representing equal electron sharing in a short triple bond. Use the presets first, then move one slider at a time to test which variable caused each observed change.",
      },
    ],
  },
};
