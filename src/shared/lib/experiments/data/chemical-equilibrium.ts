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
      id: "reactantAdded",
      label: "[Reactant] added",
      unit: "M",
      min: 0,
      max: 3.0,
      default: 1.0,
      step: 0.05,
      tier: "free",
    },
    {
      id: "temperature",
      label: "Temperature",
      unit: "K",
      min: 200,
      max: 800,
      default: 298,
      step: 10,
      tier: "free",
    },
    {
      id: "pressure",
      label: "System Pressure",
      unit: "atm",
      min: 0.5,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
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
    "Choose one of the three presets — N₂O₄ ⇌ 2NO₂, Fe³⁺+SCN⁻ ⇌ FeSCN²⁺, or Haber N₂+3H₂ ⇌ 2NH₃ — then use the [Reactant] added, Temperature, and Pressure sliders to inspect the live particle counts, K, Q, and direction readout. Press Animate to move the particles, use Add Reactant for a quick concentration stress, and compare Q vs K after each change.",

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
  htmlPath: "/experiments/ap-chemistry/chemical-equilibrium.html",

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
  htmlControlAliases: {
    reactantAdded: "sl-cA",
    temperature: "sl-T",
    pressure: "sl-P",
  },
  presets: [
    {
      id: "0",
      label: "🟤 N₂O₄ ⇌ 2NO₂",
      description:
        "Loads a dinitrogen tetroxide to nitrogen dioxide equilibrium with a product-side coefficient of 2 and an endothermic temperature response. It is useful for connecting color, particle counts, Q, and K in a compact gas-phase system.",
    },
    {
      id: "1",
      label: "🔴 Fe³⁺+SCN⁻ ⇌ FeSCN²⁺",
      description:
        "Loads the iron(III)-thiocyanate complex equilibrium, a strongly product-favored case with a red product species. Use it to contrast large K behavior with reactant-favored systems.",
    },
    {
      id: "2",
      label: "🏭 Haber N₂+3H₂ ⇌ 2NH₃",
      description:
        "Loads the Haber ammonia synthesis case, an exothermic industrial equilibrium with fewer gas particles on the product side. It supports discussion of why temperature, pressure, and rate compromises matter in real production.",
    },
  ],

  contentSections: {
    whatIsIt:
      "Chemical equilibrium is the state where the forward and reverse reactions of a reversible process happen at the same rate. The concentrations of reactants and products stop changing — but the reactions don't stop. Both directions keep going at equal speed, like two escalators moving people up and down at the same rate. The position of that balance is captured by the equilibrium constant K, a single number that summarizes the ratio of products to reactants when nothing more is changing on the macroscopic scale. Le Chatelier's principle then predicts what happens when you disturb the balance: the system shifts to partially counteract the change. Add more reactant, products grow. Heat an exothermic reaction, equilibrium shifts toward reactants. Tune temperature, pressure, and concentration in this lab and watch the system rebalance in real time, with the on-screen rates and concentrations tracing the path back to a new equilibrium.",
    parameterExplanations: {
      reactantAdded:
        "The [Reactant] added slider sets the starting reactant concentration used by the equilibrium calculation. Raising it gives the system more reactant particles to convert, so the live display recalculates the equilibrium amounts of reactant and product for the selected preset. Watch the particle counts, Q, K, and direction readout together: changing concentration changes Q first, then the system is interpreted relative to K. The Add Reactant button is a fast version of the same stress, increasing this slider by a fixed amount. Compare all three presets at the same concentration to see how stoichiometry and K change the final balance.",
      temperature:
        "Temperature controls the Kelvin value used in the simulation's van't Hoff-style K adjustment. Because each preset has its own enthalpy sign, the same temperature move can have different meaning: the N₂O₄ ⇌ 2NO₂ preset is endothermic, while the FeSCN²⁺ and Haber presets are exothermic. As you move the slider, focus on whether K grows or shrinks and then use Q vs K to explain the displayed direction. This is the cleanest way to show the AP Chemistry rule that concentration and pressure can move Q, but temperature is the stress that changes the equilibrium constant.",
      pressure:
        "Pressure sets the displayed system pressure in atmospheres for Le Chatelier discussion. Use it with the gas-phase presets to ask which side has fewer gas particles and predict the qualitative pressure shift before checking the sidebar rules or quiz. In this HTML model, the live K and Q calculation is driven by the selected preset, reactant amount, and temperature, so pressure is best treated as a reasoning prompt rather than a separate equilibrium solver. That distinction is useful: students can separate what the visual model calculates from the chemical rule they must apply on AP-style questions.",
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
          "A higher pressure setting always increases K and creates more products in the simulator.",
        correct:
          "Pressure can shift a gas equilibrium position when the two sides have different gas-particle counts, but it does not change K. In this HTML lab the Pressure slider is a discussion variable and readout; use the preset stoichiometry and Le Chatelier rule to predict the qualitative pressure effect.",
      },
      {
        wrong:
          "The preset buttons only change colors, so the same K and temperature behavior apply to every reaction.",
        correct:
          "Each preset loads a different reaction model with its own K, stoichiometric coefficients, enthalpy sign, labels, and particle colors. That is why the same slider move can produce different Q, K, and particle-count patterns across N₂O₄, FeSCN²⁺, and Haber cases.",
      },
    ],
    teacherUseCases: [
      "Preset comparison warm-up: load N₂O₄, FeSCN²⁺, and Haber in sequence with the same [Reactant] added value, then have students rank the cases by K and product formation using the live particle counts as evidence.",
      "Q vs K reasoning drill: move the [Reactant] added slider or press Add Reactant, pause, and ask students to explain the displayed direction from Q and K rather than from memorized 'shift right' language alone.",
      "Temperature investigation: keep [Reactant] added constant, move Temperature upward for each preset, and have students infer which reactions are endothermic or exothermic from whether K increases or decreases.",
      "Pressure limitation discussion: use the Pressure slider with N₂O₄ and Haber to make qualitative Le Chatelier predictions, then explicitly separate the slider readout from the HTML model's K/Q calculation.",
      "AP-style explanation practice: assign each group one preset and one slider change, then require a two-sentence claim that cites K, Q, stoichiometry, or enthalpy sign as the evidence.",
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
          "Pressure only matters when the total moles of gas differ between reactants and products. If both sides have the same number of gas moles, raising pressure compresses both sides equally and there is no preferred direction. In this HTML lab, pressure is shown as a slider for Le Chatelier reasoning, while the numeric K/Q calculation is driven by the preset, reactant amount, and temperature.",
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
          "AP Chem Unit 7 (Equilibrium) expects students to write equilibrium expressions, use Q to predict shift direction, apply Le Chatelier qualitatively, and reason about why only temperature changes K. Use the three presets to compare reaction forms, then use the sliders to support claim-evidence explanations from the live K, Q, and particle-count displays.",
      },
    ],
  },
};
