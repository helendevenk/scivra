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
      id: "mass",
      label: "Mass M",
      unit: "kg",
      min: 0.5,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "radius",
      label: "Radius R",
      unit: "m",
      min: 0.2,
      max: 1.2,
      default: 0.5,
      step: 0.05,
      tier: "free",
    },
    {
      id: "angle",
      label: "Incline Angle θ",
      unit: "°",
      min: 5,
      max: 60,
      default: 30,
      step: 1,
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
    "Use the three sliders to set Mass M, Radius R, and Incline Angle θ. Start with one of the three presets — Solid Sphere, Hollow Cylinder, or Rod About End — then press Play to watch how moment of inertia changes acceleration, rolling speed, angular velocity, and the energy split.",

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
  htmlControlAliases: { mass: "sl-mass", radius: "sl-radius", angle: "sl-theta" },
  presets: [
    {
      id: "loadPreset:sphere",
      label: "Solid Sphere (2/5MR²)",
      description:
        "A solid sphere has relatively low moment of inertia for its mass and radius, so more gravitational potential energy becomes translational kinetic energy as it rolls.",
    },
    {
      id: "loadPreset:hollowcyl",
      label: "Hollow Cylinder (MR²)",
      description:
        "A hollow cylinder concentrates mass near the rim, giving it the largest I/(MR²) value among the rolling presets and the slowest descent.",
    },
    {
      id: "loadPreset:rod",
      label: "Rod About End (1/3ML²)",
      description:
        "A rod about one end highlights the parallel axis theorem and compares pivot-style rotational inertia with rolling bodies on the same incline view.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Rotational kinematics is the calculus-based description of angular motion: angular displacement θ, angular velocity ω = dθ/dt, and angular acceleration α = dω/dt mirror the translational trio (x, v, a) but apply to objects spinning about an axis. The moment of inertia I = ∫r² dm encodes how mass is distributed relative to the axis and determines how a given torque τ = Iα changes the spin. This simulation lets you choose four object geometries — solid disk, ring, solid sphere, and solid cylinder — set their mass and radius, apply a constant angular acceleration, and watch θ(t) and ω(t) graphs build in real time. The rolling-without-slipping constraint v_cm = Rω connects rotational and translational motion, and the simulation makes tangential and centripetal acceleration components visible simultaneously.",
    parameterExplanations: {
      mass:
        "Mass M sets how much material is in the rolling object. For a selected preset, moment of inertia scales directly with mass: I = cMR² for the sphere or cylinder-style bodies, while the rod uses its own length-based expression. Changing Mass also changes gravitational potential energy, translational kinetic energy, and rotational kinetic energy together, so the readouts help students separate absolute energy size from acceleration behavior. With the same Radius, Angle, and preset, increasing mass raises I and energy values proportionally, but the ideal rolling acceleration depends on the shape coefficient rather than mass alone.",
      radius:
        "Radius R changes both the size of the rolling body and the rotational inertia term. For sphere and cylinder presets, I scales with R², so a larger radius greatly increases resistance to angular acceleration. Radius also links translation and rotation through v_cm = Rω: at the same center-of-mass speed, a larger radius means a smaller angular velocity. Use Radius while keeping Mass and Angle fixed to compare how the object geometry, rolling constraint, and energy bars respond. The effect is clearest when you switch between Solid Sphere and Hollow Cylinder after choosing the same Radius value.",
      angle:
        "Incline Angle θ controls the component of gravity pulling the object down the ramp. A small angle gives a gentle acceleration and slower growth in v_cm and ω; a steep angle increases g sinθ, so the object speeds up more quickly. Because the model combines translational and rotational equations, the same angle can produce different descents for different presets: the hollow cylinder stores more energy in rotation, while the solid sphere translates more readily. Change only Angle after choosing a preset to isolate the role of gravity's ramp-parallel component from mass distribution.",
    },
    misconceptions: [
      {
        wrong:
          "All round objects roll at the same speed down a ramp because they are all round.",
        correct:
          "On an incline with enough friction to roll without slipping, acceleration is a = g sinθ / (1 + I/(MR²)). A solid sphere (I/(MR²) = 2/5) beats a hollow cylinder (I/(MR²) = 1) because the sphere stores less energy in rotation relative to translation. The moment-of-inertia coefficient, not roundness alone, determines the race outcome.",
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
          "A steeper ramp only changes the final speed, not the acceleration during the roll.",
        correct:
          "The Incline Angle slider changes the ramp-parallel gravity component, g sinθ. A larger θ increases the center-of-mass acceleration and angular acceleration throughout the descent. Presets still matter because I/(MR²) changes how much of that gravitational energy goes into rotation instead of translation.",
      },
      {
        wrong:
          "The kinematic equations θ = ω₀t + ½αt² and ω = ω₀ + αt are always valid.",
        correct:
          "These equations apply only for constant angular acceleration α. In this rolling model, α is determined by the selected preset, radius, and incline angle while the object remains in the ideal rolling regime. If torque or constraints varied with time, you would need calculus: ω = ∫α dt and θ = ∫ω dt.",
      },
    ],
    teacherUseCases: [
      "Preset race comparison: keep Mass = 1.0 kg, Radius = 0.50 m, and Incline Angle = 30°. Run Solid Sphere, Hollow Cylinder, and Rod About End, then have students rank the resulting motion by acceleration and explain the ranking using I and I/(MR²). Addresses AP standard 5.B.1.",
      "Angle isolation lab: choose Solid Sphere, keep Mass and Radius fixed, and compare Incline Angle values of 10°, 30°, and 50°. Students calculate how g sinθ changes and connect the slider evidence to faster growth in v_cm and ω. Addresses standard 5.A.1.",
      "Mass misconception probe: choose Hollow Cylinder, hold Radius and Incline Angle constant, and vary Mass from low to high. Students record I and energy values, then explain why ideal rolling acceleration is not determined by mass alone even though total energy and moment of inertia increase.",
      "Radius and angular velocity audit: choose Solid Sphere and compare Radius = 0.30 m, 0.70 m, and 1.10 m at the same Mass and Incline Angle. Students use v_cm = Rω to explain why angular velocity readouts change when the rolling constraint is maintained.",
      "Parallel axis theorem discussion: switch to Rod About End and compare its I readout with the rolling presets. Students connect the displayed rod behavior to I = I_cm + Md² and identify why changing the axis changes rotational resistance. Addresses standard 5.C.1.",
    ],
    faq: [
      {
        question: "What is the moment of inertia for the shapes in this simulation?",
        answer:
          "The preset buttons focus on a solid sphere, a hollow cylinder, and a rod about one end. The solid sphere uses I = ⅖MR², the hollow cylinder uses I = MR², and the rod-about-end case uses I = ⅓ML² for the modeled rod length. These formulas all come from I = ∫r² dm, so mass farther from the rotation axis contributes more strongly.",
      },
      {
        question: "Which AP Physics C Mechanics standards does this experiment address?",
        answer:
          "The simulation covers standards 5.A.1 (kinematics of rotation: θ, ω, α relationships), 5.B.1 (energy in rotational systems including rolling kinetic energy), and 5.C.1 (torque and Newton's second law for rotation τ = Iα). All three appear on the AP Physics C Mechanics exam FRQ section.",
      },
      {
        question: "Why does a solid sphere always beat a hollow ring rolling down a ramp?",
        answer:
          "Rolling acceleration is a = g sinθ / (1 + I/(MR²)). For the sphere, I/(MR²) = 2/5, giving a = 5g sinθ/7 ≈ 0.714g sinθ. For the hollow cylinder, I/(MR²) = 1, giving a = g sinθ/2 = 0.5g sinθ. A smaller shape coefficient means less energy stored in rotation and more in translation, so the sphere moves faster down the ramp.",
      },
      {
        question: "What does rolling without slipping actually mean at the contact point?",
        answer:
          "The contact point has zero velocity in the ground frame: v_contact = v_cm − Rω = 0, which gives the constraint v_cm = Rω. Differentiating gives a_cm = Rα. If the object slips (insufficient friction), this constraint breaks, v_cm ≠ Rω, and you need kinetic friction torque in your equations.",
      },
      {
        question: "How do the kinematic equations for rotation compare to the linear versions?",
        answer:
          "They are identical in structure with substitutions θ ↔ x, ω ↔ v, α ↔ a: ω(t) = ω₀ + αt corresponds to v = v₀ + at; θ = ω₀t + ½αt² corresponds to x = v₀t + ½at². In this simulation, α is produced by the selected preset, Radius, and Incline Angle rather than by a separate angular-acceleration control. Both equation sets assume constant acceleration; if α varies with time, integration is required.",
      },
      {
        question: "Can I use the parallel axis theorem with these shapes?",
        answer:
          "Yes. If an object rotates about a point other than its center of mass, I = I_cm + Md², where d is the distance between the two parallel axes. The Rod About End preset is the clearest example: a rod with I_cm = 1/12 ML² becomes I_end = 1/3 ML² when shifted to an end pivot. Use that preset to connect the theorem to a visible change in rotational resistance.",
      },
    ],
  },
};
