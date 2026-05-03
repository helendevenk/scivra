import type { Experiment } from "@/shared/types/experiment";

export const soilFormation: Experiment = {
  id: "soil-formation",
  slug: "soil-formation",
  title: "Soil Formation",
  subtitle: "From bedrock to topsoil — the five factors of soil development",
  description:
    "Explore how soil forms through the interaction of parent material, climate, organisms, topography, and time. An interactive soil profile cross-section shows the O, A, B, C, and R horizons. Adjust moisture and formation time, then compare Temperate Forest, Desert Aridisol, and Prairie Mollisol presets to observe how environmental setting influences soil depth, composition, and color over geologic time.",
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
      id: "moisture",
      label: "Moisture",
      unit: "%",
      min: 0,
      max: 100,
      default: 50,
      step: 5,
      tier: "free",
    },
    {
      id: "formationTime",
      label: "Formation Time",
      unit: "years",
      min: 100,
      max: 10000,
      default: 1000,
      step: 100,
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
      latex: "\\text{Depth} \\propto \\sqrt{\\text{formation time} \\times \\text{moisture factor}}",
      description:
        "Soil depth increases roughly as the square root of formation time when moisture supports mineral alteration, reflecting diminishing returns as the active front deepens away from surface energy inputs.",
    },
  ],

  theory:
    "Soil formation (pedogenesis) transforms bedrock and sediment into layered soil profiles through physical, chemical, and biological weathering. The soil profile consists of distinct horizons: O (organic litter), A (topsoil, rich in humus), B (subsoil, accumulated minerals from leaching), C (weathered parent material), and R (bedrock). Five factors control soil development: (1) Parent material — the original rock or sediment determines mineral composition. (2) Climate — temperature and rainfall drive chemical weathering; tropical soils are deeply weathered while desert soils are thin. (3) Organisms — roots break rock, earthworms mix organic matter, bacteria decompose material. (4) Topography — steep slopes lose soil to erosion while valleys accumulate it. (5) Time — mature soils take thousands of years to develop distinct horizons. Soil is a non-renewable resource on human timescales — it takes ~500 years to form 2 cm of topsoil.",

  instructions:
    "Adjust the Moisture and Formation Time sliders to see how water availability and duration shape the soil profile. Try the Temperate Forest, Desert Aridisol, and Prairie Mollisol presets to compare three realistic soil-forming settings. Click on any horizon layer for details about its composition and formation process.",

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
  htmlControlAliases: { moisture: "moistSlider", formationTime: "ftimeSlider" },
  presets: [
    {
      id: "forest",
      label: "Temperate Forest",
      description:
        "A moist, forested setting where leaf litter, roots, and moderate climate conditions help produce a layered soil with organic-rich topsoil.",
      paramValues: { moisture: 70, formationTime: 5000 },
    },
    {
      id: "desert",
      label: "Desert Aridisol",
      description:
        "A dry setting where limited water slows horizon development and mineral accumulation can become an important feature of the profile.",
      paramValues: { moisture: 10, formationTime: 8000 },
    },
    {
      id: "prairie",
      label: "Prairie Mollisol",
      description:
        "A grassland setting where deep roots and moderate moisture help build a thick, dark, organic-rich A horizon over thousands of years.",
      paramValues: { moisture: 50, formationTime: 3000 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Soil formation — called pedogenesis — is the slow process by which solid rock and loose sediment are transformed into the layered, living material we call soil. It is one of Earth's most important slow-motion processes, and it takes a very long time: roughly 500 years to build just 2 centimeters of topsoil. The simulation shows a cross-section of the ground revealing distinct soil layers called horizons. Scientists use five factors to explain why soils look and behave differently around the world: the type of parent material (the original rock or sediment), climate (especially temperature and rainfall), organisms (from earthworms to bacteria to plant roots), topography (slope and position on the landscape), and time. Adjust the controls to watch how each factor shapes the thickness, color, and composition of each horizon over thousands of years.",
    parameterExplanations: {
      moisture:
        "Moisture represents how much water is available in the soil-forming environment. Water is a major link between the hydrosphere, geosphere, and biosphere: it helps minerals dissolve and re-form, moves dissolved ions downward, supports plants and microbes, and can also transport fine particles through the profile. Low moisture resembles arid settings where soil develops slowly and salts or carbonates may accumulate. Higher moisture supports stronger leaching and more organic input, but very wet settings can also remove nutrients quickly. Comparing the Desert Aridisol, Prairie Mollisol, and Temperate Forest presets helps students connect observed horizon differences to Earth-system interactions in MS-ESS2 and HS-ESS2 models.",
      formationTime:
        "Formation Time controls how long the profile has been developing, measured in years. Soil is not produced instantly: horizons emerge as rock fragments break down, organic matter is added near the surface, and minerals are moved or concentrated over repeated wetting, drying, freezing, thawing, root growth, and decomposition cycles. Early profiles may show only a thin A horizon over parent material, while older profiles can develop clearer O, A, B, C, and R layers. The relationship is not linear because deeper material is less exposed to surface energy and living roots. This makes formation time useful evidence for explaining slow geoscience processes across different spatial and temporal scales.",
    },
    misconceptions: [
      {
        wrong: "Soil is just dirt — it is not alive.",
        correct:
          "Healthy soil is one of the most densely populated living environments on Earth. A single teaspoon of topsoil can contain billions of bacteria, millions of fungi, and thousands of tiny invertebrates. This living community breaks down dead organic matter, recycles nutrients, and builds the humus that gives fertile soil its dark color and spongy texture. Use the Temperate Forest and Prairie Mollisol presets to connect living matter with darker, richer surface layers.",
      },
      {
        wrong: "Soil forms quickly and can easily be replaced if it erodes.",
        correct:
          "Forming 2 centimeters of topsoil typically takes around 500 years. Modern farming can erode that same layer in just a few decades. Because soil forms so slowly compared to human timescales, it is considered a non-renewable resource — once eroded or paved over, it is effectively gone for human purposes. Move the Formation Time slider from hundreds to thousands of years to see why mature profiles require long intervals.",
      },
      {
        wrong: "Wetter soil always means better soil.",
        correct:
          "Moisture is important, but more is not automatically better. Water helps chemical reactions, supports organisms, and moves materials through the profile, but excessive water can carry nutrients away or produce oxygen-poor conditions. Dry settings can preserve minerals but often develop thinner organic layers. The most fertile soils often form where moisture, vegetation, parent material, and landscape position stay in balance over long periods.",
      },
      {
        wrong: "All soil horizons are present everywhere on Earth.",
        correct:
          "Soil horizon development depends on the five forming factors. Desert soils may lack a distinct O horizon entirely. Very young soils on steep slopes may show only a thin A horizon over bedrock. Warm, wet soils can have very deep B horizons but thin A horizons. The simulation lets you use the Moisture slider, Formation Time slider, and presets to explore how different settings produce different profiles.",
      },
    ],
    teacherUseCases: [
      "Preset comparison for MS-ESS2-2: have students run Temperate Forest, Desert Aridisol, and Prairie Mollisol, record Moisture and Formation Time values, then write a claim explaining how each setting changes horizon thickness and color.",
      "Time as a variable: hold Moisture at 50% and pause at 100 years, 1000 years, 5000 years, and 10000 years. Students sketch each profile, measure horizon thickness, and describe why soil development slows as the profile matures.",
      "Water availability investigation: keep Formation Time at 5000 years while moving Moisture from 0% to 100%. Students record changes in organic surface material, leaching, and horizon contrast, then connect the observations to interactions among Earth systems.",
      "Non-renewable resource argument: use the Prairie Mollisol preset to build a mature profile, then ask students how long it would take to lose the A horizon if erosion removed 1 cm per year. Students compare that loss to natural soil-building timescales, supporting MS-ESS3-4.",
      "CER preset activity: assign each group one preset and ask them to cite the two slider values as evidence for whether the profile best represents a forest, desert, or grassland soil-forming environment.",
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
          "Early in pedogenesis, fresh rock near the surface changes relatively quickly because it is exposed to water, temperature changes, roots, and decomposers. As the soil deepens, the active front moves farther from the surface where most energy and living systems are concentrated. Chemical reactions also slow as the most reactive minerals are used up. The result is that soil depth increases quickly at first and then slows — a pattern that resembles a square-root curve in this simulation.",
      },
      {
        question: "How should I use the Temperate Forest, Desert Aridisol, and Prairie Mollisol presets?",
        answer:
          "Use the presets as three anchor cases before changing sliders one at a time. Temperate Forest sets high Moisture and long Formation Time to model a layered profile with organic surface material. Desert Aridisol sets very low Moisture and long Formation Time to show how dry settings can develop slowly and concentrate minerals. Prairie Mollisol uses moderate Moisture and several thousand years to represent grassland soil with a dark, organic-rich A horizon. After selecting each preset, change only one slider to identify which variable caused the observed change.",
      },
      {
        question: "Can soil form on other planets?",
        answer:
          "Mars has a layer of loose, weathered rock material called regolith that superficially resembles early-stage soil, but it lacks organic matter and living organisms, which are essential for developing true soil horizons. Scientists studying Mars regolith and Earth soil formation together gain insight into what conditions are needed for soil — and potentially life — to develop on a planetary surface.",
      },
    ],
  },
};
