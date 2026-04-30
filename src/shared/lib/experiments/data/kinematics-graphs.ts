import type { Experiment } from "@/shared/types/experiment";

export const kinematicsGraphs: Experiment = {
  id: "kinematics-graphs",
  slug: "kinematics-position-velocity-time-graphs",
  title: "Kinematics Graphs",
  subtitle: "Interpret position-time and velocity-time graphs for uniform acceleration",
  description:
    "Set initial velocity and acceleration to generate live x-t and v-t graphs side by side. Click any point on the graph to read exact position and velocity values. Discover how the slope of x-t gives velocity and the slope of v-t gives acceleration — the graphical heart of kinematics.",
  thumbnail: "/imgs/experiments/kinematics-graphs.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["P1.1", "P1.2"],
    ap: ["CHA-1.A", "CHA-1.B", "CHA-1.D"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["kinematics", "position-time graph", "velocity-time graph", "acceleration", "displacement", "AP Physics 1", "graphing"],
  difficulty: "beginner",

  parameters: [
    {
      id: "initial_velocity",
      label: "Initial Velocity",
      unit: "m/s",
      min: -10,
      max: 10,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "acceleration",
      label: "Acceleration",
      unit: "m/s²",
      min: -5,
      max: 5,
      default: -2,
      step: 0.1,
      tier: "free",
    },
    {
      id: "time_scale",
      label: "Time Scale",
      unit: "x",
      min: 0.25,
      max: 2,
      default: 1,
      step: 0.25,
      tier: "pro",
    },
    {
      id: "show_graph",
      label: "Graph Mode (0=x-t, 1=v-t, 2=both)",
      unit: "",
      min: 0,
      max: 2,
      default: 2,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "x = x_0 + v_0 t + \\frac{1}{2}at^2",
      description: "Position as a function of time (uniform acceleration)",
    },
    {
      latex: "v = v_0 + at",
      description: "Velocity as a function of time",
    },
    {
      latex: "v^2 = v_0^2 + 2a\\Delta x",
      description: "Velocity-displacement kinematic equation",
    },
    {
      latex: "\\Delta x = \\text{area under } v\\text{-}t \\text{ graph}",
      description: "Displacement equals the area under the velocity-time graph",
    },
  ],

  theory:
    "Kinematics describes motion without asking why it happens. For constant acceleration, position follows a parabola on an x-t graph while velocity traces a straight line on a v-t graph. The slope of the x-t curve at any instant equals the instantaneous velocity; the slope of the v-t line equals acceleration. Crucially, the signed area under the v-t graph between two times equals the displacement — not the distance. Negative velocity means motion in the negative direction; negative area means the object moved backward. Mastering these graph relationships is the single most tested skill on AP Physics 1.",

  instructions:
    "Adjust initial velocity and acceleration sliders. The animation shows a ball moving along a track while both graphs update in real time. Pause at any moment to read the exact x and v values. Try v₀ = 0, a = 2 to get pure parabolic x-t and linear v-t. Then try v₀ = 5, a = -2 — note the x-t maximum occurs exactly where v-t crosses zero. Toggle Graph Mode (Pro) to focus on one graph at a time.",

  hook: {
    question: "Can an object have zero velocity but non-zero acceleration?",
    context:
      "Think about a ball thrown straight up at the very top of its arc.",
    actionPrompt: "Launch the simulation to find out",
  },

  learningCards: [
    {
      id: "kg-lc1",
      title: "Position-Time Graphs",
      content:
        "A position-time graph shows where an object is at each moment. For constant acceleration, the curve is a parabola. The slope at any point equals the instantaneous velocity — steeper slope means faster motion.",
      formula: {
        latex: "x = x_0 + v_0 t + \\frac{1}{2}at^2",
        description: "Position as a function of time under constant acceleration",
      },
      relatedParameterId: "initial_velocity",
    },
    {
      id: "kg-lc2",
      title: "Velocity-Time Graphs",
      content:
        "A velocity-time graph for constant acceleration is always a straight line. The slope of this line equals the acceleration, and the area under the line equals displacement — not distance traveled.",
      formula: {
        latex: "v = v_0 + at",
        description: "Velocity as a function of time",
      },
      relatedParameterId: "acceleration",
    },
    {
      id: "kg-lc3",
      title: "Acceleration-Time Graphs",
      content:
        "For uniform acceleration, the a-t graph is a horizontal line. The area under the a-t curve over a time interval equals the change in velocity during that interval. Zero area means the speed did not change.",
      formula: {
        latex: "\\Delta v = \\int a \\, dt",
        description: "Change in velocity equals the area under the a-t graph",
      },
    },
    {
      id: "kg-lc4",
      title: "Connecting the Three Graphs",
      content:
        "The three motion graphs are mathematically linked: the slope of x-t gives v-t, and the slope of v-t gives a-t. Working backwards, the area under a-t gives change in v, and the area under v-t gives displacement. Mastering these connections is the single most tested skill on AP Physics 1.",
    },
  ],

  easterEggs: [
    {
      parameterId: "acceleration",
      condition: "max",
      effect: "Graph curves become dramatically steep and the ball flies off-screen within seconds",
      message: "Maximum acceleration! That is 5 m/s² — roughly half of Earth's gravitational pull.",
    },
  ],

  challenges: [
    {
      id: "kg-c1",
      question: "A car starts at 4 m/s and decelerates at -2 m/s². When does it come to a stop?",
      options: ["1 s", "2 s", "4 s", "8 s"],
      correctAnswer: "2 s",
      hint: "Set v = 0 in v = v₀ + at. Solve for t.",
      relatedParameterId: "acceleration",
      tier: "free",
    },
    {
      id: "kg-c2",
      question: "What does a negative area under a v-t graph represent physically?",
      options: [
        "The object is accelerating",
        "The object moved in the negative direction",
        "The object is decelerating",
        "The object has negative mass",
      ],
      correctAnswer: "The object moved in the negative direction",
      hint: "Area = displacement. Negative area means the object moved in the negative direction.",
      tier: "free",
    },
    {
      id: "kg-c3",
      question: "Sketch what an a-t graph looks like for constant acceleration motion. What shape is it?",
      options: [
        "A parabola",
        "A straight line with positive slope",
        "A horizontal line",
        "An exponential curve",
      ],
      correctAnswer: "A horizontal line",
      hint: "If acceleration is constant, what does its graph vs. time look like?",
      relatedParameterId: "acceleration",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["projectile-motion", "newtons-laws", "circular-motion"],

  seoTitle: "Kinematics Graphs — Position & Velocity Time Graphs | Scivra",
  seoKeywords: [
    "kinematics graphs simulation",
    "position time graph",
    "velocity time graph",
    "AP Physics 1 kinematics",
    "constant acceleration",
    "displacement area graph",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Kinematics and Motion Graphs",
  },

  contentSections: {
    whatIsIt:
      "Glance at the speedometer of a car as it merges onto a highway. Look up at the road signs. The reading on the speedometer is your velocity; the markers on the highway tell you your position. Both change over time, and the way they change tells you the acceleration. Kinematics graphs are how physicists chart that story. This lab gives you sliders for initial velocity and constant acceleration, then plots the resulting position-time and velocity-time curves side by side while a ball animates the same motion on a track. Click any moment to read exact x and v values. The big payoff is the slope rule: the slope of the x-t curve equals the velocity at that instant, and the slope of the v-t line equals the acceleration. Master those two relationships and most of AP Physics 1 kinematics falls into place.",
    parameterExplanations: {
      initial_velocity:
        "The velocity at t = 0 in meters per second, with sign showing direction. Positive means motion to the right; negative means motion to the left. This sets the y-intercept of the v-t line.",
      acceleration:
        "The constant rate of change of velocity in meters per second squared. Positive acceleration tilts the v-t line upward; negative tilts it downward. The slope of the v-t line equals this value exactly.",
      time_scale:
        "Stretches or compresses the time axis on both graphs. Useful for zooming in on a short, fast motion or zooming out to see a long, slow one without changing the underlying physics.",
      show_graph:
        "Picks which graph to display: 0 for position-time only, 1 for velocity-time only, or 2 for both side by side. Use single-graph modes to focus students on one slope rule at a time before introducing the connections.",
    },
    misconceptions: [
      {
        wrong:
          "An x-t graph and a v-t graph for the same motion look basically the same — both slope upward when something speeds up.",
        correct:
          "They have different shapes. For constant acceleration, the x-t graph is a parabola (a curve) while the v-t graph is a straight line. Confusing them is the single most common error on AP Physics 1 graph problems. The v-t graph is the slope of the x-t graph at every instant.",
      },
      {
        wrong:
          "If the velocity is zero, the object must also have zero acceleration.",
        correct:
          "Velocity and acceleration are independent at any instant. A ball at the very top of its toss has zero velocity but acceleration equal to -9.8 m/s² (still pulled down by gravity). The simulation lets you reproduce this exactly: set v₀ = 5, a = -2, and at the moment v hits zero the ball is still accelerating.",
      },
      {
        wrong:
          "The area under a v-t graph equals the total distance traveled, regardless of sign.",
        correct:
          "Signed area equals displacement; unsigned area (treating dips below zero as positive) equals distance. If the velocity is negative for part of the motion, that contributes negative area and the displacement comes out smaller than the distance traveled.",
      },
      {
        wrong:
          "Negative velocity means the object is slowing down.",
        correct:
          "Negative velocity means the object is moving in the negative direction (e.g., backward or leftward). 'Slowing down' is when velocity and acceleration have opposite signs, regardless of which sign is which. An object with v = -10 m/s and a = -2 m/s² is actually speeding up in the negative direction.",
      },
      {
        wrong:
          "If the position-time graph is a straight horizontal line, the object's position is undefined.",
        correct:
          "A horizontal x-t line means position is constant — the object is at rest. The slope is zero, so velocity is zero. There is nothing undefined; the motion is simply 'standing still' for that interval.",
      },
    ],
    teacherUseCases: [
      "Slope-of-slope drill: students set v₀ = 0, a = 2 to see a clean upward parabola on x-t and a straight line on v-t. Have them measure the slope of x-t at three different times and verify it matches the v-t reading exactly.",
      "Misconception probe — top of the toss: ask students whether a ball thrown straight up has any acceleration at the apex. After the predictable wrong answer, run the lab with v₀ = 5, a = -2 and pause exactly at v = 0 to show that acceleration is still -2 there.",
      "Sign convention bootcamp: have students sketch what happens when v₀ and a have the same sign vs. opposite signs, then verify all four combinations in the simulation. Tie this directly to the 'speeding up vs. slowing down' rule.",
      "Data collection — area equals displacement: students choose a v-t configuration with positive and negative regions, count grid squares to estimate signed area, and compare with the simulation's exact displacement readout. Reinforces 'signed area = displacement.'",
      "AP free-response simulation: project the lab during a graph-interpretation question. Have students predict the slope at a flagged point on x-t before reading the v-t value, then justify their prediction using calculus or the kinematic equations.",
    ],
    faq: [
      {
        question:
          "Why is the x-t graph a parabola when acceleration is constant?",
        answer:
          "The kinematic equation x(t) = x₀ + v₀t + ½at² is a quadratic function of time, and the graph of any quadratic is a parabola. The half-at² term is what makes the curve bend. If acceleration were zero the equation would reduce to x = x₀ + v₀t, a straight line. So the curvature you see on the x-t plot is literally the acceleration showing itself.",
      },
      {
        question:
          "How do I find displacement from a velocity-time graph?",
        answer:
          "Compute the signed area between the v-t line and the time axis between your two times. Areas above the axis count positive; areas below count negative. For constant acceleration the shape is a trapezoid (or triangle), so use ½(v₀ + v_f) × Δt. The simulation reads displacement exactly so you can verify your hand calculation.",
      },
      {
        question:
          "Can an object have zero velocity and non-zero acceleration at the same time?",
        answer:
          "Yes — and this is one of AP Physics 1's favorite questions. A ball thrown straight up reaches the top of its arc with v = 0, but gravity is still pulling it down at -9.8 m/s². The acceleration is what flips the sign of the velocity from positive to negative through that instant. Zero velocity is a moment, not a state of zero forces. Try v₀ = 4, a = -2 in the simulation to see this exactly at t = 2 s.",
      },
      {
        question:
          "What is the difference between distance and displacement on these graphs?",
        answer:
          "Displacement is signed and depends only on start and end positions: x_f - x₀. Distance is unsigned and counts every meter traveled, including any backtracking. On a v-t graph, displacement is signed area; distance is the sum of absolute values of areas. If an object goes 10 m forward then 4 m back, displacement is +6 m but distance is 14 m. Mixing them up is a top-five AP Physics 1 error.",
      },
      {
        question:
          "How does this lab map onto AP Physics 1 standards CHA-1.A, CHA-1.B, and CHA-1.D?",
        answer:
          "CHA-1.A asks students to describe an object's motion using position, velocity, and acceleration; CHA-1.B requires interpreting motion graphs and the relationships among them (slope of x-t = v, slope of v-t = a, area under v-t = displacement); CHA-1.D extends this to predicting motion using kinematic equations under constant acceleration. The lab puts all three standards in one interactive view so students can move fluidly among them.",
      },
      {
        question:
          "Why is the slope of the v-t graph equal to acceleration?",
        answer:
          "Slope is rise over run, which on a v-t graph means change in velocity divided by change in time. That ratio is the definition of acceleration: a = Δv/Δt. So computing slope on a v-t graph is literally computing acceleration; they are the same quantity by definition. For constant acceleration the v-t graph is a straight line, so the slope is the same everywhere — and matches the slider value exactly.",
      },
    ],
  },
};
