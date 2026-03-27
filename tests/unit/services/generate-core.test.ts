import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import type { GenerateCoreParams } from '@/shared/lib/upg/generate-core';

// ── Clear env vars that would interfere with mock routing ──
const savedEnv = { ...process.env };

// ── Mock all external dependencies ──

vi.mock('@/shared/lib/upg/anthropic-client', () => ({
  callAnthropic: vi.fn(),
}));

vi.mock('@/shared/lib/upg/system-prompt', () => ({
  getSystemPrompt: vi.fn(() => 'mock-system-prompt'),
  buildUserPrompt: vi.fn(
    (prompt: string, lang: string, disc?: string) =>
      `[${lang}][${disc ?? 'physics'}] ${prompt}`
  ),
}));

vi.mock('@/shared/lib/upg/html-sanitizer', () => ({
  sanitizeHtml: vi.fn((html: string) => ({ sanitized: html, issues: [] })),
}));

vi.mock('@/shared/lib/upg/quality-checker', () => ({
  checkQuality: vi.fn(() => ({ passed: true, issues: [], warnings: [] })),
}));

vi.mock('@/shared/lib/upg/model-selector', () => ({
  selectModel: vi.fn(() => 'test-model'),
}));

vi.mock('@/shared/models/upg_generation', () => ({
  createUpgGeneration: vi.fn(),
  updateUpgGeneration: vi.fn(),
}));

vi.mock('@/shared/lib/hash', () => ({
  getUuid: vi.fn(() => 'test-uuid-1234'),
}));

vi.mock('@/shared/lib/moderation/content-moderator', () => ({
  moderateInput: vi.fn(() => ({ passed: true, status: 'pass' })),
  moderateOutput: vi.fn(() => ({ passed: true, status: 'pass' })),
}));

vi.mock('@/shared/models/content_moderation', () => ({
  createModerationRecord: vi.fn(),
}));

vi.mock('@/shared/lib/performance/performance-template', () => ({
  injectPerformanceCode: vi.fn((html: string) => html),
  injectMobileOptimization: vi.fn((html: string) => html),
  injectPerformanceUI: vi.fn((html: string) => html),
}));

vi.mock('@/shared/models/config', () => ({
  getAllConfigs: vi.fn(async () => ({
    openrouter_api_key: 'test-key',
    openrouter_base_url: 'https://openrouter.ai/api/v1',
  })),
}));

vi.mock('@/shared/lib/upg/validation', () => ({
  runFullValidation: vi.fn(() => ({
    overallScore: 85,
    details: { structure: 90, physics: 80 },
  })),
}));

// ── Import mocked modules ──

import { callAnthropic } from '@/shared/lib/upg/anthropic-client';
import { sanitizeHtml } from '@/shared/lib/upg/html-sanitizer';
import { checkQuality } from '@/shared/lib/upg/quality-checker';
import {
  createUpgGeneration,
  updateUpgGeneration,
} from '@/shared/models/upg_generation';
import { moderateInput } from '@/shared/lib/moderation/content-moderator';
import { getSystemPrompt } from '@/shared/lib/upg/system-prompt';
import { generateCore } from '@/shared/lib/upg/generate-core';

// ── Helpers ──

const mockedCallAnthropic = vi.mocked(callAnthropic);
const mockedSanitizeHtml = vi.mocked(sanitizeHtml);
const mockedCheckQuality = vi.mocked(checkQuality);
const mockedCreateUpg = vi.mocked(createUpgGeneration);
const mockedUpdateUpg = vi.mocked(updateUpgGeneration);
const mockedModerateInput = vi.mocked(moderateInput);
const mockedGetSystemPrompt = vi.mocked(getSystemPrompt);

function validLlmResult() {
  return {
    html: '<html><body><script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"></script></body></html>',
    inputTokens: 100,
    outputTokens: 500,
    costUsd: 0.01,
  };
}

function baseParams(overrides?: Partial<GenerateCoreParams>): GenerateCoreParams {
  return {
    prompt: 'simulate projectile motion',
    language: 'en',
    userId: 'user-1',
    ...overrides,
  };
}

// ── Tests ──

describe('generateCore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock configs provide API key; callAnthropic returns valid result
    mockedCallAnthropic.mockResolvedValue(validLlmResult());
  });

  afterAll(() => {
    // Restore env vars
    Object.assign(process.env, savedEnv);
  });

  // 1. valid prompt → returns completed result
  it('should return completed result for a valid prompt', async () => {
    const result = await generateCore(baseParams());

    expect(result.status).toBe('completed');
    expect(result.htmlContent).toBeTruthy();
    expect(result.inputTokens).toBe(100);
    expect(result.outputTokens).toBe(500);
    expect(result.id).toBeDefined();
  });

  // 2. empty prompt → input moderation rejects
  it('should fail when input moderation rejects empty prompt', async () => {
    mockedModerateInput.mockReturnValueOnce({
      passed: false,
      status: 'reject',
      reason: 'Empty or invalid prompt',
    });

    const result = await generateCore(baseParams({ prompt: '' }));

    expect(result.status).toBe('failed');
    expect(result.htmlContent).toBeNull();
    expect(result.errorMessage).toContain('Empty or invalid prompt');
  });

  // 3. LLM returns invalid HTML → sanitizer strips to empty → quality rejects
  it('should fail when sanitizer returns problematic HTML that fails quality check', async () => {
    mockedSanitizeHtml.mockReturnValueOnce({
      sanitized: '<html><body>no three.js here</body></html>',
      issues: ['stripped dangerous script'],
    });
    mockedCheckQuality.mockReturnValueOnce({
      passed: false,
      issues: ['Missing Three.js library — 3D will not render'],
      warnings: [],
    });

    const result = await generateCore(baseParams());

    expect(result.status).toBe('failed');
    expect(result.errorMessage).toContain('Quality check failed');
  });

  // 4. quality check fails → marks as failed
  it('should store failed record when quality check fails', async () => {
    mockedCheckQuality.mockReturnValueOnce({
      passed: false,
      issues: ['HTML too small'],
      warnings: [],
    });

    const result = await generateCore(baseParams());

    expect(result.status).toBe('failed');
    expect(result.errorMessage).toContain('HTML too small');
    expect(mockedCreateUpg).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
        errorMessage: expect.stringContaining('HTML too small'),
      })
    );
  });

  // 5. LLM timeout → error propagates
  it('should propagate LLM timeout error', async () => {
    mockedCallAnthropic.mockRejectedValueOnce(new Error('Request timed out'));

    await expect(generateCore(baseParams())).rejects.toThrow('Request timed out');
  });

  // 6. userId null (anonymous) → stores with null userId
  it('should handle anonymous user (userId=null)', async () => {
    const result = await generateCore(baseParams({ userId: null }));

    expect(result.status).toBe('completed');
    expect(mockedCreateUpg).toHaveBeenCalledWith(
      expect.objectContaining({ userId: null })
    );
  });

  // 7. userId present (authenticated) → stores with userId
  it('should handle authenticated user with userId', async () => {
    const result = await generateCore(baseParams({ userId: 'user-42' }));

    expect(result.status).toBe('completed');
    expect(mockedCreateUpg).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-42' })
    );
  });

  // 8. discipline parameter applied to system prompt
  it('should pass discipline to getSystemPrompt', async () => {
    await generateCore(baseParams({ discipline: 'chemistry' }));

    expect(mockedGetSystemPrompt).toHaveBeenCalledWith('chemistry');
  });

  // 9. stores result in DB on success
  it('should call createUpgGeneration on success', async () => {
    await generateCore(baseParams());

    expect(mockedCreateUpg).toHaveBeenCalledTimes(1);
    expect(mockedCreateUpg).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'completed',
        htmlContent: expect.any(String),
        model: 'test-model',
        provider: 'anthropic',
      })
    );
  });

  // 10. does NOT store on LLM failure (error thrown before DB write)
  it('should not call createUpgGeneration when LLM throws', async () => {
    mockedCallAnthropic.mockRejectedValueOnce(new Error('LLM down'));

    await expect(generateCore(baseParams())).rejects.toThrow('LLM down');
    expect(mockedCreateUpg).not.toHaveBeenCalled();
  });

  // 11. existingGenerationId → calls updateUpgGeneration instead of create
  it('should call updateUpgGeneration when existingGenerationId is provided', async () => {
    await generateCore(
      baseParams({ existingGenerationId: 'existing-id-999' })
    );

    expect(mockedUpdateUpg).toHaveBeenCalledTimes(1);
    expect(mockedUpdateUpg).toHaveBeenCalledWith(
      'existing-id-999',
      expect.objectContaining({ status: 'completed' })
    );
    expect(mockedCreateUpg).not.toHaveBeenCalled();
  });

  // 12. Always uses Anthropic client (single provider)
  it('should always call Anthropic client', async () => {
    const result = await generateCore(baseParams());

    expect(result.status).toBe('completed');
    expect(mockedCallAnthropic).toHaveBeenCalledTimes(1);
  });
});
