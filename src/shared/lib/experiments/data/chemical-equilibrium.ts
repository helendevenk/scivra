import type { Experiment } from "@/shared/types/experiment";

export const chemicalEquilibrium: Experiment = {
  id: "chemical-equilibrium",
  slug: "chemical-equilibrium",
  title: "Chemical Equilibrium & Le Chatelier's Principle",
  subtitle: "Dynamic balance between forward and reverse reactions",
  description:
    "Watch a reversible reaction reach equilibrium as forward and reverse rates equalize. Apply Le Chatelier's principle — disturb the system by adding reactants, removing products, changing pressure or temperature — and watch the equilibrium shift to restore balance. Calculate Kc and Kp in real time.",
  thumbnail: "/imgs/experiments/chemical-equilibrium.png",

  standards: {
    ngss: ["HS-PS1-6"],
    gcse: ["C7.1", "C7.2"],
    ap: ["6.A.1", "6.B.1", "6.C.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: ["chemical equilibrium", "Le Chatelier", "equilibrium constant", "Kc Kp", "reversible reaction", "AP Chemistry"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "initialA",
      label: "Initial [A] (reactant)",
      unit: "mol/L",
      min: 0.1,
      max: 3.0,
      default: 1.0,
      step: 0.1,
      tier: "free",
    },
    {
      id: "temperature",
      label: "Temperature",
      unit: "K",
      min: 200,
      max: 700,
      default: 400,
      step: 10,
      tier: "free",
    },
    {
      id: "pressure",
      label: "System Pressure",
      unit: "atm",
      min: 0.5,
      max: 10,
      default: 1,
      step: 0.5,
      tier: "pro",
    },
    {
      id: "addReactant",
      label: "Stress: Add [A]",
      unit: "mol/L",
      min: 0,
      max: 1.0,
      default: 0,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b} \\quad \\text{(at equilibrium)}",
      description: "Equilibrium constant Kc (products over reactants, raised to stoichiometric powers)",
    },
    {
      latex: "Q < K_c \\to \\text{forward}; \\quad Q > K_c \\to \\text{reverse}",
      description: "Reaction quotient Q determines which direction equilibrium shifts",
    },
    {
      latex: "K_p = K_c(RT)^{\\Delta n_g}",
      description: "Converting between Kc and Kp (Δng = change in moles of gas)",
    },
  ],

  theory:
    "Chemical equilibrium is a dynamic state where the forward and reverse reaction rates are equal, so concentrations remain constant (but not necessarily equal). The equilibrium constant Kc is calculated from equilibrium concentrations: Kc = [products]^m / [reactants]^n. Large K (>1) favors products; small K (<1) favors reactants. Le Chatelier's Principle: if a system at equilibrium is disturbed, it shifts to partially counteract the disturbance. Adding a reactant → shifts right (more products). Removing a product → shifts right. Increasing pressure (for gases) → shifts toward fewer moles of gas. Increasing temperature → shifts in the endothermic direction (changes K). Catalysts do NOT change the equilibrium position — only reach it faster.",

  instructions:
    "Press Play to watch the reaction approach equilibrium — concentration lines converge. Once at equilibrium, apply stresses using the controls. Adding [A] (reactant) → watch the system shift right. Increasing temperature on an exothermic reaction → K decreases, equilibrium shifts left. The Q vs K indicator shows which way the reaction is going.",

  challenges: [
    {
      id: "ce-c1",
      question: "For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), if at equilibrium [N₂]=0.5, [H₂]=0.3, [NH₃]=0.2 M, calculate Kc.",
      hint: "Kc = [NH₃]²/([N₂][H₂]³) = (0.2)²/(0.5×0.3³) = 0.04/(0.5×0.027) = 0.04/0.0135 ≈ 2.96",
      tier: "free",
    },
    {
      id: "ce-c2",
      question: "The Haber process is exothermic. Why is it industrially run at high temperature (400-500°C) despite Le Chatelier's prediction?",
      hint: "High T decreases K (less NH₃ at equilibrium) but dramatically increases reaction rate. The industrial compromise: high T for acceptable rate, high pressure and catalyst to improve yield. Remove NH₃ continuously to shift equilibrium right.",
      tier: "free",
    },
    {
      id: "ce-c3",
      question: "For 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), predict the effect of doubling the total pressure.",
      hint: "Left side: 2+1=3 mol gas. Right side: 2 mol gas. Increasing pressure shifts toward fewer moles of gas → shifts right → more SO₃.",
      tier: "free",
    },
    {
      id: "ce-c4",
      question: "Kc = 0.025 at 700°C for the reaction CO(g)+H₂O(g)⇌CO₂(g)+H₂(g). If Q = 0.1 > Kc, what will the reaction do?",
      hint: "Q > Kc means too many products relative to equilibrium → reaction shifts LEFT (toward reactants) to decrease Q until Q = Kc.",
      tier: "pro",
    },
  ],

  wave: 4,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["reaction-kinetics", "acid-base-ph"],

  seoTitle: "Chemical Equilibrium Le Chatelier's Principle | NeonPhysics AP Chemistry",
  seoKeywords: [
    "chemical equilibrium simulation",
    "Le Chatelier's principle interactive",
    "equilibrium constant Kc",
    "reaction quotient Q",
    "AP Chemistry equilibrium",
    "Haber process simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Chemical Equilibrium and Le Chatelier's Principle",
  },
};
