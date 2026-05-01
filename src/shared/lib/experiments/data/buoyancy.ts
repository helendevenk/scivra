import type { Experiment } from "@/shared/types/experiment";

export const buoyancy: Experiment = {
  id: "buoyancy",
  slug: "buoyancy-archimedes-principle",
  title: "Buoyancy",
  subtitle: "Explore Archimedes' Principle with different fluids",
  description:
    "Submerge objects in water, oil, and gasoline. Measure buoyant force, observe floating vs. sinking, and verify Archimedes' Principle by relating displaced fluid volume to upward force.",
  thumbnail: "/imgs/experiments/fluid-statics.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["AQA P5.5"],
    ap: ["3.C.4", "3.C.5"],
  },
  primaryStandard: "ap-physics-1",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["buoyancy", "Archimedes principle", "fluid", "density", "displaced volume", "floating"],
  difficulty: "intermediate",

  parameters: [
    { id: "fluid_density", label: "Fluid Density", unit: "kg/m³", min: 500, max: 13600, default: 1000, step: 10, tier: "free" },
    { id: "object_density", label: "Object Density", unit: "kg/m³", min: 100, max: 20000, default: 500, step: 10, tier: "free" },
    { id: "object_volume", label: "Object Volume", unit: "L", min: 0.1, max: 10, default: 1, step: 0.1, tier: "free" },
    { id: "submerged_fraction", label: "Submerged Fraction", unit: "%", min: 0, max: 100, default: 100, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "F_b = \\rho_{fluid} \\cdot V_{displaced} \\cdot g", description: "Buoyant force (Archimedes)" },
    { latex: "\\text{Float if } \\rho_{object} < \\rho_{fluid}", description: "Floating condition" },
    { latex: "\\text{Apparent weight} = W - F_b", description: "Apparent weight in fluid" },
  ],

  theory:
    "Archimedes' Principle states that a submerged object experiences an upward buoyant force equal to the weight of the fluid it displaces. An object floats when its density is less than the fluid density. The principle explains why ships float despite being made of dense steel — their hollow shape displaces enough water to create sufficient buoyancy.",
  instructions:
    "Adjust fluid and object densities. Objects denser than the fluid sink; less dense objects float. The force diagram shows weight vs. buoyant force. Change the submerged fraction to see how buoyancy changes with partial submersion.",
  challenges: [
    { id: "bu-c1", question: "A 2L object with density 800 kg/m³ in water — does it float? What fraction is submerged?", hint: "800 < 1000, so it floats. Fraction = ρ_obj/ρ_fluid = 0.8 = 80%", tier: "free" },
    { id: "bu-c2", question: "What is the buoyant force on a fully submerged 0.5m³ object in water?", hint: "F_b = 1000 × 0.5 × 9.8 = 4900 N", tier: "free" },
    { id: "bu-c3", question: "A steel ship has mass 10,000 kg. What minimum hull volume is needed to float in seawater (1025 kg/m³)?", hint: "V_displaced = m/ρ_fluid = 10000/1025", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["buoyancy-basics", "fluid-statics", "pressure-lab"],

  seoTitle: "Buoyancy — Archimedes Principle Simulation | AP Physics 1",
  seoKeywords: ["buoyancy", "Archimedes principle", "floating sinking", "fluid density", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Buoyancy, Archimedes Principle" },

  contentSections: {
    whatIsIt:
      "Drop a steel bolt in a glass of water and it sinks. Drop a steel ship the size of a city block in the ocean and it floats. The difference isn't the steel — it's how much water gets pushed out of the way. More than two thousand years ago Archimedes worked out the rule: any object dunked in a fluid feels an upward force equal to the weight of the fluid it displaces. That single sentence explains hot-air balloons, submarines, ice cubes in a soda, and why your arm feels lighter underwater. In this lab you choose a fluid (water, oil, mercury), set the object's density and volume, and see the buoyant force, weight, and apparent weight update in real time as the object floats high, sits flush, or sinks to the bottom.",
    parameterExplanations: {
      fluid_density:
        "The density of the surrounding fluid in kg/m³. Water is 1000, vegetable oil about 920, seawater 1025, and mercury a hefty 13,600. A denser fluid pushes harder for the same displaced volume, which is why a steel ball bearing floats on liquid mercury.",
      object_density:
        "The density of the submerged object in kg/m³. If this is less than the fluid density the object floats; if it's greater, the object sinks. Pine wood is around 500, ice 917, aluminum 2700, and lead 11,300.",
      object_volume:
        "The total volume of the object in liters. Larger volumes displace more fluid, which scales the buoyant force linearly. Doubling the volume at fixed density doubles both the weight and the buoyant force, so the float/sink outcome doesn't change — but the magnitudes do.",
      submerged_fraction:
        "The percentage of the object below the fluid surface, from 0% (fully out) to 100% (fully under). Pushing a floating object deeper increases the displaced volume and the upward force, which is exactly what your hand feels when you push a beach ball underwater.",
    },
    misconceptions: [
      {
        wrong:
          "Heavier objects always sink and lighter objects always float.",
        correct:
          "Floating depends on density, not weight. A 50,000-ton aircraft carrier floats because its hull encloses a huge volume of air, giving the whole vessel an average density well below seawater. Mass alone doesn't decide.",
      },
      {
        wrong:
          "The buoyant force on a fully submerged object grows the deeper you push it down.",
        correct:
          "Once the object is fully submerged, it displaces the same volume regardless of depth, so the buoyant force is constant. Pressure increases with depth, so the bottom of the object feels more pressure than the top; that pressure difference creates the net upward force while displaced volume sets its size.",
      },
      {
        wrong:
          "A floating object isn't displacing any water because it's sitting on top.",
        correct:
          "A floating object displaces exactly enough fluid to equal its own weight. Watch the water level rise when you place a block in the tank — that rise is the displacement, and its weight equals the block's weight.",
      },
      {
        wrong:
          "If two objects have the same volume, the one made of denser material gets a bigger buoyant force.",
        correct:
          "Buoyant force depends on the displaced fluid, not on the object's material. Same volume submerged in the same fluid means same buoyant force — the dense object just has more weight to fight against, which is why it sinks.",
      },
    ],
    teacherUseCases: [
      "Data table task: have students record buoyant force at submerged fractions of 25%, 50%, 75%, and 100% for one object, then plot F_b versus fraction submerged and check the linear relationship.",
      "Predict floating fraction: ask students to predict the submerged fraction of pine (500 kg/m³) in water before running the sim, using the rule fraction = ρ_object / ρ_fluid.",
      "Mercury surprise: set the fluid to mercury (13,600 kg/m³) and have students predict whether iron will float. Pause the simulation before reveal — this directly probes the density-vs-mass misconception.",
      "Ship engineering challenge: give a target mass (10,000 kg) and ask groups to find the minimum hull volume that floats in seawater. Tie back to F_b = ρVg.",
      "Misconception probe: ask students whether a fully submerged ball feels more buoyant force one meter down or five meters down before they touch the slider. The answers will surface the depth-equals-buoyancy confusion.",
    ],
    faq: [
      {
        question: "Why do steel ships float when steel bricks sink?",
        answer:
          "A solid steel brick has the density of steel, about 7800 kg/m³, which is far denser than water. A steel ship is mostly air inside the hull, so the ship's average density (steel + air) is below 1000 kg/m³. Floating cares about average density, not the material.",
      },
      {
        question: "What happens when you put a block of ice in salt water versus fresh water?",
        answer:
          "Ice has a density of about 917 kg/m³. In fresh water (1000 kg/m³) it floats with about 92% submerged. In salt water (1025 kg/m³) the denser fluid lifts it slightly higher — about 89% submerged. That small difference is why icebergs ride a touch higher in the ocean than the same chunk would in a freshwater lake.",
      },
      {
        question: "Does the shape of an object change the buoyant force?",
        answer:
          "Only through its effect on displaced volume. A cube and a sphere with the same volume submerged in the same fluid feel the same buoyant force. Shape matters when an object is partially submerged — a wide flat shape can displace more water before going under than a tall skinny one.",
      },
      {
        question: "Why does my arm feel lighter when I lift it underwater?",
        answer:
          "Your arm displaces water equal to its volume, and that water's weight pushes up on your arm. Your apparent weight equals your real weight minus the buoyant force, so a body part that's about as dense as water (most of you is) loses almost all its felt weight underwater.",
      },
      {
        question: "How does this lab relate to AP Physics 1?",
        answer:
          "AP Physics 1 standard 3.C.4 expects students to identify buoyant force as a contact force from a fluid and to compute it using F_b = ρ_fluid · V_displaced · g. This simulation is a direct visualization of that equation, and the floating-fraction calculations exercise standard 3.C.5 on equilibrium of floating objects.",
      },
    ],
  },
};
