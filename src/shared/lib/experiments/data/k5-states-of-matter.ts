import type { Experiment } from "@/shared/types/experiment";

export const k5StatesOfMatter: Experiment = {
  id: "k5-states-of-matter",
  slug: "k5-states-of-matter",
  title: "States of Matter",
  subtitle: "Solid, liquid, and gas — how heating and cooling change matter",
  description:
    "Heat and cool a substance to watch it transform between solid, liquid, and gas. See molecules move faster as temperature rises and slower as it drops. Discover the melting point and boiling point of common materials.",
  thumbnail: "/imgs/experiments/k5-states-of-matter.png",

  standards: {
    ngss: ["2-PS1-1", "5-PS1-3", "MS-PS1-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "3-5",
  tags: ["states of matter", "solid", "liquid", "gas", "melting", "boiling", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "temperature",
      label: "Temperature",
      unit: "K",
      min: 0,
      max: 500,
      default: 100,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\text{Solid} \\xrightarrow{\\text{heat}} \\text{Liquid} \\xrightarrow{\\text{heat}} \\text{Gas}",
      description: "Adding heat changes matter from solid → liquid → gas",
    },
    {
      latex: "Q = mL \\quad (\\text{latent heat for phase change})",
      description: "Heat needed for phase change = mass × latent heat",
    },
  ],

  theory:
    "Matter exists in three main states: solid, liquid, and gas. In a solid, particles are packed tightly and vibrate in place — the substance has a definite shape and volume. In a liquid, particles can flow past each other — the substance has definite volume but takes the shape of its container. In a gas, particles move freely and fast — the substance has no definite shape or volume. Heating gives particles more energy; cooling takes it away. The temperature at which a solid becomes liquid is the melting point; the temperature at which liquid becomes gas is the boiling point. Different materials have different melting/boiling points.",

  instructions:
    "Drag the Temperature slider (0-500 K) to heat or cool a sample of water, and watch molecules vibrate (solid), flow (liquid), or zoom (gas). Or click one of the three preset buttons — Solid Ice (80 K), Liquid Water (300 K), or Steam Gas (450 K) — to jump straight to that state. Pressure adjusts automatically with the presets to show realistic conditions for each phase.",

  challenges: [
    {
      id: "sm-c1",
      question: "At what temperature does water freeze? At what temperature does it boil?",
      hint: "Water freezes (liquid → solid) at 0°C and boils (liquid → gas) at 100°C at 1 atm pressure.",
      tier: "free",
    },
    {
      id: "sm-c2",
      question: "In which state do molecules move the fastest? The slowest?",
      hint: "Gas molecules move fastest (lots of energy, no attraction holds them). Solid molecules move slowest (tightly bonded, only vibrate).",
      tier: "free",
    },
    {
      id: "sm-c3",
      question: "Why does a gas fill its entire container but a liquid doesn't?",
      hint: "Gas molecules have enough energy to overcome any attraction between them, so they spread out to fill all available space. Liquid molecules stay together due to intermolecular forces.",
      tier: "free",
    },
    {
      id: "sm-c4",
      question: "Why does increasing pressure raise the boiling point of water?",
      hint: "Higher pressure pushes molecules closer, requiring more energy (higher temperature) for them to escape into the gas phase. At the top of a mountain (lower pressure), water boils below 100°C.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-energy-conversion", "thermochemistry"],

  seoTitle: "States of Matter Simulation for Kids | Scivra Elementary",
  seoKeywords: [
    "states of matter kids",
    "solid liquid gas simulation",
    "melting boiling point interactive",
    "molecule animation elementary",
    "K-5 chemistry simulation",
    "phase change kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "States of Matter",
  },
  htmlControlAliases: {
    temperature: "tempSlider",
  },
  presets: [
    {
      id: "solid",
      label: "Solid Ice (80 K)",
      description:
        "Very cold sample at 80 K — well below water's freezing point. Molecules are locked in a rigid crystal pattern; the substance behaves as a solid.",
      paramValues: { temperature: 80 },
    },
    {
      id: "liquid",
      label: "Liquid Water (300 K)",
      description:
        "Room-temperature sample at 300 K (about 27 °C). Molecules slide past each other with enough energy to flow but still attract each other; the substance behaves as a liquid.",
      paramValues: { temperature: 300 },
    },
    {
      id: "gas",
      label: "Steam Gas (450 K)",
      description:
        "Hot sample at 450 K (about 177 °C). Molecules have enough energy to break free of each other and zoom around independently; the substance behaves as a gas.",
      paramValues: { temperature: 450 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Everything around you is made of tiny, tiny particles — atoms or molecules — far too small to see. How those molecules behave depends on how much heat energy they have. When they are cold and do not have much energy, they huddle together tightly and barely move. That gives us a solid, like an ice cube. When they warm up and get more energy, they can slide past each other and flow. That gives us a liquid, like the water in your glass. When they get even more energy, they zoom around freely in all directions and spread out to fill whatever space they are in. That gives us a gas, like the steam rising from a hot pot of soup. Matter can change between these three states just by adding or taking away heat. Melting is when a solid warms up and turns into a liquid. Boiling is when a liquid heats up so much it turns into a gas. Freezing is when a liquid cools down and turns into a solid. Every day you see all three states: ice in your freezer is solid water, the water in your cup is liquid, and the water from a hot shower produces both invisible water vapor (true gas) and the white misty cloud you see — which is actually tiny liquid droplets that formed when the hot vapor cooled in the air.",
    parameterExplanations: {
      temperature:
        "Temperature controls how hot or cold the water sample is, measured in kelvins (K). Kelvin is the science temperature scale where 0 K is the coldest possible — colder than anything in nature. The slider runs from 0 K to 500 K. Important moments for water: 273 K is freezing (water turns to ice), and 373 K is boiling (water turns to steam). Drag below 273 K and watch molecules slow down and lock into a solid pattern; drag above 373 K and watch them break free and zoom around as a gas. The three preset buttons jump you to a Solid (80 K), a Liquid (300 K, about room temperature), or a Gas (450 K, hotter than boiling). On the Celsius scale you may know from weather reports, 0 K = -273 °C and 273 K = 0 °C.",
    },
    misconceptions: [
      {
        wrong: "When ice melts, the water particles change into different particles.",
        correct:
          "The particles in ice and liquid water are exactly the same — they are both water molecules. The only difference is how those molecules are arranged and how much energy they have. In ice they are locked in a regular pattern and only vibrate. In liquid water they have more energy and can slide past each other. The same molecules that were in the ice are now in the liquid water, just moving differently. Nothing new is created when ice melts.",
      },
      {
        wrong: "Steam is the same as smoke.",
        correct:
          "Steam is water in gas form — it is invisible water vapor. The white cloud you see rising from a kettle is actually tiny water droplets that have already started to cool back into liquid, not the steam itself. Smoke is completely different: it is made of tiny solid particles and chemicals released by burning materials. Steam is pure water; smoke is a mix of carbon particles and other compounds from burning. They look similar but are very different things.",
      },
      {
        wrong: "Water vapor disappears into nothing when it evaporates.",
        correct:
          "Water vapor is invisible, but it is still there in the air around you. When water evaporates from a puddle, the liquid water turns into water vapor gas and mixes into the air — you just cannot see it anymore. You can prove it is still there: on a humid day the air feels sticky because there is so much water vapor in it. If the air cools down enough, the vapor turns back into liquid droplets and you see fog, dew on grass in the morning, or clouds in the sky.",
      },
      {
        wrong: "All materials melt and boil at the same temperatures as water.",
        correct:
          "Every substance has its own unique melting and boiling points. Iron does not melt until about 1538°C — far hotter than any kitchen oven. Nitrogen gas in the air around us only turns into a liquid when cooled to about -196°C. Butter melts around 35°C, which is why it softens in your hand. Chocolate melts around 37°C. These differences are why different materials are useful for different things: we want our frying pan to stay solid at cooking temperatures, but we want butter to melt easily.",
      },
    ],
    teacherUseCases: [
      "Click the Solid Ice preset (80 K), then drag the Temperature slider slowly up to 500 K. Have students call out 'melting' when they see the transition near 273 K and 'boiling' near 373 K. Record both transition temperatures — directly supporting 2-PS1-1 (classify materials by observable properties).",
      "Cycle through all three preset buttons in order — Solid Ice → Liquid Water → Steam Gas — and have students describe what they see the molecules doing in each state (vibrating in place / sliding past each other / zooming freely). Pair this with vocabulary practice: solid, liquid, gas.",
      "Use the Solid Ice preset (80 K) to introduce the kelvin scale: 0 K is the coldest possible, water freezes at 273 K, water boils at 373 K. Compare these to Celsius equivalents (-273 °C, 0 °C, 100 °C). This helps 5th graders connect a science temperature scale to the everyday Celsius they know — supporting 5-PS1-3 measurement skills.",
      "Have students predict the state of water at 200 K, 350 K, and 400 K before dragging the slider, then check their predictions. Discuss why predictions were right or wrong using the freezing point (273 K) and boiling point (373 K) as anchor values.",
      "After exploring the presets, ask students why each preset uses a different temperature: 80 K for ice (well below freezing), 300 K for liquid (above freezing, below boiling), 450 K for gas (above boiling). Reinforces that the same substance — water — exists in different states based on temperature alone.",
    ],
    faq: [
      {
        question: "Why does ice feel cold if the molecules inside it are still moving?",
        answer:
          "In ice, the water molecules are vibrating in place, but they do not have much energy — they just wiggle a little. When you touch ice, heat energy flows from your warmer hand into the colder ice. Your hand loses heat energy, which is why it feels cold. The ice gains that heat energy, which makes its molecules vibrate faster until eventually they have enough energy to slip past each other and the ice starts to melt. Coldness is really just the absence of heat energy, not a separate thing that flows into you.",
      },
      {
        question: "Is steam the same thing as water?",
        answer:
          "Yes! Steam is water in its gas state. The exact same water molecules that were liquid in the pot are now moving around freely as gas when the water boils. The molecules did not change — they just got enough heat energy to escape from the liquid and zoom around as a gas. When steam touches a cool surface, it loses energy, slows back down, and turns back into liquid water droplets — that is why mirrors in the bathroom fog up during a hot shower. The water is going back and forth between liquid and gas depending on how much energy it has.",
      },
      {
        question: "Why does my ice cream melt on a warm day but not in the freezer?",
        answer:
          "Ice cream is mostly solid because it is kept very cold in the freezer — usually around -18°C. At that temperature the water and fats in the ice cream do not have enough energy to flow freely, so they stay solid. On a warm summer day, the warm air around your ice cream sends heat energy into it. As those molecules gain energy, they start moving past each other more freely — the ice cream softens and then melts into a liquid puddle. To stop it melting, you need to take heat away by putting it back in the freezer. This is heating causing a change from solid to liquid, just like the simulation shows.",
      },
      {
        question: "Which NGSS standards does this experiment connect to?",
        answer:
          "This simulation supports 2-PS1-1, which asks students to plan and conduct an investigation to describe and classify different kinds of materials by their observable properties, including whether they are solid or liquid at different temperatures. It also connects to 5-PS1-3, which asks students to make observations and measurements to identify material properties that are maintained regardless of the quantity of the sample — like the fact that water always melts at 273 K (0 °C) whether you have a tiny ice cube or a whole glacier. The kelvin temperature scale used here is a useful preview of the units students will see again in middle school physical science (MS-PS1-4).",
      },
      {
        question: "Can something go straight from solid to gas without becoming liquid first?",
        answer:
          "Yes, and it is called sublimation! Dry ice (solid carbon dioxide) does this at normal air pressure — it turns directly from a solid into carbon dioxide gas without ever becoming liquid. That is why dry ice does not leave a puddle. Snow and ice can also slowly sublimate on a very cold but sunny day, which is why a pile of snow can shrink on a bright winter day even when the temperature never gets above freezing. In the simulation, most substances follow the solid to liquid to gas path, but in real nature sublimation happens whenever the pressure and temperature conditions skip past the liquid range.",
      },
    ],
  },
};
