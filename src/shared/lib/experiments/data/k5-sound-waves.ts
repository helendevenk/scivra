import type { Experiment } from "@/shared/types/experiment";

export const k5SoundWaves: Experiment = {
  id: "k5-sound-waves",
  slug: "k5-sound-waves",
  title: "Sound Waves",
  subtitle: "Vibrations, pitch, and volume",
  description:
    "Create sound by making objects vibrate and watch the sound wave travel through air. Adjust frequency to change pitch (high vs low sounds) and amplitude to change volume (loud vs quiet). See how sound waves look and why they need matter to travel.",
  thumbnail: "/imgs/experiments/k5-sound-waves.png",

  standards: {
    ngss: ["1-PS4-1", "4-PS4-1", "MS-PS4-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "waves",
  subject: "physics",
  gradeLevel: "3-5",
  tags: ["sound", "vibration", "pitch", "frequency", "amplitude", "volume", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "frequency",
      label: "Frequency (Pitch)",
      unit: "Hz",
      min: 50,
      max: 2000,
      default: 440,
      step: 10,
      tier: "free",
    },
    {
      id: "amplitude",
      label: "Amplitude (Volume)",
      unit: "",
      min: 0,
      max: 1,
      default: 0.5,
      step: 0.05,
      tier: "free",
    },
    {
      id: "medium",
      label: "Medium (0=Air, 1=Water, 2=Vacuum)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "instrumentType",
      label: "Instrument (0=Speaker, 1=String, 2=Drum)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "v = f\\lambda \\quad (\\text{wave speed = frequency × wavelength})",
      description: "Speed of sound in air ≈ 343 m/s at 20°C",
    },
    {
      latex: "f_{\\text{high}} \\to \\text{high pitch} \\quad A_{\\text{large}} \\to \\text{loud}",
      description: "Higher frequency = higher pitch; larger amplitude = louder",
    },
  ],

  theory:
    "Sound is a mechanical wave caused by vibrations. When an object vibrates (like a guitar string or vocal cords), it pushes and pulls on the surrounding air molecules, creating compressions (dense regions) and rarefactions (sparse regions) that travel outward as a sound wave. Frequency (measured in Hertz, Hz) determines pitch — more vibrations per second = higher pitch. Amplitude determines loudness — bigger vibrations = louder sound. Sound needs matter (air, water, solid) to travel — it cannot travel through a vacuum. Sound travels fastest through solids (about 5000 m/s in steel) and slowest through gases (343 m/s in air).",

  instructions:
    "Press Play and adjust the Frequency slider — higher frequency creates higher-pitched sound waves. Move the Amplitude slider to make the wave bigger (louder) or smaller (quieter). Switch the medium to Vacuum — the wave disappears! No matter = no sound.",

  challenges: [
    {
      id: "sw-c1",
      question: "What is the pitch of a sound with 440 Hz frequency? What note is this?",
      hint: "440 Hz is a relatively high pitch. It corresponds to the musical note A4 (middle A), used as a tuning reference by orchestras.",
      tier: "free",
    },
    {
      id: "sw-c2",
      question: "Why can't astronauts hear explosions in space?",
      hint: "Sound needs matter (like air molecules) to travel — it creates pressure waves by pushing molecules together. Space is a vacuum with no molecules, so sound cannot propagate.",
      tier: "free",
    },
    {
      id: "sw-c3",
      question: "A sound wave has a frequency of 343 Hz. What is its wavelength in air?",
      hint: "v = fλ → λ = v/f = 343/343 = 1 m. Each full wave cycle is 1 meter long.",
      tier: "free",
    },
    {
      id: "sw-c4",
      question: "Why do you see lightning before you hear thunder, even though they happen at the same time?",
      hint: "Light travels at 3×10⁸ m/s — almost instantaneous. Sound travels at 343 m/s. Over 1 km, light arrives in 0.000003 s; sound takes about 3 seconds. Count seconds between flash and thunder, divide by 3 to estimate km.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-light-propagation", "wave-interference", "em-spectrum"],

  seoTitle: "Sound Waves for Kids | NeonPhysics Elementary Science",
  seoKeywords: [
    "sound waves kids simulation",
    "pitch frequency amplitude interactive",
    "vibration sound elementary",
    "K-5 waves science",
    "sound energy kids",
    "wave speed simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Sound Waves and Vibrations",
  },
};
