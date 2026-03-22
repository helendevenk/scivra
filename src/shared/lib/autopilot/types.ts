// VisualizationState: iframe reads DOM and sends this to parent
export interface SliderState {
  name: string;   // from data-autopilot="slider-{name}"
  label: string;  // data-slider-label
  value: number;
  min: number;
  max: number;
  unit: string;   // data-slider-unit
}

export interface QuizOptionState {
  index: number;
  text: string;
  selected: boolean;
}

export interface QuizState {
  question: string;
  options: QuizOptionState[];
}

export interface VisualizationState {
  title: string;
  sliders: SliderState[];
  buttons: Partial<Record<'play' | 'pause' | 'reset' | 'random', boolean>>;
  quiz: QuizState | null;
}

// Step history entry (stored client-side only, sent with each request)
export interface StepHistoryEntry {
  stepIndex: number;
  evaluation: string;
  memory: string;
  nextGoal: string;
  actionName: string;
  actionInput: Record<string, unknown>;
  actionResult: string;
}

// API request/response
export interface AutopilotStepRequest {
  generationId: string;
  sessionId: string;
  task: string;
  history: StepHistoryEntry[];
  visualizationState: VisualizationState;
  stepNumber: number;
  language: 'zh' | 'en';
}

export interface ReflectionOutput {
  evaluation_previous_goal: string;
  memory: string;
  next_goal: string;
}

export interface AutopilotStepResponse {
  reflection: ReflectionOutput;
  action: Record<string, unknown>;
}

// postMessage protocol between parent and iframe
export type AutopilotMessage =
  | { type: 'autopilot:ready'; sessionId: string }
  | { type: 'autopilot:state'; sessionId: string; state: VisualizationState }
  | { type: 'autopilot:action-result'; sessionId: string; result: string }
  | { type: 'autopilot:start'; sessionId: string }
  | { type: 'autopilot:get-state'; sessionId: string }
  | { type: 'autopilot:execute'; sessionId: string; action: Record<string, unknown> }
  | { type: 'autopilot:stop'; sessionId: string };
