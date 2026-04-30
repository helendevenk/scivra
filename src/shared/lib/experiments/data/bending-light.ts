import type { Experiment } from "@/shared/types/experiment";

export const bendingLight: Experiment = {
  id: "bending-light",
  slug: "bending-light-refraction",
  title: "Bending Light",
  subtitle: "Explore refraction, reflection, and Snell's Law",
  description:
    "Shoot a laser beam through different materials and watch it bend at interfaces. Measure angles to verify Snell's Law, observe total internal reflection, and explore how lenses and prisms work.",
  thumbnail: "/imgs/experiments/geometric-optics-lenses.png",

  standards: {
    ngss: ["HS-PS4-3"],
    gcse: ["AQA P6.3", "AQA P6.4"],
    ap: ["GO-1.A", "GO-1.B", "GO-1.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "waves",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["refraction", "Snell's law", "reflection", "total internal reflection", "index of refraction", "optics"],
  difficulty: "intermediate",

  parameters: [
    { id: "n1", label: "Index n₁ (top)", unit: "", min: 1.0, max: 2.5, default: 1.0, step: 0.01, tier: "free" },
    { id: "n2", label: "Index n₂ (bottom)", unit: "", min: 1.0, max: 2.5, default: 1.5, step: 0.01, tier: "free" },
    { id: "angle_incident", label: "Incident Angle", unit: "°", min: 0, max: 89, default: 30, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2", description: "Snell's Law" },
    { latex: "\\theta_c = \\arcsin\\left(\\frac{n_2}{n_1}\\right)", description: "Critical angle (TIR)" },
    { latex: "n = \\frac{c}{v}", description: "Index of refraction" },
  ],

  theory:
    "Light bends when it crosses a boundary between materials with different indices of refraction. Snell's Law quantifies this: n₁sinθ₁ = n₂sinθ₂. When light travels from a denser medium to a less dense medium at an angle greater than the critical angle, total internal reflection occurs — the basis for fiber optics. The speed of light in a medium is c/n.",
  instructions:
    "Adjust the incident angle and material indices. The refracted beam updates in real time. Find the critical angle by increasing the incident angle until the refracted beam disappears. Measure angles using the protractor tool.",
  challenges: [
    { id: "bl-c1", question: "Light goes from glass (n=1.5) to air (n=1.0) at 45°. What is the refraction angle?", hint: "Apply Snell's Law: 1.5×sin(45°) = 1.0×sin(θ₂)", tier: "free" },
    { id: "bl-c2", question: "Find the critical angle for glass (n=1.5) to air.", hint: "θ_c = arcsin(n₂/n₁) = arcsin(1/1.5)", tier: "free" },
    { id: "bl-c3", question: "Why does a diamond sparkle more than glass?", hint: "Compare their indices of refraction and critical angles", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["geometric-optics-lenses", "geometric-optics-basics", "color-vision"],

  seoTitle: "Bending Light — Refraction and Snell's Law Simulation | AP Physics 2",
  seoKeywords: ["refraction", "Snell's law", "total internal reflection", "optics simulation", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Refraction, Snell's Law, Total Internal Reflection" },

  contentSections: {
    whatIsIt:
      "Refraction is what makes a straw look broken in a glass of water, what makes a swimming pool seem shallower than it really is, and what lets eyeglasses bring blurry text into focus. When light crosses from one transparent material into another — air into water, water into glass — its speed changes, and that speed change forces the wavefront to tilt at the boundary. Snell's Law captures the geometry exactly: n₁ sinθ₁ = n₂ sinθ₂, where n is the index of refraction and θ is measured from the normal. The simulation lets you fire a beam at any angle into materials with any pair of indices, watch the refracted ray bend toward or away from the normal, push the angle past the critical angle to trigger total internal reflection, and recover Snell's Law from raw measurements. Total internal reflection is what keeps light bouncing inside fiber optic cables.",
    parameterExplanations: {
      n1: "Index of refraction of the top medium where the incoming beam starts. Air is ≈1.00, water is 1.33, typical glass is 1.5, and diamond is 2.42. The index n equals c divided by the speed of light v inside that material — bigger n means slower light.",
      n2: "Index of refraction of the bottom medium the beam enters. Whether the ray bends toward or away from the normal depends on whether n₂ is bigger or smaller than n₁. Going from low n to high n bends the beam toward the normal; going from high n to low n bends it away.",
      angle_incident: "Angle between the incoming ray and the normal line at the boundary, in degrees. At 0° the beam goes straight through with no bending. As you push toward 90° (grazing incidence) the refracted angle grows nonlinearly, and going from a denser to a less dense medium will eventually trigger total internal reflection at the critical angle.",
    },
    misconceptions: [
      {
        wrong:
          "Light bends because the boundary itself pushes or repels it, like a wall deflecting a ball.",
        correct:
          "There's no surface force kicking the ray sideways. Light's phase speed changes inside the denser medium because the electromagnetic wave interacts with bound charges in the material, and when one side of an obliquely incident wavefront enters first it slows before the rest, forcing the whole front to tilt. That tilt is what we see as bending — wave geometry, no shove from the boundary.",
      },
      {
        wrong:
          "The angle of refraction is always smaller than the angle of incidence.",
        correct:
          "Only when the beam goes from a less dense medium into a denser one (n₂ > n₁). Going the other way — glass into air, water into air — the refracted angle is bigger than the incident angle, and once it hits the critical angle the beam stops refracting altogether and totally reflects.",
      },
      {
        wrong:
          "Total internal reflection is just regular reflection that happens when the surface is shiny enough.",
        correct:
          "Total internal reflection is a wave-optics effect, not a coating effect. Above the critical angle Snell's Law has no transmitted-ray solution (sinθ₂ would exceed 1), so an ideal boundary reflects the energy back inside the denser medium while an evanescent field exists just beyond the surface. Real fibers still have small absorption and scattering losses, but the reflection can be efficient enough for signals to travel kilometers.",
      },
      {
        wrong:
          "All colors of light bend by the same amount when they refract.",
        correct:
          "The index of refraction depends slightly on wavelength (this is called dispersion), so red light bends a little less than blue light in the same glass. That tiny difference, accumulated through a prism, splits white light into a rainbow.",
      },
      {
        wrong:
          "Snell's Law only works for one specific kind of light, like lasers.",
        correct:
          "Snell's Law holds for any electromagnetic wave at a boundary between two transparent media — visible light, infrared, microwaves, even radio waves. The simulation uses a clean laser only because it is easy to draw a single ray.",
      },
    ],
    teacherUseCases: [
      "Snell's Law derivation: have students collect (θ₁, θ₂) pairs at five different incident angles for a fixed n₁ and n₂, then plot sinθ₁ vs sinθ₂ and read the slope. The slope should equal n₂/n₁ within rounding.",
      "Critical angle prediction: ask students to compute the critical angle for water→air, glass→air, and diamond→air before running the sim. Then have them find each critical angle experimentally by sweeping the incident angle until the refracted ray vanishes.",
      "Mystery material lab: lock the simulation to one unknown index and let students measure refraction angles to identify whether the material is water, ice, glass, or diamond. Connects index of refraction to material identification.",
      "Real-world hook — fiber optics: after students discover total internal reflection, show a 30-second clip of a fiber optic cable and ask them to explain why light stays trapped inside even when the cable is bent. This anchors a quantitative result in a recognizable technology.",
      "Misconception probe — the broken straw: at the end of class, show a photo of a straw in water and ask students to draw the actual ray path. Many will say the light bends inside the straw; the correct picture has light bending at the water-air surface as it leaves.",
    ],
    faq: [
      {
        question: "Why does light bend when it enters a different material?",
        answer:
          "Light slows down in denser materials because the electromagnetic field drives bound charges in the material, and that collective response lowers the wave's phase speed. When part of a wavefront enters the new material before the rest, that side slows first and the whole front pivots, which we see as bending. Snell's Law gives the exact geometry.",
      },
      {
        question: "What is the critical angle and how do I calculate it?",
        answer:
          "The critical angle is the incident angle (going from a denser medium into a less dense one) above which all the light reflects back instead of refracting through. It is given by θ_c = arcsin(n₂/n₁). For glass (n=1.5) to air (n=1), θ_c ≈ 41.8°; for water (n=1.33) to air, θ_c ≈ 48.6°; for diamond (n=2.42) to air, θ_c ≈ 24.4°, which is why diamonds sparkle so aggressively.",
      },
      {
        question: "Does refraction change the frequency or the wavelength of light?",
        answer:
          "Frequency stays the same — it is set by the source and cannot change at a passive boundary. Wavelength shrinks in the denser medium because λ = v/f and v drops. That's why color is set by frequency, not wavelength: a red laser stays red whether it is in air, water, or glass.",
      },
      {
        question: "How is this related to AP Physics 2 standards GO-1.A through GO-1.C?",
        answer:
          "GO-1.A asks students to relate the index of refraction to the speed of light in a medium. GO-1.B requires applying Snell's Law to predict ray paths at boundaries. GO-1.C covers total internal reflection and the critical angle. The simulation gives a controllable lab where each of these can be measured directly and the predictions can be verified.",
      },
      {
        question: "Why does a diamond sparkle more than a piece of glass?",
        answer:
          "Two reasons. First, diamond has a much higher index (2.42 vs ~1.5), so its critical angle is small (~24°) — light entering through a facet is very likely to hit the next facet above the critical angle and totally reflect, bouncing inside the stone before exiting. Second, diamond has strong dispersion, so the trapped light splits into colors before it escapes. Cut quality is engineered to maximize both effects.",
      },
    ],
  },
};
