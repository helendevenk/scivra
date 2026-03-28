import { respData, respErr } from '@/shared/lib/resp';
import {
  findUpgGenerationById,
  updateUpgGeneration,
} from '@/shared/models/upg_generation';
import {
  reviewExperiment,
  isReviewConfigured,
} from '@/shared/lib/upg/review/upg-reviewer';

export const maxDuration = 60;

/**
 * POST /api/upg/review — trigger review for a generation
 * Body: { generationId: string }
 */
export async function POST(request: Request) {
  try {
    if (!isReviewConfigured()) {
      return respErr('Review API not configured (PACKY_API_KEY missing)');
    }

    const body = await request.json();
    const { generationId } = body;

    if (!generationId) {
      return respErr('generationId is required');
    }

    const generation = await findUpgGenerationById(generationId);
    if (!generation) {
      return respErr('Generation not found');
    }

    if (generation.status !== 'completed') {
      return respErr('Can only review completed generations');
    }

    if (!generation.htmlContent) {
      return respErr('Generation has no HTML content');
    }

    // Mark as reviewing
    await updateUpgGeneration(generationId, {
      reviewStatus: 'reviewing',
    });

    try {
      const result = await reviewExperiment(
        generation.htmlContent,
        generation.prompt,
        generation.category || 'physics'
      );

      await updateUpgGeneration(generationId, {
        reviewStatus: result.verdict === 'fail' ? 'failed' : 'passed',
        reviewResult: JSON.stringify(result),
        reviewedAt: new Date(),
      });

      return respData({
        generationId,
        ...result,
      });
    } catch (reviewError) {
      // Review failed — mark as error but don't block the generation
      await updateUpgGeneration(generationId, {
        reviewStatus: 'error',
        reviewResult: JSON.stringify({
          error: reviewError instanceof Error ? reviewError.message : 'Unknown review error',
        }),
      });

      return respErr(
        `Review failed: ${reviewError instanceof Error ? reviewError.message : 'Unknown error'}`
      );
    }
  } catch (error) {
    return respErr(
      error instanceof Error ? error.message : 'Internal server error'
    );
  }
}

/**
 * GET /api/upg/review?id=<generationId> — check review status
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return respErr('id query parameter is required');
    }

    const generation = await findUpgGenerationById(id);
    if (!generation) {
      return respErr('Generation not found');
    }

    const result = {
      generationId: id,
      reviewStatus: generation.reviewStatus || 'not_reviewed',
      reviewResult: generation.reviewResult
        ? JSON.parse(generation.reviewResult)
        : null,
      reviewedAt: generation.reviewedAt,
    };

    return respData(result);
  } catch (error) {
    return respErr(
      error instanceof Error ? error.message : 'Internal server error'
    );
  }
}
