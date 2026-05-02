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
    { id: "temperature", label: "Temperature", unit: "°C", min: -20, max: 45, default: 22, step: 1, tier: "free" },
    { id: "windSpeed", label: "Wind Speed", unit: "km/h", min: 0, max: 120, default: 15, step: 5, tier: "free" },
    { id: "precipitation", label: "Precipitation", unit: "mm", min: 0, max: 50, default: 5, step: 1, tier: "free" },
    { id: "humidity", label: "Humidity", unit: "%", min: 10, max: 100, default: 55, step: 5, tier: "free" },
  ],
  formulas: [],
  theory: "Meteorologists use instruments to measure weather: thermometers measure air temperature; anemometers measure wind speed (spinning cups catch the wind); rain gauges collect and measure precipitation; hygrometers measure humidity (moisture in the air). Weather changes day to day but follows patterns by season. Temperature is measured in Celsius (°C) or Fahrenheit (°F). Wind speed is measured in km/h or mph. Precipitation is measured in millimeters of water collected. By recording weather data over time, you can spot patterns and make predictions.",
  instructions: "Adjust the weather conditions using sliders and watch each instrument respond. The thermometer level changes, the anemometer spins faster or slower, the rain gauge fills, and the hygrometer needle moves. Record readings in the data table.",
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
  contentSections: {
    whatIsIt:
      "Weather is what the air outside is doing right now — is it hot or cold, windy or calm, rainy or sunny? Scientists who study weather are called meteorologists, and they use special tools called instruments to measure it. A thermometer tells us how hot or cold it is. An anemometer (say: an-em-OM-ih-ter) has little cups that spin in the wind — the faster they spin, the windier it is! A rain gauge is like a tiny cup that collects raindrops so we can measure how much rain fell. A hygrometer tells us how much water vapor is hiding in the air — we call that humidity. When it feels sticky and damp outside, humidity is high. Recording these numbers every day is how meteorologists spot patterns and tell you what tomorrow's weather might be like.",
    parameterExplanations: {
      temperature:
        "Temperature tells us how hot or cold the air is, measured in degrees Celsius (°C). When temperature is near 0°C or below, water can freeze into ice. Around 20-25°C feels comfortably warm — great for playing outside. At 35°C or above it feels very hot, like a summer day at the beach. Try sliding temperature down to -10°C and watch the thermometer drop to show freezing cold conditions.",
      windSpeed:
        "Wind speed shows how fast the air is moving, measured in kilometers per hour (km/h). At 0 km/h there is no wind at all — it is completely still. At 15 km/h you might feel a gentle breeze that moves leaves on trees. At 60 km/h it is a strong wind that can make it hard to walk. At 120 km/h it is like a hurricane — very dangerous! Watch the anemometer cups spin faster as you raise wind speed.",
      precipitation:
        "Precipitation is any water that falls from the sky — rain, snow, sleet, or hail. We measure it in millimeters (mm), which is how deep the water would be if it collected in a flat dish. Zero mm means no rain at all. Five mm is a light shower. Twenty-five mm or more in one day is a heavy rainstorm. The rain gauge fills up as you increase precipitation — just like a real gauge collects falling rain.",
      humidity:
        "Humidity tells us how much water vapor — tiny invisible water molecules in gas form — is floating in the air. It is measured as a percentage from 10% (very dry, like a desert) to 100% (completely full of moisture). When humidity is high, sweat does not dry quickly and it feels sticky. When humidity is low, your skin and lips can feel dry. Note: fog, clouds, and dew are made of tiny liquid water droplets — those form when the invisible vapor cools and condenses. Watch the hygrometer needle move as you change humidity.",
    },
    misconceptions: [
      {
        wrong: "Temperature and weather are the same thing.",
        correct:
          "Temperature is just one part of weather. Weather is made of many measurements together — temperature, wind speed, how much rain falls, and humidity. You could have a cold, calm, dry day or a cold, windy, rainy day. Both are cold, but the weather is very different! That is why meteorologists use several instruments, not just a thermometer.",
      },
      {
        wrong: "More wind always means rain is coming.",
        correct:
          "Wind and rain are separate weather measurements. It can be very windy on a completely sunny, dry day. It can also be raining with almost no wind at all. Sometimes strong winds do come before a storm, but wind alone does not cause rain. Meteorologists also use air pressure to predict rain; this simulation focuses on temperature, wind speed, precipitation, and humidity — the four instruments you can read here.",
      },
      {
        wrong: "If humidity is 100%, it must be raining.",
        correct:
          "Humidity of 100% means the air is holding all the water vapor it possibly can, which often happens in fog or just before rain — but it does not always mean it is actively raining. You can walk through thick fog on a still morning with 100% humidity and no raindrops falling at all.",
      },
      {
        wrong: "Weather and climate are the same thing.",
        correct:
          "Weather is what is happening outside right now or this week. Climate is the average weather of a place over many years. A single cold day does not change the climate. Scientists look at 30 or more years of weather data to describe what the climate of a place is usually like.",
      },
    ],
    teacherUseCases: [
      "Set temperature to 22°C, windSpeed to 15 km/h, precipitation to 5 mm, and humidity to 55% as a baseline 'nice spring day' reading, then ask students to record all four values and describe what the weather would feel like outside.",
      "Lower temperature to -5°C and raise precipitation to 20 mm, then ask students whether the precipitation would be rain or snow and why temperature matters for that answer.",
      "Set windSpeed to 80 km/h with precipitation to 30 mm and humidity to 90% to simulate a storm; have students discuss which instrument readings signal danger and what people should do.",
      "Run the simulation for three different 'days' (sunny, rainy, windy), have students record data in a table, then spot which day had the highest humidity and which had the most precipitation — connecting 3-ESS2-1 data recording.",
      "Set humidity to 10% and temperature to 40°C to simulate desert conditions; contrast with humidity at 95% and temperature at 28°C for a rainforest, and discuss how animals and plants adapt to each.",
    ],
    faq: [
      {
        question: "Why do we need more than one weather instrument?",
        answer:
          "One instrument only tells you one thing. A thermometer tells you temperature but not wind or rain. To really understand the weather — and to predict it — you need to know temperature, wind speed, how much rain has fallen, and humidity all at once. Meteorologists use all of these measurements together to build a complete picture of the atmosphere, the same way you need more than one clue to solve a mystery. This connects to the NGSS standard 3-ESS2-1, which asks students to represent data in tables and graphs to describe typical weather conditions in a particular season.",
      },
      {
        question: "How does a thermometer actually measure temperature?",
        answer:
          "Most thermometers you see at school or at home have a thin tube filled with colored liquid. When it gets warmer, the tiny particles in the liquid move faster and push outward, so the liquid rises up the tube. When it gets colder, the particles slow down and the liquid sinks. The number next to where the liquid stops is the temperature. Digital thermometers use a tiny sensor that changes its electrical signal when temperature changes, and a computer turns that into a number on a screen.",
      },
      {
        question: "What does it mean when the weather forecast says '70% chance of rain'?",
        answer:
          "It means meteorologists looked at many days that had similar temperature, humidity, and pressure readings in the past, and on about 70 out of every 100 of those days it rained. It does NOT mean it will rain 70% of the day or that 70% of the area will get wet. It is a way of saying there is a pretty good chance of rain but it is not certain. This is why scientists say 'usually' or 'likely' instead of 'always' — weather is complicated and hard to predict perfectly.",
      },
      {
        question: "Which NGSS standards does this experiment connect to?",
        answer:
          "This simulation connects primarily to 3-ESS2-1, which asks students to represent data in tables and graphs to describe typical weather conditions expected during a particular season. It also supports 3-ESS2-2, which involves obtaining and combining information to describe climates in different regions of the world. By reading multiple instruments and recording data, students practice the science and engineering practices of planning and carrying out investigations and analyzing and interpreting data — core skills for all of K-5 science.",
      },
      {
        question: "What is the difference between rain and snow if they are both precipitation?",
        answer:
          "Both rain and snow are water falling from clouds, but the temperature of the air from the cloud all the way to the ground decides which form it takes. Snow forms as ice crystals inside cold clouds. If the air stays below freezing all the way down, those crystals reach the ground as snow. If warmer air layers are in between, the ice can melt into rain, or partially melt into sleet or freezing rain. This is why it can snow on a 1°C day when cold air stretches all the way up, or rain on a 2°C day if a warm layer of air sits lower down.",
      },
    ],
  },
};
