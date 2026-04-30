import type { Experiment } from "@/shared/types/experiment";

export const balloonsStaticElectricity: Experiment = {
  id: "balloons-static-electricity",
  slug: "balloons-static-electricity-simulation",
  title: "Balloons and Static Electricity",
  subtitle: "Charge objects and observe electrostatic attraction",
  description:
    "Rub a balloon on a sweater to charge it with static electricity, then watch it attract pieces of paper or stick to a wall. Visualize electric charges and understand the basics of electrostatics.",
  thumbnail: "/imgs/experiments/electric-field-lines.png",

  standards: {
    ngss: ["HS-PS2-4", "HS-PS2-5"],
    gcse: ["AQA P2.1"],
    ap: ["CHA-1.A", "CHA-1.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["static electricity", "charge", "electrostatics", "attraction", "repulsion", "polarization"],
  difficulty: "beginner",

  parameters: [
    { id: "charge_amount", label: "Charge Amount", unit: "nC", min: 0, max: 100, default: 20, step: 1, tier: "free" },
    { id: "wall_present", label: "Wall Distance", unit: "cm", min: 5, max: 50, default: 20, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "F = k\\frac{q_1 q_2}{r^2}", description: "Coulomb's Law" },
    { latex: "E = \\frac{F}{q}", description: "Electric field" },
  ],

  theory:
    "Static electricity results from the transfer of electrons between materials. When a balloon is rubbed against a sweater, electrons transfer from the sweater to the balloon, giving the balloon a net negative charge. The charged balloon attracts neutral objects by inducing charge separation (polarization). Like charges repel; unlike charges attract. This is governed by Coulomb's Law.",
  instructions:
    "Rub the balloon on the sweater by clicking and dragging. The balloon becomes negatively charged. Bring it near paper scraps or the wall to observe attraction. The charge visualization shows + and - symbols.",
  challenges: [
    { id: "bse-c1", question: "Why does a charged balloon attract a neutral wall?", hint: "The balloon induces charge separation in the wall material", tier: "free" },
    { id: "bse-c2", question: "What happens if you rub two balloons and bring them together?", hint: "Both get the same sign charge from the sweater", tier: "free" },
    { id: "bse-c3", question: "How does charge decay over time in a humid environment?", hint: "Water molecules conduct charge away from the surface", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["coulombs-law", "electric-field-lines", "john-travoltage"],

  seoTitle: "Balloons and Static Electricity Simulation | AP Physics 2 Virtual Lab",
  seoKeywords: ["static electricity", "electrostatics", "balloon charge", "Coulomb's law", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Static Electricity, Electrostatics" },

  contentSections: {
    whatIsIt:
      "Drag a balloon across your hair on a dry day, peel it off, and stick it to the wall — that quiet trick is centuries-old physics. Rubbing transfers electrons between two materials with different appetites for them; rubber loves electrons more than wool does, so the balloon ends up with a slight excess of negative charge and the sweater the same amount of positive charge. Total charge hasn't changed, just been redistributed. Bring the charged balloon near a neutral wall and the wall's electrons shuffle slightly away, leaving a thin positive layer on the surface facing the balloon. The two opposite charges, separated by a tiny gap, pull harder than the distant negatives push, and the balloon clings. In the lab below, you control how much charge sits on the balloon and how far the wall sits, and the visualization tracks every plus and minus sign.",
    parameterExplanations: {
      charge_amount:
        "The net charge transferred to the balloon, measured in nanocoulombs. Larger values mean more electrons were stripped from the sweater, so the balloon's electric force on nearby objects grows quickly. For a simple induced-charge wall model, doubling the balloon charge can make the attraction roughly four times larger.",
      wall_present:
        "The distance between the balloon and the wall, in centimeters. Coulomb's law makes attraction fall as 1/r², so moving from 10 cm to 20 cm cuts the force to one-quarter; bring the balloon closer and the force shoots up fast as the gap shrinks.",
    },
    misconceptions: [
      {
        wrong:
          "Rubbing the balloon creates new charge out of nowhere.",
        correct:
          "Charge is conserved. The balloon gains exactly as many electrons as the sweater loses. If you measured both right after the rub, the balloon's negative charge would equal the sweater's positive charge to the last electron — nothing was created, only moved.",
      },
      {
        wrong:
          "The wall has to be charged for the balloon to stick to it.",
        correct:
          "The wall is neutral, but a charged balloon polarizes it. Electrons in the wall drift slightly away from the balloon's negative surface, leaving the near-side molecules positive and the far-side negative. The closer positive layer wins by 1/r², so the balloon feels net attraction even though the wall has no net charge.",
      },
      {
        wrong:
          "Static electricity is just sparks and zaps — that's the whole phenomenon.",
        correct:
          "Sparks are the discharge, not the charge itself. Static electricity is the silent accumulation of charge imbalance — the balloon clinging to the wall, dust gathering on a TV screen, hair standing up after a hat. The spark only appears when stored charge finds a sudden path back to ground.",
      },
      {
        wrong:
          "Two balloons rubbed on the same sweater will attract each other because they're charged.",
        correct:
          "They will repel. Both end up with the same sign of charge (negative) from the same kind of rubbing, and like charges repel. You can verify this by hanging two balloons from threads and rubbing both on a sweater — they swing apart, not together.",
      },
    ],
    teacherUseCases: [
      "Pre-lab demo: rub a real balloon on hair, stick it to a wall, then have students predict on paper what will happen if you double the charge before they touch the simulation.",
      "Have students record the wall-attraction force at five different distances at fixed charge, plot F vs 1/r², and confirm the inverse-square law graphically.",
      "Pair experiment: one student varies charge with distance fixed, the other varies distance with charge fixed; combine results to show F ∝ q · (1/r²).",
      "Misconception probe: ask 'why doesn't the wall need to be charged for the balloon to stick?' before showing the polarization animation in the simulation.",
      "Real-world tie-in: discuss why touching a TV screen makes dust jump to your finger, then have students explain it using the balloon-and-wall mechanism.",
    ],
    faq: [
      {
        question: "Why does the balloon become negative and the sweater become positive?",
        answer:
          "Different materials hold onto their outermost electrons with different strengths, ranked on the triboelectric series. Wool holds them loosely; rubber holds them tightly. When the two surfaces rub, electrons hop from wool to rubber, leaving the balloon negative and the sweater positive. Swap to a glass rod on silk and the direction reverses, because glass loses electrons to silk.",
      },
      {
        question: "Why does a charged balloon eventually fall off the wall?",
        answer:
          "Air carries water vapor, especially indoors at typical humidity, and water molecules conduct charge slowly off the balloon. Over minutes the excess electrons drift away to ground through the moist air, the polarization in the wall fades, and the attractive force becomes too weak to support the balloon's weight. In dry winter air the balloon sticks much longer.",
      },
      {
        question: "Can two neutral objects attract each other through charge polarization?",
        answer:
          "Two truly neutral objects with no charged neighbor cannot attract each other electrostatically — there's nothing to polarize them. But a charged third object can polarize both, and the two then experience forces from it. That is why a charged balloon picks up small bits of paper that were sitting next to each other, even though the bits weren't attracting before.",
      },
      {
        question: "How does this lab map to AP Physics 2 standard CHA-1.A?",
        answer:
          "CHA-1.A asks students to describe how objects acquire net charge and how charged and neutral objects exert forces on each other. Rubbing the balloon, watching its plus/minus tally update, and predicting wall attraction at varying distances is the exact reasoning the AP exam tests when it asks about conservation of charge, polarization, and Coulomb's law in qualitative scenarios.",
      },
      {
        question: "Is the force on the wall the same as the force on the balloon?",
        answer:
          "Yes — Newton's third law applies. The balloon pulls on the wall's polarized layer with exactly the same force the wall's polarized layer pulls back on the balloon. The wall doesn't visibly move because it is attached to the building, but in principle a free-floating wall would accelerate toward the balloon at the same rate the balloon accelerates toward it (scaled by their mass ratio).",
      },
    ],
  },
};
