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
    { id: "initialVelocity", label: "Initial Velocity", unit: "m/s", min: -20, max: 20, default: 0, step: 1, tier: "free" },
    { id: "appliedForce", label: "Applied Force", unit: "N", min: -50, max: 50, default: 10, step: 1, tier: "free" },
    { id: "mass", label: "Mass", unit: "kg", min: 1, max: 20, default: 5, step: 1, tier: "free" },
    { id: "friction", label: "Friction Force", unit: "N", min: 0, max: 30, default: 0, step: 1, tier: "free" },
  ],
  formulas: [
    { latex: "a = \\frac{F_{\\text{net}}}{m}", description: "Newton's 2nd law: net force divided by mass gives acceleration" },
    { latex: "v = v_0 + at", description: "Velocity changes linearly with constant acceleration" },
    { latex: "x = x_0 + v_0 t + \\frac{1}{2}at^2", description: "Position is a quadratic function of time under constant acceleration" },
  ],
  theory: "A position-time graph shows where an object is. A straight line means constant velocity; a curve means acceleration. The slope of the x-t graph gives velocity. A velocity-time graph shows how fast the object moves. A horizontal line means constant velocity (no acceleration); a sloped line means constant acceleration. The slope of the v-t graph gives acceleration, and the area under it gives signed displacement (distance only when velocity stays non-negative, or from a speed-time graph). When net force is zero, velocity is constant. When friction opposes motion, the net force is F_applied - f_friction, and the object decelerates when the applied force is removed.",
  instructions: "Use the four sliders to set Initial Velocity, Applied Force, Mass, and Friction Force, or choose one of the three presets: Free Acceleration (no friction), Deceleration with Friction, or Constant Velocity (F=f). Press Play to start the simulation. Watch how F=ma connects the net force to acceleration, then compare the position-time, velocity-time, and acceleration-time graphs as the motion changes.",
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
  htmlControlAliases: { initialVelocity: "sl-v0", appliedForce: "sl-force", mass: "sl-mass", friction: "sl-fric" },
  presets: [
    {
      id: "free",
      label: "Free Acceleration (no friction)",
      description: "Starts from rest with a steady applied force and no friction, so students can see a clean F=ma acceleration pattern.",
      paramValues: { initialVelocity: 0, appliedForce: 10, mass: 5, friction: 0 },
    },
    {
      id: "decel",
      label: "Deceleration with Friction",
      description: "Starts with forward motion and friction but no applied force, showing how an opposing force reduces velocity over time.",
      paramValues: { initialVelocity: 15, appliedForce: 0, mass: 5, friction: 8 },
    },
    {
      id: "const",
      label: "Constant Velocity (F=f)",
      description: "Balances applied force and friction force so the net force is zero and the velocity-time graph stays horizontal.",
      paramValues: { initialVelocity: 5, appliedForce: 10, mass: 5, friction: 10 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Force and motion graphs are the language scientists and engineers use to describe how things move without needing a video. A position-time graph (x-t) shows where an object is at every moment: a flat horizontal line means the object is standing still; a straight diagonal line means it is moving at constant speed; a curve means it is speeding up or slowing down. A velocity-time graph (v-t) shows how fast and in which direction the object moves: a horizontal line means constant velocity; a sloped line means constant acceleration. The area under a v-t graph equals signed displacement (the net change in position, counting direction); it equals actual distance traveled only when velocity stays non-negative throughout. An acceleration-time graph (a-t) shows the net force effect: a horizontal line at zero means no net force; a nonzero horizontal line means a steady push or pull. In this simulation you apply a force to an object with a chosen mass on a surface with adjustable friction, then watch all three graphs draw themselves in real time. Changing the force mid-run lets you see exactly how each graph responds — a core skill for MS-PS2-2.",
    parameterExplanations: {
      initialVelocity:
        "Initial Velocity sets how fast and in which direction the object is already moving when the run begins. A positive value means it starts moving in the positive direction, a negative value means it starts moving the other way, and 0 m/s means it starts from rest. This slider helps students separate motion from force: an object can already be moving even before a new push is applied. Compare the Deceleration with Friction preset to a run that starts from rest. The velocity-time graph begins at the Initial Velocity value, while later changes in slope come from acceleration caused by the net force.",
      appliedForce:
        "Applied Force is the push or pull you choose to add to the object, measured in newtons. Positive values push in the positive direction, while negative values push in the opposite direction. In F=ma, this force is only part of the story because friction can also act. The acceleration comes from the net force: Applied Force minus the Friction Force when friction opposes the motion. Keep Mass and Friction Force constant, then change only Applied Force. The acceleration-time graph should step to a new value, and the velocity-time graph should change slope. That is direct evidence for MS-PS2-2.",
      mass:
        "Mass tells how much matter the object has, measured in kilograms. In this model, Mass changes how strongly the same net force affects motion. With the same Applied Force and Friction Force, a larger Mass gives a smaller acceleration because a = Fnet / m. A smaller Mass gives a steeper velocity-time graph because its velocity changes more each second. Try the Free Acceleration preset, then raise Mass while keeping Applied Force and Friction Force the same. Students can connect the shallower graph slope to Newton's Second Law and to the idea that energy transfer changes motion differently for objects with different masses.",
      friction:
        "Friction Force is the size of the force that opposes sliding motion, measured in newtons. It does not help the motion forward; it acts against the direction the object is moving. If Applied Force is larger than Friction Force, the object speeds up in the applied-force direction. If they are equal, the net force is zero and velocity stays constant. If Applied Force is smaller than Friction Force while the object is moving, the object slows down. Use the Constant Velocity (F=f) preset to see balanced forces, then use Deceleration with Friction to connect negative acceleration to energy being transferred away from the moving object.",
    },
    misconceptions: [
      {
        wrong: "A steep line on a position-time graph means the object is accelerating.",
        correct:
          "Steepness (slope) on a position-time graph indicates speed, not acceleration. A steep straight line means fast constant speed. A gentle straight line means slow constant speed. Acceleration shows up as a curve on the x-t graph because the slope is changing over time. Students can test this with the Constant Velocity (F=f) preset: the object keeps moving, the position-time graph is straight, and the velocity-time graph is horizontal because the net force is zero.",
      },
      {
        wrong: "If an object is moving, there must be a force pushing it in the direction of motion.",
        correct:
          "An object can keep moving even when the net force is zero. A force is needed to change velocity, not to maintain constant velocity. Set Initial Velocity above 0, Applied Force to 0 N, and Friction Force to 0 N. The object keeps moving at the same velocity, so the velocity-time graph stays flat. If you add Friction Force, the object slows because friction creates a net force opposite the motion.",
      },
      {
        wrong: "The area under a position-time graph gives you something useful about the motion.",
        correct:
          "The area under a velocity-time graph gives displacement — that is the meaningful geometric relationship. For the x-t graph, it is the slope, not the area, that gives velocity. Getting these right is a key skill: slope of position-time = velocity; slope of velocity-time = acceleration; area under velocity-time = displacement. The four sliders let students create different graph shapes and check which graph features have physical meaning.",
      },
      {
        wrong: "Friction always stops an object immediately.",
        correct:
          "Friction is a force, so it changes motion according to F=ma. It does not stop an object instantly unless the force is large enough over enough time. In the Deceleration with Friction preset, the object begins with Initial Velocity but has no Applied Force, so Friction Force creates an acceleration opposite the motion. The velocity-time graph slopes downward gradually. If Applied Force and Friction Force are balanced, as in the Constant Velocity (F=f) preset, the object can keep moving at constant velocity instead of slowing down.",
      },
    ],
    teacherUseCases: [
      "Graph shape prediction: before pressing Play, have students choose the Free Acceleration (no friction) preset, record Initial Velocity, Applied Force, Mass, and Friction Force, then sketch expected x-t and v-t graphs. After the run, students compare their sketches to the actual graphs and explain how F=ma produced the observed slopes. This targets MS-PS2-2 and the practice of using mathematical representations.",
      "Isolating mass: start with the Free Acceleration (no friction) preset, then keep Applied Force = 10 N and Friction Force = 0 N while changing only Mass from 5 kg to 10 kg. Students measure the slope of the v-t graph in each run and verify that larger Mass gives smaller acceleration for the same net force.",
      "Friction's effect on the v-t graph: use the Deceleration with Friction preset so Initial Velocity is positive, Applied Force is 0 N, and Friction Force opposes the motion. Students observe the downward v-t slope, then increase Friction Force and identify how the acceleration-time graph and stopping time change.",
      "Balanced forces investigation: use the Constant Velocity (F=f) preset, where Applied Force and Friction Force are equal. Students explain why the acceleration-time graph stays at zero and why the velocity-time graph remains horizontal even though forces are present. This reinforces that motion changes depend on the sum of forces, not on one force alone.",
      "Energy and motion connection: compare Free Acceleration (no friction) with Deceleration with Friction. Students describe how Applied Force can increase the object's kinetic energy, while Friction Force reduces motion by transferring energy away from the moving object. Keep the focus on graph evidence and connect the discussion to MS-PS3-1 without changing the MS-PS2-2 investigation emphasis.",
    ],
    faq: [
      {
        question: "What does the slope of a velocity-time graph represent?",
        answer:
          "The slope of a velocity-time graph equals acceleration. A steeper upward slope means the object is speeding up faster in the positive direction. A downward slope means the velocity is decreasing, often because Friction Force or a negative Applied Force is acting opposite the motion. A flat horizontal line means zero acceleration — constant velocity. This relationship is one of the most important in kinematics: if you can read the slope on a v-t graph, you can connect the graph to the net force divided by Mass.",
      },
      {
        question: "Why does the position-time graph curve when there is a constant force?",
        answer:
          "A constant net force produces constant acceleration, which means velocity changes steadily over time. Because position changes by a different amount each second as the velocity changes, the position-time graph curves — it follows x = x0 + v0t + 1/2 at squared. A straight line on the x-t graph means constant velocity, not constant acceleration. Try the Free Acceleration (no friction) preset to see the curve clearly, then compare it with Constant Velocity (F=f), where the x-t graph is straight.",
      },
      {
        question: "Which NGSS standard does this experiment support?",
        answer:
          "This simulation directly supports MS-PS2-2: plan an investigation to provide evidence that the change in an object's motion depends on the sum of the forces on the object and the mass of the object. By varying Initial Velocity, Applied Force, Mass, and Friction Force while reading the resulting motion graphs, students gather evidence for Newton's Second Law in a controlled, repeatable way. The graphs also support MS-PS3-1 discussions about how changes in motion connect to energy.",
      },
      {
        question: "Can the Applied Force be negative, and what does that mean?",
        answer:
          "Yes — the Applied Force slider can be negative. A negative value means the force is directed opposite the positive direction. If the object is moving to the right and you apply a negative force, it may slow down, stop, or begin moving left depending on the net force and time. If the object is stationary and the net force is negative, it accelerates left. On the velocity-time graph, negative velocity means motion in the negative direction. This sign convention is how scientists and engineers represent direction mathematically.",
      },
      {
        question: "What happens on the graphs when I change a slider during the simulation?",
        answer:
          "Changing Applied Force, Mass, or Friction Force changes the acceleration because acceleration depends on net force divided by Mass. On the acceleration-time graph, you should see the value change right away. On the velocity-time graph, the slope changes at that same moment. On the position-time graph, the curve changes more gradually because position depends on the velocity history. Changing Initial Velocity matters most at the start of a run because it sets the velocity-time graph's starting value before later forces change the motion.",
      },
    ],
  },
};
