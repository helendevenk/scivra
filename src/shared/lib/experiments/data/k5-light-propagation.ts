import type { Experiment } from "@/shared/types/experiment";

export const k5LightPropagation: Experiment = {
  id: "k5-light-propagation",
  slug: "k5-light-propagation",
  title: "Light & Optics",
  subtitle: "How light travels, reflects, and bends",
  description:
    "Shine a beam of light and see it travel in straight lines. Aim at mirrors to watch reflection. Send light through water or glass to see refraction — the bending of light. Discover why objects appear different colors and how shadows form.",
  thumbnail: "/imgs/experiments/k5-light-propagation.png",

  standards: {
    ngss: ["1-PS4-3", "4-PS4-2", "MS-PS4-2"],
    gcse: [],
    ap: [],
  },
  category: "waves",
  subject: "physics",
  gradeLevel: "3-5",
  tags: ["light", "reflection", "refraction", "shadow", "optics", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "lightAngle",
      label: "Light Source Angle",
      unit: "°",
      min: 0,
      max: 90,
      default: 45,
      step: 5,
      tier: "free",
    },
    {
      id: "medium",
      label: "Medium (0=Air, 1=Water, 2=Glass)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "mirrorAngle",
      label: "Mirror Angle",
      unit: "°",
      min: 0,
      max: 90,
      default: 45,
      step: 5,
      tier: "free",
    },
    {
      id: "colorFilter",
      label: "Light Color (0=White, 1=Red, 2=Blue, 3=Green)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\theta_i = \\theta_r \\quad (\\text{law of reflection})",
      description: "Angle of incidence = angle of reflection",
    },
    {
      latex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 \\quad (\\text{Snell's law})",
      description: "Snell's Law — light bends when entering a new medium",
    },
  ],

  theory:
    "Light travels in straight lines called rays. When light hits a smooth surface (like a mirror), it bounces off — this is reflection. The angle at which light hits equals the angle at which it bounces: angle of incidence = angle of reflection. When light passes from one material to another (air to water, for example), it bends — this is refraction. Light bends toward the normal line when entering a denser medium and away when leaving. This is why a straw looks bent in a glass of water. Objects appear a certain color because they reflect that color of light and absorb all others. Transparent objects let light through; opaque objects block it; translucent objects let some through.",

  instructions:
    "Adjust the light source angle and watch the beam travel. Aim it at the mirror and see reflection — measure both angles! Switch the medium to Water or Glass and watch the beam bend as it crosses the boundary. Use the color filter (Pro) to explore how color affects refraction.",

  challenges: [
    {
      id: "lp-c1",
      question: "If a light ray hits a mirror at 30° from the normal, at what angle does it reflect?",
      hint: "Law of reflection: angle of incidence = angle of reflection. The reflected ray leaves at 30° from the normal.",
      tier: "free",
    },
    {
      id: "lp-c2",
      question: "Why does a straw appear bent when placed in a glass of water?",
      hint: "Light bends (refracts) when it moves from water (denser) to air (less dense). Your eyes trace the light back in a straight line, making the straw appear bent at the water surface.",
      tier: "free",
    },
    {
      id: "lp-c3",
      question: "Why does a red apple appear red?",
      hint: "The apple absorbs most wavelengths of light but reflects red wavelengths. Only the reflected red light reaches your eyes, so the apple appears red.",
      tier: "free",
    },
    {
      id: "lp-c4",
      question: "Light travels at 3×10⁸ m/s in air and at 2.25×10⁸ m/s in water. What is the index of refraction of water?",
      hint: "n = c/v = (3×10⁸)/(2.25×10⁸) = 1.33. This is why light bends when entering water.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-sound-waves", "em-spectrum", "wave-interference"],

  seoTitle: "Light and Optics for Kids | NeonPhysics Elementary Science",
  seoKeywords: [
    "light reflection refraction kids",
    "optics simulation elementary",
    "Snell's law interactive",
    "shadow formation simulation",
    "K-5 physics light",
    "mirror reflection kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Light Propagation and Optics",
  },
};
