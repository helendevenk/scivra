import type { Experiment } from "@/shared/types/experiment";

export const k5MoonPhases: Experiment = {
  id: "k5-moon-phases",
  slug: "k5-moon-phases",
  title: "Earth-Moon Phases",
  subtitle: "Watch the Moon orbit Earth and see why its bright shape changes",
  description:
    "Explore the Earth-Moon system in 3D. Speed up or slow down the Moon's orbit, change the camera tilt, and jump to New Moon, Full Moon, or Quarter Moon. Students see that the Moon reflects sunlight and that the phase we see depends on where the Moon is in its orbit around Earth.",
  thumbnail: "/imgs/experiments/k5-moon-phases.png",

  standards: {
    ngss: ["1-ESS1-1", "5-ESS1-2"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "3-5",
  tags: ["moon phases", "earth moon system", "lunar cycle", "moon orbit", "sunlight", "elementary earth science", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "speed",
      label: "Orbit Speed",
      unit: "×",
      min: 0.1,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "tilt",
      label: "Camera Tilt",
      unit: "°",
      min: 5,
      max: 89,
      default: 30,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "T_{\\text{lunar cycle}} \\approx 29.5\\ \\text{days}",
      description: "It takes about 29.5 days for the Moon to go through one full set of phases.",
    },
    {
      latex: "\\text{Illuminated part} = \\frac{1 - \\cos(\\theta)}{2} \\times 100\\%",
      description: "The visible bright part changes as the Moon's angle around Earth changes.",
    },
  ],

  theory:
    "The Moon is a round object in space, but it can look like a thin crescent, a half circle, or a bright full circle from Earth. The Moon does not make its own light. It reflects light from the Sun. Half of the Moon is always lit by the Sun, but from Earth we only see part of that lit half. As the Moon travels around Earth, our view changes. When the Moon is between Earth and the Sun, we see mostly the dark side, called New Moon. When the Moon is on the opposite side of Earth from the Sun, we see the bright side, called Full Moon. The pattern repeats about every 29.5 days.",

  instructions:
    "Use Orbit Speed to control how quickly the Moon moves around Earth. Use Camera Tilt to change your viewing angle and look at the orbit from a lower or higher position. Click New Moon, Full Moon, or Quarter Moon to jump to important positions in the lunar cycle. Watch the phase name, illuminated percent, cycle day, and orbit angle update as the Moon moves.",

  challenges: [
    {
      id: "k5mp-c1",
      question: "Does the Moon make its own light?",
      hint: "No. The Moon reflects sunlight. The bright part you see is the part of the Moon lit by the Sun.",
      tier: "free",
    },
    {
      id: "k5mp-c2",
      question: "What changes when the Moon seems to change shape?",
      hint: "The Moon stays round. What changes is how much of the sunlit half we can see from Earth.",
      tier: "free",
    },
    {
      id: "k5mp-c3",
      question: "Use the presets. Which preset shows the Moon between Earth and the Sun?",
      hint: "Choose New Moon. In that position, the lit side faces mostly away from Earth, so the Moon looks dark to us.",
      tier: "free",
    },
    {
      id: "k5mp-c4",
      question: "Does Camera Tilt change the real Moon phase?",
      hint: "No. Camera Tilt changes your view of the model. The Moon phase changes because of the Moon's position in its orbit.",
      tier: "free",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-day-night-seasons", "gravitational-fields"],
  htmlPath: "/experiments/elementary/k5-moon-phases.html",

  seoTitle: "Earth-Moon Phases Simulation for Kids | Scivra Elementary Earth Science",
  seoKeywords: [
    "moon phases simulation for kids",
    "earth moon phases elementary",
    "moon orbit around earth",
    "new moon full moon quarter moon",
    "K5 earth science moon phases",
    "lunar cycle for students",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Moon phases, Moon orbit, and reflected sunlight",
  },

  htmlControlAliases: { speed: "sliderSpeed", tilt: "sliderTilt" },
  presets: [
    {
      id: "new",
      label: "New Moon",
      description:
        "Jumps to the position where the Moon is between Earth and the Sun. From Earth, we see mostly the dark side.",
      paramValues: { speed: 1, tilt: 30 },
    },
    {
      id: "full",
      label: "Full Moon",
      description:
        "Jumps to the position where the Moon is opposite the Sun. From Earth, we see the bright face of the Moon.",
      paramValues: { speed: 1, tilt: 30 },
    },
    {
      id: "quarter",
      label: "Quarter Moon",
      description:
        "Jumps to a half-lit view. This helps students compare a quarter phase with New Moon and Full Moon.",
      paramValues: { speed: 1, tilt: 30 },
    },
  ],

  contentSections: {
    whatIsIt:
      "Moon phases are the changing shapes of the bright Moon we see in the sky. The Moon itself does not stretch, shrink, or disappear. It stays round. The Sun lights one half of the Moon, and the other half is dark. As the Moon orbits Earth, we see different amounts of the lit half. Sometimes we see almost none of it, called New Moon. Sometimes we see half of it, called Quarter Moon. Sometimes we see the whole bright face, called Full Moon. This model lets you watch the Moon travel around Earth and connect each phase to the Moon's position.",
    parameterExplanations: {
      speed:
        "Orbit Speed changes how fast the animation runs in this model. It does not change how fast the real Moon moves in space. Use a slow setting when students need time to stop, point, and describe what they see. They can watch the Moon move from a dark New Moon to a half-lit Quarter Moon, then to a bright Full Moon. Use a faster setting after students understand one part of the cycle. The fast view helps them notice that the same pattern repeats again and again, just like the real lunar cycle repeats about every 29.5 days.",
      tilt:
        "Camera Tilt changes the viewing angle of the model. A lower tilt looks more from the side, which can make it easier to compare the Moon, Earth, and the Sun's light direction. A higher tilt looks more from above, which can make the Moon's path around Earth easier to see. This slider is useful for talking about models: moving the camera changes our view, but it does not change the real Moon phase. The phase still comes from the Moon's place in its orbit and how much of the sunlit half we can see from Earth.",
    },
    misconceptions: [
      {
        wrong: "The Moon changes shape during the month.",
        correct:
          "The Moon stays round. We see different amounts of its sunlit half as it moves around Earth.",
      },
      {
        wrong: "The Moon makes its own light.",
        correct:
          "The Moon reflects sunlight. The bright part is the side facing the Sun.",
      },
      {
        wrong: "A faster Orbit Speed means the real Moon moves faster.",
        correct:
          "The speed slider only changes the model animation. In real life, the phase cycle takes about 29.5 days.",
      },
      {
        wrong: "Camera Tilt changes the Moon phase.",
        correct:
          "Camera Tilt changes how you look at the model. The phase changes because the Moon is in a different place in its orbit.",
      },
      {
        wrong: "Earth's shadow causes the Moon phases every month.",
        correct:
          "Most Moon phases are caused by our changing view of the Moon's sunlit half. Earth's shadow is only involved during a lunar eclipse. At Quarter Moon, we see about half of the always-lit side from Earth, not because Earth's shadow covers the rest.",
      },
    ],
    teacherUseCases: [
      "Start with the New Moon, Full Moon, and Quarter Moon presets. Have students describe where the Moon is compared with Earth and the Sun.",
      "Ask students to keep Camera Tilt at 30 degrees and change only Orbit Speed. They can observe that the same phase pattern repeats.",
      "Pause the animation at New Moon, First Quarter, Full Moon, and Last Quarter. Students draw each phase and label the lit part.",
      "Use Camera Tilt as a model discussion: students explain the difference between changing a viewpoint and changing the Moon's real position.",
      "Connect observations to NGSS 1-ESS1-1 by having students record Moon phase patterns, then connect the orbit model to NGSS 5-ESS1-2. Have partners take turns: one names the phase on screen, the other uses Earth, Moon, and Sun position words to justify the answer, then journal real sky observations across several nights to compare with the repeating simulation pattern.",
    ],
    faq: [
      {
        question: "Why does the Moon look different on different nights?",
        answer:
          "The Moon orbits Earth. As it moves, we see different amounts of the half that is lit by the Sun. That makes the Moon look like a crescent, a half circle, or a full circle.",
      },
      {
        question: "How long does one Moon phase cycle take?",
        answer:
          "One full cycle from New Moon back to New Moon takes about 29.5 days. That is why the Moon's shape changes slowly from night to night.",
      },
      {
        question: "What is a New Moon?",
        answer:
          "A New Moon happens when the Moon is between Earth and the Sun. The lit side faces mostly away from us, so the Moon looks dark from Earth.",
      },
      {
        question: "What is a Full Moon?",
        answer:
          "A Full Moon happens when the Moon is on the opposite side of Earth from the Sun. The side facing Earth is lit, so the Moon looks bright and round.",
      },
      {
        question: "What does the Camera Tilt slider teach?",
        answer:
          "Camera Tilt helps you look at the model from different angles. It shows that a model can be viewed in different ways, while the phase itself depends on where the Moon is in its orbit.",
      },
      {
        question: "Why do we always see the same face of the Moon, and what causes eclipses?",
        answer:
          "The Moon spins once in about the same time it takes to orbit Earth once. Because those motions match, the same side usually faces Earth and we never see the far side from the ground. An eclipse is different: it happens when the Sun, Earth, and Moon line up very closely. In a solar eclipse, the Moon blocks sunlight from reaching part of Earth. In a lunar eclipse, Earth blocks sunlight from reaching the Moon.",
      },
    ],
  },
};
