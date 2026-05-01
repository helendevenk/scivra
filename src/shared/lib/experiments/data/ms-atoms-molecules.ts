import type { Experiment } from "@/shared/types/experiment";

export const msAtomsMolecules: Experiment = {
  id: "ms-atoms-molecules",
  slug: "ms-atoms-molecules",
  title: "Atoms, Elements & the Periodic Table",
  subtitle: "From protons and neutrons to elements and compounds",
  description:
    "Build atoms by adding protons, neutrons, and electrons. Watch the element identity change. Navigate the periodic table and see how electron configuration determines chemical properties. Combine atoms into molecules and see how they bond.",
  thumbnail: "/imgs/experiments/ms-atoms-molecules.png",

  standards: {
    ngss: ["MS-PS1-1", "HS-PS1-1"],
    gcse: ["C2.1"],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "6-8",
  tags: ["atoms", "elements", "periodic table", "molecules", "protons neutrons electrons", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "protons",
      label: "Number of Protons (Z)",
      unit: "",
      min: 1,
      max: 18,
      default: 6,
      step: 1,
      tier: "free",
    },
    {
      id: "neutrons",
      label: "Number of Neutrons",
      unit: "",
      min: 0,
      max: 22,
      default: 6,
      step: 1,
      tier: "free",
    },
    {
      id: "electrons",
      label: "Number of Electrons",
      unit: "",
      min: 0,
      max: 18,
      default: 6,
      step: 1,
      tier: "free",
    },
    {
      id: "showBonding",
      label: "Show Molecular Bonding (0=No, 1=Yes)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "Z = \\text{protons} \\quad A = Z + N \\quad (\\text{mass number})",
      description: "Atomic number Z = protons. Mass number A = protons + neutrons",
    },
    {
      latex: "\\text{Ion: } Z \\neq e^- \\quad (+\\text{ ion if } e^- < Z, \\ -\\text{ if } e^- > Z)",
      description: "Ions form when electron count differs from proton count",
    },
  ],

  theory:
    "All matter is made of atoms. Each atom has a nucleus containing protons (positive charge) and neutrons (no charge), surrounded by electrons (negative charge) in shells. The number of protons (atomic number, Z) determines which element the atom is. Carbon always has 6 protons; oxygen always has 8. The mass number (A) = protons + neutrons. Isotopes are atoms of the same element with different numbers of neutrons. Ions have an unequal number of protons and electrons (charged). The periodic table organizes elements by atomic number and groups elements with similar properties in the same column. Elements in the same group have the same number of valence (outer shell) electrons, giving them similar chemical behavior.",

  instructions:
    "Use the proton slider to change the element — watch the atomic symbol update and electrons fill the shells. Add extra electrons to create negative ions; remove electrons for positive ions. Change neutrons to create isotopes (same element, different mass). Enable Bonding (Pro) to see how valence electrons form covalent bonds.",

  challenges: [
    {
      id: "am-ms-c1",
      question: "An atom has 8 protons and 10 neutrons. What element is it, and what is its mass number?",
      hint: "8 protons = Oxygen (O). Mass number A = protons + neutrons = 8 + 10 = 18. This is Oxygen-18, a stable isotope of oxygen.",
      tier: "free",
    },
    {
      id: "am-ms-c2",
      question: "What is the difference between Na (sodium) and Na⁺ (sodium ion)?",
      hint: "Na has 11 protons and 11 electrons (neutral). Na⁺ has 11 protons but only 10 electrons (lost one electron → positive charge of +1). Ions form when atoms gain or lose electrons.",
      tier: "free",
    },
    {
      id: "am-ms-c3",
      question: "Why do elements in the same column (group) of the periodic table have similar properties?",
      hint: "They have the same number of valence electrons (outer shell electrons). Chemical properties depend on valence electrons. All Group 1 elements (Li, Na, K...) have 1 valence electron and react similarly with water. All noble gases (Group 18) have full outer shells and are chemically stable.",
      tier: "free",
    },
    {
      id: "am-ms-c4",
      question: "Carbon-12 and Carbon-14 are both carbon atoms. How do they differ? Why is Carbon-14 used in dating?",
      hint: "Both have 6 protons. C-12 has 6 neutrons (stable). C-14 has 8 neutrons (unstable/radioactive, half-life ~5700 years). Living organisms absorb C-14 while alive; after death, C-14 decays at a known rate. Measuring remaining C-14 tells us how long ago the organism died.",
      tier: "pro",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 14,
  relatedExperiments: ["ms-chemical-reactions", "atomic-structure"],

  seoTitle: "Atoms and Periodic Table Middle School | Scivra Interactive",
  seoKeywords: [
    "atoms periodic table middle school simulation",
    "protons neutrons electrons interactive",
    "element builder simulation 6-8",
    "periodic table interactive middle school",
    "atoms molecules chemistry simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Atoms, Elements, and the Periodic Table",
  },
  contentSections: {
    whatIsIt:
      "Everything around you — air, water, your desk, even your own body — is made of atoms. Atoms are unimaginably small particles, and yet they have an internal structure that determines almost everything about how matter behaves. At the center of every atom is a dense nucleus containing protons (which carry a positive charge) and neutrons (which have no charge). Surrounding the nucleus are electrons (negative charge) arranged in shells. The number of protons in the nucleus is called the atomic number, and it is what defines which element an atom is. Carbon always has 6 protons; change that number to 7 and you have nitrogen. Change it to 8 and you have oxygen. This simulation lets you build atoms by adjusting proton, neutron, and electron counts, watching the element identity update in real time. You can also create ions (charged atoms) and isotopes (same element, different neutron count). Understanding atoms at this level is the foundation for all of chemistry.",
    parameterExplanations: {
      protons:
        "Sets the number of protons in the nucleus (1 to 18). This is the atomic number (Z) and is the single most important property of an atom — it determines which element the atom is. At 1 proton you have hydrogen, at 6 you have carbon, at 8 oxygen, at 11 sodium, and at 18 argon. Adding or removing a proton does not create a different version of the same element — it creates an entirely different element. The element name and symbol update automatically in the simulation as you change this value.",
      neutrons:
        "Sets the number of neutrons in the nucleus (0 to 22). Neutrons add mass to the atom but do not change which element it is. Atoms of the same element with different neutron counts are called isotopes. Carbon-12 has 6 protons and 6 neutrons; carbon-14 has 6 protons and 8 neutrons. Both are carbon, but C-14 is radioactive and is used in carbon dating. Most elements have several stable isotopes. The mass number shown in the simulation equals protons plus neutrons.",
      electrons:
        "Sets the number of electrons surrounding the nucleus (0 to 18). In a neutral atom, electrons equal protons. If electrons are fewer than protons, the atom has a net positive charge and is called a cation (positive ion). If electrons exceed protons, the atom has a net negative charge and is called an anion (negative ion). Electrons fill shells in order: the first shell holds up to 2, the second up to 8. The outermost electrons — called valence electrons — determine how the atom interacts chemically with other atoms.",
      showBonding:
        "Toggles the molecular bonding visualization (0=off, 1=on; Pro feature). When enabled, valence electrons are highlighted and you can observe how atoms with incomplete outer shells interact with other atoms to share or transfer electrons, forming molecules. This directly shows why elements in the same group of the periodic table tend to form similar types of bonds and molecules.",
    },
    misconceptions: [
      {
        wrong: "Atoms are the smallest possible particles and cannot be divided.",
        correct:
          "Atoms are made of even smaller subatomic particles: protons, neutrons, and electrons. Protons and neutrons are themselves made of quarks. The idea that atoms were indivisible was a useful early model, but modern science has revealed a rich internal structure. For most chemistry purposes, the proton-neutron-electron model works well, but it is not the final level of structure.",
      },
      {
        wrong: "Electrons orbit the nucleus like planets orbit the Sun in fixed circular paths.",
        correct:
          "Electrons do not follow fixed circular orbits. They occupy regions of space called orbitals or shells, where they are most likely to be found — but their exact position at any moment is described by probability, not a precise track. The shell model used in middle school is a helpful simplification for understanding bonding and periodic trends, but electrons are better thought of as clouds of probability rather than tiny planets.",
      },
      {
        wrong: "Isotopes of the same element are completely different substances.",
        correct:
          "Isotopes of the same element have the same number of protons and electrons, so they have nearly identical chemical behavior. Carbon-12 and carbon-14 both form carbon dioxide when burned, both bond with hydrogen to make organic molecules, and both behave as carbon in all chemical reactions. The difference is their mass and — for unstable isotopes — their radioactive decay. Isotopes are versions of the same element, not different elements.",
      },
      {
        wrong: "The mass of an atom is mostly in its electrons.",
        correct:
          "Electrons are extremely light — each one has only about 1/1836 the mass of a proton. Nearly all of an atom's mass is concentrated in the nucleus (protons and neutrons). A carbon atom with 6 protons, 6 neutrons, and 6 electrons has a mass of 12 atomic mass units — and the 6 electrons together contribute less than 0.03% of that total mass. Electrons are crucial for chemical behavior but contribute almost nothing to atomic mass.",
      },
    ],
    teacherUseCases: [
      "Element identity investigation: have students set neutrons to 6 and electrons to 6, then slowly increase protons from 1 to 18. They record the element name at each step and note any patterns (periodic trends) in when elements are metals vs. nonmetals, identifying that the periodic table follows atomic number order (MS-PS1-1).",
      "Isotope exploration: set protons to 6 (carbon) and electrons to 6. Vary neutrons from 5 to 8. Students record the mass number for each isotope and note which are stable (C-12 and C-13) vs. unstable. Introduce the carbon-14 dating connection by explaining that C-14 (8 neutrons) slowly decays after an organism dies.",
      "Ion formation activity: set protons to 11 (sodium) and neutrons to 12. Change electrons from 11 to 10, observing that Na loses 1 electron to become Na+ (sodium ion). Then set protons to 17 (chlorine) and increase electrons to 18, forming Cl-. Students predict that Na+ and Cl- attract each other to form NaCl (table salt), connecting atomic structure to compound formation.",
      "Periodic table group patterns: compare atoms in the same group — set protons to 3 (lithium), note 1 valence electron; then 11 (sodium), note 1 valence electron; then 19 would be potassium (beyond the simulation range, noted for discussion). Students identify that Group 1 elements all have 1 valence electron and predict similar chemical behavior, building the conceptual foundation for why the periodic table is organized as it is.",
    ],
    faq: [
      {
        question: "What makes one element different from another?",
        answer:
          "The number of protons in the nucleus — called the atomic number — is what defines an element. Every carbon atom in the universe has exactly 6 protons; every oxygen atom has exactly 8. If you add or remove a proton, you no longer have the same element. This is why nuclear reactions (which change proton counts) transform one element into another, while ordinary chemical reactions (which only rearrange electrons) cannot. The periodic table is organized in order of increasing atomic number.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation primarily supports MS-PS1-1, which asks students to develop models to describe the atomic composition of simple molecules and extended structures. Understanding that the number of protons defines an element, that electrons determine bonding, and that the periodic table organizes elements by atomic number and properties are all core expectations of this standard. The simulation also supports the science and engineering practice of developing and using models to represent atomic structure.",
      },
      {
        question: "Why are valence electrons so important in chemistry?",
        answer:
          "Valence electrons are the outermost electrons of an atom, and they are the ones involved in chemical bonding. Atoms are most stable when their outermost shell is full — 8 electrons for most elements, 2 for hydrogen. Atoms gain, lose, or share electrons with other atoms to reach this filled-shell arrangement. An atom with 1 valence electron (like sodium) tends to lose it easily, while an atom with 7 valence electrons (like chlorine) tends to gain one. This is why sodium and chlorine react vigorously together to form table salt.",
      },
      {
        question: "What is the difference between an atom, a molecule, and a compound?",
        answer:
          "An atom is the smallest unit of an element. A molecule forms when two or more atoms bond together — this can be atoms of the same element (O2, two oxygen atoms bonded together) or different elements (H2O, two hydrogen atoms bonded to one oxygen). A compound is a substance made of two or more different elements in a fixed ratio, always bonded chemically. So water (H2O) is both a molecule and a compound, while O2 is a molecule but not a compound. The key distinction for compounds is that the elements cannot be separated by physical means — only by a chemical reaction.",
      },
      {
        question: "How do scientists know what atoms look like if they are too small to see?",
        answer:
          "Our atomic model comes from more than a century of indirect experiments. In 1911, Ernest Rutherford fired particles at gold foil and found that most passed straight through but a few bounced back — revealing that most of an atom is empty space with a tiny dense nucleus. Later experiments using X-ray diffraction, electron microscopy, and quantum theory revealed the shell structure of electrons. Today, scanning tunneling microscopes can even produce images showing the positions of individual atoms on a surface, confirming the models developed through these earlier experiments.",
      },
    ],
  },
};
