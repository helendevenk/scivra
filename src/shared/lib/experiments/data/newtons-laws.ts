import type { Experiment } from "@/shared/types/experiment";

export const newtonsLaws: Experiment = {
  id: "newtons-laws",
  slug: "newtons-laws-of-motion",
  title: "Newton's Laws of Motion",
  subtitle: "Explore force, mass, and acceleration",
  description:
    "Visualize all three of Newton's Laws in an interactive 3D environment. Apply forces to objects, observe inertia, and discover action-reaction pairs.",
  thumbnail: "/imgs/experiments/newton-laws.png",

  standards: {
    ngss: ["HS-PS2-1", "HS-PS2-3"],
    gcse: ["P5.1", "P5.2"],
    ap: ["3.A.1", "3.A.2", "3.B.1"],
  },
  primaryStandard: "ngss-hs",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["force", "mass", "acceleration", "inertia", "F=ma"],
  difficulty: "beginner",

  parameters: [
    {
      id: "mass",
      label: "Mass",
      unit: "kg",
      min: 0.1,
      max: 100,
      default: 5,
      step: 0.1,
      tier: "free",
    },
    {
      id: "force",
      label: "Applied Force",
      unit: "N",
      min: 0,
      max: 500,
      default: 50,
      step: 1,
      tier: "free",
    },
    {
      id: "friction",
      label: "Friction Coefficient",
      unit: "",
      min: 0,
      max: 1,
      default: 0.1,
      step: 0.01,
      tier: "pro",
    },
  ],

  formulas: [
    { latex: "F = ma", description: "Newton's Second Law" },
    { latex: "a = \\frac{F_{net}}{m}", description: "Acceleration" },
    {
      latex: "F_{friction} = \\mu \\cdot m \\cdot g",
      description: "Friction force",
    },
  ],

  theory:
    "Newton's three laws of motion form the foundation of classical mechanics. The first law (inertia) states that an object at rest stays at rest unless acted upon by a force. The second law relates force, mass, and acceleration. The third law states that every action has an equal and opposite reaction.",
  instructions:
    "Adjust the mass and force sliders to see how acceleration changes. Enable friction to observe real-world behavior. Watch the data panel for real-time values.",
  challenges: [
    {
      id: "nl-c1",
      question: "What happens to acceleration when you double the mass?",
      hint: "Think about F = ma",
      tier: "free",
    },
    {
      id: "nl-c2",
      question: "Find the force needed to accelerate 10kg at 5 m/s²",
      hint: "Use Newton's Second Law directly",
      tier: "free",
    },
    {
      id: "nl-c3",
      question:
        "At what friction coefficient does the object stop accelerating?",
      hint: "When friction force equals applied force",
      tier: "pro",
    },
  ],

  wave: 1,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["projectile-motion", "roller-coaster"],

  seoTitle: "Newton's Laws of Motion — Interactive 3D Simulation | Scivra",
  seoKeywords: [
    "Newton's laws",
    "F=ma",
    "force and motion",
    "physics simulation",
    "interactive physics",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Newton's Laws of Motion",
  },

  contentSections: {
    whatIsIt:
      "Newton's three laws of motion describe how forces change the motion of objects. The first law says an object keeps doing what it's doing — at rest or moving in a straight line — unless a net force acts on it. The second law (F = ma) tells you exactly how much that force changes the motion: bigger force or smaller mass means more acceleration. The third law says forces always come in equal and opposite pairs — push a wall, the wall pushes you back the same amount. Push the block in this lab, watch the F = ma equation come alive in real time, then add friction and see the change.",
    parameterExplanations: {
      mass:
        "How much matter is in the block. Doubling mass cuts acceleration in half for the same force — that's F = ma rearranged. Heavier objects feel the same forces but respond more sluggishly.",
      force:
        "The push or pull applied to the block. Increasing force directly scales acceleration: double the force, double the acceleration (with mass and friction held constant).",
      friction:
        "The opposing force from the surface. Friction subtracts from the applied force before F = ma kicks in. Set friction to zero and even a tiny push starts the block moving — that's the first law in action.",
    },
    misconceptions: [
      {
        wrong:
          "If something is moving, there must be a force pushing it forward.",
        correct:
          "Motion doesn't require a force — only changes in motion do. A puck on frictionless ice keeps gliding forever with no forward force; that's exactly what the first law means.",
      },
      {
        wrong:
          "When a horse pulls a cart, the horse pulls harder than the cart pulls back, otherwise nothing would move.",
        correct:
          "The horse and cart pull on each other with equal and opposite forces (third law). The cart accelerates because of the net force on the cart, which comes from the horse's pull minus friction with the ground — not because the horse 'wins' the tug-of-war.",
      },
      {
        wrong:
          "Heavy objects fall faster than light ones because gravity pulls them harder.",
        correct:
          "Gravity does pull harder on heavier objects, but heavier objects also resist acceleration more (more mass, more inertia). The two effects cancel exactly, so all objects fall at the same rate in vacuum — Galileo's classic result.",
      },
      {
        wrong:
          "Doubling the force on an object doubles its speed.",
        correct:
          "Doubling the force doubles the acceleration, not the speed. Speed grows over time as acceleration acts. After 1 second the speed has doubled too, but only because acceleration acted for the same duration.",
      },
    ],
    teacherUseCases: [
      "Predict-test-explain: have students predict what happens when force doubles while mass stays fixed, then run the lab to confirm. Repeat for mass changes.",
      "Free body diagrams: pause the simulation, ask students to draw all forces acting on the block (applied force, friction, normal, weight), then resume to verify the net force matches their diagram.",
      "Friction discovery: start with friction at zero and ask students to predict what friction will do. Slowly increase it and let them observe the threshold where the block stops accelerating, then connect to coefficient of friction.",
      "Third law pairs: bring up the simulation alongside a physical demonstration (e.g., students pushing on a rolling chair) and discuss which forces in the demo correspond to action-reaction pairs.",
      "Independent variables practice: assign teams to isolate one variable (mass, force, or friction) while holding others constant and produce a graph of acceleration vs. that variable.",
    ],
    faq: [
      {
        question: "What is Newton's second law in plain English?",
        answer:
          "Force equals mass times acceleration (F = ma). The harder you push something, the faster it speeds up. The heavier it is, the harder it is to speed up. That single equation governs almost every problem in introductory mechanics.",
      },
      {
        question: "Why doesn't the block slide forever after I stop pushing?",
        answer:
          "Friction. As long as the surface and the block are touching, friction opposes motion. When you stop applying force, friction is the only horizontal force left and it decelerates the block until it stops. Set friction to zero in the lab to see what motion looks like without it.",
      },
      {
        question: "What's the difference between mass and weight?",
        answer:
          "Mass is how much matter is in an object — the same on Earth, the Moon, or in space. Weight is the force gravity exerts on that mass: W = mg. Your mass on the Moon is the same as on Earth, but your weight is about one-sixth as much because lunar g is smaller.",
      },
      {
        question: "How does this connect to AP Physics 1 and NGSS HS-PS2-1?",
        answer:
          "AP Physics 1 expects students to apply Newton's second law to single-body and two-body problems, recognize action-reaction pairs, and reason about systems with friction. NGSS HS-PS2-1 asks students to analyze motion using F = ma — this lab provides the cleanest case for that practice.",
      },
      {
        question: "Why is friction sometimes drawn as a single arrow even though it's between two surfaces?",
        answer:
          "By the third law, friction acts on both surfaces equally and oppositely. We usually draw only the friction force on the object we care about (the block), not on the floor. The floor feels the equal-and-opposite friction too — it just doesn't matter for predicting the block's motion.",
      },
    ],
  },
};
