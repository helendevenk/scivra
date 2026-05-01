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
  contentSections: {
    whatIsIt:
      "Molecular geometry is the 3D arrangement of atoms in a molecule, determined by how electron pairs — both bonding and lone — push each other away to maximize separation. Ammonia smells sharp and dissolves readily in water because its trigonal pyramidal shape (107°) creates a net dipole; a flat version of NH₃ would behave completely differently. VSEPR (Valence Shell Electron Pair Repulsion) theory predicts this shape from a single rule: electron domains around a central atom adopt the geometry that minimizes repulsion. This simulation builds molecules in 3D from a library of ten structures, labels every bond angle, and lets you rotate the model freely. It also shows how lone pairs compress angles below the ideal value — compare perfect tetrahedral methane (109.5°) with bent water (104.5°) or trigonal pyramidal ammonia (107°). AP Chem 2.B.1 and 2.C.4 are the governing standards.",
    parameterExplanations: {
      moleculeIndex:
        "Selects the molecule to build, numbered 0 through 9 (including H₂O, CH₄, NH₃, CO₂, BF₃, SF₆, and others). Each selection rebuilds the 3D model from scratch with correct bond lengths, angles, and lone-pair positions. Stepping sequentially through the library is an efficient way to survey all five core VSEPR geometries in one sitting.",
      showBondAngles:
        "Toggles the arc labels that display each measured bond angle in degrees directly on the 3D model. Setting this to 1 lets students read 104.5° on water or 90° and 120° on the axial and equatorial positions of a trigonal bipyramidal molecule. Turning it off before a quiz forces students to recall angles from memory rather than reading them off the display.",
    },
    misconceptions: [
      {
        wrong:
          "Water is linear because oxygen forms exactly two bonds, like CO₂.",
        correct:
          "The molecular geometry follows the electron domains, not just the bonds. Oxygen in water has four electron domains (two bonding + two lone pairs), which arrange tetrahedrally. The two lone pairs are invisible in the molecular geometry but they push the H-O-H angle down to 104.5°, making the shape bent — not linear. CO₂'s carbon has no lone pairs, so its two domains stay at 180°.",
      },
      {
        wrong:
          "Lone pairs do not count when predicting molecular shape because they are not attached to an atom you can see.",
        correct:
          "Lone pairs count as full electron domains in VSEPR and they exert more repulsion than bonding pairs. Ignoring the lone pairs on nitrogen in NH₃ would predict trigonal planar geometry (120°), but the actual geometry is trigonal pyramidal at 107° precisely because the lone pair compresses all three N-H bond angles.",
      },
      {
        wrong:
          "All molecules with four bonds around the central atom have 109.5° bond angles.",
        correct:
          "109.5° is the ideal angle only when all four domains are bonding pairs with no lone pairs, as in CH₄. Replace one bonding pair with a lone pair (NH₃) and the angle drops to ~107°. Replace two with lone pairs (H₂O) and it drops to ~104.5°. Lone pairs take up more angular space, systematically compressing the bond angles.",
      },
      {
        wrong:
          "A trigonal planar molecule and a trigonal pyramidal molecule have the same number of bonds, so they must have the same shape.",
        correct:
          "BF₃ (trigonal planar, 120°) has three bonding domains and zero lone pairs around boron. NH₃ (trigonal pyramidal, 107°) has three bonding domains and one lone pair around nitrogen — four domains total. The lone pair bends the pyramid down below the plane of the three bonds. Same bond count, completely different geometry and different polarity.",
      },
    ],
    teacherUseCases: [
      "Pre-lab geometry sketch: before loading any molecule, ask students to sketch the predicted 3D shape and bond angle for water, ammonia, and methane using only the VSEPR domain-counting rule. Open the simulation to check — discrepancies reveal whether students are correctly counting lone pairs.",
      "Lone-pair compression data table: run moleculeIndex through CH₄ (4 bonding, 0 lone), NH₃ (3 bonding, 1 lone), and H₂O (2 bonding, 2 lone), recording bond angles at each step. Students compare the three values, describe the direction of compression as lone-pair count rises, and connect to AP Chem 2.C.4 — without quoting a single 'per-lone-pair' constant, which over-generalizes from this small sample.",
      "Misconception probe on linear molecules: load CO₂ and H₂O back to back. Ask students 'both oxygen atoms form two bonds — why is one linear and one bent?' Use the electron-domain count to resolve the conflict and reinforce that lone pairs are the decisive factor.",
      "Polarity prediction connect: after establishing geometry, ask students to predict whether each molecule has a net dipole before toggling dipole arrows in the molecular-bonding simulation. CH₄ (tetrahedral, no net dipole) vs. H₂O (bent, net dipole pointing toward O) makes the geometry-polarity link concrete.",
      "VSEPR geometry gallery challenge: students match a list of electron-domain counts (2, 3, 4, 5, 6) to the five geometry names and ideal angles without the simulation, then verify each one by loading the corresponding molecule — a timed retrieval practice that reinforces AP Chem 2.B.1.",
    ],
    faq: [
      {
        question: "Why is water's bond angle 104.5° instead of the tetrahedral 109.5°?",
        answer:
          "Water has four electron domains around oxygen (two bonding pairs + two lone pairs). Lone pairs are held by only one nucleus and spread out more than bonding pairs, exerting greater repulsion on the H-O bonds and pushing them together. The result is a compression of about 5° below the ideal tetrahedral angle. Set moleculeIndex to water and toggle showBondAngles=1 to see the labeled 104.5°.",
      },
      {
        question: "What are the five main VSEPR geometries and their ideal bond angles?",
        answer:
          "Two electron domains: linear, 180° (CO₂). Three domains: trigonal planar, 120° (BF₃). Four domains: tetrahedral, 109.5° (CH₄). Five domains: trigonal bipyramidal — equatorial-equatorial 120°, equatorial-axial 90°, and axial-axial 180° (PCl₅). Six domains: octahedral — adjacent F-S-F angles 90°, opposite F-S-F angles 180° (SF₆). Lone pairs reduce these to bent, trigonal pyramidal, see-saw, T-shape, and square planar variants. AP Chem 2.B.1 covers all five parent geometries.",
      },
      {
        question: "How does the number of lone pairs change the molecular geometry name?",
        answer:
          "The electron geometry is named for all domains; the molecular geometry is named for the bonding domains only. Four total domains give tetrahedral electron geometry. Zero lone pairs: tetrahedral molecular geometry (CH₄). One lone pair: trigonal pyramidal (NH₃). Two lone pairs: bent (H₂O). The electron geometry is the same in all three cases; only the molecular geometry label changes.",
      },
      {
        question: "Does this simulation cover AP Chem 2.B.1 and 2.C.4?",
        answer:
          "AP Chem 2.B.1 requires predicting molecular geometries using VSEPR theory for molecules with two to six electron domains — all five parent geometries appear in the moleculeIndex library. AP Chem 2.C.4 connects geometry to molecular polarity, which the simulation addresses through bond-angle data and the optional dipole display. NGSS HS-PS1-1 and HS-PS1-3 are also supported through the electron-pair model.",
      },
      {
        question: "What is the bond angle in SF₆ and why is it different from the 109.5° in CH₄?",
        answer:
          "SF₆ has six bonding pairs arranged octahedrally around sulfur. Adjacent F-S-F bond angles are 90° and opposite F-S-F angles are 180°. Sulfur is drawn here as an expanded-octet (hypervalent) center — the standard AP-level Lewis representation for period-3+ atoms that show more than four bonds, even though modern bonding theories no longer rely on d-orbital participation as the explanation. CH₄'s 109.5° arises specifically from four domains around carbon, not from any general tetrahedral rule.",
      },
    ],
  },
};
