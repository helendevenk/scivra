import type { Experiment } from "@/shared/types/experiment";

export const k5WeatherPatterns: Experiment = {
  id: "k5-weather-patterns",
  slug: "k5-weather-patterns",
  title: "Weather Patterns",
  subtitle: "Change wind speed and humidity to see clear skies, storms, and blizzards",
  description:
    "Explore how wind and humidity help shape the weather you see outside. Move the Wind Speed and Humidity sliders, then watch the sky change from calm and clear to rainy, stormy, windy, or snowy. Use the Clear Sky, Thunderstorm, and Blizzard presets to compare weather conditions like a young meteorologist.",
  thumbnail: "/imgs/experiments/k5-weather-patterns.png",

  standards: {
    ngss: ["K-ESS2-1", "3-ESS2-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "K-2",
  tags: ["weather", "wind", "humidity", "storms", "K5 science"],
  difficulty: "beginner",

  parameters: [
    { id: "windSpeed", label: "Wind Speed", unit: "km/h", min: 0, max: 120, default: 30, step: 1, tier: "free" },
    { id: "humidity", label: "Humidity", unit: "%", min: 0, max: 100, default: 45, step: 1, tier: "free" },
  ],

  formulas: [
    {
      latex: "\\text{More humidity} \\rightarrow \\text{more water vapor in the air}",
      description: "Humid air holds more water vapor, which can help clouds, rain, or snow form.",
    },
    {
      latex: "\\text{Faster wind} \\rightarrow \\text{stronger moving air}",
      description: "Fast wind can move clouds and precipitation quickly and can make storms more dangerous.",
    },
  ],

  theory:
    "Weather is what the air outside is like right now or this week. Wind tells us how fast air is moving. Humidity tells us how much water vapor is in the air. When humidity is low and wind is gentle, the sky is often clearer. When humid air rises and wind is stronger, clouds can build and a thunderstorm may form. When air is cold, snowy, and very windy, the weather can become a blizzard. Scientists study weather data many times so they can find patterns and make better forecasts.",

  instructions:
    "Move the Wind Speed slider to make the air calmer or stronger. Move the Humidity slider to add or remove water vapor from the air. Try the Clear Sky, Thunderstorm, and Blizzard presets. Watch the live data and condition label, then explain what changed and why.",

  challenges: [
    {
      id: "k5wp-c1",
      question: "What setting makes the clearest sky?",
      hint: "Try low humidity and gentle wind. Clear skies usually happen when the air is not holding much water vapor.",
      relatedParameterId: "humidity",
      tier: "free",
    },
    {
      id: "k5wp-c2",
      question: "What happens when humidity gets high?",
      hint: "High humidity means more water vapor is in the air. That can help clouds, rain, fog, or snow appear.",
      relatedParameterId: "humidity",
      tier: "free",
    },
    {
      id: "k5wp-c3",
      question: "Why is a blizzard dangerous?",
      hint: "A blizzard has strong wind and snow. That can make it hard to see and hard to travel safely.",
      relatedParameterId: "windSpeed",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-water-cycle", "k5-landforms-erosion"],
  htmlPath: "/experiments/elementary/k5-weather-patterns.html",

  seoTitle: "Wind and Humidity Weather Patterns for Kids | Scivra Elementary Science",
  seoKeywords: [
    "wind and humidity for kids",
    "weather patterns elementary science",
    "thunderstorm and blizzard simulation",
    "K5 weather experiment",
    "NGSS weather patterns",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Wind, Humidity, Weather Conditions, and Weather Patterns",
  },

  htmlControlAliases: { windSpeed: "sliderWind", humidity: "sliderHumid" },

  presets: [
    {
      id: "clear",
      label: "Clear Sky",
      description: "Light wind and low humidity make calm weather with fewer clouds.",
      paramValues: { windSpeed: 10, humidity: 30 },
    },
    {
      id: "storm",
      label: "Thunderstorm",
      description: "Stronger wind and high humidity can help tall storm clouds, heavy rain, thunder, and lightning form.",
      paramValues: { windSpeed: 60, humidity: 85 },
    },
    {
      id: "blizzard",
      label: "Blizzard",
      description: "Very strong wind with snowy air can create blowing snow and low visibility.",
      paramValues: { windSpeed: 90, humidity: 70 },
    },
  ],

  contentSections: {
    whatIsIt:
      "Weather is what the air outside is doing right now. It can be sunny, rainy, windy, snowy, foggy, or stormy. In this simulation, two weather clues matter most: wind speed and humidity. Wind speed tells how fast the air is moving. Humidity tells how much water vapor is in the air. Low humidity and light wind can make a clear sky. High humidity can help clouds and rain form. Strong wind can move clouds and precipitation fast. When strong wind, wet air, and cold snow happen together, a blizzard can form. Meteorologists use weather data like this to look for patterns and make forecasts.",
    parameterExplanations: {
      windSpeed:
        "Wind Speed shows how fast the air is moving. Air moves when one place has more air pressure than another place, so the air flows from one area to another. A low value on the slider feels calm, like a quiet day when leaves barely move. A medium value can push clouds across the sky and make rain slant sideways. A high value means strong moving air. Strong wind can spread rain or snow quickly, make trees bend, and make storms harder to stay safe in. In the simulation, use Wind Speed with Humidity to compare calm weather, thunderstorms, and blizzards.",
      humidity:
        "Humidity shows how much water vapor is in the air. Water vapor is water we cannot see, like tiny water gas mixed into the air around us. Low humidity means the air is drier, so the sky may look clearer and fewer clouds may form. High humidity means the air has more water vapor. If that moist air cools, the water vapor can turn into tiny drops or ice crystals. Those drops or crystals can make clouds, fog, rain, or snow. Humidity is not the same as rain, but high humidity gives the air more water to build wet or snowy weather.",
    },
    misconceptions: [
      {
        wrong: "Wind and humidity are the same thing.",
        correct:
          "Wind is moving air. Humidity is water vapor in the air. They work together, but they measure different parts of weather.",
      },
      {
        wrong: "High humidity always means it is raining right now.",
        correct:
          "High humidity means the air holds a lot of water vapor. Rain may happen if the air cools and water droplets form, but humid air can also be cloudy, foggy, or just sticky.",
      },
      {
        wrong: "A clear sky means there is no weather.",
        correct:
          "Clear sky is still weather. It usually means the air is calm enough and dry enough that many clouds are not forming.",
      },
      {
        wrong: "A blizzard is just a lot of snow.",
        correct:
          "A blizzard needs strong wind and blowing snow. The wind makes it hard to see, which is why blizzards can be dangerous.",
      },
      {
        wrong: "Strong wind always means a thunderstorm is happening, and dry air can never grow clouds.",
        correct:
          "Strong wind can happen with many kinds of weather. A thunderstorm also needs tall storm clouds, and those clouds usually need moist air and rising air to grow. Dry air makes clouds less likely, but not impossible — weather can change when new air moves in or when air rises and cools.",
      },
    ],
    teacherUseCases: [
      "Set Wind Speed to a low value and Humidity to a low value, then ask students to describe the clear-sky pattern they observe.",
      "Keep Wind Speed the same while moving the Humidity slider from low to high. Have students record how clouds, fog, rain, or snow change.",
      "Keep Humidity high while moving the Wind Speed slider upward. Ask students how stronger moving air changes the scene and live data.",
      "Use the Clear Sky, Thunderstorm, and Blizzard presets. Have students compare the Wind Speed and Humidity values for each weather condition.",
      "Ask students to choose slider values, predict the weather condition, run the simulation, and revise their idea using evidence from the live data. They can record their predictions on a two-column chart (Wind Speed and Humidity), draw the sky they see for three slider pairs, and write one sentence about the weather pattern. Then use the Blizzard preset to discuss safety: which clue makes travel hard to see — the snow, the strong wind, or both working together.",
    ],
    faq: [
      {
        question: "What does wind speed mean?",
        answer:
          "Wind speed tells how fast air is moving. A small number means gentle air. A large number means strong wind that can move clouds, rain, or snow quickly.",
      },
      {
        question: "What does humidity mean?",
        answer:
          "Humidity tells how much water vapor is in the air. When humidity is high, the air has more water vapor. That can help clouds, fog, rain, or snow form.",
      },
      {
        question: "Why do thunderstorms need humid air?",
        answer:
          "Thunderstorms often grow when warm, moist air rises. Moist air has water vapor. As the air rises and cools, water droplets can form tall storm clouds.",
      },
      {
        question: "Why is a blizzard different from regular snow?",
        answer:
          "Regular snow can fall with little wind. A blizzard has strong wind and blowing snow, so it can be very hard to see.",
      },
      {
        question: "Why does wind happen?",
        answer:
          "Wind happens when air moves from one place to another. Air can move because some places are warmer or have different air pressure. The moving air is what we feel as wind.",
      },
      {
        question: "How is humidity different from rain, and how do meteorologists forecast weather?",
        answer:
          "Humidity is water vapor in the air, and we usually cannot see it. Rain is liquid water drops falling from clouds. Humid air can help rain form, but it does not always rain when humidity is high. Meteorologists measure clues like wind, humidity, temperature, clouds, and rain, then compare today's data with patterns they have seen before to make a careful forecast — the same kind of pattern work students do in this simulation, supporting NGSS K-ESS2-1 and 3-ESS2-1.",
      },
    ],
  },
};
