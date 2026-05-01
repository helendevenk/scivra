import type { Experiment } from "@/shared/types/experiment";

export const resistanceWire: Experiment = {
  id: "resistance-wire",
  slug: "resistance-wire-lab",
  title: "Resistance in a Wire",
  subtitle: "Explore how length, area, and material affect resistance",
  description:
    "Measure resistance of wires with different lengths, cross-sectional areas, and materials. Verify the resistance equation R = ρL/A and compare resistivity values for common metals.",
  thumbnail: "/imgs/experiments/dc-circuits.png",

  standards: {
    ngss: ["HS-PS3-2"],
    gcse: ["AQA P2.3"],
    ap: ["CHA-2.A", "CHA-2.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["resistance", "resistivity", "wire", "length", "cross-section", "Ohm's law"],
  difficulty: "intermediate",

  parameters: [
    { id: "length", label: "Wire Length", unit: "m", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "diameter", label: "Wire Diameter", unit: "mm", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "material", label: "Material", unit: "", min: 0, max: 4, default: 0, step: 1, tier: "free" },
    { id: "temperature", label: "Temperature", unit: "°C", min: -100, max: 500, default: 20, step: 5, tier: "pro" },
  ],

  formulas: [
    { latex: "R = \\rho\\frac{L}{A}", description: "Resistance equation" },
    { latex: "A = \\pi r^2 = \\frac{\\pi d^2}{4}", description: "Cross-sectional area" },
    { latex: "\\rho(T) = \\rho_0[1 + \\alpha(T - T_0)]", description: "Resistivity temperature dependence" },
  ],

  theory:
    "Resistance depends on the material's resistivity ρ (intrinsic property), wire length L, and cross-sectional area A: R = ρL/A. Longer wire = more resistance (more collisions). Thicker wire = less resistance (more paths for electrons). Resistivity varies by material (copper: 1.7×10⁻⁸ Ω·m; nichrome: 100×10⁻⁸ Ω·m) and increases with temperature for metals. This explains why heating elements use nichrome wire.",
  instructions:
    "Select a wire material. Adjust length and diameter using the sliders. The ohmmeter reads resistance in real time. Plot R vs L (constant A) to verify the linear relationship. Change diameter to verify R ∝ 1/A. Change material to compare resistivities.",
  challenges: [
    { id: "rw-c1", question: "A 1m copper wire (d=1mm) has resistance 0.022Ω. What is R for a 3m, 0.5mm copper wire?", hint: "R ∝ L/A; new R = 0.022 × (3/1) × (1²/0.5²) = 0.022 × 3 × 4 = 0.264Ω", tier: "free" },
    { id: "rw-c2", question: "Why is nichrome used in toasters instead of copper?", hint: "Nichrome has much higher resistivity → more resistance → more heat generated per meter", tier: "free" },
    { id: "rw-c3", question: "How does resistance change when a wire heats up in a toaster?", hint: "R = ρ₀[1+α(T−T₀)]L/A; resistivity increases with T → R increases → slightly less current flows", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["ohms-law", "dc-circuits-basic", "circuit-dc-virtual-lab"],

  seoTitle: "Resistance in a Wire Lab | R = ρL/A | AP Physics 2",
  seoKeywords: ["resistance wire", "resistivity", "R=rho*L/A", "wire resistance", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Wire Resistance, Resistivity, R = ρL/A" },

  contentSections: {
    whatIsIt:
      "Look inside a toaster and you see a coil of dull gray wire glowing red — that wire is engineered to resist current and dump energy as heat. Look inside the wall and you see fat bundles of shiny copper engineered to do the opposite: carry current with as little resistance as possible. Same physics, different design choices, all governed by R = ρL/A. The resistance of any wire is set by three things: the material's intrinsic resistivity ρ, how long the wire is, and how thick its cross-section is. Stretch a wire and resistance grows linearly; fatten it and resistance shrinks as 1/diameter²; swap copper for nichrome and resistance jumps by a factor of 60 even at the same shape. In the lab below, you control all three knobs plus temperature and watch the ohmmeter respond.",
    parameterExplanations: {
      length:
        "The total length of the wire in meters. Resistance is directly proportional to length — twice the wire means twice as many electron collisions to fight through, so R doubles when L doubles at fixed thickness and material.",
      diameter:
        "The wire's diameter in millimeters. Cross-sectional area scales as d²/4, so resistance falls as 1/d². A 2 mm wire has a quarter the resistance of a 1 mm wire of the same length and material — that is why thick gauges are used for high-current loads.",
      material:
        "Selects which metal the wire is made from. Each material has its own resistivity ρ in Ω·m: copper and silver are excellent conductors, aluminum is decent, iron is mediocre, and nichrome is intentionally bad — perfect for heating elements where you want resistance, not conduction.",
      temperature:
        "The wire's temperature in degrees Celsius (Pro tier). For metals, resistivity rises roughly linearly with temperature: ρ(T) = ρ₀[1 + α(T − T₀)]. Heat a copper wire from 20°C to 200°C and its resistance climbs around 70%, which matters for incandescent bulbs and motor windings.",
    },
    misconceptions: [
      {
        wrong:
          "Resistance is a property of the wire's material, so once you pick copper you know R.",
        correct:
          "Material gives you resistivity ρ, not resistance R. To get R you also need length and area: R = ρL/A. A 1 cm copper wire and a 1 km copper wire have wildly different resistances, even though their resistivity is identical.",
      },
      {
        wrong:
          "A thicker wire has more resistance because there's more metal in the way.",
        correct:
          "Thicker wire has lower resistance because it gives electrons more parallel lanes to drift through. Cross-sectional area sits in the denominator: R = ρL/A. Doubling the diameter quadruples A and quarters R.",
      },
      {
        wrong:
          "Resistivity and resistance are just two words for the same thing.",
        correct:
          "Resistivity ρ is an intrinsic material property in Ω·m and doesn't depend on shape. Resistance R is the property of a specific wire and depends on ρ, length, and area. You can change R by cutting the wire shorter; you can't change ρ without changing materials.",
      },
      {
        wrong:
          "Heating a metal wire lowers its resistance because the electrons move faster.",
        correct:
          "For ordinary metals, heating raises resistance. Electrons do gain thermal energy, but the lattice atoms vibrate more violently and scatter the drifting electrons more often. The net effect is that resistivity climbs roughly linearly with temperature for copper, aluminum, and most metals — the opposite is true for semiconductors.",
      },
    ],
    teacherUseCases: [
      "Have students record resistance at five lengths with material and diameter fixed, then plot R vs L and extract ρ from the slope using R = (ρ/A)·L.",
      "Pair experiment: one student varies diameter at fixed length, the other varies length at fixed diameter. Combine results to verify R ∝ L and R ∝ 1/A independently.",
      "Materials comparison: students measure R for the same length and diameter across all five metals, rank them, and predict which would work as a toaster element vs a power line.",
      "Misconception probe: ask 'will doubling the wire's diameter cut R in half?' before they move the slider — the 1/d² answer surprises a lot of students.",
      "Engineering tie-in: give students a target heater resistance (say, 11 Ω at 20°C) and have them choose material, length, and diameter to hit it within 5% in the simulation.",
    ],
    faq: [
      {
        question: "Why does length matter for resistance but not for the speed of electrons?",
        answer:
          "Drift speed depends on the electric field, which is voltage per length: E = V/L. In a longer wire at the same voltage the field is weaker, electrons drift slower, and the same current squeezes through. The ohmmeter sees that as more resistance: R = ρL/A. Make the wire longer and either current drops or voltage must rise to keep current the same.",
      },
      {
        question: "Why is nichrome used for heater elements instead of copper?",
        answer:
          "Nichrome's resistivity is about 60 times copper's, so a short, thin nichrome wire can have meaningful resistance and dissipate serious power as heat. Copper would either need to be impossibly long and thin to reach the same R, or would carry so much current at low resistance that the rest of the circuit would overheat. Nichrome also tolerates red-hot temperatures without oxidizing badly.",
      },
      {
        question: "Does the resistance equation R = ρL/A work for non-cylindrical wires?",
        answer:
          "Yes, as long as the cross-section is uniform along the length and current flows straight through. A rectangular bus bar uses A = width × thickness; a cylindrical wire uses A = π(d/2)². For tapered or irregular shapes you have to integrate, but AP Physics 2 sticks to uniform cylinders where R = ρL/(π·d²/4).",
      },
      {
        question: "How does this lab map to AP Physics 2 standards CHA-2.A and CHA-2.C?",
        answer:
          "CHA-2.A asks students to model current and resistance in DC circuits, including how a resistor's value combines with voltage to set the current via V = IR. CHA-2.C extends that to relate the resistance of a wire to its length, cross-sectional area, and resistivity. Sliding length, diameter, and material in this lab while watching the ohmmeter respond is the exact reasoning the AP exam tests when it asks 'how does R change if you halve the diameter and double the length?' on quantitative free-response questions.",
      },
      {
        question: "Why do the lights in a house flicker when a big appliance turns on?",
        answer:
          "House wiring has small but nonzero resistance, set by R = ρL/A for the runs from the panel to your outlet. When a big load (vacuum, AC compressor) suddenly draws lots of current, the I·R drop across that wire eats into the voltage delivered to nearby outlets, dimming the lights for a moment. Thicker wire and shorter runs reduce the effect.",
      },
    ],
  },
};
