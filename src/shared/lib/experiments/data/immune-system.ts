import type { Experiment } from "@/shared/types/experiment";

export const immuneSystem: Experiment = {
  id: "immune-system",
  slug: "immune-system",
  title: "Immune System",
  subtitle:
    "Innate and adaptive immunity: antigens, antibodies, and immunological memory",
  description:
    "Explore how the human immune system defends against pathogens. Trigger an immune response and watch innate defenses activate, then observe adaptive immunity as B cells produce antibodies that bind antigens. Track the formation of memory cells and see how vaccination primes the immune system for faster secondary responses.",
  thumbnail: "/imgs/experiments/immune-system.png",

  standards: {
    ngss: ["HS-LS1-2"],
    gcse: [],
    ap: ["8.A.1", "8.B.1", "8.C.1"],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: [
    "immune system",
    "innate immunity",
    "adaptive immunity",
    "B cells",
    "T cells",
    "antibodies",
    "antigens",
    "vaccination",
    "immunological memory",
    "AP Biology",
  ],
  difficulty: "advanced",

  parameters: [
    {
      id: "pathogenLoad",
      label: "Pathogen Load",
      unit: "level",
      min: 1,
      max: 3,
      default: 2,
      step: 1,
      tier: "free",
    },
    {
      id: "bCellRate",
      label: "B Cell Rate",
      unit: "level",
      min: 1,
      max: 3,
      default: 2,
      step: 1,
      tier: "free",
    },
    {
      id: "memoryCells",
      label: "Memory Cells",
      unit: "cells",
      min: 0,
      max: 20,
      default: 0,
      step: 1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex:
        "\\text{Antibody Titer} \\propto B_{\\text{activated}} \\times t_{\\text{response}}",
      description:
        "Antibody concentration rises proportionally to the number of activated B cells and time since activation",
    },
    {
      latex:
        "\\text{Secondary Response} \\gg \\text{Primary Response}",
      description:
        "Memory cells enable a faster and stronger secondary immune response upon re-exposure to the same antigen",
    },
    {
      latex:
        "K_d = \\frac{[Ab][Ag]}{[Ab \\cdot Ag]}",
      description:
        "Dissociation constant: lower Kd means higher antibody-antigen binding affinity",
    },
  ],

  theory:
    "The immune system has two main branches. Innate immunity provides immediate, non-specific defense through barriers (skin, mucous membranes), phagocytes (macrophages, neutrophils), and inflammation. Adaptive immunity is antigen-specific and develops over days. When antigen-presenting cells (APCs) display pathogen fragments, helper T cells (CD4+) activate. B cells that recognize the antigen differentiate into plasma cells (producing antibodies) and memory B cells. Cytotoxic T cells (CD8+) kill infected host cells. Antibodies (immunoglobulins) bind antigens via complementarity-determining regions, neutralizing pathogens or marking them for destruction (opsonization). Upon re-exposure, memory cells mount a secondary response that is faster (1–3 days vs 7–14 days) and produces 10–100× more antibodies. Vaccination exploits this by introducing weakened or inactivated antigens to generate memory without disease.",

  instructions:
    "Use the Pathogen Load, B Cell Rate, and Memory Cells sliders to shape the immune challenge and response speed. Try the Primary Immune Response, Secondary Memory, and Autoimmune Attack presets to compare first exposure, memory-assisted clearance, and misdirected immune activity. Watch antibody titer, immune cell activity, and pathogen clearance change as the simulation runs.",

  challenges: [
    {
      id: "imm-c1",
      question:
        "Why does the secondary immune response produce antibodies faster than the primary response?",
      hint: "Memory B cells from the first exposure are pre-primed and can rapidly differentiate into plasma cells without needing full activation.",
      tier: "free",
    },
    {
      id: "imm-c2",
      question:
        "What happens when you increase pathogen virulence to maximum with low immune strength?",
      hint: "The innate response is overwhelmed before adaptive immunity can activate, leading to uncontrolled pathogen growth.",
      tier: "free",
    },
    {
      id: "imm-c3",
      question:
        "How does vaccination change the time to pathogen clearance? Compare quantitatively.",
      hint: "Vaccinated individuals clear pathogens in ~2-4 days vs ~10-14 days unvaccinated, due to pre-existing memory cells.",
      tier: "pro",
    },
  ],

  wave: 11,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["cell-division", "natural-selection"],
  htmlPath: "/experiments/ap-biology/immune-system.html",

  seoTitle: "Immune System Virtual Lab | Scivra AP Biology",
  seoKeywords: [
    "immune system simulation",
    "B cell T cell interactive",
    "antibody antigen animation",
    "vaccination virtual lab",
    "AP Biology immunity",
    "adaptive immune response",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Immune System and Immunological Memory",
  },
  htmlControlAliases: {
    pathogenLoad: "sl-load",
    bCellRate: "sl-bcell",
    memoryCells: "sl-mem",
  },
  presets: [
    {
      id: "0",
      label: "Primary Immune Response",
      description:
        "Starts with no memory cells and a moderate pathogen load so students can observe the slower first exposure response.",
    },
    {
      id: "1",
      label: "Secondary Memory",
      description:
        "Adds memory cells before exposure so students can compare faster antibody production and clearance after re-exposure.",
    },
    {
      id: "2",
      label: "Autoimmune Attack",
      description:
        "Shifts the response toward misdirected immune activity, highlighting how immune defenses can damage self tissue when regulation fails.",
    },
  ],
  contentSections: {
    whatIsIt:
      "The immune system is a coordinated defense network that distinguishes self from non-self and eliminates pathogens, infected cells, and foreign molecules. It operates in two tiers: innate immunity responds within minutes through non-specific mechanisms — physical barriers, phagocytes (macrophages and neutrophils), the complement system, and inflammation. Adaptive immunity develops over 7–14 days and is antigen-specific: B cells differentiate into plasma cells that secrete targeted antibodies (humoral immunity), while cytotoxic T cells (CD8+) kill infected host cells (cellular immunity). The adaptive system's defining feature is memory — after a primary response, long-lived memory B and T cells persist and mount a secondary response 10–100 times stronger within 1–3 days of re-exposure. Vaccination exploits this by introducing harmless antigens to generate memory without disease. The simulation lets you adjust pathogen load, virulence, immune strength, and vaccination status to watch these tiers compete in real time.",
    parameterExplanations: {
      pathogenLoad:
        "Pathogen Load sets the size of the infection challenge on a three-level scale. Level 1 gives innate defenses time to slow the invader before adaptive immunity dominates. Level 2 creates a balanced case where students can see antigen presentation, B cell activation, antibody production, and clearance overlap. Level 3 introduces a heavier burden, so antibody titer must rise quickly or pathogens persist longer. Use this slider with the Primary Immune Response preset to show why first exposure can feel delayed, then compare the same load under Secondary Memory to see how pre-existing immune memory changes the outcome.",
      bCellRate:
        "B Cell Rate controls how quickly activated B cells expand and produce antibodies once the immune system recognizes the antigen. At level 1, antibody titer rises slowly, making the delay between infection and adaptive protection easier to observe. At level 2, the response is moderate and useful for baseline comparisons. At level 3, plasma cell production accelerates, so antibodies bind antigens sooner and pathogen clearance improves. This slider helps students connect clonal expansion to measurable antibody titer: the immune system is not just detecting pathogens, it is amplifying the specific cells that can respond.",
      memoryCells:
        "Memory Cells represents the pool of antigen-specific immune cells already available before or during a response. A value near 0 models a primary exposure, where the body must identify the antigen and build a response from scratch. Higher values model prior exposure and immunological memory: memory B cells can reactivate quickly, become plasma cells, and produce antibodies much faster than naive cells. Use the Secondary Memory preset, then lower or raise this slider to test how memory changes the response curve. The comparison makes the biological value of memory visible without relying on a separate vaccination switch.",
    },
    misconceptions: [
      {
        wrong:
          "Vaccines weaken the immune system by overloading it with foreign material.",
        correct:
          "Vaccines train the adaptive immune system by introducing antigens in a controlled, non-infectious form. The result is a pool of memory B and T cells primed to respond within days of real infection. Far from weakening immunity, immune memory strengthens the secondary response — compare low and high Memory Cells settings to see how pre-existing memory can clear pathogens much faster than a primary response.",
      },
      {
        wrong:
          "Antibiotics can treat viral infections like the flu or COVID-19.",
        correct:
          "Antibiotics target bacterial cell structures — cell walls, ribosomes, DNA gyrase — that viruses do not have. Viruses have no cell wall and replicate using the host's own ribosomes, so antibiotics have no target to act on. Antiviral drugs (such as oseltamivir for influenza or nirmatrelvir for SARS-CoV-2) are required for viral infections.",
      },
      {
        wrong:
          "The innate immune system only operates before the adaptive system kicks in, then shuts down.",
        correct:
          "Innate and adaptive immunity operate simultaneously throughout an infection. Macrophages and dendritic cells continue phagocytosing pathogens even after B and T cells are active. Innate cells also present antigens to T cells (bridging both systems) and maintain inflammation that supports adaptive cell activity. They are complementary layers, not sequential switches.",
      },
      {
        wrong:
          "B cells directly kill pathogens when they detect them.",
        correct:
          "B cells do not directly kill pathogens. Upon activation (with T cell help), B cells differentiate into plasma cells that secrete antibodies. Antibodies neutralize pathogens by blocking surface proteins or flag them for destruction by phagocytes (opsonization) or the complement system. The killing is done by other immune cells acting on antibody-labeled targets.",
      },
      {
        wrong:
          "A faster or larger immune response is always better.",
        correct:
          "Dysregulated immune responses cause significant damage. Cytokine storms, autoimmune diseases, and severe allergic reactions all arise from immune hyperactivity directed at harmless or self antigens. The Autoimmune Attack preset helps show that the goal is a calibrated response proportional to the actual threat, not simply a larger or faster immune reaction in every situation.",
      },
    ],
    teacherUseCases: [
      "Primary vs. secondary response comparison: run the Primary Immune Response preset, then the Secondary Memory preset with the same Pathogen Load. Have students record time to 50% pathogen clearance and peak antibody titer in both runs. Calculate the fold-difference to quantify the memory advantage, directly addressing AP Bio 8.C.1.",
      "Overwhelm threshold investigation: keep B Cell Rate at level 2 and increase Pathogen Load from 1 to 3. Record whether the pathogen is cleared within the simulation window at each level. Identify the tipping point and discuss how this maps to clinical infection severity and bacterial load thresholds.",
      "Antibiotic misconception probe: before the simulation, ask students 'Would an antibiotic help a person in this simulation?' Record answers. After the simulation reveals the innate and adaptive mechanisms, return to the question and ask what structural target an antibiotic would need to affect viral pathogens (answer: none exist).",
      "Immunocompromised patient scenario: set B Cell Rate to level 1 with Pathogen Load at level 2 or 3. Observe the outcome, then discuss the clinical relevance to HIV-positive patients, transplant recipients on immunosuppressants, and cancer patients in chemotherapy — ties to AP Bio 8.A.1.",
      "Autoimmunity discussion extension: run the Autoimmune Attack preset and ask students to distinguish protective antigen-specific immunity from dysregulated immune activity directed at self tissue. Connect the outcome to why immune responses require checkpoints, tolerance, and proportional feedback.",
    ],
    faq: [
      {
        question: "What is the difference between innate and adaptive immunity?",
        answer:
          "Innate immunity is immediate (minutes to hours), non-specific, and does not improve with repeated exposure. It includes physical barriers, phagocytes, complement proteins, and inflammation. Adaptive immunity takes 7–14 days to mount its first (primary) response, is antigen-specific (each B or T cell targets one antigen), and generates immunological memory. On re-exposure, secondary responses peak much faster — roughly 1–3 days vs. 7–14 — and antibody titers can be 10–100× higher than the primary response.",
      },
      {
        question: "How does vaccination produce immunity without causing disease?",
        answer:
          "Vaccines introduce antigens — killed pathogens, inactivated toxins, subunit proteins, or mRNA encoding a pathogen protein — in a form that cannot cause infection. The adaptive immune system responds to these antigens by producing memory B and T cells. When the real pathogen is encountered later, these memory cells mount a rapid secondary response that clears the infection before symptoms develop or become severe.",
      },
      {
        question: "Which AP Bio standards does this simulation address?",
        answer:
          "The simulation directly addresses AP Bio 8.A.1 (innate immune responses), 8.B.1 (adaptive immune responses and clonal selection), and 8.C.1 (the role of memory cells in immunity and the basis of vaccination). NGSS HS-LS1-2 covers cell communication and signal transduction that underlies both branches of immunity.",
      },
      {
        question: "Why does the secondary immune response produce so many more antibodies?",
        answer:
          "During the primary response, B cells that recognize the antigen undergo clonal expansion, producing many identical copies. Some differentiate into antibody-secreting plasma cells; others become long-lived memory B cells. On re-exposure, this large memory pool activates simultaneously within 1–3 days, producing antibody titers 10–100 times higher than the primary response peak — the quantitative basis of immune memory.",
      },
      {
        question: "What is opsonization, and why does it matter?",
        answer:
          "Opsonization is the process of coating a pathogen with antibodies (or complement proteins) that phagocytes recognize via surface receptors (Fc receptors or complement receptors). This binding dramatically increases the rate at which macrophages and neutrophils engulf and destroy the pathogen — an antibody-tagged bacterium is engulfed roughly 1000× more efficiently than an untagged one. It is the key link between humoral (B cell/antibody) immunity and innate phagocyte activity.",
      },
      {
        question: "Can the immune system fail even at high immune strength settings?",
        answer:
          "Yes. At high Pathogen Load with slow B Cell Rate and few Memory Cells, the immune response may not clear the infection within the simulation window because pathogen growth outpaces immune activation speed. This reflects real biology: some pathogens have evolved mechanisms to evade phagocytosis, suppress cytokine signaling, or mutate surface antigens faster than adaptive immunity can track them.",
      },
    ],
  },
};
