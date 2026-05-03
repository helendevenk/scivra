import type { Experiment } from "@/shared/types/experiment";

export const oceanCurrents: Experiment = {
  id: "ocean-currents",
  slug: "ocean-currents",
  title: "Ocean Currents",
  subtitle: "Global thermohaline circulation and surface wind-driven currents",
  description:
    "Visualize global ocean circulation patterns driven by water temperature, salinity, and density differences. Observe surface currents like the Gulf Stream and deep thermohaline circulation (the global conveyor belt). Adjust water temperature and salinity, then compare three preset current systems to see how density-driven flow redistributes heat across the planet.",
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
      id: "temperature",
      label: "Water Temperature",
      unit: "°C",
      min: -2,
      max: 30,
      default: 15,
      step: 1,
      tier: "free",
    },
    {
      id: "salinity",
      label: "Salinity",
      unit: "ppt",
      min: 30,
      max: 40,
      default: 35,
      step: 0.5,
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
    "Use the Water Temperature and Salinity sliders to investigate how density differences help drive thermohaline circulation. Compare the Thermohaline Conveyor, Gulf Stream, and Coastal Upwelling presets to connect slider values with three ocean-current patterns: deep density-driven overturning, fast warm surface transport, and cold nutrient-rich water rising near coasts. Focus on how changes in temperature and salinity alter seawater density, sinking, upwelling, and heat redistribution across ocean basins.",

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
  htmlControlAliases: { temperature: "tempSlider", salinity: "salSlider" },
  presets: [
    {
      id: "thc",
      label: "Thermohaline Conveyor",
      description:
        "A cold, moderately salty setup that emphasizes density-driven sinking and the slow global overturning circulation.",
      paramValues: { temperature: 4, salinity: 35 },
    },
    {
      id: "gulf",
      label: "Gulf Stream",
      description:
        "A warm, slightly saltier setup that highlights poleward heat transport by a fast western boundary current.",
      paramValues: { temperature: 25, salinity: 36 },
    },
    {
      id: "upwell",
      label: "Coastal Upwelling",
      description:
        "A cool, slightly fresher setup that helps students compare rising deep water with surface-current pathways near coasts.",
      paramValues: { temperature: 10, salinity: 34 },
    },
  ],
  contentSections: {
    whatIsIt:
      "The ocean is never still. Beneath the surface, water moves in vast rivers that span entire ocean basins — some carrying as much water as all the world's rivers combined. These ocean currents are driven by two main forces working together. At the surface, wind pushes water along, and Earth's rotation (the Coriolis effect) bends those moving water masses into giant circular loops called gyres. In the Northern Hemisphere, gyres rotate clockwise; in the Southern Hemisphere they rotate counterclockwise. Deeper down, a completely separate system operates — the thermohaline circulation, sometimes called the global ocean conveyor belt. This system is driven by differences in water density: cold water is denser than warm water, and saltier water is denser than fresher water. Near the poles, ocean water gets very cold and very salty as sea ice forms (ice freezes out as fresh water, leaving extra salt behind), making it dense enough to sink to the ocean floor. This cold, dense water then creeps slowly along the bottom of the ocean toward the equator, while warm surface water flows in from lower latitudes to replace it — completing a global circuit that can take roughly 1,000 years for a single water parcel to travel all the way around. This circulation is critically important for distributing heat around the planet and moderating regional climates.",
    parameterExplanations: {
      temperature:
        "Water Temperature changes seawater density, which is central to thermohaline circulation. Colder water has molecules packed more closely together, so it tends to be denser and can sink when it is also salty enough. Warmer water is less dense and more likely to remain near the surface, where currents can carry heat from low latitudes toward higher latitudes. Use this slider to compare cold conveyor-belt conditions with warm Gulf Stream conditions. This supports MS-ESS2-6 by modeling how unequal heating and Earth's rotation shape ocean circulation patterns, and it supports HS-ESS2-4 by showing how energy moves through Earth systems as ocean water transports heat.",
      salinity:
        "Salinity measures how much dissolved salt is in seawater, in parts per thousand. Saltier water is denser than fresher water, so increasing salinity can help water sink and strengthen density-driven overturning. Lower salinity represents fresher conditions, such as meltwater entering the ocean, which can reduce surface-water density and weaken deep-water formation. Keep temperature steady while changing salinity to isolate how dissolved salt affects circulation, then compare the Thermohaline Conveyor and Coastal Upwelling presets. This aligns with MS-ESS2-6 because students use a model to explain ocean circulation patterns, and with HS-ESS2-4 because salt-driven density differences help transfer matter and energy through Earth systems.",
    },
    misconceptions: [
      {
        wrong: "Ocean currents only exist at the surface.",
        correct:
          "Surface currents typically extend only a few hundred meters deep, but the thermohaline circulation involves the entire depth of the ocean — down to 4,000 meters or more in some places. Deep ocean currents, driven by density differences, move very slowly (centimeters per day) but transport enormous volumes of water globally. Use the Thermohaline Conveyor preset to focus on this deep circulation rather than only the visible surface path.",
      },
      {
        wrong: "The Gulf Stream keeps Europe warm entirely on its own.",
        correct:
          "The Gulf Stream and its North Atlantic extension do transport a significant amount of heat northward, contributing to milder winters in western Europe compared to eastern Canada at similar latitudes. However, atmospheric circulation patterns — particularly the prevailing westerly winds off the relatively warm Atlantic — also play a major role. The Gulf Stream preset is best used as a model of ocean heat transport, not as the only explanation for regional climate.",
      },
      {
        wrong: "Ocean currents move in straight lines between continents.",
        correct:
          "Ocean currents follow curved paths shaped by the Coriolis effect (Earth's rotation deflects moving water), the positions of continents and ocean basins, wind patterns, density differences, and seafloor topography. The result is large curved gyres, boundary currents, sinking zones, and upwelling regions. Compare the three presets to see that different current systems have different pathways rather than one simple straight-line route.",
      },
      {
        wrong: "Melting Arctic sea ice is the main threat to thermohaline circulation.",
        correct:
          "Sea ice melt can freshen surface water locally and reduce salinity in that area, but land ice adds entirely new freshwater to the ocean and is the major concern for the Atlantic overturning circulation (sometimes abbreviated AMOC). Melting land-based ice sheets such as Greenland pour fresh meltwater into the North Atlantic, reducing surface salinity, lowering density, and reducing the sinking of cold water that drives the conveyor belt — the primary threat to thermohaline circulation.",
      },
    ],
    teacherUseCases: [
      "Start with the Thermohaline Conveyor preset, then have students lower Salinity from 35 to 30 ppt while keeping Water Temperature cold. Students explain how freshening can reduce density and weaken sinking, supporting the ocean-circulation model in MS-ESS2-6.",
      "Use the Gulf Stream preset to discuss warm-water heat transport. Ask students to connect the high Water Temperature value to energy transfer through the ocean system and regional climate patterns while keeping the NGSS focus on circulation and climate.",
      "Use the Coastal Upwelling preset as a compare-and-contrast activity. Students describe how cool water near the surface differs from the warm Gulf Stream setup, then explain why upwelling matters for matter cycling, nutrients, and Earth-system interactions.",
      "Run a two-variable investigation: students change only Water Temperature for one trial and only Salinity for another, then write a CER paragraph explaining which change most increased or reduced density-driven circulation in the model.",
      "Have students choose one preset, record its Water Temperature and Salinity values, and defend why those values fit the named current pattern. Keep the discussion tied to MS-ESS2-6 and the role of ocean circulation in determining regional climates.",
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
          "This simulation directly supports MS-ESS2-6, which asks students to develop and use a model to describe how unequal heating and rotation of Earth cause patterns of atmospheric and oceanic circulation that determine regional climates. It also connects to HS-ESS2-5 by exploring how the ocean circulation system influences regional climate stability and how changes in salinity or temperature could alter that circulation. The Thermohaline Conveyor, Gulf Stream, and Coastal Upwelling presets help students compare density-driven overturning, warm-water heat transport, and rising deep water.",
      },
      {
        question: "What would happen to global climate if the ocean conveyor belt stopped?",
        answer:
          "Climate models suggest that a significant slowdown of the Atlantic thermohaline circulation could cause substantial cooling in northwestern Europe and parts of the North Atlantic region, because less warm tropical water would be carried northward. It could also alter monsoon patterns and rainfall distribution across the tropics and subtropics. In this model, lowering salinity while keeping water cold is a useful way to represent how freshening can make surface water less dense and reduce sinking. Scientists monitor overturning circulation with deep-sea sensor arrays because even a partial slowdown would have wide-reaching climate consequences.",
      },
      {
        question: "Why is the Gulf Stream narrow and fast while eastern boundary currents are wide and slow?",
        answer:
          "This asymmetry is a result of how the Coriolis effect and wind patterns interact with the shape of ocean basins — a phenomenon called westward intensification. In the North Atlantic gyre, water is continuously piling up along the western boundary (near North America) by the wind-driven circulation, and the Coriolis effect prevents it from simply spreading out. The result is a narrow, deep, fast jet — the Gulf Stream — along the western side, and a broad, shallow, slow return flow along the eastern side. Use the Gulf Stream preset to focus students on warm-water transport along a western boundary current.",
      },
    ],
  },
};
