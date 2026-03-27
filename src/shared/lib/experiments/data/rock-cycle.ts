import type { Experiment } from "@/shared/types/experiment";

export const rockCycle: Experiment = {
  id: "rock-cycle",
  slug: "rock-cycle",
  title: "Rock Cycle",
  subtitle: "Three rock types and the geological processes that transform them",
  description:
    "Explore the rock cycle through an interactive 3D geological cross-section. Drag rock samples through melting, cooling, weathering, erosion, compaction, and metamorphism to trace how igneous, sedimentary, and metamorphic rocks transform into one another. Adjust temperature, pressure, and time to observe the conditions driving each transition.",
  thumbnail: "/imgs/experiments/rock-cycle.png",

  standards: {
    ngss: ["HS-ESS2-1", "MS-ESS2-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "AP",
  tags: [
    "rock cycle",
    "igneous rock",
    "sedimentary rock",
    "metamorphic rock",
    "geology",
    "weathering",
    "metamorphism",
    "Earth Science",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "temperature",
      label: "Temperature",
      unit: "°C",
      min: 0,
      max: 1400,
      default: 200,
      step: 50,
      tier: "free",
    },
    {
      id: "pressure",
      label: "Pressure",
      unit: "GPa",
      min: 0,
      max: 4,
      default: 0.5,
      step: 0.1,
      tier: "free",
    },
    {
      id: "timescale",
      label: "Time Scale",
      unit: "My",
      min: 1,
      max: 500,
      default: 50,
      step: 10,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\text{Igneous} \\xrightarrow{\\text{weathering}} \\text{Sediment} \\xrightarrow{\\text{compaction}} \\text{Sedimentary}",
      description:
        "Igneous rock breaks down through weathering and erosion into sediment, which compacts and cements into sedimentary rock over millions of years.",
    },
    {
      latex: "\\text{Any Rock} \\xrightarrow{T > 200°C,\\, P > 0.3\\,\\text{GPa}} \\text{Metamorphic}",
      description:
        "Heat and pressure transform any existing rock into metamorphic rock without melting. Higher T and P produce higher-grade metamorphism.",
    },
    {
      latex: "\\text{Any Rock} \\xrightarrow{T > 700\\text{–}1200°C} \\text{Magma} \\xrightarrow{\\text{cooling}} \\text{Igneous}",
      description:
        "Sufficient heat melts rock into magma. Slow cooling underground forms intrusive igneous rock (granite); rapid surface cooling forms extrusive rock (basalt).",
    },
  ],

  theory:
    "The rock cycle describes the continuous transformation of rocks among three types. Igneous rocks form when magma or lava cools and crystallizes — slow cooling underground (intrusive) produces coarse-grained granite, while rapid surface cooling (extrusive) produces fine-grained basalt. Sedimentary rocks form when weathering breaks existing rock into fragments that are transported, deposited, compacted, and cemented — examples include sandstone, limestone, and shale. Metamorphic rocks form when existing rocks are subjected to elevated temperature (>200°C) and/or pressure (>0.3 GPa) without melting — slate from shale, marble from limestone, gneiss from granite. Any rock type can become any other: igneous can weather into sedimentary, be metamorphosed, or re-melt. The cycle is driven by Earth's internal heat (mantle convection, radioactive decay) and external energy (solar-driven weathering). Plate tectonics is the engine: subduction carries rocks to depth (metamorphism, melting), while uplift and volcanism bring material back to the surface.",

  instructions:
    "Click on a rock type node (Igneous, Sedimentary, or Metamorphic) to select it, then click a process arrow to trigger the transformation. Adjust temperature, pressure, and time scale to see how conditions affect which transformations are possible. The 3D cross-section shows where each process occurs in Earth's crust and mantle.",

  challenges: [
    {
      id: "rc-c1",
      question: "What conditions cause metamorphic rock to form instead of melting into magma?",
      hint: "Metamorphism occurs at elevated T (200–700°C) and P (>0.3 GPa) but below the melting point. If temperature exceeds ~700–1200°C (depending on composition), the rock melts into magma instead.",
      tier: "free",
    },
    {
      id: "rc-c2",
      question: "Why are sedimentary rocks rarely found deep in Earth's crust?",
      hint: "At depth, temperature and pressure increase. Sedimentary rocks subjected to these conditions undergo metamorphism, transforming into metamorphic rocks. Only near the surface are conditions mild enough for sedimentary rocks to remain stable.",
      tier: "free",
    },
    {
      id: "rc-c3",
      question: "How does plate tectonics drive the rock cycle?",
      hint: "Subduction zones carry surface rock to depth (metamorphism → melting). Mid-ocean ridges produce new igneous rock from magma. Uplift exposes deep rock to weathering. Without plate tectonics, the cycle would slow dramatically.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 30,
  relatedExperiments: ["seismic-waves", "plate-tectonics-advanced"],
  htmlPath: "/experiments/earth-science/rock-cycle.html",

  seoTitle: "Rock Cycle Interactive 3D Simulation | Scivra Earth Science",
  seoKeywords: [
    "rock cycle simulation",
    "igneous sedimentary metamorphic",
    "geology interactive",
    "rock transformation",
    "Earth science virtual lab",
    "NGSS ESS2",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Rock Cycle and Geological Processes",
  },
};
