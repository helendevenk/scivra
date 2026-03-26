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
};
