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
      id: "mass",
      label: "Mass (m)",
      unit: "kg",
      min: 0.1,
      max: 20,
      default: 5,
      step: 0.1,
      tier: "free",
    },
    {
      id: "radius",
      label: "Radius (R)",
      unit: "m",
      min: 0.2,
      max: 3,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "torque",
      label: "Applied Torque (τ)",
      unit: "N·m",
      min: 0,
      max: 100,
      default: 10,
      step: 1,
      tier: "free",
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
    "Use the Mass, Radius, and Torque sliders to change the rotating object's inertia and angular acceleration. Try the Disk, Ring, and Sphere presets to compare the three built-in geometries, then change one slider at a time while watching I, α, ω, τ, and rotational kinetic energy update.",

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
  htmlPath: "/experiments/ap-physics/rotational-motion.html",
  htmlControlAliases: { mass: "sM", radius: "sR", torque: "sTau" },
  presets: [
    {
      id: "disk",
      label: "Disk",
      description:
        "A solid disk uses I = 1/2 mR², so it spins up faster than a ring with the same mass, radius, and torque.",
    },
    {
      id: "ring",
      label: "Ring",
      description:
        "A thin ring places its mass at the rim, giving I = mR² and a smaller angular acceleration for the same applied torque.",
    },
    {
      id: "sphere",
      label: "Sphere",
      description:
        "A solid sphere uses I = 2/5 mR², making it the lowest-inertia comparison case among the three presets.",
    },
  ],

  contentSections: {
    whatIsIt:
      "A figure skater starts a slow spin with arms wide, then pulls them tight against her chest — and visibly accelerates into a blur. Nobody pushed her. Her muscles only pulled inward, perpendicular to the spin. Yet her angular velocity tripled in a second. The reason is angular momentum conservation: when no external torque acts, the product L = Iω stays constant, so shrinking the moment of inertia I forces the angular velocity ω to grow in lockstep. The same physics governs a diver tucking for a flip, a neutron star spinning up as it collapses, and a wheel resisting being shoved off-axis. This lab lets you torque a disk to study τ = Iα directly, then switch to the skater mode to watch L = Iω hold its line as you pull her arms in and out — angular momentum, moment of inertia, and rotational kinetic energy all on display in real time.",
    parameterExplanations: {
      mass:
        "Mass sets how much material the rotating object has, from a light 0.1 kg object to a 20 kg object. In every preset, moment of inertia is proportional to mass: I = 1/2 mR² for a disk, I = mR² for a ring, and I = 2/5 mR² for a sphere. Increasing Mass therefore makes the object harder to angularly accelerate under the same Torque. Keep Radius and Torque fixed, then compare how α falls as Mass rises. This separates the effect of total material from the effect of shape.",
      radius:
        "Radius sets how far the object's mass extends from the rotation axis. It matters strongly because the moment-of-inertia formulas all include R², so doubling Radius makes I four times larger for the same Mass and object type. A larger Radius therefore reduces angular acceleration when Torque is unchanged, while a smaller Radius lets the same torque spin the object up faster. Use the Disk, Ring, and Sphere presets at the same Radius first, then move only Radius to see why mass distribution is more than just the total amount of mass.",
      torque:
        "Torque is the external twist applied to the object, measured in N·m. It is the rotational analog of net force and controls angular acceleration through τ = Iα. When Mass, Radius, and preset geometry stay fixed, increasing Torque increases α directly, so angular velocity builds faster and rotational kinetic energy rises more quickly. A zero Torque setting lets students see that no new angular acceleration is added; a high Torque setting makes the same inertia respond more dramatically. Compare the three presets at one Torque value to isolate how I changes the outcome.",
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
          "If two objects have the same mass and radius, they must spin up the same way.",
        correct:
          "Mass and radius are not enough; distribution matters. A disk, ring, and sphere with the same M and R have different moments of inertia: ½MR², MR², and 2/5MR². Under the same torque, the smaller-I object has the larger angular acceleration.",
      },
      {
        wrong:
          "Angular momentum is conserved in any system as long as the total energy stays constant.",
        correct:
          "Angular momentum is conserved when the net external TORQUE on the system is zero — that's the key requirement, and it's distinct from energy conservation. In this lab, a nonzero Torque slider means angular momentum is changing. Conversely, energy can be conserved while L is not, if external torques are present.",
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
      "Preset comparison: set Mass, Radius, and Torque to the same values, then compare Disk, Ring, and Sphere. Students rank angular acceleration and justify the order from I = 1/2 mR², I = mR², and I = 2/5 mR².",
      "Radius-squared investigation: keep the Disk preset, Mass, and Torque fixed while students double Radius. Have them predict and then verify that moment of inertia grows by about four times and angular acceleration drops accordingly.",
      "Torque proportionality plot: keep Mass, Radius, and preset geometry fixed while students collect α at several Torque values. Graph α versus τ to verify the direct relationship in τ = Iα.",
      "Mass isolation task: hold Radius and Torque fixed, then move only the Mass slider. Students explain why changing mass changes I and α without changing the object's geometric formula.",
      "Rolling-race extension: after comparing Disk, Ring, and Sphere presets, ask students to predict which object would roll down an incline fastest and connect the answer to how much energy goes into rotation.",
    ],
    faq: [
      {
        question: "What is angular momentum and why is it conserved?",
        answer:
          "Angular momentum L = Iω is the rotational analog of linear momentum. It's conserved when the net external torque on a system is zero, just as linear momentum is conserved when the net external force is zero. The reason is symmetry: the laws of physics don't change if you rotate the universe, and that rotational symmetry mathematically guarantees angular momentum conservation. In this lab, the active focus is torque-driven change: when you apply a nonzero τ, angular momentum changes; when τ is zero, the object keeps its current rotational state.",
      },
      {
        question: "Why does the ring spin up more slowly than the disk?",
        answer:
          "A thin ring puts essentially all of its mass at radius R, so its moment of inertia is I = mR². A solid disk spreads mass from the center out to the rim, giving I = 1/2 mR². With equal mass, radius, and torque, the ring has the larger I, so α = τ/I is smaller. The result is a slower increase in angular velocity even though the applied torque is the same.",
      },
      {
        question: "What is moment of inertia and how is it different from mass?",
        answer:
          "Moment of inertia is the rotational analog of mass — it tells you how hard it is to change an object's rotational state. Unlike linear mass, it depends on how that mass is arranged relative to the rotation axis. The same 5 kg gathered near the axis has a small I; spread out at a large radius, it has a much larger I. The math is I = Σ m_i·r_i². For continuous bodies, geometry sets the formula: ½MR² for a solid disk, MR² for a hoop, ⅖MR² for a solid sphere.",
      },
      {
        question: "What happens if I increase radius while mass stays fixed?",
        answer:
          "Moment of inertia rises with the square of radius in the disk, ring, and sphere formulas. If Radius doubles while Mass and object type stay fixed, I becomes four times larger. Since angular acceleration follows α = τ/I, the same Torque then produces only one quarter of the angular acceleration. This is why moving mass farther from the axis has such a strong effect on rotational motion.",
      },
      {
        question: "Why does a longer wrench make it easier to loosen a stuck bolt?",
        answer:
          "Because torque depends on the lever arm, not just the force you apply. The relationship is τ = rF·sinθ. Doubling the wrench length doubles r, and at the same hand force you produce twice the torque on the bolt. The bolt only knows the torque, not the force, so the doubled torque is twice as effective at overcoming whatever holds it in place. The same logic explains why doors have handles far from the hinge and why steering wheels are wider than the steering column.",
      },
      {
        question: "How does this lab connect to AP Physics 1 standards 4.D.1 through 4.D.3?",
        answer:
          "AP Physics 1 standards 4.D.1 through 4.D.3 expect students to analyze rotational motion using torque, moment of inertia, and angular momentum, and to apply conservation of angular momentum to systems with no net external torque. This lab gives students known torques, measured angular acceleration, and three preset geometries so they can verify τ = Iα and compare how mass distribution changes I. NGSS HS-PS2-1 supports the same conceptual goals.",
      },
    ],
  },
};
