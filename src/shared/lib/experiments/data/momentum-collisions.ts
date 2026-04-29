import type { Experiment } from "@/shared/types/experiment";

export const momentumCollisions: Experiment = {
  id: "momentum-collisions",
  slug: "momentum-collisions",
  title: "Momentum & Collisions",
  subtitle: "Conservation of momentum in elastic and inelastic collisions",
  description:
    "Launch two objects toward each other and observe momentum conservation. Switch between elastic (KE conserved) and perfectly inelastic (objects stick) collisions. Measure before and after momenta to verify conservation.",
  thumbnail: "/imgs/experiments/momentum-collisions.png",

  standards: {
    ngss: ["HS-PS2-2", "HS-PS2-3"],
    gcse: ["P5.4"],
    ap: ["4.B.1", "4.B.2", "5.D.1", "5.D.2", "5.D.3"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["momentum", "collision", "elastic", "inelastic", "conservation", "impulse", "AP Physics 1"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "mass1",
      label: "Mass 1 (m₁)",
      unit: "kg",
      min: 0.5,
      max: 10,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "mass2",
      label: "Mass 2 (m₂)",
      unit: "kg",
      min: 0.5,
      max: 10,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "velocity1",
      label: "Initial Velocity 1 (v₁)",
      unit: "m/s",
      min: -10,
      max: 10,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "velocity2",
      label: "Initial Velocity 2 (v₂)",
      unit: "m/s",
      min: -10,
      max: 10,
      default: -3,
      step: 0.5,
      tier: "free",
    },
    {
      id: "restitution",
      label: "Coefficient of Restitution (e)",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 0.05,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "p = mv",
      description: "Linear momentum",
    },
    {
      latex: "p_{total} = m_1v_1 + m_2v_2 = m_1v_1' + m_2v_2'",
      description: "Conservation of momentum",
    },
    {
      latex: "v_1' = \\frac{(m_1 - m_2)v_1 + 2m_2v_2}{m_1 + m_2}",
      description: "Post-collision velocity of object 1 (elastic)",
    },
    {
      latex: "v_2' = \\frac{(m_2 - m_1)v_2 + 2m_1v_1}{m_1 + m_2}",
      description: "Post-collision velocity of object 2 (elastic)",
    },
    {
      latex: "v_f = \\frac{m_1v_1 + m_2v_2}{m_1 + m_2}",
      description: "Final velocity for perfectly inelastic collision",
    },
    {
      latex: "J = \\Delta p = F\\Delta t",
      description: "Impulse-momentum theorem",
    },
  ],

  theory:
    "The law of conservation of momentum states that the total momentum of an isolated system remains constant regardless of internal interactions. In elastic collisions, both momentum and kinetic energy are conserved. In perfectly inelastic collisions, objects stick together — momentum is still conserved but kinetic energy is not (it converts to heat/deformation). The coefficient of restitution e ranges from 0 (perfectly inelastic) to 1 (perfectly elastic).",

  instructions:
    "Set the masses and initial velocities of both objects. Press Launch to start the collision. The momentum display shows p₁, p₂, and p_total before and after — verify conservation. Toggle between elastic and inelastic modes. Try equal masses with one stationary object (classic AP question).",

  hook: {
    question:
      "Would you rather be hit by a ping-pong ball or a bowling ball at the same speed?",
    context:
      "Your intuition already knows about momentum — mass times velocity determines impact.",
    actionPrompt: "Crash some objects to see why",
  },

  learningCards: [
    {
      id: "mc-lc1",
      title: "Conservation of Momentum",
      content:
        "In any collision where no external forces act, the total momentum before equals the total momentum after. This holds regardless of whether the collision is elastic, inelastic, or somewhere in between. It is one of the most fundamental conservation laws in physics.",
      formula: {
        latex: "m_1v_1 + m_2v_2 = m_1v_1' + m_2v_2'",
        description: "Total momentum is conserved in all collisions",
      },
      relatedParameterId: "mass1",
    },
    {
      id: "mc-lc2",
      title: "Elastic vs. Inelastic Collisions",
      content:
        "In an elastic collision, both momentum and kinetic energy are conserved — billiard balls are a close approximation. In a perfectly inelastic collision, the objects stick together and kinetic energy is converted to heat or deformation. Most real collisions fall somewhere between these extremes.",
      formula: {
        latex: "KE_i = KE_f \\text{ (elastic only)}",
        description: "Kinetic energy is conserved only in elastic collisions",
      },
      relatedParameterId: "restitution",
    },
    {
      id: "mc-lc3",
      title: "Impulse and Momentum Change",
      content:
        "Impulse is the product of force and the time interval over which it acts. It equals the change in momentum of an object. This is why airbags work: they increase the collision time, reducing the peak force while delivering the same impulse.",
      formula: {
        latex: "J = F\\Delta t = \\Delta p",
        description: "Impulse equals the change in momentum",
      },
    },
    {
      id: "mc-lc4",
      title: "The Equal-Mass Trick",
      content:
        "When two objects of equal mass collide elastically and one is initially at rest, something remarkable happens: the moving object stops completely and the stationary object moves off with the original velocity. This is Newton's cradle in action.",
      relatedParameterId: "mass2",
    },
  ],

  easterEggs: [
    {
      parameterId: "mass1",
      condition: "max",
      effect: "Object 1 barely slows down while object 2 flies away at nearly twice the initial speed",
      message: "10 kg vs 0.5 kg — like a truck hitting a shopping cart. The heavy object barely notices!",
    },
    {
      parameterId: "mass2",
      condition: "min",
      effect: "Object 2 rebounds at extreme speed after being hit by the much heavier object 1",
      message: "Minimum target mass! Watch the light object launch away — momentum transfer is dramatic at extreme mass ratios.",
    },
  ],

  challenges: [
    {
      id: "mc-c1",
      question: "A 3 kg object at 4 m/s hits a stationary 3 kg object elastically. What are the final velocities?",
      options: [
        "v₁' = 0 m/s, v₂' = 4 m/s",
        "v₁' = 2 m/s, v₂' = 2 m/s",
        "v₁' = 4 m/s, v₂' = 0 m/s",
        "v₁' = -4 m/s, v₂' = 4 m/s",
      ],
      correctAnswer: "v₁' = 0 m/s, v₂' = 4 m/s",
      hint: "For equal masses in elastic collision: v₁'=0, v₂'=v₁ (momentum transfers completely)",
      relatedParameterId: "mass1",
      tier: "free",
    },
    {
      id: "mc-c2",
      question: "A 4 kg cart at 6 m/s collides and sticks to a 2 kg cart at rest. Find final velocity.",
      options: ["2 m/s", "3 m/s", "4 m/s", "6 m/s"],
      correctAnswer: "4 m/s",
      hint: "Perfectly inelastic: vf = (m₁v₁)/(m₁+m₂)",
      relatedParameterId: "restitution",
      tier: "free",
    },
    {
      id: "mc-c3",
      question: "How much kinetic energy is lost in the inelastic collision above?",
      options: ["12 J", "24 J", "36 J", "48 J"],
      correctAnswer: "24 J",
      hint: "ΔKE = KE_initial − KE_final",
      tier: "free",
    },
    {
      id: "mc-c4",
      question: "Two objects approach each other: m₁=5 kg at 8 m/s and m₂=3 kg at −4 m/s (elastic). Find v₁' and v₂'.",
      options: [
        "v₁' = -1 m/s, v₂' = 11 m/s",
        "v₁' = 2 m/s, v₂' = 6 m/s",
        "v₁' = 0 m/s, v₂' = 8 m/s",
        "v₁' = -4 m/s, v₂' = 8 m/s",
      ],
      correctAnswer: "v₁' = -1 m/s, v₂' = 11 m/s",
      hint: "Use the elastic collision formulas. Check that total momentum and KE are conserved.",
      relatedParameterId: "velocity1",
      tier: "pro",
    },
    {
      id: "mc-c5",
      question: "What does a coefficient of restitution of 0.7 mean physically? Calculate post-collision velocities for equal masses.",
      options: [
        "70% of kinetic energy is conserved",
        "The relative speed after is 70% of the relative speed before",
        "70% of momentum is transferred",
        "The objects bounce back at 70% of their original speeds",
      ],
      correctAnswer: "The relative speed after is 70% of the relative speed before",
      hint: "e = relative speed after / relative speed before. e=1 is elastic, e=0 is perfectly inelastic.",
      relatedParameterId: "restitution",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["newtons-laws", "simple-harmonic-motion"],

  seoTitle: "Momentum & Collisions — Interactive Physics Simulation | Scivra",
  seoKeywords: [
    "momentum conservation simulation",
    "elastic collision",
    "inelastic collision",
    "AP Physics 1 momentum",
    "collision lab",
    "impulse momentum theorem",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Conservation of Momentum",
  },
};
