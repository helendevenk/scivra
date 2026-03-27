import type { Experiment } from "@/shared/types/experiment";

export const angularMomentum3d: Experiment = {
  id: "angular-momentum-3d",
  slug: "angular-momentum-3d",
  title: "Angular Momentum (3D)",
  subtitle: "Conservation of angular momentum, precession, and gyroscopic effects",
  description:
    "Visualize angular momentum as a 3D vector and explore its conservation. Watch a spinning gyroscope precess under gravity, observe how an ice skater's spin speeds up when pulling in arms (changing moment of inertia), and analyze collisions between rotating objects. Torque vectors and angular momentum vectors are shown in real time.",
  thumbnail: "/imgs/experiments/angular-momentum-3d.png",

  standards: {
    ngss: ["HS-PS2-2"],
    gcse: [],
    ap: ["5.D.1", "5.E.1"],
  },
  primaryStandard: "ap-physics-c",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "angular momentum",
    "conservation",
    "precession",
    "gyroscope",
    "torque",
    "moment of inertia",
    "AP Physics C",
    "Mechanics",
  ],
  difficulty: "advanced",

  parameters: [
    {
      id: "scenario",
      label: "Scenario (0=gyroscope, 1=skater, 2=collision)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "spinRate",
      label: "Spin Rate",
      unit: "rad/s",
      min: 1,
      max: 50,
      default: 20,
      step: 1,
      tier: "free",
    },
    {
      id: "tiltAngle",
      label: "Initial Tilt Angle",
      unit: "°",
      min: 0,
      max: 80,
      default: 30,
      step: 5,
      tier: "free",
    },
    {
      id: "armExtension",
      label: "Arm Extension (skater)",
      unit: "%",
      min: 20,
      max: 100,
      default: 100,
      step: 5,
      tier: "free",
    },
    {
      id: "showVectors",
      label: "Show L and τ vectors (0=off, 1=on)",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\vec{L} = I\\vec{\\omega}",
      description:
        "Angular momentum vector: moment of inertia times angular velocity vector",
    },
    {
      latex: "\\vec{\\tau} = \\frac{d\\vec{L}}{dt}",
      description:
        "Net torque equals the time rate of change of angular momentum",
    },
    {
      latex: "\\Omega_{\\text{prec}} = \\frac{Mgd}{I\\omega}",
      description:
        "Precession rate of a gyroscope: depends on weight, distance from pivot, spin angular momentum",
    },
  ],

  theory:
    "Angular momentum L = Iω is a vector quantity pointing along the axis of rotation (right-hand rule). In the absence of external torque, angular momentum is conserved: L_i = L_f. For a spinning ice skater, pulling arms in decreases I, so ω must increase to conserve L. A gyroscope tilted at angle θ from vertical experiences gravitational torque τ = Mgd·sinθ perpendicular to L, causing L to precess around the vertical axis at rate Ω = Mgd/(Iω). The faster the spin, the slower the precession. In collisions between rotating objects (e.g., two disks), the total angular momentum is conserved: I₁ω₁ + I₂ω₂ = (I₁ + I₂)ω_f for a perfectly inelastic collision.",

  instructions:
    "Select a scenario: gyroscope precession, ice skater spin-up, or rotational collision. Adjust the spin rate and tilt angle. In the gyroscope scenario, observe how the L vector sweeps out a cone (precession). In the skater scenario, drag the arm extension slider to see ω change. The 3D view shows L (blue arrow) and τ (red arrow) vectors in real time. Rotate the camera with mouse drag.",

  challenges: [
    {
      id: "am-c1",
      question:
        "A gyroscope has I=0.01 kg·m², ω=20 rad/s, M=0.5 kg, d=0.1 m. What is the precession rate?",
      hint: "Ω = Mgd/(Iω) = (0.5)(9.8)(0.1)/((0.01)(20)) = 2.45 rad/s",
      tier: "free",
    },
    {
      id: "am-c2",
      question:
        "A skater with I=5 kg·m² at 2 rad/s pulls arms in to I=2 kg·m². What is the new ω?",
      hint: "L = Iω conserved: 5×2 = 2×ω_f → ω_f = 5 rad/s",
      tier: "free",
    },
    {
      id: "am-c3",
      question:
        "Disk A (I=0.5, ω=10) collides with stationary Disk B (I=0.5). What is ω_f for the combined system?",
      hint: "L_total = 0.5×10 + 0 = 5. I_total = 1.0. ω_f = 5/1.0 = 5 rad/s",
      tier: "pro",
    },
  ],

  wave: 12,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["rotational-motion", "rotational-kinematics-advanced"],
  htmlPath: "/experiments/ap-physics-c/angular-momentum-3d.html",

  seoTitle: "Angular Momentum 3D Simulation | Scivra AP Physics C",
  seoKeywords: [
    "angular momentum simulation",
    "gyroscope precession 3D",
    "conservation of angular momentum",
    "AP Physics C mechanics",
    "ice skater spin interactive",
    "rotational collision visualization",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Advanced Placement",
    teaches: "Angular Momentum and Precession",
  },
};
