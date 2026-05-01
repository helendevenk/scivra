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
  contentSections: {
    whatIsIt:
      "Angular momentum is a vector quantity — L = Iω — that points along the rotation axis according to the right-hand rule, not merely a scalar speed. A gyroscope, a spinning top, and a figure skater pulling her arms inward are all governed by the same principle: when net external torque is zero, L is conserved in both magnitude and direction. This simulation renders three scenarios in 3D: a precessing gyroscope, a skater changing moment of inertia by extending or retracting arms, and a perfectly inelastic collision between two rotating disks. The blue L vector and red torque vector τ update in real time so you can track how gravitational torque on the tilted gyroscope causes L to sweep out a cone — precession — rather than simply falling over. Use the camera drag to inspect the vector geometry from any angle.",
    parameterExplanations: {
      scenario:
        "Selects which physical situation the simulation displays: 0 for gyroscope precession under gravity, 1 for the ice-skater spin-up problem, and 2 for a two-disk rotational collision. Each scenario loads different initial conditions while sharing the same conservation law.",
      spinRate:
        "The angular velocity ω of the spinning object in rad/s at the start of the simulation. Higher spin rates increase |L| = Iω and, for the gyroscope, slow the precession rate Ω = Mgd/(Iω) — a larger denominator means a lazier cone sweep.",
      tiltAngle:
        "The angle in degrees between the gyroscope's spin axis and the vertical. The gravitational torque that drives precession is τ = Mgd·sinθ; larger tilt angles produce stronger torques and a faster precession rate, visible as the L vector tracing a wider cone.",
      armExtension:
        "Controls how far the skater's arms are extended, expressed as a percentage of maximum reach. Fully extended (100 %) maximizes I; pulling in to 20 % shrinks I dramatically. Because L = Iω is conserved, ω rises in proportion as I falls — watch the spin rate readout jump.",
      showVectors:
        "Toggles the 3D arrow overlays: 1 renders the blue L vector and the red τ vector; 0 hides them for a cleaner view of the motion geometry. Turn vectors on when analyzing the right-hand-rule direction; turn them off when recording angular speed data.",
    },
    misconceptions: [
      {
        wrong:
          "Angular momentum is just how fast something spins — it's a scalar like rotational speed.",
        correct:
          "L = r × p (or Iω for rigid bodies) is a vector. Its direction — along the spin axis, determined by the right-hand rule — is physically meaningful: gravitational torque causes L to change direction, producing precession, not a change in spin speed.",
      },
      {
        wrong:
          "When the skater pulls her arms in, she speeds up because a force is pushing her outward.",
        correct:
          "No external torque acts, so L = Iω stays constant. Reducing the moment of inertia I forces ω to increase to keep the product fixed. Internal muscle forces do positive work on the system, converting stored chemical energy to rotational kinetic energy.",
      },
      {
        wrong:
          "A tilted gyroscope falls over because gravity pulls the top down.",
        correct:
          "Gravity exerts a torque τ perpendicular to L, so it changes the direction of L, not its magnitude. The result is precession — the axis sweeps a horizontal circle — at rate Ω = Mgd/(Iω). The gyroscope does not topple as long as it spins fast enough.",
      },
      {
        wrong:
          "Torque must point in the same direction as the rotation or the angular velocity.",
        correct:
          "Torque τ = r × F points along the axis of angular acceleration, perpendicular to both r and F. In the gyroscope, τ is horizontal and perpendicular to L, so it rotates L rather than speeding or slowing the spin.",
      },
      {
        wrong:
          "In a rotational collision, kinetic energy is always conserved because no linear momentum is lost.",
        correct:
          "For a perfectly inelastic rotational collision (two disks coupling), angular momentum L_total = I₁ω₁ + I₂ω₂ is conserved, but rotational kinetic energy is not — energy is lost to internal deformation, sound, and heat, just as in a linear inelastic collision.",
      },
    ],
    teacherUseCases: [
      "Precession rate vs. spin rate data collection: set scenario = 0, record the observed precession period T_prec for spinRate values of 10, 20, 30, and 40 rad/s at a fixed tiltAngle of 30°. Have students plot T_prec vs. 1/ω and verify the linear relationship predicted by Ω = Mgd/(Iω). This directly addresses AP standard 5.E.1.",
      "Skater conservation lab: set scenario = 1, record ω at armExtension = 100 %, 80 %, 60 %, 40 %, and 20 %. Have students compute I·ω at each step using I ∝ armExtension² (moment of inertia scales as r²) and verify that L = Iω remains constant to within experimental noise. Addresses standard 5.D.1.",
      "Misconception probe — does the gyroscope fall?: pause the simulation at tiltAngle = 45° with showVectors = 1. Ask students to predict, before pressing Play, which direction the top will move. Most predict it topples; the precession result challenges that intuition and opens a vector-torque discussion.",
      "Collision energy audit: set scenario = 2, record the initial and final angular speeds, compute K_i = ½I₁ω₁² and K_f = ½(I₁+I₂)ω_f². Students calculate the energy lost as a percentage of K_i and discuss where it goes, paralleling the linear-collision energy analysis they did in AP Physics 1.",
      "Right-hand-rule drill: with showVectors = 1 in the gyroscope scenario, challenge students to predict the instantaneous direction of τ = r × F_gravity for four compass positions of the precessing axis (North, East, South, West). They confirm each prediction by reading the red vector in the 3D view.",
    ],
    faq: [
      {
        question: "Why does a gyroscope precess instead of just tipping over?",
        answer:
          "The gravitational torque τ = Mgd·sinθ acts perpendicular to the angular momentum vector L, not parallel to it. Since dL/dt = τ, this perpendicular torque rotates L rather than changing its magnitude — the axis circles the vertical at precession rate Ω = Mgd/(Iω) rad/s. Tipping over would require a torque parallel to L.",
      },
      {
        question: "What AP Physics C standard covers angular momentum conservation?",
        answer:
          "AP standard 5.D.1 addresses conservation of angular momentum when net external torque is zero. Standard 5.E.1 covers the relationship τ = dL/dt and gyroscopic precession. Both are tested in the Mechanics FRQ section and appear directly in this simulation's three scenarios.",
      },
      {
        question: "How does the ice-skater problem connect to the formula L = Iω?",
        answer:
          "With no external torque (frictionless ice), L is conserved: I_i · ω_i = I_f · ω_f. When arm extension drops from 100 % to 20 %, the moment of inertia roughly decreases by a factor of 25 (I ∝ r²), so ω must increase by roughly 25× to maintain the same L. The simulation makes this quantitative — read ω off the display at each armExtension setting.",
      },
      {
        question: "Is angular momentum a vector or a scalar?",
        answer:
          "It is a vector: L = r × p for a particle, or L = Iω for a rigid body spinning about a fixed axis, where ω is itself a vector along the axis. The direction matters — the right-hand rule determines it. Precession is entirely a consequence of L being a vector whose direction can change under perpendicular torque.",
      },
      {
        question: "What happens to rotational kinetic energy when the skater pulls her arms in?",
        answer:
          "K_rot = L²/(2I). Since L is constant and I decreases, K_rot increases. The extra energy comes from the work done by the skater's muscles as they pull inward against the centrifugal tendency of the arms — the skater is doing positive work, not violating energy conservation.",
      },
      {
        question: "Can precession occur even if the gyroscope is not tilted (tiltAngle = 0°)?",
        answer:
          "At exactly 0° the spin axis is vertical and aligned with gravity, so the gravitational torque τ = Mgd·sin(0°) = 0. There is no torque to drive precession and the gyroscope simply spins in place. Increasing tiltAngle away from 0° introduces a nonzero torque and initiates the precessing cone.",
      },
    ],
  },
};
