import type { Experiment } from "@/shared/types/experiment";

export const msWaveInteractionsAdvanced: Experiment = {
  id: "ms-wave-interactions-advanced",
  slug: "ms-wave-interactions-advanced",
  title: "Wave Interactions",
  subtitle: "Two-source interference, phase, amplitude, and source geometry",
  description:
    "Explore wave superposition with two coherent sources. Adjust frequency to change wave spacing, phase difference to align or oppose the sources, amplitude to scale wave strength, and source separation to reshape the interference geometry. Compare constructive, destructive, and standing-wave style patterns.",
  thumbnail: "/imgs/experiments/ms-wave-interactions-advanced.png",

  standards: {
    ngss: ["MS-PS4-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-ms",
  category: "waves",
  subject: "physics",
  gradeLevel: "6-8",
  tags: [
    "waves",
    "interference",
    "superposition",
    "phase",
    "amplitude",
    "wave behavior",
    "middle school",
    "6-8",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "frequency",
      label: "Frequency",
      unit: "Hz",
      min: 5,
      max: 50,
      default: 20,
      step: 1,
      tier: "free",
    },
    {
      id: "phase",
      label: "Phase Difference",
      unit: "°",
      min: 0,
      max: 360,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "amplitude",
      label: "Amplitude",
      unit: "",
      min: 1,
      max: 20,
      default: 10,
      step: 1,
      tier: "free",
    },
    {
      id: "separation",
      label: "Source Separation",
      unit: "",
      min: 1,
      max: 10,
      default: 4,
      step: 0.5,
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
      latex: "y_{tot}(x,t) = y_1(x,t) + y_2(x,t) \\quad \\text{(superposition)}",
      description:
        "When two waves overlap, the displacement at every point is the sum of both wave displacements",
    },
  ],

  theory:
    "Waves transfer energy without transferring matter. When two coherent sources emit waves of the same frequency, the waves overlap in space and combine via superposition: the displacement at every point is the sum of both wave displacements. If the sources are in phase (Δφ=0°), peaks meet peaks at many locations and constructive interference dominates. If the sources are 180° out of phase, peaks meet troughs at many locations and destructive interference dominates. Source separation changes the geometry: as sources move apart, the path-length difference from each source to a given screen point changes, shifting where constructive and destructive bands appear. Amplitude scales the size of the disturbance and, in physical waves, the energy carried.",

  instructions:
    "Use the four sliders to investigate wave interference and superposition from two coherent sources. Change Frequency to adjust wave spacing, Phase Difference to shift one source relative to the other, Amplitude to change wave strength, and Source Separation to move the emitters apart or together. Try the three presets — Constructive (Δφ=0°), Destructive (Δφ=180°), and Standing Wave Pattern — then change one slider at a time to see how overlapping waves add, cancel, or form stable-looking interference patterns.",

  challenges: [
    {
      id: "mwa-c1",
      question:
        "Two coherent sources emit waves at 20 Hz with wavelength 0.5 m. What is the wave speed? At a point where the two waves arrive in phase, what kind of interference occurs?",
      hint: "v = f × λ = 20 × 0.5 = 10 m/s. When two waves arrive in phase (peaks aligned), constructive interference occurs and the combined amplitude is the sum of both individual amplitudes.",
      tier: "free",
    },
    {
      id: "mwa-c2",
      question:
        "Two speakers play the same note. At some spots the sound is extra loud, at others it is nearly silent. What is happening?",
      hint: "This is wave interference. Where the peaks of both sound waves arrive together (constructive interference), the amplitudes add up — extra loud. Where a peak from one speaker meets a trough from the other (destructive interference), they cancel out — nearly silent. These loud and quiet spots form an interference pattern that depends on Frequency and Source Separation.",
      tier: "free",
    },
    {
      id: "mwa-c3",
      question:
        "If you set Phase Difference to 180° with the same Frequency and Amplitude, what happens at points where the two waves arrive simultaneously?",
      hint: "Destructive interference. With Δφ=180°, the two sources oscillate out of step. Where a peak from one source arrives at the same point as a trough from the other, the displacements cancel and the combined amplitude is near zero.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["wave-interference", "wave-on-string"],

  htmlPath: "/experiments/middle/ms-wave-interactions-advanced.html",

  seoTitle: "Wave Interference & Superposition | Scivra Middle School Physics",
  seoKeywords: [
    "wave interference simulation middle school",
    "two source interference interactive",
    "phase difference superposition 6-8",
    "wave equation simulation",
    "NGSS MS-PS4-1 MS-PS4-2 waves",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Wave Interference and Superposition",
  },
  htmlControlAliases: {
    frequency: "sl-freq",
    phase: "sl-phase",
    amplitude: "sl-amp",
    separation: "sl-sep",
  },
  presets: [
    {
      id: "constructive",
      label: "Constructive (Δφ=0°)",
      description:
        "Aligns the two sources in phase so matching crests and troughs reinforce each other across the interference pattern.",
      paramValues: { frequency: 20, phase: 0, amplitude: 10, separation: 4 },
    },
    {
      id: "destructive",
      label: "Destructive (Δφ=180°)",
      description:
        "Offsets one source by half a cycle so crests from one wave tend to meet troughs from the other and reduce amplitude.",
      paramValues: { frequency: 20, phase: 180, amplitude: 10, separation: 4 },
    },
    {
      id: "standing",
      label: "Stable Interference Pattern",
      description:
        "Uses a tighter wave pattern and wider source spacing to make stable bright and dark interference bands easier to compare. (Not a true standing wave, which would require oppositely traveling waves.)",
      paramValues: { frequency: 25, phase: 0, amplitude: 10, separation: 6 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Waves carry energy from place to place without moving matter along with them. Toss a stone into a pond and ripples spread outward — the water molecules bob up and down but do not travel with the wave. The same principle applies to sound waves in air, light waves traveling through space, and seismic waves moving through Earth. When two coherent sources emit waves at the same frequency, the disturbances overlap and combine via superposition: at every point, the total displacement equals the sum of the two individual wave displacements. This simulation places two emitters on a 2D screen and lets you adjust four properties at once. Frequency sets how tightly packed the wave crests are. Phase Difference sets how the two sources are aligned in time. Amplitude controls the size of each disturbance. Source Separation changes the geometry. By moving one slider at a time, you can isolate which property changes the interference pattern — and connect what you observe to the wave equation v = f × wavelength.",
    parameterExplanations: {
      frequency:
        "Frequency sets how many complete wave cycles each source produces per second, from 5 Hz to 50 Hz. In this model, increasing frequency packs the crests closer together, so the interference pattern gains more closely spaced bright and quiet regions. Middle school students can connect this to MS-PS4-1 by comparing frequency, wavelength, and the repeating pattern of waves. High school students can extend the same evidence toward HS-PS4-3 by asking how changing frequency affects information carried by a wave-like signal while amplitude and source spacing stay fixed.",
      phase:
        "Phase Difference controls how far one source is shifted in its cycle compared with the other source, from 0° to 360°. At 0°, the sources start together, so many locations show constructive interference where crests meet crests. At 180°, one source is half a cycle behind, making destructive interference easier to find where crests meet troughs. This slider gives students a concrete way to test superposition: the observed displacement at any point is the sum of both waves. That supports MS-PS4-1 pattern modeling and prepares HS-PS4-3 discussions of controlled wave modulation.",
      amplitude:
        "Amplitude sets the height or strength of each wave source, from 1 to 20. Larger amplitude means a larger disturbance and, in physical waves, greater energy transfer. When two waves overlap, amplitude also determines how dramatic the reinforcement or cancellation appears: constructive regions become stronger, while destructive regions can approach zero if the waves are closely matched. Students can use this slider to connect visual wave height to energy as required by MS-PS4-1. For HS-PS4-3, it also supports the idea that changing amplitude can change a signal's strength without necessarily changing its frequency.",
      separation:
        "Source Separation changes the distance between the two wave emitters, from 1 to 10. Moving the sources apart changes the path-length difference from each source to points on the screen, which shifts where constructive and destructive bands appear. Small separation can make the pattern broad and simple; larger separation can create more tightly arranged interference regions. This is useful for MS students building a model of how waves combine, and for HS students connecting geometry, wave travel, and signal patterns. Keep frequency and phase constant, then change only separation to isolate the effect of source position.",
    },
    misconceptions: [
      {
        wrong: "Waves move matter from place to place — for example, the water in a wave actually travels to shore.",
        correct:
          "Waves transfer energy, not matter. In an ocean wave, water molecules move in circular orbits but return almost to where they started — a rubber duck bobs up and down and slightly back and forth but does not travel to shore with the wave. The energy of the disturbance travels forward while the material itself stays roughly in place. In the two-source interference model, each source sends out a disturbance, but the pattern you see comes from energy moving through positions and adding by superposition, not from particles traveling across the whole screen.",
      },
      {
        wrong: "Constructive interference means one wave wins and destructive interference means the other wave disappears.",
        correct:
          "Interference is not a contest between waves. At each point, the two wave displacements add together. If both are upward or both are downward, the result has a larger amplitude: constructive interference. If one is upward while the other is downward, the result is smaller: destructive interference. Neither wave is permanently removed. Changing Phase Difference from 0° to 180° is a direct way to test this because the same two sources can produce very different combined patterns.",
      },
      {
        wrong: "Interference destroys one of the two waves permanently.",
        correct:
          "Waves pass through each other without being permanently affected. When two waves overlap, they combine at every point — constructively or destructively — but once they pass through the overlap region, each continues on unchanged. Destructive interference silences sound locally (as in noise-cancelling headphones) but does not eliminate either wave; they keep traveling beyond the overlap zone. Interference is a temporary combination, not permanent destruction.",
      },
      {
        wrong: "Higher-frequency waves always travel faster than lower-frequency waves in the same setup.",
        correct:
          "In many classroom wave models, changing Frequency mainly changes wavelength while the wave speed is treated as fixed. Higher frequency means more cycles per second and shorter spacing between crests, not automatically faster travel. In this simulation, use Frequency to compare how the interference bands tighten or spread while keeping Phase Difference, Amplitude, and Source Separation steady. That one-variable test helps separate wave speed from the pattern changes caused by frequency.",
      },
    ],
    teacherUseCases: [
      "Frequency and wavelength relationship: start with the Constructive (Δφ=0°) preset and have students increase Frequency from 10 Hz to 20 Hz to 40 Hz while keeping Phase Difference, Amplitude, and Source Separation unchanged. Students count how the spacing between crests and interference bands changes, supporting MS-PS4-1 mathematical wave modeling.",
      "Phase and superposition demo: compare the Constructive (Δφ=0°) and Destructive (Δφ=180°) presets. Students identify where waves reinforce and where they cancel, then explain the pattern using superposition and the Phase Difference slider. Keep NGSS MS-PS4-1 as the anchor standard for describing amplitude patterns in a wave model.",
      "Amplitude and energy comparison: keep Frequency at 20 Hz, Phase Difference at 0°, and Source Separation at 4. Move Amplitude from 3 to 10 to 18 and ask students what changes in the visual pattern and what stays the same. Connect larger amplitude to greater wave energy while preserving the same interference geometry, supporting MS-PS4-1.",
      "Source geometry investigation: use the Standing Wave Pattern preset, then vary only Source Separation from 2 to 6 to 10. Students sketch or describe how node and antinode locations shift as the sources move apart. This supports model-based reasoning about how source position affects interference without changing wave frequency.",
      "Engineering connection: use the Destructive (Δφ=180°) preset to introduce noise-cancelling technology. Students explain why matching Frequency and Amplitude matter, then adjust Phase Difference away from 180° to see why cancellation is strongest only under controlled timing. Keep the discussion tied to MS-PS4-1 and the existing MS-PS4-2 wave-interaction context.",
    ],
    faq: [
      {
        question: "What does phase difference do in a two-source wave pattern?",
        answer:
          "Phase difference describes where one source is in its cycle compared with the other source. At 0°, both sources rise and fall together, so many places show constructive interference. At 180°, one source is half a cycle out of step, so crests from one source often meet troughs from the other and reduce the combined amplitude. Values between those extremes shift the locations of the loud/quiet or bright/dim regions. The Phase Difference slider is the fastest way to see superposition because the sources stay the same while only their timing changes.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation primarily supports MS-PS4-1 (use mathematical representations to describe a simple model for waves that includes how the amplitude of a wave is related to the energy in the wave) and MS-PS4-2 (develop and use a model to describe that waves are reflected, absorbed, or transmitted through various materials). Adjusting Frequency, Phase Difference, Amplitude, and Source Separation while observing constructive and destructive interference directly builds the observational foundation for wave modeling, and the wave equation v = f times wavelength provides the mathematical representation MS-PS4-1 requires.",
      },
      {
        question: "Why do some places in the pattern look strong while others look weak?",
        answer:
          "The pattern comes from superposition. At each point, the disturbance from source A and the disturbance from source B add together. If both waves arrive with the same sign — crest with crest or trough with trough — the combined amplitude is larger, producing constructive interference. If a crest arrives with a trough, the two displacements partly or fully cancel, producing destructive interference. Frequency affects wave spacing, Phase Difference changes the timing between sources, Amplitude changes the strength of the result, and Source Separation changes the geometry of the bands.",
      },
      {
        question: "How does Source Separation change the interference pattern?",
        answer:
          "Source Separation sets the distance between the two emitters. As the sources move farther apart, the path-length difference from each source to any given screen point changes more rapidly, so constructive and destructive bands appear closer together. With sources very close, the pattern broadens out. The Standing Wave Pattern preset uses a wider separation with a tighter Frequency to make stable nodes and antinodes easier to identify. Try changing only Source Separation to isolate this effect from Frequency and Phase Difference.",
      },
      {
        question: "How does noise-cancelling technology use wave interference?",
        answer:
          "Noise-cancelling headphones contain a small microphone that detects incoming sound waves. Electronics then generate a new sound wave with the same frequency and amplitude but completely flipped — the peaks of the original become the troughs of the new wave, and vice versa. When these two waves overlap in your ear, destructive interference occurs: the peaks and troughs cancel each other out, reducing the amplitude of the noise dramatically. This is a direct engineering application of destructive wave interference and demonstrates that interference is controllable, not random.",
      },
    ],
  },
};
