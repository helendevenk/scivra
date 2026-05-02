import type { Experiment } from "@/shared/types/experiment";

export const calculusGrapher: Experiment = {
  id: "calculus-grapher",
  slug: "calculus-grapher-derivatives-integrals",
  title: "Calculus Grapher",
  subtitle: "Visualize derivatives and integrals graphically",
  description:
    "Draw any function and instantly see its derivative and integral curves. Explore how slopes relate to the original function and how area accumulates under the curve.",
  thumbnail: "/imgs/experiments/kinematics-graphs.png",

  standards: {
    ngss: [],
    gcse: [],
    ap: ["CHA-4.A", "CHA-4.B"],
  },
  primaryStandard: "general",
  category: "mechanics",
  subject: "math",
  gradeLevel: "9-12",
  tags: ["calculus", "derivative", "integral", "slope", "area under curve", "functions"],
  difficulty: "intermediate",

  parameters: [
    { id: "function_type", label: "Function Type", unit: "", min: 0, max: 5, default: 0, step: 1, tier: "free" },
    { id: "amplitude", label: "Amplitude", unit: "", min: -5, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "frequency", label: "Frequency", unit: "", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
  ],

  formulas: [
    { latex: "f'(x) = \\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}", description: "Definition of derivative" },
    { latex: "\\int_a^b f(x)\\,dx", description: "Definite integral (area)" },
    { latex: "\\frac{d}{dx}[\\sin x] = \\cos x", description: "Example derivative" },
  ],

  theory:
    "The derivative of a function gives the instantaneous rate of change — the slope of the tangent line at each point. The integral gives the accumulated area under the curve. The Fundamental Theorem of Calculus connects them: differentiation and integration are inverse operations. These concepts underlie all of physics, from velocity/acceleration to electric flux.",
  instructions:
    "Select a preset function or draw your own. The derivative curve (blue) shows slope; the integral curve (green) shows accumulated area. Drag the x-position marker to read exact values. Observe how a peak in f becomes a zero in f'.",
  challenges: [
    { id: "cg-c1", question: "Where is the derivative of sin(x) equal to zero?", hint: "Derivative is zero where the original function has a maximum or minimum", tier: "free" },
    { id: "cg-c2", question: "What is the shape of the integral of a constant function?", hint: "Accumulating a constant rate gives a linear increase", tier: "free" },
    { id: "cg-c3", question: "Sketch a function whose derivative is always positive but decreasing.", hint: "Increasing but at a slowing rate — like a logarithm", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["curve-fitting", "kinematics-graphs"],

  seoTitle: "Calculus Grapher — Derivatives and Integrals Visualization | Math Simulation",
  seoKeywords: ["calculus", "derivative", "integral", "graphing", "slope", "area under curve", "math simulation"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Derivatives, Integrals, Calculus" },

  contentSections: {
    whatIsIt:
      "The Calculus Grapher lets you explore the two foundational operations of calculus — differentiation and integration — by drawing or selecting a function and watching its derivative and integral curves update in real time. The derivative of a function f(x) gives the instantaneous rate of change at every point: geometrically, it is the slope of the tangent line drawn to the curve. Where f rises steeply, f' is large and positive; for smooth local maxima or minima, f' is zero and often changes sign; where f falls, f' is negative. The integral of f(x) represents accumulated area under the curve — adding up infinitely thin slices from a starting point to x. The Fundamental Theorem of Calculus (FTC) links these two ideas: if F(x)=∫_a^x f(t)dt, then F'(x)=f(x). Antiderivatives of f differ by an additive constant. This relationship is not just symbolic — you can see it visually when the slope of the green integral curve at any x equals the height of the original function. These ideas underlie velocity, acceleration, electric flux, and virtually every quantitative model in science and engineering.",
    parameterExplanations: {
      function_type:
        "Selects the preset function category displayed on the graph (integer index 0 through 5, corresponding to options such as sine, polynomial, step, and others). Each preset has a distinct derivative and integral shape, making it easy to compare how different function families behave under calculus operations.",
      amplitude:
        "Scales the vertical height of the function, adjustable from -5 to 5 (default 1). Increasing amplitude stretches the curve taller; decreasing it compresses it. Because differentiation is a linear operation, multiplying f by a constant k multiplies f' by the same k — you can observe this proportional scaling directly in the derivative curve.",
      frequency:
        "Controls how rapidly the function oscillates or changes horizontally, from 0.1 to 5 (default 1). Higher frequency compresses the waveform horizontally. For a sine function, doubling the frequency doubles the derivative's amplitude as well, illustrating the chain-rule relationship d/dx[sin(nx)] = n·cos(nx).",
    },
    misconceptions: [
      {
        wrong:
          "The derivative of f(x)² is 2f(x).",
        correct:
          "This confuses the power rule with the chain rule. The power rule d/dx[x²] = 2x applies when the base is the independent variable. For a composite function like [f(x)]², the chain rule gives d/dx[f(x)²] = 2·f(x)·f'(x) — you must multiply by the derivative of the inner function f(x). In the grapher, observe that scaling amplitude changes the derivative proportionally, not by squaring.",
      },
      {
        wrong:
          "Integration exactly undoes differentiation with no caveats.",
        correct:
          "Integration is the inverse of differentiation, but only up to an arbitrary constant of integration C. When you differentiate any constant, it disappears — so the antiderivative of f'(x) is f(x) + C, not a unique function. In this simulation the integral curve is anchored at a specific starting value; different starting points shift the curve vertically without changing its shape.",
      },
      {
        wrong:
          "A function's derivative is zero everywhere the function is zero.",
        correct:
          "The derivative is zero where the function has a local maximum or minimum (a horizontal tangent), not where the function's value is zero. For example, sin(x) is zero at x = 0 and x = π, but its derivative cos(x) is zero at x = π/2. Watch the simulation: the blue derivative curve crosses zero at the peaks and troughs of the original, not where it crosses the x-axis.",
      },
      {
        wrong:
          "A positive derivative means the function is concave up.",
        correct:
          "A positive derivative means the function is increasing — sloping upward. Concavity is determined by the second derivative (the derivative of the derivative). A function can be increasing and concave down at the same time, like the left half of an inverted parabola. In the grapher, look at the slope of the derivative curve itself to assess concavity of the original.",
      },
      {
        wrong:
          "Increasing the frequency of a sine function does not change its derivative's amplitude.",
        correct:
          "It does. By the chain rule, d/dx[sin(ωx)] = ω·cos(ωx). Higher frequency (larger ω) makes the derivative oscillate with greater amplitude, even if the original sine's amplitude is unchanged. You can verify this in the simulation by raising the frequency parameter and observing the derivative curve grow taller.",
      },
    ],
    teacherUseCases: [
      "Peak-to-zero demonstration: set function_type to sine (index 0), amplitude to 1, frequency to 1. Ask students to predict where the derivative curve will cross zero before revealing it. Confirm that every peak and trough of sin(x) aligns with a zero crossing of cos(x). This builds the geometric intuition for critical points before introducing the first-derivative test algebraically.",
      "Amplitude scaling law: keep frequency at 1 and vary amplitude from 1 to 3 to 5. Students record the peak value of the derivative each time and plot amplitude vs. derivative peak. They should observe a linear relationship, confirming that d/dx[k·f(x)] = k·f'(x) — differentiation distributes over scalar multiplication.",
      "Frequency and chain rule: fix amplitude at 1 and step frequency from 1 to 2 to 3. Students measure the derivative amplitude each time. The result (1, 2, 3) illustrates the chain-rule coefficient before students encounter the formal notation d/dx[sin(nx)] = n·cos(nx). Works as a pre-lesson hook before teaching the chain rule.",
      "FTC visual proof: switch to a simple positive constant or linear function, set amplitude to 2 and frequency to 0.5. Ask students to read the slope of the green integral curve at several x values and compare to the height of the original function. The match (within simulation precision) provides a visual, pre-algebraic argument for the Fundamental Theorem of Calculus.",
      "Connecting kinematics to calculus: frame function_type as position of a moving object (set amplitude to 3, frequency to 1). The derivative curve becomes velocity and the integral curve becomes displacement from a reference point. Students can see that a sinusoidal position gives a cosine velocity, linking physics and calculus without needing to solve equations.",
    ],
    faq: [
      {
        question: "Why does the derivative curve have the same shape as the original for a sine function?",
        answer:
          "The derivative of sin(x) is cos(x), which is just sin(x) shifted left by π/2 (90 degrees). Because sine and cosine have the same waveform shape — only their phase differs — the derivative appears visually similar but offset horizontally. This is a special property of sinusoidal functions and does not hold for other function families like polynomials or step functions.",
      },
      {
        question: "What does it mean geometrically when the derivative is negative?",
        answer:
          "A negative derivative at a point x means the original function is decreasing at that location — the tangent line slopes downward from left to right. In the simulation, regions where the original curve falls correspond exactly to regions where the blue derivative curve dips below zero. This geometric connection is one of the most important interpretations of the derivative in both mathematics and physics.",
      },
      {
        question: "How does the integral curve relate to the area under the original function?",
        answer:
          "The integral curve's value at each x equals the signed area accumulated under the original function from the simulation's reference point up to that x. Positive area (function above the x-axis) makes the integral curve rise; negative area (function below the x-axis) makes it fall. The total height gained or lost over any interval equals the net signed area of the original curve over that interval — a direct visual demonstration of the definite integral.",
      },
      {
        question: "Why does changing amplitude affect the derivative but not the integral's shape?",
        answer:
          "Both the derivative and integral scale proportionally with amplitude — doubling amplitude doubles the height of both the derivative and integral curves. However, the overall shape (the pattern of rises and falls) remains the same because differentiation and integration are both linear operations. What changes is the vertical scale, not the topology of the curve.",
      },
      {
        question: "What is the Fundamental Theorem of Calculus and can I see it in this simulation?",
        answer:
          "The Fundamental Theorem of Calculus (FTC) states that differentiation and integration are inverse operations: the derivative of the integral of f(x) gives back f(x). In the simulation, you can check this by observing that the slope of the green integral curve at any x point equals the height of the original function at that same x. This visual verification is one of the most compelling ways to build intuition for the FTC before encountering its formal proof.",
      },
      {
        question: "Can this simulation handle functions that are not smooth or continuous?",
        answer:
          "The simulation supports several preset function types including step-like functions. At a discontinuity or sharp corner, the derivative is technically undefined (or infinite), and the simulation typically displays a spike or gap in the derivative curve at those locations. This is mathematically correct behavior and provides a useful discussion point about differentiability vs. continuity for students ready to explore those distinctions.",
      },
    ],
  },
};
