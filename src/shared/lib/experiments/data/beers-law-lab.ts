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
      unit: "mol/L",
      min: 0,
      max: 1.0,
      default: 0.1,
      step: 0.01,
      tier: "free",
    },
    {
      id: "pathLength",
      label: "Path Length",
      unit: "cm",
      min: 0.5,
      max: 5.0,
      default: 1.0,
      step: 0.5,
      tier: "free",
    },
    {
      id: "wavelength",
      label: "Wavelength",
      unit: "nm",
      min: 400,
      max: 700,
      default: 520,
      step: 10,
      tier: "free",
    },
    {
      id: "solutionType",
      label: "Solution (0=CuSO₄, 1=KMnO₄, 2=CoCl₂)",
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
    "Select a solution type and adjust concentration with the slider. Observe the solution color change in the cuvette — darker = more concentrated. The spectrophotometer beam passes through and measures absorbance. Try different path lengths and wavelengths. The graph plots absorbance vs concentration in real time.",

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
  contentSections: {
    whatIsIt:
      "Beer's Law (the Beer-Lambert Law) states that the absorbance of a solution is directly proportional to both its molar concentration and the distance light travels through it: A = ε × b × c. A colorimeter or spectrophotometer in a real lab exploits this relationship to determine unknown concentrations — the same principle that medical analyzers use to measure glucose, hemoglobin, or bilirubin in blood. AP Chem 3.C.1 requires quantitative understanding of this proportionality and the construction of calibration curves. In this simulation, you control solution concentration, cuvette path length, and wavelength, while a virtual spectrophotometer reports absorbance in real time and plots the A-vs-c calibration curve as you adjust each parameter.",
    parameterExplanations: {
      concentration:
        "The molar concentration of the solution in the cuvette, in mol/L (range 0–1.0 M, default 0.1 M). Absorbance increases linearly with concentration within the Beer's Law range; the actual usable range depends on the species, wavelength, path length, and instrument absorbance ceiling, so always verify linearity from the calibration curve before reporting a concentration. This parameter is the primary variable when constructing that curve.",
      pathLength:
        "The distance the light beam travels through the solution, in cm (range 0.5–5.0 cm, default 1.0 cm). By A = εbc, doubling path length doubles absorbance at constant concentration — the same mathematical relationship as doubling concentration. Standard laboratory cuvettes have a 1.0 cm path length; the simulation lets you explore how deviating from this default changes the measured absorbance.",
      wavelength:
        "The wavelength of incident light, in nm (range 400–700 nm, default 520 nm). Each compound absorbs most strongly at its peak wavelength (λ_max), where ε is highest. CuSO₄ appears blue because it absorbs red-orange light near 635 nm; KMnO₄ is purple and absorbs in the green near 525 nm. Selecting a wavelength far from λ_max reduces ε and compresses the calibration curve slope, making concentration measurements less sensitive.",
      solutionType:
        "Selects the solution in the cuvette: 0 = CuSO₄ (blue, λ_max ≈ 635 nm), 1 = KMnO₄ (purple, λ_max ≈ 525 nm), 2 = CoCl₂ (pink, λ_max ≈ 510 nm). Each compound has a distinct molar absorptivity ε at any given wavelength. Switching compounds at the same concentration and path length produces different absorbance values, illustrating that ε is a substance-specific constant.",
    },
    misconceptions: [
      {
        wrong:
          "Beer's Law works at any concentration — just measure absorbance and divide by εb to get concentration.",
        correct:
          "Beer's Law is linear only within a limited concentration range that depends on species, wavelength, path length, and instrument range. For many AP-level colored species the linear range falls in dilute aqueous concentrations, and the simulation shows a noticeable bend at higher values. Always verify linearity from your calibration curve before reporting a concentration from a measured absorbance.",
      },
      {
        wrong:
          "A solution's color tells you which wavelength to use for measurement — a blue solution should be measured with blue light.",
        correct:
          "You should use the wavelength the solution absorbs most strongly, which is the complement of its color. A blue solution (like CuSO₄) looks blue because it transmits blue light and absorbs its complement, orange-red (~635 nm). Measuring at 635 nm gives the highest absorbance and therefore the most sensitive calibration curve. Measuring with blue light at ~460 nm gives near-zero absorbance — the solution barely absorbs it.",
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
          "The slope of an A-vs-c calibration curve at fixed path length is equal to ε × b (units: L/(mol·cm) × cm = L/mol). It is the product of the molar absorptivity — a fundamental property of the compound at that wavelength — and the path length. A steeper slope means more sensitive detection at lower concentrations; it directly reflects how strongly the compound absorbs at the chosen wavelength.",
      },
    ],
    teacherUseCases: [
      "Calibration curve construction: fix wavelength at λ_max for the selected compound and path length at 1.0 cm; have students record absorbance at 6–8 concentrations from 0.01 to 0.10 M, plot A vs. c, and determine the slope (= ε × b). Compare slopes across solutionType values to show that ε is compound-specific.",
      "Unknown concentration determination: after building a calibration curve, provide a target absorbance value (e.g., A = 0.42) and ask students to read the corresponding concentration from their graph and verify by setting that concentration in the simulation. Connects the analytical method to the underlying Beer-Lambert equation.",
      "Wavelength selection investigation: for CuSO₄, have students record absorbance at 10 nm intervals from 400 to 700 nm at a fixed concentration (0.05 M, 1 cm), plot absorbance vs. wavelength (an absorption spectrum), and identify λ_max. Reinforces why selecting λ_max maximizes measurement sensitivity.",
      "Beer's Law deviation probe: have students extend the calibration curve data collection to concentrations of 0.2, 0.5, and 1.0 M and observe where the curve departs from linearity. Discuss the intermolecular-interaction explanation and the practical implication — dilute the sample before measuring if concentrations exceed the linear range.",
      "Misconception probe — color vs. measurement wavelength: ask students which wavelength gives the best absorbance for a blue solution before they touch the sliders. After collecting predictions, sweep wavelength from 400–700 nm at constant concentration and observe the absorbance peak. The contrast — blue solution appearance, red-region absorbance peak — helps students connect the observed solution color with the absorbed wavelength.",
    ],
    faq: [
      {
        question: "What does the molar absorptivity ε actually represent?",
        answer:
          "Molar absorptivity ε (also called the molar extinction coefficient) is an intrinsic property of a substance at a specific wavelength, with units of L/(mol·cm). It quantifies how strongly one mole of the substance absorbs light of that wavelength per centimeter of path length. A high ε means the compound absorbs that wavelength intensely and can be detected at lower concentrations. ε varies with wavelength and is largest at λ_max.",
      },
      {
        question: "How do I find an unknown concentration using Beer's Law?",
        answer:
          "Build a calibration curve: measure absorbance for several known concentrations at fixed λ and b, plot A vs. c, and fit a straight line (slope = εb). For the unknown, measure its absorbance under the same conditions, then solve c = A / (εb) or read c directly from the calibration curve. Verify the unknown's absorbance falls within the linear range of the curve (A ≤ ~0.8 for most compounds). AP Chem 3.C.1 requires this procedure.",
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
        question: "How does wavelength choice affect the accuracy of my concentration measurement?",
        answer:
          "Selecting λ_max gives the highest ε value, producing the steepest calibration curve slope (most sensitive). At other wavelengths, ε is smaller, the slope is shallower, and small errors in measuring absorbance translate into larger errors in the calculated concentration. For CuSO₄, measuring at 635 nm rather than 460 nm can increase sensitivity by a factor of 5–10. Always determine λ_max from an absorption spectrum before measuring unknowns.",
      },
      {
        question: "How does Beer's Law connect to AP Chem 3.C.1 on the exam?",
        answer:
          "AP Chem 3.C.1 addresses the interaction of light with matter, including the quantitative relationship between concentration and absorbance. Exam questions may ask you to calculate ε from A, b, and c; predict absorbance after changing path length or concentration; or identify the linear range of a given calibration plot. Know all three algebraic forms of A = εbc (solving for A, c, and ε) and understand that slope of the A-vs-c calibration equals εb when b is fixed.",
      },
    ],
  },
};
