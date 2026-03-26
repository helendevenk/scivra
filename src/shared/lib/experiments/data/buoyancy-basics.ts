import type { Experiment } from "@/shared/types/experiment";

export const buoyancyBasics: Experiment = {
  id: "buoyancy-basics",
  slug: "buoyancy-basics-intro",
  title: "Buoyancy Basics",
  subtitle: "Introduction to floating, sinking, and buoyant force",
  description:
    "A simplified introduction to buoyancy. Choose from common objects and observe whether they float or sink in water, honey, or gasoline. Great first step before the full Buoyancy lab.",
  thumbnail: "/imgs/experiments/fluid-statics.png",

  standards: {
    ngss: ["MS-PS1-4", "HS-PS2-1"],
    gcse: ["AQA P5.5"],
    ap: ["3.C.4"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["buoyancy", "floating", "sinking", "density", "Archimedes"],
  difficulty: "beginner",

  parameters: [
    { id: "fluid", label: "Fluid Type", unit: "", min: 0, max: 2, default: 0, step: 1, tier: "free" },
    { id: "object", label: "Object Type", unit: "", min: 0, max: 7, default: 0, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "F_b = \\rho_{fluid} V g", description: "Buoyant force" },
    { latex: "\\rho = \\frac{m}{V}", description: "Density" },
  ],

  theory:
    "An object sinks when it is denser than the surrounding fluid, and floats when it is less dense. The upward buoyant force equals the weight of displaced fluid. This basic principle explains why ice floats in water, why oil rises in vinegar, and why dense metals sink in water but float in liquid mercury.",
  instructions:
    "Select a fluid and an object from the menus. Drop the object into the tank and observe whether it floats or sinks. The mass and volume display helps you calculate density.",
  challenges: [
    { id: "bb-c1", question: "Which is denser: wood or water? How can you tell from the simulation?", hint: "Wood floats in water — it is less dense", tier: "free" },
    { id: "bb-c2", question: "Would an apple float in honey? Why or why not?", hint: "Compare apple density to honey density (~1400 kg/m³)", tier: "free" },
    { id: "bb-c3", question: "Why does the same object float higher in honey than in water?", hint: "Denser fluid creates more buoyant force per unit volume displaced", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 10,
  relatedExperiments: ["buoyancy", "fluid-statics", "density-lab"],

  seoTitle: "Buoyancy Basics Simulation | Floating and Sinking | Physics Lab",
  seoKeywords: ["buoyancy basics", "floating sinking", "density", "Archimedes", "physics simulation"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Buoyancy, Density, Floating and Sinking" },
};
