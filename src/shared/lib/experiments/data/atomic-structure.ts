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
      max: 92,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "principalQuantumNumber",
      label: "Principal Quantum Number",
      unit: "n",
      min: 1,
      max: 7,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "subshellIndex",
      label: "Orbital Subshell",
      unit: "subshell",
      min: 1,
      max: 4,
      default: 2,
      step: 1,
      tier: "free",
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
    "Use the Atomic Number slider to choose an element from hydrogen to uranium, the Principal Quantum Number slider to focus on shell n = 1 through 7, and the Orbital Subshell slider to switch between s, p, d, and f views. Try the Hydrogen (Z=1), Carbon (Z=6), and Mercury (Z=80) presets to jump between a one-electron atom, a period-2 bonding example, and a heavy atom with filled inner shells.",

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
  htmlPath: "/experiments/ap-chemistry/atomic-structure.html",

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
  htmlControlAliases: {
    atomicNumber: "sl-Z",
    principalQuantumNumber: "sl-n",
    subshellIndex: "sl-spd",
  },
  presets: [
    {
      id: "H",
      label: "Hydrogen (Z=1)",
      description:
        "Hydrogen gives the simplest possible atom: one proton and one electron. It is the cleanest starting point for connecting atomic number, the n shell setting, and quantized energy levels.",
    },
    {
      id: "C",
      label: "Carbon (Z=6)",
      description:
        "Carbon shows a compact period-2 atom with valence electrons in the 2s and 2p subshells. It is useful for discussing orbital occupancy and chemical bonding patterns.",
    },
    {
      id: "Hg",
      label: "Mercury (Z=80)",
      description:
        "Mercury jumps to a heavy atom with many filled inner shells and d-block history. It helps students compare a simple atom with a high-Z element where shielding matters.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Atomic structure describes how protons and neutrons pack into a nucleus while electrons occupy discrete quantum orbitals — regions of space defined by four quantum numbers rather than fixed circular paths. A neon sign glows red-orange because electrons in neon atoms absorb electrical energy, jump to higher orbitals, and release photons of specific wavelengths when they fall back. This simulation lets you dial in any element from hydrogen (Z=1) to krypton (Z=36), watch the Aufbau filling sequence populate s, p, and d subshells, excite electrons to higher energy levels and observe the emitted photon color, and overlay periodic trend data to see how atomic radius, ionization energy, and electronegativity shift across the table. AP Chem 1.A.1, 1.B.1, and 1.C.1 all converge here.",
    parameterExplanations: {
      atomicNumber:
        "Atomic Number is the number of protons in the nucleus. For a neutral atom, it also sets the number of electrons that must be placed into orbitals. Moving this slider from 1 to 92 changes the element, so students can compare hydrogen, carbon, transition metals, and heavier atoms without changing the underlying rules. Watch how adding protons increases nuclear charge while added electrons occupy shells and subshells according to the filling pattern. This is the main control for connecting element identity to electron configuration, shielding, valence electrons, and periodic behavior.",
      principalQuantumNumber:
        "Principal Quantum Number selects the shell being emphasized, from n = 1 through n = 7. Lower n values represent orbitals closer to the nucleus and generally lower in energy, while higher n values represent larger shells farther out. Holding the atomic number constant while changing n helps students separate two ideas that are often blended together: which element they are studying and which shell they are inspecting. Use this slider to ask where core electrons sit, where valence electrons appear, and how shell number contributes to atomic size and shielding.",
      subshellIndex:
        "Orbital Subshell chooses the subshell family displayed by the viewer: 1 for s, 2 for p, 3 for d, and 4 for f. The index is numeric because the HTML control is a slider, but each stop maps to a named orbital shape and capacity. Moving from s to p to d to f shows why orbital geometry matters: s orbitals are spherical, p orbitals are directional, d orbitals support transition-metal behavior, and f orbitals appear in heavier elements. Use it with the n slider to compare shell level and subshell shape as separate quantum labels.",
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
      "Preset comparison warm-up: have students click Hydrogen, Carbon, and Mercury, then write one claim about how increasing Z changes the nucleus, electron count, and shell complexity.",
      "Quantum-label practice: keep Carbon selected, move the Principal Quantum Number slider from n = 1 to n = 3, and ask students which shells contain core electrons, valence electrons, or no electrons for carbon.",
      "Subshell shape station: set a fixed n value and move the Orbital Subshell slider through s, p, d, and f. Students sketch each shape and connect the numeric slider stops to subshell names and capacities.",
      "Periodic reasoning prompt: use the Atomic Number slider to compare neighboring elements, then ask students to explain why added protons and added electrons do not affect atomic size in identical ways.",
      "Heavy-element contrast: jump from Hydrogen to Mercury and have students identify why shielding becomes a necessary idea once many inner shells sit between the nucleus and outer electrons.",
    ],
    faq: [
      {
        question: "Why does the simulation go up to Z = 92?",
        answer:
          "Z = 92 reaches uranium, so the slider covers the naturally familiar span from hydrogen through very heavy atoms while still keeping the control bounded for classroom use. That range lets students compare simple one-electron behavior, second-period bonding examples, transition-metal d subshells, and heavier atoms where shielding and inner shells become important. Teachers can stay within the AP Chemistry scope by focusing on lower-Z examples, then use high-Z presets or slider positions as contrast cases.",
      },
      {
        question: "How does this simulation connect to AP Chem standards 1.A.1, 1.B.1, and 1.C.1?",
        answer:
          "AP Chem 1.A.1 covers the nuclear model and subatomic particles — the Atomic Number slider and nucleus display address that directly. AP Chem 1.B.1 requires writing electron configurations and understanding orbital occupancy, which the n-shell and subshell controls help students inspect. AP Chem 1.C.1 connects electron configuration to periodic trends like ionization energy and atomic radius, which students can reason about by comparing elements across Z values.",
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
