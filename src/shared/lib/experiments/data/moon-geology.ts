import type { Experiment } from "@/shared/types/experiment";

export const moonGeology: Experiment = {
  id: "moon-geology",
  slug: "moon-geology",
  title: "Moon Geology",
  subtitle: "Lunar surface features, maria, highlands, and crater formation",
  description:
    "Explore the Moon's geological features including impact craters, volcanic maria, and highland terrains. Simulate meteorite impacts to create craters of varying sizes, examine lunar rock samples, and understand the Moon's geological history from formation to present.",
  thumbnail: "/imgs/experiments/moon-geology.png",
  standards: { ngss: ["MS-ESS1-3", "HS-ESS1-6"], gcse: [], ap: [] },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: ["Moon", "lunar geology", "craters", "maria", "impact", "Earth science"],
  difficulty: "intermediate",
  parameters: [
    { id: "impactRate", label: "Impact Size", unit: "km", min: 1, max: 20, default: 5, step: 1, tier: "free" },
    { id: "rotationSpeed", label: "Rotation Speed", unit: "x", min: 0, max: 3, default: 1, step: 0.1, tier: "free" },
  ],
  formulas: [
    { latex: "D \\approx 1.8 \\rho_p^{0.11} \\rho_t^{-1/3} d^{0.78} v^{0.44} g^{-0.22} (\\sin\\theta)^{1/3}", description: "Pi-scaling crater diameter formula relating projectile and target properties" },
  ],
  theory: "The Moon's surface is divided into dark, flat maria (ancient lava plains) and bright, cratered highlands (older crust). Impact craters form when meteorites strike the surface at hypervelocity (10-70 km/s). Crater diameter depends on impactor size, velocity, angle, and target properties. Simple craters (<15 km) are bowl-shaped; complex craters have central peaks. The largest impacts created multi-ring basins. The Moon has no atmosphere or plate tectonics, so craters are preserved for billions of years. Lunar rock types include anorthosite (highlands), basalt (maria), and breccia (mixed impact debris).",
  instructions: "Use the Impact Size slider to change the size of new craters and the Rotation Speed slider to control how quickly the Moon turns. Try the Full Moon, Mare Imbrium Region, and Ancient Highlands presets to compare surface features, terrain types, and age ranges.",
  challenges: [
    { id: "mg-c1", question: "Why are lunar maria darker than highlands?", hint: "Maria are filled with dark basaltic lava from ancient volcanic eruptions, while highlands are lighter-colored anorthosite (calcium-rich feldspar)", tier: "free" },
    { id: "mg-c2", question: "Why does the Moon have more visible craters than Earth?", hint: "No atmosphere (no erosion or burn-up), no plate tectonics (no recycling), and no water erosion to wear craters away", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 20,
  relatedExperiments: ["tides-lunar-gravity", "solar-system-scale"],
  htmlPath: "/experiments/earth-science/moon-geology.html",
  seoTitle: "Moon Geology Simulation | Scivra Earth Science",
  seoKeywords: ["Moon geology simulation", "lunar crater interactive", "maria highlands", "NGSS Earth science"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Middle School", teaches: "Lunar Geology" },
  htmlControlAliases: { impactRate: "impactSlider", rotationSpeed: "rotSlider" },
  presets: [
    { id: "full", label: "Full Moon", description: "Shows the whole lunar disk with mixed terrain, giving students a broad reference view before focusing on specific regions." },
    { id: "maria", label: "Mare Imbrium Region", description: "Centers a dark basaltic mare region so students can compare smoother volcanic plains with older cratered terrain." },
    { id: "highlands", label: "Ancient Highlands", description: "Moves to bright, older highland crust where students can examine heavily cratered anorthosite terrain." },
  ],
  contentSections: {
    whatIsIt:
      "The Moon is Earth's closest neighbor and one of the most studied worlds in the solar system — yet its surface looks almost nothing like our own. Instead of forests and oceans, the Moon is covered in craters, ancient lava plains, and jagged mountain ranges, all preserved in near-perfect condition for billions of years. Two main terrain types dominate: the dark, flat maria (from the Latin word for 'seas') are ancient lava flows that filled huge impact basins roughly 3 to 4 billion years ago. The bright, heavily cratered highlands are older, original crust that dates back to the Moon's early formation. Because the Moon has no atmosphere to burn up incoming space rocks and no water or plate tectonics to erode or recycle the surface, every impact leaves a mark that remains visible for billions of years. By studying crater shapes and sizes, scientists can estimate the age of different lunar regions and reconstruct the history of collisions throughout the inner solar system. This simulation lets you launch your own meteorites and explore how impact size, speed, and angle shape the craters left behind.",
    parameterExplanations: {
      impactRate:
        "Impact Size controls the diameter assigned to new meteorite impacts in the simulation, from 1 km to 20 km. Raising the slider makes each triggered impact leave a larger crater and a more dramatic flash, so students can connect impactor scale with visible surface change. This is a simplified classroom control: it does not separately model velocity, angle, density, or target rock strength. Use it to compare small, medium, and large impacts on the same lunar surface, then ask students why real planetary scientists need more evidence than crater size alone.",
      rotationSpeed:
        "Rotation Speed changes how quickly the Moon turns in the 3D view, from a paused surface at 0x to a faster sweep at 3x. Slower rotation helps students inspect crater density, maria boundaries, and highland texture without losing their place. Faster rotation is useful when comparing the Full Moon view with focused presets because students can scan the surface and notice how features repeat or cluster. This control changes observation speed only; it does not imply that the Moon actually rotates this quickly in space.",
    },
    misconceptions: [
      {
        wrong: "Lunar craters were formed by ancient volcanoes, not meteorite impacts.",
        correct:
          "Early astronomers did debate this, but modern evidence overwhelmingly shows that the vast majority of lunar craters are impact craters. The circular shapes, raised rims, central peaks in large craters, and radiating ejecta rays all match what we see in impact physics experiments. The maria — the dark smooth regions — are from ancient volcanic lava flows that filled pre-existing impact basins.",
      },
      {
        wrong: "The Moon has no geology because it is a dead, unchanging world.",
        correct:
          "The Moon has a rich geological history spanning about 4.5 billion years. It had active volcanoes that erupted lava for over a billion years. It experienced a period of intense bombardment called the Late Heavy Bombardment around 3.9 billion years ago. Even today, moonquakes occur and tiny micrometeorites continuously chip away at the surface. The Moon's story is still being written.",
      },
      {
        wrong: "Larger meteorites always make deeper craters.",
        correct:
          "Crater depth often increases with impact energy, but the relationship between depth and diameter changes with crater size. Simple small craters are bowl-shaped and relatively deep, but complex large craters can develop flat floors, central peaks, and terraced walls — they are actually shallower relative to their diameter than simple craters because of the way the target rock briefly behaves like a fluid during the impact.",
      },
      {
        wrong: "The Moon's far side is always dark because it never faces the Sun.",
        correct:
          "The far side of the Moon gets just as much sunlight as the near side — it is just never facing Earth. Because the Moon rotates at exactly the same rate it orbits Earth (a condition called tidal locking), the same hemisphere always faces us. During a new Moon, the far side is fully lit by the Sun. The phrase 'dark side of the Moon' refers to being unseen from Earth, not to being in permanent shadow.",
      },
    ],
    teacherUseCases: [
      "Start with the Full Moon preset and set Impact Size to 5 km, then trigger several impacts so students can record crater count and describe how new craters change the visible surface.",
      "Move Impact Size from 1 km to 20 km while keeping Rotation Speed at 0x, then have students compare crater size categories and connect the observations to MS-ESS1-3 data analysis practices.",
      "Use the Mare Imbrium Region preset, then switch to Ancient Highlands while Rotation Speed is slow — students compare basaltic plains with older highland crust and explain why terrain age affects crater density.",
      "Set Rotation Speed to 3x for a quick scan, then reduce it to 0x or 0.5x for evidence collection — students discuss why observation rate matters when interpreting planetary surface data.",
      "Have teams choose one preset, collect surface type, age range, crater count, and impact-size observations, then present a claim about how lunar regions preserve evidence of solar system history.",
    ],
    faq: [
      {
        question: "Why does the Moon have so many more visible craters than Earth?",
        answer:
          "Earth has been bombarded by meteorites throughout its history too, but most evidence has been erased by active geological processes — plate tectonics recycles the crust, water and wind erode crater rims, and vegetation covers the surface. The Moon has none of these erasure mechanisms: no atmosphere means no erosion, no plate tectonics means no crust recycling, and no liquid water means no sediment burial. Craters on the Moon can persist essentially unchanged for billions of years.",
      },
      {
        question: "What are the dark patches on the Moon called and how did they form?",
        answer:
          "The dark patches are called maria (singular: mare), which means 'seas' in Latin — early astronomers mistakenly thought they might be bodies of water. They formed when giant asteroid impacts about 4 billion years ago created enormous basins, and then volcanic lava welled up from the Moon's interior and flooded those basins with dark basaltic rock over the following billion years. The basalt solidified into the flat, smooth dark plains we see today.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation primarily supports MS-ESS1-3, which asks students to analyze and interpret data to determine scale properties of objects in the solar system. It also connects to HS-ESS1-6 by exploring how Earth and the Moon formed and evolved through a history of impacts. The engineering and modeling aspects relate to the practice of using computational models to test how changing variables affects outcomes.",
      },
      {
        question: "What is the difference between a simple and a complex crater?",
        answer:
          "Simple craters are small (typically less than about 15 km in diameter on the Moon) and have a bowl-shaped profile with a raised rim and no interior features. Complex craters are larger and form when the energy is so great that the crater floor briefly rebounds — this creates a central peak or ring, flat terraced walls, and a shallower floor relative to crater width. The Tycho crater (about 85 km wide) is a classic complex crater visible with a backyard telescope.",
      },
      {
        question: "Could a large meteorite impact the Moon today?",
        answer:
          "Yes. Scientists have recorded flashes of light on the Moon from small meteorite impacts through telescopes, and lunar seismometers placed by Apollo missions detected impacts. Larger impacts are rare on human timescales — the solar system has less debris than in its early history — but statistically they still occur. Impact monitoring programs track near-Earth objects to assess any risk to Earth as well as to inform planetary science.",
      },
    ],
  },
};
