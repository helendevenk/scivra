import type { Experiment } from "@/shared/types/experiment";

export const workEnergyTheorem: Experiment = {
  id: "work-energy-theorem",
  slug: "work-energy-theorem-power",
  title: "Work-Energy Theorem",
  subtitle: "Net work equals change in kinetic energy on inclined surfaces",
  description:
    "Place a block on an adjustable incline and apply forces to explore how net work changes kinetic energy. Visualize energy flow between gravitational PE, KE, and thermal energy. Measure instantaneous power and verify the work-energy theorem across multiple friction scenarios.",
  thumbnail: "/imgs/experiments/work-energy-theorem.png",

  standards: {
    ngss: ["HS-PS3-1", "HS-PS3-2", "HS-PS3-3"],
    gcse: ["P4.2", "P4.3"],
    ap: ["INT-3.A", "INT-3.B", "INT-3.C", "INT-3.D"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["work", "energy", "kinetic energy", "power", "friction", "incline", "AP Physics 1", "work-energy theorem"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "mass",
      label: "Mass",
      unit: "kg",
      min: 0.5,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "angle",
      label: "Incline Angle",
      unit: "°",
      min: 10,
      max: 75,
      default: 30,
      step: 1,
      tier: "free",
    },
    {
      id: "friction_coeff",
      label: "Friction Coefficient (μ)",
      unit: "",
      min: 0,
      max: 0.8,
      default: 0,
      step: 0.01,
      tier: "pro",
    },
    {
      id: "applied_force",
      label: "Applied Force",
      unit: "N",
      min: 0,
      max: 100,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "W_{net} = \\Delta KE = \\frac{1}{2}mv^2 - \\frac{1}{2}mv_0^2",
      description: "Work-Energy Theorem: net work equals change in kinetic energy",
    },
    {
      latex: "W = F \\cdot d \\cdot \\cos\\theta",
      description: "Work done by a constant force over displacement",
    },
    {
      latex: "P = \\frac{W}{t} = F \\cdot v",
      description: "Power: rate of doing work or force times velocity",
    },
    {
      latex: "\\Delta E_{mech} = W_{friction} = -\\mu mg\\cos\\theta \\cdot d",
      description: "Mechanical energy lost to friction on the incline",
    },
  ],

  theory:
    "The work-energy theorem states that the net work done on an object equals its change in kinetic energy. On an incline, multiple forces act simultaneously: gravity component along the slope, normal force, friction, and any applied force. Only forces with a component along the displacement do work. Friction converts mechanical energy to thermal energy, reducing the net kinetic energy gain. Power measures how quickly work is performed — the same task done in less time requires more power. Understanding this theorem bridges Newton's force-based approach with the energy-based perspective essential for thermodynamics and modern physics.",

  instructions:
    "Set the block mass and incline angle. Press Play to release the block and observe its acceleration down the slope. Watch the energy bar chart showing KE, gravitational PE, and thermal energy. Enable friction via the μ slider (Pro) to see energy dissipation. Add an applied force pushing the block up the slope. The work readout shows W_gravity, W_friction, W_applied, and W_net — verify that W_net = ΔKE at every snapshot.",

  hook: {
    question: "If you push a box twice as far, do you do twice the work?",
    context: "Only if the force stays constant — in the real world, friction, angles, and changing forces make the answer surprisingly nuanced.",
    actionPrompt: "Apply a force on the incline and watch the work accumulate in real-time",
  },

  learningCards: [
    {
      id: "wet-lc1",
      title: "What Is Work?",
      content: "Work is energy transferred by a force acting over a displacement. Only the component of force parallel to the displacement does work. A force perpendicular to motion (like the normal force on a flat surface) does zero work, no matter how large it is.",
      formula: { latex: "W = F \\cdot d \\cdot \\cos\\theta", description: "Work done by a constant force" },
      relatedParameterId: "applied_force",
    },
    {
      id: "wet-lc2",
      title: "Kinetic Energy",
      content: "Kinetic energy is the energy of motion: ½mv². It depends on both mass and the square of velocity — so doubling speed quadruples kinetic energy. This is why car crashes at high speed are so much more devastating than at low speed.",
      formula: { latex: "KE = \\frac{1}{2}mv^2", description: "Kinetic energy" },
      relatedParameterId: "mass",
    },
    {
      id: "wet-lc3",
      title: "The Work-Energy Theorem",
      content: "The net work done on an object equals its change in kinetic energy. This powerful theorem connects force-based analysis (Newton's laws) with energy-based analysis. It works even when multiple forces act simultaneously — just sum all the work contributions.",
      formula: { latex: "W_{net} = \\Delta KE = \\frac{1}{2}mv_f^2 - \\frac{1}{2}mv_i^2", description: "Net work equals change in kinetic energy" },
      relatedParameterId: "angle",
    },
    {
      id: "wet-lc4",
      title: "Conservative vs Non-Conservative Forces",
      content: "Gravity is conservative — work depends only on height change, not the path taken. Friction is non-conservative — it always removes mechanical energy as heat. On an incline with friction, the block gains less kinetic energy than gravity alone would provide because friction steals some as thermal energy.",
      formula: { latex: "W_{friction} = -\\mu mg\\cos\\theta \\cdot d", description: "Work done by friction (always negative)" },
      relatedParameterId: "friction_coeff",
    },
  ],

  easterEggs: [
    {
      parameterId: "applied_force",
      condition: "max",
      effect: "extreme-acceleration-rocket-visual",
      message: "100 N on that block? It's accelerating faster than a sports car!",
    },
    {
      parameterId: "angle",
      condition: "max",
      effect: "nearly-vertical-cliff-visual",
      message: "75° — that's not an incline, that's practically a cliff!",
    },
    {
      parameterId: "friction_coeff",
      condition: "max",
      effect: "sticky-surface-glue-visual",
      message: "μ = 0.8 — this surface is stickier than rubber on asphalt!",
    },
  ],

  challenges: [
    {
      id: "wet-c1",
      question: "A 5 kg block slides from rest at h = 2 m on a frictionless incline. What is its speed at the bottom?",
      options: ["v ≈ 4.43 m/s", "v ≈ 6.26 m/s", "v ≈ 9.90 m/s", "v ≈ 3.13 m/s"],
      correctAnswer: "v ≈ 6.26 m/s",
      hint: "W_net = W_gravity = mgh. Then ½mv² = mgh → v = √(2gh)",
      relatedParameterId: "mass",
      tier: "free",
    },
    {
      id: "wet-c2",
      question: "With μ = 0.3 on a 30° incline, length d = 4 m, how much energy is lost to friction?",
      options: ["W_f ≈ 50.9 J", "W_f ≈ 58.9 J", "W_f ≈ 29.4 J", "W_f ≈ 98.1 J"],
      correctAnswer: "W_f ≈ 50.9 J",
      hint: "W_friction = μ·mg·cos30°·d. Normal force on incline = mg·cosθ",
      relatedParameterId: "friction_coeff",
      tier: "free",
    },
    {
      id: "wet-c3",
      question: "A 5 kg block reaches 6 m/s after 10 seconds on the incline. What is the average power delivered by net force?",
      options: ["P = 9 W", "P = 18 W", "P = 30 W", "P = 90 W"],
      correctAnswer: "P = 9 W",
      hint: "W_net = ΔKE = ½mv². P_avg = W_net / t",
      relatedParameterId: "mass",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["roller-coaster", "momentum-collisions", "newtons-laws"],

  seoTitle: "Work-Energy Theorem — Interactive Incline Lab | Scivra",
  seoKeywords: [
    "work energy theorem simulation",
    "kinetic energy incline",
    "net work calculator",
    "power physics",
    "AP Physics 1 work energy",
    "friction energy loss",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Work-Energy Theorem and Power",
  },

  contentSections: {
    whatIsIt:
      "Push a 5 kg crate up a 30° ramp, hold it for a moment, then let go. While you were pushing, your applied force did positive work; gravity did negative work on the way up; friction quietly nibbled energy away as heat the entire time. The instant you released, gravity took over and the crate accelerated back down — every joule of kinetic energy it gained came from the net work done on it. That equality, W_net = ΔKE, is the work-energy theorem, and it's the cleanest bridge between Newton's force-based picture and the energy-based picture you'll need for thermodynamics. This lab puts a block on an adjustable incline, lets you dial in friction and an applied force, and shows the four work contributions and the resulting kinetic-energy change side by side so you can verify the theorem yourself.",
    parameterExplanations: {
      mass:
        "The mass of the block in kilograms. Mass appears in every quantity here: gravitational force is mg, kinetic energy is ½mv², and acceleration on a frictionless incline is g·sinθ regardless of mass. Doubling m doubles every force and every energy magnitude, but doesn't change the acceleration on a smooth slope.",
      angle:
        "The incline angle measured from horizontal, in degrees. It splits gravity into two components: mg·sinθ along the slope (drives motion) and mg·cosθ perpendicular (sets the normal force). Steep angles drive faster sliding and reduce friction's grip; shallow angles do the opposite.",
      friction_coeff:
        "The dimensionless coefficient μ between the block and the incline surface. It controls how much mechanical energy is converted to heat per meter of travel: W_friction = -μ·mg·cosθ·d. At μ = 0, all gravitational PE becomes KE; at μ = 0.8, the surface is so sticky the block may not slide at all on shallow slopes.",
      applied_force:
        "An external push along the incline, in newtons. Pointing it up the slope can hold the block stationary, slow its descent, or even drive it uphill against gravity and friction. The work it does is W = F·d, signed positive if force and displacement align.",
    },
    misconceptions: [
      {
        wrong:
          "If you hold a heavy bag still at chest height for ten minutes, you're doing a lot of work because your muscles get tired.",
        correct:
          "Physically, the bag isn't moving — displacement is zero — so the work you do on it is zero. Your muscles burn calories because biological tissue can't hold a static load efficiently, but that energy isn't transferred to the bag. Work in physics requires displacement in the direction of the force.",
      },
      {
        wrong:
          "The normal force does work on the block as it slides down the incline because it's a real force pushing on the block.",
        correct:
          "The normal force is perpendicular to the incline surface, while the displacement is along the surface. Since cos(90°) = 0, W_normal = 0. Forces perpendicular to motion never do work, no matter how strong they are — that includes the centripetal force in circular motion too.",
      },
      {
        wrong:
          "If a block on an incline ends with the same speed it started, no work was done on it.",
        correct:
          "ΔKE = 0 means the NET work was zero, not that no individual force did any work. Gravity may have done positive work, friction negative work, and an applied force whatever was needed to balance the books. The work-energy theorem talks about the sum, not the individual contributions.",
      },
      {
        wrong:
          "Power is just another word for energy or work — they all mean roughly the same thing.",
        correct:
          "Power is the rate at which work is done: P = W/t = F·v. Two students who do the same total work climbing the stairs differ in power output if one runs and one walks. Energy is the capacity; work is the transfer; power is the speed of transfer. AP problems often hinge on telling them apart.",
      },
      {
        wrong:
          "On an incline with friction, energy is destroyed as the block slides down.",
        correct:
          "Energy is never destroyed. Friction converts mechanical energy (KE + PE) into thermal energy in the surfaces. Total energy is conserved; only mechanical energy decreases. The 'lost' joules are still there, just spread out as a tiny temperature rise in the block and the ramp.",
      },
    ],
    teacherUseCases: [
      "Energy ledger exercise: have students set μ = 0 and measure W_gravity, W_normal, W_applied, and W_net at the bottom of the incline for a 30° angle. Confirm W_net = ΔKE numerically. Then turn friction on and have them re-balance the ledger including W_friction. Goal: explicit verification of the theorem at the joule level.",
      "Power vs. work distinction: assign one group to apply 50 N over a 4 m incline as quickly as possible and another group to do the same work in twice the time. Record W and P for each. Discuss why the faster team's engine is 'more powerful' even though the work is identical.",
      "Misconception probe — the perpendicular force: pause the simulation mid-slide and ask 'is the normal force doing work right now?' Many students say yes because the force is large. Use the cosθ = 90° argument to lock in why perpendicular forces never do work, then connect to circular motion as a preview.",
      "Friction-as-thermodynamics gateway: have students compute W_friction at μ = 0.3 and convert it to a temperature rise assuming a steel block of known specific heat. Anchors the abstract 'thermal energy' label to a measurable quantity and previews PV = nRT–era thinking.",
      "Predict-then-test on steepness: ask students to predict whether doubling the incline angle from 20° to 40° will roughly double the bottom speed for a frictionless slide. Run it. The answer (no — it scales with √sinθ) breaks the linear-intuition reflex and motivates careful trig.",
    ],
    faq: [
      {
        question: "What exactly is the work-energy theorem and why is it useful?",
        answer:
          "The theorem says W_net = ΔKE: the sum of work done by all forces on an object equals the change in its kinetic energy. It's useful because it lets you skip step-by-step kinematics. If you know the forces and the displacement, you know the speed change directly without solving for acceleration first. On problems with curved paths or variable forces, the theorem is often dramatically faster than F = ma.",
      },
      {
        question: "Why does the angle matter so much when computing work and kinetic energy?",
        answer:
          "Two reasons. First, on an incline, gravity splits into mg·sinθ along the slope and mg·cosθ perpendicular — only the parallel component drives motion. Second, work is W = F·d·cos(angle between F and d), so you have to project every force onto the direction of motion. Get the angle right and the bookkeeping falls into place; get it wrong and the energies will not balance.",
      },
      {
        question: "Does friction always do negative work on the block?",
        answer:
          "On a sliding object, yes. Kinetic friction always opposes relative motion, so the angle between F_friction and the displacement is 180°, giving W_friction = -μN·d. This is why friction never gives energy to a block — it can only take it away as thermal energy. Static friction is different: it can do positive work on a body that is not slipping (think your shoe on the floor as you walk).",
      },
      {
        question: "How is power different from work?",
        answer:
          "Work tells you how much energy was transferred; power tells you how fast it was transferred. P = W/t for a steady process, or P = F·v at any instant. A car climbing a hill at constant speed does the same work whether it goes slowly or quickly, but the faster trip requires more power because the engine has to deliver that work in less time. AP problems will often ask for one when you instinctively reach for the other.",
      },
      {
        question: "Why doesn't the normal force do any work on the incline?",
        answer:
          "The normal force is perpendicular to the surface, and the block's displacement is along the surface. Since W = F·d·cosθ and the angle between them is 90°, the cosine kills the term: W_normal = 0. This is true for any force that stays perpendicular to motion. The normal force still matters — it sets the size of the friction force — but it doesn't transfer energy.",
      },
      {
        question: "How does this lab connect to AP Physics 1 standard INT-3.A?",
        answer:
          "AP Physics 1 standard INT-3.A asks students to use the work-energy theorem to predict and explain motion in systems with multiple forces, including non-conservative ones like friction. This lab is a near-canonical setup for that standard: students decompose forces on an incline, identify which do work, account for energy lost to friction, and verify that the net work matches the kinetic energy change. NGSS HS-PS3-1 ties in by demanding a quantitative model of energy flow.",
      },
    ],
  },
};
