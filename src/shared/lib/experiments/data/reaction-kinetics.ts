import type { Experiment } from "@/shared/types/experiment";

export const reactionKinetics: Experiment = {
  id: "reaction-kinetics",
  slug: "reaction-kinetics",
  title: "Chemical Reaction Kinetics",
  subtitle: "Collision theory, activation energy, and rate laws",
  description:
    "Watch molecules collide and react in real time. Adjust temperature, concentration, and catalyst presence to see how reaction rates change. Plot the Maxwell-Boltzmann energy distribution and watch it shift with temperature. Explore first-order, second-order, and zero-order reactions with live concentration-time graphs.",
  thumbnail: "/imgs/experiments/reaction-kinetics.png",

  standards: {
    ngss: ["HS-PS1-5", "HS-PS1-6"],
    gcse: ["C6.1", "C6.2"],
    ap: ["4.A.1", "4.A.2", "4.B.1"],
  },
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: ["reaction kinetics", "activation energy", "rate law", "Arrhenius", "Maxwell-Boltzmann", "AP Chemistry"],
  difficulty: "advanced",

  parameters: [
    {
      id: "temperature",
      label: "Temperature",
      unit: "K",
      min: 200,
      max: 800,
      default: 300,
      step: 10,
      tier: "free",
    },
    {
      id: "concentration",
      label: "Reactant Concentration [A]",
      unit: "mol/L",
      min: 0.1,
      max: 2.0,
      default: 1.0,
      step: 0.1,
      tier: "free",
    },
    {
      id: "activationEnergy",
      label: "Activation Energy (Ea)",
      unit: "kJ/mol",
      min: 20,
      max: 100,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "catalystPresent",
      label: "Catalyst Present",
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
      latex: "k = A e^{-E_a/RT} \\quad (\\text{Arrhenius equation})",
      description: "Rate constant k increases exponentially with temperature",
    },
    {
      latex: "\\text{rate} = k[A]^m[B]^n \\quad (\\text{rate law})",
      description: "Rate law: rate depends on concentration raised to reaction order",
    },
    {
      latex: "t_{1/2} = \\frac{\\ln 2}{k} \\quad (\\text{first-order half-life})",
      description: "Half-life of a first-order reaction (independent of concentration)",
    },
  ],

  theory:
    "Collision theory: reactions occur when molecules collide with sufficient energy (≥ Ea) and correct orientation. The Arrhenius equation (k = Ae^(-Ea/RT)) shows that rate constant k increases exponentially with temperature — doubling every ~10°C is a rough rule of thumb. The Maxwell-Boltzmann distribution shows the fraction of molecules with enough energy to react — higher T shifts the curve right, increasing the fraction above Ea. Catalysts provide an alternative reaction pathway with lower Ea, increasing the reaction rate without being consumed. Rate orders: zero-order ([A] vs t = linear), first-order (ln[A] vs t = linear, t₁/₂ constant), second-order (1/[A] vs t = linear, t₁/₂ ∝ 1/[A]).",

  instructions:
    "Adjust temperature and watch molecules move faster, collide more energetically. The reaction rate counter increases. Switch to Energy Diagram view to see the activation energy barrier and how catalysts lower it. Use the Maxwell-Boltzmann graph to see what fraction of molecules can react.",

  challenges: [
    {
      id: "rk-c1",
      question: "A reaction has Ea = 50 kJ/mol. Raising the temperature from 300 K to 310 K increases the rate by approximately what factor? (R = 8.314 J/mol·K)",
      hint: "Use Arrhenius: ln(k2/k1) = (Ea/R)(1/T1 - 1/T2). = (50000/8.314)(1/300-1/310) ≈ 0.65, so k2/k1 ≈ e^0.65 ≈ 1.9 (about doubles).",
      tier: "free",
    },
    {
      id: "rk-c2",
      question: "A first-order reaction has k = 0.1 s⁻¹. What is the half-life, and what fraction remains after 30 seconds?",
      hint: "t₁/₂ = ln2/k = 0.693/0.1 = 6.93 s. After 30 s ≈ 4.3 half-lives: fraction = (1/2)^4.3 ≈ 0.05 (5%).",
      tier: "free",
    },
    {
      id: "rk-c3",
      question: "The rate doubles when [A] is doubled, and doubles again when [B] is doubled. What is the rate law?",
      hint: "Rate ∝ [A]¹[B]¹ → rate = k[A][B] (second-order overall, first-order in each reactant).",
      tier: "free",
    },
    {
      id: "rk-c4",
      question: "A catalyst reduces Ea from 80 kJ/mol to 50 kJ/mol at 300 K. By what factor does it increase the rate?",
      hint: "k_cat/k_uncat = e^((Ea_old - Ea_new)/RT) = e^(30000/(8.314×300)) = e^12.0 ≈ 1.6×10⁵. The catalyst speeds up the reaction 160,000-fold!",
      tier: "pro",
    },
  ],

  wave: 4,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["chemical-equilibrium", "thermochemistry"],

  seoTitle: "Chemical Reaction Kinetics — Interactive Arrhenius | NeonPhysics AP Chemistry",
  seoKeywords: [
    "reaction kinetics simulation",
    "Arrhenius equation interactive",
    "activation energy visualization",
    "Maxwell-Boltzmann distribution",
    "AP Chemistry kinetics",
    "rate law calculator",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Chemical Reaction Kinetics and Arrhenius Equation",
  },
};
