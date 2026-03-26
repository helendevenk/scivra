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
  gradeLevel: "AP",
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

  seoTitle: "Cell Membrane Transport Osmosis Diffusion Interactive | NeonPhysics AP Biology",
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
};
