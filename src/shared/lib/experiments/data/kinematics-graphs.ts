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

  seoTitle: "Kinematics Graphs — Position & Velocity Time Graphs | NeonPhysics",
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
};
