import { callAnthropic } from '@/shared/lib/upg/anthropic-client';
import { callOpenRouter } from '@/shared/lib/upg/openrouter-client';
import { getAllConfigs } from '@/shared/models/config';
import {
  NOTEBOOK_AI_MAX_TOKENS,
  NOTEBOOK_AI_TEMPERATURE,
  type NotebookSectionName,
} from './constants';
import type {
  PrefillContext,
  PrefillResult,
  SectionContent,
  SuggestContext,
  SuggestResult,
} from './notebook-types';

const NOTEBOOK_MODEL = 'claude-sonnet-4-6';

function buildPrefillSystemPrompt(): string {
  return `You are a science lab notebook assistant for high school students. Your job is to help students set up their lab notebooks by generating structured Method and Data sections based on an experiment description.

Output ONLY valid JSON. No markdown fences, no explanation.

Format:
{
  "method": [
    { "type": "text", "content": "**Materials:**\\n- item1\\n- item2", "source": "ai" },
    { "type": "text", "content": "**Procedure:**\\n1. Step one\\n2. Step two", "source": "ai" },
    { "type": "text", "content": "**Safety Notes:**\\n- Note one", "source": "ai" }
  ],
  "data": [
    { "type": "table", "content": "Trial|Independent Variable|Dependent Variable|Observations\\n1|||\\n2|||\\n3|||", "source": "ai" },
    { "type": "text", "content": "**Expected Measurements:** Describe what data to collect and units.", "source": "ai" }
  ]
}

Keep language appropriate for high school level. Be specific to the experiment described.`;
}

function buildPrefillUserPrompt(context: PrefillContext): string {
  let prompt = `Generate Method and Data sections for this experiment:\n\nTitle: ${context.experimentTitle}`;
  if (context.experimentDescription) {
    prompt += `\nDescription: ${context.experimentDescription}`;
  }
  if (context.parameters?.length) {
    prompt += `\nKey Parameters: ${context.parameters.join(', ')}`;
  }
  if (context.controls?.length) {
    prompt += `\nControl Variables: ${context.controls.join(', ')}`;
  }
  prompt += `\n\nLanguage: ${context.language === 'zh' ? 'Chinese' : 'English'}`;
  return prompt;
}

function buildSuggestSystemPrompt(): string {
  return `You are a Socratic science tutor. Your role is to guide students' thinking with prompting questions and frameworks — NOT to write answers for them.

For each request, return EXACTLY 2-3 suggestions as a JSON array of strings. No markdown fences, no explanation.

Rules:
- For hypothesis: suggest variables to consider, prediction prompts like "What do you think will happen if..."
- For analysis: suggest patterns to look for, calculation frameworks, "Consider comparing..."
- For conclusion: suggest evidence references, error analysis prompts, "Your data shows... what does this mean?"
- NEVER write the actual content. Only ask guiding questions or suggest frameworks.
- Keep language at high school level.

Output format: ["suggestion 1", "suggestion 2", "suggestion 3"]`;
}

function buildSuggestUserPrompt(
  section: NotebookSectionName,
  currentContent: string | undefined,
  context: SuggestContext
): string {
  let prompt = `Section: ${section}\n`;
  if (context.notebookTitle || context.experimentTitle) {
    prompt += `Experiment: ${context.notebookTitle || context.experimentTitle}\n`;
  }
  if (currentContent) {
    prompt += `Current content:\n${currentContent}\n`;
  }
  if (section === 'analysis' || section === 'conclusion') {
    if (context.hypothesis) prompt += `Hypothesis: ${context.hypothesis}\n`;
    if (context.data) prompt += `Data collected: ${context.data}\n`;
  }
  if (section === 'conclusion' && context.analysis) {
    prompt += `Analysis: ${context.analysis}\n`;
  }
  prompt += `\nProvide 2-3 Socratic prompting questions/frameworks for the "${section}" section.`;
  return prompt;
}

async function callLLM(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const configs = await getAllConfigs();
  const apiKey = process.env.OPENROUTER_API_KEY || configs.openrouter_api_key;
  const baseUrl =
    process.env.OPENROUTER_BASE_URL || configs.openrouter_base_url;
  const useAnthropic =
    baseUrl?.includes('anthropic') || baseUrl?.includes('zenmux');

  if (useAnthropic && apiKey) {
    const result = await callAnthropic(apiKey, {
      model: NOTEBOOK_MODEL,
      systemPrompt,
      userPrompt,
      maxTokens: NOTEBOOK_AI_MAX_TOKENS,
      temperature: NOTEBOOK_AI_TEMPERATURE,
      baseUrl,
    });
    return result.html;
  }

  const result = await callOpenRouter({
    model: NOTEBOOK_MODEL,
    systemPrompt,
    userPrompt,
    maxTokens: NOTEBOOK_AI_MAX_TOKENS,
    temperature: NOTEBOOK_AI_TEMPERATURE,
  });
  return result.html;
}

function parseJsonResponse<T>(raw: string): T {
  // Strip markdown fences if present
  const cleaned = raw
    .replace(/^```json?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();
  return JSON.parse(cleaned);
}

export async function prefillNotebook(
  context: PrefillContext
): Promise<PrefillResult> {
  const systemPrompt = buildPrefillSystemPrompt();
  const userPrompt = buildPrefillUserPrompt(context);
  const raw = await callLLM(systemPrompt, userPrompt);

  try {
    const parsed = parseJsonResponse<{ method: SectionContent; data: SectionContent }>(raw);
    return {
      method: parsed.method || [],
      data: parsed.data || [],
    };
  } catch {
    // Fallback: wrap raw text as a single block
    return {
      method: [{ type: 'text', content: raw, source: 'ai' }],
      data: [
        {
          type: 'table',
          content: 'Trial|Measurement|Observation\n1||\n2||\n3||',
          source: 'ai',
        },
      ],
    };
  }
}

export async function suggestForSection(
  section: NotebookSectionName,
  currentContent: string | undefined,
  context: SuggestContext
): Promise<SuggestResult> {
  const systemPrompt = buildSuggestSystemPrompt();
  const userPrompt = buildSuggestUserPrompt(section, currentContent, context);
  const raw = await callLLM(systemPrompt, userPrompt);

  try {
    const parsed = parseJsonResponse<string[]>(raw);
    return { suggestions: Array.isArray(parsed) ? parsed.slice(0, 3) : [] };
  } catch {
    // Fallback: split by newline
    const lines = raw
      .split('\n')
      .map((l) => l.replace(/^\d+\.\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 3);
    return { suggestions: lines.length > 0 ? lines : [raw.trim()] };
  }
}
