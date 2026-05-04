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
      id: "anodeConcentration",
      label: "Anode Ion Concentration",
      unit: "mol/L",
      min: 0.01,
      max: 3,
      default: 1,
      step: 0.05,
      tier: "free",
    },
    {
      id: "cathodeConcentration",
      label: "Cathode Ion Concentration",
      unit: "mol/L",
      min: 0.01,
      max: 3,
      default: 1,
      step: 0.05,
      tier: "free",
    },
    {
      id: "temperature",
      label: "Temperature",
      unit: "K",
      min: 200,
      max: 500,
      default: 298,
      step: 5,
      tier: "free",
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
    "Use the anode ion concentration, cathode ion concentration, and temperature sliders to change Q and watch the Nernst voltage update in real time. Try the Zn-Cu Cell, Hydrogen Fuel Cell, and Electrolysis of Water presets to compare a metal galvanic cell, a fuel cell, and a driven non-spontaneous setup, then animate electron and ion motion.",

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
  htmlControlAliases: { anodeConcentration: "sl-cAn", cathodeConcentration: "sl-cCa", temperature: "sl-T" },
  presets: [
    { id: "0", label: "⚡ Zn-Cu Cell (1.10V)", description: "A zinc-copper galvanic cell starts at standard 1.0 M conditions with E°cell = 1.10 V. Use it to connect anode oxidation, cathode reduction, and Nernst concentration shifts." },
    { id: "1", label: "🔋 Hydrogen Fuel Cell", description: "The hydrogen fuel cell preset compares hydrogen oxidation with oxygen reduction and highlights a positive cell potential near 1.23 V. It is useful for discussing clean energy and gas half-reactions." },
    { id: "2", label: "💧 Electrolysis of Water", description: "The water electrolysis preset reverses the energy story: the displayed setup is non-spontaneous and requires external electrical work. Use it to contrast galvanic cells with electrolytic cells." }
  ],
  contentSections: {
    whatIsIt:
      "Electrochemistry connects spontaneous redox reactions to electrical energy. In a galvanic (voltaic) cell, a spontaneous oxidation-reduction reaction drives electron flow through an external circuit — the chemical energy of Zn dissolving and Cu²⁺ depositing produces a measurable voltage (E°cell = +1.10 V for the Zn-Cu pair). Cell potential is calculated from standard reduction potentials: E°cell = E°cathode − E°anode; a positive result confirms spontaneity (ΔG = −nFE°cell < 0). The Nernst equation adjusts E for non-standard concentrations. Electrolytic cells reverse the process: an external power source forces a non-spontaneous reaction such as water splitting or electroplating, consuming energy rather than generating it. This simulation lets you compare preset cell types, change ion concentrations and temperature, and watch electron flow and ion migration animate in real time.",
    parameterExplanations: {
      anodeConcentration:
        "Anode Ion Concentration sets the dissolved ion concentration on the oxidation side of the selected preset, from 0.01 to 3.00 mol/L. In the Nernst calculation used here, Q = [anode ions] / [cathode ions], so raising this slider increases Q and tends to lower the live cell potential E when the other values stay fixed. This is the product side for a typical metal galvanic cell such as Zn-Cu, where zinc atoms oxidize into Zn²⁺. Compare values above and below 1.0 M to see why standard potentials are only the starting point, not the whole prediction.",
      cathodeConcentration:
        "Cathode Ion Concentration sets the dissolved ion concentration on the reduction side of the selected preset, from 0.01 to 3.00 mol/L. Because it is in the denominator of Q for this simulation, raising this slider lowers Q and tends to increase the live Nernst potential E. In the Zn-Cu preset, this represents the Cu²⁺ available to gain electrons and plate out as copper metal. Keep the anode concentration fixed while moving this slider to isolate the cathode-side effect, then reverse the comparison to see how concentration gradients can shift voltage without changing E°cell.",
      temperature:
        "Temperature changes the Kelvin value used in the Nernst term RT/nF. The default 298 K corresponds to about 25 °C, the usual standard-condition temperature for tabulated reduction potentials. Moving toward 200 K or 500 K does not change E°cell in this model, but it changes how strongly ln Q affects the actual cell potential E. When the two ion concentrations are equal, Q = 1 and ln Q = 0, so temperature has little visible effect. To make the temperature slider matter, first create unequal anode and cathode concentrations, then compare low and high temperatures.",
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
          "A positive standard potential in one preset means every concentration and temperature setting will stay spontaneous.",
        correct:
          "E°cell describes standard conditions. The actual cell potential is E = E° − (RT/nF)ln Q, so strongly unequal ion concentrations or different temperatures can shift E away from E°. A galvanic setup is spontaneous only when the actual E remains positive.",
      },
    ],
    teacherUseCases: [
      "Zn-Cu Nernst data collection: load the Zn-Cu Cell preset, hold cathode ion concentration at 1.00 M, vary anode ion concentration from low to high, and record E. Students plot E vs. ln Q and connect the slope to −RT/nF for AP 9.C.1.",
      "Concentration-ratio probe: have students create two settings with the same Q ratio using different absolute concentrations, such as 0.10/1.00 and 0.30/3.00. They should predict and verify that the Nernst voltage depends on Q, not simply on one slider alone.",
      "Temperature sensitivity mini-lab: set unequal anode and cathode ion concentrations, then sweep Temperature from 200 K to 500 K. Students explain why the temperature effect is most visible when Q is not 1.",
      "Galvanic vs. electrolytic comparison: ask students to write half-reactions for the Zn-Cu Cell and Electrolysis of Water presets, then compare sign of E, ΔG, and the need for external work. Targets the persistent 'all cells need power' misconception.",
      "Fuel cell context discussion: load the Hydrogen Fuel Cell preset and connect the oxygen reduction half-reaction to batteries, clean energy claims, and AP 9.A.1 redox identification. Students identify which species is oxidized, which is reduced, and how n affects ΔG = −nFE.",
    ],
    faq: [
      {
        question: "How do I calculate E°cell and know if a galvanic cell is spontaneous?",
        answer:
          "Use E°cell = E°cathode − E°anode with standard reduction potentials. For the Zn-Cu preset: E°cell = (+0.34) − (−0.76) = +1.10 V. A positive E°cell means ΔG° = −nFE°cell is negative under standard conditions, confirming spontaneity. The species being oxidized is the anode half-reaction; the species being reduced is the cathode half-reaction.",
      },
      {
        question: "What is the Nernst equation and when do I need it?",
        answer:
          "The Nernst equation E = E° − (RT/nF)·ln Q adjusts cell potential for non-standard concentrations and temperature. In this simulation Q = [anode ions] / [cathode ions], so equal slider values give Q = 1 and E = E°. For the Zn-Cu preset with [anode ions] = 2.0 M, [cathode ions] = 0.01 M, and T = 298 K: Q = 200, E ≈ 1.10 − 0.068 = 1.03 V.",
      },
      {
        question: "Why does a salt bridge need to be present for the cell to keep working?",
        answer:
          "As Zn dissolves, the anode compartment accumulates Zn²⁺ ions (positive charge builds up). As Cu²⁺ deposits at the cathode, the cathode compartment loses positive charge. Without the salt bridge, this charge imbalance creates a voltage that opposes further electron flow and stops the cell. The salt bridge restores neutrality by allowing anions to migrate toward the anode and cations toward the cathode.",
      },
      {
        question: "How is electroplating different from a galvanic cell?",
        answer:
          "Electroplating is an electrolytic process: an external power supply forces metal cations to deposit onto a cathode surface. The external voltage must be large enough to drive the reverse, non-spontaneous reaction plus real-world losses. A galvanic cell releases electrical energy from a spontaneous redox reaction; an electrolytic setup consumes electrical energy to make a reaction happen.",
      },
      {
        question: "How do AP Chemistry standards 9.A.1, 9.B.1, and 9.C.1 map to this simulation?",
        answer:
          "AP 9.A.1 requires identifying oxidation and reduction half-reactions and balancing redox equations — practiced by comparing the preset half-reactions. AP 9.B.1 requires calculating E°cell and relating it to ΔG° = −nFE°cell — practiced with the live E°cell and ΔG° readouts. AP 9.C.1 requires applying the Nernst equation — practiced by varying anode ion concentration, cathode ion concentration, and temperature while recording E vs. Q.",
      },
      {
        question: "How many grams of copper deposit when 5.0 A flows for 30 minutes?",
        answer:
          "Use Faraday's first law: m = MIt/(nF). Here M_Cu = 63.5 g/mol, I = 5.0 A, t = 1800 s, n = 2 electrons per Cu²⁺, F = 96 485 C/mol. m = (63.5 × 5.0 × 1800)/(2 × 96 485) ≈ 2.96 g. This is a common AP free-response calculation type.",
      },
    ],
  },
};
