import type { Experiment } from "@/shared/types/experiment";

export const dopplerEffect: Experiment = {
  id: "doppler-effect",
  slug: "doppler-effect-sound-waves",
  title: "Doppler Effect",
  subtitle: "Observe frequency shifts as source and observer move relative to each other",
  description:
    "Drive a sound source toward and away from a stationary observer and hear the pitch shift in real time. Animated wavefronts compress ahead of the source and stretch behind it. Adjust source speed past the sound barrier to create a shock wave — and explore how the same physics applies to light in astrophysics.",
  thumbnail: "/imgs/experiments/doppler-effect.png",

  standards: {
    ngss: ["HS-PS4-1"],
    gcse: ["P6.4"],
    ap: ["WVS-1.B", "WVS-1.C"],
  },
  category: "waves",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["doppler effect", "sound waves", "frequency shift", "Mach number", "shock wave", "AP Physics 1", "waves"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "source_frequency",
      label: "Source Frequency",
      unit: "Hz",
      min: 200,
      max: 1000,
      default: 440,
      step: 10,
      tier: "free",
    },
    {
      id: "source_speed",
      label: "Source Speed",
      unit: "m/s",
      min: 0,
      max: 400,
      default: 30,
      step: 5,
      tier: "free",
    },
    {
      id: "observer_position",
      label: "Observer Position",
      unit: "m",
      min: -50,
      max: 50,
      default: 0,
      step: 5,
      tier: "pro",
    },
    {
      id: "medium",
      label: "Medium (0=air 343 m/s, 1=water 1480 m/s)",
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
      latex: "f_{obs} = f_s \\cdot \\frac{v \\pm v_{obs}}{v \\mp v_s}",
      description: "Doppler formula: upper signs when source/observer approach, lower signs when receding",
    },
    {
      latex: "M = \\frac{v_s}{v_{sound}}",
      description: "Mach number: ratio of source speed to sound speed",
    },
    {
      latex: "\\lambda_{front} = \\frac{v - v_s}{f_s}",
      description: "Compressed wavelength in front of a moving source",
    },
  ],

  theory:
    "The Doppler effect occurs because a moving source continuously changes its position relative to the wavefronts it emits. As the source approaches, wavefronts pile up — wavelength decreases, frequency increases. As it recedes, wavefronts spread — frequency decreases. The Doppler formula applies to any wave: sound, light (redshift/blueshift), and even radar speed guns. When source speed equals sound speed (Mach 1), wavefronts accumulate at one point forming a shock wave — the sonic boom. At Mach > 1, the source outruns its own wavefronts, creating a Mach cone. In medicine, Doppler ultrasound uses these frequency shifts to measure blood flow velocity.",

  instructions:
    "Set source frequency (try 440 Hz — concert A) and drag the source speed slider. The circular wavefronts animate in real time showing compression ahead and expansion behind. The observer panel displays observed frequency and the percentage change from source frequency. Enable Pro parameters to reposition the observer or switch to water as the medium and notice how the much higher wave speed changes the effect.",

  challenges: [
    {
      id: "de-c1",
      question: "An ambulance moves toward an observer at 30 m/s with a siren at 800 Hz. What frequency does the observer hear? (v_sound = 343 m/s)",
      hint: "Observer stationary, source approaching: f_obs = f_s × v / (v − v_s)",
      tier: "free",
    },
    {
      id: "de-c2",
      question: "The same ambulance is now moving away. How does the observed frequency compare to the source frequency?",
      hint: "Source receding: f_obs = f_s × v / (v + v_s). Is it higher or lower than 800 Hz?",
      tier: "free",
    },
    {
      id: "de-c3",
      question: "What happens to the wavefront pattern when source speed exactly equals the speed of sound (Mach 1)?",
      hint: "All wavefronts accumulate at the same point. What physical phenomenon does this produce?",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 20,
  relatedExperiments: ["wave-interference", "simple-harmonic-motion", "em-spectrum"],

  seoTitle: "Doppler Effect — Sound Wave Frequency Shift Simulation | NeonPhysics",
  seoKeywords: [
    "doppler effect simulation",
    "sound frequency shift",
    "Mach number",
    "shock wave",
    "AP Physics 1 waves",
    "doppler ultrasound",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Doppler Effect and Wave Frequency Shifts",
  },
};
