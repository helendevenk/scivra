import type { Experiment } from "@/shared/types/experiment";

export const buildANucleus: Experiment = {
  id: "build-a-nucleus",
  slug: "build-a-nucleus-simulation",
  title: "Build a Nucleus",
  subtitle: "Assemble protons and neutrons to explore nuclear stability",
  description:
    "Add protons and neutrons to an atomic nucleus and observe stability, binding energy, and radioactive decay. Explore the nuclear force, isotopes, and the valley of stability.",
  thumbnail: "/imgs/experiments/nuclear-decay.png",

  standards: {
    ngss: ["HS-PS1-8", "HS-PS4-2"],
    gcse: ["AQA P7.2", "AQA P7.3"],
    ap: ["MOD-3.A", "MOD-3.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["nuclear physics", "protons", "neutrons", "isotopes", "binding energy", "radioactive decay", "stability"],
  difficulty: "intermediate",

  parameters: [
    { id: "protons", label: "Protons (Z)", unit: "", min: 1, max: 118, default: 1, step: 1, tier: "free" },
    { id: "neutrons", label: "Neutrons (N)", unit: "", min: 0, max: 170, default: 0, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "BE = \\left[Z m_p + N m_n - M\\right]c^2", description: "Binding energy" },
    { latex: "BE/A", description: "Binding energy per nucleon" },
    { latex: "{}^A_Z X", description: "Nuclide notation" },
  ],

  theory:
    "Atomic nuclei are held together by the strong nuclear force, which overcomes electromagnetic repulsion between protons. Stability depends on the neutron-to-proton ratio. Too many or too few neutrons lead to radioactive decay. Binding energy per nucleon peaks near iron-56, explaining why fusion releases energy for light elements and fission releases energy for heavy elements.",
  instructions:
    "Click to add protons (red) and neutrons (blue) to the nucleus. Watch the stability indicator and binding energy chart. Unstable nuclei show the predicted decay mode (alpha, beta+, beta−, or gamma).",
  challenges: [
    { id: "bn-c1", question: "How many neutrons does carbon-12 have? Is it stable?", hint: "Z=6 for carbon; neutrons = 12−6 = 6", tier: "free" },
    { id: "bn-c2", question: "What happens when you add a neutron to make carbon-13 vs carbon-14?", hint: "Carbon-13 is stable; carbon-14 undergoes beta decay", tier: "free" },
    { id: "bn-c3", question: "Why does iron-56 have the highest binding energy per nucleon?", hint: "It sits at the optimal balance of nuclear force vs. Coulomb repulsion", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["nuclear-decay", "rutherford-scattering", "models-hydrogen-atom"],

  seoTitle: "Build a Nucleus Simulation | Nuclear Stability | AP Physics 2",
  seoKeywords: ["nuclear physics", "build a nucleus", "isotopes", "binding energy", "radioactive decay", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Nuclear Physics, Isotopes, Binding Energy" },

  contentSections: {
    whatIsIt:
      "Pick up a proton, drop it into the nucleus. Add another, then a third. Now start adding neutrons. Watch the stability indicator: too few neutrons and the protons repel each other apart, too many and the imbalance triggers beta decay. Hit the sweet spot and you've assembled a stable isotope that would sit on a shelf forever. This is the geography of nuclear matter — every dot on a chart of nuclides is a different combination of protons (Z) and neutrons (N), and only a thin band running through the middle of that chart is actually stable. Light nuclei prefer roughly equal numbers of each, but as Z climbs above 20 the neutron count has to outpace the proton count to dilute the proton-proton repulsion. Past lead (Z=82) nothing is truly stable. The simulation lets you walk that landscape, build any isotope from hydrogen-1 to oganesson, and predict whether you've made something that lives forever or something that will spit out a particle within seconds.",
    parameterExplanations: {
      protons:
        "The number of protons (Z) defines what element you're building — 1 is hydrogen, 6 is carbon, 26 is iron, 79 is gold, 92 is uranium. Each proton you add increases Coulomb repulsion against every other proton, so heavier elements are harder to hold together. The strong nuclear force, which binds all nucleons, is short-range and roughly the same per pair regardless of charge — that's why piling on protons eventually wins out and forces the nucleus to either eject something or fly apart.",
      neutrons:
        "Neutrons (N) are the glue that lets you fit lots of protons together. They feel the strong force just like protons do but carry no electric charge, so they add binding without adding repulsion. The mass number A = Z + N tells you which isotope you've built — carbon-12 is Z=6, N=6; carbon-14 is Z=6, N=8. Adding neutrons past the stable ratio causes beta-minus decay (a neutron flips into a proton and spits out an electron); too few causes beta-plus decay or proton emission.",
    },
    misconceptions: [
      {
        wrong:
          "Atoms are mostly empty space because the nucleus is hollow.",
        correct:
          "The nucleus itself is incredibly dense — packed solid with nucleons that nearly touch. The 'mostly empty space' phrase refers to the whole atom: the nucleus is roughly 1/100,000 the diameter of the atom, with the electron cloud filling the rest. If you scaled an atom to the size of a sports stadium, the nucleus would be a marble at the center. Inside that marble there's no empty space at all.",
      },
      {
        wrong:
          "Adding more protons always makes the nucleus more stable because more particles means more strong-force binding.",
        correct:
          "Strong-force binding is short-range — each nucleon only interacts with its neighbors. Coulomb repulsion is long-range — every proton pushes on every other proton through the entire nucleus. So as Z grows, repulsion grows faster than binding. That's why binding energy per nucleon peaks near iron-56 and falls off afterward, and why every element heavier than lead is unstable.",
      },
      {
        wrong:
          "Isotopes of the same element are identical because they're the same element.",
        correct:
          "Chemically nearly identical, nuclearly very different. Carbon-12 is stable forever, carbon-14 is radioactive with a 5,730-year half-life. Uranium-235 fissions readily and powers reactors; uranium-238 is far less fissile. Same proton count means same chemistry, but neutron count drives nuclear stability, mass, and decay properties. That's why isotopes are central to dating, medicine, and nuclear power.",
      },
      {
        wrong:
          "The neutron-to-proton ratio for stable nuclei is always 1:1.",
        correct:
          "Only true for the lightest elements. Helium-4, carbon-12, oxygen-16 have N=Z. By calcium (Z=20) you start needing more neutrons than protons. Gold-197 is Z=79, N=118 — about 1.49 neutrons per proton. Uranium-238 sits at 1.59. The ratio creeps up to dilute Coulomb repulsion. Plot Z vs. N for stable isotopes and you get the famous curving 'valley of stability' rather than a straight line.",
      },
    ],
    teacherUseCases: [
      "Valley-of-stability mapping: students build every stable isotope they can find, plot N vs. Z, and connect the dots. They should discover the curving band that separates stable from unstable nuclei — and notice that beyond Z=82 the band ends.",
      "Carbon trio investigation: build carbon-11, carbon-12, carbon-13, and carbon-14. Students predict which are stable and which decay, then check. This sets up radiocarbon dating and PET imaging in one exercise.",
      "Binding-energy-per-nucleon plot: walk through binding energy from hydrogen up to uranium. The peak at iron-56 is the most important graph in nuclear physics because it explains why fusion releases energy below iron and fission releases energy above it.",
      "Magic numbers exploration: have students try to assemble nuclei with 2, 8, 20, 28, 50, 82, or 126 of either nucleon and observe extra stability. This connects to the nuclear shell model the way noble gases connect to electron shells.",
      "Predict-then-check decay modes: students propose what kind of decay they expect for unstable nuclei (alpha for big nuclei, beta-minus for neutron-heavy, beta-plus for proton-heavy) and verify against the simulation's predicted decay mode display.",
    ],
    faq: [
      {
        question: "Why does iron-56 have the highest binding energy per nucleon?",
        answer:
          "It's the optimum balance point. Below iron, nuclei aren't fully exploiting the short-range strong force — adding more nucleons gains you binding faster than repulsion grows. Above iron, Coulomb repulsion between the many protons starts to dominate, so adding more nucleons costs you binding. Iron-56 sits exactly where those two curves cross, which is why fusion releases energy below it (powering stars) and fission releases energy above it (powering reactors and bombs).",
      },
      {
        question: "What's the difference between mass number and atomic number?",
        answer:
          "Atomic number Z is just the proton count, and it defines the element — Z=6 is always carbon. Mass number A is the total number of nucleons, A = Z + N. Two different isotopes have the same Z but different A. The notation ⁱᴬZ X (like ¹⁴₆C for carbon-14) packs both numbers in. In nuclear reactions both A and Z are conserved across the equation, which is the rule that lets you balance every decay.",
      },
      {
        question: "Why do some heavy nuclei undergo alpha decay specifically?",
        answer:
          "Because emitting an alpha particle (a tightly bound He-4 nucleus) is the most energetically favorable way for a heavy nucleus to shed mass. The alpha is so well bound that ejecting one releases a lot of energy, which the daughter nucleus and the alpha share as kinetic energy. Lighter unstable nuclei usually can't afford to emit a whole alpha, so they prefer beta decay or other channels.",
      },
      {
        question: "Are there any stable nuclei past lead?",
        answer:
          "No. Bismuth-209 was thought to be stable for decades, but in 2003 it was shown to alpha decay with a half-life of about 10¹⁹ years — longer than the age of the universe, but technically not forever. Past Z=82 every nucleus eventually decays. Heavy-element synthesis in stars and supernovae produces them, but on Earth they only stick around if their half-life is at least comparable to the age of the solar system.",
      },
      {
        question: "How does this connect to AP Physics 2 standards MOD-3.A and MOD-3.B?",
        answer:
          "MOD-3.A covers nuclear structure — protons, neutrons, isotope notation, and the strong force overcoming Coulomb repulsion, which is exactly what students manipulate in the simulation. MOD-3.B covers binding energy and mass-energy equivalence (E=mc²) — building a stable nucleus from free nucleons releases energy equal to the binding energy, and the simulation shows this directly via the binding-energy chart.",
      },
    ],
  },
};
