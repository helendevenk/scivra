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
};
