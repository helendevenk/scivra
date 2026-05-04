import type { Experiment } from "@/shared/types/experiment";

export const gasProperties: Experiment = {
  id: "gas-properties",
  slug: "gas-properties",
  title: "Gas Properties",
  subtitle: "Pressure, volume, temperature, and the ideal gas law",
  description:
    "Simulate gas behavior at the molecular level. Adjust temperature, volume, and particle count to observe changes in pressure. Watch particles collide with container walls, plot P-V and P-T diagrams, and verify PV = nRT experimentally.",
  thumbnail: "/imgs/experiments/gas-properties.png",

  standards: {
    ngss: ["HS-PS3-2"],
    gcse: [],
    ap: ["9.A.1", "9.B.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "9-12",
  tags: [
    "gas laws",
    "ideal gas law",
    "PV=nRT",
    "Boyle's Law",
    "Charles's Law",
    "kinetic molecular theory",
    "AP Chemistry",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "temperature",
      label: "Temperature",
      unit: "K",
      min: 50,
      max: 1000,
      default: 273,
      step: 1,
      tier: "free",
    },
    {
      id: "volume",
      label: "Volume",
      unit: "L",
      min: 1,
      max: 20,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "particles",
      label: "Particles",
      unit: "particles",
      min: 1,
      max: 20,
      default: 5,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "PV = nRT",
      description:
        "Ideal Gas Law: P = pressure (atm), V = volume (L), n = moles, R = 0.08206 L·atm/(mol·K), T = temperature (K)",
    },
    {
      latex: "KE_{\\text{avg}} = \\frac{3}{2} k_B T",
      description:
        "Average kinetic energy per particle is proportional to temperature. k_B = 1.38 × 10⁻²³ J/K",
    },
  ],

  theory:
    "The ideal gas law PV = nRT relates pressure, volume, amount, and temperature of a gas. At the molecular level, pressure arises from particles colliding with container walls. Temperature is proportional to average kinetic energy. Boyle's Law (P ∝ 1/V at constant T,n) can be observed by changing volume. Charles's Law (V ∝ T at constant P,n) relates volume to temperature. Gay-Lussac's Law (P ∝ T at constant V,n) shows pressure increases with temperature. Deviations from ideal behavior occur at high pressure (small volume) or low temperature, where intermolecular forces become significant.",

  instructions:
    "Use the three sliders to adjust temperature, volume, and particle count, then compare the Ideal Gas (STP), High Temperature, and Real Gas (vdW) presets. Watch particle motion and pressure respond as you change one variable at a time.",

  challenges: [
    {
      id: "gp-c1",
      question: "If you halve the volume at constant T and n, what happens to pressure?",
      hint: "Boyle's Law: P₁V₁ = P₂V₂ → pressure doubles.",
      tier: "free",
    },
    {
      id: "gp-c2",
      question: "At 300 K, 1 mol of gas in 10 L: what is the pressure?",
      hint: "P = nRT/V = (1)(0.08206)(300)/10 = 2.46 atm",
      tier: "free",
    },
    {
      id: "gp-c3",
      question: "Why do real gases deviate from PV=nRT at very high pressures?",
      hint: "At high P, particle volume is not negligible and intermolecular forces matter (van der Waals corrections).",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["ideal-gas-thermodynamics", "calorimetry"],
  htmlPath: "/experiments/ap-chemistry/gas-properties.html",

  seoTitle: "Gas Properties Interactive Simulation | Scivra AP Chemistry",
  seoKeywords: [
    "gas laws simulation",
    "PV=nRT interactive",
    "ideal gas law virtual lab",
    "Boyle's Law simulator",
    "kinetic molecular theory",
    "AP Chemistry gas properties",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Ideal Gas Law and Kinetic Molecular Theory",
  },
  htmlControlAliases: { temperature: "sl-T", volume: "sl-V", particles: "sl-n" },
  presets: [
    {
      id: "stp",
      label: "Ideal Gas (STP)",
      description:
        "Sets up a standard-temperature-and-pressure comparison point for an ideal gas. Use it as a baseline before changing volume, temperature, or particle count.",
    },
    {
      id: "hot",
      label: "High Temperature",
      description:
        "Raises the gas temperature so particles move faster and collide more energetically with the walls. Compare pressure against the STP preset while keeping volume and particles in view.",
    },
    {
      id: "real",
      label: "Real Gas (vdW)",
      description:
        "Switches to a real-gas comparison using van der Waals behavior. It is useful for discussing why finite particle size and attraction can make gases deviate from PV = nRT.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Gas properties describes the macroscopic behavior — pressure, volume, temperature, and amount — of gases at the molecular level using kinetic molecular theory and the ideal gas law PV = nRT. Pressure arises from particles colliding with container walls; temperature is proportional to average kinetic energy (KE_avg = 3/2 k_B T). The four classical gas laws — Boyle's (P∝1/V), Charles's (V∝T), Gay-Lussac's (P∝T), and Avogadro's (V∝n) — are all special cases of PV = nRT, each obtained by holding the appropriate variables constant. At STP (273 K, 1 atm), 1 mol of an ideal gas occupies 22.4 L. This simulation lets you vary temperature, volume, and particle count while watching molecular motion and live pressure data update simultaneously.",
    parameterExplanations: {
      temperature:
        "Temperature is measured in kelvins on the simulation's 50-1000 K slider. It controls the average kinetic energy of the gas particles: higher temperature means faster particles, harder wall collisions, and usually higher pressure when volume and particle count stay fixed. Try starting at the STP preset, then move only the temperature slider upward to test Gay-Lussac's Law, P/T = constant at fixed volume and amount. Because gas laws use absolute temperature, kelvins are required; Celsius values would break the direct proportional relationship between temperature and molecular motion.",
      volume:
        "Volume is measured in liters on the 1-20 L slider. Lowering the volume gives the same particles less space, so they strike the container walls more often and pressure rises. Raising the volume spreads collisions over a larger space and lowers pressure when temperature and particle count are unchanged. This is Boyle's Law in action: P1V1 = P2V2 for a fixed amount of gas at fixed temperature. For a clean test, choose the STP preset, leave temperature and particles unchanged, and move only the volume slider while watching the pressure readout.",
      particles:
        "Particles sets how many gas particles are inside the container, from 1 to 20 particles. Adding particles increases the number of wall collisions each second, so pressure rises when temperature and volume stay fixed. Removing particles does the opposite. This slider gives a visible version of the amount term in PV = nRT: more gas in the same space at the same temperature produces more pressure. To isolate the effect, hold temperature and volume steady, then compare 5 particles with 10 particles and look for the pressure ratio.",
    },
    misconceptions: [
      {
        wrong:
          "Gases expand when heated because the molecules get bigger.",
        correct:
          "Molecules do not change size with temperature. When heated at constant pressure, gas molecules move faster, collide with walls more forcefully, and the container must expand to keep pressure constant (Charles's Law: V ∝ T). Volume increases because the same molecules need more space to maintain the same collision rate, not because of physical enlargement.",
      },
      {
        wrong:
          "Boyle's Law, Charles's Law, and Gay-Lussac's Law are independent laws with nothing in common.",
        correct:
          "They are all derived from the same ideal gas law PV = nRT by holding different variables constant. Boyle: hold T and n fixed → PV = constant. Charles: hold P and n fixed → V/T = constant. Gay-Lussac: hold V and n fixed → P/T = constant. Recognizing them as special cases of one equation prevents memorizing three separate formulas.",
      },
      {
        wrong:
          "Temperature in Celsius works fine in gas law calculations — adding a constant to convert to Kelvin is just optional.",
        correct:
          "It is not optional. At 0°C (273 K), a gas has real, nonzero pressure and volume. Gas laws require absolute temperature because they are proportional relationships: V = nRT/P breaks down if T can be zero or negative (as in Celsius). Using Celsius gives nonsensical results, such as infinite pressure at −273°C instead of zero volume.",
      },
      {
        wrong:
          "All gases behave ideally as long as the temperature is above 0°C.",
        correct:
          "Ideal behavior requires low pressure (so intermolecular forces are negligible) and high temperature (so kinetic energy dominates over attraction). Real gases deviate significantly at high pressure (above ~10 atm for most) or near their boiling point, where the van der Waals a and b corrections become important. CO₂ deviates noticeably at pressures accessible in a lab.",
      },
      {
        wrong:
          "Doubling the number of gas molecules always doubles the pressure, regardless of what else changes.",
        correct:
          "Doubling n doubles P only if both T and V stay constant — that is Avogadro's contribution to PV = nRT. If you also halve V at the same time, P quadruples; if you also halve T, P is unchanged. The simulation isolates this: with the volume and temperature sliders held fixed, doubling the particle count does double the pressure readout, but changing the other sliders simultaneously breaks the simple proportionality.",
      },
    ],
    teacherUseCases: [
      "Boyle's Law data collection: hold temperature and particles fixed while stepping volume from 20 L down to 1 L in several increments. Students record P and V, compute P×V at each point, and verify the product stays approximately constant. Plotting P vs. 1/V gives a straight line through the origin — direct evidence of PV = constant for AP 9.A.1.",
      "Gay-Lussac graphing: fix particles and volume, vary temperature across the 50-1000 K slider range, and plot P vs. T. The line should trend through the origin in K, connecting kinetic theory to the concept of an absolute temperature scale. At constant volume the relationship is P/T = const, which is Gay-Lussac's, not Charles's.",
      "Preset comparison warm-up: have students record the slider values and pressure behavior for Ideal Gas (STP), High Temperature, and Real Gas (vdW). They then explain which variable changed most visibly and whether the result matches PV = nRT or suggests real-gas deviation.",
      "Avogadro's Law verification: fix T and volume, then double the particle count from 5 to 10 and record the pressure ratio. Students confirm pressure approximately doubles, then write the proportional relationship P ∝ n, connecting to the insight that equal volumes of different ideal gases at the same T and P contain equal numbers of particles.",
      "Ideal vs. real gas misconception probe: ask students to predict whether a real gas at high temperature or compressed volume obeys PV = nRT exactly, then compare the ideal and Real Gas (vdW) preset behavior. Use the difference to discuss what the van der Waals equation adds: particle volume and intermolecular attraction.",
    ],
    faq: [
      {
        question: "Why must temperature be in kelvins for all gas law calculations?",
        answer:
          "Gas law relationships like V ∝ T and P ∝ T are proportionalities, which only hold when T is measured from absolute zero. At absolute zero (0 K = −273.15°C), molecular motion theoretically ceases and volume approaches zero. Celsius can be negative, which would give nonsensical negative volumes or pressures if plugged directly into PV = nRT. Always convert: T(K) = T(°C) + 273.15.",
      },
      {
        question: "What is the difference between an ideal gas and a real gas?",
        answer:
          "An ideal gas is modeled as point particles with no volume and no intermolecular forces; PV = nRT holds exactly. Real gas molecules have finite volume and attract each other. At low pressure and high temperature, intermolecular distances are large and particle volume is a tiny fraction of container volume, so real gases approach ideal behavior. At high pressure (above ~10 atm) or near the boiling point, the van der Waals correction [P + a(n/V)²](V − nb) = nRT becomes necessary, with a and b tabulated per-substance.",
      },
      {
        question: "How is pressure related to molecular motion at the microscopic level?",
        answer:
          "Pressure is the force per unit area exerted by gas molecules colliding with container walls. Each collision transfers momentum; more collisions per second (higher T, smaller V, or more molecules) means higher pressure. This is the kinetic molecular theory explanation underlying PV = nRT — macroscopic pressure is the statistical average of billions of molecular collisions per second.",
      },
      {
        question: "How does the AP Chemistry standard 9.A.1 connect to this simulation?",
        answer:
          "AP 9.A.1 requires students to use the ideal gas law and its special cases (Boyle's, Charles's, Gay-Lussac's, Avogadro's) to predict and calculate changes in gas properties. The simulation directly supports this by letting you isolate one variable at a time while holding others fixed, then verifying the predicted relationship (e.g., P₁V₁ = P₂V₂) numerically with the live pressure readout.",
      },
      {
        question: "At STP, what is the molar volume of an ideal gas?",
        answer:
          "At STP (0°C = 273 K, 1 atm), PV = nRT gives V/n = RT/P = (0.08206 L·atm/(mol·K) × 273 K) / 1 atm = 22.4 L/mol. Note that the College Board now uses 273 K and 1 atm as STP; some older texts use 101.325 kPa and 273 K, which gives the same 22.4 L/mol. Use this molar volume for stoichiometry with gases only at STP.",
      },
      {
        question: "If I double the temperature and halve the volume simultaneously, what happens to pressure?",
        answer:
          "Apply PV = nRT: P = nRT/V. Doubling T multiplies P by 2; halving V multiplies P by 2 again — so P increases by a factor of 4. This illustrates why using the combined gas law P₁V₁/T₁ = P₂V₂/T₂ is more efficient than trying to apply Boyle's and Charles's laws sequentially when two variables change at once.",
      },
    ],
  },
};
