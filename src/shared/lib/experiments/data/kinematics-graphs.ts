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

  challenges: [
    {
      id: "kg-c1",
      question: "A car starts at 4 m/s and decelerates at -2 m/s². When does it come to a stop?",
      hint: "Set v = 0 in v = v₀ + at. Solve for t.",
      tier: "free",
    },
    {
      id: "kg-c2",
      question: "What does a negative area under a v-t graph represent physically?",
      hint: "Area = displacement. Negative area means the object moved in the negative direction.",
      tier: "free",
    },
    {
      id: "kg-c3",
      question: "Sketch what an a-t graph looks like for constant acceleration motion. What shape is it?",
      hint: "If acceleration is constant, what does its graph vs. time look like?",
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
