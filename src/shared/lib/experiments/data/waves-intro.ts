import type { Experiment } from "@/shared/types/experiment";

export const wavesIntro: Experiment = {
  id: "waves-intro",
  slug: "waves-intro-sound-water",
  title: "Waves: Intro",
  subtitle: "Introduction to wave properties with sound and water waves",
  description:
    "Explore the fundamental properties of waves — wavelength, frequency, amplitude, and speed — using intuitive water and sound wave visualizations. Perfect first introduction to wave physics.",
  thumbnail: "/imgs/experiments/wave-interference.png",

  standards: {
    ngss: ["HS-PS4-1"],
    gcse: ["AQA P6.1"],
    ap: ["GO-4.A"],
  },
  primaryStandard: "ap-physics-1",
  category: "waves",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["waves", "wavelength", "frequency", "amplitude", "wave speed", "sound waves", "water waves"],
  difficulty: "beginner",

  parameters: [
    { id: "frequency", label: "Frequency", unit: "Hz", min: 0.1, max: 10, default: 1, step: 0.1, tier: "free" },
    { id: "amplitude", label: "Amplitude", unit: "cm", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "wave_type", label: "Wave Type", unit: "", min: 0, max: 1, default: 0, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "v = f\\lambda", description: "Wave speed" },
    { latex: "T = \\frac{1}{f}", description: "Period" },
    { latex: "v_{sound} \\approx 343\\text{ m/s (20°C air)}", description: "Speed of sound in air" },
  ],

  theory:
    "A wave carries energy through a medium without permanently moving the medium itself. Key properties: frequency f (cycles per second), wavelength λ (distance per cycle), amplitude (height), and speed v = fλ. Transverse waves oscillate perpendicular to travel (water waves, light); longitudinal waves oscillate parallel to travel (sound). The wave equation v = fλ means higher frequency gives shorter wavelength at constant speed.",
  instructions:
    "Select water or sound waves. Adjust frequency and amplitude sliders. Observe how wavelength changes when you change frequency (speed stays constant). Use the ruler to measure wavelength. Toggle between single source and two-source to preview interference.",
  challenges: [
    { id: "wi-c1", question: "A wave has frequency 2Hz and wavelength 3m. What is its speed?", hint: "v = fλ = 2 × 3 = 6 m/s", tier: "free" },
    { id: "wi-c2", question: "Sound travels at 343 m/s. What wavelength does a 440Hz (A note) have?", hint: "λ = v/f = 343/440 ≈ 0.78 m", tier: "free" },
    { id: "wi-c3", question: "Why can you hear a bass drum from far away but not a piccolo flute at the same distance?", hint: "Lower frequencies diffract more around obstacles (diffraction angle ∝ λ); longer wavelengths go around walls better", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 12,
  relatedExperiments: ["wave-interference", "wave-on-string", "doppler-effect"],

  seoTitle: "Waves: Intro — Wavelength, Frequency, Speed | AP Physics 1",
  seoKeywords: ["waves introduction", "wavelength frequency", "wave speed", "sound waves", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Wave Properties, Frequency, Wavelength, Wave Speed" },

  contentSections: {
    whatIsIt:
      "Drop a pebble into a pond and a ring of ripples races outward. Pluck a guitar string and your eardrum picks up the wiggle a fraction of a second later. Both events are waves — disturbances that carry energy from one place to another while the water and air themselves stay roughly where they started. This lab lets you set the frequency and amplitude of either a water wave or a sound wave and watch wavelength, period, and wave shape respond live. The fundamental relationship v = fλ ties speed, frequency, and wavelength together, and the simulation makes that relationship visible: crank up frequency and the crests crowd in tighter; pull frequency back down and the wavelength stretches out. Use the on-screen ruler to measure wavelength directly and confirm the equation yourself.",
    parameterExplanations: {
      frequency:
        "How many full wave cycles pass a fixed point each second, measured in hertz. Higher frequency means a higher-pitched sound or faster ripples on the water; at fixed wave speed, doubling frequency halves the wavelength.",
      amplitude:
        "The maximum displacement of the medium from its rest position, in centimeters. Larger amplitude means a louder sound or a taller water crest, but it does not change the wavelength or the speed of the wave.",
      wave_type:
        "Switches the visualization between an intro transverse surface-wave model (the surface marker oscillates up and down while the wave travels sideways) and a longitudinal sound wave (air molecules compress and rarefy along the direction of travel). Use this control to compare the two wave geometries side by side.",
    },
    misconceptions: [
      {
        wrong:
          "If I turn up the amplitude, the frequency goes up too — louder sounds are higher-pitched.",
        correct:
          "Amplitude and frequency are independent. Amplitude controls loudness or wave height; frequency controls pitch or how often crests pass. A loud bass note and a quiet bass note have the same frequency but different amplitudes.",
      },
      {
        wrong:
          "Sound waves are like water waves — both are transverse, with the medium moving up and down.",
        correct:
          "Sound waves in air are longitudinal: the air molecules oscillate back and forth along the direction the wave travels, creating compressions and rarefactions. This intro surface-wave model shows transverse motion, while real water waves can include both vertical and horizontal particle motion. The wave_type control lets you compare the simplified geometries directly.",
      },
      {
        wrong:
          "A wave physically carries water (or air) from the source all the way to where you are.",
        correct:
          "The medium oscillates in place — a leaf on the pond bobs up and down but does not travel with the wave. What the wave actually carries is energy and momentum, not matter.",
      },
      {
        wrong:
          "Higher frequency waves travel faster than lower frequency waves.",
        correct:
          "In a non-dispersive medium, different frequencies travel at the same speed. Sound at 100 Hz and 8000 Hz both travel through 20°C air at about 343 m/s — that is why a band on stage stays in sync no matter where you sit. Some media, including water-surface waves, are dispersive, so this rule has limits.",
      },
      {
        wrong:
          "Wavelength and amplitude are basically the same thing — they both measure how big a wave is.",
        correct:
          "Wavelength is a horizontal distance (one full crest-to-crest spacing along the direction of travel); amplitude is a vertical distance (how far the medium displaces from rest). They live on perpendicular axes of the wave graph.",
      },
    ],
    teacherUseCases: [
      "Direct measurement lab: students set frequency to 1, 2, 3, and 4 Hz, use the on-screen ruler to record wavelength at each frequency, then plot λ vs 1/f and extract the wave speed from the slope.",
      "Misconception probe — open the lab with frequency low and amplitude high, then ask the class 'is this loud or high-pitched?' Discuss why so many students conflate the two before showing the controls.",
      "Transverse vs. longitudinal compare-and-contrast: split the class in half, one side describes water-wave motion and the other describes sound-wave motion using only the simulation, then trade observations.",
      "Music tie-in: have students predict the wavelength of A4 (440 Hz) in 20°C air using v = fλ, then verify against the simulation reading and discuss why bass notes diffract around walls more than treble notes.",
      "Energy versus matter: pause the animation and ask which way the medium has moved net since t = 0; use the answer (essentially nowhere) to introduce the idea that waves transport energy without transporting bulk matter.",
    ],
    faq: [
      {
        question:
          "If I double the frequency, what happens to the wavelength of a sound wave in the same room?",
        answer:
          "The wavelength halves. Sound speed in a fixed medium is essentially constant (about 343 m/s in 20°C air), so v = fλ forces wavelength and frequency to be inversely related. Doubling f from 220 Hz to 440 Hz drops the wavelength from about 1.56 m to 0.78 m, which the simulation will show directly when you slide the frequency up.",
      },
      {
        question:
          "Why does sound travel through air at all if the air molecules barely move?",
        answer:
          "Each molecule only oscillates a tiny distance back and forth, but it bumps the next molecule, which bumps the next, and so on. The disturbance — the compression and rarefaction pattern — propagates at 343 m/s even though no individual molecule travels with it. The wave is the pattern, not the particles.",
      },
      {
        question:
          "Does a louder sound travel faster than a quieter one?",
        answer:
          "No. Loudness is amplitude, and changing amplitude does not change wave speed in a given medium. Sound speed depends mainly on the medium's temperature and stiffness — warmer air gives slightly faster sound, but a whisper and a shout in the same room arrive together. The simulation pins this down: change amplitude and watch wavelength stay locked at fixed frequency.",
      },
      {
        question:
          "What does this lab cover from the AP Physics 1 framework and NGSS HS-PS4-1?",
        answer:
          "AP Physics 1 standard GO-4.A asks students to relate wavelength, frequency, and wave speed and to distinguish transverse from longitudinal wave geometry. NGSS HS-PS4-1 expects students to use mathematical representations to support a claim regarding the relationship among frequency, wavelength, and speed in various media. This lab gives a direct, measurable v = fλ workout that maps to both standards.",
      },
      {
        question:
          "How is wavelength different from period?",
        answer:
          "Wavelength is a distance — meters per cycle — while period is a time — seconds per cycle. They are linked by speed: v = λ/T = fλ. On the simulation you can read wavelength off the spatial ruler and period off the time axis, then verify that their ratio matches the medium's wave speed. Confusing the two is one of the most common AP Physics 1 errors on free-response wave questions.",
      },
    ],
  },
};
