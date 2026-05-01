import type { Experiment } from "@/shared/types/experiment";

export const glaciersIceAges: Experiment = {
  id: "glaciers-ice-ages",
  slug: "glaciers-ice-ages",
  title: "Glaciers & Ice Ages",
  subtitle: "Glacial advance and retreat driven by Milankovitch cycles",
  description:
    "Visualize how glaciers advance and retreat over hundreds of thousands of years in response to Milankovitch orbital cycles. Adjust Earth's orbital eccentricity, axial tilt, and precession to see how insolation changes drive ice sheet growth and melting. A timeline shows glacial and interglacial periods with corresponding temperature and CO₂ data.",
  thumbnail: "/imgs/experiments/glaciers-ice-ages.png",

  standards: {
    ngss: ["HS-ESS2-4", "HS-ESS1-4"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "9-12",
  tags: [
    "glaciers",
    "ice ages",
    "Milankovitch cycles",
    "ice sheets",
    "climate history",
    "orbital mechanics",
    "Earth Science",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "eccentricity",
      label: "Eccentricity",
      unit: "",
      min: 0,
      max: 0.06,
      default: 0.017,
      step: 0.001,
      tier: "free",
    },
    {
      id: "obliquity",
      label: "Axial Tilt",
      unit: "°",
      min: 22,
      max: 24.5,
      default: 23.4,
      step: 0.1,
      tier: "free",
    },
    {
      id: "timePosition",
      label: "Time",
      unit: "kya",
      min: 0,
      max: 800,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "playbackSpeed",
      label: "Speed",
      unit: "×",
      min: 0,
      max: 5,
      default: 1,
      step: 0.5,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "T_{\\text{eccentricity}} \\approx 100{,}000 \\text{ yr}",
      description:
        "Earth's orbital eccentricity varies with a ~100,000 year cycle, modulating the total solar energy received and strongly correlating with glacial/interglacial transitions.",
    },
    {
      latex: "T_{\\text{obliquity}} \\approx 41{,}000 \\text{ yr},\\quad T_{\\text{precession}} \\approx 26{,}000 \\text{ yr}",
      description:
        "Axial tilt oscillates over ~41,000 years, affecting seasonal contrast. Precession (~26,000 yr) shifts when seasons occur relative to perihelion.",
    },
  ],

  theory:
    "Ice ages are driven by Milankovitch cycles — periodic variations in Earth's orbit that alter the distribution and intensity of solar radiation. Three cycles interact: (1) Eccentricity (~100,000 yr): Earth's orbit stretches from nearly circular to slightly elliptical, changing total insolation by ~0.2%. This correlates most strongly with glacial-interglacial transitions. (2) Obliquity (~41,000 yr): Earth's axial tilt varies between 22.1° and 24.5°, affecting seasonal contrast — low tilt means milder summers that fail to melt winter snow, allowing ice sheets to grow. (3) Precession (~26,000 yr): Earth's axis wobbles, shifting when perihelion occurs relative to seasons. When Northern Hemisphere summer coincides with aphelion (farthest from Sun), summers are cooler, favoring ice growth. Ice sheet growth involves positive feedbacks: more ice → higher albedo → less absorption → more cooling → more ice. Glacial periods last ~90,000 years; interglacials ~10,000 years. Ice core records (Vostok, EPICA) show temperature and CO₂ are tightly correlated over 800,000 years.",

  instructions:
    "Drag the time slider to move through 800,000 years of glacial history. The landscape shows ice sheet extent, while the timeline below plots temperature and CO₂. Adjust eccentricity and obliquity to explore how orbital changes affect ice coverage. Watch the Milankovitch cycle visualization to understand the orbital mechanics.",

  challenges: [
    {
      id: "gi-c1",
      question: "Why do ice ages correlate most strongly with the 100,000-year eccentricity cycle?",
      hint: "While eccentricity alone changes insolation by only ~0.2%, it modulates the amplitude of the precession cycle. High eccentricity makes precession effects stronger, creating the conditions for rapid deglaciation. The nonlinear ice-albedo feedback amplifies small forcing changes.",
      tier: "free",
    },
    {
      id: "gi-c2",
      question: "What role does the ice-albedo feedback play in glaciation?",
      hint: "Ice reflects ~80% of sunlight (high albedo) vs. ~10% for ocean. As ice grows, more sunlight is reflected → less heating → more cooling → more ice growth. This positive feedback amplifies small orbital forcing into major climate shifts.",
      tier: "free",
    },
    {
      id: "gi-c3",
      question: "Why are glacial periods (~90 kyr) much longer than interglacials (~10 kyr)?",
      hint: "Ice sheet growth is slow (snow accumulation) but collapse is fast (warming triggers ice-albedo reversal + meltwater feedbacks). The asymmetry arises because building ice requires sustained cool conditions, but melting can cascade rapidly once a threshold is crossed.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["climate-change-modeling", "soil-formation"],
  htmlPath: "/experiments/earth-science/glaciers-ice-ages.html",

  seoTitle: "Glaciers & Ice Ages Simulation | Scivra Earth Science",
  seoKeywords: [
    "glaciers simulation",
    "ice ages interactive",
    "Milankovitch cycles",
    "glacial interglacial",
    "climate history visualization",
    "Earth science virtual lab",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Glacial Cycles and Milankovitch Orbital Mechanics",
  },
  contentSections: {
    whatIsIt:
      "Glaciers are persistent ice masses that grow when winter snowfall exceeds summer melt year after year, and shrink when the reverse is true. Over the past 2.6 million years, Earth has cycled between frigid glacial periods — when ice sheets a kilometer thick covered Canada and northern Europe — and warmer interglacials like today. The engine behind these cycles is not random: Milankovitch cycles are three slow, predictable changes in Earth's orbit and axial tilt that alter how much sunlight reaches high northern latitudes in summer. Small decreases in summer insolation let winter snow survive into the following year, triggering ice growth and a cascade of feedbacks — more ice means more reflected sunlight, which means more cooling. The simulation lets you adjust orbital parameters and scrub through 800,000 years of glacial history.",
    parameterExplanations: {
      eccentricity:
        "How elliptical Earth's orbit is, ranging 0 (perfect circle) to 0.06 (moderately elliptical). Today's value is ~0.017. The eccentricity cycle runs ~100,000 years and modulates total annual solar energy by about 0.2%, but its primary effect is amplifying or dampening the precession signal.",
      obliquity:
        "Earth's axial tilt, ranging 22°–24.5° in the simulation (real range: 22.1°–24.5°). Today it is ~23.4°. Tilt cycles over ~41,000 years; lower tilt produces milder summers at high latitudes, which fail to melt winter snow — favoring ice sheet growth.",
      timePosition:
        "Position on the 800,000-year timeline, in thousands of years ago (kya). Set to 0 for the present; move toward 800 to step back through past glacial-interglacial cycles. The last glacial maximum was ~20 kya when ice sheets extended to roughly 45°N.",
      playbackSpeed:
        "Playback multiplier (0–5×) controlling how fast the timeline animation advances. At 1×, the simulation runs at a moderate pace; at 5×, 800,000 years passes quickly to reveal the full cycle pattern.",
    },
    misconceptions: [
      {
        wrong:
          "Ice ages are caused by the climate — the climate gets cold, and then ice forms.",
        correct:
          "The causal direction is the reverse. Orbital changes (Milankovitch cycles) reduce summer insolation first, allowing ice to accumulate. The growing ice sheet then amplifies the cooling through the ice-albedo feedback and by reducing atmospheric CO₂ outgassing from a cooling ocean. Orbital forcing is the trigger; climate feedbacks are the amplifier.",
      },
      {
        wrong:
          "The ice-albedo feedback is a minor detail — the orbital forcing alone explains ice ages.",
        correct:
          "Orbital forcing alone is far too weak to produce full glacial conditions. The ~0.2% change in total insolation from eccentricity must be amplified roughly 5–10× by feedbacks — primarily ice-albedo (ice reflects ~80% of sunlight vs. ~6% for dark ocean) and CO₂ release changes — to match observed glacial temperature drops of 5–8°C.",
      },
      {
        wrong:
          "We are currently in an ice age because there is still ice at the poles.",
        correct:
          "Technically Earth is in an ice era (the Quaternary Glaciation) because permanent ice exists at the poles. But within that era we are in an interglacial period — a warmer phase between glacials. An 'ice age' in common usage typically refers to a glacial maximum like 20,000 years ago, not the current warm interglacial.",
      },
      {
        wrong:
          "Precession (the wobble of Earth's axis) changes how much total energy Earth receives from the Sun.",
        correct:
          "Precession does not change Earth's total annual solar energy. It shifts when in the year each season occurs relative to Earth's closest approach to the Sun (perihelion). This changes seasonal contrast — making northern summers slightly warmer or cooler — which is enough to affect whether high-latitude snow survives the summer melt season.",
      },
    ],
    teacherUseCases: [
      "Cycle period identification: set playbackSpeed to 3× and run the full 800 kya timeline. Students count the number of major glacial peaks visible in the temperature curve and calculate the average period. Compare to the expected ~100 kyr eccentricity dominant cycle.",
      "Obliquity effect probe: pause timePosition at 400 kya, then sweep obliquity from 22° to 24.5° while holding eccentricity constant. Students record ice-sheet extent at each tilt extreme and explain the result using the concept of seasonal contrast at high latitudes — connecting to HS-ESS2-4.",
      "Ice-albedo feedback chain: set timePosition to 20 kya (near glacial maximum) and toggle eccentricity from 0.017 to 0.001 (near-circular orbit, reduced forcing). Ask students to predict whether ice extent changes significantly, then observe. Use the discrepancy to introduce feedback amplification as a crosscutting concept of systems and system models.",
      "Data collection — temperature anomaly tracking: advance timePosition in 50 kya increments and record temperature anomaly. Students plot temperature vs. time and identify that glacial periods coincide with the deepest cold anomalies, supporting HS-ESS1-4.",
      "Prediction challenge: set timePosition to present (0 kya) and current orbital parameters (eccentricity 0.017, obliquity 23.4°). Ask students to predict — based only on orbital mechanics — whether Earth is heading into or out of a glacial period over the next 20,000 years (answer: slowly toward a new glacial in ~50 kyr, delayed by anthropogenic forcing).",
    ],
    faq: [
      {
        question: "What are the three Milankovitch cycles and what are their periods?",
        answer:
          "Eccentricity (~100,000 years) describes how circular or elliptical Earth's orbit is. Obliquity (~41,000 years) describes how much Earth's axis is tilted. Axial precession (~26,000 years) describes the slow wobble of Earth's rotation axis; the climatic precession signal that shifts which season coincides with perihelion is commonly expressed as ~19–23 kyr cycles. All three interact to produce the insolation pattern that triggers glacial cycles.",
      },
      {
        question: "How do we know what the climate was like 800,000 years ago?",
        answer:
          "Scientists drill deep ice cores in Antarctica (Vostok and EPICA projects). Trapped air bubbles preserve ancient atmospheric CO₂ and methane concentrations. Oxygen isotope ratios (δ¹⁸O) in the ice record past temperature. These proxies agree closely with each other and with marine sediment records going back millions of years.",
      },
      {
        question: "Why are glacial periods so much longer than interglacials?",
        answer:
          "Ice sheets build slowly — accumulating snow requires sustained cool conditions over thousands of years. But melting is fast once thresholds are crossed: warming reduces albedo, which accelerates warming, which accelerates melting in a positive feedback cascade. Glacial periods last ~90,000 years on average; interglacials like the present Holocene last ~10,000–15,000 years.",
      },
      {
        question: "Which NGSS standards connect to this simulation?",
        answer:
          "The simulation supports HS-ESS2-4 (use a model to describe how variations in the flow of energy into and out of Earth's systems result in changes in climate) and HS-ESS1-4 (deep-time orbital mechanics shape Earth's long-term climate history). The ice-albedo feedback directly addresses the stability and change crosscutting concept.",
      },
      {
        question: "Will human-caused warming prevent the next ice age?",
        answer:
          "Orbital mechanics suggest Earth would enter a new glacial period in roughly 50,000 years. Climate scientists have calculated that current anthropogenic CO₂ levels (420+ ppm) are likely sufficient to delay or suppress that glaciation, since the orbital forcing is relatively weak at current eccentricity values. This is an active area of research, not a settled question.",
      },
    ],
  },
};
