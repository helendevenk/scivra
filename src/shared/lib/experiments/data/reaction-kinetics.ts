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
  primaryStandard: "ap-chemistry",
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
      max: 600,
      default: 298,
      step: 5,
      tier: "free",
    },
    {
      id: "activationEnergy",
      label: "Activation Energy (Ea)",
      unit: "kJ/mol",
      min: 10,
      max: 150,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "initialConcentration",
      label: "Initial Concentration [A]0",
      unit: "M",
      min: 0.1,
      max: 3,
      default: 1,
      step: 0.1,
      tier: "free",
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
    "Use the Temperature, Activation Energy, and Initial Concentration sliders to compare how thermal energy, the energy barrier, and [A]0 change the reaction curve. Try the First Order, Second Order, and Catalyzed (low Ea) presets to compare integrated rate-law behavior and the effect of a lower activation-energy pathway.",

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
  htmlPath: "/experiments/ap-chemistry/reaction-kinetics.html",
  htmlControlAliases: {
    temperature: "sl-T",
    activationEnergy: "sl-Ea",
    initialConcentration: "sl-A0",
  },
  presets: [
    {
      id: "loadPreset:0",
      label: "First Order",
      description:
        "Shows a first-order reaction where the rate is proportional to the current concentration of A. The concentration curve decays exponentially and the half-life stays constant.",
    },
    {
      id: "loadPreset:1",
      label: "Second Order",
      description:
        "Shows a second-order reaction where the rate depends more strongly on concentration. The reaction slows noticeably as A is consumed and the half-life increases at lower concentration.",
    },
    {
      id: "loadPreset:2",
      label: "Catalyzed (low Ea)",
      description:
        "Shows a lower activation-energy pathway. Compare it with the uncatalyzed settings to see how reducing Ea increases the fraction of effective collisions and speeds the reaction.",
    },
  ],

  seoTitle: "Chemical Reaction Kinetics — Interactive Arrhenius | Scivra AP Chemistry",
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
  contentSections: {
    whatIsIt:
      "Chemical reaction kinetics quantifies how fast reactants convert to products and identifies the variables that control that speed. The rate constant k is governed by the Arrhenius equation k = A·exp(−Eₐ/RT): raising the temperature from 300 K to 310 K roughly doubles the rate for a reaction with Eₐ ≈ 50 kJ/mol. Catalysts lower Eₐ without being consumed, accelerating forward and reverse reactions equally so equilibrium position is unchanged. For an overall reaction, the rate law rate = k[A]^m[B]^n must be determined experimentally — reaction orders m and n are not readable from a balanced equation (elementary-step rate laws are an exception, where exponents follow molecularity). The simulation lets you manipulate temperature, concentration, activation energy, and catalysts while watching the Maxwell-Boltzmann distribution shift and live concentration-time graphs update in real time.",
    parameterExplanations: {
      temperature:
        "Temperature sets the thermal energy available to reacting molecules, measured here in kelvins. Raising it does more than make particles move faster: it shifts the Maxwell-Boltzmann distribution so a larger fraction of collisions exceed the activation-energy barrier. In the Arrhenius equation, that fraction changes exponentially, so a modest increase near room temperature can produce a much larger rate change than students may expect. Use this slider while holding Activation Energy and Initial Concentration fixed to isolate temperature's effect on k, then compare the same reaction at cooler and warmer conditions.",
      activationEnergy:
        "Activation Energy is the minimum energy a collision must have to reach the transition state and form products. A higher Ea means fewer molecules sit above the barrier at the same temperature, so the rate constant drops sharply. A lower Ea represents an easier pathway, such as the pathway produced by a catalyst, and the Catalyzed preset demonstrates that comparison without needing a separate catalyst toggle. Use this slider to connect the energy diagram, Maxwell-Boltzmann shaded area, and Arrhenius equation: changing Ea changes the fraction of effective collisions, not the starting amount of reactant.",
      initialConcentration:
        "Initial Concentration sets [A]0, the starting molarity of reactant A before the reaction begins. Increasing [A]0 creates more reacting particles in the same volume, so collision frequency rises and the initial rate is usually higher. The exact effect depends on reaction order: first-order behavior scales with [A], while second-order behavior scales more strongly and slows dramatically as A is consumed. Use this slider with the First Order and Second Order presets to compare how the same starting concentration produces different concentration-time curves, half-life behavior, and rate changes.",
    },
    misconceptions: [
      {
        wrong:
          "Adding a catalyst shifts the equilibrium toward products, so you get a higher yield.",
        correct:
          "A catalyst lowers Eₐ for forward and reverse reactions equally, so it speeds up the approach to equilibrium but does not change K or the equilibrium concentrations. Only changing temperature alters K.",
      },
      {
        wrong:
          "Activation energy is just another name for the enthalpy of reaction.",
        correct:
          "Eₐ is the energy barrier molecules must overcome to reach the transition state; ΔH is the difference between products and reactants. A reaction can be highly exothermic (large negative ΔH) yet have a large Eₐ and proceed very slowly.",
      },
      {
        wrong:
          "Doubling the concentration of a reactant always doubles the reaction rate.",
        correct:
          "Only for a first-order reactant. If the reaction is zero-order in that reactant, doubling its concentration has no effect on rate; if it is second-order, the rate quadruples. Order must be determined experimentally.",
      },
      {
        wrong:
          "Reaction rate and rate constant are the same thing.",
        correct:
          "The rate constant k is a temperature-dependent proportionality factor. The rate also depends on current concentrations: rate = k[A]^m[B]^n. As reactants are consumed, the rate falls even though k stays fixed at constant T.",
      },
      {
        wrong:
          "Increasing temperature always helps because it just makes molecules move faster.",
        correct:
          "For irreversible reactions, higher T does increase rate. For reversible reactions, temperature also shifts K (Le Chatelier's principle): an exothermic reaction's yield decreases at higher T. Kinetics and equilibrium must both be considered in process design.",
      },
    ],
    teacherUseCases: [
      "Activation energy probe: ask students to hold Temperature and Initial Concentration constant, then move the Activation Energy slider from low to high and explain why the reaction rate changes nonlinearly.",
      "Maxwell-Boltzmann data collection: students record the fraction of molecules above Eₐ at several Temperature slider values and plot fraction vs. T. This makes AP 4.A.2 observable — the qualitative shift in the distribution becoming a quantitative graph.",
      "Rate law comparison: have students run the First Order and Second Order presets at the same Initial Concentration, then compare the shapes of the concentration-time curves and explain why half-life behavior differs.",
      "Catalyzed pathway discussion: use the Catalyzed (low Ea) preset after an uncatalyzed setup and ask students to identify what changed in the energy barrier, the effective-collision fraction, and the reaction speed.",
      "Arrhenius graphing: students collect k values from multiple Temperature settings, then plot ln k vs. 1/T. The slope equals −Eₐ/R, letting them extract Eₐ graphically — a skill directly tested in AP exam free-response.",
    ],
    faq: [
      {
        question: "What exactly is the Arrhenius equation and why is the temperature dependence exponential?",
        answer:
          "The Arrhenius equation k = A·exp(−Eₐ/RT) states that only the fraction of collisions with energy ≥ Eₐ lead to reaction; that fraction follows a Boltzmann distribution, which is inherently exponential. At 300 K with Eₐ = 50 kJ/mol, raising T to 310 K shifts the exponent (−Eₐ/RT) upward by ~0.65, so k₂/k₁ ≈ e^0.65 ≈ 1.9 — a small absolute temperature change produces a large rate change.",
      },
      {
        question: "How do I identify reaction order from concentration-time graphs?",
        answer:
          "Plot [A] vs. t (linear → zero-order), ln[A] vs. t (linear → first-order), or 1/[A] vs. t (linear → second-order). The simulation generates all three; whichever gives a straight line identifies the order. This is the graphical method tested on AP Chemistry 4.A.1 and 4.A.2 exam questions.",
      },
      {
        question: "Does a catalyst change the enthalpy of reaction?",
        answer:
          "No. ΔH depends only on the energy difference between products and reactants — both independent of pathway. A catalyst changes how fast the system reaches equilibrium, not where that equilibrium lies or how much energy is released.",
      },
      {
        question: "Why does the rule of thumb say rate doubles per 10°C increase?",
        answer:
          "For Eₐ ≈ 50 kJ/mol around 300 K, the Arrhenius factor for a 10 K rise gives k₂/k₁ ≈ exp(0.65) ≈ 1.9. The '10°C doubles rate' rule is a rough approximation valid near room temperature; at higher T or for different Eₐ values, the factor can differ significantly.",
      },
      {
        question: "What is the half-life of a first-order reaction and why is it concentration-independent?",
        answer:
          "For a first-order reaction, t₁/₂ = ln 2 / k ≈ 0.693/k. Because the integrated rate law gives [A] = [A]₀ e^(−kt), the time to reach half the starting concentration depends only on k, not on [A]₀. At k = 0.1 s⁻¹, t₁/₂ = 6.93 s regardless of whether you start at 2.0 mol/L or 0.1 mol/L.",
      },
      {
        question: "How does this simulation connect to AP Chemistry standards?",
        answer:
          "The simulation directly addresses AP 4.A.1 (factors affecting reaction rate), AP 4.A.2 (collision theory and the Maxwell-Boltzmann distribution), and AP 4.B.1 (catalysis and alternative pathways). Graphing ln k vs. 1/T to extract Eₐ is an AP 4.A.2 quantitative skill; identifying rate law from concentration-time graphs is AP 4.A.1.",
      },
    ],
  },
};
