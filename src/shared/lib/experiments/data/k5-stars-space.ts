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
  contentSections: {
    whatIsIt:
      "On a clear night, away from bright city lights, you can look up and see thousands of tiny points of light scattered across the sky. Those are stars! A star is a huge, very hot ball of glowing gas. Our Sun is actually a star — it just looks so much bigger and brighter because it is much closer to us than any other star. All those other stars are so far away that even at the speed of light it would take years to reach the nearest one. Some stars look brighter than others. That can happen for two reasons: the star is really big and powerful, or the star is closer to Earth. A small star close by can look just as bright as a huge star far away. Long ago, people connected the stars into dot-to-dot pictures called constellations. Different cultures around the world made up stories about these star patterns. Today we still use constellations to find our way around the night sky. Our solar system — the Sun and the eight planets that travel around it — is just one tiny part of a galaxy containing hundreds of billions of stars.",
    parameterExplanations: {
      starBrightness:
        "This slider changes how bright the stars appear on screen. In real life, star brightness depends on both how big and hot a star is and how far it is from Earth. Set this to a low number like 10 percent to see only the brightest stars — the ones you can spot even near city lights. Turn it up to 100 percent to see many more stars, like being far from any city on a very dark night. Try both and notice how many more stars appear in the darker sky.",
      viewDistance:
        "This slider changes how far away from Earth you are looking. When you set a small distance like 1 to 10 light-years, you see only the very nearest stars — just a few. As you increase the distance to 200 or 500 light-years, you see many more stars because you are looking at a bigger region of space. Notice that stars farther away tend to look dimmer, even if some of them are actually larger and hotter than closer stars.",
    },
    misconceptions: [
      {
        wrong: "The brightest star in the night sky is the biggest star.",
        correct:
          "A star can look bright because it is large and hot, or simply because it is close to Earth. Some of the brightest stars we see are not the biggest stars in the galaxy — they are just the nearest ones. For example, the star Sirius looks very bright partly because it is one of the closer stars to Earth. There are much larger stars far away that look dim to us because of the distance.",
      },
      {
        wrong: "Stars are only out at night — they disappear during the day.",
        correct:
          "Stars are there all day long! We just cannot see them during the day because the Sun is so bright that its light fills the sky and drowns out the dimmer starlight. If you could somehow block the Sun and make the sky dark during the day, you would see stars just as clearly as at night. Astronauts in space can see stars even when the Sun is shining because there is no atmosphere to scatter the sunlight.",
      },
      {
        wrong: "All stars look the same — just little white dots.",
        correct:
          "Stars come in different colors! Red stars are cooler, while blue-white stars are much hotter. Our Sun is a yellow-white star and is somewhere in the middle. If you look carefully at the night sky or through binoculars, you can often spot color differences. The star Betelgeuse in Orion has a noticeable reddish tint. Color can tell us a lot about a star's temperature and age.",
      },
      {
        wrong: "Constellations are groups of stars that are close together in space.",
        correct:
          "Constellations are patterns that only appear from Earth's viewpoint. The stars in a constellation are often at very different distances from us — some might be 50 light-years away while others in the same pattern are 500 light-years away. They just happen to look like they are near each other from where we stand on Earth. If you traveled to another star and looked back, the constellations would look completely different.",
      },
    ],
    teacherUseCases: [
      "Set viewDistance to 1 light-year and then slowly increase to 500 light-years; ask students to count roughly how many stars appear and discuss why the number grows so much.",
      "Set starBrightness to 30 percent to simulate a city sky, then increase to 90 percent to show a dark rural sky; discuss how light pollution affects what we can observe.",
      "Use the constellation viewer to show Orion and Big Dipper; have students sketch the patterns and make up their own story about the shape they see.",
      "Set viewDistance to 50 light-years and ask students which stars they think might be nearest to Earth — this leads to a discussion of light-years as a unit of distance.",
    ],
    faq: [
      {
        question: "How far away are the stars we see at night?",
        answer:
          "Stars are incredibly far away — much farther than anything else you can see with your eyes. Scientists measure star distances in light-years. One light-year is how far light travels in one year, and light moves about 300,000 kilometers every single second! The nearest star to our Sun, called Proxima Centauri, is about 4.2 light-years away. That means even if you could travel at the speed of light, it would take more than four years to get there. Most of the stars you see at night are hundreds or thousands of light-years away. This is connected to NGSS standard 5-ESS1-1, which asks students to support an argument that differences in apparent brightness of stars are due to their distance from Earth and their actual brightness.",
      },
      {
        question: "Why do stars twinkle?",
        answer:
          "Stars do not actually twinkle — they shine steadily. The twinkling we see is caused by Earth's atmosphere. Air is always moving and has pockets of different temperatures and densities. As starlight passes through this moving air on its way to your eyes, it bends in slightly different directions very quickly, making the star appear to flicker. This is called atmospheric twinkle or scintillation. Planets, which are closer and appear as tiny discs rather than points of light, usually twinkle less than stars. Astronauts in space see stars shine steadily because there is no atmosphere above them.",
      },
      {
        question: "What is a constellation and why do they matter?",
        answer:
          "A constellation is a named pattern of stars that people on Earth have agreed to recognize. There are 88 official constellations covering the whole sky, decided by astronomers in 1930. Ancient cultures — including Greek, Egyptian, Chinese, and Native American peoples — used constellations to keep track of seasons, navigate at sea, and tell stories. For example, Orion the Hunter rises in winter evenings, signaling cold weather. The Big Dipper, part of Ursa Major the Great Bear, points toward the North Star (Polaris), which has helped sailors and travelers find north for thousands of years. Constellations are still used by astronomers today to describe regions of the sky.",
      },
      {
        question: "Is our Sun special compared to other stars?",
        answer:
          "Our Sun is a pretty ordinary star by cosmic standards! It is a medium-sized, middle-aged yellow dwarf star. There are stars much bigger and hotter than the Sun, and many smaller, cooler ones. What makes the Sun special to us is that it is close enough to warm our planet and give us daylight and energy for life. The Sun is about 150 million kilometers from Earth — close enough that its light reaches us in just about 8 minutes. The next nearest star is so far away that its light takes over four years to reach us. So while the Sun is ordinary as stars go, it is the most important star in our lives.",
      },
      {
        question: "How many planets are in our solar system?",
        answer:
          "Our solar system has eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. They all travel around the Sun in paths called orbits. The inner four planets — Mercury, Venus, Earth, and Mars — are smaller and rocky. The outer four — Jupiter, Saturn, Uranus, and Neptune — are much larger and made mostly of gas and ice. Jupiter is so big that more than 1,300 Earths could fit inside it! Beyond Neptune there are also smaller icy worlds like Pluto, which used to be called a planet but is now called a dwarf planet. All eight planets travel around the Sun because of gravity — the invisible pulling force that holds the solar system together.",
      },
    ],
  },
};
