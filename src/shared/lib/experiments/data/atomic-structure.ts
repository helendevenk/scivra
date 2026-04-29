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
};
