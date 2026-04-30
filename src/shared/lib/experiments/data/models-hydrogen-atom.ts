import type { Experiment } from "@/shared/types/experiment";

export const modelsHydrogenAtom: Experiment = {
  id: "models-hydrogen-atom",
  slug: "models-hydrogen-atom-bohr",
  title: "Models of the Hydrogen Atom",
  subtitle: "Explore quantum models from Bohr to Schrödinger",
  description:
    "Shoot photons at a hydrogen atom and observe electron transitions. Compare the Bohr model, de Broglie's standing wave model, and the quantum mechanical probability cloud model.",
  thumbnail: "/imgs/experiments/nuclear-decay.png",

  standards: {
    ngss: ["HS-PS4-3", "HS-PS1-8"],
    gcse: ["AQA P7.1"],
    ap: ["MOD-2.A", "MOD-2.B", "MOD-2.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["hydrogen atom", "Bohr model", "quantum mechanics", "energy levels", "photon emission", "electron transitions"],
  difficulty: "intermediate",

  parameters: [
    { id: "model_type", label: "Atomic Model", unit: "", min: 0, max: 3, default: 0, step: 1, tier: "free" },
    { id: "photon_wavelength", label: "Photon Wavelength", unit: "nm", min: 100, max: 700, default: 656, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "E_n = -\\frac{13.6\\text{ eV}}{n^2}", description: "Bohr energy levels" },
    { latex: "\\Delta E = hf = \\frac{hc}{\\lambda}", description: "Photon energy for transition" },
    { latex: "\\frac{1}{\\lambda} = R_H\\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)", description: "Rydberg formula" },
  ],

  theory:
    "The hydrogen atom's emission spectrum revealed discrete energy levels. The Bohr model (1913) explained hydrogen's spectrum with quantized circular orbits: E_n = −13.6 eV/n². Electrons absorb photons to jump to higher levels and emit photons when falling to lower levels. The de Broglie model added standing wave resonance. The full quantum model describes electron probability densities (orbitals) rather than definite paths.",
  instructions:
    "Select a model type. Shoot a photon (adjust wavelength) at the atom. Only photons with exactly the right energy will be absorbed — watch the electron jump to an excited state. It will then emit a photon and return to a lower level. The spectrum display shows all allowed transitions.",
  challenges: [
    { id: "mha-c1", question: "What wavelength photon is needed to excite hydrogen from n=1 to n=2?", hint: "ΔE = 13.6(1/1² − 1/2²) = 10.2 eV; λ = hc/ΔE ≈ 121 nm (UV)", tier: "free" },
    { id: "mha-c2", question: "Why is the Balmer series visible light while Lyman series is UV?", hint: "Balmer ends at n=2 (lower energy transitions); Lyman ends at n=1 (higher energy = shorter λ)", tier: "free" },
    { id: "mha-c3", question: "What was wrong with the Bohr model that the quantum model fixed?", hint: "Bohr can't explain multi-electron atoms, fine structure, or the uncertainty principle", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["photoelectric-effect", "blackbody-spectrum", "build-a-nucleus"],

  seoTitle: "Models of the Hydrogen Atom | Bohr Model Simulation | AP Physics 2",
  seoKeywords: ["hydrogen atom", "Bohr model", "energy levels", "quantum mechanics", "AP Physics 2", "Rydberg formula"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Hydrogen Atom, Bohr Model, Energy Levels" },

  contentSections: {
    whatIsIt:
      "When you stare at a glowing neon sign, you're looking at quantum mechanics in action. Atoms only emit light at very specific wavelengths — neon glows red-orange, sodium streetlamps glow yellow, hydrogen glows pinkish-red — and each color is a fingerprint of how electrons inside that atom are allowed to move. Hydrogen, the simplest atom of all, was the puzzle that cracked open quantum theory. Niels Bohr proposed in 1913 that hydrogen's electron could only exist in certain quantized orbits, each with a specific energy E_n = −13.6 eV/n². When the electron drops from a higher level to a lower one, the atom spits out a photon carrying exactly the energy difference. Send a photon back in with the right energy and the electron jumps up. Switch between three historical models of the atom — Bohr's planetary picture, de Broglie's standing wave, and the modern quantum mechanical probability cloud — and watch the same emission spectrum emerge from increasingly accurate physics.",
    parameterExplanations: {
      model_type:
        "Picks which historical model represents the atom on screen. Bohr (planetary orbits with fixed radii) is the easiest to draw but technically wrong — electrons don't trace paths. De Broglie wraps a standing wave around each orbit, which explains why only certain energies are allowed. The full quantum mechanical model replaces orbits with probability clouds (orbitals). All three predict the same hydrogen spectrum, which is why Bohr survived as a teaching tool.",
      photon_wavelength:
        "The wavelength of the incoming photon, in nanometers. The atom only absorbs photons whose energy E = hc/λ matches a transition between two allowed levels. 121 nm (UV) excites n=1 to n=2, 656 nm (red, the famous H-alpha line) is the n=3 to n=2 emission, and 1875 nm (IR) is n=4 to n=3. Wavelengths in between are simply ignored — the photon passes through.",
    },
    misconceptions: [
      {
        wrong:
          "Electrons orbit the nucleus like planets going around the sun, just on different tracks.",
        correct:
          "That's the Bohr cartoon, and it's a useful first approximation but not literally true. In quantum mechanics the electron has no definite path. It's described by a wavefunction whose square gives the probability of finding it at each location — a fuzzy probability cloud, not a planet on a track. Bohr's model accidentally gets hydrogen's energy levels right because of a deep mathematical coincidence, but it fails completely for any atom with more than one electron.",
      },
      {
        wrong:
          "An electron can have any energy it wants, just like a ball can roll at any speed.",
        correct:
          "Bound electrons are quantized. Inside an atom only specific energy levels are allowed, set by E_n = −13.6 eV/n² for hydrogen. Energies between those values are forbidden — that's why the spectrum shows sharp lines instead of a continuous rainbow. A free electron (one that's escaped the atom, n → ∞) can have any kinetic energy you want; the quantization only kicks in when it's bound.",
      },
      {
        wrong:
          "If you shoot any photon at hydrogen, the atom will absorb it.",
        correct:
          "Only photons with energies matching a transition (E = E_high − E_low) get absorbed. A 500 nm green photon carries about 2.48 eV, which doesn't match any hydrogen jump from the ground state — so the atom ignores it. Try 121 nm and the atom snaps up the photon and jumps from n=1 to n=2. This selectivity is exactly why each element has a unique spectral fingerprint.",
      },
      {
        wrong:
          "When the electron jumps to a higher level, it physically travels through the space between the levels.",
        correct:
          "There's no smooth trip in between. The transition is instantaneous in the standard quantum picture — the wavefunction reconfigures from one stationary state to another the moment the photon is absorbed. There's no halfway state where the electron is partway up. This is what 'quantum jump' actually means.",
      },
    ],
    teacherUseCases: [
      "Lyman vs. Balmer hunt: ask students to find every wavelength that excites the atom from n=1 (Lyman series) versus from n=2 (Balmer series). They should discover Lyman is all UV and Balmer is the visible H-alpha, H-beta, H-gamma lines that hydrogen lamps actually glow.",
      "Spectrum-fingerprint lab: pair the simulation with photos of real emission spectra (hydrogen, helium, neon). Students explain why each element has unique lines and connect this to how astronomers identify what stars are made of.",
      "Model evolution timeline: have small groups present each model in chronological order — Thomson (plum pudding), Rutherford (nuclear), Bohr (1913 quantized orbits), de Broglie (1924 standing waves), Schrödinger (1926 probability clouds). They argue what each model fixed and what it still got wrong.",
      "Rydberg formula derivation: walk students through 1/λ = R_H(1/n_1² − 1/n_2²) using the simulation to verify predicted wavelengths. This is one of the cleanest places in AP Physics 2 to do real algebra-driven prediction.",
      "Misconception probe: pause the simulation mid-transition and ask 'where is the electron right now?' Use the inevitable confusion to introduce why the Bohr model is taught even though it's technically wrong.",
    ],
    faq: [
      {
        question: "Why does the Bohr model still get taught if it's wrong?",
        answer:
          "Because for hydrogen specifically, Bohr's quantization condition gives the exact same energy levels that the full Schrödinger equation gives — E_n = −13.6 eV/n². It's a happy mathematical coincidence. Bohr is a stepping stone: it gets students used to quantization and discrete levels before they have the math to handle wavefunctions. For any atom past hydrogen, Bohr breaks down badly and you must use the quantum model.",
      },
      {
        question: "What does the negative sign in E_n = −13.6 eV/n² mean?",
        answer:
          "Negative energy means the electron is bound. Zero energy is defined as the electron just barely escaping the atom (n → ∞). The deeper the electron sits, the more negative its energy and the more energy it takes to ionize it. The ground state (n=1) sits 13.6 eV below zero, which is why ionizing hydrogen requires exactly 13.6 eV — that's the famous ionization energy.",
      },
      {
        question: "Why is hydrogen's spectrum a series of sharp lines instead of a continuous rainbow?",
        answer:
          "Because the electron's energy is quantized, transitions can only happen between specific level pairs. Each pair gives a fixed photon energy, hence a fixed wavelength. If energies were continuous you'd get a continuous emission spectrum like a hot tungsten filament. The line spectrum is direct visual proof that energy levels in atoms are discrete — one of the foundational discoveries of modern physics.",
      },
      {
        question: "How does this connect to AP Physics 2 standards MOD-2.A through MOD-2.C?",
        answer:
          "MOD-2.A asks students to relate atomic spectra to discrete energy levels — exactly what the simulation visualizes. MOD-2.B covers photon absorption and emission with E = hf, which is the Rydberg-formula calculation behind every transition here. MOD-2.C extends to the Bohr model and its limitations, which is why we let students switch between three models and see what each one explains.",
      },
      {
        question: "Why does the photon's energy have to match the transition exactly?",
        answer:
          "Energy conservation. The atom can only end up in another allowed level, so the absorbed photon must carry exactly E_high − E_low. Photons with the wrong energy can't 'partially excite' the atom because there's no halfway level for the electron to land in. In real life there's a tiny natural linewidth (because excited states have finite lifetimes), but for AP-level work treat the match as exact.",
      },
    ],
  },
};
