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

  seoTitle: "Atoms and Periodic Table Middle School | NeonPhysics Interactive",
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
};
