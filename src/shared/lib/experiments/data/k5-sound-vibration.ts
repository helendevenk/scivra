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
  contentSections: {
    whatIsIt:
      "Put your fingers on your throat and hum. Do you feel that tickling wiggle? That wiggle is a vibration, and it is making sound! Every single sound you have ever heard was made by something vibrating — wiggling back and forth very quickly. When a guitar string is plucked, it wiggles rapidly. When you beat a drum, the drum skin wiggles. Those wiggles push the air around them, and the air carries the push outward in all directions as a sound wave. When the sound wave reaches your ear, it makes your eardrum wiggle too — and your brain hears it as sound! Two things decide what a sound sounds like. First, how fast something wiggles (how fast it vibrates) decides the pitch — fast wiggles make high sounds like a piccolo or a bird chirping, while slow wiggles make low sounds like a big drum or a foghorn. Second, how BIG the wiggle is decides the volume — a tiny wiggle makes a quiet sound, and a huge wiggle makes a loud sound like a rock concert or a clap of thunder. Sound cannot travel through empty space because there is nothing to push and wiggle. That is why space is completely silent!",
    parameterExplanations: {
      frequency:
        "Frequency means how many times per second something wiggles — how fast it vibrates. In this simulation it goes from 100 Hz (100 wiggles per second, a low rumbling sound) up to 2000 Hz (2000 wiggles per second, a very high, sharp sound). Moving the slider up makes the pitch go higher, just like tightening a rubber band makes it snap with a higher sound. Moving it down makes the pitch go lower, like a slow drum beat. Middle A on a piano is 440 Hz — right in the middle of this slider.",
      amplitude:
        "Amplitude means how big the wiggle is. A small amplitude is a gentle, tiny vibration — like whispering. A large amplitude is a big, powerful vibration — like shouting or banging a drum hard. In the simulation, amplitude goes from 10% (very quiet) to 100% (very loud). Watch the wave shape on screen: a big amplitude makes tall, wide waves while a small amplitude makes short, narrow waves. Turning it up is like turning up the volume on your speakers.",
      medium:
        "This control changes what material the sound is traveling through. Setting 0 is air — sound travels through air at about 343 meters per second (really fast, but not as fast as light). Setting 1 is water — sound actually travels faster in water, about 1480 meters per second. That is why whales can communicate over huge distances in the ocean! Setting 2 is steel — sound travels through solid steel at nearly 6000 meters per second. Solid materials carry vibrations very efficiently because the molecules are packed close together and can pass the push along quickly.",
    },
    misconceptions: [
      {
        wrong: "Sound can travel through empty space.",
        correct:
          "Sound absolutely needs matter — air, water, metal, wood, or any material — to travel. In completely empty space (a vacuum) there are no molecules to push and wiggle, so sound has nowhere to go. That is why movies that show loud explosions in space are not realistic! Real space is completely silent. This is also why you cannot hear sounds from another room as well when you close a thick, heavy door — less air and matter carrying the vibration to your ears.",
      },
      {
        wrong: "High sounds are always louder than low sounds.",
        correct:
          "Pitch (high or low) and volume (loud or quiet) are completely separate things. A whisper can be at any pitch — high or low — and still be quiet. A foghorn is very low-pitched but extremely loud. A mosquito buzzing is high-pitched but fairly quiet. In the simulation you can see this by changing frequency and amplitude independently: turning up frequency changes the pitch while the wave height stays the same, and turning up amplitude makes the wave taller while the speed of wiggling stays the same.",
      },
      {
        wrong: "Sound travels at the same speed through everything.",
        correct:
          "Sound travels at very different speeds depending on what it is moving through. In air at room temperature sound travels about 343 meters per second. In water it travels about 1480 meters per second — more than four times faster. Through solid steel it travels about 5960 meters per second — nearly 17 times faster than in air! Sound travels faster through denser, stiffer materials because the tightly packed molecules pass the vibration along much more quickly. Try switching the medium slider in the simulation to see this effect.",
      },
      {
        wrong: "Louder sound means faster vibration.",
        correct:
          "Louder sound means BIGGER vibration, not faster. Faster vibration means higher pitch. Think of a speaker cone: when you turn the volume up, the cone moves farther back and forth with each wiggle (bigger amplitude). When you turn the bass to a deeper note, the cone wiggles more slowly (lower frequency). These two things are independent — you can have a loud, low sound or a soft, high sound, or any other combination.",
      },
    ],
    teacherUseCases: [
      "Pitch exploration: keep amplitude fixed at 50% and sweep frequency from 100 Hz to 2000 Hz. Students describe the wave pattern changes they see (more waves packed together at high frequency) and connect to NGSS 1-PS4-1.",
      "Volume investigation: keep frequency at 440 Hz and vary amplitude from 10% to 100%. Students sketch the wave at three different settings and label 'quiet,' 'medium,' and 'loud' — connecting wave height to volume.",
      "Medium comparison: fix frequency at 440 Hz and amplitude at 70%, then switch through air, water, and steel. Discuss with students why whales and dolphins communicate through water and why you can hear trains coming from far away by putting your ear to the rail.",
      "Silence in space: set medium to 2 (steel) and discuss: what if there were NO medium? Play a short video clip of a space movie explosion, then ask why real space is silent. Connect to NGSS concept that waves need a medium.",
      "Rubber band demo bridge: before the simulation, have students stretch a rubber band and pluck it. Ask 'what changed when you stretched it tighter?' (higher pitch, faster wiggle). Then use the frequency slider to model the same effect digitally, connecting hands-on to simulation.",
    ],
    faq: [
      {
        question: "Why does a short rubber band make a higher sound than a long one?",
        answer:
          "A shorter rubber band (or guitar string) is stiffer and snaps back faster after being plucked — it wiggles more times per second, which means higher frequency, which our ears hear as a higher pitch. A longer string or band is more relaxed and wiggles more slowly, making a lower-pitched sound. This is why the long, thick strings on a bass guitar make deep low sounds while the short thin strings on a violin make high sounds. Tightening a string (increasing tension) also makes it wiggle faster and raises the pitch — that is how guitar players tune their instruments.",
      },
      {
        question: "Why can't you hear sound in space?",
        answer:
          "Sound is a vibration that travels by pushing molecules together and apart — it needs matter to travel through. Space is an almost perfect vacuum, meaning there are no molecules of air, water, or anything else for the sound to push. Without molecules to carry the vibration, sound has nowhere to go and simply does not travel at all. Light, however, does not need molecules — it can travel through empty space, which is why we can see stars and the Sun even though we cannot hear anything from them. Movie sound designers add explosion sounds for excitement, but real space is completely and perfectly silent.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports NGSS 1-PS4-1, which asks students to plan and conduct investigations to provide evidence that vibrating materials create sound and that sound can make materials vibrate. It also supports 4-PS4-1, which asks students to develop a model of waves to describe patterns of amplitude and wavelength and how they affect the properties of waves. Students use the frequency slider to observe wavelength changes and the amplitude slider to observe volume changes — providing concrete evidence for both standards. The medium selector extends the investigation into how the material carrying the wave affects sound speed.",
      },
      {
        question: "Why does sound travel faster through water than air?",
        answer:
          "In water, the molecules are packed much closer together than in air. When a vibration pushes one water molecule, that molecule almost immediately bumps into its neighbor and passes the push along — like a line of people standing shoulder to shoulder passing a shove down the line. In air the molecules are spread much farther apart, so each molecule has to travel farther before bumping the next one. The closer together the molecules are, the faster the vibration travels. That is why solid materials like steel carry sound even faster than water — steel molecules are extremely tightly packed and pass vibrations along almost instantly.",
      },
      {
        question: "How does turning up the volume on a speaker make sound louder?",
        answer:
          "When you turn up the volume, you are sending more electrical energy to the speaker. More electrical energy makes the speaker cone (the round part you can sometimes see moving) push the air harder and farther back and forth with each wiggle. That bigger back-and-forth movement is a larger amplitude — the air gets pushed more forcefully outward in all directions. Bigger air pressure waves reach your eardrum and push it harder, and your brain interprets stronger eardrum movement as louder sound. In the simulation, the amplitude slider directly controls this: watch how the wave gets taller (bigger amplitude) as you increase it, representing stronger air pressure changes.",
      },
    ],
  },
};
