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

  contentSections: {
    whatIsIt:
      "Run a comb through dry hair and the comb can pick up bits of paper from across the desk without touching them. The mechanism is an electric field — an invisible structure that surrounds every charged object and pushes or pulls on other charges nearby. This lab makes that field visible. Place one or two point charges in 3D space, dial each one positive or negative with the slider, and watch field lines stream out of positives and dive into negatives. The denser the lines, the stronger the field. Toggle equipotential surfaces on and you see the perpendicular partner of the field: shells where moving a test charge costs no work. The math behind it all is Coulomb's law and the superposition principle, both treated qualitatively here.",
    parameterExplanations: {
      charge1:
        "The size and sign of the first point charge in nanocoulombs. Positive values send field lines outward; negative values pull them inward. Larger magnitudes pack more lines into the surrounding space.",
      charge2:
        "The size and sign of the second point charge. Pair it with charge1 to see classic configurations: equal and opposite makes a dipole, equal and same-sign makes a repulsive pair with a field-free midpoint.",
      separation:
        "The distance in meters between charges 1 and 2. Because the field of each charge falls as 1/r², shrinking separation makes the local fields and forces grow extremely quickly — halving distance nearly quadruples the force.",
      charge3:
        "An optional third charge for building triangular configurations and exploring superposition with three sources at once. Set it to zero to deactivate; otherwise it contributes another field that vector-adds with the first two.",
      showEquipotential:
        "Toggle that overlays equipotential surfaces — the places where electric potential is constant. They are always perpendicular to the field lines, and no work is done when a charge moves along one. Useful for connecting field geometry to energy.",
    },
    misconceptions: [
      {
        wrong:
          "A bigger charge has a stronger field everywhere — anywhere in space the larger charge dominates.",
        correct:
          "Field strength falls off as 1/r². A small charge sitting right next to a point can produce a stronger local field than a big charge far away. 'Stronger' is always a question of where you are measuring.",
      },
      {
        wrong:
          "Field lines are real, physical strings that the charge actually emits.",
        correct:
          "Field lines are a drawing convention. The field exists everywhere in the surrounding space; the lines just show direction and approximate strength through their density. Two valid drawings can use different numbers of lines for the same physical field.",
      },
      {
        wrong:
          "Two field lines can cross at a point if the fields from two charges are strong enough.",
        correct:
          "Field lines never cross. At any point in space the net field has one definite direction (the vector sum of all source contributions), and a single line can only follow that one direction. Crossings would mean a test charge has two directions to move at once, which is impossible.",
      },
      {
        wrong:
          "At the midpoint between two equal positive charges the field is large because both charges contribute.",
        correct:
          "Both charges do contribute, but their fields point in opposite directions along the line joining them and cancel exactly. The field at the midpoint is zero — a classic symmetry result you can verify in the simulation.",
      },
      {
        wrong:
          "Equipotential surfaces are the same thing as field lines.",
        correct:
          "They are perpendicular partners. Field lines show the direction a positive test charge feels a push; equipotentials show surfaces where potential is constant. Moving along a field line costs work; moving along an equipotential costs none.",
      },
    ],
    teacherUseCases: [
      "Symmetry hunt — predict before you click: students set q₁ = q₂ = +5 nC and predict where the field is zero before enabling the visualization. Then verify the midpoint cancellation directly.",
      "Data collection on Coulomb's law: hold q₁ and q₂ fixed, vary separation from 0.5 m to 5 m in steps, record the simulation's force readout, plot F vs 1/r² and check linearity.",
      "Misconception probe at a dipole midpoint: ask students to vote on the field direction at the center of a +5 / -5 dipole. Many will pick zero by analogy with the equal-positive case — use the simulation to surface and correct the error.",
      "Equipotential / field-line orthogonality: with the equipotential toggle on, ask students to trace a path from one surface to the next and explain in writing why the path must cross every line at right angles.",
      "Three-charge configurations: pro-tier students set up an equilateral triangle of charges and predict the net field at the centroid using vector decomposition, then confirm against the simulation.",
    ],
    faq: [
      {
        question:
          "Why does the electric field from a point charge fall off as 1/r² instead of 1/r?",
        answer:
          "Imagine the charge sitting at the center of a sphere of radius r. The flux of field lines through the sphere is fixed (proportional to the enclosed charge), and that total flux is spread over the sphere's surface area, which grows as 4πr². Field strength is flux per area, so it must scale as 1/r². This is the geometric heart of both Coulomb's law and Newton's gravity — same inverse-square reason.",
      },
      {
        question:
          "What does the superposition principle mean for the field around several charges?",
        answer:
          "It means you can compute each charge's contribution independently, as if the others were not there, then add the results as vectors at every point in space. There is no interaction term between source fields. This makes complicated multi-charge configurations tractable: the simulation is literally summing the per-charge contributions at every grid point and drawing the resultant field.",
      },
      {
        question:
          "Are equipotential surfaces always perpendicular to field lines, even for weird charge arrangements?",
        answer:
          "Yes, always — it is a geometric consequence of the definition. Moving a test charge along an equipotential by definition does no work, since potential does not change. Work equals qE·d, so for arbitrary motion along the surface E must be perpendicular to d. That has to hold at every point on every equipotential, regardless of how complicated the source distribution is.",
      },
      {
        question:
          "Why can two field lines never cross?",
        answer:
          "At any location in space the net electric field has a single, well-defined direction — the vector sum of contributions from every source charge. A field line is a curve that follows that direction. If two lines crossed at a point, the field would need two directions there at once, which is contradictory. So the rule 'lines never cross' is not a stylistic choice but a logical consequence of fields being vectors.",
      },
      {
        question:
          "How does this lab connect to AP Physics 1 standards 2.C.1–2.C.4 and 3.A.2?",
        answer:
          "Standards 2.C.1–2.C.4 ask students to describe electric fields produced by point charges, apply the inverse-square law qualitatively, and use superposition to combine fields from multiple sources. 3.A.2 deals with the vector nature of forces, which is exactly what you are doing when you add per-charge field contributions at a point. The lab gives a direct, manipulable visualization of all five standards in one place.",
      },
      {
        question:
          "Is this AP Physics 1 or AP Physics 2 material?",
        answer:
          "Electric fields, Coulomb's law, and equipotentials are formally part of the AP Physics 2 curriculum, but introductory treatments are common in AP Physics 1 courses too — and they map onto NGSS HS-PS2-4 and HS-PS3-5 at the high-school level. The simulation deliberately stays qualitative (no calculus, no Gauss's law surface integrals) so it works as a first exposure for AP Physics 1 students and a refresher for AP Physics 2.",
      },
    ],
  },
};
