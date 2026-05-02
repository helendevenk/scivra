import type { Experiment } from "@/shared/types/experiment";

export const k5ForceMotion: Experiment = {
  id: "k5-force-motion",
  slug: "k5-force-motion",
  title: "Force & Motion",
  subtitle: "Push, pull, and how forces change movement",
  description:
    "Apply pushes and pulls to objects and watch them accelerate, slow down, and change direction. See balanced and unbalanced forces in action. Adjust friction and gravity to discover how forces work together to determine motion.",
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
      max: 20,
      default: 5,
      step: 1,
      tier: "free",
    },
    {
      id: "friction",
      label: "Surface Friction",
      unit: "",
      min: 0,
      max: 1,
      default: 0.3,
      step: 0.1,
      tier: "free",
    },
    {
      id: "objectMass",
      label: "Object Mass",
      unit: "kg",
      min: 1,
      max: 10,
      default: 2,
      step: 1,
      tier: "free",
    },
    {
      id: "gravity",
      label: "Gravity",
      unit: "m/s²",
      min: 1,
      max: 20,
      default: 9.8,
      step: 0.1,
      tier: "pro",
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
    "Use the Push Force slider to apply a horizontal force to the object. Watch the object accelerate. Increase friction to slow it down. Try changing the mass — a heavier object needs more force for the same acceleration. Can you find the force needed to keep the object moving at constant speed?",

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
  contentSections: {
    whatIsIt:
      "A force is a push or a pull. Every time you push a toy car across the floor, kick a ball, or pull a wagon, you are using a force! Forces can make things start moving, stop moving, speed up, or change direction. When you push harder, things move faster. When two forces push against each other equally, nothing moves — the forces are balanced. Friction is a sneaky force that slows things down by rubbing surfaces together. A rough sidewalk has lots of friction; a slippery ice rink has almost none. Gravity is the force that pulls everything down toward the ground. It is why a ball you toss always comes back down. Heavier objects need a bigger push to get moving at the same speed as lighter ones. Scientists call this idea Newton's Second Law, but you can just think of it as: more push equals faster movement, and more mass means you need more push!",
    parameterExplanations: {
      pushForce:
        "This slider controls how hard you are pushing the object. At 0 N there is no push at all, so nothing moves. At 20 N you are pushing very hard — like a strong grown-up. Try starting at 5 N and slowly moving it up to watch the object speed up. A bigger push force means the object speeds up faster.",
      friction:
        "Friction is a rubbing force between the object and the floor. At 0 the surface is perfectly slippery (like ice) and the object keeps sliding forever. At 1.0 the surface is very rough (like sandpaper) and slows the object down quickly. Try matching the push force to the friction to make the object roll at a steady speed — that is balanced forces!",
      objectMass:
        "Mass is how much stuff is in the object — think of it as how heavy it is. At 1 kg it is like a small book. At 10 kg it is like a heavy backpack full of rocks. A heavier object needs a much bigger push to move at the same speed. Try keeping the push the same and making the object heavier — watch how much slower it speeds up!",
      gravity:
        "Gravity is the invisible force that pulls things down. On Earth it is about 9.8 m/s². On the Moon it would be only about 1.6 m/s² — things fall much more slowly there! Higher gravity means more friction (the object gets pressed harder against the floor). This is a Pro setting so you can explore how other planets would feel.",
    },
    misconceptions: [
      {
        wrong: "You need to keep pushing something to keep it moving.",
        correct:
          "Once something is moving with no friction, it keeps going on its own! You only need a push to fight friction or to speed something up. In space, astronauts and spacecraft move for years without any engine because there is almost no friction. On Earth we need to keep pushing mainly because friction is always trying to slow us down.",
      },
      {
        wrong: "Heavier objects always fall faster than lighter ones.",
        correct:
          "Gravity pulls all objects downward at the same speed if there is no air in the way. A bowling ball and a feather dropped in a vacuum tube hit the bottom at the same time. On Earth, air slows down light, fluffy things like feathers more than heavy, dense things — but that is air resistance, not gravity.",
      },
      {
        wrong: "A bigger push always means the object goes at a constant fast speed.",
        correct:
          "A push makes the object speed up (accelerate), not just move fast. The moment you stop pushing, friction starts slowing it down. To move at a steady speed, your push has to exactly match the friction force — then the forces are balanced and the object rolls smoothly without speeding up or slowing down.",
      },
      {
        wrong: "Friction is always bad and gets in the way.",
        correct:
          "Friction is actually really helpful! It is what lets you walk without slipping, lets car tires grip the road, and lets you pick up objects without them sliding out of your hands. Shoes with good grip use lots of friction. Ice skates and skis are designed to reduce friction so you can glide. Friction can be a friend or a challenge depending on what you need.",
      },
    ],
    teacherUseCases: [
      "Balanced forces demo: set pushForce to 6 N and friction to 0.6 with objectMass 1 kg — ask students to predict whether the object moves, then observe steady motion. Discuss why the forces are balanced.",
      "More push, faster go: keep friction at 0.3 and objectMass at 2 kg, then sweep pushForce from 2 N to 10 N. Students record speed results in a simple table and notice the pattern — bigger push, speeds up faster.",
      "Heavy vs. light challenge: set pushForce to 10 N and friction to 0.2, then compare objectMass 1 kg vs. 10 kg. Ask 'which one wins the race?' to surface the misconception that heavier always means faster.",
      "Friction surface comparison: fix pushForce at 8 N and objectMass at 3 kg, then slide friction from 0 (ice) to 1.0 (rough). Students describe the surface using real-life words — 'this feels like…' — connecting NGSS 3-PS2-1.",
      "Moon vs. Earth (Pro): set gravity to 1.6 m/s² (Moon) with the same push. Ask students why the object behaves differently and relate to why astronauts bounce when they walk on the Moon.",
    ],
    faq: [
      {
        question: "Why does a heavy wagon need more of a push than a light toy car?",
        answer:
          "The wagon has more mass — more stuff packed inside it. It takes more force to change the motion of something with more mass. This is the big idea scientists call Newton's Second Law. Think of pushing a shopping cart when it is empty versus when it is full of groceries. The full cart is much harder to get rolling! The same push that zooms an empty cart barely moves a full one. In this simulation you can test this yourself by switching the object mass slider while keeping the push force the same.",
      },
      {
        question: "What happens when there is zero friction?",
        answer:
          "With no friction at all, even the tiniest push would make an object keep sliding forever — just like a hockey puck on a very smooth ice rink barely slows down. In real life, true zero friction does not exist, but ice and oiled surfaces get very close. Space is the closest thing to zero friction: spacecraft launched long ago are still traveling through the solar system with no engine running because nothing is there to slow them down. In the simulation, set friction to 0 and give even a small push to see this in action.",
      },
      {
        question: "Which NGSS standards does this experiment connect to?",
        answer:
          "This simulation directly supports NGSS 3-PS2-1 (plan and conduct investigations of the effects of balanced and unbalanced forces on motion) and 3-PS2-2 (make observations and measurements of an object's motion to provide evidence that a pattern can be used to predict future motion). It also connects to 5-PS2-1, which asks students to support an argument about the gravitational force Earth exerts on objects. The parameters in this simulation let students gather evidence for all three standards through hands-on digital investigation.",
      },
      {
        question: "Is gravity only on Earth?",
        answer:
          "Every object in the universe that has mass pulls on every other object — that is gravity! The Moon has gravity too, but it is about six times weaker than Earth's, which is why astronauts can jump so high there. Jupiter has much stronger gravity than Earth. Even you pull on the Earth a tiny, tiny bit — but the Earth is so huge that you cannot notice its pull on you moving it at all. The gravity slider in the Pro settings lets you explore what pushing an object would feel like on different worlds.",
      },
      {
        question: "What does balanced forces really mean?",
        answer:
          "Balanced forces means the pushes and pulls on an object cancel each other out perfectly so the net force is zero. When forces are balanced, a still object stays still and a moving object keeps moving at the same steady speed. A book sitting on a table has balanced forces — gravity pulls it down and the table pushes it up with equal force. In this simulation you can find the balanced point by matching push force to friction: when they are equal the object rolls at a constant speed without speeding up or slowing down.",
      },
    ],
  },
};
