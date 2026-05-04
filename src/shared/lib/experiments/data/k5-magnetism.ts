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
      id: "strength",
      label: "Magnet Strength",
      unit: "",
      min: 1,
      max: 10,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "position",
      label: "Magnet Position",
      unit: "",
      min: 2,
      max: 12,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "current",
      label: "Electric Current",
      unit: "",
      min: 0,
      max: 10,
      default: 3,
      step: 0.5,
      tier: "free",
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
    "Use the Strength slider to make the magnet stronger or weaker. Move the Position slider to place the magnet closer to different parts of the field. Use the Current slider to turn an electromagnet coil up or down. Try the Bar Magnet, Electromagnet coil, and Compass Navigation presets to compare field lines, coil magnetism, and compass direction.",

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
  htmlControlAliases: { strength: "sl-str", position: "sl-pos", current: "sl-curr" },
  presets: [
    {
      id: "bar",
      label: "Bar Magnet",
      description: "Shows a simple magnet with field lines curving from one pole to the other.",
    },
    {
      id: "electro",
      label: "Electromagnet coil",
      description: "Shows how electric current in a coil can make a magnetic field.",
    },
    {
      id: "compass",
      label: "Compass Navigation",
      description: "Shows a compass needle turning to line up with the magnetic field.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Have you ever stuck a magnet to your refrigerator or picked up a paper clip with a magnet? Magnets have an invisible pushing and pulling force called magnetism! Every magnet has two ends called poles — a North pole and a South pole. When you bring two opposite poles near each other (North toward South), they snap together like best friends hugging. When you bring two same poles near each other (North toward North or South toward South), they push away like grumpy strangers who do not want to be close. This is called attraction and repulsion. The invisible force around a magnet is called a magnetic field. You cannot see it with your eyes, but you can feel it — and in this simulation you can see the field lines that show where the force reaches. Not everything sticks to a magnet. Only objects made of iron, steel, nickel, or cobalt feel the pull. Gold, plastic, wood, and aluminum do not care about magnets at all. Earth is actually one giant magnet — that is why compass needles always point roughly toward the North Pole! The Earth's magnetic field helps deflect charged particles from the Sun (solar wind); Earth's atmosphere also blocks much of the Sun's harmful radiation.",
    parameterExplanations: {
      strength:
        "Strength changes how powerful the magnet is. A low strength makes a small, gentle field. A high strength makes the field lines reach farther and look stronger. Try starting in the middle, then move the slider one step at a time. Watch what changes before you move it again. Ask: do the lines spread out, get brighter, or pull the compass more? This helps students connect a number on a slider with evidence they can see and explain in their own words.",
      position:
        "Position moves the magnet to a new place in the scene. When the magnet moves, the field moves with it because the field belongs to the magnet. Slide it slowly from one side to the other and watch how the field lines shift. Put the magnet near the compass, then farther away. The compass should react more when it is closer to the field. This is a simple way to see that magnetic forces can act across space, even when objects are not touching.",
      current:
        "Current controls the electricity in the electromagnet coil. When current is low, the coil makes a weak magnetic field. When current is high, the coil acts more like a strong magnet. Set the Electromagnet coil preset, then move only this slider. Students can see that electricity can make magnetism. A good test is to turn current down, observe, then turn it up and compare the field lines. This keeps the investigation focused on one cause and one visible effect.",
    },
    misconceptions: [
      {
        wrong: "All metals are attracted to magnets.",
        correct:
          "Only some metals are attracted to magnets. Iron, steel, nickel, and cobalt can stick to a magnet. Many other metals, like aluminum, copper, silver, and gold, usually do not stick. A soda can or a copper penny may look like it should stick because it is metal, but it will not act like iron. Scientists test materials instead of guessing. In class, students can sort objects into 'sticks' and 'does not stick' groups and use their observations as evidence.",
      },
      {
        wrong: "You can separate a magnet's North pole from its South pole by cutting it in half.",
        correct:
          "If you cut a magnet in half, you do not get one North-only piece and one South-only piece. You get two smaller magnets. Each smaller magnet still has a North pole and a South pole. Cutting again makes even smaller magnets, but each piece still has two poles. A magnet is like a two-ended team: the ends stay together. This is why students should draw both poles on every magnet piece, even a tiny piece.",
      },
      {
        wrong: "Magnets only work when they are touching something.",
        correct:
          "Magnets can push or pull without touching. The space around a magnet has a magnetic field. That field can reach through air and through thin materials like paper. A paper clip can jump toward a strong magnet before the magnet touches it. The pull gets weaker when the object is farther away, but the field can still be there. This helps students understand a force that acts at a distance.",
      },
      {
        wrong: "A compass needle points north because it wants to point at the map label.",
        correct:
          "A compass needle points because it is a tiny magnet. Earth has a magnetic field, and the needle turns until it lines up with that field. The compass does not read words on a map and it does not know where a person wants to go. It reacts to magnetism. That is why a magnet held too close to a compass can make the needle turn the wrong way for navigation.",
      },
    ],
    teacherUseCases: [
      "Begin with the Bar Magnet preset. Ask students to move the Strength slider from low to high, record one observation at each setting, and describe how field-line evidence changes. Connect observations to NGSS 3-PS2-3.",
      "Use the Position slider as a proximity investigation. Students predict what will happen when the magnet is moved closer to a compass or test object, then compare the visible result with their prediction. Connect this to NGSS 3-PS2-4.",
      "Switch to the Electromagnet coil preset. Keep Position and Strength steady while students change only Current. Have them explain how electricity can produce a magnetic effect using claim-evidence-reasoning language.",
      "Use the Compass Navigation preset for a navigation mini-lesson. Students observe how the compass needle lines up with the field, then discuss why real compasses must be kept away from strong classroom magnets.",
      "Run a materials-sorting station before the digital activity. Students test paper clips, foil, coins, plastic, and steel objects, then use the simulation to explain why only some materials respond strongly to magnetic fields.",
    ],
    faq: [
      {
        question: "Why do some things stick to magnets and others do not?",
        answer:
          "Some materials have tiny magnetic parts inside that can line up with a magnet. Iron and steel are common examples. When those tiny parts line up, the object is pulled toward the magnet. Other materials, such as wood, plastic, copper, and aluminum, do not line up in the same strong way, so they usually do not stick. The best way to know is to test. Try safe classroom objects and sort them by what sticks and what does not.",
      },
      {
        question: "Can you make a magnet lose its magnetism?",
        answer:
          "Yes. A magnet can become weaker if it gets very hot, is hit hard many times, or is stored in a poor way. Those things can scramble the tiny magnetic parts inside. An electromagnet is different because it uses electric current. When the current is on, it can act like a magnet. When the current is off, the magnetic effect becomes much weaker or stops. That is why the Current slider is useful in the coil preset.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports NGSS 3-PS2-3 and 3-PS2-4. Students can observe how magnets push and pull, compare stronger and weaker magnetic fields, and see that magnetic forces can act even when objects are not touching. The compass view also gives a simple bridge toward MS-PS2-5 for students who are ready to think about magnetic fields as invisible regions around magnets and electric currents.",
      },
      {
        question: "How does a compass work?",
        answer:
          "A compass needle is a tiny magnet that can spin. It turns until it lines up with the magnetic field around it. Earth has a magnetic field, so a compass can help people find direction. A nearby magnet can also pull on the compass needle and make it turn. That is why scientists and explorers keep compasses away from strong magnets when they want a useful direction reading.",
      },
      {
        question: "What happens when electric current moves through a coil?",
        answer:
          "Moving electric current can make magnetism. In a coil, the wire loops help the magnetic field add together, so the coil can act like a magnet. More current usually makes a stronger magnetic effect in this model. Try the Electromagnet coil preset. Move the Current slider down, observe the field lines, then move it up and compare. This shows that electricity and magnetism are connected.",
      },
    ],
  },
};
