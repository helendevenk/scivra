import type { Experiment } from "@/shared/types/experiment";

export const fourierMakingWaves: Experiment = {
  id: "fourier-making-waves",
  slug: "fourier-series-wave-synthesis",
  title: "Fourier: Making Waves",
  subtitle: "Build any wave by adding sine components",
  description:
    "Add harmonics to build square waves, triangle waves, and sawtooth waves from pure sine components. Explore Fourier series decomposition and understand how complex signals are made from simple oscillations.",
  thumbnail: "/imgs/experiments/wave-interference.png",

  standards: {
    ngss: ["HS-PS4-1"],
    gcse: ["AQA P6.1"],
    ap: ["GO-5.A"],
  },
  primaryStandard: "ap-physics-1",
  category: "waves",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["Fourier series", "wave synthesis", "harmonics", "square wave", "signal analysis", "superposition"],
  difficulty: "advanced",

  parameters: [
    { id: "n_harmonics", label: "Number of Harmonics", unit: "", min: 1, max: 11, default: 1, step: 1, tier: "free" },
    { id: "target_wave", label: "Target Wave Shape", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
    { id: "a1", label: "A₁ (fundamental)", unit: "", min: 0, max: 1, default: 1, step: 0.01, tier: "pro" },
  ],

  formulas: [
    { latex: "f(x) = \\sum_{n=1}^{\\infty} a_n \\sin(nx) + b_n \\cos(nx)", description: "Fourier series" },
    { latex: "\\text{Square: } a_n = \\frac{4}{n\\pi} \\text{ (odd n only)}", description: "Square wave coefficients" },
  ],

  theory:
    "Fourier's theorem states that any periodic function can be decomposed into a sum of sine and cosine waves of different frequencies and amplitudes. The fundamental frequency sets the pitch; harmonics add complexity. Square waves require infinitely many odd harmonics; more harmonics = sharper corners. This decomposition is foundational to signal processing, acoustics, and quantum mechanics.",
  instructions:
    "Select a target wave shape (square, triangle, sawtooth). Add harmonics one by one to see how the composite wave approaches the target. The spectrum panel shows amplitude vs. frequency for each harmonic.",
  challenges: [
    { id: "fw-c1", question: "Why does a square wave require odd harmonics only (1st, 3rd, 5th...)?", hint: "The symmetry of a square wave means even harmonics cancel out", tier: "free" },
    { id: "fw-c2", question: "What happens to the approximation as you add more harmonics?", hint: "The waveform gets closer to the target — but never perfectly matches with finite terms", tier: "free" },
    { id: "fw-c3", question: "How does Fourier analysis relate to the timbre of a musical instrument?", hint: "Different instruments have different harmonic profiles — same pitch, different Fourier coefficients", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["wave-interference", "wave-on-string", "normal-modes"],

  seoTitle: "Fourier: Making Waves — Wave Synthesis Simulation | AP Physics 1",
  seoKeywords: ["Fourier series", "wave synthesis", "harmonics", "superposition", "AP Physics 1", "signal analysis"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Fourier Series, Wave Superposition, Harmonics" },

  contentSections: {
    whatIsIt:
      "Hold down a single key on a piano and what reaches your ear is not a pure sine wave — it is a rich, slightly buzzy tone with character. That character comes from harmonics: integer multiples of a fundamental frequency, stacked on top of one another with specific amplitudes. Joseph Fourier proved in the early 1800s that any periodic vibration, no matter how spiky or jagged, can be built up by adding pure sine waves of the right frequencies and sizes. This lab lets you do exactly that. Pick a target shape — square, triangle, or sawtooth — then add harmonics one at a time and watch the composite waveform creep toward the target. The spectrum panel shows you the recipe: which harmonics matter, and how much of each.",
    parameterExplanations: {
      n_harmonics:
        "How many sine components you stack into the sum, from 1 up to 11. With one harmonic you see a pure sine; as you add more, the composite gets closer to the target shape — and corners get sharper.",
      target_wave:
        "Picks the periodic shape you are trying to synthesize: pure sine, square, triangle, or sawtooth. Each shape has its own harmonic recipe — square waves use only odd harmonics, sawtooths use every integer harmonic, and so on.",
      a1:
        "The amplitude of the fundamental (n = 1) harmonic, the first sine in the series. Scaling a₁ scales the overall size of the composite wave because every other harmonic amplitude is set by the formula for the chosen target shape.",
    },
    misconceptions: [
      {
        wrong:
          "Fourier series is a math trick people invented to approximate ugly functions — it is not real physics.",
        correct:
          "Every periodic vibration in nature literally is a sum of sines. A vibrating guitar string really is oscillating in the fundamental plus all its harmonics simultaneously, and you can detect each component with a microphone and an FFT. The math reflects the physics, not the other way around.",
      },
      {
        wrong:
          "If you add enough harmonics, you eventually get a perfect square wave with infinitely sharp corners.",
        correct:
          "With any finite number of harmonics there is always a small overshoot near each corner — the Gibbs phenomenon. Adding more terms shrinks the wiggle in width but the overshoot height stays around 9 percent. A perfect square only emerges in the infinite-harmonic limit.",
      },
      {
        wrong:
          "Even and odd harmonics are interchangeable — you can build any shape from any harmonics.",
        correct:
          "Symmetry decides the recipe. A square wave's symmetry forces all even-numbered harmonics to be zero, so it uses only the 1st, 3rd, 5th, and so on. A triangle wave is also odd-only. A sawtooth, which lacks that symmetry, uses every harmonic.",
      },
      {
        wrong:
          "Two musical instruments playing the same pitch produce identical waveforms.",
        correct:
          "Same pitch means same fundamental frequency, but the harmonic mix — the timbre — is different. A violin and a flute on the same A4 have different Fourier coefficients, and that is exactly why they sound like different instruments.",
      },
    ],
    teacherUseCases: [
      "Build-a-square challenge: ask students to predict how the waveform will look with 1, 3, 5, and 7 odd harmonics before they slide the control. Have them sketch the predictions on paper, then compare to the live simulation.",
      "Data collection — Gibbs overshoot: students measure the height of the overshoot near a square-wave corner at n = 5, 7, 9, 11 harmonics, then discuss why it stays roughly constant instead of shrinking to zero.",
      "Symmetry argument: pause on a square wave and ask why the second harmonic is zero. Use the graphical symmetry of an odd function on each half-period to derive the answer collaboratively at the board.",
      "Misconception probe: open the lab with target_wave = sawtooth and n = 1. Ask 'what does the spectrum look like?' before revealing it; many students will guess 'just one bar' even after meeting Fourier — the resolution forces them to confront superposition.",
      "Music timbre lab: pair this with a tone-generator app. Have students record a flute and a clarinet playing the same note, run an FFT, compare the harmonic profiles, and explain timbre using the harmonic recipe shown in this simulation.",
    ],
    faq: [
      {
        question:
          "Why does a square wave only need odd harmonics — what happens to the even ones?",
        answer:
          "A square wave has a special symmetry: its second half is the negation of its first half. Even-numbered harmonics do not share that symmetry, so when you integrate to find their Fourier coefficients you get exactly zero. Odd-numbered sines (1, 3, 5, …) match the square's symmetry, so they survive with amplitudes proportional to 1/n. You can verify this in the spectrum panel — every even bar stays empty.",
      },
      {
        question:
          "What is the Gibbs phenomenon and will adding more harmonics fix it?",
        answer:
          "Gibbs phenomenon is the persistent ~9% overshoot you see near each corner of a square or sawtooth wave. Adding more harmonics narrows the wiggle in horizontal extent but the peak height does not shrink — it converges to a fixed value tied to the integral of sin(x)/x. So the overshoot is real, mathematical, and unavoidable with any finite sum, even though the energy in the overshoot region goes to zero in the limit.",
      },
      {
        question:
          "How does Fourier analysis explain why a flute and a violin sound different on the same note?",
        answer:
          "Both instruments produce the same fundamental frequency, so your brain hears the same pitch. But each instrument excites a different mix of harmonics — different a_n values — so their composite waveforms have different shapes. The flute is dominated by the fundamental with weak upper harmonics (close to a sine), while the violin has rich, comparable amplitudes well above the fundamental. That harmonic recipe is timbre.",
      },
      {
        question:
          "Where does this connect to AP Physics 1 standard GO-5.A?",
        answer:
          "GO-5.A covers superposition of waves: students must show that two or more waves passing through the same region add point-by-point in displacement. Fourier synthesis is superposition taken to its logical end — instead of just two interfering waves, you superpose dozens of carefully chosen sines to construct any periodic shape. The lab makes that abstract claim concrete and visual.",
      },
      {
        question:
          "Is Fourier series limited to physics, or does it show up in other places?",
        answer:
          "It shows up almost everywhere periodic things appear: audio compression in MP3 files, JPEG image compression (a 2D cousin called the discrete cosine transform), MRI image reconstruction, quantum mechanical wavefunctions, and digital filters in your phone. The reason: any periodic signal has a Fourier representation, and many operations (filtering, denoising, compression) are far easier in the frequency domain than the time domain.",
      },
      {
        question:
          "Why can my one-harmonic approximation already look pretty close to a triangle wave?",
        answer:
          "Triangle waves have Fourier coefficients that fall off as 1/n² — much faster than square waves, which fall off as 1/n. That means almost all the 'energy' of a triangle is in the fundamental, with the upper harmonics making only small refinements. A square wave, by contrast, needs many harmonics to look square because each one still contributes a meaningful amount.",
      },
    ],
  },
};
