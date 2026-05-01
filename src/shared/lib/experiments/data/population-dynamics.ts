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
    ap: ["8.A.1", "8.C.1"],
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
      id: "preyBirthRate",
      label: "Prey Birth Rate (α)",
      unit: "/yr",
      min: 0.1,
      max: 2.0,
      default: 1.0,
      step: 0.1,
      tier: "free",
    },
    {
      id: "predationRate",
      label: "Predation Rate (β)",
      unit: "/yr",
      min: 0.01,
      max: 0.2,
      default: 0.05,
      step: 0.01,
      tier: "free",
    },
    {
      id: "predatorDeathRate",
      label: "Predator Death Rate (γ)",
      unit: "/yr",
      min: 0.1,
      max: 2.0,
      default: 0.8,
      step: 0.1,
      tier: "free",
    },
    {
      id: "conversionEff",
      label: "Conversion Efficiency (δ)",
      unit: "",
      min: 0.01,
      max: 0.1,
      default: 0.02,
      step: 0.01,
      tier: "free",
    },
    {
      id: "initPrey",
      label: "Initial Prey Population",
      unit: "",
      min: 10,
      max: 200,
      default: 80,
      step: 10,
      tier: "pro",
    },
    {
      id: "initPredator",
      label: "Initial Predator Population",
      unit: "",
      min: 5,
      max: 100,
      default: 30,
      step: 5,
      tier: "pro",
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
    "Adjust the prey birth rate (α), predation rate (β), predator death rate (γ), and conversion efficiency (δ). The time-series chart shows both populations over time, while the phase-plane plot shows the predator-prey trajectory. Watch for the characteristic quarter-cycle phase lag between populations.",

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
  contentSections: {
    whatIsIt:
      "Predator and prey populations oscillate together in a pattern ecologists call coupled cycles: when rabbits are plentiful, lynx multiply; as lynx multiply, rabbit numbers fall; as rabbits fall, lynx starve and decline; and the cycle restarts. Alfred Lotka and Vito Volterra independently wrote differential equations in the 1920s that capture this coupling mathematically. The model uses four parameters — prey birth rate, predation rate, predator death rate, and conversion efficiency — to generate cycles whose period and amplitude depend entirely on those numbers. Real data from the Hudson Bay Company's lynx and snowshoe hare fur records (1845–1935) show roughly 10-year cycles that broadly match the model, though with considerable noise, disease outbreaks, and vegetation effects the equations don't capture. This simulation runs the Lotka-Volterra model so you can see how each parameter shifts the cycle.",
    parameterExplanations: {
      preyBirthRate:
        "The intrinsic per-capita growth rate of the prey population in the absence of predators, α, in units of per year. At the default value of 1.0 /yr a prey population doubles in about 0.7 years with no predators present. Increasing α raises the oscillation frequency and shifts the prey equilibrium upward; decreasing it slows the cycle and can cause predator extinction if prey can no longer sustain them.",
      predationRate:
        "The rate at which predator-prey encounters result in a kill, β, in units of per year per individual. The prey loss term is βxy — proportional to both populations, reflecting that more encounters occur when either population is large. The default is 0.05 /yr; raising it increases oscillation amplitude and can drive prey to near-zero crashes if set too high.",
      predatorDeathRate:
        "The per-capita death rate of predators in the absence of prey, γ, in units of per year. At γ = 0.8 /yr the predator population halves in about 0.87 years with no food. This parameter sets the predator equilibrium: the steady-state prey count equals γ/δ, so a higher death rate requires more prey to sustain the predator population.",
      conversionEff:
        "The fraction of consumed prey biomass converted into new predator biomass, δ (dimensionless, 0.01–0.1). The predator growth term is δxy. At δ = 0.02 only 2% of prey energy becomes new predators, reflecting real trophic inefficiency (~10% is a common ecology rule of thumb). Increasing δ lowers the equilibrium prey count and increases oscillation amplitude.",
      initPrey:
        "The starting prey population size at t = 0 (default 80 individuals). Changing this shifts the initial position on the phase-plane orbit without changing which orbit the system follows; the system will still cycle around the same equilibrium. Starting far from equilibrium produces large-amplitude swings that can approach extinction.",
      initPredator:
        "The starting predator population size at t = 0 (default 30 individuals). Like initPrey, this shifts the starting point on the phase-plane orbit. Starting with very high predators and low prey pushes the system through a deep prey trough immediately, which is useful for demonstrating how the system recovers — or crashes — from extreme initial conditions.",
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
          "There is a characteristic quarter-cycle lag: predators peak after prey. When prey is at its peak, predators are still reproducing from the food surplus; by the time predators reach their peak, prey has already started declining from predation pressure. The phase-plane plot shows this as an orbit, not a point.",
      },
      {
        wrong:
          "If you remove all predators, the prey population will grow indefinitely to fill all available space.",
        correct:
          "In the basic Lotka-Volterra model, prey do grow exponentially without predators — which is one of its known limitations. In nature and in more realistic models, prey hit a carrying capacity set by food, space, and disease. The simulation uses the basic model; add the concept of logistic growth to explain why real prey populations don't grow forever.",
      },
      {
        wrong:
          "Higher conversion efficiency (δ) means the predators are more efficient hunters, so prey populations crash faster.",
        correct:
          "Conversion efficiency describes how much consumed prey biomass becomes new predator biomass — it's a metabolic parameter, not a hunting behavior. A snake that converts prey efficiently still needs to catch prey at the rate set by β. Higher δ means each kill produces more offspring, which eventually increases predator pressure, but the hunting rate is controlled separately by β.",
      },
      {
        wrong:
          "The lynx-hare cycle from Hudson Bay data proves the Lotka-Volterra model is correct.",
        correct:
          "The lynx-hare data shows roughly 10-year cycles, consistent with the model's predictions, but the fit is imperfect and contested. Vegetation cycles, disease, and human trapping also drive hare numbers. The cycles are evidence that predator-prey coupling is real, not proof that the Lotka-Volterra equations are the complete explanation.",
      },
    ],
    teacherUseCases: [
      "Parameter sweep for equilibrium: have students calculate the theoretical equilibrium prey = γ/δ and predator = α/β before running the simulation with default values (prey = 0.8/0.02 = 40, predator = 1.0/0.05 = 20), then verify by pausing the simulation near the center of the phase-plane orbit — probes quantitative reasoning with the model equations.",
      "Extinction threshold investigation: systematically increase predationRate (β) from 0.05 to 0.15 in increments of 0.02, recording whether the prey population crashes to zero. Students identify the approximate extinction threshold and write a claim-evidence-reasoning response connecting it to the prey birth rate — aligns with NGSS HS-LS2-2.",
      "Phase-plane interpretation exercise: screenshot the phase-plane plot at three different initPrey and initPredator starting points and ask students to explain why all three orbits spiral around the same center point — this directly addresses the misconception that initial conditions determine equilibrium.",
      "Real data comparison: provide students with the 1845–1935 Hudson Bay lynx-hare fur records and have them overlay the Lotka-Volterra output with best-fit parameters. Students write a paragraph identifying two ways the real data deviates from the model and propose a biological explanation for each deviation.",
      "Misconception probe — predator lag: run the simulation at default parameters and ask students to identify which population peaks first. After students answer, replay and have them measure the lag in years between prey peak and predator peak at α = 1.0, β = 0.05, γ = 0.8, δ = 0.02 (approximately 1.5–2 years with default settings).",
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
          "Alpha (α) is how fast prey reproduce without any predators — analogous to the intrinsic rate of increase r. Beta (β) is how deadly each predator-prey encounter is. Gamma (γ) is how fast predators starve without food. Delta (δ) is the trophic transfer efficiency — about 2–10% in most real food chains. Together these four numbers set the equilibrium populations and the period of the oscillation cycle.",
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
          "In the idealized mathematical model, populations oscillate indefinitely without extinction because the equations are symmetric. In the simulation, if parameters push prey very close to zero (try β = 0.15 with default other values), the discrete numerical integration can let populations reach zero and collapse. This is a known limitation of continuous Lotka-Volterra versus real stochastic populations.",
      },
      {
        question: "Why does the phase-plane plot show closed loops instead of spirals?",
        answer:
          "The Lotka-Volterra equilibrium is a center, which means the system neither converges to the fixed point nor diverges away — it orbits at a constant amplitude forever. Each starting condition traces a different closed orbit around the equilibrium point (predator = α/β, prey = γ/δ). Real systems usually show damped spirals (converging) or limit cycles, not perfect closed loops.",
      },
    ],
  },
};
