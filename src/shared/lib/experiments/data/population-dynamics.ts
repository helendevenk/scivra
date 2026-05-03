import type { Experiment } from "@/shared/types/experiment";

export const populationDynamics: Experiment = {
  id: "population-dynamics",
  slug: "population-dynamics",
  title: "Population Dynamics",
  subtitle:
    "Lotka-Volterra predator-prey model and population oscillations",
  description:
    "Explore how predator and prey populations interact over time using the Lotka-Volterra equations. Adjust birth rates, death rates, and predation efficiency to observe population cycles, phase-plane trajectories, and equilibrium points. Investigate carrying capacity and competitive exclusion.",
  thumbnail: "/imgs/experiments/population-dynamics.png",

  standards: {
    ngss: ["HS-LS2-1", "HS-LS2-2"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: [
    "population dynamics",
    "Lotka-Volterra",
    "predator-prey",
    "ecology",
    "carrying capacity",
    "population oscillation",
    "AP Biology",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "alpha",
      label: "Prey Birth Rate α",
      unit: "",
      min: 0.1,
      max: 2,
      default: 0.8,
      step: 0.05,
      tier: "free",
    },
    {
      id: "beta",
      label: "Predation Rate β",
      unit: "",
      min: 0.01,
      max: 0.2,
      default: 0.05,
      step: 0.005,
      tier: "free",
    },
    {
      id: "delta",
      label: "Predator Efficiency δ",
      unit: "",
      min: 0.01,
      max: 0.1,
      default: 0.04,
      step: 0.005,
      tier: "free",
    },
    {
      id: "gamma",
      label: "Predator Death Rate γ",
      unit: "",
      min: 0.1,
      max: 1,
      default: 0.4,
      step: 0.05,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\frac{dx}{dt} = \\alpha x - \\beta x y",
      description:
        "Prey growth rate: prey increase by birth (αx) minus predation losses (βxy)",
    },
    {
      latex: "\\frac{dy}{dt} = \\delta x y - \\gamma y",
      description:
        "Predator growth rate: gain from prey consumption (δxy) minus natural death (γy)",
    },
    {
      latex:
        "\\bar{x} = \\frac{\\gamma}{\\delta}, \\quad \\bar{y} = \\frac{\\alpha}{\\beta}",
      description:
        "Equilibrium populations: prey = γ/δ, predator = α/β",
    },
  ],

  theory:
    "The Lotka-Volterra equations model the dynamics of biological systems with predator-prey interactions. The prey population x grows exponentially at rate α in the absence of predators, but is reduced by predation at rate βxy (proportional to encounters). The predator population y declines at rate γ without prey, but grows from successful predation at rate δxy. The system produces characteristic oscillations: prey increase → predators increase → prey decline → predators decline → cycle repeats. The amplitude and period depend on all four parameters. The equilibrium point (x̄ = γ/δ, ȳ = α/β) is a center in the phase plane — orbits are closed loops. Real ecosystems add complexity (carrying capacity, refugia, time delays) but the Lotka-Volterra model captures the fundamental mechanism of coupled oscillations.",

  instructions:
    "Use the four sliders — Prey Birth Rate α, Predation Rate β, Predator Efficiency δ, and Predator Death Rate γ — to test the Lotka-Volterra equations dx/dt = αx − βxy and dy/dt = δxy − γy. Try the Stable Oscillation, Prey Explosion, and Predator Collapse presets, then change one slider at a time to connect parameter changes with population cycles, phase-plane trajectories, and predator-prey lag.",

  challenges: [
    {
      id: "pop-c1",
      question:
        "What happens to oscillation amplitude when you increase the predation rate (β)?",
      hint: "Higher β increases the amplitude of oscillations and can lead to extinction if prey crash to near zero.",
      tier: "free",
    },
    {
      id: "pop-c2",
      question:
        "At equilibrium, prey population = γ/δ. If γ = 0.8 and δ = 0.02, what is the equilibrium prey count?",
      hint: "x̄ = 0.8/0.02 = 40 prey at equilibrium.",
      tier: "free",
    },
    {
      id: "pop-c3",
      question:
        "Why does the predator peak always lag behind the prey peak? Explain the biological mechanism.",
      hint: "Predators need time to reproduce after prey becomes abundant — birth response has a delay proportional to generation time.",
      tier: "pro",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["natural-selection", "immune-system"],
  htmlPath: "/experiments/ap-biology/population-dynamics.html",

  seoTitle: "Population Dynamics Simulator | Scivra AP Biology",
  seoKeywords: [
    "Lotka-Volterra simulation",
    "predator prey model",
    "population dynamics interactive",
    "ecology virtual lab",
    "AP Biology population",
    "carrying capacity simulator",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Population Dynamics and Lotka-Volterra Model",
  },
  htmlControlAliases: {
    alpha: "sl-alpha",
    beta: "sl-beta",
    delta: "sl-delta",
    gamma: "sl-gamma",
  },
  presets: [
    {
      id: "stable",
      label: "Stable Oscillation",
      description:
        "Balanced Lotka-Volterra parameters produce sustained predator-prey cycles around the equilibrium point.",
      paramValues: { alpha: 0.8, beta: 0.05, delta: 0.04, gamma: 0.4 },
    },
    {
      id: "explosion",
      label: "Prey Explosion",
      description:
        "A higher α value lets prey increase rapidly before predator response catches up, creating a larger population surge.",
      paramValues: { alpha: 1.5, beta: 0.05, delta: 0.04, gamma: 0.4 },
    },
    {
      id: "collapse",
      label: "Predator Collapse",
      description:
        "A lower α paired with stronger β creates intense predation pressure, pushing the system toward predator decline after prey scarcity.",
      paramValues: { alpha: 0.5, beta: 0.15, delta: 0.04, gamma: 0.4 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Predator and prey populations oscillate together in a pattern ecologists call coupled cycles: when rabbits are plentiful, lynx multiply; as lynx multiply, rabbit numbers fall; as rabbits fall, lynx starve and decline; and the cycle restarts. Alfred Lotka and Vito Volterra independently wrote differential equations in the 1920s that capture this coupling mathematically. The model uses four parameters — prey birth rate, predation rate, predator death rate, and conversion efficiency — to set the equilibrium populations and the cycle period; the amplitude of the orbit is set jointly by those parameters and by the initial populations. Real data from the Hudson Bay Company's lynx and snowshoe hare fur records (1845–1935) show roughly 10-year cycles that broadly match the model, though with considerable noise, disease outbreaks, and vegetation effects the equations don't capture. This simulation runs the Lotka-Volterra model so you can see how each parameter shifts the cycle.",
    parameterExplanations: {
      alpha:
        "Prey Birth Rate α represents how quickly the prey population can grow when predators are absent. In AP Biology ecology terms, it is similar to an intrinsic rate of increase for the prey population under ideal conditions. Raising α means prey recover faster after predation and can support more predators at equilibrium because the predator equilibrium is α/β. In HS-LS2-2 modeling, this slider helps students make a quantitative claim about how resource-level population growth changes the stability and size of interacting populations. Compare Stable Oscillation with Prey Explosion to see how higher prey reproduction changes cycle amplitude and timing.",
      beta:
        "Predation Rate β controls how strongly encounters between predators and prey reduce the prey population. The loss term βxy means the effect depends on both populations: many predators or many prey create more encounters. Increasing β usually makes prey decline faster after a prey peak, which can amplify oscillations and create sharp crashes. For AP Biology and HS-LS2-2, β is useful evidence for explaining how biotic interactions, not just abiotic resources, affect population size and community structure. Compare the Stable Oscillation and Predator Collapse presets, then change only β to isolate predation pressure from prey reproduction.",
      delta:
        "Predator Efficiency δ describes how effectively prey consumed through predation contribute to predator population growth. In the equation dy/dt = δxy − γy, δ links energy transfer across trophic levels to predator births. A higher δ means each predator-prey interaction supports more predator growth, lowering the prey equilibrium γ/δ because fewer prey are needed to sustain predators. This connects directly to AP Biology ecology concepts such as trophic transfer and population regulation. For HS-LS2-2, students can use δ to argue from a mathematical model about how energy flow and species interactions influence biodiversity and population stability.",
      gamma:
        "Predator Death Rate γ is the rate at which predators decline when prey are not available. It represents mortality, starvation pressure, or failure to reproduce without enough food. Increasing γ raises the prey equilibrium γ/δ, meaning the ecosystem needs more prey to maintain the predator population. In AP Biology, γ helps students connect consumer survival to resource availability and trophic dependence. In HS-LS2-2, it supports claims about how changing one population factor can shift the whole community. Keep α, β, and δ fixed while changing γ to see how predator vulnerability alters both the phase-plane center and the timing of cycles.",
    },
    misconceptions: [
      {
        wrong:
          "The Lotka-Volterra model predicts exactly how real predator-prey populations will behave — it's the equation ecologists use to manage wildlife.",
        correct:
          "Lotka-Volterra is a conceptual, idealized model that assumes unlimited prey growth, random encounters, and no carrying capacity. Real ecosystems have spatial refugia, seasonal variation, disease, and food-web complexity that the model ignores. Wildlife managers use more detailed stochastic and individual-based models; Lotka-Volterra is the starting framework, not the final tool.",
      },
      {
        wrong:
          "Predator populations peak at the same time as prey populations because predators eat more when prey is most abundant.",
        correct:
          "There is a characteristic quarter-cycle lag: predators peak after prey. When prey is at its peak, predators are still reproducing from the food surplus; by the time predators reach their peak, prey has already started declining from β-driven predation pressure. The phase-plane plot shows this as an orbit, not a point.",
      },
      {
        wrong:
          "If you remove all predators, the prey population will grow indefinitely to fill all available space.",
        correct:
          "In the basic Lotka-Volterra model, prey do grow exponentially without predators — which is one of its known limitations. In nature and in more realistic models, prey hit a carrying capacity set by food, space, and disease. The simulation uses the basic model; add the concept of logistic growth to explain why real prey populations don't grow forever.",
      },
      {
        wrong:
          "Higher Predator Efficiency δ means predators are better hunters, so prey populations crash faster immediately.",
        correct:
          "Predator Efficiency δ describes how much consumed prey supports new predator growth — it is an energy-transfer and reproduction parameter, not hunting behavior. A predator still needs encounters and successful kills at the rate controlled by β. Higher δ means each successful predation event can support more predator births, which can later increase predator pressure, but the immediate prey-loss term is controlled separately by β.",
      },
      {
        wrong:
          "The lynx-hare cycle from Hudson Bay data proves the Lotka-Volterra model is correct.",
        correct:
          "The lynx-hare data shows roughly 10-year cycles, consistent with the model's predictions, but the fit is imperfect and contested. Vegetation cycles, disease, and human trapping also drive hare numbers. The cycles are evidence that predator-prey coupling is real, not proof that the Lotka-Volterra equations are the complete explanation.",
      },
    ],
    teacherUseCases: [
      "Parameter sweep for equilibrium: have students calculate the theoretical equilibrium prey = γ/δ and predator = α/β for the Stable Oscillation preset (prey = 0.4/0.04 = 10, predator = 0.8/0.05 = 16), then compare the prediction with the phase-plane center — probes quantitative reasoning with the model equations.",
      "Preset comparison for HS-LS2-2: run Stable Oscillation, Prey Explosion, and Predator Collapse. Students record α, β, δ, and γ for each case, identify which parameter changed, and write a claim-evidence-reasoning response about how population interactions affect ecosystem stability.",
      "Predation-pressure investigation: start from Stable Oscillation and increase β toward 0.15 while keeping α = 0.8, δ = 0.04, and γ = 0.4. Students record whether prey crashes deepen and connect the evidence to the βxy interaction term — aligns with NGSS HS-LS2-2.",
      "Phase-plane interpretation exercise: use the three presets as anchor cases and ask students to explain why the trajectory loops around the equilibrium point instead of showing a single static balance. Students should cite α/β and γ/δ when explaining how the model sets predator and prey equilibrium values.",
      "Misconception probe — predator lag: run the Stable Oscillation preset and ask students to identify which population peaks first. Replay the cycle and have them explain the lag using the equations dx/dt = αx − βxy and dy/dt = δxy − γy, then compare how the lag changes under Prey Explosion and Predator Collapse.",
    ],
    faq: [
      {
        question: "Why do predator and prey populations oscillate instead of reaching a steady balance?",
        answer:
          "The Lotka-Volterra equations produce oscillations because prey and predator growth rates depend on each other's current size, creating a feedback loop with a built-in time delay. Mathematically, the equilibrium is a center — a neutrally stable fixed point — so any perturbation sends the system into a closed orbit rather than spiraling in or out. In nature, real systems add damping or amplifying forces that prevent perfect neutrality.",
      },
      {
        question: "What do the four Lotka-Volterra parameters actually represent biologically?",
        answer:
          "Alpha (α) is how fast prey reproduce without predators, similar to an intrinsic rate of increase. Beta (β) is how strongly predator-prey encounters reduce prey numbers. Delta (δ) is predator efficiency: how much successful predation supports predator growth. Gamma (γ) is how quickly predators decline without enough prey. Together these four values set equilibrium populations, oscillation timing, and the strength of predator-prey feedback.",
      },
      {
        question: "How does carrying capacity change the model?",
        answer:
          "The basic Lotka-Volterra model assumes unlimited prey growth, which is unrealistic. Adding logistic growth to the prey equation — replacing αx with αx(1 - x/K) — introduces a carrying capacity K. This changes the equilibrium from a center to a stable spiral, meaning populations eventually settle to a fixed point rather than cycling indefinitely. Real ecosystems behave more like the logistic version.",
      },
      {
        question: "How does AP Biology standard 8.A.1 connect to this simulation?",
        answer:
          "AP Bio standard 8.A.1 (Big Idea 4, Systems Interactions) requires students to analyze how interactions between populations affect community structure. The Lotka-Volterra simulation directly models trophic interaction: predation links two populations so that neither can be understood in isolation. NGSS HS-LS2-2 similarly asks students to use mathematical representations to support claims about factors that affect biodiversity and populations.",
      },
      {
        question: "Can this model produce predator or prey extinction?",
        answer:
          "In the idealized mathematical model, populations oscillate indefinitely without extinction because the equations are continuous and deterministic. In the simulation, if α, β, δ, and γ push prey or predator values very close to zero, the discrete numerical integration can let a population reach zero and collapse. This is a known limitation of continuous Lotka-Volterra equations versus real stochastic populations.",
      },
      {
        question: "Why does the phase-plane plot show closed loops instead of spirals?",
        answer:
          "The Lotka-Volterra equilibrium is a center, which means the system neither converges to the fixed point nor diverges away — it orbits at a constant amplitude forever. Each starting condition traces a different closed orbit around the equilibrium point (predator = α/β, prey = γ/δ). Real systems usually show damped spirals (converging) or limit cycles, not perfect closed loops.",
      },
    ],
  },
};
