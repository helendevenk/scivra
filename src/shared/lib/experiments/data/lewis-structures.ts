import type { Experiment } from "@/shared/types/experiment";

export const lewisStructures: Experiment = {
  id: "lewis-structures",
  slug: "lewis-structures",
  title: "Lewis Structures",
  subtitle: "Dot structures, bonding pairs, and lone pairs",
  description:
    "Draw Lewis dot structures for common molecules by placing bonding pairs and lone pairs around atoms. Learn to count valence electrons, apply the octet rule, calculate formal charges, and identify resonance structures. Interactive SVG canvas lets you build molecules step by step.",
  thumbnail: "/imgs/experiments/lewis-structures.png",

  standards: {
    ngss: ["HS-PS1-1", "HS-PS1-3"],
    gcse: ["C2.1", "C2.2"],
    ap: ["2.C.1", "2.C.2"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: [
    "Lewis structures",
    "dot structures",
    "covalent bonding",
    "lone pairs",
    "octet rule",
    "formal charge",
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
      id: "showFormalCharge",
      label: "Show Formal Charges (0=Off, 1=On)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\text{Formal Charge} = V - N - \\frac{B}{2}",
      description:
        "V = valence electrons, N = non-bonding electrons, B = bonding electrons",
    },
    {
      latex: "\\text{Total valence } e^- = \\sum \\text{group number of each atom} \\pm \\text{charge}",
      description:
        "Count total valence electrons before distributing into bonds and lone pairs",
    },
  ],

  theory:
    "Lewis structures represent the valence electrons in a molecule as dots and lines. A single bond is one shared electron pair (2 e⁻), a double bond is two pairs (4 e⁻), and a triple bond is three pairs (6 e⁻). The octet rule states most atoms want 8 electrons in their valence shell (H wants 2). Steps: (1) Count total valence electrons, (2) Place single bonds between bonded atoms, (3) Complete octets on terminal atoms with lone pairs, (4) Use remaining electrons on the central atom, (5) If central atom lacks an octet, convert lone pairs to multiple bonds. Formal charge = valence e⁻ − lone pair e⁻ − ½(bonding e⁻). Structures with formal charges closest to zero are most stable. Some molecules have resonance structures — multiple valid Lewis structures that differ only in electron placement.",

  instructions:
    "Select a molecule from the dropdown. The structure builder shows atoms positioned for you. Click between atoms to place bonds (single → double → triple → remove). Click on an atom to add/remove lone pairs. The electron counter tracks your progress. When the structure is valid (all octets satisfied, correct electron count), you'll see a green checkmark.",

  challenges: [
    {
      id: "ls-c1",
      question: "Draw the Lewis structure of H₂O. How many lone pairs does oxygen have?",
      hint: "H₂O has 8 valence e⁻ (6 from O + 1 each from 2 H). Two bonding pairs (O-H) and two lone pairs on O.",
      tier: "free",
    },
    {
      id: "ls-c2",
      question: "Draw the Lewis structure of CO₂. What type of bonds does carbon form?",
      hint: "CO₂ has 16 valence e⁻. Carbon forms two double bonds (O=C=O). Each oxygen has two lone pairs.",
      tier: "free",
    },
    {
      id: "ls-c3",
      question: "Draw all resonance structures of the nitrate ion NO₃⁻.",
      hint: "NO₃⁻ has 24 valence e⁻ (5+18+1). Three equivalent structures, each with one N=O double bond and two N-O single bonds. The double bond rotates among the three positions.",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["molecular-bonding", "molecular-polarity"],
  htmlPath: "/experiments/ap-chemistry/lewis-structures.html",

  seoTitle: "Lewis Structures Interactive Builder | Scivra AP Chemistry",
  seoKeywords: [
    "Lewis structure drawing tool",
    "Lewis dot structure practice",
    "covalent bonding simulation",
    "formal charge calculator",
    "AP Chemistry Lewis structures",
    "octet rule interactive",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Lewis Structures and Covalent Bonding",
  },
};
