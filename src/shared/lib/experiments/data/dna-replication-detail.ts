import type { Experiment } from "@/shared/types/experiment";

export const dnaReplicationDetail: Experiment = {
  id: "dna-replication-detail",
  slug: "dna-replication-detail",
  title: "DNA Replication (Detailed)",
  subtitle: "Helicase, primase, DNA polymerase, and leading/lagging strand synthesis",
  description:
    "Watch DNA replication unfold at the molecular level. See helicase unwind the double helix, primase lay down RNA primers, DNA polymerase III synthesize new strands, and ligase seal Okazaki fragments. Compare leading strand (continuous) and lagging strand (discontinuous) synthesis.",
  thumbnail: "/imgs/experiments/dna-replication-detail.png",
  standards: { ngss: ["HS-LS1-1"], gcse: [], ap: ["3.A.1"] },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: ["DNA replication", "helicase", "DNA polymerase", "leading strand", "lagging strand", "Okazaki fragments", "AP Biology"],
  difficulty: "advanced",
  parameters: [
    { id: "repSpeed", label: "Replication Speed", unit: "x", min: 0.2, max: 4, default: 1, step: 0.1, tier: "free" },
    { id: "errorRate", label: "Polymerase Error Rate", unit: "%", min: 0, max: 5, default: 0, step: 1, tier: "free" },
  ],
  formulas: [
    { latex: "5' \\rightarrow 3'", description: "DNA polymerase can only add nucleotides in the 5' to 3' direction" },
  ],
  theory: "DNA replication is semi-conservative — each new DNA molecule contains one original and one new strand. Helicase unwinds the double helix at the replication fork. Single-strand binding proteins stabilize the separated strands. Primase synthesizes short RNA primers. DNA polymerase III extends primers in the 5'→3' direction. On the leading strand, synthesis is continuous. On the lagging strand, synthesis is discontinuous, producing Okazaki fragments (~1000-2000 bp in prokaryotes). DNA polymerase I replaces RNA primers with DNA. DNA ligase seals nicks between fragments. The result: two identical DNA molecules.",
  instructions: "Press Play to watch the replication fork advance. Use Replication Speed to slow down or accelerate fork movement, and use Polymerase Error Rate to introduce copying mistakes. Try the Normal Replication, Helicase Blocked, and Pol III Error presets to compare a healthy fork, a stalled fork, and replication without effective proofreading.",
  challenges: [
    { id: "drd-c1", question: "Why is the lagging strand synthesized in fragments?", hint: "DNA polymerase only works 5'→3'. The lagging strand template runs 5'→3' toward the fork, so polymerase must work away from the fork in short bursts", tier: "free" },
    { id: "drd-c2", question: "What would happen if ligase were knocked out?", hint: "Okazaki fragments on the lagging strand would never be joined, leaving nicks in the new DNA that could lead to strand breaks", tier: "pro" },
  ],
  wave: 12, tier: "free", estimatedTime: 25,
  relatedExperiments: ["cell-structure-3d"],
  htmlPath: "/experiments/ap-biology/dna-replication-detail.html",
  seoTitle: "DNA Replication Detailed Simulation | Scivra AP Biology",
  seoKeywords: ["DNA replication simulation", "helicase polymerase interactive", "leading lagging strand", "AP Biology"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "DNA Replication" },
  htmlControlAliases: { repSpeed: "sl-repspeed", errorRate: "sl-errrate" },
  presets: [
    { id: "normal", label: "Normal Replication", description: "Runs the replication fork with typical enzyme coordination and low copying error. Use it as the baseline for comparing speed, strand directionality, and fragment joining." },
    { id: "blocked", label: "Helicase Blocked", description: "Shows what happens when helicase cannot unwind the parental double helix. The fork stalls because polymerases cannot copy a template that remains zipped together." },
    { id: "error", label: "Pol III Error (no proofreading)", description: "Models a replication condition where DNA polymerase III makes errors without normal proofreading. Use it to connect molecular copying mistakes with mutation risk and fidelity mechanisms." },
  ],
  contentSections: {
    whatIsIt:
      "DNA replication is the molecular process every dividing cell runs to copy its genome — humans copy all 3.2 billion base pairs in roughly 8 hours by firing thousands of origins at once. The process is semi-conservative: each new DNA double helix contains one original strand and one freshly built strand, evidence Meselson and Stahl built up in 1958. Helicase unzips the double helix at the replication fork; primase drops short RNA primers to give polymerase a foothold; the replicative DNA polymerase races along, adding nucleotides only in the 5'→3' direction. (This simulation uses the well-characterized E. coli replisome with DNA polymerase III as its model; eukaryotes use polymerases α, δ, and ε for the same logic.) That directionality constraint is why the lagging strand is built in reverse chunks called Okazaki fragments — each about 1,000–2,000 base pairs in prokaryotes.",
    parameterExplanations: {
      repSpeed:
        "Replication Speed controls how quickly the fork animation moves, from 0.2× for close observation to 4× for a compressed overview. Slow speeds are useful when students need to track helicase opening the fork, primase placing RNA primers, and DNA polymerase extending each strand in the 5'→3' direction. Faster speeds help reveal the system-level pattern: continuous leading-strand synthesis happening beside discontinuous lagging-strand synthesis. Keep the preset on Normal Replication first, then change only this slider so students can separate playback rate from the underlying molecular mechanism.",
      errorRate:
        "Polymerase Error Rate controls how often the simulation introduces copying mistakes during strand synthesis. At 0%, the fork represents high-fidelity replication with normal proofreading logic. Raising the slider makes mismatches easier to observe and gives students a concrete way to discuss why DNA polymerase accuracy and repair pathways matter. Use a low value to show occasional mistakes, or compare it with the Pol III Error preset to emphasize what happens when proofreading is compromised. This slider supports discussions of mutation without implying that every replication error automatically becomes a permanent inherited change.",
    },
    misconceptions: [
      {
        wrong:
          "DNA replication is conservative — the original double helix stays intact and a brand-new copy is made from scratch.",
        correct:
          "Replication is semi-conservative, not conservative. Meselson and Stahl (1958) grew E. coli in heavy nitrogen (¹⁵N) then switched to ¹⁴N and spun DNA in a density gradient after each generation. After one replication, all DNA settled at a single intermediate-density band — which ruled out conservative replication. After two replications, half the DNA stayed at intermediate density and half shifted to light, which then ruled out dispersive replication and confirmed semi-conservative. AP Bio 3.A.1 and HS-LS1-1 both reference this mechanistic evidence.",
      },
      {
        wrong:
          "Both strands of DNA are replicated the same way — polymerase just runs along each template in the same direction.",
        correct:
          "DNA polymerase can only add nucleotides in the 5'→3' direction. Because the two template strands run antiparallel, polymerase moves toward the fork on the leading strand (continuous synthesis) but must synthesize away from the fork in short bursts on the lagging strand, producing Okazaki fragments that are later joined by ligase.",
      },
      {
        wrong:
          "Primase and DNA polymerase do the same job — they both build the new strand.",
        correct:
          "Primase synthesizes a short RNA primer (~10 nucleotides) that gives DNA polymerase III a free 3'-OH end to extend. DNA polymerase cannot start a new chain from scratch — it can only add to an existing strand. After synthesis, DNA polymerase I removes the RNA primer and replaces it with DNA; then ligase seals the nick.",
      },
      {
        wrong:
          "Students often think DNA polymerase works alone and there is just one enzyme involved in replication.",
        correct:
          "At least five enzymes cooperate at each replication fork: helicase (unwinds), primase (primes), DNA polymerase III (synthesizes), DNA polymerase I (primer replacement), and ligase (seals nicks). Single-strand binding proteins and topoisomerases also participate. The replisome is a multiprotein machine, not a single enzyme.",
      },
    ],
    teacherUseCases: [
      "Leading vs. lagging strand comparison: run the Normal Replication preset and pause the animation at several time points — ask students to record the direction of each polymerase relative to the fork and explain why they differ, generating written justification for the 5'→3' rule.",
      "Helicase checkpoint discussion: switch from Normal Replication to Helicase Blocked and ask students to identify which downstream steps stop first, then connect that observation to why template unwinding must happen before polymerase extension.",
      "Meselson-Stahl reconstruction: before showing the simulation, have students predict what density-gradient results would look like after 1, 2, and 3 rounds of replication for conservative, semi-conservative, and dispersive models; then use the simulation to confirm semi-conservative behavior, connecting AP Bio 3.A.1 evidence to mechanism.",
      "Okazaki fragment data collection: set Replication Speed near the low end and count how many Okazaki fragments form on the lagging strand per complete fork advance; compare to the biological value (~1,000–2,000 bp per fragment in E. coli at ~1,000 nt/s) and discuss what variables affect fragment length.",
      "Proofreading and mutation mini-lab: raise Polymerase Error Rate, then compare the result with the Pol III Error preset so students can explain how replication fidelity reduces, but does not erase, mutation risk.",
    ],
    faq: [
      {
        question: "Why can DNA polymerase only build in the 5' to 3' direction?",
        answer:
          "DNA polymerase catalyzes a nucleophilic attack by the 3'-OH of the last nucleotide on the alpha-phosphate of an incoming dNTP. The reaction requires a free 3'-OH and releases pyrophosphate, which hydrolysis drives thermodynamically. There is no analogous chemistry at the 5' end, so 3'→5' synthesis is chemically impossible for this enzyme family.",
      },
      {
        question: "What exactly is an Okazaki fragment and how long is it?",
        answer:
          "An Okazaki fragment is a short piece of newly synthesized DNA on the lagging strand, each starting with an RNA primer and extending until the polymerase runs into the previous fragment's primer. In E. coli they are approximately 1,000–2,000 base pairs; in eukaryotes they are shorter, around 100–200 base pairs, because eukaryotic DNA is wrapped around nucleosomes that interrupt synthesis more frequently.",
      },
      {
        question: "How does this simulation relate to AP Bio 3.A.1 and HS-LS1-1?",
        answer:
          "AP Bio 3.A.1 requires students to explain how DNA is replicated with high fidelity and why the semi-conservative mechanism ensures faithful transmission of genetic information. HS-LS1-1 requires students to ask questions about DNA replication and its role in inheritance. The enzyme-by-enzyme animation directly maps to the molecular evidence that both standards require students to analyze.",
      },
      {
        question: "What happens if helicase stops working?",
        answer:
          "Without helicase, the double helix cannot be unwound at the replication fork and synthesis halts entirely. Some antiviral drugs target a viral helicase or helicase-primase complex specifically (the herpesvirus drug pritelivir is one example), halting viral genome replication without affecting the human replisome. Mutations in human helicases cause syndromes like Werner syndrome (accelerated aging), because DNA repair pathways that also use helicase activity fail.",
      },
      {
        question: "How fast does DNA replication actually happen?",
        answer:
          "E. coli DNA polymerase III adds approximately 1,000 nucleotides per second. Human DNA polymerase delta is slower, around 50 nucleotides per second, but humans compensate by firing thousands of replication origins simultaneously across the genome. The entire 3.2-billion-bp human genome replicates in roughly 6–8 hours.",
      },
    ],
  },
};
