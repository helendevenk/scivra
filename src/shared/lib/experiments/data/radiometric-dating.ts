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
      id: "isotopeIndex",
      label: "Isotope",
      unit: "",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "initialAtoms",
      label: "Initial Parent Atoms",
      unit: "",
      min: 50,
      max: 500,
      default: 200,
      step: 50,
      tier: "free",
    },
    {
      id: "speed",
      label: "Simulation Speed",
      unit: "x",
      min: 1,
      max: 10,
      default: 3,
      step: 1,
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
    "Select an isotope to see its half-life. Press 'Start Decay' to watch parent atoms (orange) transform into daughter atoms (blue). The decay curve plots the fraction remaining over time. Vertical dashed lines mark each half-life. Drag the time slider to jump to any point. The data panel calculates the age from the current parent/daughter ratio.",

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
  contentSections: {
    whatIsIt:
      "Radioactive decay is the process by which unstable atomic nuclei shed energy and transform into a different element at a rate set entirely by nuclear physics — not temperature, pressure, or chemistry. The time for exactly half the parent atoms in any sample to convert to daughter atoms is called the half-life, and it is a fixed constant for each isotope. Carbon-14 (half-life 5,730 years) works for organic remains up to about 50,000 years old; potassium-40 (1.25 billion years) dates ancient volcanic rocks; uranium-238 (4.47 billion years) reaches the oldest minerals on Earth and in meteorites. By measuring the parent-to-daughter ratio in a sample, geologists calculate age using the equation N(t) = N₀(1/2)^(t/T½). This simulation lets you choose an isotope, set the starting atom count, and watch the exponential decay curve build in real time.",
    parameterExplanations: {
      isotopeIndex:
        "Selects among three named isotopes (indices 0–2): C-14 (half-life 5,730 yr), K-40 (1.25 Gyr), and U-238 (4.47 Gyr). A fourth position (index 3) exists in the UI but corresponds to an unspecified isotope; content activities use only indices 0–2. Each isotope is useful for a specific age range of samples.",
      initialAtoms:
        "The number of parent atoms present at time zero, ranging from 50 to 500. A larger starting population shows the exponential curve more smoothly; a smaller one makes individual decay events more visible on the scatter display.",
      speed:
        "Simulation playback speed from 1× to 10×. Raise it to fast-forward through many half-lives; lower it to study the curve's shape as each decay event registers.",
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
      "Isotope selection comparison: have students set initialAtoms to 200 and run isotopeIndex values 0, 1, and 2 (C-14, K-40, U-238) at speed 5. Ask them to record how many simulation steps pass before less than 10% of parent atoms remain and translate each result into real years.",
      "Curve-shape prediction: before running, ask students to sketch what they expect the decay graph to look like at isotopeIndex 0. After running, compare the prediction to the exponential curve and discuss why it is never a straight line.",
      "Age calculation challenge: set isotopeIndex to 0 (C-14) and initialAtoms to 400. Pause when roughly 50 parent atoms remain and ask students to calculate the approximate age in years using N(t) = N₀(1/2)^(t/T½).",
      "Real-world tie-in: set isotopeIndex to 2 (U-238) and speed to 10. Tell students this isotope dated the oldest known Earth mineral (zircon crystal, ~4.4 Gyr). Discuss what it means for Earth's history that scientists can measure this.",
      "Half-life independence demo: run isotopeIndex 0 and 2 side by side at the same initialAtoms setting. Ask: 'Same starting count, same equation — why do the curves look stretched so differently on the time axis?' Connect answer to the Crosscutting Concept of Scale.",
    ],
    faq: [
      {
        question: "What does the decay equation N(t) = N₀(1/2)^(t/T½) actually mean?",
        answer:
          "N₀ is the number of parent atoms at the start, t is the time elapsed, and T½ is the half-life of the chosen isotope. Every time t increases by one half-life, the fraction remaining is multiplied by another 1/2. After 3 half-lives, (1/2)³ = 12.5% of the original atoms are left. The simulation plots this curve in real time.",
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
        question: "Does a larger initial atom count change the half-life?",
        answer:
          "No. The half-life is a property of the isotope's nucleus, not of sample size. A large sample just gives a smoother statistical curve. Whether you start with 50 or 500 atoms, half will decay per half-life — the curve's shape is the same, the scatter is different.",
      },
    ],
  },
};
