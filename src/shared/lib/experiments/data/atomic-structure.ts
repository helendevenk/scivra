import type { Experiment } from "@/shared/types/experiment";

export const atomicStructure: Experiment = {
  id: "atomic-structure",
  slug: "atomic-structure",
  title: "Atomic Structure & Electron Configuration",
  subtitle: "Orbitals, energy levels, and periodic trends",
  description:
    "Explore the quantum model of the atom. Visualize s, p, d, and f orbitals in 3D, fill electron shells using the Aufbau principle, and see how electron configuration determines periodic trends. Probe flame colors by exciting electrons to higher energy levels and watch emission spectra appear.",
  thumbnail: "/imgs/experiments/atomic-structure.png",

  standards: {
    ngss: ["HS-PS1-1", "HS-PS4-3"],
    gcse: ["C2.1", "C2.2"],
    ap: ["1.A.1", "1.B.1", "1.C.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "9-12",
  tags: ["atomic structure", "electron configuration", "orbitals", "periodic trends", "emission spectrum", "AP Chemistry"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "atomicNumber",
      label: "Atomic Number (Z)",
      unit: "",
      min: 1,
      max: 36,
      default: 6,
      step: 1,
      tier: "free",
    },
    {
      id: "energyLevel",
      label: "Excitation Energy Level",
      unit: "",
      min: 1,
      max: 6,
      default: 2,
      step: 1,
      tier: "free",
    },
    {
      id: "orbitalType",
      label: "Orbital View (0=s, 1=p, 2=d)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "pro",
    },
    {
      id: "showTrends",
      label: "Show Periodic Trend (0=radius, 1=IE, 2=EN)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "E_n = -\\frac{13.6\\,\\text{eV}}{n^2} \\quad (\\text{hydrogen energy levels})",
      description: "Hydrogen atom energy levels (Bohr model)",
    },
    {
      latex: "\\Delta E = hf = \\frac{hc}{\\lambda} \\quad (\\text{photon emitted when e}^- \\text{ drops})",
      description: "Photon energy from electron transition",
    },
    {
      latex: "\\text{Aufbau: } 1s\\,2s\\,2p\\,3s\\,3p\\,4s\\,3d\\,4p\\cdots",
      description: "Electron filling order (Aufbau principle)",
    },
  ],

  theory:
    "Atoms consist of a nucleus (protons + neutrons) surrounded by electrons in quantum orbitals. Principal quantum number n defines energy shells. Subshells: s (1 orbital, 2e), p (3 orbitals, 6e), d (5 orbitals, 10e), f (7 orbitals, 14e). Electron configuration follows the Aufbau principle (fill lowest energy first), Pauli exclusion (max 2e per orbital, opposite spins), and Hund's rule (fill each orbital singly before pairing). Orbital shapes: s = sphere, p = dumbbell (3 orientations), d = cloverleaf (5 orientations). Periodic trends: atomic radius decreases across a period (increasing nuclear charge pulls electrons in) and increases down a group (more shells). Ionization energy (IE) and electronegativity (EN) show opposite trends to radius.",

  instructions:
    "Set the atomic number and watch electrons fill orbitals. The electron configuration is displayed. Click energy levels to excite an electron — watch the photon emitted as it drops back, and see the corresponding spectral line colored by wavelength. Use the orbital viewer (Pro) to see 3D probability density clouds for s, p, d orbitals.",

  challenges: [
    {
      id: "as-c1",
      question: "Write the electron configuration of Fe (Z=26) and identify how many unpaired electrons it has.",
      hint: "[Ar]3d⁶4s². 3d⁶ has 4 unpaired electrons (fill 5 d orbitals: 5 up, then 1 paired). So Fe has 4 unpaired electrons → paramagnetic.",
      tier: "free",
    },
    {
      id: "as-c2",
      question: "An electron in hydrogen emits a photon with wavelength 656 nm. What energy levels did it transition between?",
      hint: "656 nm is Balmer series (transitions to n=2). E = hc/λ = (6.63×10⁻³⁴×3×10⁸)/(656×10⁻⁹) = 3.03×10⁻¹⁹ J = 1.89 eV. This matches n=3→n=2 (Balmer Hα line).",
      tier: "free",
    },
    {
      id: "as-c3",
      question: "Why does ionization energy generally increase across Period 3 (Na to Cl), but dip slightly at Mg→Al and P→S?",
      hint: "General increase: more protons pull electrons tighter. Dip at Al: Al removes a 3p electron (higher energy than Mg's 3s²). Dip at S: S's 4th 3p electron pairs with an existing electron (repulsion makes it easier to remove).",
      tier: "free",
    },
    {
      id: "as-c4",
      question: "Cr (Z=24) has the configuration [Ar]3d⁵4s¹, not [Ar]3d⁴4s². Why?",
      hint: "Half-filled subshells (3d⁵) have extra stability due to exchange energy (maximizing parallel spins). The energy gained by having a half-filled d subshell exceeds the cost of moving an electron from 4s to 3d.",
      tier: "pro",
    },
  ],

  wave: 4,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["molecular-bonding", "acid-base-ph"],

  seoTitle: "Atomic Structure Electron Configuration 3D | Scivra AP Chemistry",
  seoKeywords: [
    "atomic structure simulation",
    "electron configuration interactive",
    "orbital 3D visualization",
    "emission spectrum interactive",
    "AP Chemistry atomic structure",
    "periodic trends simulation",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Atomic Structure and Electron Configuration",
  },
  contentSections: {
    whatIsIt:
      "Atomic structure describes how protons and neutrons pack into a nucleus while electrons occupy discrete quantum orbitals — regions of space defined by four quantum numbers rather than fixed circular paths. A neon sign glows red-orange because electrons in neon atoms absorb electrical energy, jump to higher orbitals, and release photons of specific wavelengths when they fall back. This simulation lets you dial in any element from hydrogen (Z=1) to krypton (Z=36), watch the Aufbau filling sequence populate s, p, and d subshells, excite electrons to higher energy levels and observe the emitted photon color, and overlay periodic trend data to see how atomic radius, ionization energy, and electronegativity shift across the table. AP Chem 1.A.1, 1.B.1, and 1.C.1 all converge here.",
    parameterExplanations: {
      atomicNumber:
        "The number of protons in the nucleus, which also equals the number of electrons in a neutral atom (Z = 1 to 36). Increasing Z by one adds a proton and an electron, advancing the Aufbau filling sequence one step — the simulation rebuilds the ground-state configuration and redraws the orbital diagram instantly.",
      energyLevel:
        "The principal quantum number (n = 1 to 6) to which the outermost electron is excited. Raising this value moves that electron farther from the nucleus; when it relaxes the simulation fires a photon whose color corresponds to ΔE = hf. The visible Balmer series comes from transitions ending at n = 2 (e.g., n = 3 → 2 gives Hα at 656 nm); transitions ending at n = 1 fall in the UV Lyman series.",
      orbitalType:
        "Selects which subshell shape to render in the 3D viewer: 0 = spherical s orbital, 1 = dumbbell-shaped p orbital (three orientations), 2 = cloverleaf d orbital (five orientations). Switching between them illustrates why p orbitals have directional bonding and d orbitals produce the split energy levels central to transition-metal color.",
      showTrends:
        "Overlays a periodic-trend heat map: 0 = atomic radius (pm), 1 = first ionization energy (kJ/mol), 2 = electronegativity (Pauling scale). The three maps form mirror images of each other across the table — atomic radius increases down and to the left, while IE and EN increase up and to the right.",
    },
    misconceptions: [
      {
        wrong:
          "Atomic radius increases as you move left to right across a period because more electrons are being added.",
        correct:
          "Atomic radius actually decreases across a period. Each additional proton raises the effective nuclear charge (Z_eff), pulling the entire electron cloud inward. Sodium (~186 pm) is nearly twice the radius of chlorine (~99 pm) despite sitting in the same period.",
      },
      {
        wrong:
          "Electrons travel in fixed circular orbits around the nucleus, like planets around the sun.",
        correct:
          "The Bohr model works numerically for hydrogen but is physically wrong for all multi-electron atoms. Electrons exist as probability density clouds described by wave functions. An s orbital is a sphere of probability, not a circular track.",
      },
      {
        wrong:
          "Electronegativity and electron affinity mean the same thing — both measure how strongly an atom attracts electrons.",
        correct:
          "They measure different things. Electron affinity is the energy change (in kJ/mol) when a gas-phase atom gains one electron. Electronegativity is a dimensionless relative index of how strongly a bonded atom pulls shared electrons toward itself. Fluorine has the highest Pauling electronegativity, but chlorine actually has a more exothermic first electron affinity than fluorine — the two scales rank elements differently and use different units.",
      },
      {
        wrong:
          "Hund's rule says electrons pair up in orbitals as soon as possible to minimize energy.",
        correct:
          "Hund's rule says the opposite: electrons occupy each degenerate orbital singly with parallel spins before any pairing occurs. This minimizes electron-electron repulsion. Nitrogen's three 2p electrons each sit in a separate 2p orbital, not two in one and one in another.",
      },
      {
        wrong:
          "The 4s orbital always has higher energy than the 3d orbital.",
        correct:
          "For neutral atoms, 4s fills before 3d because it is lower in energy at that point. But in transition-metal ions, 3d drops below 4s — which is why Fe²⁺ loses its 4s electrons first, giving [Ar]3d⁶, not [Ar]3d⁴4s².",
      },
    ],
    teacherUseCases: [
      "Trend prediction before reveal: cover the showTrends overlay, have students sketch their predicted atomic radius heat map for Z=1 to 18, then uncover the simulation to compare — targets AP Chem 1.C.1 periodic trend reasoning.",
      "Emission spectrum lab: set Z=1 (hydrogen), sweep energyLevel from 2 to 6, record each photon color and estimated wavelength, then use ΔE = hc/λ to calculate transition energies and compare to the Balmer series values — reinforces AP Chem 1.B.1.",
      "Misconception probe on atomic radius: ask students which is larger, Na or Cl, before opening the simulation. After revealing the trend overlay, follow up with 'why does adding protons shrink the atom?' to surface the Z_eff argument.",
      "Aufbau data collection: students record ground-state configurations for Z=21 through Z=30 and flag every exception to the expected filling order (Cr at Z=24, Cu at Z=29) — connects to AP Chem 1.B.1 anomalies.",
      "Comparative ionization probe: examine a high-Z element like Kr (Z=36) and have students explain why its first ionization energy (1351 kJ/mol) is so much higher than potassium's (419 kJ/mol) despite being one period away.",
    ],
    faq: [
      {
        question: "Why does the simulation only go up to Z = 36 (krypton)?",
        answer:
          "Elements up to Z=36 cover the full 1s through 4p filling sequence, which includes all the Aufbau rules, both notable d-block exceptions (Cr and Cu), and the complete set of AP Chem 1.B.1 configurations. Heavier elements require f-orbital treatment that exceeds the AP curriculum scope.",
      },
      {
        question: "How does this simulation connect to AP Chem standards 1.A.1, 1.B.1, and 1.C.1?",
        answer:
          "AP Chem 1.A.1 covers the nuclear model and subatomic particles — the Z slider and nucleus display address that directly. AP Chem 1.B.1 requires writing electron configurations and identifying periodic trends, which the Aufbau animation and showTrends overlay practice. AP Chem 1.C.1 connects electron configuration to periodic trends like ionization energy and atomic radius.",
      },
      {
        question: "What is effective nuclear charge and why does it matter for periodic trends?",
        answer:
          "Effective nuclear charge (Z_eff) is the net positive charge an outermost electron experiences after inner electrons partially screen the nucleus. Across period 2, Z_eff rises from about +1.3 for Li to about +5.1 for F, shrinking the atomic radius from 152 pm to 64 pm and raising the first ionization energy from 520 to 1681 kJ/mol.",
      },
      {
        question: "Why do the emission lines for hydrogen appear at specific colors rather than a continuous rainbow?",
        answer:
          "Electrons can only occupy discrete energy levels, so transitions between them release photons of fixed energies. The visible Balmer series shows n=3→2 (red, 656 nm), n=4→2 (blue-green, 486 nm), n=5→2 (violet, 434 nm), and n=6→2 (violet, 410 nm). No other wavelengths are emitted because no intermediate energy values exist in the quantum model.",
      },
      {
        question: "Does the NGSS standard HS-PS4-3 connect to what I see in the emission spectrum section?",
        answer:
          "Yes. NGSS HS-PS4-3 asks students to evaluate emission and absorption spectra as evidence of atomic energy levels. The photon-color output in this simulation is direct evidence — each spectral line corresponds to a quantized ΔE = hf transition, which is exactly the model HS-PS4-3 asks students to use as a diagnostic tool for identifying elements.",
      },
    ],
  },
};
