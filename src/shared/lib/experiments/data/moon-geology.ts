import type { Experiment } from "@/shared/types/experiment";

export const moonGeology: Experiment = {
  id: "moon-geology",
  slug: "moon-geology",
  title: "Moon Geology",
  subtitle: "Lunar surface features, maria, highlands, and crater formation",
  description:
    "Explore the Moon's geological features including impact craters, volcanic maria, and highland terrains. Simulate meteorite impacts to create craters of varying sizes, examine lunar rock samples, and understand the Moon's geological history from formation to present.",
  thumbnail: "/imgs/experiments/moon-geology.png",
  standards: { ngss: ["MS-ESS1-3", "HS-ESS1-6"], gcse: [], ap: [] },
  primaryStandard: "ngss-ms",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "6-8",
  tags: ["Moon", "lunar geology", "craters", "maria", "impact", "Earth science"],
  difficulty: "intermediate",
  parameters: [
    { id: "impactSize", label: "Meteorite Size", unit: "km", min: 0.1, max: 50, default: 5, step: 0.5, tier: "free" },
    { id: "impactVelocity", label: "Impact Velocity", unit: "km/s", min: 5, max: 70, default: 20, step: 5, tier: "free" },
    { id: "impactAngle", label: "Impact Angle", unit: "°", min: 10, max: 90, default: 45, step: 5, tier: "free" },
  ],
  formulas: [
    { latex: "D \\approx 1.8 \\rho_p^{0.11} \\rho_t^{-1/3} d^{0.78} v^{0.44} g^{-0.22} (\\sin\\theta)^{1/3}", description: "Pi-scaling crater diameter formula relating projectile and target properties" },
  ],
  theory: "The Moon's surface is divided into dark, flat maria (ancient lava plains) and bright, cratered highlands (older crust). Impact craters form when meteorites strike the surface at hypervelocity (10-70 km/s). Crater diameter depends on impactor size, velocity, angle, and target properties. Simple craters (<15 km) are bowl-shaped; complex craters have central peaks. The largest impacts created multi-ring basins. The Moon has no atmosphere or plate tectonics, so craters are preserved for billions of years. Lunar rock types include anorthosite (highlands), basalt (maria), and breccia (mixed impact debris).",
  instructions: "Click on the lunar surface to create impact craters. Adjust meteorite size, velocity, and angle to see how they affect crater dimensions. Examine the cross-section view to see crater structure.",
  challenges: [
    { id: "mg-c1", question: "Why are lunar maria darker than highlands?", hint: "Maria are filled with dark basaltic lava from ancient volcanic eruptions, while highlands are lighter-colored anorthosite (calcium-rich feldspar)", tier: "free" },
    { id: "mg-c2", question: "Why does the Moon have more visible craters than Earth?", hint: "No atmosphere (no erosion or burn-up), no plate tectonics (no recycling), and no water erosion to wear craters away", tier: "free" },
  ],
  wave: 12, tier: "free", estimatedTime: 20,
  relatedExperiments: ["tides-lunar-gravity", "solar-system-scale"],
  htmlPath: "/experiments/earth-science/moon-geology.html",
  seoTitle: "Moon Geology Simulation | Scivra Earth Science",
  seoKeywords: ["Moon geology simulation", "lunar crater interactive", "maria highlands", "NGSS Earth science"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Middle School", teaches: "Lunar Geology" },
};
