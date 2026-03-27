import type { Experiment } from "@/shared/types/experiment";

export const k5StarsSpace: Experiment = {
  id: "k5-stars-space",
  slug: "k5-stars-space",
  title: "Stars & Space",
  subtitle: "Explore constellations, star brightness, and our solar system",
  description:
    "Journey through the night sky and discover the wonders of space. Observe how stars have different brightness levels depending on their size and distance from Earth. Identify famous constellations like the Big Dipper and Orion. Explore our solar system and compare planet sizes and distances from the Sun.",
  thumbnail: "/imgs/experiments/k5-stars-space.png",

  standards: {
    ngss: ["5-ESS1-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "3-5",
  tags: [
    "stars",
    "constellations",
    "solar system",
    "brightness",
    "space",
    "earth science",
    "elementary",
    "K-5",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "starBrightness",
      label: "Star Brightness",
      unit: "%",
      min: 10,
      max: 100,
      default: 70,
      step: 5,
      tier: "free",
    },
    {
      id: "viewDistance",
      label: "Viewing Distance",
      unit: "light-years",
      min: 1,
      max: 500,
      default: 50,
      step: 10,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex:
        "\\text{Brightness} \\propto \\frac{1}{\\text{Distance}^2}",
      description:
        "Stars appear dimmer the farther away they are — brightness decreases with the square of the distance",
    },
  ],

  theory:
    "Stars are enormous balls of hot gas (mostly hydrogen and helium) that produce light and heat through nuclear fusion. Our Sun is the closest star to Earth. Stars appear as tiny points of light because they are incredibly far away. Some stars look brighter than others — this depends on both their actual size and how far they are from us. A very large star far away might look dimmer than a smaller star that is closer. Groups of stars that form patterns in the sky are called constellations. Ancient people used constellations to navigate and tell stories. Our solar system has eight planets orbiting the Sun, each at a different distance.",

  instructions:
    "Adjust Star Brightness to see how bright different stars appear in the night sky. Change the Viewing Distance to understand why faraway stars look dimmer. Click on constellations to learn their names and stories. Compare the planets in our solar system by size and distance from the Sun.",

  challenges: [
    {
      id: "ss-c1",
      question:
        "Why do some stars look brighter than others in the night sky?",
      hint: "Two reasons: 1) Some stars are actually bigger and produce more light. 2) Some stars are closer to Earth, so their light appears brighter. A dim-looking star might actually be a giant star that is very far away.",
      tier: "free",
    },
    {
      id: "ss-c2",
      question:
        "What is a constellation? Can you name two constellations visible from North America?",
      hint: "A constellation is a group of stars that forms a recognizable pattern in the sky. Examples include Orion (the Hunter), which has three bright stars in a row forming a belt, and Ursa Major (the Great Bear), which contains the Big Dipper pattern.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["solar-system-scale", "star-life-cycle"],

  htmlPath: "/experiments/elementary/k5-stars-space.html",

  seoTitle:
    "Stars & Space Simulation for Kids | Scivra Elementary Earth Science",
  seoKeywords: [
    "stars and space kids simulation",
    "constellations interactive elementary",
    "solar system K-5 science",
    "star brightness for kids",
    "space exploration elementary",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Stars, Constellations, and the Solar System",
  },
};
