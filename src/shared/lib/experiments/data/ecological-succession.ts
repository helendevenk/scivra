import type { Experiment } from "@/shared/types/experiment";

export const ecologicalSuccession: Experiment = {
  id: "ecological-succession",
  slug: "ecological-succession",
  title: "Ecological Succession",
  subtitle:
    "Primary and secondary succession: from bare rock to climax community",
  description:
    "Visualize how ecosystems develop over time through ecological succession. Watch pioneer species colonize bare rock (primary) or disturbed land (secondary), followed by intermediate species and eventually a stable climax community. Control disturbance events and observe how biodiversity, biomass, and soil depth change at each stage.",
  thumbnail: "/imgs/experiments/ecological-succession.png",

  standards: {
    ngss: ["HS-LS2-6"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: [
    "ecological succession",
    "primary succession",
    "secondary succession",
    "climax community",
    "pioneer species",
    "biodiversity",
    "AP Biology",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "timeSpeed",
      label: "Time Speed",
      unit: "yr/tick",
      min: 1,
      max: 100,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "disturbance",
      label: "Disturbance",
      unit: "%",
      min: 0,
      max: 100,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "rainfall",
      label: "Rainfall",
      unit: "level",
      min: 0,
      max: 2,
      default: 1,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "S = S_{\\max}(1 - e^{-kt})",
      description:
        "Species richness approaches maximum as a saturating function of time",
    },
    {
      latex: "B(t) = B_{\\max} \\cdot \\frac{t^2}{t^2 + K^2}",
      description:
        "Biomass accumulation follows a sigmoidal curve with half-saturation constant K",
    },
  ],

  theory:
    "Ecological succession is the process by which the species structure of an ecological community changes over time. Primary succession occurs on newly exposed surfaces (lava flows, glacial retreat) with no prior soil. Lichens and mosses (pioneer species) break down rock, creating thin soil. Grasses and small herbs follow, then shrubs, and eventually trees form a climax community. Secondary succession occurs on disturbed land that retains soil (after fire, logging, farming). It proceeds faster because soil nutrients and seed banks remain. Key metrics change predictably: species richness increases, biomass accumulates, nutrient cycling intensifies, and food web complexity grows. Disturbance events (fire, storm, disease) can reset succession partially or fully, creating a mosaic of successional stages across a landscape.",

  instructions:
    "Use the three sliders to adjust Time Speed, Disturbance, and Rainfall, then press Play to watch the landscape move through bare ground, pioneer species, intermediate communities, and climax conditions. Try the three presets — Primary (bare rock), Secondary (after fire), and Rainforest Dev. — to compare how starting conditions and climate context change the pace and outcome of succession.",

  challenges: [
    {
      id: "suc-c1",
      question:
        "Why does secondary succession reach climax faster than primary succession?",
      hint: "Secondary succession starts with existing soil, seed banks, and root systems, skipping the slow rock-to-soil phase.",
      tier: "free",
    },
    {
      id: "suc-c2",
      question: "What role do pioneer species play in primary succession?",
      hint: "Lichens and mosses physically and chemically weather rock, creating the first soil layer and enabling later species to establish.",
      tier: "free",
    },
    {
      id: "suc-c3",
      question:
        "How does intermediate disturbance frequency maximize biodiversity?",
      hint: "The intermediate disturbance hypothesis: too little disturbance → competitive exclusion; too much → only pioneers survive; intermediate levels maintain a mix of successional stages.",
      tier: "pro",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["population-dynamics", "natural-selection"],
  htmlPath: "/experiments/ap-biology/ecological-succession.html",

  seoTitle: "Ecological Succession Simulator | Scivra AP Biology",
  seoKeywords: [
    "ecological succession simulation",
    "primary secondary succession",
    "climax community interactive",
    "pioneer species virtual lab",
    "AP Biology succession",
    "biodiversity over time",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Ecological Succession and Community Development",
  },
  htmlControlAliases: {
    timeSpeed: "sl-tspeed",
    disturbance: "sl-disturb",
    rainfall: "sl-rain",
  },
  presets: [
    {
      id: "primary",
      label: "Primary (bare rock)",
      description:
        "Start from bare rock with pioneer colonizers and slow soil formation.",
      paramValues: { timeSpeed: 10, disturbance: 0, rainfall: 1 },
    },
    {
      id: "secondary",
      label: "Secondary (after fire)",
      description:
        "Start after a disturbance where soil and biological legacies remain.",
      paramValues: { timeSpeed: 20, disturbance: 20, rainfall: 1 },
    },
    {
      id: "rainforest",
      label: "Rainforest Dev.",
      description:
        "Explore rapid biomass accumulation under high-rainfall conditions.",
      paramValues: { timeSpeed: 15, disturbance: 5, rainfall: 2 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Ecological succession is the predictable sequence of species replacements that transforms bare ground into a complex, layered community over decades to centuries. Primary succession starts from scratch on surfaces with no soil — fresh lava flows in Hawaii, land exposed by retreating glaciers — where lichens and mosses are the pioneers that chemically and physically weather rock into the first mineral soil. Secondary succession begins on land that already has soil and a seed bank after a disturbance such as fire, clear-cutting, or crop abandonment; it reaches a mature forest in decades rather than centuries. Both sequences increase species richness, biomass, and soil depth in roughly predictable stages. The simulation compresses these pathways into minutes, letting you adjust time speed, rainfall, and disturbance while using presets to compare common ecological scenarios.",
    parameterExplanations: {
      timeSpeed:
        "Time Speed controls how many ecological years pass during each simulation tick. In NGSS MS-LS2 and HS-LS2 terms, it helps students separate short-term observation from long-term ecosystem change. A slow setting makes stage transitions easier to analyze: pioneer colonization, soil building, biomass accumulation, and later competitive replacement. A faster setting supports repeated trials, which is useful when students compare primary, secondary, and rainforest preset outcomes. Changing Time Speed should not be interpreted as making succession biologically faster in the real world; it changes the observation scale so students can collect data across decades or centuries within a classroom period.",
      disturbance:
        "Disturbance sets the chance that events such as fire, storms, disease, or severe drought interrupt the current successional pathway. This aligns with MS-LS2 and HS-LS2 ecosystem stability ideas: ecosystems are dynamic, and community structure depends on both biotic interactions and abiotic disruptions. Low disturbance lets competitive late-successional species dominate. Moderate disturbance can maintain patches at different stages, supporting discussion of biodiversity and the intermediate disturbance hypothesis. Very high disturbance can prevent mature communities from forming because pioneer or early-stage species are repeatedly favored. Students should use this slider to connect cause-and-effect reasoning with observed changes in species richness, biomass, and recovery.",
      rainfall:
        "Rainfall represents broad precipitation conditions: dry, normal, or high. It connects succession to NGSS LS2 themes because water availability shapes productivity, decomposition, soil development, and which populations can persist. Dry conditions tend to slow biomass accumulation and may favor grasses, shrubs, or drought-tolerant pioneers. Normal rainfall supports a more temperate pathway, while high rainfall can accelerate plant growth and nutrient cycling, especially in rainforest-like development. Students can compare presets or hold Time Speed and Disturbance constant while changing Rainfall to ask how abiotic factors influence community composition, ecosystem carrying capacity, and the stability of food webs over time.",
    },
    misconceptions: [
      {
        wrong:
          "The climax community is the ecosystem's final, perfect endpoint — once reached, it stays stable forever unless humans disturb it.",
        correct:
          "Climax communities are not static endpoints. Fire, windthrow, disease, drought, and climate shifts continuously disturb them, resetting patches to earlier successional stages. Ecologists now describe many mature ecosystems as shifting-mosaic steady states: the overall composition may be roughly stable, but individual patches are often at different successional stages. The Disturbance slider demonstrates this directly by adding natural setbacks that change community structure over time.",
      },
      {
        wrong:
          "Pioneer species are weak because they disappear early in succession — they lose competition to stronger species.",
        correct:
          "Pioneer species such as lichens and mosses are highly specialized for harsh conditions — desiccation, bare rock, full sun, minimal nutrients. They don't lose a competition; they engineer the environment (adding organic matter and soil) that makes it suitable for species that then outcompete them. This is facilitation, a key mechanism of succession alongside tolerance and inhibition.",
      },
      {
        wrong:
          "Secondary succession always produces exactly the same climax community as the pre-disturbance ecosystem.",
        correct:
          "Secondary succession tends toward a community similar to the original, but the outcome depends on which species colonize first, soil legacy effects, regional species pool, rainfall, and climate. After severe disturbances like intense fire or invasive species pressure, the trajectory can diverge significantly — this is called alternative stable states, and it is an active research area in community ecology.",
      },
      {
        wrong:
          "Biodiversity is highest in the climax community because more species have had time to arrive.",
        correct:
          "The intermediate disturbance hypothesis predicts that biodiversity often peaks at moderate disturbance levels, not necessarily at the undisturbed climax. At climax, competitive dominants can exclude early-successional species; at high disturbance frequency, only pioneers persist. Moderate disturbance maintains a patchwork of stages with the highest total species richness. Use the Disturbance slider to test whether species richness forms a hump-shaped pattern across repeated trials.",
      },
      {
        wrong:
          "Primary and secondary succession are basically the same process — the only difference is how long they take.",
        correct:
          "The mechanisms differ fundamentally. Primary succession must build soil from scratch through biological weathering by lichens and physical weathering by freeze-thaw cycles; this soil-building phase has no analog in secondary succession. Secondary succession can also draw on dormant seed banks and surviving root systems, giving it entirely different early dynamics despite a similar eventual endpoint. Compare the Primary (bare rock) and Secondary (after fire) presets to see those different starting conditions.",
      },
    ],
    teacherUseCases: [
      "Preset comparison: run Primary (bare rock) and Secondary (after fire), record Time Speed, Disturbance, and Rainfall settings, then compare how long each pathway takes to cross the same biomass threshold. Students connect recovery rate to soil presence and biological legacies — addresses NGSS HS-LS2-6.",
      "Disturbance experiment — intermediate disturbance hypothesis: hold Time Speed and Rainfall constant, run five trials at Disturbance = 0%, 20%, 40%, 60%, and 80%, recording peak species count in each run. Students graph disturbance level vs. species richness and identify whether biodiversity peaks at an intermediate value.",
      "Rainfall gradient field study design: set Disturbance = 0%, compare Rainfall levels 0, 1, and 2, and record the final dominant vegetation type. Students produce a precipitation-community table and discuss how the same successional process produces different mature communities — preparation for AP Bio Big Idea 4 ecosystem analysis.",
      "Misconception probe — climax stability: use the Primary (bare rock) preset, run toward climax with Disturbance = 0%, then ask students \"will this stay this way forever?\" After discussion, increase Disturbance and observe how community composition fluctuates — use the observation to introduce shifting-mosaic steady state as the current ecological model.",
      "Data collection — soil depth and biomass tracking: set Time Speed low enough for students to pause at regular intervals during the Primary (bare rock) preset, then record soil depth, biomass, and species count. Students plot all three over time, identify which variable responds first, and write a mechanistic explanation connecting soil depth to biomass accumulation — aligns with AP Bio standard 8.A.1.",
    ],
    faq: [
      {
        question: "What is the difference between primary and secondary succession?",
        answer:
          "Primary succession begins on surfaces with no soil or seed bank, such as bare volcanic rock or freshly deglaciated terrain. Lichens and mosses colonize first, weathering rock into thin mineral soil over decades. Secondary succession begins on disturbed land that retains soil and a dormant seed bank, allowing faster-growing plants to establish immediately. A primary succession sequence to mature forest can take 500–1000 years; secondary succession on an abandoned farm field can reach forest in 50–150 years depending on climate and species pool. Use the Primary (bare rock) and Secondary (after fire) presets to compare the pathways.",
      },
      {
        question: "Why do lichens colonize bare rock first in primary succession?",
        answer:
          "Lichens are symbioses between fungi and photosynthetic algae or cyanobacteria. The fungal partner provides physical attachment and water retention; the photosynthetic partner fixes carbon. Together they tolerate desiccation, UV exposure, and nutrient poverty that no rooted plant can survive. Lichen acids chemically etch rock minerals, releasing calcium and phosphorus; repeated freeze-thaw cycles physically fragment the rock surface. Over decades this produces a thin mineral soil that bryophytes (mosses) can then colonize.",
      },
      {
        question: "How does AP Biology standard 8.A.1 apply to ecological succession?",
        answer:
          "AP Bio standard 8.A.1 (Big Idea 4, Systems Interactions) addresses how interactions within and among ecosystems affect their structure and function. Succession is a systems-level process: each successional stage changes abiotic conditions (soil depth, nutrient availability, light penetration) that alter which species can persist, creating feedback loops that drive the community forward. The simulation tracks biomass, species richness, and soil depth simultaneously, making these interdependencies visible.",
      },
      {
        question: "Is the climax community the same everywhere?",
        answer:
          "No — climax communities vary with regional climate, parent rock type, rainfall, and colonization history. A wet temperate climate may produce deciduous or mixed forest; the same successional process in a semiarid region may end in grassland or savanna; in boreal conditions it may end in conifer forest. This is why the Rainfall slider changes the endpoint: the mechanism of succession is broadly shared, but the output depends on abiotic context.",
      },
      {
        question: "What is the intermediate disturbance hypothesis?",
        answer:
          "Proposed by Joseph Connell in 1978, the intermediate disturbance hypothesis states that species diversity is highest at intermediate levels of disturbance frequency and intensity. At low disturbance, competitive dominants exclude early-successional species. At high disturbance, only stress-tolerant pioneers survive. Moderate disturbance maintains a mosaic of early, mid, and late successional patches, maximizing total species richness across the landscape. Run the Disturbance slider from low to high values to observe this pattern in the simulation.",
      },
      {
        question: "Can succession be reversed or permanently altered?",
        answer:
          "Yes, on two timescales. Short-term reversal happens whenever disturbance resets a patch to an earlier stage — the system then resumes succession from that point. Permanent alteration, called arrested succession or alternative stable states, can occur when an invasive species, severe soil degradation, altered rainfall regime, or persistent grazing prevents progression past a particular stage. Hawaiian volcanic fields invaded by nitrogen-fixing fire tree (Morella faya) before soil nitrogen builds naturally are a documented example — the invader accelerates succession past the normal early-stage bottleneck.",
      },
    ],
  },
};
