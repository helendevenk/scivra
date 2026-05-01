import type { Experiment } from "@/shared/types/experiment";

export const waterCycleDetail: Experiment = {
  id: "water-cycle-detail",
  slug: "water-cycle-detail",
  title: "Water Cycle (Detailed)",
  subtitle: "Evaporation, condensation, precipitation, and groundwater flow",
  description:
    "Explore the complete water cycle with quantitative tracking. Follow water molecules through evaporation, cloud formation, precipitation, surface runoff, infiltration, and groundwater flow. Adjust temperature, humidity, and terrain to see how the water cycle responds to changing conditions.",
  thumbnail: "/imgs/experiments/water-cycle-detail.png",
  standards: { ngss: ["MS-ESS2-4", "HS-ESS2-5"], gcse: [], ap: [] },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: ["water cycle", "evaporation", "precipitation", "groundwater", "condensation", "Earth science"],
  difficulty: "beginner",
  parameters: [
    { id: "temperature", label: "Temperature", unit: "°C", min: -10, max: 40, default: 20, step: 1, tier: "free" },
    { id: "humidity", label: "Humidity", unit: "%", min: 10, max: 100, default: 60, step: 5, tier: "free" },
    { id: "terrain", label: "Terrain (0=flat, 1=mountain, 2=coastal)", unit: "", min: 0, max: 2, default: 1, step: 1, tier: "free" },
  ],
  formulas: [
    { latex: "E \\propto (e_s - e_a) \\cdot v", description: "Evaporation rate depends on saturation deficit and wind speed" },
  ],
  theory: "The water cycle (hydrological cycle) moves water between atmosphere, land, and oceans. Solar energy drives evaporation from water surfaces and transpiration from plants (evapotranspiration). Water vapor rises, cools adiabatically, and condenses into clouds when reaching the dew point. Precipitation occurs when droplets grow large enough to fall. On land, water follows multiple paths: surface runoff into streams and rivers, infiltration into soil, and percolation into groundwater aquifers. Groundwater slowly flows toward discharge points (springs, rivers, oceans). Temperature increases evaporation rates; mountains force orographic lift causing precipitation on windward slopes.",
  instructions: "Watch water particles cycle through the atmosphere and landscape. Adjust temperature to change evaporation rates, humidity to affect cloud formation, and terrain to see orographic effects. Track the water budget in real time.",
  challenges: [
    { id: "wcd-c1", question: "Why does it rain more on the windward side of mountains?", hint: "Air is forced upward (orographic lift), cools adiabatically, reaches dew point, and precipitates. The leeward side gets a rain shadow.", tier: "free" },
    { id: "wcd-c2", question: "If temperature increases by 5°C globally, what happens to evaporation?", hint: "Evaporation increases (warmer air holds more moisture), intensifying the water cycle — more evaporation AND more precipitation", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 15,
  relatedExperiments: ["climate-change-modeling", "ocean-currents"],
  htmlPath: "/experiments/earth-science/water-cycle-detail.html",
  seoTitle: "Water Cycle Detailed Simulation | Scivra Earth Science",
  seoKeywords: ["water cycle simulation", "hydrological cycle interactive", "evaporation condensation", "NGSS Earth science"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Middle School", teaches: "Water Cycle" },
  contentSections: {
    whatIsIt:
      "The water cycle — also called the hydrological cycle — is the continuous journey water takes as it moves between the atmosphere, land surface, and underground. The same water molecules that fall as rain today may have once been part of an ancient ocean, a glacier, a cloud over a rainforest, or a river in a desert. The cycle is powered almost entirely by the Sun, which provides the energy needed to evaporate water from oceans and lakes. Gravity then pulls that water back down as precipitation. This simulation tracks individual water particles through each stage: evaporation from the surface, condensation into clouds, precipitation as rain or snow, surface runoff into streams, infiltration into soil, and slow movement through underground aquifers. Changing temperature, humidity, and terrain type shows how the cycle responds to different environmental conditions — a connection directly relevant to understanding droughts, floods, and how climate change is intensifying the water cycle globally.",
    parameterExplanations: {
      temperature:
        "Sets the surface air temperature in degrees Celsius (-10 to 40°C). Temperature is the most direct control on evaporation rate — warmer air holds more water vapor (following a relationship called the Clausius-Clapeyron equation, though students need only understand the basic idea: warm air is thirstier). At low temperatures, evaporation slows and precipitation may fall as snow. At high temperatures, evaporation accelerates, moisture builds quickly in the atmosphere, and the water cycle intensifies. A 1°C temperature increase raises the atmosphere's water-holding capacity by about 7%.",
      humidity:
        "Sets the relative humidity as a percentage (10–100%). Relative humidity describes how close the air is to being fully saturated with water vapor. At 100% humidity, the air is at its dew point and cannot hold more water — clouds form readily and precipitation follows. At low humidity, evaporated water disperses easily into dry air and clouds form more slowly. High humidity combined with high temperature creates the conditions for intense rainfall events.",
      terrain:
        "Selects the landscape type on a scale of 0 to 2. At 0 (flat), water flows slowly across the surface with high infiltration into soil and steady groundwater recharge. At 1 (mountain), air masses are forced upward (orographic lift), cooling rapidly and producing heavy precipitation on the windward side while a rain shadow forms on the leeward side. At 2 (coastal), the proximity of ocean water drives high evaporation rates and frequent onshore precipitation. Each terrain type produces a distinctly different pattern of water movement.",
    },
    misconceptions: [
      {
        wrong: "Water disappears when it evaporates.",
        correct:
          "Water changes state from liquid to gas (water vapor) during evaporation, but the water molecules are still there — they are just invisible because they are spread out in the air. The water cycle is closed: those same molecules will eventually condense into clouds and fall as precipitation somewhere else on Earth. Matter is conserved even when it changes phase.",
      },
      {
        wrong: "Clouds are made of water vapor.",
        correct:
          "Water vapor is an invisible gas. Clouds are made of tiny liquid water droplets or ice crystals that form when water vapor cools to the dew point and condenses around tiny particles called condensation nuclei (dust, pollen, sea salt). The visible white or gray color of clouds comes from these countless tiny droplets scattering light in all directions.",
      },
      {
        wrong: "Groundwater is found in large underground lakes or rivers.",
        correct:
          "Groundwater is not stored in caves or rivers underground. It fills the tiny pore spaces and cracks between rock and soil particles in a zone called an aquifer. Imagine squeezing water out of a wet sponge — that is closer to how groundwater is held. It moves slowly through these pore spaces, often taking decades or centuries to travel from a recharge area to a spring or well.",
      },
      {
        wrong: "Rain shadow deserts are dry because mountains block rain clouds.",
        correct:
          "Clouds are not physically blocked by mountains. Instead, air is forced upward on the windward side, cooling and dropping its moisture as rain or snow. By the time the air descends on the leeward side, it has lost most of its moisture and warms as it sinks — creating dry conditions. The Sahara's eastern portions and the Atacama Desert form partly through this orographic effect.",
      },
    ],
    teacherUseCases: [
      "Evaporation rate investigation: set terrain to 0 (flat) and humidity to 60%. Compare evaporation rates at temperature -5°C, 20°C, and 40°C by counting water particles rising from the surface over the same time period. Students graph temperature vs. evaporation rate and describe the relationship (MS-ESS2-4).",
      "Mountain rain shadow demonstration: set terrain to 1 (mountain) and observe where precipitation is heaviest. Then set terrain to 0 (flat) with the same temperature and humidity settings and compare precipitation distribution. Students draw a labeled diagram of the orographic lift process and explain why deserts often form on the leeward side of mountain ranges.",
      "Climate change water cycle connection: start at temperature 20°C, run the cycle, and record total evaporation and precipitation. Increase temperature to 35°C and repeat. Students compare the two scenarios and explain how a warmer world intensifies the water cycle — more evaporation, more moisture in the air, and more intense precipitation events when it does rain.",
      "Groundwater recharge: set terrain to 0 (flat) and observe how much water infiltrates vs. runs off at low humidity (30%) vs. high humidity (90%). Students explain why saturated soils during extended rain events lead to flooding — the ground cannot absorb more water when pore spaces are already full.",
    ],
    faq: [
      {
        question: "How does temperature affect how fast water evaporates?",
        answer:
          "Water molecules are always moving, but at higher temperatures they move faster on average. Faster-moving surface molecules have more energy to break free from the liquid and enter the air as vapor. Warmer air also has a higher capacity to hold water vapor before becoming saturated — think of warm air as a bigger sponge that can absorb more moisture before it drips. This is why hot, sunny days dry up puddles quickly while cold days leave them for hours.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation directly supports MS-ESS2-4, which asks students to develop a model to describe the cycling of water through Earth's systems driven by energy from the Sun and the force of gravity. It also connects to MS-ESS3-5 on how human activities affect Earth's natural systems — because changes in land use, deforestation, and climate warming all alter the rates and pathways of the water cycle in measurable ways.",
      },
      {
        question: "Why do mountains cause heavy rain on one side but desert on the other?",
        answer:
          "When moist air from an ocean or large body of water moves toward a mountain range, it is forced upward (a process called orographic lift). As air rises, it cools at a rate of about 10°C per 1,000 meters, eventually reaching the dew point where water vapor condenses into clouds and falls as rain or snow. By the time the air reaches the summit, it has lost most of its moisture. As it descends on the leeward (downwind) side, it warms and becomes even drier, producing a rain shadow — a region with much less precipitation than the windward side.",
      },
      {
        question: "How long does water stay in each part of the water cycle?",
        answer:
          "Residence time varies enormously. Water vapor in the atmosphere stays there for only about 9 days on average before condensing and falling. Soil moisture lasts weeks to months. River water travels from source to sea in days to months. But water locked in deep groundwater aquifers can remain underground for hundreds to thousands of years, and water stored in polar ice sheets has been frozen for hundreds of thousands of years. This means that once deep groundwater or glacial water is used up, it cannot be quickly replenished.",
      },
      {
        question: "Is the total amount of water on Earth changing?",
        answer:
          "The total amount of water on Earth stays essentially constant over human timescales — water is not created or destroyed in the water cycle, only moved and changed in phase. However, where that water is stored is changing. Glaciers and polar ice sheets are shrinking as the climate warms, releasing freshwater into the oceans and raising sea levels. Meanwhile, some aquifers are being pumped faster than they recharge, reducing available freshwater even though global totals remain the same.",
      },
    ],
  },
};
