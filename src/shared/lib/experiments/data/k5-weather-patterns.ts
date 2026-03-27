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
};
