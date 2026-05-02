import type { Experiment } from "@/shared/types/experiment";

export const rockCycle: Experiment = {
  id: "rock-cycle",
  slug: "rock-cycle",
  title: "Rock Cycle",
  subtitle: "Three rock types and the geological processes that transform them",
  description:
    "Explore the rock cycle through an interactive 3D geological cross-section. Drag rock samples through melting, cooling, weathering, erosion, compaction, and metamorphism to trace how igneous, sedimentary, and metamorphic rocks transform into one another. Adjust temperature and burial depth to observe the conditions driving each transition.",
  thumbnail: "/imgs/experiments/rock-cycle.png",

  standards: {
    ngss: ["HS-ESS2-1", "MS-ESS2-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "9-12",
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
      max: 1500,
      default: 1200,
      step: 50,
      tier: "free",
    },
    {
      id: "depth",
      label: "Burial Depth",
      unit: "km",
      min: 0,
      max: 50,
      default: 0,
      step: 1,
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
      latex: "\\text{Any Rock} \\xrightarrow{T > 200°C,\\, \\text{depth} > 10\\,\\text{km}} \\text{Metamorphic}",
      description:
        "Heat and burial pressure transform any existing rock into metamorphic rock without melting. Higher T and deeper burial produce higher-grade metamorphism.",
    },
    {
      latex: "\\text{Any Rock} \\xrightarrow{T > 700\\text{–}1200°C} \\text{Magma} \\xrightarrow{\\text{cooling}} \\text{Igneous}",
      description:
        "Sufficient heat melts rock into magma. Slow cooling underground forms intrusive igneous rock (granite); rapid surface cooling forms extrusive rock (basalt).",
    },
  ],

  theory:
    "The rock cycle describes the continuous transformation of rocks among three types. Igneous rocks form when magma or lava cools and crystallizes — slow cooling underground (intrusive) produces coarse-grained granite, while rapid surface cooling (extrusive) produces fine-grained basalt. Sedimentary rocks form when weathering breaks existing rock into fragments that are transported, deposited, compacted, and cemented — examples include sandstone, limestone, and shale. Metamorphic rocks form when existing rocks are subjected to elevated temperature (>200°C) and burial pressure (>~10 km depth) without melting — slate from shale, marble from limestone, gneiss from granite. Any rock type can become any other: igneous can weather into sedimentary, be metamorphosed, or re-melt. The cycle is driven by Earth's internal heat (mantle convection, radioactive decay) and external energy (solar-driven weathering). Plate tectonics is the engine: subduction carries rocks to depth (metamorphism, melting), while uplift and volcanism bring material back to the surface.",

  instructions:
    "Use the Temperature slider (0–1500 °C) and the Burial Depth slider (0–50 km) to set the geological conditions, then click one of the three rock-type focus presets — Igneous Formation, Sedimentary Layers, or Metamorphic Zone — to highlight that part of the cross-section and see the transformations happening under those conditions.",

  challenges: [
    {
      id: "rc-c1",
      question: "What conditions cause metamorphic rock to form instead of melting into magma?",
      hint: "Metamorphism occurs at elevated T (200–700°C) and burial depth (>10 km, equivalent to >0.3 GPa pressure) but below the melting point. If temperature exceeds ~700–1200°C (depending on composition), the rock melts into magma instead.",
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
  htmlControlAliases: { temperature: "tempSlider", depth: "depthSlider" },
  presets: [
    {
      id: "igneous",
      label: "Igneous Formation",
      description:
        "Highlights the magma-cooling pathway: silica-rich magma crystallizes slowly underground into intrusive rocks like granite, while iron-rich lava cools quickly at the surface into extrusive rocks like basalt.",
    },
    {
      id: "sedimentary",
      label: "Sedimentary Layers",
      description:
        "Highlights weathering, transport, deposition, and lithification: surface rocks erode into sediment that accumulates in layers and is compacted and cemented into sandstone, shale, or limestone.",
    },
    {
      id: "metamorphic",
      label: "Metamorphic Zone",
      description:
        "Highlights heat-and-pressure transformation below the melting point: slate forms from shale, marble from limestone, and gneiss from granite as minerals recrystallize without the rock becoming liquid.",
    },
  ],
  contentSections: {
    whatIsIt:
      "The rock cycle describes how Earth's three main rock families — igneous, sedimentary, and metamorphic — continuously transform into one another through geological processes powered by Earth's internal heat and the Sun's energy at the surface. Igneous rocks crystallize from cooling magma; sedimentary rocks form from the compaction and cementation of eroded fragments; metamorphic rocks form when heat and burial pressure transform existing rock without melting it. Crucially, the cycle has no single fixed direction: any rock type can become any other through the right combination of temperature and depth. The simulation lets you set Temperature (0–1500 °C) and Burial Depth (0–50 km) and then focus on the Igneous, Sedimentary, or Metamorphic part of the cross-section to see which transformation pathway activates under each set of conditions.",
    parameterExplanations: {
      temperature:
        "Temperature in degrees Celsius, ranging from 0 to 1500 °C. Below ~200 °C most rocks remain stable. Between ~200 and ~700 °C, combined with deep burial, existing rocks recrystallize as metamorphic rocks without melting. Above ~700–1200 °C (the exact value depends on rock composition and water content) rocks begin to melt into magma, which can crystallize again into igneous rock when it cools. The default of 1200 °C sits inside the partial-melting range for many crustal rocks, useful for showing the metamorphic-to-igneous transition. Pair this slider with the Igneous Formation and Metamorphic Zone presets to compare endpoints.",
      depth:
        "Burial Depth in kilometers, ranging 0–50 km. At the surface (0 km), weathering and erosion dominate, breaking rocks into sediment. Around 10 km depth, the lithostatic pressure roughly reaches 0.3 GPa — a typical threshold for low-grade metamorphism when combined with elevated temperature. Below ~30 km the pressure can produce high-grade metamorphic minerals like garnet or kyanite. The slider helps connect the three-rock-type model to depth-driven mountain belt geology and subduction-zone settings, where buried rocks rise back to the surface through uplift and erosion.",
    },
    misconceptions: [
      {
        wrong:
          "The rock cycle always goes in order: igneous → sedimentary → metamorphic → back to magma.",
        correct:
          "There is no required sequence. Igneous rock can be weathered directly into sedimentary rock, subjected to heat and pressure to become metamorphic rock, or re-melted into magma — all without passing through the sedimentary stage. Similarly, sedimentary rock can be metamorphosed directly. The cycle has multiple parallel paths, and any rock can enter or exit at any point.",
      },
      {
        wrong:
          "Metamorphic rock has melted and re-solidified, like igneous rock.",
        correct:
          "Metamorphism happens below the melting point. Heat and pressure cause minerals to recrystallize in the solid state — atoms migrate and new mineral assemblages form, but the rock never becomes liquid. Once rock actually melts, it becomes magma, and the resulting solidified product is igneous, not metamorphic.",
      },
      {
        wrong:
          "Sedimentary rocks form quickly from mud and sand.",
        correct:
          "Loose sediment must be buried under additional sediment, compressed under its own weight (lithification), and cemented by minerals precipitating from groundwater. This typically takes tens of millions of years for deep burial to produce well-lithified rock — much longer than the surface processes that produce the sediment in the first place.",
      },
      {
        wrong:
          "Granite and basalt are the same because they are both igneous rocks.",
        correct:
          "Both are igneous, but form under very different conditions. Granite forms from slow cooling of magma deep underground (intrusive/plutonic), allowing large crystals to grow — you can see individual minerals with the naked eye. Basalt forms from rapid cooling of lava at the surface (extrusive/volcanic), producing very fine crystals or glass. Composition also differs: granite is silica-rich (continental); basalt is iron- and magnesium-rich (oceanic).",
      },
    ],
    teacherUseCases: [
      "Pathway mapping activity: assign pairs a starting rock type and a target rock type using the three focus presets. They must identify at least one parameter combination of Temperature and Burial Depth that achieves each transformation, supporting HS-ESS2-1 modeling of internal processes.",
      "Metamorphism threshold investigation: starting at Temperature 200 °C and Burial Depth 10 km, increase each parameter independently in steps while holding the other constant. Students identify the minimum Temperature-Depth combination that triggers metamorphism (use the Metamorphic Zone preset to highlight the affected region) and map a simplified phase boundary at HS algebra level.",
      "Igneous pathway exploration: select the Igneous Formation preset and sweep Temperature from 700 °C to 1500 °C while keeping Depth at 0 km versus 30 km. Students compare extrusive (surface, fast cooling, basalt) and intrusive (deep, slow cooling, granite) endpoints, connecting cooling rate to crystal size.",
      "Sedimentary surface focus: select the Sedimentary Layers preset and keep Temperature low (~50 °C) and Depth shallow (~3 km). Discuss how surface weathering, transport, and burial together produce sedimentary rock without high heat. Connect to MS-ESS2-1 surface-process reasoning.",
      "Subduction connection: at Temperature ~600 °C and Burial Depth ~30 km, identify which rock type forms and what real-world setting produces those conditions (deep subduction zone). Link to the plate-tectonics-advanced simulation to show that plate tectonics drives the rock cycle at depth (HS-ESS2-1).",
    ],
    faq: [
      {
        question: "What is the difference between igneous and metamorphic rock if both involve heat?",
        answer:
          "The key distinction is whether the rock melted. Metamorphic rock forms when existing rock is heated (above ~200 °C) and compressed by burial but remains solid — minerals recrystallize without the rock becoming liquid. Igneous rock forms when rock melts completely into magma (above ~700–1200 °C depending on composition) and then solidifies. Try setting Temperature above 700 °C in the simulation to see the transition from metamorphic to igneous pathway.",
      },
      {
        question: "How long does the rock cycle take?",
        answer:
          "It varies enormously by pathway. Lava cooling into igneous rock can take years to decades. Sediment compacting into sedimentary rock typically takes tens of millions of years. Metamorphism at depth takes millions to tens of millions of years. Full cycle completion — from magma to sedimentary rock and back to metamorphic — can span hundreds of millions of years.",
      },
      {
        question: "Which NGSS standards does this simulation address?",
        answer:
          "The simulation supports HS-ESS2-1 (develop a model to illustrate how Earth's internal and surface processes operate at different spatial and temporal scales to form continental and ocean-floor features). Rock type transitions under different temperature and burial-depth conditions directly model the processes described in that standard. MS-ESS2-1 is also listed for cross-grade connection.",
      },
      {
        question: "Can sedimentary rock become igneous rock without first becoming metamorphic?",
        answer:
          "In simplified rock-cycle diagrams a direct arrow from sedimentary to magma is sometimes shown, but in nature, burial heating typically passes through metamorphic conditions before reaching melting temperatures. The distinction matters: sedimentary rock usually becomes metamorphic rock first, then melts into magma if temperatures climb high enough. Set Temperature above 800 °C and Burial Depth above 20 km in the simulation to see the melting pathway — but treat the 'skip metamorphism' route as a diagram simplification rather than a common geological process.",
      },
      {
        question: "What makes granite different from basalt if both are igneous?",
        answer:
          "Cooling rate and composition. Granite forms from slow cooling of silica-rich magma deep underground (intrusive), giving minerals time to grow large enough to see with the naked eye. Basalt forms from rapid cooling of iron- and magnesium-rich lava at the surface (extrusive), producing microscopic crystals. Their contrasting density — granite ~2.7 g/cm³ vs. basalt ~3.0 g/cm³ — is why continental crust (granite-dominated) is too buoyant to subduct while oceanic crust (basalt-dominated) is not.",
      },
    ],
  },
};
