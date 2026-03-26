import type { Experiment } from "@/shared/types/experiment";

export const densityLab: Experiment = {
  id: "density-lab",
  slug: "density-lab-mass-volume",
  title: "Density Lab",
  subtitle: "Measure mass and volume to determine density",
  description:
    "Use a virtual scale and graduated cylinder to measure the mass and volume of various objects. Calculate density, compare materials, and discover why objects float or sink.",
  thumbnail: "/imgs/experiments/fluid-statics.png",

  standards: {
    ngss: ["MS-PS1-4", "HS-PS2-1"],
    gcse: ["AQA C1.2"],
    ap: ["3.C.4"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["density", "mass", "volume", "measurement", "graduated cylinder", "water displacement"],
  difficulty: "beginner",

  parameters: [
    { id: "material", label: "Material", unit: "", min: 0, max: 9, default: 0, step: 1, tier: "free" },
    { id: "object_size", label: "Object Size", unit: "cm", min: 1, max: 10, default: 5, step: 0.5, tier: "free" },
  ],

  formulas: [
    { latex: "\\rho = \\frac{m}{V}", description: "Density" },
    { latex: "V = V_{final} - V_{initial}", description: "Volume by water displacement" },
  ],

  theory:
    "Density is the ratio of mass to volume (ρ = m/V). Different materials have characteristic densities — iron is ~7874 kg/m³, water is 1000 kg/m³, and wood is typically 400–900 kg/m³. Water displacement is the standard method for measuring irregular volumes: immerse an object in water and measure the volume increase. Density determines whether an object floats or sinks.",
  instructions:
    "Select a material and place the object on the scale to measure mass. Submerge it in the graduated cylinder to measure displaced volume. Calculate density and compare with reference values. Try predicting float/sink behavior before testing in the tank.",
  challenges: [
    { id: "dl-c1", question: "An object has mass 50g and displaces 25mL of water. What is its density?", hint: "ρ = m/V = 50g / 25mL = 2 g/cm³", tier: "free" },
    { id: "dl-c2", question: "Will the object above float in water (ρ=1 g/cm³)?", hint: "2 g/cm³ > 1 g/cm³ → it sinks", tier: "free" },
    { id: "dl-c3", question: "A hollow metal sphere appears to have lower density than expected. Why?", hint: "The hollow space increases volume without adding mass", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["buoyancy", "buoyancy-basics", "fluid-statics"],

  seoTitle: "Density Lab — Mass, Volume, and Density Simulation | Physics Lab",
  seoKeywords: ["density lab", "mass volume", "water displacement", "density measurement", "physics simulation"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "Middle School", teaches: "Density, Mass, Volume Measurement" },
};
