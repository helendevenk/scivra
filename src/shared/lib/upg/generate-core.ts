import { callAnthropic } from '@/shared/lib/upg/anthropic-client';
import {
  getSystemPrompt,
  buildUserPrompt,
} from '@/shared/lib/upg/system-prompt';
import { sanitizeHtml } from '@/shared/lib/upg/html-sanitizer';
import { checkQuality } from '@/shared/lib/upg/quality-checker';
import { selectModel } from '@/shared/lib/upg/model-selector';
import {
  createUpgGeneration,
  updateUpgGeneration,
  NewUpgGeneration,
} from '@/shared/models/upg_generation';
import { getUuid } from '@/shared/lib/hash';
import { createHash } from 'crypto';
import { moderateInput, moderateOutput } from '@/shared/lib/moderation/content-moderator';
import { createModerationRecord } from '@/shared/models/content_moderation';
import {
  injectPerformanceCode,
  injectPerformanceUI,
  injectMobileOptimization,
} from '@/shared/lib/performance/performance-template';
import { getAllConfigs } from '@/shared/models/config';
import { runFullValidation } from '@/shared/lib/upg/validation';

export interface GenerateCoreParams {
  prompt: string;
  language: 'zh' | 'en';
  userId: string | null;
  /** Discipline ID (default: 'physics') */
  discipline?: string;
  /** Pre-created generation ID (for fork: record already exists in pending state) */
  existingGenerationId?: string;
  /** Extra fields to merge into the generation record */
  extraFields?: Partial<NewUpgGeneration>;
}

export interface GenerateCoreResult {
  id: string;
  status: 'completed' | 'failed';
  htmlContent: string | null;
  errorMessage?: string;
  inputTokens: number;
  outputTokens: number;
}

/**
 * Core AI generation pipeline: call LLM → sanitize → quality check → store.
 * Shared between /api/upg/generate and /api/gallery/[id]/fork.
 *
 * Does NOT handle: auth, rate limiting, credits, concurrency locks.
 * Caller is responsible for those.
 */
export async function generateCore(
  params: GenerateCoreParams
): Promise<GenerateCoreResult> {
  const { prompt, language, userId, discipline, existingGenerationId, extraFields } =
    params;
  const model = selectModel();
  const systemPrompt = getSystemPrompt(discipline);
  const userPrompt = buildUserPrompt(prompt, language, discipline);
  const promptHash = createHash('sha256').update(prompt).digest('hex');
  const generationId = existingGenerationId || getUuid();

  // 0. Input moderation (Phase 0.6)
  const inputModerationResult = moderateInput(prompt);
  if (!inputModerationResult.passed) {
    // Input moderation failed - reject immediately
    const failedData: NewUpgGeneration = {
      id: generationId,
      userId,
      prompt,
      promptHash,
      language,
      model,
      provider: 'anthropic',
      inputTokens: 0,
      outputTokens: 0,
      costCredits: 0,
      status: 'failed',
      errorMessage: inputModerationResult.reason || 'Input moderation failed',
      isPublic: false,
      viewCount: 0,
      shareCount: 0,
      downloadCount: 0,
      ...extraFields,
    };

    if (existingGenerationId) {
      await updateUpgGeneration(existingGenerationId, failedData);
    } else {
      await createUpgGeneration(failedData);
    }

    // Record moderation result
    await createModerationRecord({
      generationId,
      checkType: 'input',
      status: inputModerationResult.status,
      reason: inputModerationResult.reason,
      matchedKeywords: inputModerationResult.matchedKeywords || [],
    });

    return {
      id: generationId,
      status: 'failed',
      htmlContent: null,
      errorMessage: inputModerationResult.reason || 'Input moderation failed',
      inputTokens: 0,
      outputTokens: 0,
    };
  }

  // Record input moderation result (passed or pending)
  if (inputModerationResult.status === 'pending') {
    await createModerationRecord({
      generationId,
      checkType: 'input',
      status: 'pending',
      reason: inputModerationResult.reason,
      matchedKeywords: inputModerationResult.matchedKeywords || [],
    });
  }

  // 1. AI generation
  // Resolve API key and base URL from env vars or DB config
  const configs = await getAllConfigs();
  const apiKey =
    process.env.ANTHROPIC_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    configs.openrouter_api_key;
  const baseUrl =
    process.env.ANTHROPIC_BASE_URL ||
    process.env.OPENROUTER_BASE_URL ||
    configs.openrouter_base_url ||
    'https://api.anthropic.com';

  if (!apiKey) {
    throw new Error('No AI provider API key configured. Set ANTHROPIC_API_KEY or OPENROUTER_API_KEY.');
  }

  const aiResult = await callAnthropic(apiKey, { model, systemPrompt, userPrompt, baseUrl });

  // 2. Post-processing
  let { sanitized: htmlContent } = sanitizeHtml(aiResult.html);

  // 2.1 Inject performance optimization code (Phase 0.5)
  htmlContent = injectPerformanceCode(htmlContent);
  htmlContent = injectMobileOptimization(htmlContent);
  htmlContent = injectPerformanceUI(htmlContent);

  const qualityResult = checkQuality(htmlContent, discipline);

  // Log warnings for debugging (non-blocking)
  if (qualityResult.warnings.length > 0) {
    console.warn(`[UPG] Quality warnings for "${prompt.slice(0, 50)}": ${qualityResult.warnings.join('; ')}`);
  }

  const htmlSize = new TextEncoder().encode(htmlContent).length;

  if (!qualityResult.passed) {
    // Quality check failed
    const failedData: NewUpgGeneration = {
      id: generationId,
      userId,
      prompt,
      promptHash,
      language,
      htmlContent,
      model,
      provider: 'anthropic',
      inputTokens: aiResult.inputTokens,
      outputTokens: aiResult.outputTokens,
      costCredits: 0,
      status: 'failed',
      errorMessage: `Quality check failed: ${qualityResult.issues.join('; ')}`,
      isPublic: false,
      viewCount: 0,
      shareCount: 0,
      downloadCount: 0,
      ...extraFields,
    };

    if (existingGenerationId) {
      await updateUpgGeneration(existingGenerationId, failedData);
    } else {
      await createUpgGeneration(failedData);
    }

    return {
      id: generationId,
      status: 'failed',
      htmlContent: null,
      errorMessage: `Quality check failed: ${qualityResult.issues.join('; ')}`,
      inputTokens: aiResult.inputTokens,
      outputTokens: aiResult.outputTokens,
    };
  }

  // 3. Output moderation (Phase 0.6)
  const outputModerationResult = moderateOutput(htmlContent);
  if (!outputModerationResult.passed) {
    // Output moderation failed - reject
    const failedData: NewUpgGeneration = {
      id: generationId,
      userId,
      prompt,
      promptHash,
      language,
      htmlContent,
      htmlSize,
      model,
      provider: 'anthropic',
      inputTokens: aiResult.inputTokens,
      outputTokens: aiResult.outputTokens,
      costCredits: 0,
      status: 'failed',
      errorMessage: outputModerationResult.reason || 'Output moderation failed',
      isPublic: false,
      viewCount: 0,
      shareCount: 0,
      downloadCount: 0,
      ...extraFields,
    };

    if (existingGenerationId) {
      await updateUpgGeneration(existingGenerationId, failedData);
    } else {
      await createUpgGeneration(failedData);
    }

    // Record moderation result
    await createModerationRecord({
      generationId,
      checkType: 'output',
      status: outputModerationResult.status,
      reason: outputModerationResult.reason,
      matchedKeywords: [],
    });

    return {
      id: generationId,
      status: 'failed',
      htmlContent: null,
      errorMessage: outputModerationResult.reason || 'Output moderation failed',
      inputTokens: aiResult.inputTokens,
      outputTokens: aiResult.outputTokens,
    };
  }

  // Record output moderation result (passed or pending)
  if (outputModerationResult.status === 'pending') {
    await createModerationRecord({
      generationId,
      checkType: 'output',
      status: 'pending',
      reason: outputModerationResult.reason,
      matchedKeywords: [],
    });
  }

  // 3.5. Discipline validation (non-blocking, results stored as metadata)
  let validationScore: number | null = null;
  let validationDetails: string | null = null;
  let validatedAt: Date | null = null;
  try {
    const validationResult = runFullValidation(htmlContent, discipline || 'physics');
    validationScore = validationResult.overallScore;
    validationDetails = JSON.stringify(validationResult.details);
    validatedAt = new Date();
  } catch {
    // Validation crash should never block generation
    console.warn('[UPG] Validation failed silently');
  }

  // 4. Success: store completed generation
  const successData: NewUpgGeneration = {
    id: generationId,
    userId,
    prompt,
    promptHash,
    language,
    category: discipline || null,
    htmlContent,
    htmlSize,
    model,
    provider: 'anthropic',
    inputTokens: aiResult.inputTokens,
    outputTokens: aiResult.outputTokens,
    costCredits: 0, // Caller handles credit deduction
    validationScore,
    validationDetails,
    validatedAt,
    status: 'completed',
    isPublic: false,
    viewCount: 0,
    shareCount: 0,
    downloadCount: 0,
    ...extraFields,
  };

  if (existingGenerationId) {
    await updateUpgGeneration(existingGenerationId, successData);
  } else {
    await createUpgGeneration(successData);
  }

  return {
    id: generationId,
    status: 'completed',
    htmlContent,
    inputTokens: aiResult.inputTokens,
    outputTokens: aiResult.outputTokens,
  };
}
