import type { Experiment } from "@/shared/types/experiment";

export const mineralIdentification: Experiment = {
  id: "mineral-identification",
  slug: "mineral-identification",
  title: "Mineral Identification",
  subtitle: "Hardness, luster, cleavage, and streak tests for common minerals",
  description:
    "Practice identifying minerals using physical properties. Perform virtual scratch tests (Mohs hardness), observe luster types, examine cleavage and fracture patterns, and check streak colors. Use a dichotomous key to identify unknown mineral samples from their combined properties.",
  thumbnail: "/imgs/experiments/mineral-identification.png",
  standards: { ngss: ["MS-ESS2-1"], gcse: [], ap: [] },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: ["mineral identification", "Mohs hardness", "luster", "cleavage", "streak test", "Earth science"],
  difficulty: "beginner",
  parameters: [
    { id: "mineralSample", label: "Mineral Sample (0-9)", unit: "", min: 0, max: 9, default: 0, step: 1, tier: "free" },
    { id: "testType", label: "Test (0=hardness, 1=luster, 2=streak, 3=cleavage)", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
  ],
  formulas: [],
  theory: "Minerals are identified by physical properties, not appearance alone. Mohs hardness scale (1-10) ranks scratch resistance: talc (1), gypsum (2), calcite (3), fluorite (4), apatite (5), feldspar (6), quartz (7), topaz (8), corundum (9), diamond (10). Luster describes how light reflects: metallic, vitreous (glassy), pearly, silky, or earthy. Streak is the color of powdered mineral on unglazed porcelain — often different from the mineral's apparent color. Cleavage describes how minerals break along flat planes determined by crystal structure; fracture describes irregular breaking. These properties together form a diagnostic fingerprint for each mineral.",
  instructions: "Select a mineral sample and perform tests. Compare results against the mineral database to identify the unknown. Complete all four tests for the most accurate identification.",
  challenges: [
    { id: "mi-c1", question: "A mineral scratches glass (hardness ~5.5) but not quartz. What is its approximate hardness?", hint: "Between 5.5 and 7 on the Mohs scale — could be feldspar (6) or similar", tier: "free" },
    { id: "mi-c2", question: "A gold-colored mineral has a black streak. Is it gold or pyrite?", hint: "Pyrite — real gold has a golden-yellow streak, while pyrite ('fool's gold') has a dark greenish-black streak", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 15,
  relatedExperiments: ["rock-cycle", "soil-formation"],
  htmlPath: "/experiments/earth-science/mineral-identification.html",
  seoTitle: "Mineral Identification Virtual Lab | Scivra Earth Science",
  seoKeywords: ["mineral identification simulation", "Mohs hardness interactive", "streak test virtual lab", "NGSS Earth science"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Middle School", teaches: "Mineral Identification" },
  contentSections: {
    whatIsIt:
      "Minerals are the natural building blocks that make up rocks and much of Earth's crust. Scientists identify minerals not by color alone — which can vary — but by a set of reliable physical properties that stay consistent for each mineral type. The Mohs hardness scale ranks minerals from 1 (talc, the softest, like a bar of soap) to 10 (diamond, the hardest substance in nature). Luster describes the way a mineral's surface reflects light: metallic luster looks shiny like a coin, while vitreous (glassy) luster looks like the surface of a broken bottle. Streak is the color of a mineral's powder, tested by dragging it across unglazed porcelain — and streak can be surprisingly different from the mineral's surface color. Cleavage describes how a mineral breaks along flat, smooth planes; fracture describes a rough or irregular break. Using all four tests together, a scientist can build a diagnostic fingerprint that uniquely identifies almost any common mineral. This simulation lets you practice each test on ten different mineral samples.",
    parameterExplanations: {
      mineralSample:
        "Selects one of ten mineral samples to examine, numbered 0 through 9. Each sample has different physical properties — some are soft and waxy, others are glassy and hard. Switch between samples to compare how different minerals respond to the same test.",
      testType:
        "Chooses which physical property test to run: 0 runs a scratch test to determine Mohs hardness, 1 examines how light reflects off the surface (luster), 2 drags the sample across porcelain to reveal its streak color, and 3 looks at how the mineral breaks to show cleavage or fracture patterns. Run all four tests on each sample for the most reliable identification.",
    },
    misconceptions: [
      {
        wrong: "You can always identify a mineral just by its color.",
        correct:
          "Color is one of the least reliable mineral properties because impurities can completely change it. Quartz, for example, can appear purple, pink, white, or clear depending on trace elements. Scientists use hardness, streak, cleavage, and luster together because those properties are far more consistent and trustworthy.",
      },
      {
        wrong: "A mineral that looks metallic must contain metal.",
        correct:
          "Metallic luster just describes the way light reflects off a surface — it does not mean the mineral is actually a metal. Pyrite (iron sulfide) has a bright metallic luster and a brassy color but is not a pure metal. Many sulfide minerals look metallic even though they are compounds.",
      },
      {
        wrong: "Streak color is always the same as the mineral's visible surface color.",
        correct:
          "Streak often differs dramatically from surface color. Pyrite looks golden on the outside but leaves a greenish-black streak. Hematite looks silver or reddish on the outside but always leaves a rust-red streak. That contrast is exactly what makes streak such a useful test — it cuts through misleading surface appearances.",
      },
      {
        wrong: "Cleavage and fracture are the same thing.",
        correct:
          "Cleavage is when a mineral breaks along specific flat planes determined by its crystal structure — like splitting mica into thin sheets. Fracture is when a mineral breaks unevenly in no particular direction — like how glass breaks in curved or jagged pieces. Some minerals show both depending on where and how they are struck.",
      },
      {
        wrong: "The hardest mineral scratches everything and the softest mineral scratches nothing.",
        correct:
          "Hardness is always relative. A mineral scratches anything softer than itself, but can be scratched by anything harder. Quartz (7) scratches feldspar (6), but topaz (8) scratches quartz. Common objects like a fingernail (~2.5) or a steel nail (~5.5) can be used as comparison tools to estimate a mineral's position on the Mohs scale.",
      },
    ],
    teacherUseCases: [
      "Select whichever mineralSample the simulation labels as gypsum and set testType to 0 to run the scratch test, then switch to the sample labeled quartz and compare results — students discover that gypsum can be scratched by a fingernail while quartz scratches glass, building intuition for the Mohs scale.",
      "Cycle testType from 0 to 3 while keeping mineralSample fixed on one sample — students record all four properties and practice filling in a mineral identification table, mirroring real lab data collection.",
      "Select the mineralSample labeled pyrite and set testType to 2 for the streak test — compare the golden surface color with the dark streak to address the 'fool's gold' misconception before students encounter pyrite in a rock collection.",
      "Have students guess the mineral using only testType 1 (luster), then reveal the full identity after running all tests — demonstrates why single-property identification is unreliable and why scientists use multiple lines of evidence (MS-ESS2-1).",
    ],
    faq: [
      {
        question: "Why does the Mohs scale go from 1 to 10 instead of measuring hardness in specific units?",
        answer:
          "The Mohs scale is a relative ranking, not an absolute measurement. Mineralogist Friedrich Mohs arranged ten common minerals in order of scratch resistance in 1812. The gaps between steps are not equal in absolute hardness — diamond (10) is actually many times harder than corundum (9) in absolute terms, but the scale is still useful because it is quick, fieldwork-friendly, and requires no special equipment beyond a few known reference minerals.",
      },
      {
        question: "Why is streak tested on unglazed porcelain?",
        answer:
          "Unglazed porcelain has a hardness of about 6.5 on the Mohs scale, which means minerals softer than that will leave a powder mark (streak) on its surface rather than scratching it. The rough surface also abrades the mineral consistently to produce a fine powder whose color reveals the mineral's true identity, regardless of surface coatings or impurities.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation directly supports MS-ESS2-1, which asks students to develop a model to describe the cycling of Earth's materials and the flow of energy that drives this process. Identifying the minerals that form rocks is a foundational step toward understanding the rock cycle. It also builds the scientific practice of using evidence-based criteria (multiple physical tests) to classify natural objects.",
      },
      {
        question: "What is the difference between a mineral and a rock?",
        answer:
          "A mineral is a naturally occurring, inorganic solid with a specific chemical composition and a defined crystal structure — quartz, feldspar, and mica are all minerals. A rock is typically a mixture of two or more minerals (and sometimes organic material) that have been cemented or interlocked together. Granite, for example, is a rock made mostly of quartz, feldspar, and mica. Every rock is made of minerals, but a single mineral is not a rock.",
      },
      {
        question: "Can two different minerals have exactly the same hardness?",
        answer:
          "Yes, it is possible for two minerals to scratch each other with roughly equal ease, which means they have similar hardness values. In practice, geologists perform the scratch test in both directions and also compare against known reference minerals and everyday objects (copper coin ~3, glass plate ~5.5, steel file ~6.5) to narrow down the range. When hardness alone is ambiguous, the other three tests — luster, streak, and cleavage — help distinguish them.",
      },
    ],
  },
};
