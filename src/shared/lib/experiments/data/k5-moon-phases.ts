import type { Experiment } from "@/shared/types/experiment";

export const k5MoonPhases: Experiment = {
  id: "k5-moon-phases",
  slug: "k5-moon-phases",
  title: "Moon Phases",
  subtitle: "Why the Moon appears to change shape each night",
  description:
    "Orbit the Moon around Earth and watch its phase change from New Moon to Full Moon and back. See the Moon from above (top view) to understand why we see different portions lit by the Sun. Track the 29.5-day lunar cycle.",
  thumbnail: "/imgs/experiments/k5-moon-phases.png",

  standards: {
    ngss: ["1-ESS1-1", "MS-ESS1-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "K-2",
  tags: ["moon phases", "lunar cycle", "new moon", "full moon", "crescent", "earth science", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "moonAngle",
      label: "Moon's Position in Orbit",
      unit: "°",
      min: 0,
      max: 360,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "orbitSpeed",
      label: "Animation Speed",
      unit: "×",
      min: 1,
      max: 30,
      default: 5,
      step: 1,
      tier: "free",
    },
    {
      id: "showEclipse",
      label: "Show Eclipse Geometry (0=No, 1=Yes)",
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
      latex: "\\text{Lunar cycle} = 29.5 \\text{ days}",
      description: "The Moon completes one full orbit around Earth in 29.5 days",
    },
    {
      latex: "\\text{New} \\to \\text{Crescent} \\to \\text{Quarter} \\to \\text{Gibbous} \\to \\text{Full} \\to \\cdots",
      description: "The eight phases of the Moon in order",
    },
  ],

  theory:
    "The Moon does not emit its own light — it reflects sunlight. As the Moon orbits Earth once every 29.5 days, we see different portions of its lit side from Earth, creating the phases. New Moon: Moon is between Earth and Sun — we see the unlit side (dark). Waxing Crescent: small sliver visible. First Quarter: half the Moon is lit (right half). Waxing Gibbous: more than half lit. Full Moon: Moon is opposite the Sun — we see the fully lit side. Then the cycle reverses: Waning Gibbous, Last Quarter, Waning Crescent, back to New Moon. Lunar eclipses occur when Earth's shadow falls on the full Moon; solar eclipses when the new Moon covers the Sun.",

  instructions:
    "Use the Moon's Position slider to move the Moon around Earth. Watch the phase display update. Try animating at high speed to see the full cycle. Toggle to top view to see why the lit portion changes. Enable Eclipse Geometry (Pro) to see when eclipses can occur.",

  challenges: [
    {
      id: "mp-c1",
      question: "Why does the Moon appear to change shape? Does the Moon itself actually change?",
      hint: "No! The Moon's shape doesn't change — it's always a sphere. What changes is how much of the lit (sunlit) side we can see from Earth as the Moon orbits. We're seeing different angles of the same lit half.",
      tier: "free",
    },
    {
      id: "mp-c2",
      question: "During which phase is a lunar eclipse possible? A solar eclipse?",
      hint: "Lunar eclipse: Full Moon (Earth's shadow can block sunlight from reaching the Moon). Solar eclipse: New Moon (Moon can pass between Earth and Sun, blocking sunlight). Not every new/full moon causes an eclipse because the Moon's orbit is tilted 5° relative to Earth's orbit.",
      tier: "free",
    },
    {
      id: "mp-c3",
      question: "How long does it take to go from New Moon to Full Moon?",
      hint: "About 14-15 days (half of the 29.5-day lunar cycle). From New Moon → Full Moon is waxing (growing). From Full Moon → New Moon is waning (shrinking).",
      tier: "free",
    },
    {
      id: "mp-c4",
      question: "Why do we always see the same face of the Moon from Earth?",
      hint: "The Moon rotates on its axis in exactly the same time it takes to orbit Earth — about 27.3 days for one rotation and one orbit — this is called 'tidal locking.' The full phase cycle (New Moon back to New Moon) takes about 29.5 days because Earth moves along its own orbit during that time. Gravity from Earth gradually slowed the Moon's rotation over billions of years until it synchronized with its orbital period.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-day-night-seasons", "gravitational-fields"],

  seoTitle: "Moon Phases Simulation for Kids | Scivra Elementary Earth Science",
  seoKeywords: [
    "moon phases kids simulation",
    "lunar cycle interactive elementary",
    "new moon full moon crescent",
    "K-5 earth science moon",
    "moon orbit simulation kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Moon Phases and Lunar Cycle",
  },
  contentSections: {
    whatIsIt:
      "Have you ever looked at the Moon and noticed it looks different from one night to the next? Some nights it is a tiny sliver. Other nights it is a big bright circle. And sometimes you can hardly see it at all! The Moon is not actually changing shape. It is always a round ball — just like Earth. What changes is how much of the lit side we can see from our backyard. The Sun shines on one half of the Moon at all times. As the Moon travels around Earth, we see different amounts of that sunlit half. When the Moon is between us and the Sun, we see mostly the dark side — that is called a New Moon. When Earth is between the Moon and the Sun, we can see the whole bright side — that is a Full Moon! It takes about 29 and a half days for the Moon to go all the way around Earth and show us all its phases. This experiment lets you move the Moon yourself and watch the phases change.",
    parameterExplanations: {
      moonAngle:
        "This slider moves the Moon around Earth. When it is at 0 degrees, the Moon is between Earth and the Sun — that gives you a New Moon (dark). Move it to 180 degrees and the Moon is on the opposite side of Earth from the Sun — that is a Full Moon (bright and round). Try moving it slowly from 0 all the way to 360 to see all eight phases in order.",
      orbitSpeed:
        "This slider controls how fast the Moon moves in the animation. In real life, the Moon takes about 29 and a half days to go all the way around Earth. That is too slow to watch in class! Turn this up to speed up the animation. At speed 5, you can watch the full lunar cycle in just a few seconds.",
      showEclipse:
        "This Pro slider turns eclipse geometry on or off. Set it to 1 to see the lines that show when the Moon lines up just right to cause a solar eclipse (New Moon blocking the Sun) or a lunar eclipse (Earth's shadow covering the Full Moon). Set it to 0 to keep the view simple.",
    },
    misconceptions: [
      {
        wrong: "The Moon makes its own light, like a lamp.",
        correct:
          "The Moon does not make any light at all. It only reflects sunlight — like a mirror or a white piece of paper in sunshine. The side of the Moon facing the Sun is lit up bright. The side facing away is dark. We see the Moon glow because sunlight bounces off it and reaches our eyes. If the Sun disappeared, we would not be able to see the Moon at all.",
      },
      {
        wrong: "The Moon changes shape during the month.",
        correct:
          "The Moon is always a sphere — a round ball. It never changes shape. What changes is how much of the lit side we can see from Earth as the Moon travels around us. It is like walking around a lamp in a dark room — from different spots you see different amounts of the lit side of the lamp.",
      },
      {
        wrong: "A lunar eclipse happens every Full Moon.",
        correct:
          "A lunar eclipse can only happen at Full Moon, but it does not happen every Full Moon. The Moon's path around Earth is tilted a little compared to Earth's path around the Sun. Usually the Moon passes a little above or below Earth's shadow. Only when all three line up perfectly does an eclipse happen — a few times each year.",
      },
      {
        wrong: "We can see all sides of the Moon if we wait long enough.",
        correct:
          "We always see the same side of the Moon from Earth. The Moon spins on its own axis, but it takes the exact same amount of time to spin once as it takes to orbit Earth once — about 27.3 days for both. This keeps the same face pointing toward us all the time. (The full phase cycle of 29.5 days is a little longer because Earth itself moves around the Sun during that time.) Spacecraft have been sent to photograph the far side, which humans only saw for the first time in 1959.",
      },
    ],
    teacherUseCases: [
      "Set moonAngle to 0, 90, 180, and 270 degrees and have students draw the phase they see at each position — then label New Moon, First Quarter, Full Moon, and Last Quarter.",
      "Use orbitSpeed at 10 to animate the full 29.5-day lunar cycle in class; pause at each major phase and ask students to predict the next phase.",
      "Set moonAngle to 180 degrees (Full Moon) and enable showEclipse to show students how a lunar eclipse requires precise alignment of Sun, Earth, and Moon.",
      "Challenge students to set moonAngle to the position that creates a Waxing Crescent, then verify by moving slowly from 0 to about 45 degrees.",
      "Use the top-view mode to help students understand why the lit portion changes — show that the Sun always lights the same side while Earth's viewpoint shifts.",
    ],
    faq: [
      {
        question: "Why does the Moon look different every night?",
        answer:
          "The Moon travels around Earth, and as it moves, we see different parts of its sunlit side. When the Moon is next to the Sun in the sky, we see the dark side — barely any Moon at all (New Moon). As the Moon moves away from the Sun over the next two weeks, we see more and more of the lit side until we see the whole bright circle (Full Moon). Then it slowly comes back to the dark side again. The whole cycle takes about 29 and a half days. This observation is part of NGSS standard 1-ESS1-1, which covers patterns of the Moon in the sky.",
      },
      {
        question: "How long does it take to go from New Moon to Full Moon?",
        answer:
          "It takes about 14 to 15 days to go from New Moon to Full Moon — that is half of the 29.5-day lunar cycle. During those two weeks, the Moon is called waxing, which is a fancy word meaning growing. You can see a little more of the lit side each night. After Full Moon, the lit portion gets smaller each night — that is called waning, meaning shrinking. If you look at the Moon for two weeks in a row and draw what you see each night, you will see the pattern change from a small crescent to a full circle and back.",
      },
      {
        question: "Can we ever see the other side of the Moon?",
        answer:
          "Not from Earth! We always see the same side because the Moon takes the same amount of time to spin once as it takes to travel around Earth — about 27.3 days for both its rotation and its orbit. (The full phase cycle of 29.5 days is slightly longer because Earth itself moves around the Sun during that time.) This is called tidal locking. Gravity from Earth has gradually slowed the Moon's spin over billions of years until it matched its orbit perfectly. The first people to see the far side of the Moon were the astronauts of Apollo 8, who flew around the Moon in 1968. We now have photos of the entire Moon from spacecraft, so scientists know what the far side looks like even though you can never see it from your backyard.",
      },
      {
        question: "What is a lunar eclipse?",
        answer:
          "A lunar eclipse happens when Earth moves between the Sun and the Full Moon, and Earth's shadow falls on the Moon. For a short time, the Moon can look dark or even reddish-orange — sometimes called a Blood Moon! The reddish color happens because Earth's atmosphere bends some red sunlight around the edges of Earth and onto the Moon, like a giant sunset glow. Lunar eclipses can usually be seen anywhere on the night side of Earth and are safe to look at without special glasses. They happen a few times each year but not every Full Moon, because the Moon's path is slightly tilted.",
      },
      {
        question: "Is there a dark side of the Moon that never gets sunlight?",
        answer:
          "There is a far side of the Moon that we never see from Earth, but it is not always dark. Sunlight hits all sides of the Moon at different times as the Moon orbits Earth over 29.5 days. During a New Moon, the far side of the Moon is actually fully lit by the Sun, while the side facing us is in shadow. The terms far side and dark side are often confused — the far side receives just as much sunlight as the near side on average. The only truly dark part of the Moon is inside deep craters near the poles that never get any sunlight.",
      },
    ],
  },
};
