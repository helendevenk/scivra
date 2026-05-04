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
      id: "convergenceRate",
      label: "Convergence Rate",
      unit: "x0.1 cm/yr",
      min: 1,
      max: 50,
      default: 25,
      step: 1,
      tier: "free",
    },
    {
      id: "densityContrast",
      label: "Density Contrast",
      unit: "",
      min: 1,
      max: 10,
      default: 5,
      step: 1,
      tier: "free",
    },
    {
      id: "viscosity",
      label: "Mantle Viscosity",
      unit: "",
      min: 1,
      max: 5,
      default: 3,
      step: 1,
      tier: "free",
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
    "Use the Convergence Rate slider to speed up or slow down plate motion, the Density Contrast slider to compare which plate tends to sink, and the Mantle Viscosity slider to set the intended mantle-flow resistance. Try the Mid-Ocean Ridge, Cascadia Subduction, and San Andreas Transform presets to compare divergent, convergent, and transform boundary cases.",

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
  htmlControlAliases: { convergenceRate: "sl-conv", densityContrast: "sl-dens", viscosity: "sl-visc" },
  presets: [
    {
      id: "ridge",
      label: "Mid-Ocean Ridge (Divergent)",
      description:
        "Shows plates pulling apart at a ridge, with moderate convection speed and low density contrast to emphasize seafloor spreading and new crust formation.",
    },
    {
      id: "subduct",
      label: "Cascadia Subduction",
      description:
        "Shows a convergent margin with faster plate motion and high density contrast, emphasizing subduction, trench formation, volcanoes, and earthquake hazards.",
    },
    {
      id: "transform",
      label: "San Andreas Transform",
      description:
        "Shows plates sliding past one another with moderate-fast motion and low density contrast, emphasizing transform fault motion and shallow earthquakes.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Earth's outer shell is not one solid piece — it is broken into roughly 15 major sections called tectonic plates, like the cracked shell of a hard-boiled egg. These plates ride over the mostly solid but slowly flowing, plastic asthenosphere, and they move slowly but continuously, driven by slow-churning heat currents deep in the mantle — similar to how heating soup from below causes the liquid to circulate. Most plates move about 2 to 10 centimeters per year, roughly the rate your fingernails grow. Slow as that sounds, over millions of years it is enough to open oceans, build mountain ranges, and carry continents across the globe. Where plates meet, dramatic things happen. Plates colliding head-on build mountains or push ocean floor down into the mantle. Plates pulling apart create rift valleys or mid-ocean ridges where new crust forms. Plates grinding sideways past each other produce faults and earthquakes. About 250 million years ago all the continents were joined into one giant landmass called Pangaea, and the world map you recognize today is simply the result of where those plates have drifted since.",
    parameterExplanations: {
      convergenceRate:
        "Convergence Rate maps to the HTML Convection Speed control. The slider stores values from 1 to 50, displayed in the simulation as 0.1 to 5.0 cm/yr. Raising it makes the plates move faster in the visible model, so ridge spreading, subduction motion, or transform offset accumulates more quickly. Use this slider after selecting a preset to isolate rate: keep Density Contrast steady, change only Convergence Rate, and ask students which observations change because the boundary is moving faster rather than because the boundary type changed.",
      densityContrast:
        "Density Contrast represents how different the two plates are in density. Low values make the plates behave more similarly, while high values emphasize the idea that a denser plate is more likely to sink beneath a less dense plate at a convergent margin. This is especially useful with the Cascadia Subduction preset, where students can connect oceanic crust, continental crust, trenches, volcanic arcs, and earthquake zones. Compare the ridge, subduction, and transform presets, then move only Density Contrast to separate plate material properties from motion rate.",
      viscosity:
        "Mantle Viscosity represents how resistant the mantle is to slow flow. Lower viscosity means material would deform and circulate more easily, while higher viscosity means stronger resistance to motion. In the current HTML control set, this slider is exposed as the Mantle Viscosity setting with five labeled levels from Very Low to Very High. Use it as a conceptual comparison alongside Convergence Rate: students can discuss why real mantle rock can be solid yet still flow over long timescales, and why resistance to flow matters for plate motion.",
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
      "Start with the Mid-Ocean Ridge preset, record the Convergence Rate and Density Contrast values, then have students explain how a divergent boundary creates new oceanic crust at a ridge.",
      "Switch between the Mid-Ocean Ridge, Cascadia Subduction, and San Andreas Transform presets while students sketch one labeled boundary model for each, supporting MS-ESS2-2 and MS-ESS2-3 comparison work.",
      "Use the Cascadia Subduction preset, then change only Density Contrast from low to high so students can connect plate density, subduction direction, trench formation, volcanic arcs, and earthquake hazards.",
      "Keep the preset fixed and move only the Convergence Rate slider through low, medium, and high trials; students record plate speed and explain why geological change is slow in real time but visible in a model.",
      "Use the Mantle Viscosity slider as a discussion prompt: students compare low and high labels, then explain how solid mantle rock can still flow over long timescales under heat and pressure.",
    ],
    faq: [
      {
        question: "What drives tectonic plates to move?",
        answer:
          "The main driver is heat from Earth's interior, generated both by leftover heat from the planet's formation and from the ongoing radioactive decay of elements like uranium and thorium in the mantle. This heat drives slow convection currents in the mantle rock — hot material rises, spreads, cools, and sinks in enormous loops that drag the lithospheric plates along. Slab pull — the weight of a dense sinking slab at a subduction zone — is also thought to be a significant force pulling plates apart at mid-ocean ridges.",
      },
      {
        question: "What do the three boundary presets show?",
        answer:
          "The Mid-Ocean Ridge preset represents a divergent boundary where plates move apart and new oceanic crust forms. The Cascadia Subduction preset represents a convergent boundary where a denser plate dives beneath another plate, producing trenches, volcanoes, and earthquake zones. The San Andreas Transform preset represents plates sliding horizontally past each other, where stored stress can be released as earthquakes. Use the presets as starting cases, then change one slider at a time to test which observations come from motion rate, density contrast, or mantle-flow resistance.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports MS-ESS2-2 (construct an explanation based on evidence for how geoscience processes change Earth's surface at varying scales) and MS-ESS2-3 (analyze and interpret data on the distribution of fossils and rocks, continental shapes, and seafloor structures to provide evidence of past plate motions). It also relates to MS-ESS3-2 by connecting plate boundary locations to natural hazard distributions such as earthquakes and volcanoes.",
      },
      {
        question: "How should students use the Density Contrast slider?",
        answer:
          "Density Contrast is best used for comparing plate material properties. Set a preset first, then change only Density Contrast while leaving Convergence Rate unchanged. Higher contrast emphasizes why denser oceanic crust is more likely to subduct beneath lighter continental crust at convergent margins. Lower contrast helps students see that not every boundary interaction is controlled by sinking crust. The important classroom move is to isolate one variable at a time: boundary preset for the scenario, Convergence Rate for motion speed, and Density Contrast for relative plate density.",
      },
      {
        question: "Why is the ocean floor younger than the continents?",
        answer:
          "New ocean floor is continuously created at mid-ocean ridges where plates pull apart and magma wells up to fill the gap, then solidifies into fresh basalt. As the plates spread, the older seafloor is carried away from the ridge and eventually reaches a subduction zone where it sinks back into the mantle and melts — recycling the rock. The oldest ocean floor is only about 180 to 200 million years old. Continental crust is much lighter and resists subduction, so it accumulates over billions of years — the oldest continental rocks are over 4 billion years old.",
      },
    ],
  },
};
