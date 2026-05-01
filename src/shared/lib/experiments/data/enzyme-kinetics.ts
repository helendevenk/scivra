import type { Experiment } from "@/shared/types/experiment";

export const enzymeKinetics: Experiment = {
  id: "enzyme-kinetics",
  slug: "enzyme-kinetics",
  title: "Enzyme Kinetics & Michaelis-Menten",
  subtitle: "How enzymes speed up reactions",
  description:
    "Explore the catalytic cycle of enzymes at the molecular level. Watch substrate molecules bind to the active site, form enzyme-substrate complexes, and release products. Plot real-time Michaelis-Menten and Lineweaver-Burk curves. Add competitive, non-competitive, or uncompetitive inhibitors and see Km and Vmax shift.",
  thumbnail: "/imgs/experiments/enzyme-kinetics.png",

  standards: {
    ngss: ["HS-LS1-6", "HS-LS1-7"],
    gcse: ["B2.5", "B2.6"],
    ap: ["2.A.3", "4.A.1"],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: ["enzyme kinetics", "Michaelis-Menten", "inhibition", "active site", "Km Vmax", "AP Biology"],
  difficulty: "advanced",

  parameters: [
    {
      id: "substrateConc",
      label: "Substrate Concentration [S]",
      unit: "mM",
      min: 0.1,
      max: 50,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "km",
      label: "Michaelis Constant (Km)",
      unit: "mM",
      min: 0.5,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "vmax",
      label: "Maximum Velocity (Vmax)",
      unit: "μmol/min",
      min: 10,
      max: 100,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "inhibitorType",
      label: "Inhibitor Type (0=none, 1=competitive, 2=noncompetitive, 3=uncompetitive)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "v = \\frac{V_{\\max}[S]}{K_m + [S]}",
      description: "Michaelis-Menten equation: reaction rate as a function of substrate concentration",
    },
    {
      latex: "K_m = \\frac{k_{-1} + k_2}{k_1} \\approx \\frac{k_{-1}}{k_1}",
      description: "Km ≈ dissociation constant of ES complex (substrate affinity)",
    },
    {
      latex: "\\frac{1}{v} = \\frac{K_m}{V_{\\max}} \\cdot \\frac{1}{[S]} + \\frac{1}{V_{\\max}}",
      description: "Lineweaver-Burk double-reciprocal plot (x-intercept = -1/Km, y-intercept = 1/Vmax)",
    },
  ],

  theory:
    "Enzymes are biological catalysts that lower activation energy by forming a specific enzyme-substrate (ES) complex at the active site (lock-and-key or induced fit). The catalytic cycle: E + S ⇌ ES → E + P. The Michaelis-Menten model describes reaction rate (v) as a function of [S]: v = Vmax[S]/(Km + [S]). Km (Michaelis constant) is the [S] at half-Vmax — a measure of enzyme-substrate affinity (lower Km = higher affinity). Competitive inhibitors increase apparent Km (compete with substrate for active site). Non-competitive inhibitors decrease Vmax (bind allosteric site, alter enzyme shape). Uncompetitive inhibitors decrease both Km and Vmax (bind ES complex only). Temperature and pH also affect enzyme activity by denaturing the protein.",

  instructions:
    "Set substrate concentration and watch the real-time velocity curve build against the Michaelis-Menten plot. Identify Km (at ½Vmax) and Vmax on the graph. Switch to Lineweaver-Burk view to linearize the data. Add inhibitors (Pro) one at a time and observe how the curves change — predict the inhibitor type from graph patterns.",

  challenges: [
    {
      id: "ek-c1",
      question: "An enzyme has Km = 4 mM and Vmax = 80 μmol/min. What is the reaction rate when [S] = 4 mM?",
      hint: "v = Vmax[S]/(Km+[S]) = 80×4/(4+4) = 320/8 = 40 μmol/min (= Vmax/2, as expected at Km).",
      tier: "free",
    },
    {
      id: "ek-c2",
      question: "Enzyme A has Km = 2 mM and Enzyme B has Km = 10 mM. Which has higher substrate affinity?",
      hint: "Lower Km = higher affinity. Enzyme A (Km = 2 mM) has higher substrate affinity.",
      tier: "free",
    },
    {
      id: "ek-c3",
      question: "On a Lineweaver-Burk plot, a competitive inhibitor shifts the x-intercept but not the y-intercept. What does this mean for Km and Vmax?",
      hint: "x-intercept = -1/Km → shifts means Km increases (apparent). y-intercept = 1/Vmax → unchanged means Vmax unchanged. Competitive: ↑Km, same Vmax.",
      tier: "free",
    },
    {
      id: "ek-c4",
      question: "Aspirin (acetylsalicylic acid) irreversibly acetylates the active site of COX-2 enzyme. Is this competitive or non-competitive inhibition? How does it affect Vmax?",
      hint: "Irreversible modification of active site = irreversible competitive-like (covalent). Available enzyme is permanently reduced → apparent Vmax decreases (fewer functional enzyme molecules). Some classify this as mechanism-based inhibition.",
      tier: "pro",
    },
  ],

  wave: 3,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["cellular-respiration", "photosynthesis"],

  seoTitle: "Enzyme Kinetics Michaelis-Menten Interactive | Scivra AP Biology",
  seoKeywords: [
    "enzyme kinetics simulation",
    "Michaelis-Menten interactive",
    "Lineweaver-Burk plot",
    "enzyme inhibition",
    "AP Biology enzymes",
    "Km Vmax calculator",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Enzyme Kinetics and the Michaelis-Menten Model",
  },
  contentSections: {
    whatIsIt:
      "Enzyme kinetics describes how fast enzymes catalyze reactions and what factors control that speed. Enzymes are protein catalysts that lower the activation energy of reactions by binding substrates at a specialized pocket called the active site, forming an enzyme-substrate (ES) complex. The Michaelis-Menten equation quantifies this: v = Vmax[S]/(Km + [S]), where Vmax is the maximum rate when all enzyme active sites are occupied, and Km is the substrate concentration that achieves half that maximum speed. A low Km means the enzyme reaches half-Vmax at a low substrate concentration — a sign of high affinity. In the simulation you control substrate concentration, Km, Vmax, and inhibitor type, watching the reaction velocity curve build in real time against the Michaelis-Menten and Lineweaver-Burk plots.",
    parameterExplanations: {
      substrateConc:
        "The concentration of substrate molecules in the reaction vessel, in millimolar (mM), from 0.1 to 50 mM. Increasing [S] raises reaction velocity (v) following the hyperbolic Michaelis-Menten curve until it asymptotes toward Vmax. The point on the curve where [S] = Km is where v = Vmax/2, which is a key landmark on both the standard and Lineweaver-Burk plots.",
      km:
        "The Michaelis constant in mM — the substrate concentration at which reaction velocity equals exactly half of Vmax. Km reflects enzyme-substrate affinity: an enzyme with Km = 1 mM reaches half its maximum rate at far lower substrate than one with Km = 15 mM. Adjusting Km in the simulation shifts the curvature of the Michaelis-Menten plot and the x-intercept on the Lineweaver-Burk plot.",
      vmax:
        "The maximum reaction velocity in μmol/min, achieved when all enzyme active sites are saturated with substrate. Vmax is set by the total enzyme concentration and the catalytic rate constant (kcat). Raising Vmax in the simulation lifts the plateau of the hyperbolic curve; inhibitors that reduce Vmax (noncompetitive, uncompetitive) compress that ceiling without necessarily shifting Km.",
      inhibitorType:
        "Selects the type of inhibition applied: 0 = none, 1 = competitive, 2 = noncompetitive, 3 = uncompetitive. Competitive inhibitors (type 1) bind the active site and raise apparent Km while leaving Vmax unchanged. Noncompetitive inhibitors (type 2) bind an allosteric site, lowering Vmax without changing Km. Uncompetitive inhibitors (type 3) bind only the ES complex, decreasing both Vmax and Km simultaneously.",
    },
    misconceptions: [
      {
        wrong:
          "Enzymes are consumed by the reactions they catalyze and must be replenished.",
        correct:
          "Enzymes are catalysts — they emerge from each reaction cycle unchanged and ready to bind another substrate molecule. A single enzyme molecule can process thousands of substrate molecules per second. This is why cells need only small amounts of enzyme relative to substrate.",
      },
      {
        wrong:
          "A higher Km means the enzyme works better because it can handle more substrate.",
        correct:
          "Higher Km means lower affinity — the enzyme needs more substrate to reach half its maximum rate. A lower Km is the mark of a high-affinity enzyme that operates efficiently even at low substrate concentrations. Km is an inverse proxy for affinity, not a measure of capacity.",
      },
      {
        wrong:
          "Competitive inhibition permanently blocks the enzyme by occupying the active site.",
        correct:
          "Competitive inhibition is reversible in the classical sense: inhibitor and substrate compete for the same site, so adding more substrate can outcompete the inhibitor and restore velocity toward Vmax. The apparent Km rises (more substrate needed to reach half-Vmax), but Vmax itself is unchanged. Irreversible inhibitors like nerve agents or aspirin's COX modification are a different mechanism.",
      },
      {
        wrong:
          "Temperature always increases enzyme activity — hotter is always faster.",
        correct:
          "Up to the optimal temperature (~37°C for most human enzymes), increasing temperature speeds catalysis. Beyond the optimum, heat disrupts the non-covalent bonds that maintain the active site's shape, denaturing the enzyme and causing activity to drop rapidly toward zero. The Michaelis-Menten equation captures rate at a fixed optimal temperature.",
      },
      {
        wrong:
          "All inhibitors reduce Vmax on a Michaelis-Menten plot.",
        correct:
          "Only noncompetitive and uncompetitive inhibitors lower Vmax. Competitive inhibitors leave Vmax identical — they only shift the apparent Km. On a Lineweaver-Burk plot, a competitive inhibitor rotates the line around the y-intercept (unchanged 1/Vmax). A pure noncompetitive inhibitor pivots the line steeper around the same x-intercept (unchanged Km, higher 1/Vmax). Uncompetitive inhibitors shift the line upward in parallel to the original (decreased Km AND decreased Vmax).",
      },
    ],
    teacherUseCases: [
      "Km as affinity probe: have students set Vmax = 50 μmol/min and vary Km from 1 mM to 15 mM. Record the [S] needed to reach 80% of Vmax at each Km and plot the relationship. Use this to solidify that Km is an inverse affinity measure, addressing AP Bio 2.A.3.",
      "Inhibitor type identification challenge: set substrate concentration to 10 mM, apply each inhibitor type one at a time, and ask students to identify the inhibitor from the Lineweaver-Burk pattern alone — before telling them the type. This practices AP exam graph-interpretation questions.",
      "Data collection from Lineweaver-Burk: have students read x-intercept (−1/Km) and y-intercept (1/Vmax) off the Lineweaver-Burk plot, calculate Km and Vmax, and check against the parameter sliders. Connects to how real biochemists determined these constants before computerized fitting.",
      "Real-world inhibitor case study: after the competitive inhibitor demo, assign students to research one clinically relevant competitive inhibitor (statins competing with HMG-CoA reductase; methotrexate competing with dihydrofolate reductase) and explain which slider combination matches the drug's mechanism.",
      "Misconception probe on consumption: pause the simulation after a substrate binds and releases product. Ask 'Is this enzyme molecule destroyed?' Students who answer yes need to trace what happens to the enzyme in the next animation frame — it immediately accepts a new substrate molecule.",
    ],
    faq: [
      {
        question: "What does Km actually measure in biological terms?",
        answer:
          "Km is approximately equal to the dissociation constant of the enzyme-substrate complex (Kd = k₋₁/k₁). It represents the substrate concentration at which half the enzyme molecules are occupied. A Km of 2 mM means you need 2 mM substrate to fill 50% of active sites; a Km of 0.05 mM means the enzyme is half-saturated at far lower concentrations — indicating stronger substrate binding.",
      },
      {
        question: "Why does competitive inhibition not change Vmax?",
        answer:
          "A competitive inhibitor only blocks access to the active site — it does not alter the enzyme's catalytic ability once substrate is bound. At saturating substrate concentrations, substrate vastly outnumbers inhibitor and essentially all active sites are occupied by substrate. The enzyme reaches the same maximum rate, just requiring more substrate to get there, which is why apparent Km rises but Vmax is unchanged.",
      },
      {
        question: "What AP Biology standards does enzyme kinetics address?",
        answer:
          "Enzyme kinetics directly covers AP Bio 2.A.3 (enzymes and the mechanisms of enzyme activity) and 4.A.1 (the subcomponents of biological molecules affect their function). Students should be able to interpret Michaelis-Menten and Lineweaver-Burk plots, predict the effect of each inhibitor type on Km and Vmax, and connect enzyme function to NGSS HS-LS1-6 and HS-LS1-7.",
      },
      {
        question: "What is the difference between competitive and uncompetitive inhibition?",
        answer:
          "Competitive inhibitors bind only free enzyme (at the active site), raising apparent Km while Vmax stays the same. Uncompetitive inhibitors bind only the enzyme-substrate complex at a separate allosteric site, locking the complex so product cannot be released — this lowers both Km and Vmax. On a Lineweaver-Burk plot, uncompetitive inhibition shifts the line up and to the left in parallel to the uninhibited line.",
      },
      {
        question: "How do I find Km from the simulation graph?",
        answer:
          "Locate Vmax on the plateau of the Michaelis-Menten curve, calculate half that value, then find the substrate concentration on the x-axis where v = Vmax/2. That x-value is Km. Alternatively, on the Lineweaver-Burk (double-reciprocal) view, Km = −(1/x-intercept): read the x-intercept, take its negative reciprocal, and the result is Km in mM.",
      },
    ],
  },
};
