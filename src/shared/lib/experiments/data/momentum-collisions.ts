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

  contentSections: {
    whatIsIt:
      "Slide a billiard ball straight at a stationary one of equal mass. The cue ball stops dead and the target ball rolls off with the original speed. That weird, almost magical exchange is conservation of momentum doing exactly what the math says it must. Now imagine the same hit but with a lump of clay instead — the moving ball plows into it, they stick together, and the combined blob continues at half the original speed. Different outcome, same conservation law: total momentum before equals total momentum after, every time, in any isolated collision. The difference between the two cases is what happens to kinetic energy: conserved in the elastic case, partly dumped into heat and deformation in the inelastic one. This lab launches two carts at each other with adjustable masses, velocities, and a coefficient of restitution slider so you can blend smoothly from perfectly bouncy to perfectly sticky.",
    parameterExplanations: {
      mass1:
        "Mass of the first cart in kilograms. Heavier carts carry more momentum at the same speed and are harder to deflect. In an elastic head-on hit with a much lighter target, a heavy cart barely changes velocity while the target rebounds at nearly twice the cart's incoming speed.",
      mass2:
        "Mass of the second cart in kilograms. The mass ratio m₁/m₂ controls how the post-collision velocities split. Equal masses produce a clean swap (in elastic 1D collisions); unequal masses produce a partial transfer governed by (m_1 - m_2)/(m_1 + m_2).",
      velocity1:
        "Initial velocity of cart 1 in meters per second. Sign matters: positive is rightward, negative is leftward. Momentum p_1 = m_1·v_1 is a vector, so a fast leftward cart has the same magnitude but opposite sign as a fast rightward one — and that sign survives all the way through the collision math.",
      velocity2:
        "Initial velocity of cart 2 in meters per second, with the same sign convention as v_1. Setting v_2 = 0 reproduces the classic 'cue ball into rack' scenario; setting v_2 negative gives a head-on closing collision; setting it positive but smaller than v_1 makes cart 1 catch up and rear-end cart 2.",
      restitution:
        "The coefficient of restitution e, dimensionless, ranging 0 to 1. It's the ratio of the relative speed of separation after to the relative speed of approach before. e = 1 is perfectly elastic (KE conserved); e = 0 is perfectly inelastic (carts stick); intermediate values model real-world collisions like rubber balls (~0.8) or steel-on-clay (~0.2).",
    },
    misconceptions: [
      {
        wrong:
          "If two objects collide and stick together, momentum is lost because they slow down.",
        correct:
          "Momentum is conserved in every collision, sticky or bouncy, as long as no external forces act. What changes in a sticky collision is kinetic energy — some of it converts to heat and deformation. The combined mass moves more slowly precisely because momentum (m·v) has to add up to the original total: more m means less v.",
      },
      {
        wrong:
          "Momentum and kinetic energy are basically the same thing — both measure motion.",
        correct:
          "They're related but distinct. Momentum p = mv is a vector, conserved in every collision. Kinetic energy KE = ½mv² is a scalar, conserved only in elastic ones. Doubling speed doubles momentum but quadruples KE. The two concepts answer different questions: momentum tells you how hard something is to stop; KE tells you how much damage it can do.",
      },
      {
        wrong:
          "When a moving object hits a stationary one, the moving object always loses speed and the stationary one always speeds up by the same amount.",
        correct:
          "Only true for equal masses in 1D elastic collisions. With unequal masses or inelastic conditions, the velocity changes are not equal and opposite. What is always equal and opposite — for any isolated collision — is the impulse (Δp) on each object. The forces during contact are equal and opposite by Newton's third law, but the resulting velocity changes depend on the masses.",
      },
      {
        wrong:
          "Cars in a head-on crash come to a sudden stop because the airbag absorbs all the energy.",
        correct:
          "Airbags don't reduce the energy you have to dissipate — they reduce the peak force by extending the time over which it acts. The impulse-momentum theorem F·Δt = Δp says the same momentum change can be delivered with a small force over a long time or a huge force over a short time. Airbags choose the gentle option, which is why they save lives.",
      },
      {
        wrong:
          "A heavy truck has more momentum than a fast bullet because trucks weigh more.",
        correct:
          "Momentum is mass times velocity, so a slow massive object and a fast light object can have the same momentum if mv lines up. A 0.01 kg bullet at 1,000 m/s carries 10 kg·m/s of momentum, the same as a 10 kg cart at 1 m/s. The bullet wins on KE (½mv² scales with v²), which is why it does more damage despite the lighter mass.",
      },
    ],
    teacherUseCases: [
      "Momentum bookkeeping: have students record p_1, p_2, and p_total before and after for at least four different mass and velocity combinations in elastic mode. Verify p_total stays constant to within rounding. Then repeat in perfectly inelastic mode and confirm the same. Goal: make conservation feel like a verified experimental fact, not just a slogan.",
      "Equal-mass surprise: predict the outcome of a 3 kg cart at 4 m/s hitting a stationary 3 kg cart elastically. Most students guess both carts move forward at 2 m/s. The correct answer (cart 1 stops, cart 2 takes off at 4 m/s) is a powerful misconception breaker. Use it to motivate careful application of both conservation laws together.",
      "Restitution slider study: have student pairs sweep e from 0 to 1 in steps of 0.1 with fixed initial conditions, and record the post-collision KE. Plot KE_after/KE_before vs. e. Discuss why the curve isn't linear — the algebra forces a quadratic relationship.",
      "Real-world collision audit: assign each group a video of a real collision (Newton's cradle, billiards, car crash test, two pucks on an air table). Ask them to estimate e and classify the collision. The exercise sharpens the link between the slider and physical reality.",
      "Misconception probe — sticky momentum: pause the simulation immediately after a perfectly inelastic collision and ask 'where did the momentum go?' Many students will say it disappeared. Walk them through the m_total·v_final calculation showing it didn't. Then ask 'where did the energy go?' and let them realize that's the actual question.",
    ],
    faq: [
      {
        question: "What is the difference between an elastic and an inelastic collision?",
        answer:
          "Both conserve momentum, but they differ in what happens to kinetic energy. In an elastic collision, KE is also conserved — the objects bounce off without energy loss. In an inelastic collision, some KE converts to heat, sound, or deformation; the objects might still separate but with less combined KE than they started with. A perfectly inelastic collision is the extreme case where the objects stick together, maximizing the KE loss subject to momentum conservation.",
      },
      {
        question: "Why is momentum conserved in every collision but kinetic energy isn't?",
        answer:
          "Momentum conservation comes from Newton's third law: the forces between two colliding objects are equal and opposite, so the impulses they deliver to each other cancel exactly, leaving total momentum unchanged. Kinetic energy doesn't have that protection. Internal forces during a collision can do work that converts KE into other forms — heat, sound, internal vibration, permanent deformation. Those losses aren't visible at the level of total momentum but they show up clearly in the KE balance.",
      },
      {
        question: "What does the coefficient of restitution actually measure?",
        answer:
          "It's the ratio of the relative speed of separation to the relative speed of approach: e = (v_2' - v_1') / (v_1 - v_2). For e = 1 the objects separate as fast as they came together (perfectly elastic). For e = 0 they don't separate at all (perfectly inelastic — they stick). Real-world collisions live in between: a basketball on a hardwood floor has e ≈ 0.75; a ball of putty on concrete has e ≈ 0. The coefficient is empirical and depends on both materials and impact speed.",
      },
      {
        question: "Why does a heavy truck barely slow down when it hits a small car?",
        answer:
          "Because momentum conservation distributes the impulse based on mass. The truck and car receive equal and opposite impulses (Newton's third law), but the same Δp produces a velocity change Δv = Δp/m that is much smaller for the heavy truck. The car's velocity changes dramatically; the truck's barely shifts. Same momentum transfer, very different velocity outcomes — and very different consequences for the people inside.",
      },
      {
        question: "What is impulse and how does it relate to airbags and crumple zones?",
        answer:
          "Impulse J is the integral of force over time, J = F·Δt, and it equals the change in momentum: J = Δp. For a given crash, your momentum change is fixed — you go from cruising speed to zero. The only variable is how long the deceleration lasts. Airbags and crumple zones extend Δt by allowing controlled deformation, which proportionally reduces the peak force F that your body has to absorb. Same impulse, much lower force, far less injury.",
      },
      {
        question: "How does this lab map to AP Physics 1 standard 5.D.1?",
        answer:
          "AP Physics 1 standard 5.D.1 expects students to apply conservation of linear momentum to collisions and explosions, distinguish elastic from inelastic outcomes, and use the impulse-momentum theorem. This lab is essentially a controlled laboratory version of every textbook problem under that standard: students set masses and velocities, predict post-collision states, verify conservation, and explore how the coefficient of restitution shifts kinetic energy out of the system. NGSS HS-PS2-2 covers the same ground from a slightly different angle.",
      },
    ],
  },
};
