/** Physics experiment category */
export type PhysicsCategory =
  | "mechanics"
  | "waves"
  | "electricity"
  | "modern"
  | "thermodynamics";

/** Subscription tier */
export type Tier = "free" | "pro" | "max";

/** Difficulty level */
export type Difficulty = "beginner" | "intermediate" | "advanced";

/** Release wave */
export type Wave = 1 | 2 | 3 | 4;

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
  hint: string;
  tier: Tier;
}

/** Curriculum standards mapping */
export interface Standards {
  ngss: string[];
  gcse: string[];
  ap: string[];
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
  category: PhysicsCategory;
  tags: string[];
  difficulty: Difficulty;

  // Parameters & formulas
  parameters: Parameter[];
  formulas: Formula[];

  // Content
  theory: string;
  instructions: string;
  challenges: Challenge[];

  // Metadata
  wave: Wave;
  tier: Tier;
  estimatedTime: number;
  relatedExperiments: string[];

  // SEO
  seoTitle: string;
  seoKeywords: string[];
  jsonLd: Record<string, unknown>;
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
