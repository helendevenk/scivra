import type { Experiment } from "@/shared/types/experiment";

export const electricFieldLines: Experiment = {
  id: "electric-field-lines",
  slug: "electric-field-lines",
  title: "Electric Field Lines",
  subtitle: "Visualize fields from point charges in 3D",
  description:
    "Place positive and negative charges in 3D space and watch electric field lines emerge. Observe how fields superpose from multiple charges, explore equipotential surfaces, and discover Coulomb's law through direct manipulation.",
  thumbnail: "/imgs/experiments/electric-field-lines.png",

  standards: {
    ngss: ["HS-PS2-4", "HS-PS3-5"],
    gcse: ["P7.3"],
    ap: ["2.C.1", "2.C.2", "2.C.3", "2.C.4", "3.A.2"],
  },
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["electric field", "Coulomb's law", "field lines", "equipotential", "superposition", "AP Physics 2"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "charge1",
      label: "Charge 1 (q₁)",
      unit: "×10⁻⁹ C",
      min: -10,
      max: 10,
      default: 5,
      step: 1,
      tier: "free",
    },
    {
      id: "charge2",
      label: "Charge 2 (q₂)",
      unit: "×10⁻⁹ C",
      min: -10,
      max: 10,
      default: -5,
      step: 1,
      tier: "free",
    },
    {
      id: "separation",
      label: "Charge Separation (d)",
      unit: "m",
      min: 0.5,
      max: 5,
      default: 2,
      step: 0.1,
      tier: "free",
    },
    {
      id: "charge3",
      label: "Third Charge (q₃)",
      unit: "×10⁻⁹ C",
      min: -10,
      max: 10,
      default: 0,
      step: 1,
      tier: "pro",
    },
    {
      id: "showEquipotential",
      label: "Show Equipotential Surfaces",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\vec{E} = k_e \\frac{q}{r^2}\\hat{r}",
      description: "Electric field from a point charge",
    },
    {
      latex: "k_e = 8.99 \\times 10^9 \\, \\text{N·m}^2/\\text{C}^2",
      description: "Coulomb's constant",
    },
    {
      latex: "\\vec{E}_{total} = \\sum_i \\vec{E}_i",
      description: "Superposition principle",
    },
    {
      latex: "F = k_e \\frac{|q_1 q_2|}{r^2}",
      description: "Coulomb's law (force between charges)",
    },
    {
      latex: "V = k_e \\frac{q}{r}",
      description: "Electric potential from a point charge",
    },
    {
      latex: "\\vec{E} = -\\nabla V",
      description: "Field is negative gradient of potential",
    },
  ],

  theory:
    "Electric field lines show the direction a positive test charge would move. They originate from positive charges, terminate on negative charges, and never cross. The density of field lines represents field strength. When multiple charges are present, the total field at any point is the vector sum of individual fields (superposition principle). Equipotential surfaces are perpendicular to field lines — no work is done moving a charge along an equipotential.",

  instructions:
    "Adjust the charges of two objects and their separation. Field lines draw in 3D — use your mouse to orbit and see the full structure. Try +/+ (repulsion), +/- (attraction), and equal charges. Pro users can add a third charge and toggle equipotential surfaces.",

  challenges: [
    {
      id: "ef-c1",
      question: "At the midpoint between a +5 nC and −5 nC charge separated by 2 m, what is the direction of the electric field?",
      hint: "Each charge contributes a field at the midpoint. Add them as vectors — they point in the same direction here.",
      tier: "free",
    },
    {
      id: "ef-c2",
      question: "Two equal positive charges: where is the electric field zero?",
      hint: "By symmetry, the fields cancel at the midpoint. Set q₁=q₂=+5 and observe.",
      tier: "free",
    },
    {
      id: "ef-c3",
      question: "Calculate the force between +5 nC and −5 nC charges separated by 2 m.",
      hint: "F = kq₁q₂/r². Use k = 8.99×10⁹.",
      tier: "free",
    },
    {
      id: "ef-c4",
      question: "Two +3 nC charges and one −6 nC charge form a triangle. Describe the field at the center.",
      hint: "Use superposition. Enable the third charge and set q₁=q₂=+3, q₃=−6 in a triangular configuration.",
      tier: "pro",
    },
    {
      id: "ef-c5",
      question: "Why are equipotential surfaces always perpendicular to field lines? Give a physical argument.",
      hint: "Moving along an equipotential does no work (ΔV=0). Work = qE·d = 0 requires E⊥d.",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["em-spectrum", "lorentz-force"],

  seoTitle: "Electric Field Lines — Interactive 3D Visualization | NeonPhysics",
  seoKeywords: [
    "electric field lines simulation",
    "Coulomb's law interactive",
    "electric field visualization",
    "AP Physics 2 electric fields",
    "point charge field",
    "equipotential surfaces",
    "superposition principle",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Electric Fields and Coulomb's Law",
  },
};
