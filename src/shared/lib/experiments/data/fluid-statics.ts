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
      id: "objectDensity",
      label: "Object Density (ρ_obj)",
      unit: "kg/m³",
      min: 100,
      max: 3000,
      default: 800,
      step: 50,
      tier: "free",
    },
    {
      id: "fluidDensity",
      label: "Fluid Density (ρ_fluid)",
      unit: "kg/m³",
      min: 500,
      max: 2000,
      default: 1000,
      step: 50,
      tier: "free",
    },
    {
      id: "objectVolume",
      label: "Object Volume (V)",
      unit: "×10⁻³ m³",
      min: 0.1,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "pipeRatio",
      label: "Pipe Constriction Ratio (A₁/A₂)",
      unit: "",
      min: 1,
      max: 5,
      default: 2,
      step: 0.1,
      tier: "pro",
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
    "In buoyancy mode, adjust object and fluid densities. Watch the object sink, float, or rise. The net force display shows weight vs buoyancy. Switch to Bernoulli mode (Pro) to see how pipe constriction speeds up flow and drops pressure.",

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

  contentSections: {
    whatIsIt:
      "A 250,000-ton oil tanker rides high in the harbor. A scuba diver feels a different pressure on her ears at every depth. A hydraulic car lift turns a foot tap into a multi-ton hoist. All three rely on a tiny set of rules for fluids that aren't moving. Archimedes figured out the first one in a bathtub: any object immersed in a fluid feels a buoyant force equal to the weight of the fluid it pushes out of the way. Drop a less-dense object in and it floats. Drop a denser object in and it sinks while still feeling that upward buoyant push. Pascal added the second rule: pressure applied to an enclosed fluid transmits equally in all directions, which is why a 1-cm² piston pushed gently can lift a car balanced on a 100-cm² piston. The third rule is hydrostatic pressure: every meter of fluid depth adds ρgh of pressure on top of you, which is why your ears pop when you dive into the deep end and why dam walls have to be massively reinforced at the bottom. This lab lets you drop objects of different densities into different fluids, watch them float, sink, or settle in equilibrium, and switch into a Bernoulli flow mode to see how the same pressure ideas extend when the fluid starts moving. Once you can predict whether something floats and how deep it sits, you've cracked half of AP Physics 2 fluids.",
    parameterExplanations: {
      objectDensity:
        "Density of the dropped object in kg/m³. This is the deciding number for buoyancy. If ρ_obj < ρ_fluid the object floats with submerged fraction = ρ_obj/ρ_fluid (a 600 kg/m³ wood block in water sits 60% submerged). If ρ_obj > ρ_fluid it sinks. If they're equal the object hovers neutrally — divers achieve this with their buoyancy compensator vests.",
      fluidDensity:
        "Density of the surrounding fluid in kg/m³. Fresh water is 1000, sea water about 1025 (which is why you float higher in the ocean), light oil about 800, mercury 13,600. The buoyant force F_b = ρ_fluid · g · V_submerged scales linearly with fluid density, so the same boat floats higher in the saltier Dead Sea than in a freshwater lake.",
      objectVolume:
        "Total object volume in units of 10⁻³ m³ (i.e., liters). Buoyant force is ρ_fluid · g · V_submerged, so volume sets the maximum possible upward push when the object is fully submerged. Doubling the volume of a fully submerged object doubles the buoyant force — which is exactly the design trick a steel ship uses to float despite being made of dense steel.",
      pipeRatio:
        "Ratio of pipe areas (A₁/A₂) used in the Bernoulli flow mode. Larger ratio means the narrow section is much tighter, the fluid speeds up more drastically, and the pressure drop deepens. This is the same continuity-plus-Bernoulli logic from the Venturi lab — the fluid trades static pressure for kinetic energy as it accelerates through the constriction.",
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
          "Bernoulli's principle says fast-moving fluid pulls objects in.",
        correct:
          "Pressure drops where speed increases, but the net force on a nearby object always points from high pressure to low pressure. The fast region pushes back less, so surrounding fluid pushes objects toward it. There's no 'pulling' — just a pressure imbalance.",
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
      "Float-fraction prediction: have students predict the submerged fraction of wood blocks of various densities (300, 500, 700, 900 kg/m³) in fresh water before running the simulation. Anchor the rule fraction = ρ_obj/ρ_fluid and discuss why ice (ρ ≈ 917) sits so high in liquid water.",
      "Why ships float: assign students to compute the buoyant force on a 1 m³ block of solid steel (ρ ≈ 7800) and show it sinks. Then have them imagine the steel hammered into a thin-walled boat hull enclosing 100 m³ of air. Compare the average density and watch the same mass of steel float comfortably.",
      "Salt vs. fresh: have students float identical wooden blocks in fresh water (1000 kg/m³) and sea water (1025 kg/m³) and measure the change in submerged depth. Connect to why people float more easily in the Dead Sea (1240 kg/m³).",
      "Hydraulic-lift sketch: walk students through a 1:100 piston ratio. Calculate the input distance required to raise a car by 10 cm. Use the energy bookkeeping to show no work is created — input distance × input force = output distance × output force.",
      "Bernoulli bridge: switch into flow mode after the buoyancy section, run a constriction at ratio 2, and ask students to predict the pressure change. Connect the static-fluid Pascal/Archimedes arguments to the moving-fluid Bernoulli framework.",
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
        question: "How does this connect to AP Physics 2 standard 3.C.4 and to Bernoulli flow?",
        answer:
          "AP Physics 2 3.C.4 asks students to apply Newton's laws to fluid systems — including buoyancy, hydrostatic pressure, and the connection to flowing fluids via Bernoulli. NGSS HS-PS2-1 also expects students to use Newton's second law in fluid contexts. This lab pairs the static-fluid framework (Archimedes, Pascal, hydrostatic pressure) with a Bernoulli flow demo so students can see the full progression — from sitting fluids to moving ones — without switching apps.",
      },
    ],
  },
};
