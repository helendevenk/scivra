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
    ngss: ["HS-LS2-6", "HS-LS4-5"],
    gcse: [],
    ap: ["8.A.1"],
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
      id: "successionType",
      label: "Type (0=Primary, 1=Secondary)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "timeScale",
      label: "Time Scale",
      unit: "years/s",
      min: 1,
      max: 50,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "moistureLevel",
      label: "Moisture Level",
      unit: "%",
      min: 10,
      max: 100,
      default: 60,
      step: 10,
      tier: "free",
    },
    {
      id: "disturbanceProb",
      label: "Disturbance Probability",
      unit: "%",
      min: 0,
      max: 50,
      default: 5,
      step: 5,
      tier: "pro",
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
    "Choose primary or secondary succession and press Play. Watch the landscape evolve through stages: bare rock/soil → pioneers → intermediate → climax. The timeline shows current stage, species count, biomass, and soil depth. Adjust time scale to speed up the process. Use the disturbance slider to introduce random setbacks.",

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
      question:
        "What role do pioneer species play in primary succession?",
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
  contentSections: {
    whatIsIt:
      "Ecological succession is the predictable sequence of species replacements that transforms bare ground into a complex, layered community over decades to centuries. Primary succession starts from scratch on surfaces with no soil — fresh lava flows in Hawaii, land exposed by retreating glaciers — where lichens and mosses are the pioneers that chemically and physically weather rock into the first mineral soil. Secondary succession begins on land that already has soil and a seed bank after a disturbance such as fire, clear-cutting, or crop abandonment; it reaches a mature forest in decades rather than centuries. Both sequences increase species richness, biomass, and soil depth in roughly predictable stages. The simulation compresses either pathway into minutes, letting you control moisture, succession type, and the probability of disturbance events that reset part of the landscape mid-sequence.",
    parameterExplanations: {
      successionType:
        "Switches between primary succession (0) — starting from bare rock with zero soil, where lichens are the first colonizers — and secondary succession (1) — starting from bare mineral soil with an intact seed bank after a disturbance. Secondary succession skips the slow rock-weathering phase, so it reaches the same climax community roughly 5 to 10 times faster. The simulation visually marks the starting soil depth and initial species count for each type.",
      timeScale:
        "Controls simulation speed in years per second, from 1 to 50 years/s. At the default of 10 years/s, a 300-year primary succession sequence completes in 30 simulation seconds. Slowing to 1 year/s lets you observe individual stage transitions in detail; speeding to 50 years/s lets you run many disturbance events quickly to see the long-run community mosaic.",
      moistureLevel:
        "Sets environmental moisture as a percentage, 10–100%. Low moisture (10–30%) steers the simulation toward arid successional pathways ending in scrubland or savanna; high moisture (70–100%) produces faster biomass accumulation and a forest climax. Moisture affects which pioneer and intermediate species appear and how quickly soil organic matter builds — in wet conditions, bryophyte mats form faster and accelerate early succession.",
      disturbanceProb:
        "The per-time-step probability that a disturbance event (fire, storm, pathogen outbreak) resets the current stage back by one or two steps, in percent. At 0% succession runs undisturbed to climax. At 20–30%, the landscape rarely reaches climax and instead cycles among intermediate stages, demonstrating that real ecosystems are dynamic mosaics rather than one-way progressions toward a final state.",
    },
    misconceptions: [
      {
        wrong:
          "The climax community is the ecosystem's final, perfect endpoint — once reached, it stays stable forever unless humans disturb it.",
        correct:
          "Climax communities are not static endpoints. Fire, windthrow, disease, and climate shifts continuously disturb them, resetting patches to earlier successional stages. Ecologists now describe mature ecosystems as shifting-mosaic steady states: the overall composition is roughly stable, but individual patches are always at different successional stages. The disturbanceProb slider in the simulation demonstrates this directly.",
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
          "Secondary succession tends toward a community similar to the original, but the outcome depends on which species colonize first, soil legacy effects, regional species pool, and climate. After severe disturbances like intense fire or invasive species pressure, the trajectory can diverge significantly — this is called alternative stable states, and it is an active research area in community ecology.",
      },
      {
        wrong:
          "Biodiversity is highest in the climax community because more species have had time to arrive.",
        correct:
          "The intermediate disturbance hypothesis predicts that biodiversity peaks at moderate disturbance levels, not at the undisturbed climax. At climax, competitive dominants often exclude early-successional species; at high disturbance frequency, only pioneers persist. Moderate disturbance maintains a patchwork of stages with the highest total species richness — the disturbanceProb slider can demonstrate this U-shaped pattern.",
      },
      {
        wrong:
          "Primary and secondary succession are basically the same process — the only difference is how long they take.",
        correct:
          "The mechanisms differ fundamentally. Primary succession must build soil from scratch through biological weathering by lichens and physical weathering by freeze-thaw cycles; this soil-building phase has no analog in secondary succession. Secondary succession can also draw on dormant seed banks and surviving root systems, giving it entirely different early dynamics despite a similar eventual endpoint.",
      },
    ],
    teacherUseCases: [
      "Side-by-side comparison: run primary and secondary succession simultaneously at timeScale = 10 and moistureLevel = 60, recording the time (in simulation years) each type takes to cross the same biomass threshold. Students calculate the ratio and connect it to the presence or absence of pioneer soil-building — addresses NGSS HS-LS2-6.",
      "Disturbance experiment — intermediate disturbance hypothesis: hold successionType and moistureLevel constant, run five trials at disturbanceProb = 0%, 10%, 20%, 30%, and 50%, recording peak species count in each run. Students graph disturbanceProb vs. species richness and identify the peak, testing the intermediate disturbance hypothesis quantitatively.",
      "Moisture gradient field study design: vary moistureLevel from 10 to 100 in steps of 20, run each to climax (disturbanceProb = 0%), and record the final dominant vegetation type. Students produce a moisture-community table and discuss how the same successional process produces different climax communities — preparation for AP Bio Big Idea 4 ecosystem analysis.",
      "Misconception probe — climax stability: set disturbanceProb = 0%, run to climax, then ask students \"will this stay this way forever?\" After discussion, increase disturbanceProb to 15% and observe how the community composition fluctuates — use the observation to introduce shifting-mosaic steady state as the current ecological model.",
      "Data collection — soil depth and biomass tracking: pause the simulation every 50 simulation years during primary succession and record soil depth, biomass, and species count. Students plot all three over time, identify which variable responds first, and write a mechanistic explanation connecting soil depth to biomass accumulation — aligns with AP Bio standard 8.A.1.",
    ],
    faq: [
      {
        question: "What is the difference between primary and secondary succession?",
        answer:
          "Primary succession begins on surfaces with no soil or seed bank, such as bare volcanic rock or freshly deglaciated terrain. Lichens and mosses colonize first, weathering rock into thin mineral soil over decades. Secondary succession begins on disturbed land that retains soil and a dormant seed bank, allowing faster-growing plants to establish immediately. A primary succession sequence to mature forest can take 500–1000 years; secondary succession on an abandoned farm field can reach forest in 50–150 years depending on climate and species pool.",
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
          "No — climax communities vary with regional climate, parent rock type, and colonization history. A temperate moist climate produces deciduous or mixed forest; the same successional process in a semiarid region ends in grassland or savanna; in boreal conditions it ends in conifer forest. This is why the moistureLevel parameter in the simulation changes the endpoint: the mechanism of succession is universal but the output depends on the abiotic context.",
      },
      {
        question: "What is the intermediate disturbance hypothesis?",
        answer:
          "Proposed by Joseph Connell in 1978, the intermediate disturbance hypothesis states that species diversity is highest at intermediate levels of disturbance frequency and intensity. At low disturbance, competitive dominants exclude early-successional species. At high disturbance, only stress-tolerant pioneers survive. Moderate disturbance maintains a mosaic of early, mid, and late successional patches, maximizing total species richness across the landscape. Run the disturbanceProb slider from 0 to 50% to observe this pattern in the simulation.",
      },
      {
        question: "Can succession be reversed or permanently altered?",
        answer:
          "Yes, on two timescales. Short-term reversal happens whenever disturbance resets a patch to an earlier stage — the system then resumes succession from that point. Permanent alteration, called arrested succession or alternative stable states, can occur when an invasive species, severe soil degradation, or persistent grazing prevents progression past a particular stage. Hawaiian volcanic fields invaded by nitrogen-fixing fire tree (Morella faya) before soil nitrogen builds naturally are a documented example — the invader accelerates succession past the normal early-stage bottleneck.",
      },
    ],
  },
};
