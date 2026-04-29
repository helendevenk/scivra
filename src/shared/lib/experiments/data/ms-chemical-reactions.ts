import type { Experiment } from "@/shared/types/experiment";

export const msChemicalReactions: Experiment = {
  id: "ms-chemical-reactions",
  slug: "ms-chemical-reactions",
  title: "Chemical Reactions",
  subtitle: "Reactants, products, conservation of mass, and energy changes",
  description:
    "Mix chemicals and watch reactions happen at the molecular level. Balance chemical equations and verify the Law of Conservation of Mass. Classify reactions as exothermic or endothermic. See atoms rearranging — bonds breaking and forming.",
  thumbnail: "/imgs/experiments/ms-chemical-reactions.png",

  standards: {
    ngss: ["MS-PS1-2", "MS-PS1-5", "HS-PS1-7"],
    gcse: ["C3.1", "C3.2"],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "6-8",
  tags: ["chemical reactions", "conservation of mass", "exothermic", "endothermic", "balancing equations", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "reactionType",
      label: "Reaction (0=Combustion, 1=Synthesis, 2=Decomposition, 3=Single Displacement)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "temperature",
      label: "Temperature",
      unit: "°C",
      min: 20,
      max: 500,
      default: 25,
      step: 10,
      tier: "free",
    },
    {
      id: "concentration",
      label: "Reactant Concentration",
      unit: "mol/L",
      min: 0.1,
      max: 2.0,
      default: 1.0,
      step: 0.1,
      tier: "free",
    },
    {
      id: "catalyst",
      label: "Add Catalyst (0=No, 1=Yes)",
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
      latex: "\\text{Reactants} \\to \\text{Products} \\quad (\\text{atoms conserved})",
      description: "Law of Conservation of Mass: atoms are rearranged, never created/destroyed",
    },
    {
      latex: "\\text{CH}_4 + 2\\text{O}_2 \\to \\text{CO}_2 + 2\\text{H}_2\\text{O} \\quad \\Delta H = -890\\,\\text{kJ}",
      description: "Methane combustion: balanced equation with energy released",
    },
  ],

  theory:
    "A chemical reaction transforms reactants (starting materials) into products (ending materials) by breaking and forming chemical bonds. The atoms themselves are never created or destroyed — they just rearrange. This is the Law of Conservation of Mass: mass of reactants = mass of products. Reactions are classified by type: synthesis (A+B→AB), decomposition (AB→A+B), single displacement (A+BC→AC+B), double displacement (AB+CD→AD+CB), and combustion (fuel+O₂→CO₂+H₂O+heat). Energy changes: exothermic reactions release heat (ΔH<0), endothermic reactions absorb heat (ΔH>0). Reaction rate increases with temperature, concentration, surface area, and catalysts. A catalyst speeds up a reaction without being consumed.",

  instructions:
    "Select a reaction type and press Play to watch atoms rearrange. The molecular model shows bonds breaking and forming. Check the mass balance — left side should equal right side. Increase temperature to speed up the reaction. Add a catalyst (Pro) to lower activation energy and dramatically increase rate.",

  challenges: [
    {
      id: "cr-ms-c1",
      question: "Balance: H₂ + O₂ → H₂O. How many molecules of each substance are needed?",
      hint: "2H₂ + O₂ → 2H₂O. Left side: 4H + 2O. Right side: 4H + 2O. ✓ Balanced. You need 2 hydrogen molecules and 1 oxygen molecule to make 2 water molecules.",
      tier: "free",
    },
    {
      id: "cr-ms-c2",
      question: "If 32 g of sulfur reacts completely with oxygen, how many grams of sulfur dioxide can form?",
      hint: "Conservation of mass: S + O₂ → SO₂. 32 g S + 32 g O₂ = 64 g SO₂. Total mass is conserved.",
      tier: "free",
    },
    {
      id: "cr-ms-c3",
      question: "Is photosynthesis exothermic or endothermic? What about cellular respiration?",
      hint: "Photosynthesis: endothermic (absorbs light energy to build glucose — ΔH>0). Cellular respiration: exothermic (releases energy from glucose — ΔH<0). They are essentially reverse reactions!",
      tier: "free",
    },
    {
      id: "cr-ms-c4",
      question: "How does a catalyst increase reaction rate without being consumed in the reaction?",
      hint: "A catalyst provides an alternative reaction pathway with lower activation energy. More reactant molecules have enough energy to react (from the Maxwell-Boltzmann distribution). The catalyst participates temporarily in the reaction but is regenerated at the end — it's not consumed.",
      tier: "pro",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 14,
  relatedExperiments: ["ms-atoms-molecules", "thermochemistry", "reaction-kinetics"],

  seoTitle: "Chemical Reactions Middle School | Scivra Interactive Chemistry",
  seoKeywords: [
    "chemical reactions middle school simulation",
    "conservation of mass interactive",
    "balancing equations simulation 6-8",
    "exothermic endothermic reactions",
    "molecular model chemical reaction",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Chemical Reactions and Conservation of Mass",
  },
};
