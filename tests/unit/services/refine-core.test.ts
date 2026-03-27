import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import type { RefineCoreParams } from '@/shared/lib/upg/refine-core';

// ── Clear env vars that would interfere with mock routing ──
const savedEnv = { ...process.env };

// ── Mock all external dependencies ──

vi.mock('@/shared/lib/upg/anthropic-client', () => ({
  callAnthropic: vi.fn(),
}));

vi.mock('@/shared/lib/upg/system-prompt', () => ({
  getSystemPrompt: vi.fn(() => 'mock-system-prompt'),
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
  findUpgGenerationById: vi.fn(),
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
  findUpgGenerationById,
} from '@/shared/models/upg_generation';
import { moderateInput, moderateOutput } from '@/shared/lib/moderation/content-moderator';
import { createModerationRecord } from '@/shared/models/content_moderation';
import { refineCore } from '@/shared/lib/upg/refine-core';

// ── Helpers ──

const mockedCallAnthropic = vi.mocked(callAnthropic);
const mockedSanitizeHtml = vi.mocked(sanitizeHtml);
const mockedCheckQuality = vi.mocked(checkQuality);
const mockedCreateUpg = vi.mocked(createUpgGeneration);
const mockedFindById = vi.mocked(findUpgGenerationById);
const mockedModerateInput = vi.mocked(moderateInput);
const mockedModerateOutput = vi.mocked(moderateOutput);
const mockedCreateModerationRecord = vi.mocked(createModerationRecord);

function validLlmResult() {
  return {
    html: '<html><body><script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"></script></body></html>',
    inputTokens: 200,
    outputTokens: 800,
    costUsd: 0.02,
  };
}

function validOriginalGeneration(overrides?: Record<string, unknown>) {
  return {
    id: 'gen-original-1',
    userId: 'user-1',
    prompt: 'simulate projectile motion',
    htmlContent: '<html><body>original content</body></html>',
    status: 'completed',
    version: 1,
    category: 'physics',
    ...overrides,
  };
}

function baseParams(overrides?: Partial<RefineCoreParams>): RefineCoreParams {
  return {
    generationId: 'gen-original-1',
    refinementPrompt: 'add air resistance',
    userId: 'user-1',
    language: 'en',
    ...overrides,
  };
}

// ── Tests ──

describe('refineCore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedFindById.mockResolvedValue(validOriginalGeneration());
    mockedCallAnthropic.mockResolvedValue(validLlmResult());
  });

  afterAll(() => {
    Object.assign(process.env, savedEnv);
  });

  // 1. Happy path: valid refinement → completed result
  it('should return completed result for a valid refinement', async () => {
    const result = await refineCore(baseParams());

    expect(result.status).toBe('completed');
    expect(result.htmlContent).toBeTruthy();
    expect(result.inputTokens).toBe(200);
    expect(result.outputTokens).toBe(800);
    expect(result.version).toBe(2);
    expect(result.id).toBe('test-uuid-1234');
  });

  // 2. Original not found → failed
  it('should fail when original generation is not found', async () => {
    mockedFindById.mockResolvedValueOnce(undefined);

    const result = await refineCore(baseParams());

    expect(result.status).toBe('failed');
    expect(result.errorMessage).toContain('Original generation not found');
    expect(result.id).toBe('');
  });

  // 3. Original not completed → failed
  it('should fail when original generation is not completed', async () => {
    mockedFindById.mockResolvedValueOnce(
      validOriginalGeneration({ status: 'failed', htmlContent: null })
    );

    const result = await refineCore(baseParams());

    expect(result.status).toBe('failed');
    expect(result.errorMessage).toContain('Can only refine completed generations');
  });

  // 4. Original has no HTML → failed
  it('should fail when original generation has no HTML content', async () => {
    mockedFindById.mockResolvedValueOnce(
      validOriginalGeneration({ htmlContent: null })
    );

    const result = await refineCore(baseParams());

    expect(result.status).toBe('failed');
    expect(result.errorMessage).toContain('Can only refine completed generations');
  });

  // 5. Input moderation rejects → failed + moderation record
  it('should fail when input moderation rejects refinement prompt', async () => {
    mockedModerateInput.mockReturnValueOnce({
      passed: false,
      status: 'reject',
      reason: 'Inappropriate content',
    });

    const result = await refineCore(baseParams());

    expect(result.status).toBe('failed');
    expect(result.errorMessage).toContain('Inappropriate content');
    expect(mockedCreateModerationRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        checkType: 'input',
        status: 'reject',
      })
    );
  });

  // 6. Quality check fails → stores failed record
  it('should store failed record when quality check fails', async () => {
    mockedCheckQuality.mockReturnValueOnce({
      passed: false,
      issues: ['Missing Three.js library'],
      warnings: [],
    });

    const result = await refineCore(baseParams());

    expect(result.status).toBe('failed');
    expect(result.errorMessage).toContain('Missing Three.js library');
    expect(mockedCreateUpg).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
        parentId: 'gen-original-1',
        refinementPrompt: 'add air resistance',
      })
    );
  });

  // 7. Output moderation fails → stores failed record + moderation record
  it('should fail when output moderation rejects', async () => {
    mockedModerateOutput.mockReturnValueOnce({
      passed: false,
      status: 'reject',
      reason: 'Unsafe output detected',
    });

    const result = await refineCore(baseParams());

    expect(result.status).toBe('failed');
    expect(result.errorMessage).toContain('Unsafe output detected');
    expect(mockedCreateUpg).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'failed' })
    );
    expect(mockedCreateModerationRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        checkType: 'output',
        status: 'reject',
      })
    );
  });

  // 8. LLM timeout → error propagates
  it('should propagate LLM error', async () => {
    mockedCallAnthropic.mockRejectedValueOnce(new Error('Request timed out'));

    await expect(refineCore(baseParams())).rejects.toThrow('Request timed out');
  });

  // 9. No API key → throws
  it('should throw when no API key is configured', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    const { getAllConfigs } = await import('@/shared/models/config');
    vi.mocked(getAllConfigs).mockResolvedValueOnce({} as any);

    await expect(refineCore(baseParams())).rejects.toThrow(
      'No AI provider API key configured'
    );
  });

  // 10. Version increments correctly from parent
  it('should increment version from parent generation', async () => {
    mockedFindById.mockResolvedValueOnce(
      validOriginalGeneration({ version: 3 })
    );

    const result = await refineCore(baseParams());

    expect(result.version).toBe(4);
  });

  // 11. Null version on parent defaults to 1 → new version = 2
  it('should default parent version to 1 when null', async () => {
    mockedFindById.mockResolvedValueOnce(
      validOriginalGeneration({ version: null })
    );

    const result = await refineCore(baseParams());

    expect(result.version).toBe(2);
  });

  // 12. Stores success record with parentId and refinementPrompt
  it('should store completed record with parentId and refinementPrompt', async () => {
    await refineCore(baseParams());

    expect(mockedCreateUpg).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'completed',
        parentId: 'gen-original-1',
        refinementPrompt: 'add air resistance',
        version: 2,
        provider: 'anthropic',
        model: 'test-model',
      })
    );
  });

  // 13. Uses original's category as discipline
  it('should use original category as discipline', async () => {
    mockedFindById.mockResolvedValueOnce(
      validOriginalGeneration({ category: 'chemistry' })
    );

    await refineCore(baseParams());

    // checkQuality receives discipline from original
    expect(mockedCheckQuality).toHaveBeenCalledWith(
      expect.any(String),
      'chemistry'
    );
  });

  // 14. Quality warnings logged but don't fail
  it('should not fail when quality check has only warnings', async () => {
    mockedCheckQuality.mockReturnValueOnce({
      passed: true,
      issues: [],
      warnings: ['HTML is large'],
    });

    const result = await refineCore(baseParams());

    expect(result.status).toBe('completed');
  });

  // 15. Does NOT store when LLM throws (error before DB write)
  it('should not call createUpgGeneration when LLM throws', async () => {
    mockedCallAnthropic.mockRejectedValueOnce(new Error('LLM down'));

    await expect(refineCore(baseParams())).rejects.toThrow('LLM down');
    expect(mockedCreateUpg).not.toHaveBeenCalled();
  });
});
