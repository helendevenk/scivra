import type { Experiment } from "@/shared/types/experiment";

export const geometricOpticsBasics: Experiment = {
  id: "geometric-optics-basics",
  slug: "geometric-optics-basics-lenses-mirrors",
  title: "Geometric Optics: Basics",
  subtitle: "Explore how lenses and mirrors form images",
  description:
    "Use ray tracing to understand how converging and diverging lenses and mirrors form images. Observe real vs. virtual images, magnification, and the thin lens equation.",
  thumbnail: "/imgs/experiments/geometric-optics-lenses.png",

  standards: {
    ngss: ["HS-PS4-5"],
    gcse: ["AQA P6.4", "AQA P6.5"],
    ap: ["GO-2.A", "GO-2.B", "GO-2.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "waves",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["geometric optics", "lens", "mirror", "ray tracing", "focal length", "image formation"],
  difficulty: "intermediate",

  parameters: [
    { id: "focal_length", label: "Focal Length", unit: "cm", min: -50, max: 50, default: 20, step: 1, tier: "free" },
    { id: "object_distance", label: "Object Distance", unit: "cm", min: 5, max: 100, default: 40, step: 1, tier: "free" },
    { id: "lens_type", label: "Lens/Mirror Type", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}", description: "Thin lens equation" },
    { latex: "m = -\\frac{d_i}{d_o}", description: "Magnification" },
    { latex: "P = \\frac{1}{f}", description: "Lens power (diopters)" },
  ],

  theory:
    "Converging (convex) lenses bend light rays toward the focal point. The thin lens equation relates object distance d_o, image distance d_i, and focal length f. When d_o > f, a real, inverted image forms; when d_o < f, a virtual, upright image appears (magnifying glass). Diverging (concave) lenses always form virtual, diminished, upright images. Mirrors follow the same mathematics with light traveling on one side.",
  instructions:
    "Drag the object (arrow) along the principal axis. Rays automatically trace through the lens. Toggle between converging/diverging lens and concave/convex mirror. Observe how image position and orientation change as object crosses the focal point.",
  challenges: [
    { id: "gob-c1", question: "An object is 30cm from a converging lens with f=10cm. Where is the image?", hint: "1/f = 1/d_o + 1/d_i → 1/d_i = 1/10 − 1/30 = 2/30 → d_i = 15cm", tier: "free" },
    { id: "gob-c2", question: "What is the magnification for the setup above?", hint: "m = −d_i/d_o = −15/30 = −0.5 (inverted, smaller)", tier: "free" },
    { id: "gob-c3", question: "Why does a magnifying glass work? (d_o < f)", hint: "When d_o < f, the lens equation gives d_i < 0: a virtual upright image appears on the same side", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["geometric-optics-lenses", "bending-light", "color-vision"],

  seoTitle: "Geometric Optics Basics — Lens and Mirror Simulation | AP Physics 2",
  seoKeywords: ["geometric optics", "lens", "mirror", "ray tracing", "focal length", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Geometric Optics, Lenses, Image Formation" },

  contentSections: {
    whatIsIt:
      "Every camera lens, every pair of eyeglasses, every microscope and telescope, and the lens inside your own eye all rely on the same handful of rules. A converging lens bends parallel rays toward a single focal point; a diverging lens spreads them apart as if they came from a focal point on the other side. A concave mirror collects light to a focus; a convex mirror (the kind on the passenger side of a car) spreads it out. The thin lens equation 1/f = 1/d_o + 1/d_i ties together where the object sits, where the image lands, and how the lens or mirror is shaped — and the magnification m = −d_i/d_o tells you how big and which way up that image will appear. The simulation lets you slide an object along the axis of a converging lens, a diverging lens, a concave mirror, or a convex mirror, watch the principal rays trace through automatically, and see in real time how the image flips between real and virtual as the object crosses the focal point.",
    parameterExplanations: {
      focal_length:
        "Distance from the lens or mirror to its focal point, in centimeters. Positive f means converging (convex lens or concave mirror); negative f means diverging (concave lens or convex mirror). A short f means strong bending — eyeglasses for severe nearsightedness use shorter focal lengths than reading glasses.",
      object_distance:
        "How far the object sits from the lens or mirror, in centimeters. The image's character flips at d_o = f. When d_o > f a converging lens makes a real, inverted image (the projector case); when d_o < f the same lens makes a virtual, upright, magnified image (the magnifying glass case).",
      lens_type:
        "Selects which optical element to simulate: 0 = converging lens, 1 = diverging lens, 2 = concave mirror, 3 = convex mirror. Lenses transmit light through both surfaces; mirrors reflect off one surface. The thin lens equation has the same form for both, with appropriate sign conventions.",
    },
    misconceptions: [
      {
        wrong:
          "A converging lens always makes the image bigger.",
        correct:
          "Only when the object sits between the lens and the focal point. If the object is farther than 2f, the lens makes a smaller (and inverted) image — that's how cameras and your eye work. At exactly d_o = 2f the image is the same size as the object.",
      },
      {
        wrong:
          "A virtual image isn't real, so you can't see it or photograph it.",
        correct:
          "Virtual images are absolutely visible — that's what you see when you look in a flat mirror or use a magnifying glass. They just can't be projected onto a screen because no actual light rays meet at the image point; rays only appear to diverge from there. Your eye (or a camera) refocuses those diverging rays just fine.",
      },
      {
        wrong:
          "Cutting a lens in half gives you half an image.",
        correct:
          "You still get the full image, just dimmer. Each point on the lens collects a complete cone of rays from each object point, so blocking part of the lens reduces brightness but not coverage. This is a great surprise to demo with a paper mask.",
      },
      {
        wrong:
          "If d_o equals f exactly, the image forms at infinity but is just very far away.",
        correct:
          "When d_o = f, the rays leave the lens parallel — they never converge to an image at all. The thin lens equation gives 1/d_i = 0, which means there is no image. This is exactly how a flashlight or lighthouse collimates a beam.",
      },
    ],
    teacherUseCases: [
      "Image transition lab: have students start with d_o > 2f and slowly walk the object inward, recording image distance and orientation at d_o = 2f, d_o = f + ε, d_o = f, and d_o < f. They should discover the four image regimes without being told.",
      "Magnifying glass investigation: lock the lens to converging f = 10 cm and ask students to find the range of object distances that give a magnified upright image. They should converge on d_o < f and explain why using the lens equation.",
      "Eye model: relate the simulation's converging lens to the lens of the eye and the screen-side ray meeting point to the retina. Then ask students to predict whether someone who is nearsighted needs a converging or diverging corrective lens, and verify by running the sim.",
      "Mirror vs lens comparison: have pairs run identical numerical setups (same f, same d_o) for a converging lens and a concave mirror. They should find identical d_i and magnification, and discuss why the math is the same even though the physics (refraction vs reflection) is different.",
      "Sign convention drill: assign three problems where the answer requires correctly handling a negative focal length, a negative image distance, or a negative magnification. Use the simulation to verify each answer and tie the sign back to a physical observation (real vs virtual, upright vs inverted).",
    ],
    faq: [
      {
        question: "What's the difference between a real image and a virtual image?",
        answer:
          "A real image forms where actual light rays physically converge — you can put a piece of paper there and see it lit up. A virtual image forms where rays only appear to come from after diverging through a lens or mirror; no light actually reaches that point, but your eye traces the rays back and reconstructs the image. Real images are inverted; virtual images from a single lens or mirror are upright.",
      },
      {
        question: "Why is the image upside down when I look through a converging lens at a faraway object?",
        answer:
          "When d_o > f, light rays from the top of the object cross over to the bottom of the image (and vice versa) on their way through the lens. Mathematically, the magnification m = −d_i/d_o is negative, where the minus sign encodes the flip. Your eye does the same flip — your retina sees an upside-down world and your brain rotates it.",
      },
      {
        question: "How do I know if a focal length should be positive or negative?",
        answer:
          "By convention, converging optics (convex lens, concave mirror) have positive f and diverging optics (concave lens, convex mirror) have negative f. The sign just tells you which side of the lens the focal point sits on. Plug in with the right sign and the thin lens equation will give you a correctly signed image distance — positive d_i means a real image on the far side, negative d_i means a virtual image on the same side as the object.",
      },
      {
        question: "What does the thin-lens approximation actually assume?",
        answer:
          "It assumes the lens is much thinner than the focal length, so we can ignore the distance light travels inside the glass, and that all rays stay close to the optical axis (paraxial rays). Real lenses break this near the edges, producing spherical aberration. AP Physics 2 problems live entirely inside the thin-lens approximation.",
      },
      {
        question: "How does this map to AP Physics 2 standards GO-2.A through GO-2.C?",
        answer:
          "GO-2.A covers ray diagrams for spherical mirrors and thin lenses. GO-2.B requires applying the thin lens / mirror equation to predict image distance, magnification, and orientation. GO-2.C addresses real vs virtual images and the sign conventions that distinguish them. Every challenge in this simulation maps to one of those three.",
      },
    ],
  },
};
