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
      id: "pathogenCount",
      label: "Pathogen Count",
      unit: "",
      min: 5,
      max: 50,
      default: 15,
      step: 5,
      tier: "free",
    },
    {
      id: "pathogenVirulence",
      label: "Pathogen Virulence",
      unit: "%",
      min: 10,
      max: 100,
      default: 50,
      step: 10,
      tier: "free",
    },
    {
      id: "immuneStrength",
      label: "Immune Strength",
      unit: "%",
      min: 20,
      max: 100,
      default: 70,
      step: 10,
      tier: "free",
    },
    {
      id: "vaccinated",
      label: "Vaccinated (0=No, 1=Yes)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "pro",
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
    "Set the pathogen count and virulence, then press 'Infect' to introduce pathogens. Watch innate immune cells respond first, followed by adaptive B cell activation and antibody production. Toggle vaccination to compare primary vs secondary immune responses. The data panel shows antibody titer, active immune cells, and pathogen clearance rate in real time.",

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
  contentSections: {
    whatIsIt:
      "The immune system is a coordinated defense network that distinguishes self from non-self and eliminates pathogens, infected cells, and foreign molecules. It operates in two tiers: innate immunity responds within minutes through non-specific mechanisms — physical barriers, phagocytes (macrophages and neutrophils), the complement system, and inflammation. Adaptive immunity develops over 7–14 days and is antigen-specific: B cells differentiate into plasma cells that secrete targeted antibodies (humoral immunity), while cytotoxic T cells (CD8+) kill infected host cells (cellular immunity). The adaptive system's defining feature is memory — after a primary response, long-lived memory B and T cells persist and mount a secondary response 10–100 times stronger within 1–3 days of re-exposure. Vaccination exploits this by introducing harmless antigens to generate memory without disease. The simulation lets you adjust pathogen load, virulence, immune strength, and vaccination status to watch these tiers compete in real time.",
    parameterExplanations: {
      pathogenCount:
        "The number of pathogen units introduced at the start of an infection event, from 5 to 50. A low count (5–10) gives innate defenses time to contain the invasion before adaptive immunity activates; a high count (40–50) can overwhelm the innate response and accelerates the timeline for adaptive B cell activation and antibody production — watch the clearance rate drop sharply as pathogen load approaches 50.",
      pathogenVirulence:
        "A percentage (10%–100%) representing how aggressively pathogens evade immune defenses and replicate. At low virulence (~10–20%), phagocytes clear pathogens efficiently before antibody production is required. At high virulence (80–100%), pathogens replicate faster than innate cells can destroy them, making adaptive immunity essential for clearance. Combine maximum virulence with minimum immune strength to observe system failure.",
      immuneStrength:
        "The overall functional capacity of the immune system, from 20% (severely immunocompromised) to 100% (fully functional). This parameter scales both innate phagocyte activity and adaptive B/T cell activation speed. At 20% immune strength, even a modest pathogen challenge becomes overwhelming — modeling the clinical scenario of immunosuppressed patients, such as those undergoing chemotherapy or with HIV at advanced stages.",
      vaccinated:
        "A binary switch: 0 = unvaccinated (primary response only), 1 = vaccinated (memory cells pre-existing). Setting this to 1 simulates the memory cell pool generated by a prior vaccine or infection. The simulation shows the secondary immune response engaging within 1–3 days rather than the 7–14 day primary response timeline, and producing 10–100× more antibodies — the mechanistic basis of vaccine-derived immunity.",
    },
    misconceptions: [
      {
        wrong:
          "Vaccines weaken the immune system by overloading it with foreign material.",
        correct:
          "Vaccines train the adaptive immune system by introducing antigens in a controlled, non-infectious form. The result is a pool of memory B and T cells primed to respond within days of real infection. Far from weakening immunity, vaccination strengthens the secondary response — the simulation shows the vaccinated scenario clearing pathogens roughly 5–7 times faster than the unvaccinated primary response.",
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
          "A strong immune response is always better — higher immune strength always leads to better outcomes.",
        correct:
          "Dysregulated immune responses cause significant damage. Cytokine storms, autoimmune diseases, and severe allergic reactions all arise from immune hyperactivity directed at harmless or self antigens. The simulation's immuneStrength slider models functional capacity, not simply 'stronger is better' — the goal is a calibrated response proportional to the actual threat.",
      },
    ],
    teacherUseCases: [
      "Primary vs. secondary response comparison: run the simulation twice with identical pathogen settings — once unvaccinated, once vaccinated — and have students record time to 50% pathogen clearance and peak antibody titer in both runs. Calculate the fold-difference to quantify the memory advantage, directly addressing AP Bio 8.C.1.",
      "Overwhelm threshold investigation: hold immune strength at 50% and increase pathogen virulence from 10% to 100% in 20% steps. Record whether the pathogen is cleared within the simulation window at each virulence level. Identify the tipping point and discuss how this maps to clinical infection severity and bacterial load thresholds.",
      "Antibiotic misconception probe: before the simulation, ask students 'Would an antibiotic help a person in this simulation?' Record answers. After the simulation reveals the innate and adaptive mechanisms, return to the question and ask what structural target an antibiotic would need to affect viral pathogens (answer: none exist).",
      "Immunocompromised patient scenario: set immune strength to 30% with moderate pathogen count and virulence. Observe the outcome, then discuss the clinical relevance to HIV-positive patients, transplant recipients on immunosuppressants, and cancer patients in chemotherapy — ties to AP Bio 8.A.1.",
      "Herd immunity discussion extension: after running the individual vaccination comparison, present the concept that when the fraction of vaccinated individuals in a population is high enough, unvaccinated individuals are protected because pathogen spread is interrupted. Ask students what immune mechanism makes this possible (answer: rapid antibody production from memory cells limits transmission time per host).",
    ],
    faq: [
      {
        question: "What is the difference between innate and adaptive immunity?",
        answer:
          "Innate immunity is immediate (minutes to hours), non-specific, and does not improve with repeated exposure. It includes physical barriers, phagocytes, complement proteins, and inflammation. Adaptive immunity takes 7–14 days to mount initially, is antigen-specific (each B or T cell targets one antigen), and generates immunological memory that makes subsequent responses 10–100× faster and stronger.",
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
          "Yes. At maximum pathogen virulence (100%) and count (50), even high immune strength may not clear the infection within the simulation window, because pathogen replication outpaces immune activation speed. This reflects real biology: some pathogens have evolved mechanisms to evade phagocytosis, suppress cytokine signaling, or mutate surface antigens faster than adaptive immunity can track them.",
      },
    ],
  },
};
