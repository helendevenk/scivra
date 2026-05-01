import type { Experiment } from "@/shared/types/experiment";

export const oceanCurrents: Experiment = {
  id: "ocean-currents",
  slug: "ocean-currents",
  title: "Ocean Currents",
  subtitle: "Global thermohaline circulation and surface wind-driven currents",
  description:
    "Visualize global ocean circulation patterns driven by wind, temperature, and salinity differences. Observe surface currents like the Gulf Stream and deep thermohaline circulation (the global conveyor belt). Adjust water temperature, salinity, and wind patterns to see how currents form, interact, and redistribute heat across the planet.",
  thumbnail: "/imgs/experiments/ocean-currents.png",

  standards: {
    ngss: ["MS-ESS2-6", "HS-ESS2-5"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: [
    "ocean currents",
    "thermohaline circulation",
    "Gulf Stream",
    "Coriolis effect",
    "global conveyor belt",
    "Earth science",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "windStrength",
      label: "Wind Strength",
      unit: "%",
      min: 0,
      max: 100,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "tempDiff",
      label: "Equator-Pole Temp Difference",
      unit: "°C",
      min: 5,
      max: 40,
      default: 25,
      step: 1,
      tier: "free",
    },
    {
      id: "salinity",
      label: "Polar Salinity",
      unit: "ppt",
      min: 30,
      max: 40,
      default: 35,
      step: 0.5,
      tier: "free",
    },
    {
      id: "particleCount",
      label: "Particle Density",
      unit: "",
      min: 100,
      max: 2000,
      default: 800,
      step: 100,
      tier: "free",
    },
    {
      id: "showLabels",
      label: "Show Current Labels (0=off, 1=on)",
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
      latex: "\\rho = \\rho_0(1 - \\alpha(T - T_0) + \\beta(S - S_0))",
      description:
        "Seawater density depends on temperature T (warmer = less dense) and salinity S (saltier = denser)",
    },
    {
      latex: "F_{\\text{Coriolis}} = -2m\\vec{\\Omega} \\times \\vec{v}",
      description:
        "Coriolis force deflects moving water right in Northern Hemisphere, left in Southern",
    },
  ],

  theory:
    "Ocean currents are driven by two main mechanisms: wind (surface currents) and density differences (deep thermohaline circulation). Trade winds and westerlies push surface water, while the Coriolis effect deflects currents to the right in the Northern Hemisphere and left in the Southern. This creates circular gyres — clockwise in the north, counterclockwise in the south. Western boundary currents (like the Gulf Stream) are narrow, deep, and fast; eastern boundary currents are broad, shallow, and slow. Thermohaline circulation is driven by cold, salty water sinking in polar regions (high density) and warm water rising near the equator. This 'global conveyor belt' takes about 1000 years for a complete cycle and redistributes heat globally, moderating climate. Changes in thermohaline circulation (e.g., from melting ice reducing salinity) can have dramatic climate effects.",

  instructions:
    "Watch particles trace ocean current paths across a simplified world map. Adjust wind strength to see how surface currents change. Modify the temperature difference and polar salinity to observe thermohaline circulation effects. Toggle labels to identify major current systems.",

  challenges: [
    {
      id: "oc-c1",
      question: "Why is the Gulf Stream a warm current flowing northward along the US East Coast?",
      hint: "Warm equatorial water is pushed westward by trade winds, piles up in the Caribbean, and flows north along the coast as a western boundary current",
      tier: "free",
    },
    {
      id: "oc-c2",
      question: "What would happen to thermohaline circulation if polar ice melted rapidly?",
      hint: "Fresh meltwater reduces salinity, lowering density. If polar water isn't dense enough to sink, the conveyor belt slows or shuts down, disrupting global heat distribution",
      tier: "free",
    },
    {
      id: "oc-c3",
      question: "Why are western boundary currents (Gulf Stream, Kuroshio) faster than eastern boundary currents?",
      hint: "The Coriolis effect and the westward intensification of ocean gyres compress currents against western continental margins, making them narrower and faster",
      tier: "pro",
    },
  ],

  wave: 12,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["climate-change-modeling", "atmosphere-layers"],
  htmlPath: "/experiments/earth-science/ocean-currents.html",

  seoTitle: "Ocean Currents Simulation | Scivra Earth Science",
  seoKeywords: [
    "ocean currents simulation",
    "thermohaline circulation interactive",
    "Gulf Stream visualization",
    "global conveyor belt",
    "NGSS Earth science",
    "Coriolis effect ocean",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Ocean Currents and Thermohaline Circulation",
  },
  contentSections: {
    whatIsIt:
      "The ocean is never still. Beneath the surface, water moves in vast rivers that span entire ocean basins — some carrying as much water as all the world's rivers combined. These ocean currents are driven by two main forces working together. At the surface, wind pushes water along, and Earth's rotation (the Coriolis effect) bends those moving water masses into giant circular loops called gyres. In the Northern Hemisphere, gyres rotate clockwise; in the Southern Hemisphere they rotate counterclockwise. Deeper down, a completely separate system operates — the thermohaline circulation, sometimes called the global ocean conveyor belt. This system is driven by differences in water density: cold water is denser than warm water, and saltier water is denser than fresher water. Near the poles, ocean water gets very cold and very salty as sea ice forms (ice freezes out as fresh water, leaving extra salt behind), making it dense enough to sink to the ocean floor. This cold, dense water then creeps slowly along the bottom of the ocean toward the equator, while warm surface water flows in from lower latitudes to replace it — completing a global circuit that can take roughly 1,000 years for a single water parcel to travel all the way around. This circulation is critically important for distributing heat around the planet and moderating regional climates.",
    parameterExplanations: {
      windStrength:
        "Controls how strongly the prevailing winds are driving the ocean surface, from 0 percent (no wind-driven currents) to 100 percent (maximum wind forcing). Increasing wind strength makes surface gyres more pronounced, speeds up boundary currents like the Gulf Stream, and strengthens the wind-driven Ekman transport that moves surface water across ocean basins. At 0 percent, only thermohaline density-driven circulation remains visible.",
      tempDiff:
        "Sets the temperature contrast between equatorial and polar ocean water, from 5 degrees Celsius (nearly uniform ocean) to 40 degrees (strong pole-to-equator temperature gradient). A larger temperature difference increases the density contrast that drives thermohaline sinking at the poles and the return flow of warm water from the equator. This parameter most directly affects the strength of the deep ocean conveyor belt.",
      salinity:
        "Sets the salinity of polar ocean water in parts per thousand (ppt), from 30 (relatively fresh, similar to conditions near melting ice) to 40 (highly saline). Higher polar salinity increases the density of polar water, making it sink more readily and strengthening thermohaline circulation. Lower salinity — which would result from melting ice sheets adding fresh water — reduces density and can weaken or disrupt the conveyor belt.",
      particleCount:
        "Controls how many tracer particles are shown flowing through the ocean, from 100 (sparse, easier to follow individual paths) to 2000 (dense, better for seeing the overall current pattern). Use fewer particles to trace specific current pathways; use more particles to see the full global circulation structure and identify where gyres, boundary currents, and deep water formation occur.",
      showLabels:
        "Toggles current name labels on (1) or off (0). When labels are on, major named currents such as the Gulf Stream, North Atlantic Drift, Kuroshio, and Antarctic Circumpolar Current are identified on the map. Turning labels off is useful for assessment or guessing activities where students identify current systems from flow patterns alone.",
    },
    misconceptions: [
      {
        wrong: "Ocean currents only exist at the surface.",
        correct:
          "Surface currents typically extend only a few hundred meters deep, but the thermohaline circulation involves the entire depth of the ocean — down to 4,000 meters or more in some places. Deep ocean currents, driven by density differences, move very slowly (centimeters per day) but transport enormous volumes of water globally. Without this deep circulation, the ocean's heat and chemical properties would be distributed very differently than they are.",
      },
      {
        wrong: "The Gulf Stream keeps Europe warm entirely on its own.",
        correct:
          "The Gulf Stream and its North Atlantic extension do transport a significant amount of heat northward, contributing to milder winters in western Europe compared to eastern Canada at similar latitudes. However, atmospheric circulation patterns — particularly the prevailing westerly winds off the relatively warm Atlantic — also play a major role. Scientists continue to study the relative contributions of ocean and atmosphere to Europe's climate.",
      },
      {
        wrong: "Ocean currents move in straight lines between continents.",
        correct:
          "Ocean currents follow curved paths shaped by the Coriolis effect (Earth's rotation deflects moving water), the positions of continents and ocean basins, wind patterns, and seafloor topography. The result is large curved gyres and boundary currents that flow along continental margins. The Gulf Stream, for example, follows the curve of the North American coast before veering northeast across the open Atlantic.",
      },
      {
        wrong: "Melting Arctic sea ice is the main threat to thermohaline circulation.",
        correct:
          "Sea ice is already floating, so its melting does not directly add fresh water to the ocean in the same way that melting land ice (from Greenland and glaciers) does. The more significant threat to thermohaline circulation comes from melting land-based ice sheets, which pour fresh meltwater into the North Atlantic. This fresh water reduces surface salinity, lowering density and reducing the sinking of cold water that drives the conveyor belt.",
      },
    ],
    teacherUseCases: [
      "Set windStrength to 0 percent and observe the resulting circulation, then increase to 100 percent — students compare the two patterns and identify which currents are wind-driven versus density-driven, building the two-mechanism mental model (MS-ESS2-6).",
      "Hold windStrength at 50 percent and tempDiff at 25 degrees, then lower salinity from 35 to 30 ppt in steps and observe how thermohaline circulation slows — connect to real-world concern about Greenland ice melt adding fresh water to the North Atlantic.",
      "Turn showLabels to 1 and trace the complete path of the global conveyor belt with students, identifying where deep water forms (polar regions), where it upwells (equatorial and Southern Ocean), and which named surface currents complete the return loop at the surface.",
      "Set particleCount to 100 and windStrength to 80 percent, then ask students to identify one particle near Florida and track it along the Gulf Stream northeastward — they observe how a western boundary current carries warm water toward higher latitudes, supporting discussion of how ocean currents moderate regional climate.",
    ],
    faq: [
      {
        question: "How long does it take water to travel all the way around the global ocean conveyor belt?",
        answer:
          "Scientists estimate that a complete circuit of the thermohaline conveyor belt takes roughly 1,000 years on average, though this varies considerably along different parts of the route. Deep water that sinks in the North Atlantic takes centuries to slowly creep along the seafloor to the Indian or Pacific Ocean, where it eventually upwells back to the surface. This long timescale means the deep ocean is a vast reservoir that stores heat and carbon dioxide for centuries before releasing it back into contact with the atmosphere.",
      },
      {
        question: "Why does the Coriolis effect make currents curve instead of going straight?",
        answer:
          "Earth rotates beneath everything moving across its surface. From the perspective of someone standing on a rotating Earth, any object or fluid moving over a long distance appears to curve — to the right in the Northern Hemisphere and to the left in the Southern Hemisphere. It is not a real force pushing things sideways; it is an apparent effect caused by the rotating reference frame. Ocean currents moving over thousands of kilometers are deflected enough by this effect to form the large circular gyres we see on global current maps.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation directly supports MS-ESS2-6, which asks students to develop and use a model to describe how unequal heating and rotation of Earth cause patterns of atmospheric and oceanic circulation that determine regional climates. It also connects to HS-ESS2-5 by exploring how the ocean circulation system influences regional climate stability and how changes in salinity or temperature could alter that circulation. The thermohaline disruption scenario links to MS-ESS3-5 regarding human impacts and climate change.",
      },
      {
        question: "What would happen to global climate if the ocean conveyor belt stopped?",
        answer:
          "Climate models suggest that a significant slowdown of the Atlantic thermohaline circulation could cause substantial cooling in northwestern Europe and parts of the North Atlantic region, because less warm tropical water would be carried northward. It could also alter monsoon patterns and rainfall distribution across the tropics and subtropics. The conveyor belt has slowed and possibly shifted during past ice ages, contributing to rapid regional temperature swings. Scientists monitor it with deep-sea sensor arrays because even a partial slowdown would have wide-reaching climate consequences.",
      },
      {
        question: "Why is the Gulf Stream narrow and fast while eastern boundary currents are wide and slow?",
        answer:
          "This asymmetry is a result of how the Coriolis effect and wind patterns interact with the shape of ocean basins — a phenomenon called westward intensification. In the North Atlantic gyre, water is continuously piling up along the western boundary (near North America) by the wind-driven circulation, and the Coriolis effect prevents it from simply spreading out. The result is a narrow, deep, fast jet — the Gulf Stream — along the western side, and a broad, shallow, slow return flow along the eastern side. The same pattern occurs in the Pacific with the Kuroshio Current.",
      },
    ],
  },
};
