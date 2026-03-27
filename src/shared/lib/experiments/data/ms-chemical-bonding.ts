import type { Experiment } from "@/shared/types/experiment";

export const msChemicalBonding: Experiment = {
  id: "ms-chemical-bonding",
  slug: "ms-chemical-bonding",
  title: "Chemical Bonding",
  subtitle: "Ionic, covalent, and metallic bonds — how atoms connect",
  description:
    "Explore why atoms bond and how different types of bonds form. Transfer electrons to create ionic bonds, share electrons for covalent bonds, and observe the electron sea in metallic bonds. Adjust electronegativity differences to predict bond type and watch crystal lattices or molecules assemble in real time.",
  thumbnail: "/imgs/experiments/ms-chemical-bonding.png",

  standards: {
    ngss: ["MS-PS1-1", "MS-PS1-3"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "6-8",
  tags: ["chemical bonding", "ionic bonds", "covalent bonds", "metallic bonds", "electronegativity", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "bondType",
      label: "Bond Type (0=Ionic, 1=Covalent, 2=Metallic)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "electronegativityDiff",
      label: "Electronegativity Difference",
      unit: "",
      min: 0,
      max: 3.3,
      default: 1.7,
      step: 0.1,
      tier: "free",
    },
    {
      id: "atomCount",
      label: "Number of Atoms",
      unit: "",
      min: 2,
      max: 20,
      default: 4,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\Delta \\text{EN} > 1.7 \\Rightarrow \\text{Ionic} \\quad | \\quad \\Delta \\text{EN} < 1.7 \\Rightarrow \\text{Covalent}",
      description: "Electronegativity difference predicts bond type: large difference means ionic, small means covalent",
    },
    {
      latex: "\\text{Octet Rule: atoms bond to achieve 8 valence electrons}",
      description: "Most atoms form bonds to fill their outer shell with 8 electrons (2 for hydrogen), reaching a stable noble-gas configuration",
    },
  ],

  theory:
    "Atoms bond because they become more stable when they share, transfer, or pool their valence electrons. Ionic bonds form when one atom transfers electrons to another — typically a metal giving electrons to a nonmetal (e.g., Na donates 1 electron to Cl, forming NaCl). The resulting positive and negative ions attract strongly, creating crystal lattices. Covalent bonds form when two nonmetals share electron pairs (e.g., two oxygen atoms share 2 pairs in O₂). The shared electrons sit between the nuclei, holding them together. Metallic bonds occur in pure metals: atoms release their valence electrons into a shared 'electron sea' that flows freely between positive metal cores. This explains why metals conduct electricity and can bend without breaking. The electronegativity difference between two atoms predicts which bond type forms: above ~1.7 tends toward ionic, below ~1.7 tends toward covalent, and metallic bonding occurs between identical metal atoms.",

  instructions:
    "Select a bond type to see it in action. In Ionic mode, watch electrons jump from one atom to another and see the crystal lattice form. In Covalent mode, watch electron pairs being shared between atoms. In Metallic mode, observe the electron sea flowing around metal cores. Adjust the electronegativity difference to see how it determines bond character. Increase atom count to build larger structures.",

  challenges: [
    {
      id: "cb-ms-c1",
      question: "Table salt (NaCl) is held together by ionic bonds. Why does it dissolve so easily in water but has a very high melting point (801 °C)?",
      hint: "Water molecules are polar — their partial charges pull Na⁺ and Cl⁻ ions apart. But in solid form, the strong electrostatic attraction between billions of alternating positive and negative ions in the crystal lattice requires enormous energy (heat) to overcome. So ionic compounds dissolve easily in polar solvents but need extreme heat to melt.",
      tier: "free",
    },
    {
      id: "cb-ms-c2",
      question: "Diamond and graphite are both pure carbon, yet diamond is the hardest natural material while graphite is soft enough for pencils. How can the same element behave so differently?",
      hint: "It's all about bonding arrangement. In diamond, each carbon forms 4 covalent bonds in a rigid 3D tetrahedral network — every atom is locked in place. In graphite, each carbon forms 3 covalent bonds in flat sheets (layers), with only weak forces between layers. Those layers slide over each other easily, which is why graphite feels slippery and leaves marks on paper.",
      tier: "free",
    },
    {
      id: "cb-ms-c3",
      question: "Metals can be hammered into thin sheets (malleable) and stretched into wires (ductile). Why don't they shatter like glass?",
      hint: "In metallic bonding, the electron sea acts as a flexible glue. When you hammer a metal, the layers of positive cores slide past each other, but the electron sea immediately reshapes around the new arrangement — the bond doesn't break. In ionic or covalent crystals, shifting the layers puts same-charge ions next to each other (repulsion!) or breaks rigid bonds, causing the material to crack.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["lewis-structures", "molecular-polarity"],

  htmlPath: "/experiments/middle/ms-chemical-bonding.html",

  seoTitle: "Chemical Bonding Simulation Middle School | Scivra Interactive Chemistry",
  seoKeywords: [
    "chemical bonding middle school simulation",
    "ionic covalent metallic bonds interactive",
    "electronegativity bond type simulation 6-8",
    "electron transfer sharing visualization",
    "NGSS MS-PS1-1 chemical bonding",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Chemical Bonding: Ionic, Covalent, and Metallic Bonds",
  },
};
