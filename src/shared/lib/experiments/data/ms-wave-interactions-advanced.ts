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
  contentSections: {
    whatIsIt:
      "Waves carry energy from place to place without moving matter along with them. Toss a stone into a pond and ripples spread outward — the water molecules bob up and down but do not travel with the wave. The same principle applies to sound waves in air, light waves traveling through space, and seismic waves moving through Earth. When waves encounter boundaries, obstacles, or other waves, four fundamental behaviors can occur. Reflection is when a wave bounces back — the same way a rubber ball bounces off a wall, or your voice echoes off a cliff. Refraction is when a wave bends as it crosses into a different material and changes speed — the same way a straw looks bent in a glass of water. Diffraction is when a wave spreads around corners and through gaps — why you can hear someone talking around a corner but cannot see them. Interference is when two waves meet and combine — adding together to make a bigger wave (constructive) or canceling each other out (destructive). This simulation lets you switch wave types, adjust frequency, and change the medium to observe all four behaviors and see how wave properties change together.",
    parameterExplanations: {
      waveType:
        "Selects whether the simulation shows a transverse wave (setting 0) or a longitudinal wave (setting 1). In a transverse wave, the material moves perpendicular to the direction the wave travels — like shaking a rope up and down while the wave moves sideways. Light and water-surface waves are transverse. In a longitudinal wave, the material moves back and forth in the same direction the wave travels — like a slinky being compressed and stretched. Sound is a longitudinal wave. Both types obey the same wave equation (v = f times wavelength) and show all four interactions.",
      frequency:
        "The number of complete wave cycles produced per second, measured in hertz (Hz), adjustable from 0.5 Hz to 10 Hz. Higher frequency means more waves per second and therefore a shorter wavelength (since wave speed stays constant in the same medium: wavelength = speed divided by frequency). Frequency affects diffraction — higher-frequency waves have shorter wavelengths that diffract less around obstacles and gaps. It also sets the pitch of a sound wave and the color of a light wave.",
      medium:
        "The material through which the wave travels, selectable from Air (0), Water (1), or Glass (2). Different materials slow waves by different amounts. Waves travel fastest in air (in this simulation's context), slower in water, and slowest in glass. When a wave crosses from one medium to another, the frequency stays the same but the wavelength changes (shorter in slower media). This change in wavelength is the direct cause of refraction — one side of the wavefront slows down before the other, bending the wave's direction.",
    },
    misconceptions: [
      {
        wrong: "Waves move matter from place to place — for example, the water in a wave actually travels to shore.",
        correct:
          "Waves transfer energy, not matter. In an ocean wave, water molecules move in circular orbits but return almost to where they started — a rubber duck bobs up and down and slightly back and forth but does not travel to shore with the wave. The energy of the disturbance travels forward while the medium stays roughly in place. This is why a leaf floating on water bobs up and down rather than being carried along with the wave.",
      },
      {
        wrong: "Refraction happens because the wave is bent by a force when it enters a new material.",
        correct:
          "Refraction is not caused by a force — it is a geometric consequence of one side of the wavefront slowing down before the other. Imagine a row of marching soldiers turning to walk through mud: soldiers who hit the mud first slow down, causing the whole line to pivot and change direction. Similarly, when a wave crosses into a slower medium at an angle, the side that enters first slows, bending the wavefront. No external force is involved.",
      },
      {
        wrong: "Interference destroys one of the two waves permanently.",
        correct:
          "Waves pass through each other without being permanently affected. When two waves overlap, they combine at every point — constructively or destructively — but once they pass through the overlap region, each continues on unchanged. Destructive interference silences sound locally (as in noise-cancelling headphones) but does not eliminate either wave; they keep traveling beyond the overlap zone. Interference is a temporary combination, not permanent destruction.",
      },
      {
        wrong: "Higher-frequency waves always travel faster than lower-frequency waves in the same medium.",
        correct:
          "In most everyday media (air for sound, glass for visible light), all frequencies travel at the same speed. Frequency and wavelength are inversely linked (wavelength = speed divided by frequency) — higher frequency means shorter wavelength, not faster travel. In some situations called dispersion (like a prism splitting white light into colors) different frequencies do travel at slightly different speeds, but that is a property of dispersive materials, not a general rule.",
      },
    ],
    teacherUseCases: [
      "Frequency and wavelength relationship: set medium to 0 (Air) and waveType to 0 (Transverse). Increase frequency from 1 Hz to 4 Hz to 8 Hz while students count the number of wave crests visible on screen. Students observe that more crests appear (shorter wavelength) as frequency rises, verifying the relationship wavelength = speed divided by frequency — supporting MS-PS4-1.",
      "Refraction exploration: set waveType to 0 and frequency to 2 Hz. Switch medium from 0 (Air) to 1 (Water) to 2 (Glass). Students describe what changes about the wave pattern (wavelength gets shorter, wave bends at the boundary). Ask them to connect this to why pools look shallower than they are, or why a straw appears bent in water — bridging MS-PS4-2 to everyday observation.",
      "Diffraction vs. frequency: hold medium at 0 and waveType at 0. Compare the wave spreading around an obstacle at frequency 1 Hz versus 8 Hz. Students should observe that lower-frequency (longer-wavelength) waves spread more. This sets up the everyday analogy: sound (long wavelengths) bends around corners easily; light (tiny wavelengths) does not — explaining why you hear but cannot see around a corner.",
      "Constructive and destructive interference demo: set up two wave sources (interference mode) with identical frequency. Students identify loud spots (constructive — crests align) and quiet spots (destructive — crest meets trough). Ask: can two waves added together produce silence? Experiencing this counterintuitive result motivates understanding of noise-cancelling technology as an engineering application of MS-PS4-1.",
    ],
    faq: [
      {
        question: "Why can you hear someone talking around a corner but not see them?",
        answer:
          "Both sound and light are waves, but their wavelengths are vastly different. Typical sound wavelengths range from about 2 centimeters to 17 meters — similar in size to doorways and building corners. Waves diffract (spread around obstacles) most when their wavelength is comparable to the obstacle size, so sound bends easily around corners. Visible light has wavelengths between about 400 and 700 nanometers — millions of times smaller than a doorway — so light barely diffracts and travels in nearly straight lines. This is why sound turns corners but light does not.",
      },
      {
        question: "What is the difference between a transverse and a longitudinal wave?",
        answer:
          "In a transverse wave, the medium (the material through which the wave travels) vibrates perpendicular to the direction the wave moves. Picture shaking a rope up and down: your hand moves vertically, but the wave pattern travels horizontally along the rope. Light is a transverse wave. In a longitudinal wave, the medium vibrates parallel to the direction of travel — regions of compression (squished together) and rarefaction (spread apart) move along the wave's path. Sound is a longitudinal wave: air molecules push back and forth in the same direction the sound travels. Both types carry energy and obey the wave equation v = f times wavelength.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation primarily supports MS-PS4-1 (use mathematical representations to describe a simple model for waves that includes how the amplitude of a wave is related to the energy in the wave) and MS-PS4-2 (develop and use a model to describe that waves are reflected, absorbed, or transmitted through various materials). Adjusting frequency, medium, and wave type while observing reflection, refraction, diffraction, and interference directly builds the observational foundation for both standards, and the wave equation v = f times wavelength provides the mathematical representation MS-PS4-1 requires.",
      },
      {
        question: "Why does a wave bend when it enters a new medium?",
        answer:
          "Refraction occurs because the wave changes speed when it crosses from one medium to another, and the two sides of the wavefront do not cross the boundary at the same instant. The side that enters the new (slower) medium first slows down while the other side is still moving at the original speed. This speed difference causes the wavefront to pivot — the same way a car turning into mud on one side skids and turns in that direction. The greater the speed difference between the two media, the more the wave bends.",
      },
      {
        question: "How does noise-cancelling technology use wave interference?",
        answer:
          "Noise-cancelling headphones contain a small microphone that detects incoming sound waves. Electronics then generate a new sound wave with the same frequency and amplitude but completely flipped — the peaks of the original become the troughs of the new wave, and vice versa. When these two waves overlap in your ear, destructive interference occurs: the peaks and troughs cancel each other out, reducing the amplitude of the noise dramatically. This is a direct engineering application of destructive wave interference and demonstrates that interference is controllable, not random.",
      },
    ],
  },
};
