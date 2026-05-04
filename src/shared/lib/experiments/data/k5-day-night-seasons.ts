import type { Experiment } from "@/shared/types/experiment";

export const k5DayNightSeasons: Experiment = {
  id: "k5-day-night-seasons",
  slug: "k5-day-night-seasons",
  title: "Day, Night & Seasons",
  subtitle: "Earth's rotation and revolution create our daily and yearly cycles",
  description:
    "Watch Earth spin on its axis to create day and night. Orbit it around the Sun to see the seasons change. Discover why the Northern Hemisphere experiences summer when tilted toward the Sun, and why day length changes throughout the year.",
  thumbnail: "/imgs/experiments/k5-day-night-seasons.png",

  standards: {
    ngss: ["1-ESS1-1", "5-ESS1-2", "MS-ESS1-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "K-2",
  tags: ["day night", "seasons", "Earth rotation", "Earth revolution", "axial tilt", "earth science", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "sliderTilt",
      label: "Axial Tilt",
      unit: "°",
      min: 0,
      max: 90,
      default: 23.5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "sliderRotSpeed",
      label: "Rotation Speed",
      unit: "×",
      min: 0.1,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\text{Tilt} = 23.5° \\to \\text{seasons} \\quad \\text{Rotation} = 24\\,\\text{h} \\to \\text{day/night}",
      description: "Earth's 23.5° axial tilt causes seasons; rotation period is 24 hours",
    },
  ],

  theory:
    "Earth rotates on its axis once every 24 hours, causing day and night. The side facing the Sun experiences day; the opposite side experiences night. Earth also revolves around the Sun once every 365.25 days. Earth's axis is tilted at 23.5° relative to its orbital plane. This tilt causes seasons: when the Northern Hemisphere tilts toward the Sun (summer), it receives more direct sunlight and has longer days. When tilted away (winter), it receives indirect, weaker sunlight and shorter days. At the equinoxes (March and September), day and night are approximately equal everywhere. The distance from the Sun is NOT the primary cause of seasons — Earth is actually closest to the Sun in January (during Northern Hemisphere winter).",

  instructions:
    "Use the Axial Tilt slider to lean Earth more or less, and use the Rotation Speed slider to make day and night move slower or faster. Try the Summer Solstice, Winter Solstice, and Equinox presets to compare long days, short days, and nearly even day and night.",

  challenges: [
    {
      id: "dns-c1",
      question: "Why do we have seasons? Is it because Earth is closer to the Sun in summer?",
      hint: "No! Seasons are caused by Earth's 23.5° axial tilt, not distance. In Northern summer, the Northern Hemisphere is tilted toward the Sun (more direct, stronger sunlight, longer days). Earth is actually slightly FARTHER from the Sun in June!",
      tier: "free",
    },
    {
      id: "dns-c2",
      question: "When it is summer in Australia (Southern Hemisphere), what season is it in Canada?",
      hint: "When the Southern Hemisphere is tilted toward the Sun (Southern summer ≈ December-February), the Northern Hemisphere is tilted away → winter. Seasons are opposite in the two hemispheres.",
      tier: "free",
    },
    {
      id: "dns-c3",
      question: "At the North Pole during the summer solstice, how many hours of daylight are there?",
      hint: "24 hours of daylight! At the North Pole in summer, Earth's tilt points the pole toward the Sun, so the Sun never sets. This is called the 'Midnight Sun.' In winter, the North Pole has 24 hours of darkness.",
      tier: "free",
    },
    {
      id: "dns-c4",
      question: "If Earth's axial tilt increased to 45°, how would seasons change?",
      hint: "Extreme seasons! Summers would be much hotter (more direct sunlight, very long days), winters would be much colder (nearly no sunlight near poles). Many currently habitable regions might experience severe temperature extremes that would disrupt ecosystems and agriculture.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-moon-phases", "k5-water-cycle", "gravitational-fields"],

  seoTitle: "Day Night Seasons Earth Simulation for Kids | Scivra Elementary",
  seoKeywords: [
    "day night seasons kids simulation",
    "Earth rotation revolution interactive",
    "axial tilt seasons elementary",
    "K-5 earth science solar system",
    "why do we have seasons kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Day, Night, and Seasons",
  },
  htmlControlAliases: { earthTilt: "sliderTilt", rotationSpeed: "sliderRotSpeed" },
  presets: [
    {
      id: "summer",
      label: "Summer Solstice",
      description:
        "The Summer Solstice shows the Northern Hemisphere leaning toward the Sun. Days are longest there, and sunlight hits more directly.",
    },
    {
      id: "winter",
      label: "Winter Solstice",
      description:
        "The Winter Solstice shows the Northern Hemisphere leaning away from the Sun. Days are shortest there, and sunlight is weaker.",
    },
    {
      id: "equinox",
      label: "Equinox",
      description:
        "The Equinox shows a time when day and night are nearly the same length. The Sun lights the two hemispheres more evenly.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Have you ever wondered why the sky gets dark at night? Or why summer is warm and winter is cold? It all comes down to Earth! Earth is like a giant spinning ball. It spins around once every 24 hours. When your part of Earth faces the Sun, it is daytime. When it spins away from the Sun, it gets dark — that is nighttime. Earth also moves around the Sun in a big circle. That trip takes one whole year. Here is the cool part: Earth tilts a little to one side as it moves. When your part of Earth tilts toward the Sun, the sunlight hits more directly and feels stronger — that is summer! When your part tilts away, the sunlight is weaker and spread out — that is winter. The seasons happen because of this tilt, not because Earth is closer or farther from the Sun. Try the sliders and watch it happen!",
    parameterExplanations: {
      sliderTilt:
        "Axial Tilt means how much Earth leans to one side. Real Earth leans about 23.5 degrees. That lean is why seasons happen. When the top half of Earth leans toward the Sun, that half gets stronger sunlight and longer days, so it is summer there. When it leans away, sunlight spreads out more and days are shorter, so it is winter. Try moving the slider to 0 degrees. The seasons become much weaker because Earth is not leaning toward or away from the Sun. Then move it higher and watch the seasons become stronger.",
      sliderRotSpeed:
        "Rotation Speed changes how quickly Earth spins in the model. In real life, Earth takes one full day, or 24 hours, to spin around once. That spin gives us morning, afternoon, evening, and night. A slow setting makes it easier to watch one place move from sunlight into darkness. A faster setting helps you see the day and night pattern repeat again and again. This slider does not make real Earth faster. It only changes the model so you can notice the pattern more easily.",
    },
    misconceptions: [
      {
        wrong: "Summer is hot because Earth is closer to the Sun in summer.",
        correct:
          "Earth is actually a tiny bit farther from the Sun in summer for people in North America! Seasons happen because Earth tilts. When your part of Earth tilts toward the Sun, sunlight hits more directly and feels stronger — like shining a flashlight straight down versus at an angle. The tilt, not the distance, makes the seasons.",
      },
      {
        wrong: "The Sun moves across the sky because the Sun is moving.",
        correct:
          "The Sun looks like it moves, but it is actually Earth that is spinning! Earth rotates once every 24 hours. As Earth spins, the Sun appears to rise in the east and set in the west. The Sun stays mostly in one place — we are the ones moving.",
      },
      {
        wrong: "When it is summer everywhere on Earth at the same time.",
        correct:
          "When it is summer in the Northern Hemisphere (like the United States), it is winter in the Southern Hemisphere (like Australia). They get opposite seasons because when one half tilts toward the Sun, the other half tilts away.",
      },
      {
        wrong: "Day and night are always the same length — 12 hours each.",
        correct:
          "Day and night length changes through the year because of Earth's tilt. In summer, days are longer and nights are shorter. In winter, nights are longer and days are shorter. Only during spring and fall (the equinoxes) are day and night close to equal.",
      },
    ],
    teacherUseCases: [
      "Use the Summer Solstice and Winter Solstice presets to compare sunlight angle, day length, and seasonal evidence for NGSS 1-ESS1-1 and 5-ESS1-2 discussions.",
      "Set the Axial Tilt slider to 0 degrees, have students predict what will happen to seasonal differences, then return it to 23.5 degrees and compare observations.",
      "Use a low Rotation Speed setting to pause during sunrise, noon, sunset, and night, asking students to describe the pattern they observe.",
      "Use the Equinox preset to support a short claim-evidence-reasoning prompt about why day and night are nearly equal at that time.",
      "Have students compare the three presets and explain why opposite hemispheres can have opposite seasons using visible tilt and sunlight evidence.",
    ],
    faq: [
      {
        question: "Why does it get dark at night?",
        answer:
          "Earth is always spinning like a top. When your side of Earth faces the Sun, you get daylight. As Earth keeps spinning, your side turns away from the Sun and it becomes night. The Sun did not go anywhere — you just spun away from it! Near the equator, night lasts about 12 hours before morning comes again — but at other latitudes day and night length change through the year, and near the poles the Sun may not rise or set for long periods. This spinning is why we see the Sun rise every morning and set every evening. This experiment addresses NGSS standard 1-ESS1-1, which asks students to use observations to describe patterns of the Sun, Moon, and stars in the sky.",
      },
      {
        question: "Why is summer warm and winter cold?",
        answer:
          "Earth tilts a little as it travels around the Sun. In summer, your part of Earth tilts toward the Sun. This means sunlight hits the ground more directly, like shining a flashlight straight down — the light is bright and strong in a small spot. In winter, your part tilts away, so sunlight hits at a steep angle and spreads out over a bigger area, making it weaker and cooler. Think of spreading butter thinly over a big piece of toast — the same amount covers more ground but is thinner. This is connected to NGSS standard 5-ESS1-2.",
      },
      {
        question: "Does Earth spin the same way every day?",
        answer:
          "Yes! Earth always spins in the same direction — from west to east. That is why the Sun always rises in the east and sets in the west, no matter where you live on Earth. Earth has been spinning this way for billions of years. It never reverses. The spinning speed is also very steady — one full spin every 24 hours, which gives us our 24-hour day. This pattern is one of the most reliable things in nature, which is why ancient people used the Sun to tell time long before clocks were invented.",
      },
      {
        question: "What would happen if Earth did not tilt at all?",
        answer:
          "If Earth had no tilt, there would be much less seasonal change! There would be no seasons as we know them. There would still be different climates because the equator gets more direct sunlight than the poles, but the big month-to-month changes would be much smaller. We would not have the same changes in day length through the year either. Many animals and plants depend on seasonal changes to know when to grow, move, or rest, so life on Earth would look very different. You can try this in the simulation by setting the Axial Tilt slider to 0 degrees.",
      },
      {
        question: "Why does the North Pole have months of darkness in winter?",
        answer:
          "In winter, the North Pole tilts far away from the Sun. Because Earth is a sphere, the Sun never rises high enough to reach the North Pole during those months — it stays below the horizon. The North Pole can have about six months of continuous darkness in winter and six months of continuous daylight in summer. This is called the polar night and midnight sun. Kids living near the Arctic Circle experience shorter and shorter days as winter comes, which can feel very different from life near the equator where day length barely changes.",
      },
    ],
  },
};
