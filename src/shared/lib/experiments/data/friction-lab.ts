import type { Experiment } from "@/shared/types/experiment";

export const frictionLab: Experiment = {
  id: "friction-lab",
  slug: "friction-lab-static-kinetic",
  title: "Friction Lab",
  subtitle: "Measure static and kinetic friction coefficients",
  description:
    "Pull a block across different surfaces and measure the friction force. Determine static and kinetic friction coefficients experimentally and discover how normal force affects friction.",
  thumbnail: "/imgs/experiments/newton-laws.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P5.3"],
    ap: ["3.B.1", "3.B.2"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["friction", "static friction", "kinetic friction", "coefficient", "normal force", "experiment"],
  difficulty: "intermediate",

  parameters: [
    { id: "applied_force", label: "Applied Force", unit: "N", min: 0, max: 200, default: 50, step: 1, tier: "free" },
    { id: "mass", label: "Block Mass", unit: "kg", min: 0.5, max: 20, default: 5, step: 0.5, tier: "free" },
    { id: "surface_type", label: "Surface Material", unit: "", min: 0, max: 4, default: 0, step: 1, tier: "free" },
    { id: "extra_weight", label: "Added Weight", unit: "kg", min: 0, max: 20, default: 0, step: 0.5, tier: "pro" },
  ],

  formulas: [
    { latex: "F_{s,max} = \\mu_s N", description: "Maximum static friction" },
    { latex: "F_k = \\mu_k N", description: "Kinetic friction force" },
    { latex: "N = mg + W_{extra}", description: "Normal force" },
  ],

  theory:
    "Static friction prevents an object from moving when a force is applied up to a maximum threshold F_s,max = μ_s N. Once motion begins, kinetic friction F_k = μ_k N acts, typically with μ_k < μ_s. Both friction forces are proportional to the normal force N but independent of contact area. The coefficients μ_s and μ_k depend only on the materials in contact.",
  instructions:
    "Increase the applied force slowly. The block remains stationary while friction matches it (static region). When the applied force exceeds F_s,max the block starts sliding and friction drops to the kinetic value. Record the threshold force to calculate μ_s, and the sliding force to find μ_k.",
  challenges: [
    { id: "fr-c1", question: "A 5kg block on wood has μ_s = 0.5. What is the maximum static friction force?", hint: "F_s = μ_s × N = 0.5 × 5 × 9.8", tier: "free" },
    { id: "fr-c2", question: "Why does adding weight to the block change the friction force but not the coefficient?", hint: "F_friction = μN; more weight increases N, which increases F_friction; μ stays constant", tier: "free" },
    { id: "fr-c3", question: "Experimentally, why is μ_s > μ_k for most material pairs?", hint: "At rest, surface asperities interlock more deeply; motion reduces contact depth", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["forces-motion-basics", "newtons-laws", "forces-motion-basics"],

  seoTitle: "Friction Lab — Static and Kinetic Friction | AP Physics 1",
  seoKeywords: ["friction", "static friction", "kinetic friction", "coefficient of friction", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Friction, Static Friction, Kinetic Friction" },

  contentSections: {
    whatIsIt:
      "Push gently on a heavy textbook sitting on a desk. Nothing happens. Push a little harder. Still nothing. Push harder still and — suddenly — it slides, and now it's easier to keep moving than it was to start. Two different friction forces just took turns: static friction held the book still up to a maximum, then kinetic friction took over once it broke loose, slightly weaker than the static peak. That sticky-then-slippery story is at the heart of how shoes grip pavement, how cars stop, and why dragging furniture across carpet is harder at first than midway across the room. In this lab you pull a block across five surfaces, watch the friction force respond in real time, and pin down the static and kinetic coefficients by reading the moment the block breaks free.",
    parameterExplanations: {
      applied_force:
        "The horizontal pull on the block, in newtons. While it stays below the maximum static friction force, the block doesn't move and friction matches it perfectly. Cross the threshold and the block accelerates — that threshold is the data point you want.",
      mass:
        "The mass of the block in kilograms. Mass sets the normal force N = mg on a flat surface, and friction scales with N. Doubling the mass doubles both the maximum static and the kinetic friction force, but the coefficients μ_s and μ_k don't budge.",
      surface_type:
        "Selects the material pair in contact: ice, glass, wood, steel, or rubber, indexed 0 through 4. Each choice loads a different μ_s and μ_k, letting you compare a slick rubber-on-ice pairing against the high-grip rubber-on-asphalt extreme on a single block.",
      extra_weight:
        "Additional mass piled on top of the block, in kilograms. It increases the normal force without changing the bottom contact area — a clean way to test whether friction depends on weight (it does, linearly) or contact area (it doesn't, to first order).",
    },
    misconceptions: [
      {
        wrong:
          "Friction always acts to slow things down — it's basically a force that opposes motion in general.",
        correct:
          "Static friction can also push you forward. When you walk, your shoe pushes backward on the ground; the ground's static friction pushes forward on your shoe and propels you. Without friction, you'd be ice-skating in dress shoes — no walking, no driving, no climbing stairs.",
      },
      {
        wrong:
          "A wider block has more friction than a narrow one because more surface is in contact.",
        correct:
          "To first order, friction is independent of contact area. Spread the same weight over a bigger footprint and the pressure drops, but total friction force comes out the same: F = μN. The block's bottom shape barely matters; the materials and the normal force do almost all the work.",
      },
      {
        wrong:
          "Once the block is moving, the friction force keeps growing as you pull harder.",
        correct:
          "Kinetic friction is roughly constant for a given pair of surfaces and normal force: F_k = μ_k N. Pulling harder once the block is sliding doesn't change F_k — it just produces more net force and more acceleration, leaving the friction force itself fixed.",
      },
      {
        wrong:
          "If the block is not moving, friction must be zero because nothing is happening.",
        correct:
          "Static friction adjusts to whatever applied force you supply, up to its maximum. If you push with 10 N and the block doesn't move, friction is 10 N pointing the other way. It only saturates at μ_s N — that's the moment the block breaks free.",
      },
      {
        wrong:
          "A heavier block feels more friction, so it must slow down faster than a lighter block on the same surface.",
        correct:
          "Both claims fail. In free fall, all masses accelerate at g. In sliding, mass increases the friction force AND the inertia in equal proportion, so mg cancels out and the deceleration is just μ_k g — the same for any mass on the same surface.",
      },
    ],
    teacherUseCases: [
      "Threshold hunt: have student pairs ramp the applied force in 1 N steps until the block breaks free. Record that breakaway force across five different surface materials, then back out μ_s = F_break / (mg). Compile the class data into a table and compare to textbook values.",
      "Constant-coefficient probe: ask students to predict whether μ_k will change when extra weight is added. Run the test, plot F_k vs. N for at least four masses, and fit a line — the slope is μ_k, the y-intercept should be near zero.",
      "Walking misconception: before the lab, ask 'what force pushes you forward when you walk?' Most will say 'your muscles' or 'your legs.' Pause for the disagreement, then derive that the only contact force from the ground is friction. Use the simulation to show that without static friction, no walking is possible.",
      "Static vs. kinetic comparison: have students measure both coefficients on each surface and order them. The empirical rule μ_s > μ_k will show up in every pair. Discuss why slipping in a car (kinetic) gives less stopping force than gripping (static) — the basis for ABS braking.",
      "Engineering tie-in: assign each group a real-world scenario (rock climber's shoes, hockey skate, tire on wet road, brake pad on rotor). Have them choose a surface in the sim that approximates each pair, justify the choice with the coefficient values, and report the implications for design.",
    ],
    faq: [
      {
        question: "Why is the static coefficient usually larger than the kinetic one?",
        answer:
          "At rest, the microscopic asperities on each surface have time to settle into each other and form temporary bonds. To start sliding, you have to break all of them at once — that takes the larger μ_s force. Once moving, the surfaces don't sit still long enough to interlock as deeply, so the bonds reform less strongly and the resistance drops to μ_k. The gap is what makes a stuck box hard to start but easier to keep going.",
      },
      {
        question: "Does friction really not depend on the contact area?",
        answer:
          "For most everyday materials, no — the F = μN model assumes friction is set by the materials and the normal force, not the bottom shape. The intuition is that pressure (force per area) drops when you spread the load, while the number of microscopic contact points rises in proportion, and the two effects cancel. The model breaks down at extreme pressures, for very soft materials like rubber tires, and at high speeds, but for the AP Physics 1 level it is a solid approximation.",
      },
      {
        question: "What does the coefficient of friction actually represent physically?",
        answer:
          "It's a dimensionless ratio that captures how 'sticky' a pair of surfaces is. Specifically, μ = F_friction / N tells you what fraction of the normal force becomes resistive. Rubber on dry asphalt has μ_s near 1.0 (very grippy); steel on ice has μ_k around 0.03 (slick). Coefficients depend on the pair — there's no such thing as 'the friction of wood,' only 'wood on steel,' 'wood on cloth,' and so on.",
      },
      {
        question: "Why does the block accelerate the moment it starts sliding, even when I keep my pull constant?",
        answer:
          "Because the friction force drops abruptly from μ_s N to μ_k N at the moment of breakaway. If your applied force was just barely enough to overcome static friction, that same force is now noticeably larger than kinetic friction, leaving a net forward force and producing acceleration. This 'stick-slip' behavior is why a chair scoots rather than glides when you nudge it across hardwood.",
      },
      {
        question: "How does this lab align with AP Physics 1 standard 3.B.1?",
        answer:
          "AP Physics 1 standard 3.B.1 expects students to make and analyze free-body diagrams and apply Newton's second law to systems with friction. This lab gives you the experimental backbone for that: you set up the FBD on paper (gravity, normal, applied force, friction), measure the breakaway force and the sliding force, and compute coefficients. NGSS HS-PS2-1 is also addressed — using F = ma to predict motion when contact forces are involved.",
      },
      {
        question: "Why does adding weight on top change the friction force but not the coefficient?",
        answer:
          "The friction model says F_friction = μN. The coefficient μ is a property of the two materials in contact and doesn't care how hard they're being pressed together. Extra weight increases N (the surfaces are pushed together harder), and the friction force scales with N proportionally. Same materials, same μ, larger N, larger F. This is exactly the linearity you want to confirm by plotting F_friction vs. N and getting a straight line through the origin.",
      },
    ],
  },
};
