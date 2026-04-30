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
      id: "radius",
      label: "Radius (r)",
      unit: "m",
      min: 0.5,
      max: 5,
      default: 2,
      step: 0.1,
      tier: "free",
    },
    {
      id: "speed",
      label: "Speed (v)",
      unit: "m/s",
      min: 0.5,
      max: 10,
      default: 4,
      step: 0.1,
      tier: "free",
    },
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
      id: "showCut",
      label: "Cut the string!",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "pro",
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
    "Adjust radius and speed. Watch how the centripetal force vector (arrow) changes magnitude and always points inward. Increase speed while keeping radius fixed — feel how much more force is required. Use the 'cut string' toggle (Pro) to see the ball fly off tangentially.",

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
      title: "What Happens When the Force Disappears?",
      content: "Cut the string and the ball flies off tangentially — not outward! This is Newton's first law in action: without a net force, the object continues in a straight line along its instantaneous velocity direction.",
      relatedParameterId: "showCut",
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

  contentSections: {
    whatIsIt:
      "A car turns onto a highway off-ramp, a yo-yo whirls on a string, the Moon swings around the Earth — every one of these is an object that wants to fly straight but is being yanked sideways into a curve. Newton's first law says without a net force an object travels in a straight line, so anything moving in a circle must have a force constantly pulling it toward the center. We call that the centripetal force. It is not a new kind of force; it's a job some other force (tension, gravity, friction, normal force) has to do. Cut the source of that inward pull and the object stops curving. In this lab you set the radius, speed, and mass of an orbiting ball, watch the inward force vector update, and snip the string to see where it actually goes.",
    parameterExplanations: {
      radius:
        "The radius of the circular path in meters — how far the ball is from the center of its circle. Smaller radii at fixed speed mean tighter turns and much higher centripetal acceleration (a_c = v²/r), which is why figure skaters spin faster when they pull their arms in.",
      speed:
        "The ball's tangential speed along the circle in m/s. Centripetal force scales with speed squared, so doubling the speed quadruples the inward force needed to keep the same circular path. This is why highway curves get dangerous fast as you accelerate.",
      mass:
        "The mass of the orbiting object in kilograms. The required centripetal force scales linearly with mass (F_c = mv²/r), so a 2 kg ball needs twice the inward pull of a 1 kg ball at the same speed and radius. Doesn't change the centripetal acceleration, only the force.",
      showCut:
        "A toggle that severs the string mid-orbit. When on, the ball loses its inward force and continues in a straight line tangent to the circle at the cut point — a direct demonstration of Newton's first law and a quick way to kill the misconception that the ball flies outward.",
    },
    misconceptions: [
      {
        wrong:
          "When you spin a ball on a string, centrifugal force pushes the ball outward.",
        correct:
          "There is no outward force in an inertial frame. What you feel as 'centrifugal' is actually your hand pulling the ball inward; by Newton's third law, the ball pulls back on your hand outward. Cut the string and the ball flies tangent to the circle, not straight out from the center.",
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
          "If you double the speed of a car going around a curve, you need twice as much friction to keep it on the road.",
        correct:
          "You need four times as much. Centripetal force depends on v², so doubling speed quadruples the friction demand. This is why posted curve-speed limits drop sharply as curves tighten — the available friction can't keep up.",
      },
    ],
    teacherUseCases: [
      "Data plot task: have students record the centripetal force at speeds of 2, 4, 6, and 8 m/s with a fixed radius, then plot F versus v and F versus v² to confirm the quadratic relationship.",
      "Predict-the-trajectory: ask students to draw on paper where the ball will go when the string is cut at the 12 o'clock position before they toggle the cut. The most common wrong answer (radially outward) is the most useful teaching moment.",
      "Curve-of-the-road problem: give students a 50 m radius curve and a 1200 kg car, and ask them to measure the friction force needed at 15 m/s, 20 m/s, and 25 m/s. Tie it to highway design.",
      "Identify-the-force discussion: pause after each parameter change and ask 'in this scenario, what real force is providing the centripetal pull?' Students who can answer that consistently have nailed the core skill.",
      "Misconception probe: ask the class whether the ball moving in a circle has zero acceleration. Most students who say yes are confusing speed with velocity — pause the sim and use the inward arrow to make the case.",
    ],
    faq: [
      {
        question: "Why does the ball fly tangent to the circle when the string is cut, not outward?",
        answer:
          "At any instant, the ball's velocity points along the tangent to the circle. The string had been pulling it inward to bend that velocity into a curve. The moment the inward force vanishes, Newton's first law takes over and the ball keeps moving in whatever direction it was going — which is tangent, not radial.",
      },
      {
        question: "What happens if I double the speed but keep the radius the same?",
        answer:
          "The required centripetal force quadruples because F_c = mv²/r and force depends on the square of speed. The acceleration also quadruples to v²/r. This is why a car taking a curve at 40 mph needs four times the friction of the same curve at 20 mph.",
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
          "AP Physics 1 standard 3.B.1 expects students to apply Newton's second law to objects in circular motion and identify the force providing the centripetal acceleration. Standard 4.A.2 covers translational and rotational kinematics. This lab gives you a controlled environment to practice both — the cut-string toggle in particular is an AP-style probe of inertial reasoning.",
      },
    ],
  },
};
