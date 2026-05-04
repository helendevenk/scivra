import type { Experiment } from "@/shared/types/experiment";

export const beersLawLab: Experiment = {
  id: "beers-law-lab",
  slug: "beers-law-lab",
  title: "Beer's Law Lab",
  subtitle: "Absorbance, transmittance, and spectrophotometry",
  description:
    "Explore the Beer-Lambert Law by adjusting solution concentration and path length to observe how light absorption changes. Use a virtual spectrophotometer to measure absorbance at different wavelengths, plot calibration curves, and determine unknown concentrations.",
  thumbnail: "/imgs/experiments/beers-law-lab.png",

  standards: {
    ngss: ["HS-PS4-5"],
    gcse: [],
    ap: ["3.C.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: [
    "Beer's Law",
    "absorbance",
    "spectrophotometry",
    "concentration",
    "calibration curve",
    "AP Chemistry",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "concentration",
      label: "Concentration",
      unit: "mM",
      min: 1,
      max: 200,
      default: 50,
      step: 1,
      tier: "free",
    },
    {
      id: "pathLength",
      label: "Path Length",
      unit: "mm",
      min: 1,
      max: 50,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "molarAbsorptivity",
      label: "Molar Absorptivity",
      unit: "M⁻¹·cm⁻¹",
      min: 1,
      max: 500,
      default: 12,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "A = \\varepsilon \\cdot b \\cdot c",
      description:
        "Beer-Lambert Law: A = absorbance, ε = molar absorptivity (L/(mol·cm)), b = path length (cm), c = concentration (mol/L)",
    },
    {
      latex: "A = -\\log_{10}(T) = -\\log_{10}\\left(\\frac{I}{I_0}\\right)",
      description:
        "Absorbance from transmittance: T = I/I₀ = fraction of light transmitted",
    },
  ],

  theory:
    "Beer-Lambert Law states that absorbance is directly proportional to both the concentration of the absorbing species and the path length of light through the solution. A = εbc, where ε is the molar absorptivity (a constant for each substance at a given wavelength), b is the path length in cm, and c is the molar concentration. Transmittance T = I/I₀ is the fraction of light that passes through. A = -log₁₀(T). A calibration curve (A vs c) at fixed wavelength and path length gives a straight line through the origin. The slope is εb. To find an unknown concentration, measure its absorbance and read from the calibration curve. Deviations from Beer's Law occur at high concentrations (>0.01 M for most species) due to intermolecular interactions.",

  instructions:
    "Use the three sliders to adjust concentration, path length, and molar absorptivity. Compare how each variable changes absorbance and transmittance in the cuvette. Try the CuSO₄, KMnO₄, and K₂Cr₂O₇ presets to switch between common colored solutions, then fine-tune the sliders to test Beer's Law relationships.",

  challenges: [
    {
      id: "bl-c1",
      question: "If a 0.1 M CuSO₄ solution has A = 0.5 at 635 nm in a 1 cm cuvette, what is ε?",
      hint: "A = εbc → ε = A/(bc) = 0.5/(1 × 0.1) = 5 L/(mol·cm)",
      tier: "free",
    },
    {
      id: "bl-c2",
      question: "If you double the concentration, what happens to the absorbance?",
      hint: "A = εbc is linear: doubling c doubles A (within Beer's Law range).",
      tier: "free",
    },
    {
      id: "bl-c3",
      question: "An unknown solution has A = 0.35 at 520 nm. From the calibration curve, ε = 3.5 L/(mol·cm) at this wavelength with b = 1 cm. Find the concentration.",
      hint: "c = A/(εb) = 0.35/(3.5 × 1) = 0.1 mol/L",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["thermochemistry", "solutions-dilutions"],
  htmlPath: "/experiments/ap-chemistry/beers-law-lab.html",

  seoTitle: "Beer's Law Lab Interactive Spectrophotometer | Scivra AP Chemistry",
  seoKeywords: [
    "Beer's Law simulation",
    "spectrophotometer virtual lab",
    "absorbance concentration calculator",
    "calibration curve interactive",
    "AP Chemistry Beer Lambert",
    "spectrophotometry simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Beer-Lambert Law and Spectrophotometry",
  },
  htmlControlAliases: {
    concentration: "sl-c",
    pathLength: "sl-l",
    molarAbsorptivity: "sl-eps",
  },
  presets: [
    {
      id: "CuSO4",
      label: "CuSO₄ (blue)",
      description:
        "Copper(II) sulfate is a blue solution that provides a familiar reference case for connecting concentration, path length, molar absorptivity, absorbance, and transmittance.",
    },
    {
      id: "KMnO4",
      label: "KMnO₄ (purple)",
      description:
        "Potassium permanganate is a strongly colored purple solution, useful for showing how high absorptivity can produce large absorbance even at modest concentrations.",
    },
    {
      id: "K2Cr2O7",
      label: "K₂Cr₂O₇ (orange)",
      description:
        "Potassium dichromate is an orange solution that helps students compare a different colored absorber while keeping the same Beer's Law variables visible.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Beer's Law (the Beer-Lambert Law) states that the absorbance of a solution is directly proportional to both its molar concentration and the distance light travels through it: A = ε × b × c. A colorimeter or spectrophotometer in a real lab exploits this relationship to determine unknown concentrations — the same principle that medical analyzers use to measure glucose, hemoglobin, or bilirubin in blood. AP Chem 3.C.1 requires quantitative understanding of this proportionality and the construction of calibration curves. In this simulation, you control solution concentration, cuvette path length, and molar absorptivity, while a virtual spectrophotometer reports absorbance in real time and plots the A-vs-c calibration curve as you adjust each parameter.",
    parameterExplanations: {
      concentration:
        "Concentration is the amount of absorbing solute in the cuvette, shown in millimoles per liter. In Beer's Law, concentration is the c term in A = εbc, so increasing it raises absorbance when path length and molar absorptivity stay fixed. Use this slider to build an A-vs-c calibration curve and see why dilute standards form a straight-line relationship. The simulation range spans 1-200 mM, so students can compare low, moderate, and high sample amounts while watching transmittance fall as more light is absorbed.",
      pathLength:
        "Path length is the distance the light travels through the colored solution, shown in millimeters. In the Beer-Lambert equation it is the b term, traditionally converted to centimeters for calculation. A longer path gives the absorbing particles more distance to intercept light, so absorbance increases in direct proportion when concentration and molar absorptivity stay the same. The 1-50 mm slider makes this visible beyond the standard 10 mm laboratory cuvette, helping students understand why calibration standards and unknowns must be measured with the same cuvette geometry.",
      molarAbsorptivity:
        "Molar absorptivity is the ε term in A = εbc, with units M⁻¹·cm⁻¹. It represents how strongly the dissolved species absorbs the selected light under the simulation conditions. A larger ε produces a steeper calibration curve, so a small change in concentration creates a larger absorbance change. Use the CuSO₄, KMnO₄, and K₂Cr₂O₇ presets to compare colored solutions, then adjust this slider directly to isolate the mathematical role of ε. This helps students separate substance-specific absorption strength from sample amount and cuvette path length.",
    },
    misconceptions: [
      {
        wrong:
          "Beer's Law works at any concentration — just measure absorbance and divide by εb to get concentration.",
        correct:
          "Beer's Law is linear only within a limited concentration range that depends on the absorbing species, path length, molar absorptivity, and instrument range. For many AP-level colored species the linear range falls in dilute aqueous concentrations, and the simulation shows a noticeable bend at higher values. Always verify linearity from your calibration curve before reporting a concentration from a measured absorbance.",
      },
      {
        wrong:
          "A solution's visible color alone tells you exactly how much light it will absorb.",
        correct:
          "Visible color is useful qualitative evidence, but absorbance must be measured quantitatively. Two blue-looking solutions can have different concentrations, cuvette path lengths, or molar absorptivity values, so they can transmit different fractions of light. In this lab, use the presets to choose a colored solution, then rely on the sliders and absorbance display to connect the visual cue to A = εbc.",
      },
      {
        wrong:
          "Absorbance and transmittance are just different names for the same measurement.",
        correct:
          "They are inverse-logarithmic transforms of each other: A = −log₁₀(T), where T = I/I₀. Transmittance is the fraction of light passing through (0 to 1); absorbance is the negative base-10 logarithm. A = 0 means 100% transmission; A = 1 means 10% transmission; A = 2 means 1%. The logarithmic relationship is why absorbance is linear with concentration while transmittance is not.",
      },
      {
        wrong:
          "Doubling the path length has no effect if you recalibrate with the same cuvette.",
        correct:
          "Path length is a direct multiplicative factor in A = εbc. If b doubles, absorbance doubles at the same concentration. If you built a calibration curve with a 1 cm cuvette and then measure an unknown with a 2 cm cuvette, A_measured = ε(2)c_true, so reading the calibration curve (which assumes 1 cm) gives c_read = 2 × c_true — twice the true value. Path length must be identical for both calibration and unknown measurement.",
      },
      {
        wrong:
          "The slope of the A-vs-c calibration curve is just a number from the graph — it has no physical meaning.",
        correct:
          "The slope of an A-vs-c calibration curve at fixed path length is equal to ε × b (units: L/(mol·cm) × cm = L/mol). It is the product of the molar absorptivity — a property of the selected absorber under the measurement conditions — and the path length. A steeper slope means more sensitive detection at lower concentrations; it directly reflects how strongly the sample absorbs in the model.",
      },
    ],
    teacherUseCases: [
      "Calibration curve construction: choose one preset, set path length to 10 mm, keep molar absorptivity fixed, and have students record absorbance across 6-8 concentration values. Plot A vs. c and connect the slope to ε × b.",
      "Variable isolation: assign groups to change only one slider at a time. One group varies concentration, one varies path length, and one varies molar absorptivity. Students compare which changes are linear and justify the pattern from A = εbc.",
      "Preset comparison: have students apply CuSO₄, KMnO₄, and K₂Cr₂O₇ at the same concentration and path length, then compare absorbance. Use the results to discuss why different colored ions can absorb with different strength.",
      "Unknown concentration determination: after students build a calibration curve with a chosen preset, provide a target absorbance and ask them to solve for concentration algebraically, then verify by setting the concentration slider to their calculated value.",
      "Path length error demonstration: build a calibration curve at 10 mm, then ask students what would happen if an unknown were measured at 20 mm. Use the slider to show how a mismatched cuvette path can make the calculated concentration too high.",
    ],
    faq: [
      {
        question: "What does the molar absorptivity ε actually represent?",
        answer:
          "Molar absorptivity ε (also called the molar extinction coefficient) is an intrinsic measure of how strongly a substance absorbs light under a defined measurement condition, with units of L/(mol·cm). It quantifies how much one mole of the substance absorbs per centimeter of path length. A high ε means the compound absorbs intensely and can be detected at lower concentrations. In this simulation, use the molar absorptivity slider to see how ε changes the calibration curve slope.",
      },
      {
        question: "How do I find an unknown concentration using Beer's Law?",
        answer:
          "Build a calibration curve: measure absorbance for several known concentrations while keeping ε and b fixed, plot A vs. c, and fit a straight line (slope = εb). For the unknown, measure its absorbance under the same conditions, then solve c = A / (εb) or read c directly from the calibration curve. Verify the unknown's absorbance falls within the linear range of the curve (A ≤ ~0.8 for most compounds). AP Chem 3.C.1 requires this procedure.",
      },
      {
        question: "Why does absorbance deviate from linearity at high concentrations in the simulation?",
        answer:
          "At high solute concentrations, molecules are close enough to interact with each other, altering their electronic environment and changing the effective ε. The refractive index of the solution also differs from pure solvent, changing how light propagates. Both effects cause the calibration curve to flatten — measured A grows less than εbc would predict (negative deviation from Beer's Law). The practical fix is to dilute samples into the linear range before measurement.",
      },
      {
        question: "What is the relationship between transmittance and absorbance?",
        answer:
          "Transmittance T = I/I₀, the fraction of incident light that passes through the sample (dimensionless, 0–1). Absorbance A = −log₁₀(T). So T = 0.1 → A = 1.0; T = 0.01 → A = 2.0. Absorbance is preferred for analytical work because it is linear with concentration, while transmittance is not. Most spectrophotometers display both; always use absorbance for calibration curves and Beer's Law calculations.",
      },
      {
        question: "How does absorptivity choice affect the accuracy of my concentration measurement?",
        answer:
          "A larger ε value gives a steeper calibration curve slope, making the measurement more sensitive. With a shallow slope, small absorbance reading errors create larger errors in calculated concentration. With a steep slope, the same concentration change produces a clearer absorbance change, though very high absorbance can exceed the useful linear range. In this lab, compare presets and the molar absorptivity slider to see how substance-specific absorption strength affects analytical precision.",
      },
      {
        question: "How does Beer's Law connect to AP Chem 3.C.1 on the exam?",
        answer:
          "AP Chem 3.C.1 addresses the interaction of light with matter, including the quantitative relationship between concentration and absorbance. Exam questions may ask you to calculate ε from A, b, and c; predict absorbance after changing path length or concentration; or identify the linear range of a given calibration plot. Know all three algebraic forms of A = εbc (solving for A, c, and ε) and understand that slope of the A-vs-c calibration equals εb when b is fixed.",
      },
    ],
  },
};
