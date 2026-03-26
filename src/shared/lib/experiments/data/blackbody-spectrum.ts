import type { Experiment } from "@/shared/types/experiment";

export const blackbodySpectrum: Experiment = {
  id: "blackbody-spectrum",
  slug: "blackbody-spectrum-radiation",
  title: "Blackbody Spectrum",
  subtitle: "Explore thermal radiation and the quantum revolution",
  description:
    "Adjust the temperature of a glowing object and observe how its emission spectrum changes. Discover Wien's Displacement Law, Stefan-Boltzmann Law, and why classical physics failed to predict the spectrum.",
  thumbnail: "/imgs/experiments/photoelectric-effect.png",

  standards: {
    ngss: ["HS-PS4-1", "HS-PS4-3"],
    gcse: ["AQA P7.1"],
    ap: ["MOD-1.A", "MOD-1.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["blackbody radiation", "Wien's law", "Stefan-Boltzmann", "thermal emission", "quantum physics", "Planck"],
  difficulty: "intermediate",

  parameters: [
    { id: "temperature", label: "Temperature", unit: "K", min: 300, max: 30000, default: 5778, step: 100, tier: "free" },
  ],

  formulas: [
    { latex: "\\lambda_{max} = \\frac{b}{T}", description: "Wien's Displacement Law (b = 2.898×10⁻³ m·K)" },
    { latex: "P = \\sigma A T^4", description: "Stefan-Boltzmann Law" },
    { latex: "E = h\\nu = \\frac{hc}{\\lambda}", description: "Photon energy (Planck)" },
  ],

  theory:
    "A blackbody is an ideal object that absorbs all incident radiation and emits radiation based solely on its temperature. As temperature increases, the peak emission wavelength shifts to shorter wavelengths (Wien's Law) and total power increases dramatically (Stefan-Boltzmann). Classical physics predicted infinite emission at short wavelengths (ultraviolet catastrophe). Planck resolved this by quantizing energy, birthing quantum mechanics.",
  instructions:
    "Use the temperature slider to change the object's temperature. Observe the emission spectrum shift from infrared (red glow) to visible white. The spectrum peak follows Wien's Law. Compare with the failed classical Rayleigh-Jeans prediction.",
  challenges: [
    { id: "bb-c1", question: "The Sun's surface is ~5778K. What is its peak emission wavelength?", hint: "λ_max = 2.898×10⁻³ / 5778", tier: "free" },
    { id: "bb-c2", question: "At what temperature does an object peak in the visible range (~550nm)?", hint: "Solve Wien's Law for T: T = b/λ_max", tier: "free" },
    { id: "bb-c3", question: "How much more power does a 6000K star emit compared to a 3000K star?", hint: "P ∝ T⁴; ratio = (6000/3000)⁴ = 16", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["photoelectric-effect", "models-hydrogen-atom", "molecules-and-light"],

  seoTitle: "Blackbody Spectrum Simulation | Wien's Law | AP Physics 2",
  seoKeywords: ["blackbody radiation", "Wien's displacement law", "Stefan-Boltzmann", "thermal radiation", "AP Physics 2", "quantum"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Blackbody Radiation, Wien's Law, Stefan-Boltzmann Law" },
};
