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
    "Earth's outer shell (lithosphere) is divided into about 15 major tectonic plates that float on the semi-molten asthenosphere. These plates move 2-10 cm per year driven by convection currents in the mantle. Convergent boundaries (plates collide): continental-continental creates mountain ranges (Himalayas); oceanic-continental creates subduction zones, ocean trenches, and volcanoes; oceanic-oceanic creates island arcs. Divergent boundaries (plates separate): creates rift valleys (East Africa) on land, mid-ocean ridges under the sea (seafloor spreading). Transform boundaries (plates slide past each other): creates strike-slip faults and earthquakes (San Andreas Fault). About 250 million years ago, all continents were joined in one supercontinent called Pangaea, which has since broken apart.",

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

  seoTitle: "Plate Tectonics Simulation Middle School | NeonPhysics Earth Science",
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
};
