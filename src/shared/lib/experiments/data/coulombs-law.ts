import type { Experiment } from "@/shared/types/experiment";

export const coulombsLaw: Experiment = {
  id: "coulombs-law",
  slug: "coulombs-law-electric-force",
  title: "Coulomb's Law",
  subtitle: "Measure the electric force between charged particles",
  description:
    "Place two charged particles and measure the electrostatic force between them. Verify the inverse-square relationship with distance and the linear relationship with charge magnitude.",
  thumbnail: "/imgs/experiments/electric-field-lines.png",

  standards: {
    ngss: ["HS-PS2-4", "HS-PS2-5"],
    gcse: ["AQA P2.2"],
    ap: ["CHA-1.A", "CHA-1.B", "CHA-1.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["Coulomb's law", "electric force", "charge", "inverse square", "electrostatics"],
  difficulty: "intermediate",

  parameters: [
    { id: "q1", label: "Charge 1", unit: "nC", min: -10, max: 10, default: 1, step: 0.1, tier: "free" },
    { id: "q2", label: "Charge 2", unit: "nC", min: -10, max: 10, default: -1, step: 0.1, tier: "free" },
    { id: "distance", label: "Separation", unit: "cm", min: 1, max: 50, default: 10, step: 0.5, tier: "free" },
  ],

  formulas: [
    { latex: "F = k\\frac{|q_1 q_2|}{r^2}", description: "Coulomb's Law (k = 8.99×10⁹ N·m²/C²)" },
    { latex: "E = \\frac{F}{q} = k\\frac{q}{r^2}", description: "Electric field from point charge" },
  ],

  theory:
    "Coulomb's Law describes the electrostatic force between two point charges. The force is proportional to the product of the charges and inversely proportional to the square of the distance between them. Like charges repel; unlike charges attract. The law is the electric analogue of Newton's Law of Universal Gravitation, and both follow the inverse-square relationship.",
  instructions:
    "Drag the charges to change their separation. Adjust charge magnitudes and signs. The force arrows scale with the force magnitude. Toggle the force vs. distance graph to verify the inverse-square law.",
  challenges: [
    { id: "cl-c1", question: "If you double the distance between two charges, how does the force change?", hint: "F ∝ 1/r²: doubling r reduces F by a factor of 4", tier: "free" },
    { id: "cl-c2", question: "Two +2nC charges are 10cm apart. What is the force between them?", hint: "F = 8.99×10⁹ × (2×10⁻⁹)² / (0.1)²", tier: "free" },
    { id: "cl-c3", question: "Compare Coulomb's force and gravity between two electrons. Which dominates?", hint: "Calculate F_E / F_G using the electron's charge and mass", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["electric-field-lines", "balloons-static-electricity", "electric-potential-voltage"],

  seoTitle: "Coulomb's Law Simulation | Electric Force | AP Physics 2",
  seoKeywords: ["Coulomb's law", "electric force", "charge interaction", "inverse square law", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Coulomb's Law, Electric Force, Electrostatics" },

  contentSections: {
    whatIsIt:
      "Pull a sock out of the dryer and watch it cling to a shirt — that tug is Coulomb's force in action. Every charged object pushes or pulls on every other charged object with a force that grows with the size of the charges and shrinks fast as they move apart. Charles-Augustin de Coulomb measured this in 1785 with a torsion balance and got a beautifully simple rule: F = kq₁q₂/r². The geometry is identical to Newton's law of gravity — same inverse-square fall-off, same product-of-the-sources numerator — but the strengths and signs differ. Like signs repel, unlike signs attract, and the constant k is enormous (8.99×10⁹ N·m²/C²), which is why even a tiny imbalance of charge can make your hair stand on end. In the lab below, drag two charges around and read the force off the arrows.",
    parameterExplanations: {
      q1:
        "The size and sign of the first point charge in nanocoulombs. Positive values represent a deficit of electrons; negative values represent an excess. Doubling q1 doubles the force on q2, because the law is linear in each charge.",
      q2:
        "The size and sign of the second point charge in nanocoulombs. The force between the two scales with the product q1·q2, so flipping the sign of q2 flips attraction to repulsion without changing the magnitude.",
      distance:
        "The center-to-center separation between the two charges in centimeters. Force falls as 1/r², so moving from 10 cm to 20 cm cuts the force to one-quarter, and moving from 10 cm to 5 cm quadruples it.",
    },
    misconceptions: [
      {
        wrong:
          "If I double the distance between two charges, the force is cut in half.",
        correct:
          "Force depends on 1/r², not 1/r. Doubling the distance divides the force by 4, tripling it divides by 9, and halving the distance multiplies the force by 4. The inverse-square law is exactly the same geometry as Newton's gravity.",
      },
      {
        wrong:
          "Two charges only feel each other's force when they are close enough to touch or when one is much bigger.",
        correct:
          "The Coulomb force has infinite range. Even at a kilometer two charges still pull on each other; the force is just very small. Distance never makes the force zero, only smaller, and the law applies regardless of the relative sizes of q1 and q2.",
      },
      {
        wrong:
          "A neutral object cannot feel a force from a charged one because it has no charge to push or pull on.",
        correct:
          "A nearby charge polarizes a neutral object — pulls its internal positives one way and negatives the other. The slightly closer side wins because of 1/r², so the net force is attractive. That is why a charged balloon sticks to a neutral wall.",
      },
      {
        wrong:
          "Coulomb's force on q1 from q2 is bigger when q2 is bigger, but the force back on q2 stays the same.",
        correct:
          "Newton's third law applies. The force q1 feels from q2 is equal in magnitude and opposite in direction to the force q2 feels from q1, no matter how lopsided the charges are. A 10 nC charge tugs a 0.1 nC charge with the same force the 0.1 nC charge tugs back.",
      },
    ],
    teacherUseCases: [
      "Ask students to record force at five separations with charges fixed, plot F vs 1/r², and confirm the line goes through the origin.",
      "Run a prediction round: tell students you are about to triple q1, and have them write down the new force before you change the slider.",
      "Pair lab: one student fixes q1 and varies q2 linearly; the other fixes q2 and varies r. Combine results to verify both factors of the law independently.",
      "Compare the gravitational and electric force between two electrons numerically, using the lab to motivate why electricity dominates atomic physics.",
      "Pause the simulation with one positive and one negative charge, ask 'are the two force arrows the same length?' to surface third-law misconceptions before unpausing.",
    ],
    faq: [
      {
        question: "Why is Coulomb's law an inverse-square law instead of inverse-linear?",
        answer:
          "Because field lines from a point charge spread out in three dimensions. The same number of lines passes through every imaginary sphere centered on the charge, and a sphere's surface area grows as 4πr². So the field density — and the force on a test charge — falls as 1/r². The same geometric argument explains why gravity and light intensity also follow 1/r².",
      },
      {
        question: "How is Coulomb's law different from Newton's law of gravity?",
        answer:
          "The shape is identical: F = (constant)(source 1)(source 2)/r². The differences are charge has two signs (so the force can attract or repel) while mass has only one (gravity always attracts). For two electrons, the dimensionless force ratio k e²/(G m_e²) is about 10⁴², so electric repulsion overwhelms gravitational attraction.",
      },
      {
        question: "Does Coulomb's law work for objects that aren't point charges?",
        answer:
          "Strictly, the formula F = kq₁q₂/r² is for point charges. For extended objects you integrate over the charge distribution. Two key shortcuts: a uniformly charged sphere acts like a point charge at its center for any external observer, and at distances much larger than an object's size, any blob of charge looks like a point. AP Physics 2 mostly uses these idealizations.",
      },
      {
        question: "How does this connect to AP Physics 2 standard CHA-1.A?",
        answer:
          "CHA-1.A asks students to describe the electric force between charged objects using Coulomb's law, including how the force depends on charge magnitudes and separation. Sliding q1, q2, and r in this lab while watching the arrows is the exact reasoning the AP exam tests when it asks 'what happens to the force if charge doubles and distance triples?' on multiple-choice questions.",
      },
      {
        question: "What does the negative sign in F = -kq₁q₂/r² mean if I see one?",
        answer:
          "Some textbooks add a minus sign to indicate attractive force along the line between charges; others let the sign of the charge product do that work. In the version on the simulation panel the sign of q1·q2 tells you the direction: positive product means repulsion (force points outward), negative product means attraction (force points along the connecting line toward the other charge).",
      },
    ],
  },
};
