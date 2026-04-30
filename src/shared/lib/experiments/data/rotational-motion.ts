import type { Experiment } from "@/shared/types/experiment";

export const rotationalMotion: Experiment = {
  id: "rotational-motion",
  slug: "rotational-motion",
  title: "Rotational Motion & Torque",
  subtitle: "Angular momentum, moment of inertia, and spinning objects",
  description:
    "Apply torques to rotating objects and watch angular momentum conservation in action. See a spinning skater pull in their arms to spin faster — the same physics that governs everything from planets to gyroscopes.",
  thumbnail: "/imgs/experiments/rotational-motion.png",

  standards: {
    ngss: ["HS-PS2-1", "HS-PS2-2"],
    gcse: ["P5.5"],
    ap: ["3.F.1", "3.F.2", "3.F.3", "4.D.1", "4.D.2", "4.D.3"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["torque", "angular momentum", "moment of inertia", "rotational kinematics", "AP Physics 1"],
  difficulty: "advanced",

  parameters: [
    {
      id: "torque",
      label: "Applied Torque (τ)",
      unit: "N·m",
      min: 0,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "inertia",
      label: "Moment of Inertia (I)",
      unit: "kg·m²",
      min: 0.5,
      max: 10,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "armRadius",
      label: "Skater Arm Radius",
      unit: "m",
      min: 0.2,
      max: 1.5,
      default: 0.8,
      step: 0.05,
      tier: "free",
    },
    {
      id: "mass",
      label: "Skater Mass (m)",
      unit: "kg",
      min: 30,
      max: 120,
      default: 60,
      step: 5,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\tau = rF\\sin\\theta = I\\alpha",
      description: "Torque (rotational equivalent of F=ma)",
    },
    {
      latex: "L = I\\omega",
      description: "Angular momentum",
    },
    {
      latex: "L_i = L_f \\Rightarrow I_1\\omega_1 = I_2\\omega_2",
      description: "Conservation of angular momentum",
    },
    {
      latex: "I = \\sum m_i r_i^2",
      description: "Moment of inertia (depends on mass distribution)",
    },
    {
      latex: "KE_{rot} = \\frac{1}{2}I\\omega^2",
      description: "Rotational kinetic energy",
    },
  ],

  theory:
    "Torque is the rotational equivalent of force: τ = rF sinθ. The rotational equivalent of Newton's 2nd Law is τ = Iα. Angular momentum L = Iω is conserved when no external torque acts — this is why a spinning skater spins faster when they pull in their arms (reducing I increases ω to keep L constant). The moment of inertia I depends on how mass is distributed relative to the rotation axis.",

  instructions:
    "Apply torque to spin the disk. Observe angular acceleration α = τ/I. Then switch to the skater mode: start spinning with arms out, then pull them in and watch ω increase. The angular momentum display confirms conservation. Adjust the arm radius and watch the dramatic effect on spin speed.",

  hook: {
    question:
      "Why do figure skaters spin faster when they pull their arms in?",
    context:
      "No extra push, no extra energy input — yet they visibly accelerate. The answer lies in angular momentum conservation.",
    actionPrompt: "Try it with the virtual skater",
  },

  learningCards: [
    {
      id: "rm-lc1",
      title: "Moment of Inertia",
      content:
        "Moment of inertia is the rotational equivalent of mass — it measures how hard it is to change an object's rotation. Unlike mass, it depends on how the mass is distributed relative to the axis. Moving mass farther from the axis dramatically increases the moment of inertia.",
      formula: {
        latex: "I = \\sum m_i r_i^2",
        description: "Moment of inertia depends on mass distribution",
      },
      relatedParameterId: "inertia",
    },
    {
      id: "rm-lc2",
      title: "Angular Momentum Conservation",
      content:
        "When no external torque acts on a system, angular momentum L = Iw is conserved. If the moment of inertia decreases (arms pulled in), angular velocity must increase proportionally. This is why a skater pulling in their arms can triple their spin rate.",
      formula: {
        latex: "I_1\\omega_1 = I_2\\omega_2",
        description: "Angular momentum is conserved when net external torque is zero",
      },
      relatedParameterId: "armRadius",
    },
    {
      id: "rm-lc3",
      title: "Torque: The Rotational Force",
      content:
        "Torque is what causes angular acceleration, just as force causes linear acceleration. It depends on three factors: the magnitude of the force, the distance from the pivot (lever arm), and the angle of application. This is why longer wrenches make bolts easier to turn.",
      formula: {
        latex: "\\tau = rF\\sin\\theta = I\\alpha",
        description: "Torque equals moment of inertia times angular acceleration",
      },
      relatedParameterId: "torque",
    },
    {
      id: "rm-lc4",
      title: "Rotational Kinetic Energy",
      content:
        "A spinning object carries kinetic energy even if its center of mass is stationary. When a skater pulls in their arms, their rotational KE actually increases — the extra energy comes from the work done by their muscles pulling inward against centripetal acceleration.",
      formula: {
        latex: "KE_{rot} = \\frac{1}{2}I\\omega^2",
        description: "Rotational kinetic energy",
      },
    },
  ],

  easterEggs: [
    {
      parameterId: "torque",
      condition: "max",
      effect: "The disk spins up to extreme angular velocity within seconds, trailing motion blur",
      message: "20 N·m of torque! That is roughly the force needed to snap a thick tree branch — applied rotationally.",
    },
    {
      parameterId: "armRadius",
      condition: "min",
      effect: "The skater spins at incredible speed with arms tucked in tightly",
      message: "Arms fully tucked! Watch the angular velocity skyrocket as moment of inertia plummets.",
    },
  ],

  challenges: [
    {
      id: "rm-c1",
      question: "A disk (I = 2 kg·m²) has a net torque of 8 N·m applied. What is its angular acceleration?",
      options: ["2 rad/s²", "4 rad/s²", "8 rad/s²", "16 rad/s²"],
      correctAnswer: "4 rad/s²",
      hint: "α = τ/I",
      relatedParameterId: "torque",
      tier: "free",
    },
    {
      id: "rm-c2",
      question: "A skater spins at 2 rad/s with I = 4 kg·m². They pull in arms to I = 1 kg·m². New ω?",
      options: ["2 rad/s", "4 rad/s", "8 rad/s", "16 rad/s"],
      correctAnswer: "8 rad/s",
      hint: "L = Iω is conserved: I₁ω₁ = I₂ω₂",
      relatedParameterId: "armRadius",
      tier: "free",
    },
    {
      id: "rm-c3",
      question: "Why does a longer wrench make it easier to loosen a bolt?",
      options: [
        "It increases the force you apply",
        "It increases the lever arm, producing more torque for the same force",
        "It reduces friction at the bolt",
        "It changes the angle of the applied force",
      ],
      correctAnswer: "It increases the lever arm, producing more torque for the same force",
      hint: "τ = rF — larger r means larger torque for same force",
      tier: "free",
    },
    {
      id: "rm-c4",
      question: "A solid disk (I = ½MR²) and a hollow ring (I = MR²) of equal mass and radius start from rest on an incline. Which reaches the bottom first?",
      options: [
        "The hollow ring (more rotational inertia helps)",
        "The solid disk (lower I means more translational KE)",
        "They arrive at the same time",
        "It depends on the angle of the incline",
      ],
      correctAnswer: "The solid disk (lower I means more translational KE)",
      hint: "Lower I → more of PE converts to translational KE. Use energy conservation.",
      relatedParameterId: "inertia",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "pro",
  estimatedTime: 20,
  relatedExperiments: ["circular-motion", "newtons-laws"],

  seoTitle: "Rotational Motion & Torque — Interactive 3D Simulation | Scivra",
  seoKeywords: [
    "rotational motion simulation",
    "torque angular momentum",
    "moment of inertia",
    "AP Physics 1 rotation",
    "angular momentum conservation",
    "spinning skater physics",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Rotational Motion and Angular Momentum",
  },

  contentSections: {
    whatIsIt:
      "A figure skater starts a slow spin with arms wide, then pulls them tight against her chest — and visibly accelerates into a blur. Nobody pushed her. Her muscles only pulled inward, perpendicular to the spin. Yet her angular velocity tripled in a second. The reason is angular momentum conservation: when no external torque acts, the product L = Iω stays constant, so shrinking the moment of inertia I forces the angular velocity ω to grow in lockstep. The same physics governs a diver tucking for a flip, a neutron star spinning up as it collapses, and a wheel resisting being shoved off-axis. This lab lets you torque a disk to study τ = Iα directly, then switch to the skater mode to watch L = Iω hold its line as you pull her arms in and out — angular momentum, moment of inertia, and rotational kinetic energy all on display in real time.",
    parameterExplanations: {
      torque:
        "The applied torque τ in N·m, the rotational analog of force. It produces angular acceleration through τ = Iα: doubling the torque doubles the angular acceleration if I is fixed. Like force, torque has a sign: positive spins one way, negative spins the other. The magnitude depends on both how hard you push and how far from the axis you push.",
      inertia:
        "The moment of inertia I in kg·m², measuring how hard it is to change the object's rotation. Unlike mass, I depends on the geometry: the same 2 kg packed close to the axis gives a smaller I than 2 kg spread out at the rim. Higher I means slower angular acceleration for the same torque, and slower angular velocity at the same angular momentum.",
      armRadius:
        "The skater's arm radius r in meters — how far her hands are from the spin axis. Because the arms' contribution to I scales as m·r², halving the radius cuts that contribution by a factor of four. This is the lever you push to demonstrate angular momentum conservation: change r, watch ω respond inversely to keep L = Iω constant.",
      mass:
        "The skater's mass m in kilograms. It scales the contribution of the arms to the moment of inertia (the m in m·r²), so a heavier skater with the same arm radius has a larger I and a slower spin at the same angular momentum. Mass also sets the rotational kinetic energy budget through KE_rot = ½Iω².",
    },
    misconceptions: [
      {
        wrong:
          "Torque is just rotational force — bigger force always means bigger torque.",
        correct:
          "Torque depends on force, lever arm, and angle: τ = rF·sinθ. The same force applied close to the pivot or in line with the lever produces little torque; far from the pivot and perpendicular, it produces a lot. That's why door handles are placed far from the hinge — the geometry is doing as much work as the force is.",
      },
      {
        wrong:
          "When a skater pulls her arms in and spins faster, her energy stays the same because no work was done.",
        correct:
          "Her rotational kinetic energy actually increases. KE_rot = ½Iω² and conservation of angular momentum (Iω = constant) together imply KE goes up by a factor equal to the ratio I_initial/I_final. Where does that extra energy come from? From the work her muscles did pulling her arms inward against the centripetal force needed to keep them on the smaller circle.",
      },
      {
        wrong:
          "Angular momentum is conserved in any system as long as the total energy stays constant.",
        correct:
          "Angular momentum is conserved when the net external TORQUE on the system is zero — that's the key requirement, and it's distinct from energy conservation. A skater on frictionless ice has no external horizontal torque, so L is conserved even when she does internal work that changes her KE. Conversely, energy can be conserved while L is not, if external torques are present.",
      },
      {
        wrong:
          "All objects with the same mass and radius have the same moment of inertia.",
        correct:
          "Moment of inertia depends on how the mass is distributed, not just the totals. A solid disk of mass M and radius R has I = ½MR²; a hollow ring with the same M and R has I = MR² — twice as much. The ring puts all its mass at the maximum radius, so it's harder to spin up. That's why hollow tubes resist twisting more than solid rods of equal mass.",
      },
      {
        wrong:
          "A solid disk and a hollow ring of equal mass and radius will tie when rolling down an incline.",
        correct:
          "The solid disk wins. Both convert the same gravitational PE, but the ring puts a larger fraction of its KE into rotation (because of its higher I) and less into translation. Less translational KE means less linear speed at the bottom. Lower I → faster roll. This is one of the cleanest demonstrations that geometry, not just mass, governs rotational behavior.",
      },
    ],
    teacherUseCases: [
      "Lever-arm hunt: have students apply the same 5 N force at three different distances from a pivot — say 0.1 m, 0.3 m, and 0.6 m — and record the resulting angular acceleration. Plot α vs. r. The straight line through the origin verifies τ = rF and the τ = Iα relationship in one stroke.",
      "Angular momentum collection: in skater mode, record I and ω at five different arm radii from 0.2 m to 1.5 m. Compute L = Iω at each setting and check that it's constant to within rounding. Then plot ω vs. 1/I — should be a straight line whose slope is L.",
      "Energy paradox probe: ask students whether the skater's rotational KE is conserved when she pulls her arms in. Most will say yes because 'no external work is done.' Have them compute KE_initial and KE_final — they'll find KE goes up. Use that to introduce the idea that the skater's muscles did internal work against the centripetal force.",
      "Geometry-of-inertia race: give students three objects in the simulation (or as homework) — a solid disk, a hollow ring, and a solid sphere — all with equal mass and radius, and have them rank them by which rolls fastest down an incline. Run the prediction, then have them justify the order using the moment of inertia formulas.",
      "Misconception probe — wrenches and torque: before the lab, ask 'why does a longer wrench make a stuck bolt easier to loosen?' Most will say something like 'more leverage' without specifying the physics. Use τ = rF to show that the longer wrench multiplies the lever arm, producing more torque from the same hand force.",
    ],
    faq: [
      {
        question: "What is angular momentum and why is it conserved?",
        answer:
          "Angular momentum L = Iω is the rotational analog of linear momentum. It's conserved when the net external torque on a system is zero, just as linear momentum is conserved when the net external force is zero. The reason is symmetry: the laws of physics don't change if you rotate the universe, and that rotational symmetry mathematically guarantees angular momentum conservation. It's why a freely spinning top keeps its axis pointed in the same direction and why planets keep orbiting on the same plane.",
      },
      {
        question: "Why does a skater spin faster when she pulls her arms in?",
        answer:
          "Because L = Iω is constant when no external torque acts. The skater on smooth ice experiences no significant external torque about the spin axis. When she pulls her arms in, her moment of inertia I drops because mass is now closer to the rotation axis. To keep the product Iω constant, ω has to increase by exactly the same factor I shrank. Cut I in half and ω doubles. Cut it to a third and ω triples — without any external push.",
      },
      {
        question: "What is moment of inertia and how is it different from mass?",
        answer:
          "Moment of inertia is the rotational analog of mass — it tells you how hard it is to change an object's rotational state. Unlike linear mass, it depends on how that mass is arranged relative to the rotation axis. The same 5 kg gathered near the axis has a small I; spread out at a large radius, it has a much larger I. The math is I = Σ m_i·r_i². For continuous bodies, geometry sets the formula: ½MR² for a solid disk, MR² for a hoop, ⅖MR² for a solid sphere.",
      },
      {
        question: "Where does the extra rotational kinetic energy come from when the skater pulls in her arms?",
        answer:
          "From the work her muscles do pulling inward. Holding her arms out, the rotation requires a centripetal force directed inward to keep them on circular paths. When she pulls them in, her muscles supply additional force in the inward direction over a real distance, doing positive work. That work converts chemical energy in her muscles into the increased rotational kinetic energy you see. Angular momentum is conserved because no external torque acts; rotational KE rises because internal work is done.",
      },
      {
        question: "Why does a longer wrench make it easier to loosen a stuck bolt?",
        answer:
          "Because torque depends on the lever arm, not just the force you apply. The relationship is τ = rF·sinθ. Doubling the wrench length doubles r, and at the same hand force you produce twice the torque on the bolt. The bolt only knows the torque, not the force, so the doubled torque is twice as effective at overcoming whatever holds it in place. The same logic explains why doors have handles far from the hinge and why steering wheels are wider than the steering column.",
      },
      {
        question: "How does this lab connect to AP Physics 1 standards 4.D.1 through 4.D.3?",
        answer:
          "AP Physics 1 standards 4.D.1 through 4.D.3 expect students to analyze rotational motion using torque, moment of inertia, and angular momentum, and to apply conservation of angular momentum to systems with no net external torque. This lab is the canonical setup for those standards: students apply known torques to known moments of inertia, verify τ = Iα directly, and then use the spinning skater to confirm Iω constancy under self-imposed changes in I. NGSS HS-PS2-1 supports the same conceptual goals.",
      },
    ],
  },
};
