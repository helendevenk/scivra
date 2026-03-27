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
};
