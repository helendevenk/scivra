import type { Experiment } from "@/shared/types/experiment";

export const k5Magnetism: Experiment = {
  id: "k5-magnetism",
  slug: "k5-magnetism",
  title: "Magnetism & Magnetic Fields",
  subtitle: "Attract, repel, and explore invisible magnetic forces",
  description:
    "Place magnets and watch magnetic field lines appear around them. Bring opposite poles together to see attraction; same poles to see repulsion. Test which materials are attracted to magnets and which are not. Explore Earth's magnetic field and how compasses work.",
  thumbnail: "/imgs/experiments/k5-magnetism.png",

  standards: {
    ngss: ["3-PS2-3", "3-PS2-4", "MS-PS2-5"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "electricity",
  subject: "physics",
  gradeLevel: "3-5",
  tags: ["magnetism", "magnetic field", "poles", "attract repel", "compass", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "magnet1Strength",
      label: "Magnet 1 Strength",
      unit: "T",
      min: 0.1,
      max: 2,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "magnet2Polarity",
      label: "Magnet 2 Polarity (0=Same, 1=Opposite)",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "distance",
      label: "Distance Between Magnets",
      unit: "cm",
      min: 1,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "showEarth",
      label: "Show Earth's Field (0=No, 1=Yes)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "F \\propto \\frac{m_1 m_2}{r^2} \\quad (\\text{magnetic force})",
      description: "Magnetic force decreases with the square of distance",
    },
    {
      latex: "\\text{N seeks S} \\quad \\text{(opposites attract, like poles repel)}",
      description: "Opposite magnetic poles attract; same poles repel",
    },
  ],

  theory:
    "Magnetism is a force produced by moving electric charges. All magnets have two poles: North (N) and South (S). Opposite poles attract each other; like poles repel each other. You cannot separate the poles — if you cut a magnet in half, each half becomes a new magnet with its own N and S pole. Magnetic fields are invisible regions of force that surround magnets, shown by field lines that go from N to S. Only certain materials (iron, nickel, cobalt, and their alloys) are attracted to magnets — these are called ferromagnetic materials. Earth itself behaves like a giant bar magnet, which is why compasses point north. The geographic North Pole is actually near Earth's magnetic South Pole (compass needles are attracted to it).",

  instructions:
    "Arrange the two magnets and watch the field lines appear. Set Polarity to Opposite — see the field lines connect between poles (attraction). Set to Same — field lines push away from each other (repulsion). Drag the distance slider and watch the force change. Enable Earth's Field (Pro) to see how a compass needle aligns.",

  challenges: [
    {
      id: "mag-c1",
      question: "If you cut a bar magnet in half, do you get one North pole piece and one South pole piece?",
      hint: "No! Each half becomes a complete magnet with its own North and South poles. You can never have a magnetic monopole — magnets always come in N-S pairs. Even at the atomic level, each iron atom is a tiny dipole magnet.",
      tier: "free",
    },
    {
      id: "mag-c2",
      question: "A compass always points toward geographic north. Is geographic north the same as magnetic north?",
      hint: "No — they're different. Geographic (true) North is Earth's rotational axis. Magnetic North is where Earth's magnetic field lines point down, which is near but not at the North Pole. The difference (declination) varies by location and changes slowly over time.",
      tier: "free",
    },
    {
      id: "mag-c3",
      question: "Why is iron attracted to magnets but aluminum is not?",
      hint: "Iron is ferromagnetic — its atoms have unpaired electrons that create tiny magnetic domains. When near a magnet, these domains align, making iron magnetic. Aluminum has no unpaired electrons available for this alignment, so it is non-magnetic.",
      tier: "free",
    },
    {
      id: "mag-c4",
      question: "If the magnetic force between two magnets doubles when the distance is halved, what type of relationship is this?",
      hint: "F ∝ 1/r² — an inverse square relationship. Halving distance (×½) quadruples force (×4). This is the same relationship as gravity and electric force — all follow the inverse square law at the macroscopic level.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-force-motion", "lorentz-force", "electric-field-lines"],

  seoTitle: "Magnetism for Kids | Magnetic Field Interactive | Scivra Elementary",
  seoKeywords: [
    "magnetism kids simulation",
    "magnetic field lines interactive",
    "attract repel magnets elementary",
    "K-5 physics magnetism",
    "compass magnetic north kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Magnetism and Magnetic Fields",
  },
  contentSections: {
    whatIsIt:
      "Have you ever stuck a magnet to your refrigerator or picked up a paper clip with a magnet? Magnets have an invisible pushing and pulling force called magnetism! Every magnet has two ends called poles — a North pole and a South pole. When you bring two opposite poles near each other (North toward South), they snap together like best friends hugging. When you bring two same poles near each other (North toward North or South toward South), they push away like grumpy strangers who do not want to be close. This is called attraction and repulsion. The invisible force around a magnet is called a magnetic field. You cannot see it with your eyes, but you can feel it — and in this simulation you can see the field lines that show where the force reaches. Not everything sticks to a magnet. Only objects made of iron, steel, nickel, or cobalt feel the pull. Gold, plastic, wood, and aluminum do not care about magnets at all. Earth is actually one giant magnet — that is why compass needles always point roughly toward the North Pole! The Earth's magnetic field helps deflect charged particles from the Sun (solar wind); Earth's atmosphere also blocks much of the Sun's harmful radiation.",
    parameterExplanations: {
      magnet1Strength:
        "This slider controls how powerful the first magnet is, from 0.1 T up to 2 T (a strong science-lab magnet). A stronger magnet pulls or pushes with much more force and its field reaches farther. Watch the field lines get brighter and more spread out as you increase strength. For comparison, a real refrigerator magnet is only about 0.005 T — 0.1 T is already much stronger than a typical fridge magnet, and this simulation lets you explore even stronger ones!",
      magnet2Polarity:
        "This switch controls whether the second magnet faces the same way or the opposite way as the first magnet. Setting 0 means Same poles facing each other — they push apart (repulsion). Setting 1 means Opposite poles facing each other — they pull together (attraction). Watch the field lines change: opposite poles have lines that connect and curve between the magnets, while same poles have lines that curve away from each other.",
      distance:
        "This slider moves the two magnets closer together or farther apart, from 1 cm (nearly touching) to 20 cm (far apart). Magnetic force gets much weaker very quickly as distance grows. In this simplified model, doubling the distance makes the force drop to about one quarter of what it was (though the exact relationship for real magnets is more complex than a simple inverse-square). Try setting a strong magnet and then sliding the distance from 1 cm to 20 cm to feel how fast the force fades.",
      showEarth:
        "This Pro setting overlays Earth's own magnetic field on the simulation. Earth's field is like a giant bar magnet buried in the planet's core. Turning this on shows how a compass needle — which is just a tiny magnet — lines up with Earth's field and always points roughly toward the geographic North Pole. It is a great way to see why compasses work!",
    },
    misconceptions: [
      {
        wrong: "All metals are attracted to magnets.",
        correct:
          "Only metals that contain iron, nickel, or cobalt are attracted to magnets — these are called magnetic metals. Gold, silver, copper, aluminum, and most coins are not attracted to magnets at all. You can test this at home: a fridge magnet will stick to a steel pot but will slide right off an aluminum can or a copper penny. Next time someone says 'it is metal so it will stick,' you can test and find out!",
      },
      {
        wrong: "You can separate a magnet's North pole from its South pole by cutting it in half.",
        correct:
          "If you cut a magnet in half, you do NOT get one North piece and one South piece — you get two smaller magnets, each with their own North and South poles! No matter how many times you cut a magnet, every piece will always have both a North and a South pole. Scientists call this a dipole. You can never have a magnet with only one pole, no matter how small you cut it — all the way down to individual atoms, each tiny piece is still a two-pole magnet.",
      },
      {
        wrong: "Magnets only work when they are touching something.",
        correct:
          "Magnets can push and pull things without touching them at all — that is what makes them so special and a little magical! The magnetic force reaches through space (and through some materials like paper and cardboard). A strong magnet can pick up a paper clip from several centimeters away. The force does get weaker as the distance increases, but it is still there. This is called action at a distance, and it is the same idea as gravity pulling things without touching.",
      },
      {
        wrong: "The geographic North Pole and the magnetic North Pole are the same place.",
        correct:
          "They are close but not the same! Geographic North is Earth's rotational axis — the point where all the longitude lines meet. Magnetic North is a moving point near the geographic North Pole where Earth's magnetic field points straight down. It is currently located in the Arctic Ocean and drifts over time as Earth's liquid iron core shifts. This difference is called magnetic declination, and hikers and sailors must account for it when navigating with a compass.",
      },
    ],
    teacherUseCases: [
      "Attract vs. repel exploration: set magnet2Polarity to 1 (Opposite) and magnet1Strength to 1 T — students sketch the field lines they see. Then switch to 0 (Same) and sketch again. Compare and discuss 'friendly poles' vs. 'grumpy poles' in K5 language (NGSS 3-PS2-3).",
      "Distance and force: keep polarity at Opposite and strength at 1.5 T, then sweep distance from 2 cm to 16 cm. Students predict whether force doubles or changes faster as distance doubles — building evidence for the inverse square relationship (NGSS 3-PS2-4).",
      "Magnetic materials sort: before the simulation, give students a set of small items (paper clip, coin, aluminum foil, iron nail, plastic button, steel spoon) and a magnet to sort into 'sticks' and 'does not stick.' Then use the simulation to discuss why — only iron-family metals respond.",
      "Compass and Earth (Pro): enable showEarth and ask students why a compass needle always points the same way no matter where you put it. Relate Earth's field to the bar magnet in the simulation. Discuss how explorers used compasses before GPS existed.",
      "Misconception probe — 'all metals stick': give a quick prediction poll before the lab asking which items stick to a magnet. Students often include gold, copper, and aluminum coins. Use the physical magnet test and then the simulation field visualization to explain why only iron-family metals respond.",
    ],
    faq: [
      {
        question: "Why do some things stick to magnets and others do not?",
        answer:
          "Inside magnetic materials like iron and steel, tiny groups of atoms called magnetic domains all point in the same direction, making the whole material act like a bunch of tiny magnets lined up together. When a magnet comes near, these domains get pulled into alignment and the material becomes temporarily magnetic itself — that is what pulls it toward the magnet. In non-magnetic materials like gold, copper, plastic, and wood, the atomic structure does not have these alignable domains, so the magnet's field has nothing to grab onto. You can easily test this at home: try your fridge magnet on different surfaces and see what sticks and what slides off.",
      },
      {
        question: "Can you make a magnet lose its magnetism?",
        answer:
          "Yes! If you heat a magnet to a very high temperature (called the Curie temperature for that metal), the magnetic domains get scrambled and the magnet loses its power. Dropping or banging a magnet hard can also disrupt the domains and weaken it over time. This is why it is not a good idea to throw magnets around! Electromagnets (magnets powered by electricity) can be switched on and off, which is how junkyards sort scrap metal — a giant electromagnet picks up steel cars and drops them by turning off the electricity.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports NGSS 3-PS2-3, which asks students to explore the cause-and-effect relationship of electric and magnetic forces on objects, and 3-PS2-4, which asks students to identify situations where magnets exert forces even though they are not in direct contact. The distance parameter directly demonstrates PS2-4's concept of action at a distance. The polarity switch and field line visualization support PS2-3 by making the invisible force visible and testable. The Pro Earth field overlay also introduces ideas that extend toward MS-PS2-5 (magnetic fields) for advanced exploration.",
      },
      {
        question: "How does a compass work?",
        answer:
          "A compass needle is just a very thin, lightweight magnet balanced so it can spin freely. Like all magnets, its North pole is attracted to the South pole of Earth's magnetic field. Earth's magnetic South pole is located near the geographic North Pole — which is why the compass needle's North end points toward geographic north. The needle lines up with Earth's invisible magnetic field lines, which run roughly from south to north across the planet's surface. Before GPS satellites existed, sailors and explorers used compasses to navigate across oceans and through forests. Compass technology is over 2,000 years old!",
      },
      {
        question: "What would happen if you brought two North poles very close together?",
        answer:
          "They would push against each other harder and harder the closer they got — you would feel the pushing force in your hands if you tried to hold them together. In the simulation you can set magnet2Polarity to 0 (Same poles) and slide the distance slider down to 1 cm to see the repulsion at its strongest. The field lines visually curve away from each other, showing that the magnetic force is pushing outward instead of pulling inward. In real life, strong same-pole magnets can be very hard to push together — some powerful laboratory magnets need machines to push their same poles close!",
      },
    ],
  },
};
