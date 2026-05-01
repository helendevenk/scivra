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
  contentSections: {
    whatIsIt:
      "Every earthquake sends three distinct types of waves radiating outward through Earth. Primary (P) waves are compressional: rock alternately squeezes and expands in the direction of travel, much like sound moving through air — they travel at roughly 6–8 km/s through the crust and can pass through both solid rock and liquid. Secondary (S) waves shear rock perpendicular to their path; they are slower (~3.5–4.5 km/s) and cannot travel through liquid at all. Surface waves (Love and Rayleigh) travel along Earth's outer shell; they are slowest but carry the most destructive energy — the rolling and sideways ground motion that topples buildings. The fact that S-waves disappear on the far side of Earth was the first evidence that the outer core is liquid. The simulation shows all three wave types leaving an epicenter, arriving at a seismograph, and how wave speed and frequency affect propagation.",
    parameterExplanations: {
      waveSpeed:
        "A multiplier on baseline wave speeds (range 0.5–3×, default 1×). At 1×, P-waves propagate at realistic crustal speeds (~6 km/s) and S-waves at ~3.5 km/s. Increasing the multiplier compresses the animation timescale to observe wave arrival sequences without waiting for realistic Earth-crossing times of 20+ minutes.",
      frequency:
        "Oscillation frequency in Hz (range 0.5–5 Hz, default 2 Hz). Real seismic waves span 0.001–20 Hz depending on earthquake magnitude and depth. Higher frequency produces shorter wavelengths and more visible cycles per wave train in the display; lower frequency produces the long-period waves associated with the most distant and deepest earthquakes.",
      amplitude:
        "Wave displacement amplitude in arbitrary display units (range 10–60, default 30). Larger amplitude represents greater ground displacement and shaking intensity at the recording station. If relating this to earthquake magnitude, note that magnitude uses a logarithmic scale and is derived from recorded amplitudes corrected for distance and instrument response — it is not a simple linear measure of shaking.",
    },
    misconceptions: [
      {
        wrong:
          "All seismic waves are the same — they just travel at different speeds.",
        correct:
          "P-waves, S-waves, and surface waves differ fundamentally in how they deform rock. P-waves compress and expand rock in the direction of travel; S-waves shear rock side-to-side perpendicular to travel; surface waves combine motions in complex patterns confined to the near-surface layer. These different deformation modes explain why only P-waves travel through liquids and why surface waves are most destructive despite being slowest.",
      },
      {
        wrong:
          "The most dangerous seismic waves are the P-waves because they arrive first.",
        correct:
          "Arriving first does not mean most destructive. P-waves cause relatively small ground motion. Surface waves arrive last but have the largest amplitudes and longest duration at the surface where structures stand. Most building damage in major earthquakes is caused by surface waves, particularly Love waves (horizontal shearing) and Rayleigh waves (elliptical rolling motion).",
      },
      {
        wrong:
          "Seismic waves slow down as they travel farther from the earthquake because they lose energy.",
        correct:
          "Wave speed depends on the elastic properties and density of the rock the wave is passing through, not on distance traveled. Waves do lose amplitude with distance (geometric spreading and absorption), but their propagation speed is a property of the medium. In fact, seismic waves often speed up as they travel deeper where rock is denser and more rigid.",
      },
      {
        wrong:
          "Earthquakes happen only at plate boundaries.",
        correct:
          "Most large earthquakes occur at plate boundaries, but intraplate earthquakes happen in the interior of plates along ancient fault zones. The 1811–1812 New Madrid earthquakes in the central United States were magnitude ~7.5 events far from any active boundary. The simulation's epicenter represents any location where rock fractures suddenly under stress, not exclusively a plate boundary.",
      },
    ],
    teacherUseCases: [
      "Wave identification race: trigger a quake at the default settings (waveSpeed 1×, frequency 2 Hz, amplitude 30). Students watch the seismograph trace and mark the moment each wave type arrives (P first, S second, surface last), then calculate the S-P time interval to estimate epicenter distance using the simulation's crustal speeds (~6 km/s for P-waves, ~3.5 km/s for S-waves at 1×).",
      "Frequency and wavelength relationship: hold waveSpeed at 1× and amplitude at 30, then sweep frequency from 0.5 Hz to 5 Hz. Students measure the visible wavelength on screen at each frequency setting, confirming the inverse relationship (wavelength = speed / frequency) without calculus — just the wave equation at HS algebra level.",
      "Liquid core evidence thought experiment: set waveSpeed to 1×, trigger a quake, and ask students to predict what would happen to S-waves if they encountered a liquid region deep in Earth. After discussion, explain that S-waves are absent beyond about 103° from the epicenter — the S-wave shadow zone — as the historical evidence for the liquid outer core. (The P-wave shadow zone, where P-waves are also absent, spans roughly 103°–142° due to refraction.) This connects directly to HS-ESS2-1 on interpreting Earth's interior structure.",
      "Amplitude and damage scale: sweep amplitude from 10 to 60 while watching the seismograph trace. Students sketch the trace at each extreme and discuss why higher-amplitude surface waves cause more structural damage — connecting wave physics to built-environment consequences and addressing HS-ESS2-3.",
      "Triangulation exercise: using the S-P interval method, give students seismograph arrival data from three fictitious stations and have them triangulate an epicenter on a map using circles of calculated radius from each station. This data-collection and geometric reasoning activity supports HS-ESS2-1 without requiring any simulation parameter changes beyond the default.",
    ],
    faq: [
      {
        question: "Why can't S-waves travel through Earth's outer core?",
        answer:
          "S-waves are shear waves: they deform rock sideways, perpendicular to the direction of travel. This requires the medium to have shear strength — the ability to resist being sheared. Liquids have no shear strength (shear modulus μ = 0), so the S-wave velocity equation v_S = √(μ/ρ) gives zero. Earth's outer core is liquid iron-nickel, so S-waves are stopped completely there, creating the S-wave shadow zone that seismologists used to map the core's liquid state.",
      },
      {
        question: "How do seismologists find the epicenter of an earthquake?",
        answer:
          "Each seismograph station records the time gap between P-wave and S-wave arrivals (S-P interval). Since P-waves travel faster, the gap grows with distance — roughly 1 second per 8 km between station and epicenter. Three stations each produce a circle of possible epicenter locations; the circles' intersection point is the epicenter. This triangulation works because all stations record the same earthquake at the same moment.",
      },
      {
        question: "Which NGSS standards does this simulation address?",
        answer:
          "The simulation supports HS-ESS2-1 (develop a model to illustrate how Earth's internal and surface processes operate at different spatial and temporal scales — seismic waves as a tool for probing Earth's interior) and HS-ESS2-3 (develop a model based on evidence of Earth's interior to describe the cycling of matter by thermal convection — the liquid outer core inferred from S-wave shadow zones is directly relevant).",
      },
      {
        question: "What is the difference between earthquake magnitude and intensity?",
        answer:
          "Magnitude measures the energy released at the source — a single number per earthquake on the moment magnitude scale (Mw). Intensity measures the shaking experienced at a specific location, which decreases with distance and depends on local geology. A magnitude 7.0 earthquake can cause intensity IX shaking near the epicenter but only intensity III shaking 500 km away. The amplitude parameter in this simulation is a display proxy for ground displacement and shaking intensity; it does not map directly to the logarithmic magnitude scale, which is derived from recorded amplitudes corrected for distance and instrument response.",
      },
      {
        question: "Why do surface waves cause more damage than body waves if they are slower?",
        answer:
          "Surface waves travel along the 2D shell of Earth's surface rather than spreading in 3D, so their energy decays more slowly with distance (amplitude decreases as roughly 1/√r vs. 1/r for body waves). They also have longer periods and larger displacements that match the natural resonance frequencies of buildings (0.5–2 Hz for multi-story structures). The combination of larger amplitude, longer duration, and resonance matching makes them far more destructive despite arriving last.",
      },
    ],
  },
};
