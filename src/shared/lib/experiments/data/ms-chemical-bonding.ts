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
  contentSections: {
    whatIsIt:
      "Why do atoms stick together at all? The answer is that atoms are most stable when their outermost electron shell is full — typically 8 electrons for most elements. Atoms that have too many or too few valence electrons can reach that stable arrangement by connecting with other atoms through chemical bonds. This simulation shows three distinct bonding strategies that nature uses. In ionic bonding, a metal atom gives one or more electrons to a nonmetal, creating oppositely charged ions that attract each other strongly — think of the salt on your food. In covalent bonding, two nonmetal atoms share electrons between them, keeping both satisfied without a full transfer — think of the oxygen molecules you breathe. In metallic bonding, metal atoms release their valence electrons into a shared cloud that flows freely between all atoms in the material, which is why metals conduct electricity and can be bent without breaking. Adjusting the electronegativity difference between atoms shows how the same fundamental drive toward a full outer shell leads to three very different types of materials.",
    parameterExplanations: {
      bondType:
        "Selects the type of chemical bond to visualize (0=Ionic, 1=Covalent, 2=Metallic). In Ionic mode, electrons are shown jumping from the metal atom to the nonmetal, and the resulting crystal lattice assembles on screen. In Covalent mode, electron pairs are shown being shared between two nonmetal atoms. In Metallic mode, a flowing electron sea surrounds fixed positive metal cores. Changing this parameter switches the entire visualization and shows different structural properties like lattice arrangement vs. molecular shape vs. electron mobility.",
      electronegativityDiff:
        "Sets the difference in electronegativity between the two bonding atoms (0 to 3.3). Electronegativity is a measure of how strongly an atom pulls shared electrons toward itself. A large difference (above about 1.7) means one atom pulls so strongly that electrons transfer completely — producing an ionic bond. A small difference (below 1.7) means both atoms pull with similar strength, so electrons are shared — producing a covalent bond. A difference near zero, as in bonding between identical metal atoms, leads to metallic bonding. This parameter lets you explore the continuous spectrum from purely covalent to highly ionic character.",
      atomCount:
        "Sets the number of atoms shown in the bonding visualization (2 to 20). With 2 atoms you see a single bond or ion pair clearly. Increasing the count builds up the repeating crystal lattice of an ionic compound, extends the covalent molecule, or expands the electron sea in a metal. Larger atom counts help illustrate why bulk properties — like the rigidity of an ionic crystal or the electrical conductivity of a metal — emerge from the collective behavior of many bonded atoms, not just from a single pair.",
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
        wrong: "Metallic bonding means the electrons belong to specific atoms.",
        correct:
          "In metallic bonding, valence electrons are not owned by any particular atom. They are delocalized — they belong to the entire metal as a shared electron sea. This is why metals conduct heat and electricity so well (electrons can move freely throughout the material), and why metals are malleable (the layers of positive cores can slide past each other while the electron sea reshapes around them, preventing the structure from shattering).",
      },
      {
        wrong: "Covalent bonds are always weaker than ionic bonds.",
        correct:
          "Bond strength depends on the specific atoms involved, not simply on the bond type. Carbon-carbon single covalent bonds in diamond are among the strongest bonds in all of chemistry, making diamond the hardest natural material. Some ionic bonds are relatively weak. Multiple covalent bonds (double and triple) are generally stronger than single covalent bonds. Comparing bond types without specifying the atoms involved does not reliably predict which is stronger.",
      },
    ],
    teacherUseCases: [
      "Bond type comparison: set atomCount to 4. Run ionic mode with electronegativityDiff at 2.5, then covalent mode with electronegativityDiff at 0.4, then metallic mode with electronegativityDiff at 0. Students diagram each case and describe where the electrons are in each scenario, connecting electron location to the properties of each material type (MS-PS1-1).",
      "Electronegativity gradient exploration: hold bondType at 0 (Ionic) and atomCount at 6. Slowly decrease electronegativityDiff from 3.3 to 0.5. Students observe how the degree of electron transfer decreases and describe the transition from fully ionic to polar covalent character, building the conceptual model that bond type is a spectrum rather than three sharp categories (MS-PS1-3).",
      "Malleability of metals vs. brittleness of ionic solids: set bondType to 2 (Metallic) and atomCount to 20. Ask students to predict what happens when you apply force to a metal — do the bonds break? Then set bondType to 0 (Ionic) and repeat the prediction. Students use the electron sea model vs. ion lattice model to explain why metals bend while salt crystals crack, connecting atomic-level structure to observable bulk properties.",
      "Real-world materials sorting activity: after exploring all three bond types, give students a list of materials (copper wire, table salt, sugar, glass, aluminum foil, diamond) and ask them to sort by bond type using clues like conductivity, melting point, and brittleness. They then verify their predictions using the electronegativityDiff and bondType controls as a reference model.",
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
          "This simulation directly supports MS-PS1-1 (develop models to describe the atomic composition of simple molecules and extended structures) and MS-PS1-3 (gather and analyze evidence to explain the relationship between intermolecular forces and material properties such as melting point, solubility, and conductivity). The three bond types shown — ionic, covalent, and metallic — connect particle-level electron behavior to the observable properties students measure in laboratory settings.",
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
        question: "Why do metals conduct electricity but nonmetal covalent compounds typically do not?",
        answer:
          "Electrical conductivity requires charged particles that can move freely through a material. In metals, the delocalized electron sea flows freely in response to an applied voltage, carrying charge through the metal. In covalent compounds like sugar or plastic, all electrons are tightly shared between specific pairs of atoms and cannot move from one molecule to another. There are no mobile charge carriers, so covalent compounds are typically insulators. Ionic compounds can conduct electricity only when the ions are free to move — when dissolved in water or melted — not in solid form where ions are locked in the crystal lattice.",
      },
    ],
  },
};
