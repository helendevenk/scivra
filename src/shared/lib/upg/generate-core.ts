import { callOpenRouter } from '@/shared/lib/upg/openrouter-client';
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

export interface GenerateCoreParams {
  prompt: string;
  language: 'zh' | 'en';
  userId: string | null;
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
  const { prompt, language, userId, existingGenerationId, extraFields } =
    params;
  const model = selectModel();
  const systemPrompt = getSystemPrompt();
  const userPrompt = buildUserPrompt(prompt, language);
  const promptHash = createHash('sha256').update(prompt).digest('hex');

  // 1. AI generation
  const aiResult = await callOpenRouter({
    model,
    systemPrompt,
    userPrompt,
  });

  // 2. Post-processing
  const { sanitized: htmlContent } = sanitizeHtml(aiResult.html);
  const qualityResult = checkQuality(htmlContent);

  const htmlSize = new TextEncoder().encode(htmlContent).length;
  const generationId = existingGenerationId || getUuid();

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
      provider: 'openrouter',
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

  // 3. Success: store completed generation
  const successData: NewUpgGeneration = {
    id: generationId,
    userId,
    prompt,
    promptHash,
    language,
    htmlContent,
    htmlSize,
    model,
    provider: 'openrouter',
    inputTokens: aiResult.inputTokens,
    outputTokens: aiResult.outputTokens,
    costCredits: 0, // Caller handles credit deduction
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
