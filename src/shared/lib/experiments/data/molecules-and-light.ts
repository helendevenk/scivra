import type { Experiment } from "@/shared/types/experiment";

export const moleculesAndLight: Experiment = {
  id: "molecules-and-light",
  slug: "molecules-light-absorption-emission",
  title: "Molecules and Light",
  subtitle: "How molecules absorb and emit electromagnetic radiation",
  description:
    "Explore how different molecules interact with different types of electromagnetic radiation. Discover why CO₂ absorbs infrared (the greenhouse effect), why ozone blocks UV, and how microwave ovens heat water.",
  thumbnail: "/imgs/experiments/photoelectric-effect.png",

  standards: {
    ngss: ["HS-PS4-4", "HS-PS4-5", "HS-ESS2-4"],
    gcse: ["AQA P6.6", "AQA C7.4"],
    ap: ["MOD-1.C", "ENV-3.A"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["molecules", "electromagnetic radiation", "absorption", "greenhouse effect", "infrared", "UV", "molecular vibration"],
  difficulty: "intermediate",

  parameters: [
    { id: "molecule", label: "Molecule", unit: "", min: 0, max: 5, default: 0, step: 1, tier: "free" },
    { id: "radiation_type", label: "Radiation Type", unit: "", min: 0, max: 5, default: 0, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "E = hf = \\frac{hc}{\\lambda}", description: "Photon energy" },
    { latex: "\\Delta E_{vib} \\approx 0.1\\text{–}1\\text{ eV (IR)}", description: "Molecular vibration energy scale" },
  ],

  theory:
    "Molecules absorb electromagnetic radiation when the photon energy matches a transition in the molecule — vibrational transitions for IR, electronic transitions for UV/visible. CO₂ and H₂O absorb IR radiation (heat) because their bending and stretching modes match IR photon energies — the greenhouse effect. N₂ and O₂ are IR-transparent but UV-absorbing at higher energies. Ozone absorbs UV-B and UV-C, protecting life on Earth.",
  instructions:
    "Select a molecule from the menu. Choose a radiation type. If the molecule absorbs that radiation, watch it vibrate or rotate. The energy level diagram shows which transitions are available. Explore CO₂ + infrared to see the greenhouse effect in action.",
  challenges: [
    { id: "ml-c1", question: "Why does CO₂ absorb IR but not visible light?", hint: "CO₂ vibrational mode energies match IR photons (~0.1 eV); visible photons (~2 eV) can't excite these modes", tier: "free" },
    { id: "ml-c2", question: "Why are N₂ and O₂ transparent to infrared?", hint: "Symmetric diatomic molecules have no net dipole change during vibration — can't couple to IR field", tier: "free" },
    { id: "ml-c3", question: "How does a microwave oven work? What molecular motion is excited?", hint: "Microwaves match water rotational transitions (~10⁻³ eV), causing rapid rotation and friction heating", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["blackbody-spectrum", "em-spectrum", "photoelectric-effect"],

  seoTitle: "Molecules and Light — Absorption Simulation | AP Physics 2",
  seoKeywords: ["molecules and light", "infrared absorption", "greenhouse effect", "electromagnetic radiation", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Molecular Absorption, Greenhouse Effect, EM Radiation" },

  contentSections: {
    whatIsIt:
      "Every molecule is picky about which photons it grabs. A microwave oven heats leftover pizza but leaves the ceramic plate cool, sunlight passes through window glass but burns skin if it gets through ozone, and the CO₂ you exhale traps infrared on Earth. Those details all come from one rule: a molecule absorbs an electromagnetic wave only when the photon's energy matches an allowed jump — rotation, vibration, or electronic transition. Visible photons kick electrons into higher orbitals, infrared photons match bond stretches and bends, microwaves match water rotations. This lab lets you point each kind of radiation at six molecules — H₂O, CO₂, N₂, O₂, O₃, CH₄ — and watch in real time which ones light up, vibrate, or stay indifferent to the beam. Once you see which photon a molecule cares about, climate physics, atmospheric chemistry, and IR spectroscopy stop being separate topics.",
    parameterExplanations: {
      molecule:
        "Picks which gas you're shining light on. Choices include greenhouse gases (CO₂, H₂O, CH₄), the IR-transparent atmosphere (N₂, O₂), and ozone (O₃). The shape of the molecule matters: bent H₂O and asymmetric CO₂ stretches change the dipole during vibration, so they couple to IR. Symmetric N₂ and O₂ have no dipole change during their single stretch, so IR photons pass right through them.",
      radiation_type:
        "Selects the photon energy you're firing at the molecule, from microwave (≈10⁻³ eV) through IR (≈0.1 eV), visible (≈2 eV), UV (≈5–10 eV), and beyond. Each band targets a different kind of transition: microwaves rotate molecules, IR vibrates bonds, visible/UV moves electrons. Mismatch the energy and absolutely nothing happens — the photon is transmitted, not absorbed.",
    },
    misconceptions: [
      {
        wrong:
          "All gases absorb infrared radiation because IR is heat and heat warms gases.",
        correct:
          "Heat and IR are not the same thing. A photon is only absorbed when its energy matches a molecular transition. Symmetric diatomic molecules like N₂ and O₂ have no IR-active vibration, so they let IR pass through. CO₂ and H₂O do have IR-active modes, which is why they trap heat and the bulk of the atmosphere does not.",
      },
      {
        wrong:
          "Temperature and heat are interchangeable — a hotter object always has more heat.",
        correct:
          "Temperature measures the average kinetic energy per molecule (intensive); heat is the energy in transit from one system to another (extensive). A red-hot iron nail and a melting ice cube can carry very different amounts of thermal energy at very different temperatures. Photon absorption raises temperature only after the absorbed energy gets shared across many molecules.",
      },
      {
        wrong:
          "The greenhouse effect is entirely artificial and only harmful.",
        correct:
          "The natural greenhouse effect from H₂O and CO₂ keeps Earth roughly 33 K warmer than it would otherwise be — without it, the surface would freeze. The climate problem is the extra CO₂ and CH₄ humans have added since the industrial revolution, which strengthens IR absorption and shifts the equilibrium temperature upward.",
      },
      {
        wrong:
          "UV light is dangerous because it carries more heat than visible light.",
        correct:
          "UV is dangerous because each photon carries enough energy (≈3–10 eV) to break electronic and chemical bonds in DNA and skin. It is not hotter — your skin actually feels less heat from UV than from IR. The damage is photochemical, not thermal.",
      },
      {
        wrong:
          "A microwave oven heats food by sending out heat waves.",
        correct:
          "A 2.45 GHz microwave oven does not work by matching one discrete rotational energy level of water. Its alternating electric field drives polar molecules and ions in the food, and dielectric relaxation plus collisions convert that driven motion into thermal energy. The microwave field itself is not hot — the food heats because the material absorbs electromagnetic energy.",
      },
    ],
    teacherUseCases: [
      "Greenhouse-gas pre-lab: have students predict which of the six molecules will absorb IR before running the simulation. Use the IR result for CO₂ vs. N₂ to introduce why CO₂ is climate-relevant and N₂ is not, even though N₂ is 78% of the atmosphere.",
      "Symmetry argument: pair students up and ask one to draw the dipole moment of N₂ stretching vs. CO₂ asymmetric stretching. Use the simulation to confirm the rule that only vibrations that change the dipole couple to IR.",
      "Photon energy ladder: assign students to record which radiation type each molecule absorbs and order the transitions on a single eV scale. They should rediscover that microwave < IR < visible < UV in energy and that the targeted transition matches.",
      "Atmospheric window discussion: shine each radiation type at N₂ + O₂ together to show the visible-light atmospheric window — the reason daylight reaches the surface but a chunk of IR is trapped on the way out.",
      "Misconception probe: after the lab, ask students 'is a microwave oven hotter than sunlight?' Use the photon-energy ladder they built to push back on the everyday-language confusion between heat and photon energy.",
    ],
    faq: [
      {
        question: "Why does CO₂ absorb infrared but not visible light?",
        answer:
          "CO₂ has IR-active vibrational modes (asymmetric stretch ≈ 0.29 eV, bend ≈ 0.083 eV) that match infrared photon energies. Visible photons carry around 2 eV, far too much to lock into a vibration but not enough to push CO₂'s tightly held electrons to the next electronic level. So visible light is transmitted while IR is grabbed — that selectivity is the whole basis of the greenhouse effect.",
      },
      {
        question: "Why are nitrogen and oxygen transparent to infrared even though they are 99% of the atmosphere?",
        answer:
          "N₂ and O₂ are symmetric diatomic molecules. When they stretch, the electric dipole stays at zero, so an oscillating IR electric field has nothing to push or pull on. With no dipole change, no IR absorption, no greenhouse effect. That is why CO₂ and H₂O — which do change dipole when they vibrate — dominate the climate even though they are trace gases.",
      },
      {
        question: "How does a microwave oven heat water but not the plate?",
        answer:
          "Microwaves at 2.45 GHz carry photons with energy near the rotational transitions of liquid water. Water molecules absorb that radiation, rotate rapidly, and collide with their neighbors, converting rotational energy into thermal motion. Ceramic and glass plates have no matching rotational transition at that frequency and therefore stay cool — until heat conducts in from the food.",
      },
      {
        question: "Why does ozone block UV but not visible light?",
        answer:
          "Ozone (O₃) has electronic transitions whose energies fall in the UV-B and UV-C bands (≈ 4–6 eV). Photons with that energy are absorbed and dissociate ozone, which is why the stratospheric ozone layer is protective. Visible photons carry too little energy to drive those transitions, so the sky still looks bright even with ozone overhead.",
      },
      {
        question: "How does this connect to AP Physics 2 standards MOD-1.C and ENV-3.A?",
        answer:
          "AP Physics 2 MOD-1.C asks students to relate photon energy to wavelength using E = hf = hc/λ and to predict which transitions a given photon can drive. ENV-3.A asks students to use those transitions to explain the greenhouse effect and atmospheric absorption. NGSS HS-PS4-4 and HS-PS4-5 also expect students to analyze how matter absorbs and transmits electromagnetic radiation. This lab makes those abstract criteria concrete by letting students fire each photon band at six different molecules.",
      },
      {
        question: "Are temperature and heat the same thing in this experiment?",
        answer:
          "No, and that distinction is critical here. Temperature is the average kinetic energy per molecule and is intensive — it does not depend on how much stuff you have. Heat is the energy transferred between systems and is extensive. When CO₂ absorbs an IR photon, energy enters the gas; that absorbed energy raises temperature only after it gets distributed across many molecules through collisions. Photon absorption is a heat-transfer step; it is not a temperature itself.",
      },
    ],
  },
};
