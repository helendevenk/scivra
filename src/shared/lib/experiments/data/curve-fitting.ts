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

  contentSections: {
    whatIsIt:
      "Curve Fitting is the process of finding a mathematical function that best represents a set of measured data points. In science and engineering, real-world measurements are always scattered — a ball dropped from a height does not follow a textbook parabola exactly because of air resistance, timing errors, and measurement noise. Curve fitting lets you cut through that scatter to reveal the underlying relationship. This simulation lets you plot data points, choose a model type (linear, quadratic, cubic, or sinusoidal), and observe how the algorithm adjusts the model's coefficients to minimize the sum of squared residuals — the vertical gaps between each data point and the fitted curve. The quality of fit is summarized by R², the coefficient of determination, which ranges from 0 (the model explains nothing) to 1 (perfect fit). Alongside R², inspecting the residual plot — a graph of those vertical gaps — reveals whether the model captures the true structure of the data or whether a systematic pattern remains. These skills transfer directly to lab reports, AP exam free-response questions, and real scientific practice.",
    parameterExplanations: {
      fit_type:
        "Selects the type of mathematical model applied to the data (integer index 0 through 4, corresponding to models such as linear y = mx + b, quadratic y = ax² + bx + c, cubic, and sinusoidal). Choosing the right model requires understanding what physical or mathematical relationship you expect in the data — fitting a quadratic to genuinely linear data will often improve R² slightly but wastes a parameter and may produce misleading predictions outside the measured range.",
      data_noise:
        "Sets the magnitude of random scatter added to the data points, from 0% (perfectly noiseless, on-curve data) to 50% (heavily scattered). Real experimental data typically falls somewhere in between. Higher noise makes it harder to distinguish a good fit from a mediocre one using R² alone, and it makes the residual plot more important for diagnosing whether the chosen model is appropriate.",
      num_points:
        "Controls how many data points are plotted, from 5 to 50 (default 15). Fewer points make individual outliers more influential and R² less reliable. More points give the fitting algorithm more information, typically producing a more stable and trustworthy estimate of the model parameters. This parameter is available in the pro tier and illustrates why scientists collect multiple trials rather than relying on a single measurement.",
    },
    misconceptions: [
      {
        wrong:
          "A high R² value means the model is correct and will make good predictions.",
        correct:
          "R² measures how much variance in the data the model explains within the range of measured points. It does not guarantee the model is physically correct, does not protect against overfitting with unnecessary parameters, and says nothing about how well the model predicts outside the measured range (extrapolation). A cubic polynomial often achieves R² > 0.99 on noisy data that is genuinely linear simply because extra parameters absorb random scatter.",
      },
      {
        wrong:
          "Correlation between two variables means one causes the other.",
        correct:
          "A high R² or strong correlation tells you two variables move together in the data — it says nothing about why. Ice cream sales and drowning rates are historically correlated because both rise in summer; neither causes the other. Establishing causation requires controlled experiments, not just correlation. The residual plot and R² describe the mathematical relationship in the data, not the physical mechanism.",
      },
      {
        wrong:
          "Adding more parameters (higher polynomial degree) always gives a better model.",
        correct:
          "More parameters always improve R² on the training data — a degree-n polynomial can pass through n+1 points exactly. But overfitting produces a curve that wiggles through the noise rather than capturing the real trend, and its predictions between or beyond the measured points can be wildly wrong. Good model selection balances fit quality against model complexity, often using physical reasoning to decide how many parameters are justified.",
      },
      {
        wrong:
          "Randomly scattered residuals mean the fit is bad.",
        correct:
          "Randomly scattered residuals are actually the hallmark of a good fit. They indicate that the model has captured the systematic trend in the data and that what remains is unpredictable measurement noise. The warning sign is systematic residuals — a U-shape, a sinusoidal wave, or a diagonal drift — which tells you the model is missing a real structural feature of the data.",
      },
    ],
    teacherUseCases: [
      "Linear vs. quadratic comparison: set fit_type to linear (index 0), data_noise to 10%, num_points to 15 and record R². Then switch fit_type to quadratic and record R² again. Students calculate the gain and debate whether the improvement justifies the extra parameter, practicing the principle of parsimony (Occam's Razor) in model selection.",
      "Noise sensitivity investigation: fix fit_type to linear and num_points to 20. Sweep data_noise from 0% to 10% to 30% to 50%, recording R² at each level. Students plot noise vs. R² and observe how scatter degrades fit quality, building intuition about why repeated trials and careful measurement technique matter in real experiments.",
      "Residual pattern diagnosis: set fit_type to linear but use a dataset generated from a quadratic relationship (set noise low). Students observe the U-shaped residual pattern and diagnose that a linear model is missing a quadratic term — then switch to quadratic and watch residuals randomize. Teaches the residual plot as a diagnostic tool, not just R².",
      "Sample size and stability: fix fit_type to linear and data_noise to 20%. Compare num_points at 5 vs. 15 vs. 40 by noting how much the fitted line shifts between runs. Students recognize that small samples produce unreliable parameter estimates, connecting to the statistical concept of standard error and why scientists replicate measurements.",
      "Sinusoidal fit for periodic data: switch fit_type to sinusoidal and increase data_noise to 15%. Ask students to predict what R² they expect when the underlying data was generated with periodic structure. Compare to a linear fit on the same data. This demonstrates that model choice matters as much as parameter tuning, and connects to Fourier analysis concepts in physics.",
    ],
    faq: [
      {
        question: "What exactly does R² measure?",
        answer:
          "R² (the coefficient of determination) measures the proportion of total variance in the dependent variable (y) that is explained by the fitted model. An R² of 0.85 means the model accounts for 85% of the variability in y; the remaining 15% is unexplained — attributable to noise, measurement error, or missing variables. Technically, R² = 1 minus the ratio of residual sum of squares to total sum of squares. A perfect fit gives R² = 1.0; a model no better than a horizontal line through the mean gives R² = 0.",
      },
      {
        question: "What is a residual and why does its distribution matter?",
        answer:
          "A residual is the vertical distance between a measured data point and the corresponding point on the fitted curve. If the model is correct, residuals should be small and randomly scattered around zero with no discernible pattern. A systematic pattern — a curve, a slope, or a wave — in the residual plot is strong evidence that the chosen model type is wrong for the data. Checking residuals is often more informative than checking R² alone, because R² can be high even when the model is structurally wrong.",
      },
      {
        question: "Why does adding more data points typically improve the fit quality?",
        answer:
          "More data points give the fitting algorithm more information to work with, reducing the influence of any single outlier and producing more stable, reliable estimates of the model parameters. With only 5 points, one misplaced measurement can dramatically shift the fitted line. With 40 points, the fit averages over many measurements and converges closer to the true underlying relationship. This is why increasing num_points typically narrows the uncertainty in fitted parameters.",
      },
      {
        question: "Can I use a linear fit for data that looks slightly curved?",
        answer:
          "You can, but you should check the residual plot carefully. If the residuals show a systematic U-shape or arch pattern, a linear model is inadequate — a quadratic or higher-degree polynomial would be more appropriate. However, if the curvature is slight and your theoretical model predicts a linear relationship, consider whether the apparent curve could be due to noise rather than a real nonlinear effect. Physical reasoning about the expected relationship should guide model selection, not just R².",
      },
      {
        question: "How is sinusoidal curve fitting different from polynomial fitting?",
        answer:
          "Polynomial fits (linear, quadratic, cubic) are suited for data that increases, decreases, or has a single arch shape over the measured range. Sinusoidal fits are appropriate when the data oscillates — repeating peaks and troughs — such as temperature over a day, tidal heights, or AC voltage. The sinusoidal model fits amplitude, frequency, and phase. It would be inappropriate to apply a sinusoidal fit to data that simply increases monotonically, and vice versa — model choice should always reflect the physical process generating the data.",
      },
    ],
  },
};
