import type { Experiment } from "@/shared/types/experiment";

export const statesOfMatterBasics: Experiment = {
  id: "states-of-matter-basics",
  slug: "states-of-matter-basics-phase-transitions",
  title: "States of Matter: Basics",
  subtitle: "Explore solid, liquid, and gas at the molecular level",
  description:
    "Heat or cool a substance and watch molecules transition between solid, liquid, and gas states. Observe melting, freezing, evaporation, and condensation at the particle level.",
  thumbnail: "/imgs/experiments/ideal-gas-thermodynamics.png",

  standards: {
    ngss: ["HS-PS1-3", "HS-PS3-2"],
    gcse: ["AQA C3.4"],
    ap: ["TDE-3.A", "TDE-3.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "thermodynamics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["states of matter", "phase transitions", "solid liquid gas", "molecular motion", "melting boiling", "temperature"],
  difficulty: "beginner",

  parameters: [
    { id: "temperature", label: "Temperature", unit: "K", min: 50, max: 1000, default: 300, step: 5, tier: "free" },
    { id: "substance", label: "Substance", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "KE_{avg} = \\frac{3}{2}k_B T", description: "Average kinetic energy of molecules" },
    { latex: "Q = mL", description: "Latent heat during phase transition" },
  ],

  theory:
    "Matter exists in solid, liquid, and gas phases depending on temperature and pressure. In a solid, molecules vibrate around fixed positions; in a liquid, they flow past each other; in a gas, they move freely. Phase transitions require energy (latent heat) without temperature change — energy breaks intermolecular bonds. The kinetic energy of molecules is proportional to absolute temperature (KE = 3/2 k_B T).",
  instructions:
    "Use the temperature slider to heat or cool the substance. Watch how molecular motion changes with temperature. Observe the phase transition: molecules break free from their lattice at the melting point and escape the liquid at the boiling point. The temperature-time graph shows the plateau during phase changes.",
  challenges: [
    { id: "smb-c1", question: "Why does temperature stay constant during a phase transition even as heat is added?", hint: "Energy goes into breaking intermolecular bonds (latent heat), not increasing KE", tier: "free" },
    { id: "smb-c2", question: "Why do gases expand to fill their container but liquids don't?", hint: "Gas molecules have enough KE to overcome intermolecular attractions; liquid molecules don't", tier: "free" },
    { id: "smb-c3", question: "Why does sweating cool you down? (evaporation)", hint: "Evaporation requires latent heat — energy is taken from your body, lowering its temperature", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["gases-intro", "ideal-gas-thermodynamics", "diffusion"],

  seoTitle: "States of Matter Basics — Phase Transitions | AP Physics 2",
  seoKeywords: ["states of matter", "phase transitions", "solid liquid gas", "molecular motion", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "States of Matter, Phase Transitions, Molecular Motion" },

  contentSections: {
    whatIsIt:
      "An ice cube on the counter, water boiling in a kettle, dry ice fogging on a stage — three demonstrations of one idea: matter exists in different phases depending on how much kinetic energy its molecules have versus the bonds holding them. In a solid, molecules vibrate around fixed lattice positions. Add heat and average kinetic energy climbs (KE_avg = (3/2)k_B T) until molecules break loose — that's melting, and temperature pauses while bonds rearrange. Keep heating and molecules eventually escape the surface — that's boiling, with another plateau. The energy spent on rearrangements is latent heat, why boiling water stays at 100 °C until every drop vaporizes. This lab lets you pick a substance, drag a temperature slider from frozen-solid to gas-phase chaos, and watch the molecular level in real time. The temperature-time graph shows the characteristic plateau during phase transitions.",
    parameterExplanations: {
      temperature:
        "Absolute temperature in kelvin. Kelvin is required because molecular kinetic energy is proportional to T (KE_avg = (3/2)k_B T), and that proportionality only makes sense from absolute zero. Drag the slider through the substance's melting and boiling points to watch phase transitions; notice how temperature pauses at each transition even as energy keeps flowing in — the latent heat going into bond breaking.",
      substance:
        "Which material you're working with — water, nitrogen, oxygen, or argon, each with its own melting and boiling points. Water (mp 273 K, bp 373 K) is the everyday baseline. Nitrogen (bp 77 K) is what makes liquid-nitrogen demos possible. The exact transition temperatures depend on intermolecular forces: hydrogen-bonded water needs much more energy to vaporize than weakly-attracted argon, even though both are simple molecules.",
    },
    misconceptions: [
      {
        wrong:
          "When ice melts, it must be getting hotter — heat always raises temperature.",
        correct:
          "During a phase transition, added heat goes into breaking intermolecular bonds, not into raising temperature. Ice and water can coexist at exactly 273.15 K for as long as it takes the latent heat of fusion (334 J/g) to do its work. Only after the last bit of ice has melted does the temperature start climbing again.",
      },
      {
        wrong:
          "Heat and temperature are the same thing — a higher temperature means more heat.",
        correct:
          "Temperature is the average kinetic energy per molecule (intensive); heat is total energy transferred (extensive). A red-hot iron nail and a glass of room-temperature water can hold very different amounts of thermal energy: drop the nail in the water and the water barely warms because its huge heat capacity dominates. The phase-change plateau is exactly where heat flows in but temperature doesn't change.",
      },
      {
        wrong:
          "Gases expand because their molecules repel each other.",
        correct:
          "Gas molecules barely interact at typical conditions. Gases fill their container because each molecule has enough kinetic energy to fly in a straight line until it bounces off something. There's no repulsive force pushing them apart — they simply move freely until the walls stop them.",
      },
      {
        wrong:
          "Water freezes at exactly 0 °C everywhere — pressure doesn't matter.",
        correct:
          "Water's freezing point depends on pressure. Increasing pressure lowers water's melting point slightly (a quirky property of water — most substances do the opposite). At 100 atm pressure, water freezes around -1 °C. This is also why ice skating works on a real rink: the blade locally raises pressure, helping create a thin liquid film. At very low pressure (top of Mount Everest, ~0.3 atm), water boils around 70 °C.",
      },
      {
        wrong:
          "Sublimation only happens to dry ice — water can't go directly from solid to gas.",
        correct:
          "Water sublimates whenever its vapor pressure exceeds its solid surface vapor pressure — which happens at low pressure and low temperature. That's how snow disappears in cold dry weather without melting first, how freeze-drying works, and why ice cubes shrink in a cold freezer over months. Dry ice is just the most dramatic example because CO₂ has no liquid phase at atmospheric pressure.",
      },
    ],
    teacherUseCases: [
      "Heating-curve lab: have students set the substance to water at 250 K and slowly heat through 400 K while logging temperature every 10 K. They should plot T vs. heat added and identify two plateaus (melting at 273 K, boiling at 373 K). Use the plateaus to introduce latent heat numerically.",
      "Substance comparison: assign each group a different substance and ask them to compare melting and boiling points. Connect the differences to intermolecular forces — water's huge boiling point versus argon's tiny one is a direct measure of hydrogen bonding.",
      "Sweating discussion: ask 'why does sweat cool you down?' before running the simulation. Use the latent heat of vaporization to argue that each evaporated water molecule carries away a substantial chunk of energy, cooling the skin it leaves behind.",
      "Pre-engine introduction: connect the gas-phase simulation to the next unit on PV = nRT and PV diagrams — once molecules are flying freely, you've arrived at the conditions for the ideal gas law to apply.",
      "Misconception probe: pause the simulation at the melting plateau and ask 'is heat being added to the ice right now?' Many students will say no because the temperature isn't changing. Use the latent-heat answer to drive home the difference between heat and temperature.",
    ],
    faq: [
      {
        question: "Why does temperature stay constant during a phase transition even when heat is being added?",
        answer:
          "Because the added energy is going into breaking the intermolecular bonds that hold the lower-energy phase together, not into speeding up the molecules. For ice melting at 273 K it takes 334 J per gram of ice (the latent heat of fusion) before any temperature rise begins. The plateau on a heating curve is a direct measurement of latent heat.",
      },
      {
        question: "Why do gases expand to fill their container but liquids don't?",
        answer:
          "It's about intermolecular bonds vs. kinetic energy. In a gas, each molecule's kinetic energy far exceeds the energy of any attractive interaction, so molecules fly freely until they hit the walls. In a liquid, molecules have enough KE to flow past each other but not enough to escape — surface tension and molecular cohesion hold them in a puddle that conforms to its container's shape but not its volume.",
      },
      {
        question: "Why does sweating cool you down?",
        answer:
          "Evaporation requires latent heat — the energy to break the hydrogen bonds holding water molecules in the liquid. That energy comes from your skin. For water, the latent heat of vaporization is 2260 J/g, so one gram of evaporated sweat takes away enough energy to drop the temperature of about 540 g of skin by 1 °C. This is also why a fan cools you (faster evaporation) and why high humidity feels miserable (slow evaporation).",
      },
      {
        question: "Why is water special — why does it have such a high boiling point?",
        answer:
          "Hydrogen bonding. Water molecules form a network of hydrogen bonds that are unusually strong for intermolecular forces. Compare water (bp 373 K, mw 18) with methane (bp 112 K, mw 16) — same size, but methane has only weak van der Waals forces. Hydrogen bonding also makes ice less dense than liquid water (so ice floats), gives water a huge specific heat, and lets it dissolve a wide range of substances.",
      },
      {
        question: "Can a substance be in two phases at once?",
        answer:
          "Yes — at the melting and boiling points exactly, two phases coexist in equilibrium. There's also a special triple point where solid, liquid, and gas coexist together. For water the triple point is 273.16 K and 0.006 atm. Beyond a critical point (647 K and 218 atm for water), the distinction between liquid and gas disappears entirely — that's the supercritical fluid regime used in industrial processes like coffee decaffeination.",
      },
      {
        question: "How does this connect to AP Physics 2 standards TDE-3.A and TDE-3.B?",
        answer:
          "AP Physics 2 TDE-3.A asks students to describe how molecular-level motion changes between solid, liquid, and gas phases. TDE-3.B asks them to apply latent heat (Q = mL) to compute energy required for phase transitions and explain why temperature plateaus during them. NGSS HS-PS1-3 expects students to plan an investigation of forces between particles in different phases, and HS-PS3-2 expects them to use mathematical models of energy transfer. This lab makes all four expectations visible at once.",
      },
    ],
  },
};
