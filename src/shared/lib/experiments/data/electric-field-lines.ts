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
  primaryStandard: "ap-physics-1",
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

  hook: {
    question: "Can you feel the electric force from your phone charger? It's there — you just can't sense it.",
    context: "Electric fields surround every charged object. The field from your phone charger is real but far too weak for human perception — you'd need billions of times more charge to feel a tingle.",
    actionPrompt: "Start the experiment →",
  },

  learningCards: [
    {
      id: "ef-lc1",
      title: "Field Line Rules",
      content: "Electric field lines start on positive charges and end on negative charges. They never cross — if they did, a test charge at the crossing point would have two directions to go, which is physically impossible. The density of lines represents field strength.",
      relatedParameterId: "charge1",
    },
    {
      id: "ef-lc2",
      title: "Coulomb's Law",
      content: "The electric force between two point charges follows an inverse-square law, just like gravity. Double the distance and the force drops to one-quarter. Double either charge and the force doubles.",
      formula: { latex: "F = k_e \\frac{|q_1 q_2|}{r^2}", description: "Force between two point charges, where k = 8.99 × 10⁹ N·m²/C²" },
      relatedParameterId: "separation",
    },
    {
      id: "ef-lc3",
      title: "Superposition Principle",
      content: "When multiple charges are present, the total electric field at any point is the vector sum of the individual fields. This means you calculate each charge's contribution independently, then add them as vectors — direction matters!",
      formula: { latex: "\\vec{E}_{total} = \\sum_i \\vec{E}_i", description: "Total field is the vector sum of all individual fields" },
      relatedParameterId: "charge3",
    },
    {
      id: "ef-lc4",
      title: "Equipotential Surfaces",
      content: "An equipotential surface connects all points at the same electric potential. No work is done moving a charge along an equipotential. These surfaces are always perpendicular to field lines — this is a powerful geometric tool for visualizing fields.",
      formula: { latex: "\\vec{E} = -\\nabla V", description: "The electric field points in the direction of steepest potential decrease" },
      relatedParameterId: "showEquipotential",
    },
    {
      id: "ef-lc5",
      title: "Dipole Fields",
      content: "A pair of equal and opposite charges (a dipole) creates a characteristic field pattern: lines arc from the positive charge to the negative charge. Far from the dipole, the field falls off as 1/r³ — faster than a single charge. Water molecules are permanent dipoles, which is why water is such a good solvent.",
      relatedParameterId: "charge2",
    },
  ],

  easterEggs: [
    {
      parameterId: "charge1",
      condition: "max",
      effect: "extreme-field-density",
      message: "10 nanocoulombs! That's about 62 billion excess electrons. The field lines are so dense they'd ionize the air — you'd see sparks in real life.",
    },
    {
      parameterId: "separation",
      condition: "min",
      effect: "intense-force-glow",
      message: "At 0.5 m separation with these charges, the force is 16× stronger than at 2 m. Inverse square law in action!",
    },
    {
      parameterId: "charge1",
      condition: "specific",
      triggerValue: 0,
      effect: "neutral-charge-fade",
      message: "Zero charge — the field vanishes! Only charge 2 contributes now. A truly neutral object creates no electric field.",
    },
  ],

  challenges: [
    {
      id: "ef-c1",
      question: "At the midpoint between a +5 nC and −5 nC charge separated by 2 m, what is the direction of the electric field?",
      options: ["Toward the positive charge", "Toward the negative charge", "Perpendicular to the line joining them", "The field is zero at the midpoint"],
      correctAnswer: "Toward the negative charge",
      hint: "Each charge contributes a field at the midpoint. Add them as vectors — they point in the same direction here.",
      relatedParameterId: "charge1",
      tier: "free",
    },
    {
      id: "ef-c2",
      question: "Two equal positive charges: where is the electric field zero?",
      options: ["At the midpoint between them", "Closer to the larger charge", "At infinity only", "Nowhere — it's never zero"],
      correctAnswer: "At the midpoint between them",
      hint: "By symmetry, the fields cancel at the midpoint. Set q₁=q₂=+5 and observe.",
      relatedParameterId: "charge2",
      tier: "free",
    },
    {
      id: "ef-c3",
      question: "Calculate the force between +5 nC and −5 nC charges separated by 2 m.",
      options: ["5.6 × 10⁻⁸ N", "1.1 × 10⁻⁷ N", "2.2 × 10⁻⁷ N", "4.5 × 10⁻⁷ N"],
      correctAnswer: "5.6 × 10⁻⁸ N",
      hint: "F = kq₁q₂/r². Use k = 8.99×10⁹.",
      relatedParameterId: "separation",
      tier: "free",
    },
    {
      id: "ef-c4",
      question: "Two +3 nC charges and one −6 nC charge form a triangle. Describe the field at the center.",
      options: ["Zero by symmetry", "Points toward the −6 nC charge", "Points away from all charges", "Points toward the midpoint of the two positive charges"],
      correctAnswer: "Points toward the −6 nC charge",
      hint: "Use superposition. Enable the third charge and set q₁=q₂=+3, q₃=−6 in a triangular configuration.",
      relatedParameterId: "charge3",
      tier: "pro",
    },
    {
      id: "ef-c5",
      question: "Why are equipotential surfaces always perpendicular to field lines? Give a physical argument.",
      options: ["Because charges move along equipotentials", "Because no work is done along an equipotential, requiring E⊥displacement", "Because field lines are always straight", "Because equipotential surfaces are always spherical"],
      correctAnswer: "Because no work is done along an equipotential, requiring E⊥displacement",
      hint: "Moving along an equipotential does no work (ΔV=0). Work = qE·d = 0 requires E⊥d.",
      relatedParameterId: "showEquipotential",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["em-spectrum", "lorentz-force"],

  seoTitle: "Electric Field Lines — Interactive 3D Visualization | Scivra",
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
