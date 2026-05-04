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
      id: "atomicNumber",
      label: "Atomic Number",
      unit: "Z",
      min: 1,
      max: 18,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "neutronNumber",
      label: "Neutron Number",
      unit: "neutrons",
      min: 0,
      max: 22,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "orbitSpeed",
      label: "Orbit Speed",
      unit: "x",
      min: 1,
      max: 10,
      default: 5,
      step: 1,
      tier: "free",
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
    "Use the Atomic Number slider to change the element, the Neutron Number slider to compare isotopes and mass number, and the Orbit Speed slider to slow down or speed up the electron-shell motion. Try all six presets — Hydrogen (Z=1), Carbon (Z=6), Sodium (Z=11), 1: Hydrogen, 2: Carbon, and 3: Sodium — to compare simple atoms, valence electrons, and shell patterns.",

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
  htmlControlAliases: { atomicNumber: "sl-z", neutronNumber: "sl-n", orbitSpeed: "sl-spd" },
  presets: [
    {
      id: "1",
      label: "Hydrogen (Z=1)",
      description:
        "Loads hydrogen with one proton, zero neutrons, and one electron in the first shell. This is the simplest checkpoint for connecting atomic number to element identity.",
      paramValues: { atomicNumber: 1, neutronNumber: 0, orbitSpeed: 5 },
    },
    {
      id: "2",
      label: "Carbon (Z=6)",
      description:
        "Loads carbon with six protons and six neutrons, showing a two-shell pattern with four valence electrons. Use it to discuss why carbon is central to many molecules.",
      paramValues: { atomicNumber: 6, neutronNumber: 6, orbitSpeed: 5 },
    },
    {
      id: "3",
      label: "Sodium (Z=11)",
      description:
        "Loads sodium with eleven protons and twelve neutrons, showing a 2-8-1 shell pattern. This preset highlights why one outer electron matters for chemical behavior.",
      paramValues: { atomicNumber: 11, neutronNumber: 12, orbitSpeed: 5 },
    },
    {
      id: "loadPreset:1",
      label: "1: Hydrogen",
      description:
        "Duplicates the hydrogen quick-preset in the lower control bar, useful when students are viewing the main canvas and need a fast reset to the simplest atom.",
      paramValues: { atomicNumber: 1, neutronNumber: 0, orbitSpeed: 5 },
    },
    {
      id: "loadPreset:2",
      label: "2: Carbon",
      description:
        "Duplicates the carbon quick-preset in the lower control bar, giving a fast reference case for a stable common isotope and four valence electrons.",
      paramValues: { atomicNumber: 6, neutronNumber: 6, orbitSpeed: 5 },
    },
    {
      id: "loadPreset:3",
      label: "3: Sodium",
      description:
        "Duplicates the sodium quick-preset in the lower control bar, letting students jump directly to an atom with a filled second shell and one outer electron.",
      paramValues: { atomicNumber: 11, neutronNumber: 12, orbitSpeed: 5 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Everything around you — air, water, your desk, even your own body — is made of atoms. Atoms are unimaginably small particles, and yet they have an internal structure that determines almost everything about how matter behaves. At the center of every atom is a dense nucleus containing protons (which carry a positive charge) and neutrons (which have no charge). Surrounding the nucleus are electrons (negative charge) arranged in shells. The number of protons in the nucleus is called the atomic number, and it is what defines which element an atom is. Carbon always has 6 protons; change that number to 7 and you have nitrogen. Change it to 8 and you have oxygen. This simulation lets you build neutral atoms by adjusting atomic number and neutron count, watching the element identity, mass number, shell count, and valence electrons update in real time. Understanding atoms at this level is the foundation for all of chemistry.",
    parameterExplanations: {
      atomicNumber:
        "Atomic Number sets how many protons are in the nucleus, from 1 to 18 in this model. That value, written as Z, defines the element: Z=1 is hydrogen, Z=6 is carbon, Z=8 is oxygen, and Z=11 is sodium. When you move this slider, the element symbol, nucleus charge, shell filling, and valence-electron count rebuild together because a neutral atom has the same number of electrons as protons. Use the Hydrogen, Carbon, and Sodium presets first, then move one step at a time to see why the periodic table is ordered by atomic number.",
      neutronNumber:
        "Neutron Number changes how many neutral particles are packed into the nucleus, from 0 to 22. Neutrons add mass but do not change the element name, because element identity depends on protons. The mass number shown in the simulation is A = Z + N, so carbon with 6 protons and 6 neutrons is carbon-12, while carbon with 8 neutrons is carbon-14. Keep Atomic Number fixed while moving this slider to isolate isotope behavior: the symbol stays the same, but the nucleus composition and mass number change.",
      orbitSpeed:
        "Orbit Speed controls how quickly the electron-shell animation moves, from a slow inspection pace to a faster orbit display. It is a viewing control, not a new atomic property: changing it does not alter atomic number, neutron number, mass number, shell capacity, or valence electrons. Lower speeds help students count electrons in each shell and connect the data overlay to the 3D model. Higher speeds make the shell structure feel more dynamic after students already understand what they are seeing. Use this slider after selecting each preset to compare the same atom at different animation speeds.",
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
      "Element identity investigation: students start with Hydrogen (Z=1), then move the Atomic Number slider from 1 to 18. They record element symbols, shell counts, and valence electrons, then explain why atomic number order supports MS-PS1-1 modeling.",
      "Isotope exploration: students choose the Carbon preset, keep Atomic Number at 6, and vary Neutron Number from 5 to 8. They calculate A = Z + N from the display and explain why the element stays carbon while mass number changes.",
      "Preset comparison station: groups compare Hydrogen, Carbon, and Sodium from both preset button rows, record atomic number, neutron number, shell pattern, and valence electrons, then identify what changes and what stays fixed across matching duplicate presets.",
      "Valence pattern discussion: students set Atomic Number to 3 and 11, observe that both lithium and sodium show one valence electron, and use that evidence to explain why same-group elements often behave similarly.",
      "Animation pacing check: students use Orbit Speed at low and high settings for the same atom, then explain which measured quantities stay unchanged. This separates visualization speed from atomic structure.",
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
          "This simulation primarily supports MS-PS1-1, which asks students to develop models to describe the atomic composition of simple molecules and extended structures. It gives students a concrete atomic model for protons, neutrons, electrons, shells, atomic number, and mass number. Students can use the Atomic Number and Neutron Number sliders to connect particle counts with element identity and isotopes, then use the displayed shell pattern to discuss why atoms combine into molecules and extended structures in later lessons.",
      },
      {
        question: "Why are valence electrons so important in chemistry?",
        answer:
          "Valence electrons are the outermost electrons of an atom, and they are the ones involved in chemical bonding. Atoms are most stable when their outermost shell is full — 8 electrons for most elements, 2 for hydrogen. Atoms gain, lose, or share electrons with other atoms to reach this filled-shell arrangement. An atom with 1 valence electron (like sodium) tends to lose it easily, while an atom with 7 valence electrons (like chlorine) tends to gain one. This is why sodium and chlorine react vigorously together to form table salt.",
      },
      {
        question: "What is the difference between an atom, a molecule, and a compound?",
        answer:
          "An atom is the smallest unit of an element, such as one hydrogen atom or one carbon atom. A molecule forms when two or more atoms are bonded together; the atoms can be the same element, such as O2, or different elements, such as H2O. A compound is made of two or more different elements in a fixed ratio, so water is both a molecule and a compound. This simulation focuses on the atom-level building blocks — atomic number, neutrons, and electron shells — that students need before modeling full molecules.",
      },
      {
        question: "How do scientists know what atoms look like if they are too small to see?",
        answer:
          "Our atomic model comes from more than a century of indirect experiments. In 1911, Ernest Rutherford fired particles at gold foil and found that most passed straight through but a few bounced back — revealing that most of an atom is empty space with a tiny dense nucleus. Later experiments using X-ray diffraction, electron microscopy, and quantum theory revealed the shell structure of electrons. Today, scanning tunneling microscopes can even produce images showing the positions of individual atoms on a surface, confirming the models developed through these earlier experiments.",
      },
    ],
  },
};
