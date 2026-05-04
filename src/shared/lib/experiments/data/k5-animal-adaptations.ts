import type { Experiment } from "@/shared/types/experiment";

export const k5AnimalAdaptations: Experiment = {
  id: "k5-animal-adaptations",
  slug: "k5-animal-adaptations",
  title: "Animal Adaptations",
  subtitle:
    "Discover how animals survive with camouflage, mimicry, and body structures",
  description:
    "Explore the amazing ways animals have adapted to survive in their environments. Place animals in different habitats and see how camouflage helps them hide from predators. Compare body structures like thick fur for cold climates and large ears for cooling in the desert. Learn how mimicry lets harmless animals copy the warning colors of dangerous ones to stay safe.",
  thumbnail: "/imgs/experiments/k5-animal-adaptations.png",

  standards: {
    ngss: ["3-LS4-2", "3-LS4-3"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "elementary-k5",
  category: "biology",
  subject: "biology",
  gradeLevel: "3-5",
  tags: [
    "animal adaptations",
    "camouflage",
    "mimicry",
    "habitats",
    "survival",
    "biology",
    "elementary",
    "K-5",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "sliderTemp",
      label: "Temperature",
      unit: "°C",
      min: -40,
      max: 45,
      default: -20,
      step: 1,
      tier: "free",
    },
    {
      id: "sliderHabitat",
      label: "Habitat (0=Arctic, 1=Desert, 2=Rainforest)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex:
        "\\text{Survival} = f(\\text{Camouflage}, \\text{Speed}, \\text{Body Structure})",
      description:
        "An animal's chance of survival depends on how well its adaptations match its environment",
    },
  ],

  theory:
    "Adaptations are special features or behaviors that help animals survive in their environment. There are three main types. Structural adaptations are physical body parts — like a polar bear's thick white fur that keeps it warm and hidden in snow, or a giraffe's long neck for reaching tall trees. Behavioral adaptations are actions animals take — like birds migrating south in winter to find food, or opossums playing dead to avoid predators. Camouflage is a special adaptation where an animal's color or pattern matches its surroundings, making it nearly invisible to predators. Mimicry is when a harmless animal looks like a dangerous one — for example, the harmless king snake has red, yellow, and black bands similar to the venomous coral snake, scaring away predators.",

  instructions:
    "Use the Temperature slider to make the scene colder or warmer. Use the Habitat slider to switch between Arctic, Desert, and Rainforest homes. Try the Arctic Fox, Camel Desert, and Toucan Rainforest presets, then change one slider at a time and watch how each animal's body parts, colors, and behaviors fit its home.",

  challenges: [
    {
      id: "aa-c1",
      question:
        "Give one example of camouflage and explain how it helps the animal survive.",
      hint: "A chameleon can change its skin color to match leaves and branches. When a predator is nearby, the chameleon blends into the background and becomes almost invisible. This means the predator walks right past without noticing, and the chameleon stays safe.",
      tier: "free",
    },
    {
      id: "aa-c2",
      question:
        "What is the difference between camouflage and mimicry? Give an example of each.",
      hint: "Camouflage is blending into the background (like a stick insect looking exactly like a twig). Mimicry is looking like a different, usually dangerous, animal (like a harmless hoverfly having yellow and black stripes like a wasp). Camouflage hides you; mimicry warns predators to stay away.",
      tier: "free",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["k5-plant-life-cycle", "natural-selection"],

  htmlPath: "/experiments/elementary/k5-animal-adaptations.html",

  seoTitle:
    "Animal Adaptations Simulation for Kids | Scivra Elementary Biology",
  seoKeywords: [
    "animal adaptations kids simulation",
    "camouflage mimicry interactive",
    "habitat survival elementary",
    "K-5 biology adaptations",
    "animal survival for kids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Elementary School",
    teaches: "Animal Adaptations, Camouflage, and Mimicry",
  },
  htmlControlAliases: { temperature: "sliderTemp", habitat: "sliderHabitat" },
  presets: [
    {
      id: "arctic",
      label: "Arctic Fox",
      description:
        "The Arctic Fox preset shows a cold, snowy home where thick fur, small ears, and pale color can help an animal stay warm and hard to see.",
      paramValues: { sliderTemp: -20, sliderHabitat: 0 },
    },
    {
      id: "camel",
      label: "Camel Desert",
      description:
        "The Camel Desert preset shows a hot, dry home where stored fat, long legs, and careful water use can help an animal survive.",
      paramValues: { sliderTemp: 35, sliderHabitat: 1 },
    },
    {
      id: "toucan",
      label: "Toucan Rainforest",
      description:
        "The Toucan Rainforest preset shows a warm, wet home where bright color, a large beak, and tree life can help an animal find food and stay safe.",
      paramValues: { sliderTemp: 25, sliderHabitat: 2 },
    },
  ],
  contentSections: {
    whatIsIt:
      "Animals have body parts, colors, and behaviors that help them live in their homes. An arctic fox has thick fur that helps it stay warm in snow. A camel can live in hot, dry places because its body helps it save water. A toucan has a large beak that helps it reach and eat fruit in the rainforest. Camouflage means an animal is hard to see because it matches the place around it. Mimicry means one animal looks like another animal that enemies may avoid. In this simulation, use the Temperature slider and Habitat slider to compare Arctic, Desert, and Rainforest homes. Try the three animal presets and ask: What helps this animal live here?",
    parameterExplanations: {
      sliderTemp:
        "Temperature tells how cold or warm the animal's home is. Very cold places can be snowy and icy, so animals may need thick fur, small ears, or a round body to help keep heat in. Hot places can be dry and sunny, so animals may need ways to stay cool and save water. Move the Temperature slider while keeping the same habitat. Watch what feels helpful in that place. A body part that helps in cold weather may not help in hot weather, and the other way around.",
      sliderHabitat:
        "Habitat means the place where an animal lives. In this simulation, 0 shows the Arctic, 1 shows the Desert, and 2 shows the Rainforest. Each home has different weather, colors, food, and hiding places. An arctic fox fits snowy land, a camel fits hot sand, and a toucan fits warm trees. Move the Habitat slider one step at a time and compare what changes around the animal. Then choose a preset and ask why that animal fits that home better than the other homes.",
    },
    misconceptions: [
      {
        wrong: "Animals choose to change color whenever they want.",
        correct:
          "Most animals cannot choose a new color whenever they want. Their color is part of how they are born. A white arctic fox can be hard to see in snow, but it did not pick that color like choosing a shirt. Some animals can change color a little, but most animals use the colors and patterns they already have.",
      },
      {
        wrong: "Adaptations happen in one animal's lifetime because it wants to survive.",
        correct:
          "An animal does not grow a brand-new body part just because it wants one. Helpful body parts and behaviors become common very slowly, over many generations. For example, animals born with features that help them live in a cold, hot, or wet home are more likely to grow up and have young with similar helpful features.",
      },
      {
        wrong: "Camouflage and mimicry are the same thing.",
        correct:
          "Camouflage means blending in with the place around you, like a pale animal in snow or a brown animal on sand. Mimicry means looking like another living thing that enemies may avoid. Camouflage helps an animal hide. Mimicry is more like a warning sign that says, Stay away.",
      },
      {
        wrong: "All animals in the same habitat look alike.",
        correct:
          "Animals in the same home can look very different. In a rainforest, one animal may be bright and live high in trees, while another may be brown and hide near the ground. In the desert, some animals have long legs, while others dig underground. Each animal has its own way to find food, stay safe, and handle the weather.",
      },
    ],
    teacherUseCases: [
      "Use the Arctic Fox preset and have students identify evidence that thick fur, small ears, and pale coloring support survival in a cold habitat, connecting observations to NGSS 3-LS4-2.",
      "Compare the Arctic Fox and Camel Desert presets, then ask students to argue which traits fit or fail in each selected environment for NGSS 3-LS4-3.",
      "Have students move only the Temperature slider and record which visible adaptations appear more useful as the scene changes from very cold to warm conditions.",
      "Use the Habitat slider to compare Arctic, Desert, and Rainforest settings; students sketch one matching animal feature for each habitat and cite visual evidence.",
      "Run a brief CER activity where students choose one preset, claim why that animal is suited to its habitat, cite two observed features, and explain how those features support survival.",
    ],
    faq: [
      {
        question: "What is an adaptation?",
        answer:
          "An adaptation is a body part or behavior that helps an animal live in its home. Thick fur can help an arctic fox stay warm. A camel's body helps it handle hot, dry days. A toucan's large beak helps it reach fruit in trees. Adaptations help animals find food, stay safe, and deal with the weather where they live.",
      },
      {
        question: "Why do some animals look like the things around them?",
        answer:
          "Some animals are hard to see because their colors match their home. A pale animal can be hard to spot in snow. A sandy-colored animal can be hard to spot in the desert. This hiding trick is called camouflage. It can help an animal stay safe or sneak up on food.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports 3-LS4-2 and 3-LS4-3. Students use what they see to explain how animal body parts, colors, and behaviors help them live in a certain home. They can also make a simple argument about why an arctic fox fits a cold place, a camel fits a desert, and a toucan fits a rainforest.",
      },
      {
        question: "Can any animal live in any habitat?",
        answer:
          "Usually not. Animals are built for certain homes. An arctic fox is suited for cold snow. A camel is suited for hot, dry land. A toucan is suited for warm, rainy trees. If an animal moves to a place that is too hot, too cold, too dry, or missing its food, it may have trouble living there.",
      },
      {
        question: "What happens if a habitat changes?",
        answer:
          "When a habitat changes, animals may lose food, shelter, or hiding places. Their colors may no longer match the area around them. Some animals can move and find a better place, but others cannot. This is why protecting animal homes matters. A safe home gives animals what they need to live and raise their young.",
      },
    ],
  },
};
