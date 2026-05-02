import type { Experiment } from "@/shared/types/experiment";

export const msAcidBaseReactions: Experiment = {
  id: "ms-acid-base-reactions",
  slug: "ms-acid-base-reactions",
  title: "Acid-Base Reactions",
  subtitle: "pH scale, neutralization, and indicator color changes",
  description:
    "Mix acids and bases to observe neutralization reactions in real time. Watch pH values shift on the scale, see indicator colors change from red through green to blue, and measure temperature changes during exothermic neutralization. Adjust concentrations to explore how strong and weak acids behave differently.",
  thumbnail: "/imgs/experiments/ms-acid-base-reactions.png",

  standards: {
    ngss: ["MS-PS1-2"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "6-8",
  tags: ["acid-base", "pH scale", "neutralization", "indicators", "chemical reactions", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "acidType",
      label: "Acid (0=Hydrochloric, 1=Vinegar, 2=Citric, 3=Sulfuric)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "baseType",
      label: "Base (0=Sodium Hydroxide, 1=Baking Soda, 2=Ammonia, 3=Calcium Hydroxide)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "concentration",
      label: "Solution Concentration",
      unit: "mol/L",
      min: 0.01,
      max: 2.0,
      default: 0.1,
      step: 0.01,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\text{Acid} + \\text{Base} \\to \\text{Salt} + \\text{H}_2\\text{O}",
      description: "Neutralization: an acid reacts with a base to produce a salt and water",
    },
    {
      latex: "\\text{pH} = -\\log[\\text{H}^+] \\quad (\\text{pH 7 = neutral})",
      description: "pH measures hydrogen ion concentration on a logarithmic scale — each unit is a 10x change",
    },
  ],

  theory:
    "Acids are substances that release hydrogen ions (H⁺) in water, giving solutions a sour taste and pH below 7. Bases release hydroxide ions (OH⁻), feel slippery, and have pH above 7. The pH scale runs from 0 (extremely acidic) to 14 (extremely basic), with 7 being neutral (pure water). Each step on the pH scale represents a 10-fold change in H⁺ concentration — lemon juice at pH 2 is 100,000 times more acidic than pure water at pH 7. When an acid and base mix, the H⁺ and OH⁻ ions combine to form water (H₂O) in a neutralization reaction. The remaining ions form a salt (like NaCl from HCl + NaOH). Indicators are chemicals that change color at different pH values — universal indicator turns red in strong acid, green at neutral, and purple in strong base. Strong acids (like HCl) fully dissociate in water, while weak acids (like vinegar) only partially release their H⁺ ions.",

  instructions:
    "Choose an acid and a base from the dropdown menus, then adjust the concentration. Press Play to slowly add the base to the acid and watch the pH meter and indicator color change in real time. Try to hit exactly pH 7 for a perfect neutralization. Compare how quickly strong acids neutralize versus weak acids at the same concentration.",

  challenges: [
    {
      id: "ab-ms-c1",
      question: "Your stomach uses hydrochloric acid (HCl, pH ~2) to digest food. Antacid tablets contain bases like calcium carbonate. Explain how antacids relieve heartburn using what you know about neutralization.",
      hint: "Heartburn happens when excess stomach acid (HCl) irritates the esophagus. The antacid base (CaCO₃) neutralizes the extra acid: CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂. The reaction consumes H⁺ ions, raising pH toward neutral. The CO₂ gas produced is why you sometimes burp after taking an antacid!",
      tier: "free",
    },
    {
      id: "ab-ms-c2",
      question: "If coffee has a pH of 5 and pure water has a pH of 7, how many times more acidic is the coffee than the water?",
      hint: "The pH scale is logarithmic — each unit represents a 10× change in H⁺ concentration. The difference is 7 - 5 = 2 pH units, so coffee is 10² = 100 times more acidic (has 100× more H⁺ ions) than pure water. This is why pH is so powerful — small number changes mean huge concentration differences.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["acid-base-ph", "k5-chemical-changes"],

  htmlPath: "/experiments/middle/ms-acid-base-reactions.html",

  seoTitle: "Acid-Base Reactions Simulation Middle School | Scivra Interactive Chemistry",
  seoKeywords: [
    "acid base reactions middle school simulation",
    "pH scale interactive visualization 6-8",
    "neutralization reaction simulation",
    "indicator color change chemistry",
    "NGSS MS-PS1-2 chemical reactions",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Acid-Base Reactions, pH Scale, and Neutralization",
  },
  contentSections: {
    whatIsIt:
      "Acids and bases are two of the most important categories of chemicals in everyday life — from the citric acid in orange juice to the ammonia in cleaning sprays to the hydrochloric acid in your stomach. When an acid meets a base, they react in a process called neutralization, producing a salt and water. This simulation lets you choose different acids and bases, set their concentration, and watch the reaction unfold in real time. The pH meter tracks the hydrogen ion concentration on a scale from 0 (extremely acidic) to 14 (extremely basic), with 7 being neutral. Indicator dyes change color to show where the solution sits on that scale — red for strong acid, green near neutral, blue-purple for strong base. The goal is to understand not just the chemical outcome, but the particle-level reason: when acids release H+ ions and bases release OH- ions into the same solution, those particles find each other and combine into harmless water molecules.",
    parameterExplanations: {
      acidType:
        "Selects the acid used in the reaction (0=Hydrochloric, 1=Vinegar, 2=Citric, 3=Sulfuric). Hydrochloric acid (HCl, option 0) is a strong acid that fully releases its hydrogen ion in water. Sulfuric acid (H2SO4, option 3) is strong for its first proton, which fully ionizes, but the second proton dissociates only partially — making it behave as a strong acid at low concentration but less completely at high concentration. Vinegar (acetic acid, option 1) and citric acid (option 2) are weak acids — they only partially release H+ ions, so they reach the same pH change more slowly and the temperature rise during neutralization is gentler.",
      baseType:
        "Selects the base used in the reaction (0=Sodium Hydroxide, 1=Baking Soda, 2=Ammonia, 3=Calcium Hydroxide). Sodium hydroxide (NaOH, option 0) is a strong base that fully releases OH- ions. Calcium hydroxide (option 3) is also classified as a strong base but has very low solubility in water, so it cannot form highly concentrated solutions — at high concentration settings it may behave like a saturated suspension rather than a true solution. Baking soda (sodium bicarbonate, option 1) and ammonia (option 2) are weak bases that only partially ionize. Pairing a strong acid with a strong base produces the most vigorous and complete neutralization, while mixing weak acid and weak base produces a more gradual reaction.",
      concentration:
        "Sets the concentration of both solutions in moles per liter (mol/L), ranging from 0.01 to 2.0 mol/L. Concentration controls how many acid or base particles are present in a given volume. Higher concentration means more H+ or OH- ions available to react, so the neutralization is faster and the temperature change is larger. Doubling the concentration roughly doubles the rate at which pH shifts toward neutral during the mixing process.",
    },
    misconceptions: [
      {
        wrong: "Strong acids are always dangerous and weak acids are always safe.",
        correct:
          "The terms strong and weak in chemistry refer specifically to how completely an acid ionizes in water — not to how dangerous it is. Hydrofluoric acid is technically a weak acid (it does not fully ionize) but is extremely hazardous because of its other chemical properties. Conversely, carbonic acid (the weak acid in soda water) is harmless. Always check safety data, not just the strong/weak label.",
      },
      {
        wrong: "Mixing an acid and a base always produces a neutral solution at pH 7.",
        correct:
          "Neutralization reaches pH 7 only when the acid and base are mixed in exactly the right proportions (stoichiometric amounts) and when both are strong. Mixing unequal amounts leaves excess acid or base, resulting in a pH above or below 7. Mixing a weak acid with a strong base produces a basic salt solution with pH above 7 even at equal concentrations, because the weak acid cannot fully donate its H+ ions.",
      },
      {
        wrong: "The pH scale goes from 1 to 10.",
        correct:
          "The pH scale runs from 0 to 14, with 7 representing neutral (pure water at 25°C). Values below 7 are acidic and values above 7 are basic. The scale is logarithmic, meaning each whole number step represents a tenfold change in hydrogen ion concentration. A solution at pH 3 has 10 times more H+ ions than one at pH 4, and 1,000 times more than one at pH 6.",
      },
      {
        wrong: "Indicators tell you exactly what the pH is.",
        correct:
          "Color-change indicators show a range of pH values, not a precise single number. Universal indicator changes through a spectrum of colors across the pH range, but each color corresponds to a range of about 1–2 pH units. For precise pH measurement, a calibrated pH meter or probe is needed. Indicators are useful for quickly identifying whether a solution is acidic, neutral, or basic.",
      },
    ],
    teacherUseCases: [
      "Strong vs. weak acid comparison: set baseType to 0 (Sodium Hydroxide) and concentration to 0.1 mol/L. Run the reaction with acidType 0 (Hydrochloric), then repeat with acidType 1 (Vinegar) at the same concentration. Students compare the pH change rate and temperature rise, then explain at the particle level why strong acids neutralize more rapidly (MS-PS1-2).",
      "Concentration effect investigation: hold acidType at 0 (Hydrochloric) and baseType at 0 (Sodium Hydroxide). Run the reaction at concentration 0.1 mol/L, then at 1.0 mol/L. Students observe how initial pH differs based on concentration and record the temperature change during neutralization, connecting concentration to number of reactive particles.",
      "Real-world neutralization connection: model an effervescent (fizzing) antacid tablet using acidType 2 (Citric) and baseType 1 (Baking Soda). For a closer match to antacids working on stomach acid (which is mainly hydrochloric acid), use acidType 0 (Hydrochloric) with baseType 1 (Baking Soda). In either run, students observe the pH shift and discuss how antacids relieve heartburn through neutralization. As pH rises from 2 to 6, each pH unit represents a 10× decrease in H+ concentration, so going from pH 2 to pH 6 means the H+ concentration drops by a factor of 10,000 — a qualitative way to appreciate just how much acid the antacid is neutralizing.",
      "Indicator color mapping: before running the simulation, students predict what color the indicator will show at pH 2, 7, and 12. They then verify by running reactions that stop at those pH values. Students create a color chart and compare it to actual universal indicator color cards used in laboratory settings.",
      "Perfect neutralization challenge: using acidType 0 and baseType 0 at concentration 0.5 mol/L, students try to stop the addition of base at exactly pH 7. They discuss why it is difficult to hit exactly neutral and what happens just past the equivalence point — connecting to the concept of titration used in real analytical chemistry.",
    ],
    faq: [
      {
        question: "What does pH actually measure?",
        answer:
          "pH stands for 'potential of hydrogen' and measures the concentration of hydrogen ions (H+) in a solution. The formula is pH = -log[H+], which means the scale is logarithmic: each whole number step represents a tenfold change. At pH 7, the H+ and OH- concentrations are equal and the solution is neutral. Below pH 7, H+ ions outnumber OH- ions (acidic). Above pH 7, OH- ions dominate (basic). Because of the logarithmic scale, orange juice at pH 4 is 1,000 times more acidic than pure water at pH 7.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation directly supports MS-PS1-2, which asks students to analyze and interpret data on the properties of substances before and after the substances interact to determine if a chemical reaction has occurred. Acid-base neutralization provides clear evidence of a chemical reaction: color change of the indicator, temperature change during the reaction, and the formation of new substances (salt and water) that have different properties from the original reactants.",
      },
      {
        question: "Why do some acid-base reactions produce bubbles?",
        answer:
          "Bubbles form when one of the products of the reaction is a gas. When vinegar (acetic acid) reacts with baking soda (sodium bicarbonate), the products include carbon dioxide gas (CO2), which immediately bubbles out of the solution. This is also why antacid tablets fizz in water — the neutralization reaction releases CO2. Not all acid-base reactions produce gases; strong acid plus strong base typically produces only salt and water with no visible bubbling.",
      },
      {
        question: "Why does neutralization release heat?",
        answer:
          "Neutralization is typically an exothermic reaction — it releases energy as heat. When H+ and OH- ions combine to form water molecules, the new bonds formed in water release more energy than was needed to bring the ions together. The temperature rise is most noticeable when strong acids react with strong bases because the reaction goes to completion quickly and releases all that energy in a short time. This is why mixing concentrated acids and bases must be done carefully in a laboratory setting.",
      },
      {
        question: "How do our bodies use acids and bases?",
        answer:
          "The body carefully regulates pH in different compartments. Blood must stay between pH 7.35 and 7.45 — even small deviations cause serious medical problems. The stomach maintains pH around 1.5 to 2 using hydrochloric acid (HCl) for digestion. The small intestine requires a basic environment (pH 7–8) to activate digestive enzymes, so the pancreas releases bicarbonate to neutralize stomach acid before digested food enters. Saliva (pH 6.5–7.5) protects teeth from acidic foods. The body uses buffer systems — mixtures of weak acids and their salts — to resist pH changes in all these compartments.",
      },
    ],
  },
};
