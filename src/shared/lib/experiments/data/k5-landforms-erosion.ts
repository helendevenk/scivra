import type { Experiment } from "@/shared/types/experiment";

export const k5LandformsErosion: Experiment = {
  id: "k5-landforms-erosion",
  slug: "k5-landforms-erosion",
  title: "Landforms & Erosion",
  subtitle: "Watch water, wind, and ice shape the landscape over time",
  description:
    "See how Earth's surface changes! Choose an erosion agent — water, wind, or glacial ice — and speed up time to watch mountains wear down, valleys carve out, and coastlines shift. Learn why the Grand Canyon is so deep and how rivers create deltas. Geology happens right before your eyes!",
  thumbnail: "/imgs/experiments/k5-landforms-erosion.png",

  standards: {
    ngss: ["4-ESS2-1", "4-ESS2-2"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "3-5",
  tags: ["erosion", "landforms", "weathering", "geology", "K5 science"],
  difficulty: "beginner",

  parameters: [
    { id: "erosionRate", label: "Erosion Rate", unit: "%", min: 1, max: 100, default: 50, step: 1, tier: "free" },
    { id: "timeScale", label: "Time Scale", unit: "%", min: 1, max: 100, default: 20, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "E = k \\cdot F \\cdot t", description: "Erosion (E) depends on the force of the agent (F), time (t), and the rock's resistance (k)" },
  ],

  theory: "Erosion is the process that breaks down and moves rock and soil from one place to another. Water erosion is the most powerful — rivers carve valleys, and ocean waves reshape coastlines. Wind erosion is strongest in dry areas with loose soil, creating sand dunes and wearing down rock faces. Glacial erosion happens when massive ice sheets slowly grind across the land, scooping out U-shaped valleys and leaving behind boulders. Weathering (breaking rock apart) works together with erosion (carrying pieces away). Over thousands of years these forces create landforms like canyons, mesas, deltas, and beaches.",

  instructions: "Use the Erosion Rate slider to make the land change slowly or quickly. Use the Time Scale slider to watch a short or long time pass. Try the River Canyon, Coastal Cliff, and Desert Dunes presets to compare how moving water, waves, and wind shape the land.",

  challenges: [
    { id: "k5le-c1", question: "Which erosion agent carved the Grand Canyon?", hint: "Water! The Colorado River has been cutting through rock for about 5–6 million years, creating the canyon we see today.", tier: "free" },
    { id: "k5le-c2", question: "How does a glacier change the shape of a valley?", hint: "Glaciers are heavy rivers of ice that grind the valley floor and sides, turning a narrow V-shape into a wide U-shape.", tier: "free" },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-weather-patterns", "soil-formation"],
  htmlPath: "/experiments/elementary/k5-landforms-erosion.html",

  seoTitle: "Landforms & Erosion for Kids | Scivra Elementary Science",
  seoKeywords: ["landforms and erosion for kids", "weathering and erosion elementary", "geology K5", "K5 earth science experiment"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Elementary School", teaches: "Landforms, Erosion, and Earth Surface Processes" },
  htmlControlAliases: { erosionRate: "erosionSlider", timeScale: "timeSlider" },
  presets: [
    { id: "canyon", label: "🏜️ River Canyon", description: "A river slowly cuts into rock and carries sand away. Over a long time, the channel can grow into a deep canyon." },
    { id: "cliff", label: "🌊 Coastal Cliff", description: "Ocean waves hit the shore again and again. The water wears away the bottom of a cliff and can make pieces fall." },
    { id: "dunes", label: "🌵 Desert Dunes", description: "Wind pushes loose sand across dry land. Sand piles up into dunes that can move and change shape." },
  ],
  contentSections: {
    whatIsIt:
      "Have you ever watched rainwater wash dirt off a hill, or seen sand move when the wind blows? That is erosion in action! Erosion is the slow wearing away of rocks and soil and the moving of those pieces to a new place. It happens all over Earth and has been shaping the land for millions of years. Water is the most powerful eroder. Rivers and streams carry tiny pieces of rock and sand downstream, carving out valleys and canyons over a very long time. Wind picks up loose sand and dust in dry places, blasting it against rocks and slowly shaping them into amazing rounded forms. Glaciers — huge, slow rivers of ice — grind across the land and carve wide valleys. All of these forces work with time. The Grand Canyon, for example, was carved by the Colorado River over about 5 to 6 million years. That is an incredibly long time — much longer than humans have been on Earth! In this experiment, you can choose which erosion force to use and speed up time to see the land change before your eyes.",
    parameterExplanations: {
      erosionRate:
        "Erosion Rate controls how strongly the land is worn away. A low number means the river, waves, or wind move only a little rock and soil, so the land changes slowly. A high number means more material is carried away, so channels, cliffs, or dunes change faster. Time Scale controls how much time passes in the model. Erosion usually takes many years, so the slider helps you see slow changes quickly. Try one preset, move one slider, and watch what changes. Then reset and test a different preset.",
      timeScale:
        "Use the three presets to choose a place to study. River Canyon shows water cutting a path through rock. Coastal Cliff shows waves wearing away land near the ocean. Desert Dunes shows wind moving sand. The sliders still matter after you pick a preset: Erosion Rate changes how much material moves, and Time Scale changes how long the process runs. Compare the shapes you see. A canyon may get deeper, a cliff may pull back, and dunes may shift across the desert.",
    },
    misconceptions: [
      {
        wrong: "Erosion only happens during big storms or floods.",
        correct:
          "Erosion happens all the time, even in gentle rain or a light breeze. A slow trickle of water over thousands of years can carve deep channels in rock. Wind that blows steadily through a desert slowly rounds and hollows out boulders. Most erosion is so gradual that we never notice it in our lifetime, but over hundreds and thousands of years it dramatically reshapes the land.",
      },
      {
        wrong: "Mountains and canyons have always looked the way they do now.",
        correct:
          "Mountains, valleys, and canyons are always slowly changing. Mountains are worn down by water, wind, and ice over millions of years. Canyons grow wider and deeper as rivers keep cutting through rock. New mountains can also be pushed up from below by the movement of large pieces of Earth's crust. The landscapes we see today are just a snapshot of a very long, slow process of change.",
      },
      {
        wrong: "Water erosion and wind erosion make the same shapes.",
        correct:
          "Water and wind leave very different clues on the land. Water erosion usually creates narrow valleys, deep canyons, and river channels with V-shaped cross-sections. It also deposits material in fan shapes where rivers slow down. Wind erosion creates smooth, rounded rock shapes and moving sand dunes. Glacial ice creates wide, U-shaped valleys, scratched rocks, and piles of mixed gravel and boulders called moraines. Geologists can tell which force shaped a landscape by looking at the shapes it left behind.",
      },
      {
        wrong: "Erosion is always harmful and bad.",
        correct:
          "Erosion creates many beautiful and useful landforms. River deltas built by erosion and deposition are some of the most fertile farmland on Earth — the Nile Delta and Mississippi Delta feed millions of people. Beaches are made of sand that was eroded from rocks and carried by water. Canyons and valleys shaped by rivers become home to many animals and plants. Erosion can cause problems when it happens too fast in the wrong place, like when topsoil washes off farmland, but as a natural process it is essential to shaping the living world.",
      },
    ],
    teacherUseCases: [
      "Use the River Canyon preset and ask students to describe evidence that moving water can change landforms over time, connecting observations to NGSS 4-ESS2-1.",
      "Keep the River Canyon preset active while students change only the Erosion Rate slider, then have them compare how faster and slower erosion affect the depth of the channel.",
      "Use the Coastal Cliff preset to discuss how waves can reshape shorelines. Ask students to identify where material appears to be removed and where it may be deposited.",
      "Use the Desert Dunes preset to show wind moving sand. Have students compare dune movement with canyon carving and explain how different Earth processes leave different patterns.",
      "Run a short CER discussion in which students choose one preset, record both slider values, and support a claim about how time and erosion shape land.",
    ],
    faq: [
      {
        question: "What is the difference between weathering and erosion?",
        answer:
          "Weathering and erosion work as a team, but they are two different steps. Weathering is the breaking of rocks into smaller pieces right where they sit. Rain, ice, heat, and even plant roots can crack and crumble rock over time. Think of it like crumbling a cookie. Erosion is what happens next — the small pieces get picked up and carried away by water, wind, or ice. Think of it like sweeping up the cookie crumbs and moving them somewhere else. Weathering breaks things apart; erosion moves them. Both together are constantly reshaping Earth's surface. NGSS standards 4-ESS2-1 and 4-ESS2-2 ask students to observe and describe these processes.",
      },
      {
        question: "How did the Grand Canyon form?",
        answer:
          "The Grand Canyon was carved by the Colorado River over about 5 to 6 million years. The river slowly wore away the rock, carrying tiny pieces downstream. The canyon is now about 446 kilometers long, up to 29 kilometers wide, and over 1.6 kilometers deep — nearly a mile straight down! The layers of colorful rock on the canyon walls are like the pages of a history book, with older rock at the bottom and younger rock near the top. Some of the rock at the very bottom is almost 2 billion years old. Water is patient — a small river, given enough time, can carve through solid rock and create one of the most spectacular landscapes on Earth.",
      },
      {
        question: "Why are sandy beaches always changing?",
        answer:
          "Beaches are shaped by erosion and deposition working together constantly. Ocean waves pick up sand and move it along the shore — this is called longshore drift. Storm waves erode cliffs and add new sand. Rivers bring eroded material from inland and deposit it at the coast, building new beach. In calm weather, sand drifts back. This means beaches are always shifting — parts grow while other parts shrink. That is why shorelines look different over years and decades. Beaches are among the most actively changing landforms on Earth, and the sand you walk on is made of tiny rock and shell pieces that have been worn down by water over a very long time.",
      },
      {
        question: "Can erosion happen underwater?",
        answer:
          "Yes! Water currents on the ocean floor, rivers underwater, and even waves crashing on underwater cliffs all erode rock and sediment. Underwater erosion can carve channels in the seafloor called submarine canyons — some are just as deep and dramatic as canyons on land. Turbidity currents — fast-moving flows of muddy water — rush down underwater slopes and carve these features in hours or days. Coral reefs are also worn away by wave energy and by animals that nibble on them. Erosion shapes Earth's surface both above and below the water.",
      },
      {
        question: "How can people slow down erosion where it causes problems?",
        answer:
          "When erosion happens too fast — like topsoil washing off farmland in heavy rain, or a riverbank collapsing — people use several methods to slow it down. Planting grass, trees, and shrubs on bare soil gives roots that hold the soil in place. Farmers plant crops in curved rows that follow the shape of hills, called contour farming, so water cannot rush straight down the slope. Builders place erosion barriers like hay bales, nets, or rock walls to catch moving soil. Wetlands and healthy plant cover act like natural sponges that soak up rainwater before it can wash soil away. Protecting the land from erosion helps keep soil healthy for growing food and keeps rivers and streams clean.",
      },
    ],
  },
};
