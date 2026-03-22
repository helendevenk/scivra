import { callOpenRouter } from '@/shared/lib/upg/openrouter-client';
import { callAnthropic } from '@/shared/lib/upg/anthropic-client';
import { getSystemPrompt } from '@/shared/lib/upg/system-prompt';
import { sanitizeHtml } from '@/shared/lib/upg/html-sanitizer';
import { checkQuality } from '@/shared/lib/upg/quality-checker';
import { selectModel } from '@/shared/lib/upg/model-selector';
import {
  createUpgGeneration,
  findUpgGenerationById,
  NewUpgGeneration,
} from '@/shared/models/upg_generation';
import { getUuid } from '@/shared/lib/hash';
import { createHash } from 'crypto';
import {
  moderateInput,
  moderateOutput,
} from '@/shared/lib/moderation/content-moderator';
import { createModerationRecord } from '@/shared/models/content_moderation';
import {
  injectPerformanceCode,
  injectPerformanceUI,
  injectMobileOptimization,
} from '@/shared/lib/performance/performance-template';
import { getAllConfigs } from '@/shared/models/config';
import { runFullValidation } from '@/shared/lib/upg/validation';
import { UPG_REFINEMENT_MAX_TOKENS } from '@/shared/lib/upg/constants';

export interface RefineCoreParams {
  /** ID of the generation to refine */
  generationId: string;
  /** User's refinement instruction */
  refinementPrompt: string;
  userId: string;
  language: 'zh' | 'en';
}

export interface RefineCoreResult {
  id: string;
  status: 'completed' | 'failed';
  htmlContent: string | null;
  errorMessage?: string;
  inputTokens: number;
  outputTokens: number;
  version: number;
}

/**
 * Refinement pipeline: load original → build context → call LLM → sanitize → store as new version.
 *
 * Does NOT handle: auth, rate limiting, credits, concurrency locks.
 * Caller is responsible for those.
 */
export async function refineCore(
  params: RefineCoreParams
): Promise<RefineCoreResult> {
  const { generationId, refinementPrompt, userId, language } = params;

  // 1. Load original generation
  const original = await findUpgGenerationById(generationId);
  if (!original) {
    return {
      id: '',
      status: 'failed',
      htmlContent: null,
      errorMessage: 'Original generation not found',
      inputTokens: 0,
      outputTokens: 0,
      version: 0,
    };
  }

  if (original.status !== 'completed' || !original.htmlContent) {
    return {
      id: '',
      status: 'failed',
      htmlContent: null,
      errorMessage: 'Can only refine completed generations with HTML content',
      inputTokens: 0,
      outputTokens: 0,
      version: 0,
    };
  }

  const newId = getUuid();
  const parentVersion = original.version ?? 1;
  const newVersion = parentVersion + 1;
  const discipline = original.category || 'physics';

  // 2. Input moderation on refinement prompt
  const inputMod = moderateInput(refinementPrompt);
  if (!inputMod.passed) {
    await createModerationRecord({
      generationId: newId,
      checkType: 'input',
      status: inputMod.status,
      reason: inputMod.reason,
      matchedKeywords: inputMod.matchedKeywords || [],
    });
    return {
      id: newId,
      status: 'failed',
      htmlContent: null,
      errorMessage: inputMod.reason || 'Refinement prompt moderation failed',
      inputTokens: 0,
      outputTokens: 0,
      version: newVersion,
    };
  }

  // 3. Build refinement prompt with original context
  const model = selectModel();
  const systemPrompt = buildRefinementSystemPrompt(discipline);
  const userPrompt = buildRefinementUserPrompt(
    original.prompt,
    original.htmlContent,
    refinementPrompt,
    language
  );
  const promptHash = createHash('sha256')
    .update(`${original.prompt}::refine::${refinementPrompt}`)
    .digest('hex');

  // 4. Call LLM
  const configs = await getAllConfigs();
  const apiKey = process.env.OPENROUTER_API_KEY || configs.openrouter_api_key;
  const baseUrl =
    process.env.OPENROUTER_BASE_URL || configs.openrouter_base_url;
  const useAnthropic =
    baseUrl?.includes('anthropic') || baseUrl?.includes('zenmux');

  const aiResult =
    useAnthropic && apiKey
      ? await callAnthropic(apiKey, {
          model,
          systemPrompt,
          userPrompt,
          maxTokens: UPG_REFINEMENT_MAX_TOKENS,
        })
      : await callOpenRouter({ model, systemPrompt, userPrompt });

  // 5. Post-processing
  let { sanitized: htmlContent } = sanitizeHtml(aiResult.html);
  htmlContent = injectPerformanceCode(htmlContent);
  htmlContent = injectMobileOptimization(htmlContent);
  htmlContent = injectPerformanceUI(htmlContent);

  const qualityResult = checkQuality(htmlContent, discipline);

  if (qualityResult.warnings.length > 0) {
    console.warn(
      `[UPG Refine] Quality warnings: ${qualityResult.warnings.join('; ')}`
    );
  }

  const htmlSize = new TextEncoder().encode(htmlContent).length;

  if (!qualityResult.passed) {
    const failedData: NewUpgGeneration = {
      id: newId,
      userId,
      prompt: original.prompt,
      promptHash,
      language,
      category: discipline,
      htmlContent,
      htmlSize,
      model,
      provider: 'openrouter',
      inputTokens: aiResult.inputTokens,
      outputTokens: aiResult.outputTokens,
      costCredits: 0,
      status: 'failed',
      errorMessage: `Refinement quality check failed: ${qualityResult.issues.join('; ')}`,
      isPublic: false,
      viewCount: 0,
      shareCount: 0,
      downloadCount: 0,
      version: newVersion,
      parentId: generationId,
      refinementPrompt,
    };
    await createUpgGeneration(failedData);

    return {
      id: newId,
      status: 'failed',
      htmlContent: null,
      errorMessage: `Quality check failed: ${qualityResult.issues.join('; ')}`,
      inputTokens: aiResult.inputTokens,
      outputTokens: aiResult.outputTokens,
      version: newVersion,
    };
  }

  // 6. Output moderation
  const outputMod = moderateOutput(htmlContent);
  if (!outputMod.passed) {
    const failedData: NewUpgGeneration = {
      id: newId,
      userId,
      prompt: original.prompt,
      promptHash,
      language,
      category: discipline,
      htmlContent,
      htmlSize,
      model,
      provider: 'openrouter',
      inputTokens: aiResult.inputTokens,
      outputTokens: aiResult.outputTokens,
      costCredits: 0,
      status: 'failed',
      errorMessage: outputMod.reason || 'Output moderation failed',
      isPublic: false,
      viewCount: 0,
      shareCount: 0,
      downloadCount: 0,
      version: newVersion,
      parentId: generationId,
      refinementPrompt,
    };
    await createUpgGeneration(failedData);

    await createModerationRecord({
      generationId: newId,
      checkType: 'output',
      status: outputMod.status,
      reason: outputMod.reason,
      matchedKeywords: [],
    });

    return {
      id: newId,
      status: 'failed',
      htmlContent: null,
      errorMessage: outputMod.reason || 'Output moderation failed',
      inputTokens: aiResult.inputTokens,
      outputTokens: aiResult.outputTokens,
      version: newVersion,
    };
  }

  // 7. Validation (non-blocking)
  let validationScore: number | null = null;
  let validationDetails: string | null = null;
  let validatedAt: Date | null = null;
  try {
    const vr = runFullValidation(htmlContent, discipline);
    validationScore = vr.overallScore;
    validationDetails = JSON.stringify(vr.details);
    validatedAt = new Date();
  } catch {
    console.warn('[UPG Refine] Validation failed silently');
  }

  // 8. Store refined generation as new version
  const successData: NewUpgGeneration = {
    id: newId,
    userId,
    prompt: original.prompt,
    promptHash,
    language,
    category: discipline,
    htmlContent,
    htmlSize,
    model,
    provider: 'openrouter',
    inputTokens: aiResult.inputTokens,
    outputTokens: aiResult.outputTokens,
    costCredits: 0,
    validationScore,
    validationDetails,
    validatedAt,
    status: 'completed',
    isPublic: false,
    viewCount: 0,
    shareCount: 0,
    downloadCount: 0,
    version: newVersion,
    parentId: generationId,
    refinementPrompt,
  };
  await createUpgGeneration(successData);

  return {
    id: newId,
    status: 'completed',
    htmlContent,
    inputTokens: aiResult.inputTokens,
    outputTokens: aiResult.outputTokens,
    version: newVersion,
  };
}

// ─── Prompt builders ───

function buildRefinementSystemPrompt(discipline: string): string {
  const basePrompt = getSystemPrompt(discipline);
  return `${basePrompt}

## REFINEMENT MODE

You are refining an existing visualization based on user feedback. You will receive:
1. The original user prompt
2. The current HTML visualization code
3. A refinement instruction describing what to change

RULES:
- Output a COMPLETE, self-contained HTML file (not a diff/patch)
- Preserve everything that works well in the original
- Apply ONLY the changes requested in the refinement instruction
- Keep the same technology stack (Three.js r134 + KaTeX 0.16.9)
- Maintain or improve visual quality — never degrade
- If the refinement asks for something physically impossible, add a note in the knowledge panel explaining the constraint`;
}

function buildRefinementUserPrompt(
  originalPrompt: string,
  originalHtml: string,
  refinementInstruction: string,
  language: 'zh' | 'en'
): string {
  const langNote =
    language === 'zh'
      ? 'Respond with Chinese UI labels and knowledge cards.'
      : 'Respond with English UI labels and knowledge cards.';

  // Truncate original HTML if very large to stay within context
  const maxHtmlLen = 60000;
  const truncatedHtml =
    originalHtml.length > maxHtmlLen
      ? originalHtml.slice(0, maxHtmlLen) + '\n<!-- ... truncated for context -->'
      : originalHtml;

  return `## ORIGINAL PROMPT
${originalPrompt}

## CURRENT VISUALIZATION (HTML)
\`\`\`html
${truncatedHtml}
\`\`\`

## REFINEMENT REQUEST
${refinementInstruction}

${langNote}

Please output the complete refined HTML file. Apply the refinement changes while preserving everything else that works well.`;
}
