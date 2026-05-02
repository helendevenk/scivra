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
  theory: "Volcanic eruption style is primarily determined by magma viscosity and gas content. Basaltic magma (low SiO₂, ~50%) has low viscosity, allowing gas to escape easily — producing gentle effusive eruptions with lava flows (Hawaii-type shield volcanoes). Andesitic magma (intermediate SiO₂, ~60%) produces moderate explosive eruptions (Strombolian/Vulcanian). Silica-rich dacitic to rhyolitic magma (SiO₂ ~65–75%) is extremely viscous, trapping gas until pressure builds to catastrophic levels — producing violent explosive eruptions with pyroclastic flows and ash columns (Plinian; Mt. St. Helens 1980 erupted primarily dacitic magma). Temperature also matters: hotter magma is less viscous. Water content reduces viscosity but increases explosive potential as it flashes to steam during eruption.",
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
  contentSections: {
    whatIsIt:
      "Not all volcanic eruptions look the same. Some pour out slow rivers of glowing lava that people can walk alongside, while others explode with the force of nuclear bombs and spread ash across thousands of kilometers — large eruptions can blanket whole regions in ash. The key difference is magma viscosity — basically, how thick and sticky the molten rock is. This simulation lets you change the magma type, the amount of dissolved gas trapped inside it, and the temperature, then watch the eruption style that results. Basaltic magma (low silica) flows easily and lets gas escape gently, producing wide shield volcanoes like those in Hawaii. Silica-rich dacitic to rhyolitic magma is so thick that gas cannot escape — pressure builds until the whole thing explodes, creating towering ash columns and dangerous pyroclastic flows. Mt. St. Helens in 1980 is a famous example, driven primarily by dacitic magma. Compare the shapes of the volcanoes that each eruption style builds over time.",
    parameterExplanations: {
      magmaType:
        "Selects the magma composition on a scale of 0 to 2. At 0 (basaltic), the magma is low in silica (about 50%), giving it a runny consistency similar to cold honey — gas escapes easily and eruptions are relatively gentle with flowing lava. At 1 (andesitic), silica content is intermediate (~60%), producing moderate explosive eruptions. At 2 (rhyolitic), the magma is very high in silica (~70%), making it extremely thick and sticky — gas is trapped until pressure forces a violent explosion.",
      gasContent:
        "Sets the percentage of dissolved gas (mainly water vapor and carbon dioxide) in the magma, ranging from 0.5% to 8%. Even small amounts of dissolved gas can dramatically change eruption style. When low-viscosity magma reaches the surface, dissolved gas escapes gradually like opening a warm can of soda slowly. In high-viscosity magma, the same gas cannot escape and instead drives an explosive decompression — like shaking a soda can and then popping it open suddenly.",
      magmaTemp:
        "Controls the temperature of the magma in degrees Celsius (700–1200°C). Higher temperatures make magma less viscous (thinner and runnier), in the same way that warming honey makes it flow more easily. Cooler magma is thicker and more likely to trap gas. Temperature and silica content together determine the final viscosity — a very hot rhyolitic magma is still much more viscous than a cool basaltic magma.",
    },
    misconceptions: [
      {
        wrong: "All volcanoes erupt the same way — with a large explosion and lava.",
        correct:
          "Eruption style varies enormously. Effusive (flowing) eruptions produce steady lava flows with little explosive activity. Explosive eruptions may eject very little lava at the surface but produce massive ash clouds, pyroclastic flows, and volcanic bombs. The style depends almost entirely on magma composition and gas content, not simply on how 'active' the volcano is.",
      },
      {
        wrong: "The lava is the most dangerous part of a volcanic eruption.",
        correct:
          "Most volcanic fatalities are caused by pyroclastic flows (superheated clouds of gas and rock moving at over 100 km/h), volcanic ash (which can collapse roofs and contaminate water), and lahars (volcanic mudflows). Lava flows are typically slow enough that people can move away from them, though they destroy everything in their path.",
      },
      {
        wrong: "Shield volcanoes are less active than stratovolcanoes.",
        correct:
          "Shield volcanoes like those in Hawaii erupt very frequently — sometimes continuously for years — because their low-viscosity basaltic magma flows easily to the surface without building dangerous pressure. Stratovolcanoes often have long quiet periods between eruptions precisely because thick magma seals the vent, allowing pressure to build up before a catastrophic release.",
      },
      {
        wrong: "Higher gas content always means a bigger, more dangerous eruption.",
        correct:
          "Gas content matters most in combination with viscosity. High gas content in low-viscosity basaltic magma produces lava fountains that are dramatic but typically not catastrophic. The same gas content in high-viscosity rhyolitic magma can cause an extremely violent explosion because the gas cannot escape gradually. The interaction between gas content and magma type determines eruption explosivity.",
      },
    ],
    teacherUseCases: [
      "Effusive vs. explosive comparison: set magmaType to 0 (basaltic) and gasContent to 2%, press Erupt, and note the eruption style and volcano shape. Then set magmaType to 2 (rhyolitic) and gasContent to 6%, press Erupt, and compare. Students diagram both volcano shapes and write a cause-and-effect explanation (MS-ESS2-2).",
      "Gas content investigation: hold magmaType at 2 (rhyolitic) and magmaTemp at 800°C, then vary gasContent from 0.5% to 8% in steps. Students observe how eruption explosivity changes and rank the outcomes from least to most dangerous, connecting dissolved gas to pressure buildup.",
      "Temperature effect on viscosity: hold magmaType at 1 (andesitic) and gasContent at 4%, then compare eruptions at magmaTemp 700°C vs. 1200°C. Students describe how temperature changes the eruption character and relate it to the everyday observation that warm liquids flow more easily than cold ones.",
      "Volcano shape and hazard mapping: after running basaltic and rhyolitic eruptions, students sketch the resulting volcano profiles and annotate where different hazards (lava flow, ash fall, pyroclastic zone) would be most dangerous. They then compare real topographic maps of Mauna Loa (shield) and Mt. Rainier (stratovolcano) as evidence.",
    ],
    faq: [
      {
        question: "What is magma viscosity and why does it control eruption style?",
        answer:
          "Viscosity measures how resistant a liquid is to flowing — think of water (low viscosity) versus peanut butter (high viscosity). In magma, silica (SiO2) molecules form long chains that tangle together and slow movement. High-silica rhyolitic magma flows very slowly and traps dissolved gases, allowing pressure to build to explosive levels. Low-silica basaltic magma flows freely and lets gas escape gradually, producing gentler effusive eruptions. Temperature also plays a role: hotter magma is typically less viscous, similar to how heating honey makes it runnier.",
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
          "Most volcanoes occur at tectonic plate boundaries or above mantle hot spots. At subduction zones, one plate slides beneath another, releasing water that lowers the melting point of mantle rock and generates magma. This subduction-zone magma is often andesitic to rhyolitic — high in silica — which is why the Ring of Fire around the Pacific Ocean has so many explosive stratovolcanoes. At mid-ocean ridges and hot spots like Hawaii, mantle material rises directly, producing basaltic magma and gentler eruptions.",
      },
      {
        question: "Can volcanic eruptions affect global climate?",
        answer:
          "Large explosive eruptions inject sulfur dioxide (SO2) into the stratosphere, where it reacts with water to form tiny sulfate particles that reflect sunlight back to space. This can temporarily cool global temperatures by 0.5–1°C for one to two years following a major eruption. The 1991 eruption of Mt. Pinatubo in the Philippines caused measurable global cooling the following year. This effect is temporary because the particles eventually settle out, unlike the long-term warming caused by CO2 accumulation.",
      },
    ],
  },
};
