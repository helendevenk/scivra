import type { Experiment } from "@/shared/types/experiment";

export const fluidStatics: Experiment = {
  id: "fluid-statics",
  slug: "fluid-statics",
  title: "Fluid Statics & Bernoulli's Principle",
  subtitle: "Buoyancy, pressure, and why planes fly",
  description:
    "Drop objects into fluid and watch buoyancy in action. Then switch to the flow mode and see how constricting a pipe speeds up fluid and drops pressure — Bernoulli's principle visualized. Understand why a curveball curves and a plane wing generates lift.",
  thumbnail: "/imgs/experiments/fluid-statics.png",

  standards: {
    ngss: ["HS-PS2-1"],
    gcse: ["P5.1"],
    ap: ["3.C.4"],
  },
  primaryStandard: "ap-physics-2",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["buoyancy", "Archimedes", "Bernoulli", "fluid pressure", "Pascal's law", "AP Physics 2"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "fluidDensity",
      label: "Fluid Density (ρ)",
      unit: "kg/m³",
      min: 800,
      max: 1200,
      default: 1000,
      step: 5,
      tier: "free",
    },
    {
      id: "totalDepth",
      label: "Total Depth (h)",
      unit: "m",
      min: 0.5,
      max: 5,
      default: 2.5,
      step: 0.1,
      tier: "free",
    },
    {
      id: "surfacePressure",
      label: "Surface Pressure (P₀)",
      unit: "kPa",
      min: 101,
      max: 200,
      default: 101,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "F_b = \\rho_{fluid} g V_{submerged}",
      description: "Archimedes' buoyancy force",
    },
    {
      latex: "P = P_0 + \\rho g h",
      description: "Hydrostatic pressure",
    },
    {
      latex: "P_1 + \\frac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g h_2",
      description: "Bernoulli's equation (energy conservation)",
    },
    {
      latex: "A_1 v_1 = A_2 v_2",
      description: "Continuity equation (mass conservation)",
    },
  ],

  theory:
    "Archimedes' principle: the buoyant force equals the weight of displaced fluid. An object floats when its average density is less than the fluid. Pascal's law: pressure applied to enclosed fluid transmits equally in all directions (basis of hydraulics). Bernoulli's equation is conservation of energy for flowing fluid: faster flow → lower pressure. A wing generates lift because air moves faster over the curved top surface, creating lower pressure above than below.",

  instructions:
    "Use the Fluid Density, Total Depth, and Surface Pressure sliders to change the hydrostatic pressure field in the tank. Compare the Fresh Water, Sea Water, and Dense Fluid presets to see how density, depth, and applied surface pressure change the pressure-at-depth readout, buoyant force, and floating height of the submerged object.",

  challenges: [
    {
      id: "fs-c1",
      question: "A wood block (ρ = 600 kg/m³, V = 0.002 m³) is placed in water (ρ = 1000 kg/m³). What fraction is submerged?",
      hint: "At equilibrium: ρ_obj × V_total = ρ_fluid × V_submerged. Fraction = ρ_obj/ρ_fluid",
      tier: "free",
    },
    {
      id: "fs-c2",
      question: "What is the buoyant force on a 0.001 m³ steel ball (ρ = 7800 kg/m³) fully submerged in water?",
      hint: "F_b = ρ_water × g × V_submerged = 1000 × 9.8 × 0.001",
      tier: "free",
    },
    {
      id: "fs-c3",
      question: "Water flows at 2 m/s through a pipe of area 0.04 m². It then enters a constriction of area 0.01 m². What is the speed in the constriction?",
      hint: "Continuity: A₁v₁ = A₂v₂",
      tier: "free",
    },
    {
      id: "fs-c4",
      question: "In the constriction above, if P₁ = 150,000 Pa at the wide section, find P₂. (ρ = 1000 kg/m³, same height)",
      hint: "Bernoulli: P₁ + ½ρv₁² = P₂ + ½ρv₂². Calculate both dynamic pressure terms.",
      tier: "pro",
    },
  ],

  wave: 2,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["newtons-laws"],

  seoTitle: "Fluid Statics & Bernoulli's Principle — Interactive 3D | Scivra",
  seoKeywords: [
    "Archimedes principle simulation",
    "buoyancy interactive",
    "Bernoulli's principle",
    "fluid statics simulation",
    "AP Physics 2 fluids",
    "Pascal's law",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Fluid Statics and Bernoulli's Principle",
  },
  htmlControlAliases: {
    fluidDensity: "sl-density",
    totalDepth: "sl-depth",
    surfacePressure: "sl-surf",
  },
  presets: [
    {
      id: "fresh",
      label: "Fresh Water",
      description:
        "Fresh Water sets the tank to 1000 kg/m³, 2.5 m depth, and normal atmospheric surface pressure. It is the baseline for comparing hydrostatic pressure and buoyant force.",
    },
    {
      id: "sea",
      label: "Sea Water",
      description:
        "Sea Water raises the fluid density to 1025 kg/m³ and the depth to 3.0 m. The preset shows why saltier water creates slightly larger buoyant forces and pressure at the same depth.",
    },
    {
      id: "dense",
      label: "Dense Fluid",
      description:
        "Dense Fluid uses 1200 kg/m³, 4.0 m depth, and 120 kPa surface pressure. It combines denser fluid, deeper measurement, and extra surface pressure to produce a much larger pressure reading.",
    },
  ],

  contentSections: {
    whatIsIt:
      "A 250,000-ton oil tanker rides high in the harbor. A scuba diver feels different pressure at every depth. A hydraulic lift turns a foot tap into a multi-ton hoist. All three rely on a tiny set of rules for fluids at rest. Archimedes figured out the first in a bathtub: any immersed object feels a buoyant force equal to the weight of fluid it displaces. Less-dense objects float; denser ones sink while still feeling that upward push. Pascal added: pressure applied to an enclosed fluid transmits equally in all directions, so a small piston can lift a car balanced on a large one. The third rule is hydrostatic pressure: every meter of depth adds ρgh, which is why ears pop in the deep end. This lab lets you drop objects of different densities into different fluids and watch them float, sink, or settle.",
    parameterExplanations: {
      fluidDensity:
        "Fluid Density sets ρ in both P = P₀ + ρgh and F_b = ρgV. Fresh water is about 1000 kg/m³, sea water is a little denser, and heavy lab fluids can be denser still. Raising this slider makes each meter of depth add more pressure, so the color gradient darkens more strongly toward the bottom. It also increases the buoyant force on the orange sphere because the same displaced volume weighs more. Use Fresh Water as the baseline, Sea Water to test a small density change, and Dense Fluid to see the largest combined pressure and buoyancy effect.",
      totalDepth:
        "Total Depth sets the h value used for the pressure-at-depth readout. In an incompressible static fluid, gauge pressure grows linearly with depth: doubling h doubles the ρgh term when fluid density and surface pressure stay fixed. The tank also redraws taller or shorter, so students can connect the geometric depth they see with the numerical pressure value. Keep Fluid Density at 1000 kg/m³ and Surface Pressure at 101 kPa, then move only this slider to isolate the depth relationship. The Sea Water and Dense Fluid presets give quick deeper comparison cases.",
      surfacePressure:
        "Surface Pressure sets P₀, the pressure already acting on the top of the fluid before the weight of the fluid column is added. Normal atmospheric pressure is about 101 kPa, so the Fresh Water and Sea Water presets begin there. Increasing this slider adds the same extra pressure everywhere in the tank, which illustrates Pascal's principle: an applied pressure is transmitted through the fluid. It does not change the ρgh slope created by depth and density, but it raises the absolute pressure readout at every selected depth. Compare 101 kPa and 150 kPa while holding the other sliders steady.",
    },
    misconceptions: [
      {
        wrong:
          "Heavy things sink, light things float.",
        correct:
          "Density wins, not weight. A 250,000-ton ship floats; a 50-gram steel marble sinks. What matters is the average density of the object compared to the fluid's density. Hollow objects effectively lower their average density by enclosing air, which is the trick steel ships use.",
      },
      {
        wrong:
          "A fully submerged object feels more buoyant force the deeper it goes.",
        correct:
          "Buoyant force depends only on the volume of fluid displaced, not on depth. Once the object is fully submerged, F_b = ρ_fluid · g · V is the same at 1 m or 100 m down. What does change with depth is the surrounding pressure (P = P₀ + ρgh) — but that pressure squeezes the object equally from all sides and the net upward push (buoyancy) stays the same.",
      },
      {
        wrong:
          "Increasing surface pressure only affects the top layer of the fluid.",
        correct:
          "In a static enclosed fluid, an added surface pressure is transmitted throughout the fluid. The pressure at depth is P = P₀ + ρgh, so raising P₀ by 20 kPa raises the pressure readout at every depth by 20 kPa. The depth term still depends on ρ and h, but the whole pressure profile shifts upward together.",
      },
      {
        wrong:
          "Heat and temperature mean the same thing in fluids.",
        correct:
          "Temperature is the average kinetic energy per molecule (intensive); heat is energy transferred between systems (extensive). Two pools of water at the same temperature can hold very different total thermal energy depending on their volume. In the basic fluid statics here we treat density and pressure at fixed temperature, but if you heat a fluid, ρ drops and buoyancy changes — that's why hot air rises.",
      },
      {
        wrong:
          "Pressure inside a hydraulic press is the same as the input force, just transmitted.",
        correct:
          "Pressure is force per area. Pascal's law says the pressure transmits through the fluid uniformly — but the force on a piston equals pressure times that piston's area. Push 1 N on a 1 cm² piston (P = 10,000 Pa) and the fluid pushes 100 N on a 100 cm² piston. You traded distance for force, not magic — the small piston has to move 100 times farther.",
      },
    ],
    teacherUseCases: [
      "Depth-linearity lab: keep Fluid Density at 1000 kg/m³ and Surface Pressure at 101 kPa, then have students record pressure at several Total Depth values. They should graph pressure vs. depth and identify the constant ρg slope.",
      "Fresh vs. sea comparison: run Fresh Water and Sea Water back to back, then ask students to explain why the sea-water case gives slightly higher pressure and buoyant-force readings at similar depths.",
      "Pascal's principle check: hold Fluid Density and Total Depth constant while raising Surface Pressure from 101 kPa to 150 kPa. Students should predict and verify that the pressure-at-depth readout increases by the same 49 kPa.",
      "Dense-fluid case study: use the Dense Fluid preset, then have students separate which part of the larger pressure reading comes from density, which part comes from depth, and which part comes from surface pressure.",
      "AP free-response warmup: ask students to write P = P₀ + ρgh and F_b = ρgV before touching the controls, then use the sliders as evidence for how each variable changes pressure or buoyant force.",
    ],
    faq: [
      {
        question: "Why does a steel ship float when a steel ball sinks?",
        answer:
          "Average density. A solid steel ball is 7800 kg/m³ — denser than water (1000 kg/m³) — so it sinks. A hollow steel hull encloses a huge volume of air, dropping the ship's average density (mass/total volume including air space) below 1000 kg/m³. The total buoyant force from displacing 250,000 m³ of water is enough to support the ship's weight even when each individual steel plate alone would sink.",
      },
      {
        question: "Why do objects feel lighter underwater?",
        answer:
          "Because they really are pushed upward by the buoyant force. Apparent weight = true weight − buoyant force. A 10 kg rock has a true weight of 98 N in air. Submerge it in water and water displaces equal to its volume (say 4 L = 0.004 m³), giving F_b = 1000 × 9.8 × 0.004 = 39.2 N upward. Apparent weight underwater is only 58.8 N — about 60% of its weight in air.",
      },
      {
        question: "How does a hydraulic car lift work?",
        answer:
          "Pascal's law: pressure applied to an enclosed fluid transmits equally everywhere. Push down with force F₁ on a small piston of area A₁ — the fluid pressure P = F₁/A₁ acts on the larger piston of area A₂, producing output force F₂ = P · A₂ = F₁ · (A₂/A₁). With a 100:1 area ratio, a 100 N foot push can lift a 10,000 N car. Energy is still conserved: the small piston has to move 100 cm to lift the big piston by 1 cm.",
      },
      {
        question: "Why does pressure increase with depth in a fluid?",
        answer:
          "Because every layer of fluid above you has to be supported, and the only thing supporting it is the pressure of the fluid below. The hydrostatic formula P = P₀ + ρgh captures it: at depth h below the surface, the extra pressure is the weight per unit area of the column of fluid sitting on top. In water that's about 10⁴ Pa per meter, which is why ear-popping starts after just a meter or two of swimming pool depth.",
      },
      {
        question: "What's the connection between Pascal's law and Archimedes' principle?",
        answer:
          "Both come from hydrostatic pressure. Archimedes' principle is what you get when you integrate the depth-dependent pressure over an object's surface — the net upward push equals the weight of fluid displaced. Pascal's law is the statement that any extra pressure applied to an enclosed fluid adds uniformly everywhere. Together they cover most of static-fluid physics: buoyancy, hydraulics, dam design, and submarine ballast.",
      },
      {
        question: "How does this connect to AP Physics 2 standard 3.C.4?",
        answer:
          "AP Physics 2 3.C.4 asks students to apply Newton's laws to fluid systems, including buoyancy and hydrostatic pressure. NGSS HS-PS2-1 also expects students to use Newton's second law in force contexts. This lab focuses on static fluids: students can change density, depth, and surface pressure, then connect the numerical readouts to P = P₀ + ρgh and F_b = ρgV.",
      },
    ],
  },
};
