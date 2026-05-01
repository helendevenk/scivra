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
  contentSections: {
    whatIsIt:
      "Rotational kinematics is the calculus-based description of angular motion: angular displacement θ, angular velocity ω = dθ/dt, and angular acceleration α = dω/dt mirror the translational trio (x, v, a) but apply to objects spinning about an axis. The moment of inertia I = ∫r² dm encodes how mass is distributed relative to the axis and determines how a given torque τ = Iα changes the spin. This simulation lets you choose four object geometries — solid disk, ring, solid sphere, and solid cylinder — set their mass and radius, apply a constant angular acceleration, and watch θ(t) and ω(t) graphs build in real time. The rolling-without-slipping constraint v_cm = Rω connects rotational and translational motion, and the simulation makes tangential and centripetal acceleration components visible simultaneously.",
    parameterExplanations: {
      shape:
        "Selects the mass distribution geometry: 0 = solid disk (I = ½MR²), 1 = ring/hoop (I = MR²), 2 = solid sphere (I = ⅖MR²), 3 = solid cylinder (I = ½MR², same as disk). Different shapes with identical M and R will accelerate at different rates under the same torque, because τ = Iα implies α = τ/I.",
      radius:
        "The outer radius R of the object in meters. Increasing R raises I quadratically (I ∝ R²), so for a fixed applied torque the angular acceleration α = τ/I drops. It also changes the linear surface speed v = Rω and the centripetal acceleration a_c = Rω² of points on the rim.",
      mass:
        "Total mass M in kg. Combined with R and shape, it sets I = cMR² where c is the shape-dependent coefficient. A heavier object of the same geometry has a larger I and accelerates more slowly under the same torque, exactly analogous to Newton's second law F = ma in linear motion.",
      angAccel:
        "Constant angular acceleration α in rad/s², applied to the object. Positive values spin up in the chosen initial direction; negative values decelerate or reverse rotation. Analogous to constant linear acceleration, it produces a linearly growing ω(t) = ω₀ + αt and a quadratic θ(t) profile.",
      initialOmega:
        "Initial angular velocity ω₀ in rad/s at t = 0. Starting from rest (0 rad/s) is the default; setting a nonzero ω₀ lets you study deceleration when angAccel is negative, or explore the kinematic equations in the decoupled region where the object starts fast and brakes to a stop.",
    },
    misconceptions: [
      {
        wrong:
          "All round objects roll at the same speed down a ramp because they have the same shape — round.",
        correct:
          "On an incline with enough friction to roll without slipping, acceleration is a = g sinθ / (1 + I/(MR²)). A solid sphere (I/(MR²) = 2/5) always beats a ring (I/(MR²) = 1) because the sphere stores less energy in rotation relative to translation. Shape coefficient c, not just geometry, determines the race outcome.",
      },
      {
        wrong:
          "Moment of inertia is just mass — heavier objects always rotate more slowly.",
        correct:
          "I depends on both mass and how that mass is distributed. A 1 kg ring with R = 1 m has I = 1 kg·m², while a 2 kg disk with R = 0.5 m has I = 0.25 kg·m². The ring has half the mass but four times the moment of inertia, and under the same torque it accelerates far more slowly.",
      },
      {
        wrong:
          "If an object is rolling without slipping, the contact point must be moving backward to grip the surface.",
        correct:
          "The rolling-without-slipping condition requires the contact point to have exactly zero velocity relative to the surface. The point instantaneously at rest is what prevents sliding. For v_cm = Rω, the bottom of the wheel has v_cm − Rω = 0 in the ground frame.",
      },
      {
        wrong:
          "Angular acceleration and angular velocity always point in the same direction.",
        correct:
          "Just as linear deceleration is antiparallel to velocity, angular deceleration gives α opposite to ω. Set initialOmega to a positive value and angAccel to a negative value in the simulation to observe this: ω decreases toward zero while α (and hence net torque τ = Iα) points in the opposite direction.",
      },
      {
        wrong:
          "The kinematic equations θ = ω₀t + ½αt² and ω = ω₀ + αt are always valid.",
        correct:
          "These equations apply only for constant angular acceleration α. If α varies with time — for example, if torque depends on angle or speed — you need calculus: ω = ∫α dt and θ = ∫ω dt. The simulation applies constant α, which is why the kinematic equations hold throughout.",
      },
    ],
    teacherUseCases: [
      "Required-torque comparison: set shape to each of the four options (0–3) with identical mass = 2 kg, radius = 0.5 m, and angAccel = 2 rad/s². Because α is held constant, all shapes reach the same ω(t); students compute the required torque τ = Iα for each geometry — which differs because I differs — and rank the shapes by I. This shows that achieving the same angular acceleration demands more torque for shapes with larger moment of inertia. Directly addresses AP standard 5.B.1.",
      "Torque–acceleration verification: fix shape = 0 (solid disk) and radius = 0.5 m; vary mass across 1, 2, 5, and 10 kg while holding angAccel constant. Have students compute I = ½MR² and the required torque τ = Iα for each mass, then plot τ vs. I and confirm the linear relationship. Addresses standard 5.C.1.",
      "Misconception probe — required torque vs. shape: with `angAccel` fixed (the simulation controls α directly, not τ), ask students which shape would need the LARGEST applied torque to achieve the same α. Most predict the heaviest or the largest in radius. Have them compute τ = Iα for each shape with identical M and R, identify why the shape coefficient (½, 1, ⅖) is the deciding factor, and order the four shapes from least to most torque-demanding.",
      "Kinematic equation audit: set initialOmega = 0, angAccel = 2 rad/s², run for 10 s, then pause the simulation. Have students use θ = ½αt² to predict θ at t = 3, 5, and 8 s and compare to the simulation's θ(t) graph. Discrepancies prompt discussion of constant-α assumptions. Addresses standard 5.A.1.",
      "Centripetal vs. tangential comparison: set radius to 0.5 m and 1.0 m with the same angAccel and mass. Have students compute a_t = Rα and a_c = Rω² at t = 3 s for both radii, observe that centripetal acceleration grows quadratically with ω, and discuss why the total acceleration vector rotates toward the center as ω increases.",
    ],
    faq: [
      {
        question: "What is the moment of inertia for the shapes in this simulation?",
        answer:
          "Solid disk and solid cylinder: I = ½MR². Ring (thin hoop): I = MR². Solid sphere: I = ⅖MR². These come from evaluating I = ∫r² dm over the mass distribution. Objects with more mass concentrated near the rim (ring) have larger I and require more torque to achieve the same α.",
      },
      {
        question: "Which AP Physics C Mechanics standards does this experiment address?",
        answer:
          "The simulation covers standards 5.A.1 (kinematics of rotation: θ, ω, α relationships), 5.B.1 (energy in rotational systems including rolling kinetic energy), and 5.C.1 (torque and Newton's second law for rotation τ = Iα). All three appear on the AP Physics C Mechanics exam FRQ section.",
      },
      {
        question: "Why does a solid sphere always beat a hollow ring rolling down a ramp?",
        answer:
          "Rolling acceleration is a = g sinθ / (1 + I/(MR²)). For the sphere, I/(MR²) = 2/5, giving a = 5g sinθ/7 ≈ 0.714g sinθ. For the ring, I/(MR²) = 1, giving a = g sinθ/2 = 0.5g sinθ. A smaller shape coefficient means less energy stored in rotation and more in translation, so the sphere moves faster down the ramp.",
      },
      {
        question: "What does rolling without slipping actually mean at the contact point?",
        answer:
          "The contact point has zero velocity in the ground frame: v_contact = v_cm − Rω = 0, which gives the constraint v_cm = Rω. Differentiating gives a_cm = Rα. If the object slips (insufficient friction), this constraint breaks, v_cm ≠ Rω, and you need kinetic friction torque in your equations.",
      },
      {
        question: "How do the kinematic equations for rotation compare to the linear versions?",
        answer:
          "They are identical in structure with substitutions θ ↔ x, ω ↔ v, α ↔ a: ω(t) = ω₀ + αt corresponds to v = v₀ + at; θ = ω₀t + ½αt² corresponds to x = v₀t + ½at². Both sets assume constant acceleration; if α varies with time, integration is required.",
      },
      {
        question: "Can I use the parallel axis theorem with these shapes?",
        answer:
          "Yes. If the object rotates about a point other than its center of mass, I = I_cm + Md², where d is the distance between the two parallel axes. For example, a disk rotating about a point on its rim has I = ½MR² + MR² = 3/2 MR². The simulation uses the center-of-mass axis; to explore off-center rotation, apply this correction to your torque calculations.",
      },
    ],
  },
};
