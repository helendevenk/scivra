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
};
