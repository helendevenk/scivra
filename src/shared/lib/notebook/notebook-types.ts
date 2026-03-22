export interface NotebookBlock {
  type: 'text' | 'equation' | 'table' | 'image-ref' | 'ai-suggestion';
  content: string;
  source?: 'user' | 'ai';
  acceptedAt?: string;
}

export type SectionContent = NotebookBlock[];

export interface DataTable {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface PrefillContext {
  experimentTitle: string;
  experimentDescription?: string;
  parameters?: string[];
  controls?: string[];
  language: string;
}

export interface PrefillResult {
  method: SectionContent;
  data: SectionContent;
}

export interface SuggestContext {
  experimentTitle?: string;
  experimentDescription?: string;
  notebookTitle?: string;
  hypothesis?: string;
  method?: string;
  data?: string;
  analysis?: string;
  conclusion?: string;
}

export interface SuggestResult {
  suggestions: string[];
}
