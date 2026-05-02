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

  seoTitle: "Sound Waves for Kids | Scivra Elementary Science",
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
  contentSections: {
    whatIsIt:
      "Tap your desk right now. Did you hear that? Your hand pushed the desk, the desk wiggled, and that wiggle traveled through the air as a sound wave until it reached your ears. Every sound — music, talking, thunder, a dog barking — starts with something wiggling (vibrating) and pushing the air around it. Sound is a wave made of tiny air pushes traveling outward in all directions from the vibrating object. Two things shape what a sound sounds like. How fast the object wiggles (its frequency) decides whether the sound is high-pitched like a flute or whistle, or low-pitched like a foghorn or big bass drum. How much the object wiggles (its amplitude) decides how loud the sound is — a tiny wiggle makes a quiet whisper, and a massive wiggle makes a loud clap. Sound waves need something to push through — air, water, wood, or metal. Without any matter at all, sound simply cannot exist. That is why outer space is completely silent: there is no air or any other material out there to carry the wiggle. This simulation lets you see the invisible — the actual wave pattern — as you change pitch and volume.",
    parameterExplanations: {
      frequency:
        "Frequency is how many times per second the vibrating object wiggles back and forth. In this simulation it goes from 50 Hz (very slow wiggles — a very deep, rumbling low sound) all the way to 2000 Hz (very fast wiggles — a sharp, piercing high sound). Moving this slider up raises the pitch, just like tightening a guitar string makes it twang higher. Moving it down lowers the pitch. The standard piano note A4 (middle A) is exactly 440 Hz. Watch the wave on screen: higher frequency means more wave peaks packed into the same space.",
      amplitude:
        "Amplitude is how big the wiggle is — how far the vibrating surface pushes the air. It goes from 0 (no sound at all) to 1.0 (maximum volume, very loud). A small amplitude means small waves and quiet sound, like a whisper. A large amplitude means tall waves and loud sound, like someone shouting next to you. On screen you can see the wave shape: increasing amplitude makes the peaks taller and the valleys deeper. Amplitude and frequency are completely independent — you can have loud-low or quiet-high sounds.",
      medium:
        "This selector changes what the sound is traveling through. Setting 0 is Air — the most common medium for sound we experience every day, traveling at about 343 m/s. Setting 1 is Water — sound travels through water more than four times faster than through air (about 1480 m/s), which is why dolphins and whales can communicate over long ocean distances. Setting 2 is Vacuum — completely empty space with no matter at all. In a vacuum the wave display disappears because there are no molecules to carry the vibration. This directly shows that sound needs matter to travel.",
      instrumentType:
        "This Pro setting switches the source of the sound between different instrument types. Setting 0 is a Speaker — a flat cone pushing air evenly. Setting 1 is a String — like a guitar or violin string; you can visualize how a stretched string vibrates. Setting 2 is a Drum — a stretched skin that vibrates when hit. Each instrument creates the same wave physics, but the visual shape of the source differs, helping students connect real instruments to the abstract wave concept.",
    },
    misconceptions: [
      {
        wrong: "Sound travels through empty space (vacuum).",
        correct:
          "Sound is a mechanical wave — it works by pushing molecules together and pulling them apart. In a true vacuum there are no molecules at all, so there is nothing to push, and sound simply cannot exist. The medium selector in the simulation set to Vacuum makes the wave disappear entirely to show this directly. Movies often show loud explosions in space, but in reality those explosions would be completely silent. Astronauts in spacesuits cannot hear each other without a radio even though they are only centimeters apart, because between their suits there is vacuum.",
      },
      {
        wrong: "Higher pitch means louder sound.",
        correct:
          "Pitch (determined by frequency) and loudness (determined by amplitude) are two completely separate qualities of a sound. A mouse's high squeak can be very quiet, and a whale's low moan can travel hundreds of kilometers through the ocean. In the simulation you can confirm this: change frequency while keeping amplitude fixed and the wave height stays the same (same loudness, different pitch). Change amplitude while keeping frequency fixed and the wave spacing stays the same (same pitch, different loudness). Pitch and volume are independent sliders for a reason!",
      },
      {
        wrong: "Sound travels at the same speed no matter what it is going through.",
        correct:
          "Sound travels at very different speeds depending on the material. In air at room temperature: about 343 m/s. In water: about 1480 m/s. In steel: about 5960 m/s. Sound travels faster through denser, stiffer materials because molecules pass the vibration along more quickly when they are packed closely together. This is why you can sometimes hear a train coming by pressing your ear to the rail long before you hear it through the air. The medium selector in this simulation changes the wave speed accordingly.",
      },
      {
        wrong: "Sound waves look like up-and-down ripples moving through the air.",
        correct:
          "The wavy line you see on screen is a graph representing the air pressure, not the actual path the air takes. Sound waves are actually compression waves — the air molecules squeeze together (compression) and spread apart (rarefaction) in the same direction the sound travels, like a slinky being pushed and pulled. The side-to-side wave diagram is a convenient picture scientists use to show frequency and amplitude clearly. The actual air molecules mostly stay in place while the pattern of pressure moves forward.",
      },
    ],
    teacherUseCases: [
      "Pitch vs. amplitude independence: set frequency to 440 Hz and amplitude to 0.5. Ask students to predict what changes when you increase frequency to 1000 Hz while leaving amplitude fixed — then observe. Swap: fix frequency and change amplitude. Students confirm the two properties are independent (NGSS 1-PS4-1, 4-PS4-1).",
      "Vacuum demonstration: set frequency to 440 Hz and amplitude to 1.0 in air so students see a clear wave. Switch medium to Vacuum and ask students to explain why the wave vanishes. Connect to the question 'Can you hear explosions in space?' — this is the scientific answer.",
      "Water vs. air comparison: keep frequency at 440 Hz, amplitude at 0.7, and switch between Air and Water. Discuss why dolphins can call to each other across entire oceans. Ask students to predict which medium a submarine would use to detect other ships.",
      "Instrument type exploration (Pro): step through instrumentType 0, 1, and 2 while keeping frequency and amplitude constant. Students sketch each source shape and discuss how different physical objects vibrate but all produce the same kind of pressure wave in air.",
      "Lightning-and-thunder calculation: tell students light is nearly instant and sound travels 343 m/s. Ask them to count seconds between a flash and thunder clap and estimate distance (seconds × 343 m). Then use the frequency slider at 50 Hz to model the deep, low rumble of thunder vs. 1200 Hz for a sharp crack — connecting the sound type to distance from the storm.",
    ],
    faq: [
      {
        question: "Why do you see lightning before you hear thunder if they happen at the same time?",
        answer:
          "Lightning and thunder happen at the exact same moment, but they travel to your ears and eyes at very different speeds. Light travels at about 300,000,000 meters per second — so fast that it crosses a kilometer in less than one ten-thousandth of a second. Sound travels at only about 343 meters per second in air. Over 1 kilometer, light arrives almost instantly while sound takes about 3 seconds. This is why you see the flash first and then wait several seconds before hearing the boom. You can estimate how far away a storm is: count the seconds between the flash and thunder, then divide by 3 to get the approximate distance in kilometers.",
      },
      {
        question: "Why does sound travel faster through solids and water than through air?",
        answer:
          "Sound travels by pushing molecules together and apart in a chain reaction. In a solid like steel, the molecules are packed extremely closely together — when one gets pushed, it almost immediately pushes the next one. In water, molecules are much closer together than in air, though not as close as in a solid. In air, molecules are spread far apart, so each one must travel farther before bumping the next one in line. The closer together the molecules, the faster the vibration chain travels. Think of dominoes: closely spaced dominoes fall faster in a chain than widely spaced ones. That is why sound travels roughly 17 times faster through steel than through air.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports NGSS 1-PS4-1 (plan and conduct investigations to provide evidence that vibrating materials create sound and that sound can make materials vibrate) and 4-PS4-1 (develop a model of waves to describe patterns in terms of amplitude and wavelength, and to show that waves can cause objects to move). The frequency slider directly demonstrates wavelength patterns for PS4-1, while the amplitude slider shows amplitude effects. The medium selector provides evidence for the 1-PS4-1 concept that sound requires a medium. Switching to Vacuum shows what happens when there is no medium — the wave disappears entirely.",
      },
      {
        question: "What is the difference between frequency and pitch?",
        answer:
          "Frequency is the scientific measurement — it is counted in units called Hertz (Hz), which means wiggles per second. Pitch is how humans hear and describe that frequency. High frequency sounds to us as high pitch (like a whistle, a piccolo, or a bird), and low frequency sounds to us as low pitch (like a foghorn, a bass guitar, or thunder rumbling). Your ears can typically detect sounds between about 20 Hz and 20,000 Hz, though very young children often hear higher frequencies than adults. Dogs can hear up to about 65,000 Hz — frequencies completely inaudible to human ears. Frequency is the objective measurement; pitch is the human experience of it.",
      },
      {
        question: "How does a musical instrument make different notes?",
        answer:
          "Different instruments use different methods to control the frequency (pitch) of their vibrations. A guitar changes pitch by pressing strings at different places along the neck — pressing shortens the vibrating part of the string, which makes it wiggle faster and produce a higher pitch. A flute changes pitch by opening or closing holes along its tube — shorter air columns vibrate faster. A drum changes pitch when you tune the tension of the drum skin — tighter skin wiggles faster and makes a higher-pitched sound. All of them use the same underlying idea: controlling how fast something wiggles controls the pitch of the sound it makes. You can model this in the simulation by moving the frequency slider — the wave pattern shows exactly what is happening inside the instrument.",
      },
      {
        question: "Can sound really make things move?",
        answer:
          "Yes, absolutely! Sound waves carry energy, and when they reach an object, they push on it. Very loud, low-frequency sound (like a powerful bass speaker or a nearby explosion) can shake windows, rattle doors, and even knock things off shelves. Doctors use focused ultrasound waves (very high frequency sound) to break apart kidney stones inside the body without surgery. Animals like bats and dolphins use sound pulses (echolocation) that bounce off objects and return, letting them 'see' with sound. Opera singers hitting a precise high note at high volume can shatter a thin glass by matching the glass's natural vibration frequency — the glass shakes so violently it breaks. Sound is far more powerful than it might seem!",
      },
    ],
  },
};
