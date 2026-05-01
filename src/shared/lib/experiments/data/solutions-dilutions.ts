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
      id: "initialConcentration",
      label: "Initial Concentration (C₁)",
      unit: "mol/L",
      min: 0.01,
      max: 2.0,
      default: 1.0,
      step: 0.01,
      tier: "free",
    },
    {
      id: "initialVolume",
      label: "Initial Volume (V₁)",
      unit: "mL",
      min: 1,
      max: 100,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "addedWater",
      label: "Added Water",
      unit: "mL",
      min: 0,
      max: 500,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "soluteType",
      label: "Solute (0=CuSO₄, 1=KMnO₄, 2=NaCl)",
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
    "Select a solute and set the initial concentration with the slider. The beaker shows the solution color intensity corresponding to molarity. Add water with the slider to dilute — watch the color fade as concentration drops. The readout panel shows both predicted (C₁V₁/V₂) and actual concentration in real time.",

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
  contentSections: {
    whatIsIt:
      "Molarity quantifies the concentration of a solution as moles of solute per liter of solution (mol/L, abbreviated M). When a lab technician prepares a 0.9% saline IV bag from a concentrated stock, the procedure is a dilution: adding solvent increases the total volume while the moles of NaCl stay exactly the same. The governing relationship is C₁V₁ = C₂V₂ — the product of concentration and volume is conserved before and after dilution. AP Chem 3.A.1 requires quantitative facility with this equation in both directions: solving for an unknown final concentration and solving for the volume of water needed to reach a target molarity. This simulation lets you set an initial molarity and volume, add water in real time, and watch the color intensity of the solution fade as concentration drops.",
    parameterExplanations: {
      initialConcentration:
        "The starting molarity (C₁) of the solution before any water is added, in mol/L (range 0.01–2.0 M, default 1.0 M). Higher values produce a more deeply colored solution in the beaker. Increasing C₁ proportionally increases the moles of solute present; adding the same volume of water from a higher starting concentration still gives a proportionally lower final concentration.",
      initialVolume:
        "The volume of stock solution you begin with (V₁), in mL (range 1–100 mL, default 10 mL). This determines the total moles present: n = C₁ × V₁ (in liters). A smaller initial volume means fewer total moles of solute; diluting to the same final volume therefore gives a lower final concentration than starting with a larger initial volume at the same molarity.",
      addedWater:
        "The volume of pure water added to the solution, in mL (range 0–500 mL, default 0). Final volume V₂ = V₁ + addedWater; the simulation computes C₂ = C₁V₁ / V₂ in real time. Adding 9 × V₁ of water produces a 10-fold dilution (one log unit decrease in concentration).",
      soluteType:
        "Selects the dissolved compound: 0 = CuSO₄ (blue), 1 = KMnO₄ (deep purple), 2 = NaCl (colorless in visible light). For the colored solutes (CuSO₄, KMnO₄), color intensity tracks with concentration via the Beer-Lambert law, so the visual fade on dilution is most dramatic; for NaCl, concentration is shown numerically only.",
    },
    misconceptions: [
      {
        wrong:
          "Adding water to a solution decreases the number of moles of solute.",
        correct:
          "Dilution only increases the volume of the solution. The moles of solute are unchanged because no solute is removed or destroyed. Only concentration decreases (fewer moles per liter), not the total amount. This is exactly what C₁V₁ = C₂V₂ encodes: n = CV is constant on both sides.",
      },
      {
        wrong:
          "A concentrated acid is the same thing as a strong acid.",
        correct:
          "Concentration (mol/L) and acid strength (degree of ionization) are independent properties. 'Strong' describes whether the acid ionizes completely in water (e.g., HCl is strong regardless of concentration). 'Concentrated' describes how many moles per liter are present. You can have dilute HCl (strong but low concentration) or concentrated acetic acid (weak but high concentration).",
      },
      {
        wrong:
          "To go from 1.0 M to 0.1 M, you just add 0.9 L of water to 1 L of solution.",
        correct:
          "The target final volume is V₂ = C₁V₁ / C₂ = (1.0)(1.0) / (0.1) = 10 L. The amount of water to add is V₂ − V₁ = 10 − 1 = 9 L, not 0.9 L. A 10-fold dilution requires a 10-fold increase in total volume, meaning you add 9 parts water for every 1 part solution.",
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
          "C₁V₁ = C₂V₂ applies only when the solute amount is conserved — that is, when you are diluting by adding pure solvent. If you mix two solutions of different concentrations, you must use a mass-balance approach: moles₁ + moles₂ = total moles, then divide by total volume.",
      },
    ],
    teacherUseCases: [
      "Qualitative color prediction before calculation: have students predict which direction the beaker color changes and approximately how intense it will be after a stated dilution, then verify with the slider. Connects Beer-Lambert visual feedback to quantitative reasoning.",
      "Quantitative data collection — color vs. concentration: fix soluteType to CuSO₄, perform a sequence of controlled dilutions by adding water in measured increments, and record qualitative color intensity at 5–6 resulting concentrations. Use this as a lead-in to the dedicated Beer's Law Lab experiment, which adds path length and quantitative absorbance measurement.",
      "Misconception probe — 'dilution removes solute': set C₁ = 1.0 M, V₁ = 10 mL; ask students to state the moles of solute before and after adding 90 mL water. Most predict moles decrease; the real-time mole readout corrects the error immediately.",
      "Serial dilution exercise: starting from 1.0 M, perform three sequential 1:10 dilutions using the simulation, recording C₂ each time. Students verify the pattern 1.0 → 0.1 → 0.01 → 0.001 M and connect to log-scale concentration used in pH problems.",
      "Exam-style problem solving: give students a target concentration and final volume, and have them calculate the required initial volume and amount of water to add before touching the sliders. Verify answers against the simulation readout; address discrepancies in the debrief.",
    ],
    faq: [
      {
        question: "How do I use C₁V₁ = C₂V₂ to find the final concentration after dilution?",
        answer:
          "Rearrange to C₂ = C₁V₁ / V₂, where V₂ = V₁ + volume of water added. Units must be consistent — if C₁ is in mol/L, both volumes must be in liters (or both in mL; units cancel). For example, 10 mL of 2.0 M NaCl diluted to 100 mL: C₂ = (2.0)(0.010 L) / (0.100 L) = 0.20 M. AP Chem 3.A.1 expects you to apply this in both directions.",
      },
      {
        question: "Why does the solution color fade when I add water?",
        answer:
          "Solution color intensity is proportional to concentration via the Beer-Lambert law (A = εbc). As you add water, concentration c decreases while path length b and molar absorptivity ε stay constant, so absorbance — and visible color depth — decrease proportionally. This visual effect is why colored solutions like CuSO₄ and KMnO₄ are used in real dilution labs to give immediate qualitative feedback.",
      },
      {
        question: "How many moles of solute are present after I dilute the solution?",
        answer:
          "Exactly the same number as before dilution. Moles = C × V (in liters). Before: n = C₁V₁. After: n = C₂V₂ = (C₁V₁/V₂) × V₂ = C₁V₁. The moles are conserved — this is the fundamental reason C₁V₁ = C₂V₂ works.",
      },
      {
        question: "What is a serial dilution and when is it used?",
        answer:
          "A serial dilution performs the same dilution factor repeatedly: each step uses the output of the previous step as input. Three sequential 1:10 dilutions from 1.0 M gives 0.001 M (1 × 10⁻³ M). This technique is used in microbiology (bacterial plate counts), analytical chemistry, and pharmacology whenever concentrations span many orders of magnitude and a single large dilution would be impractical to measure accurately.",
      },
      {
        question: "Is there a difference between 'adding 90 mL of water' and 'diluting to 100 mL total'?",
        answer:
          "Yes, and it matters in lab. 'Diluting to 100 mL' means the final volume is exactly 100 mL (use a volumetric flask). 'Adding 90 mL of water to 10 mL of solution' means approximately 100 mL final volume, but volumes of liquids are not perfectly additive when solute is present. For AP-level problems, assume volumes are additive unless told otherwise; in real analytical work, always use a volumetric flask to reach the exact target volume.",
      },
      {
        question: "How does this topic connect to AP Chem 3.A.1 on the exam?",
        answer:
          "AP Chem 3.A.1 states that the relationship between solution concentration (molarity) and the amounts of solute and solvent must be quantitatively understood. Exam questions commonly ask you to calculate C₂ from a dilution, determine the volume needed to prepare a given concentration from a stock solution, or identify how moles of solute change during dilution (they don't). Practice C₁V₁ = C₂V₂ in all three algebraic forms: solving for C₂, V₂, and V₁.",
      },
    ],
  },
};
