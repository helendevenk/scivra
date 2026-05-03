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
    { id: "silicaPct", label: "Silica Content", unit: "%", min: 45, max: 75, default: 52, step: 1, tier: "free" },
    { id: "gasContent", label: "Dissolved Gas", unit: "%", min: 0.5, max: 6, default: 2, step: 0.1, tier: "free" },
    { id: "magmaTemp", label: "Magma Temperature", unit: "°C", min: 800, max: 1300, default: 1150, step: 10, tier: "free" },
  ],
  formulas: [
    { latex: "\\eta \\propto e^{E_a / RT} \\cdot f(\\text{SiO}_2, \\text{H}_2\\text{O})", description: "Magma viscosity depends exponentially on temperature and silica/water content" },
  ],
  theory: "Volcanic eruption style is primarily determined by magma viscosity and gas content. Basaltic magma (low SiO₂, ~50%) has low viscosity, allowing gas to escape easily — producing gentle effusive eruptions with lava flows (Hawaii-type shield volcanoes). Andesitic magma (intermediate SiO₂, ~60%) produces moderate explosive eruptions (Strombolian/Vulcanian). Silica-rich dacitic to rhyolitic magma (SiO₂ ~65–75%) is extremely viscous, trapping gas until pressure builds to catastrophic levels — producing violent explosive eruptions with pyroclastic flows and ash columns (Plinian; Mt. St. Helens 1980 erupted primarily dacitic magma). Temperature also matters: hotter magma is less viscous. Water content reduces viscosity but increases explosive potential as it flashes to steam during eruption.",
  instructions: "Use the Silica Content, Dissolved Gas, and Magma Temperature sliders to test how viscosity and trapped gases shape eruption explosivity. Try the Mauna Loa, Mount St. Helens, and Paricutín presets to compare real-world volcano contexts, then press Erupt and connect each outcome to lava flow behavior, ash production, and volcanic hazards.",
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
  htmlControlAliases: { silicaPct: "oninput:setSilica", gasContent: "oninput:setGas", magmaTemp: "oninput:setMagmaTemp" },
  presets: [
    { id: "shield", label: "Mauna Loa (shield, Hawaii)", paramValues: { silicaPct: 50, gasContent: 1, magmaTemp: 1200 } },
    { id: "strato", label: "Mount St. Helens (stratovolcano)", paramValues: { silicaPct: 65, gasContent: 4, magmaTemp: 1000 } },
    { id: "cinder", label: "Paricutín (cinder cone)", paramValues: { silicaPct: 55, gasContent: 3, magmaTemp: 1100 } },
  ],
  contentSections: {
    whatIsIt:
      "Not all volcanic eruptions look the same. Some pour out slow rivers of glowing lava that people can walk alongside, while others explode with the force of nuclear bombs and spread ash across thousands of kilometers — large eruptions can blanket whole regions in ash. The key difference is magma viscosity — basically, how thick and sticky the molten rock is. This simulation lets you change the magma type, the amount of dissolved gas trapped inside it, and the temperature, then watch the eruption style that results. Basaltic magma (low silica) flows easily and lets gas escape gently, producing wide shield volcanoes like those in Hawaii. Silica-rich dacitic to rhyolitic magma is so thick that gas cannot escape — pressure builds until the whole thing explodes, creating towering ash columns and dangerous pyroclastic flows. Mt. St. Helens in 1980 is a famous example, driven primarily by dacitic magma. Compare the shapes of the volcanoes that each eruption style builds over time.",
    parameterExplanations: {
      silicaPct:
        "Silica Content controls how much SiO2 is in the magma, which is one of the strongest controls on viscosity. Low-silica magma near 45-52% behaves more like basalt: it flows easily, releases gas more gradually, and tends to build broad shield volcanoes through lava flows. Higher-silica magma near 65-75% forms stronger networks of silicate minerals, making the melt sticky enough to trap bubbles and build pressure. That change helps students connect Earth materials to surface processes: small differences in composition can produce very different landforms and hazards, supporting MS-ESS2-2 and HS-ESS2-3 style cause-and-effect reasoning.",
      gasContent:
        "Dissolved Gas represents volatile materials, especially water vapor and carbon dioxide, held under pressure inside magma. As magma rises, pressure drops and gases expand into bubbles. If viscosity is low, bubbles can escape through the melt, producing lava fountains or mostly effusive flows. If viscosity is high, bubbles remain trapped until pressure is released suddenly, driving ash columns, volcanic bombs, and pyroclastic flows. Use this slider with Silica Content rather than alone: the same gas percentage can be manageable in runny basalt but dangerous in sticky dacitic or rhyolitic magma. This supports evidence-based explanations of geoscience hazards and volcanic landform formation.",
      magmaTemp:
        "Magma Temperature changes viscosity by changing how easily atoms and mineral structures move within the melt. Hotter magma is generally less viscous, so it can flow farther and allow gases to escape more readily. Cooler magma is thicker, slows bubble movement, and can increase the chance of explosive behavior when gas content is also high. Temperature does not erase the effect of composition: hot high-silica magma can still be much stickier than cooler low-silica magma. Comparing this slider with the presets helps students model how energy, material properties, and pressure interact to shape volcanic eruptions and the resulting landforms.",
    },
    misconceptions: [
      {
        wrong: "All volcanoes erupt the same way — with a large explosion and lava.",
        correct:
          "Eruption style varies enormously. Effusive (flowing) eruptions produce steady lava flows with little explosive activity. Explosive eruptions may eject very little lava at the surface but produce massive ash clouds, pyroclastic flows, and volcanic bombs. The style depends on silica content, dissolved gas, and temperature, not simply on how 'active' the volcano is.",
      },
      {
        wrong: "The lava is the most dangerous part of a volcanic eruption.",
        correct:
          "Most volcanic fatalities are caused by pyroclastic flows (superheated clouds of gas and rock moving at over 100 km/h), volcanic ash (which can collapse roofs and contaminate water), and lahars (volcanic mudflows). Lava flows are typically slow enough that people can move away from them, though they destroy everything in their path.",
      },
      {
        wrong: "Shield volcanoes are less active than stratovolcanoes.",
        correct:
          "Shield volcanoes like those in Hawaii erupt very frequently — sometimes continuously for years — because their low-silica, hot magma has low viscosity and can flow easily to the surface without building dangerous pressure. Stratovolcanoes often have long quiet periods between eruptions precisely because viscous magma seals the vent, allowing pressure to build up before a catastrophic release.",
      },
      {
        wrong: "Higher gas content always means a bigger, more dangerous eruption.",
        correct:
          "Gas content matters most in combination with viscosity. High gas content with low silica and high temperature can produce lava fountains that are dramatic but typically not catastrophic. The same gas content with high silica and lower temperature can cause an extremely violent explosion because the gas cannot escape gradually. The interaction among dissolved gas, silica content, and magma temperature determines eruption explosivity.",
      },
    ],
    teacherUseCases: [
      "Preset comparison: run the Mauna Loa preset, record silicaPct, gasContent, and magmaTemp, then run the Mount St. Helens preset. Students compare eruption products and volcano shape, then write a cause-and-effect explanation using MS-ESS2-2.",
      "Silica investigation: keep gasContent at 3% and magmaTemp at 1100°C while moving silicaPct from 45% to 75%. Students identify when lava-flow behavior shifts toward more explosive behavior and explain why viscosity changes.",
      "Gas and pressure model: hold silicaPct at 65% and magmaTemp at 1000°C, then vary gasContent from 0.5% to 6%. Students rank the resulting eruptions from least to most explosive and connect dissolved gas to pressure buildup.",
      "Temperature effect on viscosity: hold silicaPct at 55% and gasContent at 3%, then compare eruptions at magmaTemp 800°C, 1100°C, and 1300°C. Students describe how temperature changes flow behavior while noting that composition still matters.",
      "Hazard mapping with presets: use the shield, strato, and cinder presets as stations. Students sketch likely lava-flow, ash-fall, and pyroclastic-flow hazard zones, then connect the observed patterns to real volcano landforms and NGSS geoscience-process explanations.",
    ],
    faq: [
      {
        question: "What is magma viscosity and why does it control eruption style?",
        answer:
          "Viscosity measures how resistant a liquid is to flowing — think of water (low viscosity) versus peanut butter (high viscosity). In magma, silica (SiO2) molecules form long chains that tangle together and slow movement. Raising Silica Content makes magma more viscous and better able to trap dissolved gases, allowing pressure to build to explosive levels. Lower-silica magma flows more freely and lets gas escape gradually, producing gentler effusive eruptions. Magma Temperature also plays a role: hotter magma is typically less viscous, similar to how heating honey makes it runnier.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation primarily supports MS-ESS2-2, which asks students to construct explanations for how geoscience processes change Earth's surface. Volcanic activity is a key geoscience process that shapes landforms, distributes rock-forming minerals, and — in large eruptions — temporarily affects climate. The simulation also connects to the crosscutting concept of cause and effect: magma properties (cause) determine eruption style and volcano shape (effect).",
      },
      {
        question: "What is a pyroclastic flow and why is it so dangerous?",
        answer:
          "A pyroclastic flow is a fast-moving current of hot gas, ash, and rock fragments that hugs the ground and travels outward from a volcano, often at speeds exceeding 100 km/h and temperatures above 500°C. It typically occurs when an explosive eruption column collapses under its own weight. The combination of extreme heat, high speed, and suffocating ash makes pyroclastic flows far more deadly than lava flows for nearby communities. They were responsible for the destruction of Pompeii in 79 CE.",
      },
      {
        question: "Why do volcanoes form in specific locations on Earth?",
        answer:
          "Most volcanoes occur at tectonic plate boundaries or above mantle hot spots. At subduction zones, one plate slides beneath another, releasing water that lowers the melting point of mantle rock and generates magma. This subduction-zone magma is often intermediate to high in silica, which is why the Ring of Fire around the Pacific Ocean has so many explosive stratovolcanoes. At mid-ocean ridges and hot spots like Hawaii, mantle material rises directly, producing lower-silica basaltic magma and gentler eruptions.",
      },
      {
        question: "Can volcanic eruptions affect global climate?",
        answer:
          "Large explosive eruptions inject sulfur dioxide (SO2) into the stratosphere, where it reacts with water to form tiny sulfate particles that reflect sunlight back to space. This can temporarily cool global temperatures by 0.5–1°C for one to two years following a major eruption. The 1991 eruption of Mt. Pinatubo in the Philippines caused measurable global cooling the following year. This effect is temporary because the particles eventually settle out, unlike the long-term warming caused by CO2 accumulation.",
      },
    ],
  },
};
