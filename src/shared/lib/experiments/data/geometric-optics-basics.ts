import type { Experiment } from "@/shared/types/experiment";

export const geometricOpticsBasics: Experiment = {
  id: "geometric-optics-basics",
  slug: "geometric-optics-basics-lenses-mirrors",
  title: "Geometric Optics: Basics",
  subtitle: "Explore how lenses and mirrors form images",
  description:
    "Use ray tracing to understand how converging and diverging lenses and mirrors form images. Observe real vs. virtual images, magnification, and the thin lens equation.",
  thumbnail: "/imgs/experiments/geometric-optics-lenses.png",

  standards: {
    ngss: ["HS-PS4-5"],
    gcse: ["AQA P6.4", "AQA P6.5"],
    ap: ["GO-2.A", "GO-2.B", "GO-2.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "waves",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["geometric optics", "lens", "mirror", "ray tracing", "focal length", "image formation"],
  difficulty: "intermediate",

  parameters: [
    { id: "focal_length", label: "Focal Length", unit: "cm", min: -50, max: 50, default: 20, step: 1, tier: "free" },
    { id: "object_distance", label: "Object Distance", unit: "cm", min: 5, max: 100, default: 40, step: 1, tier: "free" },
    { id: "lens_type", label: "Lens/Mirror Type", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}", description: "Thin lens equation" },
    { latex: "m = -\\frac{d_i}{d_o}", description: "Magnification" },
    { latex: "P = \\frac{1}{f}", description: "Lens power (diopters)" },
  ],

  theory:
    "Converging (convex) lenses bend light rays toward the focal point. The thin lens equation relates object distance d_o, image distance d_i, and focal length f. When d_o > f, a real, inverted image forms; when d_o < f, a virtual, upright image appears (magnifying glass). Diverging (concave) lenses always form virtual, diminished, upright images. Mirrors follow the same mathematics with light traveling on one side.",
  instructions:
    "Drag the object (arrow) along the principal axis. Rays automatically trace through the lens. Toggle between converging/diverging lens and concave/convex mirror. Observe how image position and orientation change as object crosses the focal point.",
  challenges: [
    { id: "gob-c1", question: "An object is 30cm from a converging lens with f=10cm. Where is the image?", hint: "1/f = 1/d_o + 1/d_i → 1/d_i = 1/10 − 1/30 = 2/30 → d_i = 15cm", tier: "free" },
    { id: "gob-c2", question: "What is the magnification for the setup above?", hint: "m = −d_i/d_o = −15/30 = −0.5 (inverted, smaller)", tier: "free" },
    { id: "gob-c3", question: "Why does a magnifying glass work? (d_o < f)", hint: "When d_o < f, the lens equation gives d_i < 0: a virtual upright image appears on the same side", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["geometric-optics-lenses", "bending-light", "color-vision"],

  seoTitle: "Geometric Optics Basics — Lens and Mirror Simulation | AP Physics 2",
  seoKeywords: ["geometric optics", "lens", "mirror", "ray tracing", "focal length", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Geometric Optics, Lenses, Image Formation" },
};
