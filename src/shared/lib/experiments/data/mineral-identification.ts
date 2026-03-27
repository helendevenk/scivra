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
};
