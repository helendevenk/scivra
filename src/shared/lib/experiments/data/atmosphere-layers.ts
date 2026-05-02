import type { Experiment } from "@/shared/types/experiment";

export const atmosphereLayers: Experiment = {
  id: "atmosphere-layers",
  slug: "atmosphere-layers",
  title: "Atmosphere Layers",
  subtitle: "Temperature, pressure, and composition through the atmosphere",
  description:
    "Explore Earth's atmospheric layers from the troposphere to the exosphere. See how temperature, pressure, and composition change with altitude. Launch a virtual weather balloon and observe conditions at different heights.",
  thumbnail: "/imgs/experiments/atmosphere-layers.png",

  standards: {
    ngss: ["HS-ESS2-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "9-12",
  tags: [
    "atmosphere",
    "troposphere",
    "stratosphere",
    "ozone layer",
    "temperature profile",
    "Earth Science",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "altitude",
      label: "Altitude",
      unit: "km",
      min: 0,
      max: 700,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "solarActivity",
      label: "Solar Activity",
      unit: "×normal",
      min: 0.1,
      max: 5,
      default: 1.0,
      step: 0.1,
      tier: "free",
    },
    {
      id: "ozoneLevel",
      label: "Ozone Level",
      unit: "×normal",
      min: 0.1,
      max: 2,
      default: 1.0,
      step: 0.05,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "P(h) = P_0 \\cdot e^{-h/H}",
      description:
        "Barometric formula: pressure decreases exponentially with altitude. H ≈ 8.5 km (scale height)",
    },
    {
      latex: "T(h) = T_0 - \\Gamma \\cdot h",
      description:
        "Troposphere lapse rate: temperature decreases ~6.5°C per km in the troposphere (Γ = lapse rate)",
    },
  ],

  theory:
    "Earth's atmosphere is divided into layers based on temperature changes with altitude. The troposphere (0-12 km) contains 75% of atmospheric mass and all weather; temperature decreases at ~6.5°C/km. The stratosphere (12-50 km) contains the ozone layer (peak at ~25 km) that absorbs UV, warming the air — temperature increases with altitude. The mesosphere (50-85 km) is the coldest layer, where temperature drops again. The thermosphere (85-600 km) absorbs extreme UV and X-rays, reaching >1000°C, but feels cold due to low particle density. Pressure drops exponentially: halving roughly every 5.5 km. At 100 km (Kármán line), space officially begins.",

  instructions:
    "Use the Altitude, Solar Activity, and Ozone Level sliders to test how height, incoming solar energy, and stratospheric ozone shape the atmosphere. Try the Standard Atmosphere, High Solar Activity (Aurora), and Stratospheric Ozone Focus presets to compare normal conditions, upper-atmosphere heating, and ozone-driven warming.",

  challenges: [
    {
      id: "al-c1",
      question: "Why does temperature increase in the stratosphere?",
      hint: "Ozone (O₃) in the stratosphere absorbs UV radiation from the Sun, converting it to heat.",
      tier: "free",
    },
    {
      id: "al-c2",
      question: "At what altitude does atmospheric pressure drop to 50% of sea level?",
      hint: "Using P = P₀ × e^(-h/H) with H = 8.5 km: h = 8.5 × ln(2) ≈ 5.9 km",
      tier: "free",
    },
    {
      id: "al-c3",
      question: "The thermosphere can reach 1500°C, yet satellites don't burn. Why?",
      hint: "Air density is so low (<10⁻¹¹ of sea level) that very few molecules transfer heat. Temperature measures kinetic energy per molecule, not total heat content.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["greenhouse-effect", "climate-change-modeling"],
  htmlPath: "/experiments/earth-science/atmosphere-layers.html",

  seoTitle: "Atmosphere Layers Interactive Diagram | Scivra Earth Science",
  seoKeywords: [
    "atmosphere layers simulation",
    "troposphere stratosphere interactive",
    "atmospheric pressure altitude",
    "ozone layer visualization",
    "Earth science virtual lab",
    "temperature profile atmosphere",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Earth's Atmospheric Layers",
  },
  htmlControlAliases: {
    altitude: "alt-slider",
    solarActivity: "solar-slider",
    ozoneLevel: "ozone-slider",
  },
  presets: [
    {
      id: "standard",
      label: "Standard Atmosphere",
      description:
        "A baseline atmosphere with normal solar activity and ozone level. Use it to compare how temperature and pressure change as altitude increases through the main layers.",
    },
    {
      id: "aurora",
      label: "High Solar Activity (Aurora)",
      description:
        "A high-solar-energy case that emphasizes heating and visible activity in the upper atmosphere. It is useful for connecting solar radiation to thermosphere behavior and aurora formation.",
    },
    {
      id: "ozone",
      label: "Stratospheric Ozone Focus",
      description:
        "A focused view of the ozone-rich stratosphere, where UV absorption changes the temperature trend. Use it to investigate why the stratosphere warms with altitude instead of cooling like the troposphere.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Earth's atmosphere is a layered shell of gases held by gravity, divided into distinct zones by how temperature changes with altitude. The troposphere (0–12 km) holds 75% of the atmosphere's mass and all weather — thunderstorms, rain, the smell of air after lightning. Above it, the stratosphere (12–50 km) actually warms with altitude because ozone absorbs ultraviolet radiation; that temperature inversion is exactly why weather stops at the tropopause. Higher still, the mesosphere cools again, and the thermosphere heats to over 1000°C from X-ray absorption — yet feels cold because air there is nearly a vacuum. The simulation lets you drag a virtual weather balloon from sea level to 700 km, tracking temperature, pressure, and which layer you're in at every step. Solar activity and ozone concentration sliders show how the atmosphere responds to changes in incoming radiation and stratospheric chemistry.",
    parameterExplanations: {
      altitude:
        "Altitude is height above sea level, measured here from 0 to 700 km. As you raise the slider, pressure drops quickly because there is less air above that point pushing downward. Temperature does not follow one simple pattern: it decreases in the troposphere, rises in the ozone-rich stratosphere, falls again in the mesosphere, and rises sharply in the thermosphere. Start with the Standard Atmosphere preset and move altitude in 5 km steps to see why atmospheric layers are defined by temperature trends, not by equal spacing.",
      solarActivity:
        "Solar Activity represents how much incoming solar energy reaches the upper atmosphere compared with normal conditions. A value of 1×normal is typical; higher values model more active solar conditions that can heat the thermosphere and support aurora-related effects. This slider is most useful at high altitudes, where extreme ultraviolet and charged particle interactions matter more than weather or surface pressure. Try the High Solar Activity (Aurora) preset, then lower the value while keeping altitude the same to isolate how energy from the Sun changes the upper-atmosphere temperature pattern.",
      ozoneLevel:
        "Ozone Level changes the relative amount of stratospheric ozone, the gas that absorbs much of the Sun's harmful ultraviolet radiation. Ozone is not a solid shield; it is a diffuse gas with its strongest effect in the stratosphere, especially around the region where temperature begins increasing with altitude. Raising this slider strengthens the connection between UV absorption and stratospheric warming, while lowering it weakens that effect. Use the Stratospheric Ozone Focus preset to connect ozone concentration with the temperature inversion that helps separate weather-filled tropospheric air from the more stable stratosphere.",
    },
    misconceptions: [
      {
        wrong:
          "It always gets colder the higher you go.",
        correct:
          "That rule only holds in the troposphere. The stratosphere actually warms with altitude — ozone there absorbs UV energy, reversing the temperature gradient. The thermosphere also heats dramatically, though low particle density means little heat is transferred.",
      },
      {
        wrong:
          "The ozone layer is just a thin protective film sitting on top of the atmosphere.",
        correct:
          "Ozone is a gas mixed throughout the stratosphere, not a solid film. Its concentration peaks near 25 km and represents a diffuse region, not a sharp boundary. It blocks UV radiation by absorbing photons, not by physically blocking them.",
      },
      {
        wrong:
          "Atmospheric pressure drops to zero at the 'edge' of the atmosphere.",
        correct:
          "There is no sharp edge. Pressure decreases exponentially — halving roughly every 5.5 km — and fades gradually through the thermosphere and exosphere into interplanetary space. The Kármán line at 100 km is a legal convention, not a physical boundary.",
      },
      {
        wrong:
          "The thermosphere is the hottest layer, so objects there should feel extremely hot.",
        correct:
          "Temperature measures the average kinetic energy per molecule, but the thermosphere has so few molecules that almost no heat is transferred to a surface. Heat exchange there is dominated by radiation, while collisions with the thin thermospheric gas transfer very little heat to or from a satellite.",
      },
    ],
    teacherUseCases: [
      "Use the Standard Atmosphere preset and have students move the Altitude slider from 0 to 100 km in 5 or 10 km steps, recording temperature trends and pressure changes. Students use the model as evidence for HS-ESS2-4 by explaining how atmospheric structure affects Earth's energy system.",
      "Use the Stratospheric Ozone Focus preset, then vary only the Ozone Level slider while keeping Altitude in the stratosphere. Students connect ozone absorption of UV radiation to the stratospheric temperature inversion and explain why this matters for Earth's energy budget.",
      "Use the High Solar Activity (Aurora) preset at thermosphere altitudes, then have students lower and raise the Solar Activity slider. Ask them to describe how solar energy changes upper-atmosphere conditions without confusing high temperature with high heat content.",
      "Run a controlled-variable investigation where each group chooses one preset, changes only one slider, and records the response. Groups compare results to show how altitude, solar activity, and ozone level represent interacting parts of Earth's climate and atmospheric systems under HS-ESS2-4.",
      "Have students build a claim-evidence-reasoning response comparing the Standard Atmosphere and Stratospheric Ozone Focus presets. Their evidence should cite slider values and observed layer behavior to explain how variations in atmospheric composition affect energy absorption.",
    ],
    faq: [
      {
        question: "Why does the stratosphere get warmer as you go higher?",
        answer:
          "Ozone (O₃) is distributed through the stratosphere with peak concentration near 20–25 km, where it absorbs UV radiation from the Sun and converts it to heat. This creates a temperature inversion that stops tropospheric weather from mixing into the stratosphere.",
      },
      {
        question: "How is atmospheric pressure related to altitude?",
        answer:
          "Pressure decreases exponentially because there is simply less air above you at higher altitudes. The barometric formula predicts pressure halves every ~5.5 km. At 5.5 km (Mount Everest's summit is at 8.8 km) pressure is roughly 50% of sea level, which is why climbers need supplemental oxygen.",
      },
      {
        question: "What NGSS standard does this experiment address?",
        answer:
          "The simulation directly supports HS-ESS2-4, which asks students to use a model to describe how variations in Earth's energy budget affect the climate system — the atmospheric temperature profile and ozone layer are core components of that energy budget.",
      },
      {
        question: "Why does the thermosphere reach such high temperatures if space is cold?",
        answer:
          "The thermosphere absorbs extreme UV and X-rays from the Sun, energizing the few molecules present to very high speeds. 'Temperature' here reflects individual molecule kinetic energy, not bulk heat. Because particle density is near-vacuum, very little thermal energy can be transferred — it is simultaneously very hot (by definition) and a very poor heat reservoir.",
      },
      {
        question: "What is the Kármán line and why does it matter?",
        answer:
          "The Kármán line at 100 km is a commonly used boundary for space, adopted by the FAI (Fédération Aéronautique Internationale) and others, but it is a legal and engineering convention — not a sharp physical edge of the atmosphere. It sits in the upper mesosphere/lower thermosphere where air density is roughly 5.6 × 10⁻⁷ kg/m³ — about 2 million times less dense than at sea level.",
      },
    ],
  },
};
