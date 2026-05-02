import type { Experiment } from "@/shared/types/experiment";

export const seismicWaves: Experiment = {
  id: "seismic-waves",
  slug: "seismic-waves",
  title: "Seismic Waves",
  subtitle: "P-waves, S-waves, and surface waves through Earth's interior",
  description:
    "Visualize how seismic waves propagate through Earth after an earthquake. Compare primary (P) waves that compress rock longitudinally, secondary (S) waves that shear transversely, and surface waves that cause the most damage. Adjust earthquake depth and magnitude to observe changes in wave behavior.",
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
      id: "depth",
      label: "Earthquake Depth",
      unit: "km",
      min: 5,
      max: 700,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "magnitudeX10",
      label: "Magnitude (×10)",
      unit: "",
      min: 40,
      max: 95,
      default: 72,
      step: 1,
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
    "Click 'Trigger Quake' to send seismic waves from the epicenter. Use the Earthquake Depth slider to move the source from shallow crustal events to deep-focus earthquakes, and use the Magnitude (×10) slider to change earthquake size. The magnitude control stores values at 10× the displayed magnitude, so 72 displays as M7.2. Try the Shallow Crustal Quake, Deep-Focus Quake, and Megathrust Earthquake presets to compare how depth and magnitude affect the P-wave, S-wave, surface-wave, and seismograph patterns.",

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
  htmlControlAliases: { depth: "sl-depth", magnitudeX10: "sl-mag" },
  presets: [
    {
      id: "shallow",
      label: "Shallow Crustal Quake",
      description:
        "Shallow earthquakes usually occur less than 70 km below the surface, so their energy reaches nearby communities with less distance to spread out. They often produce the strongest surface shaking and the most visible damage.",
    },
    {
      id: "deep",
      label: "Deep-Focus Quake",
      description:
        "Deep-focus earthquakes form hundreds of kilometers down, most often inside subducting slabs at convergent plate boundaries. Their waves can travel far, but surface shaking is often reduced because the source is so deep.",
    },
    {
      id: "megathrust",
      label: "Megathrust Earthquake",
      description:
        "Megathrust earthquakes rupture the broad interface where one tectonic plate dives beneath another. They can reach the largest magnitudes on Earth and may generate severe shaking, uplift, subsidence, and tsunamis.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Every earthquake sends three distinct types of waves radiating outward through Earth. Primary (P) waves are compressional: rock alternately squeezes and expands in the direction of travel, much like sound moving through air — they travel at roughly 6–8 km/s through the crust and can pass through both solid rock and liquid. Secondary (S) waves shear rock perpendicular to their path; they are slower (~3.5–4.5 km/s) and cannot travel through liquid at all. Surface waves (Love and Rayleigh) travel along Earth's outer shell; they are slowest but carry the most destructive energy — the rolling and sideways ground motion that topples buildings. The fact that S-waves disappear on the far side of Earth was the first evidence that the outer core is liquid. The simulation shows all three wave types leaving an epicenter, arriving at a seismograph, and how earthquake depth and magnitude affect propagation.",
    parameterExplanations: {
      depth:
        "Earthquake Depth sets how far below Earth's surface the rupture begins, from 5 km to 700 km. Shallow earthquakes place the source close to people and buildings, so P-waves, S-waves, and surface waves can arrive with stronger local shaking. Deeper earthquakes are usually linked to subduction zones, where cold slabs sink into the mantle. Their P-waves and S-waves still spread through Earth, but the extra distance to the surface often reduces damage near the epicenter. Keep in mind that depth works together with magnitude: the Magnitude (×10) slider uses the HTML control's direct 10× scale, so 72 means M7.2, not magnitude 72.",
      magnitudeX10:
        "Magnitude (×10) controls earthquake size using the same scale stored in the HTML slider: 40 displays as M4.0, 72 displays as M7.2, and 95 displays as M9.5. This 10× scaling avoids decimal slider values while still representing familiar earthquake magnitudes. Larger magnitudes release much more energy, producing stronger P-waves and S-waves and often more damaging surface waves. In real seismology, magnitude is logarithmic, so each whole-number increase represents far greater wave amplitude and energy release. Compare the same magnitude at different depths to separate source size from source location, then watch how the seismograph records the P-wave and S-wave arrivals.",
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
      "Natural-hazards comparison: have students run the Shallow Crustal Quake, Deep-Focus Quake, and Megathrust Earthquake presets, then record the Earthquake Depth and Magnitude (×10) values for each. Students explain which scenario would likely create the highest local hazard and cite P-wave, S-wave, and surface-wave evidence (HS-ESS2-1).",
      "Depth-only investigation: keep Magnitude (×10) fixed at 72, then move Earthquake Depth from 10 km to 700 km. Students compare arrival patterns and shaking at shallow versus deep sources, connecting earthquake distribution to plate interactions and subduction zones (HS-ESS2-3).",
      "Magnitude scaling mini-lesson: keep Earthquake Depth fixed, sweep Magnitude (×10) from 40 to 95, and require students to translate slider values into displayed magnitudes such as 40 = M4.0 and 95 = M9.5. This supports hazard reasoning because students must distinguish the slider's 10× data format from real earthquake magnitude labels.",
      "Preset-based claim-evidence-reasoning: assign groups one of the three presets and ask them to defend whether it best represents a crustal fault, a deep subduction-zone event, or a plate-interface megathrust. Students must cite both sliders and the P-wave/S-wave sequence as evidence.",
      "Risk-mitigation discussion: after comparing all three presets, ask students what monitoring, building design, or warning-system choices would matter most for each hazard. The activity links model observations from the Earthquake Depth and Magnitude (×10) sliders to reducing impacts from natural hazards.",
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
          "Magnitude measures the energy released at the source — a single number per earthquake on the moment magnitude scale (Mw). Intensity measures the shaking experienced at a specific location, which decreases with distance and depends on local geology. A magnitude 7.0 earthquake can cause intensity IX shaking near the epicenter but only intensity III shaking 500 km away. The Magnitude (×10) slider in this simulation represents the source magnitude, not local intensity, which is why two stations can record the same earthquake with very different shaking levels.",
      },
      {
        question: "Why do surface waves cause more damage than body waves if they are slower?",
        answer:
          "Surface waves travel along the 2D shell of Earth's surface rather than spreading in 3D, so their energy decays more slowly with distance (amplitude decreases as roughly 1/√r vs. 1/r for body waves). They also have longer periods and larger displacements that match the natural resonance frequencies of buildings (0.5–2 Hz for multi-story structures). The combination of larger amplitude, longer duration, and resonance matching makes them far more destructive despite arriving last.",
      },
    ],
  },
};
