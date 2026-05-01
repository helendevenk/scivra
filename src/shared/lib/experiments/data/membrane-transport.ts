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
      id: "soluteConcInside",
      label: "Intracellular Solute Concentration",
      unit: "mM",
      min: 10,
      max: 200,
      default: 100,
      step: 5,
      tier: "free",
    },
    {
      id: "soluteConcOutside",
      label: "Extracellular Solute Concentration",
      unit: "mM",
      min: 10,
      max: 200,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "temperature",
      label: "Temperature",
      unit: "°C",
      min: 5,
      max: 45,
      default: 37,
      step: 1,
      tier: "pro",
    },
    {
      id: "channelDensity",
      label: "Aquaporin Channel Density",
      unit: "channels/μm²",
      min: 0,
      max: 100,
      default: 20,
      step: 5,
      tier: "pro",
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
    "Set the intracellular and extracellular solute concentrations and watch particles diffuse. When concentrations differ, the net flux is visible as colored arrows. Switch to Osmosis mode to see water movement. Toggle individual transport proteins (channel, carrier, pump) to compare passive vs active mechanisms. Adjust temperature to observe its effect on membrane fluidity and diffusion rate.",

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
  contentSections: {
    whatIsIt:
      "Every cell in your body is surrounded by a phospholipid bilayer — two sheets of fat molecules arranged tail-to-tail — that controls traffic between the inside of the cell and the outside world. Small nonpolar molecules like oxygen and carbon dioxide slip through the bilayer directly; glucose and ions need protein escorts. Osmosis pulls water toward wherever solutes are more concentrated, and active pumps like the Na+/K+ ATPase burn one ATP to eject three sodium ions while pulling in two potassium ions, keeping neurons and muscle cells ready to fire. The concentration gradient is the address label: passive transport follows it for free, while active transport ships cargo against it at ATP cost. Set the intracellular and extracellular solute sliders to opposite extremes and watch net flux reverse direction.",
    parameterExplanations: {
      soluteConcInside:
        "The concentration of dissolved solutes inside the cell membrane, in millimoles per liter (mM). A typical mammalian cell cytoplasm holds roughly 100 mM solutes. Raising this value above the outside concentration drives water into the cell by osmosis and creates an outward gradient for solute diffusion.",
      soluteConcOutside:
        "The concentration of dissolved solutes in the extracellular fluid, in mM. Blood plasma sits around 290 mOsm (~145 mM NaCl equivalent). When this value exceeds soluteConcInside, the cell is in a hypertonic environment — water exits by osmosis and the cell shrinks.",
      temperature:
        "Temperature in degrees Celsius, range 5–45 °C. Higher temperatures increase membrane fluidity and give molecules more kinetic energy, accelerating diffusion rates. At 37 °C (normal body temperature) membrane proteins are optimally flexible; below ~15 °C membrane lipids stiffen and transport slows noticeably.",
      channelDensity:
        "The number of aquaporin water channels per square micrometer of membrane surface. Human red blood cells express about 200,000 AQP1 molecules per cell, giving very fast water equilibration. Drag this slider to zero to see how slowly water moves by unaided diffusion through the lipid bilayer alone.",
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
      "Gradient flip demo: set soluteConcInside to 150 mM and soluteConcOutside to 50 mM, then reverse the values and ask students to predict flux direction before the simulation runs — probes the 'what drives transport' misconception.",
      "Aquaporin ablation: drag channelDensity to 0 and measure (by counting animation frames) how long water equilibration takes vs. channelDensity at 80 — introduces the concept that protein channels can accelerate passive processes without adding energy.",
      "Data collection — temperature vs. rate: record diffusion arrow speed at 10 °C, 25 °C, and 37 °C and plot a graph; students extrapolate to 45 °C and discuss why high temperatures eventually denature membrane proteins and stop transport.",
      "Active vs. passive classification: display each transport protein (channel, carrier, pump) one at a time and ask students to classify it as AP Bio 2.B.1 passive or 2.B.2 active before revealing the answer — connects classification to mechanistic reasoning.",
      "Misconception probe: ask students to explain in writing why the Na+/K+ ATPase must use ATP even when Na+ is more concentrated inside — those who say 'because it moves fast' are confusing speed with energy; use this to anchor the correct definition.",
    ],
    faq: [
      {
        question: "What is the difference between facilitated diffusion and active transport?",
        answer:
          "Both use membrane proteins, but facilitated diffusion moves molecules down their concentration gradient and requires no energy input — glucose transporters (GLUTs) work this way. Active transport moves molecules against their gradient and requires ATP or co-transport coupling. The Na+/K+ ATPase is the classic active transporter, consuming one ATP per cycle to pump 3 Na+ out and 2 K+ in.",
      },
      {
        question: "Why does a cell need aquaporins if water can already cross the lipid bilayer?",
        answer:
          "Unaided water permeation through a pure lipid bilayer is about 100-fold slower than through an aquaporin channel. Cells with high water-flux demands — kidney tubule cells, red blood cells, plant root cells — would equilibrate too slowly without them. A single AQP1 aquaporin passes roughly 3 × 10^9 water molecules per second.",
      },
      {
        question: "How does this experiment connect to AP Bio 2.B.2 and HS-LS1-3?",
        answer:
          "AP Bio 2.B.2 requires students to explain how cells maintain internal environments different from their surroundings through active transport. HS-LS1-3 covers how feedback mechanisms maintain dynamic equilibrium. This simulation lets students observe both: passive gradients can be allowed to equilibrate (HS-LS1-3 feedback) or the pump can be activated to maintain a steady-state difference (AP Bio 2.B.2).",
      },
      {
        question: "What happens to a red blood cell placed in pure water?",
        answer:
          "Pure water is hypotonic — solute concentration outside is effectively 0 mM while red blood cells contain roughly 280 mOsm of solutes. Water rushes in by osmosis, the cell swells, and within seconds it lyses (bursts) — a process called hemolysis. This is why IV fluids are always isotonic (0.9 % NaCl, ~308 mOsm).",
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
