import type { Experiment } from "@/shared/types/experiment";

export const k5WeatherPatterns: Experiment = {
  id: "k5-weather-patterns",
  slug: "k5-weather-patterns",
  title: "Weather Patterns",
  subtitle: "Track temperature, wind, and precipitation to predict weather",
  description:
    "Become a junior meteorologist! Select a season and region to observe how temperature, wind speed, and precipitation change over time. Spot patterns in the data, learn to read simple weather maps, and make your own weather predictions based on the clues nature gives us.",
  thumbnail: "/imgs/experiments/k5-weather-patterns.png",

  standards: {
    ngss: ["3-ESS2-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "3-5",
  tags: ["weather", "temperature", "precipitation", "seasons", "K5 science"],
  difficulty: "beginner",

  parameters: [
    { id: "season", label: "Season (0=Spring 1=Summer 2=Fall 3=Winter)", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
    { id: "region", label: "Region (0=Tropical 1=Temperate 2=Arctic 3=Desert)", unit: "", min: 0, max: 3, default: 1, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "T_{\\text{pattern}} = T_{\\text{avg}} + A \\sin\\!\\left(\\frac{2\\pi}{365}\\,d\\right)", description: "Temperature follows a wave pattern through the year — warmest in summer, coldest in winter" },
  ],

  theory: "Weather is the day-to-day condition of the atmosphere: temperature, wind, clouds, and precipitation. Climate is the average weather over many years. Scientists observe patterns — for example, summers are warmer because the Earth's tilt angles your region toward the Sun, giving longer days and more direct sunlight. Different regions have different climates: tropical areas stay warm year-round, arctic areas stay cold, deserts get very little rain, and temperate areas experience all four seasons. By tracking weather data over time, meteorologists can spot patterns and make forecasts.",

  instructions: "Choose a season and region, then press Start! Watch the animated weather dashboard update temperature, wind, and rain data day by day. Look for patterns — does temperature rise or fall? When does it rain most? After observing, try to predict tomorrow's weather based on the trend you see.",

  challenges: [
    { id: "k5wp-c1", question: "Why is summer warmer than winter?", hint: "Earth is tilted! In summer your part of Earth leans toward the Sun, so sunlight hits more directly and days are longer.", tier: "free" },
    { id: "k5wp-c2", question: "Which region gets the least rainfall?", hint: "Deserts receive very little rain — some get less than 25 cm (10 inches) per year!", tier: "free" },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-water-cycle", "k5-landforms-erosion"],
  htmlPath: "/experiments/elementary/k5-weather-patterns.html",

  seoTitle: "Weather Patterns for Kids | Scivra Elementary Science",
  seoKeywords: ["weather patterns for kids", "seasons and weather elementary", "meteorology K5", "K5 earth science experiment"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Elementary School", teaches: "Weather Patterns, Seasons, and Climate" },
  contentSections: {
    whatIsIt:
      "Have you ever noticed that summer is almost always warmer than winter? Or that it rains more at certain times of year where you live? These are weather patterns — things that happen again and again in a regular way. Meteorologists are scientists who study weather. They track temperature, wind, and rainfall day after day, season after season, and look for patterns. A pattern is like a clue that helps them predict what the weather will probably do next. Different places on Earth have very different patterns. A tropical rainforest near the equator stays warm and rainy all year. A desert gets very little rain even in summer. An arctic area stays cold most of the year. A temperate region like much of the United States has all four seasons. By exploring different seasons and regions in this simulation, you can think like a meteorologist and spot the patterns yourself.",
    parameterExplanations: {
      season:
        "The season slider lets you pick one of Earth's four seasons: 0 for Spring, 1 for Summer, 2 for Fall (Autumn), and 3 for Winter. The season changes how warm or cold it is and how much rain or snow usually falls. In Summer (1) temperatures are highest because your part of Earth tilts toward the Sun, giving longer days and more direct sunlight. In Winter (3) temperatures are lowest because Earth tilts away, giving shorter days and less direct sunlight. Spring and Fall are in between — temperatures are changing and weather can be unpredictable.",
      region:
        "The region slider lets you visit four different places on Earth: 0 for Tropical (hot and rainy near the equator, like a rainforest), 1 for Temperate (four seasons, like most of the United States), 2 for Arctic (cold most of the year, like northern Canada or Alaska), and 3 for Desert (very little rain, very hot days and cold nights, like the Sahara or Arizona). Each region has its own pattern of temperature and rainfall across the seasons. Try combining Summer with Arctic, or Winter with Tropical, to see how much regions differ.",
    },
    misconceptions: [
      {
        wrong: "The seasons happen because Earth is closer to or farther from the Sun.",
        correct:
          "Earth's distance from the Sun barely changes during the year. Seasons happen because Earth is tilted on its axis at about 23.5 degrees. When your part of Earth tilts toward the Sun, sunlight hits more directly and days are longer — that is summer. When your part tilts away, sunlight hits at an angle and days are shorter — that is winter. In fact, Earth is actually slightly closer to the Sun in January (Northern Hemisphere winter), not summer.",
      },
      {
        wrong: "Weather and climate are the same thing.",
        correct:
          "Weather is what is happening right now — today's temperature, rain, and wind. Climate is the average weather of a place over 30 years or more. You might have a very cold summer day (weather), but summer is still usually the warmest season in a temperate region (climate). Meteorologists use climate patterns to make better weather forecasts.",
      },
      {
        wrong: "All deserts are hot all the time.",
        correct:
          "Deserts are defined by very little rainfall, not by heat. Hot deserts like the Sahara can be extremely hot during the day but drop to near freezing at night. Cold deserts like Antarctica or the Gobi Desert in Asia are very cold most of the year. What they share is less than 250 mm of rain or snow per year, not a certain temperature.",
      },
      {
        wrong: "Tropical regions always get the most rain in summer.",
        correct:
          "Tropical regions usually stay warm all year, but their wet and dry seasons do not match northern summer and winter. Many tropical areas near the equator have a wet season and a dry season driven by shifting wind patterns called monsoons, not by Earth's tilt the same way temperate regions experience seasons.",
      },
    ],
    teacherUseCases: [
      "Set region to Temperate (1) and cycle through all four seasons (0-3) one by one; have students record temperature and precipitation for each season and identify which has the most rain and which is coldest — supporting 3-ESS2-1 data collection.",
      "Set season to Summer (1) and compare all four regions by moving the region slider from 0 to 3; ask students to rank regions from hottest to coldest and explain what they notice about how region affects temperature even in the same season.",
      "Set region to Arctic (2) and season to Winter (3), then switch to Tropical (0) and Summer (1); have students describe the two places in words and discuss which animals or plants could survive in each environment.",
      "Have students predict what weather they would find in a Desert (3) in Summer (1) versus Fall (2) before running the simulation, then check their predictions against the results to practice evidence-based revision of ideas.",
      "Use the Temperate region across all four seasons to model how a school weather journal might look year-round, connecting daily observation habits to the larger patterns visible in the simulation.",
    ],
    faq: [
      {
        question: "Why is summer warmer than winter in most places?",
        answer:
          "Earth spins on a tilted axis, leaning about 23.5 degrees. In summer, your part of Earth leans toward the Sun. This means sunlight hits the ground more directly — like shining a flashlight straight down instead of at an angle — and days are longer, so the ground has more hours to warm up. In winter, your part leans away, sunlight hits at a shallow angle spreading over a bigger area so it is weaker, and days are shorter. Together these two things make summer warm and winter cold. This idea connects to the NGSS standard 3-ESS2-2 about how climates differ across regions.",
      },
      {
        question: "Why do different regions of the world have such different weather patterns?",
        answer:
          "A region's distance from the equator, nearness to oceans, and height above sea level all shape its climate pattern. Tropical regions near the equator receive direct, intense sunlight all year, so they stay warm. Arctic regions are far from the equator and receive sunlight at a very shallow angle, keeping them cold. Deserts are often blocked from ocean moisture by mountains or wind patterns, so very little rain reaches them. Temperate regions receive a mix of conditions as Earth tilts through the year, producing all four seasons.",
      },
      {
        question: "What is a weather pattern, and how is it different from one weird weather day?",
        answer:
          "A weather pattern is something that happens regularly and predictably across many days, weeks, or years — like 'it usually rains more in spring' or 'summers are hot and winters are cold here.' One unusual cold day in July is just weird weather, not a change in the pattern. Scientists look at data from many years to find the reliable patterns, and those patterns help meteorologists make forecasts. A single strange day does not break a pattern, just like one bad score on a quiz does not change your average grade.",
      },
      {
        question: "Which NGSS standard does this experiment connect to?",
        answer:
          "This simulation directly supports 3-ESS2-1, which asks students to represent data in tables and graphs to describe typical weather conditions expected during a particular season. It also connects to 3-ESS2-2, which asks students to obtain and combine information to describe climates in different regions of the world. By exploring how season and region together shape weather patterns, students practice analyzing and interpreting data — a key science and engineering practice for grades K-5.",
      },
      {
        question: "Can meteorologists predict the weather perfectly?",
        answer:
          "Not perfectly, and that is okay! Weather forecasting has improved a lot with satellites, radar, and computers, but the atmosphere is incredibly complex with billions of tiny air movements all affecting each other. Short-term forecasts (one or two days ahead) are usually quite accurate. Longer forecasts (a week ahead) are less certain. That is why forecasters say things like '70% chance of rain' rather than 'it will rain' — they are giving you their best estimate based on patterns, not a guarantee. Scientists prefer to be honest about uncertainty rather than pretend they know more than they do.",
      },
    ],
  },
};
