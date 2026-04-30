import type { Experiment } from "@/shared/types/experiment";

export const rutherfordScattering: Experiment = {
  id: "rutherford-scattering",
  slug: "rutherford-scattering-nuclear-model",
  title: "Rutherford Scattering",
  subtitle: "Discover the nuclear model of the atom through alpha particle scattering",
  description:
    "Fire alpha particles at a gold foil and observe their deflection angles. Reproduce Rutherford's famous 1909 experiment that revealed the nuclear structure of the atom.",
  thumbnail: "/imgs/experiments/nuclear-decay.png",

  standards: {
    ngss: ["HS-PS1-8"],
    gcse: ["AQA P7.1"],
    ap: ["MOD-2.A", "MOD-2.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["Rutherford scattering", "nuclear model", "alpha particles", "atomic structure", "Coulomb scattering"],
  difficulty: "intermediate",

  parameters: [
    { id: "nuclear_charge", label: "Nuclear Charge Z", unit: "e", min: 1, max: 100, default: 79, step: 1, tier: "free" },
    { id: "alpha_energy", label: "Alpha Energy", unit: "MeV", min: 1, max: 20, default: 5, step: 0.5, tier: "free" },
    { id: "impact_param", label: "Impact Parameter", unit: "fm", min: 0, max: 500, default: 100, step: 5, tier: "pro" },
  ],

  formulas: [
    { latex: "\\cot(\\theta/2) = \\frac{2bE_k}{k q_\\alpha q_{Au}}", description: "Rutherford scattering formula" },
    { latex: "d_{closest} = \\frac{kq_\\alpha q_{Au}}{E_k}", description: "Distance of closest approach" },
  ],

  theory:
    "In 1909, Geiger and Marsden fired alpha particles at gold foil. Most passed through, but a few scattered at large angles — even backward. This contradicted the Thomson 'plum pudding' model and led Rutherford to propose the nuclear model: nearly all atomic mass is concentrated in a tiny, positively-charged nucleus. The scattering angle depends on how close the alpha particle passes to the nucleus, governed by Coulomb repulsion.",
  instructions:
    "Fire alpha particles using the gun. Most will deflect only slightly. Decrease the impact parameter (aim closer to the center) to see large deflections. Watch the occasional alpha particle bounce back. The scattering angle histogram reveals the nuclear structure.",
  challenges: [
    { id: "rs-c1", question: "An alpha particle aimed directly at a gold nucleus (Z=79). What is the closest approach distance?", hint: "d = k×q_α×q_Au/KE; use KE=5MeV=8×10⁻¹³J; q_α=3.2×10⁻¹⁹C; q_Au=79e", tier: "free" },
    { id: "rs-c2", question: "Why did most alpha particles pass through the foil almost undeflected?", hint: "The nucleus is tiny compared to atomic size; most alphas pass far from any nucleus", tier: "free" },
    { id: "rs-c3", question: "How did Rutherford estimate the nucleus size from the maximum scattering angle?", hint: "Closest approach for direct hits gives upper bound on nuclear radius", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["build-a-nucleus", "models-hydrogen-atom", "nuclear-decay"],

  seoTitle: "Rutherford Scattering Simulation | Nuclear Model | AP Physics 2",
  seoKeywords: ["Rutherford scattering", "nuclear model", "alpha particles", "atomic structure", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Rutherford Scattering, Nuclear Model, Atomic Structure" },

  contentSections: {
    whatIsIt:
      "In 1909, Rutherford's students Geiger and Marsden did one of the most surprising experiments in physics. They fired alpha particles — fast, heavy, positively charged helium nuclei — at a thin sheet of gold foil, expecting them to plow straight through like bullets through paper. Most did. But every now and then one bounced almost straight back. Rutherford said it was 'as if you fired a 15-inch shell at tissue paper and it came back and hit you.' That backscattering killed the 'plum pudding' model and gave birth to the nuclear atom: nearly all the mass and all the positive charge crammed into a tiny core, with electrons spread far around it. This simulation lets you reproduce that experiment, aim alpha particles at any nucleus from hydrogen to fermium, and watch Coulomb repulsion sling them off at angles set by how close they pass to the nucleus.",
    parameterExplanations: {
      nuclear_charge:
        "The number of protons in the target nucleus, set by the element's atomic number Z. The original gold-foil experiment used gold (Z=79). Doubling Z roughly doubles the Coulomb force at any given distance, which means more particles deflect at large angles. Drop Z to 1 (hydrogen) and the alpha barely notices the target — there's almost nothing there to push back on it.",
      alpha_energy:
        "The kinetic energy of the incoming alpha particle in MeV. Rutherford used 5 MeV alphas from a radium source. Higher energy alphas can punch closer to the nucleus before electrostatic repulsion stops them, so cranking the energy up reveals smaller-scale structure. At very high energies (50+ MeV) the alpha can actually touch the nucleus and the simple Coulomb-scattering formula starts to fail — you'd see deviations that signal the strong nuclear force kicking in.",
      impact_param:
        "The perpendicular miss distance the alpha would have if there were no force at all, measured in femtometers (10⁻¹⁵ m). A small impact parameter (aim almost dead-on) gives a large scattering angle. A large impact parameter means the alpha sails past at a comfortable distance and barely deflects. Setting impact_param to zero models a head-on collision, where the alpha stops at the distance of closest approach and reverses direction.",
    },
    misconceptions: [
      {
        wrong:
          "Atoms are mostly empty space, so light and matter should pass right through them all the time.",
        correct:
          "Atoms are mostly empty space *for very high-energy particles like alphas* — the nucleus occupies about 1/100,000 the diameter of the atom. But for light and ordinary matter, the electron cloud fills the entire atomic volume and absolutely interacts with anything passing through. 'Mostly empty' refers to a specific scale and probe; it doesn't mean atoms are hollow.",
      },
      {
        wrong:
          "Rutherford's experiment proved electrons orbit the nucleus in fixed paths.",
        correct:
          "It did no such thing. Scattering only revealed the *positive charge distribution* — that the positive charge is concentrated, not spread out. Where the electrons live and how they move was completely outside the experiment's reach. Bohr's quantized orbits came four years later (1913) by combining Rutherford's nuclear atom with quantum theory of light. Today we know electrons aren't on fixed paths at all.",
      },
      {
        wrong:
          "Most alphas got deflected by the nucleus, which is how Rutherford detected it.",
        correct:
          "The opposite is true. Most alphas passed straight through with almost no deflection because they sailed far from any nucleus. Only about 1 in 8,000 deflected by more than 90°. The fact that *any* of them backscattered — combined with how often it happened — is what set the upper bound on nuclear size. Rutherford's stroke of genius was realizing that rare large-angle scattering is just as informative as the common small angles.",
      },
      {
        wrong:
          "The alpha particle bounces off the nucleus the way a ball bounces off a wall.",
        correct:
          "There's no contact. The alpha is repelled by the long-range Coulomb force from the protons in the nucleus — same physics as two like-charged balloons pushing each other apart, just with much more force at much smaller distance. The closer the alpha gets, the harder the push. For 5 MeV alphas on gold, the alpha never actually touches the nucleus; it stops about 50 femtometers away and reverses.",
      },
    ],
    teacherUseCases: [
      "Plum-pudding death match: have students predict what they'd see if Thomson's plum-pudding model were correct (nearly all small-angle deflections, no backscattering). Run the simulation and compare. The mismatch is what killed the model.",
      "Distance of closest approach lab: students compute d = kq_α q_Au / KE for a head-on 5 MeV alpha on gold and verify against the simulation. This is a perfect Coulomb's-law-meets-conservation-of-energy problem and is exactly the AP Physics 2 SAP-style calculation.",
      "Z scan: students vary nuclear charge from 1 to 100 in steps and record the fraction backscattering. Plot fraction vs. Z² (since cross section scales as Z²). The straight line is a great moment of 'wait, the math actually predicts this.'",
      "Impact parameter geometry: at fixed energy, vary impact parameter and record scattering angle. Plot cot(θ/2) vs. b. Students should get a straight line whose slope encodes the nuclear charge — exactly how Geiger and Marsden estimated Z for gold.",
      "Historical context: pair the simulation with the original 1909 Geiger–Marsden paper or Rutherford's 1911 paper. Students see what raw data looked like and how Rutherford reasoned from a histogram of scintillation flashes to a model of the atom.",
    ],
    faq: [
      {
        question: "Why did the plum pudding model fail?",
        answer:
          "Because it predicted no large-angle scattering. If positive charge were spread evenly through the atom (as Thomson proposed) the electric field anywhere inside would be small — not enough to deflect a heavy 5 MeV alpha by more than a few degrees. The fact that some alphas bounced almost straight back required positive charge to be concentrated in a tiny region where the field is enormous. That's the nuclear atom in one observation.",
      },
      {
        question: "What is the distance of closest approach and why does it matter?",
        answer:
          "It's how close a head-on alpha gets to the nucleus before Coulomb repulsion turns it around. Setting kinetic energy equal to electrostatic potential energy: d = kq_α q_Au / KE. For 5 MeV alphas on gold, d is about 45 femtometers. This number sets an upper bound on the size of the gold nucleus — Rutherford couldn't say the nucleus was *exactly* that small, only that it was no bigger than that.",
      },
      {
        question: "Why does scattering angle depend so strongly on impact parameter?",
        answer:
          "Because Coulomb force falls off as 1/r². Aim a little closer and the force during the encounter is way stronger. Quantitatively cot(θ/2) is proportional to the impact parameter b, so cutting b in half roughly doubles cot(θ/2) — small misses translate to big angle changes. This sensitivity is what made the experiment a reliable probe of nuclear size.",
      },
      {
        question: "Could Rutherford's experiment detect the strong nuclear force?",
        answer:
          "Not at the energies he used. 5 MeV alphas on gold can't get close enough to feel the strong force — Coulomb repulsion stops them well outside the nucleus. Modern accelerators using GeV-scale protons or electrons can punch into the nucleus and see strong-force structure. The deviation from Rutherford's pure Coulomb formula at very high energies is exactly the signal that something other than electromagnetism is acting.",
      },
      {
        question: "How does this connect to AP Physics 2 MOD-2.A and MOD-2.B?",
        answer:
          "MOD-2.A asks students to use the nuclear model of the atom — Rutherford scattering is literally the experiment that established that model. MOD-2.B covers Coulomb's law applied at the atomic scale, which is the entire physics of the scattering: electrostatic repulsion between two positive charges decides everything about the trajectory.",
      },
    ],
  },
};
