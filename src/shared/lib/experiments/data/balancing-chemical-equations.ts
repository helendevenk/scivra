import type { Experiment } from "@/shared/types/experiment";

export const balancingChemicalEquations: Experiment = {
  id: "balancing-chemical-equations",
  slug: "balancing-chemical-equations",
  title: "Balancing Chemical Equations",
  subtitle: "Conservation of mass through coefficient adjustment",
  description:
    "Master the art of balancing chemical equations by adjusting coefficients to satisfy conservation of mass. Drag coefficients onto reactants and products, watch real-time atom counts update, and verify that every element balances. Progress through increasingly complex reactions from synthesis to redox.",
  thumbnail: "/imgs/experiments/balancing-chemical-equations.png",

  standards: {
    ngss: ["HS-PS1-7"],
    gcse: ["C4.1", "C4.2"],
    ap: ["4.A.1", "4.B.1"],
  },
  primaryStandard: "ap-chemistry",
  category: "chemistry",
  subject: "chemistry",
  gradeLevel: "9-12",
  tags: [
    "balancing equations",
    "stoichiometry",
    "conservation of mass",
    "coefficients",
    "AP Chemistry",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "reactionIndex",
      label: "Reaction",
      unit: "",
      min: 0,
      max: 7,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "showHints",
      label: "Show Hints (0=Off, 1=On)",
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
      latex:
        "\\text{Reactants (atoms)} = \\text{Products (atoms)} \\quad \\text{(Conservation of Mass)}",
      description:
        "In a balanced equation, the number of atoms of each element is equal on both sides",
    },
    {
      latex:
        "a\\,\\text{A} + b\\,\\text{B} \\rightarrow c\\,\\text{C} + d\\,\\text{D}",
      description:
        "Coefficients a, b, c, d are the smallest whole numbers that balance all elements",
    },
  ],

  theory:
    "Chemical equations represent reactions where atoms rearrange but are never created or destroyed (Law of Conservation of Mass, Lavoisier 1789). Balancing means finding the smallest set of integer coefficients so that every element has equal atom counts on both sides. Strategy: balance metals first, then nonmetals, then hydrogen, and oxygen last. For combustion reactions, balance C first, then H, then O. Redox reactions may require half-reaction balancing. A balanced equation is the foundation of stoichiometry — it tells you the mole ratios needed for quantitative calculations.",

  instructions:
    "Select a reaction from the dropdown. Use the + and − buttons (or click the coefficient) to adjust each coefficient. The atom inventory panel shows real-time counts for each element on both sides. When all elements match, the equation turns green and you earn a ✓. Try all 8 reactions, from simple synthesis to combustion and redox.",

  challenges: [
    {
      id: "bce-c1",
      question: "Balance: H₂ + O₂ → H₂O",
      hint: "2 H₂ + O₂ → 2 H₂O. Left: 4H, 2O. Right: 4H, 2O. ✓",
      tier: "free",
    },
    {
      id: "bce-c2",
      question: "Balance: Fe + O₂ → Fe₂O₃",
      hint: "4 Fe + 3 O₂ → 2 Fe₂O₃. Left: 4Fe, 6O. Right: 4Fe, 6O. ✓",
      tier: "free",
    },
    {
      id: "bce-c3",
      question: "Balance: C₃H₈ + O₂ → CO₂ + H₂O (combustion of propane)",
      hint: "C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O. Left: 3C, 8H, 10O. Right: 3C, 8H, 10O. ✓",
      tier: "free",
    },
    {
      id: "bce-c4",
      question:
        "Balance: KMnO₄ + HCl → KCl + MnCl₂ + H₂O + Cl₂ (redox reaction)",
      hint: "2 KMnO₄ + 16 HCl → 2 KCl + 2 MnCl₂ + 8 H₂O + 5 Cl₂. This is an oxidation-reduction reaction requiring careful electron balance.",
      tier: "pro",
    },
  ],

  wave: 9,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["stoichiometry", "reaction-kinetics"],
  htmlPath: "/experiments/ap-chemistry/balancing-chemical-equations.html",

  seoTitle:
    "Balancing Chemical Equations Interactive Simulator | Scivra AP Chemistry",
  seoKeywords: [
    "balancing chemical equations",
    "chemical equation balancer",
    "conservation of mass simulation",
    "stoichiometry practice",
    "AP Chemistry equations",
    "balance reactions interactive",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Balancing Chemical Equations",
  },
  contentSections: {
    whatIsIt:
      "A balanced chemical equation is the quantitative record of a chemical reaction: it lists every reactant and product, and the integer coefficients in front of each formula ensure that the number of atoms of every element is identical on both sides. This is a direct expression of the Law of Conservation of Mass (Lavoisier, 1789) — atoms are neither created nor destroyed in a chemical reaction, only rearranged. AP Chem 4.A.1 and 4.B.1 require you to write and balance equations as the first step in any stoichiometric calculation; a wrong coefficient gives a wrong mole ratio, which cascades into every downstream calculation. This simulation presents 8 reactions of increasing complexity, from simple synthesis to redox, with a live atom-count tally that shows in real time when each element is balanced.",
    parameterExplanations: {
      reactionIndex:
        "Selects which of the 8 equations to balance (range 0–7, default 0). Reactions progress from straightforward synthesis and decomposition examples at low indices to combustion and redox reactions at higher indices. Work through them in order to build coefficient-balancing strategy: metals first, then nonmetals, then hydrogen, then oxygen last for combustion.",
      showHints:
        "Enables or disables coaching hints displayed beneath the equation (0 = off, 1 = on). With hints on, a suggested first step is shown after a delay of incorrect attempts. Turn hints off for exam-practice mode; use hints on when learning the strategy for a new reaction type.",
    },
    misconceptions: [
      {
        wrong:
          "You can change the subscripts in a formula to balance an equation if the coefficients don't work out to whole numbers.",
        correct:
          "Subscripts define the compound's chemical identity — changing H₂O to H₃O changes the substance entirely. Only coefficients (the numbers in front of whole formulas) may be adjusted to balance an equation. Changing a subscript is not balancing; it is writing a different, incorrect reaction.",
      },
      {
        wrong:
          "If you can't get whole-number coefficients, fractional coefficients are acceptable in a final answer.",
        correct:
          "By convention, balanced equations use the smallest set of whole-number (integer) coefficients. If you reach fractional coefficients as an intermediate step (common in combustion), multiply every coefficient through by the denominator to clear fractions. For example, C₂H₆ + 7/2 O₂ → 2 CO₂ + 3 H₂O becomes 2 C₂H₆ + 7 O₂ → 4 CO₂ + 6 H₂O.",
      },
      {
        wrong:
          "A coefficient of 1 in front of a formula must be written explicitly.",
        correct:
          "A coefficient of 1 is implicit and is omitted by convention, just like a subscript of 1 inside a formula. Writing '1 H₂O' is not wrong, but '1' is never required and is typically dropped in the final answer.",
      },
      {
        wrong:
          "Balancing an equation proves the reaction actually occurs or that the products listed are correct.",
        correct:
          "Balancing only checks atom conservation for a given set of reactants and products. It says nothing about whether the reaction is thermodynamically favorable, kinetically fast, or produces those particular products. A perfectly balanced equation for an impossible reaction is still balanced — correctness of the reactants and products comes from experimental evidence, not from balancing.",
      },
      {
        wrong:
          "For combustion reactions, balance oxygen first because there are usually the most oxygen atoms.",
        correct:
          "Balance oxygen last in combustion reactions. Carbon is balanced first (from CₓHᵧ → x CO₂), then hydrogen (y/2 H₂O), and only then oxygen, because O appears in both CO₂ and H₂O on the product side and the O₂ coefficient absorbs whatever total is needed. Doing oxygen first forces you to re-balance it after adjusting C and H.",
      },
    ],
    teacherUseCases: [
      "Stepwise strategy demonstration: project reactionIndex = 2 (combustion of propane) and walk through the C-first, H-second, O-last strategy live, updating coefficients one element at a time while the atom tally updates on screen. This makes the algorithm visible before students work independently.",
      "Misconception probe — subscript vs. coefficient: set reactionIndex = 0 (H₂ + O₂ → H₂O) and ask a student volunteer to balance it. If they attempt to write H₂O₂, pause the class and use the simulation to show that changing the formula generates a different compound (hydrogen peroxide) with a different atom count, not the desired water.",
      "Timed exam-prep drill: turn showHints off, display each of the 8 reactions for 90 seconds, and have students write coefficients on mini-whiteboards before comparing to the simulation. Identify which reaction types (redox, combustion) take the longest and target extra practice there.",
      "Data collection — atom inventory logging: for reactions 0–4, have students record the unbalanced atom counts (left and right), then the balanced coefficients, and tabulate them. Ask students to derive the balancing strategy from the pattern in their own data rather than being told.",
      "Peer teaching activity: once students master reactions 0–3, pair them with reactions 4–7 (harder combustion and redox). Each pair must explain their balancing approach to another pair and justify why each coefficient is necessary, reinforcing the Law of Conservation of Mass rationale.",
    ],
    faq: [
      {
        question: "What order should I balance elements when starting a new equation?",
        answer:
          "A reliable sequence for most reactions: (1) balance metals, (2) balance nonmetals other than H and O, (3) balance hydrogen, (4) balance oxygen last. For combustion specifically, balance C first, then H, then O, because O₂ is the only oxygen source and its coefficient is determined after C and H are fixed. AP Chem 4.A.1 does not specify a required method, but having a consistent strategy reduces errors.",
      },
      {
        question: "Why must the equation be balanced before I can do stoichiometry?",
        answer:
          "Stoichiometry uses the coefficients as mole ratios. An unbalanced — or incorrectly balanced — equation gives wrong mole ratios, which propagates errors into every calculated quantity: limiting reagent, theoretical yield, and percent yield. The balanced equation is the foundation; a single wrong coefficient can flip which reagent is limiting. AP Chem 4.B.1 links equation balancing directly to quantitative stoichiometric reasoning.",
      },
      {
        question: "What is the difference between a coefficient and a subscript?",
        answer:
          "A coefficient is the number written before an entire chemical formula (e.g., the 2 in 2 H₂O) and indicates how many formula units of that substance are involved. A subscript is written within a formula (e.g., the 2 in H₂O) and indicates how many atoms of that element are in one formula unit. Only coefficients can be changed when balancing; subscripts are fixed by the compound's identity.",
      },
      {
        question: "How do I balance a combustion reaction efficiently?",
        answer:
          "For a complete combustion CₓHᵧ + O₂ → CO₂ + H₂O: set the coefficient of the hydrocarbon to 1, balance C by setting CO₂ coefficient to x, balance H by setting H₂O coefficient to y/2, then sum all oxygen atoms on the right side to determine the O₂ coefficient. If the O₂ coefficient is fractional (e.g., 7/2), multiply every coefficient by 2. For propane: C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O — left: 3C, 8H, 10O; right: 3C, 8H, 10O.",
      },
      {
        question: "Can I check my balanced equation without the simulation?",
        answer:
          "Yes: make a two-column atom tally. List every element; for each side, multiply each formula's subscript by the coefficient and sum across all formulas containing that element. Both columns must match for every element. For ionic or redox equations, also verify that total charge is equal on both sides. This tally method is what the simulation's atom-count panel automates.",
      },
      {
        question: "How does balancing connect to AP Chem 4.A.1 and 4.B.1?",
        answer:
          "AP Chem 4.A.1 establishes that stoichiometry is grounded in the conservation of atoms, and AP Chem 4.B.1 extends this to net ionic equations and reaction classification. On the AP exam, free-response questions routinely begin with 'write and balance the equation for...' before asking for a mole calculation — meaning a wrong equation in part (a) can cost points across multiple parts. Treat equation balancing as a prerequisite skill, not an afterthought.",
      },
    ],
  },
};
