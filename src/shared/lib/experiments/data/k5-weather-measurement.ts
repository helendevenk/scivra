import type { Experiment } from "@/shared/types/experiment";

export const k5WeatherMeasurement: Experiment = {
  id: "k5-weather-measurement",
  slug: "k5-weather-measurement",
  title: "Weather Measurement",
  subtitle: "Temperature, wind speed, precipitation, and humidity instruments",
  description: "Learn to read weather instruments like a meteorologist! Use virtual thermometers, anemometers, rain gauges, and hygrometers to measure weather conditions. Record data over multiple days and look for patterns to make weather predictions.",
  thumbnail: "/imgs/experiments/k5-weather-measurement.png",
  standards: { ngss: ["3-ESS2-1", "3-ESS2-2"], gcse: [], ap: [] },
  primaryStandard: "elementary-k5",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "3-5",
  tags: ["weather", "thermometer", "anemometer", "rain gauge", "meteorology", "K-5 Earth science"],
  difficulty: "beginner",
  parameters: [
    { id: "windSpeed", label: "Wind Speed", unit: "km/h", min: 0, max: 30, default: 5, step: 0.5, tier: "free" },
    { id: "temperature", label: "Temperature", unit: "°C", min: -20, max: 45, default: 20, step: 1, tier: "free" },
  ],
  formulas: [],
  theory: "Meteorologists use instruments to measure weather: thermometers measure air temperature; anemometers measure wind speed (spinning cups catch the wind); rain gauges collect and measure precipitation; hygrometers measure humidity (moisture in the air). Weather changes day to day but follows patterns by season. Temperature is measured in Celsius (°C) or Fahrenheit (°F). Wind speed is measured in km/h or mph. Precipitation is measured in millimeters of water collected. By recording weather data over time, you can spot patterns and make predictions.",
  instructions: "Use the Wind Speed slider to make the air calm or breezy, and use the Temperature slider to make the day cold, mild, or hot. Try the Calm, Rainy, and Windy presets to compare three kinds of weather, then record what the thermometer and anemometer show.",
  challenges: [
    { id: "kwm-c1", question: "If the temperature drops and humidity is high, what might happen?", hint: "Fog, dew, or frost might form — when air cools to its dew point, water vapor condenses", tier: "free" },
    { id: "kwm-c2", question: "Why does the anemometer spin faster when wind speed increases?", hint: "The cups catch more wind force, pushing them around faster — the spin rate is proportional to wind speed", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 10,
  relatedExperiments: ["k5-weather-patterns"],
  htmlPath: "/experiments/elementary/k5-weather-measurement.html",
  seoTitle: "Weather Measurement for Kids | Scivra K-5 Science",
  seoKeywords: ["weather instruments for kids", "thermometer anemometer simulation", "weather measurement interactive", "K-5 Earth science"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Elementary School", teaches: "Weather Measurement" },
  htmlControlAliases: { windSpeed: "sliderWind", temperature: "sliderTemp" },
  presets: [
    { id: "calm", label: "Calm", description: "A calm day has light wind and a comfortable temperature. Students can start here to read both instruments slowly and carefully." },
    { id: "rainy", label: "Rainy", description: "A rainy day can feel cool and damp. Students compare the preset reading with calm weather and describe what changed." },
    { id: "windy", label: "Windy", description: "A windy day makes the anemometer spin faster. Students can look for signs that moving air is stronger." },
  ],
  contentSections: {
    whatIsIt:
      "Weather is what the air outside is doing right now — is it hot or cold, windy or calm, rainy or sunny? Scientists who study weather are called meteorologists, and they use special tools called instruments to measure it. A thermometer tells us how hot or cold it is. An anemometer (say: an-em-OM-ih-ter) has little cups that spin in the wind — the faster they spin, the windier it is! A rain gauge is like a tiny cup that collects raindrops so we can measure how much rain fell. A hygrometer tells us how much water vapor is hiding in the air — we call that humidity. When it feels sticky and damp outside, humidity is high. Recording these numbers every day is how meteorologists spot patterns and tell you what tomorrow's weather might be like.",
    parameterExplanations: {
      windSpeed:
        "Wind Speed tells how fast the air is moving. A low number means calm air or a soft breeze. A higher number means stronger wind that can move leaves, flags, or hair. Watch the anemometer cups spin faster when you raise the slider. Try 0 km/h, then 10 km/h, then 30 km/h. What changes each time? Use the number and what you see to describe the weather. This helps you practice reading an instrument, not just guessing from a picture.",
      temperature:
        "Temperature tells how hot or cold the air is. Numbers below 0°C are freezing. Around 20°C feels mild for many people. Higher numbers feel warmer. Move the slider slowly and watch the thermometer reading change. Then keep the wind the same and change only temperature. Does the day feel cold, mild, or hot? Use Calm, Rainy, and Windy to compare weather data like a young meteorologist. The best answer uses numbers and simple observations together.",
    },
    misconceptions: [
      {
        wrong: "Temperature and weather are the same thing.",
        correct:
          "Temperature is just one part of weather. Weather also includes wind and other conditions outside. You could have a cold, calm day or a cold, windy day. Both are cold, but the weather feels very different. That is why meteorologists use more than one instrument, not just a thermometer.",
      },
      {
        wrong: "More wind always means rain is coming.",
        correct:
          "Wind and rain are different weather clues. It can be very windy on a sunny day. It can also rain when the air is almost still. Sometimes strong winds come before a storm, but wind by itself does not make rain happen. In this activity, compare wind speed and temperature readings carefully.",
      },
      {
        wrong: "Weather and climate are the same thing.",
        correct:
          "Weather is what is happening outside right now or this week. Climate is the average weather of a place over many years. A single cold day does not change the climate. Scientists look at 30 or more years of weather data to describe what the climate of a place is usually like.",
      },
    ],
    teacherUseCases: [
      "Start with the Calm preset, ask students to record wind speed and temperature, and have them describe the outdoor conditions using evidence from both instruments.",
      "Use the Temperature slider while keeping wind speed low, then ask students to compare cold, mild, and hot readings in a simple data table aligned to 3-ESS2-1.",
      "Use the Wind Speed slider while keeping temperature near 20°C, then have students explain how the anemometer reading changes as wind increases.",
      "Compare the Calm, Rainy, and Windy presets, then ask students to identify which reading changed most and support their answer with numbers.",
      "Have students combine preset observations with a local weather report to discuss how weather data can help people plan safe outdoor activities.",
    ],
    faq: [
      {
        question: "Why do we need more than one weather instrument?",
        answer:
          "One instrument only tells you one thing. A thermometer tells you temperature, but it does not tell you how fast the wind is moving. An anemometer tells you wind speed, but it does not tell you whether the air is hot or cold. Meteorologists use more than one measurement to build a clearer weather picture. This connects to the NGSS standard 3-ESS2-1, which asks students to represent data in tables and graphs to describe typical weather conditions in a particular season.",
      },
      {
        question: "How does a thermometer actually measure temperature?",
        answer:
          "Most thermometers you see at school or at home have a thin tube filled with colored liquid. When it gets warmer, the tiny particles in the liquid move faster and push outward, so the liquid rises up the tube. When it gets colder, the particles slow down and the liquid sinks. The number next to where the liquid stops is the temperature. Digital thermometers use a tiny sensor that changes its electrical signal when temperature changes, and a computer turns that into a number on a screen.",
      },
      {
        question: "What does it mean when the weather forecast says '70% chance of rain'?",
        answer:
          "It means meteorologists looked at many weather clues and computer models. On days like that, rain happened about 70 times out of 100. It does NOT mean it will rain for 70% of the day. It is a way of saying rain is likely, but not certain. This is why scientists say 'usually' or 'likely' instead of 'always' — weather is complicated and hard to predict perfectly.",
      },
      {
        question: "Which NGSS standards does this experiment connect to?",
        answer:
          "This simulation connects primarily to 3-ESS2-1, which asks students to represent data in tables and graphs to describe typical weather conditions expected during a particular season. It also supports 3-ESS2-2, which involves obtaining and combining information to describe climates in different regions of the world. By reading multiple instruments and recording data, students practice the science and engineering practices of planning and carrying out investigations and analyzing and interpreting data — core skills for all of K-5 science.",
      },
      {
        question: "What is the difference between rain and snow?",
        answer:
          "Rain and snow are both water falling from clouds, but temperature helps decide which form reaches the ground. Snow forms as ice crystals in cold clouds. If the air stays freezing on the way down, the crystals can reach the ground as snow. If the air is warmer, the ice can melt into rain. That is why the Temperature slider is useful when students think about different kinds of weather.",
      },
    ],
  },
};
