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
      id: "angle",
      label: "Light Angle",
      unit: "°",
      min: 10,
      max: 80,
      default: 45,
      step: 1,
      tier: "free",
    },
    {
      id: "objectSize",
      label: "Object Size",
      unit: "×",
      min: 0.3,
      max: 3,
      default: 1.0,
      step: 0.1,
      tier: "free",
    },
    {
      id: "refractiveIndex",
      label: "Refractive Index",
      unit: "n",
      min: 1.1,
      max: 2.5,
      default: 1.5,
      step: 0.05,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\theta_i = \\theta_r \\quad (\\text{law of reflection})",
      description: "Angle of incidence = angle of reflection",
    },
    {
      latex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 \\quad (\\text{Snell's law})",
      description: "Snell's Law — light bends when entering a new material",
    },
  ],

  theory:
    "Light travels in straight lines called rays. When light hits a smooth surface (like a mirror), it bounces off — this is reflection. The angle at which light hits equals the angle at which it bounces: angle of incidence = angle of reflection. When light passes from one material to another (air to water, for example), it bends — this is refraction. Light bends toward the normal line when entering a denser material and away when leaving. This is why a straw looks bent in a glass of water. Objects appear a certain color because they reflect that color of light and absorb all others. Transparent objects let light through; opaque objects block it; translucent objects let some through.",

  instructions:
    "Use the Light Angle slider to aim the beam, the Object Size slider to make the blocker bigger or smaller, and the Refractive Index slider to change how strongly a clear material bends light. Try the Reflection, Rainbow (Prism), and Shadow presets to compare three common ways light behaves.",

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
  htmlControlAliases: { angle: "sl-ang", objectSize: "sl-size", refractiveIndex: "sl-n" },
  presets: [
    { id: "reflect", label: "Reflection", paramValues: { angle: 45, objectSize: 1, refractiveIndex: 1.5 } },
    { id: "rainbow", label: "Rainbow (Prism)", paramValues: { angle: 30, objectSize: 1, refractiveIndex: 1.5 } },
    { id: "shadow", label: "Shadow", paramValues: { angle: 60, objectSize: 2, refractiveIndex: 1.5 } },
  ],
  contentSections: {
    whatIsIt:
      "Light is amazing! It travels incredibly fast and it moves in straight lines — like a flashlight beam that shoots straight across a dark room. Because light travels in straight lines, it cannot go around corners on its own. That is why you get a shadow when you stand in front of a light. Your body blocks the straight-moving light and leaves a dark area behind you. When light hits a smooth shiny surface like a mirror, it bounces back. This is called reflection. The light bounces off at the same angle it arrived, like a ball bouncing off a wall. When light moves from air into water or glass, something interesting happens — it bends! This is called refraction. It is why a straw in a glass of water looks broken or bent. Different materials bend light by different amounts. Objects also have colors because of light. A red apple looks red because it bounces red light toward your eyes and absorbs all the other colors. In this simulation, you can aim a beam of light at different angles, point it at a mirror, and send it through different materials to watch how it bends.",
    parameterExplanations: {
      angle:
        "Light Angle changes the direction the beam travels before it reaches a surface or object. A small angle sends the beam on a lower path, while a larger angle sends it on a steeper path. This helps students see that light travels in straight lines until it hits something. When the beam reaches a shiny surface, it reflects in a new direction. When it reaches a clear material, it can bend. Try moving only this slider and watching where the bright line goes. This supports 1-PS4 ideas about testing what happens when light meets objects, and 4-PS4 ideas about using reflected light to see.",
      objectSize:
        "Object Size changes how large the blocking object appears in the path of the beam. A small object blocks only part of the light, so the dark area can be smaller. A larger object blocks more of the straight-moving light, so the shadow can grow. This is a simple way to test the idea that shadows form when light cannot pass through an opaque object. Students can use the Shadow preset, change only Object Size, and describe what they observe. That kind of careful observation connects to 1-PS4 because students investigate what different objects do to a beam of light.",
      refractiveIndex:
        "Refractive Index tells how strongly a clear material bends light. A value near 1 acts more like air, so the beam changes direction only a little. A higher value acts more like glass or a prism, so the beam bends more. Students do not need to calculate with this number in K5. They can treat it as a strength slider for bending light. Try the Rainbow (Prism) preset and then move Refractive Index up and down. This helps students build a model: light travels to the eye after bouncing, passing through, or bending at materials, which connects to 4-PS4.",
    },
    misconceptions: [
      {
        wrong: "Light can bend around corners on its own.",
        correct:
          "In everyday life, light travels in straight lines and cannot bend around corners on its own. That is why a shadow forms — the light cannot curve around the object blocking it. Use the Shadow preset, then change Object Size to see how a bigger blocker can make a bigger dark area.",
      },
      {
        wrong: "When you look in a mirror, the image is behind the mirror.",
        correct:
          "The image in a mirror is not really behind it — it is a virtual image created by your brain tracing the reflected light rays backward. There is no actual object behind the mirror. Use the Reflection preset and change Light Angle to see how the direction of incoming light changes the direction of reflected light.",
      },
      {
        wrong: "A red apple produces red light.",
        correct:
          "The apple does not produce any light on its own. White light from the sun or a lamp has all the colors mixed together. The red apple's skin absorbs most colors but reflects red light back toward your eyes. Your eye sees the red light and your brain says it is a red apple.",
      },
      {
        wrong: "Clear materials never change the path of light.",
        correct:
          "Some clear materials let light pass through but also bend its path. This bending is called refraction. Water, glass, and prisms can bend light by different amounts. Use the Rainbow (Prism) preset and move Refractive Index to see how stronger bending changes the beam.",
      },
    ],
    teacherUseCases: [
      "Use the Reflection preset and ask students to predict where the beam will go. Move the Light Angle slider, then have students sketch the incoming and reflected paths to support NGSS 4-PS4-2 modeling.",
      "Use the Shadow preset with Object Size set low, medium, and high. Have students record how the shadow changes and explain that light travels in straight lines until an object blocks it, connecting to NGSS 1-PS4-3.",
      "Use the Rainbow (Prism) preset and keep Light Angle the same while changing only Refractive Index. Ask students to describe how a clear material can change the beam's path.",
      "Run a three-preset compare activity: Reflection, Rainbow (Prism), and Shadow. Students name what the light does in each case: bounce, bend, or get blocked.",
      "Have students choose one preset, change one slider, and write a claim-evidence-reasoning sentence using the slider value as evidence while keeping the NGSS standards intact.",
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
          "This simulation supports 1-PS4-3 (plan and conduct an investigation to determine the effect of placing objects made with different materials in the path of a beam of light) and 4-PS4-2 (develop a model to describe that light reflecting from objects and entering the eye allows objects to be seen). Students observe reflection, refraction, and shadows using the Light Angle, Object Size, and Refractive Index sliders plus the three preset buttons.",
      },
      {
        question: "What makes something cast a shadow?",
        answer:
          "A shadow forms when an object blocks light that is traveling in a straight line. The light cannot bend around the object, so there is a dark area behind it where no light reaches. The shape of the shadow depends on the shape of the object and the angle of the light source. Use the Shadow preset, then change Object Size and Light Angle to compare different shadow shapes.",
      },
      {
        question: "Why does a mirror flip your image left to right but not upside down?",
        answer:
          "A mirror does not actually flip left and right — it flips front and back. When you face a mirror, the reflection faces back toward you. What seems like a left-right flip is really your brain getting confused because you expect your mirror image to turn around like another person would. If you raise your right hand, the mirror image raises the hand on the opposite side of the mirror, which your brain reads as its left hand.",
      },
    ],
  },
};
