import type { Experiment } from "@/shared/types/experiment";

export const projectileMotion: Experiment = {
  id: "projectile-motion",
  slug: "projectile-motion",
  title: "Projectile Motion",
  subtitle: "Launch, arc, and land",
  description:
    "Fire projectiles at different angles and velocities. Trace parabolic trajectories, measure range and max height, and discover why 45° gives maximum distance.",
  thumbnail: "/imgs/experiments/projectile-motion.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["P5.6"],
    ap: ["3.A.1", "3.E.1"],
  },
  primaryStandard: "ngss-hs",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["projectile", "trajectory", "parabola", "range", "angle"],
  difficulty: "beginner",

  parameters: [
    {
      id: "velocity",
      label: "Initial Velocity",
      unit: "m/s",
      min: 1,
      max: 100,
      default: 30,
      step: 1,
      tier: "free",
    },
    {
      id: "angle",
      label: "Launch Angle",
      unit: "°",
      min: 0,
      max: 90,
      default: 45,
      step: 1,
      tier: "free",
    },
    {
      id: "gravity",
      label: "Gravity",
      unit: "m/s²",
      min: 0.1,
      max: 25,
      default: 9.8,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "x = v_0 \\cos(\\theta) \\cdot t",
      description: "Horizontal position",
    },
    {
      latex: "y = v_0 \\sin(\\theta) \\cdot t - \\frac{1}{2}gt^2",
      description: "Vertical position",
    },
    {
      latex: "R = \\frac{v_0^2 \\sin(2\\theta)}{g}",
      description: "Range",
    },
    {
      latex: "H = \\frac{(v_0 \\sin\\theta)^2}{2g}",
      description: "Max height",
    },
  ],

  theory:
    "Projectile motion is the motion of an object thrown into the air, subject only to gravity. The horizontal and vertical components of motion are independent. The trajectory forms a parabola.",
  instructions:
    "Set the initial velocity and launch angle. Press play to fire the projectile. Observe the trajectory trace and compare range at different angles.",
  challenges: [
    {
      id: "pm-c1",
      question: "Which angle gives the maximum range?",
      hint: "Try angles between 30° and 60°",
      tier: "free",
    },
    {
      id: "pm-c2",
      question: "What is the flight time for v₀=50 m/s at 30°?",
      hint: "T = 2v₀sin(θ)/g",
      tier: "free",
    },
    {
      id: "pm-c3",
      question: "How does gravity on Mars (3.7 m/s²) affect the range?",
      hint: "Adjust the gravity slider",
      tier: "pro",
    },
  ],

  wave: 1,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["newtons-laws"],

  seoTitle: "Projectile Motion — Interactive 3D Simulation | Scivra",
  seoKeywords: [
    "projectile motion",
    "trajectory",
    "launch angle",
    "physics simulation",
    "parabolic motion",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Projectile Motion",
  },

  contentSections: {
    whatIsIt:
      "Projectile motion describes any object thrown into the air and then left to gravity — a basketball heading for the rim, a fountain arcing over a courtyard, a long jumper flying off the board. Once the object leaves the launcher, only gravity pulls on it (we ignore air resistance for now). The horizontal motion stays constant while the vertical motion accelerates downward, and the two combine into a parabolic path. Tweak the launch angle, change the speed, or swap planets in the lab and watch the same physics produce wildly different trajectories.",
    parameterExplanations: {
      velocity:
        "The speed at the moment of launch. Doubling it roughly quadruples the range, because both how long the projectile stays airborne and how fast it travels horizontally grow with v.",
      angle:
        "The angle above horizontal. With the same speed, 45° gives the maximum range on flat ground. Smaller angles travel flatter and shorter, larger angles arc higher but cover less distance.",
      gravity:
        "Acceleration toward the ground. Earth is 9.8 m/s². On the Moon (1.6 m/s²) the same throw lasts much longer and goes far further. Cranking gravity up shortens flight time and range together.",
    },
    misconceptions: [
      {
        wrong:
          "Horizontal speed slows down during flight because gravity is pulling on the projectile.",
        correct:
          "Gravity only acts vertically. Horizontal speed stays constant the whole flight (when we ignore air resistance). What you see speeding up is the downward velocity, not the forward one.",
      },
      {
        wrong:
          "A bigger launch angle always gives a longer range — go for 60° or 70° to throw farther.",
        correct:
          "On flat ground, 45° wins. Above 45°, the projectile spends more time in the air but gives up too much horizontal speed; below 45° it has high horizontal speed but doesn't stay airborne long enough.",
      },
      {
        wrong:
          "At the top of the arc, the projectile is momentarily standing still.",
        correct:
          "Only the vertical velocity is zero at the peak. The horizontal velocity is the same as at launch — the object is still moving sideways.",
      },
      {
        wrong:
          "If two balls are thrown horizontally at different speeds from the same height, the faster one hits the ground later.",
        correct:
          "They hit the ground at the same time. Vertical fall is independent of horizontal speed — both balls only feel gravity vertically and start with zero downward velocity.",
      },
    ],
    teacherUseCases: [
      "Pre-lab prediction: have students sketch what they think the trajectory looks like at 30°, 45°, and 60° before they touch the controls. Compare predictions to the simulation.",
      "Range vs. angle plot: ask pairs to record range at 10° increments from 10° to 80° and plot the curve. Students should discover the symmetry around 45°.",
      "Real-world tie-in: assign one team Olympic shot put (release ~40°, height ~2 m), another long jump (~22°), another a soccer goal kick. Discuss why optimal angles differ from the textbook 45°.",
      "Off-Earth missions: change gravity to Mars (3.7 m/s²) or the Moon and have students predict how the same launch performs. Use this to introduce the dependence of g on planet.",
      "Misconception probe: replay the simulation paused at the apex and ask 'is the ball moving?' A surprising number say no — use that as a discussion entry to horizontal velocity.",
    ],
    faq: [
      {
        question: "Why is 45 degrees the best launch angle for maximum range?",
        answer:
          "On flat ground with no air resistance, range is proportional to sin(2θ), which peaks at 2θ = 90° → θ = 45°. Steeper angles waste horizontal distance for height; flatter angles waste airtime. Once you change the launch height or factor in air drag, the optimum shifts a few degrees lower.",
      },
      {
        question: "Does a heavier projectile travel a different distance than a lighter one?",
        answer:
          "Without air resistance, no. Gravity accelerates every object the same regardless of mass, so range depends only on initial speed, angle, and gravitational strength. With air resistance, heavier projectiles slow down less and tend to go further — that's why Olympic shot puts behave differently from ping-pong balls.",
      },
      {
        question: "What happens if I increase gravity?",
        answer:
          "Both flight time and range shrink. Range scales as 1/g, so doubling gravity roughly halves the distance. Try setting g to 1.6 m/s² (Moon) versus 24.8 m/s² (Jupiter) at the same launch speed and angle to see the contrast.",
      },
      {
        question: "Why is the trajectory a parabola?",
        answer:
          "Horizontal position grows linearly with time (constant v_x), but vertical position grows quadratically (½ g t² downward). Substituting t in terms of x gives y as a quadratic in x — that's the algebraic form of a parabola.",
      },
      {
        question: "How does this connect to AP Physics 1 and NGSS HS-PS2-1?",
        answer:
          "AP Physics 1 expects students to analyze 2D kinematics with independent x and y components, predict range and time of flight, and reason about energy at the peak. NGSS HS-PS2-1 asks students to use Newton's second law to predict motion — projectile motion is the cleanest case of constant net force producing curved motion.",
      },
    ],
  },
};
