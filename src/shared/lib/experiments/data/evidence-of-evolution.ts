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
      id: "evidenceType",
      label: "Evidence Type (0=Anatomy 1=Fossil 2=Molecular 3=Tree)",
      unit: "",
      min: 0,
      max: 3,
      default: 3,
      step: 1,
      tier: "free",
    },
    {
      id: "speciesCount",
      label: "Species to Compare",
      unit: "",
      min: 3,
      max: 8,
      default: 5,
      step: 1,
      tier: "free",
    },
    {
      id: "timeDepth",
      label: "Time Depth (Mya)",
      unit: "Mya",
      min: 10,
      max: 500,
      default: 100,
      step: 10,
      tier: "pro",
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
    "Switch between four evidence views using the Evidence Type slider. In Tree view, explore the phylogenetic tree and click species to highlight branches. In Anatomy view, compare homologous limb structures across vertebrates. In Fossil view, scroll through a stratigraphic timeline. In Molecular view, see DNA sequence alignment and similarity percentages.",

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
  contentSections: {
    whatIsIt:
      "Evolution is the change in inherited traits across generations, and four independent lines of evidence converge to support it: comparative anatomy, the fossil record, molecular biology, and biogeography. A whale flipper and a human arm share the same bone arrangement — humerus, radius, ulna, carpals — because they descended from the same ancestor, not because flippers are useful. Molecular evidence is even more precise: cytochrome c protein sequences differ by just 1 amino acid between humans and chimpanzees but by 14 between humans and yeast, mirroring the pattern the fossil record already suggested. This simulation lets you toggle between all four evidence types, adjust how many species you compare, and stretch the time axis to 500 million years to watch sequence divergence accumulate on a phylogenetic tree.",
    parameterExplanations: {
      evidenceType:
        "Selects which line of evidence the visualization displays: 0 = comparative anatomy (limb homology across vertebrates), 1 = fossil record (stratigraphic timeline of transitional forms), 2 = molecular data (DNA/protein sequence alignment and percent divergence), 3 = phylogenetic tree (cladogram built from shared derived characters). Switching between modes lets you verify that each independent dataset points to the same branching pattern.",
      speciesCount:
        "Sets how many species are loaded into the comparison, from 3 to 8. Adding more species increases the number of pairwise comparisons visible in molecular mode and adds more branch tips to the tree, making the pattern of increasing divergence with evolutionary distance easier to read.",
      timeDepth:
        "Sets the depth of the time axis in millions of years ago (Mya), from 10 to 500. In molecular mode this controls how far back the molecular clock is run; in fossil mode it sets the oldest stratum displayed. A setting of 100 Mya captures the mammal radiation; 500 Mya reaches the Cambrian and shows the deep split between vertebrate classes.",
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
      "Pre-lab prediction exercise: show students the four evidence type buttons and ask them to predict whether all four will produce the same branching pattern for five chosen species. Record predictions, then run the simulation to compare — use the disagreements to introduce why convergence of independent evidence strengthens a scientific claim.",
      "Molecular clock calculation activity: set timeDepth to 500 Mya, switch to molecular mode, and record percent divergence between three pairs of species. Have students apply t = d/(2μ) with μ = 1% per 10 Mya to calculate divergence times and compare with the displayed tree node ages.",
      "Homologous vs. analogous structure sort: pause on anatomy mode with speciesCount = 6, screenshot the limb comparison panel. Students sort each structure pair as homologous or analogous and justify using developmental origin, not function — probes the most common AP exam misconception.",
      "Data collection — divergence vs. relatedness: students record percent sequence divergence for all pairwise species combinations in molecular mode and plot divergence vs. node depth from the tree. The positive linear trend demonstrates that sequence divergence is a quantitative proxy for evolutionary distance.",
      "Standards connection — HS-LS4-1 evidence analysis: assign each lab group one evidence type to build a written argument supporting the claim that the given species share common ancestry, citing at least two specific observations from the simulation. Groups then share arguments and discuss whether any evidence type alone would be sufficient.",
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
        question: "Why does the simulation show ribosomal RNA as a molecular evidence type?",
        answer:
          "Ribosomal RNA (rRNA) is nearly universal across life and evolves slowly, making it ideal for comparing distantly related organisms — Carl Woese used 16S rRNA to establish the three-domain tree of life. Cytochrome c, another option in the simulation, is a respiratory protein conserved across eukaryotes; humans and chimpanzees differ at 0 positions, while humans and yeast differ at 14 out of 104, quantifying the depth of the split.",
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
