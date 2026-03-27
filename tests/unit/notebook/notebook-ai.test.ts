import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock external dependencies ──

const mockCallAnthropic = vi.fn();
const mockCallOpenRouter = vi.fn();
const mockGetAllConfigs = vi.fn();

vi.mock('@/shared/lib/upg/anthropic-client', () => ({
  callAnthropic: (...args: unknown[]) => mockCallAnthropic(...args),
}));

vi.mock('@/shared/lib/upg/openrouter-client', () => ({
  callOpenRouter: (...args: unknown[]) => mockCallOpenRouter(...args),
}));

vi.mock('@/shared/models/config', () => ({
  getAllConfigs: (...args: unknown[]) => mockGetAllConfigs(...args),
}));

import { prefillNotebook, suggestForSection } from '@/shared/lib/notebook/notebook-ai';
import type { PrefillContext, SuggestContext } from '@/shared/lib/notebook/notebook-types';

// ── Helpers ──

function basePrefillContext(overrides?: Partial<PrefillContext>): PrefillContext {
  return {
    experimentTitle: 'Ohm\'s Law Experiment',
    language: 'en',
    ...overrides,
  };
}

function baseSuggestContext(overrides?: Partial<SuggestContext>): SuggestContext {
  return {
    experimentTitle: 'Ohm\'s Law Experiment',
    ...overrides,
  };
}

function setupAnthropicRoute() {
  mockGetAllConfigs.mockResolvedValue({
    openrouter_api_key: 'test-key',
    openrouter_base_url: 'https://api.anthropic.com/v1',
  });
}

function setupOpenRouterRoute() {
  mockGetAllConfigs.mockResolvedValue({
    openrouter_api_key: 'test-key',
    openrouter_base_url: 'https://openrouter.ai/api/v1',
  });
}

const validPrefillResponse = JSON.stringify({
  method: [
    { type: 'text', content: '**Materials:**\n- Resistors\n- Multimeter', source: 'ai' },
    { type: 'text', content: '**Procedure:**\n1. Connect circuit\n2. Measure', source: 'ai' },
  ],
  data: [
    { type: 'table', content: 'Trial|Voltage|Current\n1||\n2||', source: 'ai' },
  ],
});

const validSuggestResponse = JSON.stringify([
  'What variables are you testing?',
  'How might voltage affect current?',
  'What do you predict will happen?',
]);

// ── prefillNotebook ──

describe('prefillNotebook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_BASE_URL;
  });

  it('should return parsed method and data from valid JSON response (Anthropic)', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({ html: validPrefillResponse });

    const result = await prefillNotebook(basePrefillContext());

    expect(result.method).toHaveLength(2);
    expect(result.data).toHaveLength(1);
    expect(result.method[0].type).toBe('text');
    expect(result.data[0].type).toBe('table');
    expect(mockCallAnthropic).toHaveBeenCalledOnce();
  });

  it('should return parsed result via OpenRouter when base URL is not anthropic', async () => {
    setupOpenRouterRoute();
    mockCallOpenRouter.mockResolvedValue({ html: validPrefillResponse });

    const result = await prefillNotebook(basePrefillContext());

    expect(result.method).toHaveLength(2);
    expect(mockCallOpenRouter).toHaveBeenCalledOnce();
    expect(mockCallAnthropic).not.toHaveBeenCalled();
  });

  it('should fallback to raw text when response is invalid JSON', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({ html: 'This is not JSON at all' });

    const result = await prefillNotebook(basePrefillContext());

    expect(result.method).toHaveLength(1);
    expect(result.method[0].type).toBe('text');
    expect(result.method[0].content).toBe('This is not JSON at all');
    expect(result.method[0].source).toBe('ai');
    expect(result.data).toHaveLength(1);
    expect(result.data[0].type).toBe('table');
  });

  it('should handle JSON wrapped in markdown fences', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({
      html: '```json\n' + validPrefillResponse + '\n```',
    });

    const result = await prefillNotebook(basePrefillContext());

    expect(result.method).toHaveLength(2);
    expect(result.data).toHaveLength(1);
  });

  it('should include description and parameters in prompt when provided', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({ html: validPrefillResponse });

    await prefillNotebook(basePrefillContext({
      experimentDescription: 'Investigate the relationship between voltage and current',
      parameters: ['voltage', 'resistance'],
      controls: ['temperature', 'wire length'],
    }));

    const callArgs = mockCallAnthropic.mock.calls[0];
    const params = callArgs[1];
    expect(params.userPrompt).toContain('Investigate the relationship');
    expect(params.userPrompt).toContain('voltage, resistance');
    expect(params.userPrompt).toContain('temperature, wire length');
  });

  it('should pass Chinese language instruction when language is zh', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({ html: validPrefillResponse });

    await prefillNotebook(basePrefillContext({ language: 'zh' }));

    const callArgs = mockCallAnthropic.mock.calls[0];
    expect(callArgs[1].userPrompt).toContain('Chinese');
  });

  it('should pass English language instruction when language is en', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({ html: validPrefillResponse });

    await prefillNotebook(basePrefillContext({ language: 'en' }));

    const callArgs = mockCallAnthropic.mock.calls[0];
    expect(callArgs[1].userPrompt).toContain('English');
  });

  it('should handle response with missing method field', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({
      html: JSON.stringify({ data: [{ type: 'table', content: 'a|b', source: 'ai' }] }),
    });

    const result = await prefillNotebook(basePrefillContext());

    expect(result.method).toEqual([]);
    expect(result.data).toHaveLength(1);
  });

  it('should handle response with missing data field', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({
      html: JSON.stringify({ method: [{ type: 'text', content: 'step 1', source: 'ai' }] }),
    });

    const result = await prefillNotebook(basePrefillContext());

    expect(result.method).toHaveLength(1);
    expect(result.data).toEqual([]);
  });

  it('should use zenmux base URL as anthropic route', async () => {
    mockGetAllConfigs.mockResolvedValue({
      openrouter_api_key: 'test-key',
      openrouter_base_url: 'https://zenmux.example.com/v1',
    });
    mockCallAnthropic.mockResolvedValue({ html: validPrefillResponse });

    await prefillNotebook(basePrefillContext());

    expect(mockCallAnthropic).toHaveBeenCalledOnce();
    expect(mockCallOpenRouter).not.toHaveBeenCalled();
  });

  it('should propagate error when LLM call fails', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockRejectedValue(new Error('API timeout'));

    await expect(prefillNotebook(basePrefillContext())).rejects.toThrow('API timeout');
  });
});

// ── suggestForSection ──

describe('suggestForSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_BASE_URL;
  });

  it('should return parsed suggestions from valid JSON array', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({ html: validSuggestResponse });

    const result = await suggestForSection('hypothesis', undefined, baseSuggestContext());

    expect(result.suggestions).toHaveLength(3);
    expect(result.suggestions[0]).toContain('variables');
  });

  it('should limit suggestions to 3 even if more returned', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({
      html: JSON.stringify(['a', 'b', 'c', 'd', 'e']),
    });

    const result = await suggestForSection('hypothesis', undefined, baseSuggestContext());

    expect(result.suggestions).toHaveLength(3);
  });

  it('should return empty array when response is not an array', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({
      html: JSON.stringify({ not: 'an array' }),
    });

    const result = await suggestForSection('hypothesis', undefined, baseSuggestContext());

    expect(result.suggestions).toEqual([]);
  });

  it('should fallback to line-splitting on invalid JSON', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({
      html: '1. Consider the variables\n2. Think about predictions\n3. What patterns emerge?',
    });

    const result = await suggestForSection('analysis', undefined, baseSuggestContext());

    expect(result.suggestions).toHaveLength(3);
    expect(result.suggestions[0]).toBe('Consider the variables');
    expect(result.suggestions[1]).toBe('Think about predictions');
  });

  it('should return raw text as single suggestion when no lines to split', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({ html: 'Single line suggestion' });

    const result = await suggestForSection('hypothesis', undefined, baseSuggestContext());

    expect(result.suggestions).toEqual(['Single line suggestion']);
  });

  it('should include current content in prompt when provided', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({ html: validSuggestResponse });

    await suggestForSection('hypothesis', 'My hypothesis is that...', baseSuggestContext());

    const callArgs = mockCallAnthropic.mock.calls[0];
    expect(callArgs[1].userPrompt).toContain('My hypothesis is that...');
  });

  it('should include hypothesis and data context for analysis section', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({ html: validSuggestResponse });

    await suggestForSection('analysis', undefined, baseSuggestContext({
      hypothesis: 'Current increases with voltage',
      data: 'V=1: I=0.5, V=2: I=1.0',
    }));

    const callArgs = mockCallAnthropic.mock.calls[0];
    expect(callArgs[1].userPrompt).toContain('Current increases with voltage');
    expect(callArgs[1].userPrompt).toContain('V=1: I=0.5');
  });

  it('should include analysis context for conclusion section', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({ html: validSuggestResponse });

    await suggestForSection('conclusion', undefined, baseSuggestContext({
      hypothesis: 'H1',
      data: 'D1',
      analysis: 'Linear relationship confirmed',
    }));

    const callArgs = mockCallAnthropic.mock.calls[0];
    expect(callArgs[1].userPrompt).toContain('Linear relationship confirmed');
  });

  it('should use notebookTitle when experimentTitle is not provided', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockResolvedValue({ html: validSuggestResponse });

    await suggestForSection('hypothesis', undefined, {
      notebookTitle: 'My Lab Notebook',
    });

    const callArgs = mockCallAnthropic.mock.calls[0];
    expect(callArgs[1].userPrompt).toContain('My Lab Notebook');
  });

  it('should propagate error when LLM call fails', async () => {
    setupAnthropicRoute();
    mockCallAnthropic.mockRejectedValue(new Error('Rate limited'));

    await expect(
      suggestForSection('hypothesis', undefined, baseSuggestContext())
    ).rejects.toThrow('Rate limited');
  });

  it('should use OpenRouter when base URL is not anthropic', async () => {
    setupOpenRouterRoute();
    mockCallOpenRouter.mockResolvedValue({ html: validSuggestResponse });

    await suggestForSection('hypothesis', undefined, baseSuggestContext());

    expect(mockCallOpenRouter).toHaveBeenCalledOnce();
    expect(mockCallAnthropic).not.toHaveBeenCalled();
  });
});
