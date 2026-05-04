import type { Experiment } from "@/shared/types/experiment";

export const solutionsDilutions: Experiment = {
  id: "solutions-dilutions",
  slug: "solutions-dilutions",
  title: "Solutions & Dilutions",
  subtitle: "Concentration, molarity, and the dilution equation",
  description:
    "Explore how adding solvent changes solution concentration. Prepare solutions of precise molarity, perform serial dilutions, and verify the dilution equation C₁V₁ = C₂V₂. Observe color intensity change as concentration varies.",
  thumbnail: "/imgs/experiments/solutions-dilutions.png",

  standards: {
    ngss: ["HS-PS1-7"],
    gcse: [],
    ap: ["3.A.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "9-12",
  tags: [
    "solutions",
    "dilutions",
    "molarity",
    "concentration",
    "C1V1=C2V2",
    "AP Chemistry",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "solute",
      label: "Moles of Solute",
      unit: "mol",
      min: 1,
      max: 30,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "volume",
      label: "Volume of Solvent",
      unit: "mL",
      min: 10,
      max: 5000,
      default: 1000,
      step: 10,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "C_1 V_1 = C_2 V_2",
      description:
        "Dilution equation: initial concentration × initial volume = final concentration × final volume",
    },
    {
      latex: "M = \\frac{n}{V} = \\frac{\\text{moles of solute}}{\\text{liters of solution}}",
      description:
        "Molarity (M) is moles of solute per liter of solution",
    },
  ],

  theory:
    "When a solution is diluted by adding solvent, the amount of solute (in moles) remains constant. Only the volume changes, which decreases the concentration proportionally. The dilution equation C₁V₁ = C₂V₂ expresses this conservation: C₁ is the initial molarity, V₁ is the initial volume, C₂ is the final molarity, and V₂ is the final volume (V₁ + added water). Serial dilution is a technique where each step dilutes the previous solution by a fixed ratio, useful for preparing very low concentrations. Color intensity of many solutions is proportional to concentration (Beer-Lambert Law), providing a visual indicator of dilution progress.",

  instructions:
    "Use the Moles of Solute slider to set how much dissolved material is present, then use the Volume of Solvent slider to change the solution volume and observe the resulting molarity. Try the NaCl 1.0M, CuSO₄ 0.1M (blue), and Dilution Demo (10×) presets to compare common setups before adjusting the two sliders.",

  challenges: [
    {
      id: "sd-c1",
      question: "If you have 50 mL of 2.0 M CuSO₄ and add 50 mL of water, what is the final concentration?",
      hint: "C₂ = C₁V₁/V₂ = (2.0)(50)/(100) = 1.0 M",
      tier: "free",
    },
    {
      id: "sd-c2",
      question: "How much water must you add to 10 mL of 1.0 M solution to make 0.1 M?",
      hint: "V₂ = C₁V₁/C₂ = (1.0)(10)/(0.1) = 100 mL → add 90 mL water",
      tier: "free",
    },
    {
      id: "sd-c3",
      question: "After 3 serial 1:10 dilutions starting from 1.0 M, what is the final concentration?",
      hint: "Each 1:10 dilution divides by 10: 1.0 → 0.1 → 0.01 → 0.001 M",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["beers-law-lab", "stoichiometry"],
  htmlPath: "/experiments/ap-chemistry/solutions-dilutions.html",

  seoTitle: "Solutions & Dilutions Interactive Lab | Scivra AP Chemistry",
  seoKeywords: [
    "dilution equation simulation",
    "molarity calculator interactive",
    "C1V1=C2V2 virtual lab",
    "solution concentration simulator",
    "AP Chemistry dilution",
    "serial dilution practice",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Solution Dilution and Molarity",
  },
  htmlControlAliases: { solute: "sl-mol", volume: "sl-vol" },
  presets: [
    {
      id: "applyPreset:NaCl",
      label: "NaCl 1.0M",
      description:
        "Sets a sodium chloride solution near 1.0 M so students can connect moles, volume, and molarity without color as a visual cue.",
    },
    {
      id: "applyPreset:CuSO4",
      label: "CuSO₄ 0.1M (blue)",
      description:
        "Sets a blue copper(II) sulfate solution near 0.1 M so concentration changes are visible through color intensity as well as the numeric readout.",
    },
    {
      id: "applyPreset:dilution",
      label: "Dilution Demo (10×)",
      description:
        "Sets up a tenfold dilution comparison that shows how increasing volume while conserving solute decreases molarity by the dilution factor.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Molarity quantifies the concentration of a solution as moles of solute per liter of solution (mol/L, abbreviated M). When a lab technician prepares a 0.9% saline IV bag from a concentrated stock, the procedure is a dilution: adding solvent increases the total volume while the moles of NaCl stay exactly the same. The governing relationship is C₁V₁ = C₂V₂ — the product of concentration and volume is conserved before and after dilution. AP Chem 3.A.1 requires quantitative facility with this equation in both directions: solving for an unknown final concentration and solving for the volume of water needed to reach a target molarity. This simulation lets you set an initial molarity and volume, add water in real time, and watch the color intensity of the solution fade as concentration drops.",
    parameterExplanations: {
      solute:
        "Moles of Solute controls the amount of dissolved particles in the beaker, from 1 to 30 mol. Holding volume constant, increasing this slider raises molarity because the same solvent volume must contain more solute particles. Lowering it reduces concentration even if the liquid level does not change. This is the numerator of M = n/V, so it is the most direct way to explore how the amount of matter affects concentration. Use the NaCl and CuSO₄ presets to compare colorless and colored examples, then adjust moles to see why concentration depends on quantity, not just the identity of the substance.",
      volume:
        "Volume of Solvent controls the solution volume shown in the beaker, from 10 to 5000 mL. The simulation treats this volume as the denominator in M = n/V, converting milliliters to liters for the molarity calculation. When the moles slider stays fixed, increasing volume spreads the same solute through more liquid, so molarity decreases; decreasing volume concentrates the same amount into less space. The Dilution Demo preset highlights this conservation idea: a tenfold increase in volume produces a tenfold drop in molarity when solute moles stay unchanged.",
    },
    misconceptions: [
      {
        wrong:
          "Increasing solution volume decreases the number of moles of solute.",
        correct:
          "Changing volume spreads the same solute through more or less liquid. The moles of solute are controlled separately by the Moles of Solute slider. If that value stays fixed, increasing volume lowers concentration but does not remove or destroy solute. In molarity terms, n stays constant while V changes, so M = n/V decreases.",
      },
      {
        wrong:
          "A concentrated acid is the same thing as a strong acid.",
        correct:
          "Concentration (mol/L) and acid strength (degree of ionization) are independent properties. 'Strong' describes whether the acid ionizes completely in water (e.g., HCl is strong regardless of concentration). 'Concentrated' describes how many moles per liter are present. You can have dilute HCl (strong but low concentration) or concentrated acetic acid (weak but high concentration).",
      },
      {
        wrong:
          "To make a solution 10 times more dilute, you only double the volume.",
        correct:
          "At fixed moles of solute, concentration is inversely proportional to total volume. Doubling the volume halves the molarity. A 10-fold dilution requires a 10-fold increase in total volume, so 1 L must become 10 L. The Volume of Solvent slider makes this relationship visible by changing V while the solute amount stays fixed.",
      },
      {
        wrong:
          "Molarity and molality are the same unit for dilute aqueous solutions.",
        correct:
          "Molarity (M) is moles of solute per liter of solution and changes with temperature because solution volume expands or contracts. Molality (m) is moles of solute per kilogram of solvent and is temperature-independent. For dilute aqueous solutions they are numerically close (water density ≈ 1 kg/L), but for concentrated solutions or colligative-property calculations, the distinction matters.",
      },
      {
        wrong:
          "You can use C₁V₁ = C₂V₂ whenever you mix two solutions together.",
        correct:
          "C₁V₁ = C₂V₂ applies only when the solute amount is conserved during dilution. If you mix two solutions of different concentrations, calculate total solute first: moles₁ + moles₂ = total moles, then divide by total volume. This simulation exposes the same mass-balance idea directly with separate moles and volume controls.",
      },
    ],
    teacherUseCases: [
      "Qualitative color prediction before calculation: choose the CuSO₄ 0.1M preset, have students predict how the beaker should change when volume increases at fixed moles, then verify with the Volume of Solvent slider. Connects Beer-Lambert visual feedback to quantitative reasoning.",
      "Quantitative data collection — color vs. concentration: use the CuSO₄ preset, keep Moles of Solute constant, change Volume of Solvent through 5–6 measured values, and record qualitative color intensity alongside calculated molarity. Use this as a lead-in to the dedicated Beer's Law Lab experiment.",
      "Misconception probe — 'dilution removes solute': set a fixed value on the Moles of Solute slider, then increase Volume of Solvent. Ask students to state what happens to moles and molarity separately; the readout reinforces that moles stay constant while concentration changes.",
      "Tenfold dilution exercise: start with the Dilution Demo (10×) preset, identify the moles and volume values, and have students explain why multiplying volume by 10 divides molarity by 10 when the solute amount is unchanged.",
      "Exam-style problem solving: give students target moles, volume, or molarity values and have them calculate the missing quantity before touching the sliders. Verify answers against the simulation readout; address discrepancies in the debrief.",
    ],
    faq: [
      {
        question: "How does the simulation calculate molarity from the sliders?",
        answer:
          "It uses M = n/V: moles of solute divided by liters of solution. The Moles of Solute slider supplies n, and the Volume of Solvent slider supplies V after converting mL to L. For example, 10 mol in 1000 mL is 10 mol / 1.000 L = 10 M. Keeping moles fixed while increasing volume lowers molarity.",
      },
      {
        question: "Why does the solution color fade when I increase volume?",
        answer:
          "Solution color intensity is proportional to concentration via the Beer-Lambert law (A = εbc). When the moles of solute stay fixed and volume increases, concentration c decreases while path length b and molar absorptivity ε stay constant, so absorbance and visible color depth decrease proportionally. The CuSO₄ preset makes this qualitative change easy to see.",
      },
      {
        question: "How many moles of solute are present after I change volume?",
        answer:
          "Exactly the value shown by the Moles of Solute slider. Changing only the Volume of Solvent slider does not change n; it changes how much liquid those moles are spread through. Moles are conserved during dilution, which is the fundamental reason concentration falls when total volume rises.",
      },
      {
        question: "What is a serial dilution and when is it used?",
        answer:
          "A serial dilution performs the same dilution factor repeatedly: each step uses the output of the previous step as input. Three sequential 1:10 dilutions from 1.0 M gives 0.001 M (1 × 10⁻³ M). This technique is used in microbiology (bacterial plate counts), analytical chemistry, and pharmacology whenever concentrations span many orders of magnitude and a single large dilution would be impractical to measure accurately.",
      },
      {
        question: "Why does this simulator use total volume instead of water added?",
        answer:
          "Molarity depends on final solution volume, so the simulator exposes total volume directly. In a lab, 'diluting to 100 mL' means the final volume is exactly 100 mL, usually measured in a volumetric flask. 'Adding 90 mL of water' is an approximate path to that total. AP-level problems often assume volumes are additive unless stated otherwise.",
      },
      {
        question: "How does this topic connect to AP Chem 3.A.1 on the exam?",
        answer:
          "AP Chem 3.A.1 states that the relationship between solution concentration, solute amount, and solvent volume must be quantitatively understood. Exam questions commonly ask you to calculate molarity from moles and volume, determine a final concentration after dilution, or identify whether moles of solute change during dilution. Practice both M = n/V and C₁V₁ = C₂V₂.",
      },
    ],
  },
};
