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
        "The absolute temperature of the reaction vessel in kelvins. Higher temperature shifts the Maxwell-Boltzmann distribution to the right, increasing the fraction of molecules with energy above Eₐ and raising k exponentially. Range 200–800 K; the default 300 K corresponds to roughly room temperature.",
      concentration:
        "The initial molar concentration of reactant A in mol/L. For a first-order reaction the rate scales linearly with [A]; for second-order it scales as [A]². Increasing concentration packs more molecules into the same volume, raising collision frequency but not collision energy. Range 0.1–2.0 mol/L; default 1.0 mol/L.",
      activationEnergy:
        "The minimum energy (in kJ/mol) a colliding pair must possess to reach the transition state and proceed to products. Eₐ appears in the Arrhenius exponent — halving Eₐ at 300 K multiplies k by a factor of about 2×10⁴. Range 20–100 kJ/mol; default 50 kJ/mol.",
      catalystPresent:
        "Toggles a catalyst (0 = absent, 1 = present). The catalyst provides an alternative reaction pathway whose Eₐ is lower than the uncatalyzed value, increasing k. Because forward and reverse rates both increase equally, the equilibrium constant K and ΔG° are unaffected.",
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
      "Activation energy probe: ask students to predict whether doubling temperature from 300 K to 600 K doubles or more-than-doubles the rate, then verify with the simulation. Use the result to illustrate the exponential nature of the Arrhenius equation versus linear intuition.",
      "Maxwell-Boltzmann data collection: students record the fraction of molecules above Eₐ at five temperatures (200, 300, 400, 500, 600 K) and plot fraction vs. T. This makes AP 4.A.2 observable — the qualitative shift in the distribution becoming a quantitative graph.",
      "Rate law determination lab: hold T fixed and run the simulation at three different starting concentrations of [A] (e.g., 0.5, 1.0, 2.0 mol/L), then compute the ratio of rates between runs to determine the reaction order in A. Connect the technique to AP free-response method-of-initial-rates problems where multiple reactants are varied independently.",
      "Catalyst misconception probe: run the reaction to equilibrium with and without catalyst and challenge students to explain why final concentrations are identical despite the faster approach. Targets the persistent 'catalysts increase yield' error cited in AP 4.B.1 commentary.",
      "Arrhenius graphing: students collect k values (from the simulation readout) at six temperatures, then plot ln k vs. 1/T. The slope equals −Eₐ/R, letting them extract Eₐ graphically — a skill directly tested in AP exam free-response.",
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
