import type { Experiment } from "@/shared/types/experiment";

export const k5LightPropagation: Experiment = {
  id: "k5-light-propagation",
  slug: "k5-light-propagation",
  title: "Light & Optics",
  subtitle: "How light travels, reflects, and bends",
  description:
    "Shine a beam of light and see it travel in straight lines. Aim at mirrors to watch reflection. Send light through water or glass to see refraction — the bending of light. Discover why objects appear different colors and how shadows form.",
  thumbnail: "/imgs/experiments/k5-light-propagation.png",

  standards: {
    ngss: ["1-PS4-3", "4-PS4-2", "MS-PS4-2"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "waves",
  subject: "physics",
  gradeLevel: "3-5",
  tags: ["light", "reflection", "refraction", "shadow", "optics", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "lightAngle",
      label: "Light Source Angle",
      unit: "°",
      min: 0,
      max: 90,
      default: 45,
      step: 5,
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
    {
      id: "mirrorAngle",
      label: "Mirror Angle",
      unit: "°",
      min: 0,
      max: 90,
      default: 45,
      step: 5,
      tier: "free",
    },
    {
      id: "colorFilter",
      label: "Light Color (0=White, 1=Red, 2=Blue, 3=Green)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\theta_i = \\theta_r \\quad (\\text{law of reflection})",
      description: "Angle of incidence = angle of reflection",
    },
    {
      latex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 \\quad (\\text{Snell's law})",
      description: "Snell's Law — light bends when entering a new medium",
    },
  ],

  theory:
    "Light travels in straight lines called rays. When light hits a smooth surface (like a mirror), it bounces off — this is reflection. The angle at which light hits equals the angle at which it bounces: angle of incidence = angle of reflection. When light passes from one material to another (air to water, for example), it bends — this is refraction. Light bends toward the normal line when entering a denser medium and away when leaving. This is why a straw looks bent in a glass of water. Objects appear a certain color because they reflect that color of light and absorb all others. Transparent objects let light through; opaque objects block it; translucent objects let some through.",

  instructions:
    "Adjust the light source angle and watch the beam travel. Aim it at the mirror and see reflection — measure both angles! Switch the medium to Water or Glass and watch the beam bend as it crosses the boundary. Use the color filter (Pro) to explore how color affects refraction.",

  challenges: [
    {
      id: "lp-c1",
      question: "If a light ray hits a mirror at 30° from the normal, at what angle does it reflect?",
      hint: "Law of reflection: angle of incidence = angle of reflection. The reflected ray leaves at 30° from the normal.",
      tier: "free",
    },
    {
      id: "lp-c2",
      question: "Why does a straw appear bent when placed in a glass of water?",
      hint: "Light bends (refracts) when it moves from water (denser) to air (less dense). Your eyes trace the light back in a straight line, making the straw appear bent at the water surface.",
      tier: "free",
    },
    {
      id: "lp-c3",
      question: "Why does a red apple appear red?",
      hint: "The apple absorbs most wavelengths of light but reflects red wavelengths. Only the reflected red light reaches your eyes, so the apple appears red.",
      tier: "free",
    },
    {
      id: "lp-c4",
      question: "Light travels at 3×10⁸ m/s in air and at 2.25×10⁸ m/s in water. What is the index of refraction of water?",
      hint: "n = c/v = (3×10⁸)/(2.25×10⁸) = 1.33. This is why light bends when entering water.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-sound-waves", "em-spectrum", "wave-interference"],

  seoTitle: "Light and Optics for Kids | Scivra Elementary Science",
  seoKeywords: [
    "light reflection refraction kids",
    "optics simulation elementary",
    "Snell's law interactive",
    "shadow formation simulation",
    "K-5 physics light",
    "mirror reflection kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Light Propagation and Optics",
  },
  contentSections: {
    whatIsIt:
      "Light is amazing! It travels incredibly fast and it moves in straight lines — like a flashlight beam that shoots straight across a dark room. Because light travels in straight lines, it cannot go around corners on its own. That is why you get a shadow when you stand in front of a light. Your body blocks the straight-moving light and leaves a dark area behind you. When light hits a smooth shiny surface like a mirror, it bounces back. This is called reflection. The light bounces off at the same angle it arrived, like a ball bouncing off a wall. When light moves from air into water or glass, something interesting happens — it bends! This is called refraction. It is why a straw in a glass of water looks broken or bent. Different materials bend light by different amounts. Objects also have colors because of light. A red apple looks red because it bounces red light toward your eyes and absorbs all the other colors. In this simulation, you can aim a beam of light at different angles, point it at a mirror, and send it through different materials to watch how it bends.",
    parameterExplanations: {
      lightAngle:
        "This slider changes the angle of the light beam as it comes from the light source, from 0 degrees (straight across) to 90 degrees (pointing straight down). Try different angles to see how the beam hits the mirror or enters the water at different spots. The angle you set affects where the reflected or refracted beam goes.",
      medium:
        "This control chooses what material the light travels through. Set it to 0 for air (light goes straight with no bending), 1 for water (light bends when it enters the water), or 2 for glass (light bends even more than in water). Watch closely at the boundary between air and water or glass to see the bending happen.",
      mirrorAngle:
        "This slider rotates the mirror from 0 to 90 degrees. Changing the mirror angle changes which direction the reflected light bounces. Try to aim the reflected beam at a target by adjusting both the light angle and the mirror angle together.",
      colorFilter:
        "This pro control changes the color of the light beam — white, red, blue, or green. White light contains all colors mixed together. When white light passes through a material, different colors bend by slightly different amounts. This is how a prism splits white light into a rainbow.",
    },
    misconceptions: [
      {
        wrong: "Light can bend around corners on its own.",
        correct:
          "In everyday life, light travels in straight lines and cannot bend around corners on its own. That is why a shadow forms — the light cannot curve around the object blocking it. You need a mirror or special curved surface to redirect light around a corner.",
      },
      {
        wrong: "When you look in a mirror, the image is behind the mirror.",
        correct:
          "The image in a mirror is not really behind it — it is a virtual image created by your brain tracing the reflected light rays backward. There is no actual object behind the mirror. Your brain sees light coming from a certain direction and assumes something must be there producing it.",
      },
      {
        wrong: "A red apple produces red light.",
        correct:
          "The apple does not produce any light on its own. White light from the sun or a lamp has all the colors mixed together. The red apple's skin absorbs most colors but reflects red light back toward your eyes. Your eye sees the red light and your brain says it is a red apple.",
      },
      {
        wrong: "Light slows down when it goes through a mirror.",
        correct:
          "A mirror reflects light — the light bounces off the surface rather than going through it. Light does slow down slightly when it enters glass or water, and that slowing is what causes it to bend (refraction). But at a mirror surface, light does not enter the material — it reflects off the shiny coating on the front.",
      },
    ],
    teacherUseCases: [
      "Set medium to 0 (air) and lightAngle to 45 degrees. Ask students to predict where the beam will go when you switch medium to 1 (water). Watch together to confirm or correct predictions.",
      "Set mirrorAngle to 45 degrees and lightAngle to 45 degrees to show a classic right-angle reflection. Have students sketch the incoming and outgoing beam and measure the angles with a protractor on their sketch.",
      "Compare medium 0 (air), 1 (water), and 2 (glass) at the same lightAngle. Have students rank which material bends light the most and least, explaining in their own words what they observe.",
      "Use the colorFilter (pro) set to white and then switch to red, blue, and green. Ask students if all colors bend the same amount when entering water. Connect to how a raindrop separates sunlight into a rainbow.",
      "Shadow discussion starter: cover the light source (light angle = 90) and ask students why a shadow forms. Connect back to the rule that light travels in straight lines and cannot go around solid objects.",
    ],
    faq: [
      {
        question: "Why does light travel in straight lines?",
        answer:
          "Light is a form of energy that moves as waves — very tiny waves that travel outward from a source. In a material with even density, like calm air, there is nothing to push or pull the light sideways, so it travels in a straight path. This is why a flashlight beam, a laser pointer, and a sunbeam all travel in straight lines unless they hit something.",
      },
      {
        question: "Why does a straw look bent in a glass of water?",
        answer:
          "When light travels from water back into air, it bends at the surface because water and air are different materials and light slows down in water. When you look at the straw, the light coming from the part underwater bends as it leaves the water and travels to your eye. Your brain traces the light back in a straight line and places the straw in the wrong spot, so the straw looks bent even though it is perfectly straight.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports 1-PS4-3 (plan and conduct an investigation to determine the effect of placing objects made with different materials in the path of a beam of light) and 4-PS4-2 (develop a model to describe that light reflecting from objects and entering the eye allows objects to be seen). Students observe reflection and refraction in an interactive environment.",
      },
      {
        question: "What makes something cast a shadow?",
        answer:
          "A shadow forms when an object blocks light that is traveling in a straight line. The light cannot bend around the object, so there is a dark area behind it where no light reaches. The shape of the shadow depends on the shape of the object and the angle of the light source. Early morning and late afternoon shadows are long because the sun is at a low angle.",
      },
      {
        question: "Why does a mirror flip your image left to right but not upside down?",
        answer:
          "A mirror does not actually flip left and right — it flips front and back. When you face a mirror, the reflection faces back toward you. What seems like a left-right flip is really your brain getting confused because you expect your mirror image to turn around like another person would. If you raise your right hand, the mirror image raises the hand on the opposite side of the mirror, which your brain reads as its left hand.",
      },
    ],
  },
};
