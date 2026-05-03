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
    ap: ["6.3.A", "6.3.B", "6.4.A"],
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
      id: "angularVelocity",
      label: "Angular Velocity",
      unit: "rad/s",
      min: 1,
      max: 40,
      default: 10,
      step: 0.5,
      tier: "free",
    },
    {
      id: "armExtension",
      label: "Arm Extension",
      unit: "m",
      min: 0.3,
      max: 2,
      default: 1.0,
      step: 0.1,
      tier: "free",
    },
    {
      id: "torque",
      label: "Applied Torque",
      unit: "N·m",
      min: 0,
      max: 2,
      default: 0,
      step: 0.1,
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
    "Use the Angular Velocity, Arm Extension, and Applied Torque sliders to test L = Iω conservation and torque-driven changes in angular momentum. Try the Spinning Top, Gyroscope, and Figure Skater presets to compare fast precession, gyroscopic stability, and the skater arms-in/arms-out conservation demo. Increase angular velocity to build a larger L vector, change arm extension to change moment of inertia, and add torque to see precession emerge as τ changes the direction of L.",

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
  htmlControlAliases: {
    angularVelocity: "sl-omega",
    armExtension: "sl-arm",
    torque: "sl-torque",
  },
  presets: [
    {
      id: "top",
      label: "Spinning Top",
      paramValues: { angularVelocity: 20, armExtension: 0.5, torque: 0 },
    },
    {
      id: "gyro",
      label: "Gyroscope",
      paramValues: { angularVelocity: 30, armExtension: 0.8, torque: 0.5 },
    },
    {
      id: "skater",
      label: "Figure Skater",
      paramValues: { angularVelocity: 15, armExtension: 1.5, torque: 0 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Angular momentum is a vector quantity — L = Iω — that points along the rotation axis according to the right-hand rule, not merely a scalar speed. A gyroscope, a spinning top, and a figure skater pulling her arms inward are all governed by the same principle: when net external torque is zero, L is conserved in both magnitude and direction. This simulation renders three scenarios in 3D: a precessing gyroscope, a skater changing moment of inertia by extending or retracting arms, and a perfectly inelastic collision between two rotating disks. The blue L vector and red torque vector τ update in real time so you can track how gravitational torque on the tilted gyroscope causes L to sweep out a cone — precession — rather than simply falling over. Use the camera drag to inspect the vector geometry from any angle.",
    parameterExplanations: {
      angularVelocity:
        "Angular Velocity sets the rotational speed ω of the spinning object in radians per second. In AP Physics 1 and HS-PS2 rotational dynamics, this slider is the direct link between motion and angular momentum because L = Iω. With moment of inertia held fixed, increasing angular velocity increases the magnitude of L, making the spin axis harder to redirect. In a gyroscope or spinning top, a larger L also makes the same applied torque produce slower directional change, so precession becomes more gradual. Compare the Spinning Top and Gyroscope presets, then change only Angular Velocity to isolate how spin rate affects stability and precession.",
      armExtension:
        "Arm Extension changes the effective radius of the rotating mass distribution, which changes moment of inertia I. Mass farther from the rotation axis contributes more strongly because I depends on r², so increasing this slider makes the object harder to spin up or slow down. The Figure Skater preset is the clearest conservation test: with little or no external torque, pulling arms inward reduces I, so angular velocity must increase to keep L = Iω approximately constant. This aligns with AP Physics 1 rotational inertia reasoning and HS-PS2 modeling because students connect a visible geometry change to a measurable change in motion.",
      torque:
        "Applied Torque sets the external twisting influence τ in newton-meters. Torque is not the same thing as angular momentum; it is the rate of change of angular momentum, τ = dL/dt. In this model, raising torque makes the L vector change direction more strongly, supporting the precession story for tops and gyroscopes. When torque is zero, angular momentum conservation is the focus: the Figure Skater preset shows how changing moment of inertia redistributes spin without needing an outside twist. When torque is nonzero, students can reason from HS-PS2-2 about how forces and interactions change motion over time.",
    },
    misconceptions: [
      {
        wrong:
          "Angular momentum is just how fast something spins, so Angular Velocity and angular momentum mean the same thing.",
        correct:
          "Angular Velocity is only one factor. Angular momentum is L = Iω, so it depends on both rotational speed and moment of inertia. A slowly spinning object with mass spread far from the axis can have as much angular momentum as a faster compact object. Use Arm Extension to change I while watching why the product matters.",
      },
      {
        wrong:
          "When the Figure Skater preset speeds up, an outside force must be pushing the skater around.",
        correct:
          "With Applied Torque near zero, there is no outside twist causing the speed-up. Pulling arms inward reduces moment of inertia, so angular velocity increases to keep L = Iω conserved. Internal muscle forces can change the skater's shape and rotational kinetic energy, but they do not create net external angular momentum.",
      },
      {
        wrong:
          "A larger Applied Torque always makes the object spin faster.",
        correct:
          "Torque changes angular momentum, but the direction matters. A torque parallel to L can change spin speed; a torque perpendicular to L mainly redirects L and produces precession. In a gyroscope or top, torque can make the axis sweep around instead of simply increasing Angular Velocity.",
      },
      {
        wrong:
          "A gyroscope is stable because gravity stops acting on it.",
        correct:
          "Gravity still acts and can create torque about the support point. The key is that the spinning object already has angular momentum. The torque changes the direction of L over time, so the axis precesses rather than immediately tipping straight down.",
      },
      {
        wrong:
          "The Spinning Top, Gyroscope, and Figure Skater presets are different laws of physics.",
        correct:
          "They are different examples of the same rotational dynamics ideas. The presets change Angular Velocity, Arm Extension, and Applied Torque to highlight different balances between L = Iω conservation and τ = dL/dt. The useful comparison is which parameter changed and how the angular momentum response followed.",
      },
    ],
    teacherUseCases: [
      "HS-PS2-2 precession investigation: start with the Gyroscope preset, record Angular Velocity, Arm Extension, and Applied Torque, then vary Applied Torque from 0 to 2 N·m while students describe how the interaction changes the direction of motion over time.",
      "AP 5.D.1 conservation lab: use the Figure Skater preset with Applied Torque at 0 N·m. Have students move Arm Extension from 1.5 m toward 0.3 m and explain why Angular Velocity rises when moment of inertia decreases.",
      "AP 5.E.1 torque discussion: compare the Spinning Top preset and Gyroscope preset, then hold Angular Velocity fixed while changing Applied Torque. Students use τ = dL/dt to connect a larger torque to faster angular momentum direction change.",
      "One-variable control practice: assign teams one preset each, then allow them to adjust only Angular Velocity, only Arm Extension, or only Applied Torque. Each team writes a claim about which variable changed L's magnitude, which changed I, and which produced precession.",
      "Misconception probe: before using the Figure Skater preset, ask students whether pulling arms inward should slow the skater because the body becomes smaller. They then test Arm Extension values and use L = Iω to revise the prediction.",
    ],
    faq: [
      {
        question: "Why does a gyroscope precess instead of just tipping over?",
        answer:
          "The applied or gravitational torque acts mostly perpendicular to the angular momentum vector L. Since τ = dL/dt, that perpendicular torque redirects L rather than simply making the object fall straight down. In the Gyroscope preset, increase Applied Torque to see the direction of L change more quickly. Increase Angular Velocity to make L larger, which makes the same torque produce slower precession.",
      },
      {
        question: "What AP Physics C standard covers angular momentum conservation?",
        answer:
          "AP standard 5.D.1 addresses conservation of angular momentum when net external torque is zero. Standard 5.E.1 covers the relationship τ = dL/dt and gyroscopic precession. The Angular Velocity, Arm Extension, and Applied Torque sliders let students separate conservation cases from cases where torque changes angular momentum.",
      },
      {
        question: "How does the Figure Skater preset connect to the formula L = Iω?",
        answer:
          "The Figure Skater preset demonstrates angular momentum conservation with Applied Torque set to zero. When Arm Extension decreases, the skater's mass is closer to the rotation axis, so moment of inertia I decreases. To keep L = Iω constant, Angular Velocity must increase. Moving Arm Extension outward reverses the effect: I increases and angular velocity drops.",
      },
      {
        question: "Is angular momentum a vector or a scalar?",
        answer:
          "It is a vector: L = r × p for a particle, or L = Iω for a rigid body spinning about a fixed axis, where ω is itself a vector along the axis. The direction matters because torque can change that direction. Precession is a visible result of vector angular momentum responding to torque.",
      },
      {
        question: "What does the Applied Torque slider actually change?",
        answer:
          "Applied Torque changes the external twist on the rotating system, measured in N·m. A zero value emphasizes conservation of angular momentum. A larger value makes angular momentum change more quickly according to τ = dL/dt. In the Gyroscope and Spinning Top presets, that change often appears as precession, where the spin axis sweeps around instead of simply speeding up.",
      },
      {
        question: "Which preset should I start with?",
        answer:
          "Start with Figure Skater for L = Iω conservation because changing Arm Extension gives a clear inverse relationship between moment of inertia and Angular Velocity. Use Gyroscope next to study how Applied Torque redirects angular momentum and produces precession. Use Spinning Top to connect the same ideas to a familiar rotating object.",
      },
    ],
  },
};
