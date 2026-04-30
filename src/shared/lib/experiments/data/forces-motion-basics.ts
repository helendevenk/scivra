import type { Experiment } from "@/shared/types/experiment";

export const forcesMotionBasics: Experiment = {
  id: "forces-motion-basics",
  slug: "forces-motion-basics-newtons-laws",
  title: "Forces and Motion: Basics",
  subtitle: "Push objects and observe Newton's laws in action",
  description:
    "Apply forces to objects on different surfaces and observe motion. Explore static and kinetic friction, net force, and acceleration in a simple, intuitive environment perfect for building Newton's Law intuition.",
  thumbnail: "/imgs/experiments/newton-laws.png",

  standards: {
    ngss: ["HS-PS2-1", "MS-PS2-1"],
    gcse: ["AQA P5.2", "AQA P5.3"],
    ap: ["3.A.1", "3.B.1", "3.B.2"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["Newton's laws", "force", "friction", "net force", "acceleration", "motion"],
  difficulty: "beginner",

  parameters: [
    { id: "applied_force", label: "Applied Force", unit: "N", min: 0, max: 500, default: 100, step: 5, tier: "free" },
    { id: "mass", label: "Object Mass", unit: "kg", min: 1, max: 100, default: 20, step: 1, tier: "free" },
    { id: "friction_coeff", label: "Friction Coefficient", unit: "", min: 0, max: 1, default: 0.2, step: 0.01, tier: "free" },
    { id: "surface", label: "Surface Type", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "F_{net} = ma", description: "Newton's Second Law" },
    { latex: "F_{friction} = \\mu_k mg", description: "Kinetic friction force" },
    { latex: "F_{net} = F_{applied} - F_{friction}", description: "Net force" },
  ],

  theory:
    "Newton's Second Law states that the net force on an object equals its mass times acceleration. Friction opposes motion and depends on the normal force and friction coefficient. Static friction prevents motion up to a maximum threshold; kinetic friction acts during sliding. The force diagram (free body diagram) shows all forces acting on the object, and their vector sum gives the net force.",
  instructions:
    "Use the force arrows to push the object. The free body diagram updates in real time. Enable the force chart to see applied force, friction force, and net force over time. Change surfaces to see different friction coefficients in action.",
  challenges: [
    { id: "fm-c1", question: "A 20kg box has μ_k = 0.3. What applied force is needed to accelerate it at 2 m/s²?", hint: "F_net = ma = 20×2=40N; F_applied = F_net + F_friction = 40 + 0.3×20×9.8", tier: "free" },
    { id: "fm-c2", question: "What is the minimum force to keep a 20kg box moving at constant velocity with μ_k = 0.3?", hint: "Constant velocity → F_net = 0 → F_applied = F_friction = μmg", tier: "free" },
    { id: "fm-c3", question: "Why does a heavier box accelerate the same as a lighter one at the same force/mass ratio?", hint: "F/m = a; if you scale both F and m by the same factor, a is unchanged", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["newtons-laws", "friction-lab", "kinematics-graphs"],

  seoTitle: "Forces and Motion Basics | Newton's Laws Simulation | AP Physics 1",
  seoKeywords: ["forces and motion", "Newton's laws", "friction", "net force", "AP Physics 1", "free body diagram"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Newton's Laws, Net Force, Friction" },

  contentSections: {
    whatIsIt:
      "Push a shopping cart on a smooth supermarket floor and it rolls easily; push the same cart across a gravel parking lot and it fights you the whole way. Newton's laws are the rulebook for that everyday experience. The first law says an object keeps doing whatever it's doing — sitting still or sliding at constant velocity — until a net force acts on it. The second law puts a number on the result: net force equals mass times acceleration. The third law says forces always come in equal-and-opposite pairs. Friction is the everyday opponent that makes the cart eventually stop, and its strength depends on the surface and how hard the cart presses down. In this lab you choose an object's mass, dial in an applied force, set the friction coefficient and surface, and watch the free-body diagram and the resulting motion update together.",
    parameterExplanations: {
      applied_force:
        "The pushing force you apply to the object in newtons. A typical adult push is about 100–200 N. Net force determines acceleration, but only the part of your push that exceeds friction actually accelerates the object — the rest is canceled by friction.",
      mass:
        "The object's mass in kilograms. From F_net = ma, the same net force gives a heavier object less acceleration. A 100 N net force accelerates a 10 kg crate at 10 m/s² but a 100 kg crate at only 1 m/s².",
      friction_coeff:
        "The kinetic friction coefficient (μ_k), a unitless number that captures how rough the contact is. Polished ice is around 0.03, wood on wood about 0.3, rubber on dry asphalt as high as 0.8. Bigger μ_k means a bigger friction force opposing motion at the same weight.",
      surface:
        "A preset surface type (ice, wood, carpet, asphalt) that locks the friction coefficient to a realistic value. Switching surfaces is the fastest way to see how the same applied force produces wildly different accelerations on different floors.",
    },
    misconceptions: [
      {
        wrong:
          "An object needs a continuous force on it to keep moving at constant velocity.",
        correct:
          "Newton's first law says no — an object in motion stays in motion at constant velocity unless a net force acts. In real life you have to keep pushing because friction is fighting you back. Remove friction (think of a hockey puck on ideal ice) and a single push keeps the puck moving forever.",
      },
      {
        wrong:
          "If you push a heavy object and a light object with the same force, they accelerate the same.",
        correct:
          "F_net = ma, so the same net force gives the heavier object a smaller acceleration in inverse proportion to mass. Doubling the mass halves the acceleration. This is why pushing a stalled car takes much longer to get rolling than pushing a bicycle.",
      },
      {
        wrong:
          "Friction always works against you and slows things down.",
        correct:
          "Friction opposes relative sliding, not motion in general. Friction is what lets your shoes push you forward when you walk and what gives car tires the grip needed to accelerate. Without friction you couldn't start, stop, or turn.",
      },
      {
        wrong:
          "If two objects collide, the heavier one pushes harder on the lighter one than it gets pushed back.",
        correct:
          "Newton's third law says forces between two objects are always equal in magnitude and opposite in direction, regardless of mass. The lighter object accelerates more because it has less mass, but the force it experiences is identical to the force on the heavier object.",
      },
    ],
    teacherUseCases: [
      "Acceleration data run: have students hold mass constant at 20 kg and record the resulting acceleration for applied forces of 50, 100, 150, and 200 N. Plot a versus F and confirm the slope equals 1/m.",
      "Predict-the-net-force: with a known mass and friction coefficient, ask students to predict the minimum applied force needed to start the box moving before they touch the slider. Compare predictions with the actual threshold.",
      "Surface tour: ask students to keep mass and applied force fixed and switch through ice, wood, and asphalt. Have them measure acceleration on each surface and rank them, then look up real-world μ values to check.",
      "Misconception probe: pause the sim with the box moving at constant velocity and ask 'is there a net force on the box right now?' Students who say yes are showing the classic 'force is needed to maintain motion' confusion.",
      "Free-body diagram practice: have pairs sketch the free-body diagram before each run and compare with the simulation's diagram, focusing on force directions and magnitudes.",
    ],
    faq: [
      {
        question: "Why does a heavier box need a bigger push to start moving even on the same floor?",
        answer:
          "Static friction is proportional to the normal force, which is proportional to weight (mg). A heavier box presses down harder on the floor, so the maximum static friction is larger and the applied force needed to overcome it grows with mass. The friction coefficient itself doesn't change — only the available friction force does.",
      },
      {
        question: "What is the difference between static and kinetic friction?",
        answer:
          "Static friction acts on a stationary object and adjusts itself up to a maximum value to prevent motion. Kinetic friction acts on a sliding object and is roughly constant. Static friction's max is usually slightly larger than kinetic friction, which is why getting a stuck box to slide takes a sharper push than keeping it sliding.",
      },
      {
        question: "Does mass affect acceleration if I keep applied force the same?",
        answer:
          "Yes — directly. F = ma rearranges to a = F/m, so doubling the mass halves the acceleration at the same applied force. Increase mass enough and the same push that easily accelerated a small object barely moves a big one. Try it with the mass slider to feel the inverse relationship.",
      },
      {
        question: "Why do objects on ice slide so much farther than on carpet?",
        answer:
          "Ice has a very low kinetic friction coefficient (around 0.03), while carpet is closer to 0.5. Friction force scales linearly with μ, so an object on ice feels roughly fifteen times less stopping force than the same object on carpet. Less stopping force means much smaller deceleration and a much longer slide.",
      },
      {
        question: "How does this lab connect to AP Physics 1?",
        answer:
          "AP Physics 1 standard 3.A.1 expects students to recognize that forces are interactions between objects, and 3.B.1 expects them to apply Newton's second law to predict motion from a free-body diagram. This sim lets you isolate every term in F_net = ma and watch the resulting acceleration directly, which is exactly what the AP exam asks you to reason about on paper.",
      },
    ],
  },
};
