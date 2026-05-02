import type { Experiment } from "@/shared/types/experiment";

export const msPlateTectonics: Experiment = {
  id: "ms-plate-tectonics",
  slug: "ms-plate-tectonics",
  title: "Plate Tectonics",
  subtitle: "Continental drift, earthquakes, volcanoes, and mountain building",
  description:
    "Move tectonic plates and watch the consequences: convergent boundaries create mountains and trenches; divergent boundaries form rift valleys and mid-ocean ridges; transform boundaries cause earthquakes. See Pangaea break apart and watch modern geography form over millions of years.",
  thumbnail: "/imgs/experiments/ms-plate-tectonics.png",

  standards: {
    ngss: ["MS-ESS2-2", "MS-ESS2-3", "MS-ESS3-2"],
    gcse: ["P6.1"],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: ["plate tectonics", "earthquakes", "volcanoes", "continental drift", "convergent divergent", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "boundaryType",
      label: "Boundary (0=Convergent, 1=Divergent, 2=Transform)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "plateSpeed",
      label: "Plate Speed",
      unit: "cm/yr",
      min: 0.1,
      max: 20,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "timescale",
      label: "Time (millions of years)",
      unit: "Myr",
      min: 0,
      max: 250,
      default: 0,
      step: 10,
      tier: "pro",
    },
    {
      id: "showPangaea",
      label: "Start from Pangaea (0=No, 1=Yes)",
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
      latex: "\\text{Speed} \\approx 2-10\\,\\text{cm/yr} \\approx 1-5\\,\\text{in/yr}",
      description: "Tectonic plates move at about the speed your fingernails grow",
    },
    {
      latex: "\\text{Convergent} \\to \\text{mountains/trench} \\quad \\text{Divergent} \\to \\text{rift/ridge}",
      description: "Boundary type determines geological features",
    },
  ],

  theory:
    "Earth's outer shell (lithosphere) is divided into about 15 major tectonic plates that ride over the mostly solid but slowly flowing, plastic asthenosphere. These plates move 2-10 cm per year driven by convection currents in the mantle. Convergent boundaries (plates collide): continental-continental creates mountain ranges (Himalayas); oceanic-continental creates subduction zones, ocean trenches, and volcanoes; oceanic-oceanic creates island arcs. Divergent boundaries (plates separate): creates rift valleys (East Africa) on land, mid-ocean ridges under the sea (seafloor spreading). Transform boundaries (plates slide past each other): creates strike-slip faults and earthquakes (San Andreas Fault). About 250 million years ago, all continents were joined in one supercontinent called Pangaea, which has since broken apart.",

  instructions:
    "Choose a boundary type and watch the animation. Convergent: watch mountains build or crust subduct into the mantle. Divergent: watch the gap widen and magma fill it. Transform: watch earthquakes occur along the fault line. Use the Timescale slider (Pro) to watch millions of years of plate movement in seconds. Enable Pangaea to watch continental drift.",

  challenges: [
    {
      id: "pt-ms-c1",
      question: "Why do volcanoes and earthquakes cluster along specific zones on Earth?",
      hint: "They cluster along tectonic plate boundaries — where plates collide, separate, or slide past each other. The Pacific 'Ring of Fire' is the boundary of the Pacific Plate, responsible for ~90% of earthquakes and many volcanoes.",
      tier: "free",
    },
    {
      id: "pt-ms-c2",
      question: "How do we know that all the continents were once joined together?",
      hint: "Multiple lines of evidence: 1) Puzzle-piece fit of coastlines (especially Africa and South America). 2) Same fossil species found on now-separated continents. 3) Matching geological formations across ocean gaps. 4) Magnetic striping on the ocean floor showing seafloor spreading.",
      tier: "free",
    },
    {
      id: "pt-ms-c3",
      question: "Why does oceanic crust subduct under continental crust at convergent boundaries?",
      hint: "Oceanic crust is denser than continental crust (basalt ~3.0 g/cm³ vs. granite ~2.7 g/cm³). At convergent boundaries, the denser oceanic plate sinks below the lighter continental plate (subduction). As it sinks, it melts and can form volcanoes above.",
      tier: "free",
    },
    {
      id: "pt-ms-c4",
      question: "If the Atlantic Ocean grows ~2.5 cm per year, how wide will it be in 10 million years?",
      hint: "Width increase = 2.5 cm/yr × 10,000,000 yr = 25,000,000 cm = 250 km wider. The Atlantic is currently ~7,000 km wide, so it would be ~7,250 km in 10 million years.",
      tier: "pro",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 14,
  relatedExperiments: ["k5-day-night-seasons", "k5-water-cycle"],

  seoTitle: "Plate Tectonics Simulation Middle School | Scivra Earth Science",
  seoKeywords: [
    "plate tectonics middle school simulation",
    "continental drift interactive",
    "earthquake volcano plate boundary",
    "Pangaea simulation 6-8",
    "convergent divergent transform boundary",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Plate Tectonics and Earth's Dynamic Systems",
  },
  contentSections: {
    whatIsIt:
      "Earth's outer shell is not one solid piece — it is broken into roughly 15 major sections called tectonic plates, like the cracked shell of a hard-boiled egg. These plates ride over the mostly solid but slowly flowing, plastic asthenosphere, and they move slowly but continuously, driven by slow-churning heat currents deep in the mantle — similar to how heating soup from below causes the liquid to circulate. Most plates move about 2 to 10 centimeters per year, roughly the rate your fingernails grow. Slow as that sounds, over millions of years it is enough to open oceans, build mountain ranges, and carry continents across the globe. Where plates meet, dramatic things happen. Plates colliding head-on build mountains or push ocean floor down into the mantle. Plates pulling apart create rift valleys or mid-ocean ridges where new crust forms. Plates grinding sideways past each other produce faults and earthquakes. About 250 million years ago all the continents were joined into one giant landmass called Pangaea, and the world map you recognize today is simply the result of where those plates have drifted since.",
    parameterExplanations: {
      boundaryType:
        "Selects which type of plate boundary to visualize: 0 for convergent (plates moving toward each other), 1 for divergent (plates moving apart), or 2 for transform (plates sliding sideways past each other). Each boundary type produces a distinct set of geological features — mountains and trenches at convergent boundaries, rift valleys and ridges at divergent boundaries, and strike-slip faults at transform boundaries.",
      plateSpeed:
        "Sets how fast the plates are moving relative to each other, from a slow 0.1 cm/yr to a geologically rapid 20 cm/yr. Real tectonic plates typically move between 2 and 10 cm/yr. Increasing speed in the simulation compresses the time needed to observe significant geological changes and makes the effects at the boundary more visually obvious.",
      timescale:
        "A Pro feature that advances time in millions of years (0 to 250 Myr), allowing you to watch the slow accumulation of continental drift, mountain building, or seafloor spreading over geological timescales. At 250 million years, the simulation can show the breakup of Pangaea and the formation of the modern continents.",
      showPangaea:
        "A Pro feature that resets the continental positions to Pangaea when set to 1, allowing you to watch continental drift from the supercontinent configuration forward in time. Set to 0 to start from the present-day arrangement of continents.",
    },
    misconceptions: [
      {
        wrong: "Earthquakes and volcanoes happen randomly all over Earth.",
        correct:
          "Earthquakes and volcanoes are concentrated along tectonic plate boundaries — not scattered at random. The Pacific Ring of Fire is a horseshoe-shaped zone around the Pacific Ocean where the Pacific Plate and several neighboring plates meet and interact, and it accounts for roughly 90 percent of the world's earthquakes and a large share of its volcanoes. Mapping earthquake and volcano locations was one of the key pieces of evidence that convinced scientists that plate tectonics is real.",
      },
      {
        wrong: "The continents float directly on liquid magma.",
        correct:
          "Continents and ocean floors together make up the lithosphere, which includes the crust and the very top of the mantle. The lithosphere rides on the asthenosphere, which is mostly solid rock that behaves plastically — like very stiff putty — over millions of years. It is not a liquid ocean of magma. Magma only forms where conditions cause rocks to partially melt, such as at subduction zones or hotspots.",
      },
      {
        wrong: "Transform boundaries are the least dangerous because plates just slide past each other.",
        correct:
          "Transform boundaries are responsible for some of Earth's most destructive earthquakes. The San Andreas Fault in California is a transform boundary where the Pacific Plate slides northwest past the North American Plate. When the two plates lock up and then suddenly release stored stress, it produces major earthquakes. The 1906 San Francisco earthquake and the 1989 Loma Prieta earthquake both occurred on transform fault systems.",
      },
      {
        wrong: "Mountains only form where continents collide.",
        correct:
          "Continental collisions do build some of the highest mountain ranges — the Himalayas formed and are still forming where the Indian subcontinent is colliding with Asia. But mountains also form at subduction zones where oceanic crust dives under continental crust, forcing the continental edge upward. The Andes in South America formed this way. Mid-ocean ridges are also technically mountains, rising 2 to 3 km above the ocean floor along divergent boundaries.",
      },
    ],
    teacherUseCases: [
      "Set boundaryType to 0 (convergent) and plateSpeed to 5 cm/yr, then watch the animation and ask students to identify whether it shows an oceanic-continental or continental-continental collision — introduces the idea that the same boundary type produces different outcomes depending on the density of the colliding plates.",
      "Cycle through all three boundaryType values at a fixed plateSpeed of 2 cm/yr and have students sketch a labeled diagram for each — the three sketches together build a visual comparison chart that directly supports MS-ESS2-2 and MS-ESS2-3.",
      "Set boundaryType to 1 (divergent) and gradually increase plateSpeed from 0.1 to 15 cm/yr — students observe how faster spreading produces more magma output and discuss the connection between seafloor spreading rate and ocean basin growth over time.",
      "Before using the simulation, have students lay tracing paper over a world map and cut out continent shapes, then physically try to fit them together — afterwards open the simulation with showPangaea set to 1 and compare their reconstructions to the Pangaea starting position, connecting their hands-on inference to the scientific model.",
    ],
    faq: [
      {
        question: "What drives tectonic plates to move?",
        answer:
          "The main driver is heat from Earth's interior, generated both by leftover heat from the planet's formation and from the ongoing radioactive decay of elements like uranium and thorium in the mantle. This heat drives slow convection currents in the mantle rock — hot material rises, spreads, cools, and sinks in enormous loops that drag the lithospheric plates along. Slab pull — the weight of a dense sinking slab at a subduction zone — is also thought to be a significant force pulling plates apart at mid-ocean ridges.",
      },
      {
        question: "How do we know Pangaea was real if no one was alive to see it?",
        answer:
          "Multiple independent lines of evidence support the existence of Pangaea. The coastlines of South America and Africa fit together like puzzle pieces. Identical fossils of the freshwater reptile Mesosaurus are found on both continents — it could not have swum the Atlantic Ocean. Matching geological rock formations and ancient mountain belts line up across the continental gap. Magnetic striping preserved in seafloor rock records the history of seafloor spreading symmetrically away from mid-ocean ridges. Together these lines of evidence converge on the same conclusion.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports MS-ESS2-2 (construct an explanation based on evidence for how geoscience processes change Earth's surface at varying scales) and MS-ESS2-3 (analyze and interpret data on the distribution of fossils and rocks, continental shapes, and seafloor structures to provide evidence of past plate motions). It also relates to MS-ESS3-2 by connecting plate boundary locations to natural hazard distributions such as earthquakes and volcanoes.",
      },
      {
        question: "Could a new supercontinent form in the future?",
        answer:
          "Yes — plate tectonics has produced supercontinents before and will likely do so again. Scientists have proposed several possible future configurations. One scenario, sometimes called Amasia, suggests the Americas may continue drifting westward and eventually collide with Asia across the Pacific. Another scenario, Pangaea Proxima, suggests the Atlantic may close as the Americas drift back toward Europe and Africa. These events would unfold over hundreds of millions of years from now.",
      },
      {
        question: "Why is the ocean floor younger than the continents?",
        answer:
          "New ocean floor is continuously created at mid-ocean ridges where plates pull apart and magma wells up to fill the gap, then solidifies into fresh basalt. As the plates spread, the older seafloor is carried away from the ridge and eventually reaches a subduction zone where it sinks back into the mantle and melts — recycling the rock. The oldest ocean floor is only about 180 to 200 million years old. Continental crust is much lighter and resists subduction, so it accumulates over billions of years — the oldest continental rocks are over 4 billion years old.",
      },
    ],
  },
};
