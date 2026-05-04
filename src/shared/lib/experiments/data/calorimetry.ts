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
      id: "mass",
      label: "Sample Mass",
      unit: "g",
      min: 10,
      max: 500,
      default: 100,
      step: 5,
      tier: "free",
    },
    {
      id: "specificHeat",
      label: "Specific Heat Capacity",
      unit: "J/(g·°C)",
      min: 0.5,
      max: 8,
      default: 4.18,
      step: 0.1,
      tier: "free",
    },
    {
      id: "initialTemperature",
      label: "Initial Temperature",
      unit: "°C",
      min: 0,
      max: 80,
      default: 25,
      step: 0.5,
      tier: "free",
    },
    {
      id: "temperatureChange",
      label: "Temperature Change",
      unit: "°C",
      min: -30,
      max: 30,
      default: 5,
      step: 0.5,
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
    "Use the Sample Mass, Specific Heat Capacity, Initial Temperature, and Temperature Change sliders to calculate heat transfer with q = mcΔT. Try the NaOH+HCl Neutralization, Combustion of Methane, and Ice in Water (Fusion) presets to compare exothermic, combustion, and phase-change calorimetry examples.",

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
  htmlControlAliases: {
    mass: "sl-mass",
    specificHeat: "sl-c",
    initialTemperature: "sl-Ti",
    temperatureChange: "sl-dT",
  },
  presets: [
    {
      id: "loadPreset:0",
      label: "🧂 NaOH+HCl Neutralization",
      description:
        "Loads a strong acid-base neutralization example. Use it to connect an exothermic temperature rise to q_solution and the sign of ΔH_rxn.",
    },
    {
      id: "loadPreset:1",
      label: "🔥 Combustion of Methane",
      description:
        "Loads a combustion calorimetry example for methane. It highlights a large exothermic heat release and supports comparison with smaller solution reactions.",
    },
    {
      id: "loadPreset:2",
      label: "🧊 Ice in Water (Fusion)",
      description:
        "Loads a phase-change example where energy goes into melting ice. Use it to separate temperature change from latent heat during fusion.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Calorimetry is the experimental technique of measuring heat flow during physical or chemical processes by tracking temperature changes in a known mass of surroundings. The core equation is q = mcΔT: multiply the mass of solution (g) by its specific heat capacity (4.184 J/(g·°C) for dilute aqueous solutions) and by the observed temperature change to get heat in joules. In a coffee-cup calorimeter at constant pressure, heat released by the reaction warms the solution; conservation of energy gives q_rxn = −q_solution. Dividing by moles of limiting reagent yields ΔH in kJ/mol. Bomb calorimetry operates at constant volume and measures ΔE instead. This simulation models both simple thermal mixing and reactive scenarios so you can see how mass, initial temperature, and temperature change affect the measured heat transfer.",
    parameterExplanations: {
      mass:
        "Sample Mass is the amount of material or solution being treated as the calorimeter surroundings, measured in grams. In q = mcΔT, mass scales heat directly: doubling the mass doubles q for the same specific heat capacity and temperature change. Use this slider first when students need to see why a large beaker of water can absorb much more energy than a small sample while showing a smaller temperature response. Keep Specific Heat Capacity and Temperature Change fixed, then sweep Sample Mass to isolate the m term in the equation and connect measured heat to the amount of matter involved.",
      specificHeat:
        "Specific Heat Capacity sets how much energy one gram of the sample needs for a one-degree Celsius temperature change. Water and dilute aqueous solutions sit near 4.18 J/(g·°C), while metals, oils, and other materials can be much lower or higher. This slider lets students test that q depends on material identity, not just mass and temperature. With Sample Mass and Temperature Change held fixed, increasing Specific Heat Capacity raises the calculated heat transfer. Use the Ice in Water (Fusion) preset as a reminder that phase changes can involve energy transfer even when temperature behavior is not a simple warming curve.",
      initialTemperature:
        "Initial Temperature sets the starting thermometer reading before the calorimetry event. It does not by itself determine q; the heat calculation depends on the change from that starting point. This makes the slider useful for distinguishing absolute temperature from ΔT. A sample starting at 20°C and warming by 5°C transfers the same q as one starting at 50°C and warming by 5°C, provided mass and specific heat are unchanged. Use this control with the presets to discuss what the thermometer shows before the process begins and how the final temperature is inferred from initial temperature plus the chosen temperature change.",
      temperatureChange:
        "Temperature Change is the observed ΔT used directly in q = mcΔT. Positive values represent warming of the surroundings, which usually means the chemical system released heat to the solution; negative values represent cooling, often associated with an endothermic process or energy absorbed by a phase change. This slider is the fastest way to connect sign convention to the data panel. Keep Sample Mass and Specific Heat Capacity fixed, then compare +5°C and -5°C. The magnitude of q is the same, but the sign changes, giving students a concrete way to discuss exothermic versus endothermic behavior and why ΔH_rxn has the opposite sign from q_solution.",
    },
    misconceptions: [
      {
        wrong:
          "The heat released by the reaction (q_rxn) is the same number as q_solution, just with a negative sign added.",
        correct:
          "By conservation of energy, q_rxn + q_solution = 0, so q_rxn = −q_solution. If Temperature Change is positive, the surroundings gained heat and q_solution is positive, so the reaction released heat and q_rxn is negative. If Temperature Change is negative, the surroundings cooled and the process absorbed heat. The sign convention is: negative ΔH means the system lost energy to the surroundings.",
      },
      {
        wrong:
          "Specific heat capacity is the same for all liquids — just use 4.18 J/(g·°C) for everything.",
        correct:
          "4.184 J/(g·°C) is the specific heat of pure water. Organic solvents, oils, and metals differ substantially (ethanol ≈ 2.44, aluminum ≈ 0.90 J/(g·°C)). Dilute aqueous solutions approximate water, but concentrated solutions or non-aqueous media require the correct c value. Use the Specific Heat Capacity slider to see how changing only c changes the calculated heat transfer.",
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
          "The final temperature matters, but the initial temperature is just background information.",
        correct:
          "Initial temperature is part of the measured temperature change. In this simulation, Temperature Change is applied relative to Initial Temperature, so a 25°C start with +5°C ends at 30°C, while a 60°C start with +5°C ends at 65°C. The same ΔT can produce the same q when Sample Mass and Specific Heat Capacity match, even though the final thermometer readings differ.",
      },
    ],
    teacherUseCases: [
      "q = mcΔT isolation: keep Specific Heat Capacity at 4.18 J/(g·°C) and Temperature Change at +5°C, then vary only Sample Mass from 50 g to 200 g. Students record q and verify that heat transfer scales directly with mass.",
      "Material comparison: hold Sample Mass and Temperature Change constant while changing Specific Heat Capacity from a metal-like value to a water-like value. Students explain why different materials require different amounts of energy for the same temperature change, supporting AP 6.B.1 calorimetry calculations.",
      "Sign convention probe: set the same Sample Mass and Specific Heat Capacity, then compare Temperature Change values of +10°C and -10°C. Students identify which case corresponds to surroundings gaining heat and which process would have positive or negative ΔH_rxn.",
      "Preset comparison: run NaOH+HCl Neutralization, Combustion of Methane, and Ice in Water (Fusion) as three anchor cases. Students classify each as solution calorimetry, combustion calorimetry, or phase-change energy transfer, then cite slider values as evidence.",
      "Initial versus change discussion: choose two different Initial Temperature settings with the same Temperature Change, Sample Mass, and Specific Heat Capacity. Students calculate q for both trials and explain why absolute starting temperature and temperature change are not the same variable.",
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
          "Measure m (Sample Mass in grams), c (Specific Heat Capacity, ≈ 4.184 J/(g·°C) for water), and ΔT (Temperature Change in °C). Calculate q_solution = mcΔT, then q_rxn = −q_solution. Finally ΔH_rxn = q_rxn / n, where n is moles of limiting reagent. Units: joules → divide by 1000 for kJ/mol.",
      },
      {
        question: "Does the mass of the calorimeter itself affect the result?",
        answer:
          "In an ideal coffee-cup calorimeter, the cup is assumed to absorb negligible heat. In reality, the calorimeter has a heat capacity C_cal (J/°C) that must be measured and included: q_rxn = −(q_solution + q_calorimeter). Real lab calorimeters with non-negligible heat capacity require this correction.",
      },
      {
        question: "How does this connect to AP Chemistry standards 6.A.1 and 6.B.1?",
        answer:
          "AP 6.A.1 requires students to explain energy transfer at constant pressure using ΔH. AP 6.B.1 requires calculating ΔH from calorimetry data using q = mcΔT and identifying the system versus surroundings. The Sample Mass, Specific Heat Capacity, and Temperature Change sliders directly support those calculations.",
      },
      {
        question: "Can I use this simulation to understand Hess's Law?",
        answer:
          "Yes — use the presets and slider values as separate calorimetry cases, record each q, and compute each partial ΔH where the reaction amount is known. Because enthalpy is a state function, partial reaction enthalpies can be added algebraically to obtain an overall ΔH. This is the same logic used in multi-step calorimetry and Hess's Law free-response questions.",
      },
    ],
  },
};
