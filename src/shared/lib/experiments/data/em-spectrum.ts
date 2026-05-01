import type { Experiment } from "@/shared/types/experiment";

export const emSpectrum: Experiment = {
  id: "em-spectrum",
  slug: "electromagnetic-spectrum",
  title: "Electromagnetic Spectrum",
  subtitle: "From radio waves to gamma rays",
  description:
    "Explore the full electromagnetic spectrum. Adjust wavelength and frequency to see how photon energy changes. Visualize different wave bands with neon colors.",
  thumbnail: "/imgs/experiments/em-spectrum.png",

  standards: {
    ngss: ["HS-PS4-1", "HS-PS4-3"],
    gcse: ["P6.1", "P6.2"],
    ap: ["6.F.1", "6.F.2"],
  },
  primaryStandard: "ngss-hs",
  category: "waves",
  subject: "physics",
  gradeLevel: "9-12",
  tags: [
    "electromagnetic",
    "spectrum",
    "wavelength",
    "frequency",
    "photon",
    "light",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "wavelength",
      label: "Wavelength",
      unit: "nm",
      min: 0.001,
      max: 10000,
      default: 500,
      step: 1,
      tier: "free",
    },
    {
      id: "amplitude",
      label: "Wave Amplitude",
      unit: "",
      min: 0.1,
      max: 2,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "showPhoton",
      label: "Show Photon Energy",
      unit: "",
      min: 0,
      max: 1,
      default: 1,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    { latex: "c = f \\lambda", description: "Wave equation" },
    { latex: "E = hf", description: "Photon energy" },
    {
      latex: "E = \\frac{hc}{\\lambda}",
      description: "Energy from wavelength",
    },
  ],

  theory:
    "The electromagnetic spectrum encompasses all types of electromagnetic radiation, from radio waves with the longest wavelengths to gamma rays with the shortest. All EM waves travel at the speed of light (c = 3×10⁸ m/s). Higher frequency means higher photon energy.",
  instructions:
    "Drag the wavelength slider to move across the EM spectrum. Watch the wave visualization change and observe how frequency and energy respond. The band name updates automatically.",
  challenges: [
    {
      id: "em-c1",
      question: "What is the frequency of visible green light (~530nm)?",
      hint: "Use c = fλ",
      tier: "free",
    },
    {
      id: "em-c2",
      question: "Which has more energy: UV or infrared?",
      hint: "Compare their frequencies",
      tier: "free",
    },
    {
      id: "em-c3",
      question: "Calculate the photon energy of a 100nm UV photon in eV",
      hint: "E = hc/λ, then convert J to eV",
      tier: "pro",
    },
  ],

  wave: 1,
  tier: "free",
  estimatedTime: 12,
  relatedExperiments: [],

  seoTitle:
    "Electromagnetic Spectrum — Interactive 3D Visualization | Scivra",
  seoKeywords: [
    "electromagnetic spectrum",
    "wavelength frequency",
    "photon energy",
    "EM waves",
    "physics visualization",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Electromagnetic Spectrum",
  },
  contentSections: {
    whatIsIt:
      "The light you see with your eyes is a narrow slice of a much broader family of waves called the electromagnetic spectrum. Broadcast radio waves span meters to kilometers; Wi-Fi uses centimeter-scale microwave/radio waves (~12.5 cm at 2.4 GHz, ~6 cm at 5 GHz); microwaves heat your lunch; infrared radiation is the warmth you feel from a campfire without touching it; visible light spans 380–750 nm; ultraviolet light causes sunburns; X-rays pass through soft tissue; gamma rays, shorter than 0.01 nm, are released by radioactive nuclei. All of them are the same physical phenomenon — oscillating electric and magnetic fields propagating through space — and all travel at exactly c = 3 × 10⁸ m/s in a vacuum. What differs is wavelength, frequency (related by c = fλ), and photon energy (E = hf, where h = 6.63 × 10⁻³⁴ J·s). This simulation lets you drag a wavelength slider from radio to gamma and watch the wave visualization, band label, and photon energy update together in real time.",
    parameterExplanations: {
      wavelength:
        "The distance between successive wave crests, in nanometers (nm), adjustable from 0.001 nm (hard gamma) to 10,000 nm (mid-infrared). This slider spans gamma through mid-infrared — not the full radio-to-gamma spectrum. As wavelength decreases, frequency and photon energy both increase. Visible light occupies the narrow range of 380–750 nm.",
      amplitude:
        "The peak displacement of the wave oscillation, adjustable from 0.1 to 2 (dimensionless display units). Amplitude is related to wave intensity — a higher-amplitude wave carries more energy per unit area per unit time — but it does not change the wavelength, frequency, or individual photon energy shown in the panel.",
      showPhoton:
        "Toggles the photon energy readout overlay (0 = off, 1 = on). When enabled, the panel shows the energy of a single photon in eV calculated from E = hc/λ, making it easy to compare how much more energetic a UV photon is than a visible-light photon at the same amplitude setting.",
    },
    misconceptions: [
      {
        wrong:
          "Radio waves travel more slowly than gamma rays because they have less energy.",
        correct:
          "All electromagnetic waves travel at exactly c = 3 × 10⁸ m/s in a vacuum, regardless of wavelength or frequency. Energy per photon differs (E = hf), but speed does not. Radio waves and gamma rays are identical in speed; they differ only in wavelength, frequency, and photon energy.",
      },
      {
        wrong:
          "A higher amplitude wave means higher frequency and therefore higher energy.",
        correct:
          "Amplitude and frequency are independent properties of a wave. Amplitude controls intensity (power per area); frequency controls individual photon energy (E = hf). You can have a high-amplitude radio wave with very low photon energy, or a low-amplitude gamma ray with extremely high photon energy.",
      },
      {
        wrong:
          "Visible light is the only type of EM radiation that carries real energy.",
        correct:
          "Every part of the spectrum carries energy. Radio waves power wireless communication; microwaves heat food; infrared is felt as heat; UV damages DNA; X-rays penetrate tissue for imaging; gamma rays can ionize atoms and are used in cancer radiation therapy. The energy per photon differs enormously (E = hf), but all bands carry energy.",
      },
      {
        wrong:
          "UV light is just really bright visible light — the same thing, just more intense.",
        correct:
          "UV light (wavelengths roughly 10–380 nm) has shorter wavelengths and higher photon energy than visible light. At 300 nm, each photon carries about 4.1 eV — enough to drive photochemical reactions in DNA, including the formation of pyrimidine dimers (e.g., thymine-thymine links) that can cause mutations if not repaired. Intensity (amplitude) describes how many photons arrive; photon energy determines whether each photon can trigger such a reaction.",
      },
      {
        wrong:
          "The electromagnetic spectrum ends at gamma rays; there is nothing beyond.",
        correct:
          "The spectrum is continuous with no hard upper limit. Gamma rays above ~10 MeV (sometimes called hard gamma or ultra-high-energy photons) are observed from cosmic sources. The distinctions between bands are defined by how the radiation is produced and how it interacts with matter, not by physics placing a wall at any wavelength.",
      },
    ],
    teacherUseCases: [
      "Speed-constancy emphasis: while the wavelength slider is set to three very different values (e.g., 10,000 nm, 500 nm, 0.01 nm), ask students to record the speed displayed for each band. All three should read c = 3 × 10⁸ m/s. Use this to directly confront the misconception that lower-energy waves travel slower. Connects to HS-PS4-1.",
      "E = hf calculation practice: set wavelength to 500 nm (green visible) with showPhoton enabled. Have students manually calculate f = c/λ and E = hf, then compare to the photon energy panel. Repeat at wavelength = 100 nm (UV) and wavelength = 10,000 nm (infrared) to build intuition for the energy range across the spectrum.",
      "Blackbody radiation tie-in: set wavelength to ~500 nm and explain that Wien's displacement law predicts the Sun's peak emission near 500 nm given its surface temperature of ~5,800 K. Ask students to predict which wavelength a cooler star (~3,500 K) would peak at, then verify using the formula λ_peak = 2.9 × 10⁶ nm·K / T.",
      "Application matching: give students a list of technologies that fall within the simulation's range — gamma: 0.001–0.01 nm (cancer radiation therapy); X-ray: 0.01–10 nm (airport imaging); UV: 10–380 nm (sunscreen, UV sterilization); visible: 380–750 nm (photography, solar cells); near-infrared: 750–2500 nm (TV remote, night vision); mid-infrared: 2500–10,000 nm (thermal cameras, infrared heaters) — and ask them to match each to a spectral band using the wavelength slider and band label. Reinforces HS-PS4-3's focus on technology applications of EM waves.",
      "Amplitude vs. frequency energy: set wavelength to 600 nm and sweep amplitude from 0.1 to 2 while watching the photon energy readout (showPhoton = 1). Confirm that photon energy does not change. Then set amplitude to 1 and sweep wavelength from 700 to 400 nm to show that shortening the wavelength raises photon energy. Clarifies the amplitude/frequency independence directly.",
    ],
    faq: [
      {
        question: "If all EM waves travel at the same speed, why do different materials slow some wavelengths more than others?",
        answer:
          "The speed c = 3 × 10⁸ m/s applies strictly in a vacuum. In a material like glass or water, EM waves interact with electrons in the medium and effectively slow down — an effect described by the index of refraction (n = c/v). The degree of slowing depends on how strongly the material's electrons respond to the oscillating field at a given frequency, which is why glass bends blue light more than red light (dispersion) and why X-rays pass through tissue that stops visible light.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "HS-PS4-1 asks students to use mathematical representations to support a claim regarding relationships among the frequency, wavelength, and speed of waves traveling in various media (c = fλ). HS-PS4-3 asks students to evaluate the claims, evidence, and reasoning behind the idea that EM radiation can be modeled as a wave or as a particle (photon), connecting the wave visualization here to the photon energy panel. Both standards are directly exercised by the wavelength and showPhoton controls.",
      },
      {
        question: "What does photon energy in eV actually mean, and is 1 eV a lot?",
        answer:
          "One electron-volt (eV) is the energy gained by a single electron accelerating through a 1-volt potential difference — equal to 1.6 × 10⁻¹⁹ J. It is a tiny amount by everyday standards but perfectly sized for atomic physics. Visible light photons carry about 1.7–3.1 eV each — enough to excite electrons in retinal molecules to trigger vision. UV photons above ~3.4 eV can drive photochemical reactions in DNA — such as forming pyrimidine dimers — that can cause mutations, which is why high-SPF sunscreen matters.",
      },
      {
        question: "Why is the visible range so narrow — only 380 to 750 nm?",
        answer:
          "The human eye evolved to detect the wavelengths most abundant in sunlight reaching Earth's surface. The Sun's ~5,800 K blackbody spectrum peaks near 500 nm, and Earth's atmosphere is particularly transparent between 300 and 800 nm. Eyes that responded to radio waves or X-rays would gain little survival advantage. Other animals use different windows: bees see UV, pit vipers sense infrared.",
      },
      {
        question: "How is amplitude different from intensity, and which one affects whether UV light causes a sunburn?",
        answer:
          "Amplitude is the peak displacement of the electric field in a single wave; intensity is the power delivered per unit area, which scales as amplitude squared and also depends on how many photons arrive per second (photon flux). For sunburn, both intensity (how many UV photons hit your skin) and photon energy (whether each photon has enough energy to damage DNA) matter. The wavelength slider controls photon energy; the amplitude slider scales the wave display but also represents relative intensity in this simulation.",
      },
    ],
  },
};
