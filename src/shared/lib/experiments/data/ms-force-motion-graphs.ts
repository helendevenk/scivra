import type { Experiment } from "@/shared/types/experiment";

export const msForceMotionGraphs: Experiment = {
  id: "ms-force-motion-graphs",
  slug: "ms-force-motion-graphs",
  title: "Force & Motion Graphs",
  subtitle: "Position-time, velocity-time, and acceleration-time graphs",
  description:
    "Connect forces to motion by watching an object move while position, velocity, and acceleration graphs update in real time. Apply constant or varying forces, add friction, and learn to read kinematic graphs — identify constant velocity, acceleration, deceleration, and rest from graph shapes.",
  thumbnail: "/imgs/experiments/ms-force-motion-graphs.png",
  standards: { ngss: ["MS-PS2-2"], gcse: [], ap: [] },
  primaryStandard: "ngss-ms",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "6-8",
  tags: ["force and motion", "kinematics graphs", "position-time", "velocity-time", "middle school physics"],
  difficulty: "beginner",
  parameters: [
    { id: "appliedForce", label: "Applied Force", unit: "N", min: -20, max: 20, default: 5, step: 1, tier: "free" },
    { id: "mass", label: "Object Mass", unit: "kg", min: 1, max: 20, default: 5, step: 1, tier: "free" },
    { id: "friction", label: "Friction Coefficient", unit: "", min: 0, max: 0.5, default: 0.1, step: 0.05, tier: "free" },
  ],
  formulas: [
    { latex: "a = \\frac{F_{\\text{net}}}{m}", description: "Newton's 2nd law: net force divided by mass gives acceleration" },
    { latex: "v = v_0 + at", description: "Velocity changes linearly with constant acceleration" },
    { latex: "x = x_0 + v_0 t + \\frac{1}{2}at^2", description: "Position is a quadratic function of time under constant acceleration" },
  ],
  theory: "A position-time graph shows where an object is. A straight line means constant velocity; a curve means acceleration. The slope of the x-t graph gives velocity. A velocity-time graph shows how fast the object moves. A horizontal line means constant velocity (no acceleration); a sloped line means constant acceleration. The slope of the v-t graph gives acceleration, and the area under it gives displacement. When net force is zero, velocity is constant. When friction opposes motion, the net force is F_applied - f_friction, and the object decelerates when the applied force is removed.",
  instructions: "Set the applied force, mass, and friction. Press Play to start the simulation. Watch the object move along a track while three graphs (x-t, v-t, a-t) update in real time. Change the force mid-simulation to see how graphs respond.",
  challenges: [
    { id: "mfm-c1", question: "A 5 kg object has a 5 N force applied with no friction. What is its acceleration?", hint: "a = F/m = 5/5 = 1 m/s²", tier: "free" },
    { id: "mfm-c2", question: "What does a straight horizontal line on a velocity-time graph mean?", hint: "Constant velocity — the object moves at the same speed (acceleration is zero)", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 15,
  relatedExperiments: ["projectile-motion", "newtons-laws"],
  htmlPath: "/experiments/middle/ms-force-motion-graphs.html",
  seoTitle: "Force & Motion Graphs Simulation | Scivra Middle School",
  seoKeywords: ["force and motion graphs", "kinematics simulation", "position time graph", "velocity time interactive"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Middle School", teaches: "Force and Motion Graphs" },
};
