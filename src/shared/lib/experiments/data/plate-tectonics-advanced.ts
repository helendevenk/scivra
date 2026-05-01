import type { Experiment } from "@/shared/types/experiment";

export const plateTectonicsAdvanced: Experiment = {
  id: "plate-tectonics-advanced",
  slug: "plate-tectonics-advanced",
  title: "Plate Tectonics Advanced",
  subtitle: "Convergent, divergent, and transform boundaries in 3D",
  description:
    "Explore plate tectonic processes through an interactive 3D cross-section. Visualize subduction zones, mid-ocean ridges, and transform faults. Adjust plate velocity, mantle convection rate, and boundary type to observe how tectonic forces shape Earth's surface — creating mountains, trenches, earthquakes, and volcanic arcs.",
  thumbnail: "/imgs/experiments/plate-tectonics-advanced.png",

  standards: {
    ngss: ["HS-ESS2-1", "HS-ESS2-3", "HS-ESS1-5"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "9-12",
  tags: [
    "plate tectonics",
    "subduction",
    "mid-ocean ridge",
    "transform fault",
    "convergent boundary",
    "divergent boundary",
    "mantle convection",
    "Earth Science",
  ],
  difficulty: "advanced",

  parameters: [
    {
      id: "plateSpeed",
      label: "Plate Speed",
      unit: "cm/yr",
      min: 1,
      max: 20,
      default: 5,
      step: 1,
      tier: "free",
    },
    {
      id: "boundaryType",
      label: "Boundary Type",
      unit: "",
      min: 1,
      max: 3,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "mantleTemp",
      label: "Mantle Temp",
      unit: "°C",
      min: 1000,
      max: 4000,
      default: 2500,
      step: 100,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "v_{\\text{plate}} \\approx 2\\text{–}15\\;\\text{cm/yr}",
      description:
        "Tectonic plates move at rates comparable to fingernail growth. The Pacific Plate is fastest (~7-10 cm/yr); the Eurasian Plate is slowest (~2 cm/yr).",
    },
    {
      latex: "F_{\\text{slab pull}} > F_{\\text{ridge push}}",
      description:
        "Slab pull (gravity pulling cold dense subducted lithosphere) is the dominant driving force, roughly 3-5× stronger than ridge push (gravitational sliding away from elevated mid-ocean ridges).",
    },
  ],

  theory:
    "Plate tectonics is the unifying theory of Earth science. Earth's lithosphere is broken into ~15 major plates floating on the asthenosphere. Three types of plate boundaries exist: (1) Divergent — plates move apart at mid-ocean ridges, where magma rises to create new oceanic crust. The Mid-Atlantic Ridge spreads ~2.5 cm/yr. (2) Convergent — plates collide. Ocean-continent convergence creates subduction zones (ocean plate dives under continent), forming volcanic arcs (Andes) and deep trenches (Mariana Trench, 11 km). Ocean-ocean convergence creates island arcs (Japan). Continent-continent collision builds fold mountains (Himalayas). (3) Transform — plates slide laterally past each other, causing earthquakes (San Andreas Fault). The driving forces are slab pull (gravity pulling cold, dense subducted lithosphere into the mantle) and ridge push (gravitational sliding off elevated ridges), both powered by mantle convection driven by Earth's internal heat.",

  instructions:
    "Select a boundary type (convergent, divergent, or transform) to see the 3D cross-section. Adjust plate speed to control the animation rate. The mantle temperature slider affects convection vigor and volcanic activity. Drag to rotate the 3D view; scroll to zoom. Watch for earthquakes at the boundary.",

  challenges: [
    {
      id: "pta-c1",
      question: "Why is slab pull the dominant force driving plate motion?",
      hint: "Subducted oceanic lithosphere is cold and dense (3.3 g/cm³ vs. 3.2 g/cm³ asthenosphere). Gravity pulls it down like a heavy chain hanging off a table. This force is 3-5× stronger than ridge push because the density contrast increases as the slab cools further during descent.",
      tier: "free",
    },
    {
      id: "pta-c2",
      question: "What happens when two continental plates collide, and why is it different from ocean-continent convergence?",
      hint: "Continental crust is too buoyant (2.7 g/cm³) to subduct. Neither plate dives under, so both crumple upward, forming fold mountains (Himalayas). Ocean-continent convergence allows subduction because oceanic crust is denser (3.0 g/cm³). This fundamental density difference determines the outcome.",
      tier: "free",
    },
    {
      id: "pta-c3",
      question: "How do we know plates are moving if the motion is only centimeters per year?",
      hint: "GPS measurements directly show plate velocities. Older evidence: matching fossils/rocks across oceans (Pangaea), seafloor magnetic stripes (symmetric reversal patterns at ridges), hotspot trails (Hawaiian chain), and earthquake/volcano distribution along plate boundaries.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 30,
  relatedExperiments: ["seismic-waves", "rock-cycle"],
  htmlPath: "/experiments/earth-science/plate-tectonics-advanced.html",

  seoTitle: "Plate Tectonics 3D Simulation | Scivra Earth Science",
  seoKeywords: [
    "plate tectonics simulation",
    "subduction zone 3D",
    "divergent convergent transform",
    "tectonic plates interactive",
    "Earth science virtual lab",
    "NGSS ESS2",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Plate Tectonics and Boundary Types",
  },
  contentSections: {
    whatIsIt:
      "Plate tectonics is the unifying theory of Earth science: Earth's rigid outer shell (the lithosphere) is broken into about a dozen major and minor plates — including seven commonly classified as major plates — that move relative to one another at rates of 1–10 cm/yr — about as fast as a fingernail grows. Where plates pull apart, magma fills the gap and builds new ocean floor at mid-ocean ridges. Where plates converge, the denser oceanic plate dives beneath its neighbor in a subduction zone, forming deep trenches and volcanic arcs. Where plates grind sideways, transform faults like the San Andreas produce frequent earthquakes without volcanism. The simulation shows a 3D cross-section of each boundary type, with adjustable plate speed and mantle temperature to connect surface features — mountains, trenches, volcanoes — to the forces driving them.",
    parameterExplanations: {
      plateSpeed:
        "Rate at which the simulated plate moves, in cm/yr (range 1–20 cm/yr). Real plates move 1–10 cm/yr: slow plates like the Eurasian at ~2 cm/yr, fast plates like the Pacific at ~7–10 cm/yr. Higher speeds accelerate subduction, ridge spreading, and fault offset in the animation.",
      boundaryType:
        "Selects the boundary geometry: 1 = convergent (subduction zone), 2 = divergent (mid-ocean ridge or rift valley), 3 = transform (strike-slip fault). Each setting changes the 3D cross-section, the surface features shown, and the type of seismic and volcanic activity displayed.",
      mantleTemp:
        "Temperature of the simulated upper mantle in °C (range 1000–4000°C; default 2500°C). Higher mantle temperatures increase convection vigor and magma generation rate. At convergent boundaries it affects how far the subducting slab must descend before fluids released from the slab lower the melting point of the overlying mantle wedge, producing the magma that feeds arc volcanoes.",
    },
    misconceptions: [
      {
        wrong:
          "Mantle convection directly pushes the plates like a conveyor belt under them.",
        correct:
          "Convection is part of the larger system, but the dominant forces driving individual plates are slab pull — cold, dense subducting oceanic lithosphere pulling the rest of the plate behind it under gravity — and ridge push, where plates slide gravitationally away from elevated mid-ocean ridges. Slab pull is roughly 3–5× stronger than ridge push. Mantle convection is best thought of as the planetary heat engine that the plates ride on, not a belt pushing them.",
      },
      {
        wrong:
          "Continents float like rafts through the ocean floor.",
        correct:
          "Tectonic plates carry both continental and oceanic crust together as a single rigid slab. Continents don't move through ocean floor; the entire plate — continent, adjacent ocean floor, and underlying mantle lithosphere — moves as one unit. The Mid-Atlantic Ridge is not a gap the continents floated away from; it is the seam where new oceanic lithosphere is continuously created.",
      },
      {
        wrong:
          "Subduction happens wherever two plates meet.",
        correct:
          "Subduction requires that one plate be denser than the asthenosphere. Oceanic crust itself is ~3.0 g/cm³, but when the full oceanic lithosphere — crust plus underlying mantle lithosphere — is old and cold, its average density can exceed the asthenosphere (~3.2–3.3 g/cm³), allowing it to sink. Continental crust (~2.7 g/cm³) remains too buoyant — when two continental plates collide, neither can subduct and both crumple into fold mountain ranges like the Himalayas.",
      },
      {
        wrong:
          "Volcanoes occur everywhere there are earthquakes.",
        correct:
          "Transform faults produce abundant earthquakes — the entire San Andreas Fault system is seismically active — but no volcanism, because plates are sliding past each other without a pressure release that generates magma. Volcanism at convergent boundaries requires subducted slab material to reach depths where water is driven off, lowering the melting point of mantle rock.",
      },
    ],
    teacherUseCases: [
      "Boundary type survey: run the simulation at all three boundaryType settings (1, 2, 3) at plateSpeed 5 cm/yr and have students sketch the cross-section for each. They label surface features (trench, ridge, fault), earthquake depth, and presence or absence of volcanism — building a comparison table that supports HS-ESS2-1.",
      "Speed vs. feature intensity: at boundaryType 1 (convergent), sweep plateSpeed from 1 to 20 cm/yr. Students record how trench depth, volcanic arc activity, and earthquake frequency change. Ask: does doubling the plate speed double all these features, or do some saturate? Introduce the concept of nonlinear system responses.",
      "Mantle temperature exploration: fix boundaryType to 2 (divergent) and sweep mantleTemp from 1000 to 4000°C. Students describe how magma production and convection vigor change and explain using the concept of thermal convection in a fluid — linking to HS-ESS2-3 on how internal and external sources of energy drive Earth's surface processes. (To study spreading rate specifically, use the plateSpeed parameter instead.)",
      "Slab pull vs. ridge push misconception probe: before running the simulation, ask students to vote: 'Is it mantle convection or slab pull that drives most plate motion?' After observing the convergent boundary at high plateSpeed with the slab visualization, discuss the force diagram and address the common 'conveyor belt' model.",
      "Real-world boundary matching: assign each group a real boundary (Nazca-South American convergent, Mid-Atlantic divergent, Pacific-North American transform). They set boundaryType and plateSpeed to the nearest available value matching the real rate (~7 cm/yr for Nazca, ~3 cm/yr for Mid-Atlantic — the closest step to the actual ~2.5 cm/yr, ~5 cm/yr for San Andreas) and describe which surface features in the sim correspond to known geographic features — connecting to HS-ESS1-5.",
    ],
    faq: [
      {
        question: "What drives tectonic plates — is it mantle convection, slab pull, or ridge push?",
        answer:
          "All three contribute, but slab pull is the dominant driver for many plates with active subduction. Cold, dense subducting oceanic lithosphere sinks under gravity and pulls the rest of the plate behind it. Ridge push adds a gravitational contribution as plates slide away from elevated mid-ocean ridges. Mantle flow also plays a role. The relative contributions vary by plate and remain an active area of research.",
      },
      {
        question: "Why do some plate boundaries have volcanoes and others don't?",
        answer:
          "Volcanism requires magma generation. At divergent boundaries, decompression as mantle rises causes melting. At convergent subduction zones, water driven off the subducting slab lowers the melting point of overlying mantle rock, generating magma that feeds arc volcanoes. Transform boundaries involve no significant decompression or water injection, so they produce earthquakes but no volcanoes.",
      },
      {
        question: "Which NGSS standards apply to this simulation?",
        answer:
          "The simulation supports HS-ESS2-1 (develop a model to illustrate how Earth's internal and surface processes operate at different spatial and temporal scales to form continental and ocean-floor features), HS-ESS2-3 (develop a model based on evidence of Earth's interior to describe the cycling of matter by thermal convection), and HS-ESS1-5 (evaluate evidence of the past and current movements of continental and oceanic crust).",
      },
      {
        question: "How fast do tectonic plates actually move?",
        answer:
          "Real plate speeds range from ~1 cm/yr (slowest plates, like the Eurasian) to ~10 cm/yr (fastest plates, like the Pacific). The Hawaiian hotspot chain records Pacific Plate motion of ~7–9 cm/yr. At 5 cm/yr — the default plateSpeed — a plate covers 500 km in 10 million years, which is the timescale for major mountain-building events.",
      },
      {
        question: "What happens when two continents collide at a convergent boundary?",
        answer:
          "Continental crust (density ~2.7 g/cm³) is too buoyant to subduct into the denser mantle. When two continental plates converge, neither can sink, so both crumple and thicken, building fold mountain ranges. The Himalayas formed this way when the Indian subcontinent collided with Eurasia ~50 million years ago and continue rising today at ~5 mm/yr as the collision proceeds.",
      },
    ],
  },
};
