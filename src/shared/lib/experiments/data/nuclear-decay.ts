import type { Experiment } from "@/shared/types/experiment";

export const nuclearDecay: Experiment = {
  id: "nuclear-decay",
  slug: "nuclear-decay-alpha-beta-gamma-half-life",
  title: "Nuclear Decay & Radioactivity",
  subtitle: "Visualize alpha, beta, and gamma decay with half-life calculations",
  description:
    "Select a decay mode and watch the nucleus transform in real time. The activity curve shows exponential decay of the sample while the daughter nuclide builds up. Adjust half-life and initial amount to predict remaining mass after any number of half-lives — essential for radiocarbon dating and nuclear medicine.",
  thumbnail: "/imgs/experiments/nuclear-decay.png",

  standards: {
    ngss: ["HS-PS1-8"],
    gcse: ["P4.1", "P4.2", "P4.3"],
    ap: ["MOD-2.A", "MOD-2.B", "MOD-2.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["nuclear decay", "radioactivity", "half-life", "alpha decay", "beta decay", "gamma radiation", "AP Physics 2", "carbon dating"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "decay_type",
      label: "Decay Type (0=α, 1=β⁻, 2=β⁺, 3=γ)",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "half_life",
      label: "Half-Life",
      unit: "years",
      min: 0.01,
      max: 10000,
      default: 100,
      step: 1,
      tier: "free",
    },
    {
      id: "initial_amount",
      label: "Initial Amount",
      unit: "g",
      min: 0.001,
      max: 1000,
      default: 100,
      step: 1,
      tier: "pro",
    },
    {
      id: "time_elapsed",
      label: "Time Elapsed",
      unit: "half-lives",
      min: 0,
      max: 10,
      default: 0,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "N(t) = N_0 \\left(\\frac{1}{2}\\right)^{t/T_{1/2}}",
      description: "Amount remaining after time t (half-life form)",
    },
    {
      latex: "N(t) = N_0 e^{-\\lambda t}",
      description: "Radioactive decay law with decay constant λ",
    },
    {
      latex: "\\lambda = \\frac{\\ln 2}{T_{1/2}}",
      description: "Relationship between decay constant and half-life",
    },
    {
      latex: "{}^A_Z X \\rightarrow {}^{A-4}_{Z-2}Y + {}^4_2\\text{He}",
      description: "Alpha decay: mass number −4, atomic number −2",
    },
  ],

  theory:
    "Radioactive decay is a spontaneous, random process governed by quantum mechanics — individual nuclei decay unpredictably, but large samples follow precise statistical laws. The decay constant λ gives the probability per unit time that a single nucleus decays. The half-life T½ is the time for exactly half the nuclei in a sample to decay, regardless of sample size. Alpha decay emits a helium-4 nucleus, reducing A by 4 and Z by 2. Beta-minus decay converts a neutron to a proton (Z increases by 1). Beta-plus decay converts a proton to a neutron (Z decreases by 1). Gamma emission releases energy without changing A or Z. These reactions conserve charge, mass-energy, and lepton number.",

  instructions:
    "Choose a decay type to see the nucleus diagram and the balanced decay equation. Set the half-life and press Play — watch the exponential decay curve build and the daughter nuclide count rise. Use the Time Elapsed slider (Pro) to jump to any point in the decay sequence. The table shows N(t), activity A(t), and fraction remaining at the current time.",

  challenges: [
    {
      id: "nd-c1",
      question: "After 3 half-lives, what fraction of the original sample remains?",
      hint: "After each half-life, half remains. Apply (½)³.",
      tier: "free",
    },
    {
      id: "nd-c2",
      question: "²³⁸₉₂U undergoes alpha decay. What are the mass number and atomic number of the daughter nucleus?",
      hint: "Alpha decay: A decreases by 4, Z decreases by 2.",
      tier: "free",
    },
    {
      id: "nd-c3",
      question: "Carbon-14 has a half-life of 5730 years. A sample contains only 25% of its original C-14. How old is it?",
      hint: "25% = (½)² means 2 half-lives have elapsed. Age = 2 × T½.",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["atomic-structure", "em-spectrum"],

  seoTitle: "Nuclear Decay & Radioactivity — Half-Life Simulation | Scivra",
  seoKeywords: [
    "nuclear decay simulation",
    "radioactive half-life",
    "alpha beta gamma decay",
    "carbon dating simulation",
    "AP Physics 2 nuclear",
    "radioactivity calculator",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Nuclear Decay and Radioactivity",
  },

  contentSections: {
    whatIsIt:
      "Every living thing on Earth contains a tiny fraction of carbon-14, an unstable isotope made by cosmic rays. While you're alive, you keep replenishing it. The moment you stop — when an organism dies or a tree is cut for a tool — the carbon-14 starts ticking down. Half is gone in 5,730 years, half of what's left another 5,730 years later, and so on. Measure how much remains and you've measured how long ago that thing died. That's radiocarbon dating, and the underlying physics is exactly what this simulation makes visible: spontaneous, random nuclear decay obeying a strict statistical law. Pick a decay mode (alpha, beta-minus, beta-plus, or gamma), set a half-life and an initial sample, and watch the activity curve fall by half each half-life as the daughter nuclide builds up. The same equations describe radon in basements, medical tracers in PET scans, and spent reactor fuel.",
    parameterExplanations: {
      decay_type:
        "Picks which decay channel the nucleus uses. 0 = alpha (emits a helium-4 nucleus, A drops by 4 and Z drops by 2). 1 = beta-minus (a neutron converts to a proton, electron, and antineutrino — Z goes up by 1, A unchanged). 2 = beta-plus (a proton converts to a neutron, positron, and neutrino — Z goes down by 1, A unchanged). 3 = gamma (the nucleus drops to a lower energy state by emitting a high-energy photon — A and Z both unchanged). The chosen mode sets which decay equation displays.",
      half_life:
        "The time T½ in years for half the unstable nuclei in the sample to decay. Half-life is intrinsic to the isotope: carbon-14 is 5,730 years, iodine-131 is 8 days, uranium-238 is 4.5 billion years. It's independent of how much you start with. The decay constant λ = ln(2)/T½ gives the probability per year that a single nucleus decays. Short half-life means high activity (lots of decays per second per gram); long half-life means slow, low-activity decay.",
      initial_amount:
        "The mass in grams of the radioactive sample at t=0. Doubling this doubles the activity (decays per second) but doesn't change the half-life — every gram decays at the same fractional rate. The amount remaining at time t is N(t) = N₀ × (½)^(t/T½). Use this to compute things like 'a 100 g cobalt-60 source after 21 years' or 'how much C-14 is left in a 50,000-year-old artifact.'",
      time_elapsed:
        "How many half-lives have passed, on the x-axis of the decay curve. After 1 half-life, 50% of the original sample remains. After 2, it's 25%. After 3, it's 12.5%. After 10 half-lives, you're down to less than 0.1% of the original — effectively gone. This is the variable students manipulate to predict how much of a given isotope is left after any specified time.",
    },
    misconceptions: [
      {
        wrong:
          "After one half-life the substance has lost half its mass.",
        correct:
          "Half-life is the time for half the *unstable parent nuclei* to decay, not the time for half the mass to disappear. Decay products still have mass — alpha particles are helium nuclei with mass, beta particles are electrons with mass, and the daughter nucleus carries most of the original mass. Total mass is essentially conserved (a tiny bit goes into kinetic energy via E=mc², but that's far less than 1% for typical decays).",
      },
      {
        wrong:
          "Alpha, beta, and gamma are different elements.",
        correct:
          "They're different *types of radiation*, not elements. Alpha radiation is a stream of helium-4 nuclei. Beta-minus radiation is a stream of high-energy electrons (beta-plus is positrons). Gamma radiation is high-energy photons (electromagnetic waves). All three come out of unstable nuclei but they're fundamentally different particles — different masses, different charges, different penetrating power. A piece of paper stops alphas; a sheet of aluminum stops betas; gammas need lead or thick concrete.",
      },
      {
        wrong:
          "After two half-lives, all of the substance is gone (half goes the first time, the other half goes the second time).",
        correct:
          "Half-life is fractional, not subtractive. After 1 half-life, 50% remains. After 2, half of that is gone — so 25% remains, not zero. After 3, 12.5%. The decay is exponential: N(t) = N₀ × (½)^(t/T½). Mathematically the sample never reaches exactly zero, though after 10 half-lives you've got less than 0.1% left, which is undetectable for most practical purposes.",
      },
      {
        wrong:
          "You can speed up or slow down radioactive decay by heating, cooling, or compressing the sample.",
        correct:
          "Decay rates are essentially independent of temperature, pressure, chemical environment, and physical state. The decay is a quantum process happening inside the nucleus, completely shielded from the outside world by the electron cloud and chemistry. There are tiny exceptions (electron capture rates change microscopically with chemistry) but for AP-level work treat half-life as a fixed property of the isotope. That's exactly why carbon dating works — the C-14 clock runs the same in bone, charcoal, or seashell.",
      },
    ],
    teacherUseCases: [
      "Radiocarbon dating problem set: have students compute the age of a sample given fraction of C-14 remaining (e.g., 25% left → 2 half-lives → 11,460 years). The simulation lets them verify by setting time_elapsed and reading the curve.",
      "Decay-mode prediction: pair this with the Build a Nucleus experiment — students propose what kind of decay an unstable isotope should undergo (alpha for heavy, beta-minus for neutron-rich, etc.), then run nuclear-decay to see the equation balanced.",
      "Activity vs. dose discussion: a kilogram of uranium-238 has tiny activity because of its 4.5-billion-year half-life. A microgram of polonium-210 (138-day half-life) has huge activity. Students compare the two and connect activity to half-life via A = λN.",
      "Half-life data table: have students record the number of remaining nuclei at t = 1, 2, 3, and 4 half-lives, plot the (t, N) pairs on semi-log paper, and verify both the exponential decay curve and that the slope corresponds to λ = ln(2)/T½. With small samples (10 atoms) the curve is jagged; with huge samples (10²⁰ atoms) it's smooth — connect that contrast to the law of large numbers.",
      "Medical isotope walkthrough: technetium-99m (6 hours) is used in 30 million scans per year. Iodine-131 (8 days) treats thyroid disease. Discuss why short half-lives are wanted for medical use (no long-term contamination) and long ones for dating (slow ticking clock).",
    ],
    faq: [
      {
        question: "Why is radioactive decay random for a single atom but predictable for a sample?",
        answer:
          "Each individual nucleus has a fixed probability per second of decaying, but you can't predict *when* a particular one will go — it's a fundamentally quantum random event. The decay constant λ describes that per-atom probability. With 10²⁰ atoms in a typical sample, the law of large numbers kicks in: even though each atom is unpredictable, the *fraction* that decays in any given interval is essentially fixed. That's how N(t) = N₀ e^(−λt) emerges from individual quantum coin flips.",
      },
      {
        question: "What's the difference between half-life and mean lifetime?",
        answer:
          "Half-life T½ is the time for half the sample to decay — convenient for calculating things in 'how many half-lives have passed' terms. Mean lifetime τ = 1/λ is the average time a single nucleus survives before decaying. They're related by τ = T½/ln(2) ≈ 1.44 × T½, so the mean lifetime is always a bit longer than the half-life. Both are valid ways to characterize the decay; physicists often prefer τ, while textbooks and intro problems use T½.",
      },
      {
        question: "Why does alpha decay reduce A by 4 and Z by 2?",
        answer:
          "Because the emitted alpha particle is a helium-4 nucleus: 2 protons + 2 neutrons. Conservation of nucleons says the daughter has 4 fewer total nucleons (A drops by 4), and conservation of charge says the daughter has 2 fewer protons (Z drops by 2). The classic example is uranium-238 → thorium-234 + alpha. Both nucleon number and charge balance perfectly across the equation.",
      },
      {
        question: "Why do beta-minus and beta-plus produce different particles?",
        answer:
          "Beta-minus happens in neutron-heavy nuclei — a neutron converts to a proton plus an electron plus an electron antineutrino. The electron flies out as the beta particle. Beta-plus happens in proton-heavy nuclei — a proton converts to a neutron plus a positron (antielectron) plus a neutrino. Energetically beta-plus is harder to drive (you need at least 1.022 MeV of available energy to make the positron), which is why some isotopes can only do electron capture instead.",
      },
      {
        question: "How does this connect to AP Physics 2 MOD-2.A through MOD-2.C?",
        answer:
          "MOD-2.A covers the structure of unstable nuclei. MOD-2.B asks students to write balanced nuclear equations for alpha, beta, and gamma decay — exactly what the simulation displays for each chosen decay mode. MOD-2.C extends to the exponential decay law and half-life calculations, which is the entire activity curve here. Together these three standards are the AP nuclear-decay unit, and this simulation is built to walk through them.",
      },
    ],
  },
};
