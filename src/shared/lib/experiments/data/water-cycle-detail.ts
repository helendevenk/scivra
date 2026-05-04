import type { Experiment } from "@/shared/types/experiment";

export const waterCycleDetail: Experiment = {
  id: "water-cycle-detail",
  slug: "water-cycle-detail",
  title: "Water Cycle (Detailed)",
  subtitle: "Evaporation, condensation, precipitation, and groundwater flow",
  description:
    "Explore the complete water cycle with quantitative tracking. Follow water molecules through evaporation, cloud formation, precipitation, surface runoff, infiltration, and groundwater flow. Adjust solar intensity and temperature to see how the water cycle responds to changing conditions.",
  thumbnail: "/imgs/experiments/water-cycle-detail.png",
  standards: { ngss: ["MS-ESS2-4", "HS-ESS2-5"], gcse: [], ap: [] },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: ["water cycle", "evaporation", "precipitation", "groundwater", "condensation", "Earth science"],
  difficulty: "beginner",
  parameters: [
    { id: "solarIntensity", label: "Solar Intensity", unit: "%", min: 0, max: 200, default: 100, step: 1, tier: "free" },
    { id: "temperature", label: "Temperature", unit: "°C", min: -10, max: 40, default: 15, step: 1, tier: "free" },
  ],
  formulas: [
    { latex: "E \\propto (e_s - e_a) \\cdot v", description: "Evaporation rate depends on saturation deficit and wind speed" },
  ],
  theory: "The water cycle (hydrological cycle) moves water between atmosphere, land, and oceans. Solar energy drives evaporation from water surfaces and transpiration from plants (evapotranspiration). Water vapor rises, cools adiabatically, and condenses into clouds when reaching the dew point. Precipitation occurs when droplets grow large enough to fall. On land, water follows multiple paths: surface runoff into streams and rivers, infiltration into soil, and percolation into groundwater aquifers. Groundwater slowly flows toward discharge points (springs, rivers, oceans). Temperature increases evaporation rates; mountains force orographic lift causing precipitation on windward slopes.",
  instructions: "Watch water particles cycle through the atmosphere and landscape. Use the Solar Intensity and Temperature sliders to change the energy driving evaporation and the thermal conditions that shape phase changes. Try the four presets — Tropical, Drought, Storm, and Arctic — to compare complete water-cycle scenarios, then track the water budget in real time.",
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
  htmlControlAliases: { solarIntensity: "sl-solar", temperature: "sl-temp" },
  presets: [
    { id: "setPreset:tropical", label: "🌴 Tropical", description: "A warm, high-energy water cycle with strong evaporation, frequent cloud formation, and active precipitation." },
    { id: "setPreset:drought", label: "☀️ Drought", description: "A dry scenario where limited water return and intense heating show how evaporation can outpace precipitation." },
    { id: "setPreset:storm", label: "⛈ Storm", description: "A high-moisture, unstable scenario that emphasizes rapid condensation, heavy precipitation, runoff, and recharge." },
    { id: "setPreset:arctic", label: "❄️ Arctic", description: "A cold scenario where low temperature slows evaporation and shifts more stored water toward snow or ice." },
  ],
  contentSections: {
    whatIsIt:
      "The water cycle — also called the hydrological cycle — is the continuous journey water takes as it moves between the atmosphere, land surface, and underground. The same water molecules that fall as rain today may have once been part of an ancient ocean, a glacier, a cloud over a rainforest, or a river in a desert. The cycle is powered almost entirely by the Sun, which provides the energy needed to evaporate water from oceans and lakes. Gravity then pulls that water back down as precipitation. This simulation tracks individual water particles through each stage: evaporation from the surface, condensation into clouds, precipitation as rain or snow, surface runoff into streams, infiltration into soil, and slow movement through underground aquifers. Changing solar intensity and temperature shows how the cycle responds to different environmental conditions — a connection directly relevant to understanding droughts, floods, and how climate change is intensifying the water cycle globally.",
    parameterExplanations: {
      solarIntensity:
        "Solar Intensity controls how much incoming energy reaches the water and land surfaces, from 0% to 200% of the baseline. Higher solar intensity gives surface water molecules more energy, so more of them can escape into the air as vapor. That increases evaporation, supplies more moisture for clouds, and can speed up the movement of water through the whole cycle. Lower solar intensity slows evaporation and leaves more water stored on the surface or underground. Compare the Drought, Storm, and Tropical presets after changing only Solar Intensity to separate the role of energy input from temperature.",
      temperature:
        "Temperature sets the air and surface condition in degrees Celsius, from -10°C to 40°C. Warmer conditions generally increase evaporation because water molecules move faster and air can hold more water vapor before reaching saturation. Cold conditions slow evaporation and make snow or ice storage more likely, which delays water returning to rivers, soil, or groundwater. Use the Temperature slider with the Arctic preset to see a slower cycle, then raise it under the Tropical or Storm preset to compare how heat can intensify evaporation, condensation, and precipitation without changing the basic conservation of water.",
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
          "Groundwater is usually stored in tiny pore spaces and cracks between rock and soil particles in a zone called an aquifer — not in open caves or rivers underground. Imagine squeezing water out of a wet sponge — that is closer to how most groundwater is held. That said, caves and underground streams do occur in karst regions where soluble rock has dissolved away. Groundwater generally moves slowly through pore spaces, often taking decades or centuries to travel from a recharge area to a spring or well.",
      },
      {
        wrong: "Rain shadow deserts are dry because mountains block rain clouds.",
        correct:
          "Clouds are not physically blocked by mountains. Instead, air is forced upward on the windward side, cooling and dropping its moisture as rain or snow. By the time the air descends on the leeward side, it has lost most of its moisture and warms as it sinks — creating dry conditions. The Sahara's eastern portions and the Atacama Desert form partly through this orographic effect.",
      },
    ],
    teacherUseCases: [
      "Evaporation rate investigation: keep Temperature at 15°C and compare Solar Intensity at 50%, 100%, and 200%. Students count rising water particles over equal time intervals, graph solar input vs. evaporation rate, and explain how energy from the Sun drives cycling through Earth's systems (MS-ESS2-4).",
      "Temperature comparison: keep Solar Intensity at 100% and compare Temperature at -5°C, 15°C, and 35°C. Students describe how heating or cooling changes evaporation, condensation, precipitation type, and temporary storage as snow, ice, surface water, soil water, or groundwater.",
      "Preset scenario stations: assign Tropical, Drought, Storm, and Arctic as four stations. Students record the initial slider values, observe water movement patterns, and write a claim about how energy and temperature shape the speed and pathway of the water cycle.",
      "Climate change water cycle connection: start with the Tropical preset, record total evaporation and precipitation, then increase Temperature while holding Solar Intensity constant. Students compare the two runs and explain why a warmer atmosphere can intensify evaporation and heavy precipitation while conserving total water.",
      "Runoff and recharge discussion: use the Storm preset to observe precipitation, surface flow, infiltration, and groundwater recharge. Students connect the visible water-budget changes to flooding risk, groundwater replenishment, and why saturated soils cannot absorb unlimited rainfall.",
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
          "This simulation directly supports MS-ESS2-4, which asks students to develop a model to describe the cycling of water through Earth's systems driven by energy from the Sun and the force of gravity. It also supports HS-ESS2-5, where students plan and conduct investigations about how water's properties and movement affect Earth's surface materials and processes. The sliders and presets let students compare evidence from different water-cycle conditions instead of treating the cycle as a fixed diagram.",
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
