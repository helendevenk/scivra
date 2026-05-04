import type { Experiment } from "@/shared/types/experiment";

export const k5Habitats: Experiment = {
  id: "k5-habitats",
  slug: "k5-habitats",
  title: "Animal Habitats",
  subtitle: "Ecosystems, adaptations, and where animals live",
  description: "Explore different habitats — desert, ocean, forest, arctic, and grassland — and discover which animals live in each. Learn how animals are adapted to their environments. Try moving animals to the wrong habitat and see why they can't survive there!",
  thumbnail: "/imgs/experiments/k5-habitats.png",
  standards: { ngss: ["2-LS4-1", "3-LS4-3"], gcse: [], ap: [] },
  primaryStandard: "elementary-k5",
  category: "biology",
  subject: "biology",
  gradeLevel: "3-5",
  tags: ["habitats", "ecosystems", "animal adaptations", "desert", "ocean", "forest", "K-5 biology"],
  difficulty: "beginner",
  parameters: [
    { id: "temperature", label: "Temperature", unit: "°C", min: -40, max: 50, default: 25, step: 1, tier: "free" },
    { id: "rainfall", label: "Annual Rainfall", unit: "mm", min: 0, max: 4000, default: 1500, step: 1, tier: "free" },
  ],
  formulas: [],
  theory: "A habitat is the natural home of an animal or plant. Different habitats have different conditions: temperature, rainfall, sunlight, and available food. Animals have adaptations that help them survive in their habitat. Desert animals (camel, rattlesnake) conserve water and tolerate heat. Ocean animals (dolphin, clownfish) breathe underwater or hold breath for long periods. Forest animals (deer, owl) use camouflage among trees. Arctic animals (polar bear, penguin) have thick fur/feathers and fat layers for insulation. Grassland animals (zebra, lion) are adapted for open spaces. When habitats change (climate, human activity), animals must adapt, migrate, or face extinction.",
  instructions: "Use the Temperature and Rainfall sliders to change the climate. Try the Tropical Rainforest, Arctic Tundra, and Sahara Desert presets to compare how heat, cold, dryness, and lots of rain shape animal homes.",
  challenges: [
    { id: "kh-c1", question: "Why can't a polar bear survive in the desert?", hint: "Its thick fur and fat layer (insulation for -40°C) would cause overheating in desert heat. It also can't find seals to eat!", tier: "free" },
    { id: "kh-c2", question: "What adaptation helps a cactus survive in the desert?", hint: "Thick waxy skin to prevent water loss, spines instead of leaves (less surface area), and a large root system to absorb rare rainfall", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 10,
  relatedExperiments: ["k5-animal-adaptations"],
  htmlPath: "/experiments/elementary/k5-habitats.html",
  seoTitle: "Animal Habitats for Kids | Scivra K-5 Science",
  seoKeywords: ["animal habitats for kids", "ecosystem simulation", "habitat adaptations interactive", "K-5 biology"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Elementary School", teaches: "Animal Habitats" },
  htmlControlAliases: { temperature: "tempSlider", rainfall: "rainSlider" },
  presets: [
    { id: "rainforest", label: "🌴 Tropical Rainforest", description: "A warm, very rainy biome with tall plants, many insects, birds, and other animals that use trees for food and shelter.", paramValues: { temperature: 28, rainfall: 3000 } },
    { id: "tundra", label: "🧊 Arctic Tundra", description: "A very cold biome with little rain, frozen ground, low plants, and animals that need warm coats or other cold-weather adaptations.", paramValues: { temperature: -20, rainfall: 250 } },
    { id: "desert", label: "🏜️ Sahara Desert", description: "A hot, dry biome with very little rain, where plants and animals must save water and handle strong sunlight.", paramValues: { temperature: 38, rainfall: 50 } },
  ],
  contentSections: {
    whatIsIt:
      "A habitat is the place where an animal lives. It is like the animal's home neighborhood. A habitat gives an animal everything it needs: food, water, shelter, and the right temperature. Different animals need very different kinds of homes. A camel lives in the hot, dry desert and can go many days without water. A polar bear lives in the icy cold of the arctic and has thick blubber and fur to stay warm. An owl lives in the forest where tall trees give it places to nest and hunt. A dolphin lives in the ocean and can hold its breath for a long time. A zebra lives on the grassy open plains of the grassland. Each animal's body and behavior are shaped to fit its habitat. In this simulation you can explore five different habitats — desert, ocean, forest, arctic, and grassland. You can change the temperature and rainfall to see how conditions affect which animals can survive there. You can even try moving animals to the wrong habitat to see why they struggle.",
    parameterExplanations: {
      temperature:
        "Temperature means how warm or cold the air is. This slider goes from -40°C, which is colder than most freezers, to 50°C, which is hotter than a very hot desert day. Plants and animals need temperatures their bodies can handle. A polar animal may stay warm in freezing air, but it can get too hot in a desert. A desert animal may save water in heat, but it may not survive deep cold. Try changing only Temperature while Rainfall stays the same. Watch how the habitat begins to feel like a different home for living things.",
      rainfall:
        "Rainfall means how much water falls from the sky in a year. This slider goes from 0 mm, which is almost no rain, to 4000 mm, which is very, very rainy. More rain usually helps more plants grow. Plants give animals food, shade, hiding places, and nesting spots. Very little rain makes life harder because there may be fewer plants and less drinking water. A desert can be hot and dry, while a tundra can be cold and dry. Try keeping Temperature the same and changing only Rainfall to see how water changes the habitat.",
    },
    misconceptions: [
      {
        wrong: "Animals can easily move to a new habitat if their old one is gone.",
        correct:
          "Most animals are specially built for one kind of habitat. A polar bear's thick fur and paws are perfect for ice and snow — but in a hot jungle that same fur would be dangerous. Animals often cannot survive in a new habitat because their bodies are not built for the different temperature, food, or shelter there.",
      },
      {
        wrong: "Deserts are always hot.",
        correct:
          "Deserts are defined by how little rain they get, not by how hot they are. The Sahara Desert is very hot, but Antarctica is also considered a polar desert because almost no rain or snow falls there. Both are very dry, but one is boiling and the other is freezing.",
      },
      {
        wrong: "All ocean animals can breathe underwater.",
        correct:
          "Many ocean animals, like fish, use gills to get oxygen from the water. But dolphins, whales, and sea turtles are not fish — they are air breathers. They must swim up to the surface regularly to breathe. They have adapted to hold their breath for a long time, but they cannot breathe underwater.",
      },
      {
        wrong: "More rain always means more animals.",
        correct:
          "More rainfall usually helps more plants grow, which can support more animals. But too much rain can flood burrows and dens. Some animals, like desert lizards, are built for dry conditions and would struggle in a very wet environment. The right amount of rain depends on which animals and plants live there.",
      },
    ],
    teacherUseCases: [
      "Use the Tropical Rainforest preset to introduce warm, wet conditions, then have students identify visible evidence of plant growth and animal shelter.",
      "Compare the Arctic Tundra and Sahara Desert presets to show that low rainfall can occur in both cold and hot environments.",
      "Keep Rainfall constant while changing Temperature in small steps, and ask students to make claims about which animals seem best suited to the new conditions.",
      "Keep Temperature constant while lowering Rainfall to model drought, then have students record how plant cover and animal survival cues change.",
      "Run a three-preset CER discussion where students use Temperature and Rainfall values as evidence for why each biome supports different living things.",
    ],
    faq: [
      {
        question: "What is a habitat?",
        answer:
          "A habitat is the natural home of an animal or plant. It includes everything that living thing needs: the right temperature, the right amount of water, shelter, and food. Just like people live in houses in neighborhoods, animals live in habitats that give them what they need to grow, eat, and raise young.",
      },
      {
        question: "Why can't a polar bear live in the desert?",
        answer:
          "A polar bear has very thick fur and a thick layer of fat to survive in -40°C cold. In a hot desert that same fur would trap too much heat and the bear would overheat quickly. It also could not find its usual food — seals and fish — in the desert. Its whole body is built for cold, not heat.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports 2-LS4-1 (make observations of plants and animals to compare the diversity of life in different habitats) and 3-LS4-3 (construct an argument that environments can support certain living things based on their traits). Students explore what conditions different animals need and why they live where they do.",
      },
      {
        question: "What happens to animals when their habitat is damaged or destroyed?",
        answer:
          "When a habitat is damaged — for example, when a forest is cut down or a wetland is drained — the animals that live there lose their food, shelter, and water. Some animals may move to a nearby area, but if there is nowhere suitable to go, their numbers often fall. Many endangered animals are at risk because their habitats are shrinking.",
      },
      {
        question: "Why do different animals live in different habitats?",
        answer:
          "Over a very long time, animals develop bodies and behaviors that fit their home environment. Those that fit their habitat well survive and have babies. Those that do not fit as well often do not survive as successfully. Over many generations, animals in cold places develop warm coats, and animals in dry places develop ways to save water. Each animal becomes well suited to its particular habitat.",
      },
    ],
  },
};
