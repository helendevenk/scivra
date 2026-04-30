import type { Experiment } from "@/shared/types/experiment";

export const idealGasThermodynamics: Experiment = {
  id: "ideal-gas-thermodynamics",
  slug: "ideal-gas-law-pv-diagrams",
  title: "Ideal Gas Law & PV Diagrams",
  subtitle: "Visualize isothermal, isobaric, isochoric, and adiabatic processes",
  description:
    "Manipulate temperature, pressure, and volume of an ideal gas while tracking the state on a live PV diagram. Switch between thermodynamic processes and observe how the First Law of Thermodynamics governs each path.",
  thumbnail: "/imgs/experiments/ideal-gas-thermodynamics.png",

  standards: {
    ngss: ["HS-PS3-1", "HS-PS3-2"],
    gcse: ["P3.1", "P3.2"],
    ap: ["TUL-1.A", "TUL-1.B", "TUL-2.A"],
  },
  primaryStandard: "ap-physics-2",
  category: "thermodynamics",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "ideal gas law",
    "PV diagram",
    "isothermal",
    "isobaric",
    "isochoric",
    "adiabatic",
    "thermodynamics",
    "first law",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "temperature",
      label: "Temperature",
      unit: "K",
      min: 100,
      max: 1000,
      default: 300,
      step: 10,
      tier: "free",
    },
    {
      id: "pressure",
      label: "Pressure",
      unit: "atm",
      min: 0.1,
      max: 10,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "process_type",
      label: "Process (0=Isothermal, 1=Isobaric, 2=Isochoric, 3=Adiabatic)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "moles",
      label: "Amount",
      unit: "mol",
      min: 0.1,
      max: 2,
      default: 1,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "PV = nRT \\quad (R = 8.314\\,\\text{J·mol}^{-1}\\text{K}^{-1})",
      description: "Ideal Gas Law",
    },
    {
      latex: "W = P\\Delta V",
      description: "Work done in isobaric process",
    },
    {
      latex: "W = nRT\\ln\\!\\left(\\frac{V_2}{V_1}\\right)",
      description: "Work done in isothermal process",
    },
    {
      latex: "\\Delta U = Q - W",
      description: "First Law of Thermodynamics",
    },
  ],

  theory:
    "An ideal gas obeys PV = nRT, where R = 8.314 J·mol⁻¹K⁻¹. The four standard thermodynamic processes differ in which state variable is held constant: isothermal (T constant, PV = const), isobaric (P constant, V ∝ T), isochoric (V constant, P ∝ T), and adiabatic (no heat exchange, Q = 0). The PV diagram area under each curve equals the work done by the gas.",
  instructions:
    "Select a process type with the slider, then adjust temperature or pressure to drive the gas through the process. Watch the PV diagram update in real time. Unlock Pro mode to vary the number of moles and compare how different amounts of gas scale the diagram.",

  challenges: [
    {
      id: "igt-c1",
      question: "In an isothermal compression from 4 L to 2 L, what happens to pressure?",
      hint: "Use PV = constant for an isothermal process",
      tier: "free",
    },
    {
      id: "igt-c2",
      question: "An isobaric process heats the gas from 300 K to 600 K. How does volume change?",
      hint: "At constant pressure, V is proportional to T",
      tier: "free",
    },
    {
      id: "igt-c3",
      question: "Which of the four processes does the most work on a PV diagram for the same initial and final states?",
      hint: "Compare the area under each curve on the PV diagram",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["roller-coaster", "simple-harmonic-motion", "fluid-statics"],

  seoTitle: "Ideal Gas Law & PV Diagrams — Interactive Thermodynamics Simulation | Scivra",
  seoKeywords: [
    "ideal gas law",
    "PV diagram",
    "thermodynamics simulation",
    "isothermal process",
    "adiabatic process",
    "AP Physics thermodynamics",
    "first law of thermodynamics",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Ideal Gas Law and Thermodynamic Processes",
  },

  contentSections: {
    whatIsIt:
      "Almost every gas you meet — air in a bike pump, helium in a balloon, steam pushing a piston — obeys PV = nRT. Push the gas through different processes (heat at constant pressure, squeeze at constant temperature, lock the volume, or compress so fast no heat escapes) and the path on a pressure-volume diagram changes shape, but PV = nRT holds at every point. The PV diagram is the bookkeeping tool engineers use to design engines, refrigerators, and rocket nozzles, because the area enclosed by a closed loop equals net work done by the gas. This lab lets you pick one of four canonical processes — isothermal, isobaric, isochoric, or adiabatic — set the starting state, and watch the gas evolve while the PV diagram updates. The First Law ΔU = Q − W stays on screen so you can track how heat, work, and internal energy trade off.",
    parameterExplanations: {
      temperature:
        "Absolute temperature of the gas in kelvin. Kelvin matters because PV = nRT uses absolute temperature; doubling T from 300 K to 600 K really does double PV, but doubling from 27 °C to 54 °C does not. In an isothermal process T is locked, so changes in P and V trade off along a hyperbola. In adiabatic compression T rises even though no heat is added, because the work done on the gas raises its internal energy.",
      pressure:
        "Pressure of the gas in atmospheres (1 atm ≈ 101 kPa). On the PV diagram, pressure is the vertical axis. In an isobaric process P is constant — the path is a horizontal line, and the work done is just W = PΔV. Isothermal and adiabatic curves both bend, but the adiabatic is steeper because the gas's temperature drops as it expands.",
      process_type:
        "Selects which thermodynamic process you're running: 0 = isothermal (T constant, the curve is a hyperbola PV = const), 1 = isobaric (P constant, horizontal line, W = PΔV), 2 = isochoric (V constant, vertical line, W = 0), 3 = adiabatic (no heat exchange, Q = 0, the curve PV^γ = const is steeper than the isotherm). For the same start-and-end states, each process encloses a different area, so each delivers a different amount of work.",
      moles:
        "Amount of gas in moles, scaling the entire diagram through PV = nRT. Doubling n at fixed T and P doubles V; the PV curve shifts outward without changing shape. Useful for comparing how a 1 mol cylinder behaves vs. a 0.1 mol research sample — the physics is identical, only the scale changes.",
    },
    misconceptions: [
      {
        wrong:
          "PV = nRT only works for air, since that's what we tested in class.",
        correct:
          "PV = nRT works for any ideal gas, meaning any gas whose molecules don't strongly interact and have negligible volume compared to the container. Helium, hydrogen, methane, and pure nitrogen all obey it almost perfectly at normal conditions. Real gases deviate at high pressure or low temperature, where intermolecular forces and finite molecular volume matter — which is why you need the van der Waals correction near phase transitions.",
      },
      {
        wrong:
          "An adiabatic process means there is no temperature change because no heat is added.",
        correct:
          "Adiabatic means Q = 0, not ΔT = 0. The First Law ΔU = Q − W becomes ΔU = −W, so any work done by or on the gas changes its internal energy and therefore its temperature. Adiabatic compression heats the gas (which is why a bike pump warms up); adiabatic expansion cools it (which is why escaping CO₂ from a cylinder forms ice).",
      },
      {
        wrong:
          "Heat and temperature are the same — adding heat is the same as raising temperature.",
        correct:
          "Temperature is the average kinetic energy per molecule (intensive); heat is energy in transit between systems (extensive). A pot of boiling water at 373 K and a kettle of boiling water at 373 K are at the same temperature, but the pot holds more thermal energy. During isothermal expansion, heat is added to the gas without raising its temperature at all — the energy goes into doing work on the surroundings.",
      },
      {
        wrong:
          "Work is just W = PΔV regardless of what process you use.",
        correct:
          "W = PΔV only when pressure is constant (isobaric process). For isothermal expansion W = nRT ln(V₂/V₁), and for adiabatic processes W = (P₁V₁ − P₂V₂)/(γ−1). The general rule is always W = ∫P dV, which equals the area under the curve on a PV diagram — different paths between the same two states give different work.",
      },
      {
        wrong:
          "On a PV diagram, the gas's temperature is the same at every point on the curve.",
        correct:
          "Only along an isotherm. On any other path the temperature changes from point to point, even if the path looks innocuous. To find T at any point on a PV diagram, use PV = nRT — the product P·V is the temperature in disguise (scaled by nR).",
      },
    ],
    teacherUseCases: [
      "Process derby: assign each lab group one process (isothermal, isobaric, isochoric, adiabatic) starting and ending at the same two states. Have them compute the work done by reading the area off the PV diagram and compare answers. Students rediscover that work depends on path, not on endpoints.",
      "First-law accounting: at each step of the simulation, have students fill in a 4-column table — Q, W, ΔU, ΔT — for each process. Use the entries to discover that for isochoric W = 0, for adiabatic Q = 0, for isothermal ΔU = 0, and for isobaric every term can be nonzero.",
      "Bike pump demo: set the simulation to adiabatic compression, then have students hand-hold a bike pump and feel the barrel warm up after a few fast strokes. Connect the felt experience to the simulation's temperature readout.",
      "Pre-engine introduction: run a closed cycle of two isobaric and two isochoric segments to show students a 'rectangular' engine cycle. Ask them to compute the area enclosed and use it as the bridge into the heat-engine lab.",
      "Misconception probe: pause the simulation mid-isothermal expansion and ask 'is heat being added?' Many students will say no because the temperature doesn't change. Use ΔU = Q − W to show that Q must equal W when ΔU = 0.",
    ],
    faq: [
      {
        question: "Why does temperature drop during an adiabatic expansion if no heat leaves the gas?",
        answer:
          "Because the gas does work on its surroundings while no heat replaces the lost energy. The First Law ΔU = Q − W with Q = 0 gives ΔU = −W. Internal energy of an ideal gas is proportional to T, so if W > 0 (gas pushes piston out), U falls and T falls. This is why fog forms on a cold soda bottle when you suddenly release the cap — the gas cools rapidly as it expands.",
      },
      {
        question: "How do I read work off a PV diagram?",
        answer:
          "The work done by the gas equals the area under the PV curve from V₁ to V₂. Above-the-axis = work done by the gas (positive), below-the-axis movement (V₂ < V₁) = work done on the gas (negative). For a closed cycle, the area enclosed by the loop equals the net work per cycle. That is the geometric reason the PV diagram is the standard engineering tool for heat engines.",
      },
      {
        question: "Why is PV = nRT called the 'ideal' gas law? When does it fail?",
        answer:
          "It assumes molecules have zero volume and don't attract or repel each other. Both assumptions break at high pressure (molecules get crowded) and low temperature (intermolecular forces become comparable to kinetic energy). Real gases obey corrections like the van der Waals equation (P + a/V²)(V − b) = nRT under those conditions. For typical AP problems near room temperature and 1 atm, the deviations are under a few percent.",
      },
      {
        question: "What is the difference between isothermal and adiabatic compression?",
        answer:
          "Both compress the gas, but in different ways. Isothermal compression is slow enough that heat leaves the gas to keep T constant — Q is negative, W is negative, ΔU = 0. Adiabatic compression is fast enough that no heat escapes — Q = 0, W is negative, ΔU is positive, T rises. On a PV diagram, the adiabatic curve PV^γ = const is steeper than the isotherm PV = const through the same point.",
      },
      {
        question: "Why does the gas do less work along an adiabatic curve than an isothermal one between the same volumes?",
        answer:
          "Because in adiabatic expansion the gas cools as it expands (no heat replenishes the lost internal energy), so its pressure drops faster with volume than in the isothermal case. Lower pressure at every step → less area under the curve → less work delivered. The gap between the two curves on a PV diagram is exactly the heat that would have been added in the isothermal case.",
      },
      {
        question: "How does this connect to AP Physics 2 standards TUL-1.A, TUL-1.B, and TUL-2.A?",
        answer:
          "TUL-1.A asks students to apply PV = nRT to relate state variables, TUL-1.B asks them to identify and characterize the four canonical processes, and TUL-2.A asks them to apply the First Law ΔU = Q − W to those processes and compute heat, work, and internal-energy changes. NGSS HS-PS3-1 and HS-PS3-2 also expect students to use mathematical models for energy transfer. The PV diagram in this lab makes all of those criteria visible at the same time.",
      },
    ],
  },
};
