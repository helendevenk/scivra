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
};
