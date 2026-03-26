import type { Experiment } from "@/shared/types/experiment";

export const geometricOpticsLenses: Experiment = {
  id: "geometric-optics-lenses",
  slug: "geometric-optics-lenses-mirrors-ray-tracing",
  title: "Geometric Optics — Lenses & Mirrors",
  subtitle: "Trace rays through lenses and discover image formation",
  description:
    "Use the thin lens equation to predict where images form. Adjust focal length and object distance to see real versus virtual images, and explore how magnification changes with object position.",
  thumbnail: "/imgs/experiments/geometric-optics-lenses.png",

  standards: {
    ngss: ["HS-PS4-1", "HS-PS4-5"],
    gcse: ["P7.1", "P7.2"],
    ap: ["WVS-2.A", "WVS-2.B", "WVS-2.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "waves",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["optics", "lens", "mirror", "ray tracing", "focal length", "magnification", "refraction"],
  difficulty: "beginner",

  parameters: [
    {
      id: "focal_length",
      label: "Focal Length",
      unit: "cm",
      min: -50,
      max: 50,
      default: 20,
      step: 1,
      tier: "free",
    },
    {
      id: "object_distance",
      label: "Object Distance",
      unit: "cm",
      min: 5,
      max: 100,
      default: 30,
      step: 1,
      tier: "free",
    },
    {
      id: "lens_type",
      label: "Lens Type (0=Convex, 1=Concave)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "pro",
    },
    {
      id: "object_height",
      label: "Object Height",
      unit: "cm",
      min: 1,
      max: 20,
      default: 5,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}",
      description: "Thin Lens Equation",
    },
    {
      latex: "m = -\\frac{v}{u}",
      description: "Magnification",
    },
    {
      latex: "v > 0 \\Rightarrow \\text{Real image},\\quad v < 0 \\Rightarrow \\text{Virtual image}",
      description: "Image type by sign of image distance",
    },
  ],

  theory:
    "Geometric optics models light as rays that travel in straight lines and bend at interfaces according to Snell's Law. A thin lens refracts parallel rays to converge at (convex) or diverge from (concave) the focal point. The thin lens equation 1/f = 1/v + 1/u relates the focal length, image distance, and object distance, while the magnification m = -v/u describes image size and orientation.",
  instructions:
    "Set the focal length with the slider — positive values give a convex lens, negative values a concave lens. Move the object distance slider and observe how the image position and magnification change in real time. Switch to Pro mode to change object height and toggle lens type explicitly.",

  challenges: [
    {
      id: "gol-c1",
      question: "An object is 30 cm from a convex lens with f = 20 cm. Where does the image form?",
      hint: "Apply 1/f = 1/v + 1/u with u = 30 and f = 20",
      tier: "free",
    },
    {
      id: "gol-c2",
      question: "Under what condition does a convex lens produce a virtual image?",
      hint: "Compare the object distance to the focal length",
      tier: "free",
    },
    {
      id: "gol-c3",
      question: "An object is placed at 2f from a convex lens. Calculate the magnification.",
      hint: "Find image distance first, then use m = -v/u",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["wave-interference", "em-spectrum", "simple-harmonic-motion"],

  seoTitle: "Geometric Optics Lenses & Mirrors — Interactive Ray Tracing | NeonPhysics",
  seoKeywords: [
    "geometric optics",
    "thin lens equation",
    "ray tracing",
    "convex lens",
    "concave lens",
    "magnification",
    "physics simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Geometric Optics — Thin Lens Equation and Ray Tracing",
  },
};
