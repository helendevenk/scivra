import type { Experiment } from "@/shared/types/experiment";

export const gasesIntro: Experiment = {
  id: "gases-intro",
  slug: "gases-intro-ideal-gas-law",
  title: "Gases: Introduction",
  subtitle: "Explore pressure, volume, temperature, and the Ideal Gas Law",
  description:
    "Pump gas molecules into a container and observe pressure, volume, and temperature. Verify Boyle's Law, Charles's Law, and the combined Ideal Gas Law with interactive controls.",
  thumbnail: "/imgs/experiments/ideal-gas-thermodynamics.png",

  standards: {
    ngss: ["HS-PS3-2"],
    gcse: ["AQA C3.5", "AQA P8.3"],
    ap: ["TDE-1.A", "TDE-1.B", "TDE-1.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "thermodynamics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["ideal gas law", "pressure", "volume", "temperature", "Boyle's law", "Charles's law"],
  difficulty: "beginner",

  parameters: [
    { id: "num_molecules", label: "Molecules", unit: "", min: 10, max: 500, default: 100, step: 10, tier: "free" },
    { id: "temperature", label: "Temperature", unit: "K", min: 100, max: 1000, default: 300, step: 10, tier: "free" },
    { id: "volume", label: "Container Width", unit: "nm", min: 1, max: 20, default: 10, step: 0.5, tier: "free" },
  ],

  formulas: [
    { latex: "PV = nRT", description: "Ideal Gas Law" },
    { latex: "P \\propto \\frac{1}{V}", description: "Boyle's Law (constant T)" },
    { latex: "V \\propto T", description: "Charles's Law (constant P)" },
  ],

  theory:
    "The Ideal Gas Law PV = nRT relates pressure, volume, amount (moles), and temperature of an ideal gas. Boyle's Law (constant T): pressure and volume are inversely proportional. Charles's Law (constant P): volume and temperature are directly proportional. Real gases deviate from ideal behavior at high pressures and low temperatures when intermolecular forces become significant.",
  instructions:
    "Add or remove molecules using the pump. Adjust temperature using the heater/cooler. Change container volume by dragging the wall. Observe how pressure changes as you hold different variables constant to verify gas laws.",
  challenges: [
    { id: "gi-c1", question: "If you halve the volume at constant temperature, what happens to pressure?", hint: "Boyle's Law: PV = const → P doubles", tier: "free" },
    { id: "gi-c2", question: "At 300K the gas occupies 10L. What volume at 600K (constant pressure)?", hint: "Charles's Law: V₁/T₁ = V₂/T₂ → V₂ = 20L", tier: "free" },
    { id: "gi-c3", question: "Why does a sealed balloon shrink in a cold room?", hint: "Constant n and P → V ∝ T; lower T means smaller V", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["ideal-gas-thermodynamics", "heat-engines", "states-of-matter-basics"],

  seoTitle: "Gases Introduction — Ideal Gas Law Simulation | AP Physics 2",
  seoKeywords: ["ideal gas law", "Boyle's law", "Charles's law", "pressure volume temperature", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Ideal Gas Law, Boyle's Law, Charles's Law" },

  contentSections: {
    whatIsIt:
      "Pump up a bike tire on a hot day and the gauge climbs before you start riding. Watch a balloon shrivel when you carry it from the porch into the freezer. Every such observation is the same equation in disguise: PV = nRT. Pressure, volume, and absolute temperature of any low-pressure gas are locked together by the number of molecules and a single constant R = 8.314 J/(mol·K). Squeeze the container and pressure rises (Boyle). Heat at constant pressure and volume rises (Charles). Add more molecules at fixed volume and pressure rises. This lab lets you pump molecules into a transparent box, drag the wall to change volume, and click a heater to change temperature, while watching the pressure gauge respond. Hold any one of P, V, T, or n constant and see what the others do — rebuilding Boyle, Charles, Gay-Lussac, and Avogadro from molecular collisions.",
    parameterExplanations: {
      num_molecules:
        "Number of gas particles in the box. More molecules means more wall collisions per second, which means higher pressure at fixed V and T. Doubling the molecules doubles the pressure (this is Avogadro's relationship hidden inside PV = nRT). Notice how pressure climbs the moment you click the pump, before the temperature has any chance to react.",
      temperature:
        "Absolute temperature of the gas in kelvin. Kelvin matters because PV = nRT requires absolute temperature; doubling from 300 K to 600 K really does double pressure at fixed V and n, but doubling from 27 °C to 54 °C does not (those are 300 K vs. 327 K, only about 9% increase). Higher T means faster molecules — they hit the walls harder and more often.",
      volume:
        "Container width in nanometers, controlling the volume of the gas. Boyle's Law: at constant T and n, halving V doubles P, because the same molecules now have less room to spread out and hit the walls more often. Watch the molecules visibly speed up their collision rate against the closing wall as you compress.",
    },
    misconceptions: [
      {
        wrong:
          "Pressure comes from the gas pushing harder when it gets denser, like a spring.",
        correct:
          "Pressure comes from molecular collisions. Each molecule that bounces off the wall delivers a tiny impulse; pressure is the time-averaged sum of those impulses divided by area. Denser gas has more molecules to collide more often, so pressure rises — but the mechanism is collisions, not spring-like compression.",
      },
      {
        wrong:
          "Gas temperature is just how hot the container feels.",
        correct:
          "Temperature is the average kinetic energy per molecule, KE_avg = (3/2) k_B T. Two boxes with different gases at the same T have molecules with the same average KE, but the heavier gas moves slower because KE = ½mv². The container 'feels hot' only because heat (energy in transit) is flowing from the gas to your hand.",
      },
      {
        wrong:
          "Heat and temperature mean the same thing — a hotter gas has more heat.",
        correct:
          "Temperature is the average KE per molecule (intensive); heat is the energy transferred between systems (extensive). A small balloon at 350 K and a swimming pool of air at 350 K are at the same temperature, but the pool contains far more thermal energy. PV = nRT uses temperature because that is what controls pressure per molecule, not total heat content.",
      },
      {
        wrong:
          "If you heat a sealed balloon, the volume stays the same because it can't expand.",
        correct:
          "A balloon's wall is flexible and pushes back at roughly atmospheric pressure. As you heat it, P would rise at fixed V — but the balloon expands until P drops back to atmospheric. So at constant external pressure, V ∝ T (Charles's Law). A truly rigid sealed steel cylinder would keep V fixed; in that case P would rise with T (Gay-Lussac's Law).",
      },
      {
        wrong:
          "PV = nRT works only at exactly 1 atm and 25 °C.",
        correct:
          "It works over an enormous range of conditions for any gas whose molecules are sparse enough to ignore intermolecular forces. Real gases deviate noticeably at high pressure (above ~10 atm) or near condensation temperatures, but at typical atmospheric and laboratory conditions PV = nRT is accurate to better than 1% for most gases.",
      },
    ],
    teacherUseCases: [
      "Boyle's Law verification: have students fix temperature and number of molecules, then record P at five different volumes. Plot P vs. 1/V — the points should land on a straight line through the origin. This is also a great place to introduce linearization of nonlinear relationships.",
      "Charles's Law lab: hold pressure constant by letting students adjust the wall position to keep the gauge fixed, then vary temperature in 100 K steps and record the volume at each. Plotting V vs. T should give a line that extrapolates to V = 0 at 0 K — a sneaky introduction to absolute zero.",
      "Hot-air balloon explainer: set up a constant-pressure scenario and ask students to predict whether heating the gas inside makes a balloon rise. Connect the simulation to real hot-air balloons (the air inside is less dense than outside because PV = nRT at constant P).",
      "Cold-day tire pressure: pre-lab discussion — why does your car's low-tire-pressure light come on the first cold morning of fall? Students predict, then run constant-V cooling in the simulation to see the gauge drop.",
      "Misconception probe: ask the class 'if I double the temperature in Celsius, do I double the pressure?' before running the experiment. Use the result (30 °C → 60 °C is only 303 K → 333 K, ~10% pressure rise) to drive home why kelvin is required.",
    ],
    faq: [
      {
        question: "Why does pressure double when you halve the volume?",
        answer:
          "At constant T and n, the molecules are still moving at the same average speed, but they only have half the room. Each molecule hits the walls twice as often, so the pressure (force per area, time-averaged) doubles. Mathematically, PV = const for fixed T and n — that's Boyle's Law, derived directly from collision counting.",
      },
      {
        question: "Why must I use kelvin in PV = nRT, not Celsius?",
        answer:
          "Because the equation says P is proportional to T, and that proportionality only works from absolute zero. At 0 K molecules have minimum kinetic energy, so PV would be zero — fine in kelvin, but in Celsius it would mean PV → 0 at 0 °C, which is nonsense (gases at 0 °C definitely have pressure). Always convert: T(K) = T(°C) + 273.15.",
      },
      {
        question: "Why does a sealed balloon shrink in a cold room?",
        answer:
          "A balloon adjusts its volume to keep internal pressure equal to atmospheric pressure. With n and P fixed, V is proportional to T — that's Charles's Law. Cool from 295 K (room) to 250 K (cold cellar) and the volume drops by about 15%. Pop one in liquid nitrogen at 77 K and the balloon all but disappears, then re-inflates as it warms.",
      },
      {
        question: "When does PV = nRT stop working?",
        answer:
          "Two regimes: very high pressures (where finite molecular volume matters — molecules can't be compressed past their own size) and very low temperatures (where intermolecular attractions become comparable to kinetic energy). Real gases obey corrections like the van der Waals equation (P + an²/V²)(V − nb) = nRT in those regimes. For typical AP problems near room temperature and 1 atm the ideal gas law is accurate to within a percent or two.",
      },
      {
        question: "How is gas temperature related to molecular speed?",
        answer:
          "Average translational kinetic energy is (3/2) k_B T. So at the same T, lighter molecules move faster (KE = ½mv² → v_avg ∝ 1/√m). Hydrogen at room temperature averages ~1900 m/s; oxygen averages ~480 m/s. This is also why hot air balloons work and why hydrogen leaks out of containers faster than nitrogen.",
      },
      {
        question: "How does this connect to AP Physics 2 standards TDE-1.A, TDE-1.B, and TDE-1.C?",
        answer:
          "AP Physics 2 TDE-1.A asks students to relate macroscopic state variables (P, V, T, n) using PV = nRT. TDE-1.B asks them to derive Boyle's, Charles's, and Avogadro's Laws as special cases. TDE-1.C asks them to connect macroscopic pressure to microscopic collisions via kinetic theory. NGSS HS-PS3-2 also expects students to develop and use models that relate energy transfer to motion of particles. This lab makes the macroscopic and microscopic views visible side by side.",
      },
    ],
  },
};
