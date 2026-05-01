import type { Experiment } from "@/shared/types/experiment";

export const electronConfiguration: Experiment = {
  id: "electron-configuration",
  slug: "electron-configuration",
  title: "Electron Configuration",
  subtitle: "Aufbau principle, orbital filling, and energy levels",
  description:
    "Visualize how electrons fill atomic orbitals according to the Aufbau principle, Pauli exclusion, and Hund's rule. Select any element (Z = 1–36) and watch electrons populate the Bohr model and orbital diagram simultaneously. Explore electron configurations, noble gas shorthand, and exceptions like chromium and copper.",
  thumbnail: "/imgs/experiments/electron-configuration.png",

  standards: {
    ngss: ["HS-PS1-1"],
    gcse: ["C1.3", "C1.4"],
    ap: ["1.B.1", "1.C.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: [
    "electron configuration",
    "atomic orbitals",
    "Aufbau principle",
    "Hund rule",
    "quantum numbers",
    "AP Chemistry",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "atomicNumber",
      label: "Atomic Number (Z)",
      unit: "",
      min: 1,
      max: 36,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "showOrbitalDiagram",
      label: "Show Orbital Diagram (0=Off, 1=On)",
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
      latex: "1s \\rightarrow 2s \\rightarrow 2p \\rightarrow 3s \\rightarrow 3p \\rightarrow 4s \\rightarrow 3d \\rightarrow 4p",
      description: "Aufbau filling order: electrons fill lowest-energy orbitals first",
    },
    {
      latex: "n + l \\text{ rule: lower } (n+l) \\text{ fills first; if equal, lower } n \\text{ fills first}",
      description: "Madelung rule determines orbital energy ordering",
    },
  ],

  theory:
    "Electrons in atoms occupy orbitals — regions of space described by quantum numbers (n, l, ml, ms). The Aufbau principle states that electrons fill from lowest to highest energy. Each orbital holds at most 2 electrons with opposite spins (Pauli exclusion principle). When filling degenerate orbitals (same energy), electrons spread out with parallel spins first (Hund's rule). The filling order follows the (n+l) rule: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p... Notable exceptions: Cr is [Ar] 3d⁵4s¹ (half-filled d stability) and Cu is [Ar] 3d¹⁰4s¹ (fully-filled d stability). Electron configuration determines chemical properties and periodic trends.",

  instructions:
    "Use the slider or element buttons to select an element. Watch the Bohr model animate electrons into shells, while the orbital diagram fills boxes according to the Aufbau order. The notation panel shows both full and noble gas shorthand configurations. Pay attention to the 3d/4s crossover and the Cr/Cu exceptions.",

  challenges: [
    {
      id: "ec-c1",
      question: "Write the electron configuration for oxygen (Z = 8).",
      hint: "1s² 2s² 2p⁴. Oxygen has 8 electrons: 2 in 1s, 2 in 2s, 4 in 2p.",
      tier: "free",
    },
    {
      id: "ec-c2",
      question: "Why does chromium (Z = 24) have configuration [Ar] 3d⁵4s¹ instead of [Ar] 3d⁴4s²?",
      hint: "A half-filled d subshell (3d⁵) has extra stability due to exchange energy. Promoting one 4s electron to 3d gives lower total energy.",
      tier: "free",
    },
    {
      id: "ec-c3",
      question: "What is the electron configuration of Fe²⁺ (iron ion)?",
      hint: "Fe is [Ar] 3d⁶4s². When ionized, 4s electrons are removed first: Fe²⁺ = [Ar] 3d⁶.",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["atomic-structure", "molecular-bonding"],
  htmlPath: "/experiments/ap-chemistry/electron-configuration.html",

  seoTitle: "Electron Configuration Interactive Visualizer | Scivra AP Chemistry",
  seoKeywords: [
    "electron configuration",
    "orbital filling diagram",
    "Aufbau principle simulation",
    "Bohr model interactive",
    "AP Chemistry atomic structure",
    "electron orbital visualizer",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Electron Configuration and Orbital Theory",
  },
  contentSections: {
    whatIsIt:
      "Electron configuration is the complete address of every electron in an atom — which sublevel it occupies and how many electrons share that sublevel. The configuration of carbon, 1s²2s²2p², instantly tells a chemist that carbon has four valence electrons available for bonding, explaining why it forms four bonds in methane and two double bonds in CO₂. Three rules govern the address assignment: the Aufbau principle fills lowest-energy orbitals first, the Pauli exclusion principle limits each orbital to two electrons with opposite spins, and Hund's rule spreads electrons across degenerate orbitals singly before pairing. This simulation animates the filling sequence for any element Z=1 to 36, shows the noble-gas shorthand notation side by side with the full configuration, and flags the Cr and Cu exceptions where half-filled and fully filled d subshells break the expected pattern. Covered by AP Chem 1.B.1 and 1.C.1.",
    parameterExplanations: {
      atomicNumber:
        "The number of protons (and electrons for a neutral atom), ranging from 1 (hydrogen) to 36 (krypton). Each increment advances the filling sequence by one electron — the orbital diagram animates the new electron dropping into its correct subshell according to the (n+l) Madelung rule, and both the full configuration string and the noble-gas shorthand update in real time.",
      showOrbitalDiagram:
        "Toggles the box-and-arrow orbital diagram that shows each subshell as a row of boxes with spin-up and spin-down arrows. Setting this to 1 (on) makes Hund's rule visible: the three 2p boxes for nitrogen (Z=7) each get one arrow before any pairing occurs. Setting it to 0 shows only the compact notation, useful for timed configuration-writing practice.",
    },
    misconceptions: [
      {
        wrong:
          "Electrons always fill the 3d subshell before the 4s because 3 is less than 4.",
        correct:
          "Energy, not principal quantum number alone, sets filling order. The (n+l) rule places 4s (n+l = 4) below 3d (n+l = 5) for neutral atoms, so 4s fills first. The simulation's Aufbau sequence makes this ordering explicit at Z=19 (potassium).",
      },
      {
        wrong:
          "Chromium's configuration is [Ar]3d⁴4s² because you just keep filling in order.",
        correct:
          "Chromium is [Ar]3d⁵4s¹. A half-filled d subshell has extra stabilization from exchange energy — the five 3d electrons singly occupy the five d orbitals with parallel spins, while the sixth valence electron sits alone in 4s. The energy gained by reaching 3d⁵ outweighs the cost of moving one electron from the otherwise filled 4s to the 3d set.",
      },
      {
        wrong:
          "The noble-gas shorthand is just a shortcut notation and doesn't carry any chemical meaning.",
        correct:
          "The noble-gas core represents electrons that are chemically inert and tightly held. Everything written after the bracket — the valence configuration — determines bonding, reactivity, oxidation states, and periodic trends. [Ne]3s²3p⁴ for sulfur tells you immediately it has six valence electrons and can form two bonds or carry a −2 charge.",
      },
      {
        wrong:
          "When a transition metal loses electrons to form a cation, the d electrons are removed first because they are outermost.",
        correct:
          "The 4s electrons are removed first when forming cations, even though 4s filled before 3d. In the ionic state, 3d is lower in energy than 4s, so the 4s electrons are the highest-energy electrons and leave first. Fe²⁺ is [Ar]3d⁶, not [Ar]3d⁴4s².",
      },
      {
        wrong:
          "Hund's rule applies only to the p subshell.",
        correct:
          "Hund's rule applies to any set of degenerate orbitals — p, d, or f. The five d orbitals of manganese (Z=25) each receive one electron with parallel spins before any pairing occurs, producing a [Ar]3d⁵4s² configuration with five unpaired electrons and strong paramagnetism.",
      },
    ],
    teacherUseCases: [
      "Prediction-then-reveal: students write configurations for Z=21 through Z=30 on paper, then step through the simulation one element at a time, pausing at Cr (Z=24) and Cu (Z=29) to identify where their predictions differ and why — directly addresses AP Chem 1.B.1 exceptions.",
      "Orbital diagram Hund's rule check: set Z=7 (nitrogen) with showOrbitalDiagram=1 and ask students to count unpaired electrons. Then move to Z=8 (oxygen) and ask why one 2p box shows two arrows — this probes whether students understand pairing vs. spin alignment.",
      "Ion configuration data collection: students record the neutral configuration for Fe, Co, Ni, Cu (Z=26-29), then predict the ion configurations for each 2+ ion by removing 4s electrons first — challenges the common misconception that d electrons are removed first.",
      "Misconception probe on filling order: before opening the simulation, ask 'does 4s or 3d fill first?' Collect both answers, then run the simulation through K (Z=19) to Sc (Z=21) to show the 4s-before-3d sequence and discuss the (n+l) rule quantitatively to address whichever direction students were uncertain.",
      "Valence electron connect: after determining the configuration, ask students to identify the valence electrons and predict the likely ion charge. Compare Cl ([Ne]3s²3p⁵, gains 1e⁻ → Cl⁻) to Ca ([Ar]4s², loses 2e⁻ → Ca²⁺) to reinforce how configuration predicts reactivity.",
    ],
    faq: [
      {
        question: "How do I write a noble-gas shorthand electron configuration?",
        answer:
          "Find the noble gas in the period above your element, write it in brackets, then continue filling from the next s subshell. For chlorine (Z=17), the noble gas above it is neon (Z=10), so the shorthand is [Ne]3s²3p⁵. The simulation displays both the full and shorthand notations side by side.",
      },
      {
        question: "Why does copper (Z=29) have configuration [Ar]3d¹⁰4s¹ instead of [Ar]3d⁹4s²?",
        answer:
          "A completely filled d subshell (3d¹⁰) is extra stable due to symmetrical electron distribution and exchange energy. The energy gained by completing the d subshell outweighs the cost of having only one 4s electron. Copper and chromium are the two most commonly tested d-block exceptions in AP Chem 1.B.1.",
      },
      {
        question: "How does electron configuration connect to AP Chem 1.B.1 and NGSS HS-PS1-1?",
        answer:
          "AP Chem 1.B.1 requires students to write electron configurations using the Aufbau principle and identify exceptions for d-block elements — exactly what this simulation animates. NGSS HS-PS1-1 asks students to use the periodic table as a model to predict the relative properties of elements based on electron configurations and periodic trends, which the simulation supports by showing how configuration shifts element by element.",
      },
      {
        question: "What is the Madelung (n+l) rule and how does it determine filling order?",
        answer:
          "The Madelung rule states that orbitals fill in order of increasing (n+l) value. When two orbitals have the same (n+l), the one with the lower n fills first. For example, 4s has n+l = 4+0 = 4, while 3d has n+l = 3+2 = 5, so 4s fills before 3d. The sequence 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p follows directly from this rule.",
      },
      {
        question: "How many unpaired electrons does iron (Fe, Z=26) have?",
        answer:
          "Iron's configuration is [Ar]3d⁶4s². The 3d⁶ distributes as five boxes: four boxes have one electron each and one box is paired, giving 4 unpaired electrons. This makes iron strongly paramagnetic. You can verify this by setting Z=26 in the simulation with showOrbitalDiagram=1 and counting the single arrows in the 3d row.",
      },
    ],
  },
};
