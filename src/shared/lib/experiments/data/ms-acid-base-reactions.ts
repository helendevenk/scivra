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
};
