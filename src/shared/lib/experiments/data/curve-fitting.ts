import type { Experiment } from "@/shared/types/experiment";

export const curveFitting: Experiment = {
  id: "curve-fitting",
  slug: "curve-fitting-data-analysis",
  title: "Curve Fitting",
  subtitle: "Fit equations to data and analyze residuals",
  description:
    "Plot experimental data points and fit them with linear, quadratic, cubic, or sinusoidal curves. Evaluate fit quality with residual analysis and R² values, building core data analysis skills.",
  thumbnail: "/imgs/experiments/kinematics-graphs.png",

  standards: {
    ngss: [],
    gcse: [],
    ap: ["SP-5.A", "SP-5.B"],
  },
  primaryStandard: "general",
  category: "mechanics",
  subject: "math",
  gradeLevel: "9-12",
  tags: ["curve fitting", "data analysis", "linear regression", "R-squared", "residuals", "statistics"],
  difficulty: "intermediate",

  parameters: [
    { id: "fit_type", label: "Fit Type", unit: "", min: 0, max: 4, default: 0, step: 1, tier: "free" },
    { id: "data_noise", label: "Data Noise", unit: "%", min: 0, max: 50, default: 10, step: 1, tier: "free" },
    { id: "num_points", label: "Data Points", unit: "", min: 5, max: 50, default: 15, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "R^2 = 1 - \\frac{SS_{res}}{SS_{tot}}", description: "Coefficient of determination" },
    { latex: "y = mx + b", description: "Linear fit" },
    { latex: "y = ax^2 + bx + c", description: "Quadratic fit" },
  ],

  theory:
    "Curve fitting finds mathematical functions that best match experimental data. The quality of fit is measured by R², which ranges from 0 (no fit) to 1 (perfect fit). Residuals (differences between data and fit) should be randomly distributed for a good model. Choosing the right functional form requires understanding the underlying physics or phenomenon.",
  instructions:
    "Click to add data points or load a preset dataset. Select a fit type and observe how the curve adjusts. Check residual plot for systematic patterns. Higher R² means a better fit, but more parameters always improve R² — use physical intuition.",
  challenges: [
    { id: "cf-c1", question: "A set of (x, y) data falls perfectly on y=3x+2. What R² should you expect from a linear fit?", hint: "A perfect linear fit gives R² = 1.0", tier: "free" },
    { id: "cf-c2", question: "Why is a quadratic fit always at least as good as a linear fit for the same data?", hint: "More parameters = more flexibility; set a=0 to reduce to linear", tier: "free" },
    { id: "cf-c3", question: "Your residuals form a sinusoidal pattern. What does this suggest about your model?", hint: "Systematic residuals mean the model is missing a periodic component", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["calculus-grapher", "kinematics-graphs", "plinko-probability"],

  seoTitle: "Curve Fitting — Data Analysis Simulation | Math & Physics Lab",
  seoKeywords: ["curve fitting", "linear regression", "R-squared", "data analysis", "residuals", "math simulation"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Curve Fitting, Data Analysis, Linear Regression" },
};
