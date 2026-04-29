/** Physics experiment category */
export type PhysicsCategory =
  | "mechanics"
  | "waves"
  | "electricity"
  | "modern"
  | "thermodynamics"
  | "biology"
  | "chemistry"
  | "earth"; // NEW: earth & space science

/** Subject (cross-discipline) */
export type Subject = "physics" | "chemistry" | "biology" | "earth-science" | "math";

/** Grade level */
export type GradeLevel = "K-2" | "3-5" | "6-8" | "9-12" | "AP";

/** Subscription tier */
export type Tier = "free" | "pro" | "max";

/** Difficulty level */
export type Difficulty = "beginner" | "intermediate" | "advanced";

/** Release wave */
export type Wave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Adjustable parameter for an experiment */
export interface Parameter {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  default: number;
  step: number;
  tier: Tier;
}

/** Physics formula for display */
export interface Formula {
  latex: string;
  description: string;
}

/** Exploration challenge */
export interface Challenge {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  hint: string;
  relatedParameterId?: string;
  tier: Tier;
}

/** Primary standard for URL routing (e.g. ap-physics-1, ngss-hs) */
export type PrimaryStandard =
  | "ap-physics-1"
  | "ap-physics-2"
  | "ap-physics-c"
  | "ap-chemistry"
  | "ap-biology"
  | "ngss-ms"
  | "ngss-hs"
  | "elementary-k5"
  | "general";

/** Narrative hook for experiment intro */
export interface ExperimentHook {
  question: string;
  context?: string;
  actionPrompt: string;
}

/** Structured learning card */
export interface LearningCard {
  id: string;
  title: string;
  content: string;
  formula?: Formula;
  relatedParameterId?: string;
  illustration?: string;
}

/** Easter egg triggered by parameter extremes */
export interface EasterEgg {
  parameterId: string;
  condition: "max" | "min" | "specific";
  triggerValue?: number;
  effect: string;
  message: string;
}

/** Experiment stage in gated progression */
export type ExperimentStage = "hook" | "explore" | "learn" | "challenge" | "summary";

/** Curriculum standards mapping */
export interface Standards {
  ngss: string[];
  gcse: string[];
  ap: string[];
}

/** Plain teaching content surfaced below the simulation. Drives both visible
 *  text sections and the FAQPage JSON-LD. All fields optional so legacy
 *  experiments without filled content keep working. */
export interface ExperimentContentSection {
  /** 100-150 words: definition + a real-world example. */
  whatIsIt?: string;
  /** Map of parameter id (matching parameters[].id) to a 1-2 sentence
   *  explanation of what changing that parameter does and why it matters. */
  parameterExplanations?: Record<string, string>;
  /** 3-5 common student misconceptions paired with the correct framing. */
  misconceptions?: { wrong: string; correct: string }[];
  /** 3-5 strings describing concrete classroom or self-study uses. */
  teacherUseCases?: string[];
  /** 4-6 Q/A pairs targeting student search intent. Drives FAQPage schema. */
  faq?: { question: string; answer: string }[];
}

/** Complete experiment definition */
export interface Experiment {
  // Identity
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;

  // Classification
  standards: Standards;
  primaryStandard: PrimaryStandard;
  category: PhysicsCategory;
  subject?: Subject;
  gradeLevel?: GradeLevel;
  tags: string[];
  difficulty: Difficulty;

  // Parameters & formulas
  parameters: Parameter[];
  formulas: Formula[];

  // Content
  theory: string;
  instructions: string;
  challenges: Challenge[];
  hook?: ExperimentHook;
  learningCards?: LearningCard[];
  easterEggs?: EasterEgg[];

  // Metadata
  wave: Wave;
  tier: Tier;
  estimatedTime: number;
  relatedExperiments: string[];

  // HTML path (undefined for Wave-1 RTF experiments)
  htmlPath?: string;

  // SEO
  seoTitle: string;
  seoKeywords: string[];
  jsonLd: Record<string, unknown>;

  /** Optional educational content sections rendered below the simulation. */
  contentSections?: ExperimentContentSection;
}

/** Blog post frontmatter */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  readingTime: number;
  content: string;
}

/** Real-time simulation data point */
export interface SimulationData {
  label: string;
  value: number;
  unit: string;
}

/** Simulation playback state */
export interface SimulationState {
  isPlaying: boolean;
  time: number;
  parameters: Record<string, number>;
}
