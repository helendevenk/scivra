import type { Experiment } from "@/shared/types/experiment";

export const membraneTransport: Experiment = {
  id: "membrane-transport",
  slug: "membrane-transport",
  title: "Cell Membrane & Transport",
  subtitle: "How cells control what enters and exits",
  description:
    "Explore the fluid mosaic model of the cell membrane and all its transport mechanisms. Watch molecules diffuse down concentration gradients, observe osmosis pulling water across the membrane, and see protein channels and pumps at work. Compare passive transport, facilitated diffusion, and active transport.",
  thumbnail: "/imgs/experiments/membrane-transport.png",

  standards: {
    ngss: ["HS-LS1-2", "HS-LS1-3"],
    gcse: ["B1.5", "B1.6"],
    ap: ["2.B.1", "2.B.2"],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "9-12",
  tags: ["cell membrane", "osmosis", "diffusion", "active transport", "fluid mosaic", "AP Biology"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "externalConcentration",
      label: "Extracellular Concentration",
      unit: "mM",
      min: 50,
      max: 400,
      default: 150,
      step: 1,
      tier: "free",
    },
    {
      id: "internalConcentration",
      label: "Intracellular Concentration",
      unit: "mM",
      min: 50,
      max: 400,
      default: 150,
      step: 1,
      tier: "free",
    },
    {
      id: "pumpRate",
      label: "Pump Speed",
      unit: "rate",
      min: 0,
      max: 5,
      default: 1,
      step: 0.5,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "J = -D \\frac{dC}{dx} \\quad (\\text{Fick's First Law})",
      description: "Flux J proportional to concentration gradient (Fick's law)",
    },
    {
      latex: "\\Pi = iMRT \\quad (\\text{osmotic pressure})",
      description: "Osmotic pressure depends on molarity, temperature, and van't Hoff factor i",
    },
    {
      latex: "\\Delta G = RT \\ln\\frac{[C]_{in}}{[C]_{out}} + zF\\Delta\\Psi",
      description: "Free energy of transport (chemical + electrical gradient)",
    },
  ],

  theory:
    "The plasma membrane is a phospholipid bilayer with embedded proteins — the fluid mosaic model (Singer & Nicolson, 1972). Transport mechanisms: Simple diffusion — small nonpolar molecules (O₂, CO₂, steroids) move down their concentration gradient through the lipid bilayer. Facilitated diffusion — ions and polar molecules use channel proteins (ion channels, aquaporins) or carrier proteins (glucose transporters) to cross the membrane, still down the gradient, no ATP needed. Osmosis — water moves across a semipermeable membrane from low to high solute concentration (high to low water potential). Active transport — the Na⁺/K⁺ ATPase uses ATP to pump 3 Na⁺ out and 2 K⁺ in against their gradients, maintaining electrochemical gradients. Endocytosis and exocytosis move large molecules via vesicles.",

  instructions:
    "Use the Extracellular Concentration and Intracellular Concentration sliders to create isotonic, hypertonic, or hypotonic conditions, then adjust Pump Speed to compare passive gradient movement with ATP-driven transport. Try the Isotonic Solution, Hypertonic Solution, and Hypotonic Solution presets, then change one slider at a time and watch osmotic difference, ATP use, molecules moved, and mode labels update.",

  challenges: [
    {
      id: "mt-c1",
      question: "A cell is placed in a hypertonic solution. What direction does water move and what happens to the cell?",
      hint: "Hypertonic outside = higher solute concentration outside. Water moves OUT of the cell via osmosis. The cell shrinks (crenation in animal cells, plasmolysis in plant cells).",
      tier: "free",
    },
    {
      id: "mt-c2",
      question: "Why can CO₂ cross the membrane without a protein channel, while glucose cannot?",
      hint: "CO₂ is small and nonpolar → dissolves in the lipid bilayer easily. Glucose is large and polar → needs a glucose transporter (GLUT) protein for facilitated diffusion.",
      tier: "free",
    },
    {
      id: "mt-c3",
      question: "The Na⁺/K⁺ pump moves 3 Na⁺ out and 2 K⁺ in per ATP. Why is this electrogenically unequal?",
      hint: "More positive charges leave (3 Na⁺) than enter (2 K⁺), creating a net negative charge inside. This contributes to the resting membrane potential (about −5 to −10 mV of the total −70 mV).",
      tier: "free",
    },
    {
      id: "mt-c4",
      question: "Ouabain inhibits the Na⁺/K⁺ ATPase. Predict the cascade of effects on a neuron over the next 30 minutes.",
      hint: "Step 1: Na⁺ accumulates inside, K⁺ depletes. Step 2: Concentration gradients collapse. Step 3: Resting membrane potential depolarizes. Step 4: Neuron cannot fire action potentials properly. Step 5: Cell swells from osmotic water entry. Ouabain is toxic at high doses — used medically at low doses as a cardiac drug (digoxin-related).",
      tier: "pro",
    },
  ],

  wave: 3,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["neuron-action-potential", "cellular-respiration"],

  seoTitle: "Cell Membrane Transport Osmosis Diffusion Interactive | Scivra AP Biology",
  seoKeywords: [
    "cell membrane transport simulation",
    "osmosis diffusion interactive",
    "fluid mosaic model",
    "active transport biology",
    "AP Biology membrane",
    "aquaporin channel",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Cell Membrane Structure and Transport Mechanisms",
  },
  htmlControlAliases: {
    externalConcentration: "sl-ext",
    internalConcentration: "sl-int",
    pumpRate: "sl-pump",
  },
  presets: [
    {
      id: "applyPreset:0",
      label: "Isotonic Solution",
      description:
        "Sets extracellular and intracellular concentrations equal, with a moderate pump speed, so students can observe a balanced baseline with little net osmotic difference.",
    },
    {
      id: "applyPreset:1",
      label: "Hypertonic Solution",
      description:
        "Sets extracellular concentration higher than intracellular concentration and raises pump speed, showing a condition where water tends to leave the cell.",
    },
    {
      id: "applyPreset:2",
      label: "Hypotonic Solution",
      description:
        "Sets extracellular concentration lower than intracellular concentration and lowers pump speed, showing a condition where water tends to enter the cell.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Every cell in your body is surrounded by a phospholipid bilayer — two sheets of fat molecules arranged tail-to-tail — that controls traffic between the inside of the cell and the outside world. Small nonpolar molecules like oxygen and carbon dioxide slip through the bilayer directly; glucose and ions need protein escorts. Osmosis pulls water toward wherever solutes are more concentrated, and active pumps like the Na+/K+ ATPase burn one ATP to eject three sodium ions while pulling in two potassium ions, keeping neurons and muscle cells ready to fire. The concentration gradient is the address label: passive transport follows it for free, while active transport ships cargo against it at ATP cost. Set the intracellular and extracellular solute sliders to opposite extremes and watch net flux reverse direction.",
    parameterExplanations: {
      externalConcentration:
        "Extracellular Concentration sets the solute level outside the membrane, from dilute fluid at 50 mM to a concentrated environment at 400 mM. Compare it with Intracellular Concentration rather than reading it alone: if the outside value is higher, the solution is hypertonic relative to the cell and the osmotic difference favors water leaving. If it is lower, the outside solution is hypotonic and the model favors water entry. Start with the Isotonic Solution preset, then raise only this slider to isolate how the external environment changes net transport direction, osmotic difference, and the displayed mode.",
      internalConcentration:
        "Intracellular Concentration sets the solute level inside the cell, using the same 50-400 mM scale as the outside fluid. This value represents the cell's internal dissolved ions and molecules, so it helps determine whether the cell is balanced, losing water, or gaining water. Raising it above the outside concentration creates a hypotonic outside condition and favors water movement into the cell. Lowering it below the outside concentration creates a hypertonic outside condition and favors water movement out. Use the Hypertonic and Hypotonic presets as anchors, then move only this slider to test how internal composition changes the gradient.",
      pumpRate:
        "Pump Speed controls how quickly the active transport pump cycles, from 0 rate to 5 rate. Unlike diffusion and osmosis, a pump can move selected particles against a gradient by using ATP, so this slider changes the ATP count and molecules-moved readout rather than just changing concentration labels. A low value lets passive gradient effects dominate the scene; a higher value emphasizes ATP-driven maintenance of unequal internal and external conditions. Compare the three presets at their starting pump speeds, then set Pump Speed to 0 to ask what the membrane would do without active transport supporting homeostasis.",
    },
    misconceptions: [
      {
        wrong:
          "Active transport just means 'fast transport' — if molecules move quickly across the membrane, that must be active.",
        correct:
          "Active vs passive has nothing to do with speed — it is about energy. Passive transport (diffusion, facilitated diffusion, osmosis) moves molecules down their concentration gradient with no ATP required. Active transport moves molecules against their gradient and requires ATP or another energy source. The Na+/K+ ATPase is slow but energetically expensive; facilitated diffusion through an aquaporin is fast but costs no ATP.",
      },
      {
        wrong:
          "The concentration gradient drives ATP use — the steeper the gradient, the more ATP the cell makes to handle it.",
        correct:
          "The gradient does not cause ATP production; ATP is consumed to work against a gradient. Gradients drive passive processes. It is the cell's need to maintain a gradient against leakage that costs ATP — not the gradient itself generating it.",
      },
      {
        wrong:
          "Osmosis and diffusion are the same thing — water just diffuses like any other molecule.",
        correct:
          "Osmosis is specifically the diffusion of water across a selectively permeable membrane in response to a solute concentration difference. Regular diffusion refers to any substance moving down its own concentration gradient. The distinction matters because osmosis depends on the solute gradient, not the water-molecule gradient alone.",
      },
      {
        wrong:
          "I learned that cells in a hypotonic solution shrink because there is less water outside.",
        correct:
          "In a hypotonic solution, solute concentration outside is lower than inside, meaning water concentration outside is higher. Water enters the cell by osmosis, causing it to swell — the opposite of shrinking. Animal cells in a strongly hypotonic solution can lyse (burst). Plant cells resist this with a rigid cell wall, reaching turgor pressure instead.",
      },
    ],
    teacherUseCases: [
      "Gradient flip demo: set Extracellular Concentration to 300 mM and Intracellular Concentration to 100 mM, then reverse the values and ask students to predict the displayed mode and osmotic difference before the simulation updates.",
      "Preset comparison: run Isotonic Solution, Hypertonic Solution, and Hypotonic Solution in sequence, recording extracellular concentration, intracellular concentration, pump speed, osmotic difference, and visible particle movement for each case.",
      "Active transport isolation: hold both concentration sliders at the Isotonic Solution preset values, then move Pump Speed from 0 to 5 and ask students which readouts change because of ATP-driven pumping rather than diffusion.",
      "One-variable investigation: keep Pump Speed fixed at 1 rate, move only Extracellular Concentration in 50 mM steps, and have students identify where the mode changes from hypotonic to isotonic to hypertonic.",
      "Misconception probe: ask students to explain why Pump Speed is not the same as passive diffusion speed; students should connect active transport to ATP use and gradient maintenance, not simply to faster particle motion.",
    ],
    faq: [
      {
        question: "What is the difference between facilitated diffusion and active transport?",
        answer:
          "Both can involve membrane proteins, but they differ in energy and direction. Facilitated diffusion moves substances down their concentration gradient and requires no ATP. Active transport moves selected substances against their gradient and requires energy, often from ATP. In this simulation, use Extracellular Concentration and Intracellular Concentration to create the gradient, then change Pump Speed to see how active transport can maintain an unequal internal and external condition instead of simply letting the system drift toward balance.",
      },
      {
        question: "How do I tell whether the setup is isotonic, hypertonic, or hypotonic?",
        answer:
          "Compare the two concentration sliders. If Extracellular Concentration and Intracellular Concentration are equal, the solution is isotonic relative to the cell and there is little net osmotic difference. If the outside concentration is higher, the outside solution is hypertonic and water tends to leave the cell. If the outside concentration is lower, the outside solution is hypotonic and water tends to enter the cell. The three presets give quick reference cases for those comparisons.",
      },
      {
        question: "How does this experiment connect to AP Bio 2.B.2 and HS-LS1-3?",
        answer:
          "AP Bio 2.B.2 requires students to explain how cells maintain internal environments different from their surroundings through active transport. HS-LS1-3 covers how feedback mechanisms maintain dynamic equilibrium. This simulation lets students observe both: concentration differences create passive gradient effects, while Pump Speed represents ATP-driven transport that can help maintain a steady-state difference instead of letting gradients simply equilibrate.",
      },
      {
        question: "What happens to a red blood cell placed in pure water?",
        answer:
          "Pure water is hypotonic — solute concentration outside is effectively 0 mM while red blood cells contain roughly 280 mOsm of solutes. Water rushes in by osmosis, the cell swells, and within seconds it lyses (bursts) — a process called hemolysis. This is why pure water is never used as an IV fluid; routine maintenance IV fluids like 0.9 % NaCl (~308 mOsm) are formulated to be isotonic, though hypotonic and hypertonic solutions exist for specific clinical indications.",
      },
      {
        question: "Why does the Na+/K+ pump create an electrical imbalance, not just a chemical one?",
        answer:
          "The pump is electrogenic: it moves 3 positive charges (Na+) out for every 2 positive charges (K+) brought in, creating a net outward movement of one positive charge per cycle. This contributes roughly 5–10 mV to the resting membrane potential of about −70 mV in neurons. The rest of the potential comes from differential K+ permeability through leak channels.",
      },
      {
        question: "Can cells do active transport without ATP?",
        answer:
          "Yes — secondary active transport uses the electrochemical gradient built by a primary pump (like the Na+/K+ ATPase) to drive a co-transporter. The sodium-glucose cotransporter SGLT1 in intestinal cells uses the inward Na+ gradient to drag glucose into the cell against its own gradient, with no direct ATP hydrolysis at the co-transporter itself.",
      },
    ],
  },
};
