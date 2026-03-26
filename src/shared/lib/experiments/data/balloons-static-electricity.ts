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
  gradeLevel: "AP",
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
};
