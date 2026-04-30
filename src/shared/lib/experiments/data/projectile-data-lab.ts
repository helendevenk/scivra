import type { Experiment } from "@/shared/types/experiment";

export const projectileDataLab: Experiment = {
  id: "projectile-data-lab",
  slug: "projectile-data-lab-analysis",
  title: "Projectile Data Lab",
  subtitle: "Collect and analyze real projectile motion data",
  description:
    "Launch projectiles and collect position-time data. Use the data to verify kinematic equations, find launch speed, and analyze how air resistance changes trajectories.",
  thumbnail: "/imgs/experiments/projectile-motion.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P5.6"],
    ap: ["3.A.1", "3.E.1", "SP-5.A"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["projectile motion", "data analysis", "kinematics", "air resistance", "trajectory", "launch angle"],
  difficulty: "intermediate",

  parameters: [
    { id: "launch_speed", label: "Launch Speed", unit: "m/s", min: 5, max: 30, default: 15, step: 0.5, tier: "free" },
    { id: "launch_angle", label: "Launch Angle", unit: "°", min: 0, max: 90, default: 45, step: 1, tier: "free" },
    { id: "air_resistance", label: "Air Resistance", unit: "", min: 0, max: 1, default: 0, step: 0.05, tier: "free" },
    { id: "height", label: "Launch Height", unit: "m", min: 0, max: 20, default: 0, step: 0.5, tier: "pro" },
  ],

  formulas: [
    { latex: "x = v_0\\cos\\theta \\cdot t", description: "Horizontal position" },
    { latex: "y = v_0\\sin\\theta \\cdot t - \\frac{1}{2}gt^2", description: "Vertical position" },
    { latex: "R = \\frac{v_0^2\\sin 2\\theta}{g}", description: "Range (flat ground, no air resistance)" },
  ],

  theory:
    "Projectile motion separates into independent horizontal (constant velocity) and vertical (constant acceleration −g) components. Without air resistance, the optimal range angle is 45°. Air resistance reduces range and optimal angle (below 45°). By collecting position-time data, you can fit parabolic curves and extract launch speed and angle even without knowing them in advance.",
  instructions:
    "Set launch parameters and fire the projectile. Click on the trajectory to sample data points. The data table records (x, t) and (y, t) values. Fit a parabola to the y-t data to extract g and initial vertical speed. Enable air resistance to observe the asymmetric trajectory.",
  challenges: [
    { id: "pdl-c1", question: "At what angle is range maximum (no air resistance)?", hint: "R = v₀² sin(2θ)/g is maximum when sin(2θ)=1 → θ=45°", tier: "free" },
    { id: "pdl-c2", question: "From x-t data, determine the launch speed if angle=30°", hint: "v_x = v₀cos(30°); slope of x vs t gives v_x; v₀ = v_x/cos(30°)", tier: "free" },
    { id: "pdl-c3", question: "With air resistance, why does the optimal angle drop below 45°?", hint: "Horizontal deceleration means spending less time in air is better; lower angle = faster horizontal motion", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["projectile-motion", "kinematics-graphs", "forces-motion-basics"],

  seoTitle: "Projectile Data Lab — Motion Analysis | AP Physics 1",
  seoKeywords: ["projectile motion", "data lab", "kinematics", "trajectory analysis", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Projectile Motion, Data Analysis, Kinematics" },

  contentSections: {
    whatIsIt:
      "Imagine you're handed a stack of stroboscopic photos showing a launched ball at every 0.05 seconds, and you have to figure out — from the data alone — what the launch speed and angle were. That's the actual job of an experimental physicist, and that's the job this lab teaches. Set the launch parameters, fire a projectile, and click along the trajectory to record (x, t) and (y, t) data points into a table. Then plot, fit, and analyze: a horizontal-position-versus-time plot should be linear (constant v_x), and a vertical-position-versus-time plot should be a parabola (vertical free fall). The slope of x vs. t gives v₀cos θ; the curvature of y vs. t gives g; together they recover both launch speed and angle to within a few percent. Run a range-versus-angle sweep at fixed speed to discover the sin(2θ) relationship and confirm 45° is optimal on flat ground.",
    parameterExplanations: {
      launch_speed:
        "Initial speed in m/s at the moment of release. Range scales as v₀² so doubling launch speed roughly quadruples the distance traveled, while doubling the time of flight.",
      launch_angle:
        "Angle above horizontal in degrees. With no air resistance and equal launch and landing heights, 45° gives maximum range; angles equidistant from 45° (e.g., 30° and 60°) give equal range but very different trajectories.",
      air_resistance:
        "Drag coefficient from 0 (vacuum) to 1 (heavy drag). Drag breaks the parabolic symmetry: range shortens, the optimal angle drops below 45°, and the descending leg becomes steeper than the ascending one.",
      height:
        "Launch height above the ground in meters. Adding launch height extends time of flight and shifts the optimal launch angle below 45° even without air resistance, since the projectile gets free extra airtime on the way down.",
    },
    misconceptions: [
      {
        wrong:
          "Two projectiles launched at the same speed always land the same distance away, no matter what angle.",
        correct:
          "Range depends on angle through R = v₀² sin(2θ)/g. The 30° launch and the 60° launch share the same range (because sin 60° = sin 120°), but a 10° launch travels much less than a 45° launch even with identical speed. Angle matters as much as speed.",
      },
      {
        wrong:
          "If I plot horizontal position versus time, I should get a curve because the projectile is in flight.",
        correct:
          "Without air resistance, horizontal position grows linearly with time — the x-versus-t plot is a straight line, not a curve. Curvature shows up only in the y-versus-t plot, because gravity acts only vertically. This is the key insight of independent x and y components.",
      },
      {
        wrong:
          "A heavier ball thrown horizontally lands sooner because it falls faster.",
        correct:
          "Without air resistance, vertical fall time depends only on launch height and g, not mass. A bowling ball and a baseball released horizontally at the same height hit the ground simultaneously. With drag, lighter objects can fall slower because drag becomes proportionally stronger compared to weight.",
      },
      {
        wrong:
          "With air resistance, you can still use the no-drag formulas; they just give answers that are slightly off.",
        correct:
          "With significant air resistance, the no-drag formulas can be off by 50% or more for fast/light projectiles, the trajectory is no longer a parabola, and the optimal angle shifts well below 45°. Real ballistics calculations must integrate the drag term numerically; you cannot just patch the no-drag answer.",
      },
    ],
    teacherUseCases: [
      "Range vs. angle data set: at fixed launch speed = 20 m/s, have students record range at angles from 10° to 80° in 10° steps, plot range versus angle, and fit a sin(2θ) curve. Discover the 45° maximum and the symmetry around it from data, not from a formula.",
      "Reverse-engineering lab: hide the launch speed and angle from students, give them only the (x, t) and (y, t) data table, and challenge them to extract v₀ and θ. The slope of x vs. t gives v_x; quadratic fit of y vs. t gives v_y; combine to recover speed and angle.",
      "Misconception probe — 'are 30° and 60° equivalent?': fire both at the same speed and have students predict the ranges. Most expect 60° to go farther because 'higher angle equals farther'; the data shows them equal.",
      "Air-resistance investigation: at fixed v₀ = 25 m/s, do an angle sweep with air_resistance = 0 and again with air_resistance = 0.5. Have students find the optimal angle in each case and explain why drag pushes the optimum below 45°.",
      "Graph-fitting practice: have students fit a parabola y = at² + bt + c to the y-vs-t data, then identify a = -g/2, b = v₀ sin θ, and c = launch height. Compare fitted g to 9.8 m/s² as a self-check on data quality.",
    ],
    faq: [
      {
        question: "Why is the horizontal-position-versus-time graph a straight line, but the vertical one is a parabola?",
        answer:
          "Horizontal motion has no force on it (ignoring air resistance), so velocity stays constant and position grows linearly: x = v₀ cos θ × t. Vertical motion has gravity pulling down at a constant 9.8 m/s², so vertical velocity changes linearly with time and vertical position changes quadratically: y = v₀ sin θ × t − (1/2)g t². Same projectile, two completely different graph shapes — that's the heart of why we treat x and y as independent components.",
      },
      {
        question: "How can I extract the gravitational acceleration g from y-versus-t data?",
        answer:
          "Fit a parabola y = at² + bt + c to your (t, y) data points (most spreadsheet tools have a polynomial-fit option). The coefficient a equals −g/2, so g = −2a. If your data is good, you should recover g ≈ 9.8 m/s² to within a few percent. This is one of the cleanest ways to measure g experimentally — much more sensitive than dropping a single object once and timing it with a stopwatch.",
      },
      {
        question: "Why does air resistance push the optimal launch angle below 45°?",
        answer:
          "Air resistance decelerates the projectile horizontally throughout flight, so spending more time airborne actually costs you horizontal distance. A lower launch angle stays airborne for less time but moves through the air faster, where drag has less cumulative effect. Real-world examples confirm this: shot put release angles are 37–42°, javelin around 33°, baseball home-run swings around 25–30°. Pure 45° optimization only works in vacuum.",
      },
      {
        question: "Why do two launch angles (like 30° and 60°) give the same range?",
        answer:
          "Range on flat ground is R = v₀² sin(2θ)/g. The sin(2θ) function gives the same value for any two angles that sum to 90°: sin 60° = sin 120°, both equal √3/2. So 30° and 60°, or 20° and 70°, share the same range with identical launch speed. The trajectories look very different — the 60° launch arcs much higher and stays airborne much longer — but they hit the ground at the same horizontal distance.",
      },
      {
        question: "How does this lab satisfy AP Physics 1 standards 3.A.1, 3.E.1, and SP-5.A?",
        answer:
          "Standard 3.A.1 is about identifying forces — here gravity is the only force on the projectile (ignoring drag). Standard 3.E.1 covers work and energy: students can verify that mechanical energy is conserved between launch and apex by checking (1/2)mv₀² = (1/2)mv_x² + mgy_max. SP-5.A is the AP Science Practice that requires analyzing data with appropriate fitting techniques — exactly what graph-fitting (x, t) and (y, t) data demands. NGSS HS-PS2-1 also fits, since the projectile is a constant-net-force system whose motion you predict and verify with Newton's second law.",
      },
    ],
  },
};
