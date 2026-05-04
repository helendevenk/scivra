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
      id: "electronegativityDifference",
      label: "Electronegativity Slider (value × 0.1 = ΔEN)",
      unit: "",
      min: 0,
      max: 33,
      default: 1.4,
      step: 1,
      tier: "free",
    },
    {
      id: "bondEnergy",
      label: "Bond Energy",
      unit: "kJ/mol",
      min: 50,
      max: 1000,
      default: 460,
      step: 10,
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
    "Atoms bond because they become more stable when they share, transfer, or pool their valence electrons. Ionic bonds form when one atom transfers electrons to another — typically a metal giving electrons to a nonmetal (e.g., Na donates 1 electron to Cl, forming NaCl). The resulting positive and negative ions attract strongly, creating crystal lattices. Covalent bonds form when two nonmetals share electron pairs (e.g., two oxygen atoms share 2 pairs in O₂). The shared electrons sit between the nuclei, holding them together. Metallic bonds occur in pure metals: atoms release their valence electrons into a shared 'electron sea' that flows freely between positive metal cores. This explains why metals conduct electricity and can bend without breaking. A large electronegativity difference between two atoms favors ionic bonding; a small difference favors covalent bonding; metallic bonding applies when metal atoms pool electrons in an extended lattice.",

  instructions:
    "Use the Electronegativity Difference slider to move from nonpolar covalent behavior, through polar covalent sharing, toward ionic character. Use the Bond Energy slider to make the bond easier or harder to break and watch how stronger bonds pull the atoms into a shorter, tighter connection.",

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
  htmlControlAliases: { electronegativityDifference: "sl-delta", bondEnergy: "sl-energy" },
  contentSections: {
    whatIsIt:
      "Why do atoms stick together at all? The answer is that atoms are most stable when their outermost electron shell is full — typically 8 electrons for most elements. Atoms that have too many or too few valence electrons can reach that stable arrangement by connecting with other atoms through chemical bonds. This simulation shows three distinct bonding strategies that nature uses. In ionic bonding, a metal atom gives one or more electrons to a nonmetal, creating oppositely charged ions that attract each other strongly — think of the salt on your food. In covalent bonding, two nonmetal atoms share electrons between them, keeping both satisfied without a full transfer — think of the oxygen molecules you breathe. In metallic bonding, metal atoms release their valence electrons into a shared cloud that flows freely between all atoms in the material, which is why metals conduct electricity and can be bent without breaking. Adjusting the electronegativity difference between atoms shows how the same fundamental drive toward a full outer shell leads to three very different types of materials.",
    parameterExplanations: {
      electronegativityDifference:
        "Electronegativity Difference uses the HTML slider's literal integer scale: slider value × 0.1 = ΔEN. A slider value of 0 means ΔEN 0.0, and 33 means ΔEN 3.3 chemistry-wise. Near ΔEN 0.0, both atoms pull almost equally, so the model behaves like a nonpolar covalent bond with shared electrons centered between atoms. From about 0.5 to 1.7, the bond becomes polar covalent: electrons are still shared, but the higher-electronegativity atom pulls the cloud toward itself and creates a visible dipole. Above about 1.7, the model shifts toward ionic character, where electron transfer and strong charge separation dominate. Keep Bond Energy fixed while moving this slider to isolate how electron attraction changes bond type and polarity.",
      bondEnergy:
        "Bond Energy sets the energy needed to break the bond, measured in kilojoules per mole. Lower values represent weaker attractions that are easier to disrupt, while higher values represent stronger bonds that hold atoms more tightly together. In the visualization, increasing this slider makes the bonded atoms pulse with greater strength and reinforces the idea that short, stable bonds usually require more energy to break. Use this slider after choosing an electronegativity difference so students can separate two ideas: Δχ predicts how electrons are distributed, while bond energy describes how strongly the atoms are held together.",
    },
    misconceptions: [
      {
        wrong: "Electrons in a covalent bond belong equally to both atoms.",
        correct:
          "Unless both atoms are identical (like in O2 or Cl2), the shared electrons are pulled more toward the atom with higher electronegativity. In a water molecule (H2O), the oxygen atom pulls the shared electrons much more strongly than hydrogen does, creating partial negative and positive charges. This unequal sharing is called a polar covalent bond and is why water has so many unusual properties — like being able to dissolve so many substances.",
      },
      {
        wrong: "Ionic compounds are always solids that cannot conduct electricity.",
        correct:
          "Ionic compounds are typically solid at room temperature because their crystal lattices are rigid. However, when dissolved in water or melted, the ions become free to move — and mobile ions can carry electrical charge. Saltwater conducts electricity because dissolved Na+ and Cl- ions are free to flow. Solid table salt does not conduct electricity because the ions are locked in place in the lattice.",
      },
      {
        wrong: "A larger electronegativity difference always means a stronger bond.",
        correct:
          "Electronegativity difference and bond energy describe different parts of bonding. Electronegativity difference tells you how unevenly electrons are shared, or whether electron transfer is likely. Bond energy tells you how much energy it takes to break the bond. A highly polar or ionic bond can be strong, but strength also depends on atom size, charge, distance between nuclei, and the surrounding structure. Use the two sliders separately: one changes electron distribution and polarity, while the other changes how tightly the atoms are held together.",
      },
      {
        wrong: "Covalent bonds are always weaker than ionic bonds.",
        correct:
          "Bond strength depends on the specific atoms involved, not simply on the bond type. Carbon-carbon single covalent bonds in diamond are among the strongest bonds in all of chemistry, making diamond the hardest natural material. Some ionic bonds are relatively weak. Multiple covalent bonds (double and triple) are generally stronger than single covalent bonds. Comparing bond types without specifying the atoms involved does not reliably predict which is stronger.",
      },
    ],
    teacherUseCases: [
      "Electronegativity threshold demo: keep Bond Energy at 460 kJ/mol, then move Electronegativity Difference from 0.0 to 2.1. Students record when the model looks nonpolar covalent, polar covalent, and ionic-like, then connect electron location to MS-PS1-1 particle-level modeling.",
      "Bond strength isolation: set Electronegativity Difference near 1.4, then move Bond Energy from a low value to a high value. Students describe what changes and what stays the same, separating electron distribution from the energy required to break a bond.",
      "Two-variable investigation: assign pairs different combinations of Electronegativity Difference and Bond Energy. Students compare observations and explain why a bond can be highly polar without treating polarity and strength as the same property.",
      "Material-properties discussion: after students explore high and low slider values, give examples such as table salt, water, hydrogen, and diamond. Students use Δχ, bond energy, and evidence from the visualization to justify claims about bond type, polarity, and material behavior.",
    ],
    faq: [
      {
        question: "Why do atoms form chemical bonds in the first place?",
        answer:
          "Atoms form bonds because bonding lowers their potential energy, making them more stable than they would be as separate, isolated atoms. Most atoms have incomplete outer electron shells that make them chemically reactive. By bonding — whether by transferring or sharing electrons — atoms can achieve a filled outer shell, typically 8 electrons (the octet rule, with hydrogen needing only 2). This stable arrangement requires less energy to maintain, so bonded atoms are more stable than unbonded ones. Think of it like a ball rolling to the bottom of a hill: the bonded state is the energy valley, and the unbonded state is higher up the hill.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation directly supports MS-PS1-1 (develop models to describe the atomic composition of simple molecules and extended structures) and MS-PS1-3 (gather and analyze evidence to explain the relationship between intermolecular forces and material properties such as melting point, solubility, and conductivity). The electronegativity and bond-energy controls connect particle-level electron behavior to observable properties students discuss in laboratory settings.",
      },
      {
        question: "What is electronegativity and how do scientists measure it?",
        answer:
          "Electronegativity is a number that represents how strongly an atom attracts electrons in a chemical bond. It was developed by chemist Linus Pauling in the 1930s using experimental measurements of bond energies. Fluorine has the highest electronegativity (4.0 on the Pauling scale) and francium the lowest (about 0.7). The electronegativity difference between two bonding atoms predicts whether the bond will be ionic, polar covalent, or nonpolar covalent. Students do not need to memorize electronegativity values, but understanding the concept helps explain why some bonds pull electrons more than others.",
      },
      {
        question: "Can a molecule have both ionic and covalent bonds?",
        answer:
          "Yes. Many everyday molecules contain both types of bonding. For example, sodium nitrate (NaNO3) has an ionic bond between the sodium ion (Na+) and the nitrate group (NO3-), but the nitrogen and oxygen atoms within the nitrate group are connected by covalent bonds. Similarly, calcium carbonate (CaCO3, the main component of limestone and chalk) has ionic bonds holding the calcium ion to the carbonate group, while the carbonate group itself is held together by covalent bonds. Recognizing this mixed bonding helps explain why compounds can have complex and varied properties.",
      },
      {
        question: "What does bond energy tell me that electronegativity does not?",
        answer:
          "Electronegativity difference tells you how strongly each atom pulls on electrons, so it helps predict whether a bond is nonpolar covalent, polar covalent, or ionic-like. Bond energy tells you how much energy is required to pull the bonded atoms apart. Those ideas are related, but they are not the same. A bond can be very polar because the atoms pull electrons unevenly, while its strength still depends on atom size, charge, bond length, and the surrounding structure. Using both sliders helps students describe both electron distribution and bond stability.",
      },
    ],
  },
};
