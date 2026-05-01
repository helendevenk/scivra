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
  contentSections: {
    whatIsIt:
      "Force and motion graphs are the language scientists and engineers use to describe how things move without needing a video. A position-time graph (x-t) shows where an object is at every moment: a flat horizontal line means the object is standing still; a straight diagonal line means it is moving at constant speed; a curve means it is speeding up or slowing down. A velocity-time graph (v-t) shows how fast and in which direction the object moves: a horizontal line means constant velocity; a sloped line means constant acceleration. The area under a v-t graph equals the distance traveled. An acceleration-time graph (a-t) shows the net force effect: a horizontal line at zero means no net force; a nonzero horizontal line means a steady push or pull. In this simulation you apply a force to an object with a chosen mass on a surface with adjustable friction, then watch all three graphs draw themselves in real time. Changing the force mid-run lets you see exactly how each graph responds — a core skill for MS-PS2-2.",
    parameterExplanations: {
      appliedForce:
        "The horizontal force applied to the object in newtons (N), adjustable from -20 N to +20 N. Positive values push the object to the right; negative values push it to the left. A value of 0 means no applied force — only friction acts if the object is already moving. The magnitude and sign of this force directly set the shape of the acceleration-time graph and therefore the slope of the velocity-time graph.",
      mass:
        "The mass of the object in kilograms (kg), adjustable from 1 kg to 20 kg. For the same applied force, a heavier object accelerates more slowly (a = F/m). Doubling the mass halves the acceleration. Changing mass while keeping appliedForce constant lets students isolate how mass affects the motion graphs — the v-t slope gets shallower as mass increases.",
      friction:
        "The friction coefficient (a dimensionless number), adjustable from 0 to 0.5. At 0 there is no friction and the object accelerates freely. As friction increases, a drag force opposes the motion, reducing the net force and therefore the acceleration. At high friction values, the object may decelerate and stop even with a moderate applied force, because friction exceeds the applied force. This produces a characteristic curved deceleration region on the v-t graph.",
    },
    misconceptions: [
      {
        wrong: "A steep line on a position-time graph means the object is accelerating.",
        correct:
          "Steepness (slope) on a position-time graph indicates speed, not acceleration. A steep straight line means fast constant speed. A gentle straight line means slow constant speed. Acceleration shows up as a curve on the x-t graph — the slope is changing. Students often confuse the steepness of a line with the idea of speeding up, but a perfectly straight steep line means perfectly constant velocity.",
      },
      {
        wrong: "If an object is moving, there must be a force pushing it in the direction of motion.",
        correct:
          "This is one of the most common misconceptions in physics. According to Newton's First Law, an object in motion stays in motion at constant velocity unless a net force acts on it. A hockey puck sliding on nearly frictionless ice keeps going with no push. A force is needed to change velocity (speed up, slow down, or turn), not to maintain it. The simulation illustrates this at friction = 0: once moving, the object continues without any applied force.",
      },
      {
        wrong: "The area under a position-time graph gives you something useful about the motion.",
        correct:
          "The area under a velocity-time graph gives displacement — that is the meaningful geometric relationship. For the x-t graph, it is the slope (not the area) that gives velocity. Getting these right is a key skill: slope of x-t = velocity; area under v-t = displacement; slope of v-t = acceleration.",
      },
      {
        wrong: "Friction always stops an object immediately.",
        correct:
          "Friction is a force that opposes motion, but it decelerates objects gradually rather than stopping them instantly. The rate of deceleration depends on the friction coefficient and the object's mass (a = friction force / mass). A very heavy object with low friction may slide a long distance before stopping. In the simulation, you can see this as a downward slope on the v-t graph — gradual, not instantaneous.",
      },
    ],
    teacherUseCases: [
      "Graph shape prediction: before pressing Play, have students sketch what they expect the x-t and v-t graphs to look like for appliedForce = 10 N, mass = 5 kg, friction = 0. After the run, students compare their sketches to the actual graphs and explain any differences. This targets MS-PS2-2 and the practice of using mathematical representations.",
      "Isolating mass: hold appliedForce at 10 N and friction at 0. Run with mass = 2 kg, then mass = 10 kg. Students measure the slope of the v-t graph (acceleration) in each case and verify that a = F/m — directly building the conceptual link between Newton's Second Law and graph slopes.",
      "Friction's effect on the v-t graph: set appliedForce to 0 N and give the object an initial push by briefly setting force to 10 N and then back to 0. Students observe how the v-t slope changes (decelerates) as friction is increased from 0 to 0.4, and identify the point where the object stops. This reinforces that friction is a force, not just a description of 'slowing down'.",
    ],
    faq: [
      {
        question: "What does the slope of a velocity-time graph represent?",
        answer:
          "The slope of a velocity-time graph equals acceleration. A steeper upward slope means the object is speeding up faster (larger positive acceleration). A downward slope means the object is slowing down (negative acceleration, often called deceleration). A flat horizontal line means zero acceleration — constant velocity. This relationship is one of the most important in kinematics: if you can read the slope on a v-t graph, you know the net force divided by the mass acting on the object at that moment.",
      },
      {
        question: "Why does the position-time graph curve when there is a constant force?",
        answer:
          "A constant net force produces constant acceleration, which means velocity increases steadily over time. Because position changes by a larger and larger amount each second (the object moves faster and faster), the position-time graph curves upward — it is a parabola (x = x0 + v0t + 1/2 at squared). A straight line on the x-t graph would mean constant velocity, not constant acceleration. The curve is the visual signature of speeding up under a steady force.",
      },
      {
        question: "Which NGSS standard does this experiment support?",
        answer:
          "This simulation directly supports MS-PS2-2: plan an investigation to provide evidence that the change in an object's motion depends on the sum of the forces on the object and the mass of the object. By varying appliedForce, mass, and friction independently while reading the resulting motion graphs, students gather evidence for Newton's Second Law in a controlled, repeatable way — which is precisely the investigation design skill the standard targets.",
      },
      {
        question: "Can the applied force be negative, and what does that mean?",
        answer:
          "Yes — the appliedForce parameter ranges from -20 N to +20 N. A negative value means the force is directed to the left (opposite the positive direction). If the object is moving to the right and you apply a negative force, it decelerates. If the object is stationary and you apply a negative force, it accelerates to the left. On the v-t graph, negative velocity means leftward motion. This sign convention is the same one scientists and engineers use to handle direction mathematically.",
      },
      {
        question: "What happens on the graphs when I change the force mid-simulation?",
        answer:
          "Changing appliedForce during a run creates an immediate change in the net force and therefore in acceleration. On the a-t graph, you will see a sharp step up or down at the moment you change the slider. On the v-t graph, the slope changes at that same moment — the line kinks. On the x-t graph, the curvature changes. This is exactly how real data loggers look during actual experiments when a force is applied or removed, which makes the simulation a useful preview of lab data interpretation.",
      },
    ],
  },
};
