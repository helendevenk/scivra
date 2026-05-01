import type { Experiment } from "@/shared/types/experiment";

export const electrochemistry: Experiment = {
  id: "electrochemistry",
  slug: "electrochemistry",
  title: "Electrochemistry: Galvanic & Electrolytic Cells",
  subtitle: "Redox reactions, cell potential, and Faraday's laws",
  description:
    "Build a galvanic (voltaic) cell and watch spontaneous electron flow from anode to cathode. See metal dissolution and deposition, salt bridge ion migration, and measure cell potential (EMF). Switch to electrolytic mode to drive non-spontaneous reactions — electroplate metals or split water.",
  thumbnail: "/imgs/experiments/electrochemistry.png",

  standards: {
    ngss: ["HS-PS1-4"],
    gcse: ["C8.1", "C8.2"],
    ap: ["9.A.1", "9.B.1", "9.C.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: ["electrochemistry", "galvanic cell", "redox", "Nernst equation", "electrolysis", "AP Chemistry"],
  difficulty: "advanced",

  parameters: [
    {
      id: "anodeMetal",
      label: "Anode Metal (0=Zn, 1=Fe, 2=Cu)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "cathodeMetal",
      label: "Cathode Metal (0=Cu, 1=Ag, 2=Au)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "concentration",
      label: "Ion Concentration",
      unit: "mol/L",
      min: 0.01,
      max: 2.0,
      default: 1.0,
      step: 0.05,
      tier: "free",
    },
    {
      id: "cellMode",
      label: "Cell Mode (0=galvanic, 1=electrolytic)",
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
      latex: "E°_{cell} = E°_{cathode} - E°_{anode} \\quad (\\Delta G = -nFE°_{cell})",
      description: "Standard cell potential; positive E° → spontaneous (galvanic)",
    },
    {
      latex: "E = E° - \\frac{RT}{nF}\\ln Q \\quad (\\text{Nernst equation})",
      description: "Nernst equation: actual cell potential at non-standard conditions",
    },
    {
      latex: "m = \\frac{MIt}{nF} \\quad (\\text{Faraday's first law})",
      description: "Mass deposited = molar mass × current × time / (electrons × Faraday)",
    },
  ],

  theory:
    "Electrochemistry links chemical reactions to electrical energy. In galvanic (voltaic) cells, spontaneous redox reactions generate electric current. Oxidation occurs at the anode (loses electrons); reduction at the cathode (gains electrons). Electrons flow through the external circuit; ions migrate through the salt bridge to maintain electrical neutrality. Standard reduction potentials (E°) are measured vs the standard hydrogen electrode (SHE). E°cell = E°cathode - E°anode; positive E° → spontaneous. ΔG = -nFE°cell. The Nernst equation adjusts for non-standard concentrations. Electrolytic cells use external voltage to drive non-spontaneous reactions: water splitting (2H₂O → 2H₂ + O₂), electroplating (Cu²⁺ + 2e⁻ → Cu at cathode), and chloralkali process. Faraday's law: mass deposited ∝ charge passed.",

  instructions:
    "Select anode and cathode metals and see the cell potential calculated from standard reduction potentials. Watch electron flow animation — metal dissolves at anode, deposits at cathode. Move the concentration slider and watch the Nernst equation update cell potential in real time. Switch to Electrolytic mode (Pro) to see water being electrolyzed.",

  challenges: [
    {
      id: "ec-c1",
      question: "Calculate E°cell for a Zn-Cu galvanic cell. (E°(Zn²⁺/Zn) = -0.76 V, E°(Cu²⁺/Cu) = +0.34 V)",
      hint: "E°cell = E°cathode - E°anode = 0.34 - (-0.76) = +1.10 V. Positive → spontaneous. Zn dissolves (anode), Cu deposits (cathode).",
      tier: "free",
    },
    {
      id: "ec-c2",
      question: "For the Zn-Cu cell above, calculate ΔG°. (n=2, F=96485 C/mol)",
      hint: "ΔG° = -nFE° = -(2)(96485)(1.10) = -212,267 J/mol ≈ -212 kJ/mol. Negative → spontaneous (consistent with positive E°).",
      tier: "free",
    },
    {
      id: "ec-c3",
      question: "A 5.0 A current is passed through a CuSO₄ solution for 30 minutes. How many grams of Cu are deposited? (M_Cu = 63.5 g/mol, n=2)",
      hint: "m = MIt/(nF) = 63.5 × 5.0 × 1800 / (2 × 96485) = 571500/192970 = 2.96 g.",
      tier: "free",
    },
    {
      id: "ec-c4",
      question: "Using Nernst equation: for Zn-Cu cell with [Zn²⁺]=2.0 M and [Cu²⁺]=0.01 M at 298 K, calculate E. (E°=1.10V, n=2)",
      hint: "Q = [Zn²⁺]/[Cu²⁺] = 2.0/0.01 = 200. E = 1.10 - (0.0257/2)ln(200) = 1.10 - 0.01285×5.30 = 1.10 - 0.068 = 1.03 V.",
      tier: "pro",
    },
  ],

  wave: 4,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["thermochemistry", "acid-base-ph"],

  seoTitle: "Electrochemistry Galvanic Electrolytic Cell | Scivra AP Chemistry",
  seoKeywords: [
    "electrochemistry simulation",
    "galvanic cell interactive",
    "Nernst equation calculator",
    "electrolysis animation",
    "AP Chemistry electrochemistry",
    "Faraday's law simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Electrochemistry: Galvanic and Electrolytic Cells",
  },
  contentSections: {
    whatIsIt:
      "Electrochemistry connects spontaneous redox reactions to electrical energy. In a galvanic (voltaic) cell, a spontaneous oxidation-reduction reaction drives electron flow through an external circuit — the chemical energy of Zn dissolving and Cu²⁺ depositing produces a measurable voltage (E°cell = +1.10 V for the Zn-Cu pair). Cell potential is calculated from standard reduction potentials: E°cell = E°cathode − E°anode; a positive result confirms spontaneity (ΔG = −nFE°cell < 0). The Nernst equation adjusts E for non-standard concentrations. Electrolytic cells reverse the process: an external power source forces a non-spontaneous reaction such as water splitting or electroplating, consuming energy rather than generating it. This simulation lets you build both cell types, change metals and concentrations, and watch electron flow and ion migration animate in real time.",
    parameterExplanations: {
      anodeMetal:
        "Selects the anode electrode: 0 = Zn (E° = −0.76 V), 1 = Fe (E° = −0.44 V), 2 = Cu (E° = +0.34 V). The anode undergoes oxidation — metal atoms lose electrons and dissolve into solution as cations (M → M²⁺ + 2e⁻). Metals with more negative E° are stronger reducing agents and dissolve more readily.",
      cathodeMetal:
        "Selects the cathode electrode: 0 = Cu (E° = +0.34 V), 1 = Ag (E° = +0.80 V), 2 = Au (E° = +1.50 V). The cathode undergoes reduction — metal cations gain electrons and deposit as solid metal (M²⁺ + 2e⁻ → M). Metals with more positive E° are stronger oxidizing agents; pairing a very negative anode with a very positive cathode maximizes E°cell.",
      concentration:
        "The molar concentration of metal ions in both half-cells (0.01–2.0 mol/L, default 1.0 mol/L). At 1.0 mol/L the Nernst equation gives E = E° (standard conditions). Lowering concentration changes the reaction quotient Q, which shifts E according to E = E° − (RT/nF)·ln Q. Try 0.01 mol/L to see E drop noticeably below E°.",
      cellMode:
        "Toggles between galvanic mode (0, spontaneous — acts like a battery, E°cell > 0) and electrolytic mode (1, non-spontaneous — requires external voltage greater than E°cell). In electrolytic mode the anode polarity reverses: the external source forces oxidation at the positive terminal and reduction at the negative terminal.",
    },
    misconceptions: [
      {
        wrong:
          "Galvanic cells need an external power source, like a battery, to push the electrons.",
        correct:
          "Galvanic cells ARE the power source. A spontaneous redox reaction (ΔG < 0, E°cell > 0) generates its own electron flow. It is the electrolytic cell that requires an external voltage supply to drive a non-spontaneous reaction.",
      },
      {
        wrong:
          "The anode is always the positive terminal.",
        correct:
          "In a galvanic cell the anode is the negative terminal — electrons produced by oxidation leave through it to the external circuit. In an electrolytic cell the anode is the positive terminal because the external source forces electrons in the reverse direction. Cell type determines anode polarity.",
      },
      {
        wrong:
          "Voltage and current are the same thing — a higher voltage means more current.",
        correct:
          "Voltage (V) is electrical potential difference, a measure of energy per charge. Current (A) is the rate of charge flow. They are related by Ohm's law (V = IR), but they are distinct quantities. A cell can have a high E°cell yet deliver low current if the circuit resistance is high.",
      },
      {
        wrong:
          "The salt bridge lets electrons flow between the two half-cells.",
        correct:
          "Electrons travel through the external wire only. The salt bridge allows ions (typically K⁺ and NO₃⁻) to migrate between half-cells to maintain electrical neutrality as electrode reactions consume or produce ions. Without ion migration, charge would build up and the cell would stop.",
      },
      {
        wrong:
          "A higher standard reduction potential at the cathode always guarantees the cell will work.",
        correct:
          "E°cell = E°cathode − E°anode must be positive for a spontaneous galvanic cell. If you accidentally pick an anode with a higher E° than the cathode (e.g., Cu as 'anode' and Zn as 'cathode'), E°cell is negative and the reaction is non-spontaneous under standard conditions — you would need electrolytic mode.",
      },
    ],
    teacherUseCases: [
      "Standard reduction potential ranking: give students the E° values for Zn, Fe, Cu, Ag, and Au and ask them to predict which metal pair produces the highest E°cell before using the anodeMetal/cathodeMetal sliders. Builds intuition for the activity series and AP 9.A.1 redox spontaneity.",
      "Nernst equation data collection: set anodeMetal = Zn, cathodeMetal = Cu, and vary concentration from 0.01 to 2.0 mol/L while recording the live E readout. Students plot E vs. ln[Q] and extract the slope (−RT/nF) — a direct AP 9.C.1 quantitative skill.",
      "Galvanic vs. electrolytic comparison probe: ask students to write the half-reactions for water splitting (2H₂O → 2H₂ + O₂) and predict whether it is spontaneous. Then switch to electrolytic mode (cellMode = 1) and discuss what minimum external voltage is needed and why. Targets the persistent 'all cells need power' misconception.",
      "Faraday's law calculation lab: set electrolytic mode with a defined current and time; students calculate predicted mass of Cu deposited using m = MIt/(nF), then compare to the simulation's mass readout. Reinforces dimensional analysis with real values (5.0 A for 30 min → 2.96 g).",
      "ΔG-E°cell connection: students calculate ΔG° = −nFE°cell for three different metal pairs and rank them by spontaneity. Then pose: 'which cell does the most electrical work per mole of reaction?' Bridges AP 9.B.1 (ΔG and E°) with conceptual understanding of energy output.",
    ],
    faq: [
      {
        question: "How do I calculate E°cell and know if a galvanic cell is spontaneous?",
        answer:
          "Use E°cell = E°cathode − E°anode with standard reduction potentials. For Zn-Cu: E°cell = (+0.34) − (−0.76) = +1.10 V. A positive E°cell means ΔG° = −nFE°cell is negative, confirming spontaneity. The metal with the more negative E° always acts as the anode (oxidized); the more positive one is the cathode (reduced).",
      },
      {
        question: "What is the Nernst equation and when do I need it?",
        answer:
          "The Nernst equation E = E° − (RT/nF)·ln Q adjusts cell potential for non-standard concentrations. At 298 K it simplifies to E = E° − (0.0257/n)·ln Q. Use it whenever ion concentrations differ from 1.0 mol/L. For the Zn-Cu cell with [Zn²⁺] = 2.0 M and [Cu²⁺] = 0.01 M: Q = 200, E ≈ 1.10 − 0.068 = 1.03 V — addressing AP 9.C.1.",
      },
      {
        question: "Why does a salt bridge need to be present for the cell to keep working?",
        answer:
          "As Zn dissolves, the anode compartment accumulates Zn²⁺ ions (positive charge builds up). As Cu²⁺ deposits at the cathode, the cathode compartment loses positive charge. Without the salt bridge, this charge imbalance creates a voltage that opposes further electron flow and stops the cell. The salt bridge restores neutrality by allowing anions to migrate toward the anode and cations toward the cathode.",
      },
      {
        question: "How is electroplating different from a galvanic cell?",
        answer:
          "Electroplating is an electrolytic process: an external power supply forces metal cations (e.g., Cu²⁺) to deposit onto a cathode surface. The external voltage must exceed E°cell of the reverse (non-spontaneous) reaction. The anode is typically the plating metal itself (dissolves to replenish the solution). No useful electrical energy is generated — energy is consumed instead.",
      },
      {
        question: "How do AP Chemistry standards 9.A.1, 9.B.1, and 9.C.1 map to this simulation?",
        answer:
          "AP 9.A.1 requires identifying oxidation and reduction half-reactions and balancing redox equations — practiced by observing anode dissolution and cathode deposition. AP 9.B.1 requires calculating E°cell and relating it to ΔG° = −nFE°cell — practiced with the metal selector. AP 9.C.1 requires applying the Nernst equation — practiced by varying the concentration slider and recording E vs. Q.",
      },
      {
        question: "How many grams of copper deposit when 5.0 A flows for 30 minutes?",
        answer:
          "Use Faraday's first law: m = MIt/(nF). Here M_Cu = 63.5 g/mol, I = 5.0 A, t = 1800 s, n = 2 electrons per Cu²⁺, F = 96 485 C/mol. m = (63.5 × 5.0 × 1800)/(2 × 96 485) ≈ 2.96 g. This is a common AP free-response calculation type.",
      },
    ],
  },
};
