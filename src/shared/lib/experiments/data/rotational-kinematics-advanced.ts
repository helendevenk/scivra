import type { Experiment } from "@/shared/types/experiment";

export const rotationalKinematicsAdvanced: Experiment = {
  id: "rotational-kinematics-advanced",
  slug: "rotational-kinematics-advanced",
  title: "Rotational Kinematics (Advanced)",
  subtitle: "Angular velocity, acceleration, and rolling motion with calculus",
  description:
    "Analyze rotational motion with calculus-based kinematics. Explore angular displacement, velocity, and acceleration for uniform and non-uniform rotation. Visualize rolling without slipping, compare tangential and centripetal acceleration, and solve problems involving moment of inertia and torque.",
  thumbnail: "/imgs/experiments/rotational-kinematics-advanced.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: [],
    ap: ["5.A.1", "5.B.1", "5.C.1"],
  },
  primaryStandard: "ap-physics-c",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "rotational kinematics",
    "angular velocity",
    "angular acceleration",
    "moment of inertia",
    "rolling motion",
    "torque",
    "AP Physics C",
    "Mechanics",
  ],
  difficulty: "advanced",

  parameters: [
    {
      id: "shape",
      label: "Object (0=disk, 1=ring, 2=sphere, 3=cylinder)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "radius",
      label: "Radius",
      unit: "m",
      min: 0.1,
      max: 2,
      default: 0.5,
      step: 0.05,
      tier: "free",
    },
    {
      id: "mass",
      label: "Mass",
      unit: "kg",
      min: 0.5,
      max: 20,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "angAccel",
      label: "Angular Acceleration α",
      unit: "rad/s²",
      min: -10,
      max: 10,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "initialOmega",
      label: "Initial Angular Velocity ω₀",
      unit: "rad/s",
      min: 0,
      max: 20,
      default: 0,
      step: 0.5,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\theta(t) = \\theta_0 + \\omega_0 t + \\frac{1}{2}\\alpha t^2",
      description:
        "Angular displacement as a function of time with constant angular acceleration",
    },
    {
      latex: "\\tau = I\\alpha",
      description:
        "Newton's second law for rotation: net torque equals moment of inertia times angular acceleration",
    },
    {
      latex: "v_{\\text{cm}} = R\\omega, \\quad a_{\\text{cm}} = R\\alpha",
      description:
        "Rolling without slipping: the center-of-mass velocity and acceleration relate to angular quantities by the radius",
    },
  ],

  theory:
    "Rotational kinematics parallels translational kinematics: angular displacement θ replaces x, angular velocity ω replaces v, and angular acceleration α replaces a. For constant α: ω(t) = ω₀ + αt and θ(t) = θ₀ + ω₀t + ½αt². The moment of inertia I depends on mass distribution: I = ½MR² (solid disk/cylinder), I = MR² (ring/thin cylinder), I = ⅖MR² (solid sphere). Newton's second law for rotation is τ = Iα. For rolling without slipping, the contact point has zero velocity: v_cm = Rω. The total kinetic energy is K = ½Mv²_cm + ½Iω² = ½(M + I/R²)v²_cm. When rolling down an incline of angle θ, a = gsinθ/(1 + I/(MR²)), meaning objects with larger I/MR² roll more slowly.",

  instructions:
    "Select an object shape and set its mass and radius. Apply an angular acceleration and watch it spin. The canvas shows the rotating object with velocity vectors, while graphs display θ(t), ω(t), and the tangential/centripetal acceleration components. Press Play to start the animation.",

  challenges: [
    {
      id: "rka-c1",
      question:
        "A solid disk (M=2 kg, R=0.5 m) has α=2 rad/s². What torque is applied?",
      hint: "I = ½MR² = ½(2)(0.25) = 0.25 kg·m². τ = Iα = 0.25 × 2 = 0.5 N·m",
      tier: "free",
    },
    {
      id: "rka-c2",
      question:
        "Starting from rest with α=2 rad/s², what is ω after 5 seconds?",
      hint: "ω = ω₀ + αt = 0 + 2(5) = 10 rad/s",
      tier: "free",
    },
    {
      id: "rka-c3",
      question:
        "A solid sphere and a ring of equal mass and radius roll down an incline. Which reaches the bottom first?",
      hint: "The sphere (I=⅖MR²) has a = gsinθ/(1+2/5) = 5gsinθ/7. The ring (I=MR²) has a = gsinθ/2. The sphere is faster.",
      tier: "pro",
    },
  ],

  wave: 12,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["rotational-motion", "torque"],
  htmlPath: "/experiments/ap-physics-c/rotational-kinematics-advanced.html",

  seoTitle: "Rotational Kinematics Simulation | Scivra AP Physics C",
  seoKeywords: [
    "rotational kinematics simulation",
    "angular velocity interactive",
    "moment of inertia calculator",
    "AP Physics C mechanics",
    "rolling motion visualization",
    "torque and angular acceleration",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Advanced Placement",
    teaches: "Rotational Kinematics and Dynamics",
  },
};
