import type { Experiment } from "@/shared/types/experiment";

export const climateChangeModeling: Experiment = {
  id: "climate-change-modeling",
  slug: "climate-change-modeling",
  title: "Climate Change Modeling",
  subtitle: "Historical temperature trends, CO₂ correlation, and future projections",
  description:
    "Explore 800,000 years of climate data showing the tight correlation between CO₂ levels and global temperature. Toggle between ice-core records and modern instrumental data. Adjust emission scenarios (RCP/SSP) to see projected warming through 2100. Understand feedback loops, tipping points, and the carbon budget.",
  thumbnail: "/imgs/experiments/climate-change-modeling.png",

  standards: {
    ngss: ["HS-ESS2-4", "HS-ESS3-5", "HS-ESS3-6"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "9-12",
  tags: [
    "climate change",
    "global warming",
    "CO₂ emissions",
    "temperature history",
    "ice cores",
    "RCP scenarios",
    "Earth Science",
  ],
  difficulty: "intermediate",

  parameters: [
    { id: "co2Conc", label: "CO₂ Concentration", unit: "ppm", min: 280, max: 1200, default: 420, step: 10, tier: "free" },
    { id: "ecs", label: "Climate Sensitivity", unit: "°C/2×CO₂", min: 1.5, max: 6, default: 3, step: 0.1, tier: "free" },
    { id: "aerosol", label: "Aerosol Forcing", unit: "W/m²", min: -2, max: 0, default: -0.5, step: 0.1, tier: "free" },
  ],

  formulas: [
    {
      latex: "\\Delta F = 5.35 \\ln\\left(\\frac{C}{C_0}\\right)",
      description:
        "Radiative forcing from CO₂: C is current concentration, C₀ is pre-industrial (280 ppm). Each doubling adds ~3.7 W/m².",
    },
    {
      latex: "\\Delta T = \\lambda \\cdot \\Delta F, \\quad \\lambda \\approx 0.8\\,\\text{°C/(W/m²)}",
      description:
        "Equilibrium temperature change from radiative forcing, with climate sensitivity parameter λ.",
    },
  ],

  theory:
    "Ice-core records (Vostok, EPICA) show atmospheric CO₂ and temperature have been tightly coupled for 800,000 years, cycling between ~180 ppm (glacials) and ~280 ppm (interglacials). Since industrialization, CO₂ has risen to 420+ ppm — 50% above the highest natural level — driven by fossil fuel combustion and deforestation. The IPCC uses Shared Socioeconomic Pathways (SSPs) to project future warming: SSP1-2.6 (sustainable, ~1.8°C by 2100), SSP2-4.5 (middle of the road, ~2.7°C), SSP3-7.0 (regional rivalry, ~3.6°C), SSP5-8.5 (fossil-fueled, ~4.4°C). Key feedback loops include water vapor (amplifies warming), ice-albedo (less ice → more absorption), and permafrost methane release. The 'carbon budget' for 1.5°C is approximately 500 Gt CO₂ remaining.",

  instructions:
    "Use the time range slider to zoom between recent centuries and deep ice-core history. The red line shows global temperature anomaly; the blue line shows CO₂ concentration. Select different SSP emission scenarios to see projected warming through 2100. Notice how CO₂ and temperature track each other across glacial cycles.",

  challenges: [
    {
      id: "cc-c1",
      question: "Over the past 800,000 years, what was the highest natural CO₂ level, and what is it today?",
      hint: "Natural peaks reached ~280 ppm during interglacials. Today's level is ~420 ppm — 50% higher than any point in 800,000 years.",
      tier: "free",
    },
    {
      id: "cc-c2",
      question: "What is the difference in projected warming between SSP1-2.6 and SSP5-8.5 by 2100?",
      hint: "SSP1-2.6 projects ~1.8°C; SSP5-8.5 projects ~4.4°C. That's about 2.6°C difference, driven entirely by human emission choices.",
      tier: "free",
    },
    {
      id: "cc-c3",
      question: "Why does temperature sometimes appear to lead CO₂ in ice-core records?",
      hint: "Orbital (Milankovitch) cycles initiate warming, which causes oceans to release dissolved CO₂ (solubility decreases with temperature). The released CO₂ then amplifies warming via greenhouse effect — a positive feedback loop.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 30,
  relatedExperiments: ["greenhouse-effect", "atmosphere-layers"],
  htmlPath: "/experiments/earth-science/climate-change-modeling.html",
  htmlControlAliases: { co2Conc: "oninput:setCO2", ecs: "oninput:setECS", aerosol: "oninput:setAerosol" },
  presets: [
    { id: "loadPreset:historical", label: "Historical 1880–2024", description: "Historical CO₂ trajectory from pre-industrial 280 ppm to current 420 ppm." },
    { id: "loadPreset:rcp45", label: "RCP 4.5 (moderate mitigation)", description: "Moderate emissions pathway stabilizing at ~540 ppm CO₂ by 2100." },
    { id: "loadPreset:rcp85", label: "RCP 8.5 (high emissions)", description: "High-emissions pathway reaching ~940 ppm CO₂ by 2100." },
  ],

  seoTitle: "Climate Change Modeling Interactive Simulation | Scivra Earth Science",
  seoKeywords: [
    "climate change simulation",
    "global warming model",
    "CO2 temperature correlation",
    "ice core data interactive",
    "SSP emission scenarios",
    "Earth science virtual lab",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Climate Change Science and Modeling",
  },
  contentSections: {
    whatIsIt:
      "Climate change modeling uses historical data and physics to project how Earth's average temperature responds to changes in greenhouse gases. Ice cores drilled in Antarctica preserve trapped air bubbles reaching back 800,000 years, recording both CO₂ concentration and temperature proxy data — and the two curves track each other almost perfectly through about eight major glacial-interglacial cycles. Since pre-industrial times (~1750), CO₂ has risen from 280 ppm to over 420 ppm, a level not seen in at least 800,000 years of natural cycles. The simulation lets you explore that full record, switch between four SSP emission scenarios with different assumed societal choices, and watch how the projected temperature curve for 2100 changes depending on which path humanity takes.",
    parameterExplanations: {
            co2Conc: "Sets the atmospheric CO₂ concentration in ppm (280–1200 ppm). Pre-industrial baseline is 280 ppm; today's level is ~420 ppm. Each doubling from the baseline adds approximately 3.7 W/m² of radiative forcing and ~3°C of equilibrium warming. Push toward 1200 ppm to explore worst-case RCP 8.5 end-of-century projections.",
      ecs: "Climate Equilibrium Sensitivity: the warming expected per doubling of CO₂, in °C (range 1.5–6 °C, IPCC likely range 2.5–4°C, best estimate 3°C). Lower values follow the optimistic end of model spread; higher values represent strong feedback amplification including water-vapor, ice-albedo, and cloud feedbacks.",
      aerosol: "Net aerosol radiative forcing in W/m² (range −2 to 0). Aerosols from industrial pollution and volcanic eruptions reflect sunlight, partially offsetting greenhouse warming. The current best estimate is about −0.5 W/m². Setting this to 0 removes the cooling mask and shows how much warming aerosols have suppressed.",
    },
    misconceptions: [
      {
        wrong:
          "If it snows heavily this winter, that proves global warming is fake.",
        correct:
          "Weather is what happens on a given day; climate is the multi-decade average. A single cold event is well within normal weather variability even as the overall trend warms. Scientists measure climate change over 30-year baselines, not individual storms.",
      },
      {
        wrong:
          "CO₂ is a trace gas — only 0.04% of the atmosphere — so it can't possibly matter.",
        correct:
          "Concentration doesn't determine impact alone; absorption spectrum does. CO₂ absorbs infrared radiation at specific wavelengths that other major gases (N₂, O₂) ignore entirely. Even a small amount blocks significant outgoing heat, much like a small amount of pigment can block most light in a solution.",
      },
      {
        wrong:
          "Climate has always changed naturally, so current warming is just a natural cycle.",
        correct:
          "Natural cycles — Milankovitch, solar variation — do cause climate change, but they operate on timescales of tens of thousands of years and are well-tracked in ice-core data. Current warming of ~1.1°C in 150 years is several to tens of times faster than typical post-glacial natural warming rates (depending on the baseline used), and CO₂ is already 50% above any natural peak in 800,000 years.",
      },
      {
        wrong:
          "More CO₂ means proportionally more warming — doubling CO₂ doubles the temperature rise.",
        correct:
          "The relationship is logarithmic, not linear. Each successive doubling of CO₂ adds roughly the same amount of forcing (~3.7 W/m²). This means going from 280 to 560 ppm has the same effect as going from 560 to 1120 ppm — diminishing returns at high concentrations.",
      },
      {
        wrong:
          "Ocean warming is just a side effect of air temperature rising.",
        correct:
          "The ocean absorbs over 90% of the excess heat in the climate system and acts as a thermal buffer, delaying surface warming. Because of this ocean thermal mass, if CO₂ concentrations were held fixed, some additional committed warming would occur over decades. Under near-zero emissions scenarios where concentrations can gradually decline, global temperature is expected to roughly stabilize — though uncertainty remains across model projections.",
      },
    ],
    teacherUseCases: [
      "Deep-time vs. modern comparison: set timeRange to 800,000 with showCO2 on. Students identify the natural CO₂ ceiling (~280 ppm) across multiple glacial cycles, then advance timeRange to 200 to see the industrial spike above that ceiling. Ask: how long did it take naturally to change CO₂ by 100 ppm vs. industrially?",
      "Scenario comparison activity: pairs run the simulation at scenario 1 and scenario 4, recording projected 2100 temperature for each. They calculate the difference (~2.6°C) and research one real-world impact that changes at that threshold (e.g., coral reef survival, sea level rise, crop yield).",
      "CO₂-temperature lag analysis: set timeRange to 800,000 and showCO2 on. Ask students whether CO₂ always leads temperature changes or sometimes lags. This probes the difference between forcing (orbital → temperature → ocean CO₂ release) and feedback (industrial CO₂ → direct forcing).",
      "Radiative forcing calculation: using the formula ΔF = 5.35 × ln(C/C₀) with C₀ = 280 ppm, students compute the forcing for today's 420 ppm (≈ 2.1 W/m²) and compare to a 560 ppm scenario. No calculus needed — just a calculator and the numbers from the sim.",
      "Misconception probe — 'it was cold last week': before opening the simulation, poll the class on whether a local cold week disproves global warming. After exploring the 800,000-year record with clear multi-decade trends, revisit the question and have students articulate the climate vs. weather distinction in their own words, citing HS-ESS3-5.",
    ],
    faq: [
      {
        question: "What is the difference between weather and climate?",
        answer:
          "Weather is the current state of the atmosphere — temperature, precipitation, wind — on a timescale of hours to days. Climate is the statistical pattern of weather over 30 or more years. A single cold winter is weather; the 30-year average January temperature is climate. Scientists define climate change as a shift in those long-term averages.",
      },
      {
        question: "What do the SSP scenarios represent?",
        answer:
          "SSP stands for Shared Socioeconomic Pathway. The four simulation scenarios map to: SSP1-2.6 (rapid decarbonization, ~1.8°C by 2100), SSP2-4.5 (moderate mitigation, ~2.7°C), SSP3-7.0 (limited cooperation, ~3.6°C), and SSP5-8.5 (fossil-fuel intensive growth, ~4.4°C). They are not predictions but scenarios tied to different policy and technology choices.",
      },
      {
        question: "Which NGSS standards does this simulation support?",
        answer:
          "The simulation directly supports HS-ESS3-5 (analyze geoscience data to make evidence-based forecasts of the current rate of global or regional climate change) and HS-ESS3-6 (use a computational representation of the relationships among Earth's systems to describe how feedback loops maintain Earth's system). HS-ESS2-4 is also addressed through the energy-budget framing.",
      },
      {
        question: "Why is today's CO₂ level considered unprecedented?",
        answer:
          "Ice-core records extending 800,000 years show CO₂ naturally cycled between ~180 ppm (glacial maxima) and ~280 ppm (interglacials). Today's level of ~420 ppm is roughly 50% above that natural ceiling and was reached in about 150 years — a rate of change orders of magnitude faster than any natural transition in the record.",
      },
      {
        question: "How does ocean thermal mass delay surface warming?",
        answer:
          "Water has a very high heat capacity compared to land or air. The upper ocean absorbs most incoming excess energy, warming slowly. This means the atmosphere warms less rapidly than it would on a dry planet, but it also means that warming already committed by current CO₂ levels will continue playing out for decades even after emissions stop.",
      },
      {
        question: "What is equilibrium climate sensitivity?",
        answer:
          "Equilibrium climate sensitivity (ECS) is the eventual global mean temperature rise from a sustained doubling of CO₂ after all feedbacks (water vapor, ice-albedo, clouds) have played out. The IPCC best estimate is ~3°C per doubling, with a likely range of 2.5–4°C. The simulation's projected curves embed this sensitivity in their SSP temperature trajectories.",
      },
    ],
  },
};
