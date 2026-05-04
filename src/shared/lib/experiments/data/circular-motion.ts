import type { Experiment } from "@/shared/types/experiment";

export const circularMotion: Experiment = {
  id: "circular-motion",
  slug: "circular-motion",
  title: "Circular Motion & Centripetal Force",
  subtitle: "Why objects curve instead of fly off",
  description:
    "Spin a ball on a string, watch satellites orbit, and feel the centripetal force requirement. Adjust speed and radius to see how the 'center-seeking' force changes — and what happens when it disappears.",
  thumbnail: "/imgs/experiments/circular-motion.png",

  standards: {
    ngss: ["HS-PS2-1", "HS-PS2-4"],
    gcse: ["P5.5"],
    ap: ["3.B.1", "3.B.2", "4.A.2"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["centripetal force", "circular motion", "uniform circular motion", "period", "AP Physics 1"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "mass",
      label: "Mass (m)",
      unit: "kg",
      min: 0.1,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "speed",
      label: "Speed",
      unit: "m/s",
      min: 0.5,
      max: 12,
      default: 4.0,
      step: 0.1,
      tier: "free",
    },
    {
      id: "radius",
      label: "Radius (r)",
      unit: "m",
      min: 0.5,
      max: 6,
      default: 2,
      step: 0.1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "a_c = \\frac{v^2}{r}",
      description: "Centripetal acceleration",
    },
    {
      latex: "F_c = \\frac{mv^2}{r} = m\\omega^2 r",
      description: "Centripetal force (directed inward)",
    },
    {
      latex: "T = \\frac{2\\pi r}{v}",
      description: "Period of circular motion",
    },
    {
      latex: "\\omega = \\frac{v}{r} = \\frac{2\\pi}{T}",
      description: "Angular velocity",
    },
  ],

  theory:
    "Uniform circular motion requires a net inward (centripetal) force to continuously change the direction of velocity. This force is NOT a new type of force — it is provided by tension, gravity, normal force, or friction depending on the situation. The centripetal acceleration always points toward the center, while velocity is always tangential. Remove the centripetal force and the object moves in a straight line (Newton's 1st Law).",

  instructions:
    "Use the 3 sliders + 3 presets to change the circular motion model. Watch the live readouts for period, angular velocity, centripetal acceleration, centripetal force, angle, and energy. Try the Conical Pendulum, Banked Curve, and Vertical Circle presets, then change one slider at a time to compare how the same centripetal-force relationship appears in each scenario.",

  hook: {
    question: "Does a ball on a string get pulled outward when you spin it? Hint: there is no centrifugal force!",
    context: "What you feel as 'centrifugal force' is actually your hand providing the inward pull — remove it, and the ball flies straight, not outward.",
    actionPrompt: "Start the experiment →",
  },

  learningCards: [
    {
      id: "cm-lc1",
      title: "Centripetal vs. Centrifugal",
      content: "Centripetal means 'center-seeking.' The ball on a string is always being pulled inward by tension. 'Centrifugal force' is a fictitious force that only appears in a rotating reference frame — in an inertial frame, there is no outward force.",
      relatedParameterId: "speed",
    },
    {
      id: "cm-lc2",
      title: "The v²/r Relationship",
      content: "Centripetal acceleration equals v²/r. This means doubling the speed requires four times the inward force to maintain the same circular path. The acceleration always points toward the center, perpendicular to velocity.",
      formula: { latex: "a_c = \\frac{v^2}{r}", description: "Centripetal acceleration depends on speed squared and radius" },
      relatedParameterId: "radius",
    },
    {
      id: "cm-lc3",
      title: "Force = Mass × Centripetal Acceleration",
      content: "The net inward force equals mv²/r. This is not a new type of force — it is provided by tension, gravity, friction, or normal force depending on the situation. Identifying what provides the centripetal force is the key skill in circular motion problems.",
      formula: { latex: "F_c = \\frac{mv^2}{r}", description: "Centripetal force from Newton's second law" },
      relatedParameterId: "mass",
    },
    {
      id: "cm-lc4",
      title: "Same Equation, Different Situations",
      content: "Conical pendulums, banked curves, and vertical circles all require a net inward force, but the real force doing the job changes. The presets help you compare tension, normal force, gravity components, and apparent weight while the core relationship F_c = mv²/r stays visible.",
      relatedParameterId: "speed",
    },
  ],

  easterEggs: [
    {
      parameterId: "speed",
      condition: "max",
      effect: "string-snap-animation",
      message: "At this speed, the string would snap! A 1 kg ball at 10 m/s in a 0.5 m circle needs 200 N of tension — that's like hanging a 20 kg weight from the string.",
    },
    {
      parameterId: "radius",
      condition: "min",
      effect: "tight-orbit-glow",
      message: "Tiny orbit, huge force! As radius shrinks, centripetal acceleration skyrockets. Figure skaters spin faster by pulling their arms in — same physics.",
    },
  ],

  challenges: [
    {
      id: "cm-c1",
      question: "A 2 kg ball moves at 6 m/s in a circle of radius 3 m. What centripetal force is required?",
      options: ["12 N", "24 N", "36 N", "72 N"],
      correctAnswer: "24 N",
      hint: "F = mv²/r",
      relatedParameterId: "mass",
      tier: "free",
    },
    {
      id: "cm-c2",
      question: "If you double the speed while keeping radius fixed, how does the centripetal force change?",
      options: ["It doubles", "It triples", "It quadruples", "It stays the same"],
      correctAnswer: "It quadruples",
      hint: "F ∝ v² — doubling speed quadruples force",
      relatedParameterId: "speed",
      tier: "free",
    },
    {
      id: "cm-c3",
      question: "A car rounds a flat curve of radius 50 m at 20 m/s. What friction force is needed? (m = 1200 kg)",
      options: ["4,800 N", "9,600 N", "12,000 N", "24,000 N"],
      correctAnswer: "9,600 N",
      hint: "Friction provides centripetal force: f = mv²/r",
      relatedParameterId: "radius",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["newtons-laws", "gravitational-fields"],

  seoTitle: "Circular Motion & Centripetal Force — Interactive 3D | Scivra",
  seoKeywords: [
    "circular motion simulation",
    "centripetal force",
    "uniform circular motion",
    "AP Physics 1 circular motion",
    "centripetal acceleration",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Circular Motion and Centripetal Force",
  },
  htmlControlAliases: { mass: "sl-mass", speed: "sl-speed", radius: "sl-radius" },
  presets: [
    {
      id: "conical",
      label: "Conical Pendulum",
      description:
        "A mass swings in a horizontal circle while a string supplies the inward force. Use it to connect tension components, cone angle, and F_c = mv²/r.",
    },
    {
      id: "banked",
      label: "Banked Curve",
      description:
        "A car follows a tilted circular track where the normal force has an inward component. This preset highlights why a design speed can reduce the need for friction.",
    },
    {
      id: "vertical",
      label: "Vertical Circle",
      description:
        "A roller-coaster-style loop shows how speed, radius, gravity, and apparent weight interact. Compare top and bottom positions to see why minimum speed matters.",
    },
  ],

  contentSections: {
    whatIsIt:
      "A car turns onto a highway off-ramp, a yo-yo whirls on a string, the Moon swings around the Earth — every one of these is an object that wants to fly straight but is being yanked sideways into a curve. Newton's first law says without a net force an object travels in a straight line, so anything moving in a circle must have a force constantly pulling it toward the center. We call that the centripetal force. It is not a new kind of force; it's a job some other force (tension, gravity, friction, normal force) has to do. In this lab you set the mass, speed, and radius, then compare conical pendulum, banked-curve, and vertical-circle presets to see how different real forces create the same inward acceleration pattern.",
    parameterExplanations: {
      mass:
        "Mass changes how much force is needed for the same circular motion. The centripetal acceleration a_c = v²/r depends only on the motion and radius, so changing mass does not change the inward acceleration shown by the model. It does change the net force requirement because F_c = ma_c = mv²/r. A heavier car on the same banked curve, or a heavier bob in the same conical pendulum, needs proportionally more real inward force from normal force, tension, friction, or gravity components. Compare the presets at fixed Radius, then move only Mass to separate force from acceleration.",
      speed:
        "Speed sets how fast the object moves along the circular path. It is the most sensitive control because centripetal acceleration depends on v²/r, so doubling Speed requires four times the inward acceleration and four times the inward force at the same Mass and Radius. Increasing Speed also shortens the period, meaning each revolution takes less time even if the path size is unchanged. Use this slider with Radius fixed to see why cars, satellites, and swinging masses need much stronger inward forces at higher speeds. Then compare presets to identify which real force must supply that extra center-directed pull.",
      radius:
        "Radius sets the size of the circular path, from a tight curve to a wider loop. A smaller Radius produces a larger centripetal acceleration because a_c = v²/r; the path must bend the velocity direction more sharply each second. Increasing Radius lowers the inward acceleration and force requirement, but it also lengthens the period because one revolution covers more distance. Use Radius with the Vertical Circle preset to connect loop size with the required inward acceleration, and with the Banked Curve preset to see why broad highway curves can be taken more gently than tight ramps.",
    },
    misconceptions: [
      {
        wrong:
          "When you spin a ball on a string, centrifugal force pushes the ball outward.",
        correct:
          "There is no outward force in an inertial frame. What you feel as 'centrifugal' is actually your hand pulling the ball inward; by Newton's third law, the ball pulls back on your hand outward. If the inward force vanished, the object would continue along its tangent direction rather than shooting straight out from the center.",
      },
      {
        wrong:
          "An object in uniform circular motion has zero acceleration because its speed is constant.",
        correct:
          "Acceleration is the rate of change of velocity, and velocity is a vector that includes direction. The direction is changing every instant, so the object is accelerating — toward the center of the circle, with magnitude v²/r.",
      },
      {
        wrong:
          "Centripetal force is a special new force generated by circular motion.",
        correct:
          "Centripetal just means 'center-pointing.' It's a label for the role any real force is playing — tension in a string, gravity for a satellite, friction for a car on a flat curve. The first step in any circular-motion problem is identifying which actual force is providing the inward pull.",
      },
      {
        wrong:
          "A wider curve needs the same inward force as a tight curve if the object has the same mass.",
        correct:
          "A wider curve needs less inward force for the same motion because centripetal acceleration scales as v²/r. Tight curves require a sharper change in velocity direction, so the required inward force is larger.",
      },
    ],
    teacherUseCases: [
      "AP Physics 1 data plot: keep Radius fixed, record centripetal force at several Mass values, then graph F versus m to confirm the linear relationship.",
      "Scenario comparison: run Conical Pendulum, Banked Curve, and Vertical Circle presets, then have students identify which real force or force component provides the required inward net force in each case.",
      "Banked-curve design task: use the Banked Curve preset, vary Radius and Mass one at a time, and ask students to explain how road geometry and inertia change the normal-force component needed for turning.",
      "Vertical-loop apparent-weight check: use the Vertical Circle preset and have students compare top and bottom positions, connecting radius and normal force to why riders feel lighter or heavier.",
      "Misconception probe: ask whether changing direction means acceleration, then pause the discussion on the live a_c readout to distinguish speed from changing velocity direction.",
    ],
    faq: [
      {
        question: "Why is the velocity tangent to the circle instead of pointing inward?",
        answer:
          "Velocity points in the direction an object is moving at that instant. In circular motion the object moves around the rim, so its instantaneous velocity is tangent to the circle. The inward force does not point along the motion; it changes the direction of the velocity so the path keeps curving. This is why the acceleration arrow can point inward while the velocity direction stays perpendicular to it.",
      },
      {
        question: "What happens if I make the radius smaller?",
        answer:
          "The required centripetal force increases because F_c = mv²/r and force is inversely proportional to radius. The acceleration also increases to v²/r. This is why tight curves need more inward force than broad curves.",
      },
      {
        question: "Is centripetal force a real force I would feel?",
        answer:
          "It's the label for whatever real force is doing the inward-pulling job. Spin a ball on a string and the centripetal force is the string tension — you absolutely feel it in your hand. For a satellite the centripetal force is gravity. For a car turning, it's friction between the tires and the road. Always real, just renamed by its role.",
      },
      {
        question: "Why do astronauts float inside the ISS if gravity is pulling them in a circle?",
        answer:
          "Gravity is providing the exact centripetal force needed for their orbital speed and radius — they're in continuous free fall around the Earth. The station and everything inside it fall together, so there's no contact force between astronaut and floor. They're not weightless because gravity is gone; they're weightless because everything is falling in unison.",
      },
      {
        question: "How does this connect to AP Physics 1 standards?",
        answer:
          "AP Physics 1 standard 3.B.1 expects students to apply Newton's second law to objects in circular motion and identify the force providing the centripetal acceleration. Standard 4.A.2 covers translational and rotational kinematics. This lab gives you a controlled environment to practice both by comparing mass, radius, period, angular velocity, and net inward force across conical pendulum, banked curve, and vertical circle cases.",
      },
    ],
  },
};
