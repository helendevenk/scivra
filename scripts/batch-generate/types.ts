/** Batch generation prompt configuration for a single experiment */
export interface BatchPromptConfig {
  /** PhET original simulation name (for reference) */
  phetName: string;
  /** NeonPhysics experiment ID */
  neonId: string;
  /** Display title */
  title: { en: string; zh: string };
  /** Topic category */
  category: 'motion' | 'energy' | 'waves' | 'electro' | 'thermo' | 'quantum' | 'optics' | 'other';
  /** Priority tier */
  tier: 'P0' | 'P1' | 'P2';
  /** Whether this is an upgrade of an existing experiment */
  isUpgrade: boolean;

  /** Core physics concepts */
  concepts: string[];
  /** Required equations (KaTeX format) */
  equations: string[];
  /** Required interactive slider parameters */
  variables: SliderConfig[];
  /** Required visual elements */
  visualElements: string[];
  /** Preset scenarios for "Random Experiment" button */
  scenarios: string[];

  /** PhET benchmark description */
  phetBenchmark: string;
  /** Aspects that must exceed PhET */
  mustExceed: string[];

  /** AP standards alignment codes */
  apStandards?: string[];
  /** Grade level */
  gradeLevel: string;
}

export interface SliderConfig {
  name: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  default: number;
  step: number;
}

export interface GenerationResult {
  id: string;
  status: 'success' | 'failed';
  attempt: number;
  tokens?: number;
  size?: number;
  error?: string;
  outputPath?: string;
}
