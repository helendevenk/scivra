import type { Experiment } from "@/shared/types/experiment";

export const heatEngines: Experiment = {
  id: "heat-engines",
  slug: "heat-engines-carnot-cycle-efficiency",
  title: "Heat Engines & Carnot Cycle",
  subtitle: "Discover the upper efficiency limit set by the second law of thermodynamics",
  description:
    "Run a Carnot or Otto cycle between hot and cold reservoirs and measure real-time efficiency, net work, and heat flows. The animated P-V diagram traces each step of the cycle while energy Sankey diagrams show where every joule goes. Explore why no real engine can exceed Carnot efficiency and how reservoir temperatures determine the thermodynamic ceiling.",
  thumbnail: "/imgs/experiments/heat-engines.png",

  standards: {
    ngss: ["HS-PS3-4"],
    gcse: ["P2.4"],
    ap: ["TUL-3.A", "TUL-3.B", "TUL-3.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "thermodynamics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["heat engine", "Carnot cycle", "thermodynamics", "efficiency", "second law", "entropy", "AP Physics 2", "Otto cycle"],
  difficulty: "advanced",

  parameters: [
    {
      id: "T_hot",
      label: "Hot Reservoir Temperature",
      unit: "K",
      min: 400,
      max: 1200,
      default: 800,
      step: 10,
      tier: "pro",
    },
    {
      id: "T_cold",
      label: "Cold Reservoir Temperature",
      unit: "K",
      min: 200,
      max: 400,
      default: 300,
      step: 10,
      tier: "pro",
    },
    {
      id: "cycle_type",
      label: "Cycle Type (0=Carnot, 1=Otto)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "max",
    },
    {
      id: "Q_hot",
      label: "Heat Input",
      unit: "J",
      min: 100,
      max: 10000,
      default: 1000,
      step: 100,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "e = \\frac{W_{net}}{Q_H} = 1 - \\frac{Q_C}{Q_H}",
      description: "Thermal efficiency: fraction of heat input converted to work",
    },
    {
      latex: "e_{Carnot} = 1 - \\frac{T_C}{T_H}",
      description: "Carnot efficiency: maximum possible for given reservoir temperatures",
    },
    {
      latex: "W_{net} = Q_H - Q_C",
      description: "Net work equals heat absorbed minus heat rejected",
    },
    {
      latex: "\\text{COP} = \\frac{Q_C}{W}",
      description: "Coefficient of performance for a refrigerator",
    },
  ],

  theory:
    "The second law of thermodynamics places an absolute upper bound on engine efficiency: no heat engine operating between two reservoirs at T_H and T_C can be more efficient than a Carnot engine operating between the same reservoirs. The Carnot cycle consists of two reversible isothermal processes (heat exchange with reservoirs) and two reversible adiabatic processes (no heat exchange). Because all steps are reversible, no entropy is generated — this is the theoretical ideal. Real engines (Otto, Diesel, Rankine) suffer irreversibilities: friction, turbulence, finite temperature differences during heat transfer, and non-quasi-static compression. These generate entropy, increasing Q_C and reducing net work. The gap between actual and Carnot efficiency is a direct measure of irreversibility. Importantly, the Carnot efficiency depends only on the reservoir temperatures — higher T_H or lower T_C always improves it.",

  instructions:
    "Set T_hot and T_cold (Pro). The animated P-V diagram shows the cycle running with color-coded steps: isothermal expansion (red), adiabatic expansion (orange), isothermal compression (blue), adiabatic compression (cyan). The efficiency meter shows actual vs. Carnot values. Adjust Q_hot to scale the cycle. Switch to Otto cycle (Max) to compare with the ideal gas engine used in cars — note the efficiency gap. The Sankey diagram on the right shows heat flows at every cycle.",

  challenges: [
    {
      id: "he-c1",
      question: "A Carnot engine operates with T_H = 800 K and T_C = 400 K. What is its efficiency?",
      hint: "e_Carnot = 1 − T_C/T_H. Substitute values.",
      tier: "pro",
    },
    {
      id: "he-c2",
      question: "Why is the actual efficiency of a gasoline engine always less than the Carnot efficiency for the same temperature range?",
      hint: "Consider friction, heat loss through cylinder walls, and non-quasi-static compression. What do these have in common thermodynamically?",
      tier: "pro",
    },
    {
      id: "he-c3",
      question: "If the cold reservoir temperature is lowered from 300 K to 200 K while T_H stays at 800 K, how does efficiency change?",
      hint: "Calculate e_Carnot for both T_C values and compare. What is the trend?",
      tier: "max",
    },
  ],

  wave: 7,
  tier: "max",
  estimatedTime: 35,
  relatedExperiments: ["fluid-statics", "simple-harmonic-motion"],

  seoTitle: "Heat Engines & Carnot Cycle — Thermodynamics Efficiency Lab | Scivra",
  seoKeywords: [
    "heat engine simulation",
    "Carnot cycle",
    "thermodynamics efficiency",
    "second law of thermodynamics",
    "AP Physics 2 thermodynamics",
    "Otto cycle",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Heat Engines and Carnot Efficiency",
  },

  contentSections: {
    whatIsIt:
      "A heat engine is any device that takes in heat from a hot place, dumps some heat to a cold place, and pockets the difference as useful work. Your car engine fires gasoline at roughly 2500 K, exhausts at maybe 800 K, and turns the temperature gap into motion. A coal plant boils water at high temperature, condenses it at near room temperature, and sells the difference as electricity. Even your body — fueled by oxidation at body temperature, radiating to the cooler air — is a low-grade heat engine. The second law of thermodynamics gives every one of these machines an unbreakable speed limit: no engine running between a hot reservoir at T_H and a cold reservoir at T_C can be more efficient than a Carnot engine, whose efficiency is e = 1 − T_C/T_H. That ceiling is set by entropy, not by clever engineering, which is why even the best modern combined-cycle gas turbines top out around 60% — they cannot beat the Carnot bound. This lab lets you set the two reservoir temperatures, run an idealized Carnot cycle (or compare with the bumpier Otto cycle inside a real car engine), and watch on a live PV diagram exactly where the work and the wasted heat go.",
    parameterExplanations: {
      T_hot:
        "The temperature of the hot reservoir, in kelvin. This is where heat is absorbed by the working gas (combustion in a car, the boiler in a power plant, the sun for a solar-thermal engine). Raising T_hot lifts the Carnot ceiling — every extra kelvin of T_H gives you a little more potential efficiency. Materials limits matter though: turbine blades melt above ~1700 K, which is why real engines do not chase arbitrary T_H.",
      T_cold:
        "The temperature of the cold reservoir, in kelvin, where rejected heat is dumped (the radiator, the cooling tower, the ocean for a marine engine). Lowering T_cold also raises efficiency. The hard constraint is the third law: T_cold can never reach 0 K, so 100% Carnot efficiency is impossible. In practice T_cold is set by the local environment — you cannot cool below the ambient air or river temperature without spending more work.",
      cycle_type:
        "Switches between an idealized Carnot cycle (two isothermal + two adiabatic, fully reversible) and an Otto cycle (two adiabatic + two isochoric, the textbook model of a gasoline engine). Use Carnot to establish the upper bound and Otto to see why a real engine running between the same temperatures gets less work — Otto's heat exchange happens at non-constant temperature, which generates entropy.",
      Q_hot:
        "Total heat absorbed from the hot reservoir per cycle, in joules. Scaling Q_hot scales the loop on the PV diagram and the absolute work output, but does not change efficiency — efficiency depends only on the cycle shape and reservoir temperatures, not on how big you make the loop.",
    },
    misconceptions: [
      {
        wrong:
          "A perfectly built engine could in principle reach 100% efficiency.",
        correct:
          "The second law forbids it. Carnot efficiency e = 1 − T_C/T_H reaches 1 only if T_C = 0 K, and the third law says you cannot cool any system to absolute zero in finite steps. So 100% efficiency is physically impossible, no matter how clever the engineer is.",
      },
      {
        wrong:
          "Heat flows from hot to cold because the cold reservoir attracts heat.",
        correct:
          "Cold does not attract anything. Random molecular collisions statistically transfer energy from high-kinetic-energy regions to low-kinetic-energy regions because there are vastly more microstates with the energy spread out than with it concentrated. The second law is a counting argument about microstates, not a force law.",
      },
      {
        wrong:
          "Temperature and heat mean the same thing — a hotter reservoir has more heat.",
        correct:
          "Temperature is the average kinetic energy per molecule (intensive). Heat is the energy transferred between systems (extensive). A small piece of red-hot iron has high T but little total heat capacity; a swimming pool at 25 °C has lower T but enormous heat capacity. The Carnot formula uses T because it is what sets the available work; the Q_H and Q_C values track how much heat actually moves.",
      },
      {
        wrong:
          "A real gasoline engine fails to reach Carnot efficiency because the engineers haven't done a good enough job.",
        correct:
          "Real engines fall short because their heat-transfer steps happen at finite temperature differences, with friction, turbulence, and rapid (not quasi-static) compression. Each of those is irreversible and generates entropy, which forces extra heat to be rejected to T_cold. The gap between actual and Carnot efficiency is a measurement of total irreversibility, not of laziness.",
      },
      {
        wrong:
          "If you double Q_hot, you double the engine efficiency.",
        correct:
          "Efficiency depends only on the reservoir temperatures, not on the size of the heat input. Doubling Q_hot doubles both Q_cold and the net work. The ratio W/Q_hot stays exactly the same — the loop just gets bigger on the PV diagram.",
      },
    ],
    teacherUseCases: [
      "Carnot ceiling demo: set T_H = 800 K and T_C = 300 K, calculate e_Carnot = 0.625, and compare with the live efficiency readout. Then drop T_C to 200 K and ask students to predict the new efficiency before running it.",
      "Cycle comparison lab: have one team run Carnot and another run Otto between identical reservoirs. Compare the PV areas and Sankey diagrams to make irreversibility visible — the Otto rejects more heat to T_cold for the same Q_hot.",
      "Real-engine context: assign teams to research the actual T_H and T_C of (a) a car engine, (b) a coal-fired power plant, (c) a nuclear plant, (d) a heat pump in heating mode. Compute the Carnot ceiling for each and compare with published real-world numbers.",
      "Refrigerator flip: walk students through running the cycle backward. Use the COP definition Q_C/W to compute the limit on a real fridge or AC. This is also where you can introduce why a heat pump can deliver more thermal energy than the electrical work that drives it.",
      "Misconception probe: ask 'why doesn't your engine just hit 100%?' before the simulation. Use the T_C → 0 K limit and the third law to make the impossibility concrete instead of hand-wavy.",
    ],
    faq: [
      {
        question: "Why is Carnot efficiency only e = 1 − T_C/T_H and not something better?",
        answer:
          "Because the Carnot cycle is reversible. Reversible processes generate zero net entropy, so the only required heat rejection is the minimum needed to balance entropy: Q_C/T_C = Q_H/T_H. Plug into e = 1 − Q_C/Q_H and the temperatures cancel into 1 − T_C/T_H. Any real (irreversible) cycle generates extra entropy and has to dump extra Q_C, which lowers efficiency below the Carnot bound.",
      },
      {
        question: "Can I just keep raising T_hot to push efficiency toward 100%?",
        answer:
          "Mathematically e → 1 as T_H → ∞, but materials cannot survive arbitrarily high temperatures. Modern jet turbine blades fail above ~1700 K even with active cooling. Above that you melt the engine. Real efficiency gains come from clever cycles (combined-cycle, regenerative) more than from cranking T_H.",
      },
      {
        question: "Why does my car engine waste so much fuel as heat?",
        answer:
          "A gasoline engine runs roughly between 2500 K (peak combustion) and 800 K (exhaust). Carnot ceiling for those numbers is about 0.68. Real engines lose efficiency to non-quasi-static compression, friction, heat conducted into the block, finite-time heat transfer, and incomplete combustion. The Otto cycle in this lab gives you the textbook idealization (~50–60%); real engines deliver more like 25–35%.",
      },
      {
        question: "How is a refrigerator related to a heat engine?",
        answer:
          "A refrigerator is a heat engine running backward: you do work W on the working fluid and the fluid moves heat Q_C from the cold interior to the warm room (Q_H = Q_C + W). The figure of merit is the coefficient of performance, COP = Q_C/W. The Carnot bound here is COP_max = T_C/(T_H − T_C). Notice how a smaller temperature gap makes the fridge more efficient, which is why winter heat pumps are great in mild climates but struggle in deep cold.",
      },
      {
        question: "Are heat and temperature the same in the Carnot formula?",
        answer:
          "No, and conflating them is a common mistake. The Q values are heat in joules — energy actually crossing the system boundary. The T values are reservoir temperatures in kelvin — average kinetic energy per particle. Two reservoirs at the same temperature can hold wildly different total energies depending on their heat capacity. Carnot efficiency cares about T because that is what sets the entropy balance, but the engine's work output is set by the Q values.",
      },
      {
        question: "How does this connect to AP Physics 2 standards TUL-3.A through TUL-3.C?",
        answer:
          "AP Physics 2 TUL-3.A asks students to compute thermal efficiency e = W_net/Q_H. TUL-3.B asks them to apply the Carnot formula and recognize it as the maximum possible. TUL-3.C asks them to argue from the second law why no engine can beat Carnot. NGSS HS-PS3-4 expects students to use the law of conservation of energy and the second law to predict energy flows. This lab puts all three on a live PV diagram and Sankey chart.",
      },
    ],
  },
};
