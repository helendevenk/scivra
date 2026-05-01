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
      max: 500,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "showOzone",
      label: "Show Ozone Layer (0=off, 1=on)",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
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
    "Use the altitude slider to move through the atmosphere. Watch the temperature and pressure gauges change. The diagram highlights which layer you're in and shows key features (ozone layer, weather zone, aurora). The graph on the right plots the temperature profile.",

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
  contentSections: {
    whatIsIt:
      "Earth's atmosphere is a layered shell of gases held by gravity, divided into distinct zones by how temperature changes with altitude. The troposphere (0–12 km) holds 75% of the atmosphere's mass and all weather — thunderstorms, rain, the smell of air after lightning. Above it, the stratosphere (12–50 km) actually warms with altitude because ozone absorbs ultraviolet radiation; that temperature inversion is exactly why weather stops at the tropopause. Higher still, the mesosphere cools again, and the thermosphere heats to over 1000°C from X-ray absorption — yet feels cold because air there is nearly a vacuum. The simulation lets you drag a virtual weather balloon from sea level to 500 km, tracking temperature, pressure, and which layer you're in at every step.",
    parameterExplanations: {
      altitude:
        "Height above sea level, ranging 0–500 km. At sea level (0 km) pressure is 101 kPa and temperature is ~15°C; by 5.5 km altitude, pressure has already dropped to roughly half that value.",
      showOzone:
        "Toggle (0 = off, 1 = on) that overlays the ozone concentration profile, peaking near 25 km in the stratosphere where O₃ absorbs UV-B and UV-C radiation and converts it to heat.",
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
          "Temperature measures the average kinetic energy per molecule, but the thermosphere has so few molecules that almost no heat is transferred to a surface. Satellites there actually lose heat by radiation faster than they absorb it.",
      },
    ],
    teacherUseCases: [
      "Pre-lab sketch: before touching the simulation, have students draw a graph of expected temperature vs. altitude from 0 to 100 km. After running the altitude slider from 0 to 100, compare their predictions to the actual non-linear profile and discuss where their intuition broke down.",
      "Layer boundary identification: set altitude to 0 and advance in 5 km increments. Students record temperature at each step and identify the four layer boundaries by spotting direction reversals. Compile class data into a shared table comparing measured vs. textbook values.",
      "Ozone misconception probe: toggle showOzone between 0 and 1 at altitudes of 10 km, 25 km, and 40 km. Ask students to explain in writing why temperature rises in the stratosphere only when showOzone is on. Use responses to address the 'ozone as shield' model.",
      "Pressure halving activity: have students advance altitude from 0 to 50 km in steps of ~5.5 km and record pressure at each stop. They should observe pressure approximately halving at each step, confirming the barometric formula without using the equation directly.",
      "Weather boundary discussion: set altitude to 12 km and ask why weather 'stops' at the tropopause. Connect the temperature inversion to the stability of air layers — warm over cold prevents vertical convection, linking to HS-ESS2-4 on how Earth's systems interact.",
    ],
    faq: [
      {
        question: "Why does the stratosphere get warmer as you go higher?",
        answer:
          "Ozone (O₃) concentrated between 15–35 km absorbs UV radiation from the Sun and converts it to heat. The highest ozone concentrations sit at the top of this band, so upper stratosphere air is heated more directly. This creates a temperature inversion that stops tropospheric weather from mixing into the stratosphere.",
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
          "The Kármán line at 100 km is the internationally recognized boundary between Earth's atmosphere and outer space. Below it, aerodynamic lift is possible; above it, orbital mechanics dominate. It sits in the upper mesosphere/lower thermosphere where air density is roughly 2.2 × 10⁻⁷ kg/m³ — about 10 million times less dense than at sea level.",
      },
    ],
  },
};
