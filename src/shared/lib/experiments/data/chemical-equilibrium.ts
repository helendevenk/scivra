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

  seoTitle: "Chemical Equilibrium Le Chatelier's Principle | Scivra AP Chemistry",
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

  contentSections: {
    whatIsIt:
      "Chemical equilibrium is the state where the forward and reverse reactions of a reversible process happen at the same rate. The concentrations of reactants and products stop changing — but the reactions don't stop. Both directions keep going at equal speed, like two escalators moving people up and down at the same rate. The position of that balance is captured by the equilibrium constant K, a single number that summarizes the ratio of products to reactants when nothing more is changing on the macroscopic scale. Le Chatelier's principle then predicts what happens when you disturb the balance: the system shifts to partially counteract the change. Add more reactant, products grow. Heat an exothermic reaction, equilibrium shifts toward reactants. Tune temperature, pressure, and concentration in this lab and watch the system rebalance in real time, with the on-screen rates and concentrations tracing the path back to a new equilibrium.",
    parameterExplanations: {
      initialA:
        "Starting concentration of reactant A. Higher initial values let the reaction proceed further toward products before equilibrium is reached, but the equilibrium constant K stays the same.",
      temperature:
        "Temperature is the only stress that actually changes K. For an endothermic reaction, raising T shifts equilibrium toward products (heat acts as a 'reactant'). For exothermic, the opposite.",
      pressure:
        "Increasing pressure shifts gaseous equilibria toward whichever side has fewer moles of gas. If both sides have equal moles, pressure has no effect on the position of equilibrium.",
      addReactant:
        "Stresses the system by injecting more reactant. Watch the forward rate spike, products climb, then both rates equalize again at a new equilibrium position. The textbook 'shift right' visualized.",
    },
    misconceptions: [
      {
        wrong:
          "At equilibrium, the forward reaction stops because everything has converted to products.",
        correct:
          "Both reactions keep happening at equilibrium — they're just happening at the same rate. Concentrations stay constant, but molecules are constantly converting in both directions. That's why we call it dynamic equilibrium.",
      },
      {
        wrong:
          "Adding more reactant increases the equilibrium constant K.",
        correct:
          "K only changes with temperature. Adding reactant shifts the position of equilibrium (more product forms) but K is the same. The reaction quotient Q is what changes — the system shifts until Q matches K again.",
      },
      {
        wrong:
          "A catalyst shifts equilibrium toward more products.",
        correct:
          "Catalysts speed up both forward and reverse reactions equally. They reduce the time to reach equilibrium, but the final concentrations of reactants and products are unchanged.",
      },
      {
        wrong:
          "Le Chatelier's principle works because the system 'wants' to maintain the original conditions.",
        correct:
          "It's not about wanting. The principle is a consequence of rate kinetics: when you raise a concentration, you raise the rate of the reaction that consumes it. The system shifts because rates change, not because of any preference.",
      },
    ],
    teacherUseCases: [
      "Stress-test ladder: start at equilibrium, then apply one stress at a time (add A, raise T, raise P). After each, ask students to predict the direction of shift, then use the lab to verify.",
      "Q vs. K: pause mid-shift and have students calculate Q from current concentrations. Compare to K and explain why the reaction is still moving.",
      "Endo vs. exo discovery: don't tell students the sign of ΔH. Have them raise and lower temperature and deduce whether the reaction is exothermic or endothermic from the direction of shift.",
      "Industrial chemistry tie-in: discuss how the Haber process for ammonia picks temperature and pressure to maximize yield, then have students reproduce the conditions.",
      "AP free-response practice: turn the simulation result into a predict/explain pair, e.g. 'When pressure is doubled at constant T, in which direction does equilibrium shift, and why?'",
    ],
    faq: [
      {
        question: "What is Le Chatelier's principle?",
        answer:
          "When a system at equilibrium is disturbed by a change in concentration, temperature, or pressure, the system shifts to partially counteract the disturbance. It's a quick way to predict the direction of shift; it doesn't tell you exactly how much.",
      },
      {
        question: "Why doesn't pressure affect equilibria with equal moles of gas on each side?",
        answer:
          "Pressure only matters when the total moles of gas differ between reactants and products. If both sides have the same number of gas moles, raising pressure compresses both equally and there's no preferred direction.",
      },
      {
        question: "How do I tell if a reaction is exothermic from K?",
        answer:
          "Run the reaction at two different temperatures and see how K changes. If K rises as T rises, the reaction is endothermic (treat heat as a reactant). If K falls as T rises, it's exothermic (heat is a product).",
      },
      {
        question: "What's the difference between Q and K?",
        answer:
          "K is the equilibrium constant — fixed at a given temperature. Q has the same form as K but uses current (not equilibrium) concentrations. If Q < K the reaction shifts right; if Q > K it shifts left; if Q = K the system is at equilibrium.",
      },
      {
        question: "How does this connect to AP Chemistry?",
        answer:
          "AP Chem Unit 7 (Equilibrium) expects students to write equilibrium expressions, use Q to predict shift direction, apply Le Chatelier qualitatively, and reason about why only temperature changes K. Every shift in this lab should be explainable in those terms.",
      },
    ],
  },
};
