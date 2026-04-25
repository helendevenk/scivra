import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { getRemainingCredits, consumeCredits } from '@/shared/models/credit';
import {
  findUpgGenerationById,
  forkGeneration,
} from '@/shared/models/upg_generation';
import { generateCore } from '@/shared/lib/upg/generate-core';
import { UPG_CREDITS_PER_REGENERATION } from '@/shared/lib/upg/constants';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('Please sign in to fork');
    }

    const { id } = await params;

    // Verify original exists and is public
    const original = await findUpgGenerationById(id);
    if (!original || !original.isPublic) {
      return respErr('Not found');
    }

    // Check credits
    const remaining = await getRemainingCredits(user.id);
    if (remaining < UPG_CREDITS_PER_REGENERATION) {
      return respErr(
        `Insufficient credits. Need ${UPG_CREDITS_PER_REGENERATION}, have ${remaining}.`
      );
    }

    // Create forked record (pending state, increments original's forkCount)
    const forked = await forkGeneration(id, user.id);
    if (!forked) {
      return respErr('Failed to fork generation');
    }

    // Run AI generation pipeline on the forked record
    const result = await generateCore({
      prompt: original.prompt,
      language: original.language as 'zh' | 'en',
      userId: user.id,
      existingGenerationId: forked.id,
      extraFields: { forkedFrom: id },
    });

    if (result.status === 'failed') {
      return respErr(result.errorMessage || 'Fork generation failed');
    }

    // Deduct credits
    await consumeCredits({
      userId: user.id,
      credits: UPG_CREDITS_PER_REGENERATION,
      scene: 'upg-fork',
      description: `UPG fork: ${original.prompt.slice(0, 50)}`,
    });

    return respData({
      id: forked.id,
      status: result.status,
      htmlContent: result.htmlContent,
    });
  } catch (e: unknown) {
    console.error('Gallery fork failed:', e);
    return respErr((e instanceof Error ? e.message : String(e)) || 'Failed to fork generation');
  }
}
