import type { Experiment } from "@/shared/types/experiment";

export const calorimetry: Experiment = {
  id: "calorimetry",
  slug: "calorimetry",
  title: "Calorimetry",
  subtitle: "Heat transfer, specific heat, and enthalpy changes",
  description:
    "Perform virtual calorimetry experiments by mixing solutions at different temperatures. Observe temperature changes in real time, calculate heat transfer using q = mcΔT, and determine enthalpy of reaction. Explore Hess's Law through multi-step reactions.",
  thumbnail: "/imgs/experiments/calorimetry.png",

  standards: {
    ngss: ["HS-PS3-1", "HS-PS3-4"],
    gcse: [],
    ap: ["6.A.1", "6.B.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "9-12",
  tags: [
    "calorimetry",
    "heat transfer",
    "specific heat",
    "enthalpy",
    "q=mcΔT",
    "Hess's Law",
    "AP Chemistry",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "massA",
      label: "Mass of Solution A",
      unit: "g",
      min: 10,
      max: 200,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "tempA",
      label: "Temperature of Solution A",
      unit: "°C",
      min: 0,
      max: 100,
      default: 25,
      step: 1,
      tier: "free",
    },
    {
      id: "massB",
      label: "Mass of Solution B",
      unit: "g",
      min: 10,
      max: 200,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "tempB",
      label: "Temperature of Solution B",
      unit: "°C",
      min: 0,
      max: 100,
      default: 75,
      step: 1,
      tier: "free",
    },
    {
      id: "reactionType",
      label: "Reaction (0=mixing, 1=acid-base, 2=dissolution)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "q = mc\\Delta T",
      description:
        "Heat transfer: q = heat (J), m = mass (g), c = specific heat capacity (J/(g·°C)), ΔT = temperature change (°C)",
    },
    {
      latex: "q_{\\text{lost}} + q_{\\text{gained}} = 0",
      description:
        "Conservation of energy in a calorimeter: heat lost by hot substance equals heat gained by cold substance",
    },
    {
      latex: "\\Delta H_{\\text{rxn}} = -\\frac{q_{\\text{solution}}}{n}",
      description:
        "Enthalpy of reaction per mole: negative of heat absorbed by solution divided by moles of limiting reagent",
    },
  ],

  theory:
    "Calorimetry measures heat changes during chemical or physical processes. In a coffee-cup calorimeter (constant pressure), the heat released or absorbed by a reaction is captured by the surrounding solution. Using q = mcΔT, where c for dilute aqueous solutions ≈ 4.184 J/(g·°C), we calculate q_solution. By conservation of energy, q_rxn = -q_solution. The molar enthalpy ΔH_rxn = q_rxn/n (per mole of limiting reagent). For mixing two solutions at different temperatures (no reaction), the final temperature is the weighted average: T_f = (m₁c₁T₁ + m₂c₂T₂)/(m₁c₁ + m₂c₂). Hess's Law states that ΔH for an overall reaction equals the sum of ΔH values for individual steps, regardless of the path taken.",

  instructions:
    "Set the mass and temperature of two solutions, then choose a reaction type. Press 'Mix' to combine them in the virtual calorimeter. Watch the temperature curve update in real time as thermal equilibrium is reached. The data panel calculates q, ΔT, and ΔH automatically.",

  challenges: [
    {
      id: "cal-c1",
      question: "50 g of water at 80°C is mixed with 50 g at 20°C. What is the final temperature?",
      hint: "T_f = (50×80 + 50×20)/(50+50) = 50°C (equal masses, simple average)",
      tier: "free",
    },
    {
      id: "cal-c2",
      question: "100 g of solution rises by 5.2°C in a neutralization. What is q? (c = 4.184 J/(g·°C))",
      hint: "q = mcΔT = 100 × 4.184 × 5.2 = 2175.7 J ≈ 2.18 kJ",
      tier: "free",
    },
    {
      id: "cal-c3",
      question: "If the neutralization used 0.050 mol HCl, what is ΔH per mole?",
      hint: "ΔH = -q/n = -2176/0.050 = -43,520 J/mol ≈ -43.5 kJ/mol",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["thermochemistry", "beers-law-lab"],
  htmlPath: "/experiments/ap-chemistry/calorimetry.html",

  seoTitle: "Calorimetry Virtual Lab | Scivra AP Chemistry",
  seoKeywords: [
    "calorimetry simulation",
    "q=mcΔT calculator",
    "enthalpy virtual lab",
    "heat transfer interactive",
    "AP Chemistry calorimetry",
    "specific heat experiment",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Calorimetry and Heat Transfer",
  },
  contentSections: {
    whatIsIt:
      "Calorimetry is the experimental technique of measuring heat flow during physical or chemical processes by tracking temperature changes in a known mass of surroundings. The core equation is q = mcΔT: multiply the mass of solution (g) by its specific heat capacity (4.184 J/(g·°C) for dilute aqueous solutions) and by the observed temperature change to get heat in joules. In a coffee-cup calorimeter at constant pressure, heat released by the reaction warms the solution; conservation of energy gives q_rxn = −q_solution. Dividing by moles of limiting reagent yields ΔH in kJ/mol. Bomb calorimetry operates at constant volume and measures ΔE instead. This simulation models both simple thermal mixing and reactive scenarios so you can see how mass, initial temperature, and reaction type affect the measured enthalpy.",
    parameterExplanations: {
      massA:
        "The mass of Solution A in grams, ranging from 10 to 200 g (default 50 g). A larger mass has more thermal energy to exchange; doubling mass doubles the heat transferred at the same ΔT. In the calculation, m_A appears in q_A = m_A · c · ΔT_A.",
      tempA:
        "The initial temperature of Solution A in degrees Celsius (0–100°C, default 25°C). Combined with tempB, this sets the direction and magnitude of heat flow: the hotter solution loses heat, the cooler one gains it. Raising tempA increases the driving force for heat transfer.",
      massB:
        "The mass of Solution B in grams (10–200 g, default 50 g). When massB differs from massA, the mixture's final temperature shifts toward the temperature of the heavier solution because it contains proportionally more thermal energy. This illustrates the weighted-average nature of T_final.",
      tempB:
        "The initial temperature of Solution B in degrees Celsius (0–100°C, default 75°C). Setting tempB above tempA makes Solution B the heat source; below tempA it becomes the heat sink. For reactive modes, tempB also sets starting conditions for the enthalpy calculation.",
      reactionType:
        "Selects the type of process: 0 = simple thermal mixing (no reaction, only heat transfer), 1 = acid-base neutralization (exothermic, ΔH ≈ −57 kJ/mol for strong acid + strong base), 2 = dissolution (endothermic or exothermic depending on solute). Each mode applies the appropriate ΔH_rxn on top of the mixing calculation.",
    },
    misconceptions: [
      {
        wrong:
          "The heat released by the reaction (q_rxn) is the same number as q_solution, just with a negative sign added.",
        correct:
          "By conservation of energy, q_rxn + q_solution = 0, so q_rxn = −q_solution. If the solution temperature rises (q_solution > 0, heat gained by solution), the reaction released heat (q_rxn < 0, exothermic). The sign convention is: negative ΔH means the system (reactants → products) lost energy to the surroundings.",
      },
      {
        wrong:
          "Specific heat capacity is the same for all liquids — just use 4.18 J/(g·°C) for everything.",
        correct:
          "4.184 J/(g·°C) is the specific heat of pure water. Organic solvents, oils, and metals differ substantially (ethanol ≈ 2.44, aluminum ≈ 0.90 J/(g·°C)). Dilute aqueous solutions approximate water, but concentrated solutions or non-aqueous media require the correct c value or the calculated q will be wrong.",
      },
      {
        wrong:
          "A larger temperature change always means more heat was transferred.",
        correct:
          "ΔT alone does not tell you how much heat moved — you also need mass and specific heat. Adding 1 kJ to 10 g of water raises it by 23.9°C, but adding the same 1 kJ to 1000 g raises it only 0.24°C. Always use q = mcΔT, not ΔT in isolation.",
      },
      {
        wrong:
          "Coffee-cup and bomb calorimetry measure the same quantity.",
        correct:
          "Coffee-cup calorimetry is done at constant pressure and measures ΔH (enthalpy change). Bomb calorimetry is done at constant volume and measures ΔE (internal energy change). For most reactions involving only solutions, the difference is small, but for reactions with gases the PΔV term can be significant.",
      },
      {
        wrong:
          "The final temperature of a mixture is always halfway between the two starting temperatures.",
        correct:
          "That is only true when both masses and specific heats are equal. The correct formula is T_f = (m₁c₁T₁ + m₂c₂T₂)/(m₁c₁ + m₂c₂). Use the simulation to mix 100 g at 80°C with 50 g at 20°C and confirm T_f ≈ 60°C, not 50°C.",
      },
    ],
    teacherUseCases: [
      "Mixing-law verification: have students predict T_final for three different mass-ratio combinations (1:1, 2:1, 3:1) before running the simulation, then compare to measured values. This builds quantitative intuition for the weighted-average formula before introducing reactive scenarios.",
      "Enthalpy of neutralization determination: set reactionType = 1 (acid-base), record q_solution at several mole quantities, and compute ΔH per mole each time. Students should converge on ≈ −57 kJ/mol and discuss why the value is consistent across dilutions — addressing AP 6.B.1 directly.",
      "Specific-heat misconception probe: ask students which scenario produces a larger temperature spike — adding 2000 J to 200 g or to 50 g of water — before touching the controls. Use the result to drive home that ΔT = q/(mc) and that ΔT is not a proxy for q.",
      "Error analysis activity: introduce a 'leaky calorimeter' scenario by comparing ideal calculated T_f to a slightly lower observed T_f, asking students to quantify percent heat loss. This mimics real lab conditions and addresses systematic error, a recurring AP exam theme.",
      "Hess's Law extension: run three separate reaction steps (combustion of C → CO₂, combustion of CO → CO₂, and the target formation of CO) and sum the enthalpies, then verify the result matches the direct measurement. Connects calorimetry data to AP 5.C.1 pathway-independence.",
    ],
    faq: [
      {
        question: "Why do we use 4.184 J/(g·°C) instead of a round number?",
        answer:
          "4.184 J/(g·°C) is the precisely measured specific heat of liquid water at 15°C and 1 atm. The 'calorie' was originally defined as the heat to raise 1 g of water by 1°C, so 1 cal = 4.184 J. On AP Chemistry problems you will sometimes see 4.18 J/(g·°C) as a rounded value; either is acceptable unless the problem specifies.",
      },
      {
        question: "What does ΔH = −57 kJ/mol mean for a neutralization reaction?",
        answer:
          "It means the system (reactants H⁺ + OH⁻ → H₂O) releases 57 kJ of energy for every mole of water formed, transferring that energy as heat to the surrounding solution. The negative sign signals exothermic: the solution temperature rises, and the surroundings (calorimeter + solution) absorb the energy the system lost.",
      },
      {
        question: "How is ΔH calculated from calorimetry data?",
        answer:
          "Measure m (mass of solution in grams), c (specific heat, ≈ 4.184 J/(g·°C) for aqueous solutions), and ΔT (final minus initial temperature in °C). Calculate q_solution = mcΔT, then q_rxn = −q_solution. Finally ΔH_rxn = q_rxn / n, where n is moles of limiting reagent. Units: joules → divide by 1000 for kJ/mol.",
      },
      {
        question: "Does the mass of the calorimeter itself affect the result?",
        answer:
          "In an ideal coffee-cup calorimeter, the cup is assumed to absorb negligible heat. In reality, the calorimeter has a heat capacity C_cal (J/°C) that must be measured and subtracted: q_rxn = −(q_solution + q_calorimeter). Real lab calorimeters with non-negligible heat capacity require this correction.",
      },
      {
        question: "How does this connect to AP Chemistry standards 6.A.1 and 6.B.1?",
        answer:
          "AP 6.A.1 requires students to explain energy diagrams and heat transfer at constant pressure using ΔH. AP 6.B.1 requires calculating ΔH from calorimetry data using q = mcΔT and identifying the system versus surroundings. Both are directly practiced in this simulation's mixing and reactive modes.",
      },
      {
        question: "Can I use this simulation to understand Hess's Law?",
        answer:
          "Yes — run two or three reactions separately, record each q and compute each partial ΔH, then algebraically sum them. Because enthalpy is a state function, the sum must equal the ΔH of the overall combined reaction. This matches the AP 5.C.1 Hess's Law skill and is the same calculation used on multi-step calorimetry free-response questions.",
      },
    ],
  },
};
