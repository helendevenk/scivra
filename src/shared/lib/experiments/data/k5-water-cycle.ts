import type { Experiment } from "@/shared/types/experiment";

export const k5WaterCycle: Experiment = {
  id: "k5-water-cycle",
  slug: "k5-water-cycle",
  title: "The Water Cycle",
  subtitle: "Evaporation, condensation, and precipitation",
  description:
    "Follow water molecules as they travel through the water cycle. Heat the sun to drive evaporation from oceans and lakes. Watch water vapor rise and cool to form clouds. See precipitation fall as rain or snow. Discover how water is constantly recycled through Earth's systems.",
  thumbnail: "/imgs/experiments/k5-water-cycle.png",

  standards: {
    ngss: ["2-ESS2-3", "5-ESS2-1", "MS-ESS2-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "3-5",
  tags: ["water cycle", "evaporation", "condensation", "precipitation", "cloud", "earth science", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "sunIntensity",
      label: "Sun Intensity",
      unit: "%",
      min: 0,
      max: 100,
      default: 70,
      step: 5,
      tier: "free",
    },
    {
      id: "temperature",
      label: "Air Temperature",
      unit: "°C",
      min: -10,
      max: 40,
      default: 20,
      step: 2,
      tier: "free",
    },
    {
      id: "cloudHeight",
      label: "Cloud Formation Height",
      unit: "km",
      min: 1,
      max: 10,
      default: 3,
      step: 0.5,
      tier: "pro",
    },
    {
      id: "precipitation",
      label: "Precipitation Type (0=Rain, 1=Snow)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\text{Evaporation} \\xrightarrow{\\text{heat}} \\text{Water Vapor} \\xrightarrow{\\text{cool}} \\text{Clouds} \\xrightarrow{\\text{precipitation}} \\text{Rain/Snow}",
      description: "The four stages of the water cycle",
    },
  ],

  theory:
    "The water cycle (hydrological cycle) describes how water continuously moves through Earth's systems. Evaporation: the sun heats surface water, causing it to change from liquid to gas (water vapor) and rise into the atmosphere. Transpiration: plants release water vapor through their leaves. Condensation: as water vapor rises, it cools and condenses around tiny particles to form clouds (liquid water droplets). Precipitation: when cloud droplets combine and grow heavy enough, they fall as rain or snow. Collection: water collects in oceans, lakes, rivers, and groundwater. The cycle then repeats. The water on Earth today is the same water that has always been here — constantly recycled.",

  instructions:
    "Increase the Sun Intensity to watch water molecules evaporate from the ocean. Watch them rise and condense to form clouds. Adjust the Air Temperature — cooler temperatures create snow instead of rain. Track individual water molecules as they complete the full cycle.",

  challenges: [
    {
      id: "wc-c1",
      question: "Name the four main stages of the water cycle in order.",
      hint: "1) Evaporation (water → vapor from sun's heat), 2) Condensation (vapor → clouds as it cools), 3) Precipitation (rain/snow falls), 4) Collection (flows to oceans/lakes/groundwater), then repeats.",
      tier: "free",
    },
    {
      id: "wc-c2",
      question: "Why do deserts receive little rain even though the sun is strong there?",
      hint: "Rain requires moist air — water vapor must be present to condense. Deserts have dry air (little water vapor), so even though there is evaporation, there is not enough moisture for precipitation. Dry air masses don't form rain clouds.",
      tier: "free",
    },
    {
      id: "wc-c3",
      question: "What is transpiration? How does it contribute to the water cycle?",
      hint: "Transpiration is water vapor released by plants through tiny pores (stomata) in their leaves. It adds water vapor to the atmosphere, contributing to cloud formation. Rainforests transpire so much that they create their own local rain patterns.",
      tier: "free",
    },
    {
      id: "wc-c4",
      question: "How does the water cycle affect global climate regulation?",
      hint: "Water carries enormous amounts of heat energy (latent heat of evaporation = 2.26 MJ/kg). Evaporation cools surfaces; condensation releases heat in the atmosphere. Ocean currents transport heat globally. Without the water cycle, Earth's temperature differences would be extreme.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-day-night-seasons", "k5-food-chain"],

  seoTitle: "Water Cycle Simulation for Kids | Scivra Elementary Earth Science",
  seoKeywords: [
    "water cycle kids simulation",
    "evaporation condensation interactive",
    "precipitation earth science elementary",
    "K-5 earth science water",
    "hydrological cycle kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "The Water Cycle",
  },
  contentSections: {
    whatIsIt:
      "Have you ever seen a puddle disappear on a sunny day? Where does all that water go? It does not vanish — it goes up into the sky! Water is always moving in a big circle called the water cycle. The Sun heats water in oceans, lakes, rivers, and puddles. When water warms up enough, it turns into an invisible gas called water vapor and floats up into the air. This is called evaporation — water turning into invisible air-water. As the vapor rises higher, the air gets cooler. Cool air cannot hold as much invisible water-gas, so the vapor turns back into tiny liquid drops. Billions of tiny drops together make a cloud. This process is called condensation — air-water turning back into tiny water drops. When clouds collect enough drops, the water falls back down as rain or snow. That is called precipitation. The water lands on the ground, flows into streams and rivers, soaks into the soil, and eventually reaches the ocean — and then the whole cycle starts again! The same water has been going around this cycle for billions of years. The water you drink today might once have been drunk by a dinosaur.",
    parameterExplanations: {
      sunIntensity:
        "This slider controls how strong the Sun is — from 0 percent (no sunlight, like night) to 100 percent (full blazing sun). A stronger Sun heats the water faster and causes more evaporation. Watch how the number of water vapor particles floating upward changes when you crank the Sun up high. At 0 percent, almost no evaporation happens and the clouds shrink.",
      temperature:
        "This slider sets the air temperature from minus 10 degrees Celsius (very cold — below freezing) to 40 degrees Celsius (a very hot day). Warmer air can hold more water vapor before it condenses, so clouds take longer to form. Colder air condenses water vapor more quickly. When temperature drops below 0 degrees, watch what happens to the precipitation — it changes from rain to snow!",
      cloudHeight:
        "This Pro slider changes the height at which clouds form. In real life, different cloud types form at different heights. Low clouds form around 1 to 2 kilometers up. High, wispy clouds called cirrus can form at 6 to 10 kilometers. Higher clouds form in colder, thinner air. Try different heights and observe how the water vapor travels farther up before condensing.",
      precipitation:
        "This Pro slider switches the type of precipitation between rain (0) and snow (1). Rain falls when air temperatures are above freezing. Snow forms when it is cold enough that water drops freeze into ice crystals on the way down. Try switching between them to see how the falling water looks different and think about what conditions on the ground might cause one or the other.",
    },
    misconceptions: [
      {
        wrong: "Water that evaporates is gone forever.",
        correct:
          "Water that evaporates does not disappear — it just changes form. Liquid water turns into invisible water vapor gas and rises into the air. It is still there, just not visible. When it cools down high in the sky, it turns back into tiny liquid drops and forms clouds. Then it falls as rain or snow and the whole journey starts over. The same water molecules have been cycling around Earth for billions of years.",
      },
      {
        wrong: "Clouds are made of water vapor (invisible air-water).",
        correct:
          "Water vapor is invisible — you cannot see it. Clouds are actually made of tiny liquid water droplets or tiny ice crystals that are so small and light they float in the air. You can see clouds because the tiny drops scatter light. Steam from a kettle looks white for the same reason — it is tiny droplets, not invisible vapor. The invisible vapor turns into visible droplets when it cools — that is condensation.",
      },
      {
        wrong: "Rain comes from the ocean and nowhere else.",
        correct:
          "Water evaporates from many places — oceans, lakes, rivers, puddles, moist soil, and even plants. Plants release water vapor through tiny holes in their leaves in a process called transpiration. All of this vapor rises, condenses into clouds, and can fall as rain far inland — nowhere near the ocean. Rain that falls on mountains might have evaporated from a lake hundreds of kilometers away.",
      },
      {
        wrong: "The water cycle only works in warm places.",
        correct:
          "The water cycle happens everywhere on Earth, including cold places. In very cold regions, precipitation falls as snow and builds up as ice sheets or glaciers. Even ice slowly changes into vapor — called sublimation — without melting first. Melting snow and ice also contribute to rivers and groundwater. The water cycle is slower in cold regions but it never stops completely.",
      },
    ],
    teacherUseCases: [
      "Set sunIntensity to 100 percent and temperature to 30 degrees to show maximum evaporation; then lower sunIntensity to 10 percent and ask students to predict what will happen to the clouds.",
      "Set temperature to minus 5 degrees and precipitation to 1 (snow) to show winter precipitation; compare to temperature 25 degrees and precipitation 0 (rain) to connect to local weather patterns students recognize.",
      "Set cloudHeight to 1 km (low clouds) vs. 8 km (high clouds) and discuss with students why the air feels different at those altitudes and how that affects water droplet formation.",
      "Run the simulation at high sunIntensity and pause just as clouds start forming; ask students to explain in their own words what just happened using the words evaporation and condensation.",
      "Pose the question: if you set sunIntensity to 0, what happens over time? Let students predict, then observe that without solar energy the water cycle slows and clouds stop forming.",
    ],
    faq: [
      {
        question: "What makes water go up into the sky?",
        answer:
          "The Sun's heat gives water the energy it needs to evaporate — to turn from liquid water into invisible water vapor gas. When liquid water is warm enough, the tiny water molecules move fast and can escape into the air. Lighter than most of the air around them, these vapor molecules float upward. Wind also helps carry moisture higher. The higher the vapor rises, the cooler the air gets, and eventually the vapor condenses back into tiny drops. This is the engine of the water cycle. NGSS standard 2-ESS2-3 asks students to observe when small amounts of water evaporate and where it goes.",
      },
      {
        question: "Is the water we drink the same water as dinosaurs drank?",
        answer:
          "Almost certainly yes! Earth does not make new water and does not lose its water into space. The water cycle keeps moving the same water around and around. Water evaporates, forms clouds, falls as rain, flows into rivers and oceans, evaporates again, and keeps going. Scientists estimate that Earth's water has been cycling for about 4 billion years. So the water in your glass today may have been in an ancient ocean, frozen in a glacier, or drunk by animals and people throughout history. The water cycle is one of the most important reasons Earth can support life for so long.",
      },
      {
        question: "Why does it rain in some places but not others?",
        answer:
          "Rain requires two things: moist air (lots of water vapor) and something to cool that moist air so the vapor condenses into drops. Mountains are great at causing rain — when moist ocean air hits a mountain, it is pushed upward, cools, condenses, and rains on the mountain side. The air that comes down the other side has lost its moisture, so the far side of the mountain is often drier. Deserts are dry partly because the air there is very dry to begin with, or because the moist air from the ocean never reaches that far inland. Climate patterns, ocean currents, and geography all work together to decide where it is usually wet or dry.",
      },
      {
        question: "Where does snow come from?",
        answer:
          "Snow forms when it is very cold high in the clouds. Water vapor or tiny droplets freeze directly into ice crystals. Each snowflake grows as more water vapor freezes onto it, building the six-sided crystal shapes that make snow look beautiful under a magnifying glass. Snowflakes fall when they get heavy enough, and if the air all the way down to the ground is cold enough, they reach the ground as snow instead of melting into rain. In this simulation, you can switch the precipitation slider to 1 (snow) and lower the temperature to below freezing to see snow fall instead of rain. Snow that piles up in mountains melts in spring and provides water for rivers and farms.",
      },
      {
        question: "What is groundwater and is it part of the water cycle?",
        answer:
          "Yes! When rain or melted snow soaks into the soil, some of it travels down through sand, soil, and cracks in rock until it collects in underground spaces. This underground water is called groundwater. It can stay underground for a short time or even thousands of years before it slowly flows to a river or spring and returns to the surface. People pump groundwater up through wells to drink and use on farms. Groundwater is an important part of the water cycle even though you cannot see it happening. NGSS standard 5-ESS2-1 asks students to describe how Earth's geosphere, hydrosphere, atmosphere, and biosphere are connected — and groundwater is a great example of water moving between systems.",
      },
    ],
  },
};
