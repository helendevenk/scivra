import type { Experiment } from "@/shared/types/experiment";

export const gravityForceLabBasics: Experiment = {
  id: "gravity-force-lab-basics",
  slug: "gravity-force-lab-basics",
  title: "Gravity Force Lab: Basics",
  subtitle: "Discover how mass and distance affect gravitational force",
  description:
    "Adjust the masses of two objects and the distance between them to see how gravity changes. Verify Newton's Law of Universal Gravitation and compare gravitational force on different planets.",
  thumbnail: "/imgs/experiments/gravitational-fields.png",

  standards: {
    ngss: ["HS-PS2-4"],
    gcse: ["AQA P5.7"],
    ap: ["2.B.1", "2.B.2"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["gravity", "gravitational force", "Newton's law of gravitation", "mass", "distance", "inverse square"],
  difficulty: "beginner",

  parameters: [
    { id: "m1", label: "Mass 1", unit: "kg", min: 1, max: 1000, default: 100, step: 1, tier: "free" },
    { id: "m2", label: "Mass 2", unit: "kg", min: 1, max: 1000, default: 100, step: 1, tier: "free" },
    { id: "distance", label: "Distance", unit: "m", min: 0.1, max: 10, default: 2, step: 0.1, tier: "free" },
  ],

  formulas: [
    { latex: "F = G\\frac{m_1 m_2}{r^2}", description: "Newton's Law of Universal Gravitation (G = 6.674×10⁻¹¹ N·m²/kg²)" },
  ],

  theory:
    "Newton's Law of Universal Gravitation states that every mass attracts every other mass with a force proportional to the product of their masses and inversely proportional to the square of the distance between them. The gravitational constant G = 6.674×10⁻¹¹ N·m²/kg² is extremely small, which is why only planetary-scale masses produce noticeable gravitational forces. This same law describes orbits, tides, and spacecraft trajectories.",
  instructions:
    "Drag the masses to adjust their sizes and separation. The force arrows update in real time. Use the grid to measure distance. Compare the force calculated to the formula. Change both masses to see how F scales.",
  challenges: [
    { id: "gfl-c1", question: "If you triple the distance between two masses, how does gravity change?", hint: "F ∝ 1/r² → tripling r reduces F by factor 9", tier: "free" },
    { id: "gfl-c2", question: "Why do you not feel gravitational attraction to the person next to you?", hint: "G is tiny (10⁻¹¹); typical person masses give force ~ 10⁻⁷ N", tier: "free" },
    { id: "gfl-c3", question: "How does surface gravity g relate to Newton's Law?", hint: "At Earth's surface: g = GM_Earth/R_Earth²", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["gravity-orbits", "gravitational-fields", "keplers-laws"],

  seoTitle: "Gravity Force Lab — Newton's Law of Gravitation | AP Physics 1",
  seoKeywords: ["gravity", "gravitational force", "Newton's universal gravitation", "inverse square law", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Gravitational Force, Newton's Law of Gravitation" },

  contentSections: {
    whatIsIt:
      "Two bowling balls sitting a meter apart on a frictionless floor would, if you waited long enough, drift toward each other and gently kiss. Gravity pulls every pair of masses in the universe together, but the force is so weak between everyday objects that you never notice. This lab makes that invisible tug visible: drag two spheres around the workspace, change their masses, change the gap between them, and the force arrows respond instantly. You will verify Newton's Law of Universal Gravitation directly — F equals G times the product of the masses divided by the square of the separation — and discover why the inverse-square distance term dominates the behavior. By the end, you should be able to predict whether tripling a mass or halving a distance produces a bigger change in gravitational force, and explain why the gravitational constant G is one of the smallest numbers in physics.",
    parameterExplanations: {
      m1:
        "The mass of the first sphere in kilograms. Gravitational force scales linearly with this mass — double m1 and the attraction on m2 doubles, but the acceleration of m2 also depends on its own mass.",
      m2:
        "The mass of the second sphere in kilograms. Newton's third law guarantees the two spheres pull on each other with equal force magnitudes, even when m1 and m2 differ by orders of magnitude.",
      distance:
        "The center-to-center separation in meters. Force falls off as 1/r², so cutting the distance in half multiplies the force by four, and tripling it divides the force by nine.",
    },
    misconceptions: [
      {
        wrong:
          "Heavier objects fall faster because gravity pulls harder on them.",
        correct:
          "Gravity does pull harder on heavier objects (F = GMm/r²), but acceleration is F/m, so the extra mass cancels. In vacuum, a feather and a hammer hit the ground together — that's why g is the same for everyone.",
      },
      {
        wrong:
          "If I double the distance between two masses, the gravitational force gets cut in half.",
        correct:
          "Force falls as the inverse square, not the inverse, of distance. Doubling r divides the force by four, not two. That's why orbital mechanics is so sensitive to small changes in altitude.",
      },
      {
        wrong:
          "Gravity only matters between huge objects like planets and stars — two people don't pull on each other at all.",
        correct:
          "Two people do attract each other gravitationally — about 10⁻⁷ N for adults a meter apart. The force exists; it's just buried under friction, normal forces, and your own weight, which is millions of times larger.",
      },
      {
        wrong:
          "The bigger object pulls on the smaller one harder than the smaller one pulls back.",
        correct:
          "Both forces have the exact same magnitude — that's Newton's third law. Earth pulls you down with the same force you pull Earth up. The reason only you accelerate noticeably is that your mass is tiny compared to Earth's.",
      },
    ],
    teacherUseCases: [
      "Inverse-square discovery: have students record force at r = 1, 2, 3, 4 m with masses fixed, then plot F vs. 1/r². The straight line through the origin is the proof.",
      "Misconception probe: ask the class to predict whether doubling m1 or halving distance gives a bigger force change, then run both in the simulator. Students who say 'doubling mass' are revealing the linear-vs-quadratic gap.",
      "Verify F ∝ m1·m2: have students set m1 = 1000 kg, m2 = 500 kg at distance 2 m and record the force, then double m2 to 1000 kg and confirm the force exactly doubles. Repeat at m1 = 200 kg to show the symmetry. Off-scale Earth-Moon numbers can then be computed with pencil and paper using the same equation, and compared to the textbook value of about 2×10²⁰ N.",
      "Pair lab with a written derivation showing how surface gravity g = GM_Earth / R_Earth² emerges directly from F = GMm/r², connecting the lab to the constant they already know.",
      "Use as a pre-lab for orbits: once students see how force depends on mass and distance, the centripetal-force version of orbital motion becomes much less mysterious.",
    ],
    faq: [
      {
        question: "Why is the gravitational constant G so incredibly small?",
        answer:
          "G is about 6.67×10⁻¹¹ N·m²/kg², which means two 1 kg masses one meter apart pull on each other with about 6.67×10⁻¹¹ newtons — far below anything you can feel. G is small because gravity is the weakest of the four fundamental forces; it only feels strong to us because Earth has 6×10²⁴ kg piled up beneath our feet. This experiment lets you crank masses up to 1000 kg to see the effect grow, but you still need a torsion balance like Henry Cavendish's to measure it in real life.",
      },
      {
        question: "Does gravity ever push instead of pull?",
        answer:
          "Newtonian gravity is always attractive — the force points along the line joining the two masses, toward the other mass. There is no negative-mass particle in our universe (so far), so gravity has no repulsive partner the way electric charges do. On cosmological scales, dark energy behaves as if it pushes space apart, but that's a different effect from the gravitational force this lab models.",
      },
      {
        question: "How does this lab connect to AP Physics 1 standards 2.B.1 and 2.B.2?",
        answer:
          "AP Physics 1 standard 2.B.1 asks students to model the gravitational field of a single source mass and predict how a test mass behaves in it; 2.B.2 extends that to comparing fields and forces at different points. By varying m1, m2, and r and tracking the force arrows, you are doing exactly that: building intuition for how a gravitational field strength g = GM/r² depends on the source, independent of the test mass m₂ that probes it.",
      },
      {
        question: "Why doesn't the simulation show acceleration in addition to force?",
        answer:
          "The lab shows force directly so you can verify F = GMm/r² without confounding it with the test mass's response. Once you have force, acceleration is just a = F/m. That separation lets you see the deep result that all test masses fall with the same acceleration g near a source, even though the force on each one differs — the cornerstone of the equivalence principle.",
      },
      {
        question: "How does this connect to NGSS HS-PS2-4?",
        answer:
          "NGSS HS-PS2-4 asks students to use mathematical representations of Newton's law of gravitation to describe and predict gravitational interactions between objects. This lab is the canonical sandbox for that performance expectation: change the inputs (masses, separation), read the output (force), and check that the algebra matches what you observe.",
      },
    ],
  },
};
