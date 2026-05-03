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
    { id: "frequency", label: "Frequency", unit: "Hz", min: 50, max: 1000, default: 220, step: 10, tier: "free" },
    { id: "amplitude", label: "Amplitude", unit: "", min: 0.05, max: 1.5, default: 0.6, step: 0.05, tier: "free" },
    { id: "harmonic", label: "Harmonic", unit: "", min: 1, max: 5, default: 1, step: 1, tier: "free" },
    { id: "tension", label: "String Tension", unit: "", min: 1, max: 10, default: 5, step: 0.5, tier: "free" },
  ],
  formulas: [
    { latex: "v = f \\lambda", description: "Wave speed equals frequency times wavelength" },
  ],
  theory: "Sound is created by vibrations. When an object vibrates, it pushes air molecules back and forth, creating pressure waves that travel outward. Frequency (measured in Hertz) determines pitch: more vibrations per second = higher pitch. Amplitude determines volume: bigger vibrations = louder sound. Sound travels through different materials at different speeds: ~343 m/s in air, ~1480 m/s in water, ~5960 m/s in steel. Sound cannot travel through a vacuum because there are no molecules to vibrate.",
  instructions: "Move the Frequency slider to make the sound higher or lower. Move the Amplitude slider to make the vibration bigger or smaller. Use the Harmonic slider to add extra wiggles to the wave, and use String Tension to make the string looser or tighter. Try the Guitar String, Drum Beat, and Tuning Fork presets, then change one slider at a time and watch how the wave changes.",
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
  htmlControlAliases: { frequency: "sl-freq", amplitude: "sl-amp", harmonic: "sl-harm", tension: "sl-tens" },
  presets: [
    { id: "guitar", label: "🎸 Guitar String", paramValues: { frequency: 440, amplitude: 0.6, harmonic: 2, tension: 7 } },
    { id: "drum", label: "🥁 Drum Beat", paramValues: { frequency: 120, amplitude: 1.2, harmonic: 1, tension: 3 } },
    { id: "fork", label: "🔔 Tuning Fork", paramValues: { frequency: 440, amplitude: 0.6, harmonic: 1, tension: 5 } },
  ],
  contentSections: {
    whatIsIt:
      "Put your fingers on your throat and hum. Do you feel that tickling wiggle? That wiggle is a vibration, and it is making sound! Every single sound you have ever heard was made by something vibrating — wiggling back and forth very quickly. When a guitar string is plucked, it wiggles rapidly. When you beat a drum, the drum skin wiggles. Those wiggles push the air around them, and the air carries the push outward in all directions as a sound wave. When the sound wave reaches your ear, it makes your eardrum wiggle too — and your brain hears it as sound! Two things decide what a sound sounds like. First, how fast something wiggles (how fast it vibrates) decides the pitch — fast wiggles make high sounds like a piccolo or a bird chirping, while slow wiggles make low sounds like a big drum or a foghorn. Second, how BIG the wiggle is decides the volume — a tiny wiggle makes a quiet sound, and a huge wiggle makes a loud sound like a rock concert or a clap of thunder. Sound cannot travel through empty space because there is nothing to push and wiggle. That is why space is completely silent!",
    parameterExplanations: {
      frequency:
        "Frequency tells how many times something vibrates each second. A low Frequency value means the string or surface wiggles slowly, so you hear a lower pitch, like a drum or a deep voice. A high Frequency value means faster wiggles, so you hear a higher pitch, like a bell or bird chirp. Try the Drum Beat preset, then the Tuning Fork preset, and compare the spacing of the waves. This helps show NGSS 1-PS4-1: vibrating materials can make sound.",
      amplitude:
        "Amplitude tells how big each vibration is. A small Amplitude makes a small wiggle and a softer sound. A large Amplitude makes a bigger wiggle and a louder sound. It does not have to change the pitch. You can keep Frequency the same, move only Amplitude, and watch the wave grow taller or shorter. This matches NGSS 4-PS4-1 because students can use a wave model to see that wave height is connected to how strong the sound feels.",
      harmonic:
        "Harmonic changes the pattern inside the sound. The first harmonic is the simplest wave, like one smooth wiggle. Higher Harmonic values add extra smaller wiggles, so the sound can look richer or buzzier. This is one reason a guitar string and a tuning fork can play a similar pitch but still sound different. Use the Guitar String preset, then move Harmonic one step at a time. Students can observe that sounds have patterns, and those patterns come from how objects vibrate.",
      tension:
        "String Tension tells how tight the string is. A loose string moves more slowly and often makes a lower sound. A tighter string snaps back faster and often makes a higher sound. This is how many string instruments are tuned: turning the peg changes how tight the string is. Try the Guitar String preset, then lower and raise String Tension while watching the wave. The control connects a real object students can touch, like a rubber band, to the idea that vibrations make sound.",
    },
    misconceptions: [
      {
        wrong: "Sound can travel through empty space.",
        correct:
          "Sound needs matter to travel. A vibration must push something, such as air, water, wood, or metal, from one place to the next. In empty space there are no particles close enough to pass the push along, so sound cannot travel. In this simulation, focus on what is vibrating: the Guitar String, Drum Beat, and Tuning Fork presets all show an object moving back and forth. Without something to vibrate and carry that motion, there is no sound for ears to hear.",
      },
      {
        wrong: "High sounds are always louder than low sounds.",
        correct:
          "Pitch and loudness are different. Frequency changes pitch: higher Frequency means faster vibrations and a higher sound. Amplitude changes loudness: higher Amplitude means bigger vibrations and a louder sound. A tiny bell can be high and quiet, while a large drum can be low and loud. Test this by choosing the Tuning Fork preset and moving only Amplitude. Then reset and move only Frequency. The wave changes in different ways.",
      },
      {
        wrong: "A guitar string, drum, and tuning fork make sound in exactly the same way.",
        correct:
          "They are alike because they all vibrate, but their vibration patterns can be different. A Guitar String may show extra wiggles when Harmonic is higher. A Drum Beat often has a lower Frequency and a larger Amplitude. A Tuning Fork usually makes a clean, simple vibration pattern. Use the three presets to compare them. Students should look for what is the same, vibrating matter, and what is different, such as Frequency, Amplitude, Harmonic, and String Tension.",
      },
      {
        wrong: "Louder sound means faster vibration.",
        correct:
          "Louder sound means bigger vibration, not faster vibration. Faster vibration means higher pitch. Think about a speaker cone or a rubber band: moving farther back and forth makes a stronger sound, while moving back and forth more times each second changes the pitch. In the simulation, move Amplitude to change wave height. Move Frequency to change how close together the waves are. This shows why loudness and pitch should be measured with different controls.",
      },
    ],
    teacherUseCases: [
      "Pitch exploration for NGSS 1-PS4-1: have students start with the Tuning Fork preset, keep Amplitude the same, and move Frequency from low to high. Students describe how faster vibrations change the sound and wave spacing.",
      "Volume investigation for NGSS 4-PS4-1: have students keep Frequency at 440 Hz and compare low, middle, and high Amplitude settings. Students sketch each wave and connect taller waves with louder sounds.",
      "Instrument comparison: students run the Guitar String, Drum Beat, and Tuning Fork presets, record Frequency, Amplitude, Harmonic, and String Tension values, then explain how different vibration patterns can make different sounds.",
      "Rubber band bridge: before using the simulation, students pluck a rubber band gently and strongly, then loose and tight. They use Amplitude and String Tension sliders to model what they observed by touch and hearing.",
      "One-change-at-a-time CER: assign pairs one preset, then have them change only Harmonic or only String Tension. Students write a claim about what changed, cite the slider value as evidence, and connect the reasoning to vibrating materials making sound.",
    ],
    faq: [
      {
        question: "Why does a short rubber band make a higher sound than a long one?",
        answer:
          "A shorter rubber band or guitar string usually vibrates faster after it is plucked. Faster vibration means higher Frequency, and our ears hear higher Frequency as a higher pitch. Tension matters too. Tightening a string makes it snap back faster, which can raise the pitch. In this simulation, try the Guitar String preset and change String Tension. Then change Frequency and watch the wave spacing. These two controls help show why string instruments can be tuned to play higher or lower notes.",
      },
      {
        question: "Why can't you hear sound in space?",
        answer:
          "Sound is a vibration that travels by pushing particles together and apart. Space is almost empty, so there are not enough particles to carry those pushes to your ear. Light can travel through space, but sound cannot. The presets in this simulation all begin with something that vibrates: a Guitar String, a Drum Beat, or a Tuning Fork. Those vibrations need matter around them to become a sound wave that can reach your ear.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports NGSS 1-PS4-1, which asks students to gather evidence that vibrating materials can make sound and sound can make materials vibrate. It also supports NGSS 4-PS4-1, which asks students to use wave models to describe patterns. Frequency helps students see pitch patterns. Amplitude helps students see wave height and loudness. Harmonic and String Tension help students compare different vibrating objects, especially the Guitar String, Drum Beat, and Tuning Fork presets.",
      },
      {
        question: "What does the Harmonic slider show?",
        answer:
          "The Harmonic slider changes the shape of the vibration pattern. A low Harmonic value makes a simpler wave. A higher Harmonic value adds extra wiggles, which can make a sound look and feel more complex. This helps explain why two instruments can play notes with similar Frequency but still sound different. Start with the Guitar String preset because strings often show rich vibration patterns. Then compare it with the Tuning Fork preset, which is usually cleaner and simpler.",
      },
      {
        question: "How does turning up the volume on a speaker make sound louder?",
        answer:
          "When you turn up the volume, the speaker moves farther back and forth. That bigger motion pushes the air harder and makes a stronger sound wave. In science words, the wave has a larger Amplitude. Larger Amplitude means louder sound, but it does not automatically mean higher pitch. In the simulation, keep Frequency the same and move only Amplitude. Watch the wave get taller or shorter. Then use a preset and test whether the sound can be loud without becoming high.",
      },
    ],
  },
};
