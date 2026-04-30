import type { Experiment } from "@/shared/types/experiment";

export const pressureLab: Experiment = {
  id: "pressure-lab",
  slug: "pressure-lab-fluid-pressure",
  title: "Pressure Lab",
  subtitle: "Explore atmospheric and fluid pressure",
  description:
    "Measure pressure at different depths in liquids, compare fluid densities, and observe how atmospheric pressure varies with altitude. Verify Pascal's Principle and Bernoulli's Equation.",
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
  tags: ["pressure", "fluid pressure", "Pascal's principle", "atmospheric pressure", "depth", "gauge pressure"],
  difficulty: "intermediate",

  parameters: [
    { id: "fluid_density", label: "Fluid Density", unit: "kg/m³", min: 500, max: 13600, default: 1000, step: 50, tier: "free" },
    { id: "depth", label: "Probe Depth", unit: "m", min: 0, max: 20, default: 5, step: 0.1, tier: "free" },
    { id: "atm_pressure", label: "Atmospheric Pressure", unit: "atm", min: 0, max: 2, default: 1, step: 0.01, tier: "free" },
    { id: "area", label: "Piston Area", unit: "cm²", min: 1, max: 100, default: 10, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "P = P_0 + \\rho g h", description: "Fluid pressure at depth h" },
    { latex: "P_1 A_1 = P_2 A_2", description: "Pascal's Principle (hydraulic lever)" },
    { latex: "P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{const}", description: "Bernoulli's Equation" },
  ],

  theory:
    "Pressure in a fluid increases with depth: P = P₀ + ρgh. Pascal's Principle states that pressure applied to a confined fluid transmits undiminished in all directions — the basis for hydraulic systems. Atmospheric pressure at sea level is ~101.3 kPa, decreasing with altitude. Bernoulli's Equation shows the trade-off between pressure, kinetic energy, and height in flowing fluids.",
  instructions:
    "Drag the pressure gauge to different depths to measure absolute and gauge pressure. Use the hydraulic press to demonstrate Pascal's Principle — apply small force on small piston, observe large force on large piston. Check the atmosphere panel to see pressure vs. altitude.",
  challenges: [
    { id: "prl-c1", question: "What is the gauge pressure at 10m depth in water (ρ=1000 kg/m³)?", hint: "P_gauge = ρgh = 1000 × 9.8 × 10 = 98,000 Pa ≈ 0.97 atm", tier: "free" },
    { id: "prl-c2", question: "A hydraulic press has A₁=5cm² and A₂=500cm². If F₁=100N, what is F₂?", hint: "Pascal: P = F₁/A₁ = F₂/A₂ → F₂ = F₁×(A₂/A₁) = 100×100 = 10,000N", tier: "free" },
    { id: "prl-c3", question: "Why does water flow faster through a narrow pipe than a wide one (same pressure)?", hint: "Bernoulli: if v increases, P decreases; continuity A₁v₁ = A₂v₂ forces higher v in narrow section", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["fluid-statics", "buoyancy", "bernoulli-fluid-dynamics"],

  seoTitle: "Pressure Lab — Fluid Pressure and Pascal's Principle | AP Physics 1",
  seoKeywords: ["pressure lab", "fluid pressure", "Pascal's principle", "Bernoulli equation", "AP Physics 1"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Fluid Pressure, Pascal's Principle, Bernoulli Equation" },

  contentSections: {
    whatIsIt:
      "Anyone who has dived to the bottom of a swimming pool knows the feeling: your ears pop, your chest tightens, the deeper you go the harder the water squeezes. That squeeze is fluid pressure, and it follows a beautifully simple rule: P = P₀ + ρgh, where ρ is fluid density, g is gravity, and h is depth. Notice what's missing — the shape of the container, the volume of the water, the size of the pool. None of those matter. A scuba diver 10 meters down in a swimming pool feels exactly the same gauge pressure as a diver 10 meters down in the ocean, as long as the fluid density is the same. This lab lets you drag a pressure probe to any depth in fluids ranging from gasoline (~700 kg/m³) to mercury (13,600 kg/m³), watch atmospheric pressure stack on top, and verify Pascal's Principle with a hydraulic press.",
    parameterExplanations: {
      fluid_density:
        "How tightly packed the fluid is, in kg/m³. Pressure at a given depth scales linearly with density: water (1000) gives 9800 Pa per meter, while mercury (13,600) gives 133,000 Pa per meter — which is why barometers use mercury instead of water.",
      depth:
        "How far below the fluid surface the probe sits, in meters. Pressure rises linearly with depth at exactly ρg per meter, regardless of container shape, fluid volume, or what's above the surface.",
      atm_pressure:
        "Pressure at the fluid surface, in atmospheres. This adds on top of the depth term to give absolute pressure. Standard atmosphere is 1 atm ≈ 101,325 Pa; on Mt. Everest it drops to about 0.33 atm.",
      area:
        "Piston cross-sectional area in cm². Pascal's Principle says the same pressure acts on every piston, so a small piston with area A₁ feeling force F₁ produces force F₁ × (A₂/A₁) on a larger piston of area A₂ — the principle behind hydraulic lifts.",
    },
    misconceptions: [
      {
        wrong:
          "Atmospheric pressure only pushes downward — that's why we feel it as a weight.",
        correct:
          "Pressure in a fluid acts equally in all directions at a given depth. The atmosphere pushes upward on the underside of your arm with the same 101,325 Pa as it pushes down on the top. We don't feel it because it's balanced everywhere on our bodies.",
      },
      {
        wrong:
          "A wide, shallow swimming pool has higher pressure at the bottom than a tall, narrow water tower at the same depth, because there's more water in the pool.",
        correct:
          "Pressure depends only on depth, density, and gravity — P = ρgh. Container shape and volume don't appear in the formula. The wide pool and the narrow tower at the same depth have identical pressure at the bottom.",
      },
      {
        wrong:
          "If I add atmospheric pressure on top of a fluid, the pressure at the bottom doesn't change because the atmosphere is so light.",
        correct:
          "Atmospheric pressure (about 101 kPa) does add to the bottom pressure — and 101 kPa is equivalent to about 10 meters of extra water depth. That's a big chunk that you feel as 'absolute' pressure but not as 'gauge' pressure (which subtracts atmospheric).",
      },
      {
        wrong:
          "A hydraulic press creates extra energy because a small input force lifts a huge load.",
        correct:
          "The press multiplies force, not energy. The small piston has to travel a long distance to push the large piston a tiny distance — input work equals output work (F₁d₁ = F₂d₂). Pascal's Principle is a force amplifier, not an energy generator.",
      },
    ],
    teacherUseCases: [
      "Pressure-vs-depth graph: have students record absolute pressure at depths of 0, 5, 10, 15, 20 m in water and plot P vs. h. The slope (~9800 Pa/m) is ρg, and the intercept is atmospheric pressure.",
      "Density swap: at fixed depth = 5 m, change fluid from water (1000) to seawater (1025) to mercury (13,600) and ask students to predict the pressure jump before reading the gauge.",
      "Misconception probe — 'does container shape matter?': have two student teams design containers (wide pool vs. narrow column) of the same depth and predict bottom pressure. Run the simulator to confirm they're identical.",
      "Hydraulic press challenge: design a press that lifts a 10,000 N car using only 100 N of input force. Students must compute the area ratio (A₂/A₁ = 100) and verify it works.",
      "Real-world altitude lab: vary atmospheric pressure from 1 atm (sea level) to 0.33 atm (Mt. Everest summit) and have students explain why mountaineers need supplemental oxygen — partial pressure of O₂ drops with total pressure.",
    ],
    faq: [
      {
        question: "Why doesn't container shape appear in the pressure formula P = ρgh?",
        answer:
          "Pressure at a depth h is determined by the weight of fluid in a vertical column of unit area above the point — that weight is ρgh per unit area, regardless of how the rest of the container is shaped. Even if the container narrows, widens, or branches sideways, the fluid is connected and pressure equilibrates horizontally. This is sometimes called the hydrostatic paradox: a thimble-sized column of water 10 m tall produces the same bottom pressure as an Olympic pool 10 m deep.",
      },
      {
        question: "Why is mercury used in barometers instead of water?",
        answer:
          "Mercury is 13.6 times denser than water, so a column only 76 cm tall balances 1 atm of pressure. A water barometer would need a column over 10 meters tall to do the same job, which is why early barometers in the 1640s switched from water to mercury once Torricelli realized the issue. The cost is toxicity — modern barometers often use aneroid (sealed metal-bellows) designs to avoid mercury entirely.",
      },
      {
        question: "What's the difference between gauge pressure and absolute pressure?",
        answer:
          "Absolute pressure includes atmospheric pressure pushing down on the surface; gauge pressure is the additional pressure above atmospheric. At 10 m depth in water, absolute pressure ≈ 2 atm (1 atm air + 1 atm water column), but gauge pressure ≈ 1 atm. Tire gauges, blood pressure cuffs, and scuba depth gauges report gauge pressure because that's what matters for the device's operation, while engineers designing pressure vessels work in absolute units.",
      },
      {
        question: "How does this lab connect to AP Physics 1 standards 3.C.4 and 3.C.5?",
        answer:
          "Standard 3.C.4 covers contact forces between objects, including normal forces and pressure in fluids. Standard 3.C.5 specifically calls out gravitational and contact forces in fluid systems — buoyancy, hydrostatic pressure, and Pascal's Principle. By measuring P at varied depth and density, deriving the linear relationship P = P₀ + ρgh, and reasoning about hydraulic lifts, you are doing exactly what those standards ask. NGSS HS-PS2-1 connects too, since pressure is a contact force in a fluid that produces predictable accelerations on submerged objects.",
      },
      {
        question: "Why doesn't atmospheric pressure crush us?",
        answer:
          "Atmospheric pressure pushes inward on every part of your body with about 101,325 Pa, but the fluids inside you (blood, interstitial water, lungs filled with air at the same pressure) push outward with the same pressure. The forces balance, so there's no net inward squeeze. This balance fails when external pressure changes rapidly — that's why scuba divers must equalize ear pressure, and why astronauts in vacuum suits need carefully maintained internal pressure.",
      },
    ],
  },
};
