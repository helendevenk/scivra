// Lab Notebook constants

export const NOTEBOOK_FREE_MONTHLY_LIMIT = 2;
export const NOTEBOOK_AI_SUGGEST_CREDITS = 2;
export const NOTEBOOK_SECTIONS = [
  'hypothesis',
  'method',
  'data',
  'analysis',
  'conclusion',
] as const;

export type NotebookSectionName = (typeof NOTEBOOK_SECTIONS)[number];

export const NOTEBOOK_AI_MAX_TOKENS = 4000;
export const NOTEBOOK_AI_TEMPERATURE = 0.7;
export const NOTEBOOK_AI_TIMEOUT_MS = 60000;
