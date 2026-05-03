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
    ngss: ["HS-PS2-2"],
    gcse: ["P5.4"],
    ap: [],
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
      label: "Mass 1",
      unit: "kg",
      min: 0.5,
      max: 5,
      default: 1,
      step: 0.5,
      tier: "free",
    },
    {
      id: "mass2",
      label: "Mass 2",
      unit: "kg",
      min: 0.5,
      max: 5,
      default: 1,
      step: 0.5,
      tier: "free",
    },
    {
      id: "velocity1",
      label: "Velocity 1",
      unit: "m/s",
      min: -10,
      max: 10,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "restitution",
      label: "Restitution Coefficient",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 0.05,
      tier: "free",
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
    "Use the four sliders to set Mass 1, Mass 2, Velocity 1, and the Restitution Coefficient. Object 2 starts at rest in this model. Press Launch to start the collision, then compare total momentum before and after to verify conservation. Use the Equal Mass Elastic, Heavy→Light, and Perfectly Inelastic presets to contrast elastic collisions where kinetic energy is conserved with inelastic collisions where momentum is conserved but kinetic energy decreases.",

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
  htmlControlAliases: { mass1: "sl-m1", mass2: "sl-m2", velocity1: "sl-v1", restitution: "sl-e" },
  presets: [
    { id: "elastic", label: "Equal Mass Elastic", paramValues: { mass1: 1, mass2: 1, velocity1: 5, restitution: 1 } },
    { id: "heavy", label: "Heavy→Light", paramValues: { mass1: 4, mass2: 1, velocity1: 5, restitution: 1 } },
    { id: "inelastic", label: "Perfectly Inelastic", paramValues: { mass1: 1, mass2: 1, velocity1: 5, restitution: 0 } },
  ],

  contentSections: {
    whatIsIt:
      "Slide a billiard ball straight at a stationary one of equal mass. The cue ball stops dead and the target ball rolls off with the original speed. That weird, almost magical exchange is conservation of momentum doing exactly what the math says it must. Now imagine the same hit but with a lump of clay instead — the moving ball plows into it, they stick together, and the combined blob continues at half the original speed. Different outcome, same conservation law: total momentum before equals total momentum after, every time, in any isolated collision. The difference between the two cases is what happens to kinetic energy: conserved in the elastic case, partly dumped into heat and deformation in the inelastic one. This lab launches a moving cart at a stationary target, with adjustable masses, an incoming velocity, and a coefficient of restitution slider so you can blend smoothly from perfectly bouncy to perfectly sticky.",
    parameterExplanations: {
      mass1:
        "Mass 1 is the mass of the moving cart before the collision. In AP Physics 1 and HS-PS2 work, this slider lets students separate mass from speed in the momentum equation p = mv. With Velocity 1 fixed, increasing Mass 1 increases the incoming momentum and usually makes cart 1 harder to slow down or reverse. Compare the Equal Mass Elastic preset with Heavy→Light: the same launch speed produces a very different post-collision split because the larger mass carries more momentum into the interaction. Students can use this slider to test that total system momentum, not either cart's individual momentum, is the conserved quantity.",
      mass2:
        "Mass 2 is the mass of the target cart, which starts at rest in this HTML model. Changing it alters how the incoming momentum from cart 1 is distributed after contact. Equal masses in an elastic collision produce the classic AP Physics 1 result: cart 1 stops and cart 2 leaves with nearly the original speed. A lighter target shoots away faster; a heavier target changes speed less. This supports HS-PS2-2 because students can use measurements and mathematical representations to show that the final velocities change with mass ratio while total momentum before and after remains constant.",
      velocity1:
        "Velocity 1 is the initial velocity of the moving cart. It sets both the sign and size of cart 1's starting momentum, p_1 = m_1v_1, while cart 2 begins at rest. Positive and negative values represent opposite directions, so students can connect vector signs to momentum bookkeeping instead of treating speed as just a positive number. With Mass 1 fixed, doubling Velocity 1 doubles incoming momentum but quadruples kinetic energy. That contrast is central to AP Physics 1: momentum conservation constrains every isolated collision, while kinetic energy conservation depends on whether the collision is elastic.",
      restitution:
        "The Restitution Coefficient controls how bouncy the collision is. A value of 1 represents the elastic limit, where total momentum and total kinetic energy are both conserved. A value of 0 represents the perfectly inelastic limit, where the carts stick together and share one final velocity. Intermediate values keep momentum conserved but reduce the relative separation speed after impact, modeling real materials that deform, heat, or vibrate. Use the Perfectly Inelastic preset and then raise this slider toward 1 to help students see the HS-PS2 and AP distinction: momentum is the system-level invariant, while kinetic energy can leave the macroscopic motion.",
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
          "Only true for equal masses in 1D elastic collisions, like the Equal Mass Elastic preset. With unequal masses or inelastic conditions, the velocity changes are not equal and opposite. What is always equal and opposite — for any isolated collision — is the impulse (Δp) on each object. The forces during contact are equal and opposite by Newton's third law, but the resulting velocity changes depend on Mass 1, Mass 2, and the restitution setting.",
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
      "HS-PS2-2 momentum audit: have students run the Equal Mass Elastic, Heavy→Light, and Perfectly Inelastic presets, record p_1, p_2, and p_total before and after, and verify that p_total stays constant even when the visible outcomes look very different.",
      "HS-PS2-3 design prompt: ask groups to use Mass 1, Mass 2, Velocity 1, and Restitution Coefficient to design a collision that reduces final kinetic energy while preserving total momentum, then justify how the Perfectly Inelastic preset models energy transfer into deformation or heat.",
      "AP equal-mass benchmark: start with Equal Mass Elastic, then change only Mass 2. Students predict whether cart 1 stops, rebounds, or keeps moving, using conservation of momentum and kinetic energy instead of intuition.",
      "Mass-ratio investigation: start from Heavy→Light, hold Velocity 1 and Restitution Coefficient fixed, and sweep Mass 1 and Mass 2 through several ratios. Students explain why equal impulses create different velocity changes for the two carts.",
      "Restitution comparison lab: keep Mass 1, Mass 2, and Velocity 1 fixed while moving Restitution Coefficient from 1 to 0. Students compare KE_before and KE_after and write a claim-evidence-reasoning response about why momentum conservation survives in both elastic and inelastic cases.",
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
          "It measures how much relative speed remains after the objects collide. In this lab, cart 2 starts at rest and Velocity 1 sets the incoming motion, so the Restitution Coefficient slider controls how strongly the carts separate after impact. For e = 1, the collision is perfectly elastic and the objects separate with no kinetic-energy loss in the model. For e = 0, they do not separate at all and move together as a perfectly inelastic pair. Real-world collisions live between those extremes.",
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
          "AP Physics 1 standard 5.D.1 expects students to apply conservation of linear momentum to collisions, distinguish elastic from inelastic outcomes, and use the impulse-momentum theorem. This lab is a controlled version of the common moving-cart-into-stationary-cart problem: students set Mass 1, Mass 2, Velocity 1, and Restitution Coefficient, predict post-collision states, verify conservation, and compare how the Equal Mass Elastic and Perfectly Inelastic presets treat kinetic energy. NGSS HS-PS2-2 covers the same ground from a slightly different angle.",
      },
    ],
  },
};
