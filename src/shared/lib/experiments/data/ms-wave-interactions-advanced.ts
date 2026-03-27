import type { Experiment } from "@/shared/types/experiment";

export const msWaveInteractionsAdvanced: Experiment = {
  id: "ms-wave-interactions-advanced",
  slug: "ms-wave-interactions-advanced",
  title: "Wave Interactions",
  subtitle: "Reflection, refraction, diffraction, and interference of waves",
  description:
    "Explore the four fundamental wave behaviors in one simulation. Watch waves bounce off barriers (reflection), bend when entering a new medium (refraction), spread around obstacles (diffraction), and combine with other waves (interference). Switch between transverse and longitudinal wave types, adjust frequency, and change the medium to see how each property affects wave behavior.",
  thumbnail: "/imgs/experiments/ms-wave-interactions-advanced.png",

  standards: {
    ngss: ["MS-PS4-1", "MS-PS4-2"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "waves",
  subject: "physics",
  gradeLevel: "6-8",
  tags: [
    "waves",
    "reflection",
    "refraction",
    "diffraction",
    "interference",
    "wave behavior",
    "middle school",
    "6-8",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "waveType",
      label: "Wave Type (0=Transverse, 1=Longitudinal)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "frequency",
      label: "Wave Frequency",
      unit: "Hz",
      min: 0.5,
      max: 10,
      default: 2,
      step: 0.5,
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
  ],

  formulas: [
    {
      latex: "v = f \\lambda \\quad \\text{(wave equation)}",
      description:
        "Wave speed equals frequency times wavelength — the universal relationship for all waves",
    },
    {
      latex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 \\quad \\text{(Snell's law)}",
      description:
        "Describes how waves bend when passing between media with different speeds (refraction)",
    },
  ],

  theory:
    "Waves transfer energy without transferring matter. A transverse wave (like a wave on a rope or light) oscillates perpendicular to its travel direction. A longitudinal wave (like sound) oscillates parallel to its travel direction. All waves share four behaviors. Reflection: when a wave hits a barrier, it bounces back — the angle of incidence equals the angle of reflection. This is why you see your reflection in a mirror and hear echoes off walls. Refraction: when a wave passes from one medium to another (air to water, for example), it changes speed and bends. Snell's law (n1 sin theta1 = n2 sin theta2) describes the bending angle. This is why a straw looks bent in a glass of water. Diffraction: waves spread out when passing through a gap or around an obstacle. Smaller gaps (relative to wavelength) cause more spreading. This is why you can hear someone around a corner but not see them — sound waves have long wavelengths that diffract easily, while light wavelengths are tiny. Interference: when two waves meet, they combine. Constructive interference (peaks align) makes a bigger wave; destructive interference (peak meets trough) cancels them out. Noise-cancelling headphones use destructive interference.",

  instructions:
    "Select a wave type and adjust the frequency. Watch the wave propagate across the screen. The simulation shows all four interactions: the wave reflects off a barrier on the right, refracts when crossing into a different medium (change the medium slider), diffracts through a gap in a wall, and interferes with a second wave source. Higher frequency means shorter wavelength — observe how this affects diffraction spreading.",

  challenges: [
    {
      id: "mwa-c1",
      question:
        "A wave has a frequency of 4 Hz and a wavelength of 0.5 m. What is its speed? If it enters water where the speed drops to 1.5 m/s, what happens to its wavelength?",
      hint: "v = f × lambda = 4 × 0.5 = 2 m/s. When entering water, frequency stays the same (4 Hz) but speed changes. New wavelength = v/f = 1.5/4 = 0.375 m. The wavelength shrinks, which is why the wave bends (refracts) — one side slows down before the other.",
      tier: "free",
    },
    {
      id: "mwa-c2",
      question:
        "You can hear someone talking around a corner, but you cannot see them. Explain this using diffraction.",
      hint: "Diffraction depends on the ratio of wavelength to obstacle size. Sound waves have wavelengths of 0.02-17 meters — similar to doorway sizes, so they diffract strongly around corners. Visible light has wavelengths around 400-700 nanometers (millions of times smaller than a doorway), so light barely diffracts and travels in straight lines. That is why sound bends around corners but light does not.",
      tier: "free",
    },
    {
      id: "mwa-c3",
      question:
        "Two speakers play the same note. At some spots the sound is extra loud, at others it is nearly silent. What is happening?",
      hint: "This is wave interference. Where the peaks of both sound waves arrive together (constructive interference), the amplitudes add up — extra loud. Where a peak from one speaker meets a trough from the other (destructive interference), they cancel out — nearly silent. These loud and quiet spots form an interference pattern that depends on the wavelength and speaker positions.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["wave-interference", "wave-on-string"],

  htmlPath: "/experiments/middle/ms-wave-interactions-advanced.html",

  seoTitle: "Wave Interactions: Reflection, Refraction, Diffraction | Scivra Middle School Physics",
  seoKeywords: [
    "wave interactions simulation middle school",
    "reflection refraction diffraction interference",
    "wave behavior interactive 6-8",
    "Snell's law wave equation simulation",
    "NGSS MS-PS4-1 MS-PS4-2 waves",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Wave Interactions — Reflection, Refraction, Diffraction, and Interference",
  },
};
