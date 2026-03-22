import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  getRemainingCredits,
  consumeCredits,
  refundCredits,
} from '@/shared/models/credit';
import {
  getDailyQuotaCount,
  incrementDailyQuota,
} from '@/shared/models/upg_daily_quota';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { subscriptionToTier } from '@/shared/lib/experiments/access';
import { refineCore } from '@/shared/lib/upg/refine-core';
import {
  UPG_CREDITS_PER_REFINEMENT,
  UPG_FREE_DAILY_LIMIT,
  UPG_PRO_DAILY_LIMIT,
} from '@/shared/lib/upg/constants';
import { checkRateLimit, acquireLock, releaseLock } from '@/shared/lib/redis';

export const maxDuration = 60;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let lockKey: string | null = null;

  try {
    const { id: generationId } = await params;

    // 1. Auth required (no anonymous refinement)
    const user = await getUserInfo();
    if (!user) {
      return respErr('Sign in to refine visualizations');
    }
    const userId = user.id;

    // 2. Parse refinement prompt
    const body = await request.json();
    const refinementPrompt =
      typeof body.refinementPrompt === 'string'
        ? body.refinementPrompt.trim()
        : '';
    const language: 'zh' | 'en' = body.language === 'en' ? 'en' : 'zh';

    if (refinementPrompt.length < 2 || refinementPrompt.length > 1000) {
      return respErr(
        'Refinement prompt must be between 2 and 1000 characters'
      );
    }

    // 3. Rate limiting (reuse daily quota)
    const todayStr = new Date().toISOString().slice(0, 10);
    const sub = await getCurrentSubscription(userId);
    const tier = subscriptionToTier(sub?.planName ?? null);

    if (tier !== 'max') {
      const dailyCount = await getDailyQuotaCount(userId, todayStr);
      const limit = tier === 'pro' ? UPG_PRO_DAILY_LIMIT : UPG_FREE_DAILY_LIMIT;
      if (dailyCount >= limit) {
        return respErr(
          `Daily limit reached (${limit}/day). ${tier === 'free' ? 'Upgrade to Pro for more.' : 'Try again tomorrow.'}`
        );
      }
    }

    // 4. Credits pre-check
    const remaining = await getRemainingCredits(userId);
    if (remaining < UPG_CREDITS_PER_REFINEMENT) {
      return respErr(
        `Insufficient credits. Need ${UPG_CREDITS_PER_REFINEMENT}, have ${remaining}.`
      );
    }

    // 5. Per-user rate limit (burst protection)
    const { allowed } = await checkRateLimit(
      `upg:refine:${userId}`,
      3, // max 3 refinements per 10 minutes
      600
    );
    if (!allowed) {
      return respErr('Too many refinement requests. Please wait a few minutes.');
    }

    // 6. Distributed lock
    lockKey = `upg:lock:${userId}`;
    const lockAcquired = await acquireLock(lockKey, 300);
    if (!lockAcquired) {
      return respErr('A generation is already in progress. Please wait.');
    }

    // 7. Call refineCore
    const result = await refineCore({
      generationId,
      refinementPrompt,
      userId,
      language,
    });

    if (result.status === 'failed') {
      return respErr(result.errorMessage || 'Refinement failed');
    }

    // 8. Consume credits + increment daily quota
    let creditId: string | null = null;
    let creditsConsumed = false;

    try {
      const creditResult = await consumeCredits({
        userId,
        credits: UPG_CREDITS_PER_REFINEMENT,
        scene: 'upg-refine',
        description: `UPG refinement: ${refinementPrompt.slice(0, 50)}`,
      });
      creditId = creditResult?.id ?? null;
      creditsConsumed = true;

      await incrementDailyQuota(userId, todayStr);

      return respData({
        id: result.id,
        status: result.status,
        version: result.version,
        htmlContent: result.htmlContent,
      });
    } catch (dbError: unknown) {
      if (creditsConsumed && creditId) {
        try {
          const errMsg =
            dbError instanceof Error ? dbError.message : 'Unknown error';
          await refundCredits({
            userId,
            credits: UPG_CREDITS_PER_REFINEMENT,
            scene: 'upg-refund',
            description: `Refund due to post-refinement failure: ${errMsg.slice(0, 100)}`,
            relatedCreditId: creditId,
          });
        } catch (refundError: unknown) {
          console.error('Failed to refund refinement credits:', refundError);
        }
      }
      throw dbError;
    }
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : 'Refinement failed';
    console.error('UPG refine failed:', e);
    return respErr(errMsg);
  } finally {
    if (lockKey) {
      await releaseLock(lockKey);
    }
  }
}
