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
  primaryStandard: "ap-physics-1",
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

  hook: {
    question: "Why does an ambulance siren sound different as it passes you — even though the siren never changes pitch?",
    context: "The siren emits the same frequency the entire time. What changes is the relative motion between the sound waves and your ears.",
    actionPrompt: "Start the experiment →",
  },

  learningCards: [
    {
      id: "de-lc1",
      title: "Wave Compression Ahead",
      content: "When a source moves toward you, each successive wavefront is emitted from a position closer to you. The wavefronts pile up, shortening the wavelength and raising the frequency you hear. This is why an approaching siren sounds higher-pitched.",
      relatedParameterId: "source_speed",
    },
    {
      id: "de-lc2",
      title: "The Doppler Formula",
      content: "The observed frequency depends on both the source speed and the wave speed in the medium. When the source approaches, the denominator shrinks, increasing the observed frequency. When it recedes, the denominator grows, decreasing it.",
      formula: { latex: "f_{obs} = f_s \\cdot \\frac{v}{v - v_s}", description: "Observed frequency for a source approaching a stationary observer" },
      relatedParameterId: "source_frequency",
    },
    {
      id: "de-lc3",
      title: "Breaking the Sound Barrier",
      content: "At Mach 1, the source travels as fast as its own sound waves. All wavefronts pile up at a single point, creating a massive pressure spike — the sonic boom. Beyond Mach 1, the source outruns its wavefronts, forming a cone-shaped shock wave.",
      formula: { latex: "M = \\frac{v_s}{v_{sound}}", description: "Mach number: source speed divided by speed of sound" },
      relatedParameterId: "source_speed",
    },
    {
      id: "de-lc4",
      title: "Doppler in Real Life",
      content: "Radar speed guns bounce microwaves off moving cars and measure the frequency shift. Doppler ultrasound measures blood flow velocity. Astronomers use redshift to determine that distant galaxies are moving away from us — evidence for the expanding universe.",
    },
    {
      id: "de-lc5",
      title: "Medium Matters",
      content: "The Doppler effect depends on the speed of sound in the medium. Sound travels at 343 m/s in air but 1,480 m/s in water. The same source speed produces a much smaller frequency shift in water because the waves travel so much faster relative to the source.",
      relatedParameterId: "medium",
    },
  ],

  easterEggs: [
    {
      parameterId: "source_speed",
      condition: "specific",
      triggerValue: 343,
      effect: "sonic-boom-shockwave",
      message: "BOOM! You've hit Mach 1 — the speed of sound in air. Chuck Yeager first broke the sound barrier in 1947 aboard the Bell X-1.",
    },
    {
      parameterId: "source_speed",
      condition: "max",
      effect: "mach-cone-visualization",
      message: "Mach 1.17! The source is supersonic — notice how the shock wave forms a cone. The faster you go, the narrower the Mach cone angle.",
    },
  ],

  challenges: [
    {
      id: "de-c1",
      question: "An ambulance moves toward an observer at 30 m/s with a siren at 800 Hz. What frequency does the observer hear? (v_sound = 343 m/s)",
      options: ["≈ 723 Hz", "≈ 800 Hz", "≈ 877 Hz", "≈ 960 Hz"],
      correctAnswer: "≈ 877 Hz",
      hint: "Observer stationary, source approaching: f_obs = f_s × v / (v − v_s)",
      relatedParameterId: "source_speed",
      tier: "free",
    },
    {
      id: "de-c2",
      question: "The same ambulance is now moving away. How does the observed frequency compare to the source frequency?",
      options: ["Higher than 800 Hz", "Exactly 800 Hz", "Lower than 800 Hz", "It depends on distance"],
      correctAnswer: "Lower than 800 Hz",
      hint: "Source receding: f_obs = f_s × v / (v + v_s). Is it higher or lower than 800 Hz?",
      relatedParameterId: "source_speed",
      tier: "free",
    },
    {
      id: "de-c3",
      question: "What happens to the wavefront pattern when source speed exactly equals the speed of sound (Mach 1)?",
      options: ["Wavefronts spread out evenly", "Wavefronts pile up at one point creating a shock wave", "Wavefronts disappear entirely", "Wavefronts reverse direction"],
      correctAnswer: "Wavefronts pile up at one point creating a shock wave",
      hint: "All wavefronts accumulate at the same point. What physical phenomenon does this produce?",
      relatedParameterId: "source_speed",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 20,
  relatedExperiments: ["wave-interference", "simple-harmonic-motion", "em-spectrum"],

  seoTitle: "Doppler Effect — Sound Wave Frequency Shift Simulation | Scivra",
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
