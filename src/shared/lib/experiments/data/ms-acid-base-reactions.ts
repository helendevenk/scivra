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
      id: "acidConcentration",
      label: "Acid Concentration",
      unit: "%",
      min: 0,
      max: 100,
      default: 50,
      step: 1,
      tier: "free",
    },
    {
      id: "baseConcentration",
      label: "Base Concentration",
      unit: "%",
      min: 0,
      max: 100,
      default: 50,
      step: 1,
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
    "Use the Acid Concentration and Base Concentration sliders to change the relative amounts of acidic and basic solution. Watch the pH meter, ion concentrations, and indicator color respond as you move the sliders. Try balancing the two sliders to reach pH 7, then push one side higher to compare acidic and basic conditions.",

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
  htmlControlAliases: { acidConcentration: "sl-acid", baseConcentration: "sl-base" },
  contentSections: {
    whatIsIt:
      "Acids and bases are two of the most important categories of chemicals in everyday life — from the citric acid in orange juice to the ammonia in cleaning sprays to the hydrochloric acid in your stomach. When an acid meets a base, they react in a process called neutralization, producing a salt and water. This simulation lets you choose different acids and bases, set their concentration, and watch the reaction unfold in real time. The pH meter tracks the hydrogen ion concentration on a scale from 0 (extremely acidic) to 14 (extremely basic), with 7 being neutral. Indicator dyes change color to show where the solution sits on that scale — red for strong acid, green near neutral, blue-purple for strong base. The goal is to understand not just the chemical outcome, but the particle-level reason: when acids release H+ ions and bases release OH- ions into the same solution, those particles find each other and combine into harmless water molecules.",
    parameterExplanations: {
      acidConcentration:
        "Acid Concentration controls how much acidic solution contributes H+ ions to the mixture. Raising this slider increases the acid side of the balance, so the pH drops below 7 and the indicator shifts toward acidic colors. Lowering it reduces the number of acid particles available to neutralize the base. Keep Base Concentration steady while changing this slider to isolate how added acid changes hydrogen ion concentration, pH, and the visual indicator. When both sliders are near balance, the model approaches neutral conditions because H+ and OH- ions combine to form water.",
      baseConcentration:
        "Base Concentration controls how much basic solution contributes OH- ions to the mixture. Raising this slider increases the base side of the balance, so the pH rises above 7 and the indicator shifts toward basic colors. Lowering it leaves fewer hydroxide ions available to react with acid. Keep Acid Concentration steady while changing this slider to see how added base changes hydroxide ion concentration, pH, and the status readout. When the base amount matches the acid amount closely, neutralization uses up much of both ion types and the solution moves toward pH 7.",
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
      "Acid-side investigation: keep Base Concentration at 50 and move Acid Concentration from 20 to 80. Students record pH, indicator color, and status changes, then explain how increasing H+ ions provides evidence for a chemical interaction (MS-PS1-2).",
      "Base-side investigation: keep Acid Concentration at 50 and move Base Concentration from 20 to 80. Students compare the pH trend with the acid-side run and describe how OH- ions shift the solution toward basic conditions.",
      "Neutralization balance challenge: students adjust only the Acid Concentration and Base Concentration sliders until the pH meter reaches as close to 7 as possible. They explain why balanced H+ and OH- amounts produce a neutral solution.",
      "Indicator color mapping: students set acidic, neutral, and basic slider combinations, then create a table linking observed indicator colors to pH ranges and ion dominance.",
      "Real-world antacid discussion: start with Acid Concentration higher than Base Concentration, then raise Base Concentration until pH moves toward neutral. Students connect the model to how a base can reduce excess stomach acid.",
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
