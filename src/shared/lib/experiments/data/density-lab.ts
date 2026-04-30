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

  contentSections: {
    whatIsIt:
      "Hold a softball-sized chunk of pine in one hand and a softball-sized chunk of iron in the other and you can feel the difference instantly — the iron is roughly fifteen times heavier even though they take up the same space. That ratio of mass to volume is density, and it's one of the most useful numbers in chemistry, geology, and engineering. Every pure material has its own characteristic density: aluminum 2.7 g/cm³, copper 8.96, gold 19.3, balsa wood 0.16. Once you know an object's density, you can predict whether it floats in water, identify what it's made of, or check whether a coin is counterfeit. In this lab you choose a material, measure mass on a virtual scale and volume by water displacement in a graduated cylinder, divide one by the other, and compare your result to the textbook value.",
    parameterExplanations: {
      material:
        "The material the object is made of — aluminum, iron, lead, gold, ice, wood, plastic, and so on. Each material has a fixed density baked in (iron 7874 kg/m³, lead 11,340, oak 700), so changing material changes only the mass for a given size.",
      object_size:
        "The linear size of the object in centimeters, which sets its volume. Doubling the size at fixed material multiplies the volume (and mass) by roughly eight, since volume scales as size cubed — but density stays the same because both numerator and denominator scale together.",
    },
    misconceptions: [
      {
        wrong:
          "Bigger objects are denser than smaller objects of the same material.",
        correct:
          "Density is a property of the material, not of the object. A penny-sized chunk of gold and a brick-sized chunk of gold both have the same density (19.3 g/cm³) — the brick is heavier only because it has more volume to begin with.",
      },
      {
        wrong:
          "Mass and weight are the same thing, so density depends on where you weigh the object.",
        correct:
          "Mass is the amount of matter and doesn't change with location. Weight is mass times gravity and would be different on the Moon. Density uses mass, so a kilogram of aluminum has the same density on Earth, the Moon, or in deep space.",
      },
      {
        wrong:
          "If you cut an object in half, each piece has half the density.",
        correct:
          "Each piece has half the mass and half the volume — they cancel, so the density stays the same. That's actually how you know density is a property of the material itself, not of how much of it you have.",
      },
      {
        wrong:
          "A hollow object made of metal has the same density as the same metal in solid form.",
        correct:
          "The hollow space inside counts toward the object's total volume, but contributes no mass. The whole object's average density drops well below the metal's density, which is exactly why hollow steel ships float when solid steel chunks sink.",
      },
    ],
    teacherUseCases: [
      "Measurement protocol drill: have students record mass and displaced volume for at least five materials and plot mass versus volume on a single set of axes. The slope of the line for each material is its density.",
      "Identify-the-material challenge: hide the material label and give students three mass and volume measurements. Ask them to calculate density and identify the substance from a reference table.",
      "Predict the float: have students compute density first, then predict whether each object will float in water before dropping it in. Track the class's prediction accuracy as they get more practice.",
      "Misconception probe: show a small wood block and a large wood block side by side and ask 'which one has higher density?' Students who pick the bigger block are confusing density with mass — use the measurement readout to settle it.",
      "Hollow-object extension: at the Pro tier, ask students why a hollow metal sphere measures lower density than the metal it's made of, and connect the answer to ship hulls and life jackets.",
    ],
    faq: [
      {
        question: "What is the formula for density and why does it matter?",
        answer:
          "Density is mass divided by volume: ρ = m/V. It matters because it's a fingerprint of a material — pure gold is always 19.3 g/cm³, pure aluminum always 2.7 g/cm³. A density measurement tells you what something is, predicts whether it floats, and reveals defects like hollow spaces or impurities in a sample.",
      },
      {
        question: "Why do we use water displacement to measure volume?",
        answer:
          "Most real objects are not perfect cubes or spheres, so you can't just plug numbers into a geometric formula. Submerging an irregular object in water raises the water level by exactly its volume, so reading the rise on a graduated cylinder gives you the volume of any shape that fits in the cylinder and isn't water-soluble.",
      },
      {
        question: "Does temperature affect density?",
        answer:
          "Yes, but usually only a little for solids. Most materials expand slightly when heated, which increases volume without changing mass, so density goes down a tiny bit. Water is famous for breaking this pattern between 0°C and 4°C — it actually gets denser as it warms, which is why lakes freeze from the top down.",
      },
      {
        question: "Why does ice float on water if it's the same substance?",
        answer:
          "When liquid water freezes, the molecules lock into a hexagonal crystal that takes up more space than the disordered liquid. That makes ice about 8% less dense than the water around it (917 vs 1000 kg/m³), so it floats. Most other substances are denser as solids than liquids — water is unusual.",
      },
      {
        question: "How does this lab connect to NGSS and AP Physics 1?",
        answer:
          "NGSS standard MS-PS1-4 asks students to use models of matter at the particle level, and density is the macroscopic measurement that flows out of those models. AP Physics 1 standard 3.C.4 expects students to relate density and buoyant force, which is what makes this lab a natural lead-in to the Buoyancy and Buoyancy Basics simulations.",
      },
    ],
  },
};
