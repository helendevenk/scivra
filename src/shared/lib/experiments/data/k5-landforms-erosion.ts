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
    { id: "erosionType", label: "Erosion Agent (0=Water 1=Wind 2=Glacial Ice)", unit: "", min: 0, max: 2, default: 0, step: 1, tier: "free" },
    { id: "timeScale", label: "Time Scale (years)", unit: "years", min: 100, max: 10000, default: 1000, step: 100, tier: "free" },
  ],

  formulas: [
    { latex: "E = k \\cdot F \\cdot t", description: "Erosion (E) depends on the force of the agent (F), time (t), and the rock's resistance (k)" },
  ],

  theory: "Erosion is the process that breaks down and moves rock and soil from one place to another. Water erosion is the most powerful — rivers carve valleys, and ocean waves reshape coastlines. Wind erosion is strongest in dry areas with loose soil, creating sand dunes and wearing down rock faces. Glacial erosion happens when massive ice sheets slowly grind across the land, scooping out U-shaped valleys and leaving behind boulders. Weathering (breaking rock apart) works together with erosion (carrying pieces away). Over thousands of years these forces create landforms like canyons, mesas, deltas, and beaches.",

  instructions: "Select an erosion agent and set the time scale, then press Play! The landscape will change before your eyes as erosion reshapes it. Drag the time slider to speed up or slow down. Compare how water, wind, and ice each leave different marks on the land.",

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
};
