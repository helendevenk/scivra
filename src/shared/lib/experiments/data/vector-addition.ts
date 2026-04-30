import type { Experiment } from "@/shared/types/experiment";

export const vectorAddition: Experiment = {
  id: "vector-addition",
  slug: "vector-addition-components",
  title: "Vector Addition",
  subtitle: "Add vectors graphically and by components",
  description:
    "Add two or three vectors using the graphical tip-to-tail method and verify with component decomposition. Explore how forces, velocities, and displacements combine as vectors in 2D.",
  thumbnail: "/imgs/experiments/newton-laws.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P5.1"],
    ap: ["3.A.2", "3.E.1"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["vectors", "vector addition", "components", "resultant", "force vectors", "2D motion"],
  difficulty: "beginner",

  parameters: [
    { id: "v1_magnitude", label: "Vector 1 Magnitude", unit: "N", min: 0, max: 20, default: 10, step: 0.5, tier: "free" },
    { id: "v1_angle", label: "Vector 1 Angle", unit: "°", min: 0, max: 360, default: 0, step: 5, tier: "free" },
    { id: "v2_magnitude", label: "Vector 2 Magnitude", unit: "N", min: 0, max: 20, default: 8, step: 0.5, tier: "free" },
    { id: "v2_angle", label: "Vector 2 Angle", unit: "°", min: 0, max: 360, default: 90, step: 5, tier: "free" },
    { id: "v3_magnitude", label: "Vector 3 Magnitude", unit: "N", min: 0, max: 20, default: 0, step: 0.5, tier: "pro" },
  ],

  formulas: [
    { latex: "\\vec{R} = \\vec{A} + \\vec{B}", description: "Vector sum (resultant)" },
    { latex: "R_x = A_x + B_x = A\\cos\\theta_A + B\\cos\\theta_B", description: "x-components" },
    { latex: "R = \\sqrt{R_x^2 + R_y^2}", description: "Resultant magnitude" },
  ],

  theory:
    "Vectors have both magnitude and direction. Vector addition follows the parallelogram law (or tip-to-tail): place vectors head to tail and draw the resultant from start to end. Equivalently, add components separately: R_x = A_x + B_x, R_y = A_y + B_y. The magnitude and direction of the resultant follow from Pythagorean theorem and arctangent. This is the foundation for analyzing 2D forces, velocity, and displacement.",
  instructions:
    "Drag the vector arrows to set magnitude and direction. The resultant vector (green) appears automatically. Switch between graphical and component modes. Verify that tip-to-tail gives the same answer as component addition.",
  challenges: [
    { id: "va-c1", question: "Add a 10N east vector and an 8N north vector. What is the resultant magnitude and angle?", hint: "R = √(10²+8²) = √164 ≈ 12.8N; θ = arctan(8/10) ≈ 38.7° north of east", tier: "free" },
    { id: "va-c2", question: "Three forces balance (net = 0). If two are known, how do you find the third?", hint: "F₃ = −(F₁ + F₂); add F₁ and F₂ first, then negate the resultant", tier: "free" },
    { id: "va-c3", question: "A river flows east at 3 m/s. A swimmer swims north at 4 m/s relative to the water. What is their speed relative to the ground?", hint: "V_ground = √(3²+4²) = 5 m/s at arctan(3/4)=37° east of north", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["forces-motion-basics", "projectile-motion", "newtons-laws"],

  seoTitle: "Vector Addition Simulation | 2D Forces | AP Physics 1",
  seoKeywords: ["vector addition", "resultant vector", "components", "2D forces", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Vector Addition, Components, Resultant" },

  contentSections: {
    whatIsIt:
      "Two teams playing tug-of-war pull on a knot from different angles. The knot does not move along either rope; it slides along a third direction set by the combination of the two pulls. That combination is a vector sum, and almost every quantity in mechanics — force, velocity, displacement, acceleration — behaves the same way. This lab gives you control of two or three force vectors with sliders for magnitude and angle. The simulation draws each vector as an arrow, places them tip-to-tail, and shows the resultant as a green arrow from the start of the first to the tip of the last. Switch to component mode and the same answer falls out of x and y arithmetic. Both methods agree because they are the same operation, just dressed up differently.",
    parameterExplanations: {
      v1_magnitude:
        "The length of the first vector in newtons. This is the size of the pull or push, with no direction information yet — direction is set separately by the angle slider.",
      v1_angle:
        "The direction of the first vector in degrees, measured counterclockwise from the positive x-axis (east). 0° points right, 90° up, 180° left, 270° down.",
      v2_magnitude:
        "The length of the second vector in newtons. Combined with vector 1, this is your basic two-force addition problem — the simulation draws the resultant automatically.",
      v2_angle:
        "The direction of the second vector in degrees, also measured counterclockwise from east. Try 90° relative to vector 1 to get a clean Pythagorean addition.",
      v3_magnitude:
        "The length of an optional third vector in newtons (pro tier). Set to zero to deactivate; otherwise the simulation adds a third tip-to-tail leg and updates the resultant. Useful for equilibrium problems where three forces sum to zero.",
    },
    misconceptions: [
      {
        wrong:
          "If you add a 5 N vector and a 5 N vector you always get 10 N, because numbers add.",
        correct:
          "Only when the two vectors point in exactly the same direction. At 90° apart you get √(5² + 5²) ≈ 7.07 N. At 180° apart (opposite directions) you get zero. The angle between the vectors matters as much as their magnitudes.",
      },
      {
        wrong:
          "When you add vectors graphically, it doesn't matter where you place them — magnitude and angle alone determine the answer.",
        correct:
          "The values do determine the answer, but the tip-to-tail rule matters for the construction: each new vector starts at the tip of the previous one, and the resultant runs from the tail of the first to the tip of the last. Sliding a vector parallel to itself is fine; rotating it changes the answer.",
      },
      {
        wrong:
          "You should add magnitudes and add angles separately to get the resultant magnitude and angle.",
        correct:
          "Magnitudes do not add directly unless the vectors are parallel, and angles never add — the resultant angle comes from arctan(R_y / R_x) after summing components. Skipping the component step almost always produces wrong answers on AP Physics 1 free response.",
      },
      {
        wrong:
          "Three forces with non-zero magnitudes can never sum to zero.",
        correct:
          "Three forces sum to zero whenever their head-to-tail diagram closes into a triangle. A 3 N, 4 N, and 5 N force at the right angles form a closed right triangle, and their vector sum is exactly zero — that is what equilibrium means.",
      },
    ],
    teacherUseCases: [
      "Predict-then-check: have students compute the resultant of a 10 N east plus 8 N north vector by hand using components, then verify against the simulation reading. Stress that they should match exactly, not roughly.",
      "Misconception probe — the '5 + 5 = 10' trap: ask the class for the magnitude of two equal vectors at 90°. Many will say 10. Show the simulation result of about 7.07 N and use it as an entry to component arithmetic.",
      "Data collection lab: students fix v1_magnitude = 10 N at 0° and sweep v2_angle from 0° to 180° with v2_magnitude = 10 N, recording the resultant magnitude every 30°. They plot R vs angle and discover the cosine curve.",
      "Three-force equilibrium: pro tier students try to find magnitudes and angles of three vectors that produce a zero resultant. Connects directly to free-body diagrams and AP standard 3.E.1 systems analysis.",
      "Relative motion application: pose the river-crossing problem (boat plus current) as a vector sum, have students set up the simulation with the boat and current vectors, and read off the ground-frame velocity directly.",
    ],
    faq: [
      {
        question:
          "Why doesn't 5 N plus 5 N always equal 10 N?",
        answer:
          "Vectors only add to 10 N if they point exactly the same direction. If they meet at 90°, the resultant is 5√2 ≈ 7.07 N by the Pythagorean theorem. If they point opposite directions, the resultant is zero. The angle between them matters because vectors live in 2D — you have to project onto common axes (x and y components) before scalar addition makes sense.",
      },
      {
        question:
          "When should I use the graphical tip-to-tail method versus component addition?",
        answer:
          "Use tip-to-tail to build intuition and to estimate answers, especially in conceptual problems and when you sketch a free-body diagram. Use component addition for precise numerical answers. On AP Physics 1 free-response questions, graders almost always expect components: write A_x, A_y, B_x, B_y, sum them, then take √(R_x² + R_y²) for magnitude and arctan(R_y / R_x) for direction.",
      },
      {
        question:
          "How do I find the angle of the resultant after I have R_x and R_y?",
        answer:
          "Take θ = arctan(R_y / R_x), but watch the quadrant. A calculator's arctan returns values between -90° and +90°, so if R_x is negative you have to add 180° to land in the correct quadrant. The simulation handles this automatically — its angle readout uses the standard convention of measuring counterclockwise from the positive x-axis, with results between 0° and 360°.",
      },
      {
        question:
          "Why do physicists insist on using vectors for forces and velocities instead of just magnitudes?",
        answer:
          "Because direction changes the answer. A 100 N push to the east plus a 100 N push to the west produces no acceleration, while two 100 N pushes both eastward produce a 200 N net force. Magnitudes alone would predict 200 N in both cases — wrong by half. Newton's second law is a vector equation: net force and acceleration share both magnitude and direction, and getting either component wrong gets the motion wrong.",
      },
      {
        question:
          "How does this lab support AP Physics 1 standards 3.A.2 and 3.E.1?",
        answer:
          "Standard 3.A.2 covers the vector nature of forces — students must recognize that forces have direction and combine using vector addition. Standard 3.E.1 deals with systems and centers of mass and requires summing forces on a system to get net force. Both demand fluency in adding vectors graphically and by components, which is exactly what this lab drills. The three-vector pro mode also supports analyzing static equilibrium scenarios that show up on free response.",
      },
    ],
  },
};
