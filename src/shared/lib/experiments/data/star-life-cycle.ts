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
      label: "Initial Mass",
      unit: "M☉",
      min: 0.5,
      max: 40,
      default: 1,
      step: 0.5,
      tier: "free",
    },
    {
      id: "playbackSpeed",
      label: "Time Speed",
      unit: "×",
      min: 0.5,
      max: 5,
      default: 1,
      step: 0.5,
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
    "Use the mass slider to set the initial stellar mass, then click 'Start Evolution' to watch the star progress through its life stages. The HR diagram tracks the star's position in real time. Hover over any stage label for details. Higher mass = shorter life but more dramatic ending.",

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
  contentSections: {
    whatIsIt:
      "Every star you see tonight is mid-story in a process that spans millions to trillions of years. Stars form when a cloud of gas and dust collapses under gravity, heating until hydrogen fusion ignites in the core. That fusion pressure balances gravity and locks the star onto the main sequence of the Hertzsprung-Russell (HR) diagram for roughly 90% of its life. What happens next depends almost entirely on initial mass. Stars below about 0.5 solar masses (M☉) are red dwarfs and will outlast the current age of the universe. Low- and intermediate-mass stars below about 8 M☉ eventually swell into red giants, shed their outer layers as a glowing planetary nebula, and leave a white dwarf behind — a path the Sun (~1 M☉) will follow in roughly 5 billion years. Stars above ~8 M☉ explode in a core-collapse supernova, leaving a neutron star or black hole. This simulation traces those paths on a live HR diagram as stellar mass is adjusted from 0.5 to 40 M☉.",
    parameterExplanations: {
      stellarMass:
        "Initial stellar mass in solar masses (M☉), from 0.5 to 40. Mass is the single most important variable in stellar evolution: it sets the luminosity, the main-sequence lifetime, and the ultimate fate. A 10 M☉ star is roughly 3,000× more luminous than the Sun and dies in ~30 million years instead of ~10 billion.",
      playbackSpeed:
        "Controls how fast the simulation advances through stellar time, from 0.5× to 5×. At 1×, the animation paces itself to highlight each evolutionary stage; at 5× you can quickly compare end states across different masses.",
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
      "Mass-fate mapping: run stellarMass at 1, 5, 15, and 30 M☉ at playbackSpeed 3 and have students record each star's final state. Build a class table of mass vs. endpoint and ask: 'Where does the boundary between white dwarf and neutron star fall in this simulation?'",
      "Lifetime estimation: set stellarMass to 10 M☉ and playbackSpeed to 1. Using the formula τ ≈ 10¹⁰ × (M/M☉)⁻²·⁵ years, have students predict the main-sequence lifetime before running, then compare to the simulation's timeline display.",
      "HR diagram track tracing: give students a blank HR diagram grid. As the animation runs at stellarMass 1 and playbackSpeed 1, have them mark the star's position every 30 seconds. Connect the dots afterward and compare the track to a reference HR diagram showing the Sun's expected evolution.",
      "Sun-analog contrast: run stellarMass 1 (Sun-like) and stellarMass 20 at playbackSpeed 5 simultaneously (or sequentially). Ask students to identify which stage each reaches before the simulation ends and relate this to HS-ESS1-1's requirement to construct an explanation of how a star's mass drives its life cycle.",
      "Supernova threshold exploration: step stellarMass from 6 to 10 in 0.5 M☉ increments at playbackSpeed 5 and identify the exact threshold where the simulation switches from planetary nebula to supernova. Discuss why the threshold matters for which elements get seeded into the next generation of stars and planets.",
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
          "Using τ ≈ 10¹⁰ × (M/M☉)⁻²·⁵ years with M = 1 M☉, the Sun's total main-sequence lifetime is about 10 billion years. The Sun is currently ~4.6 billion years old, so it has roughly 5 billion years of hydrogen fusion remaining before it expands into a red giant. Set stellarMass to 1 and watch the simulation mark this stage.",
      },
      {
        question: "What is a white dwarf and can it ever restart fusion?",
        answer:
          "A white dwarf is the dense, Earth-sized remnant of a low- or medium-mass star's core — mostly carbon and oxygen, with no ongoing fusion. It gradually radiates away stored heat over billions of years. Under normal conditions it cannot restart fusion. However, if it accretes enough mass from a companion star to exceed ~1.4 M☉ (the Chandrasekhar limit), it can trigger a runaway thermonuclear explosion known as a Type Ia supernova — a completely different mechanism from the core-collapse supernovae shown in this simulation for massive stars.",
      },
    ],
  },
};
