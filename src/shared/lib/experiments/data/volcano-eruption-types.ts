import type { Experiment } from "@/shared/types/experiment";

export const volcanoEruptionTypes: Experiment = {
  id: "volcano-eruption-types",
  slug: "volcano-eruption-types",
  title: "Volcano Eruption Types",
  subtitle: "Effusive vs explosive eruptions, magma viscosity, and volcano shapes",
  description:
    "Compare different types of volcanic eruptions by adjusting magma composition, gas content, and temperature. Watch how low-viscosity basaltic magma produces gentle effusive eruptions (shield volcanoes) while high-viscosity felsic magma causes explosive eruptions (stratovolcanoes). Observe pyroclastic flows, lava fountains, and ash columns.",
  thumbnail: "/imgs/experiments/volcano-eruption-types.png",
  standards: { ngss: ["MS-ESS2-2", "HS-ESS2-1"], gcse: [], ap: [] },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: ["volcano", "eruption types", "magma viscosity", "shield volcano", "stratovolcano", "Earth science"],
  difficulty: "intermediate",
  parameters: [
    { id: "magmaType", label: "Magma Type (0=basaltic, 1=andesitic, 2=rhyolitic)", unit: "", min: 0, max: 2, default: 0, step: 1, tier: "free" },
    { id: "gasContent", label: "Dissolved Gas Content", unit: "%", min: 0.5, max: 8, default: 2, step: 0.5, tier: "free" },
    { id: "magmaTemp", label: "Magma Temperature", unit: "°C", min: 700, max: 1200, default: 1100, step: 50, tier: "free" },
  ],
  formulas: [
    { latex: "\\eta \\propto e^{E_a / RT} \\cdot f(\\text{SiO}_2, \\text{H}_2\\text{O})", description: "Magma viscosity depends exponentially on temperature and silica/water content" },
  ],
  theory: "Volcanic eruption style is primarily determined by magma viscosity and gas content. Basaltic magma (low SiO₂, ~50%) has low viscosity, allowing gas to escape easily — producing gentle effusive eruptions with lava flows (Hawaii-type shield volcanoes). Andesitic magma (intermediate SiO₂, ~60%) produces moderate explosive eruptions (Strombolian/Vulcanian). Rhyolitic magma (high SiO₂, ~70%) is extremely viscous, trapping gas until pressure builds to catastrophic levels — producing violent explosive eruptions with pyroclastic flows and ash columns (Plinian, like Mt. St. Helens). Temperature also matters: hotter magma is less viscous. Water content reduces viscosity but increases explosive potential as it flashes to steam during eruption.",
  instructions: "Select a magma type and adjust gas content and temperature. Press Erupt to simulate the volcanic eruption. Compare the eruption style, height, and products for different combinations.",
  challenges: [
    { id: "vet-c1", question: "Why are Hawaiian eruptions less dangerous than Plinian eruptions?", hint: "Hawaiian eruptions use low-viscosity basaltic magma — gas escapes easily, producing gentle lava flows rather than explosive blasts", tier: "free" },
    { id: "vet-c2", question: "What makes pyroclastic flows so deadly?", hint: "They're superheated clouds of gas, ash, and rock fragments traveling at 100+ km/h at temperatures up to 700°C — impossible to outrun", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 20,
  relatedExperiments: ["plate-tectonics-advanced", "rock-cycle"],
  htmlPath: "/experiments/earth-science/volcano-eruption-types.html",
  seoTitle: "Volcano Eruption Types Simulation | Scivra Earth Science",
  seoKeywords: ["volcano eruption simulation", "magma viscosity interactive", "shield vs stratovolcano", "NGSS Earth science"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Middle School", teaches: "Volcanic Eruptions" },
};
