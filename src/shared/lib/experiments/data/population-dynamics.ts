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
};
