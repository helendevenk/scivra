import type { Experiment } from "@/shared/types/experiment";

export const colorVision: Experiment = {
  id: "color-vision",
  slug: "color-vision-light-mixing",
  title: "Color Vision",
  subtitle: "Explore how eyes and the brain perceive color from light",
  description:
    "Mix red, green, and blue light to produce any visible color. Explore additive color mixing, how the eye's cone cells detect wavelengths, and why mixing all colors of light produces white.",
  thumbnail: "/imgs/experiments/geometric-optics-lenses.png",

  standards: {
    ngss: ["HS-PS4-3", "HS-PS4-5"],
    gcse: ["AQA P6.5"],
    ap: ["GO-3.A"],
  },
  primaryStandard: "ap-physics-2",
  category: "waves",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["color", "light", "RGB", "additive mixing", "wavelength", "cone cells", "perception"],
  difficulty: "beginner",

  parameters: [
    { id: "red", label: "Red Intensity", unit: "%", min: 0, max: 100, default: 50, step: 1, tier: "free" },
    { id: "green", label: "Green Intensity", unit: "%", min: 0, max: 100, default: 50, step: 1, tier: "free" },
    { id: "blue", label: "Blue Intensity", unit: "%", min: 0, max: 100, default: 50, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "c = f\\lambda", description: "Speed of light" },
    { latex: "\\lambda_{visible} \\approx 380\\text{–}700\\text{ nm}", description: "Visible spectrum range" },
  ],

  theory:
    "The human eye contains three types of cone cells sensitive to red (~700nm), green (~550nm), and blue (~440nm) wavelengths. Color perception arises from the relative stimulation of these three cone types. Additive color mixing (light sources) differs from subtractive mixing (pigments): combining red + green light gives yellow, while red + green pigments give brown.",
  instructions:
    "Use the RGB sliders to mix colored lights. Observe the resulting color in the center. Move the lights to see how overlapping regions combine. Use the spectrum view to see which wavelengths are present.",
  challenges: [
    { id: "cv-c1", question: "What color results from mixing red and blue light at equal intensity?", hint: "Red + Blue = Magenta in additive mixing", tier: "free" },
    { id: "cv-c2", question: "What combination produces white light?", hint: "Red + Green + Blue at equal intensities = white", tier: "free" },
    { id: "cv-c3", question: "Why does a red apple look red under white light but black under pure green light?", hint: "The apple reflects red wavelengths; green light has no red to reflect", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["bending-light", "em-spectrum", "geometric-optics-basics"],

  seoTitle: "Color Vision Simulation | RGB Light Mixing | Physics Lab",
  seoKeywords: ["color vision", "RGB light", "additive color mixing", "wavelength", "optics", "physics simulation"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Color Vision, Light Mixing, Additive Color" },
};
