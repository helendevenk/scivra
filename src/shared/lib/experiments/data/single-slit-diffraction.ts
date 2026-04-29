import type { Experiment } from "@/shared/types/experiment";

export const singleSlitDiffraction: Experiment = {
  id: "single-slit-diffraction",
  slug: "single-slit-diffraction-pattern",
  title: "Single-Slit Diffraction",
  subtitle: "Explore how slit width and wavelength shape the diffraction intensity pattern",
  description:
    "Shine monochromatic light through a single slit and watch the Fraunhofer diffraction pattern form on a distant screen. Adjust slit width and wavelength to see the central maximum widen or narrow, and observe minima positions shift. Compare with double-slit interference to understand how diffraction modulates the multi-slit envelope.",
  thumbnail: "/imgs/experiments/single-slit-diffraction.png",

  standards: {
    ngss: ["HS-PS4-3"],
    gcse: ["P7.1"],
    ap: ["WVS-1.D", "WVS-1.E"],
  },
  primaryStandard: "ap-physics-2",
  category: "waves",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["diffraction", "single slit", "light waves", "interference", "Fraunhofer", "AP Physics 2", "optics"],
  difficulty: "advanced",

  parameters: [
    {
      id: "slit_width",
      label: "Slit Width (a)",
      unit: "μm",
      min: 0.5,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "wavelength",
      label: "Wavelength",
      unit: "nm",
      min: 380,
      max: 780,
      default: 550,
      step: 10,
      tier: "free",
    },
    {
      id: "screen_distance",
      label: "Screen Distance",
      unit: "m",
      min: 0.5,
      max: 5,
      default: 2,
      step: 0.5,
      tier: "pro",
    },
    {
      id: "compare_double",
      label: "Compare Double-Slit (0=off, 1=on)",
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
      latex: "a \\sin\\theta = m\\lambda \\quad (m = \\pm1, \\pm2, \\ldots)",
      description: "Dark fringe condition for single-slit diffraction",
    },
    {
      latex: "\\Delta y \\approx \\frac{\\lambda L}{a}",
      description: "Approximate fringe spacing on a distant screen",
    },
    {
      latex: "I(\\theta) \\propto \\left[\\frac{\\sin\\alpha}{\\alpha}\\right]^2 \\quad \\alpha = \\frac{\\pi a \\sin\\theta}{\\lambda}",
      description: "Intensity distribution (sinc² envelope)",
    },
  ],

  theory:
    "Single-slit diffraction arises from Huygens' principle: every point within the slit acts as a secondary wavelet source. At the central maximum (θ = 0) all wavelets arrive in phase, producing maximum intensity. At the first minimum, the slit can be divided into two halves whose wavelets cancel pairwise. The condition a·sinθ = mλ locates all minima (m ≠ 0). The central bright fringe is twice as wide as the side maxima and carries most of the light energy. Narrowing the slit increases diffraction (wider central maximum) — a direct consequence of Heisenberg's uncertainty principle at the quantum level. When two slits are present, the single-slit envelope modulates the double-slit interference fringes, producing missing orders wherever a diffraction minimum coincides with an interference maximum.",

  instructions:
    "Start with default settings (a = 5 μm, λ = 550 nm). Drag the slit width slider and watch the central maximum expand as the slit narrows. Change wavelength using the color-coded slider — longer wavelengths diffract more. Move the screen closer or farther (Pro) to observe how the angular positions are fixed but spatial positions scale with L. Toggle double-slit comparison (Pro) to see how the sinc² envelope suppresses some double-slit fringes.",

  challenges: [
    {
      id: "ssd-c1",
      question: "The slit width is halved. How does the width of the central bright fringe change?",
      hint: "Central fringe width ∝ λL/a. If a halves, what happens to the width?",
      tier: "free",
    },
    {
      id: "ssd-c2",
      question: "Red light (700 nm) replaces green light (550 nm) through the same slit. How does the diffraction pattern change?",
      hint: "Longer wavelength → larger sinθ for minima → wider pattern.",
      tier: "free",
    },
    {
      id: "ssd-c3",
      question: "Why is the central maximum much wider and brighter than the secondary maxima?",
      hint: "Consider how many wavelets add constructively at θ = 0 versus at a secondary maximum. Also compare the areas under each lobe of the sinc² curve.",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["wave-interference", "geometric-optics-lenses", "em-spectrum"],

  seoTitle: "Single-Slit Diffraction — Light Pattern Simulation | Scivra",
  seoKeywords: [
    "single slit diffraction simulation",
    "diffraction pattern",
    "Fraunhofer diffraction",
    "AP Physics 2 optics",
    "wavelength slit width",
    "sinc squared intensity",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Single-Slit Diffraction and Wave Optics",
  },
};
