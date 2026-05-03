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
    ap: [],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["gravity", "gravitational force", "Newton's law of gravitation", "mass", "distance", "inverse square"],
  difficulty: "beginner",

  parameters: [
    { id: "m1", label: "Mass 1", unit: "×10²⁴ kg", min: 0.1, max: 20, default: 5.97, step: 0.1, tier: "free" },
    { id: "m2", label: "Mass 2", unit: "×10²² kg", min: 0.1, max: 50, default: 7.35, step: 0.1, tier: "free" },
    { id: "distance", label: "Distance", unit: "×10⁸ m", min: 0.5, max: 10, default: 3.84, step: 0.05, tier: "free" },
  ],

  formulas: [
    { latex: "F = G\\frac{m_1 m_2}{r^2}", description: "Newton's Law of Universal Gravitation (G = 6.674×10⁻¹¹ N·m²/kg²)" },
    { latex: "g = \\frac{GM}{r^2}", description: "Gravitational field strength near a source mass M at distance r — independent of test mass" },
  ],

  theory:
    "Newton's Law of Universal Gravitation states that every mass attracts every other mass with a force proportional to the product of their masses and inversely proportional to the square of the distance between them. The gravitational constant G = 6.674×10⁻¹¹ N·m²/kg² is extremely small, which is why only planetary-scale masses produce noticeable gravitational forces. This same law describes orbits, tides, and spacecraft trajectories.",
  instructions:
    "Use the Mass 1, Mass 2, and Distance sliders to test Newton's law of gravitation: F = Gm1m2/r². Start with the Earth-Moon preset, then compare Close Encounter and Geostationary-Scale Orbit to see how changing mass scale and separation changes the force arrows. Keep two sliders fixed while changing the third so the linear mass effects and inverse-square distance effect are easy to isolate.",
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
  htmlControlAliases: { m1: "sl-m1", m2: "sl-m2", distance: "sl-dist" },
  presets: [
    {
      id: "earthmoon",
      label: "Earth-Moon",
      description: "Sets Mass 1 to Earth, Mass 2 to the Moon, and Distance to the average Earth-Moon separation.",
      paramValues: { m1: 5.97, m2: 7.35, distance: 3.84 },
    },
    {
      id: "surface",
      label: "Close Encounter",
      description: "Keeps Earth as the source mass with a smaller secondary at the closest separation the slider allows — illustrates how the inverse-square term dominates at short distance.",
      paramValues: { m1: 5.97, m2: 0.5, distance: 0.5 },
    },
    {
      id: "orbit",
      label: "Geostationary-Scale Orbit",
      description: "Smaller secondary mass at a separation comparable to geostationary altitude (~4.2×10⁷ m), useful for comparing orbital-radius effects.",
      paramValues: { m1: 5.97, m2: 0.42, distance: 0.5 },
    },
  ],

  contentSections: {
    whatIsIt:
      "Two bowling balls sitting a meter apart on a frictionless floor would, if you waited long enough, drift toward each other and gently kiss. Gravity pulls every pair of masses in the universe together, but the force is so weak between everyday objects that you never notice. This lab makes that invisible tug visible: drag two spheres around the workspace, change their masses, change the gap between them, and the force arrows respond instantly. You will verify Newton's Law of Universal Gravitation directly — F equals G times the product of the masses divided by the square of the separation — and discover why the inverse-square distance term dominates the behavior. By the end, you should be able to predict whether tripling a mass or halving a distance produces a bigger change in gravitational force, and explain why the gravitational constant G is one of the smallest numbers in physics.",
    parameterExplanations: {
      m1:
        "Mass 1 is the larger source mass, measured in units of ×10²⁴ kg. In Newton's law of gravitation, force is directly proportional to this mass: doubling Mass 1 doubles the force on Mass 2 when Distance and Mass 2 stay fixed. This supports AP Physics 1 and HS-PS2-4 modeling because students can isolate one variable and connect the slider value to the symbolic term m1. In the Earth-Moon preset, Mass 1 represents Earth, making it clear why planetary masses produce forces that are enormous compared with everyday objects even though G is very small.",
      m2:
        "Mass 2 is the second object, measured in units of ×10²² kg. Increasing Mass 2 increases the gravitational force by the same factor, but Newton's third law still says both objects pull on each other with equal force magnitudes. The difference is acceleration: the smaller object changes motion more noticeably because a = F/m. Use the Earth-Moon preset to compare a massive planet and a smaller moon, then use Close Encounter to treat Mass 2 as a test object. This helps students distinguish gravitational force from gravitational field strength, a key AP Physics 1 idea.",
      distance:
        "Distance is the center-to-center separation between the two masses, measured in units of ×10⁸ m. It appears in the denominator as r², so it has a quadratic effect: doubling Distance divides the force by four, while cutting Distance in half multiplies the force by four. This is the inverse-square pattern behind orbital motion, tides, and surface gravity. Keep Mass 1 and Mass 2 fixed while changing only Distance to see why radius is so important in HS-PS2-4 mathematical representations. The Geostationary-Scale Orbit preset makes this especially visible by using a much smaller separation.",
    },
    misconceptions: [
      {
        wrong:
          "Heavier objects fall faster because gravity pulls harder on them.",
        correct:
          "Gravity does pull harder when Mass 2 is larger, but acceleration is F/m, so the extra mass cancels for objects near the same source mass. In vacuum, a feather and a hammer hit the ground together. Use the Close Encounter preset to connect this idea to g = GM/r²: the field depends on Mass 1 and Distance, not on the test object's mass.",
      },
      {
        wrong:
          "If I double the Distance between two masses, the gravitational force gets cut in half.",
        correct:
          "Force falls as the inverse square, not the inverse, of Distance. Doubling Distance divides the force by four, not two. Keep Mass 1 and Mass 2 fixed, then move only the Distance slider to see why orbital mechanics is so sensitive to radius.",
      },
      {
        wrong:
          "Gravity only matters between huge objects like planets and stars — two people don't pull on each other at all.",
        correct:
          "Two people do attract each other gravitationally, but the force is far too small to notice because their masses are tiny compared with planets and moons. The Earth-Moon preset uses planetary-scale values so the same law produces a measurable astronomical force.",
      },
      {
        wrong:
          "The bigger object pulls on the smaller one harder than the smaller one pulls back.",
        correct:
          "Both forces have the exact same magnitude — that's Newton's third law. In the Earth-Moon preset, Earth pulls on the Moon with the same force that the Moon pulls on Earth. Earth accelerates less because its mass is much larger, not because the force on Earth is smaller.",
      },
    ],
    teacherUseCases: [
      "HS-PS2-4 inverse-square discovery: set the Earth-Moon preset, keep Mass 1 and Mass 2 fixed, then have students vary Distance and graph force versus 1/r².",
      "MS-PS2-4 force-pattern probe: use the three presets as class stations, asking students to describe how stronger and weaker gravitational interactions depend on mass and separation.",
      "Mass proportionality check: hold Distance constant, change Mass 1 by a known factor, and have students predict and verify the matching factor change in force. Repeat with Mass 2 to show symmetry.",
      "Surface gravity bridge: use the Close Encounter preset to derive g = GM/r² from F = GMm/r², emphasizing why the test mass cancels when calculating acceleration near Earth.",
      "Orbital pre-lab: use the Geostationary-Scale Orbit preset after Earth-Moon so students can explain why smaller orbital radius creates stronger gravity before introducing centripetal force.",
    ],
    faq: [
      {
        question: "Why is the gravitational constant G so incredibly small?",
        answer:
          "G is about 6.67×10⁻¹¹ N·m²/kg², which means two 1 kg masses one meter apart pull on each other with about 6.67×10⁻¹¹ newtons — far below anything you can feel. G is small because gravity is the weakest of the four fundamental forces; it only feels strong to us because Earth has 6×10²⁴ kg piled up beneath our feet. This experiment uses astronomical-scale Mass 1 and Mass 2 values so the effect becomes visible, especially in the Earth-Moon preset.",
      },
      {
        question: "Does gravity ever push instead of pull?",
        answer:
          "Newtonian gravity is always attractive — the force points along the line joining the two masses, toward the other mass. There is no negative-mass particle in our universe (so far), so gravity has no repulsive partner the way electric charges do. On cosmological scales, dark energy behaves as if it pushes space apart, but that's a different effect from the gravitational force this lab models.",
      },
      {
        question: "How does this lab connect to AP Physics 1 standards 2.B.1 and 2.B.2?",
        answer:
          "AP Physics 1 standard 2.B.1 asks students to model the gravitational field of a single source mass and predict how a test mass behaves in it; 2.B.2 extends that to comparing fields and forces at different points. By varying Mass 1, Mass 2, and Distance and tracking the force arrows, you are doing exactly that: building intuition for how a gravitational field strength g = GM/r² depends on the source mass and distance, independent of the test mass that probes it.",
      },
      {
        question: "Why doesn't the simulation show acceleration in addition to force?",
        answer:
          "The lab shows force directly so you can verify F = GMm/r² without mixing it with the object's response. Once you have force, acceleration is just a = F/m. The Close Encounter preset helps separate these ideas: changing Mass 2 changes the force, but the gravitational field near the same Mass 1 at the same Distance is still g = GM/r².",
      },
      {
        question: "How do the Earth-Moon, Close Encounter, and Geostationary-Scale Orbit presets help?",
        answer:
          "The Earth-Moon preset gives a realistic astronomical baseline. Close Encounter keeps Earth as Mass 1 and uses a much smaller Distance to connect universal gravitation with g near Earth's surface. Geostationary-Scale Orbit uses a smaller separation than Earth-Moon, making the inverse-square effect easier to see before students study circular motion and orbits.",
      },
      {
        question: "How does this connect to NGSS HS-PS2-4?",
        answer:
          "NGSS HS-PS2-4 asks students to use mathematical representations of Newton's law of gravitation to describe and predict gravitational interactions between objects. This lab is the canonical sandbox for that performance expectation: change the inputs (Mass 1, Mass 2, Distance), read the output (force), and check that the algebra matches what you observe.",
      },
    ],
  },
};
