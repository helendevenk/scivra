import type { Experiment } from "@/shared/types/experiment";

export const radiometricDating: Experiment = {
  id: "radiometric-dating",
  slug: "radiometric-dating",
  title: "Radiometric Dating",
  subtitle: "Exponential decay and half-life in geological dating",
  description:
    "Explore how radioactive isotopes decay over time and how scientists use half-lives to determine the age of rocks and fossils. Select different isotopes (C-14, K-40, U-238), watch atoms decay in real time, and read the decay curve. Calculate ages from parent/daughter ratios.",
  thumbnail: "/imgs/experiments/radiometric-dating.png",

  standards: {
    ngss: ["HS-ESS1-6", "HS-PS1-8"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "9-12",
  tags: [
    "radiometric dating",
    "half-life",
    "radioactive decay",
    "isotopes",
    "geochronology",
    "Earth Science",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "parentRemaining",
      label: "Parent Atoms Remaining",
      unit: "%",
      min: 0,
      max: 100,
      default: 100,
      step: 1,
      tier: "free",
    },
    {
      id: "simulationSpeed",
      label: "Simulation Speed",
      unit: "×",
      min: 0.1,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "N(t) = N_0 \\left(\\frac{1}{2}\\right)^{t/t_{1/2}}",
      description:
        "Number of parent atoms remaining: N₀ = initial count, t = elapsed time, t₁/₂ = half-life",
    },
    {
      latex: "t = t_{1/2} \\cdot \\frac{\\ln(N_0/N)}{\\ln 2}",
      description:
        "Age calculation from parent/daughter ratio: rearranged decay equation",
    },
  ],

  theory:
    "Radioactive isotopes decay at a constant rate characterized by their half-life — the time for half the parent atoms to convert to daughter atoms. After 1 half-life, 50% remain; after 2, 25%; after 3, 12.5%. This exponential decay follows N(t) = N₀ × (1/2)^(t/t₁/₂). Different isotopes have vastly different half-lives: C-14 (5,730 years, good for organic remains up to ~50,000 years), K-40 (1.25 billion years, for ancient rocks), U-238 (4.47 billion years, for the oldest rocks and meteorites). By measuring the ratio of parent to daughter isotopes in a sample, geologists calculate its age.",

  instructions:
    "Pick an isotope preset (C-14, K-40, or U-238) to set the half-life of the simulated decay. Drag the Parent Atoms Remaining slider to jump to any point in the decay curve, or use Simulation Speed to fast-forward through many half-lives and watch the exponential drop in real time.",

  challenges: [
    {
      id: "rd-c1",
      question: "A sample has 25% parent atoms remaining. How many half-lives have passed?",
      hint: "After 1 half-life: 50%. After 2 half-lives: 25%. Answer: 2 half-lives.",
      tier: "free",
    },
    {
      id: "rd-c2",
      question: "A bone has 12.5% of its original C-14. How old is it? (t₁/₂ = 5,730 yr)",
      hint: "12.5% = (1/2)³ → 3 half-lives. Age = 3 × 5,730 = 17,190 years.",
      tier: "free",
    },
    {
      id: "rd-c3",
      question: "Why can't C-14 dating be used for a 100-million-year-old dinosaur bone?",
      hint: "After ~10 half-lives (~57,300 years), virtually all C-14 has decayed to undetectable levels. For very old samples, use K-40 or U-238 with billion-year half-lives.",
      tier: "pro",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["greenhouse-effect", "rock-cycle"],
  htmlPath: "/experiments/earth-science/radiometric-dating.html",

  seoTitle: "Radiometric Dating Simulation | Scivra Earth Science",
  seoKeywords: [
    "radiometric dating simulation",
    "half-life interactive",
    "radioactive decay visualizer",
    "isotope dating calculator",
    "Earth Science geochronology",
    "carbon-14 dating lab",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Radiometric Dating and Half-Life",
  },
  htmlControlAliases: {
    parentRemaining: "parentSlider",
    simulationSpeed: "decaySlider",
  },
  presets: [
    {
      id: "c14",
      label: "Carbon-14 (5,730 yr half-life)",
      description:
        "C-14 has a half-life of 5,730 years and is the standard tool for dating organic remains up to about 50,000 years old. Living organisms maintain a known atmospheric ratio of ¹⁴C/¹²C, so once they die, the steady drop in remaining C-14 reveals the time since death.",
    },
    {
      id: "k40",
      label: "Potassium-40 (1.25 Gyr half-life)",
      description:
        "K-40 has a half-life of 1.25 billion years and decays in part to argon-40 trapped in mineral crystals. It is the workhorse isotope for dating ancient volcanic rocks, layered ash beds, and many of the oldest hominin fossil sites.",
    },
    {
      id: "u238",
      label: "Uranium-238 (4.47 Gyr half-life)",
      description:
        "U-238 has a half-life of 4.47 billion years — comparable to the age of the Earth itself — and decays through a long chain ending in lead-206. It is used to date the oldest known terrestrial minerals and meteorites that record the early solar system.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Radioactive decay is the process by which unstable atomic nuclei shed energy and transform into a different element at a rate set entirely by nuclear physics — not temperature, pressure, or chemistry. The time for exactly half the parent atoms in any sample to convert to daughter atoms is called the half-life, and it is a fixed constant for each isotope. Carbon-14 (half-life 5,730 years) works for organic remains up to about 50,000 years old; potassium-40 (1.25 billion years) dates ancient volcanic rocks; uranium-238 (4.47 billion years) reaches the oldest minerals on Earth and in meteorites. By measuring the parent-to-daughter ratio in a sample, geologists calculate age using the equation N(t) = N₀(1/2)^(t/T½). This simulation lets you choose an isotope preset, drag the Parent Atoms Remaining slider to any point in the decay curve, and adjust the Simulation Speed to fast-forward through many half-lives.",
    parameterExplanations: {
      parentRemaining:
        "Parent Atoms Remaining is the percentage of the original radioactive parent isotope that has NOT yet decayed, on a scale of 0% (fully decayed) to 100% (fresh sample, no decay yet). Each half-life cuts this value in half: 100% → 50% → 25% → 12.5% → 6.25%. Drag the slider to jump to any point in the decay curve — the simulation instantly shows the corresponding age in real years for the currently selected isotope preset. Combined with the C-14, K-40, and U-238 presets, this slider lets students explore how the same percentage maps to vastly different real ages depending on which isotope is being measured.",
      simulationSpeed:
        "Simulation Speed controls how fast time advances in the visual decay animation, from 0.1× (very slow, every individual decay event is visible) up to 5× (rapid, the curve fills out in seconds). Speed does NOT change the underlying half-life — that is a property of the isotope's nucleus and is set by the chosen preset. Use slow speeds to study the random nature of individual decay events on the scatter display, then raise the speed to watch the exponential curve build smoothly across multiple half-lives. This separation between visual playback rate and physical decay rate is a useful place to address the misconception that environment can change radioactive decay timing.",
    },
    misconceptions: [
      {
        wrong:
          "Carbon-14 can be used to date dinosaur bones that are 65 million years old.",
        correct:
          "C-14's half-life is only 5,730 years. After about 10 half-lives (~57,300 years) essentially no C-14 remains — far too little to measure. For million- or billion-year-old specimens, scientists use K-40 (1.25 Gyr) or U-238 (4.47 Gyr).",
      },
      {
        wrong:
          "After exactly one half-life, all the radioactive atoms have decayed.",
        correct:
          "After one half-life exactly half remain. The other half has decayed. This halving continues every half-life: 50% → 25% → 12.5% — it is an exponential curve, not a countdown to zero.",
      },
      {
        wrong:
          "Heating a rock in a volcano would speed up radioactive decay and make the sample seem older.",
        correct:
          "Nuclear decay rates are determined by quantum tunneling inside the nucleus and are completely independent of temperature, pressure, or chemical environment. That constancy is precisely why radiometric dating works.",
      },
      {
        wrong:
          "If a sample has 50% parent atoms left, it must be exactly one half-life old, no matter which isotope you use.",
        correct:
          "50% parent remaining always means one half-life has elapsed, but the actual time that represents depends entirely on the isotope: one half-life of C-14 is 5,730 years, while one half-life of U-238 is 4.47 billion years.",
      },
    ],
    teacherUseCases: [
      "Same percentage, different ages: have students set Parent Atoms Remaining to 50% and cycle through the C-14, K-40, and U-238 presets, recording the displayed real-world age for each. The same fraction maps to 5,730 yr / 1.25 Gyr / 4.47 Gyr — a powerful illustration of why isotope choice matters (HS-ESS1-6).",
      "Curve-shape prediction: with the C-14 preset selected, ask students to sketch the expected decay curve before running. Drop Simulation Speed to 0.5× and let the simulation play through several half-lives; compare the prediction to the actual exponential and discuss why the curve is never linear.",
      "Age calculation challenge: select the C-14 preset and drag Parent Atoms Remaining to 12.5%. Ask students to compute the age by recognizing 12.5% = (1/2)³, giving 3 half-lives × 5,730 yr ≈ 17,190 yr. Repeat with the K-40 preset to practice scaling the same calculation across nine orders of magnitude.",
      "Real-world tie-in: select the U-238 preset and set Simulation Speed to 5×. Tell students this isotope dated the oldest known Earth mineral (zircon crystal, ~4.4 Gyr). Discuss what it means for Earth's history that scientists can directly measure this — supporting HS-PS1-8.",
      "Independence of environment: with any preset selected, vary Simulation Speed and ask whether changing it would correspond to actually heating, pressurizing, or chemically treating the sample. Use the answer (no — visual speed is decoupled from physical decay rate) to confront the misconception that environment can accelerate radioactive decay.",
    ],
    faq: [
      {
        question: "What does the decay equation N(t) = N₀(1/2)^(t/T½) actually mean?",
        answer:
          "N₀ is the number of parent atoms at the start, t is the time elapsed, and T½ is the half-life of the chosen isotope. Every time t increases by one half-life, the fraction remaining is multiplied by another 1/2. After 3 half-lives, (1/2)³ = 12.5% of the original atoms are left. The simulation plots this curve in real time and updates whenever you drag the Parent Atoms Remaining slider.",
      },
      {
        question: "How do geologists know how many parent atoms there were originally?",
        answer:
          "For C-14, living organisms continuously absorb carbon from the atmosphere, maintaining a known ¹⁴C/¹²C ratio. At death, intake stops and the ratio drops. For K-40 and U-238, the daughter product (argon-40 or lead-206) accumulates within the same crystal lattice and can be measured directly alongside the parent, giving the original total as parent + daughter.",
      },
      {
        question: "Why can radiometric dating give two different ages for the same rock depending on which isotope is used?",
        answer:
          "Different isotope systems can be reset by different geological events. For example, argon can escape from a mineral if it is melted or metamorphosed, resetting the K-40 clock to zero while the U-238 clock may record an earlier age. When two systems agree, the date is considered reliable; discordance is a clue that the rock experienced a later heating event.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "The primary standard is HS-ESS1-6 (apply scientific reasoning and evidence from ancient Earth materials to construct an account of Earth's formation and early history) and HS-PS1-8 (develop models to illustrate the changes in the composition of the nucleus of the atom and the energy released during the processes of fission, fusion, and radioactive decay). The experiment targets both by quantifying decay with the half-life equation and tying measured ages to Earth's 4.54-billion-year history.",
      },
      {
        question: "Does the simulation speed change the half-life?",
        answer:
          "No. The half-life is a property of the isotope's nucleus and is set by the chosen preset, not by playback rate. Simulation Speed only changes how quickly time advances on screen — useful for watching slow isotopes like U-238 build a recognizable curve in seconds rather than billions of years. Whether you raise speed or slow it down, half the parent atoms still decay every half-life.",
      },
    ],
  },
};
