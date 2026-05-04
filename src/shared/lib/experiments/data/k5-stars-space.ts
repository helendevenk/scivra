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
      id: "starCount",
      label: "Stars",
      unit: "stars",
      min: 100,
      max: 3000,
      default: 500,
      step: 50,
      tier: "free",
    },
    {
      id: "zoom",
      label: "Zoom",
      unit: "x",
      min: 0.3,
      max: 5,
      default: 1,
      step: 0.1,
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
    "Use the Stars slider to choose how many stars fill the sky, and use the Zoom slider to look close up or far out. Try the Night Sky, Milky Way Core, and Nearby Stars presets to compare a calm sky, a crowded galaxy view, and a smaller group of close stars.",

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
  htmlControlAliases: { starCount: "sliderCount", zoom: "sliderZoom" },
  presets: [
    {
      id: "night",
      label: "Night Sky",
      description:
        "A clear night sky with a comfortable number of stars. Use it to start observing star patterns and to compare how the sky changes when more or fewer stars are shown.",
    },
    {
      id: "milkyWay",
      label: "Milky Way Core",
      description:
        "A crowded star field like looking toward the bright center of our galaxy. This preset helps students notice that some parts of space can look much more packed with stars.",
    },
    {
      id: "nearby",
      label: "Nearby Stars",
      description:
        "A closer view with fewer stars, like focusing on stars near our part of space. Use it to talk about how zooming changes what we can observe.",
    },
  ],
  contentSections: {
    whatIsIt:
      "On a clear night, away from bright city lights, you can look up and see thousands of tiny points of light scattered across the sky. Those are stars! A star is a huge, very hot ball of glowing gas. Our Sun is actually a star — it just looks so much bigger and brighter because it is much closer to us than any other star. All those other stars are so far away that even at the speed of light it would take years to reach the nearest one. Some stars look brighter than others. That can happen for two reasons: the star is really big and powerful, or the star is closer to Earth. A small star close by can look just as bright as a huge star far away. Long ago, people connected the stars into dot-to-dot pictures called constellations. Different cultures around the world made up stories about these star patterns. Today we still use constellations to find our way around the night sky. Our solar system — the Sun and the eight planets that travel around it — is just one tiny part of a galaxy containing hundreds of billions of stars.",
    parameterExplanations: {
      starCount:
        "Star Count changes how many stars you can see in the sky. A low number shows a quiet sky with only a few bright points. A high number fills the screen with many stars, more like a very dark place far from city lights. Try moving this slider slowly. Ask yourself: does it become easier or harder to find patterns? Then compare the Night Sky and Milky Way Core presets. This helps you notice that space is huge, and some sky views can look much more crowded than others.",
      zoom:
        "Zoom changes how close the star view looks. A small zoom number lets you see a wide part of the sky at once. A big zoom number makes the view feel closer, so stars spread out and small groups are easier to study. Try changing only Zoom while leaving Star Count the same. You are not changing the real stars; you are changing your view, like using binoculars or stepping back from a picture. Then try Nearby Stars to focus on a simpler view.",
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
          "Stars come in different colors! Red stars are cooler, while blue-white stars are much hotter. Our Sun is a yellow-white star and is somewhere in the middle. If you look carefully at the night sky or through binoculars, you can often spot color differences. The star Betelgeuse in Orion has a noticeable reddish tint. Color tells us a lot about a star's temperature, and sometimes about a star's type or life stage.",
      },
      {
        wrong: "Constellations are groups of stars that are close together in space.",
        correct:
          "Constellations are patterns that only appear from Earth's viewpoint. The stars in a constellation are often at very different distances from us — some might be 50 light-years away while others in the same pattern are 500 light-years away. They just happen to look like they are near each other from where we stand on Earth. If you traveled to another star and looked back, the constellations would look completely different.",
      },
    ],
    teacherUseCases: [
      "Begin with the Night Sky preset and ask students to describe what they observe before changing any controls, building a shared evidence list for NGSS 5-ESS1-1.",
      "Move the Stars slider from 100 to 3000 while students record how the number of visible stars changes the patterns they can notice.",
      "Keep Stars at 500 and move the Zoom slider from 0.3 to 5 so students can compare a wide view with a close view using precise observation language.",
      "Use the Milky Way Core preset to discuss why some sky regions appear crowded, then have students compare it with the Nearby Stars preset.",
      "Ask students to choose one preset, cite the Star Count and Zoom values as evidence, and explain how the view supports a claim about observing stars from Earth.",
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
          "Stars do not actually twinkle — they shine steadily. The twinkling we see is caused by Earth's atmosphere. Air is always moving and has pockets of different temperatures and densities. As starlight passes through this moving air on its way to your eyes, it bends in slightly different directions very quickly, making the star appear to flicker. This twinkling is caused by moving air (scientists call it atmospheric scintillation, but you can just call it atmospheric twinkle). Planets, which are closer and appear as tiny discs rather than points of light, usually twinkle less than stars. Astronauts in space see stars shine steadily because there is no atmosphere above them.",
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
