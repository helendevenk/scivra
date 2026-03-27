import type { Experiment } from "@/shared/types/experiment";

export const seismicWaves: Experiment = {
  id: "seismic-waves",
  slug: "seismic-waves",
  title: "Seismic Waves",
  subtitle: "P-waves, S-waves, and surface waves through Earth's interior",
  description:
    "Visualize how seismic waves propagate through Earth after an earthquake. Compare primary (P) waves that compress rock longitudinally, secondary (S) waves that shear transversely, and surface waves that cause the most damage. Adjust rock density and wave frequency to observe changes in speed and amplitude.",
  thumbnail: "/imgs/experiments/seismic-waves.png",

  standards: {
    ngss: ["HS-ESS2-1", "HS-ESS2-3"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "9-12",
  tags: [
    "seismic waves",
    "P-wave",
    "S-wave",
    "earthquake",
    "seismology",
    "wave propagation",
    "Earth Science",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "waveSpeed",
      label: "Wave Speed Factor",
      unit: "×",
      min: 0.5,
      max: 3,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "frequency",
      label: "Frequency",
      unit: "Hz",
      min: 0.5,
      max: 5,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "amplitude",
      label: "Amplitude",
      unit: "",
      min: 10,
      max: 60,
      default: 30,
      step: 5,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "v_P = \\sqrt{\\frac{K + \\frac{4}{3}\\mu}{\\rho}}",
      description:
        "P-wave velocity depends on bulk modulus K, shear modulus μ, and density ρ. Travels through solids and liquids.",
    },
    {
      latex: "v_S = \\sqrt{\\frac{\\mu}{\\rho}}",
      description:
        "S-wave velocity depends only on shear modulus and density. Cannot travel through liquids (μ = 0).",
    },
  ],

  theory:
    "Earthquakes generate three main types of seismic waves. Primary (P) waves are compressional — particles move parallel to propagation, like sound waves. They're fastest (~6-8 km/s in crust) and travel through solids and liquids. Secondary (S) waves are shear — particles move perpendicular to propagation. Slower (~3.5-4.5 km/s in crust), they cannot pass through Earth's liquid outer core, creating the S-wave shadow zone. This shadow zone was key evidence for a liquid outer core. Surface waves (Love and Rayleigh) travel along Earth's surface and cause the most ground shaking. Love waves move horizontally; Rayleigh waves create elliptical rolling motion. Seismographs at different distances record arrival time differences (S-P interval), which determine earthquake distance. Three stations triangulate the epicenter.",

  instructions:
    "Click 'Trigger Quake' to send seismic waves from the epicenter. Watch P-waves (blue, fast) arrive first, followed by S-waves (green, slower), and surface waves (red, slowest but largest). The seismograph at right records arrivals. Adjust wave speed and frequency to explore how rock properties affect propagation.",

  challenges: [
    {
      id: "sw-c1",
      question: "Why can't S-waves travel through Earth's outer core?",
      hint: "S-waves require shear strength (μ > 0). Liquids have no shear modulus, so v_S = √(μ/ρ) = 0. The outer core is liquid iron-nickel.",
      tier: "free",
    },
    {
      id: "sw-c2",
      question: "How do seismologists use S-P time intervals to locate earthquakes?",
      hint: "Since P-waves are faster, the time gap between P and S arrivals increases with distance. Three stations each compute distance → three circles → intersection = epicenter.",
      tier: "free",
    },
    {
      id: "sw-c3",
      question: "Why are surface waves more destructive than body waves despite being slower?",
      hint: "Surface waves have larger amplitudes and longer duration at the surface where structures are. Their energy is confined to a 2D shell rather than spreading in 3D, so amplitude decays more slowly (~1/√r vs 1/r).",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["atmosphere-layers", "rock-cycle"],
  htmlPath: "/experiments/earth-science/seismic-waves.html",

  seoTitle: "Seismic Waves Interactive Simulation | Scivra Earth Science",
  seoKeywords: [
    "seismic waves simulation",
    "P-wave S-wave comparison",
    "earthquake wave propagation",
    "seismology interactive",
    "Earth science virtual lab",
    "seismograph simulator",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Seismic Wave Types and Earthquake Detection",
  },
};
