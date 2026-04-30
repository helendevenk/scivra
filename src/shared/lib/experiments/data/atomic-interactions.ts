import type { Experiment } from "@/shared/types/experiment";

export const atomicInteractions: Experiment = {
  id: "atomic-interactions",
  slug: "atomic-interactions-lennard-jones",
  title: "Atomic Interactions",
  subtitle: "Explore the forces between atoms at the molecular scale",
  description:
    "Visualize how atoms attract and repel each other using the Lennard-Jones potential. Observe bonding, molecule formation, and the relationship between potential energy and interatomic distance.",
  thumbnail: "/imgs/experiments/nuclear-decay.png",

  standards: {
    ngss: ["HS-PS1-1", "HS-PS2-6"],
    gcse: ["AQA C1.1"],
    ap: ["SAP-1.A", "SAP-1.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["atomic forces", "Lennard-Jones", "bonding", "potential energy", "intermolecular forces"],
  difficulty: "intermediate",

  parameters: [
    { id: "atom_type", label: "Atom Type", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
    { id: "temperature", label: "Temperature", unit: "K", min: 1, max: 1000, default: 300, step: 10, tier: "free" },
    { id: "num_atoms", label: "Number of Atoms", unit: "", min: 2, max: 20, default: 5, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "U(r) = 4\\epsilon\\left[\\left(\\frac{\\sigma}{r}\\right)^{12} - \\left(\\frac{\\sigma}{r}\\right)^6\\right]", description: "Lennard-Jones potential" },
    { latex: "F = -\\frac{dU}{dr}", description: "Force from potential" },
  ],

  theory:
    "The Lennard-Jones potential models the interaction between a pair of neutral atoms. The r⁻¹² term represents Pauli repulsion at short range, while the r⁻⁶ term represents van der Waals attraction at longer range. The equilibrium distance is where the force is zero, corresponding to the minimum potential energy. This model explains bonding, phase transitions, and molecular structure.",
  instructions:
    "Place atoms on the canvas and observe how they interact. The potential energy graph updates in real time. Cool atoms to form stable bonds; heat them to break bonds and observe phase-like transitions.",
  challenges: [
    { id: "ai-c1", question: "At what separation distance is the force zero between two atoms?", hint: "Find the minimum of the potential energy curve", tier: "free" },
    { id: "ai-c2", question: "How does temperature affect bond formation?", hint: "Higher temperature means more kinetic energy to overcome attraction", tier: "free" },
    { id: "ai-c3", question: "Why do atoms never overlap completely?", hint: "The repulsive r⁻¹² term grows much faster than the attractive r⁻⁶ term", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["diffusion", "states-of-matter-basics", "molecules-and-light"],

  seoTitle: "Atomic Interactions Simulation | Lennard-Jones Potential | AP Physics",
  seoKeywords: ["atomic interactions", "Lennard-Jones potential", "intermolecular forces", "bonding", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Atomic Interactions, Lennard-Jones Potential" },

  contentSections: {
    whatIsIt:
      "Pour a glass of water and you're staring at trillions of molecules pulled together just hard enough to stick but pushed apart hard enough not to collapse. Those competing forces between neutral atoms and molecules are what give matter its solid, liquid, and gas phases — and they're remarkably well captured by a single equation Sir John Lennard-Jones wrote down in 1924. Two atoms attract weakly when far apart (van der Waals forces, the same ones geckos use to walk on ceilings), reach a happy equilibrium at a specific separation σ, and then repel violently if pushed any closer (Pauli exclusion forbidding their electron clouds from overlapping). Plot the potential energy versus distance and you get a characteristic well shape: shallow attraction reaching down to a minimum at the bond length, then a near-vertical wall on the short side. This simulation drops atoms onto a canvas with that potential active, lets you set temperature (which sets average kinetic energy), and shows molecules forming, vibrating, and breaking apart depending on whether their kinetic energy can climb out of the well.",
    parameterExplanations: {
      atom_type:
        "Selects which atomic species you're simulating, which sets the depth ε and equilibrium distance σ of the Lennard-Jones potential. Argon, neon, krypton, and similar noble gases are the canonical examples because their interaction is purely van der Waals (no chemical bonding). Heavier atoms like krypton bind more strongly (deeper well) at slightly larger σ. Switching atom type changes the temperature at which gas condenses to liquid and liquid freezes to solid.",
      temperature:
        "The temperature in kelvin, which sets the average kinetic energy per atom via (3/2)k_B T. At low T (well below ε/k_B) atoms can't escape the potential well — they cluster into a frozen lattice. At intermediate T they wander around but stay close (liquid-like). At high T (well above ε/k_B) kinetic energy dominates over the binding well and atoms zip apart freely (gas). The transition between these regimes is where condensation, melting, and boiling happen.",
      num_atoms:
        "How many atoms are placed on the canvas. Two atoms show the basic pair interaction. Five to ten atoms reveal small-cluster effects. Twenty atoms approach a small bulk system where you can watch density waves, surface tension, and even tiny phase transitions. The Lennard-Jones potential is pairwise, so total potential energy is the sum over all pairs — adding atoms grows the calculation roughly as N².",
    },
    misconceptions: [
      {
        wrong:
          "The Lennard-Jones potential is just a force; the curve shape doesn't matter much.",
        correct:
          "The shape is everything. The curve has two distinct regions with completely different physics: a steep r⁻¹² repulsion wall on the left (Pauli exclusion preventing electron-cloud overlap) and a gentle r⁻⁶ attraction tail on the right (van der Waals dipole–dipole interaction). The minimum of the potential sits at r = σ × 2^(1/6), which is the equilibrium bond length. Force is zero at the minimum, attractive to the right of it, and ferociously repulsive to the left. Treating it as 'just a force' misses why atoms have a definite size.",
      },
      {
        wrong:
          "Equilibrium distance means the atoms aren't moving.",
        correct:
          "Equilibrium distance is just where the *net force* on each atom is zero. At any nonzero temperature the atoms still vibrate around that distance with thermal kinetic energy. The colder you go, the smaller the vibration. Even at absolute zero quantum mechanics gives a residual zero-point motion. So 'equilibrium' here means 'average position' or 'energy minimum' — never 'frozen in place.'",
      },
      {
        wrong:
          "Atoms repel when squeezed together because their nuclei push on each other.",
        correct:
          "The repulsion is overwhelmingly between the *electron clouds*, not the nuclei. Two neutral atoms have no net charge and their nuclei are buried deep inside electron shells. When the clouds start to overlap, Pauli exclusion forces electrons into higher-energy states, and that's what costs energy and pushes the atoms apart. Nuclear-nuclear electrostatic repulsion only becomes the dominant effect at extreme energies (think nuclear fusion temperatures), not at room-temperature interatomic distances.",
      },
      {
        wrong:
          "Lennard-Jones describes chemical bonds like the ones in water or salt.",
        correct:
          "It describes weak, non-bonding interactions — van der Waals forces between neutral atoms or molecules. Real chemical bonds (covalent, ionic, metallic) involve actual electron sharing or transfer and are far stronger and more directional than what Lennard-Jones models. The depth of a typical Lennard-Jones well is around 0.01 eV; a covalent bond is more like 4 eV. Lennard-Jones is the right tool for noble gases, surface adhesion, and intermolecular forces between separate molecules — not for bonds inside one molecule.",
      },
    ],
    teacherUseCases: [
      "Phase-transition demo: start a cluster of 10 argon atoms at 5 K (frozen lattice), warm to 100 K (liquid-like wandering), then to 500 K (gas). Students record the temperature at which the cluster falls apart and connect it to ε via k_B T ≈ ε.",
      "Force-from-potential calculus check: have students differentiate U(r) = 4ε[(σ/r)¹² − (σ/r)⁶] to get F(r) and verify with the simulation that the equilibrium separation matches r = σ × 2^(1/6). Great calculus-meets-physics moment.",
      "Surface tension story: with 20 atoms, observe that surface atoms have fewer neighbors than interior atoms. Use this to introduce surface tension as the energy cost of unsatisfied bonds at a boundary — exactly why water beads up on wax.",
      "Compare to ideal gas: at very high T, atoms barely interact and behave like an ideal gas (PV=nRT). At low T, attractive interactions matter and you need a real gas equation. Students can see when the ideal-gas approximation breaks.",
      "Real-world geckos and adhesion: tie the r⁻⁶ van der Waals tail to gecko-foot adhesion, dust sticking to surfaces, and biological membranes. Same physics, different scales.",
    ],
    faq: [
      {
        question: "Why are there r⁻¹² and r⁻⁶ terms specifically?",
        answer:
          "The r⁻⁶ term comes from theory: it's the leading-order van der Waals attraction between two neutral particles whose induced dipoles correlate, which can be derived rigorously from quantum mechanics. The r⁻¹² term is empirical convenience — it's repulsive, very steep, and equal to (r⁻⁶)² so the math is fast on a computer. A more accurate repulsion is exponential (Pauli exclusion gives ~e^(−r)), but r⁻¹² is close enough and much easier to evaluate inside molecular dynamics simulations.",
      },
      {
        question: "What sets the equilibrium bond length and well depth?",
        answer:
          "Both ε (well depth, in energy units) and σ (the distance where U=0) are properties of the specific atom pair. Bigger atoms have larger σ; more polarizable atoms have larger ε. Argon has σ≈3.4 Å and ε/k_B ≈ 120 K — that's why argon liquefies at 87 K (k_B T ≈ ε is the rule of thumb). These constants come from experiment or from full quantum calculations and are tabulated for almost every atom pair.",
      },
      {
        question: "Why do atoms have a 'size' if they're mostly empty space?",
        answer:
          "The size comes from the steep repulsive part of the Lennard-Jones potential. Atoms can be treated as soft spheres with radius near σ because at distances shorter than that the repulsion is so steep it might as well be a wall. So when chemists draw atoms with definite radii (van der Waals radii), they're really drawing the distance at which the repulsive part of this potential turns on. The 'mostly empty space' statement is about the nucleus inside; the *interaction radius* is set by where the electron clouds start to overlap.",
      },
      {
        question: "Why does temperature matter for bond formation?",
        answer:
          "Forming a bond means dropping into the potential well, which releases ε of energy as kinetic energy. If the surrounding kinetic energy is much less than ε, the atoms get trapped. If kinetic energy is comparable to or larger than ε, atoms can hop out of the well and bonds break statistically. That competition is why phases exist: solid (KE ≪ ε), liquid (KE ~ ε), gas (KE ≫ ε). Cooling lets you build bonds; heating breaks them.",
      },
      {
        question: "How does this connect to AP Physics 2 SAP-1.A and SAP-1.B?",
        answer:
          "SAP-1.A covers the model of matter as particles whose interactions create observable bulk properties — the Lennard-Jones potential is the textbook example of such an interaction. SAP-1.B addresses how forces between particles shape phase behavior, fluid pressure, and elasticity. Watching atoms form clusters at low T and disperse at high T is a direct visualization of that connection between microscopic forces and macroscopic phases.",
      },
    ],
  },
};
