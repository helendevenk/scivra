import type { Experiment } from "@/shared/types/experiment";

export const k5SolarEnergy: Experiment = {
  id: "k5-solar-energy",
  slug: "k5-solar-energy",
  title: "Solar Energy",
  subtitle: "Learn how sunlight becomes heat and electricity",
  description:
    "Discover how energy from the Sun powers our world. Aim a solar panel at the sunlight and watch it generate electricity to power a light bulb. Experiment with different panel angles to find the position that captures the most energy. See how dark surfaces absorb more heat from sunlight than light surfaces. Understand why solar energy is a clean, renewable resource.",
  thumbnail: "/imgs/experiments/k5-solar-energy.png",

  standards: {
    ngss: ["4-PS3-2", "4-ESS3-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "3-5",
  tags: [
    "solar energy",
    "sunlight",
    "renewable energy",
    "solar panel",
    "heat",
    "electricity",
    "elementary",
    "K-5",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "sunAngle",
      label: "Sun Angle",
      unit: "°",
      min: 0,
      max: 90,
      default: 75,
      step: 1,
      tier: "free",
    },
    {
      id: "panelTilt",
      label: "Panel Tilt",
      unit: "°",
      min: 0,
      max: 90,
      default: 30,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex:
        "\\text{Energy Collected} = \\text{Sunlight} \\times \\cos(\\theta)",
      description:
        "A solar panel collects the most energy when it faces the Sun directly (angle = 0°); tilting it away reduces the energy captured",
    },
  ],

  theory:
    "The Sun is Earth's primary source of energy. Sunlight carries energy that can be converted into heat and electricity. Solar panels (photovoltaic cells) contain special materials that release electrons when sunlight hits them, creating an electric current — this is how sunlight becomes electricity. The angle of the solar panel matters: when the panel faces the Sun directly, it captures the maximum amount of light. Tilting it away means less light hits the surface, just like how a flashlight shining straight down makes a bright circle, but shining it at an angle spreads the light over a larger area making it dimmer. Solar energy is renewable — the Sun will keep shining for billions of years. Dark-colored objects absorb more solar energy as heat than light-colored objects, which is why wearing a black shirt on a sunny day feels hotter.",

  instructions:
    "Use the Sun Angle slider to move the Sun higher or lower in the sky. Use the Panel Tilt slider to aim the solar panel toward the light. Try the Noon, Morning, and Winter presets to compare different days. Watch the meter and bulb to see when the panel collects more energy.",

  challenges: [
    {
      id: "se-c1",
      question:
        "At what angle does the solar panel produce the most electricity? Why?",
      hint: "The panel produces the most electricity when it faces the Sun directly (perpendicular to the sunlight). At this angle, the maximum amount of light hits the panel surface. As you tilt the panel away, sunlight spreads across a larger area and less energy is captured per square centimeter.",
      tier: "free",
    },
    {
      id: "se-c2",
      question:
        "Why is solar energy called a 'renewable' energy source? Name one advantage and one challenge of using solar panels.",
      hint: "Solar energy is renewable because the Sun continuously produces light — it will not run out for billions of years (unlike coal or oil which are limited). Advantage: solar energy is clean and produces no pollution. Challenge: solar panels only work well during daytime and sunny weather, so energy storage (batteries) is needed for nighttime.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-light-interactions", "greenhouse-effect"],

  htmlPath: "/experiments/elementary/k5-solar-energy.html",

  seoTitle:
    "Solar Energy Simulation for Kids | Scivra Elementary Physics",
  seoKeywords: [
    "solar energy kids simulation",
    "solar panel interactive elementary",
    "renewable energy K-5 science",
    "sunlight to electricity for kids",
    "solar power experiment",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Solar Energy, Heat, and Electricity from Sunlight",
  },
  htmlControlAliases: { sunAngle: "sunAngleSlider", panelTilt: "tiltSlider" },
  presets: [
    {
      id: "noon",
      label: "🔆 Noon Summer (90°)",
      description:
        "The Sun is high in the sky. Aim the panel well and it can collect strong sunlight.",
    },
    {
      id: "morning",
      label: "🌅 Morning Light (25°)",
      description:
        "The Sun is low in the sky. The panel needs a different tilt to catch more light.",
    },
    {
      id: "winter",
      label: "❄️ Winter Solstice (30°)",
      description:
        "Winter sunlight comes from a lower angle. Tilting the panel can help it face the Sun.",
    },
  ],
  contentSections: {
    whatIsIt:
      "The Sun is like a giant power station in the sky — and it is free for everyone! Every day, the Sun sends out huge amounts of energy as light and heat. We can capture some of that energy and use it to power things in our homes and schools. One way to do this is with a solar panel. A solar panel is made of special materials that turn sunlight directly into electricity. When sunlight hits the panel, tiny particles of energy called photons knock loose tiny bits inside the panel, and those moving bits create electric power. You can use that electricity to light a bulb, charge a phone, or run a fan! The angle of the panel matters a lot. When the panel faces the Sun straight on, it catches the most light. When it tilts away, less light hits it and less electricity is made. This is the same reason your shadow is shortest at noon when the Sun is highest in the sky. Solar energy is clean — it does not make smoke or pollution. And the Sun will keep shining for billions of years, so it will not run out the way coal or oil can.",
    parameterExplanations: {
      sunAngle:
        "Sun Angle shows how high the Sun is in the sky. A high Sun, like noon in summer, shines more straight down. A low Sun, like morning or winter, shines from the side. Panel Tilt changes how the solar panel points. The panel collects the most energy when its face points toward the Sun's light. Move one slider at a time and watch the meter. Then try the Noon, Morning, and Winter presets. Ask: Which setup makes the bulb brightest? Which setup makes less power? This helps you see how position changes the amount of sunlight a panel can catch.",
      panelTilt:
        "Panel Tilt changes how the solar panel points. A flat panel may work well when the Sun is high, but it may miss more light when the Sun is low. A tilted panel can face low sunlight better. The best tilt depends on the Sun Angle. Try changing the Sun first, then move the panel until the meter grows. The presets give you three easy starting points: Noon, Morning, and Winter. Use them to compare how a real solar panel might need different positions during the day or during different seasons.",
    },
    misconceptions: [
      {
        wrong: "Solar panels work just as well on cloudy days as on sunny days.",
        correct:
          "Clouds block some sunlight, so solar panels make less electricity on cloudy days. They still work, but they usually make less power than on a clear day. Solar systems often use batteries or the electric grid so people can still use electricity at night or when the weather changes.",
      },
      {
        wrong: "It does not matter which direction a solar panel faces.",
        correct:
          "The direction and angle of a solar panel make a big difference. Panels work best when they face the Sun as directly as possible. A panel lying flat or tilted away from the Sun catches less light than one aimed toward it. In this experiment, compare the Sun Angle and Panel Tilt sliders to find a stronger setup.",
      },
      {
        wrong: "Solar energy is too weak to power anything useful.",
        correct:
          "Solar energy is powerful enough to run entire houses, schools, and even cities! Some countries get a large share of their electricity from solar panels. Solar power runs satellites and space stations in orbit. In sunny regions, solar farms cover large fields and produce enough electricity for thousands of homes. The technology keeps improving and getting cheaper every year.",
      },
      {
        wrong: "Dark surfaces stay cooler in the sun than light surfaces.",
        correct:
          "Dark surfaces absorb more sunlight as heat, so they get warmer, not cooler. Light-colored or white surfaces reflect more sunlight away and stay cooler. This is why wearing a white shirt on a hot sunny day feels cooler than wearing a black shirt, and why some rooftops are painted white to stay cool in summer.",
      },
    ],
    teacherUseCases: [
      "Use the Noon preset as a baseline and have students adjust Panel Tilt in 10-degree steps, recording the energy reading to identify the strongest panel position.",
      "Have pairs compare the Morning and Winter presets, then explain how lower Sun Angle changes the best Panel Tilt using evidence from the meter.",
      "Ask students to keep Sun Angle fixed while changing only Panel Tilt, supporting NGSS 4-PS3-2 with observations about energy transfer from sunlight to electricity.",
      "Connect NGSS 4-ESS3-1 by discussing how solar panels use sunlight as a natural resource and why placement matters for real buildings.",
    ],
    faq: [
      {
        question: "How does a solar panel turn sunlight into electricity?",
        answer:
          "A solar panel is made of a special material — usually silicon — that reacts to light. When tiny particles of light energy called photons hit the material, they knock loose tiny electrons inside it. Those moving electrons flow through wires as electric current — that is electricity! This process is called the photovoltaic effect. Photovoltaic means light-electricity. Solar panels have no moving parts, make no noise, and produce no pollution while making electricity. This directly connects to NGSS standard 4-PS3-2, which covers how energy can be converted from one form to another, and 4-ESS3-1, which looks at how humans use Earth's natural resources including sunlight.",
      },
      {
        question: "Why does the panel angle matter so much?",
        answer:
          "Imagine shining a flashlight straight down on a piece of paper — you get a bright, tight circle of light. Now tilt the flashlight to the side — the same amount of light spreads over a bigger, oval-shaped area, making it dimmer everywhere. Solar panels work the same way. When the panel faces the Sun directly, all the sunlight hits a small area and delivers lots of energy. When the panel tilts away, the same sunlight spreads over a larger surface and delivers less energy to each part of the panel. This is also why summer sunlight feels stronger — it hits the ground more directly than winter sunlight, which arrives at a steep angle.",
      },
      {
        question: "Is solar energy good for the environment?",
        answer:
          "Solar energy is one of the cleanest energy sources we have. Making electricity from sunlight does not burn anything, so it produces no smoke, soot, or gases that warm the atmosphere. Once a solar panel is built, it can quietly make clean electricity for 25 to 30 years or longer with very little maintenance. The only environmental concern is making the panels in the first place, which uses some energy and materials, and disposing of old panels responsibly. Compared to burning coal or natural gas, solar energy has a much smaller impact on the air, water, and climate. Using more solar energy helps protect the environment for future generations.",
      },
      {
        question: "Can solar energy power a whole house?",
        answer:
          "Yes! Many families around the world already power their entire homes with solar panels. A typical house needs a set of panels on the roof — usually 10 to 20 panels depending on how much electricity the family uses. On a sunny day the panels can make more electricity than the house needs, and the extra can be stored in a battery or sent back to the electric grid. At night or on cloudy days, the house draws power from the battery or the grid. As solar panels get better and less expensive, more and more homes, schools, and businesses are switching to solar power to save money and help the environment.",
      },
      {
        question: "What is a renewable energy source?",
        answer:
          "Renewable means it can be used over and over without running out. Sunlight is renewable because the Sun keeps shining every day — we are not using it up the way we use up coal or oil, which took millions of years to form underground. Wind, flowing water, and heat from inside the Earth are also renewable energy sources. Renewable sources are important because they will always be available for future generations and they usually cause much less pollution than burning fuels. NGSS standard 4-ESS3-1 asks students to learn about natural resources and how people can protect them — solar energy is a great real-world example.",
      },
    ],
  },
};
