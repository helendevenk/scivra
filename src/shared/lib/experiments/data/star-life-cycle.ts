import type { Experiment } from "@/shared/types/experiment";

export const starLifeCycle: Experiment = {
  id: "star-life-cycle",
  slug: "star-life-cycle",
  title: "Star Life Cycle",
  subtitle: "From nebula to neutron star — stellar evolution on the HR diagram",
  description:
    "Trace the life cycle of stars from protostellar nebula through main sequence, red giant, and final fate (white dwarf, neutron star, or black hole). An interactive Hertzsprung-Russell diagram shows how luminosity and temperature change as stars evolve. Adjust initial stellar mass to see how it determines a star's lifespan and endpoint.",
  thumbnail: "/imgs/experiments/star-life-cycle.png",

  standards: {
    ngss: ["HS-ESS1-1", "HS-ESS1-3"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "9-12",
  tags: [
    "stellar evolution",
    "HR diagram",
    "Hertzsprung-Russell",
    "main sequence",
    "red giant",
    "white dwarf",
    "neutron star",
    "black hole",
    "Earth Science",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "stellarMass",
      label: "Stellar Mass",
      unit: "M☉",
      min: 0.5,
      max: 25,
      default: 1.0,
      step: 0.1,
      tier: "free",
    },
    {
      id: "stageProgress",
      label: "Stage Progress",
      unit: "%",
      min: 0,
      max: 100,
      default: 30,
      step: 1,
      tier: "free",
    },
    {
      id: "coreDensity",
      label: "Core Density",
      unit: "×normal",
      min: 0.1,
      max: 3,
      default: 1.0,
      step: 0.1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "L \\approx L_\\odot \\left(\\frac{M}{M_\\odot}\\right)^{3.5}",
      description:
        "Main-sequence luminosity scales roughly as mass to the 3.5 power. A 10 M☉ star is ~3000× more luminous than the Sun.",
    },
    {
      latex: "\\tau_{\\text{MS}} \\approx 10^{10} \\left(\\frac{M}{M_\\odot}\\right)^{-2.5} \\text{ yr}",
      description:
        "Main-sequence lifetime decreases steeply with mass. Massive stars burn fuel far faster despite having more of it.",
    },
  ],

  theory:
    "Stars form when dense regions in molecular clouds collapse under gravity. The protostar heats up until hydrogen fusion ignites in the core, placing it on the main sequence of the HR diagram. A star spends most of its life on the main sequence, fusing H → He. When core hydrogen is exhausted, the core contracts and heats, igniting hydrogen shell burning. The envelope expands and cools — the star becomes a red giant (or supergiant for massive stars). Low-mass stars (< 8 M☉) shed outer layers as a planetary nebula, leaving a white dwarf that slowly cools. High-mass stars (> 8 M☉) fuse heavier elements up to iron, then undergo core-collapse supernova. The remnant is a neutron star (< ~25 M☉) or black hole (> ~25 M☉). The HR diagram plots luminosity vs. surface temperature; evolutionary tracks show distinct paths depending on initial mass. The main sequence runs diagonally — hot-bright upper left to cool-dim lower right.",

  instructions:
    "Use the Stellar Mass, Stage Progress, and Core Density sliders to explore how mass, evolutionary stage, and core compression move a star across the HR diagram. Try the Sun-Like Star, Massive Star, and Very Massive Star presets to compare white dwarf, neutron star, and black hole pathways.",

  challenges: [
    {
      id: "slc-c1",
      question: "Why do more massive stars have shorter lifetimes despite having more fuel?",
      hint: "Luminosity ∝ M^3.5 but fuel ∝ M, so lifetime ∝ M/L ∝ M^(-2.5). A 10 M☉ star is 10× heavier but ~3000× more luminous — it burns through fuel ~300× faster.",
      tier: "free",
    },
    {
      id: "slc-c2",
      question: "What determines whether a star ends as a white dwarf, neutron star, or black hole?",
      hint: "Initial mass is the primary factor. Below ~8 M☉ → white dwarf. 8–25 M☉ → neutron star (Chandrasekhar limit ~1.4 M☉ for the remnant). Above ~25 M☉ → black hole (Tolman–Oppenheimer–Volkoff limit ~2–3 M☉).",
      tier: "free",
    },
    {
      id: "slc-c3",
      question: "Why does a star become a red giant when it exhausts core hydrogen?",
      hint: "Without core fusion, the core contracts and heats. Hydrogen ignites in a shell around the core, releasing more energy. The envelope absorbs this energy and expands enormously, cooling the surface to red but greatly increasing total luminosity.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["solar-system-scale", "radiometric-dating"],
  htmlPath: "/experiments/earth-science/star-life-cycle.html",

  seoTitle: "Star Life Cycle & HR Diagram Simulation | Scivra Earth Science",
  seoKeywords: [
    "star life cycle simulation",
    "HR diagram interactive",
    "Hertzsprung-Russell",
    "stellar evolution",
    "main sequence",
    "Earth science virtual lab",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Stellar Evolution and the Hertzsprung-Russell Diagram",
  },
  htmlControlAliases: { stellarMass: "mass-slider", stageProgress: "stage-slider", coreDensity: "density-slider" },
  presets: [
    {
      id: "sun",
      label: "Sun-Like Star (1 M☉)",
      description:
        "A Sun-like star spends billions of years on the main sequence before expanding into a red giant. It eventually sheds its outer layers and leaves a hot white dwarf core behind.",
    },
    {
      id: "massive",
      label: "Massive Star (~10 M☉)",
      description:
        "A massive star burns fuel quickly, moves through advanced fusion stages, and ends in a core-collapse supernova. The compact remnant is likely a neutron star.",
    },
    {
      id: "verymassive",
      label: "Very Massive Star (~25 M☉)",
      description:
        "A very massive star evolves rapidly through supergiant stages before a supernova disrupts its outer layers. Its collapsed core can cross the threshold to become a black hole.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Every star you see tonight is mid-story in a process that spans millions to trillions of years. Stars form when a cloud of gas and dust collapses under gravity, heating until hydrogen fusion ignites in the core. That fusion pressure balances gravity and locks the star onto the main sequence of the Hertzsprung-Russell (HR) diagram for roughly 90% of its life. What happens next depends almost entirely on initial mass. Stars below about 0.5 solar masses (M☉) are red dwarfs and will outlast the current age of the universe. Low- and intermediate-mass stars below about 8 M☉ eventually swell into red giants, shed their outer layers as a glowing planetary nebula, and leave a white dwarf behind — a path the Sun (~1 M☉) will follow in roughly 5 billion years. Stars above ~8 M☉ explode in a core-collapse supernova, leaving a neutron star or black hole. This simulation traces those paths on a live HR diagram as Stellar Mass, Stage Progress, and Core Density change.",
    parameterExplanations: {
      stellarMass:
        "Stellar Mass sets the star's initial mass in solar masses, which is the main variable controlling its position and path on the HR diagram. Low-mass stars are cooler, dimmer, and remain on the main sequence for a very long time before becoming red giants and white dwarfs. Higher-mass stars sit toward the hot, bright end of the main sequence, burn hydrogen much faster, and can fuse heavier elements in later stages. By comparing the Sun-Like, Massive, and Very Massive presets, students can connect mass to lifetime, luminosity, nucleosynthesis, and final fate.",
      stageProgress:
        "Stage Progress moves the star through the current evolutionary track rather than changing its original mass. At low progress values, the star is closer to its early or main-sequence condition on the HR diagram, where hydrogen fusion in the core balances gravity. As progress increases, the model shows movement toward later stages such as red giant or supergiant expansion, core exhaustion, supernova, and compact remnant formation. Use this slider to pause and compare where the same star appears on the HR diagram at different moments in its life cycle.",
      coreDensity:
        "Core Density represents how compressed the star's central region is compared with a normal reference state. During stellar evolution, gravity can squeeze the core as fuel is used up, raising temperature and pressure enough to trigger new fusion stages in massive stars. On the HR diagram, increasing core density helps students connect internal changes to visible shifts in luminosity, surface temperature, and stage labels. This is especially useful for discussing HS-ESS1-3: heavy elements form through fusion inside stars, while supernova conditions spread newly made elements into space.",
    },
    misconceptions: [
      {
        wrong:
          "Our Sun will eventually explode as a supernova.",
        correct:
          "Supernovae require an initial mass above roughly 8 M☉. The Sun is 1 M☉ and will instead expand into a red giant in about 5 billion years, gently shed its outer envelope as a planetary nebula, and leave a white dwarf the size of Earth. No explosion.",
      },
      {
        wrong:
          "More massive stars live longer because they have more hydrogen fuel.",
        correct:
          "Luminosity scales roughly as mass to the 3.5 power (L ∝ M³·⁵). A star 10× the Sun's mass is ~3,000× more luminous, burning through its fuel far faster than its larger supply compensates. Lifetime scales as roughly M⁻²·⁵ — bigger stars die much sooner.",
      },
      {
        wrong:
          "A red giant is cooler than the Sun, so it must be dimmer.",
        correct:
          "Red giants have lower surface temperatures (~3,500 K versus the Sun's ~5,800 K), but they are enormously larger in radius — sometimes hundreds of solar radii. Total luminosity depends on both temperature and surface area, and the area increase wins: red giants are hundreds to thousands of times more luminous than the Sun.",
      },
      {
        wrong:
          "All stars eventually collapse into black holes.",
        correct:
          "Only the most massive stars (above roughly 25 M☉) leave black holes. Stars in the 8–25 M☉ range leave neutron stars after supernova. Stars below ~8 M☉ — the vast majority — leave white dwarfs. The HR diagram in the simulation shows these branching paths clearly.",
      },
      {
        wrong:
          "The HR diagram is a picture of stars moving across the sky.",
        correct:
          "The HR diagram plots luminosity against surface temperature (or color). It does not show positions in space. A star's location on the diagram tells you its physical state. The diagonal main sequence is where stars spend most of their lives; red giants appear in the upper right.",
      },
    ],
    teacherUseCases: [
      "Use the Sun-Like Star, Massive Star, and Very Massive Star presets as a three-case opener, then have students record Stellar Mass, Stage Progress, Core Density, HR diagram location, and final endpoint. Connect the comparison to HS-ESS1-3 by asking which stars support heavier-element fusion and supernova dispersal.",
      "Keep Stellar Mass fixed with the Sun-Like Star preset and move Stage Progress from early to late values. Students should describe how the HR diagram track changes as the star leaves the main sequence, becomes a red giant, and approaches the white dwarf endpoint.",
      "Select the Massive Star preset, then vary Core Density while holding Stellar Mass near 10 M☉. Ask students to explain why core compression matters for advanced fusion stages and how a supernova can distribute elements formed inside massive stars.",
      "Run the Very Massive Star preset and pause at several Stage Progress values. Students can identify when the model shifts from main sequence to supergiant to supernova and explain why a black hole endpoint requires more initial mass than a neutron star endpoint.",
      "Have groups design a short NGSS HS-ESS1-3 model using all three sliders: Stellar Mass for initial conditions, Stage Progress for life-cycle stage, and Core Density for fusion environment. Each group should use one preset as evidence and explain where nucleosynthesis occurs in the sequence.",
    ],
    faq: [
      {
        question: "What is the HR diagram and why does it matter for stellar evolution?",
        answer:
          "The Hertzsprung-Russell diagram plots a star's luminosity (energy output) on the vertical axis against its surface temperature on the horizontal axis (with temperature running right-to-left by convention). Most stars fall along a diagonal band called the main sequence, where they spend most of their lives fusing hydrogen. When a star exhausts its core hydrogen, it moves off the main sequence to the right and upward (red giant region), making the HR track a visual record of stellar aging.",
      },
      {
        question: "Why does a star become a red giant when its core hydrogen runs out?",
        answer:
          "Without core fusion, gravity compresses the core, which heats up and ignites hydrogen fusion in a shell surrounding it. That shell releases more energy than core fusion did, causing the outer envelope to expand dramatically — sometimes to over 100 times the original radius. The expanded surface is cooler, shifting the color to red, but the enormous surface area more than compensates, making the star far more luminous overall.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "HS-ESS1-1 asks students to develop a model based on evidence to illustrate the life span of the Sun and the role of nuclear fusion in the Sun's core. HS-ESS1-3 asks for a model of the role of nuclear fusion in the synthesis of heavy elements in stars. This simulation directly visualizes both: the mass slider shows how initial conditions determine life span, and the end-state outcomes connect to nucleosynthesis — massive stars fuse elements up to iron, while supernovae and neutron-rich merger ejecta help form many elements heavier than iron. Black holes themselves are not synthesis sites.",
      },
      {
        question: "How long will the Sun remain on the main sequence?",
        answer:
          "Using τ ≈ 10¹⁰ × (M/M☉)⁻²·⁵ years with M = 1 M☉, the Sun's total main-sequence lifetime is about 10 billion years. The Sun is currently ~4.6 billion years old, so it has roughly 5 billion years of hydrogen fusion remaining before it expands into a red giant. Set Stellar Mass to 1 and watch the simulation mark this stage.",
      },
      {
        question: "What is a white dwarf and can it ever restart fusion?",
        answer:
          "A white dwarf is the dense, Earth-sized remnant of a low- or medium-mass star's core — mostly carbon and oxygen, with no ongoing fusion. It gradually radiates away stored heat over billions of years. Under normal conditions it cannot restart fusion. However, if it accretes enough mass from a companion star to exceed ~1.4 M☉ (the Chandrasekhar limit), it can trigger a runaway thermonuclear explosion known as a Type Ia supernova — a completely different mechanism from the core-collapse supernovae shown in this simulation for massive stars.",
      },
    ],
  },
};
