import type { Experiment } from "@/shared/types/experiment";

export const soilFormation: Experiment = {
  id: "soil-formation",
  slug: "soil-formation",
  title: "Soil Formation",
  subtitle: "From bedrock to topsoil — the five factors of soil development",
  description:
    "Explore how soil forms through the interaction of parent material, climate, organisms, topography, and time. An interactive soil profile cross-section shows the O, A, B, C, and R horizons. Adjust weathering rate, precipitation, and biological activity to observe how each factor influences soil depth, composition, and color over geological time.",
  thumbnail: "/imgs/experiments/soil-formation.png",

  standards: {
    ngss: ["MS-ESS2-2", "MS-ESS3-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: [
    "soil formation",
    "soil horizons",
    "weathering",
    "pedogenesis",
    "soil profile",
    "erosion",
    "Earth Science",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "weatheringRate",
      label: "Weathering Rate",
      unit: "mm/yr",
      min: 0.01,
      max: 2,
      default: 0.5,
      step: 0.01,
      tier: "free",
    },
    {
      id: "precipitation",
      label: "Precipitation",
      unit: "cm/yr",
      min: 10,
      max: 300,
      default: 80,
      step: 10,
      tier: "free",
    },
    {
      id: "bioActivity",
      label: "Bio Activity",
      unit: "%",
      min: 0,
      max: 100,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "timeScale",
      label: "Time",
      unit: "kyr",
      min: 0.1,
      max: 100,
      default: 10,
      step: 0.1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "S = f(Cl, O, R, P, T)",
      description:
        "Jenny's state factor equation: soil (S) is a function of climate (Cl), organisms (O), relief/topography (R), parent material (P), and time (T).",
    },
    {
      latex: "\\text{Depth} \\propto \\sqrt{\\text{time} \\times \\text{weathering rate}}",
      description:
        "Soil depth increases roughly as the square root of time, reflecting diminishing returns as the weathering front deepens away from surface energy inputs.",
    },
  ],

  theory:
    "Soil formation (pedogenesis) transforms bedrock and sediment into layered soil profiles through physical, chemical, and biological weathering. The soil profile consists of distinct horizons: O (organic litter), A (topsoil, rich in humus), B (subsoil, accumulated minerals from leaching), C (weathered parent material), and R (bedrock). Five factors control soil development: (1) Parent material — the original rock or sediment determines mineral composition. (2) Climate — temperature and precipitation drive chemical weathering rates; tropical soils are deeply weathered while desert soils are thin. (3) Organisms — roots break rock, earthworms mix organic matter, bacteria decompose material. (4) Topography — steep slopes lose soil to erosion while valleys accumulate it. (5) Time — mature soils take thousands of years to develop distinct horizons. Soil is a non-renewable resource on human timescales — it takes ~500 years to form 2 cm of topsoil.",

  instructions:
    "Adjust the weathering rate, precipitation, and biological activity sliders to see how each factor affects the soil profile. Use the time slider to fast-forward through soil development. Click on any horizon layer for details about its composition and formation process.",

  challenges: [
    {
      id: "sf-c1",
      question: "Why is soil considered a non-renewable resource?",
      hint: "It takes roughly 500-1000 years to form just 2 cm of topsoil. Human agriculture can erode soil 10-100× faster than it forms, making it effectively non-renewable on human timescales.",
      tier: "free",
    },
    {
      id: "sf-c2",
      question: "How does climate affect the type of soil that forms?",
      hint: "Tropical climates with high temperature and rainfall produce deeply weathered, nutrient-poor laterite soils. Arid climates produce thin, mineral-rich soils with caliche layers. Temperate climates produce moderate, fertile soils ideal for agriculture.",
      tier: "free",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["rock-cycle", "glaciers-ice-ages"],
  htmlPath: "/experiments/earth-science/soil-formation.html",

  seoTitle: "Soil Formation Interactive Simulation | Scivra Earth Science",
  seoKeywords: [
    "soil formation simulation",
    "soil horizons interactive",
    "pedogenesis",
    "weathering simulation",
    "Earth science virtual lab",
    "NGSS ESS2",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Soil Formation and the Five Soil-Forming Factors",
  },
  contentSections: {
    whatIsIt:
      "Soil formation — called pedogenesis — is the slow process by which solid rock and loose sediment are transformed into the layered, living material we call soil. It is one of Earth's most important slow-motion processes, and it takes a very long time: roughly 500 years to build just 2 centimeters of topsoil. The simulation shows a cross-section of the ground revealing distinct soil layers called horizons. Scientists use five factors to explain why soils look and behave differently around the world: the type of parent material (the original rock or sediment), climate (especially temperature and rainfall), organisms (from earthworms to bacteria to plant roots), topography (slope and position on the landscape), and time. Adjust the controls to watch how each factor shapes the thickness, color, and composition of each horizon over thousands of years.",
    parameterExplanations: {
      weatheringRate:
        "Controls how fast the parent rock physically and chemically breaks down, measured in millimeters per year (mm/yr). A low rate (near 0.01 mm/yr) mimics cold or dry conditions where chemical reactions are sluggish. A higher rate (near 2 mm/yr) represents warm, humid environments where water and temperature accelerate the breakdown of minerals. Faster weathering generally produces a deeper soil profile over the same amount of time.",
      precipitation:
        "Sets the annual rainfall in centimeters per year (cm/yr). Higher precipitation drives more chemical weathering, leaches minerals downward through the soil (creating the B horizon), and supports denser plant and organism communities that add organic matter. Low precipitation (near 10 cm/yr) mimics desert conditions where thin, mineral-rich soils form. High precipitation (near 300 cm/yr) mimics tropical rainforest soils that are deeply weathered but often nutrient-poor at the surface because nutrients wash away quickly.",
      bioActivity:
        "Represents the level of biological activity as a percentage (0–100%). At low values, few organisms are present to mix organic material into the soil or release acids that break down minerals. At high values, abundant earthworms, insects, plant roots, and microbes churn the soil, add humus to the A horizon, and dramatically speed up weathering. Biological activity is one of the most powerful drivers of topsoil richness.",
      timeScale:
        "Fast-forwards the simulation through time measured in thousands of years (kyr). At 0.1 kyr (100 years), only a thin surface layer has developed. At 10 kyr (10,000 years), distinct horizons become visible. At 100 kyr, the profile reaches a mature state. Soil depth does not grow indefinitely — it approaches a steady balance between weathering at the bottom and erosion at the top.",
    },
    misconceptions: [
      {
        wrong: "Soil is just dirt — it is not alive.",
        correct:
          "Healthy soil is one of the most densely populated living environments on Earth. A single teaspoon of topsoil can contain billions of bacteria, millions of fungi, and thousands of tiny invertebrates. This living community breaks down dead organic matter, recycles nutrients, and builds the humus that gives fertile soil its dark color and spongy texture.",
      },
      {
        wrong: "Soil forms quickly and can easily be replaced if it erodes.",
        correct:
          "Forming 2 centimeters of topsoil typically takes around 500 years. Modern farming can erode that same layer in just a few decades. Because soil forms so slowly compared to human timescales, it is considered a non-renewable resource — once eroded or paved over, it is effectively gone for human purposes.",
      },
      {
        wrong: "More rain always makes better soil.",
        correct:
          "Rainfall is just one factor. Very high precipitation in tropical regions produces deeply weathered soils that are often poor in nutrients because minerals leach away faster than they can be replaced. The most fertile soils often form in temperate climates with moderate, seasonal rainfall that balances weathering with nutrient retention.",
      },
      {
        wrong: "All soil horizons are present everywhere on Earth.",
        correct:
          "Soil horizon development depends on the five forming factors. Desert soils may lack a distinct O horizon entirely. Very young soils on steep slopes may show only a thin A horizon over bedrock. Tropical soils can have very deep B horizons but thin A horizons. The simulation lets you explore how changing conditions produces very different profiles.",
      },
    ],
    teacherUseCases: [
      "Desert vs. rainforest comparison: set precipitation to 20 cm/yr and bioActivity to 10%, run to 50 kyr, and sketch the profile. Then set precipitation to 250 cm/yr and bioActivity to 80%, run to 50 kyr, and compare. Students explain differences using the five soil-forming factors (MS-ESS2-2).",
      "Time as a variable: hold weatheringRate at 0.5 mm/yr, precipitation at 80 cm/yr, and bioActivity at 50%. Pause at 1 kyr, 10 kyr, and 100 kyr to sketch each profile and measure horizon thickness. Students graph horizon depth vs. time and describe the relationship as roughly square-root (diminishing returns).",
      "Non-renewable resource argument: run the simulation to 50 kyr to build a mature profile, then ask students how long it would take to lose the A horizon if erosion removed 1 cm per year. Students calculate and compare to natural soil formation rates, building evidence for why soil conservation matters (MS-ESS3-4).",
      "Biological activity investigation: vary bioActivity from 0% to 100% while holding other parameters constant. Students record how the O and A horizon thicknesses change and explain the mechanism — organisms add organic matter, mix layers, and accelerate chemical weathering.",
      "Slope and erosion discussion: use the simulation results to hypothesize what would happen to a soil profile on a steep hillside vs. a flat valley floor. Students predict which would have thicker horizons and connect to topography as a soil-forming factor.",
    ],
    faq: [
      {
        question: "What are the different layers (horizons) in a soil profile?",
        answer:
          "A typical mature soil has five horizons. The O horizon is a surface layer of decomposing organic litter like leaves and twigs. The A horizon is topsoil, rich in humus (broken-down organic matter) and the most fertile layer. The B horizon is subsoil, where minerals leached from above accumulate. The C horizon is partially weathered parent material — fragments of the original rock starting to break apart. The R horizon is solid bedrock at the bottom that has not yet been weathered. Not every soil has all five layers.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports MS-ESS2-2, which asks students to construct an explanation based on evidence for how geoscience processes have changed Earth's surface over varying time and spatial scales. It also connects to MS-ESS3-4, which addresses human impacts on Earth's materials and systems — including the slow formation and rapid loss of topsoil through erosion and poor land management practices.",
      },
      {
        question: "Why does soil depth grow slowly and then level off?",
        answer:
          "Early in pedogenesis, fresh rock near the surface weathers relatively quickly because it is exposed to water, temperature changes, and organisms. As the soil deepens, the weathering front moves farther from the surface where most energy and biological activity are concentrated. Chemical reactions also slow as the most reactive minerals are used up. The result is that soil depth increases quickly at first and then slows — a pattern that resembles a square-root curve in this simulation.",
      },
      {
        question: "How do plants and animals affect soil formation?",
        answer:
          "Organisms are one of the five key soil-forming factors. Plant roots physically crack rock and release weak acids that chemically break minerals down. When plants and animals die, bacteria and fungi decompose the organic material into humus, enriching the A horizon. Earthworms and burrowing insects mix the layers and improve drainage. In fact, the difference between a rich agricultural soil and a thin, infertile one often comes down to the diversity and abundance of the organisms living in it.",
      },
      {
        question: "Can soil form on other planets?",
        answer:
          "Mars has a layer of loose, weathered rock material called regolith that superficially resembles early-stage soil, but it lacks organic matter and living organisms, which are essential for developing true soil horizons. Scientists studying Mars regolith and Earth soil formation together gain insight into what conditions are needed for soil — and potentially life — to develop on a planetary surface.",
      },
    ],
  },
};
