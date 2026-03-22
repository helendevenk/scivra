import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { getRemainingCredits, consumeCredits, refundCredits } from '@/shared/models/credit';
import {
  getDailyQuotaCount,
  incrementDailyQuota,
} from '@/shared/models/upg_daily_quota';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { subscriptionToTier } from '@/shared/lib/experiments/access';
import { generateCore } from '@/shared/lib/upg/generate-core';
import { getDisciplineConfig, isValidDiscipline } from '@/shared/lib/upg/disciplines';
import {
  UPG_CREDITS_PER_GENERATION,
  UPG_CREDITS_PER_REGENERATION,
  UPG_FREE_DAILY_LIMIT,
  UPG_PRO_DAILY_LIMIT,
} from '@/shared/lib/upg/constants';
import { createHash } from 'crypto';
import { checkRateLimit, acquireLock, releaseLock } from '@/shared/lib/redis';

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

export async function POST(request: Request) {
  let lockKey: string | null = null;

  try {
    // 1. Parse & validate params
    const body = await request.json();
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const language: 'zh' | 'en' = body.language === 'en' ? 'en' : 'zh';
    const discipline = typeof body.discipline === 'string' ? body.discipline : 'physics';
    const isRegenerate = body.isRegenerate === true;

    // Validate discipline
    if (!isValidDiscipline(discipline)) {
      return respErr('Invalid discipline');
    }
    const disciplineConfig = getDisciplineConfig(discipline);
    if (!disciplineConfig.enabled) {
      return respErr(`${disciplineConfig.name.en} is coming soon`);
    }
    const creditsToConsume = isRegenerate ? UPG_CREDITS_PER_REGENERATION : UPG_CREDITS_PER_GENERATION;

    if (prompt.length < 2 || prompt.length > 500) {
      return respErr('Prompt length must be between 2 and 500 characters');
    }

    // 2. Auth (optional — anonymous allowed)
    const user = await getUserInfo();
    const userId = user?.id ?? null;

    // 3. Rate limiting
    const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    if (!userId) {
      // Anonymous: IP-based, 1/day (Redis-backed)
      const forwarded = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
      const ipHash = hashIp(ip);

      const { allowed } = await checkRateLimit(
        `upg:anon:${ipHash}`,
        1, // 1 generation per day
        86400 // 24 hours
      );

      if (!allowed) {
        return respErr('Anonymous users can generate once per day. Please sign in for more.');
      }
    } else {
      // Logged-in user: check daily quota
      const sub = await getCurrentSubscription(userId);
      const tier = subscriptionToTier(sub?.planName ?? null);

      if (tier !== 'max') {
        const dailyCount = await getDailyQuotaCount(userId, todayStr);
        const limit = tier === 'pro' ? UPG_PRO_DAILY_LIMIT : UPG_FREE_DAILY_LIMIT;
        if (dailyCount >= limit) {
          return respErr(`Daily generation limit reached (${limit}/day). ${tier === 'free' ? 'Upgrade to Pro for more.' : 'Try again tomorrow.'}`);
        }
      }

      // 4. Credits pre-check (logged-in only, check without deducting)
      const remaining = await getRemainingCredits(userId);
      if (remaining < creditsToConsume) {
        return respErr(`Insufficient credits. Need ${creditsToConsume}, have ${remaining}.`);
      }
    }

    // 5. Concurrency lock (Redis-backed distributed lock)
    const forwarded2 = request.headers.get('x-forwarded-for');
    const realIp2 = request.headers.get('x-real-ip');
    const anonIp = forwarded2?.split(',')[0]?.trim() || realIp2 || 'unknown';
    lockKey = userId ? `upg:lock:${userId}` : `upg:lock:anon-${hashIp(anonIp)}`;

    const lockAcquired = await acquireLock(lockKey, 300); // 5 minutes TTL
    if (!lockAcquired) {
      return respErr('A generation is already in progress. Please wait.');
    }

    // 6. Call generateCore (AI generation + sanitize + quality check + moderation + store)
    const result = await generateCore({
      prompt,
      language,
      userId,
      discipline,
    });

    if (result.status === 'failed') {
      return respErr(result.errorMessage || 'Generation failed');
    }

    // 7. Success: consume credits + increment quota
    let creditId: string | null = null;
    let creditsConsumed = false;

    try {
      if (userId) {
        const creditResult = await consumeCredits({
          userId,
          credits: creditsToConsume,
          scene: isRegenerate ? 'upg-regenerate' : 'upg-generate',
          description: `UPG ${isRegenerate ? 'regeneration' : 'generation'}: ${prompt.slice(0, 50)}`,
        });
        creditId = creditResult?.id ?? null;
        creditsConsumed = true;

        await incrementDailyQuota(userId, todayStr);
      }

      return respData({
        id: result.id,
        status: result.status,
        htmlContent: result.htmlContent,
      });
    } catch (dbError: unknown) {
      // If database operations fail after credits consumed, refund them
      if (creditsConsumed && userId && creditId) {
        try {
          const errMsg = dbError instanceof Error ? dbError.message : 'Unknown error';
          await refundCredits({
            userId,
            credits: creditsToConsume,
            scene: 'upg-refund',
            description: `Refund due to post-generation failure: ${errMsg.slice(0, 100)}`,
            relatedCreditId: creditId,
          });
        } catch (refundError: unknown) {
          console.error('Failed to refund credits:', refundError);
        }
      }
      throw dbError;
    }
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : 'Generation failed';
    console.error('UPG generate failed:', e);
    return respErr(errMsg);
  } finally {
    if (lockKey) {
      await releaseLock(lockKey);
    }
  }
}
