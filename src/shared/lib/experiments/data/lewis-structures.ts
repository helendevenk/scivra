import type { Experiment } from "@/shared/types/experiment";

export const lewisStructures: Experiment = {
  id: "lewis-structures",
  slug: "lewis-structures",
  title: "Lewis Structures",
  subtitle: "Dot structures, bonding pairs, and lone pairs",
  description:
    "Draw Lewis dot structures for common molecules by placing bonding pairs and lone pairs around atoms. Learn to count valence electrons, apply the octet rule, calculate formal charges, and identify resonance structures. Interactive SVG canvas lets you build molecules step by step.",
  thumbnail: "/imgs/experiments/lewis-structures.png",

  standards: {
    ngss: ["HS-PS1-1", "HS-PS1-3"],
    gcse: ["C2.1", "C2.2"],
    ap: ["2.C.1", "2.C.2"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "AP",
  tags: [
    "Lewis structures",
    "dot structures",
    "covalent bonding",
    "lone pairs",
    "octet rule",
    "formal charge",
    "AP Chemistry",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "moleculeIndex",
      label: "Molecule",
      unit: "",
      min: 0,
      max: 9,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "showFormalCharge",
      label: "Show Formal Charges (0=Off, 1=On)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "\\text{Formal Charge} = V - N - \\frac{B}{2}",
      description:
        "V = valence electrons, N = non-bonding electrons, B = bonding electrons",
    },
    {
      latex: "\\text{Total valence } e^- = \\sum \\text{group number of each atom} \\pm \\text{charge}",
      description:
        "Count total valence electrons before distributing into bonds and lone pairs",
    },
  ],

  theory:
    "Lewis structures represent the valence electrons in a molecule as dots and lines. A single bond is one shared electron pair (2 e⁻), a double bond is two pairs (4 e⁻), and a triple bond is three pairs (6 e⁻). The octet rule states most atoms want 8 electrons in their valence shell (H wants 2). Steps: (1) Count total valence electrons, (2) Place single bonds between bonded atoms, (3) Complete octets on terminal atoms with lone pairs, (4) Use remaining electrons on the central atom, (5) If central atom lacks an octet, convert lone pairs to multiple bonds. Formal charge = valence e⁻ − lone pair e⁻ − ½(bonding e⁻). Structures with formal charges closest to zero are most stable. Some molecules have resonance structures — multiple valid Lewis structures that differ only in electron placement.",

  instructions:
    "Select a molecule from the dropdown. The structure builder shows atoms positioned for you. Click between atoms to place bonds (single → double → triple → remove). Click on an atom to add/remove lone pairs. The electron counter tracks your progress. When the structure is valid (all octets satisfied, correct electron count), you'll see a green checkmark.",

  challenges: [
    {
      id: "ls-c1",
      question: "Draw the Lewis structure of H₂O. How many lone pairs does oxygen have?",
      hint: "H₂O has 8 valence e⁻ (6 from O + 1 each from 2 H). Two bonding pairs (O-H) and two lone pairs on O.",
      tier: "free",
    },
    {
      id: "ls-c2",
      question: "Draw the Lewis structure of CO₂. What type of bonds does carbon form?",
      hint: "CO₂ has 16 valence e⁻. Carbon forms two double bonds (O=C=O). Each oxygen has two lone pairs.",
      tier: "free",
    },
    {
      id: "ls-c3",
      question: "Draw all resonance structures of the nitrate ion NO₃⁻.",
      hint: "NO₃⁻ has 24 valence e⁻ (5+18+1). Three equivalent structures, each with one N=O double bond and two N-O single bonds. The double bond rotates among the three positions.",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["molecular-bonding", "molecular-polarity"],
  htmlPath: "/experiments/ap-chemistry/lewis-structures.html",

  seoTitle: "Lewis Structures Interactive Builder | Scivra AP Chemistry",
  seoKeywords: [
    "Lewis structure drawing tool",
    "Lewis dot structure practice",
    "covalent bonding simulation",
    "formal charge calculator",
    "AP Chemistry Lewis structures",
    "octet rule interactive",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Lewis Structures and Covalent Bonding",
  },
  contentSections: {
    whatIsIt:
      "A Lewis structure is a 2D map of where the valence electrons sit in a molecule — bonding pairs shown as lines between atoms and lone pairs shown as dots. Draw the structure of water correctly and it immediately tells you that oxygen holds two lone pairs, which is what bends the molecule to 104.5° and makes it polar enough to dissolve table salt. The procedure is systematic: count all valence electrons, connect atoms with single bonds, complete octets on terminal atoms, place leftovers on the central atom, and convert lone pairs to double or triple bonds if the center still needs electrons. This simulation provides an interactive canvas where you place bonds and lone pairs one click at a time, calculates formal charges on demand, and shows resonance structures for ions like NO₃⁻ where the true electron distribution averages multiple valid drawings.",
    parameterExplanations: {
      moleculeIndex:
        "Selects the target molecule from the library (index 0 through 9, including H₂O, CO₂, NH₃, HCN, PCl₅, and NO₃⁻ among others). Each molecule loads with atoms pre-positioned at correct connectivity; your task is to add the correct bonds and lone pairs until the electron counter reaches zero and all octets are satisfied.",
      showFormalCharge:
        "Toggles the formal charge labels on each atom, calculated as FC = valence electrons − nonbonding electrons − ½(bonding electrons). Setting this to 1 reveals whether your current structure is the most stable arrangement — the preferred Lewis structure minimizes formal charges and avoids placing large positive charges on electronegative atoms like oxygen or fluorine.",
    },
    misconceptions: [
      {
        wrong:
          "Every atom in a Lewis structure must have exactly 8 electrons to be a valid structure.",
        correct:
          "The octet rule has well-known exceptions. Hydrogen is satisfied with 2 electrons. Boron and beryllium commonly form stable compounds with 6 and 4 electrons respectively (BF₃, BeCl₂). Period-3 and heavier elements like phosphorus and sulfur are routinely drawn with expanded-octet Lewis structures — PCl₅ shows 10 electrons around phosphorus and SO₄²⁻ can be drawn with 12. (Modern bonding analyses dispute the once-common 'd-orbital participation' rationale, but the expanded-octet representation remains the standard for AP-level Lewis drawing.)",
      },
      {
        wrong:
          "Resonance structures are different molecules that are in equilibrium with each other.",
        correct:
          "Resonance structures are not real, interconverting molecules — they are multiple valid Lewis drawings of the same molecule that differ only in where electrons are placed. The actual molecule is a single structure whose electron distribution is the weighted average (resonance hybrid) of all contributors. The N-O bonds in NO₃⁻ are all identical at ~1.24 Å, between a single bond (1.36 Å) and a double bond (1.22 Å).",
      },
      {
        wrong:
          "Formal charge zero on every atom means the structure is correct.",
        correct:
          "Zero formal charge is a criterion for the most stable resonance contributor, not a proof of correctness. You must also verify that the total electron count matches the valence electron sum (including any ionic charge), and that all octets are satisfied or have a valid exception.",
      },
      {
        wrong:
          "A double bond is simply two single bonds stuck together and does not affect molecular geometry.",
        correct:
          "A double bond counts as one electron domain in VSEPR theory, not two. CO₂ has two double bonds around carbon but only two electron domains, giving linear geometry (180°). Treating each bond separately would wrongly predict a tetrahedral angle.",
      },
      {
        wrong:
          "Lone pairs and bonding pairs are equivalent — they occupy the same amount of space around an atom.",
        correct:
          "Lone pairs occupy more angular space than bonding pairs because they are held by only one nucleus instead of two. In water, the four electron domains give a baseline of 109.5°, but the two lone pairs compress the H-O-H angle to 104.5°. In ammonia, one lone pair compresses N-H angles to about 107°.",
      },
    ],
    teacherUseCases: [
      "Electron counting before drawing: before opening the simulation, have students independently count total valence electrons for CO₂ (16), SO₃ (24), and NO₃⁻ (24) including the ionic charge — then verify with the counter in the simulation to catch arithmetic errors before structural errors propagate.",
      "Formal charge audit: students draw two competing Lewis structures for SO₂ (one with single bonds only, one with a double bond) and use showFormalCharge=1 to compare formal charges on sulfur and oxygen in each — directly targets the AP Chem 2.C.2 stability criterion.",
      "Resonance misconception probe: load NO₃⁻ (moleculeIndex for nitrate) and ask 'which N-O bond is shortest?' If students point to the double bond, use this to introduce the resonance hybrid concept and the experimentally equal bond lengths (~1.24 Å).",
      "Octet-exception data collection: run through BF₃ (incomplete octet), PCl₅ (expanded octet), and SF₆ (expanded octet) in sequence, recording the electron count around the central atom for each — builds the rule that period-3+ central atoms can exceed 8 electrons.",
      "Structure-to-geometry bridge: after completing a Lewis structure (e.g., H₂O, NH₃, CH₄), have students count bonding domains and lone pairs on the central atom and predict the VSEPR geometry before opening the build-a-molecule simulation to check in 3D.",
    ],
    faq: [
      {
        question: "What is formal charge and how do I calculate it?",
        answer:
          "Formal charge (FC) = valence electrons − nonbonding electrons − ½(bonding electrons). For the oxygen in water: FC = 6 − 4 − ½(4) = 0. For a nitrogen with a double bond to oxygen in NO₂⁺: recalculate with the actual electron counts in that structure. The simulation computes this automatically when showFormalCharge=1; use it to verify your manual calculation.",
      },
      {
        question: "Why does the structure for BF₃ have only 6 electrons around boron even though the octet rule says 8?",
        answer:
          "Boron has only 3 valence electrons and forms 3 bonds, placing 6 electrons in its valence shell. It is electron-deficient but stable because no additional lone pairs are available to form a fourth bond without creating a strongly negative formal charge on boron. BF₃ acts as a Lewis acid precisely because of this unfilled valence shell. AP Chem 2.C.1 includes these octet-rule exceptions explicitly.",
      },
      {
        question: "How does this lab connect to AP Chem 2.C.1 and 2.C.2?",
        answer:
          "AP Chem 2.C.1 requires students to draw Lewis structures for molecules and polyatomic ions, apply the octet rule, and identify exceptions. AP Chem 2.C.2 adds formal charge analysis and resonance. The interactive canvas here covers both: you build the structure (2.C.1), then toggle formal charges and cycle through resonance contributors (2.C.2). NGSS HS-PS1-1 and HS-PS1-3 are also addressed through the model of valence electrons determining bonding behavior.",
      },
      {
        question: "Why do some molecules have multiple valid Lewis structures (resonance)?",
        answer:
          "When a molecule has lone pairs adjacent to a bond, those electrons can be delocalized — spread over more than one bond position while still satisfying the octet rule. Ozone (O₃) has two equivalent major resonance contributors (single + double bond, with the double bond on either side); nitrate (NO₃⁻) has three. None of these drawings alone is the real structure; the electron density is smeared evenly, which is why all equivalent bonds in a resonance hybrid have the same measured length.",
      },
      {
        question: "How do I know when to use a double or triple bond?",
        answer:
          "Use a multiple bond when a central atom still lacks an octet after lone pairs have been distributed to terminal atoms. If the central atom is two electrons short, convert one lone pair on a terminal atom into one additional bond (making a double bond). If it is four electrons short, form a triple bond or two double bonds. Always check that the total electron count equals your initial valence-electron sum.",
      },
    ],
  },
};
