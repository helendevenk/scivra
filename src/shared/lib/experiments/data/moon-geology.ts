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
    { id: "impactSize", label: "Meteorite Size", unit: "km", min: 0.1, max: 50, default: 5, step: 0.5, tier: "free" },
    { id: "impactVelocity", label: "Impact Velocity", unit: "km/s", min: 5, max: 70, default: 20, step: 5, tier: "free" },
    { id: "impactAngle", label: "Impact Angle", unit: "°", min: 10, max: 90, default: 45, step: 5, tier: "free" },
  ],
  formulas: [
    { latex: "D \\approx 1.8 \\rho_p^{0.11} \\rho_t^{-1/3} d^{0.78} v^{0.44} g^{-0.22} (\\sin\\theta)^{1/3}", description: "Pi-scaling crater diameter formula relating projectile and target properties" },
  ],
  theory: "The Moon's surface is divided into dark, flat maria (ancient lava plains) and bright, cratered highlands (older crust). Impact craters form when meteorites strike the surface at hypervelocity (10-70 km/s). Crater diameter depends on impactor size, velocity, angle, and target properties. Simple craters (<15 km) are bowl-shaped; complex craters have central peaks. The largest impacts created multi-ring basins. The Moon has no atmosphere or plate tectonics, so craters are preserved for billions of years. Lunar rock types include anorthosite (highlands), basalt (maria), and breccia (mixed impact debris).",
  instructions: "Click on the lunar surface to create impact craters. Adjust meteorite size, velocity, and angle to see how they affect crater dimensions. Examine the cross-section view to see crater structure.",
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
  contentSections: {
    whatIsIt:
      "The Moon is Earth's closest neighbor and one of the most studied worlds in the solar system — yet its surface looks almost nothing like our own. Instead of forests and oceans, the Moon is covered in craters, ancient lava plains, and jagged mountain ranges, all preserved in near-perfect condition for billions of years. Two main terrain types dominate: the dark, flat maria (from the Latin word for 'seas') are ancient lava flows that filled huge impact basins roughly 3 to 4 billion years ago. The bright, heavily cratered highlands are older, original crust that dates back to the Moon's early formation. Because the Moon has no atmosphere to burn up incoming space rocks and no water or plate tectonics to erode or recycle the surface, every impact leaves a mark that remains visible for billions of years. By studying crater shapes and sizes, scientists can estimate the age of different lunar regions and reconstruct the history of collisions throughout the inner solar system. This simulation lets you launch your own meteorites and explore how impact size, speed, and angle shape the craters left behind.",
    parameterExplanations: {
      impactSize:
        "Sets the diameter of the incoming meteorite in kilometers, ranging from a small 0.1 km rock fragment to a massive 50 km body. Larger impactors carry much more energy and produce larger craters. The relationship is not one-to-one — doubling impactor size greatly increases impact energy, but crater diameter grows less than proportionally (about 1.7×) because of how energy distributes through the target rock.",
      impactVelocity:
        "Controls how fast the meteorite is traveling when it strikes the surface, from a minimum of 5 km/s up to 70 km/s. Actual meteorite impacts in the solar system typically range from about 10 to 70 km/s — far faster than any human-made projectile. Higher velocity dramatically increases the energy delivered and produces wider, shallower craters relative to impactor size.",
      impactAngle:
        "Sets the angle of the incoming meteorite relative to the lunar surface, from a grazing 10 degrees to a direct 90-degree vertical strike. Most natural impacts in the solar system hit at angles between 30 and 60 degrees. Very low angles produce elongated or elliptical craters rather than circular ones, and can create distinctive rays of ejected material that streak across the surface.",
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
          "Crater depth does increase with impactor energy, but the relationship between depth and diameter changes with crater size. Simple small craters are bowl-shaped and relatively deep, but complex large craters (typically over about 15 km in diameter) develop flat floors, central peaks, and terraced walls — they are actually shallower relative to their diameter than simple craters because of the way the target rock briefly behaves like a fluid during the impact.",
      },
      {
        wrong: "The Moon's far side is always dark because it never faces the Sun.",
        correct:
          "The far side of the Moon gets just as much sunlight as the near side — it is just never facing Earth. Because the Moon rotates at exactly the same rate it orbits Earth (a condition called tidal locking), the same hemisphere always faces us. During a new Moon, the far side is fully lit by the Sun. The phrase 'dark side of the Moon' refers to being unseen from Earth, not to being in permanent shadow.",
      },
    ],
    teacherUseCases: [
      "Set impactSize to 5 km and impactVelocity to 20 km/s, then gradually increase impactAngle from 10 to 90 degrees — students observe the transition from elongated to circular craters and infer that most natural craters appear circular because low-angle impacts are statistically rarer.",
      "Hold impactAngle at 45 degrees and impactVelocity at 20 km/s, then vary impactSize from 0.1 to 50 km — students record crater diameter at each step and plot the data to see that the size relationship is non-linear, supporting MS-ESS1-3 data analysis practices.",
      "Set impactSize to 20 km and impactVelocity to 50 km/s to create a large complex crater, then have students compare its flat floor and central peak to images of simple small craters — introduces the concept that different physical processes dominate at different scales.",
      "After students have explored freely, ask them to recreate a specific crater diameter by adjusting all three parameters — emphasizes that multiple combinations of size, speed, and angle can produce similar outcomes, mirroring real challenges in planetary science.",
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
