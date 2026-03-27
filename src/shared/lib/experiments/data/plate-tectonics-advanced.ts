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
};
