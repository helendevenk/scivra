import type { Experiment } from "@/shared/types/experiment";

export const geometricOpticsLenses: Experiment = {
  id: "geometric-optics-lenses",
  slug: "geometric-optics-lenses-mirrors-ray-tracing",
  title: "Geometric Optics — Lenses & Mirrors",
  subtitle: "Trace rays through lenses and discover image formation",
  description:
    "Use the thin lens equation to predict where images form. Adjust focal length and object distance to see real versus virtual images, and explore how magnification changes with object position.",
  thumbnail: "/imgs/experiments/geometric-optics-lenses.png",

  standards: {
    ngss: ["HS-PS4-1", "HS-PS4-5"],
    gcse: ["P7.1", "P7.2"],
    ap: ["WVS-2.A", "WVS-2.B", "WVS-2.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "waves",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["optics", "lens", "mirror", "ray tracing", "focal length", "magnification", "refraction"],
  difficulty: "beginner",

  parameters: [
    {
      id: "focal_length",
      label: "Focal Length",
      unit: "cm",
      min: -50,
      max: 50,
      default: 20,
      step: 1,
      tier: "free",
    },
    {
      id: "object_distance",
      label: "Object Distance",
      unit: "cm",
      min: 5,
      max: 100,
      default: 30,
      step: 1,
      tier: "free",
    },
    {
      id: "lens_type",
      label: "Lens Type (0=Convex, 1=Concave)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "pro",
    },
    {
      id: "object_height",
      label: "Object Height",
      unit: "cm",
      min: 1,
      max: 20,
      default: 5,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}",
      description: "Thin Lens Equation",
    },
    {
      latex: "m = -\\frac{v}{u}",
      description: "Magnification",
    },
    {
      latex: "v > 0 \\Rightarrow \\text{Real image},\\quad v < 0 \\Rightarrow \\text{Virtual image}",
      description: "Image type by sign of image distance",
    },
  ],

  theory:
    "Geometric optics models light as rays that travel in straight lines and bend at interfaces according to Snell's Law. A thin lens refracts parallel rays to converge at (convex) or diverge from (concave) the focal point. The thin lens equation 1/f = 1/v + 1/u relates the focal length, image distance, and object distance, while the magnification m = -v/u describes image size and orientation.",
  instructions:
    "Set the focal length with the slider — positive values give a convex lens, negative values a concave lens. Move the object distance slider and observe how the image position and magnification change in real time. Switch to Pro mode to change object height and toggle lens type explicitly.",

  challenges: [
    {
      id: "gol-c1",
      question: "An object is 30 cm from a convex lens with f = 20 cm. Where does the image form?",
      hint: "Apply 1/f = 1/v + 1/u with u = 30 and f = 20",
      tier: "free",
    },
    {
      id: "gol-c2",
      question: "Under what condition does a convex lens produce a virtual image?",
      hint: "Compare the object distance to the focal length",
      tier: "free",
    },
    {
      id: "gol-c3",
      question: "An object is placed at 2f from a convex lens. Calculate the magnification.",
      hint: "Find image distance first, then use m = -v/u",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["wave-interference", "em-spectrum", "simple-harmonic-motion"],

  seoTitle: "Geometric Optics Lenses & Mirrors — Interactive Ray Tracing | Scivra",
  seoKeywords: [
    "geometric optics",
    "thin lens equation",
    "ray tracing",
    "convex lens",
    "concave lens",
    "magnification",
    "physics simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Geometric Optics — Thin Lens Equation and Ray Tracing",
  },

  contentSections: {
    whatIsIt:
      "Geometric optics treats light as straight rays that bend at lens surfaces. It is the model behind every camera, eye, and telescope you have ever used, and it works as long as the wavelength of light is much smaller than the lenses and mirrors involved. The thin-lens equation, 1/f = 1/d_o + 1/d_i, links the focal length f, object distance d_o, and image distance d_i, and the magnification M = −d_i/d_o tells you whether the image is bigger, smaller, upright, or inverted. Converging lenses (positive f) bend parallel rays to a single point and form real, inverted images of distant objects, the way your eye and a camera both project the world onto a sensor. Diverging lenses (negative f) spread rays out and always form virtual, upright, smaller images, like the wide view through a peephole or a security mirror. Slide the object in this lab and watch the image flip, grow, and travel to and from infinity exactly as the equation predicts.",
    parameterExplanations: {
      focal_length:
        "How strongly the lens bends light. Smaller |f| means a more powerful lens. Sign matters: positive for converging, negative for diverging.",
      object_distance:
        "Distance from object to lens. The object's location relative to the focal point determines whether the image is real or virtual: beyond f means real, inside f means virtual.",
      lens_type:
        "Switches between converging (biconvex) and diverging (biconcave). Same equations, but f flips sign and the image behavior changes accordingly.",
      object_height:
        "Size of the object. Doesn't change image position — only the image size, scaled by the magnification factor M = −d_i/d_o.",
    },
    misconceptions: [
      {
        wrong:
          "If you cover half a lens, you'll get half the image.",
        correct:
          "Each point of the object sends rays through the entire lens. Covering half just dims the image (less light), it doesn't cut off half the picture. Counter-intuitive but easy to verify experimentally.",
      },
      {
        wrong:
          "A converging lens always makes a smaller image.",
        correct:
          "Depends on object distance. Beyond 2f: smaller and inverted. At 2f: same size. Between f and 2f: larger and inverted. Inside f: larger, upright, virtual (a magnifying glass).",
      },
      {
        wrong:
          "Real images are 'real' and virtual images are imaginary or fake.",
        correct:
          "Real images form where light rays actually converge — you can put a screen there. Virtual images form where rays appear to diverge from — your eye sees them through the lens but no light actually arrives at that location. Both are physically meaningful.",
      },
      {
        wrong:
          "Diverging lenses can never form a real image.",
        correct:
          "True for single diverging lenses with real objects. In a multi-lens system (binoculars, microscopes), a diverging lens can act on a virtual object (the image of a previous lens) and produce a real image. Be careful what counts as 'object'.",
      },
    ],
    teacherUseCases: [
      "Image table drill: complete a table of (d_o, d_i, M, real/virtual, upright/inverted) for d_o = 3f, 2f, 1.5f, 0.5f. Use the lab to verify each entry.",
      "Camera vs. eye: discuss how a camera lens forms a real, inverted image on the sensor — exactly what students see when d_o > f. Connect to the human retina.",
      "Magnifying glass discovery: place the object inside the focal length and ask why the image is larger, upright, and virtual (rays diverge after the lens).",
      "Sign convention practice: work a diverging-lens problem and emphasize f < 0. Have students predict the signs of d_i and M before computing.",
      "Two-lens combo homework: combine two lenses where the image of the first is the object of the second. Apply the thin-lens equation twice.",
    ],
    faq: [
      {
        question: "What is the thin-lens equation?",
        answer:
          "1/f = 1/d_o + 1/d_i where f is focal length (positive for converging, negative for diverging), d_o is object distance, d_i is image distance (positive if on the outgoing side). Magnification is M = −d_i/d_o.",
      },
      {
        question: "Why is the image inverted in a camera?",
        answer:
          "Rays from the top of the object cross the optical axis as they bend through the lens and end up at the bottom of the image. Same for left-right. The camera sensor (or your retina) captures the inverted image, and your brain or software flips it back upright.",
      },
      {
        question: "What's the difference between real and virtual images?",
        answer:
          "Real images form where rays physically converge — you can project them onto a screen. Virtual images form where rays appear to come from after passing through the lens, but no light actually reaches that point. A magnifying glass shows you a virtual image; a movie projector shows a real one.",
      },
      {
        question: "When does a converging lens make an upright image?",
        answer:
          "When the object is inside the focal length (d_o < f). The lens can't bend rays enough to converge them, so they exit diverging. Your eye traces them back to a virtual, upright, magnified image. That's the magnifying-glass mode.",
      },
      {
        question: "How does this connect to AP Physics 2?",
        answer:
          "AP Physics 2 expects students to apply the thin-lens equation, compute magnification, and reason about real vs. virtual images. They should also do ray-tracing diagrams (parallel ray, central ray, focal ray) for both lens types. This lab supports both the algebra and the geometry.",
      },
    ],
  },
};
