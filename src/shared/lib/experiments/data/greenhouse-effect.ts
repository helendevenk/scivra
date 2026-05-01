import type { Experiment } from "@/shared/types/experiment";

export const greenhouseEffect: Experiment = {
  id: "greenhouse-effect",
  slug: "greenhouse-effect",
  title: "Greenhouse Effect",
  subtitle: "Solar radiation, infrared absorption, and global temperature",
  description:
    "Simulate how greenhouse gases trap infrared radiation in Earth's atmosphere. Adjust CO₂ and methane concentrations to observe temperature changes. Watch photon particles bounce between Earth's surface and the atmosphere, and see how energy balance determines global temperature.",
  thumbnail: "/imgs/experiments/greenhouse-effect.png",

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
    "greenhouse effect",
    "climate change",
    "infrared radiation",
    "CO₂",
    "global warming",
    "Earth Science",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "co2Level",
      label: "CO₂ Concentration",
      unit: "ppm",
      min: 200,
      max: 1000,
      default: 420,
      step: 10,
      tier: "free",
    },
    {
      id: "methaneLevel",
      label: "CH₄ Concentration",
      unit: "ppb",
      min: 500,
      max: 5000,
      default: 1900,
      step: 100,
      tier: "free",
    },
    {
      id: "solarIntensity",
      label: "Solar Intensity",
      unit: "%",
      min: 80,
      max: 120,
      default: 100,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "T_s = T_{\\text{eff}} \\cdot (1 + \\tau)^{1/4}",
      description:
        "Surface temperature depends on effective temperature and atmospheric opacity τ (greenhouse parameter)",
    },
    {
      latex: "T_{\\text{eff}} = \\left(\\frac{S(1-\\alpha)}{4\\sigma}\\right)^{1/4} \\approx 255\\,\\text{K}",
      description:
        "Earth's effective temperature without greenhouse effect: S = solar constant, α = albedo, σ = Stefan-Boltzmann constant",
    },
  ],

  theory:
    "The Sun emits primarily visible light, which passes through Earth's atmosphere and warms the surface. The warm surface radiates infrared (IR) radiation back toward space. Greenhouse gases (CO₂, CH₄, H₂O, N₂O) absorb and re-emit IR in all directions, trapping energy in the lower atmosphere. This natural greenhouse effect raises Earth's average temperature from ~255 K to ~288 K (about +33°C). Increasing CO₂ from pre-industrial 280 ppm to today's 420+ ppm has enhanced this effect, causing ~1.1°C of warming. The relationship is roughly logarithmic: each doubling of CO₂ adds about 3°C (climate sensitivity). Methane is ~80× more potent per molecule but exists in much smaller quantities.",

  instructions:
    "Adjust CO₂ and CH₄ sliders to see how greenhouse gas concentrations affect global temperature. Yellow photons represent incoming solar radiation; red photons represent outgoing infrared. Watch how more greenhouse gas causes more IR photons to be reflected back to the surface. The thermometer shows the resulting surface temperature.",

  challenges: [
    {
      id: "ge-c1",
      question: "What would Earth's temperature be without any greenhouse effect?",
      hint: "About 255 K (-18°C). The natural greenhouse effect adds ~33°C to reach the actual ~288 K (15°C).",
      tier: "free",
    },
    {
      id: "ge-c2",
      question: "If CO₂ doubles from 280 to 560 ppm, approximately how much warming occurs?",
      hint: "Climate sensitivity is approximately 3°C per doubling of CO₂ (range: 2.5-4°C).",
      tier: "free",
    },
    {
      id: "ge-c3",
      question: "Why is methane a stronger greenhouse gas per molecule than CO₂, yet CO₂ gets more attention?",
      hint: "CH₄ is ~80× more potent per molecule (20-year GWP), but CO₂ concentration is ~220× higher and persists for centuries vs. ~12 years for CH₄.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["climate-change-modeling", "atmosphere-layers"],
  htmlPath: "/experiments/earth-science/greenhouse-effect.html",

  seoTitle: "Greenhouse Effect Interactive Simulation | Scivra Earth Science",
  seoKeywords: [
    "greenhouse effect simulation",
    "climate change interactive",
    "CO2 global warming model",
    "infrared radiation absorption",
    "Earth science virtual lab",
    "greenhouse gas simulator",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "The Greenhouse Effect and Climate Change",
  },
  contentSections: {
    whatIsIt:
      "The greenhouse effect is the process by which certain atmospheric gases absorb outgoing infrared radiation from Earth's surface and re-emit it in all directions — including back downward — warming the lower atmosphere. Without it, Earth's average surface temperature would be roughly -18°C instead of +15°C, a difference of 33°C. The effect is not inherently harmful: it makes Earth habitable. The problem is the enhanced greenhouse effect, driven by human emissions raising CO₂ from a pre-industrial 280 ppm to today's ~420 ppm. The simulation shows individual photon paths — incoming visible light from the Sun and outgoing infrared from the surface — and lets you adjust CO₂, methane, and solar intensity to observe how energy balance and surface temperature respond.",
    parameterExplanations: {
      co2Level:
        "Atmospheric CO₂ concentration in parts per million (ppm), adjustable from 200 to 1000 ppm. Pre-industrial baseline was ~280 ppm; today it is ~420 ppm. Each doubling — e.g., 280 → 560 ppm — adds approximately 3.7 W/m² of radiative forcing and roughly 3°C of eventual warming.",
      methaneLevel:
        "Atmospheric CH₄ concentration in parts per billion (ppb), adjustable from 500 to 5000 ppb. Pre-industrial level was ~722 ppb; today it is ~1900 ppb. Methane has a GWP20 of about 80× CO₂ per unit mass over a 20-year time horizon; molecule-for-molecule comparisons differ and depend on the metric and time horizon chosen. CH₄ persists only ~12 years in the atmosphere before oxidizing.",
      solarIntensity:
        "Incoming solar energy as a percentage of the present-day solar constant (1361 W/m²). At 100% the simulation matches current conditions; at 80% it approximates a dimmer early Sun; at 120% it tests the effect of solar variation on surface temperature independent of greenhouse gases.",
    },
    misconceptions: [
      {
        wrong:
          "The greenhouse effect is bad and should be zero for a healthy planet.",
        correct:
          "Without any greenhouse effect, Earth's average surface temperature would be about -18°C — far too cold for liquid water or life as we know it. The natural greenhouse effect is essential. The climate concern is the enhanced greenhouse effect: the additional warming caused by human-released CO₂ and CH₄ on top of the natural baseline.",
      },
      {
        wrong:
          "The greenhouse effect works like an actual greenhouse — a physical barrier that traps hot air.",
        correct:
          "A glass greenhouse keeps warm air from mixing with cooler outside air. The atmospheric greenhouse effect is a radiative process: CO₂ and other gases are transparent to incoming visible light but absorb and re-emit outgoing infrared radiation. No physical barrier is involved — it is entirely about how different molecules interact with different wavelengths of electromagnetic radiation.",
      },
      {
        wrong:
          "CO₂ causes warming by blocking sunlight from reaching Earth.",
        correct:
          "CO₂ is effectively transparent to visible and UV sunlight, which pass straight through to the surface. It absorbs infrared radiation — the heat emitted by the warmed surface — and re-emits it in all directions including back down. The warming mechanism is on the outgoing side of the energy budget, not the incoming side.",
      },
      {
        wrong:
          "Methane is more important to fight than CO₂ because it's a more potent greenhouse gas.",
        correct:
          "Methane has a GWP20 of about 80× CO₂ per unit mass over a 20-year horizon (the value varies by metric and time horizon), but atmospheric CH₄ concentration (~1900 ppb) is roughly 220× lower than CO₂ (~420,000 ppb = 420 ppm). Methane also breaks down in about 12 years, while CO₂ persists for centuries. Both matter, but CO₂ dominates the long-term forcing.",
      },
      {
        wrong:
          "If solar intensity is constant, CO₂ increases can't affect temperature.",
        correct:
          "Solar intensity controls how much energy enters the system; CO₂ controls how much is allowed to escape as infrared radiation. Even with a perfectly steady Sun, adding CO₂ reduces the rate of energy escape until the surface warms enough to radiate the same total flux at a higher temperature — a new energy equilibrium at a higher baseline temperature.",
      },
    ],
    teacherUseCases: [
      "CO₂-only baseline: set co2Level to 280 ppm (pre-industrial CO₂ baseline) and solarIntensity to 100%, then record the equilibrium temperature shown. Increase co2Level to 420 ppm and record again. Students calculate the warming delta and compare to the observed ~1.1°C of real-world warming since industrialization. Note: for a fully preindustrial scenario also set methaneLevel to ~700–800 ppb; leaving methane at the modern default isolates the CO₂ contribution only.",
      "Doubling experiment: have pairs increase co2Level from 250 to 500 ppm and record the temperature change. Then increase from 500 to 1000 ppm and compare. The logarithmic relationship means both doublings produce roughly the same warming increment, challenging the assumption that twice as much CO₂ means twice the warming.",
      "Methane vs. CO₂ potency: set co2Level to 420 ppm and methaneLevel to 1900 ppb (baseline). Hold CO₂ constant and raise methaneLevel to 5000 ppb. Then restore methane and instead raise co2Level by the equivalent forcing. Students compare which lever moves temperature more per unit slider change.",
      "Solar vs. greenhouse comparison: set solarIntensity to 80% with co2Level at 1000 ppm, then reverse to solarIntensity 120% with co2Level at 200 ppm. Ask students which scenario produces a warmer surface and why — demonstrating that the greenhouse side and solar side affect temperature through different physical mechanisms.",
      "Misconception probe — 'greenhouse effect is all bad': before running the simulation, survey whether students think Earth would be warmer or colder without any greenhouse gases. After setting co2Level to 200 ppm and methaneLevel to 500 ppb (the lowest-GHG scenario available in this simulation), students observe the temperature drop and revise their claim using HS-ESS3-5 evidence language. Note: water vapor, the dominant greenhouse gas, is not parameterized here, so the simulation represents a partial reduction, not a true zero-greenhouse baseline.",
    ],
    faq: [
      {
        question: "What would Earth's temperature be without any greenhouse gases?",
        answer:
          "Earth's effective radiating temperature — the temperature needed to emit enough infrared to balance incoming solar energy — is about 255 K (-18°C). The natural greenhouse effect adds approximately 33°C on top of that, bringing the average surface temperature to ~288 K (+15°C). Setting co2Level to 200 ppm and methaneLevel to 500 ppb represents the lowest-GHG scenario in this simulation; it does not replicate a true zero-greenhouse baseline, since water vapor (not parameterized here) is the dominant greenhouse gas.",
      },
      {
        question: "Why does CO₂ absorb infrared but not visible light?",
        answer:
          "CO₂ molecules vibrate (stretch and bend) at specific resonant frequencies that correspond to infrared wavelengths around 15 micrometers. Visible light photons oscillate at much higher frequencies that don't match those vibrational modes, so CO₂ is transparent to them. This selective absorption by wavelength is why greenhouse gases warm the surface rather than blocking sunlight.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "The simulation directly supports HS-ESS2-4 (model how variations in energy flow into and out of Earth's systems affect climate) and HS-ESS3-5 (analyze geoscience data to forecast global or regional climate change). HS-ESS3-6 on feedback loops is also addressed through the water vapor and ice-albedo feedbacks that amplify initial CO₂-driven forcing.",
      },
      {
        question: "How is solar intensity different from the greenhouse effect as a cause of warming?",
        answer:
          "Solar intensity (the solarIntensity parameter) controls how much energy enters Earth's system — more sunlight means more energy in. The greenhouse effect controls how much energy escapes as infrared — more CO₂ means less energy out. Both routes raise equilibrium surface temperature, but historically, changes in greenhouse gas concentrations have been the dominant driver of climate change over the past century, not changes in solar output.",
      },
      {
        question: "Is the greenhouse effect still happening on other planets?",
        answer:
          "Yes. Venus has a runaway greenhouse effect: its atmosphere is 96% CO₂ at ~93 times Earth's atmospheric pressure, producing a surface temperature of ~465°C — hotter than Mercury despite being twice as far from the Sun. Mars has a thin CO₂ atmosphere that provides only ~5°C of greenhouse warming. Comparing planetary atmospheres is a powerful way to test greenhouse physics.",
      },
    ],
  },
};
