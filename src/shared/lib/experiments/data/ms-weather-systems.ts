import type { Experiment } from "@/shared/types/experiment";

export const msWeatherSystems: Experiment = {
  id: "ms-weather-systems",
  slug: "ms-weather-systems",
  title: "Weather Systems & Atmosphere",
  subtitle: "Air pressure, fronts, cyclones, and precipitation",
  description:
    "Model atmospheric dynamics: watch warm and cold air masses collide to form fronts. See how pressure differences create wind. Track a hurricane developing over warm ocean water. Explore why warm air rises (convection) and how clouds and precipitation form.",
  thumbnail: "/imgs/experiments/ms-weather-systems.png",

  standards: {
    ngss: ["MS-ESS2-5", "MS-ESS2-6", "MS-ESS3-5"],
    gcse: ["P7.1"],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: ["weather", "atmosphere", "air pressure", "fronts", "hurricane", "climate", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "windSpeed",
      label: "Wind Speed",
      unit: "km/h",
      min: 0,
      max: 80,
      default: 20,
      step: 1,
      tier: "free",
    },
    {
      id: "temperatureGradient",
      label: "Temperature Gradient",
      unit: "°C",
      min: 0,
      max: 40,
      default: 15,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "P = \\frac{F}{A} \\quad \\text{High P} \\to \\text{fair} \\quad \\text{Low P} \\to \\text{storms}",
      description: "High pressure = descending air = fair weather; low pressure = rising air = storms",
    },
    {
      latex: "\\text{Cold front: fast, steep} \\quad \\text{Warm front: slow, gentle}",
      description: "Cold fronts produce brief intense rain; warm fronts bring steady drizzle",
    },
  ],

  theory:
    "Weather is driven by unequal heating of Earth's surface and atmosphere. Warm air is less dense and rises (low pressure forms); cool air is denser and sinks (high pressure). These pressure differences drive wind from high to low pressure. Fronts are boundaries between air masses: a cold front occurs when cold, dense air pushes under warm air — causes sharp temperature drops, brief heavy rain. A warm front occurs when warm air glides over cold air — brings slow, steady precipitation. Coriolis effect (Earth's rotation) deflects wind paths, creating the large-scale circulation patterns. Hurricanes form over warm ocean water (≥26°C): warm moist air rises rapidly, condenses, releases latent heat, further driving updrafts in a self-reinforcing cycle.",

  instructions:
    "Use the Wind Speed slider to strengthen or weaken air movement, and use the Temperature Gradient slider to change how sharply warm and cold air masses contrast. Try the Cold Front, High Pressure, and Hurricane presets to compare stormy lifting, clear sinking air, and rotating tropical storm organization.",

  challenges: [
    {
      id: "wx-ms-c1",
      question: "Why does weather generally move from west to east across the United States?",
      hint: "The Westerlies — prevailing wind patterns at mid-latitudes that blow from west to east. These are caused by the temperature difference between the equator and poles combined with Earth's rotation (Coriolis effect), which deflects air to the right in the Northern Hemisphere.",
      tier: "free",
    },
    {
      id: "wx-ms-c2",
      question: "What causes thunder and lightning during a thunderstorm?",
      hint: "Lightning: electrical charge builds up between cloud and ground (or within clouds) as ice crystals and water droplets collide. When the charge difference is large enough, a rapid electrical discharge (lightning bolt) occurs. Thunder: lightning superheats air to ~30,000°C, causing rapid expansion → shock wave → sound.",
      tier: "free",
    },
    {
      id: "wx-ms-c3",
      question: "Why do tornadoes and hurricanes spin in opposite directions in the Northern vs Southern Hemisphere?",
      hint: "The Coriolis effect (from Earth's rotation) deflects moving air to the right in the Northern Hemisphere and to the left in the Southern Hemisphere. This causes storms to rotate counterclockwise in the North and clockwise in the South.",
      tier: "free",
    },
    {
      id: "wx-ms-c4",
      question: "Why do hurricanes weaken when they move over land or cooler water?",
      hint: "Hurricanes are powered by latent heat from warm, moist ocean water evaporating into the storm system. Over land (no water source) or cooler water (<26°C), evaporation drops dramatically → less latent heat released → the storm engine loses its fuel → weakens rapidly.",
      tier: "pro",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 13,
  relatedExperiments: ["k5-water-cycle", "ms-plate-tectonics"],

  seoTitle: "Weather Systems Middle School | Scivra Earth Science Simulation",
  seoKeywords: [
    "weather systems middle school simulation",
    "air pressure fronts interactive 6-8",
    "hurricane formation simulation",
    "cold warm front weather",
    "atmosphere climate middle school",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Weather Systems and Atmosphere",
  },
  htmlControlAliases: { windSpeed: "windSlider", temperatureGradient: "tempGradSlider" },
  presets: [
    {
      id: "loadPreset:coldfront",
      label: "Cold Front (thunderstorms)",
      description:
        "A cold front pushes dense cold air under warm air, forcing rapid lifting that can build tall clouds, gusty winds, and brief intense thunderstorms.",
    },
    {
      id: "loadPreset:highpressure",
      label: "High Pressure (clear)",
      description:
        "A high-pressure setup shows sinking air, weaker cloud formation, and calmer clear-weather conditions compared with active storm systems.",
    },
    {
      id: "loadPreset:hurricane",
      label: "Hurricane",
      description:
        "A hurricane preset organizes fast-moving air around a low-pressure center, highlighting rotation, inflow, and the storm structure produced by strong atmospheric energy.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Weather is the result of the atmosphere constantly trying to balance out temperature and pressure differences created by unequal heating of Earth's surface. When the Sun warms a patch of land or ocean, the air above it heats up, becomes less dense, and rises — much like a hot air balloon. Cooler, denser air rushes in to fill the gap, creating wind. Where a mass of cold air pushes into a region of warm air, or warm air glides over colder air, the boundary between them is called a front — and fronts are where most of the exciting weather happens. Cold fronts tend to sweep in quickly and produce brief, intense storms. Warm fronts move more slowly and bring steady rain or drizzle that can last for days. When the conditions are just right over warm ocean water — warm moist air rising rapidly, pressure dropping, Earth's rotation imparting a spin — a tropical cyclone can organize and intensify into a hurricane. All of these events are connected through the same basic physics: air moves from high pressure to low pressure, warm air rises while cold air sinks, and moisture rises, cools, and condenses to form clouds and precipitation.",
    parameterExplanations: {
      windSpeed:
        "Wind Speed controls how quickly air moves through the weather system, from calm conditions to strong flow. Faster wind shows that larger pressure differences can move air more forcefully from high-pressure regions toward low-pressure regions. In a cold-front setup, increasing wind speed can make the boundary look more active because air is being pushed and lifted more quickly. In a high-pressure setup, lower wind speeds help students see why sinking, spreading air is often connected with calmer weather. Use this slider with one preset at a time so students can connect the visible motion to pressure gradients instead of treating wind as random movement.",
      temperatureGradient:
        "Temperature Gradient controls how sharply warm and cold air contrast across the scene. A low gradient means the air masses are more similar, so the model tends to show gentler lifting and less dramatic organization. A high gradient creates a stronger density contrast: warm air rises more readily, cold air undercuts more strongly, and fronts or storms can look more energetic. This slider is useful for comparing cause and effect because students can keep the preset fixed, then change only the gradient and observe how cloud growth, circulation, or front intensity responds. It connects unequal heating directly to the weather patterns described by middle-school Earth science standards.",
    },
    misconceptions: [
      {
        wrong: "High pressure always means a storm is coming.",
        correct:
          "High pressure is associated with fair, calm weather — not storms. In a high-pressure system, air is descending from above, which suppresses cloud formation and precipitation. It is low pressure systems, where air rises, cools, and condenses, that typically produce cloudy skies and storms. Weather forecasters look for falling barometric pressure as a sign that stormy weather may be approaching.",
      },
      {
        wrong: "Hurricanes spin the same direction everywhere on Earth.",
        correct:
          "Hurricanes in the Northern Hemisphere rotate counterclockwise because Earth's rotation deflects moving air to the right (the Coriolis effect), causing air flowing into a low-pressure center to curve and create a counterclockwise spin. In the Southern Hemisphere the deflection is to the left, so equivalent tropical cyclones (called typhoons or cyclones depending on region) rotate clockwise. A storm cannot cross the equator and maintain its rotation because the Coriolis direction reverses.",
      },
      {
        wrong: "Clouds are made of water vapor.",
        correct:
          "Water vapor is an invisible gas — you cannot see it. Clouds are made of tiny liquid water droplets or ice crystals that form when water vapor cools past its dew point and condenses onto tiny particles in the air called condensation nuclei. The white or grey appearance of a cloud is from light scattering off these millions of microscopic droplets or crystals. Fog is simply a cloud that forms at ground level.",
      },
      {
        wrong: "Cold fronts and warm fronts produce the same type of weather.",
        correct:
          "Cold fronts and warm fronts produce distinctly different weather patterns because of how they push air masses against each other. Cold fronts are steep and fast-moving, forcing warm air upward rapidly — this produces cumulonimbus thunderstorms with heavy brief rain and a sharp temperature drop after the front passes. Warm fronts slope gently and move slowly, producing a wide zone of stratiform clouds and steady light rain or drizzle, followed by gradually warming temperatures.",
      },
    ],
    teacherUseCases: [
      "Start with the Cold Front preset, set Wind Speed to 20 and Temperature Gradient to 15, then increase one slider at a time so students can collect evidence for how air-mass interactions change weather conditions (MS-ESS2-5).",
      "Use the High Pressure preset as a contrast case: students record how lower wind and weaker temperature contrast support calmer, clearer conditions, then compare that evidence with the Cold Front preset.",
      "Have students choose the Hurricane preset, raise Wind Speed in steps, and describe how stronger inflow and rotation change the storm structure while keeping the Temperature Gradient constant.",
      "Run a predict-observe-explain routine across all three presets: Cold Front, High Pressure, and Hurricane. Students predict the visible air motion first, then cite slider values and observations to revise their explanations.",
      "Ask students to graph Temperature Gradient against observed storm intensity under the Cold Front preset, then connect the pattern to unequal heating, density differences, and atmospheric circulation (MS-ESS2-6).",
    ],
    faq: [
      {
        question: "Why does weather in the United States typically move from west to east?",
        answer:
          "At the mid-latitudes where most of the United States lies, the dominant wind pattern is the westerlies — prevailing winds that blow from west to east. These winds are the result of temperature differences between the warm equator and cold poles combined with Earth's rotation. The Coriolis effect deflects air to the right in the Northern Hemisphere, turning what would be straight north-south winds into a roughly west-to-east flow at mid-latitudes. Weather systems embedded in these winds are carried along from west to east across the continent.",
      },
      {
        question: "What is the difference between weather and climate?",
        answer:
          "Weather is what is happening in the atmosphere right now or over the next few days — today's temperature, whether it is raining, how strong the wind is. Climate is the long-term average pattern of weather over decades in a particular region. The phrase often used to distinguish them is that climate is what you expect, weather is what you get. A single hot summer day is weather; the pattern of increasingly hot summers over 30 years is a climate signal.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports MS-ESS2-5 (collect data to provide evidence for how the motions and complex interactions of air masses result in changes in weather conditions) and MS-ESS2-6 (develop and use a model to describe how unequal heating and rotation of Earth cause patterns of atmospheric and oceanic circulation that determine regional climates). The Hurricane preset also connects to MS-ESS3-5, analyzing and interpreting data on natural hazards to forecast future risks.",
      },
      {
        question: "How does a meteorologist forecast the weather?",
        answer:
          "Modern weather forecasting combines data from thousands of weather stations, weather balloons, ocean buoys, satellites, and Doppler radar into supercomputer models that simulate the entire atmosphere. The models are run forward in time to predict how pressure systems and fronts will move. Forecasters interpret the model output, look for where different models disagree, and apply local knowledge to produce the final forecast. Short-range forecasts (1 to 2 days) are quite reliable; accuracy decreases for longer time horizons because small errors in the initial data grow over time — the famous butterfly effect.",
      },
      {
        question: "Why do thunderstorms produce lightning?",
        answer:
          "Inside a thunderstorm cloud, ice crystals near the top and water droplets lower down collide violently in strong updrafts and downdrafts. These collisions transfer electric charge — smaller positively charged ice particles get carried to the top of the cloud while larger negatively charged ones stay lower. When the charge difference between the bottom of the cloud and the ground (or another part of the cloud) becomes large enough, a rapid electrical discharge occurs — a lightning bolt. The intense heat of the bolt — reaching temperatures hotter than the surface of the Sun for a fraction of a second — causes the surrounding air to expand explosively, producing the sound wave we hear as thunder.",
      },
    ],
  },
};
