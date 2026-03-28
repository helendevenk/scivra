/**
 * UPG Prompt Types
 *
 * ExperimentPromptConfig: Optional context from experiment registry
 * injected into buildUserPrompt() to improve generation quality.
 * CTO Decision D5: Extracted to standalone types file for reuse.
 */

export interface ExperimentPromptConfig {
  /** Slider parameters to include */
  parameters?: Array<{
    label: string;
    unit: string;
    min: number;
    max: number;
    default: number;
  }>;
  /** Core formulas to render with KaTeX */
  formulas?: Array<{
    latex: string;
    description: string;
  }>;
  /** Theory text for left panel explanation */
  theory?: string;
  /** Quiz questions with hints */
  challenges?: Array<{
    question: string;
    hint: string;
  }>;
}
