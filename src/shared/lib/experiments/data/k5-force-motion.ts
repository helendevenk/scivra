import type { Experiment } from "@/shared/types/experiment";

export const k5ForceMotion: Experiment = {
  id: "k5-force-motion",
  slug: "k5-force-motion",
  title: "Force & Motion",
  subtitle: "Push, pull, and how forces change movement",
  description:
    "Apply pushes and pulls to objects and watch them accelerate, slow down, and change direction. See balanced and unbalanced forces in action. Adjust friction to discover how surfaces and pushes work together to determine motion.",
  thumbnail: "/imgs/experiments/k5-force-motion.png",

  standards: {
    ngss: ["3-PS2-1", "3-PS2-2", "5-PS2-1"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "3-5",
  tags: ["force", "motion", "push", "pull", "friction", "elementary", "K-5"],
  difficulty: "beginner",

  parameters: [
    {
      id: "pushForce",
      label: "Push Force",
      unit: "N",
      min: 0,
      max: 50,
      default: 20,
      step: 1,
      tier: "free",
    },
    {
      id: "frictionPct",
      label: "Friction (×100)",
      unit: "",
      min: 0,
      max: 100,
      default: 20,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "F = ma \\quad (\\text{Newton's Second Law})",
      description: "Force equals mass times acceleration",
    },
    {
      latex: "f = \\mu N \\quad (\\text{friction force})",
      description: "Friction force = friction coefficient × normal force",
    },
  ],

  theory:
    "A force is a push or pull that can change an object's motion. Forces have both size (magnitude) and direction. When the forces on an object are balanced (equal in all directions), the object stays still or moves at constant speed. When forces are unbalanced, the object accelerates in the direction of the net force. Friction is a force that opposes motion between surfaces in contact. More mass requires more force to achieve the same acceleration (F=ma). Gravity pulls objects downward with a force equal to their weight (W=mg).",

  instructions:
    "Use the Push Force slider to choose how hard you push, and use the Friction (×100) slider to choose how sticky or slippery the surface feels. Try the Ice Surface, Rough Carpet, and Steep Incline presets. Watch what starts moving, what slows down, and when a bigger push is needed.",

  challenges: [
    {
      id: "fm-c1",
      question: "If you push a 2 kg box with 10 N and friction is 0, what is the acceleration?",
      hint: "F = ma → a = F/m = 10/2 = 5 m/s²",
      tier: "free",
    },
    {
      id: "fm-c2",
      question: "What happens to motion when push force equals friction force?",
      hint: "Net force = 0 → constant velocity (no acceleration). The forces are balanced!",
      tier: "free",
    },
    {
      id: "fm-c3",
      question: "A 5 kg object accelerates at 3 m/s². What net force is acting on it?",
      hint: "F = ma = 5 × 3 = 15 N",
      tier: "free",
    },
    {
      id: "fm-c4",
      question: "Why do heavier objects need more force to achieve the same acceleration?",
      hint: "From F=ma: F = m × a. If a is fixed, doubling m requires doubling F. Inertia — resistance to change in motion — increases with mass.",
      tier: "pro",
    },
  ],

  wave: 5,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-simple-machines", "k5-energy-conversion", "newtons-laws"],

  seoTitle: "Force and Motion for Kids | Scivra Elementary Science",
  seoKeywords: [
    "force and motion elementary",
    "push pull simulation",
    "Newton's second law kids",
    "friction interactive",
    "K-5 physics simulation",
    "forces for kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Force and Motion",
  },
  htmlControlAliases: {
    pushForce: "forceSlider",
    frictionPct: "muSlider",
  },
  presets: [
    {
      id: "ice",
      label: "🧊 Ice Surface (μ=0.05)",
      description: "A very slippery surface with little friction, so the object is easier to move and keeps sliding longer.",
      paramValues: { pushForce: 20, frictionPct: 5 },
    },
    {
      id: "carpet",
      label: "🟫 Rough Carpet (μ=0.60)",
      description: "A rough surface with lots of friction, so the object needs a stronger push and slows down faster.",
      paramValues: { pushForce: 25, frictionPct: 60 },
    },
    {
      id: "incline",
      label: "⛰️ Steep Incline",
      description: "A slanted setup that helps students compare how force and friction change the motion they observe.",
      paramValues: { pushForce: 30, frictionPct: 25 },
    },
  ],
  contentSections: {
    whatIsIt:
      "A force is a push or a pull. Every time you push a toy car across the floor, kick a ball, or pull a wagon, you are using a force! Forces can make things start moving, stop moving, speed up, or change direction. When you push harder, things speed up faster while the push acts. When two forces push against each other equally, nothing moves — the forces are balanced. Friction is a sneaky force that slows things down by rubbing surfaces together. A rough sidewalk has lots of friction; a slippery ice rink has almost none. Gravity is the force that pulls everything down toward the ground. It is why a ball you toss always comes back down. Heavier objects need a bigger push to get moving at the same speed as lighter ones. Scientists call this idea Newton's Second Law, but you can just think of it as: more push equals faster movement, and more mass means you need more push!",
    parameterExplanations: {
      pushForce:
        "Push Force controls how hard you push the object. A small number is like a gentle tap. A bigger number is like a strong shove. When the surface is slippery, even a smaller push can make the object move well. When the surface is rough, the same push may not be enough. Try setting Push Force to 0 first, then raise it little by little. Watch for the moment when the object starts moving faster. This helps you see that a force can change motion by starting, stopping, speeding up, or changing how something moves.",
      frictionPct:
        "Friction (×100) controls how much the surface rubs against the object. The number is written from 0 to 100, where 5 means very slippery like ice and 60 means rough like carpet. Low friction lets the object slide more easily. High friction pushes back more, so the object slows down or needs a bigger push to get moving. Try the Ice Surface preset, then try Rough Carpet without changing anything else. Compare what you notice. This slider helps you see why shoes grip the floor, why sleds slide on snow, and why rough surfaces can slow moving things down.",
    },
    misconceptions: [
      {
        wrong: "You need to keep pushing something to keep it moving.",
        correct:
          "A push changes motion. If there is almost no friction, an object can keep moving after the push. On a very slippery surface, it slides for a long time. On a rough surface, friction slows it down. Use the Ice Surface preset and then the Rough Carpet preset to compare. The push starts or speeds up the motion, while friction works against the motion.",
      },
      {
        wrong: "A rough surface always stops motion right away.",
        correct:
          "A rough surface makes more friction, but a strong enough push can still make an object move. Try Rough Carpet, then raise Push Force slowly. Students can look for the point where the push is strong enough to overcome the rubbing force. This shows that motion depends on how the forces work together.",
      },
      {
        wrong: "A bigger push always means the object goes at a constant fast speed.",
        correct:
          "A bigger push usually makes the object speed up while the push is stronger than the friction. Constant speed happens when the forces balance, not just when the push is big. Use the Push Force and Friction (×100) sliders to search for motion that looks steady instead of speeding up or slowing down.",
      },
      {
        wrong: "Friction is always bad and gets in the way.",
        correct:
          "Friction is actually really helpful! It is what lets you walk without slipping, lets car tires grip the road, and lets you pick up objects without them sliding out of your hands. Shoes with good grip use lots of friction. Ice skates and skis are designed to reduce friction so you can glide. Friction can be a friend or a challenge depending on what you need.",
      },
    ],
    teacherUseCases: [
      "Preset comparison: have students run Ice Surface, Rough Carpet, and Steep Incline. They record the Push Force and Friction (×100) values for each preset, then describe which setup moves most easily and cite evidence from the simulation.",
      "Balanced and unbalanced forces demo: keep Friction (×100) at 20, then change Push Force from 0 N to 10 N, 20 N, and 40 N. Students predict whether motion will stay the same or change, supporting NGSS 3-PS2-1.",
      "Surface investigation: set Push Force to 25 N and compare Friction (×100) values of 5, 25, and 60. Students connect the pattern to real surfaces such as ice, tile, grass, and carpet.",
      "Motion pattern table: students choose one preset, observe motion, then change only Push Force. They record what happens at three force values and use the pattern to predict a fourth result, supporting NGSS 3-PS2-2.",
      "K-PS2-1 push-and-pull talk: ask students to describe what they changed using simple words like stronger push, weaker push, slippery surface, and rough surface. Then connect those words to the Push Force slider, Friction (×100) slider, and the three presets.",
    ],
    faq: [
      {
        question: "Why does a rough surface make the object harder to move?",
        answer:
          "A rough surface has more friction. Friction is a rubbing force that pushes against motion. Imagine sliding a book across a smooth desk, then across a thick carpet. The carpet grabs the book more, so the book slows down faster and needs a stronger push. In this simulation, use Friction (×100) to change the surface. A low number acts more like ice. A high number acts more like carpet. Then use Push Force to test how much push is needed.",
      },
      {
        question: "What happens when there is very little friction?",
        answer:
          "With very little friction, the object slides more easily and keeps moving longer after it gets pushed. This is like a hockey puck on smooth ice. Real surfaces still have some friction, but ice has much less than rough carpet. Try the Ice Surface preset to see low friction. Then switch to Rough Carpet. Keep an eye on how far and how fast the object moves with the same kind of push.",
      },
      {
        question: "Which NGSS standards does this experiment connect to?",
        answer:
          "This simulation directly supports NGSS 3-PS2-1, where students investigate the effects of balanced and unbalanced forces on motion. It also supports 3-PS2-2, where students make observations and measurements of motion patterns to predict future motion. Younger learners can connect to K-PS2-1 by testing how different strengths of pushes and different surfaces change how an object moves.",
      },
      {
        question: "What do the Ice Surface, Rough Carpet, and Steep Incline buttons do?",
        answer:
          "The preset buttons jump to useful starting setups. Ice Surface sets low Friction (×100), so the object is easy to slide. Rough Carpet sets high Friction (×100), so the object is harder to move and slows faster. Steep Incline gives a setup for comparing motion on a slanted surface. Presets are helpful because everyone in the class can start from the same values before changing one slider at a time.",
      },
      {
        question: "What does balanced forces really mean?",
        answer:
          "Balanced forces means the pushes and pulls on an object cancel each other out, so the motion does not change. A still object stays still, and a moving object keeps moving at the same steady speed. In this simulation, try changing Push Force and Friction (×100) until the motion looks steady. If the object speeds up, one force is winning. If it slows down, friction is winning. If motion stays about the same, the forces are closer to balanced.",
      },
    ],
  },
};
