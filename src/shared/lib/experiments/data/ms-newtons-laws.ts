import type { Experiment } from "@/shared/types/experiment";

export const msNewtonsLaws: Experiment = {
  id: "ms-newtons-laws",
  slug: "ms-newtons-laws",
  title: "Newton's Three Laws of Motion",
  subtitle: "Inertia, F=ma, and action-reaction pairs",
  description:
    "Explore all three of Newton's laws in one simulation. Observe inertia with a tablecloth-pull demo. Apply forces to objects of different masses and measure acceleration. Discover Newton's third law with rocket propulsion and collision reaction pairs.",
  thumbnail: "/imgs/experiments/ms-newtons-laws.png",

  standards: {
    ngss: ["MS-PS2-1", "MS-PS2-2", "HS-PS2-1"],
    gcse: ["P2.1", "P2.2"],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "6-8",
  tags: ["Newton's laws", "inertia", "F=ma", "action reaction", "force", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "appliedForce",
      label: "Applied Force",
      unit: "N",
      min: 1,
      max: 50,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "objectMass",
      label: "Object Mass",
      unit: "kg",
      min: 0.5,
      max: 10,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "frictionCoeff",
      label: "Friction Level (0=none, 3=high)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\text{1st: } \\sum F=0 \\Rightarrow a=0 \\quad \\text{(inertia)}",
      description: "Law 1: An object at rest/motion stays that way unless acted on by net force",
    },
    {
      latex: "\\text{2nd: } \\sum F = ma \\quad a = \\frac{F_{net}}{m}",
      description: "Law 2: Net force equals mass times acceleration",
    },
    {
      latex: "\\text{3rd: } F_{AB} = -F_{BA} \\quad \\text{(action-reaction)}",
      description: "Law 3: Every action has an equal and opposite reaction",
    },
  ],

  theory:
    "Newton's First Law (Inertia): An object at rest stays at rest; an object in motion stays in motion at constant velocity, unless acted upon by a net external force. Inertia is the resistance to change in motion. Newton's Second Law (F=ma): The net force on an object equals its mass times its acceleration. A larger force or smaller mass means greater acceleration. Newton's Third Law (Action-Reaction): When object A exerts a force on object B, object B simultaneously exerts an equal and opposite force on object A. Note: these forces act on DIFFERENT objects — they never cancel. Rocket engines work by Newton's Third Law: exhaust gas pushed backward → rocket pushed forward.",

  instructions:
    "Click one of the three preset buttons to demonstrate a specific law (Inertia, F=ma, or Rocket Launch). In any preset, adjust the Force and Mass sliders — watch acceleration (a = F/m) change. Add friction to see it oppose motion. In the Rocket Launch preset, watch the collision force pairs — equal magnitude, opposite direction. Free body diagrams update in real time.",

  challenges: [
    {
      id: "mnl-c1",
      question: "A 5 kg box has a 30 N push force and 10 N friction. What is the acceleration?",
      hint: "Net F = 30 - 10 = 20 N. a = F/m = 20/5 = 4 m/s².",
      tier: "free",
    },
    {
      id: "mnl-c2",
      question: "Why doesn't a book sitting on a table fall? What forces act on it?",
      hint: "Two forces: gravity pulls it down (W=mg), the table pushes it up (normal force N). These are balanced (N=W), so net force = 0, acceleration = 0 — the book stays at rest (Law 1).",
      tier: "free",
    },
    {
      id: "mnl-c3",
      question: "A rocket expels 100 N of force backward. What force pushes the rocket forward?",
      hint: "Newton's 3rd Law: equal and opposite. The rocket pushes exhaust backward with 100 N, so the exhaust pushes the rocket forward with exactly 100 N.",
      tier: "free",
    },
    {
      id: "mnl-c4",
      question: "Why does a car accelerate more slowly when fully loaded vs empty?",
      hint: "F=ma → a=F/m. With more mass (loaded car), the same engine force (F) produces smaller acceleration. To get the same acceleration with more mass, you need more force.",
      tier: "pro",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 14,
  relatedExperiments: ["ms-energy-conservation", "momentum-collisions", "newtons-laws"],

  seoTitle: "Newton's Three Laws of Motion | Scivra Middle School Physics",
  seoKeywords: [
    "Newton's laws simulation middle school",
    "F=ma interactive",
    "inertia action reaction",
    "6-8 physics Newton",
    "force acceleration mass",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Newton's Three Laws of Motion",
  },
  htmlControlAliases: {
    appliedForce: "sl-force",
    objectMass: "sl-mass",
    frictionCoeff: "sl-friction",
  },
  presets: [
    {
      id: "inertia",
      label: "Law 1: Inertia (crash dummy)",
      description:
        "Newton's First Law — object in motion stays in motion until a net force (the seatbelt) acts on it.",
    },
    {
      id: "fma",
      label: "Law 2: Heavy vs Light (same force)",
      description:
        "Newton's Second Law — same applied force, different masses produce different accelerations (a = F/m).",
    },
    {
      id: "rocket",
      label: "Law 3: Rocket Launch",
      description:
        "Newton's Third Law — exhaust pushed backward, rocket pushed forward with equal and opposite force.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Newton's three laws of motion are the foundation of all everyday physics — from sliding a book across a desk to launching a rocket into space. The First Law (inertia) says objects are lazy: they resist changing their state of motion. Something sitting still stays still, and something moving keeps moving in a straight line at constant speed, unless a net force acts on it. The Second Law (F = ma) says that when a net force does act, the result is acceleration — and heavier objects need more force to get the same acceleration. The Third Law (action-reaction) says forces always come in pairs: when you push on something, it pushes back on you with exactly the same strength in the opposite direction. These action-reaction forces always act on different objects — that is what makes rockets work and what lets you walk without sliding. This simulation brings all three laws to life in one place, letting you adjust force, mass, and friction while watching free body diagrams, motion animations, and collision pairs update in real time.",
    parameterExplanations: {
      appliedForce:
        "The push force applied to the object in newtons (N), adjustable from 1 N to 50 N (step 1 N). A larger applied force produces greater acceleration for the same mass (Newton's Second Law: a = F/m). Setting this to a small value demonstrates Newton's First Law — with little applied force and no friction, a moving object continues at nearly constant velocity. In Law 3 mode, this value controls the thrust force displayed on the action-reaction diagram.",
      objectMass:
        "The mass of the object being pushed in kilograms (kg), adjustable from 0.5 kg to 10 kg (step 0.5 kg). For a fixed applied force, doubling the mass halves the acceleration. This parameter directly demonstrates the inverse relationship between mass and acceleration in Newton's Second Law. Heavier objects have more inertia — they resist changes in motion more strongly — which is why a heavier shopping cart is harder to start moving than a lighter one.",
      frictionCoeff:
        "A discrete friction level from 0 to 3 (None / Low / Medium / High). At level 0 the surface is frictionless, useful for isolating Newton's First Law. As the level increases, friction force grows and opposes motion, reducing the net force on the object. At the highest level the object may not accelerate at all if friction equals or exceeds the applied force. The simulation maps each level to a constant friction force; this is a simplified middle-school model rather than the continuous coefficient-of-friction (Greek letter mu) you may meet in high school physics. The simulation also exposes three preset scenario buttons — Inertia, Heavy vs Light (F=ma), and Rocket Launch — that switch the demo focus between Newton's three laws without changing the slider values directly.",
    },
    misconceptions: [
      {
        wrong: "A moving object needs a constant force to keep moving at constant speed.",
        correct:
          "This is the single most common misconception in physics, called 'Aristotelian physics.' Newton's First Law says the opposite: a moving object at constant velocity needs zero net force. Forces are needed to change motion — to speed up, slow down, or turn. On a truly frictionless surface (or in outer space), an object keeps moving forever with no engine. The reason everyday objects slow down is friction, not the lack of a push.",
      },
      {
        wrong: "Newton's Third Law action-reaction forces cancel each other out.",
        correct:
          "Action-reaction forces are equal in magnitude and opposite in direction, but they act on different objects — so they cannot cancel. When you push a wall, the wall pushes you back. Those forces act on different things (you vs. the wall) and cannot be added together to get zero. Forces only cancel when they act on the same object. Newton's Third Law pairs never cancel; Newton's First Law equilibrium (forces on one object canceling) is a separate concept.",
      },
      {
        wrong: "Heavier objects fall faster than lighter ones.",
        correct:
          "In a gravity-only system with no air resistance, all objects fall with the same acceleration (about 10 m/s squared on Earth) regardless of mass. A feather and a hammer dropped on the Moon — where there is no air — hit the ground at the same time, as demonstrated by Apollo 15 astronauts. On Earth, air resistance creates a difference for very light or very flat objects, but that is air resistance, not gravity, causing the difference.",
      },
      {
        wrong: "Friction always acts downward or against the direction of motion.",
        correct:
          "Kinetic friction (sliding friction) acts opposite to the direction of motion — that part is correct. But static friction (when an object is not sliding) can act in any direction needed to prevent motion. When you walk forward, static friction between your foot and the ground actually pushes you forward — without it, your foot would slip backward and you would fall. This forward static friction from the ground is what actually propels you when walking.",
      },
    ],
    teacherUseCases: [
      "F = ma isolation: click the Heavy vs Light (F=ma) preset and set frictionCoeff to 0. Run with objectMass at 5 kg and appliedForce at 10 N. Record the acceleration. Then double the force to 20 N and record again. Then return force to 10 N and double the mass to 10 kg. Students build the table F, m, a and derive the relationship a = F/m themselves before seeing the formula — supporting MS-PS2-2.",
      "Inertia demo: click the Inertia (crash dummy) preset and set frictionCoeff to 0. Give the object an initial push (briefly raise appliedForce to 30 N then drop to 1 N). Students observe that the object continues moving at nearly constant velocity with very little applied force. Then repeat with frictionCoeff at 2 (medium friction) to show that friction — not the absence of force — is what stops real objects.",
      "Action-reaction pairs: click the Rocket Launch preset and walk students through the force arrows on both objects in the collision. Ask: which object experiences the larger force? (Neither — they are equal.) Which accelerates more? (The lighter one, because a = F/m.) This distinguishes the Third Law (equal forces) from the Second Law (unequal accelerations due to different masses), addressing a very common confusion.",
      "Real-world scaling: with the Heavy vs Light (F=ma) preset selected, set objectMass to 10 kg (a heavy backpack) vs 1 kg (a textbook). Apply the same appliedForce of 5 N. Students compare accelerations and connect to why you need more engine force to accelerate a loaded truck than an empty bicycle — directly linking F = ma to everyday transportation engineering.",
    ],
    faq: [
      {
        question: "If action and reaction forces are equal, why does a rocket move at all?",
        answer:
          "The rocket pushes exhaust gas backward with a large force. By Newton's Third Law, the exhaust gas pushes the rocket forward with an equal force. These two equal-and-opposite forces act on different objects — the gas and the rocket — so they do not cancel. The rocket accelerates forward because the net force on the rocket (from the exhaust pushing it) is nonzero. The exhaust accelerates backward for the same reason. This is also why rockets work in space where there is nothing to 'push against' — they push against the exhaust they expel.",
      },
      {
        question: "What is inertia, and does every object have it?",
        answer:
          "Inertia is the tendency of any object to resist changes in its state of motion. An object at rest resists being pushed; an object in motion resists being stopped or redirected. Every object with mass has inertia — more mass means more inertia. A bowling ball is much harder to start rolling than a tennis ball for this reason. In space, with no friction and no gravity, a spacecraft coasting at thousands of kilometers per hour needs zero fuel to maintain that speed — pure inertia at work. Newton's First Law is essentially a mathematical statement of inertia.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "The simulation primarily supports MS-PS2-1 (apply Newton's Third Law to design a solution to a problem involving the motion of two colliding objects) and MS-PS2-2 (plan an investigation to provide evidence that the change in an object's motion depends on the sum of the forces and the mass of the object). The three preset scenario buttons — Inertia, Heavy vs Light (F=ma), and Rocket Launch — let you switch focus between each law specifically. HS-PS2-1 is also listed, making this a useful bridge for students beginning to formalize Newton's laws algebraically.",
      },
      {
        question: "Why does friction depend on a coefficient rather than just the surface area in contact?",
        answer:
          "Experiments show that for most everyday surfaces, friction force depends on how hard the surfaces are pressed together (the normal force) and on the roughness of the surfaces (captured by the friction coefficient), but not on the contact area. A large flat box and the same box balanced on one end experience the same friction force when pulled across a floor. This seems counterintuitive but has been verified repeatedly since the 1700s. The coefficient is a compact way to capture the material and texture properties of a pair of surfaces in one number.",
      },
      {
        question: "Can the net force on an object be zero even if multiple forces are acting on it?",
        answer:
          "Yes — this is called equilibrium. A book sitting on a table has two forces acting on it: gravity pulling it downward and the normal force from the table pushing it upward. These are equal in magnitude and opposite in direction, so the net force is zero and the book does not accelerate (Newton's First Law). Equilibrium does not mean no forces — it means the forces balance. You can see this in the simulation when the friction force exactly equals the applied force and the object does not accelerate despite both forces being nonzero.",
      },
    ],
  },
};
