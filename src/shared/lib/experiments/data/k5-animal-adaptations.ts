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
      id: "habitatType",
      label: "Habitat Type (0=Forest, 1=Desert, 2=Arctic, 3=Ocean)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "predatorPresence",
      label: "Predator Nearby",
      unit: "%",
      min: 0,
      max: 100,
      default: 50,
      step: 10,
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
    "Select a Habitat Type to explore different environments: forest, desert, arctic, or ocean. Watch how animals in each habitat use camouflage to blend in. Increase Predator Presence to see which animals survive best with their adaptations. Compare how the same type of adaptation works differently across habitats.",

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
  contentSections: {
    whatIsIt:
      "Animals have special features that help them stay alive. These features are called adaptations. Some adaptations are body parts — like a polar bear's thick white fur that keeps it warm in the snow, or a duck's flat feet that help it swim. Other adaptations are things an animal does — like a bird flying south in winter to find food. Camouflage is when an animal's color or pattern matches its home. A green frog sitting on a green leaf is hard to spot! Mimicry is a different trick. A harmless animal looks like a dangerous one to scare enemies away. The king snake has stripes that look like the venomous coral snake, so predators leave it alone. In this simulation, you can pick different habitats — forest, desert, arctic, or ocean — and see which animals blend in best. You can also raise the chance that a predator is nearby to see how camouflage helps an animal survive.",
    parameterExplanations: {
      habitatType:
        "This control changes the habitat shown in the simulation. Choose 0 for Forest (lots of green trees), 1 for Desert (sandy and hot), 2 for Arctic (icy and white), or 3 for Ocean (blue water). Each habitat has different-looking animals that are adapted to blend in there.",
      predatorPresence:
        "This slider sets how likely it is that a predator is nearby, from 0% (no danger) to 100% (always danger). When a predator is nearby, watch which animals survive by hiding and which ones get spotted. Animals with good camouflage for that habitat do much better.",
    },
    misconceptions: [
      {
        wrong: "Animals choose to change color whenever they want.",
        correct:
          "Most animals cannot choose to change color. Their color is part of how they were born. Only a few animals, like chameleons and octopuses, can actually change color. Most animals are simply born with colors and patterns that match their habitat.",
      },
      {
        wrong: "Adaptations happen in one animal's lifetime because it wants to survive.",
        correct:
          "Adaptations happen very slowly over many, many generations — not in one lifetime. Animals do not decide to change. Animals that happen to be born with helpful features survive longer and have more babies, so those helpful features get passed on over time.",
      },
      {
        wrong: "Camouflage and mimicry are the same thing.",
        correct:
          "Camouflage means blending into the background so you are hard to see — like a stick insect that looks just like a twig. Mimicry means looking like a different, often dangerous, animal — like a harmless hoverfly that has yellow and black stripes like a wasp. Camouflage hides you; mimicry sends a warning.",
      },
      {
        wrong: "All animals in the same habitat look alike.",
        correct:
          "Animals in the same habitat can look very different from each other. A forest has green caterpillars, brown tree bark beetles, and striped chipmunks. Each animal is adapted in its own way to survive in that shared environment.",
      },
    ],
    teacherUseCases: [
      "Set habitatType to 2 (Arctic) and predatorPresence to 80%, then ask students why the polar bear is hard to spot while a brightly colored tropical frog would be easy to find.",
      "Compare habitatType 0 (Forest) vs. habitatType 1 (Desert) at predatorPresence 70%. Have students sketch which colors help animals hide in each place and explain why.",
      "Start with predatorPresence at 0%, then slowly raise it to 100%. Students record which animals get spotted first and discuss what adaptation each survivor uses.",
      "Ask students: if a forest animal was moved to the desert (habitatType changed from 0 to 1), would its camouflage still work? Test with predatorPresence at 90%.",
      "Use the mimicry examples in the description to have students draw their own mimicry pair and explain which animal is dangerous and which is the copy-cat.",
    ],
    faq: [
      {
        question: "What is an adaptation?",
        answer:
          "An adaptation is a special body part or behavior that helps an animal survive in its home. A thick coat helps a polar bear stay warm. Big ears help a desert fox cool down. Long legs help a deer run from predators. Every living thing has adaptations that fit where it lives.",
      },
      {
        question: "Why do some animals look like the things around them?",
        answer:
          "Animals that blend in are harder for predators to find. If a predator cannot see you, it cannot eat you. So animals that match their surroundings tend to survive longer, have more babies, and pass that color or pattern to their young. Over a very long time, the whole group ends up well camouflaged. This is called natural selection.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports 3-LS4-2 (use evidence to explain that plants and animals have traits that help them survive in their habitat) and 3-LS4-3 (construct an argument that environments can support certain living things based on their traits). Students observe camouflage and mimicry as real examples of survival traits.",
      },
      {
        question: "Can any animal live in any habitat?",
        answer:
          "Usually not. A polar bear needs cold snowy land. A clownfish needs warm ocean water with sea anemones. Each animal is built for the conditions in its habitat — the temperature, the food available, and the hiding spots. Moving an animal to the wrong habitat is usually very hard for it because its adaptations do not match the new place.",
      },
      {
        question: "What happens if a habitat changes, like a forest getting cut down?",
        answer:
          "When a habitat changes or disappears, the animals that live there often struggle. Their camouflage may no longer work if the colors around them are different. Their food source may be gone. Some animals can move to a new area, but others cannot adapt fast enough and their numbers go down. This is why protecting habitats is so important for keeping animal species safe.",
      },
    ],
  },
};
