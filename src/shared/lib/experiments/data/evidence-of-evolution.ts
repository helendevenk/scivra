import type { Experiment } from "@/shared/types/experiment";

export const evidenceOfEvolution: Experiment = {
  id: "evidence-of-evolution",
  slug: "evidence-of-evolution",
  title: "Evidence of Evolution",
  subtitle:
    "Phylogenetic trees, homologous structures, and fossil record analysis",
  description:
    "Examine the key lines of evidence supporting biological evolution. Explore interactive phylogenetic trees showing evolutionary relationships, compare homologous and analogous structures across species, analyze fossil record sequences, and investigate molecular evidence through DNA/protein sequence alignment. Build your understanding of descent with modification.",
  thumbnail: "/imgs/experiments/evidence-of-evolution.png",

  standards: {
    ngss: ["HS-LS4-1", "HS-LS4-2", "HS-LS4-4"],
    gcse: [],
    ap: ["7.A.1", "7.B.1", "7.C.1"],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: [
    "evolution",
    "phylogenetic tree",
    "homologous structures",
    "fossil record",
    "molecular evidence",
    "common ancestry",
    "AP Biology",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "timeScale",
      label: "Time Scale",
      unit: "mya",
      min: 100,
      max: 3800,
      default: 3800,
      step: 100,
      tier: "free",
    },
    {
      id: "sequenceSimilarity",
      label: "Sequence Similarity",
      unit: "pair",
      min: 0,
      max: 3,
      default: 0,
      step: 1,
      tier: "free",
    },
    {
      id: "rotationSpeed",
      label: "Rotation Speed",
      unit: "level",
      min: 0,
      max: 3,
      default: 1,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex:
        "d = \\frac{\\text{mutations}}{\\text{total sites}} \\times 100\\%",
      description:
        "Sequence divergence: percentage of differing nucleotides between two aligned sequences",
    },
    {
      latex: "t = \\frac{d}{2\\mu}",
      description:
        "Molecular clock: divergence time estimated from sequence divergence (d) and mutation rate (μ)",
    },
  ],

  theory:
    "Evolution is supported by converging evidence from multiple fields. Comparative anatomy reveals homologous structures (same developmental origin, different function — e.g., human arm vs. whale flipper) indicating common ancestry, and analogous structures (different origin, similar function — e.g., bird wing vs. insect wing) showing convergent evolution. The fossil record documents transitional forms (e.g., Tiktaalik between fish and tetrapods) and patterns of appearance/extinction. Molecular biology provides the strongest evidence: DNA and protein sequence comparisons show that more closely related species share more similar sequences. The molecular clock hypothesis proposes that neutral mutations accumulate at a roughly constant rate, allowing estimation of divergence times. Phylogenetic trees (cladograms) organize this evidence into branching diagrams showing evolutionary relationships based on shared derived characters (synapomorphies).",

  instructions:
    "Use the Fossil Timeline, Molecular Phylogeny, and Comparative Anatomy presets to switch evidence views. In Fossil Timeline, move the Time Scale slider to focus the fossil record from 100 to 3800 mya. In Molecular Phylogeny, use Sequence Similarity to compare cytochrome c pairs. Use Rotation Speed to slow, pause, or speed up the 3D scene while students inspect the evidence.",

  challenges: [
    {
      id: "evo-c1",
      question:
        "Why are homologous structures evidence of common ancestry but analogous structures are not?",
      hint: "Homologous structures share the same embryonic origin and bone pattern despite different functions — inherited from a common ancestor. Analogous structures evolved independently under similar selective pressures.",
      tier: "free",
    },
    {
      id: "evo-c2",
      question:
        "Two species have 5% DNA sequence divergence. If the mutation rate is 1% per 10 million years, when did they diverge?",
      hint: "t = d/(2μ) = 0.05/(2 × 0.001) = 25 million years ago (divide by 2 because both lineages accumulate mutations).",
      tier: "free",
    },
    {
      id: "evo-c3",
      question:
        "How does biogeography (geographic distribution of species) support evolution? Give an example.",
      hint: "Island species resemble nearby mainland species more than distant island species with similar environments — colonization + local adaptation, not independent creation.",
      tier: "pro",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["natural-selection", "population-dynamics"],
  htmlPath: "/experiments/ap-biology/evidence-of-evolution.html",

  seoTitle: "Evidence of Evolution Interactive | Scivra AP Biology",
  seoKeywords: [
    "evidence of evolution interactive",
    "phylogenetic tree builder",
    "homologous structures comparison",
    "molecular clock calculator",
    "AP Biology evolution",
    "fossil record virtual lab",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Evidence of Evolution and Phylogenetics",
  },
  htmlControlAliases: {
    timeScale: "sl-time",
    sequenceSimilarity: "sl-sim",
    rotationSpeed: "sl-rot",
  },
  presets: [
    {
      id: "0",
      label: "Fossil Timeline",
      description:
        "Shows fossil strata from early prokaryotes through modern humans. Use it to connect rock-layer sequence, transitional fossils, and major evolutionary events across deep time.",
    },
    {
      id: "1",
      label: "Molecular Phylogeny",
      description:
        "Compares cytochrome c similarity between humans and selected taxa. The view makes molecular relatedness visible as percent identity and branching distance.",
    },
    {
      id: "2",
      label: "Comparative Anatomy",
      description:
        "Displays homologous forelimb bones in human, whale, bat, and horse examples. Shared bone colors emphasize common origin despite different functions.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Evolution is the change in inherited traits across generations, and four converging lines of evidence support it: comparative anatomy, the fossil record, molecular biology, and phylogenetic trees built from those data. A whale flipper and a human arm share the same bone arrangement — humerus, radius, ulna, carpals — because they descended from the same ancestor, not because flippers are useful. Molecular evidence is even more precise: human and chimpanzee cytochrome c are identical (0 differences out of 104 residues), while humans and yeast differ at roughly 44 of 104 — a gap that mirrors the deep evolutionary distance the fossil record already suggested. This simulation lets you toggle between four evidence modes, adjust how many species you compare, and stretch the time axis to 500 million years to watch sequence divergence accumulate on a phylogenetic tree.",
    parameterExplanations: {
      timeScale:
        "Time Scale controls how much evolutionary time the fossil view spans, from 100 mya to 3800 mya. A shorter setting keeps attention on relatively recent events, while the full 3800 mya setting places prokaryotes, eukaryotes, multicellular life, the Cambrian explosion, mass extinctions, hominins, and Homo sapiens on one compressed sequence. Use the Fossil Timeline preset first, then move this slider to ask which events remain visible at each scale. Students can connect deeper time to broader evolutionary transitions and see why a fossil record is ordered by age, not by a ladder of progress.",
      sequenceSimilarity:
        "Sequence Similarity selects the cytochrome c comparison shown in the molecular evidence view. The slider steps through human-chimp, human-rhesus, human-dog, and human-yeast examples, with identity values moving from nearly identical to much more divergent. In the Molecular Phylogeny preset, students can compare the displayed percent identity with the distance of each taxon from the human node. The goal is not to memorize the exact pairs, but to observe the pattern: more shared sequence usually indicates a more recent common ancestor, while lower similarity points to a deeper split.",
      rotationSpeed:
        "Rotation Speed changes how quickly the 3D scene turns while students inspect fossil strata, molecular nodes, or homologous limb bones. Off is useful when students need to sketch, read values, or compare bone positions. Normal keeps the scene gently moving for classroom demonstration. Fast and Very Fast make the spatial layout easier to notice, but they can distract from measurements if used during data collection. Use this slider as an observation control: keep it low for evidence gathering, then increase it when you want students to see the full structure from multiple angles.",
    },
    misconceptions: [
      {
        wrong:
          "Analogous structures — like a bat wing and an insect wing — are evidence of common ancestry because they both do the same job.",
        correct:
          "Shared function is not evidence of shared ancestry. Bat wings contain modified vertebrate forelimb bones; insect wings are extensions of the exoskeleton — completely different developmental origins. Analogous structures are evidence of convergent evolution under similar selective pressure, not common descent.",
      },
      {
        wrong:
          "Molecular evidence is weaker than fossils because DNA decays and can't be read from ancient specimens.",
        correct:
          "Molecular comparisons between living species don't require ancient DNA at all. Comparing cytochrome c or ribosomal RNA sequences in organisms alive today generates an independent phylogenetic tree that matches the fossil record — and the molecular clock allows divergence time estimates even without a single fossil.",
      },
      {
        wrong:
          "Gaps in the fossil record disprove evolution because we'd see every transitional form if it were true.",
        correct:
          "Fossilization requires specific conditions, so the record is incomplete by nature. Tiktaalik, Archaeopteryx, and numerous whale ancestors show clear transitions where sedimentary conditions happened to preserve them. The existence of any transitional form is more informative than its absence.",
      },
      {
        wrong:
          "Homologous structures prove that species evolved from each other — for example, that humans evolved from whales.",
        correct:
          "Homologous structures indicate common ancestry, not a direct ancestor-descendant relationship between modern species. Humans and whales share a common mammalian ancestor; neither evolved from the other. The phylogenetic tree shows branching from shared nodes, not a linear chain.",
      },
      {
        wrong:
          "If two species look similar, they must be closely related — similarity is the main indicator of relatedness.",
        correct:
          "Appearance can be misleading because of convergent evolution. Dolphins (mammals) and sharks (fish) look similar but are distantly related. Molecular sequence data and shared derived characters, not overall similarity, determine true evolutionary relationships.",
      },
    ],
    teacherUseCases: [
      "Pre-lab prediction exercise: show students the Fossil Timeline, Molecular Phylogeny, and Comparative Anatomy presets and ask what evidence each view should provide for common ancestry. Record predictions, then compare them with observations from the simulation.",
      "Molecular evidence activity: open the Molecular Phylogeny preset and move Sequence Similarity through each pair. Students record percent identity, rank the comparisons from most to least related, and justify their ranking using sequence data.",
      "Fossil record scale check: use the Fossil Timeline preset and move Time Scale from 100 mya to 3800 mya. Students list which major events appear at each scale and explain why deep time is needed to interpret broad evolutionary transitions.",
      "Homologous structure sort: open Comparative Anatomy, set Rotation Speed to Off or Normal, and have students identify the same colored forelimb bones across human, whale, bat, and horse examples. Their justification should use developmental origin, not current function.",
      "Standards connection — HS-LS4-1 evidence analysis: assign each lab group one preset to build a written argument supporting common ancestry, citing at least two specific observations from the simulation. Groups then compare whether one evidence source alone is as convincing as converging independent evidence.",
    ],
    faq: [
      {
        question: "What is the difference between homologous and analogous structures?",
        answer:
          "Homologous structures share the same developmental origin and bone plan, inherited from a common ancestor, even if their current function differs — the human arm, cat foreleg, whale flipper, and bat wing all have the same five-digit pattern. Analogous structures perform similar functions but evolved independently from different ancestral structures. The anatomy mode in the simulation highlights homologous vertebrate forelimbs; all share the humerus-radius-ulna arrangement despite different ecological roles.",
      },
      {
        question: "How does the molecular clock work, and how reliable is it?",
        answer:
          "The molecular clock assumes neutral mutations accumulate at a roughly constant rate. If two species share 5% sequence divergence and the mutation rate is 1% per 10 million years, the formula t = d/(2μ) gives a split time of 25 Mya. Reliability varies by gene: slowly evolving genes like ribosomal RNA are used for deep splits (bacteria vs. eukaryotes), while faster-evolving mitochondrial genes resolve more recent splits. Calibrating the clock against fossils with known dates improves accuracy.",
      },
      {
        question: "Why does the simulation use cytochrome c as molecular evidence?",
        answer:
          "Cytochrome c is a respiratory protein conserved across many eukaryotes, so its amino acid sequence can be compared across very different organisms. Closely related species tend to have fewer differences: humans and chimpanzees are identical in this example, while human and yeast sequences differ far more. That pattern helps students connect molecular similarity with recency of common ancestry. Other molecules, including ribosomal RNA, are also useful in evolutionary biology, but this simulation's molecular view focuses on cytochrome c.",
      },
      {
        question: "How does this lab connect to AP Biology standard 7.A.1?",
        answer:
          "AP Bio standard 7.A.1 (Big Idea 7, Evolution) requires students to describe the evidence of evolution at multiple scales — morphological, geological, and molecular. This simulation addresses all three in a single interface, letting students switch between evidence types and explain why each supports descent with modification. NGSS HS-LS4-1 similarly asks students to analyze data from multiple sources as evidence for common ancestry.",
      },
      {
        question: "What is a synapomorphy and why does it matter for building phylogenetic trees?",
        answer:
          "A synapomorphy is a shared derived character — a trait that evolved in the common ancestor of a group and was inherited by all its descendants, but is absent in outgroup species. Examples include the amniotic egg (shared by reptiles, birds, and mammals) and hair (shared by all mammals). Phylogenetic trees are built by grouping species that share synapomorphies; overall similarity or shared ancestral traits (symplesiomorphies) do not count.",
      },
      {
        question: "Can evolution be observed directly, or is all evidence indirect?",
        answer:
          "Evolution is directly observable in real time in organisms with short generations. Bacterial antibiotic resistance, the beak depth changes in Galapagos finches during the 1977 drought (measured at 9.96 mm pre-drought to 10.68 mm post-drought by Peter and Rosemary Grant), and the evolution of pesticide resistance in insects are all documented cases. The simulation's time axis compresses millions of years into seconds, but the mechanism is the same differential survival and reproduction observable in living populations.",
      },
    ],
  },
};
