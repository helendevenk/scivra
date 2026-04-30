import type { Experiment } from "@/shared/types/experiment";

export const hookesLaw: Experiment = {
  id: "hookes-law",
  slug: "hookes-law-spring-force",
  title: "Hooke's Law",
  subtitle: "Discover the relationship between spring force and extension",
  description:
    "Hang masses on springs and measure extension. Verify Hooke's Law (F = kx), measure spring constants, and explore elastic potential energy stored in a stretched spring.",
  thumbnail: "/imgs/experiments/simple-harmonic-motion.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P5.8"],
    ap: ["3.B.3", "5.B.3"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["Hooke's law", "spring constant", "elastic", "extension", "spring force", "elastic potential energy"],
  difficulty: "beginner",

  parameters: [
    { id: "spring_constant", label: "Spring Constant", unit: "N/m", min: 1, max: 200, default: 50, step: 1, tier: "free" },
    { id: "mass", label: "Hanging Mass", unit: "kg", min: 0, max: 5, default: 0.5, step: 0.1, tier: "free" },
    { id: "num_springs", label: "Springs in Series/Parallel", unit: "", min: 1, max: 3, default: 1, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "F = kx", description: "Hooke's Law" },
    { latex: "E_{elastic} = \\frac{1}{2}kx^2", description: "Elastic potential energy" },
    { latex: "k_{series} = \\frac{k_1 k_2}{k_1 + k_2}", description: "Springs in series" },
  ],

  theory:
    "Hooke's Law states that the restoring force of a spring is proportional to its extension (F = kx), where k is the spring constant in N/m. This applies only within the elastic limit — beyond it the spring deforms permanently. Elastic potential energy stored is ½kx². Springs in series have lower effective k (more stretchy); springs in parallel have higher effective k (stiffer).",
  instructions:
    "Drag masses onto the spring hook. The spring stretches; measure extension with the ruler. Plot force vs. extension to find the spring constant from the slope. Add masses beyond the elastic limit to observe deformation.",
  challenges: [
    { id: "hl-c1", question: "A 0.5kg mass stretches a spring by 5cm. What is the spring constant?", hint: "F = mg = 0.5×9.8 = 4.9N; k = F/x = 4.9/0.05 = 98 N/m", tier: "free" },
    { id: "hl-c2", question: "How much elastic PE is stored when a spring (k=50 N/m) is stretched 10cm?", hint: "E = ½kx² = ½ × 50 × (0.1)² = 0.25 J", tier: "free" },
    { id: "hl-c3", question: "Two identical springs (k=100 N/m) in series: what is the effective k?", hint: "k_series = k/2 = 50 N/m", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["masses-springs", "masses-springs-basics", "simple-harmonic-motion"],

  seoTitle: "Hooke's Law Simulation — Spring Constant | AP Physics 1",
  seoKeywords: ["Hooke's law", "spring constant", "elastic force", "spring extension", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Hooke's Law, Spring Constant, Elastic PE" },

  contentSections: {
    whatIsIt:
      "Hang a 0.5 kg mass on a fresh spring. The spring stretches a few centimeters and stops. Add another mass and it stretches twice as far. Add a third — exactly three times the original extension. That linear march of extension with applied force is Hooke's Law, F = kx, and the constant k is everything you need to know about the spring's stiffness. The same law lurks behind a car's suspension, the recoil mechanism in a click pen, the strings of a guitar (almost), and every undergraduate problem involving simple harmonic motion. This lab lets you load springs of different stiffnesses with different masses, optionally combining them in series or parallel, while a ruler reads off the extension and an energy display tracks the elastic PE = ½kx² stored in the deformation.",
    parameterExplanations: {
      spring_constant:
        "The spring's stiffness k, in newtons per meter. A higher k means a stiffer spring — it resists stretching, so the same hanging mass produces less extension. Doubling k halves the extension for the same load, and quadruples the elastic PE for the same extension since E = ½kx².",
      mass:
        "The hanging mass in kilograms. The downward force applied to the spring is F = mg, so doubling the mass doubles the force and doubles the extension (within the elastic limit). At equilibrium the spring force kx exactly balances mg, giving x = mg/k.",
      num_springs:
        "How many identical springs are combined. Springs in series stack their extensions, halving the effective stiffness for two springs (k_eff = k/2). Springs in parallel share the load, doubling the effective stiffness (k_eff = 2k). This parameter lets you experimentally verify both combination rules.",
    },
    misconceptions: [
      {
        wrong:
          "A spring stretched twice as far stores twice the energy.",
        correct:
          "It stores four times the energy. Elastic PE goes as the square of extension: E = ½kx². Doubling x quadruples E. This is why a slingshot pulled all the way back is way more powerful than one pulled halfway, even though the force only doubles — the energy doesn't.",
      },
      {
        wrong:
          "When the spring is stretched to its maximum, the mass on the end is moving fastest.",
        correct:
          "It's the opposite. At maximum stretch the mass is momentarily at rest — that's a turning point. Kinetic energy is zero there because all the energy is stored as elastic PE. Maximum speed happens at the equilibrium position, where the spring is at its natural length and stored PE is minimum.",
      },
      {
        wrong:
          "Hooke's Law works for any spring no matter how much you stretch it.",
        correct:
          "Hooke's Law only holds within the elastic limit — the linear region. Stretch a spring far enough and it permanently deforms (plastic deformation), or its restoring force grows nonlinearly. Real springs have a clear F-x graph: linear at first, then a curve, then plastic. Stay in the straight part and F = kx is reliable.",
      },
      {
        wrong:
          "Two springs in series are stiffer than one because there's more spring metal.",
        correct:
          "Series springs are softer, not stiffer. Each spring takes the same force but each adds its own extension, so the total extension doubles for the same force, halving the effective k. To get a stiffer combination, put springs in parallel — they share the load, so each stretches less, doubling the effective k.",
      },
      {
        wrong:
          "Spring constant k is a material property like density.",
        correct:
          "k depends on the material AND the geometry (wire thickness, coil diameter, number of coils, spring length). Cut a spring in half and you double its k; coil it tighter and k grows. Two springs made of identical metal can have wildly different k values. The correct material-only constant for elastic behavior is Young's modulus.",
      },
    ],
    teacherUseCases: [
      "Linear-fit lab: have students hang five different masses on the same spring and record the extension each time. Plot F = mg on the y-axis vs. x on the x-axis. The slope is k. The fit being a straight line through the origin is itself the verification that Hooke's Law holds.",
      "Energy-conservation extension: lift a hanging mass to compress the spring, release it, and ask students to predict the mass's maximum speed using ½kx² = ½mv². Run the simulation and compare. Forces students to integrate Hooke's Law with energy conservation.",
      "Series vs. parallel discovery: ask students to predict whether two identical springs in series will be stiffer or softer than one alone. Run both configurations, measure k_eff, and have students reconcile the result with their prediction. Most expect 'more spring = stiffer' and need to be talked through why series is softer.",
      "Misconception probe — the turning point: pause the simulation when the mass is at maximum stretch and ask 'where is the kinetic energy maximum?' A surprising number of students answer 'here.' Use that to draw out the inverted relationship between PE and KE in oscillating systems.",
      "Real-world transfer: assign each group an everyday spring (mattress, click pen, car suspension, archery bow) and have them estimate its k by qualitative reasoning (how much force to compress it a known distance). Discuss why the engineering values vary by orders of magnitude.",
    ],
    faq: [
      {
        question: "What is the spring constant and how do you measure it?",
        answer:
          "The spring constant k is the stiffness coefficient in Hooke's Law: F = kx. It tells you how much force is needed to stretch or compress the spring by one meter. To measure it, hang known masses on the spring, record the extension for each, plot force (F = mg) versus extension (x), and read off the slope. The straight-line fit confirms you're inside the elastic limit; the slope's units come out as newtons per meter.",
      },
      {
        question: "Why is the elastic potential energy ½kx² instead of just kx²?",
        answer:
          "Because the spring force grows linearly with extension. To stretch the spring from 0 to x, you don't apply a constant force kx the whole time — at the start the force is 0, and at the end it's kx. The average force during the stretch is ½kx, and energy equals average force times distance, giving (½kx)(x) = ½kx². The factor of one-half is a direct consequence of the force being proportional to position rather than constant.",
      },
      {
        question: "What happens if I stretch the spring beyond its elastic limit?",
        answer:
          "It permanently deforms. Inside the elastic limit, the spring fully returns to its natural length when the load is removed and Hooke's Law holds. Past that point you enter the plastic region: the metal yields, internal bonds rearrange, and even after you remove the load the spring is longer than it started. The F-x graph stops being a straight line and bends. Eventually, with enough force, the spring breaks. Real-world spring designs include a generous safety margin to keep operations well inside the elastic region.",
      },
      {
        question: "Why are two identical springs in parallel stiffer than one alone?",
        answer:
          "When springs are in parallel, they share the load: each one carries half the weight of the hanging mass. Since each spring only feels half the force, each stretches half as much. The total extension is half what a single spring would give for the same total load, so the combination behaves like a single spring with twice the stiffness. The math is k_eff = k_1 + k_2 for parallel and 1/k_eff = 1/k_1 + 1/k_2 for series.",
      },
      {
        question: "How does Hooke's Law connect to simple harmonic motion?",
        answer:
          "A mass on a spring obeys F = -kx, where the negative sign indicates the force always points toward equilibrium. Newton's second law gives ma = -kx, which is the differential equation for simple harmonic motion. Its solution is sinusoidal oscillation with angular frequency ω = √(k/m) and period T = 2π√(m/k). Hooke's Law is the linear restoring force that makes SHM possible — anywhere that law shows up, sinusoidal oscillation is right behind it.",
      },
      {
        question: "How does this lab map to AP Physics 1 standard 3.B.3?",
        answer:
          "AP Physics 1 standard 3.B.3 expects students to analyze the restoring force of a spring quantitatively, predict extension from applied force, and connect Hooke's Law to elastic potential energy. This lab gives you the cleanest experimental setup for those goals: you hang masses, read extensions, derive k, and verify ½kx² for the stored energy. NGSS HS-PS2-1 is also addressed because Hooke's Law is one of the simplest cases of Newton's second law applied to a position-dependent force.",
      },
    ],
  },
};
