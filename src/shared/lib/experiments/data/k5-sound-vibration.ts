import type { Experiment } from "@/shared/types/experiment";

export const k5SoundVibration: Experiment = {
  id: "k5-sound-vibration",
  slug: "k5-sound-vibration",
  title: "Sound & Vibration",
  subtitle: "How vibrations create sound waves with pitch and volume",
  description: "Discover how sound is made by vibrations! Pluck virtual strings, hit drums, and blow across bottles to see how vibrations travel as sound waves. Change the frequency to hear pitch changes and adjust amplitude to control volume. See sound waves visualized in real time.",
  thumbnail: "/imgs/experiments/k5-sound-vibration.png",
  standards: { ngss: ["1-PS4-1", "4-PS4-1"], gcse: [], ap: [] },
  primaryStandard: "elementary-k5",
  category: "waves",
  subject: "physics",
  gradeLevel: "3-5",
  tags: ["sound", "vibration", "waves", "pitch", "volume", "K-5 physics"],
  difficulty: "beginner",
  parameters: [
    { id: "frequency", label: "Frequency (Pitch)", unit: "Hz", min: 100, max: 2000, default: 440, step: 20, tier: "free" },
    { id: "amplitude", label: "Amplitude (Volume)", unit: "%", min: 10, max: 100, default: 50, step: 5, tier: "free" },
    { id: "medium", label: "Medium (0=air, 1=water, 2=steel)", unit: "", min: 0, max: 2, default: 0, step: 1, tier: "free" },
  ],
  formulas: [
    { latex: "v = f \\lambda", description: "Wave speed equals frequency times wavelength" },
  ],
  theory: "Sound is created by vibrations. When an object vibrates, it pushes air molecules back and forth, creating pressure waves that travel outward. Frequency (measured in Hertz) determines pitch: more vibrations per second = higher pitch. Amplitude determines volume: bigger vibrations = louder sound. Sound travels through different materials at different speeds: ~343 m/s in air, ~1480 m/s in water, ~5960 m/s in steel. Sound cannot travel through a vacuum because there are no molecules to vibrate.",
  instructions: "Adjust the frequency slider to change pitch and the amplitude slider to change volume. Watch the wave visualization change in real time. Compare how sound travels through air, water, and steel.",
  challenges: [
    { id: "ksv-c1", question: "Why does a short guitar string make a higher sound than a long one?", hint: "A shorter string vibrates faster (higher frequency), which we hear as a higher pitch", tier: "free" },
    { id: "ksv-c2", question: "Why can't astronauts hear each other in space without radios?", hint: "Space is a vacuum — there are no air molecules to carry sound vibrations", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 10,
  relatedExperiments: ["k5-solar-energy"],
  htmlPath: "/experiments/elementary/k5-sound-vibration.html",
  seoTitle: "Sound & Vibration for Kids | Scivra K-5 Science",
  seoKeywords: ["sound waves for kids", "vibration simulation", "pitch volume interactive", "K-5 physics"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Elementary School", teaches: "Sound and Vibration" },
};
