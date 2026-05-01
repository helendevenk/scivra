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
  contentSections: {
    whatIsIt:
      "The rock cycle describes how Earth's three main rock families — igneous, sedimentary, and metamorphic — continuously transform into one another through geological processes powered by Earth's internal heat and the Sun's energy at the surface. Igneous rocks crystallize from cooling magma; sedimentary rocks form from the compaction and cementation of eroded fragments; metamorphic rocks form when heat and pressure transform existing rock without melting it. Crucially, the cycle has no single fixed direction: any rock type can become any other through the right combination of temperature, pressure, and time. The simulation lets you move rock samples through the cycle by adjusting temperature, pressure, and timescale, showing which transformation pathway activates under each set of conditions.",
    parameterExplanations: {
      temperature:
        "Temperature in °C, ranging 0–1400°C. Sedimentary and igneous rocks begin metamorphic transformation above ~200°C. Above ~700–1200°C (depending on composition), rock melts into magma and re-enters the igneous pathway. The default value of 200°C sits at the low-grade metamorphic threshold.",
      pressure:
        "Confining pressure in GPa, ranging 0–4 GPa. A pressure of 0.3 GPa corresponds roughly to burial at 10 km depth. Metamorphism begins above ~0.3 GPa combined with elevated temperature; high-pressure subduction environments (>1 GPa) can produce minerals such as glaucophane, lawsonite, or omphacite. Garnet occurs across a broader range of metamorphic grades and is not exclusive to high-pressure subduction.",
      timescale:
        "Geological time in millions of years (My), ranging 1–500 My. Sediment compaction into sedimentary rock requires tens of millions of years. Metamorphic reactions accelerate with temperature but still require millions of years at geological scales. The default 50 My spans a typical sedimentary basin filling timescale.",
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
          "Loose sediment must be buried under additional sediment, compressed under its own weight (lithification), and cemented by minerals precipitating from groundwater. This typically takes tens of millions of years for deep burial to produce well-lithified rock. The timescale parameter in the simulation ranges up to 500 million years to represent this geological pacing.",
      },
      {
        wrong:
          "Granite and basalt are the same because they are both igneous rocks.",
        correct:
          "Both are igneous, but form under very different conditions. Granite forms from slow cooling of magma deep underground (intrusive/plutonic), allowing large crystals to grow — you can see individual minerals with the naked eye. Basalt forms from rapid cooling of lava at the surface (extrusive/volcanic), producing very fine crystals or glass. Composition also differs: granite is silica-rich (continental); basalt is iron- and magnesium-rich (oceanic).",
      },
    ],
    teacherUseCases: [
      "Pathway mapping activity: assign pairs a starting rock type and a target rock type. They must identify at least two different parameter paths through the simulation that achieve the transformation. For example, going from sedimentary to igneous requires either raising temperature above 700°C (melting) or first metamorphosing then melting, showing multiple valid routes.",
      "Metamorphism threshold investigation: starting at temperature 200°C and pressure 0.3 GPa, increase each parameter independently in steps while holding the other constant. Students identify the minimum temperature-pressure combination that triggers metamorphism and map the boundary on a T-P grid — a simplified phase diagram exercise at HS algebra level.",
      "Timescale intuition: set temperature to 50°C and pressure to 0.1 GPa (shallow burial), then sweep timescale from 1 My to 500 My. Ask students when sediment becomes well-lithified rock. Connect the 50–100 My typical value to the timescale of mountain building and erosion, supporting HS-ESS2-1.",
      "Misconception challenge — one-way cycle: before the sim, display the classic igneous → sedimentary → metamorphic → magma textbook diagram and ask if that is the only possible route. Then have students find, in the simulation, a path from metamorphic directly back to sedimentary (erosion and weathering after uplift) without passing through igneous. This directly corrects the one-way cycle misconception.",
      "Subduction connection: at temperature 600°C and pressure 1.5 GPa, identify which rock type forms and what real-world setting produces those conditions (deep subduction zone, ~50 km depth). Link to the plate-tectonics-advanced simulation to show that plate tectonics is the mechanism driving the rock cycle at depth, addressing HS-ESS2-1 on internal Earth processes.",
    ],
    faq: [
      {
        question: "What is the difference between igneous and metamorphic rock if both involve heat?",
        answer:
          "The key distinction is whether the rock melted. Metamorphic rock forms when existing rock is heated (above ~200°C) and compressed but remains solid — minerals recrystallize without the rock becoming liquid. Igneous rock forms when rock melts completely into magma (above ~700–1200°C depending on composition) and then solidifies. Try setting temperature above 700°C in the simulation to see the transition from metamorphic to igneous pathway.",
      },
      {
        question: "How long does the rock cycle take?",
        answer:
          "It varies enormously by pathway. Lava cooling into igneous rock can take years to decades. Sediment compacting into sedimentary rock typically takes tens of millions of years (the simulation's timescale parameter spans 1–500 My). Metamorphism at depth takes millions to tens of millions of years. Full cycle completion — from magma to sedimentary rock and back to metamorphic — can span hundreds of millions of years.",
      },
      {
        question: "Which NGSS standards does this simulation address?",
        answer:
          "The simulation supports HS-ESS2-1 (develop a model to illustrate how Earth's internal and surface processes operate at different spatial and temporal scales to form continental and ocean-floor features). Rock type transitions under different temperature and pressure conditions directly model the processes described in that standard. MS-ESS2-1 is also listed in the file for cross-grade connection.",
      },
      {
        question: "Can sedimentary rock become igneous rock without first becoming metamorphic?",
        answer:
          "In simplified rock-cycle diagrams a direct arrow from sedimentary to magma is sometimes shown, but in nature, burial heating typically passes through metamorphic conditions before reaching melting temperatures. The distinction matters: sedimentary rock usually becomes metamorphic rock first, then melts into magma if temperatures climb high enough. Set temperature above 800°C and pressure above 1 GPa in the simulation to see the melting pathway — but treat the 'skip metamorphism' route as a diagram simplification rather than a common geological process.",
      },
      {
        question: "What makes granite different from basalt if both are igneous?",
        answer:
          "Cooling rate and composition. Granite forms from slow cooling of silica-rich magma deep underground (intrusive), giving minerals time to grow large enough to see with the naked eye. Basalt forms from rapid cooling of iron- and magnesium-rich lava at the surface (extrusive), producing microscopic crystals. Their contrasting density — granite ~2.7 g/cm³ vs. basalt ~3.0 g/cm³ — is why continental crust (granite-dominated) is too buoyant to subduct while oceanic crust (basalt-dominated) is not.",
      },
    ],
  },
};
