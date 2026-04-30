import type { Experiment } from "@/shared/types/experiment";

export const colorVision: Experiment = {
  id: "color-vision",
  slug: "color-vision-light-mixing",
  title: "Color Vision",
  subtitle: "Explore how eyes and the brain perceive color from light",
  description:
    "Mix red, green, and blue light to produce any visible color. Explore additive color mixing, how the eye's cone cells detect wavelengths, and why mixing all colors of light produces white.",
  thumbnail: "/imgs/experiments/geometric-optics-lenses.png",

  standards: {
    ngss: ["HS-PS4-3", "HS-PS4-5"],
    gcse: ["AQA P6.5"],
    ap: ["GO-3.A"],
  },
  primaryStandard: "ap-physics-2",
  category: "waves",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["color", "light", "RGB", "additive mixing", "wavelength", "cone cells", "perception"],
  difficulty: "beginner",

  parameters: [
    { id: "red", label: "Red Intensity", unit: "%", min: 0, max: 100, default: 50, step: 1, tier: "free" },
    { id: "green", label: "Green Intensity", unit: "%", min: 0, max: 100, default: 50, step: 1, tier: "free" },
    { id: "blue", label: "Blue Intensity", unit: "%", min: 0, max: 100, default: 50, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "c = f\\lambda", description: "Speed of light" },
    { latex: "\\lambda_{visible} \\approx 380\\text{–}700\\text{ nm}", description: "Visible spectrum range" },
  ],

  theory:
    "The human eye contains three types of cone cells sensitive to red (~700nm), green (~550nm), and blue (~440nm) wavelengths. Color perception arises from the relative stimulation of these three cone types. Additive color mixing (light sources) differs from subtractive mixing (pigments): combining red + green light gives yellow, while red + green pigments give brown.",
  instructions:
    "Use the RGB sliders to mix colored lights. Observe the resulting color in the center. Move the lights to see how overlapping regions combine. Use the spectrum view to see which wavelengths are present.",
  challenges: [
    { id: "cv-c1", question: "What color results from mixing red and blue light at equal intensity?", hint: "Red + Blue = Magenta in additive mixing", tier: "free" },
    { id: "cv-c2", question: "What combination produces white light?", hint: "Red + Green + Blue at equal intensities = white", tier: "free" },
    { id: "cv-c3", question: "Why does a red apple look red under white light but black under pure green light?", hint: "The apple reflects red wavelengths; green light has no red to reflect", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["bending-light", "em-spectrum", "geometric-optics-basics"],

  seoTitle: "Color Vision Simulation | RGB Light Mixing | Physics Lab",
  seoKeywords: ["color vision", "RGB light", "additive color mixing", "wavelength", "optics", "physics simulation"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Color Vision, Light Mixing, Additive Color" },

  contentSections: {
    whatIsIt:
      "When you look at a sunset, a red apple, or the screen you're reading right now, your eyes aren't directly measuring wavelengths. They're sampling the light with three types of cone cells, each sensitive to a different range of the spectrum, and your brain reconstructs color from the ratio of their responses. That's why a phone screen can fool you into seeing yellow without ever emitting a single yellow photon — it just lights up red and green pixels at the right ratio, and your red and green cones fire the same way they would for actual yellow light. The simulation lets you mix red, green, and blue light at any intensity and watch the resulting color appear, including the surprising fact that all three at full intensity make white. This is additive color mixing — the rule for light sources, projectors, and screens — and it works completely differently from subtractive mixing with paints, where adding more colors makes things darker.",
    parameterExplanations: {
      red: "Intensity of the red light source, expressed as a percentage of full power. Real-world red corresponds to wavelengths near 700 nm and primarily stimulates the L-cone (long-wavelength cone) in the retina. Set red alone to 100% to see pure red; combine with others to mix.",
      green: "Intensity of the green light source as a percentage. Around 550 nm, this is the wavelength the human eye is most sensitive to — which is why night-vision displays and emergency exit signs lean green. The M-cone (medium-wavelength) is most stimulated.",
      blue: "Intensity of the blue light source as a percentage. Around 440 nm, blue is the highest-energy color in the visible range and primarily stimulates the S-cone (short-wavelength). Blue cones are the least common in the retina, which is one reason fine blue detail is harder to see.",
    },
    misconceptions: [
      {
        wrong:
          "Color is a property of the object — apples are red, the sky is blue, full stop.",
        correct:
          "Color depends on three things together: what wavelengths the light source emits, what wavelengths the object reflects or absorbs, and what wavelengths your cones detect. A red apple under pure green light looks black, because there are no red wavelengths to reflect. Color is a transaction, not a label.",
      },
      {
        wrong:
          "A red LED and a red apple look red for the same reason.",
        correct:
          "Opposite mechanisms. The LED actively emits red wavelengths. The apple absorbs almost everything except red and reflects what's left. One is a source, the other is a filter — and that distinction is the entire reason additive mixing (light sources) and subtractive mixing (paints) follow different rules.",
      },
      {
        wrong:
          "Mixing red and green light gives brown, just like mixing red and green paint.",
        correct:
          "Red + green light gives yellow. Red + green pigments give a muddy brown, because each pigment subtracts from the white light hitting it and what's left after both subtract is dark and mixed. Light sources add wavelengths; pigments subtract them.",
      },
      {
        wrong:
          "Yellow light always means there are 580 nm photons in the beam.",
        correct:
          "Two completely different photon mixes can look identically yellow to a human eye — pure 580 nm light, or a mix of 700 nm (red) and 550 nm (green). Both stimulate the L and M cones in the same ratio, so your brain reports yellow either way. This is called metamerism and it's the entire trick behind RGB displays.",
      },
      {
        wrong:
          "Animals see the same colors humans do.",
        correct:
          "Many animals don't have three cone types. Dogs have two, so they see a reduced color palette similar to red-green colorblind humans. Bees have three but one is in the ultraviolet, so they see flower patterns invisible to us. The mantis shrimp has sixteen photoreceptor types. Color depends on the receiver as much as the light.",
      },
    ],
    teacherUseCases: [
      "RGB primary discovery: have students predict what red+green, red+blue, and green+blue will produce before they touch the sliders. Most expect brown, purple, and teal — the actual results (yellow, magenta, cyan) are a productive surprise that motivates additive vs subtractive mixing.",
      "Cone-cell mapping: after the white-light reveal, ask students to explain why three primary intensities are enough to produce every color a human can see. Connect this to the three cone types and the response curves.",
      "Metamer challenge: tell students 'find at least two different RGB settings that look like the same yellow.' This is concretely possible (e.g., R=80 G=80 B=0 vs R=100 G=70 B=10) and lets them feel metamerism with their own eyes.",
      "Real-world tie-in — phone screens and color blindness: pull up a magnifying app and look at the actual RGB subpixels of a phone screen, then discuss why a person with red-green colorblindness sees a different color from the same RGB setting.",
      "Stage-light prediction lab: assign each pair a 'stage' with three colored spotlights (RGB) and ask them to predict the color in regions where two or three lights overlap. Run the sim to confirm. Connects classroom physics to theatre lighting and concert design.",
    ],
    faq: [
      {
        question: "Why does mixing all three primary lights make white instead of black?",
        answer:
          "White is what your brain reports when all three cone types fire at roughly equal levels. Sunlight contains all visible wavelengths, which stimulates all three cones evenly — that's why we call it white. Hitting your eyes with full red + full green + full blue light produces the same balanced cone response, so your brain calls it white too, even though the actual photon mix is very different from sunlight.",
      },
      {
        question: "How is RGB different from the CMYK colors used in printing?",
        answer:
          "RGB is additive — used wherever you start with darkness and add colored light (screens, projectors, stage lights). CMYK is subtractive — used wherever you start with white paper and remove wavelengths with ink (printers, paint). The two systems use different primaries because the math runs in opposite directions: adding all RGB primaries makes white, while adding all CMYK colors makes (nearly) black.",
      },
      {
        question: "Why do some colors like brown or pink not appear on the visible spectrum?",
        answer:
          "Brown is just dim, low-saturation orange — it doesn't have its own wavelength because it's defined by context (a darker color near a brighter one). Pink is a mix of red and white that the eye perceives as a distinct color but no single wavelength produces. Lots of perceived colors are mixtures or context-dependent rather than spectral.",
      },
      {
        question: "What's the connection between this and AP Physics 2 standard GO-3.A?",
        answer:
          "GO-3.A asks students to connect light's wavelength and frequency to its perceived color and to explain how additive color mixing arises from the three-cone structure of the human eye. Sliding the RGB intensities and watching the result is the most direct way to see that connection.",
      },
      {
        question: "Why does the same shirt look different colors under fluorescent vs sunlight vs LED?",
        answer:
          "Different light sources emit different mixes of wavelengths. Sunlight is broadband; fluorescent lamps spike at a few narrow wavelengths; LEDs depend on the phosphor mix. The shirt's pigments only reflect wavelengths that are present in the incoming light, so a shirt that looks vivid red in sunlight can look dull or even brownish under a fluorescent that has very little red in its spectrum. This is why retail stores obsess over their lighting.",
      },
    ],
  },
};
