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
      min: 0,
      max: 100,
      default: 20,
      step: 5,
      tier: "free",
    },
    {
      id: "objectMass",
      label: "Object Mass",
      unit: "kg",
      min: 1,
      max: 50,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "frictionCoeff",
      label: "Friction Coefficient (μ)",
      unit: "",
      min: 0,
      max: 0.8,
      default: 0.2,
      step: 0.05,
      tier: "free",
    },
    {
      id: "lawDemo",
      label: "Law Demonstration (1, 2, or 3)",
      unit: "",
      min: 1,
      max: 3,
      default: 2,
      step: 1,
      tier: "pro",
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
    "Select which law to demonstrate (Law selector, Pro). In Law 2 mode, adjust the Force and Mass sliders — watch acceleration (a = F/m) change. Add friction to see it oppose motion. In Law 3 mode, watch the collision force pairs — equal magnitude, opposite direction. Free body diagrams update in real time.",

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

  seoTitle: "Newton's Three Laws of Motion | NeonPhysics Middle School Physics",
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
};
