import type { Experiment } from "@/shared/types/experiment";

export const msEarthquakeEpicenter: Experiment = {
  id: "ms-earthquake-epicenter",
  slug: "ms-earthquake-epicenter",
  title: "Earthquake Epicenter",
  subtitle: "Use seismic wave data to triangulate earthquake locations",
  description:
    "Become a seismologist and locate an earthquake's epicenter using data from three seismic stations. Analyze the time delay between P-waves and S-waves to calculate distance, draw circles on a map, and find where they intersect. Adjust wave speeds and station positions to understand how real earthquake monitoring works.",
  thumbnail: "/imgs/experiments/ms-earthquake-epicenter.png",

  standards: {
    ngss: ["MS-ESS2-2", "MS-ESS3-2"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: ["earthquake", "seismic waves", "triangulation", "epicenter", "P-waves", "S-waves", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "magnitude",
      label: "Magnitude",
      unit: "",
      min: 1,
      max: 9,
      default: 6,
      step: 0.1,
      tier: "free",
    },
    {
      id: "depth",
      label: "Earthquake Depth",
      unit: "km",
      min: 0,
      max: 700,
      default: 10,
      step: 10,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "d = \\Delta t \\times \\frac{v_P \\times v_S}{v_P - v_S}",
      description: "Distance to epicenter from the time delay between P-wave and S-wave arrivals at a station",
    },
    {
      latex: "\\text{3 circles} \\to \\text{1 intersection point} = \\text{epicenter}",
      description: "Triangulation: draw a circle of calculated radius around each station — the epicenter is where all three circles meet",
    },
  ],

  theory:
    "Earthquakes generate two main types of body waves. P-waves (primary, compressional) travel fastest — about 6 km/s through Earth's crust — and arrive at seismic stations first. S-waves (secondary, shear) travel slower — about 3.5 km/s — and arrive after. The farther you are from the earthquake, the bigger the time gap between P and S arrivals. By measuring this time delay at a single station, you can calculate the distance to the epicenter, but not the direction. With two stations you narrow it to two possible points. With three or more stations, you can pinpoint the exact location — this is triangulation. Each station draws a circle on the map with radius equal to its calculated distance. The unique point where all circles intersect is the epicenter. Real seismological networks use hundreds of stations and computers to locate earthquakes within seconds. Earthquake depth (shallow vs. deep) also affects wave behavior and damage patterns — shallow quakes under 70 km cause the most surface damage.",

  instructions:
    "The map shows three fixed seismic stations and a hidden earthquake epicenter. Set the Magnitude (1-9) and Depth (0-700 km) of your simulated earthquake, then trigger it. Watch P-waves and S-waves ripple outward at different speeds; read the P-wave and S-wave arrival times shown for each station. The simulation automatically draws triangulation circles around each station — find where the three circles intersect to locate the epicenter. Increase depth to see how deeper quakes change wave travel times to the surface.",

  challenges: [
    {
      id: "eq-ms-c1",
      question: "Station A records the P-wave at 10:00:00 and the S-wave at 10:00:24. If P-waves travel at 6 km/s and S-waves at 3.5 km/s, how far is Station A from the epicenter?",
      hint: "Using d = Δt × (vP × vS)/(vP - vS): d = 24 s × (6 × 3.5)/(6 - 3.5) = 24 × 21/2.5 = 24 × 8.4 = 201.6 km. Station A is about 202 km from the epicenter. The larger the time gap, the farther away you are.",
      tier: "free",
    },
    {
      id: "eq-ms-c2",
      question: "Why do you need at least 3 seismic stations to pinpoint an epicenter? What happens with only 2?",
      hint: "One station gives you distance but not direction — the epicenter could be anywhere on a circle around that station. Two stations give two circles that intersect at two points — you know it's one of them but can't tell which. Three stations give three circles that have only one common intersection point — that's the epicenter. More stations improve accuracy by averaging out measurement errors.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["seismic-waves", "plate-tectonics-advanced"],

  htmlPath: "/experiments/middle/ms-earthquake-epicenter.html",

  seoTitle: "Earthquake Epicenter Triangulation Simulation | Scivra Middle School Earth Science",
  seoKeywords: [
    "earthquake epicenter triangulation simulation",
    "seismic waves P-wave S-wave interactive",
    "locate earthquake middle school activity 6-8",
    "seismology station triangulation",
    "NGSS MS-ESS2-2 earth science",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Earthquake Epicenter Location Using Seismic Wave Triangulation",
  },
  htmlControlAliases: {
    magnitude: "sl-mag",
    depth: "sl-depth",
  },
  contentSections: {
    whatIsIt:
      "When an earthquake happens, it sends energy outward through the ground in the form of seismic waves — similar in idea to ripples spreading across a pond when you drop a stone. Two key types of waves travel through Earth's interior: P-waves (primary waves) move like a compressed spring, squeezing and stretching rock as they go. They travel the fastest, so they arrive at a recording station first. S-waves (secondary waves) shake the ground side-to-side and arrive later. The gap in arrival time between P and S at any single station tells a seismologist how far away the earthquake was — the bigger the gap, the farther the earthquake. But distance alone does not tell you the direction. By gathering arrival data from three or more stations spread across the map, scientists draw a circle around each station with a radius equal to the calculated distance. The point where all three circles meet is the earthquake's epicenter — the spot on Earth's surface directly above where the fault slipped. This method, called triangulation, is the same geometry you use when locating a phone signal from multiple cell towers.",
    parameterExplanations: {
      magnitude:
        "Sets the size of the simulated earthquake on a magnitude scale from 1.0 to 9.0 (step 0.1, default 6.0). Magnitude is logarithmic, so each whole-number increase represents about 10 times more shaking and roughly 32 times more energy released. Magnitude 1-3 quakes are barely felt; 4-5 are felt locally and may shake objects; 6-7 cause moderate to serious damage; 8-9 are catastrophic. Increasing magnitude in the simulation makes the wave amplitudes larger but does not change wave SPEED — P-waves still arrive before S-waves at the same intervals, because the time gap depends on distance and rock type, not on magnitude.",
      depth:
        "Sets how deep below the surface the earthquake focus (hypocenter) is located, from 0 km (at the surface) to 700 km — covering the full range from shallow (0 to 70 km) through intermediate (70 to 300 km) and deep (300 to 700 km) earthquakes. Shallow earthquakes typically cause the most ground shaking and damage near the epicenter. Deeper earthquakes release their energy farther from the surface, so shaking spreads over a wider area but is less intense at any single point. Depth also affects travel times — waves from deeper quakes travel a longer slanted path to reach surface stations, increasing both P-wave and S-wave arrival times.",
    },
    misconceptions: [
      {
        wrong: "One seismic station is enough to find an earthquake's exact location.",
        correct:
          "A single station measures the time gap between P and S waves, which tells you only how far away the earthquake was. The epicenter could be anywhere on a circle around that station. You need at least three stations to narrow the location to a single point through triangulation — the same geometry used to locate positions with GPS satellites.",
      },
      {
        wrong: "The epicenter is where the earthquake actually starts underground.",
        correct:
          "The point underground where the fault actually slips is called the focus or hypocenter. The epicenter is the point on Earth's surface directly above the focus. When you hear on the news that an earthquake's epicenter was near a particular city, it means the surface point directly above the underground origin — not the place where the ground cracked open.",
      },
      {
        wrong: "P-waves and S-waves travel at the same speed but arrive at different times due to different paths.",
        correct:
          "P-waves and S-waves follow the same path outward from the focus, but they travel at different speeds through the same rock. P-waves move roughly 1.7 times faster than S-waves in typical crustal rock. That speed difference causes the arrival time gap — and the gap grows the farther you are from the source, just like two runners who start together but run at different speeds will be farther apart the longer the race goes on.",
      },
      {
        wrong: "A deeper earthquake is always more dangerous than a shallow one.",
        correct:
          "Shallow earthquakes (under about 70 km) typically cause more damage near the epicenter because the seismic energy has less rock to travel through before reaching the surface. Deep earthquakes (over 300 km) release energy from much farther down, so it spreads over a much larger area and arrives at the surface with less intensity at any one location — though they can still be felt across very wide regions.",
      },
    ],
    teacherUseCases: [
      "Keep depth at 10 km and vary magnitude from 3.0 to 8.0; have students record the displayed P-wave and S-wave arrival times. They will discover that arrival times do NOT change with magnitude — only wave amplitude changes — reinforcing that timing depends on distance and rock type, not on energy released (MS-ESS2-2).",
      "Set magnitude to 6.0 and step depth from 0 km to 500 km in increments of 100 km. Students record both arrival times at each step and graph the results, observing how deeper quakes produce longer travel times because waves take a longer slanted path to reach surface stations.",
      "After exploring the simulation, ask students to predict where the epicenter circles will intersect on the map for a depth of 200 km. They sketch their prediction on a printed map using the displayed radii, then compare to the simulation output — practicing the manual triangulation method seismologists used before computers automated the geometry.",
      "Compare a shallow magnitude-7 quake (depth 5 km) with a deep magnitude-7 quake (depth 600 km). Although both have the same magnitude, students discuss why the shallow one would likely cause more localized surface damage — connecting earthquake hazard analysis to NGSS MS-ESS3-2 (forecasting natural hazards).",
    ],
    faq: [
      {
        question: "How do scientists detect earthquakes that happen far away or under the ocean?",
        answer:
          "Seismic waves pass through the entire planet, not just the surface layer. A seismograph in Tokyo can detect an earthquake in Chile because P-waves can pass through mantle and core; S-waves travel through solid rock but are blocked by the liquid outer core. Ocean-bottom seismometers can be placed on the seafloor to detect underwater earthquakes. Global networks of hundreds of stations continuously record ground motion, and computers process arrival times automatically to locate earthquakes within seconds of when they occur.",
      },
      {
        question: "What is the difference between the Richter scale and the moment magnitude scale?",
        answer:
          "The Richter scale was developed in 1935 and measures the amplitude of shaking recorded at a specific distance. It works well for local, moderate earthquakes but becomes unreliable for very large or distant events. The moment magnitude scale (Mw) is now the standard used by scientists worldwide. It measures the total energy released by the earthquake based on the area of the fault that slipped, how much it slipped, and the rigidity of the rock — giving consistent results for earthquakes of any size anywhere on Earth.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation directly supports MS-ESS2-2, which asks students to construct an explanation based on evidence for how geoscience processes have changed Earth's surface at varying time and spatial scales. It also connects to MS-ESS3-2 by analyzing and interpreting seismic data to understand natural hazards. The triangulation method also develops science and engineering practices including data analysis, using mathematics, and constructing explanations.",
      },
      {
        question: "Why can only S-waves travel through the solid Earth and not through the liquid outer core?",
        answer:
          "S-waves (shear waves) require the rock they travel through to resist twisting — a property called shear strength. Solids resist shearing; liquids do not. Earth's outer core is liquid iron and nickel, which cannot transmit shear forces. So S-waves disappear when they hit the outer core boundary, leaving a 'shadow zone' on the far side of Earth where no S-waves arrive. Scientists used this S-wave shadow to confirm that the outer core is liquid — long before anyone could drill anywhere close to it.",
      },
      {
        question: "How accurate is modern earthquake location technology?",
        answer:
          "Modern seismological networks can locate the epicenter of a significant earthquake within a few kilometers, often within seconds of the event. Accuracy depends on how many stations recorded the earthquake, how precisely their clocks are synchronized (GPS-disciplined atomic clocks are typical), and how well the local rock speed structure is known. For very small earthquakes in sparsely monitored regions, uncertainty can be larger. Rapid location estimates are used to issue tsunami warnings within minutes of a large offshore earthquake.",
      },
    ],
  },
};
